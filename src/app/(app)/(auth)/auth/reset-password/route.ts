import type { NextRequest } from 'next/server'
import { hitRateLimit } from '@/lib/rate-limit'
import { isSameOrigin } from '@/lib/same-origin'
import { getUser } from '@/server/auth'
import { backTo, field, passwordProblem, readForm } from '@/server/auth/http'
import { dbRateLimitStore } from '@/server/rate-limit-store'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

// Sets a new password. Needs a session: the recovery link (/auth/callback or /auth/confirm) signs the user in first.
// Supabase revokes the user's other sessions' refresh tokens on password change.
export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  const user = await getUser()
  if (!user || user.dev) return backTo('/forgot-password', { error: 'expired' })
  const form = await readForm(request)
  if (!form) return backTo('/reset-password', { error: 'invalid' })
  const password = field(form, 'password')
  if (passwordProblem(password)) return backTo('/reset-password', { error: 'weak' })
  if (password !== field(form, 'confirm')) return backTo('/reset-password', { error: 'mismatch' })
  const limit = await hitRateLimit(dbRateLimitStore, `password:user:${user.id}`, { limit: 5, windowMs: 60 * 60_000 })
  if (!limit.allowed) return backTo('/reset-password', { error: 'rate' })
  const supabase = await createSupabaseServerClient()
  if (!supabase) return backTo('/reset-password', { error: 'setup' })
  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    console.warn('[auth] password update failed', { code: error.code })
    return backTo('/reset-password', { error: error.code === 'same_password' ? 'same' : error.code === 'weak_password' ? 'weak' : 'invalid' })
  }
  return backTo('/', { password: 'changed' })
}

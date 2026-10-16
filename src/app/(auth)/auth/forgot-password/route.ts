import type { NextRequest } from 'next/server'
import { isSameOrigin } from '@/lib/same-origin'
import { backTo, emailLimit, field, limited, normalizeEmail, readForm, siteOrigin } from '@/server/auth/http'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

const PER_IP = { limit: 10, windowMs: 60 * 60_000 }
const PER_ACCOUNT = { limit: 3, windowMs: 60 * 60_000 }

// Sends a password-reset email. Same answer for known and unknown addresses.
export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  const form = await readForm(request)
  const email = form ? normalizeEmail(field(form, 'email', 320)) : null
  if (!email) return backTo('/forgot-password', { error: 'email' })
  const gate = await limited(request, 'reset', PER_IP, [await emailLimit('reset', email, PER_ACCOUNT)])
  if (gate !== 'ok') return backTo('/forgot-password', { error: gate })
  const supabase = await createSupabaseServerClient()
  if (!supabase) return backTo('/forgot-password', { error: 'setup' })
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteOrigin(request)}/auth/callback?next=/reset-password` })
  if (error) console.warn('[auth] reset email failed', { code: error.code })
  return backTo('/forgot-password', { sent: '1' })
}

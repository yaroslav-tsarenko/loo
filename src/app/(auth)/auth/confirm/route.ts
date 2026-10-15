import type { EmailOtpType } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { afterSignIn, backTo, nextPath, seeOther } from '@/server/auth/http'
import { userFromAuthUser } from '@/server/auth/session'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

const TYPES = new Set<EmailOtpType>(['signup', 'email', 'recovery', 'email_change', 'invite', 'magiclink'])

// Email links with token_hash (recommended templates, see docs/AUTH.md): work in any browser, no PKCE cookie needed.
//   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
//   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery
export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams
  const tokenHash = params.get('token_hash')
  const type = params.get('type') as EmailOtpType | null
  if (!tokenHash || tokenHash.length > 512 || !type || !TYPES.has(type)) return backTo('/login', { error: 'callback' })
  const supabase = await createSupabaseServerClient()
  if (!supabase) return backTo('/login', { error: 'setup' })
  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
  if (error || !data.user) {
    console.warn('[auth] otp verification failed', { type, code: error?.code })
    return backTo(type === 'recovery' ? '/forgot-password' : '/login', { error: 'expired' })
  }
  if (type === 'recovery') return seeOther('/reset-password')
  return seeOther(await afterSignIn(userFromAuthUser(data.user), Boolean(data.user.email_confirmed_at), nextPath(params.get('next'))))
}

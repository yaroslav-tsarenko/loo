import type { NextRequest } from 'next/server'
import { afterSignIn, backTo, nextPath, seeOther } from '@/server/auth/http'
import { userFromAuthUser } from '@/server/auth/session'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

// PKCE code exchange: OAuth (Google, GitHub), and email links that use Supabase's default templates
// (sign-up confirmation, password recovery). Needs the code-verifier cookie set by the same browser.
export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams
  const rawNext = params.get('next')
  const next = nextPath(rawNext)
  const code = params.get('code')
  if (!code || code.length > 512) {
    if (params.get('error')) console.warn('[auth] callback error', { error: params.get('error'), code: params.get('error_code') })
    return backTo('/login', { error: 'callback' })
  }
  const supabase = await createSupabaseServerClient()
  if (!supabase) return backTo('/login', { error: 'setup' })
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.user) {
    console.warn('[auth] code exchange failed', { code: error?.code })
    return backTo('/login', { error: 'callback' })
  }
  // A recovery link goes straight to the new-password form (the profile exists already).
  if (rawNext === '/reset-password') return seeOther('/reset-password')
  return seeOther(await afterSignIn(userFromAuthUser(data.user), Boolean(data.user.email_confirmed_at), next))
}

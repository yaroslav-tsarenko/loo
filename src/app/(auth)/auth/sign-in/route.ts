import type { NextRequest } from 'next/server'
import { isSameOrigin } from '@/lib/same-origin'
import { afterSignIn, backTo, emailLimit, failureDelay, field, limited, nextPath, normalizeEmail, readForm, seeOther } from '@/server/auth/http'
import { userFromAuthUser } from '@/server/auth/session'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

const PER_IP = { limit: 10, windowMs: 15 * 60_000 }
const PER_ACCOUNT = { limit: 5, windowMs: 15 * 60_000 }
const GLOBAL = { limit: 300, windowMs: 60 * 60_000 }

// Email + password sign-in (plain form post from /login).
export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  const form = await readForm(request)
  if (!form) return backTo('/login', { error: 'invalid' })
  const next = nextPath(field(form, 'next', 2048))
  const email = normalizeEmail(field(form, 'email', 320))
  const password = field(form, 'password')
  if (!email || !password) return backTo('/login', { error: 'invalid', next })

  if (await limited(request, 'signin', PER_IP, [await emailLimit('signin', email, PER_ACCOUNT), { key: 'signin:global', rule: GLOBAL }])) {
    return backTo('/login', { error: 'rate', next })
  }
  const supabase = await createSupabaseServerClient()
  if (!supabase) return backTo('/login', { error: 'setup' })

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    await failureDelay()
    // Only reachable with the right password, so it doesn't reveal whether an address is registered.
    const unconfirmed = error?.code === 'email_not_confirmed'
    console.warn('[auth] sign-in failed', { code: error?.code ?? 'no-user' })
    return backTo('/login', { error: unconfirmed ? 'unconfirmed' : 'invalid', next })
  }
  return seeOther(await afterSignIn(userFromAuthUser(data.user), Boolean(data.user.email_confirmed_at), next))
}

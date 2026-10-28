import type { NextRequest } from 'next/server'
import { isSameOrigin } from '@/lib/same-origin'
import { afterSignIn, backTo, emailLimit, failureDelay, failuresBlocked, field, nextPath, recordFailure, normalizeEmail, readForm, seeOther } from '@/server/auth/http'
import { userFromAuthUser } from '@/server/auth/session'
import { createSupabaseServerClient } from '@/server/supabase'
import { ADMIN_COOKIE, ADMIN_TTL_S, adminSecret, signAdminToken } from '@/lib/admin-token'
import { adminLogin } from '@/server/admin/credentials'

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

  const extra = [await emailLimit('signin', email, PER_ACCOUNT), { key: 'signin:global', rule: GLOBAL }]
  const gate = await failuresBlocked(request, 'signin', PER_IP, extra)
  if (gate !== 'ok') return backTo('/login', { error: gate, next })

  // The owner's admin login (docs/ANALYTICS.md): same form, same rate limits; opens /admin only, not a learner account.
  const admin = await adminLogin(email, password)
  if (admin === 'ok') {
    const res = seeOther('/admin')
    res.cookies.set(ADMIN_COOKIE, await signAdminToken(adminSecret()!, Date.now()), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: ADMIN_TTL_S })
    return res
  }
  if (admin === 'bad') {
    await recordFailure(request, 'signin', PER_IP, extra)
    await failureDelay()
    console.warn('[auth] admin sign-in failed')
    return backTo('/login', { error: 'invalid', next })
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) return backTo('/login', { error: 'setup' })

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    await recordFailure(request, 'signin', PER_IP, extra)
    await failureDelay()
    // Only reachable with the right password, so it doesn't reveal whether an address is registered.
    const unconfirmed = error?.code === 'email_not_confirmed'
    console.warn('[auth] sign-in failed', { code: error?.code ?? 'no-user' })
    return backTo('/login', { error: unconfirmed ? 'unconfirmed' : 'invalid', next })
  }
  return seeOther(await afterSignIn(userFromAuthUser(data.user), Boolean(data.user.email_confirmed_at), next))
}

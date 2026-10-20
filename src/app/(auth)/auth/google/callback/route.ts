import { timingSafeEqual } from 'node:crypto'
import type { NextRequest, NextResponse } from 'next/server'
import { afterSignIn, backTo, limited, seeOther, siteOrigin } from '@/server/auth/http'
import { decodeFlow, exchangeCode, GOOGLE_CALLBACK, GOOGLE_COOKIE, googleClient } from '@/server/auth/google'
import { userFromAuthUser } from '@/server/auth/session'
import { createSupabaseServerClient } from '@/server/supabase'

export const dynamic = 'force-dynamic'

const PER_IP = { limit: 20, windowMs: 15 * 60_000 }

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

// Google redirects here (src/server/auth/google.ts): check state against the flow cookie, swap the code for an ID
// token, sign in to Supabase with it. The flow cookie is single-use: cleared on every outcome.
export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams
  const flow = decodeFlow(request.cookies.get(GOOGLE_COOKIE)?.value)
  const done = (response: NextResponse) => {
    response.cookies.set(GOOGLE_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: GOOGLE_CALLBACK, maxAge: 0 })
    return response
  }
  const next = flow?.next ?? '/'
  if (params.get('error')) return done(backTo('/login', { next, ...(params.get('error') === 'access_denied' ? {} : { error: 'callback' }) }))
  const code = params.get('code')
  const state = params.get('state')
  const client = googleClient()
  if (!flow || !code || code.length > 1024 || !state || !same(state, flow.state) || !client) return done(backTo('/login', { error: 'callback', next }))
  const gate = await limited(request, 'oauth', PER_IP)
  if (gate !== 'ok') return done(backTo('/login', { error: gate, next }))
  const idToken = await exchangeCode(code, flow, client, siteOrigin(request))
  const supabase = await createSupabaseServerClient()
  if (!idToken || !supabase) return done(backTo('/login', { error: idToken ? 'setup' : 'callback', next }))
  const { data, error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken, nonce: flow.nonce })
  if (error || !data.user) {
    console.warn('[auth] google id-token sign-in failed', { code: error?.code })
    return done(backTo('/login', { error: 'callback', next }))
  }
  return done(seeOther(await afterSignIn(userFromAuthUser(data.user), Boolean(data.user.email_confirmed_at), next)))
}

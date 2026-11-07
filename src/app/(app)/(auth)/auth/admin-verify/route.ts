import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, ADMIN_PENDING_COOKIE, ADMIN_TTL_S, adminSecret, signAdminToken, verifyAdminPending } from '@/lib/admin-token'
import { isSameOrigin } from '@/lib/same-origin'
import { totpStep } from '@/lib/totp'
import { adminEpoch, claimTotpStep } from '@/server/admin/session'
import { backTo, failureDelay, failuresBlocked, field, readForm, recordFailure, seeOther } from '@/server/auth/http'

export const dynamic = 'force-dynamic'

// The admin login's second step (ADMIN_TOTP_SECRET set): the password was right (a 5-minute pending cookie from
// /auth/sign-in), now the 6-digit code from the authenticator app. A code is accepted once; failures count against
// the same per-IP limits as passwords.
const PER_IP = { limit: 10, windowMs: 15 * 60_000 }
const GLOBAL = { limit: 30, windowMs: 15 * 60_000 }

export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  const secret = adminSecret()
  const totp = process.env.ADMIN_TOTP_SECRET
  const jar = await cookies()
  if (!secret || !totp || !(await verifyAdminPending(secret, jar.get(ADMIN_PENDING_COOKIE)?.value, Date.now()))) return backTo('/login', { error: 'expired' })
  const extra = [{ key: 'admin-totp:global', rule: GLOBAL }]
  const gate = await failuresBlocked(request, 'admin-totp', PER_IP, extra)
  if (gate !== 'ok') return backTo('/admin-verify', { error: gate })
  const form = await readForm(request)
  const code = form ? field(form, 'code', 12).replace(/\s/g, '') : ''
  const step = totpStep(totp, code, Date.now())
  if (step === null || !(await claimTotpStep(step))) {
    await recordFailure(request, 'admin-totp', PER_IP, extra)
    await failureDelay()
    console.warn('[auth] admin code refused')
    return backTo('/admin-verify', { error: 'invalid' })
  }
  const cookie = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' }
  const res = seeOther('/admin')
  res.cookies.set(ADMIN_COOKIE, await signAdminToken(secret, Date.now(), await adminEpoch()), { ...cookie, maxAge: ADMIN_TTL_S })
  res.cookies.set(ADMIN_PENDING_COOKIE, '', { ...cookie, maxAge: 0 })
  return res
}

import { NextResponse, type NextRequest } from 'next/server'
import { authMode, createSessionToken, passwordMatches, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth'
import { clientIp, hitAll, type RateLimitRule } from '@/lib/rate-limit'
import { safeRedirectPath } from '@/lib/redirect'
import { isHttps, isSameOrigin } from '@/lib/same-origin'
import { dbRateLimitStore } from '@/server/rate-limit-store'

export const dynamic = 'force-dynamic'

// Per IP, plus a global ceiling so a botnet can't parallelize guesses. The global rule can lock the
// owner out of *new* logins for a window during an attack; existing sessions keep working.
const PER_IP: RateLimitRule = { limit: 10, windowMs: 15 * 60_000 }
const GLOBAL: RateLimitRule = { limit: 100, windowMs: 60 * 60_000 }
const MAX_BODY_BYTES = 4096

// Relative Location: stays on whatever host the browser used (request.url can be normalized to localhost).
function seeOther(location: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store' } })
}

function back(params: Record<string, string>): NextResponse {
  const query = new URLSearchParams(params).toString()
  return seeOther(query ? `/login?${query}` : '/login')
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new NextResponse('Forbidden', { status: 403 })
  if (authMode() !== 'password') return back({})
  const length = Number(request.headers.get('content-length') ?? '0')
  if (!Number.isFinite(length) || length > MAX_BODY_BYTES) return new NextResponse('Payload too large', { status: 413 })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return back({ error: '1' })
  }
  const next = safeRedirectPath(form.get('next'))
  const password = form.get('password')

  let limit
  try {
    limit = await hitAll(dbRateLimitStore, [
      { key: `login:ip:${clientIp(request.headers)}`, rule: PER_IP },
      { key: 'login:global', rule: GLOBAL },
    ])
  } catch (error) {
    // Fail closed: without a working limiter there is no brute-force protection.
    console.error('[auth] rate limiter unavailable', error)
    return back({ error: 'rate', next })
  }
  if (!limit.allowed) {
    console.warn('[auth] login rate-limited', { retryAfterMs: limit.retryAfterMs })
    return back({ error: 'rate', next })
  }

  if (typeof password !== 'string' || !(await passwordMatches(password))) {
    // Flat delay on failure: slows serial guessing and evens out timing.
    await new Promise((r) => setTimeout(r, 600))
    console.warn('[auth] failed login', { ip: clientIp(request.headers) })
    return back({ error: '1', next })
  }

  const response = seeOther(next)
  response.cookies.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions(isHttps(request.nextUrl, request.headers)))
  return response
}

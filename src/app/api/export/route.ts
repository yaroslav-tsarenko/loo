import { hitRateLimit } from '@/lib/rate-limit'
import { apiUser } from '@/server/auth'
import { dbRateLimitStore } from '@/server/rate-limit-store'
import { exportUserData } from '@/server/services/account'

export const dynamic = 'force-dynamic'

const DAILY = { limit: 3, windowMs: 86_400_000 }

// Per-user data export (GDPR). Same-origin GET from the account page; proxy.ts already requires a session.
export async function GET(): Promise<Response> {
  const user = await apiUser()
  if (!user) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const limit = await hitRateLimit(dbRateLimitStore, `export:user:${user.id}`, DAILY)
  if (!limit.allowed) return new Response('Too many exports today', { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  const data = await exportUserData()
  const name = `loo-export-${new Date().toISOString().slice(0, 10)}.json`
  console.info('[account] data export', { userId: user.id })
  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="${name}"`, 'Cache-Control': 'no-store' },
  })
}

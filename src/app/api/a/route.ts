import { getDb } from '@/db/client'
import { analyticsEvents } from '@/db/schema'
import { hitRateLimit } from '@/lib/rate-limit'
import { isSameOrigin } from '@/lib/same-origin'
import { apiUser } from '@/server/auth'
import { BeaconSchema, isBot, parseAgent, placeOf, rowsOf } from '@/server/analytics/collect'
import { anonymizeIp } from '@/server/analytics/ip'
import { dbRateLimitStore } from '@/server/rate-limit-store'

export const dynamic = 'force-dynamic'

// First-party analytics collector (docs/ANALYTICS.md): the browser beacons batches of page views, clicks and time on
// page; the server adds the network token (never the IP — src/server/analytics/ip.ts), Vercel geo, device and the
// signed-in user, and writes them as the system (the table has no grants). Same-origin only, ≤ 30 events per beacon,
// ≤ 20 beacons a minute per network across all instances (a database counter: an in-memory one was per instance).

const BEACONS_PER_MINUTE = 20

const done = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response(null, { status: 403 })
  const ua = request.headers.get('user-agent') ?? ''
  if (isBot(ua)) return done()
  const text = await request.text()
  if (text.length > 32_000) return new Response(null, { status: 413 })
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return new Response(null, { status: 400 })
  }
  const parsed = BeaconSchema.safeParse(json)
  if (!parsed.success) return new Response(null, { status: 400 })
  const now = Date.now()
  const raw = placeOf(request.headers)
  const place = { ...raw, ip: anonymizeIp(raw.ip) }
  const limit = await hitRateLimit(dbRateLimitStore, `beacon:${place.ip ?? 'unknown'}`, { limit: BEACONS_PER_MINUTE, windowMs: 60_000 }, now).catch(() => ({ allowed: true }))
  if (!limit.allowed) return new Response(null, { status: 429 })
  const user = await apiUser().catch(() => null)
  const rows = rowsOf(parsed.data, { now, userId: user?.id ?? null, place, agent: parseAgent(ua) })
  if (rows.length === 0) return done()
  try {
    // cross-user: the collector writes visitors' events as the system (server-only table, no user grants)
    await getDb().insert(analyticsEvents).values(rows)
  } catch {
    // a brand-new account whose profile row isn't there yet (user_id FK): keep the events, anonymously
    // cross-user: same system write, anonymised
    if (rows[0]!.userId) await getDb().insert(analyticsEvents).values(rows.map((r) => ({ ...r, userId: null }))).catch(() => {})
  }
  return done()
}

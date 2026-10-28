import { getDb } from '@/db/client'
import { analyticsEvents } from '@/db/schema'
import { isSameOrigin } from '@/lib/same-origin'
import { apiUser } from '@/server/auth'
import { BeaconSchema, isBot, parseAgent, placeOf, rowsOf } from '@/server/analytics/collect'

export const dynamic = 'force-dynamic'

// First-party analytics collector (docs/ANALYTICS.md): the browser beacons batches of page views, clicks and time on
// page; the server adds IP, Vercel geo, device and the signed-in user, and writes them as the system (the table has
// no grants). Same-origin only, ≤ 30 events per beacon, ≤ 240 events a minute per IP per instance.

const WINDOW_MS = 60_000
const PER_IP = 240
const seen = new Map<string, { n: number; until: number }>()

function allowed(ip: string, events: number, now: number): boolean {
  const slot = seen.get(ip)
  if (!slot || slot.until < now) {
    if (seen.size > 5_000) seen.clear()
    seen.set(ip, { n: events, until: now + WINDOW_MS })
    return true
  }
  slot.n += events
  return slot.n <= PER_IP
}

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
  const place = placeOf(request.headers)
  if (!allowed(place.ip ?? 'unknown', parsed.data.e.length, now)) return new Response(null, { status: 429 })
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

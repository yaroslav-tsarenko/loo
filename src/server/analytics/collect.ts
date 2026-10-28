import { z } from 'zod'
import type { AnalyticsTarget } from '@/db/schema'

// First-party analytics (docs/ANALYTICS.md): what the browser beacon may send, and what the server adds to it.
// Pure — the route (/api/a) does the I/O.

const id = z.string().regex(/^[A-Za-z0-9_-]{8,64}$/)
const short = (n: number) => z.string().max(n).optional()

const TargetSchema = z
  .object({
    label: short(80),
    href: short(300),
    tag: short(20),
    track: short(60),
    x: z.number().min(0).max(100).optional(),
    y: z.number().min(0).max(100).optional(),
    pageY: z.number().int().min(0).max(1_000_000).optional(),
  })
  .strict()

const EventSchema = z
  .object({
    t: z.enum(['pageview', 'click', 'leave']),
    p: z.string().min(1).max(512),
    at: z.number().int().optional(),
    ti: short(200),
    r: short(512),
    u: z.record(z.string().max(30), z.string().max(120)).optional(),
    tg: TargetSchema.optional(),
    d: z.number().int().min(0).max(24 * 3_600_000).optional(),
  })
  .strict()

export const BeaconSchema = z
  .object({
    v: id,
    s: id,
    sc: short(20),
    l: short(20),
    e: z.array(EventSchema).min(1).max(30),
  })
  .strict()

export type Beacon = z.infer<typeof BeaconSchema>

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|monitor|curl|wget|python-requests|axios|node-fetch|go-http/i
export const isBot = (ua: string): boolean => ua === '' || BOT.test(ua)

export interface Agent {
  device: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
}

export function parseAgent(ua: string): Agent {
  const device = /ipad|tablet|kindle|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua)) ? 'tablet' : /mobi|iphone|ipod|android/i.test(ua) ? 'mobile' : 'desktop'
  const browser = /edg\//i.test(ua)
    ? 'Edge'
    : /opr\/|opera/i.test(ua)
      ? 'Opera'
      : /samsungbrowser/i.test(ua)
        ? 'Samsung Internet'
        : /firefox|fxios/i.test(ua)
          ? 'Firefox'
          : /chrome|crios/i.test(ua)
            ? 'Chrome'
            : /safari/i.test(ua)
              ? 'Safari'
              : 'Other'
  const os = /iphone|ipad|ipod/i.test(ua) ? 'iOS' : /android/i.test(ua) ? 'Android' : /windows/i.test(ua) ? 'Windows' : /mac os x|macintosh/i.test(ua) ? 'macOS' : /linux/i.test(ua) ? 'Linux' : 'Other'
  return { device, browser, os }
}

export interface Place {
  ip: string | null
  country: string | null
  region: string | null
  city: string | null
}

const decode = (v: string | null): string | null => {
  if (!v) return null
  try {
    return decodeURIComponent(v).slice(0, 80)
  } catch {
    return v.slice(0, 80)
  }
}

// Vercel sets x-forwarded-for / x-real-ip and the x-vercel-ip-* geo headers on every request.
export function placeOf(headers: Headers): Place {
  const ip = (headers.get('x-forwarded-for')?.split(',')[0] ?? headers.get('x-real-ip') ?? '').trim().slice(0, 64) || null
  return { ip, country: decode(headers.get('x-vercel-ip-country')), region: decode(headers.get('x-vercel-ip-country-region')), city: decode(headers.get('x-vercel-ip-city')) }
}

// Calendar day in Kyiv, YYYY-MM-DD.
const KYIV = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv', year: 'numeric', month: '2-digit', day: '2-digit' })
export const kyivDay = (at: number): string => KYIV.format(at)

// Same-site paths only (a beacon can't be pointed at other sites' URLs to fill the table with junk).
export const cleanPath = (p: string): string | null => (p.startsWith('/') && !p.startsWith('//') ? p.slice(0, 512) : null)

export interface EventRow {
  at: number
  day: string
  type: string
  path: string
  title: string | null
  referrer: string | null
  utm: Record<string, string> | null
  visitorId: string
  sessionId: string
  userId: string | null
  ip: string | null
  country: string | null
  region: string | null
  city: string | null
  device: string
  browser: string
  os: string
  screen: string | null
  lang: string | null
  target: AnalyticsTarget | null
  durationMs: number | null
}

export function rowsOf(beacon: Beacon, ctx: { now: number; userId: string | null; place: Place; agent: Agent }): EventRow[] {
  const rows: EventRow[] = []
  for (const e of beacon.e) {
    const path = cleanPath(e.p)
    if (!path) continue
    // the client clock only orders events inside a batch: never trusted beyond ±10 min of the server's
    const at = e.at && Math.abs(e.at - ctx.now) < 10 * 60_000 ? e.at : ctx.now
    rows.push({
      at,
      day: kyivDay(at),
      type: e.t,
      path,
      title: e.ti ?? null,
      referrer: e.r ?? null,
      utm: e.u && Object.keys(e.u).length > 0 ? Object.fromEntries(Object.entries(e.u).slice(0, 6)) : null,
      visitorId: beacon.v,
      sessionId: beacon.s,
      userId: ctx.userId,
      ...ctx.place,
      ...ctx.agent,
      screen: beacon.sc ?? null,
      lang: beacon.l ?? null,
      target: e.tg ?? null,
      durationMs: e.d ?? null,
    })
  }
  return rows
}

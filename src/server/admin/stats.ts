import 'server-only'
import { sql, type SQL } from 'drizzle-orm'
import { getDb } from '@/db/client'

// Site statistics for /admin (docs/ANALYTICS.md). Read as the system (analytics_events has no grants), aggregated in
// Postgres; only the admin area calls this.

type Row = Record<string, unknown>

async function rows<T extends Row>(q: SQL): Promise<T[]> {
  return (await getDb().execute(q)) as unknown as T[]
}

const num = (v: unknown): number => Number(v ?? 0)
const str = (v: unknown): string => (v === null || v === undefined ? '' : String(v))

export interface Count {
  key: string
  sub?: string
  views: number
  visitors: number
}

export interface RecentEvent {
  at: number
  type: string
  path: string
  label: string
  href: string
  country: string
  city: string
  ip: string
  device: string
  browser: string
  os: string
  user: string
  visitor: string
  durationMs: number | null
}

export interface AdminStats {
  days: number
  kpi: { views: number; visitors: number; sessions: number; clicks: number; signedIn: number; avgSeconds: number; users: number; newUsers: number }
  daily: Array<{ day: string; views: number; visitors: number }>
  pages: Count[]
  blog: Count[]
  referrers: Count[]
  countries: Count[]
  cities: Count[]
  devices: Count[]
  browsers: Count[]
  systems: Count[]
  clicks: Array<{ label: string; href: string; page: string; clicks: number }>
  recent: RecentEvent[]
  people: Array<{ name: string; role: string; joined: number; lastSeen: number | null; views: number }>
}

const counts = (list: Row[]): Count[] => list.map((r) => ({ key: str(r.key) || '—', sub: r.sub ? str(r.sub) : undefined, views: num(r.views), visitors: num(r.visitors) }))

export async function adminStats(days: number, now = Date.now()): Promise<AdminStats> {
  const since = now - days * 86_400_000
  const page = sql`split_part(path, '?', 1)`
  const viewsIn = sql`type = 'pageview' and at >= ${since}`
  const top = (key: SQL, where: SQL, limit = 15) =>
    rows(sql`select ${key} as key, count(*) as views, count(distinct visitor_id) as visitors from analytics_events where ${where} group by 1 order by 3 desc, 2 desc limit ${limit}`)

  const [kpi, users, daily, pages, blog, referrers, countries, cities, devices, browsers, systems, clicks, recent, people] = await Promise.all([
    rows(sql`select count(*) filter (where type = 'pageview') as views, count(distinct visitor_id) as visitors, count(distinct session_id) as sessions,
      count(*) filter (where type = 'click') as clicks, count(distinct user_id) as signed_in,
      coalesce(avg(duration_ms) filter (where type = 'leave' and duration_ms between 1000 and 1800000), 0) as avg_ms
      from analytics_events where at >= ${since}`),
    rows(sql`select count(*) as users, count(*) filter (where created_at >= ${since}) as new_users from profiles`),
    rows(sql`select day, count(*) filter (where type = 'pageview') as views, count(distinct visitor_id) as visitors from analytics_events where at >= ${since} group by day order by day`),
    top(page, viewsIn, 20),
    top(page, sql`${viewsIn} and path like '/blog/%'`, 20),
    top(sql`split_part(referrer, '/', 1)`, sql`${viewsIn} and referrer is not null`),
    top(sql`coalesce(country, '—')`, sql`at >= ${since}`),
    rows(sql`select coalesce(city, '—') as key, coalesce(country, '') as sub, count(*) as views, count(distinct visitor_id) as visitors from analytics_events where at >= ${since} group by 1, 2 order by 4 desc limit 15`),
    top(sql`coalesce(device, '—')`, sql`at >= ${since}`, 5),
    top(sql`coalesce(browser, '—')`, sql`at >= ${since}`, 8),
    top(sql`coalesce(os, '—')`, sql`at >= ${since}`, 8),
    rows(sql`select coalesce(target->>'label', '') as label, coalesce(target->>'href', '') as href, ${page} as page, count(*) as clicks
      from analytics_events where type = 'click' and at >= ${since} group by 1, 2, 3 order by 4 desc limit 25`),
    rows(sql`select e.at, e.type, e.path, coalesce(e.target->>'label', '') as label, coalesce(e.target->>'href', '') as href, e.country, e.city, e.ip,
      e.device, e.browser, e.os, coalesce(p.display_name, case when e.user_id is null then '' else 'учень' end) as name, e.visitor_id, e.duration_ms
      from analytics_events e left join profiles p on p.id = e.user_id order by e.at desc limit 100`),
    rows(sql`select coalesce(p.display_name, 'без імені') as name, p.role, p.created_at as joined, max(e.at) as last_seen, count(e.*) filter (where e.type = 'pageview') as views
      from profiles p left join analytics_events e on e.user_id = p.id group by p.id order by p.created_at desc limit 30`),
  ])

  const k = kpi[0] ?? {}
  const u = users[0] ?? {}
  return {
    days,
    kpi: {
      views: num(k.views),
      visitors: num(k.visitors),
      sessions: num(k.sessions),
      clicks: num(k.clicks),
      signedIn: num(k.signed_in),
      avgSeconds: Math.round(num(k.avg_ms) / 1000),
      users: num(u.users),
      newUsers: num(u.new_users),
    },
    daily: daily.map((r) => ({ day: str(r.day), views: num(r.views), visitors: num(r.visitors) })),
    pages: counts(pages),
    blog: counts(blog),
    referrers: counts(referrers),
    countries: counts(countries),
    cities: counts(cities),
    devices: counts(devices),
    browsers: counts(browsers),
    systems: counts(systems),
    clicks: clicks.map((r) => ({ label: str(r.label), href: str(r.href), page: str(r.page), clicks: num(r.clicks) })),
    recent: recent.map((r) => ({
      at: num(r.at),
      type: str(r.type),
      path: str(r.path),
      label: str(r.label),
      href: str(r.href),
      country: str(r.country),
      city: str(r.city),
      ip: str(r.ip),
      device: str(r.device),
      browser: str(r.browser),
      os: str(r.os),
      user: str(r.name),
      visitor: str(r.visitor_id).slice(0, 8),
      durationMs: r.duration_ms === null || r.duration_ms === undefined ? null : num(r.duration_ms),
    })),
    people: people.map((r) => ({ name: str(r.name), role: str(r.role), joined: num(r.joined), lastSeen: r.last_seen ? num(r.last_seen) : null, views: num(r.views) })),
  }
}

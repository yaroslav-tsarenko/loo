import postgres from 'postgres'
import { kyivDay } from '../src/server/analytics/collect'

// Fake but realistic analytics_events for the LOCAL database only — to see /admin charts and breakdowns with data.
//   tsx --env-file-if-exists=.env.local scripts/seed-analytics.ts [--days 90] [--per-day 140]
//   tsx --env-file-if-exists=.env.local scripts/seed-analytics.ts --clear      # remove the seeded rows
// Seeded rows have visitor ids starting with `seed` (that's what --clear deletes). Refuses any non-local DATABASE_URL.

const url = process.env.DATABASE_URL ?? ''
const host = (() => {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
})()
if (!['localhost', '127.0.0.1', '[::1]', '::1'].includes(host)) {
  console.error(`seed-analytics: DATABASE_URL must point at localhost (got «${host || 'nothing'}») — refusing to touch a remote database.`)
  process.exit(1)
}

const arg = (name: string, fallback: number): number => {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? Number(process.argv[i + 1]) || fallback : fallback
}
const DAYS = arg('days', 90)
const PER_DAY = arg('per-day', 140)
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} })

if (process.argv.includes('--clear')) {
  const r = await sql`delete from analytics_events where visitor_id like 'seed%'`
  console.log(`seed-analytics: removed ${r.count} seeded events`)
  await sql.end()
  process.exit(0)
}

// deterministic randomness (mulberry32), so reruns look alike
let seed = 20261028
const rand = (): number => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const pick = <T>(list: ReadonlyArray<readonly [T, number]>): T => {
  const total = list.reduce((s, [, w]) => s + w, 0)
  let r = rand() * total
  for (const [v, w] of list) if ((r -= w) <= 0) return v
  return list[0]![0]
}
const id = (n = 16): string => Array.from({ length: n }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(rand() * 62)]).join('')

const PLACES: ReadonlyArray<readonly [readonly [string, string], number]> = [
  [['UA', 'Kyiv'], 30],
  [['UA', 'Lviv'], 10],
  [['UA', 'Kharkiv'], 7],
  [['UA', 'Odesa'], 6],
  [['UA', 'Dnipro'], 6],
  [['UA', 'Vinnytsia'], 3],
  [['PL', 'Warsaw'], 6],
  [['PL', 'Krakow'], 3],
  [['DE', 'Berlin'], 4],
  [['DE', 'Munich'], 2],
  [['CZ', 'Prague'], 3],
  [['GB', 'London'], 3],
  [['US', 'New York'], 2],
  [['US', 'San Francisco'], 1],
  [['CA', 'Toronto'], 1],
  [['NL', 'Amsterdam'], 1],
  [['ES', 'Barcelona'], 1],
]
type Agent = { device: string; browser: string; os: string; screen: string }
const AGENTS: ReadonlyArray<readonly [Agent, number]> = [
  [{ device: 'mobile', browser: 'Chrome', os: 'Android', screen: '412x915' }, 30],
  [{ device: 'mobile', browser: 'Safari', os: 'iOS', screen: '390x844' }, 24],
  [{ device: 'mobile', browser: 'Samsung Internet', os: 'Android', screen: '384x854' }, 4],
  [{ device: 'desktop', browser: 'Chrome', os: 'Windows', screen: '1920x1080' }, 16],
  [{ device: 'desktop', browser: 'Chrome', os: 'macOS', screen: '1728x1117' }, 9],
  [{ device: 'desktop', browser: 'Safari', os: 'macOS', screen: '1440x900' }, 5],
  [{ device: 'desktop', browser: 'Firefox', os: 'Windows', screen: '1536x864' }, 3],
  [{ device: 'desktop', browser: 'Edge', os: 'Windows', screen: '1366x768' }, 3],
  [{ device: 'desktop', browser: 'Firefox', os: 'Linux', screen: '2560x1440' }, 2],
  [{ device: 'tablet', browser: 'Safari', os: 'iOS', screen: '820x1180' }, 3],
]
const LANGS: ReadonlyArray<readonly [string, number]> = [
  ['uk-UA', 58],
  ['uk', 8],
  ['en-US', 14],
  ['ru-UA', 6],
  ['pl-PL', 6],
  ['de-DE', 4],
  ['en-GB', 4],
]
const REFS: ReadonlyArray<readonly [string | null, number]> = [
  [null, 40],
  ['www.google.com/', 30],
  ['t.me/', 8],
  ['dou.ua/forums/topic/51234/', 5],
  ['www.instagram.com/', 4],
  ['l.facebook.com/', 3],
  ['www.linkedin.com/', 3],
  ['www.bing.com/', 2],
  ['duckduckgo.com/', 1],
  ['github.com/levelup', 1],
]
const UTMS: ReadonlyArray<readonly [Record<string, string>, number]> = [
  [{ utm_source: 'telegram', utm_medium: 'social', utm_campaign: 'ielts-oct' }, 4],
  [{ utm_source: 'instagram', utm_medium: 'social', utm_campaign: 'launch' }, 3],
  [{ utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'weekly-12' }, 2],
  [{ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'js-course' }, 2],
]
const BLOG = ['/blog/ielts-band-score', '/blog/js-closures', '/blog/english-a1-plan', '/blog/react-hooks', '/blog/sql-joins', '/blog/system-design-basics', '/blog/english-tenses', '/blog/git-rebase']
const ENTRY: ReadonlyArray<readonly [string, number]> = [
  ['/', 40],
  ...BLOG.map((p, i) => [p, 12 - i] as const),
  ['/blog', 6],
  ['/courses', 5],
  ['/learn/english', 4],
]
const NEXT: ReadonlyArray<readonly [string, number]> = [
  ['/blog', 10],
  ['/courses', 8],
  ['/learn/english', 6],
  ['/learn/javascript', 5],
  ['/login', 6],
  ['/pricing', 4],
  ['/', 5],
  ...BLOG.map((p) => [p, 3] as const),
]
const CLICKS: Record<string, Array<{ label: string; href?: string; tag: string }>> = {
  '/': [
    { label: 'Почати безкоштовно', href: '/login', tag: 'a' },
    { label: 'Курси', href: '/courses', tag: 'a' },
    { label: 'Блог', href: '/blog', tag: 'a' },
  ],
  '/blog': [
    { label: 'IELTS бали', href: '/blog/ielts-band-score', tag: 'a' },
    { label: 'Замикання в JS', href: '/blog/js-closures', tag: 'a' },
  ],
  '/courses': [
    { label: 'Англійська A1–C2', href: '/learn/english', tag: 'a' },
    { label: 'JavaScript', href: '/learn/javascript', tag: 'a' },
  ],
}
// visits by Kyiv hour (quiet at night, peaks at lunch and evening)
const HOURS = [1, 0.6, 0.4, 0.3, 0.3, 0.5, 1, 2, 3.5, 4.5, 5, 5.5, 5.5, 5, 4.6, 4.4, 4.5, 4.8, 5.2, 6, 6.4, 5.6, 4, 2.2].map((w, h) => [h, w] as const)

const users = (await sql<Array<{ id: string }>>`select id from profiles limit 20`).map((r) => r.id)
const now = Date.now()
const visitors: Array<{ id: string; place: readonly [string, string]; agent: Agent; lang: string; user: string | null }> = []
type Row = Record<string, unknown>
const rows: Row[] = []

for (let d = DAYS - 1; d >= 0; d--) {
  const dayStart = now - d * 86_400_000
  const weekday = new Date(dayStart).getUTCDay()
  const growth = 0.45 + 0.55 * ((DAYS - d) / DAYS)
  const weekly = weekday === 0 || weekday === 6 ? 0.75 : 1
  const sessions = Math.round(PER_DAY * growth * weekly * (0.8 + rand() * 0.4))
  for (let s = 0; s < sessions; s++) {
    const returning = visitors.length > 30 && rand() < 0.3
    const v = returning
      ? visitors[Math.floor(rand() * visitors.length)]!
      : { id: `seed${id(12)}`, place: pick(PLACES), agent: pick(AGENTS), lang: pick(LANGS), user: users.length > 0 && rand() < 0.08 ? users[Math.floor(rand() * users.length)]! : null }
    if (!returning) visitors.push(v)
    const hour = pick(HOURS)
    const midnight = new Date(dayStart)
    let at = Date.UTC(midnight.getUTCFullYear(), midnight.getUTCMonth(), midnight.getUTCDate(), hour - 2, Math.floor(rand() * 60), Math.floor(rand() * 60))
    if (at > now) continue
    const session = `seed${id(12)}`
    const ref = pick(REFS)
    const utm = rand() < 0.14 ? pick(UTMS) : null
    const pages = rand() < 0.42 ? 1 : 2 + Math.floor(rand() * rand() * 7)
    let path: string = pick(ENTRY)
    const common = { visitor_id: v.id, session_id: session, user_id: v.user, ip: `93.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`, country: v.place[0], region: null, city: v.place[1], ...v.agent, lang: v.lang }
    for (let i = 0; i < pages; i++) {
      rows.push({ ...common, at, day: kyivDay(at), type: 'pageview', path, title: path, referrer: i === 0 ? ref : null, utm: i === 0 ? utm : null, target: null, duration_ms: null })
      const stay = Math.round(Math.exp(2.5 + rand() * 2.8) * 1000)
      const options = CLICKS[path.split('?')[0]!]
      if (options && rand() < 0.5) {
        const c = options[Math.floor(rand() * options.length)]!
        rows.push({ ...common, at: at + Math.round(stay * 0.8), day: kyivDay(at), type: 'click', path, title: null, referrer: null, utm: null, target: { ...c, x: Math.round(rand() * 100), y: Math.round(rand() * 100) }, duration_ms: null })
      }
      at += stay
      if (at > now) break
      rows.push({ ...common, at, day: kyivDay(at), type: 'leave', path, title: null, referrer: null, utm: null, target: null, duration_ms: stay })
      path = pick(NEXT)
    }
  }
}

// postgres-js's bulk-insert helper (its overloads don't type a dynamic row list)
const columns = sql as unknown as (rows: object[], ...cols: string[]) => postgres.Helper<object[], string[]>
const COLS = ['at', 'day', 'type', 'path', 'title', 'referrer', 'utm', 'visitor_id', 'session_id', 'user_id', 'ip', 'country', 'region', 'city', 'device', 'browser', 'os', 'screen', 'lang', 'target', 'duration_ms'] as const
for (let i = 0; i < rows.length; i += 1000) {
  const chunk = rows.slice(i, i + 1000).map((r) => ({ ...r, utm: r.utm ? sql.json(r.utm as postgres.JSONValue) : null, target: r.target ? sql.json(r.target as postgres.JSONValue) : null }))
  await sql`insert into analytics_events ${columns(chunk, ...COLS)}`
}
// PGlite has no autovacuum: without fresh statistics the planner picks nested loops for the session filters
await sql`analyze analytics_events`
console.log(`seed-analytics: inserted ${rows.length} events (${visitors.length} visitors, ${DAYS} days) into ${host}`)
await sql.end()

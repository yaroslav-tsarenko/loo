import { sql, type SQL } from 'drizzle-orm'
import { z } from 'zod'

// Site analytics for /admin (docs/ANALYTICS.md): the query model parsed from the URL, the Kyiv-time period math and
// the SQL builders. Pure — no I/O (the runner is ./analytics.ts), so the unit tests can check every statement.
//
// Safety: user input only ever reaches SQL as a bound parameter (drizzle `sql` placeholders). Column expressions come
// from the fixed FILTERS / DIMS tables below, never from the URL.

export const TZ = 'Europe/Kyiv'
const DAY = 86_400_000
const HOUR = 3_600_000

// ── query model ───────────────────────────────────────────────────────────────────────────────────────────────

export const RANGES = ['today', '24h', '7d', '30d', '90d', 'month'] as const
export type RangeKey = (typeof RANGES)[number] | 'custom'
export const RANGE_LABEL: Record<RangeKey, string> = {
  today: 'Сьогодні',
  '24h': '24 год',
  '7d': '7 днів',
  '30d': '30 днів',
  '90d': '90 днів',
  month: 'Цей місяць',
  custom: 'Свій період',
}

export const METRICS = ['visitors', 'views', 'sessions', 'bounce', 'duration', 'clicks'] as const
export type Metric = (typeof METRICS)[number]

export type Gran = 'hour' | 'day'

// Filters: URL key → label and how it applies. `event` filters keep the matching events; `session` filters keep whole
// sessions that match somewhere (referrer and UTM are only recorded on a session's first page view).
export const FILTER_KEYS = ['path', 'ref', 'country', 'city', 'device', 'browser', 'os', 'lang', 'screen', 'utm_source', 'utm_medium', 'utm_campaign', 'user'] as const
export type FilterKey = (typeof FILTER_KEYS)[number]
export type Filters = Partial<Record<FilterKey, string>>

export const FILTER_LABEL: Record<FilterKey, string> = {
  path: 'Сторінка',
  ref: 'Джерело',
  country: 'Країна',
  city: 'Місто',
  device: 'Пристрій',
  browser: 'Браузер',
  os: 'ОС',
  lang: 'Мова',
  screen: 'Екран',
  utm_source: 'utm_source',
  utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign',
  user: 'Акаунт',
}

const PAGE = sql`split_part(path, '?', 1)`
const REF_HOST = sql`split_part(referrer, '/', 1)`

const FILTERS: Record<Exclude<FilterKey, 'path' | 'user'>, { scope: 'event' | 'session'; expr: SQL }> = {
  ref: { scope: 'session', expr: REF_HOST },
  country: { scope: 'event', expr: sql`country` },
  city: { scope: 'event', expr: sql`city` },
  device: { scope: 'event', expr: sql`device` },
  browser: { scope: 'event', expr: sql`browser` },
  os: { scope: 'event', expr: sql`os` },
  lang: { scope: 'event', expr: sql`lang` },
  screen: { scope: 'event', expr: sql`screen` },
  utm_source: { scope: 'session', expr: sql`utm->>'utm_source'` },
  utm_medium: { scope: 'session', expr: sql`utm->>'utm_medium'` },
  utm_campaign: { scope: 'session', expr: sql`utm->>'utm_campaign'` },
}

const DATE = /^\d{4}-\d{2}-\d{2}$/
const validDate = (s: string): boolean => DATE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s
const text = z.string().trim().min(1).max(200)
const optional = <T extends z.ZodType>(schema: T) => z.preprocess((v) => (Array.isArray(v) ? v[0] : v === '' ? undefined : v), schema.optional().catch(undefined))

export const QuerySchema = z.object({
  range: optional(z.enum([...RANGES, 'custom'])),
  from: optional(z.string().refine(validDate)),
  to: optional(z.string().refine(validDate)),
  gran: optional(z.enum(['hour', 'day'])),
  metric: optional(z.enum(METRICS)),
  cmp: optional(z.enum(['0', '1'])),
  before: optional(z.string().regex(/^\d{1,15}_\d{1,15}$/)),
  path: optional(text),
  ref: optional(text),
  country: optional(text),
  city: optional(text),
  device: optional(text),
  browser: optional(text),
  os: optional(text),
  lang: optional(text),
  screen: optional(text),
  utm_source: optional(text),
  utm_medium: optional(text),
  utm_campaign: optional(text),
  user: optional(z.enum(['in', 'guest'])),
})

export interface Query {
  range: RangeKey
  from?: string
  to?: string
  // the granularity asked for in the URL (undefined = auto)
  gran?: Gran
  metric: Metric
  compare: boolean
  filters: Filters
  before?: { at: number; id: number }
}

export type SearchParams = Record<string, string | string[] | undefined>

export function parseQuery(params: SearchParams, defaultRange: RangeKey = '7d'): Query {
  const p = QuerySchema.parse(params)
  const filters: Filters = {}
  for (const k of FILTER_KEYS) if (p[k]) filters[k] = p[k]
  let range: RangeKey = p.range ?? defaultRange
  let { from, to } = p
  if (range === 'custom' && (!from || !to)) range = defaultRange
  if (range !== 'custom') from = to = undefined
  else if (from! > to!) [from, to] = [to, from]
  const before = p.before ? { at: Number(p.before.split('_')[0]), id: Number(p.before.split('_')[1]) } : undefined
  return { range, from, to, gran: p.gran, metric: p.metric ?? 'visitors', compare: p.cmp !== '0', filters, before }
}

// Back to URL params (links keep the whole state; `patch` overrides, `null` drops a key).
export function queryParams(q: Query, patch: Record<string, string | null> = {}): URLSearchParams {
  const out = new URLSearchParams()
  const set = (k: string, v: string | undefined) => {
    if (v) out.set(k, v)
  }
  set('range', q.range)
  set('from', q.from)
  set('to', q.to)
  set('gran', q.gran)
  if (q.metric !== 'visitors') set('metric', q.metric)
  if (!q.compare) set('cmp', '0')
  for (const k of FILTER_KEYS) set(k, q.filters[k])
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) out.delete(k)
    else out.set(k, v)
  }
  return out
}

export function hrefOf(base: string, q: Query, patch: Record<string, string | null> = {}): string {
  const s = queryParams(q, { before: null, ...patch }).toString()
  return s ? `${base}?${s}` : base
}

// ── Kyiv time ─────────────────────────────────────────────────────────────────────────────────────────────────

const PARTS = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })

interface Wall {
  y: number
  m: number
  d: number
  h: number
}

export function kyivWall(ms: number): Wall & { min: number; s: number } {
  const parts = Object.fromEntries(PARTS.formatToParts(ms).map((p) => [p.type, p.value]))
  return { y: Number(parts.year), m: Number(parts.month), d: Number(parts.day), h: Number(parts.hour), min: Number(parts.minute), s: Number(parts.second) }
}

// UTC ms of a Kyiv wall-clock time (on a DST gap/overlap: the first matching instant).
export function kyivToUtc(w: Wall): number {
  const guess = Date.UTC(w.y, w.m - 1, w.d, w.h)
  let t = guess
  for (let i = 0; i < 2; i++) {
    const seen = kyivWall(t)
    t += guess - Date.UTC(seen.y, seen.m - 1, seen.d, seen.h, seen.min, seen.s)
  }
  return t
}

const pad = (n: number) => String(n).padStart(2, '0')
export const wallText = (w: Wall): string => `${w.y}-${pad(w.m)}-${pad(w.d)}T${pad(w.h)}:00`
const dayText = (w: Wall): string => `${w.y}-${pad(w.m)}-${pad(w.d)}`
// calendar arithmetic on a wall date (no time zone involved)
function addDays(w: Wall, days: number): Wall {
  const t = new Date(Date.UTC(w.y, w.m - 1, w.d + days, w.h))
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), h: t.getUTCHours() }
}
const wallOfDay = (s: string): Wall => ({ y: Number(s.slice(0, 4)), m: Number(s.slice(5, 7)), d: Number(s.slice(8, 10)), h: 0 })
export const kyivToday = (now: number): string => dayText(kyivWall(now))

export interface Span {
  start: number
  end: number
  // first and last bucket as Kyiv wall time 'YYYY-MM-DDTHH:00' (generate_series bounds)
  first: string
  last: string
}

export interface Period {
  range: RangeKey
  gran: Gran
  // granularity was chosen automatically
  auto: boolean
  cur: Span
  prev: Span
  // the previous period is the same span this many days earlier
  shiftDays: number
  label: string
}

const MAX_CUSTOM_DAYS = 400
const MAX_HOURLY_DAYS = 31

export function periodOf(q: Pick<Query, 'range' | 'from' | 'to' | 'gran'>, now: number): Period {
  const today = kyivWall(now)
  today.h = 0
  const nowHour = kyivWall(now)
  let startWall: Wall
  let endExclusive: number
  let days: number
  switch (q.range) {
    case '24h': {
      const start = now - 24 * HOUR
      const sw = kyivWall(start)
      return finish(q, now, { start, end: now + 1, firstWall: sw, lastWall: nowHour, days: 1, hourlyOnly: true })
    }
    case 'today':
      startWall = today
      days = 1
      endExclusive = now + 1
      break
    case 'month':
      startWall = { ...today, d: 1 }
      days = today.d
      endExclusive = now + 1
      break
    case 'custom': {
      const from = wallOfDay(q.from!)
      let to = wallOfDay(q.to!)
      days = Math.round((Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d)) / DAY) + 1
      if (days > MAX_CUSTOM_DAYS) {
        days = MAX_CUSTOM_DAYS
        to = addDays(from, days - 1)
      }
      startWall = from
      endExclusive = Math.min(kyivToUtc(addDays(to, 1)), now + 1)
      break
    }
    default: {
      days = q.range === '30d' ? 30 : q.range === '90d' ? 90 : 7
      startWall = addDays(today, -(days - 1))
      endExclusive = now + 1
    }
  }
  const start = kyivToUtc(startWall)
  const end = Math.max(start, endExclusive)
  return finish(q, now, { start, end, firstWall: startWall, lastWall: kyivWall(end - 1), days, hourlyOnly: false })
}

function finish(q: Pick<Query, 'range' | 'gran'>, now: number, s: { start: number; end: number; firstWall: Wall; lastWall: Wall; days: number; hourlyOnly: boolean }): Period {
  const span = (s.end - s.start) / DAY
  const auto = !q.gran
  let gran: Gran = q.gran ?? (span <= 2 ? 'hour' : 'day')
  if (gran === 'hour' && span > MAX_HOURLY_DAYS) gran = 'day'
  const trunc = (w: Wall): Wall => (gran === 'day' ? { ...w, h: 0 } : w)
  const first = trunc(s.firstWall)
  const last = trunc(s.end > s.start ? s.lastWall : s.firstWall)
  const shiftDays = s.days
  const prevFirst = addDays(first, -shiftDays)
  const prevLast = addDays(last, -shiftDays)
  const prevStart = s.hourlyOnly ? s.start - shiftDays * DAY : kyivToUtc(addDays(s.firstWall, -shiftDays))
  const prevEnd = Math.min(s.start, prevStart + (s.end - s.start))
  return {
    range: q.range as RangeKey,
    gran,
    auto,
    cur: { start: s.start, end: s.end, first: wallText(first), last: wallText(last) },
    prev: { start: prevStart, end: prevEnd, first: wallText(prevFirst), last: wallText(prevLast) },
    shiftDays,
    label: periodLabel(q.range as RangeKey, s.start, s.end, now),
  }
}

const SHORT = new Intl.DateTimeFormat('uk-UA', { timeZone: TZ, day: 'numeric', month: 'short' })
const SHORT_Y = new Intl.DateTimeFormat('uk-UA', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' })

function periodLabel(range: RangeKey, start: number, end: number, now: number): string {
  if (range !== 'custom') return RANGE_LABEL[range]
  const sameYear = kyivWall(start).y === kyivWall(now).y
  const f = sameYear ? SHORT : SHORT_Y
  const a = f.format(start)
  const b = f.format(end - 1)
  return a === b ? a : `${a} – ${b}`
}

// ── SQL builders ──────────────────────────────────────────────────────────────────────────────────────────────

// Escapes LIKE wildcards so a user's `%` or `_` match literally.
export const likePrefix = (s: string): string => `${s.replace(/[\\%_]/g, (c) => `\\${c}`)}%`

// The WHERE clause for the filters. `lo`/`hi` bound the session-scope sub-selects to the queried window.
export function filterSql(filters: Filters, lo: number, hi: number): SQL {
  const parts: SQL[] = []
  for (const key of FILTER_KEYS) {
    const value = filters[key]
    if (value === undefined) continue
    if (key === 'path') {
      parts.push(value.endsWith('*') ? sql`${PAGE} like ${likePrefix(value.slice(0, -1))}` : sql`${PAGE} = ${value}`)
    } else if (key === 'user') {
      parts.push(value === 'in' ? sql`user_id is not null` : sql`user_id is null`)
    } else {
      const f = FILTERS[key]
      parts.push(f.scope === 'event' ? sql`${f.expr} = ${value}` : sql`session_id in (select session_id from analytics_events where at >= ${lo} and at < ${hi} and ${f.expr} = ${value})`)
    }
  }
  return parts.length === 0 ? sql`true` : sql.join(parts, sql` and `)
}

// The filtered events of one window (always the first CTE).
function base(lo: number, hi: number, filters: Filters, cols: SQL = sql`*`): SQL {
  return sql`select ${cols} from analytics_events where at >= ${lo} and at < ${hi} and ${filterSql(filters, lo, hi)}`
}

const IS_VIEW = sql`type = 'pageview'`
const AVG_MS = sql`avg(duration_ms) filter (where type = 'leave' and duration_ms between 1000 and 1800000)`

// Totals for the current and the previous period in one statement (+ visitors online in the last 5 minutes).
// Bounce = sessions with exactly one page view among sessions with any.
export function kpiQuery(p: Period, filters: Filters, now: number): SQL {
  const lo = Math.min(p.prev.start, p.cur.start)
  const hi = p.cur.end
  return sql`with e as (
    select at >= ${p.cur.start} as cur, type, visitor_id, session_id, user_id, duration_ms from analytics_events
    where ((at >= ${p.cur.start} and at < ${p.cur.end}) or (at >= ${p.prev.start} and at < ${p.prev.end})) and ${filterSql(filters, lo, hi)}
  ),
  k as (
    select cur, count(distinct visitor_id) as visitors, count(*) filter (where ${IS_VIEW}) as views, count(distinct session_id) as sessions,
      count(*) filter (where type = 'click') as clicks, count(distinct user_id) as signed_in, ${AVG_MS} as avg_ms
    from e group by cur
  ),
  s as (select cur, session_id, count(*) filter (where ${IS_VIEW}) as pv from e group by cur, session_id),
  b as (select cur, count(*) filter (where pv = 1) as bounced, count(*) filter (where pv > 0) as with_views from s group by cur)
  select p.cur, k.visitors, k.views, k.sessions, k.clicks, k.signed_in, k.avg_ms, b.bounced, b.with_views,
    (select count(distinct visitor_id) from analytics_events where at >= ${now - 5 * 60_000}) as online
  from (values (true), (false)) as p(cur) left join k on k.cur = p.cur left join b on b.cur = p.cur`
}

// Every metric per bucket, empty buckets included (generate_series over Kyiv wall time). The bounds go in as text:
// typed as timestamp, postgres-js would serialise them through `new Date()` in the server's own time zone.
export function seriesQuery(span: Span, gran: Gran, filters: Filters): SQL {
  const unit = gran === 'hour' ? 'hour' : 'day'
  const step = gran === 'hour' ? '1 hour' : '1 day'
  return sql`with e as (
    select type, visitor_id, session_id, duration_ms, date_trunc(${unit}, to_timestamp(at / 1000.0) at time zone ${TZ}) as b
    from (${base(span.start, span.end, filters)}) as f
  ),
  agg as (
    select b, count(distinct visitor_id) as visitors, count(*) filter (where ${IS_VIEW}) as views, count(distinct session_id) as sessions,
      count(*) filter (where type = 'click') as clicks, ${AVG_MS} as avg_ms
    from e group by b
  ),
  s as (select session_id, min(b) as b, count(*) filter (where ${IS_VIEW}) as pv from e group by session_id),
  bo as (select b, count(*) filter (where pv = 1) as bounced, count(*) filter (where pv > 0) as with_views from s group by b)
  select to_char(g.b, 'YYYY-MM-DD"T"HH24:MI') as bucket, agg.visitors, agg.views, agg.sessions, agg.clicks, agg.avg_ms, bo.bounced, bo.with_views
  from generate_series(${span.first}::text::timestamp, ${span.last}::text::timestamp, ${step}::text::interval) as g(b)
  left join agg on agg.b = g.b left join bo on bo.b = g.b
  order by g.b`
}

// Breakdown dimensions: [id, key expression, sub expression]. Fixed list — never from the URL.
export const DIMS = {
  ref: [REF_HOST, sql`null`],
  country: [sql`country`, sql`null`],
  city: [sql`city`, sql`country`],
  device: [sql`device`, sql`null`],
  browser: [sql`browser`, sql`null`],
  os: [sql`os`, sql`null`],
  lang: [sql`lang`, sql`null`],
  screen: [sql`screen`, sql`null`],
  utm_source: [sql`utm->>'utm_source'`, sql`null`],
  utm_medium: [sql`utm->>'utm_medium'`, sql`null`],
  utm_campaign: [sql`utm->>'utm_campaign'`, sql`null`],
  auth: [sql`case when user_id is null then 'guest' else 'in' end`, sql`null`],
} as const satisfies Record<string, readonly [SQL, SQL]>
export type Dim = keyof typeof DIMS

// Top `limit` keys of several dimensions in one pass (a lateral VALUES fans each event out to one row per dimension).
export function dimsQuery(span: Span, filters: Filters, dims: readonly Dim[], limit: number): SQL {
  const values = sql.join(
    dims.map((d) => sql`(${d}, (${DIMS[d][0]})::text, (${DIMS[d][1]})::text)`),
    sql`, `,
  )
  return sql`with e as (${base(span.start, span.end, filters)}),
  g as (
    select d.dim, d.key, d.sub, count(*) filter (where ${IS_VIEW}) as views, count(distinct e.visitor_id) as visitors
    from e cross join lateral (values ${values}) as d(dim, key, sub)
    group by d.dim, d.key, d.sub
  ),
  r as (select g.*, row_number() over (partition by dim order by visitors desc, views desc, key) as rn from g)
  select dim, key, sub, views, visitors from r where rn <= ${limit} order by dim, rn`
}

// Top pages, and the top blog articles (/blog/…) ranked separately.
export function pagesQuery(span: Span, filters: Filters, limit: number, blog: boolean): SQL {
  const isBlog = blog ? sql`(is_blog and rn_kind <= ${limit})` : sql`false`
  return sql`with e as (${base(span.start, span.end, filters)}),
  g as (select ${PAGE} as key, count(*) as views, count(distinct visitor_id) as visitors from e where ${IS_VIEW} group by 1),
  r as (
    select g.*, key like '/blog/%' as is_blog, row_number() over (order by visitors desc, views desc, key) as rn,
      row_number() over (partition by key like '/blog/%' order by visitors desc, views desc, key) as rn_kind
    from g
  )
  select key, views, visitors, rn <= ${limit} as top, ${isBlog} as blog from r
  where rn <= ${limit} or ${isBlog}
  order by visitors desc, views desc, key`
}

// Entry and exit pages: a session's first and last page view (window functions over session_id ordered by time).
export function entryExitQuery(span: Span, filters: Filters, limit: number): SQL {
  return sql`with e as (${base(span.start, span.end, filters)}),
  pv as (
    select session_id, visitor_id, ${PAGE} as page,
      row_number() over (partition by session_id order by at, id) as first_n,
      row_number() over (partition by session_id order by at desc, id desc) as last_n
    from e where ${IS_VIEW}
  ),
  g as (
    select 'entry' as kind, page as key, count(*) as views, count(distinct visitor_id) as visitors from pv where first_n = 1 group by page
    union all
    select 'exit' as kind, page as key, count(*) as views, count(distinct visitor_id) as visitors from pv where last_n = 1 group by page
  ),
  r as (select g.*, row_number() over (partition by kind order by views desc, visitors desc, key) as rn from g)
  select kind, key, views, visitors from r where rn <= ${limit} order by kind, rn`
}

export function clicksQuery(span: Span, filters: Filters, limit: number): SQL {
  return sql`with e as (${base(span.start, span.end, filters)})
  select coalesce(target->>'label', '') as label, coalesce(target->>'href', '') as href, ${PAGE} as page, count(*) as clicks, count(distinct visitor_id) as visitors
  from e where type = 'click' group by 1, 2, 3 order by 4 desc, 5 desc limit ${limit}`
}

// The latest events, newest first; `before` is the (at, id) of the last row of the previous page.
export function eventsQuery(span: Span, filters: Filters, before: Query['before'], limit: number): SQL {
  const cursor = before ? sql`and (at, id) < (${before.at}, ${before.id})` : sql``
  return sql`with e as (${base(span.start, span.end, filters)} ${cursor} order by at desc, id desc limit ${limit + 1})
  select e.id, e.at, e.type, e.path, coalesce(e.target->>'label', '') as label, coalesce(e.target->>'href', '') as href, e.country, e.city, e.ip,
    e.device, e.browser, e.os, e.user_id is not null as signed_in, coalesce(p.display_name, '') as name, e.visitor_id, e.duration_ms
  from e left join profiles p on p.id = e.user_id order by e.at desc, e.id desc`
}

// Accounts: total, and new ones in the current and the previous period.
export function accountsQuery(p: Period): SQL {
  return sql`select count(*) as users,
    count(*) filter (where created_at >= ${p.cur.start} and created_at < ${p.cur.end}) as new_cur,
    count(*) filter (where created_at >= ${p.prev.start} and created_at < ${p.prev.end}) as new_prev
  from profiles`
}

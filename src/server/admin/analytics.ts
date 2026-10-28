import 'server-only'
import {
  accountsQuery,
  clicksQuery,
  dimsQuery,
  entryExitQuery,
  eventsQuery,
  kpiQuery,
  pagesQuery,
  periodOf,
  seriesQuery,
  type Dim,
  type Metric,
  type Period,
  type Query,
} from './analytics-query'
import { sequential, type Row } from './stats'

// Runs the /admin analytics statements (./analytics-query.ts) one at a time, time-boxed (./stats.ts `sequential`), and
// shapes the rows for the pages. ≤ 9 statements per request.

const num = (v: unknown): number => Number(v ?? 0)
const str = (v: unknown): string => (v === null || v === undefined ? '' : String(v))
const orNull = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v))

export interface Totals {
  visitors: number
  views: number
  sessions: number
  clicks: number
  signedIn: number
  // share of single-page sessions, % (null: no sessions with views)
  bounce: number | null
  // average time on page, seconds (null: no measured leaves)
  duration: number | null
}

export interface Series {
  buckets: string[]
  values: Record<Metric, Array<number | null>>
}

export interface Item {
  key: string
  sub?: string
  views: number
  visitors: number
}

export interface ClickRow {
  label: string
  href: string
  page: string
  clicks: number
  visitors: number
}

export interface EventRow {
  id: number
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
  signedIn: boolean
  name: string
  visitor: string
  durationMs: number | null
}

export interface AnalyticsData {
  // when the data was read (ms)
  now: number
  period: Period
  cur: Totals
  prev: Totals
  online: number
  series: Series
  prevSeries: Series | null
  dims: Partial<Record<Dim, Item[]>>
  pages: Item[]
  blog: Item[]
  entry: Item[]
  exit: Item[]
  clicks: ClickRow[]
  events: EventRow[]
  // cursor of the next (older) page of events
  nextBefore: string | null
  accounts: { total: number; newCur: number; newPrev: number } | null
  issues: string[]
  ms: number
}

const totals = (r: Row | undefined): Totals => {
  const withViews = num(r?.with_views)
  return {
    visitors: num(r?.visitors),
    views: num(r?.views),
    sessions: num(r?.sessions),
    clicks: num(r?.clicks),
    signedIn: num(r?.signed_in),
    bounce: withViews > 0 ? (num(r?.bounced) / withViews) * 100 : null,
    duration: r?.avg_ms === null || r?.avg_ms === undefined ? null : num(r.avg_ms) / 1000,
  }
}

function series(list: Row[]): Series {
  const values: Series['values'] = { visitors: [], views: [], sessions: [], bounce: [], duration: [], clicks: [] }
  for (const r of list) {
    const t = totals(r)
    values.visitors.push(t.visitors)
    values.views.push(t.views)
    values.sessions.push(t.sessions)
    values.clicks.push(t.clicks)
    values.bounce.push(t.bounce)
    values.duration.push(t.duration)
  }
  return { buckets: list.map((r) => str(r.bucket)), values }
}

const items = (list: Row[]): Item[] => list.map((r) => ({ key: str(r.key), sub: r.sub ? str(r.sub) : undefined, views: num(r.views), visitors: num(r.visitors) }))

export type Sections = 'overview' | 'full'

const OVERVIEW_DIMS: Dim[] = ['ref', 'country']
const FULL_DIMS: Dim[] = ['ref', 'country', 'city', 'device', 'browser', 'os', 'lang', 'screen', 'utm_source', 'utm_medium', 'utm_campaign', 'auth']

export async function loadAnalytics(query: Query, sections: Sections, now = Date.now()): Promise<AnalyticsData> {
  const started = Date.now()
  const log: string[] = []
  const issues: string[] = []
  const q = sequential(log, issues)
  const period = periodOf(query, now)
  const f = query.filters
  const full = sections === 'full'
  const limit = full ? 20 : 5
  const EVENTS = 200

  const [kpi, cur, prev, dims, pages, entryExit, clicks, events, accounts] = await Promise.all([
    q('kpi', kpiQuery(period, f, now)),
    q('series', seriesQuery(period.cur, period.gran, f)),
    query.compare ? q('series-prev', seriesQuery(period.prev, period.gran, f)) : Promise.resolve(null),
    q('dims', dimsQuery(period.cur, f, full ? FULL_DIMS : OVERVIEW_DIMS, limit + 1)),
    q('pages', pagesQuery(period.cur, f, limit, full)),
    full ? q('entry-exit', entryExitQuery(period.cur, f, limit)) : Promise.resolve([]),
    full ? q('clicks', clicksQuery(period.cur, f, 30)) : Promise.resolve([]),
    full ? q('events', eventsQuery(period.cur, f, query.before, EVENTS)) : Promise.resolve([]),
    full ? Promise.resolve(null) : q('accounts', accountsQuery(period)),
  ])

  const byDim: Partial<Record<Dim, Item[]>> = {}
  for (const r of dims) (byDim[str(r.dim) as Dim] ??= []).push(...items([r]))
  const more = events.length > EVENTS
  const shown = events.slice(0, EVENTS)
  const last = shown.at(-1)
  const a = accounts?.[0]

  const ms = Date.now() - started
  console.log(`[admin] analytics ${sections} ${period.range} ${ms}ms · ${log.join(' · ')}`)
  return {
    now,
    period,
    cur: totals(kpi.find((r) => r.cur === true)),
    prev: totals(kpi.find((r) => r.cur === false)),
    online: num(kpi[0]?.online),
    series: series(cur),
    prevSeries: prev ? series(prev) : null,
    dims: byDim,
    pages: items(pages.filter((r) => r.top === true)),
    blog: items(pages.filter((r) => r.blog === true)),
    entry: items(entryExit.filter((r) => r.kind === 'entry')),
    exit: items(entryExit.filter((r) => r.kind === 'exit')),
    clicks: clicks.map((r) => ({ label: str(r.label), href: str(r.href), page: str(r.page), clicks: num(r.clicks), visitors: num(r.visitors) })),
    events: shown.map((r) => ({
      id: num(r.id),
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
      signedIn: r.signed_in === true,
      name: str(r.name),
      visitor: str(r.visitor_id).slice(0, 8),
      durationMs: orNull(r.duration_ms),
    })),
    nextBefore: more && last ? `${num(last.at)}_${num(last.id)}` : null,
    accounts: a ? { total: num(a.users), newCur: num(a.new_cur), newPrev: num(a.new_prev) } : null,
    issues,
    ms,
  }
}

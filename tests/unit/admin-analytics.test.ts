import { PgDialect } from 'drizzle-orm/pg-core'
import type { SQL } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import {
  clicksQuery,
  dimsQuery,
  entryExitQuery,
  eventsQuery,
  filterSql,
  hrefOf,
  kpiQuery,
  kyivToUtc,
  likePrefix,
  pagesQuery,
  parseQuery,
  periodOf,
  queryParams,
  seriesQuery,
} from '@/server/admin/analytics-query'
import { niceTicks } from '@/ui/admin/AreaChart'
import { bucketTick, countryName, fmtDuration, languageName } from '@/ui/admin/format'

const dialect = new PgDialect()
const compile = (q: SQL) => dialect.sqlToQuery(q)

// 2026-10-28 22:30 in Kyiv (UTC+2 after the 25 Oct DST switch)
const NOW = Date.UTC(2026, 9, 28, 20, 30)
const EVIL = "x'); drop table profiles; --"

describe('analytics query parsing', () => {
  it('defaults: 7 days, visitors, compare on, no filters', () => {
    expect(parseQuery({})).toEqual({ range: '7d', from: undefined, to: undefined, gran: undefined, metric: 'visitors', compare: true, filters: {}, before: undefined })
  })

  it('keeps known filters, drops junk and unknown keys', () => {
    const q = parseQuery({ range: '30d', country: 'UA', path: '/blog/*', user: 'guest', metric: 'bounce', cmp: '0', hack: '1', device: '', os: ['iOS', 'Android'] })
    expect(q.range).toBe('30d')
    expect(q.metric).toBe('bounce')
    expect(q.compare).toBe(false)
    expect(q.filters).toEqual({ country: 'UA', path: '/blog/*', user: 'guest', os: 'iOS' })
  })

  it('invalid values fall back instead of throwing', () => {
    const q = parseQuery({ range: 'year', metric: 'money', gran: 'minute', user: 'admin', before: '1;2', country: 'x'.repeat(500) })
    expect(q).toMatchObject({ range: '7d', metric: 'visitors', gran: undefined, before: undefined, filters: {} })
  })

  it('custom range needs two real dates, swaps them if reversed', () => {
    expect(parseQuery({ range: 'custom', from: '2026-10-01' }).range).toBe('7d')
    expect(parseQuery({ range: 'custom', from: '2026-02-30', to: '2026-03-02' }).range).toBe('7d')
    expect(parseQuery({ range: 'custom', from: '2026-10-20', to: '2026-10-01' })).toMatchObject({ range: 'custom', from: '2026-10-01', to: '2026-10-20' })
    expect(parseQuery({ range: '7d', from: '2026-10-01', to: '2026-10-02' })).toMatchObject({ from: undefined, to: undefined })
  })

  it('parses the events cursor', () => {
    expect(parseQuery({ before: '1793217852319_115' }).before).toEqual({ at: 1793217852319, id: 115 })
  })

  it('round-trips through URL params; links drop the cursor', () => {
    const q = parseQuery({ range: 'custom', from: '2026-10-01', to: '2026-10-07', country: 'UA', metric: 'views', before: '1_2' })
    expect(Object.fromEntries(queryParams(q))).toEqual({ range: 'custom', from: '2026-10-01', to: '2026-10-07', metric: 'views', country: 'UA' })
    expect(hrefOf('/admin/analytics', q, { city: 'Kyiv', country: null })).toBe('/admin/analytics?range=custom&from=2026-10-01&to=2026-10-07&metric=views&city=Kyiv')
  })
})

describe('Kyiv periods', () => {
  it('converts Kyiv wall time across DST', () => {
    expect(kyivToUtc({ y: 2026, m: 10, d: 28, h: 0 })).toBe(Date.UTC(2026, 9, 27, 22))
    expect(kyivToUtc({ y: 2026, m: 7, d: 1, h: 0 })).toBe(Date.UTC(2026, 5, 30, 21))
  })

  it('7 days: whole Kyiv days, daily buckets, previous week before it', () => {
    const p = periodOf({ range: '7d' }, NOW)
    expect(p.gran).toBe('day')
    expect(p.auto).toBe(true)
    expect(p.cur).toMatchObject({ first: '2026-10-22T00:00', last: '2026-10-28T00:00', start: Date.UTC(2026, 9, 21, 21), end: NOW + 1 })
    expect(p.prev).toMatchObject({ first: '2026-10-15T00:00', last: '2026-10-21T00:00', start: Date.UTC(2026, 9, 14, 21) })
    expect(p.prev.end).toBeLessThanOrEqual(p.cur.start)
  })

  it('today: hourly from Kyiv midnight to now; yesterday as the same span', () => {
    const p = periodOf({ range: 'today' }, NOW)
    expect(p.gran).toBe('hour')
    expect(p.cur).toMatchObject({ start: Date.UTC(2026, 9, 27, 22), first: '2026-10-28T00:00', last: '2026-10-28T22:00' })
    expect(p.prev).toMatchObject({ first: '2026-10-27T00:00', last: '2026-10-27T22:00', start: Date.UTC(2026, 9, 26, 22), end: Date.UTC(2026, 9, 27, 20, 30) + 1 })
  })

  it('24h: rolling, hourly', () => {
    const p = periodOf({ range: '24h' }, NOW)
    expect(p).toMatchObject({ gran: 'hour', cur: { start: NOW - 86_400_000, first: '2026-10-27T22:00', last: '2026-10-28T22:00' } })
    expect(p.prev.end).toBe(p.cur.start)
  })

  it('custom: to the end of the last day; manual granularity, hourly capped at 31 days', () => {
    const p = periodOf({ range: 'custom', from: '2026-09-01', to: '2026-09-02' }, NOW)
    expect(p).toMatchObject({ gran: 'hour', label: '1 вер. – 2 вер.', cur: { first: '2026-09-01T00:00', last: '2026-09-02T23:00', start: Date.UTC(2026, 7, 31, 21), end: Date.UTC(2026, 8, 2, 21) } })
    expect(p.prev.first).toBe('2026-08-30T00:00')
    expect(periodOf({ range: 'custom', from: '2026-09-01', to: '2026-09-02', gran: 'day' }, NOW).gran).toBe('day')
    expect(periodOf({ range: '90d', gran: 'hour' }, NOW).gran).toBe('day')
    expect(periodOf({ range: 'month' }, NOW).cur.first).toBe('2026-10-01T00:00')
  })
})

describe('analytics SQL', () => {
  const p = periodOf({ range: '7d' }, NOW)

  it('filters are bound parameters on whitelisted columns', () => {
    const { sql, params } = compile(filterSql({ country: EVIL, device: 'mobile', user: 'in' }, 1, 2))
    expect(sql).toBe('country = $1 and device = $2 and user_id is not null')
    expect(params).toEqual([EVIL, 'mobile'])
  })

  it('referrer / UTM filters keep whole sessions', () => {
    const { sql, params } = compile(filterSql({ ref: 'google.com', utm_source: 'tg' }, 10, 20))
    expect(sql).toBe(
      "session_id in (select session_id from analytics_events where at >= $1 and at < $2 and split_part(referrer, '/', 1) = $3) and session_id in (select session_id from analytics_events where at >= $4 and at < $5 and utm->>'utm_source' = $6)",
    )
    expect(params).toEqual([10, 20, 'google.com', 10, 20, 'tg'])
  })

  it('path: exact, or a prefix with `*` (LIKE wildcards escaped)', () => {
    expect(compile(filterSql({ path: '/blog' }, 0, 1))).toMatchObject({ sql: "split_part(path, '?', 1) = $1", params: ['/blog'] })
    expect(compile(filterSql({ path: '/blog/*' }, 0, 1))).toMatchObject({ sql: "split_part(path, '?', 1) like $1", params: ['/blog/%'] })
    expect(compile(filterSql({ path: '/a_b%*' }, 0, 1)).params).toEqual(['/a\\_b\\%%'])
    expect(likePrefix('100%')).toBe('100\\%%')
    expect(compile(filterSql({}, 0, 1)).sql).toBe('true')
  })

  it('no user input is ever inlined into any statement', () => {
    const f = { country: EVIL, path: EVIL, ref: EVIL, utm_campaign: EVIL, city: EVIL, lang: EVIL }
    const statements = [kpiQuery(p, f, NOW), seriesQuery(p.cur, 'day', f), dimsQuery(p.cur, f, ['ref', 'country', 'auth'], 5), pagesQuery(p.cur, f, 10, true), entryExitQuery(p.cur, f, 10), clicksQuery(p.cur, f, 10), eventsQuery(p.cur, f, { at: 5, id: 6 }, 200)]
    for (const s of statements) {
      const { sql, params } = compile(s)
      expect(sql).not.toContain('drop table')
      expect(params).toContain(EVIL)
    }
  })

  it('time series: Kyiv buckets over generate_series, bounds as text', () => {
    const { sql, params } = compile(seriesQuery(p.cur, 'day', {}))
    expect(sql).toContain('date_trunc($1, to_timestamp(at / 1000.0) at time zone $2)')
    expect(sql).toMatch(/generate_series\(\$\d+::text::timestamp, \$\d+::text::timestamp, \$\d+::text::interval\)/)
    expect(params).toEqual(['day', 'Europe/Kyiv', p.cur.start, p.cur.end, '2026-10-22T00:00', '2026-10-28T00:00', '1 day'])
  })

  it('KPIs: current and previous in one statement, bounce from sessions, online in 5 minutes', () => {
    const { sql, params } = compile(kpiQuery(p, {}, NOW))
    expect(sql).toContain('count(*) filter (where pv = 1) as bounced')
    expect(sql).toContain('from (values (true), (false)) as p(cur)')
    expect(params).toContain(NOW - 300_000)
    expect(params.slice(0, 5)).toEqual([p.cur.start, p.cur.start, p.cur.end, p.prev.start, p.prev.end])
  })

  it('entry / exit pages use window functions per session', () => {
    const { sql } = compile(entryExitQuery(p.cur, {}, 10))
    expect(sql).toContain('row_number() over (partition by session_id order by at, id) as first_n')
    expect(sql).toContain('row_number() over (partition by session_id order by at desc, id desc) as last_n')
  })

  it('events page by (at, id) cursor, one extra row to know there is more', () => {
    const { sql, params } = compile(eventsQuery(p.cur, {}, { at: 100, id: 7 }, 200))
    expect(sql).toContain('and (at, id) < ($3, $4) order by at desc, id desc limit $5')
    expect(params.slice(2)).toEqual([100, 7, 201])
  })

  it('breakdown dimensions come from a fixed list', () => {
    const { sql, params } = compile(dimsQuery(p.cur, {}, ['country', 'utm_source'], 20))
    expect(sql).toContain("values ($3, (country)::text, (null)::text), ($4, (utm->>'utm_source')::text, (null)::text)")
    expect(params).toEqual([p.cur.start, p.cur.end, 'country', 'utm_source', 20])
  })
})

describe('admin analytics formatting', () => {
  it('nice y ticks', () => {
    expect(niceTicks(0, 'count')).toEqual([0, 1])
    expect(niceTicks(87, 'count')).toEqual([0, 20, 40, 60, 80, 100])
    expect(niceTicks(3, 'count')).toEqual([0, 1, 2, 3])
    expect(niceTicks(42.5, 'percent')).toEqual([0, 10, 20, 30, 40, 50])
    expect(niceTicks(1840, 'count')).toEqual([0, 500, 1000, 1500, 2000])
    expect(niceTicks(0.8, 'seconds')).toEqual([0, 0.2, 0.4, 0.6, 0.8])
  })

  it('names, durations, axis labels', () => {
    expect(countryName('UA')).toBe('Україна')
    expect(countryName('—')).toBe('—')
    expect(languageName('en-US')).toMatch(/англійська/)
    expect(fmtDuration(42)).toBe('42 с')
    expect(fmtDuration(125)).toBe('2 хв 05 с')
    expect(bucketTick('2026-10-28T14:00', 'hour')).toBe('14:00')
    expect(bucketTick('2026-10-28T00:00', 'day')).toMatch(/^28 жовт/)
  })
})

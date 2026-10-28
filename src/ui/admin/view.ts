import type { AnalyticsData, Item } from '@/server/admin/analytics'
import { FILTER_KEYS, FILTER_LABEL, hrefOf, kyivToday, METRICS, RANGE_LABEL, RANGES, type FilterKey, type Query } from '@/server/admin/analytics-query'
import type { BreakdownRow } from './BreakdownList'
import type { MetricData } from './ChartPanel'
import type { Chip } from './FilterChips'
import { countryName, languageName } from './format'
import type { PeriodPickerProps } from './PeriodPicker'

// Server-side glue between the analytics data and the admin UI components (labels, links, chart props).

const DEVICE: Record<string, string> = { mobile: 'Телефон', desktop: 'Компʼютер', tablet: 'Планшет' }
const AUTH: Record<string, string> = { in: 'Увійшли в акаунт', guest: 'Гості' }

// How a filter value reads on screen
export function valueLabel(key: FilterKey | 'auth', value: string): string {
  if (key === 'country') return `${countryName(value)} · ${value}`
  if (key === 'device') return DEVICE[value] ?? value
  if (key === 'lang') return `${languageName(value)} · ${value}`
  if (key === 'user' || key === 'auth') return AUTH[value] ?? value
  return value
}

const rowLabel = (key: FilterKey | 'auth', value: string): string => {
  if (key === 'country') return countryName(value)
  if (key === 'lang') return languageName(value)
  return valueLabel(key, value)
}

// List rows: share of `total`; rows link to `base` with the row added as a filter (unknown values aren't filterable).
export function rowsOf(list: Item[] | undefined, opts: { total: number; q: Query; base: string; key: FilterKey | 'auth'; value?: 'visitors' | 'views'; mono?: boolean; dropEmpty?: boolean }): BreakdownRow[] {
  const filterKey: FilterKey = opts.key === 'auth' ? 'user' : opts.key
  return (list ?? [])
    .filter((r) => !(opts.dropEmpty && r.key === ''))
    .map((r) => {
      const value = opts.value === 'views' ? r.views : r.visitors
      const sub = opts.key === 'country' && r.key ? r.key : opts.key === 'city' && r.sub ? countryName(r.sub) : opts.key === 'lang' && r.key ? r.key : undefined
      return {
        key: r.key,
        label: r.key === '' ? 'Невідомо' : rowLabel(opts.key, r.key),
        sub,
        value,
        share: opts.total > 0 ? value / opts.total : 0,
        href: r.key === '' ? undefined : hrefOf(opts.base, opts.q, { [filterKey]: r.key }),
        mono: opts.mono,
      }
    })
}

export function chipsOf(q: Query, base: string): { chips: Chip[]; clearHref: string } {
  const chips: Chip[] = []
  for (const key of FILTER_KEYS) {
    const value = q.filters[key]
    if (value === undefined) continue
    chips.push({ key, label: FILTER_LABEL[key], value: valueLabel(key, value), removeHref: hrefOf(base, q, { [key]: null }) })
  }
  return { chips, clearHref: hrefOf(base, { ...q, filters: {} }) }
}

export function metricsOf(d: AnalyticsData): MetricData[] {
  return METRICS.map((id) => ({ id, value: d.cur[id], prev: d.prev[id], values: d.series.values[id], prevValues: d.prevSeries?.values[id] ?? null }))
}

export function pickerOf(q: Query, d: AnalyticsData, controls: boolean): PeriodPickerProps {
  const p = d.period
  return {
    presets: RANGES.map((id) => ({ id, label: RANGE_LABEL[id] })),
    range: q.range,
    fromDay: new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' }).format(p.cur.start),
    toDay: new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' }).format(p.cur.end - 1),
    today: kyivToday(d.now),
    ...(controls ? { gran: { value: p.gran, auto: p.auto, hourly: p.cur.end - p.cur.start <= 31 * 86_400_000 }, compare: q.compare } : {}),
  }
}

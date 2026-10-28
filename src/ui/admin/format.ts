import type { Metric } from '@/server/admin/analytics-query'

// Formatting shared by the admin analytics server pages and client charts (uk-UA numbers, Kyiv wall time).

const NUM = new Intl.NumberFormat('uk-UA')
const COMPACT = new Intl.NumberFormat('uk-UA', { notation: 'compact', maximumFractionDigits: 1 })
const ONE = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 })

export const fmtNumber = (n: number): string => NUM.format(Math.round(n))
export const fmtCompact = (n: number): string => (Math.abs(n) < 10_000 ? NUM.format(Math.round(n)) : COMPACT.format(n))
export const fmtOne = (n: number): string => ONE.format(n)

export function fmtDuration(seconds: number): string {
  const s = Math.round(seconds)
  if (s < 60) return `${s} с`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} хв ${String(s % 60).padStart(2, '0')} с`
  return `${Math.floor(m / 60)} год ${String(m % 60).padStart(2, '0')} хв`
}

export interface MetricMeta {
  label: string
  // what one unit is called in a sentence («120 відвідувачів»)
  noun: string
  unit: 'count' | 'percent' | 'seconds'
  // a rise is bad news (bounce)
  invert?: boolean
}

export const METRIC_META: Record<Metric, MetricMeta> = {
  visitors: { label: 'Відвідувачі', noun: 'відвідувачів', unit: 'count' },
  views: { label: 'Перегляди', noun: 'переглядів', unit: 'count' },
  sessions: { label: 'Сесії', noun: 'сесій', unit: 'count' },
  bounce: { label: 'Відмови', noun: 'відмов', unit: 'percent', invert: true },
  duration: { label: 'Сер. час на сторінці', noun: 'на сторінці', unit: 'seconds' },
  clicks: { label: 'Кліки', noun: 'кліків', unit: 'count' },
}

export function fmtMetric(metric: Metric, v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  const unit = METRIC_META[metric].unit
  if (unit === 'percent') return `${fmtOne(v)}%`
  if (unit === 'seconds') return fmtDuration(v)
  return fmtNumber(v)
}

// axis ticks: short
export function fmtTick(metric: Metric, v: number): string {
  const unit = METRIC_META[metric].unit
  if (unit === 'percent') return `${Math.round(v)}%`
  if (unit === 'seconds') return v >= 60 ? `${fmtOne(v / 60)} хв` : `${Math.round(v)} с`
  return fmtCompact(v)
}

// Buckets are Kyiv wall times 'YYYY-MM-DDTHH:MM' — formatted as UTC so no zone shifts them again.
const wall = (b: string): number => Date.UTC(Number(b.slice(0, 4)), Number(b.slice(5, 7)) - 1, Number(b.slice(8, 10)), Number(b.slice(11, 13)) || 0)
const DAY_SHORT = new Intl.DateTimeFormat('uk-UA', { timeZone: 'UTC', day: 'numeric', month: 'short' })
const DAY_LONG = new Intl.DateTimeFormat('uk-UA', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
const HOUR_LONG = new Intl.DateTimeFormat('uk-UA', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' })

export function bucketTick(b: string, gran: 'hour' | 'day', withDay = false): string {
  if (gran === 'day') return DAY_SHORT.format(wall(b))
  const hour = b.slice(11, 16)
  return withDay || hour === '00:00' ? `${DAY_SHORT.format(wall(b))}${hour === '00:00' ? '' : `, ${hour}`}` : hour
}

export function bucketTitle(b: string, gran: 'hour' | 'day'): string {
  if (gran === 'day') return DAY_LONG.format(wall(b))
  const h = Number(b.slice(11, 13))
  return `${HOUR_LONG.format(wall(b))}, ${b.slice(11, 13)}:00–${String((h + 1) % 24).padStart(2, '0')}:00`
}

// Country / language names in Ukrainian (Intl.DisplayNames), falling back to the raw code.
const REGIONS = new Intl.DisplayNames(['uk'], { type: 'region' })
const LANGUAGES = new Intl.DisplayNames(['uk'], { type: 'language' })

export function countryName(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return code
  try {
    return REGIONS.of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

export function languageName(tag: string): string {
  try {
    const name = LANGUAGES.of(tag)
    return name && name !== tag ? name : tag
  } catch {
    return tag
  }
}

const TIME = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
export const fmtTime = (ms: number): string => TIME.format(ms)

import { plural } from '@/ui/format'

const DAY_FMT = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short' })
const DAY_LONG = new Intl.DateTimeFormat('uk-UA', { weekday: 'short', day: 'numeric', month: 'long' })

function parseDay(day: string): Date {
  const [y, m, d] = day.split('-').map(Number) as [number, number, number]
  return new Date(y, m - 1, d, 12)
}

// «16 жовт.»
export function shortDay(day: string): string {
  return DAY_FMT.format(parseDay(day))
}

// «пт, 16 жовтня»
export function longDay(day: string): string {
  return DAY_LONG.format(parseDay(day))
}

export function weekdayIndex(day: string): number {
  return (parseDay(day).getDay() + 6) % 7
}

// Seconds with one decimal: 8290 → «8.3»
export function seconds(ms: number): string {
  const s = ms / 1000
  return s >= 100 ? String(Math.round(s)) : (Math.round(s * 10) / 10).toFixed(1)
}

export function nouns(n: number, forms: { one: string; few: string; many: string }): string {
  return `${n} ${plural(n, forms.one, forms.few, forms.many)}`
}

// A clean axis maximum: 1 · 2 · 5 × 10^k at or above `v`.
export function niceMax(v: number): number {
  if (v <= 0) return 1
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p
  return 10 * p
}

export function signedPercent(v: number): string {
  return `${Math.round(Math.abs(v) * 100)}%`
}

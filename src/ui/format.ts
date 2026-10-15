export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export function count(n: number, one: string, few: string, many: string): string {
  return `${n} ${plural(n, one, few, many)}`
}

export function minutes(total: number): string {
  if (total < 60) return `${total} хв`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? `${h} год` : `${h} год ${m} хв`
}

export function duration(ms: number): string {
  const totalMin = Math.round(ms / 60_000)
  if (totalMin < 1) return '<1 хв'
  return minutes(totalMin)
}

export function percent(value: number | null): string {
  return value === null ? '—' : `${Math.round(value * 100)}%`
}

const RELATIVE = new Intl.RelativeTimeFormat('uk', { numeric: 'auto' })

export function relative(ts: number | null, now = Date.now()): string {
  if (!ts) return '—'
  const diff = ts - now
  const abs = Math.abs(diff)
  if (abs < 60_000) return 'щойно'
  if (abs < 3_600_000) return RELATIVE.format(Math.round(diff / 60_000), 'minute')
  if (abs < 86_400_000) return RELATIVE.format(Math.round(diff / 3_600_000), 'hour')
  if (abs < 30 * 86_400_000) return RELATIVE.format(Math.round(diff / 86_400_000), 'day')
  return new Date(ts).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
}

export function interval(ms: number): string {
  const min = ms / 60_000
  if (min < 60) return `${Math.max(1, Math.round(min))} хв`
  const h = min / 60
  if (h < 24) return `${Math.round(h)} год`
  const d = h / 24
  if (d < 30) return `${Math.round(d)} дн`
  return `${Math.round(d / 30)} міс`
}

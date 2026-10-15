export const DAY_START_HOUR = 4
export const HOUR = 3_600_000
export const DAY = 24 * HOUR

export function dayKey(at: number, dayStartHour = DAY_START_HOUR): string {
  const d = new Date(at - dayStartHour * HOUR)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number]
  const date = new Date(y, m - 1, d + delta, 12)
  return dayKey(date.getTime() + DAY_START_HOUR * HOUR)
}

// Epoch ms when the study day containing `at` began (days start at DAY_START_HOUR local time).
export function dayStartMs(at: number, dayStartHour = DAY_START_HOUR): number {
  const d = new Date(at - dayStartHour * HOUR)
  d.setHours(0, 0, 0, 0)
  return d.getTime() + dayStartHour * HOUR
}

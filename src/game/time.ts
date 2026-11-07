// League weeks start on Monday 00:00 Europe/Kyiv (DST-aware). Pure: Intl only, no I/O.

export const LEAGUE_TZ = 'Europe/Kyiv'

const WEEKDAYS: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }

let formatter: Intl.DateTimeFormat | null = null
function zoned(): Intl.DateTimeFormat {
  formatter ??= new Intl.DateTimeFormat('en-US', {
    timeZone: LEAGUE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  })
  return formatter
}

interface ZonedParts {
  y: number
  m: number
  d: number
  h: number
  mi: number
  s: number
  // Monday = 0 … Sunday = 6
  dow: number
}

function parts(at: number): ZonedParts {
  const out: Record<string, string> = {}
  for (const p of zoned().formatToParts(new Date(at))) out[p.type] = p.value
  return { y: Number(out.year), m: Number(out.month), d: Number(out.day), h: Number(out.hour) % 24, mi: Number(out.minute), s: Number(out.second), dow: WEEKDAYS[out.weekday!] ?? 0 }
}

// Kyiv's offset from UTC at `at`, in ms (+2h winter, +3h summer).
function offset(at: number): number {
  const p = parts(at)
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - (at - (((at % 1000) + 1000) % 1000))
}

const iso = (y: number, m: number, d: number): string => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10)

// UTC epoch ms of 00:00 Kyiv time on the given calendar date.
export function kyivMidnight(y: number, m: number, d: number): number {
  const wall = Date.UTC(y, m - 1, d)
  let guess = wall - offset(wall)
  guess = wall - offset(guess)
  return guess
}

// Week id = the Monday (Kyiv calendar) that starts the week, `YYYY-MM-DD`.
export function weekKey(at: number): string {
  const p = parts(at)
  return iso(p.y, p.m, p.d - p.dow)
}

export function shiftWeek(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number]
  return iso(y, m, d + delta * 7)
}

export interface WeekWindow {
  key: string
  start: number
  end: number
}

// [start, end) of a league week in epoch ms.
export function weekWindow(key: string): WeekWindow {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number]
  return { key, start: kyivMidnight(y, m, d), end: kyivMidnight(y, m, d + 7) }
}

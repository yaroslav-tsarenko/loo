// Study days: `YYYY-MM-DD` keys of the learner's calendar, starting at DAY_START_HOUR (04:00) — a session after
// midnight still counts for the evening before.
//
// The calendar is Europe/Kyiv, explicitly — the same zone as the league weeks (src/game/time.ts). It used to be the
// process's local zone: on a Kyiv laptop that was right, on Vercel (UTC) days rolled over at 06:00–07:00 Kyiv time,
// so streaks, daily caps and missions disagreed with the leagues and with tests run locally. Switching moves the
// boundary 3 hours earlier; keys stay monotonic (no day is skipped or repeated). Pure: Intl only.

export const DAY_START_HOUR = 4
export const HOUR = 3_600_000
export const DAY = 24 * HOUR
export const STUDY_TZ = 'Europe/Kyiv'

const formatters = new Map<string, Intl.DateTimeFormat>()
function formatter(tz: string): Intl.DateTimeFormat {
  let f = formatters.get(tz)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
    formatters.set(tz, f)
  }
  return f
}

interface Wall {
  y: number
  m: number
  d: number
  h: number
  mi: number
  s: number
}

function wall(at: number, tz: string): Wall {
  const out: Record<string, string> = {}
  for (const p of formatter(tz).formatToParts(new Date(at))) out[p.type] = p.value
  return { y: Number(out.year), m: Number(out.month), d: Number(out.day), h: Number(out.hour) % 24, mi: Number(out.minute), s: Number(out.second) }
}

// The zone's offset from UTC at `at`, in ms.
function offset(at: number, tz: string): number {
  const w = wall(at, tz)
  return Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi, w.s) - (at - (((at % 1000) + 1000) % 1000))
}

// UTC epoch ms of 00:00 wall time in `tz` on a calendar date (day may overflow: Date.UTC normalises it).
export function zonedMidnight(y: number, m: number, d: number, tz = STUDY_TZ): number {
  const target = Date.UTC(y, m - 1, d)
  let guess = target - offset(target, tz)
  guess = target - offset(guess, tz)
  return guess
}

const iso = (y: number, m: number, d: number): string => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10)

export function dayKey(at: number, dayStartHour = DAY_START_HOUR, tz = STUDY_TZ): string {
  const w = wall(at - dayStartHour * HOUR, tz)
  return iso(w.y, w.m, w.d)
}

// Calendar arithmetic on keys (no zone involved).
export function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number]
  return iso(y, m, d + delta)
}

// Epoch ms when the study day containing `at` began — the first instant dayKey returns that day's key.
export function dayStartMs(at: number, dayStartHour = DAY_START_HOUR, tz = STUDY_TZ): number {
  const [y, m, d] = dayKey(at, dayStartHour, tz).split('-').map(Number) as [number, number, number]
  return zonedMidnight(y, m, d, tz) + dayStartHour * HOUR
}

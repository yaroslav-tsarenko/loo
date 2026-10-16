import { shiftDay } from './day'

export interface StreakInfo {
  current: number
  best: number
  todayCounted: boolean
}

// Goal days build the streak; frozen days (🧊 streak freezes spent on missed days) bridge a gap without counting.
export function computeStreak(goalDays: readonly string[], today: string, frozenDays: readonly string[] = []): StreakInfo {
  const days = new Set(goalDays)
  const frozen = new Set(frozenDays.filter((d) => !days.has(d)))
  const covered = (d: string) => days.has(d) || frozen.has(d)
  const sorted = [...new Set([...days, ...frozen])].sort()
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const day of sorted) {
    if (prev === null || shiftDay(prev, 1) !== day) run = 0
    if (days.has(day)) run++
    best = Math.max(best, run)
    prev = day
  }
  const todayCounted = days.has(today)
  let cursor = covered(today) ? today : shiftDay(today, -1)
  let current = 0
  while (covered(cursor)) {
    if (days.has(cursor)) current++
    cursor = shiftDay(cursor, -1)
  }
  return { current, best, todayCounted }
}

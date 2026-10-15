import { shiftDay } from './day'

export interface StreakInfo {
  current: number
  best: number
  todayCounted: boolean
}

export function computeStreak(goalDays: readonly string[], today: string): StreakInfo {
  const days = new Set(goalDays)
  const sorted = [...days].sort()
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const day of sorted) {
    run = prev !== null && shiftDay(prev, 1) === day ? run + 1 : 1
    best = Math.max(best, run)
    prev = day
  }
  const todayCounted = days.has(today)
  let cursor = todayCounted ? today : shiftDay(today, -1)
  let current = 0
  while (days.has(cursor)) {
    current++
    cursor = shiftDay(cursor, -1)
  }
  return { current, best, todayCounted }
}

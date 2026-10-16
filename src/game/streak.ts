import { shiftDay } from '@/progress/day'
import { computeStreak } from '@/progress/streak'

// 🧊 Streak freezes: up to MAX_FREEZES equipped; when a day was missed, the next look at the streak spends them on
// the missed days (all of them, or none if there aren't enough — a lost streak doesn't burn freezes).

// Missed days (from the day after the last covered day up to yesterday) that freezes would cover now.
export function freezesToUse(goalDays: readonly string[], frozenDays: readonly string[], today: string, available: number): string[] {
  if (available <= 0) return []
  const covered = new Set([...goalDays, ...frozenDays])
  const yesterday = shiftDay(today, -1)
  if (covered.has(today) || covered.has(yesterday)) return []
  const before = [...covered].filter((d) => d < today).sort()
  const last = before[before.length - 1]
  if (!last) return []
  // Nothing to save: the last covered day must end a real streak (at least one goal day).
  if (computeStreak(goalDays, last, frozenDays).current === 0) return []
  const gap: string[] = []
  for (let d = shiftDay(last, 1); d < today; d = shiftDay(d, 1)) {
    gap.push(d)
    if (gap.length > available) return []
  }
  return gap
}

export { computeStreak }

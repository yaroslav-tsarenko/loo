// Stat titles: a playful «rank» per skill dimension (speed, accuracy, rhythm, memory) on top of the XP level.
// Pure: thresholds → tier + progress to the next one. Titles and emoji live in src/i18n (stats.tiers.*).

import type { ProfileStats } from './metrics'

export type TierDimension = 'speed' | 'accuracy' | 'rhythm' | 'memory'

export interface Tier {
  dimension: TierDimension
  // 0 = the starting tier
  index: number
  id: string
  // the measured value the tier is based on (null = not enough data yet)
  value: number | null
  next: { id: string; at: number } | null
  // 0..1 towards the next tier
  progress: number
}

interface Ladder {
  ids: readonly string[]
  // thresholds to reach ids[1], ids[2], … ; `lowerIsBetter` for speed (seconds)
  at: readonly number[]
  lowerIsBetter?: boolean
}

export const LADDERS: Record<TierDimension, Ladder> = {
  // median seconds per question (recent 14 days)
  speed: { ids: ['turtle', 'fox', 'cheetah', 'lightning'], at: [20, 10, 5], lowerIsBetter: true },
  // accuracy of all answers, %
  accuracy: { ids: ['scout', 'archer', 'sniper', 'hawk'], at: [60, 75, 90] },
  // active days of the last 30
  rhythm: { ids: ['wanderer', 'regular', 'machine', 'iron'], at: [8, 16, 25] },
  // cards in long-term memory
  memory: { ids: ['goldfish', 'owl', 'elephant', 'librarian'], at: [10, 50, 200] },
}

export function tierFor(dimension: TierDimension, value: number | null): Tier {
  const ladder = LADDERS[dimension]
  let index = 0
  if (value !== null) {
    for (const [i, t] of ladder.at.entries()) {
      const reached = ladder.lowerIsBetter ? value <= t : value >= t
      if (reached) index = i + 1
    }
  }
  const nextAt = ladder.at[index]
  const prevAt = index > 0 ? ladder.at[index - 1]! : ladder.lowerIsBetter ? nextAt! * 2 : 0
  let progress = 1
  if (nextAt !== undefined) {
    if (value === null) progress = 0
    else if (ladder.lowerIsBetter) progress = Math.max(0, Math.min(1, (prevAt - value) / (prevAt - nextAt)))
    else progress = Math.max(0, Math.min(1, (value - prevAt) / (nextAt - prevAt)))
  }
  return { dimension, index, id: ladder.ids[index]!, value, next: nextAt !== undefined ? { id: ladder.ids[index + 1]!, at: nextAt } : null, progress }
}

export function statTiers(stats: ProfileStats): Tier[] {
  const q = stats.speed.question?.recentMs
  return [
    tierFor('speed', q === null || q === undefined ? null : Math.round(q / 100) / 10),
    tierFor('accuracy', stats.answers.total >= 10 && stats.answers.rate !== null ? Math.round(stats.answers.rate * 100) : null),
    tierFor('rhythm', stats.consistency.active30),
    tierFor('memory', stats.memory.longTerm),
  ]
}

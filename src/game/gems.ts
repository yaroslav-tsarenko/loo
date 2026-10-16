// 💎 Gems: an append-only ledger (gem_ledger), balance = sum. Earned for finishing things, spent in the shop.

export const GEMS = {
  lesson: 5,
  lessonPerfect: 10,
  topicTest: 15,
  sectionExam: 40,
  mission: 20,
  practiceSession: 0,
} as const

export const GEM_DAILY_CAP = { lesson: 100 } as const

export type AchievementTier = 'bronze' | 'silver' | 'gold'

export const ACHIEVEMENT_GEMS: Record<AchievementTier, number> = { bronze: 10, silver: 25, gold: 50 }

export interface StreakMilestone {
  days: number
  gems: number
}

export const STREAK_MILESTONES: readonly StreakMilestone[] = [
  { days: 7, gems: 50 },
  { days: 30, gems: 150 },
  { days: 100, gems: 500 },
]

// A finished lesson: 10 for a flawless run, 5 otherwise; capped per day so replays can't farm the shop.
export function lessonGems(accuracy: number, earnedToday: number): number {
  const base = accuracy >= 1 ? GEMS.lessonPerfect : GEMS.lesson
  return Math.max(0, Math.min(base, GEM_DAILY_CAP.lesson - Math.max(0, earnedToday)))
}

// Milestones a streak of `days` has reached (each is paid once per user; the ledger's unique ref keeps it so).
export const streakMilestones = (days: number): StreakMilestone[] => STREAK_MILESTONES.filter((m) => days >= m.days)

export const gemBalance = (amounts: readonly number[]): number => amounts.reduce((s, n) => s + n, 0)

// Stable ledger refs (gem_ledger has a unique (user_id, reason, ref_id)): each award can only land once.
export const gemRef = {
  lesson: (sessionId: string) => `lesson:${sessionId}`,
  test: (testId: string) => `pass:${testId}`,
  mission: (day: string) => `mission:${day}`,
  streak: (days: number) => `streak-${days}`,
  achievement: (id: string) => `ach:${id}`,
  league: (week: string) => `league:${week}`,
  practice: (sessionId: string) => `practice:${sessionId}`,
}

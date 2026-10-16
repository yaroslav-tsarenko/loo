// Two currencies (docs/ECONOMY.md), both append-only ledgers (balance = sum) with a unique (user, reason, ref):
// * bucks (buck_ledger) — earned often and in small amounts for routine learning, under a daily cap per source;
//   spent on consumables and common / rare gear;
// * gems (gem_ledger) — earned only for achievements of note («звершення»); spent on epic / legendary gear and rare
//   skins. There is no exchange between them.

export type Currency = 'bucks' | 'gems'
export const CURRENCIES: readonly Currency[] = ['bucks', 'gems']

// ── Bucks: routine actions ─────────────────────────────────────────────────────────────────────────────────────

export const BUCKS = {
  lesson: 10,
  lessonPerfect: 20,
  topicTest: 30,
  mission: 40,
  practice: 15,
} as const

export type BuckReason = 'lesson' | 'topic-test' | 'mission' | 'practice'

// Per source and Kyiv day, so replays can't farm the shop.
export const BUCKS_DAILY_CAP: Record<BuckReason, number> = { lesson: 200, 'topic-test': 150, mission: 40, practice: 60 }

// The part of `amount` that still fits under today's cap for the source.
export function cappedBucks(amount: number, earnedToday: number, reason: BuckReason): number {
  const room = Math.max(0, BUCKS_DAILY_CAP[reason] - Math.max(0, earnedToday))
  return Math.max(0, Math.min(Math.round(amount), room))
}

// A finished lesson: 20 for a flawless run, 10 otherwise.
export function lessonBucks(accuracy: number, earnedToday: number): number {
  return cappedBucks(accuracy >= 1 ? BUCKS.lessonPerfect : BUCKS.lesson, earnedToday, 'lesson')
}

export const buckRef = {
  lesson: (sessionId: string) => `lesson:${sessionId}`,
  test: (testId: string) => `pass:${testId}`,
  mission: (day: string) => `mission:${day}`,
  practice: (sessionId: string) => `practice:${sessionId}`,
}

// ── Gems: «звершення» only ─────────────────────────────────────────────────────────────────────────────────────

export const GEMS = {
  sectionExam: 40,
} as const

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
  { days: 365, gems: 1500 },
]

// Milestones a streak of `days` has reached (each is paid once per user; the ledger's unique ref keeps it so).
export const streakMilestones = (days: number): StreakMilestone[] => STREAK_MILESTONES.filter((m) => days >= m.days)

export const gemBalance = (amounts: readonly number[]): number => amounts.reduce((s, n) => s + n, 0)

// Stable ledger refs (gem_ledger has a unique (user_id, reason, ref_id)): each award can only land once.
export const gemRef = {
  exam: (examId: string) => `pass:${examId}`,
  streak: (days: number) => `streak-${days}`,
  achievement: (id: string) => `ach:${id}`,
  league: (week: string) => `league:${week}`,
  // the 56-step warrior ladder (0009); `evo:<n>` refs belong to the old 22-step one and are never reused
  rank: (step: number) => `rank:${step}`,
}

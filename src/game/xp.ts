// XP anti-cheat rules on top of src/progress/xp.ts (which decides how much an answer is worth):
// * a daily cap per source, so no single farmable source can dominate a league week;
// * only server-graded sources count for leagues (self-rated flashcards and client-reported tasks don't).

export type XpReason = 'flashcard' | 'quiz' | 'task' | 'lesson' | 'topic-test' | 'section-exam' | 'mission' | 'achievement' | 'placement'

export const XP_DAILY_CAP: Record<XpReason, number> = {
  flashcard: 300,
  quiz: 900,
  task: 800,
  lesson: 300,
  'topic-test': 400,
  'section-exam': 600,
  mission: 300,
  achievement: 1000,
  placement: 0,
}

// Sources that are graded by the server from the raw answer (or awarded by it): these build the weekly league score.
export const LEAGUE_XP_REASONS: readonly XpReason[] = ['quiz', 'lesson', 'topic-test', 'section-exam', 'mission', 'achievement']

export const isXpReason = (s: string): s is XpReason => s in XP_DAILY_CAP

// The part of `amount` (already boosted) that still fits under today's cap for the source.
export function cappedXp(amount: number, earnedToday: number, reason: XpReason): number {
  const room = Math.max(0, XP_DAILY_CAP[reason] - Math.max(0, earnedToday))
  return Math.max(0, Math.min(Math.round(amount), room))
}

export const boostedXp = (amount: number, multiplier: number): number => Math.round(Math.max(0, amount) * multiplier)

import type { Difficulty, Level, QuizMode, UnitKind } from '@/content/model'

export type FlashRating = 'again' | 'hard' | 'good'
export type Outcome = FlashRating | 'correct' | 'wrong' | 'solved' | 'failed'

export interface AttemptInput {
  unitId: string
  kind: UnitKind
  outcome: Outcome
  level: Level | null
  quizMode?: QuizMode
  difficulty?: Difficulty
  hintsUsed: number
  at: number
}

export interface UnitHistory {
  everCorrect: boolean
  lastCorrectDay: string | null
}

export interface MistakeState {
  unitId: string
  source: UnitKind
  wrongCount: number
  correctStreak: number
  lastCorrectAt: number | null
  firstWrongAt: number
  lastWrongAt: number
  resolvedAt: number | null
}

export type Effect =
  | { type: 'xp'; amount: number; reason: string }
  | { type: 'level-up'; level: number; rank: string }
  | { type: 'rank-up'; rank: string }
  | { type: 'achievement'; id: string; title: string; description: string; tier?: 'bronze' | 'silver' | 'gold' }
  | { type: 'mistake-added'; unitId: string }
  | { type: 'mistake-resolved'; unitId: string }
  | { type: 'streak'; days: number }
  | { type: 'daily-goal'; goal: number }
  | { type: 'mission'; budget: number; bonusXp: number }
  // Phase 4 game layer (src/game)
  | { type: 'gems'; amount: number; reason: string }
  | { type: 'hearts'; hearts: number; delta: number }
  | { type: 'freeze'; days: number }
  | { type: 'league'; tier: string; result: 'promoted' | 'stayed' | 'demoted'; rank: number }
  // Loo evolved: steps `from` → `step` (src/game/ranks.ts), 💎 paid for the steps passed
  | { type: 'evolution'; from: number; step: number; title: string; form: string; tier: number; gems: number }

export function isCorrectOutcome(outcome: Outcome): boolean {
  return outcome === 'good' || outcome === 'hard' || outcome === 'correct' || outcome === 'solved'
}

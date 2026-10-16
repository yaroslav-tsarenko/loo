import type { Difficulty, Level } from '@/content/model'
import type { AttemptInput, UnitHistory } from './types'
import { dayKey } from './day'

// CEFR levels of language courses grow like the IT ones (A1 ≈ junior … C2 ≈ techlead).
export const LEVEL_BASE_XP: Record<Level, number> = { junior: 10, middle: 15, senior: 25, techlead: 35, A1: 10, A2: 12, B1: 15, B2: 20, C1: 25, C2: 35 }
export const DEFAULT_BASE_XP = 12
export const TASK_XP: Record<Difficulty, number> = { easy: 30, medium: 50, hard: 80 }
export const REPEAT_FACTOR = 0.4
export const OUTPUT_FACTOR = 1.2
// Writing / assembling code is harder than recognising it
export const BUILD_FACTOR = 1.3
export const MISTAKE_RESOLVED_XP = 5
export const ACHIEVEMENT_XP = 25

export function baseXp(level: Level | null): number {
  return level ? LEVEL_BASE_XP[level] : DEFAULT_BASE_XP
}

function quizFactor(mode: AttemptInput['quizMode']): number {
  // saying a phrase aloud ([!speak]) is production, like predicting output
  if (mode === 'output' || mode === 'speak') return OUTPUT_FACTOR
  if (mode === 'order' || mode === 'fill') return BUILD_FACTOR
  return 1
}

export function rawXp(input: AttemptInput): number {
  const base = baseXp(input.level)
  switch (input.kind) {
    case 'flashcard':
      if (input.outcome === 'good') return base
      if (input.outcome === 'hard') return Math.round(base * 0.5)
      return 0
    case 'quiz':
      if (input.outcome !== 'correct') return 0
      return Math.round(base * quizFactor(input.quizMode))
    case 'task': {
      if (input.outcome !== 'solved') return 0
      const factor = Math.max(0.4, 1 - 0.2 * input.hintsUsed)
      return Math.round(TASK_XP[input.difficulty ?? 'medium'] * factor)
    }
  }
}

export function xpForAttempt(input: AttemptInput, history: UnitHistory): number {
  const xp = rawXp(input)
  if (xp === 0) return 0
  if (history.lastCorrectDay === dayKey(input.at)) return 0
  if (history.everCorrect) return Math.max(1, Math.round(xp * REPEAT_FACTOR))
  return xp
}

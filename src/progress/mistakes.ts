import type { UnitKind } from '@/content/model'
import { HOUR } from './day'
import type { MistakeState } from './types'

export const MISTAKE_EXIT_STREAK = 2
export const MISTAKE_MIN_GAP = 20 * HOUR

export interface MistakeUpdate {
  state: MistakeState | null
  added: boolean
  resolved: boolean
}

export function applyMistake(prev: MistakeState | null, unitId: string, source: UnitKind, correct: boolean, at: number): MistakeUpdate {
  const open = prev !== null && prev.resolvedAt === null
  if (!correct) {
    const state: MistakeState = prev
      ? { ...prev, wrongCount: prev.wrongCount + 1, correctStreak: 0, lastCorrectAt: null, lastWrongAt: at, resolvedAt: null }
      : { unitId, source, wrongCount: 1, correctStreak: 0, lastCorrectAt: null, firstWrongAt: at, lastWrongAt: at, resolvedAt: null }
    return { state, added: !open, resolved: false }
  }
  if (!prev || !open) return { state: prev, added: false, resolved: false }
  if (prev.correctStreak === 0 || prev.lastCorrectAt === null) {
    return { state: { ...prev, correctStreak: 1, lastCorrectAt: at }, added: false, resolved: false }
  }
  if (at - prev.lastCorrectAt < MISTAKE_MIN_GAP) return { state: prev, added: false, resolved: false }
  const streak = prev.correctStreak + 1
  if (streak >= MISTAKE_EXIT_STREAK) {
    return { state: { ...prev, correctStreak: streak, lastCorrectAt: at, resolvedAt: at }, added: false, resolved: true }
  }
  return { state: { ...prev, correctStreak: streak, lastCorrectAt: at }, added: false, resolved: false }
}

export function nextEligibleAt(state: MistakeState): number | null {
  if (state.resolvedAt !== null || state.lastCorrectAt === null || state.correctStreak === 0) return null
  return state.lastCorrectAt + MISTAKE_MIN_GAP
}

import { dayKey } from './day'
import { levelInfo } from './levels'
import { applyMistake } from './mistakes'
import { review, type SrsCard } from './srs'
import { isCorrectOutcome, type AttemptInput, type Effect, type FlashRating, type MistakeState, type UnitHistory } from './types'
import { MISTAKE_RESOLVED_XP, xpForAttempt } from './xp'

export interface EngineState {
  history: UnitHistory
  srs: SrsCard | null
  mistake: MistakeState | null
  totalXp: number
}

export interface EngineResult {
  correct: boolean
  day: string
  xp: number
  srs: SrsCard | null
  mistake: MistakeState | null
  mistakeChanged: boolean
  effects: Effect[]
}

export function applyAttempt(input: AttemptInput, state: EngineState): EngineResult {
  const correct = isCorrectOutcome(input.outcome)
  const day = dayKey(input.at)
  const effects: Effect[] = []
  let xp = xpForAttempt(input, state.history)
  if (xp > 0) effects.push({ type: 'xp', amount: xp, reason: input.kind })
  const srs = input.kind === 'flashcard' ? review(state.srs, input.outcome as FlashRating, input.at) : state.srs
  const mistake = applyMistake(state.mistake, input.unitId, input.kind, correct, input.at)
  if (mistake.added) effects.push({ type: 'mistake-added', unitId: input.unitId })
  if (mistake.resolved) {
    effects.push({ type: 'mistake-resolved', unitId: input.unitId })
    effects.push({ type: 'xp', amount: MISTAKE_RESOLVED_XP, reason: 'mistake-resolved' })
    xp += MISTAKE_RESOLVED_XP
  }
  const before = levelInfo(state.totalXp)
  const after = levelInfo(state.totalXp + xp)
  if (after.level > before.level) effects.push({ type: 'level-up', level: after.level, rank: after.rank.title })
  if (after.rank.id !== before.rank.id) effects.push({ type: 'rank-up', rank: after.rank.title })
  return { correct, day, xp, srs, mistake: mistake.state, mistakeChanged: mistake.state !== state.mistake, effects }
}

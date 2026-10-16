import type { OrderExercise, QuizUnit } from '../../model'
import { blankMatches } from './exercise'

// One answer checker for the client (instant feedback) and the server (tests, exams, placement grading).

export interface QuizAnswer {
  // option ids (single / multi), the pieces' code in order (order), blank values in order (fill)
  chosen: readonly string[]
  // typed answer (free «what does it print»)
  text?: string | null
}

export const normalizeFreeAnswer = (s: string): string => s.replace(/[\s,;]+/g, ' ').replace(/[`'"]/g, '').trim().toLowerCase()

export function isFreeQuiz(unit: Pick<QuizUnit, 'mode' | 'options' | 'freeAnswer'>): boolean {
  return unit.mode !== 'order' && unit.mode !== 'fill' && unit.options.length === 0 && unit.freeAnswer !== null
}

export function gradeQuiz(unit: QuizUnit, answer: QuizAnswer): boolean {
  // Order answers are code, not piece ids: the client only ever sees shuffled pieces (src/content/blocks/quiz/view.ts).
  if (unit.mode === 'order') return unit.exercise?.kind === 'order' ? orderCodesMatch(unit.exercise, answer.chosen) : false
  if (unit.mode === 'fill') {
    if (unit.exercise?.kind !== 'fill') return false
    const blanks = unit.exercise.segments.flatMap((s) => (s.kind === 'blank' ? [s] : []))
    return blanks.length > 0 && answer.chosen.length === blanks.length && blanks.every((b, i) => blankMatches(b.answers, answer.chosen[i] ?? ''))
  }
  if (isFreeQuiz(unit)) {
    const text = answer.text ?? ''
    return text.trim() !== '' && normalizeFreeAnswer(text) === normalizeFreeAnswer(unit.freeAnswer ?? '')
  }
  const right = unit.options.filter((o) => o.correct).map((o) => o.id).sort()
  const picked = [...new Set(answer.chosen)].sort()
  return right.length > 0 && right.length === picked.length && picked.every((id, i) => id === right[i])
}

export function orderCodesMatch(ex: OrderExercise, codes: readonly string[]): boolean {
  const want = ex.pieces.filter((p) => !p.distractor).map((p) => p.code)
  return codes.length === want.length && codes.every((c, i) => c === want[i])
}

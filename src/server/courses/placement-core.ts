import { placementResult, placementTest, type CourseBundle, type PlacementAnswer, type PlacementOptions, type PlacementResult, type PlacementStep } from '@/course'
import type { LearningUnit } from '@/content/model'
import { gradeQuiz } from '@/content/blocks/quiz/grade'

// Server side of the stateless placement test (/placement): the client sends every raw answer so far; the server
// replays the adaptive sequence, checks that each answer is for the question it would have asked at that point,
// grades it from the content, and returns the next question or the result. Nothing is stored until «apply».

export interface RawPlacementAnswer {
  id: string
  chosen: readonly string[]
  text: string | null
  // «Не знаю»: wrong, but not a guess (bank mode)
  dontKnow?: boolean
}

export const placementSeed = (userId: string, nonce: string): string => `${userId}:placement:${nonce}`

export type PlacementReplay = { ok: true; graded: PlacementAnswer[]; step: PlacementStep; result: PlacementResult | null } | { ok: false; reason: 'out-of-order' | 'not-a-quiz' }

export function replayPlacement(bundle: CourseBundle, answers: readonly RawPlacementAnswer[], seed: string, unitOf: (id: string) => LearningUnit | null, opts: PlacementOptions = {}): PlacementReplay {
  const graded: PlacementAnswer[] = []
  for (const answer of answers) {
    const expected = placementTest(bundle, graded, seed, opts)
    if (expected.done || expected.next !== answer.id) return { ok: false, reason: 'out-of-order' }
    const unit = unitOf(answer.id)
    if (!unit || unit.kind !== 'quiz') return { ok: false, reason: 'not-a-quiz' }
    if (answer.dontKnow) graded.push({ exerciseId: answer.id, correct: false, dontKnow: true })
    else graded.push({ exerciseId: answer.id, correct: gradeQuiz(unit, { chosen: answer.chosen, text: answer.text }) })
  }
  const step = placementTest(bundle, graded, seed, opts)
  return { ok: true, graded, step, result: step.done ? placementResult(bundle, graded) : null }
}

// A placement question: a bank item (`_placement/`, outside the course's exercises) or a lesson quiz of the course.
export function placementUnitOf(bundle: CourseBundle, bankUnits: ReadonlyMap<string, LearningUnit>, courseUnit: (id: string) => LearningUnit | null): (id: string) => LearningUnit | null {
  return (id) => (bundle.placement.bank ? (bundle.placement.bank[id] ? bankUnits.get(id) ?? null : null) : courseUnit(id))
}

import { placementResult, placementTest, type CourseBundle, type PlacementAnswer, type PlacementResult, type PlacementStep } from '@/course'
import type { LearningUnit } from '@/content/model'
import { gradeQuiz } from '@/content/blocks/quiz/grade'

// Server side of the stateless placement test (/placement): the client sends every raw answer so far; the server
// replays the adaptive sequence, checks that each answer is for the question it would have asked at that point,
// grades it from the content, and returns the next question or the result. Nothing is stored until «apply».

export interface RawPlacementAnswer {
  id: string
  chosen: readonly string[]
  text: string | null
}

export const placementSeed = (userId: string, nonce: string): string => `${userId}:placement:${nonce}`

export type PlacementReplay = { ok: true; graded: PlacementAnswer[]; step: PlacementStep; result: PlacementResult | null } | { ok: false; reason: 'out-of-order' | 'not-a-quiz' }

export function replayPlacement(bundle: CourseBundle, answers: readonly RawPlacementAnswer[], seed: string, unitOf: (id: string) => LearningUnit | null): PlacementReplay {
  const graded: PlacementAnswer[] = []
  for (const answer of answers) {
    const expected = placementTest(bundle, graded, seed)
    if (expected.done || expected.next !== answer.id) return { ok: false, reason: 'out-of-order' }
    const unit = unitOf(answer.id)
    if (!unit || unit.kind !== 'quiz') return { ok: false, reason: 'not-a-quiz' }
    graded.push({ exerciseId: answer.id, correct: gradeQuiz(unit, { chosen: answer.chosen, text: answer.text }) })
  }
  const step = placementTest(bundle, graded, seed)
  return { ok: true, graded, step, result: step.done ? placementResult(bundle, graded) : null }
}

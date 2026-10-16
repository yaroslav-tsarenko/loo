import { buildSectionExam, buildTopicTest, lookup, testKindOf, type BuiltTest, type CourseBundle, type Section, type Topic } from '@/course'
import type { LearningUnit } from '@/content/model'
import { gradeQuiz } from '@/content/blocks/quiz/grade'

// Topic tests / section exams on the server: resolving ids, the per-attempt draw and grading. Framework-free.

export interface ResolvedTest {
  id: string
  kind: BuiltTest['kind']
  bundle: CourseBundle
  section: Section
  topic: Topic | null
}

export function resolveTest(bundle: CourseBundle, id: string): ResolvedTest | null {
  const kind = testKindOf(id)
  if (!kind) return null
  const index = lookup(bundle)
  if (kind === 'topic-test') {
    const topic = [...index.topics.values()].find((t) => t.test?.id === id)
    const section = topic ? index.sections.get(topic.sectionId) : undefined
    return topic && section ? { id, kind, bundle, section, topic } : null
  }
  const section = bundle.sections.find((s) => s.exam?.id === id)
  return section ? { id, kind, bundle, section, topic: null } : null
}

// Attempt n of a learner always draws the same questions: seed `${userId}:${n}` (docs/COURSE_FORMAT.md §5).
export const attemptSeed = (userId: string, attempt: number): string => `${userId}:${attempt}`

export function drawTest(test: ResolvedTest, seed: string): BuiltTest | null {
  return test.kind === 'topic-test' ? buildTopicTest(test.bundle, test.topic!.id, seed) : buildSectionExam(test.bundle, test.section.id, seed)
}

export interface SubmittedAnswer {
  id: string
  // quizzes: option / piece ids or blank values; text: a typed free answer
  chosen: readonly string[]
  text: string | null
  // self-graded cards (thin topics only)
  rating: 'again' | 'hard' | 'good' | null
}

// Server-side verdict for one answer. Quizzes are re-checked against the content (never the client's «correct»);
// cards can only be self-rated, and only count when the compiler put them into the test's fallback pool.
export function gradeAnswer(test: BuiltTest, unit: LearningUnit | null, answer: SubmittedAnswer | undefined, fallback: ReadonlySet<string>): boolean {
  if (!unit || !answer || answer.id !== unit.id || !test.questions.includes(unit.id)) return false
  if (unit.kind === 'quiz') return gradeQuiz(unit, { chosen: answer.chosen, text: answer.text })
  if (unit.kind === 'flashcard') return fallback.has(unit.id) && answer.rating !== null && answer.rating !== 'again'
  return false
}

export function fallbackPool(test: ResolvedTest): ReadonlySet<string> {
  return new Set(test.kind === 'topic-test' ? test.topic!.test?.fallback ?? [] : test.section.exam?.fallback ?? [])
}

// Bonus XP on top of per-question XP: once for the first pass, once for the first flawless score.
export const TEST_XP = { topic: 20, exam: 50, testOut: 30, perfect: 10 } as const

export function testBonus(kind: BuiltTest['kind'], before: { passed: boolean; bestScore: number }, after: { passed: boolean; score: number; testOut: boolean }): number {
  let xp = 0
  if (after.passed && !before.passed) xp += kind === 'topic-test' ? TEST_XP.topic : TEST_XP.exam + (after.testOut ? TEST_XP.testOut : 0)
  if (after.score >= 1 && before.bestScore < 1) xp += TEST_XP.perfect
  return xp
}

import { rng, shuffle, type Seed } from '../rng'
import type { CourseBundle, Section } from '../schema'
import { lookup } from './lookup'

// Topic tests and section exams: a deterministic draw from the compiled pools.
// Seed per learner and attempt (e.g. `${userId}:${attempt}`) → the same questions on every render.

export interface BuiltTest {
  id: string
  kind: 'topic-test' | 'section-exam'
  // exercise ids in display order
  questions: string[]
  pass: number
  // correct answers needed to pass
  needed: number
}

const neededFor = (count: number, pass: number) => Math.max(1, Math.ceil(count * pass - 1e-9))

export function buildTopicTest(bundle: CourseBundle, topicId: string, seed: Seed): BuiltTest | null {
  const topic = lookup(bundle).topics.get(topicId)
  const test = topic?.test
  if (!test || test.questions === 0) return null
  const random = rng(`${test.id}|${seed}`)
  const picked = shuffle(test.pool, random).slice(0, test.questions)
  if (picked.length < test.questions) picked.push(...shuffle(test.fallback, random).slice(0, test.questions - picked.length))
  const questions = shuffle(picked, random)
  return { id: test.id, kind: 'topic-test', questions, pass: test.pass, needed: neededFor(questions.length, test.pass) }
}

// Stratified: round-robin over topics (each shuffled), so every topic of the section is represented.
export function buildSectionExam(bundle: CourseBundle, sectionId: string, seed: Seed): BuiltTest | null {
  const section = lookup(bundle).sections.get(sectionId)
  const exam = section?.exam
  if (!section || !exam || exam.questions === 0) return null
  const random = rng(`${exam.id}|${seed}`)
  const queues = section.topics.map((t) => shuffle(exam.pool[t.id] ?? [], random)).filter((q) => q.length > 0)
  const picked: string[] = []
  const order = shuffle(queues.map((_, i) => i), random)
  while (picked.length < exam.questions && queues.some((q) => q.length > 0)) {
    for (const i of order) {
      const next = queues[i]!.shift()
      if (next !== undefined) picked.push(next)
      if (picked.length >= exam.questions) break
    }
  }
  if (picked.length < exam.questions) picked.push(...shuffle(exam.fallback, random).slice(0, exam.questions - picked.length))
  const questions = shuffle(picked, random)
  return { id: exam.id, kind: 'section-exam', questions, pass: exam.pass, needed: neededFor(questions.length, exam.pass) }
}

export function testPassed(test: Pick<BuiltTest, 'needed'>, correct: number): boolean {
  return correct >= test.needed
}

export interface TestOutProgress {
  // section ids (full or keys) whose exam is already passed or which are completed
  passedSections: readonly string[]
}

export interface TestOutCheck {
  eligible: boolean
  reason: 'ok' | 'disabled' | 'no-exam' | 'practice' | 'already-passed' | 'unknown-section'
}

// Test-out: any time, a learner may take a section's exam to skip it — unless the course disables it.
export function testOutEligible(bundle: CourseBundle, sectionId: string, progress: TestOutProgress): TestOutCheck {
  const section: Section | undefined = lookup(bundle).sections.get(sectionId)
  if (!section) return { eligible: false, reason: 'unknown-section' }
  if (section.kind === 'practice') return { eligible: false, reason: 'practice' }
  if (!section.exam) return { eligible: false, reason: 'no-exam' }
  if (!section.exam.testOut) return { eligible: false, reason: 'disabled' }
  if (progress.passedSections.includes(section.id) || progress.passedSections.includes(section.key)) return { eligible: false, reason: 'already-passed' }
  return { eligible: true, reason: 'ok' }
}

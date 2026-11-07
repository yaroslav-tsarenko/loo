import 'server-only'
import { and, eq, gte, lt } from 'drizzle-orm'
import { buildCoursePath } from '@/course'
import { first, type Conn } from '@/db/client'
import { attempts as attemptsTable, examResults, topicResults, type StoredAnswer } from '@/db/schema'
import { courseProgress } from './path'
import { learnerLevel } from './lessons'
import { courseFor } from './registry'
import { attemptSeed, drawTest, resolveTest, type ResolvedTest } from './tests-core'

export async function resolveTestById(id: string): Promise<ResolvedTest> {
  const bundle = await courseFor(id)
  const test = bundle ? resolveTest(bundle, id) : null
  if (!test) throw new Error('Unknown test')
  return test
}

export interface TestRecord {
  attempts: number
  graded: number
  lastSeed: string | null
  bestScore: number
  passed: boolean
  // first server-checked answer per question index of the current attempt
  answers: Record<string, StoredAnswer>
  // when the current attempt started (null: started before this was recorded)
  startedAt: number | null
}

// The learner's row for a topic test or section exam (null = never started).
export async function readTestRecord(conn: Conn, userId: string, test: ResolvedTest): Promise<TestRecord | null> {
  if (test.kind === 'topic-test') {
    const row = await first(
      conn
        .select()
        .from(topicResults)
        .where(and(eq(topicResults.userId, userId), eq(topicResults.testId, test.id))),
    )
    return row ? { attempts: row.attempts, graded: row.graded, lastSeed: row.lastSeed, bestScore: row.bestScore, passed: row.passedAt !== null, answers: row.answers ?? {}, startedAt: row.attemptStartedAt ?? null } : null
  }
  const row = await first(
    conn
      .select()
      .from(examResults)
      .where(and(eq(examResults.userId, userId), eq(examResults.examId, test.id))),
  )
  return row ? { attempts: row.attempts, graded: row.graded, lastSeed: row.lastSeed, bestScore: row.bestScore, passed: row.passedAt !== null, answers: row.answers ?? {}, startedAt: row.attemptStartedAt ?? null } : null
}

// Records that attempt n started (n = attempts + 1; re-starting the same ungraded attempt is a no-op).
export async function startAttempt(conn: Conn, userId: string, test: ResolvedTest, attempt: number, seed: string, now: number): Promise<boolean> {
  const record = await readTestRecord(conn, userId, test)
  const attempts = record?.attempts ?? 0
  const graded = record?.graded ?? 0
  if (attempt === attempts && graded < attempt) return true
  if (attempt !== attempts + 1) return false
  const courseId = test.bundle.course.id
  if (test.kind === 'topic-test') {
    await conn
      .insert(topicResults)
      .values({ userId, testId: test.id, courseId, attempts: attempt, lastSeed: seed, attemptStartedAt: now, updatedAt: now })
      .onConflictDoUpdate({ target: [topicResults.userId, topicResults.testId], set: { attempts: attempt, lastSeed: seed, lastScore: null, answers: null, attemptStartedAt: now, updatedAt: now } })
  } else {
    await conn
      .insert(examResults)
      .values({ userId, examId: test.id, courseId, sectionId: test.section.id, attempts: attempt, lastSeed: seed, attemptStartedAt: now, updatedAt: now })
      .onConflictDoUpdate({ target: [examResults.userId, examResults.examId], set: { attempts: attempt, lastSeed: seed, lastScore: null, answers: null, attemptStartedAt: now, updatedAt: now } })
  }
  return true
}

// answerQuiz during a test: the answer must belong to the started, ungraded attempt at that position. The first answer
// per question is kept and the final grade (submitTest) uses it — a later resubmission can't change it.
//
// The caller holds the learner's lock (answerQuiz: ScopeOptions.lock), so this read-merge-write can't lose a parallel
// answer. An exercise of the draw that was already answered somewhere else since the attempt started (an article,
// a practice session — anything that reveals the key) is stored as unanswered: it counts as wrong.
export async function storeTestAnswer(conn: Conn, userId: string, test: ResolvedTest, attempt: number, index: number, answer: StoredAnswer, now: number): Promise<boolean> {
  const record = await readTestRecord(conn, userId, test)
  const seed = attemptSeed(userId, attempt)
  if (!record || record.attempts !== attempt || record.graded >= attempt || record.lastSeed !== seed) return false
  const built = drawTest(test, seed)
  if (!built || built.questions[index] !== answer.id) return false
  if (record.answers[String(index)]) return true
  const peeked = record.startedAt !== null && (await answeredSince(conn, userId, answer.id, record.startedAt))
  const answers = { ...record.answers, [String(index)]: peeked ? { id: answer.id, chosen: [], text: null } : answer }
  if (test.kind === 'topic-test') {
    await conn
      .update(topicResults)
      .set({ answers, updatedAt: now })
      .where(and(eq(topicResults.userId, userId), eq(topicResults.testId, test.id)))
  } else {
    await conn
      .update(examResults)
      .set({ answers, updatedAt: now })
      .where(and(eq(examResults.userId, userId), eq(examResults.examId, test.id)))
  }
  return true
}

async function answeredSince(conn: Conn, userId: string, unitId: string, since: number): Promise<boolean> {
  const row = await first(
    conn
      .select({ id: attemptsTable.id })
      .from(attemptsTable)
      .where(and(eq(attemptsTable.userId, userId), eq(attemptsTable.unitId, unitId), gte(attemptsTable.answeredAt, since)))
      .limit(1),
  )
  return row !== undefined
}

// Grades attempt n once: the update claims it (graded < n), so a second submit of the same attempt throws.
export async function saveGrade(conn: Conn, userId: string, test: ResolvedTest, attempt: number, score: number, passed: boolean, testOut: boolean, now: number): Promise<void> {
  const record = await readTestRecord(conn, userId, test)
  const bestScore = Math.max(record?.bestScore ?? 0, score)
  if (test.kind === 'topic-test') {
    const row = await first(
      conn
        .select({ passedAt: topicResults.passedAt })
        .from(topicResults)
        .where(and(eq(topicResults.userId, userId), eq(topicResults.testId, test.id))),
    )
    await conn
      .update(topicResults)
      .set({ graded: attempt, lastScore: score, bestScore, passedAt: row?.passedAt ?? (passed ? now : null), updatedAt: now })
      .where(and(eq(topicResults.userId, userId), eq(topicResults.testId, test.id), lt(topicResults.graded, attempt)))
      .returning({ graded: topicResults.graded })
      .then(claimed)
    return
  }
  const row = await first(
    conn
      .select({ passedAt: examResults.passedAt, testOut: examResults.testOut })
      .from(examResults)
      .where(and(eq(examResults.userId, userId), eq(examResults.examId, test.id))),
  )
  await conn
    .update(examResults)
    .set({ graded: attempt, lastScore: score, bestScore, passedAt: row?.passedAt ?? (passed ? now : null), testOut: row?.passedAt ? row.testOut : passed && testOut, updatedAt: now })
    .where(and(eq(examResults.userId, userId), eq(examResults.examId, test.id), lt(examResults.graded, attempt)))
    .returning({ graded: examResults.graded })
    .then(claimed)
}

function claimed(rows: unknown[]): void {
  if (rows.length === 0) throw new Error('Stale attempt')
}

// An exam taken before the section's lessons and topic tests were all done is a test-out («перескочити розділ»).
export async function sectionUnfinished(test: ResolvedTest): Promise<boolean> {
  if (test.kind !== 'section-exam') return false
  const level = await learnerLevel(test.bundle.course.id)
  const progress = await courseProgress(test.bundle)
  const view = buildCoursePath(test.bundle, level, { ...progress, placementSection: null })
  const section = view.sections.find((s) => s.section.id === test.section.id)
  if (!section) return false
  return section.topics.some((t) => t.done < t.total)
}

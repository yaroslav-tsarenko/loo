import 'server-only'
import { and, eq } from 'drizzle-orm'
import { buildCoursePath } from '@/course'
import { first, type Conn } from '@/db/client'
import { examResults, topicResults } from '@/db/schema'
import { courseProgress } from './path'
import { learnerLevel } from './lessons'
import type { ResolvedTest } from './tests-core'

export interface TestRecord {
  attempts: number
  graded: number
  lastSeed: string | null
  bestScore: number
  passed: boolean
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
    return row ? { attempts: row.attempts, graded: row.graded, lastSeed: row.lastSeed, bestScore: row.bestScore, passed: row.passedAt !== null } : null
  }
  const row = await first(
    conn
      .select()
      .from(examResults)
      .where(and(eq(examResults.userId, userId), eq(examResults.examId, test.id))),
  )
  return row ? { attempts: row.attempts, graded: row.graded, lastSeed: row.lastSeed, bestScore: row.bestScore, passed: row.passedAt !== null } : null
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
      .values({ userId, testId: test.id, courseId, attempts: attempt, lastSeed: seed, updatedAt: now })
      .onConflictDoUpdate({ target: [topicResults.userId, topicResults.testId], set: { attempts: attempt, lastSeed: seed, lastScore: null, updatedAt: now } })
  } else {
    await conn
      .insert(examResults)
      .values({ userId, examId: test.id, courseId, sectionId: test.section.id, attempts: attempt, lastSeed: seed, updatedAt: now })
      .onConflictDoUpdate({ target: [examResults.userId, examResults.examId], set: { attempts: attempt, lastSeed: seed, lastScore: null, updatedAt: now } })
  }
  return true
}

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
      .where(and(eq(topicResults.userId, userId), eq(topicResults.testId, test.id)))
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
    .where(and(eq(examResults.userId, userId), eq(examResults.examId, test.id)))
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

import 'server-only'
import { and, eq, gte, isNull, sql } from 'drizzle-orm'
import { RECENT_DAYS } from '@/course'
import type { Conn } from '@/db/client'
import { attempts, mistakes, topicResults } from '@/db/schema'
import { read } from '../db/batch'

// Batchable reads of the learner's practice signals (src/course/select/adaptive.ts → PracticeSignals).

// Open mistakes, wrong answers of the last RECENT_DAYS days per exercise, best topic-test score per topic. The whole
// learner's rows (a learner has at most a few thousand), filtered in JS — no id lists as parameters.
export function signalReads(db: Conn, userId: string, courseId: string, now: number) {
  const since = now - RECENT_DAYS * 86_400_000
  return [
    read(
      db
        .select({ unitId: mistakes.unitId, wrongCount: mistakes.wrongCount })
        .from(mistakes)
        .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
      (rows) => new Map(rows.map((r) => [r.unitId, { wrongCount: Number(r.wrongCount) }])),
    ),
    read(
      db
        .select({ unitId: attempts.unitId, n: sql<number>`count(*)` })
        .from(attempts)
        .where(and(eq(attempts.userId, userId), eq(attempts.correct, false), gte(attempts.answeredAt, since)))
        .groupBy(attempts.unitId),
      (rows) => new Map(rows.map((r) => [r.unitId, Number(r.n)])),
    ),
    read(
      db
        .select({ testId: topicResults.testId, best: topicResults.bestScore, graded: topicResults.graded })
        .from(topicResults)
        .where(and(eq(topicResults.userId, userId), eq(topicResults.courseId, courseId))),
      // `<topic>:test` → topic id; only graded attempts say anything
      (rows) => new Map(rows.filter((r) => Number(r.graded) > 0).map((r) => [r.testId.replace(/:test$/, ''), Number(r.best)])),
    ),
  ] as const
}

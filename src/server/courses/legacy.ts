import 'server-only'
import { and, eq, inArray, isNull, like, sql } from 'drizzle-orm'
import type { CourseBundle } from '@/course'
import type { Conn } from '@/db/client'
import { lessonProgress } from '@/db/schema'
import { planLegacyMigration } from './legacy-core'

// Lazy, idempotent carry-over of lesson_progress to course lesson ids (see drizzle/0006_courses.sql). Runs inside
// the caller's user scope (a transaction): upsert merged rows under the new ids, then drop the migrated old rows.
// A second run finds nothing to do; rows of guides outside the course are kept for the legacy guide paths.
export function legacyLessonsQuery(conn: Conn, userId: string) {
  return conn
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), isNull(lessonProgress.courseId), like(lessonProgress.lessonId, '%::%')))
}

// `legacy`: the rows of legacyLessonsQuery when already read in this transaction.
export async function migrateLegacyLessons(conn: Conn, userId: string, bundle: CourseBundle, legacy?: Array<typeof lessonProgress.$inferSelect>): Promise<number> {
  const rows = legacy ?? (await legacyLessonsQuery(conn, userId))
  if (rows.length === 0) return 0
  const plan = planLegacyMigration(bundle, rows)
  if (plan.rows.length === 0) return 0
  for (const r of plan.rows) {
    await conn
      .insert(lessonProgress)
      .values({
        userId,
        lessonId: r.lessonId,
        courseId: r.courseId,
        guideId: r.guideId,
        chapterId: r.chapterId,
        completions: r.completions,
        bestAccuracy: r.bestAccuracy,
        lastXp: r.lastXp,
        firstCompletedAt: r.firstCompletedAt,
        lastCompletedAt: r.lastCompletedAt,
      })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: {
          courseId: r.courseId,
          completions: sql`greatest(${lessonProgress.completions}, ${r.completions})`,
          bestAccuracy: sql`greatest(${lessonProgress.bestAccuracy}, ${r.bestAccuracy})`,
          firstCompletedAt: sql`least(${lessonProgress.firstCompletedAt}, ${r.firstCompletedAt})`,
          lastCompletedAt: sql`greatest(${lessonProgress.lastCompletedAt}, ${r.lastCompletedAt})`,
        },
      })
  }
  for (let i = 0; i < plan.migrated.length; i += 500) {
    await conn.delete(lessonProgress).where(and(eq(lessonProgress.userId, userId), inArray(lessonProgress.lessonId, plan.migrated.slice(i, i + 500))))
  }
  return plan.rows.length
}

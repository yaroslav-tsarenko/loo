import 'server-only'
import { cache } from 'react'
import { and, desc, eq, ne } from 'drizzle-orm'
import { toCourseLevel, type CourseBundle, type Level } from '@/course'
import { first, type Conn } from '@/db/client'
import { enrollments, type EnrollmentPlacement } from '@/db/schema'
import { getProfile, userScope } from '../auth'
import { defaultCourse, getCourseEntry } from './registry'

export type Enrollment = typeof enrollments.$inferSelect

export interface ActiveCourse {
  bundle: CourseBundle
  enrollment: Enrollment
}

export async function myEnrollments(): Promise<Enrollment[]> {
  return userScope((db, userId) => db.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.lastOpenedAt)))
}

export function levelFromPreference(value: unknown): Level {
  return toCourseLevel(value) ?? 'noob'
}

// Adds a course to the library (no-op when already there) and, if asked, makes it the active one.
export async function enrollIn(conn: Conn, userId: string, courseId: string, opts: { level: Level; activate: boolean; placement?: EnrollmentPlacement | null; now?: number }): Promise<void> {
  const entry = await getCourseEntry(courseId)
  if (!entry) throw new Error('Unknown course')
  const now = opts.now ?? Date.now()
  await conn
    .insert(enrollments)
    .values({ userId, courseId, source: entry.source, level: opts.level, placement: opts.placement ?? null, active: false, enrolledAt: now, lastOpenedAt: now })
    .onConflictDoNothing()
  if (opts.activate) await activate(conn, userId, courseId, now)
}

// Exactly one active enrollment (partial unique index): clear the others first, then set this one.
export async function activate(conn: Conn, userId: string, courseId: string, now = Date.now()): Promise<void> {
  await conn
    .update(enrollments)
    .set({ active: false })
    .where(and(eq(enrollments.userId, userId), ne(enrollments.courseId, courseId), eq(enrollments.active, true)))
  await conn
    .update(enrollments)
    .set({ active: true, lastOpenedAt: now })
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
}

async function activeRow(conn: Conn, userId: string): Promise<Enrollment | undefined> {
  return first(
    conn
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.active, true))),
  )
}

// The learner's active course. Learners from before the course platform (onboarding done, empty library) are
// enrolled into the default course once, at their self-assessed level, so their path keeps working.
export const activeCourse = cache(async (): Promise<ActiveCourse | null> => {
  const profile = await getProfile()
  return userScope(
    async (db, userId) => {
      let row = await activeRow(db, userId)
      if (!row) {
        const any = await first(db.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.lastOpenedAt)).limit(1))
        if (any) {
          await activate(db, userId, any.courseId)
        } else if (profile?.onboarding.completedAt) {
          const course = await defaultCourse()
          if (!course) return null
          await enrollIn(db, userId, course.course.id, { level: levelFromPreference(profile.preferences.level), activate: true })
        } else return null
        row = await activeRow(db, userId)
      }
      if (!row) return null
      const entry = await getCourseEntry(row.courseId)
      if (!entry) return null
      return { bundle: entry.bundle, enrollment: row }
    },
    { tx: true },
  )
})

// Exercise ids of the active course (pools for review / quiz / tasks / mission / feed); null without a course.
export async function activeScope(): Promise<{ bundle: CourseBundle; ids: ReadonlySet<string>; guides: ReadonlySet<string> } | null> {
  const active = await activeCourse()
  if (!active) return null
  return { bundle: active.bundle, ids: exerciseIds(active.bundle), guides: new Set(active.bundle.sections.map((s) => s.guideId)) }
}

const idCache = new WeakMap<CourseBundle, ReadonlySet<string>>()

export function exerciseIds(bundle: CourseBundle): ReadonlySet<string> {
  let ids = idCache.get(bundle)
  if (!ids) idCache.set(bundle, (ids = new Set(Object.keys(bundle.exercises))))
  return ids
}

// Pool for review / quiz / tasks / mistakes: the active course, unless the learner picked a guide or chapter.
export async function studyScope(f: { guide: string | null; chapter: string | null }): Promise<ReadonlySet<string> | null> {
  if (f.guide || f.chapter) return null
  return (await activeScope())?.ids ?? null
}

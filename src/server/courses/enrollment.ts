import 'server-only'
import { cache } from 'react'
import { and, desc, eq, ne } from 'drizzle-orm'
import { courseLadder, toCourseLevel, toLadder, type CourseBundle, type CourseMeta, type Level } from '@/course'
import { first, type Conn } from '@/db/client'
import { enrollments, type EnrollmentPlacement } from '@/db/schema'
import { userScope, type Profile } from '../auth'
import { read, readOne, type Read } from '../db/batch'
import { userBase } from '../base'
import { defaultCourse, getCourseEntry } from './registry'

export type Enrollment = typeof enrollments.$inferSelect

export interface ActiveCourse {
  bundle: CourseBundle
  enrollment: Enrollment
}

export async function myEnrollments(): Promise<Enrollment[]> {
  return userScope((db, userId) => enrollmentsIn(db, userId))
}

export function enrollmentsIn(conn: Conn, userId: string): Promise<Enrollment[]> {
  return readOne(conn, enrollmentsRead(conn, userId))
}

export function enrollmentsRead(conn: Conn, userId: string): Read<Enrollment[]> {
  return read(conn.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.lastOpenedAt)), (rows) => rows)
}

// Self-assessed level (noob…god) → a course level; with a course, mapped onto its ladder (noob → A1, junior → A2…).
export function levelFromPreference(value: unknown, course?: Pick<CourseMeta, 'kind' | 'subject' | 'levels'>): Level {
  const level = toCourseLevel(value) ?? 'noob'
  return course ? toLadder(level, courseLadder(course)) : level
}

// A stored enrollment level on the course's own ladder (rows written before CEFR, or a programming level).
export function courseLevelOf(level: Level, course: Pick<CourseMeta, 'kind' | 'subject' | 'levels'>): Level {
  return toLadder(level, courseLadder(course))
}

// Adds a course to the library (no-op when already there) and, if asked, makes it the active one.
export async function enrollIn(conn: Conn, userId: string, courseId: string, opts: { level: Level; activate: boolean; placement?: EnrollmentPlacement | null; now?: number }): Promise<void> {
  const entry = await getCourseEntry(courseId)
  if (!entry) throw new Error('Unknown course')
  const now = opts.now ?? Date.now()
  const level = courseLevelOf(opts.level, entry.bundle.course)
  await conn
    .insert(enrollments)
    .values({ userId, courseId, source: entry.source, level, placement: opts.placement ?? null, active: false, enrolledAt: now, lastOpenedAt: now })
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

export async function activeRow(conn: Conn, userId: string): Promise<Enrollment | undefined> {
  return readOne(conn, activeRead(conn, userId))
}

export function activeRead(conn: Conn, userId: string): Read<Enrollment | undefined> {
  return read(
    conn
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.active, true))),
    (rows) => rows[0],
  )
}

// No active enrollment: the most recently opened one becomes active; learners from before the course platform
// (onboarding done, empty library) are enrolled into the default course once, at their self-assessed level.
export async function fixActive(conn: Conn, userId: string, profile: Pick<Profile, 'onboarding' | 'preferences'> | null): Promise<Enrollment | undefined> {
  const any = await first(conn.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.lastOpenedAt)).limit(1))
  if (any) {
    await activate(conn, userId, any.courseId)
  } else if (profile?.onboarding.completedAt) {
    const course = await defaultCourse()
    if (!course) return undefined
    await enrollIn(conn, userId, course.course.id, { level: levelFromPreference(profile.preferences.level), activate: true })
  } else return undefined
  return activeRow(conn, userId)
}

// The learner's active course (read with the profile and settings in one transaction: src/server/base.ts).
export const activeCourse = cache(async (): Promise<ActiveCourse | null> => {
  const row = (await userBase())?.active
  if (!row) return null
  const entry = await getCourseEntry(row.courseId)
  if (!entry) return null
  return { bundle: entry.bundle, enrollment: { ...row, level: courseLevelOf(row.level, entry.bundle.course) } }
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

export interface StudyScope {
  // exercise ids the pool is limited to; null = no limit (no active course, «усі курси», or a guide / chapter pick)
  pool: ReadonlySet<string> | null
  // guides offered in the material filter; null = every guide («усі курси» or no active course)
  guides: ReadonlySet<string> | null
  // the active course (also with «усі курси», so the page can offer the way back)
  course: { id: string; title: string } | null
  all: boolean
}

// Pool for review / quiz / tasks / mistakes: the active course, unless the learner picked a guide or chapter, or
// switched to «усі курси» (?scope=all).
export async function studyScope(f: { guide: string | null; chapter: string | null; all?: boolean }): Promise<StudyScope> {
  const all = f.all === true
  const scope = await activeScope()
  if (!scope) return { pool: null, guides: null, course: null, all }
  const course = { id: scope.bundle.course.id, title: scope.bundle.course.title }
  if (all) return { pool: null, guides: null, course, all }
  return { pool: f.guide || f.chapter ? null : scope.ids, guides: scope.guides, course, all }
}

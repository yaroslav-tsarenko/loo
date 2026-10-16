import { legacyLessonMap, lookup, type CourseBundle } from '@/course'

// Carrying lesson_progress over from the pre-course lesson ids (`<chapterId>::<kind>-<n>`) to course lesson ids.
// Pure planning; src/server/courses/legacy.ts applies it in one transaction.

export interface LegacyLessonRow {
  lessonId: string
  completions: number
  bestAccuracy: number
  lastXp: number
  firstCompletedAt: number | null
  lastCompletedAt: number | null
}

export interface MigratedLessonRow extends LegacyLessonRow {
  courseId: string
  guideId: string
  chapterId: string
  // the legacy id it came from
  from: string
}

export interface LegacyPlan {
  rows: MigratedLessonRow[]
  // legacy ids that now live under a course id (safe to delete after the upsert)
  migrated: string[]
}

const isLegacyId = (id: string) => id.includes('::')

const min = (a: number | null, b: number | null) => (a === null ? b : b === null ? a : Math.min(a, b))
const max = (a: number | null, b: number | null) => (a === null ? b : b === null ? a : Math.max(a, b))

// Rows that map onto the course are merged per new id (two old ids never map to one new id today, but stay safe).
// Unknown legacy ids (guides the course doesn't cover, lessons that no longer exist) are left untouched.
export function planLegacyMigration(bundle: CourseBundle, rows: readonly LegacyLessonRow[]): LegacyPlan {
  const map = legacyLessonMap(bundle)
  const { lessons, topics } = lookup(bundle)
  const out = new Map<string, MigratedLessonRow>()
  const migrated: string[] = []
  for (const row of rows) {
    if (!isLegacyId(row.lessonId)) continue
    const id = map.get(row.lessonId)
    const lesson = id ? lessons.get(id) : undefined
    const topic = lesson ? topics.get(lesson.topicId) : undefined
    if (!id || !lesson || !topic) continue
    migrated.push(row.lessonId)
    const prev = out.get(id)
    out.set(
      id,
      prev
        ? {
            ...prev,
            completions: prev.completions + row.completions,
            bestAccuracy: Math.max(prev.bestAccuracy, row.bestAccuracy),
            lastXp: Math.max(prev.lastXp, row.lastXp),
            firstCompletedAt: min(prev.firstCompletedAt, row.firstCompletedAt),
            lastCompletedAt: max(prev.lastCompletedAt, row.lastCompletedAt),
          }
        : { ...row, lessonId: id, courseId: bundle.course.id, guideId: topic.guideId, chapterId: topic.chapterId, from: row.lessonId },
    )
  }
  return { rows: [...out.values()], migrated }
}

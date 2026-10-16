import 'server-only'
import { and, eq } from 'drizzle-orm'
import { lessonIdFromLegacy, lookup, selectLesson, type CourseBundle, type Lesson, type LessonView, type Level, type Section, type Topic } from '@/course'
import { first } from '@/db/client'
import { enrollments } from '@/db/schema'
import { getProfile, userScope } from '../auth'
import { levelFromPreference } from './enrollment'
import { courseFor, listCourses, getCourse } from './registry'

export interface CourseLesson {
  bundle: CourseBundle
  section: Section
  topic: Topic
  lesson: Lesson
}

export async function findCourseLesson(id: string): Promise<CourseLesson | null> {
  const bundle = await courseFor(id)
  if (!bundle) return null
  const index = lookup(bundle)
  const lesson = index.lessons.get(id)
  const topic = lesson ? index.topics.get(lesson.topicId) : undefined
  const section = topic ? index.sections.get(topic.sectionId) : undefined
  return lesson && topic && section ? { bundle, section, topic, lesson } : null
}

// Old `/learn/<chapterId>::<kind>-<n>` links → the same lesson in a course (first course that has it).
export async function courseLessonForLegacy(legacyId: string): Promise<string | null> {
  for (const listing of await listCourses()) {
    const bundle = await getCourse(listing.id)
    const id = bundle ? lessonIdFromLegacy(bundle, legacyId) : null
    if (id) return id
  }
  return null
}

// The learner's level in a course: the enrollment's, else the self-assessed one from the profile.
export async function learnerLevel(courseId: string): Promise<Level> {
  const row = await userScope((db, userId) =>
    first(
      db
        .select({ level: enrollments.level })
        .from(enrollments)
        .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))),
    ),
  )
  if (row) return row.level
  return levelFromPreference((await getProfile())?.preferences.level)
}

export function lessonView(bundle: CourseBundle, lesson: Lesson, level: Level): LessonView {
  return selectLesson(lesson, bundle.exercises, level)
}

export { nextStepAfter, pathSteps, stepHref, type PathStep } from './steps'

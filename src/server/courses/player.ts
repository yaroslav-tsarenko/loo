import 'server-only'
import type { Level } from '@/course'
import type { ContentSnapshot } from '@/content/store'
import { chapterHref } from '@/ui/routes'
import { renderLessonItems, type LessonPlayerData } from '../services/lessons'
import { lessonView, nextStepAfter, stepHref, type CourseLesson, type PathStep } from './lessons'

export function nextLabel(step: PathStep | null): string | null {
  if (!step) return null
  return step.type === 'test' ? 'Тест теми' : step.type === 'exam' ? 'Екзамен розділу' : 'Наступний урок'
}

// A course lesson at the learner's level: below-level items condensed, above-level challenges marked.
export async function courseLessonPlayerData(snapshot: ContentSnapshot, cl: CourseLesson, level: Level): Promise<LessonPlayerData> {
  const view = lessonView(cl.bundle, cl.lesson, level)
  const items = await renderLessonItems(snapshot, view.items)
  const chapter = snapshot.chapters.get(cl.topic.chapterId)
  const next = nextStepAfter(cl.bundle, level, cl.lesson.id)
  return {
    lesson: cl.lesson,
    chapterTitle: cl.topic.title,
    chapterHref: chapter ? chapterHref(snapshot, chapter) : '/path',
    guideTitle: cl.bundle.course.title,
    items,
    challenges: view.items.filter((i) => i.challenge).map((i) => i.id),
    nextHref: next ? stepHref(next) : null,
    nextLabel: nextLabel(next),
  }
}

import 'server-only'
import type { Level } from '@/course'
import { DEFAULT_LOCALE, t, type Locale } from '@/i18n'
import { uiLocale } from '../locale'
import type { ContentSnapshot } from '@/content/store'
import { chapterHref } from '@/ui/routes'
import { chapterLanguages } from '../content-i18n'
import { renderLessonItems, type LessonPlayerData } from '../services/lessons'
import { lessonView, nextStepAfter, stepHref, type CourseLesson, type PathStep } from './lessons'

export function nextLabel(step: PathStep | null, locale: Locale = DEFAULT_LOCALE): string | null {
  if (!step) return null
  return t(step.type === 'test' ? 'tests.topic' : step.type === 'exam' ? 'tests.exam' : 'lesson.next', undefined, locale)
}

// A course lesson at the learner's level: below-level items condensed, above-level challenges marked.
export async function courseLessonPlayerData(snapshot: ContentSnapshot, cl: CourseLesson, level: Level): Promise<LessonPlayerData> {
  const view = lessonView(cl.bundle, cl.lesson, level)
  const items = await renderLessonItems(snapshot, view.items)
  const chapter = snapshot.chapters.get(cl.topic.chapterId)
  const next = nextStepAfter(cl.bundle, level, cl.lesson.id)
  // a translated topic in the UI locale (items are localized by renderLessonItems)
  const lang = chapter ? (await chapterLanguages(snapshot, chapter)).lang : null
  return {
    lesson: cl.lesson,
    chapterTitle: (lang && snapshot.translations.get(cl.topic.chapterId)?.get(lang)?.title) || cl.topic.title,
    chapterHref: chapter ? chapterHref(snapshot, chapter) : '/path',
    guideTitle: cl.bundle.course.title,
    items,
    challenges: view.items.filter((i) => i.challenge).map((i) => i.id),
    nextHref: next ? stepHref(next) : null,
    nextLabel: nextLabel(next, await uiLocale()),
  }
}

import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getContent } from '@/server/content'
import { courseLessonForLegacy, findCourseLesson, learnerLevel } from '@/server/courses/lessons'
import { courseLessonPlayerData } from '@/server/courses/player'
import { playerGame } from '@/server/game'
import { findLesson, lessonPlayerData } from '@/server/services/lessons'
import { LessonPlayer } from '@/ui/lesson/LessonPlayer'

export const metadata: Metadata = { title: 'Урок' }

function decode(raw: string): string {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

// Course lessons: /learn/<course>:<section>:<topic>:<kind>-<n>. Old ids (<chapterId>::<kind>-<n>) redirect to the same
// lesson of a course; lessons of guides that no course covers still play from the guide.
export default async function LessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const id = decode((await params).lesson)
  const snapshot = await getContent()
  const course = await findCourseLesson(id)
  if (course) {
    const data = await courseLessonPlayerData(snapshot, course, await learnerLevel(course.bundle.course.id))
    if (course.lesson.kind === 'theory' || data.items.length === 0) redirect(data.chapterHref)
    const game = await playerGame()
    return (
      <LessonPlayer
        key={course.lesson.id}
        lessonId={course.lesson.id}
        title={course.lesson.title}
        icon={course.lesson.icon}
        chapterTitle={data.chapterTitle}
        chapterHref={data.chapterHref}
        items={data.items}
        challenges={data.challenges}
        nextHref={data.nextHref}
        nextLabel={data.nextLabel}
        {...game}
      />
    )
  }
  if (id.includes('::')) {
    const moved = await courseLessonForLegacy(id)
    if (moved) redirect(`/learn/${encodeURIComponent(moved)}`)
  }
  const lesson = findLesson(snapshot, id)
  if (!lesson) notFound()
  const data = await lessonPlayerData(snapshot, lesson)
  if (lesson.kind === 'theory' || data.items.length === 0) redirect(data.chapterHref)
  const game = await playerGame()
  return (
    <LessonPlayer
      key={lesson.id}
      lessonId={lesson.id}
      title={lesson.title}
      icon={lesson.icon}
      chapterTitle={data.chapterTitle}
      chapterHref={data.chapterHref}
      items={data.items}
      nextHref={data.nextHref}
      nextLabel={data.nextLabel}
      {...game}
    />
  )
}

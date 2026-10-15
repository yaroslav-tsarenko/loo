import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getContent } from '@/server/content'
import { findLesson, lessonPlayerData } from '@/server/services/lessons'
import { LessonPlayer } from '@/ui/lesson/LessonPlayer'

export const metadata: Metadata = { title: 'Урок' }

export default async function LessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: raw } = await params
  const snapshot = await getContent()
  const lesson = findLesson(snapshot, decodeURIComponent(raw))
  if (!lesson) notFound()
  const data = await lessonPlayerData(snapshot, lesson)
  if (lesson.kind === 'theory' || data.items.length === 0) redirect(data.chapterHref)
  return (
    <LessonPlayer
      key={lesson.id}
      lessonId={lesson.id}
      title={lesson.title}
      emoji={lesson.emoji}
      chapterTitle={data.chapterTitle}
      chapterHref={data.chapterHref}
      items={data.items}
      nextHref={data.nextLessonId ? `/learn/${encodeURIComponent(data.nextLessonId)}` : null}
    />
  )
}

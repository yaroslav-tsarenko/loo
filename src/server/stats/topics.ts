import type { CourseBundle } from '@/course'
import type { ContentSnapshot } from '@/content/store'

export interface TopicRef {
  title: string
  // course topic id when the chapter belongs to the active course (path anchor)
  topicId: string | null
  icon: string | null
  // position in the course (sorting charts in path order); guide chapters outside the course come after
  order: number
}

// Attempts are stored per chapter; the course names a chapter as a topic. Course titles win, guide titles fill in.
export function topicTitles(snapshot: ContentSnapshot, bundle: CourseBundle | null): Map<string, TopicRef> {
  const out = new Map<string, TopicRef>()
  let order = 0
  for (const section of bundle?.sections ?? []) {
    for (const topic of section.topics) {
      if (!out.has(topic.chapterId)) out.set(topic.chapterId, { title: topic.title, topicId: topic.id, icon: topic.icon, order: order++ })
    }
  }
  for (const [id, chapter] of snapshot.chapters) {
    if (!out.has(id) && chapter.kind !== 'index') out.set(id, { title: chapter.title, topicId: null, icon: null, order: 10_000 + order++ })
  }
  return out
}

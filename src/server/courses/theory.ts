import 'server-only'
import { courseTheory } from '@/course'
import type { ContentSnapshot } from '@/content/store'
import { chapterProgressMap, type ProgressRow } from '../services/library'
import { activeCourse, type ActiveCourse } from './enrollment'
import { theoryTree, type TheoryNode } from './theory-core'

export interface ActiveTheory {
  courseId: string
  nodes: TheoryNode[]
}

// The sidebar «Теорія»: only the active course's guides (course.yaml `theory`), with the learner's chapter status.
export async function activeTheory(snapshot: ContentSnapshot): Promise<ActiveTheory | null> {
  const active = await activeCourse()
  if (!active) return null
  return theoryFrom(snapshot, active, await chapterProgressMap())
}

export function theoryFrom(snapshot: ContentSnapshot, active: ActiveCourse, progress: ReadonlyMap<string, ProgressRow>): ActiveTheory {
  return { courseId: active.bundle.course.id, nodes: theoryTree(snapshot, courseTheory(active.bundle), (id) => progress.get(id)?.status) }
}

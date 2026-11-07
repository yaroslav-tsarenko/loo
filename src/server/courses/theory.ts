import 'server-only'
import { courseTheory } from '@/course'
import type { ContentSnapshot } from '@/content/store'
import { type ProgressRow } from '../services/library'
import { type ActiveCourse } from './enrollment'
import { theoryTree, type TheoryNode } from './theory-core'

export interface ActiveTheory {
  courseId: string
  nodes: TheoryNode[]
}

export function theoryFrom(snapshot: ContentSnapshot, active: ActiveCourse, progress: ReadonlyMap<string, ProgressRow>): ActiveTheory {
  return { courseId: active.bundle.course.id, nodes: theoryTree(snapshot, courseTheory(active.bundle), (id) => progress.get(id)?.status) }
}

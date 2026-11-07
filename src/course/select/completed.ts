import type { CourseBundle } from '../schema'
import { lookup } from './lookup'

// Which completed lessons still count as completed after the course changed.
//
// Lessons are cut from a topic's exercises by position (src/course/compile/lessons.ts), so adding an exercise to a
// topic shifts the next lessons' content while their ids stay. A completed lesson keeps counting when each exercise it
// has NOW was either in it when the learner finished it (`unitIds` stored at completion) or answered by the learner
// somewhere (`attempted`) — a shift between lessons changes nothing, a skipped speaking exercise in its own lesson
// changes nothing, a genuinely new exercise reopens the lesson. Rows from before `unitIds` was stored keep counting
// (nothing to compare with). Lessons no longer in the course are dropped.

export interface CompletedLessonRow {
  id: string
  unitIds: readonly string[] | null
}

export function stillCompleted(bundle: CourseBundle, rows: readonly CompletedLessonRow[], attempted: ReadonlySet<string>): Set<string> {
  const lessons = lookup(bundle).lessons
  const out = new Set<string>()
  for (const row of rows) {
    const lesson = lessons.get(row.id)
    if (!lesson) {
      // not (or no longer) part of this bundle: kept as before — the path only asks about its own lessons
      out.add(row.id)
      continue
    }
    if (row.unitIds === null) {
      out.add(row.id)
      continue
    }
    const seen = new Set(row.unitIds)
    if (lesson.items.every((item) => item.kind !== 'unit' || seen.has(item.id) || attempted.has(item.id))) out.add(row.id)
  }
  return out
}

import { levelRank, type CourseBundle, type ExerciseRef, type Lesson, type LessonItem, type Level } from '../schema'
import { PACE } from '../compile/lessons'

// Personalises the path for a learner level (ARCHITECTURE §2 «Складність і персоналізація»):
// exercises below the level are condensed (a lesson keeps 1–2 of them), above the level are challenges.

export interface SelectedItem extends LessonItem {
  challenge: boolean
}

export interface LessonView {
  id: string
  items: SelectedItem[]
  // some below-level items were dropped
  condensed: boolean
  // everything in it is below the level: may be skipped without breaking the path
  optional: boolean
  // has at least one above-level exercise
  challenge: boolean
  minutes: number
}

export interface LevelView {
  level: Level
  lessons: Record<string, LessonView>
  minutes: number
  dropped: number
}

// How many below-level exercises a lesson keeps: all-easy lesson → 2, mixed lesson → 1.
export const KEEP_WHEN_ALL_BELOW = 2
export const KEEP_WHEN_MIXED = 1

const KIND_PRIORITY: Record<ExerciseRef['kind'], number> = { quiz: 0, listen: 0, pair: 1, task: 1, speak: 2, interview: 2, flashcard: 3, word: 3 }

export function selectLesson(lesson: Lesson, exercises: Record<string, ExerciseRef>, level: Level): LessonView {
  const user = levelRank(level)
  const units = lesson.items.filter((i) => i.kind === 'unit').map((i) => exercises[i.id]).filter((e): e is ExerciseRef => e !== undefined)
  const below = units.filter((e) => levelRank(e.level) < user)
  const rest = units.length - below.length
  const minutesOf = (items: SelectedItem[]) =>
    lesson.kind === 'theory' ? lesson.minutes : Math.max(1, Math.round(items.reduce((sum, i) => sum + (i.kind === 'reel' ? PACE.reel : exercises[i.id]?.minutes ?? PACE.quiz), 0)))

  if (lesson.kind === 'theory') {
    const optional = levelRank(lesson.level) < user
    return { id: lesson.id, items: [], condensed: false, optional, challenge: levelRank(lesson.level) > user, minutes: lesson.minutes }
  }

  const keep = new Set<string>()
  const budget = rest === 0 ? KEEP_WHEN_ALL_BELOW : KEEP_WHEN_MIXED
  // Keep the closest-to-level, most retrieval-heavy below-level items.
  ;[...below]
    .sort((a, b) => levelRank(b.level) - levelRank(a.level) || KIND_PRIORITY[a.kind] - KIND_PRIORITY[b.kind] || a.position - b.position)
    .slice(0, budget)
    .forEach((e) => keep.add(e.id))

  const condensed = below.length > keep.size
  const items: SelectedItem[] = []
  for (const item of lesson.items) {
    if (item.kind === 'reel') {
      // reels are cheap context; a fully condensed lesson drops them
      if (!(condensed && rest === 0)) items.push({ ...item, challenge: false })
      continue
    }
    const ex = exercises[item.id]
    if (!ex) continue
    const rank = levelRank(ex.level)
    if (rank < user && !keep.has(ex.id)) continue
    items.push({ ...item, challenge: rank > user })
  }
  return {
    id: lesson.id,
    items,
    condensed,
    optional: units.length > 0 && rest === 0,
    challenge: items.some((i) => i.challenge),
    minutes: minutesOf(items),
  }
}

export function selectForLevel(bundle: CourseBundle, level: Level): LevelView {
  const lessons: Record<string, LessonView> = {}
  let minutes = 0
  let dropped = 0
  for (const s of bundle.sections) {
    for (const t of s.topics) {
      for (const l of t.lessons) {
        const view = selectLesson(l, bundle.exercises, level)
        lessons[l.id] = view
        minutes += view.optional && l.kind === 'theory' ? 0 : view.minutes
        dropped += l.items.length - view.items.length
      }
    }
  }
  return { level, lessons, minutes, dropped }
}

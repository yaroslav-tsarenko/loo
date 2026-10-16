import { selectLesson, type CourseBundle, type Level } from '@/course'

// The playable order of a course (pure): what «next» means after a lesson, a topic test or a section exam.

export type PathStep = { type: 'lesson'; id: string } | { type: 'test'; id: string } | { type: 'exam'; id: string }

const stepCache = new WeakMap<CourseBundle, Map<Level, PathStep[]>>()

// The playable path in order: practice lessons that have items at this level, each topic's test, each section's exam.
export function pathSteps(bundle: CourseBundle, level: Level): PathStep[] {
  let byLevel = stepCache.get(bundle)
  if (!byLevel) stepCache.set(bundle, (byLevel = new Map()))
  let steps = byLevel.get(level)
  if (!steps) {
    steps = []
    for (const s of bundle.sections) {
      for (const t of s.topics) {
        for (const l of t.lessons) if (l.kind !== 'theory' && selectLesson(l, bundle.exercises, level).items.length > 0) steps.push({ type: 'lesson', id: l.id })
        if (t.test) steps.push({ type: 'test', id: t.test.id })
      }
      if (s.exam) steps.push({ type: 'exam', id: s.exam.id })
    }
    byLevel.set(level, steps)
  }
  return steps
}

export function nextStepAfter(bundle: CourseBundle, level: Level, id: string): PathStep | null {
  const steps = pathSteps(bundle, level)
  const at = steps.findIndex((s) => s.id === id)
  return at >= 0 ? steps[at + 1] ?? null : null
}

export function stepHref(step: PathStep): string {
  return step.type === 'lesson' ? `/learn/${encodeURIComponent(step.id)}` : `/test/${encodeURIComponent(step.id)}`
}

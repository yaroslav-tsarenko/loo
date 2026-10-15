import type { CourseBundle, Lesson, LessonKind } from './schema'
import { hashHex } from './rng'

// Stable ids: <course>:<section>:<topic>:<lesson-kind>-<n>. ':' never appears inside a part.

const SAFE = /^[a-z0-9][a-z0-9._-]*$/

// Chapter id → topic key: explicit ids («jsd-ch-05») as is; path-derived ids → <guide>-<NN> or <guide>-<hash>.
export function topicKeyFor(chapterId: string, guideId: string, number: number | null): string {
  const lower = chapterId.toLowerCase()
  if (SAFE.test(lower)) return lower
  const guide = guideId.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'guide'
  return number !== null ? `${guide}-${String(number).padStart(2, '0')}` : `${guide}-${hashHex(chapterId, 6)}`
}

export const sectionId = (courseId: string, section: string): string => `${courseId}:${section}`
export const topicId = (courseId: string, section: string, topic: string): string => `${courseId}:${section}:${topic}`
export const lessonId = (topic: string, kind: LessonKind, n: number): string => `${topic}:${kind}-${n}`
export const topicTestId = (topic: string): string => `${topic}:test`
export const sectionExamId = (section: string): string => `${section}:exam`

// Lesson id of the pre-course generator (src/content/lessons.ts): <chapterId>::<kind>-<n>
export const legacyLessonIdFor = (chapterId: string, kind: LessonKind, n: number): string => `${chapterId}::${kind}-${n}`

export interface ParsedLessonId {
  courseId: string
  sectionKey: string
  topicKey: string
  kind: string
  n: number
}

export function parseLessonId(id: string): ParsedLessonId | null {
  const parts = id.split(':')
  if (parts.length !== 4) return null
  const m = /^([a-z]+)-(\d+)$/.exec(parts[3]!)
  if (!m) return null
  return { courseId: parts[0]!, sectionKey: parts[1]!, topicKey: parts[2]!, kind: m[1]!, n: Number(m[2]) }
}

const legacyCache = new WeakMap<CourseBundle, { toNew: Map<string, string>; toOld: Map<string, string> }>()

function legacyIndex(bundle: CourseBundle) {
  let index = legacyCache.get(bundle)
  if (!index) {
    const lessons: Lesson[] = bundle.sections.flatMap((s) => s.topics.flatMap((t) => t.lessons))
    index = { toNew: new Map(lessons.map((l) => [l.legacyId, l.id])), toOld: new Map(lessons.map((l) => [l.id, l.legacyId])) }
    legacyCache.set(bundle, index)
  }
  return index
}

// New lesson id → old `<chapterId>::<kind>-n` (for reading existing lesson_progress rows)
export function legacyLessonId(bundle: CourseBundle, lessonId: string): string | null {
  return legacyIndex(bundle).toOld.get(lessonId) ?? null
}

// Old lesson id → new id, or null when the lesson no longer exists (e.g. theory of a practice topic)
export function lessonIdFromLegacy(bundle: CourseBundle, legacyId: string): string | null {
  return legacyIndex(bundle).toNew.get(legacyId) ?? null
}

// Full migration map old → new, to carry lesson_progress over in one pass
export function legacyLessonMap(bundle: CourseBundle): Map<string, string> {
  return new Map(legacyIndex(bundle).toNew)
}

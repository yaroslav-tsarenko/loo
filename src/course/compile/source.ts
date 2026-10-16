import type { Chapter, Guide, LearningUnit } from '@/content/model'
import type { Reel } from '@/content/parse/reels'

// What the compiler needs from the content layer. A ContentSnapshot (src/content/store.ts) satisfies it.
export interface CourseSource {
  guides: readonly Guide[]
  chapters: ReadonlyMap<string, Chapter>
  units: ReadonlyMap<string, LearningUnit>
  unitsByChapter: ReadonlyMap<string, readonly LearningUnit[]>
  reels: readonly Reel[]
  // placement-test bank (`<Guide>/_placement/*.md`), outside guides and chapters
  placementUnits?: ReadonlyMap<string, LearningUnit>
  placementChapters?: ReadonlyMap<string, Chapter>
  issues?: readonly { severity: 'warning' | 'error'; code: string; path: string; message: string }[]
}

export function findGuide(source: CourseSource, from: string): Guide | null {
  const needle = from.trim().replace(/^\/+|\/+$/g, '')
  return source.guides.find((g) => g.dir === needle) ?? source.guides.find((g) => g.id === needle) ?? source.guides.find((g) => g.dir.toLowerCase() === needle.toLowerCase()) ?? null
}

// Units of a chapter in document order (chapter.unitIds keeps extraction order; JSON-bank units come last).
export function chapterUnits(source: CourseSource, chapter: Chapter): LearningUnit[] {
  const list = source.unitsByChapter.get(chapter.id) ?? []
  const order = new Map(chapter.unitIds.map((id, i) => [id, i]))
  return [...list].sort((a, b) => (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER))
}

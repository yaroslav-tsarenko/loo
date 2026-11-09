import 'server-only'
import { and, eq } from 'drizzle-orm'
import { lessonProgress } from '@/db/schema'
import { iconRef, REEL_FALLBACK_ICON } from '@/content/icons'
import { guideLessons, type Lesson } from '@/content/lessons'
import type { Guide } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { renderMdast } from '@/ui/markdown/render'
import { chapterHref } from '@/ui/routes'
import { renderStudyItems, type StudyItem } from '@/ui/study/render-items'
import { userScope } from '../auth'
import { getReels } from '../content'
import { chapterLanguages, localizedDocument } from '../content-i18n'
import { readableChapters } from './library'

// Bonus on top of per-question XP: first pass of a lesson, first flawless pass.
export const LESSON_XP = { first: 10, perfect: 5 } as const

const cache = new WeakMap<ContentSnapshot, Map<string, Map<string, Lesson[]>>>()

// Lessons per chapter for a guide, memoized per content snapshot.
export function courseLessons(snapshot: ContentSnapshot, guide: Guide): Map<string, Lesson[]> {
  let byGuide = cache.get(snapshot)
  if (!byGuide) cache.set(snapshot, (byGuide = new Map()))
  let lessons = byGuide.get(guide.id)
  if (!lessons) {
    lessons = guideLessons(guide, readableChapters(snapshot, guide), snapshot.unitsByChapter, snapshot.reels, snapshot.units)
    byGuide.set(guide.id, lessons)
  }
  return lessons
}

export function findLesson(snapshot: ContentSnapshot, lessonId: string): Lesson | null {
  const chapterId = lessonId.slice(0, lessonId.lastIndexOf('::'))
  const chapter = snapshot.chapters.get(chapterId)
  const guide = chapter ? snapshot.guideById.get(chapter.guideId) : undefined
  if (!chapter || !guide) return null
  return courseLessons(snapshot, guide).get(chapter.id)?.find((l) => l.id === lessonId) ?? null
}

export interface LessonRecord {
  completions: number
  bestAccuracy: number
}

export async function lessonProgressMap(guideId: string): Promise<Map<string, LessonRecord>> {
  const rows = await userScope((db, userId) =>
    db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.guideId, guideId))),
  )
  return new Map(rows.map((r) => [r.lessonId, { completions: r.completions, bestAccuracy: r.bestAccuracy }]))
}

// reel `icon` is an icon ref (src/content/icons.ts) derived from the reel's leading emoji
export type PlayerItem = StudyItem | { kind: 'reel'; unitId: string; icon: string; title: string; body: React.ReactNode }

export interface LessonPlayerData {
  lesson: { id: string; kind: string; icon: string; title: string }
  chapterTitle: string
  chapterHref: string
  guideTitle: string
  items: PlayerItem[]
  // above-level («челендж») exercises of a course lesson
  challenges: string[]
  nextHref: string | null
  nextLabel: string | null
}

// Renders lesson items (exercises through the study renderers, reels as cards), keeping the lesson's order.
export async function renderLessonItems(snapshot: ContentSnapshot, refs: ReadonlyArray<{ kind: 'unit' | 'reel'; id: string }>): Promise<PlayerItem[]> {
  const unitIds = refs.flatMap((i) => (i.kind === 'unit' ? [i.id] : []))
  const rendered = new Map((await renderStudyItems(snapshot, unitIds)).map((r) => [r.unitId, r]))
  const reels = await getReels(refs.flatMap((i) => (i.kind === 'reel' ? [i.id] : [])))
  // reels of translated topics in the UI locale (same ids; src/server/content-i18n.ts)
  const reelChapters = new Set(refs.flatMap((r) => (r.kind === 'reel' ? [reels.get(r.id)?.chapterId ?? ''] : [])).filter((id) => snapshot.translations.has(id)))
  for (const chapterId of reelChapters) {
    const chapter = snapshot.chapters.get(chapterId)
    const langs = chapter ? await chapterLanguages(snapshot, chapter) : null
    const doc = langs?.lang ? await localizedDocument(chapterId, langs.lang, langs.source) : null
    for (const [id, reel] of doc?.reels ?? []) reels.set(id, reel)
  }
  const items: PlayerItem[] = []
  for (const ref of refs) {
    if (ref.kind === 'unit') {
      const item = rendered.get(ref.id)
      if (item) items.push(item)
      continue
    }
    const reel = reels.get(ref.id)
    const chapter = reel ? snapshot.chapters.get(reel.chapterId) : undefined
    if (!reel || !chapter) continue
    items.push({ kind: 'reel', unitId: reel.id, icon: iconRef(reel.emoji, REEL_FALLBACK_ICON)!, title: reel.title, body: await renderMdast(reel.body, { snapshot, chapter, depth: 0, variant: 'card' }) })
  }
  return items
}

// Lessons of guides that no course covers (old generator ids `<chapterId>::<kind>-<n>`).
export async function lessonPlayerData(snapshot: ContentSnapshot, lesson: Lesson): Promise<LessonPlayerData> {
  const chapter = snapshot.chapters.get(lesson.chapterId)!
  const guide = snapshot.guideById.get(lesson.guideId)!
  const items = await renderLessonItems(snapshot, lesson.items)
  const all = [...courseLessons(snapshot, guide).values()].flat().filter((l) => l.kind !== 'theory')
  const pos = all.findIndex((l) => l.id === lesson.id)
  const next = all[pos + 1]?.id ?? null
  return {
    lesson,
    chapterTitle: chapter.title,
    chapterHref: chapterHref(snapshot, chapter),
    guideTitle: guide.title,
    items,
    challenges: [],
    nextHref: next ? `/learn/${encodeURIComponent(next)}` : null,
    nextLabel: next ? 'Наступний урок' : null,
  }
}

export interface CourseCursor {
  lesson: Lesson | null
  remaining: number
  total: number
  chapterTitle: string | null
}

// The next unfinished lesson along a track (theory nodes are skipped — they live in the reader).
export async function courseCursor(snapshot: ContentSnapshot, guideIds: readonly string[]): Promise<CourseCursor> {
  const guides = guideIds.map((id) => snapshot.guideById.get(id)).filter((g): g is Guide => g !== undefined)
  const done = new Set<string>()
  for (const g of guides) for (const id of (await lessonProgressMap(g.id)).keys()) done.add(id)
  const lessons = guides.flatMap((g) => [...courseLessons(snapshot, g).values()].flat()).filter((l) => l.kind !== 'theory')
  const left = lessons.filter((l) => !done.has(l.id))
  const lesson = left[0] ?? null
  return { lesson, remaining: left.length, total: lessons.length, chapterTitle: lesson ? snapshot.chapters.get(lesson.chapterId)?.title ?? null : null }
}

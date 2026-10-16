import 'server-only'
import type { ReactNode } from 'react'
import { and, desc, eq, gte, inArray } from 'drizzle-orm'
import { interleave } from '@/ai/reels/mix'
import { generatedReels, reelState, srsCards } from '@/db/schema'
import type { Chapter, LearningUnit } from '@/content/model'
import { parseMarkdown } from '@/content/parse/markdown'
import type { Reel } from '@/content/parse/reels'
import type { ContentSnapshot } from '@/content/store'
import { renderMdast } from '@/ui/markdown/render'
import { safeExternalUrl } from '@/lib/url'
import { chapterHref } from '@/ui/routes'
import { renderStudyItems, type FlashItem, type QuizItem } from '@/ui/study/render-items'
import { userScope } from '../auth'
import { activeScope } from '../courses/enrollment'
import { lastOutcomes, shuffle } from './queue'

// The feed focuses on the active course's guides; other guides fill in only if they run dry. FEED_GUIDES is the
// fallback for learners without a course and for system jobs (AI reel generation).
export const FEED_GUIDES = ['javascript', 'js-interview']

async function feedGuides(): Promise<readonly string[]> {
  const scope = await activeScope()
  return scope ? [...scope.guides] : FEED_GUIDES
}

export interface ReelSlide {
  kind: 'reel'
  id: string
  emoji: string
  title: string
  body: ReactNode
  chapterTitle: string
  chapterHref: string
  guideTitle: string
  liked: boolean
  saved: boolean
  seen: boolean
  hue: number
  // AI-generated reel (generated_reels): shows the AI badge, the source link and a "hide" action.
  ai?: boolean
  sourceUrl?: string | null
  sourceTitle?: string | null
}

export type FeedSlide = ReelSlide | { kind: 'flashcard'; item: FlashItem } | { kind: 'quiz'; item: QuizItem }

function focus<T extends { guideId: string }>(items: readonly T[], guides: readonly string[]): T[] {
  const preferred = items.filter((i) => guides.includes(i.guideId))
  return preferred.length > 0 ? preferred : [...items]
}

export async function availableReelCount(snapshot: ContentSnapshot): Promise<number> {
  return focus(snapshot.reels, await feedGuides()).length
}

// Stable pastel hue per chapter, so reels from one topic share a colour.
function hueFor(key: string): number {
  let h = 0
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % 360
  return h
}

type GeneratedRow = typeof generatedReels.$inferSelect
type QueuedReel = { kind: 'guide'; reel: Reel } | { kind: 'ai'; row: GeneratedRow }

const GENERATED_WINDOW_MS = 60 * 86_400_000

const PATTERN = ['reel', 'quiz', 'reel', 'flashcard', 'reel', 'quiz', 'flashcard', 'reel'] as const

export async function buildFeed(snapshot: ContentSnapshot, seed: number, size = 24, now = Date.now()): Promise<FeedSlide[]> {
  const guides = await feedGuides()
  const reels = focus(snapshot.reels, guides)
  const units = focus([...snapshot.units.values()], guides)
  const { generated, srsRows, reelRows } = await userScope(async (db, userId) => {
    const [allGenerated, srsRows] = await Promise.all([
      db
        .select()
        .from(generatedReels)
        .where(and(eq(generatedReels.status, 'active'), gte(generatedReels.createdAt, now - GENERATED_WINDOW_MS)))
        .orderBy(desc(generatedReels.createdAt))
        .limit(120),
      db.select({ id: srsCards.unitId, due: srsCards.due }).from(srsCards).where(eq(srsCards.userId, userId)),
    ])
    const reelIds = [...reels.map((r) => r.id), ...allGenerated.map((r) => r.id)]
    const reelRows = reelIds.length
      ? await db
          .select()
          .from(reelState)
          .where(and(eq(reelState.userId, userId), inArray(reelState.reelId, reelIds)))
      : []
    // AI reels this user hid ("не показувати") never come back.
    const hidden = new Set(reelRows.filter((r) => r.hidden).map((r) => r.reelId))
    return { generated: allGenerated.filter((r) => !hidden.has(r.id)), srsRows, reelRows }
  })
  const states = new Map(reelRows.map((r) => [r.reelId, r]))
  const seen = (id: string) => Boolean(states.get(id)?.views)
  const byLastSeen = (a: { id: string }, b: { id: string }) => (states.get(a.id)?.lastSeenAt ?? 0) - (states.get(b.id)?.lastSeenAt ?? 0)

  // Reels: never seen first, then the ones seen longest ago. Generated ones (newest first) are
  // mixed in at ~1 per 2 guide reels.
  const guideItem = (reel: Reel): QueuedReel => ({ kind: 'guide', reel })
  const aiItem = (row: GeneratedRow): QueuedReel => ({ kind: 'ai', row })
  const reelQueue: QueuedReel[] = [
    ...interleave(shuffle(reels.filter((r) => !seen(r.id)), seed).map(guideItem), generated.filter((r) => !seen(r.id)).map(aiItem)),
    ...interleave(reels.filter((r) => seen(r.id)).sort(byLastSeen).map(guideItem), generated.filter((r) => seen(r.id)).sort(byLastSeen).map(aiItem)),
  ]

  // Cards: due first (spaced repetition), then new ones.
  const srs = new Map(srsRows.map((r) => [r.id, r.due]))
  const flash = units.filter((u) => u.kind === 'flashcard')
  const due = shuffle(flash.filter((u) => (srs.get(u.id) ?? Infinity) <= now), seed + 1)
  const fresh = shuffle(flash.filter((u) => !srs.has(u.id)), seed + 2)
  const cardQueue: LearningUnit[] = [...due, ...fresh]

  // Quizzes: wrong last time → never tried → previously right.
  const quizzes = units.filter((u) => u.kind === 'quiz')
  const last = await lastOutcomes(quizzes.map((u) => u.id))
  const quizQueue = [
    ...shuffle(quizzes.filter((u) => last.get(u.id) === false), seed + 3),
    ...shuffle(quizzes.filter((u) => !last.has(u.id)), seed + 4),
    ...shuffle(quizzes.filter((u) => last.get(u.id) === true), seed + 5),
  ]

  const plan: Array<{ kind: 'reel'; item: QueuedReel } | { kind: 'unit'; id: string }> = []
  const queues = { reel: reelQueue, flashcard: cardQueue, quiz: quizQueue }
  for (let i = 0; plan.length < size && i < size * 3; i++) {
    const want = PATTERN[i % PATTERN.length]!
    const order = [want, 'reel', 'quiz', 'flashcard'] as const
    const kind = order.find((k) => queues[k].length > 0)
    if (!kind) break
    if (kind === 'reel') plan.push({ kind: 'reel', item: reelQueue.shift()! })
    else plan.push({ kind: 'unit', id: queues[kind].shift()!.id })
  }

  const rendered = await renderStudyItems(snapshot, plan.flatMap((p) => (p.kind === 'unit' ? [p.id] : [])), now)
  const byId = new Map(rendered.map((r) => [r.unitId, r]))
  const slides = await Promise.all(
    plan.map(async (p): Promise<FeedSlide | null> => {
      if (p.kind === 'unit') {
        const item = byId.get(p.id)
        if (!item || item.kind === 'task') return null
        return item.kind === 'flashcard' ? { kind: 'flashcard', item } : { kind: 'quiz', item }
      }
      if (p.item.kind === 'ai') return renderGenerated(p.item.row, snapshot, states.get(p.item.row.id))
      const reel = p.item.reel
      const chapter = snapshot.chapters.get(reel.chapterId)
      if (!chapter) return null
      const state = states.get(reel.id)
      return {
        kind: 'reel',
        id: reel.id,
        emoji: reel.emoji ?? '⚡',
        title: reel.title,
        body: await renderMdast(reel.body, { snapshot, chapter, depth: 0, variant: 'card' }),
        chapterTitle: chapter.title,
        chapterHref: `${chapterHref(snapshot, chapter)}${reel.sectionSlug ? `#${reel.sectionSlug}` : ''}`,
        guideTitle: snapshot.guideById.get(reel.guideId)?.title ?? '',
        liked: state?.liked ?? false,
        saved: state?.saved ?? false,
        seen: Boolean(state?.views),
        hue: hueFor(reel.chapterId),
      }
    }),
  )
  return slides.filter((s): s is FeedSlide => s !== null)
}

// Wiki-links in AI text resolve relative to the reel's chapter, or to the first feed chapter.
function fallbackChapter(snapshot: ContentSnapshot): Chapter | undefined {
  for (const id of FEED_GUIDES) {
    const first = snapshot.guideById.get(id)?.chapterIds[0]
    const chapter = first ? snapshot.chapters.get(first) : undefined
    if (chapter) return chapter
  }
  return snapshot.chapters.values().next().value
}

async function renderGenerated(row: GeneratedRow, snapshot: ContentSnapshot, state: { views: number; liked: boolean; saved: boolean } | undefined): Promise<ReelSlide | null> {
  const chapter = row.chapterId ? snapshot.chapters.get(row.chapterId) : undefined
  const envChapter = chapter ?? fallbackChapter(snapshot)
  if (!envChapter) return null
  return {
    kind: 'reel',
    id: row.id,
    emoji: row.emoji,
    title: row.title,
    body: await renderMdast(parseMarkdown(row.body).root, { snapshot, chapter: envChapter, depth: 0, variant: 'card' }),
    chapterTitle: chapter?.title ?? row.topic,
    // News reels lead to the news page; a reel with neither chapter nor news has no link.
    chapterHref: chapter ? chapterHref(snapshot, chapter) : row.topic.startsWith('Новини') ? '/news' : '',
    guideTitle: chapter ? (snapshot.guideById.get(chapter.guideId)?.title ?? '') : '',
    liked: state?.liked ?? false,
    saved: state?.saved ?? false,
    seen: Boolean(state?.views),
    hue: hueFor(row.chapterId ?? row.topic),
    ai: true,
    sourceUrl: safeExternalUrl(row.sourceUrl),
    sourceTitle: row.sourceTitle,
  }
}

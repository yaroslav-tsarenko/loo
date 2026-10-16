import 'server-only'
import { and, eq } from 'drizzle-orm'
import { srsCards, taskState } from '@/db/schema'
import { SECTION_FALLBACK_ICON, TOPIC_FALLBACK_ICONS } from '@/content/icons'
import type { LessonKind } from '@/content/lessons'
import type { Track } from '@/content/tracks'
import type { Chapter, Guide } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { chapterMastery, STABLE_DAYS, type ChapterSignals, type Mastery } from '@/progress/mastery'
import { chapterHref } from '@/ui/routes'
import { userScope } from '../auth'
import { chapterProgressMap, readableChapters } from './library'
import { courseLessons, lessonProgressMap } from './lessons'
import { lastOutcomes } from './queue'

// ts-fsrs State.Review
const REVIEW_STATE = 2

export interface PathLesson {
  id: string
  kind: LessonKind
  // icon refs below are for <Icon name> (src/content/icons.ts)
  icon: string
  title: string
  minutes: number
  size: number
  href: string
  done: boolean
  perfect: boolean
  current: boolean
}

export interface PathNode {
  lessons: PathLesson[]
  chapter: Chapter
  number: number
  icon: string
  href: string
  mastery: Mastery
  signals: ChapterSignals
  state: 'done' | 'current' | 'upcoming'
}

export interface PathStage {
  icon: string
  title: string
  nodes: PathNode[]
  ratio: number
}

export interface GuidePath {
  guide: Guide
  stages: PathStage[]
  crowns: number
  maxCrowns: number
  ratio: number
  current: PathNode | null
}

export async function guidePath(snapshot: ContentSnapshot, guide: Guide): Promise<GuidePath> {
  const chapters = readableChapters(snapshot, guide)
  const units = chapters.flatMap((c) => snapshot.unitsByChapter.get(c.id) ?? [])
  const [progress, outcomes, [srsRows, solvedRows], lessonRows] = await Promise.all([
    chapterProgressMap(),
    lastOutcomes(units.filter((u) => u.kind === 'quiz').map((u) => u.id)),
    userScope((db, userId) =>
      Promise.all([
        db.select({ id: srsCards.unitId, state: srsCards.state, stability: srsCards.stability }).from(srsCards).where(eq(srsCards.userId, userId)),
        db
          .select({ id: taskState.unitId })
          .from(taskState)
          .where(and(eq(taskState.userId, userId), eq(taskState.status, 'solved'))),
      ]),
    ),
    lessonProgressMap(guide.id),
  ])
  const lessonsByChapter = courseLessons(snapshot, guide)
  let currentFound = false
  const srs = new Map(srsRows.map((r) => [r.id, r]))
  const solved = new Set(solvedRows.map((r) => r.id))

  const nodes: PathNode[] = chapters.map((chapter, i) => {
    const signals: ChapterSignals = {
      status: progress.get(chapter.id)?.status ?? 'unread',
      quizzes: { total: 0, answered: 0, correct: 0 },
      cards: { total: 0, reviewing: 0, stable: 0 },
      tasks: { total: 0, solved: 0 },
    }
    for (const unit of snapshot.unitsByChapter.get(chapter.id) ?? []) {
      if (unit.kind === 'quiz') {
        signals.quizzes.total++
        const last = outcomes.get(unit.id)
        if (last !== undefined) {
          signals.quizzes.answered++
          if (last) signals.quizzes.correct++
        }
      } else if (unit.kind === 'flashcard') {
        signals.cards.total++
        const card = srs.get(unit.id)
        if (card?.state === REVIEW_STATE) {
          signals.cards.reviewing++
          if (card.stability >= STABLE_DAYS) signals.cards.stable++
        }
      } else {
        signals.tasks.total++
        if (solved.has(unit.id)) signals.tasks.solved++
      }
    }
    const mastery = chapterMastery(signals)
    const number = chapter.number ?? i + 1
    const lessons: PathLesson[] = (lessonsByChapter.get(chapter.id) ?? []).map((l) => {
      const record = lessonRows.get(l.id)
      const done = l.kind === 'theory' ? signals.status === 'studied' : Boolean(record)
      // The current lesson is the first unfinished one along the whole course.
      const current = !done && !currentFound
      if (current) currentFound = true
      return {
        id: l.id,
        kind: l.kind,
        icon: l.icon,
        title: l.title,
        minutes: l.minutes,
        size: l.items.length,
        href: l.kind === 'theory' ? chapterHref(snapshot, chapter) : `/learn/${encodeURIComponent(l.id)}`,
        done,
        perfect: (record?.bestAccuracy ?? 0) >= 1,
        current,
      }
    })
    return {
      lessons,
      chapter,
      number,
      icon: chapter.icon ?? TOPIC_FALLBACK_ICONS[i % TOPIC_FALLBACK_ICONS.length]!,
      href: chapterHref(snapshot, chapter),
      mastery,
      signals,
      state: lessons.some((l) => l.current) ? 'current' : mastery.crowns >= 2 || (lessons.length > 0 && lessons.every((l) => l.done)) ? 'done' : 'upcoming',
    }
  })

  const stageOf = (n: PathNode) => guide.parts.findIndex((p) => n.number >= p.from && n.number <= p.to)
  const stages: PathStage[] =
    guide.parts.length > 0
      ? guide.parts.map((p, i) => ({ icon: p.icon ?? SECTION_FALLBACK_ICON, title: p.title, nodes: nodes.filter((n) => stageOf(n) === i), ratio: 0 }))
      : [{ icon: SECTION_FALLBACK_ICON, title: guide.title, nodes, ratio: 0 }]
  const orphans = guide.parts.length > 0 ? nodes.filter((n) => stageOf(n) < 0) : []
  if (orphans.length > 0) stages.push({ icon: 'pi:PiPlusBold', title: 'Додатково', nodes: orphans, ratio: 0 })
  for (const stage of stages) stage.ratio = stage.nodes.length ? stage.nodes.reduce((s, n) => s + n.mastery.ratio, 0) / stage.nodes.length : 0

  const crowns = nodes.reduce((s, n) => s + n.mastery.crowns, 0)
  return {
    guide,
    stages: stages.filter((s) => s.nodes.length > 0),
    crowns,
    maxCrowns: nodes.length * 5,
    ratio: nodes.length ? nodes.reduce((s, n) => s + n.mastery.ratio, 0) / nodes.length : 0,
    current: nodes.find((n) => n.state === 'current') ?? null,
  }
}

export interface TrackPath {
  track: Track
  guides: Guide[]
  stages: PathStage[]
  crowns: number
  maxCrowns: number
  ratio: number
  lessonsDone: number
  lessonsTotal: number
  current: PathNode | null
}

// A track glues its guides into one path: the core guide's stages first, then each extra guide as its own stage.
export async function trackPath(snapshot: ContentSnapshot, track: Track): Promise<TrackPath> {
  const guides = track.guides.map((id) => snapshot.guideById.get(id)).filter((g): g is Guide => g !== undefined)
  const paths = await Promise.all(guides.map((g) => guidePath(snapshot, g)))
  const stages: PathStage[] = []
  for (const p of paths) {
    if (p.guide.parts.length > 0) stages.push(...p.stages)
    else stages.push(...p.stages.map((s) => ({ ...s, icon: p.guide.icon ?? SECTION_FALLBACK_ICON, title: p.guide.title })))
  }
  const nodes = stages.flatMap((s) => s.nodes)
  // Each guide marks its own first unfinished lesson; across the track only the very first one is current.
  let seen = false
  for (const node of nodes) {
    for (const lesson of node.lessons) {
      if (!lesson.current) continue
      if (seen) lesson.current = false
      seen = true
    }
    if (node.state === 'current' && !node.lessons.some((l) => l.current)) node.state = node.lessons.every((l) => l.done) ? 'done' : 'upcoming'
  }
  const lessons = nodes.flatMap((n) => n.lessons)
  const crowns = paths.reduce((s, p) => s + p.crowns, 0)
  const maxCrowns = paths.reduce((s, p) => s + p.maxCrowns, 0)
  return {
    track,
    guides,
    stages,
    crowns,
    maxCrowns,
    ratio: nodes.length ? nodes.reduce((s, n) => s + n.mastery.ratio, 0) / nodes.length : 0,
    lessonsDone: lessons.filter((l) => l.done).length,
    lessonsTotal: lessons.length,
    current: nodes.find((n) => n.state === 'current') ?? null,
  }
}

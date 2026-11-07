import 'server-only'
import { and, desc, eq, isNull, lte, sql } from 'drizzle-orm'
import { type Conn } from '@/db/client'
import { attempts, chapterProgress, dailyActivity, mistakes, srsCards } from '@/db/schema'
import type { Chapter, Guide, TreeNode } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { dayKey } from '@/progress/day'
import { chapterHref } from '@/ui/routes'
import { userScope } from '../auth'
import { read, readBatch, readOne, type Read } from '../db/batch'
import { settleStreak } from '../game'
import { readSettings, type AppSettings } from '../settings'
import { shellData } from '../shell'

export type ChapterStatus = 'unread' | 'reading' | 'studied'

export interface ProgressRow {
  status: ChapterStatus
  scrollPct: number
  lastOpenedAt: number
  timeMs: number
}

// Page renders: the map read with the shell (src/server/shell.ts) — no query of its own.
export async function pageProgress(): Promise<Map<string, ProgressRow>> {
  return (await shellData())?.progress ?? new Map()
}

export async function chapterProgressIn(conn: Conn, userId: string): Promise<Map<string, ProgressRow>> {
  return readOne(conn, progressRead(conn, userId))
}

export function progressRead(conn: Conn, userId: string): Read<Map<string, ProgressRow>> {
  return read(
    conn
      .select({ chapterId: chapterProgress.chapterId, status: chapterProgress.status, scrollPct: chapterProgress.scrollPct, lastOpenedAt: chapterProgress.lastOpenedAt, timeMs: chapterProgress.timeMs })
      .from(chapterProgress)
      .where(eq(chapterProgress.userId, userId)),
    (rows) => new Map(rows.map((r) => [r.chapterId, { status: r.status, scrollPct: r.scrollPct, lastOpenedAt: r.lastOpenedAt, timeMs: r.timeMs }])),
  )
}

export interface GuideRow {
  guide: Guide
  chapters: number
  studied: number
  reading: number
  units: { flashcard: number; quiz: number; task: number }
  due: number
  accuracy: number | null
  answered: number
  lastOpenedAt: number | null
  nextChapter: Chapter | null
}

export function readableChapters(snapshot: ContentSnapshot, guide: Guide): Chapter[] {
  return guide.chapterIds.map((id) => snapshot.chapters.get(id)).filter((c): c is Chapter => Boolean(c) && c!.kind !== 'index')
}

export function nextChapterFor(snapshot: ContentSnapshot, guide: Guide, progress: ReadonlyMap<string, ProgressRow>): Chapter | null {
  const chapters = readableChapters(snapshot, guide)
  const reading = chapters
    .filter((c) => progress.get(c.id)?.status === 'reading')
    .sort((a, b) => (progress.get(b.id)?.lastOpenedAt ?? 0) - (progress.get(a.id)?.lastOpenedAt ?? 0))[0]
  if (reading) return reading
  return chapters.find((c) => progress.get(c.id)?.status !== 'studied') ?? null
}

export async function libraryRows(snapshot: ContentSnapshot): Promise<GuideRow[]> {
  const now = Date.now()
  const [progress, [dueRows, accRows]] = await Promise.all([
    pageProgress(),
    userScope((db, userId) =>
      Promise.all([
        db
          .select({ id: srsCards.unitId })
          .from(srsCards)
          .where(and(eq(srsCards.userId, userId), lte(srsCards.due, now))),
        db
          .select({ guideId: attempts.guideId, total: sql<number>`count(*)`, correct: sql<number>`count(*) filter (where ${attempts.correct})` })
          .from(attempts)
          .where(eq(attempts.userId, userId))
          .groupBy(attempts.guideId),
      ]),
    ),
  ])
  const due = new Set(dueRows.map((r) => r.id))
  const acc = new Map(accRows.map((r) => [r.guideId, { total: Number(r.total), correct: Number(r.correct) }]))
  return snapshot.guides.map((guide) => {
    const chapters = readableChapters(snapshot, guide)
    const units = { flashcard: 0, quiz: 0, task: 0 }
    let dueCount = 0
    for (const unit of snapshot.units.values()) {
      if (unit.guideId !== guide.id) continue
      units[unit.kind]++
      if (due.has(unit.id)) dueCount++
    }
    const a = acc.get(guide.id)
    const opened = chapters.map((c) => progress.get(c.id)?.lastOpenedAt ?? 0).filter((t) => t > 0)
    return {
      guide,
      chapters: chapters.length,
      studied: chapters.filter((c) => progress.get(c.id)?.status === 'studied').length,
      reading: chapters.filter((c) => progress.get(c.id)?.status === 'reading').length,
      units,
      due: dueCount,
      accuracy: a && a.total > 0 ? a.correct / a.total : null,
      answered: a?.total ?? 0,
      lastOpenedAt: opened.length > 0 ? Math.max(...opened) : null,
      nextChapter: nextChapterFor(snapshot, guide, progress),
    }
  })
}

export interface TodaySummary {
  due: number
  newAvailable: number
  mistakes: number
  answeredToday: number
  goal: number
  streak: number
  continueChapter: { chapter: Chapter; guide: Guide; href: string; scrollPct: number } | null
}

export async function todaySummary(snapshot: ContentSnapshot): Promise<TodaySummary> {
  const settings = await readSettings()
  const now = Date.now()
  return userScope(
    async (db, userId) => {
      // with freezes applied (src/server/game/streak.ts)
      const { streak } = await settleStreak(db, userId, now)
      return todaySummaryIn(db, userId, snapshot, settings, streak.current, now)
    },
    { tx: true },
  )
}

// todaySummary inside the caller's transaction; `streak` is the settled streak (the shell has it already).
export async function todaySummaryIn(db: Conn, userId: string, snapshot: ContentSnapshot, settings: Pick<AppSettings, 'newCardsPerDay' | 'dailyGoal'>, streak: number, now = Date.now()): Promise<TodaySummary> {
  // one statement (src/server/db/batch.ts)
  const [srsRows, openRows, todayRows, goalRows, last] = await readBatch(db, [
    db.select({ id: srsCards.unitId, due: srsCards.due }).from(srsCards).where(eq(srsCards.userId, userId)),
    db
      .select({ id: mistakes.unitId })
      .from(mistakes)
      .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
    db
      .select()
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.day, dayKey(now)))),
    db
      .select({ day: dailyActivity.day })
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.goalMet, true))),
    db
      .select()
      .from(chapterProgress)
      .where(and(eq(chapterProgress.userId, userId), eq(chapterProgress.status, 'reading')))
      .orderBy(desc(chapterProgress.lastOpenedAt))
      .limit(5),
  ])
  const today = todayRows[0]
  const reviewed = new Set(srsRows.map((r) => r.id))
  const due = srsRows.filter((r) => r.due <= now && snapshot.units.has(r.id)).length
  let newAvailable = 0
  for (const unit of snapshot.units.values()) if (unit.kind === 'flashcard' && !reviewed.has(unit.id)) newAvailable++
  const open = openRows.filter((r) => snapshot.units.has(r.id)).length
  const goalDays = goalRows.map((r) => r.day)
  let continueChapter: TodaySummary['continueChapter'] = null
  for (const row of last) {
    const chapter = snapshot.chapters.get(row.chapterId)
    const guide = chapter ? snapshot.guideById.get(chapter.guideId) : undefined
    if (chapter && guide && chapter.kind !== 'index') {
      continueChapter = { chapter, guide, href: chapterHref(snapshot, chapter), scrollPct: row.scrollPct }
      break
    }
  }
  return {
    due,
    newAvailable: Math.min(newAvailable, settings.newCardsPerDay),
    mistakes: open,
    answeredToday: today?.total ?? 0,
    goal: settings.dailyGoal,
    streak: goalDays.length > 0 ? streak : 0,
    continueChapter,
  }
}

export interface TreeViewNode {
  kind: 'group' | 'chapter'
  id: string
  title: string
  href: string | null
  number: string | null
  status: ChapterStatus | null
  units: number
  overviewId: string | null
  children: TreeViewNode[]
}

export function treeView(snapshot: ContentSnapshot, guide: Guide, progress: Map<string, ProgressRow>): TreeViewNode[] {
  const walk = (nodes: TreeNode[], prefix: string): TreeViewNode[] =>
    nodes.map((node, i) => {
      const number = prefix ? `${prefix}.${i + 1}` : String(i + 1)
      if (node.kind === 'chapter') {
        const chapter = snapshot.chapters.get(node.id)!
        return {
          kind: 'chapter' as const,
          id: chapter.id,
          title: chapter.title,
          href: chapterHref(snapshot, chapter),
          number,
          status: progress.get(chapter.id)?.status ?? 'unread',
          units: chapter.unitIds.length,
          overviewId: null,
          children: [],
        }
      }
      const overview = node.overviewId ? snapshot.chapters.get(node.overviewId) : undefined
      return {
        kind: 'group' as const,
        id: node.id,
        title: node.title,
        href: overview ? chapterHref(snapshot, overview) : null,
        number,
        status: overview ? progress.get(overview.id)?.status ?? 'unread' : null,
        units: 0,
        overviewId: overview?.id ?? null,
        children: walk(node.children, number),
      }
    })
  return walk(guide.tree, '')
}

export function chapterNumberMap(tree: TreeViewNode[]): Map<string, string> {
  const map = new Map<string, string>()
  const walk = (nodes: TreeViewNode[]) => {
    for (const n of nodes) {
      if (n.kind === 'chapter' && n.number) map.set(n.id, n.number)
      if (n.overviewId && n.number) map.set(n.overviewId, n.number)
      walk(n.children)
    }
  }
  walk(tree)
  return map
}

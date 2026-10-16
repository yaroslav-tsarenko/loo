import 'server-only'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { attempts, mistakes } from '@/db/schema'
import type { Chapter } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { userScope } from '../auth'

// Per-chapter accuracy and open mistakes (the engineer map). Profile statistics live in src/server/stats/.

export interface Accuracy {
  total: number
  correct: number
  rate: number | null
}

// Postgres can't sum booleans: count the rows where the attempt was correct.
const correctCount = sql<number>`count(*) filter (where ${attempts.correct})`

function acc(total: number, correct: number): Accuracy {
  return { total, correct, rate: total > 0 ? correct / total : null }
}

export interface WeakChapter {
  chapter: Chapter
  accuracy: Accuracy
  open: number
}

export async function chapterAccuracy(): Promise<Map<string, Accuracy>> {
  const rows = await userScope((db, userId) =>
    db
      .select({ chapterId: attempts.chapterId, total: sql<number>`count(*)`, correct: correctCount })
      .from(attempts)
      .where(eq(attempts.userId, userId))
      .groupBy(attempts.chapterId),
  )
  return new Map(rows.map((r) => [r.chapterId, acc(Number(r.total), Number(r.correct))]))
}

export async function openMistakesByChapter(snapshot: ContentSnapshot): Promise<Map<string, number>> {
  const rows = await userScope((db, userId) =>
    db
      .select({ unitId: mistakes.unitId })
      .from(mistakes)
      .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
  )
  const out = new Map<string, number>()
  for (const r of rows) {
    const unit = snapshot.units.get(r.unitId)
    if (unit) out.set(unit.chapterId, (out.get(unit.chapterId) ?? 0) + 1)
  }
  return out
}

export async function weakChapters(snapshot: ContentSnapshot, limit = 8): Promise<WeakChapter[]> {
  const [accuracy, open] = await Promise.all([chapterAccuracy(), openMistakesByChapter(snapshot)])
  const out: WeakChapter[] = []
  for (const [chapterId, a] of accuracy) {
    const chapter = snapshot.chapters.get(chapterId)
    if (!chapter || a.total < 3 || a.rate === null) continue
    if (a.rate >= 0.75 && !open.get(chapterId)) continue
    out.push({ chapter, accuracy: a, open: open.get(chapterId) ?? 0 })
  }
  for (const [chapterId, n] of open) {
    if (out.some((w) => w.chapter.id === chapterId)) continue
    const chapter = snapshot.chapters.get(chapterId)
    if (chapter) out.push({ chapter, accuracy: accuracy.get(chapterId) ?? acc(0, 0), open: n })
  }
  return out.sort((a, b) => (a.accuracy.rate ?? 1) - (b.accuracy.rate ?? 1) || b.open - a.open).slice(0, limit)
}

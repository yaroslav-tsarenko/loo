import 'server-only'
import { desc, eq, gte, isNull, sql } from 'drizzle-orm'
import { first, getDb } from '@/db/client'
import { achievements, attempts, chapterProgress, dailyActivity, mistakes } from '@/db/schema'
import { LEVELS, type Chapter, type Guide, type Level } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { ACHIEVEMENTS } from '@/progress/achievements/catalog'
import { progressOf, type AchievementDef } from '@/progress/achievements/dsl'
import { dayKey, shiftDay } from '@/progress/day'
import { computeStreak } from '@/progress/streak'
import { computeStats, totalXp } from './progress'
import { chapterProgressMap, readableChapters } from './library'
import { readSettings } from '../settings'

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

export interface HeatDay {
  day: string
  total: number
  xp: number
  goalMet: boolean
}

export interface ProfileData {
  xp: number
  streak: { current: number; best: number }
  answered: number
  accuracy: Accuracy
  studyMs: number
  readingMs: number
  heat: HeatDay[]
  byGuide: Array<{ guide: Guide; accuracy: Accuracy; studied: number; chapters: number }>
  byLevel: Array<{ level: Level; accuracy: Accuracy }>
  weak: Array<{ chapter: Chapter; accuracy: Accuracy; open: number }>
  achievements: Array<{ def: AchievementDef; unlockedAt: number | null; progress: number }>
  goal: number
  today: number
}

export async function chapterAccuracy(): Promise<Map<string, Accuracy>> {
  const rows = await getDb()
    .select({ chapterId: attempts.chapterId, total: sql<number>`count(*)`, correct: correctCount })
    .from(attempts)
    .groupBy(attempts.chapterId)
  return new Map(rows.map((r) => [r.chapterId, acc(Number(r.total), Number(r.correct))]))
}

export async function openMistakesByChapter(snapshot: ContentSnapshot): Promise<Map<string, number>> {
  const rows = await getDb().select({ unitId: mistakes.unitId }).from(mistakes).where(isNull(mistakes.resolvedAt))
  const out = new Map<string, number>()
  for (const r of rows) {
    const unit = snapshot.units.get(r.unitId)
    if (unit) out.set(unit.chapterId, (out.get(unit.chapterId) ?? 0) + 1)
  }
  return out
}

export async function weakChapters(snapshot: ContentSnapshot, limit = 8): Promise<ProfileData['weak']> {
  const [accuracy, open] = await Promise.all([chapterAccuracy(), openMistakesByChapter(snapshot)])
  const out: ProfileData['weak'] = []
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

export async function profileData(snapshot: ContentSnapshot, now = Date.now()): Promise<ProfileData> {
  const db = getDb()
  const today = dayKey(now)
  const from = shiftDay(today, -181)
  const [days, goalRows, totals, time, reading, guideRows, levelRows, achievementList, progress, stats, xp, weak, settings] = await Promise.all([
    db.select().from(dailyActivity).where(gte(dailyActivity.day, from)),
    db.select({ day: dailyActivity.day }).from(dailyActivity).where(eq(dailyActivity.goalMet, true)),
    first(db.select({ total: sql<number>`count(*)`, correct: correctCount, ms: sql<number>`coalesce(sum(${attempts.durationMs}), 0)` }).from(attempts)),
    first(db.select({ ms: sql<number>`coalesce(sum(${dailyActivity.timeMs}), 0)` }).from(dailyActivity)),
    first(db.select({ ms: sql<number>`coalesce(sum(${chapterProgress.timeMs}), 0)` }).from(chapterProgress)),
    db.select({ guideId: attempts.guideId, total: sql<number>`count(*)`, correct: correctCount }).from(attempts).groupBy(attempts.guideId),
    db.select({ level: attempts.level, total: sql<number>`count(*)`, correct: correctCount }).from(attempts).groupBy(attempts.level),
    db.select().from(achievements),
    chapterProgressMap(),
    computeStats(db, snapshot, now),
    totalXp(db),
    weakChapters(snapshot),
    readSettings(),
  ])
  const byDay = new Map(days.map((d) => [d.day, d]))
  const heat: HeatDay[] = []
  for (let i = 181; i >= 0; i--) {
    const day = shiftDay(today, -i)
    const d = byDay.get(day)
    heat.push({ day, total: d?.total ?? 0, xp: d?.xp ?? 0, goalMet: d?.goalMet ?? false })
  }
  const streak = computeStreak(
    goalRows.map((r) => r.day),
    today,
  )
  const guideAcc = new Map(guideRows.map((r) => [r.guideId, acc(Number(r.total), Number(r.correct))]))
  const byGuide = snapshot.guides.map((guide) => {
    const chapters = readableChapters(snapshot, guide)
    return {
      guide,
      accuracy: guideAcc.get(guide.id) ?? acc(0, 0),
      studied: chapters.filter((c) => progress.get(c.id)?.status === 'studied').length,
      chapters: chapters.length,
    }
  })
  const byLevel = LEVELS.map((level) => {
    const r = levelRows.find((x) => x.level === level)
    return { level, accuracy: acc(Number(r?.total ?? 0), Number(r?.correct ?? 0)) }
  })
  const unlocked = new Map(achievementList.map((a) => [a.id, a.unlockedAt]))
  const achievementRows = ACHIEVEMENTS.map((def) => ({ def, unlockedAt: unlocked.get(def.id) ?? null, progress: progressOf(def.when, stats) }))
  return {
    xp,
    streak: { current: streak.current, best: streak.best },
    answered: Number(totals?.total ?? 0),
    accuracy: acc(Number(totals?.total ?? 0), Number(totals?.correct ?? 0)),
    studyMs: Number(time?.ms ?? 0),
    readingMs: Number(reading?.ms ?? 0),
    heat,
    byGuide,
    byLevel,
    weak,
    achievements: achievementRows,
    goal: settings.dailyGoal,
    today: byDay.get(today)?.total ?? 0,
  }
}

export async function lastAttemptAt(): Promise<number | null> {
  const row = await first(getDb().select({ at: attempts.answeredAt }).from(attempts).orderBy(desc(attempts.id)).limit(1))
  return row?.at ?? null
}

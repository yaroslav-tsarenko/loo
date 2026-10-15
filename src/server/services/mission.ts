import 'server-only'
import { and, eq, gte, inArray, isNull, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { attempts, chapterProgress, dailyActivity, dailyMissions, lessonProgress, mistakes, reelState, sessions, srsCards, taskState, xpLedger } from '@/db/schema'
import type { Chapter } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { dayKey, dayStartMs } from '@/progress/day'
import { missionRatio, planMission, stepProgress, type MissionActivity, type MissionPlan, type StepProgress } from '@/progress/mission'
import type { Effect } from '@/progress/types'
import { chapterHref } from '@/ui/routes'
import { userScope } from '../auth'
import { readSettings } from '../settings'
import { TRACKS } from '@/content/tracks'
import { chapterProgressMap, nextChapterFor } from './library'
import { courseCursor, type CourseCursor } from './lessons'

// The learner's main course for now. Later this comes from the active track setting.
export const MAIN_TRACK = TRACKS[0]!

export interface MissionView {
  cursor: CourseCursor
  plan: MissionPlan
  progress: StepProgress[]
  ratio: number
  complete: boolean
  completedAt: number | null
  hrefs: Record<string, string>
}

// The guide the learner is currently in: the last opened one, else the deep JavaScript guide, else the first.
async function currentNextChapter(snapshot: ContentSnapshot): Promise<Chapter | null> {
  const progress = await chapterProgressMap()
  const last = [...progress.entries()].sort((a, b) => b[1].lastOpenedAt - a[1].lastOpenedAt)[0]
  const lastGuide = last ? snapshot.guideById.get(snapshot.chapters.get(last[0])?.guideId ?? '') : undefined
  const candidates = [lastGuide, snapshot.guideById.get('javascript'), ...snapshot.guides].filter((g) => g !== undefined)
  for (const guide of candidates) {
    const next = nextChapterFor(snapshot, guide, progress)
    if (next) return next
  }
  return null
}

async function buildPlan(db: Conn, userId: string, snapshot: ContentSnapshot, budget: number, reels: number, lessons: number, now: number): Promise<MissionPlan> {
  const [srsRows, openRows, solvedRows, next] = await Promise.all([
    db.select({ id: srsCards.unitId, due: srsCards.due }).from(srsCards).where(eq(srsCards.userId, userId)),
    db
      .select({ id: mistakes.unitId })
      .from(mistakes)
      .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
    db
      .select({ id: taskState.unitId })
      .from(taskState)
      .where(and(eq(taskState.userId, userId), eq(taskState.status, 'solved'))),
    currentNextChapter(snapshot),
  ])
  const srs = new Map(srsRows.map((r) => [r.id, r.due]))
  const solved = new Set(solvedRows.map((r) => r.id))
  let due = 0
  let fresh = 0
  let quizzes = 0
  const tasks = { easy: 0, medium: 0, hard: 0 }
  for (const unit of snapshot.units.values()) {
    if (unit.kind === 'flashcard') {
      const at = srs.get(unit.id)
      if (at === undefined) fresh++
      else if (at <= now) due++
    } else if (unit.kind === 'quiz') quizzes++
    else if (!solved.has(unit.id)) tasks[unit.difficulty]++
  }
  return planMission({
    budget,
    day: dayKey(now),
    weekday: new Date(dayStartMs(now)).getDay(),
    due,
    newCards: fresh,
    mistakes: openRows.filter((r) => snapshot.units.has(r.id)).length,
    quizzes,
    tasks,
    reels,
    lessons,
    nextChapter: next ? { id: next.id, title: next.title, minutes: next.estimatedMinutes } : null,
  })
}

async function activity(conn: Conn, userId: string, plan: MissionPlan, now: number): Promise<MissionActivity> {
  const day = dayKey(now)
  const start = dayStartMs(now)
  const readChapter = plan.steps.find((s) => s.kind === 'read')?.chapterId
  const [counts, mistakeRow, today, reels, studied, lessonsRow] = await Promise.all([
    first(
      conn
        .select({
          cards: sql<number>`count(*) filter (where ${attempts.kind} = 'flashcard')`,
          quizzes: sql<number>`count(*) filter (where ${attempts.kind} = 'quiz')`,
          solved: sql<number>`count(*) filter (where ${attempts.kind} = 'task' and ${attempts.outcome} = 'solved')`,
          ms: sql<number>`coalesce(sum(${attempts.durationMs}), 0)`,
        })
        .from(attempts)
        .where(and(eq(attempts.userId, userId), eq(attempts.day, day))),
    ),
    first(
      conn
        .select({ n: sql<number>`count(*)` })
        .from(attempts)
        .innerJoin(sessions, and(eq(sessions.id, attempts.sessionId), eq(sessions.userId, attempts.userId)))
        .where(and(eq(attempts.userId, userId), eq(attempts.day, day), eq(sessions.mode, 'mistakes'))),
    ),
    first(
      conn
        .select({ timeMs: dailyActivity.timeMs })
        .from(dailyActivity)
        .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.day, day))),
    ),
    first(
      conn
        .select({ n: sql<number>`count(*)` })
        .from(reelState)
        .where(and(eq(reelState.userId, userId), gte(reelState.lastSeenAt, start))),
    ),
    readChapter
      ? first(
          conn
            .select({ at: chapterProgress.studiedAt })
            .from(chapterProgress)
            .where(and(eq(chapterProgress.userId, userId), eq(chapterProgress.chapterId, readChapter), gte(chapterProgress.studiedAt, start))),
        )
      : Promise.resolve(undefined),
    first(
      conn
        .select({ n: sql<number>`count(*)` })
        .from(lessonProgress)
        .where(and(eq(lessonProgress.userId, userId), gte(lessonProgress.lastCompletedAt, start))),
    ),
  ])
  // dailyActivity.timeMs = reading time + answering time; subtract answering to get reading.
  const readingMs = Math.max(0, Number(today?.timeMs ?? 0) - Number(counts?.ms ?? 0))
  return {
    cards: Number(counts?.cards ?? 0),
    quizzes: Number(counts?.quizzes ?? 0),
    tasksSolved: Number(counts?.solved ?? 0),
    mistakes: Number(mistakeRow?.n ?? 0),
    readingMinutes: readingMs / 60_000,
    chapterStudied: Boolean(studied?.at),
    lessons: Number(lessonsRow?.n ?? 0),
    reels: Number(reels?.n ?? 0),
  }
}

// Today's plan is created once and kept stable, unless the budget changed before any progress was made.
async function ensurePlan(db: Conn, userId: string, snapshot: ContentSnapshot, reels: number, lessons: number, now: number) {
  const day = dayKey(now)
  const { dailyMinutes } = await readSettings()
  const row = await first(
    db
      .select()
      .from(dailyMissions)
      .where(and(eq(dailyMissions.userId, userId), eq(dailyMissions.day, day))),
  )
  if (row && (row.budgetMinutes === dailyMinutes || row.completedAt)) return row
  if (row) {
    const progress = stepProgress(row.plan as MissionPlan, await activity(db, userId, row.plan as MissionPlan, now))
    if (missionRatio(progress) > 0) return row
  }
  const plan = await buildPlan(db, userId, snapshot, dailyMinutes, reels, lessons, now)
  const values = { userId, day, budgetMinutes: dailyMinutes, plan, progress: {}, completedAt: null, createdAt: now }
  await db
    .insert(dailyMissions)
    .values(values)
    .onConflictDoUpdate({ target: [dailyMissions.userId, dailyMissions.day], set: { budgetMinutes: dailyMinutes, plan, createdAt: now } })
  return values
}

function hrefsFor(snapshot: ContentSnapshot, plan: MissionPlan, cursor: CourseCursor): Record<string, string> {
  const out: Record<string, string> = {}
  for (const step of plan.steps) {
    switch (step.kind) {
      case 'review':
        out[step.id] = `/review?size=${step.target}`
        break
      case 'mistakes':
        out[step.id] = '/mistakes'
        break
      case 'lessons':
        out[step.id] = cursor.lesson ? `/learn/${encodeURIComponent(cursor.lesson.id)}` : '/path'
        break
      case 'read': {
        const chapter = step.chapterId ? snapshot.chapters.get(step.chapterId) : undefined
        out[step.id] = chapter ? chapterHref(snapshot, chapter) : '/'
        break
      }
      case 'quiz':
      case 'boss':
        out[step.id] = `/quiz?size=${step.target}`
        break
      case 'task':
        out[step.id] = `/tasks${step.difficulty ? `?type=${step.difficulty}` : ''}`
        break
      case 'feed':
        out[step.id] = '/feed'
        break
    }
  }
  return out
}

export async function getMission(snapshot: ContentSnapshot, reels: number, now = Date.now()): Promise<MissionView> {
  const cursor = await courseCursor(snapshot, MAIN_TRACK.guides)
  return userScope(async (db, userId) => {
    const row = await ensurePlan(db, userId, snapshot, reels, cursor.remaining, now)
    const plan = row.plan as MissionPlan
    const progress = stepProgress(plan, await activity(db, userId, plan, now))
    const ratio = missionRatio(progress)
    return { cursor, plan, progress, ratio, complete: progress.every((p) => p.complete), completedAt: row.completedAt ?? null, hrefs: hrefsFor(snapshot, plan, cursor) }
  })
}

// Called after every learning action: awards the mission bonus once, when the last step is done.
export async function settleMission(conn: Conn, userId: string, now = Date.now()): Promise<Effect[]> {
  const day = dayKey(now)
  const row = await first(
    conn
      .select()
      .from(dailyMissions)
      .where(and(eq(dailyMissions.userId, userId), eq(dailyMissions.day, day))),
  )
  if (!row || row.completedAt) return []
  const plan = row.plan as MissionPlan
  const progress = stepProgress(plan, await activity(conn, userId, plan, now))
  if (!progress.every((p) => p.complete)) return []
  await conn
    .update(dailyMissions)
    .set({ completedAt: now })
    .where(and(eq(dailyMissions.userId, userId), eq(dailyMissions.day, day)))
  await conn.insert(xpLedger).values({ userId, amount: plan.bonusXp, reason: 'mission', refId: day, createdAt: now, day })
  await conn
    .insert(dailyActivity)
    .values({ userId, day, xp: plan.bonusXp, goalMet: true })
    .onConflictDoUpdate({ target: [dailyActivity.userId, dailyActivity.day], set: { xp: sql`${dailyActivity.xp} + ${plan.bonusXp}`, goalMet: true } })
  return [
    { type: 'mission', budget: plan.budget, bonusXp: plan.bonusXp },
    { type: 'xp', amount: plan.bonusXp, reason: 'mission' },
  ]
}

export async function missionHistory(days: string[]): Promise<Map<string, { budget: number; completed: boolean }>> {
  if (days.length === 0) return new Map()
  const rows = await userScope((db, userId) =>
    db
      .select()
      .from(dailyMissions)
      .where(and(eq(dailyMissions.userId, userId), inArray(dailyMissions.day, days))),
  )
  return new Map(rows.map((r) => [r.day, { budget: r.budgetMinutes, completed: r.completedAt !== null }]))
}

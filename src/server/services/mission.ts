import 'server-only'
import { and, eq, gte, inArray, isNull, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { attempts, chapterProgress, dailyActivity, dailyMissions, lessonProgress, mistakes, reelState, sessions, srsCards, taskState } from '@/db/schema'
import { lookup } from '@/course'
import { EXAM_ICON, TEST_ICON } from '@/content/icons'
import type { Chapter } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { dayKey, dayStartMs } from '@/progress/day'
import { missionRatio, planMission, stepProgress, type MissionActivity, type MissionPlan, type StepProgress } from '@/progress/mission'
import type { Effect } from '@/progress/types'
import { chapterHref } from '@/ui/routes'
import { BUCKS, buckRef } from '@/game'
import { userScope } from '../auth'
import { awardBucks, grantXp } from '../game/ledger'
import { readSettings } from '../settings'
import { activeCourse, exerciseIds } from '../courses/enrollment'
import { coursePathView, cursorHref } from '../courses/path'
import { chapterProgressMap, nextChapterFor } from './library'

// Where the learner is in the active course: the next node of the course path (lesson, topic test or section exam).
export interface MissionCursor {
  href: string | null
  // icon ref (src/content/icons.ts)
  icon: string | null
  title: string | null
  topicTitle: string | null
  // the next topic's chapter (for the «read» step)
  chapterId: string | null
  remaining: number
  total: number
  course: { id: string; title: string; icon: string | null } | null
}

export interface MissionView {
  cursor: MissionCursor
  plan: MissionPlan
  progress: StepProgress[]
  ratio: number
  complete: boolean
  completedAt: number | null
  hrefs: Record<string, string>
}

// The chapter to read next: the current topic of the active course while it isn't studied yet, else the guide the
// learner is reading.
async function cursorChapter(snapshot: ContentSnapshot, cursor: MissionCursor): Promise<Chapter | null> {
  const progress = await chapterProgressMap()
  const chapter = cursor.chapterId ? snapshot.chapters.get(cursor.chapterId) : undefined
  if (chapter && progress.get(chapter.id)?.status !== 'studied') return chapter
  return currentNextChapter(snapshot)
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

async function buildPlan(db: Conn, userId: string, snapshot: ContentSnapshot, cursor: MissionCursor, scope: ReadonlySet<string> | null, budget: number, reels: number, now: number): Promise<MissionPlan> {
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
    cursorChapter(snapshot, cursor),
  ])
  const srs = new Map(srsRows.map((r) => [r.id, r.due]))
  const solved = new Set(solvedRows.map((r) => r.id))
  let due = 0
  let fresh = 0
  let quizzes = 0
  const tasks = { easy: 0, medium: 0, hard: 0 }
  // Pools come from the active course; without one, from all content.
  for (const unit of snapshot.units.values()) {
    if (scope && !scope.has(unit.id)) continue
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
    mistakes: openRows.filter((r) => snapshot.units.has(r.id) && (!scope || scope.has(r.id))).length,
    quizzes,
    tasks,
    reels,
    lessons: cursor.remaining,
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
async function ensurePlan(db: Conn, userId: string, snapshot: ContentSnapshot, cursor: MissionCursor, scope: ReadonlySet<string> | null, reels: number, now: number) {
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
  const plan = await buildPlan(db, userId, snapshot, cursor, scope, dailyMinutes, reels, now)
  const values = { userId, day, budgetMinutes: dailyMinutes, plan, progress: {}, completedAt: null, createdAt: now }
  await db
    .insert(dailyMissions)
    .values(values)
    .onConflictDoUpdate({ target: [dailyMissions.userId, dailyMissions.day], set: { budgetMinutes: dailyMinutes, plan, createdAt: now } })
  return values
}

function hrefsFor(snapshot: ContentSnapshot, plan: MissionPlan, cursor: MissionCursor): Record<string, string> {
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
        out[step.id] = cursor.href ?? '/path'
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

const EMPTY_CURSOR: MissionCursor = { href: null, icon: null, title: null, topicTitle: null, chapterId: null, remaining: 0, total: 0, course: null }

// The mission's lesson cursor = the next node of the active course path.
export async function missionCursor(snapshot: ContentSnapshot): Promise<{ cursor: MissionCursor; scope: ReadonlySet<string> | null }> {
  const active = await activeCourse()
  if (!active) return { cursor: EMPTY_CURSOR, scope: null }
  const { view } = await coursePathView(active)
  const { bundle } = active
  const course = { id: bundle.course.id, title: bundle.course.title, icon: bundle.course.icon }
  const base = { ...EMPTY_CURSOR, remaining: view.lessonsLeft, total: view.lessonsTotal, course }
  const at = view.current
  if (!at) return { cursor: base, scope: exerciseIds(bundle) }
  const topic = at.topicId ? lookup(bundle).topics.get(at.topicId) : undefined
  const section = lookup(bundle).sections.get(at.sectionId)
  const chapter = topic ? snapshot.chapters.get(topic.chapterId) : undefined
  const href = cursorHref(at, { bundle, theoryHref: new Map(chapter ? [[chapter.id, chapterHref(snapshot, chapter)]] : []) })
  const title = at.type === 'lesson' ? at.lesson?.title ?? null : at.type === 'test' ? 'Тест теми' : `Екзамен: ${section?.title ?? ''}`
  const icon = at.type === 'lesson' ? at.lesson?.icon ?? null : at.type === 'test' ? TEST_ICON : EXAM_ICON
  return { cursor: { ...base, href, title, icon, topicTitle: topic?.title ?? section?.title ?? null, chapterId: topic?.chapterId ?? null }, scope: exerciseIds(bundle) }
}

export async function getMission(snapshot: ContentSnapshot, reels: number, now = Date.now()): Promise<MissionView> {
  const { cursor, scope } = await missionCursor(snapshot)
  return userScope(async (db, userId) => {
    const row = await ensurePlan(db, userId, snapshot, cursor, scope, reels, now)
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
  const xp = await grantXp(conn, userId, { amount: plan.bonusXp, reason: 'mission', refId: day, now })
  await conn
    .insert(dailyActivity)
    .values({ userId, day, xp, goalMet: true })
    .onConflictDoUpdate({ target: [dailyActivity.userId, dailyActivity.day], set: { xp: sql`${dailyActivity.xp} + ${xp}`, goalMet: true } })
  const bucks = await awardBucks(conn, userId, { amount: BUCKS.mission, reason: 'mission', refId: buckRef.mission(day), now })
  const effects: Effect[] = [{ type: 'mission', budget: plan.budget, bonusXp: xp }]
  if (xp > 0) effects.push({ type: 'xp', amount: xp, reason: 'mission' })
  if (bucks > 0) effects.push({ type: 'bucks', amount: bucks, reason: 'mission' })
  return effects
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

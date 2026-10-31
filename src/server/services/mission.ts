import 'server-only'
import { and, eq, inArray, isNull, sql } from 'drizzle-orm'
import type { Conn } from '@/db/client'
import { attempts, chapterProgress, dailyActivity, dailyMissions, lessonProgress, mistakes, reelState, sessions, srsCards, taskState } from '@/db/schema'
import { lookup, type CoursePathView } from '@/course'
import { EXAM_ICON, TEST_ICON } from '@/content/icons'
import type { Chapter } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { dayKey, dayStartMs } from '@/progress/day'
import { missionRatio, planMission, stepProgress, type MissionActivity, type MissionPlan, type StepProgress } from '@/progress/mission'
import type { Effect } from '@/progress/types'
import { chapterHref } from '@/ui/routes'
import { BUCKS, buckRef } from '@/game'
import { userScope } from '../auth'
import { read, readOne, type Read } from '../db/batch'
import { awardBucks, grantXp } from '../game/ledger'
import { readSettings } from '../settings'
import { activeCourse, exerciseIds, type ActiveCourse } from '../courses/enrollment'
import { courseProgressIn, coursePathView, cursorHref, pathViewFrom } from '../courses/path'
import { pathSkills } from '../courses/skills'
import { chapterProgressIn, nextChapterFor, type ProgressRow } from './library'

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
function cursorChapter(snapshot: ContentSnapshot, cursor: MissionCursor, progress: ReadonlyMap<string, ProgressRow>): Chapter | null {
  const chapter = cursor.chapterId ? snapshot.chapters.get(cursor.chapterId) : undefined
  if (chapter && progress.get(chapter.id)?.status !== 'studied') return chapter
  return currentNextChapter(snapshot, progress)
}

// The guide the learner is currently in: the last opened one, else the deep JavaScript guide, else the first.
function currentNextChapter(snapshot: ContentSnapshot, progress: ReadonlyMap<string, ProgressRow>): Chapter | null {
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
  const [srsRows, openRows, solvedRows, progress] = await Promise.all([
    db.select({ id: srsCards.unitId, due: srsCards.due }).from(srsCards).where(eq(srsCards.userId, userId)),
    db
      .select({ id: mistakes.unitId })
      .from(mistakes)
      .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
    db
      .select({ id: taskState.unitId })
      .from(taskState)
      .where(and(eq(taskState.userId, userId), eq(taskState.status, 'solved'))),
    chapterProgressIn(db, userId),
  ])
  const next = cursorChapter(snapshot, cursor, progress)
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
    } else if (unit.kind === 'quiz') {
      if (unit.mode !== 'speak') quizzes++
    }
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
  return activityFrom(await readOne(conn, activityRead(conn, userId, now)), plan)
}

interface ActivityRow {
  cards: number
  quizzes: number
  solved: number
  ms: number
  mistakes: number
  timeMs: number
  reels: number
  // chapters studied today (the plan's «read» step checks its own)
  studied: string[]
  lessons: number
}

// Today's activity behind the mission steps, in one statement and independent of the plan (so it can be read before
// the plan is known, alongside other reads).
export function activityRead(conn: Conn, userId: string, now: number): Read<ActivityRow> {
  const day = dayKey(now)
  const start = dayStartMs(now)
  return read(
    conn
      .select({
        cards: sql<number>`(select count(*) from ${attempts} a where a.user_id = ${userId} and a.day = ${day} and a.kind = 'flashcard')`,
        quizzes: sql<number>`(select count(*) from ${attempts} a where a.user_id = ${userId} and a.day = ${day} and a.kind = 'quiz')`,
        solved: sql<number>`(select count(*) from ${attempts} a where a.user_id = ${userId} and a.day = ${day} and a.kind = 'task' and a.outcome = 'solved')`,
        ms: sql<number>`(select coalesce(sum(a.duration_ms), 0) from ${attempts} a where a.user_id = ${userId} and a.day = ${day})`,
        mistakes: sql<number>`(select count(*) from ${attempts} a join ${sessions} s on s.id = a.session_id and s.user_id = a.user_id where a.user_id = ${userId} and a.day = ${day} and s.mode = 'mistakes')`,
        timeMs: sql<number>`(select coalesce(max(d.time_ms), 0) from ${dailyActivity} d where d.user_id = ${userId} and d.day = ${day})`,
        reels: sql<number>`(select count(*) from ${reelState} r where r.user_id = ${userId} and r.last_seen_at >= ${start})`,
        studied: sql<string[] | null>`(select array_agg(c.chapter_id) from ${chapterProgress} c where c.user_id = ${userId} and c.studied_at >= ${start})`,
        lessons: sql<number>`(select count(*) from ${lessonProgress} l where l.user_id = ${userId} and l.last_completed_at >= ${start})`,
      })
      .from(sql`(select 1) as one`),
    (rows) => {
      const r = rows[0]
      const num = (v: unknown) => Number(v ?? 0)
      return { cards: num(r?.cards), quizzes: num(r?.quizzes), solved: num(r?.solved), ms: num(r?.ms), mistakes: num(r?.mistakes), timeMs: num(r?.timeMs), reels: num(r?.reels), studied: r?.studied ?? [], lessons: num(r?.lessons) }
    },
  )
}

export function activityFrom(row: ActivityRow, plan: MissionPlan): MissionActivity {
  const readChapter = plan.steps.find((s) => s.kind === 'read')?.chapterId
  // dailyActivity.timeMs = reading time + answering time; subtract answering to get reading.
  const readingMs = Math.max(0, row.timeMs - row.ms)
  return {
    cards: row.cards,
    quizzes: row.quizzes,
    tasksSolved: row.solved,
    mistakes: row.mistakes,
    readingMinutes: readingMs / 60_000,
    chapterStudied: readChapter ? row.studied.includes(readChapter) : false,
    lessons: row.lessons,
    reels: row.reels,
  }
}

// Today's plan is created once and kept stable, unless the budget changed before any progress was made.
async function ensurePlan(db: Conn, userId: string, snapshot: ContentSnapshot, cursor: MissionCursor, scope: ReadonlySet<string> | null, reels: number, now: number, dailyMinutes: number, row: MissionRow | null) {
  const day = dayKey(now)
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
  return cursorFrom(snapshot, active, (await coursePathView(active)).view)
}

// missionCursor inside the caller's transaction (the course progress read alongside its other reads).
export async function missionCursorIn(db: Conn, userId: string, snapshot: ContentSnapshot, active: ActiveCourse | null): Promise<{ cursor: MissionCursor; scope: ReadonlySet<string> | null }> {
  if (!active) return { cursor: EMPTY_CURSOR, scope: null }
  const [progress, skills] = await Promise.all([courseProgressIn(db, userId, active.bundle), pathSkills(active)])
  return cursorFrom(snapshot, active, pathViewFrom(active, progress, skills))
}

function cursorFrom(snapshot: ContentSnapshot, active: ActiveCourse, view: CoursePathView): { cursor: MissionCursor; scope: ReadonlySet<string> | null } {
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
  const [active, { dailyMinutes }] = await Promise.all([activeCourse(), readSettings()])
  return userScope((db, userId) => getMissionIn(db, userId, snapshot, reels, active, dailyMinutes, now), { tx: true })
}

// Today's mission inside the caller's transaction: cursor + today's row in one round trip, the plan (built once a
// day), then the activity counts.
export async function getMissionIn(db: Conn, userId: string, snapshot: ContentSnapshot, reels: number, active: ActiveCourse | null, dailyMinutes: number, now: number): Promise<MissionView> {
  const [{ cursor, scope }, today] = await Promise.all([missionCursorIn(db, userId, snapshot, active), todayMission(db, userId, now)])
  const row = await ensurePlan(db, userId, snapshot, cursor, scope, reels, now, dailyMinutes, today)
  const plan = row.plan as MissionPlan
  const progress = stepProgress(plan, await activity(db, userId, plan, now))
  const ratio = missionRatio(progress)
  return { cursor, plan, progress, ratio, complete: progress.every((p) => p.complete), completedAt: row.completedAt ?? null, hrefs: hrefsFor(snapshot, plan, cursor) }
}

export type MissionRow = typeof dailyMissions.$inferSelect

export async function todayMission(conn: Conn, userId: string, now: number): Promise<MissionRow | null> {
  return readOne(conn, missionRead(conn, userId, now))
}

export function missionRead(conn: Conn, userId: string, now: number): Read<MissionRow | null> {
  return read(
    conn
      .select()
      .from(dailyMissions)
      .where(and(eq(dailyMissions.userId, userId), eq(dailyMissions.day, dayKey(now)))),
    (rows) => rows[0] ?? null,
  )
}

export interface MissionProgress {
  plan: MissionPlan
  complete: boolean
}

// Today's open mission and whether every step is done now (null: no mission today, or already completed).
// `today`: the activity already read in this transaction.
export async function missionProgress(conn: Conn, userId: string, row: MissionRow | null, now: number, today?: ActivityRow): Promise<MissionProgress | null> {
  if (!row || row.completedAt) return null
  const plan = row.plan as MissionPlan
  const progress = stepProgress(plan, today ? activityFrom(today, plan) : await activity(conn, userId, plan, now))
  return { plan, complete: progress.every((p) => p.complete) }
}

// Awards the mission bonus once, when the last step is done.
export async function completeMission(conn: Conn, userId: string, mission: MissionProgress, now: number): Promise<Effect[]> {
  if (!mission.complete) return []
  const day = dayKey(now)
  const plan = mission.plan
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

// Called after every learning action: awards the mission bonus once, when the last step is done.
export async function settleMission(conn: Conn, userId: string, now = Date.now()): Promise<Effect[]> {
  const mission = await missionProgress(conn, userId, await todayMission(conn, userId, now), now)
  return mission ? completeMission(conn, userId, mission, now) : []
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

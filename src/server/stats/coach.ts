import 'server-only'
import { and, eq, gt, gte, lt, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { attempts, dailyActivity, lessonProgress, mistakes, units, userSettings } from '@/db/schema'
import type { ContentSnapshot } from '@/content/store'
import { DAY, dayKey, dayStartMs, shiftDay } from '@/progress/day'
import {
  coachProgress,
  compound,
  onePercentStreak,
  planCoachGoal,
  type CoachDay,
  type CoachGoal,
  type CoachMeasure,
  type CoachProgress,
  type StatsAggregates,
} from '@/progress/stats'
import { userScope } from '../auth'
import { readSettings } from '../settings'
import { activeCourse } from '../courses/enrollment'
import { statsAggregates } from './aggregates'
import { topicTitles } from './topics'

// The day's «+1%» goal is frozen when first shown (the baseline must not drift while the learner works on it) and kept
// with its outcome in user_settings under COACH_KEY — a bounded log, no schema change. Progress is always measured
// from the day's own activity, so a goal finished without opening Home again still counts the next day.
const COACH_KEY = 'coach'
const KEEP_DAYS = 120

interface CoachEntry {
  goal: CoachGoal
  done: boolean
  // the day is over and `done` is settled
  final: boolean
}

interface CoachLog {
  v: 1
  entries: CoachEntry[]
}

export interface CoachView {
  goal: CoachGoal
  progress: CoachProgress
  // 1% streak: consecutive days with the goal done
  streak: number
  daysDone: number
  // 1.01^streak
  multiplier: number
  week: CoachDay[]
  href: string
}

function isGoal(v: unknown): v is CoachGoal {
  if (!v || typeof v !== 'object') return false
  const g = v as Partial<CoachGoal>
  return g.v === 1 && typeof g.day === 'string' && typeof g.dimension === 'string' && typeof g.target === 'number' && typeof g.metric === 'object' && g.metric !== null
}

function parseLog(value: unknown): CoachLog {
  const raw = value && typeof value === 'object' ? (value as { entries?: unknown }).entries : undefined
  const entries = Array.isArray(raw) ? raw.filter((e): e is CoachEntry => Boolean(e) && isGoal((e as CoachEntry).goal) && typeof (e as CoachEntry).done === 'boolean') : []
  return { v: 1, entries }
}

function dayBounds(day: string): [number, number] {
  const [y, m, d] = day.split('-').map(Number) as [number, number, number]
  const start = dayStartMs(new Date(y, m - 1, d, 12).getTime())
  return [start, start + DAY]
}

// What the goal's metric reads for its day — one small aggregate query.
export async function measureGoal(db: Conn, userId: string, goal: CoachGoal): Promise<CoachMeasure> {
  const m = goal.metric
  switch (m.type) {
    case 'answers':
    case 'cards': {
      const row = await first(
        db
          .select({ total: dailyActivity.total, cards: dailyActivity.cards })
          .from(dailyActivity)
          .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.day, goal.day))),
      )
      return { value: m.type === 'answers' ? (row?.total ?? 0) : (row?.cards ?? 0) }
    }
    case 'newLessons': {
      const [from, to] = dayBounds(goal.day)
      const row = await first(
        db
          .select({ n: sql<number>`count(*)` })
          .from(lessonProgress)
          .where(and(eq(lessonProgress.userId, userId), gte(lessonProgress.firstCompletedAt, from), lt(lessonProgress.firstCompletedAt, to))),
      )
      return { value: Number(row?.n ?? 0) }
    }
    case 'topicCorrect': {
      const row = await first(
        db
          .select({ n: sql<number>`count(*)` })
          .from(attempts)
          .where(and(eq(attempts.userId, userId), eq(attempts.day, goal.day), eq(attempts.chapterId, m.chapterId), eq(attempts.correct, true))),
      )
      return { value: Number(row?.n ?? 0) }
    }
    case 'mistakeFixes': {
      // distinct former mistakes of the topic answered correctly that day (a step towards resolving them)
      const row = await first(
        db
          .select({ n: sql<number>`count(distinct ${attempts.unitId})` })
          .from(attempts)
          .innerJoin(mistakes, and(eq(mistakes.userId, attempts.userId), eq(mistakes.unitId, attempts.unitId)))
          .where(and(eq(attempts.userId, userId), eq(attempts.day, goal.day), eq(attempts.chapterId, m.chapterId), eq(attempts.correct, true), gt(attempts.answeredAt, mistakes.firstWrongAt))),
      )
      return { value: Number(row?.n ?? 0) }
    }
    case 'speed': {
      const [kind, mode] = m.group.split(':') as ['flashcard' | 'quiz' | 'task', string | undefined]
      const row = await first(
        db
          .select({ medianMs: sql<number | null>`percentile_cont(0.5) within group (order by ${attempts.durationMs})`, n: sql<number>`count(*)` })
          .from(attempts)
          .leftJoin(units, eq(units.id, attempts.unitId))
          .where(and(eq(attempts.userId, userId), eq(attempts.day, goal.day), eq(attempts.kind, kind), mode ? eq(units.qtype, mode) : undefined, sql`${attempts.durationMs} >= 500`)),
      )
      const n = Number(row?.n ?? 0)
      return { value: n > 0 && row?.medianMs !== null && row?.medianMs !== undefined ? Math.round(Number(row.medianMs)) : null, n }
    }
  }
}

function ctaHref(goal: CoachGoal, nextHref: string | null): string {
  const m = goal.metric
  switch (m.type) {
    case 'cards':
      return '/review?start=1'
    case 'mistakeFixes':
      return '/mistakes?start=1'
    case 'topicCorrect':
      return `/quiz?chapter=${encodeURIComponent(m.chapterId)}&start=1`
    case 'speed': {
      if (m.group === 'flashcard') return '/review?start=1'
      if (m.group === 'task') return '/tasks'
      const mode = m.group.split(':')[1]
      return mode ? `/quiz?type=${mode}&start=1` : '/quiz?start=1'
    }
    default:
      return nextHref ?? '/path'
  }
}

function daysSince(at: number | null, now: number): number | null {
  if (at === null) return null
  return Math.max(0, Math.round((dayStartMs(now) - dayStartMs(at)) / DAY))
}

async function planFor(snapshot: ContentSnapshot, agg: StatsAggregates, hasNextLesson: boolean, now: number): Promise<CoachGoal> {
  const [settings, active] = await Promise.all([readSettings(), activeCourse()])
  const titles = topicTitles(snapshot, active?.bundle ?? null)
  const topics = agg.topics.flatMap((t) => {
    const title = titles.get(t.chapterId)?.title
    return title ? [{ ...t, title }] : []
  })
  return planCoachGoal({
    today: agg.today,
    days: agg.days,
    speed: agg.speed,
    topics,
    dueToday: agg.memory.dueToday,
    lifetimeAnswers: agg.kinds.reduce((s, k) => s + k.total, 0),
    hasNextLesson,
    daysSinceNewLesson: daysSince(agg.results.lastNewLessonAt, now),
    dailyGoal: settings.dailyGoal,
  })
}

// Today's «+1%» goal with its live progress and the 1% streak. `nextHref` is where «go» leads for path-type goals.
export async function getCoach(snapshot: ContentSnapshot, next: { href: string | null }, now = Date.now()): Promise<CoachView> {
  const today = dayKey(now)
  const agg = await statsAggregates()
  const stored = await userScope(async (db, userId) => parseLog((await first(db.select({ value: userSettings.value }).from(userSettings).where(and(eq(userSettings.userId, userId), eq(userSettings.key, COACH_KEY)))))?.value))
  let changed = false
  let todayEntry = stored.entries.find((e) => e.goal.day === today)
  if (!todayEntry) {
    todayEntry = { goal: await planFor(snapshot, agg, next.href !== null, now), done: false, final: false }
    stored.entries.push(todayEntry)
    changed = true
  }
  const entry = todayEntry
  const result = await userScope(async (db, userId) => {
    // settle past days that ended before their outcome was recorded
    for (const e of stored.entries) {
      if (e.final || e.goal.day >= today) continue
      if (!e.done) e.done = coachProgress(e.goal, await measureGoal(db, userId, e.goal)).done
      e.final = true
      changed = true
    }
    const progress = coachProgress(entry.goal, await measureGoal(db, userId, entry.goal))
    if (progress.done && !entry.done) {
      entry.done = true
      changed = true
    }
    if (changed) {
      const keepFrom = shiftDay(today, -KEEP_DAYS)
      const value: CoachLog = { v: 1, entries: stored.entries.filter((e) => e.goal.day >= keepFrom).sort((a, b) => a.goal.day.localeCompare(b.goal.day)) }
      await db
        .insert(userSettings)
        .values({ userId, key: COACH_KEY, value })
        .onConflictDoUpdate({ target: [userSettings.userId, userSettings.key], set: { value } })
    }
    return progress
  })
  const history: CoachDay[] = stored.entries.map((e) => ({ day: e.goal.day, done: e.done }))
  const streak = onePercentStreak(history, today)
  const doneDays = new Set(history.filter((h) => h.done).map((h) => h.day))
  const week: CoachDay[] = []
  for (let i = 6; i >= 0; i--) {
    const day = shiftDay(today, -i)
    week.push({ day, done: doneDays.has(day) })
  }
  return { goal: entry.goal, progress: result, streak, daysDone: doneDays.size, multiplier: compound(streak), week, href: ctaHref(entry.goal, next.href) }
}

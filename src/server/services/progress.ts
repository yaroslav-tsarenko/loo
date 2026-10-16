import 'server-only'
import { and, desc, eq, isNotNull, isNull, lte, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { achievements, attempts, chapterProgress, dailyActivity, examResults, mistakes, sessions, srsCards, topicResults, units, xpLedger } from '@/db/schema'
import type { LearningUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { ACHIEVEMENTS } from '@/progress/achievements/catalog'
import { emptyStats, type StatsSnapshot } from '@/progress/achievements/dsl'
import { newlyUnlocked } from '@/progress/achievements/evaluate'
import { dayKey } from '@/progress/day'
import { applyAttempt } from '@/progress/engine'
import { levelInfo } from '@/progress/levels'
import type { SrsCard } from '@/progress/srs'
import { computeStreak } from '@/progress/streak'
import type { Effect, MistakeState, Outcome } from '@/progress/types'
import { ACHIEVEMENT_XP } from '@/progress/xp'
import { userScope } from '../auth'
import { readSettings } from '../settings'
import { settleMission } from './mission'

export interface AttemptRequest {
  unitId: string
  outcome: Outcome
  hintsUsed?: number
  durationMs?: number
  sessionId?: string | null
}

export async function totalXp(conn: Conn, userId: string): Promise<number> {
  const row = await first(conn.select({ total: sql<number>`coalesce(sum(${xpLedger.amount}), 0)` }).from(xpLedger).where(eq(xpLedger.userId, userId)))
  return Number(row?.total ?? 0)
}

// The signed-in user's XP (pages, layout, /api/counts).
export async function userXp(): Promise<number> {
  return userScope((db, userId) => totalXp(db, userId))
}

async function goalDays(conn: Conn, userId: string): Promise<string[]> {
  return (await conn.select({ day: dailyActivity.day }).from(dailyActivity).where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.goalMet, true)))).map((r) => r.day)
}

async function leadingCorrect(conn: Conn, userId: string, level: string | null): Promise<number> {
  const rows = await conn
    .select({ correct: attempts.correct })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), level ? eq(attempts.level, level) : undefined))
    .orderBy(desc(attempts.id))
    .limit(200)
  let n = 0
  for (const r of rows) {
    if (!r.correct) break
    n++
  }
  return n
}

async function countWhere(conn: Conn, userId: string, kind: 'flashcard' | 'quiz' | 'task', outcome?: string): Promise<number> {
  const row = await first(
    conn
      .select({ n: sql<number>`count(*)` })
      .from(attempts)
      .where(and(eq(attempts.userId, userId), eq(attempts.kind, kind), outcome ? sql`${attempts.outcome} = ${outcome}` : undefined)),
  )
  return Number(row?.n ?? 0)
}

export function guidesCompleted(snapshot: ContentSnapshot, studied: ReadonlySet<string>): number {
  let n = 0
  for (const guide of snapshot.guides) {
    const ids = guide.chapterIds.filter((id) => snapshot.chapters.get(id)?.kind !== 'index')
    if (ids.length > 0 && ids.every((id) => studied.has(id))) n++
  }
  return n
}

export async function computeStats(conn: Conn, userId: string, snapshot: ContentSnapshot, now: number): Promise<StatsSnapshot> {
  const stats = emptyStats()
  const xp = await totalXp(conn, userId)
  stats['xp.total'] = xp
  stats.level = levelInfo(xp).level
  const days = await goalDays(conn, userId)
  const streak = computeStreak(days, dayKey(now))
  stats['streak.current'] = streak.current
  stats['streak.best'] = streak.best
  stats['goals.met'] = days.length
  stats['cards.reviewed'] = await countWhere(conn, userId, 'flashcard')
  stats['cards.known'] = await countWhere(conn, userId, 'flashcard', 'good')
  stats['quiz.answered'] = await countWhere(conn, userId, 'quiz')
  stats['quiz.correct'] = await countWhere(conn, userId, 'quiz', 'correct')
  const solved = await first(
    conn
      .select({ n: sql<number>`count(distinct ${attempts.unitId})`, clean: sql<number>`count(distinct case when ${attempts.hintsUsed} = 0 then ${attempts.unitId} end)` })
      .from(attempts)
      .where(and(eq(attempts.userId, userId), eq(attempts.kind, 'task'), sql`${attempts.outcome} = 'solved'`)),
  )
  stats['tasks.solved'] = Number(solved?.n ?? 0)
  stats['tasks.solvedNoHints'] = Number(solved?.clean ?? 0)
  const studiedRows = await conn
    .select({ id: chapterProgress.chapterId })
    .from(chapterProgress)
    .where(and(eq(chapterProgress.userId, userId), eq(chapterProgress.status, 'studied')))
  const studied = new Set(studiedRows.map((r) => r.id))
  stats['chapters.studied'] = studied.size
  stats['guides.completed'] = guidesCompleted(snapshot, studied)
  stats['run.all'] = await leadingCorrect(conn, userId, null)
  stats['run.senior'] = await leadingCorrect(conn, userId, 'senior')
  stats['run.techlead'] = await leadingCorrect(conn, userId, 'techlead')
  const resolved = await first(conn.select({ n: sql<number>`count(*)` }).from(mistakes).where(and(eq(mistakes.userId, userId), isNotNull(mistakes.resolvedAt))))
  stats['mistakes.resolved'] = Number(resolved?.n ?? 0)
  const perChapter = await conn
    .select({ chapterId: units.chapterId, open: sql<number>`sum(case when ${mistakes.resolvedAt} is null then 1 else 0 end)` })
    .from(mistakes)
    .innerJoin(units, eq(units.id, mistakes.unitId))
    .where(eq(mistakes.userId, userId))
    .groupBy(units.chapterId)
  stats['chapters.mistakesCleared'] = perChapter.filter((r) => Number(r.open) === 0).length
  const perfect = await first(
    conn
      .select({ n: sql<number>`count(*)` })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), isNotNull(sessions.endedAt), sql`${sessions.total} >= 10`, sql`${sessions.correct} = ${sessions.total}`)),
  )
  stats['sessions.perfect'] = Number(perfect?.n ?? 0)
  const tests = await first(
    conn
      .select({ passed: sql<number>`count(*) filter (where ${topicResults.passedAt} is not null)`, perfect: sql<number>`count(*) filter (where ${topicResults.bestScore} >= 1)` })
      .from(topicResults)
      .where(eq(topicResults.userId, userId)),
  )
  stats['tests.passed'] = Number(tests?.passed ?? 0)
  stats['tests.perfect'] = Number(tests?.perfect ?? 0)
  const exams = await first(
    conn
      .select({ passed: sql<number>`count(*) filter (where ${examResults.passedAt} is not null)`, out: sql<number>`count(*) filter (where ${examResults.testOut})` })
      .from(examResults)
      .where(eq(examResults.userId, userId)),
  )
  stats['exams.passed'] = Number(exams?.passed ?? 0)
  stats['sections.testedOut'] = Number(exams?.out ?? 0)
  return stats
}

export async function evaluateAchievements(conn: Conn, userId: string, snapshot: ContentSnapshot, now: number): Promise<Effect[]> {
  const unlocked = new Set((await conn.select({ id: achievements.id }).from(achievements).where(eq(achievements.userId, userId))).map((r) => r.id))
  const stats = await computeStats(conn, userId, snapshot, now)
  const fresh = newlyUnlocked(stats, unlocked, ACHIEVEMENTS)
  const effects: Effect[] = []
  const day = dayKey(now)
  for (const a of fresh) {
    await conn.insert(achievements).values({ userId, id: a.id, unlockedAt: now, context: null }).onConflictDoNothing()
    await conn.insert(xpLedger).values({ userId, amount: ACHIEVEMENT_XP, reason: 'achievement', refId: a.id, createdAt: now, day })
    effects.push({ type: 'achievement', id: a.id, title: a.title, description: a.description })
    effects.push({ type: 'xp', amount: ACHIEVEMENT_XP, reason: 'achievement' })
  }
  if (fresh.length > 0) {
    await conn
      .insert(dailyActivity)
      .values({ userId, day, xp: ACHIEVEMENT_XP * fresh.length })
      .onConflictDoUpdate({ target: [dailyActivity.userId, dailyActivity.day], set: { xp: sql`${dailyActivity.xp} + ${ACHIEVEMENT_XP * fresh.length}` } })
  }
  return effects
}

function levelEffects(before: number, after: number): Effect[] {
  const a = levelInfo(before)
  const b = levelInfo(after)
  const out: Effect[] = []
  if (b.level > a.level) out.push({ type: 'level-up', level: b.level, rank: b.rank.title })
  if (b.rank.id !== a.rank.id) out.push({ type: 'rank-up', rank: b.rank.title })
  return out
}

function toSrs(row: typeof srsCards.$inferSelect | undefined): SrsCard | null {
  if (!row) return null
  return {
    due: row.due,
    stability: row.stability,
    difficulty: row.difficulty,
    elapsedDays: row.elapsedDays,
    scheduledDays: row.scheduledDays,
    learningSteps: row.learningSteps,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state,
    lastReview: row.lastReview,
  }
}

function toMistake(row: typeof mistakes.$inferSelect | undefined): MistakeState | null {
  return row ? { ...row } : null
}

export async function recordAttempt(snapshot: ContentSnapshot, unit: LearningUnit, request: AttemptRequest, now = Date.now()): Promise<Effect[]> {
  const settingsNow = await readSettings()
  return userScope(async (tx, userId) => {
    const lastCorrect = await first(
      tx
        .select({ day: sql<string | null>`max(${attempts.day})` })
        .from(attempts)
        .where(and(eq(attempts.userId, userId), eq(attempts.unitId, unit.id), eq(attempts.correct, true))),
    )
    const history = { everCorrect: Boolean(lastCorrect?.day), lastCorrectDay: lastCorrect?.day ?? null }
    const srsRow = await first(tx.select().from(srsCards).where(and(eq(srsCards.userId, userId), eq(srsCards.unitId, unit.id))))
    const mistakeRow = await first(tx.select().from(mistakes).where(and(eq(mistakes.userId, userId), eq(mistakes.unitId, unit.id))))
    const xpBefore = await totalXp(tx, userId)
    const hintsUsed = request.hintsUsed ?? 0
    const result = applyAttempt(
      {
        unitId: unit.id,
        kind: unit.kind,
        outcome: request.outcome,
        level: unit.level,
        ...(unit.kind === 'quiz' ? { quizMode: unit.mode } : {}),
        ...(unit.kind === 'task' ? { difficulty: unit.difficulty } : {}),
        hintsUsed,
        at: now,
      },
      { history, srs: toSrs(srsRow), mistake: toMistake(mistakeRow), totalXp: xpBefore },
    )
    const effects: Effect[] = result.effects.filter((e) => e.type !== 'level-up' && e.type !== 'rank-up')
    const durationMs = Math.max(0, Math.min(request.durationMs ?? 0, 10 * 60_000))
    await tx.insert(attempts).values({
      userId,
      unitId: unit.id,
      sessionId: request.sessionId ?? null,
      kind: unit.kind,
      outcome: request.outcome,
      correct: result.correct,
      level: unit.level,
      guideId: unit.guideId,
      chapterId: unit.chapterId,
      hintsUsed,
      durationMs,
      xp: result.xp,
      answeredAt: now,
      day: result.day,
    })
    if (result.srs && unit.kind === 'flashcard') {
      const values = { ...result.srs }
      await tx
        .insert(srsCards)
        .values({ userId, unitId: unit.id, ...values })
        .onConflictDoUpdate({ target: [srsCards.userId, srsCards.unitId], set: values })
    }
    if (result.mistakeChanged && result.mistake) {
      const { unitId: _ignored, ...rest } = result.mistake
      await tx
        .insert(mistakes)
        .values({ ...result.mistake, userId })
        .onConflictDoUpdate({ target: [mistakes.userId, mistakes.unitId], set: rest })
    }
    if (result.xp > 0) await tx.insert(xpLedger).values({ userId, amount: result.xp, reason: unit.kind, refId: unit.id, createdAt: now, day: result.day })
    const counters = {
      cards: unit.kind === 'flashcard' ? 1 : 0,
      quizzes: unit.kind === 'quiz' ? 1 : 0,
      tasks: unit.kind === 'task' ? 1 : 0,
      correct: result.correct ? 1 : 0,
    }
    await tx
      .insert(dailyActivity)
      .values({ userId, day: result.day, ...counters, total: 1, xp: result.xp, timeMs: durationMs })
      .onConflictDoUpdate({
        target: [dailyActivity.userId, dailyActivity.day],
        set: {
          cards: sql`${dailyActivity.cards} + ${counters.cards}`,
          quizzes: sql`${dailyActivity.quizzes} + ${counters.quizzes}`,
          tasks: sql`${dailyActivity.tasks} + ${counters.tasks}`,
          correct: sql`${dailyActivity.correct} + ${counters.correct}`,
          total: sql`${dailyActivity.total} + 1`,
          xp: sql`${dailyActivity.xp} + ${result.xp}`,
          timeMs: sql`${dailyActivity.timeMs} + ${durationMs}`,
        },
      })
    const today = await first(tx.select().from(dailyActivity).where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.day, result.day))))
    if (today && !today.goalMet && today.total >= settingsNow.dailyGoal) {
      await tx
        .update(dailyActivity)
        .set({ goalMet: true })
        .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.day, result.day)))
      const streak = computeStreak(await goalDays(tx, userId), result.day)
      effects.push({ type: 'daily-goal', goal: settingsNow.dailyGoal })
      effects.push({ type: 'streak', days: streak.current })
    }
    if (request.sessionId) {
      await tx
        .update(sessions)
        .set({ total: sql`${sessions.total} + 1`, correct: sql`${sessions.correct} + ${result.correct ? 1 : 0}`, xp: sql`${sessions.xp} + ${result.xp}` })
        .where(and(eq(sessions.userId, userId), eq(sessions.id, request.sessionId)))
    }
    effects.push(...(await settleMission(tx, userId, now)))
    effects.push(...(await evaluateAchievements(tx, userId, snapshot, now)))
    effects.push(...levelEffects(xpBefore, await totalXp(tx, userId)))
    return effects
  }, { tx: true })
}

export async function dueFlashcardIds(conn: Conn, userId: string, now: number): Promise<Set<string>> {
  return new Set((await conn.select({ id: srsCards.unitId }).from(srsCards).where(and(eq(srsCards.userId, userId), lte(srsCards.due, now)))).map((r) => r.id))
}

export async function openMistakes(conn: Conn, userId: string): Promise<(typeof mistakes.$inferSelect)[]> {
  return conn.select().from(mistakes).where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt)))
}

import 'server-only'
import { and, desc, eq, isNotNull, isNull, lte, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { achievements, attempts, buckLedger, chapterProgress, dailyActivity, examResults, frozenDays, gemLedger, inventory, leagueMembers, lessonProgress, mistakes, sessions, srsCards, topicResults, units, userState, xpLedger } from '@/db/schema'
import type { LearningUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { ACHIEVEMENT_GEMS, gemRef, isXpReason, LEAGUE_TIERS, PRACTICE_MIN_ANSWERS } from '@/game'
import { ACHIEVEMENTS } from '@/progress/achievements/catalog'
import { emptyStats, type StatsSnapshot } from '@/progress/achievements/dsl'
import { newlyUnlocked } from '@/progress/achievements/evaluate'
import { dayKey } from '@/progress/day'
import { applyAttempt } from '@/progress/engine'
import { levelInfo } from '@/progress/levels'
import type { SrsCard } from '@/progress/srs'
import type { Effect, MistakeState, Outcome } from '@/progress/types'
import { ACHIEVEMENT_XP } from '@/progress/xp'
import { userScope } from '../auth'
import { awardGems, grantXp, settleGame, settleStreak } from '../game'
import { rankInput } from '../game/ranks'
import { readSettings, type AppSettings } from '../settings'
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
  const { streak } = await settleStreak(conn, userId, now)
  stats['streak.current'] = streak.current
  stats['streak.best'] = streak.best
  const goals = await first(conn.select({ n: sql<number>`count(*)` }).from(dailyActivity).where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.goalMet, true))))
  stats['goals.met'] = Number(goals?.n ?? 0)
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
  await gameStats(conn, userId, stats)
  return stats
}

// Phase 4 metrics (lessons, rank, gems, shop, freezes, practice, leagues).
async function gameStats(conn: Conn, userId: string, stats: StatsSnapshot): Promise<void> {
  const n = (v: unknown) => Number(v ?? 0)
  const lessons = await first(
    conn
      .select({ done: sql<number>`count(*) filter (where ${lessonProgress.completions} > 0)`, perfect: sql<number>`count(*) filter (where ${lessonProgress.bestAccuracy} >= 1)` })
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId)),
  )
  stats['lessons.completed'] = n(lessons?.done)
  stats['lessons.perfect'] = n(lessons?.perfect)
  const input = await rankInput(conn, userId)
  stats['courses.completed'] = input.courses
  const state = await first(conn.select({ step: userState.evoStep }).from(userState).where(eq(userState.userId, userId)))
  stats.evolution = state?.step ?? 0
  const gems = await first(
    conn
      .select({ earned: sql<number>`coalesce(sum(${gemLedger.amount}) filter (where ${gemLedger.amount} > 0), 0)`, shop: sql<number>`count(*) filter (where ${gemLedger.reason} = 'shop')` })
      .from(gemLedger)
      .where(eq(gemLedger.userId, userId)),
  )
  const bucks = await first(
    conn
      .select({ shop: sql<number>`count(*) filter (where ${buckLedger.reason} = 'shop')` })
      .from(buckLedger)
      .where(eq(buckLedger.userId, userId)),
  )
  stats['gems.earned'] = n(gems?.earned)
  stats['shop.purchases'] = n(gems?.shop) + n(bucks?.shop)
  stats['skins.owned'] = n((await first(conn.select({ n: sql<number>`count(*)` }).from(inventory).where(eq(inventory.userId, userId))))?.n)
  stats['freezes.used'] = n((await first(conn.select({ n: sql<number>`count(*)` }).from(frozenDays).where(eq(frozenDays.userId, userId))))?.n)
  const practice = await first(
    conn
      .select({ n: sql<number>`count(*)` })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), isNotNull(sessions.endedAt), sql`${sessions.mode} in ('mistakes', 'quiz')`, sql`${sessions.total} >= ${PRACTICE_MIN_ANSWERS}`)),
  )
  stats['practice.sessions'] = n(practice?.n)
  const leagues = await conn.select({ tier: leagueMembers.tier, result: leagueMembers.result, rank: leagueMembers.finalRank }).from(leagueMembers).where(eq(leagueMembers.userId, userId))
  stats['league.joined'] = leagues.length
  stats['league.promotions'] = leagues.filter((l) => l.result === 'promoted').length
  stats['league.podium'] = leagues.filter((l) => l.rank !== null && l.rank <= 3).length
  stats['league.tier'] = leagues.reduce((max, l) => Math.max(max, (LEAGUE_TIERS as readonly string[]).indexOf(l.tier) + 1), 0)
}

export async function evaluateAchievements(conn: Conn, userId: string, snapshot: ContentSnapshot, now: number): Promise<Effect[]> {
  const unlocked = new Set((await conn.select({ id: achievements.id }).from(achievements).where(eq(achievements.userId, userId))).map((r) => r.id))
  const stats = await computeStats(conn, userId, snapshot, now)
  const fresh = newlyUnlocked(stats, unlocked, ACHIEVEMENTS)
  const effects: Effect[] = []
  const day = dayKey(now)
  let xpTotal = 0
  for (const a of fresh) {
    const inserted = await conn.insert(achievements).values({ userId, id: a.id, unlockedAt: now, context: null }).onConflictDoNothing().returning({ id: achievements.id })
    if (inserted.length === 0) continue
    const xp = await grantXp(conn, userId, { amount: ACHIEVEMENT_XP, reason: 'achievement', refId: a.id, now })
    const gems = await awardGems(conn, userId, { amount: ACHIEVEMENT_GEMS[a.tier], reason: 'achievement', refId: gemRef.achievement(a.id), now })
    xpTotal += xp
    effects.push({ type: 'achievement', id: a.id, title: a.title, description: a.description, tier: a.tier })
    if (xp > 0) effects.push({ type: 'xp', amount: xp, reason: 'achievement' })
    if (gems > 0) effects.push({ type: 'gems', amount: gems, reason: 'achievement' })
  }
  if (xpTotal > 0) await addDailyXp(conn, userId, day, xpTotal)
  return effects
}

export async function addDailyXp(conn: Conn, userId: string, day: string, xp: number): Promise<void> {
  if (xp <= 0) return
  await conn
    .insert(dailyActivity)
    .values({ userId, day, xp })
    .onConflictDoUpdate({ target: [dailyActivity.userId, dailyActivity.day], set: { xp: sql`${dailyActivity.xp} + ${xp}` } })
}

// Level-ups from XP; rank-ups come from the game rank ladder (settleGame → src/game/ranks.ts).
export function levelEffects(before: number, after: number): Effect[] {
  const a = levelInfo(before)
  const b = levelInfo(after)
  return b.level > a.level ? [{ type: 'level-up', level: b.level, rank: b.rank.title }] : []
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

// `settings`: pass them when calling from inside a transaction — readSettings() reads the global vault path through
// a separate connection, which would wait forever for the one the transaction holds (pool max 1 on Vercel / PGlite).
export async function recordAttempt(snapshot: ContentSnapshot, unit: LearningUnit, request: AttemptRequest, now = Date.now(), settings?: AppSettings): Promise<Effect[]> {
  const settingsNow = settings ?? (await readSettings())
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
    // XP is granted through the game ledger (double-XP boost, per-source daily cap); report what actually landed.
    const reason = isXpReason(unit.kind) ? unit.kind : 'quiz'
    const xp = await grantXp(tx, userId, { amount: result.xp, reason, refId: unit.id, now })
    const effects: Effect[] = result.effects.filter((e) => e.type !== 'level-up' && e.type !== 'rank-up' && e.type !== 'xp')
    if (xp > 0) effects.unshift({ type: 'xp', amount: xp, reason })
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
      xp,
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
    const counters = {
      cards: unit.kind === 'flashcard' ? 1 : 0,
      quizzes: unit.kind === 'quiz' ? 1 : 0,
      tasks: unit.kind === 'task' ? 1 : 0,
      correct: result.correct ? 1 : 0,
    }
    await tx
      .insert(dailyActivity)
      .values({ userId, day: result.day, ...counters, total: 1, xp, timeMs: durationMs })
      .onConflictDoUpdate({
        target: [dailyActivity.userId, dailyActivity.day],
        set: {
          cards: sql`${dailyActivity.cards} + ${counters.cards}`,
          quizzes: sql`${dailyActivity.quizzes} + ${counters.quizzes}`,
          tasks: sql`${dailyActivity.tasks} + ${counters.tasks}`,
          correct: sql`${dailyActivity.correct} + ${counters.correct}`,
          total: sql`${dailyActivity.total} + 1`,
          xp: sql`${dailyActivity.xp} + ${xp}`,
          timeMs: sql`${dailyActivity.timeMs} + ${durationMs}`,
        },
      })
    const today = await first(tx.select().from(dailyActivity).where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.day, result.day))))
    if (today && !today.goalMet && today.total >= settingsNow.dailyGoal) {
      await tx
        .update(dailyActivity)
        .set({ goalMet: true })
        .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.day, result.day)))
      const { streak } = await settleStreak(tx, userId, now)
      effects.push({ type: 'daily-goal', goal: settingsNow.dailyGoal })
      effects.push({ type: 'streak', days: streak.current })
    }
    if (request.sessionId) {
      await tx
        .update(sessions)
        .set({ total: sql`${sessions.total} + 1`, correct: sql`${sessions.correct} + ${result.correct ? 1 : 0}`, xp: sql`${sessions.xp} + ${xp}` })
        .where(and(eq(sessions.userId, userId), eq(sessions.id, request.sessionId)))
    }
    effects.push(...(await settleMission(tx, userId, now)))
    effects.push(...(await settleGame(tx, userId, now)))
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

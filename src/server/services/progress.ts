import 'server-only'
import { and, desc, eq, isNull, lte, sql, type SQL } from 'drizzle-orm'
import type { Conn } from '@/db/client'
import { achievements, attempts, buckLedger, chapterProgress, dailyActivity, examResults, frozenDays, gemLedger, inventory, leagueMembers, lessonProgress, mistakes, sessions, srsCards, topicResults, units, userState, xpLedger } from '@/db/schema'
import type { LearningUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { ACHIEVEMENT_GEMS, gemRef, isXpReason, LEAGUE_TIERS, PRACTICE_MIN_ANSWERS, type RankInput } from '@/game'
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
import { read, readAll, readOne, type Read } from '../db/batch'
import { awardGems, grantXp, loadState, settleGameWith, settleStreak, xpToGrant, type StreakState } from '../game'
import { xpTodayRead } from '../game/ledger'
import { rankInputFrom, rankRead } from '../game/ranks'
import { stateRead } from '../game/state'
import { frozenRead, goalRead } from '../game/streak'
import { settingsRead, type AppSettings } from '../settings'
import { activityRead, completeMission, missionProgress, missionRead, type MissionRow } from './mission'

export interface AttemptRequest {
  unitId: string
  outcome: Outcome
  hintsUsed?: number
  durationMs?: number
  sessionId?: string | null
}

export async function totalXp(conn: Conn, userId: string): Promise<number> {
  return readOne(conn, xpRead(conn, userId))
}

export function xpRead(conn: Conn, userId: string): Read<number> {
  return read(conn.select({ total: sql<number>`coalesce(sum(${xpLedger.amount}), 0)` }).from(xpLedger).where(eq(xpLedger.userId, userId)), (rows) => Number(rows[0]?.total ?? 0))
}

// The signed-in user's XP (pages, layout, /api/counts).
export async function userXp(): Promise<number> {
  return userScope((db, userId) => totalXp(db, userId))
}

// The leading run of correct answers (overall or at one level) among the last 200.
function leadingRead(conn: Conn, userId: string, level: string | null): Read<number> {
  return read(
    conn
      .select({ correct: attempts.correct })
      .from(attempts)
      .where(and(eq(attempts.userId, userId), level ? eq(attempts.level, level) : undefined))
      .orderBy(desc(attempts.id))
      .limit(200),
    (rows) => {
      let n = 0
      for (const r of rows) {
        if (!r.correct) break
        n++
      }
      return n
    },
  )
}

export function guidesCompleted(snapshot: ContentSnapshot, studied: ReadonlySet<string>): number {
  let n = 0
  for (const guide of snapshot.guides) {
    const ids = guide.chapterIds.filter((id) => snapshot.chapters.get(id)?.kind !== 'index')
    if (ids.length > 0 && ids.every((id) => studied.has(id))) n++
  }
  return n
}

// The achievement metrics that don't come from the streak or the rank ladder.
interface StatsRows {
  xp: number
  attempts: { cards: number; known: number; quizzes: number; quizCorrect: number; solved: number; solvedClean: number }
  studied: Set<string>
  runs: { all: number; senior: number; techlead: number }
  resolved: number
  mistakesCleared: number
  perfectSessions: number
  tests: { passed: number; perfect: number }
  exams: { passed: number; out: number }
  lessons: { done: number; perfect: number }
  evolution: number
  gems: { earned: number; shop: number }
  bucksShop: number
  skins: number
  freezesUsed: number
  practice: number
  leagues: Array<{ tier: string; result: string | null; rank: number | null }>
}

const n = (v: unknown) => Number(v ?? 0)

// Every query behind StatsRows as one batchable read (a single statement with readAll).
function statsRead(conn: Conn, userId: string): Read<StatsRows> {
  return read(
    conn
      .select({
        xp: sql<number>`(select coalesce(sum(x.amount), 0) from ${xpLedger} x where x.user_id = ${userId})`,
        cards: sql<number>`(select count(*) from ${attempts} a where a.user_id = ${userId} and a.kind = 'flashcard')`,
        known: sql<number>`(select count(*) from ${attempts} a where a.user_id = ${userId} and a.kind = 'flashcard' and a.outcome = 'good')`,
        quizzes: sql<number>`(select count(*) from ${attempts} a where a.user_id = ${userId} and a.kind = 'quiz')`,
        quizCorrect: sql<number>`(select count(*) from ${attempts} a where a.user_id = ${userId} and a.kind = 'quiz' and a.outcome = 'correct')`,
        solved: sql<number>`(select count(distinct a.unit_id) from ${attempts} a where a.user_id = ${userId} and a.kind = 'task' and a.outcome = 'solved')`,
        solvedClean: sql<number>`(select count(distinct a.unit_id) from ${attempts} a where a.user_id = ${userId} and a.kind = 'task' and a.outcome = 'solved' and a.hints_used = 0)`,
        studied: sql<string[] | null>`(select array_agg(c.chapter_id) from ${chapterProgress} c where c.user_id = ${userId} and c.status = 'studied')`,
        resolved: sql<number>`(select count(*) from ${mistakes} m where m.user_id = ${userId} and m.resolved_at is not null)`,
        mistakesCleared: sql<number>`(select count(*) from (select u.chapter_id from ${mistakes} m join ${units} u on u.id = m.unit_id where m.user_id = ${userId} group by u.chapter_id having sum(case when m.resolved_at is null then 1 else 0 end) = 0) cleared)`,
        perfectSessions: sql<number>`(select count(*) from ${sessions} s where s.user_id = ${userId} and s.ended_at is not null and s.total >= 10 and s.correct = s.total)`,
        testsPassed: sql<number>`(select count(*) from ${topicResults} t where t.user_id = ${userId} and t.passed_at is not null)`,
        testsPerfect: sql<number>`(select count(*) from ${topicResults} t where t.user_id = ${userId} and t.best_score >= 1)`,
        examsPassed: sql<number>`(select count(*) from ${examResults} e where e.user_id = ${userId} and e.passed_at is not null)`,
        examsOut: sql<number>`(select count(*) from ${examResults} e where e.user_id = ${userId} and e.test_out)`,
        lessonsDone: sql<number>`(select count(*) from ${lessonProgress} l where l.user_id = ${userId} and l.completions > 0)`,
        lessonsPerfect: sql<number>`(select count(*) from ${lessonProgress} l where l.user_id = ${userId} and l.best_accuracy >= 1)`,
        evolution: sql<number | null>`(select us.evo_step from ${userState} us where us.user_id = ${userId})`,
        gemsEarned: sql<number>`(select coalesce(sum(g.amount) filter (where g.amount > 0), 0) from ${gemLedger} g where g.user_id = ${userId})`,
        gemsShop: sql<number>`(select count(*) from ${gemLedger} g where g.user_id = ${userId} and g.reason = 'shop')`,
        bucksShop: sql<number>`(select count(*) from ${buckLedger} b where b.user_id = ${userId} and b.reason = 'shop')`,
        skins: sql<number>`(select count(*) from ${inventory} i where i.user_id = ${userId})`,
        freezesUsed: sql<number>`(select count(*) from ${frozenDays} f where f.user_id = ${userId})`,
        practice: sql<number>`(select count(*) from ${sessions} s where s.user_id = ${userId} and s.ended_at is not null and s.mode in ('mistakes', 'quiz') and s.total >= ${PRACTICE_MIN_ANSWERS})`,
        leagues: sql<Array<{ tier: string; result: string | null; rank: number | null }> | null>`(select json_agg(json_build_object('tier', lm.tier, 'result', lm.result, 'rank', lm.final_rank)) from ${leagueMembers} lm where lm.user_id = ${userId})`,
      })
      .from(sql`(select 1) as one`),
    (rows) => {
      const r = rows[0]
      return {
        xp: n(r?.xp),
        attempts: { cards: n(r?.cards), known: n(r?.known), quizzes: n(r?.quizzes), quizCorrect: n(r?.quizCorrect), solved: n(r?.solved), solvedClean: n(r?.solvedClean) },
        studied: new Set(r?.studied ?? []),
        runs: { all: 0, senior: 0, techlead: 0 },
        resolved: n(r?.resolved),
        mistakesCleared: n(r?.mistakesCleared),
        perfectSessions: n(r?.perfectSessions),
        tests: { passed: n(r?.testsPassed), perfect: n(r?.testsPerfect) },
        exams: { passed: n(r?.examsPassed), out: n(r?.examsOut) },
        lessons: { done: n(r?.lessonsDone), perfect: n(r?.lessonsPerfect) },
        evolution: n(r?.evolution),
        gems: { earned: n(r?.gemsEarned), shop: n(r?.gemsShop) },
        bucksShop: n(r?.bucksShop),
        skins: n(r?.skins),
        freezesUsed: n(r?.freezesUsed),
        practice: n(r?.practice),
        leagues: r?.leagues ?? [],
      }
    },
  )
}

// statsRead + the three answer runs (their own ORDER BY / LIMIT queries)
function statsReads(conn: Conn, userId: string) {
  return [statsRead(conn, userId), leadingRead(conn, userId, null), leadingRead(conn, userId, 'senior'), leadingRead(conn, userId, 'techlead')] as const
}

function statsWithRuns([rows, all, senior, techlead]: readonly [StatsRows, number, number, number]): StatsRows {
  return { ...rows, runs: { all, senior, techlead } }
}

async function statsRows(conn: Conn, userId: string): Promise<StatsRows> {
  return statsWithRuns(await readAll(conn, statsReads(conn, userId)))
}

function statsFrom(rows: StatsRows, streak: StreakState, goalsMet: number, rank: RankInput, snapshot: ContentSnapshot): StatsSnapshot {
  const stats = emptyStats()
  stats['xp.total'] = rows.xp
  stats.level = levelInfo(rows.xp).level
  stats['streak.current'] = streak.current
  stats['streak.best'] = streak.best
  stats['goals.met'] = goalsMet
  stats['cards.reviewed'] = rows.attempts.cards
  stats['cards.known'] = rows.attempts.known
  stats['quiz.answered'] = rows.attempts.quizzes
  stats['quiz.correct'] = rows.attempts.quizCorrect
  stats['tasks.solved'] = rows.attempts.solved
  stats['tasks.solvedNoHints'] = rows.attempts.solvedClean
  stats['chapters.studied'] = rows.studied.size
  stats['guides.completed'] = guidesCompleted(snapshot, rows.studied)
  stats['run.all'] = rows.runs.all
  stats['run.senior'] = rows.runs.senior
  stats['run.techlead'] = rows.runs.techlead
  stats['mistakes.resolved'] = rows.resolved
  stats['chapters.mistakesCleared'] = rows.mistakesCleared
  stats['sessions.perfect'] = rows.perfectSessions
  stats['tests.passed'] = rows.tests.passed
  stats['tests.perfect'] = rows.tests.perfect
  stats['exams.passed'] = rows.exams.passed
  stats['sections.testedOut'] = rows.exams.out
  // Phase 4 metrics (lessons, rank, gems, shop, freezes, practice, leagues)
  stats['lessons.completed'] = rows.lessons.done
  stats['lessons.perfect'] = rows.lessons.perfect
  stats['courses.completed'] = rank.courses
  stats.evolution = rows.evolution
  stats['gems.earned'] = rows.gems.earned
  stats['shop.purchases'] = rows.gems.shop + rows.bucksShop
  stats['skins.owned'] = rows.skins
  stats['freezes.used'] = rows.freezesUsed
  stats['practice.sessions'] = rows.practice
  stats['league.joined'] = rows.leagues.length
  stats['league.promotions'] = rows.leagues.filter((l) => l.result === 'promoted').length
  stats['league.podium'] = rows.leagues.filter((l) => l.rank !== null && l.rank <= 3).length
  stats['league.tier'] = rows.leagues.reduce((max, l) => Math.max(max, (LEAGUE_TIERS as readonly string[]).indexOf(l.tier) + 1), 0)
  return stats
}

// Every achievement metric, every read in one statement; the streak settles (freezes) from those rows.
export async function computeStats(conn: Conn, userId: string, snapshot: ContentSnapshot, now: number): Promise<StatsSnapshot> {
  const [goal, frozen, state, rank, ...stats] = await readAll(conn, [goalRead(conn, userId), frozenRead(conn, userId), stateRead(conn, userId, now), rankRead(conn, userId), ...statsReads(conn, userId)])
  const inputs = { goal, frozen, state: state ?? (await loadState(conn, userId, now)) }
  const { streak, effects } = await settleStreak(conn, userId, now, inputs)
  // a freeze was just spent: it shows up in freezes.used
  const rows = effects.length > 0 ? await statsRows(conn, userId) : statsWithRuns(stats)
  return statsFrom(rows, streak, goal.length, await rankInputFrom(rank), snapshot)
}

// Newly reached achievements: recorded once, each paying XP and 💎. Returns the effects and the XP it granted.
async function unlockAchievements(conn: Conn, userId: string, stats: StatsSnapshot, unlocked: ReadonlySet<string>, now: number): Promise<{ effects: Effect[]; xp: number }> {
  const fresh = newlyUnlocked(stats, unlocked, ACHIEVEMENTS)
  const effects: Effect[] = []
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
  if (xpTotal > 0) await addDailyXp(conn, userId, dayKey(now), xpTotal)
  return { effects, xp: xpTotal }
}

function unlockedRead(conn: Conn, userId: string): Read<Set<string>> {
  return read(conn.select({ id: achievements.id }).from(achievements).where(eq(achievements.userId, userId)), (rows) => new Set(rows.map((r) => r.id)))
}

// End-of-action bookkeeping after anything that moved progress, in this order: the daily mission (bonus once), the
// game (streak freezes, milestone 💎, rank-ups), achievements. Same effects as settling the mission, the game and the
// achievements one after another, but every read of the three goes out in ONE round trip; a step that
// actually wrote something (rare) makes the reads that depend on it run again.
// `mission`: today's mission row, when already read in this transaction (undefined = read it here).
// Returns the effects and the learner's XP total afterwards (for level-up effects).
export async function settleProgress(conn: Conn, userId: string, snapshot: ContentSnapshot, now: number, pre: { mission?: MissionRow | null } = {}): Promise<{ effects: Effect[]; xpTotal: number }> {
  // ONE statement for every read of the three steps (src/server/db/batch.ts)
  const settleReads = () => [goalRead(conn, userId), frozenRead(conn, userId), stateRead(conn, userId, now), rankRead(conn, userId), ...statsReads(conn, userId)] as const
  const [missionRow, today, unlocked, goal0, frozen0, state0, rank0, ...stats0] = await readAll(conn, [missionRead(conn, userId, now), activityRead(conn, userId, now), unlockedRead(conn, userId), ...settleReads()])
  const effects: Effect[] = []
  // 1. mission bonus (writes XP / daily activity / bucks: everything below is read again)
  const mission = await missionProgress(conn, userId, pre.mission !== undefined ? pre.mission : missionRow, now, today)
  const missionEffects = mission ? await completeMission(conn, userId, mission, now) : []
  effects.push(...missionEffects)
  const [goal, frozen, state, rankParts, ...stats] = missionEffects.length > 0 ? await readAll(conn, settleReads()) : ([goal0, frozen0, state0, rank0, ...stats0] as const)
  const inputs = { goal, frozen, state: state ?? (await loadState(conn, userId, now)) }
  const rank = await rankInputFrom(rankParts)
  // 2. game: streak freezes, milestone 💎, rank-up
  const game = await settleGameWith(conn, userId, now, inputs, rank)
  effects.push(...game.effects)
  const rows = game.effects.length > 0 ? await statsRows(conn, userId) : statsWithRuns(stats)
  // 3. achievements
  const statsNow = statsFrom(rows, game.streak, inputs.goal.length, rank, snapshot)
  const unlockedNow = await unlockAchievements(conn, userId, statsNow, unlocked, now)
  effects.push(...unlockedNow.effects)
  return { effects, xpTotal: rows.xp + unlockedNow.xp }
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

// What recording an attempt reads before it writes — one round trip. Harmless to read and then not record (the
// answer action starts these alongside its own session / hearts checks).
export interface AttemptReads {
  history: { everCorrect: boolean; lastCorrectDay: string | null }
  srs: typeof srsCards.$inferSelect | undefined
  mistake: typeof mistakes.$inferSelect | undefined
  xpBefore: number
  boostUntil: number | null
  xpToday: number
  dailyGoal: number
  mission: MissionRow | null
}

export async function readForAttempt(tx: Conn, userId: string, unit: LearningUnit, now: number, settings?: Pick<AppSettings, 'dailyGoal'>): Promise<AttemptReads> {
  return attemptReadsFrom(await readAll(tx, attemptReadList(tx, userId, unit, now)), settings)
}

// The reads of readForAttempt, to batch with the caller's own (answerQuiz) — all in one statement.
export function attemptReadList(tx: Conn, userId: string, unit: LearningUnit, now: number) {
  const reason = isXpReason(unit.kind) ? unit.kind : 'quiz'
  return [
    read(
      tx
        .select({ day: sql<string | null>`max(${attempts.day})` })
        .from(attempts)
        .where(and(eq(attempts.userId, userId), eq(attempts.unitId, unit.id), eq(attempts.correct, true))),
      (rows) => rows[0]?.day ?? null,
    ),
    read(tx.select().from(srsCards).where(and(eq(srsCards.userId, userId), eq(srsCards.unitId, unit.id))), (rows) => rows[0]),
    read(tx.select().from(mistakes).where(and(eq(mistakes.userId, userId), eq(mistakes.unitId, unit.id))), (rows) => rows[0]),
    xpRead(tx, userId),
    stateRead(tx, userId, now),
    xpTodayRead(tx, userId, reason, dayKey(now)),
    settingsRead(tx, userId),
    missionRead(tx, userId, now),
  ] as const
}

type AttemptReadValues = Awaited<ReturnType<typeof readAll<ReturnType<typeof attemptReadList>>>>

export function attemptReadsFrom([lastCorrectDay, srs, mistake, xpBefore, state, xpToday, stored, mission]: AttemptReadValues, settings?: Pick<AppSettings, 'dailyGoal'>): AttemptReads {
  return {
    history: { everCorrect: Boolean(lastCorrectDay), lastCorrectDay },
    srs,
    mistake,
    xpBefore,
    // no game row yet: no boost (the settlement creates the row)
    boostUntil: state?.boostUntil ?? null,
    xpToday,
    dailyGoal: (settings ?? stored).dailyGoal,
    mission,
  }
}

// `settings`: only the daily goal is used; without them the learner's settings rows are read in the same round trip.
export async function recordAttempt(snapshot: ContentSnapshot, unit: LearningUnit, request: AttemptRequest, now = Date.now(), settings?: Pick<AppSettings, 'dailyGoal'>): Promise<Effect[]> {
  return userScope(async (tx, userId) => recordAttemptIn(tx, userId, snapshot, unit, request, now, await readForAttempt(tx, userId, unit, now, settings)), { lock: true })
}

const cte = (name: string, query: { getSQL(): SQL }): SQL => sql`${sql.raw(name)} as (${query.getSQL()})`

// Records an attempt inside the caller's transaction. Round trips: the reads (readForAttempt), every write at once,
// then the settlement reads (settleProgress); the daily goal and anything a settlement step changes add one each.
export async function recordAttemptIn(tx: Conn, userId: string, snapshot: ContentSnapshot, unit: LearningUnit, request: AttemptRequest, now: number, pre: AttemptReads): Promise<Effect[]> {
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
    { history: pre.history, srs: toSrs(pre.srs), mistake: toMistake(pre.mistake), totalXp: pre.xpBefore },
  )
  // XP is granted through the game ledger rules (double-XP boost, per-source daily cap); report what actually landed.
  const reason = isXpReason(unit.kind) ? unit.kind : 'quiz'
  const xp = xpToGrant({ amount: result.xp, reason, now }, pre.boostUntil, pre.xpToday)
  const effects: Effect[] = result.effects.filter((e) => e.type !== 'level-up' && e.type !== 'rank-up' && e.type !== 'xp')
  if (xp > 0) effects.unshift({ type: 'xp', amount: xp, reason })
  const durationMs = Math.max(0, Math.min(request.durationMs ?? 0, 10 * 60_000))
  const counters = {
    cards: unit.kind === 'flashcard' ? 1 : 0,
    quizzes: unit.kind === 'quiz' ? 1 : 0,
    tasks: unit.kind === 'task' ? 1 : 0,
    correct: result.correct ? 1 : 0,
  }
  // Every write in ONE statement: independent data-modifying CTEs (no two touch the same table), the daily row's
  // upsert returning today's totals (was a separate read).
  const writes: SQL[] = [
    cte('a', tx.insert(attempts).values({
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
    })),
    cte('d', tx
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
      .returning({ total: dailyActivity.total, goalMet: dailyActivity.goalMet })),
  ]
  if (xp > 0) writes.push(cte('x', tx.insert(xpLedger).values({ userId, amount: xp, reason, refId: unit.id, createdAt: now, day: dayKey(now) })))
  if (result.srs && unit.kind === 'flashcard') {
    writes.push(
      cte('s', tx
        .insert(srsCards)
        .values({ userId, unitId: unit.id, ...result.srs })
        .onConflictDoUpdate({ target: [srsCards.userId, srsCards.unitId], set: { ...result.srs } })),
    )
  }
  if (result.mistakeChanged && result.mistake) {
    const { unitId: _ignored, ...rest } = result.mistake
    writes.push(
      cte('m', tx
        .insert(mistakes)
        .values({ ...result.mistake, userId })
        .onConflictDoUpdate({ target: [mistakes.userId, mistakes.unitId], set: rest })),
    )
  }
  if (request.sessionId) {
    // Counts only the first answer to one of the session's own exercises while it is open (the CTE above isn't
    // visible here, so `not exists` sees earlier attempts only).
    const sessionId = request.sessionId
    writes.push(
      cte('u', tx
        .update(sessions)
        .set({ total: sql`${sessions.total} + 1`, correct: sql`${sessions.correct} + ${result.correct ? 1 : 0}`, xp: sql`${sessions.xp} + ${xp}` })
        .where(
          and(
            eq(sessions.userId, userId),
            eq(sessions.id, sessionId),
            isNull(sessions.endedAt),
            sql`${sessions.unitIds} @> jsonb_build_array(${unit.id}::text)`,
            sql`not exists (select 1 from ${attempts} where ${attempts.userId} = ${userId} and ${attempts.sessionId} = ${sessionId} and ${attempts.unitId} = ${unit.id})`,
          ),
        )),
    )
  }
  // (getSQL: drizzle would wrap an embedded query in parentheses, which a data-modifying CTE doesn't allow)
  const written = (await tx.execute(sql`with ${sql.join(writes, sql`, `)} select d.total, d.goal_met from d`)) as unknown as Array<{ total: number; goal_met: boolean }>
  const todayRows = written.map((r) => ({ total: Number(r.total), goalMet: r.goal_met }))
  const today = todayRows[0]
  if (today && !today.goalMet && today.total >= pre.dailyGoal) {
    await tx
      .update(dailyActivity)
      .set({ goalMet: true })
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.day, result.day)))
    const { streak } = await settleStreak(tx, userId, now)
    effects.push({ type: 'daily-goal', goal: pre.dailyGoal })
    effects.push({ type: 'streak', days: streak.current })
  }
  const settled = await settleProgress(tx, userId, snapshot, now, { mission: pre.mission })
  effects.push(...settled.effects)
  effects.push(...levelEffects(pre.xpBefore, settled.xpTotal))
  return effects
}

export async function dueFlashcardIds(conn: Conn, userId: string, now: number): Promise<Set<string>> {
  return new Set((await conn.select({ id: srsCards.unitId }).from(srsCards).where(and(eq(srsCards.userId, userId), lte(srsCards.due, now)))).map((r) => r.id))
}

export async function openMistakes(conn: Conn, userId: string): Promise<(typeof mistakes.$inferSelect)[]> {
  return conn.select().from(mistakes).where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt)))
}

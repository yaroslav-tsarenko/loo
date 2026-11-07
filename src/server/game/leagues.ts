import 'server-only'
import { randomUUID } from 'node:crypto'
import { and, desc, eq, gte, inArray, isNull, lt, sql } from 'drizzle-orm'
import { first, getDb, type Conn } from '@/db/client'
import { gemLedger, leagueCohorts, leagueMembers, profiles, xpLedger } from '@/db/schema'
import { gemRef, isTier, LEAGUE_XP_REASONS, leagueGems, nextTier, pickCohort, rankCohort, resultOf, weekKey, weekWindow, COHORT_SIZE, type LeagueResult, type LeagueTier, type WeekWindow, type Zone } from '@/game'
import { dayKey } from '@/progress/day'

// 🏆 Weekly leagues. Runs as the server (table owner), never inside a user transaction: cohorts are shared and a
// leaderboard reads other learners' weekly XP. Only display name, avatar and weekly XP ever leave this module —
// no emails, no ids. Cohorts are joined lazily (first league XP of the week) and finalized lazily (first visit of the
// new week) plus by the daily cron (/api/cron/leagues).

const db = () => getDb()

type Member = typeof leagueMembers.$inferSelect

const tierOf = (s: string): LeagueTier => (isTier(s) ? s : 'bronze')

// Weekly league XP per learner: server-graded sources only, inside the Kyiv week window.
async function weeklyXp(conn: Conn, userIds: readonly string[], week: WeekWindow): Promise<Map<string, number>> {
  if (userIds.length === 0) return new Map()
  // cross-user: league leaderboard — weekly XP of one cohort's members, aggregated (no rows leave the server)
  const rows = await conn
    .select({ userId: xpLedger.userId, xp: sql<number>`coalesce(sum(${xpLedger.amount}), 0)` })
    .from(xpLedger)
    .where(and(inArray(xpLedger.userId, [...userIds]), gte(xpLedger.createdAt, week.start), lt(xpLedger.createdAt, week.end), inArray(xpLedger.reason, [...LEAGUE_XP_REASONS])))
    .groupBy(xpLedger.userId)
  return new Map(rows.map((r) => [r.userId, Number(r.xp)]))
}

async function membership(conn: Conn, userId: string, week: string): Promise<Member | undefined> {
  return first(
    conn
      .select()
      .from(leagueMembers)
      .where(and(eq(leagueMembers.userId, userId), eq(leagueMembers.week, week))),
  )
}

async function previousMembership(conn: Conn, userId: string, week: string): Promise<Member | undefined> {
  return first(
    conn
      .select()
      .from(leagueMembers)
      .where(and(eq(leagueMembers.userId, userId), lt(leagueMembers.week, week)))
      .orderBy(desc(leagueMembers.week))
      .limit(1),
  )
}

// Closes a finished week of one cohort: ranks, promotion / demotion, 💎 rewards. Idempotent (row lock + finalized_at).
export async function finalizeCohort(cohortId: string, now: number): Promise<void> {
  await db().transaction(async (tx) => {
    const cohort = await first(tx.select().from(leagueCohorts).where(eq(leagueCohorts.id, cohortId)).for('update'))
    if (!cohort || cohort.finalizedAt !== null || cohort.week >= weekKey(now)) return
    // cross-user: finalizing a cohort updates every member's result (system job)
    const members = await tx.select().from(leagueMembers).where(eq(leagueMembers.cohortId, cohortId))
    const xp = await weeklyXp(
      tx,
      members.map((m) => m.userId),
      weekWindow(cohort.week),
    )
    const tier = tierOf(cohort.tier)
    const standings = rankCohort(
      members.map((m) => ({ userId: m.userId, xp: xp.get(m.userId) ?? 0, joinedAt: m.joinedAt })),
      tier,
    )
    for (const s of standings) {
      const result = resultOf(s.zone)
      // cross-user: system job writes each member's final place
      await tx
        .update(leagueMembers)
        .set({ finalRank: s.rank, finalXp: s.xp, result, finalizedAt: now })
        .where(and(eq(leagueMembers.userId, s.userId), eq(leagueMembers.week, cohort.week)))
      const gems = leagueGems(s.rank, result, s.xp)
      if (gems > 0) {
        // cross-user: league rewards are paid by the system job (unique ref → once per learner and week)
        await tx
          .insert(gemLedger)
          .values({ userId: s.userId, amount: gems, reason: 'league', refId: gemRef.league(cohort.week), createdAt: now, day: dayKey(now) })
          .onConflictDoNothing()
      }
    }
    await tx.update(leagueCohorts).set({ finalizedAt: now }).where(eq(leagueCohorts.id, cohortId))
  })
}

// Every cohort of a past week that isn't closed yet (cron). Returns how many were finalized.
export async function finalizeDue(now: number): Promise<number> {
  const due = await db()
    .select({ id: leagueCohorts.id })
    .from(leagueCohorts)
    .where(and(isNull(leagueCohorts.finalizedAt), lt(leagueCohorts.week, weekKey(now))))
  for (const c of due) await finalizeCohort(c.id, now)
  return due.length
}

// The tier a learner plays this week: last week's result applied to last week's tier (Bronze for newcomers).
async function tierFor(userId: string, week: string, now: number): Promise<{ tier: LeagueTier; last: Member | null }> {
  let last = await previousMembership(db(), userId, week)
  if (last && last.finalizedAt === null) {
    await finalizeCohort(last.cohortId, now)
    last = await previousMembership(db(), userId, week)
  }
  if (!last) return { tier: 'bronze', last: null }
  return { tier: nextTier(tierOf(last.tier), (last.result ?? null) as LeagueResult | null), last }
}

// Lazy assignment: the first league XP of the week puts the learner into a cohort of their tier (≤ 30 people).
// Call after the user's transaction has committed (never inside one: this opens its own connection).
export async function touchLeague(userId: string, now: number): Promise<void> {
  const week = weekKey(now)
  if (await membership(db(), userId, week)) return
  const xp = (await weeklyXp(db(), [userId], weekWindow(week))).get(userId) ?? 0
  if (xp <= 0) return
  const { tier } = await tierFor(userId, week, now)
  await db().transaction(async (tx) => {
    if (await membership(tx, userId, week)) return
    const open = await tx
      .select({ id: leagueCohorts.id, size: leagueCohorts.size })
      .from(leagueCohorts)
      .where(and(eq(leagueCohorts.week, week), eq(leagueCohorts.tier, tier), isNull(leagueCohorts.finalizedAt), lt(leagueCohorts.size, COHORT_SIZE)))
      .for('update')
    const pick = pickCohort(open)
    let cohortId: string
    if (pick) {
      cohortId = pick.id
      await tx
        .update(leagueCohorts)
        .set({ size: sql`${leagueCohorts.size} + 1` })
        .where(eq(leagueCohorts.id, cohortId))
    } else {
      cohortId = randomUUID()
      await tx.insert(leagueCohorts).values({ id: cohortId, week, tier, size: 1, createdAt: now })
    }
    await tx.insert(leagueMembers).values({ userId, week, tier, cohortId, joinedAt: now })
  })
}

// Admin testing: move a learner this week into the fullest open cohort of `tier` (where the newcomers are) — or a new
// one. Their old cohort shrinks; their weekly XP goes with them (it is read from xp_ledger). Next week continues from
// this tier's result as usual. System operation (shared cohort tables), called only by an admin action for themselves.
export async function moveToTier(userId: string, tier: LeagueTier, now: number): Promise<void> {
  const week = weekKey(now)
  await db().transaction(async (tx) => {
    const mine = await membership(tx, userId, week)
    const open = await tx
      .select({ id: leagueCohorts.id, size: leagueCohorts.size })
      .from(leagueCohorts)
      .where(and(eq(leagueCohorts.week, week), eq(leagueCohorts.tier, tier), isNull(leagueCohorts.finalizedAt), lt(leagueCohorts.size, COHORT_SIZE)))
      .for('update')
    const target = pickCohort(open)
    // already in the fullest open cohort of this tier (or in a full one of it)
    if (mine && mine.tier === tier && (!target || target.id === mine.cohortId)) return
    if (mine) {
      // cross-user: the old cohort's size (shared table)
      await tx.delete(leagueMembers).where(and(eq(leagueMembers.userId, userId), eq(leagueMembers.week, week)))
      await tx
        .update(leagueCohorts)
        .set({ size: sql`greatest(${leagueCohorts.size} - 1, 0)` })
        .where(eq(leagueCohorts.id, mine.cohortId))
    }
    let cohortId: string
    if (target) {
      cohortId = target.id
      await tx
        .update(leagueCohorts)
        .set({ size: sql`${leagueCohorts.size} + 1` })
        .where(eq(leagueCohorts.id, cohortId))
    } else {
      cohortId = randomUUID()
      await tx.insert(leagueCohorts).values({ id: cohortId, week, tier, size: 1, createdAt: now })
    }
    await tx.insert(leagueMembers).values({ userId, week, tier, cohortId, joinedAt: now })
  })
}

export interface LeagueRow {
  rank: number
  name: string
  avatarUrl: string | null
  xp: number
  zone: Zone
  me: boolean
}

export interface LeagueLast {
  week: string
  tier: LeagueTier
  result: LeagueResult
  rank: number
  xp: number
  // the tier it led to (this week's)
  next: LeagueTier
}

export interface LeagueView {
  week: WeekWindow
  tier: LeagueTier
  joined: boolean
  rows: LeagueRow[]
  me: LeagueRow | null
  myXp: number
  last: LeagueLast | null
}

// Everything /leagues shows for the signed-in learner (joins on the fly if they already have XP this week).
export async function leagueView(userId: string, now: number): Promise<LeagueView> {
  await touchLeague(userId, now)
  const week = weekWindow(weekKey(now))
  const mine = await membership(db(), userId, week.key)
  const { tier, last } = await tierFor(userId, week.key, now)
  const lastView: LeagueLast | null =
    last && last.result && last.finalRank !== null
      ? { week: last.week, tier: tierOf(last.tier), result: last.result, rank: last.finalRank, xp: last.finalXp ?? 0, next: nextTier(tierOf(last.tier), last.result) }
      : null
  if (!mine) {
    const myXp = (await weeklyXp(db(), [userId], week)).get(userId) ?? 0
    return { week, tier, joined: false, rows: [], me: null, myXp, last: lastView }
  }
  // cross-user: leaderboard — cohort members with display name and avatar only (never email)
  const members = await db()
    .select({ userId: leagueMembers.userId, joinedAt: leagueMembers.joinedAt, name: profiles.displayName, avatarUrl: profiles.avatarUrl })
    .from(leagueMembers)
    .innerJoin(profiles, eq(profiles.id, leagueMembers.userId))
    .where(eq(leagueMembers.cohortId, mine.cohortId))
  const xp = await weeklyXp(
    db(),
    members.map((m) => m.userId),
    week,
  )
  const byId = new Map(members.map((m) => [m.userId, m]))
  const rows: LeagueRow[] = rankCohort(
    members.map((m) => ({ userId: m.userId, xp: xp.get(m.userId) ?? 0, joinedAt: m.joinedAt })),
    tierOf(mine.tier),
  ).map((s) => ({
    rank: s.rank,
    name: byId.get(s.userId)?.name?.trim() || 'Учень Loo',
    avatarUrl: byId.get(s.userId)?.avatarUrl ?? null,
    xp: s.xp,
    zone: s.zone,
    me: s.userId === userId,
  }))
  const me = rows.find((r) => r.me) ?? null
  return { week, tier: tierOf(mine.tier), joined: true, rows, me, myXp: me?.xp ?? 0, last: lastView }
}

// Compact numbers for other screens (profile, home): this week's tier, place and XP.
export async function leagueSummary(userId: string, now: number): Promise<{ tier: LeagueTier; rank: number | null; size: number; xp: number }> {
  const view = await leagueView(userId, now)
  return { tier: view.tier, rank: view.me?.rank ?? null, size: view.rows.length, xp: view.myXp }
}

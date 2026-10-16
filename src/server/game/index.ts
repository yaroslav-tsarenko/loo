import 'server-only'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { mistakes } from '@/db/schema'
import { boostActive, gearStats, rankIndex, RANKS, rankProgress, skinLook, type GearStats, type HeartsView, type RankProgress, type SkinLook } from '@/game'
import { dayKey } from '@/progress/day'
import type { Effect } from '@/progress/types'
import { userScope } from '../auth'
import { rankInput, settleRank } from './ranks'
import { bucksOf, gemsOf, loadState } from './state'
import { settleStreak, streakRewards, type StreakState } from './streak'

// Game services (Phase 4). Pure rules live in src/game; these read and write the learner's rows.
// Other features (profile statistics, home) import from here: gameSnapshot(), streakNow(), rankOfUser(), leagueSummary().

export { awardBucks, awardGems, bucksEarnedToday, grantXp, gemsEarnedToday, spendBucks, spendGems, xpEarnedToday } from './ledger'
export { addHearts, bucksOf, gemsOf, loadState, ownedItems, spendHeart, type GameState } from './state'
export { settleStreak, streakRewards, goalDays, frozenDayList, type StreakState } from './streak'
export { ackEvolution, rankInput, rankOfUser, settleRank } from './ranks'
export { finalizeDue, leagueSummary, leagueView, touchLeague, type LeagueRow, type LeagueView } from './leagues'

// End-of-transaction bookkeeping for anything that can move XP / goals: freezes, streak milestone gems, rank-ups.
export async function settleGame(conn: Conn, userId: string, now: number): Promise<Effect[]> {
  const { streak, effects } = await settleStreak(conn, userId, now)
  effects.push(...(await streakRewards(conn, userId, streak.current, now)))
  effects.push(...(await settleRank(conn, userId, now)))
  return effects
}

export interface GameSnapshot {
  hearts: HeartsView
  gems: number
  bucks: number
  freezes: number
  boostUntil: number | null
  boostActive: boolean
  look: SkinLook
  // equipped skins (hat, glasses, hoodie, scarf) and gear (head, body, weapon, amulet, aura): item id per slot
  equipped: Record<string, string>
  gear: Record<string, string>
  gearStats: GearStats
  // the stored character step (gear rank gates)
  step: number
  streak: StreakState
  rank: RankProgress
  day: string
}

export async function gameSnapshotIn(conn: Conn, userId: string, now: number): Promise<GameSnapshot> {
  const { streak } = await settleStreak(conn, userId, now)
  const state = await loadState(conn, userId, now)
  return {
    hearts: state.hearts,
    gems: await gemsOf(conn, userId),
    bucks: await bucksOf(conn, userId),
    freezes: streak.freezes,
    boostUntil: state.boostUntil,
    boostActive: boostActive(state.boostUntil, now),
    look: skinLook(state.skin, state.gear),
    equipped: { ...state.skin } as Record<string, string>,
    gear: { ...state.gear } as Record<string, string>,
    gearStats: gearStats(state.gear),
    step: state.evoStep,
    streak,
    rank: rankProgress(await rankInput(conn, userId), state.evoStep),
    day: dayKey(now),
  }
}

// The signed-in learner's game state (layout, /api/counts, shop, leagues, profile).
export async function gameSnapshot(now = Date.now()): Promise<GameSnapshot> {
  return userScope((tx, userId) => gameSnapshotIn(tx, userId, now), { tx: true })
}

// Streak with freezes applied — the number every screen should show.
export async function streakNow(now = Date.now()): Promise<StreakState> {
  return userScope(async (tx, userId) => (await settleStreak(tx, userId, now)).streak, { tx: true })
}

export interface ShellGame {
  streak: StreakState
  hearts: HeartsView
  gems: number
  bucks: number
  boostUntil: number | null
  look: SkinLook
  // character step (user_state.evo_step; settled at the end of every progress transaction)
  rank: { id: string; title: string; index: number; rank: string; tier: number }
  // a reached step whose rank-up moment hasn't been shown yet (full-screen cutscene on the next page load)
  evolution: { from: number; to: number } | null
}

// Cheap per-navigation state for the shell (top bar chips, sidebar, Loo skin): no rank recomputation.
export async function shellGameIn(conn: Conn, userId: string, now: number): Promise<ShellGame> {
  const { streak } = await settleStreak(conn, userId, now)
  const state = await loadState(conn, userId, now)
  const index = rankIndex(state.evoStep)
  const def = RANKS[index]!
  return {
    streak,
    hearts: state.hearts,
    gems: await gemsOf(conn, userId),
    bucks: await bucksOf(conn, userId),
    boostUntil: boostActive(state.boostUntil, now) ? state.boostUntil : null,
    look: skinLook(state.skin, state.gear),
    rank: { id: def.id, title: def.title, index, rank: def.rank, tier: def.tier },
    evolution: state.evoStep > state.evoSeen ? { from: state.evoSeen, to: state.evoStep } : null,
  }
}

// Layout (full loads, router.refresh): also settles the rank silently, so a new user_state row (or ranks changed by
// content) never shows a stale rank.
export async function shellGame(now = Date.now()): Promise<ShellGame> {
  return userScope(
    async (tx, userId) => {
      await settleRank(tx, userId, now)
      return shellGameIn(tx, userId, now)
    },
    { tx: true },
  )
}

export interface PlayerGame {
  hearts: { hearts: number; nextAt: number | null }
  bucks: number
  // «Робота над помилками»: open mistakes first, else a quiz practice session
  practiceHref: string
}

// What the lesson / test player needs up front (hearts gate, in-place refill, practice link).
export async function playerGame(now = Date.now()): Promise<PlayerGame> {
  return userScope(async (tx, userId) => {
    const state = await loadState(tx, userId, now)
    const open = await first(
      tx
        .select({ n: sql<number>`count(*)` })
        .from(mistakes)
        .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
    )
    return { hearts: { hearts: state.hearts.hearts, nextAt: state.hearts.nextAt }, bucks: await bucksOf(tx, userId), practiceHref: Number(open?.n ?? 0) > 0 ? '/mistakes' : '/quiz' }
  })
}

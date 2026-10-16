import 'server-only'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { mistakes } from '@/db/schema'
import { boostActive, rankIndex, RANKS, rankProgress, skinLook, type HeartsView, type RankProgress, type SkinLook } from '@/game'
import { dayKey } from '@/progress/day'
import type { Effect } from '@/progress/types'
import { userScope } from '../auth'
import { rankInput, settleRank } from './ranks'
import { gemsOf, loadState } from './state'
import { settleStreak, streakRewards, type StreakState } from './streak'

// Game services (Phase 4). Pure rules live in src/game; these read and write the learner's rows.
// Other features (profile statistics, home) import from here: gameSnapshot(), streakNow(), rankOfUser(), leagueSummary().

export { awardGems, grantXp, gemsEarnedToday, spendGems, xpEarnedToday } from './ledger'
export { addHearts, gemsOf, loadState, ownedItems, spendHeart, type GameState } from './state'
export { settleStreak, streakRewards, goalDays, frozenDayList, type StreakState } from './streak'
export { rankInput, rankOfUser, settleRank } from './ranks'
export { finalizeDue, leagueSummary, leagueView, touchLeague, type LeagueRow, type LeagueView } from './leagues'

// End-of-transaction bookkeeping for anything that can move XP / goals: freezes, streak milestones 💎, rank-ups.
export async function settleGame(conn: Conn, userId: string, now: number): Promise<Effect[]> {
  const { streak, effects } = await settleStreak(conn, userId, now)
  effects.push(...(await streakRewards(conn, userId, streak.current, now)))
  effects.push(...(await settleRank(conn, userId, now)))
  return effects
}

export interface GameSnapshot {
  hearts: HeartsView
  gems: number
  freezes: number
  boostUntil: number | null
  boostActive: boolean
  look: SkinLook
  equipped: Record<string, string>
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
    freezes: streak.freezes,
    boostUntil: state.boostUntil,
    boostActive: boostActive(state.boostUntil, now),
    look: skinLook(state.skin),
    equipped: { ...state.skin } as Record<string, string>,
    streak,
    rank: rankProgress(await rankInput(conn, userId)),
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
  boostUntil: number | null
  look: SkinLook
  // last settled rank (user_state.rank; settled at the end of every progress transaction)
  rank: { id: string; title: string; emoji: string; index: number }
}

// Cheap per-navigation state for the shell (top bar chips, sidebar, Loo skin): no rank recomputation.
export async function shellGameIn(conn: Conn, userId: string, now: number): Promise<ShellGame> {
  const { streak } = await settleStreak(conn, userId, now)
  const state = await loadState(conn, userId, now)
  const index = rankIndex(state.rank)
  const def = RANKS[index]!
  return {
    streak,
    hearts: state.hearts,
    gems: await gemsOf(conn, userId),
    boostUntil: boostActive(state.boostUntil, now) ? state.boostUntil : null,
    look: skinLook(state.skin),
    rank: { id: def.id, title: def.title, emoji: def.emoji, index },
  }
}

// Layout (full loads, router.refresh): also settles the rank silently, so a new user_state row (or ranks changed by
// content) never shows a stale «Noob».
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
  gems: number
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
    return { hearts: { hearts: state.hearts.hearts, nextAt: state.hearts.nextAt }, gems: await gemsOf(tx, userId), practiceHref: Number(open?.n ?? 0) > 0 ? '/mistakes' : '/quiz' }
  })
}

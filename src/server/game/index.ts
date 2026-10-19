import 'server-only'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { readAll } from '../db/batch'
import { mistakes } from '@/db/schema'
import { boostActive, gearStats, rankIndex, RANKS, rankProgress, skinLook, type GearStats, type HeartsView, type RankInput, type RankProgress, type SkinLook } from '@/game'
import { dayKey } from '@/progress/day'
import type { Effect } from '@/progress/types'
import { userScope } from '../auth'
import { rankInput, rankInputFrom, rankRead, settleRank, type RankParts } from './ranks'
import { gameRead, loadGame, type GameRead } from './state'
import { frozenRead, goalRead, settleStreak, streakInputs, streakRewards, type StreakInputs, type StreakState } from './streak'

// Game services (Phase 4). Pure rules live in src/game; these read and write the learner's rows.
// Other features (profile statistics, home) import from here: gameSnapshot(), streakNow(), rankOfUser(), leagueSummary().

export { awardBucks, awardGems, bucksEarnedToday, grantXp, gemsEarnedToday, spendBucks, spendGems, xpEarnedToday, xpToGrant } from './ledger'
export { addHearts, bucksOf, gemsOf, loadGame, loadState, ownedItems, spendHeart, spendHeartFrom, type GameRead, type GameState } from './state'
export { settleStreak, streakInputs, streakRewards, goalDays, frozenDayList, type StreakInputs, type StreakState } from './streak'
export { ackEvolution, rankInput, rankOfUser, settleRank } from './ranks'
export { finalizeDue, leagueSummary, leagueView, moveToTier, touchLeague, type LeagueRow, type LeagueView } from './leagues'

// End-of-transaction bookkeeping for anything that can move XP / goals: freezes, streak milestone gems, rank-ups.
// Reads first (one round trip: streak inputs + rank input), then only the writes something actually changed.
export async function settleGame(conn: Conn, userId: string, now: number): Promise<Effect[]> {
  const [inputs, input] = await Promise.all([streakInputs(conn, userId, now), rankInput(conn, userId)])
  return (await settleGameWith(conn, userId, now, inputs, input)).effects
}

// settleGame from rows already read in this transaction; also returns the settled streak.
export async function settleGameWith(conn: Conn, userId: string, now: number, inputs: StreakInputs, input: RankInput): Promise<{ effects: Effect[]; streak: StreakState }> {
  const { streak, effects } = await settleStreak(conn, userId, now, inputs)
  effects.push(...(await streakRewards(conn, userId, streak.current, now)))
  // streakRewards may add 💎 but never touches user_state or the rank input
  effects.push(...(await settleRank(conn, userId, now, { state: inputs.state, input })))
  return { effects, streak }
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
  // one round trip for every read, then the streak settles (writes only when a freeze is used)
  const [goal, frozen, game, parts] = await readAll(conn, [goalRead(conn, userId), frozenRead(conn, userId), gameRead(conn, userId, now), rankRead(conn, userId)])
  const { state, gems, bucks } = game ?? (await loadGame(conn, userId, now))
  const input = await rankInputFrom(parts)
  const { streak } = await settleStreak(conn, userId, now, { goal, frozen, state })
  return {
    hearts: state.hearts,
    gems,
    bucks,
    freezes: streak.freezes,
    boostUntil: state.boostUntil,
    boostActive: boostActive(state.boostUntil, now),
    look: skinLook(state.skin, state.gear),
    equipped: { ...state.skin } as Record<string, string>,
    gear: { ...state.gear } as Record<string, string>,
    gearStats: gearStats(state.gear),
    step: state.evoStep,
    streak,
    rank: rankProgress(input, state.evoStep),
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
// `pre`: rows already read in this transaction (the game row only if no rank settle moved evo_step since).
export async function shellGameIn(conn: Conn, userId: string, now: number, pre: { game?: GameRead; goal?: string[]; frozen?: string[] } = {}): Promise<ShellGame> {
  const [goal, frozen, game] =
    pre.goal && pre.frozen && pre.game
      ? [pre.goal, pre.frozen, pre.game]
      : await readAll(conn, [goalRead(conn, userId), frozenRead(conn, userId), gameRead(conn, userId, now)]).then(async ([g, f, r]) => [g, f, r ?? (await loadGame(conn, userId, now))] as const)
  const { state, gems, bucks } = game
  const { streak } = await settleStreak(conn, userId, now, { goal, frozen, state })
  const index = rankIndex(state.evoStep)
  const def = RANKS[index]!
  return {
    streak,
    hearts: state.hearts,
    gems,
    bucks,
    boostUntil: boostActive(state.boostUntil, now) ? state.boostUntil : null,
    look: skinLook(state.skin, state.gear),
    rank: { id: def.id, title: def.title, index, rank: def.rank, tier: def.tier },
    evolution: state.evoStep > state.evoSeen ? { from: state.evoSeen, to: state.evoStep } : null,
  }
}

// Layout (full loads, router.refresh): also settles the rank silently, so a new user_state row (or ranks changed by
// content) never shows a stale rank.
export async function shellGame(now = Date.now()): Promise<ShellGame> {
  return userScope((tx, userId) => settledShellIn(tx, userId, now), { tx: true })
}

// settleRank + shellGameIn with every read in one round trip; the game row is read again only when a rank-up was
// just written.
export async function settledShellIn(conn: Conn, userId: string, now: number): Promise<ShellGame> {
  const [rank, game, goal, frozen] = await readAll(conn, shellGameReads(conn, userId, now))
  return settledShellFrom(conn, userId, now, { rank, game, goal, frozen })
}

// The reads behind settledShellIn, to batch with others (src/server/shell.ts).
export function shellGameReads(conn: Conn, userId: string, now: number) {
  return [rankRead(conn, userId), gameRead(conn, userId, now), goalRead(conn, userId), frozenRead(conn, userId)] as const
}

export async function settledShellFrom(conn: Conn, userId: string, now: number, pre: { rank: RankParts; game: GameRead | null; goal: string[]; frozen: string[] }): Promise<ShellGame> {
  const game = pre.game ?? (await loadGame(conn, userId, now))
  const effects = await settleRank(conn, userId, now, { state: game.state, input: await rankInputFrom(pre.rank) })
  return shellGameIn(conn, userId, now, { game: effects.length > 0 ? undefined : game, goal: pre.goal, frozen: pre.frozen })
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
    const [{ state, bucks }, open] = await Promise.all([
      loadGame(tx, userId, now),
      first(
        tx
          .select({ n: sql<number>`count(*)` })
          .from(mistakes)
          .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
      ),
    ])
    return { hearts: { hearts: state.hearts.hearts, nextAt: state.hearts.nextAt }, bucks, practiceHref: Number(open?.n ?? 0) > 0 ? '/mistakes' : '/quiz' }
  })
}

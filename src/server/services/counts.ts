import 'server-only'
import { sql } from 'drizzle-orm'
import type { Conn } from '@/db/client'
import { mistakes, srsCards, taskState } from '@/db/schema'
import type { ContentSnapshot } from '@/content/store'
import { BOOST_KEY, BUCKS_KEY, GEMS_KEY, HEARTS_KEY, HEARTS_NEXT_KEY, RANK_KEY, STREAK_FREEZES_KEY, STREAK_KEY, STREAK_TODAY_KEY } from '@/ui/shell/constants'
import { userScope } from '../auth'
import { read, readAll, readOne, type Read } from '../db/batch'
import { xpRead } from './progress'
import { activeScope } from '../courses/enrollment'
import { loadGame, shellGameIn, type ShellGame } from '../game'
import { gameRead } from '../game/state'
import { frozenRead, goalRead } from '../game/streak'
import { languageCounts, practiceCounts, type PracticeRows } from './counts-core'

// The unit ids behind the practice badges: due cards, open mistakes, tasks in progress (one round trip).
export async function practiceRowsIn(conn: Conn, userId: string, now: number): Promise<PracticeRows> {
  return readOne(conn, practiceRead(conn, userId, now))
}

// One statement: the three id lists as array subqueries.
export function practiceRead(conn: Conn, userId: string, now: number): Read<PracticeRows> {
  return read(
    conn
      .select({
        due: sql<string[] | null>`(select array_agg(s.unit_id) from ${srsCards} s where s.user_id = ${userId} and s.due <= ${now})`,
        mistakes: sql<string[] | null>`(select array_agg(m.unit_id) from ${mistakes} m where m.user_id = ${userId} and m.resolved_at is null)`,
        tasks: sql<string[] | null>`(select array_agg(t.unit_id) from ${taskState} t where t.user_id = ${userId} and t.status = 'open')`,
      })
      .from(sql`(select 1) as one`),
    (rows) => ({ due: rows[0]?.due ?? [], mistakes: rows[0]?.mistakes ?? [], tasks: rows[0]?.tasks ?? [] }),
  )
}

// Practice badges of the active course + shell stats (streak with freezes applied, bucks, gems, hearts, boost, rank).
export function navCountsFrom(snapshot: ContentSnapshot, pool: ReadonlySet<string> | null, rows: PracticeRows, game: ShellGame): Record<string, number> {
  return {
    ...practiceCounts(rows, snapshot.units, pool),
    ...languageCounts(rows, snapshot.units, pool),
    [STREAK_KEY]: game.streak.current,
    [STREAK_TODAY_KEY]: game.streak.todayCounted ? 1 : 0,
    [STREAK_FREEZES_KEY]: game.streak.freezes,
    [BUCKS_KEY]: game.bucks,
    [GEMS_KEY]: game.gems,
    [HEARTS_KEY]: game.hearts.hearts,
    [HEARTS_NEXT_KEY]: game.hearts.nextAt ?? 0,
    [BOOST_KEY]: game.boostUntil ?? 0,
    [RANK_KEY]: game.rank.index,
  }
}

// The badges on their own, refreshed via /api/counts (the layout reads them with the rest of the shell:
// src/server/shell.ts). Every read in one round trip.
export async function navCounts(snapshot: ContentSnapshot, now = Date.now()): Promise<Record<string, number>> {
  const scope = await activeScope()
  return userScope(
    async (db, userId) => {
      const [rows, goal, frozen, gameRow] = await readAll(db, [practiceRead(db, userId, now), goalRead(db, userId), frozenRead(db, userId), gameRead(db, userId, now)])
      const game = await shellGameIn(db, userId, now, { goal, frozen, game: gameRow ?? (await loadGame(db, userId, now)) })
      return navCountsFrom(snapshot, scope?.ids ?? null, rows, game)
    },
    { tx: true },
  )
}

// /api/counts: the badges and the XP total in one transaction.
export async function navCountsAndXp(snapshot: ContentSnapshot, now = Date.now()): Promise<{ counts: Record<string, number>; xp: number }> {
  const scope = await activeScope()
  return userScope(
    async (db, userId) => {
      // one statement for every read
      const [rows, xp, goal, frozen, gameRow] = await readAll(db, [practiceRead(db, userId, now), xpRead(db, userId), goalRead(db, userId), frozenRead(db, userId), gameRead(db, userId, now)])
      const game = await shellGameIn(db, userId, now, { goal, frozen, game: gameRow ?? (await loadGame(db, userId, now)) })
      return { counts: navCountsFrom(snapshot, scope?.ids ?? null, rows, game), xp }
    },
    { tx: true },
  )
}

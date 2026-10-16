import 'server-only'
import { and, eq, isNull, lte } from 'drizzle-orm'
import { mistakes, srsCards } from '@/db/schema'
import type { ContentSnapshot } from '@/content/store'
import { BOOST_KEY, BUCKS_KEY, GEMS_KEY, HEARTS_KEY, HEARTS_NEXT_KEY, RANK_KEY, STREAK_FREEZES_KEY, STREAK_KEY, STREAK_TODAY_KEY } from '@/ui/shell/constants'
import { userScope } from '../auth'
import { shellGameIn } from '../game'

// Nav badges + shell stats (streak with freezes applied, bucks, gems, hearts, boost, rank index), refreshed via /api/counts.
export async function navCounts(snapshot: ContentSnapshot, now = Date.now()): Promise<Record<string, number>> {
  return userScope(
    async (db, userId) => {
      const due = await db
        .select({ id: srsCards.unitId })
        .from(srsCards)
        .where(and(eq(srsCards.userId, userId), lte(srsCards.due, now)))
      const open = await db
        .select({ id: mistakes.unitId })
        .from(mistakes)
        .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt)))
      const game = await shellGameIn(db, userId, now)
      return {
        '/review': due.filter((r) => snapshot.units.has(r.id)).length,
        '/mistakes': open.filter((r) => snapshot.units.has(r.id)).length,
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
    },
    { tx: true },
  )
}

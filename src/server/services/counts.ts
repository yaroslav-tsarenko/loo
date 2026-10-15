import 'server-only'
import { and, eq, isNull, lte } from 'drizzle-orm'
import { dailyActivity, mistakes, srsCards } from '@/db/schema'
import type { ContentSnapshot } from '@/content/store'
import { dayKey } from '@/progress/day'
import { computeStreak } from '@/progress/streak'
import { STREAK_KEY, STREAK_TODAY_KEY } from '@/ui/shell/constants'
import { userScope } from '../auth'

export async function navCounts(snapshot: ContentSnapshot, now = Date.now()): Promise<Record<string, number>> {
  const [due, open, goalDays] = await userScope((db, userId) =>
    Promise.all([
      db
        .select({ id: srsCards.unitId })
        .from(srsCards)
        .where(and(eq(srsCards.userId, userId), lte(srsCards.due, now))),
      db
        .select({ id: mistakes.unitId })
        .from(mistakes)
        .where(and(eq(mistakes.userId, userId), isNull(mistakes.resolvedAt))),
      db
        .select({ day: dailyActivity.day })
        .from(dailyActivity)
        .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.goalMet, true))),
    ]),
  )
  const streak = computeStreak(
    goalDays.map((r) => r.day),
    dayKey(now),
  )
  return {
    '/review': due.filter((r) => snapshot.units.has(r.id)).length,
    '/mistakes': open.filter((r) => snapshot.units.has(r.id)).length,
    [STREAK_KEY]: streak.current,
    [STREAK_TODAY_KEY]: streak.todayCounted ? 1 : 0,
  }
}

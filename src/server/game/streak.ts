import 'server-only'
import { and, eq } from 'drizzle-orm'
import type { Conn } from '@/db/client'
import { dailyActivity, frozenDays } from '@/db/schema'
import { computeStreak, freezesToUse, streakMilestones, gemRef } from '@/game'
import { dayKey } from '@/progress/day'
import type { StreakInfo } from '@/progress/streak'
import type { Effect } from '@/progress/types'
import { awardGems } from './ledger'
import { loadState, saveState } from './state'

export interface StreakState extends StreakInfo {
  frozenDays: string[]
  freezes: number
}

export async function goalDays(conn: Conn, userId: string): Promise<string[]> {
  return (
    await conn
      .select({ day: dailyActivity.day })
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.goalMet, true)))
  ).map((r) => r.day)
}

export async function frozenDayList(conn: Conn, userId: string): Promise<string[]> {
  return (await conn.select({ day: frozenDays.day }).from(frozenDays).where(eq(frozenDays.userId, userId))).map((r) => r.day)
}

// The streak with 🧊 freezes applied: a missed day is covered by an equipped freeze the first time anyone looks
// (shell counts, a lesson, the cron-free path) — spent freezes are written to frozen_days. Use inside a transaction.
export async function settleStreak(conn: Conn, userId: string, now: number): Promise<{ streak: StreakState; effects: Effect[] }> {
  const today = dayKey(now)
  const [goal, frozen, state] = [await goalDays(conn, userId), await frozenDayList(conn, userId), await loadState(conn, userId, now)]
  const use = freezesToUse(goal, frozen, today, state.freezes)
  const effects: Effect[] = []
  let freezes = state.freezes
  if (use.length > 0) {
    await conn
      .insert(frozenDays)
      .values(use.map((day) => ({ userId, day, usedAt: now })))
      .onConflictDoNothing()
    freezes = Math.max(0, state.freezes - use.length)
    await saveState(conn, userId, { streakFreezes: freezes }, now)
    frozen.push(...use)
    effects.push({ type: 'freeze', days: use.length })
  }
  const info = computeStreak(goal, today, frozen)
  return { streak: { ...info, frozenDays: frozen, freezes }, effects }
}

// 💎 for streak milestones (7 / 30 / 100 days), each paid once per learner.
export async function streakRewards(conn: Conn, userId: string, days: number, now: number): Promise<Effect[]> {
  const effects: Effect[] = []
  for (const m of streakMilestones(days)) {
    const got = await awardGems(conn, userId, { amount: m.gems, reason: 'streak', refId: gemRef.streak(m.days), now })
    if (got > 0) effects.push({ type: 'gems', amount: got, reason: 'streak' })
  }
  return effects
}

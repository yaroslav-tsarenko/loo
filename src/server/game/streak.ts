import 'server-only'
import { and, eq } from 'drizzle-orm'
import type { Conn } from '@/db/client'
import { dailyActivity, frozenDays, gemLedger } from '@/db/schema'
import { computeStreak, freezesToUse, streakMilestones, gemRef } from '@/game'
import { dayKey } from '@/progress/day'
import type { StreakInfo } from '@/progress/streak'
import type { Effect } from '@/progress/types'
import { read, readAll, readOne, type Read } from '../db/batch'
import { loadState, saveState, stateRead, type GameState } from './state'

export interface StreakState extends StreakInfo {
  frozenDays: string[]
  freezes: number
}

export async function goalDays(conn: Conn, userId: string): Promise<string[]> {
  return readOne(conn, goalRead(conn, userId))
}

export function goalRead(conn: Conn, userId: string): Read<string[]> {
  return read(
    conn
      .select({ day: dailyActivity.day })
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.goalMet, true))),
    (rows) => rows.map((r) => r.day),
  )
}

export async function frozenDayList(conn: Conn, userId: string): Promise<string[]> {
  return readOne(conn, frozenRead(conn, userId))
}

export function frozenRead(conn: Conn, userId: string): Read<string[]> {
  return read(conn.select({ day: frozenDays.day }).from(frozenDays).where(eq(frozenDays.userId, userId)), (rows) => rows.map((r) => r.day))
}

export interface StreakInputs {
  goal: string[]
  frozen: string[]
  state: GameState
}

// The three reads behind a streak, in one statement.
export async function streakInputs(conn: Conn, userId: string, now: number): Promise<StreakInputs> {
  const [goal, frozen, state] = await readAll(conn, [goalRead(conn, userId), frozenRead(conn, userId), stateRead(conn, userId, now)])
  return { goal, frozen, state: state ?? (await loadState(conn, userId, now)) }
}

// The streak with 🧊 freezes applied: a missed day is covered by an equipped freeze the first time anyone looks
// (shell counts, a lesson, the cron-free path) — spent freezes are written to frozen_days. Use inside a transaction.
// `inputs`: already read in the same transaction (saves the round trip).
export async function settleStreak(conn: Conn, userId: string, now: number, inputs?: StreakInputs): Promise<{ streak: StreakState; effects: Effect[] }> {
  const today = dayKey(now)
  const { goal, frozen: frozenBefore, state } = inputs ?? (await streakInputs(conn, userId, now))
  const frozen = [...frozenBefore]
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
// All reached milestones in one statement (on conflict do nothing = already paid); was one round trip per milestone.
export async function streakRewards(conn: Conn, userId: string, days: number, now: number): Promise<Effect[]> {
  const reached = streakMilestones(days).filter((m) => m.gems > 0)
  if (reached.length === 0) return []
  const paid = await conn
    .insert(gemLedger)
    .values(reached.map((m) => ({ userId, amount: m.gems, reason: 'streak', refId: gemRef.streak(m.days), createdAt: now, day: dayKey(now) })))
    .onConflictDoNothing()
    .returning({ refId: gemLedger.refId })
  const landed = new Set(paid.map((r) => r.refId))
  return reached.filter((m) => landed.has(gemRef.streak(m.days))).map((m): Effect => ({ type: 'gems', amount: m.gems, reason: 'streak' }))
}

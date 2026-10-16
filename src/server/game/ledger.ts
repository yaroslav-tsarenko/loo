import 'server-only'
import { and, eq, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { gemLedger, xpLedger } from '@/db/schema'
import { boostedXp, cappedXp, xpMultiplier, type XpReason } from '@/game'
import { dayKey } from '@/progress/day'
import { loadState } from './state'

// Every XP and gem movement goes through here: XP gets the ⚡ multiplier and the per-source daily cap (src/game/xp.ts);
// gem awards are idempotent through the ledger's unique (user, reason, ref).

export interface XpGrant {
  amount: number
  reason: XpReason
  refId: string | null
  now: number
}

export async function xpEarnedToday(conn: Conn, userId: string, reason: string, day: string): Promise<number> {
  const row = await first(
    conn
      .select({ n: sql<number>`coalesce(sum(${xpLedger.amount}), 0)` })
      .from(xpLedger)
      .where(and(eq(xpLedger.userId, userId), eq(xpLedger.day, day), eq(xpLedger.reason, reason))),
  )
  return Number(row?.n ?? 0)
}

// Writes the XP actually granted (boosted, capped) and returns it — callers report this number, not their input.
export async function grantXp(conn: Conn, userId: string, grant: XpGrant): Promise<number> {
  if (grant.amount <= 0) return 0
  const day = dayKey(grant.now)
  const state = await loadState(conn, userId, grant.now)
  const boosted = boostedXp(grant.amount, xpMultiplier(state.boostUntil, grant.now))
  const amount = cappedXp(boosted, await xpEarnedToday(conn, userId, grant.reason, day), grant.reason)
  if (amount > 0) await conn.insert(xpLedger).values({ userId, amount, reason: grant.reason, refId: grant.refId, createdAt: grant.now, day })
  return amount
}

export interface GemMove {
  amount: number
  reason: string
  refId: string
  now: number
}

// +💎 once per (reason, ref). Returns what landed (0 when that award was already paid).
export async function awardGems(conn: Conn, userId: string, move: GemMove): Promise<number> {
  if (move.amount <= 0) return 0
  const rows = await conn
    .insert(gemLedger)
    .values({ userId, amount: move.amount, reason: move.reason, refId: move.refId, createdAt: move.now, day: dayKey(move.now) })
    .onConflictDoNothing()
    .returning({ id: gemLedger.id })
  return rows.length > 0 ? move.amount : 0
}

// −💎 (the caller has checked the balance under the user_state row lock).
export async function spendGems(conn: Conn, userId: string, move: GemMove): Promise<void> {
  await conn.insert(gemLedger).values({ userId, amount: -Math.abs(move.amount), reason: move.reason, refId: move.refId, createdAt: move.now, day: dayKey(move.now) })
}

export async function gemsEarnedToday(conn: Conn, userId: string, reason: string, day: string): Promise<number> {
  const row = await first(
    conn
      .select({ n: sql<number>`coalesce(sum(${gemLedger.amount}), 0)` })
      .from(gemLedger)
      .where(and(eq(gemLedger.userId, userId), eq(gemLedger.day, day), eq(gemLedger.reason, reason))),
  )
  return Number(row?.n ?? 0)
}

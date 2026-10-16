import 'server-only'
import { and, eq, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { buckLedger, gemLedger, xpLedger } from '@/db/schema'
import { boostedXp, cappedBucks, cappedXp, xpMultiplier, type BuckReason, type XpReason } from '@/game'
import { dayKey } from '@/progress/day'
import { read, readOne, type Read } from '../db/batch'
import { loadState } from './state'

// Every XP, buck and gem movement goes through here: XP gets the ⚡ multiplier and the per-source daily cap
// (src/game/xp.ts); bucks get their own daily cap (src/game/gems.ts); awards in both currencies are idempotent through
// the ledgers' unique (user, reason, ref).

export interface XpGrant {
  amount: number
  reason: XpReason
  refId: string | null
  now: number
}

export async function xpEarnedToday(conn: Conn, userId: string, reason: string, day: string): Promise<number> {
  return readOne(conn, xpTodayRead(conn, userId, reason, day))
}

export function xpTodayRead(conn: Conn, userId: string, reason: string, day: string): Read<number> {
  return read(
    conn
      .select({ n: sql<number>`coalesce(sum(${xpLedger.amount}), 0)` })
      .from(xpLedger)
      .where(and(eq(xpLedger.userId, userId), eq(xpLedger.day, day), eq(xpLedger.reason, reason))),
    (rows) => Number(rows[0]?.n ?? 0),
  )
}

// The XP a grant actually lands: ⚡ boost, then the per-source daily cap.
export function xpToGrant(grant: Pick<XpGrant, 'amount' | 'reason' | 'now'>, boostUntil: number | null, earnedToday: number): number {
  if (grant.amount <= 0) return 0
  return cappedXp(boostedXp(grant.amount, xpMultiplier(boostUntil, grant.now)), earnedToday, grant.reason)
}

// Writes the XP actually granted (boosted, capped) and returns it — callers report this number, not their input.
export async function grantXp(conn: Conn, userId: string, grant: XpGrant): Promise<number> {
  if (grant.amount <= 0) return 0
  const day = dayKey(grant.now)
  const [state, earned] = await Promise.all([loadState(conn, userId, grant.now), xpEarnedToday(conn, userId, grant.reason, day)])
  const amount = xpToGrant(grant, state.boostUntil, earned)
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

// +bucks once per (reason, ref), under the source's daily cap. Returns what landed (0 when already paid / capped).
export async function awardBucks(conn: Conn, userId: string, move: GemMove & { reason: BuckReason }): Promise<number> {
  const amount = cappedBucks(move.amount, await bucksEarnedToday(conn, userId, move.reason, dayKey(move.now)), move.reason)
  if (amount <= 0) return 0
  const rows = await conn
    .insert(buckLedger)
    .values({ userId, amount, reason: move.reason, refId: move.refId, createdAt: move.now, day: dayKey(move.now) })
    .onConflictDoNothing()
    .returning({ id: buckLedger.id })
  return rows.length > 0 ? amount : 0
}

// −bucks (the caller has checked the balance under the user_state row lock).
export async function spendBucks(conn: Conn, userId: string, move: GemMove): Promise<void> {
  await conn.insert(buckLedger).values({ userId, amount: -Math.abs(move.amount), reason: move.reason, refId: move.refId, createdAt: move.now, day: dayKey(move.now) })
}

export async function bucksEarnedToday(conn: Conn, userId: string, reason: string, day: string): Promise<number> {
  const row = await first(
    conn
      .select({ n: sql<number>`coalesce(sum(${buckLedger.amount}), 0)` })
      .from(buckLedger)
      .where(and(eq(buckLedger.userId, userId), eq(buckLedger.day, day), eq(buckLedger.reason, reason))),
  )
  return Number(row?.n ?? 0)
}

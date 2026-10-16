import 'server-only'
import { and, eq, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { buckLedger, gemLedger, inventory, userState } from '@/db/schema'
import { gainHearts, loseHeart, settleHearts, type EquippedGear, type EquippedSkin, type HeartsState, type HeartsView } from '@/game'

// The learner's game row (user_state): created on first use, hearts settled lazily on every read.

export interface GameState {
  hearts: HeartsView
  freezes: number
  boostUntil: number | null
  skin: EquippedSkin
  gear: EquippedGear
  // character step reached / last one celebrated (src/game/ranks.ts)
  evoStep: number
  evoSeen: number
}

type Row = typeof userState.$inferSelect

function toState(row: Row, now: number): GameState {
  return {
    hearts: settleHearts({ hearts: row.hearts, heartsAt: row.heartsAt }, now),
    freezes: row.streakFreezes,
    boostUntil: row.doubleXpUntil,
    skin: (row.skin ?? {}) as EquippedSkin,
    gear: (row.gear ?? {}) as EquippedGear,
    evoStep: row.evoStep,
    evoSeen: row.evoSeen,
  }
}

// `lock`: SELECT … FOR UPDATE — purchases and heart changes of one learner are serialized.
export async function loadState(conn: Conn, userId: string, now: number, opts: { lock?: boolean } = {}): Promise<GameState> {
  await conn.insert(userState).values({ userId, updatedAt: now }).onConflictDoNothing()
  const query = conn.select().from(userState).where(eq(userState.userId, userId))
  const row = await first(opts.lock ? query.for('update') : query)
  if (!row) throw new Error('user_state missing')
  return toState(row, now)
}

export async function saveState(conn: Conn, userId: string, patch: Partial<Pick<Row, 'hearts' | 'heartsAt' | 'streakFreezes' | 'doubleXpUntil' | 'skin' | 'gear' | 'evoStep' | 'evoSeen'>>, now: number): Promise<void> {
  await conn
    .update(userState)
    .set({ ...patch, updatedAt: now })
    .where(eq(userState.userId, userId))
}

const heartsPatch = (h: HeartsState) => ({ hearts: h.hearts, heartsAt: h.heartsAt })

// −1 ❤️ (never below zero). Returns the new hearts.
export async function spendHeart(conn: Conn, userId: string, now: number): Promise<HeartsView> {
  const state = await loadState(conn, userId, now, { lock: true })
  const next = loseHeart(state.hearts, now)
  await saveState(conn, userId, heartsPatch(next), now)
  return next
}

export async function addHearts(conn: Conn, userId: string, n: number, now: number): Promise<HeartsView> {
  const state = await loadState(conn, userId, now, { lock: true })
  const next = gainHearts(state.hearts, now, n)
  await saveState(conn, userId, heartsPatch(next), now)
  return next
}

export async function gemsOf(conn: Conn, userId: string): Promise<number> {
  const row = await first(conn.select({ total: sql<number>`coalesce(sum(${gemLedger.amount}), 0)` }).from(gemLedger).where(eq(gemLedger.userId, userId)))
  return Number(row?.total ?? 0)
}

export async function bucksOf(conn: Conn, userId: string): Promise<number> {
  const row = await first(conn.select({ total: sql<number>`coalesce(sum(${buckLedger.amount}), 0)` }).from(buckLedger).where(eq(buckLedger.userId, userId)))
  return Number(row?.total ?? 0)
}

export async function ownedItems(conn: Conn, userId: string): Promise<Set<string>> {
  return new Set((await conn.select({ id: inventory.itemId }).from(inventory).where(eq(inventory.userId, userId))).map((r) => r.id))
}

export async function hasItem(conn: Conn, userId: string, itemId: string): Promise<boolean> {
  return Boolean(await first(conn.select({ id: inventory.itemId }).from(inventory).where(and(eq(inventory.userId, userId), eq(inventory.itemId, itemId)))))
}

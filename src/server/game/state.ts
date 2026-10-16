import 'server-only'
import { and, eq, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { read, readOne, type Read } from '../db/batch'
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
// One round trip once the row exists (it is created on first use: insert … on conflict do nothing, then read again).
export async function loadState(conn: Conn, userId: string, now: number, opts: { lock?: boolean } = {}): Promise<GameState> {
  return (await readOne(conn, stateRead(conn, userId, now, opts))) ?? (await createState(conn, userId, now), loadStateOrThrow(conn, userId, now, opts))
}

async function loadStateOrThrow(conn: Conn, userId: string, now: number, opts: { lock?: boolean }): Promise<GameState> {
  const state = await readOne(conn, stateRead(conn, userId, now, opts))
  if (!state) throw new Error('user_state missing')
  return state
}

// The row as a batchable read (src/server/db/batch.ts); null until the row exists (createState).
export function stateRead(conn: Conn, userId: string, now: number, opts: { lock?: boolean } = {}): Read<GameState | null> {
  const query = conn.select().from(userState).where(eq(userState.userId, userId))
  return read(opts.lock ? query.for('update') : query, (rows) => (rows[0] ? toState(rows[0], now) : null))
}

export async function createState(conn: Conn, userId: string, now: number): Promise<void> {
  await conn.insert(userState).values({ userId, updatedAt: now }).onConflictDoNothing()
}

export interface GameRead {
  state: GameState
  gems: number
  bucks: number
}

// The game row and both wallet balances in one statement (shell, shop, snapshots).
export async function loadGame(conn: Conn, userId: string, now: number): Promise<GameRead> {
  const hit = (await readOne(conn, gameRead(conn, userId, now))) ?? (await createState(conn, userId, now), await readOne(conn, gameRead(conn, userId, now)))
  if (!hit) throw new Error('user_state missing')
  return hit
}

export function gameRead(conn: Conn, userId: string, now: number): Read<GameRead | null> {
  const query = conn
    .select({
      row: userState,
      gems: sql<string>`(select coalesce(sum(g.amount), 0) from ${gemLedger} g where g.user_id = ${userId})`,
      bucks: sql<string>`(select coalesce(sum(b.amount), 0) from ${buckLedger} b where b.user_id = ${userId})`,
    })
    .from(userState)
    .where(eq(userState.userId, userId))
  return read(query, (rows) => (rows[0] ? { state: toState(rows[0].row, now), gems: Number(rows[0].gems ?? 0), bucks: Number(rows[0].bucks ?? 0) } : null))
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
  return spendHeartFrom(conn, userId, await loadState(conn, userId, now, { lock: true }), now)
}

// spendHeart with the state already read under the row lock in this transaction.
export async function spendHeartFrom(conn: Conn, userId: string, locked: GameState, now: number): Promise<HeartsView> {
  const next = loseHeart(locked.hearts, now)
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
  return readOne(conn, ownedRead(conn, userId))
}

export function ownedRead(conn: Conn, userId: string): Read<Set<string>> {
  return read(conn.select({ id: inventory.itemId }).from(inventory).where(eq(inventory.userId, userId)), (rows) => new Set(rows.map((r) => r.id)))
}

export async function hasItem(conn: Conn, userId: string, itemId: string): Promise<boolean> {
  return Boolean(await first(conn.select({ id: inventory.itemId }).from(inventory).where(and(eq(inventory.userId, userId), eq(inventory.itemId, itemId)))))
}

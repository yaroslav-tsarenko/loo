'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { and, eq, lt, sql } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '@/db/client'
import { adminAudit, analyticsEvents, buckLedger, gemLedger, inventory, profiles, userState, xpLedger } from '@/db/schema'
import { MAX_HEARTS } from '@/game/hearts'
import { shopItem } from '@/game/shop'
import { dayKey } from '@/progress/day'
import { getUser } from '../auth'
import { parseInput } from '../auth-guard'
import { requireAdminArea } from './guard'

// Admin actions on learners (docs/ADMIN.md). Each one: the admin area's gate, zod input, the write as the system in one
// transaction together with an admin_audit row (who, what, to whom, the values). Balances stay ledger-based: an
// adjustment is a regular ledger row with reason 'admin', so totals, history and ranks stay consistent.

type Tx = Parameters<Parameters<ReturnType<typeof getDb>['transaction']>[0]>[0]

async function actor(): Promise<string> {
  const via = await requireAdminArea()
  if (via === 'login') return 'login'
  return `role:${(await getUser())?.id ?? '?'}`
}

const userId = z.string().uuid()

// `write` may return extra audit fields (e.g. the amount actually applied).
async function apply(target: string, action: string, payload: Record<string, unknown>, write: (tx: Tx, now: number) => Promise<unknown>): Promise<never> {
  const who = await actor()
  const now = Date.now()
  // cross-user: admin write on a learner's rows + the audit row, as the system
  await getDb().transaction(async (tx) => {
    const extra = await write(tx, now)
    if (extra && Object.getPrototypeOf(extra) === Object.prototype) Object.assign(payload, extra)
    await tx.insert(adminAudit).values({ at: now, actor: who, action, targetUserId: target, payload })
  })
  console.log(`[admin] ${who} ${action} ${target} ${JSON.stringify(payload)}`)
  revalidatePath(`/admin/users/${target}`)
  redirect(`/admin/users/${target}?ok=${action}`)
}

const field = (form: FormData, ...keys: string[]) => Object.fromEntries(keys.map((k) => [k, form.get(k) ?? undefined]))
const note = z.string().trim().max(200).optional().default('')

// ±XP, bucks or gems. Negative amounts take away (balances may not go below zero).
const balanceInput = z.object({ userId, kind: z.enum(['xp', 'bucks', 'gems']), amount: z.coerce.number().int().min(-1_000_000).max(1_000_000).refine((n) => n !== 0), note })

export async function adjustBalance(form: FormData): Promise<void> {
  const v = parseInput(balanceInput, field(form, 'userId', 'kind', 'amount', 'note'))
  await apply(v.userId, `balance:${v.kind}`, { amount: v.amount, note: v.note }, async (tx, now) => {
    const table = { xp: xpLedger, bucks: buckLedger, gems: gemLedger }[v.kind]
    const [row] = await tx.select({ total: sql<string>`coalesce(sum(${table.amount}), 0)` }).from(table).where(eq(table.userId, v.userId))
    const amount = Math.max(v.amount, -Number(row?.total ?? 0))
    if (amount !== 0) {
      const refId = `admin:${now}:${Math.random().toString(36).slice(2, 8)}`
      await tx.insert(table).values({ userId: v.userId, amount, reason: 'admin', refId, createdAt: now, day: dayKey(now) })
    }
    return { amount, ...(amount !== v.amount ? { asked: v.amount } : {}) }
  })
}

async function upsertState(tx: Tx, user: string, now: number, set: Partial<typeof userState.$inferInsert>): Promise<void> {
  await tx
    .insert(userState)
    .values({ userId: user, updatedAt: now, ...set })
    .onConflictDoUpdate({ target: userState.userId, set: { ...set, updatedAt: now } })
}

const heartsInput = z.object({ userId, hearts: z.coerce.number().int().min(0).max(MAX_HEARTS) })

export async function setHearts(form: FormData): Promise<void> {
  const v = parseInput(heartsInput, field(form, 'userId', 'hearts'))
  await apply(v.userId, 'hearts', { hearts: v.hearts }, (tx, now) => upsertState(tx, v.userId, now, { hearts: v.hearts, heartsAt: v.hearts >= MAX_HEARTS ? null : now }))
}

const freezesInput = z.object({ userId, count: z.coerce.number().int().min(-20).max(20).refine((n) => n !== 0) })

export async function addFreezes(form: FormData): Promise<void> {
  const v = parseInput(freezesInput, field(form, 'userId', 'count'))
  await apply(v.userId, 'freezes', { count: v.count }, async (tx, now) => {
    await upsertState(tx, v.userId, now, {})
    await tx.update(userState).set({ streakFreezes: sql`greatest(0, ${userState.streakFreezes} + ${v.count})`, updatedAt: now }).where(eq(userState.userId, v.userId))
  })
}

// Double XP for N hours, on top of a boost that is still running. 0 hours ends the boost.
const boostInput = z.object({ userId, hours: z.coerce.number().int().min(0).max(24 * 30) })

export async function giveBoost(form: FormData): Promise<void> {
  const v = parseInput(boostInput, field(form, 'userId', 'hours'))
  await apply(v.userId, v.hours ? 'boost' : 'boost:end', { hours: v.hours }, async (tx, now) => {
    await upsertState(tx, v.userId, now, {})
    const until = v.hours ? sql`greatest(coalesce(${userState.doubleXpUntil}, 0), ${now}) + ${v.hours * 3_600_000}` : sql`null`
    await tx.update(userState).set({ doubleXpUntil: until, updatedAt: now }).where(eq(userState.userId, v.userId))
  })
}

// Permanent shop items only (skins, gear); consumables have their own controls above.
const itemInput = z.object({ userId, itemId: z.string().refine((id) => ['skin', 'gear'].includes(shopItem(id)?.kind ?? '')) })

export async function giveItem(form: FormData): Promise<void> {
  const v = parseInput(itemInput, field(form, 'userId', 'itemId'))
  await apply(v.userId, 'item:give', { itemId: v.itemId }, (tx, now) => tx.insert(inventory).values({ userId: v.userId, itemId: v.itemId, acquiredAt: now }).onConflictDoNothing())
}

export async function takeItem(form: FormData): Promise<void> {
  const v = parseInput(itemInput, field(form, 'userId', 'itemId'))
  await apply(v.userId, 'item:take', { itemId: v.itemId }, (tx) => tx.delete(inventory).where(and(eq(inventory.userId, v.userId), eq(inventory.itemId, v.itemId))))
}

// Ban: signed-in pages send the learner to /banned and API calls act as signed out (src/server/auth). Admin accounts
// can't be banned here (they'd lock the owner out).
const banInput = z.object({ userId, reason: z.string().trim().min(1).max(300) })

export async function banUser(form: FormData): Promise<void> {
  const v = parseInput(banInput, field(form, 'userId', 'reason'))
  await apply(v.userId, 'ban', { reason: v.reason }, async (tx, now) => {
    const [p] = await tx.select({ role: profiles.role }).from(profiles).where(eq(profiles.id, v.userId))
    if (!p || p.role === 'admin') throw new Error('Cannot ban this account')
    await tx.update(profiles).set({ bannedAt: now, banReason: v.reason }).where(eq(profiles.id, v.userId))
  })
}

export async function unbanUser(form: FormData): Promise<void> {
  const v = parseInput(z.object({ userId }), field(form, 'userId'))
  await apply(v.userId, 'unban', {}, (tx) => tx.update(profiles).set({ bannedAt: null, banReason: null }).where(eq(profiles.id, v.userId)))
}

// Settings: drop analytics events older than N days (personal data retention, docs/ANALYTICS.md).
const purgeInput = z.object({ days: z.coerce.number().int().min(7).max(3650) })

export async function purgeAnalytics(form: FormData): Promise<void> {
  const v = parseInput(purgeInput, field(form, 'days'))
  const who = await actor()
  const now = Date.now()
  // cross-user: retention cleanup of the analytics table + the audit row, as the system
  const removed = await getDb().transaction(async (tx) => {
    const [row] = (await tx.execute(sql`with gone as (delete from ${analyticsEvents} where ${lt(analyticsEvents.at, now - v.days * 86_400_000)} returning 1) select count(*) as n from gone`)) as unknown as Array<{ n: unknown }>
    const n = Number(row?.n ?? 0)
    await tx.insert(adminAudit).values({ at: now, actor: who, action: 'analytics:purge', payload: { days: v.days, removed: n } })
    return n
  })
  console.log(`[admin] ${who} analytics:purge ${v.days}d removed ${removed}`)
  revalidatePath('/admin', 'layout')
  redirect(`/admin/settings?ok=purge&removed=${removed}`)
}

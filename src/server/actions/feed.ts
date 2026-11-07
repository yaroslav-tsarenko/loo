'use server'

import { and, eq, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'
import { GENERATED_ID, REEL_ID } from '@/ai/reels/mix'
import { getDb } from '@/db/client'
import { generatedReels, reelState } from '@/db/schema'
import type { Effect } from '@/progress/types'
import { isAdmin, requireAdmin, requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { settleMission } from '../services/mission'

const seenInput = z.array(z.string().max(64)).max(200)
const toggleInput = z.object({ id: z.string().regex(REEL_ID), field: z.enum(['liked', 'saved']), value: z.boolean() })

export async function markReelsSeen(rawIds: string[]): Promise<Effect[]> {
  await requireUser()
  const ids = parseInput(seenInput, rawIds)
  const clean = [...new Set(ids)].filter((id) => REEL_ID.test(id)).slice(0, 50)
  if (clean.length === 0) return []
  const now = Date.now()
  return userScope(
    async (tx, userId) => {
      await tx
        .insert(reelState)
        .values(clean.map((reelId) => ({ userId, reelId, views: 1, lastSeenAt: now })))
        .onConflictDoUpdate({ target: [reelState.userId, reelState.reelId], set: { views: sql`${reelState.views} + 1`, lastSeenAt: now } })
      return settleMission(tx, userId, now)
    },
    { lock: true },
  )
}

export async function toggleReel(rawId: string, rawField: 'liked' | 'saved', rawValue: boolean): Promise<void> {
  await requireUser()
  const { id, field, value } = parseInput(toggleInput, { id: rawId, field: rawField, value: rawValue })
  const set = field === 'liked' ? { liked: value } : { saved: value }
  await userScope((db, userId) =>
    db
      .insert(reelState)
      .values({ userId, reelId: id, ...set })
      .onConflictDoUpdate({ target: [reelState.userId, reelState.reelId], set }),
  )
}

// Hides an AI-generated reel from this user's feed. An admin's hide is also a takedown for everyone
// (generated_reels.status = 'hidden'; the row stays so dedupe still sees it).
export async function hideGeneratedReel(id: string): Promise<{ hidden: boolean }> {
  await requireUser()
  if (typeof id !== 'string' || !GENERATED_ID.test(id)) return { hidden: false }
  const exists = await userScope(async (db, userId) => {
    const [row] = await db.select({ id: generatedReels.id }).from(generatedReels).where(eq(generatedReels.id, id))
    if (!row) return false
    await db
      .insert(reelState)
      .values({ userId, reelId: id, hidden: true })
      .onConflictDoUpdate({ target: [reelState.userId, reelState.reelId], set: { hidden: true } })
    return true
  })
  if (exists && (await isAdmin())) {
    // cross-user: admin takedown of shared AI content (system write, admin checked above).
    await getDb()
      .update(generatedReels)
      .set({ status: 'hidden' })
      .where(and(eq(generatedReels.id, id), inArray(generatedReels.status, ['active', 'pending'])))
  }
  // No revalidatePath: it would re-render (and reshuffle) the feed the user is scrolling.
  return { hidden: exists }
}

// The owner's review of a news-based AI reel (status 'pending' until then): publishes it for everyone.
export async function publishGeneratedReel(id: string): Promise<{ published: boolean }> {
  await requireAdmin()
  if (typeof id !== 'string' || !GENERATED_ID.test(id)) return { published: false }
  // cross-user: admin review of shared AI content (system write, admin checked above).
  const rows = await getDb()
    .update(generatedReels)
    .set({ status: 'active' })
    .where(and(eq(generatedReels.id, id), eq(generatedReels.status, 'pending')))
    .returning({ id: generatedReels.id })
  return { published: rows.length > 0 }
}

'use server'

import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { GENERATED_ID, REEL_ID } from '@/ai/reels/mix'
import { getDb } from '@/db/client'
import { generatedReels, reelState } from '@/db/schema'
import type { Effect } from '@/progress/types'
import { parseInput, requireSession } from '../auth-guard'
import { settleMission } from '../services/mission'

const seenInput = z.array(z.string().max(64)).max(200)
const toggleInput = z.object({ id: z.string().regex(REEL_ID), field: z.enum(['liked', 'saved']), value: z.boolean() })

export async function markReelsSeen(rawIds: string[]): Promise<Effect[]> {
  await requireSession()
  const ids = parseInput(seenInput, rawIds)
  const clean = [...new Set(ids)].filter((id) => REEL_ID.test(id)).slice(0, 50)
  if (clean.length === 0) return []
  const now = Date.now()
  const db = getDb()
  return db.transaction(async (tx) => {
    await tx
      .insert(reelState)
      .values(clean.map((reelId) => ({ reelId, views: 1, lastSeenAt: now })))
      .onConflictDoUpdate({ target: reelState.reelId, set: { views: sql`${reelState.views} + 1`, lastSeenAt: now } })
    return settleMission(tx, now)
  })
}

export async function toggleReel(rawId: string, rawField: 'liked' | 'saved', rawValue: boolean): Promise<void> {
  await requireSession()
  const { id, field, value } = parseInput(toggleInput, { id: rawId, field: rawField, value: rawValue })
  const db = getDb()
  const set = field === 'liked' ? { liked: value } : { saved: value }
  await db.insert(reelState).values({ reelId: id, ...set }).onConflictDoUpdate({ target: reelState.reelId, set })
}

// Hides an AI-generated reel from the feed (kept in the table, so dedupe still sees it).
export async function hideGeneratedReel(id: string): Promise<{ hidden: boolean }> {
  await requireSession()
  if (typeof id !== 'string' || !GENERATED_ID.test(id)) return { hidden: false }
  const rows = await getDb()
    .update(generatedReels)
    .set({ status: 'hidden' })
    .where(and(eq(generatedReels.id, id), eq(generatedReels.status, 'active')))
    .returning({ id: generatedReels.id })
  // No revalidatePath: it would re-render (and reshuffle) the feed the user is scrolling.
  return { hidden: rows.length > 0 }
}

'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { GENERATED_AT_KEY, generateDailyReels } from '@/ai/reels/ingest'
import { first, getDb } from '@/db/client'
import { settings } from '@/db/schema'
import { nowMs } from '../clock'

const COOLDOWN_MS = 30 * 60_000

export type GenerateNowResult =
  | { ok: true; inserted: number; dropped: number; tokens: number }
  | { ok: false; reason: 'cooldown'; retryInMs: number }
  | { ok: false; reason: 'no-credentials' | 'error'; message: string }

// Manual "generate now" on /feed/generated: at most once per 30 minutes (shared with the cron run).
export async function generateReelsNow(): Promise<GenerateNowResult> {
  const now = nowMs()
  const db = getDb()
  const row = await first(db.select().from(settings).where(eq(settings.key, GENERATED_AT_KEY)))
  const last = typeof row?.value === 'number' ? row.value : 0
  if (now - last < COOLDOWN_MS) return { ok: false, reason: 'cooldown', retryInMs: COOLDOWN_MS - (now - last) }
  // Claimed up front, so a double click or a failing model call still respects the cooldown.
  await db.insert(settings).values({ key: GENERATED_AT_KEY, value: now }).onConflictDoUpdate({ target: settings.key, set: { value: now } })
  try {
    const summary = await generateDailyReels(now, { force: true })
    if (summary.skipped === 'no-credentials') {
      // Nothing ran: give the cooldown back.
      if (last) await db.update(settings).set({ value: last }).where(eq(settings.key, GENERATED_AT_KEY))
      else await db.delete(settings).where(eq(settings.key, GENERATED_AT_KEY))
      return { ok: false, reason: 'no-credentials', message: 'Немає ключа AI Gateway: додай AI_GATEWAY_API_KEY або зроби `vercel env pull`' }
    }
    revalidatePath('/feed/generated')
    revalidatePath('/feed')
    return { ok: true, inserted: summary.inserted, dropped: summary.dropped.length, tokens: summary.usage.generate.totalTokens + summary.usage.verify.totalTokens }
  } catch (error) {
    console.error('[reels] manual generation failed', error)
    return { ok: false, reason: 'error', message: error instanceof Error ? error.message : String(error) }
  }
}

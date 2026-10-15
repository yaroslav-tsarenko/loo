'use server'

import { revalidatePath } from 'next/cache'
import { GENERATED_AT_KEY, generateDailyReels } from '@/ai/reels/ingest'
import { requireAdmin } from '../auth'
import { nowMs } from '../clock'
import { readSystem, writeSystem } from '../settings'

const COOLDOWN_MS = 30 * 60_000

export type GenerateNowResult =
  | { ok: true; inserted: number; dropped: number; tokens: number }
  | { ok: false; reason: 'cooldown'; retryInMs: number }
  | { ok: false; reason: 'no-credentials' | 'error'; message: string }

// Manual "generate now" on /feed/generated (admins only: paid model calls): at most once per 30 minutes,
// shared with the cron run.
export async function generateReelsNow(): Promise<GenerateNowResult> {
  await requireAdmin()
  const now = nowMs()
  const lastRaw = await readSystem(GENERATED_AT_KEY)
  const last = typeof lastRaw === 'number' ? lastRaw : 0
  if (now - last < COOLDOWN_MS) return { ok: false, reason: 'cooldown', retryInMs: COOLDOWN_MS - (now - last) }
  // Claimed up front, so a double click or a failing model call still respects the cooldown.
  await writeSystem(GENERATED_AT_KEY, now)
  try {
    const summary = await generateDailyReels(now, { force: true })
    if (summary.skipped === 'no-credentials') {
      // Nothing ran: give the cooldown back.
      await writeSystem(GENERATED_AT_KEY, last || null)
      return { ok: false, reason: 'no-credentials', message: 'Немає ключа AI Gateway: додай AI_GATEWAY_API_KEY або зроби `vercel env pull`' }
    }
    revalidatePath('/feed/generated')
    revalidatePath('/feed')
    return { ok: true, inserted: summary.inserted, dropped: summary.dropped.length, tokens: summary.usage.generate.totalTokens + summary.usage.verify.totalTokens }
  } catch (error) {
    console.error('[reels] manual generation failed', error)
    // Details stay in the server log: provider errors can carry request ids, model names or keys.
    const detail = process.env.NODE_ENV !== 'production' && error instanceof Error ? `: ${error.message}` : ' — деталі в логах сервера'
    return { ok: false, reason: 'error', message: `Генерація не вдалася${detail}` }
  }
}

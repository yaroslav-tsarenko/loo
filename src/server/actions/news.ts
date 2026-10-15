'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, isNull, not } from 'drizzle-orm'
import { z } from 'zod'
import { first, getDb } from '@/db/client'
import { newsItems, settings } from '@/db/schema'
import { ingestNews } from '@/news/ingest'
import { parseInput, requireSession } from '../auth-guard'
import { nowMs } from '../clock'

// news_items.id is sha1(canonical url).
const newsId = z.string().regex(/^[0-9a-f]{40}$/)

const REFRESH_KEY = 'internal.newsRefreshedAt'
const REFRESH_COOLDOWN_MS = 10 * 60_000

export async function markNewsRead(rawId: string): Promise<void> {
  await requireSession()
  const id = parseInput(newsId, rawId)
  await getDb()
    .update(newsItems)
    .set({ readAt: nowMs() })
    .where(and(eq(newsItems.id, id), isNull(newsItems.readAt)))
}

export async function toggleNewsSaved(rawId: string): Promise<{ saved: boolean }> {
  await requireSession()
  const id = parseInput(newsId, rawId)
  const row = await first(getDb().update(newsItems).set({ saved: not(newsItems.saved) }).where(eq(newsItems.id, id)).returning({ saved: newsItems.saved }))
  revalidatePath('/news')
  return { saved: row?.saved ?? false }
}

export type RefreshResult = { ok: true; upserted: number } | { ok: false; retryInMs: number }

// Manual "fetch now": at most once per 10 minutes, shared with nobody else (single-user app).
export async function refreshNews(): Promise<RefreshResult> {
  await requireSession()
  const now = nowMs()
  const db = getDb()
  const row = await first(db.select().from(settings).where(eq(settings.key, REFRESH_KEY)))
  const last = typeof row?.value === 'number' ? row.value : 0
  if (now - last < REFRESH_COOLDOWN_MS) return { ok: false, retryInMs: REFRESH_COOLDOWN_MS - (now - last) }
  await db.insert(settings).values({ key: REFRESH_KEY, value: now }).onConflictDoUpdate({ target: settings.key, set: { value: now } })
  const summary = await ingestNews(now)
  revalidatePath('/news')
  return { ok: true, upserted: summary.upserted }
}

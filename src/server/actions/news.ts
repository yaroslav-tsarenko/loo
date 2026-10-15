'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { z } from 'zod'
import { first } from '@/db/client'
import { newsItems, newsReads } from '@/db/schema'
import { ingestNews } from '@/news/ingest'
import { requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { nowMs } from '../clock'
import { readSystem, writeSystem } from '../settings'

// news_items.id is sha1(canonical url).
const newsId = z.string().regex(/^[0-9a-f]{40}$/)

const REFRESH_KEY = 'internal.newsRefreshedAt'
const REFRESH_COOLDOWN_MS = 10 * 60_000

async function knownNews(id: string): Promise<boolean> {
  return Boolean(await userScope((db) => first(db.select({ id: newsItems.id }).from(newsItems).where(eq(newsItems.id, id)))))
}

export async function markNewsRead(rawId: string): Promise<void> {
  await requireUser()
  const id = parseInput(newsId, rawId)
  if (!(await knownNews(id))) return
  const now = nowMs()
  await userScope(async (db, userId) => {
    await db
      .insert(newsReads)
      .values({ userId, newsId: id, readAt: now })
      .onConflictDoUpdate({ target: [newsReads.userId, newsReads.newsId], set: { readAt: now }, setWhere: and(eq(newsReads.userId, userId), isNull(newsReads.readAt)) })
  })
}

export async function toggleNewsSaved(rawId: string): Promise<{ saved: boolean }> {
  await requireUser()
  const id = parseInput(newsId, rawId)
  if (!(await knownNews(id))) return { saved: false }
  const row = await userScope((db, userId) =>
    first(
      db
        .insert(newsReads)
        .values({ userId, newsId: id, saved: true })
        .onConflictDoUpdate({ target: [newsReads.userId, newsReads.newsId], set: { saved: sql`not ${newsReads.saved}` } })
        .returning({ saved: newsReads.saved }),
    ),
  )
  revalidatePath('/news')
  return { saved: row?.saved ?? false }
}

export type RefreshResult = { ok: true; upserted: number } | { ok: false; retryInMs: number }

// Manual "fetch now": at most once per 10 minutes for everyone (news are shared).
export async function refreshNews(): Promise<RefreshResult> {
  await requireUser()
  const now = nowMs()
  const lastRaw = await readSystem(REFRESH_KEY)
  const last = typeof lastRaw === 'number' ? lastRaw : 0
  if (now - last < REFRESH_COOLDOWN_MS) return { ok: false, retryInMs: REFRESH_COOLDOWN_MS - (now - last) }
  await writeSystem(REFRESH_KEY, now)
  const summary = await ingestNews(now)
  revalidatePath('/news')
  return { ok: true, upserted: summary.upserted }
}

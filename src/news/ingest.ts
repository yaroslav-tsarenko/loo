import 'server-only'
import { and, eq, gt, lt, sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { newsItems } from '@/db/schema'
import { collectNews } from './collect'
import { isNearDuplicate } from './dedupe'

const RETENTION_MS = 30 * 86_400_000
const RECENT_MS = 7 * 86_400_000

export interface IngestSummary {
  fetched: Record<string, number>
  upserted: number
  skippedDuplicates: number
  deleted: number
  durationMs: number
}

export async function ingestNews(now: number): Promise<IngestSummary> {
  const started = Date.now()
  const { items, fetched } = await collectNews(now)
  const db = getDb()

  // The same story may already be stored under another URL (e.g. HN yesterday, JS Weekly today).
  const recent = await db.select({ id: newsItems.id, title: newsItems.title, tags: newsItems.tags }).from(newsItems).where(gt(newsItems.publishedAt, now - RECENT_MS))
  const known = new Set(recent.map((r) => r.id))
  const fresh = items.filter((item) => known.has(item.id) || !recent.some((r) => isNearDuplicate(r, item)))

  if (fresh.length > 0) {
    await db
      .insert(newsItems)
      .values(
        fresh.map((item) => ({
          id: item.id,
          source: item.source,
          title: item.title,
          url: item.url,
          summary: item.summary ?? null,
          author: item.author ?? null,
          score: item.rank,
          tags: item.tags,
          publishedAt: item.publishedAt,
          fetchedAt: now,
        })),
      )
      // readAt and saved are user state: never touched on re-ingest.
      .onConflictDoUpdate({
        target: newsItems.id,
        set: {
          title: sql`excluded.title`,
          summary: sql`excluded.summary`,
          score: sql`excluded.score`,
          tags: sql`excluded.tags`,
          fetchedAt: sql`excluded.fetched_at`,
        },
      })
  }

  const deleted = await db
    .delete(newsItems)
    .where(and(eq(newsItems.saved, false), lt(newsItems.publishedAt, now - RETENTION_MS)))
    .returning({ id: newsItems.id })

  const summary = { fetched, upserted: fresh.length, skippedDuplicates: items.length - fresh.length, deleted: deleted.length, durationMs: Date.now() - started }
  console.log('[news] ingest done', summary)
  return summary
}

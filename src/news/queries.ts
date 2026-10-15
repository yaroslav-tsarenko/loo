import 'server-only'
import { and, count, desc, eq, gt, sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { newsItems, newsReads } from '@/db/schema'
import { userScope } from '@/server/auth'

// A news item plus the current user's state (read / saved live in news_reads, per user).
export type NewsItem = typeof newsItems.$inferSelect & { readAt: number | null; saved: boolean }

const WEEK_MS = 7 * 86_400_000

// Shared news for system jobs (cron reels): nobody's read state.
export async function systemLatestNews(limit: number): Promise<NewsItem[]> {
  const rows = await getDb().select().from(newsItems).orderBy(desc(newsItems.publishedAt), desc(newsItems.score)).limit(limit)
  return rows.map((r) => ({ ...r, readAt: null, saved: false }))
}

// Best of the last week, most useful first; grouped by day on the page.
export async function weekNews(now: number): Promise<NewsItem[]> {
  return userScope((db, userId) =>
    db
      .select({ item: newsItems, readAt: newsReads.readAt, saved: sql<boolean>`coalesce(${newsReads.saved}, false)` })
      .from(newsItems)
      .leftJoin(newsReads, and(eq(newsReads.newsId, newsItems.id), eq(newsReads.userId, userId)))
      .where(gt(newsItems.publishedAt, now - WEEK_MS))
      .orderBy(desc(newsItems.score), desc(newsItems.publishedAt))
      .limit(300)
      .then((rows) => rows.map((r) => ({ ...r.item, readAt: r.readAt ?? null, saved: Boolean(r.saved) }))),
  )
}

export async function savedNews(): Promise<NewsItem[]> {
  return userScope((db, userId) =>
    db
      .select({ item: newsItems, readAt: newsReads.readAt })
      .from(newsReads)
      .innerJoin(newsItems, eq(newsItems.id, newsReads.newsId))
      .where(and(eq(newsReads.userId, userId), eq(newsReads.saved, true)))
      .orderBy(desc(newsItems.publishedAt))
      .then((rows) => rows.map((r) => ({ ...r.item, readAt: r.readAt ?? null, saved: true }))),
  )
}

export async function savedNewsCount(): Promise<number> {
  const [row] = await userScope((db, userId) =>
    db
      .select({ n: count() })
      .from(newsReads)
      .where(and(eq(newsReads.userId, userId), eq(newsReads.saved, true))),
  )
  return row?.n ?? 0
}

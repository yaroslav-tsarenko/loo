import 'server-only'
import { count, desc, eq, gt, isNull } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { newsItems } from '@/db/schema'

export type NewsItem = typeof newsItems.$inferSelect

const WEEK_MS = 7 * 86_400_000

// Newest news first (ties by usefulness). For the home widget / feed.
export async function latestNews(limit: number, opts: { unreadOnly?: boolean } = {}): Promise<NewsItem[]> {
  return getDb()
    .select()
    .from(newsItems)
    .where(opts.unreadOnly ? isNull(newsItems.readAt) : undefined)
    .orderBy(desc(newsItems.publishedAt), desc(newsItems.score))
    .limit(limit)
}

// Best of the last week, most useful first; grouped by day on the page.
export async function weekNews(now: number): Promise<NewsItem[]> {
  return getDb()
    .select()
    .from(newsItems)
    .where(gt(newsItems.publishedAt, now - WEEK_MS))
    .orderBy(desc(newsItems.score), desc(newsItems.publishedAt))
    .limit(300)
}

export async function savedNews(): Promise<NewsItem[]> {
  return getDb().select().from(newsItems).where(eq(newsItems.saved, true)).orderBy(desc(newsItems.publishedAt))
}

export async function savedNewsCount(): Promise<number> {
  const [row] = await getDb().select({ n: count() }).from(newsItems).where(eq(newsItems.saved, true))
  return row?.n ?? 0
}

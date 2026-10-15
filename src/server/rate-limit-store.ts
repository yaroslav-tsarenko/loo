import 'server-only'
import { lt, sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { rateLimits } from '@/db/schema'
import type { RateLimitStore } from '@/lib/rate-limit'

// Atomic fixed-window counter in Postgres: works across serverless instances.
export const dbRateLimitStore: RateLimitStore = {
  async increment(key, windowMs, now) {
    const db = getDb()
    const resetAt = now + windowMs
    const [row] = await db
      .insert(rateLimits)
      .values({ key, count: 1, resetAt })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          count: sql`case when ${rateLimits.resetAt} <= ${now} then 1 else ${rateLimits.count} + 1 end`,
          resetAt: sql`case when ${rateLimits.resetAt} <= ${now} then ${resetAt} else ${rateLimits.resetAt} end`,
        },
      })
      .returning({ count: rateLimits.count, resetAt: rateLimits.resetAt })
    // Opportunistic cleanup of long-expired windows.
    if (Math.random() < 0.05) await db.delete(rateLimits).where(lt(rateLimits.resetAt, now - 86_400_000))
    return { count: row?.count ?? Number.MAX_SAFE_INTEGER, resetAt: row?.resetAt ?? resetAt }
  },
}

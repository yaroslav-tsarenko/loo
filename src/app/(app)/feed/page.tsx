import type { Metadata } from 'next'
import { and, eq, gte, sql } from 'drizzle-orm'
import { first } from '@/db/client'
import { reelState } from '@/db/schema'
import { userScope } from '@/server/auth'
import { dayStartMs } from '@/progress/day'
import { getContent } from '@/server/content'
import { availableReelCount, buildFeed } from '@/server/services/feed'
import { getMission } from '@/server/services/mission'
import { Feed } from '@/ui/feed/Feed'

export const metadata: Metadata = { title: 'Стрічка' }

async function loadFeed(seedParam: string | undefined) {
  const snapshot = await getContent()
  const now = Date.now()
  const seed = Number(seedParam) || Math.floor(now / 60_000)
  const [slides, seenRow, mission] = await Promise.all([
    buildFeed(snapshot, seed),
    userScope((db, userId) =>
      first(
        db
          .select({ n: sql<number>`count(*)` })
          .from(reelState)
          .where(and(eq(reelState.userId, userId), gte(reelState.lastSeenAt, dayStartMs(now)))),
      ),
    ),
    availableReelCount(snapshot).then((reels) => getMission(snapshot, reels, now)),
  ])
  const target = mission.plan.steps.find((s) => s.kind === 'feed')?.target ?? 20
  return { slides, nextHref: `/feed?seed=${seed + 1}`, seenToday: Number(seenRow?.n ?? 0), target }
}

export default async function FeedPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { seed } = await searchParams
  return <Feed {...await loadFeed(seed)} />
}

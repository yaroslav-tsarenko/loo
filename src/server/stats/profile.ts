import 'server-only'
import { eq } from 'drizzle-orm'
import { achievements } from '@/db/schema'
import type { ContentSnapshot } from '@/content/store'
import { ACHIEVEMENTS } from '@/progress/achievements/catalog'
import { progressOf, type AchievementDef } from '@/progress/achievements/dsl'
import { computeProfileStats, splitTopics, statTiers, type ProfileStats, type Tier, type TopicStat } from '@/progress/stats'
import type { RankProgress } from '@/game'
import type { StatsSnapshot } from '@/progress/achievements/dsl'
import type { StatsAggregates } from '@/progress/stats'
import { userScope } from '../auth'
import { rankOfUser } from '../game/ranks'
import type { ActiveCourse } from '../courses/enrollment'
import { missionCursorIn, type MissionCursor } from '../services/mission'
import { computeStats } from '../services/progress'
import type { AppSettings } from '../settings'
import { getCoachIn, type CoachView } from './coach'
import { loadAggregates } from './queries'
import { topicTitles } from './topics'

export interface ProfileTopic extends TopicStat {
  topicId: string | null
  icon: string | null
  order: number
}

export interface ProfileView {
  stats: ProfileStats
  // game rank (src/game/ranks.ts): XP + course milestones
  rank: RankProgress
  tiers: Tier[]
  // topics with answers, path order (chart)
  topics: ProfileTopic[]
  strong: ProfileTopic[]
  weak: ProfileTopic[]
  achievements: Array<{ def: AchievementDef; unlockedAt: number | null; progress: number }>
}

export interface ProfilePageData {
  view: ProfileView
  cursor: MissionCursor
  coach: CoachView
}

// Everything the profile page reads, in ONE transaction: aggregates, achievement metrics, rank, the mission cursor
// and the coach all go out together (was nine transactions).
export async function profilePageData(snapshot: ContentSnapshot, ctx: { active: ActiveCourse | null; settings: AppSettings }, now = Date.now()): Promise<ProfilePageData> {
  return userScope(
    async (db, userId) => {
      const agg = loadAggregates(db, userId, now)
      const cursor = missionCursorIn(db, userId, snapshot, ctx.active)
      const [aggregates, unlockedRows, snapshotStats, rank, { cursor: at }, coach] = await Promise.all([
        agg,
        db.select({ id: achievements.id, at: achievements.unlockedAt }).from(achievements).where(eq(achievements.userId, userId)),
        computeStats(db, userId, snapshot, now),
        rankOfUser(db, userId),
        cursor,
        getCoachIn(db, userId, snapshot, cursor.then((c) => ({ href: c.cursor.href })), { settings: ctx.settings, active: ctx.active, agg }, now),
      ])
      return { view: profileViewFrom(snapshot, ctx.active, aggregates, unlockedRows, snapshotStats, rank), cursor: at, coach }
    },
    { tx: true },
  )
}

function profileViewFrom(
  snapshot: ContentSnapshot,
  active: ActiveCourse | null,
  agg: StatsAggregates,
  unlockedRows: Array<{ id: string; at: number }>,
  snapshotStats: StatsSnapshot,
  rank: RankProgress,
): ProfileView {
  const stats = computeProfileStats(agg)
  const titles = topicTitles(snapshot, active?.bundle ?? null)
  const topics: ProfileTopic[] = []
  for (const row of agg.topics) {
    const ref = titles.get(row.chapterId)
    if (!ref) continue
    topics.push({ ...row, title: ref.title, topicId: ref.topicId, icon: ref.icon, order: ref.order, accuracy: row.total > 0 ? row.correct / row.total : null })
  }
  topics.sort((a, b) => a.order - b.order)
  const { strong, weak } = splitTopics(topics)
  const unlocked = new Map(unlockedRows.map((r) => [r.id, r.at]))
  return {
    stats,
    rank,
    tiers: statTiers(stats),
    topics,
    strong,
    weak,
    achievements: ACHIEVEMENTS.map((def) => ({ def, unlockedAt: unlocked.get(def.id) ?? null, progress: progressOf(def.when, snapshotStats) })),
  }
}

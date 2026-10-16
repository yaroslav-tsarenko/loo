import 'server-only'
import { eq } from 'drizzle-orm'
import { achievements } from '@/db/schema'
import type { ContentSnapshot } from '@/content/store'
import { ACHIEVEMENTS } from '@/progress/achievements/catalog'
import { progressOf, type AchievementDef } from '@/progress/achievements/dsl'
import { computeProfileStats, splitTopics, statTiers, type ProfileStats, type Tier, type TopicStat } from '@/progress/stats'
import type { RankProgress } from '@/game'
import { userScope } from '../auth'
import { rankOfUser } from '../game/ranks'
import { activeCourse } from '../courses/enrollment'
import { computeStats } from '../services/progress'
import { statsAggregates } from './aggregates'
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

export async function profileView(snapshot: ContentSnapshot, now = Date.now()): Promise<ProfileView> {
  const [agg, active, [unlockedRows, snapshotStats, rank]] = await Promise.all([
    statsAggregates(),
    activeCourse(),
    userScope((db, userId) =>
      Promise.all([db.select({ id: achievements.id, at: achievements.unlockedAt }).from(achievements).where(eq(achievements.userId, userId)), computeStats(db, userId, snapshot, now), rankOfUser(db, userId)]),
    ),
  ])
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

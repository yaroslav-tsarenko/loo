import { ACHIEVEMENTS } from './catalog'
import { holds, type AchievementDef, type StatsSnapshot } from './dsl'

export function newlyUnlocked(stats: StatsSnapshot, unlocked: ReadonlySet<string>, catalog: readonly AchievementDef[] = ACHIEVEMENTS): AchievementDef[] {
  return catalog.filter((a) => !unlocked.has(a.id) && holds(a.when, stats))
}

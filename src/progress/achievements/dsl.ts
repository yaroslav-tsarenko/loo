export const METRICS = [
  'xp.total',
  'level',
  'streak.current',
  'streak.best',
  'goals.met',
  'cards.reviewed',
  'cards.known',
  'quiz.correct',
  'quiz.answered',
  'tasks.solved',
  'tasks.solvedNoHints',
  'chapters.studied',
  'guides.completed',
  'run.all',
  'run.senior',
  'run.techlead',
  'mistakes.resolved',
  'chapters.mistakesCleared',
  'sessions.perfect',
  'tests.passed',
  'tests.perfect',
  'exams.passed',
  'sections.testedOut',
] as const

export type Metric = (typeof METRICS)[number]
export type StatsSnapshot = Record<Metric, number>

export type Condition =
  | { metric: Metric; gte: number }
  | { metric: Metric; eq: number }
  | { all: readonly Condition[] }
  | { any: readonly Condition[] }

export interface AchievementDef {
  id: string
  title: string
  description: string
  tier: 'bronze' | 'silver' | 'gold'
  when: Condition
}

export function holds(condition: Condition, stats: StatsSnapshot): boolean {
  if ('all' in condition) return condition.all.every((c) => holds(c, stats))
  if ('any' in condition) return condition.any.some((c) => holds(c, stats))
  const value = stats[condition.metric] ?? 0
  if ('gte' in condition) return value >= condition.gte
  return value === condition.eq
}

export function progressOf(condition: Condition, stats: StatsSnapshot): number {
  if ('all' in condition) return Math.min(...condition.all.map((c) => progressOf(c, stats)))
  if ('any' in condition) return Math.max(...condition.any.map((c) => progressOf(c, stats)))
  const value = stats[condition.metric] ?? 0
  if ('gte' in condition) return condition.gte <= 0 ? 1 : Math.min(1, value / condition.gte)
  return value === condition.eq ? 1 : 0
}

export function emptyStats(): StatsSnapshot {
  return Object.fromEntries(METRICS.map((m) => [m, 0])) as StatsSnapshot
}

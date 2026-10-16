// Statistics engine: per-user aggregates → the numbers the profile shows. Pure and deterministic (tests/unit/stats.test.ts).
//
// Definitions (also in the profile's tooltips):
// · hours — practice time (sum of answer durations, capped at 10 min per answer) + article reading time
// · week — practice time of the last 7 study days incl. today (reading isn't tracked per day)
// · tasks solved — distinct tasks with at least one passing run; first-try rate = solved on the first run / attempted
// · questions — quiz answers; accuracy = correct / answered (every answer counts, repeats too)
// · cards in long-term memory — FSRS cards in Review with stability ≥ 21 days
// · speed — median seconds per answer (robust to «left the tab open»), recent 14 days vs the 14 before
// · items per minute — answers / practice minutes over the recent 14 days (+ today)
// · consistency — active days (≥ 1 answer) of the last 30 incl. today

import { shiftDay } from '../day'
import { computeStreak, type StreakInfo } from '../streak'
import type { AttemptKind, DayRecord, DayRow, MemoryRow, ResultsRow, SpeedGroup, SpeedRow, StatsAggregates, TaskDifficulty } from './types'

export const HEAT_DAYS = 182
export const SERIES_DAYS = 30
export const SPEED_WINDOW_DAYS = 14
// fewer answers than this in a window → no median (too noisy to compare)
export const SPEED_MIN_SAMPLE = 5

export interface Rate {
  total: number
  correct: number
  rate: number | null
}

export function rate(total: number, correct: number): Rate {
  return { total, correct, rate: total > 0 ? correct / total : null }
}

export interface HeatDay {
  day: string
  total: number
  xp: number
  minutes: number
  goalMet: boolean
}

export interface SpeedStat {
  group: SpeedGroup
  recentMs: number | null
  previousMs: number | null
  todayMs: number | null
  recentN: number
  // recent / previous − 1: negative = faster
  trend: number | null
}

export interface ProfileStats {
  empty: boolean
  xp: number
  hours: { totalMs: number; practiceMs: number; readingMs: number; weekMs: number; prevWeekMs: number }
  answers: Rate
  questions: Rate
  cards: Rate
  byKind: Array<{ kind: AttemptKind } & Rate>
  byLevel: Array<{ level: string; solved: number } & Rate>
  tasks: { attempted: number; solved: number; firstTry: number; firstTryRate: number | null; byDifficulty: Record<TaskDifficulty, number> }
  memory: MemoryRow & { longTermShare: number | null }
  speed: { groups: SpeedStat[]; question: SpeedStat | null; itemsPerMinute: number | null }
  consistency: { active30: number; ratio30: number; active14: number; streak: StreakInfo }
  results: ResultsRow
  records: { bestDayXp: DayRecord | null; bestDayAnswers: DayRecord | null; longestCombo: number; longestStreak: number; fastestPerfectLessonMs: number | null }
  series: { heat: HeatDay[]; xp30: Array<{ day: string; xp: number }>; speed30: Array<{ day: string; medianMs: number | null; n: number }> }
}

// The last `n` study days ending with `today`, oldest first.
export function lastDays(today: string, n: number): string[] {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) out.push(shiftDay(today, -i))
  return out
}

function dayMap(rows: readonly DayRow[]): Map<string, DayRow> {
  return new Map(rows.map((d) => [d.day, d]))
}

function speedStats(rows: readonly SpeedRow[]): SpeedStat[] {
  const groups = new Map<SpeedGroup, SpeedStat>()
  for (const r of rows) {
    const s = groups.get(r.group) ?? { group: r.group, recentMs: null, previousMs: null, todayMs: null, recentN: 0, trend: null }
    const enough = r.n >= SPEED_MIN_SAMPLE
    if (r.window === 'recent') {
      s.recentN = r.n
      if (enough) s.recentMs = r.medianMs
    } else if (r.window === 'previous') {
      if (enough) s.previousMs = r.medianMs
    } else if (r.n > 0) s.todayMs = r.medianMs
    groups.set(r.group, s)
  }
  for (const s of groups.values()) s.trend = s.recentMs !== null && s.previousMs !== null && s.previousMs > 0 ? s.recentMs / s.previousMs - 1 : null
  return [...groups.values()].sort((a, b) => b.recentN - a.recentN)
}

export function computeProfileStats(agg: StatsAggregates): ProfileStats {
  const { today } = agg
  const byDay = dayMap(agg.days)
  const sumDays = (days: readonly string[], pick: (d: DayRow) => number) => days.reduce((s, day) => s + (byDay.has(day) ? pick(byDay.get(day)!) : 0), 0)

  const kind = (k: AttemptKind) => agg.kinds.find((r) => r.kind === k) ?? { kind: k, total: 0, correct: 0, ms: 0 }
  const totalAnswers = agg.kinds.reduce((s, r) => s + r.total, 0)
  const totalCorrect = agg.kinds.reduce((s, r) => s + r.correct, 0)
  const practiceMs = agg.kinds.reduce((s, r) => s + r.ms, 0)

  const week = lastDays(today, 7)
  const prevWeek = lastDays(shiftDay(today, -7), 7)

  const solvedTasks = agg.tasks.filter((t) => t.solved)
  const byDifficulty: Record<TaskDifficulty, number> = { easy: 0, medium: 0, hard: 0 }
  for (const t of solvedTasks) byDifficulty[t.difficulty ?? 'medium']++
  const firstTry = agg.tasks.filter((t) => t.firstTry).length

  const groups = speedStats(agg.speed)
  // recent window + today: answers per practice minute
  const recentDays = lastDays(today, SPEED_WINDOW_DAYS + 1)
  const recentAnswers = sumDays(recentDays, (d) => d.total)
  const recentMinutes = sumDays(recentDays, (d) => d.timeMs) / 60_000
  const itemsPerMinute = recentAnswers >= SPEED_MIN_SAMPLE && recentMinutes >= 1 ? recentAnswers / recentMinutes : null

  const days30 = lastDays(today, SERIES_DAYS)
  const active30 = days30.filter((d) => (byDay.get(d)?.total ?? 0) > 0).length
  const days14 = lastDays(shiftDay(today, -1), 14)
  const active14 = days14.filter((d) => (byDay.get(d)?.total ?? 0) > 0).length
  const streak = computeStreak(agg.goalDays, today)

  const speedByDay = new Map(agg.speedDaily.map((r) => [r.day, r]))
  const heat = lastDays(today, HEAT_DAYS).map((day) => {
    const d = byDay.get(day)
    return { day, total: d?.total ?? 0, xp: d?.xp ?? 0, minutes: Math.round((d?.timeMs ?? 0) / 60_000), goalMet: d?.goalMet ?? false }
  })

  const levels = agg.levels.filter((l): l is typeof l & { level: string } => l.level !== null)
  return {
    empty: totalAnswers === 0 && agg.results.lessonsDone === 0 && agg.readingMs === 0 && agg.xp === 0,
    xp: agg.xp,
    hours: { totalMs: practiceMs + agg.readingMs, practiceMs, readingMs: agg.readingMs, weekMs: sumDays(week, (d) => d.timeMs), prevWeekMs: sumDays(prevWeek, (d) => d.timeMs) },
    answers: rate(totalAnswers, totalCorrect),
    questions: rate(kind('quiz').total, kind('quiz').correct),
    cards: rate(kind('flashcard').total, kind('flashcard').correct),
    byKind: (['quiz', 'flashcard', 'task'] as const).map((k) => ({ kind: k, ...rate(kind(k).total, kind(k).correct) })),
    byLevel: levels.map((l) => ({ level: l.level, solved: l.solved, ...rate(l.total, l.correct) })),
    tasks: { attempted: agg.tasks.length, solved: solvedTasks.length, firstTry, firstTryRate: agg.tasks.length > 0 ? firstTry / agg.tasks.length : null, byDifficulty },
    memory: { ...agg.memory, longTermShare: agg.memory.cards > 0 ? agg.memory.longTerm / agg.memory.cards : null },
    speed: { groups, question: groups.find((g) => g.group === 'quiz') ?? null, itemsPerMinute },
    consistency: { active30, ratio30: active30 / SERIES_DAYS, active14, streak },
    results: agg.results,
    records: { ...agg.records, longestStreak: streak.best },
    series: {
      heat,
      xp30: days30.map((day) => ({ day, xp: byDay.get(day)?.xp ?? 0 })),
      speed30: days30.map((day) => {
        const r = speedByDay.get(day)
        return { day, medianMs: r && r.n >= 3 ? r.medianMs : null, n: r?.n ?? 0 }
      }),
    },
  }
}

// Strong / weak topics: enough answers to judge (MIN_TOPIC_ANSWERS); weak = accuracy < 70%, or < 85% with 3+ open
// mistakes; strong = 85%+ and not weak.
export const MIN_TOPIC_ANSWERS = 5
export const WEAK_BELOW = 0.7
export const STRONG_FROM = 0.85

export interface TopicStat {
  chapterId: string
  title: string
  total: number
  correct: number
  open: number
  accuracy: number | null
}

export function splitTopics<T extends TopicStat>(topics: readonly T[], limit = 5): { strong: T[]; weak: T[] } {
  const judged = topics.filter((t) => t.total >= MIN_TOPIC_ANSWERS && t.accuracy !== null)
  const weak = judged
    .filter((t) => t.accuracy! < WEAK_BELOW || (t.accuracy! < STRONG_FROM && t.open >= 3))
    .sort((a, b) => a.accuracy! - b.accuracy! || b.open - a.open)
    .slice(0, limit)
  const weakIds = new Set(weak.map((t) => t.chapterId))
  const strong = judged
    .filter((t) => !weakIds.has(t.chapterId) && t.accuracy! >= STRONG_FROM)
    .sort((a, b) => b.accuracy! - a.accuracy! || b.total - a.total)
    .slice(0, limit)
  return { strong, weak }
}

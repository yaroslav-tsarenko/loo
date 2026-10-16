// «+1% щодня» coach: ONE concrete micro-goal per day, ~1% harder than the learner's own recent baseline, aimed at the
// weakest dimension. Pure: the server freezes the goal for the day (src/server/stats/coach.ts) and measures progress.
//
// Dimensions and how weak each one is («health», 0 = weakest … 1 = fine; the lowest eligible one wins):
// · start        — no answers ever: the first 5 answers (pretesting: trying before knowing already teaches)
// · retention    — ≥ 3 FSRS cards fade today: health 1 − due/30 (spaced repetition: review right before forgetting)
// · accuracy     — weakest topic with ≥ 5 answers and accuracy < 75%: health = accuracy (retrieval where it hurts)
// · consistency  — < 10 active days of the last 14: health = active/14 (distributed practice, habit loop)
// · coverage     — no new lesson for ≥ 3 days and the path has one: health 0.9 − 0.04·days (chunking new material)
// · speed        — accuracy ≥ 80% and ≥ 10 timed answers: health = previous/recent median × 0.9 (automaticity)
// · volume       — always eligible fallback, health 0.88: one more answer than the daily average
// Ties go to the order above. Targets are always achievable today (capped by what is available).

import { shiftDay } from '../day'
import { MIN_TOPIC_ANSWERS } from './metrics'
import type { DayRow, SpeedGroup, SpeedRow } from './types'

export type CoachDimension = 'start' | 'retention' | 'accuracy' | 'consistency' | 'coverage' | 'speed' | 'volume'

export const COACH_PRIORITY: readonly CoachDimension[] = ['start', 'retention', 'accuracy', 'consistency', 'coverage', 'speed', 'volume']

export type CoachMetric =
  | { type: 'answers' }
  | { type: 'cards' }
  | { type: 'newLessons' }
  | { type: 'speed'; group: SpeedGroup; minCount: number }
  | { type: 'topicCorrect'; chapterId: string }
  | { type: 'mistakeFixes'; chapterId: string }

export interface CoachGoal {
  v: 1
  day: string
  dimension: CoachDimension
  metric: CoachMetric
  // answers / cards / lessons / fixes to reach, or the median ms to beat (speed: lower is better)
  target: number
  // what the goal is 1% better than: average per active day, current median ms, topic accuracy 0..1, days since…
  baseline: number
  topic?: { chapterId: string; title: string; accuracy: number; open: number }
  health: number
}

export interface CoachTopic {
  chapterId: string
  title: string
  total: number
  correct: number
  open: number
}

export interface CoachInput {
  today: string
  // daily activity, any range that covers the last 28 days (today included or not)
  days: readonly DayRow[]
  speed: readonly SpeedRow[]
  topics: readonly CoachTopic[]
  dueToday: number
  lifetimeAnswers: number
  hasNextLesson: boolean
  daysSinceNewLesson: number | null
  dailyGoal: number
}

export const ONE_PERCENT = 0.01
export const START_TARGET = 5
export const BASELINE_DAYS = 14
export const SPEED_MIN_ANSWERS = 10
export const SPEED_TODAY_MIN = 5

// +1%, but never less than +1 whole unit: «+1 питання до твоїх 18 середніх».
export function onePercentMore(baseline: number): number {
  return Math.max(Math.round(baseline) + 1, Math.ceil(baseline * (1 + ONE_PERCENT)))
}

// 1% faster, at least 0.1 s, on a 0.1 s grid: «відповідай на 0.1 с швидше».
export function onePercentFaster(medianMs: number): number {
  const delta = Math.max(100, Math.round((medianMs * ONE_PERCENT) / 100) * 100)
  return Math.max(100, Math.round((medianMs - delta) / 100) * 100)
}

export interface Baseline {
  activeDays: number
  answersPerDay: number
  cardsPerDay: number
  accuracy: number | null
}

// The learner's recent normal: the BASELINE_DAYS days before today (today is what we're improving).
export function baselineOf(days: readonly DayRow[], today: string): Baseline {
  const from = shiftDay(today, -BASELINE_DAYS)
  const window = days.filter((d) => d.day >= from && d.day < today && d.total > 0)
  const answers = window.reduce((s, d) => s + d.total, 0)
  const correct = window.reduce((s, d) => s + d.correct, 0)
  const cards = window.reduce((s, d) => s + d.cards, 0)
  const n = window.length
  return { activeDays: n, answersPerDay: n > 0 ? answers / n : 0, cardsPerDay: n > 0 ? cards / n : 0, accuracy: answers > 0 ? correct / answers : null }
}

interface Candidate {
  dimension: CoachDimension
  health: number
  build: () => Omit<CoachGoal, 'v' | 'day' | 'dimension' | 'health'>
}

export const ACCURACY_WEAK = 0.75

export function weakestTopic(topics: readonly CoachTopic[]): (CoachTopic & { accuracy: number }) | null {
  let best: (CoachTopic & { accuracy: number }) | null = null
  for (const t of topics) {
    if (t.total < MIN_TOPIC_ANSWERS) continue
    const accuracy = t.correct / t.total
    if (accuracy >= ACCURACY_WEAK) continue
    if (!best || accuracy < best.accuracy || (accuracy === best.accuracy && t.open > best.open)) best = { ...t, accuracy }
  }
  return best
}

function speedCandidate(speed: readonly SpeedRow[]): { group: SpeedGroup; recent: number; previous: number | null; n: number } | null {
  let pick: { group: SpeedGroup; recent: number; previous: number | null; n: number; score: number } | null = null
  for (const r of speed) {
    if (r.window !== 'recent' || r.n < SPEED_MIN_ANSWERS || r.medianMs < 1500) continue
    // per-mode groups only (a quiz-wide median mixes «один варіант» with «що виведе код»)
    if (r.group === 'quiz') continue
    const prev = speed.find((p) => p.group === r.group && p.window === 'previous' && p.n >= SPEED_TODAY_MIN)
    const previous = prev ? prev.medianMs : null
    // slowest relative to its own past first, then the most practised group
    const score = (previous ? r.medianMs / previous : 1) * 1000 + r.n
    if (!pick || score > pick.score) pick = { group: r.group, recent: r.medianMs, previous, n: r.n, score }
  }
  return pick ? { group: pick.group, recent: pick.recent, previous: pick.previous, n: pick.n } : null
}

export function candidates(input: CoachInput): Candidate[] {
  const base = baselineOf(input.days, input.today)
  if (input.lifetimeAnswers === 0) {
    return [{ dimension: 'start', health: 0, build: () => ({ metric: { type: 'answers' }, target: START_TARGET, baseline: 0 }) }]
  }
  const out: Candidate[] = []
  if (input.dueToday >= 3) {
    out.push({
      dimension: 'retention',
      health: Math.max(0, 1 - input.dueToday / 30),
      build: () => ({ metric: { type: 'cards' }, target: Math.min(input.dueToday, 30, Math.max(5, onePercentMore(base.cardsPerDay))), baseline: Math.round(base.cardsPerDay) }),
    })
  }
  const weak = weakestTopic(input.topics)
  if (weak) {
    const topic = { chapterId: weak.chapterId, title: weak.title, accuracy: weak.accuracy, open: weak.open }
    out.push({
      dimension: 'accuracy',
      health: weak.accuracy,
      build: () =>
        weak.open > 0
          ? { metric: { type: 'mistakeFixes', chapterId: weak.chapterId }, target: Math.min(weak.open, 2), baseline: weak.accuracy, topic }
          : { metric: { type: 'topicCorrect', chapterId: weak.chapterId }, target: 3, baseline: weak.accuracy, topic },
    })
  }
  if (base.activeDays < 10) {
    out.push({
      dimension: 'consistency',
      health: base.activeDays / BASELINE_DAYS,
      build: () => ({
        metric: { type: 'answers' },
        target: base.answersPerDay > 0 ? Math.max(3, Math.min(input.dailyGoal, Math.round(base.answersPerDay / 2))) : START_TARGET,
        baseline: base.activeDays,
      }),
    })
  }
  if (input.hasNextLesson && (input.daysSinceNewLesson === null || input.daysSinceNewLesson >= 3)) {
    const days = input.daysSinceNewLesson
    out.push({
      dimension: 'coverage',
      health: days === null ? 0.6 : 0.9 - 0.04 * Math.min(days, 10),
      build: () => ({ metric: { type: 'newLessons' }, target: 1, baseline: days ?? -1 }),
    })
  }
  const speed = base.accuracy !== null && base.accuracy >= 0.8 ? speedCandidate(input.speed) : null
  if (speed) {
    out.push({
      dimension: 'speed',
      health: speed.previous ? Math.min(1, speed.previous / speed.recent) * 0.9 : 0.85,
      build: () => ({ metric: { type: 'speed', group: speed.group, minCount: SPEED_TODAY_MIN }, target: onePercentFaster(speed.recent), baseline: speed.recent }),
    })
  }
  out.push({ dimension: 'volume', health: 0.88, build: () => ({ metric: { type: 'answers' }, target: onePercentMore(base.answersPerDay), baseline: Math.round(base.answersPerDay) }) })
  return out
}

export function chooseDimension(list: readonly Candidate[]): Candidate {
  return [...list].sort((a, b) => a.health - b.health || COACH_PRIORITY.indexOf(a.dimension) - COACH_PRIORITY.indexOf(b.dimension))[0]!
}

export function planCoachGoal(input: CoachInput): CoachGoal {
  const pick = chooseDimension(candidates(input))
  return { v: 1, day: input.today, dimension: pick.dimension, health: Math.round(pick.health * 1000) / 1000, ...pick.build() }
}

// ── Progress ─────────────────────────────────────────────────────────────────────────────────────────────────────

// What was measured for the goal's day: a count, or for speed the median ms (null until enough answers) and n.
export interface CoachMeasure {
  value: number | null
  n?: number
}

export interface CoachProgress {
  // the number shown: count so far, or today's median ms
  value: number | null
  ratio: number
  done: boolean
  // speed: timed answers so far today
  n?: number
}

export function coachProgress(goal: CoachGoal, m: CoachMeasure): CoachProgress {
  if (goal.metric.type === 'speed') {
    const n = m.n ?? 0
    const min = goal.metric.minCount
    if (n < min || m.value === null) return { value: m.value, ratio: Math.min(0.5, (n / min) * 0.5), done: false, n }
    const done = m.value <= goal.target
    return { value: m.value, ratio: done ? 1 : 0.5 + 0.5 * Math.max(0, Math.min(1, goal.target / m.value)), done, n }
  }
  const value = m.value ?? 0
  return { value, ratio: goal.target > 0 ? Math.min(1, value / goal.target) : 1, done: value >= goal.target }
}

// ── 1% streak (compounding) ──────────────────────────────────────────────────────────────────────────────────────

export interface CoachDay {
  day: string
  done: boolean
}

// Consecutive days with the goal done, ending today (if done) or yesterday — like the daily streak.
export function onePercentStreak(history: readonly CoachDay[], today: string): number {
  const done = new Set(history.filter((h) => h.done).map((h) => h.day))
  let cursor = done.has(today) ? today : shiftDay(today, -1)
  let n = 0
  while (done.has(cursor)) {
    n++
    cursor = shiftDay(cursor, -1)
  }
  return n
}

// 1.01^n: what n days of +1% compound to (365 days → ×37.8).
export function compound(days: number, step = ONE_PERCENT): number {
  return Math.pow(1 + step, Math.max(0, days))
}

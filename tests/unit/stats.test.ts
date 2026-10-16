import { describe, expect, it } from 'vitest'
import { shiftDay } from '@/progress/day'
import {
  baselineOf,
  candidates,
  chooseDimension,
  coachProgress,
  compound,
  computeProfileStats,
  HEAT_DAYS,
  onePercentFaster,
  onePercentMore,
  onePercentStreak,
  planCoachGoal,
  splitTopics,
  statTiers,
  tierFor,
  type CoachInput,
  type DayRow,
  type StatsAggregates,
} from '@/progress/stats'

const TODAY = '2026-10-16'

function day(offset: number, over: Partial<DayRow> = {}): DayRow {
  return { day: shiftDay(TODAY, offset), total: 0, correct: 0, cards: 0, quizzes: 0, tasks: 0, xp: 0, timeMs: 0, goalMet: false, ...over }
}

function emptyAgg(over: Partial<StatsAggregates> = {}): StatsAggregates {
  return {
    today: TODAY,
    xp: 0,
    days: [],
    goalDays: [],
    kinds: [],
    levels: [],
    speed: [],
    speedDaily: [],
    topics: [],
    tasks: [],
    memory: { cards: 0, reviewing: 0, longTerm: 0, dueToday: 0, lapses: 0 },
    results: { testsPassed: 0, testsPerfect: 0, examsPassed: 0, testedOut: 0, lessonsDone: 0, perfectLessons: 0, lastNewLessonAt: null },
    records: { bestDayXp: null, bestDayAnswers: null, longestCombo: 0, fastestPerfectLessonMs: null },
    readingMs: 0,
    ...over,
  }
}

// 10 active days of the last 14, 18 answers each, 90% correct — a steady learner
const steadyDays = Array.from({ length: 10 }, (_, i) => day(-(i + 1), { total: 18, correct: 16, cards: 4, quizzes: 14, xp: 120, timeMs: 15 * 60_000 }))

function input(over: Partial<CoachInput> = {}): CoachInput {
  return { today: TODAY, days: steadyDays, speed: [], topics: [], dueToday: 0, lifetimeAnswers: 500, hasNextLesson: false, daysSinceNewLesson: 0, dailyGoal: 20, ...over }
}

describe('statistics engine', () => {
  it('gives a new user honest zeros, a full heatmap and empty series', () => {
    const s = computeProfileStats(emptyAgg())
    expect(s.empty).toBe(true)
    expect(s.answers).toEqual({ total: 0, correct: 0, rate: null })
    expect(s.hours.totalMs).toBe(0)
    expect(s.tasks).toMatchObject({ attempted: 0, solved: 0, firstTryRate: null })
    expect(s.speed.question).toBeNull()
    expect(s.speed.itemsPerMinute).toBeNull()
    expect(s.series.heat).toHaveLength(HEAT_DAYS)
    expect(s.series.heat.at(-1)?.day).toBe(TODAY)
    expect(s.series.heat.every((d) => d.total === 0)).toBe(true)
    expect(s.series.xp30).toHaveLength(30)
    expect(s.consistency).toMatchObject({ active30: 0, ratio30: 0, streak: { current: 0, best: 0 } })
    expect(s.memory.longTermShare).toBeNull()
  })

  it('computes hours, tasks, accuracy, speed trend and consistency from aggregates', () => {
    const s = computeProfileStats(
      emptyAgg({
        xp: 900,
        days: [day(0, { total: 10, correct: 9, timeMs: 5 * 60_000 }), day(-3, { total: 20, correct: 15, timeMs: 10 * 60_000 }), day(-10, { total: 30, correct: 20, timeMs: 20 * 60_000 })],
        goalDays: [shiftDay(TODAY, -1), TODAY],
        kinds: [
          { kind: 'quiz', total: 40, correct: 30, ms: 30 * 60_000 },
          { kind: 'flashcard', total: 20, correct: 14, ms: 10 * 60_000 },
          { kind: 'task', total: 6, correct: 3, ms: 20 * 60_000 },
        ],
        tasks: [
          { unitId: 'a', difficulty: 'easy', solved: true, firstTry: true },
          { unitId: 'b', difficulty: 'hard', solved: true, firstTry: false },
          { unitId: 'c', difficulty: null, solved: false, firstTry: false },
        ],
        speed: [
          { group: 'quiz', window: 'recent', medianMs: 8000, n: 30 },
          { group: 'quiz', window: 'previous', medianMs: 10000, n: 12 },
          { group: 'quiz:output', window: 'recent', medianMs: 12000, n: 3 },
        ],
        readingMs: 30 * 60_000,
        memory: { cards: 40, reviewing: 20, longTerm: 10, dueToday: 6, lapses: 2 },
      }),
    )
    expect(s.empty).toBe(false)
    expect(s.hours).toMatchObject({ practiceMs: 60 * 60_000, readingMs: 30 * 60_000, totalMs: 90 * 60_000, weekMs: 15 * 60_000, prevWeekMs: 20 * 60_000 })
    expect(s.answers.rate).toBeCloseTo(47 / 66)
    expect(s.questions).toEqual({ total: 40, correct: 30, rate: 0.75 })
    expect(s.tasks).toMatchObject({ attempted: 3, solved: 2, firstTry: 1, byDifficulty: { easy: 1, medium: 0, hard: 1 } })
    expect(s.tasks.firstTryRate).toBeCloseTo(1 / 3)
    expect(s.speed.question).toMatchObject({ recentMs: 8000, previousMs: 10000 })
    expect(s.speed.question?.trend).toBeCloseTo(-0.2)
    // too few answers in a window → no median
    expect(s.speed.groups.find((g) => g.group === 'quiz:output')?.recentMs).toBeNull()
    // 60 answers in 35 minutes over the recent window
    expect(s.speed.itemsPerMinute).toBeCloseTo(60 / 35)
    expect(s.consistency).toMatchObject({ active30: 3, active14: 2, streak: { current: 2, best: 2, todayCounted: true } })
    expect(s.memory.longTermShare).toBe(0.25)
  })

  it('splits strong and weak topics once there are enough answers', () => {
    const t = (chapterId: string, total: number, correct: number, open = 0) => ({ chapterId, title: chapterId, total, correct, open, accuracy: total ? correct / total : null })
    const { strong, weak } = splitTopics([t('closures', 10, 4, 2), t('scope', 10, 9), t('this', 3, 0), t('arrays', 20, 19), t('promises', 10, 8, 3), t('dom', 8, 7, 3)])
    expect(weak.map((w) => w.chapterId)).toEqual(['closures', 'promises'])
    expect(strong.map((s) => s.chapterId)).toEqual(['arrays', 'scope', 'dom'])
  })

  it('ranks skill titles with progress to the next one', () => {
    expect(tierFor('speed', 12)).toMatchObject({ id: 'fox', next: { id: 'cheetah', at: 10 } })
    expect(tierFor('speed', 12).progress).toBeCloseTo(0.8)
    expect(tierFor('speed', 4).id).toBe('lightning')
    expect(tierFor('accuracy', 92)).toMatchObject({ id: 'hawk', next: null, progress: 1 })
    expect(tierFor('memory', 30).progress).toBeCloseTo(0.5)
    expect(tierFor('rhythm', null)).toMatchObject({ index: 0, progress: 0 })
    expect(statTiers(computeProfileStats(emptyAgg())).map((t) => t.id)).toEqual(['turtle', 'scout', 'wanderer', 'goldfish'])
  })
})

describe('«+1% щодня» coach', () => {
  it('applies the 1% rule: at least one more unit, 1% faster on a 0.1 s grid', () => {
    expect(onePercentMore(18)).toBe(19)
    expect(onePercentMore(0)).toBe(1)
    expect(onePercentMore(250)).toBe(253)
    expect(onePercentFaster(8290)).toBe(8200)
    expect(onePercentFaster(30_000)).toBe(29_700)
    expect(onePercentFaster(300)).toBe(200)
  })

  it('takes the baseline from the 14 days before today', () => {
    const days = [day(0, { total: 100, correct: 100 }), day(-1, { total: 10, correct: 5, cards: 2 }), day(-14, { total: 20, correct: 20, cards: 4 }), day(-15, { total: 500, correct: 0 })]
    expect(baselineOf(days, TODAY)).toEqual({ activeDays: 2, answersPerDay: 15, cardsPerDay: 3, accuracy: 25 / 30 })
  })

  it('starts a brand-new learner with 5 answers', () => {
    expect(planCoachGoal(input({ days: [], lifetimeAnswers: 0 }))).toMatchObject({ dimension: 'start', metric: { type: 'answers' }, target: 5, baseline: 0 })
  })

  it('falls back to +1 answer over the daily average', () => {
    expect(planCoachGoal(input())).toMatchObject({ dimension: 'volume', target: 19, baseline: 18 })
  })

  it('picks the weakest dimension: a weak topic beats fading cards beats volume', () => {
    const topics = [
      { chapterId: 'closures', title: 'Замикання', total: 13, correct: 7, open: 3 },
      { chapterId: 'this', title: 'this', total: 4, correct: 0, open: 1 },
    ]
    const goal = planCoachGoal(input({ topics, dueToday: 6 }))
    expect(goal).toMatchObject({ dimension: 'accuracy', metric: { type: 'mistakeFixes', chapterId: 'closures' }, target: 2, topic: { title: 'Замикання' } })
    expect(goal.topic?.accuracy).toBeCloseTo(7 / 13)
    // without mistakes to fix: correct answers in the topic
    expect(planCoachGoal(input({ topics: [{ ...topics[0]!, open: 0 }] })).metric).toEqual({ type: 'topicCorrect', chapterId: 'closures' })
    // fading cards: up to what is due, at least 5 (or all of them)
    expect(planCoachGoal(input({ dueToday: 6 }))).toMatchObject({ dimension: 'retention', metric: { type: 'cards' }, target: 5 })
    expect(planCoachGoal(input({ dueToday: 4 }))).toMatchObject({ dimension: 'retention', target: 4 })
    // three fading cards are not the weakest spot of a steady learner
    expect(planCoachGoal(input({ dueToday: 3 })).dimension).toBe('volume')
  })

  it('asks for rhythm when the learner skips days, and for a new lesson when coverage stalls', () => {
    const sparse = [day(-2, { total: 30, correct: 28 }), day(-9, { total: 10, correct: 9 })]
    expect(planCoachGoal(input({ days: sparse }))).toMatchObject({ dimension: 'consistency', target: 10, baseline: 2 })
    expect(planCoachGoal(input({ days: [] }))).toMatchObject({ dimension: 'consistency', target: 5, baseline: 0 })
    expect(planCoachGoal(input({ hasNextLesson: true, daysSinceNewLesson: 7 }))).toMatchObject({ dimension: 'coverage', metric: { type: 'newLessons' }, target: 1, baseline: 7 })
    expect(planCoachGoal(input({ hasNextLesson: true, daysSinceNewLesson: 1 })).dimension).toBe('volume')
  })

  it('asks for speed only when answers are accurate, on the group that slowed down most', () => {
    const speed = [
      { group: 'quiz:output' as const, window: 'recent' as const, medianMs: 12_000, n: 20 },
      { group: 'quiz:output' as const, window: 'previous' as const, medianMs: 10_000, n: 20 },
      { group: 'quiz:single' as const, window: 'recent' as const, medianMs: 4_000, n: 40 },
      { group: 'quiz' as const, window: 'recent' as const, medianMs: 6_000, n: 60 },
    ]
    const goal = planCoachGoal(input({ speed }))
    expect(goal).toMatchObject({ dimension: 'speed', metric: { type: 'speed', group: 'quiz:output', minCount: 5 }, baseline: 12_000, target: 11_900 })
    const sloppy = steadyDays.map((d) => ({ ...d, correct: 10 }))
    expect(planCoachGoal(input({ speed, days: sloppy })).dimension).toBe('volume')
  })

  it('breaks ties by priority', () => {
    const list = candidates(input({ dueToday: 30, topics: [{ chapterId: 'x', title: 'x', total: 10, correct: 0, open: 0 }] }))
    expect(list.filter((c) => c.health === 0).map((c) => c.dimension)).toEqual(['retention', 'accuracy'])
    expect(chooseDimension(list).dimension).toBe('retention')
  })

  it('measures progress: counts reach the target, speed needs enough answers under the target', () => {
    const count = planCoachGoal(input())
    expect(coachProgress(count, { value: 10 })).toMatchObject({ value: 10, done: false })
    expect(coachProgress(count, { value: 10 }).ratio).toBeCloseTo(10 / 19)
    expect(coachProgress(count, { value: 25 })).toEqual({ value: 25, ratio: 1, done: true })
    const speed = { ...count, metric: { type: 'speed' as const, group: 'quiz:output' as const, minCount: 5 }, target: 9000, baseline: 9200 }
    expect(coachProgress(speed, { value: 8000, n: 2 })).toMatchObject({ done: false, ratio: 0.2, n: 2 })
    expect(coachProgress(speed, { value: 8900, n: 6 })).toMatchObject({ done: true, ratio: 1 })
    expect(coachProgress(speed, { value: 10_000, n: 6 })).toMatchObject({ done: false, ratio: 0.95 })
  })

  it('compounds the 1% streak', () => {
    const history = [-4, -2, -1, 0].map((d) => ({ day: shiftDay(TODAY, d), done: true }))
    expect(onePercentStreak(history, TODAY)).toBe(3)
    // today not done yet: the streak still stands from yesterday
    expect(onePercentStreak(history.slice(0, 3), TODAY)).toBe(2)
    expect(onePercentStreak([{ day: shiftDay(TODAY, -2), done: true }], TODAY)).toBe(0)
    expect(compound(0)).toBe(1)
    expect(compound(7)).toBeCloseTo(1.0721, 4)
    expect(compound(365)).toBeCloseTo(37.78, 2)
  })
})

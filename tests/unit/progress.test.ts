import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS } from '@/progress/achievements/catalog'
import { emptyStats, holds, progressOf } from '@/progress/achievements/dsl'
import { newlyUnlocked } from '@/progress/achievements/evaluate'
import { dayKey, DAY, HOUR, shiftDay } from '@/progress/day'
import { applyAttempt, type EngineState } from '@/progress/engine'
import { levelInfo, rankFor, xpToReach } from '@/progress/levels'
import { applyMistake, MISTAKE_MIN_GAP, nextEligibleAt } from '@/progress/mistakes'
import { isDue, previewIntervals, review } from '@/progress/srs'
import { computeStreak } from '@/progress/streak'
import type { AttemptInput } from '@/progress/types'
import { rawXp, xpForAttempt } from '@/progress/xp'

const T0 = new Date(2026, 8, 28, 12, 0, 0).getTime()

function attempt(partial: Partial<AttemptInput>): AttemptInput {
  return { unitId: 'u1', kind: 'flashcard', outcome: 'good', level: 'middle', hintsUsed: 0, at: T0, ...partial }
}

const fresh = { everCorrect: false, lastCorrectDay: null }

describe('xp', () => {
  it('weights by level and outcome', () => {
    expect(rawXp(attempt({ level: 'junior' }))).toBe(10)
    expect(rawXp(attempt({ level: 'senior' }))).toBe(25)
    expect(rawXp(attempt({ level: 'techlead', outcome: 'hard' }))).toBe(18)
    expect(rawXp(attempt({ outcome: 'again' }))).toBe(0)
    expect(rawXp(attempt({ level: null }))).toBe(12)
  })

  it('handles quizzes and tasks', () => {
    expect(rawXp(attempt({ kind: 'quiz', outcome: 'correct', level: 'middle', quizMode: 'output' }))).toBe(18)
    expect(rawXp(attempt({ kind: 'quiz', outcome: 'wrong' }))).toBe(0)
    expect(rawXp(attempt({ kind: 'task', outcome: 'solved', difficulty: 'hard' }))).toBe(80)
    expect(rawXp(attempt({ kind: 'task', outcome: 'solved', difficulty: 'medium', hintsUsed: 2 }))).toBe(30)
    expect(rawXp(attempt({ kind: 'task', outcome: 'solved', difficulty: 'easy', hintsUsed: 9 }))).toBe(12)
    expect(rawXp(attempt({ kind: 'task', outcome: 'failed', difficulty: 'hard' }))).toBe(0)
  })

  it('gives less for repeats and nothing for the same day', () => {
    expect(xpForAttempt(attempt({ level: 'senior' }), fresh)).toBe(25)
    expect(xpForAttempt(attempt({ level: 'senior' }), { everCorrect: true, lastCorrectDay: '2026-09-01' })).toBe(10)
    expect(xpForAttempt(attempt({ level: 'senior' }), { everCorrect: true, lastCorrectDay: dayKey(T0) })).toBe(0)
  })
})

describe('levels and ranks', () => {
  it('grows thresholds monotonically', () => {
    for (let l = 1; l < 60; l++) expect(xpToReach(l + 1)).toBeGreaterThan(xpToReach(l))
    expect(xpToReach(1)).toBe(0)
  })

  it('computes level, rank and progress', () => {
    expect(levelInfo(0)).toMatchObject({ level: 1, floor: 0, progress: 0 })
    const info = levelInfo(xpToReach(5) + 1)
    expect(info.level).toBe(5)
    expect(info.rank.title).toBe('Junior')
    expect(info.progress).toBeGreaterThan(0)
    expect(info.progress).toBeLessThan(1)
    expect(rankFor(12).title).toBe('Middle')
    expect(rankFor(50).title).toBe('Principal')
    expect(levelInfo(xpToReach(50)).nextRank).toBeNull()
  })
})

describe('days and streaks', () => {
  it('starts the day at 04:00', () => {
    const lateNight = new Date(2026, 8, 29, 2, 30).getTime()
    expect(dayKey(lateNight)).toBe('2026-09-28')
    expect(dayKey(new Date(2026, 8, 29, 4, 1).getTime())).toBe('2026-09-29')
    expect(shiftDay('2026-03-01', -1)).toBe('2026-02-28')
    expect(shiftDay('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('counts current and best streaks', () => {
    const days = ['2026-09-20', '2026-09-21', '2026-09-22', '2026-09-25', '2026-09-26', '2026-09-27']
    expect(computeStreak(days, '2026-09-28')).toEqual({ current: 3, best: 3, todayCounted: false })
    expect(computeStreak([...days, '2026-09-28'], '2026-09-28')).toEqual({ current: 4, best: 4, todayCounted: true })
    expect(computeStreak(days, '2026-09-30').current).toBe(0)
    expect(computeStreak([], '2026-09-28')).toEqual({ current: 0, best: 0, todayCounted: false })
  })
})

describe('mistakes', () => {
  it('adds on a wrong answer and resolves after two spaced correct answers', () => {
    const a = applyMistake(null, 'u', 'quiz', false, T0)
    expect(a).toMatchObject({ added: true, resolved: false })
    const b = applyMistake(a.state, 'u', 'quiz', true, T0 + HOUR)
    expect(b.state?.correctStreak).toBe(1)
    expect(nextEligibleAt(b.state!)).toBe(T0 + HOUR + MISTAKE_MIN_GAP)
    const tooSoon = applyMistake(b.state, 'u', 'quiz', true, T0 + 2 * HOUR)
    expect(tooSoon).toMatchObject({ resolved: false })
    expect(tooSoon.state?.correctStreak).toBe(1)
    const done = applyMistake(tooSoon.state, 'u', 'quiz', true, T0 + HOUR + DAY)
    expect(done.resolved).toBe(true)
    expect(done.state?.resolvedAt).toBe(T0 + HOUR + DAY)
  })

  it('resets the streak on a new error and reopens resolved mistakes', () => {
    const a = applyMistake(null, 'u', 'flashcard', false, T0)
    const b = applyMistake(a.state, 'u', 'flashcard', true, T0 + HOUR)
    const c = applyMistake(b.state, 'u', 'flashcard', false, T0 + 2 * HOUR)
    expect(c.state).toMatchObject({ correctStreak: 0, wrongCount: 2 })
    expect(c.added).toBe(false)
    const d = applyMistake({ ...c.state!, resolvedAt: T0 }, 'u', 'flashcard', false, T0 + 3 * HOUR)
    expect(d).toMatchObject({ added: true })
    expect(d.state?.resolvedAt).toBeNull()
  })

  it('ignores correct answers for units that were never wrong', () => {
    expect(applyMistake(null, 'u', 'quiz', true, T0)).toEqual({ state: null, added: false, resolved: false })
  })
})

describe('srs', () => {
  it('schedules longer intervals for better ratings', () => {
    const p = previewIntervals(null, T0)
    expect(p.again).toBeLessThan(p.hard)
    expect(p.hard).toBeLessThanOrEqual(p.good)
  })

  it('moves due forward after a good review and brings failed cards back soon', () => {
    const good = review(null, 'good', T0)
    expect(good.due).toBeGreaterThan(T0)
    expect(isDue(good, T0)).toBe(false)
    const later = review(review(good, 'good', good.due), 'good', good.due + 10 * DAY)
    expect(later.due - (good.due + 10 * DAY)).toBeGreaterThan(DAY)
    const lapse = review(later, 'again', later.due)
    expect(lapse.lapses).toBe(1)
    expect(lapse.due - later.due).toBeLessThan(DAY)
    expect(isDue(null, T0)).toBe(true)
  })
})

describe('achievements', () => {
  it('evaluates declarative conditions', () => {
    const stats = emptyStats()
    stats['streak.current'] = 7
    expect(holds({ metric: 'streak.current', gte: 7 }, stats)).toBe(true)
    expect(holds({ all: [{ metric: 'streak.current', gte: 7 }, { metric: 'cards.reviewed', gte: 1 }] }, stats)).toBe(false)
    expect(holds({ any: [{ metric: 'streak.current', gte: 7 }, { metric: 'cards.reviewed', gte: 1 }] }, stats)).toBe(true)
    expect(progressOf({ metric: 'cards.reviewed', gte: 100 }, { ...stats, 'cards.reviewed': 25 })).toBe(0.25)
  })

  it('unlocks only new achievements', () => {
    const stats = emptyStats()
    stats['chapters.studied'] = 1
    stats['streak.current'] = 7
    const unlocked = newlyUnlocked(stats, new Set(['streak-3']))
    expect(unlocked.map((a) => a.id).sort()).toEqual(['first-chapter', 'streak-7'])
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length)
  })
})

describe('engine', () => {
  const base: EngineState = { history: fresh, srs: null, mistake: null, totalXp: 0 }

  it('awards xp, schedules the card and levels up', () => {
    const r = applyAttempt(attempt({ level: 'techlead' }), { ...base, totalXp: xpToReach(2) - 10 })
    expect(r.xp).toBe(35)
    expect(r.srs).not.toBeNull()
    expect(r.effects.map((e) => e.type)).toEqual(['xp', 'level-up'])
  })

  it('adds a mistake on "again" and resolves with bonus later', () => {
    const wrong = applyAttempt(attempt({ outcome: 'again' }), base)
    expect(wrong.xp).toBe(0)
    expect(wrong.effects.map((e) => e.type)).toEqual(['mistake-added'])
    const first = applyAttempt(attempt({ at: T0 + HOUR }), { ...base, mistake: wrong.mistake })
    const second = applyAttempt(attempt({ at: T0 + 2 * DAY }), { ...base, mistake: first.mistake, history: { everCorrect: true, lastCorrectDay: dayKey(T0 + HOUR) } })
    expect(second.effects.map((e) => e.type)).toContain('mistake-resolved')
    expect(second.xp).toBe(Math.round(15 * 0.4) + 5)
  })

  it('does not touch srs for quizzes', () => {
    const r = applyAttempt(attempt({ kind: 'quiz', outcome: 'wrong' }), base)
    expect(r.srs).toBeNull()
    expect(r.correct).toBe(false)
  })
})

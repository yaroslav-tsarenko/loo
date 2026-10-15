import { describe, expect, it } from 'vitest'
import { BUDGETS, budgetFor, missionRatio, planMission, stepProgress, type MissionInput } from '@/progress/mission'

const base: MissionInput = {
  budget: 20,
  day: '2026-10-15',
  weekday: 4,
  due: 12,
  newCards: 50,
  mistakes: 6,
  quizzes: 80,
  tasks: { easy: 5, medium: 5, hard: 5 },
  reels: 60,
  lessons: 40,
  nextChapter: { id: 'jsd-ch-05', title: 'Замикання', minutes: 40 },
}

const kinds = (budget: number, over: Partial<MissionInput> = {}) => planMission({ ...base, budget, ...over }).steps.map((s) => s.kind)

describe('mission planner', () => {
  it('scales the plan with the budget', () => {
    expect(kinds(10)).toEqual(['review', 'lessons', 'feed'])
    expect(kinds(20)).toEqual(['review', 'lessons', 'quiz', 'feed'])
    expect(kinds(30)).toEqual(['review', 'mistakes', 'lessons', 'quiz', 'task', 'feed'])
    expect(kinds(45)).toEqual(['review', 'mistakes', 'lessons', 'read', 'quiz', 'task', 'feed'])
    expect(kinds(60)).toContain('task')
  })

  it('never plans much more than the budget', () => {
    for (const b of BUDGETS) {
      const plan = planMission({ ...base, budget: b.minutes })
      const total = plan.steps.reduce((s, x) => s + x.minutes, 0)
      expect(total).toBeLessThanOrEqual(b.minutes + 1)
      expect(plan.steps.length).toBeGreaterThan(0)
    }
  })

  it('puts spaced review first and picks harder tasks for longer budgets', () => {
    expect(kinds(45)[0]).toBe('review')
    expect(planMission({ ...base, budget: 30 }).steps.find((s) => s.kind === 'task')?.difficulty).toBe('easy')
    expect(planMission({ ...base, budget: 60 }).steps.find((s) => s.kind === 'task')?.difficulty).toBe('medium')
    expect(planMission({ ...base, budget: 90 }).steps.find((s) => s.kind === 'task')?.difficulty).toBe('hard')
  })

  it('turns the quiz into a boss fight on Sunday', () => {
    expect(kinds(20, { weekday: 0 })).toContain('boss')
    expect(kinds(10, { weekday: 0 })).not.toContain('boss')
  })

  it('skips steps with nothing to do', () => {
    const plan = planMission({ ...base, budget: 30, due: 0, newCards: 0, mistakes: 0, lessons: 0, nextChapter: null, tasks: { easy: 0, medium: 0, hard: 0 } })
    expect(plan.steps.map((s) => s.kind)).toEqual(['quiz', 'feed'])
  })

  it('tracks progress from activity', () => {
    const plan = planMission(base)
    const none = stepProgress(plan, { cards: 0, mistakes: 0, lessons: 0, readingMinutes: 0, chapterStudied: false, quizzes: 0, tasksSolved: 0, reels: 0 })
    expect(missionRatio(none)).toBe(0)
    const all = stepProgress(plan, { cards: 99, mistakes: 99, lessons: 99, readingMinutes: 99, chapterStudied: true, quizzes: 99, tasksSolved: 9, reels: 999 })
    expect(all.every((p) => p.complete)).toBe(true)
    expect(missionRatio(all)).toBe(1)
  })

  it('maps arbitrary minutes to the nearest lower budget', () => {
    expect(budgetFor(25).id).toBe('steady')
    expect(budgetFor(5).id).toBe('sprint')
    expect(budgetFor(500).id).toBe('beast')
  })
})

import { describe, expect, it } from 'vitest'
import { maxCredit, placementCredit, RANKS, rankOf } from '@/game'

describe('placement rank credit', () => {
  it('lifts a verified level to a fixed step of the warrior path', () => {
    const title = (rank: number) => {
      const c = placementCredit(rank)
      return rankOf({ xp: c.xp, lessons: c.lessons, tests: c.tests, exams: c.exams, courses: 0 }).title
    }
    expect(title(0)).toBe(RANKS[0]!.title)
    expect(title(1)).toMatch(/^Рекрут I$/)
    expect(title(3)).toMatch(/^Воїн I$/)
    expect(title(5)).toMatch(/^Ветеран I$/)
  })

  it('a retake only tops the credit up', () => {
    const b2 = placementCredit(3)
    const b1 = placementCredit(2)
    expect(maxCredit(b2, b1)).toEqual(b2)
    expect(maxCredit(null, b1)).toEqual(b1)
  })
})

import { describe, expect, it } from 'vitest'
import { chapterMastery, type ChapterSignals } from '@/progress/mastery'

const empty: ChapterSignals = {
  status: 'unread',
  quizzes: { total: 6, answered: 0, correct: 0 },
  cards: { total: 10, reviewing: 0, stable: 0 },
  tasks: { total: 3, solved: 0 },
}

describe('chapter mastery', () => {
  it('starts at zero crowns', () => {
    expect(chapterMastery(empty)).toMatchObject({ crowns: 0, ratio: 0, next: 'Відкрий розділ' })
  })

  it('climbs the gates in order', () => {
    expect(chapterMastery({ ...empty, status: 'reading' }).crowns).toBe(1)
    expect(chapterMastery({ ...empty, status: 'studied' }).crowns).toBe(2)
    const quizzed = { ...empty, status: 'studied' as const, quizzes: { total: 6, answered: 4, correct: 3 } }
    expect(chapterMastery(quizzed).crowns).toBe(3)
    const remembered = { ...quizzed, cards: { total: 10, reviewing: 7, stable: 2 } }
    expect(chapterMastery(remembered).crowns).toBe(4)
    const master = { ...remembered, quizzes: { total: 6, answered: 6, correct: 6 }, cards: { total: 10, reviewing: 10, stable: 8 }, tasks: { total: 3, solved: 3 } }
    expect(chapterMastery(master)).toMatchObject({ crowns: 5, next: null })
    expect(chapterMastery(master).ratio).toBeGreaterThan(0.9)
  })

  it('does not skip a gate', () => {
    // Great quiz results but chapter never marked as read → still 1 crown.
    expect(chapterMastery({ ...empty, status: 'reading', quizzes: { total: 6, answered: 6, correct: 6 } }).crowns).toBe(1)
  })

  it('treats missing unit kinds as satisfied', () => {
    const bare: ChapterSignals = { status: 'studied', quizzes: { total: 0, answered: 0, correct: 0 }, cards: { total: 0, reviewing: 0, stable: 0 }, tasks: { total: 0, solved: 0 } }
    expect(chapterMastery(bare).crowns).toBe(5)
  })
})

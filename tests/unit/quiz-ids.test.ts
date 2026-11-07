import { describe, expect, it } from 'vitest'
import { gradeQuiz, usesOptionIds } from '@/content/blocks/quiz/grade'
import { gradedQuiz } from '@/content/blocks/quiz/view'
import type { QuizUnit } from '@/content/model'
import { createOptionIds, optionSecret } from '@/server/quiz-ids'

// Anti-cheat: graded quizzes show options shuffled, under ids that say nothing about the authored order.

const base = { kind: 'quiz', guideId: 'g', chapterId: 'c', level: null, prompt: [], promptText: 'Q', body: { type: 'root', children: [] }, explanation: null } as const
const opts = (n: number, right: number) => Array.from({ length: n }, (_, i) => ({ id: String.fromCharCode(97 + i), content: [], correct: i === right }))
const single = { ...base, id: 'q1', mode: 'single', options: opts(4, 1), freeAnswer: null, exercise: null } as unknown as QuizUnit
const other = { ...base, id: 'q2', mode: 'single', options: opts(4, 1), freeAnswer: null, exercise: null } as unknown as QuizUnit
const free = { ...base, id: 'q3', mode: 'output', options: [], freeAnswer: '42', exercise: null } as unknown as QuizUnit

const ids = createOptionIds(() => 'test-secret')

describe('opaque option ids', () => {
  it('never exposes authored ids and differs per unit and per secret', () => {
    const shown = single.options.map((o) => ids.token(single.id, o.id))
    for (const t of shown) expect(['a', 'b', 'c', 'd']).not.toContain(t)
    expect(new Set(shown).size).toBe(4)
    expect(ids.token(single.id, 'b')).not.toBe(ids.token(other.id, 'b'))
    expect(createOptionIds(() => 'another').token(single.id, 'b')).not.toBe(ids.token(single.id, 'b'))
    // stable across renders (stored test answers, the placement replay)
    expect(ids.token(single.id, 'b')).toBe(createOptionIds(() => 'test-secret').token(single.id, 'b'))
  })

  it('resolves the browser ids back for grading and drops raw authored ids', () => {
    const right = ids.token(single.id, 'b')
    expect(gradeQuiz(single, { chosen: ids.resolve(single, [right]) })).toBe(true)
    // a client sending the authored id (or another unit's token) gets nothing graded
    expect(ids.resolve(single, ['b'])).toEqual([])
    expect(gradeQuiz(single, { chosen: ids.resolve(single, ['b']) })).toBe(false)
    expect(ids.resolve(single, [ids.token(other.id, 'b')])).toEqual([])
    // the revealed key uses the browser's ids
    expect(ids.key(single).options).toEqual([right])
    // free answers pass through untouched
    expect(usesOptionIds(free)).toBe(false)
    expect(ids.resolve(free, ['x'])).toEqual(['x'])
  })

  it('shuffles the display order', () => {
    let seed = 1
    const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    const firsts = new Set<number>()
    for (let i = 0; i < 40; i++) firsts.add(gradedQuiz(single, rng, ids.idOf(single)).options[0]!.index)
    expect(firsts.size).toBeGreaterThan(2)
    const payload = gradedQuiz(single, rng, ids.idOf(single))
    expect(payload.options.map((o) => o.index).sort()).toEqual([0, 1, 2, 3])
    expect(JSON.stringify(payload)).not.toMatch(/"[abcd]"/)
  })

  it('requires a secret in production', () => {
    expect(() => optionSecret({ NODE_ENV: 'production' })).toThrow()
    expect(optionSecret({ NODE_ENV: 'production', CRON_SECRET: 's' })).toBe('s')
    expect(optionSecret({ QUIZ_OPTION_SECRET: 'q', CRON_SECRET: 's' })).toBe('q')
  })
})

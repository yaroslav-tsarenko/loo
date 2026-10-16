import { describe, expect, it } from 'vitest'
import { gradeQuiz } from '@/content/blocks/quiz/grade'
import { gradedQuiz, gradeWithKey, quizKey, quizShape, solutionText } from '@/content/blocks/quiz/view'
import type { QuizUnit } from '@/content/model'

// Phase 4 anti-cheat: graded quizzes ship no answer key to the browser; the server's answerQuiz grades the raw answer.

const base = { kind: 'quiz', id: 'q1', guideId: 'g', chapterId: 'c', level: null, prompt: [], promptText: 'Q', body: { type: 'root', children: [] }, explanation: null } as const

const single = { ...base, mode: 'single', options: [{ id: 'a', content: [], correct: false }, { id: 'b', content: [], correct: true }], freeAnswer: null, exercise: null } as unknown as QuizUnit
const multi = { ...base, mode: 'multi', options: [{ id: 'a', content: [], correct: true }, { id: 'b', content: [], correct: false }, { id: 'c', content: [], correct: true }], freeAnswer: null, exercise: null } as unknown as QuizUnit
const free = { ...base, mode: 'output', options: [], freeAnswer: '1 4 3 2', exercise: null } as unknown as QuizUnit
const order = {
  ...base,
  mode: 'order',
  options: [],
  freeAnswer: null,
  exercise: {
    kind: 'order',
    lang: 'js',
    pieces: [
      { id: 'p0', code: 'const a = 1', distractor: false },
      { id: 'p1', code: 'var a = 1', distractor: true },
      { id: 'p2', code: 'log(a)', distractor: false },
      { id: 'p3', code: 'return a', distractor: false },
    ],
  },
} as unknown as QuizUnit
const fill = {
  ...base,
  mode: 'fill',
  options: [],
  freeAnswer: null,
  exercise: { kind: 'fill', lang: 'js', segments: [{ kind: 'text', value: 'const x = ' }, { kind: 'blank', id: 'b0', answers: ['await', 'yield'] }, { kind: 'text', value: ' f()' }], bank: ['await', 'async', 'then'] },
} as unknown as QuizUnit

// A deterministic «random» for the tests.
const rng = () => {
  let s = 7
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

describe('graded quiz payload (what the browser gets)', () => {
  it('has no correct flags, free answers, distractor flags or blank answers', () => {
    for (const unit of [single, multi, free, order, fill]) {
      const json = JSON.stringify(gradedQuiz(unit, rng()))
      expect(json).not.toMatch(/"correct"/)
      expect(json).not.toMatch(/distractor"\s*:/)
      expect(json).not.toMatch(/"answers"/)
      expect(json).not.toContain('1 4 3 2')
      expect(json).not.toContain('"p0"')
    }
  })

  it('keeps what the UI needs to render', () => {
    expect(gradedQuiz(multi)).toMatchObject({ multi: true, free: false, optionIds: ['a', 'b', 'c'] })
    expect(gradedQuiz(free)).toMatchObject({ multi: false, free: true, optionIds: [] })
    const o = gradedQuiz(order, rng()).exercise
    expect(o?.kind).toBe('order')
    if (o?.kind === 'order') {
      expect(o.distractors).toBe(true)
      expect(o.pieces.map((p) => p.id)).toEqual(['s0', 's1', 's2', 's3'])
      expect(o.pieces.map((p) => p.code).sort()).toEqual(['const a = 1', 'log(a)', 'return a', 'var a = 1'])
      // never the solution order
      expect(o.pieces.map((p) => p.code).slice(0, 3)).not.toEqual(['const a = 1', 'log(a)', 'return a'])
    }
    const f = gradedQuiz(fill, rng()).exercise
    if (f?.kind === 'fill') {
      expect(f.bank?.slice().sort()).toEqual(['async', 'await', 'then'])
      expect(f.segments[1]).toEqual({ kind: 'blank', id: 'b0', width: 8 })
    }
  })

  it('distractor flags never leak through the shape either', () => {
    expect(quizShape(single)).toEqual({ mode: 'single', multi: false, free: false })
  })
})

describe('server grading of raw answers', () => {
  it('grades order answers by code, never by authoring ids', () => {
    expect(gradeQuiz(order, { chosen: ['const a = 1', 'log(a)', 'return a'] })).toBe(true)
    expect(gradeQuiz(order, { chosen: ['p0', 'p2', 'p3'] })).toBe(false)
    expect(gradeQuiz(order, { chosen: ['const a = 1', 'var a = 1', 'log(a)', 'return a'] })).toBe(false)
  })

  it('reveals a key that matches the server verdict (practice grading parity)', () => {
    const cases: Array<[QuizUnit, { chosen: string[]; text?: string | null }]> = [
      [single, { chosen: ['b'] }],
      [single, { chosen: ['a'] }],
      [multi, { chosen: ['c', 'a'] }],
      [multi, { chosen: ['a'] }],
      [free, { chosen: [], text: '1;4;3;2' }],
      [free, { chosen: [], text: '1 2 3 4' }],
      [order, { chosen: ['const a = 1', 'log(a)', 'return a'] }],
      [order, { chosen: ['log(a)', 'const a = 1', 'return a'] }],
      [fill, { chosen: ['yield'] }],
      [fill, { chosen: ['then'] }],
    ]
    for (const [unit, answer] of cases) expect(gradeWithKey(quizShape(unit), quizKey(unit), { text: null, ...answer })).toBe(gradeQuiz(unit, answer))
  })

  it('builds review solutions from the revealed key', () => {
    const o = gradedQuiz(order).exercise!
    expect(solutionText(o, quizKey(order))).toBe('const a = 1\nlog(a)\nreturn a')
    const f = gradedQuiz(fill).exercise!
    expect(solutionText(f, quizKey(fill))).toBe('const x = await f()')
  })
})

describe('server actions (static)', () => {
  it('no action accepts a client-side right/wrong flag for quizzes', async () => {
    const { readdirSync, readFileSync } = await import('node:fs')
    const path = await import('node:path')
    const dir = path.resolve(__dirname, '../../src/server/actions')
    for (const file of readdirSync(dir)) {
      const src = readFileSync(path.join(dir, file), 'utf8')
      expect(src, file).not.toMatch(/correct:\s*z\.boolean\(\)/)
      expect(src, file).not.toMatch(/recordQuizAnswer/)
    }
  })

  it('graded quiz items carry no answer key (render-items)', async () => {
    const { readFileSync } = await import('node:fs')
    const path = await import('node:path')
    const src = readFileSync(path.resolve(__dirname, '../../src/ui/study/render-items.tsx'), 'utf8')
    const quizItem = src.slice(src.indexOf('export interface QuizItem'), src.indexOf('export interface TaskItem'))
    expect(quizItem).not.toMatch(/correct|freeAnswer|explanation|QuizExercise/)
  })
})

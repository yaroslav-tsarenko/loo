import { describe, expect, it } from 'vitest'
import { blankMatches, exerciseSolution, orderMatches } from '@/content/blocks/quiz/exercise'
import type { FillExercise, OrderExercise, QuizUnit, TaskUnit } from '@/content/model'
import { extractFile } from '@/content/parse/extract'
import { parseMarkdown } from '@/content/parse/markdown'
import { rawXp } from '@/progress/xp'

function extract(md: string) {
  const { root, meta } = parseMarkdown(md)
  return extractFile({ root, meta, guideId: 'g', chapterId: 'g/ch', path: 'Guides/G/G - 01. Файл.md', fileName: 'G - 01. Файл' })
}

const quote = (md: string) =>
  md
    .trim()
    .split('\n')
    .map((l) => (l ? `> ${l}` : '>'))
    .join('\n')

describe('task starter/tests fences', () => {
  it('extracts starter and tests out of the statement', () => {
    const result = extract(
      quote(`[!task] Реалізуй debounce
level: middle · difficulty: medium · id: t1

Напиши \`debounce(fn, ms)\`.

\`\`\`js
// приклад використання лишається в умові
\`\`\`

\`\`\`js starter
function debounce(fn, ms) {
  // твій код
}
\`\`\`

\`\`\`js tests
test('a', () => expect(1).toBe(1))
\`\`\`

> [!solution]- Рішення
> \`\`\`js
> function debounce() {}
> \`\`\``),
    )
    const [t] = result.units as TaskUnit[]
    expect(t!.code).toEqual({ lang: 'js', starter: 'function debounce(fn, ms) {\n  // твій код\n}', tests: "test('a', () => expect(1).toBe(1))" })
    expect(t!.statement.children.map((n) => n.type)).toEqual(['paragraph', 'code'])
    expect(result.issues.filter((i) => i.code === 'exercise-invalid')).toEqual([])
  })

  it('keeps tasks without fences as self-check and flags non-runnable tests', () => {
    const plain = extract(quote('[!task] Просто\nid: t2\n\nУмова.'))
    expect((plain.units[0] as TaskUnit).code).toBeNull()
    const ts = extract(quote("[!task] TS\nid: t3\n\n```ts tests\ntest('x', () => {})\n```"))
    expect((ts.units[0] as TaskUnit).code).toMatchObject({ lang: 'ts', starter: '' })
    expect(ts.issues.some((i) => i.code === 'exercise-invalid' && i.message.includes('JavaScript'))).toBe(true)
    const empty = extract(quote('[!task] Без тестів\nid: t4\n\n```js tests\nconst x = 1\n```'))
    expect(empty.issues.some((i) => i.code === 'exercise-invalid' && i.message.includes('test('))).toBe(true)
  })
})

describe('quiz type: order', () => {
  it('splits lines into pieces, strips distractor markers and keeps indentation', () => {
    const result = extract(
      quote(`[!quiz] Склади функцію
level: junior · type: order · id: o1

\`\`\`js order
function sum(a, b) {
  return a + b
}
  return a - b // ✗
\`\`\`

**Пояснення:** просто.`),
    )
    const [q] = result.units as QuizUnit[]
    expect(q!.mode).toBe('order')
    expect(q!.body.children).toEqual([])
    const ex = q!.exercise as OrderExercise
    expect(ex.lang).toBe('js')
    expect(ex.pieces).toEqual([
      { id: 'p0', code: 'function sum(a, b) {', distractor: false },
      { id: 'p1', code: '  return a + b', distractor: false },
      { id: 'p2', code: '}', distractor: false },
      { id: 'p3', code: '  return a - b', distractor: true },
    ])
    expect(orderMatches(ex, ['p0', 'p1', 'p2'])).toBe(true)
    expect(orderMatches(ex, ['p0', 'p3', 'p2'])).toBe(false)
    expect(orderMatches(ex, ['p0', 'p1', 'p2', 'p3'])).toBe(false)
    expect(exerciseSolution(ex)).toBe('function sum(a, b) {\n  return a + b\n}')
    expect(result.issues.filter((i) => i.code === 'exercise-invalid')).toEqual([])
  })

  it('uses blank-line separated blocks and infers the mode from a bare ```order fence', () => {
    const result = extract(quote('[!quiz] Блоки\nid: o2\n\n```order\nconst a = 1\nconst b = 2\n\nconsole.log(a)\n\nconsole.log(b)\n\nwhile (true) {} // ✗\n```'))
    const q = result.units[0] as QuizUnit
    expect(q.mode).toBe('order')
    const ex = q.exercise as OrderExercise
    expect(ex.lang).toBeNull()
    expect(ex.pieces.map((p) => p.code)).toEqual(['const a = 1\nconst b = 2', 'console.log(a)', 'console.log(b)', 'while (true) {}'])
    expect(ex.pieces.map((p) => p.distractor)).toEqual([false, false, false, true])
  })

  it('flags order quizzes with fewer than 3 pieces or without a fence', () => {
    const short = extract(quote('[!quiz] Мало\ntype: order · id: o3\n\n```js order\na()\nb()\nc() // ✗\n```'))
    expect(short.issues.some((i) => i.code === 'exercise-invalid' && i.message.includes('≥ 3'))).toBe(true)
    const none = extract(quote('[!quiz] Без коду\ntype: order · id: o4\n\nТекст'))
    expect(none.units).toHaveLength(1)
    expect(none.issues.some((i) => i.code === 'exercise-invalid')).toBe(true)
  })
})

describe('quiz type: fill', () => {
  it('parses blanks with alternatives into segments', () => {
    const result = extract(quote('[!quiz] Заповни\nlevel: junior · type: fill · id: f1\n\n```js fill\n[[const|let]] x = [[1]]\nconsole.log([[x]])\n```'))
    const q = result.units[0] as QuizUnit
    expect(q.mode).toBe('fill')
    const ex = q.exercise as FillExercise
    expect(ex.bank).toBeNull()
    expect(ex.segments).toEqual([
      { kind: 'blank', id: 'b0', answers: ['const', 'let'] },
      { kind: 'text', value: ' x = ' },
      { kind: 'blank', id: 'b1', answers: ['1'] },
      { kind: 'text', value: '\nconsole.log(' },
      { kind: 'blank', id: 'b2', answers: ['x'] },
      { kind: 'text', value: ')' },
    ])
    expect(exerciseSolution(ex)).toBe('const x = 1\nconsole.log(x)')
    expect(blankMatches(['const', 'let'], ' let ')).toBe(true)
    expect(blankMatches(['const'], 'Const')).toBe(false)
    expect(blankMatches(['x'], '  ')).toBe(false)
  })

  it('builds a word bank from the bank flag plus extra words', () => {
    const flag = extract(quote('[!quiz] Банк\ntype: fill · bank · id: f2\n\n```js fill\n[[map]]([[x]] => x)\n```'))
    expect((flag.units[0] as QuizUnit).exercise).toMatchObject({ bank: ['map', 'x'] })
    const extra = extract(quote('[!quiz] Банк\ntype: fill · bank: filter, y · id: f3\n\n```js fill\n[[map]](x => x)\n```'))
    expect((extra.units[0] as QuizUnit).exercise).toMatchObject({ bank: ['map', 'filter', 'y'] })
  })

  it('handles escaped pipes and flags fills without blanks', () => {
    const pipe = extract(quote('[!quiz] Або\ntype: fill · id: f4\n\n```js fill\nconst v = a [[\\|\\||??]] b\n```'))
    const seg = ((pipe.units[0] as QuizUnit).exercise as FillExercise).segments[1]
    expect(seg).toEqual({ kind: 'blank', id: 'b0', answers: ['||', '??'] })
    const none = extract(quote('[!quiz] Порожньо\ntype: fill · id: f5\n\n```js fill\nconst x = 1\n```'))
    expect(none.issues.some((i) => i.code === 'exercise-invalid' && i.message.includes('пропусків'))).toBe(true)
  })

  it('leaves regular quizzes untouched', () => {
    const result = extract(quote('[!quiz] Що виведе код?\ntype: output · id: q1\n\n```js\nconsole.log(1)\n```\n\n**Відповідь:** `1`'))
    expect(result.units[0]).toMatchObject({ mode: 'output', exercise: null, freeAnswer: '1' })
  })
})

describe('xp for code-building quizzes', () => {
  it('gives order/fill ×1.3', () => {
    const base = { unitId: 'u', kind: 'quiz' as const, outcome: 'correct' as const, level: 'middle' as const, hintsUsed: 0, at: 0 }
    expect(rawXp({ ...base, quizMode: 'single' })).toBe(15)
    expect(rawXp({ ...base, quizMode: 'order' })).toBe(20)
    expect(rawXp({ ...base, quizMode: 'fill' })).toBe(20)
  })
})

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import type { QuizUnit } from '@/content/model'
import { loadSnapshot, type FullSnapshot } from '@/content/store'
import {
  checkCourse,
  compileCourse,
  compileCourseDetailed,
  CourseBundleSchema,
  examBand,
  parseCourseYaml,
  placementCandidates,
  placementResult,
  placementTest,
  rng,
  type CourseBundle,
  type Level,
  type PlacementAnswer,
  type PlacementItem,
  type PlacementSkill,
} from '@/course'
import { placementSeed, placementUnitOf, replayPlacement } from '@/server/courses/placement-core'

// Placement test with a calibrated bank (docs/LANGUAGE_COURSE.md «Вступний тест»): compiling `_placement/`,
// the adaptive algorithm (binary search from B1, guessing protection, confidence, follow-up), skills and IELTS.

const vaultPath = path.resolve(__dirname, '../fixtures/placement-vault')
const yaml = () => readFileSync(path.join(vaultPath, 'Courses/english-bank/course.yaml'), 'utf8')
let snap: FullSnapshot
let bundle: CourseBundle

beforeAll(async () => {
  snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
  bundle = compileCourse(parseCourseYaml(yaml()).manifest!, snap)
})

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
const rank = (l: Level) => CEFR.indexOf(l as (typeof CEFR)[number])

// 42 questions per level like the real bank: 14 grammar · 12 vocabulary · 8 reading · 8 listening, diff 1/2/2/3.
function synthetic(base: CourseBundle, tweak?: (level: Level, items: Array<[string, PlacementItem]>) => Array<[string, PlacementItem]>): CourseBundle {
  const b = structuredClone(base)
  const bank: Record<string, PlacementItem> = {}
  const pool: Partial<Record<Level, string[]>> = {}
  for (const level of CEFR) {
    let items: Array<[string, PlacementItem]> = []
    for (let i = 0; i < 42; i++) {
      const skill: PlacementSkill = i < 14 ? 'grammar' : i < 26 ? 'vocabulary' : i < 34 ? 'reading' : 'listening'
      items.push([`syn-${level}-${i}`, { level, skill, diff: [1, 2, 2, 3][i % 4]!, options: 4 }])
    }
    if (tweak) items = tweak(level, items)
    pool[level] = items.map(([id]) => id)
    for (const [id, item] of items) bank[id] = item
  }
  b.placement = { ...b.placement, enabled: true, maxQuestions: 30, perLevel: 5, pass: 0.75, followUp: 6, pool, bank }
  return b
}

type Policy = (item: PlacementItem, r: () => number) => Omit<PlacementAnswer, 'exerciseId'>

function take(b: CourseBundle, policy: Policy, seed = 's', followUp = false) {
  const answers: PlacementAnswer[] = []
  const r = rng(`learner|${seed}`)
  const phases: string[] = []
  for (let i = 0; i < 80; i++) {
    const step = placementTest(b, answers, seed, { followUp })
    if (step.done) break
    phases.push(step.phase ?? '')
    answers.push({ exerciseId: step.next!, ...policy(b.placement.bank![step.next!]!, r) })
  }
  return { answers, phases, result: placementResult(b, answers) }
}

// knows every question up to `level`, nothing above (and doesn't guess: a wrong option)
const knowsUpTo =
  (level: Level): Policy =>
  (item) => ({ correct: rank(item.level) <= rank(level) })
const random: Policy = (_item, r) => ({ correct: r() < 0.25 })

describe('placement bank: compile', () => {
  it('keeps _placement files out of guides, chapters, units and the course; compiles their questions into the bank', () => {
    const guide = snap.guides.find((g) => g.id === 'english')!
    expect(guide.chapterIds.some((id) => id.includes('_placement'))).toBe(false)
    expect([...snap.chapters.values()].some((c) => c.path.includes('_placement'))).toBe(false)
    expect(snap.units.has('en-pl-a1-g01')).toBe(false)
    expect(snap.placementUnits.has('en-pl-a1-g01')).toBe(true)
    expect(snap.placementChapters.size).toBe(2)
    expect(Object.keys(bundle.exercises).some((id) => id.startsWith('en-pl-'))).toBe(false)
    expect(bundle.sections.flatMap((s) => s.topics).map((t) => t.chapterId)).toEqual(['en-a1-hi', 'en-a1-review'])
    expect(CourseBundleSchema.safeParse(bundle).success).toBe(true)

    const { bank, pool } = bundle.placement
    expect(bank!['en-pl-a1-g01']).toEqual({ level: 'A1', skill: 'grammar', diff: 1, options: 4 })
    expect(bank!['en-pl-a1-r01']).toEqual({ level: 'A1', skill: 'reading', diff: 3, options: 4 })
    // [!listen] type: answer counts (choice too); skill / diff from the meta line
    expect(bank!['en-pl-b2-l01']).toEqual({ level: 'B2', skill: 'listening', diff: 2, options: 4 })
    // no skill → grammar (warning); several right options → skipped
    expect(bank!['en-pl-a1-g03']?.skill).toBe('grammar')
    expect(bank!['en-pl-a1-v02']).toBeUndefined()
    // B2 lessons are planned, its bank still counts
    expect(pool.B2).toEqual(['en-pl-b2-g01', 'en-pl-b2-g02', 'en-pl-b2-l01', 'en-pl-b2-v01'])
    expect(bundle.placement).toMatchObject({ maxQuestions: 30, perLevel: 5, pass: 0.75, followUp: 6 })
    expect(placementCandidates(bundle, 'seed').length).toBe(10)
  })

  it('reports bank problems and exempts review topics from the cards minimum', () => {
    const { issues } = compileCourseDetailed(parseCourseYaml(yaml()).manifest!, snap)
    const bankIssues = issues.filter((i) => i.code === 'placement-bank').map((i) => i.message)
    expect(bankIssues.some((m) => m.includes('en-pl-a1-v02'))).toBe(true)
    expect(bankIssues.some((m) => m.includes('немає skill') && m.includes('en-pl-a1-g03'))).toBe(true)
    const check = checkCourse(yaml(), snap)
    expect(check.issues.filter((i) => i.severity === 'error')).toEqual([])
    const thin = check.issues.filter((i) => i.code === 'thin-placement').map((i) => i.message)
    expect(thin.some((m) => m.includes('немає питань рівнів A2, B1, C1, C2'))).toBe(true)
    const minimum = (topic: string) => check.issues.find((i) => i.code === 'minimum' && i.where === `english-bank:a1:${topic}`)?.message ?? ''
    expect(minimum('en-a1-hi')).toMatch(/картки \(слова\) 1\/6/)
    expect(minimum('en-a1-review')).not.toMatch(/картки/)
  })
})

describe('placement bank: algorithm', () => {
  let b: CourseBundle
  beforeAll(() => {
    b = synthetic(bundle)
  })

  it('ideal C2 → C2, with high confidence, every skill C2 and IELTS 8.5–9.0', () => {
    const { result, answers } = take(b, () => ({ correct: true }))
    expect(result.level).toBe('C2')
    expect(result.confidence).toBe('high')
    expect(result.followUp).toBe(false)
    expect(answers.length).toBeLessThanOrEqual(20)
    for (const s of ['grammar', 'vocabulary', 'reading', 'listening'] as const) expect(result.skills![s]!.level).toBe('C2')
    expect(result.exam).toEqual({ exam: 'IELTS', label: '8.5–9.0' })
    // C2 lessons are planned: start with the highest level that has lessons
    expect(result).toMatchObject({ lessonsReady: false, startLevel: 'A1', sectionId: 'english-bank:a1' })
  })

  it('starts in the middle (B1) and mixes skills and difficulties inside a probe', () => {
    const { answers } = take(b, knowsUpTo('B2'))
    // B1 passes after 4 of 4 right, then C1
    const first = answers.slice(0, 4).map((a) => b.placement.bank![a.exerciseId]!)
    expect(first.every((i) => i.level === 'B1')).toBe(true)
    expect(new Set(first.map((i) => i.skill)).size).toBe(4)
    expect(first.filter((i) => i.diff === 1).length).toBeLessThanOrEqual(1)
    expect(first.some((i) => i.diff === 3)).toBe(true)
    expect(b.placement.bank![answers[4]!.exerciseId]!.level).toBe('C1')
  })

  it('B2 with mistakes on C1 → B2 (the old lesson pool capped everyone at A2)', () => {
    const policy: Policy = (item) => {
      if (rank(item.level) <= rank('B2')) return { correct: true }
      if (item.level === 'C1') return { correct: item.diff === 1 || item.skill === 'reading' }
      return { correct: false }
    }
    for (const seed of ['a', 'b', 'c', 'd', 'e']) expect(take(b, policy, seed).result.level).toBe('B2')
    for (const level of CEFR) expect(take(b, knowsUpTo(level)).result.level).toBe(level)
  })

  it('a level where only the easy (diff 1) items are right is not passed', () => {
    // C1: one typical item and twenty easy ones; 4 questions per level → 3 of 4 right is 75 %, but none of diff ≥ 2
    const hard = synthetic(bundle, (level, items) =>
      level === 'C1' ? items.filter(([, i]) => i.diff === 1).concat(items.filter(([, i]) => i.diff === 2).slice(0, 1)) : items,
    )
    hard.placement.perLevel = 4
    const policy: Policy = (item) => ({ correct: rank(item.level) < rank('C1') || (item.level === 'C1' && item.diff === 1) })
    const { result } = take(hard, policy)
    const c1 = result.perLevel.C1!
    // ≥ 75 % right (the boundary was confirmed with more easy items), yet no typical item right
    expect(c1.correct / c1.asked).toBeGreaterThanOrEqual(0.75)
    expect(c1.hardCorrect).toBe(0)
    expect(result.level).toBe('B2')
  })

  it('all random → A1 or A2, never B1+', () => {
    for (let s = 0; s < 150; s++) expect(['A1', 'A2']).toContain(take(b, random, `rnd-${s}`).result.level)
  })

  it('25 % guessing above what one knows → not above A2', () => {
    const policy: Policy = (item, r) => ({ correct: item.level === 'A1' || r() < 0.25 })
    for (let s = 0; s < 150; s++) expect(rank(take(b, policy, `g-${s}`).result.level)).toBeLessThanOrEqual(rank('A2'))
  })

  it('«Не знаю» counts as wrong, but not as a guess', () => {
    const dk: Policy = (item) => (rank(item.level) <= rank('B1') ? { correct: true } : { correct: false, dontKnow: true })
    const guess: Policy = (item) => ({ correct: rank(item.level) <= rank('B1') })
    const a = take(b, dk).result
    const g = take(b, guess).result
    expect(a.level).toBe('B1')
    expect(a.perLevel.C1!.correct + a.perLevel.B2!.correct).toBe(0)
    expect(a.perLevel.B2!.dontKnow).toBeGreaterThan(0)
    // a client can't mark a «Не знаю» right
    const lying = take(b, (item) => (rank(item.level) <= rank('B1') ? { correct: true } : { correct: true, dontKnow: true })).result
    expect(lying.level).toBe('B1')
    // same right / wrong pattern; honest «Не знаю» isn't penalised as a wrong guess
    const scoreOf = (r: typeof a) => Object.values(r.skills!).reduce((sum, s) => sum + s!.score, 0)
    expect(scoreOf(a)).toBeGreaterThan(scoreOf(g))
  })

  it('estimates skills: listening and reading above grammar', () => {
    const policy: Policy = (item) => {
      if (item.skill === 'listening' || item.skill === 'reading') return { correct: rank(item.level) <= rank('C1') }
      if (item.skill === 'grammar') return { correct: rank(item.level) <= rank('A2') }
      return { correct: rank(item.level) <= rank('B1') }
    }
    const { result } = take(b, policy)
    const s = result.skills!
    expect(rank(s.listening!.level)).toBeGreaterThan(rank(s.grammar!.level))
    expect(rank(s.reading!.level)).toBeGreaterThan(rank(s.grammar!.level))
    expect(rank(s.grammar!.level)).toBeLessThanOrEqual(rank(result.level))
    // weak grammar pulls the overall level down (A2); the other skills stand out above it
    expect(rank(s.grammar!.level)).toBe(Math.min(...Object.values(s).map((v) => rank(v!.level))))
    expect(result.strong).not.toContain('grammar')
    expect(result.strong!.some((k) => k === 'listening' || k === 'reading')).toBe(true)
    expect(s.grammar!.exam).toEqual(examBand(bundle.course.exam, s.grammar!.level))
    expect(s.grammar!.exam?.exam).toBe('IELTS')
    // an even learner has no strong or weak skills
    const even = take(b, knowsUpTo('B2')).result
    expect(even.strong).toEqual([])
    expect(even.weak).toEqual([])
  })

  it('is deterministic per seed and stays within ~30 questions', () => {
    expect(take(b, random, 'x').answers).toEqual(take(b, random, 'x').answers)
    for (let s = 0; s < 60; s++) {
      const { answers } = take(b, (item, r) => ({ correct: r() < (rank(item.level) <= 2 ? 0.85 : 0.5) }), `m-${s}`)
      expect(answers.length).toBeLessThanOrEqual(30)
    }
  })

  it('confirms a narrow boundary itself and offers a follow-up only at low confidence', () => {
    // B1 learner, a coin toss on B2: a narrow upper boundary is re-checked inside the main limit
    const shaky: Policy = (item, r) => ({ correct: rank(item.level) <= rank('B1') || (item.level === 'B2' && r() < 0.6) })
    for (let s = 0; s < 40; s++) {
      const { result } = take(b, shaky, `f-${s}`)
      expect(result.followUp).toBe(result.confidence === 'low')
      if (result.confidence !== 'high') expect(result.perLevel.B2!.asked).toBeGreaterThan(5)
    }
    // contradictory answers (B1 right, A2 wrong): low confidence → the follow-up is offered and continues the run
    const odd: Policy = (item) => ({ correct: item.level === 'A1' || item.level === 'B1' })
    const main = take(b, odd)
    expect(main.result).toMatchObject({ confidence: 'low', followUp: true, followedUp: false })
    const more = take(b, odd, 's', true)
    expect(more.answers.slice(0, main.answers.length)).toEqual(main.answers)
    const extra = more.phases.slice(main.answers.length)
    expect(extra.length).toBeGreaterThan(0)
    expect(extra.every((p) => p === 'follow-up')).toBe(true)
    expect(more.answers.length).toBeLessThanOrEqual(36)
    expect(more.result).toMatchObject({ followedUp: true, followUp: false })
    expect(rank(more.result.level)).toBeLessThanOrEqual(rank('B1'))
  })
})

describe('placement bank: server replay', () => {
  it('grades bank items from the content, «Не знаю» as wrong whatever is chosen, and keeps the order', () => {
    const seed = placementSeed('user-1', 'abcdef12')
    const unitOf = placementUnitOf(bundle, snap.placementUnits, () => null)
    const first = placementTest(bundle, [], seed).next!
    expect(bundle.placement.bank![first]).toBeDefined()
    const unit = snap.placementUnits.get(first) as QuizUnit
    const right = unit.options.filter((o) => o.correct).map((o) => o.id)
    const honest = replayPlacement(bundle, [{ id: first, chosen: right, text: null }], seed, unitOf)
    expect(honest.ok && honest.graded[0]).toEqual({ exerciseId: first, correct: true })
    const dk = replayPlacement(bundle, [{ id: first, chosen: right, text: null, dontKnow: true }], seed, unitOf)
    expect(dk.ok && dk.graded[0]).toEqual({ exerciseId: first, correct: false, dontKnow: true })
    const other = bundle.placement.pool.B2!.find((id) => id !== first)!
    expect(replayPlacement(bundle, [{ id: other, chosen: [], text: null }], seed, unitOf)).toEqual({ ok: false, reason: 'out-of-order' })
    // a lesson quiz id is not a bank question
    expect(unitOf('en-a1-hi-q01')).toBeNull()
  })
})

describe('JavaScript course placement (no bank) is unchanged', () => {
  it('compiles the lesson-quiz pool without a bank and probes from the second-lowest level', async () => {
    const jsVault = path.resolve(__dirname, '../fixtures/course-vault')
    const s = await loadSnapshot({ vaultPath: jsVault, guidesDir: 'Guides' }, new Map(), 1)
    const js = compileCourse(parseCourseYaml(readFileSync(path.join(jsVault, 'Courses/fixture-course/course.yaml'), 'utf8')).manifest!, s)
    expect(js.placement.bank).toBeUndefined()
    expect(js.placement.pass).toBeUndefined()
    const first = placementTest(js, [], 's')
    expect(first.probing).toBe('middle')
    expect(first.phase).toBeUndefined()
    expect(placementResult(js, []).confidence).toBeUndefined()
  })
})

describe('exam band of the fixture course (course.yaml `exam:` → IELTS)', () => {
  it('maps CEFR levels to the Cambridge / British Council ranges', () => {
    const exam = bundle.course.exam
    expect(examBand(exam, 'A1')).toEqual({ exam: 'IELTS', label: 'нижче 4.0' })
    expect(examBand(exam, 'A2')?.label).toBe('нижче 4.0')
    expect(examBand(exam, 'B1')?.label).toBe('4.0–5.0')
    expect(examBand(exam, 'B2')?.label).toBe('5.5–6.5')
    expect(examBand(exam, 'C1')?.label).toBe('7.0–8.0')
    expect(examBand(exam, 'C2')?.label).toBe('8.5–9.0')
    expect(examBand(exam, 'middle')).toBeNull()
  })
})

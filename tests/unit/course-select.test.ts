import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { loadSnapshot } from '@/content/store'
import {
  buildSectionExam,
  buildTopicTest,
  compileCourse,
  parseCourseYaml,
  placementResult,
  placementTest,
  selectForLevel,
  testOutEligible,
  testPassed,
  type CourseBundle,
  type Level,
  type PlacementAnswer,
} from '@/course'

const vaultPath = path.resolve(__dirname, '../fixtures/course-vault')
let bundle: CourseBundle

beforeAll(async () => {
  const snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
  const manifest = parseCourseYaml(readFileSync(path.join(vaultPath, 'Courses/fixture-course/course.yaml'), 'utf8')).manifest!
  bundle = compileCourse(manifest, snap)
})

describe('topic tests and section exams', () => {
  it('draws the same questions for the same seed', () => {
    const a = buildTopicTest(bundle, 'fixture-course:basics:al-ch-01', 'user-1:1')!
    const b = buildTopicTest(bundle, 'al-ch-01', 'user-1:1')!
    expect(a).toEqual(b)
    expect(a.questions).toHaveLength(4)
    expect(new Set(a.questions).size).toBe(4)
    expect(a.questions.every((id) => bundle.exercises[id]!.kind === 'quiz')).toBe(true)
    expect(a.needed).toBe(3)
    expect(testPassed(a, 3)).toBe(true)
    expect(testPassed(a, 2)).toBe(false)
  })

  it('varies across seeds', () => {
    const draws = new Set(Array.from({ length: 12 }, (_, i) => buildTopicTest(bundle, 'al-ch-01', `user-${i}`)!.questions.join()))
    expect(draws.size).toBeGreaterThan(1)
  })

  it('tops up a thin pool with cards', () => {
    const t = buildTopicTest(bundle, 'alpha-02', 7)!
    expect([...t.questions].sort()).toEqual(['al-02-001', 'al-02-quiz-01', 'al-02-quiz-02'])
  })

  it('stratifies the section exam over topics', () => {
    for (const seed of ['a', 'b', 'c', 42]) {
      const exam = buildSectionExam(bundle, 'basics', seed)!
      expect(exam).toEqual(buildSectionExam(bundle, 'fixture-course:basics', seed))
      expect(exam.questions).toHaveLength(6)
      expect(new Set(exam.questions).size).toBe(6)
      // the small topic is fully represented, not drowned by the big one
      expect(exam.questions).toEqual(expect.arrayContaining(['al-02-quiz-01', 'al-02-quiz-02']))
      expect(exam.needed).toBe(5)
    }
    expect(buildSectionExam(bundle, 'practice', 1)).toBeNull()
    expect(buildTopicTest(bundle, 'bank-01', 1)).toBeNull()
  })

  it('allows test-out on path sections with an exam', () => {
    expect(testOutEligible(bundle, 'basics', { passedSections: [] })).toEqual({ eligible: true, reason: 'ok' })
    expect(testOutEligible(bundle, 'basics', { passedSections: ['fixture-course:basics'] }).reason).toBe('already-passed')
    expect(testOutEligible(bundle, 'practice', { passedSections: [] }).reason).toBe('practice')
    expect(testOutEligible(bundle, 'nope', { passedSections: [] }).reason).toBe('unknown-section')
    const noTestOut = structuredClone(bundle)
    noTestOut.sections[0]!.exam!.testOut = false
    expect(testOutEligible(noTestOut, 'basics', { passedSections: [] }).reason).toBe('disabled')
  })
})

describe('selectForLevel', () => {
  const lesson = (topic: string, kind: string) => `fixture-course:basics:${topic}:${kind}`

  it('condenses lessons below the level to 1–2 items', () => {
    const view = selectForLevel(bundle, 'senior')
    const core1 = view.lessons[lesson('al-ch-01', 'core-1')]!
    // all below senior: keep the hardest quiz + the next quiz, drop cards and reels
    expect(core1.items.map((i) => i.id)).toEqual(['al-01-quiz-02', 'al-01-quiz-04'])
    expect(core1).toMatchObject({ condensed: true, optional: true, challenge: false })
    expect(view.lessons[lesson('al-ch-01', 'theory-1')]!.optional).toBe(true)
  })

  it('keeps one below-level item in a mixed lesson and flags challenges', () => {
    const core2 = selectForLevel(bundle, 'middle').lessons[lesson('al-ch-01', 'core-2')]!
    expect(core2.items.map((i) => [i.id, i.challenge])).toEqual([
      ['al-01-quiz-05', false],
      ['al-01-quiz-06', true],
    ])
    expect(core2).toMatchObject({ condensed: true, optional: false, challenge: true })
  })

  it('leaves at-level lessons intact', () => {
    const view = selectForLevel(bundle, 'junior')
    const core1 = view.lessons[lesson('al-ch-01', 'core-1')]!
    expect(core1.items.map((i) => i.id)).toEqual(bundle.sections[0]!.topics[0]!.lessons[2]!.items.map((i) => i.id))
    expect(core1.condensed).toBe(false)
    expect(core1.items.find((i) => i.id === 'al-01-quiz-04')!.challenge).toBe(true)
    expect(selectForLevel(bundle, 'noob').minutes).toBeGreaterThan(selectForLevel(bundle, 'god').minutes)
  })
})

describe('placement', () => {
  // Simulates a learner who answers right exactly up to `knows`.
  function run(b: CourseBundle, knows: Level | null, seed = 's') {
    const rank = ['noob', 'junior', 'middle', 'senior', 'god']
    const answers: PlacementAnswer[] = []
    const probes: Level[] = []
    for (let i = 0; i < 50; i++) {
      const step = placementTest(b, answers, seed)
      if (step.done) break
      probes.push(step.probing!)
      const level = b.exercises[step.next!]!.level
      answers.push({ exerciseId: step.next!, correct: knows !== null && rank.indexOf(level) <= rank.indexOf(knows) })
    }
    return { answers, probes, result: placementResult(b, answers) }
  }

  it('binary-searches from easier levels up', () => {
    // pools: junior 4, middle 3, senior 3 (god 1 and noob 0 are too thin to probe)
    const { probes, answers, result } = run(bundle, 'middle')
    expect([...new Set(probes)]).toEqual(['middle', 'senior'])
    expect(answers).toHaveLength(4)
    expect(result).toMatchObject({ level: 'middle', sectionIndex: 1, sectionId: 'fixture-course:advanced', confident: true })
  })

  it('places a beginner at the start without probing the lowest level', () => {
    const { probes, result } = run(bundle, null)
    expect([...new Set(probes)]).toEqual(['middle', 'junior'])
    expect(result).toMatchObject({ level: 'noob', sectionIndex: 0 })
  })

  it('asks a third question on a 1:1 split', () => {
    const first = placementTest(bundle, [], 'x')
    const second = placementTest(bundle, [{ exerciseId: first.next!, correct: true }], 'x')
    const third = placementTest(
      bundle,
      [
        { exerciseId: first.next!, correct: true },
        { exerciseId: second.next!, correct: false },
      ],
      'x',
    )
    expect([first.probing, second.probing, third.probing]).toEqual(['middle', 'middle', 'middle'])
    expect(new Set([first.next, second.next, third.next]).size).toBe(3)
  })

  it('is deterministic per seed and stops at maxQuestions', () => {
    expect(run(bundle, 'senior', 'k').answers).toEqual(run(bundle, 'senior', 'k').answers)
    expect(run(bundle, 'senior').result.level).toBe('senior')
    const capped = structuredClone(bundle)
    capped.placement.maxQuestions = 1
    const r = run(capped, 'god')
    expect(r.answers).toHaveLength(1)
    expect(r.result.confident).toBe(false)
  })
})

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { gradeQuiz } from '@/content/blocks/quiz/grade'
import type { LearningUnit, QuizUnit } from '@/content/model'
import { loadSnapshot, type ContentSnapshot } from '@/content/store'
import {
  buildCoursePath,
  buildTopicTest,
  compileCourse,
  parseCourseYaml,
  placementCandidates,
  placementTest,
  scoreTest,
  testKindOf,
  type CourseBundle,
  type PathProgress,
} from '@/course'
import { courseIdOf, courseListing, parseBundles } from '@/server/courses/bundles'
import { planLegacyMigration } from '@/server/courses/legacy-core'
import { placementSeed, replayPlacement, type RawPlacementAnswer } from '@/server/courses/placement-core'
import { nextStepAfter, pathSteps } from '@/server/courses/steps'
import { attemptSeed, drawTest, fallbackPool, gradeAnswer, resolveTest, testBonus, TEST_XP } from '@/server/courses/tests-core'

const vaultPath = path.resolve(__dirname, '../fixtures/course-vault')
let bundle: CourseBundle
let snap: ContentSnapshot

beforeAll(async () => {
  snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
  const manifest = parseCourseYaml(readFileSync(path.join(vaultPath, 'Courses/fixture-course/course.yaml'), 'utf8')).manifest!
  bundle = compileCourse(manifest, snap)
})

const unit = (id: string) => snap.units.get(id) ?? null
const quiz = (id: string) => snap.units.get(id) as QuizUnit
const rightAnswer = (u: QuizUnit) => ({ chosen: u.options.filter((o) => o.correct).map((o) => o.id), text: null })
const wrongAnswer = (u: QuizUnit) => ({ chosen: u.options.filter((o) => !o.correct).map((o) => o.id).slice(0, 1), text: null })

describe('course registry (bundle files)', () => {
  it('loads valid bundles and skips broken ones', () => {
    const good = JSON.stringify(bundle)
    const { courses, errors } = parseBundles([
      { name: 'fixture-course.json', text: good },
      { name: 'broken.json', text: '{nope' },
      { name: 'other-name.json', text: good },
      { name: 'invalid.json', text: JSON.stringify({ format: 1, course: {} }) },
      { name: 'README.md', text: '# not a bundle' },
    ])
    expect([...courses.keys()]).toEqual(['fixture-course'])
    expect(courses.get('fixture-course')).toMatchObject({ source: 'official', listed: true })
    expect(errors).toHaveLength(3)
    expect(errors.join('\n')).toMatch(/other-name\.json: course id «fixture-course»/)
  })

  it('lists a course for the marketplace with hooks for price and social', () => {
    const { courses } = parseBundles([{ name: 'fixture-course.json', text: JSON.stringify(bundle) }])
    const listing = courseListing(courses.get('fixture-course')!)
    expect(listing.sections.map((s) => [s.key, s.kind])).toEqual([
      ['basics', 'path'],
      ['advanced', 'path'],
      ['practice', 'practice'],
    ])
    expect(listing).toMatchObject({ id: 'fixture-course', price: null, social: { likes: null, comments: null } })
    expect(listing.levels.to).toBe('god')
  })

  it('finds the course of any course-scoped id', () => {
    expect(courseIdOf('fixture-course:basics:al-ch-01:core-1')).toBe('fixture-course')
    expect(courseIdOf('fixture-course:basics:exam')).toBe('fixture-course')
    expect(courseIdOf('al-ch-01::core-1')).toBe('al-ch-01')
    expect(courseIdOf('no-colon')).toBeNull()
    expect(courseIdOf('Bad Id:x')).toBeNull()
  })
})

describe('server-side quiz grading', () => {
  const base = { id: 'q', kind: 'quiz', guideId: 'g', chapterId: 'c', sectionSlug: null, level: null, tags: [], idSource: 'explicit', searchText: '', prompt: [], promptText: '', body: { type: 'root', children: [] }, explanation: null } as const

  it('checks option sets exactly (single and multi)', () => {
    const u = { ...base, mode: 'multi', options: [{ id: 'a', content: [], correct: true }, { id: 'b', content: [], correct: false }, { id: 'c', content: [], correct: true }], freeAnswer: null, exercise: null } as unknown as QuizUnit
    expect(gradeQuiz(u, { chosen: ['c', 'a'] })).toBe(true)
    expect(gradeQuiz(u, { chosen: ['a'] })).toBe(false)
    expect(gradeQuiz(u, { chosen: ['a', 'b', 'c'] })).toBe(false)
    expect(gradeQuiz(u, { chosen: ['a', 'a', 'c'] })).toBe(true)
    expect(gradeQuiz(u, { chosen: [] })).toBe(false)
  })

  it('normalizes free «what does it print» answers', () => {
    const u = { ...base, mode: 'output', options: [], freeAnswer: '1, 4, 3, 2', exercise: null } as unknown as QuizUnit
    expect(gradeQuiz(u, { chosen: [], text: ' 1 4 3 2 ' })).toBe(true)
    expect(gradeQuiz(u, { chosen: [], text: '`1;4;3;2`' })).toBe(true)
    expect(gradeQuiz(u, { chosen: [], text: '1 2 3 4' })).toBe(false)
    expect(gradeQuiz(u, { chosen: [], text: '' })).toBe(false)
  })

  it('checks order and fill exercises', () => {
    const order = {
      ...base,
      mode: 'order',
      options: [],
      freeAnswer: null,
      exercise: { kind: 'order', lang: 'js', pieces: [{ id: 'p0', code: 'a()', distractor: false }, { id: 'p1', code: 'x()', distractor: true }, { id: 'p2', code: 'b()', distractor: false }] },
    } as unknown as QuizUnit
    expect(gradeQuiz(order, { chosen: ['p0', 'p2'] })).toBe(true)
    expect(gradeQuiz(order, { chosen: ['p2', 'p0'] })).toBe(false)
    expect(gradeQuiz(order, { chosen: ['p0', 'p1', 'p2'] })).toBe(false)
    const fill = {
      ...base,
      mode: 'fill',
      options: [],
      freeAnswer: null,
      exercise: { kind: 'fill', lang: 'js', bank: null, segments: [{ kind: 'text', value: 'const ' }, { kind: 'blank', id: 'b0', answers: ['x', 'y'] }, { kind: 'text', value: ' = 1' }] },
    } as unknown as QuizUnit
    expect(gradeQuiz(fill, { chosen: ['y'] })).toBe(true)
    expect(gradeQuiz(fill, { chosen: ['z'] })).toBe(false)
    expect(gradeQuiz(fill, { chosen: [] })).toBe(false)
  })
})

describe('topic tests and section exams on the server', () => {
  const testId = 'fixture-course:basics:al-ch-01:test'
  const examId = 'fixture-course:basics:exam'

  it('resolves test and exam ids', () => {
    expect(testKindOf(testId)).toBe('topic-test')
    expect(testKindOf(examId)).toBe('section-exam')
    expect(testKindOf('fixture-course:basics:al-ch-01:core-1')).toBeNull()
    expect(resolveTest(bundle, testId)).toMatchObject({ kind: 'topic-test', topic: { id: 'fixture-course:basics:al-ch-01' } })
    expect(resolveTest(bundle, examId)).toMatchObject({ kind: 'section-exam', topic: null, section: { key: 'basics' } })
    expect(resolveTest(bundle, 'fixture-course:practice:exam')).toBeNull()
    expect(resolveTest(bundle, 'fixture-course:basics:nope:test')).toBeNull()
  })

  it('draws attempt n with the seed `${userId}:${n}`', () => {
    const test = resolveTest(bundle, testId)!
    expect(attemptSeed('u1', 3)).toBe('u1:3')
    expect(drawTest(test, attemptSeed('u1', 3))).toEqual(buildTopicTest(bundle, test.topic!.id, 'u1:3'))
  })

  it('grades from submitted answers, never the client flag; no skipping or reordering', () => {
    const test = resolveTest(bundle, testId)!
    const built = drawTest(test, 'u1:1')!
    const fallback = fallbackPool(test)
    const answers = built.questions.map((id, i) => ({ id, ...(i === 0 ? wrongAnswer(quiz(id)) : rightAnswer(quiz(id))), rating: null }))
    const scored = scoreTest(built, answers, (id, i) => gradeAnswer(built, unit(id), answers[i], fallback))
    expect(scored).toMatchObject({ ok: true, correct: built.questions.length - 1, total: built.questions.length })
    expect(scored.passed).toBe(built.questions.length - 1 >= built.needed)
    expect(scored.results[0]).toBe(false)
    // skipped / reordered / foreign answers are rejected outright
    expect(scoreTest(built, answers.slice(1), () => true).ok).toBe(false)
    expect(scoreTest(built, [...answers].reverse(), () => true).ok).toBe(false)
    expect(scoreTest(built, answers.map((a, i) => (i === 0 ? { ...a, id: 'al-03-quiz-01' } : a)), () => true).ok).toBe(false)
  })

  it('accepts self-rated cards only from the fallback pool of a thin topic', () => {
    const thin = resolveTest(bundle, 'fixture-course:basics:alpha-02:test')!
    const built = drawTest(thin, 'u2:1')!
    const card = built.questions.find((id) => unit(id)?.kind === 'flashcard')!
    expect(card).toBeTruthy()
    const fallback = fallbackPool(thin)
    expect(gradeAnswer(built, unit(card), { id: card, chosen: [], text: null, rating: 'good' }, fallback)).toBe(true)
    expect(gradeAnswer(built, unit(card), { id: card, chosen: [], text: null, rating: 'again' }, fallback)).toBe(false)
    expect(gradeAnswer(built, unit(card), { id: card, chosen: [], text: null, rating: 'good' }, new Set())).toBe(false)
    // a quiz can't be «self-rated»
    const q = built.questions.find((id) => unit(id)?.kind === 'quiz')!
    expect(gradeAnswer(built, unit(q), { id: q, chosen: [], text: null, rating: 'good' }, fallback)).toBe(false)
  })

  it('pays the bonus once per first pass and once per first perfect score', () => {
    expect(testBonus('topic-test', { passed: false, bestScore: 0.5 }, { passed: true, score: 0.8, testOut: false })).toBe(TEST_XP.topic)
    expect(testBonus('topic-test', { passed: true, bestScore: 0.8 }, { passed: true, score: 1, testOut: false })).toBe(TEST_XP.perfect)
    expect(testBonus('topic-test', { passed: true, bestScore: 1 }, { passed: true, score: 1, testOut: false })).toBe(0)
    expect(testBonus('section-exam', { passed: false, bestScore: 0 }, { passed: true, score: 0.9, testOut: true })).toBe(TEST_XP.exam + TEST_XP.testOut)
    expect(testBonus('section-exam', { passed: false, bestScore: 0 }, { passed: false, score: 0.5, testOut: false })).toBe(0)
  })
})

describe('course path', () => {
  const empty = (): PathProgress => ({ lessons: new Set(), studied: new Set(), tests: new Map(), exams: new Map() })

  it('starts at the first lesson, later path sections locked, practice open', () => {
    const view = buildCoursePath(bundle, 'junior', empty())
    expect(view.current).toMatchObject({ type: 'lesson', id: 'fixture-course:basics:al-ch-01:theory-1' })
    expect(view.nextLesson?.id).toBe('fixture-course:basics:al-ch-01:start-1')
    expect(view.sections.map((s) => s.state)).toEqual(['current', 'locked', 'open'])
    const topic = view.sections[0]!.topics[0]!
    expect(topic.nodes.at(-1)).toMatchObject({ type: 'test', id: 'fixture-course:basics:al-ch-01:test', done: false })
    expect(view.sections[0]!.exam).toMatchObject({ id: 'fixture-course:basics:exam', testOut: { eligible: true } })
    expect(view.sections[2]!.exam).toBeNull()
  })

  it('counts theory as done once a practice lesson of the topic is done, then points at the topic test', () => {
    const topic = bundle.sections[0]!.topics[0]!
    const lessons = new Set(topic.lessons.filter((l) => l.kind !== 'theory').map((l) => l.id))
    const view = buildCoursePath(bundle, 'junior', { ...empty(), lessons })
    expect(view.sections[0]!.topics[0]!.nodes[0]).toMatchObject({ kind: 'theory', done: true })
    expect(view.current).toMatchObject({ type: 'test', id: topic.test!.id })
  })

  it('a passed exam (test-out) marks the section known and unlocks the next', () => {
    const exams = new Map([['fixture-course:basics:exam', { bestScore: 0.9, passed: true, testOut: true }]])
    const view = buildCoursePath(bundle, 'junior', { ...empty(), exams })
    expect(view.sections[0]).toMatchObject({ state: 'done', known: 'exam' })
    expect(view.sections[0]!.topics.every((t) => t.nodes.every((n) => n.done))).toBe(true)
    expect(view.sections[0]!.topics[0]!.nodes[1]).toMatchObject({ done: true, skipped: true })
    expect(view.sections[1]!.state).toBe('current')
    expect(view.current?.sectionId).toBe('fixture-course:advanced')
  })

  it('placement starts further ahead; earlier sections count as known', () => {
    const view = buildCoursePath(bundle, 'middle', { ...empty(), placementSection: 1 })
    expect(view.sections[0]).toMatchObject({ state: 'done', known: 'placement' })
    expect(view.sections[1]!.state).toBe('current')
  })

  it('marks below-level lessons optional (not required for progress)', () => {
    const view = buildCoursePath(bundle, 'senior', empty())
    const nodes = view.sections[0]!.topics[0]!.nodes
    expect(nodes.find((n) => n.id.endsWith(':core-1'))).toMatchObject({ optional: true, required: false })
    // the optional lessons are skipped by the cursor
    expect(view.current?.id).not.toMatch(/:core-1$/)
  })

  it('knows the playable order (lessons → topic test → … → section exam)', () => {
    const steps = pathSteps(bundle, 'junior')
    const topic = bundle.sections[0]!.topics[0]!
    const lastLesson = topic.lessons.filter((l) => l.kind !== 'theory').at(-1)!
    expect(nextStepAfter(bundle, 'junior', lastLesson.id)).toEqual({ type: 'test', id: topic.test!.id })
    const exam = steps.findIndex((s) => s.id === 'fixture-course:basics:exam')
    expect(steps[exam - 1]).toEqual({ type: 'test', id: 'fixture-course:basics:alpha-02:test' })
    expect(nextStepAfter(bundle, 'junior', 'fixture-course:basics:exam')?.id).toMatch(/^fixture-course:advanced:/)
  })
})

describe('placement on the server', () => {
  const seed = placementSeed('user-1', 'abcdef12')

  function answerAll(knows: (u: LearningUnit) => boolean): { answers: RawPlacementAnswer[]; asked: Set<string> } {
    const answers: RawPlacementAnswer[] = []
    for (let i = 0; i < 40; i++) {
      const run = replayPlacement(bundle, answers, seed, unit)
      if (!run.ok || run.step.done) break
      const u = quiz(run.step.next!)
      answers.push({ id: u.id, ...(knows(u) ? rightAnswer(u) : wrongAnswer(u)) })
    }
    return { answers, asked: new Set(answers.map((a) => a.id)) }
  }

  it('grades answers itself and returns the result at the end', () => {
    const { answers } = answerAll(() => true)
    const run = replayPlacement(bundle, answers, seed, unit)
    expect(run.ok && run.step.done).toBe(true)
    expect(run.ok && run.result).toMatchObject({ level: 'senior' })
    // the same questions with wrong answers place lower, whatever the client claims
    const lower = replayPlacement(bundle, answers.map((a) => ({ ...a, ...wrongAnswer(quiz(a.id)) })).slice(0, 2), seed, unit)
    expect(lower.ok && lower.graded.every((g) => !g.correct)).toBe(true)
  })

  it('rejects answers to questions it would not have asked', () => {
    const first = placementTest(bundle, [], seed).next!
    const other = bundle.placement.pool.senior!.find((id) => id !== first)!
    expect(replayPlacement(bundle, [{ id: other, ...rightAnswer(quiz(other)) }], seed, unit)).toEqual({ ok: false, reason: 'out-of-order' })
    expect(replayPlacement(bundle, [{ id: first, ...rightAnswer(quiz(first)) }], seed, unit).ok).toBe(true)
  })

  it('pre-renders every question a run can ask', () => {
    const candidates = new Set(placementCandidates(bundle, seed))
    for (const knows of [() => true, () => false, (u: LearningUnit) => u.level === 'junior']) {
      for (const id of answerAll(knows).asked) expect(candidates.has(id)).toBe(true)
    }
  })
})

describe('legacy lesson progress', () => {
  it('maps old lesson ids to course ids, merging duplicates and keeping unknown rows', () => {
    const row = (lessonId: string, completions = 1, bestAccuracy = 0.5) => ({ lessonId, completions, bestAccuracy, lastXp: 10, firstCompletedAt: 100, lastCompletedAt: 200 })
    const plan = planLegacyMigration(bundle, [row('al-ch-01::core-1', 2, 0.8), row('al-ch-01::start-1'), row('zz-ch-99::core-1'), row('fixture-course:basics:al-ch-01:core-2')])
    expect(plan.migrated).toEqual(['al-ch-01::core-1', 'al-ch-01::start-1'])
    expect(plan.rows).toEqual([
      expect.objectContaining({ lessonId: 'fixture-course:basics:al-ch-01:core-1', courseId: 'fixture-course', guideId: 'alpha', chapterId: 'al-ch-01', completions: 2, bestAccuracy: 0.8, from: 'al-ch-01::core-1' }),
      expect.objectContaining({ lessonId: 'fixture-course:basics:al-ch-01:start-1' }),
    ])
    // idempotent: running on the migrated rows changes nothing
    expect(planLegacyMigration(bundle, plan.rows).rows).toEqual([])
  })
})

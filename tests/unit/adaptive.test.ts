import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import type { LearningUnit } from '@/content/model'
import { loadSnapshot } from '@/content/store'
import {
  CEFR_LEVELS,
  compileCourse,
  currentSkills,
  deriveDifficulty,
  difficultyOf,
  difficultyScore,
  exerciseSkill,
  initialSkills,
  levelSuggestion,
  orderNewWords,
  parseCourseYaml,
  rankMistakes,
  selectPractice,
  skillsView,
  topicKindOf,
  updateSkills,
  type CourseBundle,
  type ExerciseRef,
  type LearnerLevels,
  type Level,
  type PracticeCandidate,
  type SkillObservation,
  type SkillState,
} from '@/course'

const levels: Level[] = [...CEFR_LEVELS]

// ── Difficulty, skill and topic kind (compile time) ──

const quiz = (mode: string, extra: Partial<LearningUnit> = {}): LearningUnit => ({ id: 'q', kind: 'quiz', mode, options: [], ...extra }) as unknown as LearningUnit
const word = (w: string, forms: string | null = null): LearningUnit => ({ id: 'w', kind: 'flashcard', word: { word: w, forms } }) as unknown as LearningUnit

describe('difficulty derivation', () => {
  const base = { position: 0, count: 10, topicKind: 'grammar' as const, ownLevel: null, assignedLevel: 'A1' as Level }

  it('ranks formats: recognising < choosing < producing', () => {
    expect(deriveDifficulty({ ...base, unit: word('apple'), kind: 'word' })).toBe('easy')
    expect(deriveDifficulty({ ...base, unit: quiz('single'), kind: 'quiz' })).toBe('easy')
    expect(deriveDifficulty({ ...base, unit: quiz('fill'), kind: 'quiz' })).toBe('medium')
    expect(deriveDifficulty({ ...base, unit: quiz('order'), kind: 'quiz' })).toBe('medium')
    expect(deriveDifficulty({ ...base, unit: quiz('listen', { listen: { type: 'dictation', lines: [], slow: false, accept: [] } } as Partial<LearningUnit>), kind: 'listen' })).toBe('hard')
    expect(difficultyScore({ ...base, unit: quiz('fill'), kind: 'quiz' })).toBeGreaterThan(difficultyScore({ ...base, unit: quiz('single'), kind: 'quiz' }))
  })

  it('later in the topic is harder; review and skills topics add effort', () => {
    const first = deriveDifficulty({ ...base, unit: quiz('single'), kind: 'quiz', position: 0 })
    const last = deriveDifficulty({ ...base, unit: quiz('single'), kind: 'quiz', position: 9 })
    expect([first, last]).toEqual(['easy', 'medium'])
    expect(deriveDifficulty({ ...base, unit: quiz('fill'), kind: 'quiz', position: 9 })).toBe('hard')
    expect(difficultyScore({ ...base, unit: quiz('single'), kind: 'quiz', topicKind: 'review' })).toBe(difficultyScore({ ...base, unit: quiz('single'), kind: 'quiz' }) + 0.5)
  })

  it('multi-word headwords and irregular forms make a word card harder', () => {
    expect(difficultyScore({ ...base, unit: word('look after'), kind: 'word' })).toBeGreaterThan(difficultyScore({ ...base, unit: word('look'), kind: 'word' }))
    expect(difficultyScore({ ...base, unit: word('go', 'go → went → gone'), kind: 'word' })).toBeGreaterThan(difficultyScore({ ...base, unit: word('go'), kind: 'word' }))
  })

  it('an exercise above / below the level it was given shifts a band', () => {
    expect(deriveDifficulty({ ...base, unit: quiz('single'), kind: 'quiz', ownLevel: 'A2', assignedLevel: 'A1' })).toBe('hard')
    expect(deriveDifficulty({ ...base, unit: quiz('fill'), kind: 'quiz', ownLevel: 'A1', assignedLevel: 'A2' })).toBe('easy')
  })

  it('authored values win: task difficulty and quiz diff', () => {
    expect(deriveDifficulty({ ...base, unit: { id: 't', kind: 'task', difficulty: 'hard' } as unknown as LearningUnit, kind: 'task' })).toBe('hard')
    expect(deriveDifficulty({ ...base, unit: quiz('order', { diff: 1 } as Partial<LearningUnit>), kind: 'quiz', position: 9 })).toBe('easy')
  })

  it('buckets the score', () => {
    expect([difficultyOf(0), difficultyOf(1.24), difficultyOf(1.25), difficultyOf(2.49), difficultyOf(2.5)]).toEqual(['easy', 'easy', 'medium', 'medium', 'hard'])
  })

  it('topic kind = the first kind tag; skill by block and topic kind', () => {
    expect(topicKindOf(['english', 'a1', 'review', 'test', 'grammar'])).toBe('review')
    expect(topicKindOf(['english', 'a2', 'skills', 'reading', 'review'])).toBe('skills')
    expect(topicKindOf(['english', 'a1', 'Grammar'])).toBe('grammar')
    expect(topicKindOf(['javascript', 'closures'])).toBeUndefined()
    expect(exerciseSkill(word('apple'), 'word', 'grammar')).toBe('vocabulary')
    expect(exerciseSkill(quiz('listen'), 'listen', 'grammar')).toBe('listening')
    expect(exerciseSkill(quiz('pair'), 'pair', 'vocabulary')).toBe('pronunciation')
    expect(exerciseSkill(quiz('single'), 'quiz', 'vocabulary')).toBe('vocabulary')
    expect(exerciseSkill(quiz('single'), 'quiz', 'skills')).toBe('reading')
    expect(exerciseSkill(quiz('single'), 'quiz', 'review')).toBe('grammar')
    expect(exerciseSkill(quiz('single', { skill: 'listening' } as Partial<LearningUnit>), 'quiz', 'grammar')).toBe('listening')
  })
})

describe('difficulty in a compiled language course', () => {
  let bundle: CourseBundle
  beforeAll(async () => {
    const vault = path.resolve(__dirname, '../fixtures/lang-vault')
    const snap = await loadSnapshot({ vaultPath: vault, guidesDir: 'Guides' }, new Map(), 1)
    bundle = compileCourse(parseCourseYaml(readFileSync(path.join(vault, 'Courses/english-test/course.yaml'), 'utf8')).manifest!, snap)
  })

  it('every exercise has a difficulty and a skill, topics a kind', () => {
    const list = Object.values(bundle.exercises)
    expect(list.length).toBeGreaterThan(0)
    expect(list.every((e) => e.difficulty !== null && e.skill !== undefined)).toBe(true)
    const topics = bundle.sections.flatMap((s) => s.topics)
    expect(topics.map((t) => t.kind)).toEqual(['vocabulary', 'grammar'])
    expect(bundle.exercises['en-a1-hello-w01']).toMatchObject({ kind: 'word', skill: 'vocabulary', difficulty: 'easy' })
    expect(list.filter((e) => e.kind === 'listen').every((e) => e.skill === 'listening')).toBe(true)
    expect(list.filter((e) => e.kind === 'pair' || e.kind === 'speak').every((e) => e.skill === 'pronunciation')).toBe(true)
  })

  it('is deterministic', async () => {
    const vault = path.resolve(__dirname, '../fixtures/lang-vault')
    const snap = await loadSnapshot({ vaultPath: vault, guidesDir: 'Guides' }, new Map(), 1)
    const again = compileCourse(parseCourseYaml(readFileSync(path.join(vault, 'Courses/english-test/course.yaml'), 'utf8')).manifest!, snap)
    expect(Object.values(again.exercises).map((e) => [e.id, e.difficulty, e.skill])).toEqual(Object.values(bundle.exercises).map((e) => [e.id, e.difficulty, e.skill]))
  })
})

// ── Practice selection ──

let n = 0
const ex = (level: Level, topicId: string, extra: Partial<ExerciseRef> = {}): PracticeCandidate => ({ id: `e${n++}-${level}-${topicId}`, level, topicId, difficulty: 'medium', skill: 'grammar', mode: 'single', kind: 'quiz', ...extra })
const learnerAt = (level: Level, skills: LearnerLevels['skills'] = {}): LearnerLevels => ({ overall: levels.indexOf(level) + 0.5, skills })

describe('selectPractice', () => {
  // 3 topics per level A1…C1, 8 exercises each, mixed formats
  const pool: PracticeCandidate[] = []
  for (const level of ['A1', 'A2', 'B1', 'B2', 'C1'] as Level[]) for (const t of ['x', 'y', 'z']) for (let i = 0; i < 8; i++) pool.push(ex(level, `${level}-${t}`, { mode: i % 2 ? 'fill' : 'single', difficulty: i < 3 ? 'easy' : i < 6 ? 'medium' : 'hard' }))

  it('keeps to the learner level ± 1 and is deterministic', () => {
    const pick = selectPractice({ candidates: pool, learner: learnerAt('B1'), size: 12, seed: 'u1' })
    const byId = new Map(pool.map((c) => [c.id, c]))
    expect(pick.ids).toHaveLength(12)
    expect(new Set(pick.ids).size).toBe(12)
    expect(pick.ids.every((id) => ['A2', 'B1', 'B2'].includes(byId.get(id)!.level))).toBe(true)
    expect(pick.band).toBe(1)
    expect(selectPractice({ candidates: pool, learner: learnerAt('B1'), size: 12, seed: 'u1' }).ids).toEqual(pick.ids)
    expect(selectPractice({ candidates: pool, learner: learnerAt('B1'), size: 12, seed: 'u2' }).ids).not.toEqual(pick.ids)
  })

  it('prefers the learner level over the neighbours', () => {
    const byId = new Map(pool.map((c) => [c.id, c]))
    const counts: Record<string, number> = {}
    for (let s = 0; s < 60; s++) for (const id of selectPractice({ candidates: pool, learner: learnerAt('B1'), size: 10, seed: s }).ids) counts[byId.get(id)!.level] = (counts[byId.get(id)!.level] ?? 0) + 1
    expect(counts.B1!).toBeGreaterThan(counts.A2!)
    expect(counts.B2!).toBeGreaterThan(0)
    expect(counts.A2!).toBeGreaterThan(0)
  })

  it('uses the level of the exercise skill', () => {
    const mixed = [...pool.filter((c) => c.level === 'A1'), ...pool.filter((c) => c.level === 'C1').map((c) => ({ ...c, skill: 'listening' as const }))]
    const pick = selectPractice({ candidates: mixed, learner: learnerAt('A1', { listening: 4.5 }), size: 40, seed: 3 })
    const byId = new Map(mixed.map((c) => [c.id, c]))
    // grammar at A1 and listening at C1 both fit their own skill level
    expect(new Set(pick.ids.map((id) => byId.get(id)!.level))).toEqual(new Set(['A1', 'C1']))
  })

  it('widens the band when the learner is beyond the content', () => {
    const low = pool.filter((c) => c.level === 'A1' || c.level === 'A2')
    const pick = selectPractice({ candidates: low, learner: learnerAt('C2'), size: 10, seed: 1 })
    expect(pick.ids).toHaveLength(10)
    expect(pick.widened).toBe(true)
    expect(pick.inBand).toBe(0)
  })

  it('no band when the learner filtered themselves', () => {
    const pick = selectPractice({ candidates: pool, learner: learnerAt('A1'), size: 120, seed: 1, band: null })
    expect(pick.band).toBeNull()
    expect(pick.ids).toHaveLength(120)
  })

  it('weights topics with open mistakes, recent wrong answers and low test scores', () => {
    const b1 = pool.filter((c) => c.level === 'B1')
    const weak = b1.filter((c) => c.topicId === 'B1-x')
    const signals = {
      mistakes: new Map(weak.slice(0, 2).map((c) => [c.id, { wrongCount: 2 }])),
      recentWrong: new Map(weak.slice(2, 4).map((c) => [c.id, 2])),
      topicScores: new Map([['B1-x', 0.5]]),
      // everything seen before, so the new-material quota doesn't blur the comparison
      last: new Map(b1.map((c) => [c.id, true])),
    }
    let weakHits = 0
    let otherHits = 0
    for (let s = 0; s < 80; s++) {
      for (const id of selectPractice({ candidates: b1, learner: learnerAt('B1'), size: 6, seed: s, signals }).ids) {
        if (id.endsWith('B1-x')) weakHits++
        else otherHits++
      }
    }
    // 1 topic of 3: without weighting ~⅓ of the picks
    expect(weakHits / (weakHits + otherHits)).toBeGreaterThan(0.42)
  })

  it('keeps sessions varied: topic and format caps', () => {
    const b1 = pool.filter((c) => c.level === 'B1')
    const signals = { mistakes: new Map(b1.filter((c) => c.topicId === 'B1-x').map((c) => [c.id, { wrongCount: 5 }])) }
    const pick = selectPractice({ candidates: b1, learner: learnerAt('B1'), size: 9, seed: 7, signals })
    const byTopic: Record<string, number> = {}
    for (const id of pick.ids) byTopic[b1.find((c) => c.id === id)!.topicId] = (byTopic[b1.find((c) => c.id === id)!.topicId] ?? 0) + 1
    expect(Math.max(...Object.values(byTopic))).toBeLessThanOrEqual(Math.ceil(9 * 0.4))
    const fills = pick.ids.filter((id) => b1.find((c) => c.id === id)!.mode === 'fill').length
    expect(fills).toBeLessThanOrEqual(Math.ceil(9 * 0.6))
  })

  it('never starves new material, even with many mistakes', () => {
    const b1 = pool.filter((c) => c.level === 'B1')
    const seen = b1.slice(0, 18)
    const signals = { mistakes: new Map(seen.map((c) => [c.id, { wrongCount: 3 }])), last: new Map(seen.map((c) => [c.id, false])) }
    const pick = selectPractice({ candidates: b1, learner: learnerAt('B1'), size: 10, seed: 11, signals })
    expect(pick.stats.unseen).toBeGreaterThanOrEqual(3)
    expect(pick.stats.mistakes).toBeGreaterThan(0)
  })

  it('a small pool gives what it has', () => {
    expect(selectPractice({ candidates: pool.slice(0, 3), learner: learnerAt('A1'), size: 10, seed: 1 }).ids).toHaveLength(3)
    expect(selectPractice({ candidates: [], learner: learnerAt('A1'), size: 10, seed: 1 }).ids).toEqual([])
  })
})

describe('words and mistakes', () => {
  it('new words: own level first, then one below, then one above, then by distance (document order)', () => {
    const words = (['C1', 'A1', 'B2', 'B1', 'A2', 'B1'] as Level[]).map((level, i) => ({ id: `w${i}`, level }))
    expect(orderNewWords(words, 2.4).map((w) => w.level)).toEqual(['B1', 'B1', 'A2', 'B2', 'C1', 'A1'])
    expect(orderNewWords(words, 2.4).slice(0, 2).map((w) => w.id)).toEqual(['w3', 'w5'])
  })

  it('mistakes: in-band and troubled topics first, no long runs of one topic', () => {
    const rows = [
      { ...ex('A1', 't1'), wrongCount: 1, lastWrongAt: 1 },
      { ...ex('C1', 'far'), wrongCount: 5, lastWrongAt: 1 },
      { ...ex('B1', 't2'), wrongCount: 4, lastWrongAt: 2 },
      { ...ex('B1', 't2'), wrongCount: 4, lastWrongAt: 3 },
      { ...ex('B1', 't2'), wrongCount: 4, lastWrongAt: 4 },
      { ...ex('B1', 't3'), wrongCount: 1, lastWrongAt: 5 },
    ]
    const order = rankMistakes(rows, learnerAt('B1'))
    expect(order).toHaveLength(rows.length)
    const topics = order.map((id) => rows.find((r) => r.id === id)!.topicId)
    expect(topics.slice(0, 2)).toEqual(['t2', 't2'])
    expect(topics[2]).not.toBe('t2')
    // out of band (A1 and C1 for a B1 learner) last
    expect(topics.slice(-2).sort()).toEqual(['far', 't1'])
  })
})

// ── Skill estimate ──

const obs = (count: number, right: number, level: Level = 'A1', extra: Partial<SkillObservation> = {}): SkillObservation[] =>
  Array.from({ length: count }, (_, i) => ({ skill: 'grammar', level, diff: 2, options: 4, correct: i < right, ...extra }))

describe('skill update', () => {
  it('starts from the placement per skill, else from the course level', () => {
    const s = initialSkills({ level: 'A2', placement: { at: 5, skills: { grammar: { level: 'B1', measured: true }, reading: { level: 'C1', measured: false } } } }, levels)
    expect(s.skills.grammar).toMatchObject({ mu: 2.5, sd: 0.5 })
    expect(s.skills.reading).toMatchObject({ mu: 1.5, sd: 0.8 })
    expect(s.skills.pronunciation).toMatchObject({ mu: 1.5 })
    expect(s.basis).toEqual({ level: 'A2', placementAt: 5 })
  })

  it('right answers raise, wrong answers lower, more answers move less', () => {
    const start = initialSkills({ level: 'A2' }, levels)
    const up = updateSkills(start, obs(10, 10, 'A2'), levels, 1)
    const down = updateSkills(start, obs(10, 3, 'A2'), levels, 1)
    expect(up.skills.grammar!.mu).toBeGreaterThan(start.skills.grammar!.mu + 0.3)
    expect(down.skills.grammar!.mu).toBeLessThan(start.skills.grammar!.mu - 0.3)
    expect(up.skills.grammar!.sd).toBeLessThan(start.skills.grammar!.sd)
    expect(up.skills.grammar).toMatchObject({ n: 10, right: 10 })
    // other skills untouched
    expect(up.skills.listening).toEqual(start.skills.listening)
    // the second identical test moves the estimate less than the first
    const again = updateSkills(up, obs(10, 10, 'A2'), levels, 2)
    expect(again.skills.grammar!.mu - up.skills.grammar!.mu).toBeLessThan(up.skills.grammar!.mu - start.skills.grammar!.mu)
  })

  it('hard items and typed answers say more than easy guesses', () => {
    const start = initialSkills({ level: 'A2' }, levels)
    const easy = updateSkills(start, obs(8, 8, 'A2', { diff: 1 }), levels, 1).skills.grammar!.mu
    const hard = updateSkills(start, obs(8, 8, 'A2', { diff: 3 }), levels, 1).skills.grammar!.mu
    const typed = updateSkills(start, obs(8, 8, 'A2', { options: 0 }), levels, 1).skills.grammar!.mu
    const choice = updateSkills(start, obs(8, 8, 'A2', { options: 4 }), levels, 1).skills.grammar!.mu
    expect(hard).toBeGreaterThan(easy)
    expect(typed).toBeGreaterThan(choice)
  })

  it('an A1 learner acing A1 tests ends up around A2', () => {
    let s = initialSkills({ level: 'A1' }, levels)
    for (let i = 0; i < 3; i++) s = updateSkills(s, obs(10, 10, 'A1'), levels, i)
    const v = skillsView(s, levels)
    expect(v.skills.find((x) => x.skill === 'grammar')!.level).toBe('A2')
    // the overall level averages the four placement skills: one strong skill doesn't lift it alone
    expect(v.overall).toBe('A1')
    expect(v.ielts?.label).toBe('нижче 4.0')
  })

  it('a stored estimate is dropped when the level or the placement changes, tampered rows are ignored', () => {
    const s = updateSkills(initialSkills({ level: 'A2' }, levels), obs(10, 10, 'A2'), levels, 1)
    expect(currentSkills(s, { level: 'A2' }, levels).skills.grammar!.n).toBe(10)
    expect(currentSkills(s, { level: 'B1' }, levels).skills.grammar!.n).toBe(0)
    expect(currentSkills(s, { level: 'A2', placement: { at: 9 } }, levels).skills.grammar!.n).toBe(0)
    expect(currentSkills({ v: 1, basis: s.basis, skills: { grammar: { mu: 'x' } }, updatedAt: 1 }, { level: 'A2' }, levels).skills.grammar!.n).toBe(0)
    expect(currentSkills(null, { level: 'A2' }, levels).skills.grammar!.mu).toBe(1.5)
    // out-of-range numbers are clamped
    const wild = { ...s, skills: { grammar: { mu: 99, sd: 0.01, n: 3, right: 3 } } }
    expect(currentSkills(wild, { level: 'A2' }, levels).skills.grammar).toMatchObject({ mu: 7, sd: 0.3 })
  })
})

// ── Skip ahead / review ──

function course(): CourseBundle {
  const section = (key: string, index: number, level: Level, opts: { planned?: boolean; review?: boolean } = {}) => ({
    id: `c:${key}`,
    key,
    index,
    kind: 'path',
    level,
    minLevel: level,
    status: opts.planned ? 'planned' : 'active',
    title: `${level} — розділ`,
    topics: opts.planned
      ? []
      : [
          { id: `c:${key}:t1`, key: `${key}-t1`, kind: 'grammar', test: { id: `c:${key}:t1:test` }, lessons: [] },
          ...(opts.review ? [{ id: `c:${key}:rev`, key: `${key}-rev`, kind: 'review', test: { id: `c:${key}:rev:test` }, lessons: [] }] : []),
        ],
    exam: opts.planned ? null : { id: `c:${key}:exam`, testOut: true },
  })
  return { course: { levels }, sections: [section('a1', 0, 'A1', { review: true }), section('a2', 1, 'A2'), section('b1', 2, 'B1', { planned: true })] } as unknown as CourseBundle
}

const stateAt = (theta: number): SkillState => {
  const s = initialSkills({ level: 'A1' }, levels)
  for (const k of Object.keys(s.skills) as Array<keyof SkillState['skills']>) s.skills[k] = { mu: theta, sd: 0.4, n: 10, right: 8 }
  return s
}

describe('skip ahead and review', () => {
  const ten = obs(10, 10)

  it('clearly stronger after a topic test → test out of the section', () => {
    const s = levelSuggestion({ bundle: course(), sectionId: 'c:a1', testKind: 'topic-test', score: 1, passed: true, observations: ten, state: stateAt(1.4), passedExams: new Set() })
    expect(s).toMatchObject({ kind: 'skip-ahead', testId: 'c:a1:exam', sectionId: 'c:a1', level: 'A1' })
  })

  it('section exam already passed → the next section, if the estimate reaches its middle', () => {
    const passed = new Set(['c:a1:exam'])
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a1', testKind: 'topic-test', score: 1, passed: true, observations: ten, state: stateAt(1.6), passedExams: passed })).toMatchObject({ kind: 'skip-ahead', testId: 'c:a2:exam' })
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a1', testKind: 'topic-test', score: 1, passed: true, observations: ten, state: stateAt(1.2), passedExams: passed })).toBeNull()
    // after an exam: the next section; never a planned one
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a1', testKind: 'section-exam', score: 0.95, passed: true, observations: ten, state: stateAt(1.7), passedExams: passed })).toMatchObject({ testId: 'c:a2:exam' })
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a2', testKind: 'section-exam', score: 1, passed: true, observations: ten, state: stateAt(2.8), passedExams: new Set(['c:a2:exam']) })).toBeNull()
  })

  it('not clearly stronger → no offer', () => {
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a1', testKind: 'topic-test', score: 0.8, passed: true, observations: ten, state: stateAt(1.4), passedExams: new Set() })).toBeNull()
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a1', testKind: 'topic-test', score: 1, passed: true, observations: ten, state: stateAt(0.9), passedExams: new Set() })).toBeNull()
    // too few answers
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a1', testKind: 'topic-test', score: 1, passed: true, observations: obs(4, 4), state: stateAt(1.9), passedExams: new Set() })).toBeNull()
  })

  it('weaker after a failed test → review the previous level (its review test)', () => {
    const s = levelSuggestion({ bundle: course(), sectionId: 'c:a2', testKind: 'topic-test', score: 0.4, passed: false, observations: obs(10, 4, 'A2'), state: stateAt(0.7), passedExams: new Set() })
    expect(s).toMatchObject({ kind: 'review', testId: 'c:a1:rev:test', sectionId: 'c:a1', level: 'A1' })
    // failed but the estimate is still at the section level → just retry, no offer
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a2', testKind: 'topic-test', score: 0.5, passed: false, observations: obs(10, 5, 'A2'), state: stateAt(1.3), passedExams: new Set() })).toBeNull()
    // the first level has nothing below it
    expect(levelSuggestion({ bundle: course(), sectionId: 'c:a1', testKind: 'topic-test', score: 0.2, passed: false, observations: ten, state: stateAt(0.2), passedExams: new Set() })).toBeNull()
  })
})

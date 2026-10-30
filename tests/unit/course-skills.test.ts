import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { loadSnapshot, type ContentSnapshot } from '@/content/store'
import {
  buildCoursePath,
  checkCourse,
  courseSkills,
  CourseBundleSchema,
  currentSkills,
  DEFAULT_SKILLS,
  hasSkillModel,
  IT_LEVELS,
  knownTopics,
  LANGUAGE_SKILL_MODEL,
  LEARNER_SKILLS,
  levelRank,
  levelSuggestion,
  nextSkillStep,
  parseCourseYaml,
  placementResult,
  placementSkillIds,
  placementTest,
  recommendedTopics,
  rng,
  skillModelOf,
  skillsView,
  skillThetas,
  updateSkills,
  weakestSkills,
  type CourseBundle,
  type Level,
  type PathProgress,
  type PlacementAnswer,
  type PlacementItem,
} from '@/course'
import { programmingBundle } from './fixtures/programming-bundle'

// Skills as course data (docs/NEXTJS_SYLLABUS.md §7): manifest, compile and validation, the per-skill placement phase,
// known topics / next step / recommendations on the path, the skill model with N skills — on synthetic programming
// courses (no Next.js content needed) — and a simulation of beginner / junior / senior learners.

const levels: Level[] = [...IT_LEVELS]
const rank = (l: Level) => levels.indexOf(l)
const emptyProgress = (): PathProgress => ({ lessons: new Set(), studied: new Set(), tests: new Map(), exams: new Map() })

// ── Manifest ──

const base = `id: c\nversion: 1.0.0\ntitle: C\nsubject: programming\nkind: programming\nsections:\n  - { id: a, title: A, from: G }\n`

describe('manifest: skills', () => {
  it('accepts skills, perSkill and placement.skills; perSkill defaults to false', () => {
    const { manifest, errors } = parseCourseYaml(`${base}skills:\n  - { id: routing, title: Маршрутизація, icon: 'px:map' }\n  - { id: data-cache, title: Дані }\nplacement: { perSkill: true, skills: [routing] }\n`)
    expect(errors).toEqual([])
    expect(manifest!.skills!.map((s) => s.id)).toEqual(['routing', 'data-cache'])
    expect(manifest!.placement).toMatchObject({ perSkill: true, skills: ['routing'] })
    expect(parseCourseYaml(base).manifest!.placement.perSkill ?? false).toBe(false)
  })

  it('rejects bad / duplicate ids and unknown skills of sections and placement', () => {
    expect(parseCourseYaml(`${base}skills:\n  - { id: Routing, title: R }\n`).errors.join()).toMatch(/id навички/)
    expect(parseCourseYaml(`${base}skills:\n  - { id: r, title: R }\n  - { id: r, title: R2 }\n`).errors.join()).toMatch(/Дублікат id навички «r»/)
    const unknownSection = `id: c\nversion: 1.0.0\ntitle: C\nkind: programming\nskills: [{ id: r, title: R }]\nsections:\n  - { id: a, title: A, from: G, skill: x }\n`
    expect(parseCourseYaml(unknownSection).errors.join()).toMatch(/Невідома навичка «x»/)
    expect(parseCourseYaml(`${base}skills: [{ id: r, title: R }]\nplacement: { skills: [y] }\n`).errors.join()).toMatch(/Невідома навичка «y»/)
  })

  it('parses the Next.js manifest: 11 skills', () => {
    const yaml = readFileSync(path.resolve(__dirname, '../../content/courses/nextjs-zero-to-pro/course.yaml'), 'utf8')
    const { manifest, errors } = parseCourseYaml(yaml)
    expect(errors).toEqual([])
    expect(manifest!.skills!.length).toBe(11)
  })
})

describe('default skills', () => {
  it('language courses get the five learner skills, the bank measures four; programming without skills — none', () => {
    expect(courseSkills({ kind: 'language', levels: ['A1'] }).map((s) => s.id)).toEqual([...LEARNER_SKILLS])
    expect(DEFAULT_SKILLS.language.learner.map((s) => s.title)).toEqual(['Граматика', 'Лексика', 'Читання', 'Аудіювання', 'Вимова'])
    expect(placementSkillIds({ course: { kind: 'language', levels: ['A1'], skills: DEFAULT_SKILLS.language.learner } })).toEqual(['grammar', 'vocabulary', 'reading', 'listening'])
    expect(skillModelOf({ course: { kind: 'language', levels: ['A1'] } })).toEqual({ skills: [...LANGUAGE_SKILL_MODEL.skills], overall: [...LANGUAGE_SKILL_MODEL.overall] })
    expect(courseSkills({ kind: 'programming', levels: ['noob'] })).toEqual([])
    expect(hasSkillModel(programmingBundle({ skills: ['a'], declare: false }))).toBe(false)
    expect(hasSkillModel(programmingBundle({ skills: ['a'] }))).toBe(true)
  })
})

// ── Compile and validation (fixture vault) ──

describe('compile: skills of a programming course', () => {
  const vaultPath = path.resolve(__dirname, '../fixtures/skills-vault')
  const yaml = () => readFileSync(path.join(vaultPath, 'Courses/web-skills/course.yaml'), 'utf8')
  let snap: ContentSnapshot
  beforeAll(async () => {
    snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
  })

  it('course.skills, topic skill (frontmatter → section), exercise skill (own meta → topic)', () => {
    const { bundle } = checkCourse(yaml(), snap)
    expect(bundle).not.toBeNull()
    const b = bundle!
    expect(CourseBundleSchema.safeParse(b).success).toBe(true)
    expect(b.course.skills).toEqual([
      { id: 'routing', title: 'Маршрутизація' },
      { id: 'data', title: 'Дані й кеш', description: 'Fetch, cache' },
      { id: 'ui', title: 'UI' },
    ])
    const topics = b.sections.flatMap((s) => s.topics)
    expect(topics.map((t) => [t.chapterId, t.skill])).toEqual([
      ['web-routes', 'routing'],
      ['web-none', undefined],
      // unknown frontmatter skill → the section's skill
      ['web-cache', 'data'],
    ])
    expect(b.exercises['web-routes-q01']!.skill).toBe('routing')
    expect(b.exercises['web-routes-q02']!.skill).toBe('data')
    // an unknown own skill falls back to the topic's
    expect(b.exercises['web-routes-q03']!.skill).toBe('routing')
    expect(b.exercises['web-none-q01']!.skill).toBeUndefined()
    expect(b.exercises['web-cache-q01']!.skill).toBe('data')
  })

  it('bank: items keep their course skill; unknown → error, none → skipped; perSkill and skills in the pool', () => {
    const { bundle, issues } = checkCourse(yaml(), snap)
    const p = bundle!.placement
    expect(p.bank!['web-pl-noob-r01']).toEqual({ level: 'noob', skill: 'routing', diff: 2, options: 4 })
    expect(p.bank!['web-pl-noob-d01']!.skill).toBe('data')
    expect(p.bank!['web-pl-noob-z01']).toBeUndefined()
    expect(p.bank!['web-pl-noob-n01']).toBeUndefined()
    expect(p).toMatchObject({ perSkill: true, skills: ['routing', 'data'] })
    const errors = issues.filter((i) => i.severity === 'error')
    expect(errors.every((e) => e.code === 'unknown-skill')).toBe(true)
    const text = errors.map((e) => e.message).join('\n')
    expect(text).toMatch(/«bogus»/)
    expect(text).toMatch(/«nope»/)
    expect(text).toMatch(/«zzz»/)
    const warn = (code: string) => issues.filter((i) => i.severity === 'warning' && i.code === code).map((i) => i.message).join('\n')
    expect(warn('topic-skill')).toMatch(/1 тем без навички.*Без навички/)
    expect(warn('placement-bank')).toMatch(/немає skill.*web-pl-noob-n01/)
    expect(warn('thin-placement')).toMatch(/пару навичка × рівень.*routing×noob \(2\)/)
  })
})

// ── Per-skill placement ──

type Knows = Record<string, Level>
// knows every question of a skill up to its level, nothing above (no guessing)
const knows = (k: Knows) => (item: PlacementItem) => rank(item.level) <= rank(k[item.skill]!)

function take(b: CourseBundle, answer: (item: PlacementItem, r: () => number) => boolean | 'dk', seed = 's') {
  const answers: PlacementAnswer[] = []
  const steps: Array<{ phase: string; skill?: string; level: Level | null }> = []
  const r = rng(`learner|${seed}`)
  for (let i = 0; i < 100; i++) {
    const step = placementTest(b, answers, seed)
    if (step.done) break
    steps.push({ phase: step.phase ?? '', skill: step.skill, level: step.probing })
    const item = b.placement.bank![step.next!]!
    expect(step.probing).toBe(item.level)
    const a = answer(item, r)
    answers.push(a === 'dk' ? { exerciseId: step.next!, correct: false, dontKnow: true } : { exerciseId: step.next!, correct: a })
  }
  return { answers, steps, result: placementResult(b, answers) }
}

describe('placement: per-skill phase', () => {
  const skills = ['routing', 'data', 'ui']
  const b = programmingBundle({ skills, perPair: 6, perSkill: true, maxQuestions: 36, perLevel: 3 })

  it('after the main test: 2 questions per skill, a third when they disagree; up after right, down after wrong', () => {
    const { steps, result } = take(b, (item) => knows({ routing: 'junior', data: 'senior', ui: 'junior' })(item))
    const main = steps.filter((s) => s.phase === 'main')
    const phase2 = steps.filter((s) => s.phase === 'skills')
    expect(main.length).toBeGreaterThan(0)
    // the per-skill phase comes after the main one, skill by skill in course order
    expect(steps.findIndex((s) => s.phase === 'skills')).toBe(main.length)
    expect(result.level).toBe('junior')
    const of = (skill: string) => phase2.filter((s) => s.skill === skill).map((s) => s.level)
    // routing (knows junior): junior ✓ → middle ✗ → junior ✓ (split → third)
    expect(of('routing')).toEqual(['junior', 'middle', 'junior'])
    // data (knows senior): junior ✓ → middle ✓
    expect(of('data')).toEqual(['junior', 'middle'])
    expect(of('ui')).toEqual(['junior', 'middle', 'junior'])
    expect(phase2.map((s) => s.skill)).toEqual(['routing', 'routing', 'routing', 'data', 'data', 'ui', 'ui', 'ui'])
    expect(result.perSkill).toBe(true)
    expect(Object.keys(result.skills!)).toEqual(skills)
    expect(rank(result.skills!.data!.level)).toBeGreaterThan(rank(result.skills!.routing!.level))
    expect(result.skills!.routing!.level).toBe('junior')
    expect(result.strong).toContain('data')
    // a programming course with skills starts at the first section: known topics decide what to skip
    expect(result.sectionIndex).toBe(0)
    expect(result.ielts).toBeNull()
    expect(steps.length).toBeLessThanOrEqual(36)
  })

  it('«Не знаю» counts as wrong in the walk; the walk stays within maxQuestions', () => {
    const { steps } = take(b, () => 'dk')
    const phase2 = steps.filter((s) => s.phase === 'skills')
    expect(phase2[0]?.level).toBe('noob')
    expect(phase2.filter((s) => s.skill === 'routing').map((s) => s.level)).toEqual(['noob', 'noob'])
    const tight = programmingBundle({ skills, perPair: 6, perSkill: true, maxQuestions: 10, perLevel: 3 })
    expect(take(tight, (item, r) => r() < (item.level === 'noob' ? 0.9 : 0.3)).answers.length).toBeLessThanOrEqual(10)
  })

  it('stateless and replayable: the same answers give the same steps; a wrong id is never the expected one', () => {
    const policy = (item: PlacementItem, r: () => number) => r() < (rank(item.level) <= 2 ? 0.85 : 0.3)
    const one = take(b, policy, 'seed-1')
    const two = take(b, policy, 'seed-1')
    expect(two.answers).toEqual(one.answers)
    expect(two.result).toEqual(one.result)
    for (let i = 0; i < one.answers.length; i++) expect(placementTest(b, one.answers.slice(0, i), 'seed-1').next).toBe(one.answers[i]!.exerciseId)
  })

  it('perSkill off → no per-skill phase (the bank test as before)', () => {
    const off = programmingBundle({ skills, perPair: 6, perSkill: false, maxQuestions: 36, perLevel: 3 })
    const { steps, result } = take(off, knows({ routing: 'junior', data: 'senior', ui: 'junior' }))
    expect(steps.every((s) => s.phase === 'main')).toBe(true)
    expect(result.perSkill).toBeUndefined()
    expect(Object.keys(result.skills!)).toEqual(skills)
  })
})

// ── Path: known topics, next step, recommended ──

describe('path: known topics and the next step', () => {
  const b = programmingBundle({ skills: ['routing', 'data', 'ui'] })
  // θ: routing middle (2.5), data noob (0.5), ui junior (1.5)
  const skills = { thetas: { routing: 2.5, data: 0.5, ui: 1.5 } }

  it('knownTopics: topics below the learner level of their skill', () => {
    expect(knownTopics(b, skills)).toEqual(['syn:routing:t0', 'syn:routing:t1', 'syn:ui:t0'])
    expect(knownTopics(b, null)).toEqual([])
    expect(knownTopics(programmingBundle({ skills: ['routing'], declare: false }), { thetas: { routing: 4.5 } })).toEqual([])
  })

  it('known topics are optional; the next step is the first topic not known, in course order', () => {
    const view = buildCoursePath(b, 'noob', { ...emptyProgress(), skills })
    const routing = view.sections[0]!
    expect(routing.topics.map((t) => t.known)).toEqual([true, true, false, false, false])
    expect(routing.topics[0]!.nodes.every((n) => !n.required)).toBe(true)
    expect(view.current?.topicId).toBe('syn:routing:t2')
    // without skills: the first topic
    expect(buildCoursePath(b, 'noob', emptyProgress()).current?.topicId).toBe('syn:routing:t0')
  })

  it('a section whose topics are all known is complete (known: skills) and the next one opens', () => {
    // routing: senior; its topics noob…middle (the top level of the ladder is never «known»)
    const allRouting = { thetas: { routing: 3.5, data: 0.5, ui: 0.5 } }
    const b2 = programmingBundle({ skills: ['routing', 'data'] })
    b2.sections[0]!.topics = b2.sections[0]!.topics.slice(0, 3)
    const view = buildCoursePath(b2, 'noob', { ...emptyProgress(), skills: allRouting })
    expect(view.sections[0]).toMatchObject({ known: 'skills', state: 'done' })
    expect(view.sections[0]!.exam?.required).toBe(false)
    expect(view.sections[1]!.state).toBe('current')
    expect(view.current?.topicId).toBe('syn:data:t0')
  })

  it('recommended: one unfinished topic per skill, weakest skills first', () => {
    const view = buildCoursePath(b, 'noob', { ...emptyProgress(), skills })
    expect(view.recommended).toEqual(['syn:data:t0', 'syn:ui:t1', 'syn:routing:t2'])
    expect(recommendedTopics(view.sections, skills, 1)).toEqual(['syn:data:t0'])
    expect(buildCoursePath(b, 'noob', emptyProgress()).recommended).toEqual([])
  })
})

// ── Skill model with N skills ──

describe('skill model from the bundle', () => {
  const b = programmingBundle({ skills: ['routing', 'data', 'ui'] })
  const model = skillModelOf(b)

  it('starts from the placement levels per skill, averages every course skill', () => {
    const state = currentSkills(null, { level: 'junior', placement: { at: 1, skills: { routing: { level: 'senior', measured: true }, data: { level: 'noob', measured: true } } } }, levels, model)
    expect(Object.keys(state.skills)).toEqual(['routing', 'data', 'ui'])
    const view = skillsView(state, levels, model)
    expect(view.skills.map((s) => s.level)).toEqual(['senior', 'noob', 'junior'])
    expect(view.overall).toBe('junior')
    expect(view.ielts).toBeNull()
    expect(weakestSkills(view, 1)[0]!.skill).toBe('data')
    expect(nextSkillStep(view, levels)).toEqual({ skill: 'data', from: 'noob', to: 'junior' })
    expect(skillThetas(state, model)).toEqual({ routing: 3.5, data: 0.5, ui: 1.5 })
  })

  it('test answers move the skill they belong to; levelSuggestion works on the IT ladder', () => {
    const state = currentSkills(null, { level: 'junior' }, levels, model)
    const obs = Array.from({ length: 8 }, () => ({ skill: 'data', level: 'senior' as Level, diff: 2 as const, options: 0, correct: true }))
    const after = updateSkills(state, obs, levels, 1, model)
    expect(after.skills.data!.mu).toBeGreaterThan(state.skills.data!.mu + 1)
    expect(after.skills.routing).toEqual(state.skills.routing)
    // a section whose level is junior, all right, θ way above → skip ahead to this section's exam
    const junior = programmingBundle({ skills: ['data', 'ui'], levels: ['noob', 'junior', 'middle', 'senior', 'god'] })
    junior.sections[0]!.level = 'junior'
    const skip = levelSuggestion({ bundle: junior, sectionId: 'syn:data', testKind: 'topic-test', score: 1, passed: true, observations: obs, state: after, passedExams: new Set() })
    expect(skip).toMatchObject({ kind: 'skip-ahead', testId: 'syn:data:exam' })
    // failed, θ below the section level → review the previous section's exam
    junior.sections[1]!.level = 'senior'
    const low = updateSkills(state, obs.map((o) => ({ ...o, skill: 'ui', level: 'noob' as Level, correct: false })), levels, 2, model)
    const review = levelSuggestion({ bundle: junior, sectionId: 'syn:ui', testKind: 'topic-test', score: 0.2, passed: false, observations: obs.map((o) => ({ ...o, skill: 'ui' })), state: low, passedExams: new Set() })
    expect(review).toMatchObject({ kind: 'review', testId: 'syn:data:exam' })
  })
})

// ── Simulation: beginner / junior / senior on an 11-skill × 5-level bank ──

const SKILLS11 = ['foundations', 'routing', 'rendering', 'data', 'mutations', 'auth-security', 'ui', 'performance', 'testing', 'deploy-ops', 'architecture']

// A learner profile: per-skill true rank = base + offset (−1 / 0 / +1 with 20 / 60 / 20 %, clamped). Answers follow
// the guessing model with θ = true rank + 0.6 (solid at the own level: ≈ 83 % right on typical items, ≈ 38 % one level
// up, ≈ 98 % one level below); a learner says «Не знаю» on a third of the items they don't know.
function simulate(baseRank: number, runs: number) {
  const b = programmingBundle({ skills: SKILLS11, perPair: 6, perSkill: true, maxQuestions: 36, perLevel: 3 })
  let exact = 0
  let near = 0
  let total = 0
  let overallExact = 0
  let overallNear = 0
  let questions = 0
  for (let k = 0; k < runs; k++) {
    const r = rng(`profile|${baseRank}|${k}`)
    const truth: Record<string, number> = {}
    for (const s of SKILLS11) {
      const u = r()
      truth[s] = Math.max(0, Math.min(4, baseRank + (u < 0.2 ? -1 : u > 0.8 ? 1 : 0)))
    }
    const { answers, result } = take(
      b,
      (item, rr) => {
        const theta = truth[item.skill]! + 0.6
        const bItem = rank(item.level) + 0.25 + 0.3 * (item.diff - 2)
        const p = 0.25 + 0.75 / (1 + Math.exp(-2.77 * (theta - bItem)))
        if (rr() < p) return true
        return rr() < 0.33 ? 'dk' : false
      },
      `sim-${baseRank}-${k}`,
    )
    questions += answers.length
    for (const s of SKILLS11) {
      const got = levelRank(result.skills![s]!.level)
      total++
      if (got === truth[s]) exact++
      if (Math.abs(got - truth[s]!) <= 1) near++
    }
    const median = [...Object.values(truth)].sort((x, y) => x - y)[5]!
    const overall = levelRank(result.level)
    if (overall === median) overallExact++
    if (Math.abs(overall - median) <= 1) overallNear++
  }
  return { exact: exact / total, near: near / total, overallExact: overallExact / runs, overallNear: overallNear / runs, questions: questions / runs }
}

describe('simulation: per-skill placement (11 skills × 5 levels × 6 questions, 300 runs per profile)', () => {
  const RUNS = 300
  for (const [name, baseRank] of [
    ['beginner', 0],
    ['junior', 1],
    ['senior', 3],
  ] as const) {
    it(`${name}: skills within ±1 level, ≤ 36 questions`, { timeout: 120_000 }, () => {
      const s = simulate(baseRank, RUNS)
      console.log(`[placement sim] ${name}: skill exact ${(s.exact * 100).toFixed(1)} % · ±1 ${(s.near * 100).toFixed(1)} % · overall exact ${(s.overallExact * 100).toFixed(1)} % · ±1 ${(s.overallNear * 100).toFixed(1)} % · questions ${s.questions.toFixed(1)}`)
      expect(s.near).toBeGreaterThan(0.85)
      expect(s.overallNear).toBeGreaterThan(0.9)
      expect(s.questions).toBeLessThanOrEqual(36)
    })
  }
})

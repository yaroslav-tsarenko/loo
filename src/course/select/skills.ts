import { LEARNER_SKILLS, levelRank, PLACEMENT_SKILLS, type CourseBundle, type LearnerSkill, type Level, type Section } from '../schema'
import { ieltsBand, type IeltsBand } from './ielts'
import { lookup } from './lookup'

// Per-skill level estimate of a language learner (docs/LANGUAGE_COURSE.md «Рівень за навичками»), updated after
// every topic test and section exam. The same model as the placement's skill estimate (placement.ts → estimateSkills):
//
//   ability θ in level units (θ ∈ [i, i+1) ⇔ the i-th level of the ladder; A1 0…1, A2 1…2 …);
//   an exercise of level i and diff d (easy 1 · medium 2 · hard 3) has difficulty b = i + 0.25 + 0.3·(d − 2);
//   P(right | θ) = c + (1 − c)·σ(2.77·(θ − b)), c = 1/options for a choice (a blind guess), 0 for typed answers.
//
// Each skill keeps a normal belief N(μ, σ). An update = the prior N(μ, √(σ² + drift)) × the likelihood of the test's
// answers of that skill, on a grid → the posterior mean and SD become the new μ, σ (σ never below 0.3, so the estimate
// keeps moving). Explained simply: a right answer to an item harder than you are raises the estimate, a wrong answer to
// an easier one lowers it, and the more answers there are, the smaller each step. Start: the placement's level of the
// skill (σ 0.5) or the course level (σ 0.8) — a stored estimate is dropped when the level or the placement changes.

export const SKILL_K = 2.77
export const SD_PLACED = 0.5
export const SD_DEFAULT = 0.8
export const SD_MIN = 0.3
// added variance per update: abilities change, old answers weigh a little less
export const DRIFT = 0.03

export interface SkillBelief {
  mu: number
  sd: number
  // graded answers seen / right
  n: number
  right: number
}

// Stored per learner and course (user_settings `skills:<courseId>`, jsonb — src/server/courses/skills.ts).
export interface SkillState {
  v: 1
  // what the estimate started from: a manual level change or a new placement starts it over
  basis: { level: Level; placementAt: number | null }
  skills: Partial<Record<LearnerSkill, SkillBelief>>
  updatedAt: number
}

// What the enrollment says about the learner (enrollments.level / .placement).
export interface SkillBasis {
  level: Level
  placement?: { at?: number; skipped?: boolean; skills?: Partial<Record<string, { level: string; measured: boolean }>> } | null
}

export interface SkillObservation {
  skill: LearnerSkill
  level: Level
  diff: 1 | 2 | 3
  // answer options of a choice (2 for a minimal pair); 0 — typed / ordered answers, no guessing
  options: number
  correct: boolean
}

export const levelTheta = (level: Level): number => levelRank(level) + 0.5

export function thetaLevel(theta: number, levels: readonly Level[]): Level {
  return levels[Math.max(0, Math.min(levels.length - 1, Math.floor(theta + 1e-9)))]!
}

// b of an item: level i, diff d → i + 0.25 + 0.3·(d − 2) (the placement bank's calibration)
export const itemDifficulty = (level: Level, diff: number): number => levelRank(level) + 0.25 + 0.3 * (diff - 2)

const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x))

export function pRight(theta: number, b: number, options: number): number {
  const c = options >= 2 ? 1 / options : 0
  return c + (1 - c) * sigmoid(SKILL_K * (theta - b))
}

function placementLevel(basis: SkillBasis, skill: LearnerSkill, levels: readonly Level[]): Level | null {
  const p = basis.placement
  if (!p || p.skipped) return null
  const s = p.skills?.[skill]
  if (!s?.measured) return null
  return (levels as readonly string[]).includes(s.level) ? (s.level as Level) : null
}

const basisOf = (basis: SkillBasis): SkillState['basis'] => ({ level: basis.level, placementAt: basis.placement && !basis.placement.skipped ? (basis.placement.at ?? null) : null })

// Fresh estimate: per skill the placement's measured level (σ 0.5), otherwise the course level (σ 0.8).
export function initialSkills(basis: SkillBasis, levels: readonly Level[], now = 0): SkillState {
  const skills: SkillState['skills'] = {}
  for (const skill of LEARNER_SKILLS) {
    const placed = placementLevel(basis, skill, levels)
    skills[skill] = { mu: levelTheta(placed ?? basis.level), sd: placed ? SD_PLACED : SD_DEFAULT, n: 0, right: 0 }
  }
  return { v: 1, basis: basisOf(basis), skills, updatedAt: now }
}

// The stored estimate if it still belongs to this level / placement, otherwise a fresh one. Unknown shapes (tampered
// or older rows) are ignored.
export function currentSkills(stored: unknown, basis: SkillBasis, levels: readonly Level[]): SkillState {
  const fresh = initialSkills(basis, levels)
  if (!isSkillState(stored)) return fresh
  const b = basisOf(basis)
  if (stored.basis.level !== b.level || stored.basis.placementAt !== b.placementAt) return fresh
  const skills: SkillState['skills'] = { ...fresh.skills }
  const max = levels.length + 1
  for (const skill of LEARNER_SKILLS) {
    const s = stored.skills[skill]
    if (s) skills[skill] = { mu: Math.max(-1, Math.min(max, s.mu)), sd: Math.max(SD_MIN, Math.min(2, s.sd)), n: Math.max(0, Math.floor(s.n)), right: Math.max(0, Math.floor(s.right)) }
  }
  return { v: 1, basis: b, skills, updatedAt: stored.updatedAt }
}

function isSkillState(value: unknown): value is SkillState {
  if (!value || typeof value !== 'object') return false
  const v = value as Partial<SkillState>
  if (v.v !== 1 || !v.basis || typeof v.basis !== 'object' || !v.skills || typeof v.skills !== 'object' || typeof v.updatedAt !== 'number') return false
  return Object.values(v.skills).every((s) => s && typeof s === 'object' && [s.mu, s.sd, s.n, s.right].every((x) => typeof x === 'number' && Number.isFinite(x)))
}

// Posterior N(μ', σ') of one skill after a batch of answers (grid −1 … levels+1, step 0.05).
export function updateBelief(belief: SkillBelief, answers: readonly Omit<SkillObservation, 'skill'>[], levels: readonly Level[]): SkillBelief {
  if (answers.length === 0) return belief
  const sd = Math.sqrt(belief.sd ** 2 + DRIFT)
  const grid: number[] = []
  for (let x = -1; x <= levels.length + 1 + 1e-9; x += 0.05) grid.push(x)
  const logs = grid.map((theta) => {
    let lp = -((theta - belief.mu) ** 2) / (2 * sd * sd)
    for (const a of answers) {
      const p = pRight(theta, itemDifficulty(a.level, a.diff), a.options)
      lp += Math.log(Math.max(1e-12, a.correct ? p : 1 - p))
    }
    return lp
  })
  const peak = Math.max(...logs)
  let weight = 0
  let mean = 0
  let square = 0
  logs.forEach((lp, i) => {
    const w = Math.exp(lp - peak)
    weight += w
    mean += w * grid[i]!
    square += w * grid[i]! ** 2
  })
  const mu = mean / weight
  const variance = Math.max(0, square / weight - mu * mu)
  return { mu, sd: Math.max(SD_MIN, Math.sqrt(variance)), n: belief.n + answers.length, right: belief.right + answers.filter((a) => a.correct).length }
}

export function updateSkills(state: SkillState, observations: readonly SkillObservation[], levels: readonly Level[], now: number): SkillState {
  const skills: SkillState['skills'] = { ...state.skills }
  for (const skill of LEARNER_SKILLS) {
    const mine = observations.filter((o) => o.skill === skill)
    if (mine.length === 0) continue
    const before = skills[skill] ?? { mu: levelTheta(state.basis.level), sd: SD_DEFAULT, n: 0, right: 0 }
    skills[skill] = updateBelief(before, mine, levels)
  }
  return { ...state, skills, updatedAt: now }
}

// ── What the learner sees ──

export interface SkillView {
  skill: LearnerSkill
  level: Level
  theta: number
  sd: number
  n: number
  // answers of this skill were graded since the placement / level choice (otherwise: the starting level)
  updated: boolean
  ielts: IeltsBand | null
}

export interface SkillsView {
  skills: SkillView[]
  // the four placement skills averaged (like the IELTS overall band = the mean of the four papers)
  overall: Level
  overallTheta: number
  ielts: IeltsBand | null
  answers: number
}

export function skillsView(state: SkillState, levels: readonly Level[]): SkillsView {
  const skills = LEARNER_SKILLS.map((skill): SkillView => {
    const b = state.skills[skill] ?? { mu: levelTheta(state.basis.level), sd: SD_DEFAULT, n: 0, right: 0 }
    const level = thetaLevel(b.mu, levels)
    return { skill, level, theta: b.mu, sd: b.sd, n: b.n, updated: b.n > 0, ielts: ieltsBand(level) }
  })
  const four = skills.filter((s) => (PLACEMENT_SKILLS as readonly string[]).includes(s.skill))
  const overallTheta = four.reduce((sum, s) => sum + s.theta, 0) / four.length
  const overall = thetaLevel(overallTheta, levels)
  return { skills, overall, overallTheta, ielts: ieltsBand(overall), answers: skills.reduce((sum, s) => sum + s.n, 0) }
}

// θ per skill for practice selection (adaptive.ts)
export function skillThetas(state: SkillState): Partial<Record<LearnerSkill, number>> {
  const out: Partial<Record<LearnerSkill, number>> = {}
  for (const skill of LEARNER_SKILLS) {
    const b = state.skills[skill]
    if (b) out[skill] = b.mu
  }
  return out
}

// ── Skip ahead / review the previous level ──
//
// After a topic test or a section exam (the «right moment»): θ of the skills the test measured (the answers' skills,
// weighted by how many there were) against the level of the test's section:
// * skip ahead — the test went very well (≥ 90 %) and θ ≥ the section's level + 1 (the estimate is already in the next
//   level): offer the section's exam as a test-out (after a topic test); after the exam, or when it's passed already —
//   the next active section's exam, if θ reaches the middle of that level. Only test-out exams not passed yet.
// * review — the test failed and θ is below the section's level: offer the previous level's review (its `review`
//   topic test, else its exam), the first level has none.
// Needs ≥ 6 graded answers in the test, so one short quiz doesn't move anyone.

export const SKIP_SCORE = 0.9
export const MIN_ANSWERS = 6

export interface LevelSuggestion {
  kind: 'skip-ahead' | 'review'
  // where to go: a section exam (test-out) or the previous level's review test
  testId: string
  sectionId: string
  level: Level
  // θ of the tested skills, the section level it was compared with
  theta: number
}

export interface SuggestionInput {
  bundle: CourseBundle
  // the section of the test that was just graded
  sectionId: string
  testKind: 'topic-test' | 'section-exam'
  score: number
  passed: boolean
  observations: readonly SkillObservation[]
  state: SkillState
  // exam ids already passed
  passedExams: ReadonlySet<string>
}

export function testedTheta(state: SkillState, observations: readonly SkillObservation[]): number | null {
  if (observations.length === 0) return null
  let sum = 0
  for (const o of observations) sum += state.skills[o.skill]?.mu ?? levelTheta(state.basis.level)
  return sum / observations.length
}

const activePath = (bundle: CourseBundle): Section[] => bundle.sections.filter((s) => s.kind === 'path' && s.status !== 'planned')

export function levelSuggestion(input: SuggestionInput): LevelSuggestion | null {
  const { bundle, state } = input
  if (input.observations.length < MIN_ANSWERS) return null
  const section = lookup(bundle).sections.get(input.sectionId)
  if (!section) return null
  const theta = testedTheta(state, input.observations)
  if (theta === null) return null
  const path = activePath(bundle)
  const rank = levelRank(section.level)
  if (input.passed && input.score >= SKIP_SCORE - 1e-9 && theta >= rank + 1) {
    const testOut = (s: Section | undefined) => (s?.exam && s.exam.testOut && !input.passedExams.has(s.exam.id) ? s : undefined)
    // a topic test → this section's exam first; otherwise (or already passed) the next section's, if θ reaches the
    // middle of its level
    let target = input.testKind === 'topic-test' ? testOut(section) : undefined
    const next = path.find((s) => s.index > section.index)
    if (!target && next && theta >= levelRank(next.level) + 0.5) target = testOut(next)
    return target ? { kind: 'skip-ahead', testId: target.exam!.id, sectionId: target.id, level: target.level, theta } : null
  }
  if (!input.passed && theta < rank) {
    const previous = path.filter((s) => s.index < section.index && levelRank(s.level) < rank).at(-1)
    if (!previous) return null
    const review = previous.topics.find((t) => t.kind === 'review' && t.test)
    const testId = review?.test?.id ?? previous.exam?.id
    return testId ? { kind: 'review', testId, sectionId: previous.id, level: previous.level, theta } : null
  }
  return null
}

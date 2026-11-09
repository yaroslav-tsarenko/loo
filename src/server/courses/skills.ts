import 'server-only'
import { cache } from 'react'
import { and, eq, isNotNull, like } from 'drizzle-orm'
import {
  courseLadder,
  courseLevels,
  currentSkills,
  diffNumber,
  hasSkillModel,
  levelShort,
  skillModelOf,
  skillTitle,
  levelSuggestion,
  skillsView,
  skillThetas,
  updateSkills,
  type BuiltTest,
  type CourseBundle,
  type ExamBand,
  type LearnerLevels,
  type Level,
  type LevelSuggestion,
  type PathSkills,
  type SkillObservation,
  type SkillsView,
  type SkillState,
} from '@/course'
import type { LearningUnit } from '@/content/model'
import type { Conn } from '@/db/client'
import { enrollments, examResults, userSettings, type EnrollmentPlacement } from '@/db/schema'
import { userBase } from '../base'
import { read, readAll, type Read } from '../db/batch'
import { activeCourse, courseLevelOf } from './enrollment'
import type { ResolvedTest } from './tests-core'

// Per-skill level estimate of every course with a skill model (course.skills; language courses — the five defaults;
// src/course/select/skills.ts) on the server: stored per learner and
// course in user_settings under `skills:<courseId>` (jsonb, no migration; read with the base rows in one statement —
// src/server/base.ts), updated inside submitTest's transaction after every topic test and section exam.

const PREFIX = 'skills:'
export const skillsKey = (courseId: string): string => `${PREFIX}${courseId}`

// every stored estimate of the learner: course id → raw jsonb (validated by currentSkills)
export function skillStatesRead(conn: Conn, userId: string): Read<Map<string, unknown>> {
  return read(
    conn
      .select({ key: userSettings.key, value: userSettings.value })
      .from(userSettings)
      .where(and(eq(userSettings.userId, userId), like(userSettings.key, `${PREFIX}%`))),
    (rows) => new Map(rows.map((r) => [r.key.slice(PREFIX.length), r.value])),
  )
}

// CEFR ladder (IELTS bands, language practice sections). The skill model itself is `hasSkillModel(bundle)`.
export const isLanguageCourse = (bundle: CourseBundle): boolean => courseLadder(bundle.course) === 'cefr'

export interface LearnerSkills {
  bundle: CourseBundle
  state: SkillState
  view: SkillsView
  learner: LearnerLevels
  levels: Level[]
}

export function learnerSkillsFor(bundle: CourseBundle, enrollment: { level: Level; placement: EnrollmentPlacement | null }, stored: unknown): LearnerSkills | null {
  if (!hasSkillModel(bundle)) return null
  const levels = courseLevels(bundle.course)
  const model = skillModelOf(bundle)
  const state = currentSkills(stored, { level: courseLevelOf(enrollment.level, bundle.course), placement: enrollment.placement }, levels, model)
  const view = skillsView(state, levels, model, bundle.course.exam)
  return { bundle, state, view, learner: { overall: view.overallTheta, skills: skillThetas(state, model) }, levels }
}

// The active course's estimate (null: no course, or a course without a skill model). No database trip of its own.
export const activeSkills = cache(async (): Promise<LearnerSkills | null> => {
  const [active, base] = await Promise.all([activeCourse(), userBase()])
  if (!active) return null
  return learnerSkillsFor(active.bundle, active.enrollment, base?.skillStates.get(active.bundle.course.id))
})

// The estimate of any enrolled course (course page): the stored row comes with the base rows.
export async function courseSkills(bundle: CourseBundle, enrollment: { level: Level; placement: EnrollmentPlacement | null } | null): Promise<LearnerSkills | null> {
  if (!enrollment || !hasSkillModel(bundle)) return null
  const base = await userBase()
  return learnerSkillsFor(bundle, enrollment, base?.skillStates.get(bundle.course.id))
}

// θ per skill for the path's known topics and recommendations (src/course/select/path.ts) — courses with declared
// skills only (language topics carry no skill: their path stays level-based). The stored row comes with the base rows.
export async function pathSkills(active: { bundle: CourseBundle; enrollment: { level: Level; placement: EnrollmentPlacement | null } }): Promise<PathSkills | null> {
  if (!hasSkillModel(active.bundle) || isLanguageCourse(active.bundle)) return null
  const base = await userBase()
  const skills = learnerSkillsFor(active.bundle, active.enrollment, base?.skillStates.get(active.bundle.course.id))
  return skills ? { thetas: skills.learner.skills } : null
}

// Chance of a blind guess: options of a choice (a minimal pair has 2), 0 for typed / ordered / multi-answer items.
export function guessOptions(unit: LearningUnit): number {
  if (unit.kind !== 'quiz') return 0
  if (unit.mode === 'pair') return 2
  if (unit.mode === 'listen' && unit.listen?.type === 'dictation') return 0
  if (unit.mode === 'single' || unit.mode === 'listen' || unit.mode === 'output') return unit.options.length >= 2 ? unit.options.length : 0
  return 0
}

// The graded quizzes of a test as observations of their skills (self-rated fallback cards don't count). Language
// exercises always have a skill (grammar when older bundles lack it); elsewhere an exercise without one is skipped.
export function testObservations(bundle: CourseBundle, units: ReadonlyMap<string, LearningUnit>, built: BuiltTest, results: readonly boolean[]): SkillObservation[] {
  const out: SkillObservation[] = []
  const fallback = isLanguageCourse(bundle) ? 'grammar' : undefined
  built.questions.forEach((id, i) => {
    const ex = bundle.exercises[id]
    const unit = ex ? units.get(id) : undefined
    if (!ex || !unit || unit.kind !== 'quiz' || ex.kind === 'speak') return
    const skill = ex.skill ?? fallback
    if (!skill) return
    out.push({ skill, level: ex.level, diff: diffNumber(ex.difficulty), options: guessOptions(unit), correct: results[i] === true })
  })
  return out
}

export interface SkillChange {
  skill: string
  // course.skills title; the levels as shown (CEFR ids, IT ranks)
  label: string
  before: Level
  after: Level
  beforeLabel: string
  afterLabel: string
  // θ moved up / down (rounded to 0.05), null — unchanged
  trend: 'up' | 'down' | null
}

export interface TestSkills {
  changes: SkillChange[]
  overall: Level
  overallLabel: string
  exam: ExamBand | null
  suggestion: LevelSuggestion | null
}

// Inside submitTest's transaction: one read (enrollment, stored estimate, passed exams) and one upsert.
export async function recordTestSkills(
  tx: Conn,
  userId: string,
  input: { test: ResolvedTest; built: BuiltTest; results: readonly boolean[]; score: number; passed: boolean; units: ReadonlyMap<string, LearningUnit>; now: number },
): Promise<TestSkills | null> {
  const { test, now } = input
  const bundle = test.bundle
  if (!hasSkillModel(bundle)) return null
  const observations = testObservations(bundle, input.units, input.built, input.results)
  if (observations.length === 0) return null
  const courseId = bundle.course.id
  const [enrollment, stored, passedExams] = await readAll(tx, [
    read(
      tx
        .select({ level: enrollments.level, placement: enrollments.placement })
        .from(enrollments)
        .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))),
      (rows) => rows[0],
    ),
    read(
      tx
        .select({ value: userSettings.value })
        .from(userSettings)
        .where(and(eq(userSettings.userId, userId), eq(userSettings.key, skillsKey(courseId)))),
      (rows) => rows[0]?.value,
    ),
    read(
      tx
        .select({ id: examResults.examId })
        .from(examResults)
        .where(and(eq(examResults.userId, userId), eq(examResults.courseId, courseId), isNotNull(examResults.passedAt))),
      (rows) => new Set(rows.map((r) => r.id)),
    ),
  ])
  // a test of a course that isn't in the library: no level to start from
  if (!enrollment) return null
  const levels = courseLevels(bundle.course)
  const model = skillModelOf(bundle)
  const before = currentSkills(stored, { level: courseLevelOf(enrollment.level, bundle.course), placement: enrollment.placement }, levels, model)
  const after = updateSkills(before, observations, levels, now, model)
  await tx
    .insert(userSettings)
    .values({ userId, key: skillsKey(courseId), value: after })
    .onConflictDoUpdate({ target: [userSettings.userId, userSettings.key], set: { value: after } })
  if (test.kind === 'section-exam' && input.passed) passedExams.add(test.id)
  const b = skillsView(before, levels, model, bundle.course.exam)
  const a = skillsView(after, levels, model, bundle.course.exam)
  const tested = new Set(observations.map((o) => o.skill))
  const changes = a.skills
    .filter((s) => tested.has(s.skill))
    .map((s): SkillChange => {
      const was = b.skills.find((x) => x.skill === s.skill)!
      const delta = Math.round((s.theta - was.theta) * 20) / 20
      return { skill: s.skill, label: skillTitle(bundle.course, s.skill), before: was.level, after: s.level, beforeLabel: levelShort(was.level), afterLabel: levelShort(s.level), trend: delta > 0 ? 'up' : delta < 0 ? 'down' : null }
    })
  const suggestion = levelSuggestion({ bundle, sectionId: test.section.id, testKind: test.kind, score: input.score, passed: input.passed, observations, state: after, passedExams })
  return { changes, overall: a.overall, overallLabel: levelShort(a.overall), exam: a.exam, suggestion }
}

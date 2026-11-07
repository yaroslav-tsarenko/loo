'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import type { ReactNode } from 'react'
import { courseLevels, LEVELS, levelRank, manualStartAllowed, placementCandidates, sectionForLevel, type CourseBundle, type ExamBand, type Level, type PlacementConfidence, type PlacementResult } from '@/course'
import { optionIds } from '../quiz-ids'
import { renderMdast } from '@/ui/markdown/render'
import { renderLessonItems, type PlayerItem } from '../services/lessons'
import { first } from '@/db/client'
import { enrollments, profiles, xpLedger, type EnrollmentPlacement } from '@/db/schema'
import { maxCredit, placementCredit, rankOf, type PlacementCredit } from '@/game'
import { dayKey } from '@/progress/day'
import { loadState, saveState } from '../game/state'
import { rankInput } from '../game/ranks'
import { safeRedirectPath } from '@/lib/redirect'
import { getProfile, requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { getContent } from '../content'
import { activate, enrollIn, levelFromPreference } from '../courses/enrollment'
import { limitUser } from '../courses/limits'
import { placementSeed, placementUnitOf, replayPlacement } from '../courses/placement-core'
import { exerciseUnit, getCourse, getCourseEntry } from '../courses/registry'

// Library (enroll / switch / leave / level) and placement. Every action: requireUser → zod → rate limit → user scope.

const courseId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(64)
const level = z.enum(LEVELS)
const next = z.string().max(2048).optional()

function field(form: FormData, key: string): string | undefined {
  const v = form.get(key)
  return typeof v === 'string' ? v : undefined
}

async function knownCourse(id: string): Promise<void> {
  if (!(await getCourseEntry(id))) throw new Error('Unknown course')
}

const libraryInput = z.object({ course: courseId, next })

// «Додати в бібліотеку»: adds the course and makes it the active one.
export async function enrollCourse(form: FormData): Promise<void> {
  const user = await requireUser()
  const input = parseInput(libraryInput, { course: field(form, 'course'), next: field(form, 'next') })
  await limitUser(user.id, 'library')
  await knownCourse(input.course)
  const lvl = levelFromPreference((await getProfile())?.preferences.level, (await getCourse(input.course))?.course)
  await userScope((tx, userId) => enrollIn(tx, userId, input.course, { level: lvl, activate: true }), { tx: true })
  revalidatePath('/', 'layout')
  redirect(safeRedirectPath(input.next ?? '/path'))
}

// Active course switcher (sidebar, home, «Мої курси»).
export async function switchCourse(form: FormData): Promise<void> {
  const user = await requireUser()
  const input = parseInput(libraryInput, { course: field(form, 'course'), next: field(form, 'next') })
  await limitUser(user.id, 'library')
  await knownCourse(input.course)
  await userScope(
    async (tx, userId) => {
      const row = await first(
        tx
          .select({ id: enrollments.courseId })
          .from(enrollments)
          .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, input.course))),
      )
      if (!row) throw new Error('Not enrolled')
      await activate(tx, userId, input.course)
    },
    { tx: true },
  )
  revalidatePath('/', 'layout')
  redirect(safeRedirectPath(input.next ?? '/path'))
}

// «Прибрати з бібліотеки»: progress stays (it is keyed by lesson / exercise ids); re-adding brings it back.
export async function leaveCourse(form: FormData): Promise<void> {
  const user = await requireUser()
  const input = parseInput(libraryInput, { course: field(form, 'course'), next: field(form, 'next') })
  await limitUser(user.id, 'library')
  await userScope(
    async (tx, userId) => {
      await tx.delete(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, input.course)))
      const other = await first(tx.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.lastOpenedAt)).limit(1))
      if (other && !other.active) await activate(tx, userId, other.courseId)
    },
    { tx: true },
  )
  revalidatePath('/', 'layout')
  redirect(safeRedirectPath(input.next ?? '/courses'))
}

const levelInput = z.object({ course: courseId, level, next })

// Manual level override (course page, /account).
export async function setCourseLevel(form: FormData): Promise<void> {
  const user = await requireUser()
  const input = parseInput(levelInput, { course: field(form, 'course'), level: field(form, 'level'), next: field(form, 'next') })
  await limitUser(user.id, 'library')
  const bundle = await getCourse(input.course)
  if (!bundle) throw new Error('Unknown course')
  // a level of the course's own ladder only (noob…god or A1…C2)
  if (!courseLevels(bundle.course).includes(input.level)) throw new Error('Unknown level')
  await userScope(
    async (tx, userId) => {
      await enrollIn(tx, userId, input.course, { level: input.level, activate: false })
      await tx
        .update(enrollments)
        .set({ level: input.level })
        .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, input.course)))
    },
    { tx: true },
  )
  revalidatePath('/', 'layout')
  redirect(safeRedirectPath(input.next ?? `/courses/${input.course}?level=1`))
}

// ── Placement (/placement) ──────────────────────────────────────────────────────────────────────────────────────

const nonce = z.string().regex(/^[a-f0-9]{8,32}$/)
const rawAnswer = z.object({ id: z.string().min(1).max(200), chosen: z.array(z.string().max(2000)).max(64), text: z.string().max(2000).nullable(), dontKnow: z.boolean().optional() })
// withItem: the client resumes a saved run (localStorage) on a page rendered for another nonce — render the next
// question whatever the page pre-rendered.
const placementInput = z.object({ course: courseId, nonce, answers: z.array(rawAnswer).max(60), followUp: z.boolean().optional(), withItem: z.boolean().optional() })

type RawAnswer = { id: string; chosen: string[]; text: string | null; dontKnow?: boolean }

export interface PlacementSkillView {
  level: Level
  asked: number
  correct: number
  measured: boolean
  // the course's exam band (course.yaml `exam:`), null without one
  exam: ExamBand | null
}

export interface PlacementResultView {
  level: Level
  sectionIndex: number
  sectionId: string | null
  confident: boolean
  // bank mode (language courses)
  confidence: PlacementConfidence | null
  followUp: boolean
  // per measured skill: language — grammar / vocabulary / reading / listening; courses with skills — their ids
  skills: Partial<Record<string, PlacementSkillView>> | null
  strong: string[]
  weak: string[]
  // the per-skill phase ran (course.yaml `placement.perSkill`)
  perSkill: boolean
  exam: ExamBand | null
  // what the exam estimate doesn't cover (course.yaml `exam.note`; null → the generic i18n text)
  examNote: string | null
  lessonsReady: boolean
  startLevel: Level | null
  // start sections the learner may pick instead (bank mode, lessons still planned): the default first
  starts: Array<{ id: string; index: number; level: Level }>
}

// A mistake of the finished test: the right option(s) and the explanation, revealed only after the last answer.
export interface PlacementReviewItem {
  id: string
  chosen: string[]
  dontKnow: boolean
  key: string[]
  explanation: ReactNode
}

export interface PlacementStepResult {
  done: boolean
  next: string | null
  asked: number
  maxQuestions: number
  phase: 'main' | 'skills' | 'follow-up' | null
  // the verdict of the last answer, graded on the server
  lastCorrect: boolean | null
  result: PlacementResultView | null
  review: PlacementReviewItem[]
  // the next question when the page didn't pre-render it (long confirmation / follow-up on one level)
  item: PlayerItem | null
}

async function replay(raw: unknown) {
  const user = await requireUser()
  const input = parseInput(placementInput, raw)
  await limitUser(user.id, 'placement')
  const bundle = await getCourse(input.course)
  if (!bundle) throw new Error('Unknown course')
  const snapshot = await getContent()
  const unitOf = placementUnitOf(bundle, snapshot.placementUnits, (id) => exerciseUnit(snapshot, bundle, id))
  const seed = placementSeed(user.id, input.nonce)
  // the browser's opaque option ids → authored ids before grading (src/server/quiz-ids.ts)
  const answers = input.answers.map((a) => {
    const unit = unitOf(a.id)
    return unit?.kind === 'quiz' ? { ...a, chosen: optionIds.resolve(unit, a.chosen) } : a
  })
  const run = replayPlacement(bundle, answers, seed, unitOf, { followUp: input.followUp })
  if (!run.ok) throw new Error('Invalid placement answers')
  return { user, input, bundle, run, snapshot, unitOf, seed }
}

// Start sections a bank-mode result may begin with: the default one and, when the level's lessons are still planned,
// one level lower (repeat a bit more). Always active path sections at or below the default.
function startChoices(bundle: CourseBundle, r: PlacementResult): PlacementResultView['starts'] {
  const path = bundle.sections.filter((s) => s.kind === 'path' && s.status !== 'planned' && s.index <= r.sectionIndex)
  const first = path.find((s) => s.index === r.sectionIndex)
  if (!first) return []
  const out = [{ id: first.id, index: first.index, level: first.level }]
  if (bundle.placement.bank && r.lessonsReady === false) {
    const lower = path.filter((s) => levelRank(s.level) < levelRank(first.level)).at(-1)
    if (lower) out.push({ id: lower.id, index: lower.index, level: lower.level })
  }
  return out
}

function resultView(bundle: CourseBundle, r: PlacementResult): PlacementResultView {
  const skills: PlacementResultView['skills'] = r.skills ? {} : null
  if (r.skills && skills) for (const [k, v] of Object.entries(r.skills)) if (v) skills[k] = { level: v.level, asked: v.asked, correct: v.correct, measured: v.measured, exam: v.exam }
  return {
    level: r.level,
    sectionIndex: r.sectionIndex,
    sectionId: r.sectionId,
    confident: r.confident,
    confidence: r.confidence ?? null,
    followUp: r.followUp ?? false,
    skills,
    strong: r.strong ?? [],
    weak: r.weak ?? [],
    exam: r.exam ?? null,
    examNote: r.exam ? (bundle.course.exam?.note ?? null) : null,
    lessonsReady: r.lessonsReady ?? true,
    startLevel: r.startLevel ?? null,
    perSkill: r.perSkill ?? false,
    starts: startChoices(bundle, r),
  }
}

export async function placementStep(raw: { course: string; nonce: string; answers: RawAnswer[]; followUp?: boolean; withItem?: boolean }): Promise<PlacementStepResult> {
  const { run, input, bundle, snapshot, unitOf, seed } = await replay(raw)
  const last = run.graded.at(-1)
  const review: PlacementReviewItem[] = []
  if (run.result && bundle.placement.bank) {
    // the test is over: its mistakes may show their keys and explanations now
    for (const [i, g] of run.graded.entries()) {
      if (g.correct) continue
      const unit = unitOf(g.exerciseId)
      if (!unit || unit.kind !== 'quiz') continue
      const chapter = snapshot.placementChapters.get(unit.chapterId) ?? snapshot.chapters.get(unit.chapterId)
      const explanation = unit.explanation && chapter ? await renderMdast(unit.explanation, { snapshot, chapter, depth: 0, variant: 'card' }) : null
      review.push({ id: unit.id, chosen: input.answers[i]?.chosen ?? [], dontKnow: g.dontKnow === true, key: optionIds.key(unit).options, explanation })
    }
  }
  return {
    done: run.step.done,
    next: run.step.next,
    asked: run.step.asked,
    maxQuestions: run.step.maxQuestions,
    phase: run.step.phase ?? null,
    lastCorrect: last ? last.correct : null,
    result: run.result ? resultView(bundle, run.result) : null,
    review,
    item: run.step.next && (input.withItem || !placementCandidates(bundle, seed).includes(run.step.next)) ? ((await renderLessonItems(snapshot, [{ kind: 'unit', id: run.step.next }]))[0] ?? null) : null,
  }
}

// `credit`: a test-verified level lifts the character's rank (src/game/placement-credit.ts) — XP and milestones up to
// a fixed step, once per course (topped up by a better retake), no gems. Every save keeps the credit already earned.
async function savePlacement(courseIdValue: string, placement: EnrollmentPlacement, lvl: Level, credit?: PlacementCredit): Promise<void> {
  const profile = await getProfile()
  await userScope(
    async (tx, userId) => {
      await enrollIn(tx, userId, courseIdValue, { level: lvl, activate: true, placement })
      const prev = (await first(tx.select({ placement: enrollments.placement }).from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseIdValue)))))?.placement?.credit
      const merged = credit ? maxCredit(prev, credit) : prev
      const saved: EnrollmentPlacement = merged ? { ...placement, credit: merged } : placement
      await tx
        .update(enrollments)
        .set({ level: lvl, placement: saved })
        .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseIdValue)))
      const xpDelta = (merged?.xp ?? 0) - (prev?.xp ?? 0)
      if (xpDelta > 0) await tx.insert(xpLedger).values({ userId, amount: xpDelta, reason: 'placement', refId: courseIdValue, createdAt: placement.at, day: dayKey(placement.at) })
      if (credit) {
        // the steps reached by the credit: stored without their gems and without the full-screen rank-up moment
        const [state, input] = await Promise.all([loadState(tx, userId, placement.at), rankInput(tx, userId)])
        const step = rankOf(input).index
        if (step > state.evoStep) await saveState(tx, userId, { evoStep: step, evoSeen: Math.max(state.evoSeen, step) }, placement.at)
      }
      await tx
        .update(profiles)
        .set({ onboarding: { ...profile?.onboarding, placement: { level: placement.level, at: placement.at } }, updatedAt: placement.at })
        .where(eq(profiles.id, userId))
    },
    { tx: true },
  )
  revalidatePath('/', 'layout')
}

const applyInput = z.object({ start: z.string().max(200).optional() })

// Applies the placement result: level + first section to study (earlier sections count as known). Bank mode also
// stores the per-skill levels, the confidence and the exam (IELTS…) estimate; `start` — one of the offered start sections.
export async function applyPlacement(raw: { course: string; nonce: string; answers: RawAnswer[]; followUp?: boolean; start?: string }): Promise<{ ok: true }> {
  const { start } = parseInput(applyInput, { start: raw.start })
  const { input, run, bundle } = await replay({ course: raw.course, nonce: raw.nonce, answers: raw.answers, followUp: raw.followUp })
  if (!run.result) throw new Error('Placement not finished')
  const now = Date.now()
  const r = run.result
  const view = resultView(bundle, r)
  const chosen = start ? view.starts.find((s) => s.id === start) : view.starts[0]
  if (start && !chosen) throw new Error('Unknown start section')
  const sectionIndex = chosen?.index ?? r.sectionIndex
  const sectionId = chosen?.id ?? r.sectionId
  // stored under the jsonb keys of the IELTS-only days (`ielts`: the band label of the course's exam) — no migration
  const stored: EnrollmentPlacement['skills'] = view.skills
    ? Object.fromEntries(Object.entries(view.skills).flatMap(([k, v]) => (v ? [[k, { level: v.level, asked: v.asked, correct: v.correct, measured: v.measured, ielts: v.exam?.label ?? null }]] : [])))
    : undefined
  const extra: Partial<EnrollmentPlacement> = r.confidence ? { confidence: r.confidence, skills: stored, ielts: view.exam?.label ?? null, followUp: r.followedUp ?? false } : {}
  await savePlacement(input.course, { level: r.level, sectionIndex, sectionId, confident: r.confident, asked: run.step.asked, at: now, ...extra }, r.level, placementCredit(levelRank(r.level)))
  return { ok: true }
}

const zeroInput = z.object({ course: courseId, next })

// «Почати з нуля»: keep the self-assessed level, start from the first section.
export async function startFromZero(form: FormData): Promise<void> {
  const user = await requireUser()
  const input = parseInput(zeroInput, { course: field(form, 'course'), next: field(form, 'next') })
  await limitUser(user.id, 'placement')
  const bundle = await getCourse(input.course)
  if (!bundle) throw new Error('Unknown course')
  const lvl = levelFromPreference((await getProfile())?.preferences.level, bundle.course)
  await savePlacement(input.course, { level: lvl, sectionIndex: 0, sectionId: bundle.sections[0]?.id ?? null, confident: false, asked: 0, at: Date.now(), skipped: true }, lvl)
  redirect(safeRedirectPath(input.next ?? '/path'))
}

const startInput = z.object({ course: courseId, level, next })

// Manual start without the test (language courses: «з нуля» → A1, «трохи знаю» → A2…): the level plus the first path
// section that teaches it; earlier sections count as known.
export async function startAtLevel(form: FormData): Promise<void> {
  const user = await requireUser()
  const input = parseInput(startInput, { course: field(form, 'course'), level: field(form, 'level'), next: field(form, 'next') })
  await limitUser(user.id, 'placement')
  const bundle = await getCourse(input.course)
  if (!bundle) throw new Error('Unknown course')
  // programming courses with skills: only «Я новачок» (the lowest level)
  if (!manualStartAllowed(bundle, input.level)) throw new Error('Unknown level')
  const { index, id } = sectionForLevel(bundle, input.level)
  await savePlacement(input.course, { level: input.level, sectionIndex: index, sectionId: id, confident: false, asked: 0, at: Date.now(), skipped: true }, input.level)
  redirect(safeRedirectPath(input.next ?? '/path'))
}

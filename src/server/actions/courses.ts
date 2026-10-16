'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { LEVELS, type Level } from '@/course'
import { first } from '@/db/client'
import { enrollments, profiles, type EnrollmentPlacement } from '@/db/schema'
import { safeRedirectPath } from '@/lib/redirect'
import { getProfile, requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { getContent } from '../content'
import { activate, enrollIn, levelFromPreference } from '../courses/enrollment'
import { limitUser } from '../courses/limits'
import { placementSeed, replayPlacement } from '../courses/placement-core'
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
  const lvl = levelFromPreference((await getProfile())?.preferences.level)
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
  await knownCourse(input.course)
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
const rawAnswer = z.object({ id: z.string().min(1).max(200), chosen: z.array(z.string().max(2000)).max(64), text: z.string().max(2000).nullable() })
const placementInput = z.object({ course: courseId, nonce, answers: z.array(rawAnswer).max(60) })

export interface PlacementStepResult {
  done: boolean
  next: string | null
  asked: number
  maxQuestions: number
  // the verdict of the last answer, graded on the server
  lastCorrect: boolean | null
  result: { level: Level; sectionIndex: number; sectionId: string | null; confident: boolean } | null
}

async function replay(raw: unknown) {
  const user = await requireUser()
  const input = parseInput(placementInput, raw)
  await limitUser(user.id, 'placement')
  const bundle = await getCourse(input.course)
  if (!bundle) throw new Error('Unknown course')
  const snapshot = await getContent()
  const run = replayPlacement(bundle, input.answers, placementSeed(user.id, input.nonce), (id) => exerciseUnit(snapshot, bundle, id))
  if (!run.ok) throw new Error('Invalid placement answers')
  return { user, input, bundle, run }
}

export async function placementStep(raw: { course: string; nonce: string; answers: Array<{ id: string; chosen: string[]; text: string | null }> }): Promise<PlacementStepResult> {
  const { run } = await replay(raw)
  const last = run.graded.at(-1)
  return {
    done: run.step.done,
    next: run.step.next,
    asked: run.step.asked,
    maxQuestions: run.step.maxQuestions,
    lastCorrect: last ? last.correct : null,
    result: run.result ? { level: run.result.level, sectionIndex: run.result.sectionIndex, sectionId: run.result.sectionId, confident: run.result.confident } : null,
  }
}

async function savePlacement(courseIdValue: string, placement: EnrollmentPlacement, lvl: Level): Promise<void> {
  const profile = await getProfile()
  await userScope(
    async (tx, userId) => {
      await enrollIn(tx, userId, courseIdValue, { level: lvl, activate: true, placement })
      await tx
        .update(enrollments)
        .set({ level: lvl, placement })
        .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseIdValue)))
      await tx
        .update(profiles)
        .set({ onboarding: { ...profile?.onboarding, placement: { level: placement.level, at: placement.at } }, updatedAt: placement.at })
        .where(eq(profiles.id, userId))
    },
    { tx: true },
  )
  revalidatePath('/', 'layout')
}

// Applies the placement result: level + first section to study (earlier sections count as known).
export async function applyPlacement(raw: { course: string; nonce: string; answers: Array<{ id: string; chosen: string[]; text: string | null }> }): Promise<{ ok: true }> {
  const { input, run } = await replay(raw)
  if (!run.result) throw new Error('Placement not finished')
  const now = Date.now()
  const r = run.result
  await savePlacement(input.course, { level: r.level, sectionIndex: r.sectionIndex, sectionId: r.sectionId, confident: r.confident, asked: run.step.asked, at: now }, r.level)
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
  const lvl = levelFromPreference((await getProfile())?.preferences.level)
  await savePlacement(input.course, { level: lvl, sectionIndex: 0, sectionId: bundle.sections[0]?.id ?? null, confident: false, asked: 0, at: Date.now(), skipped: true }, lvl)
  redirect(safeRedirectPath(input.next ?? '/path'))
}

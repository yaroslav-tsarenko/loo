'use server'

import { randomUUID } from 'node:crypto'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { z } from 'zod'
import { first, type Conn } from '@/db/client'
import { attempts, chapterProgress, dailyActivity, sessions, taskState } from '@/db/schema'
import { dayKey } from '@/progress/day'
import type { Effect, FlashRating } from '@/progress/types'
import { requireUser, userScope } from '../auth'
import { ids, parseInput } from '../auth-guard'
import { getContent } from '../content'
import { limitUser } from '../courses/limits'
import { BUCKS, buckRef, PRACTICE_MIN_ANSWERS, PRACTICE_REFILL } from '@/game'
import { addHearts, awardBucks, loadState } from '../game'
import { readForAttempt, recordAttempt, recordAttemptIn, settleProgress } from '../services/progress'

async function unitOrThrow(unitId: string) {
  const snapshot = await getContent()
  const unit = snapshot.units.get(unitId)
  if (!unit) throw new Error('Unknown unit')
  return { snapshot, unit }
}

const sessionRef = ids.session.nullable()

const flashInput = z.object({ unitId: ids.unit, rating: z.enum(['again', 'hard', 'good']), durationMs: ids.durationMs, sessionId: sessionRef })
const hints = z.number().int().min(0).max(50)
const taskInput = z.object({ unitId: ids.unit, solved: z.boolean(), hintsUsed: hints, durationMs: ids.durationMs, sessionId: sessionRef })
const draftInput = z.object({ unitId: ids.unit, hintsRevealed: hints, draft: z.string().max(20_000) })
const chapterInput = z.object({ chapterId: ids.chapter, studied: z.boolean() })
const clamp = (min: number, max: number) => z.number().transform((n) => Math.max(min, Math.min(max, Math.round(n))))
const readingInput = z.object({ chapterId: ids.chapter, scrollPct: clamp(0, 100), deltaMs: clamp(0, 120_000) })
const filterValue = z.union([z.string().max(300), z.number(), z.boolean(), z.null(), z.array(z.string().max(200)).max(50)])
const sessionInput = z.object({
  mode: z.enum(['flashcards', 'quiz', 'tasks', 'mistakes']),
  unitIds: z.array(ids.unit).max(500),
  filters: z.record(z.string().max(40), filterValue).refine((f) => Object.keys(f).length <= 20, 'too many filters'),
})
const endInput = z.object({ sessionId: ids.session })

// Quizzes are answered through answerQuiz (./answers.ts): the server grades the raw answer — there is no action
// that accepts a client-side «correct» flag any more.

export async function rateFlashcard(raw: { unitId: string; rating: FlashRating; durationMs: number; sessionId: string | null }): Promise<Effect[]> {
  const user = await requireUser()
  const input = parseInput(flashInput, raw)
  await limitUser(user.id, 'answer')
  const { snapshot, unit } = await unitOrThrow(input.unitId)
  return await recordAttempt(snapshot, unit, { unitId: unit.id, outcome: input.rating, durationMs: input.durationMs, sessionId: input.sessionId })
}

export async function finishTask(raw: { unitId: string; solved: boolean; hintsUsed: number; durationMs: number; sessionId: string | null }): Promise<Effect[]> {
  const user = await requireUser()
  const input = parseInput(taskInput, raw)
  await limitUser(user.id, 'answer')
  const { snapshot, unit } = await unitOrThrow(input.unitId)
  if (unit.kind !== 'task') throw new Error('Unknown task')
  const now = Date.now()
  // the attempt and the task's state in one transaction
  return userScope(
    async (tx, userId) => {
      const effects = await recordAttemptIn(
        tx,
        userId,
        snapshot,
        unit,
        { unitId: unit.id, outcome: input.solved ? 'solved' : 'failed', hintsUsed: input.hintsUsed, durationMs: input.durationMs, sessionId: input.sessionId },
        now,
        await readForAttempt(tx, userId, unit, now),
      )
      await tx
        .insert(taskState)
        .values({ userId, unitId: unit.id, hintsRevealed: input.hintsUsed, status: input.solved ? 'solved' : 'failed', updatedAt: now })
        .onConflictDoUpdate({ target: [taskState.userId, taskState.unitId], set: { status: input.solved ? 'solved' : 'failed', hintsRevealed: input.hintsUsed, updatedAt: now } })
      return effects
    },
    { lock: true },
  )
}

export async function saveTaskDraft(raw: { unitId: string; hintsRevealed: number; draft: string }): Promise<void> {
  await requireUser()
  const input = parseInput(draftInput, raw)
  // Only known tasks get a row: no arbitrary keys in task_state.
  const { unit } = await unitOrThrow(input.unitId)
  if (unit.kind !== 'task') throw new Error('Unknown task')
  const now = Date.now()
  const { draft, hintsRevealed } = input
  await userScope((db, userId) =>
    db
      .insert(taskState)
      .values({ userId, unitId: unit.id, hintsRevealed, draft, status: 'open', updatedAt: now })
      .onConflictDoUpdate({ target: [taskState.userId, taskState.unitId], set: { hintsRevealed, draft, updatedAt: now } }),
  )
}

export async function markChapter(raw: { chapterId: string; studied: boolean }): Promise<Effect[]> {
  await requireUser()
  const input = parseInput(chapterInput, raw)
  const snapshot = await getContent()
  const chapter = snapshot.chapters.get(input.chapterId)
  if (!chapter) throw new Error('Unknown chapter')
  const now = Date.now()
  return userScope(
    async (tx, userId) => {
      const status = input.studied ? ('studied' as const) : ('reading' as const)
      await tx
        .insert(chapterProgress)
        .values({ userId, chapterId: chapter.id, guideId: chapter.guideId, status, scrollPct: input.studied ? 100 : 0, studiedAt: input.studied ? now : null, lastOpenedAt: now })
        .onConflictDoUpdate({ target: [chapterProgress.userId, chapterProgress.chapterId], set: { status, studiedAt: input.studied ? now : null, lastOpenedAt: now } })
      return input.studied ? (await settleProgress(tx, userId, snapshot, now)).effects : []
    },
    { lock: true },
  )
}

export async function trackReading(raw: { chapterId: string; scrollPct: number; deltaMs: number }): Promise<void> {
  await requireUser()
  const input = parseInput(readingInput, raw)
  const snapshot = await getContent()
  const chapter = snapshot.chapters.get(input.chapterId)
  if (!chapter) return
  const now = Date.now()
  const pct = Math.max(0, Math.min(100, Math.round(input.scrollPct)))
  const delta = Math.max(0, Math.min(Math.round(input.deltaMs), 120_000))
  await userScope(
    async (tx, userId) => {
      await tx
        .insert(chapterProgress)
        .values({ userId, chapterId: chapter.id, guideId: chapter.guideId, status: 'reading', scrollPct: pct, timeMs: delta, lastOpenedAt: now })
        .onConflictDoUpdate({
          target: [chapterProgress.userId, chapterProgress.chapterId],
          set: {
            scrollPct: sql`greatest(${chapterProgress.scrollPct}, ${pct})`,
            timeMs: sql`${chapterProgress.timeMs} + ${delta}`,
            lastOpenedAt: now,
          },
        })
      if (delta > 0) {
        await tx
          .insert(dailyActivity)
          .values({ userId, day: dayKey(now), timeMs: delta })
          .onConflictDoUpdate({ target: [dailyActivity.userId, dailyActivity.day], set: { timeMs: sql`${dailyActivity.timeMs} + ${delta}` } })
      }
    },
    { tx: true },
  )
}

export async function startSession(raw: { mode: 'flashcards' | 'quiz' | 'tasks' | 'mistakes'; unitIds: string[]; filters: Record<string, unknown> }): Promise<string> {
  const user = await requireUser()
  const input = parseInput(sessionInput, raw)
  await limitUser(user.id, 'session')
  const id = randomUUID()
  await userScope((db, userId) => db.insert(sessions).values({ id, userId, mode: input.mode, filters: input.filters, unitIds: input.unitIds, startedAt: Date.now() }))
  return id
}

export async function endSession(raw: { sessionId: string }): Promise<Effect[]> {
  await requireUser()
  const input = parseInput(endInput, raw)
  const snapshot = await getContent()
  const now = Date.now()
  return userScope(
    async (tx, userId) => {
      // Ends the session exactly once: a second (concurrent or replayed) call finds it closed and gets nothing.
      const row = await first(
        tx
          .update(sessions)
          .set({ endedAt: now })
          .where(and(eq(sessions.userId, userId), eq(sessions.id, input.sessionId), isNull(sessions.endedAt)))
          .returning(),
      )
      if (!row) return []
      const effects: Effect[] = []
      // «Робота над помилками»: a finished practice session refills one heart and pays bucks (daily cap). It counts
      // server-graded quizzes of this session's own exercises, each once — not the session's counters, which
      // self-rated flashcards (or one card rated five times) could fill.
      if ((row.mode === 'mistakes' || row.mode === 'quiz') && (await practiceAnswers(tx, userId, row.id, row.unitIds)) >= PRACTICE_MIN_ANSWERS) {
        const before = (await loadState(tx, userId, now)).hearts.hearts
        const after = await addHearts(tx, userId, PRACTICE_REFILL, now)
        if (after.hearts > before) effects.push({ type: 'hearts', hearts: after.hearts, delta: after.hearts - before })
        const bucks = await awardBucks(tx, userId, { amount: BUCKS.practice, reason: 'practice', refId: buckRef.practice(input.sessionId), now })
        if (bucks > 0) effects.push({ type: 'bucks', amount: bucks, reason: 'practice' })
      }
      // game + achievements (no mission step here, as before)
      effects.push(...(await settleProgress(tx, userId, snapshot, now, { mission: null })).effects)
      return effects
    },
    { lock: true },
  )
}

// Distinct quizzes of the session's exercise list answered in it (graded by the server).
async function practiceAnswers(tx: Conn, userId: string, sessionId: string, unitIds: readonly string[]): Promise<number> {
  const rows = await tx
    .selectDistinct({ unitId: attempts.unitId })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.sessionId, sessionId), eq(attempts.kind, 'quiz')))
  const planned = new Set(unitIds)
  return rows.filter((r) => planned.has(r.unitId)).length
}

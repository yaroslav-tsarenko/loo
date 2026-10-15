'use server'

import { randomUUID } from 'node:crypto'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { first, getDb } from '@/db/client'
import { chapterProgress, dailyActivity, sessions, taskState } from '@/db/schema'
import { dayKey } from '@/progress/day'
import type { Effect, FlashRating } from '@/progress/types'
import { ids, parseInput, requireSession } from '../auth-guard'
import { getContent } from '../content'
import { settleMission } from '../services/mission'
import { evaluateAchievements, recordAttempt } from '../services/progress'

async function unitOrThrow(unitId: string) {
  const snapshot = await getContent()
  const unit = snapshot.units.get(unitId)
  if (!unit) throw new Error('Unknown unit')
  return { snapshot, unit }
}

const sessionRef = ids.session.nullable()

const quizInput = z.object({ unitId: ids.unit, correct: z.boolean(), durationMs: ids.durationMs, sessionId: sessionRef })
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

export async function recordQuizAnswer(raw: { unitId: string; correct: boolean; durationMs: number; sessionId: string | null }): Promise<Effect[]> {
  await requireSession()
  const input = parseInput(quizInput, raw)
  const { snapshot, unit } = await unitOrThrow(input.unitId)
  return await recordAttempt(snapshot, unit, { unitId: unit.id, outcome: input.correct ? 'correct' : 'wrong', durationMs: input.durationMs, sessionId: input.sessionId })
}

export async function rateFlashcard(raw: { unitId: string; rating: FlashRating; durationMs: number; sessionId: string | null }): Promise<Effect[]> {
  await requireSession()
  const input = parseInput(flashInput, raw)
  const { snapshot, unit } = await unitOrThrow(input.unitId)
  return await recordAttempt(snapshot, unit, { unitId: unit.id, outcome: input.rating, durationMs: input.durationMs, sessionId: input.sessionId })
}

export async function finishTask(raw: { unitId: string; solved: boolean; hintsUsed: number; durationMs: number; sessionId: string | null }): Promise<Effect[]> {
  await requireSession()
  const input = parseInput(taskInput, raw)
  const { snapshot, unit } = await unitOrThrow(input.unitId)
  if (unit.kind !== 'task') throw new Error('Unknown task')
  const effects = await recordAttempt(snapshot, unit, {
    unitId: unit.id,
    outcome: input.solved ? 'solved' : 'failed',
    hintsUsed: input.hintsUsed,
    durationMs: input.durationMs,
    sessionId: input.sessionId,
  })
  const now = Date.now()
  await getDb()
    .insert(taskState)
    .values({ unitId: unit.id, hintsRevealed: input.hintsUsed, status: input.solved ? 'solved' : 'failed', updatedAt: now })
    .onConflictDoUpdate({ target: taskState.unitId, set: { status: input.solved ? 'solved' : 'failed', hintsRevealed: input.hintsUsed, updatedAt: now } })
  return effects
}

export async function saveTaskDraft(raw: { unitId: string; hintsRevealed: number; draft: string }): Promise<void> {
  await requireSession()
  const input = parseInput(draftInput, raw)
  // Only known tasks get a row: no arbitrary keys in task_state.
  const { unit } = await unitOrThrow(input.unitId)
  if (unit.kind !== 'task') throw new Error('Unknown task')
  const now = Date.now()
  const { draft, hintsRevealed } = input
  await getDb()
    .insert(taskState)
    .values({ unitId: unit.id, hintsRevealed, draft, status: 'open', updatedAt: now })
    .onConflictDoUpdate({ target: taskState.unitId, set: { hintsRevealed, draft, updatedAt: now } })
}

export async function markChapter(raw: { chapterId: string; studied: boolean }): Promise<Effect[]> {
  await requireSession()
  const input = parseInput(chapterInput, raw)
  const snapshot = await getContent()
  const chapter = snapshot.chapters.get(input.chapterId)
  if (!chapter) throw new Error('Unknown chapter')
  const db = getDb()
  const now = Date.now()
  return db.transaction(async (tx) => {
    const status = input.studied ? ('studied' as const) : ('reading' as const)
    await tx
      .insert(chapterProgress)
      .values({ chapterId: chapter.id, guideId: chapter.guideId, status, scrollPct: input.studied ? 100 : 0, studiedAt: input.studied ? now : null, lastOpenedAt: now })
      .onConflictDoUpdate({ target: chapterProgress.chapterId, set: { status, studiedAt: input.studied ? now : null, lastOpenedAt: now } })
    return input.studied ? [...(await settleMission(tx, now)), ...(await evaluateAchievements(tx, snapshot, now))] : []
  })
}

export async function trackReading(raw: { chapterId: string; scrollPct: number; deltaMs: number }): Promise<void> {
  await requireSession()
  const input = parseInput(readingInput, raw)
  const snapshot = await getContent()
  const chapter = snapshot.chapters.get(input.chapterId)
  if (!chapter) return
  const now = Date.now()
  const pct = Math.max(0, Math.min(100, Math.round(input.scrollPct)))
  const delta = Math.max(0, Math.min(Math.round(input.deltaMs), 120_000))
  const db = getDb()
  await db.transaction(async (tx) => {
    await tx
      .insert(chapterProgress)
      .values({ chapterId: chapter.id, guideId: chapter.guideId, status: 'reading', scrollPct: pct, timeMs: delta, lastOpenedAt: now })
      .onConflictDoUpdate({
        target: chapterProgress.chapterId,
        set: {
          scrollPct: sql`greatest(${chapterProgress.scrollPct}, ${pct})`,
          timeMs: sql`${chapterProgress.timeMs} + ${delta}`,
          lastOpenedAt: now,
        },
      })
    if (delta > 0) {
      await tx
        .insert(dailyActivity)
        .values({ day: dayKey(now), timeMs: delta })
        .onConflictDoUpdate({ target: dailyActivity.day, set: { timeMs: sql`${dailyActivity.timeMs} + ${delta}` } })
    }
  })
}

export async function startSession(raw: { mode: 'flashcards' | 'quiz' | 'tasks' | 'mistakes'; unitIds: string[]; filters: Record<string, unknown> }): Promise<string> {
  await requireSession()
  const input = parseInput(sessionInput, raw)
  const id = randomUUID()
  await getDb().insert(sessions).values({ id, mode: input.mode, filters: input.filters, unitIds: input.unitIds, startedAt: Date.now() })
  return id
}

export async function endSession(raw: { sessionId: string }): Promise<Effect[]> {
  await requireSession()
  const input = parseInput(endInput, raw)
  const snapshot = await getContent()
  const db = getDb()
  const now = Date.now()
  return db.transaction(async (tx) => {
    const row = await first(tx.select().from(sessions).where(eq(sessions.id, input.sessionId)))
    if (!row || row.endedAt) return []
    await tx.update(sessions).set({ endedAt: now }).where(eq(sessions.id, input.sessionId))
    return await evaluateAchievements(tx, snapshot, now)
  })
}

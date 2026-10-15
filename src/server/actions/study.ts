'use server'

import { randomUUID } from 'node:crypto'
import { eq, sql } from 'drizzle-orm'
import { first, getDb } from '@/db/client'
import { chapterProgress, dailyActivity, sessions, taskState } from '@/db/schema'
import { dayKey } from '@/progress/day'
import type { Effect, FlashRating } from '@/progress/types'
import { getContent } from '../content'
import { settleMission } from '../services/mission'
import { evaluateAchievements, recordAttempt } from '../services/progress'

async function unitOrThrow(unitId: string) {
  const snapshot = await getContent()
  const unit = snapshot.units.get(unitId)
  if (!unit) throw new Error(`Unknown unit ${unitId}`)
  return { snapshot, unit }
}

export async function recordQuizAnswer(input: { unitId: string; correct: boolean; durationMs: number; sessionId: string | null }): Promise<Effect[]> {
  const { snapshot, unit } = await unitOrThrow(input.unitId)
  return await recordAttempt(snapshot, unit, { unitId: unit.id, outcome: input.correct ? 'correct' : 'wrong', durationMs: input.durationMs, sessionId: input.sessionId })
}

export async function rateFlashcard(input: { unitId: string; rating: FlashRating; durationMs: number; sessionId: string | null }): Promise<Effect[]> {
  const { snapshot, unit } = await unitOrThrow(input.unitId)
  if (!['again', 'hard', 'good'].includes(input.rating)) throw new Error('Bad rating')
  return await recordAttempt(snapshot, unit, { unitId: unit.id, outcome: input.rating, durationMs: input.durationMs, sessionId: input.sessionId })
}

export async function finishTask(input: { unitId: string; solved: boolean; hintsUsed: number; durationMs: number; sessionId: string | null }): Promise<Effect[]> {
  const { snapshot, unit } = await unitOrThrow(input.unitId)
  const effects = await recordAttempt(snapshot, unit, {
    unitId: unit.id,
    outcome: input.solved ? 'solved' : 'failed',
    hintsUsed: Math.max(0, Math.floor(input.hintsUsed)),
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

export async function saveTaskDraft(input: { unitId: string; hintsRevealed: number; draft: string }): Promise<void> {
  const now = Date.now()
  const draft = input.draft.slice(0, 20_000)
  const hints = Math.max(0, Math.floor(input.hintsRevealed))
  await getDb()
    .insert(taskState)
    .values({ unitId: input.unitId, hintsRevealed: hints, draft, status: 'open', updatedAt: now })
    .onConflictDoUpdate({ target: taskState.unitId, set: { hintsRevealed: hints, draft, updatedAt: now } })
}

export async function markChapter(input: { chapterId: string; studied: boolean }): Promise<Effect[]> {
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

export async function trackReading(input: { chapterId: string; scrollPct: number; deltaMs: number }): Promise<void> {
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

export async function startSession(input: { mode: 'flashcards' | 'quiz' | 'tasks' | 'mistakes'; unitIds: string[]; filters: Record<string, unknown> }): Promise<string> {
  const id = randomUUID()
  await getDb().insert(sessions).values({ id, mode: input.mode, filters: input.filters, unitIds: input.unitIds.slice(0, 500), startedAt: Date.now() })
  return id
}

export async function endSession(input: { sessionId: string }): Promise<Effect[]> {
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

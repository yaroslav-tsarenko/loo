'use server'

import { randomUUID } from 'node:crypto'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { first, getDb } from '@/db/client'
import { dailyActivity, lessonProgress, sessions, xpLedger } from '@/db/schema'
import { dayKey } from '@/progress/day'
import type { Effect } from '@/progress/types'
import { ids, parseInput, requireSession } from '../auth-guard'
import { getContent } from '../content'
import { findLesson, LESSON_XP } from '../services/lessons'
import { settleMission } from '../services/mission'
import { evaluateAchievements } from '../services/progress'

const completeInput = z
  .object({ lessonId: ids.lesson, sessionId: ids.session.nullable(), correct: z.number().int().min(0).max(1000), total: z.number().int().min(0).max(1000) })
  .refine((v) => v.correct <= v.total, 'correct > total')

export async function startLesson(rawId: string): Promise<string> {
  await requireSession()
  const lessonId = parseInput(ids.lesson, rawId)
  const snapshot = await getContent()
  const lesson = findLesson(snapshot, lessonId)
  if (!lesson) throw new Error('Unknown lesson')
  const id = randomUUID()
  const unitIds = lesson.items.flatMap((i) => (i.kind === 'unit' ? [i.id] : []))
  await getDb().insert(sessions).values({ id, mode: 'lesson', filters: { lessonId }, unitIds, startedAt: Date.now() })
  return id
}

export interface LessonOutcome {
  effects: Effect[]
  bonusXp: number
  firstTime: boolean
}

export async function completeLesson(raw: { lessonId: string; sessionId: string | null; correct: number; total: number }): Promise<LessonOutcome> {
  await requireSession()
  const input = parseInput(completeInput, raw)
  const snapshot = await getContent()
  const lesson = findLesson(snapshot, input.lessonId)
  if (!lesson) throw new Error('Unknown lesson')
  const now = Date.now()
  const day = dayKey(now)
  const accuracy = input.total > 0 ? Math.max(0, Math.min(1, input.correct / input.total)) : 1
  return getDb().transaction(async (tx) => {
    const before = await first(tx.select().from(lessonProgress).where(eq(lessonProgress.lessonId, lesson.id)))
    const firstTime = !before
    // Bonus once for the first pass and once for the first flawless pass — replays still earn per-question XP.
    const bonusXp = (firstTime ? LESSON_XP.first : 0) + (accuracy === 1 && (before?.bestAccuracy ?? 0) < 1 ? LESSON_XP.perfect : 0)
    await tx
      .insert(lessonProgress)
      .values({ lessonId: lesson.id, guideId: lesson.guideId, chapterId: lesson.chapterId, completions: 1, bestAccuracy: accuracy, lastXp: bonusXp, firstCompletedAt: now, lastCompletedAt: now })
      .onConflictDoUpdate({
        target: lessonProgress.lessonId,
        set: { completions: sql`${lessonProgress.completions} + 1`, bestAccuracy: sql`greatest(${lessonProgress.bestAccuracy}, ${accuracy})`, lastXp: bonusXp, lastCompletedAt: now },
      })
    const effects: Effect[] = []
    if (bonusXp > 0) {
      await tx.insert(xpLedger).values({ amount: bonusXp, reason: 'lesson', refId: lesson.id, createdAt: now, day })
      await tx
        .insert(dailyActivity)
        .values({ day, xp: bonusXp })
        .onConflictDoUpdate({ target: dailyActivity.day, set: { xp: sql`${dailyActivity.xp} + ${bonusXp}` } })
      effects.push({ type: 'xp', amount: bonusXp, reason: 'lesson' })
    }
    if (input.sessionId) await tx.update(sessions).set({ endedAt: now }).where(eq(sessions.id, input.sessionId))
    effects.push(...(await settleMission(tx, now)))
    effects.push(...(await evaluateAchievements(tx, snapshot, now)))
    return { effects, bonusXp, firstTime }
  })
}

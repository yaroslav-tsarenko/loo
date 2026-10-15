'use server'

import { randomUUID } from 'node:crypto'
import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { first } from '@/db/client'
import { dailyActivity, lessonProgress, sessions, xpLedger } from '@/db/schema'
import { dayKey } from '@/progress/day'
import type { Effect } from '@/progress/types'
import { requireUser, userScope } from '../auth'
import { ids, parseInput } from '../auth-guard'
import { getContent } from '../content'
import { findLesson, LESSON_XP } from '../services/lessons'
import { settleMission } from '../services/mission'
import { evaluateAchievements } from '../services/progress'

const completeInput = z
  .object({ lessonId: ids.lesson, sessionId: ids.session.nullable(), correct: z.number().int().min(0).max(1000), total: z.number().int().min(0).max(1000) })
  .refine((v) => v.correct <= v.total, 'correct > total')

export async function startLesson(rawId: string): Promise<string> {
  await requireUser()
  const lessonId = parseInput(ids.lesson, rawId)
  const snapshot = await getContent()
  const lesson = findLesson(snapshot, lessonId)
  if (!lesson) throw new Error('Unknown lesson')
  const id = randomUUID()
  const unitIds = lesson.items.flatMap((i) => (i.kind === 'unit' ? [i.id] : []))
  await userScope((db, userId) => db.insert(sessions).values({ id, userId, mode: 'lesson', filters: { lessonId }, unitIds, startedAt: Date.now() }))
  return id
}

export interface LessonOutcome {
  effects: Effect[]
  bonusXp: number
  firstTime: boolean
}

export async function completeLesson(raw: { lessonId: string; sessionId: string | null; correct: number; total: number }): Promise<LessonOutcome> {
  await requireUser()
  const input = parseInput(completeInput, raw)
  const snapshot = await getContent()
  const lesson = findLesson(snapshot, input.lessonId)
  if (!lesson) throw new Error('Unknown lesson')
  const now = Date.now()
  const day = dayKey(now)
  const accuracy = input.total > 0 ? Math.max(0, Math.min(1, input.correct / input.total)) : 1
  return userScope(
    async (tx, userId) => {
      const before = await first(
        tx
          .select()
          .from(lessonProgress)
          .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lesson.id))),
      )
      const firstTime = !before
      // Bonus once for the first pass and once for the first flawless pass — replays still earn per-question XP.
      const bonusXp = (firstTime ? LESSON_XP.first : 0) + (accuracy === 1 && (before?.bestAccuracy ?? 0) < 1 ? LESSON_XP.perfect : 0)
      await tx
        .insert(lessonProgress)
        .values({ userId, lessonId: lesson.id, guideId: lesson.guideId, chapterId: lesson.chapterId, completions: 1, bestAccuracy: accuracy, lastXp: bonusXp, firstCompletedAt: now, lastCompletedAt: now })
        .onConflictDoUpdate({
          target: [lessonProgress.userId, lessonProgress.lessonId],
          set: { completions: sql`${lessonProgress.completions} + 1`, bestAccuracy: sql`greatest(${lessonProgress.bestAccuracy}, ${accuracy})`, lastXp: bonusXp, lastCompletedAt: now },
        })
      const effects: Effect[] = []
      if (bonusXp > 0) {
        await tx.insert(xpLedger).values({ userId, amount: bonusXp, reason: 'lesson', refId: lesson.id, createdAt: now, day })
        await tx
          .insert(dailyActivity)
          .values({ userId, day, xp: bonusXp })
          .onConflictDoUpdate({ target: [dailyActivity.userId, dailyActivity.day], set: { xp: sql`${dailyActivity.xp} + ${bonusXp}` } })
        effects.push({ type: 'xp', amount: bonusXp, reason: 'lesson' })
      }
      if (input.sessionId) {
        await tx
          .update(sessions)
          .set({ endedAt: now })
          .where(and(eq(sessions.userId, userId), eq(sessions.id, input.sessionId)))
      }
      effects.push(...(await settleMission(tx, userId, now)))
      effects.push(...(await evaluateAchievements(tx, userId, snapshot, now)))
      return { effects, bonusXp, firstTime }
    },
    { tx: true },
  )
}

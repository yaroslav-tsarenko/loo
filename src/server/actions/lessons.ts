'use server'

import { randomUUID } from 'node:crypto'
import { and, asc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { first } from '@/db/client'
import { attempts, lessonProgress, sessions } from '@/db/schema'
import { BUCKS, buckRef, canStartLesson } from '@/game'
import { dayKey } from '@/progress/day'
import type { Effect } from '@/progress/types'
import { requireUser, userScope } from '../auth'
import { ids, parseInput } from '../auth-guard'
import { getContent } from '../content'
import { findCourseLesson, learnerLevel, lessonView } from '../courses/lessons'
import { awardBucks, grantXp, loadState, settleGame, touchLeague } from '../game'
import { findLesson, LESSON_XP } from '../services/lessons'
import { settleMission } from '../services/mission'
import { addDailyXp, evaluateAchievements } from '../services/progress'

// Lessons are graded from what the server recorded: startLesson stores the exercises the learner will see, every answer
// is recorded against the session (answerQuiz / rateFlashcard / finishTask), and completeLesson computes the accuracy
// from those attempts — the client's own counts are ignored.

const completeInput = z.object({ lessonId: ids.lesson, sessionId: ids.session.nullable() })

interface LessonRef {
  id: string
  courseId: string | null
  guideId: string
  chapterId: string
  // the exercises this learner plays (course lessons: at their level), that exist in the content
  unitIds: string[]
}

// Course lessons (`<course>:<section>:<topic>:<kind>-<n>`) and lessons of guides no course covers (old ids).
async function lessonRef(lessonId: string): Promise<LessonRef> {
  const snapshot = await getContent()
  const course = await findCourseLesson(lessonId)
  if (course) {
    const view = lessonView(course.bundle, course.lesson, await learnerLevel(course.bundle.course.id))
    const unitIds = view.items.flatMap((i) => (i.kind === 'unit' && snapshot.units.has(i.id) ? [i.id] : []))
    return { id: course.lesson.id, courseId: course.bundle.course.id, guideId: course.topic.guideId, chapterId: course.topic.chapterId, unitIds }
  }
  const lesson = findLesson(snapshot, lessonId)
  if (!lesson) throw new Error('Unknown lesson')
  return { id: lesson.id, courseId: null, guideId: lesson.guideId, chapterId: lesson.chapterId, unitIds: lesson.items.flatMap((i) => (i.kind === 'unit' && snapshot.units.has(i.id) ? [i.id] : [])) }
}

// A new graded lesson needs at least one ❤️: null = out of hearts (the player offers practice or a refill).
export async function startLesson(rawId: string): Promise<string | null> {
  await requireUser()
  const lessonId = parseInput(ids.lesson, rawId)
  const lesson = await lessonRef(lessonId)
  const id = randomUUID()
  const now = Date.now()
  return userScope(
    async (db, userId) => {
      if (!canStartLesson((await loadState(db, userId, now)).hearts, now)) return null
      await db.insert(sessions).values({ id, userId, mode: 'lesson', filters: { lessonId }, unitIds: lesson.unitIds, startedAt: now })
      return id
    },
    { tx: true },
  )
}

export interface LessonOutcome {
  effects: Effect[]
  bonusXp: number
  bucks: number
  firstTime: boolean
  // server-graded: first answer per exercise
  correct: number
  total: number
  // not every exercise of the session was answered (no bonus, no bucks)
  incomplete: boolean
}

export async function completeLesson(raw: { lessonId: string; sessionId: string | null }): Promise<LessonOutcome> {
  const user = await requireUser()
  const input = parseInput(completeInput, raw)
  const lesson = await lessonRef(input.lessonId)
  const snapshot = await getContent()
  const now = Date.now()
  const day = dayKey(now)
  const empty = (incomplete: boolean): LessonOutcome => ({ effects: [], bonusXp: 0, bucks: 0, firstTime: false, correct: 0, total: 0, incomplete })
  if (!input.sessionId) return empty(true)
  const sessionId = input.sessionId
  const outcome = await userScope(
    async (tx, userId) => {
      const session = await first(
        tx
          .select()
          .from(sessions)
          .where(and(eq(sessions.userId, userId), eq(sessions.id, sessionId))),
      )
      const filters = (session?.filters ?? {}) as { lessonId?: string }
      if (!session || session.mode !== 'lesson' || filters.lessonId !== lesson.id || session.endedAt !== null) return empty(true)
      await tx
        .update(sessions)
        .set({ endedAt: now })
        .where(and(eq(sessions.userId, userId), eq(sessions.id, sessionId)))
      // First recorded answer per exercise of this session.
      const rows = await tx
        .select({ unitId: attempts.unitId, correct: attempts.correct })
        .from(attempts)
        .where(and(eq(attempts.userId, userId), eq(attempts.sessionId, sessionId)))
        .orderBy(asc(attempts.id))
      const firstAnswer = new Map<string, boolean>()
      for (const r of rows) if (!firstAnswer.has(r.unitId)) firstAnswer.set(r.unitId, r.correct)
      const units = session.unitIds
      if (!units.every((u) => firstAnswer.has(u))) return empty(true)
      const correct = units.filter((u) => firstAnswer.get(u)).length
      const accuracy = units.length > 0 ? correct / units.length : 1
      const before = await first(
        tx
          .select()
          .from(lessonProgress)
          .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lesson.id))),
      )
      const firstTime = !before
      // Bonus once for the first pass and once for the first flawless pass — replays still earn per-question XP.
      const bonus = (firstTime ? LESSON_XP.first : 0) + (accuracy === 1 && (before?.bestAccuracy ?? 0) < 1 ? LESSON_XP.perfect : 0)
      const bonusXp = await grantXp(tx, userId, { amount: bonus, reason: 'lesson', refId: lesson.id, now })
      await tx
        .insert(lessonProgress)
        .values({ userId, lessonId: lesson.id, courseId: lesson.courseId, guideId: lesson.guideId, chapterId: lesson.chapterId, completions: 1, bestAccuracy: accuracy, lastXp: bonusXp, firstCompletedAt: now, lastCompletedAt: now })
        .onConflictDoUpdate({
          target: [lessonProgress.userId, lessonProgress.lessonId],
          set: { completions: sql`${lessonProgress.completions} + 1`, bestAccuracy: sql`greatest(${lessonProgress.bestAccuracy}, ${accuracy})`, lastXp: bonusXp, lastCompletedAt: now },
        })
      const effects: Effect[] = []
      if (bonusXp > 0) {
        await addDailyXp(tx, userId, day, bonusXp)
        effects.push({ type: 'xp', amount: bonusXp, reason: 'lesson' })
      }
      // Bucks: 10 per finished lesson, 20 when flawless (daily cap; once per session).
      const bucks = await awardBucks(tx, userId, { amount: accuracy >= 1 ? BUCKS.lessonPerfect : BUCKS.lesson, reason: 'lesson', refId: buckRef.lesson(sessionId), now })
      if (bucks > 0) effects.push({ type: 'bucks', amount: bucks, reason: 'lesson' })
      effects.push(...(await settleMission(tx, userId, now)))
      effects.push(...(await settleGame(tx, userId, now)))
      effects.push(...(await evaluateAchievements(tx, userId, snapshot, now)))
      return { effects, bonusXp, bucks, firstTime, correct, total: units.length, incomplete: false }
    },
    { tx: true },
  )
  if (outcome.bonusXp > 0 || outcome.effects.some((e) => e.type === 'xp')) await touchLeague(user.id, now)
  return outcome
}

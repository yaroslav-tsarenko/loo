'use server'

import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { dailyActivity, xpLedger } from '@/db/schema'
import { dayKey } from '@/progress/day'
import type { Effect } from '@/progress/types'
import { scoreTest } from '@/course'
import { requireUser, userScope } from '../auth'
import { ids, parseInput } from '../auth-guard'
import { getContent } from '../content'
import { limitUser } from '../courses/limits'
import { courseFor, exerciseUnit } from '../courses/registry'
import { readTestRecord, saveGrade, sectionUnfinished, startAttempt } from '../courses/tests'
import { attemptSeed, drawTest, fallbackPool, gradeAnswer, resolveTest, testBonus, type ResolvedTest } from '../courses/tests-core'
import { settleMission } from '../services/mission'
import { evaluateAchievements } from '../services/progress'

// Topic tests (🏁) and section exams (👑). The page draws attempt n with the seed `${userId}:${n}`; startTest records
// the attempt, submitTest re-draws it on the server, re-checks every answer against the content and stores the score.
// The client's own right/wrong flags are never used for the result.

const testId = z.string().min(3).max(300)
const attempt = z.number().int().min(1).max(100_000)
const startInput = z.object({ testId, attempt })
const answerInput = z.object({
  id: ids.unit,
  chosen: z.array(z.string().max(2000)).max(64),
  text: z.string().max(2000).nullable(),
  rating: z.enum(['again', 'hard', 'good']).nullable(),
})
const submitInput = z.object({ testId, attempt, answers: z.array(answerInput).max(100) })

async function resolve(id: string): Promise<ResolvedTest> {
  const bundle = await courseFor(id)
  const test = bundle ? resolveTest(bundle, id) : null
  if (!test) throw new Error('Unknown test')
  return test
}

export async function startTest(raw: { testId: string; attempt: number }): Promise<{ ok: boolean }> {
  const user = await requireUser()
  const input = parseInput(startInput, raw)
  await limitUser(user.id, 'test')
  const test = await resolve(input.testId)
  const ok = await userScope((tx, userId) => startAttempt(tx, userId, test, input.attempt, attemptSeed(userId, input.attempt), Date.now()), { tx: true })
  return { ok }
}

export interface TestOutcome {
  passed: boolean
  correct: number
  total: number
  needed: number
  score: number
  results: boolean[]
  bonusXp: number
  firstPass: boolean
  testOut: boolean
  effects: Effect[]
}

export async function submitTest(raw: { testId: string; attempt: number; answers: Array<{ id: string; chosen: string[]; text: string | null; rating: 'again' | 'hard' | 'good' | null }> }): Promise<TestOutcome> {
  const user = await requireUser()
  const input = parseInput(submitInput, raw)
  await limitUser(user.id, 'test')
  const test = await resolve(input.testId)
  const snapshot = await getContent()
  const unfinished = await sectionUnfinished(test)
  const now = Date.now()
  const day = dayKey(now)
  return userScope(
    async (tx, userId) => {
      const record = await readTestRecord(tx, userId, test)
      const seed = attemptSeed(userId, input.attempt)
      // Only the attempt that was started, once, with the seed it was drawn with.
      if (!record || record.attempts !== input.attempt || record.graded >= input.attempt || record.lastSeed !== seed) throw new Error('Stale attempt')
      const built = drawTest(test, seed)
      if (!built) throw new Error('Unknown test')
      const fallback = fallbackPool(test)
      const scored = scoreTest(built, input.answers, (id, i) => gradeAnswer(built, exerciseUnit(snapshot, test.bundle, id), input.answers[i], fallback))
      if (!scored.ok) {
        if (process.env.NODE_ENV === 'development') console.warn('[tests] answers do not match the draw', { questions: built.questions, answers: input.answers.map((a) => a.id) })
        throw new Error('Invalid answers')
      }
      const testOut = test.kind === 'section-exam' && scored.passed && unfinished
      await saveGrade(tx, userId, test, input.attempt, scored.score, scored.passed, testOut, now)
      const bonusXp = testBonus(test.kind, { passed: record.passed, bestScore: record.bestScore }, { passed: scored.passed, score: scored.score, testOut })
      const effects: Effect[] = []
      if (bonusXp > 0) {
        const reason = test.kind === 'topic-test' ? 'topic-test' : 'section-exam'
        await tx.insert(xpLedger).values({ userId, amount: bonusXp, reason, refId: test.id, createdAt: now, day })
        await tx
          .insert(dailyActivity)
          .values({ userId, day, xp: bonusXp })
          .onConflictDoUpdate({ target: [dailyActivity.userId, dailyActivity.day], set: { xp: sql`${dailyActivity.xp} + ${bonusXp}` } })
        effects.push({ type: 'xp', amount: bonusXp, reason })
      }
      effects.push(...(await settleMission(tx, userId, now)))
      effects.push(...(await evaluateAchievements(tx, userId, snapshot, now)))
      return {
        passed: scored.passed,
        correct: scored.correct,
        total: scored.total,
        needed: built.needed,
        score: scored.score,
        results: scored.results,
        bonusXp,
        firstPass: scored.passed && !record.passed,
        testOut,
        effects,
      }
    },
    { tx: true },
  )
}

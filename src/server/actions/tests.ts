'use server'

import { z } from 'zod'
import { canStartTest, GEMS, gemRef } from '@/game'
import { dayKey } from '@/progress/day'
import type { Effect } from '@/progress/types'
import { scoreTest } from '@/course'
import { requireUser, userScope } from '../auth'
import { ids, parseInput } from '../auth-guard'
import { getContent } from '../content'
import { limitUser } from '../courses/limits'
import { exerciseUnit } from '../courses/registry'
import { readTestRecord, resolveTestById, saveGrade, sectionUnfinished, startAttempt } from '../courses/tests'
import { attemptSeed, drawTest, fallbackPool, gradeAnswer, testBonus } from '../courses/tests-core'
import { awardGems, grantXp, loadState, settleGame, touchLeague } from '../game'
import { settleMission } from '../services/mission'
import { addDailyXp, evaluateAchievements } from '../services/progress'

// Topic tests (🏁) and section exams (👑). The page draws attempt n with the seed `${userId}:${n}`; startTest records
// the attempt, submitTest re-draws it on the server, re-checks every answer against the content and stores the score.
// The client's own right/wrong flags are never used for the result: quiz questions are graded from the first answer
// answerQuiz checked during the attempt (stored on the result row), so the client never holds the answer key.

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

export async function startTest(raw: { testId: string; attempt: number }): Promise<{ ok: boolean; reason?: 'hearts' }> {
  const user = await requireUser()
  const input = parseInput(startInput, raw)
  await limitUser(user.id, 'test')
  const test = await resolveTestById(input.testId)
  const now = Date.now()
  return userScope(
    async (tx, userId) => {
      // Tests and exams cost no hearts, but starting one needs at least one ❤️ (docs/ARCHITECTURE.md §6).
      if (!canStartTest((await loadState(tx, userId, now)).hearts, now)) return { ok: false, reason: 'hearts' as const }
      return { ok: await startAttempt(tx, userId, test, input.attempt, attemptSeed(userId, input.attempt), now) }
    },
    { tx: true },
  )
}

export interface TestOutcome {
  passed: boolean
  correct: number
  total: number
  needed: number
  score: number
  results: boolean[]
  bonusXp: number
  gems: number
  firstPass: boolean
  testOut: boolean
  effects: Effect[]
}

export async function submitTest(raw: { testId: string; attempt: number; answers: Array<{ id: string; chosen: string[]; text: string | null; rating: 'again' | 'hard' | 'good' | null }> }): Promise<TestOutcome> {
  const user = await requireUser()
  const input = parseInput(submitInput, raw)
  await limitUser(user.id, 'test')
  const test = await resolveTestById(input.testId)
  const snapshot = await getContent()
  const unfinished = await sectionUnfinished(test)
  const now = Date.now()
  const day = dayKey(now)
  const outcome = await userScope(
    async (tx, userId) => {
      const record = await readTestRecord(tx, userId, test)
      const seed = attemptSeed(userId, input.attempt)
      // Only the attempt that was started, once, with the seed it was drawn with.
      if (!record || record.attempts !== input.attempt || record.graded >= input.attempt || record.lastSeed !== seed) throw new Error('Stale attempt')
      const built = drawTest(test, seed)
      if (!built) throw new Error('Unknown test')
      const fallback = fallbackPool(test)
      // Quizzes are graded from the first answer the server checked during the attempt (answerQuiz → record.answers);
      // only self-rated fallback cards come from this request.
      const answerFor = (unit: ReturnType<typeof exerciseUnit>, i: number) => {
        if (unit?.kind !== 'quiz') return input.answers[i]
        const stored = record.answers[String(i)]
        return stored ? { ...stored, rating: null } : undefined
      }
      const scored = scoreTest(built, input.answers, (id, i) => {
        const unit = exerciseUnit(snapshot, test.bundle, id)
        return gradeAnswer(built, unit, answerFor(unit, i), fallback)
      })
      if (!scored.ok) {
        if (process.env.NODE_ENV === 'development') console.warn('[tests] answers do not match the draw', { questions: built.questions, answers: input.answers.map((a) => a.id) })
        throw new Error('Invalid answers')
      }
      const testOut = test.kind === 'section-exam' && scored.passed && unfinished
      await saveGrade(tx, userId, test, input.attempt, scored.score, scored.passed, testOut, now)
      const reason = test.kind === 'topic-test' ? 'topic-test' : 'section-exam'
      const bonusXp = await grantXp(tx, userId, { amount: testBonus(test.kind, { passed: record.passed, bestScore: record.bestScore }, { passed: scored.passed, score: scored.score, testOut }), reason, refId: test.id, now })
      const effects: Effect[] = []
      if (bonusXp > 0) {
        await addDailyXp(tx, userId, day, bonusXp)
        effects.push({ type: 'xp', amount: bonusXp, reason })
      }
      // 💎 for the first pass only (the ledger ref makes it once per test).
      const gems = scored.passed ? await awardGems(tx, userId, { amount: test.kind === 'topic-test' ? GEMS.topicTest : GEMS.sectionExam, reason, refId: gemRef.test(test.id), now }) : 0
      if (gems > 0) effects.push({ type: 'gems', amount: gems, reason })
      effects.push(...(await settleMission(tx, userId, now)))
      effects.push(...(await settleGame(tx, userId, now)))
      effects.push(...(await evaluateAchievements(tx, userId, snapshot, now)))
      return {
        passed: scored.passed,
        correct: scored.correct,
        total: scored.total,
        needed: built.needed,
        score: scored.score,
        results: scored.results,
        bonusXp,
        gems,
        firstPass: scored.passed && !record.passed,
        testOut,
        effects,
      }
    },
    { tx: true },
  )
  // Leagues are joined outside the user's transaction (src/server/game/leagues.ts).
  if (outcome.effects.some((e) => e.type === 'xp')) await touchLeague(user.id, now)
  return outcome
}

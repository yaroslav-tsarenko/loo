'use server'

import type { ReactNode } from 'react'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { gradeQuiz } from '@/content/blocks/quiz/grade'
import { quizKey, type QuizKey } from '@/content/blocks/quiz/view'
import { first } from '@/db/client'
import { sessions } from '@/db/schema'
import type { Effect } from '@/progress/types'
import { renderMdast } from '@/ui/markdown/render'
import { requireUser, userScope } from '../auth'
import { ids, parseInput } from '../auth-guard'
import { getContent } from '../content'
import { limitUser } from '../courses/limits'
import { resolveTestById, storeTestAnswer } from '../courses/tests'
import { loadState, spendHeart, touchLeague } from '../game'
import { recordAttempt } from '../services/progress'
import { readSettings } from '../settings'

// One server-side check per answered quiz, in every context (docs/SECURITY.md, Phase 4 anti-cheat):
// the client sends what the learner picked/typed, the server grades it against the content (grade.ts), records the
// attempt (XP, SRS, mistakes) from its own verdict, charges a ❤️ for a wrong answer in a lesson (same transaction),
// and only then reveals the key and the explanation. Graded quizzes never ship `correct` flags to the browser.

const answerInput = z.object({
  unitId: ids.unit,
  chosen: z.array(z.string().max(2000)).max(64),
  text: z.string().max(2000).nullable(),
  durationMs: ids.durationMs,
  sessionId: ids.session.nullable(),
  // a topic test / section exam question: attempt n, position in the draw
  test: z.object({ testId: z.string().min(3).max(300), attempt: z.number().int().min(1).max(100_000), index: z.number().int().min(0).max(200) }).nullable().optional(),
})

export interface AnswerRequest {
  unitId: string
  chosen: string[]
  text: string | null
  durationMs: number
  sessionId: string | null
  test?: { testId: string; attempt: number; index: number } | null
}

export interface AnswerOutcome {
  // null: not graded (out of hearts)
  correct: boolean | null
  key: QuizKey | null
  explanation: ReactNode
  effects: Effect[]
  // hearts after this answer when it was part of a lesson
  hearts: { hearts: number; nextAt: number | null } | null
  outOfHearts: boolean
}

export async function answerQuiz(raw: AnswerRequest): Promise<AnswerOutcome> {
  const user = await requireUser()
  const input = parseInput(answerInput, raw)
  await limitUser(user.id, 'answer')
  const snapshot = await getContent()
  const unit = snapshot.units.get(input.unitId)
  if (!unit || unit.kind !== 'quiz') throw new Error('Unknown quiz')
  const test = input.test ? await resolveTestById(input.test.testId) : null
  const correct = gradeQuiz(unit, { chosen: input.chosen, text: input.text })
  const now = Date.now()
  // Read before the transaction: it uses its own connection (see recordAttempt).
  const settings = await readSettings()

  const result = await userScope(
    async (tx, userId) => {
      // A lesson session (mode 'lesson', still open) is where hearts apply.
      const session = input.sessionId
        ? await first(
            tx
              .select({ mode: sessions.mode, endedAt: sessions.endedAt })
              .from(sessions)
              .where(and(eq(sessions.userId, userId), eq(sessions.id, input.sessionId))),
          )
        : undefined
      if (input.sessionId && !session) throw new Error('Unknown session')
      const lesson = session?.mode === 'lesson' && session.endedAt === null
      if (lesson && (await loadState(tx, userId, now, { lock: true })).hearts.hearts <= 0) return { outOfHearts: true as const }
      if (test && input.test) {
        const ok = await storeTestAnswer(tx, userId, test, input.test.attempt, input.test.index, { id: unit.id, chosen: input.chosen, text: input.text }, now)
        if (!ok) throw new Error('Stale attempt')
      }
      const effects = await recordAttempt(snapshot, unit, { unitId: unit.id, outcome: correct ? 'correct' : 'wrong', durationMs: input.durationMs, sessionId: input.sessionId }, now, settings)
      let hearts: AnswerOutcome['hearts'] = null
      if (lesson) {
        const view = correct ? (await loadState(tx, userId, now)).hearts : await spendHeart(tx, userId, now)
        hearts = { hearts: view.hearts, nextAt: view.nextAt }
        if (!correct) effects.push({ type: 'hearts', hearts: view.hearts, delta: -1 })
      }
      return { outOfHearts: false as const, effects, hearts }
    },
    { tx: true },
  )

  if (result.outOfHearts) return { correct: null, key: null, explanation: null, effects: [], hearts: { hearts: 0, nextAt: null }, outOfHearts: true }
  if (result.effects.some((e) => e.type === 'xp')) await touchLeague(user.id, now)
  const chapter = snapshot.chapters.get(unit.chapterId)
  const explanation = unit.explanation && chapter ? await renderMdast(unit.explanation, { snapshot, chapter, depth: 0, variant: 'card' }) : null
  return { correct, key: quizKey(unit), explanation, effects: result.effects, hearts: result.hearts, outOfHearts: false }
}

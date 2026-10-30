'use server'

import type { ReactNode } from 'react'
import { after } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { judgeSpeech, speechHints, type DisplayWord } from '@/content/blocks/lang/grade'
import { gradeQuiz } from '@/content/blocks/quiz/grade'
import type { QuizUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { quizKey, type QuizKey } from '@/content/blocks/quiz/view'
import { sessions } from '@/db/schema'
import type { Effect } from '@/progress/types'
import { renderMdast } from '@/ui/markdown/render'
import { requireUser, userScope } from '../auth'
import { ids, parseInput } from '../auth-guard'
import { getContent } from '../content'
import { limitUser } from '../courses/limits'
import { speechLangFor } from '../courses/target'
import { resolveTestById, storeTestAnswer } from '../courses/tests'
import { read, readAll } from '../db/batch'
import { loadState, spendHeartFrom, touchLeague, type GameState } from '../game'
import { stateRead } from '../game/state'
import { attemptReadList, attemptReadsFrom, recordAttempt, recordAttemptIn, type AttemptReads } from '../services/progress'
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

// A [!speak] attempt's word-by-word verdict (src/content/blocks/lang/grade.ts).
export interface SpeechResult {
  // 0..1, share of the phrase's words recognised
  score: number
  words: DisplayWord[]
  extra: string[]
  // the recogniser alternative that matched best
  transcript: string
  hints: string[]
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
  speech?: SpeechResult
}

export async function answerQuiz(raw: AnswerRequest): Promise<AnswerOutcome> {
  const user = await requireUser()
  const input = parseInput(answerInput, raw)
  await limitUser(user.id, 'answer')
  const snapshot = await getContent()
  const unit = snapshot.units.get(input.unitId)
  if (!unit || unit.kind !== 'quiz') throw new Error('Unknown quiz')
  if (unit.mode === 'speak') {
    if (input.test) throw new Error('Speaking is not part of tests')
    await limitUser(user.id, 'speak')
    await limitUser(user.id, 'speakDay')
    return speakOutcome(snapshot, unit, input.chosen, input.durationMs, input.sessionId)
  }
  const test = input.test ? await resolveTestById(input.test.testId) : null
  // dictation compares words of the course's spoken language (German: ß = ss, ä = ae …)
  const correct = gradeQuiz(unit, { chosen: input.chosen, text: input.text }, unit.mode === 'listen' ? await speechLangFor(unit) : null)
  const now = Date.now()

  // One transaction, few round trips: the session / hearts checks and every read the recording needs go out together
  // (the learner's settings are read here too, not in a separate transaction), then all writes at once, then the
  // settlement (src/server/services/progress.ts).
  const result = await userScope(
    async (tx, userId) => {
      // ONE statement: the session, the hearts row (locked) and everything the recording reads (src/server/db/batch.ts)
      const attemptList = attemptReadList(tx, userId, unit, now)
      let session: { mode: string; endedAt: number | null } | undefined
      let locked: GameState | undefined
      let reads: AttemptReads
      if (input.sessionId) {
        const sessionId = input.sessionId
        const [found, lockedRow, ...values] = await readAll(tx, [
          read(
            tx
              .select({ mode: sessions.mode, endedAt: sessions.endedAt })
              .from(sessions)
              .where(and(eq(sessions.userId, userId), eq(sessions.id, sessionId))),
            (rows) => rows[0],
          ),
          // hearts under the row lock (only answers inside a session can be in a lesson)
          stateRead(tx, userId, now, { lock: true }),
          ...attemptList,
        ])
        session = found
        locked = lockedRow ?? (await loadState(tx, userId, now, { lock: true }))
        reads = attemptReadsFrom(values)
      } else {
        reads = attemptReadsFrom(await readAll(tx, attemptList))
      }
      if (input.sessionId && !session) throw new Error('Unknown session')
      const lesson = session?.mode === 'lesson' && session.endedAt === null
      if (lesson && locked && locked.hearts.hearts <= 0) return { outOfHearts: true as const }
      if (test && input.test) {
        const ok = await storeTestAnswer(tx, userId, test, input.test.attempt, input.test.index, { id: unit.id, chosen: input.chosen, text: input.text }, now)
        if (!ok) throw new Error('Stale attempt')
      }
      const effects = await recordAttemptIn(tx, userId, snapshot, unit, { unitId: unit.id, outcome: correct ? 'correct' : 'wrong', durationMs: input.durationMs, sessionId: input.sessionId }, now, reads)
      let hearts: AnswerOutcome['hearts'] = null
      if (lesson && locked) {
        // recording never touches hearts: the locked row is still current
        const view = correct ? locked.hearts : await spendHeartFrom(tx, userId, locked, now)
        hearts = { hearts: view.hearts, nextAt: view.nextAt }
        if (!correct) effects.push({ type: 'hearts', hearts: view.hearts, delta: -1 })
      }
      return { outOfHearts: false as const, effects, hearts }
    },
    { tx: true },
  )

  if (result.outOfHearts) return { correct: null, key: null, explanation: null, effects: [], hearts: { hearts: 0, nextAt: null }, outOfHearts: true }
  // League placement reads other learners' rows on its own connection: after the response (it shows on /leagues).
  if (result.effects.some((e) => e.type === 'xp')) after(() => touchLeague(user.id, now))
  const chapter = snapshot.chapters.get(unit.chapterId)
  const explanation = unit.explanation && chapter ? await renderMdast(unit.explanation, { snapshot, chapter, depth: 0, variant: 'card' }) : null
  return { correct, key: quizKey(unit), explanation, effects: result.effects, hearts: result.hearts, outOfHearts: false }
}

const MAX_TRANSCRIPT = 500
const MAX_ALTERNATIVES = 5

// [!speak] (docs/SPEECH.md): the browser recognised the learner's speech and sends only the transcript alternatives
// (`chosen`, best first) — no audio is uploaded or stored. They are untrusted input: capped here, compared with the
// content's own `text` word by word. Only a pass is recorded (XP, streak, session); a miss is often the recogniser,
// so it costs nothing — no heart, no «Мої помилки» entry.
async function speakOutcome(snapshot: ContentSnapshot, unit: QuizUnit, chosen: readonly string[], durationMs: number, sessionId: string | null): Promise<AnswerOutcome> {
  const spec = unit.speak
  if (!spec) throw new Error('Unknown speaking item')
  const transcripts = chosen
    .slice(0, MAX_ALTERNATIVES)
    .map((t) => t.slice(0, MAX_TRANSCRIPT).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  const lang = await speechLangFor(unit)
  const verdict = judgeSpeech(spec.text, transcripts, lang)
  const settings = await readSettings()
  const now = Date.now()
  const effects = verdict.passed ? await recordAttempt(snapshot, unit, { unitId: unit.id, outcome: 'correct', durationMs, sessionId }, now, settings) : []
  if (effects.some((e) => e.type === 'xp')) {
    const user = await requireUser()
    after(() => touchLeague(user.id, now))
  }
  const chapter = snapshot.chapters.get(unit.chapterId)
  const explanation = unit.explanation && chapter && !verdict.passed ? await renderMdast(unit.explanation, { snapshot, chapter, depth: 0, variant: 'card' }) : null
  const hints = verdict.passed ? [] : speechHints(verdict, { ...spec, tip: null }, settings.accent === 'en-US' ? 'us' : 'uk', 3, lang)
  return {
    correct: verdict.passed,
    key: null,
    explanation,
    effects,
    hearts: null,
    outOfHearts: false,
    speech: { score: verdict.score, words: verdict.words, extra: verdict.extra, transcript: verdict.transcript, hints },
  }
}

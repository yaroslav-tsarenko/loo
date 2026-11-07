import { createHmac } from 'node:crypto'
import { usesOptionIds } from '@/content/blocks/quiz/grade'
import { quizKey, type QuizKey } from '@/content/blocks/quiz/view'
import type { QuizUnit } from '@/content/model'

// Opaque option ids for graded quizzes (anti-cheat, docs/SECURITY.md).
//
// Authored option ids are positions (a, b, c…) in the author's order, and the right answer is the second option in
// about half of all quizzes — a client that always sends "b" would pass half the tests. So the browser never sees
// them: every option gets `o` + HMAC(secret, unit id, option id), stable across renders (stored test answers, the
// placement replay and a re-rendered page keep working) but not derivable without the server's secret. The server
// resolves them back to authored ids before grading (gradeQuiz stays on authored ids) and maps the revealed key the
// other way. Raw authored ids sent by a client are dropped — they never match.

const LABEL = 'levelup.quiz-option.v1'
const DEV_SECRET = 'levelup-dev-quiz-option-secret'

// QUIZ_OPTION_SECRET when set; otherwise another server-only secret every deployment already has (CRON_SECRET,
// DATABASE_URL), domain-separated by the HMAC label. Rotating it reshuffles ids: test answers are resolved when they
// arrive, so they survive it; a placement test in progress (its answers are replayed each step) has to restart.
export function optionSecret(env: Record<string, string | undefined> = process.env): string {
  const secret = env.QUIZ_OPTION_SECRET || env.CRON_SECRET || env.DATABASE_URL
  if (secret) return secret
  if (env.NODE_ENV === 'production') throw new Error('quiz-ids: set QUIZ_OPTION_SECRET (or CRON_SECRET)')
  return DEV_SECRET
}

export interface OptionIds {
  token(unitId: string, optionId: string): string
  // the browser's ids → authored ids, in the learner's order; anything unknown is dropped
  resolve(unit: QuizUnit, chosen: readonly string[]): string[]
  // quizKey with option ids as the browser knows them
  key(unit: QuizUnit): QuizKey
  // the browser's id of each authored option id
  idOf(unit: QuizUnit): (optionId: string) => string
}

export function createOptionIds(secret: () => string): OptionIds {
  const cache = new Map<string, string>()
  function token(unitId: string, optionId: string): string {
    const k = `${unitId}\u0000${optionId}`
    let t = cache.get(k)
    if (!t) {
      t = 'o' + createHmac('sha256', secret()).update(LABEL).update('\u0000').update(k).digest('base64url').slice(0, 12)
      if (cache.size > 50_000) cache.clear()
      cache.set(k, t)
    }
    return t
  }
  return {
    token,
    resolve(unit, chosen) {
      if (!usesOptionIds(unit)) return [...chosen]
      const byToken = new Map(unit.options.map((o) => [token(unit.id, o.id), o.id]))
      return chosen.flatMap((c) => {
        const id = byToken.get(c)
        return id === undefined ? [] : [id]
      })
    },
    key(unit) {
      const key = quizKey(unit)
      return { ...key, options: key.options.map((id) => token(unit.id, id)) }
    },
    idOf: (unit) => (optionId) => token(unit.id, optionId),
  }
}

export const optionIds: OptionIds = createOptionIds(() => optionSecret())

import { sql } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { startTestDb, type TestDb } from './harness'

// The money paths through the real server actions, on a Supabase-like database (./harness.ts): every statement runs
// as the learner role under RLS, exactly as in production. Only the session, Next's request APIs and the cache
// revalidation are stubbed.
//
// «At once» here means the requests are issued together; PGlite has one session, so they reach the database one after
// another. What this pins down is that every reward is claimed exactly once (the guards in the statements). True
// concurrency is serialized by the per-learner advisory lock (src/server/db/scope-core.ts, tests/unit/auth.test.ts).

const session = vi.hoisted(() => ({ user: null as null | { id: string; email: string; name: string; avatarUrl: null; aal: 'aal1'; authTime: number } }))

vi.mock('server-only', () => ({}))
vi.mock('next/cache', () => ({ revalidatePath: () => {}, revalidateTag: () => {}, updateTag: () => {}, unstable_cache: <T,>(fn: T) => fn }))
vi.mock('next/server', async (orig) => ({ ...(await orig<object>()), connection: async () => {}, after: (fn: () => unknown) => void Promise.resolve().then(fn).catch(() => {}) }))
vi.mock('next/headers', () => ({ headers: async () => new Headers(), cookies: async () => ({ get: () => undefined, getAll: () => [], set: () => {} }) }))
vi.mock('@/server/auth/session', async (orig) => ({ ...(await orig<object>()), getUser: async () => session.user }))

const A = '11111111-1111-4111-8111-111111111111'
let db: TestDb

beforeAll(async () => {
  db = await startTestDb(54390)
  Object.assign(process.env, { DATABASE_URL: db.url, DATABASE_POOL_MAX: '1', DATABASE_PIPELINE: '0', VAULT_PATH: 'content', CONTENT_WATCH: '0' })
  await db.addUser(A)
  session.user = { id: A, email: 'a@test', name: 'A', avatarUrl: null, aal: 'aal1', authTime: Date.now() }
}, 120_000)

afterAll(async () => {
  await db?.close()
})

const B = '22222222-2222-4222-8222-222222222222'
const LESSON = 'javascript-noob-to-god:start:jss-ch-01:start-1'

// A right answer for any graded quiz, as the browser would send it (opaque option ids, src/server/quiz-ids.ts).
async function rightAnswer(unitId: string): Promise<{ chosen: string[]; text: string | null }> {
  const { getContent } = await import('@/server/content')
  const { optionIds } = await import('@/server/quiz-ids')
  const { quizKey } = await import('@/content/blocks/quiz/view')
  const unit = (await getContent()).units.get(unitId)
  if (!unit || unit.kind !== 'quiz') throw new Error(`not a quiz: ${unitId}`)
  const key = quizKey(unit)
  if (key.order) return { chosen: key.order, text: null }
  if (key.blanks) return { chosen: key.blanks.map((b) => b[0]!), text: null }
  if (key.free !== null) return { chosen: [], text: key.free }
  return { chosen: optionIds.key(unit).options, text: null }
}

// Checks and seeds go through the app's own connection (pool of 1, owner role — no RLS): PGlite has ONE session, so a
// query sent around the app could land inside the app's open (or just aborted) transaction.
async function rows<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const { getDb } = await import('@/db/client')
  const { $client } = getDb() as unknown as { $client: { unsafe: (q: string, p: unknown[]) => Promise<T[]> } }
  return [...(await $client.unsafe(text, params))]
}
const as = (id: string) => {
  session.user = { id, email: `${id.slice(0, 4)}@test`, name: id.slice(0, 4), avatarUrl: null, aal: 'aal1', authTime: Date.now() }
}

describe('economy (integration)', () => {
  it('a lesson pays once, however many times it is completed — even at once', async () => {
    as(A)
    const { startLesson, completeLesson } = await import('@/server/actions/lessons')
    const { answerQuiz } = await import('@/server/actions/answers')
    const sessionId = await startLesson(LESSON)
    expect(sessionId).toBeTruthy()
    const [s] = await rows<{ unit_ids: string[] }>('select unit_ids from sessions where id = $1', [sessionId])
    const { getContent } = await import('@/server/content')
    const snapshot = await getContent()
    const quizzes = (s?.unit_ids ?? []).filter((u) => snapshot.units.get(u)?.kind === 'quiz')
    expect(quizzes.length).toBeGreaterThan(0)
    for (const unitId of quizzes) {
      const out = await answerQuiz({ unitId, ...(await rightAnswer(unitId)), durationMs: 3000, sessionId })
      expect(out.correct, unitId).toBe(true)
    }

    const outcomes = await Promise.all([1, 2, 3, 4].map(() => completeLesson({ lessonId: LESSON, sessionId })))
    const paid = outcomes.filter((o) => !o.incomplete)
    expect(paid).toHaveLength(1)
    expect(paid[0]!.bucks).toBeGreaterThan(0)
    // and once more, later
    expect((await completeLesson({ lessonId: LESSON, sessionId })).incomplete).toBe(true)

    const bucks = await rows<{ n: number }>(`select count(*)::int as n from buck_ledger where user_id = $1 and ref_id = $2`, [A, `lesson:${sessionId}`])
    expect(bucks[0]?.n).toBe(1)
    const bonus = await rows<{ n: number }>(`select count(*)::int as n from xp_ledger where user_id = $1 and reason = 'lesson' and ref_id = $2`, [A, LESSON])
    expect(bonus[0]?.n).toBe(1)
  }, 120_000)

  it('an answer pays XP once, even sent many times at once', async () => {
    as(A)
    const { answerQuiz } = await import('@/server/actions/answers')
    const unitId = 'jss-01-quiz-02'
    const answer = await rightAnswer(unitId)
    const outs = await Promise.all([1, 2, 3, 4, 5, 6].map(() => answerQuiz({ unitId, ...answer, durationMs: 3000, sessionId: null })))
    expect(outs.every((o) => o.correct)).toBe(true)
    expect(outs.filter((o) => o.effects.some((e) => e.type === 'xp'))).toHaveLength(1)
    // a raw authored id ('a', 'b' …) is never accepted
    const raw = await answerQuiz({ unitId: 'jss-01-quiz-03', chosen: ['a', 'b', 'c'], text: null, durationMs: 3000, sessionId: null })
    expect(raw.correct).toBe(false)
  }, 60_000)

  it('two purchases racing for one balance: one succeeds, the balance never goes negative', async () => {
    as(B)
    await rows(`insert into auth.users (id) values ($1) on conflict do nothing`, [B])
    const { buyItem } = await import('@/server/actions/shop')
    // first touch creates the learner's rows; then 300 bucks — enough for one streak freeze (200), not two
    await buyItem({ itemId: 'streak-freeze' })
    await rows(`insert into buck_ledger (user_id, amount, reason, ref_id, created_at, day) values ($1, 300, 'test', 'seed', 0, '2026-01-01')`, [B])
    const outs = await Promise.all([buyItem({ itemId: 'streak-freeze' }), buyItem({ itemId: 'streak-freeze' })])
    expect(outs.filter((o) => o.ok)).toHaveLength(1)
    expect(outs.find((o) => !o.ok)).toMatchObject({ ok: false, reason: 'no-bucks' })
    const [balance] = await rows<{ b: number }>(`select coalesce(sum(amount), 0)::int as b from buck_ledger where user_id = $1`, [B])
    expect(balance?.b).toBe(100)
  }, 60_000)

  it("a learner's scope never reads another learner's rows (RLS under the app role)", async () => {
    const { userScope } = await import('@/server/auth')
    as(B)
    const seen = await userScope(async (tx) => (await tx.execute(sql`select distinct user_id from xp_ledger`)) as unknown as Array<{ user_id: string }>)
    const ids = [...seen].map((r) => r.user_id)
    expect(ids).not.toContain(A)
    // writing a row for someone else is refused by the policy
    const refused = await userScope(async (tx) => tx.execute(sql`insert into xp_ledger (user_id, amount, reason, ref_id, created_at, day) values (${A}, 1000, 'quiz', 'x', 0, '2026-01-01')`)).then(
      () => null,
      (e: Error & { cause?: Error }) => e.cause?.message ?? e.message,
    )
    expect(refused).toMatch(/row-level security/)
    const [a] = await rows<{ n: number }>(`select count(*)::int as n from xp_ledger where user_id = $1 and ref_id = 'x'`, [A])
    expect(a?.n).toBe(0)
  }, 60_000)

  it('the running totals (user_counters, kept by triggers) equal the ledgers — after answers, lessons, a reset', async () => {
    const check = async () => {
      const diff = await rows<{ user_id: string }>(`
        select p.id as user_id from profiles p left join user_counters c on c.user_id = p.id
        where coalesce(c.xp, 0) <> coalesce((select sum(amount) from xp_ledger x where x.user_id = p.id), 0)
           or coalesce(c.cards, 0) <> (select count(*) from attempts a where a.user_id = p.id and a.kind = 'flashcard')
           or coalesce(c.cards_known, 0) <> (select count(*) from attempts a where a.user_id = p.id and a.kind = 'flashcard' and a.outcome = 'good')
           or coalesce(c.quizzes, 0) <> (select count(*) from attempts a where a.user_id = p.id and a.kind = 'quiz')
           or coalesce(c.quizzes_correct, 0) <> (select count(*) from attempts a where a.user_id = p.id and a.kind = 'quiz' and a.outcome = 'correct')`)
      expect(diff).toEqual([])
    }
    await check()
    const [a] = await rows<{ xp: number; quizzes: number }>(`select xp::int, quizzes from user_counters where user_id = $1`, [A])
    expect(a?.xp).toBeGreaterThan(0)
    expect(a?.quizzes).toBeGreaterThan(0)
    // resetProgress deletes attempts and xp: the totals follow
    as(A)
    const { resetProgress } = await import('@/server/actions/settings')
    expect(await resetProgress('СКИНУТИ')).toEqual({ ok: true })
    const [gone] = await rows<{ n: number }>(`select count(*)::int as n from attempts where user_id = $1`, [A])
    expect(gone?.n).toBe(0)
    await check()
    // the learner can read the row, never write it
    as(B)
    const { userScope } = await import('@/server/auth')
    const forged = await userScope(async (tx) => tx.execute(sql`update user_counters set xp = 1000000`)).then(
      () => null,
      (e: Error & { cause?: Error }) => e.cause?.message ?? e.message,
    )
    expect(forged).toMatch(/permission denied/)
    // deleting an account cascades through attempts / xp_ledger; their delete triggers must not bring the row back
    await rows(`insert into attempts (user_id, unit_id, kind, outcome, correct, answered_at, day) select $1, 'jss-01-quiz-02', 'quiz', 'correct', true, 0, '2026-01-01'`, [B]).catch(() => null)
    await rows(`delete from profiles where id = $1`, [B])
    const [left] = await rows<{ n: number }>(`select count(*)::int as n from user_counters where user_id = $1`, [B])
    expect(left?.n).toBe(0)
  }, 60_000)
})

import 'server-only'
import { and, eq, isNotNull, sql } from 'drizzle-orm'
import { first, type Conn } from '@/db/client'
import { enrollments, examResults, lessonProgress, topicResults, xpLedger } from '@/db/schema'
import { gemRef, rankOf, rankProgress, stepsBetween, type RankInput, type RankProgress } from '@/game'
import type { Effect } from '@/progress/types'
import { getCourse } from '../courses/registry'
import { awardGems } from './ledger'
import { loadState, saveState } from './state'

// A course counts as finished when every section exam 👑 of it is passed.
async function coursesFinished(conn: Conn, userId: string): Promise<number> {
  const [enrolled, passed] = await Promise.all([
    conn.select({ id: enrollments.courseId }).from(enrollments).where(eq(enrollments.userId, userId)),
    conn
      .select({ id: examResults.examId })
      .from(examResults)
      .where(and(eq(examResults.userId, userId), isNotNull(examResults.passedAt))),
  ])
  const done = new Set(passed.map((r) => r.id))
  let n = 0
  for (const { id } of enrolled) {
    const bundle = await getCourse(id)
    if (!bundle) continue
    const exams = bundle.sections.flatMap((s) => (s.exam ? [s.exam.id] : []))
    if (exams.length > 0 && exams.every((e) => done.has(e))) n++
  }
  return n
}

export async function rankInput(conn: Conn, userId: string): Promise<RankInput> {
  const count = async (q: Promise<Array<{ n: number }>>) => Number((await first(q))?.n ?? 0)
  const xp = await count(conn.select({ n: sql<number>`coalesce(sum(${xpLedger.amount}), 0)` }).from(xpLedger).where(eq(xpLedger.userId, userId)))
  const lessons = await count(
    conn
      .select({ n: sql<number>`count(*)` })
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), sql`${lessonProgress.completions} > 0`)),
  )
  const tests = await count(
    conn
      .select({ n: sql<number>`count(*)` })
      .from(topicResults)
      .where(and(eq(topicResults.userId, userId), isNotNull(topicResults.passedAt))),
  )
  const exams = await count(
    conn
      .select({ n: sql<number>`count(*)` })
      .from(examResults)
      .where(and(eq(examResults.userId, userId), isNotNull(examResults.passedAt))),
  )
  return { xp, lessons, tests, exams, courses: await coursesFinished(conn, userId) }
}

// Progress on «шлях воїна»; the stored step is a floor (ranks never go down).
export async function rankOfUser(conn: Conn, userId: string, now = Date.now()): Promise<RankProgress> {
  const [input, state] = [await rankInput(conn, userId), await loadState(conn, userId, now)]
  return rankProgress(input, state.evoStep)
}

// A new step of «шлях воїна»: stored (evo_step), pays its gems once per step, and yields an «evolution» effect
// (toast now; the full-screen moment plays on the next page load until acknowledged — evo_seen). Never goes down.
export async function settleRank(conn: Conn, userId: string, now: number): Promise<Effect[]> {
  const state = await loadState(conn, userId, now)
  const rank = rankOf(await rankInput(conn, userId))
  if (rank.index <= state.evoStep) return []
  await saveState(conn, userId, { evoStep: rank.index }, now)
  let gems = 0
  for (const step of stepsBetween(state.evoStep, rank.index)) gems += await awardGems(conn, userId, { amount: step.gems, reason: 'evolution', refId: gemRef.rank(step.index), now })
  const effects: Effect[] = [{ type: 'evolution', from: state.evoStep, step: rank.index, title: rank.title, rank: rank.rank, tier: rank.tier, gems }]
  if (gems > 0) effects.push({ type: 'gems', amount: gems, reason: 'evolution' })
  return effects
}

// The rank-up moment was shown: don't play it again.
export async function ackEvolution(conn: Conn, userId: string, step: number, now: number): Promise<void> {
  const state = await loadState(conn, userId, now)
  const seen = Math.min(state.evoStep, Math.max(state.evoSeen, step))
  if (seen !== state.evoSeen) await saveState(conn, userId, { evoSeen: seen }, now)
}

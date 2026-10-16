import 'server-only'
import { sql } from 'drizzle-orm'
import type { Conn } from '@/db/client'
import { read, readOne, type Read } from '../db/batch'
import { enrollments, examResults, lessonProgress, topicResults, xpLedger } from '@/db/schema'
import { gemRef, rankOf, rankProgress, stepsBetween, type RankInput, type RankProgress } from '@/game'
import type { Effect } from '@/progress/types'
import { getCourse } from '../courses/registry'
import { awardGems } from './ledger'
import { loadState, saveState, type GameState } from './state'

// A course counts as finished when every section exam 👑 of it is passed.
async function coursesFinished(enrolled: readonly string[], passed: ReadonlySet<string>): Promise<number> {
  let n = 0
  for (const id of enrolled) {
    const bundle = await getCourse(id)
    if (!bundle) continue
    const exams = bundle.sections.flatMap((s) => (s.exam ? [s.exam.id] : []))
    if (exams.length > 0 && exams.every((e) => passed.has(e))) n++
  }
  return n
}

// Everything the rank ladder counts, in one statement (was six round trips).
export async function rankInput(conn: Conn, userId: string): Promise<RankInput> {
  return rankInputFrom(await readOne(conn, rankRead(conn, userId)))
}

export interface RankParts {
  xp: number
  lessons: number
  tests: number
  exams: string[]
  enrolled: string[]
}

export function rankRead(conn: Conn, userId: string): Read<RankParts> {
  return read(
    conn
      .select({
        xp: sql<string>`(select coalesce(sum(x.amount), 0) from ${xpLedger} x where x.user_id = ${userId})`,
        lessons: sql<string>`(select count(*) from ${lessonProgress} l where l.user_id = ${userId} and l.completions > 0)`,
        tests: sql<string>`(select count(*) from ${topicResults} t where t.user_id = ${userId} and t.passed_at is not null)`,
        exams: sql<string[] | null>`(select array_agg(e.exam_id) from ${examResults} e where e.user_id = ${userId} and e.passed_at is not null)`,
        enrolled: sql<string[] | null>`(select array_agg(c.course_id) from ${enrollments} c where c.user_id = ${userId})`,
      })
      .from(sql`(select 1) as one`),
    (rows) => {
      const row = rows[0]
      return { xp: Number(row?.xp ?? 0), lessons: Number(row?.lessons ?? 0), tests: Number(row?.tests ?? 0), exams: row?.exams ?? [], enrolled: row?.enrolled ?? [] }
    },
  )
}

export async function rankInputFrom(parts: RankParts): Promise<RankInput> {
  const passed = new Set(parts.exams)
  return { xp: parts.xp, lessons: parts.lessons, tests: parts.tests, exams: passed.size, courses: await coursesFinished(parts.enrolled, passed) }
}

// Progress on «шлях воїна»; the stored step is a floor (ranks never go down).
export async function rankOfUser(conn: Conn, userId: string, now = Date.now()): Promise<RankProgress> {
  const [input, state] = await Promise.all([rankInput(conn, userId), loadState(conn, userId, now)])
  return rankProgress(input, state.evoStep)
}

// A new step of «шлях воїна»: stored (evo_step), pays its gems once per step, and yields an «evolution» effect
// (toast now; the full-screen moment plays on the next page load until acknowledged — evo_seen). Never goes down.
// `pre`: the state / rank input already read in this transaction.
export async function settleRank(conn: Conn, userId: string, now: number, pre?: { state?: GameState; input?: RankInput }): Promise<Effect[]> {
  const [state, input] = await Promise.all([pre?.state ?? loadState(conn, userId, now), pre?.input ?? rankInput(conn, userId)])
  const rank = rankOf(input)
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

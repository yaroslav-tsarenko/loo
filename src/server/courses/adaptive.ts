import 'server-only'
import { bandRange, orderNewWords, rankMistakes, selectPractice, type CourseBundle, type ExerciseRef, type PracticeCandidate, type PracticePick, type PracticeSignals } from '@/course'
import { userScope } from '../auth'
import { readAll } from '../db/batch'
import { lastOutcomesRead } from '../services/queue'
import { activeCourse } from './enrollment'
import { signalReads } from './signals'
import { activeSkills, type LearnerSkills } from './skills'

// Server glue of adaptive practice (src/course/select/adaptive.ts): the learner's signals in ONE statement and the
// selection for the language practice sections, «Мої помилки» and the feed. Programming courses keep their old queues.

// last verdicts of `ids` + the three reads above, one statement
export async function learnerSignals(bundle: CourseBundle, ids: readonly string[], now: number): Promise<PracticeSignals> {
  return userScope(async (db, userId) => {
    const [open, recentWrong, topicScores] = signalReads(db, userId, bundle.course.id, now)
    const [last, mistakesMap, wrongMap, scores] = await readAll(db, [lastOutcomesRead(db, userId, ids), open, recentWrong, topicScores])
    return { last, mistakes: mistakesMap, recentWrong: wrongMap, topicScores: scores }
  })
}

export interface AdaptiveContext {
  bundle: CourseBundle
  skills: LearnerSkills
}

// The active language course and the learner's per-skill levels; null → the classic queues.
export async function adaptiveContext(): Promise<AdaptiveContext | null> {
  const skills = await activeSkills()
  if (!skills) return null
  const active = await activeCourse()
  return active ? { bundle: active.bundle, skills } : null
}

// Exercise refs of the ids, or null when any of them is outside the course (a guide of another course was picked).
export function refsOf(bundle: CourseBundle, ids: readonly string[]): ExerciseRef[] | null {
  const out: ExerciseRef[] = []
  for (const id of ids) {
    const ref = bundle.exercises[id]
    if (!ref) return null
    out.push(ref)
  }
  return out
}

export interface AdaptiveQueue extends PracticePick {
  total: number
  unseen: number
  wrong: number
  // «A1–B1» for the session card
  range: { from: string; to: string } | null
}

// «Граматика», «Аудіювання», «Вимова»: a session of `size` from the candidates (already filtered by the section).
// `explicit`: the learner filtered by topic or level — no band then, only the weighting.
export async function adaptiveQueue(ctx: AdaptiveContext, candidateIds: readonly string[], size: number, seed: number, explicit: boolean, now: number): Promise<AdaptiveQueue | null> {
  const refs = refsOf(ctx.bundle, candidateIds)
  if (!refs) return null
  const signals = await learnerSignals(ctx.bundle, candidateIds, now)
  const pick = selectPractice({ candidates: refs, learner: ctx.skills.learner, size, seed, signals, band: explicit ? null : undefined })
  const skill = refs[0]?.skill
  const theta = skill ? (ctx.skills.learner.skills[skill] ?? ctx.skills.learner.overall) : ctx.skills.learner.overall
  return {
    ...pick,
    total: refs.length,
    unseen: refs.filter((r) => !signals.last?.has(r.id)).length,
    wrong: refs.filter((r) => signals.last?.get(r.id) === false).length,
    range: pick.band === null ? null : bandRange(theta, pick.band, ctx.skills.levels),
  }
}

// «Слова»: new words of the learner's vocabulary level first, then ±1 (FSRS reviews untouched).
export function newWordOrder(ctx: AdaptiveContext): <T extends { id: string }>(units: readonly T[]) => T[] {
  const theta = ctx.skills.learner.skills.vocabulary ?? ctx.skills.learner.overall
  return (units) => {
    const refs = units.flatMap((u) => ctx.bundle.exercises[u.id] ?? [])
    const byId = new Map(units.map((u) => [u.id, u]))
    const ordered = orderNewWords(refs, theta).map((r) => byId.get(r.id)!)
    // units outside the course (another guide was picked) keep their order, after the course's words
    const inCourse = new Set(refs.map((r) => r.id))
    return [...ordered, ...units.filter((u) => !inCourse.has(u.id))]
  }
}

// The feed: a weighted pick of `size` quizzes of the course first, the classic order after them.
export async function feedQuizOrder<T extends { id: string }>(ctx: AdaptiveContext, quizzes: readonly T[], classic: readonly T[], size: number, seed: number, now: number): Promise<T[]> {
  const refs = quizzes.flatMap((u) => ctx.bundle.exercises[u.id] ?? [])
  if (refs.length === 0) return [...classic]
  const signals = await learnerSignals(ctx.bundle, refs.map((r) => r.id), now)
  const picked = selectPractice({ candidates: refs, learner: ctx.skills.learner, size, seed, signals }).ids
  const byId = new Map(quizzes.map((u) => [u.id, u]))
  const first = new Set(picked)
  return [...picked.map((id) => byId.get(id)!), ...classic.filter((u) => !first.has(u.id))]
}

// «Мої помилки»: eligible mistakes ordered by level band and topic trouble (all stay in the list).
export function orderMistakes(ctx: AdaptiveContext, rows: ReadonlyArray<{ id: string; wrongCount: number; lastWrongAt: number }>, signals: PracticeSignals): string[] | null {
  const candidates: Array<PracticeCandidate & { wrongCount: number; lastWrongAt: number }> = []
  for (const r of rows) {
    const ref = ctx.bundle.exercises[r.id]
    if (!ref) return null
    candidates.push({ ...ref, wrongCount: r.wrongCount, lastWrongAt: r.lastWrongAt })
  }
  return rankMistakes(candidates, ctx.skills.learner, signals)
}

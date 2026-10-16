import { rng, type Seed } from '../rng'
import { levelRank, type ExerciseRef, type LearnerSkill, type Level } from '../schema'
import { diffNumber } from '../compile/difficulty'
import { itemDifficulty } from './skills'

// Adaptive practice for language courses (docs/LANGUAGE_COURSE.md «Підбір вправ під рівень»): «Граматика»,
// «Аудіювання», «Вимова», «Мої помилки», the feed — and the order of new words in «Слова». Pure and deterministic
// (same input and seed → same session); the server only gathers the signals (src/server/courses/adaptive.ts).
//
// 1. Level band. The learner's level for an exercise = the level of the exercise's skill (skill estimate θ,
//    skills.ts; no skill → the overall level). Only exercises within ±1 level of it (`band`). When the band holds
//    fewer than the session needs, it widens one level at a time (a B2 learner while only A1–A2 exist still practises).
// 2. Weight of an exercise = fit × topic × item:
//    fit   — how close its difficulty b (level + diff, skills.ts) is to θ + 0.2 (a little stretch):
//            exp(−(b − θ − 0.2)² / (2·0.8²)), never below 0.1 inside the band;
//    topic — 1 + 0.4 per open mistake in the topic (≤ +1.5) + 0.2 per wrong answer there in the last 14 days (≤ +1)
//            + 1 if the topic test's best score is < 60 % (+0.5 if < 80 %); capped at 4;
//    item  — open mistake ×3, last answer wrong ×2, never tried ×1.5, last answer right ×0.6.
// 3. Draw without replacement, weighted (Efraimidis–Spirakis keys −ln(u)/w with a seeded u). Variety: ≥ 30 % of the
//    session is new material when there is some (no starvation: mistakes can't crowd it out), at most ⌈0.4·size⌉
//    (≥ 2) exercises per topic and ≤ 60 % of one format while other candidates remain; then a seeded shuffle.

export const BAND = 1
export const STRETCH = 0.2
export const FIT_SD = 0.8
export const FIT_FLOOR = 0.1
export const NEW_SHARE = 0.3
export const MODE_SHARE = 0.6
export const TOPIC_SHARE = 0.4
export const RECENT_DAYS = 14
export const ITEM_FACTOR = { mistake: 3, wrong: 2, unseen: 1.5, right: 0.6 } as const

export interface LearnerLevels {
  // θ of the overall level (levelTheta(enrollment level) when nothing better is known)
  overall: number
  skills: Partial<Record<LearnerSkill, number>>
}

export interface PracticeSignals {
  // the latest verdict per exercise (absent: never tried)
  last?: ReadonlyMap<string, boolean>
  // open mistakes per exercise
  mistakes?: ReadonlyMap<string, { wrongCount: number }>
  // wrong answers per exercise in the last RECENT_DAYS days
  recentWrong?: ReadonlyMap<string, number>
  // best topic-test score per topic id (0…1), tested topics only
  topicScores?: ReadonlyMap<string, number>
}

export type PracticeCandidate = Pick<ExerciseRef, 'id' | 'level' | 'topicId' | 'difficulty'> & Partial<Pick<ExerciseRef, 'skill' | 'mode' | 'kind'>>

export interface PracticeInput {
  candidates: readonly PracticeCandidate[]
  learner: LearnerLevels
  size: number
  seed: Seed
  signals?: PracticeSignals
  // ±levels kept; null — no band (the learner filtered by level or topic themselves)
  band?: number | null
  // share reserved for never-tried exercises (0 — none, e.g. «Мої помилки»)
  newShare?: number
}

export interface PracticePick {
  ids: string[]
  // the band actually used (after widening), as ranks around each skill's level; null — no band
  band: number | null
  widened: boolean
  inBand: number
  stats: { mistakes: number; wrong: number; unseen: number; boostedTopics: number }
}

const thetaFor = (c: { skill?: LearnerSkill }, learner: LearnerLevels): number => (c.skill ? (learner.skills[c.skill] ?? learner.overall) : learner.overall)

// |rank(exercise level) − rank(learner's level for its skill)|
export function levelDistance(c: PracticeCandidate, learner: LearnerLevels): number {
  return Math.abs(levelRank(c.level) - Math.max(0, Math.floor(thetaFor(c, learner) + 1e-9)))
}

export function fitWeight(c: PracticeCandidate, learner: LearnerLevels): number {
  const b = itemDifficulty(c.level, diffNumber(c.difficulty))
  const d = b - thetaFor(c, learner) - STRETCH
  return Math.max(FIT_FLOOR, Math.exp(-(d * d) / (2 * FIT_SD * FIT_SD)))
}

export interface TopicSignal {
  open: number
  recentWrong: number
  score: number | null
}

export function topicSignals(candidates: readonly PracticeCandidate[], signals: PracticeSignals = {}): Map<string, TopicSignal> {
  const out = new Map<string, TopicSignal>()
  const of = (topicId: string) => {
    let t = out.get(topicId)
    if (!t) out.set(topicId, (t = { open: 0, recentWrong: 0, score: signals.topicScores?.get(topicId) ?? null }))
    return t
  }
  for (const c of candidates) {
    const t = of(c.topicId)
    if (signals.mistakes?.has(c.id)) t.open++
    t.recentWrong += signals.recentWrong?.get(c.id) ?? 0
  }
  return out
}

export function topicWeight(t: TopicSignal | undefined): number {
  if (!t) return 1
  const score = t.score === null ? 0 : t.score < 0.6 ? 1 : t.score < 0.8 ? 0.5 : 0
  return Math.min(4, 1 + Math.min(1.5, 0.4 * t.open) + Math.min(1, 0.2 * t.recentWrong) + score)
}

export function itemWeight(id: string, signals: PracticeSignals = {}): number {
  if (signals.mistakes?.has(id)) return ITEM_FACTOR.mistake
  const last = signals.last?.get(id)
  if (last === false) return ITEM_FACTOR.wrong
  if (last === undefined) return ITEM_FACTOR.unseen
  return ITEM_FACTOR.right
}

export function practiceWeight(c: PracticeCandidate, learner: LearnerLevels, topics: ReadonlyMap<string, TopicSignal>, signals: PracticeSignals = {}): number {
  return fitWeight(c, learner) * topicWeight(topics.get(c.topicId)) * itemWeight(c.id, signals)
}

const formatOf = (c: PracticeCandidate): string => c.mode ?? c.kind ?? 'other'

export function selectPractice(input: PracticeInput): PracticePick {
  const signals = input.signals ?? {}
  const size = Math.max(0, Math.floor(input.size))
  const band = input.band === undefined ? BAND : input.band
  // 1. the band, widened while too small
  let pool: PracticeCandidate[] = [...input.candidates]
  let used: number | null = null
  let inBand = pool.length
  if (band !== null && pool.length > 0) {
    const maxDistance = Math.max(...pool.map((c) => levelDistance(c, input.learner)))
    used = band
    pool = input.candidates.filter((c) => levelDistance(c, input.learner) <= used!)
    inBand = pool.length
    while (pool.length < size && used < maxDistance) {
      used++
      pool = input.candidates.filter((c) => levelDistance(c, input.learner) <= used!)
    }
  }
  const topics = topicSignals(pool, signals)
  const random = rng(`adaptive|${input.seed}`)
  // 2. Efraimidis–Spirakis keys: smaller = earlier; weight 0 never happens (fit ≥ 0.1)
  const keyed = pool.map((c) => ({ c, key: -Math.log(1 - random()) / practiceWeight(c, input.learner, topics, signals) })).sort((a, b) => a.key - b.key || (a.c.id < b.c.id ? -1 : 1))
  const picked: PracticeCandidate[] = []
  const taken = new Set<string>()
  const perTopic = new Map<string, number>()
  const perFormat = new Map<string, number>()
  const topicCap = Math.max(2, Math.ceil(size * TOPIC_SHARE))
  const formatCap = Math.max(2, Math.ceil(size * MODE_SHARE))
  const take = (c: PracticeCandidate) => {
    picked.push(c)
    taken.add(c.id)
    perTopic.set(c.topicId, (perTopic.get(c.topicId) ?? 0) + 1)
    perFormat.set(formatOf(c), (perFormat.get(formatOf(c)) ?? 0) + 1)
  }
  const fill = (filter: (c: PracticeCandidate) => boolean, limit: number, capped: boolean) => {
    for (const { c } of keyed) {
      if (picked.length >= limit) return
      if (taken.has(c.id) || !filter(c)) continue
      if (capped && ((perTopic.get(c.topicId) ?? 0) >= topicCap || (perFormat.get(formatOf(c)) ?? 0) >= formatCap)) continue
      take(c)
    }
  }
  const unseen = (c: PracticeCandidate) => !signals.last?.has(c.id) && !signals.mistakes?.has(c.id)
  // 3. new material first (its quota), then everything; caps relax only when nothing else is left
  const newQuota = Math.ceil(size * (input.newShare ?? NEW_SHARE))
  fill(unseen, Math.min(size, newQuota), true)
  fill(() => true, size, true)
  fill(() => true, size, false)
  const order = picked.map((c) => ({ c, r: random() })).sort((a, b) => a.r - b.r)
  return {
    ids: order.map((o) => o.c.id),
    band: used,
    widened: used !== null && used > (band ?? 0),
    inBand,
    stats: {
      mistakes: picked.filter((c) => signals.mistakes?.has(c.id)).length,
      wrong: picked.filter((c) => !signals.mistakes?.has(c.id) && signals.last?.get(c.id) === false).length,
      unseen: picked.filter(unseen).length,
      boostedTopics: [...topics.values()].filter((t) => topicWeight(t) > 1).length,
    },
  }
}

// «Мої помилки»: every eligible mistake stays (they are the learner's own), ordered by weight — in-band first
// (out-of-band ×0.3), topics with more trouble first, more wrong answers first — with no more than two of one topic in
// a row while other topics wait.
export function rankMistakes(candidates: readonly (PracticeCandidate & { wrongCount: number; lastWrongAt: number })[], learner: LearnerLevels, signals: PracticeSignals = {}): string[] {
  const topics = topicSignals(candidates, signals)
  const scored = candidates
    .map((c) => ({ c, w: (levelDistance(c, learner) <= BAND ? 1 : 0.3) * topicWeight(topics.get(c.topicId)) * (1 + 0.2 * Math.min(5, c.wrongCount)) }))
    .sort((a, b) => b.w - a.w || a.c.lastWrongAt - b.c.lastWrongAt || (a.c.id < b.c.id ? -1 : 1))
  const topicOf = new Map(candidates.map((c) => [c.id, c.topicId]))
  const out: string[] = []
  const queue = [...scored]
  while (queue.length > 0) {
    const run = out.slice(-2).map((id) => topicOf.get(id))
    const blocked = run.length === 2 && run[0] === run[1] ? run[0] : null
    const i = blocked ? queue.findIndex((x) => x.c.topicId !== blocked) : 0
    out.push(queue.splice(i < 0 ? 0 : i, 1)[0]!.c.id)
  }
  return out
}

// «Слова»: new words (FSRS reviews are not touched) — the learner's vocabulary level first, then one below (gaps),
// then one above, then the rest by distance; document order inside a level.
export function orderNewWords<T extends Pick<ExerciseRef, 'id' | 'level'>>(words: readonly T[], theta: number): T[] {
  const mine = Math.floor(theta + 1e-9)
  const tier = (w: T) => {
    const d = levelRank(w.level) - mine
    return d === 0 ? 0 : d === -1 ? 1 : d === 1 ? 2 : 2 + Math.abs(d)
  }
  return words.map((w, i) => ({ w, i, t: tier(w) })).sort((a, b) => a.t - b.t || a.i - b.i).map((x) => x.w)
}

// The level range a band covers around a θ, for labels («A1–B1»).
export function bandRange(theta: number, band: number, levels: readonly Level[]): { from: Level; to: Level } {
  const r = Math.floor(theta + 1e-9)
  const at = (i: number) => levels[Math.max(0, Math.min(levels.length - 1, i))]!
  return { from: at(r - band), to: at(r + band) }
}

import { rng, shuffle, type Seed } from '../rng'
import { LEVELS, byLevel, levelAt, levelRank, type CourseBundle, type Level } from '../schema'

// Adaptive placement test (5–7 min). Stateless: the server replays the answers so far to get the next question.
// Levels are probed easier → harder: first the second-lowest level, then a binary search over the rest,
// 2–3 questions per level (2 right → pass, 2 wrong → fail, 1:1 → a third question decides).

export interface PlacementAnswer {
  exerciseId: string
  correct: boolean
}

export interface PlacementStep {
  done: boolean
  // next question to ask, null when done
  next: string | null
  probing: Level | null
  asked: number
  maxQuestions: number
}

export interface LevelTally {
  asked: number
  correct: number
}

export interface PlacementResult {
  level: Level
  // index of the first section to study; earlier sections count as known (tested out)
  sectionIndex: number
  sectionId: string | null
  perLevel: Record<Level, LevelTally>
  // false when the question limit cut the search short
  confident: boolean
}

type Verdict = 'pass' | 'fail' | 'open'

interface Replay {
  levels: Level[]
  tallies: Record<Level, LevelTally>
  asked: Set<string>
  total: number
  best: number
  probing: Level | null
  done: boolean
  capped: boolean
}

function verdict(t: LevelTally, perLevel: number, poolSize: number): Verdict {
  const needed = Math.ceil((perLevel * 2) / 3)
  if (t.correct >= needed) return 'pass'
  if (t.asked - t.correct > perLevel - needed) return 'fail'
  // pool ran out before the level was decided: judge by the ratio
  if (t.asked >= Math.min(perLevel, poolSize)) return t.asked > 0 && t.correct / t.asked >= 2 / 3 ? 'pass' : 'fail'
  return 'open'
}

function lowestLevel(bundle: CourseBundle): Level {
  return bundle.course.levels.length > 0 ? levelAt(Math.min(...bundle.course.levels.map(levelRank))) : 'noob'
}

function replay(bundle: CourseBundle, answers: readonly PlacementAnswer[]): Replay {
  const { pool, perLevel, maxQuestions } = bundle.placement
  const levels = LEVELS.filter((l) => bundle.course.levels.includes(l) && (pool[l]?.length ?? 0) >= 2)
  const tallies = byLevel((): LevelTally => ({ asked: 0, correct: 0 }))
  const inPool = new Map<string, Level>()
  for (const l of levels) for (const id of pool[l] ?? []) inPool.set(id, l)
  const asked = new Set<string>()
  for (const a of answers) {
    const level = inPool.get(a.exerciseId)
    if (!level || asked.has(a.exerciseId)) continue
    asked.add(a.exerciseId)
    tallies[level].asked++
    if (a.correct) tallies[level].correct++
  }
  const total = asked.size
  const lowest = lowestLevel(bundle)
  let lo = 0
  let hi = levels.length - 1
  let best = -1
  let first = true
  while (lo <= hi) {
    const mid = first && hi >= 2 ? Math.min(1, hi) : (lo + hi) >> 1
    first = false
    const level = levels[mid]!
    // failing everything above the course's lowest level already means «lowest»: no need to probe it
    if (mid === 0 && level === lowest && hi < levels.length - 1 && tallies[level].asked === 0) break
    const v = verdict(tallies[level], perLevel, pool[level]?.length ?? 0)
    if (v === 'open') {
      const capped = total >= maxQuestions
      return { levels, tallies, asked, total, best, probing: capped ? null : level, done: capped, capped }
    }
    if (v === 'pass') {
      best = mid
      lo = mid + 1
    } else hi = mid - 1
  }
  return { levels, tallies, asked, total, best, probing: null, done: true, capped: false }
}

export function placementTest(bundle: CourseBundle, answers: readonly PlacementAnswer[], seed: Seed): PlacementStep {
  const { maxQuestions, enabled } = bundle.placement
  if (!enabled) return { done: true, next: null, probing: null, asked: 0, maxQuestions }
  const r = replay(bundle, answers)
  if (r.done || !r.probing) return { done: true, next: null, probing: null, asked: r.total, maxQuestions }
  const next = placementQueue(bundle, r.probing, seed).find((id) => !r.asked.has(id)) ?? null
  return { done: next === null, next, probing: next ? r.probing : null, asked: r.total, maxQuestions }
}

// The order in which a level's questions are asked for this seed.
export function placementQueue(bundle: CourseBundle, level: Level, seed: Seed): string[] {
  return shuffle(bundle.placement.pool[level] ?? [], rng(`placement|${level}|${seed}`))
}

// Every question the test can possibly ask for this seed: a level is decided within `perLevel` questions and
// always takes them from the front of its queue. Lets a page pre-render the whole (small) candidate set.
export function placementCandidates(bundle: CourseBundle, seed: Seed): string[] {
  if (!bundle.placement.enabled) return []
  return LEVELS.flatMap((l) => (bundle.course.levels.includes(l) && (bundle.placement.pool[l]?.length ?? 0) >= 2 ? placementQueue(bundle, l, seed).slice(0, bundle.placement.perLevel) : []))
}

export function placementResult(bundle: CourseBundle, answers: readonly PlacementAnswer[]): PlacementResult {
  const r = replay(bundle, answers)
  const lowest = lowestLevel(bundle)
  let level: Level
  if (r.best >= 0) level = r.levels[r.best]!
  else if (r.levels.length > 0) level = levelAt(Math.max(levelRank(lowest), levelRank(r.levels[0]!) - 1))
  else level = lowest
  const { index, id } = startSection(bundle, level)
  return { level, sectionIndex: index, sectionId: id, perLevel: r.tallies, confident: r.done && !r.capped }
}

// First path section that is harder than the level; all-known → the last path section.
export function startSection(bundle: CourseBundle, level: Level): { index: number; id: string | null } {
  const path = bundle.sections.filter((s) => s.kind === 'path')
  const target = path.find((s) => levelRank(s.level) > levelRank(level)) ?? path.at(-1) ?? bundle.sections[0]
  return target ? { index: target.index, id: target.id } : { index: 0, id: null }
}

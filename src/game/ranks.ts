import { RANK_TIERS, rankTitle, stageOf, WARRIOR_RANKS, type LooStage, type RankTier, type WarriorRank } from './evolution'

// Character rank = «шлях воїна»: 11 ranks × steps I–V + the single Легенда = 56 steps (0…55) across ALL courses.
// XP alone isn't enough — steps also ask for course milestones (lessons, passed topic tests, passed section exams,
// whole courses finished). The ladder is cumulative: a step is reached only with every earlier one (no skipping).

export interface RankInput {
  xp: number
  lessons: number
  tests: number
  exams: number
  courses: number
}

export type Requirement = keyof RankInput

export interface RankDef {
  // `knight-3`, `legend`
  id: string
  index: number
  rank: WarriorRank
  tier: RankTier
  // «Лицар III»
  title: string
  // how Loo looks at this step (he only grows; power is gear)
  stage: LooStage
  needs: RankInput
  // gems paid once when the step is first reached
  gems: number
}

// ~quadratic XP: 44·i² + 20·i, rounded to a readable number (Легенда ≈ 134 тис. XP).
export function rankXp(index: number): number {
  const raw = 44 * index * index + 20 * index
  const unit = raw < 1_000 ? 5 : raw < 10_000 ? 50 : 100
  return Math.round(raw / unit) * unit
}

type Gate = [lessons: number, tests: number, exams: number, courses: number]

// Course milestones at step I of every rank; steps II–V are interpolated towards the next rank's step I.
const GATES: Record<WarriorRank, Gate> = {
  novice: [0, 0, 0, 0],
  recruit: [8, 2, 0, 0],
  fighter: [25, 6, 0, 0],
  warrior: [50, 12, 1, 0],
  sentinel: [80, 18, 1, 0],
  veteran: [120, 24, 2, 0],
  knight: [170, 30, 3, 0],
  paladin: [230, 36, 4, 0],
  champion: [300, 42, 5, 0],
  warlord: [380, 50, 6, 0],
  hero: [470, 58, 7, 1],
  legend: [600, 75, 12, 2],
}

// Gems for a new step grow with the step; a new rank (step I) pays double; Легенда 1000.
export function stepGems(index: number, tier: RankTier, rank: WarriorRank): number {
  if (index === 0) return 0
  if (rank === 'legend') return 1_000
  return (10 + 3 * index) * (tier === 1 ? 2 : 1)
}

function build(): RankDef[] {
  const out: RankDef[] = []
  WARRIOR_RANKS.forEach((rank, r) => {
    const tiers = rank === 'legend' ? 1 : RANK_TIERS
    const from = GATES[rank]
    const to = GATES[WARRIOR_RANKS[r + 1] ?? rank]
    for (let t = 0; t < tiers; t++) {
      const tier = (t + 1) as RankTier
      const index = out.length
      const [lessons, tests, exams, courses] = from.map((a, k) => a + Math.floor(((to[k]! - a) * t) / RANK_TIERS))
      out.push({
        id: rank === 'legend' ? 'legend' : `${rank}-${tier}`,
        index,
        rank,
        tier,
        title: rankTitle(rank, tier),
        stage: stageOf(index),
        needs: { xp: rankXp(index), lessons: lessons!, tests: tests!, exams: exams!, courses: courses! },
        gems: stepGems(index, tier, rank),
      })
    }
  })
  return out
}

export const RANKS: readonly RankDef[] = build()

const REQS: readonly Requirement[] = ['xp', 'lessons', 'tests', 'exams', 'courses']

export const meets = (input: RankInput, def: RankDef): boolean => REQS.every((k) => input[k] >= def.needs[k])

// The highest step whose every requirement is met (no skipping a gate).
export function rankOf(input: RankInput): RankDef {
  let current = RANKS[0]!
  for (const def of RANKS) {
    if (!meets(input, def)) break
    current = def
  }
  return current
}

// Step index of an id (`knight-3`), or of a number already; unknown → 0.
export function rankIndex(id: string | number): number {
  if (typeof id === 'number') return Math.max(0, Math.min(RANKS.length - 1, Math.floor(id)))
  return Math.max(0, RANKS.findIndex((r) => r.id === id))
}

export const rankAt = (index: number): RankDef => RANKS[rankIndex(index)]!

// The first step of a rank (`knight` → Лицар I): rank requirements of gear.
export const rankStart = (rank: WarriorRank): number => RANKS.findIndex((r) => r.rank === rank && r.tier === 1)

export interface RankGap {
  key: Requirement
  have: number
  need: number
}

export interface RankProgress {
  rank: RankDef
  next: RankDef | null
  // requirements of the next step (all of them, met or not)
  gaps: RankGap[]
  // 0..1: the least-advanced requirement towards the next step
  progress: number
}

// `floor`: the stored step (user_state.evo_step) — a rank once reached is kept even if the inputs say less.
export function rankProgress(input: RankInput, floor = 0): RankProgress {
  const earned = rankOf(input)
  const rank = floor > earned.index ? rankAt(floor) : earned
  const next = RANKS[rank.index + 1] ?? null
  if (!next) return { rank, next: null, gaps: [], progress: 1 }
  const gaps = REQS.filter((k) => next.needs[k] > 0).map((key) => ({ key, have: input[key], need: next.needs[key] }))
  const progress = Math.min(...gaps.map((g) => Math.min(1, g.have / g.need)))
  return { rank, next, gaps, progress }
}

export const isRankUp = (before: string | number, after: string | number): boolean => rankIndex(after) > rankIndex(before)

// Steps passed when going from `before` to `after` (each pays its gems once).
export const stepsBetween = (before: number, after: number): RankDef[] => RANKS.filter((r) => r.index > before && r.index <= after)

// Loo's evolution ladder before migration 0009 had 22 steps (0–21); a stored step maps proportionally.
export const LEGACY_EVO_STEPS = 22
export const fromLegacyStep = (step: number): number => Math.round((Math.max(0, Math.min(LEGACY_EVO_STEPS - 1, step)) * (RANKS.length - 1)) / (LEGACY_EVO_STEPS - 1))

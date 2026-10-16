import { formTitle, LOO_FORM_EMOJI, LOO_FORMS, type EvoTier, type LooForm } from './evolution'

// 🎖️ Rank = Loo's evolution: 8 forms × tiers I–III (Legendary has one) = 22 steps across ALL courses.
// XP alone isn't enough — steps also ask for course milestones (lessons, passed topic tests 🏁, passed section exams 👑,
// whole courses finished for Legendary). The ladder is cumulative: a step is reached only with every earlier one.

export interface RankInput {
  xp: number
  lessons: number
  tests: number
  exams: number
  courses: number
}

export type Requirement = keyof RankInput

export interface RankDef {
  // `lamp-2`, `legendary`
  id: string
  index: number
  form: LooForm
  tier: EvoTier
  // «Ламповий II»
  title: string
  emoji: string
  needs: RankInput
  // 💎 paid once when the step is first reached
  gems: number
}

type Need = [xp: number, lessons?: number, tests?: number, exams?: number, courses?: number]

// Rebalanced from the old Noob→God ladder: Trainee ≈ Піксель I, Junior ≈ Блок I, Middle ≈ Ламповий I,
// Senior ≈ Броньований I, Staff ≈ Коронований I, Principal ≈ Коронований III, God ≈ Легендарний.
const NEEDS: Record<LooForm, Need[]> = {
  egg: [[0], [25], [60, 1]],
  pixel: [[100, 1], [250, 3], [500, 6, 1]],
  block: [[1_000, 10, 3], [1_700, 15, 5], [2_700, 22, 7]],
  lamp: [[4_000, 30, 10, 1], [5_300, 36, 12, 1], [6_700, 42, 14, 2]],
  charged: [[8_200, 48, 16, 2], [9_600, 53, 17, 2], [10_800, 57, 19, 3]],
  armored: [[12_000, 60, 20, 3], [17_000, 75, 24, 4], [23_000, 88, 27, 4]],
  crowned: [[30_000, 100, 30, 5], [45_000, 125, 35, 6], [60_000, 150, 40, 7]],
  legendary: [[100_000, 200, 50, 9, 1]],
}

function build(): RankDef[] {
  const out: RankDef[] = []
  for (const form of LOO_FORMS) {
    NEEDS[form].forEach(([xp, lessons = 0, tests = 0, exams = 0, courses = 0], i) => {
      const tier = (i + 1) as EvoTier
      const index = out.length
      out.push({
        id: form === 'legendary' ? 'legendary' : `${form}-${tier}`,
        index,
        form,
        tier,
        title: formTitle(form, tier),
        emoji: LOO_FORM_EMOJI[form],
        needs: { xp, lessons, tests, exams, courses },
        // 💎 grows with the step; a new form (tier I) pays double; Legendary 500
        gems: form === 'legendary' ? 500 : index === 0 ? 0 : (10 + index * 5) * (tier === 1 ? 2 : 1),
      })
    })
  }
  return out
}

export const RANKS: readonly RankDef[] = build()
export const EVOLUTION_STEPS = RANKS.length

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

// Step index of an id (`lamp-2`), or of a number already; unknown → 0.
export function rankIndex(id: string | number): number {
  if (typeof id === 'number') return Math.max(0, Math.min(RANKS.length - 1, Math.floor(id)))
  return Math.max(0, RANKS.findIndex((r) => r.id === id))
}

export const rankAt = (index: number): RankDef => RANKS[rankIndex(index)]!

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

export function rankProgress(input: RankInput): RankProgress {
  const rank = rankOf(input)
  const next = RANKS[rank.index + 1] ?? null
  if (!next) return { rank, next: null, gaps: [], progress: 1 }
  const gaps = REQS.filter((k) => next.needs[k] > 0).map((key) => ({ key, have: input[key], need: next.needs[key] }))
  const progress = Math.min(...gaps.map((g) => Math.min(1, g.have / g.need)))
  return { rank, next, gaps, progress }
}

export const isRankUp = (before: string | number, after: string | number): boolean => rankIndex(after) > rankIndex(before)

// Steps passed when going from `before` to `after` (each pays its 💎 once).
export const stepsBetween = (before: number, after: number): RankDef[] => RANKS.filter((r) => r.index > before && r.index <= after)

// Old Noob→God rank ids (user_state.rank before migration 0008) → evolution step.
export const LEGACY_RANK_STEP: Record<string, number> = { noob: 0, trainee: 3, junior: 6, middle: 9, senior: 15, staff: 18, principal: 20, god: 21 }

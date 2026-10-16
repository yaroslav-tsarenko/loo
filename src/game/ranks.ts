// 🎖️ Rank ladder Noob → God: XP alone isn't enough — every rank above Trainee also asks for course milestones
// (lessons, passed topic tests 🏁, passed section exams 👑, a whole course finished for God).

export const RANK_IDS = ['noob', 'trainee', 'junior', 'middle', 'senior', 'staff', 'principal', 'god'] as const
export type RankId = (typeof RANK_IDS)[number]

export interface RankInput {
  xp: number
  lessons: number
  tests: number
  exams: number
  courses: number
}

export type Requirement = keyof RankInput

export interface RankDef {
  id: RankId
  title: string
  emoji: string
  needs: RankInput
}

const need = (xp: number, lessons = 0, tests = 0, exams = 0, courses = 0): RankInput => ({ xp, lessons, tests, exams, courses })

export const RANKS: readonly RankDef[] = [
  { id: 'noob', title: 'Noob', emoji: '🐣', needs: need(0) },
  { id: 'trainee', title: 'Trainee', emoji: '🌱', needs: need(100, 1) },
  { id: 'junior', title: 'Junior', emoji: '🧑‍💻', needs: need(1_000, 10, 3) },
  { id: 'middle', title: 'Middle', emoji: '⚙️', needs: need(4_000, 30, 10, 1) },
  { id: 'senior', title: 'Senior', emoji: '🧠', needs: need(12_000, 60, 20, 3) },
  { id: 'staff', title: 'Staff', emoji: '🏗️', needs: need(30_000, 100, 30, 5) },
  { id: 'principal', title: 'Principal', emoji: '🧭', needs: need(60_000, 150, 40, 7) },
  { id: 'god', title: 'God', emoji: '⚡', needs: need(100_000, 200, 50, 9, 1) },
]

const REQS: readonly Requirement[] = ['xp', 'lessons', 'tests', 'exams', 'courses']

export const meets = (input: RankInput, def: RankDef): boolean => REQS.every((k) => input[k] >= def.needs[k])

// The highest rank whose every requirement is met (ranks are cumulative: no skipping a gate).
export function rankOf(input: RankInput): RankDef {
  let current = RANKS[0]!
  for (const def of RANKS) {
    if (!meets(input, def)) break
    current = def
  }
  return current
}

export const rankIndex = (id: RankId | string): number => Math.max(0, RANKS.findIndex((r) => r.id === id))

export interface RankGap {
  key: Requirement
  have: number
  need: number
}

export interface RankProgress {
  rank: RankDef
  next: RankDef | null
  // requirements of the next rank (all of them, met or not)
  gaps: RankGap[]
  // 0..1: the least-advanced requirement towards the next rank
  progress: number
}

export function rankProgress(input: RankInput): RankProgress {
  const rank = rankOf(input)
  const next = RANKS[rankIndex(rank.id) + 1] ?? null
  if (!next) return { rank, next: null, gaps: [], progress: 1 }
  const gaps = REQS.filter((k) => next.needs[k] > 0).map((key) => ({ key, have: input[key], need: next.needs[key] }))
  const progress = Math.min(...gaps.map((g) => Math.min(1, g.have / g.need)))
  return { rank, next, gaps, progress }
}

export const isRankUp = (before: RankId | string, after: RankId | string): boolean => rankIndex(after) > rankIndex(before)

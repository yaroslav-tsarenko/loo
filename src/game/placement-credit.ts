import { RANKS } from './ranks'

// Rank credit for the levels a placement test verified (owner's call: a learner placed at B2 must not stay
// «Новобранець», yet the economy must hold). The credit lifts the character to a fixed step of «шлях воїна» per placed
// level — XP and course milestones exactly up to that step, nothing more: no bucks or gems (the steps reached this way
// pay no gems either), no league XP (reason 'placement' isn't a league source). Only a test result earns it — a level
// picked by hand doesn't. Once per course: retaking the test only tops the credit up to a higher level.

// placed level's rank on its ladder (A1 / noob = 0 … C2 / god = 5) → step index (0 Новобранець I … 25 Ветеран I)
export const PLACEMENT_RANK_STEP: readonly number[] = [0, 5, 10, 15, 20, 25]

export interface PlacementCredit {
  xp: number
  lessons: number
  tests: number
  exams: number
}

export const NO_CREDIT: PlacementCredit = { xp: 0, lessons: 0, tests: 0, exams: 0 }

export function placementCredit(levelRank: number): PlacementCredit {
  const step = PLACEMENT_RANK_STEP[Math.max(0, Math.min(PLACEMENT_RANK_STEP.length - 1, Math.floor(levelRank)))] ?? 0
  const needs = RANKS[step]?.needs
  return needs ? { xp: needs.xp, lessons: needs.lessons, tests: needs.tests, exams: needs.exams } : NO_CREDIT
}

// The larger credit, field by field (a retake never lowers it).
export function maxCredit(a: PlacementCredit | null | undefined, b: PlacementCredit): PlacementCredit {
  if (!a) return b
  return { xp: Math.max(a.xp, b.xp), lessons: Math.max(a.lessons, b.lessons), tests: Math.max(a.tests, b.tests), exams: Math.max(a.exams, b.exams) }
}

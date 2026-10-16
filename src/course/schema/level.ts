import { z } from 'zod'
import { CEFR_LEVELS, levelLabel } from '@/game/evolution'

// Course difficulty ladders. A course uses ONE of them:
// * `it`   — noob → junior → middle → senior → god (programming / general courses); labels are IT ranks
//            (Trainee … Principal). Legacy guide levels (junior/middle/senior/techlead) map onto it.
// * `cefr` — A1 → A2 → B1 → B2 → C1 → C2 (language courses, docs/LANGUAGE_COURSE.md); labels «A1 · Початковий».
// Ranks compare only inside a ladder; a value from the other ladder is mapped by rank (toLadder).
export const IT_LEVELS = ['noob', 'junior', 'middle', 'senior', 'god'] as const
export { CEFR_LEVELS }
export const LEVELS = [...IT_LEVELS, ...CEFR_LEVELS] as const
export type Level = (typeof LEVELS)[number]
export type ItLevel = (typeof IT_LEVELS)[number]
export type CefrCourseLevel = (typeof CEFR_LEVELS)[number]
export const LevelSchema = z.enum(LEVELS)

export type LevelLadder = 'it' | 'cefr'
export const LADDERS: Record<LevelLadder, readonly Level[]> = { it: IT_LEVELS, cefr: CEFR_LEVELS }

// One difficulty scale per course: ids stay noob…god / A1…C2, every label is the matching IT rank or CEFR name
// (src/game/evolution.ts): noob → Trainee … god → Principal; A1 → «A1 · Початковий».
export const LEVEL_LABEL = Object.fromEntries(LEVELS.map((l) => [l, levelLabel(l)])) as Record<Level, string>

// Compact label for ranges («A1 → C2», «Trainee → Principal»)
export const levelShort = (level: Level): string => (ladderOf(level) === 'cefr' ? level : LEVEL_LABEL[level])

const LEGACY: Record<string, Level> = {
  noob: 'noob',
  beginner: 'noob',
  start: 'noob',
  junior: 'junior',
  middle: 'middle',
  senior: 'senior',
  techlead: 'god',
  teamlead: 'god',
  lead: 'god',
  god: 'god',
  a1: 'A1',
  a2: 'A2',
  b1: 'B1',
  b2: 'B2',
  c1: 'C1',
  c2: 'C2',
}

export function ladderOf(level: Level): LevelLadder {
  return (CEFR_LEVELS as readonly string[]).includes(level) ? 'cefr' : 'it'
}

export const isLevel = (value: unknown): value is Level => typeof value === 'string' && (LEVELS as readonly string[]).includes(value)

// 'Tech Lead' → god, 'beginner' → noob, 'a1' → A1; unknown → null. With a ladder, the result is mapped onto it.
export function toCourseLevel(value: unknown, ladder?: LevelLadder): Level | null {
  if (typeof value !== 'string') return null
  const level = LEGACY[value.toLowerCase().replace(/[\s_-]+/g, '')] ?? null
  return level && ladder ? toLadder(level, ladder) : level
}

// Rank inside the level's own ladder (noob 0 … god 4; A1 0 … C2 5).
export function levelRank(level: Level): number {
  return LADDERS[ladderOf(level)].indexOf(level)
}

export function levelAt(rank: number, ladder: LevelLadder = 'it'): Level {
  const list = LADDERS[ladder]
  return list[Math.max(0, Math.min(list.length - 1, rank))]!
}

// The same step on the other ladder: noob ↔ A1, junior ↔ A2, middle ↔ B1, senior ↔ B2, god ↔ C1 (C2 → god).
export function toLadder(level: Level, ladder: LevelLadder): Level {
  return ladderOf(level) === ladder ? level : levelAt(levelRank(level), ladder)
}

export function maxLevel(levels: readonly Level[]): Level | null {
  if (levels.length === 0) return null
  return levels.reduce((best, l) => (levelRank(l) > levelRank(best) ? l : best))
}

export function minLevel(levels: readonly Level[]): Level | null {
  if (levels.length === 0) return null
  return levels.reduce((best, l) => (levelRank(l) < levelRank(best) ? l : best))
}

export function byLevel<T>(make: (level: Level) => T, levels: readonly Level[] = LEVELS): Record<Level, T> {
  const out = {} as Record<Level, T>
  for (const l of levels) out[l] = make(l)
  return out
}

// The ladder of a course: CEFR for language courses (or when its `levels` are CEFR), IT otherwise.
export function courseLadder(course: { kind?: string | null; subject?: string | null; levels?: readonly Level[] | null }): LevelLadder {
  if (course.levels && course.levels.length > 0) return ladderOf(course.levels[0]!)
  return course.kind === 'language' || (!course.kind && course.subject === 'language') ? 'cefr' : 'it'
}

// The course's levels in ladder order (declared `levels`, or the whole ladder).
export function courseLevels(course: { kind?: string | null; subject?: string | null; levels?: readonly Level[] | null }): Level[] {
  const ladder = courseLadder(course)
  const declared = new Set(course.levels ?? [])
  const list = LADDERS[ladder].filter((l) => declared.size === 0 || declared.has(l))
  return list.length > 0 ? list : [...LADDERS[ladder]]
}

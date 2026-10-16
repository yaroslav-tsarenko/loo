import { z } from 'zod'
import { levelForm, levelLabel, LOO_FORM_EMOJI } from '@/game/evolution'

// Course difficulty ladder. Legacy guide levels (junior/middle/senior/techlead) map onto it.
export const LEVELS = ['noob', 'junior', 'middle', 'senior', 'god'] as const
export type Level = (typeof LEVELS)[number]
export const LevelSchema = z.enum(LEVELS)

// One difficulty scale: ids stay noob…god internally, every label is the matching Loo form (src/game/evolution.ts):
// noob → Піксель, junior → Блок, middle → Ламповий, senior → Броньований, god → Легендарний.
export const LEVEL_LABEL: Record<Level, string> = {
  noob: levelLabel('noob'),
  junior: levelLabel('junior'),
  middle: levelLabel('middle'),
  senior: levelLabel('senior'),
  god: levelLabel('god'),
}

export const LEVEL_EMOJI: Record<Level, string> = {
  noob: LOO_FORM_EMOJI[levelForm('noob')],
  junior: LOO_FORM_EMOJI[levelForm('junior')],
  middle: LOO_FORM_EMOJI[levelForm('middle')],
  senior: LOO_FORM_EMOJI[levelForm('senior')],
  god: LOO_FORM_EMOJI[levelForm('god')],
}

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
}

// 'Tech Lead' → god, 'beginner' → noob; unknown → null
export function toCourseLevel(value: unknown): Level | null {
  if (typeof value !== 'string') return null
  return LEGACY[value.toLowerCase().replace(/[\s_-]+/g, '')] ?? null
}

export function levelRank(level: Level): number {
  return LEVELS.indexOf(level)
}

export function levelAt(rank: number): Level {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, rank))]!
}

export function maxLevel(levels: readonly Level[]): Level | null {
  if (levels.length === 0) return null
  return levelAt(Math.max(...levels.map(levelRank)))
}

export function minLevel(levels: readonly Level[]): Level | null {
  if (levels.length === 0) return null
  return levelAt(Math.min(...levels.map(levelRank)))
}

export function byLevel<T>(make: (level: Level) => T): Record<Level, T> {
  const out = {} as Record<Level, T>
  for (const l of LEVELS) out[l] = make(l)
  return out
}

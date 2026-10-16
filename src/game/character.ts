import type { ProfileStats } from '@/progress/stats'
import { RANKS, type RankDef } from './ranks'
import { GEAR_SLOTS, STATS, statTotal, type EquippedGear, type GearSlot, type GearStats } from './shop'
import { sortSkills, type Skill } from './skills'

// Loo's character sheet: six RPG attributes (1–100) computed from real learning data. Course-agnostic — only
// accuracy, speed, memory, practice tasks, rhythm and volume, so English or Math courses feed the same formulas.

export const ATTRIBUTES = ['intellect', 'speed', 'memory', 'craft', 'resilience', 'stamina'] as const
export type AttributeId = (typeof ATTRIBUTES)[number]

// Icon refs (src/ui/icons): our pixel set.
export const ATTRIBUTE_ICON: Record<AttributeId, string> = { intellect: 'px:bulb', speed: 'px:bolt', memory: 'px:cards', craft: 'px:hammer', resilience: 'px:shield', stamina: 'px:fire' }

export interface CharacterInput {
  // every graded answer (quizzes, cards, tasks)
  answers: { total: number; correct: number }
  // course topics touched / their average crowns (0–5)
  topics: { touched: number; avgCrowns: number }
  // median ms per question (recent window) and how many answers it is based on
  speed: { medianMs: number | null; n: number }
  memory: { cards: number; longTerm: number }
  tasks: { easy: number; medium: number; hard: number; attempted: number; firstTry: number }
  rhythm: { streak: number; active30: number; frozen30: number }
  volume: { totalMs: number; weekMs: number }
}

export interface Attribute {
  id: AttributeId
  // 1..100 (fractional: the part after the point is the progress to the next level)
  value: number
  level: number
  progress: number
}

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0)
// saturating curve: 0 at 0, ½ at `half`, → 1
const sat = (x: number, half: number) => (x <= 0 ? 0 : x / (x + half))

export const SPEED_SLOW_MS = 30_000
export const SPEED_FAST_MS = 3_000

// Each score is 0..1; attributes map it onto 1..100.
export function attributeScores(c: CharacterInput): Record<AttributeId, number> {
  const acc = (c.answers.correct + 1) / (c.answers.total + 2)
  const intellect = 0.55 * acc * sat(c.answers.total, 40) + 0.45 * clamp01(c.topics.avgCrowns / 5) * sat(c.topics.touched, 6)
  const speed = c.speed.medianMs === null ? 0 : clamp01((SPEED_SLOW_MS - c.speed.medianMs) / (SPEED_SLOW_MS - SPEED_FAST_MS)) * sat(c.speed.n, 15) * 1.2
  const share = c.memory.cards > 0 ? c.memory.longTerm / c.memory.cards : 0
  const memory = 0.7 * sat(c.memory.longTerm, 60) + 0.3 * share * sat(c.memory.cards, 20)
  const weighted = c.tasks.easy + 2 * c.tasks.medium + 3 * c.tasks.hard
  const firstTry = c.tasks.attempted > 0 ? c.tasks.firstTry / c.tasks.attempted : 0
  const craft = 0.75 * sat(weighted, 25) + 0.25 * firstTry * sat(c.tasks.attempted, 5)
  // freezes not needed: a clean month of rhythm beats one held together by freezes
  const resilience = 0.4 * sat(c.rhythm.streak, 14) + 0.45 * clamp01(c.rhythm.active30 / 30) + 0.15 * (1 - clamp01(c.rhythm.frozen30 / 4)) * sat(c.rhythm.active30, 5)
  const stamina = 0.6 * sat(c.volume.totalMs / 3_600_000, 25) + 0.4 * sat(c.volume.weekMs / 60_000, 150)
  return {
    intellect: clamp01(intellect),
    speed: clamp01(speed),
    memory: clamp01(memory),
    craft: clamp01(craft),
    resilience: clamp01(resilience),
    stamina: clamp01(stamina),
  }
}

export function toAttribute(id: AttributeId, score: number): Attribute {
  const value = Math.round((1 + 99 * clamp01(score)) * 100) / 100
  const level = Math.min(100, Math.floor(value))
  return { id, value, level, progress: level >= 100 ? 1 : Math.round((value - level) * 100) / 100 }
}

export function attributes(c: CharacterInput): Attribute[] {
  const s = attributeScores(c)
  return ATTRIBUTES.map((id) => toAttribute(id, s[id]))
}

// Strongest three and the weakest one (ties: catalog order).
export function strengthsAndWeakness(attrs: readonly Attribute[]): { strengths: Attribute[]; weakest: Attribute } {
  const order = (a: Attribute) => ATTRIBUTES.indexOf(a.id)
  const sorted = [...attrs].sort((a, b) => b.value - a.value || order(a) - order(b))
  const weakest = [...attrs].sort((a, b) => a.value - b.value || order(a) - order(b))[0]!
  return { strengths: sorted.slice(0, 3), weakest }
}

// One number for matchmaking / battles: attributes, character step, skills and gear stats.
export function powerScore(attrs: readonly Attribute[], step: number, skills: readonly Skill[], gear?: GearStats): number {
  const base = attrs.reduce((s, a) => s + a.level, 0)
  const skillPower = skills.reduce((s, k) => s + k.power, 0)
  return Math.round(base * (1 + step / (RANKS.length - 1)) + Math.sqrt(skillPower) * 10 + (gear ? statTotal(gear) * 3 : 0))
}

// From the statistics engine's profile metrics (src/progress/stats) + course mastery + spent freezes.
export function characterInput(stats: ProfileStats, topics: CharacterInput['topics'], frozen30: number): CharacterInput {
  const q = stats.speed.question
  return {
    answers: { total: stats.answers.total, correct: stats.answers.correct },
    topics,
    speed: { medianMs: q?.recentMs ?? q?.previousMs ?? null, n: q?.recentN ?? 0 },
    memory: { cards: stats.memory.cards, longTerm: stats.memory.longTerm },
    tasks: { ...stats.tasks.byDifficulty, attempted: stats.tasks.attempted, firstTry: stats.tasks.firstTry },
    rhythm: { streak: stats.consistency.streak.current, active30: stats.consistency.active30, frozen30 },
    volume: { totalMs: stats.hours.totalMs, weekMs: stats.hours.weekMs },
  }
}

// Battle-ready snapshot: stable JSON (fixed key order, attributes / gear in catalog order, skills sorted).
// v2: the warrior rank instead of Loo's forms, plus the equipped gear and its (capped) battle stats.
export interface CharacterSnapshot {
  version: 2
  rank: string
  tier: number
  step: number
  title: string
  attributes: Record<AttributeId, number>
  skills: Array<Pick<Skill, 'id' | 'kind' | 'name' | 'icon' | 'power' | 'courseId'>>
  gear: { equipped: Partial<Record<GearSlot, string>>; stats: GearStats }
  power: number
}

export function snapshotOf(rank: RankDef, attrs: readonly Attribute[], skills: readonly Skill[], gear: { equipped: EquippedGear; stats: GearStats } = { equipped: {}, stats: { attack: 0, defense: 0, energy: 0, focus: 0, speed: 0 } }): CharacterSnapshot {
  const byId = new Map(attrs.map((a) => [a.id, a.level]))
  const sorted = sortSkills(skills)
  const equipped: Partial<Record<GearSlot, string>> = {}
  for (const slot of GEAR_SLOTS) if (gear.equipped[slot]) equipped[slot] = gear.equipped[slot]
  return {
    version: 2,
    rank: rank.rank,
    tier: rank.tier,
    step: rank.index,
    title: rank.title,
    attributes: Object.fromEntries(ATTRIBUTES.map((id) => [id, byId.get(id) ?? 1])) as Record<AttributeId, number>,
    skills: sorted.map((s) => ({ id: s.id, kind: s.kind, name: s.name, icon: s.icon, power: s.power, courseId: s.courseId })),
    gear: { equipped, stats: Object.fromEntries(STATS.map((s) => [s, gear.stats[s]])) as GearStats },
    power: powerScore(attrs, rank.index, sorted, gear.stats),
  }
}

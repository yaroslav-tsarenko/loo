// Two rank scales (docs/ECONOMY.md):
// * the character rank — «шлях воїна», one ladder across ALL courses (src/game/ranks.ts builds its 56 steps);
// * the per-course mastery rank and content difficulty — the IT career (Trainee → Principal).
// Loo's look only grows with the character rank (egg → small → normal); everything powerful on him is gear.

// ── Шлях воїна ─────────────────────────────────────────────────────────────────────────────────────────────────

export const WARRIOR_RANKS = ['novice', 'recruit', 'fighter', 'warrior', 'sentinel', 'veteran', 'knight', 'paladin', 'champion', 'warlord', 'hero', 'legend'] as const
export type WarriorRank = (typeof WARRIOR_RANKS)[number]

export const WARRIOR_LABEL: Record<WarriorRank, string> = {
  novice: 'Новобранець',
  recruit: 'Рекрут',
  fighter: 'Боєць',
  warrior: 'Воїн',
  sentinel: 'Вартовий',
  veteran: 'Ветеран',
  knight: 'Лицар',
  paladin: 'Паладин',
  champion: 'Чемпіон',
  warlord: 'Полководець',
  hero: 'Герой',
  legend: 'Легенда',
}

// «від Лицаря» — genitive for rank requirements.
export const WARRIOR_FROM: Record<WarriorRank, string> = {
  novice: 'Новобранця',
  recruit: 'Рекрута',
  fighter: 'Бійця',
  warrior: 'Воїна',
  sentinel: 'Вартового',
  veteran: 'Ветерана',
  knight: 'Лицаря',
  paladin: 'Паладина',
  champion: 'Чемпіона',
  warlord: 'Полководця',
  hero: 'Героя',
  legend: 'Легенди',
}

export type RankTier = 1 | 2 | 3 | 4 | 5
export const RANK_TIERS = 5
export const TIER_ROMAN: Record<RankTier, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' }

// «Лицар III»; the final rank has a single step (no numeral).
export function rankTitle(rank: WarriorRank, tier: RankTier): string {
  return rank === 'legend' ? WARRIOR_LABEL.legend : `${WARRIOR_LABEL[rank]} ${TIER_ROMAN[tier]}`
}

export const isWarriorRank = (s: string): s is WarriorRank => (WARRIOR_RANKS as readonly string[]).includes(s)

// ── Loo grows (the only rank-driven part of his look) ────────────────────────────────────────────────────────────

export const LOO_STAGES = ['egg', 'small', 'normal'] as const
export type LooStage = (typeof LOO_STAGES)[number]

export const LOO_STAGE_LABEL: Record<LooStage, string> = { egg: 'Яйце', small: 'Малий Loo', normal: 'Loo' }

// Steps (0-based) where Loo hatches and grows up: Новобранець III and Рекрут I.
export const STAGE_FROM: Record<LooStage, number> = { egg: 0, small: 2, normal: 5 }

export function stageOf(step: number): LooStage {
  if (step >= STAGE_FROM.normal) return 'normal'
  if (step >= STAGE_FROM.small) return 'small'
  return 'egg'
}

export const isLooStage = (s: string): s is LooStage => (LOO_STAGES as readonly string[]).includes(s)

// ── IT career: per-course mastery rank and content difficulty ───────────────────────────────────────────────────

export const IT_RANKS = ['trainee', 'junior', 'middle', 'senior', 'staff', 'principal'] as const
export type ItRank = (typeof IT_RANKS)[number]

export const IT_RANK_LABEL: Record<ItRank, string> = {
  trainee: 'Trainee',
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
  staff: 'Staff',
  principal: 'Principal',
}

// Icon refs (src/ui/icons) for difficulty pills and course ranks.
export const IT_RANK_ICON: Record<ItRank, string> = {
  trainee: 'px:sprout',
  junior: 'px:bricks',
  middle: 'px:gear',
  senior: 'px:mountain',
  staff: 'px:compass',
  principal: 'px:crown',
}

// Course levels (noob…god) and legacy content levels (beginner, junior…techlead) stay as ids; every label the learner
// sees is the matching IT rank.
export const LEVEL_IT_RANK: Record<string, ItRank> = {
  noob: 'trainee',
  beginner: 'trainee',
  junior: 'junior',
  middle: 'middle',
  senior: 'senior',
  techlead: 'staff',
  god: 'principal',
}

// ── CEFR: the difficulty ladder of language courses (docs/LANGUAGE_COURSE.md) ───────────────────────────────────
// Language courses (kind: language) grade content, sections and learners on A1…C2 instead of the IT career. The two
// ladders never mix inside one course; where a course needs the other ladder's value it maps by rank (src/course
// toLadder). The per-course mastery rank of a language course is shown as CEFR too: the six IT ranks map 1:1.

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type CefrLevel = (typeof CEFR_LEVELS)[number]

export const CEFR_NAME: Record<CefrLevel, string> = {
  A1: 'Початковий',
  A2: 'Елементарний',
  B1: 'Середній',
  B2: 'Вище середнього',
  C1: 'Просунутий',
  C2: 'Вільне володіння',
}

export const CEFR_ICON: Record<CefrLevel, string> = {
  A1: 'px:sprout',
  A2: 'px:letterTile',
  B1: 'px:chat',
  B2: 'px:compass',
  C1: 'px:gradCap',
  C2: 'px:crown',
}

export const isCefrLevel = (level: string): level is CefrLevel => (CEFR_LEVELS as readonly string[]).includes(level)

// «A1 · Початковий»
export const cefrLabel = (level: CefrLevel): string => `${level} · ${CEFR_NAME[level]}`

// Per-course mastery rank of a language course: Trainee ↔ A1 … Principal ↔ C2.
export const IT_RANK_CEFR: Record<ItRank, CefrLevel> = { trainee: 'A1', junior: 'A2', middle: 'B1', senior: 'B2', staff: 'C1', principal: 'C2' }

export type RankLadder = 'it' | 'cefr'

export const courseRankLabel = (rank: ItRank, ladder: RankLadder = 'it'): string => (ladder === 'cefr' ? cefrLabel(IT_RANK_CEFR[rank]) : IT_RANK_LABEL[rank])
export const courseRankIcon = (rank: ItRank, ladder: RankLadder = 'it'): string => (ladder === 'cefr' ? CEFR_ICON[IT_RANK_CEFR[rank]] : IT_RANK_ICON[rank])

export const levelItRank = (level: string): ItRank => LEVEL_IT_RANK[level] ?? 'junior'

// «Senior» · CEFR levels: «A1 · Початковий»
export const levelLabel = (level: string): string => (isCefrLevel(level) ? cefrLabel(level) : IT_RANK_LABEL[levelItRank(level)])

// «Senior» — plain text; callers put a <LevelIcon level /> next to it.
export const levelBadge = (level: string): string => levelLabel(level)

// «для Senior» — exercise difficulty tags; CEFR: «рівень A1»
export const levelTag = (level: string): string => (isCefrLevel(level) ? `рівень ${level}` : `для ${levelLabel(level)}`)

export const levelIcon = (level: string): string => (isCefrLevel(level) ? CEFR_ICON[level] : IT_RANK_ICON[levelItRank(level)])

// ── Per-course mastery rank ────────────────────────────────────────────────────────────────────────────────────

export interface CourseMastery {
  lessons: { done: number; total: number }
  tests: { passed: number; total: number }
  exams: { passed: number; total: number }
  // share of correct first answers in the course (0..1), null without answers
  accuracy: number | null
}

// Share of each IT rank's score threshold (0..1). The score weighs lessons, topic tests, section exams and accuracy;
// Principal additionally needs every exam passed.
const COURSE_RANK_FROM: Record<ItRank, number> = { trainee: 0, junior: 0.12, middle: 0.3, senior: 0.55, staff: 0.78, principal: 0.95 }

export function courseScore(m: CourseMastery): number {
  const share = (a: { total: number }, n: number) => (a.total > 0 ? Math.max(0, Math.min(1, n / a.total)) : 0)
  const parts: Array<[number, number]> = [
    [share(m.lessons, m.lessons.done), 0.35],
    [share(m.tests, m.tests.passed), 0.25],
    [share(m.exams, m.exams.passed), 0.3],
    [m.accuracy ?? 0, 0.1],
  ]
  return Math.round(parts.reduce((s, [v, w]) => s + v * w, 0) * 1000) / 1000
}

export function courseRank(m: CourseMastery): ItRank {
  const score = courseScore(m)
  const allExams = m.exams.total === 0 || m.exams.passed >= m.exams.total
  let out: ItRank = 'trainee'
  for (const r of IT_RANKS) if (score >= COURSE_RANK_FROM[r] && (r !== 'principal' || allExams)) out = r
  return out
}

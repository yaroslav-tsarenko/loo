import type { LearningUnit } from '@/content/model'
import { LEARNER_SKILLS, levelRank, TOPIC_KINDS, type ExerciseKind, type LearnerSkill, type Level, type TopicKind } from '../schema'

// Exercise difficulty, skill and topic kind — derived at compile time from what the content already says, so practice
// selection (src/course/select/adaptive.ts) and the skill update (src/course/select/skills.ts) can use them.
// Deterministic: the same article always compiles to the same values (docs/LANGUAGE_COURSE.md «Складність вправ»).
//
// difficulty — inside the exercise's level («easy» = warm-up of the level, «hard» = on the edge of the next one):
//   score = effort of the format (below) + how far into the topic it stands among the topic's exercises of its kind
//   (0 … 1: articles go from the first pretest to the hardest items) + topic kind (review +0.5: mixes the whole level;
//   skills +0.5: longer texts) ± 1.5 when the exercise's own `level:` is above / below the level it got (a section's
//   `level:` overrides it; language courses only — programming guides' legacy levels don't mean «harder»).
//   score < 1.25 → easy · < 2.5 → medium · otherwise hard. Authored values win: a task's `difficulty:` and a quiz's
//   `diff: 1|2|3` (the placement-bank meta field, allowed in lessons too).

export type Difficulty = 'easy' | 'medium' | 'hard'

// Effort of the answer format: recognising < choosing < producing.
export const FORMAT_EFFORT = {
  word: 0.5,
  pair: 0.5,
  flashcard: 1,
  single: 1,
  'listen-choice': 1,
  multi: 1.5,
  output: 1.5,
  'listen-answer': 1.5,
  speak: 1.5,
  interview: 2,
  fill: 2,
  order: 2,
  'listen-fill': 2.5,
  'listen-dictation': 2.5,
} as const

export const TOPIC_EFFORT: Partial<Record<TopicKind, number>> = { review: 0.5, skills: 0.5 }
export const LEVEL_SHIFT = 1.5
export const EASY_BELOW = 1.25
export const HARD_FROM = 2.5

// A topic's kind: the first of its tags that names one (order matters: «review, test, grammar…» → review;
// «skills, reading, writing, …, review» → skills). Case-insensitive; none → undefined.
export function topicKindOf(tags: readonly string[]): TopicKind | undefined {
  for (const tag of tags) {
    const t = tag.toLowerCase()
    if ((TOPIC_KINDS as readonly string[]).includes(t)) return t as TopicKind
  }
  return undefined
}

function formatOf(unit: LearningUnit, kind: ExerciseKind): keyof typeof FORMAT_EFFORT | null {
  if (kind === 'word' || kind === 'flashcard' || kind === 'interview' || kind === 'pair' || kind === 'speak') return kind
  if (unit.kind !== 'quiz') return null
  if (unit.mode === 'listen') {
    const type = unit.listen?.type
    return type === 'dictation' ? 'listen-dictation' : type === 'fill' ? 'listen-fill' : type === 'answer' ? 'listen-answer' : 'listen-choice'
  }
  if (unit.mode === 'single' || unit.mode === 'multi' || unit.mode === 'output' || unit.mode === 'fill' || unit.mode === 'order') return unit.mode
  return 'single'
}

// Effort bonus of a [!word] card: a multi-word headword (phrase, phrasal verb, idiom) +0.75, irregular forms +0.25.
function wordBonus(unit: LearningUnit): number {
  if (unit.kind !== 'flashcard' || !unit.word) return 0
  return (unit.word.word.trim().includes(' ') ? 0.75 : 0) + (unit.word.forms ? 0.25 : 0)
}

export interface DifficultyInput {
  unit: LearningUnit
  kind: ExerciseKind
  // index among the topic's exercises of the same kind (document order) and how many there are
  position: number
  count: number
  topicKind: TopicKind | undefined
  // the exercise's own `level:` (null: none) and the level it was assigned (section level, own, or topic level)
  ownLevel: Level | null
  assignedLevel: Level
}

export function difficultyScore(input: DifficultyInput): number {
  const format = formatOf(input.unit, input.kind)
  const effort = format ? FORMAT_EFFORT[format] : FORMAT_EFFORT.single
  const along = input.count > 1 ? input.position / (input.count - 1) : 0
  const topic = input.topicKind ? (TOPIC_EFFORT[input.topicKind] ?? 0) : 0
  const own = input.ownLevel ? levelRank(input.ownLevel) - levelRank(input.assignedLevel) : 0
  return effort + wordBonus(input.unit) + along + topic + Math.sign(own) * LEVEL_SHIFT
}

export const difficultyOf = (score: number): Difficulty => (score < EASY_BELOW ? 'easy' : score < HARD_FROM ? 'medium' : 'hard')

const AUTHORED: Record<number, Difficulty> = { 1: 'easy', 2: 'medium', 3: 'hard' }

export function deriveDifficulty(input: DifficultyInput): Difficulty {
  const u = input.unit
  if (u.kind === 'task') return u.difficulty
  if (u.kind === 'quiz' && u.diff !== undefined && AUTHORED[u.diff]) return AUTHORED[u.diff]!
  return difficultyOf(difficultyScore(input))
}

// easy 1 · medium 2 · hard 3 — the placement bank's `diff` scale (the skill model uses it).
export const diffNumber = (d: Difficulty | null | undefined): 1 | 2 | 3 => (d === 'easy' ? 1 : d === 'hard' ? 3 : 2)

// The skill an exercise of a language course trains:
//   [!word] → vocabulary · [!listen] → listening · [!speak] / [!pair] → pronunciation; other quizzes and cards — by the
//   topic kind: grammar → grammar, vocabulary → vocabulary, pronunciation → pronunciation, listening → listening,
//   skills → reading (reading and writing texts), review / none → grammar. An explicit valid `skill:` wins.
export function exerciseSkill(unit: LearningUnit, kind: ExerciseKind, topicKind: TopicKind | undefined): LearnerSkill {
  if (unit.kind === 'quiz' && unit.skill && (LEARNER_SKILLS as readonly string[]).includes(unit.skill)) return unit.skill as LearnerSkill
  if (kind === 'word') return 'vocabulary'
  if (kind === 'listen') return 'listening'
  if (kind === 'speak' || kind === 'pair') return 'pronunciation'
  switch (topicKind) {
    case 'vocabulary':
      return 'vocabulary'
    case 'pronunciation':
      return 'pronunciation'
    case 'listening':
      return 'listening'
    case 'skills':
      return 'reading'
    default:
      return 'grammar'
  }
}

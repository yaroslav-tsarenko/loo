import type { Root, RootContent, PhrasingContent } from 'mdast'
import { levelLabel } from '@/game/evolution'

export const LEVELS = ['junior', 'middle', 'senior', 'techlead'] as const
export type Level = (typeof LEVELS)[number]

// Shown as the matching IT rank (src/game/evolution.ts): junior → Junior … techlead → Staff.
export const LEVEL_LABEL: Record<Level, string> = {
  junior: levelLabel('junior'),
  middle: levelLabel('middle'),
  senior: levelLabel('senior'),
  techlead: levelLabel('techlead'),
}

export const FREQUENCIES = ['рідко', 'іноді', 'часто', 'дуже часто'] as const
export type Frequency = (typeof FREQUENCIES)[number]

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Легка',
  medium: 'Середня',
  hard: 'Складна',
}

export interface Heading {
  depth: number
  text: string
  slug: string
}

export interface ChapterMeta {
  title?: string
  order?: number
  level?: Level
  tags: string[]
  prerequisites: string[]
  estimatedMinutes?: number
  id?: string
  kind?: 'qa'
  slug?: string
  description?: string
  guide?: string
  icon?: string
  // Guide index only: path stages, e.g. "🧱 Ядро мови: 1-7" (the emoji is mapped to an icon ref).
  parts?: string[]
}

export type ChapterKind = 'chapter' | 'index' | 'overview'

export interface Chapter {
  id: string
  guideId: string
  path: string
  slug: string[]
  title: string
  number: number | null
  kind: ChapterKind
  level: Level | null
  tags: string[]
  prerequisiteRefs: string[]
  prerequisites: string[]
  estimatedMinutes: number
  unitIds: string[]
  outgoingLinks: string[]
  birthtimeMs: number
  mtimeMs: number
  description: string | null
  icon: string | null
}

export type TreeNode =
  | { kind: 'group'; id: string; title: string; overviewId: string | null; children: TreeNode[] }
  | { kind: 'chapter'; id: string }

export interface Guide {
  id: string
  dir: string
  title: string
  description: string | null
  order: number
  level: Level | null
  tags: string[]
  prerequisites: string[]
  estimatedMinutes: number
  indexChapterId: string | null
  tree: TreeNode[]
  chapterIds: string[]
  parts: GuidePart[]
  icon: string | null
}

export interface GuidePart {
  // icon ref (src/content/icons.ts)
  icon: string | null
  title: string
  from: number
  to: number
}

export type UnitKind = 'flashcard' | 'quiz' | 'task'
export type IdSource = 'explicit' | 'hash'

interface UnitBase {
  id: string
  kind: UnitKind
  guideId: string
  chapterId: string
  sectionSlug: string | null
  level: Level | null
  tags: string[]
  idSource: IdSource
  searchText: string
}

export interface FlashcardUnit extends UnitBase {
  kind: 'flashcard'
  frequency: string | null
  qtype: string | null
  question: PhrasingContent[]
  questionText: string
  answer: Root
  origin: 'callout' | 'heading' | 'json'
}

export type QuizMode = 'single' | 'multi' | 'output' | 'order' | 'fill'

// Parsons problem: pieces in the correct order; distractors stay where the author wrote them
export interface OrderPiece {
  id: string
  code: string
  distractor: boolean
}

export interface OrderExercise {
  kind: 'order'
  lang: string | null
  pieces: OrderPiece[]
}

export type FillSegment = { kind: 'text'; value: string } | { kind: 'blank'; id: string; answers: string[] }

export interface FillExercise {
  kind: 'fill'
  lang: string | null
  segments: FillSegment[]
  // null → free inputs; otherwise chips (answers + extra distractor words)
  bank: string[] | null
}

export type QuizExercise = OrderExercise | FillExercise

export interface QuizOption {
  id: string
  content: PhrasingContent[]
  correct: boolean
}

export interface QuizUnit extends UnitBase {
  kind: 'quiz'
  mode: QuizMode
  prompt: PhrasingContent[]
  promptText: string
  body: Root
  options: QuizOption[]
  freeAnswer: string | null
  explanation: Root | null
  exercise: QuizExercise | null
}

export interface TaskUnit extends UnitBase {
  kind: 'task'
  difficulty: Difficulty
  title: PhrasingContent[]
  titleText: string
  statement: Root
  hints: Root[]
  solution: Root | null
  // Auto-tested coding task: ```js starter / ```js tests fences
  code: TaskCode | null
}

export interface TaskCode {
  lang: string
  starter: string
  tests: string | null
}

export type LearningUnit = FlashcardUnit | QuizUnit | TaskUnit

export interface ContentIssue {
  severity: 'warning' | 'error'
  code: 'missing-id' | 'duplicate-id' | 'broken-link' | 'quiz-no-correct' | 'task-no-solution' | 'exercise-invalid' | 'prerequisite-cycle' | 'parse-error' | 'unknown-block'
  path: string
  message: string
}

export type BlockNodeContent = RootContent

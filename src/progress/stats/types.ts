// Inputs of the statistics engine: plain per-user aggregates the server computes in SQL (src/server/stats/).
// Pure types — no DB, no React. Days are study-day keys `YYYY-MM-DD` (src/progress/day.ts).

import type { QuizMode } from '@/content/model'

export type AttemptKind = 'flashcard' | 'quiz' | 'task'
export type TaskDifficulty = 'easy' | 'medium' | 'hard'

// Speed is compared like with like: quizzes per mode («що виведе код» is slower than a single choice), cards, tasks.
export type SpeedGroup = 'flashcard' | 'task' | 'quiz' | `quiz:${QuizMode}`

// today · recent = the 14 days before today · previous = the 14 days before those
export type SpeedWindow = 'today' | 'recent' | 'previous'

export interface DayRow {
  day: string
  total: number
  correct: number
  cards: number
  quizzes: number
  tasks: number
  xp: number
  timeMs: number
  goalMet: boolean
}

export interface KindRow {
  kind: AttemptKind
  total: number
  correct: number
  ms: number
}

export interface LevelRow {
  // content level (junior · middle · senior · techlead) or null for unlevelled items
  level: string | null
  total: number
  correct: number
  // distinct items answered correctly at least once
  solved: number
}

export interface SpeedRow {
  group: SpeedGroup
  window: SpeedWindow
  medianMs: number
  n: number
}

export interface SpeedDayRow {
  day: string
  medianMs: number
  n: number
}

export interface TopicRow {
  chapterId: string
  total: number
  correct: number
  // open (unresolved) mistakes in the chapter
  open: number
}

export interface TaskRow {
  unitId: string
  difficulty: TaskDifficulty | null
  solved: boolean
  // the very first attempt was a solve
  firstTry: boolean
}

export interface MemoryRow {
  // FSRS cards the learner has reviewed at least once
  cards: number
  // in the Review state (graduated from learning)
  reviewing: number
  // Review state with stability ≥ 21 days: long-term memory
  longTerm: number
  // due by the end of today (incl. overdue): «fading today»
  dueToday: number
  lapses: number
}

export interface ResultsRow {
  testsPassed: number
  testsPerfect: number
  examsPassed: number
  testedOut: number
  lessonsDone: number
  perfectLessons: number
  // epoch ms of the most recent first completion of a lesson
  lastNewLessonAt: number | null
}

export interface DayRecord {
  day: string
  value: number
}

export interface RecordsRow {
  bestDayXp: DayRecord | null
  bestDayAnswers: DayRecord | null
  // longest run of consecutive correct answers (any kind)
  longestCombo: number
  // fastest lesson finished without a single mistake (≥ 3 answers)
  fastestPerfectLessonMs: number | null
}

export interface StatsAggregates {
  today: string
  xp: number
  // days with activity in the last HEAT_DAYS days (sparse)
  days: DayRow[]
  // every day the daily goal was met (streaks)
  goalDays: string[]
  kinds: KindRow[]
  levels: LevelRow[]
  speed: SpeedRow[]
  // questions (quizzes) only, the last 30 days (sparse)
  speedDaily: SpeedDayRow[]
  topics: TopicRow[]
  tasks: TaskRow[]
  memory: MemoryRow
  results: ResultsRow
  records: RecordsRow
  // article reading time (chapter_progress) — not split per day
  readingMs: number
}

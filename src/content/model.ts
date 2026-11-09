import type { Root, RootContent, PhrasingContent } from 'mdast'
import { CEFR_LEVELS, levelLabel } from '@/game/evolution'

// Content difficulty: the legacy IT levels of programming guides, plus CEFR (A1…C2) for language guides.
export const IT_CONTENT_LEVELS = ['junior', 'middle', 'senior', 'techlead'] as const
export const LEVELS = [...IT_CONTENT_LEVELS, ...CEFR_LEVELS] as const
export type Level = (typeof LEVELS)[number]

// Shown as the matching IT rank (src/game/evolution.ts): junior → Junior … techlead → Staff; CEFR: «A1 · Початковий».
export const LEVEL_LABEL = Object.fromEntries(LEVELS.map((l) => [l, levelLabel(l)])) as Record<Level, string>

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
  // placement-test bank file (`<Guide>/_placement/B2.md`, docs/LANGUAGE_COURSE.md): not theory, never a chapter
  placement?: boolean
  // courses with skills (course.yaml `skills`): the topic's main skill id
  skill?: string
  // a translation (`<Guide>/_i18n/<lang>/…`, docs/COURSE_FORMAT.md «Переклад»): its language and the source topic id
  lang?: string
  source?: string
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
  // frontmatter `skill:` (courses with skills, docs/COURSE_FORMAT.md §3); absent when not set
  skill?: string
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
  // [!word] card (language courses)
  word?: WordSpec
  // spoken language of a language block (`lang:` meta, BCP 47); default — the course's `target`
  lang?: string
}

// listen / pair / speak — language blocks [!listen] [!pair] [!speak] (docs/LANGUAGE_COURSE.md, src/content/blocks/lang)
export type QuizMode = 'single' | 'multi' | 'output' | 'order' | 'fill' | 'listen' | 'pair' | 'speak'

// ── Language blocks ──────────────────────────────────────────────────────────────────────────────────────────

// One spoken line; dialogues alternate voices by speaker («audio: A: Where are you from?»).
export interface AudioLine {
  speaker: string | null
  text: string
}

export type ListenType = 'choice' | 'dictation' | 'answer' | 'fill'

// [!listen]: what is played. The text reaches the browser only when the learner presses play (browser TTS needs it);
// graded payloads never carry it or the right option (src/server/actions/speech.ts).
export interface ListenSpec {
  type: ListenType
  lines: AudioLine[]
  slow: boolean
  // dictation: extra accepted transcriptions (`accept: a | b`)
  accept: string[]
}

export interface PairWord {
  word: string
  ipa: string | null
}

// [!pair]: two words that differ in one sound; the learner hears `say` and picks it (options a / b).
export interface PairSpec {
  words: [PairWord, PairWord]
  say: string
  tip: string | null
}

// [!speak]: say `text` aloud; the browser recognises it, the server compares word by word (blocks/lang/grade.ts).
export interface SpeakSpec {
  text: string
  ipa: string | null
  ipaUs: string | null
  tip: string | null
  translation: string | null
  slow: boolean
}

export interface WordExample {
  en: string
  // translation (the instruction language)
  tr: string | null
  // words the author bolded in the example (the headword in context)
  bold: string[]
}

// [!word]: an SRS card — front: word + audio + IPA; back: translation, examples, forms.
export interface WordSpec {
  word: string
  ipa: string | null
  ipaUs: string | null
  pos: string | null
  translations: string[]
  examples: WordExample[]
  forms: string | null
  note: string | null
}

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
  // language blocks: mode 'listen' / 'pair' / 'speak'
  listen?: ListenSpec
  pair?: PairSpec
  speak?: SpeakSpec
  lang?: string
  // placement bank items (`skill: grammar · diff: 2` in the meta line): the skill measured and the difficulty
  // inside the level (1 easy … 3 on the edge of the next one) — docs/LANGUAGE_COURSE.md «Банк вступного тесту»
  skill?: string
  diff?: number
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

// What the resident index keeps of a unit (docs/fullstack/stage1/01-storage.md): enough to filter, count and list
// units without their bodies. `label` is unitLabel(unit), precomputed.
interface UnitMetaBase {
  id: string
  guideId: string
  chapterId: string
  level: Level | null
  idSource: IdSource
  // unitLabel(unit): at most 240 characters; also the title of a task in lists
  label: string
  lang?: string
}

export interface FlashcardMeta extends UnitMetaBase {
  kind: 'flashcard'
  frequency: string | null
  qtype: string | null
  // a [!word] card
  hasWord: boolean
}

export interface QuizMeta extends UnitMetaBase {
  kind: 'quiz'
  mode: QuizMode
}

export interface TaskMeta extends UnitMetaBase {
  kind: 'task'
  difficulty: Difficulty
  // an auto-tested coding task
  hasTests: boolean
}

export type UnitMeta = FlashcardMeta | QuizMeta | TaskMeta

// A reel without its body (the feed samples these, then loads the bodies it shows)
export interface ReelMeta {
  id: string
  guideId: string
  chapterId: string
  sectionSlug: string | null
  title: string
}

export interface ContentIssue {
  severity: 'warning' | 'error'
  code: 'missing-id' | 'duplicate-id' | 'broken-link' | 'quiz-no-correct' | 'task-no-solution' | 'exercise-invalid' | 'block-warning' | 'prerequisite-cycle' | 'parse-error' | 'unknown-block' | 'i18n'
  path: string
  message: string
}

export type BlockNodeContent = RootContent

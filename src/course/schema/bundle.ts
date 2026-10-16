import { z } from 'zod'
import { LevelSchema } from './level'
import { AuthorSchema, SectionKindSchema } from './manifest'
import { CourseKindSchema, PracticeSectionIdSchema } from './practice'

// CourseBundle — compiled, self-contained JSON of one course version (content/courses/<id>.json).
// Exercise bodies stay in the content store; the bundle holds structure and references only.

export const BUNDLE_FORMAT = 1

// word / listen / speak / pair — language blocks (docs/LANGUAGE_COURSE.md): a flashcard / quizzes for the engine,
// their own kinds for lessons, test pools, placement and practice sections.
export const ExerciseKindSchema = z.enum(['quiz', 'flashcard', 'interview', 'task', 'word', 'listen', 'speak', 'pair'])
export type ExerciseKind = z.infer<typeof ExerciseKindSchema>

export const LevelSourceSchema = z.enum(['exercise', 'topic', 'section', 'default'])

// What a language topic mainly trains (the topic's first kind tag: ENGLISH_SYLLABUS `tags: [english, a1, grammar, …]`).
// Programming topics have none.
export const TOPIC_KINDS = ['grammar', 'vocabulary', 'pronunciation', 'listening', 'skills', 'review'] as const
export const TopicKindSchema = z.enum(TOPIC_KINDS)
export type TopicKind = z.infer<typeof TopicKindSchema>

// Skills of a language learner: the four the placement bank measures plus pronunciation ([!speak] / [!pair]).
// Every exercise of a language course trains one of them (src/course/compile/difficulty.ts → exerciseSkill).
export const LEARNER_SKILLS = ['grammar', 'vocabulary', 'reading', 'listening', 'pronunciation'] as const
export const LearnerSkillSchema = z.enum(LEARNER_SKILLS)
export type LearnerSkill = z.infer<typeof LearnerSkillSchema>

export const ExerciseRefSchema = z.object({
  id: z.string(),
  kind: ExerciseKindSchema,
  // quiz: single | multi | output | order | fill
  mode: z.string().nullable(),
  level: LevelSchema,
  levelSource: LevelSourceSchema,
  tags: z.array(z.string()),
  // section, chapter and guide come from the topic
  topicId: z.string(),
  // document order inside the topic
  position: z.number().int(),
  // easy | medium | hard inside the exercise's level: authored for tasks, derived at compile time for everything else
  // (src/course/compile/difficulty.ts); null only in bundles compiled before it existed
  difficulty: z.enum(['easy', 'medium', 'hard']).nullable(),
  // language courses: the skill it trains (absent: programming courses, older bundles)
  skill: LearnerSkillSchema.optional(),
  autoTested: z.boolean(),
  minutes: z.number(),
})
export type ExerciseRef = z.infer<typeof ExerciseRefSchema>

export const ReelRefSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  emoji: z.string().nullable(),
  title: z.string(),
})
export type ReelRef = z.infer<typeof ReelRefSchema>

export const LessonKindSchema = z.enum(['theory', 'start', 'core', 'cards', 'code', 'interview'])
export type LessonKind = z.infer<typeof LessonKindSchema>

export const LessonItemSchema = z.object({ kind: z.enum(['unit', 'reel']), id: z.string() })
export type LessonItem = z.infer<typeof LessonItemSchema>

export const LessonSchema = z.object({
  // <course>:<section>:<topic>:<kind>-<n>
  id: z.string(),
  // <chapterId>::<kind>-<n> — id of the same lesson in the pre-course generator (src/content/lessons.ts)
  legacyId: z.string(),
  topicId: z.string(),
  index: z.number().int(),
  kind: LessonKindSchema,
  n: z.number().int(),
  // icon ref (src/content/icons.ts), e.g. px:microscope
  icon: z.string(),
  title: z.string(),
  items: z.array(LessonItemSchema),
  minutes: z.number(),
  level: LevelSchema,
})
export type Lesson = z.infer<typeof LessonSchema>

export const TopicTestSchema = z.object({
  id: z.string(),
  questions: z.number().int(),
  pass: z.number(),
  // auto-graded quizzes; self-graded cards only top up a thin pool
  pool: z.array(z.string()),
  fallback: z.array(z.string()),
})
export type TopicTest = z.infer<typeof TopicTestSchema>

export const SectionExamSchema = z.object({
  id: z.string(),
  questions: z.number().int(),
  pass: z.number(),
  testOut: z.boolean(),
  // per topic, so the exam can be stratified
  pool: z.record(z.string(), z.array(z.string())),
  fallback: z.array(z.string()),
})
export type SectionExam = z.infer<typeof SectionExamSchema>

export const TopicSchema = z.object({
  // <course>:<section>:<topic>
  id: z.string(),
  key: z.string(),
  sectionId: z.string(),
  index: z.number().int(),
  chapterId: z.string(),
  guideId: z.string(),
  title: z.string(),
  number: z.number().nullable(),
  icon: z.string().nullable(),
  level: LevelSchema,
  tags: z.array(z.string()),
  // language courses: grammar | vocabulary | pronunciation | listening | skills | review (absent: no kind tag)
  kind: TopicKindSchema.optional(),
  minutes: z.number(),
  // all exercises of the topic, document order
  exercises: z.array(z.string()),
  reels: z.array(z.string()),
  lessons: z.array(LessonSchema),
  test: TopicTestSchema.nullable(),
})
export type Topic = z.infer<typeof TopicSchema>

export const SectionSchema = z.object({
  // <course>:<section>
  id: z.string(),
  key: z.string(),
  index: z.number().int(),
  kind: SectionKindSchema,
  title: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  guideId: z.string(),
  guideDir: z.string(),
  // hardest topic level: placement treats the section as known only up to it
  level: LevelSchema,
  minLevel: LevelSchema,
  minutes: z.number(),
  topics: z.array(TopicSchema),
  exam: SectionExamSchema.nullable(),
  // planned: on the path as «скоро» — no topics yet (course.yaml sections[].status)
  status: z.enum(['active', 'planned']).optional(),
})
export type Section = z.infer<typeof SectionSchema>

// Skills a placement bank measures (docs/LANGUAGE_COURSE.md «Банк вступного тесту»).
export const PLACEMENT_SKILLS = ['grammar', 'vocabulary', 'reading', 'listening'] as const
export const PlacementSkillSchema = z.enum(PLACEMENT_SKILLS)
export type PlacementSkill = z.infer<typeof PlacementSkillSchema>

// One calibrated bank question: its level, the skill it measures, the difficulty inside the level (1 easy … 3 on the
// edge of the next level) and the number of options (the chance of a blind guess is 1 / options).
export const PlacementItemSchema = z.object({
  level: LevelSchema,
  skill: PlacementSkillSchema,
  diff: z.number().int().min(1).max(3),
  options: z.number().int().min(2),
})
export type PlacementItem = z.infer<typeof PlacementItemSchema>

export const PlacementPoolSchema = z.object({
  enabled: z.boolean(),
  maxQuestions: z.number().int(),
  perLevel: z.number().int(),
  // the course's ladder only (noob…god or A1…C2)
  pool: z.partialRecord(LevelSchema, z.array(z.string())),
  // bank mode (a `_placement/` bank exists): pool = the bank's ids per level, `bank` — their metadata; the adaptive
  // algorithm with skills, guessing protection and confidence (src/course/select/placement.ts). Absent → lesson quizzes.
  bank: z.record(z.string(), PlacementItemSchema).optional(),
  pass: z.number().optional(),
  followUp: z.number().int().optional(),
})
export type PlacementPool = z.infer<typeof PlacementPoolSchema>

export const CourseStatsSchema = z.object({
  sections: z.number().int(),
  topics: z.number().int(),
  lessons: z.number().int(),
  exercises: z.number().int(),
  quizzes: z.number().int(),
  flashcards: z.number().int(),
  interview: z.number().int(),
  tasks: z.number().int(),
  autoTestedTasks: z.number().int(),
  reels: z.number().int(),
  topicTests: z.number().int(),
  sectionExams: z.number().int(),
  minutes: z.number(),
  hours: z.number(),
  byLevel: z.partialRecord(LevelSchema, z.number().int()),
  // language blocks (optional for bundles compiled before them)
  words: z.number().int().optional(),
  listening: z.number().int().optional(),
  speaking: z.number().int().optional(),
  pairs: z.number().int().optional(),
})
export type CourseStats = z.infer<typeof CourseStatsSchema>

export const CourseMetaSchema = z.object({
  id: z.string(),
  version: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  subject: z.string(),
  // optional: bundles compiled before they existed resolve via courseKind() / coursePractice() (schema/practice.ts)
  kind: CourseKindSchema.optional(),
  practice: z.array(PracticeSectionIdSchema).optional(),
  language: z.string(),
  // language courses: the language being learned (BCP 47), for speech; absent → `language`
  target: z.string().optional(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  cover: z.string().nullable(),
  levels: z.array(LevelSchema),
  tags: z.array(z.string()),
  authors: z.array(AuthorSchema),
  license: z.string().nullable(),
  estimatedHours: z.number(),
})
export type CourseMeta = z.infer<typeof CourseMetaSchema>

export const CourseBundleSchema = z.object({
  format: z.literal(BUNDLE_FORMAT),
  course: CourseMetaSchema,
  exams: z.object({
    topic: z.object({ questions: z.number(), pass: z.number() }),
    section: z.object({ questions: z.number(), pass: z.number(), testOut: z.boolean() }),
  }),
  sections: z.array(SectionSchema),
  // guide ids of the sidebar «Теорія», in order (optional for older bundles → courseTheory())
  theory: z.array(z.string()).optional(),
  exercises: z.record(z.string(), ExerciseRefSchema),
  reels: z.record(z.string(), ReelRefSchema),
  placement: PlacementPoolSchema,
  icons: z.array(z.string()),
  stats: CourseStatsSchema,
})
export type CourseBundle = z.infer<typeof CourseBundleSchema>

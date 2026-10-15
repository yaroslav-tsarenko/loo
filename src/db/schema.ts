import { bigint, boolean, doublePrecision, index, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core'

// Timestamps are epoch milliseconds (bigint in Postgres, number in JS).
const ms = (name: string) => bigint(name, { mode: 'number' })

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
})

export const units = pgTable(
  'units',
  {
    id: text('id').primaryKey(),
    kind: text('kind', { enum: ['flashcard', 'quiz', 'task'] }).notNull(),
    guideId: text('guide_id').notNull(),
    chapterId: text('chapter_id').notNull(),
    level: text('level'),
    frequency: text('frequency'),
    qtype: text('qtype'),
    label: text('label').notNull(),
    idSource: text('id_source', { enum: ['explicit', 'hash'] }).notNull(),
    firstSeen: ms('first_seen').notNull(),
    lastSeen: ms('last_seen').notNull(),
    missingSince: ms('missing_since'),
  },
  (t) => [index('units_chapter_idx').on(t.guideId, t.chapterId)],
)

export const unitAliases = pgTable('unit_aliases', {
  oldId: text('old_id').primaryKey(),
  newId: text('new_id').notNull(),
  reason: text('reason').notNull(),
  createdAt: ms('created_at').notNull(),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  mode: text('mode', { enum: ['flashcards', 'quiz', 'tasks', 'mistakes', 'feed', 'mission', 'lesson'] }).notNull(),
  filters: jsonb('filters').notNull(),
  unitIds: jsonb('unit_ids').$type<string[]>().notNull(),
  startedAt: ms('started_at').notNull(),
  endedAt: ms('ended_at'),
  total: integer('total').notNull().default(0),
  correct: integer('correct').notNull().default(0),
  xp: integer('xp').notNull().default(0),
})

export const attempts = pgTable(
  'attempts',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    unitId: text('unit_id').notNull(),
    sessionId: text('session_id'),
    kind: text('kind', { enum: ['flashcard', 'quiz', 'task'] }).notNull(),
    outcome: text('outcome', { enum: ['again', 'hard', 'good', 'correct', 'wrong', 'solved', 'failed'] }).notNull(),
    correct: boolean('correct').notNull(),
    level: text('level'),
    guideId: text('guide_id').notNull(),
    chapterId: text('chapter_id').notNull(),
    hintsUsed: integer('hints_used').notNull().default(0),
    durationMs: integer('duration_ms').notNull().default(0),
    xp: integer('xp').notNull().default(0),
    answeredAt: ms('answered_at').notNull(),
    day: text('day').notNull(),
  },
  (t) => [index('attempts_unit_idx').on(t.unitId, t.answeredAt), index('attempts_time_idx').on(t.answeredAt), index('attempts_day_idx').on(t.day)],
)

export const srsCards = pgTable(
  'srs_cards',
  {
    unitId: text('unit_id').primaryKey(),
    due: ms('due').notNull(),
    stability: doublePrecision('stability').notNull(),
    difficulty: doublePrecision('difficulty').notNull(),
    elapsedDays: doublePrecision('elapsed_days').notNull(),
    scheduledDays: doublePrecision('scheduled_days').notNull(),
    learningSteps: integer('learning_steps').notNull().default(0),
    reps: integer('reps').notNull(),
    lapses: integer('lapses').notNull(),
    state: integer('state').notNull(),
    lastReview: ms('last_review'),
  },
  (t) => [index('srs_due_idx').on(t.due)],
)

export const mistakes = pgTable('mistakes', {
  unitId: text('unit_id').primaryKey(),
  source: text('source', { enum: ['flashcard', 'quiz', 'task'] }).notNull(),
  wrongCount: integer('wrong_count').notNull(),
  correctStreak: integer('correct_streak').notNull(),
  lastCorrectAt: ms('last_correct_at'),
  firstWrongAt: ms('first_wrong_at').notNull(),
  lastWrongAt: ms('last_wrong_at').notNull(),
  resolvedAt: ms('resolved_at'),
})

export const chapterProgress = pgTable('chapter_progress', {
  chapterId: text('chapter_id').primaryKey(),
  guideId: text('guide_id').notNull(),
  status: text('status', { enum: ['unread', 'reading', 'studied'] }).notNull(),
  scrollPct: integer('scroll_pct').notNull().default(0),
  timeMs: integer('time_ms').notNull().default(0),
  studiedAt: ms('studied_at'),
  lastOpenedAt: ms('last_opened_at').notNull(),
})

export const taskState = pgTable('task_state', {
  unitId: text('unit_id').primaryKey(),
  hintsRevealed: integer('hints_revealed').notNull().default(0),
  draft: text('draft').notNull().default(''),
  status: text('status', { enum: ['open', 'solved', 'failed'] }).notNull().default('open'),
  updatedAt: ms('updated_at').notNull(),
})

export const xpLedger = pgTable(
  'xp_ledger',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    amount: integer('amount').notNull(),
    reason: text('reason').notNull(),
    refId: text('ref_id'),
    createdAt: ms('created_at').notNull(),
    day: text('day').notNull(),
  },
  (t) => [index('xp_day_idx').on(t.day)],
)

export const achievements = pgTable('achievements', {
  id: text('id').primaryKey(),
  unlockedAt: ms('unlocked_at').notNull(),
  context: jsonb('context'),
})

export const dailyActivity = pgTable('daily_activity', {
  day: text('day').primaryKey(),
  cards: integer('cards').notNull().default(0),
  quizzes: integer('quizzes').notNull().default(0),
  tasks: integer('tasks').notNull().default(0),
  correct: integer('correct').notNull().default(0),
  total: integer('total').notNull().default(0),
  xp: integer('xp').notNull().default(0),
  timeMs: integer('time_ms').notNull().default(0),
  goalMet: boolean('goal_met').notNull().default(false),
})

// Daily mission: a plan generated once per day from the time budget, steps ticked off as they are done.
export const dailyMissions = pgTable('daily_missions', {
  day: text('day').primaryKey(),
  budgetMinutes: integer('budget_minutes').notNull(),
  plan: jsonb('plan').notNull(),
  progress: jsonb('progress').notNull().default({}),
  completedAt: ms('completed_at'),
  createdAt: ms('created_at').notNull(),
})

// Micro-facts ([!reel]) seen / liked in the feed.
export const reelState = pgTable('reel_state', {
  reelId: text('reel_id').primaryKey(),
  views: integer('views').notNull().default(0),
  liked: boolean('liked').notNull().default(false),
  saved: boolean('saved').notNull().default(false),
  lastSeenAt: ms('last_seen_at'),
})

// Daily JavaScript news / tips pulled from community sources by a cron job.
export const newsItems = pgTable(
  'news_items',
  {
    id: text('id').primaryKey(),
    source: text('source').notNull(),
    title: text('title').notNull(),
    url: text('url').notNull(),
    summary: text('summary'),
    author: text('author'),
    score: integer('score').notNull().default(0),
    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    publishedAt: ms('published_at').notNull(),
    fetchedAt: ms('fetched_at').notNull(),
    readAt: ms('read_at'),
    saved: boolean('saved').notNull().default(false),
  },
  (t) => [index('news_published_idx').on(t.publishedAt)],
)

// Duolingo-style lessons (derived from chapter content): best result per lesson.
export const lessonProgress = pgTable(
  'lesson_progress',
  {
    lessonId: text('lesson_id').primaryKey(),
    guideId: text('guide_id').notNull(),
    chapterId: text('chapter_id').notNull(),
    completions: integer('completions').notNull().default(0),
    bestAccuracy: doublePrecision('best_accuracy').notNull().default(0),
    lastXp: integer('last_xp').notNull().default(0),
    firstCompletedAt: ms('first_completed_at'),
    lastCompletedAt: ms('last_completed_at'),
  },
  (t) => [index('lesson_chapter_idx').on(t.chapterId)],
)

// AI-generated micro-facts for the feed (daily cron), shown next to [!reel] blocks from the guides.
export const generatedReels = pgTable(
  'generated_reels',
  {
    id: text('id').primaryKey(),
    emoji: text('emoji').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    topic: text('topic').notNull(),
    guideId: text('guide_id'),
    chapterId: text('chapter_id'),
    sourceUrl: text('source_url'),
    sourceTitle: text('source_title'),
    model: text('model').notNull(),
    status: text('status', { enum: ['active', 'hidden'] }).notNull().default('active'),
    createdAt: ms('created_at').notNull(),
  },
  (t) => [index('generated_reels_created_idx').on(t.createdAt)],
)

// Fixed-window counters for rate limits (login attempts, expensive actions). Key = "<scope>:<subject>".
export const rateLimits = pgTable(
  'rate_limits',
  {
    key: text('key').primaryKey(),
    count: integer('count').notNull(),
    resetAt: ms('reset_at').notNull(),
  },
  (t) => [index('rate_limits_reset_idx').on(t.resetAt)],
)

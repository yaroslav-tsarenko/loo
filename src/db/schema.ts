import { sql } from 'drizzle-orm'
import { bigint, boolean, doublePrecision, index, integer, jsonb, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

// Timestamps are epoch milliseconds (bigint in Postgres, number in JS).
const ms = (name: string) => bigint(name, { mode: 'number' })

// ─── Users ────────────────────────────────────────────────────────────────────
// Multi-user model (docs/SECURITY.md §4): every per-user table has `user_id`, part of its primary key,
// referencing profiles(id) with ON DELETE CASCADE. profiles.id = auth.users.id on Supabase (a trigger on
// auth.users removes the profile, and with it all progress). On PGlite there is no auth schema.

export type ProfileRole = 'user' | 'admin'

export interface OnboardingState {
  completedAt?: number
  // coarse goal (GOALS: job | grow | school | fun), derived from `purpose`
  goal?: string
  // first sign-in wizard answers (src/server/services/preferences.ts PURPOSES / ROLES)
  purpose?: string
  role?: string
  // «Хочу це» votes for directions / courses that are not there yet (src/course/catalog-soon.ts WISH_IDS)
  wishes?: string[]
  // Placement test result, filled by the course engine later (/placement).
  placement?: { level: string; at: number }
}

// Learning preferences. App settings (theme, sound, haptics, daily minutes, goals) live in user_settings.
export interface ProfilePreferences {
  interests?: string[]
  level?: string
}

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  locale: text('locale').notNull().default('uk'),
  // Set only by server code (column grants keep it read-only for the `authenticated` role).
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  onboarding: jsonb('onboarding').$type<OnboardingState>().notNull().default({}),
  preferences: jsonb('preferences').$type<ProfilePreferences>().notNull().default({}),
  createdAt: ms('created_at').notNull(),
  updatedAt: ms('updated_at').notNull(),
  // Ban (admin area, docs/ADMIN.md): set → signed-in pages and actions are refused. Not in the learner's column grants.
  bannedAt: ms('banned_at'),
  banReason: text('ban_reason'),
})

const userId = () =>
  uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' })

// Per-user settings (theme, sound, goals…). Global/internal state lives in system_state.
export const userSettings = pgTable(
  'user_settings',
  {
    userId: userId(),
    key: text('key').notNull(),
    value: jsonb('value').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] })],
)

// Server-only state (cooldowns, content fingerprint, local vault path). Never writable by users.
export const systemState = pgTable('system_state', {
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

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: userId(),
    mode: text('mode', { enum: ['flashcards', 'quiz', 'tasks', 'mistakes', 'feed', 'mission', 'lesson'] }).notNull(),
    filters: jsonb('filters').notNull(),
    unitIds: jsonb('unit_ids').$type<string[]>().notNull(),
    startedAt: ms('started_at').notNull(),
    endedAt: ms('ended_at'),
    total: integer('total').notNull().default(0),
    correct: integer('correct').notNull().default(0),
    xp: integer('xp').notNull().default(0),
  },
  (t) => [index('sessions_user_idx').on(t.userId, t.startedAt)],
)

export const attempts = pgTable(
  'attempts',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    userId: userId(),
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
  (t) => [
    index('attempts_user_unit_idx').on(t.userId, t.unitId, t.answeredAt),
    index('attempts_user_day_idx').on(t.userId, t.day),
    index('attempts_user_id_idx').on(t.userId, t.id),
    // the leading run of correct answers at one level (leadingRead, src/server/services/progress.ts): the last 200 of
    // that level without scanning the learner's whole history
    index('attempts_user_level_id_idx').on(t.userId, t.level, t.id),
    // docs/PERFORMANCE.md: per-kind / per-outcome counts on every answer (achievement metrics) as index-only scans,
    // and a lesson's answers by session (completeLesson, «Робота над помилками» activity)
    index('attempts_user_kind_outcome_idx').on(t.userId, t.kind, t.outcome),
    index('attempts_user_session_idx').on(t.userId, t.sessionId).where(sql`${t.sessionId} is not null`),
  ],
)

export const srsCards = pgTable(
  'srs_cards',
  {
    userId: userId(),
    unitId: text('unit_id').notNull(),
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
  (t) => [primaryKey({ columns: [t.userId, t.unitId] }), index('srs_user_due_idx').on(t.userId, t.due)],
)

export const mistakes = pgTable(
  'mistakes',
  {
    userId: userId(),
    unitId: text('unit_id').notNull(),
    source: text('source', { enum: ['flashcard', 'quiz', 'task'] }).notNull(),
    wrongCount: integer('wrong_count').notNull(),
    correctStreak: integer('correct_streak').notNull(),
    lastCorrectAt: ms('last_correct_at'),
    firstWrongAt: ms('first_wrong_at').notNull(),
    lastWrongAt: ms('last_wrong_at').notNull(),
    resolvedAt: ms('resolved_at'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.unitId] })],
)

export const chapterProgress = pgTable(
  'chapter_progress',
  {
    userId: userId(),
    chapterId: text('chapter_id').notNull(),
    guideId: text('guide_id').notNull(),
    status: text('status', { enum: ['unread', 'reading', 'studied'] }).notNull(),
    scrollPct: integer('scroll_pct').notNull().default(0),
    timeMs: integer('time_ms').notNull().default(0),
    studiedAt: ms('studied_at'),
    lastOpenedAt: ms('last_opened_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.chapterId] })],
)

export const taskState = pgTable(
  'task_state',
  {
    userId: userId(),
    unitId: text('unit_id').notNull(),
    hintsRevealed: integer('hints_revealed').notNull().default(0),
    draft: text('draft').notNull().default(''),
    status: text('status', { enum: ['open', 'solved', 'failed'] }).notNull().default('open'),
    updatedAt: ms('updated_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.unitId] })],
)

export const xpLedger = pgTable(
  'xp_ledger',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    userId: userId(),
    amount: integer('amount').notNull(),
    reason: text('reason').notNull(),
    refId: text('ref_id'),
    createdAt: ms('created_at').notNull(),
    day: text('day').notNull(),
  },
  (t) => [index('xp_user_day_idx').on(t.userId, t.day), index('xp_user_created_idx').on(t.userId, t.createdAt), index('xp_user_reason_day_idx').on(t.userId, t.reason, t.day)],
)

export const achievements = pgTable(
  'achievements',
  {
    userId: userId(),
    id: text('id').notNull(),
    unlockedAt: ms('unlocked_at').notNull(),
    context: jsonb('context'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.id] })],
)

export const dailyActivity = pgTable(
  'daily_activity',
  {
    userId: userId(),
    day: text('day').notNull(),
    cards: integer('cards').notNull().default(0),
    quizzes: integer('quizzes').notNull().default(0),
    tasks: integer('tasks').notNull().default(0),
    correct: integer('correct').notNull().default(0),
    total: integer('total').notNull().default(0),
    xp: integer('xp').notNull().default(0),
    timeMs: integer('time_ms').notNull().default(0),
    goalMet: boolean('goal_met').notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.userId, t.day] })],
)

// Daily mission: a plan generated once per day from the time budget, steps ticked off as they are done.
export const dailyMissions = pgTable(
  'daily_missions',
  {
    userId: userId(),
    day: text('day').notNull(),
    budgetMinutes: integer('budget_minutes').notNull(),
    plan: jsonb('plan').notNull(),
    progress: jsonb('progress').notNull().default({}),
    completedAt: ms('completed_at'),
    createdAt: ms('created_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.day] })],
)

// Micro-facts ([!reel]) seen / liked / hidden in the feed (hidden: AI reels this user dismissed).
export const reelState = pgTable(
  'reel_state',
  {
    userId: userId(),
    reelId: text('reel_id').notNull(),
    views: integer('views').notNull().default(0),
    liked: boolean('liked').notNull().default(false),
    saved: boolean('saved').notNull().default(false),
    hidden: boolean('hidden').notNull().default(false),
    lastSeenAt: ms('last_seen_at'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.reelId] }), index('reel_state_user_seen_idx').on(t.userId, t.lastSeenAt)],
)

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
  },
  (t) => [index('news_published_idx').on(t.publishedAt)],
)

// Per-user news state (was news_items.read_at / saved in the single-user app).
export const newsReads = pgTable(
  'news_reads',
  {
    userId: userId(),
    newsId: text('news_id')
      .notNull()
      .references(() => newsItems.id, { onDelete: 'cascade' }),
    readAt: ms('read_at'),
    saved: boolean('saved').notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.userId, t.newsId] }), index('news_reads_news_idx').on(t.newsId)],
)

// Duolingo-style lessons: best result per lesson. Course lessons have ids `<course>:<section>:<topic>:<kind>-<n>` and a
// course_id; rows of the pre-course generator (`<chapterId>::<kind>-<n>`, course_id null) are carried over lazily
// (src/server/courses/legacy.ts) and stay only for guides that no course covers.
export const lessonProgress = pgTable(
  'lesson_progress',
  {
    userId: userId(),
    lessonId: text('lesson_id').notNull(),
    courseId: text('course_id'),
    guideId: text('guide_id').notNull(),
    chapterId: text('chapter_id').notNull(),
    completions: integer('completions').notNull().default(0),
    bestAccuracy: doublePrecision('best_accuracy').notNull().default(0),
    lastXp: integer('last_xp').notNull().default(0),
    firstCompletedAt: ms('first_completed_at'),
    lastCompletedAt: ms('last_completed_at'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] }), index('lesson_user_guide_idx').on(t.userId, t.guideId), index('lesson_user_course_idx').on(t.userId, t.courseId)],
)

// ─── Courses (docs/ARCHITECTURE.md §5) ────────────────────────────────────────
// Course bundles themselves are files (content/courses/<id>.json, src/server/courses/registry.ts); user-uploaded
// courses will add courses / course_versions tables (source = 'user').

export type CourseSource = 'official' | 'user'

// Placement test outcome stored on the enrollment (src/course/select/placement.ts).
export interface EnrollmentPlacement {
  level: string
  sectionIndex: number
  sectionId: string | null
  confident: boolean
  asked: number
  at: number
  // true when the learner chose «start from zero» instead of taking the test
  skipped?: boolean
  // bank mode: result confidence, the level per measured skill (language: grammar / vocabulary / reading / listening →
  // CEFR; courses with course.skills: their ids → noob…god) and the approximate band of the course's exam (key `ielts`
  // kept from the IELTS-only days; course.yaml `exam:`) — jsonb, no migration
  confidence?: 'high' | 'medium' | 'low'
  skills?: Partial<Record<string, { level: string; asked: number; correct: number; measured: boolean; ielts: string | null }>>
  ielts?: string | null
  followUp?: boolean
  // rank credit for the verified level (src/game/placement-credit.ts): milestones counted by rankInput, XP in xp_ledger
  credit?: { xp: number; lessons: number; tests: number; exams: number }
}

// A course in the learner's library. Exactly one active enrollment per user (partial unique index).
export const enrollments = pgTable(
  'enrollments',
  {
    userId: userId(),
    courseId: text('course_id').notNull(),
    source: text('source', { enum: ['official', 'user'] }).notNull().default('official'),
    // noob…god, or CEFR A1…C2 for language courses (text column without a CHECK: no migration needed)
    level: text('level', { enum: ['noob', 'junior', 'middle', 'senior', 'god', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] }).notNull().default('noob'),
    placement: jsonb('placement').$type<EnrollmentPlacement>(),
    active: boolean('active').notNull().default(false),
    enrolledAt: ms('enrolled_at').notNull(),
    lastOpenedAt: ms('last_opened_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] }), uniqueIndex('enrollments_one_active_idx').on(t.userId).where(sql`${t.active}`)],
)

// A test answer checked by the server (checkAnswer), kept so the final grade uses the first answer, not a resubmission.
export interface StoredAnswer {
  id: string
  chosen: string[]
  text: string | null
}

// Topic tests (🏁, id `<topic>:test`). attempts = started attempts: attempt n draws its questions with the seed
// `${userId}:${n}`; graded = the last attempt that was submitted (one grading per attempt).
export const topicResults = pgTable(
  'topic_results',
  {
    userId: userId(),
    testId: text('test_id').notNull(),
    courseId: text('course_id').notNull(),
    attempts: integer('attempts').notNull().default(0),
    graded: integer('graded').notNull().default(0),
    lastSeed: text('last_seed'),
    lastScore: doublePrecision('last_score'),
    bestScore: doublePrecision('best_score').notNull().default(0),
    passedAt: ms('passed_at'),
    // first answer per question of the current attempt, as checked on the server (index → answer)
    answers: jsonb('answers').$type<Record<string, StoredAnswer>>(),
    // when the current attempt started: an exercise of the draw answered elsewhere after this (key peeked) counts wrong
    attemptStartedAt: ms('attempt_started_at'),
    updatedAt: ms('updated_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.testId] }), index('topic_results_user_course_idx').on(t.userId, t.courseId)],
)

// Section exams (👑, id `<course>:<section>:exam`). test_out: passed before the section was finished (skipped it).
export const examResults = pgTable(
  'exam_results',
  {
    userId: userId(),
    examId: text('exam_id').notNull(),
    courseId: text('course_id').notNull(),
    sectionId: text('section_id').notNull(),
    attempts: integer('attempts').notNull().default(0),
    graded: integer('graded').notNull().default(0),
    lastSeed: text('last_seed'),
    lastScore: doublePrecision('last_score'),
    bestScore: doublePrecision('best_score').notNull().default(0),
    passedAt: ms('passed_at'),
    testOut: boolean('test_out').notNull().default(false),
    answers: jsonb('answers').$type<Record<string, StoredAnswer>>(),
    attemptStartedAt: ms('attempt_started_at'),
    updatedAt: ms('updated_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.examId] }), index('exam_results_user_course_idx').on(t.userId, t.courseId)],
)

// AI-generated micro-facts for the feed (daily cron), shown next to [!reel] blocks from the guides.
// Shared by everyone; status 'hidden' is an admin takedown, per-user hiding lives in reel_state.hidden.
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

// ─── Game layer (Phase 4, docs/ARCHITECTURE.md §6, rules in src/game) ─────────────────────────────────────────

// Equipped Loo skin: shop item id per slot (src/game/shop.ts).
export interface EquippedSkinState {
  hat?: string
  glasses?: string
  hoodie?: string
  scarf?: string
}

// Equipped gear: shop item id per gear slot (src/game/shop.ts GEAR_SLOTS).
export interface EquippedGearState {
  head?: string
  body?: string
  weapon?: string
  amulet?: string
  aura?: string
}

// One row per learner: hearts (refilled lazily from hearts_at), equipped streak freezes, double-XP window, Loo skin,
// equipped gear and the character rank («шлях воїна»): evo_step = the step reached (0–55, src/game/ranks.ts),
// evo_seen = the last step whose rank-up moment was shown (the full-screen cutscene plays once per new step).
// Created on first use.
export const userState = pgTable('user_state', {
  userId: userId().primaryKey(),
  hearts: integer('hearts').notNull().default(5),
  heartsAt: ms('hearts_at'),
  streakFreezes: integer('streak_freezes').notNull().default(0),
  doubleXpUntil: ms('double_xp_until'),
  skin: jsonb('skin').$type<EquippedSkinState>().notNull().default({}),
  gear: jsonb('gear').$type<EquippedGearState>().notNull().default({}),
  evoStep: integer('evo_step').notNull().default(0),
  evoSeen: integer('evo_seen').notNull().default(0),
  updatedAt: ms('updated_at').notNull(),
})

// 💎 Append-only, like xp_ledger: +earned / −spent. (user_id, reason, ref_id) is unique, so every award lands once.
export const gemLedger = pgTable(
  'gem_ledger',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    userId: userId(),
    amount: integer('amount').notNull(),
    reason: text('reason').notNull(),
    refId: text('ref_id').notNull(),
    createdAt: ms('created_at').notNull(),
    day: text('day').notNull(),
  },
  (t) => [uniqueIndex('gem_ledger_ref_idx').on(t.userId, t.reason, t.refId), index('gem_user_day_idx').on(t.userId, t.day)],
)

// Bucks: the everyday currency (docs/ECONOMY.md), same shape and rules as gem_ledger.
export const buckLedger = pgTable(
  'buck_ledger',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    userId: userId(),
    amount: integer('amount').notNull(),
    reason: text('reason').notNull(),
    refId: text('ref_id').notNull(),
    createdAt: ms('created_at').notNull(),
    day: text('day').notNull(),
  },
  (t) => [uniqueIndex('buck_ledger_ref_idx').on(t.userId, t.reason, t.refId), index('buck_user_day_idx').on(t.userId, t.day)],
)

// Owned permanent shop items (Loo skins and gear). Consumables (freezes, refills, boosts) live in user_state.
export const inventory = pgTable(
  'inventory',
  {
    userId: userId(),
    itemId: text('item_id').notNull(),
    acquiredAt: ms('acquired_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.itemId] })],
)

// 🧊 Days a streak freeze was spent on (they bridge the streak without counting as goal days).
export const frozenDays = pgTable(
  'frozen_days',
  {
    userId: userId(),
    day: text('day').notNull(),
    usedAt: ms('used_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.day] })],
)

// 🏆 A weekly league group (≤ 30 learners of one tier). Shared, written by the server only (no user grants).
export const leagueCohorts = pgTable(
  'league_cohorts',
  {
    id: text('id').primaryKey(),
    // Monday of the league week in Europe/Kyiv, YYYY-MM-DD
    week: text('week').notNull(),
    tier: text('tier').notNull(),
    size: integer('size').notNull().default(0),
    createdAt: ms('created_at').notNull(),
    finalizedAt: ms('finalized_at'),
  },
  (t) => [index('league_cohorts_week_tier_idx').on(t.week, t.tier)],
)

// A learner's place in one league week. final_* / result are filled when the week is finalized.
export const leagueMembers = pgTable(
  'league_members',
  {
    userId: userId(),
    week: text('week').notNull(),
    tier: text('tier').notNull(),
    cohortId: text('cohort_id')
      .notNull()
      .references(() => leagueCohorts.id, { onDelete: 'cascade' }),
    joinedAt: ms('joined_at').notNull(),
    finalRank: integer('final_rank'),
    finalXp: integer('final_xp'),
    result: text('result', { enum: ['promoted', 'stayed', 'demoted'] }),
    finalizedAt: ms('finalized_at'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.week] }), index('league_members_cohort_idx').on(t.cohortId)],
)

// ─── Email (docs/EMAIL.md) ──────────────────────────────────────────────────────────────────────────────────────
// Server-only: RLS on, no grants (the reminder worker and the unsubscribe route use the owner connection).

// Opaque per-learner token for one-click unsubscribe links (no shared secret between Vercel and the reminder worker).
export const emailTokens = pgTable(
  'email_tokens',
  {
    userId: userId().primaryKey(),
    token: text('token').notNull(),
    createdAt: ms('created_at').notNull(),
  },
  (t) => [uniqueIndex('email_tokens_token_idx').on(t.token)],
)

// Every reminder sent (or claimed for sending): one row per (user, kind, ref) makes each email go out once even if
// two worker runs overlap; `day` enforces «at most one reminder a day».
export const emailLog = pgTable(
  'email_log',
  {
    userId: userId(),
    kind: text('kind').notNull(),
    ref: text('ref').notNull(),
    day: text('day').notNull(),
    status: text('status', { enum: ['pending', 'sent', 'failed'] }).notNull(),
    providerId: text('provider_id'),
    error: text('error'),
    createdAt: ms('created_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.kind, t.ref] }), index('email_log_user_day_idx').on(t.userId, t.day)],
)

// ─── Analytics (docs/ANALYTICS.md) ───────────────────────────────────────────
// First-party site analytics: page views, clicks and time on page of every visitor (signed in or not), enriched on
// the server with IP, Vercel geo headers and the user agent. Server-only table: RLS on, no grants (the admin area
// reads it as the system). A learner's rows go with their account (ON DELETE CASCADE).
export interface AnalyticsTarget {
  // clicked element: visible label (≤ 80 chars), link, tag, data-track, position in the viewport (%) and on the page (px)
  label?: string
  href?: string
  tag?: string
  track?: string
  x?: number
  y?: number
  pageY?: number
}

export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
    at: ms('at').notNull(),
    // Kyiv calendar day, YYYY-MM-DD (daily charts without timezone math)
    day: text('day').notNull(),
    // pageview | click | leave (time on page)
    type: text('type').notNull(),
    path: text('path').notNull(),
    title: text('title'),
    referrer: text('referrer'),
    utm: jsonb('utm').$type<Record<string, string>>(),
    visitorId: text('visitor_id').notNull(),
    sessionId: text('session_id').notNull(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
    ip: text('ip'),
    country: text('country'),
    region: text('region'),
    city: text('city'),
    device: text('device'),
    browser: text('browser'),
    os: text('os'),
    screen: text('screen'),
    lang: text('lang'),
    target: jsonb('target').$type<AnalyticsTarget>(),
    durationMs: integer('duration_ms'),
  },
  (t) => [index('analytics_at_idx').on(t.at), index('analytics_day_type_idx').on(t.day, t.type), index('analytics_path_idx').on(t.path), index('analytics_visitor_idx').on(t.visitorId)],
)

// ─── Admin audit (docs/ADMIN.md) ──────────────────────────────────────────────
// Every change the admin area makes to a learner (balances, boosts, items, bans). Server-only (RLS on, no grants);
// no FK, so the record outlives a deleted account.
export const adminAudit = pgTable(
  'admin_audit',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
    at: ms('at').notNull(),
    // 'login' (the owner's admin login) or 'role:<user id>' (an account with the admin role)
    actor: text('actor').notNull(),
    action: text('action').notNull(),
    targetUserId: uuid('target_user_id'),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default({}),
  },
  (t) => [index('admin_audit_at_idx').on(t.at), index('admin_audit_target_idx').on(t.targetUserId)],
)

import 'server-only'
import { and, eq } from 'drizzle-orm'
import { buildCoursePath, lookup, type CourseBundle, type CoursePathView, type PathCursor, type ResultRecord } from '@/course'
import { chapterProgress, examResults, lessonProgress, srsCards, taskState, topicResults } from '@/db/schema'
import type { Conn } from '@/db/client'
import type { ContentSnapshot } from '@/content/store'
import { chapterMastery, STABLE_DAYS, type ChapterSignals, type Mastery } from '@/progress/mastery'
import { chapterHref } from '@/ui/routes'
import { userScope } from '../auth'
import { read, readAll, readBatch } from '../db/batch'
import { lastOutcomesRead } from '../services/queue'
import type { ActiveCourse } from './enrollment'
import { legacyLessonsQuery, migrateLegacyLessons } from './legacy'

// ts-fsrs State.Review
const REVIEW_STATE = 2

export interface TopicMastery extends Mastery {
  signals: ChapterSignals
}

export interface CoursePath {
  bundle: CourseBundle
  view: CoursePathView
  mastery: Map<string, TopicMastery>
  // theory target per chapter (the guide reader)
  theoryHref: Map<string, string>
}

export interface CourseProgressRows {
  lessons: Set<string>
  perfect: Set<string>
  studied: Set<string>
  reading: Set<string>
  tests: Map<string, ResultRecord>
  exams: Map<string, ResultRecord>
}

// Everything the path needs from the database for one course (lessons are carried over from legacy ids first).
export async function courseProgress(bundle: CourseBundle): Promise<CourseProgressRows> {
  return userScope((db, userId) => courseProgressIn(db, userId, bundle), { tx: true })
}

// All reads in one round trip; the one-time legacy carry-over (a no-op once done) runs alongside and the lesson rows
// are read again only when it actually moved something.
export async function courseProgressIn(db: Conn, userId: string, bundle: CourseBundle): Promise<CourseProgressRows> {
  const courseId = bundle.course.id
  const lessonsOf = () =>
    db
      .select({ id: lessonProgress.lessonId, best: lessonProgress.bestAccuracy })
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.courseId, courseId)))
  // one statement: the reads, plus the legacy rows to carry over (none once migrated)
  const [legacy, lessonsBefore, chapterRows, testRows, examRows] = await readBatch(db, [
    legacyLessonsQuery(db, userId),
    lessonsOf(),
    db.select({ id: chapterProgress.chapterId, status: chapterProgress.status }).from(chapterProgress).where(eq(chapterProgress.userId, userId)),
    db
      .select()
      .from(topicResults)
      .where(and(eq(topicResults.userId, userId), eq(topicResults.courseId, courseId))),
    db
      .select()
      .from(examResults)
      .where(and(eq(examResults.userId, userId), eq(examResults.courseId, courseId))),
  ])
  const migrated = await migrateLegacyLessons(db, userId, bundle, legacy)
  const lessonRows = migrated > 0 ? await lessonsOf() : lessonsBefore
  return {
    lessons: new Set(lessonRows.map((r) => r.id)),
    perfect: new Set(lessonRows.filter((r) => r.best >= 1).map((r) => r.id)),
    studied: new Set(chapterRows.filter((r) => r.status === 'studied').map((r) => r.id)),
    reading: new Set(chapterRows.filter((r) => r.status === 'reading').map((r) => r.id)),
    tests: new Map(testRows.map((r) => [r.testId, { bestScore: r.bestScore, passed: r.passedAt !== null }])),
    exams: new Map(examRows.map((r) => [r.examId, { bestScore: r.bestScore, passed: r.passedAt !== null, testOut: r.testOut }])),
  }
}

export async function coursePathView(active: ActiveCourse): Promise<{ view: CoursePathView; progress: CourseProgressRows }> {
  const progress = await courseProgress(active.bundle)
  return { view: pathViewFrom(active, progress), progress }
}

export function pathViewFrom(active: ActiveCourse, progress: CourseProgressRows): CoursePathView {
  return buildCoursePath(active.bundle, active.enrollment.level, { ...progress, placementSection: active.enrollment.placement?.sectionIndex ?? null })
}

interface MasterySignals {
  outcomes: Map<string, boolean>
  srs: Map<string, { state: number; stability: number }>
  solved: Set<string>
}

// The rows behind the crowns per topic (quizzes answered, cards in review, tasks solved), in one round trip.
async function masterySignalsIn(db: Conn, userId: string, bundle: CourseBundle): Promise<MasterySignals> {
  const quizIds = Object.values(bundle.exercises)
    .filter((e) => e.kind === 'quiz')
    .map((e) => e.id)
  const [outcomes, srsRows, solvedRows] = await readAll(db, [
    lastOutcomesRead(db, userId, quizIds),
    read(db.select({ id: srsCards.unitId, state: srsCards.state, stability: srsCards.stability }).from(srsCards).where(eq(srsCards.userId, userId)), (rows) => rows),
    read(
      db
        .select({ id: taskState.unitId })
        .from(taskState)
        .where(and(eq(taskState.userId, userId), eq(taskState.status, 'solved'))),
      (rows) => rows,
    ),
  ])
  return { outcomes, srs: new Map(srsRows.map((r) => [r.id, r])), solved: new Set(solvedRows.map((r) => r.id)) }
}

export interface MasteryRows {
  studied: ReadonlySet<string>
  reading: ReadonlySet<string>
}

// Pure: per-topic crowns of one course from already loaded rows (also used by Loo's character sheet for every course).
export function masteryFromRows(
  bundle: CourseBundle,
  chapters: MasteryRows,
  outcomes: ReadonlyMap<string, boolean>,
  srs: ReadonlyMap<string, { state: number; stability: number }>,
  solved: ReadonlySet<string>,
): Map<string, TopicMastery> {
  const out = new Map<string, TopicMastery>()
  for (const section of bundle.sections) {
    for (const topic of section.topics) {
      const signals: ChapterSignals = {
        status: chapters.studied.has(topic.chapterId) ? 'studied' : chapters.reading.has(topic.chapterId) ? 'reading' : 'unread',
        quizzes: { total: 0, answered: 0, correct: 0 },
        cards: { total: 0, reviewing: 0, stable: 0 },
        tasks: { total: 0, solved: 0 },
      }
      for (const id of topic.exercises) {
        const kind = bundle.exercises[id]?.kind
        // speaking attempts aren't recorded on a miss: they never count against mastery
        if (kind === 'quiz' || kind === 'listen' || kind === 'pair') {
          signals.quizzes.total++
          const last = outcomes.get(id)
          if (last !== undefined) {
            signals.quizzes.answered++
            if (last) signals.quizzes.correct++
          }
        } else if (kind === 'flashcard' || kind === 'interview' || kind === 'word') {
          signals.cards.total++
          const card = srs.get(id)
          if (card?.state === REVIEW_STATE) {
            signals.cards.reviewing++
            if (card.stability >= STABLE_DAYS) signals.cards.stable++
          }
        } else if (kind === 'task') {
          signals.tasks.total++
          if (solved.has(id)) signals.tasks.solved++
        }
      }
      out.set(topic.id, { ...chapterMastery(signals), signals })
    }
  }
  return out
}

// One transaction: progress rows and mastery signals go out together.
export async function coursePath(snapshot: ContentSnapshot, active: ActiveCourse): Promise<CoursePath> {
  const [progress, signals] = await userScope((db, userId) => Promise.all([courseProgressIn(db, userId, active.bundle), masterySignalsIn(db, userId, active.bundle)]), { tx: true })
  const mastery = masteryFromRows(active.bundle, { studied: progress.studied, reading: progress.reading }, signals.outcomes, signals.srs, signals.solved)
  const view = pathViewFrom(active, progress)
  const theoryHref = new Map<string, string>()
  for (const s of active.bundle.sections) {
    for (const t of s.topics) {
      const chapter = snapshot.chapters.get(t.chapterId)
      if (chapter) theoryHref.set(t.chapterId, chapterHref(snapshot, chapter))
    }
  }
  return { bundle: active.bundle, view, mastery, theoryHref }
}

export function lessonHref(id: string): string {
  return `/learn/${encodeURIComponent(id)}`
}

export function testHref(id: string): string {
  return `/test/${encodeURIComponent(id)}`
}

// Where a path cursor leads (theory → the reader, lessons → the player, tests / exams → the test player).
export function cursorHref(cursor: PathCursor, path: Pick<CoursePath, 'bundle' | 'theoryHref'>): string {
  if (cursor.type !== 'lesson') return testHref(cursor.id)
  if (cursor.lesson?.kind === 'theory') {
    const topic = cursor.topicId ? lookup(path.bundle).topics.get(cursor.topicId) : undefined
    const href = topic ? path.theoryHref.get(topic.chapterId) : undefined
    if (href) return href
  }
  return lessonHref(cursor.id)
}

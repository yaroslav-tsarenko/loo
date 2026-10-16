import 'server-only'
import { and, eq } from 'drizzle-orm'
import { buildCoursePath, lookup, type CourseBundle, type CoursePathView, type PathCursor, type ResultRecord } from '@/course'
import { chapterProgress, examResults, lessonProgress, srsCards, taskState, topicResults } from '@/db/schema'
import type { ContentSnapshot } from '@/content/store'
import { chapterMastery, STABLE_DAYS, type ChapterSignals, type Mastery } from '@/progress/mastery'
import { chapterHref } from '@/ui/routes'
import { userScope } from '../auth'
import { lastOutcomes } from '../services/queue'
import type { ActiveCourse } from './enrollment'
import { migrateLegacyLessons } from './legacy'

// ts-fsrs State.Review
const REVIEW_STATE = 2

export interface TopicMastery extends Mastery {
  signals: ChapterSignals
}

export interface CoursePath {
  bundle: CourseBundle
  view: CoursePathView
  mastery: Map<string, TopicMastery>
  // 📖 theory target per chapter (the guide reader)
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
  const courseId = bundle.course.id
  return userScope(
    async (db, userId) => {
      await migrateLegacyLessons(db, userId, bundle)
      const [lessonRows, chapterRows, testRows, examRows] = await Promise.all([
        db
          .select({ id: lessonProgress.lessonId, best: lessonProgress.bestAccuracy })
          .from(lessonProgress)
          .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.courseId, courseId))),
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
      return {
        lessons: new Set(lessonRows.map((r) => r.id)),
        perfect: new Set(lessonRows.filter((r) => r.best >= 1).map((r) => r.id)),
        studied: new Set(chapterRows.filter((r) => r.status === 'studied').map((r) => r.id)),
        reading: new Set(chapterRows.filter((r) => r.status === 'reading').map((r) => r.id)),
        tests: new Map(testRows.map((r) => [r.testId, { bestScore: r.bestScore, passed: r.passedAt !== null }])),
        exams: new Map(examRows.map((r) => [r.examId, { bestScore: r.bestScore, passed: r.passedAt !== null, testOut: r.testOut }])),
      }
    },
    { tx: true },
  )
}

export async function coursePathView(active: ActiveCourse): Promise<{ view: CoursePathView; progress: CourseProgressRows }> {
  const progress = await courseProgress(active.bundle)
  const view = buildCoursePath(active.bundle, active.enrollment.level, { ...progress, placementSection: active.enrollment.placement?.sectionIndex ?? null })
  return { view, progress }
}

// Crowns per topic, from the same signals as the guide path (quizzes answered, cards in review, tasks solved).
async function topicMastery(bundle: CourseBundle, progress: CourseProgressRows): Promise<Map<string, TopicMastery>> {
  const quizIds = Object.values(bundle.exercises)
    .filter((e) => e.kind === 'quiz')
    .map((e) => e.id)
  const [outcomes, [srsRows, solvedRows]] = await Promise.all([
    lastOutcomes(quizIds),
    userScope((db, userId) =>
      Promise.all([
        db.select({ id: srsCards.unitId, state: srsCards.state, stability: srsCards.stability }).from(srsCards).where(eq(srsCards.userId, userId)),
        db
          .select({ id: taskState.unitId })
          .from(taskState)
          .where(and(eq(taskState.userId, userId), eq(taskState.status, 'solved'))),
      ]),
    ),
  ])
  return masteryFromRows(bundle, { studied: progress.studied, reading: progress.reading }, outcomes, new Map(srsRows.map((r) => [r.id, r])), new Set(solvedRows.map((r) => r.id)))
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
        if (kind === 'quiz') {
          signals.quizzes.total++
          const last = outcomes.get(id)
          if (last !== undefined) {
            signals.quizzes.answered++
            if (last) signals.quizzes.correct++
          }
        } else if (kind === 'flashcard' || kind === 'interview') {
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

export async function coursePath(snapshot: ContentSnapshot, active: ActiveCourse): Promise<CoursePath> {
  const { view, progress } = await coursePathView(active)
  const mastery = await topicMastery(active.bundle, progress)
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

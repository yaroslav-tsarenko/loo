import 'server-only'
import { and, desc, eq, gte, isNotNull } from 'drizzle-orm'
import type { Conn } from '@/db/client'
import { chapterProgress, enrollments, examResults, frozenDays, srsCards, taskState, attempts } from '@/db/schema'
import {
  attributes as computeAttributes,
  characterInput,
  RANKS,
  sectionSkill,
  snapshotOf,
  sortSkills,
  strengthsAndWeakness,
  topicSkill,
  type Attribute,
  type CharacterSnapshot,
  type RankProgress,
  type Skill,
} from '@/game'
import { shiftDay, dayKey } from '@/progress/day'
import { computeProfileStats, type ProfileStats } from '@/progress/stats'
import { userScope } from '../auth'
import { getCourse } from '../courses/registry'
import { masteryFromRows } from '../courses/path'
import { withUser } from '../db/with-user'
import { loadAggregates } from '../stats/queries'
import { rankOfUser } from './ranks'

// 🧙 Loo's character sheet: attributes from the statistics engine's aggregates (read-only reuse of src/server/stats),
// skills from topic mastery / passed section exams of EVERY enrolled course, evolution from src/game/ranks.ts.

export interface CourseMasteryTopic {
  courseId: string
  courseTitle: string
  topicId: string
  title: string
  icon: string | null
  crowns: number
  ratio: number
  touched: boolean
}

// Crowns of every topic of every course in the learner's library (same signals as the path).
async function masteryAcrossCourses(conn: Conn, userId: string): Promise<{ topics: CourseMasteryTopic[]; skills: Skill[] }> {
  const [enrolled, chapters, srsRows, solvedRows, lastQuiz, exams] = await Promise.all([
    conn.select({ id: enrollments.courseId }).from(enrollments).where(eq(enrollments.userId, userId)),
    conn.select({ id: chapterProgress.chapterId, status: chapterProgress.status }).from(chapterProgress).where(eq(chapterProgress.userId, userId)),
    conn.select({ id: srsCards.unitId, state: srsCards.state, stability: srsCards.stability }).from(srsCards).where(eq(srsCards.userId, userId)),
    conn
      .select({ id: taskState.unitId })
      .from(taskState)
      .where(and(eq(taskState.userId, userId), eq(taskState.status, 'solved'))),
    // the last answer per quiz
    conn
      .selectDistinctOn([attempts.unitId], { id: attempts.unitId, correct: attempts.correct })
      .from(attempts)
      .where(and(eq(attempts.userId, userId), eq(attempts.kind, 'quiz')))
      .orderBy(attempts.unitId, desc(attempts.id)),
    conn
      .select({ id: examResults.examId, score: examResults.bestScore })
      .from(examResults)
      .where(and(eq(examResults.userId, userId), isNotNull(examResults.passedAt))),
  ])
  const status = {
    studied: new Set(chapters.filter((c) => c.status === 'studied').map((c) => c.id)),
    reading: new Set(chapters.filter((c) => c.status === 'reading').map((c) => c.id)),
  }
  const outcomes = new Map(lastQuiz.map((r) => [r.id, r.correct]))
  const srs = new Map(srsRows.map((r) => [r.id, r]))
  const solved = new Set(solvedRows.map((r) => r.id))
  const passed = new Map(exams.map((e) => [e.id, e.score]))
  const topics: CourseMasteryTopic[] = []
  const skills: Skill[] = []
  for (const { id } of enrolled) {
    const bundle = await getCourse(id)
    if (!bundle) continue
    const mastery = masteryFromRows(bundle, status, outcomes, srs, solved)
    const courseTitle = bundle.course.title
    for (const section of bundle.sections) {
      for (const topic of section.topics) {
        const m = mastery.get(topic.id)
        if (!m) continue
        const touched = m.signals.status !== 'unread' || m.signals.quizzes.answered > 0 || m.signals.cards.reviewing > 0 || m.signals.tasks.solved > 0
        topics.push({ courseId: id, courseTitle, topicId: topic.id, title: topic.title, icon: topic.icon, crowns: m.crowns, ratio: m.ratio, touched })
        const skill = topicSkill({ courseId: id, courseTitle, topicId: topic.id, title: topic.title, icon: topic.icon, crowns: m.crowns, ratio: m.ratio })
        if (skill) skills.push(skill)
      }
      const score = section.exam ? passed.get(section.exam.id) : undefined
      if (section.exam && score !== undefined) skills.push(sectionSkill({ courseId: id, courseTitle, sectionId: section.id, title: section.title, icon: section.icon, score }))
    }
  }
  return { topics, skills: sortSkills(skills) }
}

export interface CharacterView {
  rank: RankProgress
  stats: ProfileStats
  attributes: Attribute[]
  strengths: Attribute[]
  weakest: Attribute
  skills: Skill[]
  topics: { touched: number; mastered: number; total: number }
  snapshot: CharacterSnapshot
}

export async function characterIn(conn: Conn, userId: string, now: number): Promise<CharacterView> {
  const [agg, mastery, rank, frozen] = await Promise.all([
    loadAggregates(conn, userId, now),
    masteryAcrossCourses(conn, userId),
    rankOfUser(conn, userId),
    conn
      .select({ day: frozenDays.day })
      .from(frozenDays)
      .where(and(eq(frozenDays.userId, userId), gte(frozenDays.day, shiftDay(dayKey(now), -29)))),
  ])
  const stats = computeProfileStats(agg)
  const touched = mastery.topics.filter((t) => t.touched)
  const avgCrowns = touched.length > 0 ? touched.reduce((s, t) => s + t.crowns, 0) / touched.length : 0
  const attrs = computeAttributes(characterInput(stats, { touched: touched.length, avgCrowns }, frozen.length))
  const { strengths, weakest } = strengthsAndWeakness(attrs)
  return {
    rank,
    stats,
    attributes: attrs,
    strengths,
    weakest,
    skills: mastery.skills,
    topics: { touched: touched.length, mastered: mastery.topics.filter((t) => t.crowns >= 3).length, total: mastery.topics.length },
    snapshot: snapshotOf(rank.rank, attrs, mastery.skills),
  }
}

// The signed-in learner's sheet (/loo, profile).
export async function myCharacter(now = Date.now()): Promise<CharacterView> {
  return userScope((db, userId) => characterIn(db, userId, now))
}

// ⚔️ Battle-ready snapshot of any learner (server-side only: matchmaking / duels will call it for both sides).
// Reads that learner's rows in their own scope (RLS on Supabase); stable JSON (src/game/character.ts snapshotOf).
export async function characterSnapshot(userId: string, now = Date.now()): Promise<CharacterSnapshot> {
  return withUser({ id: userId }, async (db) => (await characterIn(db, userId, now)).snapshot)
}

export const EVOLUTION_TIMELINE = RANKS

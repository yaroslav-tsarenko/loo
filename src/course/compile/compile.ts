import type { Chapter, LearningUnit } from '@/content/model'
import type { Reel } from '@/content/parse/reels'
import { lessonId, legacyLessonIdFor, sectionExamId, sectionId as makeSectionId, topicId as makeTopicId, topicKeyFor, topicTestId } from '../ids'
import type { CourseIssue } from '../issues'
import {
  BUNDLE_FORMAT,
  byLevel,
  expandRange,
  levelRank,
  maxLevel,
  minLevel,
  toCourseLevel,
  type CourseBundle,
  type CourseManifest,
  type CourseStats,
  type ExerciseKind,
  type ExerciseRef,
  type Lesson,
  type Level,
  type PlacementPool,
  type ReelRef,
  type Section,
  type SectionExam,
  type SectionManifest,
  type Topic,
  type TopicTest,
} from '../schema'
import { PACE, isInterviewUnit, topicLessons } from './lessons'
import { chapterUnits, findGuide, type CourseSource } from './source'

export interface CompileResult {
  bundle: CourseBundle
  issues: CourseIssue[]
  // chapters the course pulls in (for scoping content issues)
  chapterIds: string[]
}

// Fewer auto-graded quizzes than this → a test/exam is topped up with self-graded cards.
export const MIN_AUTO_QUESTIONS = 5

// Placement prefers quick, auto-graded formats.
const QUICK_MODES = new Set(['single', 'multi', 'output'])

function exerciseKind(unit: LearningUnit): ExerciseKind {
  if (unit.kind === 'flashcard') return isInterviewUnit(unit) ? 'interview' : 'flashcard'
  return unit.kind
}

export function unitMinutes(unit: LearningUnit): number {
  return PACE[unit.kind]
}

// Most common exercise level of a chapter — used when the chapter itself has no level.
function dominantLevel(units: readonly LearningUnit[]): Level | null {
  const counts = new Map<Level, number>()
  for (const u of units) {
    const l = toCourseLevel(u.level)
    if (l) counts.set(l, (counts.get(l) ?? 0) + 1)
  }
  let best: Level | null = null
  for (const [l, n] of counts) if (best === null || n > counts.get(best)! || (n === counts.get(best)! && levelRank(l) < levelRank(best))) best = l
  return best
}

function sectionChapters(manifest: SectionManifest, chapters: Chapter[], issues: CourseIssue[]): Chapter[] {
  if (manifest.chapters === undefined) return chapters
  const wanted = expandRange(manifest.chapters)
  const byNumber = new Map<number, Chapter>()
  for (const c of chapters) if (c.number !== null && !byNumber.has(c.number)) byNumber.set(c.number, c)
  const missing = wanted.filter((n) => !byNumber.has(n))
  if (missing.length > 0) {
    issues.push({ severity: 'error', code: 'missing-chapter', where: manifest.id, message: `Розділ «${manifest.id}»: у посібнику «${manifest.from}» немає тем ${missing.join(', ')}` })
  }
  const out = wanted.map((n) => byNumber.get(n)).filter((c): c is Chapter => c !== undefined)
  if (out.length === 0) issues.push({ severity: 'error', code: 'empty-range', where: manifest.id, message: `Розділ «${manifest.id}»: діапазон ${String(manifest.chapters)} не вибрав жодної теми` })
  return out
}

export function compileCourseDetailed(manifest: CourseManifest, source: CourseSource): CompileResult {
  const issues: CourseIssue[] = []
  const courseId = manifest.id
  const exercises: Record<string, ExerciseRef> = {}
  const reels: Record<string, ReelRef> = {}
  const usedTopicKeys = new Set<string>()
  const usedChapters = new Set<string>()
  const chapterIds: string[] = []
  const reelsByChapter = new Map<string, Reel[]>()
  for (const r of source.reels) {
    const list = reelsByChapter.get(r.chapterId)
    if (list) list.push(r)
    else reelsByChapter.set(r.chapterId, [r])
  }

  const sections: Section[] = []
  manifest.sections.forEach((sm, sectionIndex) => {
    const guide = findGuide(source, sm.from)
    if (!guide) {
      issues.push({ severity: 'error', code: 'missing-guide', where: sm.id, message: `Розділ «${sm.id}»: посібник «${sm.from}» не знайдено` })
      return
    }
    const sid = makeSectionId(courseId, sm.id)
    const all = guide.chapterIds.map((id) => source.chapters.get(id)).filter((c): c is Chapter => c !== undefined && c.kind !== 'index')
    const picked = sectionChapters(sm, all, issues)
    const path = sm.kind === 'path'
    const topics: Topic[] = []

    for (const chapter of picked) {
      if (usedChapters.has(chapter.id)) {
        issues.push({ severity: 'error', code: 'duplicate-topic', where: sm.id, message: `Тема «${chapter.title}» (${chapter.id}) вже є в іншому розділі курсу` })
        continue
      }
      let key = topicKeyFor(chapter.id, guide.id, chapter.number)
      if (usedTopicKeys.has(key)) {
        issues.push({ severity: 'error', code: 'duplicate-topic', where: sm.id, message: `Дублікат id теми «${key}» (${chapter.path})` })
        let n = 2
        while (usedTopicKeys.has(`${key}-${n}`)) n++
        key = `${key}-${n}`
      }
      usedTopicKeys.add(key)
      usedChapters.add(chapter.id)
      chapterIds.push(chapter.id)
      const tid = makeTopicId(courseId, sm.id, key)

      const raw = chapterUnits(source, chapter)
      const units: LearningUnit[] = []
      for (const u of raw) {
        const other = exercises[u.id]
        if (other) {
          issues.push({ severity: 'error', code: 'duplicate-id', where: tid, message: `Вправа ${u.id} уже є в темі ${other.topicId}` })
          continue
        }
        units.push(u)
      }
      const contentLevel = toCourseLevel(chapter.level) ?? dominantLevel(units)
      const topicLevel: Level = sm.level ?? contentLevel ?? toCourseLevel(guide.level) ?? 'junior'
      units.forEach((u, position) => {
        const own = toCourseLevel(u.level)
        exercises[u.id] = {
          id: u.id,
          kind: exerciseKind(u),
          mode: u.kind === 'quiz' ? u.mode : null,
          level: sm.level ?? own ?? topicLevel,
          levelSource: sm.level ? 'section' : own ? 'exercise' : contentLevel ? 'topic' : 'default',
          tags: u.tags,
          topicId: tid,
          position,
          difficulty: u.kind === 'task' ? u.difficulty : null,
          autoTested: u.kind === 'task' && Boolean(u.code?.tests),
          minutes: unitMinutes(u),
        }
      })
      const chapterReels = (reelsByChapter.get(chapter.id) ?? []).filter((r) => !reels[r.id])
      for (const r of chapterReels) reels[r.id] = { id: r.id, topicId: tid, emoji: r.emoji, title: r.title }

      const drafts = topicLessons({
        units,
        reelIds: chapterReels.map((r) => r.id),
        theory: path,
        theoryMinutes: chapter.estimatedMinutes,
        minutesOf: unitMinutes,
      })
      const lessons: Lesson[] = drafts.map((d, index) => {
        const levels = d.items.filter((i) => i.kind === 'unit').map((i) => exercises[i.id]!.level)
        return {
          id: lessonId(tid, d.kind, d.n),
          legacyId: legacyLessonIdFor(chapter.id, d.kind, d.n),
          topicId: tid,
          index,
          kind: d.kind,
          n: d.n,
          emoji: d.emoji,
          title: d.title,
          items: d.items,
          minutes: d.minutes,
          level: maxLevel(levels) ?? topicLevel,
        }
      })

      const quizIds = units.filter((u) => u.kind === 'quiz').map((u) => u.id)
      const cardIds = units.filter((u) => u.kind === 'flashcard').map((u) => u.id)
      let test: TopicTest | null = null
      const cfg = manifest.exams.topic
      if (path && quizIds.length + cardIds.length > 0) {
        // self-graded cards top up only a thin quiz pool; otherwise the test is shorter but fully auto-graded
        const fallback = quizIds.length < Math.min(MIN_AUTO_QUESTIONS, cfg.questions) ? cardIds : []
        test = { id: topicTestId(tid), questions: Math.min(cfg.questions, quizIds.length + fallback.length), pass: cfg.pass, pool: quizIds, fallback }
      }

      topics.push({
        id: tid,
        key,
        sectionId: sid,
        index: topics.length,
        chapterId: chapter.id,
        guideId: guide.id,
        title: chapter.title,
        number: chapter.number,
        icon: chapter.icon,
        level: topicLevel,
        tags: chapter.tags,
        minutes: lessons.reduce((sum, l) => sum + l.minutes, 0),
        exercises: units.map((u) => u.id),
        reels: chapterReels.map((r) => r.id),
        lessons,
        test,
      })
    }

    let exam: SectionExam | null = null
    const ecfg = manifest.exams.section
    if (path && topics.length > 0) {
      const pool: Record<string, string[]> = {}
      let total = 0
      for (const t of topics) {
        const quizzes = t.test?.pool ?? []
        if (quizzes.length > 0) pool[t.id] = quizzes
        total += quizzes.length
      }
      const fallback = total < Math.min(MIN_AUTO_QUESTIONS, ecfg.questions) ? topics.flatMap((t) => t.exercises.filter((id) => exercises[id]!.kind === 'flashcard')) : []
      const questions = Math.min(ecfg.questions, total + fallback.length)
      if (questions > 0) exam = { id: sectionExamId(sid), questions, pass: ecfg.pass, testOut: ecfg.testOut, pool, fallback }
    }

    const topicLevels = topics.map((t) => t.level)
    sections.push({
      id: sid,
      key: sm.id,
      index: sectionIndex,
      kind: sm.kind,
      title: sm.title,
      description: sm.description ?? null,
      icon: sm.icon ?? guide.icon ?? null,
      guideId: guide.id,
      guideDir: guide.dir,
      level: maxLevel(topicLevels) ?? sm.level ?? 'junior',
      minLevel: minLevel(topicLevels) ?? sm.level ?? 'junior',
      minutes: topics.reduce((sum, t) => sum + t.minutes, 0),
      topics,
      exam,
    })
  })
  // Re-index after skipped (missing) sections so index == position.
  sections.forEach((s, i) => (s.index = i))

  const placement = placementPool(manifest, sections, exercises)
  const stats = courseStats(sections, exercises, reels)
  const icons = [...new Set([manifest.icon, ...sections.map((s) => s.icon), ...sections.flatMap((s) => s.topics.map((t) => t.icon))].filter((v): v is string => Boolean(v)))]

  const bundle: CourseBundle = {
    format: BUNDLE_FORMAT,
    course: {
      id: courseId,
      version: manifest.version,
      title: manifest.title,
      subtitle: manifest.subtitle ?? null,
      description: manifest.description ?? null,
      subject: manifest.subject,
      language: manifest.language,
      icon: manifest.icon ?? null,
      color: manifest.color ?? null,
      cover: manifest.cover ?? null,
      levels: manifest.levels,
      tags: manifest.tags,
      authors: manifest.authors,
      license: manifest.license ?? null,
      estimatedHours: manifest.estimatedHours ?? stats.hours,
    },
    exams: manifest.exams,
    sections,
    exercises,
    reels,
    placement,
    icons,
    stats,
  }
  return { bundle, issues, chapterIds }
}

export function compileCourse(manifest: CourseManifest, source: CourseSource): CourseBundle {
  return compileCourseDetailed(manifest, source).bundle
}

function placementPool(manifest: CourseManifest, sections: readonly Section[], exercises: Record<string, ExerciseRef>): PlacementPool {
  const quick = byLevel((): string[] => [])
  const other = byLevel((): string[] => [])
  for (const s of sections) {
    if (s.kind !== 'path') continue
    for (const t of s.topics) {
      for (const id of t.exercises) {
        const ex = exercises[id]!
        if (ex.kind !== 'quiz') continue
        ;(QUICK_MODES.has(ex.mode ?? '') ? quick : other)[ex.level].push(id)
      }
    }
  }
  const { enabled, maxQuestions, perLevel } = manifest.placement
  const pool = byLevel((l) => (!enabled ? [] : quick[l].length >= perLevel ? quick[l] : [...quick[l], ...other[l]]))
  return { enabled, maxQuestions, perLevel, pool }
}

function courseStats(sections: readonly Section[], exercises: Record<string, ExerciseRef>, reels: Record<string, ReelRef>): CourseStats {
  const list = Object.values(exercises)
  const count = (kind: ExerciseKind) => list.filter((e) => e.kind === kind).length
  const topics = sections.flatMap((s) => s.topics)
  const lessons = topics.reduce((sum, t) => sum + t.lessons.length, 0)
  // a test/exam takes ~0.6 min per question
  const examMinutes = topics.reduce((sum, t) => sum + (t.test ? t.test.questions * PACE.quiz : 0), 0) + sections.reduce((sum, s) => sum + (s.exam ? s.exam.questions * PACE.quiz : 0), 0)
  const minutes = Math.round(topics.reduce((sum, t) => sum + t.minutes, 0) + examMinutes)
  const levels = byLevel((l) => list.filter((e) => e.level === l).length)
  return {
    sections: sections.length,
    topics: topics.length,
    lessons,
    exercises: list.length,
    quizzes: count('quiz'),
    flashcards: count('flashcard'),
    interview: count('interview'),
    tasks: count('task'),
    autoTestedTasks: list.filter((e) => e.autoTested).length,
    reels: Object.keys(reels).length,
    topicTests: topics.filter((t) => t.test).length,
    sectionExams: sections.filter((s) => s.exam).length,
    minutes,
    hours: Math.round(minutes / 6) / 10,
    byLevel: levels,
  }
}

import { iconRef } from '@/content/icons'
import type { Chapter, LearningUnit } from '@/content/model'
import type { Reel } from '@/content/parse/reels'
import { lessonId, legacyLessonIdFor, sectionExamId, sectionId as makeSectionId, topicId as makeTopicId, topicKeyFor, topicTestId } from '../ids'
import type { CourseIssue } from '../issues'
import {
  BUNDLE_FORMAT,
  byLevel,
  courseLadder,
  expandRange,
  LADDERS,
  levelRank,
  maxLevel,
  minLevel,
  toCourseLevel,
  type LevelLadder,
  PLACEMENT_SKILLS,
  type CourseBundle,
  type CourseManifest,
  type CourseStats,
  type ExerciseKind,
  type ExerciseRef,
  type Lesson,
  type Level,
  type PlacementItem,
  type PlacementPool,
  type ReelRef,
  type Section,
  type SectionExam,
  type SectionManifest,
  type Topic,
  type TopicTest,
  kindForSubject,
  resolvePractice,
  courseSkills,
  placementSkillIds,
  type SkillDef,
} from '../schema'
import { deriveDifficulty, exerciseSkill, topicKindOf } from './difficulty'
import { PACE, isInterviewUnit, topicLessons } from './lessons'
import { chapterUnits, findGuide, type CourseSource } from './source'

export interface CompileResult {
  bundle: CourseBundle
  issues: CourseIssue[]
  // chapters the course pulls in (for scoping content issues), placement bank files included
  chapterIds: string[]
}

// Fewer auto-graded quizzes than this → a test/exam is topped up with self-graded cards.
export const MIN_AUTO_QUESTIONS = 5

// Placement prefers quick, auto-graded formats (a listening choice and a minimal pair count too).
const QUICK_MODES = new Set(['single', 'multi', 'output', 'pair'])

// Fallback level of a topic without any (course ladder).
const DEFAULT_LEVEL: Record<LevelLadder, Level> = { it: 'junior', cefr: 'A1' }

export function exerciseKind(unit: LearningUnit): ExerciseKind {
  if (unit.kind === 'flashcard') return unit.word ? 'word' : isInterviewUnit(unit) ? 'interview' : 'flashcard'
  if (unit.kind === 'quiz' && (unit.mode === 'listen' || unit.mode === 'pair' || unit.mode === 'speak')) return unit.mode
  return unit.kind
}

// Auto-graded by the server: everything a topic test / exam / placement may ask. [!speak] needs a microphone and a
// recogniser, so it stays in lessons and «Вимова» only.
export const isTestable = (unit: LearningUnit): boolean => unit.kind === 'quiz' && unit.mode !== 'speak'

const isQuick = (unit: LearningUnit): boolean => unit.kind === 'quiz' && (QUICK_MODES.has(unit.mode) || (unit.mode === 'listen' && (unit.listen?.type === 'choice' || unit.listen?.type === 'answer')))

export function unitMinutes(unit: LearningUnit): number {
  return PACE[unit.kind]
}

// Most common exercise level of a chapter — used when the chapter itself has no level.
function dominantLevel(units: readonly LearningUnit[], ladder: LevelLadder): Level | null {
  const counts = new Map<Level, number>()
  for (const u of units) {
    const l = toCourseLevel(u.level, ladder)
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

  const ladder = courseLadder({ levels: manifest.levels })
  const kind = manifest.kind ?? kindForSubject(manifest.subject)
  // skills as course data (schema/skills.ts): language courses keep their own derivation (difficulty.ts →
  // exerciseSkill); a programming / general course has a skill model only when it declares `skills:`
  const skillDefs: SkillDef[] = courseSkills({ kind, subject: manifest.subject, levels: manifest.levels, skills: manifest.skills })
  const declared = ladder !== 'cefr' && manifest.skills ? new Set(manifest.skills.map((s) => s.id)) : null
  const unknownSkill = (where: string, id: string, what: string) =>
    issues.push({ severity: 'error', code: 'unknown-skill', where, message: `${what}: невідома навичка «${id}» (у course.yaml skills: ${[...declared!].join(', ')})` })
  // an exercise's own `skill:` (quiz meta line), validated against the declared skills
  const ownSkill = (u: LearningUnit, where: string): string | undefined => {
    if (!declared || u.kind !== 'quiz' || !u.skill) return undefined
    if (declared.has(u.skill)) return u.skill
    unknownSkill(where, u.skill, `Вправа ${u.id}`)
    return undefined
  }
  const withSkill = (own: string | undefined, topic: string | undefined): { skill?: string } => (own ?? topic ? { skill: (own ?? topic)! } : {})
  const topicsWithoutSkill: string[] = []
  const quick = new Set<string>()
  const sections: Section[] = []
  manifest.sections.forEach((sm, sectionIndex) => {
    if (sm.status === 'planned') {
      // «скоро» on the path: no topics yet, never an error that its guide or chapters don't exist
      const planned = findGuide(source, sm.from)
      const level = sm.level ?? LADDERS[ladder][0]!
      sections.push({
        id: makeSectionId(courseId, sm.id),
        key: sm.id,
        index: sectionIndex,
        kind: sm.kind,
        title: sm.title,
        description: sm.description ?? null,
        icon: iconRef(sm.icon) ?? iconRef(planned?.icon),
        guideId: planned?.id ?? sm.from,
        guideDir: planned?.dir ?? sm.from,
        level,
        minLevel: level,
        minutes: 0,
        topics: [],
        exam: null,
        status: 'planned',
      })
      return
    }
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
      const contentLevel = toCourseLevel(chapter.level, ladder) ?? dominantLevel(units, ladder)
      const topicLevel: Level = sm.level ?? contentLevel ?? toCourseLevel(guide.level, ladder) ?? DEFAULT_LEVEL[ladder]
      // language topics: grammar | vocabulary | pronunciation | listening | skills | review (difficulty.ts)
      const topicKind = ladder === 'cefr' ? topicKindOf(chapter.tags) : undefined
      // declared skills: frontmatter `skill:` → the section's `skill:` → none (a warning)
      let topicSkill: string | undefined
      if (declared) {
        if (chapter.skill && !declared.has(chapter.skill)) unknownSkill(tid, chapter.skill, `Тема «${chapter.title}» (${chapter.path})`)
        topicSkill = chapter.skill && declared.has(chapter.skill) ? chapter.skill : sm.skill
        if (!topicSkill) topicsWithoutSkill.push(chapter.title)
      }
      // difficulty: place of the exercise among the topic's exercises of its kind (words first, quizzes later…)
      const kindTotal = new Map<ExerciseKind, number>()
      for (const u of units) kindTotal.set(exerciseKind(u), (kindTotal.get(exerciseKind(u)) ?? 0) + 1)
      const kindSeen = new Map<ExerciseKind, number>()
      units.forEach((u, position) => {
        if (isQuick(u)) quick.add(u.id)
        const own = toCourseLevel(u.level, ladder)
        const kind = exerciseKind(u)
        const level = sm.level ?? own ?? topicLevel
        const nth = kindSeen.get(kind) ?? 0
        kindSeen.set(kind, nth + 1)
        exercises[u.id] = {
          id: u.id,
          kind,
          mode: u.kind === 'quiz' ? u.mode : null,
          level,
          levelSource: sm.level ? 'section' : own ? 'exercise' : contentLevel ? 'topic' : 'default',
          tags: u.tags,
          topicId: tid,
          position,
          difficulty: deriveDifficulty({ unit: u, kind, position: nth, count: kindTotal.get(kind) ?? 1, topicKind, ownLevel: ladder === 'cefr' ? own : null, assignedLevel: level }),
          ...(ladder === 'cefr' ? { skill: exerciseSkill(u, kind, topicKind) } : declared ? withSkill(ownSkill(u, tid), topicSkill) : {}),
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
          icon: d.icon,
          title: d.title,
          items: d.items,
          minutes: d.minutes,
          level: maxLevel(levels) ?? topicLevel,
        }
      })

      const quizIds = units.filter(isTestable).map((u) => u.id)
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
        icon: iconRef(chapter.icon),
        level: topicLevel,
        tags: chapter.tags,
        ...(topicKind ? { kind: topicKind } : {}),
        ...(topicSkill ? { skill: topicSkill } : {}),
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
      icon: iconRef(sm.icon) ?? iconRef(guide.icon),
      guideId: guide.id,
      guideDir: guide.dir,
      level: maxLevel(topicLevels) ?? sm.level ?? DEFAULT_LEVEL[ladder],
      minLevel: minLevel(topicLevels) ?? sm.level ?? DEFAULT_LEVEL[ladder],
      minutes: topics.reduce((sum, t) => sum + t.minutes, 0),
      topics,
      exam,
    })
  })
  // Re-index after skipped (missing) sections so index == position.
  sections.forEach((s, i) => (s.index = i))

  // Sidebar «Теорія»: declared guides, or the guides the sections use (in order).
  const theory: string[] = []
  if (manifest.theory) {
    for (const from of manifest.theory) {
      const guide = findGuide(source, from)
      if (!guide) issues.push({ severity: 'error', code: 'missing-guide', where: 'theory', message: `theory: посібник «${from}» не знайдено` })
      else if (!theory.includes(guide.id)) theory.push(guide.id)
    }
  } else {
    for (const s of sections) if (!theory.includes(s.guideId)) theory.push(s.guideId)
  }
  if (topicsWithoutSkill.length > 0) {
    issues.push({ severity: 'warning', code: 'topic-skill', where: 'skills', message: `${topicsWithoutSkill.length} тем без навички (frontmatter skill: або skill: розділу): ${topicsWithoutSkill.slice(0, 4).join(', ')}${topicsWithoutSkill.length > 4 ? '…' : ''}` })
  }

  // the bank of the guides this course uses (sections, planned ones too, and theory)
  const courseGuides = new Set<string>(theory)
  for (const sm of manifest.sections) {
    const g = findGuide(source, sm.from)
    if (g) courseGuides.add(g.id)
  }
  const measured = declared ? new Set(placementSkillIds({ course: { kind, subject: manifest.subject, levels: manifest.levels, skills: manifest.skills }, placement: manifest.placement })) : null
  const bank = placementBank(source, courseGuides, ladder, issues, measured)
  for (const id of bank.chapterIds) chapterIds.push(id)
  const placement = bank.size > 0 ? bankPool(manifest, bank.items, ladder, measured) : placementPool(manifest, sections, exercises, quick, ladder)
  const stats = courseStats(sections, exercises, reels, ladder)
  const icons = [...new Set([iconRef(manifest.icon), ...sections.map((s) => s.icon), ...sections.flatMap((s) => s.topics.map((t) => t.icon))].filter((v): v is string => Boolean(v)))]

  const bundle: CourseBundle = {
    format: BUNDLE_FORMAT,
    course: {
      id: courseId,
      version: manifest.version,
      title: manifest.title,
      subtitle: manifest.subtitle ?? null,
      description: manifest.description ?? null,
      subject: manifest.subject,
      kind,
      practice: resolvePractice(kind, manifest.practice),
      language: manifest.language,
      ...(manifest.target ? { target: manifest.target } : kind === 'language' ? { target: manifest.language } : {}),
      icon: iconRef(manifest.icon),
      color: manifest.color ?? null,
      cover: manifest.cover ?? null,
      levels: manifest.levels,
      tags: manifest.tags,
      authors: manifest.authors,
      license: manifest.license ?? null,
      estimatedHours: manifest.estimatedHours ?? stats.hours,
      ...(skillDefs.length > 0 ? { skills: skillDefs } : {}),
    },
    exams: manifest.exams,
    sections,
    theory,
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

// Bank-mode defaults (course.yaml `placement: { pass, followUp }`, docs/COURSE_FORMAT.md §2).
export const PLACEMENT_PASS = 0.75
export const PLACEMENT_FOLLOW_UP = 6

const isSkill = (v: unknown): v is string => typeof v === 'string' && (PLACEMENT_SKILLS as readonly string[]).includes(v)

// Placement bank (docs/LANGUAGE_COURSE.md «Банк вступного тесту»): single-choice [!quiz] and [!listen] choice / answer
// items of the course guides' `_placement/` files, with level, skill and diff. Independent of the sections, so
// it measures levels whose lessons are still `status: planned`.
// `measured`: a course with declared skills — the bank's items must name one of them (`skill:` in the meta line).
function placementBank(source: CourseSource, guides: ReadonlySet<string>, ladder: LevelLadder, issues: CourseIssue[], measured: ReadonlySet<string> | null = null): { items: Map<string, PlacementItem>; size: number; chapterIds: string[] } {
  const items = new Map<string, PlacementItem>()
  const chapterIds: string[] = []
  const units = source.placementUnits
  if (!units) return { items, size: 0, chapterIds }
  for (const c of source.placementChapters?.values() ?? []) if (guides.has(c.guideId)) chapterIds.push(c.id)
  const problems = new Map<string, string[]>()
  const note = (problem: string, id: string) => {
    const list = problems.get(problem)
    if (list) list.push(id)
    else problems.set(problem, [id])
  }
  for (const u of units.values()) {
    if (!guides.has(u.guideId)) continue
    const single = u.kind === 'quiz' && (u.mode === 'single' || (u.mode === 'listen' && u.listen?.type !== 'dictation')) && u.options.filter((o) => o.correct).length === 1
    if (u.kind !== 'quiz' || !single) {
      note('пропущено: не один правильний варіант або не [!quiz] / [!listen] choice', u.id)
      continue
    }
    // courses with skills: `noob` / `god` aren't content levels (src/content/model.ts) — the bank file's name
    // (`_placement/noob.md`) gives the level then
    const level = toCourseLevel(u.level, ladder) ?? (measured ? bankFileLevel(source, u.chapterId, ladder) : null)
    if (!level) {
      note('пропущено: немає рівня (level: у рядку мета або frontmatter)', u.id)
      continue
    }
    if (measured) {
      if (!u.skill) {
        note('пропущено: немає skill:', u.id)
        continue
      }
      if (!measured.has(u.skill)) {
        issues.push({ severity: 'error', code: 'unknown-skill', where: 'placement', message: `Банк вступного тесту: ${u.id} — невідома навичка «${u.skill}» (${[...measured].join(', ')})` })
        continue
      }
    }
    let skill: string = u.mode === 'listen' ? 'listening' : 'grammar'
    if (measured) skill = u.skill!
    else if (isSkill(u.skill)) skill = u.skill
    else note(u.skill ? `невідома skill «${u.skill}» (grammar | vocabulary | reading | listening), взято ${skill}` : `немає skill:, взято ${skill}`, u.id)
    let diff = 2
    if (u.diff === 1 || u.diff === 2 || u.diff === 3) diff = u.diff
    else note('немає або хибний diff: (1 | 2 | 3), взято 2', u.id)
    items.set(u.id, { level, skill, diff, options: u.options.length })
  }
  for (const [problem, ids] of problems) {
    issues.push({ severity: 'warning', code: 'placement-bank', where: 'placement', message: `Банк вступного тесту: ${ids.length} питань — ${problem}: ${ids.slice(0, 4).join(', ')}${ids.length > 4 ? '…' : ''}` })
  }
  return { items, size: items.size, chapterIds }
}

function bankFileLevel(source: CourseSource, chapterId: string, ladder: LevelLadder): Level | null {
  const file = source.placementChapters?.get(chapterId)?.path
  if (!file) return null
  const name = file.split('/').pop()!.replace(/\.md$/i, '')
  return toCourseLevel(name, ladder)
}

function bankPool(manifest: CourseManifest, items: ReadonlyMap<string, PlacementItem>, ladder: LevelLadder, measured: ReadonlySet<string> | null): PlacementPool {
  const { enabled, maxQuestions, perLevel } = manifest.placement
  const ids = [...items.keys()].sort()
  const pool = byLevel((l) => (enabled ? ids.filter((id) => items.get(id)!.level === l) : []), LADDERS[ladder])
  const bank: Record<string, PlacementItem> = {}
  for (const id of ids) bank[id] = items.get(id)!
  const extra = measured ? { ...(manifest.placement.perSkill ? { perSkill: true } : {}), skills: [...measured] } : {}
  return { enabled, maxQuestions, perLevel, pool, bank, pass: manifest.placement.pass ?? PLACEMENT_PASS, followUp: manifest.placement.followUp ?? PLACEMENT_FOLLOW_UP, ...extra }
}

const PLACEMENT_KINDS = new Set<ExerciseKind>(['quiz', 'listen', 'pair'])

function placementPool(manifest: CourseManifest, sections: readonly Section[], exercises: Record<string, ExerciseRef>, quickIds: ReadonlySet<string>, ladder: LevelLadder): PlacementPool {
  const quick = byLevel((): string[] => [])
  const other = byLevel((): string[] => [])
  for (const s of sections) {
    if (s.kind !== 'path') continue
    for (const t of s.topics) {
      // the topic test pool: auto-graded, no [!speak]
      const testable = new Set(t.test?.pool ?? [])
      for (const id of t.exercises) {
        const ex = exercises[id]!
        if (!PLACEMENT_KINDS.has(ex.kind) || !testable.has(id)) continue
        ;(quickIds.has(id) ? quick : other)[ex.level].push(id)
      }
    }
  }
  const { enabled, maxQuestions, perLevel } = manifest.placement
  const pool = byLevel((l) => (!enabled ? [] : quick[l].length >= perLevel ? quick[l] : [...quick[l], ...other[l]]), LADDERS[ladder])
  return { enabled, maxQuestions, perLevel, pool }
}

function courseStats(sections: readonly Section[], exercises: Record<string, ExerciseRef>, reels: Record<string, ReelRef>, ladder: LevelLadder): CourseStats {
  const list = Object.values(exercises)
  const count = (kind: ExerciseKind) => list.filter((e) => e.kind === kind).length
  const topics = sections.flatMap((s) => s.topics)
  const lessons = topics.reduce((sum, t) => sum + t.lessons.length, 0)
  // a test/exam takes ~0.6 min per question
  const examMinutes = topics.reduce((sum, t) => sum + (t.test ? t.test.questions * PACE.quiz : 0), 0) + sections.reduce((sum, s) => sum + (s.exam ? s.exam.questions * PACE.quiz : 0), 0)
  const minutes = Math.round(topics.reduce((sum, t) => sum + t.minutes, 0) + examMinutes)
  const levels = byLevel((l) => list.filter((e) => e.level === l).length, LADDERS[ladder])
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
    ...(ladder === 'cefr' ? { words: count('word'), listening: count('listen'), speaking: count('speak'), pairs: count('pair') } : {}),
  }
}

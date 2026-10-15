import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { chapterLessons } from '@/content/lessons'
import { loadSnapshot, type ContentSnapshot } from '@/content/store'
import {
  compileCourse,
  CourseBundleSchema,
  legacyLessonId,
  legacyLessonMap,
  lessonIdFromLegacy,
  parseCourseYaml,
  parseLessonId,
  type CourseBundle,
  type CourseManifest,
  type Topic,
} from '@/course'

const vaultPath = path.resolve(__dirname, '../fixtures/course-vault')
let snap: ContentSnapshot
let manifest: CourseManifest
let bundle: CourseBundle

const topic = (key: string): Topic => bundle.sections.flatMap((s) => s.topics).find((t) => t.key === key)!
const sequence = (t: Topic) => t.lessons.map((l) => `${l.kind}-${l.n}`)

beforeAll(async () => {
  snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
  manifest = parseCourseYaml(readFileSync(path.join(vaultPath, 'Courses/fixture-course/course.yaml'), 'utf8')).manifest!
  bundle = compileCourse(manifest, snap)
})

describe('compileCourse', () => {
  it('builds sections → topics with stable ids', () => {
    expect(bundle.sections.map((s) => s.id)).toEqual(['fixture-course:basics', 'fixture-course:advanced', 'fixture-course:practice'])
    expect(bundle.sections.map((s) => s.topics.map((t) => t.key))).toEqual([['al-ch-01', 'alpha-02'], ['al-ch-03'], ['bank-01']])
    const first = topic('al-ch-01')
    expect(first.id).toBe('fixture-course:basics:al-ch-01')
    expect(first.lessons[0]!.id).toBe('fixture-course:basics:al-ch-01:theory-1')
    expect(parseLessonId(first.lessons[2]!.id)).toEqual({ courseId: 'fixture-course', sectionKey: 'basics', topicKey: 'al-ch-01', kind: 'core', n: 1 })
    expect(first.icon).toBe('🥇')
  })

  it('weaves tasks in document order instead of piling them at the end', () => {
    // quiz 1 (pretest) · quizzes 2–4 · task 1 · quizzes 5–6 · interview · cards · task 2
    expect(sequence(topic('al-ch-01'))).toEqual(['theory-1', 'start-1', 'core-1', 'code-1', 'core-2', 'cards-1', 'code-2', 'interview-1'])
    // a task before any quiz comes right after the theory
    expect(sequence(topic('alpha-02'))).toEqual(['theory-1', 'code-1', 'start-1', 'core-1'])
    const code = topic('al-ch-01').lessons.filter((l) => l.kind === 'code')
    expect(code.map((l) => l.items)).toEqual([[{ kind: 'unit', id: 'al-01-task-01' }], [{ kind: 'unit', id: 'al-01-task-02' }]])
    expect(code[0]!.title).toBe('Задача посередині')
  })

  it('keeps lesson contents of the old generator (start, cores with cards, reels)', () => {
    const t = topic('al-ch-01')
    const core1 = t.lessons.find((l) => l.kind === 'core' && l.n === 1)!
    expect(core1.items.filter((i) => i.kind === 'unit').map((i) => i.id)).toEqual(['al-01-quiz-02', 'al-01-001', 'al-01-quiz-03', 'al-01-002', 'al-01-quiz-04'])
    expect(t.lessons.find((l) => l.kind === 'start')!.items.map((i) => i.kind)).toEqual(['reel', 'unit', 'reel'])
    expect(t.lessons.find((l) => l.kind === 'interview')!.items).toEqual([{ kind: 'unit', id: 'al-01-int-01' }])
  })

  it('turns practice sections into theory-less pools without tests', () => {
    const practice = bundle.sections[2]!
    expect(practice.kind).toBe('practice')
    expect(practice.exam).toBeNull()
    const t = practice.topics[0]!
    expect(t.lessons.some((l) => l.kind === 'theory')).toBe(false)
    expect(t.test).toBeNull()
    expect(t.exercises).toEqual(['bk-01-000', 'bk-01-001', 'bk-01-002', 'bk-01-quiz-01'])
  })

  it('creates topic tests and section exams from the pools', () => {
    const t = topic('al-ch-01')
    expect(t.test).toEqual({
      id: 'fixture-course:basics:al-ch-01:test',
      questions: 4,
      pass: 0.75,
      pool: ['al-01-quiz-01', 'al-01-quiz-02', 'al-01-quiz-03', 'al-01-quiz-04', 'al-01-quiz-05', 'al-01-quiz-06'],
      fallback: [],
    })
    // thin quiz pool → topped up with self-graded cards
    expect(topic('alpha-02').test).toMatchObject({ questions: 3, pool: ['al-02-quiz-01', 'al-02-quiz-02'], fallback: ['al-02-001'] })
    const exam = bundle.sections[0]!.exam!
    expect(exam).toMatchObject({ id: 'fixture-course:basics:exam', questions: 6, pass: 0.8, testOut: true })
    expect(Object.keys(exam.pool)).toEqual(['fixture-course:basics:al-ch-01', 'fixture-course:basics:alpha-02'])
  })

  it('indexes exercises with mapped levels', () => {
    const ex = bundle.exercises
    expect(ex['al-01-quiz-06']).toMatchObject({ kind: 'quiz', mode: 'single', level: 'senior', levelSource: 'exercise', topicId: 'fixture-course:basics:al-ch-01' })
    expect(ex['al-03-quiz-03']!.level).toBe('god') // techlead → god
    expect(ex['al-01-int-01']!.kind).toBe('interview')
    expect(ex['al-01-task-01']).toMatchObject({ kind: 'task', autoTested: true, difficulty: 'easy', minutes: 10 })
    expect(ex['bk-01-000']).toMatchObject({ level: 'middle', levelSource: 'topic' })
    expect(topic('al-ch-03').level).toBe('senior')
    expect(bundle.sections[0]!).toMatchObject({ level: 'middle', minLevel: 'junior' })
  })

  it('applies a section level override to every topic and exercise', () => {
    const forced = compileCourse({ ...manifest, sections: [{ ...manifest.sections[0]!, level: 'noob' }] }, snap)
    const s = forced.sections[0]!
    expect(s.level).toBe('noob')
    expect(Object.values(forced.exercises).every((e) => e.level === 'noob' && e.levelSource === 'section')).toBe(true)
    expect(forced.placement.pool.noob).toContain('al-01-quiz-01')
  })

  it('collects stats, icons and the placement pool', () => {
    expect(bundle.stats).toMatchObject({ sections: 3, topics: 4, quizzes: 12, flashcards: 10, interview: 1, tasks: 3, autoTestedTasks: 3, reels: 3, topicTests: 3, sectionExams: 2 })
    expect(bundle.stats.lessons).toBe(bundle.sections.flatMap((s) => s.topics).reduce((n, t) => n + t.lessons.length, 0))
    expect(bundle.course.estimatedHours).toBe(bundle.stats.hours)
    expect(bundle.icons).toEqual(['si:SiJavascript', '🧱', '🥇'])
    expect(bundle.placement.pool.junior).toEqual(['al-01-quiz-01', 'al-01-quiz-02', 'al-01-quiz-03', 'al-01-quiz-05'])
    expect(bundle.placement.pool.noob).toEqual([])
  })

  it('is deterministic and matches the bundle schema', () => {
    const again = compileCourse(manifest, snap)
    expect(JSON.stringify(again)).toBe(JSON.stringify(bundle))
    expect(CourseBundleSchema.safeParse(JSON.parse(JSON.stringify(bundle))).success).toBe(true)
  })
})

describe('legacy lesson ids', () => {
  it('maps old <chapterId>::<kind>-n ids to course lesson ids', () => {
    expect(legacyLessonId(bundle, 'fixture-course:basics:al-ch-01:core-2')).toBe('al-ch-01::core-2')
    expect(lessonIdFromLegacy(bundle, 'al-ch-01::code-1')).toBe('fixture-course:basics:al-ch-01:code-1')
    const bankChapter = snap.guideById.get('bank')!.chapterIds[0]!
    expect(lessonIdFromLegacy(bundle, `${bankChapter}::theory-1`)).toBeNull()
    expect(legacyLessonMap(bundle).size).toBe(bundle.stats.lessons)
  })

  it('every old lesson of a path topic has a twin with the same items', () => {
    for (const t of bundle.sections.filter((s) => s.kind === 'path').flatMap((s) => s.topics)) {
      const chapter = snap.chapters.get(t.chapterId)!
      const old = chapterLessons(chapter, snap.unitsByChapter.get(chapter.id) ?? [], snap.reels.filter((r) => r.chapterId === chapter.id), snap.units)
      for (const lesson of old) {
        const id = lessonIdFromLegacy(bundle, lesson.id)
        expect(id, lesson.id).not.toBeNull()
        const twin = t.lessons.find((l) => l.id === id)!
        expect(twin.items).toEqual(lesson.items)
      }
      expect(old.length).toBe(t.lessons.length)
    }
  })
})

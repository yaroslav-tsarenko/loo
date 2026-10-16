import type { CourseBundle, Lesson, LessonKind, Level, Section, Topic } from '../schema'
import { selectForLevel, type LevelView } from './level'
import { testOutEligible, type TestOutCheck } from './tests'

// The learner's path through a compiled course (pure: progress comes in as sets/maps, no DB).
// Section → topic → lessons (tasks already woven in by the compiler) → 🏁 topic test; 👑 section exam at the end.
//
// * A path section unlocks when the previous path section is done (its exam passed, or — without an exam — every
//   required node done), or when the placement test started the learner further ahead. Practice banks never lock.
// * A section whose exam was passed (test-out) or that placement skipped is «known»: its unfinished nodes count as
//   done (`skipped`). Locking is advisory in the UI — lessons of a locked section still open, the path just suggests
//   finishing the current section or testing out.
// * Below-level lessons (selectForLevel → optional) are shown but not required; the theory lesson counts as done
//   once the chapter is marked studied or any practice lesson of the topic is done.

export interface ResultRecord {
  bestScore: number
  passed: boolean
  testOut?: boolean
}

export interface PathProgress {
  // completed course lesson ids, and the flawless ones
  lessons: ReadonlySet<string>
  perfect?: ReadonlySet<string>
  // chapter ids marked as studied in the reader (📖 theory lessons)
  studied: ReadonlySet<string>
  // by test / exam id
  tests: ReadonlyMap<string, ResultRecord>
  exams: ReadonlyMap<string, ResultRecord>
  // placement: index of the first section to study; earlier path sections count as known
  placementSection?: number | null
}

export type PathState = 'done' | 'current' | 'open' | 'locked'

interface NodeBase {
  id: string
  done: boolean
  // counted as done because the section is known (placement / test-out), not actually completed
  skipped: boolean
  current: boolean
  required: boolean
}

export interface PathLessonNode extends NodeBase {
  type: 'lesson'
  lesson: Lesson
  kind: LessonKind
  size: number
  minutes: number
  perfect: boolean
  optional: boolean
  challenge: boolean
  condensed: boolean
}

export interface PathTestNode extends NodeBase {
  type: 'test'
  questions: number
  pass: number
  bestScore: number | null
}

export interface PathExamNode extends NodeBase {
  type: 'exam'
  questions: number
  pass: number
  bestScore: number | null
  testOut: TestOutCheck
}

export type PathNode = PathLessonNode | PathTestNode | PathExamNode

export interface PathTopicView {
  topic: Topic
  nodes: Array<PathLessonNode | PathTestNode>
  state: PathState
  done: number
  total: number
}

export interface PathSectionView {
  section: Section
  state: PathState
  known: 'placement' | 'exam' | null
  topics: PathTopicView[]
  exam: PathExamNode | null
  done: number
  total: number
  ratio: number
}

export interface PathCursor {
  type: PathNode['type']
  id: string
  sectionId: string
  topicId: string | null
  lesson: Lesson | null
}

export interface CoursePathView {
  level: Level
  levelView: LevelView
  sections: PathSectionView[]
  // first required unfinished node along the path
  current: PathCursor | null
  // first required unfinished practice lesson (no theory, no tests) — the «continue» target of lesson-only flows
  nextLesson: PathCursor | null
  done: number
  total: number
  // required practice lessons left in the whole course
  lessonsLeft: number
  lessonsTotal: number
  ratio: number
}

export function buildCoursePath(bundle: CourseBundle, level: Level, progress: PathProgress): CoursePathView {
  const levelView = selectForLevel(bundle, level)
  const placement = progress.placementSection ?? null
  const passedSections = bundle.sections.filter((s) => s.exam && progress.exams.get(s.exam.id)?.passed).map((s) => s.id)
  const sections: PathSectionView[] = []
  let prevPathDone = true

  for (const section of bundle.sections) {
    const path = section.kind === 'path'
    const examPassed = Boolean(section.exam && progress.exams.get(section.exam.id)?.passed)
    const known: PathSectionView['known'] = !path ? null : examPassed ? 'exam' : placement !== null && section.index < placement ? 'placement' : null
    const unlocked = !path || known !== null || prevPathDone || (placement !== null && section.index <= placement)
    const topics: PathTopicView[] = []

    for (const topic of section.topics) {
      const practiceDone = topic.lessons.some((l) => l.kind !== 'theory' && progress.lessons.has(l.id))
      const nodes: Array<PathLessonNode | PathTestNode> = []
      for (const lesson of topic.lessons) {
        const view = levelView.lessons[lesson.id]
        if (!view) continue
        if (lesson.kind !== 'theory' && view.items.length === 0) continue
        const real = lesson.kind === 'theory' ? progress.studied.has(topic.chapterId) || practiceDone : progress.lessons.has(lesson.id)
        nodes.push({
          type: 'lesson',
          id: lesson.id,
          lesson,
          kind: lesson.kind,
          size: view.items.length,
          minutes: view.minutes,
          done: real || known !== null,
          skipped: !real && known !== null,
          current: false,
          required: !view.optional,
          perfect: progress.perfect?.has(lesson.id) ?? false,
          optional: view.optional,
          challenge: view.challenge,
          condensed: view.condensed,
        })
      }
      if (topic.test) {
        const record = progress.tests.get(topic.test.id)
        const passed = Boolean(record?.passed)
        nodes.push({
          type: 'test',
          id: topic.test.id,
          questions: topic.test.questions,
          pass: topic.test.pass,
          bestScore: record ? record.bestScore : null,
          done: passed || known !== null,
          skipped: !passed && known !== null,
          current: false,
          required: true,
        })
      }
      const required = nodes.filter((n) => n.required)
      topics.push({ topic, nodes, state: 'open', done: required.filter((n) => n.done).length, total: required.length })
    }

    let exam: PathExamNode | null = null
    if (section.exam) {
      const record = progress.exams.get(section.exam.id)
      exam = {
        type: 'exam',
        id: section.exam.id,
        questions: section.exam.questions,
        pass: section.exam.pass,
        bestScore: record ? record.bestScore : null,
        done: examPassed || known !== null,
        skipped: !examPassed && known !== null,
        current: false,
        required: true,
        testOut: testOutEligible(bundle, section.id, { passedSections }),
      }
    }

    const done = topics.reduce((s, t) => s + t.done, 0) + (exam?.done ? 1 : 0)
    const total = topics.reduce((s, t) => s + t.total, 0) + (exam ? 1 : 0)
    const complete = known !== null || (exam ? exam.done : done === total)
    for (const t of topics) t.state = !unlocked ? 'locked' : t.done === t.total ? 'done' : 'open'
    sections.push({ section, state: !unlocked ? 'locked' : complete ? 'done' : 'open', known, topics, exam, done, total, ratio: total > 0 ? done / total : complete ? 1 : 0 })
    if (path) prevPathDone = complete
  }

  let current: PathCursor | null = null
  let nextLesson: PathCursor | null = null
  let lessonsLeft = 0
  let lessonsTotal = 0
  for (const s of sections) {
    for (const t of s.topics) {
      for (const n of t.nodes) {
        if (n.type === 'lesson' && n.kind !== 'theory' && n.required) {
          lessonsTotal++
          if (!n.done) lessonsLeft++
        }
        if (s.state === 'locked' || n.done || !n.required) continue
        const cursor: PathCursor = { type: n.type, id: n.id, sectionId: s.section.id, topicId: t.topic.id, lesson: n.type === 'lesson' ? n.lesson : null }
        if (!current) {
          current = cursor
          n.current = true
          t.state = 'current'
          s.state = 'current'
        }
        if (!nextLesson && n.type === 'lesson' && n.kind !== 'theory') nextLesson = cursor
      }
    }
    if (s.exam && !current && s.state !== 'locked' && !s.exam.done) {
      current = { type: 'exam', id: s.exam.id, sectionId: s.section.id, topicId: null, lesson: null }
      s.exam.current = true
      s.state = 'current'
    }
  }

  // Practice banks never lock: don't let them pull the «next lesson» away from the section being studied.
  if (current && nextLesson && nextLesson.sectionId !== current.sectionId) nextLesson = null

  const done = sections.reduce((sum, s) => sum + s.done, 0)
  const total = sections.reduce((sum, s) => sum + s.total, 0)
  return { level, levelView, sections, current, nextLesson, done, total, lessonsLeft, lessonsTotal, ratio: total > 0 ? done / total : 0 }
}

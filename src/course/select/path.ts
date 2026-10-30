import { courseLevels, levelRank, type CourseBundle, type Lesson, type LessonKind, type Level, type Section, type Topic } from '../schema'
import { selectForLevel, type LevelView } from './level'
import { thetaLevel } from './skills'
import { testOutEligible, type TestOutCheck } from './tests'

// The learner's path through a compiled course (pure: progress comes in as sets/maps, no DB).
// Section → topic → lessons (tasks already woven in by the compiler) → topic test; section exam at the end.
//
// * A path section unlocks when the previous path section is done (its exam passed, or — without an exam — every
//   required node done), or when the placement test started the learner further ahead. Practice banks never lock.
// * A section whose exam was passed (test-out) or that placement skipped is «known»: its unfinished nodes count as
//   done (`skipped`). Locking is advisory in the UI — lessons of a locked section still open, the path just suggests
//   finishing the current section or testing out.
// * Below-level lessons (selectForLevel → optional) are shown but not required; the theory lesson counts as done
//   once the chapter is marked studied or any practice lesson of the topic is done.
// * Courses with a skill model (progress.skills): a topic whose level is below the learner's level in the topic's
//   skill is «known» — shown, every node optional (its test can confirm it); a section whose topics are all known is
//   complete (`known: 'skills'`). So the next step is the first topic not known, in course order. `recommended` —
//   one unfinished, not known topic per skill, weakest skills first.

export interface ResultRecord {
  bestScore: number
  passed: boolean
  testOut?: boolean
}

export interface PathProgress {
  // completed course lesson ids, and the flawless ones
  lessons: ReadonlySet<string>
  perfect?: ReadonlySet<string>
  // chapter ids marked as studied in the reader (theory lessons)
  studied: ReadonlySet<string>
  // by test / exam id
  tests: ReadonlyMap<string, ResultRecord>
  exams: ReadonlyMap<string, ResultRecord>
  // placement: index of the first section to study; earlier path sections count as known
  placementSection?: number | null
  // courses with a skill model: θ per skill (src/course/select/skills.ts → skillThetas); absent → no known topics
  skills?: PathSkills | null
}

export interface PathSkills {
  thetas: Partial<Record<string, number>>
}

// How many topics «recommended» offers.
export const RECOMMENDED = 3

// Known: the topic's skill level (θ on the course ladder) is above the topic's level.
export function topicKnown(topic: Pick<Topic, 'level' | 'skill'>, skills: PathSkills | null | undefined, levels: readonly Level[]): boolean {
  if (!skills || !topic.skill) return false
  const theta = skills.thetas[topic.skill]
  if (theta === undefined) return false
  return levelRank(topic.level) < levelRank(thetaLevel(theta, levels))
}

// Topic ids the learner knows already (courses with a skill model), in course order.
export function knownTopics(bundle: CourseBundle, skills: PathSkills | null | undefined): string[] {
  const levels = courseLevels(bundle.course)
  return bundle.sections.flatMap((s) => (s.kind === 'path' && s.status !== 'planned' ? s.topics.filter((t) => topicKnown(t, skills, levels)).map((t) => t.id) : []))
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
  // below the learner's level in its skill: every node optional
  known: boolean
  state: PathState
  done: number
  total: number
}

export interface PathSectionView {
  section: Section
  // course.yaml `status: planned`: shown as «скоро», nothing to study yet
  planned: boolean
  state: PathState
  // skills: every topic of the section is known by the learner's skill levels
  known: 'placement' | 'exam' | 'skills' | null
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
  // courses with a skill model: unfinished topics to do next, one per skill, weakest skills first
  recommended: string[]
}

export function buildCoursePath(bundle: CourseBundle, level: Level, progress: PathProgress): CoursePathView {
  const levelView = selectForLevel(bundle, level)
  const ladder = courseLevels(bundle.course)
  const placement = progress.placementSection ?? null
  const passedSections = bundle.sections.filter((s) => s.exam && progress.exams.get(s.exam.id)?.passed).map((s) => s.id)
  const sections: PathSectionView[] = []
  let prevPathDone = true

  for (const section of bundle.sections) {
    if (section.status === 'planned') {
      sections.push({ section, planned: true, state: 'locked', known: null, topics: [], exam: null, done: 0, total: 0, ratio: 0 })
      if (section.kind === 'path') prevPathDone = false
      continue
    }
    const path = section.kind === 'path'
    const examPassed = Boolean(section.exam && progress.exams.get(section.exam.id)?.passed)
    const known: PathSectionView['known'] = !path ? null : examPassed ? 'exam' : placement !== null && section.index < placement ? 'placement' : null
    const unlocked = !path || known !== null || prevPathDone || (placement !== null && section.index <= placement)
    const topics: PathTopicView[] = []

    for (const topic of section.topics) {
      const topicIsKnown = path && topicKnown(topic, progress.skills, ladder)
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
          required: !view.optional && !topicIsKnown,
          perfect: progress.perfect?.has(lesson.id) ?? false,
          optional: view.optional || topicIsKnown,
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
          required: !topicIsKnown,
        })
      }
      const required = nodes.filter((n) => n.required)
      topics.push({ topic, nodes, known: topicIsKnown, state: 'open', done: required.filter((n) => n.done).length, total: required.length })
    }

    // every topic known by skill level: the section counts as complete (its exam stays available, not required)
    const allKnown = path && topics.length > 0 && topics.every((t) => t.known)
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
        required: !allKnown || known !== null,
        testOut: testOutEligible(bundle, section.id, { passedSections }),
      }
    }

    const examCounts = exam !== null && exam.required
    const done = topics.reduce((s, t) => s + t.done, 0) + (examCounts && exam?.done ? 1 : 0)
    const total = topics.reduce((s, t) => s + t.total, 0) + (examCounts ? 1 : 0)
    const complete = known !== null || allKnown || (exam ? exam.done : done === total)
    // a known topic is «done» only when its nodes actually are; otherwise open (optional)
    for (const t of topics) t.state = !unlocked ? 'locked' : t.known ? (t.nodes.every((n) => n.done) ? 'done' : 'open') : t.done === t.total ? 'done' : 'open'
    sections.push({ section, planned: false, state: !unlocked ? 'locked' : complete ? 'done' : 'open', known: known ?? (allKnown ? 'skills' : null), topics, exam, done, total, ratio: total > 0 ? done / total : complete ? 1 : 0 })
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
    if (s.exam && s.exam.required && !current && s.state !== 'locked' && !s.exam.done) {
      current = { type: 'exam', id: s.exam.id, sectionId: s.section.id, topicId: null, lesson: null }
      s.exam.current = true
      s.state = 'current'
    }
  }

  // Practice banks never lock: don't let them pull the «next lesson» away from the section being studied.
  if (current && nextLesson && nextLesson.sectionId !== current.sectionId) nextLesson = null

  const done = sections.reduce((sum, s) => sum + s.done, 0)
  const total = sections.reduce((sum, s) => sum + s.total, 0)
  return { level, levelView, sections, current, nextLesson, done, total, lessonsLeft, lessonsTotal, ratio: total > 0 ? done / total : 0, recommended: recommendedTopics(sections, progress.skills) }
}

// One unfinished, not known topic per skill (course order inside the skill), weakest skills first (lowest θ; ties —
// the order the skills first appear on the path).
export function recommendedTopics(sections: readonly PathSectionView[], skills: PathSkills | null | undefined, n = RECOMMENDED): string[] {
  if (!skills) return []
  const firstOf = new Map<string, { id: string; at: number }>()
  let at = 0
  for (const s of sections) {
    if (s.planned || s.section.kind !== 'path') continue
    for (const t of s.topics) {
      at++
      const skill = t.topic.skill
      if (!skill || t.known || firstOf.has(skill) || skills.thetas[skill] === undefined) continue
      if (t.total > 0 && t.done >= t.total) continue
      firstOf.set(skill, { id: t.topic.id, at })
    }
  }
  return [...firstOf.entries()]
    .sort((a, b) => skills.thetas[a[0]]! - skills.thetas[b[0]]! || a[1].at - b[1].at)
    .slice(0, n)
    .map(([, v]) => v.id)
}

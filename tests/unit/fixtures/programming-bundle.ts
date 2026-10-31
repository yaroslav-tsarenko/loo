import { IT_LEVELS, type CourseBundle, type ExerciseRef, type Level, type PlacementItem, type Section, type Topic } from '@/course'

// A small synthetic programming bundle with a skill model (no Next.js content needed): one section per skill (like
// the Next.js course), one topic per level inside it, two quizzes per topic, a topic test and a section exam; an
// optional calibrated placement bank with `perPair` questions per (skill × level).

export interface SyntheticOptions {
  skills: readonly string[]
  levels?: readonly Level[]
  // bank questions per (skill × level); 0 — no bank (lesson-quiz placement)
  perPair?: number
  perSkill?: boolean
  maxQuestions?: number
  perLevel?: number
  // declare `course.skills` (false → a course without a skill model, like JavaScript)
  declare?: boolean
}

const DIFFS = [2, 1, 3, 2, 2, 3] as const

export function programmingBundle(opts: SyntheticOptions): CourseBundle {
  const levels = [...(opts.levels ?? IT_LEVELS)]
  const id = 'syn'
  const exercises: Record<string, ExerciseRef> = {}
  const sections: Section[] = opts.skills.map((skill, si) => {
    const sid = `${id}:${skill}`
    const topics: Topic[] = levels.map((level, ti) => {
      const tid = `${sid}:t${ti}`
      const ids = [`${skill}-${level}-q1`, `${skill}-${level}-q2`]
      ids.forEach((eid, position) => {
        exercises[eid] = {
          id: eid,
          kind: 'quiz',
          mode: 'single',
          level,
          levelSource: 'topic',
          tags: [],
          topicId: tid,
          position,
          difficulty: 'medium',
          ...(opts.declare === false ? {} : { skill }),
          autoTested: false,
          minutes: 0.6,
        }
      })
      const lesson = (kind: 'theory' | 'core', n: number, items: string[]) => ({
        id: `${tid}:${kind}-${n}`,
        legacyId: `${tid}::${kind}-${n}`,
        topicId: tid,
        index: kind === 'theory' ? 0 : 1,
        kind,
        n,
        icon: 'px:book',
        title: kind,
        items: items.map((x) => ({ kind: 'unit' as const, id: x })),
        minutes: 2,
        level,
      })
      return {
        id: tid,
        key: `t${ti}`,
        sectionId: sid,
        index: ti,
        chapterId: `${skill}-ch-${ti}`,
        guideId: 'syn',
        title: `${skill} ${level}`,
        number: ti + 1,
        icon: null,
        level,
        tags: [],
        ...(opts.declare === false ? {} : { skill }),
        minutes: 4,
        exercises: ids,
        reels: [],
        lessons: [lesson('theory', 1, []), lesson('core', 1, ids)],
        test: { id: `${tid}:test`, questions: 2, pass: 0.8, pool: ids, fallback: [] },
      }
    })
    return {
      id: sid,
      key: skill,
      index: si,
      kind: 'path',
      title: skill,
      description: null,
      icon: null,
      guideId: 'syn',
      guideDir: 'Syn',
      level: levels.at(-1)!,
      minLevel: levels[0]!,
      minutes: 20,
      topics,
      exam: { id: `${sid}:exam`, questions: 10, pass: 0.8, testOut: true, pool: Object.fromEntries(topics.map((t) => [t.id, t.exercises])), fallback: [] },
    }
  })
  const bank: Record<string, PlacementItem> = {}
  const pool: Partial<Record<Level, string[]>> = {}
  for (const level of levels) {
    pool[level] = []
    for (const skill of opts.skills) {
      for (let i = 0; i < (opts.perPair ?? 0); i++) {
        const qid = `pl-${skill}-${level}-${i}`
        bank[qid] = { level, skill, diff: DIFFS[i % DIFFS.length]!, options: 4 }
        pool[level]!.push(qid)
      }
    }
    pool[level]!.sort()
  }
  const hasBank = (opts.perPair ?? 0) > 0
  return {
    format: 1,
    course: {
      id,
      version: '0.1.0',
      title: 'Synthetic',
      subtitle: null,
      description: null,
      subject: 'programming',
      kind: 'programming',
      practice: ['path'],
      language: 'uk',
      icon: null,
      color: null,
      cover: null,
      levels,
      tags: [],
      authors: [],
      license: null,
      estimatedHours: 1,
      ...(opts.declare === false ? {} : { skills: opts.skills.map((s) => ({ id: s, title: `Навичка ${s}` })) }),
    },
    exams: { topic: { questions: 2, pass: 0.8 }, section: { questions: 10, pass: 0.8, testOut: true } },
    sections,
    theory: ['syn'],
    exercises,
    reels: {},
    placement: hasBank
      ? { enabled: true, maxQuestions: opts.maxQuestions ?? 36, perLevel: opts.perLevel ?? 3, pool, bank, pass: 0.75, followUp: 6, ...(opts.perSkill ? { perSkill: true } : {}), skills: [...opts.skills] }
      : { enabled: true, maxQuestions: opts.maxQuestions ?? 20, perLevel: opts.perLevel ?? 3, pool: Object.fromEntries(levels.map((l) => [l, Object.values(exercises).filter((e) => e.level === l).map((e) => e.id)])) },
    icons: [],
    stats: { sections: sections.length, topics: 0, lessons: 0, exercises: 0, quizzes: 0, flashcards: 0, interview: 0, tasks: 0, autoTestedTasks: 0, reels: 0, topicTests: 0, sectionExams: 0, minutes: 0, hours: 0, byLevel: {} },
  }
}

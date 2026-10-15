import type { LearningUnit } from '@/content/model'
import type { LessonItem, LessonKind } from '../schema'

// Topic → Duolingo-style lessons, deterministic (evolution of src/content/lessons.ts):
// 📖 theory → 🤔 start → 🔬 core × n → 🧠 cards × n → 🎤 interview, with every 🛠️ task woven in
// right after the last lesson whose material precedes the task in the document.
// Kinds and numbering match the old generator, so old lesson ids map 1:1 (see ids.ts).

export interface DraftLesson {
  kind: LessonKind
  n: number
  emoji: string
  title: string
  items: LessonItem[]
  minutes: number
}

export interface TopicLessonInput {
  // units in document order
  units: readonly LearningUnit[]
  reelIds: readonly string[]
  theory: boolean
  theoryMinutes: number
  minutesOf: (unit: LearningUnit) => number
}

export const PACE = { reel: 0.3, quiz: 0.6, flashcard: 0.4, task: 10 } as const
export const QUIZZES_PER_CORE = 3
export const CARDS_PER_CORE = 2
export const CARDS_PER_LESSON = 6
export const INTERVIEW_PER_LESSON = 4

export function isInterviewUnit(unit: LearningUnit): boolean {
  return unit.kind === 'flashcard' && unit.qtype === 'співбесіда'
}

const chunk = <T>(items: readonly T[], size: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

const shortTitle = (title: string) => (title.length > 48 ? `${title.slice(0, 46)}…` : title)

interface Anchored {
  lesson: DraftLesson
  // max document position of the units that drive the lesson; -1 = before everything
  anchor: number
}

export function topicLessons(input: TopicLessonInput): DraftLesson[] {
  const position = new Map(input.units.map((u, i) => [u.id, i]))
  const pos = (u: LearningUnit) => position.get(u.id) ?? Number.MAX_SAFE_INTEGER
  const quizzes = input.units.filter((u) => u.kind === 'quiz')
  const cards = input.units.filter((u) => u.kind === 'flashcard' && !isInterviewUnit(u))
  const interview = input.units.filter(isInterviewUnit)
  const tasks = input.units.filter((u) => u.kind === 'task')
  const reelQueue = [...input.reelIds]
  const byId = new Map(input.units.map((u) => [u.id, u]))

  const unit = (u: LearningUnit): LessonItem => ({ kind: 'unit', id: u.id })
  const reel = (): LessonItem[] => {
    const id = reelQueue.shift()
    return id ? [{ kind: 'reel', id }] : []
  }
  const minutes = (items: LessonItem[]) => {
    let m = 0
    for (const item of items) m += item.kind === 'reel' ? PACE.reel : input.minutesOf(byId.get(item.id)!)
    return Math.max(1, Math.round(m))
  }
  const draft = (kind: LessonKind, n: number, emoji: string, title: string, items: LessonItem[]): DraftLesson => ({
    kind,
    n,
    emoji,
    title,
    items,
    minutes: kind === 'theory' ? Math.max(1, Math.round(input.theoryMinutes)) : minutes(items),
  })

  const path: Anchored[] = []
  if (input.theory) path.push({ lesson: draft('theory', 1, '📖', 'Теорія: читати розділ', []), anchor: -1 })

  // The first quiz is the «🤔 Передбач» pretest.
  if (quizzes[0]) path.push({ lesson: draft('start', 1, '🤔', 'Передбач і розберись', [...reel(), unit(quizzes[0]), ...reel()]), anchor: pos(quizzes[0]) })

  const cores = chunk(quizzes.slice(1), QUIZZES_PER_CORE)
  const cardQueue = [...cards]
  cores.forEach((group, i) => {
    const items: LessonItem[] = []
    group.forEach((q, j) => {
      items.push(unit(q))
      if (j < CARDS_PER_CORE && cardQueue.length > 0) items.push(unit(cardQueue.shift()!))
    })
    items.push(...reel())
    path.push({ lesson: draft('core', i + 1, '🔬', cores.length > 1 ? `Розбір ${i + 1}` : 'Розбір', items), anchor: Math.max(...group.map(pos)) })
  })

  chunk(cardQueue, CARDS_PER_LESSON).forEach((group, i, all) => {
    const items = [...group.map(unit), ...reel()]
    path.push({ lesson: draft('cards', i + 1, '🧠', all.length > 1 ? `Закріплення ${i + 1}` : 'Закріплення', items), anchor: Math.max(...group.map(pos)) })
  })

  // Leftover reels: a short bonus at the end of the last practice lesson (as before).
  const last = [...path].reverse().find((p) => p.lesson.kind === 'cards' || p.lesson.kind === 'core')
  if (last && reelQueue.length > 0) {
    last.lesson.items.push(...reelQueue.splice(0, 2).map((id): LessonItem => ({ kind: 'reel', id })))
    last.lesson.minutes = minutes(last.lesson.items)
  }

  // Weave tasks: a task goes after the longest prefix of the path whose material all precedes it,
  // so it never jumps ahead of a lesson that teaches something written later in the document.
  const after = new Map<number, DraftLesson[]>()
  tasks.forEach((t, i) => {
    const p = pos(t)
    let k = -1
    while (k + 1 < path.length && path[k + 1]!.anchor < p) k++
    const title = t.kind === 'task' ? t.titleText : 'Задача'
    const list = after.get(k) ?? []
    list.push(draft('code', i + 1, '🛠️', shortTitle(title || 'Задача'), [unit(t)]))
    after.set(k, list)
  })

  const out: DraftLesson[] = [...(after.get(-1) ?? [])]
  path.forEach((p, k) => out.push(p.lesson, ...(after.get(k) ?? [])))

  chunk(interview, INTERVIEW_PER_LESSON).forEach((group, i, all) => {
    out.push(draft('interview', i + 1, '🎤', all.length > 1 ? `Співбесіда ${i + 1}` : 'Співбесіда', group.map(unit)))
  })
  return out
}

import { LESSON_ICONS } from './icons'
import type { Chapter, Guide, LearningUnit } from './model'
import type { Reel } from './parse/reels'

// Duolingo-style lessons, derived deterministically from a chapter's own content.
// A chapter becomes: theory (the article) → start → core × n → cards × n → one code node per task → interview.

export type LessonKind = 'theory' | 'start' | 'core' | 'cards' | 'code' | 'interview'

export type LessonItemRef = { kind: 'reel'; id: string } | { kind: 'unit'; id: string }

export interface Lesson {
  id: string
  guideId: string
  chapterId: string
  index: number
  kind: LessonKind
  // icon ref (LESSON_ICONS)
  icon: string
  title: string
  items: LessonItemRef[]
  minutes: number
}

const PACE = { reel: 0.3, quiz: 0.6, flashcard: 0.4, task: 10 } as const
const QUIZZES_PER_CORE = 3
const CARDS_PER_CORE = 2
const CARDS_PER_LESSON = 6
const INTERVIEW_PER_LESSON = 4

const chunk = <T>(items: readonly T[], size: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

function minutesOf(items: LessonItemRef[], units: Map<string, LearningUnit>): number {
  let m = 0
  for (const item of items) m += item.kind === 'reel' ? PACE.reel : PACE[units.get(item.id)?.kind ?? 'quiz']
  return Math.max(1, Math.round(m))
}

export function isInterviewCard(unit: LearningUnit): boolean {
  return unit.kind === 'flashcard' && unit.qtype === 'співбесіда'
}

export function chapterLessons(chapter: Chapter, units: readonly LearningUnit[], reels: readonly Reel[], unitById: Map<string, LearningUnit>): Lesson[] {
  const quizzes = units.filter((u) => u.kind === 'quiz')
  const cards = units.filter((u) => u.kind === 'flashcard' && !isInterviewCard(u))
  const interview = units.filter(isInterviewCard)
  const tasks = units.filter((u) => u.kind === 'task')
  const reelQueue = [...reels]
  const lessons: Lesson[] = []
  const push = (kind: LessonKind, n: number, title: string, items: LessonItemRef[]) => {
    if (kind !== 'theory' && items.length === 0) return
    lessons.push({ id: `${chapter.id}::${kind}-${n}`, guideId: chapter.guideId, chapterId: chapter.id, index: lessons.length, kind, icon: LESSON_ICONS[kind], title, items, minutes: kind === 'theory' ? chapter.estimatedMinutes : minutesOf(items, unitById) })
  }
  const unit = (u: LearningUnit): LessonItemRef => ({ kind: 'unit', id: u.id })
  const reel = (): LessonItemRef[] => {
    const r = reelQueue.shift()
    return r ? [{ kind: 'reel', id: r.id }] : []
  }

  push('theory', 1, 'Теорія: читати розділ', [])

  // The first quiz of a chapter is the «Передбач» pretest — it opens the start lesson.
  const restQuizzes = quizzes.slice(1)
  if (quizzes[0]) push('start', 1, 'Передбач і розберись', [...reel(), unit(quizzes[0]), ...reel()])

  const cores = chunk(restQuizzes, QUIZZES_PER_CORE)
  const cardQueue = [...cards]
  cores.forEach((group, i) => {
    const items: LessonItemRef[] = []
    group.forEach((q, j) => {
      items.push(unit(q))
      if (j < CARDS_PER_CORE && cardQueue.length > 0) items.push(unit(cardQueue.shift()!))
    })
    items.push(...reel())
    push('core', i + 1, cores.length > 1 ? `Розбір ${i + 1}` : 'Розбір', items)
  })

  chunk(cardQueue, CARDS_PER_LESSON).forEach((group, i, all) => {
    push('cards', i + 1, all.length > 1 ? `Закріплення ${i + 1}` : 'Закріплення', [...group.map(unit), ...reel()])
  })

  tasks.forEach((t, i) => {
    const title = t.kind === 'task' ? t.titleText : 'Задача'
    push('code', i + 1, title.length > 48 ? `${title.slice(0, 46)}…` : title, [unit(t)])
  })

  chunk(interview, INTERVIEW_PER_LESSON).forEach((group, i, all) => {
    push('interview', i + 1, all.length > 1 ? `Співбесіда ${i + 1}` : 'Співбесіда', group.map(unit))
  })

  // Leftover reels become a short bonus at the end of the last practice lesson.
  const last = [...lessons].reverse().find((l) => l.kind === 'cards' || l.kind === 'core')
  if (last && reelQueue.length > 0) last.items.push(...reelQueue.splice(0, 2).map((r): LessonItemRef => ({ kind: 'reel', id: r.id })))
  return lessons
}

export function guideLessons(guide: Guide, chapters: readonly Chapter[], unitsByChapter: Map<string, LearningUnit[]>, reels: readonly Reel[], units: Map<string, LearningUnit>): Map<string, Lesson[]> {
  const reelsByChapter = new Map<string, Reel[]>()
  for (const r of reels) {
    if (r.guideId !== guide.id) continue
    const list = reelsByChapter.get(r.chapterId)
    if (list) list.push(r)
    else reelsByChapter.set(r.chapterId, [r])
  }
  const out = new Map<string, Lesson[]>()
  for (const chapter of chapters) out.set(chapter.id, chapterLessons(chapter, unitsByChapter.get(chapter.id) ?? [], reelsByChapter.get(chapter.id) ?? [], units))
  return out
}

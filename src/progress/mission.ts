// Daily mission planner: turns a time budget into an ordered list of study steps.
// Pure logic — no I/O. Ordering follows LEARNING_PLAYBOOK: spaced review first (forgetting curve),
// then mistakes, new material, interleaved retrieval (quiz), deliberate practice (task), micro-learning (feed).

export interface Budget {
  minutes: number
  id: string
  emoji: string
  title: string
  hint: string
}

export const BUDGETS: readonly Budget[] = [
  { minutes: 10, id: 'sprint', emoji: '⚡', title: 'Спринт', hint: 'Повторення, міні-квіз і фішки — ідеально в дорозі' },
  { minutes: 20, id: 'steady', emoji: '🎯', title: 'Стабільно', hint: 'Плюс шматок нового розділу' },
  { minutes: 30, id: 'focus', emoji: '🔥', title: 'Фокус', hint: 'Плюс задача з кодом' },
  { minutes: 45, id: 'deep', emoji: '🧠', title: 'Глибина', hint: 'Помилки, новий розділ, задача середньої складності' },
  { minutes: 60, id: 'marathon', emoji: '🏔️', title: 'Марафон', hint: 'Усе більше, hard-задача' },
  { minutes: 90, id: 'beast', emoji: '🦾', title: 'Звір', hint: 'Максимальне занурення' },
]

export const DEFAULT_BUDGET = 20

export function budgetFor(minutes: number): Budget {
  let best = BUDGETS[0]!
  for (const b of BUDGETS) if (b.minutes <= minutes) best = b
  return best
}

export type StepKind = 'review' | 'mistakes' | 'lessons' | 'read' | 'quiz' | 'boss' | 'task' | 'feed'

export interface MissionStep {
  id: StepKind
  kind: StepKind
  emoji: string
  title: string
  why: string
  target: number
  unit: 'card' | 'question' | 'minute' | 'reel' | 'task' | 'lesson'
  minutes: number
  difficulty?: 'easy' | 'medium' | 'hard'
  chapterId?: string
}

export interface MissionPlan {
  budget: number
  day: string
  steps: MissionStep[]
  bonusXp: number
}

export interface MissionInput {
  budget: number
  day: string
  weekday: number
  due: number
  newCards: number
  mistakes: number
  quizzes: number
  tasks: { easy: number; medium: number; hard: number }
  reels: number
  // Unfinished lessons left on the learner's current path.
  lessons: number
  nextChapter: { id: string; title: string; minutes: number } | null
}

// Average minutes per item, measured from typical sessions.
export const PACE = { card: 0.4, mistake: 0.75, question: 0.6, reel: 0.25, lesson: 4 } as const
const LESSONS_FOR = [[90, 7], [60, 5], [45, 4], [30, 3], [20, 2], [0, 1]] as const
const TASK_MINUTES = { easy: 8, medium: 12, hard: 20 } as const

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

export function planMission(input: MissionInput): MissionPlan {
  const budget = clamp(Math.round(input.budget), 5, 240)
  const steps: MissionStep[] = []
  let left = budget

  const take = (minutes: number) => {
    const used = Math.min(minutes, left)
    left -= used
    return used
  }

  // 1. Spaced repetition: due cards first, then a few new ones.
  const reviewCap = Math.floor((budget * 0.3) / PACE.card)
  const review = Math.min(reviewCap, input.due + Math.min(input.newCards, Math.ceil(reviewCap / 3)))
  if (review > 0) {
    steps.push({
      id: 'review', kind: 'review', emoji: '🔁', title: `Повторити ${review} карток`,
      why: 'Інтервальне повторення: освіжаємо те, що ти от-от забудеш', target: review, unit: 'card', minutes: take(Math.ceil(review * PACE.card)),
    })
  }

  // 2. Mistakes — only with enough time; they need a calm head.
  if (budget >= 30 && input.mistakes > 0) {
    const n = Math.min(input.mistakes, Math.floor((budget * 0.12) / PACE.mistake), 10)
    if (n > 0) {
      steps.push({
        id: 'mistakes', kind: 'mistakes', emoji: '🩹', title: `Закрити ${n} помилок`,
        why: 'Помилки — найкоротший шлях до прогресу', target: n, unit: 'question', minutes: take(Math.ceil(n * PACE.mistake)),
      })
    }
  }

  // 3. Path lessons — the main course: short Duolingo-style steps through new material.
  const lessonTarget = Math.min(input.lessons, LESSONS_FOR.find(([b]) => budget >= b)![1])
  if (lessonTarget > 0) {
    steps.push({
      id: 'lessons', kind: 'lessons', emoji: '🎓', title: `Пройти ${lessonTarget} ${lessonTarget === 1 ? 'урок' : lessonTarget < 5 ? 'уроки' : 'уроків'} шляху`,
      why: 'Нове знання маленькими порціями: передбач → зрозумій → перевір', target: lessonTarget, unit: 'lesson', minutes: take(lessonTarget * PACE.lesson),
    })
  }

  // 4. Deep reading for longer sessions: theory behind the lessons.
  if (budget >= 45 && input.nextChapter) {
    const minutes = clamp(Math.round(budget * 0.15), 6, Math.max(6, input.nextChapter.minutes))
    steps.push({
      id: 'read', kind: 'read', emoji: '📖', title: `Читати «${input.nextChapter.title}»`,
      why: 'Нове знання + перевірки «передбач» у тексті', target: minutes, unit: 'minute', minutes: take(minutes), chapterId: input.nextChapter.id,
    })
  }

  // 4. Retrieval practice, interleaved across topics. On Sundays it's the weekly boss test.
  const boss = input.weekday === 0 && budget >= 20
  const quizShare = boss ? 0.3 : 0.12
  const quizN = Math.min(input.quizzes, clamp(Math.floor((budget * quizShare) / PACE.question), 3, boss ? 20 : 15))
  if (quizN > 0 && (boss || budget >= 20)) {
    steps.push(
      boss
        ? { id: 'boss', kind: 'boss', emoji: '👹', title: `Бос тижня: ${quizN} питань`, why: 'Змішаний тест з усього, що ти вчив цього тижня', target: quizN, unit: 'question', minutes: take(Math.ceil(quizN * PACE.question)) }
        : { id: 'quiz', kind: 'quiz', emoji: '🎲', title: `Міні-квіз: ${quizN} питань`, why: 'Перемішані теми — мозок вчиться розрізняти, а не вгадувати', target: quizN, unit: 'question', minutes: take(Math.ceil(quizN * PACE.question)) },
    )
  }

  // 5. Deliberate practice.
  if (budget >= 30) {
    const wanted: Array<'easy' | 'medium' | 'hard'> = budget >= 60 ? ['hard', 'medium', 'easy'] : budget >= 45 ? ['medium', 'easy', 'hard'] : ['easy', 'medium', 'hard']
    const difficulty = wanted.find((d) => input.tasks[d] > 0 && TASK_MINUTES[d] <= Math.max(left + 5, 8))
    if (difficulty) {
      const count = budget >= 90 && input.tasks[difficulty] > 1 ? 2 : 1
      steps.push({
        id: 'task', kind: 'task', emoji: '🛠️', title: count > 1 ? `Розв'язати ${count} задачі` : 'Розв’язати задачу',
        why: 'Код руками — єдиний спосіб перетворити розуміння на навичку', target: count, unit: 'task', minutes: take(TASK_MINUTES[difficulty] * count), difficulty,
      })
    }
  }

  // 6. Feed fills the rest: short, shareable facts.
  const reels = Math.min(input.reels > 0 ? input.reels : 0, Math.max(5, Math.floor(Math.max(left, 2) / PACE.reel)), 40)
  if (reels > 0) {
    steps.push({
      id: 'feed', kind: 'feed', emoji: '⚡', title: `Гортати стрічку: ${reels} фішок`,
      why: 'Мікрофакти, які чіпляються в памʼяті', target: reels, unit: 'reel', minutes: Math.max(1, take(Math.ceil(reels * PACE.reel))),
    })
  }

  return { budget, day: input.day, steps, bonusXp: Math.round(budget * 2) }
}

export interface MissionActivity {
  cards: number
  mistakes: number
  readingMinutes: number
  lessons: number
  chapterStudied: boolean
  quizzes: number
  tasksSolved: number
  reels: number
}

export interface StepProgress {
  step: MissionStep
  done: number
  complete: boolean
}

export function stepProgress(plan: MissionPlan, a: MissionActivity): StepProgress[] {
  return plan.steps.map((step) => {
    let done: number
    switch (step.kind) {
      case 'review':
        done = a.cards
        break
      case 'mistakes':
        done = a.mistakes
        break
      case 'lessons':
        done = a.lessons
        break
      case 'read':
        done = a.chapterStudied ? step.target : a.readingMinutes
        break
      case 'quiz':
      case 'boss':
        done = a.quizzes
        break
      case 'task':
        done = a.tasksSolved
        break
      case 'feed':
        done = a.reels
        break
    }
    const clamped = Math.min(step.target, Math.max(0, Math.floor(done)))
    return { step, done: clamped, complete: clamped >= step.target }
  })
}

export function missionRatio(progress: readonly StepProgress[]): number {
  const total = progress.reduce((s, p) => s + p.step.minutes, 0)
  if (total === 0) return 0
  return progress.reduce((s, p) => s + p.step.minutes * (p.done / p.step.target), 0) / total
}

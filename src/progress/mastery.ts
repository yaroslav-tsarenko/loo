// Chapter mastery "crowns" (0–5), Duolingo-style. Pure logic — inputs are aggregated progress numbers.
// 0 untouched · 1 opened · 2 read · 3 quizzes passed · 4 cards in long-term memory · 5 mastered (tasks + high accuracy)

export interface ChapterSignals {
  status: 'unread' | 'reading' | 'studied'
  quizzes: { total: number; answered: number; correct: number }
  cards: { total: number; reviewing: number; stable: number }
  tasks: { total: number; solved: number }
}

export interface Mastery {
  crowns: number
  ratio: number
  next: string | null
}

const share = (part: number, total: number) => (total === 0 ? 1 : part / total)

export const STABLE_DAYS = 21

export function chapterMastery(s: ChapterSignals): Mastery {
  const quizCoverage = share(s.quizzes.answered, s.quizzes.total)
  const quizAccuracy = s.quizzes.answered === 0 ? (s.quizzes.total === 0 ? 1 : 0) : s.quizzes.correct / s.quizzes.answered
  const cardsReviewing = share(s.cards.reviewing, s.cards.total)
  const cardsStable = share(s.cards.stable, s.cards.total)
  const tasksSolved = share(s.tasks.solved, s.tasks.total)

  const gates: Array<[boolean, string]> = [
    [s.status !== 'unread', 'Відкрий розділ'],
    [s.status === 'studied', 'Дочитай і познач «вивчено»'],
    [quizCoverage >= 0.6 && quizAccuracy >= 0.7, 'Пройди ≥60% тестів розділу з точністю 70%+'],
    [cardsReviewing >= 0.6, 'Переведи 60% карток у довгу памʼять (повторення)'],
    [tasksSolved >= 1 && quizAccuracy >= 0.9 && cardsStable >= 0.6, 'Розвʼяжи всі задачі, 90% точності, стабільні картки'],
  ]
  let crowns = 0
  for (const [ok] of gates) {
    if (!ok) break
    crowns++
  }
  const read = s.status === 'studied' ? 1 : s.status === 'reading' ? 0.4 : 0
  const ratio = read * 0.25 + quizCoverage * quizAccuracy * 0.25 + cardsReviewing * 0.2 + cardsStable * 0.15 + tasksSolved * 0.15
  return { crowns, ratio: s.status === 'unread' && ratio > 0 ? Math.min(ratio, 0.99) : Math.min(1, ratio), next: gates[crowns]?.[1] ?? null }
}

export const CROWN_LABEL = ['Не почато', 'Відкрито', 'Прочитано', 'Перевірено', 'Запамʼятовано', 'Майстер'] as const

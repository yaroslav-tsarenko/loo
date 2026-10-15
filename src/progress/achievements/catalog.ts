import type { AchievementDef } from './dsl'

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  { id: 'first-chapter', title: 'Перший розділ', description: 'Позначити перший розділ як вивчений', tier: 'bronze', when: { metric: 'chapters.studied', gte: 1 } },
  { id: 'chapters-10', title: 'Десять розділів', description: 'Вивчити 10 розділів', tier: 'silver', when: { metric: 'chapters.studied', gte: 10 } },
  { id: 'guide-complete', title: 'Посібник закрито', description: 'Вивчити всі розділи одного посібника', tier: 'gold', when: { metric: 'guides.completed', gte: 1 } },
  { id: 'streak-3', title: 'Три дні поспіль', description: 'Виконувати денну мету 3 дні поспіль', tier: 'bronze', when: { metric: 'streak.current', gte: 3 } },
  { id: 'streak-7', title: 'Тиждень без пропусків', description: 'Серія з 7 днів', tier: 'silver', when: { metric: 'streak.current', gte: 7 } },
  { id: 'streak-30', title: 'Місяць дисципліни', description: 'Серія з 30 днів', tier: 'gold', when: { metric: 'streak.current', gte: 30 } },
  { id: 'cards-100', title: '100 карток', description: 'Пройти 100 флешкарток', tier: 'bronze', when: { metric: 'cards.reviewed', gte: 100 } },
  { id: 'cards-500', title: '500 карток', description: 'Пройти 500 флешкарток', tier: 'silver', when: { metric: 'cards.reviewed', gte: 500 } },
  { id: 'quiz-50', title: '50 влучних відповідей', description: 'Правильно відповісти на 50 тестів', tier: 'silver', when: { metric: 'quiz.correct', gte: 50 } },
  { id: 'task-first', title: 'Перша задача', description: 'Розв’язати першу задачу', tier: 'bronze', when: { metric: 'tasks.solved', gte: 1 } },
  { id: 'tasks-no-hints-5', title: 'Без підказок', description: 'Розв’язати 5 задач без жодної підказки', tier: 'silver', when: { metric: 'tasks.solvedNoHints', gte: 5 } },
  { id: 'senior-run-10', title: 'Senior-серія', description: '10 senior-питань поспіль без помилок', tier: 'gold', when: { metric: 'run.senior', gte: 10 } },
  { id: 'techlead-run-5', title: 'Голос техліда', description: '5 tech lead-питань поспіль без помилок', tier: 'gold', when: { metric: 'run.techlead', gte: 5 } },
  { id: 'run-25', title: 'Чиста серія', description: '25 правильних відповідей поспіль', tier: 'silver', when: { metric: 'run.all', gte: 25 } },
  { id: 'chapter-clean', title: 'Розділ без боргів', description: 'Закрити всі помилки розділу', tier: 'silver', when: { metric: 'chapters.mistakesCleared', gte: 1 } },
  { id: 'mistakes-25', title: 'Робота над помилками', description: 'Закрити 25 помилок', tier: 'silver', when: { metric: 'mistakes.resolved', gte: 25 } },
  { id: 'perfect-session', title: 'Без жодної помилки', description: 'Сесія з 10+ питань без помилок', tier: 'silver', when: { metric: 'sessions.perfect', gte: 1 } },
  { id: 'goals-7', title: 'Сім виконаних цілей', description: 'Виконати денну мету 7 разів', tier: 'bronze', when: { metric: 'goals.met', gte: 7 } },
  { id: 'rank-middle', title: 'Middle', description: 'Досягти рангу Middle', tier: 'silver', when: { metric: 'level', gte: 12 } },
  { id: 'rank-senior', title: 'Senior', description: 'Досягти рангу Senior', tier: 'gold', when: { metric: 'level', gte: 22 } },
]

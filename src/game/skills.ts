// Skills: every mastered topic (≥ 3 crowns) or passed section exam of ANY course unlocks a card.
// Course-agnostic: names come from a curated map for known courses, otherwise «<Тема> · майстерність».
// Future PvP: skills are the character's moves (docs/BATTLES.md).

export const SKILL_MIN_CROWNS = 3

export type SkillKind = 'topic' | 'section'

export interface Skill {
  // `<courseId>:<topic or section id>` — stable
  id: string
  kind: SkillKind
  name: string
  icon: string
  // 1..100
  power: number
  courseId: string
  courseTitle: string
  // what it was earned on (topic / section title)
  source: string
}

// Curated names (JavaScript Zero → Pro), keyed by `<section>:<chapter>` (the topic id without the course).
export const SKILL_NAMES: Record<string, string> = {
  'start:jss-ch-01': 'Перший запуск',
  'start:jss-ch-02': 'Охоронець змінних',
  'start:jss-ch-03': 'Алхімік виразів',
  'start:jss-ch-04': 'Розвилка рішень',
  'start:jss-ch-05': 'Нескінченна петля',
  'start:jss-ch-06': 'Кухар функцій',
  'start:jss-ch-07': 'Збирач масивів',
  'start:jss-ch-08': 'Ключник обʼєктів',
  'start:jss-ch-09': 'Оживлювач сторінок',
  'start:jss-ch-10': 'Мислення програміста',
  'core:jsd-ch-01': 'Погляд у рушій',
  'core:jsd-ch-02': 'Приборкувач типів',
  'core:jsd-ch-03': 'Мисливець за посиланнями',
  'core:jsd-ch-04': 'Повелитель scope',
  'core:jsd-ch-05': 'Майстер замикань',
  'core:jsd-ch-06': 'Укротитель this',
  'core:jsd-ch-07': 'Архітектор прототипів',
  'async-memory:jsd-ch-08': 'Володар Event Loop',
  'async-memory:jsd-ch-09': 'Тримач обіцянок',
  'async-memory:jsd-ch-10': 'Час-маг async',
  'async-memory:jsd-ch-11': 'Генератор потоків',
  'async-memory:jsd-ch-12': 'Функціональний стиль',
  'async-memory:jsd-ch-13': 'Збирач сміття',
  'async-memory:jsd-ch-14': 'Приборкувач подій',
  'deeper:jsd-ch-15': 'Глибинні функції',
  'deeper:jsd-ch-16': 'Анатом обʼєктів',
  'deeper:jsd-ch-17': 'Числовий снайпер',
  'deeper:jsd-ch-18': 'Заклинач регулярок',
  'deeper:jsd-ch-19': 'Колекціонер',
  'deeper:jsd-ch-20': 'Чарівник Proxy',
  'deeper:jsd-ch-21': 'Модульний будівничий',
  'deeper:jsd-ch-22': 'Ловець помилок',
  'deeper:jsd-ch-23': 'Серіалізатор',
  'deeper:jsd-ch-24': 'Володар часу',
  'browser-network:jsd-ch-25': 'Ловець подій DOM',
  'browser-network:jsd-ch-26': 'Око рендерингу',
  'browser-network:jsd-ch-27': 'Мережевий кур’єр',
  'browser-network:jsd-ch-28': 'Хранитель сховищ',
  'browser-network:jsd-ch-29': 'Командир воркерів',
  'browser-network:jsd-ch-30': 'Щит безпеки',
  'engineering:jsd-ch-31': 'Турбо V8',
  'engineering:jsd-ch-32': 'Знавець патернів',
  'engineering:jsd-ch-33': 'Майстер тестів',
  'engineering:jsd-ch-34': 'Посланець TC39',
  'livecoding:jsk-ch-01': 'Рядкова спритність',
  'livecoding:jsk-ch-02': 'Порівнювач',
  'livecoding:jsk-ch-03': 'Вищий порядок',
  'livecoding:jsk-ch-04': 'Поліфіл-коваль',
  'livecoding:jsk-ch-05': 'Асинхронний дуелянт',
  'livecoding:jsk-ch-06': 'Будівничий структур',
  'livecoding:jsk-ch-07': 'Алгоритмічний ніндзя',
  'livecoding:jsk-ch-08': 'Хардкорщик',
  'livecoding:jsk-ch-09': 'Око рев’юера',
  'projects:jsp-ch-01': 'Організатор справ',
  'projects:jsp-ch-02': 'Обчислювач',
  'projects:jsp-ch-03': 'Пошуковий дебаунсер',
  'projects:jsp-ch-04': 'Голос чату',
  'projects:jsp-ch-05': 'Хранитель стану',
  'projects:jsp-ch-06': 'Сигнальник',
  'projects:jsp-ch-07': 'Творець фреймворку',
  'projects:jsp-ch-08': 'HTTP-пілот',
  // section exams
  start: 'Перший крок',
  core: 'Серце мови',
  'async-memory': 'Повелитель асинхронності',
  deeper: 'Глибинний дайвер',
  'browser-network': 'Браузерний рейнджер',
  engineering: 'Інженер продуктивності',
  livecoding: 'Лайвкод-гладіатор',
  projects: 'Будівничий проєктів',
}

// `<course>:<rest>` → `<rest>`
const localId = (courseId: string, id: string) => (id.startsWith(`${courseId}:`) ? id.slice(courseId.length + 1) : id)

const clampPower = (n: number) => Math.max(1, Math.min(100, Math.round(n)))

export interface TopicSkillInput {
  courseId: string
  courseTitle: string
  topicId: string
  title: string
  icon: string | null
  crowns: number
  // mastery ratio 0..1
  ratio: number
}

export function topicSkill(t: TopicSkillInput): Skill | null {
  if (t.crowns < SKILL_MIN_CROWNS) return null
  const key = localId(t.courseId, t.topicId)
  return {
    id: `${t.courseId}:${key}`,
    kind: 'topic',
    name: SKILL_NAMES[key] ?? `${t.title} · майстерність`,
    icon: t.icon ?? 'px:star',
    // 3 crowns ≈ 50, 5 crowns + full ratio = 100
    power: clampPower(t.crowns * 14 + t.ratio * 30),
    courseId: t.courseId,
    courseTitle: t.courseTitle,
    source: t.title,
  }
}

export interface SectionSkillInput {
  courseId: string
  courseTitle: string
  sectionId: string
  title: string
  icon: string | null
  // best exam score 0..1
  score: number
}

export function sectionSkill(s: SectionSkillInput): Skill {
  const key = localId(s.courseId, s.sectionId)
  return {
    id: `${s.courseId}:${key}:exam`,
    kind: 'section',
    name: SKILL_NAMES[key] ?? `${s.title} · майстерність`,
    icon: s.icon ?? 'px:crown',
    // exams are worth more than a topic: 60 at the pass mark (0.8), 100 flawless
    power: clampPower(60 + (s.score - 0.8) * 200),
    courseId: s.courseId,
    courseTitle: s.courseTitle,
    source: s.title,
  }
}

// Strongest first, then by id — stable for snapshots.
export const sortSkills = (skills: readonly Skill[]): Skill[] => [...skills].sort((a, b) => b.power - a.power || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))

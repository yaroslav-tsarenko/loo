import type { Subject } from './schema/manifest'

// Onboarding catalog: the directions of step 1 («Що хочеш вивчати?») and the «Скоро» options of step 2. What is
// *available* is never listed here — it comes from the course registry (listCourses): a direction is open as soon as a
// listed course has its `subject`, and a «скоро» option hides itself once a course matches it (`target` for languages,
// a course id prefix otherwise). Everything else is a «Хочу це» vote (profiles.onboarding.wishes).
// Icons are refs for <Icon>: our pixel set (`px:`) or brand marks (`si:`), never emoji.

export const DIRECTION_IDS = [
  'languages',
  'programming',
  'psychology',
  'math',
  'science',
  'business',
  'marketing',
  'design',
  'data-ai',
  'security',
  'history',
  'music',
  'photo',
  'productivity',
] as const
export type DirectionId = (typeof DIRECTION_IDS)[number]

export interface Direction {
  id: DirectionId
  label: string
  icon: string
  /** Course subject this direction opens; none = no course kind for it yet (always «Скоро»). */
  subject?: Subject
}

export const DIRECTIONS: readonly Direction[] = [
  { id: 'languages', label: 'Мови', icon: 'px:globe', subject: 'language' },
  { id: 'programming', label: 'Програмування', icon: 'px:code', subject: 'programming' },
  { id: 'psychology', label: 'Психологія', icon: 'px:brain', subject: 'psychology' },
  { id: 'math', label: 'Математика', icon: 'px:abacus' },
  { id: 'science', label: 'Природничі науки', icon: 'px:microscope', subject: 'science' },
  { id: 'business', label: 'Бізнес і фінанси', icon: 'px:clipboard', subject: 'business' },
  { id: 'marketing', label: 'Маркетинг', icon: 'px:target' },
  { id: 'design', label: 'Дизайн', icon: 'px:image' },
  { id: 'data-ai', label: 'Data & AI', icon: 'px:database' },
  { id: 'security', label: 'Кібербезпека', icon: 'px:shield', subject: 'security' },
  { id: 'history', label: 'Історія', icon: 'px:scroll' },
  { id: 'music', label: 'Музика', icon: 'px:mic' },
  { id: 'photo', label: 'Фотографія', icon: 'px:camera' },
  { id: 'productivity', label: 'Особиста ефективність', icon: 'px:calendar' },
]

export const SOON_OPTION_IDS = [
  'lang-de',
  'lang-es',
  'lang-it',
  'lang-fr',
  'lang-pl',
  'lang-ja',
  'lang-ko',
  'lang-zh',
  'prog-ts',
  'prog-python',
  'prog-react',
  'prog-node',
  'prog-java',
  'prog-swift',
  'prog-kotlin',
  'prog-sql',
  'prog-go',
] as const
export type SoonOptionId = (typeof SOON_OPTION_IDS)[number]

export interface SoonOption {
  id: SoonOptionId
  label: string
  icon: string
  direction: DirectionId
  /** Language options: the target language (BCP 47) a course would teach. */
  target?: string
  /** Other options: the id prefix of the course that would replace it (`python` → `python-…`). */
  course?: string
}

export const SOON_OPTIONS: readonly SoonOption[] = [
  { id: 'lang-de', label: 'Німецька', icon: 'px:flagDe', direction: 'languages', target: 'de' },
  { id: 'lang-es', label: 'Іспанська', icon: 'px:flagEs', direction: 'languages', target: 'es' },
  { id: 'lang-it', label: 'Італійська', icon: 'px:flagIt', direction: 'languages', target: 'it' },
  { id: 'lang-fr', label: 'Французька', icon: 'px:flagFr', direction: 'languages', target: 'fr' },
  { id: 'lang-pl', label: 'Польська', icon: 'px:flagPl', direction: 'languages', target: 'pl' },
  { id: 'lang-ja', label: 'Японська', icon: 'px:flagJp', direction: 'languages', target: 'ja' },
  { id: 'lang-ko', label: 'Корейська', icon: 'px:flagKr', direction: 'languages', target: 'ko' },
  { id: 'lang-zh', label: 'Китайська', icon: 'px:flagCn', direction: 'languages', target: 'zh' },
  { id: 'prog-ts', label: 'TypeScript', icon: 'si:SiTypescript', direction: 'programming', course: 'typescript' },
  { id: 'prog-python', label: 'Python', icon: 'si:SiPython', direction: 'programming', course: 'python' },
  { id: 'prog-react', label: 'React', icon: 'si:SiReact', direction: 'programming', course: 'react' },
  { id: 'prog-node', label: 'Node.js', icon: 'si:SiNodedotjs', direction: 'programming', course: 'node' },
  { id: 'prog-java', label: 'Java', icon: 'si:SiOpenjdk', direction: 'programming', course: 'java' },
  { id: 'prog-swift', label: 'Swift', icon: 'si:SiSwift', direction: 'programming', course: 'swift' },
  { id: 'prog-kotlin', label: 'Kotlin', icon: 'si:SiKotlin', direction: 'programming', course: 'kotlin' },
  { id: 'prog-sql', label: 'SQL', icon: 'px:database', direction: 'programming', course: 'sql' },
  { id: 'prog-go', label: 'Go', icon: 'si:SiGo', direction: 'programming', course: 'go' },
]

// Everything a learner can vote for: any direction (a closed one, or one that has courses but not the one they want)
// and any «скоро» option.
export const WISH_IDS = [...DIRECTION_IDS, ...SOON_OPTION_IDS] as const
export type WishId = (typeof WISH_IDS)[number]
export const MAX_WISHES = 30

/** The bits of a course listing the onboarding needs. */
export interface CatalogCourse {
  id: string
  subject: string
  target?: string | null
}

const lang = (tag: string | null | undefined) => (tag ?? '').toLowerCase().split('-')[0]

// The direction a course belongs to; courses of a subject no direction covers fall into «other».
export function directionOf(course: Pick<CatalogCourse, 'subject'>): DirectionId | 'other' {
  return DIRECTIONS.find((d) => d.subject && d.subject === course.subject)?.id ?? 'other'
}

export function coursesIn<C extends CatalogCourse>(direction: DirectionId | 'other', courses: readonly C[]): C[] {
  return courses.filter((c) => directionOf(c) === direction)
}

export function isDirectionOpen(direction: DirectionId | 'other', courses: readonly CatalogCourse[]): boolean {
  return coursesIn(direction, courses).length > 0
}

// «Скоро» options still waiting for a course (one that matches is listed as a real course instead).
export function soonOptionsFor(direction: DirectionId | 'other', courses: readonly CatalogCourse[]): SoonOption[] {
  const own = coursesIn(direction, courses)
  return SOON_OPTIONS.filter((o) => o.direction === direction).filter((o) =>
    !own.some((c) => (o.target ? lang(c.target) === lang(o.target) : o.course ? c.id === o.course || c.id.startsWith(`${o.course}-`) : false)),
  )
}

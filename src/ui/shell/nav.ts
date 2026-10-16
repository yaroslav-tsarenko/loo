export interface NavItem {
  href: string
  label: string
  short: string
  match: (path: string) => boolean
}

// Global destinations — the same for every course. The active course's practice sections (Карта, Картки, Тести,
// Задачі, Помилки… or Слова, Граматика… for a language) come from its course.yaml via ./course-nav.ts.
export const NAV: readonly NavItem[] = [
  { href: '/', label: 'Сьогодні', short: 'Сьогодні', match: (p) => p === '/' },
  { href: '/loo', label: 'Мій Loo', short: 'Loo', match: (p) => p.startsWith('/loo') },
  { href: '/feed', label: 'Стрічка', short: 'Стрічка', match: (p) => p.startsWith('/feed') },
  { href: '/leagues', label: 'Ліги', short: 'Ліги', match: (p) => p.startsWith('/leagues') },
  { href: '/shop', label: 'Крамниця', short: 'Крамниця', match: (p) => p.startsWith('/shop') },
  { href: '/courses', label: 'Курси', short: 'Курси', match: (p) => p.startsWith('/courses') || p.startsWith('/placement') },
  { href: '/news', label: 'Новини', short: 'Новини', match: (p) => p.startsWith('/news') },
  { href: '/profile', label: 'Профіль', short: 'Профіль', match: (p) => p.startsWith('/profile') },
]

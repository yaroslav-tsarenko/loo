export interface NavItem {
  href: string
  label: string
  short: string
  match: (path: string) => boolean
}

export const NAV: readonly NavItem[] = [
  { href: '/', label: 'Сьогодні', short: 'Сьогодні', match: (p) => p === '/' },
  { href: '/feed', label: 'Стрічка', short: 'Стрічка', match: (p) => p.startsWith('/feed') },
  { href: '/path', label: 'Шлях', short: 'Шлях', match: (p) => p.startsWith('/path') },
  { href: '/review', label: 'Картки', short: 'Картки', match: (p) => p.startsWith('/review') },
  { href: '/quiz', label: 'Тести', short: 'Тести', match: (p) => p.startsWith('/quiz') },
  { href: '/tasks', label: 'Задачі', short: 'Задачі', match: (p) => p.startsWith('/tasks') },
  { href: '/mistakes', label: 'Мої помилки', short: 'Помилки', match: (p) => p.startsWith('/mistakes') },
  { href: '/news', label: 'Новини', short: 'Новини', match: (p) => p.startsWith('/news') },
  { href: '/roadmap', label: 'Мапа інженера', short: 'Мапа', match: (p) => p.startsWith('/roadmap') },
  { href: '/profile', label: 'Профіль', short: 'Профіль', match: (p) => p.startsWith('/profile') },
]

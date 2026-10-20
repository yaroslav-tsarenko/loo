// Blog categories (/blog/<id>). Ids are URL segments: lowercase, never equal to a post slug (src/blog/posts.ts checks).
export interface BlogCategory {
  id: string
  title: string
  /** Short label for chips and cards. */
  short: string
  /** Meta description of the category page. */
  description: string
  /** Accent colour of the category chip and OG card. */
  color: string
  /** Loo course this category leads to (signup CTA copy), if any. */
  course: string | null
}

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  {
    id: 'english',
    title: 'Англійська мова',
    short: 'Англійська',
    description: 'Граматика простими словами, лексика, вимова й IELTS: статті з прикладами, таблицями й вправами — від A1 до C2.',
    color: '#2563eb',
    course: 'Англійська A1→C2',
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    short: 'JavaScript',
    description: 'JavaScript від нуля до впевненого рівня: змінні, функції, замикання, асинхронність, DOM — з робочими прикладами коду.',
    color: '#ca8a04',
    course: 'JavaScript Zero→Pro',
  },
  {
    id: 'sql',
    title: 'SQL і бази даних',
    short: 'SQL',
    description: 'SQL на практиці: SELECT, JOIN, агрегації, індекси й транзакції — з прикладами запитів на PostgreSQL.',
    color: '#0891b2',
    course: null,
  },
  {
    id: 'system-design',
    title: 'System Design',
    short: 'System Design',
    description: 'Як проєктують великі системи: масштабування, кешування, черги, бази даних — зрозумілою мовою і з діаграмами.',
    color: '#7c3aed',
    course: null,
  },
  {
    id: 'german',
    title: 'Німецька мова',
    short: 'Німецька',
    description: 'Німецька з нуля: артиклі, відмінки, порядок слів і корисні фрази — пояснення українською з прикладами.',
    color: '#dc2626',
    course: null,
  },
  {
    id: 'learning',
    title: 'Як вчитися ефективно',
    short: 'Навчання',
    description: 'Інтервальні повторення, звички, мотивація й планування: як вчитися швидше і не кидати.',
    color: '#16a34a',
    course: null,
  },
]

export function blogCategory(id: string): BlogCategory | null {
  return BLOG_CATEGORIES.find((c) => c.id === id) ?? null
}

// Shared news types and UI metadata. No I/O here: safe for client components and tests.

export interface NewsDraft {
  source: string
  title: string
  url: string
  summary?: string
  author?: string
  // Raw popularity in the source's own units (points, upvotes, reactions); 0 when unknown.
  score: number
  tags: string[]
  publishedAt: number
}

export interface RankedNews extends NewsDraft {
  // sha1 of the canonical URL.
  id: string
  // Final 0..100 usefulness score stored in news_items.score.
  rank: number
  tags: NewsTag[]
}

export const NEWS_TAGS = ['release', 'security', 'proposal', 'perf', 'deep-dive', 'tooling', 'tutorial', 'discussion', 'news'] as const
export type NewsTag = (typeof NEWS_TAGS)[number]

// icon: ref for <Icon name> (pixel set first)
export const TAG_META: Record<NewsTag, { icon: string; label: string }> = {
  release: { icon: 'px:rocket', label: 'Релізи' },
  security: { icon: 'px:lock', label: 'Безпека' },
  proposal: { icon: 'px:scroll', label: 'TC39 і стандарти' },
  perf: { icon: 'px:bolt', label: 'Продуктивність' },
  'deep-dive': { icon: 'px:microscope', label: 'Глибоко' },
  tooling: { icon: 'px:tools', label: 'Інструменти' },
  tutorial: { icon: 'px:book', label: 'Туторіали' },
  discussion: { icon: 'px:chat', label: 'Обговорення' },
  news: { icon: 'pi:PiNewspaperFill', label: 'Новини' },
}

export function isNewsTag(value: string): value is NewsTag {
  return (NEWS_TAGS as readonly string[]).includes(value)
}

// Tags are stored ordered by importance, so the first one is the item's icon.
export function primaryTag(tags: readonly string[]): NewsTag {
  return tags.find(isNewsTag) ?? 'news'
}

const SOURCE_LABEL: Record<string, string> = {
  hn: 'Hacker News',
  devto: 'dev.to',
  jsweekly: 'JavaScript Weekly',
  nodeweekly: 'Node Weekly',
  v8: 'V8 blog',
  chrome: 'Chrome for Developers',
  webdev: 'web.dev',
  nodejs: 'Node.js blog',
  typescript: 'TypeScript blog',
  react: 'React blog',
}

// 'reddit/javascript' → 'r/javascript', 'github/vitejs/vite' → 'GitHub · vite'.
export function sourceLabel(source: string): string {
  const [family, ...rest] = source.split('/')
  if (family === 'reddit') return `r/${rest.join('/')}`
  if (family === 'github') return `GitHub · ${rest.at(-1) ?? ''}`
  return SOURCE_LABEL[source] ?? source
}

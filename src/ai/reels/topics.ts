// Picks what today's AI reels are about. Pure: the DB / content reads live in ingest.ts.

export interface NewsCandidate {
  id: string
  title: string
  url: string
  summary: string | null
  source: string
  score: number
  tags: readonly string[]
  publishedAt: number
  readAt: number | null
}

export interface ChapterCandidate {
  id: string
  guideId: string
  title: string
}

export type ChapterReason = 'weak' | 'current' | 'random'

export interface NewsTopic {
  // Short handle the model refers to: N1, N2…
  key: string
  title: string
  url: string
  summary: string | null
  source: string
}

export interface ChapterTopic {
  chapterId: string
  guideId: string
  title: string
  reason: ChapterReason
  excerpt: string
  existingReelTitles: string[]
  reels: number
}

export interface TopicPlan {
  news: NewsTopic[]
  chapters: ChapterTopic[]
  // Reels to ask the model for (target + buffer for verification / dedupe losses).
  ask: number
}

export interface TopicInput {
  now: number
  news: readonly NewsCandidate[]
  // Chapter ids, most relevant first.
  weak: readonly string[]
  current: readonly string[]
  candidates: readonly ChapterCandidate[]
  plainText: ReadonlyMap<string, string>
  reelTitlesByChapter: ReadonlyMap<string, readonly string[]>
  // Already covered by AI reels recently: chapters (skipped for "random") and news URLs (skipped entirely).
  recentChapterIds: ReadonlySet<string>
  coveredUrls: ReadonlySet<string>
  seed: number
  target?: number
}

export const NEWS_WINDOW_MS = 48 * 3_600_000
export const MAX_NEWS = 3
export const EXCERPT_CHARS = 1800
export const DEFAULT_TARGET = 10

// mulberry32: deterministic per day, so a re-run picks the same "random" chapters.
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function excerpt(text: string, max = EXCERPT_CHARS): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
  return `${end > max * 0.6 ? cut.slice(0, end + 1) : cut}…`
}

export function pickNews(news: readonly NewsCandidate[], now: number, covered: ReadonlySet<string>, max = MAX_NEWS): NewsTopic[] {
  return news
    .filter((n) => n.readAt === null && n.publishedAt > now - NEWS_WINDOW_MS && n.publishedAt <= now + 3_600_000 && !covered.has(n.url))
    .sort((a, b) => b.score - a.score || b.publishedAt - a.publishedAt)
    .slice(0, max)
    .map((n, i) => ({ key: `N${i + 1}`, title: n.title, url: n.url, summary: n.summary, source: n.source }))
}

export function pickTopics(input: TopicInput): TopicPlan {
  const target = input.target ?? DEFAULT_TARGET
  const known = new Map(input.candidates.map((c) => [c.id, c]))
  const news = pickNews(input.news, input.now, input.coveredUrls)

  // 3–5 chapters the learner struggles with or reads right now, then 2 random ones for variety.
  const picked: Array<{ chapter: ChapterCandidate; reason: ChapterReason }> = []
  const take = (ids: readonly string[], reason: ChapterReason, limit: number) => {
    let n = 0
    for (const id of ids) {
      const chapter = known.get(id)
      if (!chapter || n >= limit || picked.some((p) => p.chapter.id === id)) continue
      picked.push({ chapter, reason })
      n++
    }
  }
  take(input.weak, 'weak', 3)
  take(input.current, 'current', 5 - picked.length)
  const random = rng(input.seed)
  const pool = input.candidates
    .filter((c) => !picked.some((p) => p.chapter.id === c.id))
    .map((c) => ({ c, k: random() + (input.recentChapterIds.has(c.id) ? 1 : 0) }))
  // Shuffled, chapters covered recently go last.
  const shuffled = pool.sort((a, b) => a.k - b.k).map((x) => x.c)
  // Without learner signal, random chapters fill up to 5 so there is always enough material.
  const randomCount = Math.max(2, 5 - picked.length)
  take(
    shuffled.map((c) => c.id),
    'random',
    randomCount,
  )

  // One reel per news item; the rest spread over chapters, weak ones first.
  const chapterBudget = picked.length ? Math.max(picked.length, Math.round(target * 1.3) - news.length) : 0
  const chapters: ChapterTopic[] = picked.map(({ chapter, reason }, i) => ({
    chapterId: chapter.id,
    guideId: chapter.guideId,
    title: chapter.title,
    reason,
    excerpt: excerpt(input.plainText.get(chapter.id) ?? ''),
    existingReelTitles: [...(input.reelTitlesByChapter.get(chapter.id) ?? [])],
    reels: Math.floor(chapterBudget / picked.length) + (i < chapterBudget % picked.length ? 1 : 0),
  }))
  return { news, chapters, ask: news.length + chapters.reduce((s, c) => s + c.reels, 0) }
}

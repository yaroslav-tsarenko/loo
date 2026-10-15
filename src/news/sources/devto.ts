import { excerpt } from '../feed'
import { fetchJson, safely } from '../http'
import type { NewsDraft } from '../types'

interface DevToArticle {
  title: string
  url: string
  description: string | null
  public_reactions_count: number
  comments_count: number
  published_timestamp: string
  reading_time_minutes: number
  tag_list: string[]
  user: { name: string; username: string }
}

const TAGS = ['javascript', 'typescript', 'node', 'webdev']
const PER_PAGE = 12
const MIN_REACTIONS = 8
const CAP = 25

export function fetchDevTo(): Promise<NewsDraft[]> {
  return safely('devto', async () => {
    // top=2: most popular of the last two days (top=1 is often almost empty in the morning).
    const pages = await Promise.all(TAGS.map((tag) => fetchJson<DevToArticle[]>(`https://dev.to/api/articles?tag=${tag}&top=2&per_page=${PER_PAGE}`)))
    const seen = new Set<string>()
    const out: NewsDraft[] = []
    for (const a of pages.flatMap((p) => p ?? []).sort((x, y) => y.public_reactions_count - x.public_reactions_count)) {
      if (seen.has(a.url) || a.public_reactions_count < MIN_REACTIONS) continue
      // webdev is broad: keep only posts also tagged with something JS-ish.
      if (!a.tag_list.some((t) => /javascript|typescript|node|react|deno|bun|webassembly|ecmascript|vue|svelte|nextjs|vite/.test(t))) continue
      seen.add(a.url)
      out.push({
        source: 'devto',
        title: a.title,
        url: a.url,
        summary: a.description ? excerpt(a.description, 240) : undefined,
        author: a.user.name || a.user.username,
        score: a.public_reactions_count + a.comments_count * 2,
        tags: a.reading_time_minutes >= 12 ? ['deep-dive'] : [],
        publishedAt: Date.parse(a.published_timestamp) || Date.now(),
      })
    }
    return out.slice(0, CAP)
  })
}

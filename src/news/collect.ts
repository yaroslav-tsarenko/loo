// Fetch → normalize → rank → dedupe. No DB, so it can run from a plain script.
import { dedupe } from './dedupe'
import { classify, rankScore } from './rank'
import { fetchDevTo } from './sources/devto'
import { fetchFeeds } from './sources/feeds'
import { fetchGithubReleases } from './sources/github'
import { fetchHackerNews } from './sources/hn'
import { fetchReddit } from './sources/reddit'
import type { NewsDraft, RankedNews } from './types'
import { safeExternalUrl } from '@/lib/url'
import { canonicalUrl, newsId } from './url'

// Older items are not "news" anymore (stale blogs return years of posts).
export const MAX_AGE_MS = 14 * 86_400_000

export interface Collected {
  items: RankedNews[]
  // Raw items per source family before filtering / dedupe.
  fetched: Record<string, number>
}

function sourceKey(source: string): string {
  return source.startsWith('github/') ? 'github' : source.startsWith('reddit/') ? 'reddit' : source
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

// Drops summaries that only repeat the title (dev.to descriptions often do).
export function cleanSummary(title: string, summary: string | undefined): string | undefined {
  const text = summary?.replace(/\s+/g, ' ').trim()
  if (!text) return undefined
  const t = norm(title)
  const s = norm(text)
  const head = s.replace(/\s*\S*$/, '')
  if (s === t || (head.length >= 6 && t.startsWith(head))) return undefined
  if (s.startsWith(`${t} `)) return cleanSummary(title, text.slice(title.length).replace(/^[\s:.,—–-]+/, ''))
  return text
}

export function rankDrafts(drafts: NewsDraft[], now: number): RankedNews[] {
  const ranked: RankedNews[] = []
  for (const d of drafts) {
    const canonical = canonicalUrl(d.url)
    const url = safeExternalUrl(d.url)
    // Feed text is untrusted: cap sizes before it reaches the DB, the UI and the reels prompt.
    const title = d.title.replace(/\s+/g, ' ').trim().slice(0, 300)
    if (!canonical || !url || !title || now - d.publishedAt > MAX_AGE_MS) continue
    const summary = cleanSummary(title, d.summary)?.slice(0, 600)
    const draft = { ...d, url, title, summary, author: d.author?.slice(0, 120) }
    ranked.push({ ...draft, id: newsId(canonical), rank: rankScore(draft, now), tags: classify(draft) })
  }
  return dedupe(ranked)
}

export async function collectNews(now: number): Promise<Collected> {
  const batches = await Promise.all([fetchHackerNews(now), fetchReddit(), fetchDevTo(), ...fetchFeeds(now), ...fetchGithubReleases()])
  const drafts = batches.flat()
  const fetched: Record<string, number> = {}
  for (const d of drafts) fetched[sourceKey(d.source)] = (fetched[sourceKey(d.source)] ?? 0) + 1
  return { items: rankDrafts(drafts, now), fetched }
}

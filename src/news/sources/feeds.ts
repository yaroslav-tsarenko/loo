import { excerpt, parseFeed, stripHtml, type FeedEntry } from '../feed'
import { fetchText, safely } from '../http'
import type { NewsDraft } from '../types'

interface FeedSource {
  id: string
  url: string
  cap: number
  tags?: string[]
  // Optional per-entry filter / rewrite.
  map?: (e: FeedEntry, draft: NewsDraft) => NewsDraft | null
}

// Cooperpress newsletters: one item per issue; summary = the issue's lead headlines.
function newsletter(e: FeedEntry, draft: NewsDraft): NewsDraft {
  const heads = [...e.html.matchAll(/<span style="font-weight: 600[^"]*"><a [^>]*>([\s\S]*?)<\/a>/g)].map((m) => stripHtml(m[1] ?? '')).filter(Boolean)
  const issue = /#\u200b?(\d+)/.exec(stripHtml(e.html))?.[1]
  return { ...draft, title: issue ? `#${issue}: ${e.title}` : e.title, summary: heads.length ? excerpt(heads.slice(0, 4).join(' · '), 280) : draft.summary }
}

// Node.js blog posts every patch release; keep majors/minors, security posts and articles.
function nodeBlog(e: FeedEntry, draft: NewsDraft): NewsDraft | null {
  const v = /\/blog\/release\/v(\d+)\.(\d+)\.(\d+)/.exec(e.url)
  if (!v) return draft
  return v[3] === '0' ? { ...draft, tags: ['release'] } : null
}

export const FEEDS: FeedSource[] = [
  { id: 'jsweekly', url: 'https://cprss.s3.amazonaws.com/javascriptweekly.com.xml', cap: 2, map: newsletter },
  { id: 'nodeweekly', url: 'https://cprss.s3.amazonaws.com/nodeweekly.com.xml', cap: 2, map: newsletter },
  { id: 'v8', url: 'https://v8.dev/blog.atom', cap: 5, tags: ['deep-dive'] },
  { id: 'chrome', url: 'https://developer.chrome.com/static/blog/feed.xml', cap: 8 },
  { id: 'webdev', url: 'https://web.dev/static/blog/feed.xml', cap: 6 },
  { id: 'nodejs', url: 'https://nodejs.org/en/feed/blog.xml', cap: 10, map: nodeBlog },
  { id: 'typescript', url: 'https://devblogs.microsoft.com/typescript/feed/', cap: 5 },
  { id: 'react', url: 'https://react.dev/rss.xml', cap: 5 },
]

export function fetchFeed(feed: FeedSource, now: number): Promise<NewsDraft[]> {
  return safely(feed.id, async () => {
    const xml = await fetchText(feed.url)
    if (!xml) return []
    const out: NewsDraft[] = []
    for (const e of parseFeed(xml)) {
      const text = stripHtml(e.html)
      const draft: NewsDraft = {
        source: feed.id,
        title: e.title,
        url: e.url,
        summary: text ? excerpt(text, 280) : undefined,
        author: e.author ?? undefined,
        score: 0,
        tags: [...(feed.tags ?? [])],
        publishedAt: Math.min(e.publishedAt ?? now, now),
      }
      const mapped = feed.map ? feed.map(e, draft) : draft
      if (mapped) out.push(mapped)
      if (out.length >= feed.cap) break
    }
    return out
  })
}

export function fetchFeeds(now: number): Promise<NewsDraft[]>[] {
  return FEEDS.map((f) => fetchFeed(f, now))
}

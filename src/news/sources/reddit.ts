import { excerpt, parseFeed, stripHtml } from '../feed'
import { fetchJson, fetchText, safely } from '../http'
import type { NewsDraft } from '../types'

const SUBS = ['javascript', 'typescript', 'node']
const LIMIT = 10
const MIN_UPS = 10

interface RedditPost {
  title: string
  url: string
  permalink: string
  author: string
  ups: number
  num_comments: number
  created_utc: number
  is_self: boolean
  selftext: string
  stickied: boolean
  over_18: boolean
  link_flair_text: string | null
}

// Self posts link to the thread, link posts to the article (so they dedupe with HN etc.).
function viaJson(sub: string, posts: RedditPost[]): NewsDraft[] {
  return posts
    .filter((p) => !p.stickied && !p.over_18 && p.ups >= MIN_UPS)
    .map((p) => {
      const thread = `https://www.reddit.com${p.permalink}`
      return {
        source: `reddit/${sub}`,
        title: p.title,
        url: p.is_self ? thread : p.url,
        summary: p.selftext ? excerpt(p.selftext, 240) : p.num_comments ? `${p.num_comments} коментарів на r/${sub}` : undefined,
        author: p.author,
        score: p.ups,
        tags: p.is_self ? ['discussion'] : [],
        publishedAt: p.created_utc * 1000,
      }
    })
}

// RSS has no vote counts: estimate from the position in "top of day".
function viaRss(sub: string, xml: string): NewsDraft[] {
  return parseFeed(xml)
    .slice(0, LIMIT)
    .map((e, i) => {
      const external = /<a href="([^"]+)">\[link\]<\/a>/.exec(e.html)?.[1]
      const isSelf = !external || external.includes('reddit.com/')
      const body = stripHtml(e.html.replace(/submitted by[\s\S]*$/, ''))
      return {
        source: `reddit/${sub}`,
        title: e.title,
        url: isSelf ? e.url : external,
        summary: body ? excerpt(body, 240) : undefined,
        author: e.author?.replace(/^\/u\//, '') ?? undefined,
        score: Math.round(120 / (i + 1)),
        tags: isSelf ? ['discussion'] : [],
        publishedAt: e.publishedAt ?? Date.now(),
      }
    })
}

export function fetchReddit(): Promise<NewsDraft[]> {
  return safely('reddit', async () => {
    const out: NewsDraft[] = []
    // Reddit often blocks datacenter IPs on .json; once it fails, go straight to RSS.
    let jsonWorks = true
    for (const sub of SUBS) {
      if (jsonWorks) {
        const data = await fetchJson<{ data: { children: { data: RedditPost }[] } }>(`https://www.reddit.com/r/${sub}/top.json?t=day&limit=${LIMIT}&raw_json=1`)
        if (data?.data?.children) {
          out.push(...viaJson(sub, data.data.children.map((c) => c.data)))
          continue
        }
        jsonWorks = false
      }
      // Unauthenticated RSS is rate-limited hard: space the requests out.
      if (out.length > 0 || sub !== SUBS[0]) await new Promise((r) => setTimeout(r, 1200))
      const xml = await fetchText(`https://www.reddit.com/r/${sub}/top/.rss?t=day&limit=${LIMIT}`)
      if (xml) out.push(...viaRss(sub, xml))
    }
    return out
  })
}

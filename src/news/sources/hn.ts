import { excerpt, stripHtml } from '../feed'
import { fetchJson, safely } from '../http'
import type { NewsDraft } from '../types'

interface HnHit {
  objectID: string
  title: string | null
  url: string | null
  author: string | null
  points: number | null
  num_comments: number | null
  created_at_i: number
  story_text: string | null
}

const QUERIES = ['javascript', 'typescript', 'node.js', 'nodejs', 'react', 'v8', 'webassembly', 'wasm', 'ecmascript', 'tc39', 'deno', 'bun', 'npm', 'vite', 'frontend']
// Title must really be about the JS ecosystem (guards against partial matches like "Bun" → "Bundle").
const RELEVANT = /javascript|typescript|\bjs\b|\bnode(?:\.?js)?\b|\breact\b|\bv8\b|webassembly|\bwasm\b|ecmascript|tc39|\bdeno\b|\bbun\b|\bnpm\b|\bvite\b|frontend|next\.js/i
// JS stories on HN are rare: a 3-day window with a modest threshold.
const MIN_POINTS = 10
const WINDOW_S = 72 * 3600
const CAP = 40

async function search(query: string, since: number): Promise<HnHit[]> {
  const params = new URLSearchParams({
    tags: 'story',
    query,
    restrictSearchableAttributes: 'title',
    typoTolerance: 'false',
    queryType: 'prefixNone',
    numericFilters: `created_at_i>${since},points>=${MIN_POINTS}`,
    hitsPerPage: '20',
  })
  const data = await fetchJson<{ hits: HnHit[] }>(`https://hn.algolia.com/api/v1/search?${params}`)
  return data?.hits ?? []
}

export function fetchHackerNews(now: number): Promise<NewsDraft[]> {
  return safely('hn', async () => {
    const since = Math.floor(now / 1000) - WINDOW_S
    const results = await Promise.all(QUERIES.map((q) => search(q, since)))
    const seen = new Set<string>()
    const out: NewsDraft[] = []
    for (const hit of results.flat().sort((a, b) => (b.points ?? 0) - (a.points ?? 0))) {
      if (!hit.title || seen.has(hit.objectID) || !RELEVANT.test(hit.title)) continue
      seen.add(hit.objectID)
      const discussion = `https://news.ycombinator.com/item?id=${hit.objectID}`
      const text = hit.story_text ? excerpt(stripHtml(hit.story_text), 240) : ''
      out.push({
        source: 'hn',
        title: hit.title,
        url: hit.url || discussion,
        summary: text || (hit.num_comments ? `${hit.num_comments} коментарів на HN` : undefined),
        author: hit.author ?? undefined,
        score: hit.points ?? 0,
        tags: hit.url ? [] : ['discussion'],
        publishedAt: hit.created_at_i * 1000,
      })
    }
    return out.slice(0, CAP)
  })
}

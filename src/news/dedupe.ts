import { parseRelease } from './release'
import { NEWS_TAGS, type RankedNews } from './types'

const STOP = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'for', 'to', 'with', 'is', 'are', 'now', 'out', 'new', 'how', 'why', 'what', 'your', 'you', 'my', 'we', 'i', 'it', 'its', 'this', 'that', 'announcing', 'introducing', 'released', 'release', 'available', 'show', 'hn', 'ask', 'current', 'lts'])

// Tokens keep dotted versions intact ("node.js", "26.12.0").
export function titleTokens(title: string): Set<string> {
  const words = title.toLowerCase().match(/[\p{L}\p{N}]+(?:\.[\p{L}\p{N}]+)*/gu) ?? []
  return new Set(words.map((w) => w.replace(/^v(?=\d)/, '').replace(/(\.0)+$/, '')).filter((w) => !STOP.has(w)))
}

export function titleSimilarity(a: string, b: string): number {
  const ta = titleTokens(a)
  const tb = titleTokens(b)
  if (ta.size < 2 || tb.size < 2) return a.trim().toLowerCase() === b.trim().toLowerCase() ? 1 : 0
  let shared = 0
  for (const t of ta) if (tb.has(t)) shared++
  return shared / (ta.size + tb.size - shared)
}

const PRODUCT = /\b(node(?:\.js)?|typescript|react|next\.js|bun|deno|vite)\b/i

// "Node.js 26.12.0 (Current)" and "Node.js v26.12.0" → "node@26.12".
export function releaseKey(title: string): string | null {
  const product = PRODUCT.exec(title)?.[1]?.toLowerCase().replace(/\.js$/, '')
  const r = parseRelease(title)
  if (!product || !r) return null
  return `${product}@${r.major}.${r.minor}${r.patch ? `.${r.patch}` : ''}${r.pre ? `-${r.pre.replace(/\.0$/, '')}` : ''}`
}

export const NEAR_DUPLICATE = 0.8

function better(a: RankedNews, b: RankedNews): RankedNews {
  // Prose announcement beats a bare GitHub release page.
  const aGh = a.source.startsWith('github/')
  const bGh = b.source.startsWith('github/')
  if (aGh !== bGh && releaseKey(a.title) && releaseKey(a.title) === releaseKey(b.title)) return aGh ? b : a
  return b.rank > a.rank ? b : a
}

function merge(a: RankedNews, b: RankedNews): RankedNews {
  const win = better(a, b)
  const lose = win === a ? b : a
  const all = new Set([...win.tags, ...lose.tags])
  const tags = NEWS_TAGS.filter((t) => all.has(t) && t !== 'news').slice(0, 3)
  return { ...win, tags: tags.length ? tags : ['news'], rank: Math.max(win.rank, lose.rank), summary: win.summary ?? lose.summary }
}

type Titled = { title: string; tags: readonly string[] }

// Same release announced in two places, or titles sharing ≥80% of meaningful words.
export function isNearDuplicate(a: Titled, b: Titled): boolean {
  if (a.tags.includes('release') && b.tags.includes('release')) {
    const ka = releaseKey(a.title)
    if (ka && ka === releaseKey(b.title)) return true
  }
  return titleSimilarity(a.title, b.title) >= NEAR_DUPLICATE
}

// Collapses same-URL and near-duplicate-title items, keeping the best one per story.
export function dedupe(items: RankedNews[]): RankedNews[] {
  const byId = new Map<string, RankedNews>()
  for (const item of items) {
    const prev = byId.get(item.id)
    byId.set(item.id, prev ? merge(prev, item) : item)
  }
  const out: RankedNews[] = []
  for (const item of [...byId.values()].sort((a, b) => b.rank - a.rank)) {
    const i = out.findIndex((o) => isNearDuplicate(o, item))
    if (i === -1) out.push(item)
    else out[i] = merge(out[i]!, item)
  }
  return out
}

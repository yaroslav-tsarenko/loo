import { createHash } from 'node:crypto'

// Query params that never change what the page is: tracking, locale hints, referrers.
const NOISE = new Set(['ref', 'ref_src', 'ref_url', 'source', 'src', 'hl', 'fbclid', 'gclid', 'dclid', 'msclkid', 'mc_cid', 'mc_eid', 'igshid', 'si', 'cmpid', 'campaign', 'via', 'rss', 'feed', 'share', 'sh'])

// https, no www., no hash, no tracking params, sorted query, no trailing slash.
export function canonicalUrl(raw: string): string | null {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  url.protocol = 'https:'
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, '')
  url.port = ''
  url.hash = ''
  url.username = ''
  url.password = ''
  const kept = [...url.searchParams].filter(([k]) => !k.toLowerCase().startsWith('utm_') && !NOISE.has(k.toLowerCase()))
  kept.sort(([a], [b]) => a.localeCompare(b))
  const search = new URLSearchParams(kept).toString()
  const path = url.pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '')
  return `https://${url.host}${path}${search ? `?${search}` : ''}`
}

export function newsId(canonical: string): string {
  return createHash('sha1').update(canonical).digest('hex')
}

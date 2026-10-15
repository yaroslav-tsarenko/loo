// Tiny HTTP cache model (RFC 9111, simplified: age = now − storedAt, no Age/Date headers,
// no heuristic freshness).

export interface CacheEntry {
  etag: string
  // seconds on the demo clock when the response was stored / last revalidated
  storedAt: number
  maxAge: number
  // Cache-Control: no-cache → stored, but must be revalidated before every use
  noCache?: boolean
}

export type Decision = 'miss' | 'fresh' | 'stale'

export function ageOf(entry: CacheEntry, now: number): number {
  return Math.max(0, now - entry.storedAt)
}

// fresh while freshness lifetime > current age
export function decide(entry: CacheEntry | null, now: number): Decision {
  if (!entry) return 'miss'
  if (entry.noCache) return 'stale'
  return entry.maxAge > ageOf(entry, now) ? 'fresh' : 'stale'
}

// server side of a conditional request with If-None-Match
export function revalidate(ifNoneMatch: string, currentEtag: string): 304 | 200 {
  return ifNoneMatch === currentEtag ? 304 : 200
}

// what to do with the response headers: no-store never enters the cache
export function storable(cacheControl: string): boolean {
  return !cacheControl
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .includes('no-store')
}

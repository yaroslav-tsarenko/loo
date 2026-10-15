// Network helpers for fetchers: 8s timeout, descriptive User-Agent, never throw.

export const USER_AGENT = 'web:interview-prep-news:v1.0 (personal JS learning digest)'
const TIMEOUT_MS = 8_000

export async function fetchText(url: string, accept = 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8'): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: accept }, signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' })
    if (!res.ok) {
      console.warn(`[news] ${res.status} ${url}`)
      return null
    }
    return await res.text()
  } catch (error) {
    console.warn(`[news] fetch failed ${url}: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

export async function fetchJson<T>(url: string): Promise<T | null> {
  const text = await fetchText(url, 'application/json')
  if (text === null) return null
  try {
    return JSON.parse(text) as T
  } catch {
    console.warn(`[news] bad JSON from ${url}`)
    return null
  }
}

// Runs a fetcher, logging and swallowing any unexpected error.
export async function safely<T>(label: string, run: () => Promise<T[]>): Promise<T[]> {
  try {
    return await run()
  } catch (error) {
    console.error(`[news] ${label} failed`, error)
    return []
  }
}

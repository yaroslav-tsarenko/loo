import 'server-only'
import type { SQL } from 'drizzle-orm'
import { getDb } from '@/db/client'

// Query runner of the admin analytics (docs/ANALYTICS.md): system reads (analytics_events has no grants), time-boxed
// and one at a time.

export type Row = Record<string, unknown>

// Every query is timed and capped: a slow or stuck one leaves its block empty (named in `issues`) instead of hanging
// the whole page; the timings go to the function log (`[admin] stats …`).
const QUERY_TIMEOUT_MS = 8_000

export async function rows<T extends Row>(q: SQL, name = 'query', log?: string[], issues?: string[]): Promise<T[]> {
  const started = Date.now()
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const result = await Promise.race([
      getDb().execute(q) as unknown as Promise<T[]>,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT_MS)
      }),
    ])
    log?.push(`${name} ${Date.now() - started}ms`)
    return result
  } catch (e) {
    log?.push(`${name} FAILED ${Date.now() - started}ms ${(e as Error).message.slice(0, 120)}`)
    issues?.push(name)
    return []
  } finally {
    clearTimeout(timer)
  }
}

// One query at a time: Supabase's transaction pooler (Supavisor, port 6543) drops replies of queries pipelined on one
// connection (docs/PERFORMANCE.md §DB) — 14 parallel queries on a pool of 3 left one or two hanging forever. The returned
// `q` queues each statement behind the previous one, so callers may still start them all with Promise.all.
export function sequential(log: string[], issues: string[]): <T extends Row>(name: string, query: SQL) => Promise<T[]> {
  let chain: Promise<unknown> = Promise.resolve()
  return <T extends Row>(name: string, query: SQL): Promise<T[]> => {
    const run = chain.then(() => rows<T>(query, name, log, issues))
    chain = run.catch(() => undefined)
    return run
  }
}

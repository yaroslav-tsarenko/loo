import { createHash } from 'node:crypto'
import { RUNNER_WORKER_CSP } from '@/lib/csp'
import { workerSource } from '@/ui/code/worker-source'

// Dedicated worker script for the code runner. Served from a real URL (not a blob:) so it gets
// its own CSP: learner and test code may eval, but can't fetch, import or open sockets.
export const dynamic = 'force-dynamic'

const SOURCE = workerSource()
// The script carries the TS stripper (~48 KB gzip) and a fresh worker starts on every run: revalidate, don't refetch
const ETAG = `"${createHash('sha256').update(SOURCE).digest('base64url').slice(0, 27)}"`

const HEADERS = {
  'Content-Type': 'text/javascript; charset=utf-8',
  'Content-Security-Policy': RUNNER_WORKER_CSP,
  'Cache-Control': 'no-cache',
  'X-Content-Type-Options': 'nosniff',
  ETag: ETAG,
}

export function GET(request: Request): Response {
  if (request.headers.get('if-none-match') === ETAG) return new Response(null, { status: 304, headers: HEADERS })
  return new Response(SOURCE, { headers: HEADERS })
}

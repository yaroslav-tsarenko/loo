import { RUNNER_WORKER_CSP } from '@/lib/csp'
import { workerSource } from '@/ui/code/worker-source'

// Dedicated worker script for the code runner. Served from a real URL (not a blob:) so it gets
// its own CSP: learner and test code may eval, but can't fetch, import or open sockets.
export const dynamic = 'force-dynamic'

const SOURCE = workerSource()

export function GET(): Response {
  return new Response(SOURCE, {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Content-Security-Policy': RUNNER_WORKER_CSP,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

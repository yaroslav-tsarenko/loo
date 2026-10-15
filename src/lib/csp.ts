// Content-Security-Policy for app pages. Nonce-based script-src with 'strict-dynamic':
// Next.js stamps the nonce on its own scripts (read from this header in proxy.ts), and
// chunks loaded by those scripts are trusted transitively. Inline style attributes are
// used throughout the UI (React style props, motion), so style-src keeps 'unsafe-inline'.
export interface CspOptions {
  nonce: string
  dev: boolean
  https: boolean
}

export function buildCsp({ nonce, dev, https }: CspOptions): string {
  const directives: [string, ...string[]][] = [
    ['default-src', "'self'"],
    // 'unsafe-eval' only in dev: React uses eval for server error stacks there.
    ['script-src', "'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(dev ? ["'unsafe-eval'"] : [])],
    ['style-src', "'self'", "'unsafe-inline'"],
    ['img-src', "'self'", 'data:', 'blob:'],
    ['font-src', "'self'", 'data:'],
    ['connect-src', "'self'", ...(dev ? ['ws:'] : [])],
    ['media-src', "'self'", 'data:', 'blob:'],
    // The code runner worker is a same-origin script with its own locked-down CSP (/runner/worker.js).
    ['worker-src', "'self'"],
    ['manifest-src', "'self'"],
    ['frame-src', "'none'"],
    ['object-src', "'none'"],
    ['base-uri', "'none'"],
    ['form-action', "'self'"],
    ['frame-ancestors', "'none'"],
  ]
  if (https) directives.push(['upgrade-insecure-requests'])
  return directives.map((d) => d.join(' ')).join('; ')
}

// The code-runner worker evaluates learner code (AsyncFunction), so it needs 'unsafe-eval' —
// and nothing else: no network, no imports, no nested workers.
export const RUNNER_WORKER_CSP = "default-src 'none'; script-src 'unsafe-eval'"

export function createNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Buffer.from(bytes).toString('base64')
}

// Content-Security-Policy for app pages. Nonce-based script-src with 'strict-dynamic':
// Next.js stamps the nonce on its own scripts (read from this header in proxy.ts), and
// chunks loaded by those scripts are trusted transitively. Inline style attributes are
// used throughout the UI (React style props, motion), so style-src keeps 'unsafe-inline'.
export interface CspOptions {
  nonce: string
  dev: boolean
  https: boolean
  // Supabase project origin (Auth API, storage-hosted avatars).
  supabaseUrl?: string | null
}

// Profile pictures from the OAuth providers (Google, GitHub).
export const AVATAR_HOSTS = ['https://lh3.googleusercontent.com', 'https://avatars.githubusercontent.com'] as const

export function buildCsp({ nonce, dev, https, supabaseUrl }: CspOptions): string {
  const supabase = supabaseUrl ? [supabaseUrl] : []
  const directives: [string, ...string[]][] = [
    ['default-src', "'self'"],
    // 'unsafe-eval' only in dev: React uses eval for server error stacks there.
    ['script-src', "'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(dev ? ["'unsafe-eval'"] : [])],
    ['style-src', "'self'", "'unsafe-inline'"],
    ['img-src', "'self'", 'data:', 'blob:', ...supabase, ...AVATAR_HOSTS],
    ['font-src', "'self'", 'data:'],
    ['connect-src', "'self'", ...supabase, ...(dev ? ['ws:'] : [])],
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

// Prerendered public pages (/blog, /welcome — src/lib/auth-paths.ts → STATIC_PUBLIC). Static HTML can't carry a
// per-request nonce, and Next's inline bootstrap scripts (the RSC payload) differ per build, so they can't be hashed
// either: scripts are 'self' + 'unsafe-inline'. Acceptable there and only there: those pages render no user input,
// no raw HTML (the blog's markdown goes through remark without allowDangerousHtml), no session, and no third-party
// script origin is allowed. Everything else keeps the nonce policy above.
export function buildPublicCsp({ dev, https, supabaseUrl }: Omit<CspOptions, 'nonce'>): string {
  return buildCsp({ nonce: '', dev, https, supabaseUrl }).replace(/script-src [^;]+/, `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`)
}

// The code-runner worker evaluates learner code (AsyncFunction), so it needs 'unsafe-eval' —
// and nothing else: no network, no imports, no nested workers.
export const RUNNER_WORKER_CSP = "default-src 'none'; script-src 'unsafe-eval'"

export function createNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Buffer.from(bytes).toString('base64')
}

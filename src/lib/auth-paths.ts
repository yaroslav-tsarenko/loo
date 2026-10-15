// Which requests are reachable without a session, and which pages render without the app chrome.
// Pure (used by src/proxy.ts, the app shell and tests).

// Exact paths, GET/HEAD.
export const PUBLIC_GET: ReadonlySet<string> = new Set([
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/auth/callback',
  '/auth/confirm',
  '/auth/oauth',
  '/manifest.webmanifest',
  '/icon',
  '/apple-icon',
  '/favicon.ico',
])

// Exact paths, POST (plain form posts to route handlers; each checks the Origin itself).
export const PUBLIC_POST: ReadonlySet<string> = new Set(['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/sign-out'])

export function isPublicRequest(method: string, pathname: string, isServerAction: boolean, dev = false): boolean {
  // A server action call is never public, whatever path it is posted to.
  if (isServerAction) return false
  if ((method === 'GET' || method === 'HEAD') && PUBLIC_GET.has(pathname)) return true
  if (method === 'POST' && PUBLIC_POST.has(pathname)) return true
  // Dev-only tooling (HMR socket, error overlay) — never present in production builds.
  return dev && (pathname.startsWith('/_next/') || pathname.startsWith('/__nextjs'))
}

// Pages that render full-screen, without sidebar / bottom nav, even for a signed-in user.
const BARE = ['/login', '/signup', '/forgot-password', '/reset-password', '/onboarding', '/auth']

export function isBarePath(pathname: string): boolean {
  return BARE.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

// Pages only for signed-out visitors: a signed-in user is sent home.
export const SIGNED_OUT_ONLY: ReadonlySet<string> = new Set(['/login', '/signup', '/forgot-password'])

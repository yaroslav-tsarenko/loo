import { NextResponse, type NextRequest } from 'next/server'
import { authMode, cronAuthorized, createSessionToken, SESSION_COOKIE, SESSION_RENEW_BELOW_MS, sessionCookieOptions, sessionExpiry } from '@/lib/auth'
import { buildCsp, createNonce } from '@/lib/csp'
import { isHttps } from '@/lib/same-origin'

// Reachable without a session (exact paths; GET/HEAD unless listed otherwise).
const PUBLIC_GET = new Set(['/login', '/manifest.webmanifest', '/icon', '/apple-icon', '/favicon.ico'])
const PUBLIC_POST = new Set(['/auth/login'])
// Routes that set their own CSP (the code-runner worker needs a different policy).
const OWN_CSP = new Set(['/runner/worker.js'])

const dev = process.env.NODE_ENV === 'development'

function isPublic(request: NextRequest): boolean {
  const { pathname } = request.nextUrl
  const method = request.method
  // A server action call is never public, whatever path it is posted to.
  if (request.headers.has('next-action')) return false
  if ((method === 'GET' || method === 'HEAD') && PUBLIC_GET.has(pathname)) return true
  if (method === 'POST' && PUBLIC_POST.has(pathname)) return true
  // Dev-only tooling (HMR socket, error overlay) — never present in production builds.
  return dev && (pathname.startsWith('/_next/') || pathname.startsWith('/__nextjs'))
}

function withCsp(request: NextRequest): { response: NextResponse; csp: string | null } {
  const { pathname } = request.nextUrl
  if (OWN_CSP.has(pathname)) return { response: NextResponse.next(), csp: null }
  const nonce = createNonce()
  const csp = buildCsp({ nonce, dev, https: isHttps(request.nextUrl, request.headers) })
  // Next.js reads the nonce from the request's CSP header and applies it to its scripts.
  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)
  headers.set('content-security-policy', csp)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', csp)
  return { response, csp }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Vercel Cron authenticates with a bearer secret instead of the session cookie.
  if (pathname.startsWith('/api/cron/')) {
    return (await cronAuthorized(request.headers.get('authorization'))) ? NextResponse.next() : new NextResponse('Unauthorized', { status: 401 })
  }

  const mode = authMode()
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const expires = mode === 'password' ? await sessionExpiry(token) : null
  const authed = mode === 'open' || expires !== null

  if (!authed && !isPublic(request)) {
    if (pathname.startsWith('/api/') || request.headers.has('next-action') || request.method !== 'GET') {
      return new NextResponse('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`
    return NextResponse.redirect(url)
  }

  const { response } = withCsp(request)
  // Sliding session: re-issue the cookie when less than half of its lifetime is left.
  if (expires !== null && expires - Date.now() < SESSION_RENEW_BELOW_MS) {
    response.cookies.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions(isHttps(request.nextUrl, request.headers)))
  }
  return response
}

export const config = {
  // Everything except immutable build assets: no extension-based exclusions, so a path like
  // /g/x/y.png can't skip auth (it still routes to a page and its server actions).
  matcher: ['/((?!_next/static/).*)'],
}

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { blogPageExists } from '@/blog/paths'
import { isPublicRequest, isStaticPublic } from '@/lib/auth-paths'
import { cronAuthorized } from '@/lib/auth'
import { ADMIN_COOKIE, adminSecret, verifyAdminToken } from '@/lib/admin-token'
import { buildCsp, buildPublicCsp, createNonce } from '@/lib/csp'
import { isHttps } from '@/lib/same-origin'
import { devAuthBypass, supabaseConfig } from '@/lib/supabase/config'

// Routes that set their own CSP (the code-runner worker needs a different policy).
const OWN_CSP = new Set(['/runner/worker.js'])

const dev = process.env.NODE_ENV === 'development'
// docs/PERFORMANCE.md: Server-Timing for the proxy's own work + a label for the per-request [perf] log line.
const perf = process.env.PERF_TRACE === '1'

interface PendingCookie {
  name: string
  value: string
  options: CookieOptions
}

interface Session {
  signedIn: boolean
  cookies: PendingCookie[]
  headers: Record<string, string>
}

// Supabase SSR session refresh: verifies the access token (getClaims) and, when it has expired, uses the refresh
// token and queues the new cookies. They are written to the request (so this render sees them) and to the response.
async function refreshSession(request: NextRequest): Promise<Session> {
  const session: Session = { signedIn: false, cookies: [], headers: {} }
  if (devAuthBypass()) return { ...session, signedIn: true }
  const config = supabaseConfig()
  if (!config) return session
  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(toSet, headers) {
        for (const { name, value } of toSet) request.cookies.set(name, value)
        session.cookies.push(...toSet)
        Object.assign(session.headers, headers)
      },
    },
  })
  try {
    const { data, error } = await supabase.auth.getClaims()
    session.signedIn = !error && Boolean(data?.claims?.sub) && data?.claims?.role === 'authenticated'
  } catch (error) {
    console.error('[proxy] session check failed', error)
  }
  return session
}

function withCsp(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  if (OWN_CSP.has(pathname)) return NextResponse.next({ request: { headers: new Headers(request.headers) } })
  const nonce = createNonce()
  const csp = buildCsp({ nonce, dev, https: isHttps(request.nextUrl, request.headers), supabaseUrl: supabaseConfig()?.url })
  // Next.js reads the nonce from the request's CSP header and applies it to its scripts.
  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)
  headers.set('content-security-policy', csp)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

// Prerendered public pages: no nonce (the HTML is static), no session (nothing in them depends on it).
function publicCsp(request: NextRequest): string {
  return buildPublicCsp({ dev, https: isHttps(request.nextUrl, request.headers), supabaseUrl: supabaseConfig()?.url })
}

function staticPublic(request: NextRequest, rewriteTo?: string): NextResponse {
  const response = rewriteTo ? NextResponse.rewrite(new URL(rewriteTo, request.url)) : NextResponse.next()
  response.headers.set('Content-Security-Policy', publicCsp(request))
  return response
}

// Refreshed auth cookies must reach the browser whatever response we send (and never be cached by a CDN).
function finish(response: NextResponse, session: Session): NextResponse {
  for (const { name, value, options } of session.cookies) response.cookies.set(name, value, options)
  for (const [key, value] of Object.entries(session.headers)) response.headers.set(key, value)
  return response
}

export async function proxy(request: NextRequest) {
  if (!perf) return handle(request)
  const started = performance.now()
  request.headers.set('x-perf-label', `${request.method} ${request.nextUrl.pathname}${request.headers.has('next-action') ? ' (action)' : ''}`)
  const response = await handle(request)
  response.headers.append('Server-Timing', `proxy;dur=${(performance.now() - started).toFixed(1)}`)
  return response
}

const NOT_FOUND_HTML = `<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Сторінку не знайдено · Loo</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 20px;color:#17161d"><h1>Такої статті немає</h1><p>Можливо, адреса змінилася. Усі статті — у <a href="/blog" style="color:#7c4dff">блозі Loo</a>.</p></body></html>`

function blogNotFound(): NextResponse {
  return new NextResponse(NOT_FOUND_HTML, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } })
}

async function handle(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // Unknown blog posts: a real 404 before any rendering (src/blog/paths.ts explains why the page itself can't).
  if (blogPageExists(pathname) === false) return blogNotFound()

  // Vercel Cron authenticates with a bearer secret instead of a user session.
  if (pathname.startsWith('/api/cron/')) {
    return (await cronAuthorized(request.headers.get('authorization'))) ? NextResponse.next() : new NextResponse('Unauthorized', { status: 401 })
  }

  // The admin area opens with the owner's signed admin cookie, no learner session needed (docs/ANALYTICS.md).
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (await verifyAdminToken(adminSecret(), request.cookies.get(ADMIN_COOKIE)?.value, Date.now())) return withCsp(request)
  }

  const isAction = request.headers.has('next-action')
  const read = request.method === 'GET' || request.method === 'HEAD'

  // The blog and the landing are static HTML (src/app/layout.tsx): served as they are, without the Supabase session
  // round trip. A signed-in reader's session simply refreshes on their next app page.
  if (read && !isAction && isStaticPublic(pathname)) return staticPublic(request)

  const session = await refreshSession(request)

  // Signed-out `/` is the landing: the prerendered /welcome (a query string — `?deleted=1` after account deletion —
  // keeps the dynamic page, which shows the notice).
  if (read && !isAction && !session.signedIn && pathname === '/' && !request.nextUrl.search) return finish(staticPublic(request, '/welcome'), session)

  if (!session.signedIn && !isPublicRequest(request.method, pathname, isAction, dev)) {
    if (pathname.startsWith('/api/') || isAction || request.method !== 'GET') {
      return finish(new NextResponse('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } }), session)
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`
    return finish(NextResponse.redirect(url), session)
  }

  return finish(withCsp(request), session)
}

export const config = {
  // Everything except immutable build assets and the static metadata files (exact paths: the app icons, the web
  // manifest and the pixel icon sprite — public, prerendered, no page behind them; skipping the proxy lets the CDN
  // serve them without a function call). No extension-based exclusions, so a path like /g/x/y.png can't skip auth (it
  // still routes to a page and its server actions).
  matcher: ['/((?!_next/static/|favicon\\.ico$|icon$|apple-icon$|manifest\\.webmanifest$|pixel-icons\\.svg$).*)'],
}

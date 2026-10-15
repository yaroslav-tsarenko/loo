import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isPublicRequest } from '@/lib/auth-paths'
import { cronAuthorized } from '@/lib/auth'
import { buildCsp, createNonce } from '@/lib/csp'
import { isHttps } from '@/lib/same-origin'
import { devAuthBypass, supabaseConfig } from '@/lib/supabase/config'

// Routes that set their own CSP (the code-runner worker needs a different policy).
const OWN_CSP = new Set(['/runner/worker.js'])

const dev = process.env.NODE_ENV === 'development'

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

// Refreshed auth cookies must reach the browser whatever response we send (and never be cached by a CDN).
function finish(response: NextResponse, session: Session): NextResponse {
  for (const { name, value, options } of session.cookies) response.cookies.set(name, value, options)
  for (const [key, value] of Object.entries(session.headers)) response.headers.set(key, value)
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Vercel Cron authenticates with a bearer secret instead of a user session.
  if (pathname.startsWith('/api/cron/')) {
    return (await cronAuthorized(request.headers.get('authorization'))) ? NextResponse.next() : new NextResponse('Unauthorized', { status: 401 })
  }

  const session = await refreshSession(request)
  const isAction = request.headers.has('next-action')

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
  // Everything except immutable build assets: no extension-based exclusions, so a path like
  // /g/x/y.png can't skip auth (it still routes to a page and its server actions).
  matcher: ['/((?!_next/static/).*)'],
}

import { NextResponse, type NextRequest } from 'next/server'
import { authMode, SESSION_COOKIE, verifySessionToken } from '@/lib/auth'

const PUBLIC = ['/login', '/manifest.webmanifest', '/sw.js', '/icon', '/apple-icon', '/favicon.ico']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}.`))) return NextResponse.next()
  // Vercel Cron authenticates with a bearer secret instead of the session cookie.
  if (pathname.startsWith('/api/cron/')) {
    const ok = process.env.CRON_SECRET && request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
    return ok ? NextResponse.next() : new NextResponse('Unauthorized', { status: 401 })
  }
  const mode = authMode()
  if (mode === 'open') return NextResponse.next()
  if (mode === 'password' && (await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value))) return NextResponse.next()
  if (pathname.startsWith('/api/')) return new NextResponse('Unauthorized', { status: 401 })
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  url.search = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2?)$).*)'],
}

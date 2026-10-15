import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth'
import { isHttps, isSameOrigin } from '@/lib/same-origin'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new NextResponse('Forbidden', { status: 403 })
  const response = new NextResponse(null, { status: 303, headers: { Location: '/login', 'Cache-Control': 'no-store' } })
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: isHttps(request.nextUrl, request.headers), sameSite: 'lax', path: '/', maxAge: 0 })
  response.headers.set('Clear-Site-Data', '"cache"')
  return response
}

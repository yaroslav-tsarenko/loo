import { ADMIN_COOKIE } from '@/lib/admin-token'
import { isSameOrigin } from '@/lib/same-origin'
import { seeOther } from '@/server/auth/http'

export const dynamic = 'force-dynamic'

// Ends the admin-login session (the signed admin cookie); a learner session, if any, stays.
export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  const res = seeOther('/login')
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return res
}

import { ADMIN_COOKIE } from '@/lib/admin-token'
import { isSameOrigin } from '@/lib/same-origin'
import { revokeAdminSessions } from '@/server/admin/session'
import { seeOther } from '@/server/auth/http'

export const dynamic = 'force-dynamic'

// Ends the admin-login session — every one of them: the session generation is bumped, so a copy of the cookie
// (another device, a stolen one) stops working too (src/server/admin/session.ts). A learner session, if any, stays.
export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request.headers)) return new Response('Forbidden', { status: 403 })
  await revokeAdminSessions()
  const res = seeOther('/login')
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return res
}

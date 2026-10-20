import { NextResponse, type NextRequest } from 'next/server'
import { unsubscribe } from '@/server/email/unsubscribe'

export const dynamic = 'force-dynamic'

// POST only (docs/EMAIL.md):
// - RFC 8058 one-click from the mail client (body «List-Unsubscribe=One-Click», token in the query) → 200;
// - the form on /unsubscribe (token in the body) → back to the page with the result.
// No GET: the link in the email body opens the /unsubscribe page (link scanners and antivirus prefetch would
// otherwise turn everyone off); only this POST changes anything.
export async function POST(request: NextRequest): Promise<Response> {
  const form = await request.formData().catch(() => null)
  const token = request.nextUrl.searchParams.get('t') ?? (form?.get('t') as string | null)
  const ok = await unsubscribe(token)
  if (form?.get('List-Unsubscribe') === 'One-Click') return new NextResponse(ok ? 'unsubscribed' : 'unknown token', { status: ok ? 200 : 404 })
  const url = request.nextUrl.clone()
  url.pathname = '/unsubscribe'
  url.search = ok ? '?done=1' : '?error=1'
  return NextResponse.redirect(url, 303)
}


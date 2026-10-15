import { ingestNews } from '@/news/ingest'
import { cronAuthorized } from '@/lib/auth'
import { nowMs } from '@/server/clock'

// Vercel Cron (vercel.json) hits this daily; src/proxy.ts checks the CRON_SECRET bearer token.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request): Promise<Response> {
  // proxy.ts checks this too; re-checked here so the route never depends on the matcher alone.
  if (!(await cronAuthorized(request.headers.get('authorization')))) return new Response('Unauthorized', { status: 401 })
  try {
    const summary = await ingestNews(nowMs())
    return Response.json({ ok: true, ...summary }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[cron/news] failed', error)
    return Response.json({ ok: false, error: 'failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}

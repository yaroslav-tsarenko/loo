import { cronAuthorized } from '@/lib/auth'
import { nowMs } from '@/server/clock'
import { runRetention } from '@/server/maintenance/retention'

// Vercel Cron (vercel.json), daily: data retention (src/server/maintenance/retention.ts). src/proxy.ts checks
// CRON_SECRET; re-checked here so the route never depends on the matcher alone.
export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(request: Request): Promise<Response> {
  if (!(await cronAuthorized(request.headers.get('authorization')))) return new Response('Unauthorized', { status: 401 })
  try {
    const report = await runRetention(nowMs())
    console.log('[cron/cleanup]', JSON.stringify(report))
    return Response.json({ ok: true, ...report }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[cron/cleanup] failed', error)
    return Response.json({ ok: false, error: 'failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}

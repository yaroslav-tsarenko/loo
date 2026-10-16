import { cronAuthorized } from '@/lib/auth'
import { nowMs } from '@/server/clock'
import { finalizeDue } from '@/server/game/leagues'

// Vercel Cron (vercel.json) hits this daily: closes every league cohort of a finished week (top 7 up, bottom 5 down,
// gem rewards). Weeks are also closed lazily on the first /leagues visit of the new week. src/proxy.ts checks CRON_SECRET.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request): Promise<Response> {
  // proxy.ts checks this too; re-checked here so the route never depends on the matcher alone.
  if (!(await cronAuthorized(request.headers.get('authorization')))) return new Response('Unauthorized', { status: 401 })
  try {
    const finalized = await finalizeDue(nowMs())
    return Response.json({ ok: true, finalized }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[cron/leagues] failed', error)
    return Response.json({ ok: false, error: 'failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}

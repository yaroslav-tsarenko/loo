import { generateDailyReels } from '@/ai/reels/ingest'
import { nowMs } from '@/server/clock'

// Vercel Cron (vercel.json, 06:30 UTC — after the news ingest); src/proxy.ts checks the CRON_SECRET bearer token.
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(): Promise<Response> {
  try {
    const summary = await generateDailyReels(nowMs())
    return Response.json(summary, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[cron/reels] failed', error)
    return Response.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

import { ingestNews } from '@/news/ingest'
import { nowMs } from '@/server/clock'

// Vercel Cron (vercel.json) hits this daily; src/proxy.ts checks the CRON_SECRET bearer token.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(): Promise<Response> {
  try {
    const summary = await ingestNews(nowMs())
    return Response.json({ ok: true, ...summary }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[cron/news] failed', error)
    return Response.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

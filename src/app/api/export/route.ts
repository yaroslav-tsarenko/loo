import { getDb } from '@/db/client'
import { achievements, attempts, chapterProgress, dailyActivity, mistakes, sessions, settings, srsCards, taskState, unitAliases, units, xpLedger } from '@/db/schema'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const db = getDb()
  const data = {
    format: 'interview-prep-2.0/progress',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: await db.select().from(settings),
    units: await db.select().from(units),
    unitAliases: await db.select().from(unitAliases),
    attempts: await db.select().from(attempts),
    srsCards: await db.select().from(srsCards),
    mistakes: await db.select().from(mistakes),
    chapterProgress: await db.select().from(chapterProgress),
    taskState: await db.select().from(taskState),
    xpLedger: await db.select().from(xpLedger),
    achievements: await db.select().from(achievements),
    dailyActivity: await db.select().from(dailyActivity),
    sessions: await db.select().from(sessions),
  }
  const name = `interview-prep-progress-${new Date().toISOString().slice(0, 10)}.json`
  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="${name}"`, 'Cache-Control': 'no-store' },
  })
}

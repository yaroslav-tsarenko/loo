import { getContent } from '@/server/content'
import { navCounts } from '@/server/services/counts'
import { totalXp } from '@/server/services/progress'
import { getDb } from '@/db/client'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const snapshot = await getContent()
  return Response.json({ counts: await navCounts(snapshot), xp: await totalXp(getDb()) }, { headers: { 'Cache-Control': 'no-store' } })
}

import { apiUser } from '@/server/auth'
import { getContent } from '@/server/content'
import { navCounts } from '@/server/services/counts'
import { userXp } from '@/server/services/progress'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  if (!(await apiUser())) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const snapshot = await getContent()
  const [counts, xp] = await Promise.all([navCounts(snapshot), userXp()])
  return Response.json({ counts, xp }, { headers: { 'Cache-Control': 'no-store' } })
}

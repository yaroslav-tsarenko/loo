import { apiUser } from '@/server/auth'
import { getContent } from '@/server/content'
import { navCountsAndXp } from '@/server/services/counts'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  if (!(await apiUser())) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const snapshot = await getContent()
  return Response.json(await navCountsAndXp(snapshot), { headers: { 'Cache-Control': 'no-store' } })
}

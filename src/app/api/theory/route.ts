import { apiUser } from '@/server/auth'
import { getContent } from '@/server/content'
import { activeTheory } from '@/server/courses/theory'

export const dynamic = 'force-dynamic'

// Live refresh of the sidebar «Теорія» (chapter status after reading / marking studied).
export async function GET(): Promise<Response> {
  if (!(await apiUser())) return Response.json({ theory: null }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const theory = await activeTheory(await getContent())
  return Response.json({ theory }, { headers: { 'Cache-Control': 'no-store' } })
}

import { apiUser } from '@/server/auth'
import { getContent } from '@/server/content'
import { activeCourse } from '@/server/courses/enrollment'
import { coursePath } from '@/server/courses/path'
import { pathSections } from '@/server/courses/path-view'

export const dynamic = 'force-dynamic'

// The lessons of one locked / credited section of the map (the page ships those sections without them — see
// lightSections). Per learner (done / current states), so never cached.
export async function GET(request: Request): Promise<Response> {
  if (!(await apiUser())) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const id = new URL(request.url).searchParams.get('id') ?? ''
  const active = await activeCourse()
  if (!active || !id) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  const section = pathSections(await coursePath(await getContent(), active)).find((s) => s.id === id)
  if (!section) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  return Response.json({ topics: section.topics }, { headers: { 'Cache-Control': 'no-store' } })
}

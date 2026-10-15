import { getContent } from '@/server/content'
import { chapterProgressMap, treeView } from '@/server/services/library'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ guide: string }> }): Promise<Response> {
  const { guide: raw } = await params
  let id: string
  try {
    id = decodeURIComponent(raw)
  } catch {
    return Response.json({ nodes: [] }, { status: 400 })
  }
  const snapshot = await getContent()
  const guide = snapshot.guideById.get(id)
  if (!guide) return Response.json({ nodes: [] }, { status: 404 })
  return Response.json({ nodes: treeView(snapshot, guide, await chapterProgressMap()) }, { headers: { 'Cache-Control': 'no-store' } })
}

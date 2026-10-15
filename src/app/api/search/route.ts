import { searchContent } from '@/content/search'
import { getContent } from '@/server/content'
import { chapterHref } from '@/ui/routes'

export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  const snapshot = await getContent()
  const q = new URL(request.url).searchParams.get('q') ?? ''
  const hits = searchContent(snapshot, q.slice(0, 200)).map((hit) => {
    const chapter = snapshot.chapters.get(hit.chapterId)
    const base = chapter ? chapterHref(snapshot, chapter) : '/'
    const href = hit.type === 'chapter' ? base : `${base}#u-${hit.id.slice(2)}`
    return { id: hit.id, type: hit.type, title: hit.title, context: hit.context, href }
  })
  return Response.json({ hits }, { headers: { 'Cache-Control': 'no-store' } })
}

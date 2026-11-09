import { searchContent, warmSearchIndex } from '@/content/search'
import { getContent, getSearchSource } from '@/server/content'
import { chapterHref } from '@/ui/routes'

export const dynamic = 'force-dynamic'

// The index (~11k documents) is built only here, on demand: in chunks when the palette opens (?warm=1), so the first
// query rarely waits — never on every cold start of every bundle, which cost each new instance seconds of CPU.
export async function GET(request: Request): Promise<Response> {
  const snapshot = await getContent()
  const params = new URL(request.url).searchParams
  if (params.get('warm') === '1') {
    void getSearchSource().then(warmSearchIndex).catch(() => {})
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
  }
  const source = await getSearchSource()
  await warmSearchIndex(source)
  const q = params.get('q') ?? ''
  const hits = searchContent(source, q.slice(0, 200)).map((hit) => {
    const chapter = snapshot.chapters.get(hit.chapterId)
    const base = chapter ? chapterHref(snapshot, chapter) : '/'
    const href = hit.type === 'chapter' ? base : `${base}#u-${hit.id.slice(2)}`
    return { id: hit.id, type: hit.type, title: hit.title, context: hit.context, href }
  })
  return Response.json({ hits }, { headers: { 'Cache-Control': 'no-store' } })
}

import { apiUser } from '@/server/auth'
import { getContent } from '@/server/content'
import type { ContentSnapshot } from '@/content/store'

export const dynamic = 'force-dynamic'

// One topic of the «Словник курсу» on /words, loaded when its group is opened (the page used to render all 4 000+
// words of a course up front: 9 MB of HTML). The words are shared course content: built once per content snapshot and
// instance, cached by the browser for an hour.

export interface VocabWord {
  id: string
  word: string
  ipa: string | null
  ipaUs: string | null
  tr: string
  lang: string | null
}

const built = new WeakMap<ContentSnapshot, Map<string, string>>()

function chapterWords(snapshot: ContentSnapshot, chapterId: string): string {
  let byChapter = built.get(snapshot)
  if (!byChapter) built.set(snapshot, (byChapter = new Map()))
  const hit = byChapter.get(chapterId)
  if (hit) return hit
  const words: VocabWord[] = []
  for (const u of snapshot.units.values()) {
    if (u.chapterId !== chapterId || u.kind !== 'flashcard' || !u.word) continue
    words.push({ id: u.id, word: u.word.word, ipa: u.word.ipa, ipaUs: u.word.ipaUs ?? null, tr: u.word.translations.join('; '), lang: u.lang ?? null })
  }
  const json = JSON.stringify({ words })
  byChapter.set(chapterId, json)
  return json
}

export async function GET(request: Request): Promise<Response> {
  if (!(await apiUser())) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const chapter = new URL(request.url).searchParams.get('chapter') ?? ''
  const snapshot = await getContent()
  if (!chapter || chapter.length > 300 || !snapshot.chapters.has(chapter)) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  return new Response(chapterWords(snapshot, chapter), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=3600' } })
}

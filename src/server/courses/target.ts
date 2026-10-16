import 'server-only'
import { courseKind } from '@/course'
import { getCourse, listCourses } from './registry'

// The spoken language of a guide's language blocks ([!word] [!listen] [!speak] [!pair]): the `target` of the language
// course that teaches the guide (course.yaml `target: en`, docs/SPEECH.md). A block's own `lang:` wins; default `en`.

let cache: Promise<Map<string, string>> | null = null

async function load(): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  for (const listing of await listCourses()) {
    const bundle = await getCourse(listing.id)
    if (!bundle || courseKind(bundle.course) !== 'language') continue
    const target = bundle.course.target ?? bundle.course.language
    for (const id of [...bundle.sections.map((s) => s.guideId), ...(bundle.theory ?? [])]) if (!out.has(id)) out.set(id, target)
  }
  return out
}

export async function guideTargets(): Promise<Map<string, string>> {
  cache ??= load().catch((error: unknown) => {
    cache = null
    throw error
  })
  return cache
}

export async function speechLangFor(unit: { guideId: string; lang?: string }): Promise<string> {
  if (unit.lang) return unit.lang
  return (await guideTargets()).get(unit.guideId) ?? 'en'
}

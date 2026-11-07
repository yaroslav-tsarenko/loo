import 'server-only'
import { courseKind } from '@/course'
import { DEFAULT_SPEECH_LANG } from '@/ui/lang/speech/voices'
import { courseCatalog } from './registry'

// The spoken language of a guide's language blocks ([!word] [!listen] [!speak] [!pair]): the `target` of the language
// course that teaches the guide (course.yaml `target: en`, docs/SPEECH.md). A block's own `lang:` wins; last resort `en` (DEFAULT_SPEECH_LANG).

let cache: Promise<Map<string, string>> | null = null

async function load(): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  // the catalog has each course's guides: no bundle needs loading for this
  for (const { listing, listed, guides } of (await courseCatalog()).values()) {
    if (!listed || courseKind(listing.meta) !== 'language') continue
    const target = listing.meta.target ?? listing.meta.language
    for (const id of guides) if (!out.has(id)) out.set(id, target)
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
  return (await guideTargets()).get(unit.guideId) ?? DEFAULT_SPEECH_LANG
}

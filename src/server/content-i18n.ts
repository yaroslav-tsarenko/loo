import 'server-only'
import { courseLanguages, type CourseLanguages } from '@/course/i18n'
import type { Chapter, LearningUnit } from '@/content/model'
import { getContentStore, type ContentSnapshot, type LocalizedChapterDocument } from '@/content/store'
import { t, type Locale } from '@/i18n'
import { getCourse, listCourses } from './courses/registry'
import { uiLocale } from './locale'

// Which language a topic is shown in (docs/COURSE_FORMAT.md «Переклад курсів (i18n)»): the learner's UI locale when
// a course that teaches the guide lists it in `languages` and the topic has a translation; otherwise the source.
// Progress, grading and SRS never depend on it — exercises keep their ids (src/content/i18n/localize.ts).

let cache: Promise<Map<string, CourseLanguages>> | null = null

async function load(): Promise<Map<string, CourseLanguages>> {
  const out = new Map<string, CourseLanguages>()
  for (const listing of await listCourses()) {
    const bundle = await getCourse(listing.id)
    if (!bundle) continue
    const langs = courseLanguages(bundle.course)
    for (const id of [...bundle.sections.map((s) => s.guideId), ...(bundle.theory ?? [])]) {
      const known = out.get(id)
      // a guide taught by several courses: any of them offering a language is enough
      out.set(id, known ? { source: known.source, languages: [...new Set([...known.languages, ...langs.languages])] } : langs)
    }
  }
  return out
}

export async function guideLanguages(): Promise<Map<string, CourseLanguages>> {
  cache ??= load().catch((error: unknown) => {
    cache = null
    throw error
  })
  return cache
}

export interface ChapterLanguages {
  // the language to show; null = the source
  lang: string | null
  source: string
  // languages the page exists in (source first): translated AND offered by a course — hreflang alternates
  available: string[]
}

// `requested`: an explicit ?lang= (SEO alternates); otherwise the UI locale.
export async function chapterLanguages(snapshot: ContentSnapshot, chapter: Pick<Chapter, 'id' | 'guideId'>, requested?: string | null): Promise<ChapterLanguages> {
  const course = (await guideLanguages()).get(chapter.guideId)
  const source = course?.source ?? 'uk'
  const translated = snapshot.translations.get(chapter.id)
  const available = [source, ...(course?.languages ?? []).filter((l) => l !== source && translated?.has(l))]
  const wanted = requested ?? (await uiLocale())
  return { lang: wanted !== source && available.includes(wanted) ? wanted : null, source, available }
}

export function notTranslatedLabel(locale: Locale): string {
  return t('i18n.notTranslated', undefined, locale)
}

export async function localizedDocument(chapterId: string, lang: string, source: string): Promise<LocalizedChapterDocument | null> {
  const locale = await uiLocale()
  return getContentStore().localizedDocument(chapterId, lang, { sourceLang: source, label: notTranslatedLabel(locale), labelLang: locale })
}

// Units in the reader's language: translated texts where a translation exists, the source unit otherwise.
// The map holds only the units that changed; look up `map.get(id) ?? unit`.
export async function localizedUnits(snapshot: ContentSnapshot, units: readonly LearningUnit[]): Promise<Map<string, LearningUnit>> {
  const out = new Map<string, LearningUnit>()
  const chapters = new Set(units.map((u) => u.chapterId).filter((id) => snapshot.translations.has(id)))
  for (const id of chapters) {
    const chapter = snapshot.chapters.get(id)
    if (!chapter) continue
    const { lang, source } = await chapterLanguages(snapshot, chapter)
    if (!lang) continue
    const doc = await localizedDocument(id, lang, source)
    if (!doc) continue
    for (const u of units) if (u.chapterId === id && doc.units.has(u.id)) out.set(u.id, doc.units.get(u.id)!)
  }
  return out
}

// ?lang=en — an explicit page language (the hreflang alternates point here until /<lang>/ routes exist)
export function langParam(params: Record<string, string | string[] | undefined>): string | null {
  const raw = params.lang
  const value = Array.isArray(raw) ? raw[0] : raw
  return value && /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$/.test(value) ? value : null
}

// <link rel="alternate" hreflang> data: only the languages the page exists in; nothing for a single-language page.
export function hreflangAlternates(href: string, langs: Pick<ChapterLanguages, 'source' | 'available'>): Record<string, string> | null {
  if (langs.available.length < 2) return null
  const out: Record<string, string> = {}
  for (const lang of langs.available) out[lang] = lang === langs.source ? href : `${href}?lang=${encodeURIComponent(lang)}`
  out['x-default'] = href
  return out
}

import type { CourseBundle, CourseMeta } from './schema'

// Course languages and localized course texts (docs/COURSE_FORMAT.md «Переклад курсів (i18n)»). Pure.

export interface CourseLanguages {
  // the language the topics are written in
  source: string
  // every language the course is offered in, source first
  languages: string[]
}

export function courseLanguages(meta: Pick<CourseMeta, 'language' | 'sourceLanguage' | 'languages'>): CourseLanguages {
  const source = meta.sourceLanguage ?? meta.language
  const listed = meta.languages ?? [source]
  return { source, languages: [source, ...listed.filter((l) => l !== source)] }
}

// The language a page of this course is shown in for a UI locale: the locale when the course lists it (and, for a
// topic, a translation exists — `available`), otherwise null = the source language.
export function contentLanguage(meta: Pick<CourseMeta, 'language' | 'sourceLanguage' | 'languages'>, locale: string, available?: ReadonlySet<string> | readonly string[]): string | null {
  const { source, languages } = courseLanguages(meta)
  if (locale === source || !languages.includes(locale)) return null
  if (available && !(Array.isArray(available) ? available.includes(locale) : (available as ReadonlySet<string>).has(locale))) return null
  return locale
}

export interface LocalizedCourseTexts {
  lang: string | null
  title: string
  subtitle: string | null
  description: string | null
  section: (key: string, fallback: { title: string; description: string | null }) => { title: string; description: string | null }
  skill: (id: string, fallback: { title: string; description?: string | null }) => { title: string; description: string | null }
}

// Course texts in `lang` (null / the source → the bundle's own strings); a missing translation falls back per field.
export function localizedCourse(bundle: Pick<CourseBundle, 'course' | 'i18n'>, lang: string | null): LocalizedCourseTexts {
  const i18n = lang ? bundle.i18n : undefined
  const pick = (map: Record<string, string> | undefined, fallback: string | null) => (lang && map?.[lang]) || fallback
  return {
    lang,
    title: pick(i18n?.course.title, bundle.course.title)!,
    subtitle: pick(i18n?.course.subtitle, bundle.course.subtitle),
    description: pick(i18n?.course.description, bundle.course.description),
    section: (key, fallback) => ({ title: pick(i18n?.sections[key]?.title, fallback.title)!, description: pick(i18n?.sections[key]?.description, fallback.description) }),
    skill: (id, fallback) => ({ title: pick(i18n?.skills[id]?.title, fallback.title)!, description: pick(i18n?.skills[id]?.description, fallback.description ?? null) }),
  }
}

// SEO: the course page's languages that actually exist (the source always; others when the bundle has their title).
export function courseHreflangs(bundle: Pick<CourseBundle, 'course' | 'i18n'>): string[] {
  const { source, languages } = courseLanguages(bundle.course)
  return languages.filter((l) => l === source || Boolean(bundle.i18n?.course.title?.[l]))
}

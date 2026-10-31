import { z } from 'zod'

// Localized course texts (docs/COURSE_FORMAT.md «Переклад курсів (i18n)», docs/NEXTJS_SYLLABUS.md §8).
// course.yaml: a text is a string (the source language) or a map `{ uk: …, en: … }`.
// Bundle: the string fields keep the source text (every existing reader works unchanged); the other languages go to
// one optional side map `bundle.i18n` — absent when a course has no translations, so such bundles stay byte-identical.

export const BCP47 = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/
export const LangSchema = z.string().regex(BCP47, 'мова: BCP 47, напр. en')

export function LocalizedTextSchema(min: number, max: number) {
  return z.union([z.string().min(min).max(max), z.record(LangSchema, z.string().min(min).max(max))])
}
export type LocalizedText = string | Record<string, string>

// language → text, other languages than the source only
export const LocalizedMapSchema = z.record(z.string(), z.string())
export type LocalizedMap = z.infer<typeof LocalizedMapSchema>

const TextsSchema = z.object({ title: LocalizedMapSchema.optional(), description: LocalizedMapSchema.optional() })

export const CourseI18nSchema = z.object({
  course: z.object({
    title: LocalizedMapSchema.optional(),
    subtitle: LocalizedMapSchema.optional(),
    description: LocalizedMapSchema.optional(),
    // SEO: the course's URL slug per language (data for hreflang and later /<lang>/ routes)
    slug: LocalizedMapSchema.optional(),
  }),
  // by section key (course.yaml sections[].id)
  sections: z.record(z.string(), TextsSchema),
  // by skill id
  skills: z.record(z.string(), TextsSchema),
})
export type CourseI18n = z.infer<typeof CourseI18nSchema>

// The source-language text of a localized field (validation guarantees the source key exists).
export function sourceText(value: LocalizedText, source: string): string {
  return typeof value === 'string' ? value : (value[source] ?? Object.values(value)[0] ?? '')
}

// The other languages of a localized field; undefined when it has none.
export function otherTexts(value: LocalizedText | undefined, source: string): LocalizedMap | undefined {
  if (value === undefined || typeof value === 'string') return undefined
  const out = Object.fromEntries(Object.entries(value).filter(([lang]) => lang !== source))
  return Object.keys(out).length > 0 ? out : undefined
}

export function localizedKeys(value: LocalizedText | undefined): string[] {
  return value === undefined || typeof value === 'string' ? [] : Object.keys(value)
}

import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { LADDERS, LevelSchema, courseLadder, ladderOf } from './level'
import { CourseExamSchema } from './exam'
import { CourseKindSchema, PracticeSectionIdSchema } from './practice'
import { LangSchema, LocalizedTextSchema, localizedKeys, otherTexts, sourceText, type CourseI18n, type LocalizedText } from './i18n'
import { DEFAULT_SKILLS, SkillIdSchema, type SkillDef } from './skills'

// course.yaml — see docs/COURSE_FORMAT.md §2

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SEMVER = /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/
const HEX = /^#[0-9a-fA-F]{6}$/
const BCP47 = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/

// course.yaml `skills[]`: like SkillDefSchema (schema/skills.ts), with localized title / description
const ManifestSkillSchema = z.object({
  id: SkillIdSchema,
  title: LocalizedTextSchema(1, 60),
  description: LocalizedTextSchema(0, 300).optional(),
  icon: z.string().min(1).optional(),
})

// "1-7" · "1-3, 5" · 5 · [1, 2, 3]
const RANGE = /^\s*\d+\s*(?:[-–]\s*\d+\s*)?(?:,\s*\d+\s*(?:[-–]\s*\d+\s*)?)*$/
export const ChapterRangeSchema = z.union([
  z.number().int().positive(),
  z.string().regex(RANGE, 'діапазон розділів: "1-7", "1-3, 5" або число'),
  z.array(z.number().int().positive()).min(1),
])
export type ChapterRange = z.infer<typeof ChapterRangeSchema>

export const SectionKindSchema = z.enum(['path', 'practice'])
export type SectionKind = z.infer<typeof SectionKindSchema>

export const SectionManifestSchema = z.object({
  id: z.string().regex(SLUG, 'id розділу: [a-z0-9-]'),
  // a string (the source language) or `{ uk: …, en: … }` (docs/COURSE_FORMAT.md «Переклад курсів (i18n)»)
  title: LocalizedTextSchema(1, 80),
  icon: z.string().min(1).optional(),
  description: LocalizedTextSchema(0, 400).optional(),
  // Guide folder: inside the package, or (official courses) in the vault's shared Guides/
  from: z.string().min(1),
  chapters: ChapterRangeSchema.optional(),
  kind: SectionKindSchema.default('path'),
  // Forces one level on every topic and exercise of the section (e.g. a beginners' guide → noob, a CEFR level → B1)
  level: LevelSchema.optional(),
  // planned: shown on the path as «скоро» (locked, no topics) — its guide / chapters may not exist yet
  status: z.enum(['active', 'planned']).default('active'),
  // courses with `skills`: the default skill of the section's topics (a topic's own frontmatter `skill:` wins)
  skill: SkillIdSchema.optional(),
})
// after normalisation (CourseManifest): texts in the source language
export type SectionManifest = Omit<z.infer<typeof SectionManifestSchema>, 'title' | 'description'> & { title: string; description?: string }

const pass = z.number().gt(0).max(1)

export const ExamsSchema = z
  .object({
    topic: z.object({ questions: z.number().int().min(1).max(50).default(10), pass: pass.default(0.8) }).prefault({}),
    section: z
      .object({ questions: z.number().int().min(1).max(100).default(25), pass: pass.default(0.8), testOut: z.boolean().default(true) })
      .prefault({}),
  })
  .prefault({})
export type ExamsConfig = z.infer<typeof ExamsSchema>

export const PlacementSchema = z
  .object({
    enabled: z.boolean().default(true),
    maxQuestions: z.number().int().min(4).max(60).default(20),
    perLevel: z.number().int().min(2).max(5).default(3),
    // bank mode only (docs/LANGUAGE_COURSE.md «Вступний тест»): share of right answers that passes a level (0.75)
    // and the optional follow-up after a low-confidence result (questions around the boundary, 6)
    pass: z.number().min(0.5).max(1).optional(),
    followUp: z.number().int().min(0).max(10).optional(),
    // courses with skills and a bank: after the overall level, 2–3 questions per skill (docs/COURSE_FORMAT.md §5); off by default
    perSkill: z.boolean().optional(),
    // the skills the bank measures (default: language — grammar, vocabulary, reading, listening; otherwise all)
    skills: z.array(SkillIdSchema).min(1).optional(),
  })
  .prefault({})
export type PlacementConfig = z.infer<typeof PlacementSchema>

// What a course teaches — the catalog and onboarding group courses by it (languages, code, psychology, …), in this order.
export const SUBJECTS = ['language', 'programming', 'science', 'psychology', 'business', 'security', 'other'] as const
export type Subject = (typeof SUBJECTS)[number]

export const AuthorSchema = z.object({ name: z.string().min(1), url: z.url().optional() })

export const CourseManifestSchema = z
  .object({
    id: z.string().regex(SLUG, 'id курсу: [a-z0-9-]').max(64),
    version: z.string().regex(SEMVER, 'version: semver, напр. 1.0.0'),
    // a string (the source language) or `{ uk: …, en: … }` — see `languages`
    title: LocalizedTextSchema(1, 80),
    subtitle: LocalizedTextSchema(0, 160).optional(),
    description: LocalizedTextSchema(0, 2000).optional(),
    // SEO: the course's slug per language, `{ en: nextjs-zero-to-pro }` (hreflang data; /<lang>/ routes come later)
    slug: z.union([z.string().regex(SLUG), z.record(LangSchema, z.string().regex(SLUG, 'slug: [a-z0-9-]'))]).optional(),
    subject: z.enum(SUBJECTS).default('other'),
    // programming | language | general; default from subject (src/course/schema/practice.ts → kindForSubject)
    kind: CourseKindSchema.optional(),
    // practice sections in sidebar order; default per kind (DEFAULT_PRACTICE); `path` is always first
    practice: z.array(PracticeSectionIdSchema).min(1).optional(),
    // guide folders (or guide ids) of the sidebar «Теорія»; default = the guides the sections use
    theory: z.array(z.string().min(1)).min(1).optional(),
    // language of instruction: explanations, UI (BCP 47)
    language: z.string().regex(BCP47, 'language: BCP 47, напр. uk').default('uk'),
    // content translations (docs/NEXTJS_SYLLABUS.md §8): the language the topics are written in (default `language`)
    // and every language the course is offered in (default `[sourceLanguage]`); a page shows the learner's UI
    // language when it is listed here and translated, otherwise the source
    sourceLanguage: LangSchema.optional(),
    languages: z.array(LangSchema).min(1).optional(),
    // language courses: the language being learned (BCP 47) — speech synthesis / recognition use it (docs/SPEECH.md)
    target: z.string().regex(BCP47, 'target: BCP 47, напр. en').optional(),
    // language courses: the external exam the CEFR levels map onto (IELTS, Goethe-Zertifikat…) — schema/exam.ts
    exam: CourseExamSchema.optional(),
    icon: z.string().min(1).optional(),
    color: z.string().regex(HEX, "color: '#RRGGBB'").optional(),
    cover: z.string().optional(),
    // difficulty ladder: noob…god (programming / general) or A1…C2 (language); default — the whole ladder of the kind
    levels: z.array(LevelSchema).min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
    estimatedHours: z.number().positive().optional(),
    authors: z.array(AuthorSchema).default([]),
    license: z.string().optional(),
    // learner skills (docs/COURSE_FORMAT.md §2): topics carry `skill:`, exercises inherit it; default — by kind
    skills: z.array(ManifestSkillSchema).min(1).optional(),
    sections: z.array(SectionManifestSchema).min(1),
    exams: ExamsSchema,
    placement: PlacementSchema,
  })
  .superRefine((m, ctx) => {
    // translations: maps carry the source language and only listed languages
    const source = m.sourceLanguage ?? m.language
    const languages = m.languages ?? [source]
    if (!languages.includes(source)) ctx.addIssue({ code: 'custom', path: ['languages'], message: `languages має містити мову джерела «${source}»` })
    if (new Set(languages).size !== languages.length) ctx.addIssue({ code: 'custom', path: ['languages'], message: 'Дублікат мови в languages' })
    const texts: Array<[Array<string | number>, LocalizedText | undefined]> = [
      [['title'], m.title],
      [['subtitle'], m.subtitle],
      [['description'], m.description],
      ...m.sections.flatMap((s, i): Array<[Array<string | number>, LocalizedText | undefined]> => [
        [['sections', i, 'title'], s.title],
        [['sections', i, 'description'], s.description],
      ]),
      ...(m.skills ?? []).flatMap((s, i): Array<[Array<string | number>, LocalizedText | undefined]> => [
        [['skills', i, 'title'], s.title],
        [['skills', i, 'description'], s.description],
      ]),
    ]
    for (const [path, value] of texts) {
      const keys = localizedKeys(value)
      if (keys.length === 0) continue
      if (!keys.includes(source)) ctx.addIssue({ code: 'custom', path, message: `немає тексту мовою джерела «${source}»` })
      for (const k of keys) if (!languages.includes(k)) ctx.addIssue({ code: 'custom', path, message: `мова «${k}» не в languages (${languages.join(', ')})` })
    }
    if (m.slug && typeof m.slug !== 'string') for (const k of Object.keys(m.slug)) if (!languages.includes(k)) ctx.addIssue({ code: 'custom', path: ['slug'], message: `мова «${k}» не в languages` })
    const seen = new Set<string>()
    m.sections.forEach((s, i) => {
      if (seen.has(s.id)) ctx.addIssue({ code: 'custom', path: ['sections', i, 'id'], message: `Дублікат id розділу «${s.id}»` })
      seen.add(s.id)
    })
    const practice = new Set<string>()
    m.practice?.forEach((id, i) => {
      if (practice.has(id)) ctx.addIssue({ code: 'custom', path: ['practice', i], message: `Дублікат розділу практики «${id}»` })
      practice.add(id)
    })
    const language = m.kind === 'language' || (!m.kind && m.subject === 'language')
    if (language && m.skills) ctx.addIssue({ code: 'custom', path: ['skills'], message: 'Мовний курс не задає skills: у нього типові навички (граматика, лексика, читання, аудіювання, вимова)' })
    const skillIds = new Set<string>()
    m.skills?.forEach((s, i) => {
      if (skillIds.has(s.id)) ctx.addIssue({ code: 'custom', path: ['skills', i, 'id'], message: `Дублікат id навички «${s.id}»` })
      skillIds.add(s.id)
    })
    const known = m.skills && !language ? skillIds : new Set<string>(language ? DEFAULT_SKILLS.language.learner.map((s) => s.id) : [])
    m.sections.forEach((s, i) => {
      if (s.skill && !known.has(s.skill)) ctx.addIssue({ code: 'custom', path: ['sections', i, 'skill'], message: `Невідома навичка «${s.skill}» (немає в skills)` })
    })
    m.placement.skills?.forEach((id, i) => {
      if (!known.has(id)) ctx.addIssue({ code: 'custom', path: ['placement', 'skills', i], message: `Невідома навичка «${id}» (немає в skills)` })
    })
    // One ladder per course: CEFR for language courses, noob…god otherwise.
    const kind = m.kind ?? (m.subject === 'language' ? 'language' : null)
    const ladder = courseLadder({ kind, subject: m.subject, levels: null })
    const ladderName = ladder === 'cefr' ? 'A1…C2 (мовний курс)' : 'noob…god'
    m.levels?.forEach((l, i) => {
      if (ladderOf(l) !== ladder) ctx.addIssue({ code: 'custom', path: ['levels', i], message: `Рівень «${l}» не з шкали курсу ${ladderName}` })
    })
    m.sections.forEach((s, i) => {
      if (s.level && ladderOf(s.level) !== ladder) ctx.addIssue({ code: 'custom', path: ['sections', i, 'level'], message: `Рівень розділу «${s.level}» не з шкали курсу ${ladderName}` })
    })
    if (m.exam && ladder !== 'cefr') ctx.addIssue({ code: 'custom', path: ['exam'], message: 'exam: лише для мовних курсів (шкала A1…C2)' })
  })
  .transform((m) => {
    const kind = m.kind ?? (m.subject === 'language' ? 'language' : null)
    const source = m.sourceLanguage ?? m.language
    const text = (v: LocalizedText) => sourceText(v, source)
    const optText = (v: LocalizedText | undefined) => (v === undefined ? undefined : text(v))
    // the side map of the other languages (bundle.i18n); null without any
    const i18n: CourseI18n = { course: {}, sections: {}, skills: {} }
    const put = <T extends Record<string, unknown>>(target: T, key: keyof T, v: LocalizedText | undefined) => {
      const other = otherTexts(v, source)
      if (other) (target as Record<string, unknown>)[key as string] = other
    }
    put(i18n.course, 'title', m.title)
    put(i18n.course, 'subtitle', m.subtitle)
    put(i18n.course, 'description', m.description)
    if (m.slug && typeof m.slug !== 'string') i18n.course.slug = { ...m.slug }
    for (const s of m.sections) {
      const entry: { title?: Record<string, string>; description?: Record<string, string> } = {}
      put(entry, 'title', s.title)
      put(entry, 'description', s.description)
      if (Object.keys(entry).length > 0) i18n.sections[s.id] = entry
    }
    for (const s of m.skills ?? []) {
      const entry: { title?: Record<string, string>; description?: Record<string, string> } = {}
      put(entry, 'title', s.title)
      put(entry, 'description', s.description)
      if (Object.keys(entry).length > 0) i18n.skills[s.id] = entry
    }
    const hasI18n = Object.keys(i18n.course).length + Object.keys(i18n.sections).length + Object.keys(i18n.skills).length > 0
    const sections: SectionManifest[] = m.sections.map((s) => {
      const { title, description, ...rest } = s
      return { ...rest, title: text(title), ...(description !== undefined ? { description: text(description) } : {}) }
    })
    const skills: SkillDef[] | undefined = m.skills?.map((s) => {
      const { title, description, ...rest } = s
      return { id: rest.id, title: text(title), ...(description !== undefined ? { description: text(description) } : {}), ...(rest.icon ? { icon: rest.icon } : {}) }
    })
    const { slug: _slug, ...base } = m
    return {
      ...base,
      title: text(m.title),
      subtitle: optText(m.subtitle),
      description: optText(m.description),
      sections,
      skills,
      sourceLanguage: source,
      languages: m.languages ?? [source],
      i18n: hasI18n ? i18n : null,
      levels: m.levels ?? [...LADDERS[courseLadder({ kind, subject: m.subject, levels: null })]],
    }
  })
export type CourseManifest = z.infer<typeof CourseManifestSchema>
export type CourseManifestInput = z.input<typeof CourseManifestSchema>

export interface ManifestParse {
  manifest: CourseManifest | null
  errors: string[]
}

export function formatZodIssues(error: z.ZodError): string[] {
  return error.issues.map((i) => `${i.path.length ? `${i.path.join('.')}: ` : ''}${i.message}`)
}

export function parseCourseManifest(input: unknown): ManifestParse {
  const result = CourseManifestSchema.safeParse(input)
  return result.success ? { manifest: result.data, errors: [] } : { manifest: null, errors: formatZodIssues(result.error) }
}

export function parseCourseYaml(source: string): ManifestParse {
  let data: unknown
  try {
    data = parseYaml(source)
  } catch (error) {
    return { manifest: null, errors: [`course.yaml: ${error instanceof Error ? error.message : String(error)}`] }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { manifest: null, errors: ['course.yaml: очікується обʼєкт'] }
  return parseCourseManifest(data)
}

// "1-3, 5" → [1, 2, 3, 5]
export function expandRange(range: ChapterRange): number[] {
  if (typeof range === 'number') return [range]
  if (Array.isArray(range)) return [...new Set(range)].sort((a, b) => a - b)
  const out = new Set<number>()
  for (const part of range.split(',')) {
    const [a, b] = part.split(/[-–]/).map((v) => Number(v.trim()))
    if (a === undefined || !Number.isFinite(a)) continue
    const to = b !== undefined && Number.isFinite(b) ? b : a
    for (let n = Math.min(a, to); n <= Math.max(a, to); n++) out.add(n)
  }
  return [...out].sort((x, y) => x - y)
}

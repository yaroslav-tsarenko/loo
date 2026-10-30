import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { LADDERS, LevelSchema, courseLadder, ladderOf } from './level'
import { CourseKindSchema, PracticeSectionIdSchema } from './practice'
import { DEFAULT_SKILLS, SKILL_ID, SkillDefSchema } from './skills'

// course.yaml — see docs/COURSE_FORMAT.md §2

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SEMVER = /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/
const HEX = /^#[0-9a-fA-F]{6}$/
const BCP47 = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/

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
  title: z.string().min(1).max(80),
  icon: z.string().min(1).optional(),
  description: z.string().max(400).optional(),
  // Guide folder: inside the package, or (official courses) in the vault's shared Guides/
  from: z.string().min(1),
  chapters: ChapterRangeSchema.optional(),
  kind: SectionKindSchema.default('path'),
  // Forces one level on every topic and exercise of the section (e.g. a beginners' guide → noob, a CEFR level → B1)
  level: LevelSchema.optional(),
  // planned: shown on the path as «скоро» (locked, no topics) — its guide / chapters may not exist yet
  status: z.enum(['active', 'planned']).default('active'),
  // courses with `skills`: the default skill of the section's topics (a topic's own frontmatter `skill:` wins)
  skill: z.string().regex(SKILL_ID, 'skill: id навички [a-z0-9-]').optional(),
})
export type SectionManifest = z.infer<typeof SectionManifestSchema>

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
    skills: z.array(z.string().regex(SKILL_ID, 'id навички: [a-z0-9-]')).min(1).optional(),
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
    title: z.string().min(1).max(80),
    subtitle: z.string().max(160).optional(),
    description: z.string().max(2000).optional(),
    subject: z.enum(SUBJECTS).default('other'),
    // programming | language | general; default from subject (src/course/schema/practice.ts → kindForSubject)
    kind: CourseKindSchema.optional(),
    // practice sections in sidebar order; default per kind (DEFAULT_PRACTICE); `path` is always first
    practice: z.array(PracticeSectionIdSchema).min(1).optional(),
    // guide folders (or guide ids) of the sidebar «Теорія»; default = the guides the sections use
    theory: z.array(z.string().min(1)).min(1).optional(),
    // language of instruction: explanations, UI (BCP 47)
    language: z.string().regex(BCP47, 'language: BCP 47, напр. uk').default('uk'),
    // language courses: the language being learned (BCP 47) — speech synthesis / recognition use it (docs/SPEECH.md)
    target: z.string().regex(BCP47, 'target: BCP 47, напр. en').optional(),
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
    skills: z.array(SkillDefSchema).min(1).optional(),
    sections: z.array(SectionManifestSchema).min(1),
    exams: ExamsSchema,
    placement: PlacementSchema,
  })
  .superRefine((m, ctx) => {
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
    const skillIds = new Set<string>()
    m.skills?.forEach((s, i) => {
      if (skillIds.has(s.id)) ctx.addIssue({ code: 'custom', path: ['skills', i, 'id'], message: `Дублікат id навички «${s.id}»` })
      skillIds.add(s.id)
    })
    const known = m.skills ? skillIds : new Set<string>(m.kind === 'language' || (!m.kind && m.subject === 'language') ? DEFAULT_SKILLS.language.learner.map((s) => s.id) : [])
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
  })
  .transform((m) => {
    const kind = m.kind ?? (m.subject === 'language' ? 'language' : null)
    return { ...m, levels: m.levels ?? [...LADDERS[courseLadder({ kind, subject: m.subject, levels: null })]] }
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

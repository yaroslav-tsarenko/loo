import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { LEVELS, LevelSchema } from './level'

// course.yaml — see docs/COURSE_FORMAT.md §2

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SEMVER = /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/
const HEX = /^#[0-9a-fA-F]{6}$/

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
  // Forces one level on every topic and exercise of the section (e.g. a beginners' guide → noob)
  level: LevelSchema.optional(),
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
  })
  .prefault({})
export type PlacementConfig = z.infer<typeof PlacementSchema>

export const AuthorSchema = z.object({ name: z.string().min(1), url: z.url().optional() })

export const CourseManifestSchema = z
  .object({
    id: z.string().regex(SLUG, 'id курсу: [a-z0-9-]').max(64),
    version: z.string().regex(SEMVER, 'version: semver, напр. 1.0.0'),
    title: z.string().min(1).max(80),
    subtitle: z.string().max(160).optional(),
    description: z.string().max(2000).optional(),
    subject: z.enum(['programming', 'language', 'security', 'science', 'other']).default('other'),
    language: z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/, 'language: BCP 47, напр. uk').default('uk'),
    icon: z.string().min(1).optional(),
    color: z.string().regex(HEX, "color: '#RRGGBB'").optional(),
    cover: z.string().optional(),
    levels: z.array(LevelSchema).min(1).default([...LEVELS]),
    tags: z.array(z.string().min(1)).default([]),
    estimatedHours: z.number().positive().optional(),
    authors: z.array(AuthorSchema).default([]),
    license: z.string().optional(),
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

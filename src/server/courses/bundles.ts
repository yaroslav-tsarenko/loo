import { CourseBundleSchema, type CourseBundle, type CourseMeta, type CourseStats, type Level } from '@/course'

// Parsing and listing of compiled course bundles (content/courses/<id>.json). Framework-free for unit tests;
// src/server/courses/registry.ts does the file I/O and caching.

export type CourseSource = 'official' | 'user'

export interface CourseEntry {
  bundle: CourseBundle
  source: CourseSource
  // public in the marketplace (official courses always; user courses after moderation, later)
  listed: boolean
}

// Marketplace card / course page header. likes / comments / price are hooks for later — null until they exist.
export interface CourseListing {
  id: string
  source: CourseSource
  meta: CourseMeta
  stats: CourseStats
  levels: { from: Level; to: Level }
  sections: Array<{ id: string; key: string; title: string; icon: string | null; description: string | null; kind: 'path' | 'practice'; topics: number; level: Level; minutes: number }>
  social: { likes: number | null; comments: number | null }
  price: { amount: number; currency: string } | null
}

export interface BundleFile {
  name: string
  text: string
}

export interface ParsedBundles {
  courses: Map<string, CourseEntry>
  errors: string[]
}

const FILE = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.json$/

// Every file must be `<course id>.json` and validate against the bundle schema; a broken file is skipped, never fatal.
export function parseBundles(files: readonly BundleFile[], source: CourseSource = 'official'): ParsedBundles {
  const courses = new Map<string, CourseEntry>()
  const errors: string[] = []
  for (const file of [...files].sort((a, b) => a.name.localeCompare(b.name))) {
    const m = FILE.exec(file.name)
    if (!m) continue
    let data: unknown
    try {
      data = JSON.parse(file.text)
    } catch (error) {
      errors.push(`${file.name}: ${error instanceof Error ? error.message : String(error)}`)
      continue
    }
    const parsed = CourseBundleSchema.safeParse(data)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      errors.push(`${file.name}: ${issue?.path.join('.') ?? ''} ${issue?.message ?? 'invalid bundle'}`)
      continue
    }
    if (parsed.data.course.id !== m[1]) {
      errors.push(`${file.name}: course id «${parsed.data.course.id}» не збігається з назвою файлу`)
      continue
    }
    if (courses.has(parsed.data.course.id)) continue
    courses.set(parsed.data.course.id, { bundle: parsed.data, source, listed: source === 'official' })
  }
  return { courses, errors }
}

export function courseListing(entry: CourseEntry): CourseListing {
  const { bundle } = entry
  const levels = bundle.course.levels
  const ranks = bundle.sections.filter((s) => s.kind === 'path')
  return {
    id: bundle.course.id,
    source: entry.source,
    meta: bundle.course,
    stats: bundle.stats,
    levels: { from: ranks[0]?.minLevel ?? levels[0] ?? 'noob', to: levels.at(-1) ?? 'god' },
    sections: bundle.sections.map((s) => ({ id: s.id, key: s.key, title: s.title, icon: s.icon, description: s.description, kind: s.kind, topics: s.topics.length, level: s.level, minutes: s.minutes })),
    social: { likes: null, comments: null },
    price: null,
  }
}

// What the app needs about a course without its bundle (content/courses/index.json, written by pnpm course:build):
// the marketplace card and the guides it teaches. Bundles themselves load on first use (registry.ts).
export interface CourseIndexEntry {
  id: string
  source: CourseSource
  listed: boolean
  listing: CourseListing
  // the guides the course teaches: its sections' and its `theory`
  guides: string[]
}

export interface CourseIndex {
  version: 1
  courses: CourseIndexEntry[]
}

export function indexEntry(entry: CourseEntry): CourseIndexEntry {
  const { bundle } = entry
  return {
    id: bundle.course.id,
    source: entry.source,
    listed: entry.listed,
    listing: courseListing(entry),
    guides: [...new Set([...bundle.sections.map((s) => s.guideId), ...(bundle.theory ?? [])])],
  }
}

export function courseIndex(courses: Iterable<CourseEntry>): CourseIndex {
  return { version: 1, courses: [...courses].map(indexEntry).sort((a, b) => a.id.localeCompare(b.id)) }
}

// `<course>:…` → course id (lesson, topic, test and exam ids all start with it).
export function courseIdOf(id: string): string | null {
  const head = id.split(':')[0] ?? ''
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(head) && id.includes(':') ? head : null
}

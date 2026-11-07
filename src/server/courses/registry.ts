import 'server-only'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { CourseBundle } from '@/course'
import type { LearningUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { courseIdOf, courseIndex, parseBundles, type CourseEntry, type CourseIndex, type CourseIndexEntry, type CourseListing } from './bundles'

export { courseIdOf, type CourseEntry, type CourseIndexEntry, type CourseListing, type CourseSource } from './bundles'

// Official course bundles, compiled at build time (pnpm course:build → content/courses/<id>.json, traced into every
// server function via next.config.ts), with a small catalog (content/courses/index.json): the marketplace cards and
// the guides each course teaches. The catalog is read once per process; a bundle (0.5–4 MB of JSON) is parsed and
// schema-validated on first use and kept in an LRU — an instance only pays for the courses its learners take, and the
// set can grow (user courses) without every process holding all of them. Without an index (a dev checkout before
// course:build) every bundle is parsed once to build it.

export const COURSE_INDEX = 'index.json'
const CACHE_MAX = Math.max(1, Number(process.env.COURSE_CACHE_MAX) || 8)

interface RegistryState {
  catalog: Promise<Map<string, CourseIndexEntry>>
  bundles: Map<string, Promise<CourseEntry | null>>
}

const key = Symbol.for('levelup.course-registry')
const sigKey = Symbol.for('levelup.course-registry-sig')
type GlobalWithRegistry = typeof globalThis & { [key]?: RegistryState; [sigKey]?: string }

// Dev only: `pnpm course:build` rewrites the bundles while the server runs — reload when their mtimes change.
function bundlesSignature(): string {
  const dir = coursesDir()
  if (!existsSync(dir)) return ''
  return readdirSync(dir)
    .filter((n) => n.endsWith('.json'))
    .map((n) => `${n}:${statSync(path.join(dir, n)).mtimeMs}`)
    .join('|')
}

export function coursesDir(): string {
  return path.resolve(process.cwd(), 'content', 'courses')
}

async function bundleFiles(): Promise<string[]> {
  const dir = coursesDir()
  if (!existsSync(dir)) return []
  return (await readdir(dir, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith('.json') && e.name !== COURSE_INDEX).map((e) => e.name)
}

async function parseFiles(names: readonly string[]): Promise<Map<string, CourseEntry>> {
  const files = await Promise.all(names.map(async (name) => ({ name, text: await readFile(path.join(coursesDir(), name), 'utf8') })))
  const { courses, errors } = parseBundles(files, 'official')
  for (const e of errors) console.error(`[courses] ${e}`)
  return courses
}

async function loadCatalog(state: RegistryState): Promise<Map<string, CourseIndexEntry>> {
  const dir = coursesDir()
  if (!existsSync(dir)) {
    console.warn(`[courses] ${dir} не знайдено — курсів немає (pnpm course:build)`)
    return new Map()
  }
  const indexFile = path.join(dir, COURSE_INDEX)
  if (existsSync(indexFile)) {
    const index = JSON.parse(await readFile(indexFile, 'utf8')) as CourseIndex
    if (index.version === 1) return new Map(index.courses.map((c) => [c.id, c]))
  }
  // no index: parse everything once (and keep what fits)
  const courses = await parseFiles(await bundleFiles())
  for (const [id, entry] of [...courses].slice(0, CACHE_MAX)) state.bundles.set(id, Promise.resolve(entry))
  return new Map(courseIndex(courses.values()).courses.map((c) => [c.id, c]))
}

function state(): RegistryState {
  const g = globalThis as GlobalWithRegistry
  if (process.env.NODE_ENV !== 'production') {
    const sig = bundlesSignature()
    if (sig !== g[sigKey]) {
      g[sigKey] = sig
      g[key] = undefined
    }
  }
  if (!g[key]) {
    const fresh: RegistryState = { catalog: Promise.resolve(new Map()), bundles: new Map() }
    fresh.catalog = loadCatalog(fresh).catch((error: unknown) => {
      g[key] = undefined
      throw error
    })
    g[key] = fresh
  }
  return g[key]
}

// The catalog: every course's card and guides, no bundles (a new Map after a dev reload — callers may key caches on
// its identity).
export function courseCatalog(): Promise<Map<string, CourseIndexEntry>> {
  return state().catalog
}

export async function listCourses(): Promise<CourseListing[]> {
  return [...(await courseCatalog()).values()].filter((e) => e.listed).map((e) => e.listing)
}

export async function getCourseEntry(id: string): Promise<CourseEntry | null> {
  const s = state()
  const cached = s.bundles.get(id)
  if (cached) {
    // most recently used last
    s.bundles.delete(id)
    s.bundles.set(id, cached)
    return cached
  }
  const meta = (await s.catalog).get(id)
  if (!meta) return null
  const loading = parseFiles([`${id}.json`]).then(
    (courses) => {
      const bundle = courses.get(id)
      return bundle ? { ...bundle, source: meta.source, listed: meta.listed } : null
    },
    (error: unknown) => {
      s.bundles.delete(id)
      throw error
    },
  )
  s.bundles.set(id, loading)
  while (s.bundles.size > CACHE_MAX) s.bundles.delete(s.bundles.keys().next().value!)
  return loading
}

export async function getCourse(id: string): Promise<CourseBundle | null> {
  return (await getCourseEntry(id))?.bundle ?? null
}

// The course a lesson / topic / test / exam id belongs to.
export async function courseFor(id: string): Promise<CourseBundle | null> {
  const courseId = courseIdOf(id)
  return courseId ? getCourse(courseId) : null
}

export async function defaultCourse(): Promise<CourseBundle | null> {
  const first = [...(await courseCatalog()).values()].find((e) => e.listed)
  return first ? getCourse(first.id) : null
}

// Exercise bodies live in the content store, keyed by the same id as the bundle's exercise refs.
export function exerciseUnit(snapshot: ContentSnapshot, bundle: CourseBundle, exerciseId: string): LearningUnit | null {
  if (!bundle.exercises[exerciseId]) return null
  return snapshot.units.get(exerciseId) ?? null
}

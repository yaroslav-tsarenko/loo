import 'server-only'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { CourseBundle } from '@/course'
import type { LearningUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { courseIdOf, courseListing, parseBundles, type CourseEntry, type CourseListing } from './bundles'

export { courseIdOf, type CourseEntry, type CourseListing, type CourseSource } from './bundles'

// Official course bundles, compiled at build time (pnpm course:build → content/courses/<id>.json, traced into every
// server function via next.config.ts). Loaded and schema-validated once per process.

const key = Symbol.for('levelup.course-registry')
const sigKey = Symbol.for('levelup.course-registry-sig')
type GlobalWithRegistry = typeof globalThis & { [key]?: Promise<Map<string, CourseEntry>>; [sigKey]?: string }

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

async function load(): Promise<Map<string, CourseEntry>> {
  const dir = coursesDir()
  if (!existsSync(dir)) {
    console.warn(`[courses] ${dir} не знайдено — курсів немає (pnpm course:build)`)
    return new Map()
  }
  const names = (await readdir(dir, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith('.json')).map((e) => e.name)
  const files = await Promise.all(names.map(async (name) => ({ name, text: await readFile(path.join(dir, name), 'utf8') })))
  const { courses, errors } = parseBundles(files, 'official')
  for (const e of errors) console.error(`[courses] ${e}`)
  return courses
}

function registry(): Promise<Map<string, CourseEntry>> {
  const g = globalThis as GlobalWithRegistry
  if (process.env.NODE_ENV !== 'production') {
    const sig = bundlesSignature()
    if (sig !== g[sigKey]) {
      g[sigKey] = sig
      g[key] = undefined
    }
  }
  if (!g[key]) {
    g[key] = load().catch((error: unknown) => {
      g[key] = undefined
      throw error
    })
  }
  return g[key]
}

// The loaded bundles (a new Map after a dev reload — callers may key caches on its identity).
export function courseRegistry(): Promise<Map<string, CourseEntry>> {
  return registry()
}

export async function listCourses(): Promise<CourseListing[]> {
  return [...(await registry()).values()].filter((e) => e.listed).map(courseListing)
}

export async function getCourseEntry(id: string): Promise<CourseEntry | null> {
  return (await registry()).get(id) ?? null
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
  const first = [...(await registry()).values()].find((e) => e.listed)
  return first?.bundle ?? null
}

// Exercise bodies live in the content store, keyed by the same id as the bundle's exercise refs.
export function exerciseUnit(snapshot: ContentSnapshot, bundle: CourseBundle, exerciseId: string): LearningUnit | null {
  if (!bundle.exercises[exerciseId]) return null
  return snapshot.units.get(exerciseId) ?? null
}

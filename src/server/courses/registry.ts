import 'server-only'
import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import type { CourseBundle } from '@/course'
import type { LearningUnit } from '@/content/model'
import { getUnits } from '../content'
import { courseIdOf, type CourseEntry, type CourseListing } from './bundles'
import { CourseStore, type CourseCatalog } from './catalog'

export { courseIdOf, type CourseEntry, type CourseListing, type CourseSource } from './bundles'

// Official course bundles, compiled at build time (pnpm course:build → content/courses/<id>.json + catalog.json, traced
// into every server function via next.config.ts). The catalog is read once per process; a bundle is loaded and
// schema-validated when a course is opened and kept under COURSE_CACHE_MB (./catalog.ts).

const key = Symbol.for('levelup.course-store')
const sigKey = Symbol.for('levelup.course-store-sig')
type GlobalWithStore = typeof globalThis & { [key]?: CourseStore; [sigKey]?: string }

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

export function courseStore(): CourseStore {
  const g = globalThis as GlobalWithStore
  if (process.env.NODE_ENV !== 'production') {
    const sig = bundlesSignature()
    if (sig !== g[sigKey]) {
      g[sigKey] = sig
      g[key] = undefined
    }
  }
  return (g[key] ??= new CourseStore(coursesDir()))
}

// The catalog (a new object after a dev reload — callers may key caches on its identity).
export function courseCatalog(): Promise<CourseCatalog> {
  return courseStore().catalog()
}

export async function listCourses(): Promise<CourseListing[]> {
  return (await courseCatalog()).courses.filter((c) => c.listed).map((c) => c.listing)
}

export async function getCourseEntry(id: string): Promise<CourseEntry | null> {
  return courseStore().entry(id)
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
  const first = (await courseCatalog()).courses.find((c) => c.listed)
  return first ? getCourse(first.id) : null
}

// Exercise bodies live in the content store, keyed by the same id as the bundle's exercise refs. Ids that are not
// exercises of the bundle are left out.
export async function exerciseUnits(bundle: CourseBundle, exerciseIds: readonly string[]): Promise<Map<string, LearningUnit>> {
  return getUnits(exerciseIds.filter((id) => bundle.exercises[id]))
}

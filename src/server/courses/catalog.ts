import { createHash } from 'node:crypto'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { courseKind, legacyLessonMap } from '@/course'
import { courseLanguages, type CourseLanguages } from '@/course/i18n'
import { ByteLru, budgetFromEnv } from '@/content/lru'
import { courseListing, parseBundles, type BundleFile, type CourseEntry, type CourseListing, type CourseSource } from './bundles'

// The course catalog (content/courses/catalog.json, written by pnpm course:build) and the lazy bundle store behind it
// (docs/fullstack/stage1/01-storage.md §5). Everything the app asks of ALL courses — the marketplace listing, which
// guide a course teaches in which language, the legacy lesson ids — is in the catalog, which is small and resident;
// a bundle (up to 5 MB of JSON, ~2.3× that on the heap) is read, validated and cached only when a course is opened,
// under COURSE_CACHE_MB. Framework-free: src/server/courses/registry.ts adds the process-wide instance.

export const CATALOG_FORMAT = 1
export const CATALOG_FILE = 'catalog.json'

export interface CatalogCourse {
  id: string
  file: string
  bytes: number
  sha1: string
  source: CourseSource
  listed: boolean
  listing: CourseListing
  // guides the course teaches (its sections' and its theory)
  guides: string[]
  languages: CourseLanguages
  // the spoken language of a language course (null for the others)
  target: string | null
}

export interface CourseCatalog {
  format: number
  courses: CatalogCourse[]
  // old lesson id (`<chapterId>::<kind>-<n>`) → lesson id; the first course that has it wins
  legacy: Record<string, string>
}

// Measured: a bundle's heap is 2.2–2.4× its JSON file (the English one: 4.1 MB → 9.3 MB).
export const BUNDLE_HEAP_FACTOR = 2.3

export function buildCatalog(files: readonly BundleFile[], source: CourseSource = 'official'): { catalog: CourseCatalog; courses: Map<string, CourseEntry>; errors: string[] } {
  const { courses, errors } = parseBundles(files, source)
  const byName = new Map(files.map((f) => [f.name, f.text]))
  const catalog: CourseCatalog = { format: CATALOG_FORMAT, courses: [], legacy: {} }
  for (const entry of courses.values()) {
    const { bundle } = entry
    const file = `${bundle.course.id}.json`
    const text = byName.get(file) ?? ''
    const target = courseKind(bundle.course) === 'language' ? (bundle.course.target ?? bundle.course.language) : null
    catalog.courses.push({
      id: bundle.course.id,
      file,
      bytes: Buffer.byteLength(text),
      sha1: createHash('sha1').update(text).digest('hex'),
      source: entry.source,
      listed: entry.listed,
      listing: courseListing(entry),
      guides: [...new Set([...bundle.sections.map((s) => s.guideId), ...(bundle.theory ?? [])])],
      languages: courseLanguages(bundle.course),
      target,
    })
    if (entry.listed) for (const [oldId, newId] of legacyLessonMap(bundle)) if (!(oldId in catalog.legacy)) catalog.legacy[oldId] = newId
  }
  return { catalog, courses, errors }
}

export interface CourseStoreStats {
  bytes: number
  budget: number
  loaded: string[]
  loads: number
  evictions: number
  fallback: boolean
}

export class CourseStore {
  private readonly lru: ByteLru<CourseEntry>
  private readonly inflight = new Map<string, Promise<CourseEntry | null>>()
  private catalogPromise: Promise<CourseCatalog> | null = null
  // without a usable catalog (an old checkout): every bundle, loaded at once, as before the catalog existed
  private all: Map<string, CourseEntry> | null = null
  private loads = 0

  constructor(
    readonly dir: string,
    budget = budgetFromEnv('COURSE_CACHE_MB', 24),
  ) {
    this.lru = new ByteLru(budget)
  }

  stats(): CourseStoreStats {
    return { bytes: this.lru.bytes, budget: this.lru.budget, loaded: this.all ? [...this.all.keys()] : this.lru.keys(), loads: this.loads, evictions: this.lru.evictions, fallback: this.all !== null }
  }

  catalog(): Promise<CourseCatalog> {
    this.catalogPromise ??= this.readCatalog().catch((error: unknown) => {
      this.catalogPromise = null
      throw error
    })
    return this.catalogPromise
  }

  private async readCatalog(): Promise<CourseCatalog> {
    try {
      const catalog = JSON.parse(await readFile(path.join(this.dir, CATALOG_FILE), 'utf8')) as CourseCatalog
      if (catalog.format !== CATALOG_FORMAT) throw new Error('catalog format')
      // a bundle rebuilt after the catalog (another size) makes the catalog stale
      for (const c of catalog.courses) if ((await stat(path.join(this.dir, c.file))).size !== c.bytes) throw new Error(`${c.file} no longer matches the catalog`)
      return catalog
    } catch (error) {
      return this.fallback(error)
    }
  }

  private async fallback(reason: unknown): Promise<CourseCatalog> {
    let names: string[] = []
    try {
      names = (await readdir(this.dir, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith('.json') && e.name !== CATALOG_FILE).map((e) => e.name)
    } catch {
      console.warn(`[courses] ${this.dir} не знайдено — курсів немає (pnpm course:build)`)
      this.all = new Map()
      return { format: CATALOG_FORMAT, courses: [], legacy: {} }
    }
    console.warn(`[courses] каталог не використано (${reason instanceof Error ? reason.message : String(reason)}): завантажую всі bundle (pnpm course:build)`)
    const files = await Promise.all(names.map(async (name) => ({ name, text: await readFile(path.join(this.dir, name), 'utf8') })))
    const { catalog, courses, errors } = buildCatalog(files)
    for (const e of errors) console.error(`[courses] ${e}`)
    this.all = courses
    return catalog
  }

  async entry(id: string): Promise<CourseEntry | null> {
    const catalog = await this.catalog()
    if (this.all) return this.all.get(id) ?? null
    const course = catalog.courses.find((c) => c.id === id)
    if (!course) return null
    const hit = this.lru.get(id)
    if (hit) return hit
    const pending = this.inflight.get(id)
    if (pending) return pending
    const task = this.load(course)
    this.inflight.set(id, task)
    const settle = () => this.inflight.delete(id)
    task.then(settle, settle)
    return task
  }

  private async load(course: CatalogCourse): Promise<CourseEntry | null> {
    const text = await readFile(path.join(this.dir, course.file), 'utf8')
    const { courses, errors } = parseBundles([{ name: course.file, text }], course.source)
    for (const e of errors) console.error(`[courses] ${e}`)
    const entry = courses.get(course.id) ?? null
    this.loads++
    if (entry && !this.lru.set(course.id, entry, course.bytes * BUNDLE_HEAP_FACTOR)) console.warn(`[courses] ${course.id} is larger than COURSE_CACHE_MB: served without caching`)
    return entry
  }
}

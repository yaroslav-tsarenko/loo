import { createHash } from 'node:crypto'
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { courseKind, legacyLessonMap } from '@/course'
import { courseListing } from '@/server/courses/bundles'
import { buildCatalog, CATALOG_FILE, CourseStore } from '@/server/courses/catalog'

// The course catalog and the lazy bundle store (src/server/courses/catalog.ts): the catalog answers what the app asks
// of all courses, a bundle loads only when its course is opened.

const source = path.resolve(__dirname, '../../content/courses')
const names = readdirSync(source).filter((n) => n.endsWith('.json') && n !== CATALOG_FILE)
const files = names.map((name) => ({ name, text: readFileSync(path.join(source, name), 'utf8') }))
const tmp: string[] = []

function copy(without: string[] = []): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'levelup-courses-'))
  tmp.push(dir)
  for (const n of [...names, CATALOG_FILE]) if (!without.includes(n)) cpSync(path.join(source, n), path.join(dir, n))
  return dir
}

afterAll(() => {
  for (const d of tmp) rmSync(d, { recursive: true, force: true })
})

describe('course catalog', () => {
  const { catalog, courses } = buildCatalog(files)

  it('lists exactly what the loaded bundles list', () => {
    expect(catalog.courses.map((c) => c.listing)).toEqual([...courses.values()].map(courseListing))
    expect(catalog.courses.map((c) => c.id)).toEqual([...courses.keys()])
  })

  it('carries the guides, languages and spoken target of every course', () => {
    for (const c of catalog.courses) {
      const bundle = courses.get(c.id)!.bundle
      expect(c.guides).toEqual([...new Set([...bundle.sections.map((s) => s.guideId), ...(bundle.theory ?? [])])])
      expect(c.target).toBe(courseKind(bundle.course) === 'language' ? (bundle.course.target ?? bundle.course.language) : null)
    }
  })

  it('maps old lesson ids like the bundles do, the first course winning', () => {
    const expected = new Map<string, string>()
    for (const { bundle } of courses.values()) for (const [oldId, newId] of legacyLessonMap(bundle)) if (!expected.has(oldId)) expected.set(oldId, newId)
    expect(new Map(Object.entries(catalog.legacy))).toEqual(expected)
    expect(expected.size).toBeGreaterThan(0)
  })

  it('is up to date with the committed bundles (pnpm course:build --catalog-only)', () => {
    const committed = JSON.parse(readFileSync(path.join(source, CATALOG_FILE), 'utf8')) as typeof catalog
    expect(committed.courses.map((c) => [c.id, c.bytes, c.sha1])).toEqual(catalog.courses.map((c) => [c.id, c.bytes, c.sha1]))
    expect(committed.courses.map((c) => c.sha1)).toEqual(files.map((f) => createHash('sha1').update(f.text).digest('hex')))
  })
})

describe('course store', () => {
  it('reads the catalog without loading any bundle, then one bundle on demand', async () => {
    const store = new CourseStore(copy(), 24_000_000)
    expect((await store.catalog()).courses.length).toBe(names.length)
    expect(store.stats()).toMatchObject({ loads: 0, loaded: [], fallback: false })
    const id = names[0]!.replace('.json', '')
    expect((await store.entry(id))?.bundle.course.id).toBe(id)
    expect(store.stats()).toMatchObject({ loads: 1, loaded: [id] })
    expect(await store.entry('no-such-course')).toBeNull()
  })

  it('loads a bundle once for parallel readers', async () => {
    const store = new CourseStore(copy(), 24_000_000)
    const id = names[0]!.replace('.json', '')
    const all = await Promise.all(Array.from({ length: 8 }, () => store.entry(id)))
    expect(new Set(all).size).toBe(1)
    expect(store.stats().loads).toBe(1)
  })

  it('evicts the least recently used bundle when the budget is full', async () => {
    const dir = copy()
    const catalog = await new CourseStore(dir).catalog()
    const [a, b] = [...catalog.courses].sort((x, y) => y.bytes - x.bytes)
    // room for the largest bundle and a little more: opening a second one evicts the first
    const store = new CourseStore(dir, a!.bytes * 2.3 * 1.2)
    await store.entry(a!.id)
    await store.entry(b!.id)
    expect(store.stats().evictions).toBeGreaterThanOrEqual(1)
    expect(store.stats().loaded).not.toContain(a!.id)
    expect(store.stats().bytes).toBeLessThanOrEqual(store.stats().budget)
    await store.entry(a!.id)
    expect(store.stats().loads).toBe(3)
  })

  it('falls back to loading every bundle when the catalog is missing or stale', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const missing = new CourseStore(copy([CATALOG_FILE]))
    expect((await missing.catalog()).courses.length).toBe(names.length)
    expect(missing.stats().fallback).toBe(true)
    expect((await missing.entry(names[0]!.replace('.json', '')))?.bundle).toBeTruthy()

    const dir = copy()
    const file = path.join(dir, names[0]!)
    writeFileSync(file, `${readFileSync(file, 'utf8')} `)
    const stale = new CourseStore(dir)
    await stale.catalog()
    expect(stale.stats().fallback).toBe(true)
  })

  it('does not break on a missing directory', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const store = new CourseStore(path.join(tmpdir(), 'levelup-no-such-courses'))
    expect((await store.catalog()).courses).toEqual([])
    expect(await store.entry('x')).toBeNull()
  })
})

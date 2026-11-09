import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { CourseBundle } from '@/course'
import { guideLessons } from '@/content/lessons'
import { buildSnapshotDir, writeSnapshotDir } from '@/content/shards/write'
import { ContentStore, loadSnapshot, prebuiltPath, type FullSnapshot } from '@/content/store'
import { matchUnits, parseFilters } from '@/server/services/queue'

// Every page type resolves its units through the server functions behind it (docs/fullstack/stage1/01-storage.md §7.3),
// against the shards with a section cache so small (50 KB) that nearly every read evicts or bypasses it.

vi.mock('server-only', () => ({}))
vi.mock('next/server', () => ({ connection: async () => {} }))
vi.mock('react', async (original) => ({ ...(await original<typeof import('react')>()), cache: <T>(fn: T) => fn }))
vi.mock('@/server/settings', () => ({ readVaultPath: async () => null, readSystem: async () => undefined, writeSystem: async () => {} }))
vi.mock('@/server/services/units-sync', () => ({ syncUnits: async () => {} }))

const dir = mkdtempSync(path.join(tmpdir(), 'levelup-pages-'))
const config = { vaultPath: dir, guidesDir: 'Guides' }
const storeKey = Symbol.for('interview-prep.content-store')
let full: FullSnapshot
let store: ContentStore

// guides of several fixtures in one vault: words and listening, a placement bank, reels, a translated topic
beforeAll(async () => {
  const fixtures = path.resolve(__dirname, '../fixtures')
  mkdirSync(path.join(dir, 'Guides'), { recursive: true })
  for (const vault of ['vault', 'lang-vault', 'placement-vault', 'i18n-vault', 'course-vault']) {
    for (const guide of readdirSync(path.join(fixtures, vault, 'Guides'))) {
      const target = path.join(dir, 'Guides', guide)
      cpSync(path.join(fixtures, vault, 'Guides', guide), target, { recursive: true, force: false, errorOnExist: false })
    }
  }
  process.env.CONTENT_CACHE_MB = '0.05'
  full = await loadSnapshot(config, new Map(), 1)
  await writeSnapshotDir(config, await buildSnapshotDir(config))
  store = new ContentStore(config, false, prebuiltPath(config), true)
  ;(globalThis as Record<symbol, unknown>)[storeKey] = store
  await store.get()
}, 120_000)

afterAll(() => {
  delete process.env.CONTENT_CACHE_MB
  delete (globalThis as Record<symbol, unknown>)[storeKey]
  rmSync(dir, { recursive: true, force: true })
})

const plain = (x: unknown) => JSON.stringify(x, (_k, v: unknown) => (v instanceof Map ? [...v.entries()] : v))

describe('page types on shards with a tiny section cache', () => {
  it('starts from the shards, and the cache is small enough to matter', async () => {
    expect(store.shardStats()).toMatchObject({ budget: 50_000 })
    expect(full.units.size).toBeGreaterThan(20)
    expect(full.reels.length).toBeGreaterThan(0)
    expect(full.placementUnits.size).toBeGreaterThan(0)
  })

  it('reader: the units of every chapter', async () => {
    const { getChapterUnits } = await import('@/server/content')
    for (const chapter of full.chapters.values()) expect(plain(await getChapterUnits(chapter.id))).toBe(plain(full.unitsByChapter.get(chapter.id) ?? []))
  })

  it('players (learn, quiz, review, words, tasks, mistakes, test): the bodies of what each queue picks', async () => {
    const { getUnit, getUnits } = await import('@/server/content')
    const index = await store.get()
    for (const kind of ['flashcard', 'quiz', 'task'] as const) {
      const picked = matchUnits(index, { ...parseFilters({}, 500), types: [], size: 500 }, kind, null)
      expect(picked.length).toBeGreaterThan(0)
      const bodies = await getUnits(picked.map((u) => u.id))
      expect([...bodies.keys()]).toEqual(picked.map((u) => u.id))
      for (const u of picked) expect(plain(bodies.get(u.id))).toBe(plain(full.units.get(u.id)))
      // grading and the task page ask for one
      expect(plain(await getUnit(picked[0]!.id))).toBe(plain(full.units.get(picked[0]!.id)))
    }
    expect(await getUnit('no-such-unit')).toBeNull()
  })

  it('placement: every bank item by id', async () => {
    const { getPlacementUnit } = await import('@/server/content')
    for (const [id, unit] of full.placementUnits) expect(plain(await getPlacementUnit(id))).toBe(plain(unit))
  })

  it('lessons and feed: the units and reels of every lesson, reels by id', async () => {
    const { getReels, getUnits } = await import('@/server/content')
    const index = await store.get()
    for (const guide of index.guides) {
      const chapters = guide.chapterIds.flatMap((id) => index.chapters.get(id) ?? [])
      for (const lesson of [...guideLessons(guide, chapters, index.unitsByChapter, index.reels, index.units).values()].flat()) {
        const unitIds = lesson.items.flatMap((i) => (i.kind === 'unit' ? [i.id] : []))
        const reelIds = lesson.items.flatMap((i) => (i.kind === 'reel' ? [i.id] : []))
        expect((await getUnits(unitIds)).size).toBe(unitIds.length)
        const found = await getReels(reelIds)
        expect(found.size).toBe(reelIds.length)
      }
    }
    const all = await getReels(full.reels.map((r) => r.id))
    for (const reel of full.reels) expect(plain(all.get(reel.id))).toBe(plain(reel))
  })

  it('courses: the exercises of a bundle', async () => {
    const { exerciseUnits } = await import('@/server/courses/registry')
    const ids = [...full.units.keys()].slice(0, 12)
    const bundle = { exercises: Object.fromEntries(ids.map((id) => [id, {}])) } as unknown as CourseBundle
    const found = await exerciseUnits(bundle, [...ids, 'not-an-exercise'])
    expect([...found.keys()]).toEqual(ids)
  })

  it('translated topics: the localized document is the same as from the parse in memory', async () => {
    const memory = new ContentStore(config, false)
    const index = await store.get()
    const translated = [...index.translations.entries()].filter(([, byLang]) => [...byLang.values()].some((t) => t.lock))
    expect(translated.length).toBeGreaterThan(0)
    for (const [chapterId, byLang] of translated) {
      for (const [lang, info] of byLang) {
        if (!info.lock) continue
        const opts = { sourceLang: 'uk', label: 'not translated', labelLang: 'uk' }
        const a = await store.localizedDocument(chapterId, lang, opts)
        const b = await memory.localizedDocument(chapterId, lang, opts)
        expect(a).not.toBeNull()
        expect(plain({ ...a, chapter: undefined })).toBe(plain({ ...b, chapter: undefined }))
      }
    }
  })

  it('the section cache stayed inside its budget while serving all of it', async () => {
    const stats = store.shardStats()!
    expect(stats.bytes).toBeLessThanOrEqual(stats.budget)
    expect(stats.evictions + stats.oversize).toBeGreaterThan(0)
  })
})

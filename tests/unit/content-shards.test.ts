import { cpSync, mkdtempSync, openSync, readdirSync, rmSync, writeFileSync, writeSync, closeSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { ByteLru } from '@/content/lru'
import { loadShards, resetWarnings, ShardReader, shardsDir } from '@/content/shards/read'
import { verifyShards } from '@/content/shards/verify'
import { buildSnapshotDir, writeSnapshotDir } from '@/content/shards/write'
import { ContentStore, listingFingerprint, prebuiltPath } from '@/content/store'
import { listVault } from '@/content/sources/vault-fs'

// The shards (src/content/shards): written from the full parse, they serve exactly what the parse holds, within the
// section cache budget, and are ignored when they no longer match the vault.

const dir = mkdtempSync(path.join(tmpdir(), 'levelup-shards-'))
cpSync(path.resolve(__dirname, '../fixtures/vault'), dir, { recursive: true })
const config = { vaultPath: dir, guidesDir: 'Guides' }

beforeAll(async () => {
  await writeSnapshotDir(config, await buildSnapshotDir(config))
}, 60_000)

afterAll(() => rmSync(dir, { recursive: true, force: true }))

describe('byte LRU', () => {
  it('evicts the least recently used entries until the total fits', () => {
    const lru = new ByteLru<string>(10)
    lru.set('a', 'A', 4)
    lru.set('b', 'B', 4)
    lru.get('a')
    lru.set('c', 'C', 4)
    expect(lru.keys()).toEqual(['a', 'c'])
    expect(lru.bytes).toBe(8)
    expect(lru.evictions).toBe(1)
  })

  it('does not keep an entry larger than the budget, and replacing re-counts', () => {
    const lru = new ByteLru<string>(10)
    lru.set('a', 'A', 6)
    expect(lru.set('big', 'X', 11)).toBe(false)
    expect(lru.keys()).toEqual(['a'])
    lru.set('a', 'A2', 3)
    expect(lru.bytes).toBe(3)
  })
})

async function reader(budget: number) {
  const listing = await listVault(dir, 'Guides')
  const loaded = await loadShards(config, listingFingerprint(listing), budget)
  if ('reason' in loaded) throw new Error(`no shards: ${loaded.reason}`)
  const { index, reader } = loaded
  const chapters = [...index.unitsByChapter.keys()].map((id) => ({ id, guideId: index.chapters.get(id)!.guideId }))
  return { reader, chapters }
}

describe('section cache', () => {
  it('decodes a section once for parallel readers, then serves it from the cache', async () => {
    const { reader: r, chapters } = await reader(24_000_000)
    const { id, guideId } = chapters[0]!
    const all = await Promise.all(Array.from({ length: 10 }, () => r.chapter(guideId, id)))
    expect(new Set(all).size).toBe(1)
    expect(r.stats().decodes).toBe(1)
    await r.chapter(guideId, id)
    expect(r.stats()).toMatchObject({ decodes: 1, hits: 1, sections: 1 })
    await r.close()
  })

  it('evicts the least recently used sections when the budget is full', async () => {
    const probe = await reader(24_000_000)
    expect(probe.chapters.length).toBeGreaterThan(2)
    let largest = 0
    for (const c of probe.chapters) {
      const before = probe.reader.stats().bytes
      await probe.reader.chapter(c.guideId, c.id)
      largest = Math.max(largest, probe.reader.stats().bytes - before)
    }
    await probe.reader.close()
    // room for the largest section and little more
    const { reader: r, chapters } = await reader(largest * 1.2)
    for (const c of chapters) await r.chapter(c.guideId, c.id)
    expect(r.stats().evictions).toBeGreaterThanOrEqual(1)
    expect(r.stats().bytes).toBeLessThanOrEqual(r.stats().budget)
    expect(r.stats().oversize).toBe(0)
    // the first chapter was evicted: reading it decodes again
    const decoded = r.stats().decodes
    await r.chapter(chapters[0]!.guideId, chapters[0]!.id)
    expect(r.stats().decodes).toBe(decoded + 1)
    await r.close()
  })

  it('serves a section larger than the budget without caching it', async () => {
    const { reader: r, chapters } = await reader(0)
    const { id, guideId } = chapters[0]!
    expect((await r.chapter(guideId, id)).units.length).toBeGreaterThan(0)
    await r.chapter(guideId, id)
    expect(r.stats()).toMatchObject({ decodes: 2, sections: 0, oversize: 2 })
    await r.close()
  })

  it('returns nothing for a chapter without a section', async () => {
    const { reader: r, chapters } = await reader(24_000_000)
    expect(await r.chapter(chapters[0]!.guideId, 'no-such-chapter')).toEqual({ units: [], reels: [] })
    expect(await r.chapter('no-such-guide', 'x')).toEqual({ units: [], reels: [] })
    await r.close()
  })
})

describe('shards', () => {
  it('serve the same index, bodies, texts and search hits as the full parse', async () => {
    expect(await verifyShards(config)).toEqual([])
  })

  it('are ignored once the vault changed (the listing no longer matches)', async () => {
    const guides = path.join(dir, 'Guides')
    const guide = readdirSync(guides).find((n) => !n.startsWith('.'))!
    const extra = path.join(guides, guide, 'zz-shard-note.md')
    writeFileSync(extra, '# New\n\nFresh text.\n')
    const listing = await listVault(dir, 'Guides')
    expect(await loadShards(config, listingFingerprint(listing))).toMatchObject({ reason: expect.stringContaining('differs') })
    const store = new ContentStore(config, false, prebuiltPath(config), true)
    await store.get()
    expect(store.shardStats()).toBeNull()
    rmSync(extra)
  })

  it('are ignored when a pack does not match the manifest', async () => {
    const listing = await listVault(dir, 'Guides')
    const pack = path.join(shardsDir(config), 'guides', readdirSync(path.join(shardsDir(config), 'guides'))[0]!)
    writeFileSync(pack, 'x')
    expect(await loadShards(config, listingFingerprint(listing))).toMatchObject({ reason: expect.stringContaining('bytes') })
  })
})

async function freshBuild(): Promise<{ dir: string; config: { vaultPath: string; guidesDir: string } }> {
  const fresh = mkdtempSync(path.join(tmpdir(), 'levelup-shards-'))
  cpSync(path.resolve(__dirname, '../fixtures/vault'), fresh, { recursive: true })
  const cfg = { vaultPath: fresh, guidesDir: 'Guides' }
  await writeSnapshotDir(cfg, await buildSnapshotDir(cfg))
  return { dir: fresh, config: cfg }
}

describe('a build that does not match', () => {
  it('a pack of the right size with the wrong bytes fails once, clearly, and is not read again', async () => {
    const { dir: d, config: cfg } = await freshBuild()
    try {
      const loaded = await loadShards(cfg, null)
      if ('reason' in loaded) throw new Error(loaded.reason)
      const biggest = [...loaded.index.unitsByChapter.keys()][0]!
      const guideId = loaded.index.chapters.get(biggest)!.guideId
      const pack = path.join(shardsDir(cfg), 'guides', loaded.manifest.shards!.guides.find((g) => g.id === guideId)!.pack)
      const fd = openSync(pack, 'r+')
      writeSync(fd, Buffer.from('0123456789'), 0, 10, 0)
      closeSync(fd)
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      await expect(loaded.reader.chapter(guideId, biggest)).rejects.toThrow(/does not match the manifest \(sha1\)/)
      await expect(loaded.reader.chapter(guideId, biggest)).rejects.toThrow(/sha1/)
      expect(error).toHaveBeenCalledTimes(1)
      expect(loaded.reader.stats()).toMatchObject({ decodes: 0, sections: 0 })
      await loaded.reader.close()
    } finally {
      vi.restoreAllMocks()
      rmSync(d, { recursive: true, force: true })
    }
  })

  it('a failed read is not cached', async () => {
    const { dir: d, config: cfg } = await freshBuild()
    try {
      const loaded = await loadShards(cfg, null)
      if ('reason' in loaded) throw new Error(loaded.reason)
      const guide = loaded.manifest.shards!.guides.find((g) => g.units > 0)!
      // a section that runs past the end of the pack
      const broken = new ShardReader(path.join(shardsDir(cfg), ''), { [guide.id]: { pack: guide.pack, chapters: { x: [guide.packBytes, 50] }, placement: null, text: null } })
      await expect(broken.chapter(guide.id, 'x')).rejects.toThrow()
      await expect(broken.chapter(guide.id, 'x')).rejects.toThrow()
      expect(broken.stats()).toMatchObject({ sections: 0, decodes: 0 })
      await broken.close()
      await loaded.reader.close()
    } finally {
      rmSync(d, { recursive: true, force: true })
    }
  })

  it('says why it is not used, once, and parses', async () => {
    const { dir: d, config: cfg } = await freshBuild()
    try {
      writeFileSync(path.join(d, 'Guides', readdirSync(path.join(d, 'Guides')).find((n) => !n.startsWith('.'))!, 'zz-extra.md'), '# Extra\n\ntext\n')
      resetWarnings()
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const store = new ContentStore(cfg, false, prebuiltPath(cfg), true)
      await store.get()
      expect(store.shardStats()).toBeNull()
      const said = warn.mock.calls.map((c) => String(c[0]))
      expect(said.some((m) => m.startsWith('[content] shards not used:') && m.includes('differs'))).toBe(true)
      expect(said.some((m) => m.startsWith('[content] monolithic snapshot not used:'))).toBe(true)
      expect(said.some((m) => m.includes('parsing the whole vault'))).toBe(true)
    } finally {
      vi.restoreAllMocks()
      rmSync(d, { recursive: true, force: true })
    }
  })

  it('a deployment trusts the manifest: files it does not ship do not matter', async () => {
    const { dir: d, config: cfg } = await freshBuild()
    try {
      rmSync(path.join(d, 'Notes'), { recursive: true, force: true })
      const strict = new ContentStore(cfg, false, prebuiltPath(cfg), true, true)
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      await strict.get()
      expect(strict.shardStats()).toBeNull()
      warn.mockRestore()
      const trusting = new ContentStore(cfg, false, prebuiltPath(cfg), true, false)
      await trusting.get()
      expect(trusting.shardStats()).not.toBeNull()
    } finally {
      vi.restoreAllMocks()
      rmSync(d, { recursive: true, force: true })
    }
  })

  it('CONTENT_SHARDS=0 serves from the monolith', async () => {
    const { dir: d } = await freshBuild()
    const key = Symbol.for('interview-prep.content-store')
    const g = globalThis as Record<symbol, unknown>
    const saved = { ...process.env }
    try {
      Object.assign(process.env, { CONTENT_SNAPSHOT: '1', CONTENT_SHARDS: '0', CONTENT_WATCH: '0', VAULT_PATH: d })
      delete process.env.VERCEL
      delete g[key]
      const { getContentStore } = await import('@/content/store')
      const store = getContentStore()
      const index = await store.get()
      expect(store.shardStats()).toBeNull()
      expect(index.scanMs).toBeLessThan(5000)
      const id = [...index.units.keys()][0]!
      expect((await store.unit(id))?.id).toBe(id)
    } finally {
      delete g[key]
      for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k]
      Object.assign(process.env, saved)
      rmSync(d, { recursive: true, force: true })
    }
  })
})

describe('a reload while bodies are being read', () => {
  it('keeps serving the old source until the new one is in place, in memory and on shards', async () => {
    const { dir: d, config: cfg } = await freshBuild()
    try {
      for (const store of [new ContentStore(cfg, false), new ContentStore(cfg, false, prebuiltPath(cfg), true)]) {
        const index = await store.get()
        const ids = [...index.units.keys()]
        const chapter = [...index.unitsByChapter.keys()][0]!
        const reload = (store as unknown as { reload(paths: string[]): Promise<unknown> }).reload(['changed.md'])
        const during = await Promise.all([store.unit(ids[0]!), store.units(ids), store.chapterUnits(chapter), store.chapterReels(chapter)])
        await reload
        expect(during[0]?.id).toBe(ids[0])
        expect(during[1].size).toBe(ids.length)
        expect(during[2].length).toBeGreaterThan(0)
        expect((await store.unit(ids[0]!))?.id).toBe(ids[0])
      }
    } finally {
      rmSync(d, { recursive: true, force: true })
    }
  })
})

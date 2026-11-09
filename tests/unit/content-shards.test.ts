import { cpSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ByteLru } from '@/content/lru'
import { loadShards, shardsDir } from '@/content/shards/read'
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
  if (!loaded) throw new Error('no shards')
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
    expect(await loadShards(config, listingFingerprint(listing))).toBeNull()
    const store = new ContentStore(config, false, prebuiltPath(config), true)
    await store.get()
    expect(store.shardStats()).toBeNull()
    rmSync(extra)
  })

  it('are ignored when a pack does not match the manifest', async () => {
    const listing = await listVault(dir, 'Guides')
    const pack = path.join(shardsDir(config), 'guides', readdirSync(path.join(shardsDir(config), 'guides'))[0]!)
    writeFileSync(pack, 'x')
    expect(await loadShards(config, listingFingerprint(listing))).toBeNull()
  })
})

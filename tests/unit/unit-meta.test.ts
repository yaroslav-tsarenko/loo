import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ContentStore, loadSnapshot } from '@/content/store'
import { unitLabel } from '@/content/unit-label'
import { unitMeta } from '@/content/unit-meta'

// The resident index keeps unit metadata only (src/content/store.ts → ContentIndex); the bodies come from the store's
// async API. Both are derived from the same parse, so they agree with it.

const config = { vaultPath: path.resolve(__dirname, '../fixtures/vault'), guidesDir: 'Guides' }
const store = new ContentStore(config, false)

describe('content index', () => {
  it('keeps a UnitMeta for every unit, with the label of the unit', async () => {
    const full = await loadSnapshot(config, new Map(), 1)
    const index = await store.get()
    expect(index.units.size).toBe(full.units.size)
    for (const unit of full.units.values()) {
      const meta = index.units.get(unit.id)!
      expect(meta).toEqual(unitMeta(unit))
      expect(meta.label).toBe(unitLabel(unit))
      expect(meta.kind).toBe(unit.kind)
      expect(meta.chapterId).toBe(unit.chapterId)
      if (unit.kind === 'flashcard') expect(meta).toMatchObject({ hasWord: Boolean(unit.word), frequency: unit.frequency, qtype: unit.qtype })
      if (unit.kind === 'quiz') expect(meta).toMatchObject({ mode: unit.mode })
      if (unit.kind === 'task') expect(meta).toMatchObject({ difficulty: unit.difficulty, hasTests: Boolean(unit.code?.tests) })
    }
    expect(JSON.stringify(index.units.values().next().value)).not.toContain('"body"')
  })

  it('serves the same bodies as the parse, by id and by chapter', async () => {
    const full = await loadSnapshot(config, new Map(), 1)
    const ids = [...full.units.keys()]
    const bodies = await store.units(ids)
    expect(bodies.size).toBe(ids.length)
    for (const id of ids) {
      expect(await store.unit(id)).toEqual(full.units.get(id))
      expect(bodies.get(id)).toEqual(full.units.get(id))
    }
    for (const [chapterId, list] of full.unitsByChapter) {
      expect(await store.chapterUnits(chapterId)).toEqual(list)
      expect((await store.get()).unitsByChapter.get(chapterId)?.map((m) => m.id)).toEqual(list.map((u) => u.id))
    }
    expect(await store.unit('no-such-unit')).toBeNull()
  })

  it('keeps reels as titles and serves their bodies', async () => {
    const full = await loadSnapshot(config, new Map(), 1)
    const index = await store.get()
    expect(index.reels.map((r) => r.id)).toEqual(full.reels.map((r) => r.id))
    expect(index.reels.every((r) => !('body' in r))).toBe(true)
    const bodies = await store.reels(full.reels.map((r) => r.id))
    for (const reel of full.reels) {
      expect(bodies.get(reel.id)).toEqual(reel)
      expect((await store.chapterReels(reel.chapterId)).some((r) => r.id === reel.id)).toBe(true)
    }
  })

  it('hands the chapter texts out guide by guide', async () => {
    const full = await loadSnapshot(config, new Map(), 1)
    const seen = new Map<string, string>()
    await store.forEachGuideText((_guideId, texts) => {
      for (const [id, text] of texts) seen.set(id, text)
    })
    expect(seen.size).toBe(full.plainText.size)
    for (const [id, text] of full.plainText) expect(seen.get(id)).toBe(text)
    // a guide's index page is a chapter too
    for (const guide of full.guides) if (guide.indexChapterId) expect(seen.has(guide.indexChapterId)).toBe(true)
  })
})

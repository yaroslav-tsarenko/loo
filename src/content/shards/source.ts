import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { brotliDecompressSync } from 'node:zlib'
import type MiniSearch from 'minisearch'
import type { LearningUnit } from '../model'
import type { Reel } from '../parse/reels'
import { loadSearchIndex, searchIndexFor, type SearchDoc } from '../search'
import type { ContentIndex, FullSnapshot, Manifest } from '../store'
import type { ShardReader } from './read'

// Where unit and reel bodies and chapter texts come from (ContentStore delegates to one of these):
// - MemorySource: the full parse held in memory — the dev server, the build scripts, CONTENT_SHARDS=0, the monolith;
// - ShardSource: the per-guide packs, read on demand through the section LRU (src/content/shards/read.ts).
// Both answer the same questions with the same data (tests/unit/content-shards.test.ts).

export interface BodySource {
  unit(id: string): Promise<LearningUnit | null>
  units(ids: readonly string[]): Promise<Map<string, LearningUnit>>
  chapterUnits(chapterId: string): Promise<LearningUnit[]>
  reels(ids: readonly string[]): Promise<Map<string, Reel>>
  chapterReels(chapterId: string): Promise<Reel[]>
  placementUnit(id: string): Promise<LearningUnit | null>
  forEachGuideText(fn: (guideId: string, texts: ReadonlyMap<string, string>) => void | Promise<void>): Promise<void>
  searchIndex(): Promise<MiniSearch<SearchDoc>>
}

export class MemorySource implements BodySource {
  constructor(readonly full: FullSnapshot) {}

  async unit(id: string) {
    return this.full.units.get(id) ?? null
  }

  async units(ids: readonly string[]) {
    const out = new Map<string, LearningUnit>()
    for (const id of ids) {
      const unit = this.full.units.get(id)
      if (unit) out.set(id, unit)
    }
    return out
  }

  async chapterUnits(chapterId: string) {
    return this.full.unitsByChapter.get(chapterId) ?? []
  }

  async reels(ids: readonly string[]) {
    const wanted = new Set(ids)
    return new Map(this.full.reels.filter((r) => wanted.has(r.id)).map((r) => [r.id, r]))
  }

  async chapterReels(chapterId: string) {
    return this.full.reels.filter((r) => r.chapterId === chapterId)
  }

  async placementUnit(id: string) {
    return this.full.placementUnits.get(id) ?? null
  }

  async forEachGuideText(fn: (guideId: string, texts: ReadonlyMap<string, string>) => void | Promise<void>) {
    const { guides, chapters, plainText } = this.full
    const byGuide = new Map<string, Map<string, string>>(guides.map((g) => [g.id, new Map()]))
    // every chapter of the guide, its index page included
    for (const chapter of chapters.values()) {
      const text = plainText.get(chapter.id)
      if (text !== undefined) byGuide.get(chapter.guideId)?.set(chapter.id, text)
    }
    for (const [guideId, texts] of byGuide) await fn(guideId, texts)
  }

  searchIndex() {
    return searchIndexFor(this.full)
  }
}

export class ShardSource implements BodySource {
  private search: Promise<MiniSearch<SearchDoc>> | null = null
  private reelById: Map<string, ContentIndex['reels'][number]> | null = null

  constructor(
    private readonly index: () => ContentIndex,
    readonly reader: ShardReader,
    private readonly dir: string,
    private readonly manifest: Manifest,
  ) {}

  async unit(id: string) {
    const meta = this.index().units.get(id)
    if (!meta) return null
    return (await this.reader.chapter(meta.guideId, meta.chapterId)).units.find((u) => u.id === id) ?? null
  }

  async units(ids: readonly string[]) {
    const { units } = this.index()
    const byChapter = new Map<string, { guideId: string; ids: Set<string> }>()
    for (const id of ids) {
      const meta = units.get(id)
      if (!meta) continue
      const entry = byChapter.get(meta.chapterId)
      if (entry) entry.ids.add(id)
      else byChapter.set(meta.chapterId, { guideId: meta.guideId, ids: new Set([id]) })
    }
    const sections = await Promise.all([...byChapter].map(async ([chapterId, e]) => (await this.reader.chapter(e.guideId, chapterId)).units.filter((u) => e.ids.has(u.id))))
    const found = new Map(sections.flat().map((u) => [u.id, u]))
    // in the order asked for
    return new Map(ids.flatMap((id) => (found.has(id) ? [[id, found.get(id)!] as const] : [])))
  }

  async chapterUnits(chapterId: string) {
    const chapter = this.index().chapters.get(chapterId)
    return chapter ? (await this.reader.chapter(chapter.guideId, chapterId)).units : []
  }

  async reels(ids: readonly string[]) {
    const byId = (this.reelById ??= new Map(this.index().reels.map((r) => [r.id, r])))
    const byChapter = new Map<string, { guideId: string; ids: Set<string> }>()
    for (const id of ids) {
      const meta = byId.get(id)
      if (!meta) continue
      const entry = byChapter.get(meta.chapterId)
      if (entry) entry.ids.add(id)
      else byChapter.set(meta.chapterId, { guideId: meta.guideId, ids: new Set([id]) })
    }
    const sections = await Promise.all([...byChapter].map(async ([chapterId, e]) => (await this.reader.chapter(e.guideId, chapterId)).reels.filter((r) => e.ids.has(r.id))))
    return new Map(sections.flat().map((r) => [r.id, r]))
  }

  async chapterReels(chapterId: string) {
    const chapter = this.index().chapters.get(chapterId)
    return chapter ? (await this.reader.chapter(chapter.guideId, chapterId)).reels : []
  }

  async placementUnit(id: string) {
    const meta = this.index().placementUnits.get(id)
    if (!meta) return null
    return (await this.reader.placement(meta.guideId)).find((u) => u.id === id) ?? null
  }

  async forEachGuideText(fn: (guideId: string, texts: ReadonlyMap<string, string>) => void | Promise<void>) {
    for (const guide of this.index().guides) await fn(guide.id, new Map(await this.reader.text(guide.id)))
  }

  searchIndex() {
    return (this.search ??= this.loadSearch().catch((error: unknown) => {
      this.search = null
      throw error
    }))
  }

  private async loadSearch(): Promise<MiniSearch<SearchDoc>> {
    const file = this.manifest.shards?.search?.file
    if (!file) throw new Error('The snapshot has no search index (pnpm content:snapshot without --no-search)')
    const search = loadSearchIndex(brotliDecompressSync(await readFile(path.join(this.dir, file))).toString('utf8'))
    return search
  }
}

import { createHash } from 'node:crypto'
import { open, readFile, stat, type FileHandle } from 'node:fs/promises'
import path from 'node:path'
import { deserialize } from 'node:v8'
import { brotliDecompressSync } from 'node:zlib'
import type { VaultConfig } from '../config'
import { LinkIndex } from '../links'
import { ByteLru, budgetFromEnv } from '../lru'
import type { LearningUnit } from '../model'
import type { Reel } from '../parse/reels'
import type { VaultFile } from '../sources/vault-fs'
import type { ContentIndex, Manifest } from '../store'
import { SHARDS_FORMAT, type GuideSections, type ShardIndex } from './format'

// Reads the sections of the per-guide packs (docs/fullstack/stage1/01-storage.md §3, §4): one positioned read, brotli
// and JSON.parse per section, a byte-budget LRU over the decoded sections and one promise per section in flight.

export interface ChapterSection {
  units: LearningUnit[]
  reels: Reel[]
}

export interface ShardStats {
  decodes: number
  hits: number
  bytes: number
  budget: number
  sections: number
  evictions: number
  oversize: number
}

export class ShardReader {
  readonly cache: ByteLru<unknown>
  private readonly handles = new Map<string, Promise<FileHandle>>()
  private readonly inflight = new Map<string, Promise<unknown>>()
  private decodes = 0
  private hits = 0
  private oversize = 0

  constructor(
    private readonly dir: string,
    private readonly sections: Readonly<Record<string, GuideSections>>,
    budget = budgetFromEnv('CONTENT_CACHE_MB', 24),
  ) {
    this.cache = new ByteLru(budget)
  }

  stats(): ShardStats {
    return { decodes: this.decodes, hits: this.hits, bytes: this.cache.bytes, budget: this.cache.budget, sections: this.cache.size, evictions: this.cache.evictions, oversize: this.oversize }
  }

  private handle(guideId: string): Promise<FileHandle> {
    let handle = this.handles.get(guideId)
    if (!handle) {
      const pack = this.sections[guideId]?.pack
      if (!pack) return Promise.reject(new Error(`No shard for guide ${guideId}`))
      handle = open(path.join(this.dir, 'guides', pack), 'r')
      // a failed open is not kept
      handle.catch(() => this.handles.delete(guideId))
      this.handles.set(guideId, handle)
    }
    return handle
  }

  private async read<T>(guideId: string, [offset, length]: readonly [number, number]): Promise<{ value: T; cost: number }> {
    const file = await this.handle(guideId)
    const buffer = Buffer.allocUnsafe(length)
    const { bytesRead } = await file.read(buffer, 0, length, offset)
    if (bytesRead !== length) throw new Error(`Short read in the pack of ${guideId}`)
    const json = brotliDecompressSync(buffer)
    this.decodes++
    return { value: JSON.parse(json.toString('utf8')) as T, cost: json.length * 2 }
  }

  // bypassCache: read the section without keeping it (the cron's texts)
  private async section<T>(guideId: string, name: string, range: readonly [number, number] | null | undefined, empty: T, bypassCache = false): Promise<T> {
    if (!range) return empty
    const key = `${guideId}|${name}`
    if (!bypassCache) {
      const hit = this.cache.get(key)
      if (hit !== undefined) {
        this.hits++
        return hit as T
      }
    }
    const pending = this.inflight.get(key)
    if (pending) return pending as Promise<T>
    const task = this.read<T>(guideId, range).then(({ value, cost }) => {
      if (!bypassCache && !this.cache.set(key, value, cost)) {
        this.oversize++
        console.warn(`[content] section ${key} (${(cost / 1e6).toFixed(1)} MB) is larger than CONTENT_CACHE_MB: served without caching`)
      }
      return value
    })
    this.inflight.set(key, task)
    // removed on settle; a failed read is not cached
    const settle = () => this.inflight.delete(key)
    task.then(settle, settle)
    return task
  }

  chapter(guideId: string, chapterId: string): Promise<ChapterSection> {
    return this.section(guideId, `chapter:${chapterId}`, this.sections[guideId]?.chapters[chapterId], { units: [], reels: [] })
  }

  placement(guideId: string): Promise<LearningUnit[]> {
    return this.section(guideId, 'placement', this.sections[guideId]?.placement, [])
  }

  text(guideId: string): Promise<Array<[string, string]>> {
    return this.section(guideId, 'text', this.sections[guideId]?.text, [], true)
  }

  async close(): Promise<void> {
    const handles = [...this.handles.values()]
    this.handles.clear()
    this.cache.clear()
    await Promise.all(handles.map((h) => h.then((f) => f.close()).catch(() => {})))
  }
}

export interface LoadedShards {
  manifest: Manifest
  reader: ShardReader
  files: Map<string, VaultFile>
  // the index as the store serves it (config rebased on this server's vault)
  index: Omit<ContentIndex, 'version'>
}

export function shardsDir(config: VaultConfig): string {
  return path.join(config.vaultPath, '.snapshot')
}

// null: no usable shards (missing, another format / V8, a pack that does not match the manifest, a different vault
// listing) — the caller falls back to the monolith or to parsing.
export async function loadShards(config: VaultConfig, listingFingerprint: string, budget?: number): Promise<LoadedShards | null> {
  const dir = shardsDir(config)
  try {
    const manifest = JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8')) as Manifest
    if (!manifest.shards || manifest.shards.format !== SHARDS_FORMAT || manifest.fingerprint !== listingFingerprint || manifest.shards.v8 !== process.versions.v8) return null
    const raw = await readFile(path.join(dir, manifest.shards.index.file))
    const payload = deserialize(brotliDecompressSync(raw)) as ShardIndex
    if (payload.fingerprint !== listingFingerprint) return null
    // a pack that is not the one the index was written for would decode garbage: compare sizes (sha1 in the tests)
    for (const guide of manifest.shards.guides) {
      if ((await stat(path.join(dir, 'guides', guide.pack))).size !== guide.packBytes) return null
    }
    Object.setPrototypeOf(payload.links, LinkIndex.prototype)
    const files = new Map(payload.files.map((f) => [f.path, { ...f, absolute: path.join(config.vaultPath, ...f.path.split('/')) }]))
    return { manifest, reader: new ShardReader(dir, payload.sections, budget), files, index: indexOf(payload, config) }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') console.warn('[content] shards unreadable', error)
    return null
  }
}

function indexOf(payload: ShardIndex, config: VaultConfig): Omit<ContentIndex, 'version'> {
  const chapters = new Map(payload.chapters.map((c) => [c.id, c]))
  const units = new Map(payload.units.map((u) => [u.id, u]))
  const unitsByChapter = new Map<string, ContentIndex['units'] extends ReadonlyMap<string, infer M> ? M[] : never>()
  for (const unit of payload.units) {
    const list = unitsByChapter.get(unit.chapterId)
    if (list) list.push(unit)
    else unitsByChapter.set(unit.chapterId, [unit])
  }
  return {
    config,
    guides: payload.guides,
    guideById: new Map(payload.guides.map((g) => [g.id, g])),
    chapters,
    chapterByPath: new Map(payload.chapters.map((c) => [c.path, c])),
    units,
    unitsByChapter,
    reels: payload.reels,
    placementUnits: new Map(payload.placementUnits.map((u) => [u.id, u])),
    placementChapters: new Map(payload.placementChapters.map((c) => [c.id, c])),
    translations: payload.translations,
    backlinks: payload.backlinks,
    links: payload.links,
    issues: payload.issues,
    scanMs: 0,
    error: payload.error,
  }
}

export async function packSha1(dir: string, pack: string): Promise<string> {
  return createHash('sha1').update(await readFile(path.join(dir, 'guides', pack))).digest('hex')
}

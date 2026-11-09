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

const warned = new Set<string>()

// One log line per reason per process (the store asks again on every reload and every request that finds no build).
export function warnOnce(message: string): void {
  if (warned.has(message)) return
  warned.add(message)
  console.warn(message)
}

// (tests)
export function resetWarnings(): void {
  warned.clear()
}

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
  // guides whose pack does not match the manifest: the error is remembered, the pack is not read again
  private readonly bad = new Map<string, Error>()
  private readonly oversized = new Set<string>()
  private decodes = 0
  private hits = 0
  private oversize = 0

  // packs: guide id → the sha1 the manifest records for its pack; checked once, when the pack is first opened
  constructor(
    private readonly dir: string,
    private readonly sections: Readonly<Record<string, GuideSections>>,
    budget = budgetFromEnv('CONTENT_CACHE_MB', 24),
    private readonly packs: Readonly<Record<string, string>> = {},
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
      const known = this.bad.get(guideId)
      if (known) return Promise.reject(known)
      handle = this.openChecked(guideId, pack)
      // a failed open is not kept
      handle.catch(() => this.handles.delete(guideId))
      this.handles.set(guideId, handle)
    }
    return handle
  }

  // Opens a pack and, once, compares its bytes with the manifest: a pack of the right size but the wrong content (a
  // partial copy) would decode to garbage or to another chapter.
  private async openChecked(guideId: string, pack: string): Promise<FileHandle> {
    const file = await open(path.join(this.dir, 'guides', pack), 'r')
    const expected = this.packs[guideId]
    if (expected) {
      const actual = createHash('sha1').update(await file.readFile()).digest('hex')
      if (actual !== expected) {
        await file.close()
        const error = new Error(`The pack ${pack} does not match the manifest (sha1): redeploy, or set CONTENT_SHARDS=0`)
        this.bad.set(guideId, error)
        console.error(`[content] ${error.message}`)
        throw error
      }
    }
    return file
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
        if (!this.oversized.has(key)) {
          this.oversized.add(key)
          console.warn(`[content] section ${key} (${(cost / 1e6).toFixed(1)} MB) is larger than CONTENT_CACHE_MB: served without caching`)
        }
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

  // Waits for the reads in flight (a dev reload swaps the source while requests still read the old one), then closes.
  async close(): Promise<void> {
    await Promise.allSettled([...this.inflight.values()])
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

// `expected`: the fingerprint of the vault listing the build must have been made from; null — trust the build (a
// deployment ships only the files it traces, so its listing can't be compared with the build's).
// `reason`: why the shards can't be used — the caller logs it and falls back to the monolith or to parsing.
export async function loadShards(config: VaultConfig, expected: string | null, budget?: number): Promise<LoadedShards | { reason: string }> {
  const dir = shardsDir(config)
  try {
    const manifest = JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8')) as Manifest
    if (!manifest.shards) return { reason: 'the manifest has no shards (built without them)' }
    if (manifest.shards.format !== SHARDS_FORMAT) return { reason: `shards format ${manifest.shards.format}, this server reads ${SHARDS_FORMAT}` }
    if (manifest.shards.v8 !== process.versions.v8) return { reason: `built with V8 ${manifest.shards.v8}, this server runs ${process.versions.v8}` }
    if (expected !== null && manifest.fingerprint !== expected) return { reason: 'the vault listing differs from the build (content changed since pnpm content:snapshot)' }
    const raw = await readFile(path.join(dir, manifest.shards.index.file))
    const payload = deserialize(brotliDecompressSync(raw)) as ShardIndex
    if (payload.fingerprint !== manifest.fingerprint) return { reason: 'index.v8.br and manifest.json come from different builds' }
    // a pack that is not the one the index was written for would decode garbage: sizes now, sha1 when a pack is opened
    for (const guide of manifest.shards.guides) {
      const size = (await stat(path.join(dir, 'guides', guide.pack))).size
      if (size !== guide.packBytes) return { reason: `pack ${guide.pack} is ${size} bytes, the manifest says ${guide.packBytes}` }
    }
    Object.setPrototypeOf(payload.links, LinkIndex.prototype)
    const files = new Map(payload.files.map((f) => [f.path, { ...f, absolute: path.join(config.vaultPath, ...f.path.split('/')) }]))
    const packs = Object.fromEntries(manifest.shards.guides.map((g) => [g.id, g.sha1]))
    return { manifest, reader: new ShardReader(dir, payload.sections, budget, packs), files, index: indexOf(payload, config) }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { reason: `${path.relative(process.cwd(), (error as NodeJS.ErrnoException).path ?? dir)} is missing (pnpm content:snapshot)` }
    return { reason: `unreadable: ${error instanceof Error ? error.message : String(error)}` }
  }
}

// v8.deserialize makes a new string for every value: 23k unit rows would hold 23k copies of the same guide and chapter
// id. The repeated strings are shared instead (the heap of the index drops by a third).
function intern(payload: ShardIndex): void {
  const pool = new Map<string, string>()
  const share = <T extends string>(value: T): T => {
    const known = pool.get(value)
    if (known !== undefined) return known as T
    pool.set(value, value)
    return value
  }
  for (const list of [payload.units, payload.placementUnits]) {
    for (const meta of list) {
      meta.guideId = share(meta.guideId)
      meta.chapterId = share(meta.chapterId)
      if (meta.level) meta.level = share(meta.level)
      if (meta.lang) meta.lang = share(meta.lang)
      if (meta.kind === 'flashcard') {
        if (meta.frequency) meta.frequency = share(meta.frequency)
        if (meta.qtype) meta.qtype = share(meta.qtype)
      }
    }
  }
  for (const reel of payload.reels) {
    reel.guideId = share(reel.guideId)
    reel.chapterId = share(reel.chapterId)
  }
  for (const chapter of [...payload.chapters, ...payload.placementChapters]) chapter.guideId = share(chapter.guideId)
}

function indexOf(payload: ShardIndex, config: VaultConfig): Omit<ContentIndex, 'version'> {
  intern(payload)
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

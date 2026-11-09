import { createHash } from 'node:crypto'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { serialize } from 'node:v8'
import { brotliCompressSync, constants as zlibConstants } from 'node:zlib'
import type { VaultConfig } from '../config'
import { exportSearchIndex } from '../search'
import { listVault } from '../sources/vault-fs'
import { buildUnitsSync, encodePrebuilt, listingFingerprint, loadSnapshot, toIndex, type FullSnapshot, type Manifest, type ShardManifest } from '../store'
import { SHARDS_FORMAT, type GuideSections, type Range, type ShardIndex } from './format'

// Build time (pnpm content:snapshot): writes `<vault>/.snapshot/` — the shards, the search index, the unit rows, the
// manifest and, as the rollback of CONTENT_SHARDS=0, the old monolithic guides.v8.br.

const quality = (q: number) => ({ params: { [zlibConstants.BROTLI_PARAM_QUALITY]: q } })
const sha1 = (data: Buffer) => createHash('sha1').update(data).digest('hex')

// A pack is the sections one after the other; the index holds their offsets.
class PackWriter {
  private readonly parts: Buffer[] = []
  private size = 0
  add(value: unknown): Range {
    const data = brotliCompressSync(Buffer.from(JSON.stringify(value)), quality(5))
    const range: Range = [this.size, data.length]
    this.parts.push(data)
    this.size += data.length
    return range
  }
  get buffer(): Buffer {
    return Buffer.concat(this.parts)
  }
}

// Pack file names come from guide ids (slugs); keep them safe on any file system.
export const packName = (guideId: string) => `${guideId.replace(/[^a-zA-Z0-9._-]/g, '_')}.pack`

export interface BuiltSnapshotDir {
  files: Array<{ name: string; data: Buffer }>
  manifest: Manifest
  snapshot: FullSnapshot
}

export interface BuildOptions {
  // also write the old monolithic guides.v8.br — the rollback of CONTENT_SHARDS=0 (default: yes)
  legacy?: boolean
  // the prebuilt search index (default: yes)
  search?: boolean
}

// Parses the vault once and returns every file of `.snapshot/`.
export async function buildSnapshotDir(config: VaultConfig, opts: BuildOptions = {}): Promise<BuiltSnapshotDir> {
  const listing = await listVault(config.vaultPath, config.guidesDir)
  const full = await loadSnapshot(config, new Map(), 1, listing)
  const fingerprint = listingFingerprint(listing)
  const index = toIndex(full)
  const files: BuiltSnapshotDir['files'] = []
  const sections: Record<string, GuideSections> = {}
  const guideInfo: ShardManifest['guides'] = []
  const chaptersOf = groupBy(full.chapters.values(), (c) => c.guideId)
  const reelsOf = groupBy(full.reels, (r) => r.chapterId)
  const bankOf = groupBy(full.placementUnits.values(), (u) => u.guideId)
  for (const guide of full.guides) {
    const pack = new PackWriter()
    const chapters: Record<string, Range> = {}
    let unitCount = 0
    let reelCount = 0
    const text: Array<[string, string]> = []
    for (const chapter of chaptersOf.get(guide.id) ?? []) {
      const units = full.unitsByChapter.get(chapter.id) ?? []
      const reels = reelsOf.get(chapter.id) ?? []
      if (units.length > 0 || reels.length > 0) chapters[chapter.id] = pack.add({ units, reels })
      unitCount += units.length
      reelCount += reels.length
      const plain = full.plainText.get(chapter.id)
      if (plain !== undefined) text.push([chapter.id, plain])
    }
    const bank = bankOf.get(guide.id) ?? []
    const placement = bank.length > 0 ? pack.add(bank) : null
    const name = packName(guide.id)
    sections[guide.id] = { pack: name, chapters, placement, text: pack.add(text) }
    const data = pack.buffer
    files.push({ name: `guides/${name}`, data })
    guideInfo.push({ id: guide.id, pack: name, packBytes: data.length, sha1: sha1(data), chapters: chaptersOf.get(guide.id)?.length ?? 0, units: unitCount, placement: bank.length, reels: reelCount })
  }
  const payload: ShardIndex = {
    format: SHARDS_FORMAT,
    v8: process.versions.v8,
    fingerprint,
    guides: full.guides,
    chapters: [...full.chapters.values()],
    placementChapters: [...full.placementChapters.values()],
    units: [...index.units.values()],
    placementUnits: [...index.placementUnits.values()],
    reels: [...index.reels],
    translations: full.translations,
    backlinks: full.backlinks,
    links: full.links,
    issues: full.issues,
    error: full.error,
    files: listing.files,
    sections,
  }
  const indexData = brotliCompressSync(serialize(payload), quality(5))
  files.push({ name: 'index.v8.br', data: indexData })
  let search: ShardManifest['search'] = null
  if (opts.search !== false) {
    const data = brotliCompressSync(Buffer.from(exportSearchIndex(full)), quality(4))
    files.push({ name: 'search.json.br', data })
    search = { file: 'search.json.br', bytes: data.length }
  }
  if (opts.legacy !== false) files.push({ name: 'guides.v8.br', data: encodePrebuilt(full, listing.files, fingerprint) })
  const sync = buildUnitsSync(full, fingerprint)
  files.push({ name: 'units-sync.json.br', data: sync.data })
  const manifest: Manifest = {
    ...sync.manifest,
    shards: {
      format: SHARDS_FORMAT,
      v8: process.versions.v8,
      node: process.version,
      index: { file: 'index.v8.br', bytes: indexData.length },
      search,
      guides: guideInfo,
      totals: { guides: full.guides.length, chapters: full.chapters.size, units: full.units.size, placement: full.placementUnits.size, reels: full.reels.length },
    },
  }
  files.push({ name: 'manifest.json', data: Buffer.from(JSON.stringify(manifest, null, 2)) })
  return { files, manifest, snapshot: full }
}

// Writes the files to `<vault>/.snapshot.tmp/` and swaps the directory in, so a reader never sees half a build.
export async function writeSnapshotDir(config: VaultConfig, built: BuiltSnapshotDir): Promise<string> {
  const target = path.join(config.vaultPath, '.snapshot')
  const tmp = `${target}.tmp`
  await rm(tmp, { recursive: true, force: true })
  await mkdir(path.join(tmp, 'guides'), { recursive: true })
  await Promise.all(built.files.map((f) => writeFile(path.join(tmp, f.name), f.data)))
  await rm(target, { recursive: true, force: true })
  await rename(tmp, target)
  return target
}

function groupBy<T>(items: Iterable<T>, key: (item: T) => string): Map<string, T[]> {
  const out = new Map<string, T[]>()
  for (const item of items) {
    const k = key(item)
    const list = out.get(k)
    if (list) list.push(item)
    else out.set(k, [item])
  }
  return out
}

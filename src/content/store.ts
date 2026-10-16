import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { deserialize, serialize } from 'node:v8'
import { brotliCompressSync, brotliDecompressSync, constants as zlibConstants } from 'node:zlib'
import type { Root } from 'mdast'
import { unitCalloutTypes } from './blocks/registry'
import { defaultVaultConfig, type VaultConfig } from './config'
import { buildGuide, chapterIdFor, guideIdFor, pickIndex, type ParsedFile } from './discover/guide'
import { LinkIndex } from './links'
import type { Chapter, ContentIssue, Guide, Heading, LearningUnit } from './model'
import { extractFile, QA_FILE, type ExtractResult } from './parse/extract'
import { parseMarkdown } from './parse/markdown'
import { collectReels, REEL_TYPES, type Reel } from './parse/reels'
import { scanFile } from './parse/scan'
import { jsonUnits, parseQuestionsJson } from './sources/questions-json'
import { listVault, readText, type VaultFile, type VaultListing } from './sources/vault-fs'

export interface ContentSnapshot {
  version: number
  config: VaultConfig
  guides: Guide[]
  guideById: Map<string, Guide>
  chapters: Map<string, Chapter>
  chapterByPath: Map<string, Chapter>
  plainText: Map<string, string>
  units: Map<string, LearningUnit>
  unitsByChapter: Map<string, LearningUnit[]>
  reels: Reel[]
  // placement-test bank (`<Guide>/_placement/*.md`): graded and rendered only by the placement test, never part of
  // guides, search, practice or article checks (docs/LANGUAGE_COURSE.md «Банк вступного тесту»)
  placementUnits: Map<string, LearningUnit>
  placementChapters: Map<string, Chapter>
  backlinks: Map<string, string[]>
  links: LinkIndex
  issues: ContentIssue[]
  scanMs: number
  error: string | null
}

interface CacheEntry {
  mtimeMs: number
  guideId: string
  parsed: ParsedFile
}

export interface ChangeEvent {
  version: number
  paths: string[]
}

type Listener = (event: ChangeEvent) => void

const UNIT_TYPES = unitCalloutTypes()
// Files with reels need a full parse too, so the feed can pick them up.
const SCAN_TYPES = new Set([...UNIT_TYPES, ...REEL_TYPES])

function fullParse(source: string, file: VaultFile, guideId: string, chapterId: string): ExtractResult {
  const { root, meta } = parseMarkdown(source)
  return extractFile({ root, meta, guideId, chapterId, path: file.path, fileName: file.name })
}

async function parseFile(file: VaultFile, guideId: string, cache: Map<string, CacheEntry>): Promise<ParsedFile> {
  const hit = cache.get(file.path)
  if (hit && hit.mtimeMs === file.mtimeMs && hit.guideId === guideId) return hit.parsed
  const source = await readText(file.absolute)
  const info = scanFile(source, SCAN_TYPES)
  const chapterId = chapterIdFor(guideId, file, info.meta)
  const needsFull = info.hasUnitCallouts || info.meta.kind === 'qa' || QA_FILE.test(file.name)
  const full = needsFull ? fullParse(source, file, guideId, chapterId) : null
  const issues: ContentIssue[] = full ? [...full.issues] : []
  if (info.metaError) issues.push({ severity: 'error', code: 'parse-error', path: file.path, message: `Frontmatter: ${info.metaError}` })
  const parsed: ParsedFile = { file, meta: info.meta, info, full, chapterId, issues }
  cache.set(file.path, { mtimeMs: file.mtimeMs, guideId, parsed })
  return parsed
}

export interface ChapterDocument {
  chapter: Chapter
  root: Root
  headings: Heading[]
}

async function readIndexSlug(file: VaultFile | null): Promise<string | null> {
  if (!file) return null
  return scanFile(await readText(file.absolute), UNIT_TYPES).meta.slug ?? null
}

export async function loadSnapshot(config: VaultConfig, cache: Map<string, CacheEntry>, version: number, listed?: VaultListing): Promise<ContentSnapshot> {
  const started = performance.now()
  const listing = listed ?? (await listVault(config.vaultPath, config.guidesDir))
  const issues: ContentIssue[] = []
  const guideFiles = new Map<string, VaultFile[]>()
  for (const file of listing.files) {
    const list = guideFiles.get(file.guideDir)
    if (list) list.push(file)
    else guideFiles.set(file.guideDir, [file])
  }
  const mdPaths = listing.files.filter((f) => f.ext === '.md').map((f) => f.path)
  const links = new LinkIndex(listing.notes, mdPaths)
  const seenPaths = new Set(listing.files.map((f) => f.path))
  for (const key of cache.keys()) if (!seenPaths.has(key)) cache.delete(key)

  const guides: Guide[] = []
  const chapters = new Map<string, Chapter>()
  const plainText = new Map<string, string>()
  const units = new Map<string, LearningUnit>()
  const usedGuideIds = new Set<string>()
  const reels: Reel[] = []
  const placementUnits = new Map<string, LearningUnit>()
  const placementChapters = new Map<string, Chapter>()

  for (const dir of listing.guideDirs) {
    const files = guideFiles.get(dir) ?? []
    const md = files.filter((f) => f.ext === '.md')
    if (md.length === 0 && !files.some((f) => f.ext === '.json')) continue
    const indexFile = pickIndex(dir, md)
    const indexSlug = await readIndexSlug(indexFile)
    let guideId = guideIdFor(dir, indexSlug ? { tags: [], prerequisites: [], slug: indexSlug } : null)
    while (usedGuideIds.has(guideId)) guideId = `${guideId}-2`
    usedGuideIds.add(guideId)
    const parsed = await Promise.all(md.map((f) => parseFile(f, guideId, cache)))
    const built = buildGuide(dir, parsed, links, guideId)
    const guideUnits = [...built.units]
    issues.push(...built.issues)
    const existing = new Set(guideUnits.map((u) => u.id))
    for (const jsonFile of files.filter((f) => f.ext === '.json' && path.basename(f.path).toLowerCase() === 'questions.json')) {
      const { entries, error } = parseQuestionsJson(await readText(jsonFile.absolute))
      if (error) {
        issues.push({ severity: 'error', code: 'parse-error', path: jsonFile.path, message: error })
        continue
      }
      const fallback = built.guide.indexChapterId ?? built.guide.chapterIds[0]
      if (!fallback) continue
      const result = jsonUnits(entries, guideId, built.chapters, existing, fallback, jsonFile.path)
      for (const unit of result.units) {
        existing.add(unit.id)
        guideUnits.push(unit)
        const chapter = built.chapters.find((c) => c.id === unit.chapterId)
        chapter?.unitIds.push(unit.id)
      }
      issues.push(...result.issues)
    }
    for (const unit of guideUnits) {
      if (units.has(unit.id)) {
        const other = units.get(unit.id)!
        issues.push({ severity: 'error', code: 'duplicate-id', path: unit.chapterId, message: `Дублікат id ${unit.id} (також у ${other.chapterId})` })
        let n = 2
        while (units.has(`${unit.id}~${n}`)) n++
        const chapter = built.chapters.find((c) => c.id === unit.chapterId)
        const renamed = `${unit.id}~${n}`
        if (chapter) chapter.unitIds = chapter.unitIds.map((id) => (id === unit.id ? renamed : id))
        unit.id = renamed
      }
      units.set(unit.id, unit)
    }
    for (const chapter of built.chapters) chapters.set(chapter.id, chapter)
    for (const chapter of built.placement.chapters) placementChapters.set(chapter.id, chapter)
    for (const unit of built.placement.units) {
      if (placementUnits.has(unit.id)) {
        issues.push({ severity: 'error', code: 'duplicate-id', path: unit.chapterId, message: `Дублікат id ${unit.id} у банку вступного тесту (також у ${placementUnits.get(unit.id)!.chapterId})` })
        continue
      }
      placementUnits.set(unit.id, unit)
    }
    for (const p of parsed) {
      if (placementChapters.has(p.chapterId)) continue
      plainText.set(p.chapterId, p.info.plainText)
      if (p.full) reels.push(...collectReels(p.full.root, guideId, p.chapterId))
    }
    guides.push(built.guide)
  }

  for (const unit of placementUnits.values()) {
    if (units.has(unit.id)) issues.push({ severity: 'error', code: 'duplicate-id', path: unit.chapterId, message: `Дублікат id ${unit.id}: є і в банку вступного тесту, і в статті ${units.get(unit.id)!.chapterId}` })
  }
  guides.sort((a, b) => (a.order === b.order ? a.title.localeCompare(b.title, 'uk') : a.order - b.order))
  const chapterByPath = new Map([...chapters.values()].map((c) => [c.path, c]))
  const unitsByChapter = new Map<string, LearningUnit[]>()
  for (const unit of units.values()) {
    const list = unitsByChapter.get(unit.chapterId)
    if (list) list.push(unit)
    else unitsByChapter.set(unit.chapterId, [unit])
  }
  const backlinks = new Map<string, string[]>()
  for (const chapter of chapters.values()) {
    for (const target of chapter.outgoingLinks) {
      const targetChapter = chapterByPath.get(target)
      if (!targetChapter || targetChapter.id === chapter.id) continue
      const list = backlinks.get(targetChapter.id)
      if (list) {
        if (!list.includes(chapter.id)) list.push(chapter.id)
      } else backlinks.set(targetChapter.id, [chapter.id])
    }
  }
  const missingIds = issues.filter((i) => i.code === 'missing-id').length
  if (missingIds > 0 && process.env.NODE_ENV !== 'test') {
    console.warn(`[content] ${missingIds} навчальних одиниць без явного id — використано детермінований хеш`)
  }
  return {
    version,
    config,
    guides,
    guideById: new Map(guides.map((g) => [g.id, g])),
    chapters,
    chapterByPath,
    plainText,
    units,
    unitsByChapter,
    reels,
    placementUnits,
    placementChapters,
    backlinks,
    links,
    issues,
    scanMs: Math.round(performance.now() - started),
    error: listing.guideDirs.length === 0 ? `Папку ${config.guidesDir}/ не знайдено у ${config.vaultPath}` : null,
  }
}

// ── Prebuilt snapshot (docs/PERFORMANCE.md) ───────────────────────────────────────────────────────────────────
// Parsing the vault takes seconds; a deployment's content never changes after its build, so the build stores the
// parsed snapshot (pnpm content:snapshot → <vault>/.snapshot/guides.v8.br, v8-serialized + brotli) and a cold server
// loads it in a few hundred ms. It is only used when the listing (paths + sizes) and the Node/V8 version match.

const PREBUILT_FORMAT = 2

interface Prebuilt {
  format: number
  v8: string
  fingerprint: string
  snapshot: ContentSnapshot
  files: VaultFile[]
}

export function prebuiltPath(config: VaultConfig): string {
  return path.join(config.vaultPath, '.snapshot', 'guides.v8.br')
}

export function listingFingerprint(listing: VaultListing): string {
  const hash = createHash('sha1')
  hash.update(`${PREBUILT_FORMAT}\n`)
  for (const f of listing.files) hash.update(`${f.path}:${f.size}\n`)
  hash.update(listing.guideDirs.join('|'))
  hash.update(listing.notes.join('|'))
  return hash.digest('hex')
}

// Build time: parse the vault and serialize the snapshot together with the guide files it was built from.
export async function buildPrebuilt(config: VaultConfig): Promise<{ data: Buffer; snapshot: ContentSnapshot }> {
  const listing = await listVault(config.vaultPath, config.guidesDir)
  const snapshot = await loadSnapshot(config, new Map(), 1, listing)
  const payload: Prebuilt = { format: PREBUILT_FORMAT, v8: process.versions.v8, fingerprint: listingFingerprint(listing), snapshot, files: listing.files }
  const data = brotliCompressSync(serialize(payload), { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 } })
  return { data, snapshot }
}

async function loadPrebuilt(file: string, config: VaultConfig, listing: VaultListing): Promise<{ snapshot: ContentSnapshot; files: Map<string, VaultFile> } | null> {
  let raw: Buffer
  try {
    raw = await readFile(file)
  } catch {
    return null
  }
  try {
    const payload = deserialize(brotliDecompressSync(raw)) as Prebuilt
    if (payload.format !== PREBUILT_FORMAT || payload.v8 !== process.versions.v8 || payload.fingerprint !== listingFingerprint(listing)) return null
    const { snapshot } = payload
    // the snapshot was built elsewhere (another absolute path): rebase it on this server's vault
    snapshot.config = config
    Object.setPrototypeOf(snapshot.links, LinkIndex.prototype)
    const files = new Map(payload.files.map((f) => [f.path, { ...f, absolute: path.join(config.vaultPath, ...f.path.split('/')) }]))
    return { snapshot, files }
  } catch (error) {
    console.warn('[content] prebuilt snapshot unreadable, parsing the vault', error)
    return null
  }
}

export class ContentStore {
  private config: VaultConfig
  private readonly cache = new Map<string, CacheEntry>()
  private readonly documents = new Map<string, { mtimeMs: number; result: ExtractResult }>()
  private snapshot: ContentSnapshot | null = null
  private loading: Promise<ContentSnapshot> | null = null
  private version = 0
  private readonly listeners = new Set<Listener>()
  private stopWatch: (() => Promise<void>) | null = null
  private pending = new Set<string>()
  private timer: ReturnType<typeof setTimeout> | null = null
  // guide files of a prebuilt snapshot (documents are parsed from them on demand)
  private prebuiltFiles: Map<string, VaultFile> | null = null

  // `prebuilt`: a snapshot file to try on the first load (deployments; see buildPrebuilt)
  constructor(
    config: VaultConfig,
    private readonly watch: boolean,
    private readonly prebuilt: string | null = null,
  ) {
    this.config = config
  }

  getConfig(): VaultConfig {
    return this.config
  }

  async document(chapterId: string): Promise<ChapterDocument | null> {
    const snapshot = await this.get()
    const chapter = snapshot.chapters.get(chapterId)
    if (!chapter) return null
    const entry = this.cache.get(chapter.path)
    if (entry?.parsed.full) return { chapter, root: entry.parsed.full.root, headings: entry.parsed.full.headings }
    const cached = this.documents.get(chapter.path)
    if (cached && cached.mtimeMs === chapter.mtimeMs) {
      this.documents.delete(chapter.path)
      this.documents.set(chapter.path, cached)
      return { chapter, root: cached.result.root, headings: cached.result.headings }
    }
    const file = entry?.parsed.file ?? this.prebuiltFiles?.get(chapter.path)
    if (!file) return null
    const result = fullParse(await readText(file.absolute), file, chapter.guideId, chapter.id)
    this.documents.set(chapter.path, { mtimeMs: chapter.mtimeMs, result })
    while (this.documents.size > 80) {
      const oldest = this.documents.keys().next().value
      if (oldest === undefined) break
      this.documents.delete(oldest)
    }
    return { chapter, root: result.root, headings: result.headings }
  }

  async get(): Promise<ContentSnapshot> {
    if (this.snapshot) return this.snapshot
    if (!this.loading) this.loading = this.reload([])
    return this.loading
  }

  async setConfig(config: VaultConfig): Promise<ContentSnapshot> {
    if (config.vaultPath === this.config.vaultPath && config.guidesDir === this.config.guidesDir && this.snapshot) return this.snapshot
    this.config = config
    this.cache.clear()
    this.documents.clear()
    await this.stopWatch?.()
    this.stopWatch = null
    this.snapshot = null
    this.loading = this.reload(['*'])
    return this.loading
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private async reload(paths: string[]): Promise<ContentSnapshot> {
    const snapshot = (await this.fromPrebuilt(paths)) ?? (await loadSnapshot(this.config, this.cache, ++this.version))
    this.snapshot = snapshot
    this.loading = null
    if (this.watch && !this.stopWatch) await this.startWatch()
    if (paths.length > 0) for (const l of this.listeners) l({ version: snapshot.version, paths })
    return snapshot
  }

  private async fromPrebuilt(paths: string[]): Promise<ContentSnapshot | null> {
    if (!this.prebuilt || paths.length > 0 || this.version > 0) return null
    const started = performance.now()
    const listing = await listVault(this.config.vaultPath, this.config.guidesDir)
    const hit = await loadPrebuilt(this.prebuilt, this.config, listing)
    if (!hit) return null
    this.prebuiltFiles = hit.files
    return { ...hit.snapshot, version: ++this.version, scanMs: Math.round(performance.now() - started) }
  }

  private async startWatch(): Promise<void> {
    const root = path.join(this.config.vaultPath, this.config.guidesDir)
    const { watch } = await import('chokidar')
    const watcher = watch(root, {
      ignoreInitial: true,
      ignored: (p: string) => path.basename(p).startsWith('.'),
      awaitWriteFinish: { stabilityThreshold: 120, pollInterval: 40 },
    })
    watcher.on('all', (_event, changed) => {
      const rel = path.relative(this.config.vaultPath, changed).split(path.sep).join('/')
      this.pending.add(rel)
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        const paths = [...this.pending]
        this.pending.clear()
        for (const p of paths) {
          this.cache.delete(p)
          this.documents.delete(p)
        }
        this.loading = this.reload(paths)
      }, 80)
    })
    this.stopWatch = () => watcher.close()
  }
}

const globalKey = Symbol.for('interview-prep.content-store')
type GlobalWithStore = typeof globalThis & { [globalKey]?: ContentStore }

export function getContentStore(): ContentStore {
  const g = globalThis as GlobalWithStore
  if (!g[globalKey]) {
    const config = defaultVaultConfig()
    const watch = process.env.CONTENT_WATCH !== '0' && !process.env.VERCEL
    // deployments (and CONTENT_SNAPSHOT=1 locally) start from the build's parsed snapshot when it matches the vault
    const prebuilt = !watch && (process.env.VERCEL || process.env.CONTENT_SNAPSHOT === '1') ? prebuiltPath(config) : null
    g[globalKey] = new ContentStore(config, watch, prebuilt)
  }
  return g[globalKey]
}

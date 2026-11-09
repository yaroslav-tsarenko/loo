import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { deserialize, serialize } from 'node:v8'
import { brotliCompressSync, brotliDecompressSync, constants as zlibConstants } from 'node:zlib'
import type { Root } from 'mdast'
import { unitCalloutTypes } from './blocks/registry'
import { defaultVaultConfig, type VaultConfig } from './config'
import { buildGuide, chapterIdFor, guideIdFor, pickIndex, type ParsedFile } from './discover/guide'
import { titleFrom } from './discover/names'
import { isI18nFile, lockPathFor, translationLang, type TranslationInfo } from './i18n/files'
import { localizeDocument, type LocalizedDocument } from './i18n/localize'
import type MiniSearch from 'minisearch'
import { LinkIndex } from './links'
import { ByteLru, budgetFromEnv } from './lru'
import { loadShards, shardsDir, type ShardStats } from './shards/read'
import { MemorySource, ShardSource, type BodySource } from './shards/source'
import type { SearchDoc, SearchSource } from './search'
import { decodeUnitsSync, encodeUnitsSync, rowOfMeta, unitRow, unitsFingerprint, type UnitRow } from './units-rows'
import type { Chapter, ContentIssue, Guide, Heading, LearningUnit, ReelMeta, UnitMeta } from './model'
import { extractFile, QA_FILE, type ExtractResult } from './parse/extract'
import { parseMarkdown } from './parse/markdown'
import { collectReels, REEL_TYPES, type Reel } from './parse/reels'
import { scanFile } from './parse/scan'
import { unitMeta } from './unit-meta'
import { jsonUnits, parseQuestionsJson } from './sources/questions-json'
import { listVault, readText, type VaultFile, type VaultListing } from './sources/vault-fs'

// The full parse of the vault: every unit and reel with its body, plus the plain text of every chapter. Build scripts
// and the dev server work on it; the app reads the ContentIndex derived from it (bodies through the store's async API).
export interface FullSnapshot {
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
  // translations (`<Guide>/_i18n/<lang>/*.md`, docs/COURSE_FORMAT.md «Переклад курсів (i18n)»): source chapter id →
  // language → the translation's metadata. Never chapters, units, search, feed or links — the bodies are parsed on
  // demand (ContentStore.localizedDocument) and merged into the source structure.
  translations: Map<string, Map<string, TranslationInfo>>
  backlinks: Map<string, string[]>
  links: LinkIndex
  issues: ContentIssue[]
  scanMs: number
  error: string | null
}

// What the app keeps resident: everything but the unit bodies. `units`, `unitsByChapter`, `placementUnits` and `reels`
// hold metadata only; bodies come from ContentStore.unit / units / chapterUnits / reels, text from forEachGuideText.
export interface ContentIndex extends Omit<FullSnapshot, 'plainText' | 'units' | 'unitsByChapter' | 'placementUnits' | 'reels'> {
  units: ReadonlyMap<string, UnitMeta>
  unitsByChapter: ReadonlyMap<string, readonly UnitMeta[]>
  placementUnits: ReadonlyMap<string, UnitMeta>
  reels: readonly ReelMeta[]
}

export type ContentSnapshot = ContentIndex

export function toIndex(full: FullSnapshot): ContentIndex {
  const meta = new Map([...full.units.values()].map((u) => [u.id, unitMeta(u)]))
  return {
    version: full.version,
    config: full.config,
    guides: full.guides,
    guideById: full.guideById,
    chapters: full.chapters,
    chapterByPath: full.chapterByPath,
    units: meta,
    unitsByChapter: new Map([...full.unitsByChapter].map(([chapterId, list]) => [chapterId, list.map((u) => meta.get(u.id)!)])),
    reels: full.reels.map(({ id, guideId, chapterId, sectionSlug, title }) => ({ id, guideId, chapterId, sectionSlug, title })),
    placementUnits: new Map([...full.placementUnits].map(([id, u]) => [id, unitMeta(u)])),
    placementChapters: full.placementChapters,
    translations: full.translations,
    backlinks: full.backlinks,
    links: full.links,
    issues: full.issues,
    scanMs: full.scanMs,
    error: full.error,
  }
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

// heap bytes per character of article source held by a parsed document (mdast with positions, headings, units);
// measured by pnpm content:measure (documents scenario)
const DOCUMENT_HEAP_FACTOR = Number(process.env.DOCUMENT_HEAP_FACTOR) || 12

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

export interface LocalizedChapterDocument extends ChapterDocument, Omit<LocalizedDocument, 'root' | 'headings'> {
  lang: string
  title: string
  // the chapter's reels in `lang`, by SOURCE reel id (matched by position — reel ids hash their title)
  reels: Map<string, Reel>
}

async function readIndexSlug(file: VaultFile | null): Promise<string | null> {
  if (!file) return null
  return scanFile(await readText(file.absolute), UNIT_TYPES).meta.slug ?? null
}

export async function loadSnapshot(config: VaultConfig, cache: Map<string, CacheEntry>, version: number, listed?: VaultListing): Promise<FullSnapshot> {
  const started = performance.now()
  const listing = listed ?? (await listVault(config.vaultPath, config.guidesDir))
  const issues: ContentIssue[] = []
  const guideFiles = new Map<string, VaultFile[]>()
  const i18nFiles: VaultFile[] = []
  const lockFiles = new Map<string, VaultFile>()
  for (const file of listing.files) {
    if (isI18nFile(file)) {
      if (file.ext === '.md') i18nFiles.push(file)
      else if (file.path.endsWith('.lock.json')) lockFiles.set(file.path, file)
      continue
    }
    const list = guideFiles.get(file.guideDir)
    if (list) list.push(file)
    else guideFiles.set(file.guideDir, [file])
  }
  // translations are not notes: a wiki-link by file name must keep resolving to the source topic
  const i18nPaths = new Set(listing.files.filter(isI18nFile).map((f) => f.path))
  const mdPaths = listing.files.filter((f) => f.ext === '.md' && !i18nPaths.has(f.path)).map((f) => f.path)
  const links = new LinkIndex(i18nPaths.size > 0 ? listing.notes.filter((n) => !i18nPaths.has(n)) : listing.notes, mdPaths)
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
  const translations = await loadTranslations(i18nFiles, lockFiles, chapters, chapterByPath, config.guidesDir, issues)
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
    translations,
    backlinks,
    links,
    issues,
    scanMs: Math.round(performance.now() - started),
    error: listing.guideDirs.length === 0 ? `Папку ${config.guidesDir}/ не знайдено у ${config.vaultPath}` : null,
  }
}

// A translation belongs to the source topic its frontmatter names (`source:`, else `id:`), or — without either — to
// the topic with the same file name next to `_i18n/`.
async function readLock(file: VaultFile | undefined, issues: ContentIssue[]): Promise<Record<string, string> | null> {
  if (!file) return null
  try {
    const data = JSON.parse(await readText(file.absolute)) as { segments?: unknown }
    if (!data.segments || typeof data.segments !== 'object' || Array.isArray(data.segments)) throw new Error('немає segments')
    return Object.fromEntries(Object.entries(data.segments as Record<string, unknown>).filter((e): e is [string, string] => typeof e[1] === 'string'))
  } catch (error) {
    issues.push({ severity: 'warning', code: 'i18n', path: file.path, message: `Lock не прочитано: ${error instanceof Error ? error.message : String(error)}` })
    return null
  }
}

async function loadTranslations(files: readonly VaultFile[], locks: ReadonlyMap<string, VaultFile>, chapters: Map<string, Chapter>, byPath: Map<string, Chapter>, guidesDir: string, issues: ContentIssue[]): Promise<Map<string, Map<string, TranslationInfo>>> {
  const out = new Map<string, Map<string, TranslationInfo>>()
  for (const file of files) {
    const lang = translationLang(file)
    if (!lang) {
      issues.push({ severity: 'warning', code: 'i18n', path: file.path, message: 'Переклад має лежати в _i18n/<мова>/<файл>.md' })
      continue
    }
    const info = scanFile(await readText(file.absolute), UNIT_TYPES)
    const ref = info.meta.source ?? info.meta.id
    const rest = file.relInGuide.split('/').slice(2).join('/')
    const chapter = (ref ? chapters.get(ref) : undefined) ?? byPath.get(`${guidesDir}/${file.guideDir}/${rest}`)
    if (!chapter) {
      issues.push({ severity: 'warning', code: 'i18n', path: file.path, message: `Переклад без джерела: теми «${ref ?? rest}» немає в посібнику` })
      continue
    }
    if (info.meta.lang && info.meta.lang !== lang) issues.push({ severity: 'warning', code: 'i18n', path: file.path, message: `lang: ${info.meta.lang}, а тека _i18n/${lang}/` })
    const perLang = out.get(chapter.id) ?? new Map<string, TranslationInfo>()
    if (perLang.has(lang)) {
      issues.push({ severity: 'warning', code: 'i18n', path: file.path, message: `Другий переклад ${lang} теми ${chapter.id} (перший — ${perLang.get(lang)!.path})` })
      continue
    }
    const lockFile = locks.get(lockPathFor(file.path))
    perLang.set(lang, {
      lang,
      lock: await readLock(lockFile, issues),
      lockMtimeMs: lockFile?.mtimeMs ?? 0,
      chapterId: chapter.id,
      path: file.path,
      file,
      title: info.meta.title ?? titleFrom(info.h1, file.name, file.guideDir),
      slug: info.meta.slug ?? null,
      description: info.meta.description ?? null,
      mtimeMs: file.mtimeMs,
    })
    out.set(chapter.id, perLang)
  }
  return out
}

// ── Prebuilt snapshot (docs/PERFORMANCE.md) ───────────────────────────────────────────────────────────────────
// Parsing the vault takes seconds; a deployment's content never changes after its build, so the build stores the
// parsed snapshot (pnpm content:snapshot → <vault>/.snapshot/guides.v8.br, v8-serialized + brotli) and a cold server
// loads it in a few hundred ms. It is only used when the listing (paths + sizes) and the Node/V8 version match.

const PREBUILT_FORMAT = 3

interface Prebuilt {
  format: number
  v8: string
  fingerprint: string
  snapshot: FullSnapshot
  files: VaultFile[]
}

export function prebuiltPath(config: VaultConfig): string {
  return path.join(config.vaultPath, '.snapshot', 'guides.v8.br')
}

export function manifestPath(config: VaultConfig): string {
  return path.join(config.vaultPath, '.snapshot', 'manifest.json')
}

export function unitsSyncPath(config: VaultConfig): string {
  return path.join(config.vaultPath, '.snapshot', 'units-sync.json.br')
}

// Written next to the snapshot at build time. `fingerprint` ties it to the snapshot it was built with.
export interface Manifest {
  format: number
  builtAt: string
  fingerprint: string
  unitsFingerprint: string
  units: number
  shards?: ShardManifest
}

// The shards of the build (src/content/shards/format.ts)
export interface ShardManifest {
  format: number
  v8: string
  node: string
  index: { file: string; bytes: number }
  search: { file: string; bytes: number } | null
  guides: Array<{ id: string; pack: string; packBytes: number; sha1: string; chapters: number; units: number; placement: number; reels: number }>
  totals: { guides: number; chapters: number; units: number; placement: number; reels: number }
}

export const MANIFEST_FORMAT = 1

// Build time: the unit rows the `units` table mirrors and the manifest that fingerprints them.
export function buildUnitsSync(snapshot: FullSnapshot, fingerprint: string): { manifest: Manifest; data: Buffer } {
  const rows = [...snapshot.units.values()].map(unitRow)
  return { manifest: { format: MANIFEST_FORMAT, builtAt: new Date().toISOString(), fingerprint, unitsFingerprint: unitsFingerprint(rows), units: rows.length }, data: encodeUnitsSync(rows) }
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
export async function buildPrebuilt(config: VaultConfig): Promise<{ data: Buffer; snapshot: FullSnapshot; fingerprint: string }> {
  const listing = await listVault(config.vaultPath, config.guidesDir)
  const snapshot = await loadSnapshot(config, new Map(), 1, listing)
  const fingerprint = listingFingerprint(listing)
  return { data: encodePrebuilt(snapshot, listing.files, fingerprint), snapshot, fingerprint }
}

export function encodePrebuilt(snapshot: FullSnapshot, files: VaultFile[], fingerprint: string): Buffer {
  const payload: Prebuilt = { format: PREBUILT_FORMAT, v8: process.versions.v8, fingerprint, snapshot, files }
  return brotliCompressSync(serialize(payload), { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 } })
}

async function loadPrebuilt(file: string, config: VaultConfig, listing: VaultListing): Promise<{ snapshot: FullSnapshot; files: Map<string, VaultFile>; fingerprint: string } | null> {
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
    return { snapshot, files, fingerprint: payload.fingerprint }
  } catch (error) {
    console.warn('[content] prebuilt snapshot unreadable, parsing the vault', error)
    return null
  }
}

// What syncUnits (src/server/services/units-sync.ts) needs of the content: a fingerprint of the unit rows and, only
// when the `units` table is behind it, the rows themselves.
export interface UnitsSyncSource {
  fingerprint(): string
  rows(): Promise<UnitRow[]>
}

async function readManifest(config: VaultConfig, fingerprint: string): Promise<Manifest | null> {
  try {
    const manifest = JSON.parse(await readFile(manifestPath(config), 'utf8')) as Manifest
    return manifest.format === MANIFEST_FORMAT && manifest.fingerprint === fingerprint ? manifest : null
  } catch {
    return null
  }
}

export class ContentStore {
  private config: VaultConfig
  private readonly cache = new Map<string, CacheEntry>()
  // parsed articles (mdast with positions, headings, units) and their translated merges: heap-heavy, so each cache has
  // a byte budget (DOCUMENT_CACHE_MB, shared 2:1), the cost estimated from the source text (DOCUMENT_HEAP_FACTOR)
  private readonly documents = new ByteLru<{ mtimeMs: number; result: ExtractResult }>(budgetFromEnv('DOCUMENT_CACHE_MB', 24) * (2 / 3))
  private readonly localized = new ByteLru<{ key: string; doc: LocalizedChapterDocument }>(budgetFromEnv('DOCUMENT_CACHE_MB', 24) / 3)
  private source: BodySource | null = null
  private snapshot: ContentIndex | null = null
  private loading: Promise<ContentIndex> | null = null
  private version = 0
  private readonly listeners = new Set<Listener>()
  private stopWatch: (() => Promise<void>) | null = null
  private pending = new Set<string>()
  private timer: ReturnType<typeof setTimeout> | null = null
  // guide files of a prebuilt snapshot (documents are parsed from them on demand)
  private prebuiltFiles: Map<string, VaultFile> | null = null
  // the build's unit-rows fingerprint, while the snapshot in use is the prebuilt one it belongs to
  private prebuiltUnits: string | null = null

  // `prebuilt`: a snapshot file to try on the first load (deployments; see buildPrebuilt)
  constructor(
    config: VaultConfig,
    private readonly watch: boolean,
    private readonly prebuilt: string | null = null,
    // read the shards of the build (CONTENT_SHARDS≠0) before the monolithic snapshot
    private readonly shards = false,
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
    if (cached && cached.mtimeMs === chapter.mtimeMs) return { chapter, root: cached.result.root, headings: cached.result.headings }
    const file = entry?.parsed.file ?? this.prebuiltFiles?.get(chapter.path)
    if (!file) return null
    const text = await readText(file.absolute)
    const result = fullParse(text, file, chapter.guideId, chapter.id)
    this.documents.set(chapter.path, { mtimeMs: chapter.mtimeMs, result }, text.length * DOCUMENT_HEAP_FACTOR)
    return { chapter, root: result.root, headings: result.headings }
  }

  // The topic in `lang` (a REVIEWED translation exists — snapshot.translations with a lock): source structure,
  // translated segments whose source still hashes to the lock, the rest in the source language with `label`
  // («not translated yet» in the reader's locale `labelLang`). null — show the source page (no lock, headings that
  // don't line up, unreadable files).
  async localizedDocument(chapterId: string, lang: string, opts: { sourceLang: string; label: string; labelLang: string }): Promise<LocalizedChapterDocument | null> {
    const snapshot = await this.get()
    const info = snapshot.translations.get(chapterId)?.get(lang)
    if (!info?.lock) return null
    const source = await this.document(chapterId)
    if (!source) return null
    const key = `${source.chapter.mtimeMs}|${info.mtimeMs}|${info.lockMtimeMs}|${opts.sourceLang}|${opts.labelLang}|${opts.label}`
    const memo = `${chapterId}|${lang}`
    const hit = this.localized.get(memo)
    if (hit && hit.key === key) return hit.doc
    const file = this.prebuiltFiles?.get(info.path) ?? info.file
    const sourceFile = this.cache.get(source.chapter.path)?.parsed.file ?? this.prebuiltFiles?.get(source.chapter.path)
    let translated: ExtractResult
    let sourceText: string
    let translatedLength = 0
    try {
      if (!sourceFile) return null
      ;[translated, sourceText] = await Promise.all([
        readText(file.absolute).then((text) => {
          translatedLength = text.length
          return fullParse(text, file, source.chapter.guideId, chapterId)
        }),
        readText(sourceFile.absolute),
      ])
    } catch {
      return null
    }
    const units = new Map((await this.chapterUnits(chapterId)).map((u) => [u.id, u]))
    const selfName = path.basename(source.chapter.path, '.md').normalize('NFC')
    const merged = localizeDocument(
      { root: source.root, headings: source.headings, units },
      { root: translated.root, headings: translated.headings, units: new Map(translated.units.map((u) => [u.id, u])) },
      { ...opts, lock: info.lock, sourceText, isSelf: (target) => (target.split('/').at(-1) ?? target).replace(/\.md$/i, '').normalize('NFC') === selfName },
    )
    if (!merged) return null
    // reels in page order (a fallback block holds the source's), matched to the source reels by position
    const srcReels = await this.chapterReels(chapterId)
    const unwrapped: Root = { type: 'root', children: merged.root.children.flatMap((n) => (n.type === 'i18nFallback' ? (n.children as Root['children']) : [n])) }
    const trReels = collectReels(unwrapped, source.chapter.guideId, chapterId)
    const reels = new Map<string, Reel>(trReels.length === srcReels.length ? srcReels.map((r, i) => [r.id, { ...trReels[i]!, id: r.id, sectionSlug: r.sectionSlug }]) : [])
    const doc: LocalizedChapterDocument = { chapter: source.chapter, lang, title: info.title, ...merged, reels }
    this.localized.set(memo, { key, doc }, (sourceText.length + translatedLength) * DOCUMENT_HEAP_FACTOR)
    return doc
  }

  // Unit and reel bodies, chapter texts and the search index. Where they come from — the parse in memory or the
  // per-guide packs — is the BodySource's business (src/content/shards/source.ts); the API is async either way.
  private async bodies(): Promise<BodySource> {
    await this.get()
    return this.source!
  }

  async unit(id: string): Promise<LearningUnit | null> {
    return (await this.bodies()).unit(id)
  }

  async units(ids: readonly string[]): Promise<Map<string, LearningUnit>> {
    return (await this.bodies()).units(ids)
  }

  async chapterUnits(chapterId: string): Promise<LearningUnit[]> {
    return (await this.bodies()).chapterUnits(chapterId)
  }

  async reels(ids: readonly string[]): Promise<Map<string, Reel>> {
    return (await this.bodies()).reels(ids)
  }

  async chapterReels(chapterId: string): Promise<Reel[]> {
    return (await this.bodies()).chapterReels(chapterId)
  }

  async placementUnit(id: string): Promise<LearningUnit | null> {
    return (await this.bodies()).placementUnit(id)
  }

  // The plain text of every chapter, guide by guide (reels ingest). The shards are read without entering the cache.
  async forEachGuideText(fn: (guideId: string, texts: ReadonlyMap<string, string>) => void | Promise<void>): Promise<void> {
    return (await this.bodies()).forEachGuideText(fn)
  }

  // The global search index: loaded from the build's search.json.br, or built from the parse in memory.
  async searchIndex(): Promise<MiniSearch<SearchDoc>> {
    return (await this.bodies()).searchIndex()
  }

  // What the search index is built from (src/content/search.ts): only the parse in memory has it.
  async searchSource(): Promise<SearchSource> {
    const source = await this.bodies()
    if (!(source instanceof MemorySource)) throw new Error('The text of everything is not resident when the content comes from shards: use searchIndex()')
    return source.full
  }

  // Counters of the document caches (parsed articles, translated merges)
  documentStats(): { documents: { bytes: number; budget: number; entries: number; evictions: number }; localized: { bytes: number; budget: number; entries: number; evictions: number } } {
    const stat = (c: ByteLru<unknown>) => ({ bytes: c.bytes, budget: c.budget, entries: c.size, evictions: c.evictions })
    return { documents: stat(this.documents), localized: stat(this.localized) }
  }

  // Counters of the section cache; null when the content is held in memory.
  shardStats(): ShardStats | null {
    return this.source instanceof ShardSource ? this.source.reader.stats() : null
  }

  // The prebuilt snapshot brings the rows' fingerprint with it (manifest.json); a vault parsed in-process (dev, or a
  // snapshot that does not match the vault) computes them from its unit metadata.
  async unitsSync(): Promise<UnitsSyncSource> {
    const { units } = await this.get()
    const live = () => [...units.values()].map(rowOfMeta)
    const stored = this.prebuiltUnits
    if (!stored) {
      let rows: UnitRow[] | null = null
      return { fingerprint: () => unitsFingerprint((rows ??= live())), rows: async () => (rows ??= live()) }
    }
    return {
      fingerprint: () => stored,
      rows: async () => {
        try {
          const data = decodeUnitsSync(await readFile(unitsSyncPath(this.config)))
          if (data.fingerprint === stored) return data.rows
        } catch {
          // fall through to the units in memory
        }
        return live()
      },
    }
  }

  async get(): Promise<ContentIndex> {
    if (this.snapshot) return this.snapshot
    if (!this.loading) this.loading = this.reload([])
    return this.loading
  }

  async setConfig(config: VaultConfig): Promise<ContentIndex> {
    if (config.vaultPath === this.config.vaultPath && config.guidesDir === this.config.guidesDir && this.snapshot) return this.snapshot
    this.config = config
    this.cache.clear()
    this.documents.clear()
    this.localized.clear()
    await this.stopWatch?.()
    this.stopWatch = null
    this.snapshot = null
    await this.releaseSource()
    this.loading = this.reload(['*'])
    return this.loading
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private async releaseSource(): Promise<void> {
    const source = this.source
    this.source = null
    if (source instanceof ShardSource) await source.reader.close()
  }

  private async reload(paths: string[]): Promise<ContentIndex> {
    this.prebuiltUnits = null
    await this.releaseSource()
    const snapshot = (await this.fromBuild(paths)) ?? this.fromParse(await loadSnapshot(this.config, this.cache, ++this.version))
    this.snapshot = snapshot
    this.loading = null
    if (this.watch && !this.stopWatch) await this.startWatch()
    if (paths.length > 0) for (const l of this.listeners) l({ version: snapshot.version, paths })
    return snapshot
  }

  private fromParse(full: FullSnapshot): ContentIndex {
    this.source = new MemorySource(full)
    return toIndex(full)
  }

  // The build's files (deployments, CONTENT_SNAPSHOT=1): the shards, else the monolithic snapshot — each only when the
  // vault listing still matches what they were built from.
  private async fromBuild(paths: string[]): Promise<ContentIndex | null> {
    if (!this.prebuilt || paths.length > 0 || this.version > 0) return null
    const started = performance.now()
    const listing = await listVault(this.config.vaultPath, this.config.guidesDir)
    if (this.shards) {
      const hit = await loadShards(this.config, listingFingerprint(listing))
      if (hit) {
        const version = ++this.version
        this.prebuiltFiles = hit.files
        this.prebuiltUnits = hit.manifest.unitsFingerprint
        const snapshot: ContentIndex = { ...hit.index, version, scanMs: Math.round(performance.now() - started) }
        this.source = new ShardSource(() => this.snapshot ?? snapshot, hit.reader, shardsDir(this.config), hit.manifest)
        return snapshot
      }
    }
    const hit = await loadPrebuilt(this.prebuilt, this.config, listing)
    if (!hit) return null
    this.prebuiltFiles = hit.files
    this.prebuiltUnits = (await readManifest(this.config, hit.fingerprint))?.unitsFingerprint ?? null
    return this.fromParse({ ...hit.snapshot, version: ++this.version, scanMs: Math.round(performance.now() - started) })
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
  // One store per process on globalThis. NB: pages and route handlers are separate bundles with their own copy of this
  // module, so the store must NOT be replaced when it comes from «another» copy (an instanceof check did that and
  // re-read the whole content on every page ↔ API alternation). After editing the parser in dev, restart `pnpm dev`.
  if (!g[globalKey]) {
    const config = defaultVaultConfig()
    const watch = process.env.CONTENT_WATCH !== '0' && !process.env.VERCEL
    // deployments (and CONTENT_SNAPSHOT=1 locally) start from the build's parsed snapshot when it matches the vault
    const prebuilt = !watch && (process.env.VERCEL || process.env.CONTENT_SNAPSHOT === '1') ? prebuiltPath(config) : null
    // CONTENT_SHARDS=0 is the rollback to the monolithic snapshot
    g[globalKey] = new ContentStore(config, watch, prebuilt, process.env.CONTENT_SHARDS !== '0')
  }
  return g[globalKey]
}

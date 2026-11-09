import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Usage: pnpm content:measure [--vault content] [--json] [--assert] [--verify] [--guides]
// Heap and time of the content layers, each scenario in a fresh child process (`node --expose-gc`): heap is
// `heapUsed` after a forced GC minus the baseline before loading. Needs the build (pnpm content:snapshot).
//   --json     also write tmp/measure-content.json (the stage reports)
//   --assert   exit 1 when a scenario exceeds its budget (docs/fullstack/stage1/01-storage.md §7)
//   --verify   check that the shards serve exactly what the full parse holds (index, bodies, texts, search hits)
//   --guides   one more scenario per guide: the heap of reading every chapter of that guide alone
// Environment of the app, honoured here: CONTENT_CACHE_MB (section LRU), COURSE_CACHE_MB (bundle LRU),
// DOCUMENT_CACHE_MB (parsed articles).

const args = process.argv.slice(2)
const flag = (name: string) => args.includes(name)
const vi = args.indexOf('--vault')
const vaultPath = path.resolve(vi >= 0 && args[vi + 1] ? args[vi + 1]! : (process.env.VAULT_PATH ?? 'content'))
const config = { vaultPath, guidesDir: process.env.GUIDES_DIR ?? 'Guides' }
const snapshotDir = path.join(vaultPath, '.snapshot')
const coursesDir = path.join(vaultPath, 'courses')
const mb = (n: number) => +(n / 1e6).toFixed(1)

// Budgets of the resident content (the owner's decision: content only — index + sections + bundles; the document
// caches have their own). Re-check at every content batch (docs/fullstack/stage1/01-storage.md §7).
const BUDGET = {
  // (the design counted on a columnar unit table, 2.5 MB; the rows are plain objects with shared strings)
  indexMB: 16,
  // index + sections of any 3 guides + 2 bundles
  residentMB: 60,
  coldMs: 150,
  searchMB: 160,
  searchMs: 1000,
  // parsed articles: the retained heap after reading the 40 largest chapters stays within the documents' share of
  // DOCUMENT_CACHE_MB (16 of 24), plus 10 %
  documentsMB: 17.6,
}

const gc = () => {
  for (let i = 0; i < 4; i++) globalThis.gc?.()
}
const heap = () => {
  gc()
  return process.memoryUsage().heapUsed
}

interface Result {
  scenario: string
  heapMB?: number
  ms?: number
  error?: string
  [key: string]: unknown
}

interface Manifest {
  shards: { guides: Array<{ id: string; packBytes: number; units: number; chapters: number }> }
}
const readManifest = () => JSON.parse(readFileSync(path.join(snapshotDir, 'manifest.json'), 'utf8')) as Manifest
const largestGuides = (n: number) => [...readManifest().shards.guides].sort((a, b) => b.packBytes - a.packBytes).slice(0, n).map((g) => g.id)

// the modules are loaded before the baseline: the numbers are data, not code
async function warm() {
  await Promise.all([import('../src/content/store'), import('../src/content/search'), import('../src/server/courses/catalog')])
}

async function shardStore() {
  const { ContentStore, prebuiltPath } = await import('../src/content/store')
  const store = new ContentStore(config, false, prebuiltPath(config), true)
  const index = await store.get()
  if (!store.shardStats()) throw new Error('the store did not take the shards (run pnpm content:snapshot; the listing must match the vault)')
  return { store, index }
}

// read every chapter of a guide through the store (units and reels), as a learner opening it would
async function readGuide(store: Awaited<ReturnType<typeof shardStore>>['store'], index: Awaited<ReturnType<typeof shardStore>>['index'], guideId: string) {
  let units = 0
  for (const chapter of index.chapters.values()) {
    if (chapter.guideId !== guideId) continue
    units += (await store.chapterUnits(chapter.id)).length
    await store.chapterReels(chapter.id)
  }
  return units
}

const scenarios: Record<string, (arg?: string) => Promise<Omit<Result, 'scenario'>>> = {
  // a cold ContentStore.get() from the monolithic snapshot (the rollback, CONTENT_SHARDS=0)
  async monolith() {
    await warm()
    const { ContentStore, prebuiltPath } = await import('../src/content/store')
    const base = heap()
    const started = performance.now()
    const store = new ContentStore(config, false, prebuiltPath(config))
    const snapshot = await store.get()
    const ms = Math.round(performance.now() - started)
    return { heapMB: mb(heap() - base), ms, rssMB: mb(process.memoryUsage().rss), shards: store.shardStats() !== null, units: snapshot.units.size, chapters: snapshot.chapters.size }
  },
  // the resident index of the shards (budget: BUDGET.indexMB)
  async index() {
    await warm()
    const base = heap()
    const started = performance.now()
    const { store, index } = await shardStore()
    const ms = Math.round(performance.now() - started)
    return { heapMB: mb(heap() - base), ms, rssMB: mb(process.memoryUsage().rss), shards: store.shardStats() !== null, units: index.units.size, chapters: index.chapters.size }
  },
  // cold start to the first chapter: get() + one chapterUnits (budget: BUDGET.coldMs)
  async cold() {
    await warm()
    const { ContentStore, prebuiltPath } = await import('../src/content/store')
    const manifest = readManifest()
    const started = performance.now()
    const store = new ContentStore(config, false, prebuiltPath(config), true)
    const index = await store.get()
    const biggest = manifest.shards.guides.sort((a, b) => b.packBytes - a.packBytes)[0]!.id
    const chapter = [...index.chapters.values()].find((c) => c.guideId === biggest && (index.unitsByChapter.get(c.id)?.length ?? 0) > 5)!
    const units = (await store.chapterUnits(chapter.id)).length
    return { ms: Math.round(performance.now() - started), units }
  },
  // index + every chapter of the 3 largest guides (the cache must evict) + the 2 largest course bundles (budget: BUDGET.residentMB)
  async resident() {
    await warm()
    const { CourseStore } = await import('../src/server/courses/catalog')
    const base = heap()
    const started = performance.now()
    const { store, index } = await shardStore()
    const afterIndex = heap() - base
    const guides = largestGuides(3)
    let units = 0
    for (const g of guides) units += await readGuide(store, index, g)
    const afterGuides = heap() - base
    const courses = new CourseStore(coursesDir)
    const catalog = await courses.catalog()
    const bundles = [...catalog.courses].sort((a, b) => b.bytes - a.bytes).slice(0, 2).map((c) => c.id)
    for (const id of bundles) await courses.entry(id)
    const heapMB = mb(heap() - base)
    return {
      heapMB,
      ms: Math.round(performance.now() - started),
      guides,
      bundles,
      units,
      indexMB: mb(afterIndex),
      guidesMB: mb(afterGuides - afterIndex),
      bundlesMB: mb(heapMB * 1e6 - afterGuides),
      sections: store.shardStats(),
      courseStore: courses.stats(),
    }
  },
  // the prebuilt search index, on top of the index (budget: BUDGET.searchMB / searchMs)
  async search() {
    await warm()
    const { searchIn } = await import('../src/content/search')
    const { store } = await shardStore()
    const base = heap()
    const started = performance.now()
    const mini = await store.searchIndex()
    const ms = Math.round(performance.now() - started)
    const hits = searchIn(mini, 'present perfect').length
    return { heapMB: mb(heap() - base), ms, hits }
  },
  // the same index built from the parse in memory (what the monolith does on the first search)
  async 'search-build'() {
    await warm()
    const { searchContent, warmSearchIndex } = await import('../src/content/search')
    const { ContentStore, prebuiltPath } = await import('../src/content/store')
    const store = new ContentStore(config, false, prebuiltPath(config))
    const source = await store.searchSource()
    const base = heap()
    const started = performance.now()
    await warmSearchIndex(source)
    searchContent(source, 'present perfect')
    return { heapMB: mb(heap() - base), ms: Math.round(performance.now() - started) }
  },
  // parsed articles: the 40 largest chapters through store.document(); the estimate (source chars × factor) vs the heap
  async documents() {
    await warm()
    const { store, index } = await shardStore()
    const bytesOf = (c: { path: string }) => statSync(path.join(vaultPath, ...c.path.split('/'))).size
    const chapters = [...index.chapters.values()]
      .filter((c) => c.kind !== 'index')
      .map((c) => ({ c, bytes: bytesOf(c) }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 40)
      .map((x) => x.c)
    let chars = 0
    for (const c of chapters) chars += bytesOf(c)
    const base = heap()
    for (const c of chapters) await store.document(c.id)
    const stats = store.documentStats()
    const heapMB = mb(heap() - base)
    const cached = stats.documents.entries
    return { heapMB, chapters: chapters.length, sourceMB: mb(chars), cached, lruMB: mb(stats.documents.bytes), budgetMB: mb(stats.documents.budget), evictions: stats.documents.evictions, heapPerCachedLruByte: stats.documents.bytes ? +((heapMB * 1e6) / stats.documents.bytes).toFixed(2) : null }
  },
  // every course bundle, JSON.parse + zod (all four at once: the old load-all)
  async bundles() {
    await warm()
    const { CourseStore } = await import('../src/server/courses/catalog')
    const base = heap()
    const started = performance.now()
    const courses = new CourseStore(coursesDir, Infinity)
    const catalog = await courses.catalog()
    for (const c of catalog.courses) await courses.entry(c.id)
    const ms = Math.round(performance.now() - started)
    return { heapMB: mb(heap() - base), ms, courses: catalog.courses.length, bytes: catalog.courses.reduce((n, c) => n + c.bytes, 0) }
  },
  // the catalog alone
  async catalog() {
    await warm()
    const { CourseStore } = await import('../src/server/courses/catalog')
    const base = heap()
    const started = performance.now()
    const courses = new CourseStore(coursesDir)
    const catalog = await courses.catalog()
    return { heapMB: mb(heap() - base), ms: Math.round(performance.now() - started), courses: catalog.courses.length, legacy: Object.keys(catalog.legacy).length }
  },
  // one guide alone, on top of the index
  async guide(id) {
    await warm()
    const { store, index } = await shardStore()
    const base = heap()
    const started = performance.now()
    const units = await readGuide(store, index, id!)
    return { heapMB: mb(heap() - base), ms: Math.round(performance.now() - started), units, sections: store.shardStats()?.sections }
  },
}

function runChild(name: string, arg?: string): Result {
  const here = fileURLToPath(import.meta.url)
  const run = spawnSync(process.execPath, ['--expose-gc', '--import', 'tsx', here, '--scenario', name, ...(arg ? ['--arg', arg] : []), '--vault', vaultPath], {
    encoding: 'utf8',
    maxBuffer: 1 << 26,
    env: { ...process.env, NODE_ENV: 'production' },
  })
  const last = run.stdout.trim().split('\n').at(-1) ?? ''
  try {
    return JSON.parse(last) as Result
  } catch {
    return { scenario: name, error: (run.stderr || run.stdout || 'no output').slice(-400) }
  }
}

const only = args.indexOf('--scenario')
if (only >= 0) {
  const name = args[only + 1]!
  const ai = args.indexOf('--arg')
  const out = await scenarios[name]!(ai >= 0 ? args[ai + 1] : undefined)
  console.log(JSON.stringify({ scenario: name, ...out }))
  process.exit(0)
}

try {
  readdirSync(snapshotDir)
} catch {
  console.warn('no .snapshot/ — run `pnpm content:snapshot` first')
  process.exit(1)
}

if (flag('--verify')) {
  const { verifyShards } = await import('../src/content/shards/verify')
  const problems = await verifyShards(config)
  console.log(problems.length === 0 ? 'verify: the shards serve exactly what the full parse holds' : `verify FAILED:\n  ${problems.slice(0, 20).join('\n  ')}`)
  if (problems.length > 0) process.exit(1)
}

const results: Result[] = []
for (const name of ['monolith', 'index', 'cold', 'resident', 'search', 'search-build', 'documents', 'bundles', 'catalog']) results.push(runChild(name))
if (flag('--guides')) for (const g of readManifest().shards.guides) results.push({ ...runChild('guide', g.id), guide: g.id, packBytes: g.packBytes, chapters: g.chapters, unitsInPack: g.units })
const by = (name: string) => results.find((r) => r.scenario === name)!
for (const r of results) {
  const { scenario, heapMB, ms, ...rest } = r
  console.log(scenario.padEnd(13), r.error ? `ERROR ${r.error}` : `${heapMB !== undefined ? `heap ${String(heapMB).padStart(6)} MB` : ' '.repeat(14)} ${ms !== undefined ? `${String(ms).padStart(6)} ms` : ''}`, JSON.stringify(rest))
}

console.log('\nfiles')
const sizes: Record<string, number> = {}
const walk = (dir: string, prefix: string) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name), `${prefix}${e.name}/`)
    else sizes[`${prefix}${e.name}`] = statSync(path.join(dir, e.name)).size
  }
}
walk(snapshotDir, '.snapshot/')
for (const n of readdirSync(coursesDir).filter((f) => f.endsWith('.json'))) sizes[`courses/${n}`] = statSync(path.join(coursesDir, n)).size
for (const [file, size] of Object.entries(sizes)) console.log(`  ${file.padEnd(44)} ${mb(size)} MB`)

// budgets
const checks: Array<{ name: string; ok: boolean; got: string; budget: string }> = []
const check = (name: string, got: number | undefined, budget: number, unit: string) => checks.push({ name, ok: got !== undefined && got <= budget, got: `${got ?? 'n/a'} ${unit}`, budget: `≤ ${budget} ${unit}` })
check('(a) resident index', by('index').heapMB, BUDGET.indexMB, 'MB')
check('(b) index + 3 guides + 2 bundles', by('resident').heapMB, BUDGET.residentMB, 'MB')
const sections = by('resident').sections as { bytes: number; budget: number } | undefined
checks.push({ name: '(b) section LRU within its budget', ok: !!sections && sections.bytes <= sections.budget, got: `${mb(sections?.bytes ?? 0)} MB`, budget: `≤ ${mb(sections?.budget ?? 0)} MB` })
check('(c) cold get + one chapter', by('cold').ms, BUDGET.coldMs, 'ms')
check('(d) search index load: heap', by('search').heapMB, BUDGET.searchMB, 'MB')
check('(d) search index load: time', by('search').ms, BUDGET.searchMs, 'ms')
check('(e) parsed articles (40 largest) heap', by('documents').heapMB, BUDGET.documentsMB, 'MB')
console.log('\nbudgets')
for (const c of checks) console.log(`  ${c.ok ? 'ok  ' : 'OVER'} ${c.name.padEnd(40)} ${c.got.padStart(12)}  (${c.budget})`)

if (flag('--json')) {
  mkdirSync('tmp', { recursive: true })
  writeFileSync('tmp/measure-content.json', JSON.stringify({ at: new Date().toISOString(), node: process.version, budget: BUDGET, results, sizes, checks }, null, 2))
  console.log('→ tmp/measure-content.json')
}
if (flag('--assert') && (checks.some((c) => !c.ok) || results.some((r) => r.error))) {
  console.error('\nbudget exceeded')
  process.exit(1)
}

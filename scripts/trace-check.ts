import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Usage: pnpm content:trace-check   (after `next build`; CI: check:storage)
// A deployment ships only the files Next traces into each function. The content store must work from exactly those:
//  (a) every route's .nft.json holds the build's content files — the manifest, the index, every pack, the unit rows,
//      the course catalog and bundles, the monolith (rollback) and every guide Markdown the index points at — and
//      only /api/search holds the search index;
//  (b) for a lesson route and for /api/search, the traced content files alone are copied into an empty directory and
//      the runtime store is started from there as on Vercel (VERCEL=1): it must take the shards (no full parse, no
//      fallback warning), start in under a second, resolve unit bodies, parse an article and list the courses.

const root = process.cwd()
const server = path.join(root, '.next', 'server')
const contentDir = path.join(root, 'content')
const COLD_MS = 1000
const SEARCH_MS = 3000

const failures: string[] = []
const fail = (message: string) => failures.push(message)

function tracedFiles(nft: string): Set<string> {
  const trace = JSON.parse(readFileSync(nft, 'utf8')) as { files: string[] }
  const out = new Set<string>()
  for (const rel of trace.files) {
    try {
      out.add(realpathSync(path.resolve(path.dirname(nft), rel)))
    } catch {
      // a traced file that does not exist is not content
    }
  }
  return out
}

const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.nft.json') ? [path.join(dir, e.name)] : []))

if (process.argv.includes('--child')) {
  // Runs in a directory that holds only the traced content. The route to emulate comes in argv.
  const route = process.argv[process.argv.indexOf('--child') + 1]!
  const warnings: string[] = []
  console.warn = (...a: unknown[]) => void warnings.push(a.map(String).join(' '))
  const { getContentStore } = await import('../src/content/store')
  const { CourseStore } = await import('../src/server/courses/catalog')
  const started = performance.now()
  const store = getContentStore()
  const index = await store.get()
  const coldMs = Math.round(performance.now() - started)
  const shards = store.shardStats() !== null
  const chapter = [...index.chapters.values()].find((c) => c.kind !== 'index' && (index.unitsByChapter.get(c.id)?.length ?? 0) > 3)!
  const units = await store.chapterUnits(chapter.id)
  const first = await store.unit(units[0]!.id)
  const doc = await store.document(chapter.id)
  const courses = new CourseStore(path.join(process.cwd(), 'content', 'courses'))
  const catalog = await courses.catalog()
  const bundle = await courses.entry(catalog.courses[0]!.id)
  let search: { ms: number; hits: number } | null = null
  if (route.includes('api/search')) {
    const { searchIn } = await import('../src/content/search')
    const t = performance.now()
    const mini = await store.searchIndex()
    search = { ms: Math.round(performance.now() - t), hits: searchIn(mini, 'present perfect').length }
  }
  console.log(JSON.stringify({ shards, coldMs, units: units.length, bodyOk: first?.id === units[0]!.id, docOk: Boolean(doc?.root.children.length), courses: catalog.courses.length, bundleOk: Boolean(bundle), courseFallback: courses.stats().fallback, search, warnings }))
  process.exit(0)
}

if (!existsSync(server)) {
  console.error('no .next/server — run `pnpm build` first')
  process.exit(1)
}
const snapshotDir = path.join(contentDir, '.snapshot')
const manifest = JSON.parse(readFileSync(path.join(snapshotDir, 'manifest.json'), 'utf8')) as { shards: { guides: Array<{ pack: string }>; index: { file: string } } }
const catalog = JSON.parse(readFileSync(path.join(contentDir, 'courses', 'catalog.json'), 'utf8')) as { courses: Array<{ file: string }> }
const { deserialize } = await import('node:v8')
const { brotliDecompressSync } = await import('node:zlib')
const index = deserialize(brotliDecompressSync(readFileSync(path.join(snapshotDir, manifest.shards.index.file)))) as { files: Array<{ path: string }> }

const required = [
  'manifest.json',
  manifest.shards.index.file,
  'units-sync.json.br',
  'guides.v8.br',
  ...manifest.shards.guides.map((g) => `guides/${g.pack}`),
].map((f) => path.join(snapshotDir, f))
required.push(...catalog.courses.map((c) => path.join(contentDir, 'courses', c.file)), path.join(contentDir, 'courses', 'catalog.json'))
// the Markdown the index points at (documents are parsed from it); other vault files are not read at runtime
required.push(...index.files.filter((f) => f.path.endsWith('.md')).map((f) => path.join(contentDir, ...f.path.split('/'))))
const search = path.join(snapshotDir, 'search.json.br')

const entries = walk(server).filter((f) => f.includes(`${path.sep}app${path.sep}`))
const byRoute = new Map<string, Set<string>>()
for (const nft of entries) {
  const route = path.relative(server, nft).replace(/\.js\.nft\.json$/, '')
  const traced = tracedFiles(nft)
  byRoute.set(route, traced)
  const missing = required.filter((f) => !traced.has(f))
  if (missing.length > 0) fail(`${route}: ${missing.length} content files are not traced, e.g. ${path.relative(root, missing[0]!)}`)
  const hasSearch = traced.has(search)
  if (route === 'app/api/search/route' ? !hasSearch : hasSearch) fail(`${route}: search.json.br ${hasSearch ? 'must not be' : 'must be'} traced`)
}
console.log(`(a) ${entries.length} traced routes checked against ${required.length} required content files`)

// (b) the runtime store on the traced files alone
for (const route of ['app/learn/[lesson]/page', 'app/api/search/route']) {
  const traced = byRoute.get(route)
  if (!traced) {
    fail(`${route}: no trace file`)
    continue
  }
  const tmp = mkdtempSync(path.join(tmpdir(), 'levelup-trace-'))
  try {
    let copied = 0
    for (const file of traced) {
      if (!file.startsWith(contentDir + path.sep)) continue
      const target = path.join(tmp, path.relative(root, file))
      mkdirSync(path.dirname(target), { recursive: true })
      cpSync(file, target)
      copied++
    }
    const here = fileURLToPath(import.meta.url)
    const run = spawnSync(process.execPath, ['--import', pathToFileURL(path.join(root, 'node_modules', 'tsx', 'dist', 'esm', 'index.mjs')).href, here, '--child', route], {
      cwd: tmp,
      encoding: 'utf8',
      env: { ...process.env, VERCEL: '1', VAULT_PATH: path.join(tmp, 'content'), NODE_ENV: 'production', TSX_TSCONFIG_PATH: path.join(root, 'tsconfig.json') },
    })
    const line = run.stdout.trim().split('\n').at(-1) ?? ''
    let result: { shards: boolean; coldMs: number; units: number; bodyOk: boolean; docOk: boolean; courses: number; bundleOk: boolean; courseFallback: boolean; search: { ms: number; hits: number } | null; warnings: string[] }
    try {
      result = JSON.parse(line)
    } catch {
      fail(`${route}: the store did not start from the traced files: ${(run.stderr || run.stdout).slice(-600)}`)
      continue
    }
    console.log(`(b) ${route}: ${copied} content files copied · shards ${result.shards} · cold ${result.coldMs} ms · units ${result.units}${result.search ? ` · search ${result.search.ms} ms, ${result.search.hits} hits` : ''}`)
    if (!result.shards) fail(`${route}: the store did not use the shards (it parsed or used the monolith)`)
    if (result.warnings.some((w) => w.includes('[content]'))) fail(`${route}: content warnings: ${result.warnings.join(' | ').slice(0, 400)}`)
    if (result.coldMs >= COLD_MS) fail(`${route}: cold load ${result.coldMs} ms ≥ ${COLD_MS} ms`)
    if (!result.bodyOk || result.units === 0) fail(`${route}: unit bodies did not resolve`)
    if (!result.docOk) fail(`${route}: an article could not be parsed from the traced Markdown`)
    if (result.courses === 0 || !result.bundleOk || result.courseFallback) fail(`${route}: course catalog/bundles not usable (${result.courses} courses, fallback ${result.courseFallback})`)
    if (route.includes('api/search')) {
      if (!result.search || result.search.hits === 0) fail(`${route}: the search index did not answer`)
      else if (result.search.ms >= SEARCH_MS) fail(`${route}: search index load ${result.search.ms} ms ≥ ${SEARCH_MS} ms`)
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

if (failures.length > 0) {
  console.error(`\ntrace-check FAILED:\n  ${failures.slice(0, 20).join('\n  ')}`)
  process.exit(1)
}
console.log('trace-check: ok')

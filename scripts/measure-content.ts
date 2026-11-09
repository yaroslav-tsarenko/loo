import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBundles } from '../src/server/courses/bundles'

// Usage: pnpm content:measure [--vault content] [--json]
// Heap and time of the content layers, each scenario in a fresh child process (`node --expose-gc`): heap is
// `heapUsed` after a forced GC minus the baseline before loading. Needs the snapshot (pnpm content:snapshot).
// --json also writes tmp/measure-content.json for the stage reports (docs/fullstack/stage1/01-storage.md §1, §7).

const args = process.argv.slice(2)
const flag = (name: string) => args.includes(name)
const vi = args.indexOf('--vault')
const vaultPath = path.resolve(vi >= 0 && args[vi + 1] ? args[vi + 1]! : (process.env.VAULT_PATH ?? 'content'))
const config = { vaultPath, guidesDir: process.env.GUIDES_DIR ?? 'Guides' }
const mb = (n: number) => +(n / 1e6).toFixed(1)

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
  rssMB?: number
  [key: string]: unknown
}

// Scenario bodies. Each runs alone in its own process, so the baselines do not leak into each other.
const scenarios: Record<string, () => Promise<Omit<Result, 'scenario'>>> = {
  // a cold ContentStore.get() from the prebuilt snapshot
  async monolith() {
    const { ContentStore, prebuiltPath } = await import('../src/content/store')
    const base = heap()
    const started = performance.now()
    const store = new ContentStore(config, false, prebuiltPath(config))
    const snapshot = await store.get()
    const ms = Math.round(performance.now() - started)
    const used = heap() - base
    return { heapMB: mb(used), ms, rssMB: mb(process.memoryUsage().rss), prebuilt: snapshot.scanMs < 5000, units: snapshot.units.size, chapters: snapshot.chapters.size }
  },
  // the search index, built on the first search (on top of the monolith)
  async search() {
    const { ContentStore, prebuiltPath } = await import('../src/content/store')
    const { warmSearchIndex, searchContent } = await import('../src/content/search')
    const store = new ContentStore(config, false, prebuiltPath(config))
    const source = await store.searchSource()
    const base = heap()
    const started = performance.now()
    await warmSearchIndex(source)
    searchContent(source, 'present perfect')
    const ms = Math.round(performance.now() - started)
    return { heapMB: mb(heap() - base), ms }
  },
  // every course bundle: JSON.parse + zod
  async bundles() {
    const coursesDir = path.join(vaultPath, 'courses')
    const names = readdirSync(coursesDir).filter((n) => n.endsWith('.json'))
    const base = heap()
    const started = performance.now()
    const load = () => {
      const files = names.map((name) => ({ name, text: readFileSync(path.join(coursesDir, name), 'utf8') }))
      return { courses: parseBundles(files, 'official').courses, bytes: files.reduce((n, f) => n + f.text.length, 0) }
    }
    const keep = load() // the file texts are garbage after this call: only the parsed bundles count
    const ms = Math.round(performance.now() - started)
    return { heapMB: mb(heap() - base), ms, courses: keep.courses.size, bytes: keep.bytes }
  },
}

async function runChild(name: string): Promise<Result> {
  const here = fileURLToPath(import.meta.url)
  const forwarded = ['--vault', vaultPath]
  const run = spawnSync(process.execPath, ['--expose-gc', '--import', 'tsx', here, '--scenario', name, ...forwarded], { encoding: 'utf8', maxBuffer: 1 << 26, env: { ...process.env, NODE_ENV: 'production' } })
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
  const out = await scenarios[name]!()
  console.log(JSON.stringify({ scenario: name, ...out }))
  process.exit(0)
}

const sizes: Record<string, number> = {}
const snapshotDir = path.join(vaultPath, '.snapshot')
try {
  for (const name of readdirSync(snapshotDir)) sizes[`.snapshot/${name}`] = statSync(path.join(snapshotDir, name)).size
} catch {
  console.warn('no .snapshot/ — run `pnpm content:snapshot` first')
  process.exit(1)
}
for (const name of readdirSync(path.join(vaultPath, 'courses')).filter((n) => n.endsWith('.json'))) sizes[`courses/${name}`] = statSync(path.join(vaultPath, 'courses', name)).size

const results: Result[] = []
for (const name of Object.keys(scenarios)) results.push(await runChild(name))
for (const r of results) console.log(r.scenario.padEnd(10), 'error' in r ? `ERROR ${String(r.error)}` : `heap ${r.heapMB} MB  ${r.ms} ms`, JSON.stringify(Object.fromEntries(Object.entries(r).filter(([k]) => !['scenario', 'heapMB', 'ms'].includes(k)))))
for (const [file, size] of Object.entries(sizes)) console.log(file.padEnd(40), `${mb(size)} MB`)
if (flag('--json')) {
  mkdirSync('tmp', { recursive: true })
  writeFileSync('tmp/measure-content.json', JSON.stringify({ at: new Date().toISOString(), node: process.version, results, sizes }, null, 2))
  console.log('→ tmp/measure-content.json')
}

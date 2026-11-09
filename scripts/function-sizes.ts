import fs from 'node:fs'
import path from 'node:path'

// Usage: pnpm content:functions [--json]  (after `next build`)
// What each route would ship, from the build's trace files (.next/server/**/*.nft.json — what Vercel zips into every
// function): total and content bytes, the content split by kind, and which routes carry the prebuilt search index or
// the monolithic snapshot (docs/fullstack/stage1/01-storage.md §6). Files are counted once (real paths).

const root = process.cwd()
const server = path.join(root, '.next', 'server')
if (!fs.existsSync(server)) {
  console.error('no .next/server — run `pnpm build` first')
  process.exit(1)
}
const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.nft.json') ? [path.join(dir, e.name)] : []))

interface Row {
  route: string
  mb: number
  contentMb: number
  nodeModulesMb: number
  search: boolean
  monolith: boolean
  courseSources: boolean
}
const rows: Row[] = []
for (const file of walk(server)) {
  const trace = JSON.parse(fs.readFileSync(file, 'utf8')) as { files: string[] }
  const seen = new Set<string>()
  const row = { total: 0, content: 0, modules: 0, search: false, monolith: false, courseSources: false }
  for (const rel of trace.files) {
    let abs = path.resolve(path.dirname(file), rel)
    try {
      abs = fs.realpathSync(abs)
    } catch {
      continue
    }
    if (seen.has(abs)) continue
    seen.add(abs)
    const size = fs.statSync(abs).size
    row.total += size
    if (abs.startsWith(path.join(root, 'content') + path.sep)) row.content += size
    if (abs.includes(`${path.sep}node_modules${path.sep}`)) row.modules += size
    if (abs.endsWith('search.json.br')) row.search = true
    if (abs.endsWith('guides.v8.br')) row.monolith = true
    if (abs.includes(`${path.sep}content${path.sep}courses${path.sep}`) && !abs.endsWith('.json')) row.courseSources = true
  }
  rows.push({
    route: path.relative(server, file).replace(/\.js\.nft\.json$/, ''),
    mb: +(row.total / 1e6).toFixed(1),
    contentMb: +(row.content / 1e6).toFixed(1),
    nodeModulesMb: +(row.modules / 1e6).toFixed(1),
    search: row.search,
    monolith: row.monolith,
    courseSources: row.courseSources,
  })
}
rows.sort((a, b) => b.mb - a.mb)
const pages = rows.filter((r) => r.route.startsWith('app/'))
const median = (xs: number[]) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0
const searchRoutes = rows.filter((r) => r.search).map((r) => r.route)
console.log(`${rows.length} traced entries (${pages.length} app routes)`)
console.log(`app route total  max ${pages[0]?.mb} MB (${pages[0]?.route}) · median ${median(pages.map((r) => r.mb))} MB · min ${pages.at(-1)?.mb} MB`)
console.log(`content part     max ${Math.max(...pages.map((r) => r.contentMb))} MB · median ${median(pages.map((r) => r.contentMb))} MB`)
console.log(`search index in  ${searchRoutes.length} entries${searchRoutes.length <= 3 ? `: ${searchRoutes.join(', ')}` : ''}`)
console.log(`monolith in      ${rows.filter((r) => r.monolith).length} entries · course sources in ${rows.filter((r) => r.courseSources).length}`)
const api = rows.find((r) => r.route === 'app/api/search/route')
if (api) console.log(`/api/search      ${api.mb} MB (content ${api.contentMb} MB)`)
if (process.argv.includes('--json')) {
  fs.mkdirSync('tmp', { recursive: true })
  fs.writeFileSync('tmp/function-sizes.json', JSON.stringify(rows, null, 2))
  console.log('→ tmp/function-sizes.json')
}

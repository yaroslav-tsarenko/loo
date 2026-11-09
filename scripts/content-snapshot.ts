import path from 'node:path'
import { buildSnapshotDir, writeSnapshotDir } from '../src/content/shards/write'

// Usage: pnpm content:snapshot [--vault content] [--no-legacy] [--no-search]
// Parses the deployed guides (./content by default) once at build time and writes `<vault>/.snapshot/`
// (src/content/shards/write.ts; docs/fullstack/stage1/01-storage.md): per-guide packs, the index, the prebuilt search
// index, the unit rows and the manifest — plus the old monolithic guides.v8.br, the rollback of CONTENT_SHARDS=0
// (--no-legacy leaves it out). vercel-build runs it before `next build`, so the files ship with every server function
// (next.config.ts → outputFileTracingIncludes). Deployments use them only when the vault listing still matches;
// locally CONTENT_SNAPSHOT=1 opts in.

const args = process.argv.slice(2)
const i = args.indexOf('--vault')
const vaultPath = path.resolve(i >= 0 && args[i + 1] ? args[i + 1]! : 'content')
const config = { vaultPath, guidesDir: process.env.GUIDES_DIR ?? 'Guides' }
const started = performance.now()
const built = await buildSnapshotDir(config, { legacy: !args.includes('--no-legacy'), search: !args.includes('--no-search') })
if (built.snapshot.error) {
  console.warn(`⚠️  ${built.snapshot.error} — знімок не записано`)
  process.exit(0)
}
const dir = await writeSnapshotDir(config, built)
const bytes = built.files.reduce((n, f) => n + f.data.length, 0)
const { totals } = built.manifest.shards!
console.log(`✅ Знімок вмісту: ${totals.guides} посібників, ${totals.units} одиниць → ${path.relative(process.cwd(), dir)} (${built.files.length} файлів, ${(bytes / 1e6).toFixed(1)} MB, ${Math.round(performance.now() - started)} ms)`)

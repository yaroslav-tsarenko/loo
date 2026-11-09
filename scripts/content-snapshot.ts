import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { buildPrebuilt, buildUnitsSync, manifestPath, prebuiltPath, unitsSyncPath } from '../src/content/store'

// Usage: pnpm content:snapshot [--vault content]
// Parses the deployed guides (./content by default) once at build time and writes the snapshot a cold server loads
// instead of parsing the vault (src/content/store.ts → prebuilt snapshot; docs/PERFORMANCE.md). vercel-build runs
// it before `next build`, so the file ships with every server function (next.config.ts → outputFileTracingIncludes).
// Next to it: units-sync.json.br (unit rows) and manifest.json (their fingerprint). Deployments use it only when
// the vault listing still matches; locally CONTENT_SNAPSHOT=1 opts in.

const i = process.argv.indexOf('--vault')
const vaultPath = path.resolve(i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : 'content')
const config = { vaultPath, guidesDir: process.env.GUIDES_DIR ?? 'Guides' }
const started = performance.now()
const { data, snapshot, fingerprint } = await buildPrebuilt(config)
if (snapshot.error) {
  console.warn(`⚠️  ${snapshot.error} — знімок не записано`)
  process.exit(0)
}
const file = prebuiltPath(config)
await mkdir(path.dirname(file), { recursive: true })
await writeFile(file, data)
// the rows the `units` table mirrors, and the manifest that fingerprints them (src/server/services/units-sync.ts)
const sync = buildUnitsSync(snapshot, fingerprint)
await writeFile(unitsSyncPath(config), sync.data)
await writeFile(manifestPath(config), JSON.stringify(sync.manifest, null, 2))
console.log(`✅ Знімок вмісту: ${snapshot.guides.length} посібників, ${snapshot.units.size} одиниць → ${path.relative(process.cwd(), file)} (${(data.length / 1e6).toFixed(1)} MB, ${Math.round(performance.now() - started)} ms)`)

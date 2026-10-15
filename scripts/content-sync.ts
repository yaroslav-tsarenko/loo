import { statSync } from 'node:fs'
import { cp, mkdir, rm, readdir } from 'node:fs/promises'
import path from 'node:path'
import { defaultVaultConfig } from '../src/content/config'

// Copies Guides/ from the Obsidian vault into ./content so the deployed app can read them.
// Usage: pnpm content:sync   (VAULT_PATH from .env.local)
const KEEP = /\.(md|json|png|jpe?g|gif|svg|webp|avif)$/i

const { vaultPath, guidesDir } = defaultVaultConfig()
const from = path.join(vaultPath, guidesDir)
const to = path.resolve('content', guidesDir)
if (path.resolve(vaultPath) === path.resolve('content')) {
  console.error('VAULT_PATH вже вказує на ./content — синхронізувати нічого')
  process.exit(1)
}
await rm(to, { recursive: true, force: true })
await mkdir(to, { recursive: true })
await cp(from, to, {
  recursive: true,
  filter: (src) => {
    const base = path.basename(src)
    if (base.startsWith('.')) return false
    // Directory names like "Next.js" look like files with an extension, so check the type.
    return statSync(src).isDirectory() || KEEP.test(src)
  },
})
const guides = (await readdir(to, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name)
console.log(`✅ ${from} → ${to}\n   Посібники: ${guides.join(', ')}`)

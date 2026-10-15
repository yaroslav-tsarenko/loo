import { existsSync, statSync } from 'node:fs'
import { cp, mkdir, rm, readdir } from 'node:fs/promises'
import path from 'node:path'
import { defaultVaultConfig } from '../src/content/config'
import { COURSES_DIR } from './lib/course-source'

// Copies Guides/ and Courses/ from the Obsidian vault into ./content so the deployed app can read them.
// Usage: pnpm content:sync   (VAULT_PATH from .env.local)
const KEEP = /\.(md|json|ya?ml|png|jpe?g|gif|svg|webp|avif)$/i

const { vaultPath, guidesDir } = defaultVaultConfig()
if (path.resolve(vaultPath) === path.resolve('content')) {
  console.error('VAULT_PATH вже вказує на ./content — синхронізувати нічого')
  process.exit(1)
}

const filter = (src: string) => {
  const base = path.basename(src)
  if (base.startsWith('.')) return false
  // Directory names like "Next.js" look like files with an extension, so check the type.
  return statSync(src).isDirectory() || KEEP.test(src)
}

async function subdirs(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return []
  return (await readdir(dir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name)
}

const from = path.join(vaultPath, guidesDir)
const to = path.resolve('content', guidesDir)
await rm(to, { recursive: true, force: true })
await mkdir(to, { recursive: true })
await cp(from, to, { recursive: true, filter })
console.log(`✅ ${from} → ${to}\n   Посібники: ${(await subdirs(to)).join(', ')}`)

// Course packages: replace only the package folders. On case-insensitive disks content/Courses is the same
// folder as content/courses, where pnpm course:build writes <id>.json bundles — those must survive.
const coursesFrom = path.join(vaultPath, COURSES_DIR)
const coursesTo = path.resolve('content', COURSES_DIR)
if (existsSync(coursesFrom)) {
  await mkdir(coursesTo, { recursive: true })
  for (const name of await subdirs(coursesTo)) await rm(path.join(coursesTo, name), { recursive: true, force: true })
  for (const name of await subdirs(coursesFrom)) {
    if (name.startsWith('.')) continue
    await cp(path.join(coursesFrom, name), path.join(coursesTo, name), { recursive: true, filter })
  }
  console.log(`✅ ${coursesFrom} → ${coursesTo}\n   Курси: ${(await subdirs(coursesTo)).join(', ') || '—'}`)
}

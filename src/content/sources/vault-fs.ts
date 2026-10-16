import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

export interface VaultFile {
  path: string
  absolute: string
  guideDir: string
  relInGuide: string
  name: string
  ext: string
  birthtimeMs: number
  mtimeMs: number
  size: number
}

export interface VaultListing {
  guideDirs: string[]
  files: VaultFile[]
  notes: string[]
}

const IGNORED = /^(\.|_resources$|node_modules$)/

export function toPosix(p: string): string {
  return p.split(path.sep).join('/')
}

async function walk(dir: string, visit: (absolute: string, isDir: boolean) => Promise<boolean | void>): Promise<void> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  await Promise.all(
    entries.map(async (entry) => {
      if (IGNORED.test(entry.name)) return
      const absolute = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const descend = await visit(absolute, true)
        if (descend !== false) await walk(absolute, visit)
      } else if (entry.isFile()) {
        await visit(absolute, false)
      }
    }),
  )
}

export async function describeFile(vaultPath: string, guidesDir: string, absolute: string): Promise<VaultFile | null> {
  const rel = toPosix(path.relative(vaultPath, absolute))
  const guidesPrefix = `${guidesDir}/`
  if (!rel.startsWith(guidesPrefix)) return null
  const inGuides = rel.slice(guidesPrefix.length)
  const slash = inGuides.indexOf('/')
  if (slash < 0) return null
  const ext = path.extname(rel).toLowerCase()
  if (ext !== '.md' && ext !== '.json') return null
  let info
  try {
    info = await stat(absolute)
  } catch {
    return null
  }
  const birth = info.birthtimeMs > 0 ? info.birthtimeMs : info.mtimeMs
  return {
    path: rel,
    absolute,
    guideDir: inGuides.slice(0, slash),
    relInGuide: inGuides.slice(slash + 1),
    name: path.basename(rel, ext),
    ext,
    birthtimeMs: birth,
    mtimeMs: info.mtimeMs,
    size: info.size,
  }
}

export async function listVault(vaultPath: string, guidesDir: string): Promise<VaultListing> {
  const guidesRoot = path.join(vaultPath, guidesDir)
  const files: VaultFile[] = []
  const notes: string[] = []
  const guideDirs: string[] = []
  try {
    const entries = await readdir(guidesRoot, { withFileTypes: true })
    for (const entry of entries) if (entry.isDirectory() && !IGNORED.test(entry.name)) guideDirs.push(entry.name)
  } catch {
    return { guideDirs: [], files: [], notes: [] }
  }
  await walk(vaultPath, async (absolute, isDir) => {
    const rel = toPosix(path.relative(vaultPath, absolute))
    if (isDir) return true
    if (rel.startsWith(`${guidesDir}/`)) {
      const file = await describeFile(vaultPath, guidesDir, absolute)
      if (file) files.push(file)
    }
    notes.push(rel)
    return undefined
  })
  files.sort((a, b) => a.path.localeCompare(b.path))
  notes.sort()
  guideDirs.sort((a, b) => a.localeCompare(b))
  return { guideDirs, files, notes }
}

export async function readText(absolute: string): Promise<string> {
  return readFile(absolute, 'utf8')
}

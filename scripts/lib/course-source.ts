import { existsSync, statSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { defaultVaultConfig, type VaultConfig } from '../../src/content/config'
import { loadSnapshot, type FullSnapshot } from '../../src/content/store'
import { iconNamesFromSource, type IconCatalog } from '../../src/course/icons'
import { parseCourseYaml } from '../../src/course/schema'

// Course packages on disk (COURSE_FORMAT §1). Official courses live in <vault>/Courses/<id>/course.yaml and
// resolve `from:` against the vault's shared Guides/; any other package resolves it against its own folders.

export const COURSES_DIR = process.env.COURSES_DIR ?? 'Courses'

export interface CoursePackage {
  dir: string
  yamlPath: string
  source: string
  official: boolean
}

export function coursesRoot(config: VaultConfig = defaultVaultConfig()): string {
  return path.join(config.vaultPath, COURSES_DIR)
}

const isDir = (p: string) => existsSync(p) && statSync(p).isDirectory()

async function readPackage(dir: string, root: string): Promise<CoursePackage | null> {
  const yamlPath = ['course.yaml', 'course.yml'].map((f) => path.join(dir, f)).find((f) => existsSync(f))
  if (!yamlPath) return null
  const official = path.resolve(path.dirname(dir)) === path.resolve(root)
  return { dir, yamlPath, source: await readFile(yamlPath, 'utf8'), official }
}

export async function listOfficialCourses(): Promise<CoursePackage[]> {
  const root = coursesRoot()
  if (!isDir(root)) return []
  const entries = await readdir(root, { withFileTypes: true })
  const out: CoursePackage[] = []
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('.')) continue
    const pkg = await readPackage(path.join(root, e.name), root)
    if (pkg) out.push(pkg)
  }
  return out.sort((a, b) => a.dir.localeCompare(b.dir))
}

// <dir> | <dir>/course.yaml | <course id> (folder name or `id:` in an official course.yaml)
export async function resolveCourse(arg: string): Promise<CoursePackage | null> {
  const root = coursesRoot()
  const candidate = path.resolve(arg)
  if (existsSync(candidate)) {
    const dir = isDir(candidate) ? candidate : path.dirname(candidate)
    return readPackage(dir, root)
  }
  const byFolder = path.join(root, arg)
  if (isDir(byFolder)) return readPackage(byFolder, root)
  for (const pkg of await listOfficialCourses()) {
    if (parseCourseYaml(pkg.source).manifest?.id === arg) return pkg
  }
  return null
}

export interface LoadedSource {
  snapshot: FullSnapshot
  config: VaultConfig
}

export async function loadCourseSource(pkg: CoursePackage): Promise<LoadedSource> {
  // A package dir acts as its own "Guides/" folder: vault = parent, guidesDir = package folder name.
  const config: VaultConfig = pkg.official ? defaultVaultConfig() : { vaultPath: path.dirname(pkg.dir), guidesDir: path.basename(pkg.dir) }
  return { snapshot: await loadSnapshot(config, new Map(), 1), config }
}

const ICON_SETS = [
  ['si', 'SI'],
  ['pi', 'PI'],
  ['tb', 'TB'],
  ['lucide', 'LUCIDE'],
] as const

// Names come from the curated set files (src/ui/icons/sets/*.tsx) as text, so no React import is needed.
export async function loadIconCatalog(): Promise<IconCatalog> {
  const catalog: IconCatalog = {}
  for (const [set, exportName] of ICON_SETS) {
    const file = path.resolve('src/ui/icons/sets', `${set}.tsx`)
    if (!existsSync(file)) continue
    const names = iconNamesFromSource(await readFile(file, 'utf8'), exportName)
    if (names.size > 0) catalog[set] = names
  }
  return catalog
}

// Illustrations: [!viz], [!figure] and [!diagram] (language guides illustrate tenses and structures with diagrams)
const FIGURE = /^(?:>\s?)+\[!(viz|visualization|візуалізація|figure|scene|сцена|diagram|діаграма|схема)\]/gimu

export async function countFigures(snapshot: FullSnapshot, config: VaultConfig, chapterIds: readonly string[]): Promise<Map<string, number>> {
  const out = new Map<string, number>()
  await Promise.all(
    chapterIds.map(async (id) => {
      const chapter = snapshot.chapters.get(id)
      if (!chapter) return
      try {
        const text = await readFile(path.join(config.vaultPath, chapter.path), 'utf8')
        out.set(id, text.match(FIGURE)?.length ?? 0)
      } catch {
        // unreadable file: skip the minimum rather than report a false shortfall
      }
    }),
  )
  return out
}

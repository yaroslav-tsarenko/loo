import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { defaultVaultConfig } from '../../src/content/config'
import type { LockFile } from '../../src/content/i18n/check'
import { lockPathFor } from '../../src/content/i18n/files'
import { parseGlossary, type Glossary } from '../../src/content/i18n/glossary'
import type { Chapter } from '../../src/content/model'
import { loadSnapshot } from '../../src/content/store'

// Shared by pnpm i18n:check and pnpm i18n:stamp (docs/COURSE_FORMAT.md «Переклад курсів (i18n)»).

export interface TranslationJob {
  lang: string
  chapter: Chapter
  // vault-relative
  sourcePath: string
  translationPath: string
  lockPath: string
  absolute: { source: string; translation: string; lock: string }
}

export interface Args {
  target: string | null
  lang: string | null
  force: boolean
}

export function parseArgs(argv: readonly string[]): Args {
  let target: string | null = null
  let lang: string | null = null
  let force = false
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!
    if (a === '--lang') lang = argv[++i] ?? null
    else if (a.startsWith('--lang=')) lang = a.slice(7)
    else if (a === '--force') force = true
    else if (!a.startsWith('--')) target = a
  }
  return { target, lang, force }
}

// Translations matching a guide (id or folder), a topic (id, file name or path) — or all of them.
export async function findJobs(args: Args): Promise<{ jobs: TranslationJob[]; vault: string; issues: string[] }> {
  const config = defaultVaultConfig()
  const snapshot = await loadSnapshot(config, new Map(), 1)
  const abs = (p: string) => path.join(config.vaultPath, ...p.split('/'))
  const jobs: TranslationJob[] = []
  const target = args.target?.normalize('NFC') ?? null
  for (const [chapterId, perLang] of snapshot.translations) {
    const chapter = snapshot.chapters.get(chapterId)
    if (!chapter) continue
    const guide = snapshot.guideById.get(chapter.guideId)
    for (const info of perLang.values()) {
      if (args.lang && info.lang !== args.lang) continue
      if (target) {
        const names = [chapter.id, chapter.path, info.path, path.basename(chapter.path), path.basename(chapter.path, '.md'), guide?.id, guide?.dir].filter(Boolean).map((v) => v!.normalize('NFC'))
        const file = target.endsWith('.md') ? path.basename(target).normalize('NFC') : null
        if (!names.includes(target) && !(file && names.includes(file))) continue
      }
      const lockPath = lockPathFor(info.path)
      jobs.push({ lang: info.lang, chapter, sourcePath: chapter.path, translationPath: info.path, lockPath, absolute: { source: abs(chapter.path), translation: abs(info.path), lock: abs(lockPath) } })
    }
  }
  jobs.sort((a, b) => a.translationPath.localeCompare(b.translationPath))
  const issues = snapshot.issues.filter((i) => i.code === 'i18n').map((i) => `${i.path}: ${i.message}`)
  return { jobs, vault: config.vaultPath, issues }
}

export async function readLock(file: string): Promise<LockFile | null> {
  if (!existsSync(file)) return null
  const data = JSON.parse(await readFile(file, 'utf8')) as Partial<LockFile>
  return { sourceId: typeof data.sourceId === 'string' ? data.sourceId : '', segments: data.segments && typeof data.segments === 'object' ? (data.segments as Record<string, string>) : {} }
}

// content/glossary/<source>-<lang>.yaml (the vault's, else the repo's content/)
export async function readGlossary(vault: string, sourceLang: string, lang: string): Promise<Glossary | null> {
  for (const dir of [path.join(vault, 'glossary'), path.join(process.cwd(), 'content', 'glossary')]) {
    const file = path.join(dir, `${sourceLang}-${lang}.yaml`)
    if (existsSync(file)) return parseGlossary(await readFile(file, 'utf8'))
  }
  return null
}

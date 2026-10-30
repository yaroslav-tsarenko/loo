import type { VaultFile } from '../sources/vault-fs'

// Translations live next to their guide: `Guides/<Guide>/_i18n/<lang>/<same file name>.md` (+ `<file>.lock.json`).
// The folder never becomes a section, chapter, search entry or feed source — like `_placement/`.
export const I18N_DIR = '_i18n'
const LANG = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/

export interface TranslationInfo {
  lang: string
  // the source chapter
  chapterId: string
  // vault path of the translation
  path: string
  file: VaultFile
  title: string
  // localized URL slug (frontmatter `slug:`) — SEO data for later /<lang>/ routes
  slug: string | null
  description: string | null
  mtimeMs: number
}

export function isI18nFile(file: Pick<VaultFile, 'relInGuide'>): boolean {
  return file.relInGuide.split('/')[0]?.toLowerCase() === I18N_DIR
}

export function translationLang(file: Pick<VaultFile, 'relInGuide'>): string | null {
  const parts = file.relInGuide.split('/')
  return parts.length >= 3 && LANG.test(parts[1]!) ? parts[1]! : null
}

export function lockPathFor(translationPath: string): string {
  return translationPath.replace(/\.md$/i, '.lock.json')
}

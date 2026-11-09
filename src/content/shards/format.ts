import type { LinkIndex } from '../links'
import type { Chapter, ContentIssue, Guide, ReelMeta, UnitMeta } from '../model'
import type { VaultFile } from '../sources/vault-fs'
import type { TranslationInfo } from '../i18n/files'

// The on-disk shape of the shards in `<vault>/.snapshot/` (docs/fullstack/stage1/01-storage.md §3.1).
//   manifest.json          human-readable: see Manifest in ../store.ts
//   index.v8.br            v8 + brotli: ShardIndex — everything resident, no unit bodies
//   guides/<guide>.pack    one pack per guide: separately brotli'd JSON sections, located by ShardIndex.sections
//   search.json.br         MiniSearch.toJSON() of the global search index
//   units-sync.json.br     the rows the `units` table mirrors

export const SHARDS_FORMAT = 1

// [offset, length] of a brotli'd JSON section inside the pack
export type Range = readonly [number, number]

export interface GuideSections {
  pack: string
  // chapter id → { units, reels } (chapters with neither have no section)
  chapters: Record<string, Range>
  // the guide's `_placement` bank: LearningUnit[]
  placement: Range | null
  // [chapterId, plainText][] — the cron and the build only
  text: Range | null
}

export interface ShardIndex {
  format: number
  v8: string
  fingerprint: string
  guides: Guide[]
  chapters: Chapter[]
  placementChapters: Chapter[]
  units: UnitMeta[]
  placementUnits: UnitMeta[]
  reels: ReelMeta[]
  translations: Map<string, Map<string, TranslationInfo>>
  backlinks: Map<string, string[]>
  links: LinkIndex
  issues: ContentIssue[]
  error: string | null
  files: VaultFile[]
  sections: Record<string, GuideSections>
}

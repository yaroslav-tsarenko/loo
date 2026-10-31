import { slugifySegment } from '../ids'
import type { LinkIndex } from '../links'
import type { Chapter, ChapterKind, ChapterMeta, ContentIssue, Guide, GuidePart, Level, LearningUnit, TreeNode } from '../model'
import { parseWikiTarget } from '../parse/obsidian'
import type { ExtractResult } from '../parse/extract'
import type { FileInfo } from '../parse/scan'
import type { VaultFile } from '../sources/vault-fs'
import { iconRef } from '../icons'
import { capitalize, indexPriority, isIndexName, parseName, titleFrom } from './names'

export interface ParsedFile {
  file: VaultFile
  meta: ChapterMeta
  info: FileInfo
  full: ExtractResult | null
  chapterId: string
  issues: ContentIssue[]
}

export interface BuiltGuide {
  guide: Guide
  chapters: Chapter[]
  units: LearningUnit[]
  issues: ContentIssue[]
  // placement-test bank files (`_placement/` or `placement: true`): kept out of the tree, chapters and search
  placement: { chapters: Chapter[]; units: LearningUnit[] }
}

export const PLACEMENT_DIR = '_placement'

// A placement bank file (docs/LANGUAGE_COURSE.md «Банк вступного тесту»): `<Guide>/_placement/B2.md` or
// frontmatter `placement: true`. Not theory — its questions only feed the course's placement test.
export function isPlacementFile(p: Pick<ParsedFile, 'file' | 'meta'>): boolean {
  return p.meta.placement === true || p.file.relInGuide.split('/')[0]?.toLowerCase() === PLACEMENT_DIR
}

const PART = /^\s*(\p{Extended_Pictographic}\uFE0F?)?\s*(.+?)\s*:\s*(\d+)\s*[-–]\s*(\d+)\s*$/u

// "🧱 Ядро мови: 1-7" → stage of the learning path covering chapters 1..7 (the emoji becomes an icon ref).
export function parseParts(raw: readonly string[]): GuidePart[] {
  const out: GuidePart[] = []
  for (const line of raw) {
    const m = PART.exec(line)
    if (m) out.push({ icon: iconRef(m[1]), title: m[2]!, from: Number(m[3]), to: Number(m[4]) })
  }
  return out
}

export function guideIdFor(dir: string, indexMeta: ChapterMeta | null): string {
  return indexMeta?.slug ?? slugifySegment(dir)
}

export function chapterIdFor(guideId: string, file: VaultFile, meta: ChapterMeta): string {
  return meta.id ?? `${guideId}/${file.relInGuide.replace(/\.md$/i, '')}`
}

export function pickIndex(dir: string, files: readonly VaultFile[]): VaultFile | null {
  const rootFiles = files.filter((f) => !f.relInGuide.includes('/') && f.ext === '.md' && isIndexName(f.name, dir))
  rootFiles.sort((a, b) => indexPriority(a.name, dir) - indexPriority(b.name, dir))
  return rootFiles[0] ?? null
}

interface Sortable {
  order: number | null
  birthtimeMs: number
  mtimeMs: number
  name: string
}

function compareSortable(a: Sortable, b: Sortable): number {
  if (a.order !== null && b.order !== null && a.order !== b.order) return a.order - b.order
  if (a.order !== null && b.order === null) return -1
  if (a.order === null && b.order !== null) return 1
  if (Math.abs(a.birthtimeMs - b.birthtimeMs) > 500) return a.birthtimeMs - b.birthtimeMs
  if (Math.abs(a.mtimeMs - b.mtimeMs) > 500) return a.mtimeMs - b.mtimeMs
  return a.name.localeCompare(b.name, 'uk', { numeric: true })
}

function estimate(info: FileInfo, meta: ChapterMeta): number {
  if (meta.estimatedMinutes !== undefined) return meta.estimatedMinutes
  return Math.max(1, Math.round(info.wordCount / 190 + info.codeBlocks / 3))
}

interface DirNode {
  name: string
  rel: string
  files: ParsedFile[]
  dirs: Map<string, DirNode>
}

export function buildGuide(dir: string, parsed: readonly ParsedFile[], links: LinkIndex, guideId: string): BuiltGuide {
  const issues: ContentIssue[] = []
  const indexFile = pickIndex(dir, parsed.map((p) => p.file))
  const indexParsed = indexFile ? parsed.find((p) => p.file.path === indexFile.path) ?? null : null
  const indexMeta = indexParsed?.meta ?? null

  const linkOrder = new Map<string, number>()
  if (indexParsed) {
    indexParsed.info.links.forEach((link, i) => {
      const res = links.resolve(link.target, indexParsed.file.path)
      if (res.kind === 'guide-file' && !linkOrder.has(res.path)) linkOrder.set(res.path, i)
    })
  }

  const rootNode: DirNode = { name: dir, rel: '', files: [], dirs: new Map() }
  const placement: BuiltGuide['placement'] = { chapters: [], units: [] }
  for (const p of parsed) {
    if (p === indexParsed) continue
    if (isPlacementFile(p)) {
      placement.chapters.push({
        id: p.chapterId,
        guideId,
        path: p.file.path,
        slug: [],
        title: p.meta.title ?? titleFrom(p.info.h1, p.file.name, dir),
        number: null,
        kind: 'chapter',
        level: p.meta.level ?? null,
        tags: p.info.tags,
        prerequisiteRefs: [],
        prerequisites: [],
        estimatedMinutes: 0,
        unitIds: p.full ? p.full.units.map((u) => u.id) : [],
        outgoingLinks: [],
        birthtimeMs: p.file.birthtimeMs,
        mtimeMs: p.file.mtimeMs,
        description: null,
        icon: null,
      })
      if (p.full) placement.units.push(...p.full.units)
      issues.push(...p.issues)
      continue
    }
    const parts = p.file.relInGuide.split('/')
    let node = rootNode
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]!
      let next = node.dirs.get(part)
      if (!next) {
        next = { name: part, rel: node.rel ? `${node.rel}/${part}` : part, files: [], dirs: new Map() }
        node.dirs.set(part, next)
      }
      node = next
    }
    node.files.push(p)
  }

  const chapters: Chapter[] = []
  const units: LearningUnit[] = []
  const usedSlugs = new Set<string>()
  const chapterIds: string[] = []

  const makeSlug = (segments: string[]): string[] => {
    const joined = segments.join('/')
    let candidate = joined
    let n = 2
    while (usedSlugs.has(candidate)) candidate = `${joined}-${n++}`
    usedSlugs.add(candidate)
    return candidate.split('/')
  }

  const toChapter = (p: ParsedFile, kind: ChapterKind, parentSlug: string[], exactSlug?: string[]): Chapter => {
    const parsedName = parseName(p.file.name, dir)
    const title = p.meta.title ?? titleFrom(p.info.h1, p.file.name, dir)
    const numberLabel = parsedName.label ?? (parsedName.number !== null ? String(parsedName.number).padStart(2, '0') : null)
    // frontmatter `slug:` (Latin, stable across renames and translations) wins over the slug derived from the file name
    const segment = slugifySegment(p.meta.slug ?? (numberLabel !== null ? `${numberLabel} ${parsedName.rest}` : parsedName.rest)) || 'note'
    const slug = kind === 'index' ? [] : exactSlug ? makeSlug(exactSlug) : makeSlug([...parentSlug, segment])
    const level: Level | null = p.meta.level ?? null
    const chapter: Chapter = {
      id: p.chapterId,
      guideId,
      path: p.file.path,
      slug,
      title,
      number: p.meta.order ?? parsedName.number,
      kind,
      level,
      tags: p.info.tags,
      prerequisiteRefs: p.meta.prerequisites,
      prerequisites: [],
      estimatedMinutes: estimate(p.info, p.meta),
      unitIds: p.full ? p.full.units.map((u) => u.id) : [],
      outgoingLinks: [],
      birthtimeMs: p.file.birthtimeMs,
      mtimeMs: p.file.mtimeMs,
      description: p.meta.description ?? (kind === 'chapter' ? null : p.info.lead),
      icon: iconRef(p.meta.icon),
      ...(p.meta.skill ? { skill: p.meta.skill } : {}),
    }
    chapters.push(chapter)
    if (p.full) units.push(...p.full.units)
    issues.push(...p.issues)
    return chapter
  }

  const buildLevel = (node: DirNode, parentSlug: string[]): TreeNode[] => {
    type Item = { sortable: Sortable; build: () => TreeNode }
    const items: Item[] = []
    for (const p of node.files) {
      const parsedName = parseName(p.file.name, dir)
      const linkPos = linkOrder.get(p.file.path)
      const order = p.meta.order ?? parsedName.number ?? (linkPos !== undefined ? linkPos - 1000 : null)
      items.push({
        sortable: { order, birthtimeMs: p.file.birthtimeMs, mtimeMs: p.file.mtimeMs, name: p.file.name },
        build: () => {
          const chapter = toChapter(p, 'chapter', parentSlug)
          chapterIds.push(chapter.id)
          return { kind: 'chapter', id: chapter.id }
        },
      })
    }
    for (const sub of node.dirs.values()) {
      const parsedName = parseName(sub.name, dir)
      const overview =
        sub.files.find((f) => {
          const n = parseName(f.file.name, dir).rest.toLowerCase()
          return n === parsedName.rest.toLowerCase() || f.file.name.toLowerCase() === sub.name.toLowerCase()
        }) ?? null
      const birth = Math.min(...sub.files.map((f) => f.file.birthtimeMs), Number.POSITIVE_INFINITY)
      const mtime = Math.min(...sub.files.map((f) => f.file.mtimeMs), Number.POSITIVE_INFINITY)
      const linked = sub.files.map((f) => linkOrder.get(f.file.path)).filter((v): v is number => v !== undefined)
      const order = parsedName.number ?? (linked.length > 0 ? Math.min(...linked) - 1000 : null)
      items.push({
        sortable: { order, birthtimeMs: Number.isFinite(birth) ? birth : 0, mtimeMs: Number.isFinite(mtime) ? mtime : 0, name: sub.name },
        build: () => {
          const groupSegment = slugifySegment(parsedName.number !== null ? `${String(parsedName.number).padStart(2, '0')} ${parsedName.rest}` : parsedName.rest) || 'part'
          const slugBase = [...parentSlug, groupSegment]
          let overviewId: string | null = null
          if (overview) {
            const chapter = toChapter(overview, 'overview', slugBase, slugBase)
            chapterIds.push(chapter.id)
            overviewId = chapter.id
          }
          const rest: DirNode = { ...sub, files: sub.files.filter((f) => f !== overview) }
          const children = buildLevel(rest, slugBase)
          return {
            kind: 'group',
            id: `${guideId}/${sub.rel}`,
            title: overview ? overview.meta.title ?? titleFrom(overview.info.h1, overview.file.name, dir) : capitalize(parsedName.rest),
            overviewId,
            children,
          }
        },
      })
    }
    items.sort((a, b) => compareSortable(a.sortable, b.sortable))
    return items.map((item) => item.build())
  }

  let indexChapterId: string | null = null
  if (indexParsed) {
    const chapter = toChapter(indexParsed, 'index', [])
    indexChapterId = chapter.id
  }
  const tree = buildLevel(rootNode, [])

  const byPath = new Map(chapters.map((c) => [c.path, c]))
  for (const chapter of chapters) {
    const p = parsed.find((x) => x.chapterId === chapter.id)
    if (!p) continue
    const outgoing = new Set<string>()
    for (const link of p.info.links) {
      const res = links.resolve(link.target, chapter.path)
      if (res.kind === 'guide-file') outgoing.add(res.path)
      else if (res.kind === 'missing') {
        issues.push({ severity: 'warning', code: 'broken-link', path: chapter.path, message: `Битий лінк [[${link.target}]]` })
      }
    }
    chapter.outgoingLinks = [...outgoing]
    chapter.prerequisites = chapter.prerequisiteRefs
      .map((ref) => {
        const inner = /^\[\[(.+)\]\]$/.exec(ref.trim())
        const target = inner ? parseWikiTarget(inner[1]!, false).target : ref
        const res = links.resolve(target, chapter.path)
        return res.kind === 'guide-file' ? byPath.get(res.path)?.id ?? null : null
      })
      .filter((v): v is string => v !== null)
  }

  const totalMinutes = chapters.filter((c) => c.kind !== 'index').reduce((sum, c) => sum + c.estimatedMinutes, 0)
  const guide: Guide = {
    id: guideId,
    dir,
    title: indexMeta?.title ?? dir,
    description: indexMeta?.description ?? (indexChapterId ? chapters.find((c) => c.id === indexChapterId)?.description ?? null : null),
    order: indexMeta?.order ?? Number.POSITIVE_INFINITY,
    level: indexMeta?.level ?? null,
    tags: indexMeta?.tags ?? [],
    prerequisites: indexMeta?.prerequisites ?? [],
    estimatedMinutes: indexMeta?.estimatedMinutes ?? totalMinutes,
    indexChapterId,
    tree,
    chapterIds,
    parts: parseParts(indexMeta?.parts ?? []),
    icon: iconRef(indexMeta?.icon),
  }
  return { guide, chapters, units, issues, placement }
}

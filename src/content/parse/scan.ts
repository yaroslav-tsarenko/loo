import { parse as parseYaml } from 'yaml'
import type { ChapterMeta } from '../model'
import { normalizeMeta } from './markdown'
import type { WikiLink } from './nodes'
import { parseWikiTarget } from './obsidian'

export interface FileInfo {
  meta: ChapterMeta
  metaError: string | null
  h1: string | null
  links: WikiLink[]
  tags: string[]
  wordCount: number
  codeBlocks: number
  plainText: string
  lead: string | null
  hasUnitCallouts: boolean
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const FENCE = /^((?:>\s?)*)\s{0,3}(`{3,}|~{3,})/
const WIKI = /(!?)\[\[([^\]\n]+?)\]\]/g
const TAG = /(^|[\s(])#([\p{L}_][\p{L}\p{N}_/-]*)/gu
const INLINE_CODE = /`[^`\n]*`/g
// viz/figure header and its meta line are not prose: never a chapter lead
const VIZ_LINE = /^(?:>\s?)+(\[!(viz|visualization|візуалізація|figure|scene|сцена)\]|scenario\s*:)/i

export function plainInline(text: string): string {
  return text
    .replace(/!?\[\[([^\]|\n]+)\|([^\]\n]+)\]\]/g, '$2')
    .replace(/!?\[\[([^\]\n]+)\]\]/g, '$1')
    .replace(/!?\[([^\]\n]*)\]\([^)\n]*\)/g, '$1')
    .replace(/`([^`\n]*)`/g, '$1')
    .replace(/(\*\*|__|==|~~)(.+?)\1/g, '$2')
    .replace(/(^|[^\w*])[*_]([^*_\n]+)[*_](?=[^\w*]|$)/g, '$1$2')
    .trim()
}

export function scanFile(source: string, unitTypes: ReadonlySet<string>): FileInfo {
  let meta: ChapterMeta = { tags: [], prerequisites: [] }
  let metaError: string | null = null
  let body = source
  const fm = FRONTMATTER.exec(source)
  if (fm) {
    body = source.slice(fm[0].length)
    try {
      const data: unknown = parseYaml(fm[1]!)
      if (data && typeof data === 'object' && !Array.isArray(data)) meta = normalizeMeta(data as Record<string, unknown>)
    } catch (error) {
      metaError = error instanceof Error ? error.message : String(error)
    }
  }
  const lines = body.split(/\r?\n/)
  const prose: string[] = []
  let fence: string | null = null
  let codeBlocks = 0
  let h1: string | null = null
  let hasUnitCallouts = false
  let lead: string | null = null
  for (const line of lines) {
    const f = FENCE.exec(line)
    if (fence) {
      if (f && f[2]!.startsWith(fence[0]!) && f[2]!.length >= fence.length && line.replace(FENCE, '').trim() === '') fence = null
      continue
    }
    if (f) {
      fence = f[2]!
      codeBlocks++
      continue
    }
    if (!h1) {
      const h = /^#\s+(.+?)\s*#*\s*$/.exec(line)
      if (h) h1 = plainInline(h[1]!)
    }
    if (!hasUnitCallouts) {
      const c = /^(?:>\s?)+\[!([A-Za-z][\w-]*)\]/.exec(line)
      if (c && unitTypes.has(c[1]!.toLowerCase())) hasUnitCallouts = true
    }
    if (VIZ_LINE.test(line)) continue
    if (!lead && h1 !== null && line.trim() && !/^#{1,6}\s/.test(line) && !/^(-{3,}|\*{3,})$/.test(line.trim())) {
      const candidate = plainInline(line.replace(/^(?:>\s?)+/, '').replace(/^\[![\p{L}\p{N}_-]+\][+-]?/u, ''))
      if (candidate && !/^[-*+|]/.test(candidate)) lead = candidate.length > 280 ? `${candidate.slice(0, 277)}…` : candidate
    }
    prose.push(line)
  }
  const text = prose.join('\n').replace(/%%[\s\S]*?%%/g, '')
  const noCode = text.replace(INLINE_CODE, ' ')
  const links: WikiLink[] = []
  for (const m of noCode.matchAll(WIKI)) links.push(parseWikiTarget(m[2]!, m[1] === '!'))
  const tags = new Set(meta.tags)
  for (const m of noCode.matchAll(TAG)) {
    if (!/^[\d/_-]+$/.test(m[2]!)) tags.add(m[2]!.replace(/\/+$/, ''))
  }
  const plainText = plainInline(
    text
      .replace(/^(?:>\s?)*\[![\p{L}\p{N}_-]+\][+-]?/gmu, '')
      .replace(/^(?:>\s?)+/gm, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^\s*[-*+]\s+(\[[ xX]\]\s+)?/gm, '')
      .replace(/^\|.*\|$/gm, (row) => row.replace(/\|/g, ' ').replace(/-{3,}/g, ' ')),
  )
  const wordCount = plainText.split(/\s+/).filter(Boolean).length
  return { meta, metaError, h1, links, tags: [...tags], wordCount, codeBlocks, plainText, lead, hasUnitCallouts }
}

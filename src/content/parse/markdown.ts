import type { Root } from 'mdast'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { parse as parseYaml } from 'yaml'
import { LEVELS, type ChapterMeta, type Level } from '../model'
import { applyObsidian } from './obsidian'

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter, ['yaml'])

export interface ParsedMarkdown {
  root: Root
  meta: ChapterMeta
  metaError: string | null
}

export function toLevel(value: unknown): Level | null {
  if (typeof value !== 'string') return null
  const normalized = value.toLowerCase().replace(/[\s_-]+/g, '')
  if (normalized === 'teamlead' || normalized === 'lead') return 'techlead'
  return (LEVELS as readonly string[]).includes(normalized) ? (normalized as Level) : null
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string | number => typeof v === 'string' || typeof v === 'number').map(String)
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value)
  return undefined
}

function toText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function normalizeMeta(data: Record<string, unknown>): ChapterMeta {
  const meta: ChapterMeta = {
    tags: toStringList(data.tags).map((t) => t.replace(/^#/, '')),
    prerequisites: toStringList(data.prerequisites),
  }
  const title = toText(data.title)
  if (title) meta.title = title
  const order = toNumber(data.order)
  if (order !== undefined) meta.order = order
  const level = toLevel(data.level)
  if (level) meta.level = level
  const minutes = toNumber(data.estimatedMinutes)
  if (minutes !== undefined) meta.estimatedMinutes = minutes
  const id = toText(data.id)
  if (id) meta.id = id
  if (data.kind === 'qa') meta.kind = 'qa'
  const slug = toText(data.slug)
  if (slug) meta.slug = slug
  const description = toText(data.description)
  if (description) meta.description = description
  const parts = toStringList(data.parts)
  if (parts.length) meta.parts = parts
  const icon = toText(data.icon)
  // bare emoji ≤ 8 chars; library refs (`si:SiJavascript`, COURSE_FORMAT §6) keep their full name
  if (icon) meta.icon = /^(si|pi|tb|lucide|emoji):/.test(icon) ? icon.slice(0, 64) : icon.slice(0, 8)
  const guide = toText(data.guide)
  if (guide) meta.guide = guide
  return meta
}

export function parseMarkdown(source: string): ParsedMarkdown {
  const root = processor.parse(source) as Root
  let meta: ChapterMeta = { tags: [], prerequisites: [] }
  let metaError: string | null = null
  const first = root.children[0]
  if (first?.type === 'yaml') {
    try {
      const data: unknown = parseYaml(first.value)
      if (data && typeof data === 'object' && !Array.isArray(data)) meta = normalizeMeta(data as Record<string, unknown>)
    } catch (error) {
      metaError = error instanceof Error ? error.message : String(error)
    }
    root.children.shift()
  }
  applyObsidian(root)
  return { root, meta, metaError }
}

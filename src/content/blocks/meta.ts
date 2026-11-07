import type { Paragraph, PhrasingContent, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { FREQUENCIES, LEVELS, type Level } from '../model'
import { toLevel } from '../level'

export interface LineMeta {
  values: Record<string, string>
  flags: string[]
  code: string[]
}

const KEY_VALUE = /^([a-zA-Z][\w-]*)\s*:\s*(.+)$/

export function readMetaParagraph(node: RootContent | undefined): LineMeta | null {
  if (!node || node.type !== 'paragraph') return null
  const text = toString(node).trim()
  if (!text || text.includes('\n')) return null
  const parts = text.split('·').map((p) => p.trim()).filter(Boolean)
  const values: Record<string, string> = {}
  const flags: string[] = []
  let keyed = 0
  for (const part of parts) {
    const m = KEY_VALUE.exec(part)
    if (m) {
      values[m[1]!.toLowerCase()] = m[2]!.trim()
      keyed++
    } else flags.push(part)
  }
  const code = collectInlineCode(node)
  if (keyed === 0 && code.length === 0 && !(text.includes('·') && text.length <= 80)) return null
  return { values, flags, code }
}

function collectInlineCode(node: Paragraph): string[] {
  const out: string[] = []
  const walk = (children: PhrasingContent[]) => {
    for (const child of children) {
      if (child.type === 'inlineCode') out.push(child.value)
      else if ('children' in child) walk(child.children as PhrasingContent[])
    }
  }
  walk(node.children)
  return out
}

export function frequencyFrom(values: readonly string[]): string | null {
  for (const v of values) {
    const lower = v.toLowerCase()
    if ((FREQUENCIES as readonly string[]).includes(lower)) return lower
  }
  return null
}

export function levelFrom(values: readonly string[]): Level | null {
  for (const v of values) {
    const level = toLevel(v)
    if (level) return level
  }
  return null
}

export function levelFromHeading(text: string): Level | null {
  const m = /\b(junior|middle|senior|tech\s*lead|team\s*lead)\b/i.exec(text)
  return m ? toLevel(m[1]!) : null
}

export function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value)
}

export function splitTags(value: string | undefined): string[] {
  if (!value) return []
  return value.split(/[,\s]+/).map((t) => t.replace(/^#/, '').trim()).filter(Boolean)
}

// ```js starter title="x" → ['starter', 'title="x"']; the lang itself counts too (```order)
export function fenceWords(node: { lang?: string | null; meta?: string | null }): string[] {
  return [node.lang ?? '', ...(node.meta ?? '').split(/\s+/)].map((w) => w.toLowerCase()).filter(Boolean)
}

// Placement bank items (docs/LANGUAGE_COURSE.md «Банк вступного тесту»): `skill: reading · diff: 3` → fields of the
// unit. Raw values are kept as written (lower-cased); the course compiler validates them.
export function placementFields(skill: string | null | undefined, diff: string | null | undefined): { skill?: string; diff?: number } {
  const out: { skill?: string; diff?: number } = {}
  const s = skill?.trim().toLowerCase()
  if (s) out.skill = s
  const d = diff?.trim()
  if (d) out.diff = /^\d+$/.test(d) ? Number(d) : Number.NaN
  return out
}

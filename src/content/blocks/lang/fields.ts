import type { Paragraph, PhrasingContent, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'

// Field lines of the language blocks (docs/LANGUAGE_COURSE.md):
//
//   > [!word] apple
//   > ipa: /ˈæp.əl/ · pos: noun · level: A1 · id: en-a1-food-w01
//   > uk: яблуко
//   > example: I eat an **apple** every day. — Я їм яблуко щодня.
//
// In markdown the callout lines without a blank `>` between them are ONE paragraph with soft line breaks, so the
// reader splits paragraphs into lines. A line is a field when it starts with a known `key:`; a `·`-separated line
// is several fields when every part is `known-key: value`. Anything else stays in `rest` (rendered as the body).

export interface Field {
  key: string
  // plain text of the value
  text: string
  // the value with its inline markup (bold, code…), for examples
  phrasing: PhrasingContent[]
}

export interface FieldRead {
  fields: Field[]
  rest: RootContent[]
}

const KEY = /^\s*([a-zA-Z][\w-]*)\s*:\s*/

export const fieldKey = (raw: string): string => raw.toLowerCase().replace(/_/g, '-')

// Splits a paragraph at soft line breaks (`\n` in text nodes) and hard breaks.
export function paragraphLines(p: Paragraph): PhrasingContent[][] {
  const lines: PhrasingContent[][] = [[]]
  for (const child of p.children) {
    if (child.type === 'break') {
      lines.push([])
      continue
    }
    if (child.type !== 'text' || !child.value.includes('\n')) {
      lines.at(-1)!.push(child)
      continue
    }
    const parts = child.value.split('\n')
    parts.forEach((part, i) => {
      if (i > 0) lines.push([])
      if (part) lines.at(-1)!.push({ type: 'text', value: part })
    })
  }
  return lines.filter((l) => l.length > 0 && toString({ type: 'paragraph', children: l }).trim() !== '')
}

// `key: value` at the start of a line → the value with the key stripped from the first text node.
function lineField(line: PhrasingContent[], keys: ReadonlySet<string>): Field | null {
  const first = line[0]
  if (!first || first.type !== 'text') return null
  const m = KEY.exec(first.value)
  if (!m) return null
  const key = fieldKey(m[1]!)
  if (!keys.has(key)) return null
  const head = first.value.slice(m[0].length)
  const phrasing: PhrasingContent[] = head ? [{ type: 'text', value: head }, ...line.slice(1)] : line.slice(1)
  return { key, text: toString({ type: 'paragraph', children: phrasing }).trim(), phrasing }
}

// `level: A1 · type: choice · id: x` → three fields (only when every part is a known key).
function metaLine(line: PhrasingContent[], keys: ReadonlySet<string>): Field[] | null {
  const text = toString({ type: 'paragraph', children: line })
  if (!text.includes('·')) return null
  const parts = text
    .split('·')
    .map((p) => p.trim())
    .filter(Boolean)
  const out: Field[] = []
  for (const part of parts) {
    const m = KEY.exec(part)
    if (!m || !keys.has(fieldKey(m[1]!))) return null
    const value = part.slice(m[0].length).trim()
    out.push({ key: fieldKey(m[1]!), text: value, phrasing: value ? [{ type: 'text', value }] : [] })
  }
  return out.length > 0 ? out : null
}

export function readFields(children: readonly RootContent[], keys: ReadonlySet<string>): FieldRead {
  const fields: Field[] = []
  const rest: RootContent[] = []
  for (const node of children) {
    if (node.type !== 'paragraph') {
      rest.push(node)
      continue
    }
    const loose: PhrasingContent[][] = []
    let found = 0
    for (const line of paragraphLines(node)) {
      const many = metaLine(line, keys)
      const one = many ? null : lineField(line, keys)
      if (many) fields.push(...many)
      else if (one) fields.push(one)
      else {
        loose.push(line)
        continue
      }
      found++
    }
    // no fields here: keep the paragraph as written
    if (found === 0) rest.push(node)
    else if (loose.length > 0) {
      const joined: PhrasingContent[] = []
      loose.forEach((line, i) => {
        if (i > 0) joined.push({ type: 'text', value: '\n' })
        joined.push(...line)
      })
      rest.push({ type: 'paragraph', children: joined })
    }
  }
  return { fields, rest }
}

export class FieldBag {
  constructor(readonly list: readonly Field[]) {}

  get(key: string, ...aliases: string[]): Field | undefined {
    return this.list.find((f) => f.key === key || aliases.includes(f.key))
  }

  text(key: string, ...aliases: string[]): string | null {
    const value = this.get(key, ...aliases)?.text.trim()
    return value ? value : null
  }

  all(key: string, ...aliases: string[]): Field[] {
    return this.list.filter((f) => f.key === key || aliases.includes(f.key))
  }
}

// `/ˈæp.əl/` · `[ˈæp.əl]` · `ˈæp.əl` → `/ˈæp.əl/`
export function ipaOf(value: string | null): string | null {
  if (!value) return null
  const inner = value.trim().replace(/^[/[]\s*|\s*[/\]]$/g, '')
  return inner ? `/${inner}/` : null
}

const CYRILLIC = /[\u0400-\u04FF]/

// «I eat an apple. — Я їм яблуко.» → ['I eat an apple.', 'Я їм яблуко.'];
// «Are you sure? — Yes, I am. — Ти впевнений? — Так.» → ['Are you sure? — Yes, I am.', 'Ти впевнений? — Так.']
export function splitTranslation(value: string): [string, string | null] {
  const dashes = [...value.matchAll(/\s+[—–-]\s+/g)]
  // the last dash with only English before it (a dialogue «A? — B.» stays together) and the translation after it
  const split = dashes.filter((d) => !CYRILLIC.test(value.slice(0, d.index)) && CYRILLIC.test(value.slice(d.index + d[0].length))).at(-1)
  if (split) return [value.slice(0, split.index).trim(), value.slice(split.index + split[0].length).trim()]
  const last = dashes.filter((d) => d[0].includes('—') || d[0].includes('–')).at(-1)
  return last ? [value.slice(0, last.index).trim(), value.slice(last.index + last[0].length).trim()] : [value.trim(), null]
}

// Text of the bold runs in a value (the headword highlighted in an example).
export function boldWords(phrasing: readonly PhrasingContent[]): string[] {
  const out: string[] = []
  const walk = (nodes: readonly PhrasingContent[]) => {
    for (const n of nodes) {
      if (n.type === 'strong') out.push(toString(n).trim())
      else if ('children' in n) walk(n.children as PhrasingContent[])
    }
  }
  walk(phrasing)
  return out.filter(Boolean)
}

export const isSlow = (value: string | null): boolean => value !== null && /^(slow|повільно|0?\.\d+)$/i.test(value.trim())

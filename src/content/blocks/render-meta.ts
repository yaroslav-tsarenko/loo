import type { Paragraph, RootContent } from 'mdast'
import type { Callout } from '../parse/nodes'

const PAIR = /^\s*([a-z][\w-]*)\s*:\s*(\S.*?)\s*$/i

// Reads an optional `key: value · key: value` first line of a render block;
// everything after it is the caption. Works with or without a blank `>` line.
export function readMetaLine(node: Callout): { values: Record<string, string>; rest: Callout['children'] } {
  const children = [...node.children] as RootContent[]
  const values: Record<string, string> = {}
  const first = children[0]
  const lead = first?.type === 'paragraph' ? first.children[0] : undefined
  if (first?.type !== 'paragraph' || lead?.type !== 'text') return { values, rest: node.children }
  const newline = lead.value.indexOf('\n')
  const line = newline < 0 ? lead.value : lead.value.slice(0, newline)
  // a meta line must be the whole first text line (no inline markup after it)
  if (newline < 0 && first.children.length > 1) return { values, rest: node.children }
  const parts = line.split('·')
  const pairs = parts.map((p) => PAIR.exec(p))
  if (pairs.length === 0 || pairs.some((m) => !m)) return { values, rest: node.children }
  for (const m of pairs) values[m![1]!.toLowerCase()] = m![2]!
  const remaining = newline < 0 ? '' : lead.value.slice(newline + 1)
  const phrasing: Paragraph['children'] = remaining ? [{ type: 'text', value: remaining }, ...first.children.slice(1)] : first.children.slice(1)
  if (phrasing.length > 0) children[0] = { type: 'paragraph', children: phrasing }
  else children.shift()
  return { values, rest: children as Callout['children'] }
}

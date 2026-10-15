import type { Blockquote, Paragraph, Parent, PhrasingContent, Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { SKIP, visit } from 'unist-util-visit'
import type { Callout, CalloutFold, IdMarker, Mark, Tag, WikiLink } from './nodes'
import './nodes'

const CALLOUT_HEAD = /^\[!(\p{L}[\p{L}\p{N}_-]*)\]([+-]?)[ \t]*/u
const ID_MARKER = /^%%\s*id:\s*([\w:.-]+)\s*%%$/
const COMMENT = /%%[\s\S]*?%%/g
const INLINE = /(!?)\[\[([^\]\n]+?)\]\]|==([^=\n][^\n]*?)==|(^|[\s(])#([\p{L}_][\p{L}\p{N}_/-]*)/gu

function splitAtNewline(nodes: PhrasingContent[]): { head: PhrasingContent[]; tail: PhrasingContent[] } {
  const head: PhrasingContent[] = []
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!
    if (node.type === 'break') {
      return { head, tail: nodes.slice(i + 1) }
    }
    if (node.type === 'text') {
      const at = node.value.indexOf('\n')
      if (at >= 0) {
        const before = node.value.slice(0, at)
        const after = node.value.slice(at + 1)
        if (before) head.push({ type: 'text', value: before })
        const tail: PhrasingContent[] = after ? [{ type: 'text', value: after }] : []
        return { head, tail: tail.concat(nodes.slice(i + 1)) }
      }
    }
    head.push(node)
  }
  return { head, tail: [] }
}

function trimPhrasing(nodes: PhrasingContent[]): PhrasingContent[] {
  const out = nodes.slice()
  const first = out[0]
  if (first?.type === 'text') {
    const value = first.value.replace(/^\s+/, '')
    if (value) out[0] = { type: 'text', value }
    else out.shift()
  }
  const last = out[out.length - 1]
  if (last?.type === 'text') {
    const value = last.value.replace(/\s+$/, '')
    if (value) out[out.length - 1] = { type: 'text', value }
    else out.pop()
  }
  return out
}

function toCallout(node: Blockquote): Callout | null {
  const first = node.children[0]
  if (!first || first.type !== 'paragraph') return null
  const lead = first.children[0]
  if (!lead || lead.type !== 'text') return null
  const match = CALLOUT_HEAD.exec(lead.value)
  if (!match) return null
  const calloutType = match[1]!.toLowerCase()
  const foldMark = match[2]
  const fold: CalloutFold = foldMark === '-' ? 'closed' : foldMark === '+' ? 'open' : null
  const rest = lead.value.slice(match[0].length)
  const lead0: PhrasingContent[] = rest ? [{ type: 'text', value: rest }] : []
  const inline: PhrasingContent[] = lead0.concat(first.children.slice(1))
  const { head, tail } = splitAtNewline(inline)
  const children = node.children.slice(1)
  const tailTrimmed = trimPhrasing(tail)
  if (tailTrimmed.length > 0) {
    const paragraph: Paragraph = { type: 'paragraph', children: tailTrimmed }
    children.unshift(paragraph)
  }
  return { type: 'callout', calloutType, fold, title: trimPhrasing(head), children, position: node.position }
}

export function transformCallouts(tree: Root): void {
  visit(tree, 'blockquote', (node, index, parent) => {
    if (!parent || index === undefined) return
    const callout = toCallout(node)
    if (callout) {
      transformCallouts({ type: 'root', children: callout.children as RootContent[] })
      ;(parent as Parent).children[index] = callout
      return SKIP
    }
    return undefined
  })
}

export function transformComments(tree: Root): void {
  visit(tree, 'paragraph', (node, index, parent) => {
    if (!parent || index === undefined) return
    const text = toString(node).trim()
    const marker = ID_MARKER.exec(text)
    if (marker) {
      const idMarker: IdMarker = { type: 'idMarker', value: marker[1]! }
      ;(parent as Parent).children[index] = idMarker as never
      return SKIP
    }
    if (!text.includes('%%')) return undefined
    for (const child of node.children) {
      if (child.type === 'text') child.value = child.value.replace(COMMENT, '')
    }
    if (toString(node).trim() === '') {
      ;(parent as Parent).children.splice(index, 1)
      return [SKIP, index]
    }
    return undefined
  })
}

export function parseWikiTarget(raw: string, embed: boolean): WikiLink {
  let body = raw
  let alias: string | null = null
  const pipe = body.indexOf('|')
  if (pipe >= 0) {
    alias = body.slice(pipe + 1).trim()
    body = body.slice(0, pipe)
  }
  let heading: string | null = null
  const hash = body.indexOf('#')
  if (hash >= 0) {
    heading = body.slice(hash + 1).replace(/^\^/, '').trim() || null
    body = body.slice(0, hash)
  }
  let width: number | null = null
  if (embed && alias && /^\d+(x\d+)?$/.test(alias)) {
    width = Number(alias.split('x')[0])
    alias = null
  }
  return { type: 'wikiLink', target: body.trim(), heading, alias, embed, width }
}

function splitText(value: string): PhrasingContent[] | null {
  INLINE.lastIndex = 0
  const out: PhrasingContent[] = []
  let cursor = 0
  let found = false
  for (const m of value.matchAll(INLINE)) {
    const start = m.index
    found = true
    if (m[2] !== undefined) {
      if (start > cursor) out.push({ type: 'text', value: value.slice(cursor, start) })
      out.push(parseWikiTarget(m[2], m[1] === '!'))
      cursor = start + m[0].length
    } else if (m[3] !== undefined) {
      if (start > cursor) out.push({ type: 'text', value: value.slice(cursor, start) })
      const mark: Mark = { type: 'mark', children: [{ type: 'text', value: m[3] }] }
      out.push(mark)
      cursor = start + m[0].length
    } else if (m[5] !== undefined) {
      if (/^[\d/_-]+$/.test(m[5])) continue
      const lead = m[4] ?? ''
      const tagStart = start + lead.length
      if (tagStart > cursor) out.push({ type: 'text', value: value.slice(cursor, tagStart) })
      const tag: Tag = { type: 'tag', value: m[5].replace(/\/+$/, '') }
      out.push(tag)
      cursor = start + m[0].length
    }
  }
  if (!found) return null
  if (cursor < value.length) out.push({ type: 'text', value: value.slice(cursor) })
  return out
}

export function transformInline(tree: Root): void {
  visit(tree, 'text', (node, index, parent) => {
    if (!parent || index === undefined) return
    if (parent.type === 'link' || parent.type === 'linkReference') return
    const parts = splitText(node.value)
    if (!parts) return
    ;(parent as Parent).children.splice(index, 1, ...parts)
    return [SKIP, index + parts.length]
  })
  visit(tree, 'callout', (node) => {
    const holder: Root = { type: 'root', children: [{ type: 'paragraph', children: node.title }] }
    transformInline(holder)
    const paragraph = holder.children[0]
    if (paragraph?.type === 'paragraph') node.title = paragraph.children
  })
}

export function applyObsidian(tree: Root): void {
  transformComments(tree)
  transformCallouts(tree)
  transformInline(tree)
}

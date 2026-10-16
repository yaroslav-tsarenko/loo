import type { Element, ElementContent, Root, RootContent, Text } from 'hast'
import { EMOJI_RE, emojiIcon } from '@/ui/design/pixel-icons/emoji-map'

// Swaps known emoji in rendered markdown for our pixel icons (<x-px>, see render.tsx). Code stays untouched; unknown
// emoji remain text and render in the Noto emoji font.
const SKIP = new Set(['code', 'pre', 'script', 'style', 'svg', 'math', 'x-px'])

function splitText(node: Text): ElementContent[] | null {
  const value = node.value
  EMOJI_RE.lastIndex = 0
  if (!EMOJI_RE.test(value)) return null
  EMOJI_RE.lastIndex = 0
  const out: ElementContent[] = []
  let last = 0
  let changed = false
  for (const m of value.matchAll(EMOJI_RE)) {
    const name = emojiIcon(m[0])
    if (!name) continue
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) })
    out.push({ type: 'element', tagName: 'x-px', properties: { dataName: name, dataEmoji: m[0] }, children: [] })
    last = m.index + m[0].length
    changed = true
  }
  if (!changed) return null
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) })
  return out
}

function walk(parent: Root | Element): void {
  const next: (RootContent | ElementContent)[] = []
  let changed = false
  for (const child of parent.children) {
    if (child.type === 'text') {
      const parts = splitText(child)
      if (parts) {
        next.push(...parts)
        changed = true
        continue
      }
    } else if (child.type === 'element' && !SKIP.has(child.tagName)) {
      walk(child)
    }
    next.push(child)
  }
  if (changed) parent.children = next as typeof parent.children
}

export function emojiToIcons<T extends Root>(tree: T): T {
  walk(tree)
  return tree
}

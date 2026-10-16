import { describe, expect, it } from 'vitest'
import type { Root } from 'hast'
import { emojiIcon } from '@/ui/design/pixel-icons/emoji-map'
import { emojiToIcons } from '@/ui/markdown/emoji-icons'
import { PIXEL_ICONS } from '@/ui/design/PixelIcon'

const p = (...children: Root['children']): Root => ({ type: 'root', children: [{ type: 'element', tagName: 'p', properties: {}, children: children as never }] })
const text = (value: string) => ({ type: 'text' as const, value })

describe('emoji → pixel icons', () => {
  it('maps known emoji with or without the variation selector', () => {
    expect(emojiIcon('⚠️')).toBe('warning')
    expect(emojiIcon('⚠')).toBe('warning')
    expect(emojiIcon('🇺🇦')).toBe('flagUa')
    expect(emojiIcon('🦄')).toBeNull()
  })

  it('every mapped icon exists', () => {
    for (const e of ['📚', '✅', '❌', '🟢', '🛠️', '🎯', '🧠', '⚡', '🎤', '🔬', '🧩', '⚙️']) expect(PIXEL_ICONS).toContain(emojiIcon(e))
  })

  it('splits text around known emoji, keeps unknown ones as text', () => {
    const tree = emojiToIcons(p(text('✅ готово, 🦄 ні, ❌')))
    const kids = (tree.children[0] as { children: { type: string; tagName?: string; value?: string; properties?: Record<string, unknown> }[] }).children
    expect(kids.map((k) => (k.type === 'text' ? k.value : `<${k.properties?.dataName}>`))).toEqual(['<check>', ' готово, 🦄 ні, ', '<cross>'])
  })

  it('leaves code alone', () => {
    const code = { type: 'element' as const, tagName: 'code', properties: {}, children: [text("'✅'.length")] }
    const tree = emojiToIcons(p(code))
    expect(JSON.stringify(tree)).toContain("'✅'.length")
    expect(JSON.stringify(tree)).not.toContain('x-px')
  })
})

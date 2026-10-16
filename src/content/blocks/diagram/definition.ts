import { toString } from 'mdast-util-to-string'
import { parseDiagram } from '../../diagram/spec'
import type { Callout, DiagramRef } from '../../parse/nodes'
import type { RenderBlockDefinition } from '../types'

// `> [!diagram] Title` + a ```yaml block (src/content/diagram/spec.ts); whatever follows the yaml is the caption.
export const diagramDefinition: RenderBlockDefinition = {
  type: 'diagram',
  aliases: ['діаграма', 'схема'],
  transform(node: Callout) {
    // `[[Environment]]` in a title is spec notation, not a vault link: keep its text
    const title = node.title
      .map((n) => (n.type === 'wikiLink' ? `[[${n.alias ?? n.target}]]` : toString(n)))
      .join('')
      .trim()
    const at = node.children.findIndex((c) => c.type === 'code')
    const code = at >= 0 ? node.children[at] : undefined
    const caption = node.children.filter((_, i) => i !== at)
    if (code?.type !== 'code') {
      const ref: DiagramRef = { type: 'diagramRef', spec: null, error: 'немає блоку ```yaml з описом схеми', children: caption }
      return { node: ref, warnings: [`[!diagram] «${title}»: немає блоку yaml`] }
    }
    const parsed = parseDiagram(title, code.value)
    if (!parsed.ok) {
      const ref: DiagramRef = { type: 'diagramRef', spec: null, error: parsed.error, children: caption }
      return { node: ref, warnings: [`[!diagram] «${title}»: ${parsed.error}`] }
    }
    const ref: DiagramRef = { type: 'diagramRef', spec: parsed.spec, error: null, children: caption }
    return { node: ref, warnings: parsed.warnings.map((w) => `[!diagram] «${title}»: ${w}`) }
  },
}

// Finds `[!diagram]` callouts in raw markdown (also nested ones like `> > [!diagram]` inside a [!solution]) and returns
// their title and yaml source. Used by `pnpm diagram:check` and the /viz/diagrams gallery.
export interface RawDiagram {
  /** 1-based line of the callout header */
  line: number
  title: string
  /** null when the callout has no ```yaml block */
  yaml: string | null
}

export function extractDiagrams(markdown: string): RawDiagram[] {
  const lines = markdown.split('\n')
  const out: RawDiagram[] = []
  for (let i = 0; i < lines.length; i++) {
    const head = /^((?:>\s*)+)\[!(diagram|діаграма|схема)\][+-]?\s*(.*)$/i.exec(lines[i]!)
    if (!head) continue
    const depth = (head[1]!.match(/>/g) ?? []).length
    const prefix = new RegExp(`^(?:>\\s?){${depth}}`)
    const body: string[] = []
    let j = i + 1
    while (j < lines.length && (lines[j]!.match(/^(?:>\s?)+/)?.[0].split('>').length ?? 1) - 1 >= depth) body.push(lines[j++]!.replace(prefix, ''))
    const yaml = /```ya?ml\n([\s\S]*?)\n```/.exec(body.join('\n'))?.[1] ?? null
    out.push({ line: i + 1, title: head[3]!.trim(), yaml })
  }
  return out
}

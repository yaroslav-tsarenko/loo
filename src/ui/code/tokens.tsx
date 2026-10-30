import type { ReactNode } from 'react'

// Tiny JS/TS tokenizer for the editor overlay and exercises — good enough to colour, never to parse.
const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|('(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?|`(?:\\[\s\S]|[^`\\])*`?)|\b(0x[\da-fA-F]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?n?)\b|\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|new|class|extends|super|this|typeof|instanceof|in|of|async|await|yield|try|catch|finally|throw|import|export|from|delete|void|static|get|set)\b|\b(true|false|null|undefined|NaN|Infinity)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g
// ```ts adds type-level keywords (in JS `type`, `as`, `is` are ordinary names, so they stay plain there)
const TS_TOKEN = new RegExp(TOKEN.source.replace('|get|set)', '|get|set|interface|type|enum|implements|as|satisfies|readonly|keyof|private|protected|public|abstract|declare|namespace|infer|is)'), 'g')

const KIND = ['', 'comment', 'string', 'number', 'keyword', 'literal', 'fn'] as const

export function highlightCode(code: string, keyPrefix = 't', lang?: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let n = 0
  for (const m of code.matchAll(lang === 'ts' || lang === 'typescript' ? TS_TOKEN : TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const group = m.findIndex((g, i) => i > 0 && g !== undefined)
    out.push(
      <span key={`${keyPrefix}${n++}`} className={`tok-${KIND[group] ?? 'plain'}`}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

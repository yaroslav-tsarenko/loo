import type { ReactNode } from 'react'

// Tiny JS/TS tokenizer for the editor overlay and exercises — good enough to colour, never to parse.
const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|('(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?|`(?:\\[\s\S]|[^`\\])*`?)|\b(0x[\da-fA-F]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?n?)\b|\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|new|class|extends|super|this|typeof|instanceof|in|of|async|await|yield|try|catch|finally|throw|import|export|from|delete|void|static|get|set)\b|\b(true|false|null|undefined|NaN|Infinity)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g

const KIND = ['', 'comment', 'string', 'number', 'keyword', 'literal', 'fn'] as const

export function highlightCode(code: string, keyPrefix = 't'): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let n = 0
  for (const m of code.matchAll(TOKEN)) {
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

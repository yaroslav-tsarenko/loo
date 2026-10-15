import { codeLines } from './types'

const KEYWORDS = new Set([
  'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'do', 'else', 'export', 'extends',
  'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'of', 'return', 'static', 'super',
  'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'yield',
])
const CONSTANTS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'])

const TOKEN = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d[\d_.]*n?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)|([{}()[\];,.=+\-*/<>!?:&|%]+)/g

export type TokenKind = 'comment' | 'string' | 'number' | 'fn' | 'keyword' | 'const' | 'punct' | 'plain'

export function tokenize(line: string): Array<{ text: string; kind: TokenKind }> {
  const out: Array<{ text: string; kind: TokenKind }> = []
  let last = 0
  for (const m of line.matchAll(TOKEN)) {
    const index = m.index ?? 0
    if (index > last) out.push({ text: line.slice(last, index), kind: 'plain' })
    let kind: TokenKind = 'plain'
    if (m[1]) kind = 'comment'
    else if (m[2]) kind = 'string'
    else if (m[3]) kind = 'number'
    else if (m[4]) kind = KEYWORDS.has(m[4]) ? 'keyword' : 'fn'
    else if (m[5]) kind = KEYWORDS.has(m[5]) ? 'keyword' : CONSTANTS.has(m[5]) ? 'const' : 'plain'
    else if (m[6]) kind = 'punct'
    out.push({ text: m[0], kind })
    last = index + m[0].length
  }
  if (last < line.length) out.push({ text: line.slice(last), kind: 'plain' })
  return out
}

// One highlighted line (shared with theater scenes); uses the same data-tk colors.
export function HighlightLine({ text }: { text: string }) {
  return (
    <>
      {tokenize(text).map((t, j) =>
        t.kind === 'plain' ? (
          t.text
        ) : (
          <span key={j} data-tk={t.kind}>
            {t.text}
          </span>
        ),
      )}
    </>
  )
}

export function CodeView({ code, line, title }: { code: string; line: number | null; title?: string }) {
  const lines = codeLines(code)
  return (
    <figure className="viz-code" aria-label={title ?? 'Код'}>
      <div className="viz-code-scroll">
        <pre>
          <span className="viz-code-bar" data-on={line !== null ? '' : undefined} style={{ transform: `translateY(${((line ?? 1) - 1) * 100}%)` }} aria-hidden="true" />
          {lines.map((text, i) => (
            <span key={i} className="viz-code-line" data-active={line === i + 1 ? '' : undefined} aria-current={line === i + 1 ? 'step' : undefined}>
              <span className="viz-code-num" aria-hidden="true">
                {i + 1}
              </span>
              <code>
                {tokenize(text).map((t, j) =>
                  t.kind === 'plain' ? (
                    t.text
                  ) : (
                    <span key={j} data-tk={t.kind}>
                      {t.text}
                    </span>
                  ),
                )}
                {text === '' ? ' ' : null}
              </code>
            </span>
          ))}
        </pre>
      </div>
    </figure>
  )
}

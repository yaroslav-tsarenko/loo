import type { Code, Root, RootContent } from 'mdast'
import { parse as parseYaml } from 'yaml'
import { parseMarkdown } from '../parse/markdown'

// Code inside a translation must be the source's code (docs/COURSE_FORMAT.md «Переклад курсів (i18n)»):
// * `[!task]` / `[!solution]` (starter, tests, reference solution, hints): STRICT — only comments and the titles of
//   test('…') / it('…') / describe('…') may differ (tests assert on literals);
// * theory examples (any other fence): LENIENT — comments, string / template literal contents and JSX text may be
//   translated; identifiers and structure must match;
// * `[!diagram]` yaml: keys and non-prose fields (id, from, to, tone, icon…) must match; labels are prose;
// * ```text / ```txt / ```plaintext and fences without a language are prose — not compared;
// * exercise fences (```order, ```tsx fill): the graded structure must match — pieces and distractors of an order,
//   blanks and their answers of a fill; their text is prose (a language-less fence) or a theory example.

export type FenceRole = 'strict' | 'lenient' | 'diagram' | 'prose' | 'order' | 'fill'

export interface Fence {
  lang: string
  meta: string
  value: string
  role: FenceRole
}

const PROSE_LANGS = new Set(['', 'text', 'txt', 'plaintext', 'plain'])
const STRICT_CALLOUTS = new Set(['task', 'solution'])
const HASH_COMMENTS = new Set(['sh', 'bash', 'shell', 'zsh', 'console', 'yaml', 'yml', 'py', 'python', 'toml', 'ini', 'dockerfile', 'env', 'dotenv', 'makefile', 'r', 'ruby', 'rb'])
const HTML_COMMENTS = new Set(['html', 'xml', 'svg', 'md', 'markdown', 'vue'])
const SQL = new Set(['sql', 'pgsql', 'postgres', 'postgresql', 'plsql'])
const CSS = new Set(['css', 'scss', 'less'])

// Fences of a markdown fragment with the role their enclosing blocks give them.
export function fencesOf(markdown: string): Fence[] {
  return fencesOfRoot(parseMarkdown(markdown).root as Root)
}

// The same for an mdast tree (a unit's body / solution / hint). `strict`: the tree is part of a task.
export function fencesOfRoot(root: Root, strict = false): Fence[] {
  const out: Fence[] = []
  const walk = (nodes: readonly RootContent[], strict: boolean, diagram: boolean) => {
    for (const node of nodes) {
      if (node.type === 'code') {
        const code = node as Code
        const lang = (code.lang ?? '').toLowerCase()
        const words = [lang, ...(code.meta ?? '').toLowerCase().split(/\s+/)]
        const exercise = words.includes('order') ? 'order' : words.includes('fill') ? 'fill' : null
        const role: FenceRole = exercise ? exercise : diagram && (lang === 'yaml' || lang === 'yml') ? 'diagram' : PROSE_LANGS.has(lang) ? 'prose' : strict ? 'strict' : 'lenient'
        out.push({ lang, meta: code.meta ?? '', value: code.value, role })
        continue
      }
      if (node.type === 'callout') {
        walk(node.children as RootContent[], strict || STRICT_CALLOUTS.has(node.calloutType), diagram || node.calloutType === 'diagram')
        continue
      }
      if ('children' in node) walk(node.children as RootContent[], strict, diagram)
    }
  }
  walk(root.children, strict, false)
  return out
}

type Token = { kind: 'code' | 'str' | 'comment' | 'regex'; text: string; quote?: string }

const JS_LIKE = (lang: string) => !HASH_COMMENTS.has(lang) && !HTML_COMMENTS.has(lang) && !SQL.has(lang) && !CSS.has(lang)
// a `/` starts a regex literal (not a division) after these, or at the start (not after < or >: JSX tags)
const REGEX_BEFORE = /(?:^|[(,=:[!&|?{};+\-*%~^]|\b(?:return|typeof|case|do|else|in|of|new|delete|void|throw|yield|await))\s*$/

// What precedes a `/`: the code buffer, else the last code token; after a string / regex it is a division.
function regexContext(buf: string, tokens: readonly Token[]): string {
  if (buf.trim()) return buf.slice(-40)
  const last = [...tokens].reverse().find((t) => t.kind !== 'comment')
  if (!last) return ''
  return last.kind === 'code' ? `${last.text}${buf}`.slice(-40) : 'x'
}

function tokenize(code: string, lang: string): Token[] {
  const tokens: Token[] = []
  const hash = HASH_COMMENTS.has(lang)
  const html = HTML_COMMENTS.has(lang)
  const sql = SQL.has(lang)
  const css = CSS.has(lang)
  let buf = ''
  const flush = () => {
    if (buf) tokens.push({ kind: 'code', text: buf })
    buf = ''
  }
  let i = 0
  while (i < code.length) {
    const c = code[i]!
    const next = code[i + 1]
    if (html && code.startsWith('<!--', i)) {
      const end = code.indexOf('-->', i + 4)
      const stop = end < 0 ? code.length : end + 3
      flush()
      tokens.push({ kind: 'comment', text: code.slice(i, stop) })
      i = stop
      continue
    }
    if (!html && !hash && c === '/' && next === '*') {
      const end = code.indexOf('*/', i + 2)
      const stop = end < 0 ? code.length : end + 2
      flush()
      tokens.push({ kind: 'comment', text: code.slice(i, stop) })
      i = stop
      continue
    }
    const lineComment = (!html && !hash && !sql && !css && c === '/' && next === '/') || (sql && c === '-' && next === '-') || (hash && c === '#' && (i === 0 || /\s/.test(code[i - 1]!)))
    if (lineComment) {
      const end = code.indexOf('\n', i)
      const stop = end < 0 ? code.length : end
      flush()
      tokens.push({ kind: 'comment', text: code.slice(i, stop) })
      i = stop
      continue
    }
    // regex literal: kept verbatim as code, so `/\/\//` is not taken for a comment
    // (not JSX: `/>` closes a tag, `</` opens a closing one)
    if (c === '/' && next !== '/' && next !== '*' && next !== '>' && code[i - 1] !== '<' && JS_LIKE(lang) && REGEX_BEFORE.test(regexContext(buf, tokens))) {
      let j = i + 1
      let cls = false
      while (j < code.length && code[j] !== '\n' && (cls || code[j] !== '/')) {
        if (code[j] === '\\') j++
        else if (code[j] === '[') cls = true
        else if (code[j] === ']') cls = false
        j++
      }
      if (code[j] === '/') {
        j++
        while (j < code.length && /[a-z]/i.test(code[j]!)) j++
        flush()
        tokens.push({ kind: 'regex', text: code.slice(i, j) })
        i = j
        continue
      }
    }
    if (c === '"' || c === "'" || (c === '`' && !hash)) {
      let j = i + 1
      while (j < code.length && code[j] !== c) {
        if (code[j] === '\\') j++
        else if (c !== '`' && code[j] === '\n') break
        j++
      }
      flush()
      tokens.push({ kind: 'str', text: code.slice(i + 1, j), quote: c })
      i = Math.min(code.length, j + 1)
      continue
    }
    buf += c
    i++
  }
  flush()
  return tokens
}

const TEST_FN = /\b(?:test|it|describe)(?:\.(?:only|skip|todo|concurrent))?\s*\(\s*$/
// module specifiers: `from '…'`, `import '…'`, `import('…')`, `require('…')`, `export … from '…'`
const SPECIFIER_BEFORE = /(?:\bfrom|\bimport|\bimport\s*\(|\brequire\s*\()\s*$/
// directives: 'use client', 'use server', 'use cache', 'use cache: private'…
const DIRECTIVE = /^use (?:client|server|strict|cache(?::\s*[\w-]+)?)$/
// a JSX tag (attributes may hold one level of {…}); its text children run up to the next < or {
const JSX_TEXT = /(<\/?[A-Za-z][\w.:-]*(?:\s(?:[^<>{}]|\{[^{}]*\})*?)?\/?>|<\/?>)([^<>{}]*?)(?=[<{])/g

// The comparable form of a fence: what must be identical across languages.
export function codeSkeleton(fence: Pick<Fence, 'lang' | 'value' | 'role'>): string {
  if (fence.role === 'prose') return ''
  if (fence.role === 'diagram') return diagramSkeleton(fence.value)
  if (fence.role === 'order' || fence.role === 'fill') return exerciseSkeleton(fence)
  const tokens = tokenize(fence.value, fence.lang).filter((t) => t.kind !== 'comment')
  let out = ''
  for (const tok of tokens) {
    if (tok.kind === 'code' || tok.kind === 'regex') {
      out += tok.text
      continue
    }
    const title = TEST_FN.test(out)
    // directives and module specifiers are code in every mode
    const code = DIRECTIVE.test(tok.text) || SPECIFIER_BEFORE.test(out)
    // strict: literals stay (tests assert on them), except test titles; lenient: only the quotes stay
    const keep = code || (fence.role === 'strict' && !title)
    out += keep ? `${tok.quote}${tok.text}${tok.quote}` : `${tok.quote}${tok.quote}`
  }
  if (fence.role === 'strict') {
    // newlines are structure: only trailing spaces and the blank lines a removed comment leaves go
    return out
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.trim() !== '')
      .join('\n')
  }
  // lenient: JSX text between a tag and the next tag / expression is prose too (not `a > b && c < d`)
  out = out.replace(JSX_TEXT, (m, tag: string, text: string) => (text.trim() ? tag : m))
  return out.replace(/\s+/g, ' ').trim()
}

const DISTRACTOR = /\s*(?:(?:\/\/|#|--)\s*)?✗\s*$/
const BLANK = /\[\[([\s\S]+?)\]\]/g

// order: one piece per line (or blank-line separated blocks) and which are distractors; fill: the blanks' answers.
// A real language (```js order, ```tsx fill) also compares the code around them as a theory example.
function exerciseSkeleton(fence: Pick<Fence, 'lang' | 'value' | 'role'>): string {
  const lang = fence.lang === fence.role ? '' : fence.lang
  const code = (value: string) => (lang ? codeSkeleton({ lang, value, role: 'lenient' }) : '')
  if (fence.role === 'fill') {
    const blanks = [...fence.value.matchAll(BLANK)].map((m) => m[1]!.trim())
    return JSON.stringify({ blanks, code: code(fence.value.replace(BLANK, '__')) })
  }
  const lines = fence.value.replace(/\r\n?/g, '\n').split('\n')
  const blocks = lines.join('\n').trim().includes('\n\n')
  const pieces = blocks ? fence.value.trim().split(/\n\s*\n/) : lines.filter((l) => l.trim())
  return JSON.stringify(pieces.map((p) => ({ distractor: p.split('\n').some((l) => DISTRACTOR.test(l)), code: code(p.split('\n').map((l) => l.replace(DISTRACTOR, '')).join('\n')) })))
}

const DIAGRAM_KEEP = new Set(['id', 'from', 'to', 'focus', 'layout', 'tone', 'icon', 'kind', 'type', 'shape', 'direction', 'dir', 'group', 'at', 'col', 'row'])

function skeletonOf(value: unknown, key: string | null): unknown {
  if (Array.isArray(value)) return value.map((v) => skeletonOf(v, key))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, skeletonOf(v, k)]))
  if (typeof value === 'string') return key !== null && DIAGRAM_KEEP.has(key) ? value : '~'
  return value
}

function diagramSkeleton(yaml: string): string {
  try {
    return JSON.stringify(skeletonOf(parseYaml(yaml), null))
  } catch {
    return yaml.replace(/\s+/g, ' ').trim()
  }
}

const ROLE_NOTE: Record<FenceRole, string> = {
  strict: 'задача: лише коментарі й назви тестів',
  lenient: 'приклад: лише коментарі, рядки й JSX-текст',
  diagram: 'схема: ключі й службові поля',
  order: 'вправа order: ті самі шматки й дистрактори',
  fill: 'вправа fill: ті самі пропуски й відповіді',
  prose: '',
}

export interface CodeDiff {
  index: number
  lang: string
  message: string
}

function firstDifference(a: string, b: string): string {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  const from = Math.max(0, i - 20)
  return `джерело «…${a.slice(from, i + 30)}…» ≠ переклад «…${b.slice(from, i + 30)}…»`
}

// Fence-by-fence comparison of a source block and its translation (prose fences are skipped, but count).
export function compareFences(source: readonly Fence[], translated: readonly Fence[]): CodeDiff[] {
  const diffs: CodeDiff[] = []
  const src = source.filter((f) => f.role !== 'prose')
  const tr = translated.filter((f) => f.role !== 'prose')
  if (src.length !== tr.length) {
    diffs.push({ index: -1, lang: '', message: `різна кількість блоків коду: у джерелі ${src.length}, у перекладі ${tr.length}` })
    return diffs
  }
  src.forEach((s, i) => {
    const t = tr[i]!
    if (s.lang !== t.lang) {
      diffs.push({ index: i, lang: s.lang, message: `блок коду ${i + 1}: мова ${s.lang || '—'} ≠ ${t.lang || '—'}` })
      return
    }
    const a = codeSkeleton(s)
    const b = codeSkeleton({ ...t, role: s.role })
    if (a !== b) diffs.push({ index: i, lang: s.lang, message: `блок коду ${i + 1} (${s.lang}, ${ROLE_NOTE[s.role]}): ${firstDifference(a, b)}` })
  })
  return diffs
}

// Two task codes (starter / tests) are the same program up to comments and test titles.
export function sameTaskCode(a: string | null | undefined, b: string | null | undefined, lang: string): boolean {
  if (!a || !b) return a === b || (!a && !b)
  return codeSkeleton({ lang, value: a, role: 'strict' }) === codeSkeleton({ lang, value: b, role: 'strict' })
}

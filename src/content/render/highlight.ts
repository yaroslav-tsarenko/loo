import { createHash } from 'node:crypto'
import type { Element, ElementContent, Root as HastRoot } from 'hast'
import { transformerMetaHighlight, transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import { createCssVariablesTheme, createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { bundledLanguages } from 'shiki/langs'

const theme = createCssVariablesTheme({ name: 'vault', variablePrefix: '--code-', variableDefaults: {}, fontStyle: true })

const ALIASES: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  mts: 'typescript',
  sh: 'shellscript',
  bash: 'shellscript',
  zsh: 'shellscript',
  shell: 'shellscript',
  console: 'shellscript',
  env: 'dotenv',
  yml: 'yaml',
  kt: 'kotlin',
  kts: 'kotlin',
  conf: 'ini',
  psql: 'sql',
  postgres: 'sql',
  pgsql: 'sql',
  html: 'html',
  vue: 'vue',
  md: 'markdown',
}

const PLAIN = new Set(['', 'text', 'txt', 'plain', 'plaintext', 'output', 'log'])

let highlighter: Promise<HighlighterCore> | null = null
const loaded = new Set<string>()
const cache = new Map<string, Element>()

function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighter) {
    highlighter = createHighlighterCore({ themes: [theme], langs: [], engine: createJavaScriptRegexEngine({ forgiving: true }) })
  }
  return highlighter
}

export function canonicalLang(lang: string | null | undefined): string | null {
  const raw = (lang ?? '').trim().toLowerCase()
  if (PLAIN.has(raw)) return null
  const name = ALIASES[raw] ?? raw
  return name in bundledLanguages ? name : null
}

async function ensureLang(h: HighlighterCore, lang: string): Promise<boolean> {
  if (loaded.has(lang)) return true
  const loader = bundledLanguages[lang as keyof typeof bundledLanguages]
  if (!loader) return false
  await h.loadLanguage(loader)
  loaded.add(lang)
  return true
}

export interface CodeInput {
  code: string
  lang: string | null
  meta: string | null
}

export interface CodeOptions {
  title: string | null
  showLineNumbers: boolean
  displayLang: string
}

export function parseCodeMeta(meta: string | null, lineCount: number): Omit<CodeOptions, 'displayLang'> {
  const text = meta ?? ''
  const title = /(?:title|filename|file)=(?:"([^"]+)"|'([^']+)'|(\S+))/.exec(text)
  let showLineNumbers = lineCount > 5
  if (/\bshowLineNumbers\b/.test(text)) showLineNumbers = true
  if (/\bnoLineNumbers\b/.test(text)) showLineNumbers = false
  return { title: title ? (title[1] ?? title[2] ?? title[3] ?? null) : null, showLineNumbers }
}

function plainPre(code: string): Element {
  const lines = code.split('\n')
  return {
    type: 'element',
    tagName: 'pre',
    properties: { className: ['shiki'] },
    children: [
      {
        type: 'element',
        tagName: 'code',
        properties: {},
        children: lines.flatMap((line, i): ElementContent[] => {
          const span: Element = { type: 'element', tagName: 'span', properties: { className: ['line'] }, children: [{ type: 'text', value: line }] }
          return i < lines.length - 1 ? [span, { type: 'text', value: '\n' }] : [span]
        }),
      },
    ],
  }
}

export async function highlightCode(input: CodeInput): Promise<Element> {
  const code = input.code.replace(/\n+$/, '')
  const lang = canonicalLang(input.lang)
  const key = createHash('sha1').update(`${lang}\u0000${input.meta ?? ''}\u0000${code}`).digest('base64url')
  const hit = cache.get(key)
  if (hit) return hit
  let pre: Element = plainPre(code)
  if (lang) {
    const h = await getHighlighter()
    if (await ensureLang(h, lang)) {
      const tree = h.codeToHast(code, {
        lang,
        theme: 'vault',
        meta: { __raw: input.meta ?? '' },
        transformers: [transformerMetaHighlight(), transformerNotationHighlight(), transformerNotationDiff()],
      }) as HastRoot
      const found = tree.children.find((c): c is Element => c.type === 'element' && c.tagName === 'pre')
      if (found) {
        delete found.properties.style
        delete found.properties.tabindex
        pre = found
      }
    }
  }
  cache.set(key, pre)
  if (cache.size > 4000) {
    const first = cache.keys().next().value
    if (first !== undefined) cache.delete(first)
  }
  return pre
}

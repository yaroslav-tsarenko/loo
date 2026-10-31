import { parse as parseYaml } from 'yaml'

// content/glossary/<source>-<target>.yaml: `keepLatin` — terms that stay in Latin in every language; `terms` —
// source term → the one rendering a translation uses. i18n:check warns, never fails, on these.

export interface Glossary {
  keepLatin: string[]
  terms: Array<{ source: string; target: string }>
}

export function parseGlossary(yaml: string): Glossary {
  const data = (parseYaml(yaml) ?? {}) as { keepLatin?: unknown; terms?: unknown }
  const keepLatin = Array.isArray(data.keepLatin) ? data.keepLatin.filter((v): v is string => typeof v === 'string' && v.trim() !== '').map((v) => v.trim()) : []
  const terms =
    data.terms && typeof data.terms === 'object' && !Array.isArray(data.terms)
      ? Object.entries(data.terms as Record<string, unknown>)
          .filter((e): e is [string, string] => typeof e[1] === 'string' && e[0].trim() !== '' && e[1].trim() !== '')
          .map(([source, target]) => ({ source: source.trim(), target: target.trim() }))
      : []
  return { keepLatin, terms }
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Ukrainian (and other inflected) source terms: every word matches its inflected forms («межа» → межі, межу; «кеш» →
// кешу, кешем). Words of 4+ letters lose their last letter to a stem.
function stemPattern(term: string): RegExp {
  const words = term.split(/\s+/).map((w) => {
    const stem = w.length >= 4 ? w.slice(0, -1) : w
    return `${escape(stem)}\\p{L}*`
  })
  return new RegExp(`(?<![\\p{L}\\p{N}])${words.join('\\s+')}`, 'iu')
}

function latinPattern(term: string): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}])${escape(term).replace(/\s+/g, '\\s+')}`, 'iu')
}

// Prose without what the glossary must not judge: code spans and fences, link targets and anchors (kept source-language
// anchors are fine — docs/COURSE_FORMAT.md «Переклад»), URLs and exercise meta lines.
export function glossaryText(markdown: string): string {
  return markdown
    .replace(/(`{3,}|~{3,})[\s\S]*?\1/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, ' $2 ')
    .replace(/\[\[[^\]]*\]\]/g, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/^(?:>\s?)*(?:\*[^*\n]*\*\s*·.*|[a-z]+\s*:.*·.*)$/gim, ' ')
}

export interface GlossaryHit {
  term: string
  expected: string
  kind: 'keepLatin' | 'term'
}

// What a translated segment misses: a keepLatin term the source uses but the translation doesn't, or a glossary
// term whose rendering is absent.
export function glossaryMisses(glossary: Glossary, source: string, translated: string): GlossaryHit[] {
  const src = glossaryText(source)
  const tr = glossaryText(translated)
  const out: GlossaryHit[] = []
  for (const term of glossary.keepLatin) {
    const re = latinPattern(term)
    if (re.test(src) && !re.test(tr)) out.push({ term, expected: term, kind: 'keepLatin' })
  }
  for (const { source: term, target } of glossary.terms) {
    if (stemPattern(term).test(src) && !latinPattern(target).test(tr)) out.push({ term, expected: target, kind: 'term' })
  }
  return out
}

import { createHash } from 'node:crypto'

export function normalizeForId(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ʼ'’`"«»“”]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

export function hashId(parts: readonly string[]): string {
  const digest = createHash('sha1').update(parts.join('\u0000')).digest('hex')
  return `h:${digest.slice(0, 10)}`
}

export function unitHashId(guideId: string, chapterPath: string, questionText: string): string {
  return hashId([guideId, chapterPath, normalizeForId(questionText)])
}

function trigrams(text: string): Set<string> {
  const padded = `  ${normalizeForId(text)} `
  const out = new Set<string>()
  for (let i = 0; i < padded.length - 2; i++) out.add(padded.slice(i, i + 3))
  return out
}

export function similarity(a: string, b: string): number {
  const ta = trigrams(a)
  const tb = trigrams(b)
  if (ta.size === 0 && tb.size === 0) return 1
  let shared = 0
  for (const t of ta) if (tb.has(t)) shared++
  return (2 * shared) / (ta.size + tb.size)
}

export function slugifySegment(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ʼ'’`"«»“”?!,:;()[\]{}]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}.+-]+/gu, '-')
    .replace(/\.+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

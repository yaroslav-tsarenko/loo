// Title-level dedupe for generated reels: against each other, earlier AI reels and the guides' [!reel] blocks.

const STOP = new Set([
  // uk
  'і', 'й', 'та', 'а', 'але', 'або', 'чи', 'в', 'у', 'на', 'з', 'із', 'зі', 'до', 'від', 'по', 'за', 'для', 'про', 'як', 'що', 'це', 'не', 'ні',
  'є', 'бо', 'же', 'ж', 'так', 'ще', 'вже', 'теж', 'коли', 'чому', 'навіть', 'тільки', 'лише', 'свій', 'твій', 'його', 'їх', 'ти', 'ми', 'він',
  // en
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'for', 'to', 'with', 'is', 'are', 'it', 'its', 'this', 'that', 'vs',
])

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[’'`"«»“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Keeps code-ish tokens whole ("promise.all", "array.prototype.at"); plain words are cut to a
// 4-letter stem, crude but enough for Ukrainian inflection ("першій" ≈ "першої").
export function tokens(title: string): Set<string> {
  const words = normalizeTitle(title).match(/[\p{L}\p{N}_$]+(?:\.[\p{L}\p{N}_$]+)*/gu) ?? []
  return new Set(words.filter((w) => !STOP.has(w)).map((w) => (/^\p{L}{5,}$/u.test(w) ? w.slice(0, 4) : w)))
}

function trigrams(s: string): Set<string> {
  const t = ` ${normalizeTitle(s).replace(/[^\p{L}\p{N} ]/gu, '')} `
  const out = new Set<string>()
  for (let i = 0; i < t.length - 2; i++) out.add(t.slice(i, i + 3))
  return out
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let shared = 0
  for (const x of a) if (b.has(x)) shared++
  return shared / (a.size + b.size - shared)
}

export function similarity(a: string, b: string): number {
  if (normalizeTitle(a) === normalizeTitle(b)) return 1
  return Math.max(jaccard(tokens(a), tokens(b)), jaccard(trigrams(a), trigrams(b)))
}

export const DUPLICATE_AT = 0.6

export function isDuplicateTitle(title: string, known: readonly string[], threshold = DUPLICATE_AT): string | null {
  for (const k of known) if (similarity(title, k) >= threshold) return k
  return null
}

// Keeps the first of near-duplicates; `known` are titles that already exist elsewhere.
export function dedupeByTitle<T extends { title: string }>(items: readonly T[], known: readonly string[], threshold = DUPLICATE_AT): { kept: T[]; dropped: Array<{ item: T; duplicateOf: string }> } {
  const seen = [...known]
  const kept: T[] = []
  const dropped: Array<{ item: T; duplicateOf: string }> = []
  for (const item of items) {
    const dup = isDuplicateTitle(item.title, seen, threshold)
    if (dup) dropped.push({ item, duplicateOf: dup })
    else {
      kept.push(item)
      seen.push(item.title)
    }
  }
  return { kept, dropped }
}

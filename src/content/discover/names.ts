const NUMBERED = /^(\d{1,3})(?:\s*\.\s*|\s+-\s+|\s*_\s*|\s+)(.+)$/
const INDEX_NAMES = ['_guide', 'зміст', 'index', 'readme']

export interface ParsedName {
  number: number | null
  rest: string
}

export function stripGuidePrefix(name: string, guideDir: string): string {
  const prefix = `${guideDir} - `
  if (name.toLowerCase().startsWith(prefix.toLowerCase())) return name.slice(prefix.length)
  return name
}

export function parseName(name: string, guideDir: string): ParsedName {
  const stripped = stripGuidePrefix(name.trim(), guideDir)
  const m = NUMBERED.exec(stripped)
  if (m) return { number: Number(m[1]), rest: m[2]!.trim() }
  return { number: null, rest: stripped }
}

export function capitalize(text: string): string {
  return text ? text.charAt(0).toLocaleUpperCase('uk') + text.slice(1) : text
}

export function titleFrom(h1: string | null, name: string, guideDir: string): string {
  if (h1) {
    const parsed = parseName(h1, guideDir)
    if (parsed.rest) return capitalize(parsed.rest)
  }
  return capitalize(parseName(name, guideDir).rest)
}

export function isIndexName(name: string, guideDir: string): boolean {
  const lower = name.toLowerCase()
  if (INDEX_NAMES.includes(lower)) return true
  if (lower === guideDir.toLowerCase()) return true
  const stripped = stripGuidePrefix(name, guideDir).toLowerCase()
  return stripped !== lower && INDEX_NAMES.includes(stripped)
}

export function indexPriority(name: string, guideDir: string): number {
  const lower = name.toLowerCase()
  if (lower === '_guide') return 0
  if (lower === 'зміст') return 1
  const stripped = stripGuidePrefix(name, guideDir).toLowerCase()
  if (stripped !== lower && stripped === 'зміст') return 2
  if (lower === 'index') return 3
  if (lower === 'readme') return 4
  if (lower === guideDir.toLowerCase()) return 5
  return 9
}

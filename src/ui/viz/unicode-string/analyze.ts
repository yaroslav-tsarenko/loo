// Everything is computed with the real APIs: string iteration, charCodeAt,
// codePointAt, TextEncoder, Intl.Segmenter, normalize.

export interface CodeUnit {
  value: number
  hex: string
  kind: 'bmp' | 'high' | 'low'
}

export interface CodePoint {
  cp: number
  // U+1F600
  label: string
  char: string
  units: CodeUnit[]
  bytes: number[]
  // combining mark, ZWJ, variation selector, regional indicator, skin tone…
  role: string | null
}

export interface Grapheme {
  text: string
  codePoints: CodePoint[]
}

export interface StringAnalysis {
  text: string
  graphemes: Grapheme[]
  counts: { length: number; codePoints: number; graphemes: number; bytes: number }
  // s.split('') — code units, with lone surrogates escaped for display
  split: string[]
  // s.slice(0, 1)
  sliceFirst: string
  nfc: { text: string; length: number }
  nfd: { text: string; length: number }
}

const hex = (n: number, pad = 4) => n.toString(16).toUpperCase().padStart(pad, '0')
const encoder = new TextEncoder()

export function unitKind(u: number): CodeUnit['kind'] {
  if (u >= 0xd800 && u <= 0xdbff) return 'high'
  if (u >= 0xdc00 && u <= 0xdfff) return 'low'
  return 'bmp'
}

function role(cp: number): string | null {
  if (cp === 0x200d) return 'ZWJ — склеює емодзі'
  if (cp === 0xfe0f) return 'селектор варіанта: емодзі-стиль'
  if (cp >= 0x1f3fb && cp <= 0x1f3ff) return 'відтінок шкіри'
  if (cp >= 0x1f1e6 && cp <= 0x1f1ff) return `регіональний індикатор ${String.fromCharCode(65 + cp - 0x1f1e6)}`
  if (/\p{M}/u.test(String.fromCodePoint(cp))) return 'комбінуючий знак'
  return null
}

// Lone surrogates render as �: show them as escapes instead
export function visible(s: string): string {
  let out = ''
  for (const ch of s) {
    const u = ch.charCodeAt(0)
    if (ch.length === 1 && unitKind(u) !== 'bmp') out += `\\u${hex(u)}`
    else if (/\p{M}/u.test(ch) && out === '') out += `◌${ch}`
    else if (ch === '\u200D') out += '‹ZWJ›'
    else out += ch
  }
  return out
}

function segment(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return [...new Intl.Segmenter('uk', { granularity: 'grapheme' }).segment(text)].map((s) => s.segment)
  }
  return [...text]
}

export function codePointInfo(char: string): CodePoint {
  const cp = char.codePointAt(0)!
  const units: CodeUnit[] = []
  for (let i = 0; i < char.length; i++) {
    const value = char.charCodeAt(i)
    units.push({ value, hex: hex(value), kind: unitKind(value) })
  }
  return { cp, label: `U+${hex(cp)}`, char, units, bytes: [...encoder.encode(char)], role: role(cp) }
}

export function analyze(text: string): StringAnalysis {
  const graphemes = segment(text).map((g) => ({ text: g, codePoints: [...g].map(codePointInfo) }))
  const nfc = text.normalize('NFC')
  const nfd = text.normalize('NFD')
  return {
    text,
    graphemes,
    counts: {
      length: text.length,
      codePoints: [...text].length,
      graphemes: graphemes.length,
      bytes: encoder.encode(text).byteLength,
    },
    split: text.split('').map(visible),
    sliceFirst: visible(text.slice(0, 1)),
    nfc: { text: nfc, length: nfc.length },
    nfd: { text: nfd, length: nfd.length },
  }
}

export interface UnicodePreset {
  id: string
  label: string
  text: string
  insight: string
}

export const UNICODE_PRESETS: readonly UnicodePreset[] = [
  { id: 'cafe-nfc', label: 'café · NFC', text: 'caf\u00E9', insight: 'é — одна готова літера U+00E9 (precomposed, форма NFC). 4 графеми = 4 code points = 4 code units, але 5 байтів UTF-8: é займає 2 байти.' },
  { id: 'cafe-nfd', label: 'café · e + \u25CC\u0301', text: 'cafe\u0301', insight: 'Виглядає так само, але é тут — «e» + комбінуючий наголос U+0301 (NFD). Тому length = 5, а === з NFC-версією дає false. Нормалізуй через normalize() перед порівнянням.' },
  { id: 'grin', label: '😀', text: '\u{1F600}', insight: 'U+1F600 не влазить у 16 біт (поза BMP), тож UTF-16 кодує його сурогатною парою D83D + DE00. length = 2, хоча символ один.' },
  { id: 'family', label: '👨‍👩‍👧', text: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}', insight: 'Три емодзі, склеєні двома ZWJ (U+200D): 5 code points, 8 code units, 18 байтів — і лише ОДНА графема, яку бачить людина.' },
  { id: 'flag', label: '🇺🇦', text: '\u{1F1FA}\u{1F1E6}', insight: 'Прапор — це два «регіональні індикатори» U і A. Окремо вони показуються як літери в рамці, разом шрифт малює прапор. 2 code points, 4 units, 1 графема.' },
  { id: 'pryvit', label: 'Привіт', text: 'Привіт', insight: 'Кирилиця в BMP: кожна літера — один code unit, тож length збігається з кількістю літер. Але в UTF-8 кожна займає 2 байти: 12 байтів на 6 літер.' },
  { id: 'math', label: 'a𝒜b', text: 'a\u{1D49C}b', insight: '𝒜 (U+1D49C, математична каліграфічна A) — поза BMP: сурогатна пара в UTF-16 і 4 байти в UTF-8. Тому length = 4, а не 3.' },
  { id: 'thumb', label: '👍🏽', text: '\u{1F44D}\u{1F3FD}', insight: 'Емодзі + модифікатор відтінку шкіри U+1F3FD: 2 code points, 4 units, але одна графема. slice чи split легко відріжуть відтінок.' },
]

export const MAX_INPUT = 24

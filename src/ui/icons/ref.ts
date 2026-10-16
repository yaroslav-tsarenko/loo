// Icon references are plain strings so course YAML can name them: `si:SiJavascript`, `pi:PiFireFill`, `tb:TbBrain`, `lucide:Flame`,
// `px:flagUk` (our pixel set, src/ui/design/PixelIcon.tsx), `emoji:🔥` or a bare emoji.

export const LIBRARY_SETS = ['si', 'pi', 'tb', 'lucide', 'px'] as const
export type LibrarySet = (typeof LIBRARY_SETS)[number]
export type IconSet = LibrarySet | 'emoji'

export type IconRef = { set: 'emoji'; name: string } | { set: LibrarySet; name: string }

const NAME = /^[A-Z][A-Za-z0-9]*$/
// pixel icons are camelCase keys (flagUk, map…)
const PX_NAME = /^[a-z][A-Za-z0-9]*$/
const PICTO = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u

export function parseIconRef(raw: string | null | undefined): IconRef | null {
  const value = raw?.trim()
  if (!value) return null
  const colon = value.indexOf(':')
  if (colon > 0) {
    const set = value.slice(0, colon)
    const name = value.slice(colon + 1).trim()
    if (set === 'emoji') return name && PICTO.test(name) ? { set: 'emoji', name } : null
    if ((LIBRARY_SETS as readonly string[]).includes(set)) return (set === 'px' ? PX_NAME : NAME).test(name) ? { set: set as LibrarySet, name } : null
  }
  return PICTO.test(value) && [...value].length <= 8 ? { set: 'emoji', name: value } : null
}

export function formatIconRef(ref: IconRef): string {
  return `${ref.set}:${ref.name}`
}

// Simple Icons ship near-black marks (Next.js, Vercel, Rust…); those follow the text color so they stay visible in dark mode.
export function brandFill(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!m) return 'currentColor'
  const n = Number.parseInt(m[1]!, 16)
  const channel = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const lum = 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  return lum < 0.045 ? 'currentColor' : `#${m[1]!.toUpperCase()}`
}

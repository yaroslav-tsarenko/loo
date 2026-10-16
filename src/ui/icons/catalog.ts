// Full list of addressable icons — for the /design showcase and course validation. Pulls every curated set, so keep it off hot paths.
import { LUCIDE } from './sets/lucide'
import { PI } from './sets/pi'
import { SI } from './sets/si'
import { TB } from './sets/tb'
import { PIXEL_ICONS } from '../design/PixelIcon'
import { parseIconRef, type LibrarySet } from './ref'

export const ICON_NAMES: Record<LibrarySet, readonly string[]> = {
  si: Object.keys(SI),
  pi: Object.keys(PI),
  tb: Object.keys(TB),
  lucide: Object.keys(LUCIDE),
  px: PIXEL_ICONS,
}

export const BRANDS: readonly { name: string; label: string; hex: string }[] = Object.entries(SI).map(([name, b]) => ({ name, label: b.label, hex: b.hex }))

export function hasIcon(raw: string): boolean {
  const ref = parseIconRef(raw)
  if (!ref) return false
  return ref.set === 'emoji' || ICON_NAMES[ref.set].includes(ref.name)
}

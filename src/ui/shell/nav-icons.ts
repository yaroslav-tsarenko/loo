import type { IconType } from 'react-icons'
import { PiBandaidsFill, PiBooksFill, PiCardsThreeFill, PiCodeBlockFill, PiDeviceMobileFill, PiFileTextFill, PiHouseFill, PiListChecksFill, PiMapTrifoldFill, PiNewspaperFill, PiPathFill, PiUserCircleFill } from 'react-icons/pi'

export interface NavIcon {
  icon: IconType
  /** Icon color — always on, like a game menu. */
  color: string
}

// Direct per-icon imports keep the shell chunk small (no registry lookup on every page).
export const NAV_ICONS: Record<string, NavIcon> = {
  '/': { icon: PiHouseFill, color: 'var(--lu-orange)' },
  '/feed': { icon: PiDeviceMobileFill, color: 'var(--lu-pink)' },
  '/path': { icon: PiPathFill, color: 'var(--lu-green)' },
  '/courses': { icon: PiBooksFill, color: 'var(--lu-orange)' },
  '/review': { icon: PiCardsThreeFill, color: 'var(--lu-blue)' },
  '/quiz': { icon: PiListChecksFill, color: 'var(--lu-purple)' },
  '/tasks': { icon: PiCodeBlockFill, color: 'var(--lu-yellow-lip)' },
  '/mistakes': { icon: PiBandaidsFill, color: 'var(--lu-red)' },
  '/news': { icon: PiNewspaperFill, color: 'var(--lu-blue-lip)' },
  '/roadmap': { icon: PiMapTrifoldFill, color: 'var(--lu-green-lip)' },
  '/profile': { icon: PiUserCircleFill, color: 'var(--lu-purple-lip)' },
}

export const FALLBACK_ICON: NavIcon = { icon: PiFileTextFill, color: 'var(--lu-text-3)' }

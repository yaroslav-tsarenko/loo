import type { IconType } from 'react-icons'
import { PiBooksFill, PiDeviceMobileFill, PiFileTextFill, PiHouseFill, PiNewspaperFill, PiSparkleFill, PiStorefrontFill, PiTrophyFill, PiUserCircleFill } from 'react-icons/pi'

export interface NavIcon {
  icon: IconType
  /** Icon color — always on, like a game menu. */
  color: string
}

// Global nav items (./nav.ts); practice sections carry their icons in ./course-nav.ts.
// Direct per-icon imports keep the shell chunk small (no registry lookup on every page).
export const NAV_ICONS: Record<string, NavIcon> = {
  '/': { icon: PiHouseFill, color: 'var(--lu-orange)' },
  '/loo': { icon: PiSparkleFill, color: 'var(--lu-purple)' },
  '/feed': { icon: PiDeviceMobileFill, color: 'var(--lu-pink)' },
  '/leagues': { icon: PiTrophyFill, color: 'var(--lu-yellow-lip)' },
  '/shop': { icon: PiStorefrontFill, color: 'var(--lu-red)' },
  '/courses': { icon: PiBooksFill, color: 'var(--lu-orange)' },
  '/news': { icon: PiNewspaperFill, color: 'var(--lu-blue-lip)' },
  '/profile': { icon: PiUserCircleFill, color: 'var(--lu-purple-lip)' },
}

export const FALLBACK_ICON: NavIcon = { icon: PiFileTextFill, color: 'var(--lu-text-3)' }

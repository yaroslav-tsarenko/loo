'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, use, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import type { PracticeSectionId } from '@/course/practice'
import { FALLBACK_PRACTICE, practiceNav, type PracticeNavItem } from './course-nav'
import { NAV, type NavItem } from './nav'
import { NAV_ICONS } from './nav-icons'

export const PROGRESS_EVENT = 'progress:changed'

const CountsContext = createContext<Record<string, number>>({})

export function CountsProvider({ initial, children }: { initial: Record<string, number>; children: ReactNode }) {
  const counts = useLiveCounts(initial)
  return <CountsContext value={counts}>{children}</CountsContext>
}

export function useCounts(): Record<string, number> {
  return use(CountsContext)
}

function useLiveCounts(initial: Record<string, number>): Record<string, number> {
  const path = usePathname()
  const [counts, setCounts] = useState(initial)
  // A server re-render of the layout (e.g. switching the active course) brings fresh counts: take them.
  const [seed, setSeed] = useState(initial)
  if (seed !== initial) {
    setSeed(initial)
    setCounts(initial)
  }
  useEffect(() => {
    let alive = true
    const load = () =>
      fetch('/api/counts', { cache: 'no-store' })
        .then((r) => r.json() as Promise<{ counts: Record<string, number> }>)
        .then((d) => {
          if (alive) setCounts(d.counts)
        })
        .catch(() => {})
    load()
    window.addEventListener(PROGRESS_EVENT, load)
    return () => {
      alive = false
      window.removeEventListener(PROGRESS_EVENT, load)
    }
  }, [path])
  return counts
}

// The active course's practice sections (course.yaml `practice:`), shared by the sidebar, the mobile tabs and the
// top bar. Re-rendered by the root layout when the active course changes (switchCourse revalidates it).
const PracticeContext = createContext<readonly PracticeNavItem[]>(practiceNav(FALLBACK_PRACTICE))

export function PracticeProvider({ sections, children }: { sections: readonly PracticeSectionId[]; children: ReactNode }) {
  return <PracticeContext value={practiceNav(sections)}>{children}</PracticeContext>
}

export function usePractice(): readonly PracticeNavItem[] {
  return use(PracticeContext)
}

interface Tab {
  item: NavItem
  icon: IconType
  color: string
  badge: string | null
}

// Mobile tab bar (≤ 5): «Сьогодні», the course's first two sections (Карта + Картки / Слова…), Ліги, Профіль.
// Everything else is one tap away in the drawer.
function mobileTabs(practice: readonly PracticeNavItem[]): Tab[] {
  const global = (href: string): Tab => ({ item: NAV.find((n) => n.href === href)!, ...NAV_ICONS[href]!, badge: null })
  const course = practice.slice(0, 2).map((p): Tab => ({ item: p, icon: p.icon, color: p.color, badge: p.badge?.tone === 'red' ? p.badge.key : null }))
  return [global('/'), ...course, global('/leagues'), global('/profile')]
}

export function BottomNav() {
  const path = usePathname()
  const counts = use(CountsContext)
  const tabs = mobileTabs(usePractice())
  return (
    <nav className="bottomnav" aria-label="Розділи" style={{ '--tabs': tabs.length } as CSSProperties}>
      {tabs.map(({ item, icon: Icon, color, badge }) => {
        const active = item.match(path)
        const count = badge ? counts[badge] : 0
        return (
          <Link key={item.href} href={item.href} className="bottomnav-link" aria-current={active ? 'page' : undefined} style={{ '--nav-c': color } as CSSProperties}>
            <span className="bottomnav-icon">
              <Icon size={28} aria-hidden="true" />
              {count ? (
                <span className="lu-badge bottomnav-dot" data-tone="red">
                  {count > 99 ? '99+' : count}
                </span>
              ) : null}
            </span>
            <span className="bottomnav-label">{item.short}</span>
          </Link>
        )
      })}
    </nav>
  )
}

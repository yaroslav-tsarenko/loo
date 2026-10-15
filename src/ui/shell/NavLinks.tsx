'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, use, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { NAV } from './nav'
import { NAV_ICONS } from './nav-icons'

// Mobile tab bar: the five daily destinations.
const TABS = new Set(['/', '/feed', '/path', '/review', '/profile'])

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

export function BottomNav() {
  const path = usePathname()
  const counts = use(CountsContext)
  return (
    <nav className="bottomnav" aria-label="Розділи">
      {NAV.filter((i) => TABS.has(i.href)).map((item) => {
        const { icon: Icon, color } = NAV_ICONS[item.href]!
        const active = item.match(path)
        const count = counts[item.href]
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

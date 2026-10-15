'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { House, Layers, Route, Smartphone, UserRound } from 'lucide-react'
import { NAV } from './nav'

const ICONS = { '/': House, '/feed': Smartphone, '/path': Route, '/review': Layers, '/profile': UserRound } as const

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
      {NAV.filter((i) => i.href in ICONS).map((item) => {
        const Icon = ICONS[item.href as keyof typeof ICONS]
        const active = item.match(path)
        const count = counts[item.href]
        return (
          <Link key={item.href} href={item.href} className="bottomnav-link" aria-current={active ? 'page' : undefined}>
            <span className="bottomnav-icon">
              <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
              {count ? <span className="bottomnav-dot tabular">{count > 99 ? '99+' : count}</span> : null}
            </span>
            <span>{item.short}</span>
          </Link>
        )
      })}
    </nav>
  )
}

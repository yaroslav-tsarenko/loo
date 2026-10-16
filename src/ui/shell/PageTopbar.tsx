'use client'

import Link from 'next/link'
import { useEffect, type ReactNode } from 'react'
import { ChevronsRight } from 'lucide-react'
import { PiListBold, PiMagnifyingGlassBold } from 'react-icons/pi'
import { OPEN_PALETTE } from './constants'
import { ShellStats } from './ShellStats'
import { setMobileSidebar, setSidebarOpen, useSidebarOpen } from './sidebar-state'

export interface Crumb {
  label: string
  href?: string
}

export function PageTopbar({ crumbs, children }: { crumbs: Crumb[]; children?: ReactNode }) {
  const open = useSidebarOpen()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        setSidebarOpen(document.documentElement.dataset.sidebar === 'closed')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="page-topbar" data-has-actions={children ? '' : undefined}>
      <button type="button" className="sb-icon-button topbar-menu" aria-label="Відкрити меню" onClick={() => setMobileSidebar(true)}>
        <PiListBold size={22} />
      </button>
      {!open ? (
        <button type="button" className="sb-icon-button topbar-expand" aria-label="Показати бічну панель" title="Показати бічну панель (⌘\)" onClick={() => setSidebarOpen(true)}>
          <ChevronsRight size={18} strokeWidth={1.6} />
        </button>
      ) : null}
      <nav className="crumbs" aria-label="Навігація">
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`} className="crumb-wrap">
            {i > 0 ? (
              <span className="crumb-sep" aria-hidden="true">
                /
              </span>
            ) : null}
            {c.href && i < crumbs.length - 1 ? (
              <Link href={c.href} className="crumb">
                {c.label}
              </Link>
            ) : (
              <span className="crumb" aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      <div className="page-topbar-right">
        {children}
        <ShellStats />
        <button type="button" className="sb-icon-button topbar-search" aria-label="Пошук" onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}>
          <PiMagnifyingGlassBold size={22} />
        </button>
      </div>
    </header>
  )
}

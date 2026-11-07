'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// The admin area's sidebar (src/app/(app)/admin/layout.tsx): sections, the current one highlighted.

const LINKS = [
  { href: '/admin', label: 'Огляд' },
  { href: '/admin/analytics', label: 'Аналітика' },
  { href: '/admin/users', label: 'Користувачі' },
  { href: '/admin/economy', label: 'Економіка' },
  { href: '/admin/audit', label: 'Журнал дій' },
  { href: '/admin/settings', label: 'Налаштування' },
] as const

export function AdminNav() {
  const path = usePathname()
  const current = (href: string) => (href === '/admin' ? path === '/admin' : path === href || path.startsWith(`${href}/`))
  return (
    <nav className="adm-nav" aria-label="Розділи адмінки">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className="adm-nav-link" aria-current={current(l.href) ? 'page' : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  )
}

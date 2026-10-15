'use client'

import { usePathname } from 'next/navigation'
import { NAV } from './nav'
import { PageTopbar } from './PageTopbar'

const EXTRA: Record<string, string> = { '/settings': 'Налаштування', '/account': 'Профіль і акаунт', '/design': 'Дизайн-система', '/viz': 'Візуалізації' }

export function AutoTopbar() {
  const path = usePathname()
  if (path.startsWith('/g/')) return null
  const item = NAV.find((n) => n.match(path))
  const label = item?.label ?? EXTRA[path] ?? 'Сторінка'
  return <PageTopbar crumbs={[{ label }]} />
}

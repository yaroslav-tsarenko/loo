'use client'

import { usePathname } from 'next/navigation'
import { ALL_PRACTICE_NAV } from './course-nav'
import { NAV } from './nav'
import { usePractice } from './NavLinks'
import { PageTopbar } from './PageTopbar'

const EXTRA: Record<string, string> = { '/settings': 'Налаштування', '/account': 'Профіль і акаунт', '/design': 'Дизайн-система', '/viz': 'Візуалізації', '/g': 'Посібники' }

export function AutoTopbar() {
  const path = usePathname()
  // the active course names its own sections first («Слова» rather than «Картки» on /review)
  const practice = usePractice()
  if (path.startsWith('/g/')) return null
  const item = practice.find((n) => n.match(path)) ?? NAV.find((n) => n.match(path)) ?? ALL_PRACTICE_NAV.find((n) => n.match(path))
  const label = item?.label ?? EXTRA[path] ?? 'Сторінка'
  return <PageTopbar crumbs={[{ label }]} />
}

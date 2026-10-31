'use client'

import { usePathname } from 'next/navigation'
import { ALL_PRACTICE_NAV } from './course-nav'
import { NAV } from './nav'
import { usePractice } from './NavLinks'
import { PageTopbar } from './PageTopbar'
import { useLocale, useT } from '@/i18n/react'
import type { MessageKey } from '@/i18n'
import { navLabel } from './nav-i18n'

const EXTRA: Record<string, MessageKey> = { '/settings': 'shell.settings', '/account': 'shell.account', '/design': 'shell.design', '/viz': 'shell.viz', '/g': 'shell.guides' }

export function AutoTopbar() {
  const path = usePathname()
  const t = useT()
  const locale = useLocale()
  // the active course names its own sections first («Слова» rather than «Картки» on /review)
  const practice = usePractice()
  if (path.startsWith('/g/')) return null
  const item = practice.find((n) => n.match(path)) ?? NAV.find((n) => n.match(path)) ?? ALL_PRACTICE_NAV.find((n) => n.match(path))
  const extra = EXTRA[path]
  const label = item ? navLabel(item, locale) : extra ? t(extra) : t('shell.page')
  return <PageTopbar crumbs={[{ label }]} />
}

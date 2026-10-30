'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { DEFAULT_LOCALE, messages, translator, type Dict, type Locale, type Translate } from './index'

// The UI locale for client components: the root layout wraps the app in <LocaleProvider locale={uiLocale}>.
// Outside a provider (tests, signed-out pages) everything is Ukrainian.
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useT(): Translate {
  const locale = useLocale()
  return useMemo(() => translator(locale), [locale])
}

export function useMessages(): Dict {
  return messages(useLocale())
}

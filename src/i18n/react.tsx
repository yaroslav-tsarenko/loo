'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { DEFAULT_LOCALE, messages, registerDictionary, translator, type DeepPartial, type Dict, type Locale, type Translate } from './index'

// The UI locale for client components: the root layout wraps the app in <LocaleProvider locale={uiLocale}>.
// Outside a provider (tests, signed-out pages) everything is Ukrainian.
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

// `dict`: the locale's dictionary (server → client only for learners of that locale), registered before children
// render — in the browser and in the SSR pass alike (idempotent).
export function LocaleProvider({ locale, dict, children }: { locale: Locale; dict?: DeepPartial<Dict>; children: ReactNode }) {
  if (dict && locale !== DEFAULT_LOCALE) registerDictionary(locale as Exclude<Locale, 'uk'>, dict)
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

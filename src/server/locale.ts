import 'server-only'
import { cache } from 'react'
import '@/i18n/register'
import { resolveLocale, translator, type Locale, type Translate } from '@/i18n'
import { getUser } from './auth/session'
import { userBase } from './base'

// The learner's UI locale: profiles.locale when it is a supported Locale, else uk (no profile / signed out: uk).
// Read from the cached base rows (src/server/base.ts), so it costs no extra round trip.
export const uiLocale = cache(async (): Promise<Locale> => {
  if (!(await getUser())) return resolveLocale(null)
  return resolveLocale((await userBase())?.profile.locale)
})

export async function serverT(): Promise<Translate> {
  return translator(await uiLocale())
}

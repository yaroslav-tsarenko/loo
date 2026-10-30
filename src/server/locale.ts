import 'server-only'
import { cache } from 'react'
import { resolveLocale, translator, type Locale, type Translate } from '@/i18n'
import { getUser } from './auth/session'
import { userBase } from './base'

// The learner's UI locale: profiles.locale (nullable — unset means «not chosen»), else uk. Signed-out visitors: uk.
// Read from the cached base rows (src/server/base.ts), so it costs no extra round trip.
export const uiLocale = cache(async (): Promise<Locale> => {
  if (!(await getUser())) return resolveLocale(null)
  return resolveLocale((await userBase())?.profile.locale)
})

export async function serverT(): Promise<Translate> {
  return translator(await uiLocale())
}

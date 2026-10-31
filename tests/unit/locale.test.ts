import { describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, isLocale, LOCALES, resolveLocale } from '@/i18n'

// UI locale from profiles.locale (text NOT NULL DEFAULT 'uk', used as is — no migration): a supported Locale wins,
// anything else falls back to uk (src/server/locale.ts → uiLocale).

describe('resolveLocale', () => {
  it('supported values are used as they are', () => {
    for (const l of LOCALES) expect(resolveLocale(l)).toBe(l)
    expect(resolveLocale('en')).toBe('en')
    expect(resolveLocale('uk')).toBe('uk')
  })

  it('unknown values fall back to uk (no normalisation guessing)', () => {
    for (const v of ['fr', 'EN', 'en-US', 'uk_UA', ' en', '']) expect(resolveLocale(v), JSON.stringify(v)).toBe(DEFAULT_LOCALE)
  })

  it('a missing value (no profile, signed out) is uk', () => {
    expect(resolveLocale(null)).toBe('uk')
    expect(resolveLocale(undefined)).toBe('uk')
  })

  it('isLocale is the account form’s allow-list', () => {
    expect(LOCALES).toEqual(['uk', 'en'])
    expect([isLocale('en'), isLocale('de'), isLocale(1)]).toEqual([true, false, false])
  })
})

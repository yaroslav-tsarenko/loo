import { en } from './en'
import { uk } from './uk'

// Tiny i18n: typed keys, `{name}` placeholders, one dictionary per UI locale. `uk` is complete; other locales are
// partial (DeepPartial of uk) and fall back to `uk` key by key. The learner's locale is `profiles.locale`
// (src/server/locale.ts → uiLocale), `uk` when unset; client components read it from <LocaleProvider> (./react.tsx).
export type Locale = 'uk' | 'en'
export const LOCALES: readonly Locale[] = ['uk', 'en']
export const DEFAULT_LOCALE: Locale = 'uk'
// Native names for the language switch (always shown in their own language).
export const LOCALE_NAMES: Record<Locale, string> = { uk: 'Українська', en: 'English' }

export type Dict = typeof uk
export type DeepPartial<T> = T extends string ? string : T extends readonly unknown[] ? T : { [K in keyof T]?: DeepPartial<T[K]> }

const DICTS: { uk: Dict; en: DeepPartial<Dict> } = { uk, en }

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

// profiles.locale (NOT NULL, default uk) → the UI locale; an unsupported or missing value → uk.
export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}

type Leaves<T, P extends string = ''> = T extends string
  ? P
  : T extends readonly unknown[]
    ? never
    : { [K in keyof T & (string | number)]: Leaves<T[K], P extends '' ? `${K}` : `${P}.${K}`> }[keyof T & (string | number)]

export type MessageKey = Leaves<typeof uk>

function lookup(dict: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), dict)
}

export function format(text: string, vars?: Record<string, string | number>): string {
  return vars ? text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m)) : text
}

export function t(key: MessageKey, vars?: Record<string, string | number>, locale: Locale = DEFAULT_LOCALE): string {
  const own = locale === DEFAULT_LOCALE ? undefined : lookup(DICTS[locale], key)
  const raw = typeof own === 'string' ? own : lookup(DICTS.uk, key)
  return format(typeof raw === 'string' ? raw : key, vars)
}

// A `t` bound to one locale (server components: `const t = translator(await uiLocale())`).
export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string
export function translator(locale: Locale): Translate {
  return (key, vars) => t(key, vars, locale)
}

function merge(base: unknown, over: unknown): unknown {
  if (over === undefined) return base
  if (typeof base !== 'object' || base === null || Array.isArray(base) || typeof over !== 'object' || over === null || Array.isArray(over)) return over
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = merge(out[k], v)
  return out
}

const merged = new Map<Locale, Dict>()

// Structured entries (lists of cards etc.) for components that render them: the locale's dictionary over uk.
export function messages(locale: Locale = DEFAULT_LOCALE): Dict {
  if (locale === DEFAULT_LOCALE) return uk
  let dict = merged.get(locale)
  if (!dict) {
    dict = merge(uk, DICTS[locale]) as Dict
    merged.set(locale, dict)
  }
  return dict
}

// Enum-like content meta («дуже часто», «теорія»…): source-language data in the vault, shown in the UI locale.
export function contentMeta(value: string, locale: Locale = DEFAULT_LOCALE): string {
  const table = messages(locale).contentMeta as Record<string, string>
  return table[value.toLowerCase()] ?? value
}

// Share of uk string leaves a locale translates (for reports and the i18n test), optionally under one key prefix.
export function coverage(locale: Locale, prefix?: string): { total: number; translated: number } {
  let total = 0
  let translated = 0
  const walk = (node: unknown, own: unknown, path: string) => {
    if (typeof node === 'string') {
      if (prefix && !(path === prefix || path.startsWith(`${prefix}.`))) return
      total++
      if (typeof own === 'string') translated++
      return
    }
    if (!node || typeof node !== 'object' || Array.isArray(node)) return
    for (const [k, v] of Object.entries(node)) walk(v, own && typeof own === 'object' ? (own as Record<string, unknown>)[k] : undefined, path ? `${path}.${k}` : k)
  }
  walk(uk, DICTS[locale], '')
  return { total, translated }
}

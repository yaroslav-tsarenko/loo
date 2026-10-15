import { uk } from './uk'

// Tiny i18n: one locale today, typed keys, `{name}` placeholders. Later: pick the dictionary by profile.locale.
export type Locale = 'uk'
export const LOCALES: readonly Locale[] = ['uk']
export const DEFAULT_LOCALE: Locale = 'uk'

const DICTS = { uk } as const

type Leaves<T, P extends string = ''> = T extends string
  ? P
  : T extends readonly unknown[]
    ? never
    : { [K in keyof T & (string | number)]: Leaves<T[K], P extends '' ? `${K}` : `${P}.${K}`> }[keyof T & (string | number)]

export type MessageKey = Leaves<typeof uk>

function lookup(dict: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), dict)
}

export function t(key: MessageKey, vars?: Record<string, string | number>, locale: Locale = DEFAULT_LOCALE): string {
  const raw = lookup(DICTS[locale], key)
  const text = typeof raw === 'string' ? raw : key
  return vars ? text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m)) : text
}

// Structured entries (lists of cards etc.) for components that render them.
export function messages(locale: Locale = DEFAULT_LOCALE) {
  return DICTS[locale]
}

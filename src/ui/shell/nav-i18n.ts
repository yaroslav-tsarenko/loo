import { messages, type Locale } from '@/i18n'

// Nav labels in the UI locale: items keep their Ukrainian label as data (nav.ts, course-nav.ts); the dictionary
// (`nav.*`, `navBadge.*`) names them per locale, keyed by the item's path («/» → today, «/review» → review).
const idOf = (href: string): string => (href === '/' ? 'today' : href.replace(/^\//, '').split('/')[0]!)

export function navLabel(item: { href: string; label: string }, locale: Locale): string {
  const entry = (messages(locale).nav as Record<string, { label: string; short: string } | undefined>)[idOf(item.href)]
  return entry?.label ?? item.label
}

export function navShort(item: { href: string; short: string }, locale: Locale): string {
  const entry = (messages(locale).nav as Record<string, { label: string; short: string } | undefined>)[idOf(item.href)]
  return entry?.short ?? item.short
}

export function badgeLabel(badge: { key: string; label: string }, locale: Locale): string {
  return (messages(locale).navBadge as Record<string, string | undefined>)[badge.key.replace(/^@/, '')] ?? badge.label
}

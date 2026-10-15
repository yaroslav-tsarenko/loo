// Post-login redirect target: same-origin path only. Rejects //evil, /\evil, tabs/newlines and absolute URLs.
const BASE = 'http://same-origin.invalid'

export function safeRedirectPath(raw: unknown, fallback = '/'): string {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 2048) return fallback
  // Only a plain absolute path; backslashes and control chars are normalized away by browsers.
  if (!raw.startsWith('/') || raw.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(raw)) return fallback
  let url: URL
  try {
    url = new URL(raw, BASE)
  } catch {
    return fallback
  }
  if (url.origin !== BASE) return fallback
  const path = `${url.pathname}${url.search}${url.hash}`
  // Never bounce back into the auth endpoints.
  if (url.pathname === '/login' || url.pathname.startsWith('/auth/')) return fallback
  return path
}

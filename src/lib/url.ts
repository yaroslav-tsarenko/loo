// URL allow-listing for anything rendered as a link or image from content, feeds or model output.

const EXTERNAL = new Set(['http:', 'https:'])
const LINK = new Set(['http:', 'https:', 'mailto:', 'obsidian:'])
// Same-origin-relative: "/path", "#hash", "?q" or a plain relative path. Not "//host" or "\\host".
const RELATIVE = /^(?:\/(?![/\\])|[?#]|[^:/?#\\]+(?:[/?#]|$))/

function hasControlChars(value: string): boolean {
  return /[\u0000-\u001f\u007f]/.test(value)
}

function absolute(value: string, schemes: ReadonlySet<string>): string | null {
  try {
    const url = new URL(value)
    if (!schemes.has(url.protocol)) return null
    if ((url.protocol === 'http:' || url.protocol === 'https:') && (url.username || url.password || !url.hostname)) return null
    return url.href
  } catch {
    return null
  }
}

// http(s) only — news items, AI reel sources, anything from outside.
export function safeExternalUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (!value || value.length > 2048 || hasControlChars(value)) return null
  return absolute(value, EXTERNAL)
}

// Links inside rendered markdown: http(s), mailto, obsidian, or same-origin relative.
export function safeLinkHref(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (!value || value.length > 2048 || hasControlChars(value)) return null
  if (RELATIVE.test(value) && !value.includes('\\')) return value
  return absolute(value, LINK)
}

// Images: same-origin relative only (vault assets via /api/vault-asset) and inline data: images.
export function safeImageSrc(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (!value || hasControlChars(value)) return null
  if (/^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=]+$/i.test(value)) return value.length <= 2_000_000 ? value : null
  if (value.length > 2048 || value.includes('\\')) return null
  return value.startsWith('/') && !value.startsWith('//') ? value : null
}

// decodeURIComponent that never throws: a malformed escape (`%E0%A4%A`) comes back as it was.
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

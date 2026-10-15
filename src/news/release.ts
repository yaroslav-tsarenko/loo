// Version parsing for release titles: "v16.4.1", "TypeScript 6.0 Beta", "2026-10-14, Version 26.12.0 (Current), @x".

export const SECURITY_RE = /security|CVE-\d{4}-\d+|vulnerab/i
const NIGHTLY = /canary|nightly|alpha|experimental|insiders|\bdev\b|-next|snapshot/i

export interface ReleaseInfo {
  version: string
  major: number
  minor: number
  patch: number
  pre: string | null
}

export function parseRelease(title: string): ReleaseInfo | null {
  const m = /\bv?(\d+)\.(\d+)(?:\.(\d+))?(?:[-\s.]?(alpha|beta|rc|canary|nightly|next|dev|pre)[.-]?(\d+)?)?/i.exec(title)
  if (!m) return null
  const pre = m[4] ? `${m[4].toLowerCase()}${m[5] ? `.${m[5]}` : ''}` : null
  return { version: `${m[1]}.${m[2]}${m[3] ? `.${m[3]}` : ''}`, major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3] ?? 0), pre }
}

// Major/minor releases and first beta/RC; patches only when they fix security issues.
export function isNotableRelease(title: string, body: string): boolean {
  if (NIGHTLY.test(title)) return false
  const r = parseRelease(title)
  if (!r) return false
  if (r.pre) return /^(beta|rc)(\.0)?$/.test(r.pre)
  return r.patch === 0 || SECURITY_RE.test(title) || SECURITY_RE.test(body.slice(0, 3000))
}

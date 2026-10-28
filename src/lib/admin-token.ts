// Admin-area session (docs/ANALYTICS.md «Адмінка»): the owner signs in on /login with ADMIN_LOGIN_EMAIL and the
// password whose scrypt hash is ADMIN_PASSWORD_HASH; the server then sets an HMAC-signed, httpOnly cookie that opens
// /admin only. It is not a Supabase session (no learner account, no progress). Web Crypto, so the proxy can verify it.

export const ADMIN_COOKIE = 'loo_admin'
export const ADMIN_TTL_S = 12 * 60 * 60

const enc = new TextEncoder()

function base64url(bytes: ArrayBuffer): string {
  let s = ''
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return base64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}

// constant time for equal lengths (the signature length is fixed)
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// The secret must be long enough to be worth signing with; otherwise the admin area stays closed.
export const adminSecret = (env: Record<string, string | undefined> = process.env): string | null => {
  const s = env.ADMIN_SESSION_SECRET
  return s && s.length >= 32 ? s : null
}

export async function signAdminToken(secret: string, now: number): Promise<string> {
  const body = `v1.${now + ADMIN_TTL_S * 1000}`
  return `${body}.${await hmac(secret, body)}`
}

export async function verifyAdminToken(secret: string | null, token: string | undefined, now: number): Promise<boolean> {
  if (!secret || !token) return false
  const parts = token.split('.')
  if (parts.length !== 3 || parts[0] !== 'v1') return false
  const exp = Number(parts[1])
  if (!Number.isFinite(exp) || exp <= now || exp > now + ADMIN_TTL_S * 1000) return false
  return same(parts[2]!, await hmac(secret, `${parts[0]}.${parts[1]}`))
}

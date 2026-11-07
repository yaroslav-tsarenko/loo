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

// v2.<expires>.<epoch>.<signature>. The epoch is the admin-session generation in system_state
// (src/server/admin/session.ts): signing out (or «sign out everywhere») bumps it, and every token signed before is
// refused by the admin guard — a copied cookie stops working. The proxy only checks the signature and expiry (no
// database there); the guard behind it checks the epoch.
export async function signAdminToken(secret: string, now: number, epoch = 0): Promise<string> {
  const body = `v2.${now + ADMIN_TTL_S * 1000}.${Math.max(0, Math.floor(epoch))}`
  return `${body}.${await hmac(secret, body)}`
}

// The token's epoch when it is genuine and unexpired, else null.
export async function adminTokenEpoch(secret: string | null, token: string | undefined, now: number): Promise<number | null> {
  if (!secret || !token) return null
  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== 'v2') return null
  const exp = Number(parts[1])
  const epoch = Number(parts[2])
  if (!Number.isFinite(exp) || exp <= now || exp > now + ADMIN_TTL_S * 1000 || !Number.isInteger(epoch) || epoch < 0) return null
  return same(parts[3]!, await hmac(secret, `${parts[0]}.${parts[1]}.${parts[2]}`)) ? epoch : null
}

export async function verifyAdminToken(secret: string | null, token: string | undefined, now: number): Promise<boolean> {
  return (await adminTokenEpoch(secret, token, now)) !== null
}

// Between the password and the TOTP code (src/app/(app)/(auth)/auth/admin-verify): a 5-minute signed marker that the
// password was right. Not an admin session — it opens nothing but the code form.
export const ADMIN_PENDING_COOKIE = 'loo_admin_pending'
export const ADMIN_PENDING_TTL_S = 5 * 60

export async function signAdminPending(secret: string, now: number): Promise<string> {
  const body = `p1.${now + ADMIN_PENDING_TTL_S * 1000}`
  return `${body}.${await hmac(secret, `pending:${body}`)}`
}

export async function verifyAdminPending(secret: string | null, token: string | undefined, now: number): Promise<boolean> {
  if (!secret || !token) return false
  const parts = token.split('.')
  if (parts.length !== 3 || parts[0] !== 'p1') return false
  const exp = Number(parts[1])
  if (!Number.isFinite(exp) || exp <= now || exp > now + ADMIN_PENDING_TTL_S * 1000) return false
  return same(parts[2]!, await hmac(secret, `pending:${parts[0]}.${parts[1]}`))
}

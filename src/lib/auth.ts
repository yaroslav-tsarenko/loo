// Single-user auth: a password from env, exchanged for a signed long-lived cookie.
// Uses Web Crypto so it runs both in proxy.ts and in server actions.

export const SESSION_COOKIE = 'ip_session'
export const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000

export type AuthMode = 'open' | 'locked' | 'password'

// open: local dev without a password; locked: deployed without a password (fail closed).
export function authMode(): AuthMode {
  if (process.env.APP_PASSWORD) return 'password'
  return process.env.VERCEL ? 'locked' : 'open'
}

function secret(): string {
  return process.env.AUTH_SECRET || `${process.env.APP_PASSWORD ?? ''}::interview-prep`
}

const encoder = new TextEncoder()

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return Buffer.from(sig).toString('base64url')
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(now = Date.now()): Promise<string> {
  const expires = String(now + SESSION_TTL_MS)
  return `${expires}.${await hmac(expires)}`
}

export async function verifySessionToken(token: string | undefined, now = Date.now()): Promise<boolean> {
  if (!token) return false
  const dot = token.indexOf('.')
  if (dot < 0) return false
  const expires = token.slice(0, dot)
  if (!/^\d+$/.test(expires) || Number(expires) < now) return false
  return safeEqual(token.slice(dot + 1), await hmac(expires))
}

export async function passwordMatches(input: string): Promise<boolean> {
  const expected = process.env.APP_PASSWORD
  if (!expected) return false
  // Compare digests so the comparison time doesn't depend on the password length.
  return safeEqual(await hmac(`pw:${input}`), await hmac(`pw:${expected}`))
}

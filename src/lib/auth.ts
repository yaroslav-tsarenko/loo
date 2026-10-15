// Single-user auth: a password from env, exchanged for a signed session cookie.
// Uses Web Crypto so it runs both in proxy.ts and in route handlers / server actions.

export const SESSION_COOKIE = 'ip_session'
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
// Sliding session: proxy.ts re-issues the cookie once less than this is left.
export const SESSION_RENEW_BELOW_MS = 15 * 24 * 60 * 60 * 1000
const MAX_TOKEN_LENGTH = 128
export const MIN_SECRET_LENGTH = 32

export type AuthMode = 'open' | 'locked' | 'password'

// open: local dev without a password; locked: deployed without a usable password/secret (fail closed).
export function authMode(env: Record<string, string | undefined> = process.env): AuthMode {
  if (env.APP_PASSWORD) {
    // Deployed: the HMAC key must be a real secret, not derived from the password
    // (a stolen cookie would otherwise allow an offline guess of the password).
    if (env.VERCEL && (env.AUTH_SECRET?.length ?? 0) < MIN_SECRET_LENGTH) return 'locked'
    return 'password'
  }
  return env.VERCEL ? 'locked' : 'open'
}

function secret(): string {
  const configured = process.env.AUTH_SECRET
  if (configured && configured.length >= MIN_SECRET_LENGTH) return configured
  // Local-only fallback (authMode() locks deployed apps without AUTH_SECRET).
  return `${process.env.APP_PASSWORD ?? ''}::interview-prep::${configured ?? ''}`
}

const encoder = new TextEncoder()
let keyCache: { secret: string; key: Promise<CryptoKey> } | null = null

function hmacKey(): Promise<CryptoKey> {
  const s = secret()
  if (keyCache?.secret !== s) {
    keyCache = { secret: s, key: crypto.subtle.importKey('raw', encoder.encode(s), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']) }
  }
  return keyCache.key
}

async function hmac(value: string): Promise<string> {
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(value))
  return Buffer.from(sig).toString('base64url')
}

// Constant-time for equal lengths; callers compare fixed-length digests so length leaks nothing.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function sha256(value: string): Promise<string> {
  return Buffer.from(await crypto.subtle.digest('SHA-256', encoder.encode(value))).toString('base64url')
}

// Timing-safe comparison of two secrets of any length (digests first, then constant-time compare).
export async function secretsEqual(input: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(input), sha256(expected)])
  return safeEqual(a, b)
}

export async function createSessionToken(now = Date.now()): Promise<string> {
  const expires = String(now + SESSION_TTL_MS)
  return `${expires}.${await hmac(`session:${expires}`)}`
}

// Returns the expiry (ms) of a valid token, or null.
export async function sessionExpiry(token: string | undefined, now = Date.now()): Promise<number | null> {
  if (!token || token.length > MAX_TOKEN_LENGTH) return null
  const dot = token.indexOf('.')
  if (dot < 0) return null
  const expires = token.slice(0, dot)
  if (!/^\d{1,16}$/.test(expires)) return null
  const at = Number(expires)
  // Reject expired tokens and tokens claiming more than one TTL ahead (never issued by us).
  if (at < now || at > now + SESSION_TTL_MS + 60_000) return null
  return safeEqual(token.slice(dot + 1), await hmac(`session:${expires}`)) ? at : null
}

export async function verifySessionToken(token: string | undefined, now = Date.now()): Promise<boolean> {
  return (await sessionExpiry(token, now)) !== null
}

export async function passwordMatches(input: string): Promise<boolean> {
  const expected = process.env.APP_PASSWORD
  if (!expected || input.length === 0 || input.length > 1024) return false
  // Compare keyed digests so the comparison time doesn't depend on the password length.
  return safeEqual(await hmac(`pw:${input}`), await hmac(`pw:${expected}`))
}

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Missing secret → always false (fail closed).
export async function cronAuthorized(header: string | null, cronSecret = process.env.CRON_SECRET): Promise<boolean> {
  if (!cronSecret || cronSecret.length < 16 || !header) return false
  return secretsEqual(header, `Bearer ${cronSecret}`)
}

export interface SessionCookieOptions {
  httpOnly: true
  secure: boolean
  sameSite: 'lax'
  path: '/'
  maxAge: number
}

export function sessionCookieOptions(secure: boolean): SessionCookieOptions {
  return { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: SESSION_TTL_MS / 1000 }
}

// Shared secret checks (Web Crypto, so they run in proxy.ts and route handlers alike).
// User sign-in is Supabase Auth: see src/server/auth and src/proxy.ts.

const encoder = new TextEncoder()

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

// Stable, non-reversible key for rate limits on personal identifiers (emails never stored in clear).
export async function hashKey(value: string): Promise<string> {
  return (await sha256(value.trim().toLowerCase())).slice(0, 32)
}

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Missing secret → always false (fail closed).
export async function cronAuthorized(header: string | null, cronSecret = process.env.CRON_SECRET): Promise<boolean> {
  if (!cronSecret || cronSecret.length < 16 || !header) return false
  return secretsEqual(header, `Bearer ${cronSecret}`)
}

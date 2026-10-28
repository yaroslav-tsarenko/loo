import 'server-only'
import { scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto'

// The owner's admin login (docs/ANALYTICS.md «Адмінка»): ADMIN_LOGIN_EMAIL + a password stored only as an scrypt hash,
// ADMIN_PASSWORD_HASH = scrypt:<N>:<r>:<p>:<salt b64>:<hash b64> (pnpm admin:credentials writes it). Not «$»:
// Next.js expands $VARS in .env files.

const derive = (password: string, salt: Buffer, keylen: number, opts: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) => scrypt(password, salt, keylen, opts, (err, key) => (err ? reject(err) : resolve(key))))

export async function passwordMatches(password: string, stored: string | undefined): Promise<boolean> {
  const parts = stored?.split(':')
  if (!parts || parts.length !== 6 || parts[0] !== 'scrypt') return false
  const [, n, r, p, salt, hash] = parts
  const want = Buffer.from(hash!, 'base64')
  if (want.length < 32) return false
  const got = await derive(password, Buffer.from(salt!, 'base64'), want.length, { N: Number(n), r: Number(r), p: Number(p), maxmem: 256 * 1024 * 1024 })
  return got.length === want.length && timingSafeEqual(got, want)
}

export type AdminLogin = 'not-admin' | 'ok' | 'bad'

// Is this sign-in the admin's? 'not-admin' → the regular Supabase sign-in goes on.
export async function adminLogin(email: string, password: string, env: Record<string, string | undefined> = process.env): Promise<AdminLogin> {
  const adminEmail = env.ADMIN_LOGIN_EMAIL?.trim().toLowerCase()
  if (!adminEmail || !env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET || email.trim().toLowerCase() !== adminEmail) return 'not-admin'
  return (await passwordMatches(password, env.ADMIN_PASSWORD_HASH)) ? 'ok' : 'bad'
}

import { createHmac, timingSafeEqual } from 'node:crypto'

// Time-based one-time codes (RFC 6238: HMAC-SHA1, 30-second steps, 6 digits) — what Google Authenticator, 1Password,
// Authy… produce from a base32 secret. Used as the admin login's second factor (ADMIN_TOTP_SECRET).

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function base32Decode(text: string): Buffer {
  const clean = text.toUpperCase().replace(/[\s=-]/g, '')
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const c of clean) {
    const i = B32.indexOf(c)
    if (i < 0) throw new Error('totp: not base32')
    value = (value << 5) | i
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(out)
}

export function base32Encode(bytes: Uint8Array): string {
  let bits = 0
  let value = 0
  let out = ''
  for (const b of bytes) {
    value = (value << 8) | b
    bits += 8
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31]
  return out
}

export function hotp(key: Buffer, counter: number, digits = 6): string {
  const msg = Buffer.alloc(8)
  msg.writeBigUInt64BE(BigInt(counter))
  const mac = createHmac('sha1', key).update(msg).digest()
  const offset = mac[mac.length - 1]! & 0x0f
  const code = (mac.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits
  return String(code).padStart(digits, '0')
}

export const TOTP_STEP_S = 30

// The step a valid code belongs to (to refuse reusing it), or null. ±1 step for clock drift.
export function totpStep(secretBase32: string, code: string, now: number, digits = 6): number | null {
  if (!/^\d+$/.test(code) || code.length !== digits) return null
  const key = base32Decode(secretBase32)
  const current = Math.floor(now / 1000 / TOTP_STEP_S)
  for (const step of [current, current - 1, current + 1]) {
    const want = Buffer.from(hotp(key, step, digits))
    if (timingSafeEqual(want, Buffer.from(code))) return step
  }
  return null
}

export function otpauthUri(secretBase32: string, account: string, issuer = 'Loo'): string {
  return `otpauth://totp/${encodeURIComponent(`${issuer}:${account}`)}?secret=${secretBase32}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=${TOTP_STEP_S}`
}

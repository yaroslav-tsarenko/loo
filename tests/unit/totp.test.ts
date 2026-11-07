import { describe, expect, it } from 'vitest'
import { base32Decode, base32Encode, hotp, otpauthUri, totpStep } from '@/lib/totp'

// RFC 6238 Appendix B (SHA-1 secret "12345678901234567890"), last 6 of the 8-digit codes; RFC 4226 Appendix D.
const SECRET = base32Encode(Buffer.from('12345678901234567890'))

describe('TOTP (admin second factor)', () => {
  it('matches the RFC 4226 HOTP vectors', () => {
    const key = Buffer.from('12345678901234567890')
    expect([0, 1, 2, 3, 9].map((c) => hotp(key, c))).toEqual(['755224', '287082', '359152', '969429', '520489'])
  })

  it('matches the RFC 6238 TOTP vectors (±1 step for clock drift, nothing further)', () => {
    expect(totpStep(SECRET, '287082', 59_000)).toBe(1)
    expect(totpStep(SECRET, '081804', 1111111109_000)).toBe(37037036)
    expect(totpStep(SECRET, '050471', 1111111111_000)).toBe(37037037)
    expect(totpStep(SECRET, '050471', 1111111111_000 + 30_000)).toBe(37037037)
    expect(totpStep(SECRET, '050471', 1111111111_000 + 90_000)).toBeNull()
    expect(totpStep(SECRET, '12345', 59_000)).toBeNull()
    expect(totpStep(SECRET, 'abcdef', 59_000)).toBeNull()
  })

  it('round-trips base32 and builds an otpauth link', () => {
    expect(base32Decode(SECRET).toString()).toBe('12345678901234567890')
    expect(otpauthUri(SECRET, 'admin@playloo.app')).toMatch(/^otpauth:\/\/totp\/Loo%3Aadmin%40playloo\.app\?secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ&issuer=Loo/)
  })
})

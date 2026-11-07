import { describe, expect, it } from 'vitest'
import { anonymizeIp, ipNetwork } from '@/server/analytics/ip'

describe('analytics IPs are stored as network tokens', () => {
  it('reduces an address to its network (/24, /48)', () => {
    expect(ipNetwork('91.200.12.34')).toBe('91.200.12.0/24')
    expect(ipNetwork('::ffff:91.200.12.34')).toBe('91.200.12.0/24')
    expect(ipNetwork('2a02:2378:1234:5678::1')).toBe('2a02:2378:1234::/48')
    expect(ipNetwork('2a02:0db8::1')).toBe('2a02:db8:0::/48')
    expect(ipNetwork('not an ip')).toBeNull()
  })

  it('same network → same token, never the address; different secret → different token', () => {
    const a = anonymizeIp('91.200.12.34', 's1')
    expect(a).toMatch(/^h:[\w-]{12}$/)
    expect(anonymizeIp('91.200.12.250', 's1')).toBe(a)
    expect(anonymizeIp('91.200.13.34', 's1')).not.toBe(a)
    expect(anonymizeIp('91.200.12.34', 's2')).not.toBe(a)
    expect(a).not.toContain('91.200')
    // idempotent: a token stays as it is
    expect(anonymizeIp(a, 's1')).toBe(a)
    expect(anonymizeIp(null)).toBeNull()
  })
})

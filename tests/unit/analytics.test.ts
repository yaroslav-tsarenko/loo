import { describe, expect, it } from 'vitest'
import { signAdminToken, verifyAdminToken } from '@/lib/admin-token'
import { isPublicRequest } from '@/lib/auth-paths'
import { BeaconSchema, cleanPath, isBot, kyivDay, parseAgent, placeOf, rowsOf } from '@/server/analytics/collect'

const SECRET = 'x'.repeat(40)

describe('admin token', () => {
  it('verifies its own signature until it expires', async () => {
    const now = Date.now()
    const token = await signAdminToken(SECRET, now)
    expect(await verifyAdminToken(SECRET, token, now + 1000)).toBe(true)
    expect(await verifyAdminToken(SECRET, token, now + 13 * 3600_000)).toBe(false)
    expect(await verifyAdminToken('y'.repeat(40), token, now)).toBe(false)
    expect(await verifyAdminToken(SECRET, token.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A')), now)).toBe(false)
    expect(await verifyAdminToken(null, token, now)).toBe(false)
    expect(await verifyAdminToken(SECRET, undefined, now)).toBe(false)
  })
})

describe('analytics collector', () => {
  it('is reachable without a session, POST only', () => {
    expect(isPublicRequest('POST', '/api/a', false)).toBe(true)
    expect(isPublicRequest('GET', '/api/a', false)).toBe(false)
  })

  it('validates beacons strictly', () => {
    const ok = { v: 'visitor_1234', s: 'session_1234', e: [{ t: 'pageview', p: '/blog/x', at: 1 }] }
    expect(BeaconSchema.safeParse(ok).success).toBe(true)
    expect(BeaconSchema.safeParse({ ...ok, e: [] }).success).toBe(false)
    expect(BeaconSchema.safeParse({ ...ok, v: 'short' }).success).toBe(false)
    expect(BeaconSchema.safeParse({ ...ok, e: [{ t: 'hack', p: '/' }] }).success).toBe(false)
    expect(BeaconSchema.safeParse({ ...ok, extra: 1 }).success).toBe(false)
  })

  it('keeps same-site paths only and recognises bots and devices', () => {
    expect(cleanPath('/path?x=1')).toBe('/path?x=1')
    expect(cleanPath('//evil.com/a')).toBeNull()
    expect(cleanPath('https://evil.com')).toBeNull()
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true)
    expect(isBot('')).toBe(true)
    expect(parseAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1')).toEqual({ device: 'mobile', browser: 'Safari', os: 'iOS' })
    expect(parseAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/141.0 Safari/537.36 Edg/141.0')).toEqual({ device: 'desktop', browser: 'Edge', os: 'Windows' })
  })

  it('enriches rows with place, agent and a Kyiv day; clamps the client clock', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1', 'x-vercel-ip-country': 'UA', 'x-vercel-ip-city': 'Kyiv%20City' })
    const place = placeOf(headers)
    expect(place).toEqual({ ip: '203.0.113.7', country: 'UA', region: null, city: 'Kyiv City' })
    const now = Date.UTC(2026, 9, 28, 22, 30)
    const beacon = BeaconSchema.parse({ v: 'visitor_1234', s: 'session_1234', e: [{ t: 'click', p: '/', at: now - 3600_000, tg: { label: 'Почати', x: 50 } }, { t: 'pageview', p: 'https://x' }] })
    const rows = rowsOf(beacon, { now, userId: null, place, agent: parseAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/141') })
    expect(rows).toHaveLength(1)
    expect(rows[0]!.at).toBe(now)
    expect(rows[0]!.day).toBe(kyivDay(now))
    expect(kyivDay(now)).toBe('2026-10-29')
    expect(rows[0]!.target).toEqual({ label: 'Почати', x: 50 })
  })
})

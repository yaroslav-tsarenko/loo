import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
const { authorizeUrl, decodeFlow, encodeFlow, googleClient, newFlow, sha256hex } = await import('@/server/auth/google')

describe('google sign-in on our domain', () => {
  it('needs both client id and secret', () => {
    expect(googleClient({ GOOGLE_CLIENT_ID: 'id' })).toBeNull()
    expect(googleClient({ GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: ' s ' })).toEqual({ id: 'id', secret: 's' })
  })

  it('sends Google the hashed nonce, a PKCE challenge and our callback', () => {
    const flow = newFlow('/feed')
    const url = new URL(authorizeUrl(flow, 'cid', 'https://playloo.app'))
    expect(url.origin).toBe('https://accounts.google.com')
    expect(url.searchParams.get('redirect_uri')).toBe('https://playloo.app/auth/google/callback')
    expect(url.searchParams.get('nonce')).toBe(sha256hex(flow.nonce))
    expect(url.searchParams.get('nonce')).not.toBe(flow.nonce)
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
    expect(url.searchParams.get('code_challenge')).not.toBe(flow.verifier)
    expect(url.searchParams.get('state')).toBe(flow.state)
  })

  it('round-trips the flow cookie and rejects junk', () => {
    const flow = newFlow('/')
    expect(decodeFlow(encodeFlow(flow))).toEqual(flow)
    for (const bad of [undefined, '', 'x', Buffer.from('{"state":1}').toString('base64url'), 'a'.repeat(3000)]) expect(decodeFlow(bad)).toBeNull()
  })
})

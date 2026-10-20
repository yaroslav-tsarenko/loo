import 'server-only'
import { createHash, randomBytes } from 'node:crypto'

// Google sign-in on our own domain (docs/AUTH.md): the browser goes to Google with redirect_uri
// https://playloo.app/auth/google/callback, so Google's account chooser says «continue to playloo.app» instead of the
// Supabase project host. We exchange the code ourselves (PKCE + client secret) and hand the ID token to Supabase
// (signInWithIdToken), which verifies it against the same client id and creates / links the account as before.
// Without GOOGLE_CLIENT_SECRET the classic Supabase redirect flow is used.

export const GOOGLE_COOKIE = 'loo_google'
export const GOOGLE_CALLBACK = '/auth/google/callback'

export function googleClient(env: Record<string, string | undefined> = process.env): { id: string; secret: string } | null {
  const id = env.GOOGLE_CLIENT_ID?.trim()
  const secret = env.GOOGLE_CLIENT_SECRET?.trim()
  return id && secret ? { id, secret } : null
}

const b64url = (buf: Buffer) => buf.toString('base64url')
export const sha256hex = (s: string) => createHash('sha256').update(s).digest('hex')

export interface GoogleFlow {
  state: string
  /** Raw nonce: Google gets its SHA-256, Supabase the raw value (it hashes and compares). */
  nonce: string
  verifier: string
  next: string
}

export function newFlow(next: string): GoogleFlow {
  return { state: b64url(randomBytes(24)), nonce: b64url(randomBytes(24)), verifier: b64url(randomBytes(48)), next }
}

export function authorizeUrl(flow: GoogleFlow, clientId: string, origin: string): string {
  const challenge = b64url(createHash('sha256').update(flow.verifier).digest())
  const q = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}${GOOGLE_CALLBACK}`,
    response_type: 'code',
    scope: 'openid email profile',
    state: flow.state,
    nonce: sha256hex(flow.nonce),
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`
}

export function encodeFlow(flow: GoogleFlow): string {
  return b64url(Buffer.from(JSON.stringify(flow)))
}

export function decodeFlow(raw: string | undefined): GoogleFlow | null {
  if (!raw || raw.length > 2048) return null
  try {
    const v = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as Partial<GoogleFlow>
    return typeof v.state === 'string' && typeof v.nonce === 'string' && typeof v.verifier === 'string' && typeof v.next === 'string'
      ? { state: v.state, nonce: v.nonce, verifier: v.verifier, next: v.next }
      : null
  } catch {
    return null
  }
}

/** Code → ID token at Google's token endpoint; null on any failure. */
export async function exchangeCode(code: string, flow: GoogleFlow, client: { id: string; secret: string }, origin: string): Promise<string | null> {
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: client.id,
        client_secret: client.secret,
        redirect_uri: `${origin}${GOOGLE_CALLBACK}`,
        grant_type: 'authorization_code',
        code_verifier: flow.verifier,
      }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.warn('[auth] google token exchange failed', { status: res.status })
      return null
    }
    const body = (await res.json()) as { id_token?: unknown }
    return typeof body.id_token === 'string' ? body.id_token : null
  } catch {
    return null
  }
}

import type { JwtPayload, User } from '@supabase/supabase-js'
import { isUuid } from './config'

// The verified user as the app sees it. Pure mapping from Supabase JWT claims / user objects (unit-tested).

export interface AuthUser {
  id: string
  email: string | null
  // From the identity provider (OAuth) or sign-up form; display only, never used for authorization.
  name: string | null
  avatarUrl: string | null
  aal: string
  // When the user last actually authenticated (password / OAuth / OTP), ms. Used for re-auth checks.
  authTime: number
  // DEV_AUTH_BYPASS user (local next dev only).
  dev?: boolean
}

type Meta = Record<string, unknown>

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, 500) : null
}

export function metaName(meta: Meta | undefined): string | null {
  return str(meta?.display_name) ?? str(meta?.full_name) ?? str(meta?.name) ?? str(meta?.user_name)
}

// OAuth profile pictures only over https (the CSP allows Google / GitHub avatar hosts).
export function metaAvatar(meta: Meta | undefined): string | null {
  const raw = str(meta?.avatar_url) ?? str(meta?.picture)
  return raw && raw.startsWith('https://') ? raw : null
}

// Most recent authentication method timestamp (amr), falling back to the token's issue time.
export function authTimeOf(claims: Pick<JwtPayload, 'amr' | 'iat'>): number {
  let latest = 0
  for (const entry of claims.amr ?? []) {
    if (typeof entry === 'object' && entry && typeof entry.timestamp === 'number') latest = Math.max(latest, entry.timestamp)
  }
  return (latest || claims.iat || 0) * 1000
}

export function userFromClaims(claims: JwtPayload): AuthUser | null {
  if (!isUuid(claims.sub) || claims.role !== 'authenticated' || claims.is_anonymous) return null
  return {
    id: claims.sub,
    email: claims.email ?? null,
    name: metaName(claims.user_metadata),
    avatarUrl: metaAvatar(claims.user_metadata),
    aal: claims.aal ?? 'aal1',
    authTime: authTimeOf(claims),
  }
}

// Right after a sign-in (password, code exchange, OTP): the user object from the Auth server.
export function userFromAuthUser(user: User, now = Date.now()): AuthUser {
  return {
    id: user.id,
    email: user.email ?? null,
    name: metaName(user.user_metadata),
    avatarUrl: metaAvatar(user.user_metadata),
    aal: 'aal1',
    authTime: now,
  }
}

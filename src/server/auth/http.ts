import 'server-only'
import { NextResponse, type NextRequest } from 'next/server'
import { hashKey } from '@/lib/auth'
import { clientIp, hitAll, peekAll, type RateLimitRule } from '@/lib/rate-limit'
import { safeRedirectPath } from '@/lib/redirect'
import { dbRateLimitStore } from '../rate-limit-store'
import { ensureProfile } from './profile'
import type { AuthUser } from './session'

// Helpers for the auth route handlers (src/app/(app)/(auth)/auth/*). These are plain form posts / redirects: no server
// action is reachable without a session (proxy.ts), and each handler checks the Origin itself.

const MAX_FORM_BYTES = 8192

// Relative Location: stays on whatever host the browser used (request.url can be normalized to localhost).
export function seeOther(location: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store' } })
}

export function backTo(page: string, params: Record<string, string | undefined>): NextResponse {
  const query = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => Boolean(e[1]))).toString()
  return seeOther(query ? `${page}?${query}` : page)
}

export async function readForm(request: NextRequest): Promise<FormData | null> {
  const length = Number(request.headers.get('content-length') ?? '0')
  if (!Number.isFinite(length) || length > MAX_FORM_BYTES) return null
  try {
    return await request.formData()
  } catch {
    return null
  }
}

export function field(form: FormData, name: string, max = 1024): string {
  const value = form.get(name)
  return typeof value === 'string' ? value.slice(0, max) : ''
}

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,63}$/

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase()
  return email.length <= 254 && EMAIL.test(email) ? email : null
}

// docs/SECURITY.md §4.3: length only, no composition rules (Supabase can add leaked-password checks).
export const PASSWORD_MIN = 10
export const PASSWORD_MAX = 128

export function passwordProblem(password: string): 'weak' | null {
  return password.length < PASSWORD_MIN || password.length > PASSWORD_MAX ? 'weak' : null
}

// Origin for links in auth emails / OAuth redirects. SITE_URL pins it in production; Supabase additionally only
// accepts redirect URLs from its allow-list (Authentication → URL Configuration).
export function siteOrigin(request: NextRequest): string {
  const pinned = process.env.SITE_URL?.trim()
  if (pinned) {
    try {
      return new URL(pinned).origin
    } catch {}
  }
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '')
  return `${proto === 'https' ? 'https' : 'http'}://${host}`
}

export function nextPath(raw: unknown): string {
  return safeRedirectPath(raw, '/')
}

export interface LimitCheck {
  key: string
  rule: RateLimitRule
}

// Fails closed: without a working limiter there is no brute-force protection.
export type LimitState = 'ok' | 'rate' | 'unavailable'

const checksFor = (request: NextRequest, scope: string, perIp: RateLimitRule, extra: LimitCheck[]): LimitCheck[] => [
  { key: `${scope}:ip:${clientIp(request.headers)}`, rule: perIp },
  ...extra,
]

// Counts this request against every rule. Fails closed, but reports an outage separately from a real limit.
export async function limited(request: NextRequest, scope: string, perIp: RateLimitRule, extra: LimitCheck[] = []): Promise<LimitState> {
  try {
    const result = await hitAll(dbRateLimitStore, checksFor(request, scope, perIp, extra))
    if (!result.allowed) console.warn('[auth] rate-limited', { scope, retryAfterMs: result.retryAfterMs })
    return result.allowed ? 'ok' : 'rate'
  } catch (error) {
    console.error('[auth] rate limiter unavailable', error)
    return 'unavailable'
  }
}

// Sign-in only counts failures: a correct password is never locked out, guessing still is.
export async function failuresBlocked(request: NextRequest, scope: string, perIp: RateLimitRule, extra: LimitCheck[] = []): Promise<LimitState> {
  try {
    const result = await peekAll(dbRateLimitStore, checksFor(request, scope, perIp, extra))
    if (!result.allowed) console.warn('[auth] rate-limited', { scope, retryAfterMs: result.retryAfterMs })
    return result.allowed ? 'ok' : 'rate'
  } catch (error) {
    console.error('[auth] rate limiter unavailable', error)
    return 'unavailable'
  }
}

export async function recordFailure(request: NextRequest, scope: string, perIp: RateLimitRule, extra: LimitCheck[] = []): Promise<void> {
  try {
    await hitAll(dbRateLimitStore, checksFor(request, scope, perIp, extra))
  } catch (error) {
    console.error('[auth] rate limiter unavailable', error)
  }
}

export async function emailLimit(scope: string, email: string, rule: RateLimitRule): Promise<LimitCheck> {
  return { key: `${scope}:email:${await hashKey(email)}`, rule }
}

// Flat delay on failures: slows serial guessing and evens out timing between "no such user" and "wrong password".
export function failureDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 400 + Math.random() * 200))
}

// After any successful sign-in: create the profile (admin + legacy claim for ADMIN_EMAILS) and pick where to go.
export async function afterSignIn(user: AuthUser, verifiedEmail: boolean, next: string): Promise<string> {
  const profile = await ensureProfile(user, { verifiedEmail })
  if (!profile.onboarding.completedAt) return next === '/' ? '/onboarding' : `/onboarding?next=${encodeURIComponent(next)}`
  return next
}

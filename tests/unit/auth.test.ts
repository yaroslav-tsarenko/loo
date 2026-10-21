import { getTableConfig, PgDialect, PgTable } from 'drizzle-orm/pg-core'
import { is } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import * as schema from '@/db/schema'
import type { Db } from '@/db/client'
import { isAdminEmail, adminEmails } from '@/lib/admin'
import { hashKey } from '@/lib/auth'
import { isBarePath, isPublicRequest } from '@/lib/auth-paths'
import { buildCsp } from '@/lib/csp'
import { safeRedirectPath } from '@/lib/redirect'
import { authTimeOf, userFromClaims } from '@/lib/supabase/claims'
import { devAuthBypass, isUuid, LEGACY_USER_ID, supabaseConfig } from '@/lib/supabase/config'
import { CLAIM_TABLES, claimStatements } from '@/server/auth/claim-sql'
import { createScope, jwtClaims } from '@/server/db/scope-core'

const USER = '11111111-2222-4333-8444-555555555555'
const OTHER = '99999999-2222-4333-8444-555555555555'
const dialect = new PgDialect()

describe('supabase config', () => {
  it('needs both the URL and the publishable key', () => {
    expect(supabaseConfig({})).toBeNull()
    expect(supabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co' })).toBeNull()
    expect(supabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co/', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ' sb_publishable_x ' })).toEqual({ url: 'https://abc.supabase.co', publishableKey: 'sb_publishable_x' })
  })

  it('accepts https, or http only on loopback', () => {
    const key = { NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'k' }
    expect(supabaseConfig({ ...key, NEXT_PUBLIC_SUPABASE_URL: 'http://abc.supabase.co' })).toBeNull()
    expect(supabaseConfig({ ...key, NEXT_PUBLIC_SUPABASE_URL: 'javascript:alert(1)' })).toBeNull()
    expect(supabaseConfig({ ...key, NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321' })?.url).toBe('http://127.0.0.1:54321')
  })

  it('dev bypass only in next dev, off Vercel, opted in and without Supabase keys', () => {
    const on = { NODE_ENV: 'development', DEV_AUTH_BYPASS: '1' }
    expect(devAuthBypass(on)).toBe(true)
    expect(devAuthBypass({ ...on, NODE_ENV: 'production' })).toBe(false)
    expect(devAuthBypass({ ...on, VERCEL: '1' })).toBe(false)
    expect(devAuthBypass({ ...on, DEV_AUTH_BYPASS: 'true' })).toBe(false)
    expect(devAuthBypass({ ...on, NEXT_PUBLIC_SUPABASE_URL: 'https://a.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'k' })).toBe(false)
  })

  it('recognizes uuids', () => {
    expect(isUuid(USER)).toBe(true)
    expect(isUuid(LEGACY_USER_ID)).toBe(true)
    for (const bad of ['', 'x', `${USER}x`, "' or 1=1 --", 42, null]) expect(isUuid(bad)).toBe(false)
  })
})

describe('public paths (proxy.ts)', () => {
  it('lets only the landing, auth pages and auth endpoints through without a session', () => {
    for (const p of ['/', '/login', '/signup', '/forgot-password', '/auth/callback', '/auth/confirm', '/auth/oauth', '/manifest.webmanifest']) expect(isPublicRequest('GET', p, false), p).toBe(true)
    for (const p of ['/sitemap.xml', '/robots.txt', '/opengraph-image', '/blog', '/blog/javascript', '/blog/present-perfect', '/blog/present-perfect/opengraph-image', '/blog/present-perfect/cover.webp', '/blog/rss.xml', '/blog/indexnow.txt', '/blog/about', '/auth/google/callback']) expect(isPublicRequest('GET', p, false), p).toBe(true)
    for (const p of ['/blog/', '/blog/a/b/c/d', '/blog/Upper', '/blog/x.svg', '/blog/../feed', '/blogs', '/api/blog']) expect(isPublicRequest('GET', p, false), p).toBe(false)
    for (const p of ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/sign-out']) expect(isPublicRequest('POST', p, false), p).toBe(true)
    for (const p of ['/feed', '/account', '/onboarding', '/reset-password', '/api/export', '/api/counts', '/g/js/x.png', '/login/', '/LOGIN']) expect(isPublicRequest('GET', p, false), p).toBe(false)
    for (const p of ['/auth/reset-password', '/auth/delete-account', '/', '/login']) expect(isPublicRequest('POST', p, false), p).toBe(false)
  })

  it('never treats a server action as public, whatever the path', () => {
    for (const p of ['/', '/login', '/auth/sign-in']) {
      expect(isPublicRequest('POST', p, true)).toBe(false)
      expect(isPublicRequest('GET', p, true)).toBe(false)
    }
  })

  it('exposes Next dev tooling only in dev', () => {
    expect(isPublicRequest('GET', '/_next/webpack-hmr', false, true)).toBe(true)
    expect(isPublicRequest('GET', '/_next/webpack-hmr', false, false)).toBe(false)
  })

  it('renders auth pages and onboarding without the app chrome', () => {
    for (const p of ['/login', '/signup', '/onboarding', '/reset-password', '/auth/callback']) expect(isBarePath(p)).toBe(true)
    for (const p of ['/', '/feed', '/account', '/loginx', '/authors']) expect(isBarePath(p)).toBe(false)
  })

  it('never redirects back into auth pages after sign-in', () => {
    for (const p of ['/login', '/signup', '/forgot-password', '/reset-password', '/auth/confirm?x=1']) expect(safeRedirectPath(p)).toBe('/')
    expect(safeRedirectPath('/account')).toBe('/account')
  })
})

describe('admins', () => {
  it('parses ADMIN_EMAILS case-insensitively', () => {
    expect([...adminEmails(' A@x.com, b@y.org ,,nope ')]).toEqual(['a@x.com', 'b@y.org'])
    expect(isAdminEmail('a@X.com', 'a@x.com')).toBe(true)
    expect(isAdminEmail('c@x.com', 'a@x.com')).toBe(false)
    expect(isAdminEmail(null, 'a@x.com')).toBe(false)
    expect(isAdminEmail('a@x.com', '')).toBe(false)
  })
})

describe('JWT claims → user', () => {
  const base = { iss: 'x', aud: 'authenticated', exp: 2, iat: 1_700_000_000, role: 'authenticated', aal: 'aal1' as const, session_id: 's', sub: USER }

  it('maps a verified user', () => {
    const user = userFromClaims({ ...base, email: 'a@x.com', user_metadata: { full_name: 'Ann', avatar_url: 'https://avatars.githubusercontent.com/u/1' }, amr: [{ method: 'password', timestamp: 1_700_000_500 }] })
    expect(user).toEqual({ id: USER, email: 'a@x.com', name: 'Ann', avatarUrl: 'https://avatars.githubusercontent.com/u/1', aal: 'aal1', authTime: 1_700_000_500_000 })
  })

  it('rejects anonymous, non-authenticated and malformed subjects; drops non-https avatars', () => {
    expect(userFromClaims({ ...base, is_anonymous: true })).toBeNull()
    expect(userFromClaims({ ...base, role: 'anon' })).toBeNull()
    expect(userFromClaims({ ...base, sub: 'not-a-uuid' })).toBeNull()
    expect(userFromClaims({ ...base, user_metadata: { avatar_url: 'javascript:alert(1)' } })?.avatarUrl).toBeNull()
    expect(authTimeOf({ iat: 10 })).toBe(10_000)
  })
})

describe('content security policy with Supabase', () => {
  it('allows the project origin for connect and avatars, nothing for scripts', () => {
    const csp = buildCsp({ nonce: 'n', dev: false, https: true, supabaseUrl: 'https://abc.supabase.co' })
    expect(csp).toMatch(/connect-src 'self' https:\/\/abc\.supabase\.co(;|$)/)
    expect(csp).toContain('img-src')
    expect(csp).toContain('https://avatars.githubusercontent.com')
    expect(csp).not.toMatch(/script-src[^;]*supabase/)
    expect(csp).toContain("form-action 'self'")
  })
})

describe('rate-limit keys', () => {
  it('hash personal identifiers', async () => {
    const key = await hashKey(' Ann@X.com ')
    expect(key).toBe(await hashKey('ann@x.com'))
    expect(key).not.toContain('ann')
    expect(key).toHaveLength(32)
  })
})

describe('legacy claim', () => {
  const perUserTables = (Object.values(schema) as unknown[])
    .filter((t): t is PgTable => is(t, PgTable))
    .map((t) => getTableConfig(t))
    .filter((c) => c.columns.some((col) => col.name === 'user_id'))
    .map((c) => c.name)

  it('covers every per-user table', () => {
    expect(perUserTables.length).toBeGreaterThanOrEqual(14)
    expect(CLAIM_TABLES.map((t) => t.table).sort()).toEqual([...perUserTables].sort())
  })

  it('moves rows from the legacy owner, dropping legacy duplicates of natural keys first', () => {
    const statements = claimStatements(USER).map((s) => dialect.sqlToQuery(s))
    const srs = statements.filter((q) => q.sql.includes('"srs_cards"'))
    expect(srs[0]!.sql).toMatch(/^delete from "srs_cards" where user_id = \$1 and \("unit_id"\) in \(select "unit_id" from "srs_cards" where user_id = \$2\)$/)
    expect(srs[0]!.params).toEqual([LEGACY_USER_ID, USER])
    expect(srs[1]!.sql).toBe('update "srs_cards" set user_id = $1 where user_id = $2')
    expect(srs[1]!.params).toEqual([USER, LEGACY_USER_ID])
    // Surrogate keys: just moved.
    expect(statements.filter((q) => q.sql.includes('"attempts"')).map((q) => q.sql)).toEqual(['update "attempts" set user_id = $1 where user_id = $2'])
  })
})

// ── withUser: per-request RLS scope ─────────────────────────────────────────────────────────────────────────

interface FakeConn {
  name: string
  log: string[]
  execute: (q: unknown) => Promise<unknown[]>
  transaction: <T>(fn: (tx: FakeConn) => Promise<T>) => Promise<T>
}

function fakeDb(): { db: FakeConn; log: string[] } {
  const log: string[] = []
  const make = (name: string, depth: number): FakeConn => ({
    name,
    log,
    async execute(q) {
      const { sql, params } = dialect.sqlToQuery(q as Parameters<PgDialect['sqlToQuery']>[0])
      log.push(`${name}: ${sql} ${JSON.stringify(params)}`)
      return []
    },
    async transaction(fn) {
      log.push(`${name}: begin`)
      const result = await fn(make(`tx${depth + 1}`, depth + 1))
      log.push(`${name}: commit`)
      return result
    },
  })
  return { db: make('db', 0), log }
}

describe('withUser scope', () => {
  it('on Supabase: one transaction, role authenticated + claims, then fn', async () => {
    const { db, log } = fakeDb()
    const { withUser, currentUserId } = createScope({ db: () => db as unknown as Db, rls: async () => true })
    const seen = await withUser({ id: USER }, async (conn) => {
      expect(currentUserId()).toBe(USER)
      return (conn as unknown as FakeConn).name
    })
    expect(seen).toBe('tx1')
    expect(log[0]).toBe('db: begin')
    expect(log[1]).toContain("set_config('request.jwt.claims', $1, true), set_config('role', 'authenticated', true)")
    expect(JSON.parse(JSON.parse(log[1]!.slice(log[1]!.indexOf('['))) [0])).toMatchObject({ sub: USER, role: 'authenticated' })
    expect(log.at(-1)).toBe('db: commit')
    expect(currentUserId()).toBeNull()
  })

  it('is re-entrant: nested scopes reuse the connection; another user is refused', async () => {
    const { db, log } = fakeDb()
    const { withUser } = createScope({ db: () => db as unknown as Db, rls: async () => true })
    await withUser({ id: USER }, async (outer) => {
      const inner = await withUser({ id: USER }, async (conn) => conn)
      expect(inner).toBe(outer)
      await expect(withUser({ id: OTHER }, async () => 1)).rejects.toThrow(/another user/)
    })
    expect(log.filter((l) => l.endsWith('begin'))).toHaveLength(1)
  })

  it('on PGlite: no role switch; a transaction only when asked', async () => {
    const { db, log } = fakeDb()
    const { withUser } = createScope({ db: () => db as unknown as Db, rls: async () => false })
    expect(await withUser({ id: USER }, async (conn) => (conn as unknown as FakeConn).name)).toBe('db')
    expect(log).toEqual([])
    expect(await withUser({ id: USER }, async (conn) => (conn as unknown as FakeConn).name, { tx: true })).toBe('tx1')
    expect(log).toEqual(['db: begin', 'db: commit'])
    // A nested scope asking for atomicity inside a plain one opens its own transaction.
    log.length = 0
    await withUser({ id: USER }, async () => withUser({ id: USER }, async (conn) => (conn as unknown as FakeConn).name, { tx: true }))
    expect(log).toEqual(['db: begin', 'db: commit'])
  })

  it('rejects ids that are not uuids before touching the database', async () => {
    const { db, log } = fakeDb()
    const { withUser } = createScope({ db: () => db as unknown as Db, rls: async () => true })
    await expect(withUser({ id: "x', 'admin" }, async () => 1)).rejects.toThrow(/invalid user id/)
    expect(log).toEqual([])
    expect(JSON.parse(jwtClaims({ id: USER, role: 'admin' }))).toEqual({ sub: USER, role: 'authenticated', aud: 'authenticated', app_role: 'admin' })
  })
})

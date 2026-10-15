import { AsyncLocalStorage } from 'node:async_hooks'
import { sql } from 'drizzle-orm'
import type { Conn, Db, Tx } from '@/db/client'
import { isUuid } from '@/lib/supabase/config'

// Per-user database scope (docs/SECURITY.md §4.2). Framework-free so it can be unit-tested with a fake Db.
//
// * Supabase (auth schema present): every scope is a transaction that switches to the `authenticated` role and sets
//   request.jwt.claims, so RLS policies `user_id = auth.uid()` apply on top of the app's own `where user_id = …`.
// * PGlite / plain Postgres: no auth schema, no roles to switch to — fn just runs (in a transaction if asked).
//
// Scopes are re-entrant: a service called inside another scope reuses its connection/transaction. This matters on
// Vercel (pool max is small): a nested scope must never wait for a second connection while holding the first.

export interface ScopeUser {
  id: string
  role?: string
}

export interface ScopeOptions {
  // Run atomically even where RLS isn't in play (PGlite). RLS scopes are always transactions.
  tx?: boolean
}

interface Scope {
  userId: string
  conn: Conn
  inTx: boolean
}

export interface ScopeDeps {
  db: () => Db
  // true when the database has Supabase's auth schema + `authenticated` role.
  rls: () => Promise<boolean>
}

export function jwtClaims(user: ScopeUser): string {
  return JSON.stringify({ sub: user.id, role: 'authenticated', aud: 'authenticated', app_role: user.role ?? 'user' })
}

export function createScope(deps: ScopeDeps) {
  const storage = new AsyncLocalStorage<Scope>()

  async function enterRls(tx: Tx, user: ScopeUser): Promise<void> {
    // Transaction-local (third arg true): safe on the Supabase transaction pooler.
    await tx.execute(sql`select set_config('request.jwt.claims', ${jwtClaims(user)}, true), set_config('role', 'authenticated', true)`)
  }

  async function withUser<T>(user: ScopeUser, fn: (conn: Conn) => Promise<T>, opts: ScopeOptions = {}): Promise<T> {
    if (!isUuid(user.id)) throw new Error('withUser: invalid user id')
    const current = storage.getStore()
    if (current) {
      if (current.userId !== user.id) throw new Error('withUser: nested scope for another user')
      if (!opts.tx || current.inTx) return fn(current.conn)
      return current.conn.transaction((tx) => storage.run({ ...current, conn: tx, inTx: true }, () => fn(tx)))
    }
    const db = deps.db()
    if (await deps.rls()) {
      return db.transaction(async (tx) => {
        await enterRls(tx, user)
        return storage.run({ userId: user.id, conn: tx, inTx: true }, () => fn(tx))
      })
    }
    if (opts.tx) return db.transaction((tx) => storage.run({ userId: user.id, conn: tx, inTx: true }, () => fn(tx)))
    return storage.run({ userId: user.id, conn: db, inTx: false }, () => fn(db))
  }

  // The user of the innermost active scope (null outside any scope).
  function currentUserId(): string | null {
    return storage.getStore()?.userId ?? null
  }

  return { withUser, currentUserId }
}

export const RLS_PROBE = sql`select (to_regnamespace('auth') is not null and to_regprocedure('auth.uid()') is not null and exists (select 1 from pg_roles where rolname = 'authenticated')) as "on"`

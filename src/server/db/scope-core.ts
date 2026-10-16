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
  // PERF_TRACE: wall time of every top-level scope transaction
  onTx?: (ms: number) => void
}

export function jwtClaims(user: ScopeUser): string {
  return JSON.stringify({ sub: user.id, role: 'authenticated', aud: 'authenticated', app_role: user.role ?? 'user' })
}

export function createScope(deps: ScopeDeps) {
  const storage = new AsyncLocalStorage<Scope>()

  // Transaction-local (third arg true): safe on the Supabase transaction pooler.
  //
  // Queued right here, synchronously, on the transaction's handle (src/db/pipeline.ts): it is guaranteed to run before
  // anything fn sends, without fn waiting for it first (with DATABASE_PIPELINE=pipeline it even shares the first
  // statement's round trip). If it fails, the transaction is aborted, fn's statements fail too and the error surfaces
  // below. Other drivers (tests) fall back to awaiting it first.
  function enterRls(tx: Tx, user: ScopeUser): Promise<unknown> {
    const claims = jwtClaims(user)
    const queued = sendNow(tx, RLS_SETUP_SQL, [claims])
    if (queued) {
      // observed below; until then a rejection must not count as unhandled
      void queued.catch(() => {})
      return queued
    }
    return Promise.resolve(tx.execute(sql`select set_config('request.jwt.claims', ${claims}, true), set_config('role', 'authenticated', true)`))
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
    const started = deps.onTx ? performance.now() : 0
    const timed = <R>(p: Promise<R>): Promise<R> => (deps.onTx ? p.finally(() => deps.onTx?.(performance.now() - started)) : p)
    if (await deps.rls()) {
      return timed(
        db.transaction(async (tx) => {
          const rls = enterRls(tx, user)
          if (!pipelines(tx)) await rls
          const result = await storage.run({ userId: user.id, conn: tx, inTx: true }, () => fn(tx))
          await rls
          return result
        }),
      )
    }
    if (opts.tx) return timed(db.transaction((tx) => storage.run({ userId: user.id, conn: tx, inTx: true }, () => fn(tx))))
    return storage.run({ userId: user.id, conn: db, inTx: false }, () => fn(db))
  }

  // The user of the innermost active scope (null outside any scope).
  function currentUserId(): string | null {
    return storage.getStore()?.userId ?? null
  }

  return { withUser, currentUserId }
}

const RLS_SETUP_SQL = "select set_config('request.jwt.claims', $1, true), set_config('role', 'authenticated', true)"

interface RawQuery extends PromiseLike<unknown> {
  execute(): unknown
  catch(onrejected: (reason: unknown) => unknown): unknown
}
type RawClient = { unsafe(text: string, params: unknown[]): RawQuery }

// drizzle's postgres-js transaction keeps the driver's transaction handle at tx.session.client.
function rawClient(tx: Tx): RawClient | null {
  const client = (tx as unknown as { session?: { client?: Partial<RawClient> } }).session?.client
  return typeof client?.unsafe === 'function' ? (client as RawClient) : null
}

function pipelines(tx: Tx): boolean {
  return rawClient(tx) !== null
}

// Starts a statement now (postgres-js queries are lazy until executed) — it enters the connection's queue before any
// statement issued later.
function sendNow(tx: Tx, text: string, params: unknown[]): Promise<unknown> | null {
  const client = rawClient(tx)
  if (!client) return null
  const query = client.unsafe(text, params)
  if (typeof query.execute !== 'function') return null
  query.execute()
  return Promise.resolve(query)
}

export const RLS_PROBE = sql`select (to_regnamespace('auth') is not null and to_regprocedure('auth.uid()') is not null and exists (select 1 from pg_roles where rolname = 'authenticated')) as "on"`

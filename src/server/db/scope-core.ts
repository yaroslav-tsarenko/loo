import { AsyncLocalStorage } from 'node:async_hooks'
import { sql } from 'drizzle-orm'
import type { Conn, Db, Tx } from '@/db/client'
import { isUuid } from '@/lib/supabase/config'

// Per-user database scope (docs/SECURITY.md §4.2). Framework-free so it can be unit-tested with a fake Db.
//
// * Supabase (auth schema present): every scope is a transaction that switches to the app's `levelup_learner` role (drizzle/0014) and sets
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
  // Serialize with the learner's other locked scopes (implies tx): a transaction-level advisory lock on the user id,
  // taken before anything fn sends. Every scope that moves XP / bucks / gems / hearts or closes a session or test
  // takes it, so «read, check, write» stays correct under a double tap or a retried request (daily caps, «once per
  // session», «first answer counts»). Page renders don't, so they never queue behind an answer.
  lock?: boolean
}

interface Scope {
  userId: string
  conn: Conn
  inTx: boolean
  // this transaction holds the learner's advisory lock (ScopeOptions.lock)
  locked: boolean
}

// Advisory lock key of a learner (namespaced, so other advisory locks can't collide by accident).
export const userLockKey = (userId: string): string => `levelup:user:${userId}`

export interface ScopeDeps {
  db: () => Db
  // true when the database has the app's learner role (drizzle/0014_app_role.sql).
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
  // With `lock`, the advisory lock rides in the same statement (no extra round trip).
  function enterRls(tx: Tx, user: ScopeUser, lock: boolean): Promise<unknown> {
    const claims = jwtClaims(user)
    const queued = lock ? sendNow(tx, RLS_LOCKED_SETUP_SQL, [claims, userLockKey(user.id)]) : sendNow(tx, RLS_SETUP_SQL, [claims])
    if (queued) {
      // observed below; until then a rejection must not count as unhandled
      void queued.catch(() => {})
      return queued
    }
    return Promise.resolve(
      tx.execute(
        lock
          ? sql`select set_config('request.jwt.claims', ${claims}, true), set_config('role', 'levelup_learner', true), pg_advisory_xact_lock(hashtextextended(${userLockKey(user.id)}, 0))`
          : sql`select set_config('request.jwt.claims', ${claims}, true), set_config('role', 'levelup_learner', true)`,
      ),
    )
  }

  async function withUser<T>(user: ScopeUser, fn: (conn: Conn) => Promise<T>, opts: ScopeOptions = {}): Promise<T> {
    if (!isUuid(user.id)) throw new Error('withUser: invalid user id')
    const current = storage.getStore()
    if (current) {
      if (current.userId !== user.id) throw new Error('withUser: nested scope for another user')
      // a nested scope asking for the lock inside an unlocked transaction takes it there (held until that one ends)
      if (opts.lock && current.inTx && !current.locked) {
        await current.conn.execute(sql`select pg_advisory_xact_lock(hashtextextended(${userLockKey(user.id)}, 0))`)
        current.locked = true
      }
      if (!(opts.tx || opts.lock) || current.inTx) return fn(current.conn)
      return current.conn.transaction(async (tx) => {
        if (opts.lock) await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${userLockKey(user.id)}, 0))`)
        return storage.run({ ...current, conn: tx, inTx: true, locked: current.locked || Boolean(opts.lock) }, () => fn(tx))
      })
    }
    const db = deps.db()
    const started = deps.onTx ? performance.now() : 0
    const timed = <R>(p: Promise<R>): Promise<R> => (deps.onTx ? p.finally(() => deps.onTx?.(performance.now() - started)) : p)
    if (await deps.rls()) {
      return timed(
        db.transaction(async (tx) => {
          const rls = enterRls(tx, user, Boolean(opts.lock))
          if (!pipelines(tx)) await rls
          const result = await storage.run({ userId: user.id, conn: tx, inTx: true, locked: Boolean(opts.lock) }, () => fn(tx))
          await rls
          return result
        }),
      )
    }
    if (opts.tx || opts.lock) {
      return timed(
        db.transaction(async (tx) => {
          if (opts.lock) await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${userLockKey(user.id)}, 0))`)
          return storage.run({ userId: user.id, conn: tx, inTx: true, locked: Boolean(opts.lock) }, () => fn(tx))
        }),
      )
    }
    return storage.run({ userId: user.id, conn: db, inTx: false, locked: false }, () => fn(db))
  }

  // The user of the innermost active scope (null outside any scope).
  function currentUserId(): string | null {
    return storage.getStore()?.userId ?? null
  }

  return { withUser, currentUserId }
}

const RLS_SETUP_SQL = "select set_config('request.jwt.claims', $1, true), set_config('role', 'levelup_learner', true)"
const RLS_LOCKED_SETUP_SQL = "select set_config('request.jwt.claims', $1, true), set_config('role', 'levelup_learner', true), pg_advisory_xact_lock(hashtextextended($2, 0))"

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

// The app's learner role and its uid helper exist once drizzle/0014_app_role.sql ran on a database with Supabase's
// auth schema; without them (PGlite, a database not migrated yet) scopes run as the connection role.
export const RLS_PROBE = sql`select (to_regprocedure('public.levelup_uid()') is not null and exists (select 1 from pg_roles where rolname = 'levelup_learner')) as "on"`

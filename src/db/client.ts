import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { pipelined } from './pipeline'
import * as schema from './schema'

export type Db = PostgresJsDatabase<typeof schema>
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0]
export type Conn = Db | Tx

const globalKey = Symbol.for('interview-prep.db')
type GlobalWithDb = typeof globalThis & { [globalKey]?: { db: Db; sql: postgres.Sql } }

export function databaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL не задано. Додай рядок підключення Supabase у .env.local')
  return url
}

// PERF_TRACE (src/server/perf.ts): counts every statement drizzle sends, in the caller's async context.
const hookKey = Symbol.for('levelup.db-query-hook')
type GlobalWithHook = typeof globalThis & { [hookKey]?: () => void }

export function setQueryHook(hook: (() => void) | null): void {
  ;(globalThis as GlobalWithHook)[hookKey] = hook ?? undefined
}

const tracingLogger = {
  logQuery(): void {
    ;(globalThis as GlobalWithHook)[hookKey]?.()
  },
}

export function openDb(url: string): { db: Db; sql: postgres.Sql } {
  // Supabase transaction pooler (port 6543) does not support prepared statements.
  // PGlite (pnpm db:local) multiplexes one connection, so it needs DATABASE_POOL_MAX=1.
  // a few connections per instance so concurrent requests on one Fluid instance don't queue behind each other
  const max = Number(process.env.DATABASE_POOL_MAX) || (process.env.VERCEL ? 3 : 5)
  // max_pipeline 0: never send a statement on a connection that is still busy. postgres-js pipelines up to 100
  // parameterless statements per connection by default, and Supabase's transaction pooler (Supavisor, 6543) drops
  // the replies of pipelined statements — the query hangs forever and its connection is out of step (seen on /admin).
  // (a runtime option of postgres-js — src/index.js «max_pipeline» — missing from its type definitions)
  const options: postgres.Options<Record<string, never>> & { max_pipeline: number } = { prepare: false, max, max_pipeline: 0, idle_timeout: 20, onnotice: () => {} }
  const sql = postgres(url, options)
  // pipelined(): one round trip per statement instead of two on Vercel (./pipeline.ts)
  return { db: drizzle(pipelined(sql), { schema, ...(process.env.PERF_TRACE === '1' ? { logger: tracingLogger } : {}) }), sql }
}

export function getDb(): Db {
  const g = globalThis as GlobalWithDb
  if (!g[globalKey]) g[globalKey] = openDb(databaseUrl())
  return g[globalKey].db
}

export async function first<T>(rows: Promise<T[]>): Promise<T | undefined> {
  return (await rows)[0]
}

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
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

export function openDb(url: string): { db: Db; sql: postgres.Sql } {
  // Supabase transaction pooler (port 6543) does not support prepared statements.
  // PGlite (pnpm db:local) multiplexes one connection, so it needs DATABASE_POOL_MAX=1.
  const max = Number(process.env.DATABASE_POOL_MAX) || (process.env.VERCEL ? 1 : 5)
  const sql = postgres(url, { prepare: false, max, idle_timeout: 20, onnotice: () => {} })
  return { db: drizzle(sql, { schema }), sql }
}

export function getDb(): Db {
  const g = globalThis as GlobalWithDb
  if (!g[globalKey]) g[globalKey] = openDb(databaseUrl())
  return g[globalKey].db
}

export async function first<T>(rows: Promise<T[]>): Promise<T | undefined> {
  return (await rows)[0]
}

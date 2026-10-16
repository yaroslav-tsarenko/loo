import { Column, getTableColumns, is, SQL, sql, Table } from 'drizzle-orm'
import type { Conn } from '@/db/client'

// Several reads in ONE statement — one database round trip instead of one per query (docs/PERFORMANCE.md §DB).
//
// The Supabase transaction pooler doesn't allow pipelining (src/db/pipeline.ts), so Promise.all over one connection
// still costs a round trip per query. readBatch() turns a list of drizzle select queries into a single
//   select (select coalesce(json_agg(t), '[]') from (<query 1>) as t(c0, c1, …)) as r0, (… <query 2> …) as r1, …
// and maps each result back to the query's own field names (positionally, so duplicate SQL column names don't
// matter). Every query runs exactly as written (same WHERE, same RLS); only the transport changes.
//
// Values arrive JSON-decoded: numbers (bigint "ms" columns, counts, sums — callers already Number() them), strings,
// booleans, arrays, jsonb objects. Row order is the subquery's ORDER BY (an aggregate over a sorted subquery keeps its
// order). Plain selects only: no relational queries, no left-join null folding.

// a drizzle select query (its selection, config.fields, is internal API: checked at runtime)
interface BatchQuery<R> extends PromiseLike<R> {
  getSQL(): SQL
}

function selectedFields(q: BatchQuery<unknown>): Record<string, unknown> {
  const fields = (q as unknown as { config?: { fields?: Record<string, unknown> } }).config?.fields
  if (!fields || typeof fields !== 'object') throw new Error('readBatch: only drizzle select queries can be batched')
  return fields
}

type Paths = string[][]

function fieldPaths(fields: Record<string, unknown>, prefix: string[] = []): Paths {
  const out: Paths = []
  for (const [name, field] of Object.entries(fields)) {
    const path = [...prefix, name]
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) out.push(path)
    else if (is(field, Table)) out.push(...fieldPaths(getTableColumns(field), path))
    else if (field && typeof field === 'object') out.push(...fieldPaths(field as Record<string, unknown>, path))
  }
  return out
}

function rebuild(paths: Paths, raw: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  paths.forEach((path, i) => {
    let at = row
    for (const key of path.slice(0, -1)) at = (at[key] ??= {}) as Record<string, unknown>
    at[path.at(-1)!] = raw[`c${i}`] ?? null
  })
  return row
}

type Results<T extends readonly BatchQuery<unknown>[]> = { -readonly [K in keyof T]: Awaited<T[K]> }

export async function readBatch<const T extends readonly BatchQuery<unknown>[]>(conn: Conn, queries: T): Promise<Results<T>> {
  if (queries.length === 0) return [] as unknown as Results<T>
  const shapes = queries.map((q) => fieldPaths(selectedFields(q)))
  const parts = queries.map((q, i) => {
    const cols = sql.raw(shapes[i]!.map((_, j) => `c${j}`).join(', '))
    return sql`(select coalesce(json_agg(t), '[]'::json) from (${q.getSQL()}) as t(${cols})) as ${sql.raw(`r${i}`)}`
  })
  const rows = (await conn.execute(sql`select ${sql.join(parts, sql`, `)}`)) as unknown as Array<Record<string, unknown>>
  const row = rows[0] ?? {}
  return queries.map((_, i) => ((row[`r${i}`] as Array<Record<string, unknown>> | null) ?? []).map((raw) => rebuild(shapes[i]!, raw))) as unknown as Results<T>
}

// A read that can join a batch: the query and what to make of its rows.
export interface Read<T> {
  query: BatchQuery<unknown>
  map: (rows: never[]) => T
}

export function read<Q extends BatchQuery<unknown>, T>(query: Q, map: (rows: Awaited<Q>) => T): Read<T> {
  return { query, map: map as unknown as (rows: never[]) => T }
}

type ReadResults<R extends readonly Read<unknown>[]> = { -readonly [K in keyof R]: R[K] extends Read<infer T> ? T : never }

// Runs the reads in one statement (a single read runs as itself) and maps each result.
export async function readAll<const R extends readonly Read<unknown>[]>(conn: Conn, reads: R): Promise<ReadResults<R>> {
  if (reads.length === 1) return [reads[0]!.map((await reads[0]!.query) as never[])] as unknown as ReadResults<R>
  const rows = await readBatch(
    conn,
    reads.map((r) => r.query),
  )
  return reads.map((r, i) => r.map(rows[i] as never[])) as unknown as ReadResults<R>
}

export async function readOne<T>(conn: Conn, r: Read<T>): Promise<T> {
  return (await readAll(conn, [r] as const))[0]
}

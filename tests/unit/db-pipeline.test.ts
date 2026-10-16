import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { and, desc, eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { boolean, integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import postgres from 'postgres'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Db } from '@/db/client'
import { pipelined, pipelineMode } from '@/db/pipeline'
import { read, readAll, readBatch } from '@/server/db/batch'
import { createScope } from '@/server/db/scope-core'

// src/db/pipeline.ts and src/server/db/batch.ts (docs/PERFORMANCE.md).
//
// Unit part: a fake postgres-js client records what is sent when — in the default (serial) mode a statement only goes
// out after the previous one settled (Supavisor's transaction mode can't take pipelined queries).
// Integration part: a real Postgres engine (PGlite over its socket server): every value type drizzle sends round-trips
// unchanged, batched reads map back exactly, and withUser's RLS setup is in force for the first statement of a scope.
// (PGlite's socket server answers an SQL *error* inside a one-message statement with an extra reply, so error cases are
// not exercised here — they are with real Postgres: scripts/perf-lab.ts --pg.)

interface FakeQuery extends PromiseLike<unknown> {
  text: string
  params: unknown[]
  options: Record<string, unknown> | undefined
  parameters?: unknown[]
  arrayMode: boolean
  values(): FakeQuery
  execute(): FakeQuery
}

function fakeClient() {
  const events: string[] = []
  const settle: Array<() => void> = []
  const client = {
    unsafe(text: string, params: unknown[] = [], options?: Record<string, unknown>): FakeQuery {
      let started: Promise<unknown> | null = null
      const q: FakeQuery = {
        text,
        params,
        options,
        arrayMode: false,
        values() {
          q.arrayMode = true
          return q
        },
        execute() {
          start()
          return q
        },
        then(a, b) {
          return start().then(a, b)
        },
      }
      const start = () =>
        (started ??= new Promise((resolve) => {
          events.push(`send ${text} ${JSON.stringify(q.parameters ?? params, (_, v: unknown) => (typeof v === 'bigint' ? `${v}n` : v))}`)
          settle.push(() => {
            events.push(`done ${text}`)
            resolve([{ text }])
          })
        }))
      return q
    },
  }
  return { client, events, settle }
}

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('pipelined(): one message per statement, one statement in flight', () => {
  it('serial mode sends the next statement only after the previous one settled, in call order', async () => {
    const { client, events, settle } = fakeClient()
    const db = pipelined(client, 'serial')
    const a = db.unsafe('A', ['x', 1, true, null]) as PromiseLike<unknown>
    const b = db.unsafe('B', [2]) as PromiseLike<unknown>
    const both = Promise.all([a, b])
    await flush()
    expect(events).toEqual(['send A ["x",1,"t",null]'])
    settle.shift()!()
    await flush()
    expect(events).toEqual(['send A ["x",1,"t",null]', 'done A', 'send B [2]'])
    settle.shift()!()
    expect(await both).toEqual([[{ text: 'A' }], [{ text: 'B' }]])
  })

  it('values are bound parameters of an argument-less extended query (no describe step); others keep the stock path', async () => {
    const { client, settle } = fakeClient()
    const seen: Array<{ params: unknown[]; options: unknown; parameters?: unknown[] }> = []
    const spy = {
      unsafe(text: string, params?: unknown[], options?: Record<string, unknown>) {
        const q = client.unsafe(text, params, options)
        seen.push(q)
        return q
      },
    }
    const db = pipelined(spy, 'serial')
    const p1 = Promise.resolve(db.unsafe('select $1', ['a']))
    await flush()
    settle.shift()!()
    await p1
    const p2 = Promise.resolve(db.unsafe('select $1', [10n]))
    await flush()
    settle.shift()!()
    await p2
    expect(seen[0]).toMatchObject({ params: [], options: { simple: false }, parameters: ['a'] })
    expect(seen[1]).toMatchObject({ params: [10n], options: undefined })
    expect(seen[1]!.parameters).toBeUndefined()
  })

  it('execute() takes the place in the queue at once (withUser queues its RLS setup before anything else)', async () => {
    const { client, events, settle } = fakeClient()
    const db = pipelined(client, 'serial')
    const later = db.unsafe('second', [1]) as PromiseLike<unknown>
    ;(db.unsafe('first', [1]) as { execute(): unknown }).execute()
    void later.then(() => {})
    await flush()
    expect(events).toEqual(['send first [1]'])
    settle.shift()!()
    await flush()
    settle.shift()!()
    await later
    expect(events.filter((e) => e.startsWith('send'))).toEqual(['send first [1]', 'send second [1]'])
  })

  it('pipeline mode sends at once; off is the stock client; the default is serial on Vercel only', () => {
    const { client, events } = fakeClient()
    const db = pipelined(client, 'pipeline')
    void (db.unsafe('A', [1]) as PromiseLike<unknown>).then(() => {})
    void (db.unsafe('B', [1]) as PromiseLike<unknown>).then(() => {})
    expect(events).toEqual(['send A [1]', 'send B [1]'])
    expect(pipelined(client, 'off')).toBe(client)
    expect(pipelineMode({ VERCEL: '1' })).toBe('off')
    expect(pipelineMode({})).toBe('off')
    expect(pipelineMode({ DATABASE_PIPELINE: 'serial' })).toBe('serial')
    expect(pipelineMode({ VERCEL: '1', DATABASE_PIPELINE: '0' })).toBe('off')
    expect(pipelineMode({ DATABASE_PIPELINE: 'pipeline' })).toBe('pipeline')
  })
})

const USER = '11111111-2222-4333-8444-555555555555'
const OTHER = '99999999-2222-4333-8444-555555555555'
const notes = pgTable('notes', {
  userId: uuid('user_id').notNull(),
  body: text('body').notNull(),
  n: integer('n').notNull(),
  ok: boolean('ok').notNull(),
  tags: text('tags').array().notNull(),
  meta: jsonb('meta').$type<Record<string, unknown>>().notNull(),
})

let pg: PGlite
let server: PGLiteSocketServer
let client: postgres.Sql
let db: Db

beforeAll(async () => {
  pg = await PGlite.create()
  await pg.exec(`
    create role authenticated nologin;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid $$;
    grant usage on schema auth to authenticated;
    create table notes (user_id uuid not null, body text not null, n int not null, ok boolean not null, tags text[] not null, meta jsonb not null);
    alter table notes enable row level security;
    grant select, insert on notes to authenticated;
    create policy own on notes for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
  `)
  const port = 56000 + Math.floor(Math.random() * 900)
  server = new PGLiteSocketServer({ db: pg, port, host: '127.0.0.1', maxConnections: 4 })
  await server.start()
  client = postgres(`postgres://postgres@127.0.0.1:${port}/postgres`, { prepare: false, max: 1, onnotice: () => {} })
  db = drizzle(pipelined(client, 'serial')) as unknown as Db
}, 30_000)

afterAll(async () => {
  await client?.end()
  await server?.stop()
  await pg?.close()
})

describe('against Postgres (PGlite)', () => {
  it('round-trips every value type drizzle sends', async () => {
    const values = { userId: USER, body: `it's "quoted" \\ back\\slash, comma, ${'ї'.repeat(3)} --`, n: 42, ok: true, tags: ['a,b', 'c"d', "e'f", 'g\\h'], meta: { s: 'x"y', n: 1.5, b: false, nil: null, nested: { arr: [1, 'two'] } } }
    await db.insert(notes).values(values)
    const [row] = await db.select().from(notes).where(and(eq(notes.userId, USER), eq(notes.ok, true), eq(notes.n, 42)))
    expect(row).toEqual(values)
    // the server infers parameter types from the statement, exactly as for the describe step
    const [calc] = await db.execute<{ v: number; t: string }>(sql`select (${notes.n} + ${3})::int as v, upper(${'abc'}) as t from ${notes} where ${notes.userId} = ${USER}`)
    expect(calc).toEqual({ v: 45, t: 'ABC' })
    expect((await db.execute<{ b: string }>(sql`select ${10n}::text as b`))[0]?.b).toBe('10')
  })

  it('a value never becomes SQL', async () => {
    expect(await db.select().from(notes).where(eq(notes.body, "x'); drop table notes; --"))).toEqual([])
    expect((await db.select({ n: sql<number>`count(*)::int` }).from(notes))[0]?.n).toBeGreaterThan(0)
  })

  it('concurrent statements on one handle all resolve to their own results', async () => {
    const counts = await Promise.all([1, 2, 3, 4, 5].map((k) => db.select({ k: sql<number>`${k}::int` }).from(notes).limit(1)))
    expect(counts.map((r) => r[0]?.k)).toEqual([1, 2, 3, 4, 5])
    const inTx = await db.transaction((tx) => Promise.all([tx.select({ a: sql<number>`1` }).from(notes).limit(1), tx.select({ b: sql<string>`${'two'}` }).from(notes).limit(1)]))
    expect(inTx).toEqual([[{ a: 1 }], [{ b: 'two' }]])
  })

  it('withUser: the RLS role and claims are in force for the first statement of the scope', async () => {
    const { withUser } = createScope({ db: () => db, rls: async () => true })
    await db.insert(notes).values({ userId: OTHER, body: 'not yours', n: 1, ok: false, tags: [], meta: {} })
    const [first, rows] = await withUser({ id: USER }, (conn) =>
      Promise.all([conn.execute<{ who: string; uid: string }>(sql`select current_user as who, auth.uid()::text as uid`), conn.select({ userId: notes.userId }).from(notes).where(eq(notes.n, 1))]),
    )
    expect(first[0]).toEqual({ who: 'authenticated', uid: USER })
    expect(rows).toEqual([])
    const [after] = await db.execute<{ who: string }>(sql`select current_user as who`)
    expect(after?.who).toBe('postgres')
  })

  it('readBatch: several selects in one statement, each mapped back to its own fields', async () => {
    const plain = db.select().from(notes).where(eq(notes.userId, USER))
    const fields = db.select({ count: sql<number>`count(*)`, other: sql<number>`count(*) filter (where ${notes.ok})`, nested: { body: notes.body } }).from(notes).groupBy(notes.body).orderBy(notes.body)
    const ordered = db.select({ n: notes.n }).from(notes).orderBy(desc(notes.n)).limit(1)
    const empty = db.select({ n: notes.n }).from(notes).where(eq(notes.n, -1))
    const [a, b, c, d] = await readBatch(db, [plain, fields, ordered, empty])
    expect(a).toEqual(await plain)
    // duplicate SQL output names (two counts) are mapped positionally; counts arrive as numbers
    expect(b).toEqual((await fields).map((r) => ({ ...r, count: Number(r.count), other: Number(r.other) })))
    expect(c).toEqual([{ n: 42 }])
    expect(d).toEqual([])
    const [first, total] = await readAll(db, [read(plain, (rows) => rows[0]?.body ?? null), read(db.select({ n: sql<number>`count(*)` }).from(notes), (rows) => Number(rows[0]?.n))])
    expect(first).toContain('quoted')
    expect(total).toBe(2)
  })
})

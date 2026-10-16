import { createHash, generateKeyPairSync, randomUUID, sign } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createServer as createHttpServer } from 'node:http'
import { connect, createServer as createTcpServer, type Socket } from 'node:net'
import path from 'node:path'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import postgres from 'postgres'

// Performance lab (docs/PERFORMANCE.md): a production-like database + auth on this machine, so `next start` can be
// measured signed in, with Supabase-style RLS and a configurable network round trip to the database.
//
//   * Postgres: in-memory PGlite with Supabase's `auth` schema, `authenticated` role and auth.uid() emulated, so the
//     migrations create the real RLS policies and withUser() takes its production path (transaction + set_config).
//   * Data: copied from a local source database (default: pnpm db:local on :54329) — read-only there.
//   * Latency: a TCP proxy in front of PGlite delays every packet by RTT/2 each way (change it live:
//     curl 'http://127.0.0.1:54342/rtt?ms=20'); /stats counts request→response turns = sequential round trips.
//   * Auth: a fake Supabase Auth origin serving an ES256 JWKS; a signed session cookie for the chosen user is written
//     to tmp/perf-lab/cookie.txt. Build the app with NEXT_PUBLIC_SUPABASE_URL pointing here (see the doc).
//
// Usage: pnpm tsx scripts/perf-lab.ts [--source postgres://…] [--user <uuid>] [--rtt 20] [--pg postgres://admin@host:port/postgres]
// Never point --source at a remote database you care about: it is only read, but it is read entirely.

const args = process.argv.slice(2)
const arg = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1]! : fallback
}

const PG_PORT = 54339
const PROXY_PORT = 54340
const AUTH_PORT = 54341
const CONTROL_PORT = 54342
const source = arg('source', 'postgres://postgres@127.0.0.1:54329/postgres')
const outDir = path.resolve('tmp/perf-lab')
mkdirSync(outDir, { recursive: true })

// ── Database ───────────────────────────────────────────────────────────────────────────────────────────────────
// Default: in-memory PGlite. --pg <admin url>: a real Postgres instead (a fresh `levelup_perf` database is created on
// it) — needed to measure the one-message statements (src/db/pipeline.ts), which PGlite's socket server mishandles.
interface LabDb {
  exec(text: string): Promise<void>
  query<T>(text: string, params?: unknown[]): Promise<T[]>
  migrate(): Promise<void>
  serve(): Promise<{ host: string; port: number; close(): Promise<void> }>
}

async function pgliteDb(): Promise<LabDb> {
  const db = await PGlite.create()
  return {
    exec: async (text) => void (await db.exec(text)),
    query: async <T,>(text: string, params: unknown[] = []) => (await db.query<T>(text, params)).rows,
    migrate: () => migrate(drizzle(db), { migrationsFolder: 'drizzle' }),
    async serve() {
      const pg = new PGLiteSocketServer({ db, port: PG_PORT, host: '127.0.0.1', maxConnections: 10 })
      await pg.start()
      return { host: '127.0.0.1', port: PG_PORT, close: async () => (await pg.stop(), await db.close()) }
    },
  }
}

async function realDb(adminUrl: string): Promise<LabDb> {
  const admin = postgres(adminUrl, { max: 1, prepare: false, onnotice: () => {} })
  await admin.unsafe('drop database if exists levelup_perf with (force)')
  await admin.unsafe('create database levelup_perf')
  for (const role of ['anon', 'authenticated']) await admin.unsafe(`do $$ begin create role ${role} nologin; exception when duplicate_object then null; end $$`)
  await admin.end()
  const url = new URL(adminUrl)
  url.pathname = '/levelup_perf'
  const sql = postgres(url.toString(), { max: 1, prepare: false, onnotice: () => {} })
  return {
    exec: async (text) => void (await sql.unsafe(text)),
    query: async <T,>(text: string, params: unknown[] = []) => (await sql.unsafe(text, params as never[])) as unknown as T[],
    migrate: async () => {
      const { drizzle: pgDrizzle } = await import('drizzle-orm/postgres-js')
      const { migrate: pgMigrate } = await import('drizzle-orm/postgres-js/migrator')
      await pgMigrate(pgDrizzle(sql), { migrationsFolder: 'drizzle' })
    },
    serve: async () => ({ host: url.hostname, port: Number(url.port || 5432), close: () => sql.end() }),
  }
}

const pgUrl = arg('pg', '')
const db = pgUrl ? await realDb(pgUrl) : await pgliteDb()
await db.exec(`
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid $$;
  grant usage on schema auth to authenticated;
  grant execute on function auth.uid() to authenticated;
`)
await db.migrate()

const src = postgres(source, { max: 1, prepare: false, onnotice: () => {} })
const tables = (await src`select tablename from pg_tables where schemaname = 'public' and tablename <> '__drizzle_migrations' order by 1`).map((r) => r.tablename as string)
await db.exec(`set session_replication_role = replica`)
let copied = 0
for (const table of tables) {
  const [row] = await src.unsafe(`select coalesce(json_agg(t), '[]')::text as rows from public."${table}" t`)
  const rows = String(row?.rows ?? '[]')
  if (rows === '[]') continue
  await db.query(`insert into public."${table}" select * from json_populate_recordset(null::public."${table}", $1::json)`, [rows])
  copied += (JSON.parse(rows) as unknown[]).length
}
await db.exec(`set session_replication_role = origin`)
const seqs = await db.query<{ seq: string; tbl: string; col: string }>(`
  select s.relname as seq, t.relname as tbl, a.attname as col from pg_class s
  join pg_depend d on d.objid = s.oid join pg_class t on t.oid = d.refobjid
  join pg_attribute a on a.attrelid = t.oid and a.attnum = d.refobjsubid
  where s.relkind = 'S' and t.relnamespace = 'public'::regnamespace`)
for (const { seq, tbl, col } of seqs) await db.query(`select setval('public."${seq}"', greatest(1, coalesce((select max("${col}") from public."${tbl}"), 1)))`)
const profiles = await db.query<{ id: string; n: number }>(`select p.id, (select count(*) from attempts a where a.user_id = p.id)::int as n from profiles p order by n desc`)
await db.query(`insert into auth.users (id) select id from profiles on conflict do nothing`)
await src.end()
const userId = arg('user', profiles[0]?.id ?? randomUUID())
if (!profiles.some((p) => p.id === userId)) await db.query(`insert into auth.users (id) values ($1)`, [userId])
const target = await db.serve()
console.log(`🐘 ${pgUrl ? 'Postgres' : 'PGlite'} (RLS emulated) ${target.host}:${target.port} — ${copied} rows from ${tables.length} tables; user ${userId}`)

// ── Latency proxy ──────────────────────────────────────────────────────────────────────────────────────────────
let oneWay = Number(arg('rtt', '0')) / 2
let turns = 0
let lastFromServer = true
function relay(from: Socket, to: Socket, toServer: boolean): void {
  from.on('data', (chunk) => {
    if (toServer && lastFromServer) turns++
    lastFromServer = !toServer
    if (oneWay <= 0) to.write(chunk)
    else setTimeout(() => to.write(chunk), oneWay)
  })
  from.on('close', () => to.destroy())
  from.on('error', () => to.destroy())
}
createTcpServer((client) => {
  const server = connect(target.port, target.host)
  relay(client, server, true)
  relay(server, client, false)
}).listen(PROXY_PORT, '127.0.0.1')

createHttpServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x')
  if (url.pathname === '/rtt') oneWay = Number(url.searchParams.get('ms') ?? 0) / 2
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ rttMs: oneWay * 2, turns }))
}).listen(CONTROL_PORT, '127.0.0.1')

// ── Fake Supabase Auth (JWKS + a signed session cookie) ────────────────────────────────────────────────────────
const authUrl = `http://127.0.0.1:${AUTH_PORT}`
const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })
const kid = createHash('sha1').update(publicKey.export({ format: 'der', type: 'spki' })).digest('hex').slice(0, 16)
const jwks = { keys: [{ ...publicKey.export({ format: 'jwk' }), kid, alg: 'ES256', use: 'sig', key_ops: ['verify'] }] }
let jwksHits = 0
createHttpServer((req, res) => {
  if (req.url?.startsWith('/auth/v1/.well-known/jwks.json')) {
    jwksHits++
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(jwks))
    return
  }
  if (req.url === '/hits') return void res.end(JSON.stringify({ jwks: jwksHits }))
  res.statusCode = 404
  res.end('{}')
}).listen(AUTH_PORT, '127.0.0.1')

const b64url = (data: Buffer | string) => Buffer.from(data).toString('base64url')
const now = Math.floor(Date.now() / 1000)
const exp = now + 7 * 86_400
const claims = {
  iss: `${authUrl}/auth/v1`,
  sub: userId,
  aud: 'authenticated',
  role: 'authenticated',
  exp,
  iat: now,
  email: 'perf-lab@localhost',
  aal: 'aal1',
  amr: [{ method: 'password', timestamp: now }],
  session_id: randomUUID(),
  is_anonymous: false,
  app_metadata: { provider: 'email' },
  user_metadata: {},
}
const signingInput = `${b64url(JSON.stringify({ alg: 'ES256', kid, typ: 'JWT' }))}.${b64url(JSON.stringify(claims))}`
const jwt = `${signingInput}.${b64url(sign('sha256', Buffer.from(signingInput), { key: privateKey, dsaEncoding: 'ieee-p1363' }))}`
const session = {
  access_token: jwt,
  token_type: 'bearer',
  expires_in: exp - now,
  expires_at: exp,
  refresh_token: 'perf-lab',
  user: { id: userId, aud: 'authenticated', role: 'authenticated', email: claims.email, app_metadata: claims.app_metadata, user_metadata: {}, created_at: new Date().toISOString() },
}
const cookie = `sb-127-auth-token=base64-${b64url(JSON.stringify(session))}`
writeFileSync(path.join(outDir, 'cookie.txt'), cookie)
writeFileSync(
  path.join(outDir, 'env.sh'),
  [
    `export NEXT_PUBLIC_SUPABASE_URL=${authUrl}`,
    `export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=perf-lab`,
    `export DATABASE_URL=postgres://postgres@127.0.0.1:${PROXY_PORT}/${pgUrl ? 'levelup_perf' : 'postgres'}`,
    `export DATABASE_POOL_MAX=1`,
    `export VERCEL=1 VAULT_PATH=content CONTENT_WATCH=0 PERF_TRACE=1`,
    // PGlite's socket server can't take one-message statements (src/db/pipeline.ts): stock driver there
    ...(pgUrl ? [] : ['export DATABASE_PIPELINE=0']),
    '',
  ].join('\n'),
)
console.log(`🔐 auth ${authUrl} (kid ${kid}); cookie → tmp/perf-lab/cookie.txt; env → tmp/perf-lab/env.sh`)
console.log(`🐢 latency proxy :${PROXY_PORT} (rtt ${oneWay * 2}ms); control http://127.0.0.1:${CONTROL_PORT}/rtt?ms=N`)

const stop = async () => {
  await target.close()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)

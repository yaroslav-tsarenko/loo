import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'

// A Supabase-like Postgres for integration tests: PGlite with the `auth` schema, the `anon` / `authenticated` roles
// and auth.uid() emulated, all real migrations (drizzle/*.sql — so the RLS policies and the app role
// levelup_learner exist), served over a socket so the app's own postgres-js client talks to it as in production.

export interface TestDb {
  pg: PGlite
  url: string
  close(): Promise<void>
  addUser(id: string): Promise<void>
}

export async function startTestDb(port: number): Promise<TestDb> {
  const pg = await PGlite.create()
  await pg.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
  `)
  await migrate(drizzle(pg), { migrationsFolder: 'drizzle' })
  const server = new PGLiteSocketServer({ db: pg, port, host: '127.0.0.1', maxConnections: 10 })
  await server.start()
  return {
    pg,
    url: `postgres://postgres@127.0.0.1:${port}/postgres`,
    async addUser(id) {
      await pg.query('insert into auth.users (id) values ($1) on conflict do nothing', [id])
    },
    async close() {
      await server.stop()
      await pg.close()
    },
  }
}

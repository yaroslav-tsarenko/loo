import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// The real migrations (drizzle/*.sql) on a Supabase-like database (auth schema, `anon` / `authenticated` roles):
// learner requests run as the app's own role `levelup_learner`; the Data API roles can't touch public tables
// (drizzle/0014_app_role.sql). PGlite is single-user, so roles are switched with SET ROLE inside transactions.

const A = '11111111-1111-4111-8111-111111111111'
const B = '22222222-2222-4222-8222-222222222222'

let pg: PGlite

beforeAll(async () => {
  pg = await PGlite.create()
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
  await pg.exec(`
    insert into auth.users values ('${A}'), ('${B}');
    insert into profiles (id, created_at, updated_at) values ('${A}', 0, 0), ('${B}', 0, 0);
    insert into xp_ledger (user_id, amount, reason, ref_id, created_at, day) values ('${A}', 10, 'quiz', 'u1', 0, '2026-01-01'), ('${B}', 20, 'quiz', 'u1', 0, '2026-01-01');
  `)
}, 60_000)

afterAll(async () => {
  await pg?.close()
})

// Runs statements as `role` with the claims of `user`, rolled back afterwards.
async function as<T>(role: string, user: string, fn: (q: (text: string) => Promise<T[]>) => Promise<unknown>): Promise<unknown> {
  return pg.transaction(async (tx) => {
    await tx.query(`select set_config('request.jwt.claims', $1, true), set_config('role', $2, true)`, [JSON.stringify({ sub: user, role: 'authenticated' }), role])
    try {
      return await fn(async (text) => (await tx.query<T>(text)).rows)
    } finally {
      await tx.rollback()
    }
  })
}

async function fails(role: string, user: string, text: string): Promise<string | null> {
  try {
    await as(role, user, (q) => q(text))
    return null
  } catch (error) {
    return (error as Error).message
  }
}

describe('database roles (0014_app_role)', () => {
  it('creates the app role and the uid helper the app probes for', async () => {
    const probe = await pg.query<{ on: boolean }>(`select (to_regprocedure('public.levelup_uid()') is not null and exists (select 1 from pg_roles where rolname = 'levelup_learner')) as "on"`)
    expect(probe.rows[0]?.on).toBe(true)
  })

  it('the learner role sees and writes only its own rows', async () => {
    const rows = (await as('levelup_learner', A, (q) => q(`select user_id, amount from xp_ledger order by amount`))) as Array<{ user_id: string }>
    expect(rows.map((r) => r.user_id)).toEqual([A])
    expect(await fails('levelup_learner', A, `insert into xp_ledger (user_id, amount, reason, ref_id, created_at, day) values ('${A}', 5, 'quiz', 'u2', 1, '2026-01-01')`)).toBeNull()
    expect(await fails('levelup_learner', A, `insert into xp_ledger (user_id, amount, reason, ref_id, created_at, day) values ('${B}', 5, 'quiz', 'u2', 1, '2026-01-01')`)).toMatch(/row-level security/)
    // the profile: only the learner-editable columns
    expect(await fails('levelup_learner', A, `update profiles set display_name = 'x' where id = '${A}'`)).toBeNull()
    expect(await fails('levelup_learner', A, `update profiles set role = 'admin' where id = '${A}'`)).toMatch(/permission denied/)
  })

  it('keeps the append-only ledgers append-only', async () => {
    expect(await fails('levelup_learner', A, `insert into gem_ledger (user_id, amount, reason, ref_id, created_at, day) values ('${A}', 5, 'x', 'r', 1, '2026-01-01')`)).toBeNull()
    expect(await fails('levelup_learner', A, `update gem_ledger set amount = 1000`)).toMatch(/permission denied/)
    expect(await fails('levelup_learner', A, `delete from buck_ledger`)).toMatch(/permission denied/)
  })

  it('the Data API roles (anon, authenticated) have no access to public tables', async () => {
    for (const role of ['authenticated', 'anon']) {
      for (const text of [
        `select * from xp_ledger`,
        `insert into gem_ledger (user_id, amount, reason, ref_id, created_at, day) values ('${A}', 1000, 'x', 'r', 1, '2026-01-01')`,
        `update user_state set hearts = 5`,
        `select * from profiles`,
        `select * from league_members`,
      ]) {
        expect(await fails(role, A, text), `${role}: ${text}`).toMatch(/permission denied/)
      }
    }
    const grants = await pg.query<{ n: number }>(`select count(*)::int as n from information_schema.role_table_grants where table_schema = 'public' and grantee in ('anon', 'authenticated')`)
    expect(grants.rows[0]?.n).toBe(0)
  })

  it('moved every policy to the app role', async () => {
    const left = await pg.query<{ n: number }>(`select count(*)::int as n from pg_policies where schemaname = 'public' and 'authenticated' = any (roles)`)
    expect(left.rows[0]?.n).toBe(0)
    const moved = await pg.query<{ n: number }>(`select count(*)::int as n from pg_policies where schemaname = 'public' and 'levelup_learner' = any (roles)`)
    expect(moved.rows[0]?.n).toBeGreaterThan(20)
  })

  it('the per-learner advisory lock statement runs as the learner role', async () => {
    expect(
      await fails(
        'levelup_learner',
        A,
        `select set_config('request.jwt.claims', '{}', true), set_config('role', 'levelup_learner', true), pg_advisory_xact_lock(hashtextextended('levelup:user:${A}', 0))`,
      ),
    ).toBeNull()
  })
})

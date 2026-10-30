import path from 'node:path'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// drizzle/0014_profile_locale_nullable.sql on a real Postgres engine (PGlite, in memory): every migration applies in
// order, profiles.locale becomes nullable without a default, and the old implicit 'uk' becomes «not chosen».

let db: PGlite

beforeAll(async () => {
  db = await PGlite.create()
}, 60_000)

afterAll(async () => {
  await db.close()
})

describe('migration 0014: nullable profiles.locale', () => {
  it('applies all migrations; locale is nullable, no default; stored uk → null; en stays', { timeout: 60_000 }, async () => {
    const orm = drizzle(db)
    const folder = path.resolve(__dirname, '../../drizzle')
    await migrate(orm, { migrationsFolder: folder })
    const col = await db.query<{ is_nullable: string; column_default: string | null }>(
      "select is_nullable, column_default from information_schema.columns where table_name = 'profiles' and column_name = 'locale'",
    )
    expect(col.rows[0]).toEqual({ is_nullable: 'YES', column_default: null })
    const now = Date.now()
    await db.query("insert into profiles (id, created_at, updated_at) values ('00000000-0000-0000-0000-000000000001', $1, $1)", [now])
    await db.query("insert into profiles (id, locale, created_at, updated_at) values ('00000000-0000-0000-0000-000000000002', 'en', $1, $1)", [now])
    const rows = await db.query<{ locale: string | null }>('select locale from profiles order by id')
    expect(rows.rows.map((r) => r.locale)).toEqual([null, 'en'])
  })

  it('the data step turns the old implicit uk into null', async () => {
    await db.query("update profiles set locale = 'uk' where locale is null")
    const sql = (await import('node:fs')).readFileSync(path.resolve(__dirname, '../../drizzle/0014_profile_locale_nullable.sql'), 'utf8')
    const update = sql.split('--> statement-breakpoint').map((s) => s.trim()).find((s) => /UPDATE/i.test(s))!
    await db.exec(update)
    const rows = await db.query<{ locale: string | null }>('select locale from profiles order by id')
    expect(rows.rows.map((r) => r.locale)).toEqual([null, 'en'])
  })
})

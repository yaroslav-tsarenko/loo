import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

// Applies ./drizzle migrations. Prefers DIRECT_URL (session connection) over the pooled DATABASE_URL.
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL
if (!url) {
  // `--if-configured` lets the Vercel build continue before the database env vars are set.
  if (process.argv.includes('--if-configured')) {
    console.warn('⚠️  DIRECT_URL / DATABASE_URL не задано — міграції пропущено')
    process.exit(0)
  }
  throw new Error('DATABASE_URL / DIRECT_URL не задано')
}
// Guard: a remote database (e.g. Supabase prod) is only migrated on purpose — on Vercel builds or with --prod.
// Local dev may point .env.local at prod, and a plain `pnpm db:migrate` must never touch it by accident.
const host = new URL(url).hostname
const local = host === 'localhost' || host === '127.0.0.1' || host === '::1'
if (!local && !process.env.VERCEL && !process.argv.includes('--prod')) {
  console.error(`⛔ ${host} — віддалена база. Міграції на неї тільки свідомо: pnpm db:migrate --prod`)
  process.exit(1)
}
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} })
await migrate(drizzle(sql), { migrationsFolder: 'drizzle' })
const tables = await sql`select tablename from pg_tables where schemaname = 'public' order by 1`
console.log(`✅ Міграції застосовано. Таблиці: ${tables.map((t) => t.tablename).join(', ')}`)
await sql.end()

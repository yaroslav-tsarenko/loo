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
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} })
await migrate(drizzle(sql), { migrationsFolder: 'drizzle' })
const tables = await sql`select tablename from pg_tables where schemaname = 'public' order by 1`
console.log(`✅ Міграції застосовано. Таблиці: ${tables.map((t) => t.tablename).join(', ')}`)
await sql.end()

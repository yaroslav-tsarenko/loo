import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { migrationPlan } from './migrate-plan'

// Applies ./drizzle migrations. Prefers DIRECT_URL (session connection) over the pooled DATABASE_URL — the advisory
// lock below is session-level, so it needs a real session (the transaction pooler would hand it to someone else).
const plan = migrationPlan(process.env, process.argv)
if (!plan.run) {
  if (plan.fail) {
    console.error(`⛔ ${plan.reason}`)
    process.exit(1)
  }
  console.warn(`⚠️  ${plan.reason}`)
  process.exit(0)
}
console.log(`🗄️  Міграції: ${plan.reason}`)

// Two builds at once (a redeploy while the previous build is still running) must not migrate concurrently: the
// second one waits for the first and then finds nothing left to do.
const LOCK = 'select pg_try_advisory_lock(hashtextextended(\'levelup:migrations\', 0)) as ok'
const WAIT_MS = 10 * 60_000

const sql = postgres((process.env.DIRECT_URL ?? process.env.DATABASE_URL)!, { max: 1, prepare: false, onnotice: () => {} })
try {
  const started = Date.now()
  for (;;) {
    const [row] = await sql.unsafe<Array<{ ok: boolean }>>(LOCK)
    if (row?.ok) break
    if (Date.now() - started > WAIT_MS) throw new Error('міграції: інша збірка тримає блокування понад 10 хв')
    console.log('⏳ інша збірка застосовує міграції — чекаю…')
    await new Promise((r) => setTimeout(r, 3000))
  }
  await migrate(drizzle(sql), { migrationsFolder: 'drizzle' })
  const tables = await sql`select tablename from pg_tables where schemaname = 'public' order by 1`
  console.log(`✅ Міграції застосовано. Таблиці: ${tables.map((t) => t.tablename).join(', ')}`)
} finally {
  // the lock is released with the session, explicitly too for clarity
  await sql.unsafe(`select pg_advisory_unlock(hashtextextended('levelup:migrations', 0))`).catch(() => {})
  await sql.end()
}

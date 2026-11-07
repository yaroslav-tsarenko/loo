// When `scripts/migrate.ts` may touch a database. Pure, so the rules are unit-tested (tests/unit/migrate-plan.test.ts).
//
// - Vercel production builds migrate (vercel-build runs the migrations before `next build`).
// - Vercel preview / development builds don't: Preview may share env vars with production, and a branch build must
//   never change the production schema. A preview with its own database opts in with MIGRATE_ON_PREVIEW=1.
// - Elsewhere a remote database is only migrated on purpose (`--prod`); local databases always.

export type MigrationPlan = { run: true; reason: string } | { run: false; reason: string; fail: boolean }

export function migrationPlan(env: Record<string, string | undefined>, argv: readonly string[]): MigrationPlan {
  const url = env.DIRECT_URL ?? env.DATABASE_URL
  if (!url) {
    // `--if-configured` lets the Vercel build continue before the database env vars are set.
    if (argv.includes('--if-configured')) return { run: false, reason: 'DIRECT_URL / DATABASE_URL не задано — міграції пропущено', fail: false }
    return { run: false, reason: 'DATABASE_URL / DIRECT_URL не задано', fail: true }
  }
  const host = new URL(url).hostname
  const local = host === 'localhost' || host === '127.0.0.1' || host === '::1'
  if (env.VERCEL) {
    if (env.VERCEL_ENV === 'production') return { run: true, reason: `Vercel production → ${host}` }
    if (env.MIGRATE_ON_PREVIEW === '1') return { run: true, reason: `Vercel ${env.VERCEL_ENV ?? '?'} з MIGRATE_ON_PREVIEW=1 → ${host}` }
    return { run: false, reason: `Vercel ${env.VERCEL_ENV ?? '?'}: міграції лише в production-збірці (окрема база для preview — MIGRATE_ON_PREVIEW=1)`, fail: false }
  }
  if (local) return { run: true, reason: `локальна база ${host}` }
  if (argv.includes('--prod')) return { run: true, reason: `--prod → ${host}` }
  return { run: false, reason: `${host} — віддалена база. Міграції на неї тільки свідомо: pnpm db:migrate --prod`, fail: true }
}

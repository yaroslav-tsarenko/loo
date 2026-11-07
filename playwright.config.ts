import { defineConfig, devices } from '@playwright/test'

// End-to-end on this machine only — never a real database or a real Supabase project:
//   1. scripts/perf-lab.ts --source none: an empty in-memory Postgres (PGlite) with Supabase's auth schema and the real
//      migrations, a fake Supabase Auth (JWKS) and a signed session cookie for a fresh learner → tmp/e2e/
//   2. a production build wired to it (tmp/e2e/env.sh), started on :3210.
// The tests sign in by setting that cookie (tests/e2e/fixtures.ts). Runs in the installed Google Chrome
// (no browser download): `pnpm e2e`.

const port = 3210
const LAB = 54440

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: [
    {
      command: `rm -rf tmp/e2e && tsx scripts/perf-lab.ts --source none --ports ${LAB} --out tmp/e2e`,
      url: `http://127.0.0.1:${LAB + 3}/rtt?ms=0`,
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      // the lab's env.sh: DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL (baked into the build) — never .env.local's
      command: `bash -c 'until [ -f tmp/e2e/env.sh ]; do sleep 1; done; set -a; . tmp/e2e/env.sh; unset VERCEL PERF_TRACE; next build && next start --hostname 127.0.0.1 --port ${port}'`,
      url: `http://127.0.0.1:${port}/welcome`,
      timeout: 400_000,
      reuseExistingServer: false,
      env: { NEXT_TELEMETRY_DISABLED: '1', TZ: 'UTC' },
    },
  ],
})

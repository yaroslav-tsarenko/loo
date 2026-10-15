import { defineConfig, devices } from '@playwright/test'

const port = 3210

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `node -e "require('fs').rmSync('.data/e2e',{recursive:true,force:true})" && next build && next start --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    timeout: 240_000,
    reuseExistingServer: false,
    env: {
      VAULT_PATH: 'tests/fixtures/vault',
      STUDY_DB_PATH: '.data/e2e/study.db',
      CONTENT_WATCH: '0',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
})

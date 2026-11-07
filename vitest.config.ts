import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    environment: 'node',
    // study days are Europe/Kyiv explicitly (src/progress/day.ts): tests must not depend on the machine's zone
    env: { TZ: 'UTC' },
  },
})

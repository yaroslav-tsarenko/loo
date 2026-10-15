import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const layer = (from, forbidden, message) => ({
  files: [`src/${from}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': ['error', { patterns: forbidden.map((group) => ({ group: [`@/${group}/*`, `@/${group}`], message })) }],
  },
})

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/**', 'node_modules/**', 'drizzle/**', 'test-results/**', 'playwright-report/**', 'next-env.d.ts', '.dev/**'] },
  layer('progress', ['content/store', 'db', 'server', 'ui', 'app'], 'progress/ — чиста логіка без I/O і UI'),
  layer('content', ['db', 'server', 'ui', 'app', 'progress'], 'content/ не знає про БД, прогрес і UI'),
  layer('db', ['content', 'server', 'ui', 'app', 'progress'], 'db/ не знає про markdown і UI'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]

export default config

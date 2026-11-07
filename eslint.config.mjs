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
  { ignores: ['.next/**', 'node_modules/**', 'drizzle/**', 'test-results/**', 'playwright-report/**', 'next-env.d.ts', '.dev/**', '.lu-preview/**'] },
  layer('progress', ['content/store', 'db', 'server', 'ui', 'app'], 'progress/ — чиста логіка без I/O і UI'),
  layer('db', ['content', 'server', 'ui', 'app', 'progress'], 'db/ не знає про markdown і UI'),
  layer('i18n', ['ui', 'server', 'db', 'app'], 'i18n/ — лише тексти: без UI, сервера й БД'),
  // content/ is pure (parsing, models, grading — some of it runs in the browser); the file system lives in the
  // store, the config and the vault source only
  {
    files: ['src/content/**/*.{ts,tsx}'],
    ignores: ['src/content/store.ts', 'src/content/config.ts', 'src/content/sources/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/db/*', '@/db', '@/server/*', '@/ui/*', '@/app/*', '@/progress/*'], message: 'content/ не знає про БД, прогрес і UI' },
            { group: ['node:fs', 'node:fs/*', 'node:path', 'node:os', 'node:v8', 'node:zlib', 'fs', 'path', 'chokidar'], message: 'content/ — чиста логіка; файли читають лише store.ts, config.ts і sources/' },
          ],
        },
      ],
    },
  },
  {
    files: ['src/course/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/db/*', '@/db', '@/server/*', '@/ui/*', '@/app/*', '@/progress/*', '@/content/store', '@/content/sources/*'], message: 'course/ — чисте доменне ядро без I/O, БД і UI' },
            { group: ['react', 'react/*', 'react-dom', 'next', 'next/*', 'node:*'], message: 'course/ — без React, Next і Node API' },
          ],
        },
      ],
    },
  },
  {
    files: ['src/game/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/db/*', '@/db', '@/server/*', '@/ui/*', '@/app/*', '@/content/*', '@/course/*', '@/course', '@/i18n/*', '@/i18n'], message: 'game/ — чисті ігрові правила без I/O, БД, UI і тексту (дозволено лише @/progress/*)' },
            { group: ['react', 'react/*', 'react-dom', 'next', 'next/*', 'node:*'], message: 'game/ — без React, Next і Node API' },
          ],
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]

export default config

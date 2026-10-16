import type { HttpHeader, HttpMsg } from '../cors/http'
import type { Frame, StepScenario } from '../engine/types'
import type { CacheEntry, Decision } from './cache'

export interface CacheFrame extends Frame {
  // demo clock, seconds
  t: number
  entry: CacheEntry | null
  // ETag of the version the server has now
  server: string
  // cache lookup result at time t (only on lookup steps)
  decision?: Decision
  // message travelling page <-> cache or cache <-> server
  hop: 'page' | 'server' | null
  msg: HttpMsg | null
  output: string[]
}

const h = (name: string, value: string, tone?: HttpHeader['tone']): HttpHeader => (tone ? { name, value, tone } : { name, value })
const V1 = '"v1"'
const V2 = '"v2"'

const get = (id: string, extra: HttpHeader[] = []): HttpMsg => ({ id, dir: 'req', line: 'GET /app.js', headers: [h('Accept', '*/*', 'muted'), ...extra] })
const ok = (id: string, etag: string, tone: HttpHeader['tone'], tag?: string): HttpMsg => ({
  id,
  dir: 'res',
  line: '200 OK',
  headers: [h('Cache-Control', 'max-age=60', tone), h('ETag', etag, tone)],
  body: `/* app.js ${etag.replaceAll('"', '')} · 120 КБ */`,
  ...(tag ? { tag } : {}),
})

const e1: CacheEntry = { etag: V1, storedAt: 0, maxAge: 60 }
const e1r: CacheEntry = { etag: V1, storedAt: 90, maxAge: 60 }
const e2: CacheEntry = { etag: V2, storedAt: 200, maxAge: 60 }

const o1 = 't=0 → 200 · мережа · v1'
const o2 = 't=30 → 200 · кеш · v1'
const o3 = 't=90 → 200 · кеш після 304 · v1'
const o4 = 't=200 → 200 · мережа · v2'

const code = `// сервер віддає /app.js із заголовками:
//   Cache-Control: max-age=60
//   ETag: "v1"

await fetch('/app.js') // t = 0 с
await fetch('/app.js') // t = 30 с
await fetch('/app.js') // t = 90 с
// деплой: на сервері тепер "v2"
await fetch('/app.js') // t = 200 с

// Cache-Control: no-cache → зберігати, але щоразу перевіряти
// Cache-Control: no-store → не зберігати взагалі
// Last-Modified / If-Modified-Since — перевірка за датою`

const revalidation: StepScenario<CacheFrame> = {
  code,
  frames: [
    { line: 5, t: 0, entry: null, server: V1, decision: 'miss', hop: 'page', msg: get('q1'), output: [], note: 'fetch спершу заглядає в HTTP-кеш браузера. Запису для /app.js немає — це miss.' },
    { line: 5, t: 0, entry: null, server: V1, hop: 'server', msg: get('q1'), output: [], note: 'Запит іде на сервер звичайним GET, без умовних заголовків: валідатора в нас поки немає.' },
    { line: 2, t: 0, entry: e1, server: V1, hop: 'server', msg: ok('r1', V1, 'new'), output: [], note: '200 OK із Cache-Control: max-age=60 і ETag: "v1". Браузер кладе відповідь у кеш: наступні 60 секунд вона свіжа (fresh).' },
    { line: 5, t: 0, entry: e1, server: V1, hop: 'page', msg: ok('r1', V1, 'muted'), output: [o1], note: 'Сторінка отримує відповідь, а в кеші лишається копія разом із заголовками і валідатором ETag.' },
    { line: 6, t: 30, entry: e1, server: V1, decision: 'fresh', hop: 'page', msg: ok('c2', V1, 'muted', 'з кешу'), output: [o1, o2], note: 't = 30 с: вік 30 < 60, запис свіжий. Відповідь іде з кешу без жодного запиту в мережу — у DevTools це «(disk cache)» або «(memory cache)».' },
    { line: 7, t: 90, entry: e1, server: V1, decision: 'stale', hop: null, msg: null, output: [o1, o2], note: 't = 90 с: вік 90 ≥ 60 — запис застарів (stale). Його не видалено: є ETag, тож можна спитати сервер, чи щось змінилося.' },
    { line: 7, t: 90, entry: e1, server: V1, hop: 'server', msg: get('q3', [h('If-None-Match', V1, 'new')]), output: [o1, o2], note: 'Умовний запит: If-None-Match: "v1" означає «надішли тіло, лише якщо ETag уже інший». Цей заголовок додає сам браузер.' },
    { line: 7, t: 90, entry: e1, server: V1, hop: 'server', msg: { id: 'r3', dir: 'res', line: '304 Not Modified', headers: [h('Cache-Control', 'max-age=60', 'muted'), h('ETag', V1, 'ok')] }, output: [o1, o2], note: 'Ресурс не змінився — сервер відповідає 304 Not Modified без тіла. Мережею пройшли лише заголовки, а не 120 КБ.' },
    { line: 7, t: 90, entry: e1r, server: V1, hop: 'page', msg: ok('c3', V1, 'muted', 'з кешу, оновлено'), output: [o1, o2, o3], note: 'Кеш оновлює запис заголовками з 304, вік знову 0 — свіжий до t = 150 с. JS бачить звичайну 200 з тілом із кешу, а не 304.' },
    { line: 8, t: 120, entry: e1r, server: V2, decision: 'fresh', hop: null, msg: null, output: [o1, o2, o3], note: 'Деплой у t = 120 с: на сервері версія з ETag "v2". Але запис ще свіжий, і до t = 150 с браузер віддавав би стару v1 — тому статику версіонують хешем в імені файлу.' },
    { line: 9, t: 200, entry: e1r, server: V2, decision: 'stale', hop: 'server', msg: get('q4', [h('If-None-Match', V1, 'new')]), output: [o1, o2, o3], note: 't = 200 с: вік 110 с — stale. Знову умовний запит з If-None-Match: "v1".' },
    { line: 9, t: 200, entry: e2, server: V2, hop: 'server', msg: ok('r4', V2, 'new'), output: [o1, o2, o3, o4], note: 'ETag не збігся — сервер шле повну відповідь 200 з новим тілом і ETag: "v2". Кеш замінює запис, і він свіжий наступні 60 с.' },
    { line: 11, t: 201, entry: { ...e2, noCache: true }, server: V2, decision: 'stale', hop: null, msg: null, output: [o1, o2, o3, o4], note: 'no-cache не означає «не кешувати»: відповідь зберігається, але перед кожним використанням ревалідується — 304 або нова 200.' },
    { line: 12, t: 201, entry: null, server: V2, decision: 'miss', hop: null, msg: null, output: [o1, o2, o3, o4], note: 'no-store забороняє зберігати відповідь узагалі: кожен запит іде на сервер по повне тіло. Це для чутливих даних.' },
    { line: 13, t: 201, entry: e2, server: V2, hop: 'server', msg: get('q5', [h('If-Modified-Since', 'Thu, 15 Oct 2026 09:00:00 GMT', 'new')]), output: [o1, o2, o3, o4], note: 'Другий валідатор — дата: Last-Modified у відповіді, If-Modified-Since у запиті, далі так само 304 або 200. ETag точніший: дата має точність до секунди.' },
  ],
}

export const httpCacheScenarios: Record<string, StepScenario<CacheFrame>> = {
  revalidation,
}

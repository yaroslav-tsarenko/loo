import type { Frame, StepScenario } from '../engine/types'
import type { CorsRequest, HttpHeader, HttpMsg } from './http'

export interface CorsVerdict {
  ok: boolean
  text: string
  // checks the preflight response (method + headers), not the actual one
  preflight?: boolean
}

export interface CorsFrame extends Frame {
  // sequence diagram, top → bottom
  msgs: HttpMsg[]
  active: string | null
  verdict: CorsVerdict | null
  output: string[]
  error?: string | null
}

export const ORIGIN = 'https://app.example'
export const SIMPLE_REQ: CorsRequest = { method: 'GET', headers: {} }
export const PREFLIGHT_REQ: CorsRequest = { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Token': 'abc123' }, credentials: true }

const h = (name: string, value: string, tone?: HttpHeader['tone']): HttpHeader => (tone ? { name, value, tone } : { name, value })
const msg = (id: string, dir: HttpMsg['dir'], line: string, headers: HttpHeader[], extra: Partial<HttpMsg> = {}): HttpMsg => ({ id, dir, line, headers, ...extra })

// ── simple ───────────────────────────────────────────────────────
const getReq = (id: string) => msg(id, 'req', 'GET /data', [h('Host', 'api.example', 'muted'), h('Origin', ORIGIN, 'new'), h('Accept', '*/*', 'muted'), h('Sec-Fetch-Mode', 'cors', 'muted')])
const req1 = getReq('req1')
const res1 = msg('res1', 'res', '200 OK', [h('Content-Type', 'application/json', 'muted')], { missing: ['Access-Control-Allow-Origin'], body: '{ "items": 3 }' })
const req2 = getReq('req2')
const res2 = msg('res2', 'res', '200 OK', [h('Content-Type', 'application/json', 'muted'), h('Access-Control-Allow-Origin', ORIGIN, 'ok'), h('Vary', 'Origin', 'new')], { body: '{ "items": 3 }' })

const simpleCode = `// сторінка https://app.example
const res = await fetch('https://api.example/data')
const data = await res.json()

// сервер https://api.example (Express)
app.get('/data', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'https://app.example')
  res.set('Vary', 'Origin')
  res.json({ items: 3 })
})`

const blocked = "CORS: No 'Access-Control-Allow-Origin' header → TypeError: Failed to fetch"
const sb = { msgs: [], active: null, verdict: null, output: [] }

const simple: StepScenario<CorsFrame> = {
  code: simpleCode,
  frames: [
    { ...sb, line: 2, note: 'Сторінка з https://app.example звертається до https://api.example. Інший хост — інший origin (схема + хост + порт), отже запит cross-origin.' },
    { ...sb, line: 2, msgs: [req1], active: 'req1', note: 'GET без власних заголовків — «простий» запит, preflight не потрібен. Заголовок Origin браузер додає сам, і JS не може його підробити.' },
    { ...sb, line: 9, msgs: [req1, res1], active: 'res1', note: 'Поки без рядків 7–8: сервер обробив запит і відповів 200 з даними, але без Access-Control-Allow-Origin.' },
    { ...sb, line: 2, msgs: [req1, res1], verdict: { ok: false, text: 'немає Access-Control-Allow-Origin' }, error: blocked, note: 'Браузер не знайшов дозволу і не віддав відповідь у JS: fetch відхиляється з TypeError. Але запит дійшов до сервера й виконався — CORS захищає читання відповіді, а не сервер.' },
    { ...sb, line: 7, note: 'Додаємо на сервері рядки 7–8. Vary: Origin підказує проміжним кешам, що відповідь залежить від заголовка Origin.' },
    { ...sb, line: 2, msgs: [req2], active: 'req2', note: 'Той самий запит удруге: GET з Origin: https://app.example.' },
    { ...sb, line: 9, msgs: [req2, res2], active: 'res2', note: 'Тепер у відповіді є Access-Control-Allow-Origin зі значенням, що точно збігається з Origin сторінки.' },
    { ...sb, line: 3, msgs: [req2, res2], verdict: { ok: true, text: 'Allow-Origin === Origin' }, output: ['{ items: 3 }'], note: 'CORS-перевірку пройдено: браузер віддає Response у JS, і res.json() читає тіло. Для публічного API без cookie підійшло б і значення *.' },
    { ...sb, line: null, msgs: [req2, res2], verdict: { ok: true, text: 'Allow-Origin === Origin' }, output: ['{ items: 3 }'], note: '«Простий» запит: метод GET, HEAD чи POST і лише safelisted-заголовки (Accept, Accept-Language, Content-Language, Content-Type зі значенням text/plain, multipart/form-data або application/x-www-form-urlencoded). Інакше — preflight.' },
  ],
}

// ── preflight ────────────────────────────────────────────────────
const opt = msg('opt', 'req', 'OPTIONS /todos/1', [h('Origin', ORIGIN, 'new'), h('Access-Control-Request-Method', 'PUT', 'new'), h('Access-Control-Request-Headers', 'content-type,x-token', 'new')], { tag: 'preflight' })
const optRes = msg(
  'opt-res',
  'res',
  '204 No Content',
  [
    h('Access-Control-Allow-Origin', ORIGIN, 'ok'),
    h('Access-Control-Allow-Methods', 'GET, PUT, DELETE', 'ok'),
    h('Access-Control-Allow-Headers', 'Content-Type, X-Token', 'ok'),
    h('Access-Control-Allow-Credentials', 'true', 'ok'),
    h('Access-Control-Max-Age', '600', 'new'),
    h('Vary', 'Origin', 'muted'),
  ],
  { tag: 'preflight' },
)
const putReq = (id: string) => msg(id, 'req', 'PUT /todos/1', [h('Origin', ORIGIN), h('Content-Type', 'application/json'), h('X-Token', 'abc123'), h('Cookie', 'sid=42', 'new')], { body: '{"done":true}' })
const putRes = (id: string) => msg(id, 'res', '200 OK', [h('Access-Control-Allow-Origin', ORIGIN, 'ok'), h('Access-Control-Allow-Credentials', 'true', 'ok'), h('Vary', 'Origin', 'muted'), h('Content-Type', 'application/json', 'muted')], { body: '{"id":1,"done":true}' })
const put = putReq('put')
const putOk = putRes('put-res')
const putStar = msg('put-star', 'res', '200 OK', [h('Access-Control-Allow-Origin', '*', 'bad'), h('Content-Type', 'application/json', 'muted')], { body: '{"id":1,"done":true}' })

const preflightCode = `// сторінка https://app.example
await fetch('https://api.example/todos/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Token': 'abc123',
  },
  credentials: 'include', // надіслати cookie
  body: JSON.stringify({ done: true }),
})`

const pb = { msgs: [], active: null, verdict: null, output: [] }
const preflightOk: CorsVerdict = { ok: true, text: 'preflight: PUT, content-type і x-token дозволені', preflight: true }
const finalOk: CorsVerdict = { ok: true, text: 'Allow-Origin === Origin, Allow-Credentials: true' }

const preflight: StepScenario<CorsFrame> = {
  code: preflightCode,
  frames: [
    { ...pb, line: 3, note: 'PUT не входить до safelisted-методів (GET, HEAD, POST), тож запит не «простий». Браузер спершу спитає в сервера дозволу.' },
    { ...pb, line: 5, note: 'До того ж Content-Type: application/json і власний X-Token не є safelisted-заголовками. Будь-якої з цих причин досить для preflight.' },
    { ...pb, line: 2, msgs: [opt], active: 'opt', note: 'Preflight: браузер сам надсилає OPTIONS з Origin, Access-Control-Request-Method і -Headers. Тіла й cookie в ньому немає, а JS цього запиту не бачить.' },
    { ...pb, line: 2, msgs: [opt, optRes], active: 'opt-res', note: 'Сервер дозволяє: 204 з переліком методів і заголовків. Max-Age: 600 — браузер може кешувати цей дозвіл 10 хвилин (кожен браузер має власну верхню межу).' },
    { ...pb, line: 2, msgs: [opt, optRes], verdict: preflightOk, note: 'Браузер звіряє: PUT є в Allow-Methods, content-type і x-token — в Allow-Headers, origin збігається. Якби ні — справжній PUT узагалі не пішов би на сервер.' },
    { ...pb, line: 8, msgs: [opt, optRes, put], active: 'put', verdict: preflightOk, note: 'Лише тепер іде справжній PUT: з тілом, заголовками й cookie, бо credentials: \'include\'.' },
    { ...pb, line: 2, msgs: [opt, optRes, put, putOk], active: 'put-res', note: 'Відповідь на сам запит теж мусить мати CORS-заголовки: preflight дозволяє надіслати запит, а ці — прочитати відповідь.' },
    { ...pb, line: 10, msgs: [opt, optRes, put, putOk], verdict: finalOk, output: ['{ id: 1, done: true }'], note: 'З credentials вимоги суворіші: Allow-Origin — точний origin, а не *, плюс Access-Control-Allow-Credentials: true. Перевірку пройдено — JS отримує відповідь.' },
    { ...pb, line: 8, msgs: [opt, optRes, put, putStar], active: 'put-star', verdict: { ok: false, text: '* заборонено разом з credentials' }, error: "CORS: wildcard '*' + credentials 'include' → TypeError: Failed to fetch", note: 'А якби сервер відповів Allow-Origin: *, браузер заблокував би відповідь: з cookie wildcard не діє (так само * в Allow-Methods і Allow-Headers).' },
    { ...pb, line: 2, msgs: [putReq('put2'), putRes('put2-res')], verdict: finalOk, output: ['{ id: 1, done: true }'], note: 'Повторний PUT протягом 10 хвилин: дозвіл узято з preflight-кешу, тож OPTIONS не надсилається — одразу справжній запит.' },
  ],
}

export const corsScenarios: Record<string, StepScenario<CorsFrame>> = {
  simple,
  preflight,
}

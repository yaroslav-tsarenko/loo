---
title: "Мережа: fetch, CORS і HTTP"
order: 27
level: middle
tags: [network, fetch, http, cors, caching, cookies, websocket]
prerequisites:
  - "[[JavaScript - 09. Promise]]"
  - "[[JavaScript - 10. async і await]]"
  - "[[JavaScript - 22. Помилки та їх обробка]]"
estimatedMinutes: 55
id: jsd-ch-27
icon: "🌐"
---

# Мережа: fetch, CORS і HTTP

> [!success] 🎯 Після цього розділу ти зможеш
> - написати надійну обгортку над `fetch`, що правильно обробляє 4xx/5xx, мережеві помилки й таймаути;
> - скасовувати запити через `AbortController`, `AbortSignal.timeout` і `AbortSignal.any`;
> - пояснити HTTP-кешування: `Cache-Control`, `ETag`, ревалідацію й відповідь `304`;
> - розрізнити same-origin policy і CORS, простий запит і preflight, і чому `*` не працює з `credentials`;
> - налаштувати cookies (`HttpOnly`, `Secure`, `SameSite`) і вибрати між WebSocket, SSE та звичайним HTTP.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-27-quiz-01
>
> ```js
> try {
>   const res = await fetch('/api/users/999'); // сервер відповідає 404
>   console.log('resolved', res.ok, res.status);
> } catch (err) {
>   console.log('rejected', err.name);
> }
> ```
>
> **Відповідь:** `resolved false 404`
>
> **Пояснення:** не переймайся, якщо помилився — це найпопулярніша пастка `fetch`. Проміс відхиляється лише тоді, коли відповіді **немає взагалі** (мережа, CORS, скасування). 404 і 500 — це цілком успішно отримані HTTP-відповіді, тому перевіряти `res.ok` треба самому.

## 🧒 Простими словами

HTTP — це листування з довідковим бюро. Ти надсилаєш лист-запит (метод, адреса, заголовки, тіло) і отримуєш лист-відповідь із кодом: `200` — «ось, тримай», `404` — «такого немає», `500` — «у нас пожежа». `fetch` — твій поштар: він поскаржиться (відхилить проміс), лише якщо лист **не дійшов** чи відповіді не було. Якщо бюро відповіло «не знайдено» — поштар чесно приносить цю відповідь, і читати її — твоя справа. Кеш — це ксерокопії старих відповідей на полиці: можна взяти копію одразу або подзвонити й спитати «чи не змінилось?» (`304` — «ні, бери копію»). А CORS — охоронець браузера: бюро може відповісти будь-кому, але охоронець **не віддасть** тобі лист від чужого бюро, якщо в листі немає дозволу «можна показувати сайту X».

## 🔬 Як це працює насправді

### 📡 fetch, Request і Response

`fetch(input, init)` повертає проміс з **`Response`**, щойно надійшли **заголовки** — тіло ще може качатися. Читати тіло — окремий асинхронний крок:

```js
const res = await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Вивчити CORS' }),
});
const data = await res.json(); // або text(), blob(), arrayBuffer(), formData(), bytes()
```

| Об'єкт | Що важливо |
|---|---|
| `Request` | `method`, `url`, `headers`, `body`, `credentials`, `mode`, `cache`, `signal`, `keepalive` |
| `Response` | `ok` (статус 200–299), `status`, `statusText`, `headers`, `type` (`basic`/`cors`/`opaque`), `redirected`, `url` |
| `Headers` | регістронезалежні ключі: `headers.get('content-type')` |
| `body` | `ReadableStream` — **читається лише один раз**; для двох читань — `res.clone()` |

Тіло — потік, тож велику відповідь можна обробляти шматками, не чекаючи кінця (прогрес завантаження, стрімінг відповіді LLM):

```js
const res = await fetch('/api/stream');
const decoder = new TextDecoder();
for await (const chunk of res.body) {         // Uint8Array-шматки
  console.log(decoder.decode(chunk, { stream: true }));
}
```

> [!quiz] Перевір себе: два читання тіла
> level: middle · id: jsd-27-quiz-02
>
> ```js
> const res = await fetch('/api/data');
> const json = await res.json();
> const text = await res.text();
> ```
>
> - [ ] `text` — той самий JSON рядком
> - [x] Другий виклик кине `TypeError`: тіло вже прочитано
> - [ ] `text` — порожній рядок
>
> **Пояснення:** тіло — потік, і після першого читання `res.bodyUsed === true`. Потрібні обидва — роби `res.clone()` до читання.

### 🚦 HTTP-статуси, методи й помилки fetch

**Коли `fetch` відхиляє проміс:** мережа недоступна, DNS, CORS-заборона, невалідний URL (`TypeError`), скасування (`AbortError`), таймаут `AbortSignal.timeout` (`TimeoutError`). **Коли ні:** будь-який HTTP-статус, включно з 4xx і 5xx.

| Клас | Приклади | Що робити клієнту |
|---|---|---|
| 2xx успіх | `200 OK`, `201 Created`, `204 No Content` (тіла немає — `json()` впаде) | використати дані |
| 3xx редирект | `301`/`308` назавжди, `302`/`307` тимчасово, `304 Not Modified` | `fetch` іде за редиректами сам; `304` — з кешу |
| 4xx помилка клієнта | `400`, `401` (не автентифікований), `403` (немає прав), `404`, `409`, `422`, `429` (забагато запитів) | показати помилку, не повторювати сліпо |
| 5xx помилка сервера | `500`, `502`, `503`, `504` | можна повторити з backoff (для ідемпотентних) |

| Метод | Безпечний | Ідемпотентний | Для чого |
|---|---|---|---|
| `GET`, `HEAD` | ✅ | ✅ | читання, кешуються |
| `PUT` | ❌ | ✅ | замінити ресурс цілком |
| `DELETE` | ❌ | ✅ | видалити |
| `POST` | ❌ | ❌ | створити / дія |
| `PATCH` | ❌ | не обов'язково | часткова зміна |
| `OPTIONS` | ✅ | ✅ | preflight CORS |

*Ідемпотентний* — повтор не змінює результат: тому `GET`/`PUT`/`DELETE` можна автоматично повторювати при збої, а `POST` — лише з ключем ідемпотентності.

```js
class HttpError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

async function fetchJson(url, { timeoutMs = 8000, signal, ...init } = {}) {
  const timeout = AbortSignal.timeout(timeoutMs);
  const res = await fetch(url, {
    ...init,
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    headers: { Accept: 'application/json', ...init.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new HttpError(res.status, `HTTP ${res.status} ${res.statusText}`, body);
  }
  return res.status === 204 ? null : res.json();
}
```

> [!quiz] Перевір себе: коли catch?
> level: junior · type: multi · id: jsd-27-quiz-03
>
> У яких випадках `await fetch(url)` **кине** виняток?
>
> - [ ] Сервер повернув `500 Internal Server Error`
> - [x] Wi-Fi вимкнено
> - [x] Сервер на іншому origin не повернув `Access-Control-Allow-Origin`
> - [ ] Сервер повернув `401 Unauthorized`
> - [x] Запит скасовано через `AbortController`
>
> **Пояснення:** HTTP-помилки — це відповіді, `fetch` їх повертає. Виняток — коли відповіді немає (мережа), її не можна показати (CORS) або запит перервано.

### ⏹️ Скасування й таймаути

У `fetch` немає опції `timeout` — є **сигнали**:

```js
// скасування користувачем (пошук «на льоту»: новий ввід скасовує старий запит)
let controller;
async function search(query) {
  controller?.abort();
  controller = new AbortController();
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return null; // це не помилка — ми самі скасували
    throw err;
  }
}

// таймаут без ручного setTimeout
await fetch('/api/slow', { signal: AbortSignal.timeout(5000) }); // → TimeoutError

// обидва одразу
await fetch(url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]) });
```

`abort(reason)` — причина потрапляє в rejection (без аргументу — `DOMException` `AbortError`). Сигнал скасовує і завантаження тіла, тож `res.json()` теж відхилиться. Один `AbortController` можна передати в кілька `fetch`, `addEventListener` і власні функції — це стандартний «токен скасування» платформи.

> [!quiz] Перевір себе: ім'я помилки
> level: middle · id: jsd-27-quiz-04
>
> Яка `err.name` у `catch` для `fetch(url, { signal: AbortSignal.timeout(100) })`, якщо сервер мовчить 500 мс?
>
> - [ ] `AbortError`
> - [x] `TimeoutError`
> - [ ] `TypeError`
> - [ ] `NetworkError`
>
> **Пояснення:** `AbortSignal.timeout` скасовує з причиною `DOMException` `TimeoutError` — так можна відрізнити «сам скасував» від «не дочекались».

> [!quiz] Склади запит JSON зі скасуванням і таймаутом
> level: middle · type: order · id: jsd-27-quiz-09
>
> ```js order
> async function getJSON(url, userSignal) {
>   const signal = AbortSignal.any([userSignal, AbortSignal.timeout(5000)])
>   const res = await fetch(url, { signal })
>   if (!res.ok) throw new Error(`HTTP ${res.status}`)
>   return res.json()
> }
>   const res = await fetch(url, { timeout: 5000 }) // ✗
> ```
>
> **Пояснення:** опції `timeout` у `fetch` немає — таймаут теж сигнал. `AbortSignal.any` поєднує скасування користувачем і `AbortSignal.timeout`. `fetch` не відхиляється на 4xx/5xx, тож `res.ok` перевіряємо самі.

### 🗄️ HTTP-кешування

Браузер кешує відповіді за інструкціями сервера. Дві фази: **свіжість** (можна взяти з кешу без запиту) і **ревалідація** (запитати сервер, чи змінилося).

> [!viz] http-cache
> scenario: revalidation

> [!diagram] HTTP-кеш: свіжість і ревалідація
> ```yaml
> layout: flow
> nodes:
>   - { id: page, label: сторінка, code: "<link href=\"/app.css\">", tone: blue, icon: "px:monitor" }
>   - { id: cache, label: "HTTP-кеш браузера", text: порожньо, tone: violet, icon: "px:database" }
>   - { id: server, label: сервер, text: "/app.css · ETag \"v1\"", tone: gray, icon: "px:globe" }
> edges:
>   - { from: page, to: cache }
>   - { from: cache, to: server }
> steps:
>   - { move: { from: page, to: cache, value: "GET /app.css" }, note: "Сторінці потрібен app.css. Спершу браузер заглядає в HTTP-кеш — там порожньо." }
>   - { move: { from: cache, to: server, value: "GET /app.css" }, note: "Кеш-промах, тож запит іде на сервер." }
>   - { move: { from: server, to: cache, value: "200 OK · max-age=60 · ETag \"v1\"" }, set: { cache: "app.css · v1 · свіже 60 с" }, note: "Сервер віддає файл і інструкції: «свіже 60 секунд», версія \"v1\". Браузер кладе відповідь у кеш." }
>   - { set: { cache: "вік 30 с — свіже" }, move: { from: cache, to: page, value: "app.css з кешу" }, note: "Через 30 с файл ще свіжий: браузер бере його з кешу взагалі БЕЗ запиту на сервер." }
>   - { set: { cache: "вік 90 с — застаріле" }, move: { from: cache, to: server, value: "If-None-Match: \"v1\"" }, note: "Через 90 с відповідь застаріла. Браузер не качає наново, а питає: «у мене \"v1\" — щось змінилося?»" }
>   - { move: { from: server, to: cache, value: "304 Not Modified" }, set: { cache: "app.css · v1 · знову свіже" }, note: "Файл той самий — сервер відповідає 304 без тіла. Кеш оновлює свіжість і віддає сторінці старий файл." }
> ```

| Директива `Cache-Control` | Значення |
|---|---|
| `max-age=N` | свіже N секунд |
| `no-cache` | зберігати **можна**, але перед кожним використанням ревалідувати |
| `no-store` | не зберігати взагалі (банківські дані) |
| `private` / `public` | лише браузер / також спільні кеші (CDN) |
| `immutable` | не ревалідувати, навіть при перезавантаженні |
| `stale-while-revalidate=N` | віддати застаріле одразу й оновити у фоні |

Валідатори: `ETag` ↔ `If-None-Match` (точніше) і `Last-Modified` ↔ `If-Modified-Since`. `Vary: Accept-Encoding, Origin` каже кешу, що відповідь залежить від цих заголовків запиту.

Класична стратегія для SPA:

- файли з хешем у назві (`app.3f9a1c.js`) — `Cache-Control: max-age=31536000, immutable` (новий код = нова назва);
- `index.html` — `Cache-Control: no-cache` (завжди ревалідувати, щоб отримати нові посилання);
- API — зазвичай `no-store` або короткий `max-age` / `private`.

Опція `fetch(url, { cache: 'no-store' | 'no-cache' | 'reload' | 'force-cache' })` керує HTTP-кешем для конкретного запиту. Без `Cache-Control`, але з `Last-Modified`, браузер застосує **евристичне** кешування — частий сюрприз «чому користувачі бачать старе».

> [!figure] devtools-network
> scenario: cache-revalidate
>
> Після перезавантаження `app.js` перевіряється через `if-none-match` і приходить як `304` без тіла, а свіжий `logo.svg` береться з кешу взагалі без запиту.

> [!quiz] Перевір себе: no-cache
> level: middle · id: jsd-27-quiz-05
>
> Що означає `Cache-Control: no-cache`?
>
> - [ ] Відповідь заборонено зберігати
> - [x] Зберігати можна, але кожне використання — лише після ревалідації з сервером
> - [ ] Кешувати лише на CDN
> - [ ] Кеш на 0 секунд, потім видалити
>
> **Пояснення:** «не зберігати» — це `no-store`. `no-cache` дає дешеві `304` замість повного завантаження, якщо ресурс не змінився.

### 🛂 Same-origin policy і CORS

**Origin** = схема + хост + порт: `https://app.com:443`. `http://app.com`, `https://api.app.com` і `https://app.com:8443` — три **інші** origin. **Same-origin policy** забороняє скрипту *читати* відповіді з чужих origin. **CORS** — протокол, яким сервер явно дозволяє: «відповідь можна показати origin X».

Ключовий факт: CORS — це обмеження **браузера на читання**, а не захист сервера. Запит без CORS-дозволу часто все одно **доходить** до сервера і виконується — браузер лише не віддасть відповідь твоєму JS. Тому CORS не замінює CSRF-захист і автентифікацію.

**Простий запит** (без preflight): метод `GET`, `HEAD` або `POST`; лише safelisted-заголовки (`Accept`, `Accept-Language`, `Content-Language`, `Content-Type` зі значенням `text/plain`, `multipart/form-data` або `application/x-www-form-urlencoded`). Браузер шле запит з `Origin` і перевіряє відповідь:

> [!viz] cors
> scenario: simple

> [!diagram] Простий CORS-запит: хто кого перевіряє
> ```yaml
> layout: flow
> nodes:
>   - { id: js, label: "JS на https://app.com", code: "const res = await fetch(url)", tone: blue }
>   - { id: br, label: браузер, text: "стежить за CORS", tone: violet, icon: "pi:PiBrowserFill" }
>   - { id: srv, label: "сервер іншого origin", text: "/data", tone: gray, icon: "px:globe" }
> edges:
>   - { from: js, to: br }
>   - { from: br, to: srv }
> steps:
>   - { move: { from: js, to: br, value: "fetch(url)" }, line: "js:1", note: "Скрипт зі сторінки https://app.com просить дані з чужого origin." }
>   - { move: { from: br, to: srv, value: "GET /data · Origin: https://app.com" }, note: "Це простий запит (GET без особливих заголовків), тож браузер шле його одразу й сам додає Origin — звідки запит." }
>   - { move: { from: srv, to: br, value: "200 · Access-Control-Allow-Origin: https://app.com" }, set: { br: "✅ origin дозволено" }, note: "Сервер відповідає і явно дозволяє origin https://app.com." }
>   - { move: { from: br, to: js, value: "res ✅" }, note: "Дозвіл є — браузер віддає відповідь твоєму JS." }
>   - { move: { from: srv, to: br, value: "200 (без заголовка)" }, set: { br: "❌ дозволу немає" }, note: "Інший сценарій: сервер не додав Access-Control-Allow-Origin. Запит дійшов і навіть виконався…" }
>   - { move: { from: br, to: js, value: "TypeError: Failed to fetch" }, note: "…але браузер не віддасть відповідь JS. CORS обмежує читання в браузері, а не захищає сервер." }
> ```

**Preflight** — для всього іншого: `PUT`/`DELETE`/`PATCH`, `Content-Type: application/json`, `Authorization`, власні заголовки. Спершу браузер питає дозволу запитом `OPTIONS`:

> [!viz] cors
> scenario: preflight

> [!diagram] Preflight: спершу дозвіл, потім запит
> ```yaml
> layout: flow
> nodes:
>   - { id: js, label: "JS на https://app.com", code: "fetch('/todos', { method: 'PUT',\n  headers: { 'Content-Type': 'application/json',\n    Authorization: 'Bearer …' } })", tone: blue }
>   - { id: br, label: браузер, text: "запит не простий", tone: violet, icon: "pi:PiBrowserFill" }
>   - { id: srv, label: "сервер іншого origin", text: "/todos", tone: gray, icon: "px:globe" }
> edges:
>   - { from: js, to: br }
>   - { from: br, to: srv }
> steps:
>   - { move: { from: js, to: br, value: "PUT + JSON + Authorization" }, note: "PUT, Content-Type: application/json і Authorization — усе це робить запит «не простим». Одразу слати його браузер не буде." }
>   - { move: { from: br, to: srv, value: "OPTIONS /todos · Request-Method: PUT" }, set: { br: "чекає на дозвіл" }, note: "Спершу preflight: OPTIONS з Origin і питанням «чи можна PUT із заголовками content-type, authorization?»" }
>   - { move: { from: srv, to: br, value: "204 · Allow-Methods: PUT, DELETE" }, set: { br: "✅ дозвіл на 600 с" }, note: "Сервер дозволяє origin, методи й заголовки. Access-Control-Max-Age: 600 — браузер запам'ятає дозвіл для цього URL." }
>   - { move: { from: br, to: srv, value: "PUT /todos" }, note: "Лише тепер іде справжній запит." }
>   - { move: [{ from: srv, to: br, value: "200 OK" }, { from: br, to: js, value: "res ✅" }], note: "Відповідь теж містить Access-Control-Allow-Origin — і доходить до JS. Без preflight-дозволу PUT узагалі не був би надісланий." }
> ```

**Credentials** (cookies, HTTP auth) у крос-origin запиті надсилаються лише з `credentials: 'include'`, і тоді сервер мусить відповісти **конкретним** origin (не `*`) плюс `Access-Control-Allow-Credentials: true`. Читати нестандартні заголовки відповіді (`X-Total-Count`) дозволяє `Access-Control-Expose-Headers`. `mode: 'no-cors'` не «вимикає CORS», а дає **opaque**-відповідь: `status 0`, тіло недоступне.

> [!figure] devtools-network
> scenario: cors-preflight
>
> У вкладці Network preflight видно окремим рядком `OPTIONS` перед справжнім `POST` — разом із заголовками `access-control-*`, які дозволяють запит.

> [!quiz] Перевір себе: потрібен preflight?
> level: middle · type: multi · id: jsd-27-quiz-06
>
> Які крос-origin запити спричинять preflight `OPTIONS`?
>
> - [ ] `fetch(url)` — звичайний GET
> - [x] `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })`
> - [ ] `fetch(url, { method: 'POST', body: new FormData(form) })`
> - [x] `fetch(url, { headers: { Authorization: 'Bearer …' } })`
> - [x] `fetch(url, { method: 'DELETE' })`
>
> **Пояснення:** `FormData` дає `multipart/form-data` — safelisted. `application/json`, `Authorization` і метод `DELETE` виходять за межі «простого» запиту.

> [!quiz] Заповни пропуски: чи потрібен preflight?
> level: senior · type: fill · id: jsd-27-quiz-10 · bank: PUT, false, every
>
> ```js fill
> const SIMPLE_METHODS = new Set(['GET', 'HEAD', '[[POST]]'])
> const SIMPLE_TYPES = ['text/plain', 'multipart/form-data', 'application/x-www-form-urlencoded']
> const SAFE_HEADERS = ['accept', 'accept-language', 'content-language', 'content-type']
>
> function needsPreflight({ method, contentType, headers = [] }) {
>   if (!SIMPLE_METHODS.has(method)) return [[true]]
>   if (contentType && !SIMPLE_TYPES.includes(contentType)) return true
>   return headers.[[some]]((h) => !SAFE_HEADERS.includes(h.toLowerCase()))
> }
> ```
>
> **Пояснення:** простий запит — лише `GET`/`HEAD`/`POST`, safelisted-заголовки і три «формові» `Content-Type`. Будь-що інше (`PUT`, `application/json`, `Authorization`) — і браузер спершу шле `OPTIONS`. Досить **одного** небезпечного заголовка, тому `some`.

### 🍪 Cookies і credentials

Сервер ставить cookie заголовком `Set-Cookie`, браузер автоматично додає її в наступні запити до цього сайту.

```http
Set-Cookie: __Host-session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=86400
```

| Атрибут | Навіщо |
|---|---|
| `HttpOnly` | недоступна з `document.cookie` → XSS не вкраде сесію |
| `Secure` | лише по HTTPS |
| `SameSite=Strict` | не надсилати з жодних крос-сайтових запитів |
| `SameSite=Lax` | надсилати при переході за посиланням (top-level GET), але не в `fetch`/формах `POST` з чужих сайтів; **дефолт** у Chrome та Edge |
| `SameSite=None` | надсилати завжди; вимагає `Secure` |
| `Domain`, `Path` | межі, де cookie надсилається |
| `Max-Age` / `Expires` | без них — сесійна cookie |
| префікс `__Host-` | гарантує `Secure`, `Path=/` і відсутність `Domain` |

*Site* ≠ *origin*: `app.example.com` і `api.example.com` — різні origin, але той самий site (`example.com`), тож для `SameSite` запит між ними не крос-сайтовий. Сторонні cookies браузери обмежують дедалі сильніше (Safari і Firefox блокують їх за замовчуванням), для вбудованих віджетів є `Partitioned` (CHIPS).

Для `fetch`: `credentials: 'same-origin'` (дефолт), `'include'` (і для крос-origin — разом із CORS-заголовками вище), `'omit'`. Сесійна cookie з `HttpOnly; Secure; SameSite=Lax` + CSRF-токен для небезпечних методів — надійна база; токени в `localStorage` доступні будь-якому XSS — див. [[JavaScript - 28. Сховища та Web APIs]] і [[JavaScript - 30. Безпека в JavaScript]].

> [!quiz] Перевір себе: атрибути cookie
> level: middle · id: jsd-27-quiz-07
>
> Який атрибут не дасть шкідливому скрипту, впровадженому через XSS, прочитати сесійну cookie?
>
> - [ ] `Secure`
> - [ ] `SameSite=Strict`
> - [x] `HttpOnly`
> - [ ] `Path=/`
>
> **Пояснення:** `HttpOnly` ховає cookie від `document.cookie`. `Secure` — про HTTPS, `SameSite` — про крос-сайтові запити (CSRF), а не про доступ з JS.

### 🔌 WebSocket, SSE, HTTP/2 і HTTP/3

| | HTTP + `fetch` | Server-Sent Events | WebSocket |
|---|---|---|---|
| Напрям | запит → відповідь | сервер → клієнт | обидва, повний дуплекс |
| Дані | будь-які | лише текст (`text/event-stream`) | текст і бінарні |
| Перепідключення | — | **автоматичне**, з `Last-Event-ID` | вручну |
| API | `fetch` | `new EventSource(url)` | `new WebSocket('wss://…')` |
| Коли | CRUD, більшість задач | стрічки, сповіщення, прогрес, стрімінг відповіді | чати, ігри, спільне редагування |

```js
const events = new EventSource('/api/notifications');
events.addEventListener('message', (e) => console.log(JSON.parse(e.data)));

const ws = new WebSocket('wss://chat.example.com/room/42');
ws.addEventListener('open', () => ws.send(JSON.stringify({ type: 'hello' })));
ws.addEventListener('message', (e) => console.log(e.data));
ws.addEventListener('close', (e) => console.log('closed', e.code)); // перепідключення — твоя справа
```

WebSocket стартує як HTTP-запит з `Upgrade: websocket` (відповідь `101 Switching Protocols`). CORS на нього **не поширюється** — сервер мусить сам перевіряти заголовок `Origin`, інакше можлива cross-site WebSocket hijacking.

**HTTP/2** — бінарні фрейми й **мультиплексування** багатьох запитів в одному TCP-з'єднанні, стиснення заголовків (HPACK). Склеювання файлів і шардинг доменів більше не потрібні. Але втрачений TCP-пакет гальмує всі потоки (head-of-line blocking на рівні TCP). **HTTP/3** працює поверх **QUIC** (UDP): незалежні потоки без TCP HOL blocking, швидше встановлення з'єднання, міграція при зміні мережі (Wi-Fi → 4G). Для JS-коду API той самий — `fetch` не змінюється.

> [!quiz] Перевір себе: що обрати?
> level: middle · id: jsd-27-quiz-08
>
> Дашборд має показувати нові замовлення в реальному часі; клієнт нічого не надсилає по цьому каналу. Що найпростіше?
>
> - [ ] Опитування `setInterval(fetch, 1000)`
> - [x] Server-Sent Events
> - [ ] WebSocket
> - [ ] Long polling через `XMLHttpRequest`
>
> **Пояснення:** односторонній потік сервер → клієнт — рівно задача SSE: звичайний HTTP, автоматичне перепідключення, працює з HTTP/2. WebSocket тут — зайва складність.

## ⚠️ Пастки

> [!pitfall] Перевіряти лише catch
> ```js
> try {
>   const data = await (await fetch('/api/user')).json();
>   render(data); // при 500 тут буде об'єкт помилки сервера або SyntaxError від HTML-сторінки
> } catch { showError(); }
> ```
>
> Завжди `if (!res.ok) throw …` перед читанням тіла.

> [!pitfall] Access-Control-Allow-Origin: * з credentials
> Браузер відкине відповідь на запит з `credentials: 'include'`, якщо сервер поставив `*`. Віддзеркалюй **перевірений** origin зі списку дозволених і додавай `Vary: Origin`, щоб кеш/CDN не віддав чужу відповідь.

> [!pitfall] «Вимкнути CORS» через mode: 'no-cors'
> Запит піде, але відповідь буде opaque: `status 0`, тіло недоступне. Це не обхід, а режим для `<img>`-подібних випадків і Service Worker. Проблему CORS вирішують заголовками на сервері або проксі на своєму origin.

> [!pitfall] Гонка відповідей у пошуку
> Користувач надрукував «ab», потім «abc», а відповідь на «ab» прийшла **пізніше** — і перезаписала результати. Скасовуй попередній запит через `AbortController` або перевіряй, що відповідь відповідає поточному запиту.

## 🎤 На співбесіді

> [!interview] Чому fetch не відхиляє проміс на 404 і як правильно обробляти помилки?
> level: middle · frequency: дуже часто · id: jsd-27-int-01
>
> ---
>
> Проміс `fetch` резолвиться, щойно отримано заголовки відповіді — будь-якої, бо 404 чи 500 теж валідні HTTP-відповіді. Відхиляється він лише при мережевій помилці, CORS-забороні, невалідному URL (`TypeError`) і скасуванні (`AbortError`/`TimeoutError`). Тому обгортка перевіряє `res.ok` (200–299) і кидає власну `HttpError` зі `status` і тілом; окремо обробляє `204` (немає тіла), таймаут через `AbortSignal.timeout`, скасування через `AbortController` (не показувати як помилку), і повторює з backoff лише ідемпотентні запити при 5xx/мережі.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🚦 HTTP-статуси, методи й помилки fetch|Розділ: помилки fetch]] · [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) · [web.dev: Fetch API error handling](https://web.dev/articles/fetch-api-error-handling)

> [!interview] Що таке CORS і preflight-запит?
> level: middle · frequency: дуже часто · id: jsd-27-int-02
>
> ---
>
> Same-origin policy забороняє скрипту читати відповіді з іншого origin (схема + хост + порт). CORS — протокол, яким сервер дозволяє це заголовком `Access-Control-Allow-Origin`. Прості запити (`GET`/`HEAD`/`POST` із safelisted-заголовками й `Content-Type` форми чи `text/plain`) ідуть одразу з `Origin`. Решта (`PUT`, `DELETE`, `application/json`, `Authorization`) спершу шлють `OPTIONS` з `Access-Control-Request-Method/Headers`; сервер відповідає `Allow-Methods/Headers` і може кешувати дозвіл `Max-Age`. З `credentials: 'include'` потрібні конкретний origin і `Allow-Credentials: true`. Важливо: CORS обмежує читання в браузері, а не доступ до сервера — запит усе одно може виконатися.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🛂 Same-origin policy і CORS|Розділ: CORS]] · [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) · [Fetch Standard: CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)

> [!interview] Як працює HTTP-кешування і як кешувати SPA?
> level: senior · frequency: часто · id: jsd-27-int-03
>
> ---
>
> Сервер задає свіжість `Cache-Control: max-age` (або `no-cache` — завжди ревалідувати, `no-store` — не зберігати) і валідатори `ETag`/`Last-Modified`. Поки відповідь свіжа — береться з кешу без запиту; коли застаріла — браузер шле умовний запит `If-None-Match`/`If-Modified-Since` і при `304` використовує кеш без завантаження тіла. Для SPA: асети з хешем у назві — `max-age=31536000, immutable`; `index.html` — `no-cache`, щоб завжди отримувати актуальні посилання на асети; API — `no-store`/`private` або короткий `max-age` зі `stale-while-revalidate`. `Vary` — якщо відповідь залежить від заголовків запиту.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🗄️ HTTP-кешування|Розділ: кешування]] · [MDN: HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) · [web.dev: HTTP cache](https://web.dev/articles/http-cache)

## 🔗 Зв'язки

- [[JavaScript - 09. Promise]] — `fetch` повертає проміс; `Promise.all`/`allSettled` для паралельних запитів.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — debounce пошуку, retry з backoff, скасування застарілих запитів.
- [[JavaScript - 22. Помилки та їх обробка]] — власна `HttpError`, `cause` і обробка rejection-ів.
- [[JavaScript - 23. JSON, structuredClone і серіалізація]] — `JSON.stringify` для тіла й безпечний розбір відповіді.
- [[JavaScript - 28. Сховища та Web APIs]] — Cache API і Service Worker поверх HTTP-кешу.
- [[JavaScript - 30. Безпека в JavaScript]] — CSRF, XSS і чому `SameSite`/`HttpOnly` важливі.

## ⚡ Фішки

> [!reel] 🙃 fetch радіє навіть 500-й помилці
> Проміс відхиляється лише без відповіді. `404` і `500` — це відповіді, тож `res.ok` перевіряй сам.

> [!reel] 🚪 CORS не захищає сервер
> Запит без CORS-дозволу часто доходить до сервера й виконується. Браузер лише не показує відповідь твоєму JS. Від CSRF рятують `SameSite` і токени, а не CORS.

> [!reel] 📬 no-cache означає «кешуй»
> `no-cache` — зберігай, але перепитуй сервер перед використанням. Не зберігати взагалі — `no-store`.

> [!reel] ⏱️ AbortSignal.timeout замість setTimeout
> ```js
> await fetch(url, { signal: AbortSignal.timeout(5000) });
> // catch → err.name === 'TimeoutError'
> ```

> [!reel] 🔁 SSE перепідключається сам
> `EventSource` після обриву сам підключиться знову й надішле `Last-Event-ID`, щоб сервер дослав пропущене. WebSocket так не вміє.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що означає `res.ok`?
> *дуже часто · теорія* · `jsd-27-001`
>
> `true`, якщо статус у діапазоні 200–299. Для 3xx (які `fetch` не обробив сам), 4xx і 5xx — `false`. Перевіряй його перед читанням тіла.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🚦 HTTP-статуси, методи й помилки fetch|Розділ: статуси]] · [MDN: Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)

> [!question]- Чим `401` відрізняється від `403`?
> *часто · порівняння* · `jsd-27-002`
>
> `401 Unauthorized` — «я не знаю, хто ти»: автентифікація відсутня або недійсна (залогінься). `403 Forbidden` — «знаю, хто ти, але не можна»: бракує прав.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🚦 HTTP-статуси, методи й помилки fetch|Розділ: статуси]] · [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

> [!question]- Що таке origin?
> *часто · теорія* · `jsd-27-003`
>
> Трійка схема + хост + порт. `https://app.com` і `https://app.com:8443`, `http://app.com`, `https://api.app.com` — чотири різні origin. Same-origin policy порівнює саме їх.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🛂 Same-origin policy і CORS|Розділ: same-origin]] · [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)

### 🟡 Middle

> [!question]- Як зробити таймаут для `fetch`?
> *часто · код* · `jsd-27-004`
>
> `fetch(url, { signal: AbortSignal.timeout(5000) })` — помилка `TimeoutError`. Разом зі скасуванням користувачем — `AbortSignal.any([controller.signal, AbortSignal.timeout(5000)])`.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#⏹️ Скасування й таймаути|Розділ: скасування]] · [MDN: AbortSignal.timeout](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)

> [!question]- Чим `no-cache` відрізняється від `no-store`?
> *часто · порівняння* · `jsd-27-005`
>
> `no-cache` — відповідь можна зберегти, але перед кожним використанням ревалідувати (дешеве `304`, якщо не змінилось). `no-store` — не зберігати взагалі ніде.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🗄️ HTTP-кешування|Розділ: Cache-Control]] · [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)

> [!question]- Які атрибути має мати сесійна cookie?
> *часто · практика* · `jsd-27-006`
>
> `HttpOnly` (недоступна з JS), `Secure` (лише HTTPS), `SameSite=Lax` або `Strict` (захист від CSRF), обмежений `Max-Age`, бажано префікс `__Host-` (`Path=/`, без `Domain`).
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🍪 Cookies і credentials|Розділ: cookies]] · [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

> [!question]- Чому `Access-Control-Allow-Origin: *` не працює з cookies?
> *іноді · теорія* · `jsd-27-007`
>
> Для запитів з credentials специфікація вимагає конкретний origin у `Access-Control-Allow-Origin` і `Access-Control-Allow-Credentials: true`, інакше будь-який сайт читав би приватні дані користувача. Сервер віддзеркалює перевірений origin і ставить `Vary: Origin`.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🛂 Same-origin policy і CORS|Розділ: credentials]] · [Fetch Standard: CORS and credentials](https://fetch.spec.whatwg.org/#cors-protocol-and-credentials)

### 🔴 Senior

> [!question]- Що дає HTTP/2 і чим від нього відрізняється HTTP/3?
> *іноді · порівняння* · `jsd-27-008`
>
> HTTP/2: бінарні фрейми, мультиплексування багатьох запитів в одному TCP-з'єднанні, стиснення заголовків — склеювання файлів і шардинг доменів не потрібні. Але втрата TCP-пакета блокує всі потоки. HTTP/3 іде поверх QUIC (UDP): потоки незалежні, рукостискання швидше, з'єднання переживає зміну мережі.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🔌 WebSocket, SSE, HTTP/2 і HTTP/3|Розділ: протоколи]] · [MDN: Evolution of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP)

> [!question]- Чому WebSocket-сервер мусить перевіряти `Origin`?
> *рідко · теорія* · `jsd-27-009`
>
> На WebSocket не поширюється CORS: будь-яка сторінка може відкрити з'єднання до твого сервера, і браузер додасть cookies користувача. Без перевірки `Origin` шкідливий сайт діятиме від імені користувача (cross-site WebSocket hijacking).
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🔌 WebSocket, SSE, HTTP/2 і HTTP/3|Розділ: WebSocket]] · [MDN: WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

> [!question]- Як дати JS прочитати заголовок `X-Total-Count` з крос-origin відповіді?
> *рідко · практика* · `jsd-27-010`
>
> За замовчуванням JS бачить лише safelisted-заголовки відповіді (`Content-Type`, `Content-Length`, `Cache-Control`, `Expires`, `Last-Modified`, `Content-Language`, `Pragma`). Сервер має додати `Access-Control-Expose-Headers: X-Total-Count`.
>
> 📚 [[JavaScript - 27. Мережа — fetch, CORS і HTTP#🛂 Same-origin policy і CORS|Розділ: CORS-заголовки]] · [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

## 🛠️ Практика

> [!task] Поясни своїми словами: CORS
> level: junior · difficulty: easy · id: jsd-27-task-01 · tags: feynman, cors
>
> Бекенд-розробник каже: «Я бачу в логах, що запит з фронтенду прийшов і я відповів 200, але фронт каже, що помилка CORS. Це баг браузера?» Поясни йому за 4–5 речень, що відбувається і що він має змінити.
>
> > [!hint]- Підказка 1
> > Хто саме блокує — сервер чи браузер? І що блокується — запит чи читання відповіді?
>
> > [!hint]- Підказка 2
> > Який заголовок має бути у відповіді й чому браузер його вимагає?
>
> > [!solution]- Еталонне пояснення
> > Це не баг: запит справді дійшов, і сервер відповів, але браузер **не віддає** відповідь JavaScript-коду сторінки з іншого origin, поки сервер явно цього не дозволить. Так браузер захищає користувача: інакше будь-який сайт міг би читати твою пошту чи банк, бо запити йдуть із cookies користувача. Дозвіл — заголовок `Access-Control-Allow-Origin: https://наш-фронт` у відповіді; якщо фронт шле JSON чи `Authorization`, браузер спершу питає дозволу `OPTIONS`-запитом, і на нього теж треба відповісти `Allow-Methods`/`Allow-Headers`. Якщо потрібні cookies — ще `Allow-Credentials: true` і конкретний origin замість `*`.

> [!task] Пошук з скасуванням застарілих запитів
> level: middle · difficulty: medium · id: jsd-27-task-02 · tags: fetch, abort-controller, race-condition
>
> Напиши `createSearch(fetchImpl = fetch)`, що повертає `search(query)`: кожен новий виклик скасовує попередній незавершений запит; скасовані виклики резолвляться `null` (без помилки); HTTP-помилки кидають `Error` зі `status`; таймаут 5 с.
>
> ```js starter
> function createSearch(fetchImpl = fetch) {
>   let controller = null
>
>   return async function search(query) {
>     // твій код
>   }
> }
> ```
>
> ```js tests
> // Фейковий fetch: запити «висять», доки тест не відповість; поважає signal
> function fakeFetch() {
>   const calls = []
>   const impl = (url, { signal } = {}) => new Promise((resolve, reject) => {
>     const call = { url, signal, respond: (data, status = 200) => resolve(new Response(JSON.stringify(data), { status })) }
>     calls.push(call)
>     signal?.addEventListener('abort', () => reject(signal.reason), { once: true })
>   })
>   return { impl, calls }
> }
>
> test('повертає JSON і кодує запит в URL', async () => {
>   const { impl, calls } = fakeFetch()
>   const search = createSearch(impl)
>   const p = search('a&b c')
>   calls[0].respond(['x'])
>   await expect(p).resolves.toEqual(['x'])
>   expect(calls[0].url).toBe('/api/search?q=a%26b%20c')
>   expect(calls[0].signal).toBeInstanceOf(AbortSignal)
> })
>
> test('новий виклик скасовує попередній — той резолвиться null', async () => {
>   const { impl, calls } = fakeFetch()
>   const search = createSearch(impl)
>   const first = search('re')
>   const second = search('react')
>   expect(calls[0].signal.aborted).toBe(true)
>   calls[1].respond(['react'])
>   await expect(first).resolves.toBeNull()
>   await expect(second).resolves.toEqual(['react'])
> })
>
> test('HTTP-помилка — Error зі status', async () => {
>   const { impl, calls } = fakeFetch()
>   const search = createSearch(impl)
>   const p = search('x').catch((e) => e)
>   calls[0].respond({ error: 'boom' }, 500)
>   const err = await p
>   expect(err).toBeInstanceOf(Error)
>   expect(err.status).toBe(500)
> })
>
> test('таймаут і мережеві помилки — справжні помилки, не null', async () => {
>   const timeout = () => Promise.reject(new DOMException('timed out', 'TimeoutError'))
>   await expect(createSearch(timeout)('x')).rejects.toThrow('timed out')
>   const offline = () => Promise.reject(new TypeError('Failed to fetch'))
>   await expect(createSearch(offline)('x')).rejects.toThrow(TypeError)
> })
>
> test('завершений запит не скасовується наступним', async () => {
>   const { impl, calls } = fakeFetch()
>   const search = createSearch(impl)
>   const p1 = search('a')
>   calls[0].respond([1])
>   await p1
>   const p2 = search('b')
>   calls[1].respond([2])
>   await expect(p2).resolves.toEqual([2])
>   expect(calls[0].signal.aborted).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай поточний `AbortController` у замиканні; на початку `search` — `abort()` попереднього.
>
> > [!hint]- Підказка 2
> > Відрізняй `AbortError` (ми скасували — `null`) від `TimeoutError` (це справжня помилка).
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createSearch(fetchImpl = fetch) {
> >   let controller = null;
> >
> >   return async function search(query) {
> >     controller?.abort();
> >     const own = (controller = new AbortController());
> >     const signal = AbortSignal.any([own.signal, AbortSignal.timeout(5000)]);
> >     try {
> >       const res = await fetchImpl(`/api/search?q=${encodeURIComponent(query)}`, { signal });
> >       if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
> >       return await res.json();
> >     } catch (err) {
> >       if (err.name === 'AbortError' && own.signal.aborted) return null; // витіснено новим запитом
> >       throw err;
> >     } finally {
> >       if (controller === own) controller = null;
> >     }
> >   };
> > }
> > ```
> >
> > Перевірка `own.signal.aborted` гарантує, що `null` повертається лише для витіснених запитів, а не для таймауту. `encodeURIComponent` — обов'язково, інакше `&` у запиті зламає URL.

> [!task] fetch з retry, backoff і повагою до Retry-After
> level: senior · difficulty: hard · id: jsd-27-task-03 · tags: fetch, retry, http
>
> Напиши `fetchWithRetry(url, init, { retries = 3, baseMs = 200, fetchImpl = fetch })` (`fetchImpl` дозволяє підмінити мережу в тестах):
> - повторює лише **ідемпотентні** методи (`GET`, `HEAD`, `PUT`, `DELETE`, `OPTIONS`) при мережевій помилці, `408`, `429` і 5xx;
> - затримка — експоненційна з jitter: `random(0, baseMs * 2 ** attempt)`;
> - якщо відповідь має `Retry-After` у секундах — чекає саме стільки;
> - поважає `init.signal`: скасування перериває і запит, і очікування;
> - повертає останню `Response` (навіть неуспішну), якщо спроби вичерпано на HTTP-помилці.
>
> ```js starter
> const IDEMPOTENT = new Set(['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'])
> const RETRY_STATUS = (s) => s === 408 || s === 429 || s >= 500
>
> async function fetchWithRetry(url, init = {}, { retries = 3, baseMs = 200, fetchImpl = fetch } = {}) {
>   // твій код
> }
> ```
>
> ```js tests
> Math.random = () => 0.5 // детермінований jitter
> const flush = async () => { for (let i = 0; i < 50; i++) await Promise.resolve() }
> async function drive(promise) {
>   let done = false
>   promise.then(() => { done = true }, () => { done = true })
>   for (let i = 0; i < 5000 && !done; i++) { vi.advanceTimersByTime(10); await flush() }
>   return promise
> }
> // Фейкова мережа: по черзі віддає відповіді зі сценарію (або кидає помилку)
> function network(...script) {
>   return vi.fn(async () => {
>     const step = script.shift()
>     if (step instanceof Error) throw step
>     return new Response(null, { status: step.status ?? step, headers: step.headers ?? {} })
>   })
> }
>
> test('успіх з першої спроби — один запит', async () => {
>   vi.useFakeTimers()
>   const fetchImpl = network(200)
>   const res = await drive(fetchWithRetry('/a', {}, { fetchImpl }))
>   expect(res.status).toBe(200)
>   expect(fetchImpl).toHaveBeenCalledTimes(1)
> })
>
> test('повторює GET на 503 і мережевій помилці', async () => {
>   vi.useFakeTimers()
>   const fetchImpl = network(503, new TypeError('Failed to fetch'), 200)
>   const res = await drive(fetchWithRetry('/a', {}, { fetchImpl }))
>   expect(res.status).toBe(200)
>   expect(fetchImpl).toHaveBeenCalledTimes(3)
> })
>
> test('не повторює POST і не повторює 404', async () => {
>   vi.useFakeTimers()
>   const post = network(503, 200)
>   expect((await drive(fetchWithRetry('/a', { method: 'post' }, { fetchImpl: post }))).status).toBe(503)
>   expect(post).toHaveBeenCalledTimes(1)
>   const notFound = network(404, 200)
>   expect((await drive(fetchWithRetry('/a', {}, { fetchImpl: notFound }))).status).toBe(404)
>   expect(notFound).toHaveBeenCalledTimes(1)
> })
>
> test('вичерпав спроби — повертає останню відповідь', async () => {
>   vi.useFakeTimers()
>   const fetchImpl = network(500, 502, 503)
>   const res = await drive(fetchWithRetry('/a', {}, { retries: 2, fetchImpl }))
>   expect(res.status).toBe(503)
>   expect(fetchImpl).toHaveBeenCalledTimes(3)
> })
>
> test('чекає рівно Retry-After секунд', async () => {
>   vi.useFakeTimers()
>   const fetchImpl = network({ status: 429, headers: { 'Retry-After': '2' } }, 200)
>   const p = fetchWithRetry('/a', {}, { fetchImpl })
>   await flush()
>   vi.advanceTimersByTime(1999)
>   await flush()
>   expect(fetchImpl).toHaveBeenCalledTimes(1)
>   vi.advanceTimersByTime(1)
>   await flush()
>   expect(fetchImpl).toHaveBeenCalledTimes(2)
>   expect((await p).status).toBe(200)
> })
>
> test('abort під час очікування перериває retry', async () => {
>   vi.useFakeTimers()
>   const controller = new AbortController()
>   const fetchImpl = network(503, 200)
>   const p = fetchWithRetry('/a', { signal: controller.signal }, { baseMs: 1000, fetchImpl }).catch((e) => e)
>   await flush()
>   controller.abort()
>   const err = await p
>   expect(err.name).toBe('AbortError')
>   expect(fetchImpl).toHaveBeenCalledTimes(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > Очікування, яке можна скасувати: `new Promise((resolve, reject) => { const t = setTimeout(resolve, ms); signal?.addEventListener('abort', () => { clearTimeout(t); reject(signal.reason); }, { once: true }); })`.
>
> > [!hint]- Підказка 2
> > Розділи «чи можна повторити» на дві функції: для винятку (`AbortError` — ні) і для відповіді (статус).
>
> > [!solution]- Еталонне рішення
> > ```js
> > const IDEMPOTENT = new Set(['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS']);
> > const RETRY_STATUS = (s) => s === 408 || s === 429 || s >= 500;
> >
> > function sleep(ms, signal) {
> >   return new Promise((resolve, reject) => {
> >     if (signal?.aborted) return reject(signal.reason);
> >     const t = setTimeout(resolve, ms);
> >     signal?.addEventListener('abort', () => { clearTimeout(t); reject(signal.reason); }, { once: true });
> >   });
> > }
> >
> > async function fetchWithRetry(url, init = {}, { retries = 3, baseMs = 200, fetchImpl = fetch } = {}) {
> >   const method = (init.method ?? 'GET').toUpperCase();
> >   const canRetry = IDEMPOTENT.has(method);
> >
> >   for (let attempt = 0; ; attempt++) {
> >     let res;
> >     try {
> >       res = await fetchImpl(url, init);
> >     } catch (err) {
> >       const aborted = err.name === 'AbortError' || init.signal?.aborted;
> >       if (aborted || !canRetry || attempt >= retries) throw err;
> >       await sleep(Math.random() * baseMs * 2 ** attempt, init.signal);
> >       continue;
> >     }
> >     if (!canRetry || !RETRY_STATUS(res.status) || attempt >= retries) return res;
> >
> >     const retryAfter = Number(res.headers.get('Retry-After'));
> >     const delay = Number.isFinite(retryAfter) && retryAfter > 0
> >       ? retryAfter * 1000
> >       : Math.random() * baseMs * 2 ** attempt;
> >     await res.body?.cancel(); // звільнити з'єднання — тіло не потрібне
> >     await sleep(delay, init.signal);
> >   }
> > }
> > ```
> >
> > Jitter («повний», як радить AWS Architecture Blog) не дає тисячам клієнтів повторювати синхронно після збою сервера. `Retry-After` може бути й датою — для повноти розбирай `Date.parse`. `POST` безпечно повторювати лише з ключем ідемпотентності на сервері.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Fetch](https://javascript.info/fetch) — базове API з прикладами; там же розділи про CORS і abort.
- 🟢 [MDN — Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — запити, тіла, помилки, стріми.
- 🟡 [MDN — Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — прості запити, preflight, credentials.
- 🟡 [Jake Archibald — How to win at CORS](https://jakearchibald.com/2021/cors/) — найглибше людське пояснення CORS з інтерактивним «плейграундом».
- 🟡 [web.dev — Prevent unnecessary network requests with the HTTP Cache](https://web.dev/articles/http-cache) — практична стратегія кешування.
- 🟡 [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) — свіжість, ревалідація, евристики.
- 🟡 [web.dev — SameSite cookies explained](https://web.dev/articles/samesite-cookies-explained) — `Strict`, `Lax`, `None` на прикладах.
- 🔴 [Fetch Standard — CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) — першоджерело алгоритму CORS.
- 🔴 [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111) — специфікація кешування HTTP.

> [!important] Підсумок
> - `fetch` відхиляється лише без відповіді (мережа, CORS, скасування); 4xx/5xx — перевіряй `res.ok`; тіло читається один раз.
> - Скасування й таймаути — сигналами: `AbortController`, `AbortSignal.timeout`, `AbortSignal.any`.
> - Кеш: `max-age` — свіжість, `no-cache` — завжди ревалідувати, `no-store` — не зберігати; `ETag` + `304` економить трафік; хешовані асети — `immutable`.
> - CORS дозволяє **читати** крос-origin відповіді; не простий запит → preflight `OPTIONS`; credentials → конкретний origin + `Allow-Credentials`.
> - Сесійна cookie: `HttpOnly; Secure; SameSite`; SSE — для потоку сервер → клієнт, WebSocket — для дуплексу; HTTP/2–3 прозорі для `fetch`.

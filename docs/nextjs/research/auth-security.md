# Research: `auth-security` — Auth і безпека (теми 26–30)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = `https://nextjs.org/docs/app/` +
> шлях без числових префіксів. `(не звірено з docs 16.3.8)` — не знайдено в бандлі (бібліотеки, OWASP, CVE).

## 1. Карта понять за темами

### 26 — Сесії й cookies
1. Stateless сесія: підписаний/зашифрований токен у cookie (JWT/JWE, iron-session); переваги — без БД; мінуси — відкликання, розмір cookie.
2. Database сесія: у cookie лише ID сесії, стан у БД/Redis; можна відкликати; запит до сховища.
3. Атрибути cookie: `HttpOnly`, `Secure`, `SameSite=Lax|Strict|None`, `Path`, `Expires/Max-Age`, префікси `__Host-`/`__Secure-` (MDN).
4. `cookies()` (`next/headers`) — **async**; читати в Server Components; `set/delete` — тільки в Server Functions і Route Handlers, не під час рендеру Server Component (`04-functions/cookies.md`).
5. `cookies.set/delete` у Server Action автоматично ререндерить поточну сторінку і інвалідує Client Cache.
6. Ротація сесії при логіні/підвищенні привілеїв (session fixation), ковзне продовження, logout = видалити cookie + запис у БД.
7. Під Cache Components: читання сесії — request-time → лише в `<Suspense>`; не на верху layout.

### 27 — Автентифікація
1. Потік: форма → Server Action → валідація → перевірка пароля (bcrypt/argon2) → створення сесії → `redirect`.
2. Бібліотеки (з docs `02-guides/authentication.md#auth-libraries`): Auth.js, Better Auth, Clerk, Kinde, Supabase, Stack Auth, WorkOS та ін. `(точний список — не переписувати, звірити перед публікацією)`.
3. **Proxy — лише оптимістична перевірка**: читати сесію з cookie, **без БД** (Proxy виконується на кожен маршрут, включно з prefetch). Docs рекомендують для auth запускати Proxy на всіх маршрутах.
4. Proxy — Node.js runtime; перевірити сумісність auth-бібліотеки.
5. **DAL** (`'server-only'`): `verifySession()` загорнутий у `React.cache`, повертає мінімальний об'єкт; перевірки — біля даних.
6. Layouts не перерендерюються при навігації → **auth-перевірка в layout не захищає вкладені сторінки**; перевіряти в page/DAL.
7. З Cache Components: `getCurrentUser()` через `'use cache: private'` (може читати cookies; кеш лише в браузері) або читати cookie і передавати `userId` у `use cache`.

### 28 — Авторизація
1. Authn (хто) ≠ authz (що можна з цим ресурсом). RBAC, ABAC, ownership-перевірки.
2. Перевірка в кожному entry point: Server Component (render), Server Action, Route Handler. Сторінка ≠ дія: перевірка сторінки не поширюється на дії.
3. IDOR: брати `id` ресурсу + зміну, власника — із сесії; запит з `WHERE owner = session.userId`.
4. `forbidden()` (403) / `unauthorized()` (401) — experimental (`experimental.authInterrupts`), UI у `forbidden.js`/`unauthorized.js`.
5. Multi-tenant: tenant з host/path (Proxy rewrite), перевірка членства в DAL, tenant у ключі кешу.
6. **Auth + Cache Components**: не кешувати дані користувача у спільний кеш без ключа; cached-функцію з `userId` тримати неекспортованою; експортований геттер сам резолвить користувача; теги/ключі — plain text, тож не email/токени.
7. Activity зберігає локальний стан між користувачами — logout через `window.location.href` або `key={userId}`.

### 29 — Безпека даних
1. Три підходи до даних (`02-guides/data-security.md`): зовнішній HTTP API (Zero Trust), DAL (рекомендовано для нових), component-level (лише прототипи).
2. **DTO**: повертати тільки потрібні поля; приховані поля — ніколи не в props Client Component чи return дії.
3. `import 'server-only'` — помилка збірки, якщо модуль потрапив у клієнтський граф; `'client-only'` — навпаки.
4. **Taint API** (`experimental.taint: true`): `experimental_taintObjectReference`, `experimental_taintUniqueValue`; вмикає React experimental-канал для `app`; таинтить сам об'єкт `process.env` (але не окремі змінні і не копію `{...process.env}`); трекінг лише за посиланням; похідні значення не таинтяться. Docs: «не покладатися як на єдиний механізм».
5. Env: `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`; порядок завантаження; `NEXT_PUBLIC_*` **інлайниться в бандл на build**; серверні — тільки на сервері; читати runtime-значення — `await connection()` перед `process.env` (інакше може «запектись» у static prerender).
6. `serverRuntimeConfig`/`publicRuntimeConfig` **видалені в 16** → env vars.
7. Помилки в production: повідомлення Server Component помилок замінюються на generic + `digest`.
8. Аудит: `'use server'`-файли, `'use client'`-файли з props з сервера, `/api`, dynamic routes (`data-security.md#auditing`).

### 30 — Веб-безпека
1. **CSP з nonce**: Proxy генерує nonce → заголовок `Content-Security-Policy` + `x-nonce`; Next.js парсить CSP і автоматично ставить nonce на свої скрипти; читати через `headers()`.
2. Nonce ⇒ **усі сторінки динамічні**: static optimization, ISR, CDN-кеш, **PPR несумісні**. Альтернатива — CSP без nonce або **SRI** (`experimental.sri.algorithm: 'sha256'|'sha384'|'sha512'`, хеші скриптів на build).
3. XSS: React екранує, небезпечні місця — `dangerouslySetInnerHTML`, `href={userUrl}` (`javascript:`), `router.push(userUrl)`, JSON-LD без екранування `<`.
4. CSRF: Server Actions — POST + Origin/Host; Route Handlers — **власний** захист (SameSite, токени, перевірка Origin).
5. SSRF: `next/image` з 16 блокує оптимізацію локальних IP (`images.dangerouslyAllowLocalIP`), `maximumRedirects: 3`, `localPatterns.search`; власні фетчі за URL від користувача — allowlist.
6. Rate limiting (Upstash, Vercel WAF/Firewall) — `02-guides/backend-for-frontend.md#rate-limiting`.
7. Security headers у `next.config` `headers()`: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors` (через CSP).
8. `poweredByHeader: false`.
9. OWASP Top 10 (2021; існує й 2025-редакція) — Broken Access Control #1 `(не звірено з docs 16.3.8)`.
10. CVE-2025-29927 (обхід middleware через `x-middleware-subrequest`, виправлено в 12.3.5/13.5.9/14.2.25/15.2.3) — урок «middleware не межа безпеки» `(не звірено з docs 16.3.8)`.

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| Stateless vs database sessions, DAL, DTO, Proxy optimistic checks | `02-guides/authentication.md` |
| Proxy: лише cookie, без БД (бо prefetch); рекомендовано на всіх маршрутах для auth | `authentication.md#optimistic-checks-with-proxy-optional` |
| Server Functions — POST на маршрут; matcher може тихо прибрати покриття | `03-file-conventions/proxy.md#execution-order` |
| Auth з CC: `'use cache: private'` для сесії, Suspense, `updateTag` після зміни, plain-text ключі/теги | `02-guides/authentication-with-cache-components.md` |
| Сторінкова перевірка не поширюється на дії; IDOR | `02-guides/data-security.md#authentication-and-authorization` |
| `experimental.taint` + caveats | `05-config/01-next-config-js/taint.md` |
| `server-only` / `client-only` | `data-security.md#preventing-client-side-execution-of-server-only-code` |
| CSP nonce: Proxy → `Content-Security-Policy` + `x-nonce`; потрібен dynamic; PPR несумісний; `connection()` для форсування | `02-guides/content-security-policy.md` |
| SRI: `experimental.sri` | там само |
| `forbidden`/`unauthorized` experimental; `authInterrupts` | `04-functions/forbidden.md`, `05-config/.../authInterrupts.md` |
| `images.dangerouslyAllowLocalIP`, `images.maximumRedirects` (default 3), `localPatterns.search` | `02-guides/upgrading/version-16.md#nextimage-changes` |
| `images.domains` deprecated → `remotePatterns` | там само |
| `serverRuntimeConfig`/`publicRuntimeConfig` видалені | `version-16.md#runtime-configuration` |
| `NEXT_PUBLIC_` бандлиться на build; `connection()` для runtime env | `02-guides/environment-variables.md`, `version-16.md` |
| `router.push('javascript:...')` — XSS | `04-functions/use-router.md` |
| Proxy `NextResponse.next({ request: { headers } })` vs `{ headers }` (заголовки клієнту) | `proxy.md#setting-headers` |
| `error.message` для Server Components у prod — generic + `digest` | `03-file-conventions/error.md` |
| CSRF Server Actions, `allowedOrigins`, ліміт 1MB | `02-guides/server-actions.md#security` |

## 3. Було → стало
| До | Зараз |
|---|---|
| `middleware.ts` (Edge) як «auth guard» | `proxy.ts` (Node), явно «оптимістично»; перевірки в DAL |
| `getServerSession` у `getServerSideProps` (Pages) | DAL + Server Components + перевірка в кожній дії |
| `publicRuntimeConfig` | `NEXT_PUBLIC_*` (build) або `connection()` + `process.env` |
| `images.domains` | `images.remotePatterns` (+ 16: захист від локальних IP і редиректів) |
| Перевірка в layout «захищає сегмент» | Layout не перерендерюється — перевірка в page/DAL |
| Сесія в кожному компоненті (`cookies()` всюди) | CC: один `getCurrentUser` у `use cache: private`, Promise через контекст + `use()` |

## 4. Пастки і продакшн-проблеми
- **Auth тільки в Proxy або layout** — обхід через прямий POST на дію або навігацію в межах layout.
- **Запит до БД у Proxy** — на кожен prefetch, затримка і навантаження.
- **Кешування персональних даних** в `use cache` без userId у ключі, або з експортованою функцією `getNotes(userId)` → IDOR.
- **PII/секрети в ключах кешу чи тегах** — plain text у Redis.
- **Передача повного `user` у Client Component** — `passwordHash`, `stripeCustomerId` у HTML (RSC payload видно у view-source).
- **`NEXT_PUBLIC_` для секрету** — потрапляє в JS назавжди (і в кеш CDN).
- **Env «запікся» в статичну сторінку** на build — runtime-зміна не діє.
- **Taint як єдиний захист** — копія/похідне значення не таинтиться.
- **CSP з nonce і очікування PPR/ISR** — несумісно; або dynamic, або SRI/хеші.
- **`unsafe-inline`/`unsafe-eval` у prod** «щоб запрацювало» — CSP марна; `'unsafe-eval'` потрібен **лише в dev** (React debug-стеки), `content-security-policy.md`.
- **Route Handler без CSRF-захисту** для мутацій з cookie-сесією.
- **Open redirect**: `redirect(searchParams.next)` без allowlist.
- **SSRF** у власному «proxy зображень» або вебхук-тестері.
- **Activity**: чернетка попереднього користувача після logout через клієнтську навігацію.
- **Різні `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` на інстансах** — збої дій.

## 5. Interview angles
1. **Чому Proxy — не межа безпеки?** Оптимістичні перевірки, matcher, Server Functions на маршруті сторінки, CVE-2025-29927; перевірки біля даних.
2. **Stateless vs database сесії.** Відкликання, розмір, ротація, вартість.
3. **Що таке DAL і DTO і як вони захищають?** Централізація authn/authz, `server-only`, мінімальні поля.
4. **Як захищені Server Actions від CSRF і чого це не покриває?** POST + Origin/Host + SameSite; не покриває authz, IDOR, rate limit.
5. **CSP з nonce у Next.js: як і яка ціна?** Proxy, автоматичне проставлення, dynamic для всіх сторінок, несумісність з PPR; SRI як альтернатива.
6. **Як не злити секрет у клієнт?** `server-only`, DTO, без `NEXT_PUBLIC_`, taint як додатковий шар, аудит `'use client'` props.
7. **Auth з Cache Components.** `use cache: private` vs передача `userId` у `use cache`; Suspense; `updateTag`; prefetch per-session App Shell.
8. **IDOR у Server Action — як виглядає і як виправити?**
9. **SSRF у `next/image`** — що змінилось у 16 (локальні IP, редиректи, `localPatterns.search`).
10. **401 vs 403 у Next.js** — `unauthorized()`/`forbidden()` (experimental) або `redirect('/login')`.

## 6. Що може перевірити раннер
1. **Парсер/серіалізатор `Set-Cookie`**: `serializeCookie(name, value, opts)` з `HttpOnly; Secure; SameSite=Lax; Max-Age`, валідація префікса `__Host-` (Secure, Path=/, без Domain).
2. **Proxy auth-логіка**: `proxy({ pathname, cookies })` → redirect на `/login?next=…` для захищених, `next` для публічних; не редиректити на `/login` циклічно.
3. **Open-redirect guard**: `safeNext(next, origin)` — пропускає лише відносні шляхи того ж origin.
4. **DTO-фільтр / знайди витік**: функція повертає об'єкт у Client props — тест перевіряє відсутність чутливих полів.
5. **Authz-матриця**: `can(user, action, resource)` для ролей + ownership; таблиця тестів.
6. **CSP-білдер**: `buildCsp({ nonce, isDev })` → рядок з `'nonce-…'`, `'strict-dynamic'`, `unsafe-eval` лише в dev.
7. **Генератор nonce** (через `crypto.getRandomValues`, якщо доступний у воркері) — перевірка base64 і унікальності `(перевірити доступність crypto в раннері)`.
8. **Ключ кешу без PII**: функція, що з `user` будує безпечний ключ/тег (id, не email); тест падає на email.
9. **SSRF-allowlist**: `isAllowedRemote(url, remotePatterns)` (протокол, hostname з `*`/`**`, pathname) + блок приватних IP-діапазонів.
10. **Rate limit** sliding window з fake timers.

## 7. Джерела
- https://nextjs.org/docs/app/guides/authentication · …/authentication-with-cache-components · …/data-security · …/content-security-policy · …/environment-variables · …/backend-for-frontend
- https://nextjs.org/docs/app/api-reference/functions/cookies · …/headers · …/forbidden · …/unauthorized · …/connection
- https://nextjs.org/docs/app/api-reference/config/next-config-js/taint · …/authInterrupts · …/serverActions · …/images · …/headers
- https://nextjs.org/blog/security-nextjs-server-components-actions
- https://nextjs.org/blog/cve-2025-29927 `(не звірено з docs 16.3.8)`
- https://react.dev/reference/react/experimental_taintObjectReference · https://react.dev/reference/react/experimental_taintUniqueValue
- https://developer.mozilla.org/docs/Web/HTTP/Cookies · https://developer.mozilla.org/docs/Web/HTTP/CSP · https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity
- https://owasp.org/Top10/ · https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html · …/Authentication_Cheat_Sheet.html · …/Authorization_Cheat_Sheet.html · …/Cross_Site_Scripting_Prevention_Cheat_Sheet.html · …/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html · …/Secrets_Management_Cheat_Sheet.html
- https://authjs.dev · https://www.better-auth.com · https://supabase.com/docs/guides/auth/server-side/nextjs · https://clerk.com/docs `(не звірено з docs 16.3.8)`
- https://github.com/vercel/next.js/tree/canary/examples/with-iron-session-cache-components

## 8. Виправлення до SYLLABUS
1. **Тема 28:** `forbidden`/`unauthorized` — experimental; у SYLLABUS не позначено.
2. **Тема 28:** «auth разом із Cache Components» має окремий офіційний гайд (`authentication-with-cache-components.md`) — зробити його основою теми; ключові ідеї: `use cache: private` для сесії, неекспортовані cached-функції, plain-text ключі/теги.
3. **Тема 29:** додати видалення `serverRuntimeConfig/publicRuntimeConfig` (16) і `connection()` для runtime env; точні caveats taint (`process.env` таинтиться лише як об'єкт).
4. **Тема 30:** додати SRI (`experimental.sri`) як альтернативу nonce і **несумісність nonce з PPR/ISR** — критичний компроміс для курсу, що вчить Cache Components.
5. **Тема 30:** SSRF-захисти `next/image` з 16 (`dangerouslyAllowLocalIP`, `maximumRedirects`, `localPatterns.search`).
6. **Тема 27:** «proxy-перевірка проти DAL» — додати факт, що layout не перерендерюється (перевірка в layout не захищає), і що Proxy без БД через prefetch.
7. **§1 `auth-security`:** додати `authInterrupts`, SRI, Activity-скидання стану при зміні користувача.

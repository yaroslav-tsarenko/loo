---
title: proxy.ts, redirects і rewrites
id: nextjs-core-06
slug: 06-proxy-redirects-rewrites
order: 6
level: middle
skill: routing
icon: px:traffic
tags: [nextjs, routing, proxy, middleware, matcher, redirects, rewrites, headers, next-config]
prerequisites: ["[[Next.js - 01. App Router, сегменти і спеціальні файли]]", "[[Next.js - 03. Динамічні маршрути]]"]
estimatedMinutes: 55
nextVersion: 16.3.8
---

# proxy.ts, redirects і rewrites

> [!success] 🎯 Після цього розділу ти зможеш
> - назвати порядок, у якому Next.js обробляє запит: `headers` → `redirects` → proxy → `beforeFiles` → файли → `afterFiles` → динамічні маршрути → `fallback`;
> - написати `proxy.ts` з правильним `matcher`: шаблони `:param*`, regex, негативний lookahead для статики, `has` / `missing`;
> - використати `NextResponse.next()`, `redirect()` і `rewrite()`, передати заголовок серверу (а не браузеру) і поставити cookie;
> - пояснити, чому proxy — лише **оптимістична** перевірка, а справжній захист живе біля даних;
> - налаштувати `redirects`, `rewrites` і `headers` у `next.config.ts` і знати, чим `beforeFiles` відрізняється від `afterFiles`;
> - для кожного редиректу обрати місце: конфіг, proxy чи `redirect()` / `permanentRedirect()` — і передбачити статус-код.

## 🤔 Передбач

> [!quiz] Що отримає браузер?
> level: middle · type: output · id: nextjs-core-06-quiz-01
>
> ```ts
> // next.config.ts
> const nextConfig: NextConfig = {
>   async redirects() {
>     return [{ source: '/blog/:slug', destination: '/news/:slug', permanent: false }]
>   },
> }
> ```
>
> ```ts
> // proxy.ts
> export function proxy(request: NextRequest) {
>   if (request.nextUrl.pathname.startsWith('/blog')) {
>     return NextResponse.rewrite(new URL('/legacy-blog', request.url))
>   }
> }
> ```
>
> Користувач відкриває `/blog/hello`.
>
> - [x] `307` з `location: /news/hello`; proxy для `/blog/hello` не виконується взагалі
> - [ ] `200` зі сторінкою `/legacy-blog`: proxy — код, а код сильніший за конфіг
> - [ ] `308` на `/news/hello`: редиректи з конфігу завжди постійні
> - [ ] Помилка збірки: один шлях не можна обробляти і в конфігу, і в proxy
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `redirects` з `next.config` перевіряються **до** proxy, тож запит на `/blog/hello` одразу отримує редирект. `permanent: false` дає `307`. Proxy виконається вже для наступного запиту — на `/news/hello`, і там умова `startsWith('/blog')` не спрацює.

## 🧒 Простими словами

Уяви бізнес-центр. Табличка на дверях «Бухгалтерія переїхала на 5-й поверх» — це `redirects` у конфігу: однакова для всіх і змінюється лише з ремонтом (деплоєм). За дверима — **охоронець на рецепції**, тобто proxy. Він бачить кожного, дивиться на перепустку (cookie) і мову, може розвернути людину («вам на 3-й»), тихо провести в інший кабінет під тією самою вивіскою (rewrite) або дати бейдж для працівників (заголовок запиту). Паспорт у базі він не перевіряє — лише чи є перепустка. Справжню перевірку робить кабінет із документами, тобто код біля даних. А «вашу справу передали в інший відділ» уже в кабінеті — це `redirect()` у сторінці чи Server Action.

## 🔬 Як це працює насправді

### 🧭 Три місця, де можна перехопити запит

У Next.js є три рівні, на яких запит можна перенаправити, переписати чи доповнити заголовками:

1. **`next.config.ts`** — `headers`, `redirects`, `rewrites`. Декларативні правила за шаблоном шляху (плюс умови на заголовки, cookie, query). Обчислюються під час збірки, виконуються найраніше, нічого не знають про сесію чи базу.
2. **`proxy.ts`** — функція, яка виконується на сервері **перед** рендером кожного маршруту, що підпадає під `matcher`. Бачить увесь запит і може повернути редирект, rewrite, змінені заголовки або власну відповідь.
3. **`redirect()` / `permanentRedirect()`** — функції з `next/navigation`, які викликають у Server Components, Server Functions (Server Actions) і Route Handlers, коли рішення залежить від даних.

Порядок, у якому Next.js проходить ці рівні для кожного запиту, — головне, що треба запамʼятати з теми:

| Крок | Що | Що може зробити |
|---|---|---|
| 1 | `headers` з `next.config` | додати заголовки до відповіді |
| 2 | `redirects` з `next.config` | віддати `307` / `308` і зупинитися |
| 3 | proxy | redirect, rewrite, заголовки, cookie, власна відповідь |
| 4 | `rewrites.beforeFiles` | переписати шлях **до** перевірки файлів |
| 5 | файлова система | `public/`, `_next/static`, статичні сторінки й Route Handlers |
| 6 | `rewrites.afterFiles` | переписати шлях, якщо статичного маршруту не знайшлося |
| 7 | динамічні маршрути | `app/blog/[slug]/page.tsx` |
| 8 | `rewrites.fallback` | останній шанс перед 404 |

> [!diagram] Шлях запиту через конфіг, proxy і маршрути
> ```yaml
> layout: flow
> nodes:
>   - { id: req, label: "браузер", text: "GET /pricing", note: "cookie ab=b", tone: gray, icon: "px:monitor" }
>   - { id: cfg, label: "next.config", text: "headers → redirects", note: "збігу в redirects немає", tone: blue }
>   - { id: proxy, label: "proxy.ts", text: "NextResponse.next()", note: "бачить /pricing", tone: violet }
>   - { id: before, label: "beforeFiles", text: "/pricing → /pricing-b", note: "has: cookie ab=b", tone: orange }
>   - { id: fs, label: "маршрути", text: "app/pricing-b/page.tsx", note: "URL у браузері — /pricing", tone: green, icon: "px:file" }
> edges:
>   - { from: req, to: cfg, label: "запит" }
>   - { from: cfg, to: proxy, label: "далі" }
>   - { from: proxy, to: before, label: "next()" }
>   - { from: before, to: fs, label: "rewrite" }
> steps:
>   - { focus: req, note: "Браузер просить /pricing із cookie ab=b — користувач потрапив у групу B експерименту." }
>   - { move: { from: req, to: cfg, value: "/pricing" }, note: "Спершу конфіг: headers додають заголовки до майбутньої відповіді, redirects шукають збіг. Збігу немає — йдемо далі." }
>   - { move: { from: cfg, to: proxy, value: "/pricing" }, note: "Proxy бачить ОРИГІНАЛЬНИЙ шлях /pricing: rewrites з конфігу ще не застосовано." }
>   - { move: { from: proxy, to: before, value: "/pricing" }, note: "beforeFiles: умова has (cookie ab=b) виконалась, шлях переписано на /pricing-b ще до перевірки файлів." }
>   - { move: { from: before, to: fs, value: "/pricing-b" }, note: "Рендериться сторінка /pricing-b, а адреса в браузері лишається /pricing. Без cookie запит дійшов би до app/pricing/page.tsx." }
> ```
> Proxy стоїть між `redirects` і `rewrites`: він бачить запит після редиректів конфігу, але до будь-яких переписувань.

> [!quiz] Перевір себе: склади порядок обробки запиту
> level: middle · type: order · id: nextjs-core-06-quiz-02
>
> ```order
> headers з next.config
> redirects з next.config
> proxy.ts
> rewrites.beforeFiles
> Файли: public/, _next/static, статичні маршрути
> rewrites.afterFiles
> Динамічні маршрути, наприклад app/blog/[slug]
> rewrites.fallback
> Server Action на сторінці — окремий крок перед proxy ✗
> ```
>
> **Пояснення:** конфіг-заголовки й редиректи йдуть першими, далі proxy, далі три групи rewrites навколо пошуку маршруту. Server Action — не окремий крок: це `POST` на маршрут сторінки, і він проходить той самий ланцюжок.

### 🚪 proxy.ts: файл, функція, runtime

**Proxy** — так у Next.js 16 називається колишній Middleware: код, що виконується на сервері до сторінки чи Route Handler. Назва підкреслює роль мережевого шару **перед** застосунком.

Правила файлу:

- Файл `proxy.ts` (або `.js`) лежить **у корені проєкту** або в `src/` — на одному рівні з `app/`. Не в `app/`! Якщо ти змінив `pageExtensions` на `.page.ts`, файл має називатися `proxy.page.ts`.
- **Один файл на проєкт.** Логіку можна розкласти по модулях і імпортувати, але точка входу одна.
- Файл експортує **одну функцію**: іменовану `proxy` або `export default`. Документація радить називати її `proxy` навіть у default-експорті.
- Опціонально — `export const config = { matcher: … }`.
- Proxy **завжди** працює на Node.js runtime. Будь-який route segment config у файлі, навіть `runtime = 'nodejs'`, зупиняє збірку (текст помилки — у розділі про помилки).

Функція отримує `request` (`NextRequest` — звичайний `Request` з доповненнями `nextUrl` і `cookies`) і другим аргументом `event` (`NextFetchEvent` з методом `waitUntil(promise)` для фонової роботи на кшталт логування). Повертає `NextResponse`, звичайний `Response` або нічого — тоді запит іде далі без змін.

Ось proxy, на якому побудуємо всю тему. Магазин має дві мови в URL (`/uk/…`, `/en/…`) і особистий кабінет:

```ts
// lib/i18n.ts
export const locales = ['uk', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'uk'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
```

```ts
// proxy.ts — у корені проєкту, поруч з app/
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, isLocale } from '@/lib/i18n'

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const [, first] = pathname.split('/')

  // 1. Немає мови в URL → редирект на /uk/… (або мову з cookie)
  if (!isLocale(first)) {
    const saved = request.cookies.get('lang')?.value
    const lang = saved && isLocale(saved) ? saved : defaultLocale
    const rest = pathname === '/' ? '' : pathname // інакше /uk/ і ще один 308
    return NextResponse.redirect(new URL(`/${lang}${rest}${search}`, request.url))
  }

  // 2. Оптимістична перевірка: є cookie сесії? (без БД і без розшифрування)
  if (pathname.startsWith(`/${first}/dashboard`) && !request.cookies.has('session')) {
    const login = new URL(`/${first}/login`, request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }

  // 3. Заголовок для сервера (вгору) і заголовок для браузера (у відповідь)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('x-proxy', 'hit')
  response.cookies.set('lang', first, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return response
}

export const config = {
  matcher: [
    // усе, крім API, статики, оптимізатора зображень і метафайлів
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

Що показує `curl` на продакшн-збірці (`next build && next start`):

```text
GET /               → 307  location: /uk
GET /about          → 307  location: /uk/about
GET /uk             → 200  x-proxy: hit · set-cookie: lang=uk
GET /uk/dashboard   → 307  location: /uk/login?from=%2Fuk%2Fdashboard
GET /api/health     → 200  (proxy не виконувався: немає x-proxy)
```

У таблиці маршрутів `next build` proxy видно окремим рядком `ƒ Proxy (Middleware)`.

### 🎯 matcher: де proxy виконується

Без `matcher` proxy виконується на **кожен** запит: сторінки, `_next/static` (JS і CSS), `_next/image`, файли з `public/`. Auth-редирект без matcher легко «захищає» й CSS сторінки логіну — і вона приходить без стилів.

`matcher` — рядок, масив рядків або масив обʼєктів. Шаблони — синтаксис [path-to-regexp](https://github.com/pillarjs/path-to-regexp), той самий, що в `redirects`/`rewrites`:

| Шаблон | Збігається | Не збігається |
|---|---|---|
| `/about` | `/about` | `/about/team`, `/blog/about` |
| `/blog/:slug` | `/blog/a` | `/blog`, `/blog/a/b` |
| `/docs/:path*` | `/docs`, `/docs/a`, `/docs/a/b` | `/doc` |
| `/docs/:path+` | `/docs/a`, `/docs/a/b` | `/docs` |
| `/docs/:path?` | `/docs`, `/docs/a` | `/docs/a/b` |
| `/post/:id(\\d+)` | `/post/42` | `/post/abc` |
| `/about/(.*)` | те саме, що `/about/:path*` | — |

Модифікатори: `*` — нуль або більше сегментів, `+` — один або більше, `?` — нуль або один. Шаблон мусить починатися з `/` і прив'язаний до **всього** шляху.

> [!warning] Розбіжність з документацією: `/about` не ловить `/about/team`
> [Документація proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher) пише, що шаблони «anchored to the start of the path: `/about` matches `/about` and `/about/team`». На 16.3.8 це не так: і `curl` на продакшн-збірці, і `unstable_doesMiddlewareMatch` показують, що `/about` збігається лише з `/about`. У маніфесті збірки шаблон компілюється в регулярний вираз із `$` у кінці. Для вкладених шляхів пиши `/about/:path*`.

**Негативний lookahead** — стандартний спосіб сказати «усе, крім…»:

```ts
// proxy.ts (фрагмент)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

`(?!api|…)` перевіряє, що шлях після `/` **не починається** з жодного варіанта. Саме «не починається» — пастка: `/apiary`, `/api-docs` і `/_next/staticfoo` теж пропустять proxy, бо починаються з `api` чи `_next/static`. Якщо в тебе є сторінка `/apiary` і її треба захищати, пиши `api/` замість `api` або винось API в окремий префікс.

**Обʼєкти в matcher** дають умови на сам запит — ті самі `has` / `missing`, що в конфігу:

```ts
// proxy.ts (фрагмент)
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      // не запускати proxy для prefetch-запитів роутера
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

`has` вимагає, щоб усі умови виконалися, `missing` — щоб жодна. Типи — `header`, `cookie`, `query` (у конфігу ще й `host`); без `value` перевіряється лише наявність ключа, а `value` може бути regex-шаблоном з іменованою групою.

Значення `matcher` **мусять бути константами**: Next.js читає їх статичним аналізом під час збірки, а не виконує файл.

> [!warning] Розбіжність з документацією: змінна в matcher — помилка збірки
> [Документація](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher) обіцяє, що динамічні значення «will be ignored». На 16.3.8 (Turbopack) `matcher: protectedPaths`, де `protectedPaths` — звичайний `const`-масив, зупиняє `next build`: `Next.js can't recognize the exported 'config' field in route. 'matcher' needs to be a static string or array of static strings or array of static objects.` Тихо проігнорованого matcher немає — є червона збірка.

> [!quiz] Перевір себе: де виконається proxy?
> level: middle · type: multi · id: nextjs-core-06-quiz-03
>
> `matcher: ['/about', '/docs/:path*']`. На яких запитах proxy виконається?
>
> - [x] `/about`
> - [ ] `/about/team`
> - [x] `/docs`
> - [x] `/docs/guides/proxy`
> - [ ] `/blog/about`
>
> **Пояснення:** шаблон прив'язаний до всього шляху. `/about` без модифікатора ловить рівно `/about` (так поводиться 16.3.8, хоч документація каже інакше), а `/blog/about` не починається з `/about`. `:path*` — нуль або більше сегментів, тож `/docs` теж підходить.

> [!quiz] Перевір себе: негативний lookahead
> level: middle · type: output · id: nextjs-core-06-quiz-04
>
> `matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']`. Для яких запитів proxy **виконається**?
>
> ```text
> /
> /api/users
> /apiary
> /_next/static/chunks/main.js
> /uk/dashboard
> ```
>
> - [x] Лише `/` і `/uk/dashboard`
> - [ ] `/`, `/apiary` і `/uk/dashboard`
> - [ ] Для всіх, крім `/_next/static/chunks/main.js`
> - [ ] Лише `/uk/dashboard`: `/` порожній шлях і не підпадає під `.*`
>
> **Пояснення:** lookahead перевіряє початок шляху після `/`. `/apiary` починається з `api`, тож теж пропускає proxy — так поводяться і продакшн-сервер, і `unstable_doesMiddlewareMatch`. `/` підходить: `.*` збігається з порожнім рядком.

### ↪️ NextResponse: next, redirect, rewrite

Proxy відповідає одним із чотирьох способів:

| Що повернути | Що станеться | URL у браузері |
|---|---|---|
| нічого / `NextResponse.next()` | запит іде далі по ланцюжку | без змін |
| `NextResponse.redirect(url)` | `307` з `location`; браузер робить новий запит | змінюється |
| `NextResponse.rewrite(url)` | сервер рендерить інший шлях (або проксіює на інший домен) | без змін |
| `Response.json(…)` / `new NextResponse(…)` | власна відповідь, маршрут не рендериться | без змін |

`NextResponse.redirect` за замовчуванням дає `307`; другим аргументом можна передати інший статус (`308`, `303`). URL завжди **абсолютний** — тому `new URL('/uk/login', request.url)`. Зручно брати `request.nextUrl.clone()` чи `new URL(…, request.url)` і змінювати `pathname` / `searchParams`.

> [!diagram] Redirect проти rewrite
> ```yaml
> layout: compare
> columns: { red: "NextResponse.redirect", rew: "NextResponse.rewrite" }
> nodes:
>   - { id: r1, col: red, label: "сервер", text: "307 · location: /uk/about", note: "відповідь без тіла сторінки", tone: orange }
>   - { id: r2, col: red, label: "браузер", text: "новий запит GET /uk/about", note: "ще один round trip", tone: orange, icon: "px:repeat" }
>   - { id: r3, col: red, label: "адресний рядок", text: "/uk/about", note: "користувач бачить нову адресу", tone: blue }
>   - { id: w1, col: rew, label: "сервер", text: "рендерить /uk/pricing-b", note: "у межах того самого запиту", tone: green }
>   - { id: w2, col: rew, label: "браузер", text: "200 одразу", note: "без додаткового запиту", tone: green, icon: "px:check" }
>   - { id: w3, col: rew, label: "адресний рядок", text: "/uk/pricing", note: "справжній шлях прихований", tone: blue }
> steps:
>   - { show: [r1, w1], note: "Redirect каже браузеру «йди туди». Rewrite нічого не каже браузеру: сервер просто рендерить інший маршрут." }
>   - { show: [r2, w2], note: "Після redirect браузер робить другий запит — і proxy виконується знову, вже для нової адреси. Rewrite обходиться одним запитом." }
>   - { show: [r3, w3], note: "Redirect змінює URL (і закладки, і SEO). Rewrite маскує: A/B-варіант, мультитенантність, поступова міграція." }
> ```
> Обирай redirect, коли користувач **має** побачити нову адресу; rewrite — коли адреса має лишитися.

Redirect у proxy дає ще один повний запит — і proxy виконається вдруге, вже для нової адреси. Тому умова редиректу не повинна спрацьовувати на цільовій адресі, інакше вийде нескінченний цикл: «немає сесії → `/login`», а `/login` теж під тим самим правилом. У нашому proxy перевірка обмежена `/dashboard`, і логін її не зачіпає.

### 📮 Заголовки й cookie: кому вони йдуть

Найчастіша помилка з заголовками в proxy — переплутати **напрямок**:

```ts
// proxy.ts (фрагмент)
const requestHeaders = new Headers(request.headers)
requestHeaders.set('x-pathname', pathname)

// ✅ заголовок їде ВГОРУ — до сторінки, Route Handler, Server Action
const response = NextResponse.next({ request: { headers: requestHeaders } })

// ✅ заголовок їде ВНИЗ — у відповідь браузеру
response.headers.set('x-proxy', 'hit')

// ❌ NextResponse.next({ headers: requestHeaders }) — усі заголовки запиту,
//    разом з cookie й authorization, полетять браузеру у відповіді
```

`NextResponse.next({ request: { headers } })` підміняє заголовки **запиту**, які далі прочитає `headers()` у Server Component. `NextResponse.next({ headers })` — це скорочення для заголовків **відповіді**, і документація прямо називає його поганою практикою: окрім витоку, можна перезаписати `Content-Type`, від якого залежать Server Actions і стрімінг. Ще одна порада звідти ж: не копіюй усі вхідні заголовки, а збирай білий список — інакше внутрішні `x-*` і `authorization` можуть потрапити в сторонній сервіс, куди ти робиш rewrite.

Сторінка читає заголовок від proxy через `headers()`:

```tsx
// app/[lang]/dashboard/page.tsx
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

async function Dashboard({ lang }: { lang: string }) {
  const session = await getSession() // справжня перевірка — тут, біля даних
  if (!session) redirect(`/${lang}/login`)
  const pathname = (await headers()).get('x-pathname') // заголовок від proxy
  return <p>Привіт, {session.userId}! Шлях з proxy: {pathname}</p>
}

export default async function DashboardPage({ params }: PageProps<'/[lang]/dashboard'>) {
  const { lang } = await params
  return (
    <>
      <h1>Кабінет</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Dashboard lang={lang} />
      </Suspense>
    </>
  )
}
```

`headers()` і `cookies()` — Request-time APIs: під `cacheComponents` компонент, що їх читає, мусить бути в `<Suspense>` (чому — тема 10 основного посібника, як це стрімиться — тема 11 основного посібника).

**Cookie** — це ті самі заголовки (`Cookie` у запиті, `Set-Cookie` у відповіді), але з зручним API. `request.cookies` має `get`, `getAll`, `has`, `set`, `delete`, `clear`; `response.cookies` — `get`, `getAll`, `set`, `delete`. У нашому proxy `response.cookies.set('lang', first, …)` запамʼятовує мову, і наступний захід на `/` веде вже на неї. Curl показує це як `set-cookie: lang=uk; Path=/; … Max-Age=31536000`.

> [!quiz] Перевір себе: заповни proxy, що передає заголовок сторінці
> level: middle · type: fill · bank: headers, rewrite, redirect · id: nextjs-core-06-quiz-05
>
> ```ts fill
> // proxy.ts
> import { NextResponse } from 'next/server'
> import type { NextRequest } from 'next/server'
>
> export function [[proxy]](request: NextRequest) {
>   const requestHeaders = new Headers(request.headers)
>   requestHeaders.set('x-pathname', request.nextUrl.pathname)
>   return NextResponse.[[next]]({ [[request]]: { headers: requestHeaders } })
> }
>
> export const [[config]] = {
>   [[matcher]]: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
> }
> ```
>
> **Пояснення:** функцію називають `proxy` (або експортують за замовчуванням). `NextResponse.next({ request: { headers } })` відправляє заголовки вгору — до сторінки, а не браузеру. Конфіг — іменований експорт `config` з полем `matcher`. `rewrite` і `redirect` тут зайві: ми лише доповнюємо запит.

### 🧱 Чого proxy робити не повинен

Proxy виконується на **кожен** запит, що підпадає під matcher, включно з prefetch-запитами `<Link>` (тема 04 основного посібника): кожне посилання у видимій частині екрана — ще один виклик proxy. Звідси правила з документації:

- **Без повільних даних.** Ніяких запитів до БД і зовнішніх API «на кожен запит». `fetch` у proxy працює, але `cache`, `next.revalidate` і `next.tags` у ньому **нічого не роблять** — кешу тут немає.
- **Лише оптимістичні перевірки.** Proxy може подивитися, чи **є** cookie сесії (чи розшифрувати stateless-токен без походу в базу), і відправити гостя на `/login`. Але він не вирішує, чи можна цьому користувачеві редагувати це замовлення. Перевірка доступу — біля даних: у Data Access Layer, у кожній Server Action, у Route Handler.
- **Без спільного стану.** Proxy може виконуватися окремо від коду рендеру (в оптимізованих розгортаннях — навіть на CDN), тож не покладайся на глобальні змінні чи спільні модулі як на канал до сторінок. Передавай дані заголовками, cookie, rewrite чи URL.

Чому не можна покладатися на proxy як на захист? Три причини.

**Matcher — це не межа безпеки.** Server Functions не є окремими маршрутами в ланцюжку: це `POST` на той маршрут, де їх використовують. Документація попереджає: якщо matcher виключає шлях, він виключає й усі Server Actions на цьому шляху. Рефакторинг, що переносить форму на іншу сторінку, або зміна matcher тихо прибирає «захист». У нашому прикладі форма логіну відправляється `POST /uk/login` — це видно і в HTML (`<form action="" method="POST">`), і в `curl`.

**Кодові шляхи обходу бувають.** У березні 2025 року в Next.js знайшли вразливість CVE-2025-29927 (критична, CVSS 9.1): зовнішній запит із внутрішнім заголовком `x-middleware-subrequest` змушував сервер **пропустити middleware повністю**. Застосунки, які перевіряли доступ лише в middleware, віддавали захищені сторінки всім. Вразливі були self-hosted версії від 11.1.4 до 12.3.5 / 13.5.9 / 14.2.25 / 15.2.3 у відповідних гілках (у цих версіях виправлено); розгортання на Vercel були захищені автоматично. Застосунки з перевіркою біля даних нічого не втратили.

**Сторінка без перевірки — відкрита.** Proxy можна вимкнути (видалити файл, змінити matcher, перейменувати шлях), а сторінка лишиться як є. Тому в нашому кабінеті `getSession()` перевіряє сесію ще раз — і перевіряє по-справжньому:

```ts
// lib/session.ts — DAL: справжня перевірка біля даних
import 'server-only'
import { cookies } from 'next/headers'

export async function getSession() {
  const token = (await cookies()).get('session')?.value
  // у реальному коді — розшифрувати й перевірити підпис/термін дії
  return token === 'valid' ? { userId: 'u1' } : null
}
```

`curl -b "session=forged" /uk/dashboard`: proxy бачить cookie й пропускає, але `getSession()` повертає `null`, і сторінка редиректить. Сесії й cookie — тема 26 основного посібника, автентифікація та «proxy проти DAL» — тема 27 основного посібника.

**Ліміт тіла запиту.** Коли proxy є в застосунку, Next.js клонує тіло запиту й буферизує його в памʼяті, щоб його можна було прочитати двічі — у proxy і в Route Handler. Ліміт буфера — `experimental.proxyClientMaxBodySize` (за замовчуванням **10 МБ**):

```ts
// next.config.ts (фрагмент)
const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: '1mb', // або число в байтах
  },
}
```

Понад ліміт запит **не падає**: Route Handler отримує лише перший 1 МБ, а в лог сервера йде попередження. На 16.3.8 `POST` на 2 МБ дав `{"received":1048576}` і такий рядок у лозі:

```text
Request body exceeded 1MB for /api/upload. Only the first 1MB will be available unless configured. See https://nextjs.org/docs/app/api-reference/config/next-config-js/middlewareClientMaxBodySize for more details.
```

Посилання в повідомленні ще зі старою назвою опції — актуальна сторінка називається `proxyClientMaxBodySize`. Для великих завантажень краще не ганяти файл через сервер узагалі (тема 25 основного посібника), а якщо ганяєш — виключи цей маршрут з matcher або підніми ліміт.

> [!quiz] Перевір себе: де перевіряти доступ?
> level: middle · id: nextjs-core-06-quiz-06
>
> Proxy редиректить гостей з `/dashboard/:path*` на `/login`. Форма «Змінити email» з Server Action `updateEmail` лежить на `/settings`, яку matcher не покриває. Що зробити?
>
> - [ ] Додати `/settings` у matcher — тоді Server Action захищена
> - [x] Перевіряти сесію й права всередині `updateEmail` (через DAL), а proxy лишити для редиректу гостей
> - [ ] Нічого: Server Actions мають власний ендпоінт, і proxy для них не потрібен
> - [ ] Перенести перевірку сесії з proxy у `next.config` `redirects` з `has: cookie`
>
> **Пояснення:** додати шлях у matcher — краще, ніж нічого, але це той самий крихкий захист: наступний рефакторинг знову його прибере. Server Action — це `POST` на маршрут сторінки, а не окремий ендпоінт. `has: cookie` перевіряє лише наявність cookie, а не її справжність. Перевірка біля даних працює незалежно від matcher.

### 🔁 middleware.ts → proxy.ts

До Next.js 16 той самий файл називався `middleware.ts` і за замовчуванням працював на Edge runtime. У 16 його перейменували: назва «middleware» плутала з Express і заохочувала тягнути в цей шар забагато логіки, а документація тепер прямо називає proxy «останнім засобом». Функціональність та сама.

| Було (≤ 15) | Стало (16) |
|---|---|
| `middleware.ts`, `export function middleware()` | `proxy.ts`, `export function proxy()` |
| Edge runtime за замовчуванням, Node.js — опційно (стабільно з 15.5) | лише Node.js; `runtime` у файлі — помилка збірки |
| `skipMiddlewareUrlNormalize` | `skipProxyUrlNormalize` |

Міграція — codemod, який перейменовує і файл, і функцію:

```bash
npx @next/codemod@canary middleware-to-proxy .
```

На 16.3.8 старий `middleware.ts` **ще працює**, але збірка попереджає:

```text
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
  To migrate automatically, run:
  npx @next/codemod@canary middleware-to-proxy .
```

І збирається він, як і раніше, для Edge (у `.next/server/middleware-manifest.json` — чанки з `server/edge/`). Документація з оновлення до 16 так і радить: якщо тобі потрібен саме Edge runtime, лишайся поки що на `middleware`. Обидва файли одночасно — помилка збірки: `Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected. Please use "./proxy.ts" only.`

> [!quiz] Перевір себе: що правда про proxy у Next.js 16?
> level: middle · type: multi · id: nextjs-core-06-quiz-07
>
> - [x] Proxy завжди працює на Node.js runtime
> - [ ] Щоб proxy працював на Edge, досить `export const runtime = 'edge'` у `proxy.ts`
> - [x] Функцію можна експортувати як `export default` — працює так само, як іменована `proxy`
> - [ ] Можна мати `proxy.ts` у корені й ще один у `app/admin/` для адмінки
> - [x] `middleware.ts` на 16.3.8 ще збирається, але з попередженням про застарілість
> - [ ] `fetch` у proxy з `next: { revalidate: 60 }` кешує відповідь на хвилину
>
> **Пояснення:** proxy-файл один на проєкт і лише на Node.js: будь-який route segment config у ньому зупиняє збірку. `middleware.ts` ще живий заради Edge, але застарів. Опції кешу `fetch` у proxy ігноруються.

### ⚙️ redirects, rewrites і headers у next.config.ts

Коли правило залежить лише від шляху (і, можливо, заголовка, cookie, query чи host), досить конфігу — так радить і документація.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'X-Frame-Options', value: 'DENY' }, { key: 'x-hello', value: 'all' }] },
      { source: '/about', headers: [{ key: 'x-hello', value: 'about' }] },
    ]
  },
  async redirects() {
    return [
      { source: '/old-blog/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/blog/:slug', destination: '/news/:slug', permanent: false, has: [{ type: 'query', key: 'v', value: '2' }] },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/pricing', destination: '/pricing-b', has: [{ type: 'cookie', key: 'ab', value: 'b' }] },
      ],
      afterFiles: [
        { source: '/about', destination: '/pricing-b' },
        { source: '/team', destination: '/about/team' },
      ],
      fallback: [{ source: '/:path*', destination: '/legacy/:path*' }],
    }
  },
}

export default nextConfig
```

Це окремий навчальний застосунок із маршрутами `app/pricing`, `app/pricing-b`, `app/about`, `app/about/team`, `app/blog/[slug]` і `app/legacy/[[...path]]`. Розберемо, що він робить.

**`redirects`.** Кожне правило — `source`, `destination` і `permanent`. `permanent: true` дає **`308`** (браузери й пошуковики кешують назавжди), `false` — **`307`**. Чому не `301`/`302`: старі коди дозволяють браузеру змінити `POST` на `GET`, а `307`/`308` зберігають метод. Для старих клієнтів є `statusCode` замість `permanent` (але не обидва). Параметри з `source` підставляються в `destination`, а query **передається далі** сам: `/blog/a?v=2` → `307 location: /news/a?v=2`. Для `308` Next.js ще й додає заголовок `Refresh: 0;url=…` (сумісність із IE11):

```text
GET /old-blog/a   → 308  location: /blog/a · Refresh: 0;url=/blog/a
GET /blog/a?v=2   → 307  location: /news/a?v=2
GET /blog/a       → 200  (умова has: query v=2 не виконалась)
```

Платформи обмежують кількість правил (на Vercel — 1024 редиректи); для тисяч документація радить proxy з мапою у сховищі й Bloom-фільтром.

**`rewrites`.** Масив правил застосовується як `afterFiles`. Обʼєкт із трьома масивами дає повний контроль:

- `beforeFiles` — **до** перевірки файлів і сторінок, тож може перекрити навіть наявну сторінку. Наш A/B-тест: з cookie `ab=b` запит на `/pricing` рендерить `/pricing-b`, хоча `app/pricing/page.tsx` існує. Правила `beforeFiles` перевіряються всі по черзі: після збігу Next.js не йде одразу у файли.
- `afterFiles` — **після** статичних сторінок і файлів, але **до** динамічних маршрутів. Правило `/about → /pricing-b` не спрацює ніколи: `app/about/page.tsx` знаходиться раніше. А `/team → /about/team` працює, бо сторінки `/team` немає.
- `fallback` — після всього, включно з динамічними маршрутами, перед 404. Класика поступової міграції: «усе, чого ще немає в Next.js, проксіювати на старий сайт». У прикладі `/nothing/deep` рендерить `legacy:nothing/deep`, а `/blog/zzz` дістається динамічному `app/blog/[slug]`, бо він перевіряється раніше за `fallback`.

`destination` може бути зовнішнім URL (`https://legacy.example.com/:path*`) — тоді Next.js працює як зворотний проксі. Якщо параметр з `source` не використано в `destination`, він передається в query. Важлива деталь для теми 16 основного посібника: `revalidatePath` при rewrites треба викликати з **destination**, а не з адресою в браузері.

**`headers`.** Заголовки відповіді за шаблоном. Якщо кілька правил ставлять той самий ключ, **виграє останнє**: `/about` отримує `x-hello: about`, решта — `x-hello: all`. `Cache-Control` для незмінних хешованих файлів (`_next/static`, статичні імпорти зображень) Next.js ставить сам, і перевизначити його не можна. Security-заголовки на зразок CSP — тема 30 основного посібника.

> [!warning] Розбіжність з документацією: `headers` не додаються до редиректів
> У [порядку виконання](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#execution-order) `headers` з `next.config` стоять першим кроком, перед `redirects`. На 16.3.8 відповідь `308` з `redirects` приходить **без** `X-Frame-Options` і `x-hello`: заголовки з конфігу дістаються лише відповідям, що дійшли до маршруту. Якщо заголовок потрібен на кожній відповіді, включно з редиректами, став його в proxy або на рівні CDN.

> [!quiz] Перевір себе: що відрендериться?
> level: middle · type: output · id: nextjs-core-06-quiz-08
>
> У проєкті є `app/about/page.tsx` і `app/pricing-b/page.tsx`. Конфіг:
>
> ```ts
> async rewrites() {
>   return {
>     afterFiles: [{ source: '/about', destination: '/pricing-b' }],
>   }
> }
> ```
>
> Користувач відкриває `/about`.
>
> - [x] Сторінка `/about`: `afterFiles` перевіряються після статичних сторінок, а `/about` знайшлася раніше
> - [ ] Сторінка `/pricing-b`, а в адресному рядку `/about`
> - [ ] `307` на `/pricing-b`
> - [ ] Помилка збірки: `source` rewrite не може збігатися з наявною сторінкою
>
> **Пояснення:** порядок такий: `beforeFiles` → файли → `afterFiles`. Щоб перекрити наявну сторінку, rewrite мусить бути в `beforeFiles`. Rewrite ніколи не дає `307` — це не редирект.

### 🧭 redirect() і permanentRedirect() у сторінках і діях

Конфіг і proxy спрацьовують **до** рендеру. Але часто рішення залежить від даних: товару немає → на каталог; користувач змінив нікнейм → профіль переїхав; форма збережена → на сторінку нового запису. Для цього `next/navigation` має дві функції:

- `redirect(path, type?)` — `307` у Server Components і Route Handlers;
- `permanentRedirect(path, type?)` — `308`.

Обидві **кидають виняток** (`NEXT_REDIRECT`) і зупиняють рендер сегмента, тож `return redirect()` не потрібен: функція має тип `never`. Шлях може бути відносним або абсолютним (зовнішній сайт теж можна).

```tsx
// app/[lang]/old-profile/page.tsx
import { permanentRedirect } from 'next/navigation'

export default async function OldProfile({ params }: PageProps<'/[lang]/old-profile'>) {
  const { lang } = await params
  permanentRedirect(`/${lang}/dashboard`)
}
```

`curl /uk/old-profile` → `308 location: /uk/dashboard`. Сторінка навіть пререндерилась під час збірки (`○` у таблиці маршрутів), і `308` віддається як статичний результат.

**У Server Action** поведінка інша. Якщо JavaScript уже завантажився, `redirect()` робить **клієнтську навігацію** — без HTTP-редиректу, разом із відповіддю дії. Якщо форма відправлена до hydration (progressive enhancement), сервер відповідає **`303 See Other`**, щоб браузер пішов на нову адресу методом `GET`. За замовчуванням у Server Action `redirect` **додає** запис в історію (`push`), а в інших місцях **замінює** (`replace`); другим аргументом (`RedirectType.push` / `RedirectType.replace`) це можна змінити.

```ts
// app/[lang]/login/actions.ts
'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const from = String(formData.get('from') || '/uk/dashboard')
  ;(await cookies()).set('session', 'valid', { httpOnly: true, path: '/' })
  // лише відносні шляхи — інакше open redirect
  redirect(from.startsWith('/') && !from.startsWith('//') ? from : '/uk/dashboard')
}
```

Відправка цієї форми без JavaScript (`curl -X POST` з полем `$ACTION_ID_…`) дає:

```text
HTTP/1.1 303 See Other
Set-Cookie: session=valid; Path=/; HttpOnly
Location: /uk/dashboard
```

Зверни увагу на перевірку `from`: параметр приходить від користувача, і `redirect(from)` без перевірки — це **open redirect** (посилання `?from=https://evil.example` на твоєму домені). `//evil.example` браузер теж трактує як інший домен.

**`redirect()` у streaming-контексті.** Якщо `redirect()` викликано всередині `<Suspense>`, коли static shell уже пішов браузеру зі статусом `200`, змінити статус неможливо. Next.js вставляє в потік `<meta http-equiv="refresh">`, і редирект робить клієнт. На 16.3.8 `curl -b "session=forged" /uk/dashboard` повертає:

```text
HTTP/1.1 200 OK
…<meta id="__next-page-redirect" http-equiv="refresh" content="1;url=/uk/login"/>
```

Користувач різниці не помітить, а боти, моніторинг і тести за статусом побачать `200`. Потрібен справжній `307` — перевіряй до shell (proxy) або поза `<Suspense>` (вплив на пререндер — теми 11–12 основного посібника).

**`try/catch` ковтає редирект.** Оскільки `redirect()` — виняток, `catch` навколо нього перехоплює `NEXT_REDIRECT`:

```ts
// app/try/actions.ts
'use server'
import { redirect } from 'next/navigation'

export async function save() {
  try {
    redirect('/about')
  } catch (error) {
    console.log('caught:', (error as Error).message) // caught: NEXT_REDIRECT
  }
}
```

Форма з цією дією отримує `200` замість `303` — редиректу немає. Правило з документації: викликай `redirect()` **поза** `try`, після успішного запису.

`redirect()` можна викликати й у Client Component під час рендеру, але не в обробнику події — там `useRouter().push()`. А для «ресурсу немає» є `notFound()` (тема 13 основного посібника).

> [!quiz] Перевір себе: який статус?
> level: middle · type: output · id: nextjs-core-06-quiz-09
>
> Server Action викликає `redirect('/orders/42')` після запису в БД. Форму відправили **до** завантаження JavaScript (повільна мережа). Що отримає браузер у відповідь на `POST`?
>
> - [x] `303 See Other` з `location: /orders/42`
> - [ ] `307 Temporary Redirect` — `redirect()` завжди дає `307`
> - [ ] `308 Permanent Redirect`
> - [ ] `200` з RSC payload — редирект виконає клієнтський роутер
>
> **Пояснення:** `303` каже браузеру «йди туди методом GET» — саме те, що потрібно після `POST`, щоб оновлення сторінки не відправило форму вдруге. `307` зберіг би метод `POST`. Клієнтська навігація без HTTP-редиректу буває лише тоді, коли JavaScript уже працює.

> [!quiz] Перевір себе: що отримає curl?
> level: senior · type: output · id: nextjs-core-06-quiz-10
>
> `cacheComponents: true`. Сторінка рендерить заголовок, а в `<Suspense>` — компонент, що читає `cookies()` і викликає `redirect('/login')`, якщо сесія недійсна. Proxy пропускає запит (cookie є, але підроблена). Що побачить `curl -i`?
>
> - [x] `200 OK`, а в HTML — `<meta http-equiv="refresh">` на `/login`
> - [ ] `307` з `location: /login`
> - [ ] `500`: `redirect()` не можна викликати всередині `<Suspense>`
> - [ ] `200` без жодного редиректу: `redirect()` у Suspense ігнорується
>
> **Пояснення:** static shell із заголовком уже пішов зі статусом `200`, тож `redirect()` у стрімленій частині не може змінити статус. Next.js дописує в потік meta-тег і інструкцію для клієнтського роутера. Справжній `307` можна отримати лише до початку стріму.

### 🧮 Як обрати: таблиця рішень

| Ситуація | Де | Чому |
|---|---|---|
| Сторінка переїхала назавжди (`/old-blog/:slug`) | `next.config` `redirects`, `permanent: true` | найраніше, без коду, `308` кешується |
| Тимчасова акція, техроботи за шляхом | `redirects`, `permanent: false` | `307`, не залипає в кеші браузера |
| Редирект за наявністю cookie / заголовка / query | `redirects` з `has` / `missing` | досить декларативної умови |
| Мова за `Accept-Language` / cookie, гео, A/B з розрахунком | proxy, `NextResponse.redirect` або `rewrite` | потрібна логіка над запитом |
| Гість на приватній сторінці | proxy (оптимістично) **+** DAL у сторінці | proxy — UX, DAL — безпека |
| Тисячі редиректів зі старого сайту | proxy з мапою й Bloom-фільтром | ліміти платформ на `redirects` |
| Інша адреса — той самий URL (A/B, мультитенант, міграція) | `rewrites` або `NextResponse.rewrite` | браузер не бачить справжній шлях |
| Сторінка недоступна за даними (товар знято, нікнейм змінено) | `redirect()` / `permanentRedirect()` у Server Component | рішення потребує даних |
| Після мутації — на новий запис | `redirect()` у Server Action (поза `try`) | `303` без JS, клієнтська навігація з JS |
| Перехід за кліком | `useRouter().push()` у Client Component | обробник події, не рендер |
| Заголовки безпеки на всіх сторінках | `next.config` `headers` (або proxy для nonce) | декларативно; CSP з nonce — тема 30 основного посібника |

Правило великого пальця: **чим раніше, тим дешевше, але тим менше знаєш**. Конфіг знає лише шлях і запит, proxy — запит і cookie, сторінка — дані.

### 🧪 Як тестувати маршрутизацію

Пакет `next/experimental/testing/server` (з 15.1, **experimental**) має утиліти для юніт-тестів: перевірити, чи спрацює matcher, і прогнати `headers` / `redirects` / `rewrites` з конфігу без запуску сервера.

> [!warning] Розбіжність з документацією: назва функції для matcher
> [Документація proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#unit-testing-experimental) пише `unstable_doesProxyMatch`. У 16.3.8 такого експорту немає — імпорт повертає `undefined` і тест падає з `TypeError: unstable_doesProxyMatch is not a function`. Функція називається по-старому: **`unstable_doesMiddlewareMatch`** (той самий підпис: `{ config, nextConfig, url, headers, cookies }`).

```ts
// tests/routing.test.ts
import { describe, expect, test } from 'vitest'
import { NextRequest } from 'next/server'
import {
  getRedirectUrl,
  unstable_doesMiddlewareMatch,
  unstable_getResponseFromNextConfig,
} from 'next/experimental/testing/server'
import { config, proxy } from '../proxy'
import nextConfig from '../next.config'

describe('маршрутизація', () => {
  test('proxy не запускається для статики й API', () => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig, url: '/uk/dashboard' })).toBe(true)
    expect(unstable_doesMiddlewareMatch({ config, nextConfig, url: '/_next/static/chunks/a.js' })).toBe(false)
    expect(unstable_doesMiddlewareMatch({ config, nextConfig, url: '/api/health' })).toBe(false)
  })

  test('старий блог редиректить назавжди', async () => {
    const response = await unstable_getResponseFromNextConfig({
      url: 'https://acme.dev/old-blog/hello',
      nextConfig,
    })
    expect(response.status).toBe(308)
    expect(getRedirectUrl(response)).toBe('https://acme.dev/blog/hello')
  })

  test('кабінет без cookie — на логін', () => {
    const response = proxy(new NextRequest('https://acme.dev/en/dashboard'))
    expect(getRedirectUrl(response)).toBe('https://acme.dev/en/login?from=%2Fen%2Fdashboard')
  })
})
```

Для Vitest потрібен аліас `@` у `vitest.config.mts`, бо proxy імпортує `@/lib/i18n`. Поза Vitest (`node --test`, `tsx`, звичайний скрипт) імпорт падає з `Invariant: AsyncLocalStorage accessed in runtime where it is not available` — перед імпортом утиліт додай `import { AsyncLocalStorage } from 'node:async_hooks'` і `globalThis.AsyncLocalStorage = AsyncLocalStorage`. `unstable_getResponseFromNextConfig` враховує **лише** конфіг — ні proxy, ні файлові маршрути, тож `afterFiles` на наявну сторінку тест покаже як rewrite, хоча в продакшні виграє сторінка. Ще є `isRewrite(response)` і `getRewrittenUrl(response)`. Детально про тести — тема 40 основного посібника.

### 🧯 Типові помилки і як їх читати

Тексти — з `next build` / `next start` 16.3.8.

| Повідомлення / симптом | Що сталося | Що зробити |
|---|---|---|
| `Route segment config is not allowed in Proxy file at "./proxy.ts". Proxy always runs on Node.js runtime.` | `export const runtime = …` (будь-яке значення) у proxy | прибрати; Edge — лише в застарілому `middleware.ts` |
| `Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected.` | міграція наполовину | видалити `middleware.ts` або запустити codemod |
| `⚠ The "middleware" file convention is deprecated.` | старий файл | `npx @next/codemod@canary middleware-to-proxy .` |
| `Next.js can't recognize the exported 'config' field in route. 'matcher' needs to be a static string…` | змінна чи вираз у `matcher` | літерал прямо в `config` |
| Сторінка логіну без CSS, картинки не вантажаться | matcher ловить `_next/static`, `_next/image` | негативний lookahead |
| `ERR_TOO_MANY_REDIRECTS` у браузері | умова редиректу спрацьовує й на цільовій адресі | виключити ціль з умови чи matcher |
| `431 Request Header Fields Too Large` | proxy додає великі заголовки запиту | передавати id, а не дані; або cookie |
| Server Action без `303`, `caught: NEXT_REDIRECT` у лозі | `redirect()` у `try` | викликати поза `try` |
| `200` з `meta refresh` замість `307` | `redirect()` у `<Suspense>` після shell | перевірка до стріму або поза Suspense |
| `Request body exceeded 1MB for /api/upload…` | ліміт `proxyClientMaxBodySize` | підняти ліміт або виключити маршрут |

### 🏭 Як це роблять у продакшні

- **Proxy — тонкий.** Мова, оптимістичний auth-редирект, A/B-cookie, кілька заголовків. Усе, що читає БД, — у сторінках, діях і DAL. На code review `await db` у proxy — червоний прапорець.
- **Matcher з тестами.** Негативний lookahead з `api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt` плюс юніт-тест на `unstable_doesMiddlewareMatch`: нова сторінка `/apiary` не має тихо випасти з proxy.
- **Auth у трьох місцях.** Proxy редиректить гостей (UX), кожна сторінка й Server Action перевіряють сесію через DAL (безпека), а шар даних — права на конкретний ресурс (тема 28 основного посібника).
- **Редиректи — в конфігу або в сховищі.** Десятки правил — `redirects`; тисячі з CMS — proxy, мапа в Edge Config / KV і Bloom-фільтр.
- **Безпечні редиректи.** Будь-який `from` / `next` / `returnTo` з query — лише відносний шлях (`/…`, але не `//…`), бажано за білим списком.

## ⚠️ Пастки

> [!pitfall] Auth лише в proxy
> Matcher змінився, форму перенесли, з'явилася CVE — і приватні дані відкриті. Proxy перевіряє лише, що cookie **є**.
>
> ```ts
> // ❌ сторінка вірить proxy на слово
> export default async function Orders() {
>   return <OrderList orders={await db.order.findMany()} />
> }
>
> // ✅ сторінка перевіряє сама, через DAL
> export default async function Orders() {
>   const session = await verifySession() // redirect('/login'), якщо немає
>   return <OrderList orders={await getOrdersFor(session.userId)} />
> }
> ```

> [!pitfall] Proxy без matcher ламає статику
> Без matcher proxy виконується і для `_next/static`, `_next/image` та `public/`. Редирект гостей на `/login` «захищає» CSS і JS — сторінка логіну приходить без стилів, а кожна картинка викликає proxy.

> [!pitfall] Заголовок запиту поїхав у відповідь
> `NextResponse.next({ headers })` — це заголовки **відповіді**. Скопійовані вхідні заголовки (cookie, authorization) полетять браузеру.
>
> ```ts
> // ❌ NextResponse.next({ headers: requestHeaders })
> // ✅ NextResponse.next({ request: { headers: requestHeaders } })
> ```

> [!pitfall] (?!api) виключає й /apiary
> Негативний lookahead перевіряє **початок** шляху. `'/((?!api|_next/static).*)'` пропускає proxy для `/api/users`, але й для `/apiary`, `/api-docs`, `/apidocs`. Пиши `api/` або тримай API під окремим префіксом.

> [!pitfall] redirect() у try/catch
> `redirect()` кидає `NEXT_REDIRECT`, і `catch` його ковтає: дія завершується `200`, користувач лишається на місці.
>
> ```ts
> // ❌
> try { await save(data); redirect('/done') } catch (e) { return { error: 'Не вдалося' } }
> // ✅
> try { await save(data) } catch (e) { return { error: 'Не вдалося' } }
> redirect('/done')
> ```

> [!pitfall] Open redirect через ?from=
> `redirect(searchParams.from)` на сторінці логіну перетворює твій домен на трамплін для фішингу: `?from=https://evil.example` або `?from=//evil.example`. Приймай лише шляхи, що починаються з `/` і не з `//`.

## 🎤 На співбесіді

> [!interview] Що таке proxy.ts у Next.js 16 і чим він відрізняється від middleware.ts?
> level: middle · frequency: дуже часто · id: nextjs-core-06-int-01
>
> ---
>
> Це файл у корені проєкту (або в `src/`), функція з якого виконується на сервері перед рендером кожного маршруту, що підпадає під `config.matcher`. Вона може зробити redirect, rewrite, змінити заголовки запиту чи відповіді, поставити cookie або відповісти сама. У Next.js 16 `middleware.ts` перейменували на `proxy.ts`: назва плутала з Express і заохочувала тягнути туди забагато. Функціональність та сама, але proxy працює лише на Node.js — `runtime` у файлі зупиняє збірку. Міграція — codemod `middleware-to-proxy`; старий файл ще працює з попередженням і досі збирається для Edge. Файл один на проєкт, експорт — `proxy` або default.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🚪 proxy.ts: файл, функція, runtime|Розділ: proxy.ts]] · [Next.js: proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) · [Next.js: Upgrading to 16](https://nextjs.org/docs/app/guides/upgrading/version-16#middleware-to-proxy)

> [!interview] Чому proxy не можна вважати межею безпеки?
> level: middle · frequency: дуже часто · id: nextjs-core-06-int-02
>
> ---
>
> Бо його покриття визначає matcher, а Server Actions — це `POST` на маршрут сторінки: виключив шлях — виключив і дії, перемістив форму — втратив перевірку. Proxy виконується на кожен запит, включно з prefetch, тож у ньому можна лише оптимістично подивитися на cookie, а не ходити в БД по права. І бувають обходи: CVE-2025-29927 дозволяла заголовком `x-middleware-subrequest` пропустити middleware повністю на self-hosted версіях до 15.2.3. Тому proxy — для UX-редиректу гостей, а перевірка сесії й прав — у DAL, кожній сторінці, Server Action і Route Handler.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🧱 Чого proxy робити не повинен|Розділ: обмеження proxy]] · [Next.js: Authentication — optimistic checks](https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-proxy-optional) · [GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw)

> [!interview] Де робити редирект: next.config, proxy чи redirect()? Які статус-коди?
> level: middle · frequency: часто · id: nextjs-core-06-int-03
>
> ---
>
> Лише шлях (і, можливо, cookie/заголовок/query як умова) — `redirects` у конфігу: найраніше в ланцюжку, `permanent: true` → `308`, `false` → `307`. Логіка над запитом (мова з `Accept-Language`, A/B, оптимістичний auth) — proxy, `NextResponse.redirect` (за замовчуванням `307`, статус можна задати). Рішення за даними — `redirect()` (`307`) або `permanentRedirect()` (`308`) у Server Component; у Server Action з JS — клієнтська навігація, без JS — `303`. `307`/`308` замість `302`/`301` — щоб браузер не змінив `POST` на `GET`. І пам'ятати: `redirect()` кидає виняток, тож поза `try`, а в `<Suspense>` після shell статус буде `200` з meta refresh.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🧮 Як обрати: таблиця рішень|Розділ: таблиця рішень]] · [Next.js: Redirecting](https://nextjs.org/docs/app/guides/redirecting) · [Next.js: redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)

> [!interview] Чим rewrite відрізняється від redirect, і що таке beforeFiles, afterFiles, fallback?
> level: middle · frequency: часто · id: nextjs-core-06-int-04
>
> ---
>
> Redirect відповідає `3xx`, браузер робить новий запит і бачить нову адресу. Rewrite рендерить інший шлях (або проксіює на інший домен) у межах того самого запиту, адреса лишається. У конфігу rewrites діляться на три групи за місцем у ланцюжку: `beforeFiles` — після proxy, до файлів і сторінок, тож може перекрити наявну сторінку (A/B); `afterFiles` — після статичних сторінок, до динамічних маршрутів (масив без обʼєкта працює саме так); `fallback` — після всіх маршрутів перед 404, класика для поступової міграції зі старого сайту. Proxy бачить ще не переписаний шлях.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#⚙️ redirects, rewrites і headers у next.config.ts|Розділ: конфіг]] · [Next.js: rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) · [MDN: Redirections in HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections)

> [!interview] Як передати дані з proxy в Server Component, і в чому пастка?
> level: senior · frequency: іноді · id: nextjs-core-06-int-05
>
> ---
>
> Через заголовки запиту: скопіювати `request.headers`, додати свій ключ і повернути `NextResponse.next({ request: { headers } })`; сторінка прочитає його через `headers()` (у `<Suspense>` під Cache Components). Пастка — `NextResponse.next({ headers })`: це заголовки відповіді, тож скопійовані вхідні (cookie, authorization) підуть браузеру, а підмінений `Content-Type` ламає Server Actions і стрімінг. Краще білий список заголовків, особливо при rewrite на сторонній сервіс. Великі заголовки дають `431`. Глобальні змінні як канал не працюють: proxy може виконуватися окремо від рендеру.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#📮 Заголовки й cookie: кому вони йдуть|Розділ: заголовки й cookie]] · [Next.js: NextResponse.next](https://nextjs.org/docs/app/api-reference/functions/next-response#next) · [Next.js: proxy — Setting headers](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#setting-headers)

## 🔗 Звʼязки

- [[Next.js - 01. App Router, сегменти і спеціальні файли]] — файлові маршрути, які стоять у ланцюжку між `beforeFiles` і `afterFiles`.
- [[Next.js - 03. Динамічні маршрути]] — `[lang]`, `generateStaticParams`, чому динамічні маршрути перевіряються після `afterFiles`.
- [[Next.js - 04. Навігація під капотом]] — prefetch: чому proxy виконується частіше, ніж здається.
- [[Next.js - 07. Server і Client Components]] — `server-only` у DAL і чому `redirect()` у Client Component — лише під час рендеру.
- [[Next.js - 11. Streaming і Suspense]] — static shell і чому `redirect()` у стрімленій частині дає `200`.
- [[Next.js - 13. Помилки й межі помилок]] — `notFound()`, `forbidden()`, `unauthorized()` як альтернатива редиректу.
- Далі в основному посібнику: тема 21 — Server Actions як `POST` на маршрут, 26 — сесії й cookie, 27 — автентифікація й «proxy проти DAL», 30 — CSP і заголовки безпеки, 34 — i18n-маршрути, 40 — тести, 48 — міграції.

## ⚡ Фішки

> [!reel] 🚦 Редирект з конфігу не бачить proxy
> `redirects` у `next.config` перевіряються раніше за proxy: запит отримує `307`/`308` і зупиняється. Proxy виконається вже для нової адреси.

> [!reel] 🪞 Proxy бачить адресу до rewrite
> Rewrites з конфігу застосовуються після proxy. Умови в proxy пиши для адрес, які набирає користувач, а не для внутрішніх.

> [!reel] 🐝 (?!api) пропускає й /apiary
> Негативний lookahead у matcher перевіряє лише початок шляху. Сторінка `/apiary` тихо випадає з proxy разом з `/api/*`.

> [!reel] 📮 next({ headers }) — це у відповідь
> `NextResponse.next({ request: { headers } })` — заголовки для сервера. `NextResponse.next({ headers })` — для браузера. Одне слово `request` відділяє внутрішній заголовок від витоку.
>
> ```ts
> NextResponse.next({ request: { headers } }) // ✅ вгору
> NextResponse.next({ headers })              // ❌ у браузер
> ```

> [!reel] 🕳️ CVE-2025-29927: один заголовок вимикав middleware
> Зовнішній запит із `x-middleware-subrequest` змушував self-hosted Next.js до 15.2.3 пропустити middleware. Ті, хто перевіряв доступ лише там, віддавали приватні сторінки всім.

> [!reel] 📬 303 — редирект після форми без JS
> `redirect()` у Server Action без JavaScript відповідає `303 See Other`: браузер іде на нову адресу методом GET, і F5 не відправить форму вдруге.

> [!reel] 🌊 redirect() у Suspense — це 200
> Shell уже пішов зі статусом `200`, тож `redirect()` у стрімленій частині стає meta refresh. Боти й моніторинг редиректу не побачать.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Де лежить файл proxy.ts і що він має експортувати?
> *дуже часто · теорія* · `nextjs-core-06-card-01`
>
> У корені проєкту або в `src/` — на одному рівні з `app/`, не всередині. Одна функція: іменована `proxy` або `export default`; опціонально — `export const config = { matcher }`. Файл один на проєкт.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🚪 proxy.ts: файл, функція, runtime|Розділ: proxy.ts]] · [Next.js: proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

> [!question]- Чим redirect відрізняється від rewrite?
> *дуже часто · теорія* · `nextjs-core-06-card-02`
>
> Redirect відповідає `3xx` з `location`: браузер робить новий запит і показує нову адресу. Rewrite рендерить інший шлях у межах того самого запиту: адреса в браузері не змінюється.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#↪️ NextResponse: next, redirect, rewrite|Розділ: NextResponse]] · [Next.js: rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)

> [!question]- Який статус дає redirects з permanent: true і permanent: false?
> *часто · теорія* · `nextjs-core-06-card-03`
>
> `true` → `308 Permanent Redirect`, `false` → `307 Temporary Redirect`. Обидва зберігають метод запиту, на відміну від `301`/`302`. Для старих клієнтів є `statusCode` замість `permanent`.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#⚙️ redirects, rewrites і headers у next.config.ts|Розділ: конфіг]] · [Next.js: redirects](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects)

> [!question]- Що станеться, якщо в proxy не вказати matcher?
> *часто · пастка* · `nextjs-core-06-card-04`
>
> Proxy виконається на кожен запит: сторінки, `_next/static`, `_next/image`, файли з `public/`. Auth-редирект «захистить» і CSS з JS, а кожна картинка викличе proxy. Стандартне рішення — негативний lookahead.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🎯 matcher: де proxy виконується|Розділ: matcher]] · [Next.js: proxy — Matcher](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher)

### 🟡 Middle

> [!question]- У якому порядку Next.js обробляє запит?
> *дуже часто · теорія* · `nextjs-core-06-card-05`
>
> `headers` → `redirects` (конфіг) → proxy → `beforeFiles` → файли й статичні маршрути → `afterFiles` → динамічні маршрути → `fallback`. Server Actions окремим кроком не є — це `POST` на маршрут сторінки.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🧭 Три місця, де можна перехопити запит|Розділ: порядок]] · [Next.js: proxy — Execution order](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#execution-order)

> [!question]- Що означають :path*, :path+ і :path? у matcher?
> *часто · теорія* · `nextjs-core-06-card-06`
>
> `*` — нуль або більше сегментів (`/docs/:path*` ловить і `/docs`), `+` — один або більше, `?` — нуль або один. Без модифікатора `:slug` — рівно один сегмент. Регулярний вираз — у дужках: `/post/:id(\\d+)`.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🎯 matcher: де proxy виконується|Розділ: matcher]] · [Next.js: proxy — Matcher](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher)

> [!question]- Як передати заголовок з proxy до Server Component, а не браузеру?
> *часто · практика* · `nextjs-core-06-card-07`
>
> `NextResponse.next({ request: { headers } })` з копією `request.headers` і доданим ключем; сторінка читає `headers()`. `NextResponse.next({ headers })` — це заголовки відповіді, вони підуть браузеру.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#📮 Заголовки й cookie: кому вони йдуть|Розділ: заголовки]] · [Next.js: NextResponse.next](https://nextjs.org/docs/app/api-reference/functions/next-response#next)

> [!question]- Чим beforeFiles відрізняється від afterFiles?
> *часто · теорія* · `nextjs-core-06-card-08`
>
> `beforeFiles` застосовується до перевірки файлів і сторінок, тож перекриває навіть наявну сторінку. `afterFiles` — після статичних сторінок, але до динамічних маршрутів: на наявну сторінку не впливає. Масив rewrites без обʼєкта — це `afterFiles`.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#⚙️ redirects, rewrites і headers у next.config.ts|Розділ: конфіг]] · [Next.js: rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)

> [!question]- Який статус дає redirect() у Server Action?
> *часто · пастка* · `nextjs-core-06-card-09`
>
> З JavaScript — жодного HTTP-редиректу: клієнтська навігація разом з відповіддю дії. Без JavaScript (форма до hydration) — `303 See Other`. У Server Components і Route Handlers — `307`; `permanentRedirect()` — `308`.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🧭 redirect() і permanentRedirect() у сторінках і діях|Розділ: redirect()]] · [Next.js: redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)

### 🔴 Senior

> [!question]- Чому matcher, що виключає шлях, вимикає захист Server Actions на ньому?
> *часто · пастка* · `nextjs-core-06-card-10`
>
> Server Functions не мають власних маршрутів: виклик — це `POST` на сторінку, де їх використано. Matcher, що не покриває сторінку, не покриває й дію. Рефакторинг, що переносить форму, тихо прибирає proxy-перевірку. Тому сесію й права перевіряють у кожній дії.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🧱 Чого proxy робити не повинен|Розділ: обмеження]] · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security#authentication-and-authorization)

> [!question]- Що таке CVE-2025-29927 і який урок з неї?
> *іноді · безпека* · `nextjs-core-06-card-11`
>
> Критична вразливість (CVSS 9.1, березень 2025): зовнішній запит із внутрішнім заголовком `x-middleware-subrequest` змушував self-hosted Next.js пропустити middleware. Вразливі версії — від 11.1.4 до 12.3.5 / 13.5.9 / 14.2.25 / 15.2.3 у відповідних гілках, де це виправлено; Vercel був захищений автоматично. Урок: перевірка доступу лише в middleware/proxy — архітектурна вразливість, перевіряй біля даних.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🧱 Чого proxy робити не повинен|Розділ: обмеження]] · [GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw)

> [!question]- Чому redirect() у Suspense повертає 200, і коли це проблема?
> *іноді · пастка* · `nextjs-core-06-card-12`
>
> Static shell уже відправлено зі статусом `200`, тож змінити статус неможливо. Next.js дописує в потік `<meta http-equiv="refresh">`, і редирект робить клієнт. Проблема для ботів, моніторингу й тестів за статусом. Потрібен справжній `307` — перевіряй до стріму (proxy, перевірка поза Suspense).
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🧭 redirect() і permanentRedirect() у сторінках і діях|Розділ: redirect()]] · [Next.js: redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)

> [!question]- Чому proxy не повинен ходити в БД, і що робити з тисячами редиректів?
> *іноді · архітектура* · `nextjs-core-06-card-13`
>
> Proxy виконується на кожен запит під matcher, включно з prefetch кожного видимого `<Link>`, а опції кешу `fetch` у ньому ігноруються. Запит у БД множиться на всі ці виклики. Для тисяч редиректів — мапа у швидкому сховищі (KV, Edge Config) і Bloom-фільтр у proxy, щоб читати мапу лише для ймовірних збігів.
>
> 📚 [[Next.js - 06. proxy.ts, redirects і rewrites#🧱 Чого proxy робити не повинен|Розділ: обмеження]] · [Next.js: Managing redirects at scale](https://nextjs.org/docs/app/guides/redirecting#managing-redirects-at-scale-advanced)

## 🛠️ Практика

> [!task] Компілятор matcher
> level: middle · difficulty: medium · id: nextjs-core-06-task-01 · tags: proxy, matcher, regex
>
> Напиши `compileMatcher(source)` — перетворює шаблон matcher у `RegExp`, — і `matchesProxy(matcher, pathname)`, яка каже, чи виконається proxy. Правила (так поводиться 16.3.8):
>
> - шаблон прив'язаний до **всього** шляху: `/about` ловить лише `/about`;
> - `/:name` — рівно один сегмент (`[^/]+`); `/:name*` — нуль або більше сегментів; `/:name+` — один або більше; `/:name?` — нуль або один;
> - `/:name(regex)` — сегмент за власним регулярним виразом (`/post/:id(\d+)`), модифікатори після дужок теж можливі;
> - група в дужках без імені — сирий регулярний вираз: `/((?!api|_next/static).*)`. Дужки можуть бути вкладеними;
> - решта символів — буквальні (крапку екрануй).
>
> `matcher` — рядок або масив рядків; proxy виконується, якщо збігся хоча б один.
>
> ```ts starter
> function compileMatcher(source: string): RegExp {
>   // ❌ «шлях починається з шаблону» — так matcher не працює
>   return new RegExp('^' + source)
> }
>
> function matchesProxy(matcher: string | string[], pathname: string): boolean {
>   const list = Array.isArray(matcher) ? matcher : [matcher]
>   return list.some((source) => compileMatcher(source).test(pathname))
> }
> ```
>
> ```ts tests
> test('шаблон без параметрів ловить рівно цей шлях', () => {
>   expect(matchesProxy('/about', '/about')).toBe(true)
>   expect(matchesProxy('/about', '/about/team')).toBe(false)
>   expect(matchesProxy('/about', '/blog/about')).toBe(false)
> })
>
> test(':slug — рівно один сегмент', () => {
>   expect(matchesProxy('/blog/:slug', '/blog/hello')).toBe(true)
>   expect(matchesProxy('/blog/:slug', '/blog')).toBe(false)
>   expect(matchesProxy('/blog/:slug', '/blog/a/b')).toBe(false)
> })
>
> test('модифікатори *, + і ?', () => {
>   expect(matchesProxy('/docs/:path*', '/docs')).toBe(true)
>   expect(matchesProxy('/docs/:path*', '/docs/a/b/c')).toBe(true)
>   expect(matchesProxy('/docs/:path+', '/docs')).toBe(false)
>   expect(matchesProxy('/docs/:path+', '/docs/a/b')).toBe(true)
>   expect(matchesProxy('/docs/:path?', '/docs/a')).toBe(true)
>   expect(matchesProxy('/docs/:path?', '/docs/a/b')).toBe(false)
> })
>
> test('параметр з власним regex', () => {
>   expect(matchesProxy('/post/:id(\\d+)', '/post/42')).toBe(true)
>   expect(matchesProxy('/post/:id(\\d+)', '/post/abc')).toBe(false)
> })
>
> test('негативний lookahead виключає статику, API — і /apiary', () => {
>   const matcher = ['/((?!api|_next/static|_next/image|favicon.ico).*)']
>   expect(matchesProxy(matcher, '/')).toBe(true)
>   expect(matchesProxy(matcher, '/uk/dashboard')).toBe(true)
>   expect(matchesProxy(matcher, '/_next/static/chunks/main.js')).toBe(false)
>   expect(matchesProxy(matcher, '/api/users')).toBe(false)
>   expect(matchesProxy(matcher, '/apiary')).toBe(false)
> })
>
> test('масив: досить одного збігу; крапка — буквальна', () => {
>   expect(matchesProxy(['/about', '/robots.txt'], '/robots.txt')).toBe(true)
>   expect(matchesProxy(['/about', '/robots.txt'], '/robotsxtxt')).toBe(false)
>   expect(matchesProxy(['/about', '/docs/:path*'], '/pricing')).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > Іди по рядку символ за символом. Три випадки: `/:` (параметр), `(` (сира група) і решта (буквальний символ, екранований для regex). У кінці — `new RegExp('^' + body + '$')`.
>
> > [!hint]- Підказка 2
> > Для дужок напиши `findClose(source, open)` — лічильник глибини, що пропускає екрановані символи (`\(`). Модифікатор параметра охоплює і слеш: `/:path*` — це `(?:/seg(?:/seg)*)?`, тож `/docs` без слеша теж підходить.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function findClose(source: string, open: number): number {
> >   let depth = 0
> >   for (let i = open; i < source.length; i++) {
> >     const ch = source[i]
> >     if (ch === '\\') { i++; continue }
> >     if (ch === '(') depth++
> >     if (ch === ')') { depth--; if (depth === 0) return i }
> >   }
> >   throw new Error(`Незакрита дужка в ${source}`)
> > }
> >
> > function compileMatcher(source: string): RegExp {
> >   let body = ''
> >   let i = 0
> >   while (i < source.length) {
> >     const ch = source[i]
> >     if (ch === '/' && source[i + 1] === ':') {
> >       let j = i + 2
> >       while (j < source.length && /\w/.test(source[j])) j++
> >       let seg = '[^/]+'
> >       if (source[j] === '(') {
> >         const end = findClose(source, j)
> >         seg = `(?:${source.slice(j + 1, end)})`
> >         j = end + 1
> >       }
> >       const mod = source[j]
> >       if (mod === '*') { body += `(?:/${seg}(?:/${seg})*)?`; j++ }
> >       else if (mod === '+') { body += `/${seg}(?:/${seg})*`; j++ }
> >       else if (mod === '?') { body += `(?:/${seg})?`; j++ }
> >       else body += `/${seg}`
> >       i = j
> >     } else if (ch === '(') {
> >       const end = findClose(source, i)
> >       body += `(?:${source.slice(i + 1, end)})`
> >       i = end + 1
> >     } else {
> >       body += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
> >       i++
> >     }
> >   }
> >   return new RegExp(`^${body}$`)
> > }
> >
> > function matchesProxy(matcher: string | string[], pathname: string): boolean {
> >   const list = Array.isArray(matcher) ? matcher : [matcher]
> >   return list.some((source) => compileMatcher(source).test(pathname))
> > }
> > ```
> >
> > Справжній Next.js компілює matcher через path-to-regexp і додає хвости для `.rsc`, `.json` і `_next/data` — у маніфесті збірки це видно як `(\.json|\.rsc|…)?[\/#\?]?$`. Головне в моделі збігається: шаблон — весь шлях, а lookahead перевіряє лише початок, тому `/apiary` випадає разом з `/api`.

> [!task] Proxy на мок-запиті: мова й оптимістичний auth
> level: middle · difficulty: medium · id: nextjs-core-06-task-02 · tags: proxy, i18n, auth, redirect, rewrite
>
> Справжній `NextRequest` у раннері недоступний, тож proxy отримує простий обʼєкт `{ url, headers, cookies }` (ключі заголовків — у нижньому регістрі) і повертає рішення:
>
> - `{ type: 'redirect', to, status: 307 }` — `to` — шлях з query, без домену;
> - `{ type: 'rewrite', to }`;
> - `{ type: 'next', requestHeaders: { 'x-pathname': pathname } }`.
>
> Мови — `uk` і `en`, за замовчуванням `uk`. Правила по черзі:
>
> 1. Шлях без мовного префікса (`/uk`, `/uk/…`, `/en`, `/en/…`; `/ukraine` — **не** префікс) → редирект на `/<мова><шлях><query>`; для `/` — на `/<мова>`. Мова: cookie `lang`, якщо вона підтримується; інакше перший тег `accept-language`, чия основна частина (`en-US` → `en`) підтримується; інакше `uk`.
> 2. `/<мова>/dashboard` і все під ним без cookie `session` → редирект на `/<мова>/login?from=<pathname у encodeURIComponent>`.
> 3. `/<мова>/login` з cookie `session` → редирект на `/<мова>/dashboard`.
> 4. `/<мова>/pricing` з cookie `ab` = `b` → rewrite на `/<мова>/pricing-b`.
> 5. Інакше — `next` із заголовком `x-pathname`.
>
> ```ts starter
> type MockRequest = {
>   url: string
>   headers: Record<string, string>
>   cookies: Record<string, string>
> }
>
> type ProxyResult =
>   | { type: 'next'; requestHeaders: Record<string, string> }
>   | { type: 'redirect'; to: string; status: number }
>   | { type: 'rewrite'; to: string }
>
> const locales = ['uk', 'en']
>
> function proxy(req: MockRequest): ProxyResult {
>   const { pathname } = new URL(req.url)
>   // ❌ мову «вгадуємо» за startsWith і тільки з cookie
>   if (!pathname.startsWith('/uk') && !pathname.startsWith('/en')) {
>     return { type: 'redirect', to: `/${req.cookies.lang ?? 'uk'}${pathname}`, status: 307 }
>   }
>   return { type: 'next', requestHeaders: { 'x-pathname': pathname } }
> }
> ```
>
> ```ts tests
> const req = (path: string, extra: Partial<MockRequest> = {}): MockRequest => ({
>   url: `https://acme.dev${path}`,
>   headers: {},
>   cookies: {},
>   ...extra,
> })
>
> test('без мови: редирект з query, корінь — без кінцевого слеша', () => {
>   expect(proxy(req('/catalog?page=2'))).toEqual({ type: 'redirect', to: '/uk/catalog?page=2', status: 307 })
>   expect(proxy(req('/'))).toEqual({ type: 'redirect', to: '/uk', status: 307 })
>   expect(proxy(req('/ukraine'))).toEqual({ type: 'redirect', to: '/uk/ukraine', status: 307 })
> })
>
> test('мова: cookie, потім accept-language, потім uk', () => {
>   expect(proxy(req('/about', { cookies: { lang: 'en' } }))).toEqual({ type: 'redirect', to: '/en/about', status: 307 })
>   expect(proxy(req('/about', { cookies: { lang: 'fr' }, headers: { 'accept-language': 'de-DE,en-US;q=0.8' } }))).toEqual({ type: 'redirect', to: '/en/about', status: 307 })
>   expect(proxy(req('/about', { headers: { 'accept-language': 'fr-FR,de;q=0.5' } }))).toEqual({ type: 'redirect', to: '/uk/about', status: 307 })
> })
>
> test('кабінет без сесії — на логін з from', () => {
>   expect(proxy(req('/en/dashboard/orders'))).toEqual({ type: 'redirect', to: '/en/login?from=%2Fen%2Fdashboard%2Forders', status: 307 })
> })
>
> test('кабінет із сесією — далі з x-pathname', () => {
>   expect(proxy(req('/uk/dashboard', { cookies: { session: 'abc' } }))).toEqual({ type: 'next', requestHeaders: { 'x-pathname': '/uk/dashboard' } })
> })
>
> test('логін із сесією — у кабінет; без сесії — сторінка логіну', () => {
>   expect(proxy(req('/en/login', { cookies: { session: 'abc' } }))).toEqual({ type: 'redirect', to: '/en/dashboard', status: 307 })
>   expect(proxy(req('/en/login'))).toEqual({ type: 'next', requestHeaders: { 'x-pathname': '/en/login' } })
> })
>
> test('A/B: група b бачить pricing-b за тією самою адресою', () => {
>   expect(proxy(req('/uk/pricing', { cookies: { ab: 'b' } }))).toEqual({ type: 'rewrite', to: '/uk/pricing-b' })
>   expect(proxy(req('/uk/pricing', { cookies: { ab: 'a' } }))).toEqual({ type: 'next', requestHeaders: { 'x-pathname': '/uk/pricing' } })
> })
> ```
>
> > [!hint]- Підказка 1
> > Префікс — це **перший сегмент**: `pathname.split('/')[1]`. Так `/ukraine` не вважається мовою, а `/uk` без слеша — вважається.
>
> > [!hint]- Підказка 2
> > `accept-language` — список через кому; у кожного тегу відкинь `;q=…`, візьми частину до `-` у нижньому регістрі й знайди перший підтримуваний. Query бери з `new URL(req.url).search`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > const locales = ['uk', 'en']
> >
> > function pickLocale(req: MockRequest): string {
> >   const saved = req.cookies.lang
> >   if (saved && locales.includes(saved)) return saved
> >   const header = req.headers['accept-language'] ?? ''
> >   for (const part of header.split(',')) {
> >     const tag = part.split(';')[0].trim().split('-')[0].toLowerCase()
> >     if (locales.includes(tag)) return tag
> >   }
> >   return 'uk'
> > }
> >
> > function proxy(req: MockRequest): ProxyResult {
> >   const { pathname, search } = new URL(req.url)
> >   const first = pathname.split('/')[1]
> >
> >   if (!locales.includes(first)) {
> >     const rest = pathname === '/' ? '' : pathname
> >     return { type: 'redirect', to: `/${pickLocale(req)}${rest}${search}`, status: 307 }
> >   }
> >
> >   const hasSession = 'session' in req.cookies
> >   const dashboard = `/${first}/dashboard`
> >   if ((pathname === dashboard || pathname.startsWith(`${dashboard}/`)) && !hasSession) {
> >     return { type: 'redirect', to: `/${first}/login?from=${encodeURIComponent(pathname)}`, status: 307 }
> >   }
> >   if (pathname === `/${first}/login` && hasSession) {
> >     return { type: 'redirect', to: dashboard, status: 307 }
> >   }
> >   if (pathname === `/${first}/pricing` && req.cookies.ab === 'b') {
> >     return { type: 'rewrite', to: `/${first}/pricing-b` }
> >   }
> >   return { type: 'next', requestHeaders: { 'x-pathname': pathname } }
> > }
> > ```
> >
> > Зверни увагу на дві речі. Логін не підпадає під правило кабінету, тож циклу редиректів немає. А «є cookie `session`» — оптимістична перевірка: підроблений токен пройде proxy, і саме тому кабінет перевіряє сесію ще раз у DAL.

> [!task] Застосуй redirects і rewrites з next.config
> level: senior · difficulty: hard · id: nextjs-core-06-task-03 · tags: next-config, redirects, rewrites, routing
>
> Напиши `resolve(config, routes, req)` — симулятор маршрутизації за конфігом. `req = { path, query, cookies }`, `routes = { files: [...], dynamic: [...] }` (статичні шляхи й шаблони динамічних маршрутів). Порядок:
>
> 1. `config.redirects` — перше правило, у якого збігся `source` і виконались умови `has` / `missing`, дає `{ type: 'redirect', status, location }`: `308` для `permanent: true`, `307` інакше; параметри підставлено в `destination`, query передано далі (`?a=1&b=2` у порядку ключів обʼєкта).
> 2. `config.rewrites` — масив (тоді це `afterFiles`) або `{ beforeFiles, afterFiles, fallback }`.
> 3. `beforeFiles` — **усі** правила по черзі: кожне, що збіглося, переписує поточний шлях, і перевірка йде далі вже з новим шляхом.
> 4. Поточний шлях є в `files` → `{ type: 'render', route: шлях }`.
> 5. `afterFiles` по черзі: правило, що збіглося, переписує шлях; якщо новий шлях є у `files` або збігається з динамічним маршрутом — рендер (`route` — файл чи шаблон).
> 6. Динамічні маршрути → рендер з `route` — шаблоном.
> 7. `fallback` — як `afterFiles`.
> 8. Інакше `{ type: 'not-found' }`.
>
> Умови: `{ type: 'cookie' | 'query', key, value? }`; без `value` досить наявності ключа. Помічники `matchPath` і `fill` уже написані: перший повертає параметри або `null` (`:name` — один сегмент, `:name*` — нуль або більше), другий підставляє параметри.
>
> ```js starter
> function matchPath(pattern, path) {
>   const names = []
>   const body = pattern.replace(/\/:(\w+)(\*)?/g, (_, name, star) => {
>     names.push([name, !!star])
>     return star ? '(?:/(.*))?' : '/([^/]+)'
>   })
>   const m = new RegExp(`^${body}$`).exec(path)
>   if (!m) return null
>   const params = {}
>   names.forEach(([name], i) => { params[name] = m[i + 1] ?? '' })
>   return params
> }
>
> function fill(destination, params) {
>   return destination
>     .replace(/\/:(\w+)\*?/g, (_, name) => (params[name] ? `/${params[name]}` : ''))
>     || '/'
> }
>
> function resolve(config, routes, req) {
>   // ❌ усі rewrites одним списком до редиректів, без has і без порядку
>   const rewrites = Array.isArray(config.rewrites) ? config.rewrites : Object.values(config.rewrites ?? {}).flat()
>   let path = req.path
>   for (const rule of rewrites) {
>     const params = matchPath(rule.source, path)
>     if (params) path = fill(rule.destination, params)
>   }
>   if (routes.files.includes(path)) return { type: 'render', route: path }
>   return { type: 'not-found' }
> }
> ```
>
> ```js tests
> const routes = {
>   files: ['/', '/about', '/about/team', '/pricing', '/pricing-b'],
>   dynamic: ['/blog/:slug', '/legacy/:path*'],
> }
> const config = {
>   redirects: [
>     { source: '/old-blog/:slug', destination: '/blog/:slug', permanent: true },
>     { source: '/blog/:slug', destination: '/news/:slug', permanent: false, has: [{ type: 'query', key: 'v', value: '2' }] },
>   ],
>   rewrites: {
>     beforeFiles: [{ source: '/pricing', destination: '/pricing-b', has: [{ type: 'cookie', key: 'ab', value: 'b' }] }],
>     afterFiles: [
>       { source: '/about', destination: '/pricing-b' },
>       { source: '/team', destination: '/about/team' },
>     ],
>     fallback: [{ source: '/:path*', destination: '/legacy/:path*' }],
>   },
> }
> const req = (path, extra = {}) => ({ path, query: {}, cookies: {}, ...extra })
>
> test('редирект: 308 для permanent, параметри й query передаються', () => {
>   expect(resolve(config, routes, req('/old-blog/hello', { query: { ref: 'x' } }))).toEqual({ type: 'redirect', status: 308, location: '/blog/hello?ref=x' })
> })
>
> test('редирект з has спрацьовує лише за умови', () => {
>   expect(resolve(config, routes, req('/blog/a', { query: { v: '2' } }))).toEqual({ type: 'redirect', status: 307, location: '/news/a?v=2' })
>   expect(resolve(config, routes, req('/blog/a'))).toEqual({ type: 'render', route: '/blog/:slug' })
> })
>
> test('beforeFiles перекриває наявну сторінку лише з cookie', () => {
>   expect(resolve(config, routes, req('/pricing', { cookies: { ab: 'b' } }))).toEqual({ type: 'render', route: '/pricing-b' })
>   expect(resolve(config, routes, req('/pricing'))).toEqual({ type: 'render', route: '/pricing' })
> })
>
> test('afterFiles не чіпає наявну сторінку, але допомагає відсутній', () => {
>   expect(resolve(config, routes, req('/about'))).toEqual({ type: 'render', route: '/about' })
>   expect(resolve(config, routes, req('/team'))).toEqual({ type: 'render', route: '/about/team' })
> })
>
> test('fallback — після динамічних маршрутів', () => {
>   expect(resolve(config, routes, req('/nothing/deep'))).toEqual({ type: 'render', route: '/legacy/:path*' })
> })
>
> test('масив rewrites — це afterFiles; без збігів — 404', () => {
>   const flat = { redirects: [], rewrites: [{ source: '/team', destination: '/about/team' }] }
>   expect(resolve(flat, routes, req('/team'))).toEqual({ type: 'render', route: '/about/team' })
>   expect(resolve(flat, routes, req('/nope'))).toEqual({ type: 'not-found' })
> })
> ```
>
> > [!hint]- Підказка 1
> > Почни з `conditionsOk(rule, req)`: кожна умова з `has` мусить виконатися, жодна з `missing` — ні. Значення беремо з `req.cookies` або `req.query` за `type`.
>
> > [!hint]- Підказка 2
> > Нормалізуй rewrites: `Array.isArray(r) ? { beforeFiles: [], afterFiles: r, fallback: [] } : { beforeFiles: [], afterFiles: [], fallback: [], ...r }`. Для `afterFiles` і `fallback` напиши одну функцію «перепиши й перевір, чи шлях тепер існує».
>
> > [!solution]- Еталонне рішення
> > ```js
> > // matchPath і fill — без змін, як у заготовці
> > function matchPath(pattern, path) {
> >   const names = []
> >   const body = pattern.replace(/\/:(\w+)(\*)?/g, (_, name, star) => {
> >     names.push([name, !!star])
> >     return star ? '(?:/(.*))?' : '/([^/]+)'
> >   })
> >   const m = new RegExp(`^${body}$`).exec(path)
> >   if (!m) return null
> >   const params = {}
> >   names.forEach(([name], i) => { params[name] = m[i + 1] ?? '' })
> >   return params
> > }
> >
> > function fill(destination, params) {
> >   return destination
> >     .replace(/\/:(\w+)\*?/g, (_, name) => (params[name] ? `/${params[name]}` : ''))
> >     || '/'
> > }
> >
> > function conditionsOk(rule, req) {
> >   const read = (c) => (c.type === 'cookie' ? req.cookies : req.query)[c.key]
> >   const ok = (c) => {
> >     const v = read(c)
> >     return v !== undefined && (c.value === undefined || v === c.value)
> >   }
> >   return (rule.has ?? []).every(ok) && !(rule.missing ?? []).some(ok)
> > }
> >
> > function apply(rule, path, req) {
> >   const params = matchPath(rule.source, path)
> >   return params && conditionsOk(rule, req) ? fill(rule.destination, params) : null
> > }
> >
> > function findRoute(path, routes) {
> >   if (routes.files.includes(path)) return path
> >   return routes.dynamic.find((pattern) => matchPath(pattern, path)) ?? null
> > }
> >
> > function resolve(config, routes, req) {
> >   for (const rule of config.redirects ?? []) {
> >     const location = apply(rule, req.path, req)
> >     if (location) {
> >       const qs = new URLSearchParams(req.query).toString()
> >       return { type: 'redirect', status: rule.permanent ? 308 : 307, location: qs ? `${location}?${qs}` : location }
> >     }
> >   }
> >
> >   const r = config.rewrites ?? []
> >   const { beforeFiles, afterFiles, fallback } = Array.isArray(r)
> >     ? { beforeFiles: [], afterFiles: r, fallback: [] }
> >     : { beforeFiles: [], afterFiles: [], fallback: [], ...r }
> >
> >   let path = req.path
> >   for (const rule of beforeFiles) path = apply(rule, path, req) ?? path
> >
> >   if (routes.files.includes(path)) return { type: 'render', route: path }
> >
> >   const tryList = (rules) => {
> >     for (const rule of rules) {
> >       const next = apply(rule, path, req)
> >       if (!next) continue
> >       path = next
> >       const route = findRoute(path, routes)
> >       if (route) return { type: 'render', route }
> >     }
> >     return null
> >   }
> >
> >   const after = tryList(afterFiles)
> >   if (after) return after
> >
> >   const dynamic = routes.dynamic.find((pattern) => matchPath(pattern, path))
> >   if (dynamic) return { type: 'render', route: dynamic }
> >
> >   return tryList(fallback) ?? { type: 'not-found' }
> > }
> > ```
> >
> > Модель спрощена: справжній Next.js ще враховує `host`, `basePath`, локалі, proxy між редиректами й `beforeFiles` і зовнішні destination. Але порядок той самий — і саме його перевіряють тести: `afterFiles` на `/about` нічого не робить, бо сторінка знаходиться раніше, а `/blog/zzz` дістається динамічному маршруту до `fallback`.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Proxy (Getting Started)](https://nextjs.org/docs/app/getting-started/proxy) — коли proxy потрібен, а коли досить конфігу.
- 🟡 [Next.js — proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) — matcher, порядок виконання, заголовки, cookie, CORS, міграція з middleware.
- 🟡 [Next.js — Redirecting](https://nextjs.org/docs/app/guides/redirecting) — усі способи редиректу, статуси, редиректи на масштабі.
- 🟡 [Next.js — redirects](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects) · [rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) · [headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers) — довідник конфігу.
- 🟡 [Next.js — redirect](https://nextjs.org/docs/app/api-reference/functions/redirect) і [permanentRedirect](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect) — `307`/`308`/`303`, `push`/`replace`, `try/catch`.
- 🟡 [Next.js — NextResponse](https://nextjs.org/docs/app/api-reference/functions/next-response) — `next`, `redirect`, `rewrite`, заголовки вгору й униз.
- 🟡 [Next.js — proxyClientMaxBodySize](https://nextjs.org/docs/app/api-reference/config/next-config-js/proxyClientMaxBodySize) — ліміт буфера тіла запиту.
- 🔴 [Next.js — Authentication: optimistic checks with Proxy](https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-proxy-optional) — чому лише cookie, без БД.
- 🔴 [GitHub Advisory GHSA-f82v-jwr5-mffw (CVE-2025-29927)](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw) — обхід middleware заголовком `x-middleware-subrequest`.
- 🛠️ [MDN — Redirections in HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections) — `301`/`302`/`303`/`307`/`308` і чим вони відрізняються.

> [!important] Підсумок
> - Порядок запиту: `headers` → `redirects` → proxy → `beforeFiles` → файли → `afterFiles` → динамічні маршрути → `fallback`. Редирект з конфігу не доходить до proxy, а proxy бачить шлях до rewrite.
> - `proxy.ts` — у корені або `src/`, одна функція `proxy` (або default), лише Node.js; `middleware.ts` застарів, міграція — codemod `middleware-to-proxy`.
> - `matcher` — константа, шаблон на весь шлях (`/about` ≠ `/about/team` на 16.3.8); негативний lookahead виключає статику, але й усе, що починається з тих самих літер.
> - `NextResponse.next({ request: { headers } })` — заголовки для сервера, `next({ headers })` — для браузера. Redirect змінює URL, rewrite — ні.
> - Proxy — лише оптимістична перевірка без БД: Server Actions — це `POST` на сторінку, matcher крихкий, обходи бувають (CVE-2025-29927). Доступ перевіряй біля даних.
> - `redirects`: `308`/`307`; `redirect()` — `307`, `permanentRedirect()` — `308`, у Server Action без JS — `303`; `redirect()` кидає виняток (поза `try`), а в `<Suspense>` після shell стає `200` з meta refresh.

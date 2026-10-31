---
title: Route Handlers і Backend-for-Frontend
id: nextjs-core-19
slug: 19-route-handlers
order: 19
level: middle
skill: data
icon: px:database
tags: [nextjs, route-handlers, route-ts, api, bff, cors, webhooks, streaming, sse, cache-components]
prerequisites: ["[[Next.js - 10. Статичний і динамічний рендеринг]]", "[[Next.js - 03. Динамічні маршрути]]"]
estimatedMinutes: 55
nextVersion: 16.3.8
---

# Route Handlers і Backend-for-Frontend

> [!success] 🎯 Після цього розділу ти зможеш
> - написати `route.ts` з кількома методами, прочитати `params`, рядок запиту, cookies і тіло, повернути правильний статус-код і заголовки;
> - передбачити, що Next.js зробить сам із неекспортованим методом (`405`, автоматичний `OPTIONS`, `HEAD`) — і чому відповідь залежить від того, `○`, `●` чи `ƒ` маршрут; конфлікт з `page.tsx`;
> - сказати, чи пререндериться `GET` під Cache Components, прочитати символ у `next build` і закешувати дані через `'use cache'` у допоміжній функції;
> - віддати відповідь частинами (`ReadableStream`, Server-Sent Events) і прибрати за собою, коли клієнт пішов;
> - налаштувати CORS з білим списком і preflight, знаючи, що CORS захищає браузер, а не сервер;
> - прийняти вебхук: сирий body, перевірка підпису, ідемпотентність, `revalidateTag(tag, { expire: 0 })`;
> - побудувати Backend-for-Frontend: сховати ключі, сформувати DTO, обробити збої бекенду;
> - обрати між Route Handler, Server Action і читанням даних прямо в Server Component і перевіряти доступ у кожному обробнику.

## 🤔 Передбач

> [!quiz] Що відповість маршрут, якого ти не писав?
> level: junior · type: output · id: nextjs-core-19-quiz-01
>
> Дано єдиний файл. Сервер запущено через `next start`.
>
> ```ts
> // app/api/hello/route.ts
> import type { NextRequest } from 'next/server'
>
> export async function GET(request: NextRequest) {
>   const name = request.nextUrl.searchParams.get('name') ?? 'світ'
>   return Response.json({ message: `Привіт, ${name}` })
> }
> ```
>
> Що відповідять `curl -i -X PUT localhost:3000/api/hello` і `curl -i -X OPTIONS localhost:3000/api/hello`?
>
> - [ ] `PUT` → `404`, `OPTIONS` → `404`: функцій `PUT` і `OPTIONS` немає, отже, немає й маршруту
> - [ ] `PUT` → `200` (виконається `GET`), `OPTIONS` → `200`
> - [x] `PUT` → `405` (без `Allow`, тіло порожнє), `OPTIONS` → `204` із заголовком `allow: GET, HEAD, OPTIONS`, який Next.js додав сам
> - [ ] `PUT` → `405`, `OPTIONS` → `405`: експортовано лише `GET`, тож решта методів заборонена
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Адреса `/api/hello` існує, бо є `route.ts`, тому `404` тут не буде: Next.js відповідає за відсутні методи сам. Цей `GET` читає `request`, тож маршрут динамічний (`ƒ`): `PUT` дає `405` без `Allow` і з порожнім тілом, а `OPTIONS` — `204` з `allow: GET, HEAD, OPTIONS`. Якби `GET` нічого не читав (`○`), `OPTIONS` теж отримав би `405`, а `405` на `PUT` мав би два рядки `Allow` і тіло `Method Not Allowed` (див. таблицю нижче). `GET` за чужий метод не підставляється ніколи.

## 🧒 Простими словами

Уяви ресторан, у якого є зал і віконце видачі на вулицю. Зал — це сторінки: гість сідає, отримує меню, офіціант приносить страви, усе оформлено (layouts, навігація, React). Віконце — це Route Handler: туди підходить будь-хто — кур'єр, сусідній ресторан, автомат з доставки — каже коротке замовлення й отримує пакет. Ні меню, ні серветок, лише «що просиш — те й дали». Через віконце можна й приймати: постачальник приносить накладну, і кухар мусить перевірити печатку, бо віконце відчинене на вулицю. А ще кухня може сама подзвонити на склад від імені ресторану: склад знає ресторан і його пароль, а гість — ні. Це і є Backend-for-Frontend.

## 🔬 Як це працює насправді

### 🧭 Навіщо Route Handlers

Server Component читає дані прямо під час рендеру, а Server Action приймає мутації з форм твого ж застосунку. Обидва — частини React-дерева. Але часто потрібна **звичайна HTTP-адреса**, з якою говорить хтось інший:

- мобільний застосунок чи чужий фронтенд, що ходить по JSON;
- сторонній сервіс з вебхуком (оплата, CMS, GitHub);
- відповідь не-UI: RSS, `llms.txt`, CSV, файл, `.well-known/*`;
- callback після OAuth чи оплати, де треба виставити cookie й зробити редирект;
- стрім: відповідь AI-моделі, прогрес довгої задачі.

**Route Handler** — файл `route.ts` у папці `app/`, що експортує функції з іменами HTTP-методів. Кожна приймає стандартний Web `Request` і повертає стандартний `Response` — ті самі класи, що й у браузерному `fetch`, у Deno чи Cloudflare Workers. Це найнижчий рівень маршрутизації: Route Handler **не бере участі** в layouts, клієнтській навігації й RSC payload. Запит прийшов — відповідь пішла.

```ts
// app/api/hello/route.ts — нічого не читає з запиту: пререндериться на збірці
export async function GET() {
  return Response.json({ message: 'Привіт з Route Handler' })
}
```

`Response.json()` — статичний метод Web API: серіалізує обʼєкт і ставить `content-type: application/json`. Папка `api/` — лише домовленість: `route.ts` може лежати будь-де (`app/rss.xml/route.ts` віддає `/rss.xml`), а префікс `/api` просто відділяє HTTP-контракт від сторінок.

Документація називає цю роль **Backend-for-Frontend** (BFF): шар API поруч із фронтендом, який публічно доступний, обробляє будь-який HTTP-запит і повертає будь-який тип вмісту. Важливе застереження звідти ж: це не заміна повноцінного бекенду. Черги, довгі задачі, WebSockets і власна база з міграціями живуть деінде, а Next.js стоїть між ними й браузером.

### 📁 route.ts: методи, request і context

Підтримуються методи `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD` і `OPTIONS`. Що не експортовано, Next.js обробляє сам. Відповідь залежить від того, чи пререндерено маршрут (`○` — статичний, `ƒ` — на запит; символи — у розділі про кешування нижче):

| Запит | Маршрут | Відповідь на 16.3.8 |
|---|---|---|
| `PUT /api/hello` | статичний `GET` (`○`) | `405 Method Not Allowed`, заголовки `Allow: GET` і `Allow: HEAD` (окремими рядками), тіло `Method Not Allowed` |
| `OPTIONS /api/hello` | статичний `GET` (`○`) | теж `405` з `Allow: GET`, `Allow: HEAD` |
| `HEAD /api/hello` | статичний `GET` (`○`) | `200` з кешу (`x-nextjs-cache: HIT`); твій `GET` не виконується |
| `PUT /api/search` | `GET` (`ƒ`) | `405` **без** `Allow` і з порожнім тілом |
| `OPTIONS /api/products` | `GET`, `POST` (`ƒ`) | `204 No Content`, `allow: GET, HEAD, OPTIONS, POST` — автоматично, без CORS-заголовків |
| `HEAD /api/search?q=1` | `GET` (`ƒ`) | `200` без тіла; **твій `GET` виконався**, `request.method === 'HEAD'` |

Останній рядок — неочевидний. Для `ƒ` Next.js не вигадує відповідь на `HEAD`: він викликає твій `GET` і викидає тіло. Тож побічні ефекти в `GET` (лічильник переглядів, запис у лог) спрацюють і на `HEAD`. Для `○`/`●` `HEAD` — влучання в кеш, і `GET` не виконується. Висновок: клієнт не повинен покладатися на `Allow` у `405`, а `GET` — тримай без побічних ефектів.

Сигнатура обробника — `(request, context)`, обидва параметри необовʼязкові:

```ts
// app/api/search/route.ts — читає рядок запиту: рендер на кожен запит
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''
  return Response.json({ q, results: q ? [`${q} — 1`, `${q} — 2`] : [] })
}
```

`request` — це `NextRequest`, розширення Web `Request`: `request.nextUrl` (розібраний URL з `pathname` і `searchParams`) і `request.cookies`. Писати `request: Request` теж можна — тоді доступні лише стандартні методи. Відповідати можна звичайним `Response` або `NextResponse` (`NextResponse.json`, `NextResponse.redirect`, `response.cookies.set`): одне підставляється замість іншого.

`context.params` — **Promise** з параметрами динамічних сегментів, як і в сторінках з Next.js 15 ([[Next.js - 03. Динамічні маршрути]]). Типізувати його найпростіше глобальним хелпером `RouteContext`:

```ts
// app/api/products/[id]/route.ts — динамічний сегмент, RouteContext, generateStaticParams
import { cacheTag } from 'next/cache'
import { findProduct } from '@/lib/products'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getProduct(id: string) {
  'use cache'
  cacheTag('products', `product-${id}`)
  const p = await findProduct(id)
  return p ? { id: p.id, title: p.title, price: p.price } : null
}

export async function GET(_request: Request, ctx: RouteContext<'/api/products/[id]'>) {
  const { id } = await ctx.params
  const product = await getProduct(id)
  if (!product) return Response.json({ error: 'not found' }, { status: 404 })
  return Response.json(product)
}
```

`RouteContext` не імпортують: Next.js генерує типи під час `next dev`, `next build` чи `next typegen`, і хелпер стає глобальним. Літерал маршруту перевіряється: опечатка `RouteContext<'/typo/[slug]'>` у файлі `app/typo/[id]/route.ts` зупиняє збірку з `Type '"/typo/[slug]"' does not satisfy the constraint 'AppRouteHandlerRoutes'`. Для catch-all `app/blog/[...slug]/route.ts` параметр — масив: `/blog/1/2` дає `{ slug: ['1', '2'] }`.

Одне обмеження розташування: у сегменті може бути **або** `page.tsx`, **або** `route.ts`. Кожен з них забирає собі всі HTTP-методи свого URL, тож навіть `route.ts` лише з `POST` поруч зі сторінкою — конфлікт:

```text
Error: An issue occurred while preparing your Next.js app
Conflicting route and page at /conflict: route at /conflict/route and page at /conflict/page
```

`app/page.tsx` разом з `app/api/route.ts` — нормально: це різні сегменти.

> [!quiz] Перевір себе: що відповість маршрут із GET і POST?
> level: middle · type: output · id: nextjs-core-19-quiz-02
>
> ```ts
> // app/api/products/route.ts
> export async function GET() {
>   return Response.json([])
> }
>
> export async function POST(request: Request) {
>   return Response.json(await request.json(), { status: 201 })
> }
> ```
>
> Що повернуть `curl -i -X DELETE localhost:3000/api/products` і `curl -i -X OPTIONS localhost:3000/api/products`?
>
> - [ ] `DELETE` → `405` із `Allow: GET, HEAD, POST`, `OPTIONS` → `405`: свій `OPTIONS` треба писати самому
> - [ ] `DELETE` → `404`, `OPTIONS` → `404`: ні `DELETE`, ні `OPTIONS` не експортовано
> - [x] `DELETE` → `405` без `Allow` і з порожнім тілом, `OPTIONS` → `204` із `allow: GET, HEAD, OPTIONS, POST`
> - [ ] `DELETE` → `405` без `Allow`, `OPTIONS` → `204` з `allow` і `Access-Control-Allow-Methods: GET, POST`
>
> **Пояснення:** обидва «зайві» методи Next.js обробляє сам. Через `POST` маршрут динамічний (`ƒ`), а в динамічного `405` на 16.3.8 немає ні `Allow`, ні тіла (статичний `○` віддав би два рядки `Allow`). Автоматичний `OPTIONS` додає `HEAD` (через `GET`) і сам `OPTIONS`, а `Access-Control-*` не містить жодного, тому для CORS-preflight його замало (докладніше — у розділі про CORS). Очікувати `404` — типова помилка: сегмент існує, лише метод не підтримується.

> [!quiz] Перевір себе: допиши обробник для динамічного сегмента
> level: middle · type: fill · id: nextjs-core-19-quiz-03
>
> ```ts fill
> // app/api/users/[id]/route.ts
> import { findUser } from '@/lib/users'
>
> export async function GET(_request: Request, ctx: [[RouteContext]]<'/api/users/[id]'>) {
>   const { id } = [[await]] ctx.params
>   const user = await findUser(id)
>   if (!user) return Response.json({ error: 'not found' }, { [[status]]: 404 })
>   return Response.[[json]](user)
> }
> ```
>
> **Пояснення:** `RouteContext` не імпортують — Next.js генерує глобальний тип під час `dev`, `build` чи `typegen`, а літерал шляху береться з дерева `app/` дослівно. `params` — Promise (як і в сторінках з Next.js 15), тому без `await` в `id` потрапив би не рядок, а проміс; читати `ctx.params.id` синхронно, як у Next.js 14, не можна. Код відповіді задають у другому аргументі `Response.json`, поле `status`.

### 📥 Тіло запиту, статуси й помилки

Тіло читають стандартними методами `Request`: `request.json()`, `request.text()`, `request.formData()`, `request.arrayBuffer()`. `GET` і `HEAD` тіла не мають. Потік тіла можна прочитати **один раз**; для другого читання потрібна копія `request.clone()`, зроблена заздалегідь. Інакше:

```text
TypeError: Body is unusable: Body has already been read
```

Реалістичний `POST` — це три перевірки до будь-якої роботи: хто ти, чи можна тобі, чи коректні дані. Кожна має свій статус-код:

```ts
// app/api/products/route.ts — кешований GET і захищений POST
import { cacheLife, cacheTag } from 'next/cache'
import { listProducts, db } from '@/lib/products'
import { getUser } from '@/lib/session'

async function getCatalog() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const products = await listProducts()
  // DTO: собівартість (costPrice) назовні не віддаємо
  return {
    products: products.map(({ id, title, price }) => ({ id, title, price })),
    generatedAt: new Date().toISOString(),
  }
}

export async function GET() {
  return Response.json(await getCatalog())
}

export async function POST(request: Request) {
  const user = await getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })
  if (user.role !== 'admin') return Response.json({ error: 'forbidden' }, { status: 403 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 })
  }
  const { title, price } = body as { title?: unknown; price?: unknown }
  if (typeof title !== 'string' || typeof price !== 'number') {
    return Response.json({ error: 'title: string, price: number' }, { status: 422 })
  }

  const id = String(db.size + 1)
  db.set(id, { id, title, price, costPrice: 0 })
  return Response.json({ id, title, price }, { status: 201, headers: { Location: `/api/products/${id}` } })
}
```

```ts
// lib/session.ts — спрощена сесія для прикладів (у курсі — теми 26–28 основного посібника)
import 'server-only'
import { cookies } from 'next/headers'

type User = { id: string; role: 'admin' | 'customer' }

// у справжньому застосунку — перевірка підпису JWT або запис сесії в БД
const SESSIONS: Record<string, User> = {
  'tok-admin': { id: 'u1', role: 'admin' },
  'tok-olya': { id: 'u2', role: 'customer' },
}

export async function getUser(): Promise<User | null> {
  const token = (await cookies()).get('session')?.value
  return token ? (SESSIONS[token] ?? null) : null
}
```

`cookies()` і `headers()` з `next/headers` працюють у Route Handlers так само, як у Server Components, а `cookies().set()` і `.delete()` тут дозволені (під час рендеру Server Component — ні). Що повертає цей `POST` на `next start`:

| Запит | Статус | Тіло |
|---|---|---|
| без cookie | `401` | `{"error":"unauthorized"}` |
| `session=tok-olya` (покупець) | `403` | `{"error":"forbidden"}` |
| адмін, тіло `{oops` | `400` | `{"error":"invalid JSON"}` |
| адмін, `{"title":1}` | `422` | `{"error":"title: string, price: number"}` |
| адмін, коректне тіло | `201` | `{"id":"3",…}` і заголовок `location: /api/products/3` |

`401` — «не знаю, хто ти», `403` — «знаю, але не можна». Валідацію в реальному коді пишуть схемою (Zod, тема 23 основного посібника).

Що буде, якщо виняток **не** перехопити? Обробник `await request.json()` без `try` на тілі `{oops` повертає `500 Internal Server Error` з **порожнім** тілом, а в лог сервера йде `⨯ SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)`. Для неочікуваних помилок це правильно: `error.message` чи стек у відповіді документація прямо забороняє.

`redirect()` з `next/navigation` у Route Handler дає `307 Temporary Redirect` з `location`; `permanentRedirect()` — `308`. Адресу редиректу з рядка запиту перевіряй (лише свій origin), інакше маєш open redirect.

> [!quiz] Перевір себе: двічі прочитати тіло
> level: middle · type: single · id: nextjs-core-19-quiz-04
>
> ```ts
> export async function POST(request: Request) {
>   const data = await request.json()
>   console.log('raw body:', await request.text()) // «для логування»
>   return Response.json({ ok: true, data })
> }
> ```
>
> Клієнт надсилає коректний JSON. Що станеться?
>
> - [ ] `text()` поверне той самий рядок, з якого розібрано JSON
> - [ ] `text()` поверне порожній рядок, обробник відповість `200`
> - [x] `text()` кине `TypeError: Body is unusable: Body has already been read`; без `try/catch` клієнт отримає `500`
> - [ ] Next.js автоматично клонує запит, тож обидва читання спрацюють
>
> **Пояснення:** тіло — потік, який читається один раз, а не рядок у памʼяті. Друге читання кидає виняток, а не повертає порожнє значення. Next.js запит сам не клонує. Якщо тіло потрібне двічі, роби `request.clone()` до першого читання або читай один раз і передавай результат далі.

### 🧊 Статичний чи динамічний GET під Cache Components

З `cacheComponents: true` `GET`-обробники живуть за тими самими правилами, що й сторінки ([[Next.js - 10. Статичний і динамічний рендеринг]]): Next.js пробує виконати `GET` під час `next build`, і якщо той не торкнувся нічого невідомого на збірці, відповідь пререндериться. Інші методи не пререндеряться ніколи.

Що зупиняє пререндер: доступ до властивостей `request` (`request.url`, `request.headers`, `request.cookies`, тіло), `cookies()`, `headers()`, `connection()`, мережеві запити, запити до БД, асинхронна робота з файлами й недетерміновані операції (`Math.random()`, `Date.now()`). Помилки збірки, як у сторінках, тут немає: обробник просто тихо стає `ƒ`.

Щоб включити повільні дані у пререндер, їх кешують `'use cache'` — **у допоміжній функції**, як `getCatalog()` вище. Ось таблиця маршрутів прикладів цієї теми (16.3.8, скорочено):

```text
Route (app)               Revalidate  Expire
├ ƒ /api/bff/orders
├ ○ /api/catalog                  1h      1d
├ ○ /api/hello
├ ƒ /api/products
├   /api/products/[id]
│ ├ ● /api/products/1            15m      1y
│ └ ● /api/products/2            15m      1y
├ ƒ /api/public/products
├ ƒ /api/search
├ ƒ /api/stream
├ ƒ /api/webhooks/cms
└ ○ /rss.xml
```

Як читати:

- `/api/hello`, `/rss.xml` — `○`: читають лише код і дані в памʼяті. `curl -sI` дає `x-nextjs-cache: HIT` і `cache-control: s-maxage=31536000` — до наступного деплою.
- `/api/catalog` — той самий `getCatalog()` з `cacheLife('hours')`, але у файлі **лише `GET`**: `○` з `1h / 1d`, у заголовках `s-maxage=3600, stale-while-revalidate=82800`.
- `/api/products/[id]` — `●`: шляхи з `generateStaticParams`. У `getProduct` немає `cacheLife`, тож діє профіль `default` (revalidate 15 хв, expire «ніколи», показано як `1y`): `s-maxage=900, stale-while-revalidate=31535100`.
- `/api/search`, `/api/public/products` — `ƒ`: читають `request`. `/api/bff/orders` — `ƒ`: читає `cookies()`.

Невідомий параметр (`/api/products/3`) обробляється на першому запиті й **теж кешується**: перша відповідь `x-nextjs-cache: MISS`, друга — `HIT`, з тим самим `s-maxage=900`. Навіть якщо це `404`. Якщо товар 3 зʼявиться в базі, клієнти бачитимуть `404`, доки кеш не протермінується або не прийде ревалідація тегу `products` (про неї — у розділі про вебхуки).

> [!warning] Розбіжність з документацією
> [Route Handlers → Caching](https://nextjs.org/docs/app/getting-started/route-handlers#caching) каже, що інші методи не кешуються, «навіть якщо вони поруч із закешованим `GET` у тому самому файлі», — тобто `GET` у такому файлі кешувати можна. На 16.3.8 з `cacheComponents: true` будь-який додатковий експорт методу (`POST`, навіть порожній `OPTIONS`) робить **увесь маршрут** `ƒ`: `/api/catalog` з доданим `POST` перетворюється з `○ 1h 1d` на `ƒ`. Дані в `'use cache'` при цьому кешуються далі: `generatedAt` у відповідях `/api/products` однаковий від запиту до запиту, бракує лише пререндеру й заголовків CDN. Якщо `GET` має бути статичним, винеси мутації в окремий файл (`/api/products` для читання, `/api/admin/products` для запису).

Зворотний бік — пререндерені шляхи `●`. На `/api/products/1` (з `generateStaticParams`) запити `POST`, `PUT`, `DELETE` і `OPTIONS` отримують `200` і **закешоване тіло `GET`** (`x-nextjs-cache: HIT`) — обробник не викликається. Тож `DELETE /api/products/1` «успішно» відповідає `200`, нічого не видаливши, а закешований `404`-шлях відповідає на `OPTIONS` теж `404`. Ще одна причина тримати мутації в окремому файлі, а маршрути, що змінюють дані, — `ƒ`.

Сама директива в тілі `GET` не працює, і помилка про це вводить в оману:

```ts
// ❌ 'use cache' прямо в обробнику
export async function GET() {
  'use cache'
  return Response.json({ at: Date.now() })
}
```

```text
Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
Error occurred prerendering page "/direct-cache".
```

Жодних Client Components тут немає. Справжня причина: кешована функція повертає `Response` — екземпляр класу, який кеш не вміє серіалізувати (результат `'use cache'` підпорядковується правилам серіалізації props, [[Next.js - 15. Cache Components і use cache]]). У `next dev` підказка — `environmentName: 'Cache'`. Кешуй **дані**, а `Response` будуй зовні.

> [!note] Чому в прикладах дані в памʼяті
> `lib/products.ts` тримає товари в `Map` у `globalThis`, а сесії — в обʼєкті. Під Cache Components справжній запит до БД у `GET` не зламав би збірку, а тихо зробив би обробник `ƒ`; щоб він пререндерився, запит кешують `'use cache'` у допоміжній функції. Справжня БД, пули зʼєднань і транзакції — [[Next.js - 20. Бази даних і клієнтський fetching]].

> [!diagram] Що станеться з GET на next build
> ```yaml
> layout: flow
> nodes:
>   - { id: start, label: "next build", text: "виконати GET", tone: gray, icon: "px:hourglass" }
>   - { id: other, label: "у файлі є POST / PUT / OPTIONS…", text: "ƒ", note: "увесь маршрут на запит (16.3.8)", tone: orange }
>   - { id: req, label: "читає request, cookies(), headers()", text: "ƒ", note: "пререндер зупинено", tone: orange }
>   - { id: io, label: "fetch, БД, Math.random() без кешу", text: "ƒ", note: "тихо, без помилки збірки", tone: yellow }
>   - { id: cached, label: "дані в 'use cache' у хелпері", text: "○ з Revalidate / Expire", note: "оновиться за cacheLife", tone: blue, icon: "px:tag" }
>   - { id: pure, label: "лише код і константи", text: "○", note: "до наступного деплою", tone: green, icon: "px:check" }
> steps:
>   - { focus: start, note: "Під Cache Components next build пробує виконати кожен GET-обробник, як сторінку." }
>   - { show: other, note: "Спершу — інші методи в тому самому файлі. На 16.3.8 вони роблять динамічним увесь маршрут, навіть якщо GET нічого не читає." }
>   - { show: req, note: "Обробник торкнувся запиту: URL, заголовків, cookies чи тіла. Відповідь залежить від запиту, тож пререндерити нема що." }
>   - { show: io, note: "Некешований fetch чи випадкове число теж зупиняють пререндер. У сторінці це була б помилка збірки, тут — просто ƒ." }
>   - { show: cached, note: "Повільні дані в helper-функції з 'use cache' потрапляють у пререндер, а cacheLife визначає колонки Revalidate і Expire." }
>   - { show: pure, note: "GET без зовнішніх даних — повністю статичний файл, як JSON у public, лише згенерований кодом." }
> ```
> Символ у таблиці збірки — перша перевірка. Друга — `curl -sI` і заголовки `x-nextjs-cache` та `cache-control`.

> [!quiz] Перевір себе: які символи покаже next build
> level: middle · type: output · id: nextjs-core-19-quiz-05
>
> Проєкт з `cacheComponents: true`, три окремі файли:
>
> ```ts
> // A: app/api/a/route.ts
> export async function GET() {
>   return Response.json({ ok: true })
> }
> ```
>
> ```ts
> // B: app/api/b/route.ts
> import type { NextRequest } from 'next/server'
>
> export async function GET(request: NextRequest) {
>   const q = request.nextUrl.searchParams.get('q') ?? ''
>   return Response.json({ q })
> }
> ```
>
> ```ts
> // C: app/api/c/route.ts
> import { cacheLife } from 'next/cache'
> import { listProducts } from '@/lib/products'
>
> async function getCatalog() {
>   'use cache'
>   cacheLife('hours')
>   return { products: await listProducts() }
> }
>
> export async function GET() {
>   return Response.json(await getCatalog())
> }
>
> export async function POST(request: Request) {
>   return Response.json(await request.json(), { status: 201 })
> }
> ```
>
> Що покаже `next build` (Next.js 16.3.8) для `A`, `B` і `C`?
>
> - [ ] `○`, `ƒ`, `○ 1h 1d`: дані в `C` закешовані, `POST` поруч нічого не змінює
> - [ ] `ƒ`, `ƒ`, `ƒ`: усі Route Handlers динамічні за замовчуванням
> - [ ] `○`, `○`, `○ 1h 1d`: `request.nextUrl` — лише геттер, мережі немає
> - [x] `○`, `ƒ`, `ƒ`
>
> **Пояснення:** `A` нічого не читає — статичний файл (`x-nextjs-cache: HIT`). `B` читає `request.nextUrl`, тож відповідь залежить від запиту. У `C` дані справді кешуються `'use cache'`, але сам маршрут через додатковий експорт `POST` стає `ƒ` (документація обіцяє інакше — це розбіжність 16.3.8); щоб отримати `○ 1h 1d`, винеси `POST` в інший файл. Правило «усі Route Handlers динамічні» діяло до Cache Components.

> [!quiz] Перевір себе: що зупиняє пререндер GET
> level: middle · type: multi · id: nextjs-core-19-quiz-06
>
> Сервер — `cacheComponents: true`, файл містить лише `GET`. Познач усе, що зробить маршрут `ƒ` (не `○`).
>
> - [x] `request.headers.get('x-token')` в обробнику
> - [x] `await cookies()` з `next/headers`
> - [x] `fetch('https://api.example.com/list')` без кешу
> - [x] `Math.random()` у відповіді
> - [ ] параметр `request: Request` у сигнатурі, який обробник ніде не читає
> - [ ] `import { cookies } from 'next/headers'` у модулі, де функцію ніхто не викликає
> - [ ] `next build` обовʼязково впаде з помилкою, як зі сторінкою без `<Suspense>`
>
> **Пояснення:** пререндер зупиняє *доступ* до запиту, cookies, заголовків, мережі, БД і недетермінованих значень. Сам параметр `request` чи імпорт нічого не роблять: обробник, який не торкнувся запиту, лишається `○`. Помилки збірки тут немає: Route Handler не має `<Suspense>`, тож Next.js тихо відкладає його на момент запиту.

### 🌊 Стрімінг: ReadableStream і Server-Sent Events

`Response` приймає не лише рядок, а й `ReadableStream`. Сервер шле заголовки одразу, а тіло — частинами, як зʼявляються дані. Так працюють відповіді AI-моделей, прогрес експорту, довгі звіти.

```ts
// app/api/stream/route.ts — відповідь частинами
const encoder = new TextEncoder()
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function GET() {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of ['раз', 'два', 'три']) {
        controller.enqueue(encoder.encode(`${word}\n`))
        await sleep(1000)
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

`curl -N` (без буферизації) на `next start` показує: заголовки `200` і `Transfer-Encoding: chunked` і рядок `раз` приходять одразу, `два` — через секунду, `три` — ще через секунду. Статус і заголовки йдуть **першими**, тож якщо на другій секунді щось зламається, `200` уже не змінити. Помилку посеред стріму передають у самому потоці (окрема подія чи поле `error`), а клієнт її обробляє.

**Server-Sent Events** (SSE) — стандартний формат стріму для браузерного `EventSource`: `Content-Type: text/event-stream`, кожна подія — рядки `id:`, `event:`, `data:` і порожній рядок у кінці. Браузер сам перепідключається й надсилає `Last-Event-ID`.

```ts
// app/api/events/route.ts — Server-Sent Events
export async function GET(request: Request) {
  const encoder = new TextEncoder()
  let timer: ReturnType<typeof setInterval> | undefined

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let n = 0
      const send = () => {
        n += 1
        controller.enqueue(encoder.encode(`id: ${n}\nevent: tick\ndata: ${JSON.stringify({ n })}\n\n`))
      }
      send()
      timer = setInterval(send, 1000)

      // клієнт закрив вкладку чи EventSource — прибираємо таймер
      request.signal.addEventListener('abort', () => {
        clearInterval(timer)
        console.log('SSE: клієнт відʼєднався')
        controller.close()
      })
    },
    cancel() {
      clearInterval(timer)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
```

`curl -N --max-time 3.5` отримує події `1`, `2`, `3`, `4` з інтервалом у секунду, а коли `curl` обриває зʼєднання, у лозі сервера зʼявляється `SSE: клієнт відʼєднався`. Без підписки на `request.signal` таймер крутився б вічно для кожного закритого клієнта — класичний витік памʼяті в довгоживучому процесі. `no-transform` просить проміжні проксі не стискати й не буферизувати потік.

Межі платформи: на serverless-хостингах обробник обмежений таймаутом (`maxDuration`), не ділить памʼять між запитами, і **WebSockets не працюють**. SSE на кілька хвилин — нормально, тож клієнт мусить уміти перепідключатися. Для AI-стрімів бери AI SDK (тема 49 основного посібника), а не застарілий приклад зі `StreamingTextResponse` з документації.

> [!quiz] Перевір себе: життєвий цикл SSE-запиту
> level: middle · type: order · id: nextjs-core-19-quiz-07
>
> ```order
> Браузер відкриває EventSource на /api/events
> Сервер відповідає 200 і Content-Type: text/event-stream
> Приходить перша подія: id, event, data і порожній рядок
> Наступні події надходять щосекунди за setInterval
> Користувач закриває вкладку
> request.signal спрацьовує подією abort
> Обробник викликає clearInterval і controller.close()
> Сервер змінює статус на 500, якщо наступна подія впала ✗
> ```
>
> **Пояснення:** статус і заголовки відправляються першими, тож `200` уже не змінити: помилку посеред потоку передають окремою подією. Без підписки на `abort` таймер крутився б вічно для кожного закритого клієнта.

### 🌐 CORS і OPTIONS

**CORS** (Cross-Origin Resource Sharing) — правило **браузера**: JavaScript зі сторінки `https://partner.example` не прочитає відповідь з `https://shop.example`, якщо сервер явно не дозволив цей origin заголовком `Access-Control-Allow-Origin`. Origin — це схема, хост і порт. Для «простих» запитів (`GET`, `POST` з формою) браузер шле запит одразу й перевіряє заголовки відповіді. Для решти (`POST` з `Content-Type: application/json`, `PUT`, `DELETE`, власні заголовки на кшталт `Authorization`) спершу шле **preflight** — `OPTIONS` із `Origin`, `Access-Control-Request-Method` і `Access-Control-Request-Headers` — і лише після дозволу справжній запит.

Тобі потрібен CORS, лише якщо твій API викликає **браузер з іншого origin**. Твої ж сторінки на тому самому домені, мобільний застосунок і сервер-сервер обходяться без нього.

```ts
// lib/cors.ts — CORS з білим списком origin
const ALLOWED_ORIGINS = new Set(['https://partner.example', 'http://localhost:5173'])

export function corsHeaders(origin: string | null): Headers {
  const headers = new Headers({ Vary: 'Origin' })
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    headers.set('Access-Control-Max-Age', '600')
  }
  return headers
}
```

```ts
// app/api/public/products/route.ts — API для чужого фронтенду (інший origin)
import { corsHeaders } from '@/lib/cors'
import { listProducts } from '@/lib/products'

// preflight: браузер питає дозволу перед POST з JSON
export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) })
}

export async function GET(request: Request) {
  const products = (await listProducts()).map(({ id, title, price }) => ({ id, title, price }))
  return Response.json(products, { headers: corsHeaders(request.headers.get('origin')) })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ received: body }, { status: 201, headers: corsHeaders(request.headers.get('origin')) })
}
```

Деталі, на яких зрізаються:

- **Відбивай дозволений origin, а не `*`.** `*` не працює разом з cookies (`credentials: 'include'`) і відкриває API кожному сайту.
- **`Vary: Origin` обовʼязковий**, коли відповідь залежить від origin: інакше CDN закешує відповідь з дозволом для партнера й віддасть її всім (чи навпаки — без дозволу партнеру).
- **Свій `OPTIONS` замінює автоматичний.** Автоматичний відповідає `204` лише з `allow`, без жодного `Access-Control-*`, тож для preflight його недостатньо.
- **`Access-Control-Max-Age`** дозволяє браузеру кешувати результат preflight і не питати перед кожним запитом.

Головне: **CORS не захищає сервер.** Ось що відбувається, коли сторінка з недозволеного origin (`https://evil.example`) робить два запити до такого API:

| Запит зі сторінки | Що отримав сервер | Що побачив JavaScript |
|---|---|---|
| `fetch(url)` — простий `GET` | `GET` **виконався** — обробник відпрацював | `TypeError: Failed to fetch`, у консолі `No 'Access-Control-Allow-Origin' header is present` |
| `POST` з `Content-Type: application/json` | лише `OPTIONS`; сам `POST` **не надійшов** | `TypeError: Failed to fetch`, `Response to preflight request doesn't pass access control check` |
| `curl -H 'Origin: https://evil.example'` | `GET` виконався | `200` і повний JSON: `curl` правил CORS не знає |

CORS лише не дає чужому сайту **прочитати** відповідь у браузері. Дані захищає автентифікація в обробнику, а підроблені запити з браузера — CSRF-заходи (розділ про безпеку нижче).

Якщо однакові CORS-заголовки потрібні десяткам маршрутів, їх виносять у `headers()` у `next.config.ts` (статичний список) або в `proxy.ts` (логіка з білим списком) — [[Next.js - 06. proxy.ts, redirects і rewrites]].

> [!diagram] Preflight: браузер питає дозволу
> ```yaml
> layout: timeline
> nodes:
>   - { id: js, at: "0 мс", label: "partner.example", code: "fetch(api, { method: 'POST',\n  headers: { 'Content-Type': 'application/json' } })", tone: gray, icon: "px:monitor" }
>   - { id: pre, at: "+1 мс", label: "браузер → сервер", code: "OPTIONS /api/public/products\nOrigin: https://partner.example\nAccess-Control-Request-Method: POST", note: "тіла ще немає", tone: yellow }
>   - { id: ok, at: "+5 мс", label: "сервер → браузер", code: "204 No Content\nAccess-Control-Allow-Origin: https://partner.example\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\nVary: Origin", tone: blue, icon: "px:server" }
>   - { id: real, at: "+6 мс", label: "браузер → сервер", code: "POST /api/public/products\nOrigin: https://partner.example", note: "лише тепер — справжній запит", tone: violet }
>   - { id: done, at: "+10 мс", label: "сервер → браузер", code: "201 Created\nAccess-Control-Allow-Origin: https://partner.example", note: "JavaScript читає відповідь", tone: green, icon: "px:check" }
> steps:
>   - { show: js, note: "Код на чужому origin шле POST з JSON. Такий запит не «простий», тож браузер його притримує." }
>   - { show: pre, note: "Браузер сам шле OPTIONS: звідки запит, яким методом і з якими заголовками. Твій POST-обробник ще не викликано." }
>   - { show: ok, note: "OPTIONS-обробник відповідає дозволом для цього origin. Без цих заголовків браузер зупинився б тут, а POST на сервер не потрапив би взагалі." }
>   - { show: real, note: "Дозвіл є — браузер відправляє справжній POST з тілом." }
>   - { show: done, note: "Відповідь теж мусить мати Access-Control-Allow-Origin, інакше JavaScript отримає TypeError, хоча сервер усе виконав." }
> ```
> З `Access-Control-Max-Age: 600` наступні 10 хвилин браузер пропускатиме preflight для цього URL.

> [!quiz] Перевір себе: правдиві твердження про CORS
> level: middle · type: multi · id: nextjs-core-19-quiz-08
>
> - [x] CORS обмежує, чи може JavaScript у браузері прочитати відповідь іншого origin
> - [x] `POST` з `Content-Type: application/json` з іншого origin спершу викликає preflight `OPTIONS`
> - [x] Якщо відповідь залежить від origin (ти його відбиваєш), потрібен `Vary: Origin`
> - [ ] CORS блокує `curl` із підробленим заголовком `Origin`
> - [ ] `Access-Control-Allow-Origin: *` можна поєднувати з `credentials: 'include'`
> - [ ] Автоматична відповідь Next.js на `OPTIONS` достатня для preflight
> - [ ] CORS замінює автентифікацію: чужий сайт без дозволу не отримає даних
>
> **Пояснення:** CORS — правило браузера. `curl` його не знає, простий `GET` з чужого сайту все одно виконується на сервері, тож даних CORS не захищає. `*` не працює з cookies, а автоматичний `OPTIONS` містить лише `allow` і жодного `Access-Control-*`, тому для preflight потрібен власний обробник.

### 🪝 Вебхуки: сирий body, підпис, ідемпотентність

**Вебхук** — HTTP-запит, яким сторонній сервіс повідомляє про подію: оплата пройшла, у CMS змінили товар, у GitHub зʼявився push. Твій Route Handler — публічна адреса, тож надіслати на неї «оплата пройшла» може будь-хто. Тому кожен серйозний провайдер **підписує** запит: рахує HMAC від тіла з секретом, відомим лише вам двом, і кладе результат у заголовок. Ти рахуєш той самий HMAC і порівнюєш.

Три правила, які ламають найчастіше:

1. **Підпис рахують від сирих байтів.** Читай `request.text()`, перевіряй підпис і лише потім `JSON.parse`. `request.json()` з повторною серіалізацією дасть інший рядок (пробіли, порядок ключів, екранування) — і підпис не зійдеться.
2. **Порівнюй за сталий час.** `===` на рядках виходить на першому відмінному символі, і за часом відповіді можна підбирати підпис посимвольно. `timingSafeEqual` з `node:crypto` порівнює всі байти завжди.
3. **Перевіряй мітку часу.** Підписують `timestamp.body`, а запити старші за кілька хвилин відкидають — так перехоплений запит не можна відтворити через тиждень (replay attack).

```ts
// lib/webhook.ts — перевірка підпису вебхука (схема як у Stripe: t=…,v1=…)
import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

const TOLERANCE_SECONDS = 300

export function verifySignature(rawBody: string, header: string | null, secret: string, now = Date.now()): boolean {
  if (!header) return false
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=') as [string, string]))
  const timestamp = Number(parts.t)
  if (!Number.isFinite(timestamp) || Math.abs(now / 1000 - timestamp) > TOLERANCE_SECONDS) return false

  const expected = createHmac('sha256', secret).update(`${parts.t}.${rawBody}`).digest('hex')
  const received = parts.v1 ?? ''
  if (received.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected))
}
```

Перевірка довжини перед `timingSafeEqual` обовʼязкова: на буферах різної довжини він кидає виняток. Друга половина — **ідемпотентність**. Провайдери гарантують доставку «щонайменше раз»: якщо твоя відповідь затрималась, той самий вебхук прийде знову. Обробка двічі — це два листи, два нарахування бонусів, дві відправки. Кожна подія має унікальний `id`; запамʼятай оброблені й на повтор відповідай `200` без роботи.

```ts
// app/api/webhooks/cms/route.ts — CMS повідомляє, що товар змінився
import { revalidateTag } from 'next/cache'
import { verifySignature } from '@/lib/webhook'

// у продакшні — таблиця processed_events з унікальним ключем, а не памʼять процесу
const processed = new Set<string>()

export async function POST(request: Request) {
  const raw = await request.text() // сирий body: підпис рахують саме від цих байтів
  const ok = verifySignature(raw, request.headers.get('x-cms-signature'), process.env.CMS_WEBHOOK_SECRET!)
  if (!ok) return Response.json({ error: 'invalid signature' }, { status: 401 })

  const event = JSON.parse(raw) as { id: string; type: string; productId?: string }
  if (processed.has(event.id)) {
    return Response.json({ received: true, duplicate: true })
  }
  processed.add(event.id)

  if (event.type === 'product.updated' && event.productId) {
    revalidateTag(`product-${event.productId}`, { expire: 0 })
    revalidateTag('products', { expire: 0 })
  }
  return Response.json({ received: true })
}
```

Що відповідає цей обробник на `next start`:

| Запит | Відповідь |
|---|---|
| без підпису, чужий секрет чи стара мітка часу | `401 {"error":"invalid signature"}` |
| змінені байти тіла — навіть той самий JSON з пробілами | `401` |
| коректний запит удруге | `200 {"received":true,"duplicate":true}` |

`Set` у памʼяті — лише для прикладу: у продакшні це таблиця з унікальним ключем на `event.id`. Важку роботу ставлять у чергу чи `after()` (тема 25 основного посібника): повільну відповідь провайдер вважає збоєм і повторює запит.

**Ревалідація з вебхука.** Пам'ятаєш застарілий `404` для `/api/products/3`? Після створення товару `GET /api/products` і `/api/products/3` віддають старе, бо обидва закешовані з тегом `products`. Вебхук — природне місце це виправити. `updateTag()` тут недоступний — лише в Server Actions. Виклик з Route Handler дає `500` і в лозі:

```text
Error: updateTag can only be called from within a Server Action. To invalidate cache tags in Route Handlers or other contexts, use revalidateTag instead.
```

Лишається `revalidateTag(tag, profile)`: з `'max'` перший запит після вебхука ще отримує старе (`STALE`), з `{ expire: 0 }` — чекає свіжих даних (`MISS`), тож для вебхуків документація радить саме його ([[Next.js - 16. Ревалідація]]).

> [!diagram] Вебхук від підпису до свіжого кешу
> ```yaml
> layout: flow
> nodes:
>   - { id: cms, label: "CMS", code: "POST /api/webhooks/cms\nx-cms-signature: t=…,v1=…", tone: gray, icon: "px:globe" }
>   - { id: raw, label: "Route Handler", code: "const raw = await request.text()", note: "сирі байти", tone: violet }
>   - { id: sig, label: "verifySignature", code: "HMAC(secret, t + '.' + raw)\ntimingSafeEqual", note: "інакше 401", tone: blue, icon: "px:shield" }
>   - { id: dup, label: "ідемпотентність", text: "event.id уже був?", note: "так → 200 duplicate", tone: yellow }
>   - { id: rv, label: "next/cache", code: "revalidateTag('products', { expire: 0 })", tone: orange, icon: "px:tag" }
>   - { id: next, label: "наступний GET", text: "MISS → свіжі дані", tone: green, icon: "px:check" }
> steps:
>   - { focus: cms, note: "CMS підписала тіло секретом і шле POST на твою публічну адресу." }
>   - { move: { from: cms, to: raw, value: "{\"id\":\"evt_1\",…}" }, note: "Обробник читає тіло як текст. Не json(): підпис рахували саме від цих байтів." }
>   - { move: { from: raw, to: sig, value: "raw" }, line: "sig:2", note: "Той самий HMAC з тим самим секретом, порівняння за сталий час і перевірка мітки часу. Не зійшлося — 401, далі не йдемо." }
>   - { show: dup, note: "Провайдер міг надіслати подію вдруге. Якщо id уже оброблено, відповідаємо 200 і нічого не робимо." }
>   - { show: rv, note: "Нова подія: протерміновуємо теги. updateTag тут недоступний — він лише для Server Actions." }
>   - { show: next, note: "Перший же GET після цього чекає свіжих даних (MISS), а не віддає застаріле, як з профілем 'max'." }
> ```
> Відповідай швидко: важку роботу — у чергу чи `after()`, інакше провайдер повторить запит.

> [!quiz] Перевір себе: що побачить перший GET після ревалідації
> level: middle · type: output · id: nextjs-core-19-quiz-09
>
> `/api/catalog` віддає список із `getCatalog()` (`'use cache'`, `cacheLife('hours')`, `cacheTag('products')`) і вже прогрітий кеш із двома товарами. Адмін створив третій товар, і вебхук викликав:
>
> ```ts
> revalidateTag('products', 'max')
> ```
>
> Що повернуть два наступні `curl -i /api/catalog` (заголовок `x-nextjs-cache`)?
>
> - [ ] перший: новий список, `MISS`; другий: новий список, `HIT`
> - [ ] перший і другий: старий список, `HIT`, доки не мине година `cacheLife`
> - [x] перший: старий список, `STALE`; другий: новий список, `HIT`
> - [ ] перший: старий список, `HIT`; другий: новий список, `HIT`
>
> **Пояснення:** профіль `'max'` — це stale-while-revalidate: перший запит одразу отримує застаріле, а перебудова йде у фоні. Варіант «новий список, `MISS`» — це поведінка `revalidateTag('products', { expire: 0 })`, яку радять для вебхуків, коли зміна має бути видна відразу. Тег протермінований одразу, тож чекати години не доведеться; але перший запит усе одно відповідає старим із позначкою `STALE`, а не `HIT`.

> [!quiz] Перевір себе: чому підпис не сходиться
> level: middle · type: single · id: nextjs-core-19-quiz-10
>
> ```ts
> export async function POST(request: Request) {
>   const body = await request.json()
>   const expected = hmac(secret, JSON.stringify(body))
>   if (expected !== request.headers.get('x-signature')) {
>     return Response.json({ error: 'invalid signature' }, { status: 401 })
>   }
>   // ...
> }
> ```
>
> Провайдер підписує тіло правильно, секрет теж правильний, але перевірка завжди дає `401`. Чому?
>
> - [ ] Секрет перед `hmac` треба кодувати в base64
> - [ ] Заголовок `x-signature` вирізає проксі між провайдером і Next.js
> - [ ] `request.json()` «зʼїдає» тіло, тож `JSON.stringify(body)` повертає порожній рядок
> - [x] Повторна серіалізація дає інші байти (пробіли, порядок ключів, екранування), а підпис рахують від оригінальних
>
> **Пояснення:** підпис рахують від сирих байтів, які надіслав провайдер. `JSON.stringify` не відтворює їх один в один. Правильно: `const raw = await request.text()`, перевірити підпис від `raw` і лише потім `JSON.parse(raw)`. Тіло після `json()` нікуди не зникає, а проксі не чіпає тіло й підпис.

### 🧱 Backend-for-Frontend: проксі з розумом

Типова архітектура: внутрішній бекенд з API-ключем і форматом, зручним бекенду, а не UI. Ходити до нього з браузера — це ключ у клієнтському коді, зайві поля й фронтенд, що ламається від кожної зміни бекенду. BFF ставить між ними Route Handler, що:

- **автентифікує користувача** своєю сесією (cookie твого домену);
- **ходить у бекенд від імені застосунку**, з ключем із серверної змінної середовища;
- **формує DTO**: лише потрібні поля, у форматі UI (гривні замість копійок, `paid` замість `PAID`);
- **перекладає збої**: таймаут і недоступність бекенду не повинні вішати чи валити твій API.

```ts
// app/api/bff/orders/route.ts — BFF: сесія → бекенд із секретним ключем → DTO
import { getUser } from '@/lib/session'

type BackendOrder = {
  order_id: string
  customer_id: string
  total_cents: number
  status: 'NEW' | 'PAID' | 'SHIPPED'
  internal_notes: string
  card_last4: string
}

export async function GET() {
  const user = await getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  let res: Response
  try {
    res = await fetch(`${process.env.BACKEND_URL}/orders?customer=${encodeURIComponent(user.id)}`, {
      headers: { Authorization: `Bearer ${process.env.BACKEND_API_KEY}` },
      signal: AbortSignal.timeout(3000),
    })
  } catch {
    return Response.json({ error: 'upstream unavailable' }, { status: 504 })
  }
  if (!res.ok) return Response.json({ error: 'upstream error' }, { status: 502 })

  const orders = (await res.json()) as BackendOrder[]
  // DTO: лише те, що потрібно UI, у форматі UI
  return Response.json(
    orders.map((o) => ({ id: o.order_id, total: o.total_cents / 100, status: o.status.toLowerCase() })),
  )
}
```

Бекенд віддає `internal_notes: 'VIP, знижка 10%'` і `card_last4`, а браузер з cookie сесії отримує лише `[{"id":"o-1","total":850,"status":"paid"}]`. Без cookie — `401`, з вимкненим бекендом — `504` за мілісекунди замість зависання. Зверни увагу: `customer` бере `user.id` **із сесії**, а не з рядка запиту. Якби клієнт передавав `?customer=u7`, будь-хто читав би чужі замовлення (IDOR, тема 28 основного посібника).

Ще правила BFF:

- **Заголовки — білим списком.** `new Request(url, request)` переносить у бекенд усі заголовки клієнта, включно з cookies, а внутрішні `x-*` і `set-cookie` бекенду не повинні потрапити до браузера.
- **Чутливі параметри — у тілі `POST`**, не в URL: `GET` кешується й осідає в логах.
- **Rate limiting** у коді й на платформі (тема 42 основного посібника): публічний BFF — дешевий спосіб змусити тебе платити за чужий бекенд чи AI-модель.
- **Проксі без логіки** — це `rewrites` чи `proxy.ts` ([[Next.js - 06. proxy.ts, redirects і rewrites]]), а не catch-all Route Handler.

> [!quiz] Перевір себе: звідки BFF бере id клієнта
> level: middle · type: single · id: nextjs-core-19-quiz-11
>
> ```ts
> // app/api/bff/orders/route.ts
> export async function GET(request: NextRequest) {
>   const customerId = request.nextUrl.searchParams.get('customer')
>   const res = await fetch(`${process.env.BACKEND_URL}/orders?customer=${customerId}`, {
>     headers: { Authorization: `Bearer ${process.env.BACKEND_API_KEY}` },
>   })
>   return Response.json(await res.json())
> }
> ```
>
> Що тут найбільша проблема?
>
> - [ ] Ключ `BACKEND_API_KEY` з `fetch` на сервері потрапить у браузер
> - [ ] `GET` не можна використовувати для запитів з ключем, потрібен `POST`
> - [x] Будь-хто підставить чужий `customer` і прочитає чужі замовлення (IDOR): id треба брати із сесії
> - [ ] `searchParams` у Route Handler — Promise, і без `await` отримаємо порожній id
>
> **Пояснення:** обробник довіряє id з URL і йде в бекенд із ключем застосунку, який має доступ до всіх клієнтів. У правильному BFF є `const user = await getUser()` і запит `?customer=${user.id}`. Серверний ключ у браузер не йде, метод `GET` до проблеми не стосується, а `request.nextUrl.searchParams` читається синхронно.

### 🧮 Route Handler, Server Action чи Server Component

Три способи виконати код на сервері легко сплутати. Відрізняє їх, **хто клієнт** і **що за операція**:

| Задача | Обирай | Чому |
|---|---|---|
| Показати дані на сторінці свого застосунку | Server Component (+ `'use cache'`) | дані читаються під час рендеру, без HTTP-запиту й без API |
| Мутація з форми чи кнопки свого UI | Server Action | одна функція, валідація й ревалідація в одній відповіді, перевірка Origin вбудована |
| Вебхук від стороннього сервісу | Route Handler | потрібна стабільна публічна URL, сирий body і свій статус-код |
| API для мобільного застосунку чи партнера | Route Handler | HTTP-контракт: методи, статуси, версіонування, CORS |
| Не-UI відповідь: RSS, CSV, файл, `llms.txt` | Route Handler (або metadata-файли: `sitemap.ts`, `robots.ts`) | довільний `Content-Type` |
| OAuth / платіжний callback з редиректом | Route Handler | `GET` з параметрами, cookie й `NextResponse.redirect` |
| Стрім AI-відповіді чи прогресу | Route Handler | `ReadableStream`, SSE |
| Клієнт часто опитує дані (polling), нескінченна стрічка | Route Handler + SWR / TanStack Query | `GET`, який можна кешувати; Server Actions для читання не годяться |
| Простий проксі на інший домен | `rewrites` / `proxy.ts` | без коду обробника |

Server Action — теж `POST`-запит, але на URL **сторінки**, з внутрішнім id дії в заголовку; цей id генерується під час збірки й змінюється з новою, тож для зовнішніх клієнтів дія не годиться (тема 21 основного посібника). Ще документація зазначає: дії одного клієнта виконуються **по черзі**, тож читати ними дані — означає вишикувати запити в чергу.

Найпоширеніша помилка — **Server Component, що ходить у власний Route Handler**:

```tsx
// ❌ Server Component ходить у власний Route Handler
async function getItems() {
  'use cache'
  const res = await fetch('http://localhost:3000/api/items')
  return (await res.json()) as { id: number }[]
}

export default async function SelfPage() {
  const items = await getItems()
  return <p>{items.length}</p>
}
```

Під час `next build` сервера ще немає, тож пререндер падає з `TypeError: fetch failed` і `code: 'ECONNREFUSED'`. Без `'use cache'` збірка зупиниться раніше: `Next.js encountered uncached or runtime data during prerendering`. А в рантаймі це зайвий HTTP-круг до самого себе й абсолютна адреса, різна в dev і production. Правильно — викликати ту саму функцію даних (`listItems()` з DAL) і в сторінці, і в Route Handler, якщо API теж потрібен.

> [!quiz] Перевір себе: Route Handler чи Server Action
> level: middle · type: single · id: nextjs-core-19-quiz-12
>
> Три задачі: (1) вебхук від Stripe, (2) кнопка «Додати в обране» на сторінці твого ж застосунку, (3) мобільний застосунок читає каталог товарів. Що обрати для кожної (за порядком)?
>
> - [ ] Server Action / Server Action / Server Action: усе це `POST`-запити на сервер
> - [ ] Route Handler / Route Handler / Route Handler: так одноманітніше
> - [ ] Route Handler / Server Action / Server Action: мобільний застосунок теж просто викликає функцію
> - [x] Route Handler / Server Action / Route Handler
> - [ ] Server Action / Server Action / Route Handler: вебхук приймає функція без публічної адреси
>
> **Пояснення:** Stripe потребує стабільної публічної URL і сирого body, а id Server Action змінюється з кожною збіркою, тож зовнішні клієнти її не викличуть. Кнопка у своєму UI — мутація з вбудованою перевіркою Origin і оновленням UI в одній відповіді. Мобільному застосунку потрібен HTTP-контракт із методами, статусами й версіями.

### 🔐 Безпека: кожен обробник — публічні двері

Route Handler доступний **кожному**, хто знає URL. Посилання на нього в UI немає? Не має значення: адреси видно в DevTools, у бандлі, в історії. Звідси правила (детально — теми 27 і 30 основного посібника):

- **Сесія й права — у кожному обробнику**, біля даних, з перевіркою власника ресурсу (`401` — немає сесії, `403` — ресурс чужий). Лише `proxy.ts` замало: його покриття визначає `matcher`, і документація прямо радить не покладатися на proxy для auth.
- **CSRF для мутацій з cookie-сесією.** Server Actions мають вбудований захист (лише `POST` і порівняння `Origin` з `Host`), Route Handlers — **ні**: `POST /api/transfer` з cookie-автентифікацією можна викликати формою з чужого сайту. Захист: `SameSite=Lax`/`Strict`, перевірка `Origin`, CSRF-токен або `Authorization` замість cookie.
- **Вхід і вихід під контролем.** Валідуй тип, розмір і формат тіла, екрануй ввід у HTML/XML; назовні — DTO і загальні тексти помилок; `GET` — без побічних ефектів (його кешують і повторюють, а для `ƒ` і `HEAD` викликає твій `GET`).

### 🧯 Типові помилки і як їх читати

| Повідомлення / симптом | Що сталося | Що зробити |
|---|---|---|
| `Conflicting route and page at /x: route at /x/route and page at /x/page` | `route.ts` і `page.tsx` в одному сегменті | перенести API в `app/api/x/route.ts` |
| `405 Method Not Allowed` (з `Allow` лише для `○`) | метод не експортовано | додати експорт або виправити метод клієнта |
| `Type '"/x/[slug]"' does not satisfy the constraint 'AppRouteHandlerRoutes'` | літерал `RouteContext` не збігається з папкою | взяти шлях з дерева `app/` дослівно |
| `TypeError: Body is unusable: Body has already been read` | тіло прочитано двічі | читати один раз або `request.clone()` до першого читання |
| `500` з порожнім тілом і `⨯ SyntaxError … in JSON` у лозі | `request.json()` на невалідному тілі без `try` | `try/catch` → `400` |
| `Only plain objects, and a few built-ins, can be passed to Client Components…` під час збірки Route Handler | `'use cache'` прямо в `GET`: кешується `Response` | директиву — у допоміжну функцію, що повертає дані |
| `updateTag can only be called from within a Server Action` | `updateTag` у Route Handler | `revalidateTag(tag, { expire: 0 })` |
| `GET` став `ƒ`, хоча дані в `'use cache'` | у файлі є інший метод | розділити читання й запис по файлах |
| `TypeError: fetch failed`, `ECONNREFUSED` під час `next build` | Server Component робить `fetch` до власного API | викликати функцію даних напряму |
| у браузері `blocked by CORS policy`, у `curl` усе працює | немає `Access-Control-Allow-Origin` для цього origin або свого `OPTIONS` | білий список, `OPTIONS`-обробник, `Vary: Origin` |
| вебхук завжди `401`, хоча секрет правильний | підпис рахують від `JSON.stringify(await request.json())` | `request.text()`, підпис від сирих байтів |

### 🏭 Як це роблять у продакшні

- **Тонкий обробник, логіка в модулях.** `route.ts` розбирає запит, викликає функцію з DAL (`import 'server-only'`) і мапить результат на статус. Ту саму функцію викликають Server Components і Server Actions, а юніт-тести перевіряють її без HTTP (тема 40 основного посібника).
- **Схема на вході, DTO на виході**, обгортка `withAuth(handler)` з `401`/`403` на кожному маршруті й `requestId` у лозі замість стеку у відповіді.
- **Читання й запис — у різних файлах**: публічний `GET` лишається `○` з `cacheLife`, мутації — `ƒ`.
- **Вебхуки** перевіряють SDK провайдера (наприклад, `stripe.webhooks.constructEvent`), пишуть подію в таблицю оброблених і відповідають `2xx` до важкої роботи.
- **BFF і CORS**: таймаути на кожен `fetch`, `502`/`504` при збоях, rate limiting, `/api/v1/...` для зовнішніх клієнтів; CORS — лише там, де справді є чужі origin.

## ⚠️ Пастки

> [!pitfall] Перевірка доступу лише в proxy.ts
> Matcher не покрив новий маршрут — і він відкритий. Proxy — для оптимістичного редиректу, а сесію й права перевіряє кожен обробник.
>
> ```ts
> export async function DELETE(_req: Request, ctx: RouteContext<'/api/orders/[id]'>) {
>   const user = await getUser()
>   if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })
>   // ✅ далі — перевірка власника замовлення в DAL
> }
> ```

> [!pitfall] POST поруч із GET, який мав бути статичним
> На 16.3.8 будь-який додатковий метод у файлі робить маршрут `ƒ`: пререндеру й заголовків для CDN більше немає.
>
> ```text
> app/api/products/route.ts         GET (публічний каталог)  → ○ 1h 1d
> app/api/admin/products/route.ts   POST, PATCH, DELETE      → ƒ
> ```

> [!pitfall] Вебхук через request.json()
> Повторна серіалізація змінює байти, і справжній підпис не сходиться. Читай `text()`, перевіряй, потім `JSON.parse`.
>
> ```ts
> const raw = await request.text() // ✅
> // const body = await request.json(); sign(JSON.stringify(body)) // ❌
> ```

> [!pitfall] CORS як захист API
> CORS обмежує лише читання відповіді JavaScript-ом у браузері. Простий `GET` з чужого сайту виконується на сервері, `curl` ігнорує CORS повністю. Дані захищає автентифікація.

> [!pitfall] SSE без прибирання
> Клієнт закрив вкладку, а `setInterval` крутиться далі — на кожне відʼєднання. Слухай `request.signal` і реалізуй `cancel()` у потоці.
>
> ```ts
> request.signal.addEventListener('abort', () => clearInterval(timer))
> ```

> [!pitfall] Server Component ходить у власний API
> На збірці — `fetch failed` (сервера ще немає), у рантаймі — зайвий HTTP-круг і абсолютні URL. Виклич функцію даних напряму.
>
> ```tsx
> const items = await listItems() // ✅ замість fetch('http://localhost:3000/api/items')
> ```

## 🎤 На співбесіді

> [!interview] Коли ти обереш Route Handler, а коли Server Action?
> level: middle · frequency: дуже часто · id: nextjs-core-19-int-01
>
> ---
>
> Server Action — для мутацій з UI мого ж застосунку: це функція, яку React викликає `POST`-запитом на URL сторінки, з вбудованою перевіркою Origin, і в одній відповіді повертає результат і оновлений UI. Її id генерується під час збірки й змінюється з новою, а дії одного клієнта виконуються послідовно, тож для читання даних і зовнішніх клієнтів вона не годиться. Route Handler — коли потрібен HTTP-контракт: вебхуки, API для мобільного застосунку чи партнерів, не-UI відповіді, OAuth-callback, стріми, `GET` для клієнтського polling. А дані для власних сторінок не потребують жодного з двох: Server Component читає їх напряму, без HTTP.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🧮 Route Handler, Server Action чи Server Component|Розділ: як обрати]] · [Next.js: Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend) · [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

> [!interview] Як правильно прийняти вебхук від платіжної системи?
> level: middle · frequency: часто · id: nextjs-core-19-int-02
>
> ---
>
> Прочитати сирий body через `request.text()` і перевірити HMAC-підпис з секретом провайдера — від тих самих байтів, порівнянням за сталий час (`timingSafeEqual`) і з перевіркою мітки часу проти replay. Лише потім `JSON.parse`. Далі ідемпотентність: провайдер доставляє «щонайменше раз», тож оброблені `event.id` зберігаю в таблиці з унікальним ключем і на повтор відповідаю `200` без роботи. Відповідаю швидко, а важке — у чергу чи `after()`. Якщо подія змінює дані, що закешовані, — `revalidateTag(tag, { expire: 0 })`, бо `updateTag` у Route Handler недоступний.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🪝 Вебхуки: сирий body, підпис, ідемпотентність|Розділ: вебхуки]] · [Next.js: revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) · [Stripe: Verify webhook signatures](https://docs.stripe.com/webhooks#verify-events)

> [!interview] Чи кешується GET Route Handler у Next.js 16?
> level: middle · frequency: часто · id: nextjs-core-19-int-03
>
> ---
>
> З Next.js 15 за замовчуванням — ні. З Cache Components `GET` поводиться як сторінка: якщо на збірці він не читає запит, `cookies()`/`headers()`, некешовані мережу чи БД і недетерміновані значення, відповідь пререндериться (`○` у `next build`). Повільні дані кешують `'use cache'` з `cacheLife` у допоміжній функції — у тілі обробника директива не працює. Для динамічних сегментів — `generateStaticParams` (`●`). Інші методи не кешуються; на 16.3.8 їхня присутність у тому самому файлі робить увесь маршрут `ƒ`, тому публічне читання виношу в окремий файл. Перевіряю символом у таблиці збірки й `curl -sI` (`x-nextjs-cache`, `cache-control`).
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🧊 Статичний чи динамічний GET під Cache Components|Розділ: GET під Cache Components]] · [Next.js: Route Handlers — Caching](https://nextjs.org/docs/app/getting-started/route-handlers#caching) · [Next.js: Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)

> [!interview] Що таке CORS, і чи захищає він твій API?
> level: middle · frequency: часто · id: nextjs-core-19-int-04
>
> ---
>
> Це політика браузера: JavaScript з одного origin може прочитати відповідь іншого, лише якщо сервер дозволив це `Access-Control-Allow-Origin`. Для не-простих запитів браузер спершу шле preflight `OPTIONS`, тож у Route Handler пишу свій `OPTIONS` з білим списком origin, відбиваю дозволений origin (не `*`, якщо є cookies) і додаю `Vary: Origin` для CDN. Але API він не захищає: простий `GET` з чужого сайту доходить і виконується, а `curl` правил CORS не знає. Захист — автентифікація, авторизація й CSRF-заходи в обробнику.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🌐 CORS і OPTIONS|Розділ: CORS]] · [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) · [Next.js: route.js — CORS](https://nextjs.org/docs/app/api-reference/file-conventions/route#cors)

> [!interview] Навіщо Backend-for-Frontend, якщо є готовий бекенд з API?
> level: senior · frequency: іноді · id: nextjs-core-19-int-05
>
> ---
>
> Щоб браузер не говорив з бекендом напряму. BFF автентифікує користувача сесією свого домену, а в бекенд ходить із серверним ключем, якого клієнт не бачить. Він формує DTO під UI — лише потрібні поля, зручні формати, агрегацію кількох сервісів — і цим відвʼязує фронтенд від змін бекенду. Ще він ставить таймаути й мапить збої на `502`/`504`, обмежує частоту запитів і не дає підставити чужий id (id користувача — із сесії). Ціна — ще один шар і мережевий круг, тож для простого прокидання без логіки досить `rewrites`, а для даних власних сторінок — Server Components без жодного API.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🧱 Backend-for-Frontend: проксі з розумом|Розділ: BFF]] · [Next.js: Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend) · [Sam Newman: Backends For Frontends](https://samnewman.io/patterns/architectural/bff/)

## 🔗 Звʼязки

- [[Next.js - 10. Статичний і динамічний рендеринг]] — правила, за якими `GET` стає `○` чи `ƒ`, і як читати заголовки `curl -I`.
- [[Next.js - 15. Cache Components і use cache]] — `'use cache'`, `cacheLife`, `cacheTag` і серіалізація результату (чому не можна кешувати `Response`).
- [[Next.js - 16. Ревалідація]] — `revalidateTag` з профілем, `updateTag` у Server Actions, `{ expire: 0 }` для вебхуків.
- [[Next.js - 06. proxy.ts, redirects і rewrites]] — CORS і перевірки для багатьох маршрутів, `rewrites` як простий проксі, чому proxy не межа безпеки.
- [[Next.js - 03. Динамічні маршрути]] — async `params`, catch-all, `generateStaticParams`.
- [[Next.js - 20. Бази даних і клієнтський fetching]] — справжня БД за обробником і SWR / TanStack Query на клієнті.
- Далі в курсі: тема 21 основного посібника — Server Actions під капотом, 25 — `after()` і фонові задачі, 27–30 — автентифікація, авторизація, безпека даних і CSRF.

## ⚡ Фішки

> [!reel] 🚫 PUT на GET-маршрут — це 405, а не 404
> Метод, якого немає в `route.ts`, Next.js відхиляє сам. Статичний `○` маршрут: `405`, тіло `Method Not Allowed` і два рядки `Allow` (`GET`, `HEAD`). Динамічний `ƒ`: теж `405`, але без `Allow` і з порожнім тілом.

> [!reel] 🔍 HEAD запускає твій GET
> У динамічному `ƒ` маршруті окремого `HEAD` не пишуть: Next.js викликає `GET` із `request.method === 'HEAD'` і викидає тіло, тож лічильник переглядів рахує й `HEAD`. У статичному `○` `GET` не запускається взагалі: `HEAD` віддається з кешу (`HIT`).

> [!reel] 🧊 POST у файлі робить GET динамічним
> На 16.3.8 будь-який другий експорт методу (навіть порожній `OPTIONS`) перетворює `○ 1h 1d` на `ƒ`. Дані в `'use cache'` кешуються далі, зникають лише пререндер і заголовки CDN.

> [!reel] 🪤 'use cache' у тілі GET — помилка про Client Components
> Клієнтських компонентів тут нема. Кешувалася б `Response`, яку кеш не вміє серіалізувати, а повідомлення про це дивне: `Only plain objects, and a few built-ins, can be passed to Client Components…`. Кешуй дані у хелпері.

> [!reel] 🌐 CORS не зупиняє запит — лише читання
> Простий `GET` з чужого сайту виконується на сервері, а JavaScript бачить `TypeError: Failed to fetch`. Для `POST` з JSON сервер отримує лише `OPTIONS`. `curl` же дістає повний JSON.

> [!reel] ✍️ Те саме JSON з пробілами — вже інший підпис
> Підпис вебхука рахують від сирих байтів. Якщо додати пробіл після `:`, обробник відповість `401`. Тому читай `request.text()`, а не `request.json()`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке Route Handler і де він лежить?
> *дуже часто · теорія* · `nextjs-core-19-card-01`
>
> Файл `route.ts` у папці `app/`, що експортує функції з іменами HTTP-методів. Кожна приймає Web `Request` і повертає Web `Response`. Це публічна HTTP-адреса без layouts і RSC payload; папка `api/` — лише домовленість, `route.ts` може лежати де завгодно (`app/rss.xml/route.ts`).
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🧭 Навіщо Route Handlers|Розділ: навіщо Route Handlers]] · [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

> [!question]- Що Next.js робить сам, якщо метод не експортовано?
> *дуже часто · теорія* · `nextjs-core-19-card-02`
>
> Залежить від типу маршруту. Статичний `○`: `PUT` і `OPTIONS` дають `405` з двома рядками `Allow` (`GET`, `HEAD`) і тілом `Method Not Allowed`, а `HEAD` віддається з кешу (`HIT`), `GET` не запускається. Динамічний `ƒ`: невизначений метод — `405` без `Allow` і з порожнім тілом; `OPTIONS` — `204` з `allow: GET, HEAD, OPTIONS, …` (без `Access-Control-*`); `HEAD` викликає твій `GET` і відкидає тіло. Для шляхів з `generateStaticParams` (`●`) будь-який метод віддає кешоване тіло `GET`.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#📁 route.ts: методи, request і context|Розділ: методи і request]] · [Next.js: route.js — Supported HTTP methods](https://nextjs.org/docs/app/api-reference/file-conventions/route)

> [!question]- Чому `params` у Route Handler треба `await`-ити і що таке `RouteContext`?
> *часто · код* · `nextjs-core-19-card-03`
>
> `context.params` — Promise, як і в сторінках з Next.js 15. Тип `RouteContext<'/api/users/[id]'>` глобальний: його генерує Next.js (`dev`, `build`, `typegen`), імпортувати нічого не треба. Опечатка в літералі зупиняє збірку помилкою `does not satisfy the constraint 'AppRouteHandlerRoutes'`.
>
> ```ts
> export async function GET(_req: Request, ctx: RouteContext<'/api/users/[id]'>) {
>   const { id } = await ctx.params
>   return Response.json({ id })
> }
> ```
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#📁 route.ts: методи, request і context|Розділ: RouteContext]] · [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

> [!question]- Чи можуть `page.tsx` і `route.ts` лежати в одній папці?
> *часто · теорія* · `nextjs-core-19-card-04`
>
> Ні. Кожен забирає собі всі HTTP-методи URL, тож навіть `route.ts` лише з `POST` поруч зі сторінкою дає `Conflicting route and page at /x`. Рішення: API у `app/api/x/route.ts`. `app/page.tsx` і `app/api/route.ts` — різні сегменти, тому конфлікту нема.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#📁 route.ts: методи, request і context|Розділ: конфлікт з page.tsx]] · [Next.js: route.js](https://nextjs.org/docs/app/api-reference/file-conventions/route)

### 🟡 Middle

> [!question]- Які статус-коди має повертати POST-обробник і чим 401 відрізняється від 403?
> *дуже часто · практика* · `nextjs-core-19-card-05`
>
> Послідовність: немає сесії — `401`, сесія є, але роль чи власник не той — `403`, нечитабельний JSON — `400`, JSON валідний, а дані ні — `422`, створено — `201` із `Location`. `401` означає «не знаю, хто ти» (клієнт перелогінюється), `403` — «знаю, але не можна». Неперехоплений виняток дає `500` з порожнім тілом; `error.message` клієнту не віддають.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#📥 Тіло запиту, статуси й помилки|Розділ: статуси й помилки]] · [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

> [!question]- Що таке CORS і чи захищає він API?
> *часто · безпека* · `nextjs-core-19-card-08`
>
> Це політика браузера: JavaScript з іншого origin може прочитати відповідь, лише якщо сервер дозволив його заголовком `Access-Control-Allow-Origin`. Для `POST` з JSON та інших не-простих запитів браузер перед ним шле preflight `OPTIONS`. API CORS не захищає: простий `GET` виконується на сервері, `curl` ігнорує CORS. Дані захищає автентифікація, а підроблені запити з браузера — CSRF-заходи.
>
> У Route Handler: білий список, свій `OPTIONS`, відбиття origin (не `*`, якщо є cookies) і `Vary: Origin`.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🌐 CORS і OPTIONS|Розділ: CORS]] · [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

> [!question]- Як правильно перевірити підпис вебхука?
> *часто · безпека* · `nextjs-core-19-card-09`
>
> Прочитати сирий body через `request.text()`, порахувати HMAC від `timestamp.body` з секретом, порівняти за сталий час (`timingSafeEqual`, попередньо довжини) і відкинути запити зі старою міткою часу (replay attack). Лише потім `JSON.parse`. Підпис від `JSON.stringify(await request.json())` не збігається, бо байти змінились.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🪝 Вебхуки: сирий body, підпис, ідемпотентність|Розділ: вебхуки]] · [Stripe: verify webhook signatures](https://docs.stripe.com/webhooks#verify-events)

> [!question]- Чим `revalidateTag('x', 'max')` відрізняється від `{ expire: 0 }` і де `updateTag`?
> *часто · практика* · `nextjs-core-19-card-10`
>
> `'max'` — stale-while-revalidate: перший запит після ревалідації отримує старе (`STALE`), перебудова йде у фоні. `{ expire: 0 }` протерміновує запис негайно: наступний запит чекає свіжих даних (`MISS`), що й радять для вебхуків. `updateTag` працює лише в Server Actions: у Route Handler він дає `500` з текстом `updateTag can only be called from within a Server Action`.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🪝 Вебхуки: сирий body, підпис, ідемпотентність|Розділ: ревалідація з вебхука]] · [Next.js: revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

### 🔴 Senior

> [!question]- Як зробити обробку вебхука ідемпотентною у serverless?
> *часто · практика* · `nextjs-core-19-card-11`
>
> Провайдер доставляє «щонайменше раз», тож повтор неминучий. Потрібне сховище з унікальним ключем на `event.id` (таблиця `processed_events`): вставка, що падає на дублікаті, і є перевіркою, а на повтор відповідають `200` без роботи. `Set` у памʼяті процесу не годиться: у кожного інстанса свій, а після перезапуску він порожній. Подію позначають обробленою після успіху, щоб збій дозволив провайдеру повторити, а важку роботу виносять у чергу чи `after()`, щоб відповісти швидко.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🪝 Вебхуки: сирий body, підпис, ідемпотентність|Розділ: ідемпотентність]] · [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

> [!question]- Як віддати SSE з Route Handler і не отримати витік?
> *іноді · код* · `nextjs-core-19-card-12`
>
> Повернути `new Response(stream, …)` з `Content-Type: text/event-stream`, `Cache-Control: no-cache, no-transform` і подіями у форматі `id:`/`event:`/`data:` та порожнім рядком. Таймер чи підписку прибирати за `request.signal` (`abort`) і в `cancel()` потоку, інакше кожне закрите зʼєднання лишає `setInterval`. Статус вже не змінити, тож помилку передають подією. На serverless обробник обмежений `maxDuration`, WebSockets не працюють, клієнт мусить перепідключатися.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🌊 Стрімінг: ReadableStream і Server-Sent Events|Розділ: стрімінг і SSE]] · [MDN: Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

> [!question]- Чому Server Component не повинен `fetch`-ити власний Route Handler?
> *часто · практика* · `nextjs-core-19-card-13`
>
> Під час `next build` сервера ще нема: у `'use cache'` пререндер падає з `TypeError: fetch failed` (`ECONNREFUSED`), без кешу — з помилкою про некешовані дані під час пререндеру. У рантаймі це зайвий HTTP-круг, абсолютний URL, різний у dev і production, і подвійна серіалізація. Правильно викликати ту саму функцію даних з шару доступу до даних і в сторінці, і в Route Handler.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🧮 Route Handler, Server Action чи Server Component|Розділ: Server Component і власний API]] · [Next.js: Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)

> [!question]- Що має робити BFF між браузером і бекендом, і які в нього ризики безпеки?
> *іноді · безпека* · `nextjs-core-19-card-14`
>
> Автентифікувати сесією свого домену, ходити в бекенд із серверним ключем, формувати DTO (без `internal_notes` і `card_last4`), ставити таймаут і мапити збої на `502`/`504`, обмежувати частоту запитів. Ризики: id користувача лише із сесії (інакше IDOR), заголовки до бекенду й назад переносити білим списком, а кожен обробник перевіряє доступ сам, бо `proxy.ts` — не межа безпеки. Route Handlers на відміну від Server Actions не мають вбудованого CSRF-захисту: для мутацій з cookie потрібні `SameSite`, перевірка `Origin` чи токен.
>
> 📚 [[Next.js - 19. Route Handlers і Backend-for-Frontend#🔐 Безпека: кожен обробник — публічні двері|Розділ: безпека обробників]] · [Next.js: Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)

## 🛠️ Практика

> [!task] Перевір підпис вебхука
> level: middle · difficulty: medium · id: nextjs-core-19-task-01 · tags: webhooks, security, hmac
>
> У Route Handler вебхука потрібна функція `verifyWebhook`. Заголовок має вигляд `t=1700000000,v1=<підпис>`, де `t` — мітка часу в секундах, а `v1` — HMAC від рядка `` `${t}.${rawBody}` ``. Самого HMAC у раннері немає (`node:crypto` недоступний), тож його передають параметром `hmac(secret, data)`; у тестах це детермінована фейкова функція.
>
> Поверни `{ ok: true }` або `{ ok: false, reason }`, перевіряючи в такому порядку:
>
> - заголовка немає або він порожній → `'missing'`;
> - не вдалося розібрати `t` (не число) або немає `v1` → `'malformed'`;
> - мітка відрізняється від `now / 1000` більш ніж на 300 секунд, **в обидва боки** → `'expired'` (HMAC у цьому випадку не рахуємо);
> - підпис не збігається → `'mismatch'`. Порівнюй власною `safeEqual` без раннього виходу; для різної довжини вона повертає `false`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts starter
> type VerifyResult = { ok: true } | { ok: false; reason: 'missing' | 'malformed' | 'expired' | 'mismatch' }
>
> type VerifyInput = {
>   rawBody: string
>   header: string | null
>   secret: string
>   now: number // Date.now() у мілісекундах
>   hmac: (secret: string, data: string) => string
> }
>
> // порівняння за сталий час: не виходить на першому відмінному символі
> function safeEqual(a: string, b: string): boolean {
>   // твій код
>   return true
> }
>
> function verifyWebhook({ rawBody, header, secret, now, hmac }: VerifyInput): VerifyResult {
>   // ❌ довіряємо будь-якому заголовку
>   return { ok: true }
> }
> ```
>
> ```ts tests
> // фейкова детермінована «HMAC»: залежить і від секрету, і від даних
> const hmac = (secret: string, data: string) => {
>   let h = 7
>   for (const ch of `${secret}|${data}`) h = (h * 31 + ch.charCodeAt(0)) % 1000003
>   return h.toString(16).padStart(6, '0')
> }
> const SECRET = 'whsec_test'
> const NOW = 1_700_000_000_000
> const T = NOW / 1000
> const body = '{"id":"evt_1","type":"product.updated"}'
> const sign = (t: number, raw: string, secret = SECRET) => `t=${t},v1=${hmac(secret, `${t}.${raw}`)}`
> const run = (header: string | null, over: Record<string, unknown> = {}) =>
>   verifyWebhook({ rawBody: body, header, secret: SECRET, now: NOW, hmac, ...over })
>
> test('правильний підпис і свіжа мітка проходять', () => {
>   expect(run(sign(T, body))).toEqual({ ok: true })
> })
>
> test('немає заголовка — missing', () => {
>   expect(run(null)).toEqual({ ok: false, reason: 'missing' })
>   expect(run('')).toEqual({ ok: false, reason: 'missing' })
> })
>
> test('зіпсований заголовок — malformed', () => {
>   expect(run('garbage')).toEqual({ ok: false, reason: 'malformed' })
>   expect(run('t=abc,v1=deadbeef')).toEqual({ ok: false, reason: 'malformed' })
>   expect(run(`t=${T}`)).toEqual({ ok: false, reason: 'malformed' })
> })
>
> test('мітка старша за 300 с або з майбутнього — expired, і HMAC навіть не рахується', () => {
>   const spy = vi.fn(hmac)
>   expect(run(sign(T - 301, body), { hmac: spy })).toEqual({ ok: false, reason: 'expired' })
>   expect(run(sign(T + 301, body), { hmac: spy })).toEqual({ ok: false, reason: 'expired' })
>   expect(spy).toHaveBeenCalledTimes(0)
>   expect(run(sign(T - 300, body))).toEqual({ ok: true })
> })
>
> test('змінене тіло або чужий секрет — mismatch', () => {
>   expect(run(sign(T, body), { rawBody: body.replace(':', ': ') })).toEqual({ ok: false, reason: 'mismatch' })
>   expect(run(sign(T, body, 'other_secret'))).toEqual({ ok: false, reason: 'mismatch' })
> })
>
> test('підпис іншої довжини — mismatch, а не виняток', () => {
>   const t = String(T)
>   expect(run(`t=${t},v1=ab`)).toEqual({ ok: false, reason: 'mismatch' })
>   expect(run(`t=${t},v1=${hmac(SECRET, `${t}.${body}`)}00`)).toEqual({ ok: false, reason: 'mismatch' })
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбери заголовок за комами, кожну частину поділи на ім'я й значення по першому `=`. Перевір, що `t` — скінченне число, а `v1` не порожній.
>
> > [!hint]- Підказка 2
> > Різниця в часі — `Math.abs(now / 1000 - t)`. Без `abs` ти відкинеш лише старі запити й пропустиш мітки з майбутнього.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type VerifyResult = { ok: true } | { ok: false; reason: 'missing' | 'malformed' | 'expired' | 'mismatch' }
> >
> > type VerifyInput = {
> >   rawBody: string
> >   header: string | null
> >   secret: string
> >   now: number // Date.now() у мілісекундах
> >   hmac: (secret: string, data: string) => string
> > }
> >
> > const TOLERANCE_SECONDS = 300
> >
> > // порівняння за сталий час: проходимо всі символи, без раннього виходу
> > function safeEqual(a: string, b: string): boolean {
> >   if (a.length !== b.length) return false
> >   let diff = 0
> >   for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
> >   return diff === 0
> > }
> >
> > function verifyWebhook({ rawBody, header, secret, now, hmac }: VerifyInput): VerifyResult {
> >   if (!header) return { ok: false, reason: 'missing' }
> >
> >   const parts: Record<string, string> = {}
> >   for (const piece of header.split(',')) {
> >     const i = piece.indexOf('=')
> >     if (i > 0) parts[piece.slice(0, i).trim()] = piece.slice(i + 1).trim()
> >   }
> >   const timestamp = Number(parts.t)
> >   if (!parts.t || !Number.isFinite(timestamp) || !parts.v1) return { ok: false, reason: 'malformed' }
> >
> >   // мітка перевіряється до HMAC і в обидва боки: і старі, і «з майбутнього»
> >   if (Math.abs(now / 1000 - timestamp) > TOLERANCE_SECONDS) return { ok: false, reason: 'expired' }
> >
> >   const expected = hmac(secret, `${parts.t}.${rawBody}`)
> >   return safeEqual(parts.v1, expected) ? { ok: true } : { ok: false, reason: 'mismatch' }
> > }
> > ```
> >
> > Мітку перевіряють до HMAC: відкинути застарілий запит дешевше, ніж рахувати підпис. `safeEqual` проходить усі символи й накопичує різницю через XOR, тож час відповіді не підказує, на якому символі підпис розійшовся. У реальному коді замість неї беруть `timingSafeEqual` з `node:crypto` (на буферах однакової довжини, тому довжини порівнюють раніше), а `hmac` — це `createHmac('sha256', secret).update(data).digest('hex')`.

> [!task] CORS із білим списком і preflight
> level: middle · difficulty: medium · id: nextjs-core-19-task-02 · tags: cors, preflight, security
>
> Реалізуй дві функції, на які спирається `route.ts` для чужого фронтенду:
>
> - `corsHeaders(origin, opts)` повертає обʼєкт заголовків. `Vary: Origin` є **завжди**. `Access-Control-Allow-Origin` зʼявляється лише тоді, коли `origin` точно збігається з елементом `opts.allowlist`; значення — сам `origin`, а не `*`. Для чужого або відсутнього origin жодних `Access-Control-*`.
> - `preflight(request, opts)`, де `request = { method, headers }`: для не-`OPTIONS` повертає `null`. Для `OPTIONS` повертає `{ status: 204, headers }`: заголовки з `corsHeaders`, а для дозволеного origin ще `Access-Control-Allow-Methods` (методи через `, `), `Access-Control-Allow-Headers` (теж через `, `) і `Access-Control-Max-Age` (рядок). Назву заголовка `Origin` у запиті шукай без урахування регістру.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type CorsOptions = {
>   allowlist: string[]
>   methods: string[]
>   headers: string[]
>   maxAge: number // секунди
> }
>
> type PreflightRequest = { method: string; headers: Record<string, string> }
>
> function corsHeaders(origin: string | null, opts: CorsOptions): Record<string, string> {
>   // ❌ дозволяємо всім
>   return { 'Access-Control-Allow-Origin': '*' }
> }
>
> function preflight(request: PreflightRequest, opts: CorsOptions): { status: number; headers: Record<string, string> } | null {
>   // твій код
>   return null
> }
> ```
>
> ```ts tests
> const opts = {
>   allowlist: ['https://partner.example', 'http://localhost:5173'],
>   methods: ['GET', 'POST', 'OPTIONS'],
>   headers: ['Content-Type', 'Authorization'],
>   maxAge: 600,
> }
> const ACAO = 'Access-Control-Allow-Origin'
> const corsKeys = (h: Record<string, string>) => Object.keys(h).filter((k) => k.startsWith('Access-Control-'))
>
> test('дозволений origin відбивається точно, а не зірочкою', () => {
>   expect(corsHeaders('https://partner.example', opts)[ACAO]).toBe('https://partner.example')
>   expect(corsHeaders('http://localhost:5173', opts)[ACAO]).toBe('http://localhost:5173')
>   // збіг лише повний: ні префікс, ні піддомен не проходять
>   expect(corsHeaders('https://partner.example.evil.test', opts)[ACAO]).toBeUndefined()
> })
>
> test('Vary: Origin є завжди, а чужий origin не отримує жодного Access-Control-*', () => {
>   for (const origin of ['https://evil.example', null, 'null']) {
>     const h = corsHeaders(origin, opts)
>     expect(h.Vary).toBe('Origin')
>     expect(corsKeys(h)).toEqual([])
>   }
> })
>
> test('preflight від дозволеного origin — 204 зі списками методів, заголовків і max-age', () => {
>   const res = preflight({ method: 'OPTIONS', headers: { origin: 'https://partner.example' } }, opts)
>   expect(res.status).toBe(204)
>   expect(res.headers).toEqual({
>     Vary: 'Origin',
>     'Access-Control-Allow-Origin': 'https://partner.example',
>     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
>     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
>     'Access-Control-Max-Age': '600',
>   })
> })
>
> test('preflight від чужого origin — 204 без Access-Control-*, але з Vary', () => {
>   const res = preflight({ method: 'OPTIONS', headers: { origin: 'https://evil.example' } }, opts)
>   expect(res.status).toBe(204)
>   expect(res.headers).toEqual({ Vary: 'Origin' })
> })
>
> test('регістр назви заголовка Origin у запиті не важить', () => {
>   const res = preflight({ method: 'options', headers: { ORIGIN: 'https://partner.example' } }, opts)
>   expect(res.headers[ACAO]).toBe('https://partner.example')
> })
>
> test('не-OPTIONS запит preflight не обробляє', () => {
>   expect(preflight({ method: 'POST', headers: { origin: 'https://partner.example' } }, opts)).toBeNull()
> })
> ```
>
> > [!hint]- Підказка 1
> > Заголовки запиту в `request.headers` можуть мати довільний регістр (`origin`, `Origin`, `ORIGIN`). Знайди ключ через `toLowerCase()`.
>
> > [!hint]- Підказка 2
> > Порівнюй origin з білим списком повною рівністю (`includes`), а не `startsWith`: `https://partner.example.evil.test` не повинен пройти.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type CorsOptions = {
> >   allowlist: string[]
> >   methods: string[]
> >   headers: string[]
> >   maxAge: number // секунди
> > }
> >
> > type PreflightRequest = { method: string; headers: Record<string, string> }
> >
> > function corsHeaders(origin: string | null, opts: CorsOptions): Record<string, string> {
> >   // Vary потрібен завжди: відповідь залежить від Origin, і CDN не повинен змішати їх
> >   const headers: Record<string, string> = { Vary: 'Origin' }
> >   if (origin && opts.allowlist.includes(origin)) {
> >     headers['Access-Control-Allow-Origin'] = origin // відбиваємо, а не '*'
> >   }
> >   return headers
> > }
> >
> > function getHeader(headers: Record<string, string>, name: string): string | null {
> >   const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase())
> >   return key === undefined ? null : headers[key]
> > }
> >
> > function preflight(request: PreflightRequest, opts: CorsOptions): { status: number; headers: Record<string, string> } | null {
> >   if (request.method.toUpperCase() !== 'OPTIONS') return null
> >
> >   const headers = corsHeaders(getHeader(request.headers, 'origin'), opts)
> >   if ('Access-Control-Allow-Origin' in headers) {
> >     headers['Access-Control-Allow-Methods'] = opts.methods.join(', ')
> >     headers['Access-Control-Allow-Headers'] = opts.headers.join(', ')
> >     headers['Access-Control-Max-Age'] = String(opts.maxAge)
> >   }
> >   return { status: 204, headers }
> > }
> > ```
> >
> > Відповідь на preflight для недозволеного origin лишається `204`: браузер сам побачить, що дозволу нема, і не надішле справжній запит. `Vary: Origin` стоїть навіть там, інакше CDN закешує відповідь з дозволом і віддасть її всім. Памʼятай: це захист браузера, а не API, тож `curl` з чужим origin однаково отримає дані, доки обробник сам не перевіряє доступ.

> [!task] Диспетчер методів як route.ts
> level: middle · difficulty: medium · id: nextjs-core-19-task-03 · tags: route-handlers, http, methods
>
> Змоделюй, що Next.js робить із `route.ts`. `dispatch(handlers, request)` отримує обʼєкт експортів (`{ GET, POST, … }`, функції повертають `{ status, headers, body }`, можуть бути асинхронними) і `request = { method }`. Правила:
>
> - метод нормалізується до верхнього регістру (`'get'` → `'GET'`), обробник отримує запит уже з нормалізованим `method`;
> - експортований обробник просто викликається. Експорти, які не є HTTP-методами (`dynamic`, `revalidate`…), ігноруються;
> - `OPTIONS` без обробника → `{ status: 204, headers: { allow }, body: null }`, де `allow` — відсортований за алфавітом список усіх експортованих методів плюс `HEAD` (якщо є `GET`) плюс `OPTIONS`, через `, `;
> - `HEAD` без обробника, але з `GET` → викликай `GET` з `request.method === 'HEAD'` і поверни його `status` та `headers`, а `body: null`;
> - усе інше → `{ status: 405, headers: { allow }, body: 'Method Not Allowed' }`, де `allow` — експортовані методи плюс `HEAD` (якщо є `GET`), без `OPTIONS`, відсортовані й через `, `.
>
> ```js starter
> const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
>
> async function dispatch(handlers, request) {
>   // ❌ усе, чого немає в handlers, — 404
>   const handler = handlers[request.method]
>   if (!handler) return { status: 404, headers: {}, body: 'Not Found' }
>   return handler(request)
> }
> ```
>
> ```js tests
> const json = (data) => ({ status: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
>
> test('викликає експортований обробник, регістр методу не важить', async () => {
>   const seen = []
>   const handlers = { GET: () => json([]), POST: (req) => (seen.push(req.method), { status: 201, headers: {}, body: 'ok' }) }
>   expect(await dispatch(handlers, { method: 'get' })).toEqual(json([]))
>   expect(await dispatch(handlers, { method: 'post' })).toEqual({ status: 201, headers: {}, body: 'ok' })
>   expect(seen).toEqual(['POST'])
> })
>
> test('неекспортований метод — 405 з Allow (до GET додається HEAD)', async () => {
>   const res = await dispatch({ GET: () => json([]) }, { method: 'PUT' })
>   expect(res).toEqual({ status: 405, headers: { allow: 'GET, HEAD' }, body: 'Method Not Allowed' })
>   const res2 = await dispatch({ POST: () => json({}), DELETE: () => json({}) }, { method: 'GET' })
>   expect(res2.status).toBe(405)
>   expect(res2.headers.allow).toBe('DELETE, POST')
> })
>
> test('OPTIONS без обробника — 204 з allow (GET, HEAD, OPTIONS і решта за алфавітом)', async () => {
>   const res = await dispatch({ POST: () => json({}), GET: () => json([]) }, { method: 'OPTIONS' })
>   expect(res).toEqual({ status: 204, headers: { allow: 'GET, HEAD, OPTIONS, POST' }, body: null })
> })
>
> test('HEAD без обробника викликає GET: request.method === HEAD, body null', async () => {
>   const calls = []
>   const handlers = { GET: (req) => (calls.push(req.method), json({ n: 1 })) }
>   const res = await dispatch(handlers, { method: 'HEAD' })
>   expect(calls).toEqual(['HEAD'])
>   expect(res).toEqual({ status: 200, headers: { 'content-type': 'application/json' }, body: null })
> })
>
> test('власні HEAD і OPTIONS мають пріоритет над автоматичними', async () => {
>   const handlers = {
>     GET: () => json([]),
>     HEAD: () => ({ status: 200, headers: { 'x-own': '1' }, body: null }),
>     OPTIONS: () => ({ status: 204, headers: { 'access-control-allow-origin': 'https://partner.example' }, body: null }),
>   }
>   expect((await dispatch(handlers, { method: 'HEAD' })).headers).toEqual({ 'x-own': '1' })
>   expect((await dispatch(handlers, { method: 'OPTIONS' })).headers).toEqual({ 'access-control-allow-origin': 'https://partner.example' })
> })
>
> test('експорти-не-методи ігноруються, невідомий метод — 405', async () => {
>   const handlers = { GET: () => json([]), dynamic: 'force-static', revalidate: 60 }
>   const res = await dispatch(handlers, { method: 'TRACE' })
>   expect(res.status).toBe(405)
>   expect(res.headers.allow).toBe('GET, HEAD')
>   expect((await dispatch({ dynamic: 'force-static' }, { method: 'OPTIONS' })).headers.allow).toBe('OPTIONS')
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу порахуй множину експортованих методів: `METHODS.filter(...)` за наявністю функції. `HEAD` додається лише тоді, коли є `GET`.
>
> > [!hint]- Підказка 2
> > `OPTIONS` потрапляє в `allow` автоматичної відповіді, але не в `allow` відповіді `405`, якщо ти його не експортував.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
> >
> > async function dispatch(handlers, request) {
> >   const method = String(request.method).toUpperCase()
> >   const req = { ...request, method }
> >
> >   // експортами-методами вважаємо лише відомі імена з функціями (dynamic, revalidate… ігноруємо)
> >   const own = (m) => METHODS.includes(m) && typeof handlers[m] === 'function'
> >   const allowed = new Set(METHODS.filter(own))
> >   if (allowed.has('GET')) allowed.add('HEAD')
> >   const list = () => [...allowed].sort().join(', ')
> >
> >   if (own(method)) return handlers[method](req)
> >
> >   if (method === 'OPTIONS') {
> >     allowed.add('OPTIONS')
> >     return { status: 204, headers: { allow: list() }, body: null }
> >   }
> >
> >   if (method === 'HEAD' && own('GET')) {
> >     const res = await handlers.GET(req) // побічні ефекти GET спрацюють і на HEAD
> >     return { status: res.status, headers: res.headers, body: null }
> >   }
> >
> >   return { status: 405, headers: { allow: list() }, body: 'Method Not Allowed' }
> > }
> > ```
> >
> > Найбільше дивує `HEAD`: окремої логіки нема, викликається твій `GET`, тож його побічні ефекти (лічильник переглядів, запис у лог) спрацюють і на `HEAD`. Тому `GET` має бути без побічних ефектів. Модель іде за документованою поведінкою: `Allow` у `405` одним рядком. На 16.3.8 фактично залежить від типу маршруту: статичний `○` віддає два рядки `Allow` (`GET`, `HEAD`), а динамічний `ƒ` — `405` без `Allow` і з порожнім тілом.

> [!task] Ідемпотентний обробник вебхуків
> level: senior · difficulty: hard · id: nextjs-core-19-task-04 · tags: webhooks, idempotency, timers
>
> Провайдер доставляє вебхук «щонайменше раз», тож повтор — норма. Напиши `createWebhookProcessor({ ttlMs, handler })`, що повертає обʼєкт з асинхронним методом `handle(event)`; `event.id` унікальний.
>
> - Нова подія: викликай `handler(event)` і поверни `'processed'`.
> - Повтор тієї ж події, поки з обробки пройшло **менше** `ttlMs`: поверни `'duplicate'`, `handler` не викликай. Час відліку — момент успішної обробки (`Date.now()`).
> - Коли `ttlMs` минув (рівно `ttlMs` уже вважається минулим), ключ забувається, і подію можна обробити знову.
> - Якщо `handler` кинув помилку, `handle` перекидає її далі, а подію **не** позначено обробленою: провайдер зможе повторити.
> - Повтор тієї ж події, поки перша копія ще виконується (`handler` не завершився), — теж `'duplicate'`.
>
> У тестах час контролює `vi.useFakeTimers()`: `Date.now()` рухається за `vi.advanceTimersByTime(ms)`.
>
> ```js starter
> function createWebhookProcessor({ ttlMs, handler }) {
>   return {
>     async handle(event) {
>       // ❌ кожен повтор обробляється заново
>       await handler(event)
>       return 'processed'
>     },
>   }
> }
> ```
>
> ```js tests
> test('перша подія обробляється, handler викликано один раз', async () => {
>   const handler = vi.fn()
>   const p = createWebhookProcessor({ ttlMs: 1000, handler })
>   expect(await p.handle({ id: 'evt_1' })).toBe('processed')
>   expect(handler).toHaveBeenCalledTimes(1)
>   expect(handler).toHaveBeenCalledWith({ id: 'evt_1' })
> })
>
> test('повтор у межах ttl — duplicate, handler не викликається', async () => {
>   vi.useFakeTimers()
>   const handler = vi.fn()
>   const p = createWebhookProcessor({ ttlMs: 1000, handler })
>   await p.handle({ id: 'evt_1' })
>   vi.advanceTimersByTime(999)
>   expect(await p.handle({ id: 'evt_1' })).toBe('duplicate')
>   expect(handler).toHaveBeenCalledTimes(1)
>   vi.useRealTimers()
> })
>
> test('після ttl ключ забувається, і подію можна обробити знову', async () => {
>   vi.useFakeTimers()
>   const handler = vi.fn()
>   const p = createWebhookProcessor({ ttlMs: 1000, handler })
>   await p.handle({ id: 'evt_1' })
>   vi.advanceTimersByTime(1000)
>   expect(await p.handle({ id: 'evt_1' })).toBe('processed')
>   expect(handler).toHaveBeenCalledTimes(2)
>   vi.useRealTimers()
> })
>
> test('різні id не заважають одне одному', async () => {
>   const handler = vi.fn()
>   const p = createWebhookProcessor({ ttlMs: 1000, handler })
>   expect(await p.handle({ id: 'a' })).toBe('processed')
>   expect(await p.handle({ id: 'b' })).toBe('processed')
>   expect(await p.handle({ id: 'a' })).toBe('duplicate')
>   expect(handler).toHaveBeenCalledTimes(2)
> })
>
> test('якщо handler кинув помилку, подія не вважається обробленою і її можна повторити', async () => {
>   let attempt = 0
>   const handler = vi.fn(async () => {
>     attempt += 1
>     if (attempt === 1) throw new Error('база недоступна')
>   })
>   const p = createWebhookProcessor({ ttlMs: 1000, handler })
>   await expect(p.handle({ id: 'evt_1' })).rejects.toThrow('база недоступна')
>   expect(await p.handle({ id: 'evt_1' })).toBe('processed')
>   expect(handler).toHaveBeenCalledTimes(2)
> })
>
> test('паралельний повтор, поки перший ще виконується, — duplicate', async () => {
>   let release
>   const handler = vi.fn(() => new Promise((resolve) => { release = resolve }))
>   const p = createWebhookProcessor({ ttlMs: 1000, handler })
>   const first = p.handle({ id: 'evt_1' })
>   expect(await p.handle({ id: 'evt_1' })).toBe('duplicate')
>   release()
>   expect(await first).toBe('processed')
>   expect(handler).toHaveBeenCalledTimes(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > Тобі потрібні дві структури: `Map` «id → момент завершення» для оброблених і `Set` для тих, що виконуються зараз.
>
> > [!hint]- Підказка 2
> > Додавай id в `done` лише після успішного `await handler(event)`, а з `inFlight` прибирай у `finally`, щоб помилка не залишила подію «в обробці» назавжди.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createWebhookProcessor({ ttlMs, handler }) {
> >   const done = new Map() // id → момент успішної обробки
> >   const inFlight = new Set() // id, які обробляються просто зараз
> >
> >   return {
> >     async handle(event) {
> >       const doneAt = done.get(event.id)
> >       if (doneAt !== undefined) {
> >         if (Date.now() - doneAt < ttlMs) return 'duplicate'
> >         done.delete(event.id) // ttl минув — забуваємо ключ
> >       }
> >       if (inFlight.has(event.id)) return 'duplicate'
> >
> >       inFlight.add(event.id)
> >       try {
> >         await handler(event)
> >         done.set(event.id, Date.now()) // позначаємо лише після успіху
> >         return 'processed'
> >       } finally {
> >         inFlight.delete(event.id)
> >       }
> >     },
> >   }
> > }
> > ```
> >
> > У продакшні `Map` і `Set` у памʼяті процесу замінює таблиця з унікальним ключем на `event.id`: кожен serverless-інстанс має власну памʼять, а після перезапуску вона порожня. Принцип той самий: позначати оброблену подію після успіху, а паралельні копії відсікати. Відповідати провайдеру треба швидко, тож важку роботу виносять у чергу чи `after()`.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) — конвенція, методи, кешування з Cache Components, `RouteContext`.
- 🟡 [Next.js — route.js](https://nextjs.org/docs/app/api-reference/file-conventions/route) — довідник: параметри, cookies, headers, стрімінг, CORS, вебхуки, не-UI відповіді.
- 🟡 [Next.js — Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend) — публічні ендпоінти, проксі до бекенду, безпека, rate limiting, обмеження.
- 🟡 [Next.js — revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) — профілі `'max'` і `{ expire: 0 }`, виклик з Route Handler.
- 🟡 [Next.js — Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) — `dynamic = 'force-static'` → `'use cache'` у хелпері для `GET`.
- 🟡 [Next.js — NextRequest](https://nextjs.org/docs/app/api-reference/functions/next-request) — `nextUrl`, `cookies` і решта розширень `Request`.
- 🟡 [MDN — Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — прості й preflight-запити, credentials, `Vary`.
- 🟡 [MDN — Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) — формат подій, `EventSource`, перепідключення.
- 🔴 [Stripe — Webhooks: verify events](https://docs.stripe.com/webhooks#verify-events) — підпис `t=…,v1=…`, допуск за часом, повторні доставки.
- 🔴 [OWASP — Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) — захист мутацій з cookie-сесією.

> [!important] Підсумок
> - Route Handler — `route.ts` з функціями-методами над Web `Request`/`Response`: публічна HTTP-адреса без layouts і RSC. У сегменті — або `page.tsx`, або `route.ts`.
> - На неекспортований метод Next.js відповідає сам, і відповідь залежить від типу маршруту: для `ƒ` — `405` без `Allow`, `OPTIONS` `204` і `HEAD` через твій `GET`; для `○` — `405` з `Allow` і `HEAD` з кешу; для `●` — закешоване тіло `GET` навіть на `DELETE`. `params` — Promise, тип — глобальний `RouteContext<'/шлях'>`.
> - Під Cache Components `GET` пререндериться, якщо не читає запит і некешовані дані; повільні дані — у хелпер з `'use cache'`. На 16.3.8 інший метод у файлі робить маршрут `ƒ`.
> - Стрім — `ReadableStream` (SSE — `text/event-stream`), прибирання — через `request.signal`. CORS — білий список, свій `OPTIONS`, `Vary: Origin`; він захищає браузер, а не сервер.
> - Вебхук: `request.text()`, HMAC і `timingSafeEqual`, мітка часу, ідемпотентність за `event.id`, `revalidateTag(tag, { expire: 0 })`. BFF ховає ключі й віддає DTO. Перевірка доступу — у кожному обробнику.

---
title: Статичний і динамічний рендеринг
id: nextjs-core-10
slug: 10-static-dynamic
order: 10
level: middle
skill: rendering
icon: px:scales
tags: [nextjs, rendering, static-shell, request-time-apis, io, connection, cache-components, ppr]
prerequisites: ["[[Next.js - 07. Server і Client Components]]", "[[Next.js - 03. Динамічні маршрути]]"]
estimatedMinutes: 50
nextVersion: 16.3.8
---

# Статичний і динамічний рендеринг

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, чому в Next.js 16 статичне й динамічне — спектр на рівні **компонента**, а не перемикач на рівні маршруту;
> - для будь-якого компонента сказати, що робить його рендер request-time: `cookies()`, `headers()`, `searchParams`, `params`, `connection()`, `io()`, некешований `fetch` чи запит до БД;
> - обробити `new Date()`, `Math.random()` і `crypto.randomUUID()` під Cache Components і пояснити, чому документація радить `io()`, а не `connection()`;
> - прочитати помилки prerender у `next build` і `next dev` та обрати виправлення: `'use cache'`, `<Suspense>` чи `instant = false`;
> - замінити `dynamic`, `revalidate` і `fetchCache` («було → стало») і прочитати вивід `next build` (`○`, `◐`, `ƒ`, `Revalidate`, `Expire`);
> - заміряти результат: `curl -I` і заголовки `x-nextjs-cache`, `Cache-Control`, `x-nextjs-postponed`;
> - локалізувати динамічне: опустити читання запиту вниз дерева й передавати Promise замість значення.

## 🤔 Передбач

> [!quiz] Що буде в HTML ще до того, як сервер дочекається cookies?
> level: middle · type: output · id: nextjs-core-10-quiz-01
>
> `cacheComponents: true`, продакшн-збірка. Користувач з кукою `name=Olya` відкриває `/shop`. Яка частина сторінки потрапить у перший шматок HTML — той, що вже готовий до запиту?
>
> ```tsx
> // app/shop/page.tsx
> import { Suspense } from 'react'
> import { cookies } from 'next/headers'
> import { cacheLife } from 'next/cache'
> import { getProducts } from '../lib/products'
>
> export default function ShopPage() {
>   return (
>     <main>
>       <h1>Магазин</h1>
>       <Suspense fallback={<p>Вітаємо!</p>}>
>         <Greeting />
>       </Suspense>
>       <ProductList />
>     </main>
>   )
> }
>
> async function Greeting() {
>   const name = (await cookies()).get('name')?.value
>   return <p>{name ? `Вітаємо, ${name}!` : 'Вітаємо!'}</p>
> }
>
> async function ProductList() {
>   'use cache'
>   cacheLife('hours')
>   const products = await getProducts()
>   return <ul>{products.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
> }
> ```
>
> - [x] `<h1>`, fallback `Вітаємо!` і список товарів; `Вітаємо, Olya!` дострімиться в тій самій відповіді
> - [ ] Нічого: `cookies()` робить увесь маршрут динамічним, HTML будується лише після читання куки
> - [ ] `<h1>` і fallback; список товарів теж стрімиться, бо `ProductList` — `async`
> - [ ] Уся сторінка разом з `Вітаємо, Olya!`: сервер має куку з самого початку запиту
>
> **Пояснення:** не страшно, якщо помилився — розберемо нижче. З Cache Components межа проходить усередині сторінки: заголовок і кешований `ProductList` пререндеряться під час `next build` у **static shell** разом із fallback, а `Greeting` чекає на запит і стрімиться пізніше. Другий варіант — стара модель рівня маршруту. `async` сам по собі не робить компонент динамічним: `ProductList` закешований і потрапляє в shell.

## 🧒 Простими словами

Уяви кавʼярню біля метро. Зранку бариста викладає на вітрину круасани й сендвічі — їх приготували заздалегідь, і будь-хто отримує їх за секунду. Це **static shell**: усе, що можна зробити до приходу клієнта. Деякі страви готують заздалегідь, але вони псуються: салат стоїть на вітрині годину, потім його міняють. Це **кешований** вміст із терміном придатності (`'use cache'` + `cacheLife`). А капучино з твоїм імʼям на стаканчику неможливо приготувати наперед: бариста має почути замовлення. Це **request-time** частина. Поки її готують, ти вже тримаєш круасан і серветку з написом «ваше замовлення готується» — це fallback.

Стара кавʼярня працювала інакше: якщо хоч одна позиція в замовленні — під замовлення, тобі не давали навіть круасан, поки не зварять каву. Так виглядав динамічний маршрут до Cache Components.

## 🔬 Як це працює насправді

### 🌗 Статичне і динамічне — спектр, а не перемикач

Почнемо з термінів, бо їх часто плутають:

- **Prerendering** — рендер компонента під час `next build` (або у фоні під час revalidation). Результат — HTML і RSC payload, які можна покласти в кеш чи на CDN.
- **Request-time rendering** (його ще кажуть dynamic rendering) — рендер під час конкретного запиту, бо результату не знати наперед.
- **Static shell** — пререндерений HTML сторінки, який віддають одразу: увесь вміст, що рендериться без запиту, плюс fallback-и `<Suspense>` для частин, які дострімляться.

Документація Next.js («Rendering Philosophy») описує три способи, якими фреймворки проводять межу між статичним і динамічним:

| Модель | Де межа | Плюс | Мінус |
|---|---|---|---|
| Build-time prerendering | ніде: усе генерується на збірці | статичні файли на будь-якому CDN | кожна зміна вмісту — нова збірка; дані користувача — лише через клієнтський `fetch` |
| Межа на рівні маршруту | маршрут або статичний, або динамічний | просто зрозуміти й задеплоїти | одне привітання користувача робить динамічною всю сторінку |
| Межа на рівні компонента | всередині сторінки | shell одразу, решта стрімиться в тій самій відповіді | складніша інфраструктура: потрібні streaming і координація кешу |

Next.js 16 з Cache Components обирає третю модель. Одна сторінка може мати static shell, кешований компонент зі своїм терміном життя і request-time частину — без поділу на окремі маршрути й без клієнтського запиту після завантаження. Ціна — вимоги до хостингу: streaming, а для shell з CDN — підтримка платформи.

Звідси нова постановка питання. Раніше питали «цей маршрут статичний чи динамічний?». Тепер питають «**які компоненти** цієї сторінки потребують запиту і де їхня межа `<Suspense>`?».

### 🕰️ Було → стало: модель рівня маршруту

Без Cache Components (`cacheComponents: false`, і так працює більшість туторіалів до Next.js 16) рішення приймається для всього маршруту. Маршрут статичний, доки під час рендера ніхто не прочитав запит. Щойно сторінка чи layout викликали `cookies()`, `headers()`, прочитали `searchParams`, викликали `connection()` або зробили `fetch` з `cache: 'no-store'`, **увесь** маршрут ставав динамічним. Окремо можна було примусити поведінку: `export const dynamic = 'force-dynamic'` чи `'force-static'`, а `export const revalidate = 60` вмикав ISR (Incremental Static Regeneration — статична сторінка, яку періодично перебудовують у фоні).

Ось три сторінки, зібрані на 16.3.8 **без** Cache Components: порожня, з `cookies()` і з `revalidate = 60`.

```tsx
// app/dash/page.tsx — стара модель: cookies() робить динамічним увесь маршрут
import { cookies } from 'next/headers'

export default async function Dash() {
  const theme = (await cookies()).get('theme')?.value ?? 'light'
  return <h1>Тема: {theme}</h1>
}
```

```text
Route (app)      Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /dash
└ ○ /news                1m      1y

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Тут лише два стани: `○` (готовий HTML) і `ƒ` (рендер на кожен запит). Щоб привітання не зробило динамічним каталог, його виносили в Client Component з `fetch` у `useEffect`.

З Cache Components те саме `cookies()` змінює лише **свій** компонент. Сторінка з 🤔 Передбач збирається як `◐ /shop`: shell готовий, а привітання стрімиться в тій самій HTTP-відповіді. Це і є Partial Prerendering (PPR) — у 16 воно не окрема опція, а поведінка за замовчуванням з `cacheComponents: true`. Детально про streaming — [[Next.js - 11. Streaming і Suspense]], про PPR — [[Next.js - 12. Partial Prerendering і Cache Components]].

> [!diagram] Одна сторінка у двох моделях
> ```yaml
> layout: compare
> columns: { old: "без Cache Components: межа — маршрут", new: "Cache Components: межа — компонент" }
> nodes:
>   - { id: o1, col: old, label: "next build", text: "cookies() у Greeting", note: "маршрут позначено ƒ", tone: gray, icon: "px:file" }
>   - { id: o2, col: old, label: "запит", text: "рендер усієї сторінки", note: "h1, товари, привітання — щоразу", tone: orange, icon: "px:hourglass" }
>   - { id: o3, col: old, label: "браузер", text: "HTML після повного рендера", tone: yellow, icon: "px:monitor" }
>   - { id: n1, col: new, label: "next build", text: "static shell", note: "h1 + товари + fallback; маршрут ◐", tone: blue, icon: "px:file" }
>   - { id: n2, col: new, label: "запит", text: "shell одразу", note: "Greeting рендериться паралельно", tone: green, icon: "px:bolt" }
>   - { id: n3, col: new, label: "браузер", text: "привітання дострімилось", note: "та сама відповідь", tone: green, icon: "px:check" }
> steps:
>   - { show: [o1, n1], note: "Збірка. Ліворуч одне читання cookies() позначає динамічним увесь маршрут. Праворуч Next.js пререндерить усе, що не залежить від запиту." }
>   - { show: [o2, n2], note: "Запит. Ліворуч сервер рендерить сторінку з нуля, і користувач чекає. Праворуч shell іде в мережу одразу, а Greeting рендериться, поки браузер малює shell." }
>   - { show: [o3, n3], note: "Ліворуч HTML приходить одним шматком після найповільнішої частини. Праворуч привітання доїжджає в тій самій відповіді й заміняє fallback." }
> ```
> Код сторінки однаковий. Різниця лише в тому, де Next.js проводить межу.

### 🧭 Що робить рендер request-time

**Request-time APIs** — функції, яким потрібні дані конкретного запиту. Глосарій Next.js називає чотири: `cookies()`, `headers()`, `searchParams` і `draftMode()`. На практиці до них додаються ще кілька джерел, і всі вони під Cache Components поводяться однаково: компонент **призупиняється** (suspends) під час prerender, і далі його рендер відбувається лише під час запиту.

| Що читаємо | Звідки | Чому не можна наперед | Що зробити |
|---|---|---|---|
| `cookies()` | `next/headers` | у кожного користувача свої | `<Suspense>`; значення — аргументом у кешовану функцію |
| `headers()` | `next/headers` | мова, user agent, IP — свої в кожного запиту | `<Suspense>` |
| `searchParams` | пропс `page` | рядок запиту відомий лише в запиті | `<Suspense>`, читати якомога глибше |
| `params` без `generateStaticParams` | пропс `page`, `layout` | значень сегмента немає на етапі збірки | `generateStaticParams` або `<Suspense>` ([[Next.js - 03. Динамічні маршрути]]) |
| `connection()` | `next/server` | явне «чекай справжнього запиту користувача» | `<Suspense>` |
| `await io()` | `next/cache` (16.3) | маркер «далі I/O, значення буде своє» | `<Suspense>` або `'use cache'` вище |
| некешований `fetch`, запит до БД | будь-де | дані можуть змінитися | `'use cache'` або `<Suspense>` |

**`await` — ось момент читання.** `cookies()`, `headers()`, `draftMode()`, `params` і `searchParams` з Next.js 16 лише асинхронні. Сам виклик `cookies()` повертає Promise; компонент призупиняється там, де на нього чекають (`await` або `use()`). Тому можна викликати `cookies()` у layout без `await` і передати Promise вниз — про це в розділі про локалізацію.

**`draftMode()` поводиться м'якше.** На 16.3.8 сторінка, яка читає `(await draftMode()).isEnabled` **поза** `<Suspense>`, збирається як `○`: на етапі збірки Draft Mode вимкнений, і значення відоме. Коли Draft Mode увімкнено (кука `__prerender_bypass`), той самий URL рендериться під час запиту з `Cache-Control: private, no-cache, no-store…`. `isEnabled` можна читати навіть у `'use cache'`.

**Синхронні непередбачувані значення — окремий клас.** `new Date()`, `Date.now()`, `Math.random()` і `crypto.randomUUID()` не призупиняють компонент: вони просто повертають значення. Next.js не може вгадати, чи хочеш ти «один раз на збірці для всіх», чи «своє для кожного запиту», тому змушує сказати явно (розділ про `io()`). А от `performance.now()` документація вважає телеметрією і не охороняє: на 16.3.8 сторінка з ним збирається як `○`.

Динамічним **не** роблять імпорти, `fs.readFileSync` і чисті обчислення: вони виконуються під час prerender (синхронний драйвер БД на кшталт `node:sqlite` теж — і це пастка). І `<Suspense>` сам нічого не робить динамічним: синхронна робота всередині межі все одно завершиться під час prerender.

> [!quiz] Перевір себе: що робить компонент request-time?
> level: middle · id: nextjs-core-10-quiz-02
>
> `cacheComponents: true`. Які з цих рядків у Server Component (без `'use cache'`) призупиняють рендер до запиту, тож компоненту потрібен `<Suspense>` вище? Познач усі.
>
> - [x] `const lang = (await headers()).get('accept-language')`
> - [x] `const { q } = await searchParams`
> - [x] `await connection()`
> - [ ] `const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))`
> - [ ] `const t = performance.now()`
> - [ ] `const id = crypto.randomUUID()`
>
> **Пояснення:** `headers()`, `searchParams` і `connection()` — дані, яких немає до запиту, тож компонент призупиняється. `fs.readFileSync` — передбачуване синхронне I/O, воно виконається на збірці й потрапить у shell. `performance.now()` Next.js не охороняє — це телеметрія. А `crypto.randomUUID()` нічого не призупиняє: це синхронне значення, яке без `await io()` (або `'use cache'`) зупинить збірку помилкою, і `<Suspense>` тут не допоможе.

### 🧱 Cache Components: кешуй або обгортай у Suspense

З `cacheComponents: true` за замовчуванням **усе динамічне**: ніщо не кешується саме собою, як це було з `fetch` у Next.js 14. Але під час `next build` Next.js рендерить дерево кожного маршруту й намагається пререндерити якомога більше. Для кожного компонента є рівно чотири варіанти:

1. **Нічого з запиту і жодного I/O** — компонент пререндериться й потрапляє в shell автоматично.
2. **`'use cache'`** — результат кешується з терміном життя `cacheLife` і потрапляє в shell, якщо термін не надто короткий (деталі — у темі 15 основного посібника).
3. **Під `<Suspense>`** — у shell потрапляє fallback, а вміст рендериться під час запиту.
4. **Жодне з цього**, але компонент чекає на запит чи некешоване I/O — **помилка** в `next dev` і `next build`.

Четвертий пункт — головна зміна: замість мовчки зробити маршрут динамічним Next.js вимагає вибору «закешуй» або «покажи fallback». Так кожен маршрут має static shell.

Повна версія сторінки магазину поєднує всі варіанти. `searchParams` сторінка не розгортає сама — передає Promise в компонент під `<Suspense>`:

```tsx
// app/shop/page.tsx — статичне, кешоване й request-time на одній сторінці
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'
import { getProducts } from '../lib/products'

export default function ShopPage({ searchParams }: PageProps<'/shop'>) {
  return (
    <main>
      <h1>Магазин</h1>
      <Suspense fallback={<p>Вітаємо!</p>}>
        <Greeting />
      </Suspense>
      <ProductList />
      <Suspense fallback={<p>Сортування: …</p>}>
        <SortInfo searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

// request-time: cookies() відомі лише в запиті
async function Greeting() {
  const name = (await cookies()).get('name')?.value
  return <p>{name ? `Вітаємо, ${name}!` : 'Вітаємо!'}</p>
}

// кешоване: однакове для всіх, потрапляє в static shell
async function ProductList() {
  'use cache'
  cacheLife('hours')
  const products = await getProducts()
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.title} — {p.price} ₴
        </li>
      ))}
    </ul>
  )
}

// request-time: searchParams читаємо глибоко, сторінка лише передає Promise
async function SortInfo({ searchParams }: Pick<PageProps<'/shop'>, 'searchParams'>) {
  const { sort } = await searchParams
  return <p>Сортування: {typeof sort === 'string' ? sort : 'нові'}</p>
}
```

> [!note] Чому в прикладах дані в памʼяті
> `getProducts()` у прикладах повертає масив з памʼяті. Тут він і так у `'use cache'`, тож справжній запит до БД поводився б так само. В інших прикладах теми, де кешу немає, некешований запит до БД зупинив би збірку з `Next.js encountered uncached or runtime data during prerendering` — такі дані кешують (`'use cache'`, тема 15 основного посібника) або обгортають у `<Suspense>` ([[Next.js - 11. Streaming і Suspense]], [[Next.js - 12. Partial Prerendering і Cache Components]]).

Збірка показує `◐ /shop` з колонками `Revalidate 1h` і `Expire 1d`: shell містить кешований `ProductList` з профілем `hours`, тож і сам shell житиме не довше. У `.next/server/app/shop.html` лежать `<h1>`, обидва товари і два fallback-и — `<p>Вітаємо!</p>` і `<p>Сортування: …</p>`. Під час запиту з кукою `name=Olya` у тій самій відповіді дострімлюється `Вітаємо, Olya!`.

> [!diagram] Дерево /shop: що в shell, а що — дірки
> ```yaml
> layout: tree
> nodes:
>   - { id: page, label: "ShopPage", text: "shell", note: "не читає запит", tone: blue, icon: "px:file" }
>   - { id: h1, label: "<h1>", text: "shell", parent: page, tone: blue }
>   - { id: s1, label: "<Suspense>", text: "fallback у shell", note: "«Вітаємо!»", parent: page, tone: yellow, icon: "px:hourglass" }
>   - { id: gr, label: "Greeting", code: "await cookies()", note: "дірка: рендер у запиті", parent: s1, tone: orange, icon: "px:bolt" }
>   - { id: pl, label: "ProductList", code: "'use cache'", note: "shell, живе 1h", parent: page, tone: green, icon: "px:check" }
>   - { id: s2, label: "<Suspense>", text: "fallback у shell", parent: page, tone: yellow, icon: "px:hourglass" }
>   - { id: so, label: "SortInfo", code: "await searchParams", note: "дірка", parent: s2, tone: orange, icon: "px:bolt" }
> steps:
>   - { focus: page, note: "next build рендерить дерево згори. ShopPage нічого не читає з запиту, тож іде в shell разом з <h1>." }
>   - { focus: gr, note: "Greeting чекає на cookies(). Prerender тут зупиняється, а найближчий <Suspense> віддає в shell свій fallback." }
>   - { focus: pl, note: "ProductList закешований. Він виконується на збірці, і його HTML потрапляє в shell. Його cacheLife обмежує життя всього shell." }
>   - { focus: so, note: "SortInfo розгортає Promise searchParams — ще одна дірка під своїм fallback." }
>   - { show: [gr, so], note: "Під час запиту сервер віддає shell одразу й рендерить лише дві дірки. Їхній HTML доїжджає в тій самій відповіді." }
> ```
> Дірка — не «динамічна сторінка», а піддерево під найближчим `<Suspense>`, що чекає на запит.

> [!quiz] Що покаже таблиця маршрутів?
> level: middle · type: output · id: nextjs-core-10-quiz-03
>
> `cacheComponents: true`, дані в памʼяті. Три сторінки:
>
> ```tsx
> // app/about/page.tsx
> export default function About() {
>   return <p>Про нас</p>
> }
>
> // app/geo/page.tsx — UserAgent читає headers() і стоїть у <Suspense>
>
> // app/cached-clock/page.tsx
> export default async function CachedClockPage() {
>   'use cache'
>   cacheLife('minutes')
>   return <p>Згенеровано: {new Date().toISOString()}</p>
> }
> ```
>
> - [x] `○ /about`, `◐ /geo`, `○ /cached-clock` з `Revalidate 1m`
> - [ ] `○ /about`, `ƒ /geo`, `ƒ /cached-clock` — `headers()` і `new Date()` роблять маршрути динамічними
> - [ ] `○ /about`, `◐ /geo`, збірка падає на `new Date()` у `/cached-clock`
> - [ ] `○ /about`, `○ /geo`, `○ /cached-clock`: `<Suspense>` робить сторінку статичною
>
> **Пояснення:** у `/geo` shell з fallback готовий, а user agent стрімиться — `◐`. У `/cached-clock` час обчислюється один раз і живе в кеші з профілем `minutes`: `Revalidate 1m`, `Expire 1h`. Помилки немає, бо `new Date()` усередині `'use cache'` — легальний спосіб «захопити» значення. `ƒ` для сторінок з Cache Components зʼявляється лише тоді, коли пререндерити нічого не можна.

### ⏱️ Date.now(), Math.random() і io()

Синхронне значення, яке змінюється між рендерами, ставить Next.js перед вибором, який він не може зробити за тебе. `new Date()` у футері «© 2026» має бути однаковим для всіх і обчисленим один раз. `new Date()` у «Зараз: 16:26:30» — своїм для кожного запиту. Тому на 16.3.8 такий виклик без пояснень зупиняє збірку:

```tsx
// app/page.tsx — ❌ значення без вибору
export default function Home() {
  return <p>Збудовано: {Date.now()}</p>
}
```

```text
Error: Route "/": Next.js encountered the unstable value `Date.now()` while prerendering.

This value can change between renders, so it must be either prerendered or computed later.

Ways to fix this:
  - [dynamic] Render at request time by adding a dynamic data access (e.g. `await connection()`) before this call
  - [cache] Prerender and cache the value with `"use cache"`
  - [client] Render the value on the client with `"use client"`
  - [measure] If the value is for telemetry, use a timing API such as `performance.now()`

Learn more: https://nextjs.org/docs/messages/blocking-prerender-current-time
    at <unknown> (app/page.tsx:2:30)
```

Для `Math.random()` і `crypto.randomUUID()` текст той самий, змінюються назва значення й посилання (`blocking-prerender-random`, `blocking-prerender-crypto`). Зверни увагу: помилка вказує **рядок і стовпчик** — це на відміну від помилок про runtime data, які в `next build` показують лише `at body` / `at html`.

**Варіант «один раз для всіх»** — `'use cache'`. Значення обчислюється під час prerender (або revalidation) і потрапляє в shell. Так працює `/cached-clock` з попереднього тесту: два запити підряд показують однаковий час збірки, а заголовок `Cache-Control: s-maxage=60, stale-while-revalidate=3540` каже, що через хвилину сторінку можна перебудувати.

**Варіант «своє для кожного запиту»** — `await io()` з `next/cache` (додано в 16.3.0) і `<Suspense>` вище:

```tsx
// app/clock/page.tsx — час для кожного запиту, але shell статичний
import { Suspense } from 'react'
import { io } from 'next/cache'

export default function ClockPage() {
  return (
    <main>
      <h1>Годинник</h1>
      <Suspense fallback={<p>Дивимось на годинник…</p>}>
        <CurrentTime />
      </Suspense>
    </main>
  )
}

async function CurrentTime() {
  await io() // далі — значення, різне для кожного запиту
  return <p>Зараз: {new Date().toISOString()}</p>
}
```

`io()` каже Next.js: «далі йде I/O-операція». Під час prerender `await io()` призупиняється, як `fetch`, тож у shell іде fallback. Під час запиту, усередині кешованого скоупу, у браузері й без Cache Components `io()` повертає вже виконаний Promise — тобто нічого не коштує. Звідси його природа: це не «зроби динамічним», а «тут значення залежить від моменту виконання». Збірка показує `◐ /clock`, а кожен `curl` отримує новий час.

`io()` потрібен **лише** для синхронних джерел. Якщо компонент уже читає `cookies()` чи `headers()`, або чекає на `fetch` / асинхронний запит до БД під `<Suspense>`, точка призупинення вже є: `new Date()` після неї виконується під час запиту й помилки не дає (так поводиться, наприклад, `await cookies()` перед `new Date()`).

**Порядок має значення.** `io()` захищає лише код **після** себе. `new Date()` до `await io()` у тому самому компоненті — та сама помилка `unstable value`, бо на момент виклику prerender ще триває.

**У Client Component** — `use(io())`. Client Components теж рендеряться на сервері для HTML ([[Next.js - 07. Server і Client Components]]), тож `Date.now()` у них потрапив би в shell і «застиг» би:

```tsx
// app/client-clock/time.tsx
'use client'
import { use } from 'react'
import { io } from 'next/cache'

export function ClientTime() {
  use(io()) // інакше Date.now() застиг би у static shell
  return <p>Клієнтський час: {Date.now()}</p>
}
```

`use(io())` поза `<Suspense>` дає помилку `uncached or runtime data`, тож межа потрібна й тут. Під `<Suspense>` сторінка збирається як `○`: у HTML — fallback, значення обчислює браузер. Без `io()` і без межі збірка падає з `encountered the unstable value Date.now() in a Client Component`; на 16.3.8 одного `<Suspense>` без `io()` теж вистачило.

#### io() чи connection()

`connection()` з `next/server` існує з Next.js 15 і робить схожу річ: код після `await connection()` виключається зі shell. Документація `io()` стверджує, що різниця — **чого саме він чекає**: `connection()` нібито лишається призупиненим, доки до сервера не дійде повна навігація користувача, і тому блокує prefetch, а `io()` призупиняється як звичайна асинхронна функція, тож код після нього можна загорнути в `'use cache'`, prefetch-нути й закешувати на клієнті. Висновок документації — «Prefer `io()` over `connection()`», а `connection()` лишити для випадків, коли треба дочекатися справжнього запиту користувача. На 16.3.8 цієї різниці для prefetch не видно (дивись попередження нижче), тож не покладайся на `connection()` як на захист від prefetch.

Частину цього видно прямо у збірці 16.3.8. `connection()` усередині `'use cache'` зупиняє збірку:

```text
Error: Route / used `connection()` inside "use cache". The `connection()` function is used to indicate the
subsequent code must only run when there is an actual request, but caches must be able to be produced before
a request, so this function is not allowed in this scope.
See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache
```

А `await io()` усередині `'use cache'` — no-op: сторінка збирається як `○ /` з `Revalidate 15m, Expire 1y` (профіль `default`), і час захоплено в shell. Тому `io()` безпечно ставити в спільні функції даних: якщо їх викличуть з кешованого компонента, вони просто закешуються, а не зламають збірку.

> [!warning] Підказки в помилках досі радять connection()
> На 16.3.8 підказка `[dynamic]` у помилці `unstable value` пропонує `await connection()`, а сторінки [Caching](https://nextjs.org/docs/app/getting-started/caching#random-values-and-timestamps) і [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components#adopting-incrementally) показують `connection()` для випадкових значень. Новіша сторінка [io](https://nextjs.org/docs/app/api-reference/functions/io) і примітка на сторінці [connection](https://nextjs.org/docs/app/api-reference/functions/connection#good-to-know) радять `io()`, бо `connection()` нібито блокує prefetch. Заміри на 16.3.8 у продакшн-збірці (звичайний `<Link>`, `<Link prefetch={true}>`, `prefetch = 'partial'` на сторінці призначення, runtime prefetch на маршруті з кукою) **не показали жодної різниці** між `connection()` та `io()`: з `prefetch={true}` обидві сторінки повністю рендеряться вже під час prefetch, тобто код після `connection()` виконується без навігації. Обидва варіанти дають `◐` з однаковими заголовками. Пиши `io()` — він ще й дозволений у `'use cache'`, — але не розраховуй, що `connection()` захистить від prefetch.

> [!quiz] Заповни пропуски: свіжий UUID для кожного запиту
> level: middle · type: fill · id: nextjs-core-10-quiz-04 · bank: connection, use cache, next/server
>
> ```tsx fill
> // app/order/page.tsx
> import { Suspense } from 'react'
> import { [[io]] } from '[[next/cache]]'
>
> export default function OrderPage() {
>   return (
>     <[[Suspense]] fallback={<p>Створюємо замовлення…</p>}>
>       <OrderId />
>     </Suspense>
>   )
> }
>
> async function OrderId() {
>   [[await io()]]
>   return <p>Номер: {crypto.randomUUID()}</p>
> }
> ```
>
> **Пояснення:** `io()` імпортується з `next/cache`, а не з `next/server`, як `connection()`. `await io()` має стояти **до** `crypto.randomUUID()`, а компонент — під `<Suspense>`, інакше збірка зупиниться помилкою про runtime data. `'use cache'` тут не підходить: усі отримали б один номер.

> [!quiz] Перевір себе: io() чи connection()?
> level: middle · id: nextjs-core-10-quiz-05
>
> Хелпер `getVisitorCount()` читає лічильник із синхронного драйвера SQLite. Його викликають і з кешованого віджета «Статистика за день» (`'use cache'`), і з request-time компонента. Що поставити перед запитом до БД?
>
> - [x] `await io()`: у кешованому скоупі він no-op, у request-time компоненті виключає запит зі shell
> - [ ] `await connection()`: він правильніше означає «потрібен запит»
> - [ ] Нічого: синхронний драйвер і так виконується лише під час запиту
> - [ ] `export const dynamic = 'force-dynamic'` у файлі хелпера
>
> **Пояснення:** `connection()` усередині `'use cache'` зупиняє збірку (`used connection() inside "use cache"`). Синхронний драйвер, навпаки, виконується під час prerender — без маркера значення лічильника застигне в shell. `dynamic` — segment config сторінки, а не модуля, і з Cache Components він заборонений.

### 🧯 Помилки prerender і як їх читати

Майже всі помилки цієї теми — читання запиту чи нестабільне значення там, де Next.js чекав статичного. Тексти — з 16.3.8.

| Повідомлення | Де | Що сталося | Що зробити |
|---|---|---|---|
| `Next.js encountered uncached or runtime data during prerendering` | `next build` (у `next dev` — той самий текст для некешованих даних, з відповіддю 500) | `cookies()`, `headers()`, `params`, `searchParams`, `connection()`, `io()` чи некешований `fetch` поза `<Suspense>` | `<Suspense>` навколо; для даних — `'use cache'` |
| `Next.js encountered runtime data during prerendering` | `next dev` | те саме для `cookies()` / `headers()` / `params` / `searchParams` | `<Suspense>` |
| `encountered the unstable value \`Date.now()\` while prerendering` | обидва | синхронне нестабільне значення без вибору | `await io()` + `<Suspense>` або `'use cache'` |
| `encountered the unstable value \`Date.now()\` in a Client Component` | `next build` | те саме в Client Component | `<Suspense>`, `use(io())`, `useEffect` |
| `used \`cookies()\` inside "use cache"` | `next build` | runtime API у кешованому скоупі | прочитати поза кешем і передати аргументом |
| `used \`connection()\` inside "use cache"` | `next build` | те саме для `connection()` | `io()` або винести з кешу |
| `Route segment config "dynamic" is not compatible with \`nextConfig.cacheComponents\`` | `next build` (компіляція) | стара опція | видалити (розділ нижче) |

Ось як виглядає найчастіша з них — `cookies()` на верхньому рівні сторінки:

```tsx
// app/page.tsx — ❌ cookies() на верхньому рівні сторінки, без Suspense
import { cookies } from 'next/headers'

export default async function Home() {
  const theme = (await cookies()).get('theme')?.value ?? 'light'
  return <h1>Тема: {theme}</h1>
}
```

`next build`:

```text
Error: Route "/": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>`
prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at body (<anonymous>)
    at html (<anonymous>)
```

`next dev` для того самого файлу (сторінка при цьому відповідає `200`, помилка — в оверлеї й терміналі):

```text
Error: Route "/": Next.js encountered runtime data during prerendering.

`cookies()`, `headers()`, `params`, or `searchParams` accessed outside of `<Suspense>` prevents the route from
being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-runtime
    at Home (app/page.tsx:5:31)
```

Як читати. **Перший рядок** називає маршрут. **Список у бектиках** — не діагноз, а перелік підозрюваних. `next dev` точніший: розрізняє runtime і uncached data, прибирає зайвий `[cache]` і дає **рядок коду** (`app/page.tsx:5:31`). Тому порада збірки відкрити сторінку в `next dev` — найкоротший шлях; другий — `next build --debug-prerender`.

**Варіанти виправлення:**

- `[stream]` — межа `<Suspense>`: shell з fallback, вміст стрімиться. Вибір за замовчуванням для персональних даних.
- `[cache]` — `'use cache'` для **даних** (`fetch`, БД), але не для `cookies()`: runtime API всередині кешу — окрема помилка. Персональні дані можна закешувати з `'use cache: private'` (тема 15 основного посібника).
- `[block]` — `export const instant = false`: дозволити маршруту блокувати. Сторінка з `cookies()` нагорі й `instant = false` блокує: у таблиці збірки `ƒ`; заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру. Це інструмент поступової міграції, а не рішення. І він **не** знімає помилок `unstable value`: сторінка з `new Date()` і `instant = false` усе одно не збирається.

> [!quiz] Яку помилку дасть збірка?
> level: middle · type: output · id: nextjs-core-10-quiz-06
>
> `cacheComponents: true`. Автор почув, що «динамічне треба обгортати в Suspense», і написав:
>
> ```tsx
> // app/page.tsx
> import { Suspense } from 'react'
>
> function Time() {
>   return <p>{new Date().toISOString()}</p>
> }
>
> export default function Home() {
>   return (
>     <Suspense fallback={<p>…</p>}>
>       <Time />
>     </Suspense>
>   )
> }
> ```
>
> - [x] `Next.js encountered the unstable value new Date() while prerendering` з посиланням на рядок `new Date()` в `app/page.tsx`
> - [ ] Помилки немає: `<Suspense>` переносить `Time` у request-time, сторінка `◐`
> - [ ] Помилки немає: час збірки потрапляє в shell, сторінка `○`
> - [ ] `encountered uncached or runtime data during prerendering`: `new Date()` — runtime data
>
> **Пояснення:** `<Suspense>` лише показує fallback, поки щось призупинене. `Time` синхронний і нічого не призупиняє, тож рендериться під час prerender, де `new Date()` заборонений без явного вибору. Виправлення — `await io()` у `async function Time()` або `'use cache'`. Runtime data — це дані запиту (`cookies`, `headers`, `params`, `searchParams`), а не годинник.

### ⚙️ Route segment config: що лишилось

Route segment config — константи, які експортують з `page`, `layout` чи `route` (`export const revalidate = 60`). Під Cache Components половини старих опцій більше немає: документація каже, що в 16.0 `dynamic`, `dynamicParams`, `revalidate` і `fetchCache` прибрано, коли увімкнено `cacheComponents`. На 16.3.8 кожна з них — помилка компіляції з тим самим шаблоном:

```text
./app/page.tsx:1:14
Error: Route segment config "revalidate" is not compatible with `nextConfig.cacheComponents`. Please remove it.
> 1 | export const revalidate = 60
    |              ^^^^^^^^^^
```

| Було | Стало з Cache Components |
|---|---|
| `export const dynamic = 'force-dynamic'` | видалити: усе й так динамічне за замовчуванням |
| `export const dynamic = 'force-static'` | видалити; некешовані дані — у `'use cache'` з `cacheLife('max')`; читання запиту — прибрати |
| `export const revalidate = 3600` | `'use cache'` + `cacheLife('hours')` біля даних або на початку сторінки |
| `export const fetchCache = 'force-cache'` | видалити: усі `fetch` у `'use cache'` кешуються разом зі скоупом |
| `fetch(url, { next: { revalidate, tags } })` | функція з `'use cache'`, `cacheLife()` і `cacheTag()` |
| `export const dynamicParams = false` | перевірка в сторінці + `notFound()` ([[Next.js - 03. Динамічні маршрути]]) |
| `unstable_noStore()` | `connection()` (з 15), а для синхронних значень — `io()` (з 16.3) |

**Лишились** `runtime` (`'edge'` deprecated), `preferredRegion` (deprecated) і `maxDuration`. **Нові** — `instant` і `prefetch`, лише з Cache Components ([[Next.js - 12. Partial Prerendering і Cache Components]], [[Next.js - 04. Навігація під капотом]]).

> [!quiz] Перевір себе: як перенести revalidate?
> level: middle · id: nextjs-core-10-quiz-07
>
> Сторінка новин мала `export const revalidate = 3600` і `fetch` до CMS. Після `cacheComponents: true` збірка пише `Route segment config "revalidate" is not compatible`. Що зробити?
>
> - [x] Прибрати експорт, а функцію отримання новин позначити `'use cache'` з `cacheLife('hours')`
> - [ ] Перейменувати на `export const cacheLife = 3600`
> - [ ] Додати `export const dynamic = 'force-static'`, щоб сторінка лишилась ISR
> - [ ] Обгорнути сторінку в `<Suspense>`: revalidation відбудеться при стрімінгу
>
> **Пояснення:** з Cache Components термін життя належить кешованій функції, а не маршруту: `cacheLife` — це функція з `next/cache`, а не segment config. `dynamic` теж заборонений. `<Suspense>` прибрав би новини зі shell і рендерив би їх на кожен запит — протилежне ISR.

### 📋 Читаємо вивід next build

Ось таблиця маршрутів прикладів цієї теми (16.3.8, `cacheComponents: true`; скорочено):

```text
Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /about
├ ◐ /account
├ ƒ /api/draft
├ ○ /api/hello
├ ƒ /api/time
├ ○ /cached-clock              1m      1h
├ ○ /client-clock
├ ◐ /clock
├ ◐ /clock-connection
├ ○ /draft
├ ◐ /geo
└ ◐ /shop                      1h      1d

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

| Що бачиш | Що це означає |
|---|---|
| `○` без колонок | повністю пререндерено, живе до наступного деплою (`/`, `/about`, `/draft`) |
| `○` з `Revalidate` / `Expire` | пререндерено з кешованим вмістом: перебудова після `Revalidate`, повне викидання після `Expire` (`/cached-clock` — профіль `minutes`) |
| `◐` | є static shell і хоча б одна дірка під `<Suspense>` (`/clock`, `/shop`) |
| `◐` з колонками | у shell є кешований вміст, і його `cacheLife` обмежує життя shell (`/shop` — профіль `hours`) |
| `ƒ` | пререндерити нічого: Route Handler, що читає `request` або вмикає Draft Mode, чи блокуюча сторінка з `instant = false` (заголовки йдуть одразу, HTML — лише після повного рендеру) |

Помітні деталі. `GET`-Route Handler теж пререндериться за тими самими правилами: `/api/hello` без читання запиту — `○`, `/api/time` з `request.headers` — `ƒ`. `/client-clock` — `○`, хоча час рахується щоразу: shell містить лише fallback, а значення обчислює браузер, тож сервер під час запиту нічого не рендерить. А `/draft` — `○`, бо `draftMode()` на збірці відомий.

### 📡 Заміряємо: curl і заголовки

Таблиця маршрутів — обіцянка. Перевірка — у заголовках відповіді `next start`. Ось що повертає `curl -sI` для тих самих маршрутів (16.3.8, `next start`, скорочено):

| Маршрут | Символ | `x-nextjs-cache` | `Cache-Control` | Інше |
|---|---|---|---|---|
| `/` | `○` | `HIT` | `s-maxage=31536000` | `x-nextjs-prerender: 1` |
| `/cached-clock` | `○` 1m | `HIT` | `s-maxage=60, stale-while-revalidate=3540` | |
| `/clock`, `/shop` | `◐` | — | `private, no-cache, no-store, max-age=0, must-revalidate` | `x-nextjs-postponed: 1`, `Transfer-Encoding: chunked` |
| `/api/hello` | `○` | `HIT` | `s-maxage=31536000` | |
| `/api/time` | `ƒ` | — | — | |

Як читати:

- **`x-nextjs-cache: HIT`** — відповідь віддано з кешу пререндерів Next.js (`MISS` і `STALE` бувають після закінчення терміну). Для `◐` цього заголовка немає: відповідь щоразу збирається з shell і свіжих дірок.
- **`Cache-Control: s-maxage=…`** — інструкція для CDN. `31536000` — рік, тобто «до наступного деплою». Для `/cached-clock` `s-maxage=60` = `Revalidate 1m`, а `60 + 3540 = 3600` секунд = `Expire 1h`: годину CDN може віддавати застарілу версію, поки сервер перебудовує нову.
- **`private, no-cache, no-store`** на `◐` — відповідь містить персональні дірки, тож цілою її не кешують. `x-nextjs-postponed: 1` каже, що рендер має відкладені частини, — але ті самі заголовки (`x-nextjs-prerender: 1`, `x-nextjs-postponed: 1`, `private, no-store`) повертає й блокуюча сторінка з `instant = false`. Відрізнити `◐` від неї можна лише таблицею збірки або таймінгом тіла: у `◐` shell приходить одразу, у блокуючої — заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру. Віддавати shell з CDN, а дірки з сервера, вміє лише платформа з підтримкою PPR.
- **Нічого кешового** на `ƒ` Route Handler — рендер на кожен запит.

Для порівняння, без Cache Components `/dash` з `cookies()` повертав ту саму `private, no-cache, no-store…`, але без shell, а `/news` з `revalidate = 60` — `x-nextjs-cache: HIT` і `s-maxage=60, stale-while-revalidate=31535940`.

Два запити до `/clock` поспіль дають різний час, до `/cached-clock` — однаковий, з моменту збірки. `curl -b 'name=Olya' /shop` повертає спершу `<p>Вітаємо!</p>`, а нижче — `<div hidden id="S:0"><p>Вітаємо, Olya!</p></div>`, який React підставить на місце fallback.

> [!quiz] Що покаже curl?
> level: middle · type: output · id: nextjs-core-10-quiz-08
>
> `next build && next start`, `cacheComponents: true`. Сторінка `/account` має статичний заголовок і `<UserMenu />` під `<Suspense>`, що читає куку. Таблиця маршрутів показує `◐ /account`. Що поверне `curl -sI localhost:3000/account`?
>
> - [x] `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` і `x-nextjs-postponed: 1`, без `x-nextjs-cache`
> - [ ] `x-nextjs-cache: HIT` і `Cache-Control: s-maxage=31536000` — shell пререндерений
> - [ ] `x-nextjs-cache: MISS`: shell є, а меню — ні
> - [ ] Жодних кешових заголовків, як у `ƒ` Route Handler
>
> **Пояснення:** відповідь `◐` складається зі shell і персональної дірки, тому її цілою не кешують — звідси `private, no-store`. `x-nextjs-postponed: 1` показує відкладені частини; голих заголовків без кешу, як у `ƒ` Route Handler, тут не буде. Ті самі заголовки дала б і блокуюча сторінка з `instant = false`, тож `◐` підтверджує таблиця збірки, а не `curl -I`. `HIT` і `s-maxage=31536000` бувають у повністю статичних `○`.

### 🪚 Як локалізувати динамічне

Чим глибше в дереві читання запиту, тим більша частина сторінки пререндериться. Документація називає це структурним патерном, який Cache Components винагороджує. Три прийоми.

**1. Опускай `await` вниз.** Не читай `cookies()` у сторінці, щоб передати імʼя через три рівні props. Читай його в тому листку, що показує імʼя, і обгорни лише цей листок. Сторінка тоді синхронна й повністю потрапляє в shell.

**2. Передавай Promise, а не значення.** `searchParams`, `params` і результат `cookies()` — Promise. Компонент вище може передати Promise вниз **без `await`**, і призупиниться лише той, хто його розгорне. Так зроблено `SortInfo` вище, і так само працює layout:

```tsx
// app/account/layout.tsx — layout не чекає на cookies: лише передає Promise
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { UserMenu } from './user-menu'

export default function AccountLayout({ children }: LayoutProps<'/account'>) {
  const cookieStore = cookies() // без await: це ще не читання
  return (
    <div>
      <header>
        <strong>Кабінет</strong>
        <Suspense fallback={<span>Гість</span>}>
          <UserMenu cookieStore={cookieStore} />
        </Suspense>
      </header>
      {children}
    </div>
  )
}
```

```tsx
// app/account/user-menu.tsx — тут Promise нарешті розгортається
import { cookies } from 'next/headers'

type CookieStore = Awaited<ReturnType<typeof cookies>>

export async function UserMenu({ cookieStore }: { cookieStore: Promise<CookieStore> }) {
  const name = (await cookieStore).get('name')?.value
  return <span>{name ?? 'Гість'}</span>
}
```

Збірка — `◐ /account`. У HTML спершу `<span>Гість</span>`, потім дострімлене `<span>Olya</span>`. Те саме з `params` у layout динамічного сегмента: документація показує `params.then(({ slug }) => <SlugHeading slug={slug} />)` усередині `<Suspense>` замість `const { slug } = await params` на верхньому рівні layout.

**3. Витягни значення й передай його в кешовану функцію.** Runtime API в `'use cache'` заборонені, але значення з них — ні. Компонент без кешу читає `cookies()`, а кешованому дочірньому компоненту передає лише `sessionId` чи `locale`. Аргумент стає частиною ключа кешу: однакові значення беруть результат з кешу, а request-time лишається лише тонка обгортка.

> [!quiz] Склади layout, який не блокує shell
> level: middle · type: order · id: nextjs-core-10-quiz-09
>
> Збери `app/account/layout.tsx`, у якому `cookies()` не робить динамічним увесь layout.
>
> ```tsx order
> export default function AccountLayout({ children }: LayoutProps<'/account'>) {
>   const cookieStore = cookies()
>   const name = (await cookies()).get('name')?.value // ✗
>   return (
>     <div>
>       <Suspense fallback={<span>Гість</span>}>
>         <UserMenu cookieStore={cookieStore} />
>       </Suspense>
>       {children}
>     </div>
>   )
> }
> ```
>
> **Пояснення:** layout синхронний і лише передає Promise: `cookies()` без `await` нічого не читає. `await cookies()` у тілі layout — дистрактор: він зробив би layout `async` і призупинив би його поза `<Suspense>`, тобто ту саму помилку `runtime data during prerendering`. Межа `<Suspense>` стоїть рівно навколо `UserMenu`, тож `{children}` і решта layout потрапляють у shell.

### 🏭 Як це роблять у продакшні

- **Почни з `next build` і таблиці маршрутів.** Кожен новий `ƒ` у PR — привід спитати «чому не `◐`?». Кожен `◐` там, де очікували `○`, — пошукати випадкове читання запиту (часто — `headers()` в аналітиці в root layout).
- **Root layout — без читання запиту**, інакше все під його межею стає діркою на кожній сторінці. Тему, мову, сесію читають у листках.
- **Шар даних з `io()`.** Функції, що читають синхронні джерела (`node:sqlite`, генератори id, `new Date()` для «зараз»), починаються з `await io()`. Тоді їх безпечно викликати і з кешованого, і з request-time коду.
- **Побічні ефекти — не в рендері.** Лічильники переглядів, одноразові токени, аудит не ставлять після `connection()`: на 16.3.8 з `<Link prefetch={true}>` такий код виконується вже під час prefetch. Їм місце в Server Action або Route Handler.
- **Fallback тієї ж висоти**, що й вміст, інакше буде зсув макета (CLS): для `UserMenu` — кнопка «Гість», а не спінер.
- **Перевірка в CI.** `next build` сам ловить помилки prerender; після деплою smoke-тест робить `curl -sI` ключових URL.

## ⚠️ Пастки

> [!pitfall] Suspense навколо синхронного new Date()
> `<Suspense>` показує fallback лише для того, що призупинилося. Синхронний компонент рендериться під час prerender, і збірка падає з `unstable value`.
>
> ```tsx
> function Time() {
>   return <p>{new Date().toISOString()}</p> // ❌ навіть під <Suspense>
> }
>
> async function Time() {
>   await io() // ✅ тепер є точка призупинення
>   return <p>{new Date().toISOString()}</p>
> }
> ```

> [!pitfall] cookies() у root layout «один раз для всіх»
> Зручно прочитати тему в root layout і передати вниз. Але тоді або вся сторінка блокує (`instant = false`, `ƒ` на кожному маршруті), або все під межею `<Suspense>` стає діркою на кожній сторінці. Читай куку в компоненті, що її показує.

> [!pitfall] Синхронний драйвер БД застигає в shell
> `better-sqlite3` чи `node:sqlite` не мають `await`, тож Next.js вважає запит «передбачуваним» і виконує його на збірці. Помилки немає — є лічильник, який ніколи не змінюється. Перед запитом потрібен `await io()`.

> [!pitfall] instant = false як «вимикач помилок»
> Помилки про runtime data зникають, але маршрут стає `ƒ` без shell — повернення до старої моделі. Помилки `unstable value` при цьому лишаються. Це тимчасова позначка міграції, яку треба прибрати.

## 🎤 На співбесіді

> [!interview] Що робить маршрут у Next.js динамічним?
> level: middle · frequency: дуже часто · id: nextjs-core-10-int-01
>
> ---
>
> Залежить від моделі. Без Cache Components увесь маршрут стає динамічним, щойно під час рендера прочитано Request-time API (`cookies`, `headers`, `searchParams`, `draftMode`), викликано `connection()`, зроблено `fetch` з `no-store` або виставлено `dynamic = 'force-dynamic'`. З Cache Components (Next.js 16) питання переходить на рівень компонента: усе динамічне за замовчуванням, але Next.js пререндерить static shell з усього, що не чекає на запит; компонент, що читає запит чи некешовані дані, має стояти під `<Suspense>` (дірка, `◐`) або бути закешованим (`'use cache'`). Інакше — помилка збірки. `ƒ` лишається для того, де пререндерити нічого.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🧭 Що робить рендер request-time|Розділ: що робить рендер request-time]] · [Next.js: Caching](https://nextjs.org/docs/app/getting-started/caching) · [Next.js: Rendering Philosophy](https://nextjs.org/docs/app/guides/rendering-philosophy)

> [!interview] Що таке static shell і що в нього потрапляє?
> level: middle · frequency: часто · id: nextjs-core-10-int-02
>
> ---
>
> Static shell — пререндерений HTML (і RSC payload) сторінки, який віддають одразу, ще до рендера request-time частин. У нього потрапляють компоненти без читання запиту й без некешованого I/O, результати `'use cache'` з достатньо довгим `cacheLife` і fallback-и `<Suspense>`. Те, що чекає на `cookies()`, `searchParams`, `io()` чи некешований `fetch`, рендериться під час запиту й стрімиться в тій самій відповіді. Shell можна віддати з CDN — для цього платформа має підтримувати PPR.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🧱 Cache Components: кешуй або обгортай у Suspense|Розділ: Cache Components]] · [Next.js: Glossary — Static Shell](https://nextjs.org/docs/app/glossary#static-shell)

> [!interview] Як показати поточний час на сторінці з Cache Components? Чим io() відрізняється від connection()?
> level: middle · frequency: часто · id: nextjs-core-10-int-03
>
> ---
>
> Спершу вирішити, чий це час. «Один раз для всіх» (рік у футері) — `'use cache'`, значення захоплюється в shell. «Своє для кожного запиту» — `await io()` з `next/cache` перед `new Date()` і `<Suspense>` вище; у Client Component — `use(io())`. Обидва, `io()` і `connection()`, виключають наступний код зі shell, але `connection()` заборонений у `'use cache'`, а документація ще й стверджує, що він блокує prefetch (на 16.3.8 у замірах цього не видно). `io()` — лише маркер I/O: у кеші, у браузері й під час запиту він резолвиться одразу. Тому документація радить `io()`, а `connection()` — коли справді потрібен реальний запит.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#⏱️ Date.now(), Math.random() і io()|Розділ: io()]] · [Next.js: io](https://nextjs.org/docs/app/api-reference/functions/io) · [Next.js: connection](https://nextjs.org/docs/app/api-reference/functions/connection)

> [!interview] Ви вмикаєте cacheComponents у великому застосунку. Що зламається і як мігрувати?
> level: senior · frequency: іноді · id: nextjs-core-10-int-04
>
> ---
>
> Збірка впаде на трьох класах проблем. Segment config `dynamic`, `revalidate`, `fetchCache`, `dynamicParams` — помилка компіляції: прибрати або замінити на `'use cache'` + `cacheLife` і `notFound()`. Читання запиту й некешовані дані поза `<Suspense>` — помилка prerender: кешувати або обгорнути. Синхронні `Date.now()` / `Math.random()` — `unstable value`. Стратегія: прибрати config, тимчасово поставити `instant = false` (є codemod), одразу виправити синхронні значення (їх `instant = false` не знімає) і переводити маршрути по одному, стежачи за таблицею маршрутів. Памʼятати: `'use cache'` за замовчуванням живе в памʼяті інстанса, на відміну від fetch Data Cache.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#⚙️ Route segment config: що лишилось|Розділ: segment config]] · [Next.js: Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)

> [!interview] Сторінка товару в таблиці маршрутів — ƒ, хоча 95 % вмісту однакові для всіх. Як знайти й виправити причину?
> level: senior · frequency: часто · id: nextjs-core-10-int-05
>
> ---
>
> З Cache Components `ƒ` означає, що shell немає: найімовірніше, `instant = false` на сегменті чи layout вище. Без Cache Components — Request-time API десь у сторінці або layout (часто `headers()` в аналітиці чи `cookies()` для кошика в шапці). Знайти: `next dev` покаже рядок, або `next build --debug-prerender`. Виправити: опустити читання в листки під власний `<Suspense>`, передавати Promise замість `await` у layout, опис і ціну закешувати з `'use cache'` + `cacheTag`. Перевірити: таблиця збірки показує `◐`, а shell приходить одразу. `x-nextjs-postponed: 1` у `curl` не доказ: блокуюча сторінка з `instant = false` дає ті самі заголовки.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🪚 Як локалізувати динамічне|Розділ: локалізація]] · [Next.js: Caching — Maximizing the static shell](https://nextjs.org/docs/app/getting-started/caching#maximizing-the-static-shell)

## 🔗 Звʼязки

- [[Next.js - 07. Server і Client Components]] — Server Components виконуються на збірці або під час запиту; ця тема пояснює, коли саме.
- [[Next.js - 03. Динамічні маршрути]] — `params`, `generateStaticParams` і символи `○` / `◐` у таблиці маршрутів для динамічних сегментів.
- [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration]] — що саме лежить у shell: HTML і RSC payload.
- Далі: [[Next.js - 11. Streaming і Suspense]] — як дірки доїжджають у відповіді, [[Next.js - 12. Partial Prerendering і Cache Components]] — PPR, App Shell і instant navigation; тема 15 основного посібника — `'use cache'`, `cacheLife`, `'use cache: private'`.

## ⚡ Фішки

> [!reel] 🎚️ Статичне — це компонент, а не сторінка
> З Cache Components одна сторінка має static shell, кешовані блоки й request-time дірки. Питання «маршрут статичний?» замінюється на «де межа Suspense?».

> [!reel] 🧊 Suspense нічого не робить динамічним
> `<Suspense>` лише показує fallback, поки щось призупинене. Синхронний `new Date()` під ним усе одно виконається на збірці — і зупинить її.

> [!reel] ⏱️ io() — маркер, а не вимикач
> `await io()` призупиняє лише під час prerender. Під час запиту, у `'use cache'` і в браузері він резолвиться одразу. Тому його безпечно класти в спільний шар даних.
>
> ```tsx
> async function Now() {
>   await io()
>   return <p>{new Date().toISOString()}</p>
> }
> ```

> [!reel] 🪝 cookies() без await — ще не читання
> Layout може викликати `cookies()` і передати Promise вниз. Призупиниться лише той компонент, що зробить `await`, — і тільки він стане діркою.

> [!reel] 📡 ◐ віддає no-store, і це нормально
> `curl -I` на `◐`-сторінці показує `private, no-cache, no-store`. Це не «кеш зламався»: відповідь містить персональні дірки, а shell пререндерений — це видно в таблиці збірки.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке prerendering?
> *дуже часто · теорія* · `nextjs-core-10-card-01`
>
> Рендер компонента до запиту — під час `next build` або у фоні під час revalidation. Результат (HTML і RSC payload) кешують і віддають одразу. Протилежність — request-time rendering, коли рендер відбувається під час конкретного запиту.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🌗 Статичне і динамічне — спектр, а не перемикач|Розділ: спектр]] · [Next.js: Glossary — Prerendering](https://nextjs.org/docs/app/glossary#prerendering)

> [!question]- Назви Request-time APIs.
> *дуже часто · теорія* · `nextjs-core-10-card-02`
>
> `cookies()` і `headers()` з `next/headers`, пропс `searchParams` сторінки і `draftMode()`. Вони дають дані конкретного запиту, тож компонент, що їх читає, рендериться під час запиту. До них близькі `params` без `generateStaticParams` і `connection()`.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🧭 Що робить рендер request-time|Розділ: request-time]] · [Next.js: Glossary — Request-time APIs](https://nextjs.org/docs/app/glossary#request-time-apis)

> [!question]- Що означають символи ○, ◐ і ƒ у виводі next build?
> *часто · практика* · `nextjs-core-10-card-03`
>
> `○` Static — повністю пререндерено. `◐` Partial Prerender — є static shell, а частина стрімиться під час запиту. `ƒ` Dynamic — рендер на кожен запит, пререндерити нічого. Колонки `Revalidate` / `Expire` показують, скільки живе кешований вміст.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#📋 Читаємо вивід next build|Розділ: вивід next build]] · [Next.js: Caching](https://nextjs.org/docs/app/getting-started/caching#prerendering)

> [!question]- Чому сторінка з cookies() без Suspense не збирається з cacheComponents?
> *часто · помилки* · `nextjs-core-10-card-04`
>
> Next.js вимагає, щоб кожен маршрут мав static shell. `cookies()` відомі лише в запиті, і без `<Suspense>` немає fallback, який можна віддати замість них. Помилка: `Next.js encountered uncached or runtime data during prerendering`. Виправлення — `<Suspense>` навколо компонента, що читає куку.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🧯 Помилки prerender і як їх читати|Розділ: помилки]] · [Next.js: cookies](https://nextjs.org/docs/app/api-reference/functions/cookies#good-to-know)

### 🟡 Middle

> [!question]- Навіщо io() і звідки його імпортувати?
> *часто · теорія* · `nextjs-core-10-card-05`
>
> `io()` з `next/cache` (16.3) — маркер «далі I/O». Ставиться перед синхронними нестабільними значеннями (`new Date()`, `Math.random()`, `crypto.randomUUID()`, синхронний драйвер БД). Під час prerender призупиняється, тож у shell іде fallback; під час запиту, у кеші, у браузері — резолвиться одразу. У Client Component — `use(io())`.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#⏱️ Date.now(), Math.random() і io()|Розділ: io()]] · [Next.js: io](https://nextjs.org/docs/app/api-reference/functions/io)

> [!question]- Чим io() відрізняється від connection()?
> *часто · порівняння* · `nextjs-core-10-card-06`
>
> Обидва виключають наступний код зі shell. `connection()` (`next/server`) заборонений у `'use cache'` (помилка збірки); документація стверджує, що він ще й блокує prefetch, але на 16.3.8 з `prefetch={true}` код після нього виконується під час prefetch так само, як після `io()`. `io()` — лише маркер I/O, дозволений і в кеші. Документація радить `io()`.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#io() чи connection()|Розділ: io() чи connection()]] · [Next.js: io — How io() differs from connection()](https://nextjs.org/docs/app/api-reference/functions/io#how-io-differs-from-connection)

> [!question]- Чим замінити export const revalidate і dynamic з Cache Components?
> *часто · міграція* · `nextjs-core-10-card-07`
>
> Обидва — помилка `Route segment config … is not compatible with nextConfig.cacheComponents`. `force-dynamic` просто прибрати. `revalidate` → `'use cache'` + `cacheLife(...)` біля даних. `force-static` → `'use cache'` з `cacheLife('max')` і без читання запиту. `fetchCache` прибрати. Лишились `runtime`, `preferredRegion`, `maxDuration`, зʼявились `instant` і `prefetch`.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#⚙️ Route segment config: що лишилось|Розділ: segment config]] · [Next.js: Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)

> [!question]- Як прочитати cookies у layout і не заблокувати shell?
> *часто · практика* · `nextjs-core-10-card-08`
>
> Не робити `await` у layout. `const cookieStore = cookies()` повертає Promise; передай його в дочірній компонент під `<Suspense>`, і нехай `await` зробить він. Layout лишається синхронним і йде в shell, діркою стає лише меню.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🪚 Як локалізувати динамічне|Розділ: локалізація]] · [Next.js: Caching — Maximizing the static shell](https://nextjs.org/docs/app/getting-started/caching#maximizing-the-static-shell)

> [!question]- Які заголовки відповіді показують, статична сторінка чи ні?
> *іноді · практика* · `nextjs-core-10-card-09`
>
> `○`: `x-nextjs-cache: HIT`, `Cache-Control: s-maxage=31536000` (або `s-maxage=N, stale-while-revalidate=…` з `cacheLife`). `◐`: `private, no-cache, no-store…` і `x-nextjs-postponed: 1` — але так само відповідає й блокуюча `ƒ`-сторінка з `instant = false`, тож `◐` підтверджує таблиця збірки. `ƒ`-Route Handler: кешових заголовків немає.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#📡 Заміряємо: curl і заголовки|Розділ: заголовки]] · [Next.js: CDN Caching](https://nextjs.org/docs/app/guides/cdn-caching)

### 🔴 Senior

> [!question]- Чому Suspense навколо синхронного new Date() не допомагає?
> *іноді · пастка* · `nextjs-core-10-card-10`
>
> Suspense показує fallback лише для призупиненого піддерева. Синхронний компонент нічого не призупиняє, тож виконується під час prerender, а там нестабільне значення без вибору — помилка `unstable value`. Потрібна точка призупинення (`await io()`) або кеш. Порядок важливий: `io()` захищає лише код після себе.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#⏱️ Date.now(), Math.random() і io()|Розділ: io()]] · [Next.js: Caching — Random values and timestamps](https://nextjs.org/docs/app/getting-started/caching#random-values-and-timestamps)

> [!question]- Що дає export const instant = false і чому це не рішення?
> *іноді · міграція* · `nextjs-core-10-card-11`
>
> Дозволяє сегменту блокувати рендер: помилки про runtime data зникають, а маршрут з `cookies()` нагорі стає `ƒ` без shell. Помилки `unstable value` (`Date.now()`, `Math.random()`) лишаються. Це інструмент поступової міграції (є codemod), позначка «повернутися пізніше», а не спосіб писати новий код.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🧯 Помилки prerender і як їх читати|Розділ: помилки]] · [Next.js: Migrating to Cache Components — Opting out of validation](https://nextjs.org/docs/app/guides/migrating-to-cache-components#opting-out-of-validation)

> [!question]- Чому ◐-сторінка віддає Cache-Control: no-store, якщо shell статичний?
> *іноді · інфраструктура* · `nextjs-core-10-card-12`
>
> Відповідь — shell плюс персональні дірки в одному потоці, тож кешувати її цілою не можна. Shell пререндерений (це видно в таблиці збірки), але щоб CDN віддавав лише його, а сервер дострімлював дірки, потрібна платформа з підтримкою PPR resume. На звичайному `next start` shell береться з кешу сервера, а відповідь лишається `private`.
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#📡 Заміряємо: curl і заголовки|Розділ: заголовки]] · [Next.js: Rendering Philosophy — Infrastructure Implications](https://nextjs.org/docs/app/guides/rendering-philosophy#infrastructure-implications)

> [!question]- Як закешувати дані, що залежать від куки, якщо cookies() у 'use cache' заборонений?
> *часто · практика* · `nextjs-core-10-card-13`
>
> Прочитати куку в некешованому компоненті під `<Suspense>` і передати значення (наприклад, `sessionId`) аргументом у функцію чи компонент з `'use cache'` — воно стане частиною ключа кешу. Інший шлях — `'use cache: private'`, де читати `cookies()` можна прямо (тема 15 основного посібника).
>
> 📚 [[Next.js - 10. Статичний і динамічний рендеринг#🪚 Як локалізувати динамічне|Розділ: локалізація]] · [Next.js: Caching — Passing runtime values to cached functions](https://nextjs.org/docs/app/getting-started/caching#passing-runtime-values-to-cached-functions)

## 🛠️ Практика

> [!task] Розклади дерево на shell і дірки
> level: middle · difficulty: easy · id: nextjs-core-10-task-01 · tags: static-shell, suspense, use-cache
>
> Напиши `classifyTree(root)`, що для дерева компонентів повертає, які вузли потраплять у static shell, а які рендеряться під час запиту («дірки»). Спрощена модель Cache Components:
>
> - вузол **чекає на запит**, якщо в `reads` є хоч одне читання (`cookies`, `headers`, `searchParams`, `connection`, `io`, `fetch`) і він **не** всередині кешованого скоупу (свій `cache: true` або в будь-якого предка);
> - вузол, що чекає на запит, і **всі його нащадки** — дірки;
> - решта вузлів, зокрема самі `<Suspense>` (`suspense: true`) поза діркою, — у shell (їхній fallback іде в HTML);
> - обидва масиви — імена в порядку обходу в глибину (preorder). Вважай дерево коректним: кожен вузол, що чекає, має `<Suspense>` вище.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type Read = 'cookies' | 'headers' | 'searchParams' | 'connection' | 'io' | 'fetch'
>
> type Node = {
>   name: string
>   suspense?: boolean // це <Suspense>: його fallback іде в static shell
>   cache?: boolean // компонент з 'use cache'
>   reads?: Read[] // що компонент читає під час рендера
>   children?: Node[]
> }
>
> function classifyTree(root: Node): { shell: string[]; holes: string[] } {
>   const shell: string[] = []
>   const holes: string[] = []
>   // ❌ «динамічний той, хто читає» — а діти, кеш?
>   function walk(node: Node) {
>     if ((node.reads ?? []).length > 0) holes.push(node.name)
>     else shell.push(node.name)
>     for (const child of node.children ?? []) walk(child)
>   }
>   walk(root)
>   return { shell, holes }
> }
> ```
>
> ```ts tests
> test('сторінка без читань — уся в static shell', () => {
>   const page: Node = { name: 'Page', children: [{ name: 'Header' }, { name: 'Footer' }] }
>   expect(classifyTree(page)).toEqual({ shell: ['Page', 'Header', 'Footer'], holes: [] })
> })
>
> test('cookies() у Suspense: дірка — лише компонент, що читає; сам Suspense у shell', () => {
>   const page: Node = {
>     name: 'Page',
>     children: [
>       { name: 'Header' },
>       { name: 'Boundary', suspense: true, children: [{ name: 'Greeting', reads: ['cookies'] }] },
>     ],
>   }
>   expect(classifyTree(page)).toEqual({ shell: ['Page', 'Header', 'Boundary'], holes: ['Greeting'] })
> })
>
> test('нащадки компонента, що чекає на запит, теж рендеряться під час запиту', () => {
>   const page: Node = {
>     name: 'Page',
>     children: [
>       {
>         name: 'Boundary',
>         suspense: true,
>         children: [{ name: 'Cart', reads: ['cookies'], children: [{ name: 'CartItem' }, { name: 'Total' }] }],
>       },
>     ],
>   }
>   expect(classifyTree(page).holes).toEqual(['Cart', 'CartItem', 'Total'])
> })
>
> test('use cache: fetch і io() всередині кешу не роблять дірку — ні в самому компоненті, ні в дітях', () => {
>   const page: Node = {
>     name: 'Page',
>     children: [
>       { name: 'ProductList', cache: true, reads: ['fetch'], children: [{ name: 'Price', reads: ['fetch'] }] },
>       { name: 'Stamp', cache: true, reads: ['io'] },
>     ],
>   }
>   expect(classifyTree(page)).toEqual({ shell: ['Page', 'ProductList', 'Price', 'Stamp'], holes: [] })
> })
>
> test('Suspense всередині дірки — теж частина дірки', () => {
>   const page: Node = {
>     name: 'Page',
>     children: [
>       {
>         name: 'Outer',
>         suspense: true,
>         children: [
>           {
>             name: 'Feed',
>             reads: ['searchParams'],
>             children: [{ name: 'Inner', suspense: true, children: [{ name: 'Comments', reads: ['fetch'] }] }],
>           },
>         ],
>       },
>       { name: 'Sidebar' },
>     ],
>   }
>   expect(classifyTree(page)).toEqual({ shell: ['Page', 'Outer', 'Sidebar'], holes: ['Feed', 'Inner', 'Comments'] })
> })
> ```
>
> > [!hint]- Підказка 1
> > Рекурсії потрібні два прапорці від предків: «я в кешованому скоупі» і «я вже в дірці».
>
> > [!hint]- Підказка 2
> > Кеш успадковується вниз: дитина кешованого компонента теж у кеші, навіть без власного `cache: true`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Read = 'cookies' | 'headers' | 'searchParams' | 'connection' | 'io' | 'fetch'
> >
> > type Node = {
> >   name: string
> >   suspense?: boolean
> >   cache?: boolean
> >   reads?: Read[]
> >   children?: Node[]
> > }
> >
> > function classifyTree(root: Node): { shell: string[]; holes: string[] } {
> >   const shell: string[] = []
> >   const holes: string[] = []
> >
> >   function walk(node: Node, inCache: boolean, inHole: boolean) {
> >     const cached = inCache || node.cache === true
> >     const suspends = !cached && (node.reads ?? []).length > 0
> >     const hole = inHole || suspends
> >     ;(hole ? holes : shell).push(node.name)
> >     for (const child of node.children ?? []) walk(child, cached, hole)
> >   }
> >
> >   walk(root, false, false)
> >   return { shell, holes }
> > }
> > ```
> >
> > Модель повторює правило з документації: shell — усе, що завершується під час prerender, плюс fallback-и. Компонент, що чекає на запит, тягне в дірку все піддерево, бо його діти рендеряться лише після його `await`. Найчастіша помилка — перевіряти кеш лише на самому вузлі: тоді `Price` усередині кешованого `ProductList` хибно стає діркою.

> [!task] Знайди помилки prerender у дереві
> level: middle · difficulty: medium · id: nextjs-core-10-task-02 · tags: prerender-errors, io, use-cache
>
> Напиши `findPrerenderErrors(root)` — список помилок, які дасть `next build` з Cache Components. До читань з першої задачі додаються `'date'` (`new Date()`, `Date.now()`) і `'random'` (`Math.random()`, `crypto.randomUUID()`). `reads` — у порядку виконання. Правила:
>
> - у кешованому скоупі (свій `cache` або предка): `cookies`, `headers`, `searchParams`, `connection` → `'runtime-in-cache'`; `io`, `fetch`, `date`, `random` — дозволені;
> - поза кешем `cookies`, `headers`, `searchParams`, `connection`, `io`, `fetch` призупиняють вузол; без `<Suspense>` серед предків → `'outside-suspense'`;
> - поза кешем `date` / `random` дозволені лише **після** призупинення: раніше в `reads` того самого вузла або в будь-якого предка. Інакше → `'unstable-value'`, навіть під `<Suspense>`;
> - на вузол — максимум одна помилка (перша за порядком `reads`); результат — у порядку обходу в глибину.
>
> ```ts starter
> type Read = 'cookies' | 'headers' | 'searchParams' | 'connection' | 'io' | 'fetch' | 'date' | 'random'
>
> type Node = {
>   name: string
>   suspense?: boolean // це <Suspense>
>   cache?: boolean // компонент з 'use cache'
>   reads?: Read[] // у порядку виконання; 'date' = new Date()/Date.now(), 'random' = Math.random()/randomUUID()
>   children?: Node[]
> }
>
> type PrerenderError = { node: string; error: 'outside-suspense' | 'runtime-in-cache' | 'unstable-value' }
>
> function findPrerenderErrors(root: Node): PrerenderError[] {
>   // ❌ «Suspense вирішує все»: шукаємо лише читання без Suspense
>   const errors: PrerenderError[] = []
>   function walk(node: Node, inSuspense: boolean) {
>     if (!inSuspense && (node.reads ?? []).length > 0) errors.push({ node: node.name, error: 'outside-suspense' })
>     for (const child of node.children ?? []) walk(child, inSuspense || node.suspense === true)
>   }
>   walk(root, false)
>   return errors
> }
> ```
>
> ```ts tests
> test('коректне дерево магазину — помилок немає', () => {
>   const page: Node = {
>     name: 'ShopPage',
>     children: [
>       { name: 'Header' },
>       { name: 'S1', suspense: true, children: [{ name: 'Greeting', reads: ['cookies'] }] },
>       { name: 'ProductList', cache: true, reads: ['fetch'] },
>       { name: 'S2', suspense: true, children: [{ name: 'Clock', reads: ['io', 'date'] }] },
>     ],
>   }
>   expect(findPrerenderErrors(page)).toEqual([])
> })
>
> test('cookies() на верхньому рівні сторінки без Suspense — outside-suspense', () => {
>   const page: Node = { name: 'Page', reads: ['cookies'], children: [{ name: 'Header' }] }
>   expect(findPrerenderErrors(page)).toEqual([{ node: 'Page', error: 'outside-suspense' }])
> })
>
> test('new Date() у Suspense без io() — unstable-value: Suspense сам не робить рендер динамічним', () => {
>   const page: Node = { name: 'Page', children: [{ name: 'S', suspense: true, children: [{ name: 'Time', reads: ['date'] }] }] }
>   expect(findPrerenderErrors(page)).toEqual([{ node: 'Time', error: 'unstable-value' }])
> })
>
> test('порядок має значення: date до io() — помилка, після — ні', () => {
>   const page: Node = {
>     name: 'Page',
>     children: [
>       {
>         name: 'S',
>         suspense: true,
>         children: [
>           { name: 'Late', reads: ['date', 'io'] },
>           { name: 'Ok', reads: ['io', 'random'] },
>         ],
>       },
>     ],
>   }
>   expect(findPrerenderErrors(page)).toEqual([{ node: 'Late', error: 'unstable-value' }])
> })
>
> test('у use cache: cookies() і connection() — помилка, fetch і new Date() — ні (навіть у дітях)', () => {
>   const page: Node = {
>     name: 'Page',
>     children: [
>       { name: 'Theme', cache: true, reads: ['cookies'] },
>       { name: 'Stats', cache: true, reads: ['fetch', 'date'], children: [{ name: 'Live', reads: ['connection'] }] },
>     ],
>   }
>   expect(findPrerenderErrors(page)).toEqual([
>     { node: 'Theme', error: 'runtime-in-cache' },
>     { node: 'Live', error: 'runtime-in-cache' },
>   ])
> })
>
> test('дитина компонента, що вже чекає на запит, може читати new Date()', () => {
>   const page: Node = {
>     name: 'Page',
>     children: [
>       { name: 'S', suspense: true, children: [{ name: 'Cart', reads: ['cookies'], children: [{ name: 'Updated', reads: ['date'] }] }] },
>     ],
>   }
>   expect(findPrerenderErrors(page)).toEqual([])
> })
> ```
>
> > [!hint]- Підказка 1
> > Проходь `reads` вузла по черзі й тримай прапорець «уже призупинилися». Він стартує зі значення, отриманого від предка, і передається дітям.
>
> > [!hint]- Підказка 2
> > Три різні прапорці від предків: «у кеші», «під Suspense», «після призупинення». Не змішуй їх: Suspense не дозволяє `date`, а кеш дозволяє.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Read = 'cookies' | 'headers' | 'searchParams' | 'connection' | 'io' | 'fetch' | 'date' | 'random'
> >
> > type Node = {
> >   name: string
> >   suspense?: boolean
> >   cache?: boolean
> >   reads?: Read[]
> >   children?: Node[]
> > }
> >
> > type PrerenderError = { node: string; error: 'outside-suspense' | 'runtime-in-cache' | 'unstable-value' }
> >
> > const RUNTIME: Read[] = ['cookies', 'headers', 'searchParams', 'connection']
> > const SUSPENDS: Read[] = [...RUNTIME, 'io', 'fetch']
> >
> > function findPrerenderErrors(root: Node): PrerenderError[] {
> >   const errors: PrerenderError[] = []
> >
> >   function walk(node: Node, inCache: boolean, inSuspense: boolean, afterRequest: boolean) {
> >     const cached = inCache || node.cache === true
> >     let requestTime = afterRequest
> >     for (const read of node.reads ?? []) {
> >       let error: PrerenderError['error'] | null = null
> >       if (cached) {
> >         if (RUNTIME.includes(read)) error = 'runtime-in-cache'
> >       } else if (SUSPENDS.includes(read)) {
> >         if (!inSuspense) error = 'outside-suspense'
> >         requestTime = true
> >       } else if (!requestTime) {
> >         error = 'unstable-value'
> >       }
> >       if (error) {
> >         errors.push({ node: node.name, error })
> >         break
> >       }
> >     }
> >     const suspense = inSuspense || node.suspense === true
> >     for (const child of node.children ?? []) walk(child, cached, suspense, requestTime)
> >   }
> >
> >   walk(root, false, false, false)
> >   return errors
> > }
> > ```
> >
> > Три прапорці відповідають трьом різним питанням, які ставить збірка: «чи можна тут читати запит?» (кеш), «чи є чим замінити дірку?» (Suspense), «чи prerender уже зупинився?» (призупинення). Правдоподібна помилка — вважати `date` дозволеним, якщо вузол **десь** у `reads` має `io`: тест «порядок має значення» це ловить, як і збірка 16.3.8.

> [!task] Опусти cookies() вниз дерева
> level: middle · difficulty: medium · id: nextjs-core-10-task-03 · tags: static-shell, refactoring, cookies
>
> Сторінка робить `const c = await cookies()` нагорі й роздає значення через props — тому динамічна вся. Ти переписуєш її: читання переїде в компоненти, що **самі показують** значення з кук (`uses` не порожній), і кожен такий компонент отримає власний `<Suspense>`.
>
> Напиши `pushDownCookies(page)`, що повертає:
>
> - `boundaries` — імена **найвищих** компонентів, що використовують куки (нащадок такого компонента окремої межі не отримує: він уже в дірці);
> - `shell` — імена всіх компонентів, що лишаються поза межами, у порядку обходу в глибину.
>
> Якщо значення використовує сама сторінка, межа одна — вона сама.
>
> ```ts starter
> type Comp = {
>   name: string
>   uses?: string[] // які значення з cookies компонент показує сам
>   children?: Comp[]
> }
>
> function pushDownCookies(page: Comp): { boundaries: string[]; shell: string[] } {
>   // ❌ як зараз: сторінка читає cookies() нагорі — динамічне все
>   return { boundaries: [page.name], shell: [] }
> }
> ```
>
> ```ts tests
> const page: Comp = {
>   name: 'DashboardPage',
>   children: [
>     { name: 'Header', children: [{ name: 'Logo' }, { name: 'UserMenu', uses: ['session'], children: [{ name: 'Avatar', uses: ['session'] }] }] },
>     { name: 'Stats' },
>     { name: 'Main', children: [{ name: 'ThemeBanner', uses: ['theme'] }, { name: 'News' }] },
>   ],
> }
>
> test('межі Suspense — найвищі компоненти, що самі показують значення з cookies', () => {
>   expect(pushDownCookies(page).boundaries).toEqual(['UserMenu', 'ThemeBanner'])
> })
>
> test('вкладений споживач не отримує окрему межу: Avatar уже в дірці UserMenu', () => {
>   expect(pushDownCookies(page).boundaries).not.toContain('Avatar')
> })
>
> test('решта дерева — у static shell, у порядку обходу', () => {
>   expect(pushDownCookies(page).shell).toEqual(['DashboardPage', 'Header', 'Logo', 'Stats', 'Main', 'News'])
> })
>
> test('якщо cookies ніхто не використовує — читання можна прибрати, усе статичне', () => {
>   const plain: Comp = { name: 'Page', children: [{ name: 'A' }, { name: 'B' }] }
>   expect(pushDownCookies(plain)).toEqual({ boundaries: [], shell: ['Page', 'A', 'B'] })
> })
>
> test('сторінка сама показує значення — динамічна вся, як і була', () => {
>   const self: Comp = { name: 'Page', uses: ['theme'], children: [{ name: 'A' }] }
>   expect(pushDownCookies(self)).toEqual({ boundaries: ['Page'], shell: [] })
> })
> ```
>
> > [!hint]- Підказка 1
> > Обхід у глибину з раннім виходом: знайшов споживача — запиши межу й **не йди** в його дітей.
>
> > [!hint]- Підказка 2
> > Вузол, у дітей якого не зайшли, не потрапляє ні в `shell`, ні в `boundaries`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Comp = {
> >   name: string
> >   uses?: string[]
> >   children?: Comp[]
> > }
> >
> > function pushDownCookies(page: Comp): { boundaries: string[]; shell: string[] } {
> >   const boundaries: string[] = []
> >   const shell: string[] = []
> >
> >   function walk(node: Comp) {
> >     if ((node.uses ?? []).length > 0) {
> >       boundaries.push(node.name) // усе піддерево — одна дірка
> >       return
> >     }
> >     shell.push(node.name)
> >     for (const child of node.children ?? []) walk(child)
> >   }
> >
> >   walk(page)
> >   return { boundaries, shell }
> > }
> > ```
> >
> > Це той самий рефакторинг, що з `UserMenu` у layout: читання запиту переїжджає в листок, а все між сторінкою і листком потрапляє в shell. Межа на кожного споживача, а не одна навколо їхнього спільного предка, дає більший shell: `Logo`, `Stats` і `News` не чекають на куку. У реальному коді кожна межа — `<Suspense>` з fallback тієї ж висоти.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Caching](https://nextjs.org/docs/app/getting-started/caching) — Cache Components: runtime APIs, випадкові значення, prerendering і максимальний static shell.
- 🟡 [Next.js — Rendering Philosophy](https://nextjs.org/docs/app/guides/rendering-philosophy) — статичне й динамічне як спектр і що це означає для хостингу.
- 🟡 [Next.js — io](https://nextjs.org/docs/app/api-reference/functions/io) — маркер I/O для синхронних значень і відмінність від `connection()`.
- 🟡 [Next.js — connection](https://nextjs.org/docs/app/api-reference/functions/connection) — «чекати на запит користувача» і синхронні драйвери БД.
- 🟡 [Next.js — cookies](https://nextjs.org/docs/app/api-reference/functions/cookies) і [headers](https://nextjs.org/docs/app/api-reference/functions/headers) — Request-time APIs та їхні обмеження.
- 🟡 [Next.js — Draft Mode](https://nextjs.org/docs/app/api-reference/functions/draft-mode) — `isEnabled` у кеші й обхід prerender.
- 🔴 [Next.js — Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) — `dynamic`, `revalidate`, `fetchCache`, `instant = false` і поступова міграція.
- 🔴 [Next.js — Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) — що лишилось і що прибрано в 16.
- 🛠️ [Next.js — Blocking prerender (dynamic)](https://nextjs.org/docs/messages/blocking-prerender-dynamic) — сторінка помилки з усіма варіантами виправлення.
- 🛠️ [Next.js — Caching and Revalidating (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components) — стара модель рівня маршруту для порівняння.

> [!important] Підсумок
> - Статичне й динамічне в Next.js 16 — спектр на рівні компонента: одна сторінка має static shell, кешовані блоки й request-time дірки.
> - Request-time рендер дають `cookies()`, `headers()`, `searchParams`, `params` без `generateStaticParams`, `connection()`, `io()` і некешоване I/O. Призупинення відбувається на `await`, тож Promise можна передати вниз.
> - З Cache Components кожен такий компонент треба або закешувати (`'use cache'`), або поставити під `<Suspense>`; інакше — помилка збірки. `<Suspense>` сам нічого не робить динамічним.
> - `new Date()`, `Math.random()`, `crypto.randomUUID()` вимагають вибору: `'use cache'` (один раз для всіх) або `await io()` + `<Suspense>` (своє для кожного запиту). Документація радить `io()` замість `connection()`.
> - `dynamic`, `revalidate`, `fetchCache`, `dynamicParams` з Cache Components — помилка; терміни життя задає `cacheLife`. Перевіряй результат таблицею `next build` (`○`, `◐`, `ƒ`) і `curl -I` (`x-nextjs-cache`, `Cache-Control`, `x-nextjs-postponed`).

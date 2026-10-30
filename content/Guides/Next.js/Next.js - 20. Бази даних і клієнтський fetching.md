---
title: Бази даних і клієнтський fetching
id: nextjs-core-20
slug: 20-databases-client-fetching
order: 20
level: middle
skill: data
icon: px:database
tags: [nextjs, database, orm, drizzle, prisma, connection-pool, serverless, transactions, swr, tanstack-query, use]
prerequisites:
  - "[[Next.js - 14. Дані на сервері]]"
  - "[[Next.js - 19. Route Handlers і Backend-for-Frontend]]"
estimatedMinutes: 60
nextVersion: 16.3.8
---

# Бази даних і клієнтський fetching

> [!success] 🎯 Після цього розділу ти зможеш
> - підключити Drizzle або Prisma до Server Components і Server Actions так, щоб клієнт БД жив в одному екземплярі на процес, навіть у `next dev`;
> - пояснити, чому в serverless зʼєднань з базою стає забагато, і обрати ліки: малий пул, пулер, HTTP-драйвер, Fluid Compute;
> - написати транзакцію, яка або записує все, або нічого, і тримати її в одній функції шару даних;
> - зібрати мінімальний модуль доступу до даних з `server-only` і DTO та знати, як виглядають міграції;
> - вирішити, коли дані тягнути з браузера, і підключити SWR чи TanStack Query до App Router з початковими даними з сервера;
> - розпізнати антипатерн `useEffect` + `fetch` для початкових даних і замінити його.

## 🤔 Передбач

> [!quiz] Що покаже next build і що побачить користувач?
> level: middle · type: output · id: nextjs-core-20-quiz-01
>
> Проєкт з `cacheComponents: true` і локальною SQLite (Drizzle + `@libsql/client`, `file:local.db`). Сторінка читає базу прямо в Server Component, без `<Suspense>` і без `io()`:
>
> ```tsx
> // app/products/page.tsx
> import { listProducts } from '@/lib/data/products'
>
> export default async function Page() {
>   const items = await listProducts() // SELECT з products
>   return <ul>{items.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
> }
> ```
>
> Збірка пройшла. Потім у таблицю `products` додали ще один рядок і відкрили `/products` у запущеному `next start`. Що відбулося?
>
> - [x] `/products` у таблиці збірки — `○`, у HTML лежать рядки на момент `next build`; новий рядок зʼявиться лише після наступної збірки
> - [ ] `next build` упав із `uncached or runtime data during prerendering`, бо запит до БД не кешований
> - [ ] `/products` — `ƒ`: Next.js побачив запит до бази й рендерить сторінку на кожен запит, тож новий рядок видно одразу
> - [ ] `/products` — `◐`: shell зібрано заздалегідь, а список підтягується на запит
>
> **Пояснення:** не переймайся, якщо помилився — це підступний випадок, розберемо в розділі про `io()`. `@libsql/client` з `file:` (як і Prisma з better-sqlite3) має асинхронний API, але всередині працює синхронно, і Next.js не вважає такий запит I/O. Тому збірка не падає, маршрут статичний, а дані застигають на моменті збірки. `ƒ` і `◐` дало б читання `cookies()`/`headers()` або мережевого драйвера в `<Suspense>`; помилку збірки — мережевий запит без `<Suspense>`.

## 🧒 Простими словами

Уяви склад з десятьма вантажними воротами. Кожна вантажівка, що приїхала по товар, займає одні ворота, поки стоїть під завантаженням. Поки вантажівок кілька, усе гаразд. Але якщо кожен водій пригнав власну колону з десяти машин і лишив їх біля воріт «про запас», навіть порожніх, — ворота закінчаться за хвилину, і нова вантажівка стане в чергу або поїде ні з чим. Склад — це база даних, ворота — зʼєднання, колона одного водія — пул зʼєднань одного серверного інстансу. Пулер — диспетчер біля в'їзду, який пускає машини по черзі. А клієнтський fetching — це покупець, який сам телефонує на склад і питає «ну що, приїхало?»: зручно для статусу доставки, але дико, якщо так дізнаватися, що взагалі продається.

## 🔬 Як це працює насправді

### 🧭 Хто ходить у базу

У App Router до бази даних звертається лише серверний код: Server Components (читання під час рендеру), Server Actions (запис після дії користувача) і Route Handlers (HTTP-API для браузера чи сторонніх клієнтів, [[Next.js - 19. Route Handlers і Backend-for-Frontend|тема 19]]). Код з драйвером і рядком підключення не потрапляє в клієнтський бандл, бо його імпортує тільки серверний граф модулів ([[Next.js - 07. Server і Client Components|тема 07]]). Тому окремий API-шар «щоб React-компонент отримав дані» більше не потрібен: компонент сам читає базу.

Ціна цієї зручності — три інженерні питання, яких у SPA не було:

1. **Скільки екземплярів клієнта БД живе в процесі** і що з ними робить hot reload.
2. **Скільки зʼєднань відкриває застосунок**, коли його запущено в десятках serverless-інстансів.
3. **Як не віддати зайве**: що з рядка БД доходить до браузера.

Розбираємо по черзі на двох популярних ORM, а наприкінці повертаємось до браузера: коли дані таки треба тягнути звідти.

> [!note] Чому сторінкам з даними потрібен `loading.tsx` / `<Suspense>`
> Приклади зібрані з `cacheComponents: true` і читають справжню локальну SQLite. Дані з бази невідомі на етапі збірки, тому компоненти, що їх читають, стоять у `<Suspense>`, а перед запитом до SQLite стоїть `await io()` — чому саме, пояснено в розділі [[#🧱 База під Cache Components: io() і Suspense]]. Детально про межі й shell — у темах 11–12, 14–16 основного посібника.

### 🧰 Drizzle: схема як TypeScript

Drizzle — тонкий шар над SQL: схема описана TypeScript-кодом, запити читаються майже як SQL і повністю типізовані. Схема двох таблиць магазину:

```ts
// lib/db/schema.ts — схема Drizzle: таблиці як TypeScript-код
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  price: integer('price').notNull(), // у копійках
  stock: integer('stock').notNull().default(0),
  supplierNote: text('supplier_note'), // внутрішнє поле, не для клієнта
})

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
})
```

Клієнт створюємо один раз у модулі, позначеному `server-only`:

```ts
// lib/db/index.ts — один клієнт на процес
import 'server-only'
import { createClient, type Client } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

// HMR у next dev перевиконує модулі, а globalThis переживає перезавантаження
const globalForDb = globalThis as unknown as { libsql?: Client }

const client =
  globalForDb.libsql ??
  createClient({ url: process.env.DATABASE_URL ?? 'file:local.db' })

if (process.env.NODE_ENV !== 'production') globalForDb.libsql = client

export const db = drizzle(client, { schema })
```

Тут SQLite через `@libsql/client` (локальний файл, без акаунтів), але форма та сама для Postgres чи MySQL: інший драйвер, інший імпорт `drizzle-orm/…`. Запит у Server Component — звичайний `await`:

```ts
const rows = await db
  .select({ id: products.id, title: products.title, price: products.price })
  .from(products)
```

Зверни увагу на **явний список колонок** у `select`. `db.select().from(products)` поверне й `supplierNote`, а далі вистачить одного необережного prop, щоб нотатка постачальника опинилась у RSC payload. Мінімальний `select` — перша лінія захисту, DTO — друга (розділ [[#🗂️ Мінімальний модуль доступу до даних]]).

### 🔺 Prisma: схема в окремій мові

Prisma описує модель у файлі `schema.prisma` і генерує з неї типізований клієнт. У Prisma ORM 7 змінилося три речі, які ламають старі туторіали: клієнт генерується **у твою папку** (`output` обовʼязковий, генератор `prisma-client`), URL бази для CLI живе в `prisma.config.ts`, а підключення в застосунку йде через **driver adapter**.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model Note {
  id    Int    @id @default(autoincrement())
  title String
}
```

```ts
// prisma.config.ts — конфіг CLI (міграції, generate)
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('PRISMA_DATABASE_URL') },
})
```

```ts
// lib/prisma.ts — синглтон Prisma Client (Prisma ORM 7)
import 'server-only'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrisma() {
  console.log('[prisma] new PrismaClient')
  const adapter = new PrismaBetterSqlite3({ url: process.env.PRISMA_DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrisma()

// у dev модуль перевиконується при кожному HMR — тримаємо клієнт у globalThis
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

`new PrismaClient()` без адаптера в Prisma 7 одразу кидає `PrismaClient was instantiated without any options. A driver adapter is required to connect to your database.` Для Postgres адаптер — `@prisma/adapter-pg`, і саме в його опціях задається розмір пулу: параметрів пулу в URL у v7 більше немає.

> [!warning] Яку Prisma ставити
> Пакет `prisma` у npm уже має під тегом `latest` реліз-кандидат 8.x (Prisma Next) з іншою моделлю проєкту, тоді як `@prisma/client` на тому самому тезі — 7.x. Приклади курсу — на Prisma ORM 7 (7.10.1). Закріплюй мажорну версію обох пакетів у `package.json` (`prisma@7`, `@prisma/client@7`), інакше `npx prisma init` створить проєкт, не схожий на документацію ORM 7.

Як обрати між ними — питання смаку команди, але відмінності варто знати:

| | Drizzle | Prisma ORM 7 |
|---|---|---|
| Схема | TypeScript-файл | `schema.prisma`, клієнт генерується |
| Запити | SQL-подібний builder, шаблон `sql` для решти | обʼєктний API (`findMany`, `include`) |
| Крок генерації | немає | `prisma generate` після кожної зміни схеми |
| Міграції | `drizzle-kit generate` / `migrate` / `push` | `prisma migrate dev` / `deploy` |
| Транзакції | `db.transaction(async (tx) => …)` | `$transaction([...])` і `$transaction(async (tx) => …)` |

### ♻️ Один клієнт на процес: HMR і globalThis

У продакшні модуль `lib/db/index.ts` виконується один раз на процес, тож константа рівня модуля і є синглтоном. У `next dev` інакше: щоразу, коли ти зберігаєш файл, Turbopack перевиконує змінений модуль, і рядок `new PrismaClient(...)` спрацьовує знову. Старий клієнт ніхто не закриває — його пул зʼєднань висить, поки процес живий.

Ось що дають пʼять збережень `lib/prisma.ts` у `next dev` 16.3.8 (з `console.log` у `createPrisma()` і відкриттям сторінки після кожної правки):

| Варіант | Нових `PrismaClient` за 5 правок |
|---|---|
| `export const prisma = createPrisma()` (без `globalThis`) | 12 |
| `globalForPrisma.prisma ?? createPrisma()` + запис у `globalThis` | 0 |

Дванадцять, а не пʼять: модуль виконується більше ніж в одному модульному контексті dev-сервера, тож кожна правка дає приблизно два нові клієнти. На SQLite це лише памʼять, на Postgres — по пулу зʼєднань на кожен клієнт, і за пів години роботи `next dev` упирається в `too many connections` локальної бази. `globalThis` — обʼєкт процесу, який HMR не перевиконує, тож другий і наступні запуски модуля беруть готовий клієнт.

Три деталі шаблону:

- **Запис у `globalThis` лише поза продакшном.** У проді модуль і так виконується один раз, а глобальна змінна лише заважала б, наприклад, тестам з окремими клієнтами.
- **Правка сторінки клієнта не створює.** Перевиконується лише змінений модуль, тож на сторінці `/notes` після правки `page.tsx` нових клієнтів не було. Біда виникає, коли ти правиш сам модуль БД або схему, яку він імпортує.
- **`next build` теж створює кілька клієнтів.** Під час збірки в лозі два рядки `[prisma] new PrismaClient`: пререндер іде в кількох воркерах, у кожного свій процес. Це нормально, синглтон — «один на процес», а не «один на застосунок».

> [!quiz] Перевір себе: скільки нових PrismaClient у next dev
> level: middle · type: output · id: nextjs-core-20-quiz-02
>
> ```ts
> // lib/prisma.ts — без globalThis
> import 'server-only'
> import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
> import { PrismaClient } from '@/generated/prisma/client'
>
> function createPrisma() {
>   console.log('[prisma] new PrismaClient')
>   return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: process.env.PRISMA_DATABASE_URL! }) })
> }
>
> export const prisma = createPrisma()
> ```
>
> `next dev` 16.3.8. Розробник 5 разів зберігає `lib/prisma.ts` і щоразу оновлює сторінку, потім один раз зберігає `app/notes/page.tsx`. Що з рядками `[prisma] new PrismaClient` у терміналі?
>
> - [ ] Один рядок: модулі кешуються назавжди, тож клієнт створюється лише раз
> - [ ] Один рядок на кожне оновлення сторінки, тобто 6
> - [x] Щонайменше один на кожну правку `lib/prisma.ts` (у 16.3.8 — 12 за пʼять правок), а правка `page.tsx` нових клієнтів не додає
> - [ ] Нові клієнти зʼявляються і після правки `page.tsx`, бо сторінка імпортує `prisma`
>
> **Пояснення:** HMR перевиконує лише змінений модуль, і рядок `createPrisma()` спрацьовує знову; старий клієнт ніхто не закриває. Правка `page.tsx` перевиконує тільки `page.tsx`, а `prisma` береться з уже виконаного модуля. Оновлення сторінки самі по собі модуль не перевиконують. Лікування — `globalThis.prisma ??= …` поза продакшном: з ним 5 правок дали 0 нових клієнтів.

### 🧱 База під Cache Components: io() і Suspense

З [[Next.js - 14. Дані на сервері|теми 14]] відомо: некешований `await` поза `<Suspense>` зупиняє `next build` з `uncached or runtime data during prerendering`. Для Postgres чи MySQL через мережу так і є. А з локальною SQLite відбувається дещо підступніше. Ось сторінка без `<Suspense>` і без `io()`:

```tsx
// app/products/page.tsx — ❌ локальна SQLite без io()
import { listProducts } from '@/lib/data/products'

export default async function Page() {
  const items = await listProducts()
  return <ul>{items.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}
```

Збірка проходить без помилки, і маршрут стає статичним:

```text
Route (app)
├ ○ /notes
└ ○ /products
```

У `.next/server/app/products.html` лежать товари **на момент збірки**. Нове замовлення, новий товар, зміна залишку — сторінка цього не побачить до наступного `next build`. Так поводяться і `@libsql/client` з `file:`, і Prisma з `@prisma/adapter-better-sqlite3`: API в них асинхронний, але всередині драйвер працює синхронно, і проміс резолвиться ще до того, як Next.js встигає вважати запит «I/O». Документація `io()` прямо називає цей випадок: синхронний драйвер на кшталт `node:sqlite` читає дані так само «миттєво», як `new Date()`.

Лікування — сказати Next.js явно: «далі I/O». Функція `io()` з `next/cache` (16.3) під час пререндеру призупиняє рендер, а під час запиту резолвиться одразу:

```tsx
// app/products/page.tsx — Server Component читає БД напряму
import { Suspense } from 'react'
import { io } from 'next/cache'
import { listProducts } from '@/lib/data/products'
import { OrderForm } from './order-form'

export default function Page() {
  return (
    <main>
      <h1>Товари</h1>
      <Suspense fallback={<p>Завантажуємо…</p>}>
        <ProductList />
      </Suspense>
    </main>
  )
}

async function ProductList() {
  await io() // драйвер синхронний усередині: явно кажемо «далі I/O»
  const items = await listProducts()
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id}>
          {p.title} — {p.price / 100} ₴ {p.inStock ? <OrderForm productId={p.id} /> : '(немає)'}
        </li>
      ))}
    </ul>
  )
}
```

Тепер `/products` у таблиці збірки — `◐ (Partial Prerender)`: заголовок і fallback у shell, список — на запит. Прибери `<Suspense>`, лишивши `await io()`, і збірка впаде з тією самою помилкою, що й для мережевого запиту: `Route "/products": Next.js encountered uncached or runtime data during prerendering.` Тобто `io()` перетворює «тихо застиглі дані» на нормальну, видиму поведінку.

Коли `io()` не потрібен: якщо компонент уже читає `cookies()` чи `headers()` (вони самі є точкою призупинення), якщо драйвер справді мережевий (Postgres, Neon, PlanetScale), або якщо результат свідомо кешується через `'use cache'` ([[Next.js - 15. Cache Components і use cache|тема 15]]). Але ставити `await io()` у функцію шару даних, яка ходить у SQLite, — дешева страховка: у реальному запиті він резолвиться миттєво.

> [!quiz] Який символ покаже next build для кожного варіанта
> level: middle · type: output · id: nextjs-core-20-quiz-03
>
> `cacheComponents: true`, Drizzle + локальна SQLite (`libsql`, `file:`). Три варіанти `app/products/page.tsx`:
>
> ```tsx
> // A — без Suspense, без io()
> export default async function Page() {
>   const items = await listProducts()
>   return <List items={items} />
> }
>
> // B — Suspense + io() у дочірньому компоненті
> export default function Page() {
>   return <Suspense fallback={<p>…</p>}><ProductList /></Suspense>
> }
> async function ProductList() {
>   await io()
>   return <List items={await listProducts()} />
> }
>
> // C — io() у самій сторінці, без Suspense
> export default async function Page() {
>   await io()
>   return <List items={await listProducts()} />
> }
> ```
>
> - [ ] A — `ƒ`, B — `◐`, C — `◐`: `io()` сам створює межу
> - [ ] A — помилка збірки, B — `◐`, C — помилка збірки
> - [ ] A — `○`, B — `○`, C — `○`: локальна SQLite не є I/O ні в якому разі
> - [x] A — `○` з даними збірки, B — `◐`, C — помилка `uncached or runtime data during prerendering`
>
> **Пояснення:** у A синхронний усередині драйвер не виглядає як I/O, тож маршрут тихо стає статичним. У B `io()` явно позначає «далі I/O», а `<Suspense>` дає місце для fallback у shell, звідси `◐`. У C `io()` призупиняє рендер, але межі немає, і збірка падає з тією самою помилкою, що й для некешованого мережевого запиту. `io()` межу не створює, її створює `<Suspense>`.

### 🌊 Пули зʼєднань у serverless

Відкрити TCP-зʼєднання з Postgres дорого: TCP, TLS, автентифікація, виділення процесу на сервері БД — десятки мілісекунд, а за документацією Vercel і 50–100 мс та більше. Тому драйвери тримають **пул**: кілька відкритих зʼєднань, які запити позичають і повертають. `pg.Pool` за замовчуванням тримає до `max: 10` зʼєднань і закриває неактивні через `idleTimeoutMillis: 10000` (10 с). Сам Postgres за замовчуванням приймає `max_connections` = 100 зʼєднань, а менеджені бази на малих планах — часто менше.

На довгоживучому сервері (`next start` у Docker) усе просто: один процес, один пул, 10 зʼєднань. У класичному serverless кожна функція — окремий інстанс, і **кожен інстанс має власний пул**. Порахуймо пік: 30 одночасних запитів → 30 інстансів × до 10 зʼєднань = до 300 зʼєднань у найгіршому разі. Пул відкриває зʼєднання ліниво, тож типово за одну хвилю трафіку їх ~30, по одному на інстанс, — але кожна наступна хвиля піднімає нові інстанси, а заморожені з попередніх хвиль тримають свої. Гірше: інстанс після відповіді «заморожується», а його зʼєднання лишаються відкритими з боку бази, бо таймер `idleTimeoutMillis` у замороженому процесі не тікає. База бачить сотні «живих» зʼєднань від процесів, які вже ніколи не прокинуться.

> [!diagram] Звідки беруться сотні зʼєднань
> ```yaml
> layout: compare
> columns: { classic: "Класичний serverless", fluid: "Fluid Compute / довгоживучий сервер" }
> nodes:
>   - { id: c1, col: classic, label: "30 одночасних запитів", text: "30 інстансів", note: "один запит — один інстанс", tone: orange, icon: "px:bolt" }
>   - { id: c2, col: classic, label: "пул у кожному", text: "30 × max 10", note: "~30 за хвилю, до 300 у найгіршому разі", tone: red, icon: "px:warning" }
>   - { id: c3, col: classic, label: "після відповіді", text: "інстанс заморожено", note: "зʼєднання висять відкритими", tone: red }
>   - { id: c4, col: classic, label: "Postgres", text: "max_connections = 100", note: "кілька хвиль — і too many connections", tone: red, icon: "px:database" }
>   - { id: f1, col: fluid, label: "30 одночасних запитів", text: "кілька інстансів", note: "один інстанс обслуговує багато запитів", tone: blue, icon: "px:server" }
>   - { id: f2, col: fluid, label: "пул на інстанс", text: "3 × max 10", note: "до 30 зʼєднань", tone: green }
>   - { id: f3, col: fluid, label: "перед заморозкою", text: "attachDatabasePool", note: "неактивні зʼєднання закрито", tone: green, icon: "px:check" }
>   - { id: f4, col: fluid, label: "Postgres", text: "30 зі 100", note: "запас для міграцій і адмінки", tone: green, icon: "px:database" }
> steps:
>   - { show: [c1, f1], note: "Той самий пік трафіку. Ліворуч платформа піднімає по інстансу на запит, праворуч один інстанс паралельно обслуговує багато I/O-запитів." }
>   - { show: [c2, f2], note: "Пул створюється в області модуля, тобто один на інстанс. Ліворуч інстансів 30 — і пулів 30." }
>   - { show: [c3, f3], note: "Після відповіді інстанс засинає. Ліворуч його зʼєднання лишаються відкритими. Праворуч attachDatabasePool закриває неактивні до заморозки." }
>   - { show: [c4, f4], note: "Ліворуч кожна нова хвиля додає зʼєднання до висячих, і за кілька хвиль база впирається в ліміт. Праворуч зʼєднань у рази менше за той самий трафік." }
> ```
> Кількість зʼєднань = інстанси × розмір пулу. Зменшувати можна обидва множники.

Ліки, від найпростіших:

1. **Пул в області модуля, не в обробнику.** `new Pool()` усередині Server Action відкриває новий пул на кожен виклик. Модульна константа (і `globalThis` у dev) дає один пул на інстанс. Prisma пише про це прямо: створюй клієнт поза обробником, щоб теплий інстанс його перевикористав.
2. **Малий `max`.** У serverless інстанс рідко виконує багато запитів до БД одночасно, тож `max: 1–5` замість 10 скорочує множник у рази. Порахуй бюджет: (ліміт бази − резерв для міграцій і адмінки) / очікувана кількість інстансів.
3. **Пулер між застосунком і базою.** PgBouncer (або Supavisor, пулер провайдера) приймає тисячі клієнтських зʼєднань і пропускає до бази обмежену кількість. У Neon це окремий рядок підключення з суфіксом `-pooler`: PgBouncer у **transaction mode** повертає зʼєднання в пул після кожної транзакції. Ціна transaction mode — не працюють сесійні речі: `SET` для сесії, `LISTEN`/`NOTIFY`, SQL-рівневий `PREPARE`, сесійні advisory locks. Міграції й `pg_dump` ганяй через **прямий** рядок підключення.
4. **HTTP-драйвер.** Serverless-драйвери (Neon `@neondatabase/serverless`, PlanetScale, Turso) ходять у базу по HTTP чи WebSocket: немає довгого TCP-зʼєднання — немає чого тримати й «гнилити». У Drizzle це `drizzle-orm/neon-http`. Обмеження: HTTP-режим швидкий для одиночних неінтерактивних запитів, а для інтерактивних транзакцій потрібен WebSocket-драйвер (`drizzle-orm/neon-serverless`).
5. **Fluid Compute на Vercel.** З 23.04.2025 увімкнено за замовчуванням для нових проєктів: один інстанс обслуговує кілька запитів одночасно, тож інстансів — і пулів — менше. Функція `attachDatabasePool(pool)` з `@vercel/functions`, викликана одразу після створення пулу, закриває неактивні зʼєднання до того, як інстанс засне. Підтримує `pg`, MySQL2, MariaDB, MongoDB, ioredis та інші.

```ts
// lib/db/pg.ts — пул для Postgres на Vercel Fluid Compute
import 'server-only'
import { Pool } from 'pg'
import { attachDatabasePool } from '@vercel/functions'
import { drizzle } from 'drizzle-orm/node-postgres'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // рядок пулера, якщо він є
  max: 5,
  idleTimeoutMillis: 5_000,
})
attachDatabasePool(pool) // закрити неактивні зʼєднання перед заморозкою інстансу

export const db = drizzle(pool)
```

Поза Vercel виклик `attachDatabasePool` не заважає, тож модуль однаковий для локальної розробки й продакшну. Зверни увагу і на поведінку під `cacheComponents`: сторінка, що читає через цей пул у `<Suspense>`, у таблиці збірки — `◐` без жодного `io()`, а без `<Suspense>` збірка падає з `uncached or runtime data during prerendering`. Мережевий драйвер, на відміну від локальної SQLite, Next.js сам розпізнає як I/O.

**Час життя пулу.** Пул живе стільки, скільки процес: у `next start` — до рестарту контейнера, у serverless — поки платформа тримає інстанс теплим. Закривати його вручну (`pool.end()`, `$disconnect()`) у довгоживучому застосунку не треба. Розумно обмежувати час простою (`idleTimeoutMillis`), щоб пул сам віддавав зʼєднання в тихі години, і час очікування (`connectionTimeoutMillis`, за замовчуванням 0 — чекати вічно), щоб запит у переповненому пулі падав зрозумілою помилкою, а не висів до таймауту функції.

> [!quiz] Перевір себе: скільки зʼєднань відкривають пули
> level: middle · type: output · id: nextjs-core-20-quiz-04
>
> Класичний serverless без пулера: платформа піднімає окремий інстанс на кожен запит. Модуль із пулом однаковий скрізь:
>
> ```ts
> // lib/db/pg.ts
> const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 })
> export const db = drizzle(pool)
> ```
>
> Пік: 40 одночасних запитів, на кожен піднято свій інстанс. У Postgres `max_connections = 100`. Скільки зʼєднань пули разом можуть утримувати і що з цього випливає?
>
> - [ ] 10: пул створено в модулі, тож він спільний для всіх інстансів
> - [x] До 400 (40 × 10): ліміт бази в 100 можна перевищити, і при зростанні трафіку частина запитів падає з `too many connections`
> - [ ] Рівно 40: по одному на запит, тож ліміт бази не перевищується ніколи
> - [ ] 100: драйвер знає `max_connections` бази й сам обмежує пули
>
> **Пояснення:** зʼєднань = інстанси × розмір пулу. Модульна константа дає один пул на інстанс, а не на застосунок. Якщо кожен інстанс виконає лише один `SELECT`, відкриється ~40 зʼєднань, але інстанс, що виконує паралельні запити, розширить свій пул до 10, а заморожені інстанси тримають відкриті зʼєднання, бо їхній `idleTimeoutMillis` не тікає. Драйвер про ліміт сервера нічого не знає: бюджет рахує розробник (задача `poolBudget` нижче).

> [!quiz] Перевір себе: обери правдиві твердження про пули й пулери
> level: middle · type: multi · id: nextjs-core-20-quiz-05
> - [x] Пул, створений в області модуля, — один на інстанс, а не на весь застосунок
> - [x] PgBouncer у transaction mode не підтримує сесійні `SET` і `LISTEN`/`NOTIFY`
> - [x] Міграції краще ганяти через прямий рядок підключення, а не через пулер
> - [x] `attachDatabasePool` закриває неактивні зʼєднання до заморозки інстансу
> - [ ] HTTP-драйвер Neon підтримує інтерактивні транзакції так само, як `pg`
> - [ ] `new Pool()` усередині Server Action — нормально, бо пул сам перевикористає зʼєднання між викликами
> - [ ] Fluid Compute робить один пул спільним для всіх інстансів регіону
>
> **Пояснення:** HTTP-режим добре підходить для одиночних неінтерактивних запитів, а інтерактивні транзакції потребують WebSocket-драйвера (`neon-serverless`). Пул у Server Action — новий на кожен виклик, ніхто його не закриває. Fluid Compute лише дозволяє одному інстансу обслуговувати кілька запитів, тож інстансів і пулів стає менше, але пули між інстансами не діляться.

### 🔒 Транзакції

Замовлення товару — це два записи: зменшити залишок і створити рядок замовлення. Якщо після першого кроку процес упав або другий запит кинув помилку, без транзакції залишок уже зменшено, а замовлення немає: товар «зник». Транзакція гарантує атомарність: або обидва записи, або жоден.

```ts
// lib/data/products.ts (фрагмент) — транзакція в одній функції шару даних
export class OutOfStockError extends Error {}

export async function placeOrder(productId: number, quantity: number) {
  // або обидва записи, або жодного
  return db.transaction(async (tx) => {
    const updated = await tx
      .update(products)
      .set({ stock: sql`${products.stock} - ${quantity}` })
      .where(sql`${products.id} = ${productId} and ${products.stock} >= ${quantity}`)
      .returning({ stock: products.stock })

    if (updated.length === 0) throw new OutOfStockError('Недостатньо на складі')

    const [order] = await tx
      .insert(orders)
      .values({ productId, quantity })
      .returning({ id: orders.id })
    return { orderId: order.id, stockLeft: updated[0].stock }
  })
}
```

Чотири рішення в цьому фрагменті:

- **Кожен запит усередині йде через `tx`, а не `db`.** Запит через `db` піде іншим зʼєднанням поза транзакцією і не відкотиться.
- **Перевірка залишку — частина `UPDATE`.** Умова `stock >= quantity` у `WHERE` робить «перевір і зміни» одним атомарним кроком. Варіант «спершу `SELECT stock`, потім `UPDATE`, якщо вистачає» дає гонку: два покупці одночасно читають `stock = 1`, обидва проходять перевірку, і продано два товари з одного. Атомарний умовний `UPDATE` закриває гонку без блокувань.
- **Помилка всередині колбека = відкат.** На SQLite `UPDATE` усередині транзакції, потім `throw` — і після `catch` залишок той самий, що й до транзакції, а той самий `UPDATE` без транзакції лишився записаним. Явний `tx.rollback()` теж працює через виняток: зовні його ловлять як `TransactionRollbackError` з повідомленням `Rollback`.
- **Транзакція коротка.** Поки вона відкрита, вона тримає зʼєднання з пулу (а в Postgres — ще й блокування рядків). Жодних `fetch` до платіжного шлюзу чи листів усередині: спершу зовнішній виклик або після коміту — через `after()` (тема 25 основного посібника).

Server Action лише перевіряє вхід і викликає функцію шару даних:

```ts
// app/products/actions.ts
'use server'

import { refresh } from 'next/cache'
import { OutOfStockError, placeOrder } from '@/lib/data/products'

export type OrderState = { message: string }

export async function orderAction(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const productId = Number(formData.get('productId'))
  const quantity = Number(formData.get('quantity') ?? 1)
  if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
    return { message: 'Некоректні дані' }
  }
  try {
    const { orderId, stockLeft } = await placeOrder(productId, quantity)
    refresh() // перемалювати поточний маршрут з новим залишком
    return { message: `Замовлення №${orderId}, залишок: ${stockLeft}` }
  } catch (e) {
    if (e instanceof OutOfStockError) return { message: e.message }
    throw e
  }
}
```

У продакшн-збірці перша покупка двох клавіатур із трьох повернула `Замовлення №1, залишок: 1`, друга — `Недостатньо на складі`, і рядок замовлення для неї не зʼявився. Повна механіка Server Actions, `useActionState` і валідація — у темах 21–23 основного посібника, `refresh()` — у [[Next.js - 16. Ревалідація|темі 16]].

Дві особливості драйверів, на які легко наступити:

- **`better-sqlite3` синхронний.** Через `drizzle-orm/better-sqlite3` транзакція з `async`-колбеком падає з `Transaction function cannot return a promise`: колбек мусить бути синхронним, а запити закінчуються `.run()` / `.all()`. Асинхронний `@libsql/client` (як у прикладах) і мережеві драйвери приймають `async`.
- **У Prisma два види транзакцій.** Пакетна `prisma.$transaction([запит1, запит2])` виконує готові запити атомарно і повертає масив результатів. Інтерактивна `prisma.$transaction(async (tx) => { … })` дозволяє логіку між запитами; `throw` усередині відкочує все, як і в Drizzle.

> [!quiz] Перевір себе: склади функцію шару даних для замовлення
> level: middle · type: order · id: nextjs-core-20-quiz-06
>
> Збери `placeOrder` так, щоб покупка була атомарною. Спочатку Server Action вже перевірила `FormData`, після коміту викличе `refresh()` і поверне стан у `useActionState`, тому тут лише сама функція. Два рядки зайві.
>
> ```ts order
> export async function placeOrder(productId: number, quantity: number) {
>   return db.transaction(async (tx) => {
>     const updated = await tx.update(products).set({ stock: sql`${products.stock} - ${quantity}` }).where(sql`${products.id} = ${productId} and ${products.stock} >= ${quantity}`).returning({ stock: products.stock })
>     if (updated.length === 0) throw new OutOfStockError('Недостатньо на складі')
>     const [order] = await tx.insert(orders).values({ productId, quantity }).returning({ id: orders.id })
>     return { orderId: order.id, stockLeft: updated[0].stock }
>   })
> }
> const [p] = await tx.select().from(products).where(eq(products.id, productId)) // ✗
> await fetch(PAYMENT_URL, { method: 'POST' }) // ✗
> ```
>
> **Пояснення:** транзакцію відкриває `db.transaction`, усередині спершу умовний `UPDATE` (перевірка залишку є частиною `WHERE`), потім перевірка `updated.length`, і лише після неї `INSERT` замовлення. Окремий `SELECT stock` перед `UPDATE` дає гонку: два покупці прочитають однаковий залишок. `fetch` до платіжного шлюзу всередині транзакції тримає зʼєднання (і блокування рядків) на час мережевого виклику, зовнішні виклики роблять до транзакції або після коміту.

> [!quiz] Перевір себе: заповни пропуски у placeOrder
> level: middle · type: fill · bank: db, return null, tx.commit() · id: nextjs-core-20-quiz-07
>
> ```ts fill
> export async function placeOrder(productId: number, quantity: number) {
>   return db.[[transaction]](async ([[tx]]) => {
>     const updated = await tx
>       .update(products)
>       .set({ stock: sql`${products.stock} - ${quantity}` })
>       .where(sql`${products.id} = ${productId} and ${products.stock} >= ${quantity}`)
>       .returning({ stock: products.stock })
>
>     if (updated.length === 0) [[throw]] new OutOfStockError('Недостатньо на складі')
>
>     const [order] = await [[tx]].insert(orders).values({ productId, quantity }).returning({ id: orders.id })
>     return { orderId: order.id, stockLeft: updated[0].stock }
>   })
> }
> ```
>
> **Пояснення:** колбек отримує `tx`, і кожен запит усередині йде саме через нього: `db.insert` взяв би інше зʼєднання й закомітив замовлення поза транзакцією. Відкат дає виняток, тому при нульовому `updated.length` потрібен `throw`; `return null` завершив би колбек успішно, і транзакція закомітила б зменшений залишок. Коміт у Drizzle неявний: окремого `tx.commit()` немає.

### 🗂️ Мінімальний модуль доступу до даних

Усе, що ходить у базу, живе в одному місці — `lib/data/*` — і має три властивості:

```ts
// lib/data/products.ts — мінімальний модуль доступу до даних
import 'server-only'
import { asc, eq, gt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orders, products } from '@/lib/db/schema'

export type ProductDTO = { id: number; title: string; price: number; inStock: boolean }

export async function listProducts(): Promise<ProductDTO[]> {
  // select лише потрібних колонок: supplierNote не покидає сервер
  const rows = await db
    .select({ id: products.id, title: products.title, price: products.price, stock: products.stock })
    .from(products)
    .orderBy(asc(products.id))
  return rows.map(({ stock, ...rest }) => ({ ...rest, inStock: stock > 0 }))
}
```

1. **`import 'server-only'`.** Якщо хтось імпортує модуль у Client Component, збірка впаде, а не потягне драйвер і рядок підключення в бандл ([[Next.js - 08. Межа use client|тема 08]]).
2. **Повертає DTO, а не рядки таблиці.** Компонент отримує `inStock: boolean`, а не точний залишок і не `supplierNote`. У зібраному HTML `/products` немає жодного слова з нотатки постачальника.
3. **Компоненти не імпортують `db` напряму.** Сторінка викликає `listProducts()`, а не будує запит сама. Тоді правило «що можна показувати» живе в одній функції, а не розмазане по двадцяти компонентах.

Це мінімум. Повноцінний Data Access Layer додає перевірку сесії й прав у кожну функцію, `React.cache` для поточного користувача і правила для мутацій — це тема 29 основного посібника. Почни з цього мінімуму навіть у пет-проєкті: перенести перевірки в готовий шар легко, а виловлювати `db.select()` по компонентах — болісно.

### 🧬 Міграції коротко

Схема бази змінюється разом з кодом, і зміни мають бути відтворюваними: на ноутбуці, у preview-середовищі, у проді.

- **Drizzle.** `drizzle-kit generate` порівнює TypeScript-схему зі знімком і пише SQL-файл у `drizzle/`; `drizzle-kit migrate` застосовує ще не застосовані файли. `drizzle-kit push` змінює базу напряму без файлів — документація радить його для швидкого прототипування. Налаштування — у `drizzle.config.ts` (`dialect`, `schema`, `out`, `dbCredentials`).
- **Prisma.** `prisma migrate dev` створює й застосовує міграцію локально, `prisma migrate deploy` — лише застосовує готові (для CI і проду). У Prisma 7 `migrate dev` більше не запускає `prisma generate` сам: після зміни схеми генеруй клієнт явно.

Як це роблять у командах: SQL-файли міграцій — у git і на code review; застосування — окремий крок деплою (CI-джоба або `migrate deploy` перед перемиканням трафіку), а не код, що виконується при першому запиті сторінки; рядок підключення для міграцій — прямий, не через пулер. Ламкі зміни (перейменування колонки) роблять у два деплої: спершу додати нове поле й писати в обидва, потім прибрати старе. Під час rollout старий і новий код живуть одночасно, і стара версія не повинна падати на новій схемі.

### 📡 Коли дані тягнути з браузера

Дефолт App Router — дані на сервері: Server Component читає базу, і HTML приходить уже з даними. Клієнтський fetching — інструмент для випадків, коли сервер **не може** знати дані заздалегідь або вони мають змінюватися **без навігації**:

| Сценарій | Чому з браузера |
|---|---|
| Живі дані: лічильник непрочитаних, статус замовлення, біржовий курс | оновлення без перезавантаження: поллінг, revalidate при фокусі |
| Нескінченний скрол | наступні сторінки потрібні лише після прокрутки |
| Дані після взаємодії: автодоповнення, фільтр у модалці | запит залежить від того, що ввів користувач |
| Дані, які кешує браузер між екранами | спільний кеш, дедуплікація, оптимістичні оновлення |

Чого **не** робити — тягнути з браузера **початкові** дані сторінки. Класичний код з SPA:

```tsx
// app/effect-demo/products-effect.tsx — ❌ антипатерн для початкових даних
'use client'

import { useEffect, useState } from 'react'

type Page = { items: { id: number; title: string }[] }

export function ProductsEffect() {
  const [data, setData] = useState<Page | null>(null)
  useEffect(() => {
    fetch('/api/products?cursor=0')
      .then((r) => r.json())
      .then(setData)
  }, [])
  if (!data) return <p>Завантаження…</p>
  return <ul>{data.items.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}
```

Що показала продакшн-збірка: `/effect-demo` — `○`, у HTML лише «Завантаження…» і жодного товару; запит до `/api/products` браузер відправляє тільки після завантаження JS і hydration. У `next dev` запитів **два**: Strict Mode навмисно монтує компонент двічі. Порівняй зі сторінкою, де той самий список читає Server Component: товари вже в HTML, жодного запиту з браузера.

> [!diagram] Початкові дані: useEffect проти сервера
> ```yaml
> layout: compare
> columns: { effect: "useEffect + fetch", server: "Server Component (або use())" }
> nodes:
>   - { id: e1, col: effect, label: "HTML", text: "«Завантаження…»", note: "даних у відповіді немає", tone: yellow, icon: "px:hourglass" }
>   - { id: e2, col: effect, label: "браузер", text: "JS + hydration", note: "лише тепер спрацьовує ефект", tone: orange }
>   - { id: e3, col: effect, label: "другий запит", text: "GET /api/products", note: "у dev — двічі через Strict Mode", tone: orange, icon: "px:repeat" }
>   - { id: e4, col: effect, label: "екран", text: "список", note: "після двох раундтрипів", tone: red }
>   - { id: s1, col: server, label: "сервер", text: "запит до БД під час рендеру", note: "біля даних, без API-шару", tone: blue, icon: "px:database" }
>   - { id: s2, col: server, label: "HTML", text: "shell + стрім списку", note: "дані в тій самій відповіді", tone: green }
>   - { id: s3, col: server, label: "браузер", text: "hydration", note: "запитів за даними немає", tone: green, icon: "px:check" }
> steps:
>   - { show: [e1, s1], note: "Ліворуч сервер віддає порожню оболонку. Праворуч сервер одразу йде в базу." }
>   - { show: [e2, s2], note: "Ліворуч браузер ще мусить завантажити й виконати JS. Праворуч дані вже стрімляться в HTML." }
>   - { show: [e3, s3], note: "Ліворуч ефект нарешті шле запит — другий раундтрип. Праворуч hydration лише чіпляє обробники." }
>   - { show: e4, note: "Користувач бачить дані ліворуч помітно пізніше, а пошукова система може не побачити їх зовсім." }
> ```
> Ефект — для синхронізації з зовнішнім світом, а не для завантаження того, що сервер знав одразу.

Проблем у такого ефекту більше, ніж два раундтрипи: немає кешу між екранами (повернувся назад — знову спінер), немає дедуплікації (два компоненти — два запити), гонка відповідей при зміні параметрів (стара відповідь може прийти пізніше за нову і перезаписати її), помилки ніхто не обробляє, а дані не потрапляють у HTML для пошуковиків. React-документація окремо розбирає, чому ефекти для завантаження даних — погана ідея ([[You Might Not Need an Effect]]).

> [!quiz] Перевір себе: який сценарій справді потребує клієнтського fetching
> level: middle · type: single · id: nextjs-core-20-quiz-08
>
> - [ ] Список товарів каталогу при першому заході: `useEffect` з `fetch`, щоб сторінка швидше віддалась
> - [ ] Профіль користувача з cookies: Server Component нібито не бачить cookies
> - [x] Лічильник непрочитаних повідомлень, який має оновлюватися кожні 10 секунд без навігації
> - [ ] Стаття блогу: щоб не навантажувати сервер
>
> **Пояснення:** клієнтський fetching потрібен там, де сервер не може знати дані наперед або вони мають мінятися без навігації: поллінг, нескінченний скрол, запит після вводу. Каталог і стаття — початкові дані: Server Component віддає їх у HTML без раундтрипу, а `useEffect` лише додає порожню оболонку й другий запит. Cookies Server Component читає через `cookies()` без проблем.

### 🤝 use() — вбудована альтернатива бібліотеці

Перш ніж ставити бібліотеку, перевір, чи вона потрібна. Якщо Client Component лише **один раз** читає серверні дані (інтерактивний список, графік з перемикачем), почни запит на сервері й передай проміс:

```tsx
// app/use-demo/page.tsx — запит стартує на сервері, без await
import { Suspense } from 'react'
import { io } from 'next/cache'
import { listProducts } from '@/lib/data/products'
import { ProductPicker } from './product-picker'

async function getProducts() {
  await io()
  return listProducts()
}

export default function Page() {
  const products = getProducts() // Promise, не дані
  return (
    <Suspense fallback={<p>Завантажуємо…</p>}>
      <ProductPicker products={products} />
    </Suspense>
  )
}
```

```tsx
// app/use-demo/product-picker.tsx — розгортаємо Promise через use()
'use client'

import { use, useState } from 'react'
import type { ProductDTO } from '@/lib/data/products'

export function ProductPicker({ products }: { products: Promise<ProductDTO[]> }) {
  const list = use(products) // підвішує до найближчого <Suspense>
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <ul>
      {list.map((p) => (
        <li key={p.id}>
          <button onClick={() => setSelected(p.id)}>
            {p.id === selected ? '✓ ' : ''}
            {p.title}
          </button>
        </li>
      ))}
    </ul>
  )
}
```

Товари є вже в HTML, а запитів з браузера до API — нуль. `import type` з модуля з `server-only` безпечний: типи стираються під час компіляції, і модуль у клієнтський граф не потрапляє. Механіку `use()` розібрано в [[Next.js - 11. Streaming і Suspense|темі 11]] і [[Next.js - 14. Дані на сервері#🤝 Проміс у Client Component: use()|темі 14]]. Документація Next.js формулює межу так: бібліотека потрібна, коли Client Components потрібен **спільний браузерний кеш** — revalidate при фокусі, поллінг, дедуплікація, оптимістичні оновлення. Для даних, які на клієнті ніколи не оновлюються, бібліотека — зайві кілобайти.

### 🔁 SWR в App Router

SWR (stale-while-revalidate) — бібліотека Vercel: повертає закешоване значення ключа одразу і перепитує сервер у фоні. Хуки SWR працюють лише в Client Components. Спробуй імпортувати їх у Server Component — `next dev` 16.3.8 зупиниться ще на компіляції:

```text
Error: Export default doesn't exist in target module
The export default was not found in module [project]/node_modules/swr/dist/index/react-server.mjs [app-rsc] (ecmascript).
Did you mean to import unstable_serialize?
```

Повідомлення дивне, але чесне: для серверного графа SWR підставляє окрему збірку `react-server.mjs`, де хуків немає. Із Server Components можна імпортувати лише `SWRConfig`, `unstable_serialize` і `preload`.

Живий лічильник замовлень: початкове значення дає сервер, далі SWR опитує API кожні 5 с. Ключ — спільний контракт для обох боків:

```ts
// app/orders/orders-cache.ts — один ключ для сервера й клієнта
export const ordersCache = {
  key: '/api/orders/count',
}
```

```tsx
// app/orders/page.tsx — Server Component дає початкові дані для SWR
import { Suspense } from 'react'
import { io } from 'next/cache'
import { SWRConfig } from 'swr'
import { countAllOrders } from '@/lib/data/products'
import { ordersCache } from './orders-cache'
import { OrdersBadge } from './orders-badge'

async function getCount() {
  await io()
  return { count: await countAllOrders() }
}

export default function Page() {
  return (
    <main>
      <h1>Замовлення</h1>
      <SWRConfig value={{ fallback: { [ordersCache.key]: getCount() } }}>
        <Suspense fallback={<p>Рахуємо…</p>}>
          <OrdersBadge />
        </Suspense>
      </SWRConfig>
    </main>
  )
}
```

```tsx
// app/orders/orders-badge.tsx — живий лічильник з поллінгом
'use client'

import useSWR from 'swr'
import { ordersCache } from './orders-cache'

type Count = { count: number }

async function fetcher(url: string): Promise<Count> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Не вдалося завантажити')
  return res.json()
}

export function OrdersBadge() {
  const { data } = useSWR(ordersCache.key, fetcher, {
    suspense: true,
    refreshInterval: 5000, // поллінг кожні 5 с
  })
  return (
    <p>
      Замовлень: <b data-testid="count">{data.count}</b>
    </p>
  )
}
```

Ключові моменти:

- **`fallback` отримує проміс без `await`** (SWR 2.3+ з React 19). React передає його через RSC payload, і чекає лише компонент, що читає цей ключ. Під `cacheComponents` ще й `await io()` у `getCount`, бо SQLite.
- **Ключ fallback і ключ хука мають збігатися точно.** Розійдуться — SWR мовчки проігнорує fallback і піде в мережу. Тому ключ живе в окремому модулі без серверних і клієнтських імпортів.
- **Ключ — URL Route Handler.** Браузеру потрібна HTTP-адреса для поллінгу; той самий `countAllOrders()` обслуговує і fallback, і `GET /api/orders/count`. Обробнику теж потрібен `await io()`: під `cacheComponents` `GET` без даних часу запиту пререндериться на `next build` ([[Next.js - 19. Route Handlers і Backend-for-Frontend|тема 19]]), а локальна SQLite, як і на сторінці, не виглядає як I/O.

```ts
// app/api/orders/count/route.ts — GET для поллінгу SWR
import { io } from 'next/cache'
import { countAllOrders } from '@/lib/data/products'

export async function GET() {
  await io() // без цього рядка маршрут — ○ і віддає кількість на момент збірки
  return Response.json({ count: await countAllOrders() })
}
```

Без `io()` у таблиці збірки `○ /api/orders/count`, відповідь іде з `x-nextjs-cache: HIT` і `Cache-Control: s-maxage=31536000`, а нове замовлення в базі лічильника не змінює. Найгірше в звʼязці з SWR: fallback з Server Component показує свіже число, а перший же поллінг замінює його застиглим. З `io()` маршрут — `ƒ`, і кожен запит рахує заново.
- **Fallback SWR вважає застарілим.** У headless-браузері на продакшн-збірці лічильник прийшов у HTML, і все одно перший запит до `/api/orders/count` пішов через ≈0,4 с після завантаження, далі — на 5-й і 10-й секунді. Щоб не перепитувати одразу після hydration, є `revalidateIfStale: false`, але він діє на кожен mount, а не дає «вікно свіжості» як `staleTime` у TanStack Query.

Для нескінченного скролу в SWR є `useSWRInfinite` з `swr/infinite`: функція `getKey(pageIndex, previousPageData)` повертає ключ сторінки або `null`, коли сторінок більше немає, а `size` / `setSize` керують кількістю завантажених сторінок. Сайт SWR також описує новіший спосіб передати серверні дані — `cacheData` з `preload` у `SWRConfig`, але він позначений як experimental (SWR 2.5.0-beta.1+), тож у прикладах лишаємо `fallback`, як і документація Next.js.

> [!quiz] Скільки запитів до /api/orders/count побачить DevTools
> level: middle · type: output · id: nextjs-core-20-quiz-09
>
> Продакшн-збірка. `/orders` віддає лічильник у HTML через `SWRConfig fallback`, а компонент читає його так:
>
> ```tsx
> const { data } = useSWR(ordersCache.key, fetcher, {
>   suspense: true,
>   refreshInterval: 5000,
> })
> ```
>
> Ключ у `fallback` і в хуку той самий. Користувач відкрив сторінку й 11 секунд нічого не робить. Скільки запитів до `/api/orders/count` піде з браузера?
>
> - [ ] 0: дані вже в HTML, тож SWR нічого не питає
> - [ ] 2: на 5-й і 10-й секунді, бо `fallback` вважається свіжим
> - [x] 3: одразу після hydration (≈0,4 с), потім приблизно на 5-й і 10-й секунді
> - [ ] 1: SWR дедуплікує всі запити одного ключа
>
> **Пояснення:** SWR трактує `fallback` як застарілі дані і перевіряє їх одразу після mount, а `refreshInterval` додає запити кожні 5 с. Дедуплікація об'єднує лише запити, що йдуть одночасно. Щоб не перепитувати одразу, є `revalidateIfStale: false`, але «вікна свіжості» як `staleTime` у TanStack Query в SWR немає.

### 🌸 TanStack Query в App Router

TanStack Query тримає кеш у `QueryClient`, тож спершу потрібен провайдер. Провайдер — Client Component, бо створює контекст і обʼєкт класу. Якщо написати `<QueryClientProvider client={new QueryClient()}>` прямо в серверному layout, сторінка впаде з `Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.`: екземпляр класу не серіалізується через межу.

```tsx
// app/feed/providers.tsx — провайдер TanStack Query: Client Component
'use client'

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  // сервер: новий клієнт на кожен запит (не змішувати користувачів)
  if (typeof window === 'undefined') return new QueryClient()
  // браузер: один клієнт, щоб кеш жив між рендерами
  browserQueryClient ??= new QueryClient()
  return browserQueryClient
}

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
}
```

```tsx
// app/feed/layout.tsx — провайдер лише для гілки /feed
import { Providers } from './providers'

export default function Layout({ children }: LayoutProps<'/feed'>) {
  return <Providers>{children}</Providers>
}
```

Чому `getQueryClient()` має дві гілки. На сервері модуль живе між запитами, тож модульний `QueryClient` віддав би дані одного користувача іншому — новий клієнт на кожен запит (кожен серверний рендер провайдера). У браузері навпаки: якщо компонент підвішується, а між ним і провайдером немає жодної межі `<Suspense>`, React відкидає провайдер, що ще рендериться, і при повторній спробі викликає `getQueryClient()` знову. Новий клієнт щоразу стер би кеш — тому в браузері один клієнт на вкладку. Провайдер ставимо в найближчий спільний layout, а не в root, якщо бібліотека потрібна лише одній гілці.

Нескінченний каталог: ключ і опції — в одному модулі, як у SWR.

```ts
// app/feed/feed-query.ts — ключ і опції в одному місці
import { infiniteQueryOptions } from '@tanstack/react-query'

export type ProductDTO = { id: number; title: string; price: number; inStock: boolean }
export type ProductPage = { items: ProductDTO[]; nextCursor: number | null }

export const feedQuery = infiniteQueryOptions({
  queryKey: ['products', 'feed'],
  queryFn: async ({ pageParam }): Promise<ProductPage> => {
    const res = await fetch(`/api/products?cursor=${pageParam}`)
    if (!res.ok) throw new Error('Не вдалося завантажити')
    return res.json()
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor, // null → сторінок більше немає
  staleTime: 30_000,
})
```

```tsx
// app/feed/feed.tsx — нескінченний список
'use client'

import { useEffect, useRef } from 'react'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { feedQuery } from './feed-query'

export function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(feedQuery)
  const sentinel = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <ul>
      {data.pages.flatMap((page) =>
        page.items.map((p) => <li key={p.id}>{p.title}</li>),
      )}
      <li ref={sentinel}>{isFetchingNextPage ? 'Ще…' : hasNextPage ? '' : 'Це все'}</li>
    </ul>
  )
}
```

Тут `useEffect` доречний: він синхронізує компонент із зовнішньою системою (`IntersectionObserver`), а не завантажує початкові дані. Першу сторінку дає сервер:

```tsx
// app/feed/page.tsx — перша сторінка з сервера, решта — з браузера
import { Suspense } from 'react'
import { io } from 'next/cache'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { listProductsPage } from '@/lib/data/products'
import { feedQuery } from './feed-query'
import { Feed } from './feed'

export default function Page() {
  return (
    <main>
      <h1>Каталог</h1>
      <Suspense fallback={<p>Завантажуємо…</p>}>
        <FeedData />
      </Suspense>
    </main>
  )
}

async function FeedData() {
  await io()
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    ...feedQuery,
    queryFn: ({ pageParam }) => listProductsPage(pageParam), // на сервері — напряму в БД
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Feed />
    </HydrationBoundary>
  )
}
```

На сервері `queryFn` підміняємо прямим викликом шару даних: відносний URL `/api/products` резолвиться лише в браузері, і ходити з сервера на власний API — зайвий HTTP-стрибок. Що показала продакшн-збірка: у HTML `/feed` — рівно перші чотири товари (`Кабель №4` є, `Кабель №5` немає); після hydration запиту за першою сторінкою **немає** (дані свіжі ще 30 с завдяки `staleTime`), а запити `?cursor=4` і `?cursor=8` йдуть, коли сторінку прокручено до сторожового `<li>`. Порівняй з SWR вище, який перепитав fallback одразу.

Два застереження з документації Next.js для `cacheComponents`. Перше: TanStack Query читає поточний час, створюючи стан запиту, а `dehydrate()` — під час пререндеру, тож усе це має бути за `<Suspense>`, інакше збірка впаде з помилкою про поточний час. Друге: якщо серверні дані ще й кешуються через `'use cache'`, документація показує окремий хелпер, що кешує мітку часу разом з даними тими самими тегами. Детальніше про це й про шари кешу — у [[Next.js - 15. Cache Components і use cache|темі 15]] і [[Next.js - 16. Ревалідація|темі 16]].

> [!quiz] Перевір себе: обери правдиві твердження про TanStack Query в App Router
> level: middle · type: multi · id: nextjs-core-20-quiz-10
> - [x] Провайдер — Client Component, бо `QueryClient` не серіалізується через межу сервер-клієнт
> - [x] На сервері потрібен новий `QueryClient` на кожен запит (кожен серверний рендер провайдера), інакше дані користувачів змішаються
> - [x] Ключ запиту в серверному `prefetch` і в клієнтському хуку має збігатися
> - [x] `staleTime` на клієнті запобігає негайному перезапиту гідратованих даних
> - [ ] `useQuery` можна викликати в Server Component, якщо файл імпортує `QueryClientProvider`
> - [ ] Модульний `QueryClient` на сервері — оптимізація, бо кеш спільний для всіх запитів
> - [ ] `HydrationBoundary` робить додатковий запит до API, щоб перевірити дані
>
> **Пояснення:** хуки (`useQuery`) працюють лише в Client Components, імпорт провайдера цього не змінює. Спільний серверний кеш — не оптимізація, а витік: модуль живе між запитами, і кеш одного користувача дістанеться іншому. У браузері, навпаки, клієнт один на вкладку: якщо компонент призупиняється без `<Suspense>` між ним і провайдером, React відкидає провайдер, що ще не закомітився, і новий `QueryClient` стер би кеш. `HydrationBoundary` не ходить у мережу: він лише переносить кеш, який зробив `dehydrate()` на сервері, а з `staleTime: 30_000` перша сторінка після hydration не перепитується.

### 🔗 Кеш бібліотеки і кеші Next.js

З бібліотекою даних у застосунку зʼявляється ще один кеш. Документація Next.js рахує три шари: серверний кеш Next.js (`'use cache'`, свіжість — `cacheLife` `revalidate`/`expire`), клієнтський кеш Next.js (RSC payload відвіданих і prefetched маршрутів, `stale`) і кеш бібліотеки в браузері під ключем SWR чи TanStack Query (її власні опції ревалідації). Тривалості не мусять збігатися. Збігатися мусить **ідентичність**: після мутації треба оновити і браузерний кеш (оптимістично через `mutate` / `setQueryData`, з відкатом при помилці), і серверний (`updateTag` у Server Action, якщо серверне читання кешоване з тегом). Тому документація радить тримати ключ бібліотеки і тег сервера в одному «контракті кешу», як `ordersCache` вище. Механіка тегів — у [[Next.js - 16. Ревалідація|темі 16]].

### 🧮 Як обрати: таблиця рішень

| Що потрібно | Інструмент | Чому |
|---|---|---|
| Початкові дані сторінки | Server Component + шар даних | дані в HTML, без API і раундтрипу |
| Інтерактивному компоненту один раз потрібні серверні дані | проміс з сервера + `use()` | запит стартує на сервері, без бібліотеки |
| Запис після дії користувача | Server Action → функція шару даних з транзакцією | один раундтрип, атомарність |
| Живі дані без навігації (лічильник, статус) | SWR `refreshInterval` / TanStack `refetchInterval` + Route Handler | поллінг і revalidate при фокусі |
| Нескінченний скрол | `useSWRInfinite` / `useInfiniteQuery`, перша сторінка з сервера | наступні сторінки — за прокруткою |
| Дані після вводу (автодоповнення) | SWR з умовним ключем / TanStack з `enabled` | запит лише коли є що шукати |
| Postgres у serverless | малий пул у модулі + пулер або HTTP-драйвер; на Vercel — Fluid + `attachDatabasePool` | менше зʼєднань на той самий трафік |
| Локальна SQLite під Cache Components | `await io()` перед запитом + `<Suspense>` | інакше дані застигнуть на момент збірки |

### 🏭 Як це роблять у продакшні

- **Один модуль клієнта БД** (`lib/db/index.ts`) з `server-only`, синглтоном через `globalThis` у dev і пулом в області модуля. Рядок підключення читає лише він.
- **Шар даних `lib/data/*`** повертає DTO; компоненти й дії не імпортують `db`. Code review ловить `db.select()` у `app/`.
- **Два рядки підключення**: пулерний (`DATABASE_URL`) для застосунку, прямий (`DIRECT_URL` чи подібний) для міграцій.
- **Бюджет зʼєднань записаний**: ліміт бази, резерв для адмінки й міграцій, `max` пулу на інстанс. Моніторинг кількості зʼєднань і помилок `too many connections` — у дашборді бази.
- **Міграції — окремий крок деплою**, SQL у git, ламкі зміни в два релізи.
- **Транзакції короткі й в одній функції шару даних**; зовнішні виклики — до транзакції або в `after()`.
- **Клієнтська бібліотека — одна на застосунок** (SWR або TanStack Query), провайдер у найближчому спільному layout, ключі й теги в модулях-контрактах `*-cache.ts`.
- **`useEffect` + `fetch` для початкових даних не проходить review**: замість нього Server Component, `use()` або бібліотека з даними з сервера.

## ⚠️ Пастки

> [!pitfall] new PrismaClient() у модулі без globalThis
> У `next dev` кожна правка модуля БД створює нові клієнти з новими пулами, і локальний Postgres закінчує зʼєднання.
>
> ```ts
> export const prisma = new PrismaClient({ adapter }) // ❌ +клієнт на кожен HMR
> export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter }) // ✅
> if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
> ```

> [!pitfall] Пул усередині Server Action
> Новий `Pool` на кожен виклик — нові зʼєднання на кожен клік, і ніхто їх не закриває.
>
> ```ts
> export async function save() {
>   'use server'
>   const pool = new Pool({ connectionString: process.env.DATABASE_URL }) // ❌
> }
> // ✅ pool — константа в lib/db, дія викликає функцію шару даних
> ```

> [!pitfall] Локальна SQLite «застигла» на даних збірки
> Під `cacheComponents` синхронний усередині драйвер не виглядає як I/O, і маршрут стає `○` з даними на момент `next build`.
>
> ```tsx
> async function ProductList() {
>   await io() // ✅ без цього рядка — ○ і старі дані
>   const items = await listProducts()
> }
> ```

> [!pitfall] Запит через db усередині транзакції
> Лише запити через `tx` відкочуються. `db` бере інше зʼєднання і комітить одразу.
>
> ```ts
> await db.transaction(async (tx) => {
>   await tx.update(products).set({ stock: sql`${products.stock} - 1` })
>   await db.insert(orders).values({ productId, quantity: 1 }) // ❌ поза транзакцією
> })
> ```

> [!pitfall] Перевірка залишку окремим SELECT
> Між `SELECT` і `UPDATE` інший запит встигає купити той самий товар.
>
> ```ts
> const [p] = await tx.select().from(products).where(eq(products.id, id))
> if (p.stock >= qty) await tx.update(products).set({ stock: p.stock - qty }) // ❌ гонка
> // ✅ .where(sql`${products.id} = ${id} and ${products.stock} >= ${qty}`) + перевірка returning
> ```

> [!pitfall] Модульний QueryClient на сервері
> Модуль живе між запитами, тож кеш одного користувача дістанеться іншому.
>
> ```tsx
> const queryClient = new QueryClient() // ❌ на рівні модуля в providers.tsx
> // ✅ getQueryClient(): на сервері — новий, у браузері — один на вкладку
> ```

> [!pitfall] Route Handler з локальною SQLite теж застигає
> Той самий капкан, що й на сторінці: `GET` пререндериться на `next build`, і поллінг роками отримує число зі збірки.
>
> ```ts
> export async function GET() {
>   await io() // ✅ без нього — ○, x-nextjs-cache: HIT і старі дані
>   return Response.json({ count: await countAllOrders() })
> }
> ```

> [!pitfall] Різні ключі для fallback і хука
> SWR мовчки ігнорує fallback і робить зайвий запит.
>
> ```tsx
> <SWRConfig value={{ fallback: { '/api/orders/count': getCount() } }}>
> useSWR('/api/orders/count?x=1', fetcher) // ❌ інший ключ
> // ✅ обидва беруть ordersCache.key
> ```

## 🎤 На співбесіді

> [!interview] Чому в Next.js-проєктах Prisma чи Drizzle клієнт зберігають у globalThis?
> level: middle · frequency: часто · id: nextjs-core-20-int-01
>
> ---
>
> Через hot reload у `next dev`: Turbopack перевиконує змінений модуль, і `new PrismaClient()` на рівні модуля створює новий клієнт з новим пулом, а старий ніхто не закриває. За кілька правок локальна база отримує десятки зайвих зʼєднань. `globalThis` HMR не перевиконує, тож модуль бере вже створений клієнт. У продакшні модуль і так виконується один раз на процес, тому записують у `globalThis` лише поза `production`. Синглтон — «один на процес»: під час `next build` кожен воркер має свій.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#♻️ Один клієнт на процес: HMR і globalThis|Розділ: один клієнт на процес]] · [Prisma: Database connections](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections) · [Prisma: Next.js help](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help)

> [!interview] Застосунок на serverless почав падати з too many connections під навантаженням. Що відбувається і що робитимеш?
> level: senior · frequency: часто · id: nextjs-core-20-int-02
>
> ---
>
> Кожен інстанс тримає власний пул, тож зʼєднань = інстанси × `max`. На піку платформа піднімає десятки інстансів, а заморожені інстанси ще й не закривають неактивні зʼєднання. Кроки: перевірити, що пул створюється в модулі, а не в обробнику; зменшити `max` до 1–5 і порахувати бюджет під ліміт бази; поставити пулер (PgBouncer у transaction mode, пулерний рядок провайдера) або перейти на HTTP-драйвер для простих запитів; на Vercel — Fluid Compute і `attachDatabasePool`. Міграції — через прямий рядок, бо transaction mode не тримає сесійних речей.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🌊 Пули зʼєднань у serverless|Розділ: пули зʼєднань]] · [Vercel: @vercel/functions attachDatabasePool](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package) · [Neon: Connection pooling](https://neon.com/docs/connect/connection-pooling)

> [!interview] Як гарантувати, що замовлення не продасть більше товару, ніж є на складі?
> level: middle · frequency: часто · id: nextjs-core-20-int-03
>
> ---
>
> Зменшення залишку й запис замовлення — в одній транзакції в функції шару даних, і всі запити через `tx`. Перевірку робити не окремим `SELECT`, а умовою в `UPDATE … WHERE stock >= qty`: це атомарно, і два паралельні покупці не пройдуть одну й ту саму перевірку. Якщо оновлено нуль рядків — кинути помилку, транзакція відкотиться. Транзакцію тримати короткою, без мережевих викликів усередині. Server Action лише валідує вхід, викликає функцію і оновлює UI.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🔒 Транзакції|Розділ: транзакції]] · [Drizzle: Transactions](https://orm.drizzle.team/docs/transactions) · [PostgreSQL: Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)

> [!interview] Коли в App Router брати SWR чи TanStack Query, а коли вистачить Server Components і use()?
> level: middle · frequency: дуже часто · id: nextjs-core-20-int-04
>
> ---
>
> Початкові дані — Server Component: вони приходять у HTML без раундтрипу. Якщо інтерактивному компоненту дані потрібні один раз — проміс з сервера і `use()`. Бібліотека — коли потрібен спільний браузерний кеш і його поведінка: поллінг, revalidate при фокусі, нескінченний скрол, дані після вводу, оптимістичні оновлення. Навіть тоді початкове значення дає сервер (`SWRConfig fallback` або `HydrationBoundary`), а браузер далі керує кешем. `useEffect` + `fetch` для початкових даних — антипатерн: порожній HTML, другий раундтрип, гонки, без кешу.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#📡 Коли дані тягнути з браузера|Розділ: коли тягнути з браузера]] · [Next.js: Client-side data fetching](https://nextjs.org/docs/app/guides/client-side-data-fetching) · [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

> [!interview] Як підключити TanStack Query до App Router, щоб не змішати дані користувачів і не перезапитувати гідратовані дані?
> level: senior · frequency: іноді · id: nextjs-core-20-int-05
>
> ---
>
> Провайдер — Client Component з `getQueryClient()`: на сервері новий `QueryClient` на кожен запит, тобто на кожен серверний рендер провайдера (модульний поділив би кеш між запитами різних користувачів), у браузері — один на вкладку. Server Component створює власний `QueryClient`, робить `prefetchQuery` з `queryFn`, що викликає шар даних напряму, і віддає `dehydrate()` у `HydrationBoundary`. Ключі сервера й клієнта — з одного модуля `queryOptions`. `staleTime` на клієнті тримає гідратовані дані свіжими, тож немає перезапиту одразу після hydration. З `cacheComponents` усе це — за `<Suspense>`, бо бібліотека читає поточний час.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🌸 TanStack Query в App Router|Розділ: TanStack Query]] · [Next.js: TanStack Query guide](https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query) · [TanStack Query: Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

## 🔗 Звʼязки

- [[Next.js - 14. Дані на сервері]] — водоспади, дедуплікація і `use()` з боку даних.
- [[Next.js - 15. Cache Components і use cache]] і [[Next.js - 16. Ревалідація]] — коли читання з БД кешувати і як інвалідувати після мутації.
- [[Next.js - 19. Route Handlers і Backend-for-Frontend]] — API, у які ходять SWR і TanStack Query.
- [[Next.js - 08. Межа use client]] — `server-only`, провайдери як Client Components, серіалізація props.
- [[Next.js - 11. Streaming і Suspense]] — межі, за якими стоять запити до БД.
- [[You Might Not Need an Effect]] і [[use]] — довідник React: чому не ефект і як читати проміс.
- Далі в курсі: теми 21–23 основного посібника — Server Actions і форми, тема 29 основного посібника — повний Data Access Layer з авторизацією, тема 42 основного посібника — Vercel Functions і Fluid Compute.

## ⚡ Фішки

> [!reel] 🚫 Prisma 7 не створиться без адаптера
> `new PrismaClient()` без опцій одразу кидає `PrismaClient was instantiated without any options. A driver adapter is required to connect to your database.` Параметрів пулу в URL у v7 більше немає: пул налаштовують в опціях адаптера.

> [!reel] ↩️ Виняток у транзакції — це й є відкат
> `UPDATE`, а потім `throw` усередині `db.transaction`: залишок лишається як був. Явний `tx.rollback()` теж працює через виняток `TransactionRollbackError` з повідомленням `Rollback`.

> [!reel] 🔁 SWR вважає fallback застарілим
> Лічильник уже в HTML, а перший запит до API все одно йде через ≈0,4 с після hydration, потім на 5-й і 10-й секунді. `staleTime` із TanStack Query цю проблему вирішує, у SWR є лише `revalidateIfStale: false`.

> [!reel] 🌸 new QueryClient() у серверному layout
> `<QueryClientProvider client={new QueryClient()}>` у Server Component падає з `Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.` Провайдер має бути Client Component.

> [!reel] 👯 useEffect у dev стріляє двічі
> Класичний `useEffect` + `fetch` у `next dev` робить два запити до `/api/products`: Strict Mode навмисно монтує компонент двічі. У продакшні запит один, але HTML порожній, лише «Завантаження…».

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Хто в App Router ходить у базу даних і чому окремий API-шар не потрібен?
> *дуже часто · теорія* · `nextjs-core-20-card-01`
>
> Лише серверний код: Server Components (читання під час рендеру), Server Actions (запис після дії) і Route Handlers (HTTP-API для браузера й сторонніх клієнтів). Код з драйвером не потрапляє в клієнтський бандл, тож компонент читає базу сам, без проміжного `/api`.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🧭 Хто ходить у базу|Розділ: хто ходить у базу]] · [Next.js: Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)

> [!question]- Навіщо `import 'server-only'` у модулі клієнта БД?
> *часто · безпека* · `nextjs-core-20-card-02`
>
> Якщо хтось імпортує модуль у Client Component, збірка падає, а не тягне драйвер і рядок підключення в клієнтський бандл. Це захист від випадкового витоку серверного коду через спільні модулі.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🗂️ Мінімальний модуль доступу до даних|Розділ: модуль доступу до даних]] · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security)

> [!question]- Чому `useEffect` + `fetch` для початкових даних сторінки — антипатерн?
> *дуже часто · теорія* · `nextjs-core-20-card-04`
>
> HTML приходить порожнім («Завантаження…»), запит іде лише після завантаження JS і hydration, у dev Strict Mode дає ще й другий запит. Плюс немає кешу між екранами, дедуплікації, захисту від гонки відповідей, а пошуковик може не побачити даних. Початкові дані краще дає Server Component.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#📡 Коли дані тягнути з браузера|Розділ: коли тягнути з браузера]] · [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### 🟡 Middle

> [!question]- Навіщо транзакція в `placeOrder` і чому запити йдуть через `tx`, а не `db`?
> *дуже часто · практика* · `nextjs-core-20-card-05`
>
> Замовлення — два записи: зменшити залишок і створити рядок. Транзакція гарантує «або обидва, або жоден». Запит через `db` піде іншим зʼєднанням поза транзакцією: він закомітиться одразу й не відкотиться, якщо наступний крок кине помилку.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🔒 Транзакції|Розділ: транзакції]] · [Drizzle: Transactions](https://orm.drizzle.team/docs/transactions)

> [!question]- Чому перевірку залишку роблять умовою в `UPDATE`, а не окремим `SELECT`?
> *часто · код* · `nextjs-core-20-card-06`
>
> Між `SELECT` і `UPDATE` інший покупець встигає прочитати той самий залишок, і продано більше, ніж є. `UPDATE … WHERE stock >= qty` робить «перевір і зміни» одним атомарним кроком, а нуль оновлених рядків у `returning` означає «не вистачило» і привід кинути помилку.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🔒 Транзакції|Розділ: транзакції]] · [PostgreSQL: Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)

> [!question]- Коли замість SWR чи TanStack Query вистачить `use()`?
> *часто · практика* · `nextjs-core-20-card-08`
>
> Коли Client Component лише один раз читає серверні дані: сервер стартує запит без `await` і передає проміс у prop, компонент розгортає його через `use()` під `<Suspense>`. Дані вже в HTML, а запитів з браузера немає. Бібліотека потрібна для спільного браузерного кешу: поллінг, revalidate при фокусі, нескінченний скрол, оптимістичні оновлення.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🤝 use() — вбудована альтернатива бібліотеці|Розділ: use()]] · [Next.js: Client-side data fetching](https://nextjs.org/docs/app/guides/client-side-data-fetching)

> [!question]- Чому SWR після `SWRConfig fallback` усе одно робить запит?
> *іноді · практика* · `nextjs-core-20-card-09`
>
> SWR вважає fallback застарілими даними й перевіряє їх одразу після mount (≈0,4 с на 16.3.8). Якщо ключі fallback і хука розійдуться, fallback ігнорується повністю. `revalidateIfStale: false` вимикає перепит, але діє на кожен mount, а «вікна свіжості» як `staleTime` у TanStack немає.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🔁 SWR в App Router|Розділ: SWR]] · [SWR: with Next.js](https://swr.vercel.app/docs/with-nextjs)

### 🔴 Senior

> [!question]- Як порахувати бюджет зʼєднань для серверлесу?
> *часто · практика* · `nextjs-core-20-card-10`
>
> Зʼєднань = інстанси × `max` пулу. Бюджет: (ліміт бази − резерв для міграцій і адмінки) / очікувана кількість інстансів, округлити вниз, не менше 1. Якщо навіть при `max: 1` бюджет не сходиться, потрібен пулер, HTTP-драйвер або Fluid Compute.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🌊 Пули зʼєднань у serverless|Розділ: пули зʼєднань]] · [Vercel: attachDatabasePool](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package)

> [!question]- Що ламається при переході на PgBouncer у transaction mode?
> *іноді · теорія* · `nextjs-core-20-card-11`
>
> Зʼєднання повертається в пул після кожної транзакції, тож не працюють сесійні речі: `SET` для сесії, `LISTEN`/`NOTIFY`, SQL-рівневий `PREPARE`, сесійні advisory locks. Міграції та `pg_dump` ганяють через прямий рядок підключення, а застосунок працює через пулерний.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🌊 Пули зʼєднань у serverless|Розділ: пули зʼєднань]] · [Neon: Connection pooling](https://neon.com/docs/connect/connection-pooling)

> [!question]- Як у TanStack Query віддати першу сторінку з сервера й не перепитати її після hydration?
> *іноді · практика* · `nextjs-core-20-card-12`
>
> Server Component створює власний `QueryClient`, робить `prefetchInfiniteQuery` з `queryFn`, що викликає шар даних напряму, і віддає `dehydrate()` у `HydrationBoundary`. Ключі беруть з одного модуля `queryOptions`. `staleTime: 30_000` тримає гідратовані дані свіжими, тож перша сторінка не перепитується, а наступні курсори вантажаться при прокрутці. Усе це за `<Suspense>`.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🌸 TanStack Query в App Router|Розділ: TanStack Query]] · [TanStack Query: Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

> [!question]- Які три шари кешу з'являються разом із бібліотекою даних і як їх узгодити після мутації?
> *рідко · теорія* · `nextjs-core-20-card-13`
>
> Серверний кеш Next.js (`'use cache'`), клієнтський кеш Next.js (RSC payload маршрутів) і кеш бібліотеки під ключем SWR чи TanStack. Тривалості не мусять збігатися, збігатися мусить ідентичність: після мутації оновлюють браузерний кеш (`mutate` / `setQueryData` з відкатом) і серверний (`updateTag`). Ключ бібліотеки й тег тримають в одному модулі-контракті.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🔗 Кеш бібліотеки і кеші Next.js|Розділ: кеші]] · [Next.js: Client-side data fetching](https://nextjs.org/docs/app/guides/client-side-data-fetching)

> [!question]- Як безпечно робити міграції в команді й що з ламкими змінами?
> *іноді · практика* · `nextjs-core-20-card-14`
>
> SQL-файли міграцій лежать у git і проходять review, застосування — окремий крок деплою (CI або `migrate deploy` перед перемиканням трафіку), а не код першого запиту сторінки. Рядок підключення для міграцій прямий. Ламку зміну (перейменування колонки) роблять у два релізи: спершу додати нове поле й писати в обидва, потім прибрати старе.
>
> 📚 [[Next.js - 20. Бази даних і клієнтський fetching#🧬 Міграції коротко|Розділ: міграції]] · [Drizzle: Migrations](https://orm.drizzle.team/docs/migrations)

## 🛠️ Практика

> [!task] Порахуй бюджет зʼєднань для пулу
> level: middle · difficulty: medium · id: nextjs-core-20-task-01 · tags: pool, serverless, connections
>
> Кожен serverless-інстанс має власний пул, тож зʼєднань = інстанси × розмір пулу. Напиши `poolBudget({ dbMaxConnections, reserved, expectedInstances, desiredPerInstance })`, що повертає `{ perInstance, total, fits }`:
>
> - доступно = `dbMaxConnections - reserved` (резерв для міграцій і адмінки);
> - `perInstance` = менше з `desiredPerInstance` і цілої частини `доступно / expectedInstances`, але **не менше 1**;
> - `total` = `perInstance * expectedInstances`;
> - `fits` = `total <= доступно`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type PoolInput = {
>   dbMaxConnections: number
>   reserved: number
>   expectedInstances: number
>   desiredPerInstance: number
> }
>
> type PoolPlan = { perInstance: number; total: number; fits: boolean }
>
> function poolBudget(input: PoolInput): PoolPlan {
>   // твій код
> }
> ```
>
> ```ts tests
> test('ділить бюджет порівну між інстансами', () => {
>   const plan = poolBudget({ dbMaxConnections: 100, reserved: 10, expectedInstances: 30, desiredPerInstance: 10 })
>   expect(plan).toEqual({ perInstance: 3, total: 90, fits: true })
> })
>
> test('округлює розмір пулу вниз', () => {
>   const plan = poolBudget({ dbMaxConnections: 100, reserved: 0, expectedInstances: 30, desiredPerInstance: 10 })
>   expect(plan.perInstance).toBe(3)
>   expect(plan.total).toBe(90)
> })
>
> test('дробовий бюджет не округлюється вгору', () => {
>   const plan = poolBudget({ dbMaxConnections: 100, reserved: 0, expectedInstances: 40, desiredPerInstance: 10 })
>   expect(plan.perInstance).toBe(2)
>   expect(plan.fits).toBe(true)
> })
>
> test('бажаний розмір менший за бюджет лишається бажаним', () => {
>   const plan = poolBudget({ dbMaxConnections: 100, reserved: 10, expectedInstances: 5, desiredPerInstance: 2 })
>   expect(plan).toEqual({ perInstance: 2, total: 10, fits: true })
> })
>
> test('інстансів більше, ніж зʼєднань: мінімум 1 і fits = false', () => {
>   const plan = poolBudget({ dbMaxConnections: 50, reserved: 10, expectedInstances: 80, desiredPerInstance: 5 })
>   expect(plan.perInstance).toBe(1)
>   expect(plan.total).toBe(80)
>   expect(plan.fits).toBe(false)
> })
>
> test('резерв не менший за ліміт бази: fits = false', () => {
>   const plan = poolBudget({ dbMaxConnections: 20, reserved: 25, expectedInstances: 4, desiredPerInstance: 3 })
>   expect(plan.perInstance).toBe(1)
>   expect(plan.fits).toBe(false)
> })
> ```
>
>
> > [!hint]- Підказка 1
> > Розмір пулу — ціле число зʼєднань. Яка функція `Math` відкидає дробову частину?
>
> > [!hint]- Підказка 2
> > Обмеж зверху через `Math.min(desired, fair)`, а нижню межу 1 додай окремо через `Math.max`. Навіть при нульовому бюджеті пул не може мати 0 зʼєднань, а `fits` тоді покаже, що бюджет не сходиться.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function poolBudget({ dbMaxConnections, reserved, expectedInstances, desiredPerInstance }: PoolInput): PoolPlan {
> >   const available = dbMaxConnections - reserved
> >   const fair = Math.floor(available / expectedInstances)
> >   const perInstance = Math.max(1, Math.min(desiredPerInstance, fair))
> >   const total = perInstance * expectedInstances
> >   return { perInstance, total, fits: total <= available }
> > }
> > ```
> >
> > Мінімум 1 означає, що при надто малому бюджеті `total` може перевищити доступне: саме для цього є `fits`. У реальному проєкті цей розрахунок підказує, коли замість збільшення `max` треба ставити пулер або переходити на HTTP-драйвер.

> [!task] Синглтон клієнта БД через globalThis
> level: middle · difficulty: easy · id: nextjs-core-20-task-02 · tags: singleton, hmr, globalthis
>
> У `next dev` HMR перевиконує модуль, і клієнт БД створюється заново, якщо не зберегти його в `globalThis`. Змоделюй шаблон як чисту функцію `getOrCreate(store, key, factory, env)`, де `store` — замість `globalThis`:
>
> - якщо `store[key]` уже є, поверни його і **не викликай** `factory`;
> - інакше створи значення через `factory()` і поверни;
> - записуй у `store` лише коли `env !== 'production'`;
> - якщо `factory` кидає помилку, у `store` нічого не лишається.
>
> ```js starter
> function getOrCreate(store, key, factory, env) {
>   // твій код
> }
> ```
>
> ```js tests
> test('у dev п’ять «перезавантажень модуля» створюють один екземпляр', () => {
>   const globalStore = {}
>   const factory = vi.fn(() => ({ id: Math.random() }))
>   const seen = new Set()
>   for (let reload = 0; reload < 5; reload++) {
>     seen.add(getOrCreate(globalStore, 'prisma', factory, 'development'))
>   }
>   expect(factory).toHaveBeenCalledTimes(1)
>   expect(seen.size).toBe(1)
> })
>
> test('готовий екземпляр повертається без виклику factory', () => {
>   const existing = { ready: true }
>   const factory = vi.fn(() => ({}))
>   expect(getOrCreate({ db: existing }, 'db', factory, 'development')).toBe(existing)
>   expect(factory).not.toHaveBeenCalled()
> })
>
> test('у production кожен виклик створює новий екземпляр і нічого не пише в store', () => {
>   const globalStore = {}
>   const factory = vi.fn(() => ({}))
>   const a = getOrCreate(globalStore, 'prisma', factory, 'production')
>   const b = getOrCreate(globalStore, 'prisma', factory, 'production')
>   expect(factory).toHaveBeenCalledTimes(2)
>   expect(a).not.toBe(b)
>   expect(Object.keys(globalStore)).toHaveLength(0)
> })
>
> test('різні ключі — різні екземпляри', () => {
>   const globalStore = {}
>   const a = getOrCreate(globalStore, 'libsql', () => ({ name: 'a' }), 'development')
>   const b = getOrCreate(globalStore, 'prisma', () => ({ name: 'b' }), 'development')
>   expect(a).not.toBe(b)
>   expect(getOrCreate(globalStore, 'libsql', () => ({ name: 'x' }), 'development')).toBe(a)
> })
>
> test('factory, що кидає, не лишає запису в store', () => {
>   const globalStore = {}
>   expect(() =>
>     getOrCreate(globalStore, 'db', () => {
>       throw new Error('немає зʼєднання')
>     }, 'development'),
>   ).toThrow('немає зʼєднання')
>   expect('db' in globalStore).toBe(false)
>   const ok = getOrCreate(globalStore, 'db', () => ({ ok: true }), 'development')
>   expect(ok).toEqual({ ok: true })
> })
> ```
>
>
> > [!hint]- Підказка 1
> > Спершу перевір `store[key]`, лише потім викликай `factory`.
>
> > [!hint]- Підказка 2
> > Присвоєння в `store` має стояти після `factory()` і за умовою на `env`: якщо `factory` кинула, до присвоєння код не дійде.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function getOrCreate(store, key, factory, env) {
> >   if (store[key] !== undefined) return store[key]
> >   const value = factory()
> >   if (env !== 'production') store[key] = value
> >   return value
> > }
> > ```
> >
> > Це той самий шаблон, що `globalForPrisma.prisma ?? createPrisma()` разом з `if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`. У продакшні запису в `globalThis` немає: модуль і так виконується один раз на процес.

> [!task] Транзакція замовлення з відкатом
> level: middle · difficulty: hard · id: nextjs-core-20-task-03 · tags: transactions, rollback, data-layer
>
> Змоделюй `db.transaction` над in-memory сховищем `{ products: Map<id, { stock }>, orders: [] }`. Напиши `placeOrder(store, productId, quantity, onInsert?)`:
>
> - умовний «UPDATE»: якщо товар є і `stock >= quantity`, зменш `stock`;
> - «INSERT»: додай у `orders` запис `{ id, productId, quantity }`, де `id` = кількість замовлень + 1, і виклич `onInsert(order)`, якщо його передано;
> - повертає `{ orderId, stockLeft }`;
> - при **будь-якій** помилці (немає товару, `OutOfStockError`, кількість не є цілим числом ≥ 1, виняток із `onInsert`) відновіть стан, яким він був до виклику, і перекинь помилку далі.
>
> Клас `OutOfStockError` уже є в заготовці. Задача на TypeScript: типи знімаються перед запуском.
>
> ```ts starter
> class OutOfStockError extends Error {}
>
> type Order = { id: number; productId: number; quantity: number }
> type Store = {
>   products: Map<number, { stock: number }>
>   orders: Order[]
> }
>
> function placeOrder(
>   store: Store,
>   productId: number,
>   quantity: number,
>   onInsert?: (order: Order) => void,
> ): { orderId: number; stockLeft: number } {
>   // твій код
> }
> ```
>
> ```ts tests
> function makeStore(stock = 3): Store {
>   return { products: new Map([[1, { stock }]]), orders: [] }
> }
>
> test('успіх зменшує залишок і додає замовлення', () => {
>   const store = makeStore(3)
>   const result = placeOrder(store, 1, 2)
>   expect(result).toEqual({ orderId: 1, stockLeft: 1 })
>   expect(store.products.get(1)?.stock).toBe(1)
>   expect(store.orders).toEqual([{ id: 1, productId: 1, quantity: 2 }])
> })
>
> test('недостатньо на складі: кидає OutOfStockError і стан не змінено', () => {
>   const store = makeStore(1)
>   expect(() => placeOrder(store, 1, 2)).toThrow(OutOfStockError)
>   expect(store.products.get(1)?.stock).toBe(1)
>   expect(store.orders).toHaveLength(0)
> })
>
> test('немає товару або кількість некоректна: кидає і нічого не пише', () => {
>   const store = makeStore(5)
>   expect(() => placeOrder(store, 99, 1)).toThrow()
>   expect(() => placeOrder(store, 1, 0)).toThrow()
>   expect(() => placeOrder(store, 1, 1.5)).toThrow()
>   expect(store.products.get(1)?.stock).toBe(5)
>   expect(store.orders).toHaveLength(0)
> })
>
> test('хук onInsert кидає після оновлення: залишок і замовлення відкочені', () => {
>   const store = makeStore(3)
>   expect(() =>
>     placeOrder(store, 1, 2, () => {
>       throw new Error('boom')
>     }),
>   ).toThrow('boom')
>   expect(store.products.get(1)?.stock).toBe(3)
>   expect(store.orders).toHaveLength(0)
> })
>
> test('після відкату наступне замовлення проходить з тим самим номером', () => {
>   const store = makeStore(3)
>   try {
>     placeOrder(store, 1, 2, () => {
>       throw new Error('boom')
>     })
>   } catch {}
>   expect(placeOrder(store, 1, 2)).toEqual({ orderId: 1, stockLeft: 1 })
> })
>
> test('два замовлення на останні одиниці: друге падає без рядка', () => {
>   const store = makeStore(3)
>   expect(placeOrder(store, 1, 2)).toEqual({ orderId: 1, stockLeft: 1 })
>   expect(() => placeOrder(store, 1, 2)).toThrow(OutOfStockError)
>   expect(store.products.get(1)?.stock).toBe(1)
>   expect(store.orders).toHaveLength(1)
> })
> ```
>
>
> > [!hint]- Підказка 1
> > Перед змінами зніми знімок: копію `Map` разом із вкладеними обʼєктами `{ stock }` (спред `{ ...p }`) і копію масиву `orders`.
>
> > [!hint]- Підказка 2
> > Обгорни зміни в `try`/`catch`. У `catch` відновіть знімок на місці (`clear()` + `set`, `length = 0` + `push`) і перекинь помилку через `throw e`. Хук, що кидає після оновлення залишку, ловить саме ця гілка.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > class OutOfStockError extends Error {}
> >
> > type Order = { id: number; productId: number; quantity: number }
> > type Store = {
> >   products: Map<number, { stock: number }>
> >   orders: Order[]
> > }
> >
> > function placeOrder(
> >   store: Store,
> >   productId: number,
> >   quantity: number,
> >   onInsert?: (order: Order) => void,
> > ): { orderId: number; stockLeft: number } {
> >   // «початок транзакції»: знімок стану
> >   const productsBackup = new Map([...store.products].map(([id, p]) => [id, { ...p }] as const))
> >   const ordersBackup = [...store.orders]
> >   try {
> >     if (!Number.isInteger(quantity) || quantity < 1) throw new RangeError('Некоректна кількість')
> >     const product = store.products.get(productId)
> >     if (!product) throw new Error('Товар не знайдено')
> >     if (product.stock < quantity) throw new OutOfStockError('Недостатньо на складі')
> >
> >     product.stock -= quantity // умовний UPDATE
> >     const order = { id: store.orders.length + 1, productId, quantity }
> >     store.orders.push(order) // INSERT
> >     onInsert?.(order)
> >     return { orderId: order.id, stockLeft: product.stock } // «коміт»
> >   } catch (e) {
> >     // відкат: повертаємо знімок
> >     store.products.clear()
> >     for (const [id, p] of productsBackup) store.products.set(id, p)
> >     store.orders.length = 0
> >     store.orders.push(...ordersBackup)
> >     throw e
> >   }
> > }
> > ```
> >
> > Реальний `db.transaction` відкочує все на рівні бази, а не копією стану, але контракт той самий: виняток усередині колбека означає, що жоден запис не лишився. Хук `onInsert` тут грає роль будь-якого кроку після першого запису.

> [!task] Курсорна пагінація
> level: middle · difficulty: medium · id: nextjs-core-20-task-04 · tags: pagination, cursor, infinite-scroll
>
> Нескінченний каталог тягне сторінки за курсором, а не за номером. Напиши `paginate(rows, cursor, limit)`, де `rows` відсортовані за зростанням `id`:
>
> - `items` — перші `limit` рядків з `id > cursor`;
> - `nextCursor` — `id` останнього елемента сторінки, **якщо після нього є ще рядки**, інакше `null` (щоб клієнт не просив порожню сторінку);
> - `limit`, що не є цілим числом ≥ 1, кидає `RangeError`.
>
> Курсор — це `id`, а не індекс: після видалень у ряді `id` бувають дірки. Задача на TypeScript: типи знімаються перед запуском.
>
> ```ts starter
> type Row = { id: number; title: string }
> type Page = { items: Row[]; nextCursor: number | null }
>
> function paginate(rows: Row[], cursor: number, limit: number): Page {
>   // твій код
> }
> ```
>
> ```ts tests
> const rows: Row[] = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, title: `Кабель №${i + 1}` }))
> const ids = (page: Page) => page.items.map((r) => r.id)
>
> test('перша сторінка з cursor 0', () => {
>   const page = paginate(rows, 0, 4)
>   expect(ids(page)).toEqual([1, 2, 3, 4])
>   expect(page.nextCursor).toBe(4)
> })
>
> test('наступна сторінка починається після курсора', () => {
>   const page = paginate(rows, 4, 4)
>   expect(ids(page)).toEqual([5, 6, 7, 8])
>   expect(page.nextCursor).toBe(8)
> })
>
> test('остання неповна сторінка має nextCursor null', () => {
>   const page = paginate(rows, 8, 4)
>   expect(ids(page)).toEqual([9, 10])
>   expect(page.nextCursor).toBeNull()
> })
>
> test('рівно limit рядків лишилось: nextCursor null, без порожньої сторінки', () => {
>   const page = paginate(rows, 6, 4)
>   expect(ids(page)).toEqual([7, 8, 9, 10])
>   expect(page.nextCursor).toBeNull()
> })
>
> test('курсор між id (дірки після видалення) працює', () => {
>   const sparse: Row[] = [2, 5, 6, 9, 14].map((id) => ({ id, title: `№${id}` }))
>   const first = paginate(sparse, 4, 2)
>   expect(ids(first)).toEqual([5, 6])
>   expect(first.nextCursor).toBe(6)
>   const second = paginate(sparse, first.nextCursor as number, 2)
>   expect(ids(second)).toEqual([9, 14])
>   expect(second.nextCursor).toBeNull()
> })
>
> test('limit 0 або відʼємний кидає RangeError', () => {
>   expect(() => paginate(rows, 0, 0)).toThrow(RangeError)
>   expect(() => paginate(rows, 0, -3)).toThrow(RangeError)
> })
> ```
>
>
> > [!hint]- Підказка 1
> > Спершу відфільтруй `rows` за `id > cursor`, лише потім рахуй сторінку: так дірки в `id` не заважають.
>
> > [!hint]- Підказка 2
> > Щоб знати, чи є рядки після сторінки, порівняй `rest.length` з `limit`. Перевірка `items.length < limit` не відрізнить «рівно limit лишилось» від «ще є».
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function paginate(rows: Row[], cursor: number, limit: number): Page {
> >   if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit має бути додатним цілим')
> >   const rest = rows.filter((r) => r.id > cursor)
> >   const items = rest.slice(0, limit)
> >   const nextCursor = rest.length > limit ? items[items.length - 1].id : null
> >   return { items, nextCursor }
> > }
> > ```
> >
> > Тому `listProductsPage` у реальному запиті часто бере `limit + 1` рядків: зайвий рядок лише показує, що наступна сторінка є, і не віддається клієнту. Курсорна пагінація не страждає від зсувів, які дає `OFFSET`, коли рядки додають чи видаляють між запитами.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) — ORM у Server Components, `use()`, бібліотеки в Client Components.
- 🟡 [Next.js — Client-side data fetching](https://nextjs.org/docs/app/guides/client-side-data-fetching) — коли бібліотека, три патерни, три шари кешу, мутації.
- 🟡 [Next.js — SWR](https://nextjs.org/docs/app/guides/client-side-data-fetching/swr) і [TanStack Query](https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query) — офіційні рецепти для App Router.
- 🟡 [Next.js — io](https://nextjs.org/docs/app/api-reference/functions/io) — синхронні джерела даних під Cache Components.
- 🟡 [Next.js — Data Security](https://nextjs.org/docs/app/guides/data-security) — Data Access Layer і DTO.
- 🟡 [Drizzle — Transactions](https://orm.drizzle.team/docs/transactions) і [Migrations](https://orm.drizzle.team/docs/migrations) — `db.transaction`, `drizzle-kit`.
- 🟡 [Prisma ORM 7 — Database connections](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections) — один клієнт, serverless, пулери.
- 🔴 [Vercel — Fluid compute](https://vercel.com/docs/fluid-compute) і [`attachDatabasePool`](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package) — конкурентність в інстансі і пули.
- 🔴 [Neon — Connection pooling](https://neon.com/docs/connect/connection-pooling) — PgBouncer у transaction mode і його обмеження.
- 🛠️ [TanStack Query — Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr) і [SWR — with Next.js](https://swr.vercel.app/docs/with-nextjs) — провайдери, гідратація, що можна імпортувати в RSC.

> [!important] Підсумок
> - До бази ходять лише Server Components, Server Actions і Route Handlers — через один модуль клієнта з `server-only` і шар даних, що повертає DTO з мінімального `select`.
> - Клієнт БД — один на процес: у `next dev` його тримають у `globalThis`, бо HMR перевиконує модуль і плодить пули.
> - У serverless зʼєднань = інстанси × розмір пулу. Ліки: пул у модулі, малий `max`, пулер (міграції — прямим рядком), HTTP-драйвер, Fluid Compute з `attachDatabasePool`.
> - Транзакція — в одній функції шару даних, усі запити через `tx`, перевірка — умовою в `UPDATE`, без мережевих викликів усередині. Локальна SQLite під `cacheComponents` потребує `await io()`, інакше дані застигнуть на момент збірки.
> - З браузера тягни лише живі, догружувані й залежні від вводу дані: SWR чи TanStack Query з провайдером-Client Component і початковими даними з сервера; для разового читання вистачить `use()`. `useEffect` + `fetch` для початкових даних — антипатерн.

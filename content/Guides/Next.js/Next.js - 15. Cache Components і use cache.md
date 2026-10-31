---
title: Cache Components і use cache
id: nextjs-core-15
slug: 15-use-cache
order: 15
level: senior
skill: data
icon: px:database
tags: [nextjs, use-cache, cache-components, cachelife, cachetag, cache-keys, serialization]
prerequisites: ["[[Next.js - 12. Partial Prerendering і Cache Components]]", "[[Next.js - 14. Дані на сервері]]"]
estimatedMinutes: 60
nextVersion: 16.3.8
---

# Cache Components і use cache

> [!success] 🎯 Після цього розділу ти зможеш
> - поставити `'use cache'` на рівні функції, компонента чи файлу й пояснити, чому для цієї задачі обрано саме такий рівень;
> - для будь-якого виклику передбачити hit чи miss: з чого складається ключ кешу (build id, function id, аргументи, замикання) і що робить його новим;
> - відрізнити аргументи, які проходять у кеш, від тих, що ламають збірку або тихо псуються, і прокинути `children` та Server Actions крізь кеш без впливу на ключ;
> - обрати профіль `cacheLife` (вбудований, власний у `next.config` чи inline), пояснити `stale`, `revalidate` і `expire` та передбачити час життя вкладених кешів;
> - позначити записи тегами `cacheTag`, щоб їх можна було ревалідувати (тема 16 основного посібника);
> - винести `cookies()` і `headers()` за межу кешу й передати всередину лише значення.

## 🤔 Передбач

> [!quiz] Скільки разів виконається тіло закешованих функцій?
> level: middle · type: output · id: nextjs-core-15-quiz-01
>
> Сторінка під `<Suspense>` читає `?slug=hat` і викликає дві закешовані функції. `next build && next start`, свіжий сервер, два запити поспіль з однаковим `?slug=hat`. Кожне виконання тіла пише одне звернення до БД.
>
> ```tsx
> async function getProduct(slug: string) {
>   'use cache'
>   return dbGetProduct(slug)
> }
>
> async function getProductByQuery(query: { slug: string }) {
>   'use cache'
>   return dbGetProduct(query.slug)
> }
>
> async function Product({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
>   const { slug = 'hat' } = await searchParams
>   await getProduct(slug)
>   await getProductByQuery({ slug }) // новий обʼєкт на кожен запит
>   return <p>ok</p>
> }
> ```
>
> Скільки звернень до БД буде на першому запиті і скільки на другому?
>
> - [x] Перший: 2 (по одному на функцію), другий: 0
> - [ ] Перший: 2, другий: 1 — `getProductByQuery` щоразу отримує новий обʼєкт, тож ключ новий
> - [ ] Перший: 1 (дві функції діляться записом, бо читають ті самі дані), другий: 0
> - [ ] Перший: 2, другий: 2 — `'use cache'` дедуплікує лише в межах одного запиту, як `React.cache`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Ключ складається з function ID та **серіалізованих** аргументів, а не з посилань, тож новий обʼєкт `{ slug }` з тими самими полями дає hit. Дві різні функції мають різні function ID й різні записи, навіть якщо читають однакові дані. А `'use cache'`, на відміну від `React.cache`, живе між запитами, тому другий запит нічого не рахує.

## 🧒 Простими словами

Уяви бюро перекладів з архівом. На замовлення перекладач спершу шукає папку з ярликом «цей документ + ця мова + ця редакція бюро». Є — клієнт одразу отримує копію. Немає — перекладач працює, а результат кладе в архів. Ярлик — це **ключ кешу**: зміни мову, і потрібна інша папка. На папці стоїть **термін**: доки копію віддають без перевірки, коли замовити свіжий переклад і коли папку викинути. Це `cacheLife`. Кольорові наліпки «юридичне», «клієнт 42» дозволяють разом оновити всі пов'язані папки — це `cacheTag`. А паспорт клієнта в архів не потрапляє: його показують на вході, і в замовлення записують лише потрібне значення. Так працюють `cookies()` і аргументи.

## 🔬 Як це працює насправді

### 🧭 Що робить use cache і чим він не є

У [[Next.js - 12. Partial Prerendering і Cache Components|темі 12 основного посібника]] `'use cache'` був варіантом «закешуй, і результат потрапить у static shell». Тепер — сам механізм. Це директива Next.js (не React), що працює лише з `cacheComponents: true`. Для тих самих вхідних даних тіло функції чи компонента виконується один раз, а результат зберігається й віддається повторно **між запитами**, доки запис живий.

Не плутай його з іншими «кешами»:

| Механізм | Що запамʼятовує | Скільки живе | Де |
|---|---|---|---|
| `fetch` memoization | відповідь GET з тим самим URL, методом і заголовками (опції кешу на кшталт `cache`/`next.revalidate` не враховуються) | один рендер-прохід | памʼять запиту |
| `React.cache(fn)` | результат виклику з тими самими аргументами | один запит | памʼять запиту |
| `'use cache'` | серіалізований результат функції чи компонента | за `cacheLife`, між запитами | cache handler (за замовчуванням — LRU у памʼяті процесу) |

Перші два — **дедуплікація** в межах одного рендера (тема 14 основного посібника). `'use cache'` — справжній кеш: запис наповнюється на `next build` (і стає частиною shell) або на першому запиті. Звідси дві вимоги: ключ має бути детермінованим, тож аргументи серіалізуються, а результат — однаковим для всіх з тим самим ключем, тож дані запиту всередину не пускають.

Типовий handler тримає записи в памʼяті **одного процесу** (ліміт `cacheMaxMemorySize`). На self-hosted сервері вони живуть між запитами, у serverless runtime-записи часто не переживають запит. Новий деплой не переживає жоден запис: ключ містить build id. `'use cache: remote'`, `'use cache: private'` і `cacheHandlers` — тема 18 основного посібника.

> [!note] Чому в прикладах дані в памʼяті
> `lib/db.ts` у прикладах — «база» в памʼяті із затримкою 300 мс і лічильником звернень. Кожне звернення пише в лог `[db] …`, тож у виводі `next start` видно, де був hit, а де miss. Справжній драйвер поводиться так само: під `'use cache'` запит іде лише при промаху, а без кешу читання потребує `<Suspense>` (теми 11–12 основного посібника).

```ts
// lib/db.ts — «база» в памʼяті з затримкою й лічильником звернень
import 'server-only'

const products: Record<string, { name: string; price: number }> = {
  hat: { name: 'Капелюх', price: 900 },
  shoes: { name: 'Черевики', price: 2400 },
}

let calls = 0

export async function dbGetProduct(slug: string) {
  calls++
  console.log(`[db] product ${slug} (звернення №${calls})`)
  await new Promise((r) => setTimeout(r, 300))
  return { slug, ...products[slug], readAt: new Date().toISOString() }
}
```

### 📍 Три рівні: функція, компонент, файл

Директива стоїть **першим рядком тіла** функції або **першим рядком файлу** (як `'use client'`). Закешована функція мусить бути `async`, бо результат може прийти зі сховища.

**Рівень функції — кеш даних.** Найчастіший варіант: кешується результат запиту до БД чи API, і всі компоненти та сторінки, що викликають функцію, ділять запис.

```ts
// lib/catalog.ts — функція даних з 'use cache'
import { cacheLife, cacheTag } from 'next/cache'
import { dbGetProduct } from './db'

export async function getProduct(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products', `product-${slug}`)
  return dbGetProduct(slug)
}
```

**Рівень компонента — кеш UI.** Кешується відрендерений результат разом з усім, що компонент чекав усередині; ключем стають props. Для важких блоків на кшталт «топ товарів».

```tsx
// app/levels/page.tsx — три рівні: файл, компонент, функція
import { cacheLife } from 'next/cache'
import { getTopProducts, getProductCount } from '@/lib/reports' // рівень файлу
import { getProduct } from '@/lib/catalog' // рівень функції

// рівень компонента
async function TopList() {
  'use cache'
  cacheLife('hours')
  const top = await getTopProducts()
  return <ol>{top.map((p) => <li key={p.slug}>{p.name}</li>)}</ol>
}

export default async function LevelsPage() {
  const count = await getProductCount()
  const hat = await getProduct('hat')
  return (
    <main>
      <h1>Товарів: {count}</h1>
      <p>{hat.name}</p>
      <TopList />
    </main>
  )
}
```

**Рівень файлу — усі експорти.** Директива першим рядком модуля робить закешованою **кожну експортовану функцію**, і кожна з них мусить бути `async`:

```ts
// lib/reports.ts — 'use cache' на рівні файлу: кешуються всі експорти
'use cache'

import { cacheLife } from 'next/cache'
import { dbGetFeatured } from './db'

export async function getTopProducts() {
  cacheLife('days')
  const items = await dbGetFeatured()
  return items.sort((a, b) => b.price - a.price)
}

export async function getProductCount() {
  cacheLife('days')
  return (await dbGetFeatured()).length
}
```

Синхронний експорт у такому файлі зупиняє компіляцію тією ж помилкою, що й синхронна функція з директивою:

```text
Error: "use cache" functions must be async functions.
```

`page.tsx` і `layout.tsx` теж модулі. Кожен сегмент — окремий запис, тож для маршруту цілком директива потрібна в кожному файлі (page, layout, слоти parallel routes). Закешований layout **не** кешує свої `children`: вони проходять крізь нього як «дірка» (див. [[#🧳 Що можна передати в кеш|аргументи]]).

```tsx
// app/legal/page.tsx — 'use cache' на рівні файлу сторінки
'use cache'

import { cacheLife } from 'next/cache'

export default async function LegalPage() {
  cacheLife('max')
  return <article>Умови користування (зібрано {new Date().toISOString()})</article>
}
```

`new Date()` у кеш-скоупі легальний: він фіксується на момент наповнення запису. У таблиці збірки — `○ /legal  30d  1y`, профіль `max`.

Як обрати рівень:

| Ситуація | Рівень | Чому |
|---|---|---|
| Ті самі дані потрібні в кількох місцях (товар у картці, хлібних крихтах, metadata) | функція | один запис на всіх, UI не залежить від кешу |
| Важкий блок UI з однаковим для всіх результатом | компонент | кешується й розмітка, і всі запити всередині |
| Модуль звітів чи довідників, де кешується кожна функція | файл | не повторювати директиву; але кожен експорт мусить бути `async` |
| Сторінка без персонального вмісту (умови, «про нас») | файл `page.tsx` | маршрут цілком у shell |

Починай з рівня функції: він найменше залежить від UI і найпростіше тегується.

> [!quiz] Перевір себе: куди поставити директиву
> level: middle · type: single · id: nextjs-core-15-quiz-02
>
> Один товар показують картка `ProductCard`, хлібні крихти `Breadcrumbs` і `generateMetadata`. Розмітка в усіх трьох різна, а дані однакові для всіх відвідувачів. Де поставити `'use cache'`, щоб при першому запиті було одне звернення до БД?
>
> - [x] На функцію даних `getProduct(slug)`, яку викликають усі три
> - [ ] На `page.tsx` першим рядком файлу: сторінка закешується, а отже й усе, що в ній
> - [ ] На кожен із трьох споживачів окремо: `ProductCard`, `Breadcrumbs`, `generateMetadata`
> - [ ] Ніде: для однакових даних достатньо `React.cache(getProduct)`
>
> **Пояснення:** функція даних дає один запис на всіх споживачів, а UI навколо лишається звичайним. Директива на `page.tsx` кешує лише сам сегмент: `generateMetadata` до нього не входить, а розмітка зайве потрапляє в запис. Три окремі директиви — це три function ID, три записи й три звернення до БД. `React.cache` дедуплікує тільки в межах одного запиту, тож наступний відвідувач знову піде в БД.

### 🔑 Ключ кешу: коли hit, а коли miss

Ключ запису складається з чотирьох частин (`use-cache.md#cache-keys`):

1. **Build ID** (або `deploymentId`) — новий деплой дає нові ключі.
2. **Function ID** — хеш **місця й сигнатури** функції. Дві різні функції — різні записи, навіть з тими самими даними.
3. **Серіалізовані аргументи** — аргументи функції або props компонента.
4. **HMR refresh hash** — лише в `next dev`: правка файлу скидає кеш.

Плюс **замикання**: змінні зовнішнього скоупу, які читає функція, Next.js передає як приховані аргументи, тож вони теж у ключі.

На практиці: сторінка під Suspense читає `?slug=` і викликає дві закешовані функції; друга приймає обʼєкт, створений заново на кожен запит:

```ts
// lib/catalog.ts — друга функція: аргумент-обʼєкт
export async function getProductByQuery(query: { slug: string }) {
  'use cache'
  cacheLife('hours')
  return dbGetProduct(query.slug)
}
```

```tsx
// app/keys/page.tsx — ключ кешу = аргументи
import { Suspense } from 'react'
import { getProduct, getProductByQuery } from '@/lib/catalog'

export default function KeysPage({ searchParams }: PageProps<'/keys'>) {
  return (
    <main>
      <h1>Ключі кешу</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Product searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function Product({ searchParams }: { searchParams: PageProps<'/keys'>['searchParams'] }) {
  const { slug = 'hat' } = await searchParams
  const s = String(slug)
  const a = await getProduct(s)
  const b = await getProductByQuery({ slug: s }) // новий обʼєкт щоразу
  return (
    <ul>
      <li id="a">{a.name}: {a.readAt}</li>
      <li id="b">{b.name}: {b.readAt}</li>
      <li id="now">render: {new Date().toISOString()}</li>
    </ul>
  )
}
```

`next build && next start`, три запити: `?slug=hat`, ще раз `?slug=hat`, потім `?slug=shoes`. Лог сервера:

```text
[db] product hat (звернення №1)
[db] product hat (звернення №2)
[db] product shoes (звернення №3)
[db] product shoes (звернення №4)
```

Перший запит: дві функції — два записи й два звернення (різний function ID). Другий — **нуль** звернень, змінився лише `render:`: новий обʼєкт `{ slug }` дав той самий ключ, бо ключ будується з **серіалізованого значення**, а не з посилання. Третій, з іншим `slug`, — знову два промахи.

Серіалізація точна до дрібниць, і це варто знати напамʼять:

```ts
// app/closure/page.tsx — форма аргументів у ключі (фрагмент)
await getLabel({ slug: 'hat', currency: 'UAH' })
await getLabel({ currency: 'UAH', slug: 'hat' }) // ті самі поля, інший порядок
await getById(1)
await getById('1')
```

```text
[getLabel] {"slug":"hat","currency":"UAH"} (виконання №1)
[getLabel] {"currency":"UAH","slug":"hat"} (виконання №2)
[getById] number 1
[getById] string 1
```

**Порядок полів обʼєкта входить у ключ**, і `1` та `'1'` — різні ключі. Тому аргументи нормалізують **до** виклику: один формат id, однаковий порядок полів, мінімум даних.

Тепер замикання. Внутрішня функція читає `currency` з props батька:

```tsx
// app/closure/page.tsx — внутрішня функція захоплює currency
async function Price({ currency }: { currency: string }) {
  async function format(amount: number) {
    'use cache'
    cacheLife('hours')
    console.log(`[format] ${amount} ${currency}`)
    return `${amount} ${currency}`
  }
  return <p>{await format(900)}</p>
}
```

Запити з `?cur=UAH`, ще раз `?cur=UAH` і `?cur=EUR` дають у лозі `[format] 900 UAH` і `[format] 900 EUR`: по одному виконанню на валюту: аргумент `900` однаковий, але захоплена `currency` — частина ключа. Інакше кеш віддав би гривні тому, хто просив євро.

> [!diagram] Виклик закешованої функції: ключ, hit і miss
> ```yaml
> layout: flow
> nodes:
>   - { id: call, label: "виклик", code: "getProduct('hat')", tone: gray, icon: "px:bolt" }
>   - { id: key, label: "ключ", text: "build id + function id\n+ ['hat'] + замикання", tone: violet, icon: "px:key" }
>   - { id: store, label: "cache handler", text: "LRU у памʼяті процесу", note: "запис живе за cacheLife", tone: blue, icon: "px:database" }
>   - { id: body, label: "тіло функції", code: "return dbGetProduct(slug)", note: "лише при промаху", tone: orange }
>   - { id: out, label: "результат", text: "{ name: 'Капелюх', … }", tone: green, icon: "px:check" }
> edges:
>   - { from: call, to: key, label: "серіалізація" }
>   - { from: key, to: store, label: "пошук" }
>   - { from: store, to: body, label: "miss" }
>   - { from: body, to: out, label: "записати й повернути" }
> steps:
>   - { focus: call, note: "Компонент викликає getProduct('hat'). Для коду це звичайний await, але функція позначена 'use cache'." }
>   - { move: { from: call, to: key, value: "['hat']" }, note: "Next.js серіалізує аргументи й захоплені змінні та додає build id і function id. Новий обʼєкт з тими самими полями в тому самому порядку дасть той самий ключ." }
>   - { move: { from: key, to: store, value: "key" }, note: "Пошук у cache handler. Якщо живий запис є — це hit: тіло не виконується, результат повертається одразу." }
>   - { move: { from: store, to: body, value: "miss" }, line: "body:1", note: "Запису немає або він протермінувався. Тіло виконується: у лозі зʼявляється [db] product hat." }
>   - { move: { from: body, to: out, value: "Капелюх" }, note: "Результат серіалізується, зберігається під ключем і повертається. Наступний виклик з тим самим ключем — hit." }
> ```
> Інший `slug`, інший порядок полів, інша захоплена змінна чи новий деплой — інший ключ, а отже новий промах.

Ще два спостереження. **Записи з `next build` не переходять у памʼять `next start`**: `getProduct('hat')` виконався під час пререндеру `/tags`, але перший runtime-запит `/keys?slug=hat` усе одно пішов у «базу» — пререндер зберігає HTML, а не записи функцій. А **в межах `next build` запис спільний для сторінок**: `/levels` і `/tags` дали одне звернення на двох.

> [!quiz] Скільки виконань у лозі: порядок полів і тип id
> level: senior · type: output · id: nextjs-core-15-quiz-03
>
> Сторінка під `<Suspense>`, `next build && next start`, свіжий сервер. Тіло кожної функції пише один рядок у лог.
>
> ```tsx
> async function getLabel(opts: { slug: string; currency: string }) {
>   'use cache'
>   console.log('[getLabel]', JSON.stringify(opts))
>   return `${opts.slug} ${opts.currency}`
> }
>
> async function getById(id: number | string) {
>   'use cache'
>   console.log('[getById]', typeof id, id)
>   return String(id)
> }
>
> // у компоненті, на кожен запит:
> await getLabel({ slug: 'hat', currency: 'UAH' })
> await getLabel({ currency: 'UAH', slug: 'hat' })
> await getById(1)
> await getById('1')
> ```
>
> Скільки рядків зʼявиться в лозі на першому запиті і скільки на другому такому самому?
>
> - [x] Перший: 4, другий: 0
> - [ ] Перший: 2, другий: 0 — порядок полів обʼєкта й тип id для ключа неважливі
> - [ ] Перший: 3, другий: 0 — порядок полів неважливий, а `1` і `'1'` різні
> - [ ] Перший: 4, другий: 4 — запис не переживає запит
>
> **Пояснення:** ключ будується із серіалізованого значення, тому **порядок полів входить у ключ**, а `1` та `'1'` серіалізуються по-різному. Усі чотири виклики мають різні ключі, звідси чотири виконання. Другий запит збігається з першим за значеннями, тож жодне тіло не виконується. Практичний висновок: аргументи нормалізують до виклику.

> [!quiz] Що буде в лозі: замикання в ключі
> level: senior · type: output · id: nextjs-core-15-quiz-04
>
> Сторінка під `<Suspense>`, `next build && next start`, свіжий сервер. Компонент `Price` отримує `currency` з `?cur=`.
>
> ```tsx
> async function Price({ currency }: { currency: string }) {
>   async function format(amount: number) {
>     'use cache'
>     console.log(`[format] ${amount} ${currency}`)
>     return `${amount} ${currency}`
>   }
>   return <p>{await format(900)}</p>
> }
> ```
>
> Підряд приходять запити `?cur=UAH`, `?cur=UAH`, `?cur=EUR`. Що буде в лозі?
>
> - [x] `[format] 900 UAH`, потім `[format] 900 EUR`
> - [ ] Лише `[format] 900 UAH`: аргумент `900` однаковий, тож третій запит візьме гривні з кешу
> - [ ] Три рядки: `UAH`, `UAH`, `EUR` — замикання ламають кеш, і він не працює
> - [ ] Помилка збірки: закешована функція не може читати змінні із зовнішнього скоупу
>
> **Пояснення:** змінні, які закешована функція читає із замикання, Next.js захоплює й передає як приховані аргументи, тож вони входять у ключ. `UAH` і `EUR` — різні ключі, а другий запит з `UAH` дає hit. Інакше кеш віддав би гривні тому, хто просив євро. Читати замикання можна, збірка на це не скаржиться.

### 🧳 Що можна передати в кеш

Аргументи й результат серіалізуються **за різними правилами** (`use-cache.md#serialization`): аргументи — за суворішими правилами аргументів Server Functions, результат — за правилами props Client Components, тому з кешу можна повернути JSX.

| Аргументи | Результат |
|---|---|
| примітиви: `string`, `number`, `boolean`, `null`, `undefined` | усе, що й для аргументів |
| прості обʼєкти, масиви | + JSX-елементи |
| `Date`, `Map`, `Set`, `TypedArray`, `ArrayBuffer` | |
| React-елементи й Server Actions — **лише pass-through** | |

Не підтримуються: екземпляри класів, функції (крім pass-through), `Symbol`, `WeakMap`, `WeakSet`, `URL`. `Date`, `Map` і `Set` усередині справжні: `args.at.toISOString()` працює.

А непідтримуване ламається з оманливими повідомленнями:

```tsx
// ❌ екземпляр класу як аргумент
class Money {
  constructor(public amount: number, public currency: string) {}
}

async function formatMoney(m: Money) {
  'use cache'
  return `${m.amount} ${m.currency}`
}
```

```text
Error: Cannot access amount on the server. You cannot dot into a temporary client reference
from a server component. You can only pass the value through to the client.
```

Нічого клієнтського тут немає: несеріалізоване значення React замінює непрозорим посиланням, яке можна лише передати далі. Так само падає `Symbol('sale')`, а виклик функції-аргументу — з `Attempted to call a temporary Client Reference from the server…`. Усі три ловить `next build`.

> [!warning] URL не падає, а тихо стає рядком
> [use cache → Unsupported types](https://nextjs.org/docs/app/api-reference/directives/use-cache#unsupported-types) зараховує `URL` до непідтримуваних. На 16.3.8 збірка з `getHost(new URL('https://example.com/a'))` проходить, але всередину приходить **рядок**: `typeof url === 'string'`, `url instanceof URL === false`, `url.host === undefined`. Помилки немає, є неправильні дані. Передавай `url.href` чи потрібні частини явно.

**Pass-through.** Несеріалізоване значення можна прийняти, **якщо не зазирати всередину**. Перша композиція — `children` та інші JSX-слоти:

```tsx
// app/children/page.tsx — pass-through: children не входять у ключ
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'

async function CachedShell({ children }: { children: React.ReactNode }) {
  'use cache'
  cacheLife('hours')
  return (
    <section>
      <header id="shell">Шапка закешована о {new Date().toISOString()}</header>
      {children}
    </section>
  )
}

async function Greeting() {
  const name = (await cookies()).get('name')?.value ?? 'гість'
  return <p id="greet">Привіт, {name}! ({new Date().toISOString()})</p>
}

export default function ChildrenPage() {
  return (
    <CachedShell>
      <Suspense fallback={<p>Вітаємося…</p>}>
        <Greeting />
      </Suspense>
    </CachedShell>
  )
}
```

Запити з cookie `name=Оля` і `name=Петро` дають той самий час збірки в шапці й різні привітання. Шапка — у shell (`◐ /children  1h  1d`), `Greeting` — дірка. `children` не входять у ключ: для кешу це непрозоре посилання, і `isValidElement(children)` усередині повертає `false`. Тож вирішувати, що рендерити, за `children` у кеші не вийде — це роблять зовні й передають серіалізоване значення.

Друга — **Server Action крізь кеш**: картка передає дію в клієнтську кнопку, не викликаючи її:

```tsx
// app/action/page.tsx — Server Action крізь закешований компонент
import { cacheLife } from 'next/cache'
import { LikeButton } from './like-button'

async function CachedCard({ like }: { like: () => Promise<void> }) {
  'use cache'
  cacheLife('days')
  // like не викликаємо й не читаємо — лише передаємо далі
  return (
    <article>
      <h2>Стаття дня</h2>
      <LikeButton action={like} />
    </article>
  )
}

export default function ActionPage() {
  async function like() {
    'use server'
    console.log('[like] виконалась на сервері')
  }
  return <CachedCard like={like} />
}
```

```tsx
// app/action/like-button.tsx
'use client'

export function LikeButton({ action }: { action: () => Promise<void> }) {
  return <button onClick={() => action()}>Подобається</button>
}
```

`○ /action  1d  1w`: дія — посилання, як у [[Next.js - 07. Server і Client Components#🧳 Що можна передати через межу|темі 07 основного посібника]], і кеш його лише переносить.

> [!quiz] Перевір себе: які аргументи пройдуть у кеш коректно
> level: senior · type: multi · id: nextjs-core-15-quiz-05
>
> Закешована функція чи компонент отримує аргумент. Познач ті варіанти, які працюють **коректно**: без помилки й без тихого спотворення.
>
> - [x] `Date`: усередину приходить справжній `Date`, `toISOString()` працює
> - [x] `Map<string, number>`: усередині працює `.get('hat')`
> - [x] Простий обʼєкт з масивом: `{ filters: ['a', 'b'] }`
> - [x] `children` закешованої обгортки, якщо їх лише рендерять у розмітці
> - [ ] Екземпляр `class Money`, з якого читають `m.amount`
> - [ ] `new URL(href)`, з якого читають `url.host`
> - [ ] Колбек `onDone`, який закешована функція викликає всередині
> - [ ] `children`, які закешована обгортка перевіряє через `isValidElement(children)`
>
> **Пояснення:** `Date`, `Map`, `Set`, прості обʼєкти й масиви серіалізуються як аргументи. Клас падає з `Cannot access amount on the server… temporary client reference`, функцію, яку викликають, зупиняє `Attempted to call a temporary Client Reference`. `URL` не падає: усередину приходить **рядок**, і `url.host` дорівнює `undefined`, тож це найпідступніший варіант. `children` проходять як pass-through, а `isValidElement` усередині кешу дає `false`, бо це непрозоре посилання.

### ⏳ cacheLife: stale, revalidate, expire

`cacheLife` задає час життя запису й викликається **лише всередині** кеш-скоупу: на рівні модуля чи в компоненті без директиви — `` `cacheLife()` can only be called inside a "use cache" function. `` Профіль — три числа в секундах:

- **`stale`** — скільки **браузер** (Client Cache роутера) бере результат без запиту. Передається заголовком `x-nextjs-stale-time`, мінімум **30 секунд**, щоб prefetch не протух до кліку.
- **`revalidate`** — через скільки **сервер** вважає запис застарілим; для пререндереного маршруту далі діє stale-while-revalidate.
- **`expire`** — максимальний вік: після нього наступний запит **чекає** на свіже значення. Мусить бути більшим за `revalidate`, інакше збірка падає: `If providing both the revalidate and expire options, the expire option must be greater than the revalidate option.`

Вбудовані профілі (`cacheLife.md#preset-cache-profiles`):

| Профіль | `stale` | `revalidate` | `expire` | Для чого |
|---|---|---|---|---|
| `default` | 5 хв | 15 хв | ніколи | стандартний вміст; діє, коли `cacheLife` не викликано |
| `seconds` | 30 с | 1 с | 1 хв | майже реальний час |
| `minutes` | 5 хв | 1 хв | 1 год | стрічки, новини |
| `hours` | 5 хв | 1 год | 1 день | склад, погода |
| `days` | 5 хв | 1 день | 1 тиждень | статті блогу |
| `weeks` | 5 хв | 1 тиждень | 30 днів | подкасти, розсилки |
| `max` | 5 хв | 30 днів | 1 рік | юридичні сторінки, архів |

У таблиці `next build` профіль `default` видно як `15m  1y`, а `max` — як `30d  1y`.

`cacheLife` приймає й **inline-обʼєкт**; пропущені поля успадковуються від `default`. Повторюваний профіль оголошують **у `next.config`**:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    // власний профіль: перевіряємо SWR за 10 секунд
    tenSeconds: { stale: 30, revalidate: 10, expire: 3600 },
  },
}

export default nextConfig
```

Типи `cacheLife('…')` генеруються з конфігу на `next dev`, `next build` або `next typegen`, тож до першого запуску TypeScript назви `tenSeconds` не знає. Вбудований профіль можна **перевизначити**; перевизначений `default` змінить кожен `'use cache'` без `cacheLife`, тому таке рішення документують.

> [!quiz] Перевір себе: власний профіль cacheLife
> level: middle · type: fill · bank: experimental, hours, remote · id: nextjs-core-15-quiz-06
>
> ```ts fill
> // next.config.ts
> import type { NextConfig } from 'next'
>
> const nextConfig: NextConfig = {
>   cacheComponents: true,
>   [[cacheLife]]: {
>     editorial: { stale: 300, revalidate: 600, [[expire]]: 86400 },
>   },
> }
>
> export default nextConfig
> ```
>
> ```ts fill
> // lib/articles.ts
> import { cacheLife } from 'next/cache'
> import { dbGetProduct } from './db'
>
> export async function getArticle(slug: string) {
>   [['use cache'|"use cache"]]
>   cacheLife('[[editorial]]')
>   return dbGetProduct(slug)
> }
> ```
>
> **Пояснення:** профілі оголошують у ключі `cacheLife` верхнього рівня конфігу (не в `experimental`), а в самому профілі обовʼязково `expire` більший за `revalidate`. Директива йде першим рядком тіла функції, а `cacheLife` викликають усередині кеш-скоупа: поза ним збірка падає з `` `cacheLife()` can only be called inside a "use cache" function. ``. Типи назв профілів генеруються з конфігу під час `next dev`, `next build` або `next typegen`.

Тепер подивимося, як ці числа поводяться наживо. Сторінка з профілем `tenSeconds`:

```tsx
// app/swr/page.tsx — stale-while-revalidate на власному профілі
import { cacheLife } from 'next/cache'

async function getRate() {
  'use cache'
  cacheLife('tenSeconds')
  console.log('[getRate] обчислюю', new Date().toISOString())
  await new Promise((r) => setTimeout(r, 500))
  return { usd: 41.5, at: new Date().toISOString() }
}

export default async function SwrPage() {
  const rate = await getRate()
  return <p id="rate">USD {rate.usd} @ {rate.at}</p>
}
```

`next build` показує `○ /swr  10s  1h`: маршрут статичний, але живе не довше за свій кеш. `next start`, запити з інтервалами:

```text
21:04:17  @ 21:04:07.959Z   x-nextjs-cache: HIT
21:04:17  @ 21:04:07.959Z   x-nextjs-cache: HIT
21:04:28  @ 21:04:07.959Z   x-nextjs-cache: STALE   ← старе значення, перерахунок у фоні
21:04:29  @ 21:04:29.016Z   x-nextjs-cache: HIT     ← уже свіже
```

Через 10 секунд перший запит **миттєво** отримав старе (`STALE`) і запустив `[getRate] обчислюю`, а наступний — уже нове. Відповідь містить `x-nextjs-stale-time: 30` (той самий `stale`) і `Cache-Control: s-maxage=10, stale-while-revalidate=3590`, де 3590 = `expire − revalidate`. Як цей заголовок використовують CDN — тема 17 основного посібника.

> [!diagram] Життя запису з профілем { stale: 30, revalidate: 10, expire: 3600 }
> ```yaml
> layout: timeline
> nodes:
>   - { id: t0, at: "0 с", label: "next build", text: "запис наповнено", note: "результат у static shell", tone: green, icon: "px:database" }
>   - { id: t5, at: "5 с", label: "запит", text: "HIT", note: "запис свіжий, тіло не виконується", tone: green }
>   - { id: t11, at: "11 с", label: "запит", text: "STALE", note: "одразу старе + перерахунок у фоні", tone: yellow, icon: "px:hourglass" }
>   - { id: t12, at: "12 с", label: "запит", text: "HIT (нове)", note: "фоновий перерахунок встиг", tone: green }
>   - { id: t1h, at: "> 1 год без запитів", label: "запит", text: "чекає", note: "expire минув: рендер на запит", tone: orange }
>   - { id: cl, at: "у браузері", label: "Client Cache", text: "30 с без запиту", note: "stale, мінімум 30 с", tone: blue, icon: "px:monitor" }
> steps:
>   - { show: t0, note: "На next build getRate() виконується, і його результат стає частиною HTML маршруту." }
>   - { show: t5, note: "До 10 секунд запис свіжий: сервер віддає готовий HTML, getRate не викликається." }
>   - { show: t11, note: "revalidate минув. Користувач НЕ чекає: отримує старе значення, а сервер у фоні перераховує запис." }
>   - { show: t12, note: "Наступний запит отримує вже нове значення. Це stale-while-revalidate." }
>   - { show: t1h, note: "Якщо запитів не було довше за expire, старе віддавати не можна: наступний запит чекає на свіжий рендер." }
>   - { show: cl, note: "stale керує не сервером, а роутером у браузері: стільки секунд переходи беруть результат із памʼяті без запиту." }
> ```
> `revalidate` і `expire` — серверний бік, `stale` — браузерний.

> [!quiz] Перевір себе: життя запису в next start
> level: senior · type: order · id: nextjs-core-15-quiz-07
>
> Маршрут з `cacheLife({ stale: 30, revalidate: 10, expire: 3600 })`, пререндерений на збірці, працює під `next start`. Склади послідовність подій.
>
> ```order
> next build наповнює запис, і результат стає частиною HTML маршруту
> Запит на 5-й секунді: HIT, тіло функції не виконується
> Запит на 11-й секунді: STALE, користувач одразу отримує старе значення
> Сервер у фоні перераховує запис
> Запит на 12-й секунді: HIT, уже з новим значенням
> Запит на 11-й секунді чекає, доки закінчиться перерахунок ✗
> ```
>
> **Пояснення:** до `revalidate` запис свіжий і віддається як `HIT`. Після нього пререндерений маршрут працює за схемою stale-while-revalidate: перший запит **не чекає**, отримує старе з `x-nextjs-cache: STALE`, а перерахунок іде у фоні. Наступний запит бачить нове значення. Чекати доведеться лише тоді, коли минув `expire`. Останній рядок описує саме цю помилкову поведінку.

Але SWR тут — властивість **пререндереного маршруту**. Сторінка `/life` під Suspense кешує `getProductShort(slug)` з `cacheLife({ stale: 30, revalidate: 3, expire: 8 })`:

```text
21:05:06  0.31 с  readAt 21:05:07   ← miss
21:05:08  0.01 с  readAt 21:05:07   ← hit
21:05:11  0.31 с  readAt 21:05:11   ← revalidate минув: чекали, отримали нове
21:05:22  0.31 с  readAt 21:05:22   ← expire минув: чекали, отримали нове
```

> [!warning] Runtime-записи in-memory handler не мають stale-while-revalidate за часом
> [cacheLife → revalidate](https://nextjs.org/docs/app/api-reference/functions/cacheLife#revalidate) обіцяє: після `revalidate` сервер віддає закешоване одразу й оновлює у фоні. На 16.3.8 у `next start` так поводиться пререндерений маршрут (`x-nextjs-cache: STALE`). А запис `'use cache'`, наповнений під час запиту (у дірці під Suspense), після `revalidate` вважається відсутнім: запит **чекає** на нове виконання. Коментар у типовому handler (`next/dist/server/lib/cache-handlers/default.js`) пояснює це навмисно: in-memory записи крихкі, і прогрівати їх у фоні немає сенсу. Це стосується лише старіння **за часом**: після `revalidateTag(tag, 'max')` такі записи віддаються застарілими й оновлюються у фоні (тема 16 основного посібника). `next dev` навпаки тримає застарілі записи до `expire`. Тому час життя перевіряй лише в `next build && next start`.

### 🚦 Короткий кеш і static shell

Профіль визначає й те, **де** опиниться результат (`cacheLife.md#prerendering-behavior`):

| Профіль | Куди потрапляє результат |
|---|---|
| `revalidate: 0` або `expire` < 5 хв | не пререндериться: «динамічна дірка», рахується на запит (потрібен `<Suspense>`) |
| `stale` < 30 с | не пререндериться: prefetch протух би до кліку |
| 30 с ≤ `stale` < 5 хв | у пререндері, але не в App Shell (його бере prefetch) |
| інакше | у static shell |

З вбудованих під поріг потрапляє лише `seconds` (`expire` 1 хвилина): такий компонент стає діркою під `<Suspense>`.

А **маршрут живе не довше за найкоротший кеш у своєму shell**: `/tags` з `getFeatured` (`days`) і `getProduct` (`hours`) отримує `1h  1d`. Що таке App Shell і prefetch — у [[Next.js - 12. Partial Prerendering і Cache Components#🧱 Ментальна модель: кешоване, статичне або за Suspense|темі 12 основного посібника]].

### 🪆 Вкладені кеші

Коли кеш усередині кешу, чий час життя переможе? Залежить від того, чи має **зовнішній** явний `cacheLife` (`cacheLife.md#nested-caching-behavior`). Три сторінки з `Widget` усередині закешованої `Page`:

```tsx
// app/nested-default/page.tsx — зовнішній кеш без cacheLife
import { cacheLife } from 'next/cache'

async function Widget() {
  'use cache'
  cacheLife('minutes') // revalidate 1 хв, expire 1 год
  return <p>Віджет {new Date().toISOString()}</p>
}

export default async function Page() {
  'use cache'
  // cacheLife немає → default (15 хв), але внутрішній 'minutes' коротший
  return (
    <main>
      <h1>Дашборд</h1>
      <Widget />
    </main>
  )
}
```

```text
Route (app)           Revalidate  Expire
├ ○ /nested-default           1m      1h    ← зовні без cacheLife, Widget: 'minutes'
├ ○ /nested-explicit          1d      1w    ← зовні cacheLife('days'), Widget: 'minutes'
├ ○ /nested-long             15m      1w    ← зовні без cacheLife, Widget: 'days'
```

Правила:

- **Явний зовнішній `cacheLife` перемагає завжди.** `/nested-explicit` живе добу, віддаючи «застиглий» віджет, доки не перерахується зовнішній запис.
- **Без явного зовнішнього** діє `default`, і внутрішні можуть його лише **скоротити**: `minutes` дав `/nested-default` `1m / 1h`, а `days` не продовжив `revalidate`, але його тижневий `expire` став межею (`/nested-long` — `15m / 1w`).

Тому — **явний `cacheLife` у кожному кеш-скоупі**. А **короткоживучий** кеш (`expire` < 5 хв) усередині кешу без явного `cacheLife` Next.js не пропускає, бо зовнішній мовчки став би діркою:

```text
Error: A "use cache" with short `expire` (under 5 minutes) is nested inside another "use cache" that
has no explicit `cacheLife`, which is not allowed during prerendering. Add `cacheLife()` to the outer
"use cache" to choose whether it should be prerendered (with longer `expire`) or remain dynamic
(with short `expire`).
  [cause]: Nested dynamic "use cache": This "use cache" has a dynamic cache life that was propagated
  to its parent.
```

Виправлення — свідомий вибір у зовнішньому кеші: `cacheLife('default')` чи довший, щоб лишитися в shell, або `cacheLife('seconds')` і `<Suspense>`.

> [!quiz] Що покаже таблиця next build: вкладені кеші
> level: senior · type: output · id: nextjs-core-15-quiz-08
>
> Три маршрути. У кожному закешована `Page` рендерить закешований `Widget`. Профілі:
>
> | Маршрут | `Page` | `Widget` |
> |---|---|---|
> | `/a` | `'use cache'` без `cacheLife` | `cacheLife('minutes')` |
> | `/b` | `'use cache'` + `cacheLife('days')` | `cacheLife('minutes')` |
> | `/c` | `'use cache'` без `cacheLife` | `cacheLife('days')` |
>
> Нагадаємо: `default` = 15 хв / ніколи, `minutes` = 1 хв / 1 год, `days` = 1 день / 1 тиждень. Що покаже `next build` у колонках `Revalidate` та `Expire`?
>
> - [x] `/a`: 1m 1h, `/b`: 1d 1w, `/c`: 15m 1w
> - [ ] `/a`: 15m 1y, `/b`: 1d 1w, `/c`: 1d 1w — вкладені кеші на зовнішній не впливають, а довший внутрішній його продовжує
> - [ ] `/a`: 1m 1h, `/b`: 1m 1h, `/c`: 15m 1y — завжди перемагає найкоротший, а довший внутрішній ігнорується
> - [ ] `/a`: 1m 1h, `/b`: 1d 1w, `/c`: 1d 1w — довший внутрішній `days` продовжує неявний зовнішній
>
> **Пояснення:** явний `cacheLife` зовнішнього кешу (`/b`) перемагає завжди. Без нього діє `default`, а вкладені кеші можуть його лише **скоротити**: `minutes` стискає `/a` до `1m / 1h`. На `/c` `days` не продовжує `revalidate` понад 15 хвилин, але його `expire` (тиждень) коротший за «ніколи» з `default`, тож виходить `15m / 1w`.

### 🏷️ cacheTag: мітки для ревалідації

Для оновлення «за подією» (адмін змінив ціну) запис треба вміти знайти. `cacheTag` вішає на нього рядкові теги:

```ts
// lib/catalog.ts (фрагмент)
export async function getProduct(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products', `product-${slug}`) // загальний тег + тег сутності
  return dbGetProduct(slug)
}
```

Теги можна будувати **з даних**: `cacheTag` викликається будь-де в тілі:

```tsx
// app/tags/page.tsx — теги на записі кешу
import { getProduct } from '@/lib/catalog'
import { cacheLife, cacheTag } from 'next/cache'
import { dbGetFeatured } from '@/lib/db'

async function getFeatured() {
  'use cache'
  cacheLife('days')
  const items = await dbGetFeatured()
  // теги з даних: кожен товар у списку
  cacheTag('featured', ...items.map((p) => `product-${p.slug}`))
  return items
}

export default async function TagsPage() {
  const featured = await getFeatured()
  const hat = await getProduct('hat')
  return (
    <main>
      <h1>{hat.name}</h1>
      <ul>{featured.map((p) => <li key={p.slug}>{p.name}</li>)}</ul>
    </main>
  )
}
```

Пререндерена сторінка **збирає теги всіх кешів у своєму shell**. У `.next/server/app/tags.meta` після збірки:

```text
"x-next-cache-tags": "_N_T_/layout,_N_T_/tags/layout,_N_T_/tags/page,_N_T_/tags,featured,product-hat,product-shoes,products"
```

Тепер інвалідація `product-hat` зачепить і запис `getProduct('hat')`, і список `featured`, і HTML сторінки `/tags`. Теги `_N_T_` — «мʼякі» теги шляху для `revalidatePath`. Браузеру цей заголовок не віддається.

Обмеження (`cacheTag.md`): до 128 тегів на виклик, до 256 символів кожен; зайві відкидаються з попередженням у консолі. Повторний тег нічого не змінює. У зовнішніх handler-ах теги лежать відкритим текстом, тож email у тезі — витік.

Як скинути теговані записи — тема 16 основного посібника. Але **тег ставлять зараз**: без нього лишається тільки чекати на `cacheLife`.

> [!quiz] Яких записів торкнеться тег product-hat
> level: senior · type: single · id: nextjs-core-15-quiz-09
>
> ```tsx
> async function getFeatured() {
>   'use cache'
>   cacheLife('days')
>   const items = await dbGetFeatured() // містить hat і shoes
>   cacheTag('featured', ...items.map((p) => `product-${p.slug}`))
>   return items
> }
>
> async function getProduct(slug: string) {
>   'use cache'
>   cacheLife('hours')
>   cacheTag('products', `product-${slug}`)
>   return dbGetProduct(slug)
> }
>
> // app/tags/page.tsx: ○ у таблиці збірки
> export default async function TagsPage() {
>   const featured = await getFeatured()
>   const hat = await getProduct('hat')
>   /* … */
> }
> ```
>
> Теги вже поставлено. Які записи охопить інвалідація тегу `product-hat`?
>
> - [x] Запис `getProduct('hat')`, запис `getFeatured()` і HTML сторінки `/tags`
> - [ ] Лише запис `getProduct('hat')`: тег стоїть саме на ньому
> - [ ] Записи обох функцій, але не HTML `/tags`: сторінка живе за власним `cacheLife`
> - [ ] Нічого: теги діють лише на runtime-записи, а записи з `next build` скидає тільки `cacheLife`
>
> **Пояснення:** `getFeatured` теж отримав `product-hat`, бо теги будували з даних. А пререндерена сторінка збирає теги всіх кешів у своєму shell: у `.next/server/app/tags.meta` лежить `x-next-cache-tags` з усіма внутрішніми тегами та `_N_T_` шляху. Тому тег зачіпає й HTML. Записи з `next build` теж тегуються.

### 🚪 Дані запиту: зовні, а всередину значення

Якби кеш міг сам прочитати cookie, перший користувач «запік» би свою сесію в запис для всіх. Тому всередині `'use cache'` заборонені `cookies()`, `headers()`, `searchParams` і `connection()` (помилку `cookies()` ти бачив у темі 12 основного посібника). Нові тут дві речі.

**Заборона йде по всьому стеку викликів**, зокрема на хелпери без директиви:

```tsx
// ❌ headers() у хелпері, який викликає закешований компонент
import { headers } from 'next/headers'

async function getLocale() {
  return (await headers()).get('accept-language') ?? 'uk'
}

async function Greeting() {
  'use cache'
  const locale = await getLocale()
  return <p>{locale}</p>
}
```

```text
Error: Route /case used `headers()` inside "use cache". Accessing Dynamic data sources inside
a cache scope is not supported. If you need this data inside a cached function use `headers()`
outside of the cached function and pass the required dynamic data in as an argument.
    at g (app/case/page.tsx:6:17)
    at h (app/case/page.tsx:11:24)
```

Це вивід `next build`: пререндер друкує шляхи вихідних файлів, і стек показує обидва рівні (`h` — закешований `Greeting`, `g` — хелпер). А якщо маршрут не пререндериться (компонент стоїть за `searchParams` у дірці), **`next build` проходить зелено**. Помилка зʼявляється лише в лозі `next start` на першому запиті, з кадрами на `.next/server/chunks/ssr/…js` замість вихідних файлів, а відповідь має статус 200 без вмісту дірки. Місце знайдеш у `next dev`, а від регресій рятують e2e-тест сторінки й правило «закешовані функції не викликають модулі, що читають запит».

**Правильний патерн: прочитай зовні, передай значення**, яке стане частиною ключа:

```tsx
// app/cart/page.tsx — cookie читаємо зовні, у кеш передаємо значення
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export default function CartPage() {
  return (
    <main>
      <h1>Кошик</h1>
      <Suspense fallback={<p>Рахуємо кошик…</p>}>
        <CartLoader />
      </Suspense>
    </main>
  )
}

// не закешований: читає запит
async function CartLoader() {
  const cartId = (await cookies()).get('cart')?.value ?? 'empty'
  return <CartSummary cartId={cartId} />
}

// закешований: cartId — частина ключа
async function CartSummary({ cartId }: { cartId: string }) {
  'use cache'
  cacheLife('minutes')
  cacheTag(`cart-${cartId}`)
  console.log(`[CartSummary] рахую кошик ${cartId}`)
  await new Promise((r) => setTimeout(r, 200))
  return <p id="sum">Кошик {cartId}: 3 товари ({new Date().toISOString()})</p>
}
```

Запити з `cart=A`, `cart=A`, `cart=B` дають два рядки `[CartSummary] рахую кошик …`. У shell компонент не потрапляє (`◐ /cart` без колонок часу), але кожен кошик рахується раз за своє життя. Ціна — **запис на кожного користувача** в памʼяті процесу (сховища — тема 18 основного посібника).

**Не передавай проміс замість значення**: з `cookies()`-промісом у props `next build` зависає на 50 секунд і падає:

```text
Error: Filling a cache during prerender timed out, likely because request-specific arguments
such as params, searchParams, cookies() or dynamic data were used inside "use cache".
```

Те саме — з промісом через замикання чи спільний `Map`.

Два винятки й одна ізоляція:

- **`draftMode().isEnabled` читати можна**; у Draft Mode закешовані функції виконуються щоразу й нічого не зберігають.
- **`params`** теж передають значенням; для шляхів з `generateStaticParams` запис наповниться на збірці. Root params входять у ключ, лише якщо функція їх читає.
- **`React.cache` ізольований**: батько записав `'значення від батька'`, закешована дитина прочитала `null`. Дані в кеш — **лише аргументами**.

> [!quiz] Перевір себе: headers() у хелпері закешованого компонента
> level: senior · type: single · id: nextjs-core-15-quiz-10
>
> ```tsx
> // app/case/page.tsx — маршрут за searchParams, без generateStaticParams
> async function getLocale() {
>   return (await headers()).get('accept-language') ?? 'uk' // хелпер без директиви
> }
>
> async function Greeting() {
>   'use cache'
>   const locale = await getLocale()
>   return <p>{locale}</p>
> }
> ```
>
> `Greeting` стоїть у дірці під `<Suspense>` за `searchParams`, тож маршрут не пререндериться. Що станеться?
>
> - [x] `next build` проходить; на першому запиті `next start` у лозі зʼявляється `next-request-in-use-cache`, відповідь має статус 200, а вмісту дірки немає
> - [ ] `next build` падає: заборона на `headers()` діє по всьому стеку викликів
> - [ ] Усе працює: у хелпера немає директиви, тож `headers()` в ньому дозволений, а `locale` потрапляє в ключ
> - [ ] `next start` відповідає 500, бо виняток у кеші зупиняє весь рендер
>
> **Пояснення:** заборона дійсно діє по стеку, але перевіряється там, де код виконується. Маршрут не пререндериться, тож збірка нічого не бачить і CI зелений. Помилка зʼявляється на першому запиті, лише в лозі сервера, а клієнт отримує 200 без вмісту дірки. Саме тому такий баг ловить e2e-тест, а не збірка.

> [!quiz] Що відрендериться всередині кешу: React.cache
> level: senior · type: output · id: nextjs-core-15-quiz-11
>
> ```tsx
> import { cache } from 'react'
>
> const store = cache(() => ({ current: null as string | null }))
>
> export default async function Page() {
>   store().current = 'значення від батька'
>   return <Child />
> }
>
> async function Child() {
>   'use cache'
>   return <p>[{String(store().current)}]</p>
> }
> ```
>
> Що буде в `<p>`?
>
> - [x] `[null]`
> - [ ] `[значення від батька]` — `React.cache` спільний на весь запит, тож батько й дитина бачать один обʼєкт
> - [ ] `[undefined]` — усередині кешу `store()` повертає обʼєкт без поля `current`
> - [ ] Помилка збірки: `React.cache` не можна викликати всередині `'use cache'`
>
> **Пояснення:** `React.cache` ізольований від `'use cache'`. Усередині кешу `store()` створює свій обʼєкт з початковим `null`, і запис батька його не торкається. Помилки немає, а поле `current` існує з початкового значення. Дані в закешовану функцію передаються лише аргументами.

### 🛠️ Налагодження кешу

- **Лог усередині функції** пише лише при промаху. `next dev` повторює такі логи з позначкою `Cache` і при попаданні, але лічильник у повторі не росте: це вивід, збережений разом із записом.
- **`NEXT_PRIVATE_DEBUG_CACHE=1`** перед `next dev` чи `next start` вмикає докладний лог операцій кешу.
- **`next build --debug-prerender`** дає читабельні стеки помилок пререндеру.

> [!quiz] Перевір себе: що потрапить у static shell
> level: senior · type: multi · id: nextjs-core-15-quiz-12
>
> `cacheComponents: true`. Познач усе, що опиниться в static shell, а не в дірці, яка рахується на запит.
>
> - [x] Результат `'use cache'` з `cacheLife('hours')`, який не залежить від даних запиту
> - [x] Розмітка закешованої обгортки, у яку передано динамічні `children` під `<Suspense>`
> - [x] `fallback` межі `<Suspense>` навколо динамічного вмісту
> - [ ] Результат `'use cache'` з `cacheLife('seconds')`
> - [ ] Закешований `CartSummary`, який отримує `cartId` з `cookies()` через `CartLoader` під `<Suspense>`
> - [ ] Будь-який `'use cache'`: директива гарантує потрапляння в shell
>
> **Пояснення:** обгортка потрапляє в shell, а динамічні `children` лишаються діркою (`◐`). `seconds` має `expire` 1 хвилина, тож не пререндериться й сам стає діркою. `CartSummary` залежить від cookie, до нього не дійти без запиту, тому він рахується на запит, а потім кешується по `cartId`. Отже, `'use cache'` не означає «завжди в shell»: цим керують `cacheLife` та джерело аргументів.

### 🏭 Як це роблять у продакшні

- **Шар даних із закешованими функціями**: `lib/data/*.ts` з `import 'server-only'`, у кожній функції `'use cache'`, явний `cacheLife` і теги. UI-кеш — точково, для дорогої розмітки.
- **Профілі з бізнесовими назвами** в `next.config` (`catalog`, `editorial`) і `cacheLife` поруч із директивою, без обгорток на кшталт `withCache(fn, '1h')`.
- **Ключ з малою кардинальністю**: `id` чи `slug`, нормалізовані до виклику, а не весь обʼєкт чи `searchParams`.
- **Фабрика тегів** на кшталт `tags.product(id)`, щоб запис та інвалідація не розходилися на одну літеру.
- **Персональне — обережно**: закешована функція з `userId`, експортована без перевірки сесії, — це IDOR. Шаблон: неекспортована закешована функція й експортований геттер з перевіркою доступу (розділ «Auth і безпека»).
- **E2e у CI на `next start`**: збірка не ловить `next-request-in-use-cache` у дірках.

## ⚠️ Пастки

> [!pitfall] Новий ключ на кожен запит
> Аргумент, що щоразу інший, перетворює кеш на смітник: hit rate нуль, памʼять росте. Сюди ж — поля обʼєкта в різному порядку і `1` проти `'1'`.
>
> ```ts
> await getProducts({ filters: searchParams, now: Date.now() }) // ❌ унікальний ключ
> await getProducts(normalizeCategory(category)) // ✅ мала кардинальність
> ```

> [!pitfall] URL чи клас як аргумент
> Клас падає з оманливим `Cannot access … temporary client reference`, а `URL` взагалі не падає й приходить рядком, у якого `host === undefined`.
>
> ```ts
> await getHost(new URL(href)) // ❌ усередині url.host → undefined
> await getHost(new URL(href).host) // ✅ передай примітив
> ```

> [!pitfall] Очікування stale-while-revalidate від runtime-кешу
> На пререндереному маршруті після `revalidate` користувач отримує старе миттєво. Але запис у дірці під Suspense з типовим in-memory handler після `revalidate` перераховується **на запит**, і користувач чекає. Це про старіння за часом; тегова `revalidateTag(tag, 'max')` дає SWR і тут.

> [!pitfall] Короткий кеш у бібліотеці ламає збірку
> Пакет оновився, у ньому зʼявився `cacheLife('seconds')`, і твоя сторінка з `'use cache'` без `cacheLife` падає з `nested inside another "use cache" that has no explicit cacheLife`. Явний профіль у кожному кеш-скоупі робить такі оновлення безпечними.
>
> ```tsx
> export default async function Page() {
>   'use cache'
>   cacheLife('hours') // ✅ рішення про час життя ухвалено тут
>   return <VendorWidget />
> }
> ```

> [!pitfall] cookies() у хелпері на динамічному маршруті
> Збірка зелена, у проді — помилка в лозі й порожня дірка зі статусом 200. Заборона діє по всьому стеку, тож хелпер, який читає запит, не можна викликати з кешу.
>
> ```tsx
> async function Themed({ slug }: { slug: string }) {
>   'use cache'
>   const theme = await readThemeFromCookie() // ❌ next start: next-request-in-use-cache
> }
> ```

> [!pitfall] Кеш «переживе деплой»
> Ключ містить build id, тож після кожного деплою всі записи `'use cache'` холодні, а перші запити йдуть у БД. Для даних, які мусять пережити деплой, документація досі радить `fetch`-кеш або `unstable_cache` (тема 18 основного посібника).

## 🎤 На співбесіді

> [!interview] З чого складається ключ запису 'use cache'? Чому замикання — частина ключа?
> level: senior · frequency: часто · id: nextjs-core-15-int-01
>
> ---
>
> Із build id (або `deploymentId`), function id — хешу місця й сигнатури функції, серіалізованих аргументів чи props, а в dev ще й HMR-хешу. Змінні, які функція захоплює із зовнішнього скоупу, Next.js передає як приховані аргументи, тож вони теж у ключі. Інакше внутрішня функція, що читає `currency` батька, віддала б гривні тому, хто просив євро. Наслідки: новий деплой — холодний кеш; дві різні функції з тими самими даними — два записи; ключ будується зі значення, тож новий обʼєкт з тими самими полями дає hit, а порядок полів і `1` проти `'1'` дають різні ключі. Звідси практика нормалізувати аргументи до виклику.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🔑 Ключ кешу: коли hit, а коли miss|Розділ: ключ кешу]] · [Next.js: use cache — Cache keys](https://nextjs.org/docs/app/api-reference/directives/use-cache#cache-keys) · [Next.js: Caching](https://nextjs.org/docs/app/getting-started/caching)

> [!interview] Чим 'use cache' відрізняється від React.cache і мемоізації fetch?
> level: middle · frequency: часто · id: nextjs-core-15-int-02
>
> ---
>
> `React.cache` і мемоізація `fetch` — дедуплікація в межах одного запиту чи рендер-проходу: два компоненти, що просять те саме, роблять один запит, а наступний запит рахує заново. `'use cache'` — кеш між запитами: результат серіалізується, зберігається в cache handler (за замовчуванням LRU у памʼяті процесу) і живе за `cacheLife`. Записи, наповнені на `next build`, стають частиною static shell. Тому `'use cache'` вимагає серіалізованих аргументів і забороняє дані запиту всередині. До того ж `React.cache` ізольований від `'use cache'`: значення, покладене зовні, всередині не видно, і дані передаються лише аргументами.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🧭 Що робить use cache і чим він не є|Розділ: що робить use cache]] · [Next.js: use cache — React.cache isolation](https://nextjs.org/docs/app/api-reference/directives/use-cache#reactcache-isolation) · [React: cache](https://react.dev/reference/react/cache)

> [!interview] Поясни stale, revalidate і expire у cacheLife. Що побачить користувач у кожній фазі?
> level: senior · frequency: часто · id: nextjs-core-15-int-03
>
> ---
>
> `stale` — браузерний бік: стільки секунд роутер бере результат із Client Cache без запиту; сервер передає його в `x-nextjs-stale-time`, а мінімум 30 секунд потрібен, щоб prefetch не протух до кліку. `revalidate` — серверний: після нього пререндерений маршрут віддає старе одразу (`x-nextjs-cache: STALE`) і перераховує у фоні. `expire` — максимальний вік: якщо запитів не було довше, наступний чекає на свіжий рендер; він мусить бути більшим за `revalidate`. Нюанс 16.3.8: runtime-записи in-memory handler після `revalidate` за часом перераховуються на запит. Короткий профіль (`expire` < 5 хв, `revalidate: 0`, `stale` < 30 с) виключає результат із пререндеру, і компонент стає діркою.
>
> 📚 [[Next.js - 15. Cache Components і use cache#⏳ cacheLife: stale, revalidate, expire|Розділ: cacheLife]] · [Next.js: cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife) · [Next.js: cacheLife config](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife)

> [!interview] Закешований компонент рендерить інший закешований. Скільки житиме результат?
> level: senior · frequency: іноді · id: nextjs-core-15-int-04
>
> ---
>
> Якщо в зовнішнього є явний `cacheLife`, діє він, хоч довший, хоч коротший за внутрішній: поки зовнішній свіжий, він віддає весь вивід разом із застиглим внутрішнім. Без явного профілю зовнішній бере `default`, а внутрішні можуть його лише скоротити: `minutes` усередині дає `1m / 1h`, а `days` не продовжує `revalidate` понад 15 хвилин, хоча його `expire` у тиждень стає межею. Короткоживучий внутрішній (`expire` < 5 хв) під зовнішнім без `cacheLife` — помилка пререндеру, бо інакше зовнішній мовчки став би діркою. Тому в кожному кеш-скоупі пишу явний `cacheLife`.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🪆 Вкладені кеші|Розділ: вкладені кеші]] · [Next.js: cacheLife — Nested caching behavior](https://nextjs.org/docs/app/api-reference/functions/cacheLife#nested-caching-behavior) · [Next.js: nested-use-cache-no-explicit-cachelife](https://nextjs.org/docs/messages/nested-use-cache-no-explicit-cachelife)

> [!interview] Потрібно закешувати блок, що залежить від cookie користувача. Як, якщо cookies() у 'use cache' заборонено?
> level: senior · frequency: часто · id: nextjs-core-15-int-05
>
> ---
>
> Розділю читання й кеш. Незакешований компонент під `<Suspense>` читає `cookies()` і передає закешованому лише потрібне значення, наприклад `cartId`, яке стає частиною ключа: кожен кошик рахується раз за своє життя. Не проміс (збірка зависне) і не хелпер, що читає запит (заборона йде по стеку). Ціна — запис на кожного користувача в памʼяті процесу, а в serverless такі записи майже не живуть. Для durable чи приватного кешу є `'use cache: remote'` і `'use cache: private'`. А якщо функція з `userId` експортована, вона мусить перевіряти сесію.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🚪 Дані запиту: зовні, а всередину значення|Розділ: дані запиту]] · [Next.js: Passing runtime values to cached functions](https://nextjs.org/docs/app/getting-started/caching#passing-runtime-values-to-cached-functions) · [Next.js: next-request-in-use-cache](https://nextjs.org/docs/messages/next-request-in-use-cache)

## 🔗 Звʼязки

- [[Next.js - 12. Partial Prerendering і Cache Components]] — static shell, дірки й три варіанти для даних; тут — механіка варіанта «закешувати».
- [[Next.js - 14. Дані на сервері]] — дедуплікація в межах запиту (`fetch`, `React.cache`), з якою не варто плутати `'use cache'`.
- [[Next.js - 07. Server і Client Components]] — серіалізація props, Server Functions як посилання й `children` як дірка: ті самі ідеї працюють на межі кешу.
- [[cache]] — довідник React: `React.cache` і його область дії.
- [[JavaScript - 05. Замикання]] — чому захоплена змінна мусить потрапити в ключ.
- [[Next.js - 16. Ревалідація]] — `updateTag`, `revalidateTag`, `revalidatePath`, `refresh` і що побачить користувач.
- [[Next.js - 17. ISR і CDN]] — ISR і CDN-заголовки.
- [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers]] — `'use cache: private'`, `'use cache: remote'`, `cacheHandlers`.

## ⚡ Фішки

> [!reel] 🔑 Новий обʼєкт — той самий ключ
> Ключ 'use cache' будується із серіалізованого значення, а не з посилання. Виклик `getProductByQuery({ slug })` з новим обʼєктом на кожен запит дає hit, поки поля збігаються.

> [!reel] 🔀 Порядок полів — частина ключа
> `{ slug, currency }` і `{ currency, slug }` для коду однакові, а для кешу різні. З `1` та `'1'` те саме. Тому аргументи нормалізують до виклику.
>
> ```ts
> await getById(1) // один запис
> await getById('1') // інший запис
> ```

> [!reel] 🧵 Замикання теж у ключі
> Змінні із зовнішнього скоупу, які читає закешована функція, Next.js передає як приховані аргументи. Тому `format(900)` з `currency` в замиканні дає окремі записи для `UAH` і `EUR`.

> [!reel] 🧊 Runtime-кеш не знає stale-while-revalidate
> У `next start` пререндерений маршрут після `revalidate` віддає `STALE` і перераховує у фоні. А запис з дірки під Suspense у типовому in-memory handler після `revalidate` просто зникає, і запит чекає. Це про старіння за часом: після `revalidateTag(tag, 'max')` такі записи віддаються застарілими й оновлюються у фоні.

> [!reel] 🏷️ Теги дочірніх кешів збираються на сторінку
> У `.next/server/app/tags.meta` заголовок `x-next-cache-tags` містить теги всіх кешів у shell та службові `_N_T_`. Тому інвалідація одного тегу зачепить і HTML сторінки.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чому значення, записане через `React.cache` зовні, не видно всередині `use cache`?
> *іноді · пастка* · `nextjs-core-15-card-01`
>
> `React.cache` ізольований від `'use cache'`: усередині кешу `store()` створює власний обʼєкт, тож батько записав значення, а закешована дитина прочитала початкове `null`. Помилки немає. Закешований результат мусить залежати лише від аргументів (вони входять у ключ), інакше два виклики з однаковим ключем могли б віддати різне. Передавай дані **аргументами**.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🚪 Дані запиту: зовні, а всередину значення|Розділ: дані запиту]] · [Next.js: use cache — React.cache isolation](https://nextjs.org/docs/app/api-reference/directives/use-cache#reactcache-isolation)

> [!question]- На яких трьох рівнях можна поставити `use cache`?
> *часто · теорія* · `nextjs-core-15-card-02`
>
> Першим рядком тіла **функції** (кеш даних), першим рядком тіла **компонента** (кеш відрендереного UI) і першим рядком **файлу** (кешується кожен експорт, і кожен мусить бути `async`). `page.tsx` та `layout.tsx` теж модулі, тож директива на файлі кешує сегмент. Почни з рівня функції.
>
> 📚 [[Next.js - 15. Cache Components і use cache#📍 Три рівні: функція, компонент, файл|Розділ: три рівні]] · [Next.js: use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)

> [!question]- Що станеться, якщо поставити `use cache` на синхронну функцію або викликати `cacheLife` поза кешем?
> *іноді · пастка* · `nextjs-core-15-card-03`
>
> Збірка зупиниться. Синхронна функція: `"use cache" functions must be async functions.`, бо результат може прийти зі сховища. `cacheLife` поза кеш-скоупом, навіть у звичайному компоненті: `` `cacheLife()` can only be called inside a "use cache" function. `` Те саме й для синхронного експорту у файлі з директивою.
>
> 📚 [[Next.js - 15. Cache Components і use cache#📍 Три рівні: функція, компонент, файл|Розділ: три рівні]] · [[Next.js - 15. Cache Components і use cache#⏳ cacheLife: stale, revalidate, expire|Розділ: cacheLife]] · [Next.js: cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)

> [!question]- Чи можна прочитати `cookies()` усередині закешованої функції? Що робити натомість?
> *дуже часто · теорія* · `nextjs-core-15-card-04`
>
> Ні: `cookies()`, `headers()`, `searchParams` і `connection()` усередині кешу заборонені, бо результат віддається всім з тим самим ключем. Прочитай значення зовні, в незакешованому компоненті під `<Suspense>`, і передай закешованому як аргумент (наприклад, `cartId`): він стане частиною ключа.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🚪 Дані запиту: зовні, а всередину значення|Розділ: дані запиту]] · [Next.js: next-request-in-use-cache](https://nextjs.org/docs/messages/next-request-in-use-cache)

### 🟡 Middle

> [!question]- Виклик `getProductByQuery({ slug })` з новим обʼєктом на кожен запит — це hit чи miss?
> *часто · код* · `nextjs-core-15-card-05`
>
> Hit, якщо поля ті самі й у тому самому порядку. Ключ будується із серіалізованого значення аргументів, а не з посилання, тож новий обʼєкт нічого не ламає. Різними будуть ключі для іншого порядку полів і для `1` проти `'1'`. Аргументи тому нормалізують до виклику.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🔑 Ключ кешу: коли hit, а коли miss|Розділ: ключ кешу]] · [Next.js: use cache — Cache keys](https://nextjs.org/docs/app/api-reference/directives/use-cache#cache-keys)

> [!question]- Які вбудовані профілі `cacheLife` ти знаєш і який з них робить компонент діркою?
> *часто · теорія* · `nextjs-core-15-card-06`
>
> `default`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`. `default` — 5 хв / 15 хв / ніколи, `hours` — 5 хв / 1 год / 1 день, `max` — 5 хв / 30 днів / 1 рік. Діркою стає `seconds`: його `expire` 1 хвилина, а результати з `expire` менше 5 хвилин, `revalidate: 0` чи `stale` менше 30 с не пререндеряться. Така дірка потребує `<Suspense>`.
>
> 📚 [[Next.js - 15. Cache Components і use cache#⏳ cacheLife: stale, revalidate, expire|Розділ: cacheLife]] · [[Next.js - 15. Cache Components і use cache#🚦 Короткий кеш і static shell|Розділ: короткий кеш і shell]] · [Next.js: cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife#preset-cache-profiles)

> [!question]- Яке з чисел профілю бачить браузер, а яке сервер?
> *іноді · теорія* · `nextjs-core-15-card-07`
>
> `stale` — браузерне: скільки секунд роутер показує результат із Client Cache без запиту (мінімум 30). Сервер передає його в `x-nextjs-stale-time`. `revalidate` і `expire` — серверні: після першого пререндерений маршрут віддає старе й перераховує у фоні, а після `expire` запит чекає на свіже значення.
>
> 📚 [[Next.js - 15. Cache Components і use cache#⏳ cacheLife: stale, revalidate, expire|Розділ: cacheLife]] · [Next.js: cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)

> [!question]- Навіщо `cacheTag` і чи можна будувати теги з даних?
> *часто · практика* · `nextjs-core-15-card-08`
>
> Тег дозволяє оновлювати запис «за подією», а не за годинником: адмін змінив ціну, і потрібні записи можна знайти. Можна ставити кілька тегів (``cacheTag('products', `product-${slug}`)``), а також будувати їх з результату запиту: `cacheTag('featured', ...items.map(...))`. Ліміти: до 128 тегів, до 256 символів кожен, без PII. Саме скидання тегів (`updateTag`, `revalidateTag`) — тема 16 основного посібника.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🏷️ cacheTag: мітки для ревалідації|Розділ: cacheTag]] · [Next.js: cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag)

> [!question]- Як передати `children` або Server Action крізь закешований компонент і не зламати кеш?
> *іноді · код* · `nextjs-core-15-card-09`
>
> Лише як pass-through: прийняти й відрендерити (`{children}`, `action={like}`), не зазираючи всередину. Для кешу це непрозоре посилання, воно не входить у ключ. Тому `isValidElement(children)` усередині дає `false`, а закешована шапка з динамічними `children` лишається в shell (`◐`). Дія викликається вже в клієнті.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🧳 Що можна передати в кеш|Розділ: що можна передати]] · [Next.js: use cache — Serialization](https://nextjs.org/docs/app/api-reference/directives/use-cache#serialization)

### 🔴 Senior

> [!question]- Чому помилка пише про «temporary client reference», хоча клієнтських компонентів немає, і що з `URL`?
> *іноді · пастка* · `nextjs-core-15-card-10`
>
> Несеріалізоване значення (екземпляр класу, `Symbol`) React замінює непрозорим посиланням, яке можна лише передати далі. Звернення до поля падає з `Cannot access amount on the server… temporary client reference`, виклик функції — з `Attempted to call a temporary Client Reference`. `URL` формально непідтримуваний, але на 16.3.8 не падає: приходить рядок, і `url.host` дорівнює `undefined`. Передавай примітиви, наприклад `url.href`.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🧳 Що можна передати в кеш|Розділ: що можна передати]] · [Next.js: use cache — Unsupported types](https://nextjs.org/docs/app/api-reference/directives/use-cache#unsupported-types)

> [!question]- Збірка впала з `nested inside another "use cache" that has no explicit cacheLife`. Що сталося і що робити?
> *іноді · пастка* · `nextjs-core-15-card-11`
>
> Короткоживучий кеш (`expire` менше 5 хвилин, наприклад `seconds`) сидить усередині кешу без явного `cacheLife`. Інакше зовнішній мовчки став би діркою. Часто це прилітає з оновленням залежності. Виправлення — рішення у зовнішньому: `cacheLife('hours')` або `default`, якщо він має бути в shell, чи `cacheLife('seconds')` разом із `<Suspense>`, якщо він має бути динамічним.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🪆 Вкладені кеші|Розділ: вкладені кеші]] · [Next.js: nested-use-cache-no-explicit-cachelife](https://nextjs.org/docs/messages/nested-use-cache-no-explicit-cachelife)

> [!question]- Чому CI зелений, а в проді закешований компонент порожній зі статусом 200?
> *іноді · налагодження* · `nextjs-core-15-card-12`
>
> Імовірно, `headers()` чи `cookies()` читається в хелпері, який викликає закешований компонент, а маршрут не пререндериться (дірка за `searchParams`). Збірка нічого не бачить. Помилка `next-request-in-use-cache` зʼявляється на першому запиті лише в лозі сервера, відповідь 200 без вмісту дірки. Лікування: читати запит зовні, передавати значення, і мати e2e-тест на сторінку.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🚪 Дані запиту: зовні, а всередину значення|Розділ: дані запиту]] · [Next.js: next-request-in-use-cache](https://nextjs.org/docs/messages/next-request-in-use-cache)

> [!question]- На пререндереній сторінці бачу `x-nextjs-cache: STALE`, а в дірці під Suspense користувач чекає. Чому?
> *рідко · продуктивність* · `nextjs-core-15-card-13`
>
> Stale-while-revalidate працює для пререндерених маршрутів. Запис `'use cache'`, наповнений під час запиту, у типовому in-memory handler після `revalidate` вважається відсутнім, тож запит чекає на перерахунок. Для дорогих runtime-обчислень обирають довший `revalidate` або спільний handler (тема 18 основного посібника). Час життя перевіряють у `next build && next start`, не в `next dev`.
>
> 📚 [[Next.js - 15. Cache Components і use cache#⏳ cacheLife: stale, revalidate, expire|Розділ: cacheLife]] · [Next.js: cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife#revalidate)

> [!question]- Що станеться з кешем при новому деплої і в serverless?
> *іноді · архітектура* · `nextjs-core-15-card-14`
>
> Ключ містить build id, тож після деплою всі записи `'use cache'` холодні, а перші запити йдуть у БД. Типовий handler тримає записи в памʼяті одного процесу, обмеженій `cacheMaxMemorySize`. У serverless кожен запит може потрапити на інший інстанс, тому runtime-записи там майже не живуть, хоча кешування на збірці працює. Для спільного кешу є `'use cache: remote'` (тема 18 основного посібника).
>
> 📚 [[Next.js - 15. Cache Components і use cache#🧭 Що робить use cache і чим він не є|Розділ: що робить use cache]] · [[Next.js - 15. Cache Components і use cache#🏭 Як це роблять у продакшні|Розділ: продакшн]] · [Next.js: cacheMaxMemorySize](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheMaxMemorySize)

> [!question]- Чому експортована закешована функція з `userId` в аргументі — потенційний IDOR?
> *іноді · безпека* · `nextjs-core-15-card-15`
>
> Кожен користувач має свій запис, і це коректно, але експортована функція віддасть дані будь-кому, хто передасть чужий `userId`. Кеш доступ не перевіряє. Шаблон: неекспортована закешована функція і експортований геттер, який спершу перевіряє сесію й права, а потім викликає кешовану. У тегах і ключах не місце PII.
>
> 📚 [[Next.js - 15. Cache Components і use cache#🏭 Як це роблять у продакшні|Розділ: продакшн]] · [Next.js: Caching](https://nextjs.org/docs/app/getting-started/caching)

## 🛠️ Практика

> [!task] Ключ кешу як у use cache
> level: senior · difficulty: medium · tags: use-cache, cache-keys, serialization · id: nextjs-core-15-task-01
>
> Напиши `cacheKey(fnId, args)` — детермінований рядок-ключ, як у `'use cache'`. Правила моделі:
>
> - ключ залежить від **значення**, а не від посилання: новий обʼєкт з тими самими полями дає той самий ключ;
> - порядок полів обʼєкта зберігається, тож `{ a, b }` і `{ b, a }` дають різні ключі;
> - `1` і `'1'`, `null` і `undefined` — різні ключі; різні `fnId` — теж;
> - підтримуються примітиви, масиви, прості обʼєкти, `Date` (за значенням), `Map` і `Set` (з порядком вставки);
> - екземпляр класу, функція та `Symbol` — помилка, у тексті якої є назва типу (`Money`, `function`, `symbol`).
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> // Ключ як у 'use cache': fnId + серіалізовані аргументи (значення, а не посилання)
> function cacheKey(fnId: string, args: unknown[]): string {
>   // ❌ наївно: JSON губить типи (Date, Map, Set) і мовчки ковтає те, що кеш не прийняв би
>   return fnId + JSON.stringify(args)
> }
> ```
>
> ```ts tests
> test('новий обʼєкт з тими самими полями дає той самий ключ', () => {
>   const a = cacheKey('getLabel', [{ slug: 'hat', tags: ['a', 'b'], size: { w: 1 } }])
>   const b = cacheKey('getLabel', [{ slug: 'hat', tags: ['a', 'b'], size: { w: 1 } }])
>   expect(a).toBe(b)
> })
>
> test('інший порядок полів — інший ключ', () => {
>   const a = cacheKey('getLabel', [{ slug: 'hat', currency: 'UAH' }])
>   const b = cacheKey('getLabel', [{ currency: 'UAH', slug: 'hat' }])
>   expect(a).not.toBe(b)
> })
>
> test('1 і "1" — різні ключі, різні функції — теж', () => {
>   expect(cacheKey('getById', [1])).not.toBe(cacheKey('getById', ['1']))
>   expect(cacheKey('getById', [null])).not.toBe(cacheKey('getById', [undefined]))
>   expect(cacheKey('getA', ['hat'])).not.toBe(cacheKey('getB', ['hat']))
> })
>
> test('Date, Map і Set входять у ключ за значенням', () => {
>   const at = () => new Date('2026-10-30T10:00:00Z')
>   expect(cacheKey('f', [at()])).toBe(cacheKey('f', [at()]))
>   expect(cacheKey('f', [at()])).not.toBe(cacheKey('f', [new Date('2026-10-31T10:00:00Z')]))
>   expect(cacheKey('f', [new Map([['hat', 900]])])).toBe(cacheKey('f', [new Map([['hat', 900]])]))
>   expect(cacheKey('f', [new Map([['hat', 900]])])).not.toBe(cacheKey('f', [new Map([['hat', 901]])]))
>   expect(cacheKey('f', [new Set([1, 2])])).not.toBe(cacheKey('f', [[1, 2]]))
> })
>
> test('екземпляр класу кидає помилку з назвою типу', () => {
>   class Money {
>     constructor(public amount: number) {}
>   }
>   expect(() => cacheKey('format', [new Money(900)])).toThrow(/Money/)
>   expect(() => cacheKey('format', [{ price: new Money(1) }])).toThrow(/Money/)
> })
>
> test('функція і Symbol кидають помилку з назвою типу', () => {
>   expect(() => cacheKey('f', [() => 1])).toThrow(/function/)
>   expect(() => cacheKey('f', [Symbol('sale')])).toThrow(/symbol/)
> })
> ```
>
> > [!hint]- Підказка 1
> > `JSON.stringify` не відрізнить `Date` від рядка з ISO, `Set` від порожнього обʼєкта, а функцію в масиві перетворить на `null`. Напиши рекурсивну `serialize(value)` з окремою гілкою на кожен тип.
>
> > [!hint]- Підказка 2
> > Клас відрізняй за прототипом: просте — це `Object.prototype` або `null`. Назву типу бери з `Object.getPrototypeOf(value).constructor.name`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function serialize(value: unknown): string {
> >   if (value === null) return 'null'
> >   switch (typeof value) {
> >     case 'undefined':
> >       return 'undefined'
> >     case 'string':
> >       return JSON.stringify(value)
> >     case 'number':
> >     case 'boolean':
> >       return String(value)
> >     case 'function':
> >       throw new Error('Не можна серіалізувати function')
> >     case 'symbol':
> >       throw new Error('Не можна серіалізувати symbol')
> >   }
> >   if (Array.isArray(value)) return `[${value.map(serialize).join(',')}]`
> >   if (value instanceof Date) return `Date(${value.toISOString()})`
> >   if (value instanceof Map) {
> >     const pairs = [...value].map(([k, v]) => `${serialize(k)}=>${serialize(v)}`)
> >     return `Map[${pairs.join(',')}]`
> >   }
> >   if (value instanceof Set) return `Set[${[...value].map(serialize).join(',')}]`
> >   const proto = Object.getPrototypeOf(value)
> >   if (proto !== Object.prototype && proto !== null) {
> >     throw new Error(`Не можна серіалізувати екземпляр класу ${proto.constructor.name}`)
> >   }
> >   const fields = Object.entries(value as Record<string, unknown>)
> >   return `{${fields.map(([k, v]) => `${JSON.stringify(k)}:${serialize(v)}`).join(',')}}`
> > }
> >
> > function cacheKey(fnId: string, args: unknown[]): string {
> >   return `${fnId}(${args.map(serialize).join(',')})`
> > }
> > ```
> >
> > Кожен тип має свою гілку, тож `Date`, `Map` і `Set` не зливаються з масивами та обʼєктами, а `1` та `'1'` серіалізуються по-різному. Поля обʼєкта беруться в порядку вставки: сортування «для краси» зламало б семантику, бо Next.js теж вважає `{ a, b }` та `{ b, a }` різними ключами.

> [!task] Профілі cacheLife як дані
> level: senior · difficulty: medium · tags: cachelife, profiles, static-shell · id: nextjs-core-15-task-02
>
> Напиши дві функції (усі часи в секундах, `expire: Infinity` означає «ніколи»).
>
> `resolveCacheLife(profile, config)` повертає `{ stale, revalidate, expire }`:
>
> - назва вбудованого профілю з таблиці `PRESETS` (повертай **копію**);
> - назва власного профілю з `config` (обʼєкт `{ назва: часткове описання }`) або перевизначення вбудованого імені: пропущені поля беруться з `default`;
> - inline-обʼєкт: так само успадковує пропущене від `default`;
> - якщо в `config.default` перевизначено `default`, пропущені поля успадковуються від нього, а `resolveCacheLife('default', config)` повертає його;
> - помилка, якщо `expire <= revalidate` або профіль невідомий (у тексті — його назва).
>
> `classify(lifetime)` повертає `'dynamic-hole'` (`revalidate` 0, `expire` менше 300 або `stale` менше 30), інакше `'prerender-not-shell'` (`stale` менше 300), інакше `'shell'`.
>
> ```js starter
> const PRESETS = {
>   default: { stale: 300, revalidate: 900, expire: Infinity },
>   seconds: { stale: 30, revalidate: 1, expire: 60 },
>   minutes: { stale: 300, revalidate: 60, expire: 3600 },
>   hours: { stale: 300, revalidate: 3600, expire: 86400 },
>   days: { stale: 300, revalidate: 86400, expire: 604800 },
>   weeks: { stale: 300, revalidate: 604800, expire: 2592000 },
>   max: { stale: 300, revalidate: 2592000, expire: 31536000 },
> }
>
> // profile — назва профілю або inline-обʼєкт; config — власні профілі з next.config (cacheLife: { … })
> function resolveCacheLife(profile, config = {}) {
>   // твій код
> }
>
> // куди потрапить результат: 'dynamic-hole' | 'prerender-not-shell' | 'shell'
> function classify(lifetime) {
>   // твій код
> }
> ```
>
> ```js tests
> test('вбудовані профілі: hours, max і default з expire «ніколи»', () => {
>   expect(resolveCacheLife('hours')).toEqual({ stale: 300, revalidate: 3600, expire: 86400 })
>   expect(resolveCacheLife('max').expire).toBe(31536000)
>   expect(resolveCacheLife('default').expire).toBe(Infinity)
>   resolveCacheLife('hours').stale = 1 // результат — копія, таблиця пресетів не псується
>   expect(resolveCacheLife('hours').stale).toBe(300)
> })
>
> test('власний профіль з config: пропущені поля беруться з default', () => {
>   const config = { editorial: { stale: 60, revalidate: 600 } }
>   expect(resolveCacheLife('editorial', config)).toEqual({ stale: 60, revalidate: 600, expire: Infinity })
> })
>
> test('inline-обʼєкт успадковує пропущене від default', () => {
>   expect(resolveCacheLife({ revalidate: 120 })).toEqual({ stale: 300, revalidate: 120, expire: Infinity })
>   expect(resolveCacheLife({})).toEqual(resolveCacheLife('default'))
> })
>
> test('перевизначений default діє для default, inline і власних профілів', () => {
>   const config = { default: { revalidate: 7200, expire: 86400 }, short: { revalidate: 60 } }
>   expect(resolveCacheLife('default', config)).toEqual({ stale: 300, revalidate: 7200, expire: 86400 })
>   expect(resolveCacheLife({ stale: 100 }, config)).toEqual({ stale: 100, revalidate: 7200, expire: 86400 })
>   expect(resolveCacheLife('short', config)).toEqual({ stale: 300, revalidate: 60, expire: 86400 })
>   expect(resolveCacheLife('hours', config).revalidate).toBe(3600)
> })
>
> test('кидає помилку: expire <= revalidate або невідомий профіль', () => {
>   expect(() => resolveCacheLife({ revalidate: 100, expire: 100 })).toThrow(/expire/)
>   expect(() => resolveCacheLife({ expire: 100 })).toThrow(/expire/)
>   expect(() => resolveCacheLife('forever')).toThrow(/forever/)
> })
>
> test('classify: дірка, prerender без shell і shell', () => {
>   expect(classify(resolveCacheLife('seconds'))).toBe('dynamic-hole')
>   expect(classify({ stale: 300, revalidate: 0, expire: 3600 })).toBe('dynamic-hole')
>   expect(classify({ stale: 10, revalidate: 600, expire: 86400 })).toBe('dynamic-hole')
>   expect(classify({ stale: 30, revalidate: 600, expire: 86400 })).toBe('prerender-not-shell')
>   expect(classify({ stale: 299, revalidate: 600, expire: 86400 })).toBe('prerender-not-shell')
>   expect(classify(resolveCacheLife('hours'))).toBe('shell')
>   expect(classify(resolveCacheLife('default'))).toBe('shell')
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу збери `base = { ...PRESETS.default, ...config.default }`, і вже від нього успадковуй усе інше.
>
> > [!hint]- Підказка 2
> > Перевірку `expire <= revalidate` роби в самому кінці, на готовому результаті: так вона ловить і inline-обʼєкти, і власні профілі.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const PRESETS = {
> >   default: { stale: 300, revalidate: 900, expire: Infinity },
> >   seconds: { stale: 30, revalidate: 1, expire: 60 },
> >   minutes: { stale: 300, revalidate: 60, expire: 3600 },
> >   hours: { stale: 300, revalidate: 3600, expire: 86400 },
> >   days: { stale: 300, revalidate: 86400, expire: 604800 },
> >   weeks: { stale: 300, revalidate: 604800, expire: 2592000 },
> >   max: { stale: 300, revalidate: 2592000, expire: 31536000 },
> > }
> >
> > function resolveCacheLife(profile, config = {}) {
> >   // default можна перевизначити в конфігу — від нього успадковуються пропущені поля
> >   const base = { ...PRESETS.default, ...config.default }
> >   let result
> >   if (typeof profile === 'string') {
> >     if (profile === 'default') result = base
> >     else if (Object.hasOwn(config, profile)) result = { ...base, ...config[profile] }
> >     else if (Object.hasOwn(PRESETS, profile)) result = { ...PRESETS[profile] }
> >     else throw new Error(`Невідомий профіль "${profile}"`)
> >   } else {
> >     result = { ...base, ...profile }
> >   }
> >   if (result.expire <= result.revalidate) {
> >     throw new Error('expire має бути більшим за revalidate')
> >   }
> >   return result
> > }
> >
> > function classify({ stale, revalidate, expire }) {
> >   if (revalidate === 0 || expire < 300 || stale < 30) return 'dynamic-hole'
> >   if (stale < 300) return 'prerender-not-shell'
> >   return 'shell'
> > }
> > ```
> >
> > Профіль — це просто дані, тож усе вирішується злиттям обʼєктів від `default`. Перевірка наприкінці повторює правило Next.js: `expire` мусить бути більшим за `revalidate`. `classify` відтворює таблицю порогів пререндеру: саме тому `cacheLife('seconds')` робить компонент діркою.

> [!task] Час життя вкладених кешів
> level: senior · difficulty: hard · tags: use-cache, nested-caches, cachelife · id: nextjs-core-15-task-03
>
> Напиши `effectiveLifetime(outer, inner)` — час життя зовнішнього закешованого компонента з вкладеними кешами (секунди). `outer = { explicit, profile }`, `inner` — масив профілів вкладених кешів.
>
> - **явний** `cacheLife` (`explicit: true`) повертається як є (копія), що б не було всередині;
> - **неявний** починає з `DEFAULT`, і кожне поле скорочується до мінімуму з усіма вкладеними: довші нічого не продовжують;
> - якщо кеш неявний і серед вкладених є профіль з `expire` менше 300, кинь помилку з текстом про відсутній явний `cacheLife`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type Lifetime = { stale: number; revalidate: number; expire: number }
> type CacheScope = { explicit: boolean; profile: Lifetime }
>
> // усі числа — секунди; без явного cacheLife діє default
> const DEFAULT: Lifetime = { stale: 300, revalidate: 900, expire: Infinity }
>
> function effectiveLifetime(outer: CacheScope, inner: Lifetime[]): Lifetime {
>   // ❌ завжди повертає профіль зовнішнього кешу й не дивиться на вкладені
>   return outer.profile
> }
> ```
>
> ```ts tests
> const SECONDS: Lifetime = { stale: 30, revalidate: 1, expire: 60 }
> const MINUTES: Lifetime = { stale: 300, revalidate: 60, expire: 3600 }
> const DAYS: Lifetime = { stale: 300, revalidate: 86400, expire: 604800 }
> const implicit: CacheScope = { explicit: false, profile: DEFAULT }
>
> test('без явного cacheLife вкладений minutes скорочує до 1 хв / 1 год', () => {
>   expect(effectiveLifetime(implicit, [MINUTES])).toEqual({ stale: 300, revalidate: 60, expire: 3600 })
> })
>
> test('без явного cacheLife вкладений days не продовжує revalidate, але скорочує expire', () => {
>   expect(effectiveLifetime(implicit, [DAYS])).toEqual({ stale: 300, revalidate: 900, expire: 604800 })
> })
>
> test('явний зовнішній cacheLife повертається як є, хоч і довший за вкладений', () => {
>   const outer: CacheScope = { explicit: true, profile: DAYS }
>   expect(effectiveLifetime(outer, [MINUTES])).toEqual(DAYS)
>   expect(effectiveLifetime(outer, [SECONDS])).toEqual(DAYS)
> })
>
> test('короткий вкладений кеш без явного зовнішнього кидає помилку про cacheLife', () => {
>   expect(() => effectiveLifetime(implicit, [SECONDS])).toThrow(/cacheLife/)
>   expect(() => effectiveLifetime(implicit, [DAYS, SECONDS])).toThrow(/cacheLife/)
> })
>
> test('кілька вкладених: мінімум за кожним полем', () => {
>   expect(effectiveLifetime(implicit, [MINUTES, DAYS])).toEqual({ stale: 300, revalidate: 60, expire: 3600 })
> })
>
> test('без вкладених діє default, і сам DEFAULT не змінюється', () => {
>   const result = effectiveLifetime(implicit, [])
>   expect(result).toEqual({ stale: 300, revalidate: 900, expire: Infinity })
>   result.revalidate = 1
>   expect(DEFAULT.revalidate).toBe(900)
> })
> ```
>
> > [!hint]- Підказка 1
> > Явний випадок розв'яжи першим і одразу виходь: далі вкладені його не стосуються.
>
> > [!hint]- Підказка 2
> > Для неявного використай `reduce` з початковим значенням `{ ...DEFAULT }` і `Math.min` по кожному полю.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Lifetime = { stale: number; revalidate: number; expire: number }
> > type CacheScope = { explicit: boolean; profile: Lifetime }
> >
> > const DEFAULT: Lifetime = { stale: 300, revalidate: 900, expire: Infinity }
> >
> > function effectiveLifetime(outer: CacheScope, inner: Lifetime[]): Lifetime {
> >   // явний cacheLife зовнішнього кешу перемагає завжди
> >   if (outer.explicit) return { ...outer.profile }
> >
> >   // короткий вкладений кеш без явного рішення нагорі — помилка пререндеру
> >   if (inner.some((p) => p.expire < 300)) {
> >     throw new Error(
> >       '"use cache" з коротким expire (менше 5 хвилин) вкладений в інший "use cache" без явного cacheLife: додай cacheLife() у зовнішній',
> >     )
> >   }
> >
> >   // неявний: стартуємо з default, вкладені можуть лише скоротити
> >   return inner.reduce<Lifetime>(
> >     (acc, p) => ({
> >       stale: Math.min(acc.stale, p.stale),
> >       revalidate: Math.min(acc.revalidate, p.revalidate),
> >       expire: Math.min(acc.expire, p.expire),
> >     }),
> >     { ...DEFAULT },
> >   )
> > }
> > ```
> >
> > Два правила з документації в коді: явний профіль перемагає завжди, а неявний — це `default`, який вкладені можуть лише скоротити (`minutes` дає `1m / 1h`, `days` — `15m / 1w`). Копія через `{ ...DEFAULT }` не дає мутувати спільну константу. Помилка для коротких вкладених кешів відтворює реальний захист: інакше зовнішній кеш мовчки став би діркою.

> [!task] Runtime-кеш і stale-while-revalidate
> level: senior · difficulty: hard · tags: use-cache, revalidate, swr, fake-timers · id: nextjs-core-15-task-04
>
> Змоделюй два кеші з годинником `now()` (мілісекунди); `revalidate` та `expire` — секунди.
>
> `createMemoryCache(now)` — runtime-кеш типового in-memory handler: `set(key, value, { revalidate, expire })` і `get(key)`, що повертає `{ hit, value }`. Запис свіжий, поки його вік **менший** за `revalidate`; далі він вважається відсутнім (старе не віддається) і видаляється. Повторний `set` скидає вік. Якщо `expire <= revalidate`, `set` кидає помилку.
>
> `createPrerenderedRoute(render, { revalidate, expire }, now)` — пререндерений маршрут: `render()` викликається одразу (як на `next build`). `get()` повертає `{ status, value }`:
>
> - вік менший за `revalidate` — `'HIT'`;
> - від `revalidate` до `expire` — `'STALE'` зі старим значенням; перерахунок запускається у фоні через `setTimeout(…, 0)`, і лише **один**, поки попередній не завершився;
> - від `expire` — `'MISS'`: `render()` викликається синхронно, повертається свіже значення.
>
> Це модель старіння **за часом**. Тегова інвалідація `revalidateTag(tag, 'max')` поводиться інакше: runtime-записи вона віддає застарілими й оновлює у фоні (тема 16 основного посібника), у моделі цього немає.
>
> Тести користуються `vi.useFakeTimers()`.
>
> ```js starter
> // Час життя — у секундах, now() повертає мілісекунди.
>
> // Runtime-кеш типового in-memory handler: після revalidate запис вважається відсутнім.
> // get(key) → { hit, value }; set(key, value, { revalidate, expire })
> function createMemoryCache(now = () => Date.now()) {
>   // твій код
> }
>
> // Пререндерений маршрут: render() викликається при створенні (як на next build).
> // get() → { status: 'HIT' | 'STALE' | 'MISS', value }
> function createPrerenderedRoute(render, { revalidate, expire }, now = () => Date.now()) {
>   // твій код
> }
> ```
>
> ```js tests
> test('memory: до revalidate запис віддається як hit', () => {
>   vi.useFakeTimers()
>   const cache = createMemoryCache()
>   cache.set('hat', 'Капелюх', { revalidate: 10, expire: 3600 })
>   vi.advanceTimersByTime(9_999)
>   expect(cache.get('hat')).toEqual({ hit: true, value: 'Капелюх' })
> })
>
> test('memory: після revalidate запис відсутній — старе не віддається', () => {
>   vi.useFakeTimers()
>   const cache = createMemoryCache()
>   cache.set('hat', 'Капелюх', { revalidate: 10, expire: 3600 })
>   vi.advanceTimersByTime(10_000)
>   expect(cache.get('hat').hit).toBe(false)
>   expect(cache.get('hat').value).toBeUndefined()
>   cache.set('hat', 'Новий', { revalidate: 10, expire: 3600 })
>   expect(cache.get('hat')).toEqual({ hit: true, value: 'Новий' })
> })
>
> test('memory: ключі живуть окремо, а повторний set скидає вік', () => {
>   vi.useFakeTimers()
>   const cache = createMemoryCache()
>   cache.set('a', 1, { revalidate: 10, expire: 100 })
>   cache.set('b', 2, { revalidate: 100, expire: 1000 })
>   vi.advanceTimersByTime(8_000)
>   cache.set('a', 3, { revalidate: 10, expire: 100 })
>   vi.advanceTimersByTime(4_000)
>   expect(cache.get('a')).toEqual({ hit: true, value: 3 })
>   expect(cache.get('b')).toEqual({ hit: true, value: 2 })
> })
>
> test('memory: expire має бути більшим за revalidate', () => {
>   const cache = createMemoryCache()
>   expect(() => cache.set('x', 1, { revalidate: 10, expire: 10 })).toThrow(/expire/)
> })
>
> test('маршрут: HIT, потім STALE зі старим значенням і нове значення після фонового перерахунку', () => {
>   vi.useFakeTimers()
>   let n = 0
>   const render = vi.fn(() => ++n)
>   const route = createPrerenderedRoute(render, { revalidate: 10, expire: 3600 })
>   expect(render).toHaveBeenCalledTimes(1)
>   vi.advanceTimersByTime(5_000)
>   expect(route.get()).toEqual({ status: 'HIT', value: 1 })
>   vi.advanceTimersByTime(6_000)
>   expect(route.get()).toEqual({ status: 'STALE', value: 1 })
>   expect(render).toHaveBeenCalledTimes(1)
>   vi.advanceTimersByTime(1)
>   expect(render).toHaveBeenCalledTimes(2)
>   expect(route.get()).toEqual({ status: 'HIT', value: 2 })
> })
>
> test('маршрут: один фоновий перерахунок на кілька STALE, після expire — MISS зі свіжим значенням', () => {
>   vi.useFakeTimers()
>   let n = 0
>   const render = vi.fn(() => ++n)
>   const route = createPrerenderedRoute(render, { revalidate: 10, expire: 3600 })
>   vi.advanceTimersByTime(11_000)
>   route.get()
>   route.get()
>   vi.advanceTimersByTime(1)
>   expect(render).toHaveBeenCalledTimes(2)
>   vi.advanceTimersByTime(3_600_000)
>   expect(route.get()).toEqual({ status: 'MISS', value: 3 })
> })
> ```
>
> > [!hint]- Підказка 1
> > У `createMemoryCache` зберігай для кожного запису момент запису `at` і порівнюй `now() - at` з `revalidate * 1000`.
>
> > [!hint]- Підказка 2
> > У маршруті тримай прапорець `refreshing`, щоб кілька `STALE` запустили один перерахунок, і скидай його після оновлення значення.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createMemoryCache(now = () => Date.now()) {
> >   const entries = new Map()
> >   return {
> >     get(key) {
> >       const entry = entries.get(key)
> >       if (!entry) return { hit: false, value: undefined }
> >       const age = now() - entry.at
> >       if (age >= entry.revalidate * 1000 || age >= entry.expire * 1000) {
> >         entries.delete(key)
> >         return { hit: false, value: undefined }
> >       }
> >       return { hit: true, value: entry.value }
> >     },
> >     set(key, value, { revalidate, expire }) {
> >       if (expire <= revalidate) throw new Error('expire має бути більшим за revalidate')
> >       entries.set(key, { value, revalidate, expire, at: now() })
> >     },
> >   }
> > }
> >
> > function createPrerenderedRoute(render, { revalidate, expire }, now = () => Date.now()) {
> >   let value = render()
> >   let at = now()
> >   let refreshing = false
> >   let version = 0
> >   return {
> >     get() {
> >       const age = now() - at
> >       if (age >= expire * 1000) {
> >         // запису не було надто довго: чекаємо на свіже значення
> >         version++
> >         refreshing = false
> >         value = render()
> >         at = now()
> >         return { status: 'MISS', value }
> >       }
> >       if (age >= revalidate * 1000) {
> >         if (!refreshing) {
> >           refreshing = true
> >           const v = version
> >           setTimeout(() => {
> >             if (v !== version) return
> >             value = render()
> >             at = now()
> >             refreshing = false
> >           }, 0)
> >         }
> >         return { status: 'STALE', value }
> >       }
> >       return { status: 'HIT', value }
> >     },
> >   }
> > }
> > ```
> >
> > Різниця між двома моделями — головний висновок розділу про `cacheLife`: пререндерений маршрут віддає старе й оновлює у фоні, а runtime-запис in-memory handler після `revalidate` просто зникає, і запит чекає на нове виконання. У моделі `createMemoryCache` — саме часове старіння; тегова інвалідація runtime-записів (`revalidateTag(tag, 'max')`) віддає застаріле й оновлює у фоні. Лічильник `version` не дає застарілому фоновому перерахунку перезаписати значення, отримане після `expire`.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Caching](https://nextjs.org/docs/app/getting-started/caching) — рівні кешування, дані запиту як аргументи, повний приклад static + cached + streaming.
- 🟡 [Next.js — use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache) — ключі, серіалізація, pass-through, обмеження, налагодження.
- 🟡 [Next.js — cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife) — профілі, `stale`/`revalidate`/`expire`, пороги пререндеру, вкладені кеші.
- 🟡 [Next.js — cacheLife (next.config)](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife) — власні й перевизначені профілі.
- 🟡 [Next.js — cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag) — теги, теги з даних, ліміти.
- 🟡 [Next.js — next-request-in-use-cache](https://nextjs.org/docs/messages/next-request-in-use-cache) — чому дані запиту не пускають у кеш і як переписати.
- 🔴 [Next.js — nested-use-cache-no-explicit-cachelife](https://nextjs.org/docs/messages/nested-use-cache-no-explicit-cachelife) — помилка вкладеного короткого кешу.
- 🔴 [React — Serializable parameters and return values](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values) — правила для аргументів закешованих функцій.
- 🔴 [React — Serializable types](https://react.dev/reference/rsc/use-client#serializable-types) — правила для результату (JSX можна).
- 🛠️ [Next.js — cacheMaxMemorySize](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheMaxMemorySize) — розмір in-memory кешу при self-hosting.

> [!important] Підсумок
> - `'use cache'` кешує результат async-функції, компонента чи всіх експортів файлу **між запитами**. Записи з `next build` стають частиною static shell, runtime-записи за замовчуванням живуть у памʼяті процесу й не переживають деплой.
> - Ключ = build id + function id + серіалізовані аргументи + захоплені змінні. Значення, а не посилання: новий обʼєкт дає hit, а інший порядок полів чи `1` проти `'1'` — miss.
> - Аргументи серіалізуються суворіше за результат. Класи, функції й `Symbol` падають з «temporary client reference», `URL` тихо стає рядком, а `children` і Server Actions проходять крізь кеш як непрозорі посилання.
> - `cacheLife`: `stale` — браузер (мінімум 30 с), `revalidate` — SWR пререндереного маршруту, `expire` — межа, після якої чекають. Явний профіль у кожному кеш-скоупі: без нього вкладені кеші скорочують `default`, а короткий вкладений кеш ламає збірку.
> - `cacheTag` позначає записи для ревалідації (тема 16 основного посібника). `cookies()`, `headers()`, `searchParams`, `connection()` читай поза кешем і передавай значення: заборона діє по всьому стеку.

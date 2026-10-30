---
title: Дані на сервері
id: nextjs-core-14
slug: 14-server-data-fetching
order: 14
level: middle
skill: data
icon: px:database
tags: [nextjs, data-fetching, fetch, waterfall, promise-all, preload, react-cache, memoization, use]
prerequisites:
  - "[[Next.js - 07. Server і Client Components]]"
  - "[[Next.js - 11. Streaming і Suspense]]"
  - "[[Next.js - 12. Partial Prerendering і Cache Components]]"
estimatedMinutes: 55
nextVersion: 16.3.8
---

# Дані на сервері

> [!success] 🎯 Після цього розділу ти зможеш
> - читати дані в async Server Component через `fetch`, ORM чи SDK і пояснити, де цей код стоїть відносно static shell під `cacheComponents`;
> - за кодом передбачити, скільки чекатиме сторінка: знайти водоспад у послідовних `await` і в дереві вкладених компонентів;
> - прибрати водоспад трьома способами: `Promise.all` / `Promise.allSettled`, запуск запитів у батьківському компоненті, preload-патерн;
> - пояснити, коли `fetch` дедуплікується сам, коли потрібен `React.cache`, і чим обидва відрізняються від справжнього кешу;
> - передати проміс із сервера в Client Component і обрати, де саме чекати дані: у `Promise.all`, за окремою межею `<Suspense>` чи в `use()`.

## 🤔 Передбач

> [!quiz] Через скільки зʼявляться дані?
> level: middle · type: output · id: nextjs-core-14-quiz-01
>
> Три запити не залежать один від одного: користувач відповідає за 300 мс, замовлення за 400 мс, новини за 500 мс. Компонент стоїть під `<Suspense>`:
>
> ```tsx
> async function Dashboard() {
>   const user = await getUser() // 300 мс
>   const orders = await getOrders('u1') // 400 мс
>   const news = await getNews() // 500 мс
>   return <Cabinet user={user} orders={orders} news={news} />
> }
> ```
>
> Коли замість fallback зʼявляться дані?
>
> - [ ] Приблизно через 500 мс: сервер сам запускає незалежні запити паралельно
> - [x] Приблизно через 1200 мс: кожен `await` чекає завершення попереднього
> - [ ] Приблизно через 500 мс: `<Suspense>` робить запити дочірнього компонента паралельними
> - [ ] Приблизно через 400 мс: усереднений час трьох запитів
>
> **Пояснення:** не переймайся, якщо помилився, — це якраз тема розділу. `await` призупиняє функцію, тож `getOrders` навіть не викликається, доки `getUser` не повернувся: 300 + 400 + 500 ≈ 1200 мс (на 16.3.8 — 1206 мс). Сервер нічого не паралелить сам, а `<Suspense>` визначає лише те, що показати, поки чекаємо, а не коли стартують запити.

## 🧒 Простими словами

Уяви, що ти готуєш сніданок. Можна поставити чайник, стояти й чекати, поки закипить, потім покласти хліб у тостер і знову чекати, а потім узятися за яєчню. Сніданок буде за пів години. А можна ввімкнути все одразу: чайник, тостер і сковорідку, — і за десять хвилин усе готове разом. Продукти ті самі, плита та сама, змінився лише **порядок, у якому ти починаєш**. Водоспад запитів — це перший спосіб. А ще в тебе є блокнот: якщо двоє членів родини просять каву, ти не вариш її двічі, а наливаєш з однієї турки. Це дедуплікація. Блокнот, щоправда, викидаєш після кожного сніданку: завтра все спочатку.

## 🔬 Як це працює насправді

### 🧭 Дані там, де їх рендерять

У App Router дані читають **у самому компоненті**: Server Component може бути `async` і просто чекати результат. Ні `useEffect`, ні стану завантаження, ні окремого API-маршруту для власного UI. Підійде будь-який асинхронний I/O: `fetch` до зовнішнього API, запит через ORM чи драйвер БД, SDK платіжного сервісу, читання файлу.

```tsx
// app/blog/page.tsx — fetch прямо в компоненті
import { Suspense } from 'react'

async function Posts() {
  const res = await fetch('https://api.vercel.app/blog')
  const posts: { id: string; title: string }[] = await res.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<p>Завантаження постів…</p>}>
      <Posts />
    </Suspense>
  )
}
```

`<Suspense>` навколо `Posts` тут не прикраса: під `cacheComponents` без нього збірка зупиниться — чому, розберемо за хвилину.

Із базою даних так само: код запиту, рядок підключення і сам драйвер лишаються на сервері й не потрапляють у клієнтський бандл ([[Next.js - 07. Server і Client Components|тема 07]]). Але «на сервері» не означає «безпечно за замовчуванням»: перевірку доступу й відбір полів (DTO) роблять біля даних, у шарі доступу до даних — це тема 29 основного посібника. Підключення ORM, пули з'єднань і транзакції — у [[Next.js - 20. Бази даних і клієнтський fetching|темі 20]].

Сторінка, що читає дані в `useEffect`, проходить ланцюжок: HTML без даних → JS → hydration → запит до API → ще один рендер. Це теж водоспад, і кожна його сходинка — мережевий roundtrip. Server Component читає дані **до** того, як HTML піде в браузер, тож перший байт уже містить результат або хоча б fallback, за яким дані доїдуть у тій самій відповіді (стрімінг — [[Next.js - 11. Streaming і Suspense|тема 11]]).

Проблема в іншому. Серверні запити теж можна вишикувати в чергу, і тоді сторінка чекатиме суму їхніх часів. Про це вся решта розділу. Щоб міряти, а не гадати, нам знадобиться джерело даних з передбачуваною затримкою.

> [!note] Чому сторінкам з даними потрібен <Suspense>
> Приклади курсу зібрані з `cacheComponents: true`. Повільні дані тут імітує `slow(label, ms, value)`: вона викликає `await io()` з `next/cache` (маркер «далі I/O», як радить [[Next.js - 10. Статичний і динамічний рендеринг|тема 10]]), чекає `setTimeout` і пише в лог сервера, коли запит почався й закінчився. Під Cache Components такий доступ поза межею `<Suspense>` (або `loading.tsx`, який обгортає сторінку в ту саму межу) зупиняє `next build` з `Next.js encountered uncached or runtime data during prerendering`: дані або кешують (`'use cache'`, теми 15–16 основного посібника), або обгортають у `<Suspense>` (теми 11–12). Справжній мережевий I/O поводиться так само; виняток — локальні драйвери SQLite, які можуть відповісти без I/O (нижче). Як Next.js будує з цього static shell — у [[Next.js - 12. Partial Prerendering і Cache Components|темі 12]].

```ts
// app/lib/data.ts — імітація повільних джерел даних з логом часу
import 'server-only'
import { cache } from 'react'
import { io } from 'next/cache'

// t0 — момент першого виклику slow() у цьому запиті (React.cache — свій для кожного запиту)
const t0 = cache(() => performance.now())
const since = () => String(Math.round(performance.now() - t0())).padStart(4)

export async function slow<T>(label: string, ms: number, value: T): Promise<T> {
  await io() // далі I/O: під час prerender тут зупиняємось, у запиті — одразу далі
  t0()
  console.log(`+${since()} мс  ▶ ${label}`)
  await new Promise((resolve) => setTimeout(resolve, ms))
  console.log(`+${since()} мс  ✔ ${label}`)
  return value
}
```

```ts
// app/lib/shop.ts — три незалежні джерела даних
import 'server-only'
import { slow } from './data'

export type User = { id: string; name: string }

export const getUser = () => slow('user', 300, { id: 'u1', name: 'Оля' } as User)
export const getOrders = (userId: string) => slow(`orders(${userId})`, 400, ['#101', '#102'])
export const getNews = () => slow('news', 500, ['Знижки до -20%'])
```

`React.cache` у `t0` — той самий інструмент дедуплікації, який ми розберемо нижче: він дає одне значення на запит. `performance.now()` Next.js не вважає «випадковим» значенням, яке треба захищати, бо він призначений для телеметрії. Усі цифри в розділі — з `next start` (продакшн-збірка Next.js 16.3.8), з логів сервера і `curl -w '%{time_total}'`.

### 🧱 Дані й static shell під Cache Components

Перш ніж міряти, з'ясуймо, **де** стоїть запит до даних відносно static shell. Під `cacheComponents: true` `next build` пререндерить кожен маршрут і чекає, поки дерево відрендериться. Будь-який `await`, який не завершується одразу, — `fetch`, запит до мережевої БД і навіть звичайний `setTimeout` у промісі, — Next.js вважає незакешованими даними. Виняток — локальний SQLite-драйвер (libsql з `file:`, better-sqlite3): він може відповісти без справжнього I/O, і тоді маршрут стає `○`, а дані вшиваються в HTML на етапі збірки ([[Next.js - 20. Бази даних і клієнтський fetching]]). Якщо ж `await` справді чекає і стоїть **поза** межею `<Suspense>`, збірка зупиняється:

```tsx
// app/blocking/page.tsx — ❌ некешований fetch поза Suspense
export default async function Page() {
  const res = await fetch('http://127.0.0.1:3519/products?ms=100')
  const data = await res.json()
  return <h1>Хітів: {data.hit}</h1>
}
```

```text
Error: Route "/blocking": Next.js encountered uncached or runtime data during prerendering.
`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.
Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route
```

Три виходи — три продуктові рішення, детально в [[Next.js - 12. Partial Prerendering і Cache Components|темі 12]]. Коротко для даних:

- **`[stream]`** — дані потрібні свіжими на кожен запит. Компонент, що їх читає, стоїть за `<Suspense>`: у shell іде fallback, дані доїжджають у тій самій відповіді. Так зроблено всі приклади цього розділу.
- **`[cache]`** — дані однакові для всіх і можуть трохи застаріти. `'use cache'` на функції чи компоненті кладе результат у shell ([[Next.js - 15. Cache Components і use cache|тема 15]]); ревалідація — [[Next.js - 16. Ревалідація|тема 16]].
- **`[block]`** — `instant = false`: збирається, але shell немає, і користувач знову чекає білий екран. Інструмент міграції, а не нового коду.

Ще два факти про збірку. **`React.cache` нічого не кешує для shell**: обгорнута в нього функція поза `<Suspense>` дає ту саму помилку, бо це пам'ять на один запит, а не збережений результат. А некешований `fetch` за межею `<Suspense>` під час `next build` на 16.3.8 до API не доходить узагалі. У таблиці збірки такі маршрути позначені `◐ (Partial Prerender)`: shell зі збірки, дані — на запит.

Звідси головне правило розташування: **`await` даних став якомога нижче в дереві, біля компонента, який ці дані показує, і під межею**. Що вище стоїть `await`, то більша частина сторінки чекає на нього й випадає з shell. Документація називає це «maximizing the static shell» і застосовує той самий принцип до `params`, `cookies()` і `searchParams` (детальніше — [[#🪜 Опускай await нижче межі]]).

> [!quiz] Що станеться на next build?
> level: middle · type: single · id: nextjs-core-14-quiz-02
>
> Проєкт із `cacheComponents: true`. Функція `getUser` обгорнута в `React.cache` і ходить у мережеву БД (Postgres через `pg`). Сторінка без жодного `<Suspense>`:
>
> ```tsx
> // app/profile/page.tsx
> export default async function Page() {
>   const user = await getUser('u1')
>   return <h1>Привіт, {user.name}</h1>
> }
> ```
>
> - [ ] Збірка пройде: `React.cache` покладе результат у static shell
> - [ ] Збірка пройде: помилка стосується лише `fetch`, а запити до БД Next.js не відстежує
> - [ ] Збірка пройде, а маршрут тихо стане `ƒ` (динамічним) без попередження
> - [x] Збірка впаде: `Next.js encountered uncached or runtime data during prerendering`
>
> **Пояснення:** `React.cache` — пам'ять на один запит, а не збережений результат, тому в shell вона нічого не кладе. Будь-який `await`, що не завершується одразу (`fetch`, запит до мережевої БД, навіть `setTimeout` у промісі), поза `<Suspense>` зупиняє збірку; локальний SQLite-драйвер може відповісти без I/O, і тоді дані просто вшиваються в shell. Лікують трьома способами: `<Suspense>` навколо компонента з даними, `'use cache'` або `instant = false`.

### 🌊 Водоспад: послідовні await

**Водоспад запитів** (request waterfall) — ситуація, коли запит B починається лише після завершення запиту A, хоча B від A не залежить. Час сторінки стає **сумою** затримок замість максимуму. Найпростіша форма — кілька `await` поспіль в одному компоненті:

```tsx
// app/w/sequential/page.tsx — ❌ водоспад: три await поспіль
import { Suspense } from 'react'
import { getNews, getOrders, getUser } from '@/app/lib/shop'

async function Dashboard() {
  const user = await getUser() // 300 мс
  const orders = await getOrders('u1') // ще 400 мс — хоча userId відомий заздалегідь
  const news = await getNews() // ще 500 мс
  return (
    <section>
      <h2>Привіт, {user.name}</h2>
      <p>Замовлень: {orders.length}</p>
      <p>{news[0]}</p>
    </section>
  )
}

export default function Page() {
  return (
    <main>
      <h1>Кабінет</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  )
}
```

Лог сервера на один запит:

```text
+   0 мс  ▶ user
+ 302 мс  ✔ user
+ 303 мс  ▶ orders(u1)
+ 704 мс  ✔ orders(u1)
+ 704 мс  ▶ news
+1206 мс  ✔ news
```

Кожен `▶` стоїть рівно там, де закінчився попередній `✔`; `curl` показує `total=1.265s`. Shell приходить за мілісекунди, але дані — через 1,2 с, хоча найдовший запит триває 500 мс.

Чому так? `await` **призупиняє** виконання функції до резолву промісу. Рядок `getOrders('u1')` навіть не почав виконуватися, поки `getUser()` не повернув результат. Паралельність з'являється лише тоді, коли ти **запустив** кілька операцій, перш ніж чекати на будь-яку з них.

Як знайти водоспад у реальному застосунку, де немає зручного `slow()` з логом:

- **Логи `fetch` у `next dev`.** `logging: { fetches: { fullUrl: true } }` у `next.config.ts` друкує кожен `fetch` під рядком запиту сторінки з тривалістю й причиною пропуску кешу (`Cache skipped reason: (auto no cache)`). Тривалості, що складаються в суму часу сторінки, — ознака сходинок.
- **Трейси** OpenTelemetry: водоспад виглядає як драбина span-ів (див. [[#🏭 Як це роблять у продакшні]]).
- **Читання коду.** Два `await` поспіль, де другий не використовує результат першого, — водоспад, незалежно від інструментів.

> [!note] Лог fetch у dev показує виклики, а не запити
> Лог `logging.fetches` перелічує кожен виклик `fetch`, зокрема ті, що Next.js дедуплікував (про це — у [[#🧠 Дедуплікація: memoization fetch і React.cache]]). На 16.3.8 сторінка з трьома однаковими `fetch` у layout, page і `generateMetadata` дала в `next dev` три рядки `GET http://127.0.0.1:3519/product?ms=300 200 in …ms (cache skip)`, а API отримав один запит. Щоб порахувати справжні запити, дивись на бік API.

> [!diagram] Водоспад проти паралельного старту
> ```yaml
> layout: compare
> columns: { seq: "❌ await поспіль", par: "✅ Promise.all" }
> nodes:
>   - { id: s1, col: seq, label: "0 → 300 мс", text: "getUser()", note: "orders і news ще не почались", tone: orange }
>   - { id: s2, col: seq, label: "300 → 700 мс", text: "getOrders('u1')", note: "стартує після user", tone: orange }
>   - { id: s3, col: seq, label: "700 → 1200 мс", text: "getNews()", note: "стартує після orders", tone: red, icon: "px:hourglass" }
>   - { id: p1, col: par, label: "0 мс", text: "user · orders · news", note: "усі три стартують одразу", tone: blue, icon: "px:bolt" }
>   - { id: p2, col: par, label: "300 / 400 / 500 мс", text: "закінчуються по черзі", note: "Promise.all чекає останній", tone: green }
>   - { id: p3, col: par, label: "≈ 500 мс", text: "дані на екрані", note: "максимум, а не сума", tone: green, icon: "px:check" }
> steps:
>   - { show: [s1, p1], note: "Ліворуч перший await зупиняє функцію: getOrders ще навіть не викликано. Праворуч усі три запити запущені до першого await." }
>   - { show: [s2, p2], note: "Ліворуч orders стартує лише о 300 мс. Праворуч запити вже біжать паралельно й завершуються кожен у свій час." }
>   - { show: [s3, p3], note: "Ліворуч сума: 300 + 400 + 500 = 1200 мс. Праворуч — найдовший запит, 500 мс. Дані ті самі, змінився лише момент старту." }
> ```
> Цифри — з логу сервера: 1206 мс проти 501 мс.

> [!quiz] Коли стартує третій запит і коли зʼявляться дані?
> level: middle · type: output · id: nextjs-core-14-quiz-03
>
> Три незалежні запити (200, 300 і 100 мс) в одному компоненті під `<Suspense>`:
>
> ```tsx
> async function Panel() {
>   const stats = await getStats() // 200 мс
>   const feed = await getFeed() // 300 мс
>   const tips = await getTips() // 100 мс
>   return <Board stats={stats} feed={feed} tips={tips} />
> }
> ```
>
> - [ ] Дані через ≈ 300 мс; `getTips` стартує одразу, о 0 мс
> - [ ] Дані через ≈ 600 мс; `getTips` стартує одразу, о 0 мс, бо `<Suspense>` запускає запити паралельно
> - [x] Дані через ≈ 600 мс; `getTips` стартує о ≈ 500 мс
> - [ ] Дані через ≈ 300 мс; `getTips` стартує о ≈ 200 мс
>
> **Пояснення:** кожен `await` чекає попередній запит: `getFeed` стартує о 200 мс, `getTips` о 500 мс (200 + 300), а закінчується все о 600 мс. «≈ 300 мс» — це найдовший запит, який був би результатом `Promise.all`. `<Suspense>` не змінює порядок запитів усередині одного компонента.

### ⚡ Promise.all і Promise.allSettled

Ліки від сходинок у межах одного компонента — **спершу запустити, потім чекати**. Виклик async-функції одразу запускає її тіло й повертає проміс; `Promise.all` лише чекає, поки зарезолвляться всі:

```tsx
// app/w/parallel/page.tsx — ✅ запускаємо все одразу, чекаємо разом
async function Dashboard() {
  const [user, orders, news] = await Promise.all([getUser(), getOrders('u1'), getNews()])
  return (
    <section>
      <h2>Привіт, {user.name}</h2>
      <p>Замовлень: {orders.length}</p>
      <p>{news[0]}</p>
    </section>
  )
}
```

```text
+   0 мс  ▶ user
+   0 мс  ▶ orders(u1)
+   0 мс  ▶ news
+ 300 мс  ✔ user
+ 401 мс  ✔ orders(u1)
+ 501 мс  ✔ news
```

`total=0.513s` замість `1.265s`. Важливо розуміти, **що саме** зробило код швидшим: не `Promise.all`, а те, що всі три виклики стоять у масиві й виконуються до першого `await`. Те саме дає запис «спершу проміси, потім `await`»:

```ts
const userP = getUser()
const ordersP = getOrders('u1')
const newsP = getNews()
const user = await userP // запити вже біжать; тут лише чекаємо
```

А от `await` у циклі — той самий водоспад, тільки замаскований:

```tsx
// app/w/loop/page.tsx — await у циклі проти Promise.all
const getProduct = (id: string) => slow(`product ${id}`, 200, { id, title: `Товар ${id}` })
const ids = ['a', 'b', 'c']

async function Slow() {
  const items = []
  for (const id of ids) items.push(await getProduct(id)) // ❌ 3 × 200 мс
  return <p>{items.length}</p>
}

async function Fast() {
  const items = await Promise.all(ids.map(getProduct)) // ✅ ≈ 200 мс
  return <p>{items.length}</p>
}
```

На 16.3.8 `Slow` займає 640 мс (`product b` стартує о +202, `c` — о +403), `Fast` — 212 мс. Це класична проблема **N+1**. Для БД краще за `Promise.all` — один запит з `WHERE id IN (…)`: сотня паралельних запитів виснажить пул з'єднань ([[Next.js - 20. Бази даних і клієнтський fetching|тема 20]]).

**`Promise.all` падає цілком**, якщо відхилився хоч один проміс. Для сторінки це означає: впав сервіс новин — і замість кабінету `error.tsx`. Якщо блок необов'язковий, бери `Promise.allSettled`: він чекає всі проміси й повертає статус кожного.

```tsx
// app/w/settled/page.tsx — новини впали, кабінет живий
const getNews = async (): Promise<string[]> => {
  await slow('news', 500, null)
  throw new Error('news service down')
}

async function Dashboard() {
  const [user, orders, news] = await Promise.allSettled([getUser(), getOrders('u1'), getNews()])
  if (user.status === 'rejected') throw user.reason // без користувача сторінки немає
  return (
    <section>
      <h2>Привіт, {user.value.name}</h2>
      <p>Замовлень: {orders.status === 'fulfilled' ? orders.value.length : '—'}</p>
      <p>{news.status === 'fulfilled' ? news.value[0] : 'Новини тимчасово недоступні'}</p>
    </section>
  )
}
```

Сторінка відповідає `200` за ≈ 520 мс, а в HTML — «Новини тимчасово недоступні». Обов'язкові дані (користувач) усе одно кидаємо далі, щоб спрацювала межа помилок ([[Next.js - 13. Помилки й межі помилок|тема 13]]). Ще краще — винести необов'язковий блок в окремий компонент з власною межею.

**Справжня залежність** — інша справа: замовлення потребують `user.id`, і раніше за користувача їх не запитаєш. Але це не привід чекати новини. Залежний запит можна причепити до промісу через `.then`, а незалежні — запустити одразу:

```tsx
// app/w/chained/page.tsx — справжня залежність: orders потребує user.id
async function Dashboard() {
  const userP = getUser()
  const ordersP = userP.then((u) => getOrders(u.id)) // стартує, щойно є user.id
  const newsP = getNews() // незалежний — стартує одразу
  const [user, orders, news] = await Promise.all([userP, ordersP, newsP])
  return (
    <section>
      <h2>Привіт, {user.name}</h2>
      <p>Замовлень: {orders.length}</p>
      <p>{news[0]}</p>
    </section>
  )
}
```

```text
+   0 мс  ▶ user
+   0 мс  ▶ news
+ 301 мс  ✔ user
+ 301 мс  ▶ orders(u1)
+ 502 мс  ✔ news
+ 702 мс  ✔ orders(u1)
```

Ланцюжок `user → orders` займає 300 + 400 = 700 мс, новини встигли за цей час: 715 мс замість 1,2 с. **Час сторінки — найдовший шлях у графі залежностей**, а не сума вузлів. Якщо він завеликий, допоможе не `Promise.all`, а кеш першого запиту ([[Next.js - 15. Cache Components і use cache|тема 15]]) або API, що віддає дані одним запитом.

> [!quiz] Заповни пропуски: обовʼязкові дані разом, необовʼязковий блок окремо
> level: middle · type: fill · bank: Promise.race, rejected, useEffect · id: nextjs-core-14-quiz-04
>
> ```tsx fill
> // обовʼязкові дані: впав один — не потрібна й сторінка
> const [user, orders] = await [[Promise.all]]([getUser(), getOrders('u1')])
>
> // необовʼязковий блок: його падіння не валить кабінет
> const [news] = await [[Promise.allSettled]]([getNews()])
> const text = news.status === '[[fulfilled]]' ? news.value[0] : 'Новини недоступні'
> ```
>
> **Пояснення:** обидва запити в масиві стартують до першого `await`, тому час дорівнює найдовшому. `Promise.all` відхиляється, щойно відхилився будь-який проміс, а `Promise.allSettled` завжди чекає всіх і повертає `{ status: 'fulfilled', value }` або `{ status: 'rejected', reason }`. `Promise.race` повернув би лише найшвидший результат, а `useEffect` — клієнтський хук, у Server Component його немає. Типова помилка — поставити `await` усередину масиву (`[await getUser(), await getOrders('u1')]`): він повертає водоспад.

> [!quiz] Скільки триватиме компонент із залежним запитом?
> level: middle · type: output · id: nextjs-core-14-quiz-05
>
> `getUser` — 300 мс, `getOrders(user.id)` — 400 мс (потребує id користувача), `getNews` — 500 мс (незалежний):
>
> ```tsx
> async function Dashboard() {
>   const userP = getUser()
>   const ordersP = userP.then((u) => getOrders(u.id))
>   const newsP = getNews()
>   const [user, orders, news] = await Promise.all([userP, ordersP, newsP])
>   return <Cabinet user={user} orders={orders} news={news} />
> }
> ```
>
> Скільки мс чекатиме користувач?
>
> - [ ] ≈ 1200 мс: сума трьох запитів
> - [ ] ≈ 500 мс: найдовший окремий запит
> - [ ] ≈ 900 мс: user + news + частина orders
> - [x] ≈ 700 мс: найдовший шлях user → orders
>
> **Пояснення:** час сторінки — найдовший шлях у графі залежностей, а не сума вузлів. Ланцюжок `user → orders` дає 300 + 400 = 700 мс, а новини (500 мс) встигають за цей час. У вимірі вийшло 715 мс. «500 мс» було б правильним, якби `orders` не залежав від `user`.

### 🪆 Водоспад компонентів

Друга форма водоспаду ховається не в одному компоненті, а в **дереві**. React рендерить дочірній компонент лише тоді, коли батько повернув JSX. Якщо батько спершу чекає свої дані, діти почнуть свої запити тільки після цього:

```tsx
// app/w/nested/page.tsx — ❌ водоспад компонентів: дитина стартує після батька
async function Profile() {
  const user = await getUser()
  return (
    <section>
      <h2>Привіт, {user.name}</h2>
      <Orders userId={user.id} />
    </section>
  )
}

async function Orders({ userId }: { userId: string }) {
  const orders = await getOrders(userId)
  return (
    <>
      <p>Замовлень: {orders.length}</p>
      <News />
    </>
  )
}

async function News() {
  const news = await getNews() // не залежить ні від кого, але стартує останнім
  return <p>{news[0]}</p>
}
```

Лог такий самий, як у послідовних `await`: `user` 0–301, `orders` 301–702, `news` 703–1204; `curl` — 1,22 с. Кожен компонент сам отримує свої дані, як і радить документація, але **вкладеність JSX стала порядком запитів**. `News` нічого не потребує від батьків, але його функція навіть не викликана, доки `Orders` не відрендерився.

А **сусіди** рендеряться одночасно. Ті самі три компоненти поруч в одній межі:

```tsx
// app/w/siblings/page.tsx — сусідні async-компоненти
export default function Page() {
  return (
    <main>
      <h1>Кабінет</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Greeting />
        <Orders />
        <News />
      </Suspense>
    </main>
  )
}
```

Тут `Greeting`, `Orders` і `News` — окремі async-компоненти: усі три `▶` о +0 мс, разом 514 мс. React викликає всі дочірні елементи, які вже бачить. Так само паралельно рендеряться **layout і page** одного маршруту: два запити по 500 мс у них займають 511 мс, а не секунду.

Висновок: **паралельність дає структура дерева, а не `<Suspense>`**. Межа вирішує, *коли показати* вміст, а *коли почати* запит, вирішує те, чи бачить React компонент одразу. Отже, три способи прибрати водоспад компонентів:

1. **Зробити компоненти сусідами**, якщо вони не залежать один від одного. Найчастіше це просто перестановка JSX.
2. **Запустити запити вище**, у батьку, і передати вниз **проміси**, а не значення. Діти чекають `await` уже запущених запитів.
3. **Preload** — запустити запит дитини наперед, поки батько чекає своє (наступний розділ).

Другий спосіб у коді:

```tsx
// app/w/hoisted/page.tsx — ✅ батько запускає запити, діти чекають проміси
import { Suspense } from 'react'
import { getNews, getOrders, getUser, type User } from '@/app/lib/shop'

async function Profile({ user, orders, news }: {
  user: Promise<User>
  orders: Promise<string[]>
  news: Promise<string[]>
}) {
  const { name } = await user
  return (
    <section>
      <h2>Привіт, {name}</h2>
      <Orders orders={orders} news={news} />
    </section>
  )
}

async function Orders({ orders, news }: { orders: Promise<string[]>; news: Promise<string[]> }) {
  const list = await orders
  return (
    <>
      <p>Замовлень: {list.length}</p>
      <News news={news} />
    </>
  )
}

async function News({ news }: { news: Promise<string[]> }) {
  const items = await news
  return <p>{items[0]}</p>
}

export default function Page() {
  // запускаємо всі три запити тут, без await
  const user = getUser()
  const orders = getOrders('u1')
  const news = getNews()
  return (
    <main>
      <h1>Кабінет</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Profile user={user} orders={orders} news={news} />
      </Suspense>
    </main>
  )
}
```

Вкладеність та сама, а лог — як у `Promise.all`: три `▶` о +0, 514 мс разом. `Page` нічого не чекає, тож сторінка й fallback лишаються в shell. Ціна — «prop drilling» промісів; коли шарів багато, preload або дедуплікована функція читаються краще.

> [!diagram] Водоспад компонентів: коли кожен компонент починає запит
> ```yaml
> layout: tree
> nodes:
>   - { id: page, label: "Page", text: "без await", note: "shell + fallback", tone: blue, icon: "px:file" }
>   - { id: prof, label: "Profile", code: "await getUser()", note: "0 → 300 мс", parent: page, tone: orange }
>   - { id: ord, label: "Orders", code: "await getOrders(user.id)", note: "300 → 700 мс: чекав батька", parent: prof, tone: orange }
>   - { id: news, label: "News", code: "await getNews()", note: "700 → 1200 мс: чекав двох батьків", parent: ord, tone: red, icon: "px:hourglass" }
>   - { id: fix, label: "Виправлення", text: "запустити в Page, передати проміси", note: "усі три стартують о 0 мс → 500 мс", parent: page, tone: green, icon: "px:check" }
> steps:
>   - { show: page, note: "Page синхронна, тож одразу рендерить Profile. Shell із fallback уже готовий." }
>   - { show: prof, note: "Profile чекає користувача 300 мс. Доки він не поверне JSX, React не знає про Orders." }
>   - { show: ord, note: "Лише о 300 мс React бачить Orders і викликає getOrders. Їй справді потрібен user.id — ця сходинка чесна." }
>   - { show: news, note: "News не потребує нічого від батьків, але стартує о 700 мс: вкладеність JSX стала порядком запитів." }
>   - { show: fix, note: "Якщо запустити всі запити в Page і передати проміси вниз, вкладеність лишається, а старт — спільний: ≈500 мс." }
> ```
> Водоспад компонентів не видно в жодному окремому файлі — лише в дереві.

> [!quiz] Коли зʼявляться Sidebar, Feed і Comments?
> level: middle · type: output · id: nextjs-core-14-quiz-06
>
> Layout і сторінка одного маршруту, кожен зі своєю межею. `Feed` рендерить дочірній `Comments`:
>
> ```tsx
> // app/layout.tsx
> <Suspense fallback={<Skeleton />}><Sidebar /></Suspense> // await 400 мс
> {children}
>
> // app/page.tsx
> <Suspense fallback={<Skeleton />}><Feed /></Suspense> // await 400 мс
>
> // Feed.tsx: після свого await рендерить <Comments />, а той робить await 300 мс
> ```
>
> - [ ] Sidebar ≈ 400, Feed ≈ 800, Comments ≈ 1100 мс: спершу layout, потім page
> - [ ] Sidebar, Feed і Comments разом ≈ 400 мс: межі запускають усе паралельно
> - [ ] Sidebar ≈ 400, Feed ≈ 400, Comments ≈ 300 мс: дитина не чекає батька
> - [x] Sidebar ≈ 400, Feed ≈ 400, Comments ≈ 700 мс
>
> **Пояснення:** layout і page рендеряться паралельно (на 16.3.8 два запити по 500 мс дали 511 мс разом), тож `Sidebar` і `Feed` стартують о 0 мс. А `Comments` React бачить лише після того, як `Feed` дочекався даних: 400 + 300 = 700 мс. Вкладеність JSX стає порядком запитів, а межа `<Suspense>` цього не змінює.

> [!quiz] Склади лог сервера для сторінки з залежним запитом
> level: middle · type: order · id: nextjs-core-14-quiz-07
>
> `userP = getUser()` (300 мс), `ordersP = userP.then((u) => getOrders(u.id))` (400 мс), `newsP = getNews()` (500 мс), далі `await Promise.all([userP, ordersP, newsP])`. Склади рядки логу у порядку, в якому вони зʼявляться. Один рядок зайвий.
>
> ```order
> +   0 мс  ▶ user
> +   0 мс  ▶ news
> + 300 мс  ✔ user
> + 300 мс  ▶ orders(u1)
> + 500 мс  ✔ news
> + 700 мс  ✔ orders(u1)
> +   0 мс  ▶ orders(u1) // ✗
> ```
>
> **Пояснення:** `.then` лише підписується на проміс: `getOrders` викличеться, коли `getUser` зарезолвиться, тобто о 300 мс, а не одразу. `getNews` не залежить ні від кого й стартує разом з `getUser`. Рядок «`▶ orders(u1)` о 0 мс» — типова помилка тих, хто думає, що `.then` запускає колбек наперед.

### 🚀 Preload: почни раніше, споживай пізніше

Буває, що батько **мусить** чекати перед рендером дитини: наприклад, сторінка замовлень спершу перевіряє права і тільки потім рендерить `<Orders>`. `userId` відомий заздалегідь, але запит стартує після перевірки:

```text
/w/nopreload — без preload
+   0 мс  ▶ access(u1)
+ 301 мс  ✔ access(u1)
+ 301 мс  ▶ orders(u1)
+ 703 мс  ✔ orders(u1)
```

**Preload-патерн** розриває цю сходинку: виклич функцію даних **без `await`** перед блокуючою роботою, а потім виклич її ще раз у компоненті, що споживає результат. Другий виклик має повернути **той самий** запит, тому функція мусить дедуплікуватися — тут через `React.cache`:

```tsx
// app/w/preload/orders.tsx — preload живе поруч із компонентом-споживачем
import { cache } from 'react'
import { slow } from '@/app/lib/data'

const getOrders = cache((userId: string) => slow(`orders(${userId})`, 400, ['#101', '#102']))

export const preloadOrders = (userId: string) => {
  void getOrders(userId) // запускаємо без await
}

export async function Orders({ userId }: { userId: string }) {
  const orders = await getOrders(userId) // той самий проміс, що й у preload
  return <p>Замовлень: {orders.length}</p>
}
```

```tsx
// app/w/preload/page.tsx
import { Suspense } from 'react'
import { checkAccess } from '@/app/lib/access'
import { Orders, preloadOrders } from './orders'

async function Content() {
  preloadOrders('u1') // замовлення вантажаться, поки перевіряємо доступ
  const allowed = await checkAccess('u1')
  if (!allowed) return <p>Немає доступу</p>
  return <Orders userId="u1" />
}

export default function Page() {
  return (
    <main>
      <h1>Мої замовлення</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Content />
      </Suspense>
    </main>
  )
}
```

```text
+   0 мс  ▶ orders(u1)
+   0 мс  ▶ access(u1)
+ 300 мс  ✔ access(u1)
+ 400 мс  ✔ orders(u1)
```

717 мс → 412 мс. `orders(u1)` стартував першим і лише один раз: виклик у `Orders` отримав проміс, що вже біг. Деталі, які легко пропустити:

- **`void`** — явний сигнал «проміс навмисно не чекаємо» (і тиша для `no-floating-promises`).
- **Preload — поруч зі споживачем**, у файлі компонента: приберуть компонент — зникне й preload.
- **Без дедуплікації preload шкодить.** Та сама сторінка, але `getOrders` без `cache`: лог показує **два** `▶ orders(u1)` (о +0 і о +302) і 713 мс — preload зробив зайвий запит і нічого не прискорив.
- **Preload не скасовується.** Якщо доступу немає, запит замовлень усе одно відбувся. Для дорогих чи чутливих операцій — «спершу перевірка, потім запит»; preload — для читань, що й так відбулися б майже завжди.

Чим дедуплікувати, залежить від джерела. Для `fetch` нічого робити не треба: однакові GET-запити дедуплікуються автоматично. Для ORM чи SDK — `React.cache`. Під Cache Components можна взяти й `'use cache'`, якщо дані спільні для всіх, а для функцій, що читають `cookies()` чи `headers()`, документація пропонує `'use cache: private'`: у продакшні збіг викликів у межах запиту теж повертає один результат, але нічого не зберігається на сервері між запитами (обидві директиви — [[Next.js - 15. Cache Components і use cache|тема 15]] і [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers|тема 18]]).

> [!quiz] Скільки запитів до БД і скільки часу?
> level: middle · type: single · id: nextjs-core-14-quiz-08
>
> Preload-патерн, але функція даних — звичайний ORM-виклик **без** `React.cache`. Перевірка доступу триває 300 мс, запит замовлень — 400 мс:
>
> ```tsx
> async function Content() {
>   preloadOrders('u1') // void getOrders('u1'), без await
>   const allowed = await checkAccess('u1') // 300 мс
>   if (!allowed) return <p>Немає доступу</p>
>   return <Orders userId="u1" /> // усередині: await getOrders('u1')
> }
> ```
>
> - [ ] Один запит і ≈ 400 мс: preload сам дедуплікує однакові виклики
> - [ ] Помилка: async-функцію не можна викликати без `await`
> - [ ] Два запити, але ≈ 400 мс: другий виклик нічого не чекає
> - [x] Два запити до БД і ≈ 700 мс
>
> **Пояснення:** без `React.cache` другий виклик у `Orders` запускає новий запит о 300 мс (після перевірки доступу) і закінчується о 700 мс. Preload тільки навантажив БД зайвим запитом і нічого не прискорив (на 16.3.8 — два `▶ orders` і 713 мс). З `cache` було б 412 мс і один запит. Виклик без `await` дозволений, `void` лише позначає наміри.

### 🧠 Дедуплікація: memoization fetch і React.cache

Коли дані читає кожен компонент, якому вони потрібні, `getUser()` викликають layout, хедер, сайдбар і сторінка. Щоб це не стало чотирма запитами до БД, є два механізми **memoization** — запам'ятовування результату функції на час одного рендеру.

**1. Memoization `fetch`.** GET- і HEAD-запити з однаковою адресою дедуплікуються автоматично протягом одного рендер-проходу: у Server Components, layouts, pages, `generateMetadata`, `generateViewport`, `generateStaticParams`. Перевіримо, що саме вважається «однаковим». Шість компонентів на одній сторінці:

```tsx
// app/f/page.tsx — шість fetch на одну адресу: скільки запитів дійде до API?
import { Suspense } from 'react'

const API = 'http://127.0.0.1:3519/products?ms=300'

async function Same1() {
  const r = await fetch(API)
  return <p>Same1: hit {(await r.json()).hit}</p>
}
async function Same2() {
  const r = await fetch(API)
  return <p>Same2: hit {(await r.json()).hit}</p>
}
async function NoStore() {
  const r = await fetch(API, { cache: 'no-store' })
  return <p>NoStore: hit {(await r.json()).hit}</p>
}
async function OtherHeaders() {
  const r = await fetch(API, { headers: { 'x-lang': 'en' } })
  return <p>OtherHeaders: hit {(await r.json()).hit}</p>
}
async function Post() {
  const r = await fetch(API, { method: 'POST' })
  return <p>Post: hit {(await r.json()).hit}</p>
}
async function WithSignal() {
  const { signal } = new AbortController()
  const r = await fetch(API, { signal })
  return <p>WithSignal: hit {(await r.json()).hit}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>…</p>}>
      <Same1 />
      <Same2 />
      <NoStore />
      <OtherHeaders />
      <Post />
      <WithSignal />
    </Suspense>
  )
}
```

Лог тестового API на один запит сторінки — **чотири** запити, не шість:

```text
#1 GET /products?ms=300 x-lang=-
#2 GET /products?ms=300 x-lang=en
#3 POST /products?ms=300 x-lang=-
#4 GET /products?ms=300 x-lang=-
```

`Same1`, `Same2` і `NoStore` злилися в запит `#1`. Інший заголовок (`#2`) — інший запит. `POST` не дедуплікується (`#3`): це може бути мутація. `signal` від `AbortController` — офіційний спосіб відмовитися від memoization (`#4`). На 16.3.8 `{ cache: 'no-store' }` і `{ next: { revalidate: 0 } }` теж не відокремлюють запит від звичайного `fetch(url)`. Документація пише «same URL and options», але ключ складають URL, метод, заголовки й мережеві опції на кшталт `mode` і `credentials`, а опції **кешування** на нього не впливають: memoization і кеш — різні речі. Одна поправка: `cache: 'force-cache'` спершу питає постійний fetch-кеш, ще до memoization, тож може повернути дані, збережені під час збірки.

Цю різницю часто плутають на співбесідах. **Memoization** живе один рендер-прохід: наступний захід на сторінку знову йде в API. **Кеш** (`'use cache'`, Data Cache зі старої моделі) зберігає результат між запитами й користувачами. `cache: 'no-store'` вимикає кеш, але не memoization. І ще одне: у Route Handlers memoization немає взагалі, бо вони не частина дерева React ([[Next.js - 19. Route Handlers і Backend-for-Frontend|тема 19]]).

Межі сегментів memoization не заважають: однаковий `fetch` у layout, `page.tsx` і `generateMetadata` дає **один** запит до API на захід.

**2. `React.cache` для всього, що не `fetch`.** ORM, драйвер БД, SDK, читання файлу — memoization `fetch` їх не стосується. Тут функцію обгортають у `cache` з `react`:

```ts
// app/lib/user.ts — один виклик на запит, хоч скільки компонентів питає
import 'server-only'
import { cache } from 'react'
import { slow } from './data'

export const getUser = cache(async (id: string) => {
  return slow(`db: user ${id}`, 200, { id, name: 'Оля', plan: 'pro' })
})
```

Layout з хедером і сторінка з двома компонентами викликають `getUser('u1')` тричі:

```tsx
// app/d/react-cache/page.tsx
import { Suspense } from 'react'
import { getUser } from '@/app/lib/user'

async function Plan() {
  const user = await getUser('u1')
  return <p>Тариф: {user.plan}</p>
}

async function Greeting() {
  const user = await getUser('u1')
  return <h1>Привіт, {user.name}</h1>
}

export default function Page() {
  return (
    <Suspense fallback={<p>…</p>}>
      <Greeting />
      <Plan />
    </Suspense>
  )
}
```

З `cache` у лозі один `▶ db: user u1` на запит сторінки. Без `cache` — три `▶` одночасно, тобто три запити до БД. Наступний захід знову дає один `▶`: кожен запит отримує власну область memoization.

Правила `React.cache`, на яких спотикаються:

- **Оголошуй один раз, на рівні модуля, і експортуй.** Кожен виклик `cache(fn)` створює нову функцію з власною пам'яттю. `cache(...)` усередині компонента — нова пам'ять на кожен рендер, тобто жодної дедуплікації.
- **Аргументи порівнюються за посиланням** (`Object.is`). `getUserByQuery({ id: 'u1' })` у двох компонентах — два різні обʼєкти, і в лозі два запити. Передавай примітиви: `getUser('u1')`.
- **Помилки теж запам'ятовуються.** Якщо функція кинула помилку для цих аргументів, наступні виклики в тому самому запиті отримають ту саму помилку без повторної спроби: два компоненти, що викликали «зламану» функцію, дали лише одну спробу. Повтор — у новому запиті (`retry()` у межі помилок, [[Next.js - 13. Помилки й межі помилок|тема 13]]).
- **Лише в Server Components і лише під час рендеру.** Виклик поза компонентом (наприклад, на рівні модуля) виконає функцію, але не прочитає і не оновить пам'ять — так попереджає документація React.
- **Ізольований усередині `'use cache'`.** Значення, покладені в `React.cache` ззовні, всередині кешованої функції не видно; дані в неї передають аргументами ([[Next.js - 15. Cache Components і use cache|тема 15]]).

> [!diagram] Область memoization — один запит
> ```yaml
> layout: nest
> nodes:
>   - { id: r1, label: "запит 1", text: "GET /d/react-cache", tone: blue, icon: "px:monitor" }
>   - { id: s1, label: "React.cache · запит 1", code: "getUser('u1') → проміс №1", parent: r1, tone: violet }
>   - { id: h1, label: "layout · Header", text: "getUser('u1')", note: "запускає запит до БД", parent: s1, tone: orange, icon: "px:database" }
>   - { id: g1, label: "page · Greeting + Plan", text: "getUser('u1') ×2", note: "отримують проміс №1", parent: s1, tone: green, icon: "px:check" }
>   - { id: r2, label: "запит 2", text: "GET /d/react-cache", tone: blue, icon: "px:monitor" }
>   - { id: s2, label: "React.cache · запит 2", code: "getUser('u1') → проміс №2", note: "порожня пам'ять", parent: r2, tone: violet }
> steps:
>   - { show: [r1, s1], note: "Кожен запит сторінки отримує власну пам'ять React.cache. Ключ — функція плюс аргументи." }
>   - { show: h1, note: "Перший виклик getUser('u1') в цьому запиті — промах: функція запускає запит до БД і запам'ятовує проміс." }
>   - { show: g1, note: "Greeting і Plan викликають getUser('u1') з тим самим аргументом і отримують той самий проміс. У лозі — один ▶." }
>   - { show: [r2, s2], note: "Наступний запит починає з порожньої пам'яті й знову йде в БД. Щоб пам'ятати між запитами, потрібен справжній кеш — 'use cache'." }
> ```
> Memoization прибирає дублікати всередині запиту, а не запити між користувачами.

| | Memoization `fetch` | `React.cache` | `'use cache'` |
|---|---|---|---|
| Для чого | GET-запити `fetch` | будь-яка функція: ORM, SDK, файл | функція або компонент |
| Вмикається | автоматично | обгорткою `cache(fn)` | директивою (+ `cacheComponents`) |
| Ключ | URL + метод (GET/HEAD) + заголовки + `mode`/`credentials`… (без опцій кешу) | функція + аргументи за `Object.is` | функція + серіалізовані аргументи + замикання + build ID |
| Скільки живе | один рендер-прохід | один запит | між запитами, за `cacheLife` |
| Дає дані в shell | ні | ні | так |
| Тема | ця | ця | [[Next.js - 15. Cache Components і use cache|15]] |

> [!quiz] Скільки запитів отримає API?
> level: middle · type: output · id: nextjs-core-14-quiz-09
>
> П'ять компонентів на одній сторінці роблять (A і B — різні URL):
>
> ```ts
> fetch(A)
> fetch(A)
> fetch(A, { cache: 'no-store' })
> fetch(A, { method: 'POST' })
> fetch(B)
> ```
>
> Скільки запитів дійде до API за один захід на сторінку і скільки за два заходи поспіль?
>
> - [ ] 2 і 4: `no-store` і `POST` теж зливаються зі звичайним `fetch(A)`
> - [ ] 4 і 8: `no-store` не зливається зі звичайним, запит окремий
> - [ ] 3 і 3: memoization діє й між запитами сторінки
> - [x] 3 і 6
>
> **Пояснення:** три `GET` до A (звичайні й з `no-store`) зливаються в один: опції кешування не входять у ключ memoization. `POST` не дедуплікується, `B` — інша адреса: разом 3. Memoization живе лише в межах одного рендер-проходу, тож другий захід знову дає 3 запити, разом 6. Щоб пам'ятати між заходами, потрібен справжній кеш (`'use cache'`).

> [!quiz] Обери правдиві твердження про React.cache
> level: middle · type: multi · id: nextjs-core-14-quiz-10
>
> - [x] Одна область пам'яті на один запит: наступний запит починає з порожньої
> - [x] Аргументи порівнюються за `Object.is`, тому обʼєкт-літерал щоразу дає новий ключ
> - [x] Якщо функція кинула помилку, наступні виклики в цьому запиті отримають ту саму помилку
> - [ ] Результат переживає запит і потрапляє в static shell
> - [ ] `cache(fn)` усередині компонента дедуплікує виклики між різними компонентами
> - [ ] Обов'язковий і для `fetch` GET, інакше однакові запити не зіллються
>
> **Пояснення:** `React.cache` дає memoization на один запит, а не кеш: у shell нічого не потрапляє, і наступний `curl` знову йде в БД. `cache(fn)` усередині компонента створює нову функцію з порожньою пам'яттю на кожен рендер, тож дедуплікації не буде: оголошуй на рівні модуля. Для `fetch` GET дедуплікація автоматична, `React.cache` потрібен ORM, SDK і читанню файлів.

### 🤝 Проміс у Client Component: use()

Інтерактивному компоненту — таблиці з сортуванням, графіку з перемикачем — теж потрібні серверні дані. Найгірший варіант — `useEffect` з `fetch` до власного Route Handler: це той самий клієнтський водоспад, з якого ми почали, плюс зайвий HTTP-шар. Кращий — **почати запит на сервері, а розгорнути на клієнті**. Server Component викликає функцію даних без `await` і передає проміс як prop; Client Component читає його через `use()`. Механіку `use()`, межі й правила розібрано в [[Next.js - 11. Streaming і Suspense|темі 11]], тут — погляд з боку даних:

```ts
// app/lib/orders.ts
import 'server-only'
import { cache } from 'react'
import { slow } from './data'

export type Order = { id: string; total: number }

export const getOrders = cache((userId: string) =>
  slow(`db: orders ${userId}`, 400, [
    { id: '#101', total: 1200 },
    { id: '#102', total: 450 },
    { id: '#103', total: 3100 },
  ] as Order[]),
)
```

```tsx
// app/u/orders-table.tsx — інтерактивна таблиця читає проміс через use()
'use client'

import { use, useState } from 'react'
import type { Order } from '@/app/lib/orders'

export function OrdersTable({ orders }: { orders: Promise<Order[]> }) {
  const list = use(orders)
  const [desc, setDesc] = useState(true)
  const sorted = [...list].sort((a, b) => (desc ? b.total - a.total : a.total - b.total))
  return (
    <table>
      <thead>
        <tr>
          <th>Замовлення</th>
          <th>
            <button onClick={() => setDesc(!desc)}>Сума {desc ? '↓' : '↑'}</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((o) => (
          <tr key={o.id}>
            <td>{o.id}</td>
            <td>{o.total} ₴</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

```tsx
// app/u/page.tsx — сервер запускає запит, клієнт розгортає проміс
import { Suspense } from 'react'
import { getOrders } from '@/app/lib/orders'
import { OrdersTable } from './orders-table'

async function OrdersCount() {
  const orders = await getOrders('u1') // React.cache: той самий запит, що й для таблиці
  return <p>Усього замовлень: {orders.length}</p>
}

export default function Page() {
  const orders = getOrders('u1') // без await: проміс піде в Client Component
  return (
    <main>
      <h1>Замовлення</h1>
      <Suspense fallback={<p>Рахуємо…</p>}>
        <OrdersCount />
      </Suspense>
      <Suspense fallback={<p>Таблиця…</p>}>
        <OrdersTable orders={orders} />
      </Suspense>
    </main>
  )
}
```

Заголовок і обидва fallback-и приходять у першому чанку HTML, а лічильник і рядки таблиці — через ≈ 400 мс. Запит до БД у лозі **один**: серверний `OrdersCount` і клієнтська таблиця отримали той самий проміс завдяки `React.cache`. Таблиця відрендерилась на сервері (рядок `#103` уже в HTML), а після hydration клік по «Сума ↓» пересортував рядки в браузері без жодного запиту.

Коли що обирати:

- **`await` на сервері** — дані потрібні лише для рендеру, без клієнтського стану. У браузер іде готовий результат.
- **Проміс + `use()`** — дані потрібні інтерактивному компоненту. Запит стартує на сервері якомога раніше, без `useEffect`. Якщо проміс потрібен багатьом Client Components, його кладуть у контекст-провайдер (`single-page-applications.md` у документації).
- **SWR / TanStack Query** — поллінг, ревалідація при фокусі, нескінченний скрол, оптимістичні мутації ([[Next.js - 20. Бази даних і клієнтський fetching|тема 20]]).

Пам'ятай про серіалізацію: значення промісу перетинає межу так само, як props ([[Next.js - 07. Server і Client Components|тема 07]]). Віддавай DTO з потрібними полями, а не сирий рядок з БД.

> [!quiz] Скільки запитів до БД і де відрендериться таблиця?
> level: middle · type: single · id: nextjs-core-14-quiz-11
>
> `getOrders` обгорнуто в `React.cache`. Сторінка (Server Component) викликає `getOrders('u1')` без `await` і передає проміс у клієнтську `<OrdersTable orders={…} />`, яка читає його через `use()`. Сусідній Server Component робить `await getOrders('u1')`. Перший захід за URL.
>
> - [ ] Два запити: клієнтський компонент робить свій окремо
> - [ ] Один запит, але таблиця рендериться лише в браузері після власного `fetch`
> - [ ] Один запит, а HTML таблиці прийде тільки після завершення всієї відповіді й hydration
> - [x] Один запит; таблиця рендериться на сервері й досилається стрімом, після hydration працює інтерактивність
>
> **Пояснення:** обидва виклики отримують один проміс завдяки `React.cache` (на 16.3.8 у лозі один `▶`). Client Component теж рендериться на сервері, тож рядок таблиці вже є в HTML, який доїжджає потоком за межею `<Suspense>`. Після hydration клік по сортуванню працює в браузері без запитів.

### 🪜 Опускай await нижче межі

Повернімося до кабінету. `Promise.all` зробив дані швидшими, але всі три блоки досі з'являються **разом**, коли готовий найповільніший. Якщо блоки незалежні за змістом, кожен може стояти за власною межею:

```tsx
// app/w/streamed/page.tsx — ✅ await опущено вниз, кожен блок — своя межа
import { Suspense } from 'react'
import { getNews, getOrders, getUser } from '@/app/lib/shop'

async function Greeting() {
  const user = await getUser()
  return <h2>Привіт, {user.name}</h2>
}

async function Orders() {
  const orders = await getOrders('u1')
  return <p>Замовлень: {orders.length}</p>
}

async function News() {
  const news = await getNews()
  return <p>{news[0]}</p>
}

export default function Page() {
  return (
    <main>
      <h1>Кабінет</h1>
      <Suspense fallback={<h2>Привіт…</h2>}>
        <Greeting />
      </Suspense>
      <Suspense fallback={<p>Замовлення…</p>}>
        <Orders />
      </Suspense>
      <Suspense fallback={<p>Новини…</p>}>
        <News />
      </Suspense>
    </main>
  )
}
```

Обидва варіанти віддають shell зі збірки за десятки мілісекунд (у `/w/streamed` це заголовок і три fallback-и). Далі в `/w/sequential` користувач 1,2 с дивиться на один спінер, а в `/w/streamed` бачить привітання через 300 мс після shell, замовлення — через 400, новини — через 500.

Запити в `/w/streamed` паралельні, бо компоненти — сусіди, а межі вирішують інше: **що показати разом**. Робоче правило:

- **Дані, які показують разом** (ціна й кнопка «Купити», графік і легенда), — в одному компоненті через `Promise.all`, за однією межею.
- **Незалежні блоки** (стрічка, сайдбар, рекомендації) — окремі компоненти, кожен зі своїм `await` і своєю межею. Розмір fallback-ів — як у вмісту, щоб не було CLS ([[Next.js - 11. Streaming і Suspense|тема 11]]).
- **Нічого не чекай вище, ніж треба.** `await` у layout чи на верху page тримає все нижче — і в часі, і поза shell. Передавай проміси (`params`, дані) вниз до місця використання, як показано в [[Next.js - 12. Partial Prerendering і Cache Components|темі 12]].

> [!quiz] Обери правдиві твердження про межі й паралельність
> level: middle · type: multi · id: nextjs-core-14-quiz-12
>
> - [x] Сусідні async-компоненти в одній межі починають запити одночасно
> - [x] Окремі межі `<Suspense>` дозволяють показати швидкий блок раніше за повільний
> - [x] Layout і page одного маршруту рендеряться паралельно
> - [ ] Обгортка `<Suspense>` запускає запити паралельно, навіть коли компоненти вкладені один в одного
> - [ ] Одна межа навколо всієї сторінки показує блоки в міру готовності
> - [ ] `await` у layout не впливає на час сторінки, бо page рендериться окремо
>
> **Пояснення:** паралельність дає структура дерева, а межа вирішує лише, що показати разом. Вкладений компонент стартує після даних батька незалежно від `<Suspense>` (1,22 с проти 514 мс для сусідів). Одна межа відкриває вміст разом, коли готовий найповільніший блок. А `await` у layout тримає все нижче: і час, і shell.

### 🧮 Як обрати: таблиця рішень

| Ситуація | Рішення | Чому |
|---|---|---|
| Кілька незалежних запитів в одному компоненті | `Promise.all` | час = найдовший запит |
| Один із запитів необов'язковий | `Promise.allSettled` або окрема межа з `catchError` | падіння не валить сторінку |
| Запит B потребує результат A | `aP.then((a) => getB(a.id))`, решту — паралельно | час = найдовший ланцюжок |
| Список ID → запит на кожен | один запит `IN (…)`; мінімум — `Promise.all(ids.map(…))` | N+1 і пул з'єднань |
| Дитина чекає батька, хоча не залежить від нього | зробити сусідами або запустити запити в батьку | вкладеність ≠ залежність |
| Батько мусить щось перевірити перед рендером дитини | preload з дедуплікованою функцією | запит біжить під час перевірки |
| Ті самі дані в layout, page, `generateMetadata` | `fetch` — нічого; ORM — `React.cache` | один запит на рендер |
| Дані потрібні інтерактивному компоненту | проміс з сервера + `use()` | старт на сервері, без `useEffect` |
| Незалежні блоки різної швидкості | окремі компоненти й межі `<Suspense>` | швидке видно раніше |
| Дані однакові для всіх і рідко змінюються | `'use cache'` (тема 15) | у shell, без запиту взагалі |

### 🏭 Як це роблять у продакшні

- **Шар доступу до даних з `React.cache`.** Функції на кшталт `getCurrentUser()`, `getProduct(id)` живуть у `lib/data/*` з `import 'server-only'`, обгорнуті в `cache`, і повертають DTO. Компоненти викликають їх там, де дані потрібні; перевірка доступу — всередині (тема 29 основного посібника).
- **На code review** два `await` поспіль без залежності, `await` у циклі й preload без дедуплікації — привід для коментаря.
- **Трейсинг замість здогадок.** OpenTelemetry (`instrumentation.ts`) або APM платформи показує span кожного запиту до БД і API; драбина з span-ів у трейсі повільної сторінки — водоспад (тема 44 основного посібника).
- **Server Components не ходять у власні Route Handlers.** `fetch('/api/…')` з Server Component — зайвий HTTP-стрибок до того самого сервера; production checklist радить викликати функцію даних напряму.

## ⚠️ Пастки

> [!pitfall] await на верху сторінки «щоб було простіше»
> Один `await` у page чи layout тримає все дерево нижче: і час, і shell. Чекай дані в компоненті, який їх показує, під межею.
>
> ```tsx
> // ❌ уся сторінка чекає користувача
> const user = await getUser()
> return <Layout user={user}><Feed /><Sidebar /></Layout>
>
> // ✅ кожен блок чекає своє за власною межею
> return <Layout><Suspense fallback={…}><Feed /></Suspense>…</Layout>
> ```

> [!pitfall] Вкладеність JSX як порядок запитів
> Дочірній async-компонент починає запит лише після того, як батько дочекався своїх даних. Незалежні блоки — сусіди, або запити запускає батько.
>
> ```tsx
> // ❌ News стартує після Profile і Orders
> <Profile><Orders><News /></Orders></Profile>
>
> // ✅ стартують разом
> <Profile /> <Orders /> <News />
> ```

> [!pitfall] Preload без дедуплікації
> Функція без `React.cache` (і не `fetch`) у preload — це два запити замість одного і жодного виграшу в часі.
>
> ```ts
> const getOrders = (id: string) => db.orders.findMany({ where: { userId: id } }) // ❌
> const getOrders = cache((id: string) => db.orders.findMany({ where: { userId: id } })) // ✅
> ```

> [!pitfall] Обʼєкт як аргумент React.cache
> Ключ порівнюється за посиланням: новий літерал — новий запит.
>
> ```ts
> getUserByQuery({ id: 'u1' }) // ❌ у двох компонентах — два запити
> getUser('u1') // ✅ примітив — один запит
> ```

> [!pitfall] cache() усередині компонента
> Кожен рендер створює нову memoized-функцію з порожньою пам'яттю. Оголошуй `cache(fn)` на рівні модуля й експортуй.
>
> ```tsx
> async function Profile() {
>   const getUser = cache(fetchUser) // ❌ нова пам'ять щоразу
>   …
> }
> ```

> [!pitfall] «memoization — це кеш»
> `fetch(url, { cache: 'no-store' })` у двох компонентах однаково дасть один запит у межах рендеру, а наступний захід — новий запит. Memoization не зберігає нічого між запитами й не кладе дані в shell; для цього — `'use cache'`.

> [!pitfall] Promise.all для необов'язкового блоку
> Один відхилений проміс — і вся сторінка йде в `error.tsx`. Для «приємних доповнень» — `Promise.allSettled` або окрема межа з обробкою помилки.

## 🎤 На співбесіді

> [!interview] Що таке водоспад запитів у Server Components і як його прибрати?
> level: middle · frequency: дуже часто · id: nextjs-core-14-int-01
>
> ---
>
> Водоспад — коли запит стартує лише після завершення попереднього, хоча від нього не залежить, і час сторінки стає сумою затримок. Дві форми: `await` поспіль в одному компоненті й вкладені async-компоненти, де дитина рендериться лише після даних батька. Ліки: запускати проміси до першого `await` і чекати через `Promise.all` (або `allSettled` для необов'язкового), робити незалежні компоненти сусідами або запускати запити в батьку й передавати проміси, preload з дедуплікованою функцією, якщо батько мусить щось перевірити. Для справжньої залежності — `aP.then(getB)`, щоб решта йшла паралельно: час дорівнює найдовшому ланцюжку. Три запити 300/400/500 мс на 16.3.8 займають 1,2 с поспіль і 0,5 с паралельно.
>
> 📚 [[Next.js - 14. Дані на сервері#🌊 Водоспад: послідовні await|Розділ: водоспад]] · [Next.js: Fetching Data — Parallel data fetching](https://nextjs.org/docs/app/getting-started/fetching-data#parallel-data-fetching) · [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

> [!interview] Чим memoization fetch відрізняється від React.cache і від 'use cache'?
> level: middle · frequency: часто · id: nextjs-core-14-int-02
>
> ---
>
> Memoization `fetch` автоматична: GET з тією самою адресою й заголовками в межах одного рендер-проходу (pages, layouts, `generateMetadata`) виконується один раз; POST і запити з `signal` не дедуплікуються, у Route Handlers її немає. `React.cache` робить те саме для будь-якої функції — ORM, SDK — з ключем «функція + аргументи за `Object.is`» і пам'яттю на один запит. Обидва механізми прибирають дублікати всередині запиту, але нічого не зберігають між запитами й не кладуть дані в static shell. `'use cache'` — справжній кеш: результат живе між запитами за `cacheLife` і може потрапити в shell. `cache: 'no-store'` вимикає кеш, але не memoization.
>
> 📚 [[Next.js - 14. Дані на сервері#🧠 Дедуплікація: memoization fetch і React.cache|Розділ: дедуплікація]] · [Next.js: fetch — Memoization](https://nextjs.org/docs/app/api-reference/functions/fetch#memoization) · [React: cache](https://react.dev/reference/react/cache)

> [!interview] Що таке preload-патерн і чому він не працює без дедуплікації?
> level: senior · frequency: іноді · id: nextjs-core-14-int-03
>
> ---
>
> Preload — виклик функції даних без `await` до блокуючої роботи (перевірка доступу, пошук запису), щоб запит дитини біг паралельно з нею. Потім дитина викликає ту саму функцію й має отримати вже запущений проміс, тому функція мусить дедуплікуватися: `fetch` — автоматично, ORM — `React.cache`, під Cache Components — `'use cache'` чи `'use cache: private'` для даних із cookies. Без дедуплікації буде два запити й нуль виграшу. `preload` тримають у файлі компонента-споживача і позначають `void`. Обмеження: preload не скасовується, тож якщо перевірка не пройшла, запит усе одно відбувся — для дорогих чи чутливих операцій це важливо.
>
> 📚 [[Next.js - 14. Дані на сервері#🚀 Preload: почни раніше, споживай пізніше|Розділ: preload]] · [Next.js: Fetching Data — Preloading data](https://nextjs.org/docs/app/getting-started/fetching-data#preloading-data)

> [!interview] Сторінка відкривається 3 секунди, хоча кожен запит до БД триває до 400 мс. Як шукатимеш причину?
> level: senior · frequency: часто · id: nextjs-core-14-int-04
>
> ---
>
> Сума замість максимуму — майже напевно водоспад або N+1. Спершу трейс: OpenTelemetry чи APM покаже span-и запитів на шкалі, драбина означає послідовність. Локально — `logging.fetches` у `next dev` (з поправкою, що він перелічує й дедупліковані виклики) і логи часу навколо функцій даних. Далі читаю дерево: `await` на верху layout/page, `await` у циклі, вкладені async-компоненти, preload без дедуплікації, дублікати без `React.cache`. Виправлення: `Promise.all`, сусідні компоненти, запуск у батьку, один запит `IN (…)` замість N, окремі межі Suspense для незалежних блоків, щоб швидке зʼявлялось першим. Якщо найдовший ланцюжок однаково довгий — кешую його початок через `'use cache'` або змінюю API.
>
> 📚 [[Next.js - 14. Дані на сервері#🏭 Як це роблять у продакшні|Розділ: продакшн]] · [Next.js: Production Checklist](https://nextjs.org/docs/app/guides/production-checklist) · [Next.js: logging](https://nextjs.org/docs/app/api-reference/config/next-config-js/logging)

> [!interview] Коли передавати проміс у Client Component, а коли робити await у Server Component?
> level: middle · frequency: часто · id: nextjs-core-14-int-05
>
> ---
>
> `await` на сервері — коли дані потрібні лише для рендеру: у браузер іде готовий результат. Проміс + `use()` — коли дані потрібні інтерактивному компоненту: запит стартує на сервері якомога раніше, Client Component суспендиться за своєю межею і рендериться на сервері для HTML, а після hydration працює зі станом. Це прибирає клієнтський водоспад HTML → JS → `useEffect` → fetch. Якщо проміс створено через `React.cache`-функцію, серверні сусіди отримують той самий запит. Для поллінгу, ревалідації при фокусі чи мутацій з оптимістичним UI — уже SWR або TanStack Query.
>
> 📚 [[Next.js - 14. Дані на сервері#🤝 Проміс у Client Component: use()|Розділ: use()]] · [Next.js: Fetching Data — Streaming data with use](https://nextjs.org/docs/app/getting-started/fetching-data#streaming-data-with-the-use-api) · [React: use](https://react.dev/reference/react/use)

## 🔗 Звʼязки

- [[Next.js - 07. Server і Client Components]] — чому дані можна читати прямо в компоненті і що проходить через межу.
- [[Next.js - 10. Статичний і динамічний рендеринг]] — `io()` і `connection()`, якими позначають I/O.
- [[Next.js - 11. Streaming і Suspense]] — межі, порядок стрімінгу, правила `use()`.
- [[Next.js - 12. Partial Prerendering і Cache Components]] — static shell, три виходи з помилки prerender, передача `params` униз.
- [[Next.js - 13. Помилки й межі помилок]] — що відбувається, коли проміс відхилено.
- [[Next.js - 15. Cache Components і use cache]] — коли memoization замало і потрібен кеш між запитами.
- [[Next.js - 20. Бази даних і клієнтський fetching]] — ORM, пули з'єднань, SWR і TanStack Query.
- [[JavaScript - 09. Promise]] і [[JavaScript - 10. async і await]] — як працюють `Promise.all`, `allSettled` і чому `await` призупиняє функцію.

## ⚡ Фішки

> [!reel] 🪜 Три запити по черзі — це сума, а не максимум
> 300 + 400 + 500 мс поспіль дають ≈ 1200 мс, а `Promise.all` — ≈ 500. `await` призупиняє функцію: наступний запит навіть не викликано, доки попередній не повернувся.

> [!reel] 🔗 .then не запускає залежний запит наперед
> `userP.then((u) => getOrders(u.id))` стартує orders лише о 300 мс, коли є id. Решта біжить паралельно: 715 мс замість 1,2 с.

> [!reel] 🧾 no-store не вимикає memoization
> Шість `fetch` до однієї адреси дійшли до API як чотири запити. `{ cache: 'no-store' }` злився зі звичайним, а інший заголовок, `POST` і `signal` лишилися окремими.
>
> ```ts
> fetch(url)
> fetch(url, { cache: 'no-store' }) // той самий запит
> fetch(url, { signal }) // окремий
> ```

> [!reel] 🗒️ React.cache пам'ятає навіть помилку
> Якщо функція кинула помилку, наступні виклики в тому самому запиті отримують ту саму помилку без нової спроби. Нова спроба — лише в наступному запиті.

> [!reel] 🧱 React.cache не кладе дані в static shell
> Під `cacheComponents` функція, обгорнута в `cache`, поза `<Suspense>` зупиняє `next build` так само, як сирий `fetch`: це пам'ять на запит, а не збережений результат.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Де в App Router читають дані на сервері?
> *дуже часто · теорія* · `nextjs-core-14-card-01`
>
> Прямо в async Server Component: `await fetch(...)`, запит через ORM, SDK чи читання файлу. Без `useEffect`, стану завантаження й окремого API-маршруту для власного UI. Код запиту і рядок підключення не потрапляють у клієнтський бандл.
>
> 📚 [[Next.js - 14. Дані на сервері#🧭 Дані там, де їх рендерять|Розділ: дані там, де їх рендерять]] · [Next.js: Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)

> [!question]- Що таке водоспад запитів?
> *дуже часто · теорія* · `nextjs-core-14-card-02`
>
> Ситуація, коли запит B стартує лише після завершення запиту A, хоча від нього не залежить. Час сторінки стає сумою затримок, а не максимумом: 300 + 400 + 500 мс поспіль дають ≈ 1200 мс.
>
> 📚 [[Next.js - 14. Дані на сервері#🌊 Водоспад: послідовні await|Розділ: водоспад]] · [Next.js: Sequential data fetching](https://nextjs.org/docs/app/getting-started/fetching-data#sequential-data-fetching)

> [!question]- Як запустити три незалежні запити паралельно в одному компоненті?
> *дуже часто · код* · `nextjs-core-14-card-03`
>
> Спершу запустити, потім чекати: `const [a, b, c] = await Promise.all([getA(), getB(), getC()])`. Виклик async-функції одразу запускає її тіло, а `Promise.all` лише чекає всіх. Те саме дає запис «спершу проміси, потім `await`».
>
> ```ts
> const userP = getUser()
> const ordersP = getOrders('u1')
> const user = await userP // запити вже біжать
> ```
>
> 📚 [[Next.js - 14. Дані на сервері#⚡ Promise.all і Promise.allSettled|Розділ: Promise.all]] · [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

> [!question]- Чому сторінка з даними під cacheComponents потребує <Suspense>?
> *часто · теорія* · `nextjs-core-14-card-04`
>
> Будь-який `await`, що не завершується одразу (`fetch`, запит до мережевої БД, навіть `setTimeout` у промісі), поза `<Suspense>` зупиняє `next build` з `uncached or runtime data during prerendering`. Виняток: локальний драйвер SQLite без справжнього I/O може тихо дати `○` з даними на момент збірки (тема 20). Дані або за межею (stream), або в `'use cache'` (cache), або `instant = false` (block).
>
> 📚 [[Next.js - 14. Дані на сервері#🧱 Дані й static shell під Cache Components|Розділ: дані й static shell]] · [Next.js: Caching](https://nextjs.org/docs/app/getting-started/caching)

### 🟡 Middle

> [!question]- Чим Promise.allSettled відрізняється від Promise.all і коли його брати?
> *часто · теорія* · `nextjs-core-14-card-05`
>
> `Promise.all` відхиляється, щойно впав хоч один проміс, і сторінка йде в `error.tsx`. `Promise.allSettled` чекає всі й повертає `{ status, value | reason }` для кожного. Його беруть для необов'язкових блоків (новини, рекомендації), обов'язкові дані кидають далі самі.
>
> 📚 [[Next.js - 14. Дані на сервері#⚡ Promise.all і Promise.allSettled|Розділ: allSettled]] · [MDN: Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

> [!question]- Як побудувати запит, коли B потребує результат A, а C незалежний?
> *часто · код* · `nextjs-core-14-card-08`
>
> Причепити залежний запит до промісу через `.then`, незалежні запустити одразу: час дорівнює найдовшому ланцюжку.
>
> ```ts
> const userP = getUser()
> const ordersP = userP.then((u) => getOrders(u.id))
> const newsP = getNews()
> await Promise.all([userP, ordersP, newsP])
> ```
>
> 📚 [[Next.js - 14. Дані на сервері#⚡ Promise.all і Promise.allSettled|Розділ: справжня залежність]] · [MDN: Promise.prototype.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)

> [!question]- Що саме дедуплікує memoization fetch і чого не дедуплікує?
> *дуже часто · теорія* · `nextjs-core-14-card-09`
>
> Автоматично зливає GET-запити з тією самою адресою й заголовками в межах одного рендер-проходу (components, layouts, pages, `generateMetadata`). Окремо лишаються інший заголовок, `POST` і запити з `signal`. Опції кешування (`cache`, `next.revalidate`) на ключ не впливають. У Route Handlers memoization немає.
>
> 📚 [[Next.js - 14. Дані на сервері#🧠 Дедуплікація: memoization fetch і React.cache|Розділ: memoization fetch]] · [Next.js: fetch — Memoization](https://nextjs.org/docs/app/api-reference/functions/fetch#memoization)

> [!question]- Чому не можна міняти cache(fn) усередині компонента?
> *часто · пастка* · `nextjs-core-14-card-10`
>
> Кожен виклик `cache(fn)` створює нову функцію з власною пам'яттю. Усередині компонента це нова пам'ять на кожен рендер, тобто жодної дедуплікації. Оголошують `cache` один раз на рівні модуля й експортують.
>
> 📚 [[Next.js - 14. Дані на сервері#🧠 Дедуплікація: memoization fetch і React.cache|Розділ: правила React.cache]] · [React: cache](https://react.dev/reference/react/cache)

> [!question]- Чому React.cache не працює з обʼєктом як аргументом?
> *часто · пастка* · `nextjs-core-14-card-11`
>
> Аргументи порівнюються за `Object.is`, тобто за посиланням. `getUser({ id: 'u1' })` у двох компонентах створює два різні обʼєкти, і функція виконується двічі. Передавай примітиви: `getUser('u1')`.
>
> 📚 [[Next.js - 14. Дані на сервері#🧠 Дедуплікація: memoization fetch і React.cache|Розділ: правила React.cache]] · [React: cache — caveats](https://react.dev/reference/react/cache#caveats)

> [!question]- Чим memoization відрізняється від кешу?
> *дуже часто · теорія* · `nextjs-core-14-card-12`
>
> Memoization (`fetch`, `React.cache`) живе один рендер-прохід і прибирає дублікати всередині запиту: наступний захід іде в джерело знову, дані не потрапляють у shell. Кеш (`'use cache'`) зберігає результат між запитами й користувачами. `cache: 'no-store'` вимикає кеш, але не memoization.
>
> 📚 [[Next.js - 14. Дані на сервері#🧠 Дедуплікація: memoization fetch і React.cache|Розділ: memoization і кеш]] · [Next.js: Glossary — Memoization](https://nextjs.org/docs/app/glossary#memoization)

> [!question]- Як працює preload-патерн і навіщо void?
> *іноді · код* · `nextjs-core-14-card-13`
>
> Функцію даних викликають без `await` перед блокуючою роботою (наприклад, перевіркою доступу), а потім ще раз у компоненті-споживачі: дедуплікована функція повертає той самий проміс. `void` — явний сигнал, що проміс чекати не треба, і лінтер не скаржиться. Preload тримають поруч зі споживачем.
>
> ```ts
> export const preloadOrders = (id: string) => {
>   void getOrders(id)
> }
> ```
>
> 📚 [[Next.js - 14. Дані на сервері#🚀 Preload: почни раніше, споживай пізніше|Розділ: preload]] · [Next.js: Preloading data](https://nextjs.org/docs/app/getting-started/fetching-data#preloading-data)

### 🔴 Senior

> [!question]- Коли передавати проміс у Client Component через use(), а коли робити await на сервері?
> *часто · практика* · `nextjs-core-14-card-14`
>
> `await` на сервері, коли дані потрібні лише для рендеру. Проміс і `use()`, коли дані потрібні інтерактивному компоненту: запит стартує на сервері рано, без `useEffect` і клієнтського водоспаду. Для поллінгу, ревалідації при фокусі й оптимістичних мутацій потрібні вже SWR чи TanStack Query.
>
> 📚 [[Next.js - 14. Дані на сервері#🤝 Проміс у Client Component: use()|Розділ: use()]] · [React: use](https://react.dev/reference/react/use)

> [!question]- Чому однієї межі <Suspense> навколо сторінки недостатньо для швидкого UX?
> *часто · практика* · `nextjs-core-14-card-16`
>
> Одна межа відкриває вміст разом, коли готовий найповільніший блок: на 16.3.8 shell прийшов о +63 мс, а всі дані о +1264 мс. Три окремі межі для незалежних блоків дали +370 / +469 / +577 мс. Дані, які показують разом, лишаємо в одному компоненті через `Promise.all`.
>
> 📚 [[Next.js - 14. Дані на сервері#🪜 Опускай await нижче межі|Розділ: опускай await нижче межі]] · [Next.js: Streaming](https://nextjs.org/docs/app/getting-started/fetching-data#streaming)

## 🛠️ Практика

> [!task] Прибери водоспад у loadDashboard
> level: middle · difficulty: medium · id: nextjs-core-14-task-01 · tags: promise-all, waterfall, async
>
> Функція `loadDashboard(api)` збирає кабінет: користувач, його замовлення (потрібен `user.id`) і новини (не залежать ні від кого). Зараз усе виконується по черзі, і 300 + 400 + 500 мс дають 1200 мс. Перепиши так, щоб `user` і `news` стартували одразу, `orders` — щойно відомий `user.id`, а результат був готовий за 700 мс. Помилка будь-якого запиту, зокрема `news`, має відхиляти весь результат.
>
> Задача на TypeScript: типи знімаються перед запуском. Тести використовують `vi.useFakeTimers()` і крутять годинник по 1 мс.
>
> ```ts starter
> type User = { id: string; name: string }
> type Api = {
>   getUser(): Promise<User>
>   getOrders(userId: string): Promise<string[]>
>   getNews(): Promise<string[]>
> }
>
> async function loadDashboard(api: Api) {
>   // ❌ водоспад: усе по черзі, хоча news ні від кого не залежить
>   const user = await api.getUser()
>   const orders = await api.getOrders(user.id)
>   const news = await api.getNews()
>   return { user, orders, news }
> }
> ```
>
> ```ts tests
> function makeApi(newsFails = false) {
>   const starts: { name: string; at: number }[] = []
>   const t0 = Date.now()
>   const later = (name: string, ms: number, value: unknown, fail = false) => {
>     starts.push({ name, at: Date.now() - t0 })
>     return new Promise((resolve, reject) => {
>       setTimeout(() => (fail ? reject(new Error(name + ' down')) : resolve(value)), ms)
>     })
>   }
>   const asked: string[] = []
>   const api = {
>     getUser: () => later('user', 300, { id: 'u7', name: 'Оля' }),
>     getOrders: (id: string) => {
>       asked.push(id)
>       return later('orders', 400, ['#101', '#102'])
>     },
>     getNews: () => later('news', 500, ['Знижки до -20%'], newsFails),
>   }
>   return { api, starts, asked }
> }
>
> // крутимо годинник по 1 мс і даємо промісам відпрацювати між кроками
> async function run(ms: number) {
>   for (let i = 0; i < ms; i++) {
>     vi.advanceTimersByTime(1)
>     for (let k = 0; k < 5; k++) await Promise.resolve()
>   }
> }
>
> test('повертає user, orders і news', async () => {
>   vi.useFakeTimers()
>   const { api } = makeApi()
>   let result: any = null
>   loadDashboard(api).then((r) => { result = r })
>   await run(1000)
>   expect(result).toEqual({
>     user: { id: 'u7', name: 'Оля' },
>     orders: ['#101', '#102'],
>     news: ['Знижки до -20%'],
>   })
> })
>
> test('готовий рівно за 700 мс, а не за 1200', async () => {
>   vi.useFakeTimers()
>   const { api } = makeApi()
>   let result: any = null
>   loadDashboard(api).then((r) => { result = r })
>   await run(699)
>   expect(result).toBeNull()
>   await run(1)
>   expect(result).not.toBeNull()
> })
>
> test('user і news стартують одразу, в одну мить', async () => {
>   vi.useFakeTimers()
>   const { api, starts } = makeApi()
>   loadDashboard(api).catch(() => {})
>   await run(1)
>   expect(starts.map((s) => s.name).sort()).toEqual(['news', 'user'])
>   expect(starts.every((s) => s.at === 0)).toBe(true)
> })
>
> test('orders стартує, щойно є user.id, і отримує саме його', async () => {
>   vi.useFakeTimers()
>   const { api, starts, asked } = makeApi()
>   loadDashboard(api).catch(() => {})
>   await run(310)
>   expect(starts.map((s) => s.name).sort()).toEqual(['news', 'orders', 'user'])
>   expect(starts.find((s) => s.name === 'orders')!.at).toBe(300)
>   expect(asked).toEqual(['u7'])
> })
>
> test('помилка news відхиляє весь результат', async () => {
>   vi.useFakeTimers()
>   const { api } = makeApi(true)
>   let error: any = null
>   loadDashboard(api).catch((e) => { error = e })
>   await run(600)
>   expect(error).not.toBeNull()
>   expect(error.message).toBe('news down')
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу викличи `api.getUser()` і `api.getNews()` без `await`. Залежний запит причепи до промісу користувача через `.then`.
>
> > [!hint]- Підказка 2
> > Запит `orders` не можна починати раніше за `user`, але новини чекати він не мусить. Зібрати все можна одним `Promise.all([userP, ordersP, newsP])`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > async function loadDashboard(api: Api) {
> >   const userP = api.getUser()
> >   const newsP = api.getNews() // незалежний — стартує одразу
> >   const ordersP = userP.then((user) => api.getOrders(user.id)) // стартує, щойно є user.id
> >   const [user, orders, news] = await Promise.all([userP, ordersP, newsP])
> >   return { user, orders, news }
> > }
> > ```
> >
> > Час сторінки — найдовший шлях у графі: ланцюжок `user → orders` це 300 + 400 = 700 мс, а новини (500 мс) встигають паралельно. `Promise.all` відхиляється з першою помилкою, тож падіння `news` відхиляє весь результат. Типова пастка — `await Promise.all([user, news])` і лише потім `orders`: це 500 + 400 = 900 мс.

> [!task] Міні-React.cache: requestCache()
> level: middle · difficulty: medium · id: nextjs-core-14-task-02 · tags: react-cache, memoization, closures
>
> Реалізуй `requestCache()`: вона повертає `{ cache, reset }`, де `cache(fn)` працює як `React.cache`, а `reset()` починає новий «запит».
>
> - `cache(fn)` повертає функцію, яка викликає `fn` один раз для кожного набору аргументів. Аргументи порівнюються за `Object.is` (кількість і порядок теж мають значення), тож обʼєкт-літерал щоразу новий ключ.
> - Повторний виклик повертає **той самий** результат (той самий проміс). Відхилений проміс і синхронна помилка теж запамʼятовуються.
> - Кожен виклик `cache(fn)` має власну памʼять, навіть для тієї самої `fn`.
> - `reset()` очищає памʼять усіх функцій: наступні виклики знову запускають `fn`.
>
> ```js starter
> function requestCache() {
>   // Повертає { cache(fn), reset() } — міні-React.cache на один «запит»
>   return {
>     cache(fn) {
>       return fn // ❌ нічого не запам'ятовує
>     },
>     reset() {},
>   }
> }
> ```
>
> ```js tests
> test('однакові аргументи — один виклик fn і той самий результат', () => {
>   const { cache } = requestCache()
>   let calls = 0
>   const getUser = cache((id) => {
>     calls++
>     return Promise.resolve({ id })
>   })
>   const a = getUser('u1')
>   const b = getUser('u1')
>   expect(calls).toBe(1)
>   expect(a).toBe(b)
> })
>
> test('різні аргументи — окремі виклики, враховує кількість і порядок', () => {
>   const { cache } = requestCache()
>   let calls = 0
>   const sum = cache((a, b) => {
>     calls++
>     return [a, b]
>   })
>   sum(1, 2)
>   sum(1, 3)
>   sum(2, 1)
>   sum(1)
>   expect(calls).toBe(4)
>   sum(1, 2)
>   sum(1)
>   expect(calls).toBe(4)
> })
>
> test('обʼєкт-літерал щоразу новий ключ, та сама змінна — той самий', () => {
>   const { cache } = requestCache()
>   let calls = 0
>   const find = cache((query) => {
>     calls++
>     return query.id
>   })
>   find({ id: 'u1' })
>   find({ id: 'u1' })
>   expect(calls).toBe(2)
>   const query = { id: 'u1' }
>   find(query)
>   find(query)
>   expect(calls).toBe(3)
> })
>
> test('відхилений проміс і синхронна помилка теж запамʼятовуються', async () => {
>   const { cache } = requestCache()
>   let calls = 0
>   const broken = cache(async () => {
>     calls++
>     throw new Error('db down')
>   })
>   const first = broken().catch((e) => e.message)
>   const second = broken().catch((e) => e.message)
>   expect(await first).toBe('db down')
>   expect(await second).toBe('db down')
>   expect(calls).toBe(1)
>
>   let syncCalls = 0
>   const explode = cache(() => {
>     syncCalls++
>     throw new Error('boom')
>   })
>   expect(() => explode()).toThrow('boom')
>   expect(() => explode()).toThrow('boom')
>   expect(syncCalls).toBe(1)
> })
>
> test('reset() починає новий «запит» з порожньою памʼяттю', () => {
>   const { cache, reset } = requestCache()
>   let calls = 0
>   const getUser = cache((id) => {
>     calls++
>     return id
>   })
>   getUser('u1')
>   getUser('u1')
>   expect(calls).toBe(1)
>   reset()
>   getUser('u1')
>   getUser('u1')
>   expect(calls).toBe(2)
> })
>
> test('кожен cache(fn) має власну памʼять, навіть для тієї самої fn', () => {
>   const { cache } = requestCache()
>   let calls = 0
>   const load = (id) => {
>     calls++
>     return id
>   }
>   const a = cache(load)
>   const b = cache(load)
>   a('u1')
>   b('u1')
>   expect(calls).toBe(2)
>   a('u1')
>   expect(calls).toBe(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > Для кожного `cache(fn)` тримай масив записів `{ args, value }` і шукай запис, у якого `args.length` збігається, а кожен елемент проходить `Object.is`. `JSON.stringify` для ключа не підходить: два різні обʼєкти дадуть однаковий рядок.
>
> > [!hint]- Підказка 2
> > Щоб `reset()` очищав усе, збережи масиви памʼяті всіх функцій у спільному `Set`. Помилку, кинуту синхронно, запиши в запис і кинь ще раз при кожному влучанні.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function requestCache() {
> >   const memories = new Set()
> >   return {
> >     cache(fn) {
> >       const entries = []
> >       memories.add(entries)
> >       return function cached(...args) {
> >         const hit = entries.find(
> >           (e) => e.args.length === args.length && e.args.every((a, i) => Object.is(a, args[i])),
> >         )
> >         if (hit) {
> >           if (hit.failed) throw hit.error
> >           return hit.value
> >         }
> >         const entry = { args }
> >         entries.push(entry)
> >         try {
> >           entry.value = fn(...args)
> >         } catch (error) {
> >           entry.failed = true
> >           entry.error = error
> >           throw error
> >         }
> >         return entry.value
> >       }
> >     },
> >     reset() {
> >       for (const entries of memories) entries.length = 0
> >     },
> >   }
> > }
> > ```
> >
> > Ключ — функція плюс аргументи за `Object.is`, пам'ять — на один «запит». Саме так працює `React.cache`: кеш по посиланню, а не по вмісту, і помилки теж запам'ятовуються. Варіант з `JSON.stringify(args)` зламає перевірку обʼєктів: `{ id: 1 }` двічі зіллються в один виклик, а справжній `React.cache` виконав би `fn` двічі.

> [!task] Ключ memoization для fetch
> level: middle · difficulty: medium · id: nextjs-core-14-task-03 · tags: fetch, memoization, dedupe
>
> Змоделюй memoization `fetch` у Next.js.
>
> `memoKey(url, init?)` повертає рядок-ключ або `null`:
> - `null`, якщо метод не `GET` і не `HEAD` (регістр не важливий) або в `init` є `signal`: такі запити не дедуплікуються;
> - інакше ключ складається з методу (`GET` і `HEAD` — різні ключі), URL і заголовків, відсортованих за назвою без урахування регістру;
> - опції кешування (`cache`, `next`) на ключ не впливають.
>
> `createFetchMemo(fetcher)` повертає `{ fetch, reset }`. Однакові ключі в межах одного «рендеру» викликають `fetcher` один раз і повертають той самий проміс. Запити з `null`-ключем завжди йдуть у `fetcher`. `reset()` починає новий рендер.
>
> Задача на TypeScript: типи знімаються перед запуском.
>
> ```ts starter
> type FetchInit = {
>   method?: string
>   headers?: Record<string, string>
>   cache?: string
>   next?: { revalidate?: number }
>   signal?: unknown
> }
> type Fetcher = (url: string, init?: FetchInit) => Promise<unknown>
>
> function memoKey(url: string, init: FetchInit = {}): string | null {
>   return url + JSON.stringify(init) // ❌ ключ залежить від усіх опцій
> }
>
> function createFetchMemo(fetcher: Fetcher) {
>   return {
>     fetch: (url: string, init?: FetchInit) => fetcher(url, init), // ❌ без памʼяті
>     reset() {},
>   }
> }
> ```
>
> ```ts tests
> const A = 'https://api.example.com/products'
>
> function makeFetcher() {
>   const calls: string[] = []
>   const fetcher = (url: string, init?: any) => {
>     calls.push((init?.method ?? 'GET') + ' ' + url)
>     return Promise.resolve({ url })
>   }
>   return { fetcher, calls }
> }
>
> test('опції кешу не входять у ключ: no-store, revalidate і явний GET зливаються зі звичайним', () => {
>   const plain = memoKey(A)
>   expect(typeof plain).toBe('string')
>   expect(memoKey(A, { cache: 'no-store' })).toBe(plain)
>   expect(memoKey(A, { next: { revalidate: 0 } })).toBe(plain)
>   expect(memoKey(A, { method: 'GET' })).toBe(plain)
> })
>
> test('інший URL чи інший заголовок — інший ключ', () => {
>   const plain = memoKey(A)
>   expect(memoKey(A + '?page=2')).not.toBe(plain)
>   expect(memoKey(A, { headers: { 'x-lang': 'en' } })).not.toBe(plain)
>   expect(memoKey(A, { headers: { 'x-lang': 'en' } })).not.toBe(memoKey(A, { headers: { 'x-lang': 'uk' } }))
> })
>
> test('порядок і регістр назв заголовків не впливають на ключ', () => {
>   const one = memoKey(A, { headers: { 'X-Lang': 'en', 'x-theme': 'dark' } })
>   const two = memoKey(A, { headers: { 'x-theme': 'dark', 'x-lang': 'en' } })
>   expect(one).toBe(two)
> })
>
> test('мають ключ лише GET і HEAD, причому різні; POST і запит із signal ключа не мають', () => {
>   expect(typeof memoKey(A, { method: 'head' })).toBe('string')
>   expect(memoKey(A, { method: 'HEAD' })).not.toBe(memoKey(A))
>   expect(memoKey(A, { method: 'POST' })).toBeNull()
>   expect(memoKey(A, { method: 'put' })).toBeNull()
>   expect(memoKey(A, { signal: { aborted: false } })).toBeNull()
> })
>
> test('однакові GET в одному рендері — один виклик fetcher і той самий проміс', () => {
>   const { fetcher, calls } = makeFetcher()
>   const memo = createFetchMemo(fetcher)
>   const a = memo.fetch(A)
>   const b = memo.fetch(A, { cache: 'no-store' })
>   const c = memo.fetch(A + '/other')
>   expect(calls).toEqual(['GET ' + A, 'GET ' + A + '/other'])
>   expect(a).toBe(b)
>   expect(c).not.toBe(a)
> })
>
> test('POST і запити з signal не дедуплікуються', () => {
>   const { fetcher, calls } = makeFetcher()
>   const memo = createFetchMemo(fetcher)
>   memo.fetch(A, { method: 'POST' })
>   memo.fetch(A, { method: 'POST' })
>   memo.fetch(A, { signal: {} })
>   memo.fetch(A, { signal: {} })
>   expect(calls).toHaveLength(4)
> })
>
> test('reset() починає новий рендер', () => {
>   const { fetcher, calls } = makeFetcher()
>   const memo = createFetchMemo(fetcher)
>   memo.fetch(A)
>   memo.fetch(A)
>   expect(calls).toHaveLength(1)
>   memo.reset()
>   memo.fetch(A)
>   expect(calls).toHaveLength(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > Спочатку визнач, коли ключа немає (`null`), і лише потім будуй рядок. Опції `cache` та `next` просто не читай.
>
> > [!hint]- Підказка 2
> > Заголовки: `Object.entries(...)`, назву в нижній регістр, відсортуй масив рядків `name:value`. Кеш рендеру — `Map<string, Promise>`, який `reset()` замінює новим.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function memoKey(url: string, init: FetchInit = {}): string | null {
> >   const method = (init.method ?? 'GET').toUpperCase()
> >   if ((method !== 'GET' && method !== 'HEAD') || init.signal != null) return null // не дедуплікується
> >   const headers = Object.entries(init.headers ?? {})
> >     .map(([name, value]) => name.toLowerCase() + ':' + value.trim())
> >     .sort()
> >   return method + ' ' + url + ' ' + headers.join('|') // cache і next у ключ не входять
> > }
> >
> > function createFetchMemo(fetcher: Fetcher) {
> >   let memo = new Map<string, Promise<unknown>>()
> >   return {
> >     fetch(url: string, init?: FetchInit) {
> >       const key = memoKey(url, init)
> >       if (key === null) return fetcher(url, init)
> >       let promise = memo.get(key)
> >       if (!promise) {
> >         promise = fetcher(url, init)
> >         memo.set(key, promise)
> >       }
> >       return promise
> >     },
> >     reset() {
> >       memo = new Map()
> >     },
> >   }
> > }
> > ```
> >
> > Тут видно, чому `{ cache: 'no-store' }` не вимикає memoization: ключ будується лише з методу, URL і заголовків. `POST`, `PUT` і `signal` повертають `null`, тож кожен такий виклик іде в `fetcher`. Варіант `url + JSON.stringify(init)` робить `no-store` окремим запитом і залежить від порядку заголовків.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) — офіційний старт: `fetch`, ORM, послідовні й паралельні запити, `React.cache`, preload, `use()`.
- 🟡 [Next.js — fetch](https://nextjs.org/docs/app/api-reference/functions/fetch) — довідник розширеного `fetch` і розділ про memoization.
- 🟡 [Next.js — Caching](https://nextjs.org/docs/app/getting-started/caching) — static shell, Suspense і «Maximizing the static shell».
- 🟡 [Next.js — Glossary: Memoization](https://nextjs.org/docs/app/glossary#memoization) — що саме дедуплікується і де.
- 🟡 [Next.js — logging](https://nextjs.org/docs/app/api-reference/config/next-config-js/logging) — логи `fetch` у dev.
- 🟡 [Next.js — Single-Page Applications](https://nextjs.org/docs/app/guides/single-page-applications) — проміс через контекст-провайдер і `use()`.
- 🔴 [React — cache](https://react.dev/reference/react/cache) — першоджерело: область запиту, `Object.is`, кешовані помилки, пастки.
- 🔴 [React — use](https://react.dev/reference/react/use) — як Client Component читає проміс із сервера.
- 🟢 [MDN — Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) — коли один збій не повинен валити все.
- 🛠️ [Next.js — Production Checklist](https://nextjs.org/docs/app/guides/production-checklist) — паралельні запити, кешування, без власних Route Handlers із Server Components.

> [!important] Підсумок
> - Server Component читає дані прямо в рендері (`fetch`, ORM, SDK). Під `cacheComponents` справжній I/O (мережа, мережева БД) поза `<Suspense>` зупиняє `next build`; `React.cache` від цього не рятує — дані або за межею, або в `'use cache'`. Локальний SQLite без I/O вшивається в HTML збірки.
> - Водоспад — запит чекає попередній без потреби: `await` поспіль, `await` у циклі, вкладені async-компоненти. Час сторінки — сума замість максимуму.
> - Запускай до того, як чекати: `Promise.all` / `allSettled`, сусідні компоненти, запуск у батьку з промісами вниз, `aP.then(getB)` для залежних, preload для коду після перевірки. Час = найдовший ланцюжок.
> - Дедуплікація в межах запиту: `fetch` GET — автоматично (опції кешу на ключ не впливають, `signal` і POST — окремо), решта — `React.cache` на рівні модуля з примітивними аргументами. Це не кеш між запитами.
> - Проміс із сервера в Client Component через `use()` стартує запит рано й без `useEffect`. Окремі межі Suspense показують незалежні блоки в міру готовності, а паралельність дає структура дерева, не межі.

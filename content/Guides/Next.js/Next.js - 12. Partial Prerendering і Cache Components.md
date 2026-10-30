---
title: Partial Prerendering і Cache Components
id: nextjs-core-12
slug: 12-ppr-cache-components
order: 12
level: senior
skill: rendering
icon: px:bricks
tags: [nextjs, ppr, cache-components, static-shell, suspense, instant-navigation, prerendering]
prerequisites: ["[[Next.js - 10. Статичний і динамічний рендеринг]]", "[[Next.js - 11. Streaming і Suspense]]"]
estimatedMinutes: 55
nextVersion: 16.3.8
---

# Partial Prerendering і Cache Components

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити Partial Prerendering: static shell і динамічні «дірки», які стрімляться в **одній** HTTP-відповіді;
> - увімкнути `cacheComponents: true` і розповісти, що сталося з `experimental.ppr` і `experimental_ppr` у Next.js 16;
> - для кожного компонента сказати, чи він статичний, закешований або стоїть за `<Suspense>`, і що з цього потрапить у shell;
> - прочитати помилку збірки «uncached or runtime data during prerendering» і обрати одне з трьох виправлень;
> - побачити shell і дірки у сирому HTML через `curl -N` і прочитати рядки `◐` у виводі `next build`;
> - пояснити Instant navigation: `instant`, Navigation Inspector, `@next/playwright` `instant()`;
> - перевести маршрут з `dynamic`, `revalidate`, `fetchCache`, `dynamicParams` на Cache Components і знати, що з PPR несумісне.

## 🤔 Передбач

> [!quiz] Що браузер отримає в перших байтах відповіді?
> level: senior · type: output · id: nextjs-core-12-quiz-01
>
> `next.config.ts` містить `cacheComponents: true`. `getStock()` — незакешований запит до бази на 2 секунди. Користувач уперше відкриває `/store`:
>
> ```tsx
> // app/store/page.tsx
> export default function StorePage() {
>   return (
>     <main>
>       <h1>Крамниця</h1>
>       <Featured /> {/* async, 'use cache' + cacheLife('hours') */}
>       <Suspense fallback={<p>Перевіряємо наявність…</p>}>
>         <Stock /> {/* await getStock() */}
>       </Suspense>
>     </main>
>   )
> }
> ```
>
> - [x] `<h1>`, готовий список `Featured` і текст «Перевіряємо наявність…»; залишок складу допишеться в ту саму відповідь приблизно за 2 с
> - [ ] Лише `<h1>` і два fallback-и: `Featured` теж асинхронний, тож він доїде стрімом
> - [ ] Порожній `<main>`: сторінка динамічна, бо в ній є незакешований запит, тож сервер чекає 2 с і віддає все разом
> - [ ] `<h1>` і `Featured`, а `Stock` браузер дозавантажить окремим `fetch` після hydration
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Під Cache Components `next build` заздалегідь рендерить **static shell**: статичний `<h1>`, результат `'use cache'` і fallback кожної межі Suspense. На запит сервер одразу віддає цей shell, а `Stock` дорендерює й допише в **той самий** потік HTML. Окремого запиту з браузера немає, і повільний компонент не блокує решту сторінки.

## 🧒 Простими словами

Уяви кав'ярню біля вокзалу. Більшість замовлень однакові — капучино, круасан, і бариста готує їх заздалегідь: вони вже стоять на прилавку в коробках (це **static shell**). Але сендвіч ти просиш «без цибулі, з подвійним сиром», і такий його не приготуєш наперед. Тому тобі одразу дають коробку з усім готовим і порожнім відділенням під сендвіч, на якому написано «готуємо, 2 хвилини» (це **fallback**). Ти вже п'єш каву, а сендвіч приносять до того самого столика й кладуть у те саме відділення (**дірка**, що стрімиться). Те, що готують раз на годину й тримають теплим (випічка дня), теж лежить у коробці одразу — це **кеш**. А якщо бариста раптом почне готувати твій сендвіч до того, як віддати каву, черга зупиниться: Next.js ловить саме цю ситуацію й зупиняє збірку.

## 🔬 Як це працює насправді

### 🧭 Навіщо Partial Prerendering

У темі [[Next.js - 10. Статичний і динамічний рендеринг]] ти бачив стару модель: маршрут або статичний, або динамічний. Одне читання `cookies()` для лічильника кошика робило динамічною **всю** сторінку товару: на кожен запит сервер рендерив і шапку, і опис, і відгуки, хоча змінювалась одна цифра. Щоб лишити сторінку статичною, лічильник доводилося тягнути з клієнта окремим `fetch` після hydration — ще один запит, ще один стан завантаження.

Partial Prerendering (PPR) переносить межу між статичним і динамічним **з маршруту на компонент**. Документація називає це спектром: на одному кінці — збірка всього наперед, на іншому — рендер на кожен запит, а Next.js дозволяє змішувати обидва на одній сторінці (`rendering-philosophy.md`). Механіка така:

1. Під час `next build` Next.js рендерить дерево маршруту, доки не впреться в те, що залежить від запиту або від незакешованих даних.
2. Усе, що встигло відрендеритися, плюс fallback-и меж `<Suspense>`, які зупинили рендер, стає **static shell** — готовим HTML.
3. Разом із shell зберігається `postponedState` — непрозорий опис того, де рендер зупинився, щоб продовжити саме звідти.
4. На запит сервер **одразу** віддає shell, «відновлює» рендер з `postponedState` і дописує вміст дірок у ту саму відповідь, щойно кожна з них готова.

Важливе слово — **одна відповідь**. PPR — це не «статична сторінка + клієнтський запит за даними», а стрімінг HTML, з яким ти познайомився в темі [[Next.js - 11. Streaming і Suspense]]. Різниця з простим стрімінгом лише в тому, що перша частина потоку не рендериться на запит, а береться готовою зі збірки. Тому TTFB і FCP такі ж, як у статичної сторінки, а дані такі ж свіжі, як у динамічної.

### ⚙️ Увімкнення: cacheComponents

У Next.js 16 PPR — не окремий прапорець, а поведінка за замовчуванням режиму **Cache Components**:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

Один прапорець вмикає одразу кілька речей: директиву `'use cache'` з `cacheLife` і `cacheTag` (тема 15 основного посібника), PPR для всіх маршрутів App Router і збереження стану сторінок через `<Activity>` при навігації ([[Next.js - 04. Навігація під капотом]]). Під час `next build` у виводі з'являється рядок `- Cache Components enabled`.

**Було → стало.** У Next.js 15 PPR був експериментом: `experimental.ppr: 'incremental'` у конфігу і `export const experimental_ppr = true` у сегментах; окремо існували `experimental.dynamicIO` і `experimental.useCache`. У 16 усе це **видалено** й об'єднано в `cacheComponents`. Старий конфіг не мовчить, а зупиняє збірку:

```text
[Error: `experimental.ppr` has been merged into `cacheComponents`. The Partial Prerendering feature is still available, but is now enabled via `cacheComponents`. Please update your next.config.ts accordingly.]
```

Сегментний `experimental_ppr` дає `Route segment config "experimental_ppr" is not compatible with nextConfig.cacheComponents`. Посібник з оновлення додає важливе застереження: PPR у 16 **працює інакше**, ніж у канарках 15, тож це не перейменування прапорця, а новий режим з новими правилами (`upgrading/version-16.md`).

> [!note] Звідки в прикладах «повільна база»
> `lib/db.ts` у прикладах — масив у памʼяті, загорнутий у `await new Promise((r) => setTimeout(r, ms))`. Для Next.js таке очікування — незакешований I/O, як справжній запит до БД: поза `<Suspense>` воно зупиняє `next build` тією самою помилкою. Тому приклади поводяться чесно, хоча мережі в них немає.

> [!quiz] Перевір себе: як увімкнути PPR у Next.js 16?
> level: middle · id: nextjs-core-12-quiz-02
>
> - [x] `cacheComponents: true` у `next.config.ts`; PPR стає поведінкою за замовчуванням для всіх маршрутів
> - [ ] `experimental.ppr: 'incremental'` у конфігу і `export const experimental_ppr = true` у потрібних сегментах
> - [ ] `export const dynamic = 'force-static'` на сторінці, щоб Next.js пререндерив shell
> - [ ] Нічого: PPR у 16 увімкнений завжди, `cacheComponents` лише вмикає `'use cache'`
>
> **Пояснення:** `experimental.ppr` і `experimental_ppr` у 16 видалені й зупиняють збірку. `dynamic` під Cache Components теж заборонений. А без `cacheComponents` діє стара модель «маршрут або статичний, або динамічний», тож PPR вимкнений.

### 🧱 Ментальна модель: кешоване, статичне або за Suspense

Під Cache Components є одне правило, з якого випливає решта: **дані за замовчуванням динамічні, і кожен компонент, що їх читає, мусить явно сказати, як з ними бути**. Під час збірки Next.js дивиться на кожен шматок дерева й відносить його до одного з трьох видів:

| Вид | Що робить компонент | Де опиниться |
|---|---|---|
| **Статичне** | без I/O: JSX, імпорти модулів, чисті обчислення, синхронне читання файлу | у static shell автоматично |
| **Закешоване** | async-робота під `'use cache'` (з `cacheLife`, тема 15 основного посібника) | результат у static shell, якщо час життя не надто короткий |
| **За Suspense** | читає запит (`cookies()`, `headers()`, `params`, `searchParams`) або незакешовані дані | у shell лише `fallback`, вміст стрімиться на запит |

Четвертого варіанта немає. Компонент, що читає запит або незакешовані дані **без** найближчої межі `<Suspense>` над собою, — помилка, і в dev, і в `next build`. Ось приклад з 🤔 Передбач повністю, з усіма трьома видами (так само побудовано приклад у документації `caching.md#static-cached-and-streaming`):

```tsx
// app/store/page.tsx — три види вмісту на одній сторінці
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'
import { getFeatured, getStock } from '@/lib/db'

export default function StorePage() {
  return (
    <main>
      {/* 1. Статичне: без I/O — потрапляє в shell саме */}
      <h1>Крамниця</h1>

      {/* 2. Закешоване: результат 'use cache' теж у shell */}
      <Featured />

      {/* 3. Request-time: у shell лише fallback, вміст доїде стрімом */}
      <Suspense fallback={<p>Рахуємо кошик…</p>}>
        <CartBadge />
      </Suspense>
      <Suspense fallback={<p>Перевіряємо наявність…</p>}>
        <Stock />
      </Suspense>
    </main>
  )
}

async function Featured() {
  'use cache'
  cacheLife('hours')
  const items = await getFeatured()
  return (
    <ul>
      {items.map((p) => (
        <li key={p.slug}>
          {p.name} — {p.price} ₴
        </li>
      ))}
    </ul>
  )
}

async function CartBadge() {
  const count = (await cookies()).get('cart')?.value ?? '0'
  return <p>У кошику: {count}</p>
}

async function Stock() {
  const stock = await getStock('hat') // незакешоване: свіже на кожен запит
  return <p>Капелюхів на складі: {stock.count}</p>
}
```

Сама `StorePage` не `async` і нічого не чекає — це головна звичка під Cache Components. Чекання опускається якомога нижче, у маленькі компоненти під Suspense, і що нижче воно сидить, то більше сторінки потрапляє в shell. Документація називає це «maximizing the static shell», а в темі 11 ти бачив той самий прийом як «push dynamic access down».

Зверни увагу на `Featured`. Він асинхронний і чекає на «базу» 300 мс, але завдяки `'use cache'` виконався **під час збірки**, і його результат лежить у shell. Асинхронність сама по собі нічого не вирішує, вирішує лише те, чи відомий результат до запиту.

> [!diagram] Дерево сторінки: що піде в shell, а що стане діркою
> ```yaml
> layout: tree
> nodes:
>   - { id: page, label: "StorePage", text: "статичне", note: "не async, нічого не чекає", tone: blue, icon: "px:file" }
>   - { id: h1, label: "<h1>", text: "статичне", parent: page, tone: blue }
>   - { id: feat, label: "Featured", code: "'use cache'", note: "виконався на next build", parent: page, tone: green, icon: "px:database" }
>   - { id: s1, label: "<Suspense>", text: "fallback: Рахуємо кошик…", parent: page, tone: yellow, icon: "px:hourglass" }
>   - { id: cart, label: "CartBadge", code: "await cookies()", note: "дірка: лише на запит", parent: s1, tone: orange }
>   - { id: s2, label: "<Suspense>", text: "fallback: Перевіряємо наявність…", parent: page, tone: yellow, icon: "px:hourglass" }
>   - { id: stock, label: "Stock", code: "await getStock()", note: "дірка: 2 с, свіже щоразу", parent: s2, tone: orange }
> steps:
>   - { show: [page, h1], note: "next build рендерить дерево згори. StorePage і <h1> без I/O — вони стають частиною shell." }
>   - { show: feat, note: "Featured чекає на дані, але має 'use cache': Next.js виконує його під час збірки й кладе готовий список у shell." }
>   - { show: [s1, cart], note: "CartBadge читає cookies — їх на збірці немає. Рендер зупиняється, найближча межа Suspense віддає в shell свій fallback." }
>   - { show: [s2, stock], note: "Stock чекає на незакешовану базу. Так само: у shell лише «Перевіряємо наявність…», а сам компонент виконається на запит." }
>   - { focus: [cart, stock], note: "Помаранчеві вузли — дірки. Усе синє, зелене й жовті fallback-и вже лежать у готовому HTML." }
> ```
> Синє й зелене потрапляє в shell. Жовте (fallback) теж, а помаранчеве (дірка) з'являється лише на запит.

`next build` показує результат прямо в таблиці маршрутів. Новий символ `◐` означає Partial Prerender: shell зібрано, решта стрімиться. Колонки `Revalidate` і `Expire` прийшли від `cacheLife('hours')` у `Featured`, бо shell живе не довше, ніж найкоротший кеш у ньому:

```text
Route (app)      Revalidate  Expire
┌ ○ /
├ ○ /_not-found
└ ◐ /store               1h      1d

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

> [!quiz] Перевір себе: що потрапить у static shell?
> level: middle · type: multi · id: nextjs-core-12-quiz-03
>
> - [x] Заголовок сторінки з JSX без жодного `await`
> - [x] Результат async-компонента з `'use cache'` і `cacheLife('hours')`
> - [x] Текст `fallback` межі `<Suspense>`, всередині якої читаються `cookies()`
> - [ ] Вміст компонента, що читає `cookies()`, якщо він у `<Suspense>`
> - [ ] Результат незакешованого `await db.query()` у компоненті під `<Suspense>`
> - [ ] Будь-який async-компонент: Next.js дочекається всіх промісів під час збірки
>
> **Пояснення:** у shell іде все, що відоме до запиту: статичний JSX, закешовані результати й fallback-и. Вміст компонентів, які читають запит чи незакешовані дані, рендериться лише на запит — у shell замість нього стоїть fallback найближчої межі. «Дочекатися всіх промісів» Next.js не може й не хоче: тоді кожна сторінка з даними ставала б статичною зі старими даними.

### 🧯 Помилки збірки і як їх читати

Правило «кешуй або загорни в Suspense» Next.js перевіряє під час збірки й у dev. Найчастіша помилка виглядає так. Сторінка чекає на незакешовану «базу» на верхньому рівні:

```tsx
// app/stock/page.tsx — ❌ незакешоване читання поза Suspense
import { getStock } from '@/lib/db'

export default async function Page() {
  const stock = await getStock('hat')
  return <p>На складі: {stock.count}</p>
}
```

`next build` на 16.3.8 зупиняється з таким текстом:

```text
Error: Route "/stock": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at body (<anonymous>)
    at html (<anonymous>)
```

Як це читати:

1. **`Route "/stock"`** — маршрут, а не файл. Стек `at body / at html` у `next build` майже нічого не каже: продакшн-збірка не знає, який саме компонент чекав. Те саме повідомлення для `cookies()` у сторінці виглядає **ідентично** — збірка не розрізняє «читав запит» і «чекав на базу».
2. Щоб знайти рядок, запусти `next dev` і відкрий маршрут: dev-сервер покаже той самий текст зі стеком до конкретного `await` (`at getStock (lib/db.ts:21:9)`, `at TabPage (app/tabs/[tab]/page.tsx:6:31)`). Друга підказка з самого повідомлення — `next build --debug-prerender`.
3. Три виправлення в повідомленні — це і є три варіанти для незакешованих даних. Розберемо їх нижче.

Синхронні «нестабільні» значення мають власну помилку, і вона якраз вказує на рядок навіть у `next build`:

```text
Error: Route "/x": Next.js encountered the unstable value `new Date()` while prerendering.

This value can change between renders, so it must be either prerendered or computed later.

Ways to fix this:
  - [dynamic] Render at request time by adding a dynamic data access (e.g. `await connection()`) before this call
  - [cache] Prerender and cache the value with `"use cache"`
  - [client] Render the value on the client with `"use client"`
  - [measure] If the value is for telemetry, use a timing API such as `performance.now()`
```

Так само поводяться `Math.random()` (`blocking-prerender-random`) і `crypto.randomUUID()`. Варіанта `[block]` тут немає: `instant = false` цю помилку **не** знімає, і документація наголошує на цьому окремо (`migrating-to-cache-components.md#adopting-incrementally`).

Ще три тексти, які варто впізнавати:

- **`useSearchParams()` у Client Component поза Suspense:** `Next.js encountered URL data useSearchParams() in a Client Component outside of <Suspense>`. Пошукові параметри відомі лише на запит, тож цей хук **завжди** потребує межі, навіть у повністю клієнтській сторінці.
- **Runtime-дані в `generateMetadata`:** `Next.js encountered uncached or runtime data in generateMetadata()` з підказкою `This route's metadata is blocked, but the rest of its content can be prerendered`. Загорнути metadata в Suspense не можна; виправлення — нижче.
- **`cookies()` усередині `'use cache'`:** `Route /x used cookies() inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported`. Кеш спільний для всіх користувачів, тому дані запиту в нього не пускають: прочитай cookie зовні й передай значення аргументом.

> [!quiz] Перевір себе: що покаже next build?
> level: middle · type: output · id: nextjs-core-12-quiz-04
>
> Три сторінки, `cacheComponents: true`:
>
> ```tsx
> // app/a/page.tsx
> export default function A() {
>   return <p>Згенеровано: {new Date().toISOString()}</p>
> }
>
> // app/b/page.tsx
> export default async function B() {
>   'use cache'
>   return <p>Зібрано: {new Date().toISOString()}</p>
> }
>
> // app/c/page.tsx — Filter: 'use client' + useSearchParams()
> export default function C() {
>   return <Suspense fallback={<p>Фільтр…</p>}><Filter /></Suspense>
> }
> ```
>
> - [x] `/a` — помилка збірки про `new Date()`; `/b` і `/c` збираються
> - [ ] Усі три збираються: `new Date()` — не I/O, а `/c` клієнтська
> - [ ] `/a` і `/b` — помилки: `'use cache'` не рятує від нестабільних значень
> - [ ] `/a` — помилка, `/c` — помилка: Client Component не можна класти в Suspense на сервері
>
> **Пояснення:** `new Date()` у рендері без кешу й без `connection()`/`io()` — помилка «unstable value». `'use cache'` фіксує значення на момент збірки: усі бачитимуть один час до ревалідації. `/c` має межу над `useSearchParams()`, тож проходить; на 16.3.8 вона навіть стає `○`, бо fallback — увесь серверний вміст, а фільтр доходить у браузері.

### 🛠️ Три варіанти для незакешованих даних

Повідомлення про помилку пропонує `[cache]`, `[stream]` і `[block]`. Це не три синоніми, а три різні продуктові рішення.

**1. `[cache]` — закешувати.** Дані однакові для всіх і можуть бути трохи застарілими: каталог, статті, курси валют раз на годину. Додай `'use cache'` до функції або компонента якомога ближче до читання даних і обери `cacheLife`. Результат потрапить у shell і віддаватиметься миттєво. Деталі ключів кешу, профілів і тегів — тема 15 основного посібника; тут важливо лише, що кешоване = «відоме до запиту».

```tsx
// lib/catalog.ts — результат потрапить у shell
import { cacheLife } from 'next/cache'
import { getFeatured } from '@/lib/db'

export async function getCatalog() {
  'use cache'
  cacheLife('hours')
  return getFeatured()
}
```

**2. `[stream]` — загорнути в Suspense.** Дані мають бути свіжими на кожен запит (залишки на складі, баланс) або залежать від користувача (кошик, ім'я з cookie). Винеси читання в окремий компонент і обгорни його `<Suspense>` з fallback-ом **розміром з вміст**, щоб не було CLS. Так зроблено `Stock` і `CartBadge` вище. Якщо значення синхронне (`new Date()`, `Math.random()`), позначай I/O явно: `await connection()` (тема 10 основного посібника) або, з 16.3, `await io()` з `next/cache`, який документація радить замість `connection()`, бо він не блокує prefetch (`io.md`):

```tsx
// app/fixes/time/page.tsx — два способи впоратися з new Date()
import { Suspense } from 'react'
import { io } from 'next/cache'

export default function Page() {
  return (
    <main>
      <BuildStamp />
      <Suspense fallback={<p>Час запиту…</p>}>
        <RequestTime />
      </Suspense>
    </main>
  )
}

// Спосіб 1: захопити значення в shell — один для всіх до ревалідації
async function BuildStamp() {
  'use cache'
  return <p>Зібрано: {new Date().toISOString()}</p>
}

// Спосіб 2: рахувати на кожен запит — дірка в shell
async function RequestTime() {
  await io() // «далі синхронний I/O»: під час prerender призупиняється
  return <p>Зараз: {new Date().toISOString()}</p>
}
```

**3. `[block]` — дозволити маршруту блокувати.** `export const instant = false` у сторінці або layout каже: «я знаю, що цей сегмент не миттєвий, не перевіряй». Це не виправлення, а **відкладення**: на 16.3.8 сторінка з прикладу вище після такого рядка збирається, але у таблиці збірки `ƒ`; заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру. Користувач знову чекає 2 секунди на білому екрані, як у старій моделі. Інструмент для поступової міграції великого застосунку (нижче), а не для нового коду.

Є й четвертий, тихий варіант, якого немає в повідомленні: **прочитати на рівні модуля**. Конфіг чи JSON, однаковий для всіх запитів, можна прочитати `await readFile()` поза компонентом, і він стане частиною shell без жодного кешу (`caching.md#predictable-values`). А `fs.readFileSync` чи імпорт модуля в рендері Next.js вважає передбачуваними й пускає в shell автоматично.

> [!warning] Синхронний node:sqlite: документація суперечить сама собі
> `caching.md#predictable-values` відносить запити до синхронних вбудованих БД (`better-sqlite3`, `node:sqlite`) до передбачуваних значень, що йдуть у shell, а `io.md` радить викликати `await io()` перед `node:sqlite`. Різниця в намірі: хочеш значення зі збірки в shell — читай так, хочеш свіже на кожен запит — `io()` (або `connection()`) під Suspense. Не покладайся на те, що Next.js сам здогадається.

Metadata з runtime-даними — окремий випадок. `generateMetadata` не загорнеш у Suspense, тож документація радить або закешувати metadata (`'use cache'`, якщо дані зовнішні, але не з запиту), або додати на сторінку маркер, що робить маршрут динамічним, не чіпаючи вміст:

```tsx
// app/fixes/meta/page.tsx — metadata з cookies, сторінка лишається в shell
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { connection } from 'next/server'

export async function generateMetadata() {
  const lang = (await cookies()).get('lang')?.value ?? 'uk'
  return { title: `Крамниця (${lang})` }
}

async function Connection() {
  await connection()
  return null
}

function DynamicMarker() {
  return (
    <Suspense>
      <Connection />
    </Suspense>
  )
}

export default function Page() {
  return (
    <>
      <article>Статичний вміст</article>
      <DynamicMarker />
    </>
  )
}
```

`<article>` лишається в shell (маршрут `◐`), а `<title>` стрімиться разом з діркою маркера.

> [!quiz] Перевір себе: заповни пропуски, щоб сторінка зібралася з shell
> level: middle · type: fill · bank: 'use client', instant · id: nextjs-core-12-quiz-05
>
> ```tsx fill
> // app/product/page.tsx
> import { [[Suspense]] } from 'react'
> import { cacheLife } from 'next/cache'
> import { getProduct, getStock } from '@/lib/db'
>
> export default function Page() {
>   return (
>     <main>
>       <Info />
>       <Suspense [[fallback]]={<p>Перевіряємо наявність…</p>}>
>         <Stock />
>       </Suspense>
>     </main>
>   )
> }
>
> async function Info() {
>   [['use cache'|"use cache"]]
>   cacheLife('days')
>   const p = await getProduct('hat')
>   return <h1>{p?.name}</h1>
> }
>
> async function Stock() {
>   const s = await getStock('hat')
>   return <p>На складі: {s.count}</p>
> }
> ```
>
> **Пояснення:** опис товару однаковий для всіх, тож його кешуємо, і він опиняється в shell. Залишок має бути свіжим, тож він за межею Suspense, а в shell іде лише fallback. `instant = false` прибрав би помилку, але й shell разом з нею, а `'use client'` перетворив би сторінку на клієнтську без серверних даних.

### 🔎 Що в shell, а що в дірках: дивимося в HTML

Найкращий спосіб зрозуміти PPR — подивитися на сирий потік. Збери приклад `/store`, запусти `next start` і прочитай відповідь через `curl -N` (`-N` вимикає буферизацію curl, тож шматки видно в момент приходу). Ось скорочений вивід на 16.3.8 з мітками часу:

```html
<!-- [0.06 s] перший шматок: static shell зі збірки -->
<main>
  <h1>Крамниця</h1>
  <ul><li>Капелюх — 900 ₴</li><li>Кеди — 2400 ₴</li></ul>
  <!--$?--><template id="B:0"></template><p>Рахуємо кошик…</p><!--/$-->
  <!--$?--><template id="B:1"></template><p>Перевіряємо наявність…</p><!--/$-->
</main>
<script>self.__next_f.push([1, "…RSC payload shell…"])</script>

<!-- [0.06 s] cookies відомі одразу — перша дірка готова -->
<div hidden id="S:0"><p>У кошику: 0</p></div>
<script>$RC("B:0","S:0")</script>

<!-- [2.04 s] повільна «база» — друга дірка -->
<div hidden id="S:1"><p>Капелюхів на складі: 9</p></div>
<script>$RC("B:1","S:1")</script>
</body></html>
```

Що тут видно:

- **Shell — це справжній HTML**, а не заглушка: заголовок і закешований список уже на місці. Пошуковик і користувач без JavaScript бачать їх одразу.
- **Кожна дірка в shell — пара коментарів `<!--$?-->…<!--/$-->`** з порожнім `<template id="B:N">` і fallback-ом. Це звичайна розмітка React для межі Suspense, яка ще чекає.
- **Вміст дірки приходить у кінці потоку** прихованим `<div hidden id="S:N">`, а маленький скрипт `$RC("B:N","S:N")` переставляє його на місце fallback-а. Усе в одній HTTP-відповіді. Заголовки `x-nextjs-prerender: 1` і `x-nextjs-postponed: 1` тут не допоможуть відрізнити PPR: на 16.3.8 їх отримує й `ƒ`-сторінка. Відрізняй за таблицею збірки (`◐`) і за часом приходу тіла: shell у перших мілісекундах.
- **Порядок дірок — порядок готовності**, а не порядок у JSX. Кошик (cookies) був готовий одразу, склад — через 2 с.

Сам shell лежить на диску після збірки: `.next/server/app/store.html` — це рівно перший шматок потоку, а `store.meta` містить поле `postponed` — той самий `postponedState`. Так і працює PPR на рівні `next start`: прочитати HTML з кешу, віддати, продовжити рендер.

> [!warning] Деталі розмітки не є контрактом
> `<template id="B:0">`, `$RC` і `self.__next_f.push` — внутрішня реалізація React і Next.js 16.3.8, у документації їх немає. Не пиши тести чи парсери, що від них залежать; для перевірки «що в shell» є Navigation Inspector і `@next/playwright` (нижче).

> [!quiz] Перевір себе: склади, що відбувається з PPR-маршрутом від збірки до hydration
> level: senior · type: order · id: nextjs-core-12-quiz-06
>
> ```order
> next build рендерить дерево, доки не впреться в запит або незакешовані дані
> Shell (HTML з fallback-ами) і postponedState зберігаються разом
> Приходить запит, сервер одразу віддає shell
> Сервер відновлює рендер з postponedState лише для дірок
> Готові дірки дописуються в ту саму відповідь і стають на місце fallback-ів
> React гідратує сторінку, щойно приходить JS
> Браузер після hydration шле окремий fetch за вмістом дірок ✗
> Сервер чекає, доки всі дірки будуть готові, і лише тоді віддає shell ✗
> ```
>
> **Пояснення:** shell і `postponedState` народжуються разом на збірці й мусять жити разом. На запит shell іде без очікування, а сервер рендерить лише те, що відклав. Окремого клієнтського запиту немає — це одна потокова відповідь, як у темі 11.

### 🧩 Динамічні маршрути: generateStaticParams і shell

Для `/shop/[slug]` питання «що відомо до запиту» має ще один вимір: сам `slug`. У темі [[Next.js - 03. Динамічні маршрути]] `params` були просто промісом; під Cache Components `await params` — це читання запиту, яке поза Suspense дає ту саму помилку `uncached or runtime data`, якщо значення невідоме на збірці. Правильна форма — передати проміс у компонент під Suspense:

```tsx
// app/shop/[slug]/page.tsx — shell для відомих і невідомих slug
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { allSlugs, getProduct, getStock } from '@/lib/db'

export function generateStaticParams() {
  return allSlugs().slice(0, 2).map((slug) => ({ slug })) // hat, shoes
}

export default function ProductPage({ params }: PageProps<'/shop/[slug]'>) {
  return (
    <main>
      <p>Безкоштовна доставка від 1000 ₴</p>
      <Suspense fallback={<h1>Завантажуємо товар…</h1>}>
        <ProductInfo params={params} />
      </Suspense>
      <Suspense fallback={<p>Перевіряємо наявність…</p>}>
        <Stock params={params} />
      </Suspense>
    </main>
  )
}

async function ProductInfo({ params }: Pick<PageProps<'/shop/[slug]'>, 'params'>) {
  const { slug } = await params
  const product = await getCachedProduct(slug)
  if (!product) notFound()
  return (
    <h1>
      {product.name} — {product.price} ₴
    </h1>
  )
}

async function getCachedProduct(slug: string) {
  'use cache'
  return getProduct(slug)
}

async function Stock({ params }: Pick<PageProps<'/shop/[slug]'>, 'params'>) {
  const { slug } = await params
  const stock = await getStock(slug)
  return <p>На складі: {stock.count}</p>
}
```

Вивід `next build`:

```console
├   /shop/[slug]
│ ├ ◐ /shop/[slug]
│ ├ ◐ /shop/hat                     15m      1y
│ └ ◐ /shop/shoes                   15m      1y
```

Тут три shell-и, і вони різні:

- **`/shop/hat` і `/shop/shoes`** — slug відомий на збірці, тож `ProductInfo` дорендерився: у `hat.html` уже стоїть `<h1>Капелюх — 900 ₴</h1>`, а діркою лишився тільки склад. `15m / 1y` — профіль `cacheLife` за замовчуванням для `getCachedProduct`.
- **`/shop/[slug]`** — це **App Shell**: версія без конкретного параметра. У ній «Безкоштовна доставка» і **обидва** fallback-и. Її отримує будь-який slug, якого не було в `generateStaticParams`, наприклад `/shop/scarf`.

На вкладених маршрутах з'являються проміжні рядки. Якщо `generateStaticParams` для `/catalog/[cat]/[item]` повертає лише `{ cat: 'hats' }`, збірка дає `◐ /catalog/hats/[item]` — shell з відомою категорією й невідомим товаром — і загальний `◐ /catalog/[cat]/[item]`.

> [!warning] Оновлення App Shell після першого візиту потребує partialPrefetching
> Документація обіцяє, що невідомий URL після першого відвідування «upgraded in the background» і далі віддається з конкретним вмістом (`caching.md#incremental-static-regeneration`). На 16.3.8 з лише `cacheComponents: true` цього не відбувається: три запити поспіль до `/shop/scarf` щоразу отримують App Shell з fallback-ом товару. Після додавання `partialPrefetching: true` (з 16.3) другий запит уже має `<h1>Шарф — 650 ₴</h1>` у shell. Так і написано в гайді [ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components): «Enable both», але сторінка `caching.md` про це мовчить.

Дві зміни поведінки, які ламають старий код (`migrating-to-cache-components.md#generatestaticparams-and-dynamicparams`):

- **`generateStaticParams` мусить повернути хоча б один результат.** Порожній масив, який раніше означав «усе на запит», тепер зупиняє збірку: `When using Cache Components, all generateStaticParams functions must return at least one result`. Next.js потрібен хоча б один реальний рендер, щоб перевірити, що в маршруті немає прихованих динамічних звертань.
- **`dynamicParams` видалено.** Експорт дає `Route segment config "dynamicParams" is not compatible with nextConfig.cacheComponents`. Невідомі параметри рендеряться на запит завжди; щоб відхилити неіснуючий slug, викликай `notFound()`. Пам'ятай з теми 11: `notFound()` усередині Suspense після початку стріму дає `200` з `noindex`, а не справжній 404.

І пастка, яку легко пропустити: клієнтські хуки `usePathname`, `useParams`, `useSelectedLayoutSegment(s)` у спільному layout суспендять, поки Next.js генерує shell для маршруту, чий pathname на збірці невідомий. Меню з підсвіткою активного пункту в root layout ламає збірку динамічного маршруту **без** `generateStaticParams` з текстом `Next.js encountered URL data usePathname() in a Client Component outside of <Suspense>` (`blocking-prerender-client-hook`). Маршрут з `generateStaticParams`, як `/shop/[slug]` вище, на 16.3.8 збирається як `◐`. Виправлення — загорнути в `<Suspense>` саме меню.

> [!quiz] Перевір себе: що побачить перший відвідувач /shop/scarf?
> level: senior · id: nextjs-core-12-quiz-07
>
> Маршрут — як у прикладі вище: `generateStaticParams` повертає `hat` і `shoes`, у конфігу лише `cacheComponents: true`. Користувач уперше відкриває `/shop/scarf`.
>
> - [x] App Shell: «Безкоштовна доставка» і обидва fallback-и, а назва товару й склад доїдуть стрімом
> - [ ] 404: `scarf` немає в `generateStaticParams`, а `dynamicParams` за замовчуванням `false`
> - [ ] Shell від `/shop/hat` з назвою «Капелюх», яку React замінить після hydration
> - [ ] Білу сторінку на 2 с: невідомий slug рендериться повністю на запит, без shell
>
> **Пояснення:** для невідомих параметрів Next.js віддає URL-незалежний App Shell (`/shop/[slug]` у виводі збірки) і стрімить обидві дірки. `dynamicParams` під Cache Components взагалі немає. Shell іншого slug не підійде: у ньому чужі дані.

### ⚡ Instant navigation

Shell розв'язує перший захід. Але більшість переходів у застосунку — **клієнтська навігація** через `<Link>`, а там діють інші правила. При навігації з `/tabs/a` на `/tabs/b` Next.js перерендерює лише те, що **нижче** спільного layout `/tabs`. Межа `<Suspense>`, що стоїть у самому layout або вище, у цьому перерендері не бере участі, тож її fallback показати не можна, і навігація чекає, доки сервер віддасть сторінку повністю (`instant-navigation.md#what-instant-means`).

Ось маршрут, який **проходить** `next build`, але не є миттєвим:

```tsx
// app/tabs/layout.tsx — Suspense стоїть ВИЩЕ за сторінку
import Link from 'next/link'
import { Suspense } from 'react'

export default function TabsLayout({ children }: LayoutProps<'/tabs'>) {
  return (
    <section>
      <nav>
        <Link href="/tabs/a">A</Link> · <Link href="/tabs/b">B</Link>
      </nav>
      <Suspense fallback={<p>Завантаження розділу…</p>}>{children}</Suspense>
    </section>
  )
}
```

```tsx
// app/tabs/[tab]/page.tsx — await params на верхньому рівні сторінки
import { getStock } from '@/lib/db'

export default async function TabPage({ params }: PageProps<'/tabs/[tab]'>) {
  const { tab } = await params
  const stock = await getStock(tab)
  return <h1>Вкладка {tab}: {stock.count}</h1>
}
```

Для першого заходу межа в layout ловить усе, тож `next build` дає `◐ /tabs/[tab]`. А `next dev` на першому ж відкритті сторінки пише в термінал (і в dev overlay):

```text
Error: Route "/tabs/[tab]": Next.js encountered uncached data during prerendering or a navigation.

`fetch(...)` or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered or the navigation from being instant, leading to a slower user experience.
    at getStock (lib/db.ts:21:9)
    at TabPage (app/tabs/[tab]/page.tsx:6:31)
```

Це і є **instant navigation validation**: dev симулює і перший захід, і клієнтську навігацію на кожному рівні спільних layouts і показує, що заблокує перехід. Виправлення те саме, що й завжди: межа нижче. `app/tabs/[tab]/loading.tsx` ставить Suspense **під** layout `/tabs`, і після цього dev мовчить. Помилка навігації живе тільки в dev: збірку вона не зупиняє, а сторінка в dev віддає `200`.

> [!quiz] Перевір себе: що буде з маршрутом /tabs/[tab]?
> level: senior · type: output · id: nextjs-core-12-quiz-08
>
> Layout `/tabs` обгортає `{children}` у `<Suspense>`. Сторінка `/tabs/[tab]` робить `await params` і незакешований `await getStock(tab)` на верхньому рівні. `loading.tsx` немає.
>
> - [x] `next build` проходить (`◐`), `next dev` показує помилку про навігацію; клієнтський перехід A → B чекає на сервер
> - [ ] `next build` падає з «uncached or runtime data», бо `await` стоїть поза Suspense у файлі сторінки
> - [ ] Усе гаразд: межа в layout покриває і перший захід, і навігацію між вкладками
> - [ ] `next dev` мовчить, а `next build` пише попередження про instant navigation
>
> **Пояснення:** для першого заходу межа в layout — найближча над сторінкою, тож shell є. Але при навігації між вкладками layout не перерендерюється, і його межа не спрацьовує. Перевірку навігацій робить лише dev; у збірці її поки немає (рівень `level` має лише `'warning'`).

Три інструменти Instant navigation. Усі вони **experimental**: документація пише «Because this feature is experimental», а пакет `@next/playwright` 16.3.8 на npm має статус «Experimental. This API is not yet stable».

**`instant` — route segment config.** Працює лише з `cacheComponents` і лише в серверних файлах (`page`, `layout`, `default`):

```tsx
// app/dashboard/layout.tsx
export const instant = false // сегменту дозволено блокувати навігацію
```

- `true` — перевіряти цей сегмент на рівні з глобального налаштування (за замовчуванням dev-попередження);
- `false` — сегмент може блокувати, перевірок для нього немає. Навігації між дочірніми сегментами нижче все одно перевіряються;
- `{ level: 'warning' }` — явний рівень; інших рівнів у 16.3 поки немає, «рівень для збірки» обіцяють у майбутньому.

За замовчуванням (`experimental.instantInsights.validationLevel: 'warning'`) перевіряється кожна Page і Default. Режим `'manual-warning'` перевіряє лише сегменти з явним `instant`. І ще одна роль `false`: якщо найвищий `instant` у дереві маршруту — `false`, Next.js не перевіряє, що маршрут має непорожній static shell. Тому `instant = false` на root layout вимикає цю перевірку для всього застосунку, і ставити його так високо не варто.

**Navigation Inspector** — панель у Next.js DevTools (`next dev`, лише з Cache Components). Увімкни **Pause on navigations**: оновлення сторінки «заморозить» static shell, клік по посиланню — те, що навігація покаже миттєво. **Resume** відпускає. У поєднанні з панеллю Suspense у React DevTools видно, яка межа що накриває. Відома проблема: інспектор використовує cookie `next-instant-navigation-testing`, а cookie на `localhost` спільний для всіх портів, тож при перемиканні між проєктами його треба чистити.

**`instant()` з `@next/playwright`** — те саме «заморожування» в e2e-тесті: усередині колбека ти перевіряєш лише миттєвий UI, динамічний вміст притримано.

```ts
// e2e/tabs.test.ts — ідея; повний розбір у темі 41 основного посібника
import { test, expect } from '@playwright/test'
import { instant } from '@next/playwright'

test('вкладка B відкривається миттєво', async ({ page }) => {
  await page.goto('/tabs/a')
  await instant(page, async () => {
    await page.click('a[href="/tabs/b"]')
    await page.waitForURL((url) => url.pathname === '/tabs/b')
    // миттєвий UI: fallback сторінки є, даних ще немає
    await expect(page.getByText('Завантаження вкладки…').filter({ visible: true })).toHaveCount(1)
    await expect(page.getByRole('heading', { name: /Вкладка b/ })).toHaveCount(0)
  })
  // Activity лишає /tabs/a в DOM прихованою — перевіряй видимість, а не наявність
  await expect(page.getByRole('heading', { name: /Вкладка b/ })).toBeVisible()
})
```

Тут `Завантаження вкладки…` — текст з `app/tabs/[tab]/loading.tsx`. На 16.3.8 цей тест проходить з `loading.tsx` і падає без нього, і в `next dev`, і проти `next start`. Для `next start` у CI потрібен `experimental.exposeTestingApiInProductionBuild: true`. Дві поради для таких тестів. Перевіряй видимість, а не наявність: `page.locator('h1')` знаходить **два** заголовки, бо Activity тримає попередню вкладку в DOM прихованою. І давай fallback-ам у layout і `loading.tsx` різні тексти, інакше локатор стане неоднозначним. Налаштування Playwright і стратегію e2e розбираємо в темі 41 основного посібника, а prefetch App Shell і `partialPrefetching` — у [[Next.js - 04. Навігація під капотом]].

> [!diagram] Перший захід і клієнтська навігація бачать різні межі
> ```yaml
> layout: compare
> columns: { load: "Перший захід /tabs/b", nav: "Навігація /tabs/a → /tabs/b" }
> nodes:
>   - { id: l1, col: load, label: "root layout", text: "рендериться", tone: blue }
>   - { id: l2, col: load, label: "tabs/layout", code: "<Suspense>", note: "ловить await сторінки", tone: yellow, icon: "px:hourglass" }
>   - { id: l3, col: load, label: "tabs/[tab]/page", code: "await getStock()", note: "дірка в shell", tone: orange }
>   - { id: n1, col: nav, label: "root layout", text: "уже на екрані", tone: gray }
>   - { id: n2, col: nav, label: "tabs/layout", text: "уже на екрані", note: "його Suspense не бере участі", tone: gray }
>   - { id: n3, col: nav, label: "tabs/[tab]/page", code: "await getStock()", note: "межі над ним немає → чекаємо", tone: red }
> steps:
>   - { show: [l1, l2, l3], note: "Перший захід рендерить усе дерево від кореня. Межа в layout найближча до сторінки, тож у shell іде її fallback." }
>   - { show: [n1, n2], note: "При навігації між вкладками спільний layout /tabs уже змонтований і не перерендерюється." }
>   - { show: n3, note: "Перерендерюється лише сторінка. Над нею в зоні перерендеру немає жодної межі — показати нічого, навігація чекає 2 с." }
>   - { focus: n3, note: "Виправлення: loading.tsx у tabs/[tab] або Suspense усередині сторінки — межа під спільним layout." }
> ```
> Валідація в dev перевіряє обидві колонки окремо. Межа, що покриває одну, може не покривати іншу.

### 🚫 Несумісне з Cache Components

Частина старих налаштувань під Cache Components не має сенсу і зупиняє збірку ще на етапі компіляції, з однаковим шаблоном `Route segment config "<key>" is not compatible with nextConfig.cacheComponents. Please remove it.`:

| Що | Що станеться на 16.3.8 | Чим замінити |
|---|---|---|
| `export const dynamic = …` | помилка компіляції | `force-dynamic`: просто видалити; `force-static`: `'use cache'` + `cacheLife('max')` |
| `export const revalidate = N` | помилка компіляції | `'use cache'` + `cacheLife` з близьким профілем |
| `export const fetchCache = …` | помилка компіляції | `'use cache'`: усі `fetch` у кеш-скоупі кешуються |
| `export const dynamicParams = …` | помилка компіляції | видалити; невідомий slug → `notFound()` |
| `export const runtime = …` | помилка компіляції | видалити (Node.js — єдиний варіант); edge-логіку — у `proxy.ts` |
| `export const experimental_ppr` | помилка компіляції | видалити |
| `generateStaticParams` → `[]` | помилка збору даних сторінки | повернути хоча б один реальний параметр |
| `experimental.ppr` у конфігу | збірка не стартує | `cacheComponents: true` |
| CSP з `nonce` | збірка **проходить**, у браузері ламається hydration | дивись нижче |

> [!warning] runtime = 'nodejs' теж заборонений
> Документація пише, що Cache Components потребує Node.js runtime, і радить прибрати deprecated `runtime = 'edge'` (`cacheComponents.md`). На 16.3.8 збірку зупиняє будь-який експорт `runtime`, навіть `export const runtime = 'nodejs'`, той самий текст `Route segment config "runtime" is not compatible`. Видаляй рядок повністю.

**CSP з nonce — найпідступніша несумісність**, бо збірка нічого не каже. Nonce має бути новим на кожен запит, а static shell зібрано заздалегідь, коли запиту немає. Документація прямо пише, що PPR «incompatible with nonce-based CSP since static shell scripts won't have access to the nonce», а статична генерація й ISR з nonce вимикаються (`content-security-policy.md`). На 16.3.8 це виглядає так: `proxy.ts` ставить заголовок `Content-Security-Policy` з `'nonce-…' 'strict-dynamic'`, маршрут `/store` лишається `◐`. Скрипти в **дірках** отримують `nonce`, бо рендеряться на запит, а `<script src>` у shell — ні. Headless Chrome показує `Loading the script '…/_next/static/chunks/….js' violates the following Content Security Policy directive`, HTML видно, але сторінка не гідратується: кнопки мертві.

Робочий варіант на 16.3.8 — зробити такі маршрути блокуючими, щоб увесь HTML рендерився на запит:

```tsx
// app/secure/layout.tsx — під CSP з nonce: маршрут повністю на запит
import { connection } from 'next/server'

export const instant = false // дозволяємо блокувати: shell тут не потрібен

export default async function SecureLayout({ children }: LayoutProps<'/secure'>) {
  await connection() // рендер лише на запит, тож Next.js проставить nonce
  return <>{children}</>
}
```

Маршрут стає блокуючим: у таблиці збірки `ƒ`; заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру. Усі скрипти отримують nonce, hydration працює. Ціна — та сама, що й у старій моделі: користувач чекає на повний рендер, CDN-кешу немає. Альтернатива без цієї ціни — CSP на хешах через experimental `sri` (тема 30 основного посібника).

> [!quiz] Перевір себе: що зупинить збірку з cacheComponents: true?
> level: senior · type: multi · id: nextjs-core-12-quiz-09
>
> - [x] `export const dynamic = 'force-dynamic'` у сторінці
> - [x] `generateStaticParams`, що повертає `[]`
> - [x] `export const runtime = 'edge'` у Route Handler чи сторінці
> - [x] `export const dynamicParams = false` поруч з `generateStaticParams`
> - [ ] Proxy, що ставить CSP з nonce на кожен запит
> - [ ] `export const instant = false` у layout
>
> **Пояснення:** сегментні `dynamic`, `revalidate`, `fetchCache`, `dynamicParams`, `runtime` і порожній `generateStaticParams` під Cache Components — помилки. CSP з nonce збірку не зупиняє, і в цьому біда: зламана hydration видна лише в браузері. `instant = false` — валідна опція Cache Components.

### 🔁 Міграція: з route segment config на Cache Components

Існуючий застосунок не переходить на Cache Components одним рядком: увімкнений прапорець зупиняє збірку на кожному `dynamic`, `revalidate` і незакешованому `await` поза Suspense. Документація пропонує дві стратегії: перевести все одразу або поступово, і для поступової є готовий інструмент (`migrating-to-cache-components.md`).

**Поступово, по кроках:**

1. Увімкни `cacheComponents: true` і заміни всі сегментні конфіги (таблиця нижче) — без цього збірка не почнеться.
2. Познач маршрути, які ще не готові: `instant = false`. Codemod 16.3 ставить його в кожен `page`, `layout` і `default`, де `instant` ще немає: `npx @next/codemod@canary cache-components-instant-false ./app` (для `src/` — `./src/app`; хибний шлях мовчки дає `0 ok`).
3. Виправ синхронний I/O (`new Date()`, `Math.random()`, `crypto.randomUUID()`) — його `instant = false` не відкладає.
4. По одному маршруту: прибери `instant = false`, виконуй підказки dev overlay (`'use cache'` або `<Suspense>`), доки вони не зникнуть.

**Було → стало для конфігів:**

```tsx
// ❌ було: app/blog/page.tsx
export const revalidate = 3600
export const fetchCache = 'force-cache'

export default async function Page() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

```tsx
// ✅ стало: app/blog/page.tsx
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours') // revalidate 3600 → найближчий профіль
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

| Було | Стало |
|---|---|
| `dynamic = 'force-dynamic'` | видалити: усе динамічне за замовчуванням |
| `dynamic = 'force-static'` | видалити; незакешовані дані → `'use cache'` + `cacheLife('max')`; runtime-дані прибрати |
| `revalidate = N` | `'use cache'` + `cacheLife('seconds' \| 'minutes' \| 'hours' \| 'days' \| 'weeks' \| 'max')` або власний профіль |
| `fetchCache = 'force-cache'` | `'use cache'` на рівні сторінки чи функції |
| `fetch(url, { next: { revalidate, tags } })` | функція з `'use cache'`, `cacheLife`, `cacheTag` |
| `unstable_noStore()` | видалити; якщо треба саме на запит — `connection()` під Suspense |
| `dynamicParams = false` | видалити; `notFound()` для неіснуючих |
| `generateStaticParams() { return [] }` | повернути хоча б один параметр |
| `runtime = 'edge'` | видалити; edge-логіку — у `proxy.ts` |
| GET Route Handler з `dynamic = 'force-static'` | видалити; дані — через окрему функцію з `'use cache'` (директиву не можна ставити на сам `GET`) |

Одна різниця, про яку легко забути: дані `fetch` Data Cache і `unstable_cache` переживають деплой і живуть між serverless-інстансами, а `'use cache'` за замовчуванням зберігає результат у пам'яті одного інстансу й одного деплою. Для довговічного сховища є `'use cache: remote'` і cache handlers (теми 15 і 18 основного посібника), але й вони не переносять кеш через деплой: ключ містить build id, тож після нового деплою закешовані значення обчислюються заново (`migrating-to-cache-components.md#fetch-cache-options`).

> [!quiz] Перевір себе: чим замінити export const revalidate = 3600?
> level: middle · id: nextjs-core-12-quiz-10
>
> - [x] Прибрати експорт і додати `'use cache'` з `cacheLife('hours')` у сторінку або функцію даних
> - [ ] Лишити як є: `revalidate` — частина ISR, а ISR з Cache Components сумісний
> - [ ] Замінити на `export const instant = 3600`
> - [ ] Перенести в `fetch(url, { next: { revalidate: 3600 } })` всередині сторінки
>
> **Пояснення:** сегментний `revalidate` під Cache Components — помилка компіляції; його роль перейшла до `cacheLife`. `instant` про навігацію, а не про час життя. А `next.revalidate` у `fetch` — стара модель кешу, яку міграція якраз прибирає.

### 🌍 PPR на платформі: self-hosting і CDN

Для розробника PPR — модель рендеру, для платформи — вимоги до інфраструктури. Коротко, з `ppr-platform-guide.md` (деталі деплою — тема 43 основного посібника):

- **Лише origin.** `next start` сам читає shell зі свого кешу, віддає його, продовжує рендер і стрімить дірки. Документація: «If your platform supports streaming HTTP responses, it supports PPR». Підходить для будь-якого Node.js-хостингу без додаткових налаштувань.
- **Shell на CDN + рендер на origin.** Для TTFB на рівні edge CDN віддає закешований shell одразу й паралельно шле на origin **resume-запит**: `POST` на маршрут із заголовком `next-resume: 1` і `postponedState` у тілі. Origin рендерить лише дірки, а CDN склеює обидва потоки в одну відповідь. Більшість CDN цього з коробки не вміє, і документація чесно називає end-to-end підтримку «still emerging».
- **Атомарність.** Shell і `postponedState` оновлюються тільки разом: новий shell зі старим станом дасть зламаний динамічний вміст. Адаптери (`adapterPath`) бачать PPR-маршрути як `renderingMode: 'PARTIALLY_STATIC'`.
- **Деградація.** Якщо `postponedState` недоступний, платформа має зробити повний серверний рендер — користувач отримає сторінку, просто без «shell одразу».
- **Буферизація ламає ефект.** Nginx з `proxy_buffering`, компресія чи проксі, що чекають кінця відповіді, перетворюють PPR на «чекаємо 2 с і віддаємо все». Як і зі стрімінгом у темі 11: `X-Accel-Buffering: no` і перевірка через `curl -N` на проді.

### 🏭 Як це роблять у продакшні

- **Нові проєкти — одразу з `cacheComponents: true`**, бо Next.js 16 радить саме так. Сторінки й layouts не `async`; чекання живе в листках під Suspense, а `params`, `searchParams` і `cookies()` передаються вниз як проміси.
- **Shell як продуктове рішення.** На рев'ю питають: що користувач бачить у першому кадрі? Над згином (заголовок, ціна, головне фото — LCP-елемент) — у shell через `'use cache'`. У дірки — персональне й справді живе.
- **Fallback-и розміром з вміст** (skeleton тієї самої висоти), інакше PPR виграє FCP і програє CLS.
- **Navigation Inspector перед мерджем** для ключових сторінок і `instant()`-тести на 3–5 головних переходів (каталог → товар → кошик) у CI.
- **`instant = false` — тимчасовий борг**, з тікетом. Його пошук по репозиторію показує, скільки маршрутів ще блокують.
- **`next build` у CI — перший тест PPR:** помилки «uncached or runtime data» не доходять до проду. Для налагодження — `next dev` або `next build --debug-prerender`.
- **Перевір стрім на проді:** `curl -N https://…/store` має показати shell одразу. Якщо все прийшло разом — винен буферизуючий проксі.
- **CSP з nonce** — свідоме рішення з таблицею «які маршрути втрачають shell»; частіше обирають hash-based CSP.

## ⚠️ Пастки

> [!pitfall] await на верху layout
> Один `await` сесії чи `params` у layout робить request-time увесь сегмент разом із `children` — у shell лишається тільки fallback найближчої межі вище.
>
> ```tsx
> // ❌ app/shop/[slug]/layout.tsx
> const { slug } = await params // увесь layout і сторінки під ним — дірка
>
> // ✅ layout не async, читання — у листку під Suspense
> <Suspense fallback={<h1>…</h1>}>{params.then(({ slug }) => <h1>{slug}</h1>)}</Suspense>
> ```

> [!pitfall] instant = false як «вимикач помилки»
> Збірка проходить, але у таблиці збірки `ƒ`; заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру: користувач чекає на найповільніший запит. Це відкладення міграції, а не виправлення.
>
> ```tsx
> export const instant = false // ❌ замість Suspense у новому коді
> ```

> [!pitfall] Suspense на всю сторінку
> Валідацію задовольняє, але shell — це один великий fallback. Прийнятний мінімум, а не мета: опускай межу до компонента, що реально чекає.
>
> ```tsx
> <Suspense fallback={<PageSkeleton />}><WholePage /></Suspense> // ❌ shell порожній
> ```

> [!pitfall] Меню з usePathname у root layout і маршрут без generateStaticParams
> Для динамічного маршруту без `generateStaticParams` pathname на збірці невідомий, хук суспендить, і збірка падає: `encountered URL data usePathname() in a Client Component outside of <Suspense>`. Маршрути з `generateStaticParams` збираються. Загорни в Suspense саме меню.
>
> ```tsx
> <Suspense fallback={<NavSkeleton />}><ActiveNav /></Suspense> // ✅ ActiveNav читає usePathname
> ```

> [!pitfall] cookies() усередині 'use cache'
> Кеш спільний для всіх, тому дані запиту в нього не пускають: помилка `used cookies() inside "use cache"`. Прочитай зовні, передай аргументом — значення стане частиною ключа.
>
> ```tsx
> const cart = (await cookies()).get('cart')?.value // поза кешем
> return <CartSummary cartId={cart} /> // CartSummary має 'use cache'
> ```

> [!pitfall] PPR «не працює» на проді
> Локально shell приходить одразу, на проді — усе через 2 с. Код ні до чого: проксі чи CDN буферизує відповідь. Перевір `curl -N` і `X-Accel-Buffering: no`.

## 🎤 На співбесіді

> [!interview] Що таке Partial Prerendering? Чим він відрізняється від SSG, SSR і звичайного стрімінгу?
> level: middle · frequency: дуже часто · id: nextjs-core-12-int-01
>
> ---
>
> PPR ділить сторінку на static shell і динамічні дірки. На `next build` Next.js рендерить усе, що не залежить від запиту й не робить незакешованого I/O, разом із fallback-ами меж Suspense, і зберігає HTML плюс `postponedState`. На запит shell віддається одразу, а сервер дорендерює лише дірки й дописує їх у ту саму відповідь. SSG дає один статичний HTML на маршрут, SSR рендерить усе на запит, а звичайний стрімінг рендерить і shell теж на запит. PPR поєднує статичний TTFB із даними на запит без клієнтських `fetch`. У Next.js 16 його вмикає `cacheComponents: true`.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🧭 Навіщо Partial Prerendering|Розділ: навіщо PPR]] · [Next.js: Caching — Prerendering](https://nextjs.org/docs/app/getting-started/caching#prerendering) · [Next.js: Rendering Philosophy](https://nextjs.org/docs/app/guides/rendering-philosophy)

> [!interview] Після увімкнення cacheComponents збірка падає з «uncached or runtime data during prerendering». Як діятимеш?
> level: senior · frequency: часто · id: nextjs-core-12-int-02
>
> ---
>
> Спершу знайду місце: `next build` показує лише маршрут, тому відкрию його в `next dev` (стек до конкретного `await`) або запущу `next build --debug-prerender`. Далі вирішу за даними. Однакові для всіх і можуть трохи застаріти — `'use cache'` з `cacheLife`, вони підуть у shell. Свіжі або персональні — винесу читання в листовий компонент під `<Suspense>` з fallback-ом розміром з вміст, а `params`/`searchParams` передам як проміс. Синхронні `new Date()`/`Math.random()` — `'use cache'` або `io()`/`connection()` під Suspense. `instant = false` поставлю лише тимчасово, під час поступової міграції, бо він прибирає shell.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🛠️ Три варіанти для незакешованих даних|Розділ: три варіанти]] · [Next.js: blocking-prerender-dynamic](https://nextjs.org/docs/messages/blocking-prerender-dynamic) · [Next.js: Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)

> [!interview] Сторінка має static shell, але клієнтська навігація на неї повільна. Чому так буває і як це перевірити?
> level: senior · frequency: часто · id: nextjs-core-12-int-03
>
> ---
>
> Shell покриває перший захід, де рендериться все дерево від кореня. При клієнтській навігації перерендерюється лише частина нижче спільного layout, тож межа Suspense в самому layout або вище не спрацьовує, і перехід чекає на сервер. Next.js з Cache Components перевіряє це в dev (instant navigation validation) і пише помилку з назвою компонента. Виправлення — межа нижче (`loading.tsx` у сегменті сторінки, Suspense у листку) або кеш. Перевіряю Navigation Inspector з «Pause on navigations», а в CI — `instant()` з `@next/playwright`. Усе це поки experimental.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#⚡ Instant navigation|Розділ: Instant navigation]] · [Next.js: Instant navigation](https://nextjs.org/docs/app/guides/instant-navigation) · [Next.js: instant](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant)

> [!interview] Як розгорнути PPR на власній інфраструктурі з CDN? Що може піти не так?
> level: senior · frequency: іноді · id: nextjs-core-12-int-04
>
> ---
>
> Найпростіше — origin-only: `next start` сам віддає shell з кешу і стрімить дірки; потрібен лише стрімінг HTTP без буферизації (nginx `X-Accel-Buffering: no`, без компресії, що чекає кінця). Для TTFB на edge CDN кешує shell і паралельно шле на origin resume-запит (`POST`, `next-resume: 1`, `postponedState` у тілі), а потім склеює потоки — більшість CDN цього не вміють без власної інтеграції. Shell і `postponedState` треба оновлювати атомарно, інакше дірки будуть неузгоджені; без стану — повний серверний рендер. І CSP з nonce несумісний зі shell: такі маршрути доведеться робити повністю динамічними.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🌍 PPR на платформі: self-hosting і CDN|Розділ: PPR на платформі]] · [Next.js: PPR Platform Guide](https://nextjs.org/docs/app/guides/ppr-platform-guide) · [Next.js: Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)

> [!interview] Великий застосунок на Next.js 15 з revalidate і force-dynamic. Як спланувати перехід на Cache Components?
> level: senior · frequency: іноді · id: nextjs-core-12-int-05
>
> ---
>
> Спершу оновлення до 16, потім `cacheComponents: true` і заміна сегментних конфігів, бо вони одразу ламають компіляцію: `force-dynamic` — видалити, `revalidate` — `'use cache'` + `cacheLife`, `fetchCache` і `fetch`-опції — `'use cache'`/`cacheTag`, `dynamicParams` — `notFound()`, порожній `generateStaticParams` — хоча б один параметр, `runtime` — прибрати. Далі codemod `cache-components-instant-false` дає зелену збірку, синхронний I/O правлю одразу, бо його не відкласти. Потім маршрут за маршрутом прибираю `instant = false` і йду за підказками overlay. Окремо враховую, що `'use cache'` за замовчуванням не переживає деплой і serverless-інстанс, на відміну від Data Cache, і що стан сторінок тепер зберігається через Activity.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🔁 Міграція: з route segment config на Cache Components|Розділ: міграція]] · [Next.js: Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) · [Next.js: Version 16 upgrade](https://nextjs.org/docs/app/guides/upgrading/version-16)

## 🔗 Звʼязки

- [[Next.js - 10. Статичний і динамічний рендеринг]] — Request-time APIs, `connection()` і `io()`: що саме робить компонент динамічним.
- [[Next.js - 11. Streaming і Suspense]] — механіка потоку, на якій стоїть PPR: межі, порядок, HTTP-контракт, `notFound()` і статус 200.
- [[Next.js - 03. Динамічні маршрути]] — `generateStaticParams` і async `params`.
- [[Next.js - 04. Навігація під капотом]] — prefetch App Shell, Partial Prefetching, Activity.
- [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration]] — що за `self.__next_f.push` у shell.
- [[Suspense]] — довідник React.
- Далі в курсі: тема 15 — `'use cache'`, `cacheLife`, `cacheTag`; 16 — ревалідація; 30 — CSP; 41 — e2e і `instant()`; 43 — деплой і адаптери.

## ⚡ Фішки

> [!reel] 🧱 PPR — одна відповідь, а не дві
> Static shell і динамічні дірки приходять в одному HTTP-потоці: shell одразу зі збірки, дірки дописуються в кінець, а `$RC` ставить їх на місце fallback-ів. Жодного клієнтського fetch.

> [!reel] ◐ Новий символ у next build
> `◐ (Partial Prerender)` — маршрут має shell, а частина стрімиться. Колонки Revalidate/Expire беруться з найкоротшого `cacheLife` у shell.

> [!reel] 🔎 Подивись на shell очима curl
> `curl -N` вимикає буфер, і видно, як shell приходить за мілісекунди, а `<div hidden id="S:1">` з даними — через 2 с.
>
> ```bash
> curl -sN http://localhost:3000/store
> ```

> [!reel] 🚦 instant = false не прибирає помилку new Date()
> Він дозволяє сегменту блокувати, але синхронні `new Date()`, `Math.random()`, `crypto.randomUUID()` під час prerender однаково зупиняють збірку.

> [!reel] 🔐 Nonce ламає shell мовчки
> Збірка проходить, HTML видно, але скрипти shell без nonce блокує CSP — сторінка не гідратується. Маршрути з nonce роби повністю динамічними.

> [!reel] 🧭 Межа в layout не рятує навігацію
> При переході між сусідніми сторінками спільний layout не перерендерюється, тож його Suspense мовчить. Межа має стояти під ним — `loading.tsx` у сегменті сторінки.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке static shell?
> *дуже часто · теорія* · `nextjs-core-12-card-01`
>
> HTML сторінки, зібраний заздалегідь (на `next build` або при ревалідації): статичний вміст, результати `'use cache'` і fallback-и меж Suspense там, де вміст залежить від запиту. Його віддають одразу, а дірки дописуються стрімом.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🧱 Ментальна модель: кешоване, статичне або за Suspense|Розділ: ментальна модель]] · [Next.js: Glossary — Static Shell](https://nextjs.org/docs/app/glossary)

> [!question]- Як увімкнути Partial Prerendering у Next.js 16?
> *часто · теорія* · `nextjs-core-12-card-02`
>
> `cacheComponents: true` у `next.config.ts`. PPR стає поведінкою за замовчуванням для всіх маршрутів App Router; `experimental.ppr` і `experimental_ppr` з 15 видалені й ламають збірку.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#⚙️ Увімкнення: cacheComponents|Розділ: увімкнення]] · [Next.js: cacheComponents](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)

> [!question]- Які три види вмісту розрізняє Cache Components?
> *часто · теорія* · `nextjs-core-12-card-03`
>
> Статичний (без I/O — у shell автоматично), закешований (`'use cache'` — результат у shell) і той, що стоїть за `<Suspense>` (читає запит чи незакешовані дані — у shell лише fallback). Request-time читання без межі над ним — помилка.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🧱 Ментальна модель: кешоване, статичне або за Suspense|Розділ: три види]] · [Next.js: Static, cached, and streaming](https://nextjs.org/docs/app/getting-started/caching#static-cached-and-streaming)

> [!question]- Що означає символ ◐ у виводі next build?
> *іноді · практика* · `nextjs-core-12-card-04`
>
> Partial Prerender: маршрут має static shell, а частина вмісту стрімиться на запит. `○` — повністю статичний, `ƒ` — блокуючий: заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🧱 Ментальна модель: кешоване, статичне або за Suspense|Розділ: вивід збірки]] · [Next.js: Caching — Prerendering](https://nextjs.org/docs/app/getting-started/caching#prerendering)

### 🟡 Middle

> [!question]- Які три виправлення пропонує помилка «uncached or runtime data during prerendering» і коли яке обрати?
> *дуже часто · практика* · `nextjs-core-12-card-05`
>
> `[cache]` — `'use cache'`, коли дані однакові для всіх і можуть трохи застаріти. `[stream]` — `<Suspense>` навколо компонента, коли дані свіжі чи персональні. `[block]` — `instant = false`, лише тимчасово при міграції: у таблиці збірки `ƒ`; заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🛠️ Три варіанти для незакешованих даних|Розділ: три варіанти]] · [Next.js: blocking-prerender-dynamic](https://nextjs.org/docs/messages/blocking-prerender-dynamic)

> [!question]- Чому next build показує помилку без файлу й рядка і як знайти джерело?
> *часто · практика* · `nextjs-core-12-card-06`
>
> Продакшн-збірка бачить лише, що маршрут чекав поза Suspense (`at body / at html`). Відкрий маршрут у `next dev` — там стек до конкретного `await` — або запусти `next build --debug-prerender`.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🧯 Помилки збірки і як їх читати|Розділ: помилки збірки]] · [Next.js: CLI](https://nextjs.org/docs/app/api-reference/cli/next)

> [!question]- Як під Cache Components обробити params у динамічному маршруті без generateStaticParams?
> *часто · код* · `nextjs-core-12-card-07`
>
> Не чекати `params` на верху сторінки чи layout: передати проміс у компонент під `<Suspense>` і зробити `await` там (або `params.then(...)` усередині межі). Тоді для невідомих значень лишається App Shell зі статичною частиною.
>
> ```tsx
> <Suspense fallback={<h1>…</h1>}><ProductInfo params={params} /></Suspense>
> ```
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🧩 Динамічні маршрути: generateStaticParams і shell|Розділ: динамічні маршрути]] · [Next.js: Maximizing the static shell](https://nextjs.org/docs/app/getting-started/caching#maximizing-the-static-shell)

> [!question]- Чому під Cache Components generateStaticParams не може повернути порожній масив?
> *іноді · теорія* · `nextjs-core-12-card-08`
>
> Next.js має відрендерити хоча б один реальний URL, щоб перевірити на збірці, що маршрут не має прихованих динамічних звертань і дає непорожній shell. Порожній масив — помилка `empty-generate-static-params`; поверни хоча б один параметр, решта URL отримає App Shell.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🧩 Динамічні маршрути: generateStaticParams і shell|Розділ: generateStaticParams]] · [Next.js: empty-generate-static-params](https://nextjs.org/docs/messages/empty-generate-static-params)

> [!question]- Як прибрати помилку про new Date() у Server Component під Cache Components?
> *часто · код* · `nextjs-core-12-card-09`
>
> Або зафіксувати значення в shell через `'use cache'` (один час для всіх до ревалідації), або рахувати на запит: `await io()` (з 16.3, `next/cache`) чи `await connection()` перед викликом, у компоненті під `<Suspense>`. `instant = false` не допоможе.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🛠️ Три варіанти для незакешованих даних|Розділ: синхронні значення]] · [Next.js: io](https://nextjs.org/docs/app/api-reference/functions/io)

### 🔴 Senior

> [!question]- Чому сторінка може мати static shell і водночас повільну клієнтську навігацію?
> *часто · теорія* · `nextjs-core-12-card-10`
>
> При навігації перерендерюється лише частина нижче спільного layout, тож межа Suspense у layout чи вище не спрацьовує. `next build` перевіряє лише перший захід; dev-валідація instant navigation ловить і навігації. Межа має стояти під спільним layout.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#⚡ Instant navigation|Розділ: Instant navigation]] · [Next.js: Instant navigation](https://nextjs.org/docs/app/guides/instant-navigation)

> [!question]- Що таке postponedState і чому його оновлюють атомарно разом із shell?
> *іноді · теорія* · `nextjs-core-12-card-11`
>
> Непрозорий серіалізований стан, з якого сервер продовжує рендер дірок (resume). Він описує саме той shell, з яким народився на збірці чи ревалідації; новий shell зі старим станом дасть неправильний динамічний вміст. CDN-інтеграції передають його в `POST` з `next-resume: 1`.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🌍 PPR на платформі: self-hosting і CDN|Розділ: платформа]] · [Next.js: PPR Platform Guide](https://nextjs.org/docs/app/guides/ppr-platform-guide)

> [!question]- Чому CSP з nonce несумісний з PPR і що робити?
> *іноді · безпека* · `nextjs-core-12-card-12`
>
> Nonce новий на кожен запит, а shell зібрано до запиту — його `<script>` без nonce, і браузер їх блокує: HTML видно, hydration немає. Збірка про це мовчить. Варіанти: маршрути з nonce — повністю динамічні (`instant = false` + `connection()` у layout: у таблиці збірки `ƒ`, HTML — лише після повного рендеру), або CSP на хешах (experimental `sri`).
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🚫 Несумісне з Cache Components|Розділ: несумісності]] · [Next.js: Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)

> [!question]- Що змінюється для невідомих slug з partialPrefetching і без нього?
> *рідко · практика* · `nextjs-core-12-card-13`
>
> Без нього кожен невідомий slug щоразу отримує App Shell з fallback-ами (так на 16.3.8). З `partialPrefetching: true` після першого візиту Next.js у фоні дорендерює shell з відомим параметром, і наступні відвідувачі бачать конкретний вміст одразу — аналог ISR / `fallback: true`.
>
> 📚 [[Next.js - 12. Partial Prerendering і Cache Components#🧩 Динамічні маршрути: generateStaticParams і shell|Розділ: App Shell]] · [Next.js: ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components)

## 🛠️ Практика

> [!task] Обчисли static shell і дірки
> level: senior · difficulty: medium · id: nextjs-core-12-task-01 · tags: ppr, suspense, static-shell
>
> Напиши `analyzeShell(root)` — модель того, що робить `next build` під Cache Components. Вузол дерева: `{ name, kind, fallback?, children? }`, де `kind`:
>
> - `'static'` — без I/O; `'cached'` — компонент з `'use cache'`;
> - `'request'` — читає запит або незакешовані дані;
> - `'suspense'` — межа `<Suspense>` з необовʼязковим `fallback`.
>
> Правила:
>
> 1. Кожен `request`-вузол знаходить **найближчу** межу `suspense` серед предків — вона стає діркою.
> 2. Немає такої межі → помилка `"<name>: uncached data outside <Suspense>"`.
> 3. Є предок `cached` (будь-де вище) → помилка `"<name>: request-time data inside 'use cache'"` замість правил 1–2.
> 4. `shell` — імена `static` і `cached` вузлів, які **не** лежать усередині дірки, плюс `"fallback:<текст>"` для кожної дірки, що сама не всередині іншої дірки (без `fallback` — нічого). Межа, яка не стала діркою, прозора; імена меж у `shell` не потрапляють.
> 5. `holes` — імена меж-дірок. Обидва масиви й `errors` — у порядку обходу дерева (спершу вузол, потім діти зліва направо).
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type Kind = 'static' | 'cached' | 'request' | 'suspense'
> type TreeNode = { name: string; kind: Kind; fallback?: string; children?: TreeNode[] }
> type ShellReport = { shell: string[]; holes: string[]; errors: string[] }
>
> function analyzeShell(root: TreeNode): ShellReport {
>   // ❌ наївно: кожна межа — дірка, усе інше — shell
>   const report: ShellReport = { shell: [], holes: [], errors: [] }
>   const walk = (node: TreeNode) => {
>     if (node.kind === 'suspense') report.holes.push(node.name)
>     else if (node.kind !== 'request') report.shell.push(node.name)
>     ;(node.children ?? []).forEach(walk)
>   }
>   walk(root)
>   return report
> }
> ```
>
> ```ts tests
> const store: TreeNode = {
>   name: 'StorePage', kind: 'static', children: [
>     { name: 'Title', kind: 'static' },
>     { name: 'Featured', kind: 'cached' },
>     { name: 'CartBoundary', kind: 'suspense', fallback: 'Рахуємо кошик…', children: [{ name: 'CartBadge', kind: 'request' }] },
>     { name: 'StockBoundary', kind: 'suspense', fallback: 'Перевіряємо наявність…', children: [{ name: 'Stock', kind: 'request' }] },
>   ],
> }
>
> test('сторінка крамниці: статичне й кешоване в shell, дві дірки з fallback-ами', () => {
>   expect(analyzeShell(store)).toEqual({
>     shell: ['StorePage', 'Title', 'Featured', 'fallback:Рахуємо кошик…', 'fallback:Перевіряємо наявність…'],
>     holes: ['CartBoundary', 'StockBoundary'],
>     errors: [],
>   })
> })
>
> test('request без межі над ним — помилка збірки', () => {
>   const page: TreeNode = { name: 'Page', kind: 'static', children: [{ name: 'Stock', kind: 'request' }] }
>   expect(analyzeShell(page).errors).toEqual(['Stock: uncached data outside <Suspense>'])
> })
>
> test('межа без request-вузлів прозора: її вміст у shell', () => {
>   const page: TreeNode = {
>     name: 'Page', kind: 'static', children: [
>       { name: 'Boundary', kind: 'suspense', fallback: '…', children: [{ name: 'Promo', kind: 'cached' }] },
>     ],
>   }
>   expect(analyzeShell(page)).toEqual({ shell: ['Page', 'Promo'], holes: [], errors: [] })
> })
>
> test('статичний сусід усередині дірки не потрапляє в shell', () => {
>   const page: TreeNode = {
>     name: 'Page', kind: 'static', children: [
>       { name: 'B', kind: 'suspense', fallback: 'Профіль…', children: [
>         { name: 'Label', kind: 'static' },
>         { name: 'User', kind: 'request' },
>       ] },
>     ],
>   }
>   expect(analyzeShell(page)).toEqual({ shell: ['Page', 'fallback:Профіль…'], holes: ['B'], errors: [] })
> })
>
> test('вкладена межа ловить request — зовнішня лишається прозорою', () => {
>   const page: TreeNode = {
>     name: 'Page', kind: 'static', children: [
>       { name: 'Outer', kind: 'suspense', fallback: 'Сторінка…', children: [
>         { name: 'Sidebar', kind: 'static' },
>         { name: 'Inner', kind: 'suspense', fallback: 'Склад…', children: [{ name: 'Stock', kind: 'request' }] },
>       ] },
>     ],
>   }
>   expect(analyzeShell(page)).toEqual({ shell: ['Page', 'Sidebar', 'fallback:Склад…'], holes: ['Inner'], errors: [] })
> })
>
> test('request усередині cached — окрема помилка, навіть під Suspense', () => {
>   const page: TreeNode = {
>     name: 'Page', kind: 'static', children: [
>       { name: 'B', kind: 'suspense', children: [
>         { name: 'Cart', kind: 'cached', children: [{ name: 'ReadCookies', kind: 'request' }] },
>       ] },
>     ],
>   }
>   expect(analyzeShell(page).errors).toEqual(["ReadCookies: request-time data inside 'use cache'"])
> })
> ```
>
> > [!hint]- Підказка 1
> > Не вирішуй долю межі, поки не обійшов її піддерево. Зроби два проходи: спершу для кожного `request` знайди найближчу межу (передавай її вниз як параметр обходу) і познач її діркою, потім збирай `shell`.
>
> > [!hint]- Підказка 2
> > У другому проході передавай прапорець «я всередині дірки». Щойно зайшов у межу-дірку, додай її fallback (якщо прапорець ще не стоїть) і далі нічого з піддерева в `shell` не клади.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function analyzeShell(root: TreeNode): ShellReport {
> >   const report: ShellReport = { shell: [], holes: [], errors: [] }
> >   const holeSet = new Set<TreeNode>()
> >
> >   const mark = (node: TreeNode, boundary: TreeNode | null, inCached: boolean) => {
> >     if (node.kind === 'request') {
> >       if (inCached) report.errors.push(`${node.name}: request-time data inside 'use cache'`)
> >       else if (!boundary) report.errors.push(`${node.name}: uncached data outside <Suspense>`)
> >       else holeSet.add(boundary)
> >     }
> >     const nextBoundary = node.kind === 'suspense' ? node : boundary
> >     const nextCached = inCached || node.kind === 'cached'
> >     for (const child of node.children ?? []) mark(child, nextBoundary, nextCached)
> >   }
> >
> >   const collect = (node: TreeNode, inHole: boolean) => {
> >     let hidden = inHole
> >     if (node.kind === 'suspense' && holeSet.has(node)) {
> >       report.holes.push(node.name)
> >       if (!inHole && node.fallback) report.shell.push(`fallback:${node.fallback}`)
> >       hidden = true
> >     } else if (!inHole && (node.kind === 'static' || node.kind === 'cached')) {
> >       report.shell.push(node.name)
> >     }
> >     for (const child of node.children ?? []) collect(child, hidden)
> >   }
> >
> >   mark(root, null, false)
> >   collect(root, false)
> >   return report
> > }
> > ```
> >
> > Перший прохід — це те, що робить React під час prerender: suspend «спливає» до найближчої межі, і саме вона показує fallback. Тому зовнішня межа над внутрішньою лишається прозорою, а статичний сусід у дірці чекає разом з нею. Звідси практичне правило: межа має обгортати лише той компонент, що чекає.

> [!task] Підкажи заміну route segment config
> level: middle · difficulty: easy · id: nextjs-core-12-task-02 · tags: migration, cache-components, config
>
> Напиши `migrateSegmentConfig(exports)` — помічник міграції. На вході обʼєкт експортів сегмента (`{ dynamic: 'force-dynamic', revalidate: 3600, … }`), на виході — масив порад `{ key, action, use? }` у порядку ключів входу:
>
> - `dynamic`: `'force-dynamic'` або `'auto'` → `{ action: 'remove' }`; `'force-static'` або `'error'` → `{ action: 'replace', use: "'use cache' + cacheLife('max')" }`.
> - `revalidate`: `false` → `replace` з `use: "cacheLife('max')"`; `0` → `remove`; число `n > 0` → `replace` з `use: "cacheLife('<профіль>')"`, де профіль — **найбільший** вбудований, чий `revalidate` не перевищує `n` (щоб дані не стали застарілішими, ніж були): `seconds` 1 с, `minutes` 60 с, `hours` 3600 с, `days` 86400 с, `weeks` 604800 с, `max` 2592000 с. Для `n < 1` — `seconds`.
> - `fetchCache`, `runtime`, `experimental_ppr` (будь-яке значення) → `remove`.
> - `dynamicParams`: `false` → `replace` з `use: 'notFound()'`; `true` → `remove`.
> - Інші ключі (`maxDuration`, `preferredRegion`, `instant`…) сумісні — порад для них немає.
>
> ```js starter
> /**
>  * @param {Record<string, unknown>} exports
>  * @returns {{ key: string, action: 'remove' | 'replace', use?: string }[]}
>  */
> function migrateSegmentConfig(exports) {
>   // ❌ «просто видалити все» — дані, що були в кеші, стануть некешованими
>   return Object.keys(exports).map((key) => ({ key, action: 'remove' }))
> }
> ```
>
> ```js tests
> test('force-dynamic просто видаляється', () => {
>   expect(migrateSegmentConfig({ dynamic: 'force-dynamic' })).toEqual([{ key: 'dynamic', action: 'remove' }])
> })
>
> test('force-static стає use cache з профілем max', () => {
>   expect(migrateSegmentConfig({ dynamic: 'force-static' })).toEqual([
>     { key: 'dynamic', action: 'replace', use: "'use cache' + cacheLife('max')" },
>   ])
> })
>
> test('revalidate підбирає найбільший профіль, що не довший за старий', () => {
>   const pick = (n) => migrateSegmentConfig({ revalidate: n })[0].use
>   expect(pick(3600)).toBe("cacheLife('hours')")
>   expect(pick(50000)).toBe("cacheLife('hours')")
>   expect(pick(600)).toBe("cacheLife('minutes')")
>   expect(pick(86400 * 365)).toBe("cacheLife('max')")
>   expect(pick(false)).toBe("cacheLife('max')")
> })
>
> test('revalidate = 0 означає «завжди на запит» — видалити', () => {
>   expect(migrateSegmentConfig({ revalidate: 0 })).toEqual([{ key: 'revalidate', action: 'remove' }])
> })
>
> test('dynamicParams = false замінюється на notFound()', () => {
>   expect(migrateSegmentConfig({ dynamicParams: false, runtime: 'edge' })).toEqual([
>     { key: 'dynamicParams', action: 'replace', use: 'notFound()' },
>     { key: 'runtime', action: 'remove' },
>   ])
> })
>
> test('сумісні ключі не дають порад, порядок — як у вході', () => {
>   expect(migrateSegmentConfig({ maxDuration: 30, fetchCache: 'force-cache', instant: false, experimental_ppr: true })).toEqual([
>     { key: 'fetchCache', action: 'remove' },
>     { key: 'experimental_ppr', action: 'remove' },
>   ])
> })
> ```
>
> > [!hint]- Підказка 1
> > Пройди `Object.entries(exports)` і для кожного ключа поверни пораду або `null`, а наприкінці відфільтруй `null`.
>
> > [!hint]- Підказка 2
> > Для `revalidate` тримай профілі масивом від найкоротшого до найдовшого й бери останній, у якого `seconds <= n`. «Найближчий за модулем» для 50000 с дав би `days` — дані застаріватимуть удвічі довше, ніж раніше.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const PROFILES = [
> >   ['seconds', 1],
> >   ['minutes', 60],
> >   ['hours', 3600],
> >   ['days', 86400],
> >   ['weeks', 604800],
> >   ['max', 2592000],
> > ]
> >
> > function profileFor(n) {
> >   let name = 'seconds'
> >   for (const [profile, seconds] of PROFILES) if (seconds <= n) name = profile
> >   return name
> > }
> >
> > function adviceFor(key, value) {
> >   switch (key) {
> >     case 'dynamic':
> >       return value === 'force-static' || value === 'error'
> >         ? { key, action: 'replace', use: "'use cache' + cacheLife('max')" }
> >         : { key, action: 'remove' }
> >     case 'revalidate':
> >       if (value === false) return { key, action: 'replace', use: "cacheLife('max')" }
> >       if (value === 0) return { key, action: 'remove' }
> >       return { key, action: 'replace', use: `cacheLife('${profileFor(value)}')` }
> >     case 'dynamicParams':
> >       return value === false ? { key, action: 'replace', use: 'notFound()' } : { key, action: 'remove' }
> >     case 'fetchCache':
> >     case 'runtime':
> >     case 'experimental_ppr':
> >       return { key, action: 'remove' }
> >     default:
> >       return null
> >   }
> > }
> >
> > function migrateSegmentConfig(exports) {
> >   return Object.entries(exports)
> >     .map(([key, value]) => adviceFor(key, value))
> >     .filter(Boolean)
> > }
> > ```
> >
> > Видалення без заміни — найчастіша помилка міграції: `revalidate = 3600` зникає, і сторінка, що роками жила з годинним кешем, тепер ходить у базу на кожен запит (або падає на збірці «uncached data»). Якщо жоден вбудований профіль не підходить, документація радить власний профіль у `cacheLife` (тема 15 основного посібника).

> [!task] Перевір проєкт на несумісності з Cache Components
> level: senior · difficulty: medium · id: nextjs-core-12-task-03 · tags: cache-components, config, csp, validation
>
> Напиши `validateProject({ config, routes })` — лінтер для CI, що ловить усе, на чому зламається (або мовчки зламається) проєкт з Cache Components. Поверни масив `{ route, code, level }` у порядку перевірок:
>
> 1. `config.experimental?.ppr !== undefined` → `{ route: 'next.config', code: 'ppr-flag-removed', level: 'error' }` — **завжди**, навіть без `cacheComponents`.
> 2. Якщо `config.cacheComponents !== true` — більше нічого не перевіряй.
> 3. Для кожного маршруту (у порядку масиву), для кожного ключа `route.segmentConfig` (у порядку ключів) з набору `dynamic`, `revalidate`, `fetchCache`, `dynamicParams`, `runtime`, `experimental_ppr` → `code: 'segment-config:<ключ>'`, `level: 'error'`.
> 4. `route.staticParams` — масив довжини 0 → `code: 'empty-generate-static-params'`, `level: 'error'` (`undefined` — маршрут без `generateStaticParams`, це нормально).
> 5. `config.cspNonce === true` і маршрут **не** `fullyDynamic` → `code: 'nonce-without-shell-nonce'`, `level: 'warning'`: збірка пройде, але скрипти shell без nonce.
>
> ```ts starter
> type Issue = { route: string; code: string; level: 'error' | 'warning' }
> type Route = {
>   path: string
>   segmentConfig?: Record<string, unknown>
>   staticParams?: Record<string, string>[]
>   fullyDynamic?: boolean
> }
> type Project = {
>   config: { cacheComponents?: boolean; cspNonce?: boolean; experimental?: { ppr?: unknown } }
>   routes: Route[]
> }
>
> function validateProject(project: Project): Issue[] {
>   const issues: Issue[] = []
>   // ❌ ловить лише edge — «бо в документації написано про edge»
>   for (const route of project.routes) {
>     if (route.segmentConfig?.runtime === 'edge') {
>       issues.push({ route: route.path, code: 'segment-config:runtime', level: 'error' })
>     }
>   }
>   return issues
> }
> ```
>
> ```ts tests
> const cc = { cacheComponents: true }
>
> test('будь-який runtime, навіть nodejs, — помилка', () => {
>   const issues = validateProject({ config: cc, routes: [{ path: '/a', segmentConfig: { runtime: 'nodejs' } }] })
>   expect(issues).toEqual([{ route: '/a', code: 'segment-config:runtime', level: 'error' }])
> })
>
> test('сумісні ключі (maxDuration, instant) не дають помилок', () => {
>   const issues = validateProject({ config: cc, routes: [{ path: '/a', segmentConfig: { maxDuration: 30, instant: false } }] })
>   expect(issues).toEqual([])
> })
>
> test('кілька ключів і порожній generateStaticParams — у порядку перевірок', () => {
>   const issues = validateProject({
>     config: cc,
>     routes: [{ path: '/blog/[slug]', segmentConfig: { revalidate: 60, dynamicParams: false }, staticParams: [] }],
>   })
>   expect(issues.map((i) => i.code)).toEqual(['segment-config:revalidate', 'segment-config:dynamicParams', 'empty-generate-static-params'])
> })
>
> test('без cacheComponents сегментні конфіги валідні, але experimental.ppr — ні', () => {
>   const issues = validateProject({
>     config: { experimental: { ppr: 'incremental' } },
>     routes: [{ path: '/a', segmentConfig: { dynamic: 'force-dynamic' }, staticParams: [] }],
>   })
>   expect(issues).toEqual([{ route: 'next.config', code: 'ppr-flag-removed', level: 'error' }])
> })
>
> test('CSP з nonce: попередження лише для маршрутів із shell', () => {
>   const issues = validateProject({
>     config: { cacheComponents: true, cspNonce: true },
>     routes: [{ path: '/store' }, { path: '/secure', fullyDynamic: true }],
>   })
>   expect(issues).toEqual([{ route: '/store', code: 'nonce-without-shell-nonce', level: 'warning' }])
> })
>
> test('маршрут без generateStaticParams — не помилка', () => {
>   expect(validateProject({ config: cc, routes: [{ path: '/shop/[slug]' }] })).toEqual([])
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай заборонені ключі в `Set` і проходь `Object.keys(route.segmentConfig ?? {})` — так порядок помилок збігається з порядком у файлі.
>
> > [!hint]- Підказка 2
> > `staticParams?.length === 0` хибне і для `undefined`, і для непорожнього масиву — рівно те, що треба. Перевірку `experimental.ppr` зроби до раннього виходу за `cacheComponents`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > const INCOMPATIBLE = new Set(['dynamic', 'revalidate', 'fetchCache', 'dynamicParams', 'runtime', 'experimental_ppr'])
> >
> > function validateProject({ config, routes }: Project): Issue[] {
> >   const issues: Issue[] = []
> >   if (config.experimental?.ppr !== undefined) {
> >     issues.push({ route: 'next.config', code: 'ppr-flag-removed', level: 'error' })
> >   }
> >   if (config.cacheComponents !== true) return issues
> >
> >   for (const route of routes) {
> >     for (const key of Object.keys(route.segmentConfig ?? {})) {
> >       if (INCOMPATIBLE.has(key)) issues.push({ route: route.path, code: `segment-config:${key}`, level: 'error' })
> >     }
> >     if (route.staticParams?.length === 0) {
> >       issues.push({ route: route.path, code: 'empty-generate-static-params', level: 'error' })
> >     }
> >     if (config.cspNonce === true && !route.fullyDynamic) {
> >       issues.push({ route: route.path, code: 'nonce-without-shell-nonce', level: 'warning' })
> >     }
> >   }
> >   return issues
> > }
> > ```
> >
> > Помилки 1–4 Next.js покаже й сам, але аж на `next build`, і по одній: компіляція зупиняється на першому файлі. Лінтер у CI дає повний список одразу. А п'ятий пункт збірка не ловить ніколи — його видно лише в консолі браузера, тому саме він найцінніший у такому скрипті.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Caching: Prerendering](https://nextjs.org/docs/app/getting-started/caching#prerendering) — static, cached, streaming; maximizing the static shell; App Shell.
- 🟢 [Next.js — cacheComponents](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) — прапорець, PPR за замовчуванням, Activity.
- 🟡 [Next.js — Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) — кожен сегментний конфіг «було → стало», поступова міграція, `generateStaticParams`.
- 🟡 [Next.js — blocking-prerender-dynamic](https://nextjs.org/docs/messages/blocking-prerender-dynamic) — сторінка помилки з усіма виправленнями.
- 🔴 [Next.js — Instant navigation](https://nextjs.org/docs/app/guides/instant-navigation) — валідація навігацій, Navigation Inspector, `@next/playwright` `instant()`.
- 🔴 [Next.js — instant](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) — довідник segment config і рівнів валідації.
- 🟡 [Next.js — ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components) — App Shell для невідомих params і `partialPrefetching`.
- 🔴 [Next.js — PPR Platform Guide](https://nextjs.org/docs/app/guides/ppr-platform-guide) — shell + `postponedState`, resume-протокол, CDN.
- 🟡 [Next.js — Rendering Philosophy](https://nextjs.org/docs/app/guides/rendering-philosophy) — static і dynamic як спектр, ціна для інфраструктури.
- 🛠️ [Next.js — Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy) — чому nonce несумісний з PPR, альтернатива на SRI.

> [!important] Підсумок
> - PPR = static shell зі збірки + динамічні дірки, які сервер дописує в **ту саму** відповідь. У Next.js 16 його вмикає `cacheComponents: true`; `experimental.ppr` і `experimental_ppr` видалені.
> - Кожен компонент або статичний, або закешований (`'use cache'`), або за `<Suspense>`. Request-time чи незакешоване читання без межі над ним — помилка збірки з трьома виправленнями: `[cache]`, `[stream]`, `[block]`.
> - Опускай чекання вниз: сторінки й layouts не `async`, `params` і `cookies()` читаються в листках під Suspense. Що нижче межа, то більше shell.
> - Для динамічних маршрутів `generateStaticParams` дає конкретні shell-и, решта URL отримує App Shell; порожній масив і `dynamicParams` під Cache Components — помилки.
> - Instant navigation (experimental) перевіряє в dev ще й клієнтські переходи: межа має стояти під спільним layout. Інструменти — `instant`, Navigation Inspector, `@next/playwright` `instant()`.
> - Несумісні: сегментні `dynamic`/`revalidate`/`fetchCache`/`dynamicParams`/`runtime`, а CSP з nonce ламає hydration shell мовчки. Платформі для PPR потрібен стрімінг без буферизації.

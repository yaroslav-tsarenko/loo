---
title: Server і Client Components
id: nextjs-core-07
slug: 07-server-and-client-components
order: 7
level: junior
skill: rendering
icon: px:microscope
tags: [nextjs, rsc, server-components, client-components, use-client, bundle]
prerequisites: []
estimatedMinutes: 45
nextVersion: 16.3.8
---

# Server і Client Components

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, навіщо існують React Server Components: менший бандл, дані біля джерела, секрети на сервері;
> - для будь-якого компонента сказати, де він виконується при першому заході й при навігації на клієнті;
> - пояснити `'use client'` як межу в **графі модулів** і передбачити, які файли потраплять у клієнтський бандл;
> - розрізнити props, що проходять через межу (серіалізовані значення, JSX, Server Functions), і ті, що ламають збірку;
> - вкласти Server Component у Client Component через `children`, підключити контекст і сторонню бібліотеку без директиви;
> - не допустити витоку секретів: `server-only`, змінні середовища, DTO.

## 🤔 Передбач

> [!quiz] Де виконається кожен компонент?
> level: junior · type: output · id: nextjs-core-07-quiz-01
>
> Користувач уперше відкриває сторінку (прямий захід за URL). Ось два файли:
>
> ```tsx
> // app/page.tsx
> import Hello from './hello'
>
> export default function Page() {
>   console.log('Page rendered')
>   return <Hello />
> }
> ```
>
> ```tsx
> // app/hello.tsx
> 'use client'
>
> export default function Hello() {
>   console.log('Hello rendered')
>   return <p>Привіт!</p>
> }
> ```
>
> - [x] `Page` — лише на сервері; `Hello` — і на сервері, і в браузері
> - [ ] `Page` — на сервері; `Hello` — лише в браузері
> - [ ] Обидва — лише на сервері, браузер отримує готовий HTML
> - [ ] Обидва — і на сервері, і в браузері: це ж звичайний React
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `Page` — Server Component, його код не їде в браузер. `Hello` — Client Component, але «client» не означає «тільки клієнт»: для першого HTML Next.js рендерить його на сервері, а браузер виконує той самий код ще раз під час hydration.

## 🧒 Простими словами

Уяви ресторан. Кухня — це сервер: там холодильник з продуктами (база даних), сейф з рецептами (секрети) і важке обладнання (великі бібліотеки). Більшість страв кухня готує сама й виносить тобі **готову тарілку** — це Server Component: ти бачиш результат, але не отримуєш ні рецепта, ні каструль. Деякі страви ти доробляєш сам за столом, як фондю. Для них кухня виносить **набір** — інгредієнти й інструкцію. Це Client Component: його код приїжджає до тебе, бо інакше ти нічого з ним не зробиш. Офіціант, що носить і тарілки, і набори, — це RSC payload. А сейф з рецептами ніколи не покидає кухню — якщо, звісно, ніхто не поклав рецепт на тарілку.

## 🔬 Як це працює насправді

### 🧭 Навіщо React Server Components

До RSC кожен React-компонент був тим, що тепер називають Client Component: навіть відрендерений на сервері, **той самий код** їхав у браузер для hydration, а дані приходили окремим кроком (`getServerSideProps`, API-маршрут, `fetch` у `useEffect`). Сторінка зі статтею в markdown тягнула в бандл парсер markdown, хоча користувач нічого не парсив.

React Server Components ділять дерево на дві частини: **Server Components** виконуються тільки на сервері, **Client Components** — інтерактивні частини, чий код браузер завантажує. Що це дає:

- **Менший клієнтський бандл.** Код Server Component і все, що він імпортує, лишається на сервері.
- **Дані біля джерела.** Server Component читає базу, файли чи внутрішній сервіс **під час власного рендера**, без API-маршруту.
- **Секрети без витоку.** API-ключі й токени живуть у серверному коді (якщо не передати їх явно — про це нижче).
- **Streaming.** Сервер віддає UI частинами, поки повільні дані ще вантажаться (тема курсу 11).

```tsx
// app/ui/cart.tsx — async Server Component: читає дані напряму
import { getCart } from '@/lib/db'

export async function Cart() {
  const items = await getCart()
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title} — {item.price} ₴
        </li>
      ))}
      <li>Разом: {total} ₴</li>
    </ul>
  )
}
```

Компонент `async` і просто чекає дані: ні `useEffect`, ні стану завантаження. У клієнтських чанках після `next build` немає ні коду `Cart`, ні `getCart`.

> [!note] Чому в прикладах дані в памʼяті
> Приклади курсу зібрані з `cacheComponents: true`. Справжній запит до БД у `getCart()` зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують (`'use cache'`, тема курсу 15) або обгортають у `<Suspense>` (теми 11–12). Тут ми це опускаємо.

### 🗺️ Що де виконується

Назви підказують чистий поділ, але рендер відбувається в обох місцях:

| | На сервері | У браузері |
|---|---|---|
| **Server Component** | так | ні |
| **Client Component** | так | так |

«Client» означає: компонент **також** виконується в браузері. «Server-rendered» описує, **як отримано HTML**; «Server Component» — **де живе код**.

**Перший захід** (відкрили URL, оновили сторінку): сервер рендерить Server Components у **RSC payload** — серіалізований опис дерева з результатом Server Components, «місцями» для Client Components (з посиланнями на їхні JS-файли) і props для них. З payload і коду Client Components сервер будує **HTML**, браузер одразу його показує, потім завантажує JS Client Components, і React робить **hydration** — чіпляє обробники подій до готового DOM.

> [!diagram] Перший захід: що роблять сервер і браузер
> ```yaml
> layout: flow
> nodes:
>   - { id: req, label: "браузер", text: "GET /shop", tone: gray, icon: "px:monitor" }
>   - { id: rsc, label: "сервер · RSC", text: "Server Components → RSC payload", note: "код Cart і Page лишається тут", tone: blue, icon: "px:database" }
>   - { id: html, label: "сервер · HTML", text: "payload + Client Components → HTML", note: "Modal теж рендериться тут", tone: violet }
>   - { id: show, label: "браузер", text: "HTML на екрані", note: "видно, але ще не клікається", tone: yellow }
>   - { id: hyd, label: "браузер · hydration", text: "JS Client Components", note: "onClick запрацював", tone: green, icon: "px:bolt" }
> edges:
>   - { from: req, to: rsc, label: "запит" }
>   - { from: rsc, to: html, label: "RSC payload" }
>   - { from: html, to: show, label: "HTML + payload" }
>   - { from: show, to: hyd, label: "JS-чанки" }
> steps:
>   - { focus: req, note: "Користувач відкриває /shop напряму. Сервер має віддати повну сторінку." }
>   - { move: { from: req, to: rsc, value: "GET /shop" }, note: "Next.js рендерить дерево Server Components. Page і Cart виконуються тут і читають дані — у браузер поїде лише їхній результат." }
>   - { move: { from: rsc, to: html, value: "RSC payload" }, note: "З payload і коду Client Components (наприклад, Modal) сервер будує HTML. Client Component теж виконався на сервері!" }
>   - { move: { from: html, to: show, value: "HTML" }, note: "Браузер малює HTML одразу. Кнопки видно, але обробників подій ще немає." }
>   - { move: { from: show, to: hyd, value: "modal.js" }, note: "Браузер завантажує JS лише Client Components, і React робить hydration. Коду Server Components у цих чанках немає взагалі." }
> ```
> Дивись, який код їде в браузер: лише Client Components. Server Components приходять як готовий результат усередині payload.

**Навігація на клієнті** (клік по `<Link>`): браузер отримує RSC payload нової сторінки (або бере з prefetch-кешу), а Client Components рендеряться **лише в браузері**, без HTML. Server Components нової сторінки рендеряться на сервері, щоб отримати payload. Деталі — у темі курсу 09.

Два уточнення. «Сервер» — це й `next build`: статичну сторінку Next.js рендерить під час збірки, тож логи з 🤔 Передбач зʼявляться у виводі збірки (статичне й динамічне — тема курсу 10). А в `next dev` React дублює логи Server Components у консоль браузера з сірою позначкою (на 16.3.8 — `Prerender`) — це копія, код у браузері не виконувався.

> [!quiz] Перевір себе: де виконується компонент під час навігації?
> level: junior · type: output · id: nextjs-core-07-quiz-02
>
> Продакшн-збірка. Користувач на `/` клікає `<Link href="/about">`. Сторінка `app/about/page.tsx` (без директиви) рендерить `<Hello />` з `'use client'`. Де виконається `Hello` під час цієї навігації?
>
> - [x] Лише в браузері: прийде RSC payload, і `Hello` відрендериться на клієнті без серверного HTML
> - [ ] І на сервері, і в браузері — так само, як при першому заході
> - [ ] Лише на сервері: браузер отримає готовий HTML сторінки `/about`
> - [ ] Ніде: `Hello` уже був на `/`, React візьме результат звідти
>
> **Пояснення:** у браузері вже запущений React, тож HTML не потрібен: приходить RSC payload `/about` (або береться з prefetch-кешу), і `Hello rendered` зʼявляється в консолі браузера. `Hello` на `/` — інший екземпляр на іншій сторінці.

### 🏠 За замовчуванням усе серверне

У App Router кожен файл — `page.tsx`, `layout.tsx`, будь-який компонент — є **Server Component**, доки ти явно не скажеш інакше. Він може бути `async`, імпортувати серверні модулі (`node:fs`, драйвер БД, SDK із секретом) і рендерити Client Components.

Але стану й реакції на дії користувача в нього немає: без `useState`, `useEffect`, `useContext`, `onClick`/`onChange` і `window`/`localStorage`. Хук у серверному файлі зупиняє компілятор, `onClick` — рендер під час збірки (тексти помилок — у [[#🧯 Типові помилки і як їх читати]]).

Не вся інтерактивність потребує JS: `<details>`, `<video controls>` і `<form action={serverFunction}>` працюють у Server Component без клієнтського коду (приклад — у [[#🧳 Що можна передати через межу]]).

### 🚪 Директива use client — межа в графі модулів

Client Component створюють директивою `'use client'` на **самому початку файлу**, перед імпортами (коментарі вище можна; лапки одинарні чи подвійні, не зворотні):

```tsx
// app/ui/search.tsx
'use client'

import { useState } from 'react'

export default function Search() {
  const [query, setQuery] = useState('')
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Пошук…"
    />
  )
}
```

Головне: `'use client'` позначає не «цей компонент», а **межу між серверним і клієнтським графами модулів** (файли — вузли, імпорти — ребра). Коли серверний модуль імпортує файл з `'use client'`, **цей файл, усе, що він імпортує, і компоненти, які він рендерить напряму, потрапляють у клієнтський бандл** — навіть без власної директиви. Наслідки:

1. **Директиву ставлять лише на вході** в клієнтське піддерево; в імпортованому з клієнта файлі вона нічого не змінює.
2. **Компонент без директиви «агностичний»:** середовище визначає **місце імпорту**. Один `format.ts` може бути в обох графах — Next.js скомпілює його окремо для кожного.
3. **Межа не поширюється на `children`:** переданий як prop Server Component лишається серверним, бо клієнтський файл його **не імпортує**.

> [!diagram] Граф модулів: де проходить межа
> ```yaml
> layout: tree
> nodes:
>   - { id: page, label: "app/shop/page.tsx", text: "Server", tone: blue, icon: "px:file" }
>   - { id: cart, label: "app/ui/cart.tsx", text: "Server", parent: page, tone: blue }
>   - { id: db, label: "lib/db.ts", text: "Server", note: "import 'server-only'", parent: cart, tone: blue, icon: "px:database" }
>   - { id: fmt1, label: "lib/format.ts", text: "Server", note: "копія для сервера", parent: page, tone: blue }
>   - { id: modal, label: "app/ui/modal.tsx", code: "'use client'", note: "межа: тут починається клієнт", parent: page, tone: orange, icon: "px:door" }
>   - { id: fmt2, label: "lib/format.ts", text: "Client", note: "бо імпортовано з modal.tsx", parent: modal, tone: orange }
>   - { id: btn, label: "app/ui/button.tsx", text: "Client", note: "без директиви, але в клієнтському графі", parent: modal, tone: orange }
> steps:
>   - { show: page, note: "Сторінка — Server Component за замовчуванням. Звідси Next.js починає обходити імпорти." }
>   - { show: [cart, db, fmt1], note: "Усе, що імпортує серверний код, теж серверне: Cart, lib/db.ts і lib/format.ts. Їхній код не піде в браузер." }
>   - { show: modal, line: "modal:1", note: "modal.tsx починається з 'use client'. Імпорт цього файлу — межа: його код і все під ним поїде в браузер." }
>   - { show: [fmt2, btn], note: "button.tsx і lib/format.ts не мають директиви, але імпортовані з клієнтського модуля — отже, вони в клієнтському бандлі." }
>   - { focus: [fmt1, fmt2], note: "Той самий lib/format.ts — у двох графах. Середовище визначає місце імпорту, а не сам файл." }
> ```
> Помаранчеве завантажить браузер. Синє лишається на сервері, хоч би скільки його було.

> [!quiz] Перевір себе: що потрапить у клієнтський бандл?
> level: junior · type: output · id: nextjs-core-07-quiz-03
>
> ```text
> app/page.tsx       без директиви   імпортує: ./ui/cart, ./ui/modal, @/lib/format
> app/ui/cart.tsx    без директиви   імпортує: @/lib/db
> app/ui/modal.tsx   'use client'    імпортує: @/lib/format, ./button
> app/ui/button.tsx  без директиви
> lib/format.ts      без директиви
> lib/db.ts          import 'server-only'
> ```
>
> - [x] `modal.tsx`, `button.tsx`, `format.ts`
> - [ ] Тільки `modal.tsx` — директива є лише в ньому
> - [ ] `modal.tsx` і `button.tsx` — `format.ts` серверний, бо його імпортує `page.tsx`
> - [ ] Усе, крім `lib/db.ts`
>
> **Пояснення:** межа — `modal.tsx`, тож його імпорти (`button.tsx`, `format.ts`) клієнтські. Імпорт `format.ts` із `page.tsx` не скасовує клієнтську копію: модуль живе в обох графах. `cart.tsx` і `db.ts` досяжні лише із сервера.

> [!quiz] Перевір себе: обери правдиві твердження про `'use client'`
> level: junior · type: multi · id: nextjs-core-07-quiz-04
> - [x] Директиву ставлять до імпортів; коментарі над нею дозволені
> - [x] Модулі, які імпортує файл з `'use client'`, теж потрапляють у клієнтський бандл
> - [ ] Кожен файл з клієнтськими компонентами мусить мати власну `'use client'`
> - [ ] Компонент з `'use client'` рендериться тільки в браузері
> - [x] Server Component, переданий у клієнтський як `children`, лишається серверним
> - [ ] `'use client'` вимикає серверний рендер HTML для цього файлу
>
> **Пояснення:** директива позначає вхід у клієнтський граф, а не «тільки браузер»: Client Component теж рендериться на сервері. Імпорти клієнтського модуля і так клієнтські, а `children` він не імпортує.

### 📦 Що потрапляє в клієнтський бандл

Клієнтський бандл — JS, який завантажить браузер; Next.js ділить його на чанки за графом модулів. Туди йдуть модулі з `'use client'`, **усе транзитивно імпортоване** з них (утиліти, бібліотеки, JSON) і значення `NEXT_PUBLIC_*`, які Next.js вшиває під час `next build`. Не йдуть: код Server Components і все, що імпортують **лише** вони, значення непублічних змінних і код Server Functions (клієнт отримує тільки посилання).

Тому **став `'use client'` якомога нижче.** Layout з логотипом і полем пошуку не має ставати клієнтським цілком — досить `Search`:

```tsx
// app/shop/layout.tsx — Server Component за замовчуванням
import Logo from '../ui/logo' // Server Component
import Search from '../ui/search' // Client Component

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

З `'use client'` на layout клієнтським став би й `Logo`, а layout утратив би доступ до даних (сторінки в `children` лишилися б серверними).

> [!quiz] Перевір себе: склади, що відбувається при першому заході й навігації
> level: junior · type: order · id: nextjs-core-07-quiz-05
>
> ```order
> Сервер рендерить Server Components у RSC payload
> Сервер будує HTML з payload і коду Client Components
> Браузер показує HTML — ще без обробників подій
> Браузер завантажує JS Client Components, React робить hydration
> Клік по Link: браузер отримує (або бере з prefetch-кешу) RSC payload нової сторінки
> Client Components нової сторінки рендеряться в браузері без HTML
> Браузер завантажує код Server Components, і React робить для них hydration ✗
> ```
>
> **Пояснення:** при першому заході сервер спершу рендерить серверне дерево, потім будує HTML, і лише потім браузер оживляє клієнтські частини. При навігації HTML уже не потрібен — вистачає payload. Код Server Components у браузер не потрапляє ніколи, тож hydration для них не буває.

### 🧳 Що можна передати через межу

Код перетинає межу через **імпорти**, дані — через **props**, які React серіалізує в RSC payload. Спрощено (повний список — у документації React):

| Можна | Не можна |
|---|---|
| `string`, `number`, `bigint`, `boolean`, `undefined`, `null` | звичайні функції (обробники, колбеки, форматери) |
| `symbol`, зареєстрований через `Symbol.for()` | `Symbol('локальний')` |
| масиви, `Map`, `Set`, `TypedArray`, `ArrayBuffer` | класи та їхні екземпляри (крім вбудованих) |
| `Date`, прості обʼєкти з серіалізованими полями | обʼєкти з `null`-прототипом |
| JSX: елементи Server і Client Components | |
| `Promise` (читають через `use`, тема курсу 11) | |
| Server Functions (`'use server'`) — як посилання | |

```tsx
// app/props/page.tsx — усе це серіалізується
import { Inspect } from './inspect'

export default function PropsPage() {
  return (
    <Inspect
      count={42}
      big={BigInt(10)}
      createdAt={new Date('2026-01-01T00:00:00Z')}
      tags={new Set(['next', 'react'])}
      prices={new Map([['p1', 2400]])}
      nothing={undefined}
      header={<h2>JSX теж можна</h2>}
    />
  )
}
```

`createdAt` на клієнті — справжній `Date`. А функція чи екземпляр класу зупиняють збірку (тексти — у [[#🧯 Типові помилки і як їх читати]]):

```tsx
<PriceTag amount={2400} format={(n: number) => `${n} ₴`} /> // ❌ звичайна функція
<Price value={new Money(2400, 'UAH')} /> // ❌ екземпляр класу
```

Функція — це код плюс замикання на серверні змінні, і переслати його в браузер неможливо. Виняток — **Server Function**: з `'use server'` вона перетинає межу як **посилання**, клієнт її викликає, а виконується вона на сервері:

```tsx
// app/like/page.tsx
import { LikeButton } from './like-button'

export default function LikePage() {
  async function like() {
    'use server'
    console.log('like() виконалась на сервері')
  }

  return (
    <>
      <LikeButton likeAction={like} />
      {/* форма без жодного клієнтського JS — action теж приймає Server Function */}
      <form action={like}>
        <button type="submit">Подобається (форма)</button>
      </form>
    </>
  )
}
```

```tsx
// app/like/like-button.tsx
'use client'

import { useTransition } from 'react'

export function LikeButton({ likeAction }: { likeAction: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button disabled={isPending} onClick={() => startTransition(() => likeAction())}>
      Подобається
    </button>
  )
}
```

За типом Server Function не відрізнити від звичайної функції, тож TS-плагін Next.js у редакторі дозволяє функціональний prop клієнтського компонента, лише якщо він зветься `action` або `…Action`. Server Functions докладно — тема курсу 21.

> [!quiz] Перевір себе: який prop зламає збірку?
> level: junior · id: nextjs-core-07-quiz-06
>
> Server Component рендерить `<ProductCard … />` з `'use client'`. Який prop спричинить помилку?
>
> - [ ] `createdAt={new Date()}`
> - [ ] `tags={new Set(['sale', 'new'])}`
> - [x] `onSelect={(id) => console.log(id)}`
> - [ ] `header={<h2>Кошик</h2>}`
>
> **Пояснення:** `Date`, `Set` і JSX серіалізуються. Функцію — ні: `next build` впаде з `Event handlers cannot be passed to Client Component props`. Обробник оголошують **усередині** клієнтського компонента, а для дії на сервері передають Server Function.

### 🧩 Композиція: серверне всередині клієнтського

Типова задача: модалка відкривається й закривається (клієнтський стан), а всередині — кошик з даними з БД (серверний). Інстинкт підказує імпортувати `Cart` прямо в модалку:

```tsx
// app/ui/cart-modal.tsx — ❌ імпорт серверного компонента в клієнтський
'use client'

import { useState } from 'react'
import { Cart } from '@/app/ui/cart'

export function CartModal() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(!open)}>Кошик</button>
      {open && <Cart />}
    </div>
  )
}
```

Імпорт затягує `Cart` у клієнтський граф, а за ним і `lib/db.ts`. З `import 'server-only'` у `db.ts` збірка зупиниться з ланцюжком імпортів; без нього код доступу до БД поїхав би в браузер.

Правильно — **передати серверний компонент як `children`** (або іншим prop з JSX): модалка лишає «дірку», серверна сторінка її заповнює:

```tsx
// app/ui/modal.tsx
'use client'

import { useState, type ReactNode } from 'react'

export function Modal({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  if (!open) return <button onClick={() => setOpen(true)}>Відкрити кошик</button>

  return (
    <div role="dialog">
      <header>
        {title}
        <button onClick={() => setOpen(false)}>Закрити</button>
      </header>
      {children}
    </div>
  )
}
```

```tsx
// app/shop/page.tsx — Page і Cart серверні, Modal клієнтський
import { Cart } from '../ui/cart'
import { Modal } from '../ui/modal'

export default function ShopPage() {
  return (
    <Modal title={<h2>Твій кошик</h2>}>
      <Cart />
    </Modal>
  )
}
```

React розрізняє дві ролі. **Власник** (owner) — компонент, у чиєму коді написано JSX дитини: `ShopPage` — власник і `Modal`, і `Cart`. **Батько** (parent) — той, хто містить дитину в дереві: `Modal` — батько `Cart`. Власник `Cart` серверний, тож `Cart` рендериться на сервері, а `Modal` отримує лише **готовий вивід**. У бандлі з цієї пари — тільки `Modal`.

> [!diagram] Імпорт проти children
> ```yaml
> layout: compare
> columns: { bad: "❌ Імпорт у клієнтський файл", good: "✅ Передача як children" }
> nodes:
>   - { id: b1, col: bad, label: "cart-modal.tsx", code: "'use client'\nimport { Cart } from './cart'", tone: orange }
>   - { id: b2, col: bad, label: "Cart", text: "став клієнтським", note: "його код їде в браузер", tone: orange }
>   - { id: b3, col: bad, label: "lib/db.ts", text: "у клієнтському графі", note: "server-only → помилка збірки", tone: red, icon: "px:warning" }
>   - { id: g1, col: good, label: "page.tsx (Server)", code: "<Modal>\n  <Cart />\n</Modal>", tone: blue }
>   - { id: g2, col: good, label: "Cart", text: "рендериться на сервері", note: "власник — page.tsx", tone: blue }
>   - { id: g3, col: good, label: "Modal (Client)", text: "отримує готовий вивід", note: "у бандлі тільки Modal", tone: green, icon: "px:check" }
> steps:
>   - { show: [b1, g1], note: "Та сама ідея — модалка з кошиком — двома способами. Різниця в тому, хто імпортує Cart." }
>   - { show: [b2, g2], note: "Ліворуч Cart імпортує клієнтський файл, тож Cart стає клієнтським. Праворуч його імпортує й рендерить серверна сторінка." }
>   - { show: [b3, g3], note: "Ліворуч за Cart у браузер тягнеться lib/db.ts — server-only зупиняє збірку. Праворуч Modal отримує вже відрендерений Cart як дані." }
> ```
> Межу визначає імпорт, а не вкладеність у JSX.

Цей прийом називають **interleaving** — чергування серверних і клієнтських шарів на будь-якій глибині. Глибше про межу — у темі курсу 08.

### 🎛️ Контекст і провайдери

React Context у Server Components не підтримується: у них немає стану й «життя» між рендерами, а `createContext` у серверному файлі зупиняє компілятор. Рішення — клієнтський провайдер, що приймає `children`:

```tsx
// app/theme-provider.tsx
'use client'

import { createContext, useContext, useState } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue | null>(null)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  // children — уже відрендерений серверний вивід; провайдер лише обгортає його
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme() викликано поза <ThemeProvider>')
  return value
}
```

```tsx
// app/layout.tsx — Server Component: рендерить провайдер, але сам лишається серверним
import ThemeProvider from './theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

У React 19 сам контекст є провайдером (`<ThemeContext value={…}>`). Client Components нижче викликають `useTheme()`, а сторінки під провайдером лишаються серверними — вони приходять як `children`. Server Components контекст читати не можуть: потрібне значення (колірна тема з cookie, мова) вони беруть із джерела. Провайдери рендерять **якомога глибше** — навколо `{children}`, а не всього `<html>`: так Next.js легше оптимізувати статичні частини.

> [!quiz] Перевір себе: заповни пропуски в провайдері кошика
> level: junior · type: fill · bank: 'use server', props · id: nextjs-core-07-quiz-07
>
> ```tsx fill
> // app/cart-provider.tsx
> [['use client'|"use client"]]
>
> import { createContext, useState } from 'react'
>
> export const CartContext = [[createContext]]<string[]>([])
>
> export function CartProvider({ [[children]] }: { children: React.ReactNode }) {
>   const [items, setItems] = [[useState]]<string[]>([])
>   return <CartContext value={items}>{children}</CartContext>
> }
> ```
>
> **Пояснення:** провайдер тримає стан, тож це Client Component — директива першим рядком. Він приймає `children`, щоб серверні сторінки під ним лишалися серверними: провайдер не імпортує їх, а лише обгортає готовий вивід. `'use server'` тут не до місця — вона позначає Server Functions, а не серверні компоненти.

### 📚 Сторонні компоненти без директиви

Багато бібліотек написано до RSC: компонент використовує `useState`, але `'use client'` у пакеті немає. Усередині твого Client Component він працює, а з Server Component — ні: `next dev` пише `useState only works in Client Components`, а `next build` — мініфіковане й майже нечитабельне `TypeError: d is not a function or its return value is not iterable`. Тому помилки рендера відтворюй у `next dev`.

Виправлення — тонка обгортка з директивою на **твоєму** боці:

```tsx
// app/gallery/carousel.tsx — тонка обгортка: межа на нашому боці
'use client'

export { Carousel } from 'acme-carousel'
```

```tsx
// app/gallery/page.tsx
import { Carousel } from './carousel'

export default function GalleryPage() {
  return (
    <section>
      <h1>Галерея</h1>
      <Carousel />
    </section>
  )
}
```

Сторінка лишилась серверною. Авторам бібліотек документація радить ставити `'use client'` у клієнтські точки входу й стежити, щоб бандлер пакета не вирізав директиву.

> [!quiz] Перевір себе: як правильно підключити карусель?
> level: junior · id: nextjs-core-07-quiz-08
>
> `app/gallery/page.tsx` імпортує `Carousel` з пакета `acme-carousel` і падає з `useState only works in Client Components`. Як виправити найкраще?
>
> - [ ] Додати `'use client'` у `app/gallery/page.tsx`
> - [x] Створити `app/gallery/carousel.tsx` з `'use client'` і реекспортом `Carousel`, а сторінку лишити серверною
> - [ ] Дописати `'use client'` у файл пакета в `node_modules`
> - [ ] Обгорнути `<Carousel />` у `<Suspense>`
>
> **Пояснення:** директива на сторінці «працює», але робить клієнтською всю сторінку. Правка `node_modules` зникне після `npm install`. `Suspense` керує очікуванням, а не межею.

### 🔐 Секрети, env і server-only

Модуль можна імпортувати з обох середовищ, тож серверний код легко випадково затягнути в браузер — **environment poisoning**. Захист має три шари.

**1. Змінні середовища.** `process.env.*` доступні лише на сервері. `NEXT_PUBLIC_*` Next.js **вшиває значенням** у клієнтський JS під час `next build` — після збірки вони заморожені (один Docker-образ скрізь матиме значення з моменту збірки), а `process.env[name]` не вшивається. Підступний випадок — Client Component читає **непублічну** змінну:

```tsx
// app/env/env-probe.tsx — ❌ секрет у Client Component
'use client'

export function EnvProbe() {
  return <p>[{String(process.env.API_KEY)}]</p>
}
```

У клієнтському чанку значення немає (`undefined` у браузері). Але Client Component **рендериться й на сервері**, тож справжній ключ потрапляє в **prerendered HTML** — у вихідний код сторінки, `curl` і пошуковим роботам. Після hydration React замінює текст на `[undefined]` і пише hydration mismatch (у продакшні — `Minified React error #418`). Секрети читай **лише в серверних модулях**.

> [!warning] Розбіжність з документацією
> [Server and Client Components → Preventing environment poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning) каже, що непублічні змінні в клієнтському коді Next.js «replaces … with an empty string». На Next.js 16.3.8 (Turbopack) заміни немає: у чанку лишається `process.env.API_KEY`, у браузері — `undefined`, а в HTML — справжнє значення з серверного рендера.

**2. `server-only` і `client-only`.** Познач модуль із серверним кодом імпортом `'server-only'` — тоді будь-який його імпорт у клієнтський граф зупинить збірку:

```ts
// lib/db.ts — доступ до даних; 'server-only' не дасть імпортувати це в клієнтський граф
import 'server-only'

export async function getUser(id: string) {
  // ... запит до БД із секретним рядком підключення
}
```

Next.js обробляє ці імпорти сам (npm-пакет потрібен лише, якщо свариться лінтер). `client-only` — дзеркально, для модулів із `window`.

**3. Props — публічні дані.** Усе, що передано в Client Component, лежить у RSC payload — **навіть поле, яке компонент не рендерить**. Передай весь обʼєкт користувача в `ProfileCard`, що показує лише імʼя, — і `passwordHash` опиниться у вбудованому в HTML payload. TypeScript мовчить: `User` містить усі поля `Profile`.

```tsx
// app/profile/page.tsx
import { getUser } from '@/lib/db'
import { ProfileCard } from './profile-card'

export default async function ProfilePage() {
  const user = await getUser('u1')
  if (!user) return <p>Не знайдено</p>

  // ✅ DTO: тільки те, що потрібно для UI
  const profile = { name: user.name, avatarUrl: user.avatarUrl }
  return <ProfileCard profile={profile} />
}
```

DTO — обʼєкт рівно з потрібними клієнту полями, зібраний **білим списком**. Експериментальний React Taint API (`experimental.taint`) — додатковий шар, а не заміна. Data Access Layer — у розділі «Auth і безпека».

> [!quiz] Що буде у вихідному HTML?
> level: middle · type: output · id: nextjs-core-07-quiz-09
>
> У `.env` є `API_KEY=sk_live_123` (без `NEXT_PUBLIC_`). Сторінка рендерить цей компонент. Що буде всередині `<p>` у HTML, який віддає `next build && next start` (view-source, `curl`)?
>
> ```tsx
> // app/env/env-probe.tsx
> 'use client'
>
> export function EnvProbe() {
>   return <p>[{String(process.env.API_KEY)}]</p>
> }
> ```
>
> - [ ] `[]` — Next.js замінює непублічні змінні порожнім рядком
> - [ ] `[undefined]` — цієї змінної немає ніде, крім сервера
> - [x] `[sk_live_123]` — секрет потрапив у HTML
> - [ ] Помилка збірки: непублічну змінну не можна читати в Client Component
>
> **Пояснення:** HTML будується на сервері, де Client Component бачить повний `process.env`. Перший варіант цитує документацію, але на 16.3.8 заміни немає. `[undefined]` зʼявиться лише **після** hydration (React замінить текст і напише hydration mismatch) — а ключ уже у вихідному коді. Секрети — лише в модулях з `import 'server-only'`.

### 🧮 Як обрати: таблиця рішень

Почни з Server Component і переходь на клієнт **лише** тоді, коли потрібна клієнтська можливість. Межу став на найменшому інтерактивному листку.

| Що потрібно | Компонент | Чому |
|---|---|---|
| Отримати дані з БД, API, файлу | Server | дані біля джерела, без API-маршруту |
| Використати секрет, токен, приватний SDK | Server + `server-only` | код і значення не їдуть у браузер |
| Важка бібліотека лише для рендера (markdown, підсвітка коду) | Server | бібліотека лишається на сервері |
| Стан, обробники, `useEffect`, свої хуки | Client | потрібен код, що живе в браузері |
| `window`, `localStorage`, `navigator.geolocation` | Client (у `useEffect`) | браузерні API |
| Контекст | Client-провайдер з `children` | контекст не підтримується на сервері |
| Розкривний блок, відео, проста форма | Server (HTML) | `<details>`, `<video controls>`, `<form action>` працюють без JS |
| Модалка, вкладки, слайдер із серверним вмістом | Client-обгортка + Server у `children` | стан на клієнті, дані на сервері |


### 🧯 Типові помилки і як їх читати

Майже всі помилки межі — клієнтська можливість у серверному графі або серверний код у клієнтському. Тексти — з `next build` / `next dev` 16.3.8.

| Повідомлення | Що сталося | Що зробити |
|---|---|---|
| `You're importing a module that depends on useState into a React Server Component module` | хук чи `createContext` у файлі без `'use client'` | винести інтерактив у клієнтський файл |
| `useState only works in Client Components` (`next dev`) | сторонній компонент без директиви в Server Component | обгортка з `'use client'` |
| `Event handlers cannot be passed to Client Component props` | `onClick` у Server Component або обробник у props | обробник — у клієнтському компоненті |
| `Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"` | звичайна функція в props | функцію на клієнт або Server Function |
| `Only plain objects, and a few built-ins, can be passed to Client Components` | екземпляр класу, `Object.create(null)` | передати простий обʼєкт (DTO) |
| `'server-only' cannot be imported from a Client Component module` | серверний модуль потрапив у клієнтський граф | читати **Import traces** і розірвати ланцюжок |
| `The "use client" directive must be placed before other expressions` | директива після імпорту | перенести першим рядком |
| `ReferenceError: window is not defined` | браузерний API в тілі Client Component | у `useEffect` або обробник |
| `<Posts> is an async Client Component. Only Server Components can be async at the moment` | `async` + `'use client'` (лише `next dev`; збірка проходить) | прибрати директиву, дані — на сервері |
| `Element type is invalid … but got: undefined` | `Menu.Item` клієнтського компонента в серверному коді | іменовані експорти |

Імпорт `server-only` у клієнтський граф дає **дві** помилки. Друга (`'server-only' cannot be imported from a Client Component module … It should only be used from a Server Component.`) зрозуміла, перша — ні:

> [!warning] Повідомлення про Pages Router
> На 16.3.8 перша помилка — `You're importing a module that depends on "server-only". This API is only available in Server Components in the App Router, but you are using it in the Pages Router.`, навіть без папки `pages/`. [Документація](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning) обіцяє просто «build-time error». Не вір частині про Pages Router — читай **Import traces**.

Блок `Client Component Browser` з trace (скорочено: блоки `Server Component` і `Client Component SSR` опущено):

```text
Import traces:
  Client Component Browser:
    ./lib/db.ts [Client Component Browser]
    ./app/user-badge.tsx [Client Component Browser]
    ./app/user-badge.tsx [Server Component]
    ./app/page.tsx [Server Component]
```

Читай знизу вгору: серверна `page.tsx` імпортує клієнтський `user-badge.tsx` (межа), а той — `lib/db.ts`. Розривай ланку `user-badge.tsx → lib/db.ts`: дані отримай на сервері й передай props.


### 🏭 Як це роблять у продакшні

- **Сервер за замовчуванням, клієнт — листки.** `'use client'` отримують кнопки, поля, меню, модалки, графіки. `'use client'` у `page.tsx` чи `layout.tsx` на code review — привід спитати «навіщо».
- **Шар даних із `server-only`.** БД, секрети й внутрішні API — у `lib/server/*` (або `lib/dal.ts`), кожен файл з `import 'server-only'`; часто ще й ESLint `no-restricted-imports` для клієнтських папок.
- **DTO на межі.** Шар даних повертає DTO білим списком, а не сирі рядки: нова колонка не протече в браузер сама.
- **Один `app/providers.tsx`** з усіма контекстами (колірна тема, клієнт запитів, тости) усередині `<body>` root layout.
- **Обгортки для сторонніх бібліотек** — в одній папці на кшталт `components/client/`, щоб межу було видно й легко прибрати.
- **Жодних секретів у `NEXT_PUBLIC_*`**; для «один образ — багато середовищ» публічні налаштування віддають із сервера.
- **Контроль бандла** — `next experimental-analyze` (експериментальний аналізатор Turbopack, Next.js 16.1+): розмір чанків і ланцюжки імпортів.

## ⚠️ Пастки

> [!pitfall] use client на layout «про всяк випадок»
> Помилки зникають, але клієнтським стає все, що layout імпортує, і доступу до даних більше немає.
>
> ```tsx
> // ❌ app/layout.tsx
> 'use client' // тепер Logo, Nav, Footer та їхні імпорти — у бандлі
>
> // ✅ layout серверний, клієнтський лише app/ui/search.tsx
> ```

> [!pitfall] Секрет у Client Component
> У бандлі значення немає, але серверний рендер кладе його в HTML.
>
> ```tsx
> 'use client'
> export function EnvProbe() {
>   return <p>{process.env.API_KEY}</p> // ❌ ключ у вихідному коді сторінки
> }
> ```

> [!pitfall] Увесь обʼєкт з БД у props
> Props серіалізуються повністю, незалежно від того, що компонент рендерить.
>
> ```tsx
> return <ProfileCard profile={user} /> // ❌ passwordHash у payload
> return <ProfileCard profile={{ name: user.name, avatarUrl: user.avatarUrl }} /> // ✅ DTO
> ```

> [!pitfall] window у тілі Client Component
> `'use client'` не скасовує серверний рендер: `window` у тілі компонента падає під час збірки. Браузерні API — в `useEffect` або в обробниках.
>
> ```tsx
> 'use client'
>
> import { useEffect, useState } from 'react'
>
> export function WindowWidth() {
>   const [width, setWidth] = useState<number | null>(null)
>   useEffect(() => {
>     const update = () => setWidth(window.innerWidth)
>     update()
>     window.addEventListener('resize', update)
>     return () => window.removeEventListener('resize', update)
>   }, [])
>   return <p>Ширина: {width ?? '…'}px</p>
> }
> ```

> [!pitfall] async Client Component проходить збірку
> `next build` мовчить, але це непідтримуваний режим: `next dev` пише `is an async Client Component`. Зазвичай директиву додали до файлу, написаного для сервера.
>
> ```tsx
> 'use client'
>
> export async function Posts() { // ❌ async + 'use client'
>   const posts = await getPosts()
>   return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
> }
> ```

> [!pitfall] Menu.Item через межу
> Серверний код отримує клієнтський `Menu` як посилання без статичних полів.
>
> ```tsx
> // menu.tsx: 'use client' … Menu.Item = Item
> <Menu.Item>Профіль</Menu.Item> // ❌ у Server Component: Element type is invalid
> <MenuItem>Профіль</MenuItem> // ✅ export function MenuItem
> ```

## 🎤 На співбесіді

> [!interview] Чим Server Component відрізняється від Client Component? Чи рендериться Client Component на сервері?
> level: junior · frequency: дуже часто · id: nextjs-core-07-int-01
>
> ---
>
> Server Component виконується лише на сервері (при запиті або під час `next build`), його код не потрапляє в бандл; він може бути `async` і читати БД, але не має стану й обробників. Client Component виконується **і на сервері** (HTML при першому заході), **і в браузері** (hydration); при навігації — лише в браузері з RSC payload. «Client» означає «код їде в браузер», а не «рендер тільки там». За замовчуванням усе серверне.
>
> 📚 [[Next.js - 07. Server і Client Components#🗺️ Що де виконується|Розділ: що де виконується]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) · [React: Server Components](https://react.dev/reference/rsc/server-components)

> [!interview] Що саме робить 'use client' і чому його не треба ставити в кожен файл?
> level: junior · frequency: дуже часто · id: nextjs-core-07-int-02
>
> ---
>
> Це межа між серверним і клієнтським графами модулів. Файл з директивою, імпортований серверним кодом, — вхід у клієнт: він і все, що він транзитивно імпортує, йде в бандл. Тому директива потрібна лише на вході; компонент без неї агностичний — середовище визначає місце імпорту. Server Components у `children` лишаються серверними, бо клієнтський файл їх не імпортує.
>
> 📚 [[Next.js - 07. Server і Client Components#🚪 Директива use client — межа в графі модулів|Розділ: use client]] · [Next.js: use client](https://nextjs.org/docs/app/api-reference/directives/use-client) · [React: 'use client'](https://react.dev/reference/rsc/use-client)

> [!interview] Як показати серверний компонент усередині клієнтського (модалка з даними з БД)?
> level: middle · frequency: часто · id: nextjs-core-07-int-03
>
> ---
>
> Не імпортувати його в клієнтський файл — імпорт затягне компонент і залежності в клієнтський граф. Модалка приймає `children`, а серверна сторінка пише `<Modal><Cart /></Modal>`: власник `Cart` серверний, тож він рендериться на сервері, а `Modal` отримує готовий вивід як серіалізований елемент. Це interleaving; так само працюють провайдери контексту.
>
> 📚 [[Next.js - 07. Server і Client Components#🧩 Композиція: серверне всередині клієнтського|Розділ: композиція]] · [Next.js: Interleaving Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components) · [Dan Abramov: Impossible Components](https://overreacted.io/impossible-components/)

> [!interview] Сторінка товару: галерея з каруселлю, опис, ціна, кнопка «У кошик», відгуки. Де проведеш межу 'use client'?
> level: middle · frequency: часто · id: nextjs-core-07-int-04
>
> ---
>
> Сторінка — Server Component: читає товар і відгуки з БД і передає далі DTO. Опис, ціна й відгуки — серверні. Клієнтські листки: карусель (через обгортку, якщо бібліотека без директиви) і кнопка «У кошик» з обробником та Server Function у `addToCartAction`. Якщо відгуки за вкладками, вкладки — клієнтська обгортка, а відгуки приходять у неї як `children`. У бандлі лише карусель, кнопка й вкладки.
>
> 📚 [[Next.js - 07. Server і Client Components#🧮 Як обрати: таблиця рішень|Розділ: таблиця рішень]] · [Next.js: Reducing JS bundle size](https://nextjs.org/docs/app/getting-started/server-and-client-components#reducing-js-bundle-size) · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary)

> [!interview] Модуль lib/format.ts імпортують і серверні, і клієнтські компоненти. Скільки в нього копій і що з цього випливає?
> level: senior · frequency: іноді · id: nextjs-core-07-int-05
>
> ---
>
> Модуль належить обом графам, і Next.js компілює його окремо для кожного середовища; серверні й клієнтські компоненти виконуються в ізольованих модульних системах, навіть коли Client Component рендериться на сервері. Тож змінна чи синглтон рівня модуля (кеш, store) — різні екземпляри, і стан між ними не ділиться: серверні дані доходять до клієнта лише через props. А все, що модуль імпортує, їде в бандл, тому важкий чи секретний код виносять в окремий модуль з `import 'server-only'`.
>
> 📚 [[Next.js - 07. Server і Client Components#🚪 Директива use client — межа в графі модулів|Розділ: граф модулів]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security#passing-data-from-server-to-client)

## 🔗 Звʼязки

- [[Server Components]] і [[use client]] — довідник React: визначення й серіалізовані типи.
- [[use server]] і [[Server Functions]] — те, що перетинає межу як посилання (у курсі — тема 21).
- [[JavaScript - 05. Замикання]] — чому функцію не серіалізувати: їй потрібне оточення, якого в браузері немає.
- Далі в курсі: тема 08 — межа детально (серіалізація, `children`, `server-only`, контекст), 09 — RSC payload, HTML і hydration, 10 — статичне й динамічне, 11 — streaming і `use()`.

## ⚡ Фішки

> [!reel] 🍽️ Код Server Component не бачить жоден браузер
> Server Component приходить у браузер лише як результат рендера в RSC payload. Його код і залежності — хоч ціла бібліотека markdown — не додають у бандл жодного байта.

> [!reel] 🔁 Client Component теж рендериться на сервері
> `'use client'` означає «код їде в браузер», а не «рендер лише там»: при першому заході компонент виконується на сервері для HTML і ще раз у браузері під час hydration.

> [!reel] 🚪 use client ставлять на вході, а не всюди
> Директива — межа в графі модулів: усе, що імпортує клієнтський файл, і так клієнтське.

> [!reel] 🧳 children — дірка в клієнтському компоненті
> `<Modal><Cart /></Modal>` у серверному файлі: `Cart` рендериться на сервері, а `Modal` отримує готовий вивід. Межу визначає імпорт, а не вкладеність у JSX.

> [!reel] 🔑 Непублічна змінна в Client Component — у HTML
> У бандлі `process.env.API_KEY` немає. Але Client Component рендериться на сервері, де ключ є, — і ключ потрапляє у вихідний код сторінки.
>
> ```tsx
> 'use client'
> export const Leak = () => <p>{process.env.API_KEY}</p>
> ```

> [!reel] 🧪 server-only — пакет, вміст якого не потрібен
> Next.js обробляє `import 'server-only'` сам і зупиняє збірку, якщо модуль потрапив у клієнтський граф. Сам npm-пакет можна навіть не встановлювати.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Який компонент у App Router за замовчуванням — серверний чи клієнтський?
> *дуже часто · теорія* · `nextjs-core-07-card-01`
>
> Серверний. Кожен `page.tsx`, `layout.tsx` і будь-який компонент — Server Component, доки файл (або модуль, який його імпортує) не позначений `'use client'`.
>
> 📚 [[Next.js - 07. Server і Client Components#🏠 За замовчуванням усе серверне|Розділ: за замовчуванням сервер]] · [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

> [!question]- Чого не може Server Component?
> *дуже часто · теорія* · `nextjs-core-07-card-02`
>
> Мати стан і ефекти, читати контекст, обробляти події (`onClick`), чіпати `window`/`localStorage`. Його коду немає в браузері; оновлює його лише новий рендер на сервері.
>
> 📚 [[Next.js - 07. Server і Client Components#🏠 За замовчуванням усе серверне|Розділ: за замовчуванням сервер]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary#state-and-interactivity)

> [!question]- Де виконується Client Component при першому заході на сторінку?
> *часто · теорія* · `nextjs-core-07-card-03`
>
> У двох місцях: на сервері (щоб отримати HTML) і в браузері (hydration — React чіпляє обробники до готового DOM). При навігації через `Link` — лише в браузері, з RSC payload.
>
> 📚 [[Next.js - 07. Server і Client Components#🗺️ Що де виконується|Розділ: що де виконується]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary#rendering-environments)

> [!question]- Де має стояти директива 'use client'?
> *часто · код* · `nextjs-core-07-card-04`
>
> Першим виразом файлу, до будь-яких імпортів (коментарі вище дозволені), в одинарних або подвійних лапках. Після імпорту збірка падає з `The "use client" directive must be placed before other expressions`.
>
> ```tsx
> 'use client'
>
> import { useState } from 'react'
> ```
>
> 📚 [[Next.js - 07. Server і Client Components#🚪 Директива use client — межа в графі модулів|Розділ: use client]] · [React: 'use client'](https://react.dev/reference/rsc/use-client)

> [!question]- Як підключити сторонній компонент з useState, у якого немає 'use client'?
> *часто · практика* · `nextjs-core-07-card-05`
>
> Створити свій файл-обгортку з директивою й реекспортом: `'use client'; export { Carousel } from 'acme-carousel'`. Серверна сторінка імпортує обгортку й лишається серверною.
>
> 📚 [[Next.js - 07. Server і Client Components#📚 Сторонні компоненти без директиви|Розділ: сторонні компоненти]] · [Next.js: Third-party components](https://nextjs.org/docs/app/getting-started/server-and-client-components#third-party-components)

### 🟡 Middle

> [!question]- Чому 'use client' називають межею в графі модулів, а не позначкою компонента?
> *часто · теорія* · `nextjs-core-07-card-06`
>
> Бо вона діє на **імпорти**: файл з директивою і все, що він транзитивно імпортує, йде в клієнтський бандл, а серверний код отримує лише посилання. Компонент без директиви стає серверним чи клієнтським залежно від місця імпорту.
>
> 📚 [[Next.js - 07. Server і Client Components#🚪 Директива use client — межа в графі модулів|Розділ: use client]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary#crossing-the-boundary)

> [!question]- Які props можна передати з Server Component у Client Component?
> *дуже часто · теорія* · `nextjs-core-07-card-07`
>
> Серіалізовані: примітиви (`bigint`, `undefined` теж), `Symbol.for(...)`, масиви, прості обʼєкти, `Date`, `Map`, `Set`, typed arrays, `Promise`, JSX, Server Functions (як посилання). Не можна: звичайні функції, класи та їхні екземпляри, обʼєкти з `null`-прототипом, локальні `Symbol()`.
>
> 📚 [[Next.js - 07. Server і Client Components#🧳 Що можна передати через межу|Розділ: що можна передати]] · [React: Serializable types](https://react.dev/reference/rsc/use-client#serializable-types)

> [!question]- Чим відрізняються owner і parent компонента і чому це важливо для RSC?
> *іноді · теорія* · `nextjs-core-07-card-08`
>
> Owner — компонент, у чиєму коді написано JSX дитини; parent — той, хто містить її в дереві. У `<Modal><Cart /></Modal>` у серверній сторінці owner `Cart` — сторінка, тож `Cart` рендериться на сервері, а parent `Modal` лише ставить готовий вивід.
>
> 📚 [[Next.js - 07. Server і Client Components#🧩 Композиція: серверне всередині клієнтського|Розділ: композиція]] · [Next.js: Interleaving](https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components)

> [!question]- Як використати React Context, якщо layout — Server Component?
> *часто · практика* · `nextjs-core-07-card-09`
>
> Клієнтський провайдер (`'use client'`, `createContext`, стан) приймає `children` і рендериться в layout навколо `{children}`, якомога глибше. Сторінки під ним лишаються серверними.
>
> 📚 [[Next.js - 07. Server і Client Components#🎛️ Контекст і провайдери|Розділ: контекст і провайдери]] · [Next.js: Context providers](https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers)

### 🔴 Senior

> [!question]- Чому непублічна змінна середовища в Client Component небезпечна, якщо в бандл вона не потрапляє?
> *іноді · безпека* · `nextjs-core-07-card-10`
>
> Client Component рендериться й на сервері, де `process.env` повний, тож ключ потрапляє у вихідний код сторінки. Після hydration React замінює текст на `undefined` і пише hydration mismatch, але секрет уже віддано.
>
> 📚 [[Next.js - 07. Server і Client Components#🔐 Секрети, env і server-only|Розділ: секрети й env]] · [Next.js: Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)

> [!question]- Що таке environment poisoning і як від нього захищаються?
> *іноді · безпека* · `nextjs-core-07-card-11`
>
> Випадкове потрапляння серверного коду (БД, секрети) у клієнтський граф через спільні модулі. Захист: `import 'server-only'` (збірка падає з import trace), `client-only` — дзеркально, плюс `no-restricted-imports`.
>
> 📚 [[Next.js - 07. Server і Client Components#🔐 Секрети, env і server-only|Розділ: server-only]] · [Next.js: Preventing environment poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning)

> [!question]- Чому складений компонент Menu.Item ламається, коли його використовують із Server Component?
> *рідко · код* · `nextjs-core-07-card-12`
>
> Серверний код отримує клієнтський `Menu` як посилання без статичних полів: `Menu.Item` — `undefined`, і React кидає `Element type is invalid`. Рішення — іменовані експорти (`MenuItem`).
>
> 📚 [[Next.js - 07. Server і Client Components#🧩 Композиція: серверне всередині клієнтського|Розділ: композиція]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary)

> [!question]- Чому передача всього обʼєкта з БД у Client Component — витік, навіть якщо компонент показує одне поле?
> *часто · безпека* · `nextjs-core-07-card-13`
>
> Props серіалізуються в RSC payload цілком — у HTML при першому заході й у вкладці Network при навігації. TypeScript не допоможе: тип-надмножина підходить. Рішення — DTO білим списком.
>
> 📚 [[Next.js - 07. Server і Client Components#🔐 Секрети, env і server-only|Розділ: DTO]] · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security#passing-data-from-server-to-client)

## 🛠️ Практика

> [!task] Знайди витік у DTO профілю
> level: junior · difficulty: easy · id: nextjs-core-07-task-01 · tags: dto, security, rsc
>
> Сторінка передає в клієнтський `ProfileCard` результат `toProfileDTO(user, viewer)`. Автор «прибрав пароль» і вважає, що решта безпечна. Перепиши функцію **білим списком**:
>
> - завжди: `id`, `name`, `avatarUrl` і `isOwner` (`true`, якщо `viewer` — той самий користувач);
> - `email` — лише власнику (`viewer?.id === user.id`); іншим ключа `email` бути не повинно взагалі;
> - жодних інших полів, навіть тих, які завтра зʼявляться в моделі.
>
> `viewer` може бути `null` (гість). Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts starter
> type User = {
>   id: string
>   name: string
>   email: string
>   avatarUrl: string
>   passwordHash: string
>   sessionToken: string
>   [extra: string]: unknown
> }
>
> type ProfileDTO = {
>   id: string
>   name: string
>   avatarUrl: string
>   isOwner: boolean
>   email?: string
> }
>
> function toProfileDTO(user: User, viewer: { id: string } | null): ProfileDTO {
>   // ❌ «прибрали пароль» — і вважаємо, що решта безпечна
>   const { passwordHash, ...rest } = user
>   return rest as unknown as ProfileDTO
> }
> ```
>
> ```ts tests
> const user: User = {
>   id: 'u1',
>   name: 'Оля',
>   email: 'olya@example.com',
>   avatarUrl: '/a/u1.png',
>   passwordHash: '$argon2id$secret',
>   sessionToken: 'sess_secret',
> }
>
> test('не віддає passwordHash і sessionToken', () => {
>   const dto = toProfileDTO(user, { id: 'u2' }) as Record<string, unknown>
>   expect(dto.passwordHash).toBeUndefined()
>   expect(dto.sessionToken).toBeUndefined()
> })
>
> test('чужому віддає рівно id, name, avatarUrl, isOwner', () => {
>   const dto = toProfileDTO(user, { id: 'u2' })
>   expect(Object.keys(dto).sort()).toEqual(['avatarUrl', 'id', 'isOwner', 'name'])
>   expect(dto.isOwner).toBe(false)
> })
>
> test('власник бачить свій email', () => {
>   const dto = toProfileDTO(user, { id: 'u1' })
>   expect(dto).toEqual({ id: 'u1', name: 'Оля', avatarUrl: '/a/u1.png', email: 'olya@example.com', isOwner: true })
> })
>
> test('нове поле в моделі не протікає', () => {
>   const dto = toProfileDTO({ ...user, stripeCustomerId: 'cus_123' }, { id: 'u1' }) as Record<string, unknown>
>   expect(dto.stripeCustomerId).toBeUndefined()
>   expect(Object.keys(dto)).toHaveLength(5)
> })
>
> test('гість (viewer = null) не бачить email', () => {
>   const dto = toProfileDTO(user, null)
>   expect('email' in dto).toBe(false)
>   expect(dto.isOwner).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > Чорний список (`const { passwordHash, ...rest }`) пропускає все, про що ти не подумав. Збери новий обʼєкт з потрібних полів.
>
> > [!hint]- Підказка 2
> > `email: undefined` — теж ключ. Додавай поле умовно: `if (isOwner) dto.email = user.email`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function toProfileDTO(user: User, viewer: { id: string } | null): ProfileDTO {
> >   const isOwner = viewer != null && viewer.id === user.id
> >   const dto: ProfileDTO = {
> >     id: user.id,
> >     name: user.name,
> >     avatarUrl: user.avatarUrl,
> >     isOwner,
> >   }
> >   if (isOwner) dto.email = user.email
> >   return dto
> > }
> > ```
> >
> > Білий список не залежить від решти моделі: нова колонка не протече в RSC payload сама. Навіть `email: undefined` серіалізувався б і підказав, що поле існує. У реальному коді така функція живе в шарі даних з `import 'server-only'`.

> [!task] Перевір, чи props пройдуть через межу
> level: middle · difficulty: medium · id: nextjs-core-07-task-02 · tags: serialization, rsc
>
> Напиши `findUnserializable(props)` — масив шляхів до значень, які **не можна** передати з Server Component у Client Component. Правила (спрощена модель React):
>
> - можна: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`; `Date`, `Map`, `Set`, `Promise`, `ArrayBuffer` і typed arrays (`ArrayBuffer.isView`) — їхній вміст не перевіряємо;
> - `symbol` — лише зареєстрований (`Symbol.keyFor(s) !== undefined`);
> - функція — лише Server Function: у неї `fn.$$typeof === Symbol.for('react.server.reference')` (так React позначає посилання на серверні функції);
> - масиви й прості обʼєкти (прототип `Object.prototype`) — перевіряємо вглиб;
> - решта обʼєктів (екземпляри класів, `Object.create(null)`) — не можна.
>
> Шлях: `user.save`, `items[1].format`; порядок — порядок обходу; циклів немає.
>
> ```js
> findUnserializable({ title: 'Кошик', onClose: () => {} }) // → ['onClose']
> ```
>
> ```js starter
> function findUnserializable(props) {
>   // твій код
> }
> ```
>
> ```js tests
> test('примітиви, Date, Map, Set і прості обʼєкти проходять', () => {
>   const props = {
>     a: 'x', b: 1, c: BigInt(2), d: true, e: undefined, f: null,
>     when: new Date(), tags: new Set(['a']), prices: new Map([['p1', 1]]),
>     nested: { list: [1, 'два', { ok: true }] }, bytes: new Uint8Array(2), buf: new ArrayBuffer(2), pending: Promise.resolve(1),
>   }
>   expect(findUnserializable(props)).toEqual([])
> })
>
> test('знаходить звичайну функцію', () => {
>   expect(findUnserializable({ title: 'Кошик', onClose: () => {} })).toEqual(['onClose'])
> })
>
> test('пропускає Server Function', () => {
>   async function like() {}
>   like.$$typeof = Symbol.for('react.server.reference')
>   expect(findUnserializable({ likeAction: like })).toEqual([])
> })
>
> test('шукає вглиб обʼєктів і масивів', () => {
>   const props = {
>     user: { name: 'Оля', save() {} },
>     items: [{ id: 1 }, { id: 2, format: (n) => n }],
>   }
>   expect(findUnserializable(props)).toEqual(['user.save', 'items[1].format'])
> })
>
> test('відкидає екземпляри класів і null-прототип', () => {
>   class Money { constructor(amount) { this.amount = amount } }
>   expect(findUnserializable({ price: new Money(1), dict: Object.create(null) })).toEqual(['price', 'dict'])
> })
>
> test('символ — лише зареєстрований', () => {
>   expect(findUnserializable({ ok: Symbol.for('app.ok'), bad: Symbol('local') })).toEqual(['bad'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Напиши рекурсивну `walk(value, path)` і збирай шляхи в один масив. Для ключа верхнього рівня шлях — просто імʼя ключа.
>
> > [!hint]- Підказка 2
> > Порядок перевірок для обʼєктів: `Array.isArray` → вбудовані (`instanceof Date/Map/Set/Promise/ArrayBuffer`, `ArrayBuffer.isView`) → `Object.getPrototypeOf(value) === Object.prototype` → інакше помилка.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function findUnserializable(props) {
> >   const bad = []
> >   const SERVER_REF = Symbol.for('react.server.reference')
> >   const join = (path, key) => (path ? `${path}.${key}` : key)
> >
> >   function walk(value, path) {
> >     if (value === null || value === undefined) return
> >     const t = typeof value
> >     if (t === 'string' || t === 'number' || t === 'bigint' || t === 'boolean') return
> >     if (t === 'symbol') {
> >       if (Symbol.keyFor(value) === undefined) bad.push(path)
> >       return
> >     }
> >     if (t === 'function') {
> >       if (value.$$typeof !== SERVER_REF) bad.push(path)
> >       return
> >     }
> >     if (Array.isArray(value)) {
> >       value.forEach((item, i) => walk(item, `${path}[${i}]`))
> >       return
> >     }
> >     if (
> >       value instanceof Date || value instanceof Map || value instanceof Set ||
> >       value instanceof Promise || value instanceof ArrayBuffer || ArrayBuffer.isView(value)
> >     ) return
> >     if (Object.getPrototypeOf(value) === Object.prototype) {
> >       for (const key of Object.keys(value)) walk(value[key], join(path, key))
> >       return
> >     }
> >     bad.push(path)
> >   }
> >
> >   for (const key of Object.keys(props)) walk(props[key], key)
> >   return bad
> > }
> > ```
> >
> > Справжній React робить те саме під час серіалізації й кидає помилку з першим поганим значенням. Спрощення моделі: React перевіряє й вміст `Map`/`Set`, підтримує JSX і циклічні посилання.

> [!task] Що потрапить у клієнтський бандл
> level: middle · difficulty: hard · id: nextjs-core-07-task-03 · tags: module-graph, bundle, server-only
>
> Напиши `clientBundle(graph, entries)`: `graph` — `{ [file]: { directive, imports } }` (`directive` — `'use client'`, `'use server'` або `null`), `entries` — файли маршрутів. Поверни **відсортований** масив файлів клієнтського бандла.
>
> Правила:
>
> 1. Обхід починається із серверного середовища.
> 2. `'use client'`, імпортований із сервера, — вхід у клієнт: він і його транзитивні імпорти клієнтські. Усередині клієнта директива нічого не змінює.
> 3. `'use server'`, імпортований із клієнта, у бандл **не** йде (лише посилання), його імпорти не обходимо.
> 4. Імпорти поза `graph` — npm-пакети, ігноруй. Крім `'server-only'` у клієнтському модулі та `'client-only'` у серверному: `throw new Error(...)` з назвою модуля.
> 5. Модуль може бути в обох середовищах; імпорти бувають циклічні.
>
> ```js
> clientBundle({
>   'app/page.tsx': { directive: null, imports: ['app/modal.tsx', 'lib/format.ts'] },
>   'app/modal.tsx': { directive: 'use client', imports: ['lib/format.ts'] },
>   'lib/format.ts': { directive: null, imports: [] },
> }, ['app/page.tsx']) // → ['app/modal.tsx', 'lib/format.ts']
> ```
>
> ```js starter
> function clientBundle(graph, entries) {
>   // твій код
> }
> ```
>
> ```js tests
> const shop = {
>   'app/shop/page.tsx': { directive: null, imports: ['app/ui/cart.tsx', 'app/ui/modal.tsx', 'lib/format.ts'] },
>   'app/ui/cart.tsx': { directive: null, imports: ['lib/db.ts'] },
>   'lib/db.ts': { directive: null, imports: ['server-only', 'pg'] },
>   'app/ui/modal.tsx': { directive: 'use client', imports: ['react', 'app/ui/button.tsx', 'lib/format.ts'] },
>   'app/ui/button.tsx': { directive: null, imports: [] },
>   'lib/format.ts': { directive: null, imports: [] },
> }
>
> test('повертає лише модулі клієнтського графа, відсортовано', () => {
>   expect(clientBundle(shop, ['app/shop/page.tsx'])).toEqual(['app/ui/button.tsx', 'app/ui/modal.tsx', 'lib/format.ts'])
> })
>
> test('сторінка без клієнтських входів дає порожній бандл', () => {
>   expect(clientBundle(shop, ['app/ui/cart.tsx'])).toEqual([])
> })
>
> test('use server, імпортований із клієнта, не потрапляє в бандл', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/like.tsx'] },
>     'app/like.tsx': { directive: 'use client', imports: ['app/actions.ts'] },
>     'app/actions.ts': { directive: 'use server', imports: ['lib/db.ts'] },
>     'lib/db.ts': { directive: null, imports: ['server-only'] },
>   }
>   expect(clientBundle(graph, ['app/page.tsx'])).toEqual(['app/like.tsx'])
> })
>
> test('кидає помилку, якщо клієнтський модуль тягне server-only', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/badge.tsx'] },
>     'app/badge.tsx': { directive: 'use client', imports: ['lib/db.ts'] },
>     'lib/db.ts': { directive: null, imports: ['server-only'] },
>   }
>   expect(() => clientBundle(graph, ['app/page.tsx'])).toThrow('lib/db.ts')
> })
>
> test('кидає помилку, якщо серверний модуль тягне client-only', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['lib/storage.ts'] },
>     'lib/storage.ts': { directive: null, imports: ['client-only'] },
>   }
>   expect(() => clientBundle(graph, ['app/page.tsx'])).toThrow('lib/storage.ts')
> })
>
> test('модуль, спершу відвіданий сервером, усе одно потрапляє в бандл', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['lib/format.ts', 'app/modal.tsx'] },
>     'app/modal.tsx': { directive: 'use client', imports: ['lib/format.ts'] },
>     'lib/format.ts': { directive: null, imports: [] },
>   }
>   expect(clientBundle(graph, ['app/page.tsx'])).toEqual(['app/modal.tsx', 'lib/format.ts'])
> })
>
> test('не зациклюється на циклічних імпортах', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/a.tsx', 'app/b.tsx'] },
>     'app/a.tsx': { directive: 'use client', imports: ['app/b.tsx'] },
>     'app/b.tsx': { directive: null, imports: ['app/a.tsx', 'app/page.tsx'] },
>   }
>   expect(clientBundle(graph, ['app/page.tsx'])).toEqual(['app/a.tsx', 'app/b.tsx', 'app/page.tsx'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Обходь граф у глибину з параметром «середовище»: `visit(file, env)`. Відвідані пари `file + env` зберігай у `Set`, тоді цикли не страшні, а один файл може бути відвіданий у двох середовищах.
>
> > [!hint]- Підказка 2
> > Перед рекурсією визнач середовище модуля: сервер + `'use client'` → клієнт; клієнт + `'use server'` → зупинитись (лише посилання). Спецпакети перевіряй до того, як пропустити невідомі імпорти.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function clientBundle(graph, entries) {
> >   const seen = new Set()
> >   const client = new Set()
> >
> >   function visit(file, env) {
> >     const mod = graph[file]
> >     if (!mod) return
> >     if (env === 'client' && mod.directive === 'use server') return
> >     if (env === 'server' && mod.directive === 'use client') env = 'client'
> >     const key = `${env}:${file}`
> >     if (seen.has(key)) return
> >     seen.add(key)
> >     if (env === 'client') client.add(file)
> >
> >     for (const dep of mod.imports) {
> >       if (dep === 'server-only' && env === 'client') {
> >         throw new Error(`"server-only" імпортовано з клієнтського модуля ${file}`)
> >       }
> >       if (dep === 'client-only' && env === 'server') {
> >         throw new Error(`"client-only" імпортовано з серверного модуля ${file}`)
> >       }
> >       visit(dep, env)
> >     }
> >   }
> >
> >   for (const entry of entries) visit(entry, 'server')
> >   return [...client].sort()
> > }
> > ```
> >
> > Ключ відвідування — пара «середовище + файл», бо `lib/format.ts` законно живе в обох графах. Останній тест показує неочевидне: циклічний імпорт `b.tsx → page.tsx` із клієнтського графа затягує в бандл саму сторінку — сигнал, що клієнтський модуль імпортує зайве.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — офіційний старт: вибір, композиція, контекст, `server-only`.
- 🟡 [Next.js — The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) — де що виконується, owner і parent, що перетинає межу.
- 🟡 [Next.js — use client](https://nextjs.org/docs/app/api-reference/directives/use-client) — довідник директиви.
- 🟡 [Next.js — Data Security](https://nextjs.org/docs/app/guides/data-security) — DTO, Data Access Layer, Taint API.
- 🟡 [Next.js — Environment Variables](https://nextjs.org/docs/app/guides/environment-variables) — `NEXT_PUBLIC_` і вшивання на `next build`.
- 🔴 [React — 'use client'](https://react.dev/reference/rsc/use-client) — першоджерело й повний список серіалізованих типів.
- 🔴 [React — Server Components](https://react.dev/reference/rsc/server-components) — модель RSC від React.
- 🟡 [Dan Abramov — What Does "use client" Do?](https://overreacted.io/what-does-use-client-do/) — директиви як «двері» між двома програмами.
- 🟡 [Dan Abramov — Impossible Components](https://overreacted.io/impossible-components/) — що відкриває серверне всередині клієнтського.
- 🛠️ [Next.js — Package Bundling](https://nextjs.org/docs/app/guides/package-bundling) — `next experimental-analyze`.

> [!important] Підсумок
> - У App Router усе серверне за замовчуванням. Server Component виконується лише на сервері (запит або `next build`), і його код не йде в браузер.
> - Client Component виконується **і на сервері** (HTML), **і в браузері** (hydration); при навігації — лише в браузері з RSC payload.
> - `'use client'` — межа в графі модулів: усе, що імпортує клієнтський файл, стає клієнтським. Став межу на найменшому інтерактивному листку.
> - Через межу проходять серіалізовані props, JSX і Server Functions (як посилання). Функції й класи — ні. Серверне в клієнтському — через `children`.
> - Секрети — лише в модулях з `import 'server-only'`. Props — публічні дані, тож передавай DTO; непублічна змінна в Client Component потрапляє у вихідний HTML.

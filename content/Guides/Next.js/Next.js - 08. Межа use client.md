---
title: Межа use client
id: nextjs-core-08
slug: 08-use-client-boundary
order: 8
level: middle
skill: rendering
icon: px:door
tags: [nextjs, rsc, use-client, serialization, server-only, bundle, import-trace]
prerequisites: ["[[Next.js - 07. Server і Client Components]]"]
estimatedMinutes: 55
nextVersion: 16.3.8
---

# Межа use client

> [!success] 🎯 Після цього розділу ти зможеш
> - точно описати клієнтський граф модулів: точки входу, клієнтські посилання й модулі, скомпільовані двічі;
> - передбачити, що станеться з будь-яким значенням на межі: `Promise`, Server Function з `.bind`, посилання на Client Component, JSX із обробником усередині;
> - будувати композицію зі слотами замість render props і пояснити, чому render prop із сервера не працює;
> - передати серверні дані в контекст через `Promise` і `use()`, не роблячи дерево клієнтським;
> - пояснити, як `server-only`, `client-only` і умова експорту `react-server` працюють усередині, і коли потрібен `taint`;
> - знайти «зайві» кілобайти від barrel-файлів і прочитати будь-який Import trace.

## 🤔 Передбач

> [!quiz] Що покаже серверна сторінка?
> level: middle · type: output · id: nextjs-core-08-quiz-01
>
> Константу винесли у файл з `'use client'`, бо її використовує клієнтська пагінація. Тепер її читає й серверна сторінка:
>
> ```tsx
> // app/catalog/limits.ts
> 'use client'
>
> export const PAGE_SIZE = 20
> ```
>
> ```tsx
> // app/catalog/page.tsx — Server Component
> import { PAGE_SIZE } from './limits'
>
> export default function CatalogPage() {
>   return <p>[{typeof PAGE_SIZE}]</p>
> }
> ```
>
> - [x] `[function]` — сервер отримав не число, а клієнтське посилання
> - [ ] `[number]` — константа однакова в обох середовищах
> - [ ] `[undefined]` — серверний граф не бачить клієнтських модулів
> - [ ] Помилка збірки: з `'use client'`-файлу можна експортувати лише компоненти
>
> **Пояснення:** не переймайся, якщо помилився — це головна ідея розділу. Для серверного графа **кожен експорт** файлу з `'use client'` — клієнтське посилання, а не значення. На 16.3.8 збірка проходить, `typeof` дає `function`, а виклик `PAGE_SIZE()` на сервері кидає `Attempted to call PAGE_SIZE() from the server but PAGE_SIZE is on the client`. Спільні константи живуть у файлі без директиви.

## 🧒 Простими словами

Уяви кордон між двома країнами. Люди (код) перетинають його лише через пункти пропуску — це файли з `'use client'`. Хто пройшов пункт, той уже в іншій країні разом з усім, що везе з собою (усі імпорти). А вантажі (дані) їдуть окремо, вантажівкою з митною декларацією — це RSC payload. Митниця пропускає лише те, що можна описати в декларації: числа, тексти, дати, коробки з цим усім і навіть «ваучер» на посилку, яка доїде пізніше (`Promise`). Живу людину з її спогадами (функцію із замиканням) у декларацію не впишеш. Можна передати хіба що візитку — номер, за яким її знайдуть на тому боці (посилання на Server Function чи на Client Component). А деякі товари виробляють в обох країнах окремо (модуль, скомпільований двічі) — склади в них різні.

## 🔬 Як це працює насправді

Тут розберемо межу з [[Next.js - 07. Server і Client Components|теми 07]] як інженер: що бачить кожен граф, як React кодує значення, де бандлер тихо додає кілобайти і як читати помилки. Усе нижче — про Next.js 16.3.8 з `cacheComponents: true`.

### 🗺️ Два графи і точки входу

Next.js збирає застосунок щонайменше у **три середовища**, і саме їхні назви ти бачиш в Import trace:

| Середовище в trace | Що там виконується |
|---|---|
| `Server Component` | Server Components, Server Functions, усе, що вони імпортують |
| `Client Component SSR` | Client Components під час серверного рендера HTML |
| `Client Component Browser` | ті самі Client Components у браузері: hydration і подальша робота |

Два клієнтські середовища мають однаковий граф модулів, але різні бандли: для Node.js і для браузера.

**Точка входу в клієнт** — файл з `'use client'`, який імпортує модуль серверного графа. Документація Next.js формулює це так: директиву ставлять лише у файли, «whose components you want to render directly within Server Components». Якщо такий файл імпортує лише інший клієнтський модуль, директива нічого не робить — це не точка входу, а звичайний модуль клієнтського графа.

Серверний модуль, що імпортує точку входу, отримує **не код, а клієнтське посилання** (client reference) на кожен експорт: функцію-обʼєкт з `$$typeof: Symbol.for('react.client.reference')`, ідентифікатором модуля й назвою експорту. З посиланням можна зробити дві речі:

1. **відрендерити** як компонент: `<Modal />` — React запише в payload «тут Client Component з такого-то чанка»;
2. **передати** як prop іншому Client Component — бо посилання серіалізується.

Будь-що інше — викликати, читати поля, рахувати — не має сенсу: на сервері там немає значення. Звідси відповідь на 🤔: `PAGE_SIZE` для сервера — посилання, `typeof` повертає `function`, а `String(PAGE_SIZE)` на 16.3.8 показує тіло заглушки, що кидає `Attempted to call PAGE_SIZE() from the server but PAGE_SIZE is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.`

React формулює правило в документації `'use client'`: значення, які серверний модуль імпортує з клієнтського, мають бути або компонентами, або serializable props для Client Component. Практичний висновок: **з `'use client'`-файлу експортуй лише компоненти** (і хуки для інших клієнтських модулів). Константи, типи, схеми валідації й утиліти — у модуль без директиви. Тоді кожне середовище отримає справжнє значення.

> [!quiz] Перевір себе: що з цього — точки входу в клієнт?
> level: middle · type: multi · id: nextjs-core-08-quiz-02
>
> ```text
> app/page.tsx          без директиви   імпортує: ./ui/toolbar, ./ui/chart, @/lib/format
> app/ui/toolbar.tsx    'use client'    імпортує: ./menu, @/lib/format
> app/ui/menu.tsx       'use client'
> app/ui/chart.tsx      'use client'    імпортує: chart-lib
> lib/format.ts         без директиви
> ```
>
> - [x] `app/ui/toolbar.tsx`
> - [x] `app/ui/chart.tsx`
> - [ ] `app/ui/menu.tsx` — у ньому ж є директива
> - [ ] `lib/format.ts` — його імпортує клієнтський `toolbar.tsx`
> - [ ] `app/page.tsx` — він імпортує клієнтські файли
>
> **Пояснення:** точка входу — клієнтський файл, імпортований **із серверного графа**. `menu.tsx` імпортує тільки клієнтський `toolbar.tsx`, тож його директива нічого не змінює (її можна прибрати, хіба що меню колись імпортуватиме сервер). `lib/format.ts` — у клієнтському графі, але як звичайний модуль. Сторінка лишається серверною.

### 🧬 Модулі, скомпільовані двічі

Модуль без директиви, який імпортують і сервер, і клієнт, Next.js компілює **окремо для кожного середовища**. Це не «один файл у двох місцях», а різні екземпляри модуля з власним станом рівня модуля. Перевіримо модулем, що рахує виклики:

```ts
// lib/track.ts — модуль без директиви: його імпортують і сервер, і клієнт
const calls: string[] = []

export function track(who: string) {
  calls.push(who)
  return `${who}: ${calls.length} виклик(и) в цьому екземплярі модуля [${calls.join(', ')}]`
}
```

```tsx
// app/dashboard/page.tsx
import { track } from '@/lib/track'
import { ClientProbe } from './client-probe'

export default function TwicePage() {
  const fromServer = track('server')
  console.log(fromServer)
  return (
    <>
      <p>{fromServer}</p>
      <ClientProbe />
    </>
  )
}
```

```tsx
// app/dashboard/client-probe.tsx
'use client'

import { track } from '@/lib/track'

export function ClientProbe() {
  const fromClient = track(typeof window === 'undefined' ? 'ssr' : 'browser')
  console.log(fromClient)
  return <p suppressHydrationWarning>{fromClient}</p>
}
```

`next build` виводить `server: 1 … [server]` і окремо `ssr: 1 … [ssr]`, хоча обидва виклики сталися в **одному процесі** Node.js. Під час збірки сторінка рендериться ще раз у тих самих екземплярах, тож далі йдуть `server: 2 … [server, server]` і `ssr: 2 … [ssr, ssr]` — це й потрапляє в готовий HTML. Лічильники ростуть кожен окремо й ніколи не змішуються, а в браузері буде третій екземпляр (`suppressHydrationWarning` — бо текст навмисно різний).

> [!diagram] Один файл — три екземпляри модуля
> ```yaml
> layout: nest
> nodes:
>   - { id: node, label: "процес Node.js", text: "сервер", tone: gray, icon: "px:server" }
>   - { id: rsc, label: "Server Component", text: "lib/track.ts #1", note: "calls = ['server']", parent: node, tone: blue }
>   - { id: ssr, label: "Client Component SSR", text: "lib/track.ts #2", note: "calls = ['ssr']", parent: node, tone: violet }
>   - { id: br, label: "Client Component Browser", text: "lib/track.ts #3", note: "calls = ['browser']", tone: orange, icon: "px:monitor" }
> steps:
>   - { show: node, note: "Next.js рендерить сторінку в одному процесі Node.js, але в ньому живуть дві модульні системи." }
>   - { show: rsc, note: "Server Component TwicePage імпортує lib/track.ts зі свого графа і кладе в масив 'server'." }
>   - { show: ssr, note: "ClientProbe рендериться для HTML у клієнтському SSR-графі. Там свій lib/track.ts: масив порожній, тепер у ньому 'ssr'." }
>   - { show: br, note: "У браузері модуль виконується втретє, під час hydration. Жоден екземпляр не бачить стану інших." }
> ```
> Стан рівня модуля не перетинає межу. Серверні дані потрапляють у Client Component лише через props.

Що з цього випливає на практиці:

- **Синглтони не спільні.** Клієнт БД, кеш у `Map`, store на рівні модуля — у серверному графі один, у SSR-графі інший. Store, створений на рівні модуля в клієнтському графі, на сервері ще й **спільний для всіх запитів**: дані одного користувача можуть потрапити в HTML іншого. Тому клієнтські store (Zustand, Redux) створюють у провайдері на кожен запит, а не на рівні модуля.
- **`React.cache` працює тільки в серверному графі.** Він дедуплікує виклики в межах одного серверного рендера. У Client Component ця дедуплікація не працює.
- **Код подвоюється.** Якщо клієнту потрібна одна дрібна функція з великого модуля, винеси її в окремий файл.
- **`typeof window` не визначає граф.** У SSR-екземплярі `window` теж немає. Перевірка каже «я зараз не в браузері», а не «я Server Component».

> [!quiz] Що виведе next build?
> level: middle · type: output · id: nextjs-core-08-quiz-03
>
> `lib/counter.ts` (без директиви) містить `let n = 0; export const next = () => ++n`. Серверна сторінка під час рендера викликає `next()` і рендерить `<Badge />` з `'use client'`, який теж викликає `next()` у тілі компонента. Обидва логують отримане число. Що покажуть логи `next build`?
>
> - [x] Сторінка й `Badge` рахують кожен свої виклики (`1`, потім `2` на повторному рендері збірки) — лічильники не змішуються
> - [ ] Числа йдуть підряд: сторінка — `1`, `Badge` — `2`, далі `3` і `4`: один процес, один модуль
> - [ ] Лише сторінка: Client Component не рендериться під час збірки
> - [ ] Помилка збірки: модуль зі станом не можна імпортувати з обох графів
>
> **Пояснення:** сервер і SSR-рендер Client Components використовують різні екземпляри модуля, навіть в одному процесі. `next build` рендерить статичну сторінку двічі в тих самих екземплярах, тож кожен лічильник доходить до `2`, але жоден не бачить викликів іншого. Спільний «глобальний» стан між графами — ілюзія.

### 🧳 Серіалізація: що й як їде в payload

У [[Next.js - 07. Server і Client Components|темі 07]] була коротка таблиця. Ось повна картина за документацією React (`'use client'` → *Serializable types*), з тим, як це кодується на 16.3.8.

| Значення | Як проходить | Що отримує Client Component |
|---|---|---|
| примітиви, `Symbol.for(...)` | значенням | те саме значення |
| масиви, `Map`, `Set`, typed arrays, `ArrayBuffer` | вміст серіалізується вглиб | нові екземпляри того самого типу |
| `Date` | у payload рядок з позначкою `$D` | справжній `Date` |
| прості обʼєкти | вглиб, кожне поле | новий простий обʼєкт |
| `Promise` | посилання `$@N`, значення доїде пізніше тим самим потоком | `Promise`, який читають через `use()` |
| JSX-елемент | дерево елементів, Server Components уже відрендерені | готовий вивід |
| Server Function | посилання на дію + зашифровані захоплені змінні | функція-проксі, яка робить запит на сервер |
| Client Component (функція з `'use client'`-модуля) | клієнтське посилання | справжній компонент |

Непідтримуване не змінилось: звичайні функції, класи та їхні екземпляри, обʼєкти з `null`-прототипом, незареєстровані символи. Позначки `$D`, `$@` — деталь реалізації протоколу Flight, на неї не можна покладатися, але вона допомагає читати payload у вкладці Network.

#### Promise як prop і use()

Server Component не мусить чекати дані, щоб віддати UI. Запусти запит **без `await`** і передай проміс у Client Component:

```tsx
// app/product/page.tsx
import { Suspense } from 'react'
import { Reviews } from './reviews'

type Review = { id: string; text: string; createdAt: Date }

async function getReviews(): Promise<Review[]> {
  await new Promise((r) => setTimeout(r, 300))
  return [{ id: 'r1', text: 'Чудова клавіатура', createdAt: new Date('2026-01-01T00:00:00Z') }]
}

export default function ProductPage() {
  const reviewsPromise = getReviews() // ❗ без await: запит стартує на сервері
  return (
    <main>
      <h1>Клавіатура</h1>
      <Suspense fallback={<p>Вантажимо відгуки…</p>}>
        <Reviews reviewsPromise={reviewsPromise} />
      </Suspense>
    </main>
  )
}
```

```tsx
// app/product/reviews.tsx
'use client'

import { use } from 'react'

type Review = { id: string; text: string; createdAt: Date }

export function Reviews({ reviewsPromise }: { reviewsPromise: Promise<Review[]> }) {
  const reviews = use(reviewsPromise) // suspend, доки проміс не резолвиться
  return (
    <ul>
      {reviews.map((r) => (
        <li key={r.id}>
          {r.text} · {r.createdAt instanceof Date ? 'Date' : typeof r.createdAt}
        </li>
      ))}
    </ul>
  )
}
```

На 16.3.8 маршрут позначено `◐` (Partial Prerender): заголовок у static shell, відгуки стрімляться. HTML спершу містить `Вантажимо відгуки…`, у payload prop виглядає як `"reviewsPromise":"$@7"`, а коли проміс резолвиться, той самий потік доносить `"createdAt":"$D2026-01-01T00:00:00.000Z"`. Компонент показує `Date`: значення **всередині** промісу серіалізується за тими самими правилами.

> [!note] Чому сторінкам з даними потрібен loading.tsx / Suspense
> З `cacheComponents: true` незакешований I/O (тут — `setTimeout`, що імітує запит) поза `<Suspense>` зупинив би збірку. Тому `Reviews` загорнуто в `<Suspense>`; докладно — у темах 11–12, 14–16.

Перевага над `useEffect` + `fetch`: запит стартує на сервері ще до завантаження JS, без водоспаду й API-маршруту. Дві умови. Значення, яким резолвиться проміс, мусить бути серіалізованим: перевірка відбувається не при передачі промісу, а пізніше, коли він резолвиться. І відхилений проміс React передає на клієнт як помилку: `use()` кине її до найближчої межі помилок. Стрімінг і `Suspense` докладно — у [[Next.js - 11. Streaming і Suspense|темі 11]].

#### Server Function: посилання з багажем

Server Function перетинає межу як посилання, але з «багажем»: змінні замикання inline-дії й аргументи `.bind(null, id)`. Вони їдуть через клієнт і назад, тож **мусять бути серіалізованими**. Захоплені змінні inline-дії Next.js шифрує (ключ нового білда або `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`), але документація Data Security прямо застерігає не покладатися лише на шифрування. Секрет не має потрапляти в замикання дії взагалі. Аргументи `.bind` не шифруються, а клієнт може підмінити будь-який аргумент, тож усередині дії перевіряй права заново. Дії — тема 21 основного посібника.

#### Client Component як prop

Найменш відома рядок таблиці: функцію **можна** передати через межу, якщо це експорт `'use client'`-модуля. Для сервера це вже клієнтське посилання, тож воно серіалізується:

```tsx
// app/catalog/page.tsx
import { List, ProductRow } from './list'

export default function ClientRefPage() {
  const items = [
    { id: 'p1', title: 'Клавіатура' },
    { id: 'p2', title: 'Мишка' },
  ]
  // ProductRow — функція, але експортована з 'use client'-модуля: це клієнтське посилання
  return <List items={items} Row={ProductRow} />
}
```

```tsx
// app/catalog/list.tsx
'use client'

import { useState, type ComponentType } from 'react'

type Item = { id: string; title: string }

export function ProductRow({ item, selected }: { item: Item; selected: boolean }) {
  return <li>{selected ? '✅ ' : ''}{item.title}</li>
}

export function List({ items, Row }: { items: Item[]; Row: ComponentType<{ item: Item; selected: boolean }> }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  return (
    <ul>
      {items.map((item) => (
        <div key={item.id} onClick={() => setSelectedId(item.id)}>
          <Row item={item} selected={item.id === selectedId} />
        </div>
      ))}
    </ul>
  )
}
```

Збірка проходить, HTML містить `<li>Клавіатура</li><li>Мишка</li>`. Це патерн «серверна сторінка обирає, **який** клієнтський компонент рендерити, а клієнт — **з якими** props». Він знадобиться нижче, замість render props.

> [!quiz] Перевір себе: що пройде через межу?
> level: middle · type: multi · id: nextjs-core-08-quiz-04
>
> Server Component рендерить `<Widget … />` з `'use client'`. Які props серіалізуються без помилки?
>
> - [x] `dataPromise={getData()}`, якщо `getData()` резолвиться простим обʼєктом
> - [x] `Icon={StarIcon}`, де `StarIcon` експортовано з файлу з `'use client'`
> - [x] `saveAction={save.bind(null, 'p1')}`, де `save` — Server Function
> - [ ] `Icon={StarIcon}`, де `StarIcon` — компонент без директиви з серверного файлу
> - [ ] `dataPromise={getData()}`, якщо `getData()` резолвиться екземпляром класу `Money`
> - [ ] `format={(n) => n.toFixed(2)}`
>
> **Пояснення:** проміс серіалізується, але його значення перевіряють при резолві, тож `Money` впаде пізніше. Посилання на клієнтський компонент і привʼязана Server Function — серіалізовані посилання. Компонент без директиви, переданий **як функція** (не як `<StarIcon />`), — звичайна функція: `Functions cannot be passed directly to Client Components`.

### 🧩 JSX через межу: слоти так, render props ні

Елемент `<Cart />` — це **дані**: обʼєкт `{ $$typeof, type, props }`. Тому JSX проходить межу, а React дорендерює серверні частини на сервері. `children` — лише один з таких props. Клієнтський компонент може мати скільки завгодно «слотів»:

```tsx
// app/mail/split-view.tsx
'use client'

import { useState, type ReactNode } from 'react'

export function SplitView({ sidebar, toolbar, children }: { sidebar: ReactNode; toolbar: ReactNode; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ display: 'flex' }}>
      {!collapsed && <aside>{sidebar}</aside>}
      <main>
        <button onClick={() => setCollapsed(!collapsed)}>{collapsed ? '»' : '«'}</button>
        {toolbar}
        {children}
      </main>
    </div>
  )
}
```

```tsx
// app/mail/page.tsx — три «слоти», усі заповнює сервер
import { SplitView } from './split-view'

async function Folders() {
  const folders = ['Вхідні', 'Надіслані'] // дані з БД
  return <ul>{folders.map((f) => <li key={f}>{f}</li>)}</ul>
}

export default function MailPage() {
  return (
    <SplitView sidebar={<Folders />} toolbar={<h1>Пошта</h1>}>
      <p>Оберіть лист</p>
    </SplitView>
  )
}
```

`Folders` — async Server Component, і він спокійно живе в слоті клієнтського компонента. `SplitView` отримує **готовий вивід**: може показати, сховати чи переставити його, але не передати йому нові props. При перемиканні `collapsed` `Folders` не рендериться знову.

Тепер типова спроба з бібліотек таблиць і списків — **render prop**: клієнтська таблиця сортує рядки, а сторінка каже, як намалювати рядок.

```tsx
// app/products/page.tsx — ❌ render prop із Server Component
import { DataTable } from './table'

export default function Page() {
  const rows = [{ id: 'p1', title: 'Мишка' }, { id: 'p2', title: 'Клавіатура' }]
  return <DataTable rows={rows} renderRow={(row) => <li key={row.id}>{row.title}</li>} />
}
```

`next dev` на 16.3.8:

```text
⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  <... rows={[...]} renderRow={function renderRow}>
                              ^^^^^^^^^^^^^^^^^^^^
```

Render prop — функція, яку **клієнт** викличе пізніше з даними, яких сервер не знає (новий порядок). Для цього треба переслати код і замикання, а RSC цього не вміє. Слот працює навпаки: сервер **уже** викликав рендер, і клієнту дістається результат. Порада з помилки «Or maybe you meant to call this function» — саме про це: виклич на сервері й передай вивід.

Як переробити, залежно від того, що потрібно клієнту:

1. **Рядок чисто презентаційний** — нехай сервер відрендерить рядки й передасть масив елементів (`rows={rows.map((r) => <Row key={r.id} … />)}`). Клієнт може їх переставляти за ключами, але не перемальовувати з новими даними.
2. **Рядок залежить від клієнтського стану** (виділення, редагування) — передай **посилання на Client Component**: `Row={ProductRow}`, як у прикладі вище. Клієнт сам рендерить його з потрібними props.
3. **Логіка рендера справді довільна** — перенеси і таблицю, і `renderRow` в один клієнтський модуль. Сторінка передає тільки дані.

> [!diagram] Слот проти render prop
> ```yaml
> layout: compare
> columns: { bad: "❌ Render prop", good: "✅ Слот або посилання" }
> nodes:
>   - { id: b1, col: bad, label: "page.tsx (Server)", code: "renderRow={(row) => <li>…</li>}", tone: blue }
>   - { id: b2, col: bad, label: "RSC payload", text: "функція = код + замикання", note: "серіалізувати неможливо", tone: red, icon: "px:warning" }
>   - { id: b3, col: bad, label: "DataTable (Client)", text: "мав би викликати renderRow", note: "Functions cannot be passed directly", tone: orange }
>   - { id: g1, col: good, label: "page.tsx (Server)", code: "sidebar={<Folders />}\nRow={ProductRow}", tone: blue }
>   - { id: g2, col: good, label: "RSC payload", text: "готовий вивід + клієнтське посилання", note: "усе серіалізується", tone: green, icon: "px:check" }
>   - { id: g3, col: good, label: "SplitView / List (Client)", text: "ставить вивід, рендерить Row", note: "з власним станом", tone: orange }
> steps:
>   - { show: [b1, g1], note: "Сторінка хоче, щоб клієнтський компонент показав щось серверне. Ліворуч вона передає функцію, праворуч — результат або посилання." }
>   - { show: [b2, g2], note: "Ліворуч у payload треба записати код із замиканням — неможливо. Праворуч — дерево елементів і посилання на клієнтський модуль." }
>   - { show: [b3, g3], note: "Ліворуч рендер падає ще на сервері. Праворуч клієнт ставить готовий вивід у слот або сам рендерить Row із клієнтськими props." }
> ```
> Слот — «ось результат». Render prop — «ось інструкція, виконай сам». Через межу проходить лише результат.

> [!quiz] Перевір себе: як виправити render prop?
> level: middle · id: nextjs-core-08-quiz-05
>
> Клієнтський `SortableList` сортує елементи й підсвічує вибраний. Серверна сторінка передає `renderItem={(item, selected) => <Card item={item} selected={selected} />}` і падає з `Functions cannot be passed directly to Client Components`. `Card` — простий презентаційний компонент. Як виправити найкраще?
>
> - [ ] Позначити стрілочну функцію `'use server'`
> - [x] Перенести `Card` у клієнтський модуль і передати посилання: `Item={Card}`; `SortableList` рендерить `<Item item={…} selected={…} />`
> - [ ] Передати `items={items.map((i) => <Card item={i} selected={false} />)}`
> - [ ] Додати `'use client'` у сторінку
>
> **Пояснення:** `selected` відомий лише на клієнті, тож готовий вивід із сервера (третій варіант) не перемалюється при виборі. `'use server'` зробив би з неї асинхронну дію з мережевим запитом, а не рендер. Директива на сторінці «лікує» ціною всього серверного дерева. Посилання на клієнтський `Card` серіалізується, і клієнт сам рендерить його з поточним станом.

### 🎛️ Контекст через межу

У темі 07 основного посібника був базовий патерн: клієнтський провайдер приймає `children` і обгортає серверні сторінки. Дві глибші речі.

**Server Components під провайдером контекст не бачать.** `children` провайдера рендеряться на сервері незалежно від нього; контекст читають лише Client Components нижче. Серверний компонент бере ту саму інформацію з джерела: `cookies()` або функція даних з `React.cache`.

**Серверні дані в контекст — через Promise.** Якщо layout зробить `await getUser()`, він блокує весь сегмент з усіма `children`. Краще стартувати запит і передати **проміс** у провайдер, а споживачі розгорнуть його через `use()`:

```ts
// app/account/user.ts
import 'server-only'
import { cache } from 'react'

export type SessionUser = { id: string; name: string }

export const getSessionUser = cache(async (): Promise<SessionUser> => {
  await new Promise((r) => setTimeout(r, 200)) // імітація запиту до БД
  return { id: 'u1', name: 'Оля' }
})
```

```tsx
// app/account/user-provider.tsx
'use client'

import { createContext, use, type ReactNode } from 'react'
import type { SessionUser } from './user'

const UserContext = createContext<Promise<SessionUser> | null>(null)

export function UserProvider({ userPromise, children }: { userPromise: Promise<SessionUser>; children: ReactNode }) {
  return <UserContext value={userPromise}>{children}</UserContext>
}

export function useUser() {
  const promise = use(UserContext)
  if (!promise) throw new Error('useUser() викликано поза <UserProvider>')
  return use(promise) // suspend до резолву
}
```

```tsx
// app/account/layout.tsx — Server Component
import { Suspense } from 'react'
import { getSessionUser } from './user'
import { UserProvider } from './user-provider'
import { Greeting } from './greeting'

export default function CtxLayout({ children }: LayoutProps<'/account'>) {
  const userPromise = getSessionUser() // без await: layout не блокується
  return (
    <UserProvider userPromise={userPromise}>
      <header>
        <Suspense fallback={<p>…</p>}>
          <Greeting />
        </Suspense>
      </header>
      {children}
    </UserProvider>
  )
}
```

```tsx
// app/account/greeting.tsx
'use client'

import { useUser } from './user-provider'

export function Greeting() {
  const user = useUser()
  return <p>Привіт, {user.name}!</p>
}
```

Зверни увагу на деталі. `user-provider.tsx` імпортує з `user.ts` **лише тип** (`import type`), тож `server-only` не потрапляє в клієнтський граф: `import type` стирається під час компіляції гарантовано, і збірка проходить. Імпорт значення з `user.ts` уже зупинив би її. `use()` читає і контекст, і проміс. Сторінка під провайдером лишилась серверною. На 16.3.8 маршрут — `◐`: shell з `…`, привітання стрімиться.

Застереження документації: перезапит промісу перезапускає Server Component, що його створив, тож провайдер став на піддереві, якому дані потрібні, а не в root layout.

> [!quiz] Перевір себе: заповни пропуски в провайдері з промісом
> level: middle · type: fill · bank: await, useContext, 'use server' · id: nextjs-core-08-quiz-06
>
> ```tsx fill
> // app/cart-provider.tsx
> 'use client'
>
> import { createContext, use, type ReactNode } from 'react'
>
> type Cart = { count: number }
> const CartContext = createContext<[[Promise]]<Cart> | null>(null)
>
> export function CartProvider({ cartPromise, children }: { cartPromise: Promise<Cart>; children: ReactNode }) {
>   return <CartContext value={[[cartPromise]]}>{children}</CartContext>
> }
>
> export function useCart() {
>   const promise = [[use]](CartContext)
>   if (!promise) throw new Error('useCart() поза <CartProvider>')
>   return [[use]](promise)
> }
> ```
>
> **Пояснення:** у контексті лежить сам проміс, а не дані: layout передає його без `await`, тож не блокує сегмент. `use()` читає і контекст, і проміс (`useContext` теж прочитав би контекст, але проміс розгорне лише `use`). `await` у тілі Client Component неможливий: async Client Components не підтримуються.

### 🧪 server-only, client-only і умова react-server

У темі 07 основного посібника `import 'server-only'` був чорною скринькою: «зупиняє збірку». Подивимось усередину. Пакет `server-only` (і його копія в `next/dist/compiled/server-only`) — **маркер** з двома файлами й мапою `exports`:

```json
{
  "name": "server-only",
  "exports": {
    ".": {
      "react-server": "./empty.js",
      "default": "./index.js"
    }
  }
}
```

`empty.js` порожній, а `index.js` кидає `This module cannot be imported from a Client Component module. It should only be used from a Server Component.` Механізм — **умова експорту** (export condition) `react-server`. Бандлер серверного графа резолвить пакети з умовою `react-server`, а клієнтські графи — без неї. У серверному графі імпорт нічого не робить. У клієнтському підставляється файл, що кидає помилку. `client-only` — дзеркало: `react-server` → `error.js`, `default` → порожній `index.js`.

Next.js не покладається на вміст npm-пакетів (документація: «The contents of these packages from NPM are not used by Next.js»). Він сам підміняє обидва імпорти для кожного графа (у webpack-конфігурації — `next/dist/build/create-compiler-aliases.js`; Turbopack робить те саме у своєму коді) і замість падіння під час виконання видає помилку **збірки** з Import trace. Тому пакет можна навіть не встановлювати.

Ось як виглядає `client-only` у серверному графі (`next dev` 16.3.8, `lib/storage.ts` з `import 'client-only'` імпортує серверна сторінка):

```text
Error: You're importing a component that imports client-only. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.

Import trace:
  Server Component:
    ./lib/storage.ts
    ./app/drafts/page.tsx

Error: 'client-only' cannot be imported from a Server Component module
It should only be used from a Client Component.
```

**Для авторів бібліотек** умова `react-server` — офіційний інструмент мати дві реалізації одного пакета. React сам ним користується: `react/package.json` має `"react-server": "./react.react-server.js"`, і в серверній збірці React просто немає `useState`. Звідси помилка `You're importing a module that depends on useState into a React Server Component module`. Перевіримо на власному пакеті:

```json
{
  "name": "acme-cond",
  "types": "./index.d.ts",
  "exports": {
    ".": { "types": "./index.d.ts", "react-server": "./server.js", "default": "./client.js" }
  }
}
```

`server.js` експортує `flavor = 'react-server'`, `client.js` — `flavor = 'default'`. Серверна сторінка рендерить `Server Component: react-server`, а Client Component на тій самій сторінці — `Client Component: default`, **і в SSR-HTML теж**. Так бібліотека віддає серверним компонентам версію без хуків, а клієнтським — інтерактивну.

> [!note] Умова react-server у документації Next.js
> Сторінка [Server and Client Components → Preventing environment poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning) описує лише імпорт `server-only` / `client-only`. На Next.js 16.3.8 (Turbopack) серверний граф резолвить умову `react-server`, а обидва клієнтські середовища (SSR і браузер) — `default`; на цій умові побудовані `package.json` пакетів `react`, `react-dom` і `server-only`.

Правило для автора пакета: клієнтські точки входу — з `'use client'` (бандлер пакета не повинен її вирізати), серверно-безпечні — окремо без директиви, а код, що різниться між графами, — через `react-server`.

> [!quiz] Перевір себе: що отримає кожен компонент?
> level: senior · id: nextjs-core-08-quiz-07
>
> Пакет `acme-icons` має `exports: { ".": { "react-server": "./static.js", "default": "./interactive.js" } }`. Серверна сторінка імпортує `Icon` з пакета й рендерить також `<Toolbar />` (`'use client'`), який теж імпортує `Icon`. Яку реалізацію отримає `Toolbar` у серверному HTML при першому заході?
>
> - [ ] `static.js` — HTML будується на сервері, отже, умова `react-server`
> - [x] `interactive.js` — SSR Client Components іде в клієнтському графі, без умови `react-server`
> - [ ] `static.js` на сервері й `interactive.js` у браузері — це і є hydration
> - [ ] Помилка збірки: пакет з двома реалізаціями не можна імпортувати з обох графів
>
> **Пояснення:** умова визначається графом, а не машиною. Client Component і на сервері рендериться у клієнтському графі, тож отримує `default`. Інакше HTML і hydration розійшлися б. `static.js` бачить лише серверна сторінка.

### 🧷 server-only проти taint

`server-only` і Taint API захищають від різних помилок, і їх легко сплутати.

| | `import 'server-only'` | `taint` (React, **experimental**) |
|---|---|---|
| Що позначає | **модуль** (код) | **значення** або **обʼєкт** під час виконання |
| Коли спрацьовує | під час збірки, з Import trace | під час рендера, коли значення йде в Client Component |
| Від чого захищає | серверний код у клієнтському бандлі | конкретні дані в RSC payload |
| Як увімкнути | просто імпорт | `experimental: { taint: true }` у `next.config.ts` (вмикає й experimental-канал React) |
| Слабкість | не бачить даних: секрет у props пройде | лише за посиланням: копія обʼєкта незахищена |

Перевіримо taint на 16.3.8. Функція даних позначає обʼєкт користувача й токен:

```tsx
// app/team/page.tsx
import { experimental_taintObjectReference, experimental_taintUniqueValue } from 'react'
import { UserCard } from './card'

function getUser() {
  const user = { name: 'Оля', passwordHash: '$argon2id$secret', apiToken: 'tok_live_123' }
  experimental_taintObjectReference('Не передавай весь обʼєкт користувача — збери DTO', user)
  experimental_taintUniqueValue('API-токен не можна передавати клієнту', user, user.apiToken)
  return user
}
```

Результати в `next dev`:

- `<UserCard user={user} />` → 500 і `⨯ Error: Не передавай весь обʼєкт користувача — збери DTO`;
- `<UserCard user={{ name: user.apiToken }} />` → 500 і `⨯ Error: API-токен не можна передавати клієнту` (рядок відстежується, хоч і в новому обʼєкті);
- `const { apiToken, ...rest } = user` і `<UserCard user={rest} />` → **200**, і `$argon2id$secret` лежить у HTML. Копія обʼєкта вже не позначена, а хеш пароля окремо ніхто не позначав.

Останній рядок і є суть: документація `taint` прямо каже «Do not rely on the taint API as your only mechanism». Основний захист — DTO білим списком у шарі даних з `server-only` (тема 07 основного посібника), taint — страховка, коли форму даних визначаєш не ти (SDK, ORM). Він ще й позначає обʼєкт `process.env`, але окрема `process.env.MY_VAR` рядком проходить.

Зі змінними середовища на межі залишається пастка з теми 07 основного посібника: непублічна змінна, прочитана в **Client Component**, не потрапляє в чанк, але потрапляє в SSR-HTML ([[Next.js - 07. Server і Client Components#🔐 Секрети, env і server-only|розбір у темі 07]]). Причина — SSR-екземпляр клієнтського модуля виконується в Node.js з повним `process.env`; ні `server-only`, ні `taint` тут не допоможуть.

> [!quiz] Перевір себе: що зупинить витік?
> level: senior · id: nextjs-core-08-quiz-08
>
> Сторонній SDK повертає обʼєкт `account` з полем `stripeSecret`. Розробник передає `<AccountCard account={{ ...account }} />`. Увімкнено `experimental.taint`, а обгортка SDK викликає `experimental_taintObjectReference(…, account)`. Що станеться?
>
> - [ ] Помилка: обʼєкт позначено
> - [x] Рендер пройде, `stripeSecret` потрапить у payload: розгорнута копія — новий обʼєкт
> - [ ] Помилка збірки, бо файл SDK має `import 'server-only'`
> - [ ] Рендер пройде, але React приховає позначені поля
>
> **Пояснення:** `taintObjectReference` стежить лише за посиланням, а `{ ...account }` — копія. Захистило б `experimental_taintUniqueValue` на самому `stripeSecret` (рядок відстежується в будь-якому обʼєкті) або, краще, DTO без цього поля. `server-only` про модулі, а не про дані.

### 📚 Сторонні компоненти: обгортки глибше

До рецепта з теми 07 основного посібника (`'use client'; export { Carousel } from 'acme-carousel'`) додай два правила. Складені компоненти (`Tabs.Panel`) реекспортуй **іменовано**: `export const TabsPanel = Tabs.Panel` у файлі з `'use client'`, бо статичне поле посилання на сервері — `undefined`. І не пиши обгортку «все з пакета» (`'use client'; export * from 'ui-kit'`): кожен експорт, зокрема утиліти й константи, стане клієнтським посиланням — та сама проблема, що з `PAGE_SIZE` у 🤔.

### 🛢️ Barrel-файли і зайві кілобайти

Barrel — файл, що лише реекспортує інші (`components/index.ts`). Бандлер мусить зрозуміти, що невикористані модулі barrel-а можна викинути. Перевіримо на 16.3.8. У `lib/ui/` два клієнтські компоненти: `TinyButton` (кілька рядків) і `HeavyChart`, що імпортує 200 КБ даних. Сторінка імпортує з barrel-а тільки `TinyButton`.

Що опиняється в `.next/static/chunks`:

| Варіант | Чи потрапив `HeavyChart` у клієнтські чанки |
|---|---|
| звичайний barrel, модулі без побічних ефектів | ні — Turbopack викинув невикористаний реекспорт (чанк з кнопкою ~0,4 КБ) |
| barrel з `'use client'` і `export *` | ні — так само |
| у `heavy-chart.tsx` є побічний ефект рівня модуля | **так** — чанк з кнопкою важить ~200 КБ |

Побічний ефект — будь-який код, що виконується при імпорті, а не лише при виклику: реєстрація в глобальному реєстрі, `import './chart.css'`, ініціалізація бібліотеки, присвоєння в `globalThis`:

```tsx
// lib/ui/heavy-chart.tsx
'use client'

import { HEAVY } from '../heavy-data'

// побічний ефект рівня модуля: бандлер не може викинути модуль
;(globalThis as Record<string, unknown>).__chartRegistry = HEAVY.length

export function HeavyChart() {
  return <pre>{HEAVY.length}</pre>
}
```

Бандлер не може довести, що рядок не потрібен, і тягне модуль з усіма імпортами. У npm-пакетах barrel-и з побічними ефектами або без `"sideEffects": false` — звична річ. Тому:

- у власному коді імпортуй з конкретного файлу (`@/lib/ui/tiny-button`) там, де barrel тягне важке, і тримай модулі без побічних ефектів;
- для npm-пакетів з багатьма експортами є **experimental** `optimizePackageImports` у `next.config.ts`. Частину популярних бібліотек Next.js оптимізує сам;
- **вимірюй**, а не вгадуй.

Вимірювати можна двома способами. Швидкий — після `next build` знайти рядок-маркер у `.next/static/chunks/*` і подивитися розмір файлу. Повний — аналізатор Turbopack (**experimental**, з 16.1): команда `next experimental-analyze` на 16.3.8 існує, сама будує застосунок для аналізу (без артефактів для деплою) і відкриває інтерфейс на порту 4000. Там можна фільтрувати за маршрутом і середовищем (client/server) і бачити повний ланцюжок імпортів до кожного модуля. З `--output` результат записується в `.next/diagnostics/analyze` — його зручно зберегти до й після рефакторингу.

> [!quiz] Скільки кілобайтів отримає браузер?
> level: senior · type: output · id: nextjs-core-08-quiz-09
>
> `components/index.ts`: `export { Button } from './button'` і `export { Editor } from './editor'`. Обидва файли з `'use client'`. `editor.tsx` першим рядком після директиви робить `import 'monaco-editor/esm/vs/editor/editor.main'` (реєструє мови, ~2 МБ). Сторінка: `import { Button } from '@/components'`. Що буде в клієнтських чанках сторінки?
>
> - [ ] Лише `Button`: невикористані реекспорти завжди викидаються
> - [x] `Button` і код Monaco: побічний імпорт не дає викинути `editor.tsx`
> - [ ] Лише `Button`, але Monaco потрапить у серверний бандл
> - [ ] Помилка збірки: barrel не може реекспортувати клієнтські компоненти
>
> **Пояснення:** імпорт заради побічного ефекту (`import '…'`) виконується при завантаженні модуля, тож бандлер мусить включити `editor.tsx` і все, що він тягне. Без такого імпорту Turbopack 16.3.8 викинув би `Editor`. Рішення — імпорт з `@/components/button` або `next/dynamic` для редактора.

### 🧯 Як читати Import trace

Будь-яке порушення межі в Next.js 16.3.8 супроводжується блоком `Import trace`: ланцюжок від модуля з проблемою до маршруту, **згрупований за середовищем**. Алгоритм читання:

1. **Перший рядок помилки** — що й де: файл, рядок і порушене правило (хук у серверному графі, `server-only` у клієнтському, `client-only` у серверному).
2. **Назва групи** — у якому середовищі сталося: `Server Component`, `Client Component SSR` чи `Client Component Browser`. Помилка клієнтського коду в серверному графі буде в групі `Server Component`, і навпаки.
3. **Ланцюжок знизу вгору**: нижній рядок — маршрут (`page.tsx`, `layout.tsx`), верхній — модуль з проблемою.
4. **Знайди межу.** Файл, що трапляється двічі з різними позначками (`[Server Component]` нижче, `[Client Component Browser]` вище), — точка входу. Ланка над ним — та, яку треба розірвати.
5. **Виправ ланку, а не симптом:** дані — через props, хук — в окремий файл, тип — через `import type`. Не `'use client'` на сторінці.

Приклад, коли «утиліти» реекспортують хук. `lib/use-toggle.ts` (без директиви) імпортує `useState` і, крім хука `useToggle`, визначає `slugify`. `lib/text.ts` — чистий barrel з одним рядком `export * from './use-toggle'`, а серверна сторінка бере з `lib/text.ts` лише `slugify`:

```text
⨯ ./lib/use-toggle.ts:2:10
Error: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.

Import trace:
  Server Component:
    ./lib/use-toggle.ts
    ./app/blog/page.tsx
```

Порада «mark the file (or its parent) with "use client"» тут хибна. Директива в `use-toggle.ts` зробила б `slugify` клієнтським посиланням, і `slugify('Hello World')` на сервері кинув би помилку виклику. Правильно — розділити модуль: хук в окремий файл, `slugify` — у чисту утиліту.

> [!note] Trace може пропускати barrel
> На 16.3.8 у trace вище немає `./lib/text.ts`, хоча сторінка імпортує саме його: barrel, що лише реекспортує (`export *`), Turbopack розгортає, і в ланцюжку лишається справжній модуль. Якщо `lib/text.ts` має власний код, trace його покаже. Коли модуль у trace «ніхто не імпортує», шукай чистий barrel з `export *`.

> [!quiz] Перевір себе: склади порядок налагодження помилки межі
> level: middle · type: order · id: nextjs-core-08-quiz-10
>
> ```order
> Прочитати перший рядок: який файл і яке правило порушено
> Подивитися групу trace: Server Component чи Client Component Browser
> Пройти ланцюжок знизу вгору від маршруту до проблемного модуля
> Знайти файл, що трапляється двічі з різними позначками середовища, — точку входу
> Розірвати ланку над точкою входу: дані через props, хук в окремий файл, import type
> Додати 'use client' у page.tsx, щоб помилка зникла ✗
> ```
>
> **Пояснення:** trace — карта від маршруту до порушення. Шукаєш межу, а потім одну зайву ланку над нею. Директива на сторінці не виправляє ланцюжок: вона пересуває межу вгору, і клієнтським стає все дерево.

### 🏭 Як це роблять у продакшні

- **Файли `'use client'` експортують лише компоненти;** константи, схеми й утиліти — у модулях без директиви.
- **Три шари захисту межі:** `server-only` у шарі даних (код), DTO білим списком (дані), `taint` — лише як страховка для чужих форм даних (experimental).
- **Promise замість `await` у layout** для сесії, `React.cache` у функції даних.
- **Бюджет бандла в CI:** `next experimental-analyze --output` або сума розмірів `.next/static/chunks` до й після PR з порогом на ріст.
- **Слоти в дизайн-системі:** клієнтські оболонки (`Dialog`, `Tabs`) приймають `ReactNode`, а не render props.

## ⚠️ Пастки

> [!pitfall] Константа з клієнтського файлу на сервері
> Для серверного графа кожен експорт `'use client'`-файлу — клієнтське посилання.
>
> ```tsx
> // ❌ limits.ts з 'use client' — на сервері PAGE_SIZE є функцією-посиланням
> import { PAGE_SIZE } from './limits'
> const pages = Math.ceil(total / PAGE_SIZE) // NaN
>
> // ✅ lib/limits.ts без директиви — справжнє число в обох графах
> ```

> [!pitfall] Store рівня модуля в клієнтському графі
> SSR-екземпляр модуля живе на сервері довше за один запит, тож стан рівня модуля спільний для всіх користувачів.
>
> ```tsx
> 'use client'
> export const cartStore = createStore() // ❌ один на весь сервер під час SSR
> // ✅ створювати store у провайдері: useState(() => createStore())
> ```

> [!pitfall] Render prop із Server Component
> Функцію, яку викликатиме клієнт, не серіалізувати. Передай готовий вивід у слот або посилання на Client Component.
>
> ```tsx
> <DataTable renderRow={(row) => <li>{row.title}</li>} /> // ❌ Functions cannot be passed directly
> <DataTable Row={ProductRow} /> // ✅ ProductRow експортовано з 'use client'-файлу
> ```

> [!pitfall] await у layout заради контексту
> Layout чекає дані, і весь сегмент разом з `children` чекає теж. Передай проміс, а не значення.
>
> ```tsx
> const user = await getUser() // ❌ блокує layout
> <UserProvider userPromise={getUser()}>{children}</UserProvider> // ✅ use() у споживачах
> ```

> [!pitfall] Taint на копії
> `experimental_taintObjectReference` стежить за посиланням. Spread, `structuredClone` чи `JSON.parse(JSON.stringify())` дають незахищену копію.
>
> ```tsx
> const { apiToken, ...rest } = user
> return <UserCard user={rest} /> // ❌ passwordHash у payload, taint мовчить
> ```

> [!pitfall] Barrel з побічним ефектом
> Імпорт однієї кнопки з `@/components` тягне весь модуль з побічним ефектом і його залежності. Вимірюй чанки після зміни barrel-а.
>
> ```tsx
> import { Button } from '@/components' // ❌ разом з editor.tsx і його import '…'
> import { Button } from '@/components/button' // ✅
> ```

## 🎤 На співбесіді

> [!interview] Що саме отримує Server Component, коли імпортує щось із файлу з 'use client'?
> level: middle · frequency: часто · id: nextjs-core-08-int-01
>
> ---
>
> Не код, а клієнтське посилання на кожен експорт: обʼєкт з `$$typeof: Symbol.for('react.client.reference')`, ідентифікатором модуля й назвою експорту. Його можна відрендерити як компонент або передати prop-ом іншому Client Component — React запише в payload «тут клієнтський модуль з такого чанка». Викликати чи читати його марно: для некомпонентних експортів (константи, утиліти) сервер бачить функцію-заглушку, що кидає `Attempted to call X() from the server but X is on the client`. Тому з `'use client'`-файлів експортують лише компоненти, а спільні значення тримають у модулях без директиви.
>
> 📚 [[Next.js - 08. Межа use client#🗺️ Два графи і точки входу|Розділ: два графи]] · [React: 'use client' — caveats](https://react.dev/reference/rsc/use-client#caveats) · [Next.js: use client](https://nextjs.org/docs/app/api-reference/directives/use-client)

> [!interview] Як передати серверні дані в клієнтський компонент, не блокуючи сторінку, і що при цьому серіалізується?
> level: middle · frequency: часто · id: nextjs-core-08-int-02
>
> ---
>
> Запустити запит у Server Component без `await` і передати проміс як prop (або в клієнтський провайдер контексту). Клієнт розгортає його через `use()` всередині `<Suspense>`. У payload проміс — посилання, значення доходить тим самим потоком, коли резолвиться, і серіалізується за тими ж правилами (`Date` лишається `Date`, екземпляр класу впаде вже тоді). Відхилений проміс стає помилкою для найближчого error boundary. Перевага перед `useEffect` + `fetch` — запит стартує на сервері до завантаження JS, без водоспаду і без API-маршруту. Для спільного доступу — проміс у контексті й `React.cache` у функції даних.
>
> 📚 [[Next.js - 08. Межа use client#🧳 Серіалізація: що й як їде в payload|Розділ: серіалізація]] · [Next.js: How data enters the tree](https://nextjs.org/docs/app/guides/server-and-client-boundary#how-data-enters-the-tree) · [React: use](https://react.dev/reference/react/use)

> [!interview] Чому render prop не можна передати із Server Component у Client Component, а children — можна?
> level: middle · frequency: іноді · id: nextjs-core-08-int-03
>
> ---
>
> `children` і будь-який JSX-prop — уже результат рендера, дерево елементів, яке серіалізується; серверні частини React дорендерить на сервері, клієнт отримає вивід. Render prop — функція, яку клієнт викличе пізніше з даними, яких сервер не знає; для цього треба переслати код і замикання, а RSC цього не вміє. Помилка — `Functions cannot be passed directly to Client Components`. Альтернативи: слоти з готовим виводом, посилання на клієнтський компонент (`Row={ProductRow}`, бо експорти `'use client'`-модуля серіалізуються) або перенести всю логіку рендера в клієнтський модуль.
>
> 📚 [[Next.js - 08. Межа use client#🧩 JSX через межу: слоти так, render props ні|Розділ: слоти й render props]] · [React: Serializable types](https://react.dev/reference/rsc/use-client#serializable-types)

> [!interview] Як працює import 'server-only' і чим він відрізняється від Taint API?
> level: senior · frequency: іноді · id: nextjs-core-08-int-04
>
> ---
>
> `server-only` — маркер-пакет з умовою експорту `react-server`: у серверному графі резолвиться порожній файл, у клієнтському — файл, що кидає помилку. Next.js підміняє його сам і перетворює на помилку збірки з Import trace. Він захищає **код**: модуль доступу до даних не потрапить у бандл. Taint (`experimental.taint`, experimental-канал React) захищає **значення** під час рендера: `taintObjectReference` — обʼєкт за посиланням (копія вже незахищена), `taintUniqueValue` — конкретний рядок у будь-якому обʼєкті. Жоден не замінює DTO білим списком; taint — страховка для чужих форм даних.
>
> 📚 [[Next.js - 08. Межа use client#🧷 server-only проти taint|Розділ: server-only проти taint]] · [Next.js: taint](https://nextjs.org/docs/app/api-reference/config/next-config-js/taint) · [Next.js: Preventing environment poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning)

> [!interview] Клієнтський бандл сторінки виріс на 300 КБ після «невинного» PR. Як знайдеш причину?
> level: senior · frequency: часто · id: nextjs-core-08-int-05
>
> ---
>
> Порівняти аналіз до й після: `next experimental-analyze --output` (Turbopack, experimental) пише `.next/diagnostics/analyze`, в інтерфейсі фільтр за маршрутом і середовищем client, клік по модулю показує ланцюжок імпортів. Типові причини: межа піднялась (layout замість листка), важка бібліотека в клієнтському модулі, barrel з побічним ефектом, `export *` з клієнтської обгортки. Виправлення — опустити межу, важке на сервер, прямі імпорти, `optimizePackageImports`, `next/dynamic`. І бюджет бандла в CI.
>
> 📚 [[Next.js - 08. Межа use client#🛢️ Barrel-файли і зайві кілобайти|Розділ: barrel-файли]] · [Next.js: Package Bundling](https://nextjs.org/docs/app/guides/package-bundling) · [Next.js CLI: experimental-analyze](https://nextjs.org/docs/app/api-reference/cli/next#next-experimental-analyze-options)

## 🔗 Звʼязки

- [[Next.js - 07. Server і Client Components]] — базова модель, яку цей розділ поглиблює.
- [[use client]], [[use server]], [[Server Functions]] — довідник React: межа, серіалізовані типи, дії.
- [[use]], [[createContext]], [[cache]] — інструменти для промісів і контексту через межу.
- [[experimental_taintObjectReference]] і [[experimental_taintUniqueValue]] — Taint API.
- Далі в курсі: [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration|09]] — RSC payload і hydration детально, [[Next.js - 11. Streaming і Suspense|11]] — стрімінг промісів, теми 21 (Server Functions і `.bind`) і 33+ (продуктивність і бандл) основного посібника.

## ⚡ Фішки

> [!reel] 🎫 Експорт клієнтського файлу на сервері — функція
> Константа з `'use client'`-файлу для серверної сторінки — клієнтське посилання: `typeof` дає `function`, а `PAGE_SIZE * 2` — `NaN`.

> [!reel] 🧬 Один файл — три екземпляри модуля
> Модуль без директиви живе окремо в серверному графі, у SSR-графі й у браузері. Лічильник рівня модуля в кожному свій, навіть в одному процесі Node.js.

> [!reel] 🎟️ Promise — це квиток на дані
> Передай `getReviews()` без `await` — у payload піде `$@7`, а значення доїде тим самим потоком. Клієнт розгорне його через `use()` у `<Suspense>`.

> [!reel] 🧩 Компонент можна передати як prop
> `Row={ProductRow}` із серверної сторінки працює, якщо `ProductRow` експортовано з `'use client'`-файлу: для сервера це посилання, а посилання серіалізуються.

> [!reel] 🔀 react-server — дві реалізації одного пакета
> `exports: { "react-server": "./server.js", "default": "./client.js" }`: Server Components отримують першу, Client Components — другу, навіть під час SSR. Так працюють `react` і `server-only`.

> [!reel] 🛢️ Одна кнопка — 200 КБ
> Barrel-файл, де сусідній модуль має побічний ефект, тягне його в чанк разом з кнопкою. Без побічних ефектів Turbopack 16.3.8 невикористаний реекспорт викидає.
>
> ```tsx
> import { TinyButton } from '@/lib/ui' // + HeavyChart, якщо в ньому код рівня модуля
> ```

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке точка входу в клієнт?
> *часто · теорія* · `nextjs-core-08-card-01`
>
> Файл з `'use client'`, який імпортує модуль серверного графа. Його експорти — входи в клієнтське піддерево. Якщо такий файл імпортує лише інший клієнтський модуль, директива нічого не робить.
>
> 📚 [[Next.js - 08. Межа use client#🗺️ Два графи і точки входу|Розділ: точки входу]] · [Next.js: use client](https://nextjs.org/docs/app/api-reference/directives/use-client)

> [!question]- Чим слот відрізняється від render prop?
> *часто · теорія* · `nextjs-core-08-card-02`
>
> Слот (`children`, `sidebar={<Folders />}`) — уже відрендерений вивід, його можна передати із сервера. Render prop — функція, яку викличе клієнт, а функцію через межу не серіалізувати.
>
> 📚 [[Next.js - 08. Межа use client#🧩 JSX через межу: слоти так, render props ні|Розділ: слоти]] · [Next.js: Interleaving](https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components)

> [!question]- Як прочитати Promise, переданий із Server Component, у Client Component?
> *часто · код* · `nextjs-core-08-card-03`
>
> Через `use(promise)` усередині `<Suspense>`; поки проміс у дорозі, видно fallback. Сервер передає проміс без `await`.
>
> ```tsx
> const reviews = use(reviewsPromise)
> ```
>
> 📚 [[Next.js - 08. Межа use client#🧳 Серіалізація: що й як їде в payload|Розділ: Promise як prop]] · [React: use](https://react.dev/reference/react/use)

> [!question]- Чи бачать Server Components під клієнтським провайдером його контекст?
> *часто · теорія* · `nextjs-core-08-card-04`
>
> Ні. Вони рендеряться на сервері незалежно від провайдера і приходять як готовий вивід. Контекст читають лише Client Components нижче, а серверні беруть дані з джерела (`cookies()`, функція даних з `React.cache`).
>
> 📚 [[Next.js - 08. Межа use client#🎛️ Контекст через межу|Розділ: контекст]] · [Next.js: Context providers](https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers)

### 🟡 Middle

> [!question]- Чому не варто експортувати константи з файлу з 'use client'?
> *часто · код* · `nextjs-core-08-card-05`
>
> Для серверного графа кожен експорт такого файлу — клієнтське посилання: `typeof PAGE_SIZE === 'function'`, арифметика дає `NaN`, виклик кидає `Attempted to call … from the server`. Спільні значення — у модуль без директиви.
>
> 📚 [[Next.js - 08. Межа use client#🗺️ Два графи і точки входу|Розділ: клієнтські посилання]] · [React: 'use client' — caveats](https://react.dev/reference/rsc/use-client#caveats)

> [!question]- Що означає «модуль скомпільовано двічі» і чим це небезпечно?
> *іноді · теорія* · `nextjs-core-08-card-06`
>
> Модуль без директиви з обох графів має окремі екземпляри в серверному графі, у SSR-графі й у браузері. Стан рівня модуля не спільний між ними. А store рівня модуля в SSR-екземплярі спільний для всіх запитів, тож дані одного користувача можуть потрапити до іншого.
>
> 📚 [[Next.js - 08. Межа use client#🧬 Модулі, скомпільовані двічі|Розділ: двічі скомпільовані модулі]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary)

> [!question]- Які «пасажири» їдуть разом із Server Function через межу?
> *іноді · безпека* · `nextjs-core-08-card-07`
>
> Захоплені змінні замикання inline-дії (Next.js їх шифрує) і аргументи `.bind(null, …)`. Усі мусять бути серіалізованими. Клієнт може підмінити аргументи, тож права перевіряють усередині дії, а секретів у замиканні не тримають.
>
> 📚 [[Next.js - 08. Межа use client#🧳 Серіалізація: що й як їде в payload|Розділ: Server Function]] · [Next.js: Closures and encryption](https://nextjs.org/docs/app/guides/data-security#closures-and-encryption)

> [!question]- Як зробити так, щоб клієнтський список сам рендерив рядок, обраний сервером?
> *іноді · код* · `nextjs-core-08-card-08`
>
> Передати посилання на компонент з `'use client'`-модуля: `<List Row={ProductRow} />`. Посилання серіалізується, і `List` рендерить `<Row … />` з клієнтським станом.
>
> 📚 [[Next.js - 08. Межа use client#🧳 Серіалізація: що й як їде в payload|Розділ: Client Component як prop]] · [React: Serializable types](https://react.dev/reference/rsc/use-client#serializable-types)

### 🔴 Senior

> [!question]- Як влаштовані server-only і client-only?
> *іноді · теорія* · `nextjs-core-08-card-09`
>
> Маркер-пакети з умовою експорту `react-server`. У `server-only` вона веде на порожній файл, а `default` — на файл, що кидає помилку. У `client-only` навпаки. Next.js підміняє обидва імпорти сам і видає помилку збірки з Import trace, тож пакет можна не встановлювати.
>
> 📚 [[Next.js - 08. Межа use client#🧪 server-only, client-only і умова react-server|Розділ: server-only всередині]] · [Next.js: Preventing environment poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning)

> [!question]- Як автору бібліотеки віддати серверним і клієнтським компонентам різний код?
> *рідко · практика* · `nextjs-core-08-card-10`
>
> Через `exports` з умовою `react-server`: `{ "react-server": "./server.js", "default": "./client.js" }`. Серверний граф бере перший файл, обидва клієнтські середовища (SSR і браузер) — другий. Клієнтські точки входу мають `'use client'`, і бандлер пакета не повинен вирізати директиву.
>
> 📚 [[Next.js - 08. Межа use client#🧪 server-only, client-only і умова react-server|Розділ: react-server]] · [Node.js: Conditional exports](https://nodejs.org/api/packages.html#conditional-exports)

> [!question]- Чому taint не замінює DTO?
> *іноді · безпека* · `nextjs-core-08-card-11`
>
> `taintObjectReference` стежить лише за посиланням: spread чи клон дають незахищену копію. Похідні значення (`'v:' + token`) теж не позначені. Це experimental-страховка; основний захист — DTO білим списком у шарі даних з `server-only`.
>
> 📚 [[Next.js - 08. Межа use client#🧷 server-only проти taint|Розділ: taint]] · [Next.js: taint](https://nextjs.org/docs/app/api-reference/config/next-config-js/taint)

> [!question]- Чому імпорт однієї кнопки з barrel-файлу може додати сотні кілобайтів?
> *часто · продуктивність* · `nextjs-core-08-card-12`
>
> Невикористаний реекспорт бандлер викидає, лише якщо модуль не має побічних ефектів. Код рівня модуля, `import './x.css'` чи `import 'lib/register'` змушують включити модуль з усіма залежностями. Лікується прямими імпортами, `optimizePackageImports` (experimental) і вимірюванням через `next experimental-analyze`.
>
> 📚 [[Next.js - 08. Межа use client#🛢️ Barrel-файли і зайві кілобайти|Розділ: barrel-файли]] · [Next.js: Package Bundling](https://nextjs.org/docs/app/guides/package-bundling)

> [!question]- Помилка радить «mark the file (or its parent) with "use client"». Коли ця порада шкідлива?
> *іноді · налагодження* · `nextjs-core-08-card-13`
>
> Коли модуль з хуком водночас експортує утиліти, які потрібні серверу. Директива перетворить їх на клієнтські посилання, і серверний виклик упаде. Правильно — розділити модуль: хук окремо, чисті функції окремо. Дивись trace знизу вгору і рви одну ланку.
>
> 📚 [[Next.js - 08. Межа use client#🧯 Як читати Import trace|Розділ: Import trace]] · [Next.js: The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary#crossing-the-boundary)

## 🛠️ Практика

> [!task] Серіалізатор props: Promise, Server Functions і JSX
> level: middle · difficulty: hard · id: nextjs-core-08-task-01 · tags: serialization, rsc, promise
>
> Розшир перевірку з теми 07 основного посібника. Напиши **асинхронну** `findUnserializable(props)`, що повертає `Promise<string[]>` — шляхи до значень, які не пройдуть межу. Правила:
>
> - можна: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `Date`, `Map`, `Set`, `ArrayBuffer`, typed arrays (вміст не перевіряємо); `symbol` — лише зареєстрований (`Symbol.keyFor`);
> - масиви й прості обʼєкти (прототип `Object.prototype`) — вглиб; решта обʼєктів — не можна;
> - **Promise** — дочекайся значення й перевір його за шляхом `<шлях>@resolved`; відхилений проміс — не помилка серіалізації;
> - **функція** з `$$typeof === Symbol.for('react.client.reference')` — можна; з `Symbol.for('react.server.reference')` — можна, але перевір привʼязані аргументи `fn.$$bound` (масив або `null`) за шляхом `<шлях>.$$bound[i]`; інша функція — не можна;
> - **JSX-елемент** — обʼєкт з `$$typeof === Symbol.for('react.transitional.element')`: якщо `type` — звичайна функція без `$$typeof` (Server Component), його props не перевіряємо (він відрендериться на сервері); інакше (тег-рядок, клієнтське посилання) перевір `props` за шляхом `<шлях>.props.<ключ>`.
>
> Порядок — порядок обходу (ключі обʼєкта по черзі, проміси дочікуємо на місці). Задача на TypeScript: типи знімаються перед запуском.
>
> ```ts
> await findUnserializable({ header: el('button', { onClick: () => {} }) }) // → ['header.props.onClick']
> ```
>
> ```ts starter
> async function findUnserializable(props: Record<string, unknown>): Promise<string[]> {
>   // твій код
>   return []
> }
> ```
>
> ```ts tests
> const ELEMENT = Symbol.for('react.transitional.element')
> const CLIENT_REF = Symbol.for('react.client.reference')
> const SERVER_REF = Symbol.for('react.server.reference')
> const el = (type: unknown, props: Record<string, unknown>) => ({ $$typeof: ELEMENT, type, props, key: null })
> const clientRef = (name: string) => Object.assign(function () {}, { $$typeof: CLIENT_REF, $$id: name })
> const serverRef = (bound: unknown[] | null) => Object.assign(async function () {}, { $$typeof: SERVER_REF, $$bound: bound })
>
> test('серіалізовані значення, посилання й проміс з простим значенням проходять', async () => {
>   const props = {
>     title: 'Кошик', when: new Date(), tags: new Set(['a']), big: BigInt(1), nothing: undefined,
>     Row: clientRef('ProductRow'), likeAction: serverRef(null),
>     reviews: Promise.resolve([{ id: 'r1', createdAt: new Date() }]),
>   }
>   expect(await findUnserializable(props)).toEqual([])
> })
>
> test('перевіряє значення промісу після резолву', async () => {
>   const props = { reviews: Promise.resolve([{ id: 'r1' }, { id: 'r2', format: (n: number) => n }]) }
>   expect(await findUnserializable(props)).toEqual(['reviews@resolved[1].format'])
> })
>
> test('відхилений проміс не є помилкою серіалізації', async () => {
>   const rejected = Promise.reject(new Error('404'))
>   rejected.catch(() => {})
>   expect(await findUnserializable({ data: rejected, ok: Symbol.for('app') })).toEqual([])
> })
>
> test('перевіряє привʼязані аргументи Server Function', async () => {
>   const props = { saveAction: serverRef(['p1', { onDone: () => {} }]), plain: () => {} }
>   expect(await findUnserializable(props)).toEqual(['saveAction.$$bound[1].onDone', 'plain'])
> })
>
> test('знаходить обробник усередині JSX, зокрема в children', async () => {
>   const header = el('div', { children: [el('h2', { children: 'Кошик' }), el('button', { onClick: () => {} })] })
>   expect(await findUnserializable({ header })).toEqual(['header.props.children[1].props.onClick'])
> })
>
> test('props Server Component не перевіряє, props клієнтського — перевіряє', async () => {
>   function Cart(_: { format: (n: number) => string }) { return null }
>   const props = {
>     server: el(Cart, { format: (n: number) => `${n}` }),
>     client: el(clientRef('Modal'), { onClose: () => {}, title: 'ok' }),
>   }
>   expect(await findUnserializable(props)).toEqual(['client.props.onClose'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Зроби `walk(value, path)` асинхронною і `await`-ай рекурсію в кожному циклі (`for…of`, не `forEach`), тоді порядок збережеться. Для промісу: `try { walk(await value, path + '@resolved') } catch {}`.
>
> > [!hint]- Підказка 2
> > JSX-елемент і функції перевіряй **до** перевірки «простий обʼєкт»: у елемента прототип теж `Object.prototype`, і загальний обхід зачепив би `type`. Server Component — це `typeof type === 'function' && !type.$$typeof`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > async function findUnserializable(props: Record<string, unknown>): Promise<string[]> {
> >   const ELEMENT = Symbol.for('react.transitional.element')
> >   const CLIENT_REF = Symbol.for('react.client.reference')
> >   const SERVER_REF = Symbol.for('react.server.reference')
> >   const bad: string[] = []
> >
> >   async function walkKeys(obj: Record<string, unknown>, prefix: string) {
> >     for (const key of Object.keys(obj)) await walk(obj[key], prefix ? `${prefix}.${key}` : key)
> >   }
> >
> >   async function walk(value: unknown, path: string): Promise<void> {
> >     if (value === null || value === undefined) return
> >     const t = typeof value
> >     if (t === 'string' || t === 'number' || t === 'bigint' || t === 'boolean') return
> >     if (t === 'symbol') {
> >       if (Symbol.keyFor(value as symbol) === undefined) bad.push(path)
> >       return
> >     }
> >     if (t === 'function') {
> >       const fn = value as { $$typeof?: symbol; $$bound?: unknown[] | null }
> >       if (fn.$$typeof === CLIENT_REF) return
> >       if (fn.$$typeof === SERVER_REF) {
> >         const bound = fn.$$bound ?? []
> >         for (let i = 0; i < bound.length; i++) await walk(bound[i], `${path}.$$bound[${i}]`)
> >         return
> >       }
> >       bad.push(path)
> >       return
> >     }
> >     if (value instanceof Promise) {
> >       let resolved: unknown
> >       try {
> >         resolved = await value
> >       } catch {
> >         return // відхилення React передасть як помилку
> >       }
> >       await walk(resolved, `${path}@resolved`)
> >       return
> >     }
> >     if (Array.isArray(value)) {
> >       for (let i = 0; i < value.length; i++) await walk(value[i], `${path}[${i}]`)
> >       return
> >     }
> >     const obj = value as Record<string, unknown>
> >     if (obj.$$typeof === ELEMENT) {
> >       const type = obj.type as { $$typeof?: symbol } | string
> >       const isServerComponent = typeof type === 'function' && !type.$$typeof
> >       if (!isServerComponent) await walkKeys(obj.props as Record<string, unknown>, `${path}.props`)
> >       return
> >     }
> >     if (
> >       value instanceof Date || value instanceof Map || value instanceof Set ||
> >       value instanceof ArrayBuffer || ArrayBuffer.isView(value)
> >     ) return
> >     if (Object.getPrototypeOf(value) === Object.prototype) {
> >       await walkKeys(obj, path)
> >       return
> >     }
> >     bad.push(path)
> >   }
> >
> >   await walkKeys(props, '')
> >   return bad
> > }
> > ```
> >
> > Справжній React не чекає на проміс перед відправкою: він пише посилання і серіалізує значення, коли воно зʼявиться, тож помилка теж «приходить пізніше». Server Component в елементі рендериться на сервері, і його props до клієнта не доходять. До клієнта доходить лише його вивід, який React перевірить окремо.

> [!task] Точки входу й модулі, скомпільовані двічі
> level: middle · difficulty: medium · id: nextjs-core-08-task-02 · tags: module-graph, bundle
>
> Напиши `analyzeBoundary(graph, entries)`. `graph` — `{ [file]: { directive, imports } }` (`directive` — `'use client'`, `'use server'` або `null`), `entries` — файли маршрутів (серверний граф). Поверни `{ clientEntries, twice }` — обидва масиви **відсортовані**:
>
> - `clientEntries` — файли з `'use client'`, імпортовані **із серверного** середовища;
> - `twice` — файли, що опинились і в серверному, і в клієнтському графі.
>
> Правила обходу:
>
> 1. Сервер імпортує `'use client'` → файл переходить у клієнтський граф (у серверному лише посилання, сам файл туди не входить); його імпорти — клієнтські.
> 2. Клієнт імпортує `'use server'` → клієнт отримує посилання, а сам файл живе в **серверному** графі: обходь його і його імпорти як серверні.
> 3. Директива `'use client'` у клієнтському графі нічого не змінює; `'use server'` у серверному — теж.
> 4. Імпорти поза `graph` (npm-пакети) ігноруй; імпорти бувають циклічні.
>
> ```js
> analyzeBoundary({
>   'app/page.tsx': { directive: null, imports: ['app/modal.tsx', 'lib/format.ts'] },
>   'app/modal.tsx': { directive: 'use client', imports: ['lib/format.ts'] },
>   'lib/format.ts': { directive: null, imports: [] },
> }, ['app/page.tsx']) // → { clientEntries: ['app/modal.tsx'], twice: ['lib/format.ts'] }
> ```
>
> ```js starter
> function analyzeBoundary(graph, entries) {
>   // твій код
>   return { clientEntries: [], twice: [] }
> }
> ```
>
> ```js tests
> const shop = {
>   'app/shop/page.tsx': { directive: null, imports: ['app/ui/cart.tsx', 'app/ui/modal.tsx', 'lib/format.ts'] },
>   'app/ui/cart.tsx': { directive: null, imports: ['lib/db.ts', 'lib/format.ts'] },
>   'lib/db.ts': { directive: null, imports: ['server-only', 'pg'] },
>   'app/ui/modal.tsx': { directive: 'use client', imports: ['react', 'app/ui/button.tsx', 'lib/format.ts'] },
>   'app/ui/button.tsx': { directive: null, imports: [] },
>   'lib/format.ts': { directive: null, imports: [] },
> }
>
> test('знаходить точку входу й спільний модуль', () => {
>   expect(analyzeBoundary(shop, ['app/shop/page.tsx'])).toEqual({ clientEntries: ['app/ui/modal.tsx'], twice: ['lib/format.ts'] })
> })
>
> test('use client, імпортований лише з клієнта, — не точка входу', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/toolbar.tsx'] },
>     'app/toolbar.tsx': { directive: 'use client', imports: ['app/menu.tsx'] },
>     'app/menu.tsx': { directive: 'use client', imports: [] },
>   }
>   expect(analyzeBoundary(graph, ['app/page.tsx']).clientEntries).toEqual(['app/toolbar.tsx'])
> })
>
> test('use server з клієнта живе в серверному графі разом зі своїми імпортами', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/like.tsx'] },
>     'app/like.tsx': { directive: 'use client', imports: ['app/actions.ts', 'lib/format.ts'] },
>     'app/actions.ts': { directive: 'use server', imports: ['lib/db.ts', 'lib/format.ts'] },
>     'lib/db.ts': { directive: null, imports: [] },
>     'lib/format.ts': { directive: null, imports: [] },
>   }
>   expect(analyzeBoundary(graph, ['app/page.tsx'])).toEqual({ clientEntries: ['app/like.tsx'], twice: ['lib/format.ts'] })
> })
>
> test('точка входу з кількох маршрутів рахується один раз', () => {
>   const graph = {
>     'app/a/page.tsx': { directive: null, imports: ['app/ui/search.tsx'] },
>     'app/b/page.tsx': { directive: null, imports: ['app/ui/search.tsx', 'app/ui/chart.tsx'] },
>     'app/ui/search.tsx': { directive: 'use client', imports: [] },
>     'app/ui/chart.tsx': { directive: 'use client', imports: [] },
>   }
>   expect(analyzeBoundary(graph, ['app/a/page.tsx', 'app/b/page.tsx']).clientEntries).toEqual(['app/ui/chart.tsx', 'app/ui/search.tsx'])
> })
>
> test('сторінка без клієнтських файлів: нічого', () => {
>   expect(analyzeBoundary(shop, ['app/ui/cart.tsx'])).toEqual({ clientEntries: [], twice: [] })
> })
>
> test('не зациклюється, а сторінка в клієнтському графі теж стає «двічі»', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/a.tsx'] },
>     'app/a.tsx': { directive: 'use client', imports: ['app/b.tsx'] },
>     'app/b.tsx': { directive: null, imports: ['app/a.tsx', 'app/page.tsx'] },
>   }
>   expect(analyzeBoundary(graph, ['app/page.tsx'])).toEqual({ clientEntries: ['app/a.tsx'], twice: ['app/page.tsx'] })
> })
> ```
>
> > [!hint]- Підказка 1
> > Обхід у глибину `visit(file, env)` з двома множинами — `server` і `client` — і відвіданими парами `env:file`. `twice` — перетин множин.
>
> > [!hint]- Підказка 2
> > Перемикай середовище **перед** записом у множину: сервер + `'use client'` → записати точку входу й продовжити як `client`; клієнт + `'use server'` → продовжити як `server`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function analyzeBoundary(graph, entries) {
> >   const seen = new Set()
> >   const inServer = new Set()
> >   const inClient = new Set()
> >   const clientEntries = new Set()
> >
> >   function visit(file, env) {
> >     const mod = graph[file]
> >     if (!mod) return
> >     if (env === 'server' && mod.directive === 'use client') {
> >       clientEntries.add(file)
> >       env = 'client'
> >     } else if (env === 'client' && mod.directive === 'use server') {
> >       env = 'server'
> >     }
> >     const key = `${env}:${file}`
> >     if (seen.has(key)) return
> >     seen.add(key)
> >     ;(env === 'server' ? inServer : inClient).add(file)
> >     for (const dep of mod.imports) visit(dep, env)
> >   }
> >
> >   for (const entry of entries) visit(entry, 'server')
> >   return {
> >     clientEntries: [...clientEntries].sort(),
> >     twice: [...inServer].filter((f) => inClient.has(f)).sort(),
> >   }
> > }
> > ```
> >
> > Точку входу записуємо ще до перевірки `seen`: вона залежить від того, **звідки** імпорт, а не від того, чи бачили файл. Останній тест — сигнал на code review: клієнтський модуль, що імпортує сторінку, затягує її в бандл і робить «двічі скомпільованою».

> [!task] Знайди server-only, досяжний з клієнта, і виведи Import trace
> level: senior · difficulty: hard · id: nextjs-core-08-task-03 · tags: module-graph, server-only, import-trace
>
> Напиши `traceServerOnly(graph, entries)`: граф як у попередній задачі. Знайди **перший** (обхід у глибину в порядку `entries` та `imports`) модуль клієнтського середовища, що імпортує `'server-only'`, і поверни trace у форматі Next.js — **знизу вгору** від модуля з проблемою до маршруту:
>
> ```text
> ./lib/db.ts [Client Component Browser]
> ./app/user-badge.tsx [Client Component Browser]
> ./app/user-badge.tsx [Server Component]
> ./app/page.tsx [Server Component]
> ```
>
> Масив рядків `./<file> [<середовище>]`. Точка входу трапляється **двічі**: спершу як серверний імпорт, потім як клієнтський модуль. Якщо порушення немає — `null`. `'use server'`, імпортований з клієнта, не обходимо (клієнт отримує лише посилання). Цикли можливі.
>
> ```js starter
> function traceServerOnly(graph, entries) {
>   // твій код
>   return null
> }
> ```
>
> ```js tests
> const C = '[Client Component Browser]'
> const S = '[Server Component]'
>
> test('класичний ланцюжок з точкою входу двічі', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/user-badge.tsx'] },
>     'app/user-badge.tsx': { directive: 'use client', imports: ['lib/db.ts'] },
>     'lib/db.ts': { directive: null, imports: ['server-only'] },
>   }
>   expect(traceServerOnly(graph, ['app/page.tsx'])).toEqual([
>     `./lib/db.ts ${C}`, `./app/user-badge.tsx ${C}`, `./app/user-badge.tsx ${S}`, `./app/page.tsx ${S}`,
>   ])
> })
>
> test('server-only лише в серверному графі — порушення немає', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['lib/db.ts', 'app/modal.tsx'] },
>     'app/modal.tsx': { directive: 'use client', imports: ['lib/format.ts'] },
>     'lib/format.ts': { directive: null, imports: [] },
>     'lib/db.ts': { directive: null, imports: ['server-only'] },
>   }
>   expect(traceServerOnly(graph, ['app/page.tsx'])).toBeNull()
> })
>
> test('ланцюжок через агностичну утиліту', () => {
>   const graph = {
>     'app/shop/page.tsx': { directive: null, imports: ['app/ui/card.tsx'] },
>     'app/ui/card.tsx': { directive: 'use client', imports: ['react', 'lib/format.ts'] },
>     'lib/format.ts': { directive: null, imports: ['lib/pricing.ts'] },
>     'lib/pricing.ts': { directive: null, imports: ['server-only', 'stripe'] },
>   }
>   expect(traceServerOnly(graph, ['app/shop/page.tsx'])).toEqual([
>     `./lib/pricing.ts ${C}`, `./lib/format.ts ${C}`, `./app/ui/card.tsx ${C}`, `./app/ui/card.tsx ${S}`, `./app/shop/page.tsx ${S}`,
>   ])
> })
>
> test('use server з клієнта не є порушенням', () => {
>   const graph = {
>     'app/page.tsx': { directive: null, imports: ['app/like.tsx'] },
>     'app/like.tsx': { directive: 'use client', imports: ['app/actions.ts'] },
>     'app/actions.ts': { directive: 'use server', imports: ['lib/db.ts'] },
>     'lib/db.ts': { directive: null, imports: ['server-only'] },
>   }
>   expect(traceServerOnly(graph, ['app/page.tsx'])).toBeNull()
> })
>
> test('цикли не заважають, повертає перше порушення в порядку обходу', () => {
>   const graph = {
>     'app/a/page.tsx': { directive: null, imports: ['app/nav.tsx'] },
>     'app/b/page.tsx': { directive: null, imports: ['app/badge.tsx'] },
>     'app/nav.tsx': { directive: 'use client', imports: ['app/menu.tsx'] },
>     'app/menu.tsx': { directive: null, imports: ['app/nav.tsx', 'lib/session.ts'] },
>     'lib/session.ts': { directive: null, imports: ['server-only'] },
>     'app/badge.tsx': { directive: 'use client', imports: ['lib/session.ts'] },
>   }
>   expect(traceServerOnly(graph, ['app/a/page.tsx', 'app/b/page.tsx'])).toEqual([
>     `./lib/session.ts ${C}`, `./app/menu.tsx ${C}`, `./app/nav.tsx ${C}`, `./app/nav.tsx ${S}`, `./app/a/page.tsx ${S}`,
>   ])
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай стек кадрів `{ file, env }` під час обходу у глибину: `push` перед рекурсією, `pop` після. Коли знайдеш порушення, переверни копію стека й відформатуй.
>
> > [!hint]- Підказка 2
> > На межі (сервер імпортує `'use client'`) клади у стек **два** кадри: той самий файл з `Server Component`, а над ним — з `Client Component Browser`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function traceServerOnly(graph, entries) {
> >   const LABEL = { server: '[Server Component]', client: '[Client Component Browser]' }
> >   const seen = new Set()
> >   const stack = []
> >
> >   function visit(file, env) {
> >     const mod = graph[file]
> >     if (!mod) return null
> >     if (env === 'client' && mod.directive === 'use server') return null
> >     let frames = 1
> >     if (env === 'server' && mod.directive === 'use client') {
> >       stack.push({ file, env: 'server' })
> >       env = 'client'
> >       frames = 2
> >     }
> >     const key = `${env}:${file}`
> >     if (seen.has(key)) {
> >       if (frames === 2) stack.pop()
> >       return null
> >     }
> >     seen.add(key)
> >     stack.push({ file, env })
> >
> >     let found = null
> >     if (env === 'client' && mod.imports.includes('server-only')) {
> >       found = [...stack].reverse().map((f) => `./${f.file} ${LABEL[f.env]}`)
> >     }
> >     for (const dep of mod.imports) {
> >       if (found) break
> >       found = visit(dep, env)
> >     }
> >     for (let i = 0; i < frames; i++) stack.pop()
> >     return found
> >   }
> >
> >   for (const entry of entries) {
> >     const trace = visit(entry, 'server')
> >     if (trace) return trace
> >   }
> >   return null
> > }
> > ```
> >
> > Справжній trace Next.js має ще блок `Client Component SSR` з тим самим ланцюжком. Ми моделюємо лише браузерний. Читаючи такий вивід, шукай файл, що трапляється двічі: ланка над ним (`card.tsx → format.ts`) — та, яку треба розірвати.

## 📚 Джерела та що почитати

- 🟡 [Next.js — The Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) — графи модулів, дані в дереві, Promise і `use`, складені компоненти.
- 🟡 [Next.js — use client](https://nextjs.org/docs/app/api-reference/directives/use-client) — точки входу і серіалізовані props.
- 🟡 [Next.js — use server](https://nextjs.org/docs/app/api-reference/directives/use-server) — Server Functions на межі.
- 🟡 [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — контекст, сторонні компоненти, `server-only` / `client-only`.
- 🔴 [Next.js — Data Security](https://nextjs.org/docs/app/guides/data-security) — шифрування замикань дій, DTO.
- 🔴 [Next.js — taint](https://nextjs.org/docs/app/api-reference/config/next-config-js/taint) — experimental Taint API і його обмеження.
- 🛠️ [Next.js — Package Bundling](https://nextjs.org/docs/app/guides/package-bundling) — `next experimental-analyze`, `optimizePackageImports`.
- 🟡 [Next.js — Single-Page Applications: use within a Context Provider](https://nextjs.org/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider) — проміс у контексті.
- 🔴 [React — 'use client'](https://react.dev/reference/rsc/use-client) — повний список серіалізованих типів і caveats про імпорт із клієнтських модулів.
- 🔴 [Node.js — Conditional exports](https://nodejs.org/api/packages.html#conditional-exports) — як працюють умови на кшталт `react-server`.

> [!important] Підсумок
> - Точка входу в клієнт — `'use client'`-файл, імпортований із серверного графа. Сервер отримує **клієнтські посилання** на всі його експорти, тому з таких файлів експортують лише компоненти.
> - Модуль, потрібний обом графам, має окремі екземпляри: серверний, SSR і браузерний. Стан рівня модуля між ними не ділиться.
> - Через межу проходять `Promise` (читають через `use()`), Server Functions з серіалізованими `.bind`-аргументами, посилання на Client Components і JSX. Render props — ні: передавай слоти або посилання.
> - Контекст — у клієнтському провайдері; серверні дані йдуть у нього промісом без `await`, серверні `children` контекст не бачать.
> - `server-only` / `client-only` — маркери на умові `react-server`, які захищають код. `taint` (experimental) захищає значення, але не копії. Обидва — поверх DTO.
> - Barrel з побічними ефектами тягне сусідні модулі в бандл: вимірюй через `.next/static` або `next experimental-analyze`, а помилки межі читай за Import trace знизу вгору.

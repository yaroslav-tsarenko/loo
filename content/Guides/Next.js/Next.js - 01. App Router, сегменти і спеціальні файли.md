---
title: App Router, сегменти і спеціальні файли
id: nextjs-core-01
slug: 01-app-router
order: 1
level: junior
skill: routing
icon: px:folder
tags: [nextjs, app-router, routing, segments, layout, error, loading, not-found, colocation]
prerequisites: ["[[Next.js Start - 07. Сторінки й layouts]]"]
estimatedMinutes: 45
nextVersion: 16.3.8
---

# App Router, сегменти і спеціальні файли

> [!success] 🎯 Після цього розділу ти зможеш
> - прочитати папку `app/` як **дерево сегментів** і сказати, які URL з нього виходять, а які папки в URL не потрапляють;
> - назвати всі спеціальні файли App Router, що з них обовʼязкове, що має бути Client Component, а що — експериментальне;
> - відтворити порядок обгортання `layout → template → error → loading → not-found → page` і передбачити, **яка** межа зловить помилку чи `notFound()`;
> - для будь-якого URL знайти сторінку, `params` і весь ланцюжок layouts і меж, які її обгорнуть;
> - тримати код поруч із маршрутами без сюрпризів: colocation, приватні папки `_folder`, `src/`;
> - впізнати конфлікти маршрутів до продакшну: `page` + `route`, однакові URL у різних групах, різні імена динамічних сегментів.

## 🤔 Передбач

> [!quiz] Хто зловить помилку layout?
> level: junior · type: output · id: nextjs-core-01-quiz-01
>
> ```text
> app/
> ├── layout.tsx          root layout
> ├── error.tsx           'use client' → «Помилка · app/error.tsx»
> └── crash/
>     ├── layout.tsx      кидає throw new Error('layout впав')
>     ├── error.tsx       'use client' → «Помилка · crash/error.tsx»
>     └── page.tsx
> ```
>
> Користувач відкриває `/crash`. Що він побачить?
>
> - [x] Шапку root layout і «Помилка · app/error.tsx»
> - [ ] Шапку root layout і «Помилка · crash/error.tsx» — межа лежить у тій самій папці
> - [ ] Повну сторінку `global-error` без root layout
> - [ ] Білий екран: помилки в layout межі не ловлять
>
> **Пояснення:** не переймайся, якщо помилився, — це найчастіша пастка App Router. `crash/error.tsx` обгортає все, що **всередині** `crash/layout.tsx`, але не сам layout. Помилку layout ловить межа на рівень вище — `app/error.tsx`, і вона рендериться всередині root layout. Перевірено в `next dev` 16.3.8.

## 🧒 Простими словами

Уяви офісний центр. Адреса `/dashboard/settings` — це маршрут ліфтом: поверх `dashboard`, кабінет `settings`. Кожен поверх має стандартне оснащення з однаковими назвами: **рамку** з табличкою й коридором, які не змінюються, поки ходиш кабінетами поверху (`layout`), **вхідні двері**, що щоразу відчиняються наново (`template`), **пожежну сигналізацію** (`error`), **приймальню**, де чекаєш, поки кабінет готують (`loading`), і табличку «тут нікого немає» (`not-found`). Сам кабінет — це `page`. Будівельник ставить усе це в одному порядку на кожному поверсі, а поверх вкладено у поверх нижче. Тож сигналізація поверху `dashboard` спрацьовує на пожежу в кабінеті, але не на пожежу в самій рамці поверху — про неї дізнається сигналізація першого поверху. А на склад з табличкою «службове» (`_components`) відвідувачів не пускають взагалі.

## 🔬 Як це працює насправді

У [[Next.js Start - 07. Сторінки й layouts|темі Start 07]] ти зібрав сайт зі сторінок, layouts і `not-found.tsx`. Тепер розберемо точну модель: як Next.js читає папку `app/`, у якому порядку складає спеціальні файли в одне React-дерево і що з цього випливає для помилок, завантаження та структури великого проєкту. Приклад на всю тему — дашборд невеликого магазину «Акме».

### 🌳 Дерево сегментів

App Router — **файлова маршрутизація**: структуру URL задають папки в `app/`. Кожна папка — **сегмент маршруту** (route segment), і він відповідає сегменту шляху в URL. Шлях `/dashboard/settings` складається з трьох сегментів:

- `/` — **root segment**, папка `app/` сама по собі;
- `dashboard` — проміжний сегмент;
- `settings` — **leaf segment**, лист: на ньому шлях закінчується.

Папки задають структуру, а **файли** — що показати для сегмента. Сегмент стає публічною адресою, лише коли в ньому є `page.tsx` (UI) або `route.ts` (Route Handler — HTTP-ендпоінт). Папка `dashboard/reports/` з одним `chart.tsx` усередині — це сегмент без адреси: `/dashboard/reports` дасть 404.

Не кожна папка дає сегмент URL. Назва папки — це маленька мова:

| Папка | Приклад | У URL | Навіщо | Тема |
|---|---|---|---|---|
| звичайна | `settings/` | `/settings` | статичний сегмент | ця |
| динамічна | `[team]/` | `/design`, `/sales` | параметр у `params` | 03 |
| catch-all | `[...slug]/` | `/a`, `/a/b/c` | один або більше сегментів | 03 |
| optional catch-all | `[[...slug]]/` | `/`, `/a/b` | нуль або більше сегментів | 03 |
| route group | `(shop)/` | — | організація й окремі layouts без впливу на URL | 02 |
| приватна | `_components/` | — | поза маршрутизацією разом з усіма вкладеними папками | ця |
| слот | `@modal/` | — | parallel route, prop для layout | 05 |
| intercepting | `(.)photo/` | — | показати інший маршрут у поточному layout | 05 |

Головне з таблиці: **route groups, приватні папки й слоти існують у файловій системі, але не в URL**. Тож дерево папок і дерево URL — не одне й те саме, і далі в темі ми весь час переходитимемо від одного до іншого.

Ось файли дашборду, з якими працюватимемо:

```text
app/
├── layout.tsx              root layout
├── page.tsx                /
├── error.tsx               межа помилок кореня
├── not-found.tsx           404 для всього застосунку
├── api/health/route.ts     GET /api/health
└── dashboard/
    ├── layout.tsx          меню дашборду
    ├── template.tsx
    ├── error.tsx
    ├── loading.tsx
    ├── not-found.tsx
    ├── page.tsx            /dashboard
    ├── _components/
    │   └── stat-card.tsx   не маршрут
    ├── settings/
    │   └── page.tsx        /dashboard/settings
    └── [team]/
        └── page.tsx        /dashboard/design, /dashboard/sales…
```

> [!diagram] Дерево сегментів дашборду
> ```yaml
> layout: tree
> nodes:
>   - { id: app, label: "app/", text: "root segment · /", note: "layout.tsx — root layout", tone: blue, icon: "px:house" }
>   - { id: dash, label: "dashboard/", text: "/dashboard", note: "layout, template, error, loading, not-found", parent: app, tone: violet, icon: "px:folder" }
>   - { id: settings, label: "settings/", text: "/dashboard/settings", note: "leaf segment", parent: dash, tone: green }
>   - { id: team, label: "[team]/", text: "/dashboard/design, /dashboard/sales", note: "динамічний сегмент", parent: dash, tone: green }
>   - { id: comps, label: "_components/", text: "приватна папка", note: "поза маршрутизацією", parent: dash, tone: gray, icon: "px:lock" }
>   - { id: api, label: "api/health/", text: "route.ts → GET /api/health", note: "Route Handler: без layouts", parent: app, tone: orange }
> steps:
>   - { show: app, note: "Папка app/ — root segment. Її layout.tsx обгортає весь застосунок, page.tsx відповідає адресі /." }
>   - { show: dash, note: "dashboard/ — сегмент /dashboard. Тут лежить повний набір спеціальних файлів: усі вони діють на /dashboard і все глибше." }
>   - { show: [settings, team], note: "Два листи. settings — статичний, [team] — динамічний: він збігається з будь-яким одним сегментом після /dashboard/." }
>   - { show: comps, note: "Підкреслення на початку вимикає папку з маршрутизації разом з усім вмістом. stat-card.tsx — просто модуль." }
>   - { show: api, note: "route.ts робить сегмент публічним без UI. Route Handler не бере участі в layouts і навігації на клієнті." }
> ```
> Зелене й помаранчеве відкривається за URL. Сіре — лише код поруч із маршрутами.

> [!quiz] Перевір себе: які папки стануть частиною URL?
> level: junior · type: multi · id: nextjs-core-01-quiz-02
> - [x] `app/dashboard/`
> - [x] `app/dashboard/[team]/` — як значення параметра `team`
> - [ ] `app/(shop)/`
> - [ ] `app/dashboard/_components/`
> - [ ] `app/@modal/`
> - [x] `app/%5Fdrafts/` — як `/_drafts`
>
> **Пояснення:** звичайні й динамічні папки дають сегменти URL. Route group `(shop)` і слот `@modal` лише організовують файли, а `_components` вимикає папку з маршрутизації. `%5F` — закодоване підкреслення: так роблять сегмент URL, що справді починається з `_` (перевірено: `app/%5Fdrafts/page.tsx` відкривається за `/_drafts`).

### 📄 Спеціальні файли: повний каталог

Спеціальний файл — файл із зарезервованою назвою, який Next.js знаходить сам: його не імпортують і ніде не реєструють. Розширення для UI-файлів — `.js`, `.jsx` або `.tsx`; для `route` — `.js` або `.ts`.

| Файл | Що робить | Де діє | Обовʼязковий | Server/Client |
|---|---|---|---|---|
| `layout` | спільна рамка, зберігає стан між сторінками | свій сегмент і все глибше | **root layout — так** | Server за замовчуванням |
| `page` | унікальний UI маршруту, завжди лист | лише свій сегмент | для публічної адреси (або `route`) | Server за замовчуванням |
| `template` | як layout, але з новим `key` на кожну навігацію сегмента | свій сегмент і глибше | ні | Server за замовчуванням |
| `loading` | fallback межі `<Suspense>` | свій сегмент і глибше | ні | Server за замовчуванням |
| `error` | React error boundary | свій сегмент і глибше, крім свого layout і template | ні | **лише Client** |
| `global-error` | помилки root layout; замінює root layout | лише корінь `app/` | ні | **лише Client**, свої `<html>` і `<body>` |
| `not-found` | UI для `notFound()`; кореневий — ще й для URL без збігу | свій сегмент і глибше | ні | Server за замовчуванням |
| `global-not-found` | 404 для URL без збігу в обхід усього рендеру | лише корінь `app/` | ні, **experimental** | свої `<html>` і `<body>` |
| `forbidden` / `unauthorized` | UI для `forbidden()` (403) і `unauthorized()` (401) | свій сегмент і глибше | ні, **experimental** | Server за замовчуванням |
| `default` | fallback слота parallel route після повного перезавантаження | слот `@name` | для кожного слота — так | Server за замовчуванням |
| `route` | Route Handler: `GET`, `POST`… без UI | лише свій сегмент | для API-адреси (або `page`) | лише сервер |

Ще є **metadata-файли** (`favicon.ico`, `icon`, `opengraph-image`, `sitemap`, `robots`) — вони теж спеціальні за назвою, і про них тема 33. Не називай так компоненти: `app/icon.tsx` Next.js сприйме як генератор іконки сайту.

Найважливіші пункти таблиці на практиці. `error.tsx` і `global-error.tsx` мусять бути Client Components, бо error boundary в React — клієнтська річ: межа перехоплює помилку й показує fallback з кнопкою, а для кнопки потрібен JS. Без директиви збірка зупиняється:

```text
Error: app/error.tsx must be a Client Component. Add the "use client" directive the top of the file to resolve this issue.
```

У Next.js 16.3 межа отримує функцію `retry` (стабільна з 16.3): вона заново отримує дані й рендерить вміст межі. Старий `reset` лишився для рідкісного випадку «скинути стан без нового запиту».

```tsx
// app/error.tsx — error boundary мусить бути Client Component
'use client'

export default function RootError({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div>
      <h1>Помилка · app/error.tsx</h1>
      <button onClick={() => retry()}>Спробувати ще</button>
    </div>
  )
}
```

Усі інші UI-файли — звичайні Server Components, можуть бути `async` і читати дані (`not-found.tsx` теж). А `default` потрібен лише parallel routes: з Next.js 16 збірка падає, якщо слот `@name` не має `default.js`. Що таке слоти й навіщо їм fallback — тема 05; тут досить знати, що файл існує і чому він у списку.

> [!quiz] Перевір себе: обери правдиві твердження про спеціальні файли
> level: junior · type: multi · id: nextjs-core-01-quiz-03
> - [x] `error.tsx` без `'use client'` зупиняє `next build`
> - [x] `page.tsx` завжди лист: глибше нього в тому самому сегменті нічого не рендериться
> - [ ] `loading.tsx` і `not-found.tsx` теж мусять бути Client Components
> - [ ] Спеціальний файл треба імпортувати в layout, інакше Next.js його не побачить
> - [x] `global-not-found` і `forbidden` / `unauthorized` вмикаються експериментальними прапорцями в `next.config`
> - [ ] Сегмент з `layout.tsx`, але без `page.tsx`, відкривається за URL — показує сам layout
>
> **Пояснення:** клієнтськими мусять бути лише межі помилок. `loading` і `not-found` — звичайні Server Components. Спеціальні файли Next.js знаходить за назвою. Layout без `page` нічого не публікує: він обгортає дочірні сегменти, але сама адреса дає 404.

### 🪆 Ієрархія рендеру: що в що вкладено

Спеціальні файли одного сегмента Next.js складає в **фіксованому порядку**, від зовнішнього до внутрішнього:

1. `layout` — рамка сегмента;
2. `template` — рамка з новим `key`;
3. `error` — React error boundary;
4. `loading` — межа `<Suspense>`;
5. `not-found` — межа для `notFound()`;
6. `page` — або вкладений `layout` наступного сегмента.

Спрощено це виглядає так (псевдокод, а не файл проєкту):

```text
<Layout>
  <Template key={…}>
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <NotFoundBoundary fallback={<NotFound />}>
          <Page />  або  <Layout наступного сегмента>…
```

Кожен пункт необовʼязковий, крім того, що потрібно для самої адреси: немає `template.tsx` — немає й цього шару, решта зсувається. Порядок при цьому не змінюється ніколи, і **ти не можеш його налаштувати**: назва файлу визначає його місце.

Останній рядок — ключ до вкладених маршрутів. На місці `page` може стояти **вкладений layout дочірнього сегмента**, а під ним — уся та сама шестиповерхова конструкція для дочірнього сегмента. Тобто компоненти сегмента рендеряться **всередині** компонентів батьківського сегмента, рекурсивно до листа.

Ось як виглядають файли сегмента `dashboard`:

```tsx
// app/dashboard/layout.tsx — обгортає /dashboard і все глибше
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <nav>Меню дашборду · dashboard/layout</nav>
      {children}
    </section>
  )
}
```

```tsx
// app/dashboard/template.tsx — як layout, але з новим key на кожну навігацію сегмента
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <div data-template="dashboard">{children}</div>
}
```

```tsx
// app/dashboard/loading.tsx — Suspense fallback для page і вкладених сегментів
export default function DashboardLoading() {
  return <p>Завантаження…</p>
}
```

```tsx
// app/dashboard/not-found.tsx — спрацьовує на notFound() у сегментах дашборду
export default function DashboardNotFound() {
  return <p>Такої команди немає · dashboard/not-found</p>
}
```

`children` у layout і template — це «все, що нижче за порядком»: для template це межі й сторінка, для layout — template з усім вмістом. Порівняння layout і template, а також route groups — у [[Next.js - 02. Layouts, templates і route groups|темі 02]]. Тут нам важливий лише порядок.

> [!diagram] /dashboard/settings: що в що вкладено
> ```yaml
> layout: nest
> nodes:
>   - { id: rl, label: "app/layout.tsx", text: "<html><body> · шапка", tone: blue, icon: "px:house" }
>   - { id: rb, label: "app/error.tsx → app/not-found.tsx", text: "межі кореня", note: "template і loading у корені немає", parent: rl, tone: orange }
>   - { id: dl, label: "dashboard/layout.tsx", text: "меню дашборду", parent: rb, tone: violet, icon: "px:matryoshka" }
>   - { id: dt, label: "dashboard/template.tsx", text: "новий key на навігацію", parent: dl, tone: violet }
>   - { id: db, label: "dashboard/error → loading → not-found", text: "error boundary · Suspense · not-found boundary", parent: dt, tone: orange, icon: "px:shield" }
>   - { id: pg, label: "settings/page.tsx", text: "Налаштування", note: "лист без власних меж", parent: db, tone: green, icon: "px:file" }
> steps:
>   - { show: rl, note: "Зовнішній шар — root layout. Він єдиний містить <html> і <body>, і все інше рендериться в його body." }
>   - { show: rb, note: "У корені немає template і loading, тож одразу йдуть межі error і not-found. Усе нижче — всередині них." }
>   - { show: dl, note: "Сегмент dashboard повністю вкладено в межі кореня. Тому помилку в dashboard/layout.tsx ловить app/error.tsx." }
>   - { show: dt, note: "Template стоїть під layout свого сегмента, але над його межами." }
>   - { show: db, note: "Межі dashboard обгортають тільки те, що під template. Свій layout і свій template вони не бачать." }
>   - { show: pg, note: "settings має лише page.tsx. Власних меж у нього немає, тож для нього працюють межі dashboard." }
> ```
> Кожна межа захищає лише те, що всередині неї. Що вище — не її відповідальність.

> [!quiz] Перевір себе: склади порядок обгортання сегмента
> level: junior · type: order · id: nextjs-core-01-quiz-04
>
> Сегмент містить усі шість файлів. Склади їх від зовнішнього до внутрішнього.
>
> ```order
> layout.tsx
> template.tsx
> error.tsx
> loading.tsx
> not-found.tsx
> page.tsx
> global-error.tsx ✗
> ```
>
> **Пояснення:** рамки (`layout`, потім `template`) — зовні, межі (`error` → `loading` → `not-found`) — під ними, сторінка — в самому центрі. `global-error` у цей ланцюжок не входить: він живе лише в корені й **замінює** root layout, коли той падає.

### 💥 Наслідки порядку: помилки, завантаження, 404

З порядку випливають три правила, які пояснюють більшість «дивних» поведінок App Router.

**1. `error.tsx` не ловить помилки свого layout і template.** Межа помилок сегмента лежить **під** його layout, тож помилку в layout перехоплює `error.tsx` батьківського сегмента. Саме це було в 🤔 Передбач: `crash/layout.tsx` кидає, і на екрані `app/error.tsx` всередині root layout. Що, якщо падає сам root layout? Над ним немає жодного `error.tsx` — тут працює `global-error.tsx`. Він **замінює** root layout, тому мусить мати власні `<html>` і `<body>` і власні стилі.

**2. `loading.tsx` не показує fallback для свого layout.** Межа `<Suspense>` сегмента теж лежить під його layout. Якщо `dashboard/layout.tsx` чекає повільні дані, `dashboard/loading.tsx` не допоможе. Без Cache Components навігація просто чекатиме layout; з `cacheComponents: true` Next.js на збірці вимагає обгорнути такі дані в layout у власний `<Suspense>`. Правило з документації: повільні дані — у `page`, або окремий `<Suspense>` всередині layout. Streaming і межі Suspense — тема 11.

**3. `not-found.tsx` лежить усередині `loading` і `error`.** Тому `notFound()` у сторінці під `loading.tsx` дає несподіваний статус-код. Ось сторінка команди:

```tsx
// app/dashboard/[team]/page.tsx → /dashboard/design, /dashboard/sales…
import { notFound } from 'next/navigation'

const teams = ['design', 'sales']

export function generateStaticParams() {
  return teams.map((team) => ({ team }))
}

export default async function TeamPage({ params }: PageProps<'/dashboard/[team]'>) {
  const { team } = await params
  if (!teams.includes(team)) notFound() // → найближчий not-found.tsx: app/dashboard/not-found.tsx
  return <h1>Команда {team}</h1>
}
```

`PageProps<'/dashboard/[team]'>` — глобальний тип-хелпер, який Next.js генерує під час `next dev` і `next build`; `params` — Promise, тому `await`. Динамічні сегменти й `generateStaticParams` — у [[Next.js - 03. Динамічні маршрути|темі 03]].

> [!note] Чому в прикладах дані в памʼяті
> Приклади курсу зібрані з `cacheComponents: true`. Справжній запит до БД у сторінці зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують (`'use cache'`) або обгортають у `<Suspense>` — про це в темах 11–12, 14–16. Тут список команд — масив у памʼяті.

Що показує `next build && next start` (перевірено `curl`):

- `/dashboard/design` — `200`, меню дашборду і «Команда design»: сторінку пререндерено за `generateStaticParams`.
- `/dashboard/ghost` — **`200`**, а не `404`. Команди немає в списку, тож сторінка рендериться під час запиту. Відповідь стрімиться: спершу оболонка з меню й «Завантаження…» з `loading.tsx`, потім у тому самому потоці — «Такої команди немає». Заголовки вже пішли зі статусом 200, тож Next.js додає `<meta name="robots" content="noindex">`, щоб пошуковик не індексував сторінку.
- Меню дашборду лишається на екрані: `dashboard/not-found.tsx` рендериться **всередині** `dashboard/layout.tsx`.

Документація так і пише: `not-found` повертає `404` для звичайних відповідей і `200` для стрімінгових. Сторінка без `loading.tsx` над нею, що викликає `notFound()`, дасть справжній `404` — ми перевіримо це нижче.

> [!quiz] Що поверне сервер?
> level: middle · type: output · id: nextjs-core-01-quiz-05
>
> Дерево з прикладу вище: `dashboard/` має `layout`, `loading` і `not-found`, а `[team]/page.tsx` викликає `notFound()` для невідомої команди. Продакшн-збірка, `curl -i /dashboard/ghost`. Що у відповіді?
>
> - [ ] `404` і лише текст «Такої команди немає», без меню
> - [x] `200`, меню дашборду, «Завантаження…», а далі в потоці «Такої команди немає» і `noindex`
> - [ ] `404` і root `app/not-found.tsx`: невідомий параметр — це URL без збігу
> - [ ] `500`: `notFound()` у стрімінговій відповіді — помилка
>
> **Пояснення:** URL **збігся** з `[team]`, тож це не «URL без збігу», а `notFound()` у сторінці — його ловить найближчий `dashboard/not-found.tsx` усередині layout. `loading.tsx` вище робить відповідь стрімінговою: статус 200 відправлено до того, як сторінка вирішила, що команди немає. Тому Next.js додає `noindex`.

### 🔁 Вкладені сегменти: найближча межа вгору

Межі вкладені рекурсивно, тож правило пошуку просте: **спрацьовує найближча межа вище за місцем, де сталася подія**. Помилка в `settings/page.tsx` піднімається вгору по дереву React: її першою зустріне `dashboard/error.tsx`, бо `settings` власної межі не має. Помилка в `dashboard/page.tsx` — те саме. Помилка в `dashboard/layout.tsx` проскакує межі `dashboard` (вони під ним) і потрапляє в `app/error.tsx`.

Те саме з `notFound()`: виклик у `[team]/page.tsx` шукає найближчий `not-found.tsx` угору — `dashboard/not-found.tsx`. Не знайде в `dashboard` — візьме `app/not-found.tsx`. З `loading.tsx` так само: сторінка `settings` під час очікування покаже fallback з `dashboard/loading.tsx`.

Чому межі не дублюють на кожному рівні? Бо зазвичай достатньо двох-трьох: корінь (загальна помилка), розділ (помилка дашборду зі збереженим меню) і, можливо, критичний віджет. Межа ближче до місця помилки зберігає більше робочого UI навколо: при помилці в `settings` меню дашборду лишається, і користувач може піти в інший розділ, не перезавантажуючи сторінку. Детально про межі помилок, `global-error`, `retry()` і помилки hydration — [[Next.js - 13. Помилки й межі помилок|тема 13]].

> [!quiz] Перевір себе: що залишиться на екрані?
> level: junior · type: output · id: nextjs-core-01-quiz-06
>
> Дерево дашборду з цієї теми. `app/dashboard/settings/page.tsx` кидає помилку під час рендера. Що бачить користувач?
>
> - [x] Шапку root layout, меню дашборду і «Помилка · dashboard/error.tsx»
> - [ ] Шапку root layout і «Помилка · app/error.tsx» — меню дашборду зникає
> - [ ] Лише «Помилка · dashboard/error.tsx» — межа замінює все дерево
> - [ ] `global-error`, бо в `settings/` немає власного `error.tsx`
>
> **Пояснення:** найближча межа вгору від `settings/page.tsx` — `dashboard/error.tsx`. Вона лежить під `dashboard/layout.tsx` і `dashboard/template.tsx`, тож меню лишається, а замінюється лише вміст межі. `global-error` спрацьовує лише тоді, коли падає root layout.

### 🧭 Як URL перетворюється на набір файлів

Тепер зберемо все разом: що робить Next.js, коли приходить запит на `/dashboard/design`. Спрощено — у п'ять кроків.

**1. Розбити шлях на сегменти:** `['dashboard', 'design']`. Корінь `/` — це порожній список.

**2. Знайти лист у дереві.** Next.js шукає маршрут, у якому сегменти папок (без груп, приватних папок і слотів) збігаються з сегментами URL. Якщо підходить кілька, виграє **найконкретніший**, сегмент за сегментом зліва направо:

1. статичний сегмент (`settings`);
2. динамічний (`[team]`);
3. catch-all (`[...slug]`);
4. optional catch-all (`[[...slug]]`).

Для `/dashboard/design` статичного `design/` немає, тож збігається `[team]` з `params = { team: 'design' }`. А `/dashboard/settings` збігається і з `settings/`, і з `[team]/` — виграє статичний. Пріоритет не «жадібний»: якщо статичний сегмент збігся, але далі шлях обірвався, Next.js пробує динамічний. Перевірено на 16.3.8: з `blog/new/page.tsx` і `blog/[slug]/edit/page.tsx` адреса `/blog/new` відкриває статичну сторінку, а `/blog/new/edit` — `[slug]/edit` зі `slug: 'new'`.

**3. Зібрати файли на шляху від кореня до листа.** На кожному рівні, **включно з route groups**, Next.js бере `layout`, `template`, `error`, `loading` і `not-found` (і експериментальні `forbidden` / `unauthorized`), а з листа — `page`. Route group не додає сегмент URL, але її `layout.tsx` у ланцюжок потрапляє — для цього групи й існують.

**4. Скласти дерево за ієрархією** з попереднього розділу, рекурсивно від root layout до `page`.

**5. Якщо листа не знайдено**, рендериться кореневий `app/not-found.tsx` у root layout зі статусом `404` — або `global-not-found.tsx`, якщо його ввімкнено. Вкладені layouts і `not-found.tsx` у цьому випадку не беруть участі. Перевірено: `/dashboard/settings/x` показує шапку root layout і «404 · root not-found» **без** меню дашборду, хоча дві третини шляху збіглися. Глибші `not-found.tsx` спрацьовують лише на явний `notFound()`.

> [!diagram] Як Next.js розвʼязує /dashboard/design
> ```yaml
> layout: flow
> nodes:
>   - { id: url, label: "запит", text: "/dashboard/design", tone: gray, icon: "px:globe" }
>   - { id: segs, label: "сегменти", text: "['dashboard', 'design']", tone: blue }
>   - { id: match, label: "пошук листа", text: "dashboard → [team]", note: "статичного design/ немає", tone: violet, icon: "px:magnifier" }
>   - { id: files, label: "файли на шляху", text: "2 layouts · template · межі", note: "params = { team: 'design' }", tone: yellow, icon: "px:folder" }
>   - { id: tree, label: "React-дерево", text: "layout → … → page", note: "за ієрархією сегментів", tone: green, icon: "px:matryoshka" }
> edges:
>   - { from: url, to: segs, label: "split('/')" }
>   - { from: segs, to: match, label: "зліва направо" }
>   - { from: match, to: files, label: "шлях у дереві" }
>   - { from: files, to: tree, label: "рекурсивно" }
> steps:
>   - { focus: url, note: "Приходить запит на /dashboard/design. Next.js працює зі шляхом, без query-рядка." }
>   - { move: { from: url, to: segs, value: "2 сегменти" }, note: "Шлях ділиться на сегменти. Корінь / відповідає порожньому списку." }
>   - { move: { from: segs, to: match, value: "'design'" }, note: "dashboard збігається зі статичною папкою. Для design статичної папки немає, тож збігається динамічна [team]." }
>   - { move: { from: match, to: files, value: "team = 'design'" }, note: "На шляху app → dashboard → [team] Next.js збирає layouts, template, межі і page листа. Значення сегмента йде в params." }
>   - { move: { from: files, to: tree, value: "дерево" }, note: "Файли складаються за ієрархією: root layout, межі кореня, layout дашборду, template, межі дашборду, сторінка команди." }
> ```
> Якби лист не знайшовся, після другого кроку Next.js одразу взяв би кореневий `not-found.tsx`.

> [!quiz] Перевір себе: яку сторінку відкриє URL?
> level: middle · type: output · id: nextjs-core-01-quiz-07
>
> ```text
> app/blog/page.tsx
> app/blog/new/page.tsx
> app/blog/[slug]/page.tsx
> app/blog/[slug]/edit/page.tsx
> app/blog/_drafts/edit/page.tsx
> ```
>
> Яку сторінку відкриє `/blog/new/edit`?
>
> - [ ] `blog/new/page.tsx` — статичний сегмент `new` виграє, решта шляху ігнорується
> - [x] `blog/[slug]/edit/page.tsx` з `params = { slug: 'new' }`
> - [ ] Кореневий 404: статичний `new` збігся, а `new/edit` не існує
> - [ ] `blog/_drafts/edit/page.tsx` — він теж закінчується на `edit`
>
> **Пояснення:** статичний сегмент має пріоритет, але лише якщо з ним збігається весь шлях. `blog/new/` не має `edit/`, тож Next.js пробує динамічний `[slug]` і знаходить `[slug]/edit`. Приватна папка `_drafts` у маршрутизації не бере участі взагалі. Перевірено на 16.3.8.

### 🏠 Root layout і що відбувається в корені

Root layout — найвищий `layout` у `app/`. За документацією він **обовʼязковий** і **мусить** містити `<html>` і `<body>`: усі інші layouts, сторінки й межі рендеряться в його `<body>`.

```tsx
// app/layout.tsx — root layout: єдиний з <html> і <body>
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <header>Акме · root layout</header>
        {children}
      </body>
    </html>
  )
}
```

Кілька правил кореня:

- `<head>`, `<title>` і `<meta>` вручну не пишуть: для цього Metadata API (`metadata`, `generateMetadata`), який сам дедуплікує теги й працює зі streaming.
- Root layout може бути кількох — по одному в route groups, наприклад `app/(shop)/layout.tsx` і `app/(marketing)/layout.tsx`. Тоді перехід між ними — повне перезавантаження сторінки. Як це влаштувати — [[Next.js - 02. Layouts, templates і route groups|тема 02]].
- Root layout може лежати під динамічним сегментом (`app/[lang]/layout.tsx` для i18n). Такі сегменти до root layout називаються root params.
- Помилку root layout ловить лише `global-error.tsx` — свого `error.tsx` над ним бути не може.

> [!warning] Розбіжність з документацією: збірка не перевіряє root layout
> [layout.js → Root Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout) каже, що `app` **must** мати root layout, а той **must** містити `<html>` і `<body>`. На Next.js 16.3.8 `next build` проходить і з root layout без цих тегів, і зовсім без `app/layout.tsx`. Помилку видно лише в `next dev`, у вікні помилки в браузері: `Missing <html> and <body> tags in the root layout.` А без файлу layout мовчить і `next dev`: HTML приходить без `<html>` і `<body>`, браузер добудовує їх сам. Не покладайся на збірку — тримай root layout з обома тегами завжди.

> [!quiz] Перевір себе: заповни пропуски в межі помилок дашборду
> level: junior · type: fill · bank: 'use server', reset, loading · id: nextjs-core-01-quiz-08
>
> ```tsx fill
> // app/dashboard/[[error]].tsx
> [['use client'|"use client"]]
>
> export default function DashboardError({ [[retry]] }: { error: Error; retry: () => void }) {
>   return (
>     <div>
>       <p>Помилка · dashboard/error.tsx</p>
>       <button onClick={() => retry()}>Спробувати ще</button>
>     </div>
>   )
> }
> ```
>
> **Пояснення:** межу помилок дає файл `error.tsx`, і він мусить бути Client Component — інакше збірка падає. З Next.js 16.3 стабільна функція `retry` заново отримує дані й рендерить вміст межі; `reset` лише скидає стан без нового запиту. `loading` — інший спеціальний файл, а `'use server'` позначає Server Functions.

### 🗂️ Colocation, приватні папки і src/

Документація свідомо **не нав'язує** структуру проєкту. Але дає три інструменти, і їх варто розуміти точно.

**Colocation безпечна за замовчуванням.** Адресу дає лише `page` або `route`, і клієнту йде лише те, що повертають ці файли. Тож компонент, тест, стилі чи дані можна покласти поруч зі сторінкою — за URL їх не відкрити. Перевірено: `/dashboard/_components/stat-card` і будь-який інший шлях до звичайного модуля дає `404`.

```tsx
// app/dashboard/_components/stat-card.tsx — приватна папка: не маршрут
export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <p>
      {label}: <b>{value}</b>
    </p>
  )
}
```

```tsx
// app/dashboard/page.tsx → /dashboard
import { StatCard } from './_components/stat-card'

export default function DashboardPage() {
  return (
    <>
      <h1>Огляд</h1>
      <StatCard label="Замовлення" value={42} />
    </>
  )
}
```

**Але безпечна лише для назв, які не є спеціальними.** Colocation ламається, коли допоміжний файл випадково має зарезервовану назву. Класика — «шаблон листа» з назвою `template.tsx`:

```tsx
// app/shop/template.tsx — ❌ «шаблон листа», а не спеціальний файл
export default function OrderEmailTemplate() {
  return <p>Дякуємо за замовлення!</p>
}
```

Next.js бачить `template.tsx` у сегменті `shop` і ставить компонент **над** сторінкою. Компонент не рендерить `children`, тож на `/shop` замість каталогу — «Дякуємо за замовлення!». Збірка мовчить: перевірено на 16.3.8, у HTML сторінки `/shop` тексту каталогу немає. Так само небезпечні `loading.tsx`, `error.tsx`, `default.tsx`, `route.ts` (з експортом `GET` стане публічним ендпоінтом), `icon.tsx`, `sitemap.ts`.

**Приватні папки `_folder` вимикають маршрутизацію** для папки й усіх вкладених. Навіть `app/_lib/secret/page.tsx` не стане адресою (перевірено: `/_lib/secret` — `404`). Для colocation вони не обовʼязкові, але корисні: видно, що «тут не маршрути», спеціальні назви всередині нічого не ламають, а майбутні конвенції Next.js не перетнуться з твоїми папками. Потрібен сегмент URL, що справді починається з підкреслення, — назви папку `%5Fdrafts`.

**Папка `src/`** відокремлює код застосунку від конфігів. `app` переїжджає в `src/app`, разом з ним зазвичай `components` і `lib`. У корені лишаються `public/`, `package.json`, `next.config.ts`, `tsconfig.json` і `.env*`, а `proxy.ts` переїжджає в `src/`. Аліас `@/*` у `tsconfig.json` має вказувати на `./src/*`.

Одна пастка: **якщо в корені є `app/`, то `src/app/` ігнорується**. Мовчки. Перевірено на 16.3.8: з `app/page.tsx` у корені й `src/app/srconly/page.tsx` таблиця маршрутів після `next build` містить лише `/`, без жодного попередження. Буває після злиття гілок чи «тимчасової» папки `app` для експерименту.

> [!quiz] Перевір себе: що відкриється?
> level: junior · id: nextjs-core-01-quiz-09
>
> У проєкті після злиття гілок є і `app/page.tsx` («Стара головна»), і `src/app/page.tsx` з `src/app/pricing/page.tsx`. Що покаже `next build`?
>
> - [ ] Помилку збірки: дві папки `app`
> - [x] Маршрути лише з кореневої `app/`: `/` — «Стара головна», `/pricing` — 404
> - [ ] Маршрути з `src/app/`: `src` має пріоритет
> - [ ] Обʼєднання: `/` з кореня, `/pricing` з `src/app`
>
> **Пояснення:** документація прямо каже, що `src/app` ігнорується, якщо в корені є `app`. На 16.3.8 це відбувається без попередження, тож зайва папка може тихо «вимкнути» половину застосунку.

### ⚔️ Конфлікти маршрутів

Файлова маршрутизація має одну слабкість: два різні файли можуть претендувати на один URL. Ось чотири конфлікти, які варто впізнавати з першого погляду. Тексти — з `next build` 16.3.8.

**1. `page` і `route` в одному сегменті.** Кожен з них забирає **всі** HTTP-методи свого маршруту: сторінка відповідає на `GET` HTML-ом, а Server Actions приходять на неї як `POST`. Тож `route.ts` з одним лише `POST` поруч зі сторінкою — однаково конфлікт:

```text
Conflicting route and page at /x: route at /x/route and page at /x/page
```

Групи не рятують: `app/(site)/contact/page.tsx` і `app/contact/route.ts` дають `Conflicting route and page at /contact`. API кладуть в окремий сегмент — `app/api/health/route.ts`:

```ts
// app/api/health/route.ts → GET /api/health
export function GET() {
  return Response.json({ ok: true })
}
```

**2. Дві сторінки на один URL у різних групах.** `app/(a)/about/page.tsx` і `app/(b)/about/page.tsx` обидві дають `/about`:

```text
You cannot have two parallel pages that resolve to the same path. Please check /(a)/about and /(b).
```

На 16.3.8 повідомлення обрізане (`/(b)` замість `/(b)/about`), а слово «parallel» тут не про parallel routes — просто дві сторінки на одну адресу.

**3. Сторінка поруч з optional catch-all.** `app/docs/page.tsx` і `app/docs/[[...slug]]/page.tsx` обидві відповідають `/docs`:

```text
You cannot define a route with the same specificity as an optional catch-all route ("/docs" and "/docs/[[...slug]]").
```

**4. Різні імена динамічного сегмента на одному рівні.** Однакові позиції — однакові назви. `app/p/[id]/page.tsx` і `app/p/[slug]/page.tsx` поруч — збірка зупиняється з `Ambiguous app routes detected` (`/p/[id]` і `/p/[slug]` не розрізнити). А от `app/p/[id]/page.tsx` і `app/p/[slug]/edit/page.tsx` — підступніше.

> [!warning] Розбіжність: збірка проходить, а застосунок падає весь
> Документація не описує цей випадок окремо. На Next.js 16.3.8 дерево з `app/p/[id]/page.tsx` і `app/p/[slug]/edit/page.tsx` **проходить `next build`** (обидва маршрути в таблиці). Але `next start` відповідає `500` на **кожен** URL — навіть `/` і невідомі адреси, — а в лозі: `Error: You cannot use different slug names for the same dynamic path ('id' !== 'slug').` `next dev` падає на першому ж запиті з тим самим текстом. Тому однакові імена динамічних сегментів на одному рівні — правило, яке варто перевіряти в CI, а не сподіватися на збірку. Виправлення: `app/p/[id]/edit/page.tsx`.

`[id]` і `[...slug]` поруч — не конфлікт: це різні види сегментів з різним пріоритетом. Перевірено: `/shop/7` відкриває `[id]`, `/shop/7/8` — `[...slug]`, а `/shop/sale` — статичний `sale/`.

> [!quiz] Перевір себе: яке дерево не збереться або впаде?
> level: middle · type: multi · id: nextjs-core-01-quiz-10
> - [x] `app/feed/page.tsx` + `app/feed/route.ts` з одним `GET` для RSS
> - [x] `app/(marketing)/pricing/page.tsx` + `app/(shop)/pricing/page.tsx`
> - [x] `app/u/[id]/page.tsx` + `app/u/[userId]/posts/page.tsx`
> - [ ] `app/shop/[id]/page.tsx` + `app/shop/[...slug]/page.tsx`
> - [ ] `app/api/feed/route.ts` + `app/feed/page.tsx`
> - [ ] `app/blog/_drafts/page.tsx` + `app/blog/page.tsx`
>
> **Пояснення:** `page` і `route` в одному сегменті конфліктують незалежно від методів. Дві групи без впливу на URL дають дві сторінки `/pricing`. `[id]` і `[userId]` на одному рівні — різні імена, і на 16.3.8 це вже не збірка, а `500` на всіх адресах. `[id]` і `[...slug]` — різні види сегментів, `api/feed` і `feed` — різні адреси, а приватна папка в маршрутизації не бере участі.

### 🧪 Експериментальні файли: global-not-found, forbidden, unauthorized

Три спеціальні файли працюють лише з експериментальними прапорцями. Спершу конфіг:

```ts
// next.config.ts — обидва прапорці експериментальні
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    globalNotFound: true, // app/global-not-found.tsx
    authInterrupts: true, // forbidden() / unauthorized() і їхні файли
  },
}

export default nextConfig
```

**`global-not-found.tsx`** (`experimental.globalNotFound`) — 404 для URL, що не збігся з жодним маршрутом. Next.js **пропускає звичайний рендер** і віддає цей файл напряму, без root layout. Тому файл мусить повернути повний документ з `<html>` і `<body>` і сам імпортувати глобальні стилі й шрифти. Навіщо він: коли root layouts кілька (у route groups) чи root layout під `[country]`, скласти одну 404 з `layout` + `not-found` складно — немає одного спільного layout.

```tsx
// app/global-not-found.tsx — повний документ: root layout тут не рендериться
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Акме' }

export default function GlobalNotFound() {
  return (
    <html lang="uk">
      <body>
        <h1>404 · global-not-found</h1>
      </body>
    </html>
  )
}
```

Перевірено на 16.3.8: `/nope` — `404`, «404 · global-not-found» з `<title>404 — Акме</title>` і **без** шапки root layout. А явний `notFound()` у сторінці так само рендерить `app/not-found.tsx` у root layout: `global-not-found` відповідає лише за URL без збігу.

**`forbidden.tsx` і `unauthorized.tsx`** (`experimental.authInterrupts`) — UI для функцій `forbidden()` (статус `403`) і `unauthorized()` (статус `401`) з `next/navigation`. Працюють як `not-found.tsx`: найближчий файл вгору по дереву, усередині layout свого сегмента.

```tsx
// app/admin/forbidden.tsx — UI для forbidden() у цьому сегменті й глибше
export default function AdminForbidden() {
  return <p>Немає доступу · admin/forbidden</p>
}
```

```tsx
// app/admin/page.tsx
import { forbidden } from 'next/navigation'

export default function AdminPage() {
  const isAdmin = false // у справжньому коді — перевірка сесії в DAL
  if (!isAdmin) forbidden()
  return <h1>Адмінка</h1>
}
```

Перевірено: `/admin` — `403` з меню `admin/layout.tsx` і «Немає доступу». Цікава деталь, яку видно в RSC payload: для кожного сегмента Next.js передає роутеру поля `error`, `template`, `notFound`, `forbidden` і `unauthorized` — тобто ці три файли справді живуть на одному рівні ієрархії. Де робити перевірку доступу, щоб її не обійти, — розділ «Auth і безпека» курсу.

> [!quiz] Перевір себе: що побачить користувач?
> level: middle · id: nextjs-core-01-quiz-11
>
> Увімкнено `experimental.globalNotFound`, є `app/layout.tsx` з шапкою, `app/not-found.tsx` і `app/global-not-found.tsx`. Користувач відкриває `/nope` — такого маршруту немає. Що він отримає?
>
> - [ ] `404`, шапку root layout і `app/not-found.tsx`
> - [x] `404` і `global-not-found.tsx` як окремий документ, без шапки root layout
> - [ ] `404` і `global-not-found.tsx` всередині root layout
> - [ ] Помилку збірки: `not-found.tsx` і `global-not-found.tsx` не можуть бути разом
>
> **Пояснення:** для URL без збігу `global-not-found` пропускає звичайний рендер, тому root layout не бере участі й файл мусить мати власні `<html>` і `<body>`. `app/not-found.tsx` лишається для явних викликів `notFound()`. Обидва файли співіснують.

### 🏭 Як це роблять у продакшні

- **`app/` — для маршрутів, код — у фічах.** Поширені три стратегії з документації: увесь код поза `app/` (`components/`, `lib/` у корені чи в `src/`), спільний код у верхніх папках усередині `app/`, або «за фічами» — спільне в корені, специфічне поруч із маршрутом. Яку б не обрали, головне — однаково по всьому проєкту.
- **Colocation — лише в приватних папках.** Командне правило «поруч зі сторінкою — тільки `_components/`, `_lib/`, `_hooks/`» прибирає цілий клас багів зі спеціальними назвами й робить дерево читабельним: усе без `_` — маршрути.
- **Межі за рівнями.** `app/global-error.tsx` + `app/error.tsx` + `app/not-found.tsx` — обовʼязковий мінімум; `error.tsx` і `not-found.tsx` — на рівні кожного великого розділу (дашборд, акаунт), щоб помилка не забирала навігацію розділу. `loading.tsx` — там, де справді є повільні дані в сторінках.
- **Повільні дані — не в layout.** Layout рендериться над межами свого сегмента, тож його очікування не покриє `loading.tsx`, а його помилку зловить лише батьківська межа. У layout — оболонка й навігація, дані — у сторінці або в окремому `<Suspense>`.
- **API — в окремому сегменті.** `app/api/*` або інший префікс для Route Handlers, щоб `page` і `route` ніколи не зустрілися, а matcher proxy і правила CDN легко відрізняли API від сторінок.
- **Таблиця маршрутів — у code review.** Вивід `next build` (`Route (app)`) показує всі публічні адреси. Нова адреса, якої не чекали, — найшвидший спосіб помітити випадковий `page.tsx` чи `route.ts`. Лінтер на назви динамічних сегментів (одна позиція — одна назва) ловить конфлікт, який збірка 16.3.8 пропускає.
- **`src/` — рішення на старті.** Переносити `app` у `src` посеред проєкту можна, але треба синхронно оновити аліаси, Tailwind-сканування й місце `proxy.ts`, і переконатися, що в корені не лишилось старої `app/`.

## ⚠️ Пастки

> [!pitfall] error.tsx поруч із layout «ловить» його помилки
> Не ловить: межа сегмента лежить під його layout і template. Помилку layout бачить батьківський `error.tsx`, а помилку root layout — лише `global-error.tsx`.
>
> ```text
> app/dashboard/layout.tsx   throw → ловить app/error.tsx
> app/dashboard/error.tsx    ловить page, вкладені сегменти — не свій layout
> ```

> [!pitfall] loading.tsx для повільного layout
> `loading.tsx` — межа `<Suspense>` під layout свого сегмента. Повільні дані в layout вона не покриє: без Cache Components навігація чекатиме, з ними — помилка збірки. Перенеси дані в `page` або обгорни їх у власний `<Suspense>` в layout.

> [!pitfall] Допоміжний файл зі спеціальною назвою
> `template.tsx` як «шаблон листа», `loading.tsx` як спінер, `route.ts` як утиліта маршрутів — Next.js сприйме їх буквально. Збірка мовчить, а сторінка зникає чи зʼявляється публічний ендпоінт.
>
> ```text
> app/shop/template.tsx      ❌ ставиться над page.tsx
> app/shop/_emails/order.tsx ✅ приватна папка, звичайна назва
> ```

> [!pitfall] Різні імена динамічних сегментів на одному рівні
> На 16.3.8 збірка зелена, а продакшн віддає `500` на всі URL: `You cannot use different slug names for the same dynamic path ('id' !== 'slug')`.
>
> ```text
> app/p/[id]/page.tsx
> app/p/[slug]/edit/page.tsx   ❌ → app/p/[id]/edit/page.tsx
> ```

> [!pitfall] Забута app/ поруч із src/app/
> `src/app` ігнорується мовчки, якщо в корені є `app`. Половина маршрутів «зникає» без жодної помилки — дивись таблицю маршрутів після `next build`.

> [!pitfall] notFound() під loading.tsx повертає 200
> Стрімінгова відповідь уже відправила статус 200, коли сторінка викликала `notFound()`. Next.js додає `noindex`, але моніторинг і кеші бачать 200. Де статус критичний, перевіряй існування даних до межі `loading.tsx` або зроби сторінку статичною для відомих значень.

## 🎤 На співбесіді

> [!interview] Як App Router перетворює URL на те, що бачить користувач?
> level: junior · frequency: дуже часто · id: nextjs-core-01-int-01
>
> ---
>
> Папки в `app/` — сегменти маршруту; адреса публічна, коли в листі є `page` або `route`. Next.js ділить шлях на сегменти й шукає найконкретніший збіг (статичний → `[x]` → `[...x]` → `[[...x]]`), пропускаючи route groups і приватні папки. Потім збирає спеціальні файли на шляху від кореня до листа й складає їх у кожному сегменті в порядку `layout → template → error → loading → not-found → page`, рекурсивно вкладаючи дочірній сегмент на місце `page`. Немає збігу — кореневий `not-found` зі статусом 404.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🧭 Як URL перетворюється на набір файлів|Розділ: URL → файли]] · [Next.js: Project structure](https://nextjs.org/docs/app/getting-started/project-structure) · [Next.js: Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

> [!interview] Чому error.tsx не ловить помилку layout.tsx з тієї самої папки? Як зловити помилку root layout?
> level: middle · frequency: часто · id: nextjs-core-01-int-02
>
> ---
>
> Бо в ієрархії сегмента error boundary стоїть **під** `layout` і `template`: межа обгортає лише `loading`, `not-found`, `page` і вкладені сегменти. Помилка в layout піднімається до межі батьківського сегмента. Над root layout `error.tsx` немає, тому для нього є `global-error.tsx` — Client Component з власними `<html>` і `<body>`, який замінює root layout, коли той падає. Те саме з `loading.tsx`: він не покриває повільний layout свого сегмента.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#💥 Наслідки порядку: помилки, завантаження, 404|Розділ: наслідки порядку]] · [Next.js: error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error) · [Next.js: Component hierarchy](https://nextjs.org/docs/app/getting-started/project-structure#component-hierarchy)

> [!interview] Як організуєш файли великого Next.js-проєкту? Що можна тримати в app/?
> level: middle · frequency: часто · id: nextjs-core-01-int-03
>
> ---
>
> Адресу дає лише `page` або `route`, тож colocation безпечна — але тільки поки допоміжні файли не мають спеціальних назв (`template`, `loading`, `route`, `icon`). Тому в команді я б тримав поруч із маршрутами лише приватні папки `_components`, `_lib`, спільне — у `src/components`, `src/lib`, а групи `(shop)`, `(marketing)` — для layouts розділів. `src/` вирішується на старті: у корені лишаються `public`, конфіги, `.env`, а стара `app/` у корені тихо вимкне `src/app`. Контроль — таблиця маршрутів після `next build` у code review.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🗂️ Colocation, приватні папки і src/|Розділ: colocation]] · [Next.js: Organizing your project](https://nextjs.org/docs/app/getting-started/project-structure#organizing-your-project) · [Next.js: src folder](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

> [!interview] not-found.tsx, global-not-found.tsx і notFound(): що коли спрацьовує і з яким статусом?
> level: middle · frequency: іноді · id: nextjs-core-01-int-04
>
> ---
>
> `notFound()` кидає спеціальний виняток, і його ловить найближчий `not-found.tsx` угору по дереву, усередині layout свого сегмента. URL без жодного збігу обробляє кореневий `app/not-found.tsx` у root layout — вкладені layouts не беруть участі. Експериментальний `global-not-found.tsx` (`experimental.globalNotFound`) перехоплює лише URL без збігу, пропускає рендер і віддає повний документ без root layout — для кількох root layouts. Статус: `404` для звичайної відповіді, але `200` + `noindex`, якщо відповідь уже стрімилась (наприклад, через `loading.tsx` над сторінкою).
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🧪 Експериментальні файли: global-not-found, forbidden, unauthorized|Розділ: експериментальні файли]] · [Next.js: not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) · [Next.js: loading.js — Status Codes](https://nextjs.org/docs/app/api-reference/file-conventions/loading#status-codes)

> [!interview] Чому route.ts і page.tsx не можуть бути в одному сегменті? Коли тобі потрібен Route Handler?
> level: senior · frequency: іноді · id: nextjs-core-01-int-05
>
> ---
>
> Кожен з них забирає **всі** HTTP-методи маршруту: сторінка відповідає на `GET` і приймає Server Actions як `POST` на свою адресу, тож `route.ts` навіть з одним `POST` не має куди вбудуватися — `next build` падає з `Conflicting route and page`. Route groups не допомагають: конфлікт рахується за URL. Route Handler — найнижчий примітив: без layouts і навігації на клієнті. Він потрібен для вебхуків, RSS, файлів, публічного API для мобільного клієнта; для мутацій з власного UI зазвичай досить Server Actions. API кладуть в окремий сегмент, наприклад `app/api/*`.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#⚔️ Конфлікти маршрутів|Розділ: конфлікти]] · [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) · [Next.js: route.js](https://nextjs.org/docs/app/api-reference/file-conventions/route)

## 🔗 Звʼязки

- [[Next.js Start - 07. Сторінки й layouts]] — перший сайт з `page`, `layout` і `not-found`: звідси ми прийшли.
- [[Next.js - 02. Layouts, templates і route groups]] — layout проти template, route groups, кілька root layouts.
- [[Next.js - 03. Динамічні маршрути]] — `[slug]`, catch-all, async `params`, `generateStaticParams`.
- [[Next.js - 05. Parallel і intercepting routes]] — слоти `@name`, `default.js`, модалки з URL.
- [[Next.js - 07. Server і Client Components]] — чому `error.tsx` мусить бути Client Component, а решта файлів серверні.
- [[Next.js - 13. Помилки й межі помилок]] — `error`, `global-error`, `retry()`, `forbidden` / `unauthorized` детально.
- Далі в курсі: тема 04 — навігація й prefetching, тема 11 — streaming і межі Suspense, тема 33 — metadata-файли.

## ⚡ Фішки

> [!reel] 🪆 Шість файлів — один незмінний порядок
> У кожному сегменті Next.js складає файли однаково: `layout → template → error → loading → not-found → page`. Порядок не налаштовується — місце визначає назва файлу.

> [!reel] 🧯 error.tsx не бачить свого layout
> Межа помилок сегмента стоїть під його layout. Падає layout — спрацьовує `error.tsx` батька, а для root layout — лише `global-error.tsx`.

> [!reel] 📮 notFound() може повернути 200
> Якщо над сторінкою є `loading.tsx`, відповідь уже стрімиться зі статусом 200, коли сторінка кличе `notFound()`. Next.js рятує SEO, додаючи `noindex`.

> [!reel] 🕳️ Помилка в імені параметра кладе весь сайт
> `app/p/[id]/page.tsx` і `app/p/[slug]/edit/page.tsx`: на 16.3.8 `next build` зелений, а `next start` віддає 500 на кожен URL, навіть на `/`.

> [!reel] ✉️ template.tsx — не шаблон листа
> Назва файлу в `app/` — це API. «Шаблон листа» з назвою `template.tsx` стане над сторінкою, і замість каталогу користувач побачить «Дякуємо за замовлення!».

> [!reel] 🙈 src/app може тихо вимкнутись
> Якщо в корені проєкту є `app/`, Next.js ігнорує `src/app/` без жодного попередження. Перевіряй таблицю маршрутів після збірки.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Коли папка в app/ стає публічною адресою?
> *дуже часто · теорія* · `nextjs-core-01-card-01`
>
> Коли в ній є `page` (UI) або `route` (Route Handler). Папка лише з компонентами чи `layout.tsx` дає сегмент, але сама адреса — 404.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🌳 Дерево сегментів|Розділ: дерево сегментів]] · [Next.js: Colocation](https://nextjs.org/docs/app/getting-started/project-structure#colocation)

> [!question]- Назви порядок обгортання спеціальних файлів у сегменті
> *дуже часто · теорія* · `nextjs-core-01-card-02`
>
> `layout` → `template` → `error` (error boundary) → `loading` (Suspense) → `not-found` → `page` або вкладений `layout` дочірнього сегмента. Відсутні файли просто пропускаються, порядок не змінюється.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🪆 Ієрархія рендеру: що в що вкладено|Розділ: ієрархія рендеру]] · [Next.js: Component hierarchy](https://nextjs.org/docs/app/getting-started/project-structure#component-hierarchy)

> [!question]- Які папки не потрапляють в URL?
> *часто · теорія* · `nextjs-core-01-card-03`
>
> Route groups `(name)`, приватні папки `_name` (разом з усім вмістом), слоти `@name` і intercepting-папки `(.)name`. Для сегмента, що справді починається з `_`, — `%5Fname`.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🌳 Дерево сегментів|Розділ: дерево сегментів]] · [Next.js: Private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders)

> [!question]- Який спеціальний файл мусить бути Client Component і чому?
> *часто · код* · `nextjs-core-01-card-04`
>
> `error` і `global-error`: React error boundary працює на клієнті й показує fallback з кнопкою `retry`. Без `'use client'` збірка падає з `app/error.tsx must be a Client Component`.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#📄 Спеціальні файли: повний каталог|Розділ: каталог файлів]] · [Next.js: error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)

> [!question]- Що вимагається від root layout?
> *часто · теорія* · `nextjs-core-01-card-05`
>
> Він обовʼязковий і містить `<html>` і `<body>`; `<head>`-теги задає Metadata API. На 16.3.8 перевіряє це лише `next dev` (`Missing <html> and <body> tags in the root layout.`), збірка мовчить.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🏠 Root layout і що відбувається в корені|Розділ: root layout]] · [Next.js: Root Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)

### 🟡 Middle

> [!question]- Який error.tsx зловить помилку в app/dashboard/layout.tsx?
> *дуже часто · практика* · `nextjs-core-01-card-06`
>
> Не `dashboard/error.tsx`, а найближчий вище — `app/error.tsx`: межа сегмента обгортає лише те, що під його layout і template. Помилку root layout ловить `global-error.tsx`.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#💥 Наслідки порядку: помилки, завантаження, 404|Розділ: наслідки порядку]] · [Next.js: error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)

> [!question]- Чому notFound() у сторінці може дати статус 200?
> *іноді · практика* · `nextjs-core-01-card-07`
>
> Якщо над сторінкою є межа Suspense (`loading.tsx`), відповідь стрімиться: статус 200 уже відправлено, коли сторінка викликала `notFound()`. Next.js додає `<meta name="robots" content="noindex">`.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#💥 Наслідки порядку: помилки, завантаження, 404|Розділ: наслідки порядку]] · [Next.js: loading.js — Status Codes](https://nextjs.org/docs/app/api-reference/file-conventions/loading#status-codes)

> [!question]- Як Next.js обирає між статичним, динамічним і catch-all сегментом?
> *часто · теорія* · `nextjs-core-01-card-08`
>
> Найконкретніший сегмент за сегментом зліва направо: статичний → динамічний → catch-all → optional catch-all. Пріоритет не жадібний: якщо після статичного шлях не збігся, пробується динамічний (`/blog/new/edit` → `[slug]/edit`).
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🧭 Як URL перетворюється на набір файлів|Розділ: URL → файли]] · [Next.js: Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

> [!question]- Що рендериться для URL, який не збігся з жодним маршрутом?
> *часто · теорія* · `nextjs-core-01-card-09`
>
> Кореневий `app/not-found.tsx` у root layout зі статусом 404 (або `global-not-found.tsx`, якщо ввімкнено). Вкладені layouts і `not-found.tsx` не беруть участі, навіть якщо частина шляху збіглася.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🧭 Як URL перетворюється на набір файлів|Розділ: URL → файли]] · [Next.js: not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

> [!question]- Що станеться, якщо в проєкті є і app/, і src/app/?
> *іноді · практика* · `nextjs-core-01-card-10`
>
> `src/app` ігнорується — на 16.3.8 без жодного попередження. Таблиця маршрутів після `next build` покаже лише маршрути з кореневої `app/`.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🗂️ Colocation, приватні папки і src/|Розділ: src/]] · [Next.js: src folder](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

### 🔴 Senior

> [!question]- Чому page.tsx і route.ts не можуть бути в одному сегменті?
> *іноді · теорія* · `nextjs-core-01-card-11`
>
> Кожен забирає всі HTTP-методи маршруту, а сторінка ще й приймає Server Actions як `POST`. Конфлікт рахується за URL, тож route groups не рятують: `Conflicting route and page at /contact`.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#⚔️ Конфлікти маршрутів|Розділ: конфлікти]] · [Next.js: Route Resolution](https://nextjs.org/docs/app/getting-started/route-handlers#route-resolution)

> [!question]- Чим небезпечні різні імена динамічних сегментів на одному рівні?
> *рідко · безпека* · `nextjs-core-01-card-12`
>
> Поруч — `Ambiguous app routes detected` на збірці. На різній глибині (`[id]/page`, `[slug]/edit/page`) на 16.3.8 збірка проходить, а сервер віддає 500 на всі URL. Ловити лінтером або тестом дерева в CI.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#⚔️ Конфлікти маршрутів|Розділ: конфлікти]] · [Next.js: Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

> [!question]- Навіщо global-not-found.tsx, якщо є app/not-found.tsx?
> *рідко · теорія* · `nextjs-core-01-card-13`
>
> Для застосунків без одного спільного root layout: кілька root layouts у групах або root layout під `[country]`. Файл (experimental, `globalNotFound`) пропускає рендер і віддає повний документ для URL без збігу; `notFound()` і далі обробляє `not-found.tsx`.
>
> 📚 [[Next.js - 01. App Router, сегменти і спеціальні файли#🧪 Експериментальні файли: global-not-found, forbidden, unauthorized|Розділ: експериментальні файли]] · [Next.js: global-not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found#global-not-foundjs-experimental)

## 🛠️ Практика

> [!task] Порядок файлів у сегменті
> level: junior · difficulty: easy · id: nextjs-core-01-task-01 · tags: app-router, hierarchy, special-files
>
> Напиши `segmentStack(files)`: `files` — імена файлів **однієї** папки сегмента. Поверни назви спеціальних файлів (без розширення) у порядку обгортання — від зовнішнього до внутрішнього.
>
> - враховуються лише `layout`, `template`, `error`, `loading`, `not-found`, `page` з розширеннями `.js`, `.jsx`, `.ts`, `.tsx`;
> - решта файлів — colocation: `button.tsx`, `page.module.css`, `layout.test.tsx` спеціальними **не** є;
> - `route` не бере участі в layouts: якщо в папці є `route`, поверни `['route']`;
> - `route` разом з `page` — конфлікт: `throw new Error(...)` зі словом `route` у тексті.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts
> segmentStack(['page.tsx', 'loading.tsx', 'layout.tsx']) // → ['layout', 'loading', 'page']
> ```
>
> ```ts starter
> function segmentStack(files: string[]): string[] {
>   // твій код
>   return []
> }
> ```
>
> ```ts tests
> test('повний набір — у порядку обгортання', () => {
>   const files = ['page.tsx', 'not-found.tsx', 'error.tsx', 'template.tsx', 'loading.tsx', 'layout.tsx']
>   expect(segmentStack(files)).toEqual(['layout', 'template', 'error', 'loading', 'not-found', 'page'])
> })
>
> test('ігнорує colocation, навіть з «page» і «layout» у назві', () => {
>   const files = ['layout.tsx', 'button.tsx', 'page.module.css', 'layout.test.tsx', 'utils.ts']
>   expect(segmentStack(files)).toEqual(['layout'])
> })
>
> test('приймає .js, .jsx, .ts і .tsx', () => {
>   expect(segmentStack(['page.js', 'error.jsx', 'loading.ts'])).toEqual(['error', 'loading', 'page'])
> })
>
> test('route не бере участі в layouts', () => {
>   expect(segmentStack(['layout.tsx', 'route.ts'])).toEqual(['route'])
> })
>
> test('page і route в одному сегменті — конфлікт', () => {
>   expect(() => segmentStack(['page.tsx', 'route.ts'])).toThrow('route')
> })
> ```
>
> > [!hint]- Підказка 1
> > `file.split('.')[0]` перетворить `page.module.css` на `page`. Перевіряй назву цілком регулярним виразом: `^(layout|template|…)\.(js|jsx|ts|tsx)$`.
>
> > [!hint]- Підказка 2
> > Збери знайдені назви в `Set`, а результат будуй, проходячи **фіксований** масив порядку й лишаючи те, що є в `Set`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > const ORDER = ['layout', 'template', 'error', 'loading', 'not-found', 'page']
> >
> > function segmentStack(files: string[]): string[] {
> >   const found = new Set<string>()
> >   for (const file of files) {
> >     const m = file.match(/^(layout|template|error|loading|not-found|page|route)\.(js|jsx|ts|tsx)$/)
> >     if (m) found.add(m[1])
> >   }
> >   if (found.has('route')) {
> >     if (found.has('page')) throw new Error('Conflicting route and page: route і page в одному сегменті')
> >     return ['route']
> >   }
> >   return ORDER.filter((name) => found.has(name))
> > }
> > ```
> >
> > Порядок не залежить від порядку файлів у папці — його задає Next.js, тому результат будуємо з фіксованого масиву. Повна перевірка назви важлива не лише для задачі: саме так Next.js відрізняє `page.tsx` від `page.module.css`.

> [!task] Розвʼяжи URL у файли
> level: middle · difficulty: medium · id: nextjs-core-01-task-02 · tags: app-router, routing, matching
>
> Напиши `resolveRoute(files, pathname)`: `files` — шляхи відносно `app/` (`'layout.tsx'`, `'(shop)/cart/page.tsx'`, `'blog/[slug]/page.tsx'`). Поверни `{ page, params, layouts }` або `null`, якщо маршруту немає.
>
> - `page` — файл `page.*` листа; `layouts` — усі `layout.*` на шляху від кореня до папки листа, **включно з route groups**, від зовнішнього до внутрішнього;
> - route groups `(x)` не є сегментами URL; папки на `_` і все під ними — поза маршрутизацією; `%5F` на початку назви — закодоване `_` (`decodeURIComponent`);
> - `[x]` — один сегмент (рядок), `[...x]` — один або більше (масив), `[[...x]]` — нуль або більше (масив; для нуля сегментів ключа немає);
> - кілька збігів → найконкретніший, сегмент за сегментом зліва направо: статичний < `[x]` < `[...x]` < `[[...x]]`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts
> resolveRoute(['layout.tsx', 'page.tsx'], '/') // → { page: 'page.tsx', params: {}, layouts: ['layout.tsx'] }
> ```
>
> ```ts starter
> type Params = Record<string, string | string[]>
> type Resolved = { page: string; params: Params; layouts: string[] }
>
> function resolveRoute(files: string[], pathname: string): Resolved | null {
>   // твій код
>   return null
> }
> ```
>
> ```ts tests
> const app = [
>   'layout.tsx',
>   'page.tsx',
>   'not-found.tsx',
>   'dashboard/layout.tsx',
>   'dashboard/[team]/page.tsx',
>   'dashboard/settings/page.tsx',
>   'dashboard/page.tsx',
>   '_lib/secret/page.tsx',
>   '(shop)/layout.tsx',
>   '(shop)/cart/page.tsx',
>   'blog/[slug]/edit/page.tsx',
>   'blog/[slug]/page.tsx',
>   'blog/new/page.tsx',
>   'docs/[[...slug]]/page.tsx',
>   'files/[...path]/page.tsx',
>   '%5Fdrafts/page.tsx',
> ]
>
> test('корінь і вкладений сегмент з layouts від зовнішнього', () => {
>   expect(resolveRoute(app, '/')).toEqual({ page: 'page.tsx', params: {}, layouts: ['layout.tsx'] })
>   expect(resolveRoute(app, '/dashboard/settings')).toEqual({
>     page: 'dashboard/settings/page.tsx',
>     params: {},
>     layouts: ['layout.tsx', 'dashboard/layout.tsx'],
>   })
> })
>
> test('route group не в URL, але її layout у ланцюжку', () => {
>   expect(resolveRoute(app, '/cart')).toEqual({
>     page: '(shop)/cart/page.tsx',
>     params: {},
>     layouts: ['layout.tsx', '(shop)/layout.tsx'],
>   })
> })
>
> test('статичний сегмент виграє в динамічного, але без жадібності', () => {
>   expect(resolveRoute(app, '/dashboard/design')?.params).toEqual({ team: 'design' })
>   expect(resolveRoute(app, '/blog/new')?.page).toBe('blog/new/page.tsx')
>   expect(resolveRoute(app, '/blog/new/edit')).toEqual({
>     page: 'blog/[slug]/edit/page.tsx',
>     params: { slug: 'new' },
>     layouts: ['layout.tsx'],
>   })
> })
>
> test('catch-all і optional catch-all', () => {
>   expect(resolveRoute(app, '/files/a/b.pdf')?.params).toEqual({ path: ['a', 'b.pdf'] })
>   expect(resolveRoute(app, '/files')).toBeNull()
>   expect(resolveRoute(app, '/docs')).toEqual({ page: 'docs/[[...slug]]/page.tsx', params: {}, layouts: ['layout.tsx'] })
>   expect(resolveRoute(app, '/docs/api/link')?.params).toEqual({ slug: ['api', 'link'] })
> })
>
> test('приватні папки й папки без page — null, %5F — справжній сегмент', () => {
>   expect(resolveRoute(app, '/_lib/secret')).toBeNull()
>   expect(resolveRoute(app, '/blog')).toBeNull()
>   expect(resolveRoute(app, '/dashboard/settings/x')).toBeNull()
>   expect(resolveRoute(app, '/_drafts')?.page).toBe('%5Fdrafts/page.tsx')
> })
> ```
>
> > [!hint]- Підказка 1
> > Пройди всі файли `page.*`, відкинь ті, що мають папку на `_`, і для решти прибери з шляху route groups — вийде шаблон маршруту на кшталт `['blog', '[slug]', 'edit']`. Порівняй його з сегментами URL.
>
> > [!hint]- Підказка 2
> > Для кожного збігу запиши «ранг» — масив чисел: 0 для статичного, 1 для `[x]`, 2 для `[...x]`, 3 для `[[...x]]`. Кращий збіг — лексикографічно менший масив. Layouts шукай окремо: для кожного префікса шляху **папок** листа (з групами) — файл `layout.*` у цій папці.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Params = Record<string, string | string[]>
> > type Resolved = { page: string; params: Params; layouts: string[] }
> >
> > const isGroup = (dir: string) => dir.startsWith('(') && dir.endsWith(')')
> >
> > function matchSegments(route: string[], url: string[]): { params: Params; rank: number[] } | null {
> >   const params: Params = {}
> >   const rank: number[] = []
> >   for (let i = 0; i < route.length; i++) {
> >     const seg = route[i]
> >     let m = seg.match(/^\[\[\.\.\.(.+)\]\]$/)
> >     if (m) {
> >       if (url.length > i) params[m[1]] = url.slice(i)
> >       rank.push(3)
> >       return { params, rank }
> >     }
> >     m = seg.match(/^\[\.\.\.(.+)\]$/)
> >     if (m) {
> >       if (url.length <= i) return null
> >       params[m[1]] = url.slice(i)
> >       rank.push(2)
> >       return { params, rank }
> >     }
> >     if (i >= url.length) return null
> >     m = seg.match(/^\[(.+)\]$/)
> >     if (m) {
> >       params[m[1]] = url[i]
> >       rank.push(1)
> >     } else if (decodeURIComponent(seg) === url[i]) {
> >       rank.push(0)
> >     } else {
> >       return null
> >     }
> >   }
> >   return route.length === url.length ? { params, rank } : null
> > }
> >
> > function isBetter(a: number[], b: number[]): boolean {
> >   for (let i = 0; i < Math.min(a.length, b.length); i++) {
> >     if (a[i] !== b[i]) return a[i] < b[i]
> >   }
> >   return a.length < b.length
> > }
> >
> > function resolveRoute(files: string[], pathname: string): Resolved | null {
> >   const url = pathname.split('/').filter(Boolean)
> >   let best: { page: string; params: Params; rank: number[] } | null = null
> >
> >   for (const file of files) {
> >     const dirs = file.split('/')
> >     const name = dirs.pop()!
> >     if (!/^page\.(js|jsx|ts|tsx)$/.test(name)) continue
> >     if (dirs.some((dir) => dir.startsWith('_'))) continue
> >     const match = matchSegments(dirs.filter((dir) => !isGroup(dir)), url)
> >     if (match && (!best || isBetter(match.rank, best.rank))) best = { page: file, ...match }
> >   }
> >   if (!best) return null
> >
> >   const dirs = best.page.split('/').slice(0, -1)
> >   const layouts: string[] = []
> >   for (let depth = 0; depth <= dirs.length; depth++) {
> >     const folder = dirs.slice(0, depth).join('/')
> >     const layout = files.find((file) => {
> >       const parts = file.split('/')
> >       const name = parts.pop()!
> >       return parts.join('/') === folder && /^layout\.(js|jsx|ts|tsx)$/.test(name)
> >     })
> >     if (layout) layouts.push(layout)
> >   }
> >   return { page: best.page, params: best.params, layouts }
> > }
> > ```
> >
> > Ранг-масив — та сама ідея, що в Next.js: маршрути сортуються за конкретністю сегментів, і перший, що збігся, виграє. Через це пріоритет не жадібний: `blog/new` просто не збігається з `/blog/new/edit`, і перемагає `[slug]/edit`. Справжній роутер ще враховує parallel routes і intercepting, а layouts шукає разом з усіма межами.

> [!task] Знайди конфлікти в дереві маршрутів
> level: middle · difficulty: hard · id: nextjs-core-01-task-03 · tags: app-router, conflicts, ci
>
> Напиши `findConflicts(files)` — перевірку дерева для CI. `files` — шляхи відносно `app/`. Поверни **відсортований** масив рядків без повторів:
>
> - `'page-route <url>'` — `page.*` і `route.*` дають один URL;
> - `'duplicate-page <url>'` — два `page.*` дають один URL (через route groups);
> - `'slug-names <url>'` — під одним батьківським URL є динамічні сегменти `[x]` з **різними** іменами (будь-яка глибина нижче; `[...x]` і `[[...x]]` не рахуються);
> - `'optional-catch-all <url>'` — `page.*` на URL і `page.*` в `[[...x]]` прямо під ним.
>
> URL будуй із сегментів без route groups: `'/'` для кореня, `'/blog/[slug]'` для динамічних. Файли з папкою на `_` ігноруй повністю.
>
> ```js
> findConflicts(['x/page.tsx', 'x/route.ts']) // → ['page-route /x']
> ```
>
> ```js starter
> function findConflicts(files) {
>   // твій код
>   return []
> }
> ```
>
> ```js tests
> test('чисте дерево — без конфліктів', () => {
>   const files = [
>     'layout.tsx', 'page.tsx', 'api/health/route.ts', 'blog/page.tsx', 'blog/[slug]/page.tsx',
>     'blog/[slug]/edit/page.tsx', 'shop/[id]/page.tsx', 'shop/[...rest]/page.tsx', '(shop)/cart/page.tsx',
>   ]
>   expect(findConflicts(files)).toEqual([])
> })
>
> test('page і route в одному сегменті', () => {
>   expect(findConflicts(['feed/page.tsx', 'feed/route.ts'])).toEqual(['page-route /feed'])
> })
>
> test('route groups не рятують від конфліктів', () => {
>   expect(findConflicts(['(site)/contact/page.tsx', 'contact/route.ts'])).toEqual(['page-route /contact'])
>   expect(findConflicts(['(a)/about/page.tsx', '(b)/about/page.tsx'])).toEqual(['duplicate-page /about'])
> })
>
> test('різні імена динамічного сегмента на одному рівні, навіть на різній глибині', () => {
>   expect(findConflicts(['p/[id]/page.tsx', 'p/[slug]/edit/page.tsx'])).toEqual(['slug-names /p'])
>   expect(findConflicts(['[lang]/layout.tsx', '(docs)/[locale]/guide/page.tsx'])).toEqual(['slug-names /'])
> })
>
> test('сторінка поруч з optional catch-all', () => {
>   expect(findConflicts(['docs/page.tsx', 'docs/[[...slug]]/page.tsx'])).toEqual(['optional-catch-all /docs'])
> })
>
> test('ігнорує приватні папки й сортує кілька конфліктів', () => {
>   const files = ['_lib/page.tsx', '_lib/route.ts', 'b/page.tsx', 'b/route.ts', 'a/page.tsx', 'a/route.js']
>   expect(findConflicts(files)).toEqual(['page-route /a', 'page-route /b'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Для кожного файлу спершу отримай `routeDirs` — папки без груп. URL файлу — `'/' + routeDirs.join('/')`. Тримай дві `Map`: URL → сторінки і URL → route-файли.
>
> > [!hint]- Підказка 2
> > Для `slug-names` пройди `routeDirs` кожного файлу: на позиції `i` з `[x]` (без крапок) додай `x` у `Set` для батьківського URL `'/' + routeDirs.slice(0, i).join('/')`. У кінці конфлікт там, де в `Set` більше одного імені.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function findConflicts(files) {
> >   const found = new Set()
> >   const pages = new Map() // url → кількість сторінок
> >   const routes = new Set()
> >   const dynamicNames = new Map() // батьківський url → Set імен
> >
> >   for (const file of files) {
> >     const dirs = file.split('/')
> >     const name = dirs.pop()
> >     if (dirs.some((dir) => dir.startsWith('_'))) continue
> >     const routeDirs = dirs.filter((dir) => !(dir.startsWith('(') && dir.endsWith(')')))
> >     const url = '/' + routeDirs.join('/')
> >
> >     routeDirs.forEach((dir, i) => {
> >       const m = dir.match(/^\[([^.[\]]+)\]$/)
> >       if (!m) return
> >       const parent = '/' + routeDirs.slice(0, i).join('/')
> >       if (!dynamicNames.has(parent)) dynamicNames.set(parent, new Set())
> >       dynamicNames.get(parent).add(m[1])
> >     })
> >
> >     if (/^page\.(js|jsx|ts|tsx)$/.test(name)) pages.set(url, (pages.get(url) || 0) + 1)
> >     if (/^route\.(js|ts)$/.test(name)) routes.add(url)
> >   }
> >
> >   for (const [url, count] of pages) {
> >     if (count > 1) found.add(`duplicate-page ${url}`)
> >     if (routes.has(url)) found.add(`page-route ${url}`)
> >     const m = url.match(/^(.*)\/\[\[\.\.\.[^\]]+\]\]$/)
> >     if (m) {
> >       const base = m[1] || '/'
> >       if (pages.has(base)) found.add(`optional-catch-all ${base}`)
> >     }
> >   }
> >   for (const [parent, names] of dynamicNames) {
> >     if (names.size > 1) found.add(`slug-names ${parent}`)
> >   }
> >   return [...found].sort()
> > }
> > ```
> >
> > Усі чотири перевірки працюють з URL, а не з папками: саме тому route groups не рятують ні від `page-route`, ні від `duplicate-page`. `slug-names` — та перевірка, яку `next build` 16.3.8 пропускає для різної глибини, тож її варто мати в CI окремим скриптом над `app/**`.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Project structure and organization](https://nextjs.org/docs/app/getting-started/project-structure) — усі конвенції папок і файлів, ієрархія компонентів, colocation, приватні папки.
- 🟢 [Next.js — Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) — сегменти, вкладені маршрути, root layout.
- 🟡 [Next.js — layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout) — правила root layout, кілька root layouts, root params.
- 🟡 [Next.js — error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error) — що обгортає межа, `retry`, `global-error`.
- 🟡 [Next.js — not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — `not-found`, експериментальний `global-not-found`, статус-коди.
- 🟡 [Next.js — loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — межа Suspense, статус-коди стрімінгових відповідей.
- 🟡 [Next.js — Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) — `route.ts`, Route Resolution і конфлікт з `page`.
- 🟡 [Next.js — src folder](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder) — що лишається в корені, коли `src/app` ігнорується.
- 🔴 [Next.js — authInterrupts](https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts) — експериментальні `forbidden` / `unauthorized` і їхні файли.
- 🔴 [React — Suspense](https://react.dev/reference/react/Suspense) — як працює межа, на якій тримається `loading.tsx`.

> [!important] Підсумок
> - Папки в `app/` — сегменти маршруту; адреса публічна лише з `page` або `route`. Route groups, приватні папки `_x` і слоти в URL не потрапляють.
> - У кожному сегменті порядок незмінний: `layout → template → error → loading → not-found → page`, а дочірній сегмент вкладається на місце `page`. Тому межа сегмента не ловить помилки й очікування свого layout.
> - URL розвʼязується від кореня до листа: найконкретніший збіг (static → `[x]` → `[...x]` → `[[...x]]`) без жадібності, файли збираються з усіх рівнів, включно з групами. Немає збігу — кореневий `not-found`.
> - Root layout з `<html>` і `<body>` обовʼязковий, але на 16.3.8 це перевіряє лише `next dev`. Його помилки ловить тільки `global-error`.
> - Colocation безпечна, поки допоміжні файли не мають спеціальних назв; тримай їх у `_папках`. Конфлікти `page` + `route`, однакових URL і різних імен параметрів перевіряй у CI — частину з них збірка 16.3.8 пропускає.

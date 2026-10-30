---
title: Сторінки й layouts
id: nextjs-start-07
slug: 07-pages-and-layouts
order: 7
level: noob
skill: routing
icon: px:house
tags: [nextjs, routing, page, layout, not-found, metadata, beginner]
prerequisites:
  - "[[Next.js Start - 06. Перший проєкт, create-next-app і структура]]"
estimatedMinutes: 35
nextVersion: 16.3.8
---

# Сторінки й layouts

> [!success] 🎯 Після цього розділу ти зможеш
> - створити сторінку файлом `page.tsx` і за деревом папок у `app/` сказати, які URL відкриються;
> - написати root layout з `<html>` і `<body>` і пояснити, чому він обовʼязковий;
> - додати вкладений layout для розділу сайту й передбачити, що він обгортає і що зберігає між переходами;
> - задати заголовок вкладки через `metadata` і зробити власну сторінку 404 файлом `not-found.tsx`;
> - зібрати маленький багатосторінковий сайт крок за кроком і прочитати таблицю маршрутів після `next build`.

## 🤔 Передбач

> [!quiz] Які адреси відкриються?
> level: junior · type: output · id: nextjs-start-07-quiz-01
>
> Ось папка `app/` нового проєкту. Користувач по черзі вводить у браузері `/about`, `/blog`, `/menu/menu-data` і `/contacts`. Які з них покажуть сторінку, а не 404?
>
> ```text
> app/
> ├── layout.tsx
> ├── page.tsx
> ├── about/
> │   └── page.tsx
> ├── blog/
> │   ├── layout.tsx
> │   └── page.tsx
> ├── menu/
> │   ├── menu-data.ts
> │   └── page.tsx
> └── contacts/
>     └── contacts.tsx
> ```
>
> - [x] `/about` і `/blog`
> - [ ] Усі чотири: кожен файл і кожна папка стають адресою
> - [ ] `/about`, `/blog` і `/contacts`: папка `contacts` є, а назва файлу не важлива
> - [ ] `/about`, `/blog` і `/menu/menu-data`: будь-який `.ts`-файл стає сторінкою
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Публічною адресу робить лише файл з особливою назвою `page.tsx`. У `contacts/` його немає, тож `/contacts` дасть 404. А `menu-data.ts` — звичайний модуль поруч зі сторінкою меню, не маршрут.

## 🧒 Простими словами

Уяви торговий центр. Будівля з входом, дахом і табличкою на фасаді — це **root layout**: що б ти не відвідав, ти завжди всередині неї. Поверх з книгарнями має власну вивіску й лавочки в коридорі — це **вкладений layout** розділу. А конкретна крамниця, куди ти зайшов, — **сторінка**. Коли переходиш з книгарні в сусідню книгарню, будівля й коридор не зникають і не перебудовуються: змінюється лише вітрина перед тобою. Next.js працює так само, а план поверхів — це просто папки у твоєму проєкті.

## 🔬 Як це працює насправді

У [[Next.js Start - 06. Перший проєкт, create-next-app і структура|темі 06]] ти створив проєкт і побачив папку `app/`. Тепер зробимо з неї сайт маленької кавʼярні «Зерно»: головна, меню, «Про нас», блог з двома статтями й власна сторінка 404. Кожен крок — один новий файл.

### 🗂️ Папка — це шматок адреси

Next.js використовує **файлову маршрутизацію** (file-system routing): ти не пишеш таблицю «адреса → компонент», а розкладаєш файли по папках. Кілька слів, які далі будуть всюди:

- **Маршрут** (route) — адреса, яку можна відкрити: `/`, `/menu`, `/blog/latte-art`.
- **Сегмент** (segment) — шматок адреси між слешами. У `/blog/latte-art` два сегменти: `blog` і `latte-art`. Кожен сегмент — це **папка** всередині `app/`.
- **Спеціальний файл** — файл з назвою, яку Next.js знає: `page.tsx`, `layout.tsx`, `not-found.tsx` та інші. Вони кажуть, що показати для сегмента.

Правило одне: **папка дає сегмент, а `page.tsx` робить його публічним**. Поки в папці немає `page.tsx`, адреса не існує — навіть якщо в папці лежить десяток інших файлів.

| Файл | URL |
|---|---|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/page.tsx` | `/blog` |
| `app/blog/latte-art/page.tsx` | `/blog/latte-art` |
| `app/menu/menu-data.ts` | — (звичайний модуль, не адреса) |
| `app/contacts/contacts.tsx` | — (немає `page.tsx`, тож `/contacts` — 404) |

Те, що інші файли не стають адресами, — зручна річ: компоненти, дані й стилі сторінки можна тримати **поруч із нею** (це називають colocation). Ніхто не відкриє твій `menu-data.ts` через браузер.

> [!diagram] Дерево папок і адреси, які з нього виходять
> ```yaml
> layout: tree
> nodes:
>   - { id: app, label: "app/", text: "page.tsx → /", tone: blue, icon: "px:house" }
>   - { id: about, label: "about/", text: "page.tsx → /about", parent: app, tone: green }
>   - { id: menu, label: "menu/", text: "page.tsx → /menu", note: "menu-data.ts — не адреса", parent: app, tone: green }
>   - { id: blog, label: "blog/", text: "page.tsx → /blog", note: "layout.tsx обгортає все нижче", parent: app, tone: violet }
>   - { id: post, label: "latte-art/", text: "page.tsx → /blog/latte-art", parent: blog, tone: green }
>   - { id: contacts, label: "contacts/", text: "contacts.tsx", note: "немає page.tsx → 404", parent: app, tone: red, icon: "px:warning" }
> steps:
>   - { show: app, note: "Папка app/ — корінь сайту. Її page.tsx відповідає адресі /." }
>   - { show: [about, menu], note: "Кожна вкладена папка додає сегмент: about → /about, menu → /menu. Сусідні файли на кшталт menu-data.ts адресами не стають." }
>   - { show: blog, note: "blog/ дає /blog. Його layout.tsx обгорне і /blog, і всі сторінки глибше." }
>   - { show: post, note: "Папка в папці — довша адреса: blog/latte-art/page.tsx → /blog/latte-art." }
>   - { show: contacts, note: "Папка є, а page.tsx немає — тож /contacts не існує, і Next.js покаже 404." }
> ```
> Зелене відкривається в браузері. Червоне — лише папка без `page.tsx`.

> [!quiz] Перевір себе: який файл створить адресу /menu/drinks?
> level: junior · id: nextjs-start-07-quiz-02
> - [ ] `app/menu/drinks.tsx`
> - [ ] `app/menu-drinks/page.tsx`
> - [x] `app/menu/drinks/page.tsx`
> - [ ] `app/pages/menu/drinks.tsx`
>
> **Пояснення:** кожен сегмент адреси — окрема папка, а сторінку дає саме `page.tsx`. Файл `drinks.tsx` у папці `menu` — просто модуль. `menu-drinks` — один сегмент з дефісом, тобто `/menu-drinks`. А папка `pages/` — це старий Pages Router; у App Router сторінки живуть в `app/`.

### 📄 Крок 1. Перша сторінка

Сторінка — це React-компонент, який файл `page.tsx` **експортує за замовчуванням** (`export default`). Перепиши головну, яку згенерував `create-next-app`:

```tsx
// app/page.tsx → URL /
export default function HomePage() {
  return (
    <>
      <h1>Кавʼярня «Зерно»</h1>
      <p>Смачна кава біля дому.</p>
    </>
  )
}
```

Назва функції (`HomePage`) може бути будь-якою — Next.js бере саме default export. Тепер сторінка «Про нас»: створи папку `about` і файл у ній.

```tsx
// app/about/page.tsx → URL /about
export default function AboutPage() {
  return <h1>Про нас</h1>
}
```

Збережи файл — і `http://localhost:3000/about` уже працює. Жодних налаштувань, імпортів чи реєстрації маршруту.

Що буде, якщо забути `default`? На 16.3.8 `next dev` показує в браузері ``The default export is not a React Component in "/about/page"``, а `next build` зупиняється вже на перевірці TypeScript: ``Property 'default' is missing in type … but required in type 'AppPageConfig<"/about">'``. Обидва повідомлення кажуть одне: Next.js шукав default export і не знайшов.

Ще одна деталь на майбутнє: кожна сторінка й кожен layout за замовчуванням — **Server Component**, тобто компонент, який виконується на сервері, а в браузер приходить уже готовий результат. Поки що для тебе це означає лише одне: `useState` і `onClick` у такому файлі не працюють — для них потрібен окремий файл з `'use client'` (побачиш на кроці 4). Докладно — у [[Next.js - 07. Server і Client Components|темі 07 основного посібника]].

### 🏠 Крок 2. Root layout — рамка для всього сайту

**Layout** — це компонент, який обгортає сторінки й показує спільну для них частину: шапку, меню, футер. Він отримує проп `children` — туди Next.js підставить поточну сторінку (або вкладений layout, про це далі).

Layout у корені `app/` називається **root layout**. Він обовʼязковий і єдиний має містити теги `<html>` і `<body>`: усі інші layouts і сторінки рендеряться всередині його `<body>`.

```tsx
// app/layout.tsx — root layout: обгортає ВСІ сторінки сайту
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Кавʼярня «Зерно»',
  description: 'Маленький сайт кавʼярні на Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <header>
          <Link href="/">Зерно</Link> · <Link href="/menu">Меню</Link> ·{' '}
          <Link href="/about">Про нас</Link> · <Link href="/blog">Блог</Link>
        </header>
        <main>{children}</main>
        <footer>© 2026 Зерно</footer>
      </body>
    </html>
  )
}
```

Розберемо по рядках:

- `children: React.ReactNode` — тип «будь-що, що React уміє показати». Ти бачив його в [[Next.js Start - 04. TypeScript-мінімум для Next.js|темі 04]].
- `<html lang="uk">` — мова сторінки: її читають скрінрідери й пошуковики.
- `<Link href="/menu">` — посилання на іншу сторінку. Поки вважай його «правильним `<a>` для Next.js»; чому не просто `<a>` — уся [[Next.js Start - 08. Навігація|наступна тема]].
- `{children}` стоїть у `<main>` — саме там зʼявиться `HomePage`, `AboutPage` чи будь-яка інша сторінка.
- `metadata` — заголовок вкладки й опис сторінки; до нього повернемося на кроці 5.

Тепер шапка й футер є на всіх сторінках, хоча в `page.tsx` про них ні слова. Відкрий вихідний код `/about` (Ctrl+U, на Mac — Cmd+Option+U): там `<html lang="uk">`, шапка, `<h1>Про нас</h1>` у `<main>` і футер.

> [!warning] Розбіжність з документацією: збірка не стежить за root layout
> Документація каже, що root layout **must** бути і **must** містити `<html>` і `<body>` ([layout.js — Root Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)). На 16.3.8 `next build` проходить і без цих тегів, і навіть без `app/layout.tsx`. Помилку видно лише в `next dev`, у вікні помилки в браузері: `Missing <html> and <body> tags in the root layout.` При цьому сторінка відповідає статусом 200, а термінал мовчить — помилку видно лише в оверлеї браузера. А сторінка встановлення в документації ([Installation](https://nextjs.org/docs/app/getting-started/installation)) обіцяє, що `next dev` сам створить root layout, якщо його немає; на 16.3.8 файл не зʼявився. Тож не покладайся ні на збірку, ні на dev — тримай root layout з обома тегами завжди.

Ще одне правило root layout: **не пиши вручну** `<head>`, `<title>` чи `<meta>`. Для цього є `metadata` (крок 5): Next.js сам збере теги в `<head>` і прибере дублікати.

> [!quiz] Перевір себе: заповни пропуски в root layout
> level: junior · type: fill · bank: head, page · id: nextjs-start-07-quiz-03
>
> ```tsx fill
> // app/[[layout]].tsx
> export default function RootLayout({ [[children]] }: { children: React.ReactNode }) {
>   return (
>     <[[html]] lang="uk">
>       <[[body]]>
>         <header>Зерно</header>
>         <main>{children}</main>
>       </body>
>     </html>
>   )
> }
> ```
>
> **Пояснення:** root layout живе у файлі `app/layout.tsx`, приймає `children` і єдиний містить `<html>` та `<body>`. `<head>` вручну не пишуть — теги в нього додає `metadata`. А `page` — це файл сторінки, не рамки.

### 🪆 Крок 3. Вкладений layout для блогу

Блогу потрібна бічна панель зі списком статей, якої немає на інших сторінках. Додай `layout.tsx` прямо в папку `blog`:

```tsx
// app/blog/layout.tsx — обгортає /blog і все під ним
import Link from 'next/link'
import { LikeButton } from './like-button'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <aside>
        <p>Блог «Зерна»</p>
        <Link href="/blog/first-coffee">Перша кава</Link>
        <Link href="/blog/latte-art">Латте-арт</Link>
        <LikeButton />
      </aside>
      <article>{children}</article>
    </section>
  )
}
```

(`LikeButton` зʼявиться на наступному кроці — поки можеш прибрати цей рядок.) Тут **немає** `<html>` і `<body>`: їх уже дав root layout. І сторінки блогу:

```tsx
// app/blog/page.tsx → URL /blog
export default function BlogPage() {
  return <h1>Усі статті</h1>
}
```

```tsx
// app/blog/latte-art/page.tsx → URL /blog/latte-art
export default function LatteArtPage() {
  return <h1>Латте-арт за 5 хвилин</h1>
}
```

Сторінку `app/blog/first-coffee/page.tsx` зроби сам так само — з заголовком «Як ми зварили першу каву».

Layouts **вкладаються** за папками. Для `/blog/latte-art` Next.js складає матрьошку: root layout → layout блогу → сторінка. Сторінка стає `children` layout блогу, а layout блогу разом зі сторінкою — `children` root layout. На `/about` layout блогу не бере участі взагалі: папка `about` не всередині `blog`.

> [!diagram] Що бачить користувач на /blog/latte-art
> ```yaml
> layout: nest
> nodes:
>   - { id: root, label: "app/layout.tsx", text: "<html><body> · шапка · футер", tone: blue, icon: "px:house" }
>   - { id: blog, label: "app/blog/layout.tsx", text: "<section> · бічна панель · ❤️", parent: root, tone: violet }
>   - { id: page, label: "app/blog/latte-art/page.tsx", text: "<h1>Латте-арт за 5 хвилин</h1>", parent: blog, tone: green }
> steps:
>   - { show: root, note: "Зовнішня рамка — root layout. Він дає <html>, <body>, шапку й футер для будь-якої адреси." }
>   - { show: blog, note: "Адреса починається з /blog, тож усередину root layout Next.js кладе layout блогу. Він стає його children." }
>   - { show: page, note: "Найглибше — сама сторінка. Вона стає children layout блогу." }
>   - { focus: page, note: "Перейдеш на /blog/first-coffee — зміниться лише зелена частина. Обидві рамки лишаться на місці." }
> ```
> Чим глибше папка, тим більше рамок навколо сторінки.

> [!quiz] Перевір себе: склади HTML сторінки /blog/latte-art
> level: junior · type: order · id: nextjs-start-07-quiz-04
>
> Склади рядки в тому порядку, в якому вони йдуть у вихідному HTML (зверху вниз).
>
> ```order
> <html lang="uk">
> <body>
> <header>Зерно · Меню · Про нас · Блог</header>
> <main><section><aside>Блог «Зерна»…</aside>
> <article><h1>Латте-арт за 5 хвилин</h1></article></section></main>
> <footer>© 2026 Зерно</footer>
> <aside>Блог «Зерна»…</aside> поза <section> ✗
> ```
>
> **Пояснення:** зовні — те, що дає root layout, у його `<main>` — секція з layout блогу, а в `<article>` — сама сторінка. Футер root layout іде після `{children}`, тож після всього блогу. Рядок з `<aside>` поза `<section>` зайвий: бічна панель — частина layout блогу, тож вона завжди всередині його `<section>`. (`<head>` у вихідному коді теж буде, але його генерує Next.js з `metadata`, тому в задачі його немає.)

### 🔁 Крок 4. Layout не зникає між переходами

Головна суперсила layout: **під час переходу між сторінками всередині нього він не перемальовується й зберігає стан**. Перевіримо це кнопкою лайків. Лічильник — це стан (`useState` з [[Next.js Start - 03. React-мінімум, state, події й ефекти|теми 03]]), а стан живе лише в Client Component, тож файл починається з `'use client'`:

```tsx
// app/blog/like-button.tsx — Client Component зі станом
'use client'

import { useState } from 'react'

export function LikeButton() {
  const [likes, setLikes] = useState(0)
  return <button onClick={() => setLikes(likes + 1)}>❤️ {likes}</button>
}
```

Сам layout блогу лишається звичайним (серверним) — він лише імпортує й показує кнопку. Тепер експеримент (на 16.3.8 — у `next start`, браузер):

1. Відкрий `/blog/first-coffee` і натисни ❤️ тричі — `❤️ 3`.
2. Клікни «Латте-арт» у бічній панелі. Заголовок змінився, а кнопка показує `❤️ 3`: layout блогу не створювався заново.
3. Онови сторінку (F5). Тепер `❤️ 0`: перезавантаження стирає весь стан у браузері.

Чому так? Під час переходу через `<Link>` Next.js міняє лише ту частину дерева, яка відрізняється. Обидві статті мають ті самі root layout і layout блогу, тож вони лишаються як є, а замінюється тільки `children` — сторінка. Це називають **partial rendering** (частковий рендер). Тому в layout кладуть те, що має «жити» довше за одну сторінку: меню, плеєр, кошик, відкриту бічну панель.

Ще один нюанс, який ти можеш помітити: якщо піти з блогу на `/menu` і повернутися, лічильник теж може вціліти. Це не layout — з `cacheComponents: true` Next.js не знищує нещодавно відвідані сторінки, а ховає їх. Механіка — у [[Next.js - 04. Навігація під капотом|темі 04 основного посібника]]; поки запамʼятай головне: **між сусідніми сторінками layout гарантовано лишається**.

> [!quiz] Перевір себе: що покаже лічильник?
> level: junior · type: output · id: nextjs-start-07-quiz-05
>
> Користувач на `/blog/first-coffee` натиснув ❤️ двічі (`❤️ 2`). Потім клікнув `<Link href="/blog/latte-art">` у бічній панелі, а там — ще раз ❤️. Що на кнопці?
>
> - [x] `❤️ 3`
> - [ ] `❤️ 1` — нова сторінка, новий лічильник
> - [ ] `❤️ 0` — після переходу стан завжди скидається
> - [ ] Залежить від того, чи є `useState` у `page.tsx`
>
> **Пояснення:** кнопка живе в layout блогу, а обидві статті під ним. Під час переходу замінюється лише сторінка (`children`), тож стан кнопки лишається: 2 + 1 = 3. Гарантовано скидає його лише перезавантаження сторінки. Після переходу туди, де цього layout немає, і повернення стан з `cacheComponents: true` зазвичай теж відновлюється: Next.js ховає нещодавно відвідані маршрути, а не знищує їх (див. [[Next.js - 02. Layouts, templates і route groups]] і [[Next.js - 04. Навігація під капотом]]).

### 🏷️ Крок 5. Заголовок вкладки: metadata

Текст на вкладці браузера й у пошуковій видачі береться з `<title>` і `<meta name="description">`. У Next.js їх не пишуть тегами, а **експортують обʼєкт** `metadata` з `layout.tsx` або `page.tsx`. У root layout ми вже задали назву кавʼярні для всього сайту. Тепер сторінка «Про нас» уточнить свій заголовок:

```tsx
// app/about/page.tsx → URL /about
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Про нас',
}

export default function AboutPage() {
  return <h1>Про нас</h1>
}
```

На 16.3.8 — ось що віддає сервер (`curl`):

| Адреса | `<title>` | `description` |
|---|---|---|
| `/` | `Кавʼярня «Зерно»` | `Маленький сайт кавʼярні на Next.js` |
| `/about` | `Про нас` | `Маленький сайт кавʼярні на Next.js` |
| `/menu` | `Кавʼярня «Зерно»` | `Маленький сайт кавʼярні на Next.js` |

Правило: **глибший файл перекриває поля, які задав, а решту успадковує**. `/about` замінила лише `title`, опис прийшов з root layout. `/menu` нічого не задала й отримала все від root layout.

`metadata` працює лише в серверних файлах — у файлі з `'use client'` її не можна експортувати. Шаблони заголовків (`Про нас | Зерно`), заголовки з даних (`generateMetadata`) і картинки для соцмереж — у темі 33 основного посібника.

> [!quiz] Перевір себе: який заголовок вкладки?
> level: junior · type: output · id: nextjs-start-07-quiz-06
>
> `app/layout.tsx` експортує `metadata = { title: 'Зерно', description: 'Кавʼярня' }`. `app/blog/layout.tsx` експортує `metadata = { title: 'Блог' }`. `app/blog/latte-art/page.tsx` нічого не експортує. Що буде на `/blog/latte-art`?
>
> - [x] `<title>Блог</title>`, опис «Кавʼярня»
> - [ ] `<title>Зерно</title>`: заголовок завжди з root layout
> - [ ] Ні заголовка, ні опису: сторінка не експортує `metadata`
> - [ ] `<title>Блог</title>` без опису: вкладений layout стирає всі поля батька
>
> **Пояснення:** Next.js іде від root layout до сторінки й накладає `metadata` одна на одну. Найглибше значення `title` — з layout блогу, а `description` ніхто нижче не перекрив, тож він з root layout.

### 🚫 Крок 6. Власна сторінка 404

Введи `/nope` — Next.js покаже стандартну сторінку 404 англійською. Свою сторінку робить спеціальний файл `not-found.tsx`:

```tsx
// app/not-found.tsx — сторінка для всіх невідомих URL
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <h1>Такої сторінки немає</h1>
      <Link href="/">На головну</Link>
    </>
  )
}
```

На 16.3.8 (`next build` + `next start` + `curl`) — так:

- `/nope`, `/contacts`, `/menu/menu-data` і навіть `/blog/nope` — статус **404** і наш текст.
- Сторінка 404 показується **всередині root layout**: шапка й футер на місці.
- Для `/blog/nope` бічної панелі блогу немає: адреса, яка не збіглася з жодним маршрутом, обробляється на рівні `app/not-found.tsx`, тож layout блогу в ній не бере участі.
- Next.js сам додає `<meta name="robots" content="noindex"/>`, щоб пошуковики не індексували 404.

`not-found.tsx` можна класти й глибше, наприклад `app/blog/not-found.tsx`. Він спрацює, коли сторінка блогу сама скаже «нічого не знайдено» функцією `notFound()` з `next/navigation` — наприклад, для статті, якої немає в базі. Це побачиш у [[Next.js Start - 08. Навігація|темі 08]] на динамічних адресах.

> [!quiz] Перевір себе: обери правдиві твердження про not-found.tsx
> level: junior · type: multi · id: nextjs-start-07-quiz-07
> - [x] `app/not-found.tsx` показується для будь-якої адреси, якої немає в `app/`
> - [x] Відповідь для невідомої адреси має статус 404
> - [x] Сторінка 404 рендериться всередині root layout
> - [ ] `not-found.tsx` треба вручну імпортувати в root layout
> - [ ] Без `not-found.tsx` невідома адреса дасть порожню сторінку зі статусом 200
>
> **Пояснення:** `not-found.tsx` — спеціальний файл: Next.js знаходить його сам, як `page.tsx` чи `layout.tsx`. Без нього 404 теж буде, просто стандартна англійська. А шапка з root layout лишається, бо root layout обгортає все, включно з 404.

### 🧱 Що вийшло: сайт цілком

Після шести кроків дерево проєкту виглядає так:

```text
app/
├── layout.tsx            ← root layout: html, body, шапка, футер, metadata
├── page.tsx              ← /
├── not-found.tsx         ← усі невідомі адреси
├── about/
│   └── page.tsx          ← /about (свій title)
├── menu/
│   ├── menu-data.ts      ← дані меню, не адреса
│   └── page.tsx          ← /menu
└── blog/
    ├── layout.tsx        ← бічна панель для всього блогу
    ├── like-button.tsx   ← Client Component, не адреса
    ├── page.tsx          ← /blog
    ├── first-coffee/
    │   └── page.tsx      ← /blog/first-coffee
    └── latte-art/
        └── page.tsx      ← /blog/latte-art
```

Сторінка меню бере дані з сусіднього модуля — так colocation виглядає на практиці:

```tsx
// app/menu/menu-data.ts — звичайний модуль поруч зі сторінкою, НЕ маршрут
export const drinks = [
  { id: 'espresso', title: 'Еспресо', price: 45 },
  { id: 'latte', title: 'Лате', price: 65 },
  { id: 'cocoa', title: 'Какао', price: 55 },
]
```

```tsx
// app/menu/page.tsx → URL /menu
import { drinks } from './menu-data'

export default function MenuPage() {
  return (
    <>
      <h1>Меню</h1>
      <ul>
        {drinks.map((drink) => (
          <li key={drink.id}>
            {drink.title} — {drink.price} ₴
          </li>
        ))}
      </ul>
    </>
  )
}
```

Запусти `npm run build`. Наприкінці Next.js друкує таблицю маршрутів — це найшвидший спосіб перевірити, що ти збудував саме те, що задумав:

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /blog
├ ○ /blog/first-coffee
├ ○ /blog/latte-art
└ ○ /menu

○  (Static)  prerendered as static content
```

Шість сторінок і службовий `/_not-found` — сторінка 404. Ні `menu-data`, ні `like-button` у таблиці немає. Кружечок `○` означає «статична»: Next.js відрендерив сторінку один раз під час збірки й віддає готовий HTML. Статичне й динамічне — тема 10 основного посібника.

### 🏭 Як це роблять у продакшні

- **Тонкі `page.tsx`.** Сторінка збирає екран з компонентів, а самі компоненти лежать поруч (`app/blog/like-button.tsx`) або в спільній папці (`app/ui/`, `components/`). Адресою все одно стане лише `page.tsx`.
- **Root layout — мінімальний.** Там `<html>`, `<body>`, шрифти, глобальні стилі й те, що справді є на кожній сторінці. Усе, що потрібне лише розділу, — у layout цього розділу.
- **Layout для розділів з власною навігацією:** кабінет, блог, адмінка. Їхня бічна панель не мерехтить і не скидає стан під час переходів.
- **`metadata` на кожній важливій сторінці.** Однаковий `<title>` на всіх сторінках шкодить і пошуку, і вкладкам браузера.
- **Власна 404 з посиланням на головну** — дрібниця, яка рятує користувача від глухого кута.
- Великі проєкти групують маршрути, ховають службові папки з адрес і мають кілька root layouts — це теми 01 і 02 основного посібника.

## ⚠️ Пастки

> [!pitfall] Забув export default
> Названий експорт Next.js не бачить: у `next dev` — ``The default export is not a React Component in "/about/page"``, у `next build` — помилка TypeScript про відсутній `default`.
>
> ```tsx
> export function AboutPage() {} // ❌
> export default function AboutPage() {} // ✅
> ```

> [!pitfall] Файл сторінки з іншою назвою
> `app/contacts/contacts.tsx` чи `app/contacts/index.tsx` — не сторінка. Адресу дає тільки `page.tsx` (або `page.js`, `page.jsx`).

> [!pitfall] <title> руками в root layout
> Документація забороняє писати `<head>`, `<title>` і `<meta>` у root layout вручну. Експортуй `metadata` — Next.js сам збере `<head>` і не дасть тегам задублюватися.

> [!pitfall] 'use client' на весь layout заради однієї кнопки
> Layout стане клієнтським разом з усім, що імпортує, і код поїде в браузер. Винось інтерактивну частину в окремий файл (`like-button.tsx`), а layout лишай серверним.

> [!pitfall] <html> у вкладеному layout
> `<html>` і `<body>` — лише в root layout. Вкладений layout повертає звичайну розмітку (`<section>`, `<div>`), інакше в HTML зʼявиться другий `<html>` усередині `<body>`.

## 🔗 Звʼязки

- [[Next.js Start - 08. Навігація]] — `Link`, активний пункт меню, `useRouter`, `redirect()` і динамічні адреси `/blog/[slug]`.
- [[Next.js - 07. Server і Client Components]] — чому сторінки й layouts серверні за замовчуванням і що робить `'use client'`.
- [[Next.js Start - 02. React-мінімум, компоненти, JSX і props]] — `children` як проп і списки з `key`.
- Далі в основному посібнику: тема 01 — усі спеціальні файли й порядок, у якому вони обгортають сторінку; тема 02 — layouts, templates і route groups детально.

## ⚡ Фішки

> [!reel] 📁 Папка — сегмент, page.tsx — двері
> Папка в `app/` додає шматок адреси, але відкривається він тільки тоді, коли всередині є `page.tsx`. Решту файлів поруч можна класти спокійно: адресами вони не стануть.

> [!reel] 🪆 Layouts — матрьошка з папок
> Для `/blog/latte-art` Next.js складає root layout → layout блогу → сторінку. Кожна сторінка стає `children` найближчого layout над нею.

> [!reel] 🔁 Layout не перемальовується між сусідніми сторінками
> Перехід з однієї статті блогу на іншу міняє лише сторінку. Лічильник у layout блогу лишається таким, яким був.

> [!reel] 🏷️ metadata успадковується полем за полем
> Сторінка задала лише `title` — `description` прийде з layout вище. Не треба повторювати всю `metadata` у кожному файлі.
>
> ```tsx
> export const metadata = { title: 'Про нас' }
> ```

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що робить адресу публічною в App Router?
> *дуже часто · теорія* · `nextjs-start-07-card-01`
>
> Файл `page.tsx` у папці. Папка задає сегмент адреси, але без `page.tsx` адреса не існує (404). Інші файли в папці — звичайні модулі, не маршрути.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🗂️ Папка — це шматок адреси|Розділ: папка — шматок адреси]] · [Next.js: Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

> [!question]- Який файл відповідає адресі /blog/latte-art?
> *часто · практика* · `nextjs-start-07-card-02`
>
> `app/blog/latte-art/page.tsx`. Кожен сегмент — окрема папка, а вміст сторінки — default export з `page.tsx`.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🪆 Крок 3. Вкладений layout для блогу|Розділ: вкладений layout]] · [Next.js: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

> [!question]- Що таке root layout і що в ньому обовʼязково?
> *дуже часто · теорія* · `nextjs-start-07-card-03`
>
> `app/layout.tsx` — найзовнішній layout, що обгортає всі сторінки. Він обовʼязковий і єдиний містить `<html>` і `<body>`; приймає `children`, куди Next.js підставляє сторінку.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🏠 Крок 2. Root layout — рамка для всього сайту|Розділ: root layout]] · [Next.js: layout.js — Root Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)

> [!question]- Що таке children у layout?
> *часто · теорія* · `nextjs-start-07-card-04`
>
> Проп, у який Next.js кладе вміст нижчого рівня: сторінку або вкладений layout разом з його сторінкою. Де стоїть `{children}`, там і зʼявиться сторінка.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🪆 Крок 3. Вкладений layout для блогу|Розділ: вкладені layouts]] · [Next.js: Nesting layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages#nesting-layouts)

> [!question]- Що відбувається з layout блогу при переході між двома статтями?
> *часто · теорія* · `nextjs-start-07-card-05`
>
> Нічого: він не перемальовується й зберігає стан (наприклад, лічильник у кнопці). Замінюється лише сторінка — `children`. Перезавантаження сторінки (F5) скидає весь стан.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🔁 Крок 4. Layout не зникає між переходами|Розділ: layout між переходами]] · [Next.js: Creating a layout](https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-layout)

> [!question]- Як задати заголовок вкладки для однієї сторінки?
> *часто · практика* · `nextjs-start-07-card-06`
>
> Експортувати з її `page.tsx` обʼєкт `export const metadata: Metadata = { title: '…' }`. Поля, яких сторінка не задала, успадковуються з layouts вище. Працює лише в серверних файлах.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🏷️ Крок 5. Заголовок вкладки: metadata|Розділ: metadata]] · [Next.js: Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

> [!question]- Як зробити власну сторінку 404?
> *часто · практика* · `nextjs-start-07-card-07`
>
> Створити `app/not-found.tsx` з default export. Він покажеться для будь-якої невідомої адреси, всередині root layout, зі статусом 404.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🚫 Крок 6. Власна сторінка 404|Розділ: сторінка 404]] · [Next.js: not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

### 🟡 Middle

> [!question]- Чому компоненти й дані можна тримати в папці app/ поруч зі сторінкою?
> *іноді · теорія* · `nextjs-start-07-card-08`
>
> Маршрутом стає лише `page.tsx`. `menu-data.ts` чи `like-button.tsx` поруч зі сторінкою недоступні за адресою — це colocation: код живе там, де його використовують.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🧱 Що вийшло: сайт цілком|Розділ: сайт цілком]] · [Next.js: Project Structure — Colocation](https://nextjs.org/docs/app/getting-started/project-structure#colocation)

> [!question]- Чому інтерактивну кнопку винесено з layout в окремий файл?
> *іноді · порівняння* · `nextjs-start-07-card-09`
>
> Стан і `onClick` працюють лише в Client Component, а `'use client'` на layout зробив би клієнтським увесь layout з усіма імпортами. Окремий маленький файл з директивою тримає layout серверним, а в браузер їде лише кнопка.
>
> 📚 [[Next.js - 07. Server і Client Components#📦 Що потрапляє в клієнтський бандл|Тема 07: клієнтський бандл]] · [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

> [!question]- Чи відловить next build root layout без <html> і <body>?
> *рідко · налагодження* · `nextjs-start-07-card-10`
>
> На 16.3.8 — ні: збірка проходить, хоча документація вимагає обидва теги. Помилку `Missing <html> and <body> tags in the root layout.` показує лише `next dev`. Тому перевіряй сторінки в dev, а root layout тримай повним.
>
> 📚 [[Next.js Start - 07. Сторінки й layouts#🏠 Крок 2. Root layout — рамка для всього сайту|Розділ: root layout]] · [Next.js: Missing Root Layout tags](https://nextjs.org/docs/messages/missing-root-layout-tags)

> [!quiz] Розминка: куди покласти панель, потрібну лише в блозі?
> level: junior · id: nextjs-start-07-quiz-08
>
> Блогу потрібна панель «Популярні статті» на `/blog` і на кожній статті, але не на `/menu` і `/about`. Де її найкраще написати?
>
> - [ ] У `app/layout.tsx`, сховавши на інших сторінках через CSS
> - [x] В `app/blog/layout.tsx`
> - [ ] Скопіювати в кожен `page.tsx` блогу
> - [ ] В `app/blog/page.tsx` — вона сама потрапить на всі статті
>
> **Пояснення:** layout папки `blog` обгортає `/blog` і все глибше, і тільки їх. Копія в кожній сторінці дублює код і не зберігає стан між переходами, а `app/blog/page.tsx` — це лише сторінка `/blog`, а не рамка для статей.

## 🛠️ Практика

> [!task] Перетвори шлях файлу на адресу
> level: junior · difficulty: easy · id: nextjs-start-07-task-01 · tags: routing, page
>
> Напиши `fileToRoute(file)`: отримує шлях файлу від кореня проєкту і повертає адресу, яку цей файл створює, або `null`, якщо файл адресою не стає.
>
> - Адресу дає лише файл `page` з розширенням `.tsx`, `.ts`, `.jsx` або `.js` усередині `app/`.
> - `app/page.tsx` → `'/'`; `app/blog/latte-art/page.tsx` → `'/blog/latte-art'`.
> - `layout.tsx`, `not-found.tsx`, `menu-data.ts` і будь-які файли поза `app/` → `null`.
>
> Задача на TypeScript: типи знімаються перед запуском, тести перевіряють значення.
>
> ```ts starter
> function fileToRoute(file: string): string | null {
>   // ❌ перетворює на адресу будь-який файл
>   return '/' + file.replace(/^app\//, '').replace(/\.\w+$/, '')
> }
> ```
>
> ```ts tests
> test('app/page.tsx — це головна /', () => {
>   expect(fileToRoute('app/page.tsx')).toBe('/')
> })
>
> test('вкладені папки дають сегменти адреси', () => {
>   expect(fileToRoute('app/about/page.tsx')).toBe('/about')
>   expect(fileToRoute('app/blog/latte-art/page.tsx')).toBe('/blog/latte-art')
> })
>
> test('page з будь-яким із чотирьох розширень', () => {
>   expect(fileToRoute('app/menu/page.js')).toBe('/menu')
>   expect(fileToRoute('app/menu/page.jsx')).toBe('/menu')
>   expect(fileToRoute('app/menu/page.ts')).toBe('/menu')
> })
>
> test('layout, not-found і сусідні модулі не стають адресами', () => {
>   expect(fileToRoute('app/layout.tsx')).toBeNull()
>   expect(fileToRoute('app/blog/layout.tsx')).toBeNull()
>   expect(fileToRoute('app/not-found.tsx')).toBeNull()
>   expect(fileToRoute('app/menu/menu-data.ts')).toBeNull()
>   expect(fileToRoute('app/contacts/contacts.tsx')).toBeNull()
> })
>
> test('файли поза app/ і схожі назви — не сторінки', () => {
>   expect(fileToRoute('lib/page.tsx')).toBeNull()
>   expect(fileToRoute('app/blog/my-page.tsx')).toBeNull()
>   expect(fileToRoute('app/blog/page.css')).toBeNull()
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбий шлях на частини: `file.split('/')`. Перша частина має бути `app`, остання — `page.` з одним із чотирьох розширень.
>
> > [!hint]- Підказка 2
> > Сегменти адреси — усе між `app` і назвою файлу. Нуль сегментів — це `'/'`, інакше `'/' + segments.join('/')`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function fileToRoute(file: string): string | null {
> >   const parts = file.split('/')
> >   const name = parts[parts.length - 1]
> >   if (parts[0] !== 'app') return null
> >   if (!/^page\.(tsx|ts|jsx|js)$/.test(name)) return null
> >   const segments = parts.slice(1, -1)
> >   return segments.length === 0 ? '/' : '/' + segments.join('/')
> > }
> > ```
> >
> > Перевіряємо дві речі: файл лежить в `app/` і зветься рівно `page` з дозволеним розширенням. `my-page.tsx` чи `page.css` не проходять, бо регулярний вираз прив'язаний до початку й кінця назви (`^…$`). Справжній Next.js знає ще про route groups, приватні папки й динамічні сегменти — це теми 01–03 основного посібника.

> [!task] Які layouts обгорнуть сторінку
> level: junior · difficulty: medium · id: nextjs-start-07-task-02 · tags: routing, layout
>
> Напиши `layoutsFor(route, files)`. `files` — список шляхів з папки `app/`. Функція повертає шляхи всіх `layout.tsx`, які обгорнуть сторінку `route`, **від root layout до найглибшого**. Якщо для `route` немає `page.tsx` — поверни `null` (це 404).
>
> - Layout з папки `app/blog/` обгортає `/blog` і все, що глибше (`/blog/latte-art`), але не `/blogger`.
> - Порядок результату — від зовнішнього до внутрішнього.
> - Для простоти всі файли мають розширення `.tsx`.
>
> ```ts starter
> function layoutsFor(route: string, files: string[]): string[] | null {
>   // твій код
> }
> ```
>
> ```ts tests
> const site = [
>   'app/layout.tsx',
>   'app/page.tsx',
>   'app/not-found.tsx',
>   'app/about/page.tsx',
>   'app/blog/layout.tsx',
>   'app/blog/page.tsx',
>   'app/blog/latte-art/page.tsx',
>   'app/blogger/page.tsx',
>   'app/shop/layout.tsx',
>   'app/shop/cart/layout.tsx',
>   'app/shop/cart/page.tsx',
> ]
>
> test('головну обгортає лише root layout', () => {
>   expect(layoutsFor('/', site)).toEqual(['app/layout.tsx'])
> })
>
> test('стаття блогу — root layout, потім layout блогу', () => {
>   expect(layoutsFor('/blog/latte-art', site)).toEqual(['app/layout.tsx', 'app/blog/layout.tsx'])
> })
>
> test('layout блогу не обгортає /blogger', () => {
>   expect(layoutsFor('/blogger', site)).toEqual(['app/layout.tsx'])
> })
>
> test('кілька рівнів — від зовнішнього до внутрішнього', () => {
>   expect(layoutsFor('/shop/cart', site)).toEqual([
>     'app/layout.tsx',
>     'app/shop/layout.tsx',
>     'app/shop/cart/layout.tsx',
>   ])
> })
>
> test('немає page.tsx — це 404, повертає null', () => {
>   expect(layoutsFor('/shop', site)).toBeNull()
>   expect(layoutsFor('/contacts', site)).toBeNull()
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбий `route` на сегменти: `route.split('/').filter(Boolean)`. Для `/` вийде порожній масив.
>
> > [!hint]- Підказка 2
> > Для кожного рівня глибини `i` від 0 до кількості сегментів склади папку: `['app', ...segments.slice(0, i)].join('/')`. Перевір, чи є в `files` файл `<папка>/layout.tsx`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function layoutsFor(route: string, files: string[]): string[] | null {
> >   const segments = route.split('/').filter(Boolean)
> >   const pageFile = ['app', ...segments, 'page.tsx'].join('/')
> >   if (!files.includes(pageFile)) return null
> >
> >   const result: string[] = []
> >   for (let i = 0; i <= segments.length; i++) {
> >     const layout = ['app', ...segments.slice(0, i), 'layout.tsx'].join('/')
> >     if (files.includes(layout)) result.push(layout)
> >   }
> >   return result
> > }
> > ```
> >
> > Ідемо від кореня вглиб по одному сегменту — так само, як Next.js складає матрьошку. Порівняння цілих шляхів, а не `startsWith`, автоматично відсікає `/blogger`: папка `app/blogger` — не `app/blog`. Помилка, яку ловить третій тест: `route.startsWith('/blog')` вважає `/blogger` частиною блогу.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) — офіційний старт: сторінки, layouts, вкладені маршрути.
- 🟢 [Next.js — Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — усі спеціальні файли й colocation.
- 🟡 [Next.js — layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout) — довідник: root layout, обмеження, приклади.
- 🟡 [Next.js — page.js](https://nextjs.org/docs/app/api-reference/file-conventions/page) — довідник сторінки та її props.
- 🟡 [Next.js — not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — сторінка 404 і функція `notFound()`.
- 🟡 [Next.js — Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — `metadata`, `generateMetadata`, іконки й картинки.
- 🟢 [React — Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) — що таке `children` з точки зору React.
- 🟢 [MDN — <title>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title) — навіщо сторінці заголовок і як його бачать пошуковики.

> [!important] Підсумок
> - Папка в `app/` — сегмент адреси, а `page.tsx` з default export робить його сторінкою. Інші файли поруч адресами не стають.
> - Root layout `app/layout.tsx` обгортає весь сайт і єдиний містить `<html>` і `<body>`; сторінка приходить у нього як `children`.
> - Вкладений layout (`app/blog/layout.tsx`) обгортає свою папку й усе глибше. Між сусідніми сторінками він не перемальовується й зберігає стан.
> - `metadata` задає `<title>` і опис; глибший файл перекриває лише ті поля, які задав.
> - `app/not-found.tsx` — власна 404 для невідомих адрес, усередині root layout і зі статусом 404.

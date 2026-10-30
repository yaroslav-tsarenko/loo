---
title: Навігація
id: nextjs-start-08
slug: 08-navigation
order: 8
level: noob
skill: routing
icon: px:link
tags: [nextjs, routing, link, navigation, usepathname, userouter, redirect, beginner]
prerequisites:
  - "[[Next.js Start - 07. Сторінки й layouts]]"
estimatedMinutes: 35
nextVersion: 16.3.8
---

# Навігація

> [!success] 🎯 Після цього розділу ти зможеш
> - зробити посилання між сторінками через `<Link>` і пояснити, що втрачається зі звичайним `<a>`;
> - підсвітити активний пункт меню через `usePathname` і пояснити, навіщо тут `'use client'`;
> - перейти на іншу сторінку з коду через `useRouter().push` і відрізнити цей випадок від звичайного посилання;
> - перенаправити зі старої адреси на нову функцією `redirect()` на сервері;
> - зробити список посилань на динамічні сторінки `/blog/[slug]` і прочитати `params` у Next.js 16;
> - пояснити, що таке prefetching і чому навігація в продакшні швидша, ніж у `next dev`.

## 🤔 Передбач

> [!quiz] Що покаже лічильник після кліку?
> level: junior · type: output · id: nextjs-start-08-quiz-01
>
> У layout блогу є кнопка `❤️` з `useState` (як у [[Next.js Start - 07. Сторінки й layouts|темі 07]]). Користувач на `/blog` натиснув її двічі — `❤️ 2`. Потім клікнув посилання на статтю, написане звичайним тегом:
>
> ```tsx
> <a href="/blog/latte-art">Латте-арт</a>
> ```
>
> Що покаже кнопка на `/blog/latte-art`?
>
> - [x] `❤️ 0`
> - [ ] `❤️ 2` — layout блогу спільний, тож стан зберігається
> - [ ] `❤️ 2`, але тільки в продакшн-збірці
> - [ ] Нічого: сторінка з `<a>` у Next.js не відкриється
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Звичайний `<a>` змушує браузер **повністю** завантажити нову сторінку: усі компоненти створюються заново, і стан стає нульовим. Щоб layout пережив перехід, потрібен `<Link>`.

## 🧒 Простими словами

Повернімося до торгового центру з [[Next.js Start - 07. Сторінки й layouts|теми 07]]. Звичайне посилання `<a>` — це вийти на вулицю, обійти будівлю й зайти знову через турнікет: охорона, рамка, гардероб — усе з початку, а покупки з кошика ти залишив біля виходу. `<Link>` — перейти до сусідньої крамниці коридором: будівля й кошик на місці, змінюється лише вітрина. А prefetching — це консультант, який, побачивши, куди ти дивишся, заздалегідь відчиняє двері потрібної крамниці.

## 🔬 Як це працює насправді

Продовжуємо сайт кавʼярні «Зерно» з теми 07: у ньому вже є головна, меню, «Про нас», блог з бічною панеллю і сторінка 404. Додамо до нього справжню навігацію.

### 🔗 Link: посилання, яке не перезавантажує сторінку

`<Link>` — компонент Next.js для переходів між сторінками твого сайту. Імпортують його з `next/link`, адресу передають у `href`:

```tsx
// app/demo/page.tsx — порівняння Link і <a>
import Link from 'next/link'

export default function DemoPage() {
  return (
    <>
      <Link href="/blog">Блог через Link</Link>
      <a href="/blog">Блог через a</a>
    </>
  )
}
```

Подивись на вихідний HTML: **обидва** рядки там — звичайні `<a href="/blog">`. Тобто `<Link>` — це той самий `<a>`, тільки з «мозком»: після hydration (момент, коли React у браузері «оживляє» готовий HTML і чіпляє до нього обробники подій) `<Link>` перехоплює клік і робить **клієнтську навігацію** (client-side navigation):

1. Браузер **не** завантажує нову сторінку з нуля. Next.js запитує в сервера лише опис нової сторінки (RSC payload — серіалізований результат серверних компонентів; детально в [[Next.js - 07. Server і Client Components|темі 07 основного посібника]]).
2. Спільні layouts лишаються на місці разом зі своїм станом. Замінюється тільки та частина, що відрізняється, — зазвичай сторінка.
3. Адреса в рядку браузера змінюється, і кнопка «Назад» працює як завжди.

Перевірено на 16.3.8 (`next start`, браузер): після кліку по `<Link>` змінна, яку ми записали у `window` перед кліком, лишилася на місці — це той самий документ. Після кліку по `<a>` вона зникла: браузер завантажив сторінку заново. А лічильник у layout блогу після `<a>` скинувся з `❤️ 2` на `❤️ 0`.

Що ще варто знати про `<Link>`:

- Атрибути звичайного `<a>` (`className`, `target`, `aria-*`) передаються в нього як є.
- `href` можна зібрати з шаблонного рядка: `` href={`/blog/${post.slug}`} `` — побачимо нижче.
- Для посилань на **чужі** сайти пиши звичайний `<a href="https://…">`: це інший застосунок, тож клієнтської навігації туди все одно не буде.

> [!diagram] Клік по <a> і клік по <Link>
> ```yaml
> layout: compare
> columns: { a: "<a href>", link: "<Link href>" }
> nodes:
>   - { id: a1, col: a, label: "клік", text: "браузер іде на /blog/latte-art", tone: gray }
>   - { id: a2, col: a, label: "сервер", text: "повний HTML нової сторінки", tone: orange }
>   - { id: a3, col: a, label: "браузер", text: "усе створюється заново", note: "❤️ 2 → ❤️ 0", tone: red, icon: "px:warning" }
>   - { id: l1, col: link, label: "клік", text: "Link перехоплює клік", tone: gray }
>   - { id: l2, col: link, label: "сервер (або prefetch-кеш)", text: "RSC payload нової сторінки", tone: blue }
>   - { id: l3, col: link, label: "браузер", text: "замінюється лише сторінка", note: "❤️ 2 лишається", tone: green, icon: "px:check" }
> steps:
>   - { show: [a1, l1], note: "В обох випадках у HTML стоїть <a href>. Різниця — що відбувається після кліку." }
>   - { show: [a2, l2], note: "<a> просить у сервера цілу нову сторінку. <Link> просить лише опис того, що змінилося, — або бере його з кешу, якщо вже зробив prefetch." }
>   - { show: [a3, l3], note: "Після <a> браузер будує все з нуля, і стан зникає. Після <Link> React міняє тільки сторінку, а layouts і їхній стан лишаються." }
> ```
> Ліворуч — повне перезавантаження, праворуч — клієнтська навігація.

> [!quiz] Перевір себе: обери правдиві твердження про Link
> level: junior · type: multi · id: nextjs-start-08-quiz-02
> - [x] У вихідному HTML `<Link>` перетворюється на звичайний `<a href>`
> - [x] Під час переходу через `<Link>` спільні layouts зберігають свій стан
> - [x] `className` і `target` можна передати в `<Link>` так само, як в `<a>`
> - [ ] `<Link>` працює лише в Client Component з `'use client'`
> - [ ] Звичайний `<a href="/about">` у Next.js не працює взагалі
>
> **Пояснення:** `<Link>` рендериться в `<a>`, тож посилання працює навіть до завантаження JS. Імпортувати його можна і в серверний файл — у темі 07 ми так і робили в root layout. А `<a>` працює, просто з повним перезавантаженням сторінки.

### 🟢 Активний пункт меню: usePathname

Меню виглядає краще, коли поточний пункт виділено. Для цього треба знати **поточний шлях** (pathname) — частину адреси після домену без `?…`: для `https://zerno.example/blog/latte-art?ref=ig` це `/blog/latte-art`. Його дає хук `usePathname` з `next/navigation`.

Хук — функція React, що починається з `use` і працює лише в Client Component. Тому меню виносимо в окремий файл з `'use client'`:

```tsx
// app/ui/nav-links.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isActive } from './is-active'

const links = [
  { href: '/', label: 'Зерно' },
  { href: '/menu', label: 'Меню' },
  { href: '/about', label: 'Про нас' },
  { href: '/blog', label: 'Блог' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav>
      {links.map((link) => {
        const active = isActive(pathname, link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={active ? 'active' : undefined}
            aria-current={active ? 'page' : undefined}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
```

А root layout лишається серверним — він лише показує меню:

```tsx
// app/layout.tsx — Server Component, меню всередині — клієнтське
import type { Metadata } from 'next'
import { NavLinks } from './ui/nav-links'
import './globals.css'

export const metadata: Metadata = {
  title: 'Кавʼярня «Зерно»',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <header>
          <NavLinks />
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

```css
/* app/globals.css */
nav a { margin-right: 12px; }
nav a.active { font-weight: bold; text-decoration: underline; }
```

`aria-current="page"` — підказка для скрінрідерів: «це поточна сторінка». Клас `active` — для очей, атрибут — для тих, хто сайт слухає.

**Чому не прочитати шлях прямо в layout?** Бо layout між переходами не перемальовується (тема 07) — значення застаріло б після першого ж кліку. Тому Next.js навмисно не дає layout поточного шляху, а Client Component з `usePathname` перемальовується при кожній навігації.

Якщо забути `'use client'`, `next build` зупиниться ще на компіляції:

```text
./app/ui/nav-links.tsx:4:10
Error: You're importing a module that depends on `usePathname` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.
Import trace:
  Server Component:
    ./app/ui/nav-links.tsx
    ./app/layout.tsx
```

Читай знизу вгору: `layout.tsx` (серверний) імпортує `nav-links.tsx`, а той — `usePathname`. Ліки написані прямо в повідомленні: директива `'use client'` першим рядком.

#### Коли пункт «активний»

Найпростіша перевірка — `pathname === link.href`. Але відкрий статтю `/blog/latte-art`: пункт «Блог» згасне, хоча ти все ще в блозі. Потрібне правило «адреса дорівнює `href` **або** починається з `href` і слеша». З головною `/` обережно: з нього починається кожна адреса, тож для неї — лише точний збіг.

```ts
// app/ui/is-active.ts — чи «горить» пункт меню для поточного шляху
export function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}
```

Чому `href + '/'`, а не просто `startsWith(href)`? Бо інакше пункт `/blog` загорівся б і на `/blogger`. Повну версію з хвостовими слешами й `?query` напишеш сам у [[#🛠️ Практика]].

> [!quiz] Перевір себе: заповни пропуски в меню
> level: junior · type: fill · bank: next/router, useRouter · id: nextjs-start-08-quiz-03
>
> ```tsx fill
> // app/ui/nav-links.tsx
> [['use client'|"use client"]]
>
> import Link from 'next/link'
> import { [[usePathname]] } from '[[next/navigation]]'
>
> export function NavLinks() {
>   const pathname = usePathname()
>   return (
>     <Link href="/blog" aria-current={pathname === '/blog' ? '[[page]]' : undefined}>
>       Блог
>     </Link>
>   )
> }
> ```
>
> **Пояснення:** хук працює лише в Client Component — звідси директива першим рядком. `usePathname` імпортують з `next/navigation`; `next/router` — модуль старого Pages Router, а `useRouter` поточного шляху не повертає. Для активного посилання `aria-current` має значення `page`.

> [!quiz] Перевір себе: що поверне наївна перевірка?
> level: junior · type: output · id: nextjs-start-08-quiz-04
>
> ```ts
> const naive = (pathname: string, href: string) => pathname.startsWith(href)
>
> console.log(naive('/blog/latte-art', '/blog'))
> console.log(naive('/blogger', '/blog'))
> console.log(naive('/menu', '/'))
> ```
>
> - [x] `true`, `true`, `true`
> - [ ] `true`, `false`, `false`
> - [ ] `true`, `false`, `true`
> - [ ] `false`, `false`, `false`
>
> **Пояснення:** `startsWith` порівнює символи, а не сегменти: `/blogger` починається з `/blog`, а будь-яка адреса — з `/`. Тому «Блог» загорівся б на чужій сторінці, а «Зерно» (головна) — завжди. Ліки: для `/` — точний збіг, для решти — `href` або `href + '/'`.

### 🧭 Перехід з коду: useRouter

Іноді переходити треба не за кліком по посиланню, а **після дії**: користувач натиснув «Замовити», ми щось перевірили — і ведемо його на сторінку подяки. Для цього є хук `useRouter` з `next/navigation`:

```tsx
// app/order/order-button.tsx
'use client'

import { useRouter } from 'next/navigation'

export function OrderButton() {
  const router = useRouter()

  function handleClick() {
    // тут могла б бути перевірка форми чи запит на сервер
    router.push('/order/thanks')
  }

  return <button onClick={handleClick}>Замовити лате</button>
}
```

```tsx
// app/order/page.tsx
import { OrderButton } from './order-button'

export default function OrderPage() {
  return (
    <>
      <h1>Замовлення</h1>
      <OrderButton />
    </>
  )
}
```

```tsx
// app/order/thanks/page.tsx
export default function ThanksPage() {
  return <h1>Дякуємо! Лате вже готується ☕</h1>
}
```

`router.push` робить ту саму клієнтську навігацію, що й `<Link>` (перевірено: після кліку `/order/thanks`, документ той самий). Основні методи:

| Метод | Що робить |
|---|---|
| `router.push('/x')` | перейти на `/x` і додати запис в історію: «Назад» поверне сюди |
| `router.replace('/x')` | перейти, **замінивши** поточний запис: «Назад» сюди не поверне (зручно після входу в акаунт) |
| `router.back()` | крок назад в історії, як кнопка браузера |
| `router.refresh()` | заново отримати з сервера поточну сторінку, не втрачаючи стан у браузері |

Документація прямо радить: **для звичайних переходів — `<Link>`**, а `useRouter` — лише коли посилання не підходить. `<Link>` — справжній `<a>`: його можна відкрити в новій вкладці, скопіювати, його бачать пошуковики й скрінрідери, і він робить prefetch. Кнопка з `router.push` нічого з цього не вміє.

Дві поширені помилки:

- **Імпорт з `next/router`.** Це хук старого Pages Router. В App Router `next build` падає з ``Error: NextRouter was not mounted.`` Правильно — `next/navigation`.
- **Адреса від користувача в `router.push`.** Документація попереджає: `javascript:`-адреса в `push` виконається як код на твоїй сторінці (XSS). Передавай лише адреси, які збудував сам.

> [!quiz] Перевір себе: де потрібен саме useRouter?
> level: junior · id: nextjs-start-08-quiz-05
>
> - [ ] Пункти головного меню сайту
> - [ ] Список статей блогу з посиланнями на кожну
> - [x] Після кліку «Замовити» перевірити кошик і, якщо все гаразд, перейти на `/order/thanks`
> - [ ] Посилання «На головну» на сторінці 404
>
> **Пояснення:** меню, список статей і «На головну» — звичайні посилання: `<Link>` дає новий таб, prefetch і доступність. `useRouter` потрібен, коли перехід — наслідок логіки в обробнику події, а не клік по адресі.

### ↪️ Перенаправлення на сервері: redirect()

Кавʼярня колись мала меню на `/old-menu`, і ця адреса досі живе в старих листівках. Хочемо, щоб вона вела на `/menu`. На сервері для цього є функція `redirect()` з `next/navigation`:

```tsx
// app/old-menu/page.tsx — стара адреса, яка веде на нову
import { redirect } from 'next/navigation'

export default function OldMenuPage() {
  redirect('/menu')
}
```

Перевірено на 16.3.8 (`curl -I http://localhost:3000/old-menu`): відповідь `HTTP/1.1 307 Temporary Redirect` із заголовком `location: /menu`. Браузер побачив код 307 (тимчасове перенаправлення, коди статусів — у [[Next.js Start - 01. Як працює веб|темі 01]]) і сам пішов на `/menu`.

Що важливо про `redirect()`:

- Вона **кидає** спеціальну помилку й зупиняє рендер, тож `return` перед нею не потрібен, а код після неї не виконається.
- Її викликають під час рендеру серверного компонента (або в Server Action — тема 11). **В обробнику `onClick` — ні**: там використовуй `router.push`.
- Для назавжди переїхалих адрес є `permanentRedirect()` (код 308). Перенаправлення за умовою (наприклад, «не увійшов → на `/login`») і в `next.config` — тема 06 основного посібника.

> [!quiz] Перевір себе: що поверне сервер?
> level: junior · type: output · id: nextjs-start-08-quiz-06
>
> Сторінка `app/old-menu/page.tsx` викликає `redirect('/menu')`. Що побачиш у виводі `curl -I http://localhost:3000/old-menu` на продакшн-збірці?
>
> - [x] `307 Temporary Redirect` і `location: /menu`
> - [ ] `200 OK` і HTML сторінки `/menu`
> - [ ] `404 Not Found`: у `page.tsx` немає `return`
> - [ ] `500 Internal Server Error`: `redirect()` кидає помилку
>
> **Пояснення:** `redirect()` справді кидає помилку, але її ловить сам Next.js і перетворює на відповідь-перенаправлення. За замовчуванням це тимчасовий 307, а `permanentRedirect()` дає 308. Тож вміст `/menu` прийде вже другим запитом, який браузер зробить сам.

### 🧩 Динамічні посилання на статті

У темі 07 кожна стаття мала свою папку. Для двох статей це нормально, а для двохсот — ні. Тут допомагає **динамічний сегмент**: папка з назвою в квадратних дужках `[slug]` збігається з будь-яким значенням у цьому місці адреси. Одна сторінка `app/blog/[slug]/page.tsx` обслуговує і `/blog/latte-art`, і `/blog/first-coffee`, і будь-яку іншу.

Спершу дані. Поки бази немає, тримаємо статті в памʼяті:

```ts
// lib/posts.ts — статті в памʼяті замість бази даних
export type Post = { slug: string; title: string; body: string }

export const posts: Post[] = [
  { slug: 'first-coffee', title: 'Як ми зварили першу каву', body: 'Спершу була турка…' },
  { slug: 'latte-art', title: 'Латте-арт за 5 хвилин', body: 'Тримай глечик низько…' },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}
```

> [!note] Чому в прикладах дані в памʼяті
> Приклади курсу зібрані з `cacheComponents: true`. Справжній запит до бази під час збірки зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують або обгортають у `<Suspense>`. Перші дані з сервера — у темі 10, тут ми це опускаємо.

Список статей будує посилання шаблонним рядком:

```tsx
// app/blog/page.tsx — список статей з динамічними посиланнями
import Link from 'next/link'
import { posts } from '@/lib/posts'

export default function BlogPage() {
  return (
    <>
      <h1>Усі статті</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
```

`@/lib/posts` — скорочення шляху від кореня проєкту, яке `create-next-app` налаштовує в `tsconfig.json`. А тепер сама сторінка статті:

```tsx
// app/blog/[slug]/page.tsx → /blog/first-coffee, /blog/latte-art, …
import { notFound } from 'next/navigation'
import { getPost, posts } from '@/lib/posts'

// які slug відомі заздалегідь — Next.js збере ці сторінки під час next build
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params // у Next.js 16 params — Promise
  const post = getPost(slug)
  if (!post) notFound() // невідомий slug → сторінка 404

  return (
    <>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </>
  )
}
```

Що тут нового:

- **`params`** — проп сторінки зі значеннями динамічних сегментів: для `/blog/latte-art` це `{ slug: 'latte-art' }`. Ключ `slug` береться з назви папки `[slug]`.
- **`params` — це Promise.** У Next.js 16 значення приходить «пізніше», тож компонент стає `async` і робить `await params`. Без `await` TypeScript зупинить збірку: ``Property 'slug' does not exist on type 'Promise<{ slug: string; }>'``. У старих туторіалах ти побачиш `params.slug` без `await` — це код Next.js 14 і раніше.
- **`notFound()`** — зупиняє рендер і показує `not-found.tsx` (з теми 07). Перевірено: `/blog/unknown` дає статус 404 і нашу сторінку «Такої сторінки немає».
- **`generateStaticParams`** — список відомих `slug`. Next.js збирає ці сторінки заздалегідь, під час `next build`.

Після `next build` таблиця маршрутів показує, що вийшло:

```text
├   /blog/[slug]
│ ├ ◐ /blog/[slug]
│ ├ ○ /blog/first-coffee
│ └ ○ /blog/latte-art
```

Дві статті зібрані як статичні (`○`), а `◐ /blog/[slug]` — заготовка для `slug`, яких не було в списку: їх Next.js відрендерить, коли хтось їх відкриє.

> [!warning] Без generateStaticParams збірка падає
> З `cacheComponents: true` прибери `generateStaticParams` — і `next build` на 16.3.8 зупиниться з двома помилками. Перша — про наше меню: ``Route "/blog/[slug]": Next.js encountered URL data `usePathname()` in a Client Component outside of `<Suspense>`.`` Друга — про сторінку: ``Next.js encountered uncached or runtime data during prerendering.`` і `params` у списку причин. Значення невідомі до запиту, а Next.js хоче зібрати якомога більше заздалегідь. Для початківця найпростіші ліки — `generateStaticParams`; інші (`<Suspense>`) — у темах 03 і 11 основного посібника.

> [!quiz] Перевір себе: склади сторінку статті
> level: junior · type: order · id: nextjs-start-08-quiz-07
>
> ```tsx order
> export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
>   const { slug } = await params
>   const post = getPost(slug)
>   if (!post) notFound()
>   return <h1>{post.title}</h1>
> }
>   const { slug } = params // ✗
> ```
>
> **Пояснення:** спершу дістаємо `slug` з `params` через `await` — у Next.js 16 це Promise. Потім шукаємо статтю і, якщо її немає, викликаємо `notFound()` до `return`: інакше `post.title` впаде на `undefined`. Рядок без `await` — код старих версій, у 16 він не пройде перевірку типів.

### ⚡ Prefetching одним абзацом

Чому клік по `<Link>` у продакшні здається миттєвим? Бо Next.js робить **prefetching** — заздалегідь завантажує сторінку, на яку ти, ймовірно, перейдеш. Щойно `<Link>` зʼявляється в області видимості (viewport) або на нього наводять курсор, у фоні йде запит; у вкладці Network це запити з `?_rsc=` у адресі. Статичну сторінку Next.js завантажує повністю, динамічну — лише до найближчого `loading.tsx` (або пропускає). На клік відповідь уже в кеші браузера. Важливо: **prefetching працює лише в продакшн-збірці** (`next build` + `next start`); у `next dev` його немає, тож повільна навігація в dev — ще не проблема. Вимкнути його для окремого посилання можна через `prefetch={false}` — це має сенс для довгих списків з сотнями посилань. Next.js 16.3 має ще й Partial Prefetching (вмикається окремо), а як влаштований кеш навігації — тема 04 основного посібника.

> [!quiz] Перевір себе: чому в dev навігація повільніша?
> level: junior · id: nextjs-start-08-quiz-08
>
> У `next dev` перехід по меню займає пів секунди, а в задеплоєній версії — миттєвий. Чому?
>
> - [x] Prefetching працює лише в продакшн-збірці, а dev ще й компілює сторінки на вимогу
> - [ ] У dev `<Link>` працює як звичайний `<a>` і перезавантажує сторінку
> - [ ] У продакшні Next.js завантажує весь сайт одним файлом під час першого заходу
> - [ ] У dev треба вручну додати `prefetch={true}` до кожного посилання
>
> **Пояснення:** у dev клієнтська навігація теж є, але без prefetch: сторінка запитується лише на клік, і dev-сервер ще й компілює її вперше. Тому швидкість навігації міряють на `next build` + `next start`, а не в dev.

### 🏭 Як це роблять у продакшні

- **Меню — масив даних + один Client Component.** Пункти в масиві (`links`), активність — окрема чиста функція з тестами (`isActive`), а layout лишається серверним.
- **Внутрішні посилання — завжди `<Link>`**, зовнішні — `<a>` (часто з `target="_blank"` і `rel="noopener noreferrer"`).
- **`aria-current="page"`** на активному пункті — дешево й важливо для доступності.
- **`router.push` — після дій**, не замість посилань; адреси в нього передають лише свої, не з введення користувача.
- **Старі адреси не ламають:** `redirect()` на сторінці або правила в `next.config` (тема 06 основного посібника), щоб посилання з листівок і пошуковиків вели на нові сторінки.
- **Довгі списки посилань** (таблиці на тисячі рядків) — з `prefetch={false}` або prefetch лише при наведенні, щоб не навантажувати сервер.

## ⚠️ Пастки

> [!pitfall] <a> для внутрішніх посилань
> Сторінка повністю перезавантажується: стан у layouts зникає, JS завантажується заново, prefetch не працює.
>
> ```tsx
> <a href="/blog">Блог</a> // ❌ повне перезавантаження
> <Link href="/blog">Блог</Link> // ✅ клієнтська навігація
> ```

> [!pitfall] usePathname без 'use client'
> `next build` падає з ``You're importing a module that depends on `usePathname` into a React Server Component module.`` Хуки — лише в Client Component: директива першим рядком файлу з меню.

> [!pitfall] useRouter з next/router
> Це API старого Pages Router. В App Router збірка падає з ``NextRouter was not mounted.``
>
> ```tsx
> import { useRouter } from 'next/router' // ❌
> import { useRouter } from 'next/navigation' // ✅
> ```

> [!pitfall] redirect() в обробнику кліку
> `redirect()` працює під час рендеру на сервері (і в Server Actions). В `onClick` у браузері використовуй `router.push`.

> [!pitfall] params без await
> У Next.js 16 `params` — Promise. `params.slug` без `await` зупиняє збірку помилкою TypeScript `Property 'slug' does not exist on type 'Promise<…>'`.

> [!pitfall] Активний пункт через startsWith(href)
> `'/blogger'.startsWith('/blog')` — `true`, а з `/` починається кожна адреса. Порівнюй сегменти: для `/` — точний збіг, для решти — `href` або `href + '/'`.

## 🔗 Звʼязки

- [[Next.js Start - 07. Сторінки й layouts]] — сторінки, layouts і `not-found.tsx`, на яких тримається навігація.
- [[Next.js - 07. Server і Client Components]] — чому `usePathname` і `useRouter` потребують `'use client'`, а `<Link>` можна імпортувати в серверний файл.
- [[Next.js Start - 01. Як працює веб]] — коди статусів 307, 308, 404 і заголовок `location`.
- Далі в основному посібнику: тема 03 — динамічні маршрути детально, тема 04 — навігація під капотом (prefetch, кеш, збереження стану), тема 06 — перенаправлення в `proxy.ts` і `next.config`.

## ⚡ Фішки

> [!reel] 🔗 Link у HTML — звичайний <a>
> Відкрий вихідний код: `<Link href="/blog">` там — просто `<a href="/blog">`. Тож посилання працює навіть до завантаження JS, а після hydration Link перехоплює клік і не перезавантажує сторінку.

> [!reel] 🟢 Layout не знає, де ти
> Layout не перемальовується між переходами, тож Next.js навмисно не дає йому поточну адресу. Активне меню — окремий Client Component з `usePathname`.

> [!reel] ↪️ redirect() не потребує return
> `redirect('/menu')` кидає спеціальну помилку, яку Next.js перетворює на відповідь 307. Код після неї не виконається, а TypeScript знає, що функція не повертається.

> [!reel] 🐢 У dev немає prefetch
> Prefetching працює лише після `next build` + `next start`. Повільна навігація в `next dev` — ще не привід оптимізувати.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим <Link> відрізняється від звичайного <a>?
> *дуже часто · порівняння* · `nextjs-start-08-card-01`
>
> У HTML це той самий `<a href>`, але після hydration `<Link>` перехоплює клік і робить клієнтську навігацію: без перезавантаження, зі збереженням layouts і їхнього стану, з prefetch у продакшні. `<a>` завантажує сторінку з нуля.
>
> 📚 [[Next.js Start - 08. Навігація#🔗 Link: посилання, яке не перезавантажує сторінку|Розділ: Link]] · [Next.js: Link Component](https://nextjs.org/docs/app/api-reference/components/link)

> [!question]- Звідки імпортують Link, usePathname, useRouter і redirect?
> *часто · практика* · `nextjs-start-08-card-02`
>
> `Link` — з `next/link`. `usePathname`, `useRouter`, `redirect` і `notFound` — з `next/navigation`. `next/router` — це старий Pages Router.
>
> 📚 [[Next.js Start - 08. Навігація#🧭 Перехід з коду: useRouter|Розділ: useRouter]] · [Next.js: useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)

> [!question]- Що повертає usePathname для адреси /blog/latte-art?ref=ig?
> *часто · теорія* · `nextjs-start-08-card-03`
>
> `'/blog/latte-art'` — шлях без домену й без `?query`. Для `/` повертає `'/'`.
>
> 📚 [[Next.js Start - 08. Навігація#🟢 Активний пункт меню: usePathname|Розділ: usePathname]] · [Next.js: usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname)

> [!question]- Чому файл з usePathname має починатися з 'use client'?
> *дуже часто · теорія* · `nextjs-start-08-card-04`
>
> `usePathname` — хук, а хуки працюють лише в Client Component. Без директиви `next build` падає з «You're importing a module that depends on `usePathname` into a React Server Component module». Layout лишається серверним і просто показує клієнтське меню.
>
> 📚 [[Next.js Start - 08. Навігація#🟢 Активний пункт меню: usePathname|Розділ: usePathname]] · [Next.js: use client](https://nextjs.org/docs/app/api-reference/directives/use-client)

> [!question]- Коли потрібен useRouter, а коли досить Link?
> *часто · порівняння* · `nextjs-start-08-card-05`
>
> `<Link>` — для всього, що є посиланням: меню, списки, «На головну». `useRouter().push` — коли перехід стається після дії в обробнику (перевірили форму → `/order/thanks`). Документація радить `<Link>` за замовчуванням.
>
> 📚 [[Next.js Start - 08. Навігація#🧭 Перехід з коду: useRouter|Розділ: useRouter]] · [Next.js: useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)

> [!question]- Чим router.push відрізняється від router.replace?
> *іноді · порівняння* · `nextjs-start-08-card-06`
>
> `push` додає новий запис в історію — «Назад» поверне на попередню сторінку. `replace` замінює поточний запис — «Назад» сюди не поверне. `replace` зручний після входу чи оплати.
>
> 📚 [[Next.js Start - 08. Навігація#🧭 Перехід з коду: useRouter|Розділ: useRouter]] · [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

> [!question]- Що робить redirect() і який статус повертає?
> *часто · теорія* · `nextjs-start-08-card-07`
>
> Під час рендеру на сервері зупиняє сторінку й відповідає перенаправленням: 307 з `location: /нова-адреса`. Не потребує `return`; в `onClick` не працює — там `router.push`. Для постійних переїздів — `permanentRedirect()` (308).
>
> 📚 [[Next.js Start - 08. Навігація#↪️ Перенаправлення на сервері: redirect()|Розділ: redirect]] · [Next.js: redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)

> [!question]- Як прочитати slug на сторінці app/blog/[slug]/page.tsx?
> *дуже часто · практика* · `nextjs-start-08-card-08`
>
> З пропа `params`, який у Next.js 16 — Promise: компонент `async`, а всередині `const { slug } = await params`. Невідомий `slug` → `notFound()`.
>
> 📚 [[Next.js Start - 08. Навігація#🧩 Динамічні посилання на статті|Розділ: динамічні посилання]] · [Next.js: Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

### 🟡 Middle

> [!question]- Що таке prefetching і коли він працює?
> *часто · теорія* · `nextjs-start-08-card-09`
>
> Фонове завантаження сторінки, на яку ймовірно перейдуть: `<Link>` робить його, коли зʼявляється у viewport або під курсором. Статичні маршрути — повністю, динамічні — до `loading.tsx`. Лише в продакшн-збірці; `prefetch={false}` вимикає.
>
> 📚 [[Next.js Start - 08. Навігація#⚡ Prefetching одним абзацом|Розділ: prefetching]] · [Next.js: Linking and Navigating — Prefetching](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching)

> [!question]- Чому layout не отримує поточний pathname?
> *іноді · теорія* · `nextjs-start-08-card-10`
>
> Layout не перемальовується між переходами, тож значення шляху в ньому застаріло б. Next.js навмисно не дає його layout; поточний шлях читають у Client Component через `usePathname`, який оновлюється при кожній навігації.
>
> 📚 [[Next.js Start - 08. Навігація#🟢 Активний пункт меню: usePathname|Розділ: usePathname]] · [Next.js: layout.js — Pathname](https://nextjs.org/docs/app/api-reference/file-conventions/layout#pathname)

## 🛠️ Практика

> [!task] Активний пункт меню з вкладеними адресами
> level: junior · difficulty: easy · id: nextjs-start-08-task-01 · tags: navigation, usepathname
>
> Напиши `isActive(pathname, href)` для меню сайту. Пункт активний, якщо поточна адреса — це він сам або сторінка всередині нього.
>
> - `href === '/'` активний лише на головній.
> - `'/blog'` активний на `/blog` і `/blog/latte-art`, але **не** на `/blogger`.
> - Хвостовий слеш не важливий: `/blog/` — це `/blog`. `?query` і `#hash` у `pathname` теж можуть трапитися — ігноруй їх.
>
> Задача на TypeScript: типи знімаються перед запуском, тести перевіряють значення.
>
> ```ts starter
> function isActive(pathname: string, href: string): boolean {
>   // ❌ працює лише для точного збігу
>   return pathname === href
> }
> ```
>
> ```ts tests
> test('головна активна лише на /', () => {
>   expect(isActive('/', '/')).toBe(true)
>   expect(isActive('/menu', '/')).toBe(false)
> })
>
> test('розділ активний на власній сторінці й глибше', () => {
>   expect(isActive('/blog', '/blog')).toBe(true)
>   expect(isActive('/blog/latte-art', '/blog')).toBe(true)
>   expect(isActive('/blog/2026/latte-art', '/blog')).toBe(true)
> })
>
> test('схожа назва — інший розділ', () => {
>   expect(isActive('/blogger', '/blog')).toBe(false)
>   expect(isActive('/blog', '/blog/latte-art')).toBe(false)
> })
>
> test('хвостовий слеш не важливий', () => {
>   expect(isActive('/blog/', '/blog')).toBe(true)
>   expect(isActive('/blog', '/blog/')).toBe(true)
> })
>
> test('query і hash ігноруються', () => {
>   expect(isActive('/menu?sort=price', '/menu')).toBe(true)
>   expect(isActive('/#contacts', '/')).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу нормалізуй обидва рядки: відріж усе від `?` або `#`, потім прибери слеші в кінці. Якщо після цього лишився порожній рядок — це `'/'`.
>
> > [!hint]- Підказка 2
> > Для `/` — точний збіг. Для решти: `path === href || path.startsWith(href + '/')`. Саме `+ '/'` відсікає `/blogger`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function normalize(path: string): string {
> >   const clean = path.split(/[?#]/)[0].replace(/\/+$/, '')
> >   return clean === '' ? '/' : clean
> > }
> >
> > function isActive(pathname: string, href: string): boolean {
> >   const path = normalize(pathname)
> >   const target = normalize(href)
> >   if (target === '/') return path === '/'
> >   return path === target || path.startsWith(target + '/')
> > }
> > ```
> >
> > Нормалізація до порівняння прибирає дрібниці, які не змінюють сторінку. Хибне рішення `pathname.startsWith(href)` падає на третьому тесті (`/blogger`) і на першому (`/menu` «активує» головну). Справжній `usePathname` повертає шлях без `?query`, але `href` у меню пишуть люди — тож нормалізувати обидва варто.

> [!task] Хлібні крихти з адреси
> level: junior · difficulty: medium · id: nextjs-start-08-task-02 · tags: navigation, breadcrumbs
>
> Напиши `buildBreadcrumbs(pathname, labels)` — масив «хлібних крихт» (breadcrumbs) для рядка навігації «Зерно › Блог › Латте-арт». Кожна крихта — `{ href, label }`.
>
> - Перша крихта завжди головна: `{ href: '/', label: labels['/'] ?? 'Головна' }`.
> - Далі — по одній крихті на кожен сегмент: `href` — шлях до цього сегмента включно.
> - `label` береться з `labels[href]`; якщо його немає — сам сегмент, у якому дефіси замінено пробілами (`latte-art` → `latte art`), а `%D0%BA…` розкодовано через `decodeURIComponent`.
> - Хвостовий слеш і порожні сегменти (`//`) ігноруй.
>
> ```ts starter
> type Crumb = { href: string; label: string }
>
> function buildBreadcrumbs(pathname: string, labels: Record<string, string>): Crumb[] {
>   // твій код
> }
> ```
>
> ```ts tests
> const labels = { '/': 'Зерно', '/blog': 'Блог', '/blog/latte-art': 'Латте-арт' }
>
> test('на головній — одна крихта', () => {
>   expect(buildBreadcrumbs('/', labels)).toEqual([{ href: '/', label: 'Зерно' }])
> })
>
> test('кожен сегмент — крихта з повним шляхом', () => {
>   expect(buildBreadcrumbs('/blog/latte-art', labels)).toEqual([
>     { href: '/', label: 'Зерно' },
>     { href: '/blog', label: 'Блог' },
>     { href: '/blog/latte-art', label: 'Латте-арт' },
>   ])
> })
>
> test('без підпису — сегмент з пробілами замість дефісів', () => {
>   const crumbs = buildBreadcrumbs('/blog/first-coffee', labels)
>   expect(crumbs[2]).toEqual({ href: '/blog/first-coffee', label: 'first coffee' })
> })
>
> test('закодовані символи розкодовуються', () => {
>   const crumbs = buildBreadcrumbs('/menu/%D0%BA%D0%B0%D0%B2%D0%B0', {})
>   expect(crumbs).toEqual([
>     { href: '/', label: 'Головна' },
>     { href: '/menu', label: 'menu' },
>     { href: '/menu/%D0%BA%D0%B0%D0%B2%D0%B0', label: 'кава' },
>   ])
> })
>
> test('хвостовий і подвійний слеш не дають порожніх крихт', () => {
>   expect(buildBreadcrumbs('/blog//latte-art/', labels)).toHaveLength(3)
> })
> ```
>
> > [!hint]- Підказка 1
> > `pathname.split('/').filter(Boolean)` дає сегменти без порожніх рядків — і для `/`, і для `//`, і для хвостового слеша.
>
> > [!hint]- Підказка 2
> > Накопичуй шлях у циклі: `href += '/' + segment`. `href` лишай закодованим (як в адресі), а розкодовуй лише `label`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Crumb = { href: string; label: string }
> >
> > function buildBreadcrumbs(pathname: string, labels: Record<string, string>): Crumb[] {
> >   const crumbs: Crumb[] = [{ href: '/', label: labels['/'] ?? 'Головна' }]
> >   let href = ''
> >   for (const segment of pathname.split('/').filter(Boolean)) {
> >     href += '/' + segment
> >     const fallback = decodeURIComponent(segment).replace(/-/g, ' ')
> >     crumbs.push({ href, label: labels[href] ?? fallback })
> >   }
> >   return crumbs
> > }
> > ```
> >
> > У компоненті ця функція отримує результат `usePathname()`, а крихти малюються через `<Link>`. Підписи з обʼєкта `labels` — бо з адреси не відновити гарну назву («Латте-арт»). Хибне рішення, яке накопичує лише останній сегмент (`href = '/' + segment`), дає `/latte-art` замість `/blog/latte-art` і падає на другому тесті.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating) — як працює навігація: серверний рендер, prefetching, streaming, клієнтські переходи.
- 🟡 [Next.js — Link Component](https://nextjs.org/docs/app/api-reference/components/link) — усі props `Link`, активні посилання, динамічні адреси.
- 🟡 [Next.js — usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname) — що повертає хук і як він поводиться з Cache Components.
- 🟡 [Next.js — useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router) — `push`, `replace`, `refresh`, `back` і попередження про XSS.
- 🟡 [Next.js — redirect](https://nextjs.org/docs/app/api-reference/functions/redirect) — коди 307/308, де можна викликати, чому без `return`.
- 🟡 [Next.js — Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) — `[slug]`, `params` і `generateStaticParams`.
- 🔴 [Next.js — Prefetching](https://nextjs.org/docs/app/guides/prefetching) — повна поведінка prefetch і як нею керувати.
- 🟢 [MDN — History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) — на чому тримаються «Назад», `push` і `replace`.

> [!important] Підсумок
> - Внутрішні посилання — `<Link>` з `next/link`: у HTML це `<a>`, але перехід без перезавантаження, layouts зберігають стан.
> - Поточний шлях дає `usePathname` з `next/navigation` — лише в Client Component, тож меню виносять в окремий файл з `'use client'`. Активність перевіряй за сегментами, не `startsWith(href)`.
> - `useRouter().push` — перехід з коду після дії; для звичайних посилань документація радить `<Link>`. Імпорт — з `next/navigation`, не `next/router`.
> - `redirect()` на сервері відповідає 307 і зупиняє рендер; `permanentRedirect()` — 308.
> - Динамічна сторінка `app/blog/[slug]/page.tsx` читає `await params` (у Next.js 16 — Promise), невідомий `slug` віддає `notFound()`, а `generateStaticParams` збирає відомі сторінки заздалегідь.
> - Prefetching завантажує сторінки за посиланнями заздалегідь — лише в продакшн-збірці.

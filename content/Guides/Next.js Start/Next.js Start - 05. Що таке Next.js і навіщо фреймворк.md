---
title: Що таке Next.js і навіщо фреймворк
id: nextjs-start-05
slug: 05-what-is-nextjs
order: 5
level: noob
skill: rendering
icon: px:compass
tags: [nextjs, react, framework, csr, ssr, ssg, streaming, rendering, beginner]
prerequisites:
  - "[[Next.js Start - 04. TypeScript-мінімум для Next.js]]"
estimatedMinutes: 35
nextVersion: 16.3.8
---

# Що таке Next.js і навіщо фреймворк

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити різницю між бібліотекою React і фреймворком Next.js і назвати пʼять речей, які фреймворк додає;
> - простими словами розрізнити CSR, SSR, SSG і streaming: що браузер отримує першим і коли зʼявляються дані;
> - намалювати Server і Client Components однією картинкою: чий код їде в браузер, а чий лишається на сервері;
> - відрізнити App Router від Pages Router у чужому туторіалі й не змішувати їх;
> - назвати три головні новини Next.js 16 (Turbopack, Cache Components, `proxy.ts`) і сказати, коли Next.js брати не варто.

## 🤔 Передбач

> [!quiz] Що буде у вихідному HTML?
> level: junior · type: output · id: nextjs-start-05-quiz-01
>
> Дві сторінки в одному Next.js-проєкті показують однаковий список. Ти робиш `npm run build`, `npm start` і дивишся «Переглянути код сторінки» (те, що сервер надіслав, до будь-якого JavaScript).
>
> ```tsx
> // app/csr/page.tsx
> 'use client'
>
> import { useEffect, useState } from 'react'
>
> export default function CsrPage() {
>   const [items, setItems] = useState<string[] | null>(null)
>
>   useEffect(() => {
>     // уяви тут fetch('/api/products')
>     setItems(['Чайник', 'Кавоварка', 'Тостер'])
>   }, [])
>
>   if (!items) return <p>Завантаження…</p>
>   return (
>     <ul>
>       {items.map((item) => (
>         <li key={item}>{item}</li>
>       ))}
>     </ul>
>   )
> }
> ```
>
> ```tsx
> // app/server-list/page.tsx
> import { products } from '../lib/products'
>
> export default function ServerListPage() {
>   return (
>     <ul>
>       {products.map((item) => (
>         <li key={item}>{item}</li>
>       ))}
>     </ul>
>   )
> }
> ```
>
> - [x] `/csr` — `<p>Завантаження…</p>`; `/server-list` — готовий `<ul>` з товарами
> - [ ] Обидві — готовий `<ul>`: Next.js усе рендерить на сервері
> - [ ] Обидві — порожній `<div>`: React малює сторінку лише в браузері
> - [ ] `/csr` — готовий `<ul>`, бо `'use client'` робить сторінку швидшою; `/server-list` — порожньо
>
> **Пояснення:** не страшно, якщо помилився — у цьому вся тема. Сервер виконав обидва компоненти, але `useEffect` на сервері не запускається: перша сторінка потрапила в HTML у стані «ще немає даних». Список у неї зʼявиться лише в браузері, після завантаження JavaScript. Друга сторінка — Server Component: дані вже лежать у HTML, і пошуковик, і повільний телефон бачать їх одразу.

## 🧒 Простими словами

React — це двигун. Потужний, надійний, але сам по собі він нікуди не їде: потрібні кузов, колеса, кермо, фари. Можна зібрати машину самому — купити колеса в одному місці, кермо в іншому й тиждень прикручувати. А можна взяти готовий автомобіль, де двигун уже стоїть, а все інше підігнане під нього. Next.js — це такий автомобіль з двигуном React усередині. Ти все ще керуєш, але не думаєш, як підʼєднати колеса до коробки передач.

А ще в цієї машини є фокус: частину роботи вона робить **ще до того, як ти сів за кермо**. Сторінки, які однакові для всіх, вона готує заздалегідь, а решту — у момент, коли ти просиш. Про це й уся тема: **де і коли** готується сторінка.

## 🔬 Як це працює насправді

### 🧱 Бібліотека і фреймворк

У темах 02–03 ти писав компоненти на React. React — **бібліотека** для інтерфейсу: він уміє перетворювати компоненти на DOM (дерево елементів сторінки в браузері) і оновлювати їх, коли змінюється state. Але React нічого не каже про те, як організувати адреси сторінок, звідки брати дані, як зібрати сотні файлів у те, що завантажить браузер, і як усе це викласти в інтернет.

Різницю між бібліотекою і фреймворком зазвичай пояснюють так: **бібліотеку викликаєш ти, а фреймворк викликає твій код**. З React ти сам вирішуєш, коли й куди рендерити `<App />`. У Next.js ти кладеш файл `app/about/page.tsx`, а фреймворк сам знаходить його, сам вирішує, коли його виконати, і сам віддає результат за адресою `/about`. Ти домовляєшся з фреймворком через **конвенції** — правила іменування файлів і папок.

Next.js — фреймворк на основі React від компанії Vercel. Команда React у документації радить починати нові застосунки саме з фреймворку: майже кожному застосунку потрібні ті самі пʼять речей, і краще отримати їх готовими й узгодженими.

### 🧰 Що фреймворк додає до React

| Що треба застосунку | На «чистому» React | У Next.js |
|---|---|---|
| **Маршрутизація** (routing): яка сторінка за якою адресою | окрема бібліотека, таблиця «адреса → компонент» вручну | папки в `app/` — це адреси (теми 07–08) |
| **Рендер на сервері**: готовий HTML замість порожньої сторінки | окремий сервер і багато налаштувань | за замовчуванням |
| **Дані**: читати базу, файли, API | `fetch` у `useEffect` у браузері або окремий бекенд | `async`-компонент читає дані прямо на сервері (тема 10) |
| **Бандлинг**: зібрати сотні файлів у кілька оптимальних | налаштувати бандлер самому | вбудований Turbopack, нуль конфігурації |
| **Оптимізації**: картинки, шрифти, розбиття коду | окремі бібліотеки й ручна робота | `next/image`, `next/font`, автоматичне розбиття коду за маршрутами |

Кілька слів, які трапилися в таблиці. **Бандлер** (bundler) — програма, що бере всі твої файли й залежності, перекладає TypeScript і JSX у звичайний JavaScript і складає їх у кілька файлів-«чанків» для браузера. **Розбиття коду** (code splitting) означає, що сторінка `/about` не тягне код сторінки `/shop`: кожна адреса завантажує лише своє.

> [!quiz] Перевір себе: що з цього Next.js дає «з коробки»?
> level: junior · type: multi · id: nextjs-start-05-quiz-02
> - [x] Адреси сторінок з дерева папок, без таблиці маршрутів
> - [x] Збирання коду для браузера без налаштування бандлера
> - [x] HTML, відрендерений на сервері, ще до завантаження JavaScript
> - [ ] Базу даних, у яку можна одразу зберігати користувачів
> - [ ] Окрему мову програмування замість JavaScript і TypeScript
>
> **Пояснення:** маршрутизація, бандлинг і серверний рендер — саме те, що фреймворк додає до React. Базу даних Next.js не містить: він уміє її **читати** на сервері, але саму БД ти обираєш і підключаєш окремо (теми 10–11). І мова лишається та сама — TypeScript з JSX.

### 🗺️ Де рендериться сторінка: CSR, SSR, SSG

**Рендеринг** — це перетворення компонентів на HTML, який бачить користувач. Головне питання сучасного вебу: **де і коли** це відбувається. Є три класичні відповіді, і про них питають на кожній співбесіді.

**CSR — Client-Side Rendering, рендер у браузері.** Сервер віддає майже порожній HTML (контейнер на кшталт `<div id="root"></div>` і тег `<script>`), браузер завантажує JavaScript, React будує сторінку, і лише потім вона просить дані. Користувач спершу бачить порожнечу або «Завантаження…». Так працює класичний SPA (single-page application). Плюс: сервер простий, переходи миттєві. Мінус: на повільному телефоні довго порожньо, а пошуковик і прев'ю посилання в месенджері бачать порожню сторінку.

**SSR — Server-Side Rendering, рендер на сервері під час запиту.** На кожен запит сервер виконує компоненти, отримує дані й віддає **готовий HTML**. Користувач одразу бачить вміст, а потім браузер завантажує JavaScript і робить сторінку інтерактивною. Цей крок називається **hydration**: React «оживляє» готовий HTML — чіпляє обробники кліків до вже намальованих кнопок. Плюс: швидкий перший екран, дані свіжі на кожен запит. Мінус: кожен запит — робота сервера.

**SSG — Static Site Generation, рендер під час збірки.** Сторінку рендерять **один раз**, під час `next build`, і зберігають готовий HTML. Потім його просто віддають — хоч мільйону людей, без жодної роботи сервера. Плюс: найшвидше й найдешевше. Мінус: вміст однаковий для всіх і оновлюється лише з новою збіркою або ревалідацією (оновленням у фоні — основний посібник). **Prerendering** (пререндер) — рендер заздалегідь, до запиту.

Повернись до 🤔 Передбач: сторінка `/csr` поводиться як CSR (дані лише в браузері), а `/server-list` після збірки стала статичною — це SSG. Обидві в одному проєкті: Next.js не змушує обирати один спосіб на весь сайт.

> [!diagram] Що бачить користувач у перші секунди
> ```yaml
> layout: compare
> columns: { csr: "CSR — у браузері", ssr: "SSR — на сервері під час запиту", ssg: "SSG — під час збірки" }
> nodes:
>   - { id: c1, col: csr, label: "сервер", text: "порожній HTML + script", tone: gray }
>   - { id: c2, col: csr, label: "браузер", text: "JS → React → «Завантаження…»", tone: yellow }
>   - { id: c3, col: csr, label: "браузер", text: "fetch → дані на екрані", note: "найпізніше", tone: orange }
>   - { id: r1, col: ssr, label: "сервер", text: "компоненти + дані → HTML", note: "на кожен запит", tone: blue, icon: "px:database" }
>   - { id: r2, col: ssr, label: "браузер", text: "готовий HTML одразу", tone: green }
>   - { id: r3, col: ssr, label: "браузер", text: "JS → hydration", note: "кнопки ожили", tone: violet }
>   - { id: g1, col: ssg, label: "next build", text: "HTML один раз", note: "ще до першого запиту", tone: blue, icon: "px:box" }
>   - { id: g2, col: ssg, label: "сервер / CDN", text: "віддає готовий файл", tone: green }
>   - { id: g3, col: ssg, label: "браузер", text: "JS → hydration", tone: violet }
> steps:
>   - { show: [c1, r1, g1], note: "Перший крок різний. CSR: сервер віддає майже порожній HTML. SSR: сервер рендерить сторінку на цей запит. SSG: HTML зроблено давно, під час збірки." }
>   - { show: [c2, r2, g2], note: "CSR: браузер ще має завантажити й виконати JS, щоб показати бодай «Завантаження…». SSR і SSG: вміст уже на екрані." }
>   - { show: [c3, r3, g3], note: "CSR: лише тепер прийшли дані. SSR і SSG: браузер завантажив JS і зробив hydration — сторінка стала інтерактивною." }
> ```
> Готовий HTML першим — головна перевага серверного рендеру. JavaScript потрібен в усіх трьох випадках: без нього кнопки не працюють.

> [!quiz] Перевір себе: склади, що відбувається при CSR
> level: junior · type: order · id: nextjs-start-05-quiz-03
>
> ```order
> Браузер запитує сторінку
> Сервер віддає майже порожній HTML і тег script
> Браузер завантажує JavaScript
> React рендерить компонент і показує «Завантаження…»
> Компонент запитує дані з API
> Дані приходять, React показує список
> Сервер вставляє список у HTML до відправки ✗
> ```
>
> **Пояснення:** у CSR сервер нічого не рендерить — усе відбувається в браузері, і дані запитуються лише після того, як JavaScript завантажився й запустився. Тому користувач бачить два «порожні» етапи. Вставка готового списку в HTML — це вже SSR чи SSG.

> [!quiz] Перевір себе: який спосіб рендеру підходить?
> level: junior · id: nextjs-start-05-quiz-04
>
> Блог кавʼярні: десять статей, автор додає нову раз на тиждень, вміст однаковий для всіх читачів. Важливо, щоб статті знаходив Google.
>
> - [x] SSG: HTML статей готується під час збірки й віддається миттєво
> - [ ] CSR: браузер сам завантажить статті через `fetch`
> - [ ] SSR на кожен запит: так статті завжди найсвіжіші
> - [ ] Жоден: для блогу потрібен окремий бекенд
>
> **Пояснення:** вміст однаковий для всіх і змінюється рідко — ідеальний випадок для SSG: нуль роботи сервера на запит і готовий HTML для пошуковика. SSR тут працює, але щоразу рендерить те саме. CSR погіршує SEO й перший екран: пошуковик і повільний телефон спершу бачать порожнечу.

### 🌊 Streaming — сторінка частинами

А якщо майже вся сторінка однакова для всіх, а один шматок повільний або персональний? Скажімо, у кабінеті заголовок спільний, а привітання залежить від cookie. Чекати через нього весь SSR шкода.

**Streaming** (потокова передача) розвʼязує це: сервер **одразу** відправляє готову частину сторінки із заглушкою на місці повільного шматка, а коли той готовий — **досилає** його в тій самій відповіді. Браузер підставляє вміст замість заглушки без перезавантаження. Місце для заглушки позначає компонент React `<Suspense>`: «поки це не готове, покажи `fallback`».

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function Greeting() {
  const theme = (await cookies()).get('theme')?.value ?? 'light'
  return <p>Тема: {theme}</p>
}

export default function Dashboard() {
  return (
    <main>
      <h1>Кабінет</h1>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Greeting />
      </Suspense>
    </main>
  )
}
```

Деталі `cookies()` і `Suspense` — в основному посібнику. Зараз важлива картина: `<h1>Кабінет</h1>` і заглушку Next.js **пререндерив під час збірки** (вони однакові для всіх), а `Greeting` виконується на кожен запит і доїжджає потоком. Якщо зробити `curl` на цю сторінку, у відповіді буде і `Кабінет`, і `Завантаження…`, а трохи нижче — абзац із темою, який сервер дописав, коли `Greeting` був готовий. Одна відповідь, кілька шматків у часі.

Зверни увагу: межа між статичним і динамічним тут проходить **всередині сторінки**, а не між сторінками. Так Next.js 16 і мислить: static і dynamic — не перемикач на весь маршрут, а спектр, і кожен компонент займає на ньому своє місце. Цю модель називають **Partial Prerendering** (частковий пререндер): статична «оболонка» сторінки (static shell) готова заздалегідь, а динамічні «дірки» стрімляться.

Після `next build` Next.js показує, як вийшла кожна адреса. Для сторінок цієї теми (і `/shop` з наступного розділу) таблиця виглядає так; `/_not-found` — службова сторінка 404, а як читати таблицю, розберемо в темі 06:

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /csr
├ ◐ /dashboard
├ ○ /server-list
└ ○ /shop

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

### 🍽️ Server Components в одній картинці

Залишилось ще одне велике слово, яке ти чутимеш постійно. У Next.js кожен компонент за замовчуванням — **Server Component**: він виконується **лише на сервері** (під час збірки або запиту), може бути `async` і читати дані напряму, а його код **ніколи не потрапляє в браузер**. Браузер отримує тільки результат.

Коли потрібна інтерактивність — `useState`, `onClick`, `useEffect`, — файл позначають директивою `'use client'` першим рядком, і компонент стає **Client Component**. Його код їде в браузер. Але, як ти бачив у 🤔 Передбач, він **теж** рендериться на сервері для першого HTML, а в браузері React робить hydration.

> [!diagram] Server і Client Components: чий код їде в браузер
> ```yaml
> layout: flow
> nodes:
>   - { id: page, label: "Server Component", text: "app/shop/page.tsx", note: "читає дані, рендерить список", tone: blue, icon: "px:database" }
>   - { id: btn, label: "Client Component", code: "'use client'\n<AddToCart />", note: "useState, onClick", tone: orange }
>   - { id: html, label: "у браузер", text: "готовий HTML", note: "вміст обох компонентів", tone: green }
>   - { id: js, label: "у браузер", text: "JS лише для AddToCart", note: "коду page.tsx тут немає", tone: violet, icon: "px:bolt" }
> edges:
>   - { from: page, to: btn, label: "рендерить" }
>   - { from: btn, to: html, label: "сервер → HTML" }
>   - { from: html, to: js, label: "hydration" }
> steps:
>   - { focus: page, note: "Сторінка — Server Component. Вона виконується на сервері, читає товари й рендерить список. Її код лишається на сервері назавжди." }
>   - { show: btn, note: "Кнопка «У кошик» потребує onClick і стану, тож це Client Component з 'use client'." }
>   - { move: { from: btn, to: html, value: "HTML" }, note: "Для першого заходу сервер рендерить обидва компоненти в HTML. Користувач одразу бачить і список, і кнопку." }
>   - { move: { from: html, to: js, value: "add-to-cart.js" }, note: "Браузер завантажує JS лише кнопки й робить hydration. Код сторінки, бібліотеки для даних і секрети в браузер не поїхали." }
> ```
> Сервер за замовчуванням, клієнт — лише там, де справді потрібна інтерактивність.

Навіщо це новачку: менше JavaScript — швидша сторінка на слабкому телефоні, дані читаються без проміжного API, а секрети (ключі до бази чи платіжного сервісу) лишаються на сервері. Як проходить межа і що через неї можна передати — окрема велика тема: [[Next.js - 07. Server і Client Components]].

> [!quiz] Перевір себе: чий код потрапить у браузер?
> level: junior · type: output · id: nextjs-start-05-quiz-05
>
> ```tsx
> // app/shop/page.tsx — без директиви
> import { getProducts } from '../lib/db'
> import AddToCart from './add-to-cart'
>
> export default async function ShopPage() {
>   const products = await getProducts()
>   return products.map((p) => <AddToCart key={p.id} title={p.title} />)
> }
> ```
>
> ```tsx
> // app/shop/add-to-cart.tsx
> 'use client'
>
> import { useState } from 'react'
>
> export default function AddToCart({ title }: { title: string }) {
>   const [added, setAdded] = useState(false)
>   return <button onClick={() => setAdded(true)}>{added ? '✓' : title}</button>
> }
> ```
>
> - [x] Лише код `add-to-cart.tsx`
> - [ ] `page.tsx` і `add-to-cart.tsx` — це ж одна сторінка
> - [ ] `page.tsx`, `add-to-cart.tsx` і `lib/db`
> - [ ] Нічого: Next.js рендерить усе на сервері й віддає лише HTML
>
> **Пояснення:** `page.tsx` без директиви — Server Component, тож його код і модуль `lib/db` лишаються на сервері. `AddToCart` позначений `'use client'`: щоб кнопка реагувала на клік, браузеру потрібен її код. HTML обох компонентів браузер теж отримає, але це результат, а не код.

### 🛣️ App Router і Pages Router

У Next.js є **два способи** організувати сторінки, і в інтернеті їх постійно змішують. Тому навчися розрізняти їх з першого погляду.

**App Router** — сучасний маршрутизатор, з'явився в Next.js 13. Сторінки лежать у папці `app/`, файл сторінки завжди називається `page.tsx`, спільні рамки — `layout.tsx`, компоненти серверні за замовчуванням. **Саме App Router ми вчимо в усьому курсі**, і `create-next-app` пропонує його за замовчуванням.

**Pages Router** — старший маршрутизатор: папка `pages/`, файли на кшталт `pages/about.tsx`, `pages/_app.tsx`, функції `getServerSideProps` і `getStaticProps`. Він досі підтримується, на ньому живе багато наявних проєктів, але нові проєкти починають з App Router.

Правило: бачиш у статті чи відповіді чат-бота `pages/`, `_app.tsx` або `getServerSideProps` — це **інший** світ. Не копіюй такий код у свій `app/`.

> [!quiz] Перевір себе: який туторіал про Pages Router?
> level: junior · id: nextjs-start-05-quiz-06
> - [ ] «Створи `app/blog/page.tsx` і зроби компонент `async`, щоб прочитати пости»
> - [x] «Додай у `pages/blog.tsx` функцію `getServerSideProps` і поверни з неї `props`»
> - [ ] «Загорни повільний компонент у `<Suspense>` усередині `app/dashboard/page.tsx`»
> - [ ] «Додай `'use client'` у файл кнопки з `useState`»
>
> **Пояснення:** папка `pages/` і `getServerSideProps` — ознаки Pages Router. В App Router дані читає сам `async` Server Component, без спеціальних функцій. Решта варіантів — звичайний App Router, яким ми й користуємося.

### 🆕 Next.js 16 з першого погляду

Курс написано для **Next.js 16.3.8**. Ось три зміни, через які старі статті вводять в оману, — без глибини, лише щоб ти не губився.

1. **Turbopack — бандлер за замовчуванням.** Це новий бандлер, написаний на Rust, швидкий і інкрементальний: перебудовує лише те, що змінилося. У Next.js 16 він працює і для `next dev`, і для `next build` без жодних прапорців. Ти побачиш це в першому ж рядку терміналу: `▲ Next.js 16.3.8 (Turbopack)`. Старий бандлер Webpack доступний прапорцем `--webpack`, якщо якась бібліотека з Turbopack не дружить.
2. **Cache Components.** Нова модель кешу: увімкнути її можна рядком `cacheComponents: true` у `next.config.ts`. Вона дає директиву `'use cache'` (закешувати функцію чи компонент) і робить Partial Prerendering поведінкою за замовчуванням — та сама «оболонка + стрімінг», що на `/dashboard` вище. Усі приклади курсу зібрані з `cacheComponents: true`, і в темі 06 ти увімкнеш її у своєму проєкті.
3. **`proxy.ts` замість `middleware.ts`.** Файл у корені проєкту, що виконується на сервері **до** сторінки: перенаправити, переписати адресу, перевірити cookie. Раніше він називався `middleware.ts`; у 16 це імʼя застаріло, і функцію теж перейменували на `proxy`.

```ts
// next.config.ts — так виглядає конфіг усіх прикладів курсу
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

> [!quiz] Перевір себе: заповни конфіг курсу
> level: junior · type: fill · bank: dynamicIO, middleware · id: nextjs-start-05-quiz-07
>
> ```ts fill
> // next.config.ts
> import type { NextConfig } from 'next'
>
> const nextConfig: NextConfig = {
>   [[cacheComponents]]: [[true]],
> }
>
> export default nextConfig
> ```
>
> **Пояснення:** `cacheComponents: true` вмикає Cache Components — `'use cache'` і Partial Prerendering. `dynamicIO` — назва експериментального прапорця з часів Next.js 15, у 16 його прибрали. А `middleware` — старе імʼя файлу `proxy.ts`, у конфігу йому не місце.

### 🤷 Коли Next.js не потрібен

Next.js — хороший вибір за замовчуванням для вебзастосунку на React. Але не для всього. Чесний список випадків, коли простіший інструмент кращий:

- **Одна статична сторінка без React** — візитка, лендинг на два екрани. Звичайний HTML і CSS (тема 01) завантажаться швидше, ніж будь-який фреймворк, і їх можна покласти на будь-який хостинг.
- **Багато тексту й майже нуль інтерактивності** — документація, блог. Next.js упорається, але генератори статичних сайтів, що не відправляють JavaScript за замовчуванням, простіші.
- **Внутрішня панель за логіном, де SEO не потрібне**, а вся логіка — у браузері. Звичайний SPA на React з легким бандлером буде простішим у підтримці й деплої: досить статичних файлів, без сервера.
- **Лише API для мобільного застосунку**, без вебсторінок. Next.js уміє Route Handlers (тема курсу про них ще попереду), але окремий серверний фреймворк на Node.js тут природніший.
- **Ти ще не знаєш React.** Тоді спершу теми 02–03: Next.js додає власні правила поверх React, і їх легше вчити, коли основа вже є.

І компроміс: серверний рендер потребує **сервера** з Node.js (Vercel, VPS, Docker). Статичний сайт на Next.js можна зібрати й без нього (static export), але тоді не працюють cookies, `proxy.ts`, Server Actions і оптимізація картинок за замовчуванням.

> [!quiz] Перевір себе: де Next.js — зайвий?
> level: junior · id: nextjs-start-05-quiz-08
> - [ ] Інтернет-магазин, де каталог має знаходитися в Google, а кошик — персональний
> - [ ] Блог з коментарями й формою підписки
> - [x] Одна сторінка-візитка без жодного React-компонента
> - [ ] Кабінет користувача з даними з бази й публічними сторінками тарифів
>
> **Пояснення:** для візитки без React фреймворк — зайвий шар: HTML і CSS простіші й швидші. Магазин, блог з формами й кабінет — якраз те, для чого Next.js створений: публічні сторінки з SEO поруч із персональними даними й серверною логікою.

### 🏭 Як це роблять у продакшні

- **Новий React-проєкт — одразу на фреймворку**, найчастіше на Next.js з App Router. «Голий» React лишають для особливих випадків, як-от віджет, що вбудовується в чужий сайт.
- **Сервер за замовчуванням:** сторінки й layouts — Server Components, `'use client'` — лише дрібні інтерактивні шматки.
- **Статичне — статичним:** маркетинг, блог і документація пререндеряться під час збірки, персональне стрімиться через `<Suspense>`.

## ⚠️ Пастки

> [!pitfall] «Next.js — це React, тож напишу все як у SPA»
> Якщо кожен файл почати з `'use client'` і тягнути дані через `useEffect`, ти отримаєш CSR усередині фреймворку: порожній перший екран, увесь код у браузері. Next.js не завадить, але його головні переваги зникнуть.
>
> ```tsx
> // ❌ дані в useEffect: список зʼявиться лише в браузері
> // ✅ async Server Component читає дані на сервері (тема 10)
> ```

> [!pitfall] Туторіал про Pages Router у проєкті на App Router
> `getServerSideProps`, `pages/_app.tsx`, `next/router` — це API Pages Router. У папці `app/` вони не працюють. Перед тим як копіювати код, глянь, у якій папці лежать файли в прикладі.

> [!pitfall] «SSR — значить без JavaScript»
> Серверний рендер дає готовий HTML першим, але JavaScript для інтерактивних частин усе одно завантажується, інакше кнопки не реагуватимуть.

> [!pitfall] Стара стаття про Next.js 13–15
> `middleware.ts`, `experimental.ppr`, `experimental.dynamicIO` у конфігу — ознаки старої версії. У 16 це `proxy.ts` і `cacheComponents: true`. Дивись на дату статті й звіряй з документацією своєї версії.

## 🔗 Звʼязки

- [[Next.js Start - 01. Як працює веб]] — запит, відповідь і що браузер робить з HTML: основа для CSR і SSR.
- [[Next.js Start - 03. React-мінімум, state, події й ефекти]] — `useState` і `useEffect`, через які працює CSR.
- [[Next.js Start - 06. Перший проєкт, create-next-app і структура]] — створюємо проєкт і читаємо таблицю маршрутів після `next build`.
- [[Next.js - 07. Server і Client Components]] — межа `'use client'` детально: що їде в бандл і що можна передати через межу.
- Далі в курсі: [[Next.js Start - 10. Дані на сервері]] — перший `async`-компонент; в основному посібнику — статичне й динамічне, streaming і Partial Prerendering.

## ⚡ Фішки

> [!reel] 🕐 CSR, SSR, SSG — це про «коли»
> CSR — у браузері, після JavaScript. SSR — на сервері, на кожен запит. SSG — один раз, під час `next build`. У Next.js усі три можуть жити в одному проєкті.

> [!reel] 🌊 Streaming: спершу оболонка, потім решта
> Сервер одразу віддає готове із заглушкою `<Suspense>`, а повільний шматок досилає в тій самій відповіді. Користувач не чекає на найповільніші дані.

> [!reel] 🧭 Бачиш pages/ — це інший Next.js
> `pages/`, `_app.tsx`, `getServerSideProps` — Pages Router. У курсі та в нових проєктах — App Router: `app/`, `page.tsx`, `layout.tsx`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим бібліотека відрізняється від фреймворку на прикладі React і Next.js?
> *часто · теорія* · `nextjs-start-05-card-01`
>
> Бібліотеку викликаєш ти: React рендерить компонент, коли ти скажеш. Фреймворк викликає твій код за конвенціями: Next.js сам знаходить `app/about/page.tsx`, вирішує, коли його виконати, і віддає за адресою `/about`.
>
> 📚 [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк#🧱 Бібліотека і фреймворк|Розділ: бібліотека і фреймворк]] · [React: Creating a React App](https://react.dev/learn/creating-a-react-app)

> [!question]- Що Next.js додає до React?
> *дуже часто · теорія* · `nextjs-start-05-card-02`
>
> Маршрутизацію з дерева папок, рендер на сервері, читання даних прямо в компонентах на сервері, вбудований бандлер (Turbopack) і оптимізації: картинки, шрифти, розбиття коду за маршрутами.
>
> 📚 [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк#🧰 Що фреймворк додає до React|Розділ: що додає фреймворк]] · [Next.js Docs](https://nextjs.org/docs/app)

> [!question]- Що таке CSR і в чому його мінус?
> *дуже часто · теорія* · `nextjs-start-05-card-03`
>
> Client-Side Rendering: сервер віддає майже порожній HTML, браузер завантажує JavaScript, React будує сторінку і лише потім запитує дані. Мінус — довгий порожній перший екран на повільних пристроях і погане SEO: пошуковик бачить порожню сторінку.
>
> 📚 [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк#🗺️ Де рендериться сторінка: CSR, SSR, SSG|Розділ: CSR, SSR, SSG]] · [Next.js: Single-Page Applications](https://nextjs.org/docs/app/guides/single-page-applications)

> [!question]- Чим SSR відрізняється від SSG?
> *дуже часто · порівняння* · `nextjs-start-05-card-04`
>
> Обидва віддають готовий HTML. SSR рендерить сторінку на сервері **на кожен запит** — дані свіжі, але сервер працює щоразу. SSG рендерить **один раз під час `next build`** — найшвидше й найдешевше, але вміст однаковий для всіх до наступної збірки чи ревалідації.
>
> 📚 [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк#🗺️ Де рендериться сторінка: CSR, SSR, SSG|Розділ: CSR, SSR, SSG]] · [Next.js: Rendering Philosophy](https://nextjs.org/docs/app/guides/rendering-philosophy)

> [!question]- Що таке hydration?
> *часто · теорія* · `nextjs-start-05-card-05`
>
> Крок, коли React у браузері «оживляє» HTML, що прийшов із сервера: чіпляє обробники подій до вже намальованих елементів. До hydration сторінку видно, але кнопки ще не реагують.
>
> 📚 [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк#🗺️ Де рендериться сторінка: CSR, SSR, SSG|Розділ: CSR, SSR, SSG]] · [Next.js: Glossary — Hydration](https://nextjs.org/docs/app/glossary#hydration)

> [!question]- Як відрізнити App Router від Pages Router?
> *часто · практика* · `nextjs-start-05-card-06`
>
> App Router: папка `app/`, файли `page.tsx` і `layout.tsx`, компоненти серверні за замовчуванням. Pages Router: папка `pages/`, `_app.tsx`, `getServerSideProps`/`getStaticProps`. Курс і нові проєкти — на App Router.
>
> 📚 [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк#🛣️ App Router і Pages Router|Розділ: App Router і Pages Router]] · [Next.js: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

### 🟡 Middle

> [!question]- Що таке streaming і навіщо він потрібен?
> *часто · теорія* · `nextjs-start-05-card-07`
>
> Сервер одразу відправляє готову частину сторінки із заглушкою, а повільний або персональний шматок досилає в тій самій відповіді, коли той готовий. Місце для заглушки задає `<Suspense fallback={…}>`. Користувач бачить сторінку, не чекаючи на найповільніші дані.
>
> 📚 [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк#🌊 Streaming — сторінка частинами|Розділ: streaming]] · [Next.js: Streaming](https://nextjs.org/docs/app/guides/streaming)

> [!question]- Чим Server Component відрізняється від Client Component?
> *дуже часто · теорія* · `nextjs-start-05-card-08`
>
> Server Component виконується лише на сервері, може бути `async` і читати дані, його код не потрапляє в браузер. Client Component (`'use client'`) має стан і обробники подій; його код їде в браузер, але для першого HTML він теж рендериться на сервері.
>
> 📚 [[Next.js - 07. Server і Client Components]] · [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

> [!question]- Коли Next.js — не найкращий вибір?
> *іноді · практика* · `nextjs-start-05-card-09`
>
> Статична сторінка без React (досить HTML і CSS), сайт з текстом майже без інтерактивності (простіше генератором статики), внутрішній SPA без SEO, чистий API без вебсторінок. Ще врахуй: серверні функції потребують хостингу з Node.js; static export працює без сервера, але без cookies, `proxy.ts` і Server Actions.
>
> 📚 [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк#🤷 Коли Next.js не потрібен|Розділ: коли Next.js не потрібен]] · [Next.js: Static Exports](https://nextjs.org/docs/app/guides/static-exports)

## 🛠️ Практика

> [!task] Що прийде в першому HTML
> level: junior · difficulty: easy · id: nextjs-start-05-task-01 · tags: rendering, csr, ssr, ssg
>
> Напиши `firstResponse(strategy, page)` — модель того, що сервер віддає браузеру першим. `page` має поля `shell` (заголовок і меню, однакові для всіх) і `content` (основні дані). Поверни обʼєкт `{ html, renderedAt }`:
>
> - `'csr'` — `html` дорівнює `'<div id="root"></div>'`, `renderedAt: 'browser'`;
> - `'ssr'` — `html` дорівнює `shell + content`, `renderedAt: 'request'`;
> - `'ssg'` — `html` дорівнює `shell + content`, `renderedAt: 'build'`;
> - `'stream'` — `html` дорівнює `shell + '<p>Завантаження…</p>'`, `renderedAt: 'build'` (оболонка пререндерена, `content` доїде потоком);
> - будь-яка інша стратегія — кинь `Error` з текстом `Unknown strategy: <назва>`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts starter
> type Strategy = 'csr' | 'ssr' | 'ssg' | 'stream'
> type Page = { shell: string; content: string }
> type FirstResponse = { html: string; renderedAt: 'browser' | 'request' | 'build' }
>
> function firstResponse(strategy: Strategy, page: Page): FirstResponse {
>   // ❌ «Next.js же все рендерить на сервері»
>   return { html: page.shell + page.content, renderedAt: 'request' }
> }
> ```
>
> ```ts tests
> const page = { shell: '<h1>Кабінет</h1>', content: '<p>Тема: light</p>' }
>
> test('CSR віддає порожній контейнер і рендерить у браузері', () => {
>   expect(firstResponse('csr', page)).toEqual({ html: '<div id="root"></div>', renderedAt: 'browser' })
> })
>
> test('SSR віддає готовий HTML, відрендерений на запит', () => {
>   expect(firstResponse('ssr', page)).toEqual({ html: '<h1>Кабінет</h1><p>Тема: light</p>', renderedAt: 'request' })
> })
>
> test('SSG віддає готовий HTML, зібраний під час збірки', () => {
>   expect(firstResponse('ssg', page)).toEqual({ html: '<h1>Кабінет</h1><p>Тема: light</p>', renderedAt: 'build' })
> })
>
> test('streaming спершу віддає оболонку із заглушкою, без даних', () => {
>   const res = firstResponse('stream', page)
>   expect(res.html).toBe('<h1>Кабінет</h1><p>Завантаження…</p>')
>   expect(res.html).not.toContain('Тема: light')
>   expect(res.renderedAt).toBe('build')
> })
>
> test('невідома стратегія — помилка з назвою', () => {
>   expect(() => firstResponse('isr' as Strategy, page)).toThrow('Unknown strategy: isr')
> })
> ```
>
> > [!hint]- Підказка 1
> > `switch (strategy)` з чотирма `case` і `default`, що кидає помилку.
>
> > [!hint]- Підказка 2
> > SSR і SSG віддають однаковий HTML — різниця лише в `renderedAt`. А в CSR сервер нічого з `page` не використовує.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function firstResponse(strategy: Strategy, page: Page): FirstResponse {
> >   switch (strategy) {
> >     case 'csr':
> >       return { html: '<div id="root"></div>', renderedAt: 'browser' }
> >     case 'ssr':
> >       return { html: page.shell + page.content, renderedAt: 'request' }
> >     case 'ssg':
> >       return { html: page.shell + page.content, renderedAt: 'build' }
> >     case 'stream':
> >       return { html: page.shell + '<p>Завантаження…</p>', renderedAt: 'build' }
> >     default:
> >       throw new Error(`Unknown strategy: ${strategy}`)
> >   }
> > }
> > ```
> >
> > SSR і SSG дають той самий перший HTML — відрізняється момент, коли сервер працював. Streaming поєднує обидва: оболонку зроблено під час збірки, а `content` сервер досилає на запит у тій самій відповіді. Модель спрощена: у справжньому CSR теж є `<script>`, а в стрімінгу дані доїжджають окремим шматком HTML.

> [!task] App Router чи Pages Router?
> level: junior · difficulty: easy · id: nextjs-start-05-task-02 · tags: app-router, pages-router
>
> Тобі дали список файлів чужого проєкту (шляхи від кореня). Напиши `detectRouter(files)`, що повертає `'app'`, `'pages'`, `'both'` або `'none'`:
>
> - App Router є, якщо хоч один файл лежить у `app/` або `src/app/` і називається `page` чи `layout` з розширенням `.tsx`, `.jsx`, `.ts` або `.js`;
> - Pages Router є, якщо хоч один файл з таким розширенням лежить у `pages/` або `src/pages/`;
> - `'both'` — є обидва (так буває під час міграції), `'none'` — жодного.
>
> Файли на кшталт `app/globals.css` чи `components/pages/header.tsx` маршрутизатора не означають.
>
> ```ts starter
> type Router = 'app' | 'pages' | 'both' | 'none'
>
> function detectRouter(files: string[]): Router {
>   // ❌ шукає слово в будь-якому місці шляху
>   if (files.some((f) => f.includes('pages'))) return 'pages'
>   if (files.some((f) => f.includes('app'))) return 'app'
>   return 'none'
> }
> ```
>
> ```ts tests
> test('свіжий проєкт create-next-app — App Router', () => {
>   expect(detectRouter(['app/layout.tsx', 'app/page.tsx', 'app/globals.css', 'public/next.svg'])).toBe('app')
> })
>
> test('pages/ з _app.tsx — Pages Router', () => {
>   expect(detectRouter(['pages/_app.tsx', 'pages/index.tsx', 'pages/blog.tsx'])).toBe('pages')
> })
>
> test('src/ теж рахується', () => {
>   expect(detectRouter(['src/app/page.tsx'])).toBe('app')
>   expect(detectRouter(['src/pages/index.js'])).toBe('pages')
> })
>
> test('міграція — обидва маршрутизатори', () => {
>   expect(detectRouter(['app/dashboard/page.tsx', 'pages/index.tsx'])).toBe('both')
> })
>
> test('слово pages чи app у шляху ще нічого не означає', () => {
>   expect(detectRouter(['components/pages/header.tsx', 'app/globals.css', 'lib/app-config.ts'])).toBe('none')
> })
> ```
>
> > [!hint]- Підказка 1
> > Перевіряй **початок** шляху: `f.startsWith('app/') || f.startsWith('src/app/')`.
>
> > [!hint]- Підказка 2
> > Для App Router потрібна ще й назва файлу: візьми останній шматок після `/` і перевір регулярним виразом `/^(page|layout)\.(tsx|jsx|ts|js)$/`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function detectRouter(files: string[]): Router {
> >   const inDir = (f: string, dir: string) => f.startsWith(dir + '/') || f.startsWith('src/' + dir + '/')
> >   const code = /\.(tsx|jsx|ts|js)$/
> >   const appFile = /^(page|layout)\.(tsx|jsx|ts|js)$/
> >
> >   const hasApp = files.some((f) => inDir(f, 'app') && appFile.test(f.split('/').pop() ?? ''))
> >   const hasPages = files.some((f) => inDir(f, 'pages') && code.test(f))
> >
> >   if (hasApp && hasPages) return 'both'
> >   if (hasApp) return 'app'
> >   if (hasPages) return 'pages'
> >   return 'none'
> > }
> > ```
> >
> > Маршрутизатор визначає **папка в корені** (або в `src/`), а не слово десь у шляху. Для App Router самої папки `app/` замало: там лежать і стилі, і утиліти, а сторінку робить саме `page`-файл. Так само поводиться і `next build`: він шукає маршрути лише в `app/` і `pages/`.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Docs (App Router)](https://nextjs.org/docs/app) — вхідна точка документації, яку ми вчимо.
- 🟢 [React — Creating a React App](https://react.dev/learn/creating-a-react-app) — чому команда React радить починати з фреймворку.
- 🟢 [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — офіційний вступ до двох видів компонентів.
- 🟡 [Next.js — Rendering Philosophy](https://nextjs.org/docs/app/guides/rendering-philosophy) — статичне й динамічне як спектр на рівні компонентів.
- 🟡 [Next.js — Streaming](https://nextjs.org/docs/app/guides/streaming) — як сторінка доїжджає частинами.
- 🟡 [Next.js — Single-Page Applications](https://nextjs.org/docs/app/guides/single-page-applications) — CSR і SPA всередині Next.js.
- 🟡 [Next.js — Upgrading to Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16) — Turbopack, Cache Components, `proxy.ts` і решта змін.
- 🟡 [Next.js — Glossary](https://nextjs.org/docs/app/glossary) — короткі визначення App Router, hydration, prerendering, streaming.
- 🛠️ [Next.js — Static Exports](https://nextjs.org/docs/app/guides/static-exports) — сайт на Next.js без сервера і що тоді не працює.

> [!important] Підсумок
> - React — бібліотека для інтерфейсу; Next.js — фреймворк на ньому: маршрутизація, рендер на сервері, дані, бандлинг, оптимізації.
> - CSR рендерить у браузері (порожній перший екран), SSR — на сервері на кожен запит, SSG — один раз під час збірки. Streaming віддає оболонку одразу, а повільне досилає в тій самій відповіді.
> - У Next.js межа static/dynamic проходить усередині сторінки: оболонка пререндерена, динамічні шматки стрімляться (Partial Prerendering).
> - Компоненти серверні за замовчуванням, і їхній код не їде в браузер; `'use client'` — лише для інтерактивного. Деталі — [[Next.js - 07. Server і Client Components]].
> - Вчимо App Router (`app/`); `pages/` і `getServerSideProps` — старий Pages Router. Next.js 16: Turbopack за замовчуванням, `cacheComponents: true`, `proxy.ts`.

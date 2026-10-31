---
title: Вступний тест — банк noob
placement: true
---

# Вступний тест — банк noob

Калібрований банк питань рівня **noob** для вступного тесту курсу «Next.js Zero → Pro». Це не стаття: компілятор додає
ці питання лише до вступного тесту. Рівень бере назва файлу (`noob.md`), тож у рядку мета його немає. `diff`: 1 — легке
для рівня, 2 — типове, 3 — на межі junior. Орієнтир рівня: знає веб і React на рівні «зібрав сторінку», робить перший
застосунок на App Router за інструкцією (посібник «Next.js Start»).

## foundations

> [!quiz] Ти вводиш адресу сторінки в адресний рядок і натискаєш Enter. Який HTTP-метод надсилає браузер?
> skill: foundations · diff: 1 · id: nextjs-pl-foundations-noob-01
> - [ ] `POST`
> - [x] `GET`
> - [ ] `PUT`
> - [ ] `FETCH`
>
> **Пояснення:** відкрити сторінку — означає **отримати** ресурс, а це `GET`. `POST` браузер надсилає, коли відправляє форму з `method="post"`, `PUT` — метод для заміни ресурсу з коду. Методу `FETCH` немає: `fetch()` — функція JavaScript, яка сама надсилає `GET`, `POST` чи інший метод.

> [!quiz] Сторінка `/orders` існує, але під час її рендеру код на сервері впав з `TypeError`. Який код статусу правильний?
> skill: foundations · diff: 2 · id: nextjs-pl-foundations-noob-02
> - [x] `500 Internal Server Error`
> - [ ] `404 Not Found`: сторінку з даними не вдалося показати
> - [ ] `400 Bad Request`
> - [ ] `200 OK`, бо сторінка існує, а текст помилки видно в HTML
>
> **Пояснення:** `5xx` — помилка сервера: запит нормальний, а код не впорався. `404` — коли сторінки немає взагалі, `400` — коли щось не так із самим запитом. `200` з текстом помилки обманює і браузер, і пошукові роботи: для них сторінка «успішна».

> [!quiz] Що треба виправити, щоб компонент коректно задав CSS-клас?
> skill: foundations · diff: 2 · id: nextjs-pl-foundations-noob-03
>
> ```tsx
> export function Card() {
>   return <div class="card">Привіт</div>
> }
> ```
>
> - [ ] Нічого: JSX — це той самий HTML
> - [ ] Взяти значення у фігурні дужки
> - [x] Замінити `class` на `className`
> - [ ] Замінити `class` на `style="card"`
>
> **Пояснення:** JSX — це JavaScript, а `class` у JavaScript — ключове слово, тому атрибут називається `className`. Фігурні дужки лише вставляють вираз і назву атрибута не змінюють. `style` у JSX приймає обʼєкт стилів, а не назву класу.

> [!quiz] Що станеться з цим списком?
> skill: foundations · diff: 2 · id: nextjs-pl-foundations-noob-04
>
> ```tsx
> const fruits = ['яблуко', 'груша', 'слива']
>
> export function List() {
>   return <ul>{fruits.map((f) => <li>{f}</li>)}</ul>
> }
> ```
>
> - [x] Список зʼявиться, а в консолі буде попередження про `key`
> - [ ] Нічого не відрендериться: без `key` React пропускає всі елементи списку
> - [ ] Відрендериться лише перший пункт
> - [ ] Сторінка впаде з помилкою «Each child in a list should have a unique key»
>
> **Пояснення:** без `key` список працює, але React попереджає: `key` потрібен, щоб правильно оновлювати елементи, коли список змінюється. Ключ має бути стабільним і унікальним серед сусідів — тут підійде сама назва фрукта.

> [!quiz] Кнопка нічого не змінює на екрані. Чому?
> skill: foundations · diff: 2 · id: nextjs-pl-foundations-noob-05
>
> ```tsx
> 'use client'
>
> export function Counter() {
>   let count = 0
>   return <button onClick={() => { count = count + 1 }}>Натиснуто: {count}</button>
> }
> ```
>
> - [x] Звичайна змінна не запускає рендер — потрібен `useState`
> - [ ] Бракує `return` в обробнику: без нього React не бачить нове значення
> - [ ] `count` треба оголосити через `const`
> - [ ] Обробники `onClick` не працюють у компонентах Next.js без тегу `<form>`
>
> **Пояснення:** React перемальовує компонент, коли змінюється **state**. Звичайна змінна змінюється в памʼяті, але React про це не знає, а при наступному рендері її знову створять з нулем. Правильно: `const [count, setCount] = useState(0)` і `setCount(count + 1)`.

> [!quiz] Що покаже цей компонент?
> skill: foundations · diff: 3 · id: nextjs-pl-foundations-noob-06
>
> ```tsx
> function Hello(name) {
>   return <p>Привіт, {name}</p>
> }
>
> // десь вище: <Hello name="Оля" />
> ```
>
> - [ ] «Привіт, Оля»: React сам дістане `name` з обʼєкта props
> - [x] Помилку: обʼєкт не можна рендерити в JSX
> - [ ] «Привіт, undefined»: проп `name` не передався в компонент
> - [ ] «Привіт, [object Object]»
>
> **Пояснення:** компонент отримує **один** аргумент — обʼєкт props `{ name: 'Оля' }`. Тут цей обʼєкт названо `name` і вставлено в JSX, а обʼєкт React рендерити не вміє: `Objects are not valid as a React child`. Правильно — деструктуризувати: `function Hello({ name })`.

> [!quiz] Що відбудеться з цим рядком у файлі `.ts`?
> skill: foundations · diff: 2 · id: nextjs-pl-foundations-noob-07
>
> ```ts
> let count: number = '5'
> ```
>
> - [ ] TypeScript сам перетворить `'5'` на число `5` під час компіляції
> - [x] Помилку TypeScript ще до запуску коду
> - [ ] Помилки не буде
> - [ ] Код запуститься, а браузер кине `TypeError` при першому читанні
>
> **Пояснення:** TypeScript перевіряє типи під час розробки й збірки: `Type 'string' is not assignable to type 'number'`. Нічого він не перетворює — після компіляції типи просто зникають. Саме тому помилку видно в редакторі ще до запуску, а не в браузері.

## routing

> [!quiz] Який файл робить адресу `/about` доступною в App Router?
> skill: routing · diff: 1 · id: nextjs-pl-routing-noob-01
> - [x] `app/about/page.tsx`
> - [ ] `app/about.tsx`
> - [ ] `app/about/index.tsx`
> - [ ] `app/about/about.tsx`
>
> **Пояснення:** у App Router папка — це сегмент адреси, а публічною сторінкою її робить файл `page.tsx`. Файл `about.tsx` прямо в `app/` маршрутом не стає, а `index.tsx` — звичка з інших інструментів, в App Router нічого не означає.

> [!quiz] Що станеться після кліку по `<a href="/about">` замість `<Link href="/about">` у застосунку на App Router?
> skill: routing · diff: 2 · id: nextjs-pl-routing-noob-02
> - [x] Повне перезавантаження сторінки: стан на ній зникне
> - [ ] Те саме, що й з `Link`: Next.js сам перехоплює всі внутрішні посилання
> - [ ] Сторінка `/about` не відкриється
> - [ ] Перехід буде миттєвим, бо `<a>` легший за компонент `Link`
>
> **Пояснення:** звичайний `<a>` Next.js не чіпає: це повне завантаження нового документа. `Link` рендерить той самий `<a>`, але перехоплює клік, завантажує лише потрібне й не скидає спільні layouts.

> [!quiz] У `app/layout.tsx` є шапка сайту і `{children}`. Де буде видно шапку?
> skill: routing · diff: 2 · id: nextjs-pl-routing-noob-03
> - [ ] Лише на головній `/`, бо `app/layout.tsx` лежить поруч з `app/page.tsx`
> - [ ] Лише на тих сторінках, які явно імпортують `layout.tsx`
> - [ ] Лише на сторінках, що не мають власного вкладеного `layout.tsx`
> - [x] На всіх сторінках застосунку
>
> **Пояснення:** layout обгортає всі сторінки свого сегмента і глибших, а root layout — увесь застосунок. Імпортувати його вручну не треба: Next.js сам підставляє сторінку в `children`. Вкладений layout не замінює root layout, а вкладається всередину нього.

> [!quiz] Яку адресу відкриває файл `app/blog/[slug]/page.tsx`?
> skill: routing · diff: 2 · id: nextjs-pl-routing-noob-04
> - [x] `/blog/hello` — будь-який один сегмент
> - [ ] Лише буквально `/blog/[slug]`, з дужками в адресі
> - [ ] `/blog` — саму сторінку списку
> - [ ] `/blog/2026/hello` — будь-яку кількість сегментів після `/blog/`
>
> **Пояснення:** квадратні дужки — динамічний сегмент: замість `[slug]` підходить будь-яке одне значення, і воно приходить у `params`. `/blog` потребує власного `app/blog/page.tsx`, а кілька сегментів ловить лише catch-all `[...slug]`.

> [!quiz] У `app/dashboard/` лежить лише `chart.tsx` (без `page.tsx`). Що відповість адреса `/dashboard/chart`?
> skill: routing · diff: 2 · id: nextjs-pl-routing-noob-05
> - [ ] Відкриє компонент із `chart.tsx`: назва файлу стає адресою
> - [ ] Помилку збірки: у папці маршруту не може бути інших файлів
> - [x] 404: `chart.tsx` — не маршрут
> - [ ] Відкриє `chart.tsx`
>
> **Пояснення:** назва файлу не стає адресою — адресу дає папка, а публічною її робить `page.tsx`. Тому компоненти можна безпечно класти поруч зі сторінками (colocation): вони не стануть маршрутами.

> [!quiz] Як у Next.js 16 прочитати `slug` у `app/blog/[slug]/page.tsx`?
> skill: routing · diff: 3 · id: nextjs-pl-routing-noob-06
> - [ ] `params.slug` прямо в тілі компонента, як у багатьох туторіалах
> - [ ] `useParams()` прямо в серверній сторінці `page.tsx`
> - [ ] `router.query.slug` з `useRouter()` у тілі сторінки
> - [x] `const { slug } = await params` в `async` компоненті
>
> **Пояснення:** у Next.js 16 `params` — Promise. Якщо він типізований правильно (`Promise<{ slug: string }>` чи `PageProps<'/blog/[slug]'>`), `params.slug` без `await` зупинить збірку (`Property 'slug' does not exist on type 'Promise<…>'`); з ручним типом `{ params: { slug: string } }` збірка пройде, а `slug` буде `undefined`. `useParams` — хук Client Component, а `router.query` — API старого Pages Router. Код з `params.slug` без `await` — з туторіалів Next.js 14 і раніше.

> [!quiz] Після відправки форми в Client Component треба перейти на `/thanks`. Що використати?
> skill: routing · diff: 3 · id: nextjs-pl-routing-noob-07
> - [ ] `useRouter` з `next/router` і `router.push('/thanks')`
> - [ ] Відрендерити `<Link href="/thanks" />` в обробнику події
> - [x] `useRouter` з `next/navigation` і `router.push('/thanks')`
> - [ ] Лише `window.location.href = '/thanks'` — іншого способу з коду немає
>
> **Пояснення:** в App Router хук `useRouter` імпортують з `next/navigation`; `next/router` — модуль Pages Router, в App Router він не працює. `Link` — це елемент для розмітки, а не функція переходу. `window.location.href` спрацює, але дасть повне перезавантаження сторінки.

## rendering

> [!quiz] Яким компонентом за замовчуванням є файл `app/page.tsx` без жодних директив?
> skill: rendering · diff: 1 · id: nextjs-pl-rendering-noob-01
> - [ ] Client Component — виконується в браузері
> - [x] Server Component — виконується на сервері
> - [ ] Залежить від того, чи є в імені файлу `.server`
> - [ ] Звичайний HTML-файл без React
>
> **Пояснення:** в App Router усе в `app/` — Server Components за замовчуванням. Client Component зʼявляється лише там, де ти явно напишеш `'use client'` першим рядком файлу.

> [!quiz] Що станеться з цим файлом?
> skill: rendering · diff: 2 · id: nextjs-pl-rendering-noob-02
>
> ```tsx
> // app/like-button.tsx
> import { useState } from 'react'
>
> export function LikeButton() {
>   const [likes, setLikes] = useState(0)
>   return <button onClick={() => setLikes(likes + 1)}>♥ {likes}</button>
> }
> ```
>
> - [ ] Працюватиме: Next.js сам зрозуміє, що компонент інтерактивний
> - [ ] Відрендериться, але лічильник завжди лишатиметься 0
> - [ ] Працюватиме в `next dev`
> - [x] Помилка: бракує `'use client'`
>
> **Пояснення:** без директиви файл у `app/` — Server Component, а хуки стану й обробники подій там недоступні: Next.js покаже помилку з підказкою додати `'use client'`. Директива робить компонент клієнтським: його JS поїде в браузер.

> [!quiz] Сторінка статична, без даних запиту. Ти запускаєш `next build`, потім `next start` і відкриваєш `/`. Де зʼявиться повідомлення з `console.log`?
> skill: rendering · diff: 3 · id: nextjs-pl-rendering-noob-03
>
> ```tsx
> // app/page.tsx
> export default function Page() {
>   console.log('рендер сторінки')
>   return <h1>Головна</h1>
> }
> ```
>
> - [ ] У консолі браузера при кожному відкритті `/`
> - [ ] У терміналі `next start` при кожному запиті на `/`
> - [ ] Ніде: у Server Component `console.log` вимкнено
> - [x] У терміналі під час `next build`
>
> **Пояснення:** Server Component виконується на сервері, а статичну сторінку Next.js пререндерить один раз — під час `next build`. `next start` віддає готовий HTML без повторного рендеру, тож нових логів не буде, а в браузер код компонента не потрапляє взагалі. У `next dev` сторінка рендериться на кожен запит, і React ще повторює серверні логи в консолі браузера з позначкою «Server».

> [!quiz] Сторінка — async Server Component, що робить `const posts = await getPosts()` (дані лежать у памʼяті сервера) і рендерить список. Що отримає браузер при першому заході?
> skill: rendering · diff: 2 · id: nextjs-pl-rendering-noob-04
> - [ ] Порожню сторінку
> - [x] Готовий HTML зі списком постів
> - [ ] JavaScript-код функції `getPosts`, щоб виконати його в браузері
> - [ ] JSON з постами, з якого браузер збере HTML
>
> **Пояснення:** Server Component отримує дані на сервері й рендерить з ними HTML, тож список видно одразу. Код `getPosts` у браузер не потрапляє — це й дозволяє безпечно звертатися до бази чи секретних ключів.

> [!quiz] Що показує `loading.tsx` поруч із `page.tsx`?
> skill: rendering · diff: 2 · id: nextjs-pl-rendering-noob-05
> - [ ] Спінер, який Next.js показує під час `next build`
> - [ ] Запасну сторінку
> - [ ] Дані сторінки, завантажені заздалегідь, ще до кліку
> - [x] Заглушку, поки сторінка чекає на дані
>
> **Пояснення:** `loading.tsx` — миттєвий стан завантаження: Next.js показує його, поки `page.tsx` чекає на дані. Помилки ловить інший файл — `error.tsx`. Завантаження наперед — це prefetching посилань, окремий механізм.

> [!quiz] Ти пишеш `error.tsx` для сегмента. Що з цього обовʼязково?
> skill: rendering · diff: 2 · id: nextjs-pl-rendering-noob-06
> - [ ] Зробити компонент `async`, щоб він дочекався помилки
> - [ ] Експортувати функцію `getError` поруч із компонентом
> - [x] `'use client'` першим рядком
> - [ ] Обгорнути вміст у `<html>` і `<body>`, як у root layout
>
> **Пояснення:** `error.tsx` — межа помилок React, а вони працюють у браузері, тож файл має бути Client Component. Він отримує `error` і функцію повторної спроби. `<html>` і `<body>` потрібні лише `global-error.tsx`, бо він замінює root layout.

> [!quiz] Кнопка позначена `'use client'`. Чи буде вона в HTML, який першим прийде із сервера?
> skill: rendering · diff: 3 · id: nextjs-pl-rendering-noob-07
> - [ ] Ні: Client Component рендериться тільки в браузері після завантаження JS
> - [ ] Лише в `next dev`, а в продакшні кнопка зʼявиться після JS
> - [x] Так: її HTML рендериться на сервері
> - [ ] Лише якщо сторінка має `loading.tsx` над кнопкою
>
> **Пояснення:** «client» означає «має JS у браузері», а не «рендериться лише там». Для першого HTML Next.js рендерить і Client Components на сервері, тож кнопку видно одразу. Після завантаження JS React привʼязує обробники подій — це hydration.

## data

> [!quiz] Де виконується `fetch` у async Server Component?
> skill: data · diff: 1 · id: nextjs-pl-data-noob-01
> - [ ] У браузері користувача, бо `fetch` — це API браузера
> - [ ] У браузері, але лише після гідрації сторінки
> - [x] На сервері під час рендеру, а в браузер іде готовий результат
> - [ ] І на сервері, і в браузері: кожен робить свій запит
>
> **Пояснення:** Server Component виконується лише на сервері. `fetch` там — це серверний запит до API чи джерела даних, а користувач отримує вже відрендерений результат. Браузер самого запиту не робить, тому не потрібні ні `useEffect`, ні стан завантаження.

> [!quiz] Що не так із цим компонентом?
> skill: data · diff: 2 · id: nextjs-pl-data-noob-02
>
> ```tsx
> export default async function Page() {
>   const res = fetch('https://api.example.com/posts')
>   const posts = await res.json()
>   return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
> }
> ```
>
> - [ ] Нічого: `json()` сам дочекається відповіді
> - [x] Немає `await` перед `fetch`: `res` — це проміс, і `res.json` не функція
> - [ ] Server Component не може бути `async`
> - [ ] `await` треба поставити перед `posts.map(...)`
>
> **Пояснення:** `fetch` повертає проміс, а не відповідь. Без `await` змінна `res` ще не `Response`, тож виклик `res.json()` падає з `TypeError`. Правильно: `const res = await fetch(...)`, а потім `await res.json()`. `async` для Server Component якраз дозволено: так він і чекає дані.

> [!quiz] Що станеться з цим файлом?
> skill: data · diff: 2 · id: nextjs-pl-data-noob-03
>
> ```tsx
> 'use client'
>
> export default async function Orders() {
>   const orders = await getOrders()
>   return <p>{orders.length}</p>
> }
> ```
>
> - [x] Помилка: `async` не підтримується в Client Component, дані тут так не читають
> - [ ] Працюватиме, але `await` виконається на сервері
> - [ ] Працюватиме, просто сторінка завантажиться трохи повільніше
> - [ ] Директива `'use client'` додасть кеш, тож `await` швидший
>
> **Пояснення:** `async`-компонентом може бути лише Server Component. У Client Component дані беруть через хук чи бібліотеку (SWR, TanStack Query) або отримують із сервера пропсом. Директива `'use client'` нічого не кешує і не переносить код на сервер.

> [!quiz] Компонент `<Posts />` у `<Suspense>` довго чекає відповіді API. Що бачить користувач, поки дані не готові?
> skill: data · diff: 2 · id: nextjs-pl-data-noob-04
>
> ```tsx
> export default function Page() {
>   return (
>     <main>
>       <h1>Блог</h1>
>       <Suspense fallback={<p>Завантаження…</p>}>
>         <Posts />
>       </Suspense>
>     </main>
>   )
> }
> ```
>
> - [ ] Порожню сторінку, поки не буде готовий весь вміст
> - [ ] Помилку, бо компонент ще не отримав дані
> - [ ] Заголовок «Блог» зʼявиться лише разом зі списком
> - [x] Заголовок «Блог» і текст «Завантаження…», а потім замість нього список
>
> **Пояснення:** `<Suspense>` дає Next.js показати те, що вже готове, і підставити fallback на місце того, що ще чекає. Коли `Posts` дочекається даних, сервер дошле список у те саме місце. Без `<Suspense>` сторінка чекала б найповільнішого блоку.

> [!quiz] Яка перевага читання даних прямо в async Server Component порівняно з `useEffect` + `fetch` у клієнтському компоненті?
> skill: data · diff: 1 · id: nextjs-pl-data-noob-05
> - [ ] Дані автоматично кешуються назавжди
> - [x] Дані вже є в HTML відповіді, не потрібні окремий стан завантаження й додатковий запит із браузера
> - [ ] Код компонента зʼявляється в браузері, тож його легше налагоджувати
> - [ ] Не потрібен `await`, бо React сам підставляє результат
>
> **Пояснення:** сервер дочекається даних і відправить сторінку вже з ними. З `useEffect` браузер спершу показує порожній стан, а запит стартує лише після завантаження JavaScript. Автоматичного вічного кешу тут немає, а `await` у Server Component якраз потрібен.

> [!quiz] Server Component читає `process.env.DB_PASSWORD`, звертається до бази й показує список. Що потрапляє в браузер?
> skill: data · diff: 2 · id: nextjs-pl-data-noob-06
> - [ ] Код компонента разом зі значенням `DB_PASSWORD`
> - [ ] Рядок підключення до бази, бо без нього браузер не покаже дані
> - [x] Лише результат рендеру: HTML та RSC payload зі списком
> - [ ] Запит до бази, який браузер виконає повторно
>
> **Пояснення:** код Server Component не їде в браузер, а секрети й запити лишаються на сервері. Клієнт отримує тільки результат рендеру. Саме тому прямий запит до бази в Server Component безпечний, поки значення не потрапляє у пропси Client Component або у відповідь.

> [!quiz] Два різні Server Components на одній сторінці роблять `fetch('https://api.example.com/me')` з однаковими параметрами (`GET`). Скільки запитів піде до API за один рендер сторінки?
> skill: data · diff: 3 · id: nextjs-pl-data-noob-07
> - [ ] Два: по одному на кожен компонент
> - [ ] Два, але другий візьметься з диска
> - [ ] Жодного: Next.js покаже закешовані дані з минулого запиту
> - [x] Один: однакові `GET`-запити в межах одного рендеру обʼєднуються
>
> **Пояснення:** `fetch` у Server Components дедуплікується (memoization): однакові `GET`-запити в межах одного рендеру виконуються один раз. Це не кеш між запитами: на наступний захід на сторінку запит піде знову. Тому дані можна брати там, де вони потрібні, без передавання пропсами «зверху».

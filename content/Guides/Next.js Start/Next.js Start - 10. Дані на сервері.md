---
title: Дані на сервері
id: nextjs-start-10
slug: 10-server-data
order: 10
level: noob
skill: data
icon: px:database
tags: [nextjs, data-fetching, server-components, loading, error, not-found, beginner]
prerequisites:
  - "[[Next.js Start - 07. Сторінки й layouts]]"
  - "[[Next.js Start - 03. React-мінімум, state, події й ефекти]]"
estimatedMinutes: 40
nextVersion: 16.3.8
---

# Дані на сервері

> [!success] 🎯 Після цього розділу ти зможеш
> - завантажити дані в `async` Server Component через `await fetch()`, локальний JSON або модуль-«базу даних»;
> - пояснити, чому для цього не потрібні `useEffect` і `useState` і що це дає користувачу;
> - показати стан завантаження файлом `loading.tsx` і пояснити, як він повʼязаний із Suspense;
> - перехопити помилку файлом `error.tsx` (Client Component з `retry`) і не злити деталі помилки в браузер;
> - показати сторінку 404 для відсутнього запису через `notFound()` і `not-found.tsx`;
> - для кожного з чотирьох станів екрана — завантаження, помилка, порожньо, дані — знати, де він живе.

## 🤔 Передбач

> [!quiz] Де зʼявиться повідомлення з console.log?
> level: junior · type: output · id: nextjs-start-10-quiz-01
>
> Продакшн-збірка (`next build` і `next start`). Користувач відкриває `/posts`:
>
> ```tsx
> // app/posts/page.tsx
> import { getPosts } from '@/lib/db'
>
> export default async function PostsPage() {
>   const posts = await getPosts()
>   console.log('Завантажено постів:', posts.length)
>   return (
>     <ul>
>       {posts.map((post) => (
>         <li key={post.id}>{post.title}</li>
>       ))}
>     </ul>
>   )
> }
> ```
>
> - [x] У терміналі, де запущено `next start`; у консолі браузера — нічого
> - [ ] У консолі браузера: React-компоненти виконуються в браузері
> - [ ] І в терміналі, і в браузері — один раз у кожному
> - [ ] Ніде: `async`-компонент без `'use client'` не рендериться
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Файл без `'use client'` — Server Component: він виконується лише на сервері, тож і `console.log`, і `getPosts()` працюють там. Браузер отримує готовий HTML зі списком. (У `next dev` Next.js ще й дублює серверні логи в консоль браузера з сірою позначкою — це копія, а не виконання.)

## 🧒 Простими словами

Уяви, що ти замовляєш піцу. **Старий шлях** — привезли порожню коробку з запискою «по піцу — на кухню, адреса така-то». Ти відкриваєш коробку (сторінка завантажилась), читаєш записку (JavaScript запустився), біжиш на кухню (запит до API) і лише тоді їси. **Шлях Server Components** — кухар поклав піцу в коробку ще на кухні: відкрив — і одразу їси. А якщо піца ще в печі, курʼєр спершу привозить коробку з написом «вже готується» (`loading.tsx`), і за хвилину докладає піцу в ту саму доставку. Якщо піч зламалась — замість піци записка «вибач, спробуй ще» з кнопкою (`error.tsx`). А якщо такої піци в меню взагалі немає — чесне «не знайдено» (`notFound()`).

## 🔬 Як це працює насправді

### 🧭 Старий шлях: дані в браузері через useEffect

З [[Next.js Start - 03. React-мінімум, state, події й ефекти]] ти знаєш `useState` і `useEffect`. У звичайному React-застосунку дані завантажують так:

```tsx
// app/client-posts/page.tsx — ❌ старий шлях: дані в браузері через useEffect
'use client'

import { useEffect, useState } from 'react'

type Post = { id: number; title: string }

export default function ClientPostsPage() {
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    fetch('https://api.vercel.app/blog')
      .then((res) => res.json())
      .then(setPosts)
  }, [])

  if (!posts) return <p>Завантаження…</p>
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

Це працює і в Next.js, але подивись, що відбувається:

1. Сервер віддає HTML, у якому лише «Завантаження…» — списку там немає.
2. Браузер завантажує JavaScript сторінки й запускає React.
3. Лише після цього `useEffect` робить запит до API — ще одна подорож мережею.
4. Дані приходять, React рендерить список.

Користувач чекає довше, пошуковик бачить порожню сторінку, у браузер їде код компонента, а ключі доступу до API довелося б класти у фронтенд. Тут ще не враховано обробку помилок і «гонку» запитів — а код уже вийшов довшим, ніж хотілося б.

### ⚡ async Server Component: просто чекай дані

Згадай з [[Next.js - 07. Server і Client Components]]: у App Router кожен компонент за замовчуванням — **Server Component**, він виконується лише на сервері. І його можна зробити **`async`** — тобто функцією, всередині якої можна чекати проміс через `await`:

```tsx
// app/blog/page.tsx
type Post = { id: number; title: string }

export default async function BlogPage() {
  const res = await fetch('https://api.vercel.app/blog')
  const posts: Post[] = await res.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

`fetch` — стандартна функція для HTTP-запитів; `await` зупиняє виконання компонента, доки відповідь не прийде, а `res.json()` перетворює тіло відповіді на обʼєкт. Ні стану, ні ефекту, ні окремої гілки «ще вантажиться» в компоненті: на момент `return` дані вже є. Сервер рендерить список і віддає браузеру **HTML з даними**.

Чому це краще:

- **Менше подорожей мережею.** Запит іде із сервера, який зазвичай ближче до API чи бази, і результат одразу потрапляє в HTML.
- **Менше JavaScript у браузері.** Код Server Component у бандл не потрапляє.
- **Секрети лишаються на сервері.** Ключ API в `fetch` усередині Server Component браузер не бачить.
- **Простий код.** Звичайний `await`, як у будь-якій асинхронній функції.

Тому правило для старту: **дані, потрібні для першого показу сторінки, завантажуй у Server Component**. `useEffect` для цього не потрібен. Клієнтське завантаження ще знадобиться — для живого пошуку, нескінченної стрічки, даних, що змінюються щосекунди, — але це теми основного посібника.

> [!quiz] Перевір себе: що буде в HTML першої відповіді?
> level: junior · type: output · id: nextjs-start-10-quiz-02
>
> Два варіанти сторінки `/blog`, обидва звертаються до того самого API зі списком із 10 постів. Вимкни в браузері JavaScript і відкрий кожну. Що побачиш?
>
> Варіант A — `'use client'` + `useEffect` + `fetch`, як у прикладі вище.
> Варіант B — `async` Server Component з `await fetch()`.
>
> - [x] A: лише «Завантаження…»; B: увесь список з 10 постів
> - [ ] A і B: увесь список, бо обидва рендеряться на сервері
> - [ ] A: увесь список; B: порожньо, бо без JavaScript `await` не працює
> - [ ] A і B: «Завантаження…», бо дані завжди вантажаться після HTML
>
> **Пояснення:** Client Component теж рендериться на сервері для першого HTML, але `useEffect` на сервері **не запускається** — лише в браузері після hydration. Тож у HTML варіанта A лишається стан `null` → «Завантаження…», а без JavaScript він там і застрягне. Варіант B дочекався даних на сервері, тому список уже в HTML.

### 🗄️ Звідки брати дані

`async` Server Component може чекати будь-яку асинхронну роботу. Для старту знадобляться три джерела.

**1. Зовнішній API через `fetch`** — як у прикладі вище. Перевіряй `res.ok`: `fetch` не кидає помилку на 404 чи 500, лише на збій мережі.

```ts
// фрагмент компонента
const res = await fetch('https://api.vercel.app/blog')
if (!res.ok) throw new Error(`API повернув ${res.status}`)
```

**2. Локальний JSON-файл.** Найпростіше джерело для прототипу — імпорт:

```json
[
  { "id": 1, "title": "Server Components", "done": true },
  { "id": 2, "title": "loading.tsx", "done": false }
]
```

```tsx
// app/notes/page.tsx — дані з локального JSON
import notes from '@/data/notes.json'

export default function NotesPage() {
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          {note.done ? '✅' : '⬜'} {note.title}
        </li>
      ))}
    </ul>
  )
}
```

Тут навіть `async` не потрібен: імпортований JSON — частина коду, і збирач знає його вміст наперед. TypeScript сам виводить тип із файлу. `@/` — скорочення для кореня проєкту (налаштовано в `tsconfig.json` шаблону `create-next-app`). Якщо файл має читатися **під час запиту** (його змінює інша програма), читай з диска: `await readFile(path.join(process.cwd(), 'data/notes.json'), 'utf8')` з `node:fs/promises` — серверний компонент це вміє, бо працює в Node.js.

**3. «База даних»** — модуль з функціями, що повертають дані. Поки справжньої БД немає, імітуємо її масивом і затримкою, щоб бачити стан завантаження:

```ts
// lib/db.ts — «фейкова БД»: масив у памʼяті й штучна затримка
export type Post = { id: string; title: string; body: string; createdAt: string }

const posts: Post[] = [
  { id: '1', title: 'Привіт, Next.js', body: 'Перший пост', createdAt: '2026-01-10' },
  { id: '2', title: 'Server Components', body: 'Дані на сервері', createdAt: '2026-02-03' },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getPosts(): Promise<Post[]> {
  await sleep(1000) // імітуємо мережу
  return posts
}

export async function getPost(id: string): Promise<Post | undefined> {
  await sleep(500)
  return posts.find((post) => post.id === id)
}
```

```tsx
// app/posts/page.tsx
import Link from 'next/link'
import { getPosts } from '@/lib/db'

export default async function PostsPage() {
  const posts = await getPosts()
  if (posts.length === 0) return <p>Постів ще немає.</p>
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

Зверни увагу на рядок з `posts.length === 0`: **порожній стан** — це звичайна гілка в компоненті, окремого файлу для нього немає. Справжня БД (Postgres через ORM на кшталт Drizzle чи Prisma) пізніше замінить лише вміст `lib/db.ts` — сторінки не зміняться. Документація Next.js нагадує: навіть у серверному коді перевіряй, чи має користувач право бачити ці дані.

> [!note] Чому сторінкам з даними потрібен `loading.tsx` / `<Suspense>`
> Приклади курсу зібрані з `cacheComponents: true` (так Next.js 16 радить для нових проєктів). Із цим налаштуванням `next build` намагається заздалегідь відрендерити кожну сторінку і зупиняється, якщо натрапив на дані, які не можна взяти наперед: `fetch`, читання файлу, нашу `sleep` у «БД». На 16.3.8 для `/blog` без `loading.tsx` це виглядає так:
>
> ```text
> Error: Route "/blog": Next.js encountered uncached or runtime data during prerendering.
> ```
>
> Виправлень два: показати заглушку на час завантаження — `loading.tsx` (нижче) або `<Suspense>`, — чи закешувати дані директивою `'use cache'` (є й третій, рідкісний — blocking route через `export const instant = false`). Streaming і кеш — у темах 11–12, 14–16 основного посібника, тут обираємо `loading.tsx`. Імпортований JSON (`/notes`) такої помилки не дає: його вміст відомий під час збірки, і сторінка стає повністю статичною (`○` у виводі `next build`).

> [!quiz] Перевір себе: яка сторінка збереться без loading.tsx?
> level: junior · id: nextjs-start-10-quiz-03
>
> Проєкт з `cacheComponents: true`, у жодного маршруту немає `loading.tsx` чи `<Suspense>`. Яка сторінка пройде `next build` без помилки?
>
> - [x] `app/notes/page.tsx`, що імпортує `@/data/notes.json` і рендерить список
> - [ ] `app/blog/page.tsx` з `await fetch('https://api.vercel.app/blog')`
> - [ ] `app/files/page.tsx` з `await readFile('data/notes.json')`
> - [ ] `app/posts/page.tsx` з `await getPosts()`, де всередині `setTimeout` на секунду
>
> **Пояснення:** імпортований JSON — частина коду, його вміст відомий під час збірки, тож сторінка статична. `fetch`, читання файлу й таймер виконуються лише під час запиту; на 16.3.8 усі три варіанти зупиняють збірку з `encountered uncached or runtime data during prerendering`. Виправлення — `loading.tsx` (або `<Suspense>`) чи кеш `'use cache'` (у темах 14–16 основного посібника).

### ⏳ loading.tsx: що показати, поки дані їдуть

**`loading.tsx`** — спеціальний файл у папці маршруту. Його компонент Next.js показує, поки сторінка цього сегмента чекає дані:

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return <p>Завантажуємо пости…</p>
}
```

Під капотом Next.js загортає `page.tsx` (і всі вкладені маршрути) у **Suspense** — React-компонент, який показує «заглушку» (`fallback`), доки дочірній компонент чекає дані, а потім підміняє її справжнім вмістом. `loading.tsx` — це і є `fallback` для всієї сторінки:

```tsx
// що Next.js робить сам (спрощено)
<Layout>
  <Suspense fallback={<Loading />}>
    <Page />
  </Suspense>
</Layout>
```

Головне: **layout показується одразу**, а заглушка — на місці сторінки. Відповідь сервера приходить **частинами** — це називається **streaming**: спершу HTML з layout і `Loading`, потім, коли `getPosts()` завершиться, у тому ж з'єднанні доїжджає список і замінює заглушку. Якщо відкрити `/posts` через `curl localhost:3000/posts`, видно одну відповідь, у якій спершу є «Завантажуємо пости…», а нижче — заголовки постів. При переході через `<Link>` заглушка зʼявляється миттєво: Next.js завантажує її заздалегідь (prefetch).

> [!diagram] Streaming зі loading.tsx: що бачить користувач
> ```yaml
> layout: timeline
> nodes:
>   - { id: req, at: "0 мс", label: "браузер", text: "GET /posts", tone: gray, icon: "px:monitor" }
>   - { id: shell, at: "~50 мс", label: "сервер → браузер", text: "layout + «Завантажуємо пости…»", note: "перша частина HTML", tone: yellow, icon: "px:hourglass" }
>   - { id: wait, at: "~50–1050 мс", label: "сервер", code: "await getPosts()", note: "сторінка чекає дані", tone: blue, icon: "px:database" }
>   - { id: data, at: "~1050 мс", label: "сервер → браузер", text: "<ul> з постами", note: "доїжджає в тій самій відповіді", tone: green }
>   - { id: swap, at: "одразу", label: "браузер", text: "список замінює заглушку", tone: mint }
> steps:
>   - { focus: req, note: "Користувач відкриває /posts. Сервер починає рендер: layout і сторінку." }
>   - { show: shell, note: "Сторінка ще чекає дані, тож Next.js одразу відправляє layout і компонент з loading.tsx. Користувач бачить, що щось відбувається." }
>   - { show: wait, note: "Тим часом на сервері виконується await getPosts(). З'єднання з браузером лишається відкритим." }
>   - { show: data, note: "Дані прийшли — React дорендерює сторінку і досилає HTML списку в ту саму відповідь." }
>   - { show: swap, note: "Браузер вставляє список на місце заглушки. Перезавантаження сторінки не потрібне." }
> ```
> Час умовний: у нашій «БД» затримка 1 секунда.

Кілька деталей:

- `loading.tsx` діє на свій сегмент і **всі вкладені**: `app/posts/loading.tsx` покриває і `/posts`, і `/posts/[id]`, доки там немає власного.
- Він **не покриває layout** того ж сегмента. Якщо дані чекає `layout.tsx`, заглушка не допоможе — тримай завантаження в `page.tsx`.
- Заглушку роблять схожою на майбутній вміст (так званий **skeleton** — сірі блоки на місці тексту), щоб сторінка не «стрибала».
- Коли потрібна заглушка лише для частини сторінки, а не для всієї, загортають цю частину в `<Suspense fallback={…}>` вручну. Детальніше — у темі 11 основного посібника.

> [!quiz] Перевір себе: що побачить користувач першим?
> level: junior · type: output · id: nextjs-start-10-quiz-04
>
> Є `app/layout.tsx` з шапкою «Мій блог», `app/posts/loading.tsx` з текстом «Завантажуємо…» і `app/posts/page.tsx`, що чекає `getPosts()` 1 секунду. Що бачить користувач, відкривши `/posts`?
>
> - [x] Одразу шапку «Мій блог» і «Завантажуємо…», через секунду — список замість «Завантажуємо…»
> - [ ] Одразу лише «Завантажуємо…» на білому екрані, через секунду — шапку і список
> - [ ] Секунду білий екран, потім шапку і список разом
> - [ ] Одразу шапку і порожній список, через секунду — пости
>
> **Пояснення:** `loading.tsx` загортає в Suspense лише сторінку, а layout над нею рендериться й відправляється одразу. Тож шапка видна з першої ж частини відповіді, а на місці сторінки — заглушка. Порожнього списку не буде: компонент сторінки нічого не рендерить, доки `await` не завершився.

### 💥 error.tsx: якщо щось пішло не так

Мережа падає, API відповідає 500, у коді баг. Якщо Server Component кидає помилку, Next.js шукає найближчий **`error.tsx`** вгору по папках і показує його замість сторінки. Технічно це **error boundary** — React-компонент, що «ловить» помилки рендера дочірніх компонентів і показує запасний UI замість зламаної частини.

```tsx
// app/posts/error.tsx
'use client' // межа помилок — завжди Client Component

export default function PostsError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <div>
      <h2>Не вдалося завантажити пости</h2>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Спробувати ще раз</button>
    </div>
  )
}
```

Розберемо:

- **`'use client'` обовʼязковий.** Межа помилок працює в браузері (кнопка з `onClick` і є клієнтська інтерактивність). Без директиви `next dev` на 16.3.8 зупиняється з повідомленням `app/posts/error.tsx must be a Client Component. Add the "use client" directive the top of the file to resolve this issue.`
- **`retry()`** — спробувати ще раз: Next.js заново запитує й рендерить вміст сегмента. Корисно для тимчасових збоїв. У 16.3 `retry` став стабільним; у старих статтях побачиш `reset` — він теж є, але лише скидає стан помилки **без** повторного запиту, тож у більшості випадків потрібен `retry`.
- **`error.message` у продакшні не твій.** У `next dev` ти бачиш оригінальний текст, а в продакшн-збірці Next.js ховає повідомлення помилок із Server Components, щоб не злити в браузер щось секретне. Наприклад, якщо сторінка кине `new Error('DB password=secret123 недоступна')`, у `next dev` текст покажеться повністю, а після `next build` і `next start` на 16.3.8 замість нього буде `Minified React error #441…`, і в HTML відповіді немає жодного `secret123`. Для звʼязку з логами є `error.digest` — хеш, який сервер друкує поруч із повною помилкою.
- **`error.tsx` не ловить помилки layout того ж сегмента** — лише сторінки та вкладених маршрутів. Помилку в root layout ловить окремий `app/global-error.tsx` (він мусить мати власні `<html>` і `<body>`).

Не всі помилки варто кидати. Документація ділить їх на **очікувані** (API повернув «немає доступу», форма з помилками) — їх обробляють звичайним `if` і показують повідомлення прямо на сторінці — і **неочікувані** (баги, недоступна БД), для яких і існує `error.tsx`.

```tsx
// app/weather/page.tsx — очікувана помилка: показуємо повідомлення, не кидаємо
// (поруч лежить app/weather/loading.tsx — див. примітку про cacheComponents)
export default async function WeatherPage() {
  const res = await fetch('https://api.example.com/weather')
  if (!res.ok) return <p>Прогноз тимчасово недоступний.</p>
  const weather: { temp: number } = await res.json()
  return <p>Зараз {weather.temp}°C</p>
}
```

> [!quiz] Перевір себе: що з цього правда про error.tsx?
> level: junior · id: nextjs-start-10-quiz-05
>
> Обери всі правильні твердження (Next.js 16.3).
>
> - [x] Файл мусить починатися з `'use client'`
> - [x] Компонент отримує `error` і функцію `retry`, яка заново запитує й рендерить сегмент
> - [x] У продакшні `error.message` з Server Component не містить оригінального тексту
> - [ ] `app/posts/error.tsx` ловить помилки в `app/posts/layout.tsx`
> - [ ] Його можна зробити `async` і завантажити в ньому дані для гарного повідомлення
>
> **Пояснення:** межа помилок — Client Component, тому директива обовʼязкова, а `async`-компоненти на клієнті не підтримуються. `retry` (стабільний з 16.3) перезапитує вміст. Повідомлення з серверних помилок у продакшні приховані, щоб не злити секрети; для пошуку в логах є `digest`. Layout того ж сегмента лежить **над** межею, тож його помилки ловить `error.tsx` рівнем вище.

> [!quiz] Заповни пропуски в error.tsx
> level: junior · type: fill · id: nextjs-start-10-quiz-06
>
> ```tsx fill
> // app/posts/error.tsx
> '[[use client]]'
>
> export default function PostsError({
>   error,
>   [[retry]],
> }: {
>   error: Error & { digest?: string }
>   retry: () => void
> }) {
>   return (
>     <div>
>       <h2>Не вдалося завантажити пости</h2>
>       <button onClick={() => [[retry]]()}>Спробувати ще раз</button>
>     </div>
>   )
> }
> ```
>
> **Пояснення:** межа помилок — Client Component, тому директива `'use client'` стоїть першою. `retry` — проп, який Next.js 16.3 передає в `error.tsx`: виклик заново запитує й рендерить сегмент.

### 🔍 notFound(): коли запису немає

Сторінка поста отримує `id` з адреси (`/posts/42`). Якщо такого поста немає, правильна відповідь — «не знайдено», а не порожня сторінка чи помилка. Для цього є функція `notFound()` з `next/navigation`:

```tsx
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/db'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  )
}
```

```tsx
// app/posts/[id]/not-found.tsx
export default function PostNotFound() {
  return <p>Такого поста немає.</p>
}
```

Папка `[id]` у квадратних дужках — **динамічний сегмент**: будь-яке значення з адреси потрапляє в `params.id`. У Next.js 16 `params` — це проміс, тому його теж треба `await`. Детально динамічні маршрути розбираємо в темі 03 основного посібника.

`notFound()` **кидає** спеціальний виняток і зупиняє рендер — `return` перед ним не потрібен, і TypeScript розуміє, що нижче `post` точно не `undefined`. Next.js ловить виняток і показує найближчий `not-found.tsx` (або вбудовану сторінку 404), а ще додає в HTML `<meta name="robots" content="noindex">`, щоб пошуковики не індексували адресу. Звідси й пастка: якщо загорнути виклик у `try/catch`, ти перехопиш цей виняток, і сторінка 404 не покажеться.

Ще одна деталь: на 16.3.8 `curl -i /posts/999` повертає статус **200**, а не 404. Причина — `loading.tsx`: заглушка вже поїхала в браузер разом із заголовками відповіді, і змінити статус після цього неможливо. Документація описує саме це: при streaming статус лишається 200, а `noindex` в HTML не дає пошуковику проіндексувати сторінку. Справжній статус 404 буде, якщо перевірка відбулася **до** початку streaming. Для старту цього досить знати; як цього досягти — у темі 11 основного посібника.

> [!diagram] Хто кого обгортає в сегменті app/posts
> ```yaml
> layout: nest
> nodes:
>   - { id: layout, label: "layout.tsx", text: "шапка, навігація", note: "показується завжди", tone: blue, icon: "px:house" }
>   - { id: error, label: "error.tsx", text: "межа помилок", note: "'use client'", parent: layout, tone: red, icon: "px:warning" }
>   - { id: loading, label: "loading.tsx", text: "Suspense fallback", note: "поки сторінка чекає дані", parent: error, tone: yellow, icon: "px:hourglass" }
>   - { id: nf, label: "not-found.tsx", text: "якщо викликано notFound()", parent: loading, tone: orange, icon: "px:magnifier" }
>   - { id: page, label: "page.tsx", code: "const posts = await getPosts()", parent: nf, tone: green }
> steps:
>   - { focus: layout, note: "Layout зовні: він рендериться першим і лишається на екрані за будь-якого результату сторінки." }
>   - { focus: error, note: "Усередині — межа помилок. Вона ловить усе, що кинуто нижче, але не помилки самого layout над нею." }
>   - { focus: loading, note: "Далі Suspense з loading.tsx: поки page чекає дані, на її місці заглушка." }
>   - { focus: nf, note: "Ще глибше — межа для notFound(): виклик у page показує not-found.tsx замість сторінки." }
>   - { focus: page, note: "У центрі — сама сторінка. Звідси й правила: завантаження → loading, кинута помилка → error, відсутній запис → not-found." }
> ```
> Так документація описує ієрархію спеціальних файлів одного сегмента.

### 🗺️ Чотири стани екрана

Будь-який екран з даними має чотири стани — завантаження, помилка, порожньо, дані, — а сторінка одного запису ще й п'ятий випадок: «не знайдено». У Next.js кожен має своє місце:

| Стан | Коли | Де живе |
|---|---|---|
| Завантаження | дані ще їдуть | `loading.tsx` (або `<Suspense fallback>`) |
| Помилка | щось кинуло виняток | `error.tsx` (Client Component) |
| Не знайдено | конкретного запису немає | `notFound()` + `not-found.tsx` |
| Порожньо | запит успішний, але список порожній | гілка `if` у самій сторінці |
| Дані | усе гаразд | основний `return` сторінки |

Порожній список — не помилка і не 404: запит пройшов, просто постів ще немає. Таке повідомлення («Постів ще немає. Напиши перший!») — звичайна частина сторінки.

> [!quiz] Склади сторінку поста в правильному порядку
> level: junior · type: order · id: nextjs-start-10-quiz-07
>
> ```tsx order
> export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
>   const { id } = await params
>   const post = await getPost(id)
>   if (!post) notFound()
>   return <h1>{post.title}</h1>
> }
> useEffect(() => { getPost(id).then(setPost) }, [id]) // ✗
> ```
>
> **Пояснення:** спершу дістаємо `id` з промісу `params`, потім завантажуємо пост, перевіряємо, що він існує, і лише тоді рендеримо. `useEffect` у Server Component не працює взагалі — та й не потрібен: `await` робить те саме простіше.

> [!quiz] Перевір себе: де показати «Постів ще немає»?
> level: junior · id: nextjs-start-10-quiz-08
>
> `getPosts()` успішно повернув `[]`. Як правильно показати користувачу, що постів поки немає?
>
> - [x] Гілкою `if (posts.length === 0) return <p>Постів ще немає.</p>` у самій сторінці
> - [ ] Викликати `notFound()`: даних же не знайдено
> - [ ] Кинути `new Error('Порожньо')`, щоб показався `error.tsx`
> - [ ] Нічого не робити: `loading.tsx` показуватиметься, доки не зʼявляться пости
>
> **Пояснення:** порожній список — успішний результат, не помилка й не відсутня сторінка. `notFound()` дав би 404 і `noindex` для адреси, яка існує, `error.tsx` налякав би користувача «щось зламалось», а `loading.tsx` показується лише доки сторінка чекає дані, тобто після `[]` зникне.

### 🏭 Як це роблять у продакшні

- **Шар даних окремо.** Функції `getPosts()`, `getPost(id)` живуть у `lib/` (часто з `import 'server-only'`, див. [[Next.js - 07. Server і Client Components]]); сторінки їх лише викликають. Перехід з фейкової БД на справжню не чіпає UI.
- **Перевірка доступу біля даних.** Функція шару даних сама перевіряє, чи має поточний користувач право на запис, а не покладається на те, що «кнопку ж не видно».
- **`loading.tsx` — скелетон, а не спінер.** Заглушка повторює форму майбутньої сторінки, тож нічого не стрибає.
- **`error.tsx` на рівні розділів** (`app/dashboard/error.tsx`, `app/posts/error.tsx`), щоб збій одного розділу не ламав увесь сайт, плюс `global-error.tsx` як остання лінія. У `useEffect` межі помилок помилку відправляють у сервіс моніторингу (Sentry тощо).
- **Очікувані помилки — значеннями, неочікувані — винятками.** Перевірка `res.ok` з повідомленням на сторінці; `throw` — лише для справжніх аварій.
- **Кеш замість «вантажити щоразу».** Для даних, що змінюються рідко, — `'use cache'` і ревалідація (у темах 14–16 основного посібника).

## ⚠️ Пастки

> [!pitfall] Хук у серверному компоненті
> Файл без `'use client'` не може імпортувати `useState` чи `useEffect`. На 16.3.8 `next dev` пише:
>
> ```text
> You're importing a module that depends on `useEffect` into a React Server Component module.
> ```
>
> Дані завантажуй через `async`/`await`, а `'use client'` став лише там, де справді потрібна інтерактивність.

> [!pitfall] error.tsx без 'use client'
> Межа помилок мусить бути Client Component, інакше `app/posts/error.tsx must be a Client Component`. Директиву — першим рядком файлу.

> [!pitfall] notFound() у try/catch
> `notFound()` працює через виняток. `catch` його «зʼїсть», і сторінка 404 не покажеться.
>
> ```tsx
> try {
>   const post = await getPost(id)
>   if (!post) notFound() // ❌ виняток перехопить catch нижче
> } catch {
>   return <p>Помилка</p>
> }
> ```

> [!pitfall] fetch не кидає на 404 і 500
> Відповідь з помилкою — теж «успішний» `fetch`. Без перевірки `res.ok` ти спробуєш розібрати сторінку помилки як JSON.
>
> ```ts
> const res = await fetch(url)
> if (!res.ok) throw new Error(`API ${res.status}`) // ✅
> ```

> [!pitfall] Деталі помилки в UI
> У dev `error.message` показує повний текст, і здається, що так буде завжди. У продакшні повідомлення з Server Components приховане. Пиши людський текст у самому `error.tsx`, а деталі шукай у логах сервера за `error.digest`.

## 🔗 Звʼязки

- [[Next.js - 07. Server і Client Components]] — чому `async`-компонент без директиви виконується лише на сервері і чому `error.tsx` — клієнтський.
- [[Next.js Start - 03. React-мінімум, state, події й ефекти]] — `useEffect` і чому ефект не потрібен для обчислень і завантаження даних першого екрана.
- [[Next.js Start - 07. Сторінки й layouts]] — сегменти, `page` і `layout`, усередині яких живуть `loading` і `error`.
- [[Next.js Start - 11. Перша форма і Server Action]] — наступний крок: не лише читати дані на сервері, а й змінювати їх.
- Далі в основному посібнику: тема 03 — динамічні маршрути, 11 — streaming і Suspense, 13 — помилки й межі помилок, 14–16 — дані, кеш і ревалідація.

## ⚡ Фішки

> [!reel] 🍕 Server Component може бути async
> Пиши `export default async function Page()` і просто `await` дані. Ні `useState`, ні `useEffect`: на момент `return` дані вже є, а в браузер приходить HTML зі списком.

> [!reel] ⏳ loading.tsx — це Suspense, який пише Next.js
> Файл `loading.tsx` у папці маршруту стає `fallback` для сторінки. Layout видно одразу, заглушку — на місці сторінки, а дані доїжджають у тій самій відповіді.

> [!reel] 🤐 error.message у продакшні мовчить
> Кинув у Server Component `Error('пароль БД …')`? У dev побачиш текст, у продакшні — загальне повідомлення. Для логів є `error.digest`.

> [!reel] 🚫 notFound() — це throw
> Писати `return notFound()` не треба: функція кидає виняток і зупиняє рендер. А от `try/catch` навколо неї зламає 404.

> [!reel] 🔁 У 16.3 error.tsx отримує retry
> `retry()` заново запитує й рендерить сегмент. Старий `reset()` лише скидає помилку без нового запиту — тому для тимчасових збоїв бери `retry`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Як завантажити дані для сторінки в App Router без useEffect?
> *дуже часто · практика* · `nextjs-start-10-card-01`
>
> Зробити сторінку `async` Server Component і чекати дані прямо в ній: `const posts = await getPosts()`. Код виконується на сервері, і браузер отримує HTML уже з даними.
>
> ```tsx
> export default async function Page() {
>   const res = await fetch('https://api.vercel.app/blog')
>   const posts = await res.json()
>   return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
> }
> ```
>
> 📚 [[Next.js Start - 10. Дані на сервері#⚡ async Server Component: просто чекай дані|Розділ: async Server Component]] · [Next.js: Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)

> [!question]- Чим погане завантаження даних першого екрана через useEffect?
> *часто · теорія* · `nextjs-start-10-card-02`
>
> Ефект запускається лише в браузері після hydration: у HTML порожньо, потрібна ще одна подорож мережею, у бандл їде код компонента, а ключі API довелося б віддати браузеру. Server Component завантажує дані до відправки HTML.
>
> 📚 [[Next.js Start - 10. Дані на сервері#🧭 Старий шлях: дані в браузері через useEffect|Розділ: старий шлях]] · [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect#fetching-data)

> [!question]- Що робить файл loading.tsx?
> *дуже часто · теорія* · `nextjs-start-10-card-03`
>
> Показує заглушку, поки сторінка сегмента чекає дані. Next.js загортає `page.tsx` у `<Suspense fallback={<Loading />}>`: layout видно одразу, а дані доїжджають у тій самій відповіді (streaming).
>
> 📚 [[Next.js Start - 10. Дані на сервері#⏳ loading.tsx: що показати, поки дані їдуть|Розділ: loading.tsx]] · [Next.js: loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

> [!question]- Чому error.tsx має бути Client Component і які props він отримує?
> *дуже часто · код* · `nextjs-start-10-card-04`
>
> Межа помилок працює в браузері: перехоплює помилку й показує інтерактивний запасний UI. Тому першим рядком — `'use client'`. Props: `error` (з `digest`) і `retry` — функція, що заново запитує й рендерить сегмент.
>
> 📚 [[Next.js Start - 10. Дані на сервері#💥 error.tsx: якщо щось пішло не так|Розділ: error.tsx]] · [Next.js: error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)

> [!question]- Як показати 404 для поста, якого немає в базі?
> *часто · код* · `nextjs-start-10-card-05`
>
> Викликати `notFound()` з `next/navigation`, коли запис не знайдено, і додати `not-found.tsx` поруч зі сторінкою. Функція кидає виняток, тож `return` не потрібен.
>
> ```tsx
> const post = await getPost(id)
> if (!post) notFound()
> ```
>
> 📚 [[Next.js Start - 10. Дані на сервері#🔍 notFound(): коли запису немає|Розділ: notFound]] · [Next.js: notFound](https://nextjs.org/docs/app/api-reference/functions/not-found)

> [!question]- Де показати стан «список порожній»?
> *часто · практика* · `nextjs-start-10-card-06`
>
> У самій сторінці, звичайним `if`: запит пройшов успішно, просто записів немає. Це не помилка (`error.tsx`) і не 404 (`notFound()`).
>
> 📚 [[Next.js Start - 10. Дані на сервері#🗺️ Чотири стани екрана|Розділ: чотири стани]] · [Next.js: Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)

### 🟡 Middle

> [!question]- Чому в продакшні error.message не містить тексту помилки із Server Component?
> *часто · теорія* · `nextjs-start-10-card-07`
>
> Щоб не злити в браузер деталі (рядки підключення, внутрішні шляхи, дані). Next.js замінює повідомлення загальним і додає `error.digest` — хеш, за яким повну помилку знаходять у серверних логах. У dev текст показується для зручності.
>
> 📚 [[Next.js Start - 10. Дані на сервері#💥 error.tsx: якщо щось пішло не так|Розділ: error.tsx]] · [Next.js: error.js — error.message](https://nextjs.org/docs/app/api-reference/file-conventions/error#errormessage)

> [!question]- Чим відрізняються retry і reset в error.tsx?
> *іноді · порівняння* · `nextjs-start-10-card-08`
>
> `retry()` (стабільний з 16.3) заново запитує й рендерить вміст межі — для тимчасових збоїв. `reset()` лише скидає стан помилки й ререндерить без нового запиту; документація радить у більшості випадків `retry`.
>
> 📚 [[Next.js Start - 10. Дані на сервері#💥 error.tsx: якщо щось пішло не так|Розділ: error.tsx]] · [Next.js: error.js — retry](https://nextjs.org/docs/app/api-reference/file-conventions/error#retry)

> [!question]- Чому з cacheComponents сторінка з fetch без loading.tsx ламає next build?
> *часто · теорія* · `nextjs-start-10-card-09`
>
> Збірка намагається заздалегідь відрендерити сторінку, а незакешований `fetch` (як і читання файлу чи затримка) відомий лише під час запиту. Без межі Suspense Next.js не знає, що показати замість нього, і зупиняється з `encountered uncached or runtime data during prerendering`. Рішення — `loading.tsx`/`<Suspense>` або кеш через `'use cache'`.
>
> 📚 [[Next.js Start - 10. Дані на сервері#🗄️ Звідки брати дані|Розділ: примітка про cacheComponents]] · [Next.js: Caching](https://nextjs.org/docs/app/getting-started/caching)

## 🛠️ Практика

> [!task] Підготуй пости до показу
> level: junior · difficulty: easy · id: nextjs-start-10-task-01 · tags: data, arrays, server-components
>
> Сторінка отримала з «БД» масив постів і показує їх зі строкою пошуку з адреси (`?q=next`). Напиши `preparePosts(posts, options)`, яка повертає **новий** масив для показу:
>
> - `options.query` — пошук без урахування регістру й пробілів на краях у полі `title`; порожній рядок або відсутній `query` — без фільтра;
> - пости з `draft: true` ніколи не показуються;
> - `options.sort`: `'newest'` (за замовчуванням) — новіші першими за `createdAt` (рядок `YYYY-MM-DD`), `'oldest'` — навпаки;
> - `options.limit` — не більше стількох постів (якщо не задано — усі);
> - вхідний масив не змінювати.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts starter
> type Post = { id: string; title: string; createdAt: string; draft?: boolean }
> type Options = { query?: string; sort?: 'newest' | 'oldest'; limit?: number }
>
> function preparePosts(posts: Post[], options: Options = {}): Post[] {
>   // ❌ сортує вхідний масив на місці й ігнорує решту вимог
>   return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
> }
> ```
>
> ```ts tests
> const posts: Post[] = [
>   { id: '1', title: 'Привіт, Next.js', createdAt: '2026-01-10' },
>   { id: '2', title: 'Server Components', createdAt: '2026-02-03' },
>   { id: '3', title: 'Чернетка про Next.js', createdAt: '2026-03-01', draft: true },
>   { id: '4', title: 'loading і error', createdAt: '2026-01-25' },
> ]
>
> test('за замовчуванням — без чернеток, новіші першими', () => {
>   expect(preparePosts(posts).map((p) => p.id)).toEqual(['2', '4', '1'])
> })
>
> test('пошук не залежить від регістру і пробілів на краях', () => {
>   expect(preparePosts(posts, { query: '  NEXT ' }).map((p) => p.id)).toEqual(['1'])
> })
>
> test('sort oldest — старіші першими', () => {
>   expect(preparePosts(posts, { sort: 'oldest' }).map((p) => p.id)).toEqual(['1', '4', '2'])
> })
>
> test('limit обрізає результат після сортування', () => {
>   expect(preparePosts(posts, { limit: 2 }).map((p) => p.id)).toEqual(['2', '4'])
> })
>
> test('не змінює вхідний масив', () => {
>   const copy = posts.map((p) => p.id)
>   preparePosts(posts, { sort: 'oldest' })
>   preparePosts(posts)
>   expect(posts.map((p) => p.id)).toEqual(copy)
> })
> ```
>
> > [!hint]- Підказка 1
> > `filter` повертає новий масив, тож якщо почати з нього, `sort` уже не зачепить вхідні дані. Для порядку рядків `YYYY-MM-DD` вистачить `a.createdAt.localeCompare(b.createdAt)`.
>
> > [!hint]- Підказка 2
> > Нормалізуй запит один раз: `(options.query ?? '').trim().toLowerCase()`. Порожній рядок — «без фільтра». `limit` застосовуй наприкінці через `slice(0, limit)`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Post = { id: string; title: string; createdAt: string; draft?: boolean }
> > type Options = { query?: string; sort?: 'newest' | 'oldest'; limit?: number }
> >
> > function preparePosts(posts: Post[], options: Options = {}): Post[] {
> >   const query = (options.query ?? '').trim().toLowerCase()
> >   const sort = options.sort ?? 'newest'
> >   const result = posts
> >     .filter((post) => !post.draft)
> >     .filter((post) => query === '' || post.title.toLowerCase().includes(query))
> >     .sort((a, b) =>
> >       sort === 'newest' ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt),
> >     )
> >   return options.limit === undefined ? result : result.slice(0, options.limit)
> > }
> > ```
> >
> > У Next.js така функція викликається просто в `async` Server Component після `await getPosts()` — без `useMemo` і стану. Мутація вхідного масиву небезпечна: «БД» у памʼяті повертає той самий масив щоразу, і `sort` на місці змінив би порядок для всіх наступних запитів.

> [!task] Стан екрана за результатом запиту
> level: junior · difficulty: medium · id: nextjs-start-10-task-02 · tags: data, ui-states, loading, error
>
> Клієнтський віджет коментарів отримує результат запиту як обʼєкт `{ status, data?, error? }` і має вирішити, що показати. Напиши `toViewState(result)`, що повертає один із чотирьох станів:
>
> - `status: 'pending'` → `{ kind: 'loading' }`;
> - `status: 'error'` → `{ kind: 'error', message }`, де `message` — `error.message`, якщо це непорожній рядок, інакше `'Щось пішло не так'`;
> - `status: 'success'` і `data` — порожній масив → `{ kind: 'empty' }`;
> - `status: 'success'` і непорожній масив → `{ kind: 'data', items: data, count: data.length }`;
> - `status: 'success'`, але `data` — не масив → `{ kind: 'error', message: 'Некоректні дані' }`;
> - будь-який інший `status` → кинути `Error` з текстом `Unknown status: <значення>`.
>
> Це та сама логіка «чотирьох станів», яку на сервері роблять `loading.tsx`, `error.tsx` і `if` у сторінці.
>
> ```js
> toViewState({ status: 'success', data: [] }) // → { kind: 'empty' }
> ```
>
> ```js starter
> function toViewState(result) {
>   // ❌ порожній масив показується як «дані», а помилка — як завантаження
>   if (result.data) return { kind: 'data', items: result.data, count: result.data.length }
>   return { kind: 'loading' }
> }
> ```
>
> ```js tests
> test('pending — завантаження', () => {
>   expect(toViewState({ status: 'pending' })).toEqual({ kind: 'loading' })
> })
>
> test('error — повідомлення або запасний текст', () => {
>   expect(toViewState({ status: 'error', error: new Error('Таймаут') })).toEqual({ kind: 'error', message: 'Таймаут' })
>   expect(toViewState({ status: 'error', error: new Error('') })).toEqual({ kind: 'error', message: 'Щось пішло не так' })
>   expect(toViewState({ status: 'error' })).toEqual({ kind: 'error', message: 'Щось пішло не так' })
> })
>
> test('success з порожнім масивом — порожній стан', () => {
>   expect(toViewState({ status: 'success', data: [] })).toEqual({ kind: 'empty' })
> })
>
> test('success з даними — items і count', () => {
>   const data = [{ id: 1 }, { id: 2 }]
>   expect(toViewState({ status: 'success', data })).toEqual({ kind: 'data', items: data, count: 2 })
> })
>
> test('success без масиву — некоректні дані', () => {
>   expect(toViewState({ status: 'success', data: { id: 1 } })).toEqual({ kind: 'error', message: 'Некоректні дані' })
>   expect(toViewState({ status: 'success' })).toEqual({ kind: 'error', message: 'Некоректні дані' })
> })
>
> test('невідомий статус — виняток', () => {
>   expect(() => toViewState({ status: 'done' })).toThrow('Unknown status: done')
> })
> ```
>
> > [!hint]- Підказка 1
> > Почни з `switch (result.status)`: по `case` на кожен відомий статус і `default`, що кидає помилку.
>
> > [!hint]- Підказка 2
> > У гілці `'success'` спершу перевір `Array.isArray(result.data)`, потім довжину. Для повідомлення помилки: `typeof result.error?.message === 'string' && result.error.message !== ''`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function toViewState(result) {
> >   switch (result.status) {
> >     case 'pending':
> >       return { kind: 'loading' }
> >     case 'error': {
> >       const text = result.error?.message
> >       return { kind: 'error', message: typeof text === 'string' && text !== '' ? text : 'Щось пішло не так' }
> >     }
> >     case 'success': {
> >       const data = result.data
> >       if (!Array.isArray(data)) return { kind: 'error', message: 'Некоректні дані' }
> >       if (data.length === 0) return { kind: 'empty' }
> >       return { kind: 'data', items: data, count: data.length }
> >     }
> >     default:
> >       throw new Error(`Unknown status: ${result.status}`)
> >   }
> > }
> > ```
> >
> > Явний `default` з винятком ловить опечатки (`'sucess'`) одразу, а не тихим «вічним завантаженням». Порожній масив — окремий стан: користувач має побачити «коментарів ще немає», а не порожнє місце.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) — `async` Server Components, `fetch`, ORM, `loading.js`, Suspense.
- 🟢 [Next.js — Error Handling](https://nextjs.org/docs/app/getting-started/error-handling) — очікувані помилки, `notFound`, `error.js`.
- 🟢 [Next.js — loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — заглушки, streaming, статус-коди.
- 🟢 [Next.js — error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error) — props `error`, `retry`, `reset`, `global-error`.
- 🟡 [Next.js — notFound](https://nextjs.org/docs/app/api-reference/functions/not-found) — як працює виняток і `noindex`.
- 🟡 [Next.js — not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — сторінка 404 для сегмента.
- 🟡 [React — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) — чому ефект не найкраще місце для даних.
- 🟡 [React — Suspense](https://react.dev/reference/react/Suspense) — що стоїть за `loading.tsx`.
- 🛠️ [Next.js — Caching](https://nextjs.org/docs/app/getting-started/caching) — `'use cache'` і Cache Components, якщо хочеш забігти наперед.

> [!important] Підсумок
> - Дані для першого показу сторінки завантажують в `async` Server Component: `await fetch()`, імпорт JSON або функція з `lib/db.ts`. `useEffect` для цього не потрібен.
> - `loading.tsx` — `fallback` Suspense для сторінки: layout видно одразу, дані доїжджають у тій самій відповіді (streaming). З `cacheComponents` сторінка з незакешованими даними без нього не збереться.
> - `error.tsx` — Client Component з `error` і `retry`; у продакшні `error.message` із сервера прихований, для логів є `digest`.
> - `notFound()` кидає виняток і показує `not-found.tsx`; не загортай його в `try/catch`.
> - Чотири стани екрана: завантаження — `loading.tsx`, помилка — `error.tsx`, порожньо — `if` у сторінці, дані — основний `return`.

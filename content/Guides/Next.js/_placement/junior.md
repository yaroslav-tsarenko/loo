---
title: Вступний тест — банк junior
placement: true
level: junior
---

# Вступний тест — банк junior

Калібрований банк питань рівня **junior** для вступного тесту курсу «Next.js Zero → Pro». Це не стаття: компілятор
додає ці питання лише до вступного тесту. `diff`: 1 — легке для рівня, 2 — типове, 3 — на межі middle. Орієнтир рівня:
впевнено працює з маршрутами, layouts, Server/Client Components, простими даними й формами.

## foundations

> [!quiz] Коли спрацює ефект з порожнім масивом залежностей?
> level: junior · skill: foundations · diff: 1 · id: nextjs-pl-foundations-junior-01
>
> ```tsx
> useEffect(() => {
>   console.log('ефект')
> }, [])
> ```
>
> - [ ] Перед першим рендером, щоб підготувати дані для JSX
> - [x] Після першого рендеру, коли компонент на екрані
> - [ ] Після кожного рендеру, бо масив залежностей порожній
> - [ ] На сервері під час SSR
>
> **Пояснення:** ефект запускається **після** рендеру, коли React уже оновив DOM; `[]` означає «немає залежностей, що змінюються», тож лише після монтування (у dev Strict Mode — двічі, щоб перевірити cleanup). Без масиву ефект спрацює після кожного рендеру. На сервері ефекти не виконуються взагалі.

> [!quiz] Скільки покаже лічильник після одного кліку, якщо `count` був 0?
> level: junior · skill: foundations · diff: 2 · id: nextjs-pl-foundations-junior-02
>
> ```tsx
> function handleClick() {
>   setCount(count + 1)
>   setCount(count + 1)
> }
> ```
>
> - [ ] 2
> - [x] 1
> - [ ] 0: два виклики підряд скасовують один одного
> - [ ] Помилку: `setCount` не можна викликати двічі
>
> **Пояснення:** state — знімок: у цьому рендері `count` дорівнює 0, тож обидва виклики просять «зробити 1». Щоб рахувати від попереднього значення, передають функцію: `setCount((c) => c + 1)` двічі дасть 2.

> [!quiz] Новий пункт не зʼявляється у списку на екрані. Чому?
> level: junior · skill: foundations · diff: 2 · id: nextjs-pl-foundations-junior-03
>
> ```tsx
> const [items, setItems] = useState<string[]>([])
>
> function add(text: string) {
>   items.push(text)
>   setItems(items)
> }
> ```
>
> - [ ] `push` не працює з масивами, які зберігаються в state
> - [ ] Треба викликати `setItems` до `push`
> - [x] `setItems` отримав той самий масив — рендеру немає
> - [ ] Бракує `key` у пунктах, тому React не показує новий пункт
>
> **Пояснення:** масив змінено «на місці», і в `setItems` прийшло те саме посилання — для React нічого не змінилось. Масиви й обʼєкти в state замінюють новими: `setItems([...items, text])`.

> [!quiz] Що повідомить TypeScript про цю функцію?
> level: junior · skill: foundations · diff: 2 · id: nextjs-pl-foundations-junior-04
>
> ```ts
> function label(id: string | number) {
>   return id.toUpperCase()
> }
> ```
>
> - [x] Помилку: у типі `number` немає методу `toUpperCase`
> - [ ] Нічого: `toUpperCase` є і в `string`, і в `number`
> - [ ] Помилку лише тоді, коли функцію викличуть з числом
> - [ ] Помилку: union-тип не можна використовувати в параметрах
>
> **Пояснення:** для `string | number` доступне лише те, що є в **обох** типах. TypeScript перевіряє код до запуску, а не конкретний виклик. Після перевірки `typeof id === 'string'` у цій гілці `id` — уже `string`, і метод доступний.

> [!quiz] Сесійний токен лежить у cookie. Який атрибут не дасть шкідливому скрипту на сторінці його прочитати?
> level: junior · skill: foundations · diff: 2 · id: nextjs-pl-foundations-junior-05
> - [ ] `Secure`
> - [ ] `SameSite=Lax`
> - [ ] `Max-Age=3600`
> - [x] `HttpOnly`
>
> **Пояснення:** `HttpOnly` ховає cookie від `document.cookie`, тож XSS-скрипт його не вкраде, а браузер усе одно надсилає його з запитами. `Secure` лише забороняє передавати cookie по `http`, `SameSite` — про запити з інших сайтів (CSRF), `Max-Age` — про час життя.

> [!quiz] Що не так із цим компонентом?
> level: junior · skill: foundations · diff: 3 · id: nextjs-pl-foundations-junior-06
>
> ```tsx
> const [first, setFirst] = useState('')
> const [last, setLast] = useState('')
> const [full, setFull] = useState('')
>
> useEffect(() => {
>   setFull(first + ' ' + last)
> }, [first, last])
> ```
>
> - [x] `full` — похідне: його рахують у рендері
> - [ ] Нічого: так і синхронізують залежні значення в React
> - [ ] Бракує `full` у масиві залежностей ефекту
> - [ ] Ефект зациклиться
>
> **Пояснення:** усе, що можна обчислити з наявних props і state, не зберігають окремо: `const full = first + ' ' + last`. Ефект тут спершу показує старе `full`, а потім запускає ще один рендер. Зациклення немає: `full` не входить у залежності.

> [!quiz] Список задач з полями вводу рендериться з `key={index}`. Що станеться, якщо видалити першу задачу?
> level: junior · skill: foundations · diff: 3 · id: nextjs-pl-foundations-junior-07
>
> ```tsx
> {todos.map((todo, index) => (
>   <li key={index}>{todo.title} <input placeholder="Нотатка" /></li>
> ))}
> ```
>
> - [ ] Нічого поганого: індекс — унікальний і стабільний ключ
> - [ ] React перерендерить список з нуля
> - [x] Нотатки «зсунуться» на сусідні задачі
> - [ ] React кине помилку про дублікати ключів у списку
>
> **Пояснення:** після видалення колишня друга задача отримує `key={0}`, і React вважає її тим самим елементом, що був першим, — разом зі станом його `<input>`. Ключ має бути стабільним ідентифікатором даних: `key={todo.id}`.

## routing

> [!quiz] За якою адресою відкриється `app/(marketing)/pricing/page.tsx`?
> level: junior · skill: routing · diff: 1 · id: nextjs-pl-routing-junior-01
> - [ ] `/(marketing)/pricing`
> - [ ] `/marketing/pricing`
> - [ ] Ніде: папки в дужках Next.js пропускає разом із вмістом
> - [x] `/pricing`
>
> **Пояснення:** папка в круглих дужках — route group: вона організовує файли й може мати власний layout, але в адресу не входить. Від приватних папок `_folder` вона відрізняється тим, що маршрути всередині лишаються публічними.

> [!quiz] У `app/dashboard/layout.tsx` — бічна панель з лічильником у `useState` (Client Component). Що буде з лічильником при переході `<Link>` з `/dashboard/orders` на `/dashboard/settings`?
> level: junior · skill: routing · diff: 2 · id: nextjs-pl-routing-junior-02
> - [ ] Скинеться в 0: кожна навігація створює layout заново
> - [ ] Скинеться в 0, бо layout — Server Component і стану не зберігає
> - [ ] Лишиться, лише якщо обидві сторінки статичні
> - [x] Лишиться тим самим: layout не перемонтовується
>
> **Пояснення:** layout зберігає стан між сторінками свого сегмента: при навігації рендериться лише та частина дерева, що змінилась (partial rendering). Свіжий екземпляр на кожну навігацію — ідея `template.tsx`, не layout.

> [!quiz] Є лише `app/docs/[...slug]/page.tsx` (без `app/docs/page.tsx`). Яка адреса дасть 404?
> level: junior · skill: routing · diff: 2 · id: nextjs-pl-routing-junior-03
> - [x] `/docs`
> - [ ] `/docs/intro`
> - [ ] `/docs/guides/routing`
> - [ ] `/docs/a/b/c/d`
>
> **Пояснення:** catch-all `[...slug]` ловить **один і більше** сегментів (`slug` — масив, наприклад `['guides', 'routing']`), але не порожній шлях. Щоб `/docs` теж ішов у цю сторінку, потрібен optional catch-all `[[...slug]]`.

> [!quiz] Що станеться з цим layout?
> level: junior · skill: routing · diff: 2 · id: nextjs-pl-routing-junior-04
>
> ```tsx
> // app/layout.tsx
> import { usePathname } from 'next/navigation'
>
> export default function RootLayout({ children }: { children: React.ReactNode }) {
>   const pathname = usePathname()
>   return <html lang="uk"><body><nav data-active={pathname} />{children}</body></html>
> }
> ```
>
> - [ ] Працюватиме: `usePathname` доступний скрізь в App Router
> - [x] Помилка: `usePathname` — хук Client Component, а layout серверний
> - [ ] Працюватиме, але `pathname` завжди буде `/` під час SSR
> - [ ] Помилка: root layout не може рендерити нічого, крім `children`
>
> **Пояснення:** навігаційні хуки (`usePathname`, `useRouter`, `useSearchParams`) працюють лише в Client Components. Правильно — винести меню в окремий файл з `'use client'` і вставити його в layout, а не робити клієнтським увесь root layout.

> [!quiz] Сторінка поста викликає `notFound()`, коли поста немає в базі. Що побачить користувач?
> level: junior · skill: routing · diff: 2 · id: nextjs-pl-routing-junior-05
>
> ```tsx
> const post = await getPost(slug)
> if (!post) notFound()
> ```
>
> - [x] Найближчий `not-found.tsx`
> - [ ] Сторінку `error.tsx` найближчого сегмента
> - [ ] Порожню сторінку: `notFound()` лише повертає `null`
> - [ ] Редирект на головну сторінку застосунку
>
> **Пояснення:** `notFound()` кидає спеціальну помилку, яку перехоплює межа `not-found`, а не `error.tsx`. Код після виклику не виконується, тож `post` нижче вже точно не `undefined`.

> [!quiz] Неавторизований користувач бачить «Помилка» замість переходу на `/login`. Чому?
> level: junior · skill: routing · diff: 3 · id: nextjs-pl-routing-junior-06
>
> ```tsx
> try {
>   const user = await getUser()
>   if (!user) redirect('/login')
>   return <Profile user={user} />
> } catch {
>   return <p>Помилка</p>
> }
> ```
>
> - [ ] `redirect` працює лише в Client Components, а тут Server Component
> - [ ] Бракує `return` перед `redirect('/login')`, тож рендер іде далі
> - [x] `catch` перехоплює виняток з `redirect()`
> - [ ] `redirect` працює лише в `proxy.ts`
>
> **Пояснення:** `redirect()` і `notFound()` працюють через виняток — так Next.js перериває рендер. Загальний `catch` ковтає його, і редиректу не стається. `return` не потрібен: функція й так не повертає керування.

> [!quiz] Фільтр каталогу живе в `?sort=price`. Де його можна прочитати пропом `searchParams`?
> level: junior · skill: routing · diff: 3 · id: nextjs-pl-routing-junior-07
> - [ ] І в `layout.tsx`, і в `page.tsx` цього сегмента
> - [ ] Лише в `layout.tsx`, бо він обгортає всі сторінки
> - [ ] Ніде: query-параметри доступні лише в `proxy.ts`
> - [x] Лише в `page.tsx`; у Client Component — через хук
>
> **Пояснення:** layout не перерендерюється при навігації, тож `searchParams` у ньому швидко застаріли б — документація прямо каже, що layout їх не отримує. `page.tsx` отримує `searchParams` як Promise, а Client Component читає їх хуком.

## rendering

> [!quiz] Server Component сторінки статті імпортує велику бібліотеку для розбору Markdown. Чи потрапить вона в клієнтський JS?
> level: junior · skill: rendering · diff: 1 · id: nextjs-pl-rendering-junior-01
> - [x] Ні: імпорти Server Component лишаються на сервері
> - [ ] Так: усі npm-пакети з `package.json` потрапляють у бандл
> - [ ] Так, але лише після hydration сторінки в браузері
> - [ ] Ні, але тільки якщо сторінка статична, а не динамічна
>
> **Пояснення:** одна з головних переваг Server Components: важкі залежності рендерять HTML на сервері й не збільшують бандл. У клієнтський граф модуль потрапляє лише через імпорт із файлу з `'use client'`.

> [!quiz] Що станеться на цій сторінці?
> level: junior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-junior-02
>
> ```tsx
> // app/page.tsx — Server Component
> import { Button } from './button' // 'use client'
>
> export default function Page() {
>   return <Button onClick={() => console.log('клік')}>Купити</Button>
> }
> ```
>
> - [ ] Працюватиме: лог зʼявиться в консолі браузера
> - [x] Помилка: функцію не передати в Client Component
> - [ ] Працюватиме: лог зʼявиться в терміналі сервера при кліку
> - [ ] Кнопка відрендериться, але клік ігноруватиметься без помилки
>
> **Пояснення:** props через межу серверного й клієнтського мають бути серіалізованими, а звичайна функція — ні: React покаже помилку `Event handlers cannot be passed to Client Component props`. Обробник визначають усередині Client Component; виняток — Server Actions, які передаються як посилання.

> [!quiz] `button.tsx` має `'use client'` і імпортує `formatPrice` з `lib/format.ts` (без директиви). Де опиниться код `formatPrice`?
> level: junior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-junior-03
> - [ ] Лише на сервері
> - [ ] Ніде: імпорт без директиви в client-файлі — помилка збірки
> - [x] У клієнтському бандлі
> - [ ] У бандлі, лише якщо `formatPrice` використовує `useState`
>
> **Пояснення:** `'use client'` — межа в графі модулів: файл з директивою і всі його імпорти потрапляють у клієнтський JS. Тому межу ставлять якомога нижче, а модулі з секретами позначають `import 'server-only'`.

> [!quiz] Client Component `Modal` отримує Server Component `Cart` через `children`. Де виконується `Cart`?
> level: junior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-junior-04
>
> ```tsx
> // app/page.tsx — Server Component
> <Modal>
>   <Cart />
> </Modal>
> ```
>
> - [ ] У браузері: усе всередині Client Component стає клієнтським
> - [x] На сервері: `Modal` отримує готовий результат
> - [ ] Ніде: Server Component не можна вкладати в Client Component
> - [ ] І там, і там: React рендерить його двічі
>
> **Пояснення:** клієнтським стає те, що **імпортує** client-модуль, а не те, що рендериться всередині нього. Тут `Cart` імпортує й рендерить серверна сторінка, тож `Modal` отримує готовий React-елемент. Імпорт `Cart` прямо у файлі `modal.tsx` зробив би його клієнтським.

> [!quiz] Чому Client Component падає на сервері з `ReferenceError: window is not defined`?
> level: junior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-junior-05
>
> ```tsx
> 'use client'
>
> export function Width() {
>   return <p>Ширина: {window.innerWidth}</p>
> }
> ```
>
> - [x] Client Component теж рендериться на сервері, де немає `window`
> - [ ] `'use client'` має стояти після імпортів, а не першим рядком
> - [ ] `window` доступний лише в Server Components
> - [ ] Next.js блокує глобальні змінні браузера в компонентах
>
> **Пояснення:** для першого заходу Next.js рендерить Client Components на сервері (SSR), а лише потім гідратує їх у браузері. Браузерні API читають в `useEffect` чи в обробниках подій — вони виконуються лише в браузері.

> [!quiz] `app/shop/layout.tsx` робить `await getUser()` (2 с), поруч лежить `app/shop/loading.tsx`. Що бачить користувач ці 2 секунди при першому заході на `/shop`? (`cacheComponents` вимкнено, вище немає жодних `loading.tsx` чи `<Suspense>`.)
> level: junior · skill: rendering · diff: 3 · id: nextjs-pl-rendering-junior-06
> - [ ] `loading.tsx` замість усього сегмента разом із layout
> - [ ] Layout без даних
> - [ ] Помилку збірки: в async layout не можна робити `await`
> - [x] Порожню сторінку: `loading.tsx` не покриває layout
>
> **Пояснення:** ієрархія сегмента — `layout → template → error → loading → not-found → page`: межа Suspense з `loading.tsx` лежить **усередині** layout. Тому повільний `await` у layout блокує свій сегмент разом з fallback, а без меж вище браузер не отримує нічого — порожня сторінка. Його переносять у дочірній компонент під `<Suspense>` або в `loading.tsx` батьківського сегмента.

> [!quiz] Яка межа покаже fallback, якщо `page.tsx` у `app/blog/` кине помилку, а поруч є `error.tsx`?
> level: junior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-junior-07
> - [ ] `app/error.tsx`: помилки сторінок завжди йдуть у root
> - [ ] `global-error.tsx`: інших меж для сторінок немає
> - [x] `app/blog/error.tsx`: межа обгортає сторінку сегмента
> - [ ] Жодна: `error.tsx` ловить лише помилки в браузері
>
> **Пояснення:** `error.tsx` обгортає `page` (і вкладені сегменти) свого рівня, тож помилку сторінки ловить найближчий. Він ловить і помилки рендеру Server Components — у продакшні з загальним текстом і `digest` замість справжнього повідомлення. `global-error.tsx` — для помилок самого root layout.

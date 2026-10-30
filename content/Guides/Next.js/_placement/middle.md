---
title: Вступний тест — банк middle
placement: true
level: middle
---

# Вступний тест — банк middle

Калібрований банк питань рівня **middle** для вступного тесту курсу «Next.js Zero → Pro». Це не стаття: компілятор
додає ці питання лише до вступного тесту. `diff`: 1 — легке для рівня, 2 — типове, 3 — на межі senior. Орієнтир рівня:
розуміє кеш і ревалідацію, стрімінг, Server Actions з валідацією; знаходить водоспад чи помилку hydration. Базова
конфігурація прикладів — `cacheComponents: true`, якщо не сказано інше.

## foundations

> [!quiz] Компонент підписується на події WebSocket в ефекті. Що має повернути ефект?
> level: middle · skill: foundations · diff: 1 · id: nextjs-pl-foundations-middle-01
>
> ```tsx
> useEffect(() => {
>   const socket = connect(roomId)
>   socket.on('message', addMessage)
>   // ?
> }, [roomId])
> ```
>
> - [ ] Нічого: React сам закриє зʼєднання
> - [ ] `socket`, щоб React зберіг його між рендерами й не створював знову
> - [ ] `false`, щоб ефект не запускався вдруге при зміні `roomId`
> - [x] Функцію cleanup, що закриває зʼєднання
>
> **Пояснення:** cleanup — дзеркало ефекту: що ефект відкрив, те cleanup закриває (`return () => socket.close()`). Без нього при зміні кімнати лишаться дві підписки, і повідомлення зі старої кімнати потраплять у нову.

> [!quiz] Лічильник зупиняється на 1 і далі не росте. Чому?
> level: middle · skill: foundations · diff: 2 · id: nextjs-pl-foundations-middle-02
>
> ```tsx
> const [count, setCount] = useState(0)
>
> useEffect(() => {
>   const id = setInterval(() => setCount(count + 1), 1000)
>   return () => clearInterval(id)
> }, [])
> ```
>
> - [ ] `setInterval` не працює всередині `useEffect`, потрібен `useInterval`
> - [x] Колбек замкнув `count` з першого рендеру і щоразу ставить 1
> - [ ] `clearInterval` у cleanup одразу зупиняє таймер після першого тіку
> - [ ] React групує оновлення з таймера й виконує лише перше з них
>
> **Пояснення:** з `[]` ефект запускається один раз, і функція всередині бачить лише той знімок state, у якому її створили (stale closure). Функціональне оновлення читає актуальне значення без залежності від `count`. Додати `count` у залежності теж спрацює, але таймер перестворюватиметься щосекунди.

> [!quiz] Що доступне в гілці `else`?
> level: middle · skill: foundations · diff: 2 · id: nextjs-pl-foundations-middle-03
>
> ```ts
> type Result =
>   | { ok: true; data: string[] }
>   | { ok: false; error: string }
>
> function show(r: Result) {
>   if (r.ok) return r.data.length
>   else return /* ? */
> }
> ```
>
> - [x] `r.error`
> - [ ] Лише `r.ok`: TypeScript не звужує обʼєкти за значенням поля
> - [ ] І `r.data`, і `r.error`: обидва поля є в union
> - [ ] Нічого без явного `as { ok: false; error: string }`
>
> **Пояснення:** discriminated union — union обʼєктів зі спільним полем-літералом. Після `if (r.ok)` TypeScript знає, що в `else` лишився лише `{ ok: false; error: string }`. Так зручно типізувати результат Server Action: успіх з даними або помилка з повідомленням.

> [!quiz] Яке оголошення спіймає одруківку `routes.hmoe` і водночас перевірить, що всі значення — рядки?
> level: middle · skill: foundations · diff: 2 · id: nextjs-pl-foundations-middle-04
> - [ ] `const routes: Record<string, string> = { home: '/', blog: '/blog' }`
> - [ ] `const routes = { home: '/', blog: '/blog' } as Record<string, string>`
> - [ ] `const routes = { home: '/', blog: '/blog' }` — TypeScript і так усе перевірить
> - [x] `const routes = { home: '/', blog: '/blog' } satisfies Record<string, string>`
>
> **Пояснення:** `satisfies` перевіряє значення на відповідність типу, але зберігає точний виведений тип з ключами `home` і `blog`, тож `routes.hmoe` — помилка. Анотація `Record<string, string>` і `as` розширюють тип до «будь-який рядковий ключ»: одруківка пройде. Без нічого ключі збережуться, але перевірки значень не буде.

> [!quiz] Форма надсилає `POST /checkout`, сервер відповідає `307` з `Location: /thanks`. Що зробить браузер?
> level: middle · skill: foundations · diff: 2 · id: nextjs-pl-foundations-middle-05
> - [ ] Зробить `GET /thanks`
> - [ ] Покаже сторінку `/checkout` і проігнорує `Location`
> - [ ] Закешує редирект назавжди
> - [x] Повторить `POST` з тим самим тілом на `/thanks`
>
> **Пояснення:** `307` (і `308`) обіцяють зберегти метод і тіло. Щоб після форми браузер перейшов на сторінку через `GET`, потрібен `303 See Other` — саме його Next.js віддає для `redirect()` у Server Action при відправці форми без JS. Назавжди кешують постійні редиректи (`308`, `301`), а не `307`.

> [!quiz] Cookie сесії має `SameSite=Lax`. Коли браузер **надішле** її на `shop.com`?
> level: middle · skill: foundations · diff: 3 · id: nextjs-pl-foundations-middle-06
> - [ ] Коли сторінка `evil.com` автоматично відправляє приховану форму `POST` на `shop.com/transfer`
> - [x] Коли користувач переходить на `shop.com` за звичайним посиланням з `evil.com`
> - [ ] Коли `evil.com` робить `fetch('https://shop.com/api', { credentials: 'include' })`
> - [ ] Ніколи, якщо запит ініційовано з іншого сайту
>
> **Пояснення:** `Lax` пропускає cookie лише на навігації верхнього рівня безпечним методом (перехід за посиланням `GET`), але не на міжсайтових `POST` і фонових запитах. Тому `Lax` за замовчуванням закриває класичний CSRF через форму. `Strict` не надіслав би cookie навіть на перехід за посиланням.

> [!quiz] Користувач швидко клікає профілі 1 → 2 → 3, а на екрані іноді лишається профіль 2. Що виправить баг?
> level: middle · skill: foundations · diff: 3 · id: nextjs-pl-foundations-middle-07
>
> ```tsx
> useEffect(() => {
>   fetch(`/api/users/${id}`)
>     .then((r) => r.json())
>     .then(setUser)
> }, [id])
> ```
>
> - [x] Скасовувати застарілий запит у cleanup
> - [ ] Прибрати `id` із залежностей, щоб ефект не перезапускався
> - [ ] Замінити `.then` на `async/await`, щоб відповіді йшли по черзі
> - [ ] Обгорнути `setUser` в `useCallback`
>
> **Пояснення:** відповіді приходять не в тому порядку, у якому пішли запити: відповідь для 2 може прийти після відповіді для 3 (race condition). Cleanup попереднього запуску позначає старий запит як неактуальний. `async/await` нічого не змінює в порядку, а без `id` у залежностях профіль узагалі не оновиться.

## routing

> [!quiz] Фото відкривається модалкою через `@modal/(.)photo/[id]`. Що побачить користувач, якщо оновить сторінку на `/photo/7`?
> level: middle · skill: routing · diff: 1 · id: nextjs-pl-routing-middle-01
> - [x] Повну сторінку `app/photo/[id]/page.tsx`
> - [ ] Ту саму модалку поверх стрічки
> - [ ] 404: адреса `/photo/7` існує лише як модалка
> - [ ] Модалку без фону, бо стрічка під нею не завантажилась
>
> **Пояснення:** intercepting route підміняє маршрут лише при клієнтській навігації зсередини застосунку. Reload чи відкрите посилання — hard navigation: Next.js рендерить справжню сторінку `photo/[id]`, а слот `@modal` бере свій `default.tsx`. Тому для модалки з URL потрібні обидві сторінки.

> [!quiz] Застосунок зібрано й запущено (`next start`). У `app/dashboard/` є слот `@team` лише з `page.tsx`, без `default.tsx`. Користувач оновлює сторінку на `/dashboard/settings`. Що він побачить?
> level: middle · skill: routing · diff: 2 · id: nextjs-pl-routing-middle-02
> - [x] 404 для всього маршруту: вбудований `default` викликає `notFound()`
> - [ ] Сторінку налаштувань, а слот `@team` покаже свій останній стан
> - [ ] Сторінку налаштувань з порожнім місцем замість `@team`
> - [ ] `500`: Next.js не знає, що рендерити в слоті без збігу
>
> **Пояснення:** на soft navigation слот зберігає активний стан, а на hard navigation (reload) йому потрібен `default.tsx`. Документація 16 обіцяє помилку збірки без нього, але на 16.3.8 збірка проходить, а Next.js підставляє вбудований `default` з `notFound()` (тема 05 «Parallel і intercepting routes», врізка «Розбіжність з документацією»). Тож `default.tsx` додають у кожен слот самі.

> [!quiz] `app/dashboard/layout.tsx` кидає помилку під час рендеру. Поруч лежить `app/dashboard/error.tsx`, а в корені — `app/error.tsx`. Хто покаже fallback?
> level: middle · skill: routing · diff: 2 · id: nextjs-pl-routing-middle-03
> - [ ] `app/dashboard/error.tsx` — він найближчий до layout
> - [ ] `global-error.tsx`, бо помилка сталася в layout
> - [x] `app/error.tsx`
> - [ ] Жодна: помилки layout не ловляться, застосунок падає
>
> **Пояснення:** ієрархія — `layout → template → error → loading → not-found → page`: `error.tsx` обгортає вміст **під** layout. Помилку layout ловить межа батьківського сегмента. `global-error.tsx` потрібен для помилок самого root layout.

> [!quiz] `cacheComponents: true`. Що станеться з цим маршрутом під час `next build`?
> level: middle · skill: routing · diff: 2 · id: nextjs-pl-routing-middle-04
>
> ```tsx
> // app/blog/[slug]/page.tsx
> export async function generateStaticParams() {
>   return [] // усі пости — на першому запиті
> }
> ```
>
> - [ ] Нічого не пререндериться, а сторінки згенеруються на першому запиті
> - [ ] Next.js пререндерить одну сторінку з порожнім `slug`
> - [x] Збірка впаде: потрібен хоча б один набір params
> - [ ] Маршрут почне віддавати 404 для всіх постів
>
> **Пояснення:** порожній масив — прийом зі старої моделі («усе на першому запиті»). З Cache Components він дає помилку збірки (`empty-generate-static-params`): Next.js потрібен хоча б один зразок, щоб перевірити маршрут і пререндерити shell. Невідомі params потім рендеряться на запит, якщо `await params` стоїть усередині `<Suspense>`.

> [!quiz] У Client Component викликали `router.refresh()`. Що з цього правда?
> level: middle · skill: routing · diff: 2 · id: nextjs-pl-routing-middle-05
> - [ ] Сторінка повністю перезавантажиться, як `window.location.reload()`
> - [x] Прийде новий RSC payload, `useState` збережеться
> - [ ] Інвалідується серверний кеш `'use cache'` для цього маршруту
> - [ ] Оновляться всі маршрути в Client Cache
>
> **Пояснення:** `router.refresh()` перерендерює Server Components поточного маршруту й домержує результат у живе дерево. Серверний кеш він не чіпає: результат `'use cache'` лишиться, доки його не ревалідують. Скинути серверний кеш — справа `revalidateTag`/`updateTag`/`revalidatePath` (тема 04 «Навігація під капотом»).

> [!quiz] Яку адресу перехоплює `app/feed/@modal/(..)photo/[id]/page.tsx`?
> level: middle · skill: routing · diff: 3 · id: nextjs-pl-routing-middle-06
> - [ ] `/feed/photo/[id]`: `(..)` веде з `@modal` на рівень `feed`
> - [ ] `/feed/@modal/photo/[id]`, бо слот — частина шляху
> - [x] `/photo/[id]`
> - [ ] Жодну: intercepting routes не працюють усередині слотів
>
> **Пояснення:** маркери `(.)`, `(..)`, `(...)` рахують **сегменти маршруту**, а не папки. `@slot` і route groups сегментами не є. Тут `photo` на один сегмент вище за `feed`, хоча у файловій системі — на два рівні.

> [!quiz] Server Component сторінки викликає `redirect('/login')` до будь-якого `await` чи `<Suspense>`. Який статус побачить `curl -I`?
> level: middle · skill: routing · diff: 2 · id: nextjs-pl-routing-middle-07
> - [ ] `302 Found`
> - [x] `307 Temporary Redirect`
> - [ ] `301 Moved Permanently`
> - [ ] `200`, а редирект зробить JavaScript у браузері
>
> **Пояснення:** `redirect()` за замовчуванням дає `307`, `permanentRedirect()` — `308`: на відміну від `302`/`301`, вони зберігають метод. Клієнтський редирект через `<meta>` буває, лише коли стрімінг уже почався, а `303` — у Server Action при відправці форми.

## rendering

> [!quiz] Що лежить у RSC payload сторінки?
> level: middle · skill: rendering · diff: 1 · id: nextjs-pl-rendering-middle-01
> - [ ] Вихідний код Server Components, щоб браузер міг їх перевиконати
> - [ ] Лише JSON з даними, отриманими через `fetch` на сервері
> - [x] Результат Server Components і посилання на Client Components з їхніми props
> - [ ] Готовий HTML сторінки, стиснутий в інший формат для навігації
>
> **Пояснення:** RSC payload — серіалізований опис дерева: результати Server Components, «дірки» для Client Components з посиланнями на їхній код і серіалізовані props. З нього будують HTML першого заходу, ним гідратують дерево й саме його завантажують при клієнтській навігації. Тому все, що ти передаєш у props Client Component, видно в payload.

> [!quiz] Цей Client Component дає помилку hydration. Чому?
> level: middle · skill: rendering · diff: 2 · id: nextjs-pl-rendering-middle-02
>
> ```tsx
> 'use client'
>
> export function Clock() {
>   return <time>{new Date().toLocaleTimeString()}</time>
> }
> ```
>
> - [ ] `<time>` не можна рендерити в Client Component без атрибута `dateTime`
> - [ ] `toLocaleTimeString` недоступний на сервері, тож там рядок порожній
> - [ ] Бракує `key` у `<time>`
> - [x] Сервер і браузер рендерять різний текст
>
> **Пояснення:** hydration очікує, що перший рендер у браузері збігається з HTML сервера. Час, `Math.random()`, перевірки `typeof window` у рендері ламають це. Виправлення — показувати значення після монтування (ефект), рендерити його на сервері й передавати як prop або, для свідомих відмінностей, `suppressHydrationWarning` на цьому елементі.

> [!quiz] `cacheComponents: true`. Що скаже Next.js про цю сторінку?
> level: middle · skill: rendering · diff: 2 · id: nextjs-pl-rendering-middle-03
>
> ```tsx
> // app/account/page.tsx
> import { cookies } from 'next/headers'
>
> export default async function Page() {
>   const theme = (await cookies()).get('theme')?.value
>   return <Dashboard theme={theme} />
> }
> ```
>
> - [ ] Нічого: сторінка просто стане динамічною
> - [x] Помилка: cookies прочитано поза `<Suspense>`
> - [ ] Сторінку закешують з cookie першого відвідувача для всіх
> - [ ] `cookies()` під Cache Components завжди повертає порожнє сховище
>
> **Пояснення:** з Cache Components Next.js пререндерить static shell і вимагає явного рішення для всього, що залежить від запиту: обгорнути його в `<Suspense>` (стрімінг) або винести персональне в дочірній компонент під `<Suspense>`, а решту закешувати (`'use cache'`). Автоматичного «маршрут став динамічним» більше немає — це було поведінкою без Cache Components.

> [!quiz] Сторінка рендерить `<Suspense>`, а всередині компонент робить `await getPost()` і викликає `notFound()`, якщо поста немає. Що отримає пошуковий робот для неіснуючого поста?
> level: middle · skill: rendering · diff: 2 · id: nextjs-pl-rendering-middle-04
> - [x] `200 OK` і `<meta name="robots" content="noindex">`
> - [ ] `404 Not Found` і сторінку `not-found.tsx`, як без стрімінгу
> - [ ] `500`, бо `notFound()` після початку стріму — помилка сервера
> - [ ] `302` на сторінку 404, яку Next.js згенерував заздалегідь
>
> **Пояснення:** стрімінг почався, щойно відрендерився fallback, а статус і заголовки йдуть з першим шматком — змінити їх уже не можна. Next.js вставляє `noindex`, щоб сторінку не проіндексували. Справжній `404` — коли `notFound()` спрацьовує до будь-якого `await` чи `<Suspense>`.

> [!quiz] Server Component впав через тимчасову помилку API. Кнопка в `error.tsx` викликає `reset()`, але помилка лишається. Що викликати замість нього?
> level: middle · skill: rendering · diff: 2 · id: nextjs-pl-rendering-middle-05
> - [x] `retry()`
> - [ ] `router.push(pathname)` — інакше Server Components не перевиконаються
> - [ ] `window.location.reload()` — єдиний спосіб для серверних помилок
> - [ ] `reset()` двічі: перший виклик лише ставить повтор у чергу
>
> **Пояснення:** з 16.3 `error.tsx` отримує стабільний `retry()`: перезапит і ререндер у Transition. `reset()` перерендерює дітей з тим самим payload, тож помилка Server Component повториться. Документація радить `retry()` у більшості випадків.

> [!quiz] `cacheComponents: true`. Client Component з `useSearchParams()` рендериться прямо в `page.tsx` без `<Suspense>`. Що буде?
> level: middle · skill: rendering · diff: 3 · id: nextjs-pl-rendering-middle-06
> - [ ] Нічого: `useSearchParams` — клієнтський хук
> - [ ] Сторінка автоматично рендеритиметься лише в браузері
> - [ ] `useSearchParams` поверне `null` до hydration без жодних попереджень
> - [x] Помилка: URL-дані прочитано поза `<Suspense>`
>
> **Пояснення:** Client Components теж пререндеряться на сервері, а `searchParams` відомі лише під час запиту. Під Cache Components `useSearchParams` завжди потребує межі `<Suspense>` — fallback потрапить у static shell, а компонент з параметрами дорендериться пізніше.

> [!quiz] `cacheComponents: true`. Що станеться з цим кодом під час `next build`?
> level: middle · skill: rendering · diff: 3 · id: nextjs-pl-rendering-middle-07
>
> ```tsx
> export default function Page() {
>   return <Suspense fallback={<p>…</p>}><Now /></Suspense>
> }
>
> async function Now() {
>   return <p>{new Date().toISOString()}</p>
> }
> ```
>
> - [ ] Нічого особливого: у shell потрапить час збірки
> - [ ] Нічого особливого: `<Suspense>` сам виключає `Now` з shell, тож час буде свіжий на кожен запит
> - [x] Помилка збірки: потрібен `io()` або `'use cache'`
> - [ ] Помилка hydration у браузері, бо час на сервері й клієнті різний
>
> **Пояснення:** `<Suspense>` дає місце для стріму, але `Now` нічого не чекає: без маркера Next.js не знає, захопити час у shell чи рахувати на кожен запит, і зупиняє збірку. `io()` з `next/cache` (16.3; документація радить його замість `connection()`) призупиняє пререндер, тож час рахується на запит, а `'use cache'` свідомо захоплює значення в shell.

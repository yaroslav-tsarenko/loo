---
title: Вступний тест — банк senior
placement: true
level: senior
---

# Вступний тест — банк senior

Калібрований банк питань рівня **senior** для вступного тесту курсу «Next.js Zero → Pro». Це не стаття: компілятор
додає ці питання лише до вступного тесту. `diff`: 1 — легке для рівня, 2 — типове, 3 — на межі god. Орієнтир рівня:
проєктує кешування й межі компонентів, безпеку, продуктивність, розбирає продакшн-інциденти. Базова конфігурація
прикладів — `cacheComponents: true`, якщо не сказано інше.

## foundations

> [!quiz] Сторінка кабінету показує імʼя користувача. Який `Cache-Control` не дасть CDN віддати її іншій людині, але дозволить браузеру зберегти копію?
> level: senior · skill: foundations · diff: 1 · id: nextjs-pl-foundations-senior-01
> - [ ] `public, max-age=60`
> - [x] `private, max-age=60`
> - [ ] `s-maxage=60` — термін лише для спільних кешів
> - [ ] `no-cache` — CDN тоді взагалі не зберігає відповідь
>
> **Пояснення:** `private` дозволяє лише кеш конкретного браузера, спільні кеші (CDN, проксі) таку відповідь не зберігають. `public` і `s-maxage` якраз дозволяють спільний кеш — класичний інцидент «користувач побачив чужий кабінет». `no-cache` не забороняє зберігати навіть у CDN, лише вимагає перевірки перед використанням.

> [!quiz] У `next dev` чат відкриває два WebSocket-зʼєднання, у продакшні — одне. Що найімовірніше не так?
> level: senior · skill: foundations · diff: 2 · id: nextjs-pl-foundations-senior-02
>
> ```tsx
> useEffect(() => {
>   const ws = new WebSocket(url)
>   ws.onmessage = (e) => push(e.data)
> }, [url])
> ```
>
> - [ ] У dev Next.js рендерить кожен компонент на двох серверах паралельно
> - [x] Бракує cleanup, а Strict Mode монтує ефект двічі
> - [ ] Треба вимкнути `reactStrictMode`
> - [ ] Треба перенести `new WebSocket(url)` у тіло компонента
>
> **Пояснення:** подвійний запуск ефектів у dev — перевірка, що cleanup повністю скасовує ефект. Тут його немає, тож у продакшні той самий витік зʼявиться при кожній зміні `url` чи розмонтуванні. Виправлення — `return () => ws.close()`, а не вимикати Strict Mode.

> [!quiz] Що гарантує TypeScript у цьому коді під час виконання?
> level: senior · skill: foundations · diff: 2 · id: nextjs-pl-foundations-senior-03
>
> ```ts
> type User = { id: string; email: string; role: 'admin' | 'user' }
>
> const user = (await res.json()) as User
> if (user.role === 'admin') grantAccess()
> ```
>
> - [ ] Що `user` має всі три поля
> - [ ] Що `role` — лише `'admin'` або `'user'`, інакше буде `TypeError`
> - [ ] Що зайві поля з відповіді буде відкинуто під час приведення
> - [x] Нічого: `as` не перевіряє дані
>
> **Пояснення:** типи стираються після компіляції, а `as` — твердження без перевірки. На межі системи (API, форма, `params`, вебхук) дані — `unknown`, поки їх не розібрала схема. Для рішень про доступ це критично: зламаний чи підроблений JSON пройде як `User`.

> [!quiz] Який варіант компілюється з `strict: true` (як у шаблоні `create-next-app`) без `any`?
> level: senior · skill: foundations · diff: 2 · id: nextjs-pl-foundations-senior-04
> - [x] `catch (e) { log(e instanceof Error ? e.message : String(e)) }`
> - [ ] `catch (e) { log(e.message) }`
> - [ ] `catch (e: Error) { log(e.message) }`
> - [ ] `catch (e: unknown) { log(e.message) }`
>
> **Пояснення:** зі `strict` змінна `catch` має тип `unknown` (`useUnknownInCatchVariables`), бо кинути можна будь-що — рядок, обʼєкт, `undefined`. Анотацію `catch` можна дати лише `unknown` чи `any`: `Error` заборонено, а з `unknown` читати `.message` без звуження не можна. `any` скомпілюється, але вимикає перевірку замість того, щоб звузити тип. Звуження через `instanceof` — чесний шлях.

> [!quiz] CDN отримав відповідь з `Cache-Control: s-maxage=60, stale-while-revalidate=300`. Через 2 хвилини приходить запит. Що станеться?
> level: senior · skill: foundations · diff: 2 · id: nextjs-pl-foundations-senior-05
> - [ ] Піде на origin і змусить користувача чекати свіжу відповідь
> - [ ] Поверне `504`, бо копія протухла понад 60 секунд тому
> - [x] Віддасть застарілу копію і оновить її у фоні
> - [ ] Віддасть копію, але вже ніколи її не оновить без purge
>
> **Пояснення:** перші 60 с копія свіжа, наступні 300 с — «застаріла, але придатна»: її віддають миттєво, а оновлення йде у фоні. Користувач не чекає на origin, а наступний запит отримає оновлене. Після 360 с копію вже доведеться перевіряти синхронно.

> [!quiz] Навіщо в цьому `switch` гілка `default` з `never`?
> level: senior · skill: foundations · diff: 3 · id: nextjs-pl-foundations-senior-06
>
> ```ts
> type Status = 'draft' | 'published' | 'archived'
>
> function badge(s: Status) {
>   switch (s) {
>     case 'draft': return 'Чернетка'
>     case 'published': return 'Опубліковано'
>     case 'archived': return 'В архіві'
>     default: { const _exhaustive: never = s; return _exhaustive }
>   }
> }
> ```
>
> - [ ] Щоб функція могла повертати `undefined` для нових статусів
> - [x] Щоб збірка впала, коли в `Status` зʼявиться необроблений варіант
> - [ ] Щоб TypeScript дозволив передавати рядки поза union
> - [ ] Щоб рушій JavaScript пришвидшив `switch` у рантаймі
>
> **Пояснення:** після трьох `case` тип `s` звужується до `never`. Якщо додати `'scheduled'`, у `default` лишиться `'scheduled'`, а його не можна присвоїти `never`, — помилка компіляції в кожному незавершеному `switch`. Це exhaustive check: компілятор нагадує про нові статуси замість тихого `undefined` у продакшні.

> [!quiz] Tooltip позиціюється в ефекті за `getBoundingClientRect()`, і користувачі бачать, як він «стрибає» з кута на місце. Що допоможе?
> level: senior · skill: foundations · diff: 3 · id: nextjs-pl-foundations-senior-07
> - [ ] `useMemo` замість `useEffect`, щоб порахувати позицію під час рендеру
> - [x] `useLayoutEffect`: він виконується до того, як браузер намалює кадр
> - [ ] `setTimeout(…, 0)` усередині `useEffect`, щоб дочекатися layout
> - [ ] Перенести вимірювання в Server Component, щоб позиція прийшла в HTML
>
> **Пояснення:** `useEffect` зазвичай спрацьовує вже після відмальовки, тож користувач бачить проміжний стан. `useLayoutEffect` блокує відмальовку до кінця вимірювання й нового `setState`. Ціна — блокування кадру, тому лише для вимірювань. Сервер розмірів DOM не знає, а `setTimeout` зробить стрибок ще помітнішим.

## routing

> [!quiz] Перевірка входу є лише в `proxy.ts` з `matcher: ['/dashboard/:path*']`. Server Action `deleteAccount` використовується на сторінці `/settings`. Що з цього правда?
> level: senior · skill: routing · diff: 1 · id: nextjs-pl-routing-senior-01
> - [x] Дія не захищена: це `POST` на `/settings`, а matcher його не покриває
> - [ ] Дія захищена: Server Actions завжди проходять через Proxy
> - [ ] Дія захищена, бо Server Actions доступні лише залогіненим
> - [ ] Дія недоступна: Proxy блокує все, що не в matcher
>
> **Пояснення:** документація Proxy прямо попереджає: matcher, що не покриває шлях, пропускає й виклики Server Functions на ньому, а рефакторинг може тихо зняти захист. Proxy — лише оптимістична перевірка (редирект на логін). Автентифікацію й авторизацію перевіряють усередині кожної дії та в шарі доступу до даних.

> [!quiz] Proxy додає внутрішній заголовок з id користувача для Server Components. Що не так?
> level: senior · skill: routing · diff: 2 · id: nextjs-pl-routing-senior-02
>
> ```ts
> // proxy.ts
> export function proxy(request: NextRequest) {
>   const headers = new Headers(request.headers)
>   headers.set('x-user-id', getUserId(request))
>   return NextResponse.next({ headers })
> }
> ```
>
> - [ ] Нічого: Server Components прочитають заголовок через `headers()`
> - [ ] Proxy не може змінювати заголовки
> - [x] `{ headers }` віддає заголовки клієнту, а не застосунку
> - [ ] Треба повернути `new Response(null, { headers })` замість `next()`
>
> **Пояснення:** два різні канали: `request.headers` — для коду застосунку «вище за течією», `headers` — у відповідь браузеру. Тут внутрішній id витікає клієнту, а Server Components його не побачать. Ще одна пастка — великі заголовки можуть дати `431`.

> [!quiz] Після logout через `router.push('/login')` новий користувач на спільному компʼютері відкриває «Назад» і бачить чернетку попереднього. `cacheComponents: true`. Що сталося і як виправити?
> level: senior · skill: routing · diff: 2 · id: nextjs-pl-routing-senior-03
> - [ ] Браузер закешував HTML сторінки; потрібен `Cache-Control: no-store`
> - [x] Activity зберегла сторінку; logout — через `window.location.href`
> - [ ] Client Cache зберіг `useState` разом з RSC payload; треба вимкнути `staleTimes`
> - [ ] `router.push` не очищує cookies; треба `router.replace('/login')`
>
> **Пояснення:** з Cache Components до трьох маршрутів (разом із поточним) при навігації ховаються через `<Activity>` (`display: none`), а не розмонтовуються, тож стан форм переживає перехід. Client Cache зберігає payload, а не стан React. Повне перезавантаження знищує все клієнтське дерево (тема 04 «Навігація під капотом», розділ про Activity).

> [!quiz] Каталог має сітку з 50 карток `<Link prefetch={true} href={'/products/' + id}>`; сторінка товару читає склад на кожен запит. `partialPrefetching` вимкнено. Що побачить моніторинг після релізу?
> level: senior · skill: routing · diff: 2 · id: nextjs-pl-routing-senior-04
> - [ ] Нічого: `prefetch={true}` лише раніше стартує той самий запит, що й клік
> - [ ] Менше навантаження: сторінки товарів закешуються в CDN після prefetch
> - [ ] Помилки збірки: `prefetch={true}` несумісний з динамічними маршрутами
> - [x] Ріст серверних рендерів на кожне видиме посилання
>
> **Пояснення:** без Partial Prefetching `prefetch={true}` тягне повний маршрут з динамічними даними (`private, no-cache`), тож кожна прокрутка — десятки рендерів. За замовчуванням prefetch бере лише закешовану частину. `next dev` про це попереджає: «encountered dynamic data during prefetching» (тема 04 «Навігація під капотом»).

> [!quiz] Аналітика «перегляд сторінки» рахує в кілька разів більше переглядів, ніж реальних візитів. Код у `app/pricing/layout.tsx`, `cacheComponents` вимкнено. Чому?
> level: senior · skill: routing · diff: 2 · id: nextjs-pl-routing-senior-05
>
> ```tsx
> export default async function Layout({ children }: { children: React.ReactNode }) {
>   await trackPageView('/pricing') // запис в аналітику
>   return <section>{children}</section>
> }
> ```
>
> - [ ] Layout рендериться двічі через Strict Mode, і в продакшні теж
> - [ ] Кожен клік по `Link` рендерить layout тричі: для дерева, голови і сторінки
> - [x] Prefetch виконує layout без візиту
> - [ ] Боти не виконують JS
>
> **Пояснення:** prefetch — це справжній серверний рендер сегментів наперед, а побічні ефекти в тілі Server Component від візиту він не відрізняє. Перегляди рахують у браузері (ефект Client Component) або в дії, а не в рендері. Strict Mode подвоює рендер лише в dev.

> [!quiz] `next build` пройшов, обидва маршрути в таблиці, але після `next start` кожен URL — навіть `/` — віддає `500`. Яке дерево це дає на Next.js 16.3.8?
> level: senior · skill: routing · diff: 3 · id: nextjs-pl-routing-senior-06
> - [x] `app/p/[id]/page.tsx` і `app/p/[slug]/edit/page.tsx`
> - [ ] `app/shop/[id]/page.tsx` і `app/shop/[...slug]/page.tsx`
> - [ ] `app/(a)/about/page.tsx` і `app/about/layout.tsx`
> - [ ] `app/blog/[slug]/page.tsx` і `app/blog/new/page.tsx`
>
> **Пояснення:** різні імена динамічного сегмента на одному рівні (`[id]` і `[slug]`) збірка не ловить, а рантайм падає на кожному запиті: `You cannot use different slug names for the same dynamic path`. `[id]` поруч із `[...slug]` — різні види сегментів, конфлікту немає, а статичний `new` має пріоритет над `[slug]` (тема 01 «App Router, сегменти і спеціальні файли», врізка «Розбіжність»).

> [!quiz] `next.config.ts` має rewrite `/blog` → `/news`, сторінка лежить в `app/news/page.tsx`. Server Action після публікації викликає `revalidatePath('/blog')`, але сторінка не оновлюється. Чому?
> level: senior · skill: routing · diff: 3 · id: nextjs-pl-routing-senior-07
> - [x] Треба `revalidatePath('/news')`: кеш привʼязаний до файлу маршруту
> - [ ] `revalidatePath` не працює разом з rewrites, потрібен `revalidateTag`
> - [ ] Треба викликати `revalidatePath` двічі — для source і destination
> - [ ] `revalidatePath` для сторінок з rewrites діє лише після наступного деплою
>
> **Пояснення:** кеш привʼязаний до маршруту, який реально рендериться. Rewrite змінює лише те, що бачить користувач у адресному рядку, тож `/blog` для кешу не існує. Документація `revalidatePath` має окремий розділ саме про rewrites.

## rendering

> [!quiz] Що робить `suppressHydrationWarning` на `<p>`?
> level: senior · skill: rendering · diff: 1 · id: nextjs-pl-rendering-senior-01
> - [x] Приймає розбіжність лише цього елемента
> - [ ] Вимикає перевірку hydration для всього піддерева під елементом
> - [ ] Рендерить елемент лише в браузері
> - [ ] Ховає попередження, але React однаково перерендерить сторінку з нуля
>
> **Пояснення:** опція діє на один рівень — на сам елемент, не на дітей. React приймає DOM і відкидає свій варіант для цього елемента. Це інструмент для свідомих відмінностей (час, виправлений inline-скриптом до hydration), а не латка для недетермінованого рендеру.

> [!quiz] Server Component передає в Client Component обʼєкт користувача з бази. Що потрапить у браузер?
> level: senior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-senior-02
>
> ```tsx
> const user = await db.user.findUnique({ where: { id } }) // id, name, email, passwordHash, …
> return <Avatar user={user} /> // Avatar ('use client') показує лише user.name
> ```
>
> - [ ] Лише `name`: Next.js відкидає поля
> - [ ] Нічого чутливого: props Client Components не серіалізуються
> - [ ] Обʼєкт потрапить лише в серверний HTML, а не в RSC payload
> - [x] Увесь обʼєкт, зокрема `passwordHash`
>
> **Пояснення:** props через межу серіалізуються цілком: React не знає, які поля потрібні компоненту. Payload видно у вкладці Network і в HTML першого заходу. Передавай мінімальний DTO (`{ name }`), а вибірку роби в шарі доступу до даних (тема 07 «Server і Client Components»).

> [!quiz] `app/(app)/layout.tsx` на самому верху робить `const session = await getSession()` (читає cookies). Яка проблема з продуктивністю?
> level: senior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-senior-03
> - [ ] Жодної: layout рендериться один раз на сесію й кешується
> - [ ] Сесія разом з cookies потрапить у клієнтський бандл
> - [x] Увесь сегмент чекає на сесію, shell зникає
> - [ ] Layout перестане зберігати стан між сторінками свого сегмента
>
> **Пояснення:** `await` на верху layout блокує все під ним — і сторінки, і їхні fallback-и. Правило «push dynamic access down»: читати сесію в маленькому компоненті (аватар, меню) під `<Suspense>`, а layout лишити статичним. Під Cache Components такий layout без межі ще й дає помилку валідації.

> [!quiz] Локально сторінка стрімиться частинами, а за nginx у продакшні приходить лише цілком після найповільнішого запиту. Найімовірніша причина?
> level: senior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-senior-04
> - [ ] `next start` не підтримує стрімінг — він працює лише на Vercel
> - [ ] У продакшні `<Suspense>` вимикається для швидшого першого байта
> - [ ] Для стрімінгу потрібен HTTP/3, а nginx віддає HTTP/1.1
> - [x] nginx буферизує відповідь; потрібен `X-Accel-Buffering: no`
>
> **Пояснення:** reverse proxy за замовчуванням збирає відповідь цілком і лише потім віддає клієнту — для користувача це виглядає як «стрімінг не працює». Документація Next.js (streaming, self-hosting) радить `X-Accel-Buffering: no`; так само перевіряють CDN і компресію.

> [!quiz] Компонент під `<Suspense>` після `await` викликає `redirect('/login')`. Що отримає клієнт, який відкрив сторінку напряму?
> level: senior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-senior-05
> - [ ] `307` з `Location: /login`
> - [ ] `500`: `redirect()` після початку стріму заборонений
> - [x] `200` і клієнтський редирект у стрімі
> - [ ] `303`, бо стрім уже почався й метод треба змінити на GET
>
> **Пояснення:** статус і заголовки йдуть з першим шматком стріму, тож HTTP-редирект уже неможливий: документація каже, що `redirect()` посеред стріму стає клієнтським. Для ботів і кешів це `200`, тому редиректи за сесією роблять до стріму — у Proxy (оптимістично) або на верху сторінки до будь-якої межі.

> [!quiz] Межа помилок з бібліотеки (класовий `ErrorBoundary`) обгортає компонент, що викликає `notFound()`. Користувач бачить «Щось пішло не так» замість 404. Що допоможе?
> level: senior · skill: rendering · diff: 2 · id: nextjs-pl-rendering-senior-06
> - [ ] Перенести `notFound()` в `useEffect`, щоб межа його не бачила
> - [ ] Кидати `new Error('404')` замість `notFound()` і розбирати в межі
> - [ ] Обгорнути `notFound()` у `try/catch` усередині компонента
> - [x] `catchError` з `next/error`, що пропускає `notFound()` далі
>
> **Пояснення:** `notFound()` і `redirect()` працюють через спеціальні винятки, а звичайна межа React ловить усе підряд. `catchError` (стабільний з 16.3) розпізнає їх і пропускає, а ще скидає стан помилки при клієнтській навігації. `try/catch` проковтне виняток так само, як і чужий boundary.

> [!quiz] Client Component читає `process.env.API_KEY` (без префікса `NEXT_PUBLIC_`) і рендерить значення. Що спостерігається на Next.js 16.3.8 з Turbopack?
> level: senior · skill: rendering · diff: 3 · id: nextjs-pl-rendering-senior-07
> - [x] `undefined` у браузері, справжнє значення в HTML
> - [ ] Збірка падає: непублічні змінні в клієнтському коді заборонені
> - [ ] Next.js замінює змінну порожнім рядком усюди
> - [ ] Значення потрапляє в клієнтський JS-чанк відкритим текстом
>
> **Пояснення:** Client Component теж рендериться на сервері, а там `process.env.API_KEY` є, тож секрет потрапляє в HTML. У чанку лишається `process.env.API_KEY`, що в браузері дає `undefined` (і ще й hydration mismatch). Документація обіцяє заміну порожнім рядком, але на 16.3.8 її немає (тема 07 «Server і Client Components», врізка «Розбіжність»). Захист — `import 'server-only'` у модулях із секретами.

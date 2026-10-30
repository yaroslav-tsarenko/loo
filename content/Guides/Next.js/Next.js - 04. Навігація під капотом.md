---
title: Навігація під капотом
id: nextjs-core-04
slug: 04-navigation-internals
order: 4
level: middle
skill: routing
icon: px:compass
tags: [nextjs, navigation, link, prefetching, partial-prefetching, client-cache, activity, rsc]
prerequisites:
  - "[[Next.js Start - 08. Навігація]]"
  - "[[Next.js - 02. Layouts, templates і route groups]]"
estimatedMinutes: 50
nextVersion: 16.3.8
---

# Навігація під капотом

> [!success] 🎯 Після цього розділу ти зможеш
> - розповісти, що саме відбувається між кліком по `<Link>` і новим екраном: RSC payload, запити з `?_rsc=`, soft і hard navigation;
> - передбачити, що Next.js завантажить заздалегідь для посилання з будь-яким значенням `prefetch`, у dev і в продакшні;
> - пояснити Partial Prefetching і App Shell, а також segment config `prefetch = 'partial' | 'force-disabled'`;
> - сказати, коли навігація візьме сторінку з Client Cache, а коли піде на сервер (`staleTimes`, `cacheLife`, `router.refresh()`, `refresh()`);
> - керувати станом сторінок, які Next.js ховає через `<Activity>`: що зберігається, що скидається і як працює `bfcacheId`;
> - прочитати вкладку Network і знайти причину «повільної» навігації.

## 🤔 Передбач

> [!quiz] Скільки запитів піде на сервер у момент кліку?
> level: middle · type: output · id: nextjs-core-04-quiz-01
>
> Продакшн-збірка (`next build && next start`), `cacheComponents: true`. На головній є `<Link href="/blog">`, посилання видно на екрані вже кілька секунд. `app/blog/page.tsx` — статична сторінка без даних. Користувач клікає «Блог». Скільки HTTP-запитів за сторінкою `/blog` піде **в момент кліку**?
>
> - [x] Жодного: сторінка вже лежить у Client Cache після prefetch
> - [ ] Один: `GET /blog` — сервер віддає новий HTML
> - [ ] Один: `GET /blog?_rsc=…` — браузер отримує RSC payload
> - [ ] Два: HTML і JS-чанк сторінки
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Поки посилання було у viewport, Next.js заздалегідь завантажив RSC payload `/blog` (запити з `?_rsc=` і заголовком `Next-Router-Prefetch`). На клік роутер рендерить сторінку з памʼяті, і у вкладці Network не зʼявляється нічого. HTML потрібен лише при першому заході.

## 🧒 Простими словами

Уяви кавʼярню, де бариста знає постійних гостей. Коли ти лише заходиш у двері (посилання зʼявилося на екрані), він уже ставить на стійку чашку і насипає зерно — це **prefetching**. Коли ти замовляєш (клік), лишається тільки налити гаряче: те, що не можна приготувати заздалегідь, бо воно має бути свіжим (динамічні дані). Якщо ти замовляєш те саме за пʼять хвилин, він не меле каву наново, а бере готову порцію з полички — це **Client Cache**. А твоє недопите латте з попереднього візиту він не виливає, а відставляє вбік (до трьох чашок), бо ти, можливо, повернешся, — це **Activity**. Лише коли ти переходиш у зовсім іншу кавʼярню, усе починається з нуля — **hard navigation**.

## 🔬 Як це працює насправді

### 🖱️ Що відбувається після кліку по Link

`<Link>` з `next/link` рендерить звичайний `<a href>`. Без JS це просто посилання, і браузер завантажить новий документ. Але `Link` — Client Component: після hydration він перехоплює клік і запускає **клієнтську навігацію**. Браузер не просить у сервера HTML, а отримує **RSC payload** — серіалізований результат Server Components нового маршруту (докладно — у [[Next.js - 07. Server і Client Components]] і темі курсу 09).

Що робить роутер по кроках:

1. **Шукає маршрут у Client Cache.** Це памʼять у браузері, де лежать payload-и відвіданих і prefetch-нутих сегментів маршруту. Ключ — сегменти, а не URL цілком: спільні layouts зберігаються один раз.
2. **Рендерить усе, що вже є.** Якщо prefetch завантажив статичні частини сторінки й fallback-и `<Suspense>`, React показує їх одразу.
3. **Дотягує решту з сервера.** Для динамічних частин іде запит `GET /products/1?_rsc=…` із заголовками `RSC: 1` і `Next-Router-State-Tree` (опис дерева, яке вже є на клієнті). Сервер рендерить лише те, чого бракує, і стрімить у «дірки» `<Suspense>`.
4. **Оновлює історію й прокрутку.** URL змінюється через History API, старі layouts лишаються змонтованими, а сторінка, з якої пішли, під Cache Components не розмонтовується, а ховається (про це — у [[#🪟 Activity: стан сторінок, що пішли зі сцени]]).

> [!diagram] Клік по Link: звідки береться новий екран
> ```yaml
> layout: flow
> nodes:
>   - { id: click, label: "браузер · Link", text: "клік: /products/1", tone: gray, icon: "px:cursor" }
>   - { id: cache, label: "Client Cache", text: "є prefetch?", note: "shell, layouts, fallback-и", tone: blue, icon: "px:database" }
>   - { id: shell, label: "React", text: "миттєвий рендер з памʼяті", note: "назва товару, «Перевіряємо наявність…»", tone: green, icon: "px:bolt" }
>   - { id: server, label: "сервер", code: "GET /products/1?_rsc=…\nRSC: 1", note: "лише динамічні частини", tone: violet }
>   - { id: done, label: "React + history", text: "дірки Suspense заповнено", note: "URL оновлено", tone: mint, icon: "px:check" }
> edges:
>   - { from: click, to: cache, label: "пошук сегментів" }
>   - { from: cache, to: shell, label: "hit" }
>   - { from: shell, to: server, label: "бракує даних" }
>   - { from: server, to: done, label: "RSC stream" }
> steps:
>   - { focus: click, note: "Користувач клікає Link. JS роутера перехоплює клік: повного перезавантаження не буде." }
>   - { move: { from: click, to: cache, value: "/products/1" }, note: "Роутер шукає сегменти маршруту в Client Cache. Prefetch уже поклав туди статичну частину сторінки." }
>   - { move: { from: cache, to: shell, value: "shell" }, note: "React одразу малює те, що є: спільний layout, назву товару з 'use cache' і fallback для складу." }
>   - { move: { from: shell, to: server, value: "state tree" }, note: "Залишок рендерить сервер: запит з ?_rsc= і заголовком Next-Router-State-Tree, щоб не віддавати те, що вже є." }
>   - { move: { from: server, to: done, value: "На складі: 3" }, note: "Payload стрімиться в дірки Suspense. Якби prefetch не встиг, React чекав би весь маршрут — і саме тут допомагає useLinkStatus." }
> ```
> Чим більше маршруту є в Client Cache на момент кліку, тим коротший шлях до екрана.

Ось сторінка, на якій видно обидві частини: назва товару кешується (`'use cache'`), а склад — «живі» дані, які існують лише під час запиту:

```tsx
// app/products/[id]/page.tsx
import { Suspense } from 'react'
import { connection } from 'next/server'
import { getProduct, getStock } from '@/lib/data'

export function generateStaticParams() {
  return [{ id: '1' }]
}

export default function ProductPage({ params }: PageProps<'/products/[id]'>) {
  return (
    <article>
      <p>Каталог / товар</p>
      <Suspense fallback={<h1>Завантаження товару…</h1>}>
        <ProductInfo params={params} />
      </Suspense>
      <Suspense fallback={<p>Перевіряємо наявність…</p>}>
        <Stock params={params} />
      </Suspense>
    </article>
  )
}

async function ProductInfo({ params }: Pick<PageProps<'/products/[id]'>, 'params'>) {
  const { id } = await params
  const product = await getProduct(id) // 'use cache'
  if (!product) return <h1>Не знайдено</h1>
  return <h1>{product.name} — {product.price} ₴</h1>
}

async function Stock({ params }: Pick<PageProps<'/products/[id]'>, 'params'>) {
  const { id } = await params
  await connection() // «живі» дані: лише під час запиту
  return <p>На складі: {await getStock(id)}</p>
}
```

У продакшні клік по посиланню на цю сторінку дає рівно один запит — за `Stock`. Назву товару, layout і обидва fallback-и роутер уже мав після prefetch.

> [!note] Чому в прикладах дані в памʼяті
> Приклади зібрані з `cacheComponents: true`, а `lib/data.ts` тримає товари в масиві. Справжній запит до БД без `'use cache'` і поза `<Suspense>` зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують (`'use cache'`, тема курсу 15) або обгортають у `<Suspense>` (теми 11–12). Тут нас цікавить навігація, тож це опускаємо.

### 🔀 Soft і hard navigation

**Soft navigation** — клієнтська навігація без перезавантаження документа: React живий, спільні layouts змонтовані, стан у них лишається, браузер отримує тільки RSC payload. Так працюють `<Link>`, `router.push()`, `router.replace()`, а також `window.history.pushState` / `replaceState` (Next.js синхронізує з ними `usePathname` і `useSearchParams`).

**Hard navigation** — повне завантаження сторінки: браузер просить HTML, увесь JS виконується заново, клієнтський стан зникає. Вона трапляється, коли:

- посилання — звичайний `<a href>` або `window.location.href = …`;
- користувач оновлює сторінку чи вводить адресу вручну;
- навігація переходить між **різними root layouts** (наприклад, `app/(shop)/layout.tsx` → `app/(marketing)/layout.tsx`, тема курсу 02): спільного кореня немає, тож нічого зберегти не можна;
- адреса зовнішня (інший origin).

`Ctrl`/`Cmd`-клік і посилання з `download` взагалі не доходять до роутера: їх обробляє браузер (нова вкладка, завантаження файлу).

Hard navigation — не завжди помилка. Logout через `window.location.href` свідомо стирає весь клієнтський стан, щоб дані одного користувача не лишилися в памʼяті для іншого.

Колбек `onNavigate` у `Link` спрацьовує **лише** для soft navigation (на відміну від `onClick`) і дає `e.preventDefault()`, щоб скасувати перехід, — зручно для «у тебе незбережені зміни». `transitionTypes` (16.2) передає типи переходу в `<ViewTransition>` для анімацій.

> [!quiz] Перевір себе: де буде повне перезавантаження?
> level: middle · id: nextjs-core-04-quiz-02
>
> У проєкті є `app/(shop)/layout.tsx` і `app/(marketing)/layout.tsx` — обидва з `<html>` і `<body>`. Який перехід дасть **hard navigation**?
>
> - [ ] `<Link href="/cart">` з `/products` — обидві сторінки в `(shop)`
> - [x] `<Link href="/blog">` з `/cart`, де `/blog` лежить у `(marketing)`
> - [ ] `router.push('/products?sort=price')` з `/products`
> - [ ] `window.history.pushState(null, '', '?tab=reviews')`
>
> **Пояснення:** між різними root layouts немає спільного кореня, тож Next.js завантажує новий документ, навіть якщо ти використав `<Link>`. Зміна лише `searchParams` — звичайна soft navigation, а `pushState` Next.js підхоплює й синхронізує з `useSearchParams`.

### 📡 Prefetching: коли і що

**Prefetching** — завантаження маршруту у фоні до кліку. Next.js робить його автоматично для кожного `<Link>`, і тільки **у продакшні**: у `next dev` prefetch вимкнений (у dev-збірці нашого прикладу на сторінці з трьома посиланнями не було жодного запиту, доки не клікнули). Тому швидкість навігації міряють на `next build && next start`.

Коли стартує prefetch:

1. `Link` має пройти hydration — великий клієнтський бандл відкладає prefetch на першому заході.
2. Посилання **потрапляє у viewport** (одразу або під час прокрутки).
3. Посилання показує **намір**: наведення курсора чи дотик. Якщо prefetch-дані протухли, на наведенні Next.js завантажить їх знову.

Запити ставляться в невелику чергу з пріоритетами: спершу видимі посилання, потім ті, на які навели; нові посилання витісняють старі, а ті, що зникли з екрана, відкидаються. Сторінка з сотнею посилань не заливає мережу одночасно.

Що саме завантажується — залежить від маршруту й налаштувань. Без Cache Components правило просте: **статичний** маршрут prefetch-иться повністю, **динамічний** — лише до найближчого `loading.tsx` (а без нього пропускається). З `cacheComponents: true` (база курсу) prefetch бере **закешований рендер сторінки**: статичні частини, результати `'use cache'` і fallback-и `<Suspense>`, а «живі» дані дотягує клік.

Ось що побачила вкладка Network на сторінці з меню з пʼяти пунктів (16.3.8, `next start`, Chrome):

| Що | Запит | Заголовки |
|---|---|---|
| Дерево маршруту | `GET /blog?_rsc=…` | `RSC: 1`, `Next-Router-Prefetch: 1`, `Next-Router-Segment-Prefetch: /_tree` |
| Дані сегмента сторінки | `GET /blog?_rsc=…` | те саме, але `Next-Router-Segment-Prefetch: /blog/__PAGE__` |
| Навігація по динамічній сторінці | `GET /products/1?_rsc=…` | `RSC: 1`, `Next-Router-State-Tree: …`, без `Next-Router-Prefetch` |

Тобто з 16.0 prefetch іде **по сегментах**: спершу маленьке дерево маршруту (`/_tree`, кілька сотень байтів), потім дані тих сегментів, яких ще немає в кеші. Root layout, який уже прийшов з першим HTML, повторно не завантажується. Це **layout deduplication** та **incremental prefetching** з 16.0: запитів більше, байтів менше.

Значення `?_rsc=` — не випадковий «антикеш», а хеш заголовків запиту: CDN бачить різні URL для різних варіантів відповіді. У нашому прикладі запит з чужим `_rsc` сервер перенаправив `307` на правильний хеш, тож підробляти чи прибирати цей параметр у проксі не варто.

> [!quiz] Перевір себе: що з цього prefetch-запит?
> level: middle · type: output · id: nextjs-core-04-quiz-03
>
> У Network продакшн-застосунку три запити. Котрий з них — **prefetch**, а не навігація?
>
> ```text
> A  GET /dashboard?_rsc=1hk0…  RSC: 1  Next-Router-Prefetch: 1  Next-Router-Segment-Prefetch: /dashboard/__PAGE__
> B  GET /dashboard?_rsc=oKkJ…  RSC: 1  Next-Router-State-Tree: %5B%22%22…
> C  GET /dashboard              (без RSC-заголовків, Accept: text/html)
> ```
>
> - [x] A — prefetch сегмента сторінки; B — soft navigation за динамічними даними; C — hard navigation
> - [ ] B — prefetch, бо надсилає дерево стану; A — навігація
> - [ ] Усі три — prefetch, просто різних частин маршруту
> - [ ] C — prefetch: браузер заздалегідь бере HTML
>
> **Пояснення:** prefetch позначає `Next-Router-Prefetch`, а `Next-Router-Segment-Prefetch` каже, який сегмент. Запит із `Next-Router-State-Tree` без prefetch-заголовка — навігація: роутер повідомляє серверу, що вже є на клієнті. Запит без `RSC: 1` — звичайний документ, тобто повне завантаження.

### 🎚️ Значення prop prefetch

| `prefetch` | Без Partial Prefetching | З Partial Prefetching |
|---|---|---|
| не вказано, `"auto"`, `null` | закешований рендер (без Cache Components: static — повністю, dynamic — до `loading.tsx`) | App Shell маршруту |
| `true` | повний маршрут, **включно з динамічними даними** | App Shell + закешований вміст, що залежить від URL цього посилання |
| `false` | ні у viewport, ні на наведенні | так само |

`prefetch={false}` у App Router вимикає prefetch повністю, і на наведенні теж. Наслідок: статичну сторінку завантажать лише на клік, а динамічну — після серверного рендера, тож перехід «підвисне». Компроміс — prefetch на наведенні:

```tsx
// app/ui/hover-prefetch-link.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export function HoverPrefetchLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [active, setActive] = useState(false)
  return (
    // false — не prefetch-ити у viewport; null — звичайна поведінка після наведення
    <Link href={href} prefetch={active ? null : false} onMouseEnter={() => setActive(true)}>
      {children}
    </Link>
  )
}
```

У нашому прикладі посилання «Адмінка» не дало жодного запиту при завантаженні, а після `hover` — три prefetch-запити (`/_tree`, `/_head` і сегмент `/admin`). Для довгих списків і таблиць це розумна стратегія. Ручний prefetch поза `Link` — `router.prefetch(href, { onInvalidate })`: колбек спрацює, коли Next.js вважатиме дані застарілими, щоб ти міг запросити їх знову.

`prefetch={true}` без Partial Prefetching — дорога опція: кожне видиме посилання запускає **серверний рендер усього маршруту**, разом із «живими» даними. Ми бачили це на `/products/3`: запит пішов одразу при завантаженні каталогу, без `Next-Router-Prefetch`, з `Cache-Control: private, no-cache` — а клік потім не зробив жодного запиту. У `next dev` Next.js про це попереджає:

```text
Error: Next.js encountered dynamic data during prefetching for "/products/3".

This will lead to slower, more expensive prefetches.

Ways to fix this:
  - [upgrade] Opt into Partial Prefetching by exporting `const prefetch = 'partial'` from the page or layout, or by setting `partialPrefetching: true` in next.config to opt the whole app in
  - [disable] Remove `prefetch={true}` from the <Link> to use the default prefetch
  - [ignore] Set `export const instant = false` to opt the route out of instant-navigation validation
```

Ще одна пастка: prefetch виконує Server Components маршруту. Аналітика «перегляд сторінки» прямо в тілі layout спрацює на prefetch, а не на візит. Побічні ефекти переносять у `useEffect` клієнтського компонента або в Server Action.

> [!quiz] Перевір себе: обери правдиві твердження про prefetch
> level: middle · type: multi · id: nextjs-core-04-quiz-04
>
> - [x] У `next dev` автоматичного prefetch немає
> - [x] `prefetch={false}` в App Router вимикає і prefetch у viewport, і prefetch на наведенні
> - [ ] `prefetch={true}` безкоштовний: він лише раніше стартує той самий запит
> - [x] Prefetch виконує Server Components, тож побічні ефекти в їхньому тілі спрацюють без візиту
> - [ ] Звичайний `<a href>` теж prefetch-иться, якщо посилання внутрішнє
>
> **Пояснення:** prefetch — лише продакшн-механізм `Link` (і `router.prefetch`). `prefetch={true}` без Partial Prefetching — окремий серверний рендер з динамічними даними на кожне видиме посилання. `<a>` Next.js не чіпає взагалі: ні prefetch, ні soft navigation.

### 🧩 Partial Prefetching і App Shell

У 16.3 зʼявився **Partial Prefetching** — нова модель prefetch для Cache Components. Вмикається прапорцем верхнього рівня (не `experimental`):

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true, // один App Shell на маршрут замість prefetch на кожне посилання
}

export default nextConfig
```

Без `cacheComponents` конфіг не пройде валідацію: `next dev` і `next build` впадуть одразу.

Ключове поняття — **App Shell**: prerender маршруту з усім, що **не залежить від URL-даних** (`params`, `searchParams`). У ньому статичний вміст, результати `'use cache'` зі `stale` від 5 хвилин, fallback-и `<Suspense>`, а для маршрутів, що читають `cookies()` чи `headers()`, ще й сесійні дані (такий shell кешується на клієнті окремо для сесії). Один shell на маршрут спільний для всіх посилань: сто карток `/products/[id]` — один prefetch, а не сто.

Що змінюється для `Link`:

- **за замовчуванням** посилання бере App Shell; усе, що залежить від `params`/`searchParams`, і «живі» дані стрімляться **після** кліку з-за меж `<Suspense>`;
- **`prefetch={true}`** вмикає **per-link prefetch**: сервер додатково розвʼязує URL-дані цього посилання й закешований вміст за ними (наприклад, результати `search(q)` з `'use cache'`). Ціна — серверний виклик на кожне видиме посилання, тож це опція для кількох важливих посилань, а не для сітки карток;
- **`prefetch={false}`** — без змін;
- інвалідація (`revalidateTag`, `revalidatePath`) тихо оновлює повʼязані prefetch-і.

Ми порівняли каталог з посиланнями на `/products/1`, `/products/2` і `/products/3` (останнє з `prefetch={true}`):

| | Без Partial Prefetching | З `partialPrefetching: true` |
|---|---|---|
| `/products/1`, `/products/2` | два окремі запити сегмента `__PAGE__` | один запит `__PAGE__`, другий маршрут бере той самий shell |
| `/products/3` з `prefetch={true}` | повний рендер з даними складу (`private, no-cache`) | runtime prefetch (`Next-Router-Prefetch: 2`), без «живих» даних |
| клік по `/products/3` | жодного запиту | один запит за складом |
| `/dashboard` (читає `cookies()`) | prefetch статичного сегмента | runtime prefetch сесійного shell (`Next-Router-Prefetch: 3`) |

> [!diagram] Prefetch каталогу: по посиланню чи по маршруту
> ```yaml
> layout: compare
> columns: { old: "Без Partial Prefetching", pp: "partialPrefetching: true" }
> nodes:
>   - { id: o1, col: old, label: "Link /products/1", text: "prefetch __PAGE__", tone: blue }
>   - { id: o2, col: old, label: "Link /products/2", text: "ще один prefetch __PAGE__", tone: blue }
>   - { id: o3, col: old, label: "Link /products/3 prefetch", text: "повний рендер зі складом", note: "сервер на кожне посилання", tone: red, icon: "px:warning" }
>   - { id: p1, col: pp, label: "Link /products/1", text: "App Shell /products/[id]", tone: green, icon: "px:box" }
>   - { id: p2, col: pp, label: "Link /products/2", text: "той самий shell", note: "без запиту", tone: green }
>   - { id: p3, col: pp, label: "Link /products/3 prefetch", text: "shell + URL-дані з 'use cache'", note: "склад — після кліку", tone: yellow }
> steps:
>   - { show: [o1, p1], note: "Перше посилання на маршрут: обидві моделі завантажують сторінку. Праворуч це спільний App Shell маршруту /products/[id]." }
>   - { show: [o2, p2], note: "Друге посилання на той самий маршрут. Ліворуч — ще один prefetch, праворуч shell уже є в кеші." }
>   - { show: [o3, p3], note: "prefetch={true}: ліворуч сервер рендерить усе, навіть «живий» склад. Праворуч лише закешовані URL-дані, а склад стрімиться після кліку." }
> ```
> Без Partial Prefetching вартість prefetch росте з кількістю посилань, з ним — з кількістю маршрутів.

Partial Prefetching вимагає, щоб маршрут був побудований для shell: URL-дані читаються **всередині** `<Suspense>`. Якщо `await params` стоїть на верхньому рівні сторінки, shell привʼязується до одного URL, і `next dev` показує insight «URL data outside of Suspense». Виправлення — передати `params` як проміс у дочірній компонент під `<Suspense>`, як у `ProductPage` вище.

> [!quiz] Перевір себе: скільки shell-запитів дасть сітка карток?
> level: middle · type: output · id: nextjs-core-04-quiz-05
>
> `cacheComponents: true`, `partialPrefetching: true`, продакшн. На сторінці видно 24 картки `<Link href={'/products/' + id}>` без prop `prefetch`, усі ведуть на `app/products/[id]/page.tsx`. Скільки prefetch-ів **даних сторінки** зробить роутер?
>
> - [x] Один: App Shell маршруту `/products/[id]` спільний для всіх 24 посилань
> - [ ] 24: по одному на кожне видиме посилання
> - [ ] Жодного: без `prefetch={true}` Partial Prefetching нічого не завантажує
> - [ ] 24 серверні рендери, бо `[id]` невідомий під час збірки
>
> **Пояснення:** App Shell не містить URL-даних, тож однаковий для `/products/1` і `/products/24`. Дерево маршруту (`/_tree`) роутер ще може запитати для різних URL, але це сотні байтів. 24 серверні рендери були б лише з `prefetch={true}` на кожній картці.

### 🧷 Segment config prefetch і prefetch inlining

Увімкнути Partial Prefetching одразу для всього великого застосунку ризиковано: посилання з `prefetch={true}` змінять поведінку. Для поступового переходу є **segment config** `prefetch` у `page.tsx` чи `layout.tsx` (лише з Cache Components і лише в серверному файлі):

- **`'partial'`** — Partial Prefetching для цього маршруту без глобального прапорця. Ставиться на **цільову** сторінку, не на посилання. Коли всі потрібні маршрути переведено, вмикають `partialPrefetching: true`, а експорти прибирає кодмод `npx @next/codemod@canary remove-partial-prefetch ./app`.
- **`'force-disabled'`** — ніколи не prefetch-ити дані цього сегмента й глибших. Для рідко відвідуваних сторінок за логіном.
- **`'auto'`** — значення за замовчуванням; явно його не пишуть.

```tsx
// app/admin/page.tsx — рідко відвідувана сторінка: дані сегмента не prefetch-ити
export const prefetch = 'force-disabled'

export default function AdminPage() {
  return <h1>Адмінка</h1>
}
```

Перевірка показала, що «ніколи» стосується саме даних сторінки: на наведенні роутер усе одно запитав дерево маршруту (`/_tree`), метадані (`/_head`) і сегмент `/admin` з root layout, але без `<h1>Адмінка</h1>`. Документація так і каже: `'force-disabled'` не забороняє prefetch метаданих маршруту.

Логіка розподілу ролей: **посилання виражає намір** («prefetch-ни мене, і наскільки охоче»), **сегмент задає стелю вартості** («скільки роботи наперед допустимо для будь-якого посилання сюди»). `<Link prefetch={false}>` вимикає prefetch незалежно від сегмента.

**Prefetch inlining** (16.2, увімкнено за замовчуванням з 16.3) — оптимізація всередині сегментної моделі: дрібні відповіді сегментів (до 2 КБ gzip кожна, до 10 КБ разом на шлях) склеюються в один запит, щоб не плодити десятки крихітних запитів. Ціна — дублювання даних спільних сегментів між маршрутами. Налаштування — `experimental.prefetchInlining`: `true`, `false` або `{ maxSize, maxBundleSize }`. Сама поведінка — постійна частина роутера; `experimental` тут лише конфіг. Вимикають його хіба що під час налагодження чи для замірів.

> [!quiz] Перевір себе: заповни конфіг поступового переходу
> level: middle · type: fill · bank: true, 'auto' · id: nextjs-core-04-quiz-06
>
> Глобально Partial Prefetching ще вимкнено, але сторінку пошуку вже переведено. Сторінку налаштувань ніхто не відкриває, prefetch їй не потрібен.
>
> ```ts fill
> // next.config.ts
> const nextConfig: NextConfig = {
>   [[cacheComponents]]: true,
> }
>
> // app/search/page.tsx
> export const prefetch = [['partial'|"partial"]]
>
> // app/settings/page.tsx
> export const [[prefetch]] = [['force-disabled'|"force-disabled"]]
> ```
>
> **Пояснення:** segment config `prefetch` працює лише з `cacheComponents`. `'partial'` вмикає App Shell для одного маршруту без глобального `partialPrefetching`, а `'force-disabled'` вимикає prefetch даних сегмента. `'auto'` — значення за замовчуванням, його не пишуть.

### 🗃️ Client Cache і staleTimes

**Client Cache** (раніше казали «router cache») — памʼять у браузері з RSC payload-ами відвіданих і prefetch-нутих сегментів. Він живе до оновлення сторінки й ділиться на дві частини з різними правилами.

**Перехід уперед** (клік, `router.push`). Сегмент береться з кешу, лише поки він «свіжий». Скільки — вирішує час `stale`:

- **статичні й закешовані** сегменти: `stale` з `cacheLife` (профіль `default` — 5 хвилин; сервер передає його заголовком `x-nextjs-stale-time: 300`). Клієнт тримає **мінімум 30 секунд**, щоб prefetch не протух до кліку;
- **динамічні** сторінки: `staleTimes.dynamic`, за замовчуванням **0** — щоразу новий запит (до 15.0 було 30 с).

**Назад/вперед** (кнопки браузера, `router.back()`). Тут Next.js використовує збережене без перевірки віку — щоб не стрибав layout і не губилась прокрутка.

Ми перевірили це на `/products/1`, де склад змінюється з кожним запитом:

| Дія | Запит | Склад на екрані |
|---|---|---|
| Перший захід | документ | `1:4` |
| `/blog`, потім `Link` назад на `/products/1` (за 5 с) | `GET /products/1?_rsc=…` | `1:3` — нові дані |
| `/blog`, потім кнопка «Назад» | немає | `1:3` — те саме |

`experimental.staleTimes` — глобальний перемикач для всього застосунку. Документація радить налаштовувати час точково — через `stale` у `cacheLife` (тема курсу 15):

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    staleTimes: { dynamic: 30 }, // динамічні сторінки живуть у Client Cache 30 с
  },
}

export default nextConfig
```

З `dynamic: 30` повторний перехід на `/products/1` протягом 30 секунд не робив запиту й показував старий склад, а через 31 секунду — робив. З `dynamic: 10` запит пішов уже через 15 секунд: для `dynamic` мінімуму в 30 с немає.

Сюрприз чекає з `staleTimes.static`. Його зміна змінює й `stale` профілю `default` у `cacheLife`, а вміст зі `stale` менше 30 секунд не потрапляє в prerender. З `staleTimes: { static: 10 }` наша головна сторінка з `'use cache'` перестала збиратися: `Error: Route "/": Next.js encountered uncached or runtime data during prerendering.` Якщо треба коротше життя даних, налаштовуй його в `cacheLife` для конкретної функції, а не глобально.

Що очищує Client Cache примусово, обходячи `stale`: `router.refresh()` — для поточного маршруту; `revalidatePath`, `revalidateTag`, `updateTag` і `refresh()`, викликані в Server Action, — увесь кеш; а також `cookies.set` і `cookies.delete`.

> [!quiz] Перевір себе: звідки візьмуться дані?
> level: middle · type: output · id: nextjs-core-04-quiz-07
>
> Налаштування за замовчуванням (`staleTimes` не задано), продакшн. `/live` — динамічна сторінка з `await connection()` під `<Suspense>`. Користувач: `/live` → клік `<Link href="/about">` → через 10 с клік `<Link href="/live">` → клік `<Link href="/about">` → кнопка браузера «Назад». Скільки разів після першого заходу піде запит за динамічною частиною `/live`?
>
> - [x] Один: на клік по Link; повернення кнопкою «Назад» бере збережене
> - [ ] Нуль: `/live` ще в кеші, 10 с менше за 30-секундний мінімум
> - [ ] Два: і на клік, і на «Назад» — у динамічних сторінок кешу немає
> - [ ] Один, але на «Назад», а клік узяв дані з prefetch
>
> **Пояснення:** `staleTimes.dynamic` за замовчуванням 0, тож перехід уперед завжди йде на сервер. 30-секундний мінімум стосується `stale` закешованого вмісту, не динамічних сторінок. Back/forward використовує збережений payload без перевірки віку.

### 🔄 Оновити маршрут: два refresh

**`router.refresh()`** — метод `useRouter()` у Client Component. Він робить новий запит за поточним маршрутом, повторно рендерить Server Components і **домержує** payload: `useState` клієнтських компонентів і прокрутка лишаються. Він чистить Client Cache поточного маршруту, але **не** інвалідує серверний кеш: результат `'use cache'` лишиться тим самим, поки його не ревалідують.

```tsx
// app/ui/refresh-button.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RefreshButton() {
  const router = useRouter()
  const [clicks, setClicks] = useState(0)
  return (
    <button
      onClick={() => {
        setClicks((c) => c + 1)
        router.refresh() // новий RSC payload поточного маршруту; useState лишається
      }}
    >
      Оновити дані (натиснуто {clicks})
    </button>
  )
}
```

У прикладі після кліку пішов `GET /dashboard?_rsc=…`, час генерації в привітанні змінився, а лічильник показав «натиснуто 1» — стан пережив оновлення.

**`refresh()` з `next/cache`** — його викликають **лише в Server Action**: у Route Handler він кидає помилку, а в Client Component і деінде його не використовують. Після мутації він каже роутеру оновитися, а revalidation-функції в Server Action очищують увесь Client Cache. Нового GET не буде: оновлений payload приходить у відповіді на той самий `POST` з заголовком `Next-Action`.

```ts
// app/notes/actions.ts
'use server'

import { refresh } from 'next/cache'

const notes: string[] = []

export async function saveNote(formData: FormData) {
  notes.push(String(formData.get('text') ?? ''))
  refresh() // оновити клієнтський роутер після мутації (лише в Server Action)
}
```

Правило вибору: дані змінились через твою Server Action — `refresh()`, `revalidatePath` чи `updateTag` усередині неї (тема курсу 22). Дані змінились «десь ще» (вебсокет, інша вкладка, кнопка «оновити») — `router.refresh()`.

> [!quiz] Перевір себе: router.refresh чи refresh?
> level: middle · id: nextjs-core-04-quiz-08
>
> Client Component отримує через WebSocket подію «замовлення оплачено» і має перемалювати серверну таблицю замовлень. Що викликати?
>
> - [x] `router.refresh()` з `useRouter()` — новий payload поточного маршруту без втрати клієнтського стану
> - [ ] `refresh()` з `next/cache` прямо в обробнику події
> - [ ] `revalidatePath('/orders')` в обробнику події клієнтського компонента
> - [ ] `window.location.reload()` — інакше Server Components не перерендеряться
>
> **Пояснення:** `refresh()` і `revalidatePath` — серверні функції, їх викликають у Server Action, не в браузерному коді. `router.refresh()` — клієнтський спосіб попросити новий RSC payload. Перезавантаження сторінки теж оновить таблицю, але знищить увесь стан і змусить завантажити JS заново.

### 🪟 Activity: стан сторінок, що пішли зі сцени

До Cache Components сторінка, з якої ти пішов, **розмонтовувалась**: чернетка у формі, розгорнутий `<details>`, прокрутка списку — усе зникало, а для збереження стан піднімали в layout або зовнішній store. **З `cacheComponents: true`** Next.js ховає сторінку через React **`<Activity>`**: DOM лишається в документі з `display: none`, а стан React і DOM-стан зберігаються. Без Cache Components цього немає. Те саме стосується layouts, з яких ти пішов у межах одного root layout, і templates на нещодавно відвіданих маршрутах: вони ховаються, а не розмонтовуються, тож «template для скидання стану» вже не гарантія — деталі й перевірка на 16.3.8 — у [[Next.js - 02. Layouts, templates і route groups#🔁 template.tsx: новий екземпляр на кожну навігацію|темі 02]].

Правила:

- зберігається **до 3 маршрутів**; на 16.3.8 ліміт **включає поточний** — видима сторінка плюс дві приховані; найстаріший витісняється й наступного разу рендериться з нуля;
- при прихованні React виконує **cleanup ефектів**, як при розмонтуванні, а при поверненні — запускає ефекти знову. Таймери й підписки ставляться на паузу, якщо в них правильний cleanup;
- `<video>` і `<audio>` під `display: none` **продовжують грати** — паузу ставлять у cleanup `useLayoutEffect`;
- глобальні стилі прихованої сторінки (`<style>` з `:root { … }`) діють далі — їх вимикають через `media="not all"` у cleanup.

Ось що показав експеримент зі сторінкою нотаток (чернетка в `useState`) і маршрутами блогу, товару, кабінету й статистики:

| Перехід | Що видно в DOM | Чернетка |
|---|---|---|
| `/notes` → `/blog` | «Блог» + прихована «Нотатки» | збережена |
| `/blog` → `Link` на `/notes` | «Нотатки» + прихований «Блог» | збережена |
| `/notes` → `/blog` → `/products/1` → `/dashboard` | «Кабінет» + приховані «Кавоварка» й «Блог» | «Нотатки» витіснено |
| … → `/stats` → `/notes` | «Нотатки» + приховані «Статистика» й «Кабінет» | порожня: рендер з нуля |

У консолі видно й ефекти: `NoteDraft cleanup` при кожному відході з `/notes`, `NoteDraft effect` при кожному поверненні.

> [!diagram] Activity: до трьох маршрутів, найстаріший витісняється
> ```yaml
> layout: stack
> nodes:
>   - { id: stats, label: "видимий", text: "/stats", tone: green, icon: "px:monitor" }
>   - { id: dash, label: "прихований", text: "/dashboard", tone: blue }
>   - { id: prod, label: "прихований", text: "/products/1", tone: blue }
>   - { id: blog, label: "прихований", text: "/blog", tone: gray }
>   - { id: notes, label: "початок", text: "/notes", note: "чернетка в useState", tone: orange, icon: "px:file" }
> steps:
>   - { show: [blog], note: "Користувач починає з /notes і переходить на /blog: нотатки ховаються з display: none, чернетка в памʼяті." }
>   - { show: [prod], note: "Далі /products/1. Видима сторінка плюс дві приховані — ліміт у три маршрути заповнено." }
>   - { show: [dash], hide: [notes], note: "Перехід на /dashboard: найстаріший маршрут, /notes, витіснено разом зі станом." }
>   - { show: [stats], hide: [blog], note: "Перехід на /stats витісняє /blog. Повернення на /notes тепер — рендер з нуля, порожня форма." }
> ```
> Activity — не нескінченний кеш станів: три останні маршрути, рахуючи поточний.

Збереження стану — і подарунок, і нова категорія багів. Відкритий дропдаун, повідомлення «Збережено!» чи чернетка попереднього користувача після logout через `router.push` тепер **повертаються**. Документація пропонує вирішувати це за ситуацією:

- **тимчасовий UI** (дропдаун, popover) — закривай у cleanup `useLayoutEffect`: він виконується синхронно перед прихованням, без блимання;
- **діалог з ініціалізацією** (фокус на полі при відкритті) — тримай стан у `searchParams`, а не в `useState`, щоб він скидався разом з URL;
- **форма після відправки** — скидай стан в обробнику (`setName('')` перед `router.push`) або в cleanup з прапорцем «відправлено»;
- **зміна користувача** — `key={userId}` на компоненті, а logout — через `window.location.href`.

```tsx
// app/notes/settings-dropdown.tsx
'use client'

import { useLayoutEffect, useState } from 'react'

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  // Activity ховає сторінку → cleanup закриває меню, щоб не повернутись до відкритого
  useLayoutEffect(() => {
    return () => setIsOpen(false)
  }, [])

  return (
    <div>
      <button onClick={() => setIsOpen((o) => !o)}>Опції</button>
      {isOpen && (
        <ul>
          <li>Експорт</li>
          <li>Видалити все</li>
        </ul>
      )}
    </div>
  )
}
```

Перевірено: меню, відкрите перед переходом, після повернення на `/notes` закрите, а чернетка поруч — на місці.

Для e2e-тестів це теж важливо: приховані сторінки лишаються в DOM, тож `page.locator('.card').first()` може знайти невидимий елемент. Використовуй селектори з урахуванням видимості — `getByRole`, `getByLabel` у Playwright — або `.filter({ visible: true })`.

> [!quiz] Перевір себе: що лишиться у формі?
> level: middle · type: output · id: nextjs-core-04-quiz-09
>
> `cacheComponents: true`. На `/notes` — textarea зі станом у `useState`. Користувач вводить «чернетка», потім переходить через `<Link>`: `/notes` → `/a` → `/b` → `/c` → `/notes`. Усі чотири маршрути різні. Що буде в textarea?
>
> - [x] Порожньо: на `/c` у памʼяті лише `/c`, `/b`, `/a`, і `/notes` уже витіснено
> - [ ] «чернетка»: Activity зберігає всі відвідані маршрути до оновлення сторінки
> - [ ] «чернетка»: стан `useState` лежить у Client Cache разом із payload
> - [ ] Порожньо, бо `<Link>` завжди розмонтовує попередню сторінку
>
> **Пояснення:** Activity тримає три маршрути разом із видимим. На `/c` це `/c`, `/b`, `/a` — `/notes` витіснено, і повернення рендерить форму з нуля. Client Cache зберігає RSC payload, а не стан React. Якби маршрутів між візитами було два, чернетка б лишилася.

### 🔑 bfcacheId і свідоме скидання

`useRouter().bfcacheId` — непрозорий рядок, привʼязаний до сегмента маршруту. Він **змінюється** на push і replace (клік по `Link`, `router.push`, `router.replace`) і **лишається тим самим** на back/forward, на `router.refresh()` і на навігаціях, що змінюють лише `searchParams` чи hash. Як `key` він дає поведінку «на звичайному переході — з нуля, на кнопці «Назад» — як було»:

```tsx
// app/notes/note-draft.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveNote } from './actions'

export function NoteDraft() {
  const [text, setText] = useState('')
  const { bfcacheId } = useRouter()

  useEffect(() => {
    console.log('NoteDraft effect: mount або повернення з прихованого стану')
    return () => console.log('NoteDraft cleanup: розмонтування або приховання')
  }, [])

  return (
    <>
      <p>bfcacheId: {bfcacheId}</p>
      <form action={saveNote}>
        <textarea name="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Чернетка…" />
        <button type="submit">Зберегти</button>
      </form>
      {/* key={bfcacheId}: поле скидається на push/replace, але відновлюється на back/forward */}
      <input key={bfcacheId} placeholder="Пошук (скидається)" />
    </>
  )
}
```

Що показав браузер (значення — як їх рендерить 16.3.8):

| Перехід | `bfcacheId` | textarea (без key) | input (`key={bfcacheId}`) |
|---|---|---|---|
| перший захід | `_b_0_` | «чернетка 1» | «пошук 1» |
| `/blog` → `Link` на `/notes` | `_b_4_` | «чернетка 1» | порожньо |
| ввели «пошук 2», `/blog` → «Назад» | `_b_4_` | «чернетка 1» | «пошук 2» |

Зверни увагу: на `Link` сторінка **не** створювалась заново — textarea зберегла текст, — але `bfcacheId` усе одно змінився. Тобто це «ідентифікатор переходу», а не «ідентифікатор монтування». Документація радить `bfcacheId` переважно для міграції старого коду, а в новому — скидати стан явно (в обробнику, через `key` з даних, як id чернетки з сервера).

### ↩️ Назад, вперед і прокрутка

На back/forward Next.js бере сегменти з Client Cache без перевірки `stale`, а Activity повертає прихований DOM — тому прокрутка, відкриті `<details>` і введений текст на місці. Якщо маршрут уже витіснено з Activity, сторінка рендериться заново (payload може бути з кешу), і стан починається з нуля.

На переходах уперед `Link` і `router.push` за замовчуванням керують прокруткою так: якщо нова сторінка видима у viewport, позиція лишається; якщо ні — Next.js прокручує до **першого елемента сторінки** (пропускаючи sticky і fixed елементи). `scroll={false}` на `Link` або `{ scroll: false }` у `router.push` вимикає це — корисно для вкладок і фільтрів, де контент міняється під прокрученою шапкою. Для `href="#id"` Next.js прокручує до елемента; під sticky-шапкою допоможе CSS `scroll-padding-top`.

Зміна в 16: якщо в CSS стоїть `html { scroll-behavior: smooth }`, Next.js більше **не** перемикає його тимчасово на `auto` під час навігації — переходи плавно «їдуть» угору. Повернути старе перевизначення можна атрибутом `<html data-scroll-behavior="smooth">`.

### ⏳ useLinkStatus: відгук на повільний клік

Буває, що prefetch вимкнений, ще не завершився, а маршрут блокує навігацію. Тоді після кліку деякий час **нічого не відбувається**: URL не змінюється, екран старий. `useLinkStatus()` з `next/link` повертає `{ pending }` для `Link`, усередині якого компонент рендериться:

```tsx
// app/ui/nav-link.tsx
'use client'

import Link, { useLinkStatus, type LinkProps } from 'next/link'

function PendingHint() {
  // pending = true від кліку до оновлення історії, якщо маршрут ще не готовий
  const { pending } = useLinkStatus()
  return <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
}

export function NavLink({ children, ...props }: LinkProps & { children: React.ReactNode }) {
  return (
    <Link {...props}>
      {children}
      <PendingHint />
    </Link>
  )
}
```

Хук працює лише в **нащадку** `Link`, тож індикатор — окремий компонент усередині посилання. Перевірили на свідомо повільному маршруті (півтори секунди серверної роботи): через 300 мс після кліку `pending` був `true`, а URL ще показував `/blog`; після завершення — `false` і `/report`. На prefetch-нутому статичному `/blog` стану очікування не було взагалі — він пропускається, якщо маршрут готовий.

Поради з документації: індикатор фіксованого розміру, що міняє `opacity` (без зсуву layout), з затримкою анімації близько 100 мс, щоб швидкі переходи не блимали. І головне — `useLinkStatus` лише латка. Справжнє лікування — prefetch, `loading.tsx` або `<Suspense>`, щоб навігація стала миттєвою.

> [!quiz] Перевір себе: коли useLinkStatus щось покаже?
> level: middle · id: nextjs-core-04-quiz-10
>
> Меню з `NavLink` (індикатор `useLinkStatus` усередині `Link`). Для якого переходу в продакшні `pending` найімовірніше стане `true`?
>
> - [ ] На статичну сторінку, посилання на яку видно на екрані вже кілька секунд
> - [x] На динамічну сторінку без `<Suspense>`/`loading.tsx`, з `prefetch={false}`
> - [ ] На будь-яку сторінку — `pending` показується на кожен клік
> - [ ] Лише в `next dev`: у продакшні prefetch прибирає очікування завжди
>
> **Пояснення:** `pending` — це час від кліку до оновлення історії. Для prefetch-нутого маршруту він пропускається. Без prefetch і без межі `<Suspense>` роутер мусить чекати відповіді сервера, і саме тоді індикатор потрібен.

### ⚡ Instant navigation одним розділом

**Instant navigation** — навігація, коли браузер починає малювати нову сторінку одразу після кліку: статичне, закешоване й fallback-и видно миттєво, а решта стрімиться. Cache Components з **default-рівнем валідації** перевіряє це в `next dev` для кожної сторінки й показує insights у dev overlay. Інструменти (більшість — експериментальні, деталі й адаптація застосунку — у темі курсу 12, тести — у 41):

- **segment config `instant`** у `page.tsx`/`layout.tsx`: `true` (валідувати на глобальному рівні), `false` (маршрут має право блокувати) або `{ level: 'warning' }`. Лише з Cache Components і не в Client Component. Валідація — тільки в dev, збірку не блокує;
- **`experimental.instantInsights.validationLevel`**: `'warning'` (за замовчуванням — усі сторінки) або `'manual-warning'` (лише ті, де явно є `instant`);
- **Navigation Inspector** у Next.js DevTools: перемикач «Pause on navigations» заморожує сторінку на початковому стані — static shell при оновленні, prefetch-нутий екран при кліку;
- **`instant()` з `@next/playwright`** — e2e-перевірка того, що видно до приходу динамічних даних.

Найчастіший insight — дані поза `<Suspense>`. Цю сторінку `next dev` зупинив з повідомленням:

```text
Error: Route "/report": Next.js encountered uncached data during prerendering.

`fetch(...)` or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] Cache the data access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route
```

Варіант `[block]` — свідоме рішення «ця сторінка може чекати»: збірка проходить, маршрут стає динамічним (`ƒ`), а навігація сюди без prefetch і без `<Suspense>` чекає на сервер. Саме на ньому ми й міряли `useLinkStatus`:

```tsx
// app/report/page.tsx — свідомо блокуючий маршрут
import { connection } from 'next/server'

export const instant = false // дозволяємо навігації сюди чекати сервер

export default async function ReportPage() {
  await connection()
  await new Promise((r) => setTimeout(r, 1500)) // повільний звіт
  return <h1>Звіт на {new Date().toISOString()}</h1>
}
```

А `instant = true` на сторінці зі стрімінгом проходить перевірку і фіксує намір у коді:

```tsx
// app/stats/page.tsx — перевіряти в dev, що навігація сюди миттєва
import { Suspense } from 'react'
import { connection } from 'next/server'

export const instant = true

async function Visitors() {
  await connection()
  return <p>Відвідувачів зараз: {Math.round(Math.random() * 100)}</p>
}

export default function StatsPage() {
  return (
    <>
      <h1>Статистика</h1>
      <Suspense fallback={<p>Рахуємо…</p>}>
        <Visitors />
      </Suspense>
    </>
  )
}
```

Тонкість, яку легко пропустити: прямий захід і клієнтська навігація дають **різний** початковий UI. При навігації між `/store/shoes` і `/store/hats` перерендерюється лише те, що нижче спільного layout, тож `<Suspense>` у root layout на цьому переході не спрацює. Валідація перевіряє обидва шляхи окремо.

### 🔍 Як читати вкладку Network

Коли кажуть «навігація повільна», відкрий продакшн-збірку з DevTools → Network, фільтр `_rsc`, і дивись на заголовки:

| Бачиш | Значить |
|---|---|
| нічого на клік | маршрут повністю взято з Client Cache — швидше не буде |
| `Next-Router-Prefetch: 1` + `Next-Router-Segment-Prefetch` | звичайний prefetch сегмента (`/_tree`, `/_head`, `…/__PAGE__`) |
| `Next-Router-Prefetch: 2` / `3` | runtime prefetch: per-link (`prefetch={true}`) або сесійний shell — коштує серверного рендера |
| запит з `Next-Router-State-Tree` на клік | навігація по динамічних даних; дивись, чи є `<Suspense>`, щоб UI зʼявився раніше |
| такий самий запит одразу при завантаженні, без prefetch-заголовка | `prefetch={true}` без Partial Prefetching: повний рендер на кожне посилання |
| `GET /…` з `Accept: text/html` на клік | hard navigation: `<a>`, інший root layout, `window.location` |
| `POST` з `Next-Action` | Server Action; оновлений payload приходить у відповіді |

Значення `Next-Router-Prefetch: 2` і `3` ми бачили на 16.3.8 і в документації їх немає — це деталь реалізації, на яку не варто писати логіку в proxy. Документація прямо застерігає від того, щоб віддавати різний вміст для клієнтської навігації й повного завантаження за внутрішніми заголовками.

### 🏭 Як це роблять у продакшні

- **Міряють на продакшн-збірці.** `next build && next start` (або preview-деплой), Network з фільтром `_rsc`. Скарги на «повільну навігацію в dev» не розбирають.
- **Структура маршруту важливіша за prop `prefetch`.** `<Suspense>` навколо даних, `'use cache'` для того, що можна кешувати, `params`/`searchParams` — усередині меж. Тоді prefetch дає корисний shell без `prefetch={true}`.
- **Partial Prefetching — поступово.** Спершу аудит `prefetch={true}`, потім `export const prefetch = 'partial'` на окремих маршрутах, потім глобальний прапорець і кодмод. Для автоматизації є skill `next-partial-prefetching-adoption`.
- **`prefetch={true}` — лише вибірково** і лише з Partial Prefetching: для кількох посилань із URL-залежним закешованим вмістом (пошук, фільтри), не для сіток карток.
- **Довгі списки — prefetch на наведенні** через обгортку над `Link`; сторінки за логіном, які рідко відкривають, — `prefetch = 'force-disabled'`.
- **Збільшена кількість prefetch-запитів** після переходу на 16 — сигнал перевірити rate limit і правила WAF: вони не мають блокувати запити з `?_rsc=`.
- **Activity-аудит форм і модалок** після ввімкнення Cache Components: тимчасовий UI закривається в cleanup `useLayoutEffect`, logout — через повне перезавантаження.
- **E2e-тести з видимими селекторами** (`getByRole`) і `instant()` для ключових переходів.

## ⚠️ Пастки

> [!pitfall] Міряти швидкість навігації в next dev
> У dev prefetch вимкнений, а сторінки ще й компілюються на вимогу. Висновок «навігація повільна» з dev нічого не каже про продакшн.

> [!pitfall] prefetch={true} на кожній картці
> Без Partial Prefetching — серверний рендер усього маршруту з динамічними даними на кожне видиме посилання. Сітка з 50 карток — 50 рендерів, навіть якщо ніхто не клікне.
>
> ```tsx
> {products.map((p) => <Link key={p.id} href={`/products/${p.id}`} prefetch>…</Link>)} // ❌
> {products.map((p) => <Link key={p.id} href={`/products/${p.id}`}>…</Link>)} // ✅ shell маршруту
> ```

> [!pitfall] Аналітика в тілі layout
> Prefetch виконує Server Components маршруту, тож «перегляд сторінки» зарахується, коли посилання просто зʼявилося на екрані.
>
> ```tsx
> export default function Layout({ children }: { children: React.ReactNode }) {
>   trackPageView() // ❌ спрацює на prefetch
>   return <div>{children}</div>
> }
> ```

> [!pitfall] Застарілий стан після повернення
> З Cache Components сторінка не розмонтовується: відкритий дропдаун, «Повідомлення надіслано!» чи чернетка попереднього користувача повертаються. Закривай тимчасовий UI в cleanup `useLayoutEffect`, а logout роби через `window.location.href`.

> [!pitfall] staleTimes.static менше 30 секунд
> Значення змінює `stale` профілю `default`, а вміст зі `stale` < 30 с не потрапляє в prerender. Сторінки з `'use cache'` перестають збиратися: `Next.js encountered uncached or runtime data during prerendering`. Короткий час життя задавай у `cacheLife` для конкретних даних.

> [!pitfall] Очікувати свіжих даних після «Назад»
> Back/forward бере збережене без перевірки `stale`. Якщо дані мають бути свіжими і після повернення, викликай `router.refresh()` в ефекті або тримай їх у клієнтському запиті з власною логікою оновлення.

> [!pitfall] Шукати елементи в тестах без урахування видимості
> Приховані Activity-сторінки лежать у DOM. `locator('.product-card').first()` може зловити картку з попередньої сторінки й упасти на кліку по невидимому елементу.

## 🎤 На співбесіді

> [!interview] Що відбувається, коли користувач клікає по Link у Next.js App Router?
> level: middle · frequency: дуже часто · id: nextjs-core-04-int-01
>
> ---
>
> `Link` після hydration перехоплює клік і робить soft navigation: без нового документа, спільні layouts лишаються змонтованими. Роутер шукає сегменти маршруту в Client Cache (їх туди поклав prefetch у продакшні), одразу рендерить те, що є — статичні частини, закешоване, fallback-и `<Suspense>`, — а за рештою робить `GET …?_rsc=` з `RSC: 1` і `Next-Router-State-Tree`, щоб сервер відрендерив лише відсутнє. Payload стрімиться в дірки `<Suspense>`, URL оновлюється через History API. З Cache Components попередня сторінка ховається через `<Activity>`, а не розмонтовується.
>
> 📚 [[Next.js - 04. Навігація під капотом#🖱️ Що відбувається після кліку по Link|Розділ: клік по Link]] · [Next.js: Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating) · [Next.js: Prefetching](https://nextjs.org/docs/app/guides/prefetching)

> [!interview] Як працює prefetching у Next.js 16 і що змінює Partial Prefetching?
> level: middle · frequency: часто · id: nextjs-core-04-int-02
>
> ---
>
> Prefetch — лише в продакшні, для `Link` у viewport або при наведенні, через чергу з пріоритетами. З 16.0 він сегментний: дерево маршруту, потім відсутні сегменти; спільні layouts не дублюються, дрібні відповіді склеюються (prefetch inlining). Без Partial Prefetching посилання за замовчуванням бере закешований рендер сторінки, а `prefetch={true}` — повний рендер з динамічними даними на кожне посилання. `partialPrefetching: true` (16.3, потребує `cacheComponents`) дає один App Shell на маршрут, спільний для всіх посилань; URL-дані й «живі» дані стрімляться після кліку, а `prefetch={true}` додає per-link prefetch закешованого URL-залежного вмісту. Поступовий перехід — segment config `prefetch = 'partial'`.
>
> 📚 [[Next.js - 04. Навігація під капотом#🧩 Partial Prefetching і App Shell|Розділ: Partial Prefetching]] · [Next.js: Adopting Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) · [Next.js: Optimizing prefetching](https://nextjs.org/docs/app/guides/optimizing-prefetching)

> [!interview] Користувач повернувся на сторінку й бачить застарілі дані. Чому і що робити?
> level: middle · frequency: часто · id: nextjs-core-04-int-03
>
> ---
>
> Спершу з'ясувати, як він повернувся. Back/forward бере payload із Client Cache без перевірки віку — це задумано, щоб не стрибав layout і не губилась прокрутка. Перехід уперед бере кеш, поки не минув `stale`: для закешованого — з `cacheLife` (мінімум 30 с), для динамічних сторінок — `staleTimes.dynamic`, за замовчуванням 0. Якщо дані змінила наша мутація, викликаємо в Server Action `refresh()`, `revalidatePath` чи `updateTag` — це очищує весь Client Cache. Якщо дані змінились зовні — `router.refresh()` з клієнта. Окремо перевірити Activity: застарілим може бути не payload, а `useState` прихованої сторінки.
>
> 📚 [[Next.js - 04. Навігація під капотом#🗃️ Client Cache і staleTimes|Розділ: Client Cache]] · [Next.js: staleTimes](https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes) · [Next.js: useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)

> [!interview] Після ввімкнення Cache Components форма на сторінці показує старе «Надіслано!». Що сталося?
> level: senior · frequency: іноді · id: nextjs-core-04-int-04
>
> ---
>
> Next.js більше не розмонтовує сторінку при навігації, а ховає її через React `<Activity>` (до трьох маршрутів, рахуючи поточний), тож `useState` і DOM-стан повертаються. Ефекти при цьому проходять cleanup і запускаються знову. Рішення за типом стану: скинути статус у cleanup `useLayoutEffect` з прапорцем «відправлено», скинути поля в обробнику перед `router.push`, тримати тимчасовий стан у `searchParams` або дати `key` (з даних, а як крайній захід — `useRouter().bfcacheId`, який змінюється на push/replace і зберігається на back/forward). Logout — через `window.location.href`.
>
> 📚 [[Next.js - 04. Навігація під капотом#🪟 Activity: стан сторінок, що пішли зі сцени|Розділ: Activity]] · [Next.js: Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state) · [React: Activity](https://react.dev/reference/react/Activity)

> [!interview] Чим soft navigation відрізняється від hard і коли Next.js робить повне перезавантаження?
> level: junior · frequency: часто · id: nextjs-core-04-int-05
>
> ---
>
> Soft — клієнтська навігація: браузер отримує RSC payload, React і спільні layouts живі, стан зберігається. Hard — новий HTML-документ і повна ініціалізація JS: звичайний `<a>`, `window.location`, оновлення сторінки, перехід між різними root layouts, зовнішні адреси. Hard navigation буває корисною — наприклад, logout, щоб гарантовано стерти клієнтський стан.
>
> 📚 [[Next.js - 04. Навігація під капотом#🔀 Soft і hard navigation|Розділ: soft і hard]] · [Next.js: layout.js — root layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout) · [Next.js: Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating#client-side-transitions)

## 🔗 Звʼязки

- [[Next.js Start - 08. Навігація]] — `Link`, `usePathname`, `useRouter` для початківців; тут — що відбувається під ними.
- [[Next.js - 02. Layouts, templates і route groups]] — layouts, templates і route groups; чому різні root layouts дають hard navigation і як Activity поводиться з layouts і templates.
- [[Next.js - 07. Server і Client Components]] — RSC payload і де виконується код при навігації.
- Далі в курсі: тема 09 — RSC payload і hydration, 11 — streaming і `<Suspense>`, 12 — Partial Prerendering, Cache Components і instant navigation, 15 — `'use cache'` і `cacheLife`, 22 — ревалідація після мутацій, 41 — e2e-тести навігації.

## ⚡ Фішки

> [!reel] 📡 Prefetch не працює в dev
> Автоматичний prefetch `Link` вмикається лише в продакшн-збірці. «Повільна навігація» в `next dev` — ще не баг: міряй на `next build && next start`.

> [!reel] 🔇 Найкращий клік — без запиту
> Якщо після кліку по `Link` у вкладці Network порожньо, маршрут узято з Client Cache. Це і є мета: усе потрібне вже приїхало під час prefetch.

> [!reel] 🧩 Один shell на сто карток
> З `partialPrefetching: true` усі посилання на `/products/[id]` ділять один App Shell. Вартість prefetch росте з кількістю маршрутів, а не посилань.

> [!reel] 🪟 Сторінка не розмонтовується
> З Cache Components попередня сторінка ховається через `<Activity>` з `display: none`. Чернетка форми й прокрутка повертаються — до трьох маршрутів, рахуючи поточний.

> [!reel] 🔑 bfcacheId — ключ переходу
> `useRouter().bfcacheId` змінюється на `Link` і `router.push`, але не на кнопці «Назад». Як `key` він скидає стан на звичайному переході й відновлює на поверненні.
>
> ```tsx
> const { bfcacheId } = useRouter()
> return <form key={bfcacheId}>…</form>
> ```

> [!reel] ⏪ «Назад» не дивиться на stale
> Back/forward бере збережений payload без перевірки віку — навіть для динамічної сторінки з `staleTimes.dynamic = 0`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чи працює prefetching у next dev?
> *дуже часто · теорія* · `nextjs-core-04-card-01`
>
> Ні. Автоматичний prefetch `Link` працює лише в продакшн-збірці (`next build && next start`). У dev маршрут запитується на клік і ще компілюється на вимогу, тож навігація повільніша.
>
> 📚 [[Next.js - 04. Навігація під капотом#📡 Prefetching: коли і що|Розділ: prefetching]] · [Next.js: Prefetching](https://nextjs.org/docs/app/guides/prefetching)

> [!question]- Що отримує браузер при кліку по Link, якщо не HTML?
> *часто · теорія* · `nextjs-core-04-card-02`
>
> RSC payload нового маршруту — у запиті `GET …?_rsc=` із заголовком `RSC: 1` (або нічого, якщо все вже в Client Cache). HTML потрібен лише при першому заході чи hard navigation.
>
> 📚 [[Next.js - 04. Навігація під капотом#🖱️ Що відбувається після кліку по Link|Розділ: клік по Link]] · [Next.js: Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

> [!question]- Які значення приймає prop prefetch у Link?
> *часто · теорія* · `nextjs-core-04-card-03`
>
> `"auto"` / `null` / не вказано — поведінка за замовчуванням; `true` — повніший prefetch (без Partial Prefetching — увесь маршрут з динамічними даними); `false` — жодного prefetch, ні у viewport, ні на наведенні.
>
> 📚 [[Next.js - 04. Навігація під капотом#🎚️ Значення prop prefetch|Розділ: prop prefetch]] · [Next.js: Link → prefetch](https://nextjs.org/docs/app/api-reference/components/link#prefetch)

> [!question]- Коли Next.js робить повне перезавантаження замість клієнтської навігації?
> *часто · теорія* · `nextjs-core-04-card-04`
>
> Для `<a>` і `window.location`, при оновленні сторінки, при переході між різними root layouts, для зовнішніх адрес і посилань з `download`.
>
> 📚 [[Next.js - 04. Навігація під капотом#🔀 Soft і hard navigation|Розділ: soft і hard]] · [Next.js: layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout)

### 🟡 Middle

> [!question]- Що таке App Shell і чим він відрізняється від per-link prefetch?
> *часто · теорія* · `nextjs-core-04-card-05`
>
> App Shell — prerender маршруту без URL-даних (`params`, `searchParams`): статичне, закешоване (зі `stale` ≥ 5 хв), fallback-и, сесійні дані. Один на маршрут, спільний для всіх посилань — prefetch за замовчуванням із `partialPrefetching`. Per-link prefetch (`prefetch={true}`) додатково розвʼязує URL-дані конкретного посилання — коштом серверного виклику на кожне видиме посилання.
>
> 📚 [[Next.js - 04. Навігація під капотом#🧩 Partial Prefetching і App Shell|Розділ: Partial Prefetching]] · [Next.js: Optimizing prefetching](https://nextjs.org/docs/app/guides/optimizing-prefetching)

> [!question]- Як увімкнути Partial Prefetching лише для одного маршруту?
> *іноді · код* · `nextjs-core-04-card-06`
>
> Segment config у цільовому `page.tsx` чи `layout.tsx`: `export const prefetch = 'partial'` (потрібен `cacheComponents`). Коли всі маршрути переведено — `partialPrefetching: true` у конфігу й кодмод `remove-partial-prefetch`.
>
> 📚 [[Next.js - 04. Навігація під капотом#🧷 Segment config prefetch і prefetch inlining|Розділ: segment config prefetch]] · [Next.js: prefetch segment config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch)

> [!question]- Скільки живе динамічна сторінка в Client Cache і як це змінити?
> *часто · теорія* · `nextjs-core-04-card-07`
>
> За замовчуванням 0 с (`staleTimes.dynamic`): кожен перехід уперед іде на сервер; back/forward бере збережене. Глобально змінюють `experimental.staleTimes`, точково — `stale` у `cacheLife` (рекомендовано).
>
> 📚 [[Next.js - 04. Навігація під капотом#🗃️ Client Cache і staleTimes|Розділ: Client Cache]] · [Next.js: staleTimes](https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes)

> [!question]- Чим router.refresh() відрізняється від refresh() з next/cache?
> *часто · практика* · `nextjs-core-04-card-08`
>
> `router.refresh()` — з Client Component: новий payload поточного маршруту, клієнтський стан лишається, серверний кеш не чіпає. `refresh()` — лише в Server Action: оновлює роутер після мутації в тій самій відповіді на POST.
>
> 📚 [[Next.js - 04. Навігація під капотом#🔄 Оновити маршрут: два refresh|Розділ: два refresh]] · [Next.js: refresh](https://nextjs.org/docs/app/api-reference/functions/refresh)

> [!question]- Для чого useLinkStatus і де його викликати?
> *іноді · код* · `nextjs-core-04-card-09`
>
> Для індикатора на посиланні, поки навігація чекає сервер (`pending` — до оновлення історії). Викликати в компоненті-нащадку `Link`. Для prefetch-нутого маршруту `pending` пропускається; справжнє лікування — prefetch, `loading.tsx`, `<Suspense>`.
>
> 📚 [[Next.js - 04. Навігація під капотом#⏳ useLinkStatus: відгук на повільний клік|Розділ: useLinkStatus]] · [Next.js: useLinkStatus](https://nextjs.org/docs/app/api-reference/functions/use-link-status)

### 🔴 Senior

> [!question]- Скільки маршрутів зберігає Activity і що відбувається з ефектами прихованої сторінки?
> *іноді · теорія* · `nextjs-core-04-card-10`
>
> До трьох (на 16.3.8 — видимий плюс два приховані), лише з `cacheComponents: true`; найстаріший витісняється. При прихованні виконується cleanup ефектів, при поверненні ефекти запускаються знову; DOM лишається з `display: none`, тож відео грає далі, а глобальні стилі діють.
>
> 📚 [[Next.js - 04. Навігація під капотом#🪟 Activity: стан сторінок, що пішли зі сцени|Розділ: Activity]] · [Next.js: Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)

> [!question]- Коли змінюється useRouter().bfcacheId?
> *рідко · код* · `nextjs-core-04-card-11`
>
> На push і replace (`Link`, `router.push`, `router.replace`) — навіть коли прихована сторінка відновлюється з Activity. Не змінюється на back/forward, `router.refresh()` і навігаціях лише по `searchParams` чи hash.
>
> 📚 [[Next.js - 04. Навігація під капотом#🔑 bfcacheId і свідоме скидання|Розділ: bfcacheId]] · [Next.js: useRouter → bfcacheId](https://nextjs.org/docs/app/api-reference/functions/use-router#bfcacheid)

> [!question]- Чому prefetch={true} без Partial Prefetching може коштувати грошей?
> *іноді · продуктивність* · `nextjs-core-04-card-12`
>
> Кожне видиме посилання запускає повний серверний рендер маршруту разом із динамічними даними (`Cache-Control: private, no-cache`), навіть без кліку. На сітках карток це множить CPU і запити до БД; з Partial Prefetching shell спільний, а per-link prefetch бере лише закешоване.
>
> 📚 [[Next.js - 04. Навігація під капотом#🎚️ Значення prop prefetch|Розділ: prop prefetch]] · [Next.js: Adopting Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching#migrate-existing-full-prefetches)

> [!question]- Що перевіряє segment config instant і де падає валідація?
> *іноді · теорія* · `nextjs-core-04-card-13`
>
> Що навігація в сегмент дає миттєвий UI (статичне, закешоване, fallback-и). `true` / `false` / `{ level: 'warning' }`, лише з Cache Components і не в Client Component. Валідація працює тільки в `next dev` (dev overlay), збірку не блокує; `instant = false` дозволяє маршруту блокувати.
>
> 📚 [[Next.js - 04. Навігація під капотом#⚡ Instant navigation одним розділом|Розділ: instant navigation]] · [Next.js: instant segment config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant)

## 🛠️ Практика

> [!quiz] Склади, що відбувається від появи посилання до нового екрана
> level: middle · type: order · id: nextjs-core-04-quiz-11
>
> Продакшн, `cacheComponents: true`, сторінка `/products/1` з кешованою назвою й «живим» складом під `<Suspense>`.
>
> ```order
> Link проходить hydration і потрапляє у viewport
> Роутер завантажує дерево маршруту (/_tree) і сегмент сторінки (__PAGE__)
> Користувач клікає — роутер знаходить сегменти в Client Cache
> React одразу показує назву товару й fallback «Перевіряємо наявність…»
> Іде запит з Next-Router-State-Tree за динамічною частиною
> Payload складу стрімиться в межу Suspense
> Сервер віддає новий HTML-документ сторінки ✗
> ```
>
> **Пояснення:** prefetch стартує після hydration і появи у viewport, по сегментах. Клік рендерить усе, що вже є, і лише потім дотягує динамічне. HTML на soft navigation не потрібен — це шлях hard navigation.

> [!task] Client Cache: узяти з кешу чи піти на сервер
> level: middle · difficulty: medium · id: nextjs-core-04-task-01 · tags: client-cache, staleTimes, fake-timers
>
> Напиши спрощену модель Client Cache — `createClientCache(staleTimes)`. Вона повертає обʼєкт з методами, кожен з яких відповідає `'reuse'` (взяти з памʼяті) або `'fetch'` (піти на сервер):
>
> - `navigate(url, kind)` — перехід уперед. `kind` — `'static'` або `'dynamic'`. Запис свіжий, поки з моменту завантаження минуло **менше** `stale` секунд; тоді `'reuse'`, інакше `'fetch'` і запис оновлюється з поточним часом;
> - `stale` для `'static'` — `staleTimes.static` (за замовчуванням 300), але **не менше 30**; для `'dynamic'` — `staleTimes.dynamic` (за замовчуванням 0), без мінімуму;
> - `traverse(url, kind)` — back/forward: будь-який наявний запис береться без перевірки віку; якщо запису немає — `'fetch'`;
> - `refresh(url, kind)` — `router.refresh()`: завжди `'fetch'` і новий запис;
> - `invalidateAll()` — revalidation у Server Action: видаляє всі записи, нічого не повертає.
>
> Час бери з `Date.now()` — тести керують ним через фейкові таймери. Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts
> const cache = createClientCache()
> cache.navigate('/blog', 'static') // → 'fetch'
> cache.navigate('/blog', 'static') // → 'reuse'
> ```
>
> ```ts starter
> type Kind = 'static' | 'dynamic'
> type Decision = 'reuse' | 'fetch'
> type StaleTimes = { static: number; dynamic: number }
>
> function createClientCache(staleTimes: Partial<StaleTimes> = {}) {
>   // твій код
>   return {
>     navigate(url: string, kind: Kind): Decision {
>       return 'fetch'
>     },
>     traverse(url: string, kind: Kind): Decision {
>       return 'fetch'
>     },
>     refresh(url: string, kind: Kind): Decision {
>       return 'fetch'
>     },
>     invalidateAll(): void {},
>   }
> }
> ```
>
> ```ts tests
> test('статична сторінка береться з кешу 5 хвилин', () => {
>   vi.useFakeTimers()
>   const cache = createClientCache()
>   expect(cache.navigate('/blog', 'static')).toBe('fetch')
>   vi.advanceTimersByTime(299_999)
>   expect(cache.navigate('/blog', 'static')).toBe('reuse')
>   vi.advanceTimersByTime(1)
>   expect(cache.navigate('/blog', 'static')).toBe('fetch')
> })
>
> test('динамічна сторінка за замовчуванням щоразу йде на сервер', () => {
>   vi.useFakeTimers()
>   const cache = createClientCache()
>   expect(cache.navigate('/live', 'dynamic')).toBe('fetch')
>   expect(cache.navigate('/live', 'dynamic')).toBe('fetch')
> })
>
> test('staleTimes.dynamic задає час життя без мінімуму', () => {
>   vi.useFakeTimers()
>   const cache = createClientCache({ dynamic: 10 })
>   cache.navigate('/live', 'dynamic')
>   vi.advanceTimersByTime(9_999)
>   expect(cache.navigate('/live', 'dynamic')).toBe('reuse')
>   vi.advanceTimersByTime(1)
>   expect(cache.navigate('/live', 'dynamic')).toBe('fetch')
> })
>
> test('статичний запис живе щонайменше 30 секунд', () => {
>   vi.useFakeTimers()
>   const cache = createClientCache({ static: 5 })
>   cache.navigate('/blog', 'static')
>   vi.advanceTimersByTime(29_000)
>   expect(cache.navigate('/blog', 'static')).toBe('reuse')
>   vi.advanceTimersByTime(1_000)
>   expect(cache.navigate('/blog', 'static')).toBe('fetch')
> })
>
> test('back/forward бере наявний запис без перевірки віку', () => {
>   vi.useFakeTimers()
>   const cache = createClientCache()
>   cache.navigate('/live', 'dynamic')
>   vi.advanceTimersByTime(600_000)
>   expect(cache.traverse('/live', 'dynamic')).toBe('reuse')
>   expect(cache.traverse('/never-visited', 'dynamic')).toBe('fetch')
> })
>
> test('refresh і invalidateAll змушують піти на сервер', () => {
>   vi.useFakeTimers()
>   const cache = createClientCache()
>   cache.navigate('/blog', 'static')
>   expect(cache.refresh('/blog', 'static')).toBe('fetch')
>   expect(cache.navigate('/blog', 'static')).toBe('reuse')
>   cache.invalidateAll()
>   expect(cache.navigate('/blog', 'static')).toBe('fetch')
>   cache.invalidateAll()
>   expect(cache.traverse('/blog', 'static')).toBe('fetch')
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай `Map` з `url` → `{ kind, fetchedAt }`. Окрема функція `ttl(kind)` повертає секунди з урахуванням мінімуму для `'static'`.
>
> > [!hint]- Підказка 2
> > Свіжість — строга нерівність: `Date.now() - fetchedAt < ttl * 1000`. `'reuse'` не оновлює `fetchedAt`: час рахується від завантаження, а не від останнього показу.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Kind = 'static' | 'dynamic'
> > type Decision = 'reuse' | 'fetch'
> > type StaleTimes = { static: number; dynamic: number }
> >
> > function createClientCache(staleTimes: Partial<StaleTimes> = {}) {
> >   const config: StaleTimes = { static: 300, dynamic: 0, ...staleTimes }
> >   const entries = new Map<string, { kind: Kind; fetchedAt: number }>()
> >
> >   const ttl = (kind: Kind) => (kind === 'static' ? Math.max(config.static, 30) : config.dynamic)
> >
> >   function load(url: string, kind: Kind): Decision {
> >     entries.set(url, { kind, fetchedAt: Date.now() })
> >     return 'fetch'
> >   }
> >
> >   return {
> >     navigate(url: string, kind: Kind): Decision {
> >       const entry = entries.get(url)
> >       if (entry && Date.now() - entry.fetchedAt < ttl(entry.kind) * 1000) return 'reuse'
> >       return load(url, kind)
> >     },
> >     traverse(url: string, kind: Kind): Decision {
> >       return entries.has(url) ? 'reuse' : load(url, kind)
> >     },
> >     refresh(url: string, kind: Kind): Decision {
> >       return load(url, kind)
> >     },
> >     invalidateAll(): void {
> >       entries.clear()
> >     },
> >   }
> > }
> > ```
> >
> > Модель спрощена: справжній роутер кешує не URL, а сегменти (спільний layout лежить один раз), а `stale` приходить із сервера в `x-nextjs-stale-time`. Але правила вибору ті самі: перехід уперед дивиться на вік, back/forward — ні, а `router.refresh()` і revalidation у Server Action обходять `stale`.

> [!task] Activity: які сторінки збережуть стан
> level: middle · difficulty: medium · id: nextjs-core-04-task-02 · tags: activity, bfcacheId, lru
>
> Змоделюй, як Next.js з Cache Components зберігає сторінки через `<Activity>`. Напиши `createActivity(limit = 3)` з двома методами:
>
> - `navigate(url, kind)` — `kind`: `'push'`, `'replace'` або `'traverse'` (back/forward). Повертає `{ state, bfcacheId }`:
>   - маршрут — це pathname (`url` без `?…` і `#…`);
>   - `state: 'restored'`, якщо маршрут є серед збережених, інакше `'fresh'`;
>   - збережено не більше `limit` маршрутів **разом із поточним**; відвіданий маршрут стає найсвіжішим, зайвий найстаріший витісняється;
>   - `bfcacheId` — число. Новий маршрут отримує новий id (лічильник з 1). Відновлений маршрут на `'push'`/`'replace'` отримує новий id, на `'traverse'` — зберігає старий. Навігація в межах **поточного** маршруту (змінились лише `searchParams` чи hash) id не змінює;
> - `preserved()` — масив збережених маршрутів, від найсвіжішого.
>
> ```js
> const a = createActivity()
> a.navigate('/notes', 'push') // → { state: 'fresh', bfcacheId: 1 }
> a.navigate('/blog', 'push')  // → { state: 'fresh', bfcacheId: 2 }
> a.navigate('/notes', 'traverse') // → { state: 'restored', bfcacheId: 1 }
> ```
>
> ```js starter
> function createActivity(limit = 3) {
>   // твій код
>   return {
>     navigate(url, kind) {},
>     preserved() {},
>   }
> }
> ```
>
> ```js tests
> test('зберігає до трьох маршрутів разом із поточним', () => {
>   const a = createActivity()
>   a.navigate('/notes', 'push')
>   a.navigate('/blog', 'push')
>   a.navigate('/products/1', 'push')
>   expect(a.preserved()).toEqual(['/products/1', '/blog', '/notes'])
>   a.navigate('/dashboard', 'push')
>   expect(a.preserved()).toEqual(['/dashboard', '/products/1', '/blog'])
> })
>
> test('витіснений маршрут рендериться з нуля', () => {
>   const a = createActivity()
>   for (const url of ['/notes', '/a', '/b', '/c']) a.navigate(url, 'push')
>   expect(a.navigate('/notes', 'push').state).toBe('fresh')
> })
>
> test('back/forward відновлює стан і зберігає bfcacheId', () => {
>   const a = createActivity()
>   const first = a.navigate('/notes', 'push')
>   a.navigate('/blog', 'push')
>   expect(a.navigate('/notes', 'traverse')).toEqual({ state: 'restored', bfcacheId: first.bfcacheId })
> })
>
> test('push на збережений маршрут відновлює стан, але дає новий bfcacheId', () => {
>   const a = createActivity()
>   const first = a.navigate('/notes', 'push')
>   a.navigate('/blog', 'push')
>   const again = a.navigate('/notes', 'push')
>   expect(again.state).toBe('restored')
>   expect(again.bfcacheId).not.toBe(first.bfcacheId)
> })
>
> test('повернення оновлює порядок: відвіданий маршрут стає найсвіжішим', () => {
>   const a = createActivity()
>   a.navigate('/notes', 'push')
>   a.navigate('/blog', 'push')
>   a.navigate('/notes', 'traverse')
>   a.navigate('/c', 'push')
>   a.navigate('/d', 'push')
>   expect(a.preserved()).toEqual(['/d', '/c', '/notes'])
> })
>
> test('зміна лише searchParams чи hash не змінює bfcacheId', () => {
>   const a = createActivity()
>   const first = a.navigate('/products', 'push')
>   expect(a.navigate('/products?sort=price', 'push')).toEqual({ state: 'restored', bfcacheId: first.bfcacheId })
>   expect(a.navigate('/products#reviews', 'replace').bfcacheId).toBe(first.bfcacheId)
>   expect(a.preserved()).toEqual(['/products'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай масив `{ path, bfcacheId }` від найсвіжішого до найстарішого. На кожній навігації знайди маршрут, вийми його й постав на початок; після цього обріж масив до `limit`.
>
> > [!hint]- Підказка 2
> > Запамʼятай поточний маршрут (`routes[0]`) **до** перестановки: якщо `path` збігається з ним, це навігація по `searchParams` чи hash, і id лишається.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createActivity(limit = 3) {
> >   let lastId = 0
> >   const routes = [] // від найсвіжішого: { path, bfcacheId }
> >   const pathOf = (url) => url.split(/[?#]/)[0]
> >
> >   function navigate(url, kind) {
> >     const path = pathOf(url)
> >     const current = routes[0]
> >     const index = routes.findIndex((r) => r.path === path)
> >     let entry
> >     let state
> >     if (index === -1) {
> >       entry = { path, bfcacheId: ++lastId }
> >       state = 'fresh'
> >     } else {
> >       entry = routes.splice(index, 1)[0]
> >       state = 'restored'
> >       const sameRoute = current !== undefined && current.path === path
> >       if (kind !== 'traverse' && !sameRoute) entry.bfcacheId = ++lastId
> >     }
> >     routes.unshift(entry)
> >     if (routes.length > limit) routes.length = limit
> >     return { state, bfcacheId: entry.bfcacheId }
> >   }
> >
> >   return { navigate, preserved: () => routes.map((r) => r.path) }
> > }
> > ```
> >
> > Це LRU-кеш із ключем pathname. На 16.3.8 у браузері бачимо те саме: на `/dashboard` після `/notes → /blog → /products/1` в DOM лише три маршрути, а `bfcacheId` росте на кожен `Link` навіть до збереженої сторінки. Справжній `bfcacheId` — непрозорий рядок (`_b_4_`), не число: порівнювати його можна лише на рівність.

> [!task] Що prefetch-не це посилання
> level: senior · difficulty: hard · id: nextjs-core-04-task-03 · tags: prefetching, partial-prefetching, config
>
> Напиши `decidePrefetch(env, link, route)` — що Next.js 16.3 завантажить заздалегідь для посилання. Поверни один із рядків:
> `'none'`, `'full'` (увесь маршрут з динамічними даними), `'until-loading'` (до `loading.tsx`), `'cached'` (закешований рендер сторінки), `'app-shell'`, `'app-shell+url-data'`.
>
> Вхід: `env = { mode: 'dev' | 'prod', cacheComponents, partialPrefetching }`, `link = { prefetch?: 'auto' | null | true | false, visible, hovered }`, `route = { segment?: 'auto' | 'partial' | 'force-disabled', isStatic, hasLoading }`.
>
> Правила, по черзі:
>
> 1. Помилки конфігурації — `throw new Error(...)`: `partialPrefetching` без `cacheComponents` (у тексті — `partialPrefetching`); `segment`, відмінний від `'auto'`, без `cacheComponents` (у тексті — `cacheComponents`). Помилки перевіряються навіть у dev.
> 2. `'none'`: dev-режим; `prefetch === false`; посилання не видно й на нього не навели; `segment === 'force-disabled'`.
> 3. Без Cache Components: `prefetch === true` або статичний маршрут — `'full'`; динамічний — `'until-loading'`, якщо є `loading.tsx`, інакше `'none'`.
> 4. З Cache Components і Partial Prefetching (глобально або `segment === 'partial'`): `'app-shell+url-data'` для `prefetch === true`, інакше `'app-shell'`.
> 5. З Cache Components без Partial Prefetching: `'full'` для `prefetch === true`, інакше `'cached'`.
>
> `prefetch` не вказано, `'auto'` і `null` — одне й те саме.
>
> ```ts starter
> type Env = { mode: 'dev' | 'prod'; cacheComponents: boolean; partialPrefetching: boolean }
> type LinkInfo = { prefetch?: 'auto' | null | boolean; visible: boolean; hovered: boolean }
> type RouteInfo = { segment?: 'auto' | 'partial' | 'force-disabled'; isStatic: boolean; hasLoading: boolean }
> type Plan = 'none' | 'full' | 'until-loading' | 'cached' | 'app-shell' | 'app-shell+url-data'
>
> function decidePrefetch(env: Env, link: LinkInfo, route: RouteInfo): Plan {
>   // твій код
>   return 'none'
> }
> ```
>
> ```ts tests
> const prod = { mode: 'prod', cacheComponents: true, partialPrefetching: false } as const
> const pp = { ...prod, partialPrefetching: true }
> const legacy = { ...prod, cacheComponents: false }
> const visible = { visible: true, hovered: false }
> const page = { isStatic: false, hasLoading: false }
>
> test('у dev prefetch немає, але помилки конфігурації видно', () => {
>   expect(decidePrefetch({ ...prod, mode: 'dev' }, { prefetch: true, ...visible }, page)).toBe('none')
>   expect(() => decidePrefetch({ mode: 'dev', cacheComponents: false, partialPrefetching: true }, visible, page)).toThrow('partialPrefetching')
> })
>
> test('без Cache Components: static повністю, dynamic до loading.tsx або ніяк', () => {
>   expect(decidePrefetch(legacy, visible, { isStatic: true, hasLoading: false })).toBe('full')
>   expect(decidePrefetch(legacy, visible, { isStatic: false, hasLoading: true })).toBe('until-loading')
>   expect(decidePrefetch(legacy, { prefetch: null, ...visible }, page)).toBe('none')
>   expect(decidePrefetch(legacy, { prefetch: true, ...visible }, page)).toBe('full')
> })
>
> test('Cache Components без Partial Prefetching: cached або повний prefetch', () => {
>   expect(decidePrefetch(prod, { prefetch: 'auto', ...visible }, page)).toBe('cached')
>   expect(decidePrefetch(prod, { prefetch: true, ...visible }, page)).toBe('full')
> })
>
> test('Partial Prefetching глобально або на сегменті дає App Shell', () => {
>   expect(decidePrefetch(pp, visible, page)).toBe('app-shell')
>   expect(decidePrefetch(pp, { prefetch: true, ...visible }, page)).toBe('app-shell+url-data')
>   expect(decidePrefetch(prod, { prefetch: true, ...visible }, { ...page, segment: 'partial' })).toBe('app-shell+url-data')
> })
>
> test('false, невидиме посилання і force-disabled вимикають prefetch', () => {
>   expect(decidePrefetch(pp, { prefetch: false, visible: true, hovered: true }, page)).toBe('none')
>   expect(decidePrefetch(pp, { visible: false, hovered: false }, page)).toBe('none')
>   expect(decidePrefetch(pp, { visible: false, hovered: true }, page)).toBe('app-shell')
>   expect(decidePrefetch(pp, { prefetch: true, ...visible }, { ...page, segment: 'force-disabled' })).toBe('none')
> })
>
> test('segment config без cacheComponents — помилка', () => {
>   expect(() => decidePrefetch(legacy, visible, { ...page, segment: 'partial' })).toThrow('cacheComponents')
>   expect(decidePrefetch(legacy, visible, { ...page, segment: 'auto', isStatic: true })).toBe('full')
> })
> ```
>
> > [!hint]- Підказка 1
> > Порядок перевірок важливий: спершу помилки конфігурації (вони не залежать від режиму), потім усі причини `'none'`, і лише потім гілки за `cacheComponents` і Partial Prefetching.
>
> > [!hint]- Підказка 2
> > Нормалізуй prop: `const full = link.prefetch === true`. Значення `undefined`, `'auto'` і `null` дають одну гілку, `false` уже відсіяно раніше.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Env = { mode: 'dev' | 'prod'; cacheComponents: boolean; partialPrefetching: boolean }
> > type LinkInfo = { prefetch?: 'auto' | null | boolean; visible: boolean; hovered: boolean }
> > type RouteInfo = { segment?: 'auto' | 'partial' | 'force-disabled'; isStatic: boolean; hasLoading: boolean }
> > type Plan = 'none' | 'full' | 'until-loading' | 'cached' | 'app-shell' | 'app-shell+url-data'
> >
> > function decidePrefetch(env: Env, link: LinkInfo, route: RouteInfo): Plan {
> >   const segment = route.segment ?? 'auto'
> >   if (env.partialPrefetching && !env.cacheComponents) {
> >     throw new Error('partialPrefetching requires cacheComponents')
> >   }
> >   if (segment !== 'auto' && !env.cacheComponents) {
> >     throw new Error(`segment prefetch = '${segment}' requires cacheComponents`)
> >   }
> >
> >   if (env.mode === 'dev') return 'none'
> >   if (link.prefetch === false) return 'none'
> >   if (!link.visible && !link.hovered) return 'none'
> >   if (segment === 'force-disabled') return 'none'
> >
> >   const full = link.prefetch === true
> >   if (!env.cacheComponents) {
> >     if (full || route.isStatic) return 'full'
> >     return route.hasLoading ? 'until-loading' : 'none'
> >   }
> >   if (env.partialPrefetching || segment === 'partial') {
> >     return full ? 'app-shell+url-data' : 'app-shell'
> >   }
> >   return full ? 'full' : 'cached'
> > }
> > ```
> >
> > Модель повторює таблицю «What changes for `<Link>`» з документації й наші заміри у Network. Спрощення: `'force-disabled'` насправді все одно дає prefetch дерева маршруту й метаданих, а per-link prefetch до сегмента `'partial'` захоплює глибші сегменти, навіть якщо ті `'force-disabled'`.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating) — prefetching, streaming, клієнтські переходи й що робить їх повільними.
- 🟡 [Next.js — Prefetching](https://nextjs.org/docs/app/guides/prefetching) — що prefetch-иться автоматично, черга, hover-prefetch, побічні ефекти.
- 🟡 [Next.js — Adopting Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) — що змінюється для `Link`, поступовий перехід, `prefetch = 'partial'`.
- 🔴 [Next.js — Optimizing prefetching](https://nextjs.org/docs/app/guides/optimizing-prefetching) — App Shell, per-link prefetch, сесійні дані й `'use cache: private'`.
- 🟡 [Next.js — Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state) — Activity, патерни скидання стану, тестування прихованих сторінок.
- 🔴 [Next.js — Instant navigation](https://nextjs.org/docs/app/guides/instant-navigation) — валідація, Navigation Inspector, `instant()` з `@next/playwright`.
- 🟡 [Next.js — Link](https://nextjs.org/docs/app/api-reference/components/link) — `prefetch`, `scroll`, `replace`, `onNavigate`, `transitionTypes`.
- 🟡 [Next.js — useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router) — `refresh`, `prefetch` з `onInvalidate`, `bfcacheId`.
- 🛠️ [Next.js — staleTimes](https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes) — час життя в Client Cache (experimental).
- 🔴 [React — Activity](https://react.dev/reference/react/Activity) — як React ховає дерево й що відбувається з ефектами.

> [!important] Підсумок
> - Клік по `Link` — soft navigation: браузер бере сегменти з Client Cache і дотягує лише відсутнє запитом `?_rsc=` з `RSC: 1`. HTML — тільки на першому заході й hard navigation (`<a>`, інший root layout, `window.location`).
> - Prefetch працює лише в продакшні, для посилань у viewport або при наведенні, по сегментах. `prefetch={false}` вимикає його повністю, `prefetch={true}` без Partial Prefetching — дорогий повний рендер на кожне посилання.
> - `partialPrefetching: true` (потребує `cacheComponents`) дає один App Shell на маршрут; URL-дані й «живі» дані стрімляться після кліку. Поступово — `export const prefetch = 'partial'`; для рідких сторінок — `'force-disabled'`.
> - Перехід уперед бере кеш, поки свіжий `stale` (закешоване — мінімум 30 с, динамічне — `staleTimes.dynamic`, за замовчуванням 0); back/forward — завжди збережене. `router.refresh()` — з клієнта, `refresh()` — у Server Action.
> - З Cache Components сторінки ховаються через `<Activity>`: до трьох маршрутів зберігають стан, ефекти проходять cleanup. Скидай тимчасовий UI явно; `bfcacheId` змінюється на push/replace і зберігається на back/forward.

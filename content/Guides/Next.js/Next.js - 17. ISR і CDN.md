---
title: ISR і CDN
id: nextjs-core-17
slug: 17-isr-cdn
order: 17
level: senior
skill: data
icon: px:database
tags: [nextjs, isr, cdn, cache-control, stale-while-revalidate, generate-static-params, cache-components, vercel]
prerequisites: ["[[Next.js - 12. Partial Prerendering і Cache Components]]", "[[Next.js - 15. Cache Components і use cache]]"]
estimatedMinutes: 55
nextVersion: 16.3.8
---

# ISR і CDN

> [!success] 🎯 Після цього розділу ти зможеш
> - налаштувати ISR під Cache Components: `generateStaticParams` для популярних сторінок, App Shell для решти, час життя з `cacheLife` і теги з `cacheTag`;
> - передбачити, що станеться з URL зі списку й поза ним при першому, другому й «простроченому» запиті;
> - прочитати заголовки відповіді (`Cache-Control`, `x-nextjs-cache`, `x-nextjs-postponed`, `Vary`) і вирахувати `Cache-Control` з профілів `cacheLife`;
> - пояснити, як CDN (Vercel і будь-який інший) кешує HTML, RSC payload і статичні файли, і чому `revalidateTag` сам до CDN не доходить;
> - намалювати шари кешу від клієнтського router cache до джерела даних і сказати, який шар зачіпає кожна інвалідація;
> - впізнати стару модель ISR (`export const revalidate`, `fetch` з `next.revalidate`) і перекласти її на Cache Components.

## 🤔 Передбач

> [!quiz] Що опиниться в Cache-Control?
> level: middle · type: output · id: nextjs-core-17-quiz-01
>
> Застосунок з `cacheComponents: true`. Сторінка `/products/kettle` є в `generateStaticParams`, а дані беруться з функції під `'use cache'`:
>
> ```ts
> export async function getProduct(slug: string) {
>   'use cache'
>   cacheLife('minutes') // stale 5 хв · revalidate 1 хв · expire 1 год
>   return db[slug]
> }
> ```
>
> Після `next build && next start` ти робиш `curl -I /products/kettle`. Який `Cache-Control` прийде?
>
> - [x] `s-maxage=60, stale-while-revalidate=3540`
> - [ ] `max-age=300`
> - [ ] `s-maxage=300, stale-while-revalidate=3300`
> - [ ] `private, no-cache, no-store, max-age=0, must-revalidate`
>
> **Пояснення:** не переймайся, якщо помилився: розберемо нижче. Сторінка повністю пререндерена, тож це ISR-запис, і числа беруться з профілю: `s-maxage` = `revalidate` (60), `stale-while-revalidate` = `expire − revalidate` (3600 − 60). `stale` (300 с) у `Cache-Control` не потрапляє, він їде окремо в `x-nextjs-stale-time` для клієнтського router cache. `private, no-store` була б у сторінки з частиною на запит, а тут усе закешоване.

## 🧒 Простими словами

Уяви мережу пекарень. Тісто місять на центральній кухні — це сервер Next.js. У кожному районі є вітрина — це CDN: там лежать готові булки, і покупець бере їх за секунду, кухня навіть не знає про нього. На кожній булці наклейка «свіжа 1 хвилину, продавати можна ще годину». Поки хвилина не минула, вітрина просто продає. Минула — вітрина все одно віддає цю булку, але дзвонить на кухню: «спечіть нову». Це stale-while-revalidate, і на ньому тримається ISR. Найпопулярніші булки печуть до відкриття (`generateStaticParams`). Рідкісну булку, якої немає на вітрині, першому покупцеві дають як заготовку з начинкою, що доїжджає (App Shell), а кухня тим часом пече цілу для наступного. Головна заковика: якщо кухня змінила рецепт (`revalidateTag`), вітрина про це не дізнається, поки хтось не подзвонить їй окремо.

## 🔬 Як це працює насправді

### 🧭 Що таке ISR і навіщо він досі потрібен

Є дві крайності. **Статична** сторінка рендериться на `next build` і далі віддається з диска чи CDN: мілісекунди, нуль роботи сервера, але дані заморожені до наступного деплою. **Динамічна** сторінка рендериться на кожен запит: дані свіжі, але кожен відвідувач — це виклик функції, запит у базу й рахунок за обчислення.

**Incremental Static Regeneration (ISR)** — середина між ними: сторінка віддається як статична, але має **час життя**. Коли він минає, наступний запит отримує ще стару версію, а сервер у фоні рендерить нову й кладе її в кеш. «Incremental» тут подвійне: оновлюється одна сторінка, а не весь сайт, і сторінки, яких не було на збірці, можна додавати по одній, у міру того як їх хтось відкриває.

ISR відповідає на три питання:

1. **Що пререндерити на збірці?** Популярне — `generateStaticParams`.
2. **Що робити з рештою URL?** Віддати швидко, а потім закешувати.
3. **Коли оновлювати?** За часом (`cacheLife`) або на подію (`revalidateTag`, `revalidatePath`).

У Next.js 16 є дві моделі з однаковою механікою й різними API: **Cache Components** (курс вчить її) і **попередня** — у [[#🕰️ Було → стало: ISR без Cache Components]].

### 🧱 ISR під Cache Components: три деталі

Під Cache Components окремого «ISR-перемикача» немає. ISR складається з трьох деталей, які ти вже знаєш з попередніх тем:

- **`generateStaticParams`** — які параметри відомі на збірці ([[Next.js - 03. Динамічні маршрути]]). Під Cache Components він має повернути **хоча б один** параметр.
- **App Shell** — URL-незалежний shell маршруту для параметрів, яких у списку немає ([[Next.js - 12. Partial Prerendering і Cache Components]]). Якщо `params` читаються всередині `<Suspense>` (App Shell не порожній), то щоб такий URL після першого візиту «доріс» до повної сторінки в кеші, потрібен ще `partialPrefetching: true` (з 16.3).
- **Час життя і теги** — з `cacheLife` і `cacheTag` усередині `'use cache'` ([[Next.js - 15. Cache Components і use cache]]). Окремого `revalidate` для сторінки немає: сторінка живе стільки, скільки найкоротше з її закешованих даних.

Конфіг, як радить гайд ISR with Cache Components:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true, // 16.3: апгрейд App Shell після першого візиту
}

export default nextConfig
```

Дані — функції з `'use cache'`. Профіль `minutes` означає: клієнт може тримати дані 5 хвилин (`stale`), сервер оновлює їх у фоні не частіше ніж раз на хвилину (`revalidate`), а через годину без запитів запис вважається простроченим (`expire`):

```ts
// app/lib/data.ts
import { cacheLife, cacheTag } from 'next/cache'

type Product = { slug: string; name: string; price: number }

// «БД» у памʼяті: у справжньому застосунку тут запит до бази
const db: Record<string, Product> = {
  kettle: { slug: 'kettle', name: 'Чайник', price: 1200 },
  mug: { slug: 'mug', name: 'Чашка', price: 250 },
  lamp: { slug: 'lamp', name: 'Лампа', price: 900 },
}

export async function getProduct(slug: string) {
  'use cache'
  cacheLife('minutes') // stale 5 хв · revalidate 1 хв · expire 1 год
  cacheTag('products', `product-${slug}`)
  const product = db[slug]
  return product ? { ...product, renderedAt: new Date().toISOString() } : null
}

export async function getPopularSlugs() {
  'use cache'
  cacheLife('hours')
  return ['kettle', 'mug']
}
```

`renderedAt` — мітка часу рендеру. Вона потрібна лише для експериментів у цьому розділі: за нею видно, коли сторінку перегенерували.

> [!note] Чому в прикладах дані в памʼяті
> Обʼєкт `db` замінює базу, щоб приклади запускалися без зовнішніх сервісів. Кешування від цього не змінюється: `getProduct` стоїть під `'use cache'`, тож справжній запит до БД поводився б так само. Без `'use cache'` таке читання під Cache Components вимагало б `<Suspense>` — про це в темах 11–12 і 14–16 основного посібника.

Сторінка товару читає `params` **усередині** `<Suspense>`, щоб App Shell для невідомих slug мав хоч щось, крім fallback:

```tsx
// app/products/[slug]/page.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProduct, getPopularSlugs } from '@/app/lib/data'

export async function generateStaticParams() {
  const slugs = await getPopularSlugs()
  return slugs.map((slug) => ({ slug })) // ≥ 1 параметр — інакше помилка збірки
}

export default function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  return (
    <main>
      <p>Магазин «Loo»</p>
      <Suspense fallback={<p>Завантажуємо товар…</p>}>
        <ProductDetails params={params} />
      </Suspense>
    </main>
  )
}

async function ProductDetails({ params }: Pick<PageProps<'/products/[slug]'>, 'params'>) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.price} ₴</p>
      <small>згенеровано: {product.renderedAt}</small>
    </article>
  )
}
```

Вивід `next build` (фрагмент; у застосунку є ще кілька сторінок):

```console
Route (app)             Revalidate  Expire
┌ ○ /
├   /products/[slug]
│ ├ ◐ /products/[slug]
│ ├ ○ /products/kettle          1m      1h
│ └ ○ /products/mug             1m      1h
```

Як це читати:

- **`○ /products/kettle` і `/products/mug`** — повністю статичні сторінки: усі дані під `'use cache'`, параметр відомий. Колонки `1m / 1h` — це `revalidate` і `expire` найкоротшого кешу на сторінці, тобто ISR-час життя. Таблиця друкує ці колонки, лише якщо хоча б один маршрут верхнього рівня (не дочірній рядок `generateStaticParams`) має `revalidate` чи `expire`; інакше їх немає й для дочірніх сторінок.
- **`◐ /products/[slug]`** — App Shell: «Магазин «Loo»» і fallback «Завантажуємо товар…». Його отримає будь-який slug поза списком.
- Для сторінок позначки `●` (SSG) зі старих версій немає: сторінки з `generateStaticParams` показуються як звичайні `○` чи `◐`. Route Handlers з `generateStaticParams` і під Cache Components показуються як `●` ([[Next.js - 19. Route Handlers і Backend-for-Frontend]]).

На диску це файли в `.next/server/app/products/`: `kettle.html`, `kettle.rsc` (RSC payload), `kettle.segments/` (payload для prefetch) і `kettle.meta`, де записано теги сторінки:

```json
"x-next-cache-tags": "_N_T_/layout,_N_T_/products/layout,_N_T_/products/[slug]/layout,_N_T_/products/[slug]/page,_N_T_/products/kettle,products,product-kettle"
```

Явні теги з `cacheTag` і soft tags `_N_T_…` з шляху: тому інвалідація тегу даних інвалідує й сторінку (механіку тегів розібрано в [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers]]).

> [!quiz] Перевір себе: що покаже next build
> level: middle · type: output · id: nextjs-core-17-quiz-02
>
> `app/products/[slug]/page.tsx` читає `params` усередині `<Suspense>`, а `generateStaticParams` повертає `kettle` і `mug`. Дані взято з функції з `'use cache'` і `cacheLife('minutes')`. `cacheComponents: true`. Що буде в таблиці маршрутів для цього шляху?
>
> - [x] `◐ /products/[slug]` (App Shell) і `○ /products/kettle`, `○ /products/mug`
> - [ ] `● /products/kettle` і `● /products/mug` (SSG), як у попередніх версіях
> - [ ] `ƒ /products/[slug]`: параметр динамічний, значить маршрут динамічний
> - [ ] `○ /products/[slug]`: параметр відомий, тож shell теж повністю статичний
>
> **Пояснення:** під Cache Components позначки `●` у таблиці немає, пререндерені сторінки показуються як `○`. Для slug поза списком збірка готує App Shell, і його символ `◐`: статична частина плюс те, що доїжджає на запит. `ƒ` означало б, що весь маршрут рендериться на запит, а це не так: усе закешоване, і є пререндерені URL.

### 🔁 Життєвий цикл URL: зі списку й поза ним

На `next start` URL **зі списку** (`/products/kettle`) поводиться як класичний ISR: `HIT` у вікні `revalidate`, потім один `STALE` зі старою сторінкою і фоновим рендером, далі `HIT` зі свіжою — ніхто не чекає на рендер. URL **поза списком** (`/products/lamp`) спершу отримує App Shell і стрім (`private`, `x-nextjs-postponed: 1`), а у фоні сервер рендерить повну сторінку в `.next/server/route-cache/…/products/lamp.html`, тож другий візит — уже `HIT` з `s-maxage=60`. Prefetch теж рахується першим візитом.

> [!warning] Без partialPrefetching апгрейду непорожнього App Shell немає
> Сторінка [Dynamic Routes → With Cache Components](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#with-cache-components) каже, що сторінки з runtime-параметрами «are saved to disk after a successful first request», і не згадує жодних прапорців. На 16.3.8 це так лише частково. Якщо `params` читаються всередині `<Suspense>` (App Shell не порожній), то з лише `cacheComponents: true` другий, третій і десятий запити до `/products/lamp` отримують той самий App Shell з `x-nextjs-postponed: 1` і `private`; запис у кеш з'являється тільки з `partialPrefetching: true`, як у гайді [ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components) («Enable both»). Якщо `params` читаються над Suspense (App Shell порожній), маршрут без прапорця поводиться як старий блокуючий ISR: перший запит чекає рендер (`MISS`), далі `HIT`. Деталі про App Shell — у [[Next.js - 12. Partial Prerendering і Cache Components#🧩 Динамічні маршрути: generateStaticParams і shell|темі 12]].

А якщо прибрати `generateStaticParams` зовсім? Маршрут лишиться `◐`, але **кожен** запит буде App Shell плюс рендер на запит: `x-nextjs-postponed: 1` щоразу, і жодного `HIT`, навіть якщо всі дані під `'use cache'`. Документація формулює це так: прибрати експорт — значить відмовитися від ISR для маршруту. Порожній масив не допоможе — він зупиняє збірку з `When using Cache Components, all generateStaticParams functions must return at least one result`.

> [!diagram] Життєвий цикл двох URL у кеші маршруту
> ```yaml
> layout: timeline
> nodes:
>   - { id: build, at: "next build", label: "збірка", text: "kettle.html · [slug].html", note: "lamp у списку немає", tone: gray, icon: "px:box" }
>   - { id: hit1, at: "+10 с", label: "GET /products/kettle", text: "x-nextjs-cache: HIT", note: "s-maxage=60, stale-while-revalidate=3540", tone: green }
>   - { id: shell, at: "+20 с", label: "GET /products/lamp", text: "App Shell + стрім", note: "x-nextjs-postponed: 1 · private", tone: yellow, icon: "px:hourglass" }
>   - { id: up, at: "+20 с", label: "фон", text: "рендер lamp з відомим slug", note: "запис у route-cache", tone: violet }
>   - { id: hit2, at: "+25 с", label: "GET /products/lamp", text: "x-nextjs-cache: HIT", note: "тепер як kettle", tone: green }
>   - { id: stale, at: "+70 с", label: "GET /products/kettle", text: "x-nextjs-cache: STALE", note: "стара сторінка, фоновий рендер", tone: orange }
>   - { id: hit3, at: "+71 с", label: "GET /products/kettle", text: "x-nextjs-cache: HIT", note: "нова мітка renderedAt", tone: mint, icon: "px:check" }
> steps:
>   - { show: build, note: "Збірка пререндерить kettle і mug повністю, а для решти slug готує App Shell [slug].html." }
>   - { show: hit1, note: "kettle віддається з кешу. Час життя з cacheLife('minutes') перетворився на s-maxage=60 і stale-while-revalidate=3540." }
>   - { show: [shell, up], note: "lamp у кеші немає. Відвідувач миттєво отримує App Shell, товар доїжджає стрімом, а сервер паралельно рендерить повну сторінку lamp." }
>   - { show: hit2, note: "Другий відвідувач lamp отримує готову сторінку з кешу. Без partialPrefetching тут знову був би shell." }
>   - { show: stale, note: "Хвилина після збірки минула. kettle усе ще віддається миттєво, але з позначкою STALE: сервер почав фоновий рендер." }
>   - { show: hit3, note: "Наступний запит бачить свіжу версію. Ніхто не чекав на рендер — це і є stale-while-revalidate." }
> ```
> Дивись на `x-nextjs-cache`: `STALE` — це не помилка, а нормальна фаза ISR, після якої приходить свіжа версія.

> [!quiz] Перевір себе: два перших запити до невідомого URL
> level: senior · type: output · id: nextjs-core-17-quiz-03
>
> Налаштування: `cacheComponents: true` і `partialPrefetching: true`. Сторінка `/products/[slug]` читає `params` під `<Suspense>`, `generateStaticParams` повертає `kettle` і `mug`. Після `next build && next start` ти двічі поспіль робиш `curl -I http://localhost:3000/products/lamp` (такого slug у списку немає, у «БД» він є). Що в заголовках?
>
> - [x] 1-й: `private, no-cache, no-store…` і `x-nextjs-postponed: 1`; 2-й: `x-nextjs-cache: HIT` і `s-maxage=60`
> - [ ] 1-й: `x-nextjs-cache: MISS` і `s-maxage=60`; 2-й: `HIT`
> - [ ] Обидва `404`, бо `lamp` немає в `generateStaticParams`
> - [ ] Обидва однакові: `private` і `x-nextjs-postponed: 1`, бо URL не пререндерено
>
> **Пояснення:** перший візит це App Shell плюс стрім, відповідь `private`, а сервер у фоні рендерить повну сторінку з відомим slug і кладе в кеш маршруту. Другий запит це звичайний ISR-запис. `MISS` з `s-maxage` на першому запиті був би у старій моделі, де невідомий URL блокується повним рендером. `404` не буде: без `dynamicParams` будь-який slug рендериться, а `notFound()` викликається лише для неіснуючих даних. Варіант «обидва однакові» справедливий лише без `partialPrefetching` при непорожньому App Shell (тут `params` читаються під Suspense): тоді запис у кеш не з'являється. При порожньому shell без прапорця було б старе блокувальне ISR: `MISS`, потім `HIT`.

> [!quiz] Перевір себе: життєвий цикл ISR-сторінки kettle
> level: middle · type: order · id: nextjs-core-17-quiz-04
>
> Склади по порядку, що відбувається зі сторінкою `/products/kettle` з `cacheLife('minutes')`. Один пункт зайвий.
>
> ```order
> `next build` пререндерить kettle.html і кладе в кеш маршруту
> Запити протягом першої хвилини: `x-nextjs-cache: HIT`
> Після `revalidate` перший запит отримує стару сторінку з `x-nextjs-cache: STALE`
> Сервер у фоні рендерить нову версію
> Нова версія замінює запис у кеші
> Наступний запит: `x-nextjs-cache: HIT` з новою міткою `renderedAt`
> Запит після `revalidate` чекає, поки закінчиться новий рендер ✗
> ```
>
> **Пояснення:** суть stale-while-revalidate в тому, що користувач, який «спізнився», не чекає: він отримує стару копію одразу, а рендер іде у фоні. Лише коли минув `expire` без жодного запиту, запис вважається простроченим і запит справді чекає на рендер, але це інший сценарій.

### 🚫 Неіснуючі slug і статус-коди

Під Cache Components `dynamicParams` немає: його експорт зупиняє збірку з `Route segment config "dynamicParams" is not compatible with nextConfig.cacheComponents. Please remove it.` Будь-який slug рендериться на запит, а неіснуючий відсікає `notFound()`. І тут ISR додає неприємний поворот.

Для `/products/nope` (такого товару немає) перший візит — `200`: shell уже пішов у відповідь, коли `ProductDetails` викликав `notFound()`, а статус після початку стріму не змінити. React вставляє `<meta name="robots" content="noindex">` і UI «404: This page could not be found.» — це **soft 404**. Але далі апгрейд кладе цю сторінку в кеш маршруту, і другий запит отримує `x-nextjs-cache: HIT`, **`200`** і `Cache-Control: s-maxage=60, stale-while-revalidate=3540`. CDN закешує «сторінку-помилку» для кожного вигаданого URL, який хтось відкрив — включно з ботами, що перебирають `/products/aaaa`, `/products/aaab`…

Якщо читати `params` і викликати `notFound()` **над** Suspense, як у варіанті `/items/[slug]` нижче, App Shell цього маршруту порожній, і результат залежить від прапорця. З `partialPrefetching: true` перший візит теж `200` (порожній shell уже пішов), а закешований після апгрейду запис має справжній **`404`**. Без прапорця маршрут рендериться блокуюче, і справжній `404` приходить уже на перший запит:

```tsx
// app/items/[slug]/page.tsx — params читаємо ДО Suspense
import { notFound } from 'next/navigation'
import { getProduct, getPopularSlugs } from '@/app/lib/data'

export async function generateStaticParams() {
  const slugs = await getPopularSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ItemPage({ params }: PageProps<'/items/[slug]'>) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  return (
    <main>
      <h1>{product.name}</h1>
      <small>згенеровано: {product.renderedAt}</small>
    </main>
  )
}
```

Ціна — App Shell без жодного вмісту для невідомих slug. Документація `notFound` для Cache Components радить третій шлях: якщо потрібен справжній `404` з першого запиту, перевіряти існування ресурсу в `proxy.ts`, ще до рендеру ([[Next.js - 06. proxy.ts, redirects і rewrites]]). Як стрім фіксує статус, розібрано в [[Next.js - 11. Streaming і Suspense]] і [[Next.js - 13. Помилки й межі помилок]].

> [!quiz] Перевір себе: soft 404 у кеші
> level: senior · type: single · id: nextjs-core-17-quiz-05
>
> `cacheComponents: true` і `partialPrefetching: true`. `ProductDetails` читає `params` і викликає `notFound()` всередині `<Suspense>`, коли товару немає в «БД». Користувач (а потім бот) двічі відкриває `/products/nope`. Що отримає **другий** запит?
>
> - [x] `200` з `x-nextjs-cache: HIT` і `Cache-Control: s-maxage=60, stale-while-revalidate=3540`
> - [ ] `404`, і ніколи не кешується: помилки не потрапляють у кеш
> - [ ] `404` з `x-nextjs-cache: HIT`
> - [ ] `500`, бо `notFound()` усередині Suspense кидає помилку на другому рендері
>
> **Пояснення:** shell уже пішов у відповідь, коли викликався `notFound()`, тому перший статус `200` (soft 404 з `noindex`). Після цього апгрейд кладе таку сторінку в кеш маршруту, і другий запит отримує закешований `200`. Справжній `404` у кеші буде лише тоді, коли `params` читаються над Suspense. Чекати на нього від виклику під Suspense не можна: статус не змінити після початку стріму.

### 📨 Заголовки відповіді: що з них читати

Кеш маршруту видно в заголовках. Ось справжній `curl -I` для `kettle` на `next start` (службові `Date`, `ETag` опущено):

```console
$ curl -I http://localhost:3000/products/kettle
HTTP/1.1 200 OK
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-nextjs-cache: HIT
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
Cache-Control: s-maxage=60, stale-while-revalidate=3540
Content-Type: text/html; charset=utf-8
```

| Заголовок | Значення | Що означає |
|---|---|---|
| `Cache-Control` | `s-maxage=31536000` | статична сторінка без ревалідації: спільний кеш тримає рік |
| | `s-maxage=R, stale-while-revalidate=E−R` | ISR: свіжа `R` секунд, далі ще `E−R` секунд можна віддавати стару, оновлюючи у фоні |
| | `private, no-cache, no-store, max-age=0, must-revalidate` | є частина, відрендерена на запит: не кешувати ніде, крім браузера |
| `x-nextjs-cache` | `HIT` / `STALE` | з кешу маршруту; `STALE` — віддано старе, у фоні йде рендер |
| | `MISS` / `REVALIDATED` | `MISS` — запису не було, рендер на запит (стара модель або маршрут з порожнім App Shell без `partialPrefetching`); `REVALIDATED` — запис прострочено (`expire` минув), блокуючий рендер |
| `x-nextjs-postponed` | `1` | відповідь = static shell + відкладена частина, дорендерена на запит (PPR) |
| `x-nextjs-prerender` | `1` | відповідь походить з пререндеру (збірка або апгрейд) |
| `x-nextjs-stale-time` | `300` | `stale` для клієнтського router cache, у секундах |
| `Vary` | `rsc, next-router-…` | ця URL має кілька варіантів: HTML, RSC payload, prefetch |

Кілька неочевидних деталей.

**`s-maxage`, а не `max-age`.** `s-maxage` — інструкція лише для **спільних** кешів (CDN, reverse proxy): CDN можна очистити, а кеш у браузері користувача — ні.

Але браузер не ігнорує заголовок повністю. `s-maxage` він пропускає, а `stale-while-revalidate` застосовує сам: Chrome після ревалідації може віддати перший `fetch` чи prefetch зі свого дискового кешу зі старим вмістом (DevTools показує transfer size 0), і лише наступний буде свіжим (як це видно після дій — [[Next.js - 16. Ревалідація]]). Vercel цю проблему знімає: браузер отримує `public, max-age=0, must-revalidate`. На self-hosting переписуй `Cache-Control` для браузера на проксі або віддавай TTL для CDN через `CDN-Cache-Control`.

**Звідки беруться числа.** `s-maxage` = `revalidate` профілю, `stale-while-revalidate` = `expire − revalidate`. Для `minutes`: 60 і 3600 − 60 = 3540. Для `max` (`revalidate` 30 днів, `expire` 1 рік): `s-maxage=2592000, stale-while-revalidate=28944000`. А `stale` у `Cache-Control` не потрапляє зовсім — він їде окремо, в `x-nextjs-stale-time`, і стосується лише клієнтського кешу.

**Сторінка бере найкоротше.** Якщо сторінка викликає дві закешовані функції — `cacheLife('hours')` (1 год / 1 день) і `cacheLife({ revalidate: 900, expire: 86400 })`, — маршрут отримує мінімуми окремо для кожного поля: `s-maxage=900, stale-while-revalidate=85500`, а `next build` показує `15m  1d`.

**Короткий кеш вибиває сторінку з ISR.** `cacheLife('seconds')` має `expire` 1 хвилину. За `cacheLife#prerendering-behavior` кеш з `revalidate: 0`, з `expire` менше 5 хвилин або зі `stale` менше 30 секунд не потрапляє в пререндер і стає «динамічною діркою». Сторінка з таким кешем під Suspense — `◐`, а кожна відповідь — `private, no-cache…` з `x-nextjs-postponed: 1`. Одна функція з `'seconds'` у футері прибирає всю сторінку з CDN.

**`stale` ≠ `Cache-Control`.** Пороги 30 секунд і 5 хвилин — правила пререндеру з довідника `cacheLife` (`#prerendering-behavior`), а не з HTTP. HTTP-кеш і клієнтський router cache — різні шари, про це нижче.

> [!quiz] Перевір себе: мінімум по кожному полю
> level: senior · type: output · id: nextjs-core-17-quiz-06
>
> Сторінка викликає дві закешовані функції:
>
> ```ts
> async function a() {
>   'use cache'
>   cacheLife('hours') // revalidate 3600 · expire 86400
> }
>
> async function b() {
>   'use cache'
>   cacheLife({ revalidate: 900, expire: 86400 })
> }
> ```
>
> Який `Cache-Control` буде в маршруту після `next build && next start`?
>
> - [x] `s-maxage=900, stale-while-revalidate=85500`
> - [ ] `s-maxage=3600, stale-while-revalidate=82800`: береться довший профіль
> - [ ] `s-maxage=900, stale-while-revalidate=3600`: віднімання не від `expire`, а від `revalidate` другого профілю
> - [ ] `max-age=300`: `stale` перекладається в `max-age`
>
> **Пояснення:** маршрут бере мінімум окремо для кожного поля: `revalidate` це 900, `expire` це 86400 в обох, тож `stale-while-revalidate` = 86400 − 900 = 85500. Довший профіль зробив би сторінку застарілою довше, ніж дозволяють дані `b()`. А `stale` взагалі не потрапляє в `Cache-Control`, він їде в `x-nextjs-stale-time`.

> [!quiz] Перевір себе: заповни заголовок ISR
> level: middle · type: fill · bank: max-age, 3600, 300 · id: nextjs-core-17-quiz-07
>
> Профіль `cacheLife` має `revalidate: 60` і `expire: 3600`. Заповни `Cache-Control` ISR-сторінки.
>
> ```text fill
> Cache-Control: [[s-maxage]]=[[60]], [[stale-while-revalidate]]=[[3540]]
> ```
>
> **Пояснення:** `s-maxage` читають спільні кеші (CDN), а `max-age` кешував би HTML ще й у браузері (браузер ігнорує `s-maxage`, хоч і застосовує `stale-while-revalidate`), чого Next.js свідомо не робить. Другий параметр це `expire − revalidate` = 3600 − 60 = 3540, а не сам `expire` і не `stale`. Число 300 це `stale` клієнтського кешу, і воно їде в `x-nextjs-stale-time`.

### ⏱️ Ревалідація за часом і що буде при збої

Три поля профілю на рівні маршруту працюють так:

- **до `revalidate`** — запис свіжий: `HIT`, жодного рендеру;
- **між `revalidate` і `expire`** — запис застарів, але придатний: перший запит отримує `STALE` і запускає **один** фоновий рендер, наступні отримують свіжу версію, щойно вона готова;
- **після `expire` без жодного запиту** — запис прострочений: наступний запит чекає на новий рендер.

Ревалідація запускається **запитом**, а не таймером: сторінку, яку ніхто не відкриває, ніхто й не перегенеровує. Якщо фоновий рендер падає, Next.js **лишає останню вдалу версію** й пробує знову на наступному запиті. Тому в даних ISR-сторінки краще кинути помилку, ніж повернути «порожній» результат: порожній успішно закешується й замінить хорошу сторінку.

> [!quiz] Перевір себе: запис, який пережив expire
> level: senior · type: single · id: nextjs-core-17-quiz-08
>
> Профіль маршруту: `{ revalidate: 60, expire: 3600 }`. Сторінку востаннє рендерили, потім її не відкривав ніхто 2 години. Що станеться з наступним запитом?
>
> - [x] Він чекає на новий рендер: запис прострочений, віддавати нічого
> - [ ] Він отримає `STALE` зі старою сторінкою, а новий рендер піде у фоні
> - [ ] Він отримає `HIT`: ревалідація не запускалася, тож запис «свіжий»
> - [ ] Він отримає `404`, бо запис видалено з диска
>
> **Пояснення:** `STALE` існує лише у вікні між `revalidate` і `expire`. Далі запис непридатний, і запит чекає на рендер, як при першому візиті. Ревалідація запускається запитом, а не таймером, але це не робить запис «свіжим»: вік рахується від останнього рендеру. `expire` це відповідь на питання, наскільки старе ти готовий показати, якщо сторінку давно ніхто не відкривав.

### 🔔 On-demand: ревалідація на подію

On-demand ревалідація інвалідує запис одразу, через теги. Типова точка входу — вебхук CMS у Route Handler:

```ts
// app/api/revalidate/route.ts — вебхук CMS
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  // секрет у заголовку, а не в URL: URL потрапляють у логи
  if (request.headers.get('x-revalidate-secret') !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false }, { status: 401 })
  }
  const { slug, hard } = await request.json()
  // 'max' — stale-while-revalidate; { expire: 0 } — протермінувати негайно
  revalidateTag(`product-${slug}`, hard ? { expire: 0 } : 'max')
  return Response.json({ ok: true, slug })
}
```

Що бачимо після виклику для `kettle`:

- **`revalidateTag('product-kettle', 'max')`** — наступний запит отримує `STALE` зі старою ціною й запускає фоновий рендер, а ще наступний — `HIT` з новою. Це той самий stale-while-revalidate, тільки «таймер» спрацював одразу.
- **`revalidateTag('product-kettle', { expire: 0 })`** (з `partialPrefetching`) — запис прострочено. Наступний запит отримує App Shell і **свіжі** дані стрімом (`private`, `x-nextjs-postponed: 1`), а у фоні сторінка знову записується в кеш; третій запит — `HIT`. Ніхто не бачить стару ціну, але один запит іде повз CDN.

Який API обрати для вебхука, дії чи кнопки «оновити» — тема [[Next.js - 16. Ревалідація]]. Дві межі, важливі тут: ревалідація живе в кеші Next.js, а **не в CDN** (про це нижче), і вона **локальна для інстансу** — на трьох контейнерах вебхук інвалідує один ([[Next.js - 18. Приватний і віддалений кеш, cacheHandlers]]).

> [!quiz] Перевір себе: revalidateTag у вебхуку CMS
> level: senior · type: multi · id: nextjs-core-17-quiz-09
>
> Route Handler вебхука викликає `revalidateTag('product-kettle', 'max')`. Сторінка `/products/kettle` викликає `getProduct`, який має `cacheTag('products', 'product-kettle')`. Відповідь іде через CDN, що не належить Vercel. Обери правдиві твердження.
>
> - [x] Наступний запит до Next.js отримає `STALE` зі старою ціною й запустить фоновий рендер
> - [x] Сторінка інвалідується, бо тег `product-kettle` записано в її `x-next-cache-tags`
> - [x] CDN перед Next.js віддаватиме свою копію до кінця `s-maxage`
> - [ ] Перший же запит після виклику чекає на свіжу версію (`max` це «негайно»)
> - [ ] Будь-який CDN очищається автоматично, бо `revalidateTag` шле йому purge
> - [ ] Усі інстанси застосунку інвалідуються без додаткових налаштувань
>
> **Пояснення:** `'max'` це stale-while-revalidate «за подією»: перший запит бачить стару копію. Для негайної свіжості є `{ expire: 0 }`. `revalidateTag` очищає лише кеш Next.js на тому інстансі, що прийняв вебхук: CDN про теги нічого не знає (крім Vercel, де очищення йде з платформи), а інші інстанси потребують спільного кешу (тема 18).

### 🌍 Як CDN кешує застосунок Next.js

CDN бачить застосунок як набір URL з заголовками. Next.js віддає три принципово різні типи відповідей:

| Що | Приклад | `Cache-Control` | Що робить CDN |
|---|---|---|---|
| Статичні файли збірки | `/_next/static/chunks/310vm2bl3xxpt.js` | `public, max-age=31536000, immutable` | кешує назавжди, і браузер теж: у назві хеш вмісту |
| Статична / ISR-сторінка | `/products/kettle` | `s-maxage=60, stale-while-revalidate=3540` | кешує HTML і RSC за TTL, віддає застаріле під час фонового оновлення |
| Сторінка з частиною на запит | `/dashboard` з `cookies()` під Suspense | `private, no-cache, no-store…` | пропускає до origin щоразу |

Файли з `public/` (наприклад, `favicon.ico`) отримують `public, max-age=0, must-revalidate`: у назві немає хешу, тож Next.js не може обіцяти, що вміст не зміниться. Великі картинки й шрифти, що мають кешуватися довго, імпортуй через `next/image` / `next/font` або клади під хешовані імена.

**Одна URL — кілька відповідей.** `/products/kettle` — це HTML для першого заходу, RSC payload для навігації по `<Link>` і payload-и prefetch. Сервер розрізняє їх за заголовками запиту `rsc`, `next-router-prefetch`, `next-router-segment-prefetch`, `next-router-state-tree` — звідси `Vary`. Але багато CDN `Vary` на нестандартних заголовках не підтримують. Тому Next.js додає до таких запитів параметр `_rsc` — хеш значень цих заголовків, який стає частиною ключа кешу. Запит з `rsc: 1`, але без правильного `_rsc`, отримує редирект:

```console
$ curl -sI -H 'rsc: 1' http://localhost:3000/products/kettle
HTTP/1.1 307 Temporary Redirect
location: /products/kettle?_rsc

$ curl -sI -H 'rsc: 1' -H 'next-router-prefetch: 1' "http://localhost:3000/products/kettle?_rsc"
HTTP/1.1 307 Temporary Redirect
location: /products/kettle?_rsc&_rsc=HEAvJdHAQJrUAe2K
```

Відповідь із правильним `_rsc` — `Content-Type: text/x-component` з тим самим `Cache-Control: s-maxage=60, stale-while-revalidate=3540`, що й HTML.

**Правила для будь-якого CDN** (CloudFront, Fastly, Cloudflare, nginx-кеш), з гайду CDN Caching:

1. **Поважай `s-maxage` і `stale-while-revalidate`.** Не перезаписуй TTL для HTML вручну «на годину»: Next.js уже порахував його з `cacheLife`.
2. **Залишай query у ключі кешу.** Багато CDN за замовчуванням викидають query-параметри з ключа — тоді `_rsc` зникає, і HTML може віддатися на RSC-запит. Наслідок — навігація по `<Link>` ламається й перетворюється на повне перезавантаження сторінки.
3. **Пропускай заголовок `rsc` до origin.** Без нього сервер поверне HTML там, де роутер чекав RSC.
4. **Кешуй HTML і RSC разом.** Next.js регенерує їх з одного рендеру й зберігає в одному записі. Різні TTL чи різні моменти очищення дадуть сторінку, яка після reload показує одне, а після клієнтської навігації — інше.
5. **Очищай CDN разом із ревалідацією.** CDN не знає про `revalidateTag`. Патерн з документації: виклик `revalidateTag`/`revalidatePath`, потім виклик API очищення твого CDN для відповідних URL — і HTML, і RSC-варіантів.
6. **`proxy.ts` — перед кешем.** Якщо CDN стоїть перед proxy, закешована відповідь обійде перевірки auth, редиректи й rewrites. Маршрути, що залежать від рішень proxy, не кешуй на CDN.

**Vercel CDN** знає про ISR заздалегідь: під час деплою він отримує метадані маршрутів, тож не мусить вгадувати з заголовків. Головне (за документацією Vercel; решта — у темі 42 основного посібника):

- **Два рівні.** Регіональний кеш CDN плюс **довговічний ISR-кеш** поруч із регіоном функцій. Промах CDN спершу читає ISR-кеш і лише потім викликає функцію.
- **Ревалідація доходить до CDN сама.** `revalidateTag` і `revalidatePath` на Vercel очищують усі регіони (за документацією — протягом 300 мс), HTML і data payload разом. Пункт 5 зі списку вище Vercel робить за тебе.
- **Браузер не бачить `s-maxage`.** Якщо немає `CDN-Cache-Control`, Vercel вирізає `s-maxage` і `stale-while-revalidate` з відповіді клієнту, і браузер отримує `public, max-age=0, must-revalidate`. Для власних Route Handlers є окремі заголовки: `CDN-Cache-Control` (для будь-яких CDN, не для браузера) і `Vercel-CDN-Cache-Control` (лише для Vercel).

> [!quiz] Перевір себе: свій CDN перед Next.js
> level: senior · type: multi · id: nextjs-core-17-quiz-10
>
> Ти ставиш CloudFront чи nginx-кеш перед `next start`. Що треба налаштувати, щоб не зламати клієнтську навігацію й ISR?
>
> - [x] Лишити query (зокрема `_rsc`) у ключі кешу
> - [x] Пропускати заголовок `rsc` до origin
> - [x] Кешувати HTML і RSC з однаковим TTL і очищати їх разом
> - [ ] Викинути query з ключа кешу, щоб підняти hit rate
> - [ ] Перевизначити TTL для HTML на 1 рік: Next.js усе одно ревалідує
> - [ ] Кешувати відповіді з `Cache-Control: private`, якщо вони однакові
>
> **Пояснення:** `_rsc` це хеш заголовків запиту, і він єдине, що розрізняє HTML, RSC і prefetch на CDN без підтримки `Vary`. Без нього `<Link>` отримує HTML і робить повне перезавантаження. Власний TTL ламає розрахований з `cacheLife` `s-maxage`, а `revalidateTag` до CDN не дістає, тож рік означає рік старої сторінки. `private` означає «не для спільного кешу».

### 🧅 Шари кешу: від браузера до бази

Тепер усе разом. Між кліком користувача і базою даних стоять чотири шари, і кожен має власний час життя й власний спосіб інвалідації.

> [!diagram] Шари кешу: хто відповідає першим
> ```yaml
> layout: stack
> nodes:
>   - { id: client, label: "браузер · client router cache", text: "RSC payload сегментів", note: "живе stale (x-nextjs-stale-time, ≥ 30 с)", tone: blue, icon: "px:monitor" }
>   - { id: cdn, label: "CDN", text: "HTML + RSC за URL і _rsc", note: "s-maxage / stale-while-revalidate", tone: violet, icon: "px:globe" }
>   - { id: route, label: "Next.js · кеш маршруту", text: "kettle.html · kettle.rsc · .meta з тегами", note: "ISR: revalidate / expire", tone: orange }
>   - { id: data, label: "Next.js · use cache", text: "getProduct('kettle')", note: "in-memory, ключ з аргументів", tone: yellow, icon: "px:database" }
>   - { id: src, label: "джерело даних", text: "БД / CMS / API", tone: gray }
> steps:
>   - { focus: client, note: "Клік по Link: роутер спершу дивиться у свій кеш. Якщо payload сегмента молодший за stale, запиту в мережу немає взагалі." }
>   - { focus: cdn, note: "Reload або перший захід іде в мережу. CDN віддає HTML, якщо копія молодша за s-maxage; між s-maxage і stale-while-revalidate віддає стару і йде на origin у фоні." }
>   - { focus: route, note: "Промах CDN доходить до Next.js. Кеш маршруту віддає готові HTML і RSC з одного рендеру: x-nextjs-cache HIT або STALE." }
>   - { focus: data, note: "Рендер сторінки (фоновий чи на запит) викликає функції з use cache. Свіжий запис віддається з пам'яті без звернення до бази." }
>   - { focus: src, note: "Лише промах use cache доходить до бази. Кожен шар вище зрізає частину трафіку — і кожен треба вміти інвалідувати." }
> ```
> Чим вище шар, тим дешевша відповідь і тим важче до нього «достукатися» інвалідацією.

Хто який шар очищує:

| Подія | client router cache | CDN | кеш маршруту | `use cache` |
|---|---|---|---|---|
| Минув `stale` | оновлюється | — | — | — |
| Минув `s-maxage` / `revalidate` | — | фонове оновлення | `STALE` → фоновий рендер | фонове оновлення |
| `revalidateTag` у Server Action | очищується повністю | **ні** (крім Vercel) | так | так |
| `revalidateTag` у вебхуку (Route Handler) | ні: інші користувачі побачать зміну після свого `stale` | **ні** (крім Vercel) | так | так |
| API очищення CDN | ні | так | ні | ні |
| Новий деплой | живе до перезавантаження; з `deploymentId` клієнт сам робить hard navigation | залежить від CDN (на Vercel — новий кеш) | новий | новий: ключ містить build ID |

«Оновив дані, а користувач бачить старе» майже завжди означає, що застарів **один** шар; заголовки (`x-nextjs-cache`, `x-vercel-cache`, `Age` від CDN) підкажуть який. Клієнтський кеш — у [[Next.js - 04. Навігація під капотом]].

### 🕰️ Було → стало: ISR без Cache Components

Без `cacheComponents` (так працюють більшість застосунків на Next.js 13–15 і ті, що на 16 ще не мігрували) ISR задається сегментними конфігами й опціями `fetch`:

```tsx
// app/products/[slug]/page.tsx — ISR без Cache Components (було)
export const revalidate = 60 // ISR: не частіше ніж раз на 60 с
export const dynamicParams = true // невідомі slug генеруються при першому запиті
// … generateStaticParams і сторінка — як зазвичай; дані через
// fetch('https://api.example.com/…', { next: { revalidate: 300, tags: ['news'] } })
```

Що відрізняється в поведінці (Next.js 16.3.8 без `cacheComponents`):

- `next build` показує `● /products/kettle  1m  1y`: позначка SSG і `expire` за замовчуванням — рік.
- Заголовок — `s-maxage=60, stale-while-revalidate=31535940`: той самий формат, тільки `expire` = 1 рік. Скоротити його можна глобально через `expireTime` у `next.config` (з `expireTime: 3600` — `stale-while-revalidate=3540`).
- Невідомий slug **не** отримує shell: перший запит чекає повний рендер (`x-nextjs-cache: MISS`), наступні — `HIT`. Неіснуючий — одразу справжній `404`, і він теж кешується (`MISS`, потім `HIT` з тим самим `s-maxage`).
- `dynamicParams = false` давав `404` для всього поза списком, а `generateStaticParams` з `[]` означав «усе на запит, але з ISR».

Під Cache Components ці експорти — помилки компіляції: `Route segment config "revalidate" is not compatible with nextConfig.cacheComponents. Please remove it.` (так само для `dynamicParams`). Коротка мапа:

| Було | Стало |
|---|---|
| `export const revalidate = 60` | `'use cache'` + `cacheLife('minutes')` або власний профіль |
| `fetch(url, { next: { revalidate, tags } })` | функція з `'use cache'`, `cacheLife`, `cacheTag` |
| `dynamicParams = false` | видалити; `notFound()` для неіснуючих |
| `generateStaticParams() { return [] }` | повернути хоча б один параметр |
| `expireTime` у `next.config` | поле `expire` профілю `cacheLife` |
| `MISS` і повний рендер для невідомого URL | App Shell одразу, апгрейд у фоні (`partialPrefetching`) |

Повна таблиця міграції з усіма конфігами — у [[Next.js - 12. Partial Prerendering і Cache Components#🔁 Міграція: з route segment config на Cache Components|темі 12]], історія API і Pages Router (`getStaticProps` з `revalidate`, `fallback: true`) — у темі 48 основного посібника. Одна тонкість, яку варто знати при міграції: `fetch` Data Cache зі старої моделі переживає деплой, а `'use cache'` — ні.

> [!quiz] Перевір себе: стара модель, невідомий slug
> level: middle · type: single · id: nextjs-core-17-quiz-12
>
> Застосунок **без** `cacheComponents`. Сторінка товару має `export const revalidate = 60`, а `generateStaticParams` повертає `kettle` і `mug`. Що буде в заголовках **першого** запиту до `/products/lamp` (товар у «БД» є)?
>
> - [x] `x-nextjs-cache: MISS` і `Cache-Control: s-maxage=60, stale-while-revalidate=31535940`
> - [ ] App Shell з `x-nextjs-postponed: 1`
> - [ ] `404`, бо slug немає в `generateStaticParams`
> - [ ] `private, no-cache, no-store…`, бо сторінка не пререндерена
>
> **Пояснення:** у старій моделі shell немає: перший запит чекає повного рендеру, відповідь одразу несе ISR-заголовок, а наступні дають `HIT`. `expire` за замовчуванням рік, звідси `31535940` (31536000 − 60). `404` був би лише з `dynamicParams = false`, а `private` поводиться сторінка, що читає `cookies()` або `headers()`.

### 🏭 Як це роблять у продакшні

- **`generateStaticParams` — тільки «гаряче».** Топ-100 товарів чи статті за останній місяць, а не весь каталог: кожна пререндерена сторінка — це час збірки й місце в сховищі, а більшість сторінок до наступного деплою ніхто не відкриє. Решту наповнює апгрейд після першого візиту.
- **Обидва прапорці разом.** `cacheComponents: true` і `partialPrefetching: true`; без другого невідомі URL маршруту з непорожнім App Shell (`params` під `<Suspense>`) ніколи не потрапляють у кеш маршруту.
- **Профілі `cacheLife` — продуктове рішення.** Ціни й наявність — `minutes` або власний профіль, статті — `hours`/`days`, документація й лендинги — `max`. На code review дивляться, чи не потрапила функція з `seconds` на сторінку, яку мали віддавати з CDN.
- **On-demand замість коротких TTL:** довгий `revalidate` плюс вебхук дешевший і точніший за `revalidate: 10`.
- **Вебхук: секрет у заголовку й ідемпотентність.** Не `?secret=` у URL (його бачать логи CDN), перевірка підпису провайдера, повторна доставка тієї самої події — без шкоди.
- **CDN поза Vercel: очищення в тому ж обробнику**, для HTML і RSC-варіантів; мапу «тег → URL» тримай поруч із тегами.
- **Smoke-тест кешу в CI:** `curl -I` ключових сторінок на staging і перевірка `Cache-Control`.
- **Неіснуючі slug не кешують на рік.** Або перевірка в `proxy.ts` зі справжнім 404, або помірний `cacheLife` на даних товару, щоб soft 404 від ботів не жили довго.
- **Налагодження локально — тільки `next build && next start`.** У `next dev` сторінки рендеряться на кожен запит, ISR не видно. Для логів кешу маршруту є `NEXT_PRIVATE_DEBUG_CACHE=1`.

## ⚠️ Пастки

> [!pitfall] revalidateTag «не працює» за CloudFront
> На origin сторінка оновилася (`x-nextjs-cache: HIT` зі свіжою міткою), а користувачі ще хвилину бачать старе. CDN не знає про теги Next.js і чесно тримає копію до кінця `s-maxage`.
>
> ```ts
> revalidateTag(`product-${slug}`, 'max')
> await purgeCdn([`/products/${slug}`]) // ✅ окремий виклик API твого CDN
> ```

> [!pitfall] Забули partialPrefetching
> Якщо `params` читаються всередині `<Suspense>` (App Shell не порожній), пререндерені сторінки кешуються, а все поза списком назавжди лишається «shell + рендер на запит». (З порожнім App Shell маршрут без прапорця просто блокує перший запит: `MISS`, потім `HIT`.) Друга пастка того самого маршруту: після `revalidateTag(tag, { expire: 0 })` пререндерена сторінка зі списку (`/products/kettle`) лишається `postponed` і без кінця віддає дані **з часу збірки**. Статичні сторінки й маршрути з порожнім shell отримують свіжі дані після одного блокуючого `MISS`.
>
> ```ts
> const nextConfig: NextConfig = {
>   cacheComponents: true,
>   partialPrefetching: true, // ✅ без нього App Shell не апгрейдиться
> }
> ```

> [!pitfall] CDN викидає query з ключа
> «Оптимізація hit rate» на CDN ігнорує query-параметри — і `_rsc` разом з ними. HTML і RSC payload потрапляють в один запис, навігація по `<Link>` отримує HTML і робить повне перезавантаження.
>
> ```text
> ❌ cache key: host + path
> ✅ cache key: host + path + query (_rsc)
> ```

> [!pitfall] Одна функція з seconds на всю сторінку
> Віджет «курс валют» з `cacheLife('seconds')` у layout робить кожну сторінку під ним діркою на запит: `Cache-Control: private, no-cache…`. Короткоживуче — у власний Suspense, або профіль зі `stale` ≥ 30 с і `expire` ≥ 5 хв, якщо сторінка має лишитися на CDN.
>
> ```ts
> cacheLife('seconds') // expire 1 хв → не потрапляє в пререндер
> ```

## 🎤 На співбесіді

> [!interview] Як працює ISR у Next.js 16 з Cache Components? Чим він відрізняється від старого ISR?
> level: senior · frequency: часто · id: nextjs-core-17-int-01
>
> ---
>
> Окремого прапорця немає. `generateStaticParams` пререндерить популярні URL (мінімум один), для решти збірка готує App Shell. Невідомий URL отримує shell миттєво й дані стрімом, а з `partialPrefetching: true` сервер у фоні рендерить повну сторінку й кладе в кеш, тож другий запит — `HIT`. Час життя береться з `cacheLife` закешованих функцій (мінімум по сторінці), інвалідація — через `cacheTag` і `revalidateTag`. У старій моделі були `export const revalidate`, `dynamicParams` і `fetch` з `next.revalidate`, а невідомий URL блокував перший запит повним рендером (`MISS`).
>
> 📚 [[Next.js - 17. ISR і CDN#🧱 ISR під Cache Components: три деталі|Розділ: ISR під Cache Components]] · [Next.js: ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components) · [Next.js: ISR (без Cache Components)](https://nextjs.org/docs/app/guides/incremental-static-regeneration)

> [!interview] Розбери заголовок Cache-Control: s-maxage=60, stale-while-revalidate=3540. Хто його читає і звідки ці числа?
> level: senior · frequency: часто · id: nextjs-core-17-int-02
>
> ---
>
> Це ISR-сторінка. `s-maxage` читають лише спільні кеші (CDN, проксі); браузер його пропускає, але `stale-while-revalidate` Chrome застосовує сам, тож для браузера заголовок варто переписати (Vercel віддає `max-age=0, must-revalidate`). 60 секунд копія свіжа, ще 3540 її можна віддавати застарілою, оновлюючи у фоні; далі — лише після нового рендеру. Числа — з `cacheLife`: `s-maxage` = `revalidate`, `stale-while-revalidate` = `expire − revalidate` (профіль `minutes`: 60 і 3600 − 60). Якщо на сторінці кілька кешів, береться мінімум кожного поля. `stale` сюди не йде — він у `x-nextjs-stale-time` для клієнтського кешу. Статична сторінка має `s-maxage=31536000`, сторінка з частиною на запит — `private, no-cache, no-store`.
>
> 📚 [[Next.js - 17. ISR і CDN#📨 Заголовки відповіді: що з них читати|Розділ: заголовки]] · [Next.js: CDN Caching](https://nextjs.org/docs/app/guides/cdn-caching) · [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)

> [!interview] Ми викликаємо revalidateTag у вебхуку CMS, але користувачі ще хвилину бачать стару ціну. Чому і як виправити?
> level: senior · frequency: часто · id: nextjs-core-17-int-03
>
> ---
>
> Шукаю шар, що застарів, за заголовками. Найчастіше — CDN: `revalidateTag` очищує кеш Next.js, а CDN тримає копію до кінця `s-maxage`. Поза Vercel треба в тому ж обробнику викликати API очищення CDN для HTML і RSC-варіантів. Інші причини: кілька інстансів без спільного кешу тегів (вебхук інвалідував один), профіль `'max'` — перший запит отримує `STALE`, і це очікувано (для негайного — `{ expire: 0 }`), або клієнтський router cache у вже відкритих вкладках, який живе до кінця `stale`.
>
> 📚 [[Next.js - 17. ISR і CDN#🧅 Шари кешу: від браузера до бази|Розділ: шари кешу]] · [Next.js: How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works) · [Next.js: CDN Caching](https://nextjs.org/docs/app/guides/cdn-caching)

> [!interview] Чим Vercel CDN відрізняється від «просто CDN з Cache-Control» для Next.js?
> level: senior · frequency: іноді · id: nextjs-core-17-int-05
>
> ---
>
> Vercel знає кешованість маршрутів з деплою, а не з першої відповіді. Тому є довговічний ISR-кеш поруч із регіоном функцій, request collapsing і глобальне очищення: `revalidateTag`/`revalidatePath` за документацією доходять до всіх регіонів приблизно за 300 мс, HTML і payload разом. Для браузера `s-maxage` вирізається; тонке керування — `CDN-Cache-Control` і `Vercel-CDN-Cache-Control`.
>
> 📚 [[Next.js - 17. ISR і CDN#🌍 Як CDN кешує застосунок Next.js|Розділ: CDN]] · [Vercel: Incremental Static Regeneration](https://vercel.com/docs/incremental-static-regeneration) · [Vercel: CDN Cache](https://vercel.com/docs/caching/cdn-cache)

## 🔗 Звʼязки

- [[Next.js - 03. Динамічні маршрути]] — `generateStaticParams` і async `params`, з яких починається ISR.
- [[Next.js - 12. Partial Prerendering і Cache Components]] — static shell, App Shell і повна таблиця міграції з сегментних конфігів.
- [[Next.js - 15. Cache Components і use cache]] — `'use cache'`, профілі `cacheLife`, `cacheTag`: звідси беруться числа в `Cache-Control`.
- [[Next.js - 16. Ревалідація]] — який API інвалідації обрати і що побачить користувач після дії.
- [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers]] — спільний кеш маршрутів і тегів для кількох інстансів і self-hosting.
- [[Next.js - 04. Навігація під капотом]] — клієнтський router cache, верхній шар зі схеми.
- [[Next.js - 11. Streaming і Suspense]] — чому статус-код фіксується з першим байтом стріму.
- Далі в курсі: тема 42 основного посібника — Vercel, тема 43 — self-hosting і CDN перед `next start`.

## ⚡ Фішки

> [!reel] 🥖 stale не живе в Cache-Control
> Профіль `minutes` має `stale` 300 с, але в заголовку їх немає: `s-maxage=60, stale-while-revalidate=3540`. Ці 300 секунд їдуть окремо в `x-nextjs-stale-time` і стосуються лише клієнтського router cache.

> [!reel] 🕳️ Одна функція з seconds вибиває сторінку з CDN
> `cacheLife('seconds')` має `expire` 1 хвилину, а кеш коротший за 5 хвилин не потрапляє в пререндер. Сторінка стає `◐`, і кожна її відповідь `private, no-cache, no-store…`, навіть якщо все інше закешоване.

> [!reel] 🔖 _rsc: хеш, який рятує навігацію
> `curl -H 'rsc: 1'` без `_rsc` отримує `307` на `?_rsc`, а з prefetch-заголовком ще й на `?_rsc&_rsc=<hash>`. Хеш робить із заголовків частину URL, тож навіть CDN без `Vary` не сплутає HTML і RSC.

> [!reel] 🔌 revalidateTag не дзвонить у CDN
> Він очищає кеш маршруту Next.js, але не вашу копію в CloudFront чи Fastly. На Vercel очищення йде з платформи (за документацією приблизно за 300 мс), а поза нею потрібен окремий виклик API очищення CDN.

> [!reel] 🔒 Без partialPrefetching невідомий URL не кешується
> З одним `cacheComponents: true` і непорожнім App Shell (`params` під Suspense) другий, третій і десятий запити до `/products/lamp` отримують той самий App Shell з `x-nextjs-postponed: 1`. Запис у `route-cache` з'являється тільки з `partialPrefetching: true`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке ISR і яку проблему він розв'язує?
> *дуже часто · теорія* · `nextjs-core-17-card-01`
>
> Incremental Static Regeneration: сторінка віддається як статична, але має час життя. Коли він минає, наступний запит ще отримує стару версію, а сервер у фоні рендерить нову. Так отримуєш швидкість статики без повного перезбирання сайту при кожній зміні даних, а нові сторінки додаються по одній, у міру відвідувань.
>
> 📚 [[Next.js - 17. ISR і CDN#🧭 Що таке ISR і навіщо він досі потрібен|Розділ: що таке ISR]] · [Next.js: ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components)

> [!question]- З чого складається ISR під Cache Components?
> *часто · теорія* · `nextjs-core-17-card-02`
>
> З трьох частин: `generateStaticParams` (які URL пререндерити, мінімум один), App Shell для решти URL (з `partialPrefetching: true` він «дорослішає» до повної сторінки після першого візиту) і час життя та теги з `cacheLife`/`cacheTag` у функціях з `'use cache'`. Окремого прапорця «ISR» немає.
>
> 📚 [[Next.js - 17. ISR і CDN#🧱 ISR під Cache Components: три деталі|Розділ: три деталі]] · [Next.js: ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components)

> [!question]- Що означає x-nextjs-cache: HIT, STALE?
> *часто · теорія* · `nextjs-core-17-card-03`
>
> `HIT` означає, що відповідь віддано з кешу маршруту, а запис свіжий. `STALE` означає, що віддано стару версію, бо `revalidate` минув, а у фоні вже йде рендер нової. Це нормальна фаза ISR, а не помилка. У старій моделі додається ще `MISS`, коли запису не було.
>
> 📚 [[Next.js - 17. ISR і CDN#📨 Заголовки відповіді: що з них читати|Розділ: заголовки]] · [Next.js: ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)

> [!question]- Чому в ISR використовують s-maxage, а не max-age?
> *часто · теорія* · `nextjs-core-17-card-04`
>
> `s-maxage` адресований лише спільним кешам (CDN, reverse proxy), а браузер його ігнорує. Це свідомо: CDN можна очистити, а копію в браузері користувача ні. Директиву `stale-while-revalidate` браузер застосовує до власного HTTP-кешу (Chrome після ревалідації першим fetch може віддати старе тіло з диска), але `s-maxage` ігнорує, тож тривалістю життя копії керує CDN.
>
> 📚 [[Next.js - 17. ISR і CDN#📨 Заголовки відповіді: що з них читати|Розділ: заголовки]] · [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)

### 🟡 Middle

> [!question]- Як із cacheLife вийшов Cache-Control: s-maxage=60, stale-while-revalidate=3540?
> *дуже часто · теорія* · `nextjs-core-17-card-05`
>
> `s-maxage` це `revalidate` профілю (для `minutes` 60), а `stale-while-revalidate` це `expire − revalidate` (3600 − 60 = 3540). Якщо на сторінці кілька закешованих функцій, береться мінімум окремо для кожного поля. `stale` в заголовок не йде: він у `x-nextjs-stale-time` для клієнтського кешу.
>
> 📚 [[Next.js - 17. ISR і CDN#📨 Заголовки відповіді: що з них читати|Розділ: заголовки]] · [Next.js: cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)

> [!question]- Що відбувається при першому і другому запиті до URL, якого немає в generateStaticParams?
> *часто · практика* · `nextjs-core-17-card-06`
>
> Перший: миттєвий App Shell і стрім даних, заголовки `private, no-cache…` і `x-nextjs-postponed: 1`; паралельно сервер рендерить повну сторінку й кладе її в кеш маршруту. Другий: `x-nextjs-cache: HIT` з `s-maxage`. Це працює лише з `partialPrefetching: true`: без нього кожен запит лишається shell плюс рендер на запит.
>
> 📚 [[Next.js - 17. ISR і CDN#🔁 Життєвий цикл URL: зі списку й поза ним|Розділ: життєвий цикл URL]] · [Next.js: partialPrefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching)

> [!question]- Чому сторінка з cacheLife('seconds') не потрапляє на CDN?
> *часто · практика* · `nextjs-core-17-card-07`
>
> Профіль `seconds` має `expire` 1 хвилину, а кеш, що живе менше 5 хвилин, не входить у пререндер і стає «дірою на запит». Сторінка під Suspense позначається `◐`, а відповідь `private, no-cache, no-store…` з `x-nextjs-postponed: 1`. Виправлення: винести короткоживуче у власний Suspense або взяти профіль з `expire` ≥ 5 хвилин.
>
> 📚 [[Next.js - 17. ISR і CDN#📨 Заголовки відповіді: що з них читати|Розділ: заголовки]] · [Next.js: cacheLife, prerendering behavior](https://nextjs.org/docs/app/api-reference/functions/cacheLife#prerendering-behavior)

> [!question]- Чим відрізняється revalidateTag(tag, 'max') від revalidateTag(tag, { expire: 0 })?
> *часто · теорія* · `nextjs-core-17-card-08`
>
> `'max'` це stale-while-revalidate: наступний запит отримає `STALE` зі старими даними, а свіжа версія з'явиться наступному. `{ expire: 0 }` прострочує запис негайно: запит отримує shell і свіжі дані стрімом (`private`), а далі сторінка знову кешується. Перше дешевше для користувача, друге гарантує, що стару ціну не побачить ніхто.
>
> 📚 [[Next.js - 17. ISR і CDN#🔔 On-demand: ревалідація на подію|Розділ: on-demand]] · [Next.js: revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

### 🔴 Senior

> [!question]- Навіщо Next.js додає параметр _rsc і що ламається, якщо CDN його викидає?
> *часто · теорія* · `nextjs-core-17-card-10`
>
> Одна URL має кілька відповідей (HTML, RSC, prefetch), що розрізняються заголовками `rsc`, `next-router-prefetch` та іншими. Не всі CDN підтримують `Vary` на них, тому Next.js кладе хеш цих заголовків у query `_rsc`. Якщо CDN викидає query з ключа, HTML і RSC опиняються в одному записі, і навігація по `<Link>` отримує HTML та перетворюється на повне перезавантаження.
>
> 📚 [[Next.js - 17. ISR і CDN#🌍 Як CDN кешує застосунок Next.js|Розділ: CDN]] · [Next.js: CDN Caching](https://nextjs.org/docs/app/guides/cdn-caching)

> [!question]- Що не так із notFound() під Suspense на ISR-сторінці і як отримати справжній 404?
> *іноді · практика* · `nextjs-core-17-card-11`
>
> Shell уже відправлено, тому перший статус `200` (soft 404 з `noindex`), а після апгрейду ця сторінка потрапляє в кеш маршруту з `s-maxage`, і CDN кешує «сторінки-помилки» для вигаданих URL. Читання `params` над Suspense дає `404` лише в закешованому записі. Справжній `404` з першого запиту дає перевірка існування ресурсу в `proxy.ts` до рендеру.
>
> 📚 [[Next.js - 17. ISR і CDN#🚫 Неіснуючі slug і статус-коди|Розділ: статус-коди]] · [Next.js: notFound](https://nextjs.org/docs/app/api-reference/functions/not-found)

> [!question]- Яка різниця між ISR зі старою моделлю (export const revalidate) і з Cache Components?
> *часто · теорія* · `nextjs-core-17-card-12`
>
> Стара: `export const revalidate`, `dynamicParams`, `fetch` з `next.revalidate`; невідомий URL блокує перший запит повним рендером (`MISS`, потім `HIT`), `expire` за замовчуванням рік (`stale-while-revalidate=31535940`), у таблиці збірки `●`. Нова: `'use cache'` з `cacheLife`/`cacheTag`, `generateStaticParams` мінімум з одним параметром, App Shell для решти, а сегментні конфіги дають помилку збірки.
>
> 📚 [[Next.js - 17. ISR і CDN#🕰️ Було → стало: ISR без Cache Components|Розділ: було → стало]] · [Next.js: Caching (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components)

> [!question]- Як діагностувати «оновили дані, а користувач бачить старе»?
> *часто · практика* · `nextjs-core-17-card-13`
>
> Шукати шар, що застарів: client router cache (живе `stale`, `x-nextjs-stale-time`), CDN (`Age`, `x-vercel-cache`), кеш маршруту (`x-nextjs-cache`), `use cache` (профіль і теги). `curl -I` на кожному шарі показує, хто відповів. Типові причини: CDN без очищення, інвалідація на одному з кількох інстансів, `'max'` з очікуваним `STALE`, або тег, якого немає на сторінці.
>
> 📚 [[Next.js - 17. ISR і CDN#🧅 Шари кешу: від браузера до бази|Розділ: шари кешу]] · [Next.js: How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works)

## 🛠️ Практика

> [!task] Cache-Control маршруту з профілів cacheLife
> level: senior · difficulty: medium · id: nextjs-core-17-task-01 · tags: isr, cache-control, cachelife
>
> Сторінка викликає кілька закешованих функцій, кожна має профіль `cacheLife`. Напиши `cacheControlFor(profiles)`, яка повертає `Cache-Control` усього маршруту:
>
> - профілі без `revalidate` не рахуються; якщо таких, що мають `revalidate`, немає (зокрема масив порожній), це статична сторінка: `s-maxage=31536000`;
> - якщо будь-який профіль має `revalidate === 0` або `expire` менший за 300 (`expire` за замовчуванням 31536000), сторінка має частину на запит: `private, no-cache, no-store, max-age=0, must-revalidate`;
> - інакше `s-maxage` це **мінімум** `revalidate`, а `stale-while-revalidate` це мінімум `expire` мінус цей `s-maxage`. Мінімум береться окремо для кожного поля.
>
> Значення в секундах. Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts
> cacheControlFor([{ stale: 300, revalidate: 60, expire: 3600 }])
> // → 's-maxage=60, stale-while-revalidate=3540'
> ```
>
> ```ts starter
> type CacheProfile = { stale?: number; revalidate?: number; expire?: number }
>
> function cacheControlFor(profiles: CacheProfile[]): string {
>   // твій код
>   return ''
> }
> ```
>
> ```ts tests
> const minutes = { stale: 300, revalidate: 60, expire: 3600 }
> const hours = { stale: 300, revalidate: 3600, expire: 86400 }
> const seconds = { stale: 30, revalidate: 1, expire: 60 }
> const max = { stale: 300, revalidate: 2592000, expire: 31536000 }
>
> test('один профіль minutes', () => {
>   expect(cacheControlFor([minutes])).toBe('s-maxage=60, stale-while-revalidate=3540')
> })
>
> test('профіль max дає місяць і 335 днів', () => {
>   expect(cacheControlFor([max])).toBe('s-maxage=2592000, stale-while-revalidate=28944000')
> })
>
> test('мінімум revalidate з кількох профілів', () => {
>   expect(cacheControlFor([hours, { revalidate: 900, expire: 86400 }])).toBe('s-maxage=900, stale-while-revalidate=85500')
> })
>
> test('мінімуми беруться окремо для кожного поля', () => {
>   const a = { revalidate: 60, expire: 7200 }
>   const b = { revalidate: 600, expire: 3600 }
>   expect(cacheControlFor([a, b])).toBe('s-maxage=60, stale-while-revalidate=3540')
> })
>
> test('короткий кеш робить маршрут private', () => {
>   const dynamic = 'private, no-cache, no-store, max-age=0, must-revalidate'
>   expect(cacheControlFor([minutes, seconds])).toBe(dynamic)
>   expect(cacheControlFor([{ revalidate: 0, expire: 86400 }])).toBe(dynamic)
> })
>
> test('без профілів з revalidate сторінка статична', () => {
>   expect(cacheControlFor([])).toBe('s-maxage=31536000')
>   expect(cacheControlFor([{ stale: 300 }])).toBe('s-maxage=31536000')
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу відфільтруй профілі, де `revalidate !== undefined`. Порожній результат це статична сторінка. Далі перевір `private`, і лише потім рахуй.
>
> > [!hint]- Підказка 2
> > `Math.min(...profiles.map((p) => p.revalidate))` для `s-maxage`, те саме для `expire` (з `?? 31536000`). Другий параметр це `minExpire - minRevalidate`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function cacheControlFor(profiles: CacheProfile[]): string {
> >   const timed = profiles.filter((p) => p.revalidate !== undefined)
> >   if (timed.length === 0) return 's-maxage=31536000'
> >
> >   const expireOf = (p: CacheProfile) => p.expire ?? 31536000
> >   if (timed.some((p) => p.revalidate === 0 || expireOf(p) < 300)) {
> >     return 'private, no-cache, no-store, max-age=0, must-revalidate'
> >   }
> >
> >   const revalidate = Math.min(...timed.map((p) => p.revalidate as number))
> >   const expire = Math.min(...timed.map(expireOf))
> >   return `s-maxage=${revalidate}, stale-while-revalidate=${expire - revalidate}`
> > }
> > ```
> >
> > Один «короткий» профіль робить private весь маршрут, бо його не можна віддати з CDN. Мінімуми окремо означають, що сторінка не живе довше, ніж найстрімкіше з її даних, і не віддається застарілою довше, ніж дозволяє найкоротший `expire`.

> [!task] Симулятор кешу маршруту з ISR
> level: senior · difficulty: hard · id: nextjs-core-17-task-02 · tags: isr, stale-while-revalidate, timers
>
> Напиши `createRouteCache({ revalidate, expire }, render)`: спрощений кеш маршруту Next.js. Час у секундах, поточний час бери з `Date.now()` (у тестах `vi.useFakeTimers()`). `render(path)` повертає рядок: HTML сторінки.
>
> Метод `get(path)` повертає `{ status, body }`:
>
> - запису немає або він старший за `expire`: `MISS`, рендер **синхронно**, запис у кеш, `body` новий;
> - вік менший за `revalidate`: `HIT`, без рендеру;
> - вік від `revalidate` до `expire`: `STALE` зі **старим** `body` і **один** фоновий рендер; поки він не завершився, повторні запити не запускають другий. Результат фонового рендеру замінює запис (тоді вік рахується заново);
> - якщо фоновий рендер кинув помилку або повернув відхилений проміс, старий запис лишається, а наступний запит може спробувати знову.
>
> Метод `invalidate(path, mode)`: `{ expire: 0 }` видаляє запис (наступний `get` це `MISS`), `'max'` позначає запис застарілим (наступний `get` це `STALE`, навіть якщо `revalidate` ще не минув; після оновлення запис знову свіжий).
>
> ```js starter
> function createRouteCache({ revalidate, expire }, render) {
>   return {
>     get(path) {
>       // твій код
>     },
>     invalidate(path, mode) {
>       // твій код
>     },
>   }
> }
> ```
>
> ```js tests
> const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve() }
>
> function setup() {
>   vi.useFakeTimers()
>   let n = 0
>   const state = { fail: false }
>   const render = vi.fn((path) => {
>     if (state.fail) throw new Error('БД недоступна')
>     return `${path}#${++n}`
>   })
>   return { cache: createRouteCache({ revalidate: 60, expire: 3600 }, render), render, state }
> }
>
> test('перший запит MISS, далі HIT без рендеру', () => {
>   const { cache, render } = setup()
>   expect(cache.get('/kettle')).toEqual({ status: 'MISS', body: '/kettle#1' })
>   vi.advanceTimersByTime(59_000)
>   expect(cache.get('/kettle')).toEqual({ status: 'HIT', body: '/kettle#1' })
>   expect(render).toHaveBeenCalledTimes(1)
> })
>
> test('після revalidate: STALE зі старим body, потім HIT з новим', async () => {
>   const { cache } = setup()
>   cache.get('/kettle')
>   vi.advanceTimersByTime(61_000)
>   expect(cache.get('/kettle')).toEqual({ status: 'STALE', body: '/kettle#1' })
>   await flush()
>   expect(cache.get('/kettle')).toEqual({ status: 'HIT', body: '/kettle#2' })
> })
>
> test('повторні запити під час фонового рендеру не запускають другий', async () => {
>   const { cache, render } = setup()
>   cache.get('/kettle')
>   vi.advanceTimersByTime(61_000)
>   cache.get('/kettle')
>   cache.get('/kettle')
>   expect(cache.get('/kettle').status).toBe('STALE')
>   await flush()
>   expect(render).toHaveBeenCalledTimes(2)
> })
>
> test('після expire запит чекає на новий рендер', () => {
>   const { cache } = setup()
>   cache.get('/kettle')
>   vi.advanceTimersByTime(3_600_000)
>   expect(cache.get('/kettle')).toEqual({ status: 'MISS', body: '/kettle#2' })
> })
>
> test('invalidate: expire 0 дає MISS, max дає STALE', async () => {
>   const { cache } = setup()
>   cache.get('/kettle')
>   cache.invalidate('/kettle', 'max')
>   expect(cache.get('/kettle')).toEqual({ status: 'STALE', body: '/kettle#1' })
>   await flush()
>   expect(cache.get('/kettle')).toEqual({ status: 'HIT', body: '/kettle#2' })
>   cache.invalidate('/kettle', { expire: 0 })
>   expect(cache.get('/kettle')).toEqual({ status: 'MISS', body: '/kettle#3' })
> })
>
> test('помилка фонового рендеру лишає старий запис', async () => {
>   const { cache, state } = setup()
>   cache.get('/kettle')
>   vi.advanceTimersByTime(61_000)
>   state.fail = true
>   expect(cache.get('/kettle')).toEqual({ status: 'STALE', body: '/kettle#1' })
>   await flush()
>   expect(cache.get('/kettle')).toEqual({ status: 'STALE', body: '/kettle#1' })
>   state.fail = false
>   cache.get('/kettle')
>   await flush()
>   expect(cache.get('/kettle')).toEqual({ status: 'HIT', body: '/kettle#2' })
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай `Map<path, { body, at, invalid }>` і `Set` шляхів, для яких уже йде фоновий рендер. Вік це `(Date.now() - at) / 1000`.
>
> > [!hint]- Підказка 2
> > Фоновий рендер: `try { r = render(path) } catch { pending.delete(path); return }`, далі `Promise.resolve(r).then(записати, нічого).finally(видалити з pending)`. Так працюють і синхронні, і асинхронні `render`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createRouteCache({ revalidate, expire }, render) {
> >   const entries = new Map()
> >   const pending = new Set()
> >
> >   function refresh(path) {
> >     if (pending.has(path)) return
> >     pending.add(path)
> >     let result
> >     try {
> >       result = render(path)
> >     } catch {
> >       pending.delete(path)
> >       return
> >     }
> >     Promise.resolve(result)
> >       .then(
> >         (body) => entries.set(path, { body, at: Date.now(), invalid: false }),
> >         () => {},
> >       )
> >       .finally(() => pending.delete(path))
> >   }
> >
> >   return {
> >     get(path) {
> >       const entry = entries.get(path)
> >       const age = entry ? (Date.now() - entry.at) / 1000 : Infinity
> >       if (!entry || age >= expire) {
> >         const body = render(path)
> >         entries.set(path, { body, at: Date.now(), invalid: false })
> >         return { status: 'MISS', body }
> >       }
> >       if (age < revalidate && !entry.invalid) return { status: 'HIT', body: entry.body }
> >       refresh(path)
> >       return { status: 'STALE', body: entry.body }
> >     },
> >     invalidate(path, mode) {
> >       if (mode === 'max') {
> >         const entry = entries.get(path)
> >         if (entry) entry.invalid = true
> >       } else {
> >         entries.delete(path)
> >       }
> >     },
> >   }
> > }
> > ```
> >
> > На 16.3.8 прострочений запис справжнього Next.js показує `REVALIDATED`, а в цій моделі це `MISS`. Ревалідація запускається запитом, а не таймером, і `pending` гарантує один фоновий рендер на шлях (у Next.js це дає request collapsing у межах інстанса). Помилка лишає останню вдалу версію, як і справжній ISR.

> [!task] Чи кешуватиме CDN цю відповідь
> level: senior · difficulty: medium · id: nextjs-core-17-task-03 · tags: cdn, cache-key, rsc
>
> Напиши `cdnDecision(req, res)` для generic CDN перед Next.js. Вона повертає `{ cache, key }`.
>
> `cache` це `true`, лише якщо виконано **все**:
>
> - метод `GET` або `HEAD`;
> - у запиті немає заголовка `Authorization`;
> - у відповіді немає `Set-Cookie`;
> - `Cache-Control` відповіді містить `s-maxage` і не містить `private` та `no-store`;
> - статус один із `200`, `301`, `302`, `307`, `308`, `404`, `410`.
>
> Імена заголовків не залежать від регістру. `key` це `path` плюс відсортований за ключем query у вигляді `?k=v&k2=v2` (без `?`, якщо query порожня). Query лишається в ключі, бо `_rsc` відрізняє RSC від HTML. `key` повертається завжди, навіть коли `cache` дорівнює `false`.
>
> ```js
> cdnDecision(
>   { method: 'GET', path: '/products/kettle', query: { _rsc: 'abc' }, headers: {} },
>   { status: 200, headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=3540' } },
> )
> // → { cache: true, key: '/products/kettle?_rsc=abc' }
> ```
>
> ```ts starter
> type Req = { method: string; path: string; query: Record<string, string>; headers: Record<string, string> }
> type Res = { status: number; headers: Record<string, string> }
>
> function cdnDecision(req: Req, res: Res): { cache: boolean; key: string } {
>   // твій код
>   return { cache: false, key: '' }
> }
> ```
>
> ```ts tests
> const isr = { 'Cache-Control': 's-maxage=60, stale-while-revalidate=3540' }
> const get = (path: string, query: Record<string, string> = {}, headers: Record<string, string> = {}) =>
>   ({ method: 'GET', path, query, headers })
>
> test('ISR HTML кешується з ключем без query', () => {
>   expect(cdnDecision(get('/products/kettle'), { status: 200, headers: isr })).toEqual({ cache: true, key: '/products/kettle' })
> })
>
> test('RSC-запит з _rsc має інший ключ, query відсортована', () => {
>   const html = cdnDecision(get('/p'), { status: 200, headers: isr })
>   const rsc = cdnDecision(get('/p', { _rsc: 'HEAv', a: '1' }), { status: 200, headers: isr })
>   expect(rsc.key).toBe('/p?_rsc=HEAv&a=1')
>   expect(rsc.key).not.toBe(html.key)
>   expect(rsc.cache).toBe(true)
> })
>
> test('private і no-store не кешуються', () => {
>   const dyn = 'private, no-cache, no-store, max-age=0, must-revalidate'
>   expect(cdnDecision(get('/dash'), { status: 200, headers: { 'cache-control': dyn } }).cache).toBe(false)
>   expect(cdnDecision(get('/x'), { status: 200, headers: { 'Cache-Control': 's-maxage=60, no-store' } }).cache).toBe(false)
>   expect(cdnDecision(get('/y'), { status: 200, headers: { 'Cache-Control': 'max-age=60' } }).cache).toBe(false)
> })
>
> test('Set-Cookie у відповіді й Authorization у запиті вимикають кеш', () => {
>   expect(cdnDecision(get('/a'), { status: 200, headers: { ...isr, 'set-cookie': 'sid=1' } }).cache).toBe(false)
>   expect(cdnDecision(get('/a', {}, { authorization: 'Bearer t' }), { status: 200, headers: isr }).cache).toBe(false)
> })
>
> test('назва заголовка cache-control не залежить від регістру', () => {
>   expect(cdnDecision(get('/a'), { status: 200, headers: { 'cache-control': 's-maxage=60' } }).cache).toBe(true)
> })
>
> test('POST не кешується, HEAD кешується', () => {
>   const res = { status: 200, headers: isr }
>   expect(cdnDecision({ method: 'POST', path: '/a', query: {}, headers: {} }, res).cache).toBe(false)
>   expect(cdnDecision({ method: 'HEAD', path: '/a', query: {}, headers: {} }, res).cache).toBe(true)
> })
>
> test('кешуються лише дозволені статуси', () => {
>   expect(cdnDecision(get('/a'), { status: 404, headers: isr }).cache).toBe(true)
>   expect(cdnDecision(get('/a'), { status: 500, headers: isr }).cache).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > Для пошуку заголовка без урахування регістру пройдися по `Object.keys` і порівняй `toLowerCase()`.
>
> > [!hint]- Підказка 2
> > Директиви `Cache-Control`: `value.split(',').map((d) => d.trim().toLowerCase().split('=')[0])`. Так `s-maxage=60` стане `s-maxage`, а `private` не сплутається з частиною іншого слова.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function cdnDecision(req: Req, res: Res): { cache: boolean; key: string } {
> >   const header = (h: Record<string, string>, name: string) => {
> >     const found = Object.keys(h).find((k) => k.toLowerCase() === name)
> >     return found === undefined ? undefined : h[found]
> >   }
> >
> >   const query = Object.keys(req.query)
> >     .sort()
> >     .map((k) => `${k}=${req.query[k]}`)
> >     .join('&')
> >   const key = query ? `${req.path}?${query}` : req.path
> >
> >   const directives = (header(res.headers, 'cache-control') ?? '')
> >     .split(',')
> >     .map((d) => d.trim().toLowerCase().split('=')[0])
> >
> >   const method = req.method.toUpperCase()
> >   const cache =
> >     (method === 'GET' || method === 'HEAD') &&
> >     header(req.headers, 'authorization') === undefined &&
> >     header(res.headers, 'set-cookie') === undefined &&
> >     directives.includes('s-maxage') &&
> >     !directives.includes('private') &&
> >     !directives.includes('no-store') &&
> >     [200, 301, 302, 307, 308, 404, 410].includes(res.status)
> >
> >   return { cache, key }
> > }
> > ```
> >
> > Ключ з query це правило №2 з гайду CDN Caching: без `_rsc` HTML і RSC опиняються в одному записі, а навігація по `<Link>` перетворюється на повне перезавантаження.

## 📚 Джерела та що почитати

- 🟡 [Next.js — ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components) — основний гайд: `generateStaticParams`, App Shell, апгрейд після першого візиту.
- 🟡 [Next.js — Using a CDN with Next.js](https://nextjs.org/docs/app/guides/cdn-caching) — `Cache-Control` для статики, ISR і динаміки, `Vary`, `_rsc`, що зберігати на CDN.
- 🔴 [Next.js — How revalidation works](https://nextjs.org/docs/app/guides/how-revalidation-works) — теги й soft tags, HTML і RSC в одному записі, кілька інстансів.
- 🟡 [Next.js — cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife) — профілі, `stale/revalidate/expire` і правила потрапляння в пререндер.
- 🟡 [Next.js — partialPrefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) — прапорець 16.3, без якого App Shell не апгрейдиться.
- 🟢 [Next.js — ISR (без Cache Components)](https://nextjs.org/docs/app/guides/incremental-static-regeneration) — стара модель, `x-nextjs-cache`, налагодження й обмеження.
- 🟢 [Next.js — Caching (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components) — `revalidate`, `fetch` з `next`, `dynamic` для «було → стало».
- 🟡 [Vercel — Incremental Static Regeneration](https://vercel.com/docs/incremental-static-regeneration) — довговічний ISR-кеш, глобальне очищення, request collapsing.
- 🟡 [Vercel — CDN Cache](https://vercel.com/docs/caching/cdn-cache) — `CDN-Cache-Control`, `Vercel-CDN-Cache-Control`, критерії кешованості.
- 🔴 [MDN — Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control) — `s-maxage`, `stale-while-revalidate`, `immutable` з першоджерела.

> [!important] Підсумок
> - ISR під Cache Components — це `generateStaticParams` (≥ 1 параметр) + App Shell для решти URL + час життя з `cacheLife`. Якщо `params` читаються під `<Suspense>`, невідомий URL стає звичайним записом у кеші маршруту лише з `partialPrefetching: true`; з порожнім App Shell маршрут без прапорця блокує перший запит (`MISS` → `HIT`).
> - Перший запит до невідомого URL — shell і стрім (`private`, `x-nextjs-postponed: 1`), другий — `x-nextjs-cache: HIT`. Після `revalidate` — `STALE` і фоновий рендер, ніхто не чекає.
> - `Cache-Control: s-maxage={revalidate}, stale-while-revalidate={expire − revalidate}`, мінімум по всіх кешах сторінки; `stale` іде окремо в `x-nextjs-stale-time`. Кеш з `expire` < 5 хв, `stale` < 30 с або `revalidate: 0` прибирає сторінку з CDN.
> - CDN кешує HTML і RSC за URL і `_rsc`: ключ з query, однаковий TTL, очищення разом. `revalidateTag` сам доходить лише до кешу Next.js (і до CDN на Vercel).
> - Шари кешу: client router cache → CDN → кеш маршруту → `use cache` → джерело. Діагностуй за заголовками, який із них застарів.

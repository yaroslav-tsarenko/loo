---
title: Parallel і intercepting routes
id: nextjs-core-05
slug: 05-parallel-intercepting-routes
order: 5
level: middle
skill: routing
icon: px:layers
tags: [nextjs, routing, parallel-routes, intercepting-routes, modal, default-js]
prerequisites:
  - "[[Next.js - 02. Layouts, templates і route groups]]"
  - "[[Next.js - 03. Динамічні маршрути]]"
estimatedMinutes: 50
nextVersion: 16.3.8
---

# Parallel і intercepting routes

> [!success] 🎯 Після цього розділу ти зможеш
> - зібрати layout з кількох слотів `@name` і пояснити, чому слот не впливає на URL;
> - для будь-якого URL сказати, що покаже кожен слот після soft navigation і після reload — і коли замість сторінки буде 404;
> - написати `default.tsx` під задачу: `null`, копія сторінки або `notFound()`;
> - дати кожному слоту власні `loading.tsx` і `error.tsx` і показувати слот за роллю, не відкриваючи чужі дані;
> - розв'язати маркер `(.)`, `(..)`, `(..)(..)` чи `(...)` у маршрут, який він перехоплює, рахуючи сегменти маршруту, а не папки;
> - зробити модалку з власним URL: відкривається поверх сторінки, reload показує повну сторінку, «назад» закриває, посилання можна поширити.

## 🤔 Передбач

> [!quiz] Що покаже слот після кліку і після reload?
> level: middle · type: output · id: nextjs-core-05-quiz-01
>
> Продакшн-збірка. Layout `app/dashboard/layout.tsx` рендерить `children`, `team` і `analytics`. Файли:
>
> ```text
> app/dashboard/page.tsx
> app/dashboard/default.tsx
> app/dashboard/@team/page.tsx            → «Команда: 5 людей»
> app/dashboard/@team/settings/page.tsx   → «Команда: налаштування»
> app/dashboard/@analytics/page.tsx       → «Відвідувачі: 1284»
> app/dashboard/@analytics/default.tsx    → «Аналітика доступна на огляді.»
> ```
>
> Користувач відкриває `/dashboard`, клікає `<Link href="/dashboard/settings">`, а потім натискає F5. Що показує слот `@analytics` після кліку і після F5?
>
> - [x] Після кліку — «Відвідувачі: 1284», після F5 — «Аналітика доступна на огляді.»
> - [ ] Після кліку — «Аналітика доступна на огляді.», після F5 — так само
> - [ ] Після кліку — «Відвідувачі: 1284», після F5 — сторінка 404
> - [ ] Після кліку — порожньо, бо для `/dashboard/settings` в `@analytics` немає сторінки
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Під час soft navigation (клік по `Link`) Next.js оновлює лише слоти, для яких є збіг, а решта зберігає те, що показувала. Після reload браузер приходить «з нуля», і сервер не знає, що було в слоті раніше, тож рендерить `default.tsx`. 404 було б, якби `default.tsx` не існувало.

## 🧒 Простими словами

Уяви диспетчерську з кількома екранами на одній стіні. Стіна — це layout, екрани — слоти. Коли черговий перемикає канал на одному екрані, інші показують своє далі: так працює soft navigation. Але якщо в будівлі вимкнули світло (reload), після ввімкнення кожен екран має знати, що показувати. Екран, у якого на поточний канал є передача, її й показує. Решта вмикає заставку (`default.tsx`), а якщо заставки немає — горить «Немає сигналу» на всю стіну (404).

Intercepting routes — як вітрина в галереї. Клацнув на картину в залі — її показують збільшеною поверх залу, і в тебе в руках квиток саме на цю картину (URL). Віддав квиток другові — він прийде не в зал, а одразу в окрему кімнату з цією картиною (повна сторінка). А крок назад просто прибирає збільшення: ти знову в залі.

## 🔬 Як це працює насправді

### 🧩 Слоти: кілька сторінок в одному layout

**Parallel routes** дозволяють показати кілька сторінок одночасно в одному layout. Кожна така «паралельна» сторінка живе в **слоті** — папці з префіксом `@`: `@team`, `@analytics`, `@modal`. Layout того самого рівня отримує кожен слот як prop з тією самою назвою, без `@`, поруч із `children`:

```tsx
// app/dashboard/layout.tsx — три слоти: children (неявний), @team, @analytics
import Link from 'next/link'

export default function DashboardLayout({ children, team, analytics }: LayoutProps<'/dashboard'>) {
  return (
    <main>
      <nav>
        <Link href="/dashboard">Огляд</Link>
        <Link href="/dashboard/settings">Налаштування команди</Link>
      </nav>
      {children}
      <div className="slots">
        <section>{team}</section>
        <section>{analytics}</section>
      </div>
    </main>
  )
}
```

`LayoutProps<'/dashboard'>` — глобальний тип, який Next.js генерує під час `next dev`, `next build` або `next typegen`. Він знає про слоти з файлової структури: якщо перейменувати `@analytics`, TypeScript підсвітить layout. Імпортувати тип не треба.

Три правила, які пояснюють майже всю решту теми:

1. **Слот — не сегмент маршруту.** `app/dashboard/@team/settings/page.tsx` відповідає URL `/dashboard/settings`, а не `/dashboard/@team/settings`. Слот лише каже, **в яке місце layout** покласти сторінку.
2. **`children` — теж слот.** Неявний: `app/dashboard/page.tsx` — те саме, що `app/dashboard/@children/page.tsx`. Тому все, що далі сказано про слоти, стосується й `children`.
3. **Кожен слот шукає свою сторінку для поточного URL окремо.** Для `/dashboard/settings` `@team` знаходить `settings/page.tsx`, а `@analytics` і `children` — ні. Що вони покажуть, залежить від типу навігації — це наступний розділ.

Усередині слота можна мати власний `layout.tsx`, тоді слот навігується незалежно, як група вкладок. Наприклад, `@analytics/layout.tsx` з посиланнями на `/page-views` і `/visitors` перемикає лише вміст аналітики. Прочитати активний сегмент слота в клієнтському компоненті можна через `useSelectedLayoutSegment('analytics')` — хук приймає назву слота як `parallelRouteKey`.

Документація додає ще одне обмеження: слоти одного рівня — частини **одного маршруту**, тож не можна мати один слот пререндереним, а сусідній — динамічним. Якщо динамічний один, динамічні всі. З `cacheComponents: true` це менш помітно, бо в одному маршруті живуть статична оболонка і динамічні «дірки». Наш дашборд у виводі `next build` позначений `◐ /dashboard` (Partial Prerender): `@team` потрапив у статичну оболонку, а `@analytics` стрімиться під час запиту.

> [!diagram] Файли дашборда: слоти не додають сегментів у URL
> ```yaml
> layout: tree
> nodes:
>   - { id: dash, label: "app/dashboard/", text: "layout.tsx", note: "отримує children, team, analytics", tone: blue, icon: "px:folder" }
>   - { id: page, label: "children", text: "page.tsx + default.tsx", note: "/dashboard", parent: dash, tone: gray }
>   - { id: team, label: "@team", text: "page.tsx", note: "/dashboard", parent: dash, tone: violet }
>   - { id: teamset, label: "@team/settings", text: "page.tsx", note: "/dashboard/settings", parent: team, tone: violet }
>   - { id: an, label: "@analytics", text: "page.tsx + default.tsx", note: "/dashboard; settings немає", parent: dash, tone: orange }
>   - { id: anl, label: "@analytics", text: "loading.tsx + error.tsx", note: "лише для цього слота", parent: an, tone: orange }
> steps:
>   - { focus: dash, note: "Layout сегмента dashboard отримує слоти як props. Папки з @ — не сегменти, тож у URL їх немає." }
>   - { show: [page, team, an], note: "Для /dashboard кожен слот знаходить свій page.tsx. children — теж слот, просто без @." }
>   - { show: teamset, note: "Для /dashboard/settings збіг є лише в @team. У children і @analytics сторінки settings немає." }
>   - { show: anl, focus: anl, note: "loading.tsx і error.tsx усередині слота обгортають лише його: повільна чи зламана аналітика не чіпає команду." }
> ```
> Слот визначає місце в layout, а URL складається лише з сегментів маршруту.

> [!quiz] Перевір себе: обери правдиві твердження про слоти
> level: middle · type: multi · id: nextjs-core-05-quiz-02
>
> - [x] `app/shop/@cart/page.tsx` відповідає URL `/shop`
> - [x] `children` — неявний слот, і йому теж може знадобитися `default.tsx`
> - [x] Layout отримує слот `@cart` як prop `cart`
> - [ ] Слот можна відкрити окремо за URL `/shop/@cart`
> - [ ] Слот рендериться в будь-якому layout застосунку, якщо передати його через контекст
> - [ ] Кожен слот — окремий маршрут з власним HTTP-запитом при навігації
>
> **Пояснення:** `@` прибирає папку з URL, а prop отримує лише layout того самого рівня. Слоти — частини одного маршруту: їх рендерить один запит, і окремого URL у слота немає. Неявний `children` поводиться як будь-який інший слот, тож без збігу при reload йому так само потрібен `default.tsx`.

### 🔀 Soft і hard navigation: що показує слот без збігу

Next.js розрізняє два види переходів (детально — у [[Next.js - 04. Навігація під капотом]]):

- **Soft navigation** — клієнтський перехід через `<Link>`, `router.push()`, `router.back()` чи кнопки «назад/вперед» браузера. React уже запущений, роутер знає, що зараз у кожному слоті, і оновлює лише ту частину дерева, яка змінилася.
- **Hard navigation** — повне завантаження сторінки: перший захід за URL, reload, відкриття посилання в новій вкладці, `<a href>` без `Link`. Сервер рендерить усе з нуля і про попередній стан слотів не знає нічого.

Для слота, у якого **є** сторінка під поточний URL, різниці немає: він її рендерить. Різниця — у слотах **без збігу**:

| Слот без збігу для URL | Soft navigation | Hard navigation |
|---|---|---|
| є `default.tsx` | лишає те, що показував | рендерить `default.tsx` |
| немає `default.tsx` | лишає те, що показував | **404 для всієї сторінки** |

Перевірено на продакшн-збірці 16.3.8 у дашборді вище. Відкрили `/dashboard` і клікнули «Налаштування команди»: `@team` перемкнувся на «Команда: налаштування», а `@analytics` показував «Відвідувачі: 1284», хоча для `/dashboard/settings` в аналітиці сторінки немає. Після F5 на тому самому URL аналітика показала `default.tsx` — «Аналітика доступна на огляді.».

Чому так? Під час soft navigation роутер тримає дерево сегментів кожного слота і запитує в сервера лише змінене. Слот без збігу просто не чіпають — так і задумано: користувач перемкнув вкладку команди, і аналітика не має зникати. При hard navigation дерева ще немає, і сервер має вирішити сам. Показати «щось випадкове» він не може, тож бере `default.tsx`, а без нього повертає 404 — документація пояснює це як захист від випадкового рендеру слота на сторінці, для якої він не призначений.

Наслідок, про який часто забувають: URL не однозначно визначає екран. Після soft navigation на `/dashboard/settings` користувач бачить одне, а після reload того самого URL — інше. Тому `default.tsx` проєктують так, щоб reload не здавався поломкою: показують ту саму сторінку, заглушку або нічого.

> [!quiz] Перевір себе: що віддасть сервер без default.tsx?
> level: middle · type: output · id: nextjs-core-05-quiz-03
>
> У дашборді з попереднього тесту видалили `app/dashboard/@analytics/default.tsx`. Решта файлів на місці. `next build` і `next start`. Користувач відкриває в новій вкладці `http://localhost:3000/dashboard/settings`. Що він побачить?
>
> - [ ] Помилку збірки: без `default.tsx` проєкт не збереться
> - [ ] Сторінку, де замість аналітики порожнє місце
> - [x] Сторінку 404 зі статусом 404 — для всього маршруту, не лише для слота
> - [ ] Сторінку з «Відвідувачі: 1284»: Next.js візьме найближчу сторінку слота
>
> **Пояснення:** нова вкладка — hard navigation, і в `@analytics` немає ні сторінки `settings`, ні `default.tsx`. Next.js 16.3.8 підставляє вбудований default, який викликає `notFound()`, тож 404 отримує весь маршрут, навіть `@team`, у якого збіг є. Збірка при цьому проходить, хоча гайд з оновлення до 16 обіцяє помилку (деталі — у наступному розділі).

### 🧷 default.tsx: фолбек слота

`default.tsx` рендериться в слоті, коли Next.js **не може відновити** його активний стан при повному завантаженні сторінки. Що в ньому повертати — продуктове рішення:

| Що повертає `default.tsx` | Коли так роблять |
|---|---|
| `null` | слот «опційний»: модалка, бічна панель, банер. На reload його просто немає |
| ту саму розмітку, що й `page.tsx` слота | слот має виглядати однаково на всіх підсторінках (аналітика, сайдбар) |
| заглушку («Аналітика доступна на огляді») | користувачу треба пояснити, чому блок порожній |
| `notFound()` | явно повернути стару поведінку: без збігу — 404 |

```tsx
// app/dashboard/@analytics/default.tsx — немає підсторінки settings: показуємо заглушку
export default function AnalyticsDefault() {
  return <p>Аналітика доступна на огляді.</p>
}
```

`children` теж потребує фолбеку: для `/dashboard/settings` у `app/dashboard/` немає `settings/page.tsx`, тож при reload неявному слоту `children` теж треба щось показати. Перевірено: без `app/dashboard/default.tsx` hard navigation на `/dashboard/settings` дає 404, навіть коли обидва іменовані слоти мають свої `default.tsx`.

```tsx
// app/dashboard/default.tsx — фолбек для children, коли URL глибший (/dashboard/settings)
export default function DashboardDefault() {
  return <h1>Дашборд</h1>
}
```

`default.tsx` приймає `params` — Promise з динамічними параметрами від кореня до підсторінок слота: для `app/[artist]/@sidebar/default.tsx` на `/zack` це `Promise<{ artist: 'zack' }>`. Тому фолбек може бути повноцінним серверним компонентом із даними, а не лише заглушкою.

> [!warning] Розбіжність з документацією
> [Upgrading: Version 16 → Parallel Routes `default.js` requirement](https://nextjs.org/docs/app/guides/upgrading/version-16#parallel-routes-defaultjs-requirement) каже, що з 16 кожен слот потребує `default.js` і «Builds will fail without them», а [default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default) — що для іменованих слотів «an error is returned». На Next.js 16.3.8 і `next build` (Turbopack і `--webpack`), і `next dev` проходять без `default.tsx`. Next.js підставляє вбудований `next/dist/client/components/builtin/default.js`, який викликає `notFound()`, і hard navigation на URL без збігу дає 404 для всього маршруту. Тож **збірка тебе не попередить**: додавай `default.tsx` у кожен слот сам і перевіряй reload на кожній підсторінці.

### ⏳ Незалежні loading і error у кожному слоті

Слоти стрімляться незалежно, і в кожного можуть бути власні `loading.tsx` та `error.tsx` (як вони працюють, розбираємо в темах 11 і 13). Повільна аналітика не затримує команду, а помилка в аналітиці не валить сторінку:

```tsx
// app/dashboard/@analytics/page.tsx — повільний слот зі своїми loading і error
import { connection } from 'next/server'

async function getStats() {
  await connection() // дані на запит, не на збірці
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { visitors: 1284 }
}

export default async function AnalyticsPage({ searchParams }: PageProps<'/dashboard'>) {
  const { fail } = await searchParams
  if (fail === '1') throw new Error('Сервіс аналітики недоступний')

  const stats = await getStats()
  return <h2>Відвідувачі: {stats.visitors}</h2>
}
```

```tsx
// app/dashboard/@analytics/loading.tsx — скелетон лише для цього слота
export default function AnalyticsLoading() {
  return <p>Завантажуємо аналітику…</p>
}
```

```tsx
// app/dashboard/@analytics/error.tsx — помилка аналітики не валить команду
'use client'

export default function AnalyticsError({ retry }: { error: Error; retry: () => void }) {
  return (
    <div>
      <p>Аналітика тимчасово недоступна.</p>
      <button onClick={() => retry()}>Спробувати ще</button>
    </div>
  )
}
```

У HTML, який віддає `next start` для `/dashboard`, одразу є «Команда: 5 людей» і «Завантажуємо аналітику…», а «Відвідувачі» доїжджають пізніше в тому самому потоці. На `/dashboard?fail=1` команда на місці, а замість аналітики — «Аналітика тимчасово недоступна.» з кнопкою. Межі `loading` і `error` стоять усередині слота, тож обгортають лише його вміст.

> [!note] Чому сторінкам з даними потрібен `loading.tsx` / `<Suspense>`
> Приклади зібрані з `cacheComponents: true`. Дані, невідомі на етапі збірки (тут `connection()` + затримка, у житті — запит до БД чи API), мають бути всередині `<Suspense>`: `loading.tsx` слота і є такою межею. Без неї `next build` зупиниться з `Route "/dashboard": Next.js encountered uncached or runtime data during prerendering.` Детально — у темах 11–12, 14–16.

### 🎭 Умовні слоти: показати слот за роллю

Слоти зручні, коли один URL має показувати різне різним людям: адмін бачить панель керування, решта — свої замовлення. Layout вирішує, який слот повернути:

```tsx
// app/panel/layout.tsx — умовний слот: адмін бачить @admin, решта — @user
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function ByRole({ admin, user }: { admin: React.ReactNode; user: React.ReactNode }) {
  const role = (await cookies()).get('role')?.value // у реальному застосунку — сесія з DAL
  return role === 'admin' ? admin : user
}

export default function PanelLayout({ children, admin, user }: LayoutProps<'/panel'>) {
  return (
    <main>
      {children}
      <Suspense fallback={<p>Перевіряємо роль…</p>}>
        <ByRole admin={admin} user={user} />
      </Suspense>
    </main>
  )
}
```

`cookies()` — дані запиту, тож під Cache Components їх читають усередині `<Suspense>`: статична оболонка (заголовок, фолбек) пререндериться, а вибір слота стрімиться.

Тепер головне. **Обидва слоти рендеряться на сервері, незалежно від того, який повертає layout.** Умова вирішує, що користувач **бачить**, а не що **виконується**. Документація прямо попереджає: `@admin/page.tsx` виконує свої запити для кожного користувача, і його результат потрапляє у відповідь браузеру. Ми перевірили на 16.3.8: `curl` на `/panel` без cookie `role=admin` повертає HTML, де на екрані «Мої замовлення», але у вбудованому RSC payload лежить рядок `Адмін: виручка ADMIN-ONLY-REVENUE`.

Висновок: умовний слот — **UI-перемикач, а не межа доступу**. Перевірку ролі ставлять у кожному слоті біля даних — у сторінці `@admin` або в Data Access Layer, який вона викликає (розділ «Auth і безпека»). Тоді для звичайного користувача `@admin` поверне порожнечу чи `notFound()`, і в payload не буде нічого цінного.

> [!quiz] Перевір себе: чи потрапить секрет у відповідь?
> level: senior · type: output · id: nextjs-core-05-quiz-04
>
> Layout `app/panel/layout.tsx` з прикладу вище повертає `admin` лише для `role=admin`. Сторінка `@admin/page.tsx` без перевірок рендерить `<h2>Адмін: виручка ADMIN-ONLY-REVENUE</h2>`. Користувач без cookie робить `curl http://localhost:3000/panel` на продакшн-збірці. Чи є рядок `ADMIN-ONLY-REVENUE` у тілі відповіді?
>
> - [ ] Ні: layout не повернув `admin`, тож React його навіть не рендерив
> - [x] Так: `@admin` відрендерився на сервері, і його вивід лежить у RSC payload всередині HTML
> - [ ] Лише в `next dev`: продакшн-збірка відкидає невикористані слоти
> - [ ] Ні, але він прийде, щойно користувач клікне будь-який `Link`
>
> **Пояснення:** слоти — props layout, і Next.js рендерить їх до того, як layout вирішить, що показати. На екрані «Мої замовлення», а у вихідному коді сторінки — дані адміна. Перевіряй роль у сторінці слота або в DAL, а не лише в layout.

### 🪝 Intercepting routes: маркери (.), (..), (..)(..), (...)

**Intercepting routes** дозволяють під час soft navigation показати маршрут з іншої частини застосунку **в поточному layout**, не перемикаючи контекст. Класика — фото зі стрічки: клік відкриває `/photos/2` поверх стрічки, а URL у браузері — справжній `/photos/2`. Перехоплення працює лише при soft navigation. Reload чи поширене посилання відкривають звичайну сторінку `/photos/2`.

Перехоплювальну папку називають маркером і назвою маршруту, який перехоплюють:

| Маркер | Що означає | Аналогія |
|---|---|---|
| `(.)` | сегмент **того самого рівня** | `./` |
| `(..)` | сегмент **на рівень вище** | `../` |
| `(..)(..)` | сегмент **на два рівні вище** | `../../` |
| `(...)` | сегмент **від кореня** `app` | `/` |

Найважливіше речення теми: **маркер рахує сегменти маршруту, а не папки файлової системи.** Слоти `@name` і групи `(name)` — не сегменти, тож їх пропускають. Візьмемо `app/(market)/feed/@modal/(..)photos/[id]/page.tsx`. Папок над `(..)photos` три: `(market)`, `feed`, `@modal`. А сегмент маршруту лише один — `feed`. `(..)` піднімається з `/feed` на рівень вище, у корінь, і перехоплює `/photos/[id]`. Якби `(..)` рахував папки, він опинився б «усередині `/feed`» — саме так помиляються найчастіше.

Цю логіку видно й у вихідному коді Next.js (`shared/lib/router/utils/interception-routes.js`): шлях до маркера нормалізується (групи, слоти й `page` відкидаються), а потім для `(.)` до нього дописують решту, для `(..)` відрізають один сегмент, для `(..)(..)` — два, для `(...)` починають з `/`. Неможливі підйоми зупиняють збірку. Перевірено на 16.3.8:

```text
Error: Invalid interception route: /(..)photos/[id]. Cannot use (..) marker at the root level, use (.) instead.

Error: Invalid interception route: /feed/(..)(..)photos/[id]. Cannot use (..)(..) marker at the root level or one level up.
```

Перша помилка — для `app/@modal/(..)photos/[id]`, друга — для `app/(market)/feed/@modal/(..)(..)photos/[id]`. Зверни увагу: у тексті помилки шлях уже без `@modal` і `(market)`. Так Next.js підказує, від чого він рахує рівні.

Ще одна деталь, яку видно лише в браузері: **перехоплення спрацьовує тільки під час навігації зсередини перехоплювального сегмента**. Next.js будує для кожного intercepting route rewrite з умовою на заголовок `Next-Url` — URL сторінки, з якої йде перехід. Тому:

- `app/@modal/(.)photos/[id]` (слот у корені) перехоплює `/photos/2` **звідусіль**: перевірено, `router.push('/photos/3')` зі сторінки «Про нас» відкрив модалку поверх «Про нас»;
- `app/(market)/feed/@modal/(..)photos/[id]` перехоплює лише переходи з `/feed` і глибше: з `/feed` фото відкрилося модалкою, а з `/photos` той самий `Link` відкрив повну сторінку.

Intercepting route не обовʼязково живе в слоті. Папка `app/feed/(..)photos/[id]` без `@modal` теж працює, але перехоплена сторінка тоді **замінює** `children` стрічки, а не накладається поверх: перевірено, після кліку зі стрічки заголовок «Стрічка» зник, а на його місці — картка фото, при URL `/photos/1`. Для модалки потрібні обидва механізми: слот дає «друге місце» в layout, перехоплення кладе туди чужий маршрут.

> [!quiz] Перевір себе: яку папку створити?
> level: middle · type: single · id: nextjs-core-05-quiz-05
>
> Є повна сторінка товару `app/(shop)/products/[slug]/page.tsx`. Хочеш, щоб клік по товару в каталозі `/catalog` відкривав його в модалці. Layout каталогу — `app/(shop)/catalog/layout.tsx` зі слотом `@modal`. Як назвати перехоплювальну папку?
>
> - [x] `app/(shop)/catalog/@modal/(..)products/[slug]`
> - [ ] `app/(shop)/catalog/@modal/(..)(..)products/[slug]` — бо над нею `@modal` і `catalog`
> - [ ] `app/(shop)/catalog/@modal/(.)products/[slug]` — бо `products` і `catalog` в одній групі
> - [ ] `app/(shop)/catalog/@modal/(..)(..)(..)products/[slug]` — бо ще група `(shop)`
>
> **Пояснення:** рахуємо лише сегменти маршруту. Перехоплювальний маршрут — `/catalog`, `(..)` піднімається в корінь, звідки й починається `/products/[slug]`. `@modal` і `(shop)` у підрахунку не беруть участі. `(.)` перехопив би `/catalog/products/[slug]`, якого не існує, а `(..)(..)` з першого рівня — помилка збірки.

### 🖼️ Модалка з власним URL: покроково

Тепер зберемо патерн, заради якого обидва механізми найчастіше й згадують на співбесідах. Вимоги:

- клік по фото в галереї відкриває модалку, а URL стає `/photos/2`;
- посиланням на `/photos/2` можна поділитися — отримувач бачить повну сторінку фото;
- reload з відкритою модалкою показує повну сторінку, а не порожню галерею;
- «назад» закриває модалку, «вперед» відкриває знову;
- перехід на іншу сторінку з модалки її закриває.

> [!diagram] Файли модалки з URL
> ```yaml
> layout: tree
> nodes:
>   - { id: app, label: "app/", text: "layout.tsx", note: "рендерить children і modal", tone: blue, icon: "px:folder" }
>   - { id: photos, label: "photos/", text: "page.tsx", note: "галерея /photos", parent: app, tone: gray }
>   - { id: full, label: "photos/[id]/", text: "page.tsx", note: "повна сторінка: reload, посилання", parent: photos, tone: green }
>   - { id: modal, label: "@modal/", text: "default.tsx + page.tsx", note: "обидва повертають null", parent: app, tone: violet }
>   - { id: icpt, label: "@modal/(.)photos/[id]/", text: "page.tsx", note: "та сама сторінка в <Modal>", parent: modal, tone: orange, icon: "px:image" }
>   - { id: catch, label: "@modal/[...catchAll]/", text: "page.tsx", note: "null: закриває слот на інших сторінках", parent: modal, tone: violet }
> steps:
>   - { focus: app, note: "Root layout отримує слот @modal як prop modal і рендерить його поруч із children." }
>   - { show: [photos, full], note: "Звичайні маршрути: галерея і повна сторінка фото. Саме їх бачить hard navigation." }
>   - { show: modal, note: "default.tsx повертає null: на reload модалки немає. page.tsx у слоті закриває його на /." }
>   - { show: icpt, focus: icpt, note: "(.) — від сегмента кореня, бо @modal не сегмент. Перехоплює /photos/[id] при soft navigation." }
>   - { show: catch, note: "Будь-яка інша сторінка знаходить у слоті catch-all, що повертає null, і модалка зникає." }
> ```
> Дві сторінки для одного URL: повна в `children`, модальна в `@modal`.

**1. Дані й спільний вміст.** Картку фото використовують обидві сторінки, тож її виносять в окремий серверний компонент:

```ts
// lib/photos.ts — дані в памʼяті
export type Photo = { id: string; title: string; author: string; color: string }

export const photos: Photo[] = [
  { id: '1', title: 'Карпати на світанку', author: 'Оля', color: '#f4a261' },
  { id: '2', title: 'Нічний Київ', author: 'Тарас', color: '#264653' },
  { id: '3', title: 'Море в Одесі', author: 'Ірина', color: '#2a9d8f' },
]

export function getPhoto(id: string): Photo | undefined {
  return photos.find((photo) => photo.id === id)
}
```

```tsx
// app/ui/photo-card.tsx — спільний вміст для модалки й повної сторінки
import type { Photo } from '@/lib/photos'

export function PhotoCard({ photo }: { photo: Photo }) {
  return (
    <figure>
      <div style={{ background: photo.color, height: 200, borderRadius: 8 }} />
      <figcaption>
        {photo.title} — {photo.author}
      </figcaption>
    </figure>
  )
}
```

> [!note] Чому в прикладах дані в памʼяті
> Приклади зібрані з `cacheComponents: true`. Справжній запит до БД у `getPhoto()` зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують (`'use cache'`, тема курсу 15) або обгортають у `<Suspense>` (теми 11–12). Тут ми це опускаємо.

**2. Галерея і повна сторінка.** Галерея — звичайні `Link`, без жодної «модальної» логіки. Повна сторінка — звичайний динамічний маршрут з [[Next.js - 03. Динамічні маршрути]]:

```tsx
// app/photos/page.tsx — галерея: звичайні Link на /photos/[id]
import Link from 'next/link'
import { photos } from '@/lib/photos'

export default function Gallery() {
  return (
    <main>
      <h1>Галерея</h1>
      <div className="grid">
        {photos.map((photo) => (
          <Link
            key={photo.id}
            href={`/photos/${photo.id}`}
            className="tile"
            style={{ background: photo.color }}
            aria-label={photo.title}
          />
        ))}
      </div>
    </main>
  )
}
```

```tsx
// app/photos/[id]/page.tsx — повна сторінка фото (прямий захід, reload, поширене посилання)
import { notFound } from 'next/navigation'
import { getPhoto, photos } from '@/lib/photos'
import { PhotoCard } from '@/app/ui/photo-card'

export function generateStaticParams() {
  return photos.map((photo) => ({ id: photo.id }))
}

export default async function PhotoPage({ params }: PageProps<'/photos/[id]'>) {
  const { id } = await params
  const photo = getPhoto(id)
  if (!photo) notFound()

  return (
    <main>
      <h1>Фото {photo.id} (повна сторінка)</h1>
      <PhotoCard photo={photo} />
    </main>
  )
}
```

**3. Слот у root layout.** Layout рендерить `modal` поруч із `children`. `LayoutProps<'/'>` уже знає про слот `modal`:

```tsx
// app/layout.tsx — root layout отримує слот @modal як prop `modal`
import Link from 'next/link'
import './globals.css'

export default function RootLayout({ children, modal }: LayoutProps<'/'>) {
  return (
    <html lang="uk">
      <body>
        <nav>
          <Link href="/">Головна</Link>
          <Link href="/photos">Галерея</Link>
          <Link href="/dashboard">Дашборд</Link>
          <Link href="/about">Про нас</Link>
        </nav>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

**4. Перехоплена сторінка в слоті.** Той самий `PhotoCard`, але в клієнтській оболонці `Modal`. Вміст лишається серверним — він приходить у `Modal` як `children` (interleaving із [[Next.js - 07. Server і Client Components]]):

```tsx
// app/@modal/(.)photos/[id]/page.tsx — перехоплений маршрут: те саме фото, але в модалці
import { notFound } from 'next/navigation'
import { getPhoto, photos } from '@/lib/photos'
import { Modal } from '@/app/ui/modal'
import { PhotoCard } from '@/app/ui/photo-card'

export function generateStaticParams() {
  return photos.map((photo) => ({ id: photo.id }))
}

export default async function PhotoModal({ params }: PageProps<'/photos/[id]'>) {
  const { id } = await params
  const photo = getPhoto(id)
  if (!photo) notFound()

  return (
    <Modal>
      <PhotoCard photo={photo} />
    </Modal>
  )
}
```

`(.)` тут, бо слот `@modal` лежить у корені, а `photos` — сегмент того самого рівня. `generateStaticParams` потрібен і тут: під Cache Components перехоплена сторінка — окремий маршрут, і `next build` показує його як `/(.)photos/[id]` з пререндереними `/(.)photos/1…3`.

**5. Оболонка модалки.** Закриття — крок назад в історії, бо модалку відкрив крок уперед:

```tsx
// app/ui/modal.tsx — оболонка модалки: закривається кроком назад в історії
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') router.back()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [router])

  return (
    <div className="backdrop" onClick={() => router.back()}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button onClick={() => router.back()} aria-label="Закрити">
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
```

**6. Порожні стани слота.** Три файли, що повертають `null`, — кожен для свого випадку:

```tsx
// app/@modal/default.tsx — слот порожній, коли його стан невідомий (перший захід, reload)
export default function Default() {
  return null
}
```

```tsx
// app/@modal/[...catchAll]/page.tsx — будь-яка інша сторінка «закриває» слот
export default function CatchAll() {
  return null
}
```

```tsx
// app/@modal/page.tsx — catch-all не матчить "/", тож корінь закриваємо окремо
export default function ModalRoot() {
  return null
}
```

Навіщо потрібні catch-all і `page.tsx`, розберемо в наступному розділі. Спершу — що ми перевірили в браузері на `next build && next start`:

| Дія | URL | Що на екрані |
|---|---|---|
| клік по фото в галереї | `/photos/2` | «Галерея» + модалка «Нічний Київ — Тарас» |
| F5 з відкритою модалкою | `/photos/2` | «Фото 2 (повна сторінка)», модалки немає |
| «назад» з модалки | `/photos` | галерея, модалка закрита, сторінка не перезавантажувалась |
| «вперед» після цього | `/photos/3` | модалка знову відкрита поверх галереї |
| ✕, клік по фону або Escape | `/photos` | модалка закрита (`router.back()`) |
| посилання в новій вкладці | `/photos/3` | повна сторінка, у DOM немає жодного `role="dialog"` |
| `Link` «Про нас» з модалки | `/about` | «Про нас», модалки немає (catch-all) |
| `router.push('/photos/3')` з «Про нас» | `/photos/3` | «Про нас» + модалка: слот у корені перехоплює звідусіль |

> [!diagram] Життя модалки: клік, reload, назад
> ```yaml
> layout: flow
> nodes:
>   - { id: gal, label: "/photos", text: "Галерея", note: "children = photos/page.tsx", tone: gray, icon: "px:image" }
>   - { id: soft, label: "soft navigation", text: "Link → /photos/2", note: "Next-Url: /photos", tone: blue }
>   - { id: mod, label: "/photos/2 · модалка", text: "children: галерея\nmodal: (.)photos/[id]", tone: orange }
>   - { id: hard, label: "reload", text: "GET /photos/2", note: "без перехоплення", tone: violet }
>   - { id: full, label: "/photos/2 · повна", text: "children: photos/[id]\nmodal: default → null", tone: green }
> steps:
>   - { focus: gal, note: "Користувач у галереї. Слот @modal для /photos знаходить catch-all і показує null." }
>   - { move: { from: gal, to: soft, value: "click" }, note: "Клік по Link — soft navigation. Роутер шле запит із заголовком Next-Url: /photos." }
>   - { move: { from: soft, to: mod, value: "/photos/2" }, note: "Next.js бачить intercepting route і рендерить (.)photos/[id] у слоті modal. children не змінюється — галерея лишається під модалкою." }
>   - { move: { from: mod, to: hard, value: "F5" }, note: "Reload — hard navigation. Попереднього стану немає, і перехоплення не застосовується." }
>   - { move: { from: hard, to: full, value: "HTML" }, note: "children рендерить повну сторінку photos/[id], а @modal бере default.tsx і показує нічого." }
>   - { focus: gal, note: "А «назад» з модалки (без reload) — soft navigation на /photos: роутер відновлює попередній стан, і модалка зникає." }
> ```
> Один URL — два екрани: який з них, вирішує тип навігації.

> [!quiz] Перевір себе: склади, що відбувається з модалкою
> level: middle · type: order · id: nextjs-core-05-quiz-06
>
> ```order
> Користувач на /photos клікає Link на /photos/2
> Роутер шле запит із заголовком Next-Url: /photos
> Next.js рендерить (.)photos/[id] у слоті @modal, children лишається галереєю
> Користувач натискає F5 — hard navigation на /photos/2
> children рендерить повну сторінку photos/[id], а @modal — default.tsx
> Користувач натискає «назад» і повертається на /photos
> Next.js рендерить повну сторінку в children, а модалку поверх неї ✗
> ```
>
> **Пояснення:** перехоплення працює лише при soft navigation, тож після F5 той самий URL дає повну сторінку, а слот бере `default.tsx`. «Модалка поверх повної сторінки» не буває: у hard navigation intercepting route не застосовується зовсім.

> [!quiz] Перевір себе: заповни файли слота модалки
> level: middle · type: fill · bank: (..), loading, push · id: nextjs-core-05-quiz-07
>
> ```tsx fill
> // app/@modal/[[default]].tsx — на reload модалки немає
> export default function Default() {
>   return [[null]]
> }
>
> // app/@modal/[[(.)]]photos/[id]/page.tsx — перехоплює /photos/[id]
>
> // app/ui/modal.tsx — закриття
> 'use client'
> import { useRouter } from 'next/navigation'
>
> export function Modal({ children }: { children: React.ReactNode }) {
>   const router = useRouter()
>   return <button onClick={() => router.[[back]]()}>✕</button>
> }
> ```
>
> **Пояснення:** `default.tsx` повертає `null`, щоб на hard navigation слот був порожнім. Слот `@modal` лежить у корені, а `photos` — сегмент того самого рівня, тож маркер `(.)`. `(..)` з кореня — помилка збірки. Закривають кроком назад: `router.push` додав би новий запис в історію, і «назад» знову відкрив би модалку.

### 🧹 Закрити модалку: router.back(), Link і «застряглий» слот

`router.back()` — найчистіший спосіб закрити модалку: її відкрив запис в історії, і закриття цей запис знімає. «Назад» у браузері і кнопка ✕ дають той самий результат, а «вперед» відкриває модалку знову. Але модалку закривають і **переходом кудись ще** — кліком по меню, по посиланню всередині модалки, `router.push` після дії. Тут і спливає правило soft navigation: **слот без збігу лишає, що показував.**

Ми перевірили це на копії застосунку без `@modal/[...catchAll]`: модалка відкрита, клік на «Про нас» — URL `/about`, заголовок «Про нас», а модалка «Карпати на світанку» висить поверх. Ще один клік на «Дашборд» — модалка й далі на місці. Для `/about` у слоті `@modal` збігу немає, тож роутер лишає стару сторінку слота.

Ліки — дати слоту збіг, який рендерить `null`:

- `@modal/[...catchAll]/page.tsx` — для будь-якого URL з хоча б одним сегментом;
- `@modal/page.tsx` — для `/`. **Catch-all не матчить корінь**: `[...slug]` вимагає хоча б один сегмент (опційний `[[...slug]]` — тема 03). Перевірено: з catch-all, але без `@modal/page.tsx`, клік на «Головна» з модалки дає `/` із модалкою поверх головної. Документація показує обидва файли окремими прикладами, і легко взяти лише один.

Закривати модалку `Link`-ом теж можна (`<Link href="/photos">`), але це **push**: в історії зʼявиться новий запис, і «назад» знову відкриє модалку. Для кнопки ✕ обирай `router.back()`, а `Link` залиш для справжніх переходів — їх закриє catch-all.

Тонкість, яку видно лише в DevTools. З `cacheComponents: true` Next.js не розмонтовує сторінку, з якої пішли, а **ховає** її через React `<Activity>` — DOM лишається з `display: none` (до трьох маршрутів, [[Next.js - 04. Навігація під капотом]]). Після закриття модалки `document.querySelector('[role=dialog]')` її все ще знаходить, але `checkVisibility()` повертає `false`. Для користувача модалка зникла, а от e2e-тест «немає діалогу в DOM» впаде. Перевіряй видимість (`toBeVisible()` у Playwright), а не наявність.

> [!quiz] Перевір себе: що буде після кліку на «Головна»?
> level: middle · type: output · id: nextjs-core-05-quiz-08
>
> Модалка з цього розділу, але в слоті `@modal` лише `default.tsx`, `(.)photos/[id]/page.tsx` і `[...catchAll]/page.tsx` — без `@modal/page.tsx`. Користувач відкрив модалку з галереї (`/photos/1`) і клікнув у меню `<Link href="/">Головна</Link>`. Що на екрані?
>
> - [ ] Головна без модалки: catch-all матчить будь-який URL
> - [x] Головна, а поверх неї та сама модалка: для `/` у слоті немає збігу
> - [ ] Сторінка 404: слот без збігу
> - [ ] Головна без модалки, бо `default.tsx` повертає `null`
>
> **Пояснення:** `[...catchAll]` вимагає хоча б один сегмент, тож `/` він не матчить. Під час soft navigation слот без збігу зберігає стан, а `default.tsx` спрацьовує лише на hard navigation. Тож модалка лишається. Ліки — `@modal/page.tsx`, що повертає `null`.

> [!quiz] Перевір себе: звідки працює перехоплення?
> level: senior · type: single · id: nextjs-core-05-quiz-09
>
> У застосунку є лише одне перехоплення — `app/(market)/feed/@modal/(..)photos/[id]/page.tsx`, і повна сторінка `app/photos/[id]/page.tsx`. Користувач на `/photos` (галерея, поза стрічкою) клікає `<Link href="/photos/2">`. Що він побачить?
>
> - [x] Повну сторінку фото: перехоплення діє лише для переходів з `/feed` і глибше
> - [ ] Модалку поверх галереї: intercepting route працює для будь-якого soft navigation на `/photos/2`
> - [ ] 404: `(..)` з `@modal` веде в `/feed/photos/2`
> - [ ] Помилку збірки: з групою `(market)` треба `(..)(..)`
>
> **Пояснення:** Next.js застосовує перехоплення як rewrite з умовою на заголовок `Next-Url` — URL, з якого йде навігація. Він має збігатися з перехоплювальним маршрутом `/feed` або бути глибшим. Перевірено: з `/feed` фото відкривається модалкою, з `/photos` — повною сторінкою. Група і слот у підрахунку рівнів не беруть участі, тож `(..)` правильний.

### 🧭 Коли що обрати

| Задача | Інструмент |
|---|---|
| Кілька незалежних блоків в одному layout, кожен зі своїм loading/error | parallel routes (слоти) |
| Вкладки всередині блоку, що перемикаються незалежно від сторінки | слот з власним `layout.tsx` |
| Різний UI за роллю на тому самому URL | умовний слот + перевірка доступу в кожному слоті |
| Модалка, якою можна поділитися і яка переживає reload | `@modal` + `(.)маршрут` + повна сторінка |
| Модалка без власного URL (підтвердження, тост) | звичайний Client Component зі станом — роутер не потрібен |
| Інший вміст для того самого URL за типом навігації | intercepting routes |

Останній рядок варто прочитати двічі: якщо модалці не потрібен URL, parallel і intercepting routes — зайва складність. Діалог «Видалити?» не варто відкривати за посиланням і не має переживати reload.

### 🏭 Як це роблять у продакшні

- **Модалка = повна сторінка + оболонка.** Вміст (картка товару, фото, форма входу) — один серверний компонент, який використовують і `app/x/[id]/page.tsx`, і `@modal/(.)x/[id]/page.tsx`. Тоді reload і модалка показують ті самі дані, а SEO отримує повну сторінку. Еталон — [nextgram](https://github.com/vercel-labs/nextgram) від Vercel.
- **Чекліст слота `@modal`:** `default.tsx` → `null`, `page.tsx` → `null`, `[...catchAll]/page.tsx` → `null`. Три файли, і жоден перехід не лишить модалку «висіти».
- **Закриття — `router.back()`**, Escape і клік по фону — теж. Фокус переводять у діалог при відкритті й повертають на картку після закриття. Нативний `<dialog>` з `showModal()` робить фон інертним і на Escape шле подію `cancel` — у її обробнику викликають той самий `router.back()`.
- **Перехоплення в layout розділу, а не в корені**, якщо модалка має відкриватися лише з одного місця: `app/feed/@modal/(..)photos/[id]` не відкриє модалку з пошуку чи профілю.
- **`default.tsx` у кожному слоті і в `children`** — правило code review. Збірка на 16.3.8 не попередить, тож CI-смоук «reload на кожній підсторінці дашборда → 200» ловить 404 до користувачів.
- **Умовні слоти — лише UI.** Доступ перевіряють у сторінці слота або в DAL. Тест «звичайний користувач не отримує даних адміна» дивиться на тіло відповіді (`curl`, Playwright `request`), а не на екран.
- **E2E з Activity:** закриту модалку шукають як невидиму (`expect(dialog).toBeHidden()`), а не «відсутню в DOM».

## ⚠️ Пастки

> [!pitfall] Немає default.tsx — і збірка мовчить
> На 16.3.8 `next build` проходить, а reload на підсторінці, де слот не має збігу, дає 404 для всієї сторінки. Помилку бачать лише користувачі, які оновили сторінку.
>
> ```text
> app/dashboard/@analytics/page.tsx      ✅ /dashboard
> app/dashboard/@analytics/default.tsx   ❌ забули → F5 на /dashboard/settings = 404
> ```

> [!pitfall] Забутий default.tsx для children
> Іменовані слоти мають фолбеки, а неявний `children` — ні. Для `/dashboard/settings` у `app/dashboard/` немає сторінки, тож reload знову дає 404.
>
> ```tsx
> // ✅ app/dashboard/default.tsx
> export default function DashboardDefault() {
>   return <h1>Дашборд</h1>
> }
> ```

> [!pitfall] Модалка «застрягла» після переходу
> Soft navigation на сторінку без збігу в `@modal` лишає модалку відкритою. Catch-all закриває її на всіх URL, крім `/` — для кореня потрібен окремий `@modal/page.tsx`.
>
> ```text
> app/@modal/[...catchAll]/page.tsx   → null   (/about, /dashboard, …)
> app/@modal/page.tsx                 → null   (/ — catch-all його не матчить)
> ```

> [!pitfall] (..) рахують по папках
> `@modal` і `(group)` — не сегменти маршруту. Хто рахує папки, ставить `(..)(..)` там, де треба `(..)`, і отримує помилку збірки або перехоплення не того маршруту.
>
> ```text
> app/(shop)/catalog/@modal/(..)products/[slug]      ✅ /catalog → /products/[slug]
> app/(shop)/catalog/@modal/(..)(..)products/[slug]  ❌ Cannot use (..)(..) marker at the root level or one level up.
> ```

> [!pitfall] Умовний слот як «захист»
> Layout повертає `admin` лише адміну, але `@admin` рендериться для всіх, і його вивід лежить у RSC payload.
>
> ```tsx
> // ❌ перевірка лише в layout
> return role === 'admin' ? admin : user
> // ✅ у app/panel/@admin/page.tsx — перевірка біля даних (DAL), інакше notFound()
> ```

> [!pitfall] Закриття модалки через Link
> `<Link href="/photos">` закриває модалку, але додає запис в історію: «назад» відкриває її знову, а користувач думає, що кнопка ✕ зламана. Для ✕ — `router.back()`.

## 🎤 На співбесіді

> [!interview] Як зробити модалку з власним URL, яка переживає reload і закривається кнопкою «назад»?
> level: middle · frequency: дуже часто · id: nextjs-core-05-int-01
>
> ---
>
> Parallel + intercepting routes. Повна сторінка `app/photos/[id]/page.tsx` — для прямого заходу, reload і поширених посилань. Слот `@modal` у layout, де модалка має зʼявлятися, і в ньому `(.)photos/[id]/page.tsx` — та сама картка в клієнтській оболонці `Modal`. При soft navigation Next.js перехоплює маршрут і рендерить його в слоті, а `children` лишає попередню сторінку під модалкою. При hard navigation перехоплення немає, і слот бере `default.tsx`, що повертає `null`. Закриття — `router.back()`, тож «назад» і ✕ поводяться однаково, а «вперед» відкриває модалку знову. Щоб модалка не лишалася після переходів, у слоті ще `[...catchAll]/page.tsx` і `page.tsx`, обидва з `null`.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🖼️ Модалка з власним URL: покроково|Розділ: модалка з URL]] · [Next.js: Parallel Routes → Modals](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#modals) · [vercel-labs/nextgram](https://github.com/vercel-labs/nextgram)

> [!interview] Що показує слот без збігу під час soft і hard navigation? Навіщо default.js?
> level: middle · frequency: часто · id: nextjs-core-05-int-02
>
> ---
>
> Кожен слот шукає сторінку для URL окремо. Під час soft navigation роутер знає, що зараз у кожному слоті, і слот без збігу лишає попередній вміст — так вкладки одного блоку не скидають інший. Після reload цього стану немає, тож сервер рендерить `default.js` слота, а без нього — 404 для всієї сторінки. `children` — неявний слот, йому теж потрібен `default.js`. Документація 16 обіцяє помилку збірки без `default.js`, але на 16.3.8 збірка проходить, а вбудований default просто викликає `notFound()`. Тому фолбеки додають свідомо: `null`, копія сторінки, заглушка або явний `notFound()`.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🔀 Soft і hard navigation: що показує слот без збігу|Розділ: soft і hard navigation]] · [Next.js: default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default) · [Next.js: Parallel Routes → Behavior](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#behavior)

> [!interview] Як рахуються маркери (.), (..), (...) в intercepting routes? Чому (..) іноді «не працює»?
> level: middle · frequency: часто · id: nextjs-core-05-int-03
>
> ---
>
> Маркери відносні, як `./` і `../`, але рахують **сегменти маршруту**, а не папки. Слоти `@name` і групи `(name)` не сегменти, тож `app/(market)/feed/@modal/(..)photos` піднімається з `/feed` у корінь і перехоплює `/photos`. `(.)` — той самий рівень, `(..)(..)` — два рівні вище, `(...)` — від кореня. Неможливий підйом (`(..)` з кореня) зупиняє збірку. Друга причина «не працює» — перехоплення діє лише при soft navigation і лише з перехоплювального сегмента: Next.js перевіряє заголовок `Next-Url`. Перехоплення з `/feed` не спрацює для переходу з `/search`, а reload ніколи не перехоплюється.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🪝 Intercepting routes: маркери (.), (..), (..)(..), (...)|Розділ: маркери]] · [Next.js: Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes)

> [!interview] Адмін і звичайний користувач на /dashboard бачать різне. Чи можна зробити це умовними слотами і що треба врахувати?
> level: senior · frequency: іноді · id: nextjs-core-05-int-04
>
> ---
>
> Можна: `@admin` і `@user`, а layout повертає один з них за роллю (роль із сесії читають усередині `<Suspense>`, бо це дані запиту). Але Next.js рендерить на сервері обидва слоти, незалежно від вибору layout. Запити `@admin` виконуються для кожного, а його вивід потрапляє в RSC payload. Перевірено: у HTML для звичайного користувача лежить текст адмінського слота. Тож умовний слот — лише UI-перемикач. Доступ перевіряють у кожній сторінці слота або в Data Access Layer. Бонус слотів — незалежні `loading` і `error` для кожної ролі.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🎭 Умовні слоти: показати слот за роллю|Розділ: умовні слоти]] · [Next.js: Conditional Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#conditional-routes) · [Next.js: Data Access Layer](https://nextjs.org/docs/app/guides/authentication#creating-a-data-access-layer-dal)

> [!interview] Модалка лишається відкритою після кліку на посилання в меню. Чому і як виправити?
> level: senior · frequency: іноді · id: nextjs-core-05-int-05
>
> ---
>
> Це soft navigation: для нового URL у слоті `@modal` немає збігу, і роутер зберігає попередній стан слота — перехоплену сторінку з модалкою. `default.tsx` тут не допоможе, він працює лише при hard navigation. Треба дати слоту збіг, що рендерить `null`: `@modal/[...catchAll]/page.tsx` для всіх URL з сегментами і `@modal/page.tsx` для `/`, бо catch-all корінь не матчить. Якщо закривати модалку `Link`-ом, у історії зʼявиться зайвий запис, тож кнопка ✕ — це `router.back()`. І ще: з Cache Components закрита модалка лишається в DOM прихованою (Activity), тож тести мають перевіряти видимість.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🧹 Закрити модалку: router.back(), Link і «застряглий» слот|Розділ: закриття модалки]] · [Next.js: Parallel Routes → Closing the modal](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#closing-the-modal) · [Next.js: Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)

## 🔗 Звʼязки

- [[Next.js - 02. Layouts, templates і route groups]] — layout, який отримує слоти, і групи `(name)`, що не рахуються в маркерах перехоплення.
- [[Next.js - 03. Динамічні маршрути]] — `[id]`, `[...slug]` і `[[...slug]]`: catch-all, що закриває модалку, і чому він не матчить корінь.
- [[Next.js - 04. Навігація під капотом]] — soft navigation, client router cache і Activity, яка ховає закриту модалку замість розмонтування.
- [[Next.js - 06. proxy.ts, redirects і rewrites]] — rewrites з умовою `has`: так Next.js і реалізує перехоплення через заголовок `Next-Url`.
- [[Next.js - 07. Server і Client Components]] — interleaving: серверна картка всередині клієнтської `Modal`.
- Далі в курсі: теми 11 і 13 — `loading` і `error` детально; «Auth і безпека» — Data Access Layer для умовних слотів.

## ⚡ Фішки

> [!reel] 🧩 Слот — не сегмент
> `app/dashboard/@team/settings/page.tsx` — це URL `/dashboard/settings`. `@` каже лише, в який prop layout покласти сторінку.

> [!reel] 🔀 Один URL — два екрани
> Після кліку слот без збігу зберігає старий вміст, а після F5 на тому самому URL показує `default.tsx`. URL не визначає екран однозначно — визначає ще й тип навігації.

> [!reel] 🕳️ Без default.tsx збірка мовчить
> На 16.3.8 `next build` проходить без `default.tsx`, хоча документація обіцяє помилку. Вбудований default викликає `notFound()`, і reload на підсторінці дає 404 усій сторінці.

> [!reel] 🪜 (..) рахує сегменти, а не папки
> У `app/(market)/feed/@modal/(..)photos` над маркером три папки, але один сегмент — `feed`. Тому `(..)` веде в корінь, на `/photos`.

> [!reel] 🎭 Невидимий слот теж рендериться
> Layout показує `@admin` лише адміну, але сторінка `@admin` виконується для всіх, і її вивід лежить у RSC payload. Перевіряй доступ у слоті, а не в layout.

> [!reel] 🏠 Catch-all не ловить корінь
> `@modal/[...catchAll]` закриває модалку на `/about`, але не на `/`. Для головної потрібен окремий `@modal/page.tsx` з `null`.
>
> ```text
> app/@modal/page.tsx               → null
> app/@modal/[...catchAll]/page.tsx → null
> ```

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке слот у parallel routes і як він потрапляє в layout?
> *дуже часто · теорія* · `nextjs-core-05-card-01`
>
> Папка з префіксом `@` (`@team`, `@modal`) з власними сторінками. Layout того самого рівня отримує слот як prop з тією самою назвою без `@` і рендерить його, де хоче, поруч із `children`. Тип props — `LayoutProps<'/шлях'>`, він знає про слоти.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🧩 Слоти: кілька сторінок в одному layout|Розділ: слоти]] · [Next.js: Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)

> [!question]- Чи впливає слот на URL?
> *часто · теорія* · `nextjs-core-05-card-02`
>
> Ні. `@name` — не сегмент маршруту: `app/@analytics/views/page.tsx` відповідає `/views`. Слот визначає лише місце в layout, а відкрити його окремо за URL не можна.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🧩 Слоти: кілька сторінок в одному layout|Розділ: слоти]] · [Next.js: Parallel Routes → Slots](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#slots)

> [!question]- Чим soft navigation відрізняється від hard navigation?
> *дуже часто · теорія* · `nextjs-core-05-card-03`
>
> Soft — клієнтський перехід (`Link`, `router.push`, `router.back`, «назад/вперед»): React працює, роутер знає стан слотів і оновлює змінене. Hard — повне завантаження (перший захід, reload, нова вкладка): сервер рендерить усе з нуля і попереднього стану не знає.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🔀 Soft і hard navigation: що показує слот без збігу|Розділ: soft і hard]] · [Next.js: Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

> [!question]- Що робить маркер (.) у назві папки?
> *часто · теорія* · `nextjs-core-05-card-04`
>
> Позначає intercepting route, що перехоплює маршрут **того самого рівня**. `app/@modal/(.)photos/[id]` перехоплює `/photos/[id]`: слот `@modal` не сегмент, тож рівень — корінь. При soft navigation сторінка з цієї папки рендериться замість повної.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🪝 Intercepting routes: маркери (.), (..), (..)(..), (...)|Розділ: маркери]] · [Next.js: Intercepting Routes → Convention](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention)

### 🟡 Middle

> [!question]- Що покаже слот без збігу для URL після кліку по Link і після reload?
> *дуже часто · теорія* · `nextjs-core-05-card-05`
>
> Після кліку — те, що показував до переходу: роутер зберігає активний стан слота. Після reload — `default.tsx` слота, а без нього — 404 для всієї сторінки.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🔀 Soft і hard navigation: що показує слот без збігу|Розділ: soft і hard]] · [Next.js: Parallel Routes → Behavior](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#behavior)

> [!question]- Що можна повертати з default.tsx і коли який варіант?
> *часто · практика* · `nextjs-core-05-card-06`
>
> `null` — для опційних слотів (модалка, панель). Ту саму розмітку, що й `page.tsx`, — коли блок має бути на всіх підсторінках. Заглушку — коли порожнє місце треба пояснити. `notFound()` — щоб явно лишити 404. `default.tsx` отримує `params` як Promise.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🧷 default.tsx: фолбек слота|Розділ: default.tsx]] · [Next.js: default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default)

> [!question]- Чому children теж може знадобитися default.tsx?
> *часто · теорія* · `nextjs-core-05-card-07`
>
> `children` — неявний слот. Якщо URL глибший за сторінки сегмента (`/dashboard/settings` є лише в `@team`), при reload `children` не знайде сторінки, і без `app/dashboard/default.tsx` уся сторінка стане 404.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🧷 default.tsx: фолбек слота|Розділ: default.tsx]] · [Next.js: default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default)

> [!question]- Як розв'язати (..) у app/(market)/feed/@modal/(..)photos/[id]?
> *часто · практика* · `nextjs-core-05-card-08`
>
> Відкинь групи й слоти: перехоплювальний маршрут — `/feed`. `(..)` піднімається на один сегмент — у корінь — і додає `photos/[id]`. Результат — `/photos/[id]`, і перехоплення діє для переходів з `/feed` і глибше.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🪝 Intercepting routes: маркери (.), (..), (..)(..), (...)|Розділ: маркери]] · [Next.js: Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes)

> [!question]- Навіщо модалці і [...catchAll]/page.tsx, і page.tsx у слоті?
> *часто · код* · `nextjs-core-05-card-09`
>
> Щоб soft navigation на іншу сторінку закривала модалку: слоту потрібен збіг, що рендерить `null`. Catch-all покриває URL з хоча б одним сегментом, але не `/`, тому для кореня окремий `page.tsx`.
>
> ```text
> app/@modal/page.tsx               → null
> app/@modal/[...catchAll]/page.tsx → null
> ```
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🧹 Закрити модалку: router.back(), Link і «застряглий» слот|Розділ: закриття]] · [Next.js: Parallel Routes → Closing the modal](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#closing-the-modal)

### 🔴 Senior

> [!question]- Чому умовний слот за роллю не є перевіркою доступу?
> *іноді · безпека* · `nextjs-core-05-card-10`
>
> Next.js рендерить на сервері всі слоти, незалежно від того, який поверне layout. Запити прихованого слота виконуються, а його вивід потрапляє в RSC payload — у вихідний код сторінки. Доступ перевіряють у сторінці слота або в DAL.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🎭 Умовні слоти: показати слот за роллю|Розділ: умовні слоти]] · [Next.js: Conditional Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#conditional-routes)

> [!question]- Як Next.js вирішує, чи перехоплювати навігацію?
> *іноді · теорія* · `nextjs-core-05-card-11`
>
> Для кожного intercepting route на збірці генерується rewrite: джерело — перехоплений маршрут, умова — заголовок `Next-Url` (URL, з якого навігація) збігається з перехоплювальним маршрутом чи глибшим. Клієнтський роутер шле `Next-Url` лише при soft navigation, тож reload не перехоплюється ніколи.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🪝 Intercepting routes: маркери (.), (..), (..)(..), (...)|Розділ: маркери]] · [Next.js: Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes)

> [!question]- Що змінилося з default.js у Next.js 16 і що насправді робить 16.3.8?
> *іноді · теорія* · `nextjs-core-05-card-12`
>
> Гайд з оновлення до 16 каже, що слоти без `default.js` ламають збірку. На 16.3.8 збірка проходить, а Next.js підставляє вбудований default з `notFound()` — та сама 404 на reload, що й раніше. Тож попередження від збірки немає, і фолбеки треба додавати й перевіряти самому.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🧷 default.tsx: фолбек слота|Розділ: default.tsx]] · [Next.js: Upgrading to v16](https://nextjs.org/docs/app/guides/upgrading/version-16#parallel-routes-defaultjs-requirement)

> [!question]- Чому після закриття модалки її діалог досі знаходиться в DOM?
> *іноді · практика* · `nextjs-core-05-card-13`
>
> З `cacheComponents: true` Next.js не розмонтовує попередні сегменти, а ховає їх через React `<Activity>` (`display: none`, до трьох маршрутів). Для користувача модалки немає, а `querySelector('[role=dialog]')` її знаходить. У тестах перевіряють видимість (`toBeHidden()`), а не відсутність.
>
> 📚 [[Next.js - 05. Parallel і intercepting routes#🧹 Закрити модалку: router.back(), Link і «застряглий» слот|Розділ: закриття]] · [Next.js: Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)

## 🛠️ Практика

> [!task] Що покаже слот
> level: middle · difficulty: medium · id: nextjs-core-05-task-01 · tags: parallel-routes, default-js, navigation
>
> Напиши `renderSlot(slot, url, navigation, active)` — модель того, що Next.js рендерить у слоті:
>
> - `slot.pages` — шаблони сторінок слота відносно `app/` (без самого `@слота`): `'/'`, `'/dashboard'`, `'/photos/[id]'`, `'/[...catchAll]'`; `slot.hasDefault` — чи є `default.tsx`;
> - `navigation` — `'soft'` або `'hard'`; `active` — що слот показував до переходу (шаблон, `'default'` або `null`);
> - якщо шаблон збігається з `url` — поверни його. `[id]` — рівно один будь-який сегмент; `[...x]` — **один або більше** сегментів (корінь `/` він не матчить). Якщо збігаються кілька, catch-all — найслабший;
> - без збігу: при soft navigation з відомим `active` — поверни `active`; інакше `'default'`, якщо він є, або `'404'`.
>
> ```js starter
> /**
>  * @param {{ pages: string[], hasDefault: boolean }} slot
>  * @param {string} url
>  * @param {'soft' | 'hard'} navigation
>  * @param {string | null} active
>  * @returns {string}
>  */
> function renderSlot(slot, url, navigation, active) {
>   // твій код
> }
> ```
>
> ```js tests
> const analytics = { pages: ['/dashboard'], hasDefault: true }
> const modal = { pages: ['/', '/photos/[id]', '/[...catchAll]'], hasDefault: true }
>
> test('сторінка, що збігається з URL, рендериться за будь-якої навігації', () => {
>   const team = { pages: ['/dashboard', '/dashboard/settings'], hasDefault: false }
>   expect(renderSlot(team, '/dashboard/settings', 'hard', null)).toBe('/dashboard/settings')
>   expect(renderSlot(team, '/dashboard', 'soft', '/dashboard/settings')).toBe('/dashboard')
> })
>
> test('soft navigation без збігу зберігає активну сторінку слота', () => {
>   expect(renderSlot(analytics, '/dashboard/settings', 'soft', '/dashboard')).toBe('/dashboard')
> })
>
> test('hard navigation без збігу показує default', () => {
>   expect(renderSlot(analytics, '/dashboard/settings', 'hard', '/dashboard')).toBe('default')
> })
>
> test('без default hard navigation дає 404', () => {
>   expect(renderSlot({ pages: ['/dashboard'], hasDefault: false }, '/dashboard/settings', 'hard', null)).toBe('404')
> })
>
> test('динамічний сегмент перемагає catch-all, а catch-all ловить решту', () => {
>   expect(renderSlot(modal, '/photos/7', 'soft', '/[...catchAll]')).toBe('/photos/[id]')
>   expect(renderSlot(modal, '/about/team', 'soft', '/photos/[id]')).toBe('/[...catchAll]')
> })
>
> test('catch-all не матчить корінь: без page.tsx модалка лишається на "/"', () => {
>   const noRoot = { pages: ['/photos/[id]', '/[...catchAll]'], hasDefault: true }
>   expect(renderSlot(noRoot, '/', 'soft', '/photos/[id]')).toBe('/photos/[id]')
>   expect(renderSlot(modal, '/', 'soft', '/photos/[id]')).toBe('/')
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбий і URL, і шаблон на сегменти через `split('/').filter(Boolean)`. Корінь `/` дасть порожній масив — зручно для перевірки «хоча б один сегмент».
>
> > [!hint]- Підказка 2
> > Порядок рішень: спершу збіг, потім `soft && active !== null`, потім `default` або `404`. `default.tsx` при soft navigation не використовується, якщо слот уже щось показував.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function renderSlot(slot, url, navigation, active) {
> >   const parts = url.split('/').filter(Boolean)
> >
> >   const matches = (pattern) => {
> >     const segs = pattern.split('/').filter(Boolean)
> >     for (let i = 0; i < segs.length; i++) {
> >       if (segs[i].startsWith('[...')) return parts.length > i // ≥ 1 сегмент
> >       if (i >= parts.length) return false
> >       if (!segs[i].startsWith('[') && segs[i] !== parts[i]) return false
> >     }
> >     return segs.length === parts.length
> >   }
> >
> >   const hit = slot.pages.filter(matches).sort((a, b) => a.includes('[...') - b.includes('[...'))[0]
> >   if (hit) return hit
> >   if (navigation === 'soft' && active !== null) return active
> >   return slot.hasDefault ? 'default' : '404'
> > }
> > ```
> >
> > Модель повторює дві перевірені поведінки 16.3.8: soft navigation не чіпає слот без збігу, а hard navigation бере `default.tsx` або дає 404. Останній тест — та сама «застрягла» модалка: catch-all не матчить `/`, тож без `@modal/page.tsx` слот зберігає перехоплене фото.

> [!task] Який маршрут перехоплює папка
> level: middle · difficulty: medium · id: nextjs-core-05-task-02 · tags: intercepting-routes, segments
>
> Напиши `resolveInterception(folder)`. На вході — шлях папки сторінки від `app/`, наприклад `'/(market)/feed/@modal/(..)photos/[id]'`. Поверни `{ from, to }`: `from` — перехоплювальний маршрут (звідки працює перехоплення), `to` — маршрут, який перехоплюють. Правила, як у Next.js:
>
> - маркери: `(.)`, `(..)`, `(..)(..)`, `(...)`; береться перший сегмент, що з маркера **починається**;
> - `from` — сегменти до маркера **без** груп `(name)` і слотів `@name`, як URL (`'/'` для кореня);
> - `(.)` — `from` + решта, `(..)` — на сегмент вище, `(..)(..)` — на два, `(...)` — від кореня;
> - підйом вище кореня — `throw` (як помилка збірки Next.js); папка без маркера — `null`.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type Interception = { from: string; to: string }
>
> function resolveInterception(folder: string): Interception | null {
>   // ❌ рахує папки файлової системи, а не сегменти маршруту
>   const segments = folder.split('/').filter(Boolean)
>   const at = segments.findIndex((s) => s.startsWith('(..)'))
>   if (at === -1) return null
>   const base = segments.slice(0, at)
>   const rest = [segments[at].slice(4), ...segments.slice(at + 1)]
>   return { from: '/' + base.join('/'), to: '/' + [...base.slice(0, -1), ...rest].join('/') }
> }
> ```
>
> ```ts tests
> test('(.) на корені: @modal не сегмент, модалка перехоплює /photos/[id]', () => {
>   expect(resolveInterception('/@modal/(.)photos/[id]')).toEqual({ from: '/', to: '/photos/[id]' })
> })
>
> test('(..) рахує сегменти маршруту: група і слот пропускаються', () => {
>   expect(resolveInterception('/(market)/feed/@modal/(..)photos/[id]')).toEqual({ from: '/feed', to: '/photos/[id]' })
> })
>
> test('(.) усередині сегмента додає маршрут до нього', () => {
>   expect(resolveInterception('/shop/[category]/(.)quick-view/[sku]')).toEqual({
>     from: '/shop/[category]',
>     to: '/shop/[category]/quick-view/[sku]',
>   })
> })
>
> test('(..)(..) піднімається на два сегменти, (...) — завжди від кореня', () => {
>   expect(resolveInterception('/shop/[category]/[sku]/(..)(..)cart')).toEqual({ from: '/shop/[category]/[sku]', to: '/shop/cart' })
>   expect(resolveInterception('/shop/[category]/@panel/(...)login')).toEqual({ from: '/shop/[category]', to: '/login' })
> })
>
> test('(..) на корені й (..)(..) на першому рівні — помилка', () => {
>   expect(() => resolveInterception('/@modal/(..)photos/[id]')).toThrow()
>   expect(() => resolveInterception('/feed/@modal/(..)(..)photos/[id]')).toThrow()
> })
>
> test('звичайна папка без маркера — не intercepting route', () => {
>   expect(resolveInterception('/(market)/feed/@modal/default')).toBeNull()
> })
> ```
>
> > [!hint]- Підказка 1
> > Група — сегмент, що починається з `(` і закінчується `)`. Маркер теж починається з `(`, але після нього йде назва (`(..)photos`), тож окремий сегмент-група маркером не буде.
>
> > [!hint]- Підказка 2
> > Перевіряй маркери в порядку `(..)(..)`, `(.)`, `(..)`, `(...)`: `'(..)(..)cart'` починається і з `(..)`, тож довший маркер має йти першим.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Interception = { from: string; to: string }
> >
> > const MARKERS = ['(..)(..)', '(.)', '(..)', '(...)']
> >
> > function resolveInterception(folder: string): Interception | null {
> >   const segments = folder.split('/').filter(Boolean)
> >   const at = segments.findIndex((s) => MARKERS.some((m) => s.startsWith(m)))
> >   if (at === -1) return null
> >
> >   const marker = MARKERS.find((m) => segments[at].startsWith(m))!
> >   // групи (name) і слоти @name — не сегменти маршруту
> >   const base = segments.slice(0, at).filter((s) => !s.startsWith('@') && !(s.startsWith('(') && s.endsWith(')')))
> >   const rest = [segments[at].slice(marker.length), ...segments.slice(at + 1)]
> >
> >   let target: string[]
> >   if (marker === '(.)') target = base
> >   else if (marker === '(...)') target = []
> >   else {
> >     const up = marker === '(..)' ? 1 : 2
> >     if (base.length < up) throw new Error(`${marker}: вище кореня піднятися не можна`)
> >     target = base.slice(0, base.length - up)
> >   }
> >
> >   return { from: '/' + base.join('/'), to: '/' + [...target, ...rest].join('/') }
> > }
> > ```
> >
> > Так само працює `extractInterceptionRouteInformation` у Next.js: шлях до маркера нормалізується (групи, слоти й `page` відкидаються), а маркер відрізає з нього сегменти. Тому в тексті помилки збірки шлях уже без `@modal` і груп — `/feed/(..)(..)photos/[id]`.

> [!task] Стан модалки в історії
> level: middle · difficulty: medium · id: nextjs-core-05-task-03 · tags: intercepting-routes, history, reducer
>
> Змоделюй, що бачить користувач модалки з URL при навігації. Стан — історія браузера: `entries` (записи) і `index` (поточний). Запис — `{ url, page, modal }`: `page` — що в `children`, `modal` — URL перехопленої сторінки в слоті або `null`. Напиши чистий `navReducer(state, event)`:
>
> - `push` з `intercepted: true` — новий запис: `page` лишається від поточного запису, `modal` = `url`; з `intercepted: false` — повна сторінка, `modal: null`;
> - `push` обрізає записи після `index` (як браузер після «назад»);
> - `back` / `forward` — зсув `index`, якщо є куди; інакше стан без змін;
> - `refresh` — hard navigation: поточний запис стає повною сторінкою свого `url` без модалки;
> - не мутуй вхідний `state`.
>
> ```ts starter
> type Entry = { url: string; page: string; modal: string | null }
> type HistoryState = { entries: Entry[]; index: number }
> type NavEvent =
>   | { type: 'push'; url: string; intercepted: boolean }
>   | { type: 'back' }
>   | { type: 'forward' }
>   | { type: 'refresh' }
>
> function navReducer(state: HistoryState, event: NavEvent): HistoryState {
>   // твій код
>   return state
> }
> ```
>
> ```ts tests
> const start: HistoryState = { entries: [{ url: '/photos', page: '/photos', modal: null }], index: 0 }
> const view = (s: HistoryState) => s.entries[s.index]
> const open = (s: HistoryState, url: string) => navReducer(s, { type: 'push', url, intercepted: true })
>
> test('перехоплений push відкриває модалку поверх поточної сторінки', () => {
>   expect(view(open(start, '/photos/2'))).toEqual({ url: '/photos/2', page: '/photos', modal: '/photos/2' })
> })
>
> test('звичайний push — повна сторінка без модалки', () => {
>   const s = navReducer(start, { type: 'push', url: '/about', intercepted: false })
>   expect(view(s)).toEqual({ url: '/about', page: '/about', modal: null })
> })
>
> test('back закриває модалку, forward відкриває знову', () => {
>   const back = navReducer(open(start, '/photos/2'), { type: 'back' })
>   expect(view(back)).toEqual({ url: '/photos', page: '/photos', modal: null })
>   expect(view(navReducer(back, { type: 'forward' })).modal).toBe('/photos/2')
> })
>
> test('refresh на URL модалки показує повну сторінку', () => {
>   const s = navReducer(open(start, '/photos/2'), { type: 'refresh' })
>   expect(view(s)).toEqual({ url: '/photos/2', page: '/photos/2', modal: null })
>   expect(view(navReducer(s, { type: 'back' }))).toEqual({ url: '/photos', page: '/photos', modal: null })
> })
>
> test('push після back обрізає forward-гілку і не мутує попередній state', () => {
>   const opened = open(start, '/photos/2')
>   const back = navReducer(opened, { type: 'back' })
>   const s = open(back, '/photos/3')
>   expect(s.entries.map((e) => e.url)).toEqual(['/photos', '/photos/3'])
>   expect(opened.entries).toHaveLength(2)
>   expect(start.entries).toHaveLength(1)
> })
>
> test('back на першому записі й forward на останньому нічого не змінюють', () => {
>   expect(navReducer(start, { type: 'back' })).toEqual(start)
>   expect(navReducer(start, { type: 'forward' })).toEqual(start)
> })
> ```
>
> > [!hint]- Підказка 1
> > `switch (event.type)` по discriminated union: у гілці `'push'` TypeScript знає про `event.url` і `event.intercepted`.
>
> > [!hint]- Підказка 2
> > Для `push` спершу `state.entries.slice(0, state.index + 1)`, потім додай новий запис. Для `refresh` — `map`, що замінює лише запис з `index`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function navReducer(state: HistoryState, event: NavEvent): HistoryState {
> >   const current = state.entries[state.index]
> >   switch (event.type) {
> >     case 'push': {
> >       const entry: Entry = event.intercepted
> >         ? { url: event.url, page: current.page, modal: event.url }
> >         : { url: event.url, page: event.url, modal: null }
> >       const entries = [...state.entries.slice(0, state.index + 1), entry]
> >       return { entries, index: entries.length - 1 }
> >     }
> >     case 'back':
> >       return state.index > 0 ? { ...state, index: state.index - 1 } : state
> >     case 'forward':
> >       return state.index < state.entries.length - 1 ? { ...state, index: state.index + 1 } : state
> >     case 'refresh': {
> >       const entries = state.entries.map((e, i) => (i === state.index ? { url: e.url, page: e.url, modal: null } : e))
> >       return { entries, index: state.index }
> >     }
> >   }
> > }
> > ```
> >
> > Кожен тест — дія, перевірена в браузері на продакшн-збірці: клік відкриває модалку над галереєю, «назад» закриває, «вперед» відкриває знову, F5 показує повну сторінку, а «назад» після F5 веде в галерею без модалки. Помилка «refresh нічого не змінює» — саме те, чого чекає більшість, поки не спробує.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes) — слоти, soft і hard navigation, умовні слоти, вкладки, модалки.
- 🟢 [Next.js — Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes) — маркери і «сегменти, а не файлова система».
- 🟡 [Next.js — default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default) — фолбек слота і `params`.
- 🟡 [Next.js — Upgrading to Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16#parallel-routes-defaultjs-requirement) — заявлена вимога `default.js` (див. розбіжність у темі).
- 🟡 [Next.js — Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating) — клієнтські переходи, на яких тримається вся поведінка слотів.
- 🟡 [Next.js — useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router) — `router.back()`, `router.push()`, `bfcacheId`.
- 🟡 [Next.js — useSelectedLayoutSegment](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment) — активний сегмент слота через `parallelRouteKey`.
- 🔴 [Next.js — Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state) — Activity: чому закрита модалка лишається в DOM.
- 🔴 [Next.js — Data Access Layer](https://nextjs.org/docs/app/guides/authentication#creating-a-data-access-layer-dal) — де перевіряти доступ для умовних слотів.
- 🛠️ [vercel-labs/nextgram](https://github.com/vercel-labs/nextgram) — еталонна галерея з модалками на parallel і intercepting routes.

> [!important] Підсумок
> - Слот `@name` — місце в layout, а не сегмент URL. Layout отримує його як prop, `children` — неявний слот.
> - Слот без збігу при soft navigation зберігає вміст, при hard navigation рендерить `default.tsx`, а без нього вся сторінка стає 404. На 16.3.8 збірка про відсутній `default.tsx` не попереджає.
> - Кожен слот має власні `loading` і `error`. Умовний слот — лише UI: прихований слот теж рендериться і потрапляє в RSC payload.
> - `(.)`, `(..)`, `(..)(..)`, `(...)` рахують сегменти маршруту без груп і слотів. Перехоплення — лише при soft navigation і лише з перехоплювального сегмента (`Next-Url`).
> - Модалка з URL: повна сторінка + `@modal/(.)маршрут` + `default.tsx`, `page.tsx` і `[...catchAll]` з `null`; закриття — `router.back()`.

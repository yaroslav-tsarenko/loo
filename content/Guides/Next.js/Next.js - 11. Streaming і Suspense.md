---
title: Streaming і Suspense
id: nextjs-core-11
slug: 11-streaming-suspense
order: 11
level: middle
skill: rendering
icon: px:hourglass
tags: [nextjs, streaming, suspense, loading, use, http-status, seo, selective-hydration]
prerequisites:
  - "[[Next.js - 09. Як рендериться маршрут, RSC payload і hydration]]"
  - "[[Next.js - 10. Статичний і динамічний рендеринг]]"
estimatedMinutes: 55
nextVersion: 16.3.8
---

# Streaming і Suspense

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, навіщо streaming: чому без нього TTFB дорівнює найповільнішому запиту і що змінюється для FCP і LCP;
> - прочитати справжній HTML-стрім: `<template id="B:0">`, `<div hidden id="S:0">`, `$RC`, і поміряти чанки скриптом;
> - пояснити `loading.tsx` як автоматичну межу `<Suspense>` сегмента і що саме вона не обгортає;
> - спроєктувати межі `<Suspense>`: гранулярність, skeleton без зсуву макета, вкладені межі й порядок появи, сусідні межі й throttle показу;
> - передати Promise із Server Component у Client Component і прочитати його через `use()`;
> - передбачити статус-код: чому `notFound()` під Suspense дає `200` + `noindex`, а `redirect()` — мета-тег замість `307`;
> - пояснити, що отримують боти (`htmlLimitedBots`) і що ламає стрімінг між сервером і браузером.

## 🤔 Передбач

> [!quiz] Що бачить користувач через 1,5 секунди?
> level: middle · type: output · id: nextjs-core-11-quiz-01
>
> Сторінка з трьома незалежними частинами. Дані приходять за 200 мс, 1 с і 3 с.
>
> ```tsx
> // app/feed/page.tsx
> export default function FeedPage() {
>   return (
>     <main>
>       <h1>Огляд</h1>
>       <Suspense fallback={<p>Виторг…</p>}>
>         <Revenue /> {/* 200 мс */}
>       </Suspense>
>       <Suspense fallback={<p>Замовлення…</p>}>
>         <Orders /> {/* 1000 мс */}
>       </Suspense>
>       <Suspense fallback={<p>Рекомендації…</p>}>
>         <Recommendations /> {/* 3000 мс */}
>       </Suspense>
>     </main>
>   )
> }
> ```
>
> - [x] «Огляд», виторг і замовлення; на місці рекомендацій — «Рекомендації…»
> - [ ] Білий екран: сервер віддасть сторінку, коли все буде готове, через 3 с
> - [ ] «Огляд» і три fallback-и: частини зʼявляться разом, коли прийде остання
> - [ ] «Огляд» і виторг; замовлення чекають, бо стоять після виторгу в коді
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Кожна межа `<Suspense>` — окрема точка стрімінгу. Сервер одразу віддає shell із трьома fallback-ами, а далі досилає готові частини в тій самій відповіді, у порядку готовності, а не в порядку коду. На 16.3.8 браузер о +600 мс показує виторг, о +1500 мс — ще й замовлення, о +3500 мс — усе.

## 🧒 Простими словами

Уяви ресторан, де ти замовив салат, суп і стейк. Поганий ресторан тримає все на кухні, доки не дожариться стейк, і лише тоді виносить три тарілки разом: ти сидиш 30 хвилин перед порожнім столом. Хороший ресторан одразу ставить хліб і прибори (static shell), картку «суп готується» на місце супу (fallback), а страви виносить, щойно кожна готова. Офіціант той самий (одна HTTP-відповідь). Але є правило: розписку «все гаразд, замовлення прийнято» (статус-код) офіціант віддає разом із хлібом. Якщо через пів години виявиться, що стейка немає, переписати розписку вже не можна — можна лише покласти на стіл записку «вибачте» (`noindex`).

## 🔬 Як це працює насправді

### 🧭 Навіщо streaming: TTFB, FCP і найповільніший запит

Класичний server-side rendering будує **весь** HTML і лише тоді відправляє перший байт. Якщо рекомендації рахуються 3 секунди, TTFB (time to first byte — час до першого байта відповіді) буде понад 3 секунди, а FCP (first contentful paint — перший намальований вміст) ще пізніше, хоча 90% сторінки готові за 30 мс.

**Streaming** ділить відповідь на частини. HTTP/1.1 робить це через chunked transfer encoding (HTTP/2 і HTTP/3 — через фрейми потоку): заголовки й перший шматок HTML ідуть одразу, решта — тим самим зʼєднанням, коли готова. React рендерить HTML шматками, вирівняними по межах `<Suspense>`, а Next.js вмикає це в App Router без жодного налаштування. Що отримуємо:

- **TTFB** дорівнює часу рендера layouts і fallback-ів, а не найповільнішого запиту.
- **FCP** відвʼязаний від даних: shell малюється одразу.
- **Ранній старт ресурсів**: `<link>` і `<script>` уже в першому чанку, тож CSS, JS і шрифти вантажаться, поки сервер думає.
- **Selective hydration**: кожна межа — окрема одиниця hydration.

Ось різниця в цифрах (Next.js 16.3.8, `cacheComponents: true`, скрипт із розділу [[#📏 Міряємо чанки скриптом]]). Перший маршрут — блокуючий: сторінка чекає 1,5 с без жодної межі. Другий — той самий час під `loading.tsx`:

| Маршрут | Перший байт тіла HTML | Сторінка повністю |
|---|---|---|
| блокуючий (`instant = false`, без меж) | +1536 мс | +1539 мс |
| `loading.tsx` над тією самою сторінкою | +39 мс (shell + fallback) | +1540 мс |

Дані не стали швидшими. Змінилось те, **коли користувач щось побачив**: через 39 мс замість півтори секунди.

> [!note] Чому сторінкам з даними потрібен loading.tsx / <Suspense>
> Приклади курсу зібрані з `cacheComponents: true`. Повільні дані тут імітує `slow(ms, value)`: вона викликає `await io()` з `next/cache` (маркер «далі I/O», як радить [[Next.js - 10. Статичний і динамічний рендеринг|тема 10]]) і чекає `setTimeout`. Під Cache Components такий доступ поза межею `<Suspense>` зупиняє `next build` з `Next.js encountered uncached or runtime data during prerendering`: дані або кешують (`'use cache'`, теми 14–16 основного посібника), або обгортають у `<Suspense>`. Як Next.js будує з цього static shell — у [[Next.js - 12. Partial Prerendering і Cache Components|темі 12]].

```ts
// app/lib/data.ts — імітація повільних джерел даних
import 'server-only'
import { io } from 'next/cache'

export async function slow<T>(ms: number, value: T): Promise<T> {
  await io() // далі I/O: під час prerender тут зупиняємось, у запиті — одразу далі
  await new Promise((resolve) => setTimeout(resolve, ms))
  return value
}
```

### 🌊 Що летить по дроту

Найкращий спосіб зрозуміти стрімінг — подивитися на сирий HTML. Збери сторінку з 🤔 Передбач, запусти `next start` і відкрий її через `curl -N` (`-N` вимикає буферизацію виводу curl, тож рядки зʼявляються в терміналі, щойно приходять):

```bash
curl -N http://localhost:3000/feed
```

Термінал друкує документ у кілька прийомів: спершу майже все, потім пауза, ще шматок, пауза, останній шматок і `</body></html>`. Ось що всередині — спрощено: прибрано `<head>`, скрипти чанків і payload `self.__next_f.push` (його формат розібрано в [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration|темі 09]]).

**Чанк 0 — static shell** (≈1,3 КБ, +33 мс):

```html
<header>Магазин</header>
<main><h1>Огляд</h1>
  <!--$?--><template id="B:0"></template><p>Виторг…</p><!--/$-->
  <!--$?--><template id="B:1"></template><p>Замовлення…</p><!--/$-->
  <!--$?--><template id="B:2"></template><p>Рекомендації…</p><!--/$-->
</main>
```

Кожна межа стала парою коментарів `<!--$?-->…<!--/$-->` («ще чекаємо») з порожнім `<template id="B:n">` — **плейсхолдером** межі — і fallback-ом.

**Чанк 1** (≈4,8 КБ, +35 мс) — RSC payload shell-а для hydration.

**Чанк 3 — перша готова межа** (+236 мс):

```html
<div hidden id="S:0"><section>Виторг: 125000 ₴</section></div>
<script>$RB=[];$RV=function(a){…};$RC=function(a,b){…};$RC("B:0","S:0")</script>
```

Готовий вміст приходить у **прихований** `<div hidden id="S:0">` у кінці документа. Inline-скрипт один раз визначає функції заміни (`$RC` — «complete boundary», `$RV` — показ, `$RB` — черга), а `$RC("B:0","S:0")` ставить вміст S:0 на місце межі B:0 — **одразу**, без бандла React і hydration.

**Чанки 4 і 5** (+1039 і +3036 мс) — ще два `div hidden` з однорядковими `$RC("B:1","S:1")` і `$RC("B:2","S:2")`. Це і є **out-of-order streaming**: частини йдуть у порядку готовності, а скрипт ставить кожну на своє місце.

> [!diagram] Стрім сторінки /feed у часі (виміряно на 16.3.8)
> ```yaml
> layout: timeline
> nodes:
>   - { id: hdr, at: "+33 мс", label: "заголовки", text: "HTTP 200 OK", note: "статус зафіксовано назавжди", tone: gray, icon: "px:monitor" }
>   - { id: shell, at: "+33 мс", label: "чанк 0", code: "<!--$?--><template id=\"B:0\">\n<p>Виторг…</p><!--/$-->", note: "shell і три fallback-и", tone: yellow, icon: "px:hourglass" }
>   - { id: payload, at: "+35 мс", label: "чанк 1", code: "self.__next_f.push(…)", note: "payload для hydration", tone: violet }
>   - { id: s0, at: "+236 мс", label: "чанк 3", code: "<div hidden id=\"S:0\">…</div>\n$RC(\"B:0\",\"S:0\")", note: "виторг на місці fallback", tone: green }
>   - { id: s1, at: "+1039 мс", label: "чанк 4", code: "$RC(\"B:1\",\"S:1\")", note: "замовлення", tone: green }
>   - { id: s2, at: "+3036 мс", label: "чанк 5", code: "$RC(\"B:2\",\"S:2\")\n</body></html>", note: "рекомендації, кінець відповіді", tone: mint, icon: "px:check" }
> steps:
>   - { show: hdr, note: "Сервер одразу шле заголовки. Статус 200 тепер не змінити — запамʼятай це для розділу про HTTP-контракт." }
>   - { show: shell, note: "Перший чанк — static shell: layout, заголовок і fallback кожної межі з плейсхолдером template B:n. Браузер одразу малює." }
>   - { show: payload, note: "Слідом іде RSC payload shell-а. Браузер уже вантажить JS-чанки, бо script-теги були в першому чанку." }
>   - { show: s0, note: "Виторг готовий: React досилає прихований div S:0 і скрипт $RC, який переносить його на місце B:0. Hydration для цього не потрібна." }
>   - { show: s1, note: "Замовлення — той самий механізм. Функції вже визначені, тож скрипт — один виклик." }
>   - { show: s2, note: "Остання межа й кінець документа. Зʼєднання закривається лише тепер, хоча користувач бачив сторінку з 33-ї мілісекунди." }
> ```
> Одна відповідь, одне зʼєднання. Сервер не повертається назад: він лише дописує в кінець документа.

> [!quiz] Перевір себе: склади, що приходить по дроту
> level: middle · type: order · id: nextjs-core-11-quiz-02
>
> ```order
> Заголовки відповіді зі статусом 200
> Shell: layout і fallback-и з <template id="B:0">
> RSC payload shell-а в self.__next_f.push
> <div hidden id="S:0"> з готовим вмістом межі
> Скрипт $RC("B:0","S:0") переносить вміст на місце fallback-а
> Сервер повертає 404, бо дані не знайдено ✗
> ```
>
> **Пояснення:** заголовки йдуть першими — без них не почати тіло. Shell із плейсхолдерами — у першому чанку, payload для hydration — одразу за ним. Готова межа приходить прихованою й переноситься скриптом. Статус після цього змінити неможливо: він уже відправлений у найпершому рядку відповіді.

### 📏 Міряємо чанки скриптом

`curl -N` показує вміст, але не час. Документація радить маленький скрипт на `fetch`: він читає тіло як потік і друкує мітку часу кожного чанка. `Accept-Encoding: identity` вимикає стиснення — інакше gzip може склеїти чанки:

```js
// stream-observer.mjs — коли приходять чанки HTML
const url = process.argv[2] ?? 'http://localhost:3000/feed'
const ua = process.argv[3]
const start = performance.now()
const res = await fetch(url, {
  headers: { 'Accept-Encoding': 'identity', ...(ua ? { 'User-Agent': ua } : {}) },
})
const ms = () => Math.round(performance.now() - start)
console.log(`status ${res.status} · headers +${ms()}ms`)
const reader = res.body.getReader()
const decoder = new TextDecoder()
let i = 0
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const text = decoder.decode(value)
  const marks = text.match(/id="[BS]:\d+"|\$RC|\$RB|\$RV|Виторг: \d+|Замовлень: \d+|Радимо|noindex|__next_f/g) ?? []
  console.log(`chunk ${i++} +${ms()}ms ${value.length}B ${[...new Set(marks)].join(' ')}`)
}
console.log(`done +${ms()}ms`)
```

`node stream-observer.mjs http://localhost:3000/feed` на прогрітому сервері (перший запит після старту повільніший на ~100 мс — холодний старт):

```text
status 200 · headers +33ms
chunk 0 +33ms 1267B id="B:0" id="B:1" id="B:2"
chunk 1 +35ms 4773B __next_f
chunk 2 +235ms 123B __next_f
chunk 3 +236ms 1021B id="S:0" $RB $RV $RC
chunk 4 +1039ms 225B id="S:1" $RC __next_f
chunk 5 +3036ms 259B id="S:2" Радимо $RC __next_f
done +3036ms
```

**TTFB — 33 мс**, а **кожна межа приходить, щойно резолвиться її проміс** (200, 1000, 3000 мс). Розбиття на `chunk` залежить від буферів TCP і Node — дивись на мітки часу, а не на номери.

### ⏳ loading.tsx — автоматична межа сегмента

Найпростіший спосіб увімкнути стрімінг — файл `loading.tsx` у папці сегмента. Next.js сам обгортає сторінку сегмента в `<Suspense>`, а твій компонент стає fallback-ом:

```tsx
// app/dashboard/loading.tsx — fallback для всього сегмента
export default function Loading() {
  return <p>Завантажуємо дашборд…</p>
}
```

```tsx
// app/dashboard/page.tsx
import { slow } from '../lib/data'

export default async function DashboardPage() {
  const orders = await slow(1500, 42)
  return <h1>Замовлень сьогодні: {orders}</h1>
}
```

Сторінка чекає 1,5 с на верхньому рівні, але `next build` проходить: межу поставив фреймворк. Shell із «Завантажуємо дашборд…» — о +39 мс, вміст — о +1540 мс.

**Що саме обгортає `loading.tsx`.** В ієрархії файлів сегмента (її розбирали в [[Next.js - 01. App Router, сегменти і спеціальні файли|темі 01]]) він стоїть **під** `layout.tsx`, `template.tsx` і `error.tsx` свого сегмента і обгортає `not-found.tsx`, `page.tsx` і вкладені layouts. Спрощено:

```tsx
<Layout>
  <Template>
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>
```

Звідси три наслідки:

1. **Layout того самого сегмента не накритий.** Якщо `app/dashboard/layout.tsx` чекає `cookies()`, `loading.tsx` поруч не допоможе; під Cache Components це помилка збірки — загорни доступ у власний `<Suspense>` або перенеси в сторінку.
2. **`error.tsx` того ж сегмента стоїть вище** і ловить помилки сторінки, що вже стрімиться.
3. **Навігація.** Fallback потрапляє в prefetch: клік по `<Link>` миттєво показує skeleton, а спільні layouts лишаються інтерактивними ([[Next.js - 04. Навігація під капотом|тема 04]]).

`loading.tsx` добрий, коли **до даних сторінці нічого показати**. Інакше він ховає за skeleton-ом і заголовок, і фільтри. Документація радить явні `<Suspense>` біля доступу до даних: prerenderer іде вгору до найближчої межі, і якщо це `loading.tsx` кореня, усе нижче стає одним великим skeleton-ом.

> [!quiz] Перевір себе: що не покриває loading.tsx?
> level: middle · id: nextjs-core-11-quiz-03
>
> У папці `app/dashboard/` лежать `layout.tsx`, `loading.tsx`, `error.tsx` і `page.tsx`. Layout читає `await cookies()`, щоб показати імʼя користувача. Що правда під `cacheComponents: true`?
>
> - [ ] `loading.tsx` покаже skeleton, поки layout читає cookies
> - [x] `loading.tsx` не обгортає layout свого сегмента: доступ до cookies треба загорнути у власний `<Suspense>` у layout, інакше збірка впаде
> - [ ] Нічого не зміниться: cookies читаються миттєво, тож межа не потрібна
> - [ ] Треба перенести `loading.tsx` у `app/dashboard/(page)/`, тоді він накриє layout
>
> **Пояснення:** `loading.tsx` вкладений **у** layout свого сегмента й обгортає лише сторінку та нижчі рівні. `cookies()` — дані запиту, тож під Cache Components доступ до них поза `<Suspense>` зупиняє збірку. Route group нічого не змінить в ієрархії файлів одного сегмента.

### 🧱 Ручні межі: сусідні й вкладені

`<Suspense>` з `react` дає точний контроль: межа навколо будь-якого компонента, свій fallback для кожної частини.

**Сусідні (sibling) межі стрімляться паралельно.** У сторінці з 🤔 Передбач три межі — три незалежні точки стрімінгу: повільна не тримає швидку, порядок у коді не має значення.

**Вкладені межі дають поступову деталізацію**: спершу загальне, потім подробиці.

```tsx
// app/product/page.tsx — вкладені межі: деталі, потім відгуки
import { Suspense } from 'react'
import { slow } from '../lib/data'

async function Details() {
  const title = await slow(500, 'Кавомолка')
  return <h2>{title}</h2>
}

async function Reviews() {
  const reviews = await slow(300, ['Супер', 'Гучна'])
  return <ul>{reviews.map((r) => <li key={r}>{r}</li>)}</ul>
}

export default function ProductPage() {
  return (
    <main>
      <h1>Товар</h1>
      <Suspense fallback={<p>Деталі…</p>}>
        <Details />
        <Suspense fallback={<p>Відгуки…</p>}>
          <Reviews />
        </Suspense>
      </Suspense>
    </main>
  )
}
```

Правило: **вкладена межа не може зʼявитися раніше за батьківську** — її fallback живе всередині вмісту батька. Спершу «Деталі…», потім деталі з «Відгуки…», потім відгуки.

А якщо внутрішня межа готова **раніше**? Тут відгуки — 300 мс, деталі — 500. Стрім на 16.3.8:

```html
<!-- чанк 0, +52 мс: батьківська межа ще чекає, але її «каркас» уже тут -->
<!--$?--><template id="B:0"></template><p>Деталі…</p><!--/$-->
<div hidden id="S:0"><template id="P:1"></template>
  <!--$?--><template id="B:2"></template><p>Відгуки…</p><!--/$--></div>

<!-- +354 мс: відгуки готові, але замінюються всередині ще прихованого S:0 -->
<div hidden id="S:2"><ul><li>Супер</li><li>Гучна</li></ul></div>
<script>$RC("B:2","S:2")</script>

<!-- +554 мс: деталі заповнюють сегмент P:1, і лише тепер S:0 виходить на екран -->
<div hidden id="S:1"><h2>Кавомолка</h2></div>
<script>$RS("S:1","P:1")</script><script>$RC("B:0","S:0")</script>
```

`<template id="P:1">` — плейсхолдер **сегмента** (шматка HTML, що ще рендериться всередині межі), а `$RS` — «complete segment». Відгуки замінились у прихованому `div`, тож fallback «Відгуки…» користувач **не побачив жодного разу**.

> [!quiz] Перевір себе: чи побачить користувач «Відгуки…»?
> level: middle · type: output · id: nextjs-core-11-quiz-04
>
> Візьми `app/product/page.tsx` вище, але заміни затримки: `Details` — 1000 мс, `Reviews` — 1600 мс. Що бачить користувач у часі (без урахування мережі)?
>
> - [x] 0 мс: «Деталі…»; 1000 мс: назва товару і «Відгуки…»; 1600 мс: відгуки
> - [ ] 0 мс: «Деталі…» і «Відгуки…»; далі кожна частина — у свій час
> - [ ] 0 мс: «Деталі…»; 1600 мс: назва й відгуки разом — React чекає всю зовнішню межу
> - [ ] 0 мс: «Відгуки…»; 1000 мс: назва; 1600 мс: відгуки
>
> **Пояснення:** fallback вкладеної межі — частина вмісту батьківської, тож на старті його не видно. Зовнішня межа чекає лише свій регіон (`Details`), а не вкладену межу: о 1000 мс вона виходить разом із fallback-ом «Відгуки…». Якби відгуки були готові раніше за деталі, як у прикладі вище, внутрішнього fallback-а не було б зовсім.

**Throttle показу.** React 19.2 почав **батчити** показ серверних меж: `$RC` кладе межу в чергу `$RB`, а `$RV` показує чергу не раніше ніж через ~300 мс після попереднього показу (спрощено: є ще виняток біля позначки 2 с). Мета — менше окремих стрибків макета. Три сусідні межі на 400, 480 і 1200 мс у headless Chrome (`MutationObserver`, три запуски):

| Межа | Готова на сервері | Видно в браузері |
|---|---|---|
| A | ~400 мс | ~414 мс |
| B | ~480 мс | ~715 мс |
| C | ~1200 мс | ~1210 мс |

HTML межі B приходить о ~+500 мс, а на екрані вона зʼявилась через 300 мс після A. Межі, що приходять в одне «вікно», показуються **одним пакетом**, тож дробити межі з різницею 50–100 мс немає сенсу.

> [!quiz] Перевір себе: коли зʼявиться B?
> level: senior · type: output · id: nextjs-core-11-quiz-05
>
> Дві сусідні межі. A готова на сервері о 400 мс, B — о 480 мс. Shell намальований о ~0 мс. Мережа миттєва, React 19.2+. Коли **приблизно** B стане видимою?
>
> - [ ] ~480 мс — щойно прийде її HTML
> - [x] ~700 мс — через ~300 мс після показу A
> - [ ] ~880 мс — 400 + 480: межі показуються по черзі
> - [ ] ~400 мс — разом з A, бо React чекає всі сусідні межі
>
> **Пояснення:** A показується о ~400 мс. B приходить о 480 мс, але між показами React тримає щонайменше ~300 мс, тож B чекає до ~700 мс. У Chrome — ~715 мс. Це не баг: React 19.2 навмисно батчить показ серверних меж, щоб сторінка не «стрибала» кожні кілька мілісекунд.

### 📐 Як проєктувати межі

Межі — дизайн-рішення: **що користувач побачить першим і що зʼявиться разом**.

**1. Зсувай динамічний доступ вниз.** `await cookies()` чи `await params` на верху layout або сторінки робить динамічним усе нижче. Передай **проміс** у компонент, якому значення потрібне, і загорни його в `<Suspense>` — решта потрапить у shell. Як це рахує prerenderer — у [[Next.js - 10. Статичний і динамічний рендеринг|темі 10]] і [[Next.js - 12. Partial Prerendering і Cache Components|темі 12]].

**2. Межа — одиниця змісту.** Те, що читають разом (ціна й кнопка «Купити», графік і легенда), — **в одній межі**, навіть якщо дані з двох запитів. Окремі межі — для незалежних блоків: стрічка, сайдбар, рекомендації.

**3. Найважливіше — в shell.** LCP-елемент (largest contentful paint — найбільший видимий елемент) усередині `<Suspense>` не намалюється до заміни fallback-а; `preload` у `next/image` прискорить завантаження картинки, але не її появу.

**4. Skeleton того самого розміру.** Fallback іншої висоти дає стрибок макета — CLS (cumulative layout shift):

```tsx
// app/ui/card-skeleton.tsx — fallback того ж розміру, що й справжня картка
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div aria-busy="true" style={{ minHeight: 160, padding: 16, borderRadius: 12, background: '#f3f4f6' }}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} style={{ height: 16, marginBottom: 12, width: `${90 - i * 15}%`, background: '#e5e7eb' }} />
      ))}
    </div>
  )
}
```

```tsx
// app/shop/page.tsx — LCP-заголовок у shell, повільне — у межах із розміром
import { Suspense } from 'react'
import { slow } from '../lib/data'
import { Card } from '../ui/card'
import { CardSkeleton } from '../ui/card-skeleton'

async function Recommendations() {
  const items = await slow(1200, ['Кава', 'Чай', 'Какао'])
  return (
    <Card title="Радимо">
      <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </Card>
  )
}

export default function ShopPage() {
  return (
    <main>
      <h1>Кава зі свіжого обсмаження</h1>
      <Suspense fallback={<CardSkeleton />}>
        <Recommendations />
      </Suspense>
    </main>
  )
}
```

`Card` має той самий `minHeight: 160`, тож місце зарезервоване заздалегідь.

**5. Кожна межа має ціну.** Якщо межа є, React може нею скористатися: винести великий готовий вміст в окремий чанк або на повільному CPU показати fallback там, де ти не чекав. Межа «про всяк випадок» — ще один потенційний зсув.

**6. Стеж за водоспадами.** Якщо `Ads` чекає 200 мс і лише потім рендерить `Banner` ще на 500 мс, межа зʼявиться о 700 мс. Паралельність дають сусідні компоненти або `Promise.all`, а не `<Suspense>` (тема 14 основного посібника).

> [!diagram] Одна межа на сторінку проти гранулярних меж
> ```yaml
> layout: compare
> columns: { one: "Один loading.tsx", many: "Межі біля даних" }
> nodes:
>   - { id: o1, col: one, label: "0 мс", text: "весь екран — skeleton", note: "заголовок і фільтри теж сховані", tone: yellow, icon: "px:hourglass" }
>   - { id: o2, col: one, label: "3000 мс", text: "уся сторінка разом", note: "чекає найповільніший блок", tone: orange }
>   - { id: o3, col: one, label: "hydration", text: "один великий прохід", note: "кнопки оживають наприкінці", tone: red }
>   - { id: m1, col: many, label: "0 мс", text: "заголовок, фільтри, fallback-и", note: "LCP у shell", tone: green, icon: "px:bolt" }
>   - { id: m2, col: many, label: "200 / 1000 / 3000 мс", text: "кожен блок — у свій час", note: "skeleton-и тримають розмір: без CLS", tone: green }
>   - { id: m3, col: many, label: "hydration", text: "по межах, клік — першим", note: "selective hydration", tone: mint, icon: "px:check" }
> steps:
>   - { show: [o1, m1], note: "Ліворуч loading.tsx ховає всю сторінку. Праворуч заголовок і фільтри — у shell, а skeleton-и стоять лише там, де дані." }
>   - { show: [o2, m2], note: "Ліворуч одна межа чекає найповільніші дані. Праворуч кожен блок зʼявляється, щойно готовий." }
>   - { show: [o3, m3], note: "Межі ділять і hydration: React оживляє частини окремо й першою — ту, по якій клікнули." }
> ```
> Обидві сторінки завантажуються 3 секунди. Різниця — у тому, що користувач бачить і може робити до того.

> [!quiz] Перевір себе: обери вдалі рішення для меж
> level: middle · type: multi · id: nextjs-core-11-quiz-06
>
> Сторінка товару: заголовок і фото (з кешу), ціна з наявністю (окремий сервіс, 300 мс), кнопка «У кошик», відгуки (1,5 с), «Схожі товари» (2 с).
>
> - [x] Заголовок і фото — поза межами, у shell
> - [x] Ціну й кнопку «У кошик» — в одну межу
> - [ ] Ціну й кнопку — в різні межі, щоб кнопка зʼявилась раніше
> - [x] Відгуки й «Схожі товари» — у дві сусідні межі зі skeleton-ами відповідної висоти
> - [ ] Одна межа навколо всієї сторінки — так простіше і швидше
> - [ ] Кожен `<li>` відгуку — у власну межу, щоб показувати їх по одному
>
> **Пояснення:** закешоване — у shell, там і LCP-фото. Ціна й кнопка — один зміст: кнопка без ціни провокує хибний клік. Незалежні повільні блоки — сусідні межі, кожна з skeleton-ом свого розміру. Одна межа ховає все до найповільнішого блоку, а межа на кожен рядок — це «попкорн» із десятків замін, які React однаково згрупує throttle-ом.

### 🤝 use(): проміс із сервера в Client Component

Інтерактивному компоненту (графік, таблиця) потрібні серверні дані. Server Component може **запустити** запит і передати **незарезолвлений проміс** у Client Component як prop: Promise серіалізується через межу ([[Next.js - 07. Server і Client Components|тема 07]]), значення доходить окремим рядком payload. Клієнт читає його через `use()`:

```tsx
// app/stats/page.tsx — запускаємо запит, але не чекаємо
import { Suspense } from 'react'
import { slow } from '../lib/data'
import { StatsChart } from './stats-chart'

export type Stats = { revenue: number; orders: number }

export default function StatsPage() {
  const statsPromise: Promise<Stats> = slow(800, { revenue: 125_000, orders: 42 })
  return (
    <main>
      <h1>Статистика</h1>
      <Suspense fallback={<p>Графік…</p>}>
        <StatsChart statsPromise={statsPromise} />
      </Suspense>
    </main>
  )
}
```

```tsx
// app/stats/stats-chart.tsx
'use client'

import { use, useState } from 'react'
import type { Stats } from './page'

export function StatsChart({ statsPromise }: { statsPromise: Promise<Stats> }) {
  const stats = use(statsPromise) // суспендить до резолву промісу
  const [showOrders, setShowOrders] = useState(false)
  return (
    <div>
      <p>Виторг: {stats.revenue} ₴</p>
      <button onClick={() => setShowOrders((v) => !v)}>Замовлення</button>
      {showOrders && <p>Замовлень: {stats.orders}</p>}
    </div>
  )
}
```

Сторінка без `await` потрапляє в shell із «Графік…» (+45 мс). Коли проміс резолвиться, React рендерить `StatsChart` **на сервері** (SSR Client Component) і досилає HTML через `div hidden` + `$RC` (+846 мс). Після hydration клік по кнопці показує кількість замовлень.

Правила `use()`:

- **Межа — навколо того, хто викликає `use()`.** Проміс можна передати крізь скільки завгодно шарів; суспендить лише компонент, що його читає.
- **Проміс створює Server Component.** Створений у клієнтському рендері проміс новий на кожен рендер, і `use()` суспендитиме знову й знову.
- **`use()` можна викликати в умові й циклі** — на відміну від хуків. Але не в `try/catch`: відхилений проміс іде до найближчого error boundary (у Next.js — `error.tsx`).
- **Спільні дані** — один проміс через провайдер контексту: layout створює `getUser()`, провайдер кладе проміс у контекст, будь-який компонент нижче читає `use(userPromise)` у своїй межі.

> [!quiz] Перевір себе: заповни пропуски
> level: middle · type: fill · bank: await, useEffect · id: nextjs-core-11-quiz-07
>
> ```tsx fill
> // app/orders/page.tsx — Server Component
> export default function OrdersPage() {
>   const ordersPromise = getOrders() // без await
>   return (
>     <[[Suspense]] fallback={<p>Замовлення…</p>}>
>       <OrdersTable orders={[[ordersPromise]]} />
>     </Suspense>
>   )
> }
>
> // app/orders/orders-table.tsx
> [['use client'|"use client"]]
> import { use } from 'react'
>
> export function OrdersTable({ orders }: { orders: Promise<Order[]> }) {
>   const list = [[use]](orders)
>   return <ul>{list.map((o) => <li key={o.id}>{o.title}</li>)}</ul>
> }
> ```
>
> **Пояснення:** сервер запускає запит і передає проміс без `await` — інакше сторінка чекала б дані сама й вийшла б із shell. Межа стоїть навколо компонента, що читає проміс. `use()` суспендить Client Component до резолву; `await` у Client Component неможливий (async Client Components не підтримуються), а `useEffect` дав би клієнтський водоспад і порожній HTML.

### 💥 Помилка посеред стріму

Що, як компонент кинув помилку, коли shell уже на екрані?

```tsx
// app/broken/page.tsx — помилка посеред стріму
import { Suspense } from 'react'
import { slow } from '../lib/data'

async function Flaky() {
  const items = await slow(500, null as string[] | null)
  if (!items) throw new Error('Сервіс рекомендацій недоступний')
  return <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
}

export default function BrokenPage() {
  return (
    <main>
      <h1>Головна</h1>
      <Suspense fallback={<p>Рекомендації…</p>}>
        <Flaky />
      </Suspense>
    </main>
  )
}
```

```tsx
// app/broken/error.tsx
'use client'

export default function BrokenError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div>
      <p>Щось пішло не так ({error.digest})</p>
      <button onClick={() => retry()}>Спробувати ще</button>
    </div>
  )
}
```

Статус — `200`: shell пішов раніше. Замість `div hidden` приходить рядок payload `6:E{"digest":"2387856904"}` і скрипт `$RX("B:0","2387856904")`: маркер межі стає `<!--$!-->` («помилка»), fallback лишається до hydration. Тоді React рендерить межу на клієнті, отримує помилку з payload і віддає її найближчому error boundary. У браузері (production) — «Щось пішло не так (2387856904)», у консолі — `Minified React error #441`, у лозі сервера — повний текст і той самий `digest`.

Тож помилка в одній межі не валить сторінку: заголовок лишається, `error.tsx` замінює лише свій сегмент. Але **ширина «вибуху» — це межа `error.tsx`, а не `<Suspense>`**: `error.tsx` у папці сторінки замінить усю сторінку. Щоб падав лише блок рекомендацій, потрібна власна межа помилок навколо нього — `catchError` з `next/error`; про це, `retry` проти `reset` і `digest` — у [[Next.js - 13. Помилки й межі помилок|темі 13]].

### 📮 HTTP-контракт: статус фіксується з першим байтом

Тепер головне обмеження. Щоб почати тіло відповіді, сервер мусить надіслати рядок статусу й заголовки. **Після першого байта тіла змінити статус або заголовки неможливо** — так працює HTTP. Усе нижче — наслідки.

**`notFound()` усередині межі → `200` + `noindex`.**

```tsx
// app/post/[slug]/page.tsx — notFound() усередині Suspense
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { slow } from '../../lib/data'

const posts: Record<string, string> = { hello: 'Привіт, стрімінг' }

async function PostBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const text = await slow(500, posts[slug])
  if (!text) notFound() // ❌ стрім уже почався: статус 200
  return <article>{text}</article>
}

export default function PostPage({ params }: PageProps<'/post/[slug]'>) {
  return (
    <main>
      <h1>Блог</h1>
      <Suspense fallback={<p>Стаття…</p>}>
        <PostBody params={params} />
      </Suspense>
    </main>
  )
}
```

`curl` на `/post/nope` дає `200`, хоча в браузері — «404 · This page could not be found». Next.js додає в стрім `<meta name="robots" content="noindex">`, тож URL не проіндексують. Краулери назвуть це **soft 404**, а аналітика, моніторинг і кеш CDN побачать «успішну» відповідь.

**Справжній 404 — перевірка до будь-якої межі.**

```tsx
// app/article/[slug]/page.tsx — перевірка існування до будь-якого Suspense
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { slow } from '../../lib/data'

const posts: Record<string, string> = { hello: 'Привіт, стрімінг' }

export async function generateStaticParams() {
  return [{ slug: 'hello' }]
}

async function Comments() {
  const count = await slow(800, 3)
  return <p>Коментарів: {count}</p>
}

export default async function ArticlePage({ params }: PageProps<'/article/[slug]'>) {
  const { slug } = await params
  const text = posts[slug] // швидка перевірка існування
  if (!text) notFound() // ✅ справжній 404: тіло ще не стрімиться
  return (
    <main>
      <article>{text}</article>
      <Suspense fallback={<p>Коментарі…</p>}>
        <Comments />
      </Suspense>
    </main>
  )
}
```

`/article/nope` → `404` за 27 мс, `/article/hello` → `200` зі стрімінгом коментарів. Закешована (`'use cache'`) перевірка з затримкою 300 мс теж дала справжній `404`: сервер просто тримав заголовки ці 300 мс. Інший шлях — `proxy.ts` ([[Next.js - 06. proxy.ts, redirects і rewrites|тема 06]]): він працює до рендера, коли статус ще вільний.

**Під Cache Components «до будь-якого `await`» — буквально.** Маршрут-«пастка»: `export const instant = false` (блокуючий маршрут без меж), `await slow(1000)`, потім `notFound()`. Меж немає, а результат — `200` і `noindex`. Такий маршрут у таблиці збірки `ƒ`; заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру: на `/orders` (1,5 с) заголовки о +35 мс, перший байт HTML о +1540 мс. Статус уже відправлено, тож `notFound()` після `await` даних запиту коштує 404.

**`redirect()` посеред стріму → клієнтський редирект.** Сторінка з `redirect('/feed')` у межі через 300 мс повертає `200`, а в стрімі — `<meta id="__next-page-redirect" http-equiv="refresh" content="1;url=/feed"/>`. Браузер переходить на `/feed` через секунду, але це не `307`: боти й `curl` бачать звичайну сторінку. Для справжнього HTTP-редиректу — `redirect()` до меж, `redirects` у `next.config` або `proxy.ts`.

**Заголовки — так само.** Server Component не може поставити заголовок чи cookie (cookies змінюються лише в Server Actions і Route Handlers). Заголовки ставлять до рендера: `headers()` у `next.config`, `proxy.ts`.

> [!quiz] Перевір себе: який статус поверне сервер?
> level: middle · type: output · id: nextjs-core-11-quiz-08
>
> `GET /post/nope`, сторінка з прикладу вище: `notFound()` викликано в `PostBody` під `<Suspense>` після 500 мс очікування. Що поверне `curl -I`?
>
> - [ ] `404 Not Found` — `notFound()` завжди дає 404
> - [x] `200 OK`, а в HTML буде `<meta name="robots" content="noindex">`
> - [ ] `500 Internal Server Error` — `notFound()` після старту стріму кидає помилку
> - [ ] `307` на `/_not-found`
>
> **Пояснення:** fallback «Стаття…» вже пішов у shell, а з ним — заголовки й статус. Next.js дописує в стрім UI not-found і `noindex`, щоб URL не потрапив в індекс. Справжній 404 потрібен — перевіряй існування до будь-якої межі та до `await` даних запиту, або в `proxy.ts`.

### 🤖 Боти, SEO і htmlLimitedBots

Стрімінговий HTML — звичайний серверний HTML, тож пошуковик бачить той самий вміст. Проблема — з **metadata**: `generateMetadata` теж стрімиться, і `<title>` приходить пізніше, у `<body>`. Боти, що читають лише статичний HTML (прев'ю посилань у месенджерах і соцмережах), шукають metadata в `<head>` і не знайдуть.

Тому для таких ботів Next.js **чекає `generateMetadata`** перед тілом. Список User-Agent задає `htmlLimitedBots` (з 15.2). Типовий regex на 16.3.8 (`html-bots.js` у пакеті `next`) містить Twitterbot, Slackbot, Bingbot, facebookexternalhit, LinkedInBot, WhatsApp, `AdsBot-Google` та інші `*-Google`. **Googlebot** Next.js розпізнає як «DOM-бот»: він виконує JS і отримує звичайний стрім.

```ts
// next.config.ts — власний список замінює типовий повністю
import type { NextConfig } from 'next'

const config: NextConfig = {
  cacheComponents: true,
  htmlLimitedBots: /MySpecialBot|SimpleCrawler/, // /.*/ — блокуюча metadata для всіх
}

export default config
```

Сторінка з `generateMetadata` на 1 с і межею на 2,5 с:

| User-Agent | Заголовки | `<title>` | Межа |
|---|---|---|---|
| браузер | +40 мс | у `<body>`, пізніше | +2549 мс, стрімом |
| `Googlebot/2.1` | +40 мс | у `<body>`, пізніше | +2542 мс, стрімом |
| `Twitterbot/1.0` | **+1063 мс** | **у `<head>`** | +2538 мс, стрімом |

Для Twitterbot сервер чекав metadata, поклав `<title>` у `<head>`, а потім **однаково стрімив** межу. До того ж під Cache Components такі боти не отримують пререндерений shell — сторінка рендериться для них динамічно. Тож якщо shell залежить від даних, доступних лише під час збірки, бот може отримати помилку там, де людина бачить сторінку.

> [!warning] Розбіжність з документацією
> [Streaming → Verifying that streaming works](https://nextjs.org/docs/app/guides/streaming#verifying-that-streaming-works) пише, що з `User-Agent: Twitterbot/1.0` `fetch()` чекає весь рендер і тіло приходить одним шматком. На 16.3.8 з `cacheComponents: true` — інакше: сервер чекає лише `generateMetadata`, а межі `<Suspense>` далі приходять стрімом (без `generateMetadata` — взагалі без затримки). Це збігається з розділом [Bots and crawlers → Cache Components](https://nextjs.org/docs/app/guides/streaming#cache-components) тієї ж сторінки: «Once the metadata resolves, the remaining page content can still stream». Тож `htmlLimitedBots` — про metadata, а не про весь HTML.

> [!quiz] Перевір себе: що отримає Twitterbot?
> level: middle · id: nextjs-core-11-quiz-09
>
> Сторінка товару на 16.3.8 з Cache Components: `generateMetadata` читає ціну (800 мс), відгуки — у `<Suspense>` (2 с). Що отримає Twitterbot із типовим `htmlLimitedBots`?
>
> - [ ] Те саме, що й браузер: shell одразу, `<title>` пізніше в `<body>`
> - [x] Заголовки й `<title>` у `<head>` приблизно через 800 мс, а відгуки — далі стрімом
> - [ ] Повний документ одним шматком через 2 с
> - [ ] Порожню сторінку: боти не виконують `$RC`, тож вмісту меж не побачать
>
> **Пояснення:** для HTML-limited ботів Next.js блокує стрім до `generateMetadata`, щоб теги були в `<head>`. Межі після цього стрімляться як завжди. `$RC` для бота не потрібен: готовий HTML межі все одно лежить у документі (у `div hidden`), а прев'ю посилань бере metadata з `<head>`.

### 🖱️ Selective hydration: клік оживляє межу першою

Кожна `<Suspense>` — окрема одиниця hydration, яку React гідратує, щойно для неї прийшли HTML, payload і JS; без меж — один блокуючий прохід (механіка — у [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🌊 Selective hydration і Suspense|темі 09]]).

Спрощено, за описом архітектури Suspense SSR від React: якщо користувач клікнув у ще не гідратовану межу, React **запамʼятовує подію, гідратує цю межу позачергово** і відтворює клік. Важкий коментарний тред в іншій межі не тримає кнопку — це покращує INP (interaction to next paint). Локально це майже не помітно (залежить від навантаження CPU); демо документації порівнює [один блокуючий прохід](https://streaming-demo.labs.vercel.dev/hydration-single) з [розділеною hydration](https://streaming-demo.labs.vercel.dev/hydration-split).

### 🚧 Що ламає стрімінг

Сервер може стрімити ідеально, а користувач однаково побачить усе одним шматком, якщо щось між ними **буферизує** відповідь:

| Шар | Що відбувається | Що робити |
|---|---|---|
| nginx та інші reverse proxy | буферизують відповідь за замовчуванням | заголовок `X-Accel-Buffering: no` (нижче) або `proxy_buffering off` |
| CDN | може зібрати всю відповідь перед відправкою | документація провайдера, іноді — окремий план |
| Serverless | не всі платформи стрімлять (AWS Lambda — лише в режимі response streaming) | увімкнути режим; Vercel стрімить нативно |
| Стиснення gzip/Brotli | компресор накопичує дані перед flush | налаштувати flush; перевіряти з `Accept-Encoding: identity` |
| Safari/WebKit | не малює, доки не прийде ~1024 байти | реальні сторінки більші; помітно лише в демо |
| `curl` | буферизує вивід | `-N`, і все одно чекає символ нового рядка |
| `output: 'export'` | статичний експорт — немає сервера | стрімінг не підтримується |

```ts
// next.config.ts — вимкнути буферизацію nginx для всіх сторінок
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [{ source: '/:path*{/}?', headers: [{ key: 'X-Accel-Buffering', value: 'no' }] }]
  },
}

export default nextConfig
```

`next start` сам цей заголовок не ставить — лише з таким `headers()` у конфігу. Перевірка в проді — той самий `stream-observer.mjs` проти справжнього домену, а в DevTools — короткий TTFB і довгий Content Download.

**Не стрімиться за визначенням**: `proxy.ts` (виконується до рендера), `redirects`/`rewrites` з конфігу, статус і заголовки. Route Handlers стрімлять «сирі» відповіді через `ReadableStream` без React — тема 19 основного посібника.

### 🧯 Помилка збірки «blocking route»

Під Cache Components доступ до даних запиту чи незакешованих даних поза будь-якою межею — помилка `next build` (16.3.8), і текст одразу пропонує три виходи:

```text
Error: Route "/orders": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route
```

`[stream]` — тема цього розділу: межа або `loading.tsx`. `[cache]` — розширити shell кешем ([[Next.js - 12. Partial Prerendering і Cache Components|тема 12]], тема 15 основного посібника). `[block]` — свідомо відмовитися від стрімінгу: той самий маршрут із `instant = false` збирається, але віддає HTML лише через ~1540 мс. Детальніше — у [[Next.js - 12. Partial Prerendering і Cache Components|темі 12]].

### 🏭 Як це роблять у продакшні

- **Межі на code review.** Питання до кожного `await` у layout і page: «чи це справді має блокувати все нижче?». Типова правка — передати проміс у дочірній компонент під `<Suspense>`.
- **Skeleton-и — частина дизайн-системи.** `CardSkeleton`, `TableSkeleton`, `ChartSkeleton` з тими самими розмірами, що й компоненти; CLS дивляться в RUM (real user monitoring), а не лише в Lighthouse.
- **`loading.tsx` — страховка, а не стратегія.** Він потрібен для миттєвого відгуку при навігації, але дані сторінки мають власні межі.
- **Перевірка стрімінгу в CI/після деплою.** Скрипт на кшталт `stream-observer.mjs`: TTFB документа менше X мс і хоча б два чанки з різницею в часі. Ловить nginx, CDN і компресію раніше за користувачів.
- **Статус-коди — до меж.** Існування сутності (стаття, товар, профіль) перевіряють закешованою функцією або в proxy, щоб 404 і 301 були справжніми. Моніторинг рахує soft 404 окремо: шукає `noindex` у відповідях `200`.
- **Bot-трафік.** Повільна `generateMetadata` — прямий TTFB для ботів прев'ю; перевіряють `curl -A Twitterbot/1.0`.
- **Помилки посеред стріму — лише в логах.** Статус `200`, алерти на 5xx мовчать: логують `digest` і рахують помилки рендера ([[Next.js - 13. Помилки й межі помилок|тема 13]]).

## ⚠️ Пастки

> [!pitfall] await на верху layout вбиває стрімінг
> Один `await cookies()` у layout робить динамічним усе дерево під ним: shell зникає, а під Cache Components збірка падає.
>
> ```tsx
> // ❌ app/layout.tsx
> const session = await getSession() // чекає все, навіть статичне меню
>
> // ✅ проміс — у компонент, що його читає, під Suspense
> <Suspense fallback={<AvatarSkeleton />}>
>   <UserMenu sessionPromise={getSession()} />
> </Suspense>
> ```

> [!pitfall] notFound() після Suspense — soft 404
> `noindex` закриває індексацію, але статус `200` бачать аналітика, моніторинг і кеш CDN.
>
> ```tsx
> <Suspense fallback={<p>…</p>}>
>   <Post /> {/* ❌ notFound() усередині → 200 + noindex */}
> </Suspense>
> // ✅ if (!(await postExists(slug))) notFound() — до межі, закешованою перевіркою
> ```

> [!pitfall] Проміс, створений у Client Component
> Новий проміс на кожен рендер — `use()` суспендить знову й знову.
>
> ```tsx
> 'use client'
> export function Chart() {
>   const stats = use(fetch('/api/stats').then((r) => r.json())) // ❌ новий проміс щоразу
> }
> // ✅ проміс створює Server Component і передає prop-ом
> ```

> [!pitfall] Skeleton іншого розміру
> Fallback на 40 px, вміст на 400 px — сторінка стрибає, CLS росте. Резервуй місце: `minHeight` або той самий layout-компонент для skeleton і вмісту.

> [!pitfall] «Локально стрімиться, у проді — ні»
> Найчастіше винен nginx, CDN або компресія. Перевіряй скриптом проти продового домену з `Accept-Encoding: identity`, а не `curl` без `-N`.

## 🎤 На співбесіді

> [!interview] Що таке streaming у Next.js і що він покращує?
> level: middle · frequency: дуже часто · id: nextjs-core-11-int-01
>
> ---
>
> Сервер віддає HTML частинами в одній відповіді: спершу static shell з layouts і fallback-ами меж `<Suspense>`, потім кожну межу, щойно її дані готові. TTFB дорівнює часу рендера shell-а, а не найповільнішого запиту; FCP відвʼязаний від даних, CSS і JS вантажаться з першого чанка. Плюс selective hydration — краще INP. Ризики: LCP-елемент у межі, CLS від fallback-ів не того розміру, статус фіксується до стріму.
>
> 📚 [[Next.js - 11. Streaming і Suspense#🧭 Навіщо streaming: TTFB, FCP і найповільніший запит|Розділ: навіщо streaming]] · [Next.js: Streaming](https://nextjs.org/docs/app/guides/streaming) · [web.dev: TTFB](https://web.dev/articles/ttfb)

> [!interview] Як вміст межі Suspense потрапляє на своє місце, якщо приходить у кінці документа?
> level: senior · frequency: часто · id: nextjs-core-11-int-02
>
> ---
>
> У shell межа — це коментарі `<!--$?-->…<!--/$-->` з порожнім `<template id="B:0">` і fallback-ом. Коли дані готові, React дописує в кінець документа прихований `<div hidden id="S:0">` з готовим HTML і inline-скрипт `$RC("B:0","S:0")`, який переносить вміст на місце fallback-а. Скрипт працює без бандла React і до hydration. Тому порядок — за готовністю, а не за кодом (out-of-order streaming). Вкладені шматки, що ще рендеряться, мають плейсхолдери `P:n` і заповнюються `$RS`. З React 19.2 показ батчиться: межі зʼявляються не частіше ніж раз на ~300 мс. Поруч іде RSC payload у `self.__next_f.push` — для hydration.
>
> 📚 [[Next.js - 11. Streaming і Suspense#🌊 Що летить по дроту|Розділ: що летить по дроту]] · [Next.js: Streaming → Verifying](https://nextjs.org/docs/app/guides/streaming#verifying-that-streaming-works) · [React 19.2: Batching Suspense Boundaries for SSR](https://react.dev/blog/2025/10/01/react-19-2)

> [!interview] Чому сторінка, що показує «404», повертає статус 200, і як отримати справжній 404?
> level: middle · frequency: часто · id: nextjs-core-11-int-03
>
> ---
>
> Статус і заголовки йдуть до першого байта тіла. Якщо `notFound()` спрацював у межі `<Suspense>` (або в сегменті під `loading.tsx`), shell уже відправлено з `200`. Next.js дописує UI not-found і `<meta name="robots" content="noindex">` — індексації не буде, але це soft 404 для аналітики й кешу. Так само `redirect()` посеред стріму стає мета-тегом `refresh`, а не `307`. Справжній 404 — перевірка існування до будь-якої межі й до `await` даних запиту: швидкий або закешований запит у сторінці, `proxy.ts` чи `generateStaticParams` для відомих шляхів.
>
> 📚 [[Next.js - 11. Streaming і Suspense#📮 HTTP-контракт: статус фіксується з першим байтом|Розділ: HTTP-контракт]] · [Next.js: loading.js → Status Codes](https://nextjs.org/docs/app/api-reference/file-conventions/loading#status-codes) · [Next.js: Streaming → The HTTP contract](https://nextjs.org/docs/app/guides/streaming#the-http-contract)

> [!interview] Як ти розставиш межі Suspense на дашборді з п'ятьма віджетами різної швидкості?
> level: senior · frequency: часто · id: nextjs-core-11-int-04
>
> ---
>
> Шапка, фільтри й заголовок — у shell (там і LCP). Кожен незалежний віджет — у сусідню межу зі skeleton-ом того ж розміру; повʼязане за змістом (KPI і тренд) — в одну. Динамічний доступ зсуваю вниз, передаючи проміси; для інтерактивних графіків — проміс у Client Component і `use()`. Не дроблю дрібно: близькі за часом межі React однаково згрупує throttle-ом. `loading.tsx` — для навігації, не замість меж; `catchError` навколо віджета, щоб падав лише він. Перевіряю скриптом чанків і CLS у RUM.
>
> 📚 [[Next.js - 11. Streaming і Suspense#📐 Як проєктувати межі|Розділ: як проєктувати межі]] · [Next.js: Streaming and Web Vitals](https://nextjs.org/docs/app/guides/streaming#streaming-and-web-vitals) · [React: Suspense](https://react.dev/reference/react/Suspense)

> [!interview] Стрімінг працює локально, а в продакшні сторінка приходить одним шматком. Як розслідуватимеш?
> level: senior · frequency: іноді · id: nextjs-core-11-int-05
>
> ---
>
> Виміряти скриптом на `fetch` з `Accept-Encoding: identity` час заголовків і чанків — проти origin і через продовий домен. Origin стрімить, домен ні — винен шар між ними: nginx (`X-Accel-Buffering: no`), CDN, компресія, serverless без режиму стрімінгу. Обидва одним шматком — дивитися код: `await` над межами, `instant = false`, бот-UA з повільною `generateMetadata`.
>
> 📚 [[Next.js - 11. Streaming і Suspense#🚧 Що ламає стрімінг|Розділ: що ламає стрімінг]] · [Next.js: What can affect streaming](https://nextjs.org/docs/app/guides/streaming#what-can-affect-streaming) · [Next.js: Self-Hosting](https://nextjs.org/docs/app/guides/self-hosting)

## 🔗 Звʼязки

- [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration]] — `self.__next_f.push` і hydration по межах.
- [[Next.js - 10. Статичний і динамічний рендеринг]] — чому `await` даних запиту робить динамічним усе нижче.
- [[Next.js - 12. Partial Prerendering і Cache Components]] — як із меж будується static shell.
- [[Next.js - 13. Помилки й межі помилок]] — `error.tsx`, `catchError`, `retry`, `digest`.
- [[Next.js - 04. Навігація під капотом]] — prefetch fallback-а `loading.tsx`.
- [[Next.js - 06. proxy.ts, redirects і rewrites]] — статуси й редиректи до рендера.
- Далі: теми 14–16 основного посібника — дані, кеш і ревалідація, що розширюють shell.

## ⚡ Фішки

> [!reel] 🔀 Вміст межі приходить у кінець документа
> Готовий HTML іде в `<div hidden id="S:0">` наприкінці, а inline-скрипт `$RC("B:0","S:0")` переносить його на місце fallback-а — ще до hydration і без бандла React.
>
> ```html
> <div hidden id="S:0"><section>Виторг: 125000 ₴</section></div>
> <script>$RC("B:0","S:0")</script>
> ```

> [!reel] 📮 Статус-код іде першим рядком
> Після першого байта тіла статус не змінити. `notFound()` під Suspense — це `200` + `noindex`, а `redirect()` — мета-тег `refresh`, а не `307`.

> [!reel] 🪆 Вкладена межа ніколи не випередить батьківську
> Її fallback — частина вмісту батька. Якщо внутрішня межа готова раніше, вона зʼявиться разом із зовнішньою, і її fallback користувач не побачить зовсім.

> [!reel] ⏱️ React 19.2 показує межі не частіше ніж раз на ~300 мс
> Межа, готова через 80 мс після сусідньої, чекає до 300 мс. Дробити межі заради різниці в десятки мілісекунд немає сенсу.

> [!reel] 🤖 Twitterbot чекає title, Googlebot — ні
> `htmlLimitedBots` блокує стрім до `generateMetadata`, щоб `<title>` був у `<head>`. Googlebot виконує JS і отримує звичайний стрім. Межі `<Suspense>` стрімляться для обох.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що робить файл loading.tsx?
> *дуже часто · теорія* · `nextjs-core-11-card-01`
>
> Next.js обгортає сторінку сегмента (і все нижче) у `<Suspense>`, а компонент з `loading.tsx` стає fallback-ом. Layout сегмента рендериться одразу, skeleton — миттєво, вміст замінює його, коли сторінка готова. Fallback також потрапляє в prefetch для миттєвої навігації.
>
> 📚 [[Next.js - 11. Streaming і Suspense#⏳ loading.tsx — автоматична межа сегмента|Розділ: loading.tsx]] · [Next.js: loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

> [!question]- Що таке static shell?
> *часто · теорія* · `nextjs-core-11-card-02`
>
> Усе, що рендериться до того, як резолвиться будь-яка асинхронна робота: layouts, навігація, fallback-и меж `<Suspense>`. Його відправляють першим чанком; під Cache Components він пререндерений на збірці.
>
> 📚 [[Next.js - 11. Streaming і Suspense#🌊 Що летить по дроту|Розділ: що летить по дроту]] · [Next.js: Streaming → The static shell](https://nextjs.org/docs/app/guides/streaming#the-static-shell)

> [!question]- У якому порядку приходять сусідні межі Suspense?
> *часто · теорія* · `nextjs-core-11-card-03`
>
> У порядку готовності даних, а не в порядку коду. Кожна межа — незалежна точка стрімінгу: повільна не тримає швидку.
>
> 📚 [[Next.js - 11. Streaming і Suspense#🧱 Ручні межі: сусідні й вкладені|Розділ: сусідні й вкладені межі]] · [Next.js: Parallel streaming with sibling boundaries](https://nextjs.org/docs/app/guides/streaming#parallel-streaming-with-sibling-boundaries)

> [!question]- Чому skeleton має бути того самого розміру, що й вміст?
> *часто · практика* · `nextjs-core-11-card-04`
>
> Коли fallback замінюється вмістом іншого розміру, сторінка зсувається — росте CLS. Однакові розміри або `minHeight` резервують місце заздалегідь.
>
> 📚 [[Next.js - 11. Streaming і Suspense#📐 Як проєктувати межі|Розділ: як проєктувати межі]] · [web.dev: CLS](https://web.dev/articles/cls)

### 🟡 Middle

> [!question]- Чому await на верху layout погано впливає на стрімінг?
> *дуже часто · практика* · `nextjs-core-11-card-05`
>
> Він робить динамічним усе дерево під layout: нічого нижче не потрапить у shell, і `loading.tsx` того ж сегмента layout не накриває. Під Cache Components це ще й помилка збірки. Рішення — передати проміс у компонент, що його читає, під `<Suspense>`.
>
> 📚 [[Next.js - 11. Streaming і Suspense#📐 Як проєктувати межі|Розділ: зсувай динамічний доступ вниз]] · [Next.js: Push dynamic access down](https://nextjs.org/docs/app/guides/streaming#push-dynamic-access-down)

> [!question]- Як передати дані з Server Component у Client Component, не чекаючи їх на сервері?
> *часто · код* · `nextjs-core-11-card-06`
>
> Запустити запит без `await` і передати проміс prop-ом; у Client Component прочитати `use(promise)`, а навколо нього поставити `<Suspense>`. Проміс створює сервер, бо створений у клієнтському рендері — новий на кожен рендер.
>
> ```tsx
> const statsPromise = getStats() // Server Component
> <Suspense fallback={<p>Графік…</p>}><StatsChart statsPromise={statsPromise} /></Suspense>
> ```
>
> 📚 [[Next.js - 11. Streaming і Suspense#🤝 use(): проміс із сервера в Client Component|Розділ: use()]] · [React: use](https://react.dev/reference/react/use)

> [!question]- Що побачить користувач, якщо вкладена межа готова раніше за батьківську?
> *іноді · теорія* · `nextjs-core-11-card-07`
>
> Обидві частини разом, коли готова батьківська. Fallback вкладеної межі він не побачить: вміст замінюється ще в прихованому сегменті батька.
>
> 📚 [[Next.js - 11. Streaming і Suspense#🧱 Ручні межі: сусідні й вкладені|Розділ: вкладені межі]] · [Next.js: Nested boundaries](https://nextjs.org/docs/app/guides/streaming#nested-boundaries-for-progressive-detail)

> [!question]- Який статус поверне сторінка, якщо notFound() спрацював усередині Suspense?
> *часто · теорія* · `nextjs-core-11-card-08`
>
> `200`: статус пішов разом із shell-ом. Next.js додає в стрім `<meta name="robots" content="noindex">`. Для справжнього 404 перевіряй існування до межі й до `await` даних запиту.
>
> 📚 [[Next.js - 11. Streaming і Suspense#📮 HTTP-контракт: статус фіксується з першим байтом|Розділ: HTTP-контракт]] · [Next.js: loading.js → Status Codes](https://nextjs.org/docs/app/api-reference/file-conventions/loading#status-codes)

> [!question]- Що станеться з помилкою, кинутою в межі Suspense після старту стріму?
> *часто · теорія* · `nextjs-core-11-card-09`
>
> Статус лишиться `200`. React надішле `$RX` з `digest`, межа отримає маркер помилки й лишиться з fallback-ом до hydration, а тоді найближчий error boundary (`error.tsx`, `catchError`) покаже UI помилки. Решта сторінки ціла.
>
> 📚 [[Next.js - 11. Streaming і Suspense#💥 Помилка посеред стріму|Розділ: помилка посеред стріму]] · [Next.js: Error handling mid-stream](https://nextjs.org/docs/app/guides/streaming#error-handling-mid-stream)

### 🔴 Senior

> [!question]- Що таке htmlLimitedBots і що змінюється для таких ботів?
> *іноді · теорія* · `nextjs-core-11-card-10`
>
> Regex User-Agent ботів, що читають лише статичний HTML (Twitterbot, Slackbot, Bingbot…). Для них Next.js чекає `generateMetadata` перед тілом, щоб metadata була в `<head>`; під Cache Components вони не отримують пререндерений shell. Межі далі стрімляться. Власний regex замінює типовий список; Googlebot — DOM-бот і отримує звичайний стрім.
>
> 📚 [[Next.js - 11. Streaming і Suspense#🤖 Боти, SEO і htmlLimitedBots|Розділ: боти]] · [Next.js: htmlLimitedBots](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots)

> [!question]- Чому межа Suspense, готова через 80 мс після сусідньої, зʼявляється із затримкою?
> *рідко · теорія* · `nextjs-core-11-card-11`
>
> React 19.2 батчить показ серверних меж: `$RC` ставить межу в чергу, а `$RV` показує чергу не раніше ніж через ~300 мс після попереднього показу. Так менше окремих зсувів макета.
>
> 📚 [[Next.js - 11. Streaming і Suspense#🧱 Ручні межі: сусідні й вкладені|Розділ: throttle показу]] · [React 19.2: Batching Suspense Boundaries for SSR](https://react.dev/blog/2025/10/01/react-19-2)

> [!question]- Чому notFound() після await даних запиту дає 200 навіть без жодної межі?
> *рідко · практика* · `nextjs-core-11-card-12`
>
> Під Cache Components такий маршрут у таблиці збірки `ƒ`; заголовки (200, `x-nextjs-postponed: 1`) йдуть одразу, HTML — лише після повного рендеру. `instant = false` цього не змінює: на 1,5-секундному маршруті заголовки приходять о +35 мс, HTML — о +1540 мс. Коли `notFound()` спрацює, статус уже відправлено.
>
> 📚 [[Next.js - 11. Streaming і Suspense#📮 HTTP-контракт: статус фіксується з першим байтом|Розділ: HTTP-контракт]] · [Next.js: Streaming → When does streaming start?](https://nextjs.org/docs/app/guides/streaming#when-does-streaming-start)

## 🛠️ Практика

> [!task] Симулюй порядок появи меж
> level: senior · difficulty: hard · id: nextjs-core-11-task-01 · tags: streaming, suspense, timers
>
> Напиши `streamReveal(boundaries, log, throttle = 300)` — спрощену модель того, як браузер показує межі `<Suspense>` зі стріму. `boundaries` — дерево `{ id, readyAt, children? }`, де `readyAt` — мілісекунди від початку запиту, коли вміст межі готовий (запити стартують одночасно). У `log` записуй події `{ at, kind: 'fallback' | 'content', id }`, `at` — мілісекунди від виклику. Правила:
>
> - одразу (`at: 0`) — `fallback` кожної межі верхнього рівня, у порядку масиву;
> - межа зʼявляється (`content`) не раніше свого `readyAt` і **не раніше батьківської**; поки батько прихований, готова дитина чекає;
> - коли межа зʼявилась, для кожної дитини одразу (в той самий момент) пиши `content`, якщо вона вже готова (і далі вглиб), інакше `fallback`;
> - **throttle**: показ відбувається пакетом не раніше ніж через `throttle` мс після попереднього показу (перший — після «показу shell» у момент 0); усі межі, що стали готові до моменту пакета, зʼявляються в ньому в порядку готовності.
>
> Використовуй `setTimeout` і `Date.now()`: тести вмикають фейковий годинник. Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> type Boundary = { id: string; readyAt: number; children?: Boundary[] }
> type RevealEvent = { at: number; kind: 'fallback' | 'content'; id: string }
>
> function streamReveal(boundaries: Boundary[], log: RevealEvent[], throttle = 300): void {
>   // твій код: setTimeout і Date.now() (у тестах — фейковий годинник)
> }
> ```
>
> ```ts tests
> const content = (at: number, id: string) => ({ at, kind: 'content', id })
> const fallback = (at: number, id: string) => ({ at, kind: 'fallback', id })
>
> test('одразу показує fallback кожної межі верхнього рівня', () => {
>   vi.useFakeTimers()
>   const log: RevealEvent[] = []
>   streamReveal([{ id: 'revenue', readyAt: 200 }, { id: 'orders', readyAt: 1000 }], log, 0)
>   expect(log).toEqual([fallback(0, 'revenue'), fallback(0, 'orders')])
> })
>
> test('сусідні межі зʼявляються незалежно, у порядку готовності', () => {
>   vi.useFakeTimers()
>   const log: RevealEvent[] = []
>   streamReveal([{ id: 'recs', readyAt: 3000 }, { id: 'revenue', readyAt: 200 }, { id: 'orders', readyAt: 1000 }], log, 0)
>   vi.advanceTimersByTime(3000)
>   expect(log.slice(3)).toEqual([content(200, 'revenue'), content(1000, 'orders'), content(3000, 'recs')])
> })
>
> test('вкладена межа показує свій fallback, щойно зʼявився батько', () => {
>   vi.useFakeTimers()
>   const log: RevealEvent[] = []
>   streamReveal([{ id: 'details', readyAt: 500, children: [{ id: 'reviews', readyAt: 1500 }] }], log, 0)
>   vi.advanceTimersByTime(600)
>   expect(log).toEqual([fallback(0, 'details'), content(500, 'details'), fallback(500, 'reviews')])
>   vi.advanceTimersByTime(1000)
>   expect(log.at(-1)).toEqual(content(1500, 'reviews'))
> })
>
> test('вкладена межа, готова раніше за батька, зʼявляється разом із ним', () => {
>   vi.useFakeTimers()
>   const log: RevealEvent[] = []
>   streamReveal([{ id: 'details', readyAt: 500, children: [{ id: 'reviews', readyAt: 300 }] }], log, 0)
>   vi.advanceTimersByTime(1000)
>   expect(log).toEqual([fallback(0, 'details'), content(500, 'details'), content(500, 'reviews')])
> })
>
> test('throttle: межа чекає 300 мс після попереднього показу', () => {
>   vi.useFakeTimers()
>   const log: RevealEvent[] = []
>   streamReveal([{ id: 'a', readyAt: 400 }, { id: 'b', readyAt: 480 }, { id: 'c', readyAt: 1200 }], log)
>   vi.advanceTimersByTime(1500)
>   expect(log.slice(3)).toEqual([content(400, 'a'), content(700, 'b'), content(1200, 'c')])
> })
>
> test('межі, готові в одному вікні throttle, показуються одним пакетом', () => {
>   vi.useFakeTimers()
>   const log: RevealEvent[] = []
>   streamReveal([{ id: 'a', readyAt: 100 }, { id: 'b', readyAt: 250 }], log)
>   vi.advanceTimersByTime(299)
>   expect(log).toHaveLength(2)
>   vi.advanceTimersByTime(1)
>   expect(log.slice(2)).toEqual([content(300, 'a'), content(300, 'b')])
> })
> ```
>
> > [!hint]- Підказка 1
> > Розклади `setTimeout` для кожної межі дерева на її `readyAt`. Колбек лише позначає межу готовою; показувати її чи чекати — вирішує окрема функція.
>
> > [!hint]- Підказка 2
> > Тримай чергу пакета і один таймер: `setTimeout(flush, Math.max(0, lastReveal + throttle - now()))`. Межу з прихованим батьком у чергу не клади — її покаже `reveal` батька, коли пройдеться по дітях.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Boundary = { id: string; readyAt: number; children?: Boundary[] }
> > type RevealEvent = { at: number; kind: 'fallback' | 'content'; id: string }
> >
> > function streamReveal(boundaries: Boundary[], log: RevealEvent[], throttle = 300): void {
> >   const start = Date.now()
> >   const now = () => Date.now() - start
> >   const parentOf = new Map<string, Boundary | null>()
> >   const ready = new Set<string>()
> >   const visible = new Set<string>()
> >   let lastReveal = 0
> >   let batch: Boundary[] = []
> >   let timer: ReturnType<typeof setTimeout> | null = null
> >
> >   function register(list: Boundary[], parent: Boundary | null) {
> >     for (const b of list) {
> >       parentOf.set(b.id, parent)
> >       register(b.children ?? [], b)
> >     }
> >   }
> >
> >   function reveal(b: Boundary) {
> >     visible.add(b.id)
> >     log.push({ at: now(), kind: 'content', id: b.id })
> >     for (const child of b.children ?? []) {
> >       if (ready.has(child.id)) reveal(child)
> >       else log.push({ at: now(), kind: 'fallback', id: child.id })
> >     }
> >   }
> >
> >   function flush() {
> >     timer = null
> >     lastReveal = now()
> >     const list = batch
> >     batch = []
> >     for (const b of list) reveal(b)
> >   }
> >
> >   function arrive(b: Boundary) {
> >     ready.add(b.id)
> >     const parent = parentOf.get(b.id)
> >     if (parent && !visible.has(parent.id)) return // покажемо разом із батьком
> >     batch.push(b)
> >     if (timer === null) timer = setTimeout(flush, Math.max(0, lastReveal + throttle - now()))
> >   }
> >
> >   function schedule(list: Boundary[]) {
> >     for (const b of list) {
> >       setTimeout(() => arrive(b), b.readyAt)
> >       schedule(b.children ?? [])
> >     }
> >   }
> >
> >   register(boundaries, null)
> >   for (const b of boundaries) log.push({ at: 0, kind: 'fallback', id: b.id })
> >   schedule(boundaries)
> > }
> > ```
> >
> > Спрощення: у браузері відлік throttle починається з першого кадру після shell (`$RT`), є виняток біля 2 с, а вміст ще їде мережею. Але порядок за готовністю, «дитина не раніше батька» і пакетний показ — ті самі, що на 16.3.8.

> [!task] Знайди, що блокує shell
> level: middle · difficulty: medium · id: nextjs-core-11-task-02 · tags: suspense, design, waterfall
>
> Напиши `analyzeBoundaries(tree)` — перевірку дизайну меж для сторінки під Cache Components. Вузол дерева: компонент `{ type: 'component', name, ms, cached, children }` або межа `{ type: 'suspense', name, children }`. `ms` — скільки компонент чекає свої дані; `cached: true` означає, що дані в кеші (час 0, на shell не впливає). Поверни `{ blocking, reveal }`:
>
> - `blocking` — імена компонентів з незакешованими даними (`ms > 0`) **поза будь-якою межею**, у порядку обходу в глибину. Саме вони зупиняють збірку («uncached data outside `<Suspense>`»);
> - `reveal` — для кожної межі момент (мс від початку), коли вона може зʼявитися: найпізніше завершення компонента в **її регіоні** (вкладені межі — окремі регіони), але не раніше батьківської межі.
>
> Час: дочірні вузли стартують, коли **батьківський компонент** дочекався своїх даних (водоспад RSC); сусіди стартують одночасно; межа стартує разом зі своїм батьком.
>
> ```js
> analyzeBoundaries(c('Page', 0, [s('side', [c('Ads', 200, [c('Banner', 500)])])]))
> // → { blocking: [], reveal: { side: 700 } }
> ```
>
> ```js starter
> function analyzeBoundaries(tree) {
>   // твій код
>   return { blocking: [], reveal: {} }
> }
> ```
>
> ```js tests
> const c = (name, ms, children = [], cached = false) => ({ type: 'component', name, ms, cached, children })
> const s = (name, children) => ({ type: 'suspense', name, children })
>
> test('компонент з даними поза Suspense блокує shell', () => {
>   const tree = c('Layout', 0, [c('Header', 0), c('UserMenu', 300), s('feed', [c('Feed', 800)])])
>   expect(analyzeBoundaries(tree).blocking).toEqual(['UserMenu'])
> })
>
> test('закешований компонент поза Suspense не блокує shell', () => {
>   const tree = c('Layout', 0, [c('Categories', 400, [], true), s('feed', [c('Feed', 800)])])
>   expect(analyzeBoundaries(tree)).toEqual({ blocking: [], reveal: { feed: 800 } })
> })
>
> test('час межі — найповільніша гілка її регіону', () => {
>   const tree = c('Page', 0, [s('dashboard', [c('Revenue', 200), c('Orders', 1000), c('Chart', 600)])])
>   expect(analyzeBoundaries(tree).reveal).toEqual({ dashboard: 1000 })
> })
>
> test('водоспад: дочірній компонент стартує після батька', () => {
>   const tree = c('Page', 0, [s('side', [c('Ads', 200, [c('Banner', 500)])])])
>   expect(analyzeBoundaries(tree).reveal).toEqual({ side: 700 })
> })
>
> test('вкладена межа не зʼявиться раніше за батьківську', () => {
>   const tree = c('Page', 0, [
>     s('details', [c('Details', 500), s('reviews', [c('Reviews', 300)])]),
>   ])
>   expect(analyzeBoundaries(tree).reveal).toEqual({ details: 500, reviews: 500 })
> })
>
> test('повільна вкладена межа не затримує батьківську', () => {
>   const tree = c('Page', 0, [
>     s('details', [c('Details', 500), s('reviews', [c('Reviews', 1200)])]),
>   ])
>   expect(analyzeBoundaries(tree).reveal).toEqual({ details: 500, reviews: 1200 })
> })
>
> test('межа під блокером стартує після нього, а блокер — у списку', () => {
>   const tree = c('Layout', 0, [c('Session', 400, [s('feed', [c('Feed', 800, [s('comments', [c('Comments', 300)])])])])])
>   expect(analyzeBoundaries(tree)).toEqual({ blocking: ['Session'], reveal: { feed: 1200, comments: 1500 } })
> })
> ```
>
> > [!hint]- Підказка 1
> > Обходь дерево з двома параметрами: момент старту вузла і назва поточної межі (`null` — shell). Для компонента кінець = старт + `ms` (0, якщо `cached`); його діти стартують у цей кінець.
>
> > [!hint]- Підказка 2
> > Спершу збери для кожної межі «готовність регіону» і батьківську межу, а потім окремим проходом порахуй `reveal = max(готовність, reveal батька)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function analyzeBoundaries(tree) {
> >   const blocking = []
> >   const ready = {} // назва межі → коли готовий її регіон
> >   const parent = {} // назва межі → батьківська межа або null
> >
> >   function walk(node, start, boundary) {
> >     if (node.type === 'suspense') {
> >       parent[node.name] = boundary
> >       ready[node.name] = start
> >       for (const child of node.children ?? []) walk(child, start, node.name)
> >       return
> >     }
> >     const ms = node.cached ? 0 : node.ms ?? 0
> >     if (ms > 0 && boundary === null) blocking.push(node.name)
> >     const end = start + ms
> >     if (boundary !== null) ready[boundary] = Math.max(ready[boundary], end)
> >     for (const child of node.children ?? []) walk(child, end, boundary)
> >   }
> >
> >   walk(tree, 0, null)
> >
> >   const reveal = {}
> >   function resolve(name) {
> >     if (!(name in reveal)) {
> >       const p = parent[name]
> >       reveal[name] = p === null ? ready[name] : Math.max(ready[name], resolve(p))
> >     }
> >     return reveal[name]
> >   }
> >   Object.keys(ready).forEach(resolve)
> >   return { blocking, reveal }
> > }
> > ```
> >
> > Останній тест — типовий продакшн-кейс: `Session` у layout блокує shell (під Cache Components це помилка збірки) і ще й зсуває всі межі нижче на 400 мс. Виправлення — передати проміс сесії в компонент під межею, щоб `feed` стартувала в 0. Throttle показу модель свідомо не враховує.

> [!task] Збери фінальний HTML зі стріму
> level: senior · difficulty: hard · id: nextjs-core-11-task-03 · tags: streaming, html, parsing
>
> Напиши `applyStream(chunks)` — що побачить браузер після всіх чанків спрощеного стріму React. Формат (як у `curl -N`, без payload):
>
> - межа в документі: `<!--$?--><template id="B:n"></template>FALLBACK<!--/$-->` (у fallback немає інших меж);
> - `<div hidden id="X">ВМІСТ</div>` одразу перед `<script>` — прихований сегмент: у документ не додається, лише запамʼятовується за id; вміст може містити плейсхолдери `<template id="P:k"></template>` і нові межі;
> - `<script>$RC("B:n","S:m")</script>` — заміни межу B:n (від `<!--$?-->` до її `<!--/$-->`) на `<!--$-->` + вміст S:m + `<!--/$-->` і забудь сегмент;
> - `<script>$RS("S:m","P:k")</script>` — заміни плейсхолдер P:k вмістом S:m;
> - `<script>$RX("B:n",…)</script>` — межа з помилкою: заміни `<!--$?-->` перед нею на `<!--$!-->`, fallback лишається;
> - ціль заміни може бути в документі **або в ще прихованому сегменті**; решта скриптів ігнорується; текст поза сегментами й скриптами дописується в документ.
>
> Поверни документ рядком. Задача на TypeScript: типи знімаються перед запуском і не перевіряються.
>
> ```ts starter
> function applyStream(chunks: string[]): string {
>   // твій код
>   return chunks.join('')
> }
> ```
>
> ```ts tests
> const shell = '<main><h1>Огляд</h1><!--$?--><template id="B:0"></template><p>Виторг…</p><!--/$--><!--$?--><template id="B:1"></template><p>Замовлення…</p><!--/$--></main>'
>
> test('shell без жодної заміни лишається як є', () => {
>   expect(applyStream([shell])).toBe(shell)
> })
>
> test('$RC замінює fallback вмістом сегмента, а сам сегмент зникає', () => {
>   const html = applyStream([shell, '<div hidden id="S:0"><section>125000 ₴</section></div><script>$RC("B:0","S:0")</script>'])
>   expect(html).toBe('<main><h1>Огляд</h1><!--$--><section>125000 ₴</section><!--/$--><!--$?--><template id="B:1"></template><p>Замовлення…</p><!--/$--></main>')
> })
>
> test('межі резолвляться не по порядку, а службові скрипти ігноруються', () => {
>   const html = applyStream([
>     shell,
>     '<script>self.__next_f.push([1,"..."])</script>',
>     '<div hidden id="S:1"><section>42</section></div><script>$RC("B:1","S:1")</script>',
>     '<div hidden id="S:0"><section>125000 ₴</section></div><script>$RC("B:0","S:0")</script>',
>   ])
>   expect(html).toBe('<main><h1>Огляд</h1><!--$--><section>125000 ₴</section><!--/$--><!--$--><section>42</section><!--/$--></main>')
> })
>
> test('вкладена межа всередині ще прихованого сегмента', () => {
>   const html = applyStream([
>     '<main><!--$?--><template id="B:0"></template><p>Деталі…</p><!--/$--></main>' +
>       '<div hidden id="S:0"><template id="P:1"></template><!--$?--><template id="B:2"></template><p>Відгуки…</p><!--/$--></div><script>$RB=[]</script>',
>     '<div hidden id="S:2"><ul><li>Супер</li></ul></div><script>$RC("B:2","S:2")</script>',
>     '<div hidden id="S:1"><h2>Кавомолка</h2></div><script>$RS("S:1","P:1")</script><script>$RC("B:0","S:0")</script>',
>   ])
>   expect(html).toBe('<main><!--$--><h2>Кавомолка</h2><!--$--><ul><li>Супер</li></ul><!--/$--><!--/$--></main>')
> })
>
> test('$RX лишає fallback і позначає межу як помилкову', () => {
>   const html = applyStream([shell, '<script>$RX("B:0","2387856904")</script>'])
>   expect(html.startsWith('<main><h1>Огляд</h1><!--$!--><template id="B:0"></template><p>Виторг…</p><!--/$-->')).toBe(true)
> })
> ```
>
> > [!hint]- Підказка 1
> > Один регулярний вираз з двома альтернативами знайде токени: `<div hidden id="…">…</div>` (лінивий вміст із lookahead `(?=<script>)`) або `<script>…</script>`. Текст між токенами — у документ.
>
> > [!hint]- Підказка 2
> > Напиши `edit(find)`: спробуй змінити документ, а якщо цілі там немає — кожен збережений сегмент. Так вкладена межа B:2 заміниться всередині ще прихованого S:0, як у справжньому стрімі товару.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > function applyStream(chunks: string[]): string {
> >   let doc = ''
> >   const segments = new Map<string, string>()
> >   const token = /<div hidden id="([^"]+)">([\s\S]*?)<\/div>(?=<script>)|<script>([\s\S]*?)<\/script>/g
> >
> >   // замінити перше входження в документі або в ще прихованому сегменті
> >   function edit(find: (html: string) => string | null): void {
> >     const next = find(doc)
> >     if (next !== null) {
> >       doc = next
> >       return
> >     }
> >     for (const [id, html] of segments) {
> >       const updated = find(html)
> >       if (updated !== null) {
> >         segments.set(id, updated)
> >         return
> >       }
> >     }
> >   }
> >
> >   function complete(boundary: string, segment: string) {
> >     const content = segments.get(segment)
> >     if (content === undefined) return
> >     segments.delete(segment)
> >     const open = `<!--$?--><template id="${boundary}"></template>`
> >     edit((html) => {
> >       const at = html.indexOf(open)
> >       if (at === -1) return null
> >       const end = html.indexOf('<!--/$-->', at)
> >       return html.slice(0, at) + '<!--$-->' + content + html.slice(end)
> >     })
> >   }
> >
> >   function fillSegment(segment: string, placeholder: string) {
> >     const content = segments.get(segment)
> >     if (content === undefined) return
> >     segments.delete(segment)
> >     const tag = `<template id="${placeholder}"></template>`
> >     edit((html) => (html.includes(tag) ? html.replace(tag, content) : null))
> >   }
> >
> >   function fail(boundary: string) {
> >     const open = `<!--$?--><template id="${boundary}"></template>`
> >     edit((html) => (html.includes(open) ? html.replace(open, `<!--$!--><template id="${boundary}"></template>`) : null))
> >   }
> >
> >   for (const chunk of chunks) {
> >     let last = 0
> >     for (const m of chunk.matchAll(token)) {
> >       doc += chunk.slice(last, m.index)
> >       last = m.index! + m[0].length
> >       if (m[1] !== undefined) {
> >         segments.set(m[1], m[2])
> >         continue
> >       }
> >       const call = /^\$R([CSX])\(([^)]*)\)$/.exec(m[3].trim())
> >       if (!call) continue
> >       const args = [...call[2].matchAll(/"([^"]*)"/g)].map((a) => a[1])
> >       if (call[1] === 'C') complete(args[0], args[1])
> >       else if (call[1] === 'S') fillSegment(args[0], args[1])
> >       else fail(args[0])
> >     }
> >     doc += chunk.slice(last)
> >   }
> >   return doc
> > }
> > ```
> >
> > Справжній `$RC` працює з DOM: шукає `<template>` за id, видаляє вузли fallback-а між коментарями й переносить дітей прихованого `div` (з React 19.2 — пакетами). Регулярні вирази для справжнього HTML не годяться — формат свідомо спрощений.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Streaming](https://nextjs.org/docs/app/guides/streaming) — головний гайд: межі, Web Vitals, HTTP-контракт, боти, буферизація.
- 🟢 [Next.js — loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — що обгортає, SEO, статус-коди.
- 🟡 [Next.js — htmlLimitedBots](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots) — блокуюча metadata.
- 🟡 [Next.js — generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — streaming metadata.
- 🟡 [Next.js — Self-Hosting](https://nextjs.org/docs/app/guides/self-hosting) — стрімінг за nginx.
- 🟡 [React — Suspense](https://react.dev/reference/react/Suspense) — межі й що їх активує.
- 🟡 [React — use](https://react.dev/reference/react/use) — читання промісу.
- 🔴 [React 19.2](https://react.dev/blog/2025/10/01/react-19-2) — батчинг показу меж у SSR.
- 🔴 [React WG — New Suspense SSR Architecture](https://github.com/reactwg/react-18/discussions/37) — out-of-order streaming і selective hydration.
- 🛠️ [MDN — Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding) — chunked encoding.

> [!important] Підсумок
> - Streaming віддає HTML частинами в одній відповіді: static shell з fallback-ами одразу, межі `<Suspense>` — щойно готові. TTFB і FCP перестають залежати від найповільнішого запиту.
> - На дроті межа — `<template id="B:n">` у shell, а готовий вміст — `<div hidden id="S:n">` у кінці з `$RC`, що переносить його на місце. Порядок — за готовністю; з React 19.2 показ батчиться (~300 мс).
> - `loading.tsx` — автоматична межа навколо сторінки сегмента (не навколо його layout) і миттєвий fallback для навігації. Для гранулярності — власні межі біля даних.
> - Межі проєктують за змістом: важливе й LCP — у shell, повʼязане — в одну межу, skeleton — того ж розміру, динамічний доступ — якомога нижче. Вкладена межа не випереджає батьківську.
> - Проміс із Server Component читається в Client Component через `use()` під `<Suspense>`.
> - Статус і заголовки фіксуються з першим байтом: `notFound()` під межею — `200` + `noindex`, `redirect()` — мета-тег. Справжні коди — до меж і до `await` даних запиту, або в proxy.
> - HTML-limited боти чекають `generateMetadata`, але межі однаково стрімляться. Стрімінг у проді ламають буферизуючі proxy, CDN і компресія — перевіряй скриптом чанків.

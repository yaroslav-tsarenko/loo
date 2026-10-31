---
title: Як рендериться маршрут, RSC payload і hydration
id: nextjs-core-09
slug: 09-rsc-payload-hydration
order: 9
level: senior
skill: rendering
icon: px:dna
tags: [nextjs, rsc, rsc-payload, flight, hydration, hydration-mismatch, ssr, navigation]
prerequisites:
  - "[[Next.js - 07. Server і Client Components]]"
  - "[[Next.js - 08. Межа use client]]"
estimatedMinutes: 55
nextVersion: 16.3.8
---

# Як рендериться маршрут, RSC payload і hydration

> [!success] 🎯 Після цього розділу ти зможеш
> - покроково розповісти, що роблять сервер і браузер при першому заході на маршрут і при клієнтській навігації;
> - відкрити справжній RSC payload (`.rsc`, `?_rsc=`, `self.__next_f.push`) і прочитати його рядки: елементи, посилання на клієнтські модулі, props;
> - пояснити, чому дані в HTML дублюються в payload, і зменшити payload, прибравши зайві поля з props;
> - пояснити hydration у React 19 і знайти причину hydration mismatch за повідомленням у `next dev` або за `Minified React error #418` у продакшні;
> - виправити mismatch правильним інструментом: детермінований рендер, `useEffect`, `useSyncExternalStore`, `suppressHydrationWarning`, inline-скрипт, `dynamic(…, { ssr: false })`;
> - коротко пояснити selective hydration і роль `<Suspense>` у ній.

## 🤔 Передбач

> [!quiz] Скільки разів назва товару трапиться у HTML?
> level: middle · type: output · id: nextjs-core-09-quiz-01
>
> Продакшн-збірка, статична сторінка. Ти робиш `curl http://localhost:3000/product` і шукаєш у відповіді слово «Кавоварка».
>
> ```tsx
> // app/product/page.tsx — Server Component
> import { product } from '@/lib/products'
> import { AddToCart } from './add-to-cart'
>
> export default function ProductPage() {
>   return (
>     <main>
>       <h1>{product.title}</h1>
>       <p>{product.description}</p>
>       <AddToCart productId={product.id} price={product.price} />
>     </main>
>   )
> }
> ```
>
> - [ ] Один раз — у `<h1>`; Server Component не має payload, бо його код не їде в браузер
> - [x] Двічі — у розмітці `<h1>` і в RSC payload, вбудованому в HTML як `<script>self.__next_f.push(…)</script>`
> - [ ] Жодного — HTML порожній, React намалює сторінку в браузері з payload
> - [ ] Тричі — ще й у JS-чанку `AddToCart`, бо компонент рендерить сторінку
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. HTML потрібен, щоб одразу показати сторінку, а payload — щоб React у браузері знав дерево компонентів і зміг зробити hydration. Тому той самий текст їде двічі. Коду `ProductPage` у браузері немає, але **результат** його рендера там є.

## 🧒 Простими словами

Уяви, що тобі привезли зібрану шафу. Ти одразу можеш нею користуватися — це HTML: видно все, але дверцята ще не відчиняються, бо петлі не закручено. Разом із шафою в коробці лежить **креслення** — RSC payload: перелік деталей, де що стоїть і які гвинти куди. І окремий пакетик з інструментами — JS-чанки Client Components. Майстер (React) бере креслення, звіряє його з шафою і закручує петлі — це hydration. Якщо на кресленні полиця є, а в шафі її немає, майстер не вгадує: розбирає цю секцію і збирає наново — це hydration mismatch. А коли ти замовляєш ще одну секцію до вже зібраної шафи, тобі везуть лише креслення й деталі, а не нову шафу — так працює клієнтська навігація.

## 🔬 Як це працює насправді

### 🧱 Три артефакти одного рендера

У темі [[Next.js - 07. Server і Client Components]] ми розділили компоненти на серверні й клієнтські. Тепер подивимось, **що саме** сервер віддає браузеру. Рендер маршруту в App Router дає три різні речі:

| Артефакт | Що це | Для чого | Коли потрібен |
|---|---|---|---|
| **RSC payload** | серіалізоване дерево: результат Server Components, «місця» для Client Components з посиланнями на їхні файли, props | React у браузері відтворює з нього дерево компонентів | завжди: і при першому заході, і при навігації |
| **HTML** | готова розмітка всієї сторінки, зокрема й Client Components | швидко показати сторінку до завантаження JS | лише при першому заході (hard navigation) |
| **JS-чанки** | код Client Components і рантайм React/Next.js | hydration і подальша інтерактивність | завантажуються раз, далі з кешу браузера |

RSC payload ще називають **Flight** — так зветься протокол React, яким він серіалізується. Документація Next.js описує payload як «компактне серіалізоване представлення» дерева Server Components, але сам формат не документує: це деталь реалізації React, і вона може змінитися між версіями. Тож усе, що нижче про рядки й префікси, — те, що видно на Next.js 16.3.8 з React 19.3; читати payload корисно для налагодження, а будувати на ньому логіку — ні.

Ще одне уточнення. Сервер рендерить маршрут **по сегментах** — layouts і pages окремо, разом зі слотами parallel routes. Payload теж складається з частин для кожного сегмента. Саме тому при навігації сервер може віддати лише ті сегменти, що змінилися, а спільний layout лишається на екрані.

### 🏗️ Перший захід крок за кроком

Візьмемо сторінку з 🤔 Передбач. `ProductPage` — Server Component, `AddToCart` — Client Component з лічильником:

```tsx
// app/product/add-to-cart.tsx
'use client'

import { useState } from 'react'

export function AddToCart({ productId, price }: { productId: string; price: number }) {
  const [count, setCount] = useState(0)
  return (
    <button data-id={productId} onClick={() => setCount(count + 1)}>
      У кошик за {price} ₴ ({count})
    </button>
  )
}
```

> [!note] Чому в прикладах дані в памʼяті
> Приклади курсу зібрані з `cacheComponents: true`. Справжній запит до БД у сторінці зупинив би `next build` з `Next.js encountered uncached or runtime data during prerendering`: такі дані кешують (`'use cache'`, тема 15 основного посібника) або обгортають у `<Suspense>` (теми 11–12 основного посібника). Тут ми це опускаємо.

Що відбувається, коли користувач уперше відкриває `/product` (або оновлює сторінку):

1. **Сервер рендерить Server Components у payload.** React виконує `RootLayout` і `ProductPage`. Замість `<AddToCart>` у дерево потрапляє посилання «тут клієнтський модуль № такий-то, ось його чанки, ось props».
2. **Сервер будує HTML з payload і коду Client Components.** Щоб отримати розмітку кнопки, React виконує код `AddToCart` **на сервері** — з `count = 0`.
3. **Браузер отримує один HTML-документ**, у якому є: розмітка, теги `<script src>` для JS-чанків і кілька inline-скриптів `self.__next_f.push(…)` з payload. Сторінку видно одразу, але кнопка ще «мертва».
4. **Браузер завантажує JS.** Рантайм Next.js збирає шматки payload з `self.__next_f`, React відтворює з нього дерево.
5. **Hydration.** React виконує `AddToCart` уже в браузері, порівнює результат з DOM, що прийшов з HTML, і чіпляє обробник `onClick`. Тепер кнопка рахує.

Справжній HTML (`curl`, скорочено) показує всі три артефакти поруч:

```html
<script src="/_next/static/chunks/097m6a12k0i8_.js" async=""></script>
<script src="/_next/static/chunks/2i79c0wrdpj5c.js" async=""></script>
…
<main><h1>Кавоварка</h1><p>Гейзерна кавоварка на 6 чашок.</p><button data-id="p1">У кошик за <!-- -->2400<!-- --> ₴ (<!-- -->0<!-- -->)</button></main>
<script>(self.__next_f=self.__next_f||[]).push([0])</script>
<script>self.__next_f.push([1,"1:\"$Sreact.fragment\"\n2:I[22016,…"])</script>
<script>self.__next_f.push([1,"0:{\"P\":null,\"c\":[\"\",\"product\"],…"])</script>
```

Коментарі `<!-- -->` між шматками тексту — не сміття: так React позначає межі окремих текстових вузлів (`"У кошик за "`, `2400`, `" ₴ ("`), щоб під час hydration зіставити їх з тим, що рендерить JSX. Чанк `2i79c0wrdpj5c.js` — це і є `AddToCart`: у ньому видно `useState` і рядок «У кошик за». Коду `ProductPage` там немає.

> [!diagram] Перший захід: payload, HTML, hydration
> ```yaml
> layout: flow
> nodes:
>   - { id: req, label: "браузер", text: "GET /product", tone: gray, icon: "px:monitor" }
>   - { id: rsc, label: "сервер · RSC", text: "Server Components → payload", note: "ProductPage виконується лише тут", tone: blue, icon: "px:database" }
>   - { id: ssr, label: "сервер · SSR", text: "payload + Client Components → HTML", note: "AddToCart теж рендериться тут", tone: violet }
>   - { id: doc, label: "браузер", text: "HTML на екрані", note: "+ self.__next_f.push(…)", tone: yellow }
>   - { id: hyd, label: "браузер · hydration", text: "JS-чанки → onClick", note: "React звіряє дерево з DOM", tone: green, icon: "px:bolt" }
> edges:
>   - { from: req, to: rsc, label: "запит" }
>   - { from: rsc, to: ssr, label: "RSC payload" }
>   - { from: ssr, to: doc, label: "HTML + payload" }
>   - { from: doc, to: hyd, label: "JS-чанки" }
> steps:
>   - { focus: req, note: "Прямий захід або оновлення сторінки: браузерові потрібен повний HTML-документ." }
>   - { move: { from: req, to: rsc, value: "GET /product" }, note: "React рендерить Server Components. Замість AddToCart у дерево йде посилання на клієнтський модуль і props { productId, price }." }
>   - { move: { from: rsc, to: ssr, value: "0:{…} 5:I[17278…]" }, note: "З payload і коду Client Components React будує HTML. AddToCart виконується на сервері з count = 0." }
>   - { move: { from: ssr, to: doc, value: "<main>…</main>" }, note: "Браузер малює сторінку одразу. Payload приходить у тому самому документі — inline-скриптами self.__next_f.push." }
>   - { move: { from: doc, to: hyd, value: "2i79c0wrdpj5c.js" }, note: "Після завантаження JS React відтворює дерево з payload, ще раз виконує AddToCart і чіпляє onClick до готової кнопки." }
> ```
> Payload їде разом з HTML, бо hydration потрібне дерево компонентів, а не лише розмітка.

> [!quiz] Перевір себе: склади перший захід по порядку
> level: middle · type: order · id: nextjs-core-09-quiz-02
>
> ```order
> React на сервері рендерить Server Components у RSC payload
> З payload і коду Client Components сервер будує HTML
> Браузер показує HTML, а payload лежить у скриптах self.__next_f.push
> Браузер завантажує JS-чанки Client Components
> React відтворює дерево з payload і робить hydration
> Браузер окремим запитом ?_rsc= завантажує payload для hydration ✗
> ```
>
> **Пояснення:** при першому заході payload приходить **у тому самому HTML-документі**, окремого запиту за ним немає. Запити `?_rsc=` зʼявляються лише при клієнтській навігації та prefetch. Порядок «payload → HTML» важливий: HTML будується з payload, а не навпаки.

### 🔎 Читаємо справжній payload

Payload для статичної сторінки Next.js записує під час `next build` у `.next/server/app/product.rsc`. Той самий текст віддає сервер на RSC-запит (`Content-Type: text/x-component`). Файл і відповідь починаються з одного службового байта: `#` — payload повний, `~` — частковий (так позначено, наприклад, пререндер з «дірками»); у inline-скриптах `self.__next_f.push` цього байта немає. Нижче він опущений. Ось він для нашої сторінки — справжній, але скорочений (`…`) і з переносами для читабельності:

```text
1:"$Sreact.fragment"
2:I[22016,["/_next/static/chunks/097m6a12k0i8_.js"],""]
3:I[39756,["/_next/static/chunks/097m6a12k0i8_.js"],"default"]
5:I[17278,["/_next/static/chunks/097m6a12k0i8_.js","/_next/static/chunks/2i79c0wrdpj5c.js"],"AddToCart"]
7:"$Sreact.suspense"
9:X
0:{"P":null,"c":["","product"],"q":"","i":false,
   "f":[[["",{"children":["product",{"children":["__PAGE__",{},…]},…]},…],
   …["$","html",null,{"lang":"uk","children":["$","body",null,{"children":[
      ["$","nav",null,{"children":[["$","$L2",null,{"href":"/","children":"Головна"}]," · ",…]}],
      ["$","$L3",null,{"parallelRouterKey":"children",…}]]}]}]…
   ["$","main",null,{"children":[
      ["$","h1",null,{"children":"Кавоварка"}],
      ["$","p",null,{"children":"Гейзерна кавоварка на 6 чашок."}],
      ["$","$L5",null,{"productId":"p1","price":2400}]]}]…],
   "b":"ZbHSpvIknamDDqbfdkty4",…}
d:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport",…}]]
9:C
```

Кожен рядок має вигляд `id:ТИП дані`. `id` — шістнадцяткове число, на яке посилаються інші рядки. Тип — одна буква перед даними; якщо букви немає, далі просто JSON. Типи, які ти побачиш найчастіше (спрощено: повний перелік — у коді `react-server-dom` і може змінюватися):

| Рядок | Що означає | У нашому прикладі |
|---|---|---|
| `id:I[модуль, [чанки], "експорт"]` | **посилання на клієнтський модуль** (import): номер модуля в бандлі, JS-файли, які треба завантажити, і імʼя експорту | `5:I[17278,[…,"…/2i79c0wrdpj5c.js"],"AddToCart"]` |
| `id:{…}` або `id:[…]` | **модель**: JSON-фрагмент дерева чи даних | `0:{…}` — корінь, `d:[…]` — теги `<meta>` |
| `id:"$S…"` | символ React (`Symbol.for(…)`) | `1:"$Sreact.fragment"` |
| `id:H…` | hint: підказка браузеру завантажити шрифт, стиль чи скрипт наперед | тут немає; з'являється з `next/font` і CSS |
| `id:E{…}` | помилка, кинута під час рендера на сервері | тут немає |
| `id:X`, `id:C` | початок і кінець потоку AsyncIterable у Flight; Next.js передає так метадані роутера | `9:X` … `9:C`; поруч `13:300` — stale time, той самий, що в заголовку `x-nextjs-stale-time: 300` |

Елемент React у моделі — масив `["$", тип, key, props]`. Тип — або рядок (`"h1"`, `"main"`), або посилання на рядок: `"$L5"` означає «лінивий елемент, тип якого описано в рядку 5». Рядок 5 — це `I`, тобто клієнтський модуль `AddToCart` з чанка `2i79c0wrdpj5c.js`. Так виглядають «плейсхолдери для Client Components» з документації: не код компонента, а **адреса** коду. Число `17278` — той самий номер модуля, який видно в чанку: `…push([…,17278,t=>{…"AddToCart"…}])`.

Props клієнтського компонента лежать четвертим елементом: `{"productId":"p1","price":2400}`. Саме тому все, що ти передаєш у Client Component, видно в payload, навіть якщо компонент це не рендерить.

Рядки-значення, що починаються з `$`, — це не просто текст. Найчастіші префікси:

| Значення | Що означає |
|---|---|
| `"$L5"`, `"$5"` | посилання на рядок `5` (ліниве або звичайне) |
| `"$@14"` | `Promise`, значення якого прийде в рядку `14` (так стрімляться дані з `<Suspense>` — тема 11 основного посібника) |
| `"$undefined"` | `undefined` (у JSON його немає) |
| `"$D2026-01-01T00:00:00.000Z"`, `"$n10"` | `Date` і `BigInt` |
| `"$Q…"`, `"$W…"` | `Map` і `Set` |
| `"$h…"` | посилання на Server Function |
| `"$$…"` | звичайний рядок, що починається з `$` (екранування) |

Решта ключів кореня `0` — службові дані роутера. Дещо можна впізнати: `"c":["","product"]` — сегменти URL, у `"f"` лежить дерево маршруту (`""` → `"product"` → `"__PAGE__"`) разом з відрендереними сегментами, а `"b"` збігається з `.next/BUILD_ID`. Це не API — не парси їх у своєму коді.

> [!quiz] Перевір себе: що бачиш у рядках payload?
> level: senior · type: multi · id: nextjs-core-09-quiz-03
>
> ```text
> 5:I[17278,["/_next/static/chunks/a.js","/_next/static/chunks/b.js"],"AddToCart"]
> 0:["$","main",null,{"children":[["$","h1",null,{"children":"Кавоварка"}],["$","$L5",null,{"productId":"p1","price":2400}]]}]
> ```
>
> - [x] `AddToCart` — Client Component: браузер завантажить для нього `a.js` і `b.js`
> - [x] `{"productId":"p1","price":2400}` — props, передані з Server Component у `AddToCart`
> - [x] `h1` прийшов як готовий результат: його рендерив Server Component, коду для нього немає
> - [ ] Рядок 5 містить код `AddToCart`, тому окремий чанк не потрібен
> - [ ] `$L5` означає, що компонент буде рендеритися лише на сервері
> - [ ] Порядок рядків важливий: рядок 0 не може посилатися на рядок, що йде після нього
>
> **Пояснення:** рядок `I` — лише адреса коду (номер модуля, чанки, експорт), сам код у JS-файлах. `$L5` — посилання на цей рядок, тобто «тут клієнтський компонент». Рядки можуть посилатися на ті, що прийдуть пізніше: так payload стрімиться частинами, і React чекає на відсутні рядки.

> [!warning] Формат payload не документовано
> [Server and Client Components → How do Server and Client Components work](https://nextjs.org/docs/app/getting-started/server-and-client-components#how-do-server-and-client-components-work-in-nextjs) описує лише зміст payload (результат Server Components, плейсхолдери з посиланнями на JS, props), а [глосарій](https://nextjs.org/docs/app/glossary#rsc-payload) називає його «compact binary representation». На 16.3.8 і `.rsc`-файл, і відповідь на RSC-запит — це текст з рядками `id:ТИП дані`, як вище. Типи рядків і префікси визначає клієнт React (`react-server-dom-turbopack` у `next/dist/compiled`); між версіями React вони змінюються.

### 🧬 Payload усередині HTML: self.__next_f

При першому заході окремого запиту за payload немає: він вбудований у HTML. Перший inline-скрипт створює чергу — `(self.__next_f=self.__next_f||[]).push([0])`, а кожен наступний додає в неї шматок тексту payload: `self.__next_f.push([1,"…рядки…"])`. Рядки ті самі, що в `.rsc`-файлі, лише екрановані як JS-рядок (`\"`, `\n`). Коли рантайм Next.js завантажиться, він прочитає все, що вже накопичилося в черзі, і далі слухатиме нові `push`.

Чому скрипти, а не окремий файл? Бо HTML стрімиться. Документація [Streaming](https://nextjs.org/docs/app/guides/streaming) показує це на розбивці відповіді по чанках: спершу static shell з fallback-ами, потім `self.__next_f.push` з payload для hydration, потім готові частини з `<Suspense>` — кожна зі своїм шматком payload і скриптом, що міняє fallback на вміст. Один документ, один потік, без додаткових запитів.

**Чому дані дублюються?** HTML і payload відповідають на різні питання. HTML — це «що намалювати», для браузера, пошуковика й користувача з повільним JS. Payload — це «яке дерево компонентів це намалювало і з якими props», для React. Без payload React у браузері не знав би, що в цьому `<button>` живе `AddToCart` з `price = 2400`, і не зміг би його гідратувати чи пізніше оновити дерево без втрати стану. Тому кожен текст із Server Components їде двічі: як розмітка і як рядок у payload.

На маленьких сторінках payload часто **більший** за саму розмітку. У нашому прикладі HTML `/product` важить 6482 байти, з них 5125 (79 %) — inline-скрипти `self.__next_f.push`. Туди входить дерево роутера, розмітка root layout і навіть вбудована сторінка 404 для `notFound`. Не лякайся цього числа на демо: на реальній сторінці частка менша, а gzip/brotli добре стискають повтори. Але **те, що ти сам кладеш у props, росте лінійно** — і це вже твоя відповідальність.

> [!quiz] Перевір себе: навіщо payload у HTML?
> level: middle · id: nextjs-core-09-quiz-04
>
> Колега пропонує «оптимізацію»: вирізати зі статичного HTML усі скрипти `self.__next_f.push`, бо «розмітка вже є, навіщо дублювати». Що станеться?
>
> - [ ] Нічого поганого: React візьме дерево з DOM
> - [x] React не зможе відтворити дерево компонентів, і hydration не відбудеться — кнопки лишаться «мертвими»
> - [ ] Сторінка стане динамічною: payload підтягнеться окремим запитом `?_rsc=`
> - [ ] Зникнуть лише Server Components, Client Components працюватимуть
>
> **Пояснення:** DOM не містить ні меж компонентів, ні props, ні посилань на клієнтські модулі. Усе це є лише в payload. Без нього React не знає, який код і з якими props виконати для hydration, тож навіть клієнтські кнопки не оживуть.

### 🧭 Клієнтська навігація: тільки payload

Після hydration `<Link>` перехоплює кліки, і HTML більше не потрібен: React уже працює в браузері. На клік роутер бере сегменти з Client Cache (якщо їх уже завантажив prefetch) і дотягує відсутнє запитом за payload. Деталі prefetch, Client Cache і заголовків — у темі [[Next.js - 04. Навігація під капотом]]; тут — що саме приходить.

Перевір сам на продакшн-збірці. Запит із заголовком `RSC: 1` — те, що робить роутер:

```bash
curl -s -L -D - -H 'RSC: 1' http://localhost:3000/product
```

```text
HTTP/1.1 307 Temporary Redirect
location: /product?_rsc

HTTP/1.1 200 OK
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-nextjs-prerender: 1
Content-Type: text/x-component
```

Перший `307` — сервер перевірив параметр `_rsc` (хеш заголовків запиту для CDN-кешу) і перенаправив на правильне значення. Друга відповідь — `text/x-component`, і тіло **побайтово збігається** з `.next/server/app/product.rsc`. Жодного HTML, лише рядки payload. Так виглядає повний RSC-запит сторінки — його робить роутер, коли потрібна ціла сторінка, а без кешу ти отримаєш його і з `curl`.

У браузері з Cache Components картина тонша. Роутер не просить `product.rsc` цілком: поки посилання у viewport, він робить **prefetch по сегментах** — запити `GET /product?_rsc=…` із заголовком `Next-Router-Segment-Prefetch: /_tree` (дерево маршруту) і `/product/__PAGE__` (сам сегмент), які сервер віддає з `.next/server/app/product.segments/`. Для статичної сторінки клік після цього **не робить жодного запиту**: усе вже в Client Cache. Запиту HTML-документа `/product` немає в жодному разі. Як читати ці запити й заголовки — у [[Next.js - 04. Навігація під капотом]].

Що робить React з отриманим payload:

1. **Server Components не виконуються в браузері** — їхній результат уже в payload.
2. **Client Components рендеряться лише в браузері**, без серверного HTML: `AddToCart` створюється з нуля, hydration тут немає, бо гідратувати нічого.
3. **Спільні сегменти не перерендерюються.** Root layout з `<nav>` лишається змонтованим, зі своїм станом; payload містить лише ті сегменти, що змінилися.
4. **Payload кешується** в Client Cache: назад/вперед або повторний перехід можуть обійтися без запиту.

> [!diagram] Перший захід проти навігації
> ```yaml
> layout: compare
> columns: { hard: "Перший захід (hard)", soft: "Клік по Link (soft)" }
> nodes:
>   - { id: h1, col: hard, label: "запит", code: "GET /product\nAccept: text/html", tone: gray }
>   - { id: h2, col: hard, label: "відповідь", text: "HTML + self.__next_f.push", note: "розмітка й payload в одному документі", tone: violet }
>   - { id: h3, col: hard, label: "браузер", text: "hydration Client Components", note: "AddToCart: сервер, потім браузер", tone: green, icon: "px:bolt" }
>   - { id: s1, col: soft, label: "запит", code: "GET /product?_rsc=…\nRSC: 1", tone: gray }
>   - { id: s2, col: soft, label: "відповідь", text: "text/x-component", note: "лише рядки payload змінених сегментів", tone: blue }
>   - { id: s3, col: soft, label: "браузер", text: "рендер на клієнті", note: "AddToCart лише в браузері, layout не чіпаємо", tone: green }
> steps:
>   - { show: [h1, s1], note: "Різний запит: документ проти RSC-запиту з заголовком RSC: 1 і параметром _rsc." }
>   - { show: [h2, s2], note: "Ліворуч приходить HTML з вбудованим payload. Праворуч — лише payload, той самий формат рядків." }
>   - { show: [h3, s3], note: "Ліворуч React гідратує готовий DOM. Праворуч гідратувати нічого: React просто рендерить нові Client Components і вставляє їх у вже живе дерево." }
> ```
> Формат payload однаковий в обох випадках, різниться лише упаковка.

> [!quiz] Перевір себе: що буде у вкладці Network?
> level: middle · type: output · id: nextjs-core-09-quiz-05
>
> Продакшн-збірка, кеш браузера очищено. Користувач відкриває `/`, потім клікає `<Link href="/product">`. Сторінка `/product` статична. Які запити, повʼязані з `/product`, ти побачиш?
>
> - [ ] `GET /product` з HTML і потім `GET /product?_rsc=…`
> - [x] Лише запити `GET /product?_rsc=…` з `RSC: 1` (prefetch сегментів); HTML-документа `/product` немає
> - [ ] Лише `GET /product` з HTML: статичні сторінки завжди віддаються як HTML
> - [ ] Жодного: статична сторінка вже лежить у JS-бандлі
>
> **Пояснення:** після hydration навігація — soft: роутер просить лише payload. У продакшні `<Link>` у viewport ще й prefetch-ить його заздалегідь, тож запити `?_rsc=` зʼявляються ще до кліку, а сам клік по статичній сторінці може не дати жодного запиту. HTML `/product` браузер отримав би лише при прямому заході чи оновленні.

### ⚖️ Розмір payload і що його роздуває

Payload — частина кожного першого заходу (в HTML) і кожної навігації (окремим запитом). Його розмір прямо впливає на TTFB-до-інтерактивності, трафік на мобільних і час розбору в браузері. Що його роздуває:

1. **Цілі обʼєкти в props Client Components.** Головний винуватець. Props серіалізуються повністю — навіть поля, яких компонент не торкається (див. [[Next.js - 07. Server і Client Components#🔐 Секрети, env і server-only|DTO у темі 07]]).
2. **Довгі списки, відрендерені на сервері.** 500 рядків таблиці — це 500 разів розмітка в HTML і 500 разів у payload.
3. **Великий HTML у Server Components**, який міг би бути простішим: зайві обгортки, інлайнові SVG, повторювані класи.
4. **Дані, які Client Component міг би отримати пізніше** — наприклад, вміст вкладки, яку майже ніхто не відкриває.

Подивимось на перше наживо. У `lib/products.ts` товар має 50 відгуків, ціну закупівлі й email постачальника. Кнопці потрібні лише назва й ціна:

```tsx
// app/product-full/page.tsx — ❌ увесь обʼєкт у Client Component
import { product } from '@/lib/products'
import { BuyBox } from './buy-box'

export default function ProductFullPage() {
  return <BuyBox product={product} />
}
```

```tsx
// app/product-full/buy-box.tsx
'use client'

import type { Product } from '@/lib/products'

export function BuyBox({ product }: { product: Product }) {
  return <button>{product.title} — {product.price} ₴</button>
}
```

Після `next build` у `product-full.rsc` знаходимо весь обʼєкт:

```text
["$","$L5",null,{"product":{"id":"p1","title":"Кавоварка","price":2400,"description":"…",
  "supplierEmail":"supplier@example.com","costPrice":1100,"reviews":[{"author":"user0",…
```

Порівняння (байти, без стиснення):

| Варіант | `.rsc` | HTML |
|---|---|---|
| `product={product}` — увесь обʼєкт | 8403 | 10987 |
| DTO: `{ title, price }` | 4085 | 6201 |

Payload вдвічі менший, а `supplierEmail` і `costPrice` більше не лежать у вихідному коді сторінки. Розмітка кнопки однакова в обох варіантах — увесь виграш саме в payload. Рецепт: збирай для Client Component **DTO білим списком** — обʼєкт рівно з тими полями, які він рендерить чи використовує. Задача 3 у 🛠️ Практика вчить рахувати, що саме варто викинути.

> [!quiz] Перевір себе: що зменшить payload?
> level: senior · type: multi · id: nextjs-core-09-quiz-06
>
> Сторінка каталогу передає в клієнтський `ProductGrid` масив з 200 повних обʼєктів товарів. Що реально зменшить RSC payload?
>
> - [x] Передавати в `ProductGrid` лише потрібні поля кожного товару (DTO)
> - [x] Рендерити картки на сервері, а в клієнтський компонент винести лише кнопку «У кошик» з `productId`
> - [x] Показувати першу сторінку з 24 товарів і довантажувати решту за потреби
> - [ ] Додати `'use client'` у `page.tsx`, щоб дані не серіалізувались
> - [ ] Обгорнути `ProductGrid` у `<Suspense>`
> - [ ] Увімкнути gzip: тоді payload не враховується в HTML
>
> **Пояснення:** payload містить props Client Components і результат Server Components, тож скорочують його і кількість даних, і межа, проведена нижче. `'use client'` на сторінці не прибере дані — вони будуть потрібні з іншого джерела, і бандл зросте. `<Suspense>` змінює **коли** приходить частина, а не скільки. Стиснення зменшує трафік, але браузер усе одно розпаковує й парсить повний обсяг.

### 💧 Hydration у React 19

**Hydration** — процес, у якому React «оживляє» готовий серверний HTML: створює дерево компонентів, проходить ним паралельно з наявним DOM, **перевикористовує** DOM-вузли (а не створює нові) і чіпляє обробники подій. У Next.js це робить сам фреймворк через `hydrateRoot` з `react-dom/client`; тобі його викликати не треба.

Ключова вимога: **перший рендер у браузері має дати те саме, що дав сервер**. Сервер віддав `<button>… (0)</button>` — отже, `AddToCart` у браузері на першому рендері теж мусить повернути `(0)`. Під час hydration React не «малює» — він **звіряє**. Якщо результат відрізняється, це **hydration mismatch** — розбіжність між серверним HTML і першим клієнтським рендером.

Що React 19 робить при mismatch:

- **У `next dev`** пише «Hydration failed because the server rendered text didn't match the client», показує diff з `+` (клієнт) і `-` (сервер) і список типових причин.
- **Відновлюється**: викидає серверний DOM до найближчої межі `<Suspense>` (або всього кореня) і рендерить це піддерево на клієнті з нуля. Користувач бачить «блимання»: серверний текст змінюється на клієнтський.
- **У продакшні** пише мініфіковане `Minified React error #418` у консоль. Сторінка працює, тож помилку легко пропустити — її видно лише в консолі чи в системі моніторингу.

Ціна mismatch — не лише попередження. Клієнтський перерендер піддерева коштує часу (гірший INP на старті), викидає DOM, а з ним — зміни, які внесли inline-скрипти, і може зламати фокус чи прокрутку. Тож ставимось до mismatch як до бага.

### 💥 Як виглядає mismatch

Найкоротший спосіб його отримати — гілка за середовищем:

```tsx
// components/where.tsx
'use client'

export function Where() {
  // ❌ сервер і браузер дають різний текст
  return <p>Рендер: {typeof window === 'undefined' ? 'сервер' : 'браузер'}</p>
}
```

У `next dev` 16.3.8 зʼявляється червоний значок «1 Issue», а в оверлеї — **Recoverable Error**:

```text
Hydration failed because the server rendered text didn't match the client. As a result this tree will be
regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
```

Нижче — шматок дерева компонентів до місця розбіжності і два рядки: `+ браузер` (що відрендерив клієнт) і `- сервер` (що було в HTML), плюс посилання на файл `components/where.tsx`. Читай diff знизу вгору: останній компонент над `<p>` — `Where` — і є підозрюваним. Імена на кшталт `InnerLayoutRouter`, `SegmentViewNode` — внутрішні компоненти Next.js, їх пропускай.

На продакшн-збірці (`next build && next start`) та сама сторінка показує в консолі лише:

```text
Uncaught Error: Minified React error #418; visit https://react.dev/errors/418?args[]=text&args[]= for the full message …
```

Посилання розшифровує номер: #418 — «Hydration failed because the server rendered … didn't match the client», а `args[]=text` каже, що розійшовся текст (буває й `HTML`, коли розійшлася структура). Шукати причину зручніше в `next dev`, де є diff і файл.

> [!quiz] Перевір себе: що побачить користувач?
> level: middle · type: output · id: nextjs-core-09-quiz-07
>
> Продакшн-збірка, прямий захід на сторінку з компонентом `Where` вище. Що буде в `<p>` через секунду після завантаження і що в консолі?
>
> - [ ] `Рендер: сервер`; консоль чиста — React перевіряє лише структуру, а не текст
> - [x] `Рендер: браузер`; у консолі `Minified React error #418`
> - [ ] `Рендер: сервер`; у консолі `#418`, але React лишає серверний текст
> - [ ] Біла сторінка: mismatch у продакшні — фатальна помилка
>
> **Пояснення:** HTML приходить з «сервер». Під час hydration React бачить інший текст, кидає recoverable error (#418 у продакшні) і перерендерює піддерево на клієнті — тож лишається «браузер». Сторінка не падає, але користувач бачить, як текст змінюється.

### 🧪 Типові причини

| Причина | Приклад | Чому розходиться |
|---|---|---|
| Гілка за середовищем | `typeof window === 'undefined' ? … : …` у тілі | на сервері `window` немає, у браузері є |
| Мінливі значення | `Math.random()`, `Date.now()`, `crypto.randomUUID()` у рендері | два виклики — два різні результати |
| Локаль і часовий пояс | `toLocaleString()`, `Intl.DateTimeFormat()` без явних параметрів | сервер (часто `TZ=UTC`, `en-US`) і браузер користувача форматують по-різному |
| Браузерне сховище | `localStorage.getItem('theme')` у ініціалізаторі `useState` | на сервері сховища немає |
| Невалідна вкладеність HTML | `<div>` у `<p>`, `<a>` у `<a>`, `<tr>` без `<tbody>` | HTML-парсер браузера «лагодить» DOM, і він уже не збігається з деревом React |
| Розширення браузера | Grammarly, перекладачі, менеджери паролів додають атрибути до `<body>` чи вузли | DOM змінено до hydration |
| Зовнішні дані без знімка | Client Component сам читає мінливі дані (кеш, глобальна змінна) | сервер і браузер побачили різний стан |

Про невалідну вкладеність React попереджає окремо. Для `<p><div>…</div></p>` у Server Component `next dev` пише в консоль:

```text
In HTML, <div> cannot be a descendant of <p>.
This will cause a hydration error.
```

і слідом — «Hydration failed because the server rendered HTML didn't match the client». Браузер, розбираючи HTML, закриває `<p>` перед `<div>`, тож у DOM зʼявляються два сусідні вузли замість вкладених. Зверни увагу: тут винен навіть не Client Component — mismatch можливий і в Server Component, бо React звіряє з DOM **результат з payload**.

**Cache Components ловлять частину причин ще до браузера.** Під `cacheComponents: true` Client Component з `Math.random()` чи `new Date()` поза `<Suspense>` не пройде prerender. `next dev` і `next build` 16.3.8 пишуть:

```text
Error: Route "/lucky": Next.js encountered the unstable value `Math.random()` in a Client Component.

This value would be evaluated during the prerender, instead of recomputed on each visit.

Ways to fix this:
  - [stream] Wrap the Client Component in `<Suspense fallback={...}>`
  - [defer] Move the read into a `useEffect` or event handler
```

Для `new Date()` текст той самий, з `` `new Date()` `` і третьою порадою `[measure]` про `performance.now()`; `next build` зупиняється з `Error occurred prerendering page "/clock"`.

А що з порадою `[stream]`? Обгортка в `<Suspense>` прибирає помилку, але поводиться по-різному в двох режимах:

- **`next dev`** рендерить межу на сервері під час запиту, тож значення рахується двічі — на сервері й у браузері. Сервер дав `69`, браузер `76`, і React пише той самий «Hydration failed…».
- **Продакшн-збірка** позначає маршрут як `○`: межа не пререндериться, у HTML лише fallback, а `Lucky` рендериться вже в браузері. Mismatch і `#418` немає, але й числа в HTML немає — пошуковик і користувач без JS побачать тільки fallback.

Тобто `<Suspense>` тут не лікує, а переносить рендер на клієнт, причому в dev ти все одно бачиш mismatch. Надійно працює порада `[defer]`: значення читається в ефекті, перший рендер однаковий усюди.

> [!warning] Документація радить «перенести в Client Component»
> [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) (крок «Fix synchronous IO») пропонує для `new Date()`, `Math.random()` і `crypto.randomUUID()` обгорнути частину в `<Suspense>` з `connection()` «or move it into a Client Component». На 16.3.8 Client Component з таким викликом у рендері поза `<Suspense>` так само не проходить prerender — помилка вище. Переносити виклик треба в `useEffect` чи обробник події.

> [!quiz] Перевір себе: що зробить next build?
> level: senior · type: output · id: nextjs-core-09-quiz-08
>
> `cacheComponents: true`. Сторінка без `<Suspense>` рендерить:
>
> ```tsx
> // components/lucky.tsx
> 'use client'
>
> export function Lucky() {
>   return <p>Щасливе число: {Math.floor(Math.random() * 100)}</p>
> }
> ```
>
> - [x] Збірка впаде: Next.js encountered the unstable value `Math.random()` in a Client Component
> - [ ] Збірка пройде, а в браузері буде hydration mismatch
> - [ ] Збірка пройде без проблем: Client Components не пререндеряться
> - [ ] Збірка пройде, число «заморозиться» в HTML і в браузері збігатиметься
>
> **Пояснення:** Client Components теж пререндеряться в static shell, і Cache Components не дає «заморозити» мінливе значення в HTML. Без Cache Components збірка пройшла б, а сторінка мала б mismatch при кожному заході. Обгортка в `<Suspense>` прибере помилку збірки, але в `next dev` дасть mismatch, а в продакшні винесе число з HTML (рендер лише в браузері). Виправлення — `useEffect`.

### 🛠️ Як виправляти: від кращого до гіршого

**1. Зроби рендер детермінованим.** Найкраще, коли значення приходить **ззовні** однаковим для сервера й браузера: як prop із Server Component, як параметр маршруту, як ISO-рядок замість «зараз». Наприклад, дата публікації — це дані, а не `new Date()` у рендері. Форматування з явними `timeZone` і локаллю (`toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })`) дає однаковий результат усюди — якщо це прийнятно для продукту.

**2. Значення, відоме лише в браузері, — після hydration.** Перший рендер дає «нейтральне» значення (те саме, що на сервері), ефект потім підставляє справжнє:

```tsx
// components/browser-only.tsx
'use client'

import { useEffect, useState } from 'react'

export function ScreenWidth() {
  const [width, setWidth] = useState<number | null>(null)
  useEffect(() => setWidth(window.innerWidth), [])
  return <p>Ширина екрана: {width ?? '…'}</p>
}
```

Сервер віддає `Ширина екрана: …`, hydration проходить чисто, потім ефект ставить `1024`. Ціна — коротке «блимання» плейсхолдера.

**3. `useSyncExternalStore` з серверним знімком.** Хук приймає дві функції знімка: `getSnapshot` для браузера і `getServerSnapshot` для сервера **і для hydration**. React сам використає серверний знімок під час hydration і одразу після неї перерендерить з клієнтським — без mismatch і без ручного `useEffect`:

```tsx
// components/local-time.tsx
'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

export function LocalTime({ iso }: { iso: string }) {
  const text = useSyncExternalStore(
    subscribe,
    () => new Date(iso).toLocaleString(), // браузер: локаль і часовий пояс користувача
    () => new Date(iso).toISOString().slice(0, 16).replace('T', ' ') + ' UTC', // сервер і hydration
  )
  return <time dateTime={iso}>{text}</time>
}
```

У HTML — `2026-06-15 18:00 UTC`, у браузері з київським часом — `15.06.2026, 21:00:00`, помилок немає. Цей самий прийом підходить для `navigator.onLine`, `matchMedia` чи власного store: `subscribe` тоді справді підписується на зміни.

> [!quiz] Перевір себе: заповни пропуски у безпечному годиннику
> level: senior · type: fill · bank: useEffect, getSnapshot, 'use server' · id: nextjs-core-09-quiz-09
>
> ```tsx fill
> // components/local-time.tsx
> [['use client'|"use client"]]
>
> import { [[useSyncExternalStore]] } from 'react'
>
> const subscribe = () => () => {}
>
> export function LocalTime({ iso }: { iso: string }) {
>   const text = useSyncExternalStore(
>     subscribe,
>     () => new Date(iso).toLocaleString(),
>     // цей знімок React візьме на сервері й під час [[hydration]]
>     () => new Date(iso).toISOString(),
>   )
>   return <time [[dateTime]]={iso}>{text}</time>
> }
> ```
>
> **Пояснення:** хук потрібен клієнтському компоненту, тож директива першим рядком. Третій аргумент — `getServerSnapshot`: React використовує його і на сервері, і під час hydration, тому перший клієнтський рендер збігається з HTML. Атрибут `dateTime` дає машиночитну дату незалежно від показаного тексту. `useEffect` теж розвʼязав би задачу, але з ручним станом; `'use server'` тут ні до чого.

**4. `suppressHydrationWarning` — для очікуваних різниць.** Атрибут на елементі каже React: «текст і атрибути саме цього елемента можуть відрізнятися — не сварись і не перерендерюй». React 19 лишає **те, що в DOM** (тобто серверне значення), і відкидає клієнтський результат для цього елемента:

```tsx
// components/suppress.tsx
'use client'

export function Stamp() {
  return <p suppressHydrationWarning>Згенеровано: {typeof window === 'undefined' ? 'сервер' : 'браузер'}</p>
}
```

Після hydration на сторінці лишається «Згенеровано: сервер». Обмеження: діє **на один рівень** — лише на власний текст і атрибути елемента, не на дочірні елементи. Це не спосіб «вимкнути помилки», а позначка для різниць, які ти контролюєш: типово `<html suppressHydrationWarning>`, коли inline-скрипт ставить `data-theme`, або дата, яку виправляє inline-скрипт.

**5. Inline-скрипт до першого малювання.** Для теми, локальної дати, збереженого стану акордеона документація радить скрипт, що виконується синхронно під час розбору HTML і виправляє DOM до першого малювання, плюс `suppressHydrationWarning` на цьому елементі. Так немає ні mismatch, ні «блимання». Повні приклади — у гайді [Preventing flash before hydration](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration); там же пояснено, чому для клієнтської навігації компонент має бути клієнтським (вставлені React скрипти не виконуються).

**6. `dynamic(…, { ssr: false })` — не рендерити на сервері зовсім.** Для компонента, що за природою браузерний (карта, редактор, графік на `canvas`, бібліотека, яка чіпає `window` при імпорті):

```tsx
// components/map-loader.tsx — ✅ Client Component
'use client'

import dynamic from 'next/dynamic'

const MapWidget = dynamic(() => import('./map-widget'), {
  ssr: false,
  loading: () => <p>Завантаження карти…</p>,
})

export function MapLoader() {
  return <MapWidget />
}
```

Сервер віддає лише `<p>Завантаження карти…</p>`, а `MapWidget` рендериться після завантаження свого чанка в браузері. Головне правило: **`ssr: false` працює лише в Client Component.** У Server Component збірка (і `next dev`) падає з:

```text
Error: `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
```

Тому для серверної сторінки роблять маленьку клієнтську обгортку, як `MapLoader` вище. Ціна `ssr: false` — вміст не потрапляє в HTML: його не бачить пошуковик, і він зʼявляється пізніше. Для тексту і важливого контенту це поганий вибір.

> [!quiz] Перевір себе: що робить suppressHydrationWarning?
> level: senior · id: nextjs-core-09-quiz-10
>
> ```tsx
> <p suppressHydrationWarning>
>   {time}
>   <span>{random}</span>
> </p>
> ```
>
> `time` і `random` на сервері й у браузері різні. Що станеться під час hydration?
>
> - [ ] Обидві різниці приховано: атрибут діє на все піддерево
> - [x] Попередження для `time` немає, але mismatch у `<span>` змусить React перерендерити піддерево — і `time` теж стане клієнтським
> - [ ] `time` лишиться серверним, а `<span>` тихо отримає клієнтське значення
> - [ ] Атрибут вимикає hydration для `<p>`, тож обробники всередині не працюватимуть
>
> **Пояснення:** `suppressHydrationWarning` діє лише на один рівень — власний текст і атрибути `<p>`. `<span>` — окремий елемент, його текст звіряється як завжди, і розбіжність там — справжній mismatch. React перерендерює піддерево на клієнті, тож серверне значення `time` теж зникає: у продакшні весь `<p>` покаже клієнтські значення і в консолі буде `#418`. Сам по собі атрибут лишає DOM, але лише доки поруч немає іншого mismatch.

### 🔦 Інструменти пошуку

- **Оверлей `next dev`** — перше місце: тип помилки (Recoverable Error), diff `+ Client` / `- Server` і файл з рядком. Значок «N Issues» внизу зліва відкриває всі помилки сторінки.
- **Консоль браузера** — те саме текстом, з повним шматком дерева компонентів; зручно копіювати в issue.
- **`view-source:` або `curl`** — серверна версія: що було в HTML **до** будь-якого JS. Порівнюй із DevTools → Elements, де вже стан після hydration.
- **React DevTools** — дерево компонентів із props: допомагає знайти, який компонент рендерить проблемне місце, і перевірити, які props він отримав з payload.
- **Розширення** — перевір у вікні інкогніто без розширень: якщо mismatch зник, винне розширення, а не код.
- **Різні локаль і пояс** — документація радить запускати dev з налаштуваннями, відмінними від браузера, наприклад `TZ=UTC LANG=ja_JP.UTF-8 next dev`, щоб ловити дати рано.
- **Продакшн-моніторинг** — помилки `#418` у Sentry чи аналогах групуй за URL: так знайдеш сторінки, де mismatch бачать реальні користувачі (і розширення теж).

### 🌊 Selective hydration і Suspense

Без `<Suspense>` React гідратує всю сторінку **одним блокуючим проходом**: доки не пройде все дерево, жоден обробник не працює, і головний потік зайнятий. Кожна межа `<Suspense>` — **окрема одиниця hydration**. Це дає **selective hydration**:

- частини гідратуються незалежно, щойно приходять їхній HTML і payload (зі стрімінгом — у будь-якому порядку);
- робота ділиться на дрібні задачі, що поступаються браузеру: менше довгих задач, кращий INP;
- якщо користувач клікнув у ще не гідратовану межу, React **підвищує її пріоритет** і гідратує першою;
- mismatch усередині межі перерендерює лише її, а не всю сторінку.

Як розставляти межі, що відбувається з порядком стрімінгу і як це повʼязано з `loading.tsx` — тема 11 основного посібника.

### 🏭 Як це роблять у продакшні

- **Дивляться payload на код-рев'ю великих сторінок.** `next build` і перегляд `.next/server/app/<маршрут>.rsc` (або Network → `_rsc` → Response) — найшвидший спосіб помітити зайві поля чи цілі обʼєкти в props.
- **DTO на межі — правило, а не порада.** Шар даних повертає мінімальні обʼєкти для UI; повні моделі не доходять до Client Components ні через props, ні через контекст.
- **Бюджет розміру.** Для важливих сторінок команди стежать за розміром HTML і RSC-відповідей у CI (Lighthouse CI, власний скрипт на `curl | wc -c`), щоб регресію помітили до релізу.
- **Mismatch — баг з пріоритетом.** У dev оверлей не ігнорують; у продакшні `Minified React error #418` збирають моніторингом і розбирають за сторінками.
- **Дати й локаль — централізовано.** Один компонент `LocalTime`/`LocalDate` (`useSyncExternalStore` або inline-скрипт) замість `toLocaleString()` по всьому коду; сервери працюють у `TZ=UTC`.
- **Тема без «блимання»** — inline-скрипт у `<head>` і `suppressHydrationWarning` на `<html>`, а не читання cookie в root layout (воно зробило б динамічним увесь застосунок).
- **`ssr: false` — точково.** Лише для справді браузерних віджетів (карти, редактори), завжди через клієнтську обгортку і з `loading`, що тримає місце (без CLS).

## ⚠️ Пастки

> [!pitfall] typeof window у тілі компонента
> Сервер і браузер дають різний результат — гарантований mismatch. Значення з браузера — в ефекті або через `useSyncExternalStore`.
>
> ```tsx
> 'use client'
> export const Where = () => <p>{typeof window === 'undefined' ? 'сервер' : 'браузер'}</p> // ❌
> ```

> [!pitfall] Suspense як «ліки» від unstable value
> З Cache Components `<Suspense>` прибирає помилку prerender для `Math.random()`/`new Date()` у Client Component. Але в `next dev` межа рендериться на сервері й дає mismatch, а в продакшні не пререндериться зовсім — у HTML лише fallback. Виправлення — `useEffect` (порада `[defer]` з тексту помилки).

> [!pitfall] suppressHydrationWarning на обгортці
> Атрибут діє на один рівень: на `<div>` над проблемним `<span>` він нічого не приховає. І він лишає серверне значення — якщо тобі потрібне клієнтське, це не той інструмент.
>
> ```tsx
> <div suppressHydrationWarning>
>   <span>{Date.now()}</span> {/* ❌ усе одно mismatch */}
> </div>
> ```

> [!pitfall] <div> усередині <p>
> HTML-парсер закриває `<p>` перед блоковим елементом, і DOM розходиться з деревом React — навіть у Server Component. Для обгортки тексту з блоками бери `<div>`.
>
> ```tsx
> <p>Опис <div>Гейзерна кавоварка</div></p> // ❌ In HTML, <div> cannot be a descendant of <p>
> ```

> [!pitfall] ssr: false у серверній сторінці
> `next/dynamic` з `ssr: false` у Server Component зупиняє збірку. Винеси `dynamic(...)` у файл з `'use client'`.
>
> ```tsx
> // app/page.tsx — ❌ `ssr: false` is not allowed with `next/dynamic` in Server Components
> const MapWidget = dynamic(() => import('@/components/map-widget'), { ssr: false })
> ```

> [!pitfall] Увесь обʼєкт у props «бо TypeScript дозволяє»
> Тип-надмножина підходить, і компілятор мовчить. А payload несе всі поля — розмір росте, а приватні поля опиняються у вихідному коді сторінки.
>
> ```tsx
> <BuyBox product={product} /> // ❌ 8403 байти payload, costPrice у HTML
> <BuyBox product={{ title: product.title, price: product.price }} /> // ✅ 4085 байт
> ```

> [!pitfall] Логіка на форматі payload
> Парсити `self.__next_f` чи `.rsc` у своєму коді (аналітика, «витягнути дані зі сторінки») — шлях до поломки при оновленні React. Формат не є публічним API.

## 🎤 На співбесіді

> [!interview] Що відбувається, коли користувач уперше відкриває сторінку App Router, і чим це відрізняється від кліку по Link?
> level: middle · frequency: дуже часто · id: nextjs-core-09-int-01
>
> ---
>
> Перший захід: сервер рендерить Server Components у RSC payload — дерево з їхнім результатом, посиланнями на модулі Client Components і props. З payload і коду Client Components будується HTML; браузер отримує його разом з inline-payload (`self.__next_f.push`) і тегами JS-чанків, одразу показує сторінку, потім завантажує JS і робить hydration. Клік по `Link`: HTML не потрібен, роутер бере payload з Client Cache або запитом `?_rsc=` з `RSC: 1` (`text/x-component`), рендерить нові Client Components у браузері без hydration, а спільні layouts лишаються змонтованими.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🏗️ Перший захід крок за кроком|Розділ: перший захід]] · [Next.js: How Server and Client Components work](https://nextjs.org/docs/app/getting-started/server-and-client-components#how-do-server-and-client-components-work-in-nextjs) · [Next.js: Streaming](https://nextjs.org/docs/app/guides/streaming)

> [!interview] Що таке RSC payload і що в ньому лежить? Чи доводилось тобі його читати?
> level: senior · frequency: часто · id: nextjs-core-09-int-02
>
> ---
>
> Серіалізоване дерево (протокол Flight): результат Server Components як елементи `["$", тип, key, props]`, посилання на клієнтські модулі рядками `I[модуль, [чанки], "експорт"]` і `"$L…"` у місці використання, props для Client Components, Promise-и (`"$@…"`) для стрімінгу. Читати можна в `.next/server/app/<маршрут>.rsc`, у Network (`?_rsc=`, Response) або в HTML у `self.__next_f.push`. Корисно для налагодження: побачити, які props і скільки даних реально їдуть у браузер. Формат — деталь реалізації React, логіку на ньому не будують.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🔎 Читаємо справжній payload|Розділ: читаємо payload]] · [Next.js: Glossary — RSC Payload](https://nextjs.org/docs/app/glossary#rsc-payload) · [React: Server Components](https://react.dev/reference/rsc/server-components)

> [!interview] Чому дані сторінки приходять двічі — у HTML і в payload? Чи можна від цього позбутися?
> level: senior · frequency: іноді · id: nextjs-core-09-int-03
>
> ---
>
> HTML — для миттєвого показу й пошуковиків, payload — для React: межі компонентів, props і посилання на клієнтський код, без яких неможлива ні hydration, ні подальше оновлення дерева без втрати стану. Повністю прибрати дублювання не можна, але можна його зменшити: передавати Client Components лише потрібні поля (DTO), проводити межу `'use client'` нижче, рендерити довгі списки частинами, довантажувати рідко потрібне. Стиснення зменшує трафік, але не час розбору.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🧬 Payload усередині HTML: self.__next_f|Розділ: payload у HTML]] · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security#passing-data-from-server-to-client)

> [!interview] У продакшні в консолі Minified React error #418. Як знайдеш і виправиш причину?
> level: senior · frequency: часто · id: nextjs-core-09-int-04
>
> ---
>
> #418 — hydration mismatch: перший клієнтський рендер не збігся з HTML. Відтворюю сторінку в `next dev`: оверлей дасть diff `+ Client / - Server` і компонент. Перевіряю типові причини: `typeof window`, `Date.now()`/`Math.random()`, `toLocaleString()` без явної локалі й поясу, `localStorage` у рендері, невалідну вкладеність, розширення (інкогніто). Виправлення за пріоритетом: детермінований рендер (значення з сервера як prop), `useSyncExternalStore` з `getServerSnapshot` або `useEffect` для браузерних значень, inline-скрипт + `suppressHydrationWarning` для теми й дат без блимання, `dynamic(…, { ssr: false })` у Client Component для суто браузерних віджетів.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🛠️ Як виправляти: від кращого до гіршого|Розділ: як виправляти]] · [React: hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot) · [Next.js: Preventing flash before hydration](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration)

> [!interview] Що дає Suspense для hydration?
> level: senior · frequency: іноді · id: nextjs-core-09-int-05
>
> ---
>
> Кожна межа `<Suspense>` — окрема одиниця hydration. Без меж React гідратує сторінку одним блокуючим проходом. З межами — selective hydration: частини гідратуються незалежно, щойно приходять (зі стрімінгом), робота ділиться на дрібні задачі, а межу, з якою взаємодіє користувач, React гідратує першою. Mismatch усередині межі перерендерює лише її. Це покращує INP і час до першої інтерактивності.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🌊 Selective hydration і Suspense|Розділ: selective hydration]] · [Next.js: Streaming — Web Vitals](https://nextjs.org/docs/app/guides/streaming) · [React: Suspense](https://react.dev/reference/react/Suspense)

## 🔗 Звʼязки

- [[Next.js - 07. Server і Client Components]] — що де виконується, DTO і витоки через props.
- [[Next.js - 08. Межа use client]] — серіалізація props і `children`: те, що формує payload.
- [[Next.js - 04. Навігація під капотом]] — prefetch, Client Cache, заголовки `RSC`, `Next-Router-State-Tree`, `_rsc` і soft/hard navigation.
- [[Server Components]] і [[use client]] — довідник React.
- Далі в курсі: тема 10 основного посібника — статичний і динамічний рендеринг (коли `.rsc` створюється на збірці, а коли на запит), 11 — streaming і `<Suspense>` (рядки `"$@…"`, порядок частин), 12 — Partial Prerendering і static shell.

## ⚡ Фішки

> [!reel] 🧾 Одна сторінка — два описи
> У HTML кожен текст із Server Components їде двічі: як розмітка і як рядок RSC payload у `self.__next_f.push`. Розмітка — для очей, payload — для React.

> [!reel] 🔗 Client Component у payload — це адреса, а не код
> Рядок `5:I[17278,[…"chunk.js"],"AddToCart"]` каже, де лежить код. У дереві на його місці — `"$L5"` і props. Сам код приходить окремим JS-чанком.

> [!reel] 📡 Навігація без HTML
> Навігація просить не HTML, а payload: `GET /page?_rsc=…` з `RSC: 1`, відповідь `text/x-component`. `curl -H 'RSC: 1'` поверне той самий текст, що лежить у `.next/server/app/page.rsc`.

> [!reel] 🎲 Suspense не лікує Math.random
> З Cache Components `<Suspense>` знімає помилку prerender, але в `next dev` дає hydration mismatch, а в продакшні просто прибирає вміст з HTML — у ньому лише fallback. Лікує `useEffect`.

> [!reel] 🤫 suppressHydrationWarning лишає сервер
> React 19 при прихованій різниці зберігає те, що в DOM, тобто серверне значення. І діє атрибут лише на один рівень.

> [!reel] 🗺️ ssr: false — тільки в Client Component
> У Server Component `next/dynamic` з `ssr: false` зупиняє збірку. Потрібна маленька обгортка з `'use client'`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що таке hydration?
> *дуже часто · теорія* · `nextjs-core-09-card-01`
>
> Процес, у якому React «оживляє» серверний HTML: відтворює дерево компонентів, перевикористовує готові DOM-вузли й чіпляє обробники подій. До hydration сторінку видно, але кнопки не реагують.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#💧 Hydration у React 19|Розділ: hydration]] · [Next.js: Glossary — Hydration](https://nextjs.org/docs/app/glossary#hydration)

> [!question]- Що браузер отримує при першому заході на сторінку App Router?
> *часто · теорія* · `nextjs-core-09-card-02`
>
> Один HTML-документ: готова розмітка, теги `<script src>` для JS-чанків Client Components і рантайму, та inline-скрипти `self.__next_f.push(…)` з RSC payload.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🏗️ Перший захід крок за кроком|Розділ: перший захід]] · [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load)

> [!question]- Що таке hydration mismatch?
> *дуже часто · теорія* · `nextjs-core-09-card-03`
>
> Розбіжність між HTML із сервера і першим рендером у браузері. React пише помилку (у продакшні — `Minified React error #418`) і перерендерює піддерево на клієнті, тож користувач бачить «блимання».
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#💥 Як виглядає mismatch|Розділ: mismatch]] · [React: hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

> [!question]- Назви чотири типові причини hydration mismatch
> *дуже часто · практика* · `nextjs-core-09-card-04`
>
> `typeof window` у рендері; `Math.random()`/`Date.now()`; дата чи число в локалі сервера (`toLocaleString()`); невалідна вкладеність HTML (`<div>` у `<p>`). Ще — розширення браузера і `localStorage` у рендері.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🧪 Типові причини|Розділ: типові причини]] · [React: hydration mismatch](https://react.dev/link/hydration-mismatch)

### 🟡 Middle

> [!question]- Що приходить з сервера при кліку по Link?
> *дуже часто · теорія* · `nextjs-core-09-card-05`
>
> Лише RSC payload змінених сегментів — запит `GET …?_rsc=` із заголовком `RSC: 1`, відповідь `text/x-component` (або нічого, якщо все вже в Client Cache). HTML не потрібен: Client Components рендеряться в браузері, hydration немає.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🧭 Клієнтська навігація: тільки payload|Розділ: навігація]] · [Next.js: Streaming — component payload](https://nextjs.org/docs/app/guides/streaming#the-component-payload)

> [!question]- Як виправити mismatch для значення, відомого лише в браузері (ширина вікна, localStorage)?
> *часто · код* · `nextjs-core-09-card-06`
>
> Перший рендер дає нейтральне значення, як на сервері, а справжнє ставиться після hydration: `useEffect` + стан або `useSyncExternalStore` з `getServerSnapshot`.
>
> ```tsx
> const [width, setWidth] = useState<number | null>(null)
> useEffect(() => setWidth(window.innerWidth), [])
> ```
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🛠️ Як виправляти: від кращого до гіршого|Розділ: як виправляти]] · [React: useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)

> [!question]- Що робить suppressHydrationWarning і де його межі?
> *часто · теорія* · `nextjs-core-09-card-07`
>
> Приховує очікувану різницю в тексті й атрибутах **одного** елемента; React 19 лишає значення з DOM (серверне). На дочірні елементи не діє. Типове місце — `<html>` з темою від inline-скрипта.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🛠️ Як виправляти: від кращого до гіршого|Розділ: suppressHydrationWarning]] · [Next.js: Understanding suppressHydrationWarning](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration#understanding-suppresshydrationwarning)

> [!question]- Де можна використовувати dynamic(…, { ssr: false })?
> *часто · код* · `nextjs-core-09-card-08`
>
> Лише в Client Component. У Server Component збірка падає з `` `ssr: false` is not allowed with `next/dynamic` in Server Components ``. Рішення — обгортка з `'use client'`, що викликає `dynamic`.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🛠️ Як виправляти: від кращого до гіршого|Розділ: ssr: false]] · [Next.js: Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading)

### 🔴 Senior

> [!question]- Як у payload позначено Client Component?
> *іноді · теорія* · `nextjs-core-09-card-09`
>
> Окремим рядком `id:I[номер модуля, [JS-чанки], "експорт"]`, а в дереві — елементом з типом `"$L<id>"` і props четвертим елементом: `["$","$L5",null,{"productId":"p1"}]`. Коду компонента в payload немає. Формат — деталь реалізації React 19.3.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🔎 Читаємо справжній payload|Розділ: читаємо payload]] · [Next.js: How Server and Client Components work](https://nextjs.org/docs/app/getting-started/server-and-client-components#how-do-server-and-client-components-work-in-nextjs)

> [!question]- Чому дані сторінки дублюються в HTML і payload?
> *іноді · теорія* · `nextjs-core-09-card-10`
>
> HTML потрібен для швидкого показу, payload — для React: межі компонентів, props, посилання на клієнтський код. Без payload неможливі hydration і оновлення дерева без втрати стану. Зменшують дублювання DTO і нижча межа `'use client'`.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🧬 Payload усередині HTML: self.__next_f|Розділ: payload у HTML]] · [Next.js: Streaming](https://nextjs.org/docs/app/guides/streaming)

> [!question]- Як Cache Components повʼязані з hydration mismatch?
> *рідко · практика* · `nextjs-core-09-card-11`
>
> Client Component з `Math.random()`/`new Date()` поза `<Suspense>` не проходить prerender: «Next.js encountered the unstable value … in a Client Component». `<Suspense>` знімає помилку, але в `next dev` лишається mismatch, а в продакшні вміст зникає з HTML (лише fallback). Справжнє виправлення — читання в `useEffect`.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🧪 Типові причини|Розділ: Cache Components]] · [Next.js: Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)

> [!question]- Що таке selective hydration?
> *іноді · теорія* · `nextjs-core-09-card-12`
>
> Гідратація по межах `<Suspense>` окремо: частини оживають незалежно, робота ділиться на дрібні задачі, межу під кліком React гідратує першою, mismatch перерендерює лише свою межу. Без меж — один блокуючий прохід.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🌊 Selective hydration і Suspense|Розділ: selective hydration]] · [Next.js: Streaming](https://nextjs.org/docs/app/guides/streaming)

> [!question]- Чому параметр _rsc у RSC-запиті не можна прибирати проксі чи CDN?
> *рідко · інфраструктура* · `nextjs-core-09-card-13`
>
> Це хеш заголовків запиту, що розрізняє варіанти відповіді (HTML і payload, різні prefetch) у кеші CDN. Без правильного значення сервер відповідає `307` на URL з правильним хешем, а кеш без `_rsc` у ключі може віддати HTML на RSC-запит і зламати навігацію.
>
> 📚 [[Next.js - 09. Як рендериться маршрут, RSC payload і hydration#🧭 Клієнтська навігація: тільки payload|Розділ: навігація]] · [Next.js: CDN Caching](https://nextjs.org/docs/app/guides/cdn-caching)

## 🛠️ Практика

> [!task] Розбери спрощений RSC payload
> level: senior · difficulty: medium · id: nextjs-core-09-task-01 · tags: rsc-payload, flight, parsing
>
> Напиши `parsePayload(text)`, що розбирає **спрощений** payload і повертає `{ tree, clients }`. Формат (спрощено від справжнього Flight):
>
> - кожен непорожній рядок — `id:дані`; `id` — шістнадцяткове число до першої `:`;
> - якщо дані починаються з `I`, далі JSON `[модуль, [чанки], "експорт"]` — посилання на клієнтський модуль; він розгортається в `{ client: експорт, chunks }`;
> - інакше дані — JSON;
> - масив `["$", тип, key, props]` — елемент; розгорни його в `{ type, key, props }`;
> - рядок `"$undefined"` → `undefined`; рядок, що починається з `$$`, → той самий рядок без першого `$`; рядок `"$<hex>"` або `"$L<hex>"`, якщо такий рядок payload існує, → розгорнуте значення цього рядка (він може йти пізніше); будь-який інший рядок лишається як є;
> - `tree` — розгорнутий рядок `0`; `clients` — експорти клієнтських модулів, **використаних як тип елемента**, без повторів, у порядку першої появи при обході (ключі обʼєктів — у порядку JSON).
>
> ```ts
> parsePayload('5:I[17278,["a.js"],"AddToCart"]\n0:["$","$L5",null,{"price":2400}]')
> // → { tree: { type: { client: 'AddToCart', chunks: ['a.js'] }, key: null, props: { price: 2400 } }, clients: ['AddToCart'] }
> ```
>
> Задача на TypeScript: типи знімаються перед запуском, тести дивляться на значення.
>
> ```ts starter
> type ClientRef = { client: string; chunks: string[] }
>
> function parsePayload(text: string): { tree: unknown; clients: string[] } {
>   // твій код
>   return { tree: null, clients: [] }
> }
> ```
>
> ```ts tests
> test('будує дерево з HTML-елементів', () => {
>   const { tree, clients } = parsePayload('0:["$","main",null,{"children":["$","h1",null,{"children":"Кавоварка"}]}]\n')
>   expect(tree).toEqual({ type: 'main', key: null, props: { children: { type: 'h1', key: null, props: { children: 'Кавоварка' } } } })
>   expect(clients).toEqual([])
> })
>
> test('підставляє клієнтський компонент з рядка I', () => {
>   const text = [
>     '5:I[17278,["/_next/static/chunks/a.js","/_next/static/chunks/b.js"],"AddToCart"]',
>     '0:["$","$L5",null,{"productId":"p1","price":2400}]',
>   ].join('\n')
>   const { tree, clients } = parsePayload(text)
>   expect(tree).toEqual({
>     type: { client: 'AddToCart', chunks: ['/_next/static/chunks/a.js', '/_next/static/chunks/b.js'] },
>     key: null,
>     props: { productId: 'p1', price: 2400 },
>   })
>   expect(clients).toEqual(['AddToCart'])
> })
>
> test('у clients лише використані компоненти, кожен один раз, у порядку появи', () => {
>   const text = [
>     '2:I[1,[],"Link"]',
>     '3:I[2,[],"AddToCart"]',
>     '4:I[3,[],"Unused"]',
>     '0:["$","nav",null,{"children":[["$","$L3",null,{}],["$","$L2","a",{"href":"/"}],["$","$L3",null,{}]]}]',
>   ].join('\n')
>   expect(parsePayload(text).clients).toEqual(['AddToCart', 'Link'])
> })
>
> test('розгортає посилання на рядки, оголошені пізніше', () => {
>   const text = ['0:["$","ul",null,{"children":"$1"}]', '1:[["$","li","a",{"children":"$2"}]]', '2:"Чудова кавоварка"'].join('\n')
>   expect(parsePayload(text).tree).toEqual({
>     type: 'ul',
>     key: null,
>     props: { children: [{ type: 'li', key: 'a', props: { children: 'Чудова кавоварка' } }] },
>   })
> })
>
> test('розуміє $undefined і екранований $$', () => {
>   const { tree } = parsePayload('0:["$","p",null,{"title":"$undefined","children":"$$5 за каву"}]')
>   expect(tree).toEqual({ type: 'p', key: null, props: { title: undefined, children: '$5 за каву' } })
> })
>
> test('рядок з $, що не вказує на наявний рядок, лишається як є', () => {
>   const { tree } = parsePayload('0:["$","p",null,{"children":"$Sreact.fragment"}]')
>   expect(tree).toEqual({ type: 'p', key: null, props: { children: '$Sreact.fragment' } })
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу пройди всі рядки й склади `Map` «id → сирі дані», і лише потім розгортай рядок `0`. Тоді посилання на рядки, що йдуть пізніше, не проблема.
>
> > [!hint]- Підказка 2
> > Рекурсивна `resolve(value)`: рядок → перевір префікси (`$undefined`, `$$`, регулярка `/^\$L?([0-9a-f]+)$/`); масив з `'$'` на початку й довжиною 4 → елемент (тут і додавай імʼя в `clients`, якщо тип — клієнтський модуль); інший масив → `map`; обʼєкт → по ключах.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type ClientRef = { client: string; chunks: string[] }
> > type Row = { kind: 'client'; ref: ClientRef } | { kind: 'model'; value: unknown }
> >
> > function parsePayload(text: string): { tree: unknown; clients: string[] } {
> >   const rows = new Map<string, Row>()
> >   for (const line of text.split('\n')) {
> >     if (!line.trim()) continue
> >     const colon = line.indexOf(':')
> >     const id = line.slice(0, colon)
> >     const rest = line.slice(colon + 1)
> >     if (rest.startsWith('I')) {
> >       const [, chunks, name] = JSON.parse(rest.slice(1))
> >       rows.set(id, { kind: 'client', ref: { client: name, chunks } })
> >     } else {
> >       rows.set(id, { kind: 'model', value: JSON.parse(rest) })
> >     }
> >   }
> >
> >   const clients: string[] = []
> >
> >   function row(id: string): unknown {
> >     const r = rows.get(id)!
> >     return r.kind === 'client' ? r.ref : resolve(r.value)
> >   }
> >
> >   function resolveString(s: string): unknown {
> >     if (s === '$undefined') return undefined
> >     if (s.startsWith('$$')) return s.slice(1)
> >     const m = /^\$L?([0-9a-f]+)$/.exec(s)
> >     if (m && rows.has(m[1])) return row(m[1])
> >     return s
> >   }
> >
> >   function resolve(value: unknown): unknown {
> >     if (typeof value === 'string') return resolveString(value)
> >     if (Array.isArray(value)) {
> >       if (value.length === 4 && value[0] === '$') {
> >         const type = resolve(value[1])
> >         if (type && typeof type === 'object' && 'client' in type) {
> >           const name = (type as ClientRef).client
> >           if (!clients.includes(name)) clients.push(name)
> >         }
> >         return { type, key: value[2], props: resolve(value[3]) }
> >       }
> >       return value.map(resolve)
> >     }
> >     if (value && typeof value === 'object') {
> >       const out: Record<string, unknown> = {}
> >       for (const [k, v] of Object.entries(value)) out[k] = resolve(v)
> >       return out
> >     }
> >     return value
> >   }
> >
> >   return { tree: row('0'), clients }
> > }
> > ```
> >
> > Справжній клієнт React робить те саме потоково: рядки приходять частинами, а посилання на ще не отриманий рядок стає «чекаючим» значенням, тож React може показати fallback `<Suspense>` і домалювати пізніше. Спрощення: немає типів `H`, `E`, Promise (`$@`), `Date`, `Map`/`Set` і бінарних даних; справжній рядок `I` у Next.js часто має порожнє імʼя експорту для CommonJS-модулів.

> [!task] Знайди місце hydration mismatch
> level: senior · difficulty: medium · id: nextjs-core-09-task-02 · tags: hydration, mismatch, debugging
>
> Напиши `findMismatch(server, client)` — порівняй дерево з серверного HTML і дерево першого клієнтського рендера й поверни **першу** розбіжність або `null`. Вузол — рядок (текст) або `{ tag, attrs, children, suppressHydrationWarning? }`.
>
> Порядок перевірок для пари елементів (обхід у глибину, діти зліва направо):
>
> 1. різний `tag` → `{ path, kind: 'tag', server, client }` (значення — теги);
> 2. атрибути (обʼєднання імен за абеткою), перше різне значення → `{ path, kind: 'attr', attr, server, client }` (відсутній — `undefined`);
> 3. різна кількість дітей → `{ path, kind: 'children', server: n, client: m }`;
> 4. діти попарно: два тексти, що різняться → `{ path, kind: 'text', server, client }` (шлях — **батьківського** елемента); текст проти елемента → `kind: 'tag'`, текст позначається як `'#text'`; два елементи → рекурсія.
>
> `suppressHydrationWarning: true` на **клієнтському** вузлі пропускає кроки 2 і текстові розбіжності його власних дітей (крок 4), але не дочірні елементи. Шлях: корінь — його тег, дитина — `' > ' + тег + '[індекс серед усіх дітей]'`, наприклад `main > p[1]`, `section > #text[0]`.
>
> ```js starter
> function findMismatch(server, client) {
>   // твій код
> }
> ```
>
> ```js tests
> const el = (tag, attrs, children, extra = {}) => ({ tag, attrs, children, ...extra })
>
> test('однакові дерева — null', () => {
>   const tree = el('main', {}, [el('h1', {}, ['Кавоварка']), el('p', { class: 'price' }, ['2400 ₴'])])
>   expect(findMismatch(tree, tree)).toBe(null)
> })
>
> test('знаходить різний текст і шлях до батьківського елемента', () => {
>   const server = el('main', {}, [el('h1', {}, ['Кавоварка']), el('p', {}, ['Рендер: ', 'сервер'])])
>   const client = el('main', {}, [el('h1', {}, ['Кавоварка']), el('p', {}, ['Рендер: ', 'браузер'])])
>   expect(findMismatch(server, client)).toEqual({ path: 'main > p[1]', kind: 'text', server: 'сервер', client: 'браузер' })
> })
>
> test('знаходить різний атрибут, зокрема відсутній з одного боку', () => {
>   const server = el('body', {}, [el('main', { class: 'page' }, [])])
>   const client = el('body', { 'data-new-gr-c-s-check-loaded': '14.1' }, [el('main', { class: 'page' }, [])])
>   expect(findMismatch(server, client)).toEqual({
>     path: 'body', kind: 'attr', attr: 'data-new-gr-c-s-check-loaded', server: undefined, client: '14.1',
>   })
> })
>
> test('різний тег або текст замість елемента — kind tag', () => {
>   const server = el('section', {}, [el('p', {}, ['Опис'])])
>   const client = el('section', {}, [el('div', {}, ['Опис'])])
>   expect(findMismatch(server, client)).toEqual({ path: 'section > p[0]', kind: 'tag', server: 'p', client: 'div' })
>   const s2 = el('section', {}, ['Опис'])
>   const c2 = el('section', {}, [el('b', {}, ['Опис'])])
>   expect(findMismatch(s2, c2)).toEqual({ path: 'section > #text[0]', kind: 'tag', server: '#text', client: 'b' })
> })
>
> test('різна кількість дітей — kind children', () => {
>   const server = el('ul', {}, [el('li', {}, ['a'])])
>   const client = el('ul', {}, [el('li', {}, ['a']), el('li', {}, ['b'])])
>   expect(findMismatch(server, client)).toEqual({ path: 'ul', kind: 'children', server: 1, client: 2 })
> })
>
> test('suppressHydrationWarning ховає текст і атрибути лише цього елемента', () => {
>   const server = el('p', { title: 'a' }, ['сервер', el('b', {}, ['1'])], { suppressHydrationWarning: true })
>   const client = el('p', { title: 'b' }, ['браузер', el('b', {}, ['2'])], { suppressHydrationWarning: true })
>   expect(findMismatch(server, client)).toEqual({ path: 'p > b[1]', kind: 'text', server: '1', client: '2' })
> })
> ```
>
> > [!hint]- Підказка 1
> > Рекурсивна `compare(s, c, path)` повертає розбіжність або `null`; з циклу по дітях виходь одразу, щойно рекурсія щось знайшла.
>
> > [!hint]- Підказка 2
> > `suppressHydrationWarning` не передається вглиб: обчисли `quiet` для поточного вузла й використовуй його лише для атрибутів і текстових дітей. Тест з `<b>` ловить рішення, яке «глушить» усе піддерево.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function findMismatch(server, client) {
> >   function label(node, i) {
> >     const name = typeof node === 'string' ? '#text' : node.tag
> >     return `${name}[${i}]`
> >   }
> >
> >   function compare(s, c, path) {
> >     if (s.tag !== c.tag) return { path, kind: 'tag', server: s.tag, client: c.tag }
> >     const quiet = c.suppressHydrationWarning === true
> >
> >     if (!quiet) {
> >       const names = [...new Set([...Object.keys(s.attrs), ...Object.keys(c.attrs)])].sort()
> >       for (const name of names) {
> >         if (s.attrs[name] !== c.attrs[name]) {
> >           return { path, kind: 'attr', attr: name, server: s.attrs[name], client: c.attrs[name] }
> >         }
> >       }
> >     }
> >
> >     if (s.children.length !== c.children.length) {
> >       return { path, kind: 'children', server: s.children.length, client: c.children.length }
> >     }
> >
> >     for (let i = 0; i < s.children.length; i++) {
> >       const a = s.children[i]
> >       const b = c.children[i]
> >       const childPath = `${path} > ${label(a, i)}`
> >       if (typeof a === 'string' && typeof b === 'string') {
> >         if (a !== b && !quiet) return { path, kind: 'text', server: a, client: b }
> >         continue
> >       }
> >       if (typeof a === 'string' || typeof b === 'string') {
> >         return {
> >           path: childPath,
> >           kind: 'tag',
> >           server: typeof a === 'string' ? '#text' : a.tag,
> >           client: typeof b === 'string' ? '#text' : b.tag,
> >         }
> >       }
> >       const found = compare(a, b, childPath)
> >       if (found) return found
> >     }
> >     return null
> >   }
> >
> >   return compare(server, client, server.tag)
> > }
> > ```
> >
> > Так само міркує React: іде деревом, звіряє тег, атрибути й текст і зупиняється на першій розбіжності, яку показує як `+ Client / - Server`. Тест з атрибутом `data-new-gr-c-s-check-loaded` — справжній атрибут, який додає до `<body>` розширення Grammarly. Спрощення: React порівнює з уже розібраним DOM (після «лагодження» невалідної вкладеності) і для атрибутів у dev лише попереджає, а не перерендерює.

> [!task] Посади payload на дієту
> level: middle · difficulty: medium · id: nextjs-core-09-task-03 · tags: rsc-payload, dto, performance
>
> Сторінка передає в Client Component увесь обʼєкт. Напиши `payloadDiet(props, used)`, що допоможе зібрати DTO. `used` — шляхи полів, які компонент справді використовує (`'title'`, `'seller.name'`). Поверни `{ total, dto, saved, unused }`:
>
> - розмір значення — байти UTF-8 від `JSON.stringify(value)` (`new TextEncoder().encode(…).length`); кирилиця важить 2 байти на літеру;
> - `total` — розмір `props`;
> - `dto` — обʼєкт лише з полями з `used` (вкладені обʼєкти перебудовуються; шлях, якого немає в `props`, ігноруй; шлях на обʼєкт бере його цілком);
> - `saved` — `total` мінус розмір `dto`;
> - `unused` — **найвищі** невикористані шляхи `{ path, bytes }`: якщо в обʼєкт не веде жоден шлях з `used`, він потрапляє в список цілком, без своїх полів; сортування за `bytes` спаданням, при рівності — за `path` за абеткою. У масиви не заходь.
>
> ```ts starter
> type Unused = { path: string; bytes: number }
> type Report = { total: number; dto: Record<string, unknown>; saved: number; unused: Unused[] }
>
> function payloadDiet(props: Record<string, unknown>, used: string[]): Report {
>   // твій код
>   return { total: JSON.stringify(props).length, dto: props, saved: 0, unused: [] }
> }
> ```
>
> ```ts tests
> const product = {
>   id: 'p1',
>   title: 'Кава',
>   price: 2400,
>   seller: { name: 'Оля', email: 'olya@example.com', iban: 'UA00' },
>   reviews: [{ author: 'u1', text: 'Чудово' }],
> }
>
> test('рахує байти UTF-8, а не символи', () => {
>   const report = payloadDiet({ title: 'Кава' }, ['title'])
>   expect(report.total).toBe(20)
>   expect(report.saved).toBe(0)
>   expect(report.unused).toEqual([])
> })
>
> test('DTO містить лише використані поля, зокрема вкладені', () => {
>   const { dto } = payloadDiet(product, ['title', 'price', 'seller.name'])
>   expect(dto).toEqual({ title: 'Кава', price: 2400, seller: { name: 'Оля' } })
> })
>
> test('unused — найвищі невикористані шляхи, від найбільшого', () => {
>   const { unused } = payloadDiet(product, ['title', 'price', 'seller.name'])
>   expect(unused).toEqual([
>     { path: 'reviews', bytes: 39 },
>     { path: 'seller.email', bytes: 18 },
>     { path: 'seller.iban', bytes: 6 },
>     { path: 'id', bytes: 4 },
>   ])
> })
>
> test('saved = total мінус розмір DTO', () => {
>   const report = payloadDiet(product, ['title', 'price', 'seller.name'])
>   const dtoBytes = new TextEncoder().encode(JSON.stringify(report.dto)).length
>   expect(report.saved).toBe(report.total - dtoBytes)
>   expect(report.saved > 0).toBe(true)
> })
>
> test('шлях на весь обʼєкт бере його цілком, неіснуючий — ігнорує', () => {
>   const report = payloadDiet(product, ['seller', 'rating'])
>   expect(report.dto).toEqual({ seller: { name: 'Оля', email: 'olya@example.com', iban: 'UA00' } })
>   expect(report.unused.map((u) => u.path)).toEqual(['reviews', 'title', 'id', 'price'])
> })
> ```
>
> > [!hint]- Підказка 1
> > Розмір: `const bytes = (v: unknown) => new TextEncoder().encode(JSON.stringify(v)).length`. `JSON.stringify(v).length` рахує символи, а не байти, — перший тест це ловить.
>
> > [!hint]- Підказка 2
> > Для `unused` обходь обʼєкт рекурсивно: шлях є в `used` — пропусти; якщо якийсь шлях з `used` починається з `шлях + '.'` і значення — простий обʼєкт, іди всередину; інакше додай шлях у список.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Unused = { path: string; bytes: number }
> > type Report = { total: number; dto: Record<string, unknown>; saved: number; unused: Unused[] }
> >
> > const bytes = (value: unknown): number => new TextEncoder().encode(JSON.stringify(value)).length
> >
> > const isPlainObject = (v: unknown): v is Record<string, unknown> =>
> >   typeof v === 'object' && v !== null && !Array.isArray(v)
> >
> > function payloadDiet(props: Record<string, unknown>, used: string[]): Report {
> >   const dto: Record<string, unknown> = {}
> >   for (const path of used) {
> >     const keys = path.split('.')
> >     let from: unknown = props
> >     for (const key of keys) from = isPlainObject(from) ? from[key] : undefined
> >     if (from === undefined) continue
> >     let to = dto
> >     keys.slice(0, -1).forEach((key) => {
> >       if (!isPlainObject(to[key])) to[key] = {}
> >       to = to[key] as Record<string, unknown>
> >     })
> >     to[keys[keys.length - 1]] = from
> >   }
> >
> >   const unused: Unused[] = []
> >   function walk(obj: Record<string, unknown>, prefix: string) {
> >     for (const [key, value] of Object.entries(obj)) {
> >       const path = prefix ? `${prefix}.${key}` : key
> >       if (used.includes(path)) continue
> >       if (isPlainObject(value) && used.some((u) => u.startsWith(path + '.'))) walk(value, path)
> >       else unused.push({ path, bytes: bytes(value) })
> >     }
> >   }
> >   walk(props, '')
> >   unused.sort((a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path))
> >
> >   const total = bytes(props)
> >   return { total, dto, saved: total - bytes(dto), unused }
> > }
> > ```
> >
> > Це груба, але чесна модель: справжній payload — не чистий JSON (є префікси `$`, ключі рядків, екранування в HTML), проте пропорції ті самі. На сторінці товару з розділу про розмір payload такий звіт першим рядком показав би `reviews` — і DTO `{ title, price }` зменшив `.rsc` з 8403 до 4085 байт.

## 📚 Джерела та що почитати

- 🟢 [Next.js — Server and Client Components: how they work](https://nextjs.org/docs/app/getting-started/server-and-client-components#how-do-server-and-client-components-work-in-nextjs) — що в RSC payload, перший захід і навігація.
- 🟡 [Next.js — Streaming](https://nextjs.org/docs/app/guides/streaming) — HTML-потік, component payload у `self.__next_f.push`, selective hydration.
- 🟡 [Next.js — Preventing flash before hydration](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration) — дати, теми, `suppressHydrationWarning`, inline-скрипти.
- 🟡 [Next.js — Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading) — `next/dynamic` і `ssr: false` лише в Client Components.
- 🔴 [Next.js — CDN Caching](https://nextjs.org/docs/app/guides/cdn-caching) — заголовок `rsc`, `Vary`, параметр `_rsc`, `.rsc`-шляхи.
- 🟢 [Next.js — Glossary](https://nextjs.org/docs/app/glossary#rsc-payload) — RSC Payload, Hydration, Prerendering.
- 🔴 [React — hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot) — hydration, mismatch, `suppressHydrationWarning`, різний вміст на клієнті.
- 🟡 [React — useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore) — `getServerSnapshot` для hydration.
- 🔴 [React — Server Components](https://react.dev/reference/rsc/server-components) — модель RSC від React.
- 🛠️ [React — Error decoder #418](https://react.dev/errors/418) — розшифровка мініфікованої помилки hydration.

> [!important] Підсумок
> - Рендер маршруту дає три артефакти: **RSC payload** (дерево з результатом Server Components, посиланнями на клієнтські модулі й props), **HTML** (лише для першого заходу) і **JS-чанки** Client Components.
> - Перший захід: payload → HTML → браузер показує сторінку, payload вбудований як `self.__next_f.push(…)` → JS → hydration. Навігація: `GET …?_rsc=` з `RSC: 1`, відповідь `text/x-component` — лише payload, без HTML і hydration.
> - Рядки payload — `id:ТИП дані`: `I[…]` — клієнтський модуль, `["$", тип, key, props]` — елемент, `"$L5"` — посилання на рядок. Формат — деталь реалізації React, читаємо для налагодження.
> - Дані в HTML і payload дублюються свідомо. Розмір payload ростуть props Client Components — передавай DTO.
> - Hydration вимагає, щоб перший клієнтський рендер збігся з HTML. Mismatch (`#418` у продакшні) лікують детермінованим рендером, `useEffect`/`useSyncExternalStore`, inline-скриптом із `suppressHydrationWarning` або `dynamic(…, { ssr: false })` у Client Component.

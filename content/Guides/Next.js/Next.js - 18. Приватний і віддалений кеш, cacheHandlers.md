---
title: Приватний і віддалений кеш, cacheHandlers
id: nextjs-core-18
slug: 18-private-remote-cache
order: 18
level: god
skill: data
icon: px:database
tags: [nextjs, cache-components, use-cache-private, use-cache-remote, cache-handlers, self-hosting, redis, security]
prerequisites: ["[[Next.js - 15. Cache Components і use cache]]", "[[Next.js - 16. Ревалідація]]"]
estimatedMinutes: 60
nextVersion: 16.3.8
---

# Приватний і віддалений кеш, cacheHandlers

> [!success] 🎯 Після цього розділу ти зможеш
> - для будь-якої cached-функції сказати, **де фізично живе** її результат: у памʼяті одного процесу, у спільному сховищі, лише в браузері чи ніде;
> - пояснити, що дозволяє `'use cache: private'` (`cookies()` усередині) і чого він **не** робить (не зберігає нічого на сервері між запитами);
> - вирішити, коли `'use cache: remote'` окупається, а коли це гроші й мілісекунди на вітер;
> - розрізнити `cacheHandler` (однина) і `cacheHandlers` (множина) і налаштувати обидва для self-hosting;
> - написати власний хендлер (`get`, `set`, `refreshTags`, `getExpiration`, `updateTags`) і перевірити його логами;
> - запустити кілька інстансів зі спільним кешем і ревалідацією тегів між ними;
> - знайти й закрити витік даних одного користувача іншому через спільний кеш.

## 🤔 Передбач

> [!quiz] Скільки разів виконається функція?
> level: senior · type: output · id: nextjs-core-18-quiz-01
>
> Продакшн-збірка, один інстанс `next start`. Сторінка викликає `getCurrentUser()` один раз за запит:
>
> ```tsx
> export async function getCurrentUser() {
>   'use cache: private'
>   cacheLife({ stale: 60 })
>   const id = (await cookies()).get('session')?.value
>   return db.user.findUnique({ where: { id } })
> }
> ```
>
> Оля тричі поспіль оновлює сторінку (F5). Скільки разів на сервері виконається функція (разом із запитом до БД)?
>
> - [ ] 1 раз: `private` — це кеш на кожного користувача, другий і третій запити беруть готове
> - [ ] 1 раз: `stale: 60` тримає результат на сервері 60 секунд
> - [x] 3 рази: по одному на кожен запит
> - [ ] 0 разів: `cookies()` усередині кешу заборонено, сторінка впаде
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `'use cache: private'` нічого не зберігає на сервері між запитами: функція виконується на кожен запит, навіть для тієї самої Олі. `stale` іде лише в Client Cache браузера. А `cookies()` заборонений у звичайному `'use cache'`; саме `private` його дозволяє.

## 🧒 Простими словами

Уяви мережу кавʼярень. У кожного баристи є **блокнот** біля каси: туди він записує популярні замовлення, щоб не питати рецепт щоразу. Це звичайний `'use cache'` з типовим хендлером: швидко, безкоштовно, але блокнот у кожного свій, а коли бариста йде додому (рестарт), записи зникають. Якщо менеджер скаже одному баристі «рецепт лате змінився», інші далі робитимуть старий.

Є **спільна дошка** в підсобці — `'use cache: remote'`. Її бачать усі бариста всіх змін, і поправка на дошці доходить до всіх. Але щоб глянути на дошку, треба відійти від каси: це час і місце, яке хтось оплачує.

А є **твоє особисте замовлення** — «як завжди, без цукру». Його не пишуть ні в блокнот, ні на дошку: бариста памʼятає його лише поки ти стоїш біля каси, а запамʼятовуєш ти сам. Це `'use cache: private'`: на сервері нічого не лишається, повторення — тільки в межах одного візиту і в браузері.

Найгірше, що може статися в кавʼярні, — бариста записав на спільну дошку «Оля: картка 4111…, без цукру», а наступний клієнт прочитав. Так виглядає витік даних через спільний кеш.

## 🔬 Як це працює насправді

### 🧭 Де живе кеш: три директиви, чотири місця

У [[Next.js - 15. Cache Components і use cache|темі 15]] ми вчилися **що** кешувати: файл, компонент чи функцію, з яким `cacheLife` і `cacheTag`. Тепер питання **де**. Next.js 16 має три директиви, і в кожної своє сховище:

| | `'use cache'` | `'use cache: remote'` | `'use cache: private'` |
|---|---|---|---|
| Де лежить на сервері | хендлер `default`: LRU у памʼяті процесу | хендлер `remote`: те, що ти налаштуєш | **ніде** |
| Хто ділить запис | усі користувачі одного інстансу | усі користувачі всіх інстансів | один запит + браузер одного клієнта |
| `cookies()` / `headers()` / `searchParams` усередині | ні, лише як аргументи | ні, лише як аргументи | так |
| Переживає рестарт процесу | ні | так, якщо сховище зовнішнє | — |
| Переживає деплой | ні | ні | — |
| Ціна | памʼять процесу | мережа, сховище, гроші | нічого |

Чотири місця, де може опинитися результат, від найкоротшого до найдовшого життя:

1. **Мемоізація в межах запиту.** Два виклики з однаковими аргументами в одному рендері виконуються один раз. Так поводяться всі три директиви, а також `fetch` і `React.cache` ([[Next.js - 14. Дані на сервері|тема 14]]).
2. **Client Cache у браузері.** Роутер тримає відрендерений RSC payload стільки, скільки дозволяє найкоротший `stale` серед записів маршруту. Не переживає перезавантаження вкладки.
3. **Памʼять інстансу.** Типовий хендлер `'use cache'`: живе, поки живе процес `next start`, і ділиться лише між запитами цього процесу.
4. **Спільне сховище.** Redis, Valkey, DynamoDB, KV платформи. Його бачать усі інстанси, і воно переживає рестарт.

> [!diagram] Шари кешу: хто що бачить
> ```yaml
> layout: stack
> nodes:
>   - { id: req, label: "один запит", text: "мемоізація викликів", note: "усі три директиви, fetch, React.cache", tone: gray, icon: "px:repeat" }
>   - { id: browser, label: "браузер одного клієнта", text: "Client Cache роутера", note: "живе stale секунд, до перезавантаження вкладки", tone: violet, icon: "px:monitor" }
>   - { id: mem, label: "памʼять одного інстансу", text: "'use cache' → хендлер default", note: "LRU 50 MB, зникає при рестарті", tone: blue, icon: "px:server" }
>   - { id: shared, label: "спільне сховище", text: "'use cache: remote' → хендлер remote", note: "бачать усі інстанси, коштує мережі", tone: green, icon: "px:database" }
> steps:
>   - { focus: req, note: "Найкоротший шар. Header і Sidebar викликали getMe() — функція виконалась один раз. Після відповіді цього шару вже немає." }
>   - { focus: browser, note: "Роутер тримає готовий payload сторінки для навігацій назад і вперед. 'use cache: private' живе саме тут і в шарі запиту — більше ніде." }
>   - { focus: mem, note: "'use cache' без налаштувань: Map з LRU у процесі next start. Кожен інстанс має свою копію, рестарт її стирає." }
>   - { focus: shared, note: "'use cache: remote' зі справжнім хендлером: запис бачать усі інстанси. Сюди не можна класти дані одного користувача без його id у ключі." }
> ```
> Чим нижче шар, тим довше живе запис і тим більше людей його бачить. Тим дорожча й помилка в ключі.

### 🧠 Типовий хендлер у памʼяті і його межі

Якщо `cacheHandlers` не налаштовано, Next.js бере вбудований хендлер для `default` і для `remote`: **LRU у памʼяті процесу**. Розмір задає `cacheMaxMemorySize`, типово 50 MB на інстанс. Так, `'use cache: remote'` без конфігу поводиться так само, як `'use cache'`: директива лише каже «візьми хендлер `remote`», а що за ним стоїть, вирішує конфіг або платформа.

Що з цього випливає, якщо запустити два `next start`:

- **Кожен інстанс має свій кеш.** Сторінка з `getStats()` під `'use cache'` на порту 3538 показала `at=21:09:23.269Z`, на порту 3539 — `at=21:09:23.406Z`. Дві копії «того самого» кешу з різними даними. За load balancer користувач бачить то одне, то інше.
- **Рестарт стирає все.** Після перезапуску інстансу перший запит знову виконав функцію.
- **Ревалідація локальна.** `revalidateTag('stats', { expire: 0 })` на 3538 оновив 3538, а 3539 і далі віддавав старе значення.
- **У serverless памʼять майже не живе.** Інстанс функції часто зникає після запиту, тож hit rate runtime-кешу низький. Відтворити це локально можна через `cacheMaxMemorySize: 0`: тоді `getStats()` виконується на кожен запит.
- **Протерміновані записи в продакшні не віддаються.** Вбудований хендлер у `next start` вважає запис відсутнім одразу після `revalidate` секунд, без stale-while-revalidate. У коментарі до коду пояснено чому: тримати застарілий запис у памʼяті, яку ось-ось витисне LRU, немає сенсу. Виняток — тег, позначений як stale через `revalidateTag(tag, 'max')`: тоді перший запит отримує старе, а у фоні рахується нове.

> [!note] Чому перший запит після збірки — промах
> `next build` теж викликає хендлер: під час prerender воркер збірки записав `getStats()` у свою Map і завершився. Runtime-процес стартує з порожньою памʼяттю, тож результат зі збірки до нього не доїжджає (у статичному shell він уже вшитий у HTML). Зі спільним сховищем збірка й runtime бачать ті самі записи. Ключ містить build ID, тож записи старої збірки новій не дістаються.

Чому тоді всі не ставлять Redis? Бо **більшість застосунків цього не потребує**. Документація каже це прямо. Вміст статичного shell рахується під час збірки, а Client Cache і prefetch працюють і без серверного кешу. Сам `'use cache'` теж корисний без серверних хітів: він каже Next.js, що можна вшити в shell і prefetch-ити, і задає `stale` для навігацій. Серверний runtime-кеш потрібен там, де щось **виконується на кожен запит**: у «дірках» за `Suspense`, що читають cookies чи `searchParams`, або після `connection()`.

> [!quiz] Що покаже інстанс B?
> level: senior · type: output · id: nextjs-core-18-quiz-03
>
> Одна збірка, два процеси `next start` (A на порту 3538, B на 3539), `cacheHandlers` не налаштовано. `getStats()` має `'use cache'` і `cacheTag('stats')`. Послідовність:
>
> 1. `GET A /stats` → `at=21:09:23.269Z`
> 2. `GET B /stats` → `at=21:09:23.406Z`
> 3. `POST A /api/revalidate`, всередині `revalidateTag('stats', { expire: 0 })`
> 4. `GET B /stats`
>
> Що в кроці 4?
>
> - [ ] Новий час: тег скинуто, B перерахує функцію
> - [ ] `at=21:09:23.269Z`: одна збірка, тож кеш спільний
> - [x] `at=21:09:23.406Z`: власне значення B, воно не змінилося
> - [ ] Старе значення лише один раз, а другий запит на B уже дасть новий час
>
> **Пояснення:** у вбудованого хендлера кеш і стан тегів живуть у памʼяті процесу. `revalidateTag` на A змінив тільки памʼять A, а `updateTags` викликався лише там. B не дізнається про інвалідацію ні з першого, ні з другого запиту, поки не спливе `revalidate` запису (вбудований хендлер у продакшні тоді викине його) або не буде рестарту.

### 🔒 'use cache: private' — кеш, якого немає на сервері

Звичайний `'use cache'` не можна поєднати з `cookies()`: у `next dev` маєш

```text
Error: Route /c1 used `cookies()` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use `cookies()` outside of the cached function and pass the required dynamic data in as an argument.
```

Повідомлення радить основний шлях: прочитати cookie зовні й передати значення аргументом. Коли це незручно (функція глибоко в шарі даних і сама читає сесію), є `'use cache: private'`. Усередині дозволено `cookies()`, `headers()` і `searchParams`, але не `connection()`:

```text
Error: Route /c3 used `connection()` inside "use cache: private". The `connection()` function is used to indicate the subsequent code must only run when there is an actual navigation request, but caches must be able to be produced before a navigation request, so this function is not allowed in this scope.
```

```tsx
// lib/data.ts
import { cacheLife } from 'next/cache'
import { cookies } from 'next/headers'

let privateRuns = 0
export async function getMe() {
  'use cache: private'
  cacheLife({ stale: 60 })
  privateRuns++
  const user = (await cookies()).get('user')?.value ?? 'guest'
  console.log(`[fn] getMe виконалась (усього ${privateRuns}) user=${user} pid=${process.pid}`)
  return { user, run: privateRuns }
}
```

```tsx
// app/private/page.tsx
import { Suspense } from 'react'
import { getMe } from '@/lib/data'

async function Header() {
  const me = await getMe()
  return <p id="h">header: {me.user} run={me.run}</p>
}
async function Sidebar() {
  const me = await getMe()
  return <p id="s">sidebar: {me.user} run={me.run}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>…</p>}>
      <Header />
      <Sidebar />
    </Suspense>
  )
}
```

Лог `next start` на чотири запити (`user=olya`, `user=ivan`, потім двічі `user=olya`):

```text
[fn] getMe виконалась (усього 1) user=olya
[fn] getMe виконалась (усього 2) user=ivan
[fn] getMe виконалась (усього 3) user=olya
[fn] getMe виконалась (усього 4) user=olya
```

На кожну сторінку Header і Sidebar показали однаковий `run`: у межах запиту виклики злилися в один. А між запитами функція виконувалась **щоразу**, навіть для тієї самої Олі. Жоден хендлер при цьому не викликався: у лозі немає ні `get`, ні `set`. Документація формулює так: збіги в межах одного запиту можуть перевикористати результат, але Next.js не зберігає його в серверному кеші між запитами.

Що тоді дає `private`, крім дозволу на `cookies()`:

- **Дедуплікацію в запиті.** Сесію можна читати в будь-якому компоненті без prop drilling. Можна й запустити функцію заздалегідь без `await` (preload-патерн, [[Next.js - 14. Дані на сервері|тема 14]]).
- **Client Cache.** `stale` з `cacheLife` іде в Client Cache маршруту. Якщо `stale` ≥ 30 с, працює per-link prefetching. Якщо ≥ 5 хв, вміст потрапляє в App Shell маршруту, і навігація стає миттєвою ([[Next.js - 12. Partial Prerendering і Cache Components|тема 12]]). Без `cacheLife` діє профіль `default` зі `stale` 5 хв.
- **Нічого на сервері.** Це плюс там, де вимоги забороняють зберігати певні дані на сервері навіть ефемерно.

Обмеження: хендлер для `private` не налаштовується взагалі, `'use cache: private'` не входить у статичний shell (виконується під час запиту, тож потребує `Suspense`), а відповідь має `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`. Це не особливість `private`: такий самий заголовок має будь-яка сторінка ◐ з діркою, що рахується під час запиту (у демо — і `/shared` з `connection()`).

> [!tip] Тільки дедуплікація, без впливу на Client Cache
> Next.js бере **найкоротший** `stale` серед записів маршруту. Якщо private-функції потрібна лише дедуплікація в запиті, постав `cacheLife({ stale: Infinity })`: вона не зменшить `stale` сторінки. На сервері від цього нічого не збережеться.

Коли **не** брати `private`: якщо дані можна закешувати на сервері за id користувача. Офіційний гайд з auth радить читати сесію в `private` (там є перевірка терміну дії токена, тобто залежність від часу), а дані, похідні від сесії, кешувати так: витягти `userId` і передати аргументом у звичайний `'use cache'` з тегом `notes-${userId}`. Тоді `updateTag` після мутації оновить саме цей запис.

> [!quiz] Що покажуть run і скільки разів виконається getMe?
> level: senior · type: output · id: nextjs-core-18-quiz-04
>
> ```tsx
> let privateRuns = 0
> export async function getMe() {
>   'use cache: private'
>   cacheLife({ stale: 60 })
>   privateRuns++
>   return { run: privateRuns }
> }
>
> // Header:  <p>header run={(await getMe()).run}</p>
> // Sidebar: <p>sidebar run={(await getMe()).run}</p>
> ```
>
> `next start`, один процес, Іван двічі відкриває сторінку (запити йдуть один за одним, лічильник стартує з нуля). Що побачить Іван і скільки разів виконається `getMe`?
>
> - [ ] Усюди `run=1`: функція виконалась 1 раз, `private` кешує на користувача
> - [ ] `1` / `2`, потім `3` / `4`: функція виконалась 4 рази, по разу на кожен виклик
> - [x] `1` / `1`, потім `2` / `2`: функція виконалась 2 рази
> - [ ] Помилка: `private`-функцію не можна викликати двічі за один запит
>
> **Пояснення:** у межах запиту Header і Sidebar зливаються в один виклик: однаковий `run` у обох. Між запитами злиття немає, бо на сервері нічого не збережено, тож другий запит рахує `2`. Не «1 раз на користувача» і не «раз на виклик».

> [!quiz] Що правда про 'use cache: private'?
> level: senior · type: multi · id: nextjs-core-18-quiz-05
>
> - [x] Усередині можна викликати `cookies()`
> - [x] `connection()` усередині кидає помилку
> - [x] Він не входить у статичний shell, тому потрібен `Suspense`
> - [x] `stale` з `cacheLife` потрапляє в Client Cache маршруту
> - [ ] Його результат можна направити в Redis через `cacheHandlers`
> - [ ] Повторний запит того самого користувача бере результат із серверного кешу
>
> **Пояснення:** `cookies()`, `headers()` і `searchParams` дозволені, `connection()` — ні: кеш має вміти виробляти запис без реального навігаційного запиту. Хендлера для `private` не існує (не налаштовується), а між запитами на сервері нічого не лежить: тому ні Redis, ні серверних хітів.

### 🌐 'use cache: remote' — спільне сховище, коли воно окупається

`'use cache: remote'` каже: цей результат зберігай у хендлері `remote`. На Vercel та в адаптерах хендлер дає платформа. У self-hosting його підключаєш ти (далі в розділі), і тоді запис бачать усі інстанси й він переживає рестарт.

```tsx
// lib/data.ts
export async function getPrice(productId: string, currency: string) {
  'use cache: remote'
  cacheTag(`price-${productId}`)
  cacheLife({ expire: 3600 })
  console.log(`[fn] getPrice(${productId}, ${currency}) pid=${process.pid}`)
  return { productId, currency, price: 100, at: new Date().toISOString() }
}
```

```tsx
// app/remote/page.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getPrice } from '@/lib/data'

async function Price() {
  const currency = (await cookies()).get('currency')?.value ?? 'UAH'
  const p = await getPrice('42', currency)
  return <p id="price">{p.price} {p.currency} at={p.at}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>…</p>}>
      <Price />
    </Suspense>
  )
}
```

Тут видно класичний випадок для remote. `Price` читає cookie, тож виконується **на кожен запит**: вона в «дірці» за `Suspense`, а не в shell. `getPrice` при цьому не залежить від користувача, лише від пари «товар + валюта». Валют три-пʼять, тож кілька записів обслуговують мільйон відвідувачів. Зі спільним хендлером другий інстанс отримав `get HIT` на запис, який створив перший.

**Remote окупається**, коли:

- вміст рахується під час запиту (дірки за cookies/`searchParams`, код після `connection()`), а інстансів багато або вони ефемерні;
- upstream має rate limit чи квоту (CMS, платне API);
- база чи сервіс — вузьке місце під навантаженням, або запит дорогий (агрегація, звіт);
- сервіс нестабільний, і спільний запис згладжує збої.

**Не окупається**, коли:

- операція й так швидка (< 50 мс): похід у сховище коштує стільки ж;
- ключ майже унікальний на запит (фільтри ціни, пошуковий рядок, `userId`): hit rate близький до нуля, а сховище роздувається;
- дані змінюються щосекунди-щохвилини: записи протухають раніше, ніж їх прочитають;
- шар даних уже має свій KV перед БД.

Ключ проєктують за **виміром з малою кардинальністю**. Кешуй `getProductsByCategory(category)`, а фільтр `minPrice` застосовуй у памʼяті. Кешуй `getCMSContent(language)` на 10–50 мов, а не `getUserProfile(sessionId)` на кожного користувача.

> [!warning] Жоден use cache не переживає деплой
> Ключ запису починається з build ID (або `deploymentId`). У демо-застосунку ключ мав вигляд `["JjVolyEtctxoLyu1RlbON","e00131…",["42","EUR"]]`. Нова збірка дає новий перший елемент, і старі записи в Redis стають недосяжними. Це навмисно: між збірками могла змінитися форма результату. Для кешу між деплоями документація досі радить `fetch` cache або `unstable_cache`, хоч і називає `unstable_cache` заміненим. Це чесний компроміс: обирай свідомо. Самі вони зі сховища не зникнуть: TTL, рівний `expire`, не рятує, бо профіль `default` дає `expire: 4294967294` (≈ 136 років), а `'max'` — рік. Тому хендлер нижче обмежує TTL (`Math.min(expire, тиждень)`). Альтернатива — префікс ключів за build ID чи `deploymentId` і видалення старого префікса після деплою.

**Вкладення.** Документація дозволяє remote у remote і remote у звичайному `'use cache'`, але забороняє private у remote і remote у private. Private у remote справді падає, і текст помилки не згадує `remote`:

```text
Error: "use cache: private" must not be used within "use cache". It can only be nested inside of another "use cache: private".
```

> [!warning] Remote усередині private на 16.3.8 не падає
> [Документація](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote#nesting-rules) позначає `'use cache: remote'` усередині `'use cache: private'` як помилку (`// Error!`). На 16.3.8 і `next dev`, і `next start` такий код виконують без помилки: хендлер `remote` отримує `get`/`set`. Не будуй на цьому архітектуру. Поведінку можуть привести до документації в наступних версіях, а змішувати приватний шар зі спільним сховищем погано і з погляду безпеки.

> [!quiz] Де 'use cache: remote' окупається?
> level: senior · type: multi · id: nextjs-core-18-quiz-06
>
> - [x] Ціна товару за валютою в «дірці» за `cookies()`: пʼять валют обслуговують мільйон відвідувачів
> - [x] Контент із CMS, що має rate limit
> - [x] Дорога агрегація після `connection()`, інстансів багато
> - [ ] Пошук `getResults(query)` за довільним рядком користувача
> - [ ] Функція, що рахується за 10 мс
> - [ ] Профіль `getProfile(userId)`, бо remote «надійніший»
>
> **Пояснення:** remote платить мережею за кожен промах, тож потрібен малий ключовий простір і дорога операція. Довільний пошуковий рядок і `userId` дають майже унікальні ключі: hit rate біля нуля, сховище росте. 10 мс не варті походу в сховище, який коштує стільки ж.

### 🔌 cacheHandler і cacheHandlers — два різні ключі

Це найчастіша плутанина теми, бо назви відрізняються однією літерою:

| | `cacheHandler` (однина) | `cacheHandlers` (множина) |
|---|---|---|
| Що зберігає | prerendered сторінки (ISR, static shell), відповіді route handlers, оптимізовані зображення (з 16.2, з `images.customCacheHandler: true`), Pages Router | результати `'use cache'`, `'use cache: remote'`, `'use cache: <name>'` |
| Форма | один модуль, клас з `get`, `set`, `revalidateTag`, `resetRequestCache` | обʼєкт `{ default, remote, <name> }`, кожен — модуль з `get`, `set`, `refreshTags`, `getExpiration`, `updateTags` |
| Ключі | `/route-cache/APP_PAGE/<sha256 маршруту>/$/static` | `[buildId, functionId, [аргументи]]` |
| Тема курсу | [[Next.js - 17. ISR і CDN|17]], деплой — тема 43 основного посібника | ця |

Для кількох інстансів зазвичай потрібні **обидва**. Static shell і сторінки ISR кешує `cacheHandler`, результати функцій — `cacheHandlers`.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  // однина: сторінки (ISR), відповіді route handlers, оптимізовані зображення
  cacheHandler: require.resolve('./cache-handlers/incremental.js'),
  cacheMaxMemorySize: 0, // не тримати копію в памʼяті кожного інстансу
  // множина: директиви 'use cache' і 'use cache: <name>'
  cacheHandlers: {
    remote: require.resolve('./cache-handlers/shared.js'),
  },
}

export default nextConfig
```

> [!pitfall] cacheMaxMemorySize: 0 вимикає і типовий 'use cache'
> Документація `cacheHandler` радить ставити `cacheMaxMemorySize: 0`, щоб читання йшли у твоє сховище. Але та сама документація `cacheMaxMemorySize` прямо каже: параметр розмірює **обидва** вбудовані кеші, і `0` вимикає обидва — з власним `cacheHandler` чи без нього. У конфігу вище немає свого `default`, тож `'use cache'` лишився на вбудованому хендлері з розміром 0, і `getStats()` виконувалась на кожен запит. Або додай свій `default` у `cacheHandlers`, або не обнуляй памʼять.

Імена в `cacheHandlers` довільні: `sessions: require.resolve('./cache-handlers/sessions.js')` вмикає `'use cache: sessions'`. Директива з неоголошеним імʼям зупиняє збірку:

```text
Error: Unknown cache kind "redis". Please configure a cache handler for this kind in the `cacheHandlers` object in your Next.js config.
```

`next.config.ts` читається і під час `next build`, і під час `next start`. Тож змінні середовища, від яких залежить вибір хендлера, потрібні в обох середовищах.

> [!quiz] Заповни пропуски в next.config.ts
> level: senior · type: fill · bank: default, redis, incremental · id: nextjs-core-18-quiz-07
>
> ```ts fill
> const nextConfig = {
>   cacheComponents: true,
>   // ISR, відповіді route handlers, оптимізовані зображення
>   [[cacheHandler]]: require.resolve('./cache-handlers/incremental.js'),
>   // результати директив 'use cache' і 'use cache: <name>'
>   [[cacheHandlers]]: {
>     // імʼя хендлера для 'use cache: remote'
>     [[remote]]: require.resolve('./cache-handlers/shared.js'),
>   },
> }
> ```
>
> **Пояснення:** однина `cacheHandler` обслуговує сторінки (ISR, static shell), route handlers і зображення; множина `cacheHandlers` — обʼєкт іменованих хендлерів для директив. Імʼя ключа збігається з назвою після двокрапки: `remote` вмикає `'use cache: remote'`. Хендлер для `use cache` у `cacheHandler` (однина) просто не викликається.

### 🧩 Інтерфейс хендлера use cache

Хендлер для `cacheHandlers` — обʼєкт з пʼятьма асинхронними методами:

| Метод | Коли викликається | Що має зробити |
|---|---|---|
| `get(cacheKey, softTags)` | перед виконанням cached-функції | повернути `CacheEntry` або `undefined` (промах); перевірити `expire` і **явні** теги запису |
| `set(cacheKey, pendingEntry)` | після промаху, поки результат ще стрімиться | `await pendingEntry`, прочитати `value` (це `ReadableStream`), зберегти |
| `refreshTags()` | перед запитом, якому потрібен хендлер | підтягнути стан тегів зі спільного сховища в локальну копію |
| `getExpiration(tags)` | після `get`, з **soft tags** маршруту | повернути найсвіжіший час інвалідації цих тегів (мс), `0` або `Infinity` |
| `updateTags(tags, durations)` | при `revalidateTag`, `updateTag`, `revalidatePath` | записати інвалідацію (у спільне сховище, якщо інстансів кілька) |

`CacheEntry` — це `{ value, tags, stale, timestamp, expire, revalidate }`. `value` — потік байтів (серіалізований RSC-результат), `timestamp` — у мілісекундах, решта — у секундах. Для `cacheLife('hours')` хендлер отримав `revalidate: 3600, expire: 86400, stale: 300`. Для функції без `cacheLife` (профіль `default`) — `revalidate: 900, expire: 4294967294, stale: 300`, тобто запис майже ніколи не протухає сам.

Щоб побачити порядок викликів, у демо-застосунку стоїть логувальний хендлер на Map. Ось два запити на `/shared` (промах, потім хіт; ключ скорочено):

```text
[h:default] refreshTags
[h:default] get MISS ["hsjc…","8063…",[]] softTags= ["_N_T_/layout","_N_T_/shared/layout","_N_T_/shared/page","_N_T_/shared"]
[fn] getStats виконалась
[h:default] set called (pending) ["hsjc…","8063…",[]]
[h:default] set stored {"timestamp":1793394226721.7446,"revalidate":3600,"expire":86400,"stale":300,"tags":["stats"]} bytes= 56
[h:default] refreshTags
[h:default] get HIT ["hsjc…","8063…",[]] tags= ["stats"]
[h:default] getExpiration ["_N_T_/layout","_N_T_/shared/layout","_N_T_/shared/page","_N_T_/shared"] -> 0
```

> [!diagram] Запит через хендлер use cache
> ```yaml
> layout: flow
> nodes:
>   - { id: rt, label: "1 · refreshTags()", text: "синхронізувати теги", note: "зі спільного сховища", tone: gray, icon: "px:repeat" }
>   - { id: get, label: "2 · get(key, softTags)", text: "є запис?", note: "перевіряє expire і явні теги", tone: blue, icon: "px:magnifier" }
>   - { id: exp, label: "3 · getExpiration(softTags)", text: "revalidatePath був?", note: "лише якщо get знайшов запис", tone: violet, icon: "px:tag" }
>   - { id: run, label: "4 · виконати функцію", text: "промах або протух", tone: orange, icon: "px:bolt" }
>   - { id: set, label: "5 · set(key, pendingEntry)", text: "зберегти потік", note: "асинхронно, відповідь уже йде", tone: green, icon: "px:database" }
> edges:
>   - { from: rt, to: get }
>   - { from: get, to: exp, label: "HIT" }
>   - { from: exp, to: run, label: "якщо новіша за timestamp", dashed: true }
>   - { from: run, to: set }
> steps:
>   - { focus: rt, note: "Перед запитом Next.js просить хендлер оновити локальний стан тегів. Для Map — нічого, для Redis — прочитати інвалідації, зроблені іншими інстансами." }
>   - { move: { from: rt, to: get, value: "[buildId, fnId, args]" }, note: "Ключ — JSON з build ID, id функції й аргументів. Хендлер дивиться expire і явні теги запису; протух — повертає undefined." }
>   - { move: { from: get, to: exp, value: "_N_T_/shared" }, note: "Запис знайдено. Тепер Next.js питає про soft tags маршруту: якщо revalidatePath('/shared') був пізніше за timestamp запису, запис відкидається." }
>   - { focus: run, note: "Промах (або запис відкинуто): функція виконується. Користувач чекає саме на цей крок." }
>   - { move: { from: run, to: set, value: "Promise<CacheEntry>" }, note: "set отримує ще незавершений запис. Хендлер чекає його й читає потік. Помилка тут не ламає відповідь, просто запис не збережеться." }
> ```
> Явні теги (`cacheTag`) перевіряє твій `get`. Soft tags маршруту (`_N_T_…`) Next.js перевіряє сам через `getExpiration`, якщо той не повернув `Infinity`.

Що приходить в `updateTags` (спостереження на 16.3.8):

| Виклик | `tags` | `durations` |
|---|---|---|
| `revalidateTag('price-42', 'max')` | `["price-42"]` | `{ expire: 31536000 }` — позначити stale, протермінувати через рік |
| `revalidateTag('price-42', { expire: 0 })` | `["price-42"]` | `{ expire: 0 }` — протермінувати зараз |
| `updateTag('price-42')` у Server Action | `["price-42"]` | `undefined` — протермінувати зараз |
| `revalidatePath('/remote')` | `["_N_T_/remote"]` | `undefined` |

`updateTags` викликається на **кожному** хендлері з `cacheHandlers`, бо Next.js не знає, в якому з них лежать записи з цим тегом. Вбудований хендлер трактує `durations` так: тег одразу stale, `expired = now + expire`. Без `durations` тег протерміновано одразу. Саме так зʼявляється різниця між stale-while-revalidate і read-your-writes з [[Next.js - 16. Ревалідація|теми 16]].

Ще два правила з документації, які легко пропустити:

- **`get()` не має кидати помилку.** Next.js не обгортає його в `try/catch`, тож виняток стає помилкою рендера, а не промахом. Збій Redis = `return undefined`.
- **`refreshTags()` теж ловить свої помилки.** Інакше недоступне сховище валить кожен запит. Краще працювати зі старою локальною копією тегів.

> [!quiz] Склади порядок викликів хендлера: промах
> level: senior · type: order · id: nextjs-core-18-quiz-08
>
> Запит, якому потрібен результат `'use cache'` функції. Запису в хендлері ще немає. Склади виклики в порядку, як їх бачить хендлер.
>
> ```order
> refreshTags()
> get(cacheKey, softTags) → undefined
> виконується cached-функція
> set(cacheKey, pendingEntry)
> getExpiration(softTags) ✗
> ```
>
> **Пояснення:** спершу `refreshTags()`, потім `get`. Промах: функція виконується, і лише тоді `set` отримує ще незавершений запис (потік стрімиться). `getExpiration` на промаху не викликається: він питає про soft tags, лише коли `get` щось знайшов (хіт: `refreshTags` → `get HIT` → `getExpiration`).

> [!quiz] Що отримає updateTags?
> level: senior · type: single · id: nextjs-core-18-quiz-09
>
> Route handler викликає `revalidateTag('price-42', 'max')`. Хендлер із `cacheHandlers` має `updateTags(tags, durations)`. Що прийде другим аргументом?
>
> - [ ] `undefined`
> - [ ] `{ expire: 0 }`
> - [x] `{ expire: 31536000 }`
> - [ ] `{ expire: 'max' }`
>
> **Пояснення:** `'max'` Next.js розгортає в рік (31 536 000 с): тег одразу stale, а протермінується за `expire`. `undefined` приходить від `updateTag('price-42')` та `revalidatePath` (миттєве протермінування), `{ expire: 0 }` — від `revalidateTag(tag, { expire: 0 })`. Рядок `'max'` до хендлера не доходить.

### 🛠️ Свій хендлер: спільне сховище для кількох інстансів

Нижче — робочий хендлер для `remote`. Замість Redis у демо стоїть `kv.js` з файлами в спільному каталозі: обидва `next start` на одній машині бачать ті самі дані, як бачили б один Redis. Інтерфейс `kv` навмисно схожий на Redis (`get`/`set` за ключем), тож заміна — кілька рядків.

```js
// cache-handlers/kv.js — замінник Redis для демо: файли в спільному каталозі
const fs = require('node:fs/promises')
const path = require('node:path')

const DIR = process.env.KV_DIR ?? '/tmp/next-kv'
const file = (key) => path.join(DIR, Buffer.from(key).toString('base64url') + '.json')

module.exports = {
  async get(key) {
    try {
      const { value, deleteAt } = JSON.parse(await fs.readFile(file(key), 'utf8'))
      return deleteAt && Date.now() > deleteAt ? null : value // як EX у Redis
    } catch {
      return null
    }
  },
  async set(key, value, ttlSeconds) {
    await fs.mkdir(DIR, { recursive: true })
    const tmp = file(key) + '.' + process.pid
    const deleteAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined
    await fs.writeFile(tmp, JSON.stringify({ value, deleteAt }))
    await fs.rename(tmp, file(key)) // атомарний запис
  },
}
```

```js
// cache-handlers/shared.js — спільний хендлер для 'use cache: remote'
const kv = require('./kv') // у продакшні — клієнт Redis/Valkey

const TAGS_KEY = 'next:tags' // { [tag]: { stale?: number, expired?: number } }
let tags = {} // локальна копія, оновлюється в refreshTags()
// профіль default має expire ≈ 136 років, 'max' — рік: TTL у сховищі обмежуємо
const MAX_TTL = 7 * 24 * 60 * 60

const log = (...a) => console.log(`[remote pid=${process.pid}]`, ...a)

async function readAll(stream) {
  const chunks = []
  for await (const chunk of stream) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks)
}

module.exports = {
  async get(cacheKey, softTags) {
    try {
      const stored = await kv.get(`next:entry:${cacheKey}`)
      if (!stored) return log('get MISS'), undefined

      const now = Date.now()
      if (now > stored.timestamp + stored.expire * 1000) return log('get EXPIRED'), undefined

      let revalidate = stored.revalidate
      for (const tag of stored.tags) {
        const t = tags[tag]
        if (t?.expired && t.expired <= now && t.expired > stored.timestamp) {
          return log('get TAG EXPIRED', tag), undefined
        }
        if (t?.stale && t.stale > stored.timestamp) revalidate = -1 // віддати й оновити у фоні
      }
      log(revalidate === -1 ? 'get STALE (віддаю старе)' : 'get HIT')

      const buf = Buffer.from(stored.value, 'base64')
      return {
        ...stored,
        revalidate,
        value: new ReadableStream({
          start(c) {
            c.enqueue(new Uint8Array(buf))
            c.close()
          },
        }),
      }
    } catch (err) {
      log('get error', err) // помилка get() = промах, а не падіння рендера
      return undefined
    }
  },

  async set(cacheKey, pendingEntry) {
    const entry = await pendingEntry
    const buf = await readAll(entry.value)
    const { value, ...meta } = entry
    const ttl = Math.min(meta.expire, MAX_TTL) // записи старих деплоїв зникнуть за тиждень
    await kv.set(`next:entry:${cacheKey}`, { ...meta, value: buf.toString('base64') }, ttl)
    log('set', JSON.stringify(meta.tags), `${buf.length} B`)
  },

  async refreshTags() {
    try {
      tags = (await kv.get(TAGS_KEY)) ?? {}
    } catch (err) {
      log('refreshTags error', err) // працюємо зі старою копією тегів
    }
  },

  async getExpiration(softTags) {
    // soft tags (_N_T_/…) — від revalidatePath; явні теги перевіряє get()
    return Math.max(0, ...softTags.map((t) => tags[t]?.expired ?? 0))
  },

  async updateTags(updated, durations) {
    log('updateTags', JSON.stringify(updated), JSON.stringify(durations))
    const now = Date.now()
    const all = (await kv.get(TAGS_KEY)) ?? {}
    for (const tag of updated) {
      all[tag] = durations
        ? { stale: now, expired: durations.expire !== undefined ? now + durations.expire * 1000 : undefined }
        : { expired: now }
    }
    await kv.set(TAGS_KEY, all)
    tags = all
  },
}
```

Розбір рішень, які тут не випадкові:

- **Повний ключ без змін.** `cacheKey` іде в сховище цілим, з префіксом простору імен. Не обрізай і не «нормалізуй» його: аргументи стоять у кінці ключа, і обрізаний ключ склеїть записи різних аргументів (про це — у розділі про безпеку).
- **Stale через `revalidate = -1`.** Так робить і вбудований хендлер: запис віддається, а Next.js у фоні рахує новий і викликає `set`. Це і є stale-while-revalidate для `revalidateTag(tag, 'max')`.
- **Теги — окремо від записів.** `updateTags` не шукає записи за тегом (у Redis це `SCAN` по всьому простору ключів). Він пише час інвалідації, а `get` порівнює його з `timestamp` запису. Записи, яких більше ніхто не прочитає, прибирає TTL, обмежений `MAX_TTL`: `expire` профілю `default` ≈ 136 років, а `revalidateTag(tag, 'max')` дає рік.
- **`getExpiration` повертає лише `expired`.** Next.js відкидає запис, якщо час, який повернув `getExpiration`, новіший за `timestamp`. Тобто це жорсткий промах. Якби метод повертав і час stale, кожен soft tag зі статусом stale давав би промах замість stale-while-revalidate. Вбудований хендлер теж повертає тільки `expired`.
- **`TAGS_KEY` одним JSON — лише для демо.** Два інстанси, що одночасно оновлюють різні теги, можуть затерти один одного (read-modify-write). У Redis тримай кожен тег окремим ключем або полем хеша (`HSET next:tags <tag> <json>`). Документація показує той самий підхід з `SET tag:<tag>` і множиною `revalidated-tags`.
- **Тільки `remote`.** Звичайний `'use cache'` лишився в памʼяті інстансу: дешеві записи для shell і швидких даних. У Redis ідуть лише ті функції, які ти явно позначив.

> [!quiz] Redis недоступний, get() кидає виняток
> level: senior · type: single · id: nextjs-core-18-quiz-10
>
> Власний хендлер у `cacheHandlers.remote` читає зі сховища: `get` виконує `await redis.get(key)` без `try/catch`. Сховище впало. Що зробить Next.js?
>
> - [ ] Вважатиме це промахом: виконає функцію і спробує зробити `set`
> - [ ] Віддасть попередню копію з памʼяті й оновить у фоні
> - [x] Поверне помилку рендера: виняток із `get` не обгорнутий у `try/catch`
> - [ ] Один раз повторить `get`, а потім перерахує функцію
>
> **Пояснення:** `get()` має сам перетворювати збій на промах: `catch { return undefined }`. Next.js виняток не перехоплює, тож недоступний Redis кладе кожну сторінку, яка з ним працює. Так само `refreshTags()` має ловити помилки і працювати зі старою локальною копією тегів.

### 🖥️ Кілька інстансів: перевіряємо на двох next start

Збираємо застосунок один раз і запускаємо два процеси з одного `.next`: це модель двох контейнерів за load balancer.

```bash
npm run build
npx next start -p 3538 &
npx next start -p 3539 &
```

**Без спільного хендлера** (вбудований LRU) результат ти вже бачив: різні значення на різних портах, ревалідація лише там, куди прийшов виклик.

**Зі `shared.js` для `remote`** сторінка `/remote` поводиться інакше. Перший запит на 3538 — `get MISS`, функція виконалась, `set`. Перший запит на 3539 — одразу `get HIT`: запис зі сховища, обидва показали `at=21:05:37.771Z`. Далі ревалідація через route handler на 3538:

```ts
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag')
  const path = searchParams.get('path')
  const mode = searchParams.get('mode')
  if (path) revalidatePath(path)
  else if (tag && mode === 'now') revalidateTag(tag, { expire: 0 })
  else if (tag) revalidateTag(tag, 'max')
  return Response.json({ ok: true, tag, path, mode, pid: process.pid })
}
```

> [!note] Демо-ендпоінт без захисту
> Цей route handler існує лише для експерименту в демо-застосунку. Справжній ендпоінт ревалідації перевіряє секрет або підпис вебхука ([[Next.js - 16. Ревалідація|тема 16]]).

```text
POST :3538/api/revalidate?tag=price-42            → [remote pid=A] updateTags ["price-42"] {"expire":31536000}
GET  :3539/remote  at=21:05:37.771Z (старе)        → [remote pid=B] get STALE (віддаю старе) → getPrice виконалась у фоні → set
GET  :3539/remote  at=21:05:46.975Z (нове)         → [remote pid=B] get HIT
POST :3538/api/revalidate?tag=price-42&mode=now   → [remote pid=A] updateTags ["price-42"] {"expire":0}
GET  :3539/remote  at=21:05:48.042Z (одразу нове)  → [remote pid=B] get TAG EXPIRED price-42
```

`updateTags` викликався лише на A, бо `revalidateTag` прийшов туди. B дізнався про інвалідацію через `refreshTags()` перед своїм запитом. Без цих двох методів на спільному сховищі B віддавав би старе до кінця `expire`.

> [!diagram] Два інстанси: локальний кеш проти спільного
> ```yaml
> layout: compare
> columns: { local: "Типовий хендлер (памʼять)", shared: "Свій хендлер remote (спільне сховище)" }
> nodes:
>   - { id: l1, col: local, label: "запит на A і на B", text: "дві копії: A — 23.269, B — 23.406", note: "кожен виконав функцію сам", tone: orange, icon: "px:server" }
>   - { id: l2, col: local, label: "revalidateTag на A", text: "оновився лише A", tone: yellow, icon: "px:tag" }
>   - { id: l3, col: local, label: "запит на B", text: "старе значення", note: "до кінця revalidate запису або рестарту", tone: red, icon: "px:warning" }
>   - { id: s1, col: shared, label: "запит на A, потім на B", text: "A: MISS → set; B: HIT", note: "одне значення 37.771", tone: green, icon: "px:database" }
>   - { id: s2, col: shared, label: "revalidateTag на A", text: "updateTags → сховище", note: "час інвалідації тегу", tone: blue, icon: "px:tag" }
>   - { id: s3, col: shared, label: "запит на B", text: "refreshTags → get STALE", note: "старе зараз, нове у фоні", tone: green, icon: "px:check" }
> steps:
>   - { show: [l1, s1], note: "Без спільного сховища кожен інстанс рахує й тримає свою копію. Зі спільним B читає запис, який створив A." }
>   - { show: [l2, s2], note: "Ревалідація приходить на A. Типовий хендлер змінює лише памʼять A. Свій хендлер пише інвалідацію в сховище." }
>   - { show: [l3, s3], note: "Запит на B. Ліворуч B нічого не знає. Праворуч refreshTags підтягнув тег, get побачив stale і віддав старе, а у фоні вже рахується нове." }
> ```
> Спільний кеш складається з двох частин: спільних записів і спільних тегів. Без другої інстанси бачать одні дані, але ревалідація все одно локальна.

Що ще треба для кількох інстансів, крім кешу (деталі — тема 43 основного посібника): той самий `deploymentId` або однаковий build ID у всіх контейнерах, бо від нього залежать ключі кешу, однаковий `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` для Server Actions, і `cacheHandler` (однина) для сторінок ISR. Sticky sessions не потрібні.

> [!quiz] Що покаже B після revalidateTag на A?
> level: techlead · type: output · id: nextjs-core-18-quiz-11
>
> Два інстанси на спільному `shared.js` (записи і теги в спільному сховищі, `refreshTags` читає теги). `price-42` закешовано, обидва показують `at=21:05:37.771Z`. На A: `revalidateTag('price-42', 'max')`. Потім два запити на B один за одним. Що покаже кожен?
>
> - [ ] Обидва `at=21:05:37.771Z`: B не дізнається про інвалідацію на A
> - [ ] Обидва нові: інвалідація одразу діє на всіх інстансах
> - [ ] Перший новий, другий теж новий, бо `'max'` примусово протермінувала запис
> - [x] Перший `21:05:37.771Z`, другий уже новий час
>
> **Пояснення:** `refreshTags` підтягує тег на B, а `'max'` означає stale-while-revalidate: `get` повертає `revalidate: -1`, перший запит отримує старе, а у фоні рахується нове. Другий запит бачить уже оновлений запис. З `{ expire: 0 }` перший запит одразу був би новим (`get TAG EXPIRED`), а без `refreshTags` B би не дізнався.

### 🛡️ Дані користувача і спільний кеш

Правило: **у спільний кеш (`'use cache'` і особливо `'use cache: remote'`) потрапляє лише те, що однаково для всіх, у кого збігається ключ.** Якщо результат залежить від користувача, id користувача має бути в ключі, тобто в аргументах. Або результат не має потрапляти в серверний кеш узагалі (`private` чи без кешу).

Next.js сам закриває найочевидніший шлях: `cookies()` і `headers()` усередині `'use cache'` дають помилку, а змінні із замикання автоматично стають частиною ключа. Тому витоки в Cache Components виникають там, де залежність від користувача **не видно ключу**.

**Випадок 1: стан модуля.** Типовий результат міграції з «контексту запиту» на глобальну змінну:

```ts
// lib/leaky.ts — ❌ стан модуля не входить у ключ кешу
import { cacheTag } from 'next/cache'

let currentUser = 'guest'
export function setCurrentUser(id: string) {
  currentUser = id
}

export async function getDashboard() {
  'use cache'
  cacheTag('dashboard')
  return `баланс користувача ${currentUser}: 1000 ₴`
}
```

```tsx
// app/leak/page.tsx — ❌ навмисний витік
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getDashboard, setCurrentUser } from '@/lib/leaky'

async function Dashboard() {
  const user = (await cookies()).get('user')?.value ?? 'guest'
  setCurrentUser(user)
  const d = await getDashboard()
  return <p id="d">for {user}: {d}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>…</p>}>
      <Dashboard />
    </Suspense>
  )
}
```

Збірка проходить без попереджень. Два послідовні запити на `next start`:

```text
cookie user=olya → for olya: баланс користувача olya: 1000 ₴
cookie user=ivan → for ivan: баланс користувача olya: 1000 ₴
```

Іван побачив баланс Олі. Для цього навіть не потрібна паралельність: у функції немає аргументів, ключ `[buildId, fnId, []]` один на всіх, і другий запит отримав `get HIT`. Під навантаженням ще гірше: глобальна змінна сама по собі спільна для одночасних запитів. З `'use cache: remote'` такий запис потрапляє в Redis і роздається з усіх інстансів до кінця `expire`.

Виправлення — усе, від чого залежить результат, передати аргументом:

```ts
// lib/dashboard.ts — ✅ усе, від чого залежить результат, — в аргументах
import 'server-only'
import { cacheTag } from 'next/cache'

export async function getDashboard(userId: string) {
  'use cache'
  cacheTag(`dashboard-${userId}`)
  return `баланс користувача ${userId}: 1000 ₴`
}
```

Тепер ключі `[…,["olya"]]` і `[…,["ivan"]]` різні, і кожен бачить своє.

**Випадок 2: хендлер ламає ключ.** Свій хендлер, що обрізає ключ до N символів («Redis не любить довгі ключі») або бере з нього лише id функції, склеює записи з різними аргументами. Аргументи стоять у кінці ключа, тож обрізання першими зʼїдає саме їх. Якщо ключ задовгий, хешуй його повністю (SHA-256 від усього рядка), а не скорочуй.

**Випадок 3: публічна cached-функція без перевірки доступу.** `export async function getInvoice(invoiceId)` з `'use cache: remote'` правильно кешує за id. Але якщо перевірка «чи це твій рахунок» стоїть лише на сторінці, будь-який інший виклик (Server Action, route handler, інша сторінка) отримає чужий рахунок, причому зі спільного кешу. Перевіряй доступ **поза** cached-функцією, біля місця, де її викликають. Саму функцію не експортуй із шару даних: експортуй обгортку, що спершу перевіряє сесію ([[Next.js - 15. Cache Components і use cache|тема 15]], авторизація — тема 28 основного посібника).

**Випадок 4: PII у ключах і тегах.** Ключ і теги зберігаються **відкритим текстом**. У сховищі демо-застосунку імʼя файлу запису декодується в `next:entry:["JjVo…","e001…",["42","EUR"]]`: аргументи видно повністю. `getProfile(email)` чи `` cacheTag(`user-${email}`) `` кладуть email у Redis, логи і дампи. Ключуй і тегуй за стабільним id, а не за email, токеном чи телефоном.

Як **виявити** витік, поки його не знайшли користувачі:

1. **Тест двох користувачів** на продакшн-збірці (`next build && next start`, не `next dev`): зайти як A, потім як B на ту саму сторінку й перевірити, що у відповіді B немає маркерів A (імені, email, id). Найдешевший e2e-тест, який ловить випадки 1 і 2.
2. **Лог ключів у хендлері.** Тимчасовий логувальний хендлер (як у цьому розділі) показує ключ кожного `set`. Функція з персональними даними й `[]` чи без id користувача в аргументах — тривожний сигнал.
3. **Code review за чеклистом:** кожна функція з `'use cache*'`, що повертає дані користувача, має `userId` в аргументах; не читає змінних рівня модуля, які змінюються під час запиту; не експортується без перевірки доступу; не бере email чи токени в аргументи й теги.
4. **Аудит сховища.** `SCAN` ключів Redis з фільтром на `@` чи формат токена ловить PII в ключах.

> [!quiz] Знайди баг: що побачить Іван?
> level: senior · type: single · id: nextjs-core-18-quiz-12
>
> ```ts
> let currentUserId = 'guest'
> export function setUser(id: string) {
>   currentUserId = id
> }
>
> export async function getDashboard() {
>   'use cache'
>   return `баланс користувача ${currentUserId}: 1000 ₴`
> }
> ```
>
> Сторінка читає cookie `user`, викликає `setUser(user)`, потім `getDashboard()`. Продакшн, один процес. Спершу приходить запит з `user=olya`, потім (після нього) з `user=ivan`. Що побачить Іван?
>
> - [ ] `баланс користувача ivan`: змінна модуля потрапляє в ключ, як змінна замикання
> - [ ] `баланс користувача guest`: змінну модуля кеш ігнорує і бере початкове значення
> - [ ] Помилку збірки: читати змінні модуля у `use cache` заборонено
> - [x] `баланс користувача olya`: ключ `[buildId, fnId, []]` однаковий, другий запит — `get HIT`
>
> **Пояснення:** у ключ входять аргументи і змінні **замикання**, але не стан модуля. Функція без аргументів має один ключ на всіх, і збірка про це не попереджає. Тому дані користувача передають аргументом (`getDashboard(userId)`).

### 🧮 Як обрати: таблиця рішень

| Ситуація | Вибір |
|---|---|
| Дані однакові для всіх, рахуються під час збірки (каталог, статті) | `'use cache'`, типовий хендлер |
| Дані для всіх, але в дірці за cookies/`searchParams`, інстансів багато, upstream дорогий чи обмежений | `'use cache: remote'` з ключем малої кардинальності |
| Сесія або профіль, які читають `cookies()` у багатьох компонентах | `'use cache: private'` (дедуплікація + браузер) |
| Дані користувача, які варто тримати на сервері і точково ревалідувати | витягти `userId` → `'use cache'` з тегом `…-${userId}` |
| Дані користувача, які не можна зберігати на сервері (compliance) | `'use cache: private'` або без кешу |
| Унікальний на запит ключ (пошук, фільтр ціни) | не кешувати або кешувати ширший вимір і фільтрувати в памʼяті |
| Self-hosting на кількох інстансах | `cacheHandlers.remote` (і за потреби `default`) + `cacheHandler` для ISR, спільні теги через `updateTags`/`refreshTags` |
| Кеш має пережити деплой | не `use cache`: `fetch` cache, `unstable_cache` або свій KV у шарі даних |

### 🏭 Як це роблять у продакшні

- **Спершу міряють, потім додають Redis.** Логують hit rate runtime-кешу (лічильники `get HIT/MISS` у хендлері, метрики сховища) і навантаження на upstream. Remote вмикають точково для функцій, де промах дорогий, а не «для всього».
- **Два рівні кешу.** `'use cache'` у памʼяті для дешевого й shell-вмісту, `'use cache: remote'` для дорогого runtime-вмісту. Це прямо закладено в дизайн директив.
- **Хендлер — бібліотека, а не саморобка.** Для Redis є готові адаптери спільноти, а платформи (Vercel, адаптери) дають свій `remote`. Свій пишуть, коли потрібне специфічне сховище. Тоді його тестують на двох інстансах так само, як у цьому розділі.
- **Деградація замість падіння.** `get` і `refreshTags` ловлять помилки, таймаут до сховища короткий (десятки мілісекунд). Сховище лежить — сайт повільніший, але працює.
- **TTL у сховищі обмежений.** `expire` профілю `default` ≈ 136 років, тож TTL = `Math.min(expire, N днів)`, або ключі з префіксом build ID / `deploymentId` і видалення старого префікса після деплою. Інакше записи старих деплоїв лежать у Redis вічно.
- **Окремий простір імен.** Префікс ключів (`next:entry:`, `next:tags`) і окрема база або prefix на середовище: preview і production не мають ділити записи.
- **Безпека в CI.** Тест двох користувачів на продакшн-збірці. Правило ревʼю: «дані користувача в `use cache` лише з id в аргументах». Заборона змінних рівня модуля з даними запиту.
- **Self-hosting checklist:** `cacheHandlers` + `cacheHandler`, спільні теги, однаковий `deploymentId`/build ID, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`. Деталі Docker і `standalone` — тема 43 основного посібника.

## ⚠️ Пастки

> [!pitfall] «private — це кеш на кожного користувача на сервері»
> Ні. `'use cache: private'` нічого не зберігає між запитами. Та сама Оля, чотири запити — чотири виконання. Повтор — лише в межах одного запиту і в Client Cache браузера.

> [!pitfall] «Поставили remote — тепер кеш спільний»
> Без `cacheHandlers.remote` (або платформного хендлера) директива `remote` працює на тому самому LRU в памʼяті інстансу, що й `'use cache'`. Перевір лог або метрики, а не назву директиви.

> [!pitfall] Свій хендлер у cacheHandler (однина)
> `cacheHandler` обслуговує ISR, route handlers і зображення. Для `'use cache'` він не викликається. Хендлер з методами `getExpiration`/`updateTags` має стояти в `cacheHandlers: { remote: … }`.

> [!pitfall] Спільні записи, але локальні теги
> Записи в Redis, а `updateTags`/`refreshTags` — заглушки, як у найпростішому прикладі з документації. Тоді `revalidateTag` на A не доходить до B, і B віддає старе, хоч сховище одне.

> [!pitfall] Виняток із get()
> Необроблений збій мережі в `get()` стає помилкою рендера, а не промахом. Огорни тіло в `try/catch` і поверни `undefined`.

> [!pitfall] Унікальний ключ у remote
> `getResults(query)` з довільним пошуковим рядком: кожен запит — новий запис, hit rate біля нуля, сховище росте, а кожен запит ще й платить мережею за промах. Кешуй ширший вимір або не кешуй.

> [!pitfall] Очікування, що remote переживе деплой
> Build ID — частина ключа. Після деплою всі записи стають недосяжними, і перші хвилини upstream отримує повне навантаження. Плануй прогрів або тримай довговічне в шарі даних.

> [!pitfall] Email у ключі чи тегу
> Аргументи й теги лежать у сховищі відкритим текстом. `` cacheTag(`user-${user.email}`) `` = email у Redis, логах і бекапах. Тегуй за `user.id`.

## 🎤 На співбесіді

> [!interview] Що таке 'use cache: private' і чи зберігає він щось на сервері?
> level: senior · frequency: часто · id: nextjs-core-18-int-01
>
> ---
>
> Це cached-область, де дозволено `cookies()`, `headers()` і `searchParams` (але не `connection()`). На сервері між запитами вона не зберігає нічого: однакові виклики зливаються лише в межах одного запиту, а результат живе в Client Cache браузера стільки, скільки задано `stale`. Свого хендлера в неї немає й налаштувати його не можна. Її беруть для сесії, яку читають багато компонентів, або коли compliance забороняє зберігати дані на сервері. Дані, похідні від сесії, частіше кешують інакше: витягають `userId` і передають у звичайний `use cache` з тегом.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🔒 'use cache: private' — кеш, якого немає на сервері|Розділ: private]] · [Next.js: use cache: private](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) · [Next.js: Authentication with Cache Components](https://nextjs.org/docs/app/guides/authentication-with-cache-components)

> [!interview] Коли 'use cache: remote' виправданий, а коли ні?
> level: senior · frequency: часто · id: nextjs-core-18-int-02
>
> ---
>
> Виправданий для вмісту, що рахується під час запиту (дірки за cookies чи `searchParams`, код після `connection()`), коли інстансів багато або вони ефемерні (serverless), а upstream дорогий, повільний, нестабільний чи має rate limit. Невиправданий, коли операція < 50 мс, ключ майже унікальний на запит, дані змінюються щосекунди або перед БД уже стоїть KV. Ключ проєктують за виміром з малою кардинальністю: ціна за валютою, контент за мовою. Записи не переживають деплой, бо build ID входить у ключ.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🌐 'use cache: remote' — спільне сховище, коли воно окупається|Розділ: remote]] · [Next.js: use cache: remote](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote)

> [!interview] Чим cacheHandler відрізняється від cacheHandlers?
> level: senior · frequency: іноді · id: nextjs-core-18-int-03
>
> ---
>
> `cacheHandler` (однина) — один клас з `get`/`set`/`revalidateTag`/`resetRequestCache` для серверного кешу сторінок (ISR, static shell), відповідей route handlers і з 16.2 — оптимізованих зображень. `cacheHandlers` (множина) — обʼєкт іменованих хендлерів для директив: `default` для `'use cache'`, `remote` для `'use cache: remote'`, довільні імена для `'use cache: <name>'`. Їхній інтерфейс: `get`, `set`, `refreshTags`, `getExpiration`, `updateTags`. Для кількох інстансів зазвичай потрібні обидва. І пастка: `cacheMaxMemorySize: 0` вимикає памʼять і вбудованого хендлера `'use cache'`.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🔌 cacheHandler і cacheHandlers — два різні ключі|Розділ: два ключі]] · [Next.js: cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) · [Next.js: cacheHandler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath)

> [!interview] Запускаєш Next.js на трьох інстансах за load balancer. Що зламається в кеші і як це полагодити?
> level: techlead · frequency: часто · id: nextjs-core-18-int-04
>
> ---
>
> За замовчуванням кожен інстанс має свій LRU у памʼяті: різні значення на різних інстансах, втрата при рестарті, `revalidateTag` діє лише там, куди прийшов виклик. Лагодимо так. Свій хендлер у `cacheHandlers` (`remote`, за потреби `default`) зі спільним сховищем. Теги в ньому теж спільні: `updateTags` пише час інвалідації, `refreshTags` перед запитом його читає, `get` порівнює з `timestamp` запису й повертає `revalidate: -1` для stale. Сторінки ISR ідуть у `cacheHandler` (однина). Ще треба однаковий build ID або `deploymentId`, бо він у ключах, і спільний `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`. `get` і `refreshTags` ловлять помилки сховища, щоб збій Redis не валив сайт.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🖥️ Кілька інстансів: перевіряємо на двох next start|Розділ: кілька інстансів]] · [Next.js: How Revalidation Works](https://nextjs.org/docs/app/guides/how-revalidation-works) · [Next.js: Self-Hosting](https://nextjs.org/docs/app/guides/self-hosting)

> [!interview] Як дані одного користувача можуть потрапити до іншого через use cache, якщо cookies() там заборонено?
> level: techlead · frequency: іноді · id: nextjs-core-18-int-05
>
> ---
>
> Через залежність, якої не видно ключу. Аргументи й змінні замикання входять у ключ, а змінна рівня модуля, яку ставить сторінка, — ні. Функція без аргументів має один ключ на всіх, і другий користувач отримує запис першого навіть без паралельних запитів. Інші шляхи: саморобний хендлер, що обрізає чи спрощує ключ; експортована cached-функція без перевірки доступу (IDOR зі спільного кешу); email і токени в ключах і тегах, які лежать у сховищі відкритим текстом. Виявляють тестом двох користувачів на продакшн-збірці, логом ключів у хендлері та правилом ревʼю «дані користувача — лише з id в аргументах».
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🛡️ Дані користувача і спільний кеш|Розділ: безпека]] · [Next.js: use cache — cache keys](https://nextjs.org/docs/app/api-reference/directives/use-cache#cache-keys) · [PortSwigger: Web cache deception](https://portswigger.net/web-security/web-cache-deception)

## 🔗 Звʼязки

- [[Next.js - 15. Cache Components і use cache]] — що кешувати, `cacheLife`, `cacheTag`, ключі кешу; тут — де це лежить.
- [[Next.js - 16. Ревалідація]] — `revalidateTag` (`'max'`), `updateTag`, `revalidatePath`; тут видно, що вони передають хендлеру.
- [[Next.js - 17. ISR і CDN]] — `cacheHandler` (однина) і кеш на CDN.
- [[Next.js - 12. Partial Prerendering і Cache Components]] — static shell, дірки за `Suspense`, App Shell і `stale` ≥ 30 с.
- [[Next.js - 14. Дані на сервері]] — мемоізація в межах запиту, `React.cache`, preload-патерн.
- Далі в курсі: тема 28 основного посібника — авторизація біля даних; тема 43 основного посібника — self-hosting, Docker, `deploymentId`.

## ⚡ Фішки

> [!reel] 🧊 private не зберігає нічого на сервері
> Чотири запити з `getMe()` під `'use cache: private'` дали чотири виконання, навіть для тієї самої Олі. У лозі хендлера немає ні `get`, ні `set`: Header і Sidebar злилися в один виклик лише в межах запиту.

> [!reel] 🔑 Ключ use cache — це JSON-масив
> `[buildId, functionId, [args]]`, а для функції без аргументів — `[…,[]]`. Саме тому функція без аргументів має один ключ на всіх, а нова збірка робить усі старі записи недосяжними.

> [!reel] 🏷️ updateTags отримує чотири різні виклики
> `revalidateTag(t, 'max')` приходить як `{ expire: 31536000 }`, `{ expire: 0 }` лишається `{ expire: 0 }`, `updateTag(t)` дає `undefined`, а `revalidatePath('/remote')` — тег `_N_T_/remote` і теж `undefined`.

> [!reel] 🪤 cacheMaxMemorySize: 0 вимикає більше, ніж здається
> Параметр розмірює і вбудований кеш `'use cache'`. Уже сам `cacheMaxMemorySize: 0` без власного `default` у `cacheHandlers` змушує `getStats()` виконуватись на кожен запит.

> [!reel] 💥 get() у хендлері ніхто не обгортає в try/catch
> Виняток із `get` стає помилкою рендера, а не промахом. Тому збій Redis треба ловити всередині: `catch { return undefined }`. Те саме з `refreshTags`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Де за замовчуванням зберігається результат 'use cache'?
> *дуже часто · теорія* · `nextjs-core-18-card-01`
>
> У вбудованому хендлері `default`: LRU у памʼяті процесу (`cacheMaxMemorySize`, типово 50 MB). Кожен інстанс має свою копію, а рестарт стирає все. Те саме стосується `'use cache: remote'`, поки не налаштовано `cacheHandlers.remote`.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🧠 Типовий хендлер у памʼяті і його межі|Розділ]] · [Next.js: use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)

> [!question]- Чим 'use cache: remote' відрізняється від 'use cache'?
> *часто · теорія* · `nextjs-core-18-card-03`
>
> Лише вибором хендлера: `remote` звертається до хендлера з ключа `remote`. Який у нього бекенд, вирішує конфіг або платформа. Без `cacheHandlers.remote` це той самий LRU в памʼяті, тож «віддаленість» треба налаштувати.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🌐 'use cache: remote' — спільне сховище, коли воно окупається|Розділ]] · [Next.js: use cache: remote](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote)

> [!question]- Як використати cookie в кешованій функції, якщо `cookies()` у `'use cache'` заборонено?
> *часто · практика* · `nextjs-core-18-card-04`
>
> Прочитати cookie поза функцією і передати значення аргументом (він стане частиною ключа). Або винести читання сесії в `'use cache: private'`, де `cookies()` дозволений, а похідні дані кешувати за `userId`.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🔒 'use cache: private' — кеш, якого немає на сервері|Розділ]] · [Next.js: use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)

### 🟡 Middle

> [!question]- У якому порядку Next.js викликає методи хендлера use cache?
> *часто · теорія* · `nextjs-core-18-card-06`
>
> Хіт: `refreshTags` → `get` (знайшов) → `getExpiration(softTags)`. Промах: `refreshTags` → `get` (undefined) → виконання функції → `set(key, pendingEntry)`. `updateTags` викликається окремо, при `revalidateTag`, `updateTag` і `revalidatePath`.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🧩 Інтерфейс хендлера use cache|Розділ]] · [Next.js: cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)

> [!question]- Із чого складається ключ кешу і чому записи не переживають деплой?
> *часто · теорія* · `nextjs-core-18-card-07`
>
> Із JSON-масиву `[buildId, functionId, [args]]`. Build ID (або `deploymentId`) стоїть першим, тож нова збірка дає нові ключі, і старі записи в Redis недосяжні. Самі вони не зникнуть: `expire` профілю `default` ≈ 136 років, а `'max'` — рік, тож потрібен TTL-ліміт (`Math.min(expire, N днів)`) або префікс ключів за build ID / `deploymentId`. Для кешу між деплоями потрібен `fetch` cache або свій KV.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🌐 'use cache: remote' — спільне сховище, коли воно окупається|Розділ]] · [Next.js: use cache — cache keys](https://nextjs.org/docs/app/api-reference/directives/use-cache#cache-keys)

> [!question]- Що отримує updateTags у різних випадках ревалідації?
> *іноді · код* · `nextjs-core-18-card-09`
>
> `revalidateTag(t, 'max')` → `[t]`, `{ expire: 31536000 }` (stale зараз, expired через рік); `{ expire: 0 }` → `{ expire: 0 }`; `updateTag(t)` → `[t]`, `undefined`; `revalidatePath('/x')` → `['_N_T_/x']`, `undefined`. Метод викликається на кожному хендлері, але лише на інстансі, що отримав виклик.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🧩 Інтерфейс хендлера use cache|Розділ]] · [Next.js: cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)

### 🔴 Senior

> [!question]- Чим явні теги відрізняються від soft tags і хто їх перевіряє?
> *іноді · теорія* · `nextjs-core-18-card-10`
>
> Явні (`cacheTag`) лежать у `entry.tags`, їх перевіряє `get` хендлера. Soft tags (`_N_T_/layout`, `_N_T_/shared/page`) описують маршрут і приходять другим аргументом `get`, а також у `getExpiration`: цим Next.js сам дізнається про `revalidatePath`. Якщо `getExpiration` повернув `Infinity`, перевірку пропускають.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🧩 Інтерфейс хендлера use cache|Розділ]] · [Next.js: cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)

> [!question]- Як у власному хендлері реалізувати stale-while-revalidate?
> *іноді · код* · `nextjs-core-18-card-11`
>
> `updateTags` пише в сховище час інвалідації тегу (`stale: now`, `expired: now + expire·1000`). У `get` порівнюй його з `timestamp` запису: `expired` настав → повернути `undefined`; тільки `stale` → повернути запис з `revalidate: -1`, тоді Next.js віддасть старе й у фоні перерахує та викличе `set`.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🛠️ Свій хендлер: спільне сховище для кількох інстансів|Розділ]] · [Next.js: How Revalidation Works](https://nextjs.org/docs/app/guides/how-revalidation-works)

> [!question]- Як хендлер має поводитися, коли Redis недоступний?
> *часто · практика* · `nextjs-core-18-card-12`
>
> `get` і `refreshTags` ловлять помилки: `get` повертає `undefined` (промах), `refreshTags` лишає стару локальну копію тегів. Next.js їх не обгортає, тож виняток стане помилкою рендера. Додай короткий таймаут до сховища: сайт повільніший, але працює.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🛠️ Свій хендлер: спільне сховище для кількох інстансів|Розділ]] · [Next.js: cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)

> [!question]- Чому не можна класти email чи токен в аргументи й теги cached-функції?
> *іноді · безпека* · `nextjs-core-18-card-14`
>
> Ключ і теги зберігаються у сховищі відкритим текстом, тож ``cacheTag(`user-${email}`)`` кладе email у Redis, логи й бекапи. Ключуй і тегуй за стабільним id, а перевірку PII роби в одному місці (обгортка аргументів).
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🛡️ Дані користувача і спільний кеш|Розділ]] · [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security)

> [!question]- Чому вбудований хендлер у продакшні не віддає протермінований запис, а revalidateTag(…, 'max') — віддає?
> *рідко · теорія* · `nextjs-core-18-card-15`
>
> За часом вбудований хендлер вважає запис відсутнім одразу після `revalidate`: тримати застаріле в памʼяті, яку витисне LRU, немає сенсу. Тег, позначений stale через `'max'`, — явний сигнал «віддай старе й онови у фоні», і хендлер це виконує.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🧠 Типовий хендлер у памʼяті і його межі|Розділ]] · [Next.js: cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)

> [!question]- Чому cacheMaxMemorySize: 0 — пастка для 'use cache'?
> *рідко · код* · `nextjs-core-18-card-16`
>
> Параметр розмірює обидва вбудовані кеші. Якщо в `cacheHandlers` немає свого `default`, `'use cache'` лишається на вбудованому хендлері з розміром 0 і виконується на кожен запит, навіть коли поряд є власний `cacheHandler`. Додай `default` або не обнуляй памʼять.
>
> 📚 [[Next.js - 18. Приватний і віддалений кеш, cacheHandlers#🔌 cacheHandler і cacheHandlers — два різні ключі|Розділ]] · [Next.js: cacheHandler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath)

## 🛠️ Практика

> [!task] Кеш із тегами, stale і expire
> level: senior · difficulty: medium · id: nextjs-core-18-task-01 · tags: cache, tags, handler
>
> Напиши `createCacheStore({ now })` — модель хендлера `'use cache'`. Годинник береш лише з `now()` (мс), тож тести керують часом.
>
> - `set(key, value, { tags, revalidate, expire })` — `revalidate` і `expire` у **секундах**, типово `Infinity`; `tags` типово `[]`. Запис запамʼятовує `timestamp = now()`.
> - `get(key)` повертає `{ status: 'miss' }` або `{ status, value }`. Вік запису = `now() - timestamp`. Вік ≥ `expire`·1000 → `miss`; вік ≥ `revalidate`·1000 → `stale`; інакше `hit`.
> - `updateTags(tags, durations?)`: з `durations` тег стає stale з цієї миті, а `miss` — через `durations.expire` секунд (без `expire` — ніколи); без `durations` запис з цим тегом є `miss` одразу.
> - Інвалідація діє на записи, чий `timestamp` **не новіший** за мить виклику (запис, створений тієї ж мілісекунди, вважається старішим). Записи, створені пізніше, не зачеплені.
> - Пріоритет статусів: `miss` над `stale` над `hit`.
>
> Задача на TypeScript: типи знімаються перед запуском, тести дивляться на значення.
>
> ```ts starter
> type Entry = { value: unknown; timestamp: number; tags: string[]; revalidate: number; expire: number }
> type Result = { status: 'hit' | 'stale' | 'miss'; value?: unknown }
> type SetOptions = { tags?: string[]; revalidate?: number; expire?: number }
> type Durations = { expire?: number }
>
> function createCacheStore({ now }: { now: () => number }) {
>   const entries = new Map<string, Entry>()
>
>   return {
>     set(key: string, value: unknown, options: SetOptions = {}): void {
>       entries.set(key, {
>         value,
>         timestamp: now(),
>         tags: options.tags ?? [],
>         revalidate: options.revalidate ?? Infinity,
>         expire: options.expire ?? Infinity,
>       })
>     },
>
>     get(key: string): Result {
>       const entry = entries.get(key)
>       if (!entry) return { status: 'miss' }
>       // ❌ ні термінів, ні тегів: будь-який знайдений запис — hit
>       return { status: 'hit', value: entry.value }
>     },
>
>     updateTags(tags: string[], durations?: Durations): void {
>       // TODO: запамʼятати, коли тег інвалідовано
>     },
>   }
> }
> ```
>
> ```ts tests
> let t = 1_000_000
> const tick = (ms: number) => {
>   t += ms
> }
> const store = () => createCacheStore({ now: () => t })
>
> test('запис без тегів і термінів — hit зі значенням', () => {
>   const s = store()
>   s.set('k', 'A')
>   expect(s.get('k')).toEqual({ status: 'hit', value: 'A' })
>   expect(s.get('нема')).toEqual({ status: 'miss' })
> })
>
> test('за expire запис стає miss: на межі ще hit, на expire уже ні', () => {
>   const s = store()
>   s.set('k', 'A', { expire: 10 })
>   tick(9999)
>   expect(s.get('k').status).toBe('hit')
>   tick(1)
>   expect(s.get('k')).toEqual({ status: 'miss' })
> })
>
> test('після revalidate запис stale і ще віддає значення', () => {
>   const s = store()
>   s.set('k', 'A', { revalidate: 5, expire: 60 })
>   tick(5000)
>   expect(s.get('k')).toEqual({ status: 'stale', value: 'A' })
>   tick(55_000)
>   expect(s.get('k').status).toBe('miss')
> })
>
> test('updateTags з durations: stale зараз, miss через expire секунд', () => {
>   const s = store()
>   s.set('k', 'A', { tags: ['price-42'] })
>   tick(1)
>   s.updateTags(['price-42'], { expire: 60 })
>   expect(s.get('k')).toEqual({ status: 'stale', value: 'A' })
>   tick(59_999)
>   expect(s.get('k').status).toBe('stale')
>   tick(1)
>   expect(s.get('k').status).toBe('miss')
> })
>
> test('updateTags без durations і з expire: 0 — одразу miss', () => {
>   const s = store()
>   s.set('a', 1, { tags: ['x'] })
>   s.set('b', 2, { tags: ['y'] })
>   tick(1)
>   s.updateTags(['x'])
>   s.updateTags(['y'], { expire: 0 })
>   expect(s.get('a').status).toBe('miss')
>   expect(s.get('b').status).toBe('miss')
> })
>
> test('запис, створений після інвалідації, — hit; чужі теги не зачеплені', () => {
>   const s = store()
>   s.set('old', 'o', { tags: ['x'] })
>   s.set('other', 'z', { tags: ['y'] })
>   tick(1)
>   s.updateTags(['x'])
>   tick(1)
>   s.set('fresh', 'n', { tags: ['x'] })
>   expect(s.get('old').status).toBe('miss')
>   expect(s.get('fresh')).toEqual({ status: 'hit', value: 'n' })
>   expect(s.get('other')).toEqual({ status: 'hit', value: 'z' })
> })
> ```
>
> > [!hint]- Підказка 1
> > Окремо зберігай мапу `тег → { staleAt, expiredAt }`. `updateTags` лише пише в неї, а перевіряє `get`.
>
> > [!hint]- Підказка 2
> > `expiredAt = now() + expire * 1000` (з `durations`) або `now()` (без). У `get` пропусти тег, якщо `entry.timestamp > staleAt`; якщо `now() >= expiredAt` — `miss`, інакше `stale`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Entry = { value: unknown; timestamp: number; tags: string[]; revalidate: number; expire: number }
> > type Result = { status: 'hit' | 'stale' | 'miss'; value?: unknown }
> > type SetOptions = { tags?: string[]; revalidate?: number; expire?: number }
> > type Durations = { expire?: number }
> > type Mark = { staleAt: number; expiredAt: number }
> >
> > function createCacheStore({ now }: { now: () => number }) {
> >   const entries = new Map<string, Entry>()
> >   const marks = new Map<string, Mark>()
> >
> >   return {
> >     set(key: string, value: unknown, options: SetOptions = {}): void {
> >       entries.set(key, {
> >         value,
> >         timestamp: now(),
> >         tags: options.tags ?? [],
> >         revalidate: options.revalidate ?? Infinity,
> >         expire: options.expire ?? Infinity,
> >       })
> >     },
> >
> >     get(key: string): Result {
> >       const entry = entries.get(key)
> >       if (!entry) return { status: 'miss' }
> >       const time = now()
> >       const age = time - entry.timestamp
> >       if (age >= entry.expire * 1000) return { status: 'miss' }
> >
> >       let stale = age >= entry.revalidate * 1000
> >       for (const tag of entry.tags) {
> >         const mark = marks.get(tag)
> >         if (!mark || entry.timestamp > mark.staleAt) continue
> >         if (time >= mark.expiredAt) return { status: 'miss' }
> >         stale = true
> >       }
> >       return { status: stale ? 'stale' : 'hit', value: entry.value }
> >     },
> >
> >     updateTags(tags: string[], durations?: Durations): void {
> >       const time = now()
> >       const expiredAt = durations ? time + (durations.expire ?? Infinity) * 1000 : time
> >       for (const tag of tags) marks.set(tag, { staleAt: time, expiredAt })
> >     },
> >   }
> > }
> > ```
> >
> > Це спрощений `get` з `shared.js`: теги не шукають записи, вони лише фіксують час інвалідації, а `get` порівнює його з `timestamp`. Пріоритет `miss` над `stale` дає ранній `return` усередині циклу.
>

> [!task] safeCacheArgs: без PII в ключах і тегах
> level: senior · difficulty: medium · id: nextjs-core-18-task-02 · tags: security, cache-key, pii
>
> Ключі й теги кешу лежать у сховищі відкритим текстом. Напиши `safeCacheArgs(user, extra)`, що готує аргументи для cached-функції.
>
> - Повертає `[user.id, picked]`, де `picked` — лише дозволені поля з `extra` (`ALLOWED` у стартовому коді), з ключами в **алфавітному порядку**. Інші поля відкидаються, `extra` не мутується.
> - Кидає помилку, якщо `user.id` порожній чи не рядок/число.
> - Кидає помилку, якщо будь-яке рядкове чи числове значення (в `user.id` і в **усіх** полях `extra`, навіть недозволених) схоже на PII: email (`a@b.c`), токен (рядок з `Bearer …` на початку або hex з 32+ символів) чи телефон (8+ цифр і роздільників поспіль, наприклад `+380 50 123 45 67`).
> - Без `extra` повертає `[id, {}]`.
>
> ```js starter
> // Дозволені поля extra, які можуть увійти в ключ кешу
> const ALLOWED = ['currency', 'locale', 'page', 'tag']
>
> function safeCacheArgs(user, extra = {}) {
>   // ❌ беремо що дали: і email, і токен ляжуть у ключ відкритим текстом
>   return [user.id, extra]
> }
> ```
>
> ```js tests
> test('стабільний id і дозволені поля проходять; ключі відсортовані', () => {
>   const args = safeCacheArgs({ id: 'u_42', name: 'Оля' }, { locale: 'uk', currency: 'UAH' })
>   expect(args).toEqual(['u_42', { currency: 'UAH', locale: 'uk' }])
>   expect(Object.keys(args[1])).toEqual(['currency', 'locale'])
> })
>
> test('порядок полів у extra не змінює ключ', () => {
>   const a = safeCacheArgs({ id: 'u_42' }, { locale: 'uk', currency: 'UAH', page: 2 })
>   const b = safeCacheArgs({ id: 'u_42' }, { page: 2, currency: 'UAH', locale: 'uk' })
>   expect(JSON.stringify(a)).toBe(JSON.stringify(b))
> })
>
> test('email у дозволеному полі (тег) кидає помилку', () => {
>   expect(() => safeCacheArgs({ id: 'u_42' }, { tag: 'user-olya@example.com' })).toThrow()
> })
>
> test('токен у будь-якому полі extra кидає, навіть у недозволеному', () => {
>   expect(() => safeCacheArgs({ id: 'u_42' }, { note: 'Bearer eyJhbGciOiJIUzI1NiJ9' })).toThrow()
>   expect(() => safeCacheArgs({ id: 'u_42' }, { tag: 'a3f5c9d2b1e84f60a7c3d9e2f10b4a58' })).toThrow()
> })
>
> test('телефон в extra або email замість id кидає', () => {
>   expect(() => safeCacheArgs({ id: 'u_42' }, { tag: '+380 50 123 45 67' })).toThrow()
>   expect(() => safeCacheArgs({ id: 'olya@example.com' })).toThrow()
> })
>
> test('зайві поля не потрапляють у ключ, extra не мутується; без extra — порожній обʼєкт', () => {
>   const extra = { locale: 'uk', theme: 'dark' }
>   expect(safeCacheArgs({ id: 7 }, extra)).toEqual([7, { locale: 'uk' }])
>   expect(extra).toEqual({ locale: 'uk', theme: 'dark' })
>   expect(safeCacheArgs({ id: 'u_1' })).toEqual(['u_1', {}])
> })
> ```
>
> > [!hint]- Підказка 1
> > Спершу пройдись по `Object.entries(extra)` і перевір кожне значення, і лише потім відбирай дозволені поля.
>
> > [!hint]- Підказка 2
> > Вирази: email `/[^\s@]+@[^\s@]+\.[^\s@]+/`, токен `/^\s*bearer\s+\S+/i` і `/\b[0-9a-f]{32,}\b/i`, телефон `/\+?\d[\d\s().-]{7,}\d/`. Ключі: `Object.keys(extra).filter(...).sort()`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const ALLOWED = ['currency', 'locale', 'page', 'tag']
> >
> > const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/
> > const BEARER = /^\s*bearer\s+\S+/i
> > const HEX_TOKEN = /\b[0-9a-f]{32,}\b/i
> > const PHONE = /\+?\d[\d\s().-]{7,}\d/
> >
> > function assertNoPii(value, where) {
> >   if (typeof value !== 'string' && typeof value !== 'number') return
> >   const text = String(value)
> >   if (EMAIL.test(text)) throw new Error(`${where}: схоже на email`)
> >   if (BEARER.test(text) || HEX_TOKEN.test(text)) throw new Error(`${where}: схоже на токен`)
> >   if (PHONE.test(text)) throw new Error(`${where}: схоже на телефон`)
> > }
> >
> > function safeCacheArgs(user, extra = {}) {
> >   if (!user || (typeof user.id !== 'string' && typeof user.id !== 'number') || user.id === '') {
> >     throw new Error('потрібен стабільний id користувача')
> >   }
> >   assertNoPii(user.id, 'id')
> >   for (const [name, value] of Object.entries(extra)) assertNoPii(value, name)
> >
> >   const picked = {}
> >   for (const name of Object.keys(extra).filter((k) => ALLOWED.includes(k)).sort()) {
> >     picked[name] = extra[name]
> >   }
> >   return [user.id, picked]
> > }
> > ```
> >
> > Перевірка PII йде до відбору полів: токен у «зайвому» полі теж сигнал, що хтось збирається покласти секрет у кеш. Сортування ключів робить ключ детермінованим: `{ locale, currency }` і `{ currency, locale }` дають один JSON. Регулярки — лише захисна сітка, головне правило те саме: ключуй за стабільним id.
>

> [!task] Два інстанси з теґами у спільному сховищі
> level: techlead · difficulty: hard · id: nextjs-core-18-task-03 · tags: refreshTags, updateTags, multi-instance
>
> Змоделюй пару `refreshTags` / `updateTags` для двох інстансів. `createSharedTags()` (спільне сховище, модель Redis) уже написано; `shared.broken = true` робить `read()` помилковим. Допиши `createInstance(shared, { now })`:
>
> - `refreshTags()` — підтягує всі теги зі сховища в локальну копію. Якщо `shared.read()` кидає, **не кидає** далі й лишає стару копію.
> - `updateTags(tags)` — ставить `now()` для кожного тегу в сховищі й у локальній копії. Спершу прочитай актуальний стан зі сховища, щоб не затерти теги, які записали інші інстанси.
> - `isFresh(entry)` — синхронно, лише за локальною копією: `true`, якщо жоден тег запису не інвалідовано в момент `entry.timestamp` чи пізніше.
>
> Інвалідація, зроблена на A, на B не видна, поки B не викличе `refreshTags()`. Задача на TypeScript: типи знімаються перед запуском.
>
> ```ts starter
> type Marks = Record<string, number> // тег → мс, коли його інвалідовано
> type Entry = { key: string; timestamp: number; tags: string[] }
>
> // Спільне сховище тегів (модель Redis). broken = true імітує збій читання.
> function createSharedTags() {
>   let marks: Marks = {}
>   return {
>     broken: false,
>     async read(): Promise<Marks> {
>       if (this.broken) throw new Error('сховище недоступне')
>       return { ...marks }
>     },
>     async write(next: Marks): Promise<void> {
>       marks = { ...next }
>     },
>   }
> }
> type Shared = ReturnType<typeof createSharedTags>
>
> function createInstance(shared: Shared, { now }: { now: () => number }) {
>   let local: Marks = {}
>
>   return {
>     async refreshTags(): Promise<void> {
>       // TODO: підтягнути теги зі спільного сховища в local
>     },
>
>     async updateTags(tags: string[]): Promise<void> {
>       // ❌ лише локально: інші інстанси про це не дізнаються
>       for (const tag of tags) local[tag] = now()
>     },
>
>     isFresh(entry: Entry): boolean {
>       return true // TODO: свіжий, якщо жоден його тег не інвалідовано після (або в мить) створення
>     },
>   }
> }
> ```
>
> ```ts tests
> let t = 5000
> const tick = () => {
>   t += 1
> }
> const setup = () => {
>   const shared = createSharedTags()
>   const A = createInstance(shared, { now: () => t })
>   const B = createInstance(shared, { now: () => t })
>   return { shared, A, B }
> }
> const entryOf = (tags: string[]): Entry => ({ key: 'k', timestamp: t, tags })
>
> test('інстанс, що інвалідував тег, бачить це одразу', async () => {
>   const { A } = setup()
>   const entry = entryOf(['price-42'])
>   tick()
>   await A.updateTags(['price-42'])
>   expect(A.isFresh(entry)).toBe(false)
> })
>
> test('інвалідація на A не видна B до refreshTags()', async () => {
>   const { A, B } = setup()
>   const entry = entryOf(['price-42'])
>   tick()
>   await A.updateTags(['price-42'])
>   expect(B.isFresh(entry)).toBe(true)
> })
>
> test('після refreshTags() B бачить інвалідацію з A', async () => {
>   const { A, B } = setup()
>   const entry = entryOf(['price-42'])
>   tick()
>   await A.updateTags(['price-42'])
>   await B.refreshTags()
>   expect(B.isFresh(entry)).toBe(false)
>   expect(B.isFresh(entryOf(['other']))).toBe(true)
> })
>
> test('запис, створений після інвалідації, свіжий', async () => {
>   const { A, B } = setup()
>   tick()
>   await A.updateTags(['price-42'])
>   tick()
>   const fresh = entryOf(['price-42'])
>   await B.refreshTags()
>   expect(B.isFresh(fresh)).toBe(true)
> })
>
> test('збій shared.read у refreshTags не кидає і лишає стару копію', async () => {
>   const { shared, A, B } = setup()
>   const entry = entryOf(['price-42'])
>   tick()
>   await A.updateTags(['price-42'])
>   await B.refreshTags()
>   shared.broken = true
>   await B.refreshTags()
>   expect(B.isFresh(entry)).toBe(false)
> })
>
> test('два інстанси не затирають теги один одного', async () => {
>   const { shared, A, B } = setup()
>   tick()
>   await A.updateTags(['x'])
>   tick()
>   await B.updateTags(['y'])
>   const all = await shared.read()
>   expect(Object.keys(all).sort()).toEqual(['x', 'y'])
> })
> ```
>
> > [!hint]- Підказка 1
> > `isFresh` — це `entry.tags.every(tag => local[tag] === undefined || local[tag] < entry.timestamp)`.
>
> > [!hint]- Підказка 2
> > У `updateTags` спочатку `const all = await shared.read()`, потім змінюєш `all` і пишеш назад. А в `refreshTags` обгорни читання в `try/catch` і нічого не роби в `catch`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type Marks = Record<string, number>
> > type Entry = { key: string; timestamp: number; tags: string[] }
> >
> > function createSharedTags() {
> >   let marks: Marks = {}
> >   return {
> >     broken: false,
> >     async read(): Promise<Marks> {
> >       if (this.broken) throw new Error('сховище недоступне')
> >       return { ...marks }
> >     },
> >     async write(next: Marks): Promise<void> {
> >       marks = { ...next }
> >     },
> >   }
> > }
> > type Shared = ReturnType<typeof createSharedTags>
> >
> > function createInstance(shared: Shared, { now }: { now: () => number }) {
> >   let local: Marks = {}
> >
> >   return {
> >     async refreshTags(): Promise<void> {
> >       try {
> >         local = await shared.read()
> >       } catch {
> >         // сховище лежить: працюємо зі старою локальною копією
> >       }
> >     },
> >
> >     async updateTags(tags: string[]): Promise<void> {
> >       const all = await shared.read() // читаємо актуальне, щоб не затерти чужі теги
> >       const time = now()
> >       for (const tag of tags) all[tag] = time
> >       await shared.write(all)
> >       local = all
> >     },
> >
> >     isFresh(entry: Entry): boolean {
> >       return entry.tags.every((tag) => local[tag] === undefined || local[tag] < entry.timestamp)
> >     },
> >   }
> > }
> > ```
> >
> > Це скорочена версія `shared.js`: теги живуть окремо від записів, `updateTags` пише час інвалідації, `refreshTags` читає його перед запитом, а `get` порівнює з `timestamp`. Read-modify-write у `updateTags` усе ще має гонку між двома інстансами: у Redis зберігай кожен тег окремим ключем чи полем хеша.
>

> [!task] Знайди витік через стан модуля
> level: senior · difficulty: medium · id: nextjs-core-18-task-04 · tags: security, cache-key, leak
>
> Сторінка «дашборд» викликає `setCurrentUser(user)` і `getDashboard()` — функція без аргументів, обгорнута в `cached` (мініатюра `'use cache'`: результат за ключем із JSON аргументів). Іван бачить баланс Олі.
>
> Виправ код так, щоб:
>
> - `getDashboard` залежала лише від своїх **аргументів**: користувач передається як `userId`;
> - `renderPage(user)` повертала дані саме цього користувача, навіть коли запити паралельні;
> - змінних модуля з даними запиту (`currentUser`, `setCurrentUser`) не лишилось;
> - повторний виклик для того самого користувача був хітом (без нового виконання), а різні користувачі мали різні записи.
>
> `cached`, `renderPage` і `dashboardRuns` лиши: тести викликають саме їх.
>
> ```js starter
> // Мініатюрна модель 'use cache': результат лежить за ключем із JSON аргументів
> const store = new Map()
> let runs = 0
>
> function cached(fn) {
>   return async (...args) => {
>     const key = JSON.stringify(args)
>     if (store.has(key)) return store.get(key)
>     const value = await fn(...args)
>     store.set(key, value)
>     return value
>   }
> }
>
> // ❌ стан модуля: його ставить «сторінка», а в ключ він не входить
> let currentUser = 'guest'
> function setCurrentUser(id) {
>   currentUser = id
> }
>
> const getDashboard = cached(async () => {
>   runs++
>   await null // як справжнє звернення до БД
>   return `баланс користувача ${currentUser}: 1000 ₴`
> })
>
> // «Сторінка»: ставить користувача й викликає cached-функцію
> async function renderPage(user) {
>   setCurrentUser(user)
>   return getDashboard()
> }
>
> function dashboardRuns() {
>   return runs
> }
> ```
>
> ```js tests
> test('Іван бачить свої дані, а не дані Олі', async () => {
>   await renderPage('olya')
>   const page = await renderPage('ivan')
>   expect(page).toContain('ivan')
>   expect(page).not.toContain('olya')
> })
>
> test('Оля після Івана теж бачить своє', async () => {
>   await renderPage('ivan2')
>   expect(await renderPage('olya2')).toBe('баланс користувача olya2: 1000 ₴')
> })
>
> test('різні користувачі — різні записи: функція виконується для кожного', async () => {
>   const before = dashboardRuns()
>   await renderPage('u1')
>   await renderPage('u2')
>   expect(dashboardRuns() - before).toBe(2)
> })
>
> test('повторний виклик того самого користувача — хіт, без нового виконання', async () => {
>   await renderPage('anna')
>   const before = dashboardRuns()
>   const again = await renderPage('anna')
>   expect(again).toContain('anna')
>   expect(dashboardRuns()).toBe(before)
> })
>
> test('паралельні запити не змішують користувачів', async () => {
>   const [a, b] = await Promise.all([renderPage('par-a'), renderPage('par-b')])
>   expect(a).toContain('par-a')
>   expect(b).toContain('par-b')
> })
> ```
>
> > [!hint]- Підказка 1
> > Ключ будується з аргументів. Якщо `getDashboard()` не має аргументів, її ключ завжди `[]`.
>
> > [!hint]- Підказка 2
> > Додай параметр `userId` у функцію, яку обгортає `cached`, і прибери змінну модуля. `renderPage` має передавати користувача аргументом.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const store = new Map()
> > let runs = 0
> >
> > function cached(fn) {
> >   return async (...args) => {
> >     const key = JSON.stringify(args)
> >     if (store.has(key)) return store.get(key)
> >     const value = await fn(...args)
> >     store.set(key, value)
> >     return value
> >   }
> > }
> >
> > // ✅ усе, від чого залежить результат, — в аргументах, а отже, в ключі
> > const getDashboard = cached(async (userId) => {
> >   runs++
> >   await null
> >   return `баланс користувача ${userId}: 1000 ₴`
> > })
> >
> > async function renderPage(user) {
> >   return getDashboard(user)
> > }
> >
> > function dashboardRuns() {
> >   return runs
> > }
> > ```
> >
> > Усе, від чого залежить результат, має бути в ключі. `getDashboard('olya')` і `getDashboard('ivan')` тепер мають ключі `["olya"]` і `["ivan"]`, тож паралельні запити не змішуються. Саме це перевіряє «тест двох користувачів» на продакшн-збірці.
>

## 📚 Джерела та що почитати

- 🟡 [Next.js — use cache: private](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) — що дозволено, дедуплікація, `stale`, вкладення.
- 🟡 [Next.js — use cache: remote](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote) — коли окупається, кардинальність ключа, порівняння трьох директив.
- 🔴 [Next.js — cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) — інтерфейс хендлера, `CacheEntry`, soft tags, розподілені теги, обробка помилок.
- 🔴 [Next.js — cacheHandler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) — хендлер однини для ISR, route handlers і зображень.
- 🟡 [Next.js — cacheMaxMemorySize](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheMaxMemorySize) — розмір обох вбудованих кешів і значення `0`.
- 🔴 [Next.js — How Revalidation Works](https://nextjs.org/docs/app/guides/how-revalidation-works) — теги, soft tags, кілька інстансів, деградація.
- 🟡 [Next.js — Authentication with Cache Components](https://nextjs.org/docs/app/guides/authentication-with-cache-components) — сесія в `private`, дані за `userId`, ключі й теги відкритим текстом.
- 🟡 [Next.js — Self-Hosting](https://nextjs.org/docs/app/guides/self-hosting) — кеш і ISR на кількох інстансах, build ID, ключ шифрування.
- 🛠️ [Next.js — вбудований хендлер default.ts](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cache-handlers/default.ts) — еталонна реалізація: LRU, stale-теги, `revalidate: -1`.
- 🔴 [PortSwigger — Web cache deception](https://portswigger.net/web-security/web-cache-deception) — як спільні кеші віддають чужі персональні відповіді.

> [!important] Підсумок
> - Три директиви — три сховища. `'use cache'` іде в хендлер `default` (типово LRU у памʼяті інстансу), `'use cache: remote'` — у хендлер `remote` (без конфігу теж памʼять!), `'use cache: private'` не зберігає нічого на сервері: лише дедуплікація в запиті і Client Cache браузера.
> - Типовий кеш — окремий для кожного процесу, зникає при рестарті, а `revalidateTag` діє лише на інстансі, що отримав виклик. Жоден `use cache*` не переживає деплой, бо build ID у ключі.
> - Remote окупається для вмісту, що рахується під час запиту, з дорогим чи обмеженим upstream і ключем малої кардинальності. Для швидких операцій і унікальних ключів він лише додає мережу.
> - `cacheHandler` (однина) обслуговує ISR, route handlers і зображення. `cacheHandlers` (множина) обслуговує `use cache` через `get`, `set`, `refreshTags`, `getExpiration`, `updateTags`. `cacheMaxMemorySize: 0` вимикає памʼять обох вбудованих кешів.
> - Спільний кеш — це спільні записи **і** спільні теги: `updateTags` пише інвалідацію, `refreshTags` її читає, `get` не кидає помилок.
> - У спільний кеш — лише те, що однакове для всіх з тим самим ключем. Дані користувача — з id в аргументах. Ні стану модуля, ні PII в ключах і тегах, перевірка доступу поза cached-функцією. Перевіряй тестом двох користувачів на продакшн-збірці.

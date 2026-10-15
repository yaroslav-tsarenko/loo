---
title: Дати, час та Intl
order: 24
level: middle
tags: [date, time, timezone, temporal, intl, i18n]
prerequisites:
  - "[[JavaScript - 02. Типи та приведення типів]]"
  - "[[JavaScript - 23. JSON, structuredClone і серіалізація]]"
estimatedMinutes: 50
id: jsd-ch-24
icon: "📅"
---

# Дати, час та Intl

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити модель `Date` (мілісекунди від epoch в UTC) і чому «дата без часового поясу» в ній не існує;
> - уникнути класичних пасток: місяці з нуля, переповнення, мутабельність, парсинг рядків;
> - правильно додавати дні й години з урахуванням переходу на літній час;
> - вибрати потрібний тип Temporal (`Instant`, `PlainDate`, `ZonedDateTime`, `Duration`) і знати його статус;
> - форматувати дати, числа, валюти, відносний час, списки й **українські форми множини** через `Intl`.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-24-quiz-01
>
> ```js
> const d = new Date(2024, 0, 31); // 31 січня 2024
> d.setMonth(1);                   // «зробити лютим»
> console.log(d.getMonth(), d.getDate());
> ```
>
> **Відповідь:** `2 2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. Місяці рахуються з нуля (`1` — лютий). 31 лютого не існує, тож `Date` «переливає» зайві дні вперед: 2024 — високосний, у лютому 29 днів, 31 − 29 = 2 → **2 березня** (`getMonth()` = 2).

## 🧒 Простими словами

`Date` — це секундомір, запущений 1 січня 1970 року о 00:00 у Гринвічі, який показує лише **кількість мілісекунд**. Він не знає, що таке «понеділок» чи «Київ», — це лише одне число. Коли ти питаєш «котра година?», він бере годинник **твого комп'ютера** і перекладає число в місцевий час. Тому той самий `Date` у Києві й Нью-Йорку «показує» різне — хоча число однакове. А `Intl` — це перекладач, який знає, що в Україні пишуть `1 234,5 ₴`, кажуть «5 хвилин», але «2 хвилини» й «21 хвилина», а в США — `$1,234.50`.

## 🔬 Як це працює насправді

### 🕰️ Модель Date — мілісекунди від epoch

Усередині `Date` — **одне число**: *time value*, мілісекунди від `1970-01-01T00:00:00Z` (Unix epoch) в UTC, без високосних секунд. Діапазон — ±8,64·10¹⁵ мс (±100 000 000 днів, приблизно ±273 тисячі років). Усе інше — «вигляди» цього числа:

```text
                time value = 1717243200000  (одне число, UTC)
                          │
     ┌────────────────────┼─────────────────────────┐
 getUTCHours() → 12   getHours() → 15 (Київ, UTC+3)   toISOString()
                       getHours() → 8 (Нью-Йорк, UTC−4)  "2024-06-01T12:00:00.000Z"
```

- `Date.now()` / `+new Date()` / `getTime()` — саме число.
- `getHours()`, `getDate()`… — у **локальному поясі середовища** (ОС, `TZ` у Node).
- `getUTCHours()`… та `toISOString()` — в UTC.
- Невалідна дата — `Invalid Date`, `getTime()` → `NaN`, а `toISOString()` кидає `RangeError`.

```js
const a = new Date(2024, 0, 1);
const b = new Date(2024, 0, 1);
console.log(a == b, a.getTime() === b.getTime(), b - a); // → false true 0
```

Об'єкти порівнюються за посиланням, тому `==` дає `false`; віднімання і `<`/`>` викликають `valueOf()` і порівнюють числа.

> [!quiz] Перевір себе: що зберігає Date?
> level: junior · id: jsd-24-quiz-02
>
> - [ ] Рік, місяць, день, години й часовий пояс, у якому створено
> - [x] Одне число — мілісекунди від 1970-01-01T00:00Z
> - [ ] Рядок у форматі ISO
> - [ ] Кількість секунд від epoch у локальному поясі
>
> **Пояснення:** часового поясу в `Date` немає. Локальний пояс підставляється лише під час читання методами без `UTC`.

### 🗓️ Місяці з нуля, переповнення й мутабельність

Три головні «граблі» API, скопійованого 1995 року з `java.util.Date`:

| Граблі | Приклад | Результат |
|---|---|---|
| Місяці 0–11, дні 1–31 | `new Date(2024, 1, 10)` | **10 лютого** |
| Переповнення замість помилки | `new Date(2024, 1, 30)` | 1 березня |
| День `0` = останній день попереднього місяця | `new Date(2024, 2, 0).getDate()` | `29` (днів у лютому 2024) |
| Мутабельність | `d.setDate(…)` | змінює **той самий** об'єкт |
| Двозначний рік | `new Date(99, 0)` | 1999 рік |

Переповнення інколи корисне (`new Date(y, m + 1, 0)` — останній день місяця), але частіше створює баги на кшталт «додали місяць до 31 січня — отримали березень». А мутабельність означає: передав дату у функцію — функція може її змінити.

```js
function addDays(date, n) {
  const copy = new Date(date); // ✅ копія, а не мутація аргументу
  copy.setDate(copy.getDate() + n);
  return copy;
}
console.log(addDays(new Date(2024, 0, 30), 3).toDateString()); // → Fri Feb 02 2024
```

> [!quiz] Перевір себе: останній день місяця
> level: middle · type: output · id: jsd-24-quiz-03
>
> ```js
> console.log(new Date(2023, 2, 0).getDate(), new Date(2024, 2, 0).getDate());
> ```
>
> **Відповідь:** `28 29`
>
> **Пояснення:** місяць `2` — березень, день `0` — «день перед 1 березня», тобто останній день лютого. 2024 — високосний.

> [!quiz] Склади `addDays`, що не мутує аргумент
> level: junior · type: order · id: jsd-24-quiz-09
>
> ```js order
> function addDays(date, n) {
>   const copy = new Date(date)
>   copy.setDate(copy.getDate() + n)
>   return copy
> }
>   date.setDate(date.getDate() + n) // ✗
> ```
>
> **Пояснення:** `Date` мутабельний, тож спершу копія. `setDate` з «переповненням» сам перейде через межу місяця чи року: 30 січня + 3 дні = 2 лютого.

### 🧩 Парсинг рядків — мінне поле

Специфікація гарантує лише **один** формат — спрощений ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`). Усе інше — «на розсуд рушія». А всередині ISO є підступ:

| Рядок | Як парситься | Київ (UTC+2 взимку) → `toISOString()` |
|---|---|---|
| `'2024-03-10'` | лише дата → **UTC** | `2024-03-10T00:00:00.000Z` |
| `'2024-03-10T00:00'` | дата-час без зсуву → **локальний** | `2024-03-09T22:00:00.000Z` |
| `'2024-03-10T00:00Z'` | явний UTC | `2024-03-10T00:00:00.000Z` |
| `'2024-03-10T00:00+02:00'` | явний зсув | `2024-03-09T22:00:00.000Z` |
| `'03/10/2024'`, `'10.03.2024'` | не стандарт — залежить від рушія | 🎲 |

Наслідок: `new Date('2024-03-10')` у Нью-Йорку покаже **9 березня** ввечері, бо це UTC-північ. Правила безпеки:

- Обмінюйся з бекендом **лише ISO з `Z` або зсувом** (або числом мс).
- Не парси локалізовані рядки (`10.03.2024`) через `new Date` — розбирай вручну або бібліотекою.
- Перевіряй валідність: `Number.isNaN(date.getTime())`.

> [!quiz] Перевір себе: який день?
> level: middle · id: jsd-24-quiz-04
>
> Користувач у Нью-Йорку (UTC−5). Що поверне `new Date('2024-03-10').getDate()`?
>
> - [ ] `10`
> - [x] `9`
> - [ ] `NaN`
> - [ ] Залежить від браузера
>
> **Пояснення:** ISO-рядок **лише з датою** трактується як UTC-північ, а `getDate()` читає в локальному поясі: 00:00 UTC — це ще 9 березня, 19:00 у Нью-Йорку.

### 🌍 Часові пояси й DST

**Зсув** (`+02:00`) — це не **часовий пояс** (`Europe/Kyiv`). Пояс — набір правил з бази IANA tz: коли переводять годинник, як змінювались зсуви історично. Через DST (літній час) у році є день на **23 години** і день на **25 годин**:

```text
Київ, 31 березня 2024:   02:59:59 (UTC+2) ──▶ 04:00:00 (UTC+3)   година 03:xx не існує
Київ, 27 жовтня 2024:    03:59:59 (UTC+3) ──▶ 03:00:00 (UTC+2)   година 03:xx буває двічі
```

Звідси головна помилка — «додати день» як `+ 24 * 60 * 60 * 1000`:

```js
// TZ=Europe/Kyiv
const day = new Date(2024, 2, 31);                        // 31.03 00:00
const plus24h = new Date(day.getTime() + 24 * 60 * 60 * 1000);
const nextDay = new Date(day); nextDay.setDate(nextDay.getDate() + 1);
console.log(plus24h.getHours(), nextDay.getHours());      // → 1 0
console.log((nextDay - day) / 3_600_000);                 // → 23
```

Правило: **календарні** одиниці (дні, місяці) — через `setDate`/`setMonth` (вони враховують DST), **фізичні** (таймаут, тривалість) — через мілісекунди. На сервері тримай час у UTC, а пояс користувача зберігай окремо як IANA-ідентифікатор (`'Europe/Kyiv'`), не як зсув: зсув зміниться в жовтні, а пояс — ні. Поточний пояс середовища: `Intl.DateTimeFormat().resolvedOptions().timeZone`.

> [!quiz] Перевір себе: зустріч щотижня
> level: senior · type: multi · id: jsd-24-quiz-05
>
> Треба зберегти щотижневу зустріч «щопонеділка о 10:00 за Києвом». Що зберегти в БД?
>
> - [ ] Лише UTC-час першої зустрічі й додавати `7 * 24 * 3600 * 1000`
> - [x] Локальний час `10:00`, день тижня і пояс `Europe/Kyiv`
> - [ ] Зсув `+02:00`
> - [x] За потреби — обчислені UTC-моменти найближчих зустрічей як кеш
>
> **Пояснення:** після переходу на літній час «+7 днів у мс» зсуне зустріч на 11:00. Правило повторення живе в локальному часі й поясі; UTC-моменти — похідні.

### 🆕 Temporal — сучасний API дат

**Temporal** — новий глобальний об'єкт, що виправляє всі біди `Date`: незмінні значення, місяці з 1, явні часові пояси, наносекундна точність, `Duration`, календарі. Статус: **Stage 4 з березня 2026** (увійде в ES2027); є у Firefox 139+, Chrome 144+, Node 26+; Safari — у Technology Preview. Для старих середовищ — поліфіл `@js-temporal/polyfill`.

| Тип | Що це | Приклад |
|---|---|---|
| `Temporal.Instant` | точка на шкалі часу (як `Date`, але в нс) | `2024-06-01T12:00:00Z` |
| `Temporal.ZonedDateTime` | момент + пояс + календар | `2024-03-30T09:00+02:00[Europe/Kyiv]` |
| `Temporal.PlainDate` | дата без часу й поясу (день народження) | `2024-01-31` |
| `Temporal.PlainTime` | час без дати (будильник) | `09:30` |
| `Temporal.PlainDateTime` | «настінна» дата-час без поясу | `2024-03-31T03:30` |
| `Temporal.Duration` | тривалість | `P2M5D`, `PT1H30M` |

```js
// Chrome 144+, Firefox 139+, Node 26+
Temporal.PlainDate.from('2024-01-31').add({ months: 1 }).toString();
// → '2024-02-29'  (overflow: 'constrain' — без «переливання» в березень)

const meeting = Temporal.ZonedDateTime.from('2024-03-30T09:00[Europe/Kyiv]');
meeting.add({ days: 1 }).toString();  // → '2024-03-31T09:00:00+03:00[Europe/Kyiv]'
meeting.add({ hours: 24 }).toString(); // → '2024-03-31T10:00:00+03:00[Europe/Kyiv]'

Temporal.PlainDate.from('2024-01-15')
  .until('2024-03-20', { largestUnit: 'months' }).toString(); // → 'P2M5D'
Temporal.Duration.from({ hours: 1, minutes: 30 }).total('minutes'); // → 90
```

Зверни увагу: `days: 1` і `hours: 24` — **різні** операції, і Temporal змушує це розрізняти. Міст зі старим світом: `date.toTemporalInstant()` і `Temporal.Instant.fromEpochMilliseconds(ms)`.

> [!quiz] Перевір себе: який тип Temporal?
> level: middle · id: jsd-24-quiz-06
>
> Який тип найкраще підходить для **дати народження** користувача?
>
> - [ ] `Temporal.Instant`
> - [ ] `Temporal.ZonedDateTime`
> - [x] `Temporal.PlainDate`
> - [ ] `Temporal.Duration`
>
> **Пояснення:** день народження — календарна дата без часу й поясу. Якщо зберегти його як момент у UTC, то в іншому поясі він «з'їде» на день — класичний баг з `Date`.

### 🔤 Intl.DateTimeFormat і RelativeTimeFormat

`Intl` (ECMA-402) — вбудована інтернаціоналізація на даних CLDR. Створи форматер **один раз** (це дорого) і перевикористовуй.

```js
const at = new Date('2024-06-01T12:00:00Z');
const fmt = (opts) => new Intl.DateTimeFormat('uk-UA', opts).format(at);

fmt({ dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Kyiv' });
// → 'субота, 1 червня 2024 р. о 15:00'
fmt({ dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York' });
// → '1 черв. 2024 р., 08:00'
```

- `timeZone` — показати момент у будь-якому поясі, не змінюючи `TZ` середовища.
- `formatToParts()` — масив частин (`{ type: 'hour', value: '15' }`) для власної верстки.
- `formatRange(a, b)` — `'1–7 черв. 2024 р.'`.
- Українська граматика вбудована: `{ day: 'numeric', month: 'long' }` → `'8 березня'` (родовий відмінок), а `{ month: 'long' }` → `'березень'`.

**`Intl.RelativeTimeFormat`** — «5 хвилин тому», «через 2 тижні»:

```js
const rtf = new Intl.RelativeTimeFormat('uk', { numeric: 'auto' });
rtf.format(-1, 'day');   // → 'учора'
rtf.format(-3, 'hour');  // → '3 години тому'
rtf.format(2, 'week');   // → 'через 2 тижні'
```

Без `numeric: 'auto'` замість «учора» буде «1 день тому». Різницю (скільки саме годин/днів) рахуєш сам — форматер лише перекладає число й одиницю.

> [!quiz] Перевір себе: відносний час
> level: junior · id: jsd-24-quiz-07
>
> Що поверне `new Intl.RelativeTimeFormat('uk', { numeric: 'auto' }).format(1, 'day')`?
>
> - [ ] `'через 1 день'`
> - [x] `'завтра'`
> - [ ] `'1 день'`
>
> **Пояснення:** `numeric: 'auto'` дозволяє словесні форми для ±1 і 0 (`завтра`, `учора`, `сьогодні`). З `numeric: 'always'` (за замовчуванням) — `'через 1 день'`.

### 🔢 NumberFormat, PluralRules, Collator, ListFormat

**`Intl.NumberFormat`** — числа, валюти, відсотки, одиниці, компактний запис:

```js
const uk = (opts, v) => new Intl.NumberFormat('uk-UA', opts).format(v);
uk({}, 1234567.891);                                // → '1 234 567,891'
uk({ style: 'currency', currency: 'UAH' }, 1234.5); // → '1 234,50 ₴'
uk({ style: 'percent' }, 0.256);                    // → '26%'
uk({ notation: 'compact' }, 1234567);               // → '1,2 млн'
uk({ style: 'unit', unit: 'kilometer-per-hour' }, 90); // → '90 км/год'
```

Розділювач тисяч в `uk` — **нерозривний пробіл** `U+00A0`, тож `format(1234.5) === '1 234,5'` зі звичайним пробілом дає `false` (класичний «падаючий» тест).

**`Intl.PluralRules`** — головне для української: у нас **чотири** категорії, а не дві, як в англійській.

| Категорія | Числа | «хвилина» |
|---|---|---|
| `one` | 1, 21, 31, 101… (крім 11) | 1 хвилин**а** |
| `few` | 2–4, 22–24… (крім 12–14) | 2 хвилин**и** |
| `many` | 0, 5–20, 25–30, 11–14, 111… | 5 хвилин |
| `other` | дробові: 1,5; 0,3 | 1,5 хвилин**и** |

```js
const pr = new Intl.PluralRules('uk-UA');
const forms = { one: 'хвилина', few: 'хвилини', many: 'хвилин', other: 'хвилини' };
const nf = new Intl.NumberFormat('uk-UA');
const say = (n) => `${nf.format(n)} ${forms[pr.select(n)]}`;
console.log([1, 2, 5, 11, 21, 22, 1.5].map(say).join(', '));
// → 1 хвилина, 2 хвилини, 5 хвилин, 11 хвилин, 21 хвилина, 22 хвилини, 1,5 хвилини
```

**`Intl.Collator`** — сортування за правилами мови. Звичайний `sort()` порівнює UTF-16 коди, і українські `є`, `і`, `ї`, `ґ` (які лежать поза блоком `а–я`) опиняються не на своїх місцях:

```js
const words = ['їжак', 'яблуко', 'ґанок', 'Єнот', 'інжир', 'груша'];
words.sort(new Intl.Collator('uk').compare);
// → ['груша', 'ґанок', 'Єнот', 'інжир', 'їжак', 'яблуко']
['файл10', 'файл2', 'файл1'].sort(new Intl.Collator('uk', { numeric: true }).compare);
// → ['файл1', 'файл2', 'файл10']
```

**`Intl.ListFormat`** — `['Київ', 'Львів', 'Одеса']` → `'Київ, Львів і Одеса'`; з `type: 'disjunction'` — `'чай або кава'`.

> [!quiz] Перевір себе: українська множина
> level: middle · type: multi · id: jsd-24-quiz-08
>
> Для яких чисел `new Intl.PluralRules('uk').select(n)` поверне `'few'`?
>
> - [x] `3`
> - [ ] `12`
> - [x] `22`
> - [ ] `25`
> - [x] `104`
> - [ ] `1.5`
>
> **Пояснення:** `few` — числа, що закінчуються на 2–4, крім 12–14. `12` і `25` — `many`, а дробові — `other`.

> [!quiz] Заповни пропуски: «3 файли» через PluralRules
> level: middle · type: fill · id: jsd-24-quiz-10 · bank: NumberFormat, format, файлів
>
> ```js fill
> const pr = new Intl.[[PluralRules]]('uk')
> const forms = { one: 'файл', few: 'файли', many: 'файлів', other: 'файлу' }
> const label = (n) => `${n} ${forms[pr.[[select]](n)]}`
> label(3) // → '3 [[файли]]'
> ```
>
> **Пояснення:** `PluralRules#select` повертає категорію (`one`, `few`, `many`, `other`), а слово обираєш ти. `3` закінчується на 2–4 і не належить до 12–14, тож це `few`.

## ⚠️ Пастки

> [!pitfall] new Date('2024-03-10') — це UTC, а не «сьогодні»
> Дата без часу парситься як UTC-північ, а з часом без зсуву — як локальна. У поясах на захід від Гринвіча дата «з'їжджає» на день назад. Для календарних дат використовуй `Temporal.PlainDate` або розбирай рядок вручну: `new Date(y, m - 1, d)`.

> [!pitfall] Додати день = додати 24 години? Ні
> Двічі на рік день триває 23 або 25 годин. `setDate(getDate() + 1)` і `Temporal` `add({ days: 1 })` враховують DST, а `+ 86_400_000` — ні.

> [!pitfall] Date мутабельний
> ```js
> const start = new Date(2024, 0, 1);
> const end = start;            // те саме посилання!
> end.setMonth(11);
> start.getMonth();             // → 11 😱
> ```
>
> Копіюй: `new Date(start)`. Temporal-об'єкти незмінні — `add()` повертає новий.

> [!pitfall] toLocaleString у циклі
> `date.toLocaleString('uk-UA', opts)` щоразу створює внутрішній форматер. Для списку з тисяч рядків створи `new Intl.DateTimeFormat(...)` один раз і викликай `.format()`.

## 🎤 На співбесіді

> [!interview] Як Date зберігає час і чому з часовими поясами стільки проблем?
> level: middle · frequency: часто · id: jsd-24-int-01
>
> ---
>
> `Date` зберігає одне число — мілісекунди від 1970-01-01T00:00Z, без поясу. Методи `getHours`/`getDate` інтерпретують його в локальному поясі середовища, `getUTC*` і `toISOString` — в UTC. Проблеми: рядок «лише дата» парситься як UTC, а дата-час без зсуву — як локальний; через DST доба буває 23 і 25 годин, тож `+24h` ≠ «наступний день»; зсув `+02:00` ≠ пояс `Europe/Kyiv`. Практика: на сервері й у мережі — UTC/ISO із `Z`, пояс користувача — окремо як IANA-ідентифікатор, відображення — через `Intl.DateTimeFormat` з `timeZone`, а для календарної логіки — Temporal.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🌍 Часові пояси й DST|Розділ: пояси й DST]] · [MDN: Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) · [Spec: Time Values and Time Range](https://tc39.es/ecma262/#sec-time-values-and-time-range)

> [!interview] Що таке Temporal і чим він кращий за Date?
> level: senior · frequency: іноді · id: jsd-24-int-02
>
> ---
>
> Новий вбудований API дат (Stage 4 з 2026, ES2027; Firefox 139+, Chrome 144+, Node 26+). Значення незмінні, місяці з 1, наносекундна точність, явне розділення типів: `Instant` (момент), `ZonedDateTime` (момент + пояс), `PlainDate`/`PlainTime`/`PlainDateTime` (без поясу), `Duration`. Арифметика розрізняє календарні й фізичні одиниці (`add({ days: 1 })` vs `add({ hours: 24 })`), має контроль переповнення (`overflow: 'constrain' | 'reject'`) і неоднозначного часу при DST (`disambiguation`). Строгий парсинг лише RFC 9557/ISO. Для старих середовищ — поліфіл.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🆕 Temporal — сучасний API дат|Розділ: Temporal]] · [MDN: Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) · [Temporal docs](https://tc39.es/proposal-temporal/docs/)

> [!interview] Як правильно вивести «5 файлів / 2 файли / 1 файл» українською?
> level: middle · frequency: іноді · id: jsd-24-int-03
>
> ---
>
> Через `Intl.PluralRules('uk')`: `select(n)` повертає категорію `one`/`few`/`many`/`other` за правилами CLDR (1, 21 → `one`; 2–4, 22–24 → `few`; 0, 5–20, 25… → `many`; дробові → `other`), а я підставляю відповідну форму слова з мапи. `if (n === 1)` з англійської логіки ламається вже на 21 і 2. Саме число форматую `Intl.NumberFormat`, щоб отримати `1,5`, а не `1.5`. У i18n-бібліотеках (ICU MessageFormat, i18next) це ж робиться синтаксисом `{count, plural, one {…} few {…} many {…} other {…}}`.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🔢 NumberFormat, PluralRules, Collator, ListFormat|Розділ: PluralRules]] · [MDN: Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) · [CLDR: Plural rules](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html)

## 🔗 Зв'язки

- [[JavaScript - 02. Типи та приведення типів]] — `Date` у `+`, `-` і порівняннях: `valueOf` проти `toString`.
- [[JavaScript - 17. Числа, BigInt і математика]] — чому мс у `Number` безпечні, а наносекунди Temporal — `BigInt`.
- [[JavaScript - 18. Рядки, Unicode і регулярні вирази]] — `localeCompare`, Unicode і чому `sort()` порівнює коди UTF-16.
- [[JavaScript - 23. JSON, structuredClone і серіалізація]] — `Date.prototype.toJSON` і відновлення дат `reviver`-ом.
- [[JavaScript - 34. Сучасний JS і TC39]] — як Temporal пройшов шлях від Stage 1 до Stage 4.

## ⚡ Фішки

> [!reel] 📆 Місяці в Date — з нуля, дні — з одиниці
> `new Date(2024, 1, 10)` — це 10 **лютого**. API скопіювали з Java 1995 року, де помилку пізніше визнали. Temporal нарешті рахує місяці з 1.

> [!reel] ⏰ У році є доба на 23 години
> У день переходу на літній час година 03:00–03:59 у Києві не існує. `+ 86_400_000` мс дасть не північ наступного дня, а 01:00.

> [!reel] 🇺🇦 В українській 4 форми множини
> `Intl.PluralRules('uk')` знає `one`, `few`, `many` і `other`: 1 хвилина, 2 хвилини, 5 хвилин, 1,5 хвилини. В англійській — лише дві.

> [!reel] 🔤 sort() ставить «Є» перед «а»
> Звичайний `sort()` порівнює коди UTF-16, а `Є`, `І`, `Ї`, `Ґ` лежать поза блоком `А–я`. `Intl.Collator('uk')` сортує за абеткою.

> [!reel] 🧪 '1 234,5' !== '1 234,5'
> `Intl.NumberFormat('uk')` розділяє тисячі нерозривним пробілом `U+00A0`. Тест, що порівнює зі звичайним пробілом, падає.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Що повертає `Date.now()`?
> *часто · теорія* · `jsd-24-001`
>
> Число мілісекунд від 1970-01-01T00:00:00Z (Unix epoch) — поточний time value без жодного поясу. Те саме дає `new Date().getTime()`.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🕰️ Модель Date — мілісекунди від epoch|Розділ: модель Date]] · [MDN: Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

> [!question]- Чому `new Date(2024, 1, 10)` — це лютий?
> *часто · код* · `jsd-24-002`
>
> Місяці в `Date` нумеруються з 0 (0 — січень, 11 — грудень), а дні — з 1. Неіснуючі значення переповнюються: `new Date(2024, 1, 30)` → 1 березня.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🗓️ Місяці з нуля, переповнення й мутабельність|Розділ: місяці й переповнення]] · [javascript.info: Date and time](https://javascript.info/date)

> [!question]- Як порівняти дві дати?
> *часто · код* · `jsd-24-003`
>
> Через числа: `a.getTime() === b.getTime()` для рівності, `a < b` або `a - b` для порядку (працює `valueOf`). `a == b` і `a === b` порівнюють посилання і для різних об'єктів завжди `false`.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🕰️ Модель Date — мілісекунди від epoch|Розділ: порівняння]] · [MDN: Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

### 🟡 Middle

> [!question]- Чому `new Date('2024-03-10')` і `new Date('2024-03-10T00:00')` — різні моменти?
> *часто · порівняння* · `jsd-24-004`
>
> За специфікацією ISO-форма **лише з датою** — це UTC, а дата-час **без зсуву** — локальний час. Різниця дорівнює зсуву поясу. Рішення — завжди передавати `Z`/зсув або використовувати `Temporal.PlainDate` для календарних дат.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🧩 Парсинг рядків — мінне поле|Розділ: парсинг]] · [Spec: Date Time String Format](https://tc39.es/ecma262/#sec-date-time-string-format)

> [!question]- Як коректно додати до дати один календарний день?
> *часто · код* · `jsd-24-005`
>
> `const d = new Date(src); d.setDate(d.getDate() + 1);` — враховує DST і кінець місяця. Або `zdt.add({ days: 1 })` у Temporal. Додавати `86 400 000` мс не можна: у день переходу на літній/зимовий час доба має 23 або 25 годин.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🌍 Часові пояси й DST|Розділ: DST]] · [MDN: Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

> [!question]- Чим часовий пояс відрізняється від зсуву?
> *іноді · теорія* · `jsd-24-006`
>
> Зсув (`+03:00`) — різниця з UTC в один момент. Пояс (`Europe/Kyiv`) — правила з бази IANA: коли й як змінюється зсув (DST, історичні реформи). Для майбутніх подій і повторень треба зберігати пояс, а не зсув.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🌍 Часові пояси й DST|Розділ: пояси]] · [IANA: Time Zone Database](https://www.iana.org/time-zones)

> [!question]- Як відсортувати українські слова за абеткою?
> *іноді · код* · `jsd-24-007`
>
> `arr.sort(new Intl.Collator('uk').compare)` або `a.localeCompare(b, 'uk')`. Звичайний `sort()` порівнює коди UTF-16, тож `є`, `і`, `ї`, `ґ` стають не на місце. `{ numeric: true }` — природне сортування `файл2` < `файл10`.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🔢 NumberFormat, PluralRules, Collator, ListFormat|Розділ: Collator]] · [MDN: Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)

### 🔴 Senior

> [!question]- Які типи є в Temporal і коли який брати?
> *іноді · порівняння* · `jsd-24-008`
>
> `Instant` — точний момент (логи, таймстемпи). `ZonedDateTime` — момент + пояс (зустрічі, арифметика з DST). `PlainDate` — дата без поясу (день народження), `PlainTime` — будильник, `PlainDateTime` — «настінний» час без поясу. `Duration` — тривалість. Усі незмінні, місяці з 1.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🆕 Temporal — сучасний API дат|Розділ: Temporal]] · [MDN: Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)

> [!question]- Чому `add({ days: 1 })` і `add({ hours: 24 })` у Temporal дають різне?
> *рідко · код* · `jsd-24-009`
>
> `days` — календарна одиниця: той самий настінний час наступного дня (09:00 → 09:00, навіть якщо доба мала 23 години). `hours` — фізична: рівно 24 години на шкалі часу (09:00 → 10:00 після переходу на літній час). Temporal змушує явно обрати семантику.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🆕 Temporal — сучасний API дат|Розділ: арифметика Temporal]] · [Temporal docs: ZonedDateTime](https://tc39.es/proposal-temporal/docs/)

> [!question]- Які категорії множини в українській і як їх отримати?
> *іноді · теорія* · `jsd-24-010`
>
> Чотири: `one` (1, 21, 101…), `few` (2–4, 22–24…), `many` (0, 5–20, 11–14, 25…), `other` (дробові). `new Intl.PluralRules('uk').select(n)` повертає категорію; `resolvedOptions().pluralCategories` — повний список. Для порядкових («1-й») є `{ type: 'ordinal' }`.
>
> 📚 [[JavaScript - 24. Дати, час та Intl#🔢 NumberFormat, PluralRules, Collator, ListFormat|Розділ: PluralRules]] · [Spec: Intl.PluralRules](https://tc39.es/ecma402/#sec-intl-pluralrules-constructor)

## 🛠️ Практика

> [!task] Поясни своїми словами: чому в Нью-Йорку «з'їхала» дата
> level: junior · difficulty: easy · id: jsd-24-task-01 · tags: feynman, date, timezone
>
> Бекенд віддає `"birthday": "1995-08-24"`, фронтенд показує `new Date(birthday).toLocaleDateString()`. Користувачі в Києві бачать 24.08.1995, а в Нью-Йорку — 23.08.1995. Поясни менеджеру (без жаргону, до 5 речень), чому так і як виправити.
>
> > [!hint]- Підказка 1
> > Як `Date` парсить рядок лише з датою і що він зберігає всередині?
>
> > [!hint]- Підказка 2
> > Чи є в дня народження «момент у часі»?
>
> > [!solution]- Еталонне пояснення
> > `Date` зберігає не «день», а точну мить — і рядок «1995-08-24» він розуміє як північ 24 серпня **за Гринвічем**. У Києві в цей момент уже 03:00 24 серпня, а в Нью-Йорку ще 20:00 **23 серпня** — тож браузер чесно показує місцеву дату. Але день народження — це не мить, а просто дата в календарі, однакова в усьому світі. Виправлення: не перетворювати таку дату на `Date`, а показувати як є (`Temporal.PlainDate.from(birthday)`), або форматувати з `timeZone: 'UTC'`, або розбирати вручну: `new Date(y, m - 1, d)`.

> [!task] «5 хвилин тому» українською
> level: middle · difficulty: medium · id: jsd-24-task-02 · tags: intl, relative-time
>
> Напиши `timeAgo(date, now = new Date())`, що повертає відносний час українською, обираючи найбільшу доречну одиницю: секунди (< 60 с), хвилини, години, дні, тижні (< 5), місяці, роки. Майбутні дати — «через …». Для ±1 дня — «учора/завтра».
>
> ```js
> timeAgo(new Date(Date.now() - 5 * 60_000)); // → '5 хвилин тому'
> timeAgo(new Date(Date.now() - 26 * 3_600_000)); // → 'учора'
> ```
>
> ```js starter
> const rtf = new Intl.RelativeTimeFormat('uk', { numeric: 'auto' })
>
> function timeAgo(date, now = new Date()) {
>   // твій код
> }
> ```
>
> ```js tests
> const NOW = new Date('2024-06-01T12:00:00Z')
> const ago = (ms) => new Date(NOW.getTime() - ms)
>
> test('хвилини в минулому', () => {
>   expect(timeAgo(ago(5 * 60_000), NOW)).toBe('5 хвилин тому')
> })
>
> test('секунди для різниці менше хвилини', () => {
>   expect(timeAgo(ago(30_000), NOW)).toBe('30 секунд тому')
> })
>
> test('±1 день — учора', () => {
>   expect(timeAgo(ago(26 * 3_600_000), NOW)).toBe('учора')
> })
>
> test('майбутнє — «через …»', () => {
>   expect(timeAgo(new Date(NOW.getTime() + 3 * 86_400_000), NOW)).toBe('через 3 дні')
> })
>
> test('тижні й місяці обираються як найбільша доречна одиниця', () => {
>   expect(timeAgo(ago(14 * 86_400_000), NOW)).toBe('2 тижні тому')
>   expect(timeAgo(ago(92 * 86_400_000), NOW)).toBe('3 місяці тому')
> })
>
> test('now за замовчуванням — поточний момент', () => {
>   vi.useFakeTimers()
>   vi.setSystemTime(NOW.getTime())
>   expect(timeAgo(ago(2 * 3_600_000))).toBe('2 години тому')
> })
> ```
>
> > [!hint]- Підказка 1
> > `Intl.RelativeTimeFormat('uk', { numeric: 'auto' })` уже знає «учора» і відмінки — тобі лише обрати одиницю й число.
>
> > [!hint]- Підказка 2
> > Таблиця порогів у секундах: `[60, 'second'], [3600, 'minute'], [86400, 'hour'], …`; йди від меншої одиниці до більшої.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const rtf = new Intl.RelativeTimeFormat('uk', { numeric: 'auto' });
> > const UNITS = [
> >   ['second', 60],
> >   ['minute', 60],
> >   ['hour', 24],
> >   ['day', 7],
> >   ['week', 4.345],
> >   ['month', 12],
> >   ['year', Infinity],
> > ];
> >
> > function timeAgo(date, now = new Date()) {
> >   let value = (date - now) / 1000; // секунди, мінус = минуле
> >   for (const [unit, size] of UNITS) {
> >     if (Math.abs(value) < size) return rtf.format(Math.round(value), unit);
> >     value /= size;
> >   }
> > }
> >
> > timeAgo(new Date(Date.now() - 5 * 60_000));     // → '5 хвилин тому'
> > timeAgo(new Date(Date.now() - 26 * 3_600_000)); // → 'учора'
> > timeAgo(new Date(Date.now() + 3 * 86_400_000)); // → 'через 3 дні'
> > ```
> >
> > Форматер створюється один раз поза функцією. Місяць ≈ 4,345 тижня — для «тому» цього досить; для точної календарної різниці бери Temporal `until()`.

> [!task] pluralize і formatDuration для інтерфейсу
> level: senior · difficulty: hard · id: jsd-24-task-03 · tags: intl, plural-rules, duration
>
> 1. Напиши `pluralize(n, forms, locale = 'uk')`, де `forms = { one, few, many, other }`, що повертає рядок «число + форма» з локалізованим числом.
> 2. На його основі — `formatDuration(ms)`: `90_061_000` → `'1 день 1 година 1 хвилина 1 секунда'`, нульові частини пропускаються, `0` → `'0 секунд'`.
>
> ```js starter
> function pluralize(n, forms, locale = 'uk') {
>   // твій код
> }
>
> function formatDuration(ms) {
>   // твій код
> }
> ```
>
> ```js tests
> const FILES = { one: 'файл', few: 'файли', many: 'файлів', other: 'файлу' }
>
> test('pluralize обирає українську форму', () => {
>   expect(pluralize(1, FILES)).toBe('1 файл')
>   expect(pluralize(3, FILES)).toBe('3 файли')
>   expect(pluralize(11, FILES)).toBe('11 файлів')
>   expect(pluralize(21, FILES)).toBe('21 файл')
> })
>
> test('pluralize форматує число за локаллю (дроби й тисячі)', () => {
>   expect(pluralize(1.5, FILES)).toBe('1,5 файлу')
>   expect(pluralize(1234, FILES)).toBe('1\u00a0234 файли') // нерозривний пробіл
> })
>
> test('formatDuration — усі частини', () => {
>   expect(formatDuration(90_061_000)).toBe('1 день 1 година 1 хвилина 1 секунда')
> })
>
> test('formatDuration пропускає нульові частини', () => {
>   expect(formatDuration(2 * 3_600_000 + 5 * 1000)).toBe('2 години 5 секунд')
> })
>
> test('formatDuration(0) — 0 секунд', () => {
>   expect(formatDuration(0)).toBe('0 секунд')
> })
> ```
>
> > [!hint]- Підказка 1
> > Кешуй `Intl.PluralRules` і `Intl.NumberFormat` за локаллю в `Map` — створювати їх на кожен виклик дорого.
>
> > [!hint]- Підказка 2
> > Розклади мс на дні/години/хвилини/секунди цілочисельним діленням і остачею.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const cache = new Map();
> > function tools(locale) {
> >   if (!cache.has(locale)) {
> >     cache.set(locale, { pr: new Intl.PluralRules(locale), nf: new Intl.NumberFormat(locale) });
> >   }
> >   return cache.get(locale);
> > }
> >
> > function pluralize(n, forms, locale = 'uk') {
> >   const { pr, nf } = tools(locale);
> >   const form = forms[pr.select(n)] ?? forms.other;
> >   return `${nf.format(n)} ${form}`;
> > }
> >
> > const WORDS = {
> >   day: { one: 'день', few: 'дні', many: 'днів', other: 'дня' },
> >   hour: { one: 'година', few: 'години', many: 'годин', other: 'години' },
> >   minute: { one: 'хвилина', few: 'хвилини', many: 'хвилин', other: 'хвилини' },
> >   second: { one: 'секунда', few: 'секунди', many: 'секунд', other: 'секунди' },
> > };
> >
> > function formatDuration(ms) {
> >   let s = Math.floor(ms / 1000);
> >   const parts = [
> >     ['day', Math.floor(s / 86_400)],
> >     ['hour', Math.floor((s %= 86_400) / 3_600)],
> >     ['minute', Math.floor((s %= 3_600) / 60)],
> >     ['second', s % 60],
> >   ].filter(([, v]) => v > 0);
> >   if (parts.length === 0) return pluralize(0, WORDS.second);
> >   return parts.map(([unit, v]) => pluralize(v, WORDS[unit])).join(' ');
> > }
> >
> > console.log(formatDuration(90_061_000)); // → 1 день 1 година 1 хвилина 1 секунда
> > console.log(formatDuration(0));          // → 0 секунд
> > console.log(pluralize(22, WORDS.day));   // → 22 дні
> > ```
> >
> > У сучасних рушіях є й готовий `Intl.DurationFormat('uk', { style: 'long' })` → `'1 година і 5 хвилин'`. Але `pluralize` знадобиться для будь-яких іменників: «3 файли», «21 коментар».

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Date and time](https://javascript.info/date) — основи `Date`, автокорекція, бенчмарки.
- 🟡 [MDN — Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) — модель time value, формати парсингу, сумісність.
- 🟡 [MDN — Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) — усі типи Temporal і підтримка браузерами.
- 🟡 [Temporal documentation](https://tc39.es/proposal-temporal/docs/) — офіційна документація з кукбуком типових задач.
- 🟡 [MDN — Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) — огляд усіх форматерів і переговорів локалей.
- 🟡 [MDN — Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) — категорії множини й порядкові числа.
- 🔴 [Unicode CLDR — Language Plural Rules](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html) — точні правила для української та інших мов.
- 🔴 [ECMAScript — Date Time String Format](https://tc39.es/ecma262/#sec-date-time-string-format) — єдиний гарантований формат парсингу.
- 🔴 [ECMA-402 — Internationalization API](https://tc39.es/ecma402/) — специфікація `Intl`.

> [!important] Підсумок
> - `Date` — одне число мс від epoch в UTC; пояс підставляється лише при читанні. Місяці з 0, переповнення замість помилок, мутабельність.
> - Парси лише ISO із `Z`/зсувом; «лише дата» = UTC, «дата-час без зсуву» = локальний.
> - DST: доба буває 23/25 годин — календарні одиниці через `setDate`/Temporal, фізичні — через мс; зберігай пояс (IANA), а не зсув.
> - Temporal (Stage 4, ES2027): незмінні `Instant`, `ZonedDateTime`, `PlainDate`, `Duration`, явна семантика арифметики.
> - `Intl`: дати, числа, валюти, «учора», списки, сортування й 4 українські форми множини — форматери створюй один раз.

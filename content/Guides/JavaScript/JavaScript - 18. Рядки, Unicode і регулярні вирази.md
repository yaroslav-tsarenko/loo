---
title: Рядки, Unicode і регулярні вирази
order: 18
level: middle
tags: [strings, unicode, utf-16, template-literals, regexp, redos]
prerequisites:
  - "[[JavaScript - 02. Типи та приведення типів]]"
  - "[[JavaScript - 11. Ітератори та генератори]]"
estimatedMinutes: 55
id: jsd-ch-18
icon: "🔤"
---

# Рядки, Unicode і регулярні вирази

> [!success] 🎯 Після цього розділу ти зможеш
> - пояснити, чому `'👨‍👩‍👧'.length === 8`, і порахувати «видимі символи» через `Intl.Segmenter`;
> - розрізнити code unit, code point і grapheme cluster та обрати правильний спосіб ітерації рядка;
> - написати tagged template, що екранує HTML, і пояснити, що лежить у `strings.raw`;
> - читати й писати регулярні вирази з групами, іменованими групами, lookaround-ами і прапорцями `g i m s u v y d`;
> - розпізнати regex, вразливий до catastrophic backtracking (ReDoS), і переписати його.

## 🤔 Передбач

> [!quiz] Що виведе код?
> level: middle · type: output · id: jsd-18-quiz-01
>
> ```js
> const family = '👨‍👩‍👧';
> console.log(family.length, [...family].length, '😀'.split('').length);
> ```
>
> **Відповідь:** `8 5 2`
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `length` рахує **16-бітні code units** UTF-16. Сімейка — це три емодзі (по 2 units кожне) і два невидимі з'єднувачі ZWJ (по 1) = 8. Spread ітерує **code points** — 5. А `split('')` ріже по code units і розриває емодзі на дві «половинки».

## 🧒 Простими словами

Уяви, що текст — це намисто. Те, що бачить людина, — це **намистини** («літера», «емодзі»). Але деякі намистини зроблені з кількох скріплених бусинок: прапор — із двох, сім'я — з п'ятьох, а «é» буває однією бусинкою або двома (буква + наголос). А JavaScript ще й міряє намисто не бусинками, а **половинками бусинок**: більшість бусинок займає одну половинку, а емодзі — дві. Тому «довжина рядка» в JS — це кількість половинок, а не кількість того, що бачить людина.

## 🔬 Як це працює насправді

### 🧵 Рядки незмінні і зберігаються в UTF-16

Рядок у JS — **незмінна** (immutable) послідовність 16-бітних значень — **code units** у кодуванні UTF-16. Жоден метод не змінює рядок — усі повертають новий. Запис за індексом у sloppy mode тихо ігнорується, у strict mode кидає `TypeError`.

```js
const s = 'abc';
s[0] = 'z';                     // ігнорується (у strict mode — TypeError)
console.log(s, s.toUpperCase(), s); // → 'abc' 'ABC' 'abc'
```

Наслідок для продуктивності: склеювання в циклі створює нові рядки, але рушії оптимізують `+=` через ropes (дерева конкатенацій), тож для звичайних обсягів `+=` і `array.join('')` майже рівні.

**Як Unicode лягає в UTF-16:**

```text
  Unicode code point          UTF-16 code units          length
  'A'   U+0041          →     0x0041                       1
  'Ж'   U+0416          →     0x0416                       1
  '😀'  U+1F600         →     0xD83D 0xDE00  (surrogate pair) 2
  'é'   U+00E9          →     0x00E9                       1   (NFC: одна літера)
  'é'   U+0065 U+0301   →     0x0065 0x0301                2   (NFD: e + наголос)
  '🇺🇦'  U+1F1FA U+1F1E6 →     4 units                       4   (два «регіональні індикатори»)
```

Символи з базової площини (BMP, до `U+FFFF`) займають 1 unit, решта — **сурогатну пару** з 2 units. Кирилиця, латиниця, більшість ієрогліфів — у BMP; емодзі, рідкісні ієрогліфи, математичні символи — ні.

> [!viz] unicode-string
> scenario: code-units

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-18-quiz-02
>
> ```js
> const s = 'Київ😀';
> console.log(s.length, s.charCodeAt(4) === s.codePointAt(4), s.at(-1) === '😀');
> ```
>
> **Відповідь:** `6 false false`
>
> **Пояснення:** 4 кириличні літери по 1 unit + емодзі з 2 units = 6. `charCodeAt(4)` повертає лише першу половину пари (`0xD83D`), а `codePointAt(4)` — цілий code point `0x1F600`. `at(-1)` бере останній **code unit** — другу половинку пари, а не емодзі.

### 🧩 Code units, code points і графеми

Три рівні «символу» — і в JS є інструмент для кожного:

| Рівень | Що це | Як ітерувати | `'👨‍👩‍👧'` |
|---|---|---|---|
| Code unit | 16-бітне значення UTF-16 | `str[i]`, `length`, `charCodeAt`, `split('')`, `slice` | 8 |
| Code point | один символ Unicode | `for…of`, `[...str]`, `Array.from`, `codePointAt`, regex з `u` | 5 |
| Grapheme cluster | те, що людина бачить як «один символ» | `Intl.Segmenter` | 1 |

```js
const text = 'e\u0301🇺🇦👍🏽';            // é (2 code points), прапор, лайк з відтінком шкіри
const graphemes = [...new Intl.Segmenter('uk', { granularity: 'grapheme' }).segment(text)];
console.log(text.length, [...text].length, graphemes.length); // → 10 6 3
console.log(graphemes.map((g) => g.segment));                 // → ['é', '🇺🇦', '👍🏽']
```

`Intl.Segmenter` вміє й `granularity: 'word'` — розбиття на слова з урахуванням мови (для японської чи тайської, де немає пробілів, це єдиний надійний спосіб).

**Нормалізація.** Одна й та сама літера може мати різні послідовності code points: `'é'` (U+00E9) і `'e' + U+0301`. Вони виглядають однаково, але `===` вважає їх різними. Перед порівнянням, пошуком чи збереженням у БД нормалізуй:

```js
const a = 'café';             // é одним code point
const b = 'cafe\u0301';       // e + комбінований наголос
console.log(a === b, a.normalize() === b.normalize()); // → false true
console.log('Ünïcödé'.normalize('NFD').replace(/\p{Diacritic}/gu, '')); // → 'Unicode' — прибрати діакритику
```

Для обрізання тексту до N «символів» (прев'ю, лічильник у полі вводу) використовуй графеми — інакше розріжеш емодзі навпіл і отримаєш `�`.

> [!quiz] Перевір себе: як правильно порахувати символи, які бачить користувач?
> level: middle · id: jsd-18-quiz-03
> - [ ] `str.length`
> - [ ] `[...str].length`
> - [x] `[...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(str)].length`
> - [ ] `str.split('').length`
>
> **Пояснення:** `length` і `split('')` рахують code units, spread — code points, але прапор чи емодзі з відтінком шкіри складаються з кількох code points. Лише сегментація на графеми відповідає людському «символу».

> [!quiz] Склади функцію, що рахує видимі символи
> level: middle · type: order · id: jsd-18-quiz-09
>
> `segmenter` уже створено один раз: `const segmenter = new Intl.Segmenter('uk', { granularity: 'grapheme' })`.
>
> ```js order
> function countGraphemes(text) {
>   let count = 0
>   for (const _ of segmenter.segment(text)) {
>     count++
>   }
>   return count
> }
>   return text.length // ✗
> ```
>
> **Пояснення:** `segment()` повертає ітерований об'єкт графем — рахуємо їх у `for…of`. Segmenter — відносно дорогий об'єкт, тому він створений один раз поза функцією. `text.length` рахує UTF-16 code units, тож для `'👍🏽'` дасть 4 замість 1.

### 🏷️ Template literals і tagged templates

Шаблонні рядки (backticks) дають інтерполяцію `${expr}`, багаторядковість і — найцікавіше — **теги**. Тег — це функція, яку викликають з масивом **статичних частин** і значеннями виразів окремо:

```js
function inspect(strings, ...values) {
  return { strings: [...strings], raw: strings.raw, values };
}
console.log(inspect`a${1}b${2}\n`);
// → { strings: ['a', 'b', '\n'], raw: ['a', 'b', '\\n'], values: [1, 2] }
```

```text
  tag`Hello, ${name}! You have ${n} messages.`
        │        │                  │
        ▼        ▼                  ▼
  strings = ['Hello, ', '! You have ', ' messages.']   ← завжди на 1 більше за values
  values  = [name, n]
  strings.raw = ті самі частини БЕЗ обробки escape-послідовностей
```

Важливі деталі: масив `strings` **заморожений** і **кешується** для кожного місця виклику — один і той самий об'єкт при кожному виконанні цього рядка коду (бібліотеки на кшталт lit-html використовують це як ключ кешу). `String.raw` — вбудований тег, що повертає «сирий» рядок: `` String.raw`C:\new\table` `` → `'C:\new\table'` без перенесень рядка й табуляцій.

Головне застосування тегів — **безпечна інтерполяція**: тег бачить, де статичний код, а де дані, і може екранувати лише дані. Так працюють HTML-шаблони, SQL-клієнти з параметрами, styled-components, GraphQL `gql`.

```js
const escapeHtml = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function html(strings, ...values) {
  return strings.reduce((out, str, i) => out + escapeHtml(values[i - 1]) + str);
}
console.log(html`<p>${'<img src=x onerror=alert(1)>'}</p>`);
// → '<p>&lt;img src=x onerror=alert(1)&gt;</p>'
```

Про XSS і чому інтерполяція в `innerHTML` небезпечна — [[JavaScript - 30. Безпека в JavaScript]].

> [!quiz] Перевір себе: оберіть правдиві твердження про tagged templates
> level: senior · type: multi · id: jsd-18-quiz-04
> - [x] Масив `strings` завжди на один елемент довший за масив значень
> - [x] `strings.raw` містить частини без обробки escape-послідовностей
> - [ ] Тег отримує вже склеєний рядок і має його розібрати
> - [x] Для одного місця в коді `strings` — той самий заморожений об'єкт між викликами
> - [ ] Тег зобов'язаний повертати рядок
>
> **Пояснення:** тег отримує частини окремо від значень — у цьому вся сила. Повертати він може що завгодно: DOM-вузол, об'єкт запиту, React-елемент.

### 🧰 Корисні методи рядків

```js
console.log('abc'.at(-1), '7'.padStart(3, '0'), 'x'.padEnd(3, 'ab')); // → 'c' '007' 'xab'
console.log('a-b-c'.replace('-', '+'), 'a-b-c'.replaceAll('-', '+')); // → 'a+b-c' 'a+b+c'
console.log('Hello'.slice(1, -1), 'Hello'.substring(-2), ' x '.trim()); // → 'ell' 'Hello' 'x'
console.log('a,b,,c'.split(','), 'abc'.includes('b'), 'abc'.startsWith('ab')); // → ['a','b','','c'] true true
```

| Задача | Метод | Пастка |
|---|---|---|
| Останній символ | `at(-1)` | `str[-1]` — `undefined` |
| Замінити всі входження | `replaceAll(str, repl)` | `replace(str)` замінює лише перше; `replaceAll(/re/)` без `g` — `TypeError` |
| Підрядок | `slice(start, end)` | `substring` міняє місцями аргументи й не приймає від'ємні; `substr` — застарілий |
| Сортування за алфавітом | `localeCompare` / `Intl.Collator` | `sort()` порівнює code units |
| Регістр без урахування мови | `toLowerCase()` | `'ß'.toUpperCase()` → `'SS'` — довжина змінюється |

`sort()` без компаратора для української абетки помиляється: `ґ` (U+0491) і `є` (U+0454) мають коди **більші** за `ж` (U+0436).

```js
const letters = ['ж', 'є', 'а', 'ґ', 'г'];
console.log([...letters].sort());                                 // → ['а', 'г', 'ж', 'є', 'ґ'] ❌
console.log([...letters].sort(new Intl.Collator('uk').compare));  // → ['а', 'г', 'ґ', 'є', 'ж'] ✅
```

У замінах є спеціальні шаблони: `$&` — увесь збіг, `$1` — група, `$<name>` — іменована група. Рядок заміни `'$&'` з користувацького вводу може дати несподіваний результат — передавай функцію: `str.replace(re, () => userText)`.

> [!quiz] Перевір себе: що виведе код?
> level: middle · type: output · id: jsd-18-quiz-05
>
> ```js
> console.log('x.y.z'.replace('.', '-'), 'x.y.z'.replaceAll('.', '-'), 'abc'.at(-1), 'abc'[-1]);
> ```
>
> **Відповідь:** `x-y.z x-y-z c undefined`
>
> **Пояснення:** рядковий аргумент `replace` замінює лише перше входження і не є регулярним виразом (крапка — буквально крапка). `str[-1]` шукає властивість з ключем `'-1'`, якої немає; `at` підтримує від'ємні індекси.

### 🔎 RegExp — синтаксис і прапорці

Регулярний вираз — маленька мова шаблонів. Літерал `/pattern/flags` компілюється при парсингу; `new RegExp(str, flags)` — під час виконання (для динамічних шаблонів екрануй ввід: `RegExp.escape(str)` у сучасних рушіях).

| Конструкція | Значення |
|---|---|
| `.` `\d` `\w` `\s` | будь-який символ (крім `\n`), цифра, «словесний» `[A-Za-z0-9_]`, пробільний |
| `[abc]` `[^abc]` `[a-z]` | клас символів, заперечення, діапазон |
| `^` `$` `\b` | початок, кінець, межа слова (лише для ASCII `\w`!) |
| `*` `+` `?` `{n,m}` | квантифікатори — **жадібні**; з `?` після (`*?`, `+?`) — ліниві |
| `(…)` `(?:…)` `(?<name>…)` | група із захопленням, без захоплення, іменована |
| `a\|b` | альтернатива |
| `\1` `\k<name>` | зворотне посилання на групу |

**Прапорці:**

| Прапорець | Назва | Що робить |
|---|---|---|
| `g` | global | шукати всі збіги; `exec`/`test` пам'ятають `lastIndex` |
| `i` | ignoreCase | без урахування регістру |
| `m` | multiline | `^` і `$` — початок/кінець **кожного рядка** |
| `s` | dotAll | `.` збігається й з `\n` |
| `u` | unicode | працює з code points, вмикає `\p{…}` і `\u{…}`, суворий синтаксис |
| `v` | unicodeSets | як `u` + операції над множинами `[\p{L}--[a-z]]`, властивості рядків (`\p{RGI_Emoji}`) |
| `y` | sticky | збіг лише рівно з позиції `lastIndex` (для токенайзерів) |
| `d` | hasIndices | `match.indices` — позиції початку й кінця кожної групи |

```js
console.log(/^.$/.test('😀'), /^.$/u.test('😀'));          // → false true — без u крапка = 1 code unit
console.log('line1\nline2'.match(/^line\d$/gm));           // → ['line1', 'line2']
console.log(/\p{Script=Cyrillic}+/u.exec('Hello Київ')[0]); // → 'Київ'
console.log('<b>1</b><b>2</b>'.match(/<b>.*?<\/b>/)[0]);    // → '<b>1</b>' — лінивий квантифікатор
```

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-18-quiz-06
>
> ```js
> const re = /o/g;
> console.log(re.test('foo'), re.test('foo'), re.test('foo'));
> ```
>
> **Відповідь:** `true true false`
>
> **Пояснення:** з прапорцем `g` регулярний вираз зберігає стан у `lastIndex`. Перший `test` знаходить `o` на позиції 1 (`lastIndex = 2`), другий — на позиції 2 (`lastIndex = 3`), третій починає з 3, не знаходить нічого і скидає `lastIndex` у 0.

### 🎯 Групи, lookarounds і matchAll

**Іменовані групи** роблять regex читабельним і дають об'єкт `groups`:

```js
const m = '2024-01-15'.match(/(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})/);
console.log(m.groups.y, m.groups.d);                                     // → '2024' '15'
console.log('2024-01-15'.replace(/(?<y>\d+)-(?<m>\d+)-(?<d>\d+)/, '$<d>.$<m>.$<y>')); // → '15.01.2024'
```

**Lookarounds** перевіряють контекст, **не захоплюючи** його в збіг:

```text
  X(?=Y)   lookahead           X, за яким іде Y        /\d+(?= UAH)/  у '100 UAH' → '100'
  X(?!Y)   negative lookahead  X, за яким НЕ йде Y
  (?<=Y)X  lookbehind          X, перед яким стоїть Y  /(?<=\$)\d+/   у '$42'     → '42'
  (?<!Y)X  negative lookbehind X, перед яким НЕ стоїть Y
```

**`matchAll`** повертає ітератор усіх збігів **з групами** (на відміну від `match` з `g`, що віддає лише рядки). Вимагає прапорець `g`, інакше `TypeError`.

```js
const log = 'GET /a 200; POST /b 500; GET /c 404';
for (const { groups, index } of log.matchAll(/(?<method>GET|POST) (?<path>\S+) (?<code>\d{3})/g)) {
  console.log(index, groups.method, groups.path, groups.code);
}
// → 0 'GET' '/a' '200'
// → 12 'POST' '/b' '500'
// → 25 'GET' '/c' '404'
```

> [!quiz] Перевір себе: що виведе код?
> level: senior · type: output · id: jsd-18-quiz-07
>
> ```js
> console.log('12px 34em'.match(/\d+(?!px)/)[0]);
> ```
>
> **Відповідь:** `1`
>
> **Пояснення:** рушій пробує `12` — далі `px`, негативний lookahead провалюється. Тоді він **відступає** (backtracking): `\d+` віддає одну цифру, і `1` стоїть перед `2`, а не перед `px` — умова виконана. Щоб заборонити це, додай межу: `/\d+(?![\dp])/` або `/\b\d+\b(?!px)/`.

> [!quiz] Заповни пропуски: розбери `key=value` у об'єкт через іменовані групи
> level: middle · type: fill · id: jsd-18-quiz-10 · bank: match, y, exec
>
> ```js fill
> const re = /(?<key>\w+)=(?<value>\w+)/[[g]]
> const pairs = {}
> for (const m of str.[[matchAll]](re)) {
>   pairs[m.[[groups]].key] = m.groups.[[value]]
> }
> ```
>
> **Пояснення:** `matchAll` вимагає прапорець `g` (інакше `TypeError`) і повертає ітератор збігів **з групами**. Іменовані групи лежать у `m.groups`. `match` з `g` віддав би лише рядки без груп.

### 💣 Catastrophic backtracking і ReDoS

Рушій регулярних виразів у JS (V8 Irregexp) — **backtracking**: на кожному розгалуженні (квантифікатор, альтернатива) він пробує варіант і, якщо далі провал, повертається й пробує інший. Зазвичай це швидко. Але якщо шаблон дає **експоненційно багато** способів розбити той самий текст, а збігу немає, рушій перебирає їх усі.

```js
const evil = /^(a+)+$/;                     // вкладений квантифікатор
console.log(evil.test('a'.repeat(25)));     // → true — збіг є, швидко
// evil.test('a'.repeat(30) + '!')          // ⚠️ секунди; кожен новий символ подвоює час
```

```text
  'aaaa!' проти /^(a+)+$/ — скількома способами (a+)+ може «нарізати» aaaa?
   (aaaa) (aaa)(a) (aa)(aa) (aa)(a)(a) (a)(aaa) (a)(a)(aa) (a)(aa)(a) (a)(a)(a)(a) …
   2^(n−1) варіантів, і кожен закінчується провалом на '!'
```

> [!viz] regex-engine
> scenario: backtracking

Це **ReDoS** (Regular expression Denial of Service): один запит з підібраним рядком блокує event loop сервера на Node.js. Небезпечні патерни:

- ☠️ вкладені квантифікатори: `(a+)+`, `(\w+\s?)*`, `(.*a){10}`;
- ☠️ альтернативи, що перекриваються, під квантифікатором: `(a|a)*`, `(\d|\d\d)+`;
- ☠️ кілька `.*` поруч, що змагаються за той самий текст.

Ліки:

1. 🧹 Прибрати неоднозначність: `/^a+$/` замість `/^(a+)+$/`; `(\w+\s)*\w+` замість `(\w+\s?)*`.
2. 📏 Обмежити довжину вводу **до** regex і використовувати обмежені квантифікатори `{1,64}`.
3. 🧪 Перевіряти шаблони лінтером (`eslint-plugin-regexp`, `safe-regex`) і на regex101.
4. 🛡️ Для недовіреного вводу — рушій без backtracking (RE2 через `re2` для Node; у V8 є експериментальний лінійний рушій).

> [!quiz] Перевір себе: які з виразів потенційно вразливі до ReDoS?
> level: senior · type: multi · id: jsd-18-quiz-08
> - [x] `/^(\d+)+$/`
> - [ ] `/^\d+$/`
> - [x] `/^(a|aa)+$/`
> - [x] `/^([a-z]+\s?)*$/`
> - [ ] `/^[a-z]{1,20}@[a-z]{1,20}\.com$/`
>
> **Пояснення:** небезпека — у вкладених чи перекритих квантифікаторах, що дають багато способів розбити той самий текст. Простий клас з одним квантифікатором або обмежені квантифікатори без перекриття працюють лінійно.

## ⚠️ Пастки

> [!pitfall] Обрізання рядка розриває емодзі
> `slice` і `substring` працюють з code units. Обрізання посередині сурогатної пари дає «биту» половинку `�`, а посередині графеми — відірваний відтінок шкіри чи наголос.
>
> ```js
> const title = 'Привіт 👋🏽!';
> console.log(title.slice(0, 8)); // → 'Привіт \uD83D' — половина емодзі
> const seg = new Intl.Segmenter('uk', { granularity: 'grapheme' });
> console.log([...seg.segment(title)].slice(0, 8).map((s) => s.segment).join('')); // → 'Привіт 👋🏽'
> ```

> [!pitfall] Регулярний вираз з `g` у `test` чи спільна змінна
> Глобальний regex зберігає `lastIndex` між викликами. Перевірка в циклі або в `filter` даватиме «то true, то false». Для `test` прапорець `g` не потрібен; якщо regex спільний — скидай `re.lastIndex = 0` або створюй новий.

> [!pitfall] `\b` і `\w` не знають кирилиці
> `\w` — це лише `[A-Za-z0-9_]`, тож `/\bкіт\b/` не знайде «кіт» навіть у рядку «кіт». Для Unicode використовуй `\p{L}` з прапорцем `u` або `v` і lookarounds: `/(?<!\p{L})кіт(?!\p{L})/u`.

> [!pitfall] Користувацький ввід у `new RegExp`
> `new RegExp(userInput)` — це і баги (`'1.5'` збіжеться з `'105'`), і ReDoS. Екрануй спецсимволи: `RegExp.escape(userInput)` (ES2025) або `input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`.

## 🎤 На співбесіді

> [!interview] Чому `'😀'.length === 2`? Як правильно порахувати символи?
> level: middle · frequency: часто · id: jsd-18-int-01
>
> ---
>
> Рядки в JS — послідовності 16-бітних code units UTF-16, і `length` рахує саме їх. Символи поза BMP (емодзі, рідкісні ієрогліфи) кодуються сурогатною парою з двох units. `for…of` і spread ітерують code points — `[...'😀'].length === 1`. Але й code point — не «символ» для людини: прапор 🇺🇦 — два code points, сімейка 👨‍👩‍👧 — п'ять (з ZWJ), `é` може бути двома. Видимі символи — це grapheme clusters, і їх рахує `Intl.Segmenter` з `granularity: 'grapheme'`. Для порівняння рядків ще потрібна `normalize()`.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🧩 Code units, code points і графеми|Розділ: code units і графеми]] · [MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) · [Mathias Bynens: JavaScript has a Unicode problem](https://mathiasbynens.be/notes/javascript-unicode)

> [!interview] Що таке tagged template і де його використовують?
> level: middle · frequency: іноді · id: jsd-18-int-02
>
> ---
>
> Виклик функції-тегу синтаксисом `` tag`…${x}…` ``: тег отримує масив статичних частин (з властивістю `raw` — частини без обробки escape) і значення виразів окремими аргументами, і повертає будь-що. Масив частин заморожений і кешується для кожного місця виклику. Застосування: безпечна інтерполяція (екранування HTML, параметризовані SQL-запити), CSS-in-JS (styled-components), GraphQL (`gql`), i18n, `String.raw`, dedent багаторядкових рядків. Головна ідея — тег знає, де код автора, а де дані.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🏷️ Template literals і tagged templates|Розділ: tagged templates]] · [MDN: Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) · [Spec: Tagged Templates](https://tc39.es/ecma262/#sec-tagged-templates)

> [!interview] Що таке ReDoS і як від нього захиститися?
> level: senior · frequency: іноді · id: jsd-18-int-03
>
> ---
>
> Regular expression Denial of Service: backtracking-рушій (як у V8) на шаблоні з неоднозначністю — вкладені квантифікатори `(a+)+`, перекриті альтернативи `(a|aa)+` — перебирає експоненційну кількість варіантів, коли збігу немає. Один рядок у 30–40 символів блокує event loop Node-сервера на секунди чи години. Захист: переписати шаблон без неоднозначності, обмежити довжину вводу і квантифікатори, лінтери (`eslint-plugin-regexp`, `safe-regex`), для недовіреного вводу — лінійний рушій RE2, а парсинг складних форматів (email, URL) віддати спеціалізованим парсерам (`URL`).
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#💣 Catastrophic backtracking і ReDoS|Розділ: ReDoS]] · [OWASP: ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) · [javascript.info: Catastrophic backtracking](https://javascript.info/regexp-catastrophic-backtracking)

## 🔗 Зв'язки

- [[JavaScript - 11. Ітератори та генератори]] — `for…of` по рядку працює через `String.prototype[Symbol.iterator]`, що віддає code points.
- [[JavaScript - 08. Event Loop]] — чому ReDoS «вішає» весь Node-процес: regex виконується синхронно в одному потоці.
- [[JavaScript - 24. Дати, час та Intl]] — `Intl.Segmenter`, `Intl.Collator` і локалізоване порівняння.
- [[JavaScript - 30. Безпека в JavaScript]] — XSS, екранування й ReDoS як вектор атаки.
- [[JavaScript - 20. Symbol, Proxy і Reflect]] — `Symbol.replace`, `Symbol.split` і `Symbol.matchAll` — як рядкові методи делегують роботу регулярним виразам.

## ⚡ Фішки

> [!reel] 👨‍👩‍👧 Довжина сімейки — 8
> Три емодзі по 2 code units плюс два невидимі «склеювачі» ZWJ. Для людини — 1 символ, для `length` — 8, для spread — 5.
>
> ```js
> '👨‍👩‍👧'.length;      // → 8
> [...'👨‍👩‍👧'].length; // → 5
> ```

> [!reel] 🇺🇦 Прапор — це дві літери
> Прапори країн — пари «регіональних індикаторів»: 🇺 + 🇦. Шрифт склеює їх у прапор. Тому `'🇺🇦'.length === 4`, а розрізаний навпіл прапор показує дві букви в рамках.

> [!reel] 🔁 regex з g має пам'ять
> `/o/g.test()` зберігає `lastIndex`. Той самий виклик тричі поспіль на `'foo'` дає `true, true, false`. Для перевірок прапорець `g` не потрібен.

> [!reel] 💣 П'ять символів регекспу можуть покласти сервер
> `/^(a+)+$/` на рядку з 30 літер `a` і `!` наприкінці працює секунди, а з 40 — години: кожен символ подвоює кількість варіантів. Це ReDoS.

> [!reel] 🏷️ Tagged template отримує код і дані окремо
> `` html`<p>${userInput}</p>` `` — тег бачить, що `<p>` написав розробник, а `userInput` — дані, і екранує лише їх. Так працюють lit-html, styled-components і безпечні SQL-клієнти.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Чи можна змінити символ рядка за індексом?
> *часто · теорія* · `jsd-18-001`
>
> Ні, рядки незмінні. `s[0] = 'z'` у sloppy mode ігнорується, у strict mode — `TypeError`. Усі методи (`replace`, `toUpperCase`, `slice`) повертають новий рядок.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🧵 Рядки незмінні і зберігаються в UTF-16|Розділ: незмінність]] · [MDN: String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

> [!question]- Чим `replace` відрізняється від `replaceAll`?
> *часто · порівняння* · `jsd-18-002`
>
> `replace` з рядковим шаблоном замінює лише перше входження; з regex — усі, якщо є прапорець `g`. `replaceAll` замінює всі входження рядка, а з regex вимагає прапорець `g` (інакше `TypeError`).
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🧰 Корисні методи рядків|Розділ: методи рядків]] · [javascript.info: Strings](https://javascript.info/string)

> [!question]- Що роблять прапорці `g`, `i`, `m` і `s`?
> *часто · теорія* · `jsd-18-003`
>
> `g` — усі збіги (і стан у `lastIndex`), `i` — без урахування регістру, `m` — `^`/`$` для кожного рядка, `s` — `.` збігається з `\n`.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🔎 RegExp — синтаксис і прапорці|Розділ: прапорці]] · [MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)

### 🟡 Middle

> [!question]- Чим code unit відрізняється від code point і grapheme cluster?
> *часто · теорія* · `jsd-18-004`
>
> Code unit — 16-бітне значення UTF-16 (`length`, індекси). Code point — один символ Unicode, займає 1 або 2 units (`for…of`, spread). Grapheme cluster — видимий символ, що може складатися з кількох code points (прапор, емодзі з відтінком, літера з наголосом) — рахує `Intl.Segmenter`.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🧩 Code units, code points і графеми|Розділ: рівні символу]] · [Mathias Bynens: JavaScript has a Unicode problem](https://mathiasbynens.be/notes/javascript-unicode)

> [!question]- Навіщо `normalize()`?
> *іноді · практика* · `jsd-18-005`
>
> Одна літера може мати різні послідовності code points: `'é'` (U+00E9) і `'e' + U+0301`. Візуально однакові, але `===` дає `false`. `normalize()` (за замовчуванням NFC) зводить їх до єдиної форми — потрібно перед порівнянням, пошуком, унікальними ключами, збереженням у БД.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🧩 Code units, code points і графеми|Розділ: нормалізація]] · [MDN: normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)

> [!question]- Що роблять lookahead і lookbehind?
> *іноді · код* · `jsd-18-006`
>
> Перевіряють, що після (`(?=…)`, `(?!…)`) або перед (`(?<=…)`, `(?<!…)`) позицією є чи немає шаблону, **не включаючи** його в збіг. Приклад: `/(?<=\$)\d+/` дістає `42` з `'$42'`.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🎯 Групи, lookarounds і matchAll|Розділ: lookarounds]] · [MDN: Lookbehind assertion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Lookbehind_assertion)

> [!question]- Чим `matchAll` кращий за `match` з `g`?
> *іноді · порівняння* · `jsd-18-007`
>
> `match` з `g` повертає лише масив рядків-збігів, без груп і позицій. `matchAll` повертає ітератор повних результатів `exec` — з групами, `groups` та `index`, і не мутує `lastIndex` переданого regex (працює з копією). Вимагає прапорець `g`.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🎯 Групи, lookarounds і matchAll|Розділ: matchAll]] · [MDN: matchAll](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll)

### 🔴 Senior

> [!question]- Чим прапорець `v` відрізняється від `u`?
> *рідко · теорія* · `jsd-18-008`
>
> `v` (unicodeSets, ES2024) — надмножина `u`: додає операції над множинами в класах (різниця `[\p{L}--[a-z]]`, перетин `[\p{L}&&\p{ASCII}]`), вкладені класи і властивості рядків на кшталт `\p{RGI_Emoji}`, що збігаються з багатосимвольними емодзі. Синтаксис суворіший — деякі символи в класах треба екранувати.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#🔎 RegExp — синтаксис і прапорці|Розділ: прапорці]] · [V8: RegExp v flag](https://v8.dev/features/regexp-v-flag)

> [!question]- Чому регулярний вираз може працювати експоненційний час?
> *іноді · теорія* · `jsd-18-009`
>
> Рушій V8 — backtracking: при провалі він повертається до останнього розгалуження й пробує інший варіант. Якщо шаблон неоднозначний (вкладені чи перекриті квантифікатори), кількість способів розбити текст росте експоненційно, і за відсутності збігу рушій перебирає їх усі. Лікування — однозначні шаблони, обмеження довжини, лінійні рушії (RE2).
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази#💣 Catastrophic backtracking і ReDoS|Розділ: backtracking]] · [V8: non-backtracking RegExp engine](https://v8.dev/blog/non-backtracking-regexp)

## 🛠️ Практика

> [!task] `truncate` з урахуванням графем
> level: junior · difficulty: easy · id: jsd-18-task-01 · tags: strings, unicode
>
> Напиши `truncate(text, max)`: якщо у тексті більше `max` видимих символів, обріж до `max - 1` і додай `…`. Емодзі й прапори не можна розрізати.
>
> ```js
> truncate('Привіт 👋🏽 світе', 8); // → 'Привіт …'
> truncate('🇺🇦🇺🇦🇺🇦', 2);         // → '🇺🇦…'
> truncate('ok', 5);               // → 'ok'
> ```
>
> ```js starter
> function truncate(text, max) {
>   // твій код
> }
> ```
>
> ```js tests
> test('короткий текст повертається без змін', () => {
>   expect(truncate('ok', 5)).toBe('ok')
> })
>
> test('текст рівно на max символів не обрізається', () => {
>   expect(truncate('абв', 3)).toBe('абв')
> })
>
> test('обрізає до max - 1 графем і додає …', () => {
>   expect(truncate('Привіт 👋🏽 світе', 8)).toBe('Привіт …')
> })
>
> test('прапор — одна графема, його не розрізано', () => {
>   expect(truncate('🇺🇦🇺🇦🇺🇦', 2)).toBe('🇺🇦…')
> })
>
> test('емодзі-родина з ZWJ рахується як один символ', () => {
>   expect(truncate('👨‍👩‍👧ab', 3)).toBe('👨‍👩‍👧ab')
>   expect(truncate('👨‍👩‍👧ab', 2)).toBe('👨‍👩‍👧…')
> })
> ```
>
> > [!hint]- Підказка 1
> > Розбий рядок на графеми через `Intl.Segmenter` з `granularity: 'grapheme'`.
>
> > [!hint]- Підказка 2
> > Масив сегментів → `slice` → `join('')`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > const segmenter = new Intl.Segmenter('uk', { granularity: 'grapheme' });
> > function truncate(text, max) {
> >   const graphemes = Array.from(segmenter.segment(text), (s) => s.segment);
> >   if (graphemes.length <= max) return text;
> >   return graphemes.slice(0, max - 1).join('') + '…';
> > }
> > ```
> >
> > Segmenter створюємо один раз — це відносно дорогий об'єкт. `Array.from` з функцією-мапером одразу дістає рядки сегментів.

> [!task] Поясни своїми словами: чому regex може «покласти» сервер
> level: middle · difficulty: medium · id: jsd-18-task-02 · tags: feynman, regexp, security
>
> Поясни бекенд-розробнику без досвіду в регулярних виразах, як `/^(a+)+$/` може заблокувати Node.js-сервер одним запитом і що з цим робити. Згадай backtracking, event loop і два способи захисту. До 7 речень.
>
> > [!hint]- Підказка 1
> > Уяви, що треба розкласти 30 однакових монет на купки всіма можливими способами і для кожного перевірити умову, яка ніколи не виконається.
>
> > [!hint]- Підказка 2
> > Чому це зупиняє **всі** запити, а не лише один?
>
> > [!solution]- Еталонне пояснення
> > Рушій регулярних виразів у JS працює методом спроб: на кожному розгалуженні обирає варіант, а коли далі не виходить — повертається назад і пробує інший (backtracking). Шаблон `(a+)+` каже «одна чи більше груп з однієї чи більше `a`», тож рядок `aaaa` можна нарізати на групи дуже багатьма способами — їх кількість подвоюється з кожною новою літерою. Якщо в кінці рядка стоїть `!`, збігу немає, і рушій чесно перебирає **усі** нарізки: для 30 літер це сотні мільйонів спроб. Node.js виконує JavaScript в одному потоці, тож поки regex рахує, event loop стоїть і сервер не відповідає нікому. Захист: переписати шаблон так, щоб текст розбивався лише одним способом (`/^a+$/`), і обмежувати довжину вводу до перевірки. Для неперевірених шаблонів з користувацьким вводом — бібліотека з лінійним рушієм на кшталт RE2.

> [!task] Міні-токенайзер на sticky regex
> level: senior · difficulty: hard · id: jsd-18-task-03 · tags: regexp, sticky, parsing
>
> Напиши `tokenize(src)` для арифметичних виразів: числа (з дробовою частиною), ідентифікатори, оператори `+ - * / ( )`, пробіли пропускаються. На невідомому символі кидай `SyntaxError` з позицією.
>
> ```js
> tokenize('x1 + 2.5*(y-3)');
> // → [['id','x1'],['op','+'],['num','2.5'],['op','*'],['op','('],['id','y'],['op','-'],['num','3'],['op',')']]
> tokenize('2 # 3'); // → SyntaxError: Unexpected '#' at 2
> ```
>
> ```js starter
> function tokenize(src) {
>   const re = /(?<ws>\s+)|(?<num>…)|(?<id>…)|(?<op>…)/y
>   const tokens = []
>   // твій код
>   return tokens
> }
> ```
>
> ```js tests
> test('розбирає вираз з прикладу', () => {
>   expect(tokenize('x1 + 2.5*(y-3)')).toEqual([
>     ['id', 'x1'], ['op', '+'], ['num', '2.5'], ['op', '*'], ['op', '('],
>     ['id', 'y'], ['op', '-'], ['num', '3'], ['op', ')'],
>   ])
> })
>
> test('пробіли пропускаються, порожній ввід — порожній масив', () => {
>   expect(tokenize('')).toEqual([])
>   expect(tokenize('   ')).toEqual([])
> })
>
> test('ідентифікатор з підкресленням і цифрами', () => {
>   expect(tokenize('_total2/n')).toEqual([['id', '_total2'], ['op', '/'], ['id', 'n']])
> })
>
> test('невідомий символ — SyntaxError з позицією', () => {
>   expect(() => tokenize('2 # 3')).toThrow(SyntaxError)
>   expect(() => tokenize('2 # 3')).toThrow("Unexpected '#' at 2")
> })
>
> test('не перестрибує через невідомий символ на початку', () => {
>   expect(() => tokenize('@a')).toThrow("Unexpected '@' at 0")
> })
> ```
>
> > [!hint]- Підказка 1
> > Один regex з іменованими групами-альтернативами: `(?<ws>\s+)|(?<num>…)|(?<id>…)|(?<op>…)`.
>
> > [!hint]- Підказка 2
> > Прапорець `y` змушує збіг починатися **рівно** з `lastIndex` — жодних «стрибків» через невідомі символи.
>
> > [!hint]- Підказка 3
> > Яка з груп спрацювала — видно з `match.groups`: шукай ключ, значення якого не `undefined`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function tokenize(src) {
> >   const re = /(?<ws>\s+)|(?<num>\d+(?:\.\d+)?)|(?<id>[A-Za-z_]\w*)|(?<op>[-+*\/()])/y;
> >   const tokens = [];
> >   while (re.lastIndex < src.length) {
> >     const pos = re.lastIndex;
> >     const m = re.exec(src);
> >     if (!m) throw new SyntaxError(`Unexpected '${src[pos]}' at ${pos}`);
> >     const [type, value] = Object.entries(m.groups).find(([, v]) => v !== undefined);
> >     if (type !== 'ws') tokens.push([type, value]);
> >   }
> >   return tokens;
> > }
> > ```
> >
> > Sticky-прапорець гарантує, що токени йдуть впритул: без `y` (з `g`) `exec` просто перестрибнув би через `#` і знайшов `3`. Збіг невдалий — `exec` повертає `null` і скидає `lastIndex`, тому позицію запам'ятовуємо до виклику. Альтернативи лінійні й не перекриваються — ReDoS тут неможливий.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Strings](https://javascript.info/string) — методи рядків, порівняння й Unicode для старту.
- 🟢 [javascript.info — Regular expressions](https://javascript.info/regular-expressions) — найкращий покроковий курс regex у JS, від класів до lookarounds.
- 🟡 [MDN — Regular expressions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) — синтаксис, прапорці й методи з прикладами.
- 🟡 [MDN — Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) — графеми, слова й речення з урахуванням мови.
- 🟡 [Mathias Bynens — JavaScript has a Unicode problem](https://mathiasbynens.be/notes/javascript-unicode) — класика про сурогатні пари, нормалізацію і regex.
- 🟡 [javascript.info — Catastrophic backtracking](https://javascript.info/regexp-catastrophic-backtracking) — як виникає експоненційний перебір і як його прибрати.
- 🔴 [OWASP — ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) — ReDoS як вектор атаки і приклади вразливих шаблонів.
- 🔴 [ECMAScript — The String Type](https://tc39.es/ecma262/#sec-ecmascript-language-types-string-type) — першоджерело: рядок як послідовність 16-бітних значень.
- 🛠️ [regex101](https://regex101.com/) — налагодження regex з поясненням кожного кроку і лічильником backtracking.

> [!important] Підсумок
> - Рядки незмінні й складаються з 16-бітних code units UTF-16: `length`, індекси й `slice` працюють з ними, а емодзі займають 2 units.
> - `for…of`/spread ітерують code points, а «видимі символи» — це графеми, які рахує лише `Intl.Segmenter`; перед порівнянням — `normalize()`.
> - Tagged template отримує статичні частини й значення окремо — основа безпечної інтерполяції; `strings` заморожений і кешується.
> - Прапорці: `g` (і стан `lastIndex`!), `i`, `m`, `s`, `u`/`v` для Unicode, `y` для токенайзерів, `d` для позицій груп; `matchAll` дає групи й індекси.
> - Backtracking-рушій на неоднозначних шаблонах (`(a+)+`) працює експоненційно — це ReDoS; обмежуй ввід і пиши однозначні шаблони.

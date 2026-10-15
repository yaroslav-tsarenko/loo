---
title: Калькулятор виразів
order: 2
level: middle
tags: [parsing, recursion, ast, errors]
prerequisites:
  - "[[JavaScript - 22. Помилки та їх обробка]]"
  - "[[JavaScript - 17. Числа, BigInt і математика]]"
  - "[[JavaScript - 18. Рядки, Unicode і регулярні вирази]]"
estimatedMinutes: 100
id: jsp-ch-02
icon: "🧮"
---

# JavaScript Projects - 02. Калькулятор виразів

> [!success] 🎯 Після цього розділу ти зможеш
> - Розбити рядок на **токени** і повідомити про помилку з точною позицією.
> - Написати **recursive descent parser** з пріоритетами, дужками, унарним мінусом і правоасоціативним `^`.
> - Обчислити **AST** і відрізняти «помилки користувача» від багів через власний клас помилки.
> - Перевикористати те саме AST для іншої задачі — красивого друку з мінімумом дужок.

## 🎯 Що збудуємо

Калькулятор, що розуміє `-(1.5 + 2) * 3 ^ 2 / 4` без `eval`. Класичний конвеєр компілятора в мініатюрі — той самий, що в Babel, ESLint, Prettier і рушії формул Excel.

```text
 "2 * (3 + 4)"
       │
       ▼  tokenize            [num 2] [op *] [paren (] [num 3] [op +] [num 4] [paren )]
       │
       ▼  parse               { binary * }
       │                      ╱          ╲
       │                 { num 2 }     { binary + }
       │                               ╱        ╲
       │                          { num 3 }   { num 4 }
       │
       ├──▶ evaluate ──▶ 14
       ├──▶ print    ──▶ "2 * (3 + 4)"
       └──▶ calculate ──▶ { ok: true, value: 14, text: '14' }
            (фасад: ловить CalcError → { ok: false, error, pos })
```

Кожен етап — чиста функція з чітким входом і виходом. Помилку на будь-якому етапі описує `CalcError` з позицією в рядку — UI покаже `^` під проблемним символом.

## 🧭 План кроків

1. `tokenize` + `CalcError` — лексер з позиціями. Теорія: [[JavaScript - 22. Помилки та їх обробка]].
2. `parse` для `+ - * /` — пріоритети і лівоасоціативність через рівні граматики.
3. Дужки, унарний мінус, `^` — розширюємо граматику. Теорія рекурсії: [[JavaScript - 15. Функції глибоко]].
4. `evaluate` — обхід AST, ділення на нуль, нескінченності. Теорія: [[JavaScript - 17. Числа, BigInt і математика]].
5. `calculate` + `formatNumber` + `caret` — безпечний фасад для UI.
6. `print` — друк AST з мінімумом дужок і перевірка «туди-назад».

## 🧩 Розминка

> [!quiz] Склади рівень граматики для * і /
> level: middle · type: order · id: jsp-02-quiz-01
>
> ```js order
> function term() {
>   let left = unary()
>   while (isOp('*', '/')) {
>     const op = tokens[i++].value
>     left = { type: 'binary', op, left, right: unary() }
>   }
>   return left
> }
>   return { type: 'binary', op, left, right: term() } // ✗
> ```
>
> **Пояснення:** цикл, що «нарощує» `left`, дає **ліву** асоціативність: `8 / 4 / 2` → `(8 / 4) / 2`. Рекурсивний виклик `term()` праворуч дав би `8 / (4 / 2)` — неправильну відповідь.

> [!quiz] Заповни пропуски в обробці дужок
> level: middle · type: fill · id: jsp-02-quiz-02
>
> ```js fill
> function primary() {
>   const token = tokens[i++]
>   if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
>   if (token.type === 'num') return { type: 'num', value: token.value }
>   if (token.value === '(') {
>     const inner = [[expression]]()
>     if (peek()?.value !== '[[)]]') throw new CalcError('Очікувалась ")"', endPos())
>     [[i++]]
>     return inner
>   }
>   throw new CalcError(`Неочікуваний токен "${token.value}"`, token.pos)
> }
> ```
>
> **Пояснення:** всередині дужок знову весь вираз — звідси рекурсія з найнижчого пріоритету. Після нього **обов'язково** споживаємо `)`, інакше вона стане «зайвим токеном».

## 🛠️ Крок 1. Токенізатор

Лексер іде рядком символ за символом і склеює їх у токени. Кожен токен пам'ятає `pos` — індекс у вихідному рядку. Помилки — не просто `Error`, а `CalcError`: так фасад на кроці 5 відрізнить «користувач ввів сміття» від «у нас баг».

> [!task] Крок 1 · tokenize і CalcError
> level: junior · difficulty: medium · id: jsp-02-task-01 · tags: lexer, errors, strings
>
> Напиши:
>
> - `class CalcError extends Error` з конструктором `(message, pos)`: `name = 'CalcError'`, поле `pos`;
> - `tokenize(src)` → масив токенів:
>   - числа: `12`, `3.5`, `.5`, `1.` → `{ type: 'num', value: <число>, pos }`; послідовність цифр і крапок, що не є числом (`1.2.3`, `.`) → `CalcError('Некоректне число "<текст>" на позиції <pos>', pos)`;
>   - оператори `+ - * / ^` → `{ type: 'op', value, pos }`;
>   - дужки → `{ type: 'paren', value, pos }`;
>   - пробільні символи пропускаються;
>   - будь-що інше → `CalcError('Невідомий символ "<символ>" на позиції <pos>', pos)`.
>
> ```js starter
> class CalcError extends Error {
>   // твій код
> }
>
> function tokenize(src) {
>   // твій код
> }
> ```
>
> ```js tests
> test('числа й оператори з позиціями', () => {
>   expect(tokenize('12+3.5')).toEqual([
>     { type: 'num', value: 12, pos: 0 },
>     { type: 'op', value: '+', pos: 2 },
>     { type: 'num', value: 3.5, pos: 3 },
>   ])
> })
>
> test('пробіли пропускаються, дужки й ^ розпізнаються', () => {
>   expect(tokenize(' 2 ^ ( .5 )').map((t) => [t.type, t.value, t.pos])).toEqual([
>     ['num', 2, 1],
>     ['op', '^', 3],
>     ['paren', '(', 5],
>     ['num', 0.5, 7],
>     ['paren', ')', 10],
>   ])
> })
>
> test('порожній рядок — порожній масив', () => {
>   expect(tokenize('')).toEqual([])
>   expect(tokenize('   ')).toEqual([])
> })
>
> test('невідомий символ — CalcError з позицією', () => {
>   expect(() => tokenize('1 @ 2')).toThrow('Невідомий символ "@" на позиції 2')
>   try {
>     tokenize('2 + x')
>   } catch (error) {
>     expect(error).toBeInstanceOf(CalcError)
>     expect(error.name).toBe('CalcError')
>     expect(error.pos).toBe(4)
>   }
> })
>
> test('некоректні числа', () => {
>   expect(() => tokenize('1.2.3')).toThrow('Некоректне число "1.2.3" на позиції 0')
>   expect(() => tokenize('3 + .')).toThrow('Некоректне число "." на позиції 4')
>   expect(tokenize('1.')[0].value).toBe(1)
> })
> ```
>
> > [!hint]- Підказка 1
> > Головний цикл `while (i < src.length)`: для кожного виду токена — свій `if`, який зсуває `i` і робить `continue`. Пробіл: `/\s/.test(ch)`.
>
> > [!hint]- Підказка 2
> > Для чисел спершу «з'їж» усі `[0-9.]`, а потім перевір текст регулярним виразом `/^(\d+\.?\d*|\.\d+)$/`. Так `1.2.3` стане однією помилкою, а не трьома дивними токенами.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class CalcError extends Error {
> >   constructor(message, pos) {
> >     super(message)
> >     this.name = 'CalcError'
> >     this.pos = pos
> >   }
> > }
> >
> > function tokenize(src) {
> >   const tokens = []
> >   let i = 0
> >   while (i < src.length) {
> >     const ch = src[i]
> >     if (/\s/.test(ch)) {
> >       i++
> >       continue
> >     }
> >     if (/[0-9.]/.test(ch)) {
> >       const start = i
> >       while (i < src.length && /[0-9.]/.test(src[i])) i++
> >       const text = src.slice(start, i)
> >       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
> >       tokens.push({ type: 'num', value: Number(text), pos: start })
> >       continue
> >     }
> >     if ('+-*/^'.includes(ch)) {
> >       tokens.push({ type: 'op', value: ch, pos: i++ })
> >       continue
> >     }
> >     if (ch === '(' || ch === ')') {
> >       tokens.push({ type: 'paren', value: ch, pos: i++ })
> >       continue
> >     }
> >     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
> >   }
> >   return tokens
> > }
> > ```
> > **Чому так:** окремий лексер прибирає з парсера всю «посимвольну» метушню — парсер думає токенами, а не символами. Позиція в кожному токені дає якісні повідомлення про помилки на будь-якому етапі. Власний клас `CalcError` — це **контракт**: «очікувана помилка вводу». Усе інше (`TypeError` тощо) — баг, і його не можна ковтати.

## 🛠️ Крок 2. Парсер: пріоритети

**Recursive descent**: кожен рівень пріоритету — окрема функція, і нижчий рівень викликає вищий. Граматика:

```text
expression := term   (('+' | '-') term)*
term       := factor (('*' | '/') factor)*
factor     := number
```

`*` «зв'язує сильніше», бо `term` будує свої вузли **глибше** в дереві, ніж `expression`. Цикл `while` дає лівоасоціативність: `8 - 3 - 2` = `(8 - 3) - 2`.

> [!task] Крок 2 · parse для + − * /
> level: middle · difficulty: medium · id: jsp-02-task-02 · tags: parser, recursion, ast
>
> Додай `parse(tokens)` → AST з вузлами `{ type: 'num', value }` і `{ type: 'binary', op, left, right }`.
>
> - `*` і `/` мають вищий пріоритет за `+` і `-`; усі чотири — лівоасоціативні.
> - Порожній масив → `CalcError('Порожній вираз', 0)`.
> - Токени скінчились там, де чекали число → `CalcError('Неочікуваний кінець виразу', …)`.
> - Не число там, де чекали число → `CalcError('Неочікуваний токен "<value>" на позиції <pos>', pos)`.
> - Після розбору лишились токени → `CalcError('Зайвий токен "<value>" на позиції <pos>', pos)`.
>
> ```js starter
> class CalcError extends Error {
>   constructor(message, pos) {
>     super(message)
>     this.name = 'CalcError'
>     this.pos = pos
>   }
> }
>
> function tokenize(src) {
>   const tokens = []
>   let i = 0
>   while (i < src.length) {
>     const ch = src[i]
>     if (/\s/.test(ch)) {
>       i++
>       continue
>     }
>     if (/[0-9.]/.test(ch)) {
>       const start = i
>       while (i < src.length && /[0-9.]/.test(src[i])) i++
>       const text = src.slice(start, i)
>       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
>       tokens.push({ type: 'num', value: Number(text), pos: start })
>       continue
>     }
>     if ('+-*/^'.includes(ch)) {
>       tokens.push({ type: 'op', value: ch, pos: i++ })
>       continue
>     }
>     if (ch === '(' || ch === ')') {
>       tokens.push({ type: 'paren', value: ch, pos: i++ })
>       continue
>     }
>     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
>   }
>   return tokens
> }
>
> function parse(tokens) {
>   let i = 0
>   // expression → term → factor
>   // твій код
> }
> ```
>
> ```js tests
> const ast = (src) => parse(tokenize(src))
> const num = (value) => ({ type: 'num', value })
> const bin = (op, left, right) => ({ type: 'binary', op, left, right })
>
> test('одне число', () => {
>   expect(ast('42')).toEqual(num(42))
> })
>
> test('* сильніше за +', () => {
>   expect(ast('1 + 2 * 3')).toEqual(bin('+', num(1), bin('*', num(2), num(3))))
>   expect(ast('2 * 3 + 4')).toEqual(bin('+', bin('*', num(2), num(3)), num(4)))
> })
>
> test('лівоасоціативність', () => {
>   expect(ast('8 - 3 - 2')).toEqual(bin('-', bin('-', num(8), num(3)), num(2)))
>   expect(ast('8 / 4 / 2')).toEqual(bin('/', bin('/', num(8), num(4)), num(2)))
> })
>
> test('порожній вираз і неочікуваний кінець', () => {
>   expect(() => ast('')).toThrow('Порожній вираз')
>   expect(() => ast('1 +')).toThrow('Неочікуваний кінець виразу')
> })
>
> test('неочікуваний і зайвий токен з позицією', () => {
>   expect(() => ast('* 2')).toThrow('Неочікуваний токен "*" на позиції 0')
>   expect(() => ast('1 2')).toThrow('Зайвий токен "2" на позиції 2')
> })
> ```
>
> > [!hint]- Підказка 1
> > Тримай курсор `i` у замиканні і дві допоміжні: `peek = () => tokens[i]` та `isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)`.
>
> > [!hint]- Підказка 2
> > `expression`: `let left = term(); while (isOp('+', '-')) { const op = tokens[i++].value; left = { type: 'binary', op, left, right: term() } } return left`. `term` — те саме з `factor` і `* /`.
>
> > [!hint]- Підказка 3
> > Після `const result = expression()` перевір `i < tokens.length` — це «зайвий токен».
>
> > [!solution]- Еталонне рішення
> > ```js
> > class CalcError extends Error {
> >   constructor(message, pos) {
> >     super(message)
> >     this.name = 'CalcError'
> >     this.pos = pos
> >   }
> > }
> >
> > function tokenize(src) {
> >   const tokens = []
> >   let i = 0
> >   while (i < src.length) {
> >     const ch = src[i]
> >     if (/\s/.test(ch)) {
> >       i++
> >       continue
> >     }
> >     if (/[0-9.]/.test(ch)) {
> >       const start = i
> >       while (i < src.length && /[0-9.]/.test(src[i])) i++
> >       const text = src.slice(start, i)
> >       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
> >       tokens.push({ type: 'num', value: Number(text), pos: start })
> >       continue
> >     }
> >     if ('+-*/^'.includes(ch)) {
> >       tokens.push({ type: 'op', value: ch, pos: i++ })
> >       continue
> >     }
> >     if (ch === '(' || ch === ')') {
> >       tokens.push({ type: 'paren', value: ch, pos: i++ })
> >       continue
> >     }
> >     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
> >   }
> >   return tokens
> > }
> >
> > function parse(tokens) {
> >   let i = 0
> >   const peek = () => tokens[i]
> >   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
> >   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
> >
> >   function expression() {
> >     let left = term()
> >     while (isOp('+', '-')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: term() }
> >     }
> >     return left
> >   }
> >
> >   function term() {
> >     let left = factor()
> >     while (isOp('*', '/')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: factor() }
> >     }
> >     return left
> >   }
> >
> >   function factor() {
> >     const token = tokens[i++]
> >     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
> >     if (token.type === 'num') return { type: 'num', value: token.value }
> >     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
> >   }
> >
> >   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
> >   const result = expression()
> >   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
> >   return result
> > }
> > ```
> > **Чому так:** пріоритет закодований **структурою викликів**, а не таблицею: функція нижчого рівня викликає вищий, тож вузли `*` опиняються глибше і обчислюються раніше. Цикл замість рекурсії праворуч — ключ до лівої асоціативності (і захист від переповнення стека на `1+1+1+…`). Перевірка «зайвих токенів» наприкінці — інакше `1 2` мовчки повернув би `1`.

## 🛠️ Крок 3. Дужки, унарний мінус і степінь

Граматика росте на два рівні. `unary` стоїть **нижче** за `power`, тож `-2 ^ 2` = `-(2 ^ 2)` = `-4` — як у математиці (і як у Python). А `^` праворуч викликає `unary`, тож працює і `2 ^ -1`, і правоасоціативність `2 ^ 3 ^ 2` = `2 ^ 9`.

```text
expression := term  (('+' | '-') term)*
term       := unary (('*' | '/') unary)*
unary      := ('-' | '+') unary | power
power      := primary ('^' unary)?
primary    := number | '(' expression ')'
```

> [!task] Крок 3 · дужки, унарні оператори, ^
> level: middle · difficulty: hard · id: jsp-02-task-03 · tags: parser, recursion, associativity
>
> Перепиши `parse` за новою граматикою:
>
> - унарний мінус → `{ type: 'unary', op: '-', arg }`; унарний плюс просто повертає свій операнд;
> - `^` — найвищий пріоритет серед бінарних і **правоасоціативний**;
> - дужки групують; немає закривної → `CalcError('Очікувалась ")" на позиції <pos>', pos)` (позиція — наступного токена або кінця);
> - решта помилок — як на кроці 2.
>
> ```js starter
> class CalcError extends Error {
>   constructor(message, pos) {
>     super(message)
>     this.name = 'CalcError'
>     this.pos = pos
>   }
> }
>
> function tokenize(src) {
>   const tokens = []
>   let i = 0
>   while (i < src.length) {
>     const ch = src[i]
>     if (/\s/.test(ch)) {
>       i++
>       continue
>     }
>     if (/[0-9.]/.test(ch)) {
>       const start = i
>       while (i < src.length && /[0-9.]/.test(src[i])) i++
>       const text = src.slice(start, i)
>       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
>       tokens.push({ type: 'num', value: Number(text), pos: start })
>       continue
>     }
>     if ('+-*/^'.includes(ch)) {
>       tokens.push({ type: 'op', value: ch, pos: i++ })
>       continue
>     }
>     if (ch === '(' || ch === ')') {
>       tokens.push({ type: 'paren', value: ch, pos: i++ })
>       continue
>     }
>     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
>   }
>   return tokens
> }
>
> function parse(tokens) {
>   let i = 0
>   const peek = () => tokens[i]
>   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
>   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
>
>   function expression() {
>     let left = term()
>     while (isOp('+', '-')) {
>       const op = tokens[i++].value
>       left = { type: 'binary', op, left, right: term() }
>     }
>     return left
>   }
>
>   function term() {
>     let left = factor()
>     while (isOp('*', '/')) {
>       const op = tokens[i++].value
>       left = { type: 'binary', op, left, right: factor() }
>     }
>     return left
>   }
>
>   function factor() {
>     const token = tokens[i++]
>     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
>     if (token.type === 'num') return { type: 'num', value: token.value }
>     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
>   }
>
>   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
>   const result = expression()
>   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
>   return result
> }
>
> // Крок 3: перепиши parse вище за граматикою з умови.
> // factor() замінюється на unary() → power() → primary().
> ```
>
> ```js tests
> const ast = (src) => parse(tokenize(src))
> const num = (value) => ({ type: 'num', value })
> const bin = (op, left, right) => ({ type: 'binary', op, left, right })
> const neg = (arg) => ({ type: 'unary', op: '-', arg })
>
> test('дужки змінюють пріоритет', () => {
>   expect(ast('(1 + 2) * 3')).toEqual(bin('*', bin('+', num(1), num(2)), num(3)))
>   expect(ast('((4))')).toEqual(num(4))
> })
>
> test('унарний мінус і плюс', () => {
>   expect(ast('-3')).toEqual(neg(num(3)))
>   expect(ast('2 * -3')).toEqual(bin('*', num(2), neg(num(3))))
>   expect(ast('--1')).toEqual(neg(neg(num(1))))
>   expect(ast('+5')).toEqual(num(5))
> })
>
> test('^ правоасоціативний і сильніший за унарний мінус', () => {
>   expect(ast('2 ^ 3 ^ 2')).toEqual(bin('^', num(2), bin('^', num(3), num(2))))
>   expect(ast('-2 ^ 2')).toEqual(neg(bin('^', num(2), num(2))))
>   expect(ast('2 ^ -1')).toEqual(bin('^', num(2), neg(num(1))))
> })
>
> test('незакрита дужка', () => {
>   expect(() => ast('(1 + 2')).toThrow('Очікувалась ")" на позиції 6')
> })
>
> test('зайві та порожні дужки', () => {
>   expect(() => ast('1 + 2)')).toThrow('Зайвий токен ")" на позиції 5')
>   expect(() => ast('()')).toThrow('Неочікуваний токен ")" на позиції 1')
> })
> ```
>
> > [!hint]- Підказка 1
> > `unary`: якщо `isOp('-', '+')` — спожий оператор і **рекурсивно** виклич `unary()` (так працює `--1`). Інакше — `power()`.
>
> > [!hint]- Підказка 2
> > `power`: `const base = primary(); if (isOp('^')) { i++; return { type: 'binary', op: '^', left: base, right: unary() } }`. Рекурсія праворуч = права асоціативність.
>
> > [!hint]- Підказка 3
> > `primary` для `(`: `const inner = expression()`, потім перевір `peek()?.value === ')'` і зсунь `i`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class CalcError extends Error {
> >   constructor(message, pos) {
> >     super(message)
> >     this.name = 'CalcError'
> >     this.pos = pos
> >   }
> > }
> >
> > function tokenize(src) {
> >   const tokens = []
> >   let i = 0
> >   while (i < src.length) {
> >     const ch = src[i]
> >     if (/\s/.test(ch)) {
> >       i++
> >       continue
> >     }
> >     if (/[0-9.]/.test(ch)) {
> >       const start = i
> >       while (i < src.length && /[0-9.]/.test(src[i])) i++
> >       const text = src.slice(start, i)
> >       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
> >       tokens.push({ type: 'num', value: Number(text), pos: start })
> >       continue
> >     }
> >     if ('+-*/^'.includes(ch)) {
> >       tokens.push({ type: 'op', value: ch, pos: i++ })
> >       continue
> >     }
> >     if (ch === '(' || ch === ')') {
> >       tokens.push({ type: 'paren', value: ch, pos: i++ })
> >       continue
> >     }
> >     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
> >   }
> >   return tokens
> > }
> >
> > function parse(tokens) {
> >   let i = 0
> >   const peek = () => tokens[i]
> >   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
> >   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
> >
> >   function expression() {
> >     let left = term()
> >     while (isOp('+', '-')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: term() }
> >     }
> >     return left
> >   }
> >
> >   function term() {
> >     let left = unary()
> >     while (isOp('*', '/')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: unary() }
> >     }
> >     return left
> >   }
> >
> >   function unary() {
> >     if (isOp('-', '+')) {
> >       const op = tokens[i++].value
> >       const arg = unary()
> >       return op === '-' ? { type: 'unary', op, arg } : arg
> >     }
> >     return power()
> >   }
> >
> >   function power() {
> >     const base = primary()
> >     if (isOp('^')) {
> >       i++
> >       return { type: 'binary', op: '^', left: base, right: unary() }
> >     }
> >     return base
> >   }
> >
> >   function primary() {
> >     const token = tokens[i++]
> >     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
> >     if (token.type === 'num') return { type: 'num', value: token.value }
> >     if (token.value === '(') {
> >       const inner = expression()
> >       if (peek()?.value !== ')') {
> >         const pos = peek()?.pos ?? endPos()
> >         throw new CalcError(`Очікувалась ")" на позиції ${pos}`, pos)
> >       }
> >       i++
> >       return inner
> >     }
> >     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
> >   }
> >
> >   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
> >   const result = expression()
> >   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
> >   return result
> > }
> > ```
> > **Чому так:** асоціативність — це **вибір між циклом і рекурсією**: цикл (`term`) нарощує лівий операнд, рекурсія праворуч (`power` → `unary`) будує праве піддерево. Дужки — просто повернення на найнижчий рівень граматики, тому вкладеність будь-якої глибини працює «безкоштовно». Унарний плюс не створює вузла: AST описує *зміст*, а не синтаксис — так evaluator і принтер мають на один випадок менше.

## 🛠️ Крок 4. Обчислення AST

Evaluator — рекурсивний обхід дерева: значення вузла = операція над значеннями дітей. Оператори тримаємо в мапі, як фільтри в розділі 1. Помилки обчислення (ділення на нуль, `10 ^ 400 = Infinity`, `(-8) ^ (1/3) = NaN`) — теж `CalcError`.

> [!task] Крок 4 · evaluate
> level: middle · difficulty: medium · id: jsp-02-task-04 · tags: recursion, ast, numbers
>
> Додай `evaluate(node)`:
>
> - `num` → значення; `unary` → мінус значення аргументу; `binary` → операція `+ - * / ^`;
> - ділення на нуль → `CalcError('Ділення на нуль')`;
> - результат операції не скінченне число (`Infinity`, `NaN`) → `CalcError('Результат не є скінченним числом')`;
> - невідомий тип вузла → `CalcError('Невідомий вузол: <type>')`.
>
> ```js starter
> class CalcError extends Error {
>   constructor(message, pos) {
>     super(message)
>     this.name = 'CalcError'
>     this.pos = pos
>   }
> }
>
> function tokenize(src) {
>   const tokens = []
>   let i = 0
>   while (i < src.length) {
>     const ch = src[i]
>     if (/\s/.test(ch)) {
>       i++
>       continue
>     }
>     if (/[0-9.]/.test(ch)) {
>       const start = i
>       while (i < src.length && /[0-9.]/.test(src[i])) i++
>       const text = src.slice(start, i)
>       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
>       tokens.push({ type: 'num', value: Number(text), pos: start })
>       continue
>     }
>     if ('+-*/^'.includes(ch)) {
>       tokens.push({ type: 'op', value: ch, pos: i++ })
>       continue
>     }
>     if (ch === '(' || ch === ')') {
>       tokens.push({ type: 'paren', value: ch, pos: i++ })
>       continue
>     }
>     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
>   }
>   return tokens
> }
>
> function parse(tokens) {
>   let i = 0
>   const peek = () => tokens[i]
>   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
>   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
>
>   function expression() {
>     let left = term()
>     while (isOp('+', '-')) {
>       const op = tokens[i++].value
>       left = { type: 'binary', op, left, right: term() }
>     }
>     return left
>   }
>
>   function term() {
>     let left = unary()
>     while (isOp('*', '/')) {
>       const op = tokens[i++].value
>       left = { type: 'binary', op, left, right: unary() }
>     }
>     return left
>   }
>
>   function unary() {
>     if (isOp('-', '+')) {
>       const op = tokens[i++].value
>       const arg = unary()
>       return op === '-' ? { type: 'unary', op, arg } : arg
>     }
>     return power()
>   }
>
>   function power() {
>     const base = primary()
>     if (isOp('^')) {
>       i++
>       return { type: 'binary', op: '^', left: base, right: unary() }
>     }
>     return base
>   }
>
>   function primary() {
>     const token = tokens[i++]
>     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
>     if (token.type === 'num') return { type: 'num', value: token.value }
>     if (token.value === '(') {
>       const inner = expression()
>       if (peek()?.value !== ')') {
>         const pos = peek()?.pos ?? endPos()
>         throw new CalcError(`Очікувалась ")" на позиції ${pos}`, pos)
>       }
>       i++
>       return inner
>     }
>     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
>   }
>
>   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
>   const result = expression()
>   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
>   return result
> }
>
> const BINARY = {
>   // '+': (a, b) => a + b, ...
> }
>
> function evaluate(node) {
>   // твій код
> }
> ```
>
> ```js tests
> const calc = (src) => evaluate(parse(tokenize(src)))
>
> test('пріоритети й асоціативність', () => {
>   expect(calc('2 + 3 * 4')).toBe(14)
>   expect(calc('(2 + 3) * 4')).toBe(20)
>   expect(calc('8 - 3 - 2')).toBe(3)
>   expect(calc('7 / 2')).toBe(3.5)
> })
>
> test('степінь і унарний мінус', () => {
>   expect(calc('2 ^ 3 ^ 2')).toBe(512)
>   expect(calc('-2 ^ 2')).toBe(-4)
>   expect(calc('(-2) ^ 2')).toBe(4)
>   expect(calc('2 ^ -1')).toBe(0.5)
> })
>
> test('ділення на нуль — CalcError', () => {
>   expect(() => calc('1 / (2 - 2)')).toThrow('Ділення на нуль')
>   expect(() => calc('1 / 0')).toThrow(CalcError)
> })
>
> test('нескінченність і NaN — CalcError', () => {
>   expect(() => calc('10 ^ 400')).toThrow('Результат не є скінченним числом')
>   expect(() => calc('(-8) ^ (1 / 3)')).toThrow('Результат не є скінченним числом')
> })
>
> test('працює з AST напряму', () => {
>   expect(evaluate({ type: 'num', value: 5 })).toBe(5)
>   expect(() => evaluate({ type: 'call', name: 'sin' })).toThrow('Невідомий вузол: call')
> })
> ```
>
> > [!hint]- Підказка 1
> > `switch (node.type)` з трьома гілками; у `binary` — `BINARY[node.op](evaluate(node.left), evaluate(node.right))`.
>
> > [!hint]- Підказка 2
> > Перевірку `Number.isFinite(result)` роби після кожної бінарної операції — так помилка з'являється там, де виникла, а не в кінці.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class CalcError extends Error {
> >   constructor(message, pos) {
> >     super(message)
> >     this.name = 'CalcError'
> >     this.pos = pos
> >   }
> > }
> >
> > function tokenize(src) {
> >   const tokens = []
> >   let i = 0
> >   while (i < src.length) {
> >     const ch = src[i]
> >     if (/\s/.test(ch)) {
> >       i++
> >       continue
> >     }
> >     if (/[0-9.]/.test(ch)) {
> >       const start = i
> >       while (i < src.length && /[0-9.]/.test(src[i])) i++
> >       const text = src.slice(start, i)
> >       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
> >       tokens.push({ type: 'num', value: Number(text), pos: start })
> >       continue
> >     }
> >     if ('+-*/^'.includes(ch)) {
> >       tokens.push({ type: 'op', value: ch, pos: i++ })
> >       continue
> >     }
> >     if (ch === '(' || ch === ')') {
> >       tokens.push({ type: 'paren', value: ch, pos: i++ })
> >       continue
> >     }
> >     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
> >   }
> >   return tokens
> > }
> >
> > function parse(tokens) {
> >   let i = 0
> >   const peek = () => tokens[i]
> >   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
> >   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
> >
> >   function expression() {
> >     let left = term()
> >     while (isOp('+', '-')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: term() }
> >     }
> >     return left
> >   }
> >
> >   function term() {
> >     let left = unary()
> >     while (isOp('*', '/')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: unary() }
> >     }
> >     return left
> >   }
> >
> >   function unary() {
> >     if (isOp('-', '+')) {
> >       const op = tokens[i++].value
> >       const arg = unary()
> >       return op === '-' ? { type: 'unary', op, arg } : arg
> >     }
> >     return power()
> >   }
> >
> >   function power() {
> >     const base = primary()
> >     if (isOp('^')) {
> >       i++
> >       return { type: 'binary', op: '^', left: base, right: unary() }
> >     }
> >     return base
> >   }
> >
> >   function primary() {
> >     const token = tokens[i++]
> >     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
> >     if (token.type === 'num') return { type: 'num', value: token.value }
> >     if (token.value === '(') {
> >       const inner = expression()
> >       if (peek()?.value !== ')') {
> >         const pos = peek()?.pos ?? endPos()
> >         throw new CalcError(`Очікувалась ")" на позиції ${pos}`, pos)
> >       }
> >       i++
> >       return inner
> >     }
> >     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
> >   }
> >
> >   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
> >   const result = expression()
> >   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
> >   return result
> > }
> >
> > const BINARY = {
> >   '+': (a, b) => a + b,
> >   '-': (a, b) => a - b,
> >   '*': (a, b) => a * b,
> >   '/': (a, b) => {
> >     if (b === 0) throw new CalcError('Ділення на нуль')
> >     return a / b
> >   },
> >   '^': (a, b) => a ** b,
> > }
> >
> > function evaluate(node) {
> >   switch (node.type) {
> >     case 'num':
> >       return node.value
> >     case 'unary':
> >       return -evaluate(node.arg)
> >     case 'binary': {
> >       const result = BINARY[node.op](evaluate(node.left), evaluate(node.right))
> >       if (!Number.isFinite(result)) throw new CalcError('Результат не є скінченним числом')
> >       return result
> >     }
> >     default:
> >       throw new CalcError(`Невідомий вузол: ${node.type}`)
> >   }
> > }
> > ```
> > **Чому так:** AST відокремлює *що* обчислювати від *як* читати рядок — evaluator не знає про пробіли, дужки й пріоритети, вони вже закодовані формою дерева. У JS `1 / 0` — це `Infinity`, а не помилка, тож калькулятор для людей мусить перевіряти явно. Мапа операторів дає точку розширення: `%` або `max` — один рядок.

## 🛠️ Крок 5. Фасад для UI

UI не хоче `try/catch` і стектрейсів — йому потрібен результат-об'єкт: або значення з гарним текстом, або повідомлення з позицією. Важливо ловити **лише** `CalcError`: чужу помилку (баг) треба пробросити, а не показати користувачу як «неправильний вираз».

> [!task] Крок 5 · calculate, formatNumber, caret
> level: middle · difficulty: medium · id: jsp-02-task-05 · tags: errors, facade, numbers
>
> Додай:
>
> - `formatNumber(value)` — округлення до 12 значущих цифр без хвостових нулів (`0.1 + 0.2` → `'0.3'`); `-0` → `'0'`;
> - `calculate(src)` → `{ ok: true, value, text }` або `{ ok: false, error, pos }` для `CalcError` (`pos` — `null`, якщо не відома). Інші помилки — **пробрасуй**;
> - `caret(src, pos)` → рядок виразу, перенос рядка і `^` під символом `pos`: `caret('1 + * 2', 4)` → `'1 + * 2\n    ^'`.
>
> ```js starter
> class CalcError extends Error {
>   constructor(message, pos) {
>     super(message)
>     this.name = 'CalcError'
>     this.pos = pos
>   }
> }
>
> function tokenize(src) {
>   const tokens = []
>   let i = 0
>   while (i < src.length) {
>     const ch = src[i]
>     if (/\s/.test(ch)) {
>       i++
>       continue
>     }
>     if (/[0-9.]/.test(ch)) {
>       const start = i
>       while (i < src.length && /[0-9.]/.test(src[i])) i++
>       const text = src.slice(start, i)
>       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
>       tokens.push({ type: 'num', value: Number(text), pos: start })
>       continue
>     }
>     if ('+-*/^'.includes(ch)) {
>       tokens.push({ type: 'op', value: ch, pos: i++ })
>       continue
>     }
>     if (ch === '(' || ch === ')') {
>       tokens.push({ type: 'paren', value: ch, pos: i++ })
>       continue
>     }
>     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
>   }
>   return tokens
> }
>
> function parse(tokens) {
>   let i = 0
>   const peek = () => tokens[i]
>   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
>   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
>
>   function expression() {
>     let left = term()
>     while (isOp('+', '-')) {
>       const op = tokens[i++].value
>       left = { type: 'binary', op, left, right: term() }
>     }
>     return left
>   }
>
>   function term() {
>     let left = unary()
>     while (isOp('*', '/')) {
>       const op = tokens[i++].value
>       left = { type: 'binary', op, left, right: unary() }
>     }
>     return left
>   }
>
>   function unary() {
>     if (isOp('-', '+')) {
>       const op = tokens[i++].value
>       const arg = unary()
>       return op === '-' ? { type: 'unary', op, arg } : arg
>     }
>     return power()
>   }
>
>   function power() {
>     const base = primary()
>     if (isOp('^')) {
>       i++
>       return { type: 'binary', op: '^', left: base, right: unary() }
>     }
>     return base
>   }
>
>   function primary() {
>     const token = tokens[i++]
>     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
>     if (token.type === 'num') return { type: 'num', value: token.value }
>     if (token.value === '(') {
>       const inner = expression()
>       if (peek()?.value !== ')') {
>         const pos = peek()?.pos ?? endPos()
>         throw new CalcError(`Очікувалась ")" на позиції ${pos}`, pos)
>       }
>       i++
>       return inner
>     }
>     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
>   }
>
>   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
>   const result = expression()
>   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
>   return result
> }
>
> const BINARY = {
>   '+': (a, b) => a + b,
>   '-': (a, b) => a - b,
>   '*': (a, b) => a * b,
>   '/': (a, b) => {
>     if (b === 0) throw new CalcError('Ділення на нуль')
>     return a / b
>   },
>   '^': (a, b) => a ** b,
> }
>
> function evaluate(node) {
>   switch (node.type) {
>     case 'num':
>       return node.value
>     case 'unary':
>       return -evaluate(node.arg)
>     case 'binary': {
>       const result = BINARY[node.op](evaluate(node.left), evaluate(node.right))
>       if (!Number.isFinite(result)) throw new CalcError('Результат не є скінченним числом')
>       return result
>     }
>     default:
>       throw new CalcError(`Невідомий вузол: ${node.type}`)
>   }
> }
>
> function formatNumber(value) {
>   // твій код
> }
>
> function calculate(src) {
>   // твій код
> }
>
> function caret(src, pos) {
>   // твій код
> }
> ```
>
> ```js tests
> test('успішний результат з форматуванням', () => {
>   const result = calculate('0.1 + 0.2')
>   expect(result.ok).toBe(true)
>   expect(result.value).toBe(0.1 + 0.2)
>   expect(result.text).toBe('0.3')
>   expect(calculate('1 / 3').text).toBe('0.333333333333')
>   expect(calculate('-0').text).toBe('0')
> })
>
> test('помилка вводу — результат з позицією', () => {
>   expect(calculate('2 + * 3')).toEqual({ ok: false, error: 'Неочікуваний токен "*" на позиції 4', pos: 4 })
> })
>
> test('помилка обчислення — pos null', () => {
>   expect(calculate('1 / 0')).toEqual({ ok: false, error: 'Ділення на нуль', pos: null })
> })
>
> test('чужі помилки не ковтаються', () => {
>   expect(() => calculate(null)).toThrow(TypeError)
> })
>
> test('caret показує позицію', () => {
>   expect(caret('1 + * 2', 4)).toBe('1 + * 2\n    ^')
>   expect(caret('(1', 2)).toBe('(1\n  ^')
> })
> ```
>
> > [!hint]- Підказка 1
> > `Number(value.toPrecision(12))` округлює і прибирає хвостові нулі; `String(...)` — у текст. `-0` перевір через `Object.is(value, -0)`.
>
> > [!hint]- Підказка 2
> > У `catch`: `if (!(error instanceof CalcError)) throw error`. `error.pos ?? null` перетворює `undefined` на `null`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class CalcError extends Error {
> >   constructor(message, pos) {
> >     super(message)
> >     this.name = 'CalcError'
> >     this.pos = pos
> >   }
> > }
> >
> > function tokenize(src) {
> >   const tokens = []
> >   let i = 0
> >   while (i < src.length) {
> >     const ch = src[i]
> >     if (/\s/.test(ch)) {
> >       i++
> >       continue
> >     }
> >     if (/[0-9.]/.test(ch)) {
> >       const start = i
> >       while (i < src.length && /[0-9.]/.test(src[i])) i++
> >       const text = src.slice(start, i)
> >       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
> >       tokens.push({ type: 'num', value: Number(text), pos: start })
> >       continue
> >     }
> >     if ('+-*/^'.includes(ch)) {
> >       tokens.push({ type: 'op', value: ch, pos: i++ })
> >       continue
> >     }
> >     if (ch === '(' || ch === ')') {
> >       tokens.push({ type: 'paren', value: ch, pos: i++ })
> >       continue
> >     }
> >     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
> >   }
> >   return tokens
> > }
> >
> > function parse(tokens) {
> >   let i = 0
> >   const peek = () => tokens[i]
> >   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
> >   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
> >
> >   function expression() {
> >     let left = term()
> >     while (isOp('+', '-')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: term() }
> >     }
> >     return left
> >   }
> >
> >   function term() {
> >     let left = unary()
> >     while (isOp('*', '/')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: unary() }
> >     }
> >     return left
> >   }
> >
> >   function unary() {
> >     if (isOp('-', '+')) {
> >       const op = tokens[i++].value
> >       const arg = unary()
> >       return op === '-' ? { type: 'unary', op, arg } : arg
> >     }
> >     return power()
> >   }
> >
> >   function power() {
> >     const base = primary()
> >     if (isOp('^')) {
> >       i++
> >       return { type: 'binary', op: '^', left: base, right: unary() }
> >     }
> >     return base
> >   }
> >
> >   function primary() {
> >     const token = tokens[i++]
> >     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
> >     if (token.type === 'num') return { type: 'num', value: token.value }
> >     if (token.value === '(') {
> >       const inner = expression()
> >       if (peek()?.value !== ')') {
> >         const pos = peek()?.pos ?? endPos()
> >         throw new CalcError(`Очікувалась ")" на позиції ${pos}`, pos)
> >       }
> >       i++
> >       return inner
> >     }
> >     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
> >   }
> >
> >   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
> >   const result = expression()
> >   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
> >   return result
> > }
> >
> > const BINARY = {
> >   '+': (a, b) => a + b,
> >   '-': (a, b) => a - b,
> >   '*': (a, b) => a * b,
> >   '/': (a, b) => {
> >     if (b === 0) throw new CalcError('Ділення на нуль')
> >     return a / b
> >   },
> >   '^': (a, b) => a ** b,
> > }
> >
> > function evaluate(node) {
> >   switch (node.type) {
> >     case 'num':
> >       return node.value
> >     case 'unary':
> >       return -evaluate(node.arg)
> >     case 'binary': {
> >       const result = BINARY[node.op](evaluate(node.left), evaluate(node.right))
> >       if (!Number.isFinite(result)) throw new CalcError('Результат не є скінченним числом')
> >       return result
> >     }
> >     default:
> >       throw new CalcError(`Невідомий вузол: ${node.type}`)
> >   }
> > }
> >
> > function formatNumber(value) {
> >   if (Object.is(value, -0)) return '0'
> >   return String(Number(value.toPrecision(12)))
> > }
> >
> > function calculate(src) {
> >   try {
> >     const value = evaluate(parse(tokenize(src)))
> >     return { ok: true, value, text: formatNumber(value) }
> >   } catch (error) {
> >     if (!(error instanceof CalcError)) throw error
> >     return { ok: false, error: error.message, pos: error.pos ?? null }
> >   }
> > }
> >
> > function caret(src, pos) {
> >   return `${src}\n${' '.repeat(pos)}^`
> > }
> > ```
> > **Чому так:** `{ ok, ... }` — патерн Result: UI обробляє обидві гілки без `try/catch`, а TypeScript зміг би звузити тип за `ok`. Фільтр `instanceof CalcError` — найважливіший рядок розділу: проковтнутий `TypeError` перетворився б на «некоректний вираз», і баг жив би роками. `toPrecision(12)` ховає артефакти IEEE 754 (`0.30000000000000004`) лише **при показі** — `value` лишається точним для подальших обчислень.

## 🛠️ Крок 6. Друк AST з мінімумом дужок

AST — центр конвеєра: з одного дерева можна обчислити, оптимізувати, перекласти в іншу мову — або **надрукувати** назад. Так працює Prettier: парсить код в AST і друкує заново. Головне — ставити дужки лише там, де без них зміниться зміст.

> [!task] Крок 6 · print
> level: senior · difficulty: hard · id: jsp-02-task-06 · tags: ast, printer, precedence
>
> Додай `print(node)` → рядок з пробілами навколо бінарних операторів (`'1 + 2 * 3'`) і **мінімумом дужок**:
>
> - дочірній вузол із **нижчим** пріоритетом за батьківський — у дужки;
> - з **рівним** пріоритетом: для лівоасоціативних (`+ - * /`) — у дужки лише **правий** операнд, для `^` — лише **лівий**;
> - унарний мінус друкується як `-` без пробілу; операнд у дужках, якщо його пріоритет нижчий за унарний.
>
> Пріоритети: `+ -` → 1, `* /` → 2, унарний → 3, `^` → 4, число → 5. Числа у вузлах — невід'ємні.
>
> ```js starter
> class CalcError extends Error {
>   constructor(message, pos) {
>     super(message)
>     this.name = 'CalcError'
>     this.pos = pos
>   }
> }
>
> function tokenize(src) {
>   const tokens = []
>   let i = 0
>   while (i < src.length) {
>     const ch = src[i]
>     if (/\s/.test(ch)) {
>       i++
>       continue
>     }
>     if (/[0-9.]/.test(ch)) {
>       const start = i
>       while (i < src.length && /[0-9.]/.test(src[i])) i++
>       const text = src.slice(start, i)
>       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
>       tokens.push({ type: 'num', value: Number(text), pos: start })
>       continue
>     }
>     if ('+-*/^'.includes(ch)) {
>       tokens.push({ type: 'op', value: ch, pos: i++ })
>       continue
>     }
>     if (ch === '(' || ch === ')') {
>       tokens.push({ type: 'paren', value: ch, pos: i++ })
>       continue
>     }
>     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
>   }
>   return tokens
> }
>
> function parse(tokens) {
>   let i = 0
>   const peek = () => tokens[i]
>   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
>   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
>
>   function expression() {
>     let left = term()
>     while (isOp('+', '-')) {
>       const op = tokens[i++].value
>       left = { type: 'binary', op, left, right: term() }
>     }
>     return left
>   }
>
>   function term() {
>     let left = unary()
>     while (isOp('*', '/')) {
>       const op = tokens[i++].value
>       left = { type: 'binary', op, left, right: unary() }
>     }
>     return left
>   }
>
>   function unary() {
>     if (isOp('-', '+')) {
>       const op = tokens[i++].value
>       const arg = unary()
>       return op === '-' ? { type: 'unary', op, arg } : arg
>     }
>     return power()
>   }
>
>   function power() {
>     const base = primary()
>     if (isOp('^')) {
>       i++
>       return { type: 'binary', op: '^', left: base, right: unary() }
>     }
>     return base
>   }
>
>   function primary() {
>     const token = tokens[i++]
>     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
>     if (token.type === 'num') return { type: 'num', value: token.value }
>     if (token.value === '(') {
>       const inner = expression()
>       if (peek()?.value !== ')') {
>         const pos = peek()?.pos ?? endPos()
>         throw new CalcError(`Очікувалась ")" на позиції ${pos}`, pos)
>       }
>       i++
>       return inner
>     }
>     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
>   }
>
>   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
>   const result = expression()
>   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
>   return result
> }
>
> const BINARY = {
>   '+': (a, b) => a + b,
>   '-': (a, b) => a - b,
>   '*': (a, b) => a * b,
>   '/': (a, b) => {
>     if (b === 0) throw new CalcError('Ділення на нуль')
>     return a / b
>   },
>   '^': (a, b) => a ** b,
> }
>
> function evaluate(node) {
>   switch (node.type) {
>     case 'num':
>       return node.value
>     case 'unary':
>       return -evaluate(node.arg)
>     case 'binary': {
>       const result = BINARY[node.op](evaluate(node.left), evaluate(node.right))
>       if (!Number.isFinite(result)) throw new CalcError('Результат не є скінченним числом')
>       return result
>     }
>     default:
>       throw new CalcError(`Невідомий вузол: ${node.type}`)
>   }
> }
>
> function formatNumber(value) {
>   if (Object.is(value, -0)) return '0'
>   return String(Number(value.toPrecision(12)))
> }
>
> function calculate(src) {
>   try {
>     const value = evaluate(parse(tokenize(src)))
>     return { ok: true, value, text: formatNumber(value) }
>   } catch (error) {
>     if (!(error instanceof CalcError)) throw error
>     return { ok: false, error: error.message, pos: error.pos ?? null }
>   }
> }
>
> function caret(src, pos) {
>   return `${src}\n${' '.repeat(pos)}^`
> }
>
> const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 }
>
> function precedenceOf(node) {
>   // твій код
> }
>
> function print(node) {
>   // твій код
> }
> ```
>
> ```js tests
> const show = (src) => print(parse(tokenize(src)))
>
> test('без зайвих дужок', () => {
>   expect(show('1+2*3')).toBe('1 + 2 * 3')
>   expect(show('((1))+(2*3)')).toBe('1 + 2 * 3')
>   expect(show('(8-3)-2')).toBe('8 - 3 - 2')
> })
>
> test('дужки там, де вони змінюють зміст', () => {
>   expect(show('(1+2)*3')).toBe('(1 + 2) * 3')
>   expect(show('8-(3-2)')).toBe('8 - (3 - 2)')
>   expect(show('8/(4/2)')).toBe('8 / (4 / 2)')
> })
>
> test('степінь правоасоціативний', () => {
>   expect(show('2^(3^2)')).toBe('2 ^ 3 ^ 2')
>   expect(show('(2^3)^2')).toBe('(2 ^ 3) ^ 2')
> })
>
> test('унарний мінус', () => {
>   expect(show('-(1+2)')).toBe('-(1 + 2)')
>   expect(show('(-2)^2')).toBe('(-2) ^ 2')
>   expect(show('-2^2')).toBe('-2 ^ 2')
>   expect(show('1 - -2')).toBe('1 - -2')
> })
>
> test('туди-назад: друк зберігає AST і значення', () => {
>   for (const src of ['-(1+2)*3^2/4', '2^-1', '((7-2)-(1-4))*-(3)', '1-(2+3)', '2^3^2']) {
>     const tree = parse(tokenize(src))
>     expect(parse(tokenize(print(tree)))).toEqual(tree)
>     expect(evaluate(parse(tokenize(print(tree))))).toBe(evaluate(tree))
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > `precedenceOf`: число → 5, унарний → 3, бінарний → `PRECEDENCE[node.op]`.
>
> > [!hint]- Підказка 2
> > Для бінарного вузла: `const p = PRECEDENCE[node.op]; const right = node.op === '^'`. Лівий у дужки, якщо `lp < p || (right && lp === p)`; правий — якщо `rp < p || (!right && rp === p)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class CalcError extends Error {
> >   constructor(message, pos) {
> >     super(message)
> >     this.name = 'CalcError'
> >     this.pos = pos
> >   }
> > }
> >
> > function tokenize(src) {
> >   const tokens = []
> >   let i = 0
> >   while (i < src.length) {
> >     const ch = src[i]
> >     if (/\s/.test(ch)) {
> >       i++
> >       continue
> >     }
> >     if (/[0-9.]/.test(ch)) {
> >       const start = i
> >       while (i < src.length && /[0-9.]/.test(src[i])) i++
> >       const text = src.slice(start, i)
> >       if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
> >       tokens.push({ type: 'num', value: Number(text), pos: start })
> >       continue
> >     }
> >     if ('+-*/^'.includes(ch)) {
> >       tokens.push({ type: 'op', value: ch, pos: i++ })
> >       continue
> >     }
> >     if (ch === '(' || ch === ')') {
> >       tokens.push({ type: 'paren', value: ch, pos: i++ })
> >       continue
> >     }
> >     throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
> >   }
> >   return tokens
> > }
> >
> > function parse(tokens) {
> >   let i = 0
> >   const peek = () => tokens[i]
> >   const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
> >   const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)
> >
> >   function expression() {
> >     let left = term()
> >     while (isOp('+', '-')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: term() }
> >     }
> >     return left
> >   }
> >
> >   function term() {
> >     let left = unary()
> >     while (isOp('*', '/')) {
> >       const op = tokens[i++].value
> >       left = { type: 'binary', op, left, right: unary() }
> >     }
> >     return left
> >   }
> >
> >   function unary() {
> >     if (isOp('-', '+')) {
> >       const op = tokens[i++].value
> >       const arg = unary()
> >       return op === '-' ? { type: 'unary', op, arg } : arg
> >     }
> >     return power()
> >   }
> >
> >   function power() {
> >     const base = primary()
> >     if (isOp('^')) {
> >       i++
> >       return { type: 'binary', op: '^', left: base, right: unary() }
> >     }
> >     return base
> >   }
> >
> >   function primary() {
> >     const token = tokens[i++]
> >     if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
> >     if (token.type === 'num') return { type: 'num', value: token.value }
> >     if (token.value === '(') {
> >       const inner = expression()
> >       if (peek()?.value !== ')') {
> >         const pos = peek()?.pos ?? endPos()
> >         throw new CalcError(`Очікувалась ")" на позиції ${pos}`, pos)
> >       }
> >       i++
> >       return inner
> >     }
> >     throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
> >   }
> >
> >   if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
> >   const result = expression()
> >   if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
> >   return result
> > }
> >
> > const BINARY = {
> >   '+': (a, b) => a + b,
> >   '-': (a, b) => a - b,
> >   '*': (a, b) => a * b,
> >   '/': (a, b) => {
> >     if (b === 0) throw new CalcError('Ділення на нуль')
> >     return a / b
> >   },
> >   '^': (a, b) => a ** b,
> > }
> >
> > function evaluate(node) {
> >   switch (node.type) {
> >     case 'num':
> >       return node.value
> >     case 'unary':
> >       return -evaluate(node.arg)
> >     case 'binary': {
> >       const result = BINARY[node.op](evaluate(node.left), evaluate(node.right))
> >       if (!Number.isFinite(result)) throw new CalcError('Результат не є скінченним числом')
> >       return result
> >     }
> >     default:
> >       throw new CalcError(`Невідомий вузол: ${node.type}`)
> >   }
> > }
> >
> > function formatNumber(value) {
> >   if (Object.is(value, -0)) return '0'
> >   return String(Number(value.toPrecision(12)))
> > }
> >
> > function calculate(src) {
> >   try {
> >     const value = evaluate(parse(tokenize(src)))
> >     return { ok: true, value, text: formatNumber(value) }
> >   } catch (error) {
> >     if (!(error instanceof CalcError)) throw error
> >     return { ok: false, error: error.message, pos: error.pos ?? null }
> >   }
> > }
> >
> > function caret(src, pos) {
> >   return `${src}\n${' '.repeat(pos)}^`
> > }
> >
> > const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 }
> >
> > function precedenceOf(node) {
> >   if (node.type === 'num') return 5
> >   if (node.type === 'unary') return 3
> >   return PRECEDENCE[node.op]
> > }
> >
> > function print(node) {
> >   if (node.type === 'num') return String(node.value)
> >   const wrap = (child, needed) => (needed ? `(${print(child)})` : print(child))
> >   if (node.type === 'unary') return `-${wrap(node.arg, precedenceOf(node.arg) < 3)}`
> >   const p = PRECEDENCE[node.op]
> >   const rightAssoc = node.op === '^'
> >   const lp = precedenceOf(node.left)
> >   const rp = precedenceOf(node.right)
> >   const left = wrap(node.left, lp < p || (rightAssoc && lp === p))
> >   const right = wrap(node.right, rp < p || (!rightAssoc && rp === p))
> >   return `${left} ${node.op} ${right}`
> > }
> > ```
> > **Чому так:** правило дужок — дзеркало граматики: дужки потрібні рівно тоді, коли парсер без них побудував би **інше** дерево. Тест «туди-назад» (`parse(print(ast))` дорівнює `ast`) — це property-based ідея: замість десятка прикладів перевіряємо властивість, що має триматися для будь-якого виразу. `8 / (4 / 2)` лишає дужки, хоча для `*` їх можна було б прибрати — консервативність тут дешевша за баг.

## 🎤 На співбесіді

> [!interview] Як би ти розвинув цей калькулятор до мови формул, як в Excel чи Google Sheets?
> level: senior · frequency: іноді · id: jsp-02-int-01
>
> ---
>
> Конвеєр лишається, росте граматика: **ідентифікатори і виклики** (`SUM(A1:B3)`, `max(x, 2)`) — новий рівень `call` у `primary`, нові токени `ident`, `,`, `:`. **Змінні й клітинки** — `evaluate(node, env)`, де `env` дає значення. **Залежності**: обходом AST збираємо, від яких клітинок залежить формула, будуємо граф і перераховуємо лише залежні клітинки в топологічному порядку; цикл у графі → помилка `#REF!`/`#CYCLE!`. **Продуктивність**: парсимо формулу один раз і кешуємо AST (або компілюємо в замикання), бо обчислюємо її тисячі разів. **Помилки** — значення, а не винятки (`#DIV/0!` поширюється по формулах). Для великих граматик беру генератор парсерів або Pratt-парсер, де пріоритети задаються таблицею.
>
> 📚 [[JavaScript - 15. Функції глибоко]] · [Crafting Interpreters: Parsing Expressions](https://craftinginterpreters.com/parsing-expressions.html) · [Wikipedia: Recursive descent parser](https://en.wikipedia.org/wiki/Recursive_descent_parser)

> [!interview] Чому не `eval` чи `new Function` для калькулятора? Як рахувати формули користувачів безпечно?
> level: middle · frequency: часто · id: jsp-02-int-02
>
> ---
>
> `eval('2+2')` виконує **будь-який** JS: `fetch('/api/delete-account')`, читання cookie, нескінченний цикл. Регулярка-фільтр «лише цифри й оператори» крихка: `[]`, `!+` і подібні комбінації дозволяють зібрати майже довільний код. Плюс `eval` блокує оптимізації рушія і заборонений суворою CSP (`unsafe-eval`). Власний парсер дозволяє **рівно** нашу граматику, дає людські помилки з позицією і контроль над ресурсами: ліміт довжини виразу, глибини вкладеності (захист від переповнення стека), розміру чисел. На сервері додатково — таймаут обчислення і ізоляція (worker), якщо формули можуть бути важкими.
>
> 📚 [[JavaScript - 30. Безпека в JavaScript]] · [MDN: eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)

## 🧠 Закріплення

> [!question]- Навіщо окремий токенізатор, якщо можна парсити символи напряму?
> *часто · дизайн* · `jsp-02-001`
>
> Розділення відповідальностей: лексер вирішує «що є числом, що пробілом», парсер — «як токени утворюють структуру». Парсер стає коротшим і думає термінами граматики; позиції токенів дають точні помилки; лексер можна тестувати окремо й замінити (наприклад, для `1,5` у локалі з комою).
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази]] · [Crafting Interpreters: Scanning](https://craftinginterpreters.com/scanning.html)

> [!question]- Як recursive descent кодує пріоритет операторів?
> *часто · теорія* · `jsp-02-002`
>
> Кожен рівень пріоритету — функція, що викликає функцію вищого рівня для операндів (`expression → term → unary → power → primary`). Оператори вищого пріоритету розбираються глибше в рекурсії, тому їхні вузли опиняються нижче в дереві й обчислюються першими.
>
> 📚 [[JavaScript - 15. Функції глибоко]] · [Crafting Interpreters: Parsing Expressions](https://craftinginterpreters.com/parsing-expressions.html)

> [!question]- Як у парсері реалізують ліву і праву асоціативність?
> *іноді · код* · `jsp-02-003`
>
> Ліва — циклом, що нарощує лівий операнд: `while (op) left = { op, left, right: next() }` → `(a - b) - c`. Права — рекурсією праворуч: `right: power()` (або `unary()`) → `a ^ (b ^ c)`. Ліва рекурсія `term := term '*' unary` у recursive descent зациклилась би назавжди.
>
> 📚 [[JavaScript - 15. Функції глибоко]] · [Theodore Norvell: Parsing Expressions by Recursive Descent](https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)

> [!question]- Навіщо AST, якщо можна обчислювати прямо під час парсингу?
> *часто · дизайн* · `jsp-02-004`
>
> AST — проміжне представлення, яке можна використати багато разів і по-різному: обчислити, надрукувати, оптимізувати (`2 * 3` → `6`), перевірити, кешувати (парсимо формулу раз, рахуємо тисячі разів зі змінними). Обчислення під час парсингу зливає дві відповідальності й унеможливлює все це.
>
> 📚 [[JavaScript - 32. Патерни проєктування]] · [Crafting Interpreters: Representing Code](https://craftinginterpreters.com/representing-code.html)

> [!question]- Чому `calculate` ловить лише `CalcError`, а решту пробрасує?
> *дуже часто · пастка* · `jsp-02-005`
>
> `CalcError` — очікувана помилка вводу, її показуємо користувачу. `TypeError` чи `ReferenceError` — баг у коді; якщо його проковтнути й показати як «некоректний вираз», баг стане невидимим. Правило: перехоплюй лише ті помилки, які вмієш обробити, і розрізняй їх за класом.
>
> 📚 [[JavaScript - 22. Помилки та їх обробка]] · [javascript.info: Custom errors](https://javascript.info/custom-errors)

> [!question]- Чому `formatNumber` використовує `toPrecision(12)` і лише для показу?
> *іноді · числа* · `jsp-02-006`
>
> Числа JS — IEEE 754 double, тож `0.1 + 0.2 === 0.30000000000000004`. Округлення до 12 значущих цифр ховає цей шум від людини. Але `value` лишається точним: якщо округлювати проміжні результати, похибки накопичувались би. Для грошей потрібні цілі копійки або decimal-бібліотека.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика]] · [MDN: Number.prototype.toPrecision()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision)

## ⚡ Фішки

> [!reel] 🧮 -2 ** 2 у JS — SyntaxError
> JS відмовився вгадувати, що означає `-2 ** 2`: `-(2²)` чи `(-2)²`. Треба дужки. Ми ж обрали математичну конвенцію: `-2 ^ 2 = -4`.
>
> ```js
> -2 ** 2   // SyntaxError
> (-2) ** 2 // → 4
> ```

> [!reel] 🌳 Prettier = parse + print
> Prettier не «форматує текст»: він парсить код в AST, викидає твої пробіли й дужки і друкує дерево заново з мінімумом дужок. Наш крок 6 — те саме в мініатюрі.

> [!reel] ♾️ 1 / 0 у JS — не помилка
> Ділення на нуль дає `Infinity`, `0 / 0` — `NaN`, і код мовчки рахує далі. Калькулятор для людей мусить перевіряти `Number.isFinite` сам.
>
> ```js
> 1 / 0  // → Infinity
> -1 / 0 // → -Infinity
> ```

## 🖥️ Зібрати в браузері

Збережи як `calc.html`. Результат рахується на кожне натискання клавіші, помилка показує `^` під проблемним місцем, історія — під полем вводу.

```html
<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Калькулятор</title>
  <style>
    body { font: 18px system-ui, sans-serif; max-width: 560px; margin: 40px auto; }
    input { width: 100%; font: 22px ui-monospace, monospace; padding: 8px; box-sizing: border-box; }
    pre { font: 16px ui-monospace, monospace; margin: 8px 0; }
    .error { color: #c62828; }
    .ok { color: #2e7d32; font-size: 28px; }
    li { cursor: pointer; font-family: ui-monospace, monospace; }
  </style>
</head>
<body>
  <h1>🧮 Калькулятор</h1>
  <form id="form"><input id="expr" placeholder="-(1.5 + 2) * 3 ^ 2 / 4" autocomplete="off" autofocus /></form>
  <div id="out"></div>
  <ol id="history"></ol>
  <script>
class CalcError extends Error {
  constructor(message, pos) {
    super(message)
    this.name = 'CalcError'
    this.pos = pos
  }
}

function tokenize(src) {
  const tokens = []
  let i = 0
  while (i < src.length) {
    const ch = src[i]
    if (/\s/.test(ch)) {
      i++
      continue
    }
    if (/[0-9.]/.test(ch)) {
      const start = i
      while (i < src.length && /[0-9.]/.test(src[i])) i++
      const text = src.slice(start, i)
      if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new CalcError(`Некоректне число "${text}" на позиції ${start}`, start)
      tokens.push({ type: 'num', value: Number(text), pos: start })
      continue
    }
    if ('+-*/^'.includes(ch)) {
      tokens.push({ type: 'op', value: ch, pos: i++ })
      continue
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch, pos: i++ })
      continue
    }
    throw new CalcError(`Невідомий символ "${ch}" на позиції ${i}`, i)
  }
  return tokens
}

function parse(tokens) {
  let i = 0
  const peek = () => tokens[i]
  const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)
  const endPos = () => (tokens.length ? tokens[tokens.length - 1].pos + 1 : 0)

  function expression() {
    let left = term()
    while (isOp('+', '-')) {
      const op = tokens[i++].value
      left = { type: 'binary', op, left, right: term() }
    }
    return left
  }

  function term() {
    let left = unary()
    while (isOp('*', '/')) {
      const op = tokens[i++].value
      left = { type: 'binary', op, left, right: unary() }
    }
    return left
  }

  function unary() {
    if (isOp('-', '+')) {
      const op = tokens[i++].value
      const arg = unary()
      return op === '-' ? { type: 'unary', op, arg } : arg
    }
    return power()
  }

  function power() {
    const base = primary()
    if (isOp('^')) {
      i++
      return { type: 'binary', op: '^', left: base, right: unary() }
    }
    return base
  }

  function primary() {
    const token = tokens[i++]
    if (!token) throw new CalcError('Неочікуваний кінець виразу', endPos())
    if (token.type === 'num') return { type: 'num', value: token.value }
    if (token.value === '(') {
      const inner = expression()
      if (peek()?.value !== ')') {
        const pos = peek()?.pos ?? endPos()
        throw new CalcError(`Очікувалась ")" на позиції ${pos}`, pos)
      }
      i++
      return inner
    }
    throw new CalcError(`Неочікуваний токен "${token.value}" на позиції ${token.pos}`, token.pos)
  }

  if (tokens.length === 0) throw new CalcError('Порожній вираз', 0)
  const result = expression()
  if (i < tokens.length) throw new CalcError(`Зайвий токен "${peek().value}" на позиції ${peek().pos}`, peek().pos)
  return result
}

const BINARY = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => {
    if (b === 0) throw new CalcError('Ділення на нуль')
    return a / b
  },
  '^': (a, b) => a ** b,
}

function evaluate(node) {
  switch (node.type) {
    case 'num':
      return node.value
    case 'unary':
      return -evaluate(node.arg)
    case 'binary': {
      const result = BINARY[node.op](evaluate(node.left), evaluate(node.right))
      if (!Number.isFinite(result)) throw new CalcError('Результат не є скінченним числом')
      return result
    }
    default:
      throw new CalcError(`Невідомий вузол: ${node.type}`)
  }
}

function formatNumber(value) {
  if (Object.is(value, -0)) return '0'
  return String(Number(value.toPrecision(12)))
}

function calculate(src) {
  try {
    const value = evaluate(parse(tokenize(src)))
    return { ok: true, value, text: formatNumber(value) }
  } catch (error) {
    if (!(error instanceof CalcError)) throw error
    return { ok: false, error: error.message, pos: error.pos ?? null }
  }
}

function caret(src, pos) {
  return `${src}\n${' '.repeat(pos)}^`
}

const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 }

function precedenceOf(node) {
  if (node.type === 'num') return 5
  if (node.type === 'unary') return 3
  return PRECEDENCE[node.op]
}

function print(node) {
  if (node.type === 'num') return String(node.value)
  const wrap = (child, needed) => (needed ? `(${print(child)})` : print(child))
  if (node.type === 'unary') return `-${wrap(node.arg, precedenceOf(node.arg) < 3)}`
  const p = PRECEDENCE[node.op]
  const rightAssoc = node.op === '^'
  const lp = precedenceOf(node.left)
  const rp = precedenceOf(node.right)
  const left = wrap(node.left, lp < p || (rightAssoc && lp === p))
  const right = wrap(node.right, rp < p || (!rightAssoc && rp === p))
  return `${left} ${node.op} ${right}`
}

    // ---------- DOM-шар
    const input = document.getElementById('expr')
    const out = document.getElementById('out')
    const history = document.getElementById('history')

    function show() {
      out.replaceChildren()
      if (input.value.trim() === '') return
      const result = calculate(input.value)
      if (result.ok) {
        const p = Object.assign(document.createElement('p'), { className: 'ok', textContent: `= ${result.text}` })
        const pretty = Object.assign(document.createElement('pre'), { textContent: print(parse(tokenize(input.value))) })
        out.append(p, pretty)
      } else {
        const p = Object.assign(document.createElement('p'), { className: 'error', textContent: result.error })
        out.append(p)
        if (result.pos !== null) out.append(Object.assign(document.createElement('pre'), { className: 'error', textContent: caret(input.value, result.pos) }))
      }
    }

    input.addEventListener('input', show)
    document.getElementById('form').addEventListener('submit', (event) => {
      event.preventDefault()
      const result = calculate(input.value)
      if (!result.ok) return
      const li = document.createElement('li')
      li.textContent = `${input.value} = ${result.text}`
      li.addEventListener('click', () => {
        input.value = result.text
        show()
      })
      history.prepend(li)
      input.value = result.text
      show()
    })
  </script>
</body>
</html>
```

> [!tip] Спробуй зламати
> Введи `2 ^ 3 ^ 2`, `-2 ^ 2`, `(1 + 2`, `1 / (3 - 3)`, `0.1 + 0.2`. Кожна поведінка — один з твоїх тестів. А тепер додай оператор `%` — це один рядок у `tokenize`, один у `term` і один у `BINARY`.

## 📚 Джерела та що почитати

- 🟢 [Crafting Interpreters — Scanning](https://craftinginterpreters.com/scanning.html) — лексер з нуля, найкраща книжка жанру (безкоштовно онлайн)
- 🟢 [Crafting Interpreters — Parsing Expressions](https://craftinginterpreters.com/parsing-expressions.html) — recursive descent і пріоритети
- 🟡 [Crafting Interpreters — Evaluating Expressions](https://craftinginterpreters.com/evaluating-expressions.html) — обхід AST і помилки часу виконання
- 🟡 [Theodore Norvell — Parsing Expressions by Recursive Descent](https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm) — класичний огляд технік, включно з precedence climbing
- 🟡 [Wikipedia — Shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm) — альтернативний алгоритм Дейкстри зі стеком
- 🟡 [MDN — Operator precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence) — таблиця пріоритетів самого JS
- 🛠️ [AST Explorer](https://astexplorer.net/) — подивись AST справжнього JS-коду в Babel, Acorn, TypeScript

> [!important] Підсумок
> - Конвеєр: рядок → токени → AST → значення / друк; кожен етап — чиста функція.
> - Пріоритет = рівень граматики; ліва асоціативність = цикл, права = рекурсія праворуч.
> - Власний клас помилки з позицією; ловимо лише його, решту пробрасуємо.
> - Результат-об'єкт `{ ok, … }` — зручний контракт для UI.
> - AST — центр: одне дерево, багато застосувань (evaluate, print, оптимізація).

---
title: Рядки та масиви
order: 1
level: junior
tags: [strings, arrays, unicode, two-pointers, hashmap]
prerequisites:
  - "[[JavaScript - 12. Масиви та функціональний стиль]]"
  - "[[JavaScript - 18. Рядки, Unicode і регулярні вирази]]"
estimatedMinutes: 90
id: jsk-ch-01
icon: "🔤"
---

# JavaScript Katas - 01. Рядки та масиви

> [!success] 🎯 Що тренуємо
> - Перебір рядка **по символах**, а не по UTF-16 одиницях: `Array.from`, `for…of`, прапорець `u` у регулярках.
> - Патерни «два вказівники» і «hashmap для групування» — фундамент половини алгоритмічних задач.
> - Рекурсію на вкладених масивах і вибір глибини.
> - Звичку не мутувати вхідні дані (і чесно казати, коли мутуєш навмисно).

## 🧭 Стратегія

Рядкові й масивні задачі на співбесіді — це «розминка», але саме тут кандидати найчастіше губляться на дрібницях: забули порожній рядок, розвернули емодзі навпіл, змутували аргумент. Ось чотири інструменти, яких вистачає майже на все.

**1. Два вказівники.** Один індекс зліва, другий справа, рухаються назустріч. Паліндроми, розворот на місці, злиття відсортованих масивів. O(n) часу і O(1) пам'яті.

```js
let left = 0
let right = arr.length - 1
while (left < right) {
  // порівняти або поміняти arr[left] і arr[right]
  left++
  right--
}
```

**2. Hashmap для групування.** Коли треба «зібрати схожі разом» — придумай **ключ**, однаковий для схожих елементів, і клади в `Map`. Анаграми → відсортовані літери. Унікальність → `Set` бачених ключів. `Map` зберігає порядок вставки, тож групи вийдуть у порядку першої появи.

**3. Рекурсія на вкладеності.** «Масив може містити масиви» = рекурсія з параметром глибини. Базовий випадок — елемент не масив або глибина вичерпана. Альтернатива для дуже глибоких структур — явний стек.

**4. Unicode-безпека.** `str.length` і `str[i]` рахують UTF-16 одиниці: `'😀'.length === 2`. Ітерація `for…of`, `Array.from(str)` і `[...str]` ідуть по **кодових точках**. Для «видимих символів» з модифікаторами (👍🏽, 👨‍👩‍👧) потрібен `Intl.Segmenter` — детально в [[JavaScript - 18. Рядки, Unicode і регулярні вирази]].

> [!tip] Перш ніж писати
> Спитай: «Чи можна мутувати вхідний масив?», «Що повертати для порожнього вводу?», «Регістр і пунктуація мають значення?». Три питання — і інтерв'юер бачить інженера, а не студента.

## 🧩 Збери з пам'яті

> [!quiz] Збери перевірку паліндрому двома вказівниками
> level: junior · type: order · id: jsk-01-quiz-01
>
> ```js order
> let left = 0
> let right = s.length - 1
> while (left < right) {
>   if (s[left] !== s[right]) return false
>   left++
>   right--
> }
> return true
> left = right   // ✗
> ```
>
> **Пояснення:** вказівники стартують з країв і йдуть назустріч, доки не зустрінуться. Перше ж розходження — не паліндром; якщо цикл завершився — паліндром.

> [!quiz] Заповни пропуски: ключ для групування анаграм
> level: junior · type: fill · id: jsk-01-quiz-02 · bank: reverse, split, add
>
> ```js fill
> const groups = new Map()
> for (const word of words) {
>   const key = [...word].[[sort]]().[[join]]('')
>   if (!groups.[[has]](key)) groups.set(key, [])
>   groups.get(key).[[push]](word)
> }
> return [...groups.[[values]]()]
> ```
>
> **Пояснення:** анаграми мають однаковий набір літер, тож відсортовані літери — ідеальний ключ. `Map` зберігає порядок вставки, тому групи йдуть у порядку першої появи.

> [!quiz] Збери поворот масиву вправо на k «на місці» за O(1) пам'яті
> level: middle · type: order · id: jsk-01-quiz-03
>
> ```js order
> k = ((k % n) + n) % n
> reverse(nums, 0, n - 1)
> reverse(nums, 0, k - 1)
> reverse(nums, k, n - 1)
> return nums
> nums.unshift(nums.pop())   // ✗
> ```
>
> **Пояснення:** розвернути весь масив, потім окремо перші `k` і решту. Нормалізація `k` обробляє `k > n` і від'ємні значення. `unshift` у циклі — O(n·k).

## 🛠️ Задачі

> [!task] Розверни слова в реченні
> level: junior · difficulty: easy · id: jsk-01-task-01 · tags: strings, split
>
> Напиши `reverseWords(str)`, яка повертає слова в зворотному порядку, розділені **одним** пробілом. Пробіли на краях і множинні пробіли/таби/переноси між словами прибираються. Самі слова не розвертаються.
>
> - `reverseWords('the sky is blue')` → `'blue is sky the'`
> - `reverseWords('  hello   world  ')` → `'world hello'`
> - `reverseWords('   ')` → `''`
>
> Обмеження: O(n) часу.
>
> ```js starter
> function reverseWords(str) {
>   // твій код
> }
> ```
>
> ```js tests
> test('базовий приклад', () => {
>   expect(reverseWords('the sky is blue')).toBe('blue is sky the')
> })
>
> test('прибирає зайві пробіли на краях і між словами', () => {
>   expect(reverseWords('  hello   world  ')).toBe('world hello')
> })
>
> test('таби й переноси рядків теж розділювачі', () => {
>   expect(reverseWords('a\tb\nc')).toBe('c b a')
> })
>
> test('одне слово', () => {
>   expect(reverseWords('single')).toBe('single')
> })
>
> test('порожній рядок і лише пробіли', () => {
>   expect(reverseWords('')).toBe('')
>   expect(reverseWords('    ')).toBe('')
> })
>
> test('Unicode-слова не ламаються', () => {
>   expect(reverseWords('привіт світ 👋')).toBe('👋 світ привіт')
> })
> ```
>
> > [!hint]- Підказка 1
> > `trim()` прибирає пробіли на краях, а `split(/\s+/)` розбиває за будь-якою послідовністю пробільних символів.
>
> > [!hint]- Підказка 2
> > Рядок з одних пробілів після `trim()` стає `''`, а `''.split(/\s+/)` дає `['']` — обробити окремо.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function reverseWords(str) {
> >   const trimmed = str.trim()
> >   if (trimmed === '') return ''
> >   return trimmed.split(/\s+/).reverse().join(' ')
> > }
> > ```
> > **Складність:** O(n) часу і пам'яті. **Чому так:** `\s+` поглинає будь-яку кількість пробільних символів, тож порожніх «слів» не буде; окрема перевірка потрібна лише для рядка з самих пробілів. **Що спитають далі:** «зроби це на місці в масиві символів за O(1) пам'яті» — розверни весь масив, потім кожне слово окремо (два вказівники).

> [!task] Unicode-безпечний паліндром
> level: junior · difficulty: easy · id: jsk-01-task-02 · tags: strings, unicode, two-pointers
>
> Напиши `isPalindrome(str)`: `true`, якщо рядок читається однаково в обидва боки. Ігноруй регістр і все, що не є літерою чи цифрою **будь-якої мови**. Порівнюй **символи (кодові точки)**, а не UTF-16 одиниці: `'𝒜'` — одна літера, хоч `'𝒜'.length === 2`.
>
> - `isPalindrome('A man, a plan, a canal: Panama')` → `true`
> - `isPalindrome('Я несу гусеня')` → `true`
> - `isPalindrome('hello')` → `false`
>
> Обмеження: O(n) часу.
>
> ```js starter
> function isPalindrome(str) {
>   // твій код
> }
> ```
>
> ```js tests
> test('класичний англійський паліндром', () => {
>   expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true)
> })
>
> test('кирилиця і пунктуація', () => {
>   expect(isPalindrome('Я несу гусеня')).toBe(true)
>   expect(isPalindrome('Де помити мопед?')).toBe(true)
> })
>
> test('не паліндром', () => {
>   expect(isPalindrome('hello')).toBe(false)
>   expect(isPalindrome('1a2')).toBe(false)
> })
>
> test('цифри враховуються', () => {
>   expect(isPalindrome('12321')).toBe(true)
> })
>
> test('порожній рядок і лише пунктуація — паліндроми', () => {
>   expect(isPalindrome('')).toBe(true)
>   expect(isPalindrome('!!! ,,,')).toBe(true)
> })
>
> test('літери поза BMP не розбиваються на половинки', () => {
>   expect(isPalindrome('𝒜b𝒜')).toBe(true)
>   expect(isPalindrome('𝒜b𝒞')).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > `Array.from(str)` розбиває рядок по кодових точках, а регулярка `/[\p{L}\p{N}]/u` перевіряє «літера або цифра будь-якої мови».
>
> > [!hint]- Підказка 2
> > Відфільтруй символи в масив, а потім два вказівники з країв назустріч.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isPalindrome(str) {
> >   const chars = Array.from(str.toLowerCase()).filter((ch) => /[\p{L}\p{N}]/u.test(ch))
> >   let left = 0
> >   let right = chars.length - 1
> >   while (left < right) {
> >     if (chars[left] !== chars[right]) return false
> >     left++
> >     right--
> >   }
> >   return true
> > }
> > ```
> > **Складність:** O(n) часу, O(n) пам'яті на масив символів. **Чому так:** без прапорця `u` і без `Array.from` сурогатні пари розпадаються на «половинки», які регулярка `\p{L}` не впізнає — тому `'𝒜b𝒞'` помилково стає паліндромом `'b'`. **Що спитають далі:** «а як із `é`, записаною як `e` + комбінований наголос?» — `str.normalize('NFC')`; «а без додаткової пам'яті?» — два вказівники по сирому рядку з пропуском небукв і ручною обробкою сурогатів через `codePointAt`.

> [!task] Згрупуй анаграми
> level: middle · difficulty: medium · id: jsk-01-task-03 · tags: hashmap, strings
>
> Напиши `groupAnagrams(words)`: згрупуй слова, що складаються з тих самих літер. Групи йдуть у порядку **першої появи**, слова в групі — у порядку вводу. Регістр має значення (`'ab'` і `'BA'` — різні групи).
>
> - `groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])` → `[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]`
>
> Обмеження: краще за O(n²) порівнянь пар.
>
> ```js starter
> function groupAnagrams(words) {
>   // твій код
> }
> ```
>
> ```js tests
> test('класичний приклад', () => {
>   expect(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])).toEqual([['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']])
> })
>
> test('порожній масив', () => {
>   expect(groupAnagrams([])).toEqual([])
> })
>
> test('порожній рядок — окрема група', () => {
>   expect(groupAnagrams(['', 'a', ''])).toEqual([['', ''], ['a']])
> })
>
> test('регістр має значення', () => {
>   expect(groupAnagrams(['ab', 'BA', 'ba'])).toEqual([['ab', 'ba'], ['BA']])
> })
>
> test('кирилиця', () => {
>   expect(groupAnagrams(['кіт', 'тік', 'кит'])).toEqual([['кіт', 'тік'], ['кит']])
> })
>
> test('дублікати лишаються в групі', () => {
>   expect(groupAnagrams(['abc', 'abc', 'cab'])).toEqual([['abc', 'abc', 'cab']])
> })
>
> test('різна кількість однакових літер — різні групи', () => {
>   expect(groupAnagrams(['aab', 'abb'])).toEqual([['aab'], ['abb']])
> })
> ```
>
> > [!hint]- Підказка 1
> > Придумай **ключ**, однаковий для всіх анаграм. Що спільного в `eat` і `tea`, якщо відсортувати літери?
>
> > [!hint]- Підказка 2
> > `Map` зберігає порядок вставки ключів — групи автоматично вийдуть у порядку першої появи.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function groupAnagrams(words) {
> >   const groups = new Map()
> >   for (const word of words) {
> >     const key = [...word].sort().join('')
> >     if (!groups.has(key)) groups.set(key, [])
> >     groups.get(key).push(word)
> >   }
> >   return [...groups.values()]
> > }
> > ```
> > **Складність:** O(n · k log k), де k — довжина слова. **Чому так:** порівнювати кожну пару — O(n² · k); ключ-підпис зводить задачу до одного проходу з hashmap. **Що спитають далі:** «а без сортування?» — ключ з лічильників літер (`'a1b2'`) дає O(n · k) для обмеженого алфавіту; «а якщо слів мільярд?» — групування за ключем у map-reduce.

> [!task] Розбий масив на шматки
> level: junior · difficulty: easy · id: jsk-01-task-04 · tags: arrays
>
> Напиши `chunk(arr, size)`: розбий масив на підмасиви довжиною `size`; останній може бути коротшим. Вхідний масив не мутуй. Якщо `size` не ціле число ≥ 1 — кинь `RangeError`.
>
> - `chunk([1, 2, 3, 4, 5], 2)` → `[[1, 2], [3, 4], [5]]`
> - `chunk([], 3)` → `[]`
>
> ```js starter
> function chunk(arr, size) {
>   // твій код
> }
> ```
>
> ```js tests
> test('ділить з коротшим хвостом', () => {
>   expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
> })
>
> test('ділиться націло', () => {
>   expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]])
> })
>
> test('size більший за довжину', () => {
>   expect(chunk([1, 2], 5)).toEqual([[1, 2]])
> })
>
> test('size = 1', () => {
>   expect(chunk(['a', 'b'], 1)).toEqual([['a'], ['b']])
> })
>
> test('порожній масив', () => {
>   expect(chunk([], 3)).toEqual([])
> })
>
> test('не мутує вхідний масив і не повертає його ж', () => {
>   const input = [1, 2, 3]
>   const result = chunk(input, 3)
>   expect(input).toEqual([1, 2, 3])
>   expect(result[0] === input).toBe(false)
> })
>
> test('некоректний size — RangeError', () => {
>   expect(() => chunk([1], 0)).toThrow(RangeError)
>   expect(() => chunk([1], -2)).toThrow(RangeError)
>   expect(() => chunk([1], 1.5)).toThrow(RangeError)
> })
> ```
>
> > [!hint]- Підказка 1
> > Крок циклу — `i += size`, а шматок — `arr.slice(i, i + size)`. `slice` не виходить за межі й не мутує.
>
> > [!hint]- Підказка 2
> > Валідацію зроби першим рядком: `Number.isInteger(size) && size >= 1`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function chunk(arr, size) {
> >   if (!Number.isInteger(size) || size < 1) throw new RangeError('size must be a positive integer')
> >   const result = []
> >   for (let i = 0; i < arr.length; i += size) {
> >     result.push(arr.slice(i, i + size))
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(n). **Чому так:** `slice` сам обрізає хвіст і повертає копію, тож немає ні off-by-one, ні мутацій. **Що спитають далі:** «а для нескінченного потоку?» — генератор `function* chunk(iterable, size)`, що віддає шматки ліниво.

> [!task] Flatten із глибиною
> level: middle · difficulty: medium · id: jsk-01-task-05 · tags: recursion, arrays
>
> Напиши `flatten(arr, depth = Infinity)` **без** `Array.prototype.flat`: розгорни вкладені масиви на `depth` рівнів. Не-масиви (об'єкти, рядки) не розгортаються. Вхідний масив не мутуй.
>
> - `flatten([1, [2, [3, [4]]]])` → `[1, 2, 3, 4]`
> - `flatten([1, [2, [3, [4]]]], 1)` → `[1, 2, [3, [4]]]`
>
> ```js starter
> function flatten(arr, depth = Infinity) {
>   // твій код
> }
> ```
>
> ```js tests
> test('за замовчуванням розгортає все', () => {
>   expect(flatten([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4])
> })
>
> test('глибина 1 і 2', () => {
>   expect(flatten([1, [2, [3, [4]]]], 1)).toEqual([1, 2, [3, [4]]])
>   expect(flatten([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]])
> })
>
> test('глибина 0 — копія без змін', () => {
>   const input = [1, [2]]
>   const result = flatten(input, 0)
>   expect(result).toEqual([1, [2]])
>   expect(result === input).toBe(false)
> })
>
> test('порожні вкладені масиви зникають', () => {
>   expect(flatten([[], [[]], 1])).toEqual([1])
> })
>
> test('об\'єкти й рядки не розгортаються', () => {
>   expect(flatten(['ab', { a: [1] }, ['c']])).toEqual(['ab', { a: [1] }, 'c'])
> })
>
> test('не мутує вхідні дані', () => {
>   const input = [1, [2, [3]]]
>   flatten(input)
>   expect(input).toEqual([1, [2, [3]]])
> })
>
> test('не використовує вбудований flat', () => {
>   const original = Array.prototype.flat
>   Array.prototype.flat = () => { throw new Error('flat заборонено') }
>   try {
>     expect(flatten([1, [2, [3]]])).toEqual([1, 2, 3])
>   } finally {
>     Array.prototype.flat = original
>   }
> })
> ```
>
> > [!hint]- Підказка 1
> > Пройди по елементах: масив і `depth > 0` → рекурсивно розгорни з `depth - 1`, інакше — просто додай.
>
> > [!hint]- Підказка 2
> > `Array.isArray(item)` — надійна перевірка, на відміну від `instanceof Array` (між realm-ами) чи `typeof`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function flatten(arr, depth = Infinity) {
> >   const result = []
> >   for (const item of arr) {
> >     if (Array.isArray(item) && depth > 0) {
> >       for (const inner of flatten(item, depth - 1)) result.push(inner)
> >     } else {
> >       result.push(item)
> >     }
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(N) — кожен елемент на всіх рівнях обробляється один раз (плюс копіювання проміжних масивів). **Чому так:** рекурсія природно повторює форму даних; `depth - 1` на кожному рівні. `result.push(...big)` для величезних масивів може перевищити ліміт аргументів — тому внутрішній цикл. **Що спитають далі:** «а якщо вкладеність 100 000?» — рекурсія впаде з `RangeError`, потрібен явний стек `[[arr, depth]]`; «а лінивий варіант?» — генератор з `yield*`.

> [!task] Унікальні за ключем
> level: junior · difficulty: easy · id: jsk-01-task-06 · tags: set, arrays
>
> Напиши `uniqueBy(arr, key)`: залиш лише **перший** елемент для кожного значення ключа. `key` — назва властивості (рядок) або функція `item => ключ`; якщо `key` не передано — ключем є сам елемент. Порядок зберігається. `NaN` вважається рівним `NaN`.
>
> - `uniqueBy([{ id: 1, v: 'a' }, { id: 1, v: 'b' }], 'id')` → `[{ id: 1, v: 'a' }]`
> - `uniqueBy(['A', 'a', 'b'], (s) => s.toLowerCase())` → `['A', 'b']`
>
> ```js starter
> function uniqueBy(arr, key) {
>   // твій код
> }
> ```
>
> ```js tests
> test('за назвою властивості, лишає перший', () => {
>   const users = [{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }]
>   expect(uniqueBy(users, 'id')).toEqual([{ id: 1, v: 'a' }, { id: 2, v: 'b' }])
> })
>
> test('за функцією', () => {
>   expect(uniqueBy(['A', 'a', 'b', 'B', 'c'], (s) => s.toLowerCase())).toEqual(['A', 'b', 'c'])
> })
>
> test('без ключа — унікальні значення', () => {
>   expect(uniqueBy([3, 1, 3, 2, 1])).toEqual([3, 1, 2])
> })
>
> test('NaN дорівнює NaN', () => {
>   expect(uniqueBy([NaN, 1, NaN])).toEqual([NaN, 1])
> })
>
> test('0 і "0" — різні ключі', () => {
>   expect(uniqueBy([0, '0', 0])).toEqual([0, '0'])
> })
>
> test('порожній масив і відсутня властивість', () => {
>   expect(uniqueBy([], 'id')).toEqual([])
>   expect(uniqueBy([{ a: 1 }, { b: 2 }], 'id')).toEqual([{ a: 1 }])
> })
>
> test('повертає ті самі об\'єкти, а не копії', () => {
>   const item = { id: 7 }
>   expect(uniqueBy([item], 'id')[0]).toBe(item)
> })
> ```
>
> > [!hint]- Підказка 1
> > Зведи обидва варіанти `key` до однієї функції `getKey`.
>
> > [!hint]- Підказка 2
> > `Set` порівнює за SameValueZero: `NaN` дорівнює `NaN`, а `0` і `'0'` — різні.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function uniqueBy(arr, key) {
> >   const getKey = typeof key === 'function' ? key : key === undefined ? (item) => item : (item) => item?.[key]
> >   const seen = new Set()
> >   const result = []
> >   for (const item of arr) {
> >     const k = getKey(item)
> >     if (seen.has(k)) continue
> >     seen.add(k)
> >     result.push(item)
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(n). **Чому так:** `Set` дає O(1) перевірку «бачили?», а `filter` + `findIndex` було б O(n²). **Що спитають далі:** «лишати останній, а не перший?» — пройти з кінця або `Map` з перезаписом; «ключ — об'єкт за вмістом?» — серіалізувати ключ (обережно з порядком полів).

> [!task] Zip кількох масивів
> level: junior · difficulty: easy · id: jsk-01-task-07 · tags: arrays
>
> Напиши `zip(...arrays)`: i-й результуючий масив містить i-ті елементи всіх вхідних. Довжина результату — довжина **найкоротшого** масиву (як у Python).
>
> - `zip([1, 2, 3], ['a', 'b', 'c'])` → `[[1, 'a'], [2, 'b'], [3, 'c']]`
> - `zip([1, 2], ['a'])` → `[[1, 'a']]`
>
> ```js starter
> function zip(...arrays) {
>   // твій код
> }
> ```
>
> ```js tests
> test('однакова довжина', () => {
>   expect(zip([1, 2, 3], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b'], [3, 'c']])
> })
>
> test('обрізає по найкоротшому', () => {
>   expect(zip([1, 2, 3], ['a'], [true, false])).toEqual([[1, 'a', true]])
> })
>
> test('один масив', () => {
>   expect(zip([1, 2])).toEqual([[1], [2]])
> })
>
> test('без аргументів і з порожнім масивом', () => {
>   expect(zip()).toEqual([])
>   expect(zip([1, 2], [])).toEqual([])
> })
>
> test('зберігає undefined і null як значення', () => {
>   expect(zip([undefined, null], [1, 2])).toEqual([[undefined, 1], [null, 2]])
> })
> ```
>
> > [!hint]- Підказка 1
> > Довжина результату — `Math.min(...arrays.map((a) => a.length))`. Що поверне `Math.min()` без аргументів?
>
> > [!hint]- Підказка 2
> > `Math.min()` — це `Infinity`, тож випадок «без аргументів» треба обробити окремо.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function zip(...arrays) {
> >   if (arrays.length === 0) return []
> >   const length = Math.min(...arrays.map((a) => a.length))
> >   return Array.from({ length }, (_, i) => arrays.map((a) => a[i]))
> > }
> > ```
> > **Складність:** O(m · L), де m — кількість масивів, L — довжина найкоротшого. **Чому так:** `Array.from({ length }, fn)` — ідіома «створи масив довжини L і заповни». **Що спитають далі:** «а для ітераторів, зокрема нескінченних?» — генератор, що на кожному кроці викликає `next()` у всіх і зупиняється на першому `done`.

> [!task] Поверни масив на k кроків на місці
> level: middle · difficulty: medium · id: jsk-01-task-08 · tags: arrays, two-pointers, in-place
>
> Напиши `rotate(nums, k)`: зсунь елементи **вправо** на `k` позицій **на місці** (мутуючи `nums`) і поверни той самий масив. Від'ємне `k` — зсув уліво. `k` може бути більшим за довжину.
>
> - `rotate([1, 2, 3, 4, 5, 6, 7], 3)` → `[5, 6, 7, 1, 2, 3, 4]`
> - `rotate([1, 2, 3], -1)` → `[2, 3, 1]`
>
> Обмеження: O(n) часу, O(1) додаткової пам'яті.
>
> ```js starter
> function rotate(nums, k) {
>   // твій код
> }
> ```
>
> ```js tests
> test('зсув праворуч', () => {
>   expect(rotate([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([5, 6, 7, 1, 2, 3, 4])
> })
>
> test('мутує і повертає той самий масив', () => {
>   const nums = [1, 2, 3]
>   const result = rotate(nums, 1)
>   expect(result).toBe(nums)
>   expect(nums).toEqual([3, 1, 2])
> })
>
> test('k більший за довжину', () => {
>   expect(rotate([1, 2, 3], 10)).toEqual([3, 1, 2])
>   expect(rotate([1, 2, 3], 3)).toEqual([1, 2, 3])
> })
>
> test('від\'ємний k — зсув ліворуч', () => {
>   expect(rotate([1, 2, 3], -1)).toEqual([2, 3, 1])
>   expect(rotate([1, 2, 3, 4], -6)).toEqual([3, 4, 1, 2])
> })
>
> test('k = 0, порожній масив, один елемент', () => {
>   expect(rotate([1, 2], 0)).toEqual([1, 2])
>   expect(rotate([], 5)).toEqual([])
>   expect(rotate([9], 4)).toEqual([9])
> })
> ```
>
> > [!hint]- Підказка 1
> > Нормалізуй `k`: `((k % n) + n) % n` перетворює і великі, і від'ємні значення в діапазон `0..n-1`.
>
> > [!hint]- Підказка 2
> > Трюк з трьома розворотами: розверни весь масив, потім перші `k` елементів, потім решту.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function rotate(nums, k) {
> >   const n = nums.length
> >   if (n === 0) return nums
> >   k = ((k % n) + n) % n
> >   reverse(nums, 0, n - 1)
> >   reverse(nums, 0, k - 1)
> >   reverse(nums, k, n - 1)
> >   return nums
> > }
> >
> > function reverse(arr, left, right) {
> >   while (left < right) {
> >     ;[arr[left], arr[right]] = [arr[right], arr[left]]
> >     left++
> >     right--
> >   }
> > }
> > ```
> > **Складність:** O(n) часу, O(1) пам'яті. **Чому так:** після розвороту всього масиву останні `k` елементів опиняються на початку, але задом наперед — два локальні розвороти виправляють порядок. `unshift(pop())` у циклі — O(n·k), а `[...slice, ...slice]` — O(n) пам'яті. **Що спитають далі:** «доведи коректність» і «знайди елемент у повернутому відсортованому масиві за O(log n)» — модифікований бінарний пошук.

## 🎤 На співбесіді

> [!interview] Чому `str.split('').reverse().join('')` — поганий спосіб розвернути рядок?
> level: middle · frequency: часто · id: jsk-01-int-01
>
> ---
>
> `split('')` ріже рядок на UTF-16 одиниці, тож емодзі й літери поза BMP (сурогатні пари) розпадаються на половинки, а після `reverse` половинки міняються місцями — виходить «битий» рядок. `Array.from(str)` / `[...str]` ріжуть по кодових точках — це краще, але й вони ламають графеми з кількох кодових точок: 👍🏽 (емодзі + модифікатор тону), 👨‍👩‍👧 (ZWJ-послідовність), `e` + комбінований наголос. Для «видимих символів» — `Intl.Segmenter` з `granularity: 'grapheme'`. На співбесіді варто назвати всі три рівні й спитати, який потрібен.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази]] · [MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) · [MDN: String — UTF-16 characters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters)

> [!interview] Як згрупувати анаграми швидше, ніж сортуючи кожне слово?
> level: middle · frequency: іноді · id: jsk-01-int-02
>
> ---
>
> Сортування літер коштує O(k log k) на слово. Для обмеженого алфавіту ключ можна будувати підрахунком: масив з 26 лічильників → рядок `'1#0#2#…'`. Це O(k) на слово і O(n · k) загалом. Для довільного Unicode — `Map` символ → кількість, відсортований за символом (повертаємось до сортування, але лише унікальних символів). Варто проговорити компроміс: сортування простіше і менше помилок, підрахунок швидший на довгих словах.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [GreatFrontEnd: String Anagram Groups](https://www.greatfrontend.com/questions/algo/string-anagram-groups)

> [!interview] Рекурсивний чи ітеративний flatten — що обрати?
> level: middle · frequency: часто · id: jsk-01-int-03
>
> ---
>
> Рекурсія коротша і читається як опис даних, але глибина обмежена стеком викликів (≈ 10 тисяч кадрів у V8): масив з вкладеністю 100 000 кине `RangeError: Maximum call stack size exceeded`. Ітеративний варіант тримає явний стек пар `[масив, глибина]` або йде з кінця: `pop` елемент, якщо це масив — `push(...item)`, інакше додай у результат і в кінці `reverse`. Пам'ять та сама O(N), але на купі, а не в стеку. Вбудований `flat(Infinity)` — найкращий вибір у продакшні.
>
> 📚 [[JavaScript - 01. Як JS виконує код]] · [MDN: Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) · [GreatFrontEnd: Flatten](https://www.greatfrontend.com/questions/javascript/flatten)

## ⚡ Фішки

> [!reel] 😀 Емодзі має довжину 2
> `length` рахує UTF-16 одиниці, а не символи. Символи поза BMP займають дві — сурогатну пару.
>
> ```js
> '😀'.length          // → 2
> [...'😀'].length     // → 1
> ```

> [!reel] 🧮 Math.min() без аргументів — це Infinity
> Нейтральний елемент мінімуму — нескінченність. Тому `Math.min(...[])` дає `Infinity`, а не `undefined`. Класична пастка в zip і подібних задачах.
>
> ```js
> Math.min()  // → Infinity
> Math.max()  // → -Infinity
> ```

> [!reel] 🔁 Три розвороти = поворот масиву
> Щоб зсунути масив на k вправо без додаткової пам'яті: розверни весь, потім перші k, потім решту. O(n) часу, O(1) пам'яті — улюблений трюк інтерв'юерів.

## 🧠 Закріплення

> [!question]- Чим `[...str]` відрізняється від `str.split('')`?
> *часто · теорія* · `jsk-01-001`
>
> `split('')` ділить на UTF-16 одиниці й розриває сурогатні пари (емодзі, `'𝒜'`). Spread, `Array.from` і `for…of` використовують ітератор рядка, який іде по кодових точках. Графеми з кількох кодових точок (👍🏽) розриває і те, і те — для них `Intl.Segmenter`.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази]] · [MDN: String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

> [!question]- Що означає `\p{L}` у регулярці і чому потрібен прапорець `u`?
> *іноді · теорія* · `jsk-01-002`
>
> `\p{L}` — Unicode property escape «будь-яка літера будь-якої мови», `\p{N}` — будь-яка цифра. Працює лише з прапорцем `u` (або `v`); без нього це синтаксична помилка. Прапорець `u` ще й змушує регулярку бачити сурогатну пару як один символ.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази]] · [MDN: Unicode character class escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape)

> [!question]- У чому суть патерну «два вказівники»?
> *дуже часто · патерн* · `jsk-01-003`
>
> Два індекси рухаються по масиву (назустріч або в одному напрямку з різною швидкістю), і кожен крок відкидає частину варіантів. Дає O(n) часу і O(1) пам'яті замість O(n²) перебору пар. Паліндроми, розворот на місці, злиття, two sum на відсортованому масиві.
>
> 📚 [[JavaScript Katas - 07. Алгоритми]] · [javascript.info: Arrays](https://javascript.info/array)

> [!question]- Як вибрати ключ для групування в hashmap?
> *часто · патерн* · `jsk-01-004`
>
> Ключ має бути **однаковим для елементів, які вважаються «однаковими»**, і різним для решти. Анаграми — відсортовані літери; дублікати без урахування регістру — `toLowerCase()`; об'єкти — значення поля. `Map` зберігає порядок вставки, `Set` — лише наявність.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

> [!question]- Як `Set` порівнює значення?
> *часто · теорія* · `jsk-01-005`
>
> За алгоритмом SameValueZero: як `===`, але `NaN` дорівнює `NaN` (а `+0` і `-0` рівні). Об'єкти — за посиланням. Тому `new Set([NaN, NaN]).size === 1`, а `new Set([{}, {}]).size === 2`.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]] · [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

> [!question]- Як нормалізувати k для повороту масиву, щоб працювали і великі, і від'ємні значення?
> *іноді · код* · `jsk-01-006`
>
> `((k % n) + n) % n`. Оператор `%` у JS зберігає знак діленого (`-1 % 3 === -1`), тому додаємо `n` і беремо остачу ще раз. Окремо обробити `n === 0`, бо `% 0` дає `NaN`.
>
> 📚 [[JavaScript - 17. Числа, BigInt і математика]] · [MDN: Remainder (%)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)

> [!question]- Чому для рядка з одних пробілів `trim().split(/\s+/)` дає не порожній масив?
> *рідко · пастка* · `jsk-01-007`
>
> Після `trim()` лишається `''`, а `''.split(будь-що)` повертає `['']` — масив з одним порожнім рядком. Тому порожній ввід перевіряють окремо або фільтрують `filter(Boolean)`.
>
> 📚 [[JavaScript - 18. Рядки, Unicode і регулярні вирази]] · [MDN: String.prototype.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Strings](https://javascript.info/string) — методи рядків і сурогатні пари простими словами
- 🟢 [javascript.info — Array methods](https://javascript.info/array-methods) — `slice`, `splice`, `map`, `reduce` з прикладами
- 🟡 [MDN — Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) — еталонна поведінка, з якою порівнюй свій flatten
- 🟡 [MDN — Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) — розбиття на графеми, слова й речення
- 🟡 [MDN — String.prototype.normalize()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) — чому `'é' !== 'é'` і як це виправити
- 🛠️ [GreatFrontEnd — Chunk](https://www.greatfrontend.com/questions/javascript/chunk) — ця ж задача з додатковими тестами
- 🛠️ [GreatFrontEnd — String Palindrome](https://www.greatfrontend.com/questions/algo/string-palindrome) — варіант задачі на паліндром
- 🛠️ [BFE.dev — implement _.chunk()](https://bigfrontend.dev/problem/implement-lodash-chunk) — та сама задача в стилі lodash

> [!important] Підсумок
> - Рядки ітеруй через `for…of` / `Array.from`, регулярки пиши з прапорцем `u` — інакше емодзі розпадуться.
> - Два вказівники — O(n) і O(1) пам'яті для паліндромів, розворотів і злиття.
> - Групування = вдалий ключ + `Map`; унікальність = `Set` бачених ключів.
> - Вкладеність = рекурсія з глибиною; для дуже глибоких структур — явний стек.
> - Спершу уточни мутацію, порожній ввід і регістр — і покрий їх прикладами.

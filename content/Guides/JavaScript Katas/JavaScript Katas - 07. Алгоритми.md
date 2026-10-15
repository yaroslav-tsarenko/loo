---
title: Алгоритми
order: 7
level: middle
tags: [algorithms, hashmap, two-pointers, sliding-window, binary-search, bfs, dfs]
prerequisites:
  - "[[JavaScript Katas - 01. Рядки та масиви]]"
  - "[[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви]]"
estimatedMinutes: 110
id: jsk-ch-07
icon: "🧮"
---

# JavaScript Katas - 07. Алгоритми

> [!success] 🎯 Що тренуємо
> - Впізнавати патерн за формулюванням: hashmap, стек, бінарний пошук, ковзне вікно, сортування + прохід, BFS/DFS.
> - Називати складність до написання коду і обґрунтовувати її.
> - Писати ітеративний DFS/BFS — рекурсія в JS ламається на глибині ~10 000.
> - Знати вартість вбудованих методів: `includes` — O(n), `sort` — O(n log n), `Map.get` — O(1).

## 🧭 Стратегія

На алгоритмічній секції важливо не «знати відповідь», а **швидко впізнати клас задачі**. Ось шпаргалка «фраза в умові → патерн»:

| Фраза в умові | Патерн | Складність |
|---|---|---|
| «знайди пару / чи бачили раніше» | hashmap | O(n) |
| «відсортований масив», «знайди позицію» | бінарний пошук | O(log n) |
| «найдовший/найкоротший підрядок з умовою» | ковзне вікно | O(n) |
| «дужки», «вкладеність», «скасувати останнє» | стек | O(n) |
| «інтервали», «розклад», «перетини» | сортування за початком + один прохід | O(n log n) |
| «топ-k», «найчастіші» | підрахунок + bucket sort / купа | O(n) / O(n log k) |
| «по рівнях», «найкоротший шлях у кроках» | BFS (черга) | O(V + E) |
| «усі шляхи», «обійти все» | DFS (стек / рекурсія) | O(V + E) |
| «обійти матрицю по колу/діагоналях» | симуляція з межами | O(m · n) |

**Рецепт ковзного вікна** (найчастіший патерн у рядкових задачах):

```js
let left = 0
for (let right = 0; right < arr.length; right++) {
  // додати arr[right] у вікно
  while (/* вікно порушує умову */ false) {
    // прибрати arr[left] з вікна
    left++
  }
  // вікно [left..right] валідне — оновити відповідь
}
```

Кожен елемент входить у вікно один раз і виходить один раз — тому O(n), хоча є вкладений `while`.

> [!warning] Рекурсія в JS не безрозмірна
> Стек викликів V8 вміщує порядку 10 000 кадрів. Дерево-«ланцюжок» глибиною 50 000 рекурсивний DFS не пройде — `RangeError: Maximum call stack size exceeded`. Явний стек (масив) живе в купі й обмежений лише пам'яттю. Механіка — у [[JavaScript - 01. Як JS виконує код]].

## 🧩 Збери з пам'яті

> [!quiz] Збери ковзне вікно для «найдовшого підрядка без повторів»
> level: middle · type: order · id: jsk-07-quiz-01
>
> ```js order
> const last = new Map()
> let left = 0
> let best = 0
> chars.forEach((ch, right) => {
>   if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1
>   last.set(ch, right)
>   best = Math.max(best, right - left + 1)
> })
> if (last.has(ch)) left = last.get(ch) + 1   // ✗
> ```
>
> **Пояснення:** умова `last.get(ch) >= left` критична: символ міг бути побачений **до** поточного вікна, і тоді `left` не можна рухати назад (рядок `'abba'`).

> [!quiz] Заповни пропуски в бінарному пошуку
> level: junior · type: fill · id: jsk-07-quiz-02 · bank: <, ceil, 0
>
> ```js fill
> let lo = 0
> let hi = arr.length - 1
> while (lo [[<=]] hi) {
>   const mid = lo + Math.[[floor]]((hi - lo) / 2)
>   if (arr[mid] === target) return mid
>   if (arr[mid] < target) lo = mid [[+]] 1
>   else hi = mid [[-]] 1
> }
> return [[-1]]
> ```
>
> **Пояснення:** межі включні, тому `<=`. `lo + (hi - lo) / 2` — звичка з мов з переповненням int; у JS безпечно і `(lo + hi) >> 1` для масивів до 2³¹.

> [!quiz] Заповни пропуски: перевірка дужок стеком
> level: junior · type: fill · id: jsk-07-quiz-03
>
> ```js fill
> const pairs = { ')': '(', ']': '[', '}': '{' }
> const stack = []
> for (const ch of s) {
>   if ('([{'.includes(ch)) stack.[[push]](ch)
>   else if (ch in pairs && stack.[[pop]]() !== pairs[ch]) return false
> }
> return stack.length === [[0]]
> ```
>
> **Пояснення:** закриваюча дужка має відповідати **останній** відкритій — це LIFO, тобто стек. Наприкінці стек має бути порожнім, інакше лишились незакриті.

## 🛠️ Задачі

> [!task] Two Sum
> level: junior · difficulty: easy · id: jsk-07-task-01 · tags: hashmap, arrays
>
> Напиши `twoSum(nums, target)`: поверни індекси `[i, j]` (`i < j`) двох **різних** елементів, сума яких дорівнює `target`, або `null`, якщо пари немає. Якщо пар кілька — поверни першу знайдену при проході зліва направо: з найменшим `j`, а для нього — з найменшим `i`.
>
> Обмеження: O(n) часу.
>
> ```js starter
> function twoSum(nums, target) {
>   // твій код
> }
> ```
>
> ```js tests
> test('класичні приклади', () => {
>   expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1])
>   expect(twoSum([3, 2, 4], 6)).toEqual([1, 2])
> })
>
> test('однакові значення', () => {
>   expect(twoSum([3, 3], 6)).toEqual([0, 1])
>   expect(twoSum([1, 1, 1], 2)).toEqual([0, 1])
> })
>
> test('елемент не можна використати двічі', () => {
>   expect(twoSum([3], 6)).toBe(null)
>   expect(twoSum([3, 4], 6)).toBe(null)
> })
>
> test('від\'ємні числа й нуль', () => {
>   expect(twoSum([-3, 4, 3, 90], 0)).toEqual([0, 2])
>   expect(twoSum([0, 4, 0], 0)).toEqual([0, 2])
> })
>
> test('перша пара за найменшим j, потім найменшим i', () => {
>   expect(twoSum([5, 1, 5, 1], 6)).toEqual([0, 1])
>   expect(twoSum([1, 5, 5, 1], 6)).toEqual([0, 1])
>   expect(twoSum([4, 2, 2, 4], 6)).toEqual([0, 1])
> })
>
> test('порожній масив', () => {
>   expect(twoSum([], 1)).toBe(null)
> })
> ```
>
> > [!hint]- Підказка 1
> > Для кожного `nums[j]` питання одне: «чи бачили ми раніше `target - nums[j]`?».
>
> > [!hint]- Підказка 2
> > `Map` значення → **перший** індекс. Спершу перевір доповнення, потім додай поточне (так елемент не спарується сам із собою), і не перезаписуй уже збережений індекс.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function twoSum(nums, target) {
> >   const firstIndex = new Map()
> >   for (let j = 0; j < nums.length; j++) {
> >     const complement = target - nums[j]
> >     if (firstIndex.has(complement)) return [firstIndex.get(complement), j]
> >     if (!firstIndex.has(nums[j])) firstIndex.set(nums[j], j)
> >   }
> >   return null
> > }
> > ```
> > **Складність:** O(n) часу, O(n) пам'яті. **Чому так:** brute force — O(n²) пар; hashmap перетворює «пошук пари» на O(1) запит «чи бачили доповнення». **Що спитають далі:** «масив відсортований і пам'ять O(1)?» — два вказівники з країв; «3Sum?» — сортування + для кожного елемента two pointers, O(n²); «усі пари?» — зберігати списки індексів.

> [!task] Правильні дужки
> level: junior · difficulty: easy · id: jsk-07-task-02 · tags: stack, strings
>
> Напиши `isValid(s)`: `true`, якщо кожна дужка `()`, `[]`, `{}` закрита дужкою того ж типу в правильному порядку. Інші символи ігноруються.
>
> ```js starter
> function isValid(s) {
>   // твій код
> }
> ```
>
> ```js tests
> test('правильні послідовності', () => {
>   expect(isValid('()')).toBe(true)
>   expect(isValid('()[]{}')).toBe(true)
>   expect(isValid('{[()]}')).toBe(true)
> })
>
> test('неправильний тип або порядок', () => {
>   expect(isValid('(]')).toBe(false)
>   expect(isValid('([)]')).toBe(false)
> })
>
> test('незакриті й зайві закриваючі', () => {
>   expect(isValid('(')).toBe(false)
>   expect(isValid('(()')).toBe(false)
>   expect(isValid(')')).toBe(false)
>   expect(isValid('())')).toBe(false)
>   expect(isValid(']]')).toBe(false)
> })
>
> test('порожній рядок — правильний', () => {
>   expect(isValid('')).toBe(true)
> })
>
> test('інші символи ігноруються', () => {
>   expect(isValid('if (a[0] > b) { run() }')).toBe(true)
>   expect(isValid('f(x]')).toBe(false)
> })
>
> test('лише лічильник не рятує', () => {
>   expect(isValid(')(')).toBe(false)
>   expect(isValid('[(])')).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > Відкриваючу дужку — у стек. Закриваюча має збігатися з **верхньою** у стеку.
>
> > [!hint]- Підказка 2
> > Об'єкт `pairs = { ')': '(', … }` дає відповідну відкриваючу. Після циклу стек має бути порожнім.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function isValid(s) {
> >   const pairs = { ')': '(', ']': '[', '}': '{' }
> >   const stack = []
> >   for (const ch of s) {
> >     if (ch === '(' || ch === '[' || ch === '{') stack.push(ch)
> >     else if (ch in pairs && stack.pop() !== pairs[ch]) return false
> >   }
> >   return stack.length === 0
> > }
> > ```
> > **Складність:** O(n) часу, O(n) пам'яті. **Чому так:** `stack.pop()` на порожньому стеку дає `undefined`, що не дорівнює жодній дужці, — окрема перевірка не потрібна. **Що спитають далі:** «мінімум вставок, щоб зробити правильним?»; «найдовша правильна підпослідовність?» — стек індексів; «а з рядками в лапках, де дужки не рахуються?» — стан «в рядку» в автоматі.

> [!task] Бінарний пошук першого входження
> level: junior · difficulty: easy · id: jsk-07-task-03 · tags: binary-search
>
> Напиши `binarySearch(sorted, target)`: у відсортованому за зростанням масиві поверни індекс **першого** входження `target` або `-1`.
>
> Обмеження: O(log n) — тест рахує кількість звернень до елементів масиву.
>
> ```js starter
> function binarySearch(sorted, target) {
>   // твій код
> }
> ```
>
> ```js tests
> test('знаходить елемент', () => {
>   expect(binarySearch([1, 3, 5, 7, 9], 7)).toBe(3)
>   expect(binarySearch([1, 3, 5, 7, 9], 1)).toBe(0)
>   expect(binarySearch([1, 3, 5, 7, 9], 9)).toBe(4)
> })
>
> test('відсутній елемент', () => {
>   expect(binarySearch([1, 3, 5], 4)).toBe(-1)
>   expect(binarySearch([1, 3, 5], 0)).toBe(-1)
>   expect(binarySearch([1, 3, 5], 6)).toBe(-1)
>   expect(binarySearch([], 1)).toBe(-1)
> })
>
> test('перше входження серед дублікатів', () => {
>   expect(binarySearch([1, 2, 2, 2, 3], 2)).toBe(1)
>   expect(binarySearch([2, 2, 2, 2], 2)).toBe(0)
>   expect(binarySearch([0, 0, 1, 1, 1], 1)).toBe(2)
> })
>
> test('від\'ємні числа', () => {
>   expect(binarySearch([-10, -5, 0, 5], -5)).toBe(1)
> })
>
> test('логарифмічна кількість звернень', () => {
>   const data = Array.from({ length: 100000 }, (_, i) => i * 2)
>   let reads = 0
>   const counted = new Proxy(data, {
>     get(target, key) {
>       if (typeof key === 'string' && /^\d+$/.test(key)) reads++
>       return target[key]
>     },
>   })
>   expect(binarySearch(counted, 77776)).toBe(38888)
>   expect(reads).toBeLessThanOrEqual(40)
> })
> ```
>
> > [!hint]- Підказка 1
> > Знайшовши `target`, не зупиняйся: запам'ятай індекс і шукай далі **ліворуч** (`hi = mid - 1`).
>
> > [!hint]- Підказка 2
> > Альтернатива — «lower bound»: шукай першу позицію, де `sorted[i] >= target`, а потім перевір, чи там справді `target`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function binarySearch(sorted, target) {
> >   let lo = 0
> >   let hi = sorted.length - 1
> >   let found = -1
> >   while (lo <= hi) {
> >     const mid = lo + Math.floor((hi - lo) / 2)
> >     const value = sorted[mid]
> >     if (value === target) {
> >       found = mid
> >       hi = mid - 1
> >     } else if (value < target) {
> >       lo = mid + 1
> >     } else {
> >       hi = mid - 1
> >     }
> >   }
> >   return found
> > }
> > ```
> > **Складність:** O(log n) часу, O(1) пам'яті. **Чому так:** продовження пошуку ліворуч після збігу гарантує перше входження без лінійного «відкату» назад (який на масиві з однакових елементів дав би O(n)). `value` читаємо один раз за ітерацію. **Що спитають далі:** «останнє входження?» — дзеркально, `lo = mid + 1`; «пошук у повернутому масиві?»; «бінарний пошук за відповіддю?» — мінімальна швидкість, щоб устигнути за T годин.

> [!task] Злиття інтервалів
> level: middle · difficulty: medium · id: jsk-07-task-04 · tags: sorting, intervals
>
> Напиши `mergeIntervals(intervals)`: злий усі інтервали `[start, end]`, що перетинаються або **торкаються** (`[1, 4]` і `[4, 5]` → `[1, 5]`). Результат — відсортований за початком. Вхідний масив і вкладені масиви не мутуй.
>
> - `mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])` → `[[1, 6], [8, 10], [15, 18]]`
>
> ```js starter
> function mergeIntervals(intervals) {
>   // твій код
> }
> ```
>
> ```js tests
> test('класичний приклад', () => {
>   expect(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])).toEqual([[1, 6], [8, 10], [15, 18]])
> })
>
> test('дотичні інтервали зливаються', () => {
>   expect(mergeIntervals([[1, 4], [4, 5]])).toEqual([[1, 5]])
> })
>
> test('несортований ввід', () => {
>   expect(mergeIntervals([[8, 10], [1, 3], [2, 6]])).toEqual([[1, 6], [8, 10]])
> })
>
> test('вкладений інтервал', () => {
>   expect(mergeIntervals([[1, 10], [2, 3], [4, 5]])).toEqual([[1, 10]])
> })
>
> test('порожній і один інтервал', () => {
>   expect(mergeIntervals([])).toEqual([])
>   expect(mergeIntervals([[5, 7]])).toEqual([[5, 7]])
> })
>
> test('числове сортування, а не рядкове', () => {
>   expect(mergeIntervals([[10, 12], [9, 10], [2, 3]])).toEqual([[2, 3], [9, 12]])
> })
>
> test('не мутує вхідні дані', () => {
>   const input = [[3, 5], [1, 4]]
>   const result = mergeIntervals(input)
>   expect(input).toEqual([[3, 5], [1, 4]])
>   expect(result).toEqual([[1, 5]])
>   expect(result[0] === input[1]).toBe(false)
> })
> ```
>
> > [!hint]- Підказка 1
> > Після сортування за початком інтервал може злитися лише з **останнім** у результаті.
>
> > [!hint]- Підказка 2
> > Сортуй копію: `[...intervals].sort((a, b) => a[0] - b[0])` — без компаратора `sort` порівнює рядки (`'10' < '9'`). У результат клади **копії** інтервалів, бо будеш змінювати їхній кінець.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function mergeIntervals(intervals) {
> >   const sorted = [...intervals].sort((a, b) => a[0] - b[0])
> >   const result = []
> >   for (const [start, end] of sorted) {
> >     const last = result[result.length - 1]
> >     if (last && start <= last[1]) {
> >       last[1] = Math.max(last[1], end)
> >     } else {
> >       result.push([start, end])
> >     }
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(n log n) через сортування, далі O(n). **Чому так:** `Math.max` потрібен для вкладених інтервалів (`[1, 10]` поглинає `[2, 3]`); деструктуризація `[start, end]` + `push([start, end])` автоматично створює копії. **Що спитають далі:** «вставити новий інтервал у вже злитий список?» — O(n) без сортування; «мінімальна кількість переговорних кімнат?» — сортування подій початку/кінця або купа.

> [!task] Найдовший підрядок без повторів
> level: middle · difficulty: medium · id: jsk-07-task-05 · tags: sliding-window, hashmap, unicode
>
> Напиши `lengthOfLongestSubstring(s)`: довжина найдовшого підрядка без повторюваних символів. Рахуй **символи** (кодові точки), а не UTF-16 одиниці: `'😀'` — один символ.
>
> Обмеження: O(n).
>
> ```js starter
> function lengthOfLongestSubstring(s) {
>   // твій код
> }
> ```
>
> ```js tests
> test('класичні приклади', () => {
>   expect(lengthOfLongestSubstring('abcabcbb')).toBe(3)
>   expect(lengthOfLongestSubstring('bbbbb')).toBe(1)
>   expect(lengthOfLongestSubstring('pwwkew')).toBe(3)
> })
>
> test('порожній рядок і пробіл', () => {
>   expect(lengthOfLongestSubstring('')).toBe(0)
>   expect(lengthOfLongestSubstring(' ')).toBe(1)
> })
>
> test('ліва межа не рухається назад', () => {
>   expect(lengthOfLongestSubstring('abba')).toBe(2)
>   expect(lengthOfLongestSubstring('dvdf')).toBe(3)
>   expect(lengthOfLongestSubstring('tmmzuxt')).toBe(5)
> })
>
> test('весь рядок унікальний', () => {
>   expect(lengthOfLongestSubstring('привіт')).toBe(6)
> })
>
> test('емодзі — один символ', () => {
>   expect(lengthOfLongestSubstring('😀😀')).toBe(1)
>   expect(lengthOfLongestSubstring('😀a😀')).toBe(2)
>   expect(lengthOfLongestSubstring('😀😃')).toBe(2)
> })
> ```
>
> > [!hint]- Підказка 1
> > Вікно `[left..right]` без повторів. `Map` символ → останній індекс.
>
> > [!hint]- Підказка 2
> > Якщо поточний символ уже є **всередині вікна** (`last.get(ch) >= left`), зсунь `left` на позицію після нього. Рядок розбий через `Array.from(s)`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function lengthOfLongestSubstring(s) {
> >   const chars = Array.from(s)
> >   const last = new Map()
> >   let left = 0
> >   let best = 0
> >   for (let right = 0; right < chars.length; right++) {
> >     const ch = chars[right]
> >     if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1
> >     last.set(ch, right)
> >     best = Math.max(best, right - left + 1)
> >   }
> >   return best
> > }
> > ```
> > **Складність:** O(n) часу, O(min(n, алфавіт)) пам'яті. **Чому так:** стрибок `left` одразу за дублікат замість поступового `left++` робить прохід строго однократним; перевірка `>= left` захищає від повернення межі назад. **Що спитають далі:** «не більше k різних символів?» — вікно з лічильниками і `while` для звуження; «мінімальне вікно, що містить усі символи `t`?» — класичний hard на те саме вікно.

> [!task] Top-k найчастіших
> level: middle · difficulty: medium · id: jsk-07-task-06 · tags: hashmap, bucket-sort
>
> Напиши `topKFrequent(items, k)`: поверни `k` найчастіших елементів, упорядкованих за частотою (спадання); при рівній частоті — за **першою появою** у вводі. Якщо унікальних менше за `k` — поверни всі.
>
> Обмеження: краще за O(n log n) — спробуй O(n).
>
> ```js starter
> function topKFrequent(items, k) {
>   // твій код
> }
> ```
>
> ```js tests
> test('класичний приклад', () => {
>   expect(topKFrequent([1, 1, 1, 2, 2, 3], 2)).toEqual([1, 2])
> })
>
> test('рівні частоти — за першою появою', () => {
>   expect(topKFrequent([3, 1, 1, 3, 2], 2)).toEqual([3, 1])
>   expect(topKFrequent(['b', 'a', 'c'], 3)).toEqual(['b', 'a', 'c'])
> })
>
> test('впорядковано за спаданням частоти', () => {
>   expect(topKFrequent(['x', 'y', 'y', 'z', 'z', 'z'], 3)).toEqual(['z', 'y', 'x'])
> })
>
> test('k більше за кількість унікальних і k = 0', () => {
>   expect(topKFrequent([5, 5, 6], 10)).toEqual([5, 6])
>   expect(topKFrequent([5, 5, 6], 0)).toEqual([])
> })
>
> test('порожній ввід', () => {
>   expect(topKFrequent([], 3)).toEqual([])
> })
>
> test('1 і "1" — різні елементи', () => {
>   expect(topKFrequent([1, '1', '1'], 2)).toEqual(['1', 1])
> })
> ```
>
> > [!hint]- Підказка 1
> > Порахуй частоти в `Map` — він запам'ятає порядок першої появи.
>
> > [!hint]- Підказка 2
> > Bucket sort: масив «кошиків» за частотою (індекс = частота, максимум n). Іди від найбільшої частоти до найменшої, доки не набереш `k`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function topKFrequent(items, k) {
> >   const counts = new Map()
> >   for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1)
> >   const buckets = Array.from({ length: items.length + 1 }, () => [])
> >   for (const [item, count] of counts) buckets[count].push(item)
> >   const result = []
> >   for (let freq = buckets.length - 1; freq > 0 && result.length < k; freq--) {
> >     for (const item of buckets[freq]) {
> >       if (result.length === k) break
> >       result.push(item)
> >     }
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(n) часу і пам'яті. **Чому так:** частота не перевищує n, тож кошики індексуються без сортування; порядок усередині кошика = порядок `Map` = перша поява. `Map` (а не об'єкт) розрізняє `1` і `'1'`. **Що спитають далі:** «потік даних і пам'ять O(k)?» — min-heap розміру k, O(n log k); «приблизно для мільярдів подій?» — Count-Min Sketch.

> [!task] Обхід дерева: BFS по рівнях і DFS без рекурсії
> level: middle · difficulty: medium · id: jsk-07-task-07 · tags: trees, bfs, dfs, stack, queue
>
> Вузол дерева — `{ value, children: [...] }` (дітей може бути скільки завгодно). Напиши:
>
> - `levelOrder(root)` → масив рівнів: `[[1], [2, 3], [4, 5]]` (діти — зліва направо);
> - `preorder(root)` → значення в порядку DFS pre-order (вузол, потім діти зліва направо).
>
> `root` може бути `null` → `[]`. **Глибина дерева може сягати 50 000** — рекурсія переповнить стек викликів.
>
> ```js starter
> function levelOrder(root) {
>   // твій код
> }
>
> function preorder(root) {
>   // твій код
> }
> ```
>
> ```js tests
> const node = (value, ...children) => ({ value, children })
> const tree = node(1, node(2, node(4), node(5)), node(3, node(6, node(7))))
>
> test('levelOrder по рівнях', () => {
>   expect(levelOrder(tree)).toEqual([[1], [2, 3], [4, 5, 6], [7]])
> })
>
> test('preorder: вузол, потім діти зліва направо', () => {
>   expect(preorder(tree)).toEqual([1, 2, 4, 5, 3, 6, 7])
> })
>
> test('порожнє дерево і один вузол', () => {
>   expect(levelOrder(null)).toEqual([])
>   expect(preorder(null)).toEqual([])
>   expect(levelOrder(node('a'))).toEqual([['a']])
>   expect(preorder(node('a'))).toEqual(['a'])
> })
>
> test('широке дерево', () => {
>   const wide = node(0, ...Array.from({ length: 5 }, (_, i) => node(i + 1)))
>   expect(levelOrder(wide)).toEqual([[0], [1, 2, 3, 4, 5]])
>   expect(preorder(wide)).toEqual([0, 1, 2, 3, 4, 5])
> })
>
> test('дуже глибоке дерево не переповнює стек', () => {
>   const root = node(0)
>   let current = root
>   for (let i = 1; i < 50000; i++) {
>     const next = node(i)
>     current.children.push(next)
>     current = next
>   }
>   const order = preorder(root)
>   expect(order).toHaveLength(50000)
>   expect(order[49999]).toBe(49999)
>   const levels = levelOrder(root)
>   expect(levels).toHaveLength(50000)
>   expect(levels[49999]).toEqual([49999])
> })
> ```
>
> > [!hint]- Підказка 1
> > BFS: обробляй рівень цілком — запам'ятай поточну «чергу рівня», збери значення, а дітей поклади в чергу наступного рівня. Так не потрібен `shift`.
>
> > [!hint]- Підказка 2
> > DFS зі стеком: `pop` вузол, запиши значення, поклади дітей у стек **у зворотному порядку** — тоді лівий опиниться зверху.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function levelOrder(root) {
> >   if (!root) return []
> >   const levels = []
> >   let current = [root]
> >   while (current.length > 0) {
> >     levels.push(current.map((n) => n.value))
> >     const next = []
> >     for (const n of current) {
> >       for (const child of n.children) next.push(child)
> >     }
> >     current = next
> >   }
> >   return levels
> > }
> >
> > function preorder(root) {
> >   if (!root) return []
> >   const result = []
> >   const stack = [root]
> >   while (stack.length > 0) {
> >     const n = stack.pop()
> >     result.push(n.value)
> >     for (let i = n.children.length - 1; i >= 0; i--) stack.push(n.children[i])
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(V) часу для обох; пам'ять — O(ширини) для BFS і O(глибини · розгалуження) для DFS. **Чому так:** обробка «рівень за рівнем» двома масивами замінює чергу і дає межі рівнів безкоштовно. Явний стек живе в купі, тож глибина 50 000 — не проблема. **Що спитають далі:** «post-order ітеративно?» — pre-order з дітьми в прямому порядку + `reverse`; «максимальна глибина / ширина?»; «найкоротший шлях у графі?» — BFS з `visited`.

> [!task] Спіральний обхід матриці
> level: middle · difficulty: medium · id: jsk-07-task-08 · tags: matrix, simulation
>
> Напиши `spiralOrder(matrix)`: поверни елементи матриці `m × n` у порядку спіралі за годинниковою стрілкою, починаючи з лівого верхнього кута. Матриця може бути прямокутною, з одного рядка чи стовпця, або порожньою (`[]`, `[[]]`).
>
> ```js starter
> function spiralOrder(matrix) {
>   // твій код
> }
> ```
>
> ```js tests
> test('квадратна 3×3', () => {
>   expect(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5])
> })
>
> test('прямокутна 3×4', () => {
>   expect(spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])).toEqual([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7])
> })
>
> test('висока 4×2', () => {
>   expect(spiralOrder([[1, 2], [3, 4], [5, 6], [7, 8]])).toEqual([1, 2, 4, 6, 8, 7, 5, 3])
> })
>
> test('один рядок і один стовпець', () => {
>   expect(spiralOrder([[1, 2, 3]])).toEqual([1, 2, 3])
>   expect(spiralOrder([[1], [2], [3]])).toEqual([1, 2, 3])
> })
>
> test('порожні та 1×1', () => {
>   expect(spiralOrder([])).toEqual([])
>   expect(spiralOrder([[]])).toEqual([])
>   expect(spiralOrder([[7]])).toEqual([7])
> })
>
> test('не мутує матрицю', () => {
>   const matrix = [[1, 2], [3, 4]]
>   spiralOrder(matrix)
>   expect(matrix).toEqual([[1, 2], [3, 4]])
> })
> ```
>
> > [!hint]- Підказка 1
> > Чотири межі: `top`, `bottom`, `left`, `right`. Пройди верхній рядок → правий стовпець → нижній рядок (справа наліво) → лівий стовпець (знизу вгору), стискаючи межі.
>
> > [!hint]- Підказка 2
> > Після верхнього рядка й правого стовпця перевір, чи ще лишився рядок (`top <= bottom`) і стовпець (`left <= right`) — інакше в матрицях з одного рядка чи стовпця елементи підуть двічі.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function spiralOrder(matrix) {
> >   const result = []
> >   if (matrix.length === 0 || matrix[0].length === 0) return result
> >   let top = 0
> >   let bottom = matrix.length - 1
> >   let left = 0
> >   let right = matrix[0].length - 1
> >   while (top <= bottom && left <= right) {
> >     for (let c = left; c <= right; c++) result.push(matrix[top][c])
> >     top++
> >     for (let r = top; r <= bottom; r++) result.push(matrix[r][right])
> >     right--
> >     if (top <= bottom) {
> >       for (let c = right; c >= left; c--) result.push(matrix[bottom][c])
> >       bottom--
> >     }
> >     if (left <= right) {
> >       for (let r = bottom; r >= top; r--) result.push(matrix[r][left])
> >       left++
> >     }
> >   }
> >   return result
> > }
> > ```
> > **Складність:** O(m · n) часу, O(1) додаткової пам'яті (крім результату). **Чому так:** межі замість матриці `visited` економлять пам'ять, а дві перевірки всередині циклу закривають випадки «залишився один рядок/стовпець». **Що спитають далі:** «заповни матрицю числами 1..n² по спіралі» — той самий обхід із записом; «поверни матрицю на 90°» — транспонування + розворот рядків.

## 🎤 На співбесіді

> [!interview] Яка складність популярних вбудованих методів JS?
> level: middle · frequency: часто · id: jsk-07-int-01
>
> ---
>
> `push`/`pop` — O(1) амортизовано; `shift`/`unshift`/`splice` у середині — O(n); `includes`/`indexOf`/`find` — O(n); `sort` — O(n log n) (V8 використовує TimSort, стабільний з ES2019); `slice`, spread, `concat` — O(n) копіювання; `Map`/`Set` `get`/`has`/`set` — O(1) у середньому; `Object.keys` — O(k). Пастка: `arr.includes` усередині циклу непомітно перетворює O(n) на O(n²) — заміняємо на `Set`.
>
> 📚 [[JavaScript - 31. Продуктивність і V8]] · [V8: Getting things sorted in V8](https://v8.dev/blog/array-sort) · [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)

> [!interview] Що робити, якщо не впізнаєш задачу?
> level: middle · frequency: часто · id: jsk-07-int-02
>
> ---
>
> Уголос: переказати умову, розібрати маленький приклад руками і подивитись, яку роботу я повторюю. Запропонувати brute force і його складність — це вже робоче рішення. Потім шукати вузьке місце: повторний пошук → hashmap; відсортовані дані → бінарний пошук чи два вказівники; «підрядок/підмасив» → вікно; «вкладене» → стек чи рекурсія; перебір підмножин → backtracking/DP. Якщо застряг — просити підказку не соромно: інтерв'юер оцінює, як я її використаю.
>
> 📚 [[JavaScript Katas - 01. Рядки та масиви]] · [Tech Interview Handbook: Coding interview techniques](https://www.techinterviewhandbook.org/coding-interview-techniques/)

> [!interview] Рекурсія чи ітерація для обходу дерев у JS?
> level: middle · frequency: іноді · id: jsk-07-int-03
>
> ---
>
> Рекурсія коротша й читається як визначення, і для збалансованих дерев (глибина ~log n) — нормальний вибір. Але JS не має гарантованої оптимізації хвостових викликів (у V8 її немає), а стек викликів обмежений кількома тисячами кадрів — вироджене дерево чи довгий зв'язний список кинуть `RangeError`. Ітеративний варіант з явним стеком (DFS) або чергою (BFS) обмежений лише пам'яттю купи. На співбесіді варто написати рекурсивно, а потім сказати про обмеження і показати ітеративну версію.
>
> 📚 [[JavaScript - 01. Як JS виконує код]] · [javascript.info: Recursion and stack](https://javascript.info/recursion)

## ⚡ Фішки

> [!reel] 🔢 sort() без компаратора сортує рядки
> За замовчуванням елементи порівнюються як рядки за UTF-16.
>
> ```js
> [10, 9, 1].sort()            // → [1, 10, 9]
> [10, 9, 1].sort((a, b) => a - b) // → [1, 9, 10]
> ```

> [!reel] 🪟 Вкладений while — і все одно O(n)
> У ковзному вікні кожен елемент один раз входить і один раз виходить. Сумарно `left` і `right` пройдуть по n кроків — 2n, тобто O(n).

> [!reel] 🕵️ Proxy рахує звернення до масиву
> Обгорни масив у `Proxy` з пасткою `get` — і побачиш, скільки елементів прочитав алгоритм. Так тест перевіряє, що бінарний пошук справді O(log n).

## 🧠 Закріплення

> [!question]- Коли використовувати ковзне вікно?
> *дуже часто · патерн* · `jsk-07-001`
>
> Коли треба знайти найкращий **суцільний** підмасив чи підрядок з умовою, яку можна підтримувати інкрементно при додаванні елемента справа і видаленні зліва (унікальність, сума, кількість різних символів). Дає O(n) замість O(n²) перебору всіх підрядків.
>
> 📚 [[JavaScript Katas - 07. Алгоритми]] · [GreatFrontEnd: Longest Non-repeating Substring](https://www.greatfrontend.com/questions/algo/longest-non-repeating-substring)

> [!question]- Чому для BFS не варто брати `queue.shift()` на великих даних?
> *часто · теорія* · `jsk-07-002`
>
> `shift` — O(n), тож BFS стає O(V²). Варіанти: індекс-вказівник `head` на масиві, обробка «рівень за рівнем» двома масивами або справжня черга з O(1) `dequeue`.
>
> 📚 [[JavaScript Katas - 06. Патерни та структури даних]] · [MDN: Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

> [!question]- Як знайти перше входження бінарним пошуком?
> *часто · код* · `jsk-07-003`
>
> На збігу запам'ятати індекс і продовжити пошук **ліворуч** (`hi = mid - 1`). Цикл закінчиться, коли ліворуч збігів не лишиться; збережений індекс — перший. O(log n) навіть для масиву з однакових елементів.
>
> 📚 [[JavaScript Katas - 07. Алгоритми]] · [GreatFrontEnd: Binary Search](https://www.greatfrontend.com/questions/algo/binary-search)

> [!question]- Чому в задачі злиття інтервалів треба сортувати з компаратором?
> *часто · пастка* · `jsk-07-004`
>
> `sort()` без компаратора приводить елементи до рядків: `[10, 12]` → `'10,12'`, і `'10,12' < '9,10'`. Потрібен `(a, b) => a[0] - b[0]`. Плюс сортувати копію, бо `sort` мутує.
>
> 📚 [[JavaScript - 12. Масиви та функціональний стиль]] · [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

> [!question]- Що таке bucket sort у задачі top-k?
> *іноді · патерн* · `jsk-07-005`
>
> Частота елемента — ціле від 1 до n, тож можна завести масив з n + 1 «кошиків», покласти кожен елемент у кошик своєї частоти і пройти кошики від кінця. O(n) замість O(n log n) сортування за частотою.
>
> 📚 [[JavaScript Katas - 07. Алгоритми]] · [GreatFrontEnd: Most Common Elements](https://www.greatfrontend.com/questions/algo/most-common-elements)

> [!question]- Як зробити ітеративний pre-order DFS для дерева з довільною кількістю дітей?
> *часто · код* · `jsk-07-006`
>
> Стек з коренем. Поки не порожній: `pop` вузол, записати значення, покласти дітей у стек у **зворотному** порядку (останнього першим), щоб лівий опинився зверху і був оброблений наступним.
>
> 📚 [[JavaScript - 01. Як JS виконує код]] · [javascript.info: Recursion and stack](https://javascript.info/recursion)

> [!question]- Чим перевірка дужок стеком краща за лічильник?
> *іноді · пастка* · `jsk-07-007`
>
> Лічильник перевіряє лише баланс одного типу і не бачить порядку: `')('` і `'[(])'` мають «правильну» кількість. Стек перевіряє, що кожна закриваюча відповідає саме **останній** відкритій.
>
> 📚 [[JavaScript Katas - 07. Алгоритми]] · [GreatFrontEnd: Balanced Brackets](https://www.greatfrontend.com/questions/algo/balanced-brackets)

## 📚 Джерела та що почитати

- 🟢 [Tech Interview Handbook — Algorithms study cheatsheet](https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/) — що повторити перед співбесідою
- 🟢 [javascript.info — Recursion and stack](https://javascript.info/recursion) — як рекурсія використовує стек
- 🟡 [V8 — Getting things sorted in V8](https://v8.dev/blog/array-sort) — TimSort і стабільність `sort`
- 🟡 [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) — складності структур і сортувань в одній таблиці
- 🎥 [VisuAlgo — Sorting](https://visualgo.net/en/sorting) — анімовані алгоритми
- 🛠️ [GreatFrontEnd — Balanced Brackets](https://www.greatfrontend.com/questions/algo/balanced-brackets), [Matrix Spiral Traversal](https://www.greatfrontend.com/questions/algo/matrix-spiral-traversal), [Binary Tree Level Order Traversal](https://www.greatfrontend.com/questions/algo/binary-tree-level-order-traversal)
- 🛠️ [NeetCode Roadmap](https://neetcode.io/roadmap) — задачі LeetCode, згруповані за патернами

> [!important] Підсумок
> - Впізнай патерн за формулюванням: пара → hashmap, відсортоване → бінарний пошук, підрядок → вікно, вкладеність → стек.
> - Назви brute force і його складність, потім оптимізуй — це вже половина оцінки.
> - Сортуй числа з компаратором і копію, а не оригінал.
> - Рядки — по кодових точках (`Array.from`), інакше емодзі ламають підрахунок.
> - Глибокі дерева — ітеративно з явним стеком або чергою.

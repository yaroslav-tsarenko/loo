---
title: Пам'ять, GC та колекції
order: 8
tags: [memory, garbage-collection, v8, collections, performance]
estimatedMinutes: 80
---

# JS Interview Q&A — 08. Пам'ять, GC та колекції

## 🟢 Junior

> [!question]- Що зберігається в stack, а що в heap?
> *часто · теорія* · `js-08-001`
>
> **Stack** — це стек викликів: фрейми функцій із локальними змінними, аргументами й адресою повернення. Він невеликий, пам'ять виділяється і звільняється автоматично при вході та виході з функції. **Heap** — динамічна пам'ять для об'єктів, масивів, функцій, замикань; її звільняє garbage collector.
>
> Класична ментальна модель: примітиви «лежать на стеку», об'єкти — в heap, а змінна містить посилання. Специфікація цього не визначає, і в V8 реальність тонша: малі цілі (Smi) зберігаються прямо в значенні, а рядки й дробові числа зазвичай теж живуть у heap. Але для поведінки мови важливо інше: об'єкти передаються за посиланням на спільний heap-об'єкт.
>
> ```js
> function recurse() { recurse(); }
> recurse(); // RangeError: Maximum call stack size exceeded
> ```
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Стек і heap — спрощено, але чесно|Розділ: стек і heap]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [V8: Trash talk — the Orinoco garbage collector](https://v8.dev/blog/trash-talk)

> [!question]- Що таке garbage collection і за яким принципом рушій вирішує, що пам'ять можна звільнити?
> *дуже часто · теорія* · `js-08-002`
>
> Garbage collection — автоматичне звільнення пам'яті об'єктів, які програмі більше не потрібні. Критерій — **досяжність (reachability)**: об'єкт живий, якщо до нього можна дійти ланцюжком посилань від коренів.
>
> Корені (roots):
> - глобальний об'єкт і змінні модулів;
> - локальні змінні та аргументи функцій, що зараз виконуються;
> - замикання, таймери, обробники подій, проміси в черзі — усе, що тримає рушій чи хост.
>
> ```js
> let user = { name: 'Ann' };
> const admins = [user];
> user = null;       // об'єкт ще досяжний через admins[0]
> admins.length = 0; // тепер недосяжний — GC може його зібрати
> ```
>
> Момент збирання не визначений: GC працює, коли рушій вирішить, і явно викликати його зі звичайного коду не можна.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Досяжність: хто вирішує, що живе|Розділ: досяжність]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [javascript.info: Garbage collection](https://javascript.info/garbage-collection)

> [!question]- Чим `Map` відрізняється від звичайного об'єкта?
> *дуже часто · порівняння* · `js-08-003`
>
> `Map` — спеціалізована колекція «ключ → значення», а об'єкт — структура з властивостями і прототипом, яку часто використовують як словник.
>
> - **ключі:** у `Map` будь-якого типу (об'єкти, функції, `NaN`), в об'єкті — лише рядки й symbol'и, числа перетворюються на рядки;
> - **порядок:** `Map` ітерується в порядку вставки; в об'єкті цілочисельні ключі йдуть першими за зростанням;
> - **розмір:** `map.size` проти `Object.keys(obj).length`;
> - **прототип:** у `Map` немає «успадкованих» ключів, тому `'constructor'` чи `'__proto__'` не створюють колізій;
> - **продуктивність:** `Map` оптимізований під часті додавання і видалення.
>
> ```js
> const m = new Map([[{ id: 1 }, 'obj'], [1, 'num'], ['1', 'str']]);
> m.size; // 3 — 1 і '1' різні ключі
> ```
>
> Об'єкт лишається зручнішим для записів із відомою структурою і для JSON: `JSON.stringify(map)` дає `{}`.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви|Розділ: Map, Set і типізовані масиви]] · [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) · [javascript.info: Map and Set](https://javascript.info/map-set)

> [!question]- Що таке `Set` і як з його допомогою прибрати дублікати?
> *часто · код* · `js-08-004`
>
> `Set` — колекція **унікальних значень** у порядку вставки. Унікальність визначається алгоритмом SameValueZero: як `===`, але `NaN` дорівнює `NaN`, а `+0` і `-0` вважаються однаковими. Об'єкти порівнюються за посиланням.
>
> ```js
> const ids = [3, 1, 3, 2, 1];
> const unique = [...new Set(ids)]; // [3, 1, 2]
>
> const s = new Set();
> s.add(NaN).add(NaN);
> s.size;          // 1
> s.add({}).add({});
> s.size;          // 3 — два різні об'єкти
> s.has(3);        // false
> ```
>
> Перевірка `has` у `Set` працює в середньому за O(1), тоді як `array.includes` — O(n), тому для частих перевірок членства `Set` суттєво швидший.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви|Розділ: Map, Set і типізовані масиви]] · [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) · [javascript.info: Map and Set](https://javascript.info/map-set)

> [!question]- Як у JavaScript виникає витік пам'яті, якщо є garbage collector?
> *часто · теорія* · `js-08-005`
>
> GC звільняє лише **недосяжні** об'єкти. Витік — це коли об'єкт вам уже не потрібен, але на нього досі є посилання від кореня, тож для GC він живий. GC не знає ваших намірів, він бачить лише граф посилань.
>
> Типові джерела:
> - обробник події на `window` від компонента, який вже прибрали;
> - `setInterval`, який ніхто не зупинив;
> - глобальний масив чи `Map`, куди лише додають;
> - DOM-вузол, видалений зі сторінки, але збережений у змінній.
>
> ```js
> const cache = [];
> function onRequest(req) {
>   cache.push(req); // росте вічно
> }
> ```
>
> Симптом — пам'ять вкладки чи процесу поступово росте і не повертається до базового рівня після повторення одного й того ж сценарію.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Типові витоки пам'яті|Розділ: витоки пам'яті]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [Chrome DevTools: Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems)

## 🟡 Middle

> [!question]- Як працює mark-and-sweep і чому рушії не використовують підрахунок посилань?
> *часто · теорія* · `js-08-006`
>
> **Mark-and-sweep** працює у дві фази:
> 1. **Mark:** від коренів обходиться граф посилань, кожен досяжний об'єкт позначається.
> 2. **Sweep:** усі непозначені об'єкти вважаються сміттям, їхня пам'ять повертається у вільні списки.
>
> Часто додається третя фаза — **compact**: живі об'єкти переміщуються щільніше, щоб зменшити фрагментацію.
>
> **Reference counting** рахує кількість посилань на об'єкт і звільняє його при нулі. Проблема — цикли: два об'єкти, що посилаються один на одного, мають лічильник 1 навіть коли до них не дістатись. Старі IE з COM-об'єктами DOM страждали саме від цього.
>
> ```js
> function link() {
>   const a = {};
>   const b = {};
>   a.peer = b;
>   b.peer = a;
> }
> link(); // після виходу цикл недосяжний — mark-and-sweep його збере
> ```
>
> **На співбесіді:** mark-and-sweep розв'язує цикли «безкоштовно», бо його критерій — досяжність, а не кількість посилань.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Mark-and-sweep (і compact)|Розділ: mark-and-sweep]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [javascript.info: Garbage collection](https://javascript.info/garbage-collection)

> [!question]- Чим `WeakMap` і `WeakSet` відрізняються від `Map` і `Set`?
> *часто · порівняння* · `js-08-007`
>
> `WeakMap` тримає ключі **слабко**: посилання з WeakMap не робить ключ досяжним. Коли на об'єкт-ключ не лишилось інших посилань, GC прибирає і його, і запис із WeakMap. Значення тримається лише поки живий ключ (так звана ephemeron-семантика).
>
> Звідси обмеження:
> - ключами можуть бути лише об'єкти та незареєстровані symbol'и (з ES2023), не примітиви;
> - немає `size`, `keys()`, `forEach`, ітерації — вміст залежить від того, коли спрацював GC, і був би недетермінованим;
> - доступні лише `get`, `set`, `has`, `delete`.
>
> `WeakSet` — аналогічно для множини об'єктів: «чи бачив я цей об'єкт», без утримання його в пам'яті.
>
> ```js
> const visited = new WeakSet();
> function walk(node) {
>   if (visited.has(node)) return;
>   visited.add(node);
>   node.children?.forEach(walk);
> }
> ```
>
> **На співбесіді:** важливо сказати, що WeakMap не «чистить значення»: якщо значення посилається на свій ключ, це не заважає збиранню — на відміну від звичайного `Map`.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#WeakMap, WeakSet, WeakRef, FinalizationRegistry|Розділ: слабкі посилання]] · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [javascript.info: WeakMap and WeakSet](https://javascript.info/weakmap-weakset)

> [!question]- Де на практиці застосовують `WeakMap`?
> *іноді · код* · `js-08-008`
>
> `WeakMap` потрібен, коли треба **прикріпити дані до чужого об'єкта**, не змінюючи його і не подовжуючи йому життя.
>
> Типові сценарії:
> - кеш обчислень для об'єкта (мемоізація за аргументом-об'єктом);
> - метадані для DOM-вузлів: вузол видалили — дані зникли разом із ним;
> - приватні дані екземпляра до появи `#private` полів;
> - відстеження оброблених об'єктів у серіалізаторах і deep clone (захист від циклів).
>
> ```js
> const layoutCache = new WeakMap();
>
> function measure(el) {
>   let rect = layoutCache.get(el);
>   if (!rect) {
>     rect = el.getBoundingClientRect();
>     layoutCache.set(el, rect);
>   }
>   return rect;
> }
> ```
>
> Якби тут був `Map`, кожен колись виміряний елемент жив би вічно, навіть після видалення з DOM.
>
> Обмеження: інвалідацію за часом чи розміром WeakMap не дає — лише «поки живий ключ». Якщо ключ живе весь час роботи застосунку, WeakMap поводиться як звичайний `Map`.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#WeakMap, WeakSet, WeakRef, FinalizationRegistry|Розділ: WeakMap]] · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [MDN: Keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections)

> [!question]- Які найчастіші причини витоків пам'яті у фронтенді та Node.js?
> *дуже часто · практика* · `js-08-009`
>
> Усі вони зводяться до одного: довгоживучий корінь тримає посилання на короткоживучі дані.
>
> - **Event listeners** на `window`, `document`, EventEmitter або WebSocket, додані компонентом і не зняті при unmount. Обробник — замикання, що тримає стан компонента.
> - **Таймери та підписки:** `setInterval`, `requestAnimationFrame`-цикли, observable-підписки, `ResizeObserver` без `disconnect()`.
> - **Замикання**, які захоплюють великі об'єкти і зберігаються в довгоживучому місці.
> - **Detached DOM:** вузол видалено з документа, але посилання лишилось у JS-змінній, масиві чи кеші — тримається все піддерево.
> - **Необмежені кеші:** `Map` на рівні модуля без TTL і ліміту; у Node — кеш на кожен запит.
>
> ```js
> useEffect(() => {
>   const controller = new AbortController();
>   window.addEventListener('resize', onResize, { signal: controller.signal });
>   const id = setInterval(poll, 5000);
>   return () => {
>     controller.abort();
>     clearInterval(id);
>   };
> }, []);
> ```
>
> **На співбесіді:** `AbortController` із `signal` дозволяє зняти будь-яку кількість слухачів одним викликом, це зручніше за парні `removeEventListener`.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Типові витоки пам'яті|Розділ: витоки пам'яті]] · [Chrome DevTools: Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems) · [Node.js: Understanding and Tuning Memory](https://nodejs.org/learn/diagnostics/memory/understanding-and-tuning-memory)

> [!question]- Як реалізувати LRU-кеш за допомогою `Map`?
> *часто · код* · `js-08-010`
>
> Ідея спирається на гарантію, що `Map` **ітерується в порядку вставки**. Отже, перший ключ — найдавніше використаний.
>
> - `get`: якщо ключ є — видалити і вставити заново, щоб він став «найсвіжішим».
> - `set`: видалити старий запис (якщо був), вставити; якщо розмір перевищив ліміт — видалити перший ключ з `map.keys().next().value`.
>
> Усі операції — O(1) в середньому, без окремого двозв'язного списку.
>
> ```js
> class LRU {
>   #map = new Map();
>   constructor(limit) { this.limit = limit; }
>   get(key) {
>     if (!this.#map.has(key)) return undefined;
>     const value = this.#map.get(key);
>     this.#map.delete(key);
>     this.#map.set(key, value);
>     return value;
>   }
>   set(key, value) {
>     this.#map.delete(key);
>     this.#map.set(key, value);
>     if (this.#map.size > this.limit) {
>       this.#map.delete(this.#map.keys().next().value);
>     }
>   }
> }
> ```
>
> Пастка: `map.set` для **існуючого** ключа не переміщує його в кінець — оновлюється лише значення. Тому потрібен `delete` перед `set`.
>
> **На співбесіді:** у класичному варіанті (C++/Java) LRU будують на hash map + двозв'язному списку; в JS `Map` уже дає обидві властивості.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви|Розділ: Map, Set і типізовані масиви]] · [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) · [javascript.info: Map and Set](https://javascript.info/map-set)

> [!question]- Чим `structuredClone` відрізняється від `JSON.parse(JSON.stringify(obj))`?
> *часто · порівняння* · `js-08-011`
>
> `structuredClone` робить глибоку копію за **structured clone algorithm** — тим самим, що використовують `postMessage` та IndexedDB. JSON-трюк серіалізує в рядок і назад, втрачаючи все, що не є JSON.
>
> Що вміє `structuredClone`, а JSON — ні:
> - `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, typed arrays, `Blob`, `Error`;
> - циклічні посилання і спільні посилання (об'єкт, на який посилаються двічі, лишиться одним об'єктом);
> - `undefined`, `NaN`, `Infinity`, `BigInt`.
>
> Що не вміють обидва: функції, DOM-вузли і symbol'и — `structuredClone` на них кидає `DataCloneError`. Прототипи губляться: екземпляр класу стає звичайним об'єктом, getters обчислюються в значення, приватні `#` поля не копіюються.
>
> ```js
> const src = { at: new Date(0), tags: new Set(['a']) };
> src.self = src;
> const copy = structuredClone(src);
> copy.at instanceof Date;  // true
> copy.self === copy;       // true
> JSON.parse(JSON.stringify({ at: new Date(0) })).at; // '1970-01-01T00:00:00.000Z'
> ```
>
> 📚 [[JavaScript - 23. JSON, structuredClone і серіалізація|Розділ: JSON, structuredClone і серіалізація]] · [MDN: The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) · [MDN: JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

> [!question]- Які методи множин з'явились у `Set` в ES2025 і які в них нюанси?
> *іноді · код* · `js-08-012`
>
> ES2025 додав у `Set.prototype` сім методів. Чотири повертають **новий** `Set`, три — boolean:
> - `union`, `intersection`, `difference`, `symmetricDifference`;
> - `isSubsetOf`, `isSupersetOf`, `isDisjointFrom`.
>
> ```js
> const a = new Set([1, 2, 3]);
> const b = new Set([2, 3, 4]);
> a.union(b);               // Set {1, 2, 3, 4}
> a.intersection(b);        // Set {2, 3}
> a.difference(b);          // Set {1}
> a.symmetricDifference(b); // Set {1, 4}
> new Set([2]).isSubsetOf(a); // true
>
> a.union([4, 5]); // TypeError: аргумент має бути set-like
> ```
>
> Нюанси:
> - аргумент має бути **set-like**: мати `size`, `has()` і `keys()`. Масив не підходить, але `Map` підходить (працює з ключами);
> - вихідні множини не мутуються;
> - алгоритм обирає, по кому ітерувати, залежно від розмірів, тож для `intersection` порядок елементів результату може відрізнятися від очікуваного.
>
> Доступні в усіх сучасних браузерах і в Node 22+; для старіших середовищ є поліфіл у core-js.
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви|Розділ: Map, Set і типізовані масиви]] · [MDN: Set.prototype.union()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union) · [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

> [!question]- Що таке `ArrayBuffer`, typed arrays і `DataView`?
> *іноді · теорія* · `js-08-013`
>
> `ArrayBuffer` — блок сирої двійкової пам'яті фіксованої довжини; напряму читати його не можна. **Typed arrays** (`Uint8Array`, `Int32Array`, `Float64Array` тощо) — представлення (view) поверх буфера з конкретним типом елемента. Кілька views можуть ділити один буфер.
>
> ```js
> const buf = new ArrayBuffer(8);
> const bytes = new Uint8Array(buf);
> const view = new DataView(buf);
>
> view.setUint16(0, 0x0102, false); // big-endian явно
> bytes[0]; // 1
> bytes[1]; // 2
>
> new Uint8Array([256, -1]);        // Uint8Array [0, 255] — переповнення за модулем
> new Uint8ClampedArray([256, -1]); // [255, 0] — обрізання до меж
> ```
>
> Ключові моменти:
> - довжина typed array фіксована, немає `push`;
> - порядок байтів у typed arrays — платформений (майже завжди little-endian), `DataView` дає явний контроль, тому його використовують для бінарних протоколів і форматів файлів;
> - з ES2024 `ArrayBuffer` може бути resizable: `new ArrayBuffer(8, { maxByteLength: 64 })`.
>
> Застосування: `fetch().arrayBuffer()`, WebSocket, WebGL, WebAssembly, `Buffer` у Node (підклас `Uint8Array`).
>
> 📚 [[JavaScript - 19. Map, Set, WeakMap, WeakSet і типізовані масиви|Розділ: Map, Set і типізовані масиви]] · [MDN: JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays) · [javascript.info: ArrayBuffer, binary arrays](https://javascript.info/arraybuffer-binary-arrays)

## 🔴 Senior

> [!question]- Як влаштований generational garbage collector у V8?
> *іноді · теорія* · `js-08-014`
>
> V8 спирається на **generational hypothesis**: більшість об'єктів помирає молодими. Тому heap поділено на покоління з різними алгоритмами.
>
> **Young generation** — невеликий простір, поділений на semi-spaces. Нові об'єкти виділяються сюди дуже дешево (bump pointer). Коли простір заповнюється, запускається **Scavenger**: копіює живі об'єкти в інший semi-space, решта звільняється автоматично. Вартість пропорційна кількості живих, а не мертвих об'єктів. Об'єкт, що пережив дві scavenge-збірки, переноситься (promotion) в old generation. Scavenger працює паралельно в кількох потоках.
>
> **Old generation** збирається **Mark-Compact** (major GC): маркування від коренів, sweep, compaction фрагментованих сторінок. Щоб не зупиняти JS надовго, проєкт Orinoco зробив маркування **concurrent** (у фонових потоках, поки JS працює), паузи — інкрементальними, а sweeping — лінивим і паралельним. Зв'язок між поколіннями відстежують **write barriers** і remembered sets, щоб scavenge не обходив увесь old space.
>
> Також є large object space для великих об'єктів, які не переміщуються.
>
> Практичні висновки:
> - короткоживучі алокації дешеві, але велика кількість алокацій у гарячому циклі все одно дає часті scavenge;
> - об'єкти, що «трохи пожили» і потрапили в old space (наприклад, накопичені на запит), дорожчі — їх збирає лише major GC;
> - паузи GC видно в Performance-профілі як `Minor GC` / `Major GC`, у Node — через `--trace-gc`.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Поколіннєвий GC у V8 (спрощено)|Розділ: поколіннєвий GC]] · [V8: Trash talk — the Orinoco garbage collector](https://v8.dev/blog/trash-talk) · [V8: Concurrent marking](https://v8.dev/blog/concurrent-marking)

> [!question]- Що таке `WeakRef` і `FinalizationRegistry` і чому з ними треба обережно?
> *іноді · теорія* · `js-08-015`
>
> `WeakRef` — слабке посилання на об'єкт: `ref.deref()` повертає об'єкт або `undefined`, якщо його вже зібрали. `FinalizationRegistry` дозволяє зареєструвати callback, який **може бути** викликаний після збирання об'єкта.
>
> ```js
> const cache = new Map();
> const registry = new FinalizationRegistry((key) => {
>   if (!cache.get(key)?.deref()) cache.delete(key);
> });
>
> function getImage(url, load) {
>   const cached = cache.get(url)?.deref();
>   if (cached) return cached;
>   const img = load(url);
>   cache.set(url, new WeakRef(img));
>   registry.register(img, url);
>   return img;
> }
> ```
>
> Caveats:
> - **немає гарантій часу і самого виклику**: callback може не спрацювати ніколи, зокрема при закритті вкладки чи виході процесу. Тому закриття файлів, з'єднань, комміт транзакцій на finalizers будувати не можна;
> - поведінка відрізняється між рушіями і навіть між запусками — тести на це флейкі;
> - об'єкт, отриманий з `deref()`, лишається живим до кінця поточного job'а, тож двічі поспіль `deref()` у синхронному коді дадуть узгоджений результат;
> - held value не повинен посилатися на сам об'єкт, інакше той ніколи не збереться;
> - у callback перевіряй, що в кеші не лежить уже новий `WeakRef` з тим самим ключем, як у прикладі.
>
> **На співбесіді:** специфікація прямо радить уникати цих API, якщо можливо. Легітимні сценарії — кеші великих ресурсів і діагностика («цей ресурс забули закрити явно»), завжди поряд із явним `close()`/`dispose()`.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#WeakMap, WeakSet, WeakRef, FinalizationRegistry|Розділ: WeakRef і FinalizationRegistry]] · [MDN: WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) · [V8: Weak references and finalizers](https://v8.dev/features/weak-references)

> [!question]- Як ти знаходиш витік пам'яті у фронтенді чи Node.js?
> *часто · практика* · `js-08-016`
>
> Спершу **підтверджую витік**, а не просто високе споживання: повторюю один сценарій N разів (відкрити й закрити модалку, перейти між роутами, прогнати запити) і дивлюсь, чи повертається heap до базового рівня після примусового GC.
>
> Далі — heap snapshots у Chrome DevTools (Memory), для Node — `node --inspect` або `v8.writeHeapSnapshot()`:
> 1. **Техніка трьох знімків:** warm-up, snapshot 1; сценарій кілька разів, snapshot 2; ще раз, snapshot 3. Об'єкти, створені між 1 і 2, що досі живі в 3, — кандидати.
> 2. **Comparison view:** сортую за `# Delta` і **Retained Size**, шукаю конструктори, кількість яких росте кратно кількості повторень.
> 3. Фільтр `Detached` у Chrome знаходить DOM-вузли, відірвані від документа.
> 4. **Retainers** — найважливіша панель: ланцюжок від об'єкта до кореня показує, хто саме тримає. Часто це `system / Context` (замикання), `(internal array)` слухачів або ключ у модульному `Map`.
>
> **Allocation instrumentation on timeline** показує алокації в часі: сині смуги, що не стали сірими, — те, що пережило GC. Allocation sampling дешевший і підходить для довгих запусків.
>
> У продакшн-Node корисні `--heapsnapshot-near-heap-limit=2` (знімок перед OOM) і метрики `heapUsed`. Для автоматизації браузерних сценаріїв є memlab від Meta.
>
> **На співбесіді:** Shallow size — пам'ять самого об'єкта, Retained size — скільки звільниться, якщо прибрати його; витік шукають за retained.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Профілювання: як знайти витік|Розділ: профілювання пам'яті]] · [Chrome DevTools: Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems) · [Chrome DevTools: Heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

> [!question]- Що показують `rss`, `heapTotal`, `heapUsed` і `external` у Node.js і як працює `--max-old-space-size`?
> *часто · практика* · `js-08-017`
>
> `process.memoryUsage()` повертає:
> - **rss** (resident set size) — уся пам'ять процесу в RAM: V8 heap, код, стеки потоків, нативні алокації, буфери libuv. Саме її бачить Kubernetes і OOM killer;
> - **heapTotal** — скільки пам'яті V8 зарезервував під heap;
> - **heapUsed** — скільки з цього зайнято об'єктами;
> - **external** — пам'ять C++-об'єктів, прив'язаних до JS, зокрема вміст `Buffer`;
> - **arrayBuffers** — частина `external`, що припадає на `ArrayBuffer` і `Buffer`.
>
> ```js
> const { rss, heapUsed, external } = process.memoryUsage();
> console.log((rss / 1024 ** 2).toFixed(1), 'MB');
> ```
>
> Діагностика за патерном:
> - росте `heapUsed` і не падає після GC — витік у JS-об'єктах, дивимося heap snapshot;
> - росте `rss`, а `heapUsed` стабільний — нативна пам'ять: буфери, стріми без backpressure, аддони, фрагментація malloc.
>
> `--max-old-space-size=<MB>` задає ліміт old generation. Дефолт залежить від версії Node і обсягу пам'яті системи, і не завжди відповідає ліміту контейнера. Якщо ліміт контейнера 1 GiB, а V8 вважає, що може рости далі, процес уб'є OOM killer без JS-стеку. Тому ставлять явно, з запасом на не-heap пам'ять: приблизно 70–80% від ліміту контейнера, наприклад `NODE_OPTIONS=--max-old-space-size=768`.
>
> **На співбесіді:** перевищення цього ліміту дає `FATAL ERROR: ... JavaScript heap out of memory`, а не виняток, який можна зловити.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Профілювання: як знайти витік|Розділ: профілювання пам'яті]] · [Node.js: process.memoryUsage()](https://nodejs.org/api/process.html#processmemoryusage) · [Node.js: Understanding and Tuning Memory](https://nodejs.org/learn/diagnostics/memory/understanding-and-tuning-memory)

> [!question]- Що таке hidden classes (shapes) та inline caches у V8 і як вони впливають на продуктивність?
> *іноді · теорія* · `js-08-018`
>
> V8 не зберігає кожен об'єкт як хеш-таблицю. Об'єкти з однаковим набором властивостей, доданих **в однаковому порядку**, ділять спільний **hidden class** (у V8 — Map, загальна назва — shape), який описує, за яким зміщенням лежить кожне поле. Додавання властивості переводить об'єкт на новий shape через ланцюжок переходів.
>
> **Inline cache** запам'ятовує в місці доступу `obj.x`, які shapes тут траплялись і за яким зміщенням лежить `x`:
> - **monomorphic** — один shape, найшвидший доступ;
> - **polymorphic** — кілька (до 4 у V8), перевірка списку;
> - **megamorphic** — більше, повільний загальний пошук, і оптимізуючий компілятор гірше генерує код.
>
> ```js
> class Point {
>   constructor(x, y) { this.x = x; this.y = y; }
> }
>
> const a = { x: 1 }; a.y = 2;
> const b = { y: 2 }; b.x = 1; // інший shape, ніж у a
> delete a.x;                   // a часто переходить у dictionary mode
> ```
>
> Практика:
> - ініціалізуй усі поля в конструкторі, в одному порядку, навіть як `null`;
> - не використовуй `delete` на гарячих об'єктах — краще `obj.x = undefined` або новий об'єкт;
> - не змішуй типи в масивах: V8 відстежує elements kinds (`PACKED_SMI` → `PACKED_DOUBLE` → `PACKED_ELEMENTS`, а «дірки» роблять масив `HOLEY`), і перехід назад неможливий.
>
> **На співбесіді:** це мікрооптимізації для гарячих шляхів (парсери, рендер-цикли, серіалізація), а не причина переписувати бізнес-код. Спочатку профайлер.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [V8: Hidden classes](https://v8.dev/docs/hidden-classes) · [Mathias Bynens: Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics)

> [!question]- Як передати великі бінарні дані між потоками без копіювання?
> *рідко · практика* · `js-08-019`
>
> За замовчуванням `postMessage` робить structured clone, тобто **копіює** дані. Для великих буферів це подвоює пам'ять і блокує потік на час копіювання. Є два способи уникнути цього.
>
> **Transferable objects** — передача володіння. `ArrayBuffer`, `MessagePort`, `ImageBitmap`, `OffscreenCanvas`, стріми можна перелічити в transfer list: пам'ять переходить до отримувача, а у відправника буфер стає **detached** (`byteLength === 0`, доступ через view кидає `TypeError`).
>
> ```js
> const buf = new ArrayBuffer(64 * 1024 * 1024);
> worker.postMessage({ buf }, [buf]);
> buf.byteLength; // 0
>
> const copy = structuredClone({ buf: other }, { transfer: [other] });
> ```
>
> **SharedArrayBuffer** — спільна пам'ять, яку обидва потоки бачать одночасно; синхронізація через `Atomics` (`Atomics.wait`/`notify`, атомарні операції). У браузері доступний лише на cross-origin isolated сторінках: потрібні заголовки `Cross-Origin-Opener-Policy: same-origin` і `Cross-Origin-Embedder-Policy: require-corp` (наслідок Spectre).
>
> Вибір:
> - одноразова передача результату (декодований файл, кадр) — transfer;
> - постійний обмін або спільний стан з низькою затримкою — SharedArrayBuffer, ціною складності синхронізації і data races;
> - дрібні повідомлення — звичайне клонування, оптимізувати нема чого.
>
> У Node те саме працює з `worker_threads`: `postMessage(value, transferList)`.
>
> 📚 [[JavaScript - 29. Workers і паралельність|Розділ: workers і паралельність]] · [MDN: Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) · [MDN: SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)

> [!question]- Чому замикання може утримувати великий об'єкт, який воно навіть не використовує?
> *іноді · код* · `js-08-020`
>
> У V8 усі замикання, створені в одній області видимості, **ділять один об'єкт Context** цієї області. У Context потрапляють усі змінні, які використовує **хоча б одне** внутрішнє замикання. Тому маленьке довгоживуче замикання тримає змінні, потрібні іншому замиканню, навіть якщо саме їх не читає.
>
> ```js
> function setup() {
>   const hugeReport = new Array(1e6).fill('row');
>   const title = 'Report';
>
>   const debug = () => console.log(hugeReport.length); // захоплює hugeReport
>   debug();
>
>   return () => title; // не використовує hugeReport, але ділить з debug Context
> }
>
> const getTitle = setup(); // hugeReport живе, поки живе getTitle
> ```
>
> Класичний патерн цього витоку (відомий з блогу Meteor) — ланцюжок, де кожне нове замикання через спільний Context тримає попереднє, і пам'ять росте лінійно.
>
> Як виправити:
> - обнулити велику змінну після використання: `hugeReport = null` (при `let`);
> - винести роботу з великими даними в окрему функцію, щоб вони не потрапили в Context зовнішньої області;
> - не повертати замикання з функцій, які обробляють великі дані.
>
> У heap snapshot такий випадок видно в retainers як `context in ()` / `system / Context`.
>
> **На співбесіді:** специфікація цього не вимагає — це деталь реалізації, але вона поводиться саме так у V8, тож для Chrome і Node актуальна.
>
> 📚 [[JavaScript - 05. Замикання#🗑️ Замикання і пам'ять|Розділ: замикання і пам'ять]] · [Vyacheslav Egorov: Grokking V8 closures](https://mrale.ph/blog/2012-09-23-grokking-v8-closures-for-fun.html) · [Chrome DevTools: Heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

## 🟣 Tech Lead

> [!question]- Як ти вибудовуєш memory budgets і моніторинг пам'яті для продукту?
> *рідко · практика* · `js-08-021`
>
> Пам'ять — такий самий бюджет, як розмір бандла чи LCP: без числа й алерту деградація непомітна, поки не прийдуть OOM-и або скарги на «вкладка гальмує через годину».
>
> **Бюджети:**
> - Node-сервіси: ліміт контейнера, `--max-old-space-size` під нього, цільовий `heapUsed` після GC у стабільному стані і допустимий приріст за добу;
> - фронтенд: heap після N повторень ключового сценарію має повертатися до базової лінії з допуском, наприклад ±10%; окремо — стеля для довгоживучих SPA-сесій.
>
> **Моніторинг у проді:**
> - Node: `process.memoryUsage()` і GC-метрики (`prom-client` дає їх з коробки, `perf_hooks` для пауз GC), алерти на тренд, а не лише на поріг; рестарти з причиною `OOMKilled` як окремий сигнал;
> - браузер: `performance.measureUserAgentSpecificMemory()` (лише Chromium і cross-origin isolated сторінки), сесійні семпли через RUM; нестандартний `performance.memory` — тільки як груба оцінка в Chrome.
>
> **Запобігання в CI:**
> - автоматизовані сценарії з memlab або Puppeteer: повторити дію, зняти heap, перевірити retained-об'єкти;
> - навантажувальні тести сервісів із графіком пам'яті, а не тільки RPS/latency.
>
> **Процес:** `--heapsnapshot-near-heap-limit` на проді, runbook «що робити при OOM», власник метрики в команді.
>
> **На співбесіді:** підкресли, що рестарт за розкладом — не рішення, а маскування витоку.
>
> 📚 [[JavaScript - 31. Продуктивність і V8|Розділ: продуктивність і V8]] · [MDN: measureUserAgentSpecificMemory()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory) · [Chrome DevTools: Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems)

> [!question]- Що ти перевіряєш на code review, щоб не пропустити витоки пам'яті?
> *рідко · практика* · `js-08-022`
>
> Мій чекліст ставить одне питання до кожного нового посилання: **хто його прибере і коли**.
>
> Підписки та ресурси:
> - кожен `addEventListener`, `subscribe`, `on()` має парне зняття або `signal` від `AbortController`, прив'язаний до життєвого циклу;
> - `setInterval`, `setTimeout` з повтором, `requestAnimationFrame`-цикл, `IntersectionObserver`/`ResizeObserver`/`MutationObserver` зупиняються в cleanup (`useEffect` return, `ngOnDestroy`, `disconnectedCallback`);
> - WebSocket, EventSource, стріми закриваються; у Node — `emitter.on` в обробнику запиту на довгоживучому emitter — червоний прапорець.
>
> Кеші та колекції:
> - будь-який `Map`/масив на рівні модуля чи singleton'а має ліміт (LRU, TTL) або використовує `WeakMap`, якщо ключ — об'єкт;
> - кеш не ключується даними користувача без обмеження кількості.
>
> Посилання:
> - DOM-вузли не зберігаються в довгоживучих структурах після видалення;
> - замикання, що передаються в глобальні реєстри, не захоплюють великих об'єктів;
> - проміси, що ніколи не завершуються, не тримають контекст запиту.
>
> Інструментально: ESLint-правила (`react-hooks/exhaustive-deps` допомагає опосередковано), попередження `MaxListenersExceededWarning` у Node як сигнал в логах, memlab-тест для критичних флоу.
>
> **На співбесіді:** чекліст корисний, але головне — культура: будь-яка довгоживуча структура в PR потребує відповіді «як вона обмежена».
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Типові витоки пам'яті|Розділ: витоки пам'яті]] · [MDN: addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) · [Chrome DevTools: Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems)

## Тести

> [!quiz] Що поверне `new Set([1, '1', 1, NaN, NaN, 0, -0]).size`?
> level: junior · id: js-08-quiz-01
> - [ ] `3`
> - [x] `4`
> - [ ] `5`
> - [ ] `6`
>
> **Пояснення:** `Set` використовує SameValueZero: `1` і `'1'` різні, `NaN` дорівнює `NaN`, а `0` і `-0` вважаються однаковими. Лишаються `1`, `'1'`, `NaN`, `0`.

> [!quiz] Чому `WeakMap` не має властивості `size` і методів ітерації?
> level: middle · id: js-08-quiz-02
> - [ ] Щоб зекономити пам'ять на лічильнику
> - [x] Бо набір записів залежить від того, коли спрацював GC, і результат був би недетермінованим
> - [ ] Бо ключі WeakMap зберігаються в heap іншого потоку
> - [ ] Це обмеження лише V8, в інших рушіях ітерація є
>
> **Пояснення:** Записи зникають, коли GC збирає ключ, а момент збирання непередбачуваний. Специфікація свідомо не дає спостерігати GC через `size` чи ітерацію.

> [!quiz] Оберіть усі правильні: що з цього може спричинити витік пам'яті у SPA?
> level: middle · type: multi · id: js-08-quiz-03
> - [x] Компонент додає слухача `resize` на `window` і не знімає його при unmount
> - [x] Модульний `Map` кешує відповіді API за URL без ліміту і TTL
> - [ ] Дані прив'язуються до DOM-вузлів через `WeakMap`, а вузли потім видаляються
> - [x] `setInterval`, запущений у компоненті, не очищується після його видалення
>
> **Пояснення:** Слухач, таймер і модульний кеш — довгоживучі корені, що тримають дані назавжди. `WeakMap` не утримує ключі, тож запис зникне разом із видаленим вузлом.

> [!quiz] Що виведе код?
> level: middle · type: output · id: js-08-quiz-04
>
> ```js
> const m = new Map([['a', 1], ['b', 2], ['c', 3]]);
> m.get('a');
> m.delete('b');
> m.set('b', 20);
> m.set('a', 10);
> console.log([...m.keys()].join(','));
> ```
>
> - [ ] `a,b,c`
> - [x] `a,c,b`
> - [ ] `c,b,a`
> - [ ] `c,a,b`
>
> **Пояснення:** `get` не змінює порядок. Видалення і повторна вставка `b` ставить його в кінець. `set` для існуючого ключа `a` лише оновлює значення, не переміщуючи його.

> [!quiz] Що виведе код?
> level: senior · type: output · id: js-08-quiz-05
>
> ```js
> const src = { at: new Date(0), m: new Map([[1, 2]]), f: undefined };
> src.self = src;
> const copy = structuredClone(src);
> console.log(copy.self === copy, copy.m instanceof Map, 'f' in copy);
> ```
>
> - [x] `true true true`
> - [ ] `true true false`
> - [ ] `false true true`
> - [ ] `DataCloneError`
>
> **Пояснення:** Structured clone зберігає циклічні посилання (тож `self` вказує на саму копію), підтримує `Map` і властивості зі значенням `undefined`. Відкидання `undefined` — поведінка `JSON.stringify`, а не `structuredClone`.

## Задачі

> [!task] Мемоізуй функцію від об'єкта через `WeakMap`
> level: middle · difficulty: easy · id: js-08-task-01 · tags: weakmap, memoization, memory
>
> Умова: напиши `memoizeByObject(fn)`, що приймає функцію одного аргументу-об'єкта і повертає мемоізовану версію. Результат для кожного об'єкта обчислюється один раз; кеш не повинен заважати GC зібрати об'єкт, коли на нього більше немає посилань. Для примітивного аргументу кинь `TypeError`. Врахуй, що `fn` може повернути `undefined` — це теж валідний закешований результат.
>
> ```js
> const total = memoizeByObject((order) => order.items.reduce((s, i) => s + i.price, 0));
> const order = { items: [{ price: 10 }, { price: 5 }] };
> total(order); // 15, обчислено
> total(order); // 15, з кешу
> ```
>
> > [!hint]- Підказка 1
> > Звичайний `Map` тримав би кожен order вічно. Яка колекція тримає ключі слабко?
>
> > [!hint]- Підказка 2
> > Для перевірки наявності використовуй `has`, а не `get(...) !== undefined`, інакше закешований `undefined` рахуватиметься промахом.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function memoizeByObject(fn) {
> >   const cache = new WeakMap();
> >   return function (obj) {
> >     if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
> >       throw new TypeError('Argument must be an object');
> >     }
> >     if (cache.has(obj)) return cache.get(obj);
> >     const result = fn.call(this, obj);
> >     cache.set(obj, result);
> >     return result;
> >   };
> > }
> > ```
> >
> > `WeakMap` не робить ключ досяжним, тому коли order більше ніде не використовується, GC збирає і його, і закешований результат. Перевірка через `has` коректно кешує `undefined`. Важливе обмеження: кеш не знає про мутації — якщо об'єкт змінили на місці, повернеться старий результат, тому підхід підходить для незмінних даних (наприклад, стану з Redux).

> [!task] Реалізуй LRU-кеш з TTL на `Map`
> level: senior · difficulty: medium · id: js-08-task-02 · tags: map, cache, lru
>
> Умова: реалізуй клас `LRUCache` з конструктором `new LRUCache({ max, ttl, now = Date.now })` і методами `get(key)`, `set(key, value)`, `has(key)`, `delete(key)` та геттером `size`. При перевищенні `max` витісняється найдавніше використаний запис. Запис, старший за `ttl` мілісекунд від останнього `set`, вважається відсутнім і видаляється при зверненні. `get` оновлює «свіжість» використання, але не продовжує TTL. Усі операції — O(1) в середньому. `now` потрібен, щоб тестувати без реального часу.
>
> ```js
> let t = 0;
> const cache = new LRUCache({ max: 2, ttl: 100, now: () => t });
> cache.set('a', 1); cache.set('b', 2);
> cache.get('a');       // 1, тепер 'b' найдавніший
> cache.set('c', 3);    // витісняє 'b'
> cache.has('b');       // false
> t = 150;
> cache.get('a');       // undefined — TTL минув
> ```
>
> > [!hint]- Підказка 1
> > `Map` зберігає порядок вставки. Як зробити запис «найсвіжішим» за O(1)?
>
> > [!hint]- Підказка 2
> > Зберігай у `Map` не саме значення, а `{ value, expiresAt }`.
>
> > [!hint]- Підказка 3
> > Найдавніший ключ — `this.#map.keys().next().value`. Прострочені записи перевіряй ліниво в `get` і `has`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > class LRUCache {
> >   #map = new Map();
> >   #max;
> >   #ttl;
> >   #now;
> >
> >   constructor({ max, ttl = Infinity, now = Date.now }) {
> >     if (!(max > 0)) throw new RangeError('max must be positive');
> >     this.#max = max;
> >     this.#ttl = ttl;
> >     this.#now = now;
> >   }
> >
> >   #live(key) {
> >     const entry = this.#map.get(key);
> >     if (!entry) return undefined;
> >     if (entry.expiresAt <= this.#now()) {
> >       this.#map.delete(key);
> >       return undefined;
> >     }
> >     return entry;
> >   }
> >
> >   get(key) {
> >     const entry = this.#live(key);
> >     if (!entry) return undefined;
> >     this.#map.delete(key);
> >     this.#map.set(key, entry);
> >     return entry.value;
> >   }
> >
> >   has(key) {
> >     return this.#live(key) !== undefined;
> >   }
> >
> >   set(key, value) {
> >     this.#map.delete(key);
> >     this.#map.set(key, { value, expiresAt: this.#now() + this.#ttl });
> >     if (this.#map.size > this.#max) {
> >       this.#map.delete(this.#map.keys().next().value);
> >     }
> >     return this;
> >   }
> >
> >   delete(key) {
> >     return this.#map.delete(key);
> >   }
> >
> >   get size() {
> >     return this.#map.size;
> >   }
> > }
> > ```
> >
> > `delete` + `set` переносить ключ у кінець порядку ітерації `Map`, тож перший ключ завжди найдавніше використаний, і витіснення — O(1). Значення загорнуто в об'єкт, тому `undefined` як значення не плутається з відсутністю. TTL перевіряється ліниво, тож `size` може включати прострочені, але ще не торкнуті записи; якщо це важливо, додають періодичне прибирання або обходять записи з початку, поки вони прострочені. `has` свідомо не оновлює порядок використання.

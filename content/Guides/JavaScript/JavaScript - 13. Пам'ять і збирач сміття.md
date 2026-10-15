---
title: Пам'ять і збирач сміття
order: 13
level: middle
tags: [memory, gc, v8, weakmap, performance, devtools]
prerequisites:
  - "[[JavaScript - 03. Значення та посилання]]"
  - "[[JavaScript - 05. Замикання]]"
estimatedMinutes: 45
id: jsd-ch-13
icon: "🗑️"
---

# JavaScript - 13. Пам'ять і збирач сміття

> [!success] 🎯 Після цього розділу ти зможеш
> - Чесно пояснити, що лежить «на стеку», а що «в heap», і де тут міф.
> - Визначити, чи досяжний об'єкт, і пояснити, чому цикли посилань не заважають GC.
> - Описати mark-and-sweep і поколіннєвий GC у V8 (Scavenger, Mark-Compact, Orinoco) на рівні співбесіди.
> - Знайти й виправити 5 типових витоків: глобальні змінні, таймери, listener-и, detached DOM, кеші й замикання.
> - Обрати між `Map`, `WeakMap`, `WeakRef` і `FinalizationRegistry` та знайти витік через heap snapshot у DevTools.

## 🤔 Передбач

> [!quiz] Чи збере GC об'єкт?
> level: junior · type: single · id: jsd-13-quiz-01
>
> ```js
> let user = { name: 'Ann' };
> const admins = [user];
> user = null;
> // чи може GC тепер звільнити { name: 'Ann' }?
> ```
>
> - [ ] Так, бо `user = null` видаляє об'єкт
> - [x] Ні, бо на нього досі посилається `admins[0]`
> - [ ] Так, але лише після виклику `delete admins[0]`
> - [ ] Ні, об'єкти з літералів живуть до кінця програми
>
> **Пояснення:** не переймайся, якщо помилився — розберемо нижче. `user = null` знищує лише **одне посилання**, а не об'єкт. Доки об'єкт досяжний з кореня (тут — через масив `admins`), GC його не чіпає.

## 🧒 Простими словами

Уяви **музей з повітряними кульками**. Кожна кулька (об'єкт) прив'язана ниточкою до чогось: до руки відвідувача (змінної), до іншої кульки або до гачка на стіні (глобальні об'єкти). Ввечері прибиральник починає з гачків і рук і йде по ниточках, позначаючи всі кульки, до яких можна дійти. Неприв'язані кульки, що злетіли під стелю, він знімає й викидає — навіть якщо дві з них зв'язані між собою. Витік пам'яті — це кулька, яку ти давно не використовуєш, але забув відв'язати від гачка.

## 🔬 Як це працює насправді

### Стек і heap — спрощено, але чесно

Популярна фраза «примітиви на стеку, об'єкти в heap» — **спрощення, яке часто неправдиве**. Точніше (на прикладі V8):

- **Стек** — кадри викликів: локальні змінні й тимчасові значення **поточних** функцій. Звільняється автоматично при `return`.
- **Heap** — усе, що може пережити виклик або має змінний розмір: об'єкти, масиви, функції, **рядки**, великі та дробові числа (HeapNumber), а також змінні, захоплені **замиканнями** (вони живуть в об'єкті Context у heap, а не в кадрі стека).
- Змінна — це **слот**. У ньому або саме значення (малі цілі — Smi, «small integer» — зберігаються прямо у слоті), або **вказівник** на heap.

Для мовної семантики важливо одне: при присвоєнні **копіюється вміст слота**. Для примітива це значення (а примітиви незмінні, тож різниці не видно), для об'єкта — посилання ([[JavaScript - 03. Значення та посилання]]).

> [!viz] memory-refs
> scenario: copy-primitive-vs-object

```js
let a = 'hi';
let b = a;      // копія значення (рядок незмінний — байти можуть бути спільні)
b += '!';
console.log(a); // → hi

const o1 = { n: 1 };
const o2 = o1;  // копія посилання
o2.n = 2;
console.log(o1.n); // → 2
```

> [!quiz] Перевір себе: де живе змінна?
> level: middle · id: jsd-13-quiz-02
>
> ```js
> function makeCounter() {
>   let count = 0;
>   return () => ++count;
> }
> const inc = makeCounter();
> ```
>
> Де зберігається `count` після повернення з `makeCounter`?
>
> - [ ] У кадрі стека `makeCounter` — він не знищується
> - [x] У heap, в об'єкті контексту, на який посилається замикання `inc`
> - [ ] Ніде — `count` копіюється в кожен виклик `inc`
>
> **Пояснення:** кадр стека зникає при `return`. Змінні, які захоплює замикання, рушій одразу розміщує в heap-об'єкті Context — саме тому вони живуть, доки живе функція `inc`.

### Досяжність: хто вирішує, що живе

Головне поняття GC — **reachability** (досяжність). Є набір **коренів** (roots):

- глобальний об'єкт (`globalThis`, `window`) і глобальні `let/const`;
- локальні змінні й аргументи функцій, які **зараз** на стеку;
- посилання від хоста: активні таймери та їхні callback-и, listener-и подій на живих DOM-вузлах, DOM-дерево документа, callback-и, що вже стоять у чергах задач і microtasks.

Об'єкт **живий**, якщо до нього є шлях посилань від хоча б одного кореня. Усе інше — сміття, навіть якщо на нього посилаються інші недосяжні об'єкти. Тому **цикли не є проблемою**: два об'єкти, що посилаються один на одного, але недосяжні з коренів, будуть зібрані. (Старі IE з reference counting для DOM-об'єктів на циклах саме текли.)

> [!viz] gc
> scenario: reachability

```js
function makePair() {
  const a = {};
  const b = { a };
  a.b = b;        // цикл a ↔ b
  return 'done';
}
makePair();       // після виходу пару недосяжно — її зберуть
```

> [!quiz] Перевір себе: що досяжне?
> level: middle · type: multi · id: jsd-13-quiz-03
>
> Що з цього може зібрати GC?
>
> - [x] Два об'єкти, що посилаються один на одного, коли жодна змінна на них не вказує
> - [ ] Об'єкт, на який посилається callback активного `setInterval`
> - [x] Об'єкт, створений локально у функції, що вже повернулась і нікому його не віддала
> - [ ] Об'єкт у глобальному масиві `window.cache`
>
> **Пояснення:** вирішує лише досяжність з коренів. Активний таймер — корінь через хост, глобальна змінна — корінь, а цикл без зовнішніх посилань — сміття.

### Mark-and-sweep (і compact)

Класичний алгоритм трасувального GC:

1. **Mark** — обійти граф від коренів і позначити кожен досяжний об'єкт.
2. **Sweep** — пройтися heap-ом і звільнити пам'ять непозначених.
3. **Compact** (опційно) — пересунути живі об'єкти щільно, щоб боротися з фрагментацією; вказівники при цьому оновлюються.

Наслідки для розробника: ти **не можеш** звільнити об'єкт явно — лише зробити його недосяжним; момент збирання недетермінований; `delete obj.prop` прибирає властивість, а не пам'ять негайно.

> [!quiz] Перевір себе: mark-and-sweep
> level: middle · id: jsd-13-quiz-04
>
> Що робить фаза **mark**?
>
> - [ ] Позначає об'єкти, на які ніхто не посилається
> - [x] Позначає всі об'єкти, досяжні від коренів
> - [ ] Рахує кількість посилань на кожен об'єкт
> - [ ] Переносить живі об'єкти в старе покоління
>
> **Пояснення:** трасувальний GC шукає живих, а не мертвих: усе, що не позначено, — сміття. Підрахунок посилань — інший підхід (reference counting), який не впорається з циклами.

### Поколіннєвий GC у V8 (спрощено)

**Generational hypothesis**: більшість об'єктів помирають молодими (тимчасові масиви, проміжні результати `map`, об'єкти подій). Тому V8 ділить heap на покоління:

| Покоління | Алгоритм | Характер |
|---|---|---|
| **Young** (nursery) | **Scavenger** — копіює вцілілих з одного напівпростору в інший; мертві «зникають» безкоштовно | часто, швидко (minor GC) |
| **Old** | **Mark-Compact** (mark → sweep → compact) | рідше, дорожче (major GC) |

Об'єкт, що пережив два scavenge-и, **переїжджає** (promotion) у старе покоління. Щоб старі об'єкти, які посилаються на молоді, не треба було сканувати щоразу, V8 веде *remembered set* через **write barrier** — маленьку перевірку при кожному записі вказівника.

**Orinoco** — назва проєкту, що зробив GC V8 майже непомітним:

- **parallel** — кілька потоків роблять одну фазу одночасно (головний потік чекає менше);
- **incremental** — маркування дрібними кроками між шматками JS;
- **concurrent** — маркування та sweep у фонових потоках, **поки JS виконується**.

Повністю без пауз (stop-the-world) не обійтись, але вони стали мілісекундними, і V8 намагається ховати їх у idle-час між кадрами.

> [!quiz] Перевір себе: покоління
> level: senior · type: multi · id: jsd-13-quiz-05
>
> - [x] Scavenger обробляє молоде покоління, копіюючи живі об'єкти
> - [ ] Major GC (Mark-Compact) запускається після кожної функції
> - [x] Об'єкт, що пережив кілька minor GC, переноситься в старе покоління
> - [x] Concurrent marking виконується у фонових потоках паралельно з JS
>
> **Пояснення:** вартість scavenge пропорційна кількості **живих** об'єктів, а не мертвих — тому короткоживучі об'єкти майже безкоштовні. Major GC рідкісний і значною мірою виконується конкурентно.

### Типові витоки пам'яті

Витік у мові з GC — це об'єкт, який **більше не потрібен, але досі досяжний**. П'ять класичних джерел:

1. **Глобальні змінні** — випадкові (присвоєння без оголошення в sloppy mode) або «тимчасові» `window.debugData`.
2. **Забуті таймери** — `setInterval` тримає свій callback, а той — усе, що замкнув.
3. **Listener-и** на довгоживучих об'єктах (`window`, `document`, глобальна шина подій), не зняті при знищенні компонента.
4. **Detached DOM** — вузол видалено з документа, але на нього (чи на його нащадка) ще посилається JS — тримається все піддерево.
5. **Кеші та замикання** — `Map` без обмеження розміру; замикання, що випадково тримає великий об'єкт.

> [!viz] gc
> scenario: leak-closure

```js
// ❌ компонент «знищено», але пам'ять тримається
function mountWidget(el) {
  const bigData = new Array(1e6).fill('*');
  const onResize = () => el.textContent = bigData.length;
  window.addEventListener('resize', onResize);
  const timer = setInterval(() => console.log(bigData[0]), 1000);
  // немає cleanup → window тримає onResize → bigData і el живуть вічно
}

// ✅ повертаємо функцію прибирання
function mountWidgetSafe(el) {
  const bigData = new Array(1e6).fill('*');
  const controller = new AbortController();
  window.addEventListener('resize', () => (el.textContent = bigData.length), { signal: controller.signal });
  const timer = setInterval(() => console.log(bigData[0]), 1000);
  return () => {
    controller.abort();     // знімає всі listener-и з цим signal
    clearInterval(timer);
  };
}
```

> [!quiz] Перевір себе: що тече?
> level: middle · type: multi · id: jsd-13-quiz-06
>
> Компонент видалено з DOM. Що з цього **триматиме** його пам'ять?
>
> - [x] `setInterval`, у callback-у якого використовується стан компонента, і ніхто не викликав `clearInterval`
> - [x] `window.addEventListener('scroll', handler)` без `removeEventListener`
> - [ ] `button.addEventListener('click', handler)` на кнопці всередині видаленого компонента, якщо на кнопку більше ніхто не посилається
> - [x] Глобальний `Map`, куди компонент поклав себе як значення
>
> **Пояснення:** listener на вузлі, який сам став недосяжним, зберуть разом з вузлом. А `window`, активний таймер і глобальний `Map` — корені або досяжні з коренів, тож тримають усе, що в них замкнено.

> [!quiz] Перевір себе: заповни пропуски у функції прибирання
> level: middle · type: fill · id: jsd-13-quiz-09 · bank: clearTimeout, removeEventListener, once
>
> ```js fill
> function mount(el) {
>   const controller = new [[AbortController]]()
>   window.addEventListener('resize', onResize, { [[signal]]: controller.signal })
>   document.addEventListener('keydown', onKey, { signal: controller.signal })
>   const timer = setInterval(poll, 1000)
>
>   return function destroy() {
>     controller.[[abort]]()   // знімає обидва listener-и
>     [[clearInterval]](timer)
>   }
> }
> ```
>
> **Пояснення:** один `AbortController` на компонент — і всі listener-и, зареєстровані з його `signal`, знімаються одним `abort()`, без збереження посилань на кожен обробник. Таймер прибирається окремо: `setInterval` — через `clearInterval`, інакше його callback (і все, що він замкнув) житиме вічно.

### `WeakMap`, `WeakSet`, `WeakRef`, `FinalizationRegistry`

**Слабке посилання** не робить об'єкт досяжним: якщо інших посилань немає, GC його збере.

- **`WeakMap`** — ключі (об'єкти або нереєстровані символи) тримаються слабко; запис зникає разом із ключем. Немає `size`, ітерації, `clear` — бо вміст залежить від недетермінованого GC. Ідеально для **метаданих до чужих об'єктів**: кеш обчислень для DOM-вузла, приватні дані.
- **`WeakSet`** — «позначки» на об'єктах («вже оброблено», «вже бачили» при обході циклічних графів).
- **`WeakRef`** — слабке посилання на значення; `ref.deref()` повертає об'єкт або `undefined`, якщо його вже зібрали.
- **`FinalizationRegistry`** — callback **колись після** того, як об'єкт зібрали. Не гарантовано, коли і чи взагалі (наприклад, при закритті вкладки).

```js
const meta = new WeakMap();
function track(node) {
  meta.set(node, { clicks: 0 }); // зникне разом з вузлом
}

const wm = new WeakMap();
wm.set('id', 1); // ❌ TypeError: Invalid value used as weak map key
```

`WeakRef` і `FinalizationRegistry` — інструменти останньої надії: документація TC39 прямо радить уникати їх, якщо можна, бо поведінка GC різниться між рушіями й версіями.

> [!quiz] Перевір себе: WeakMap
> level: middle · type: multi · id: jsd-13-quiz-07
>
> - [x] `new WeakMap().size` — `undefined`
> - [ ] Ключем `WeakMap` може бути рядок
> - [x] Запис у `WeakMap` не заважає GC зібрати об'єкт-ключ
> - [ ] `WeakMap` можна обійти `for…of`, щоб знайти всі живі ключі
> - [x] `WeakRef.prototype.deref()` може повернути `undefined`
>
> **Пояснення:** вміст weak-колекцій залежить від GC, тож мова свідомо не дає ні розміру, ні ітерації. Ключі — лише об'єкти й нереєстровані символи, бо примітив «зібрати» неможливо.

> [!quiz] Перевір себе: склади кеш метаданих, який не тримає чужі об'єкти в пам'яті
> level: middle · type: order · id: jsd-13-quiz-10
>
> ```js order
> const cache = new WeakMap()
> function getMeta(obj) {
>   if (!cache.has(obj)) {
>     cache.set(obj, computeMeta(obj))
>   }
>   return cache.get(obj)
> }
> const cache = new Map() // ✗
> ```
>
> **Пояснення:** `WeakMap` тримає ключ слабко: коли на `obj` не лишиться інших посилань, GC збере і його, і запис у кеші. Звичайний `Map` зробив би кожен оброблений об'єкт досяжним назавжди — класичний витік через кеш.

### Профілювання: як знайти витік

**Chrome DevTools → Memory**:

- **Heap snapshot** — знімок усіх об'єктів. Колонки: *Shallow size* (пам'ять самого об'єкта) і *Retained size* (скільки звільниться, якщо зібрати його разом з усім, що тримається **лише** через нього). Панель **Retainers** показує ланцюжок посилань від кореня — «хто тримає».
- **Техніка трьох знімків**: знімок → дія (відкрити/закрити модалку) → знімок → повторити дію → знімок. Порівняння (*Comparison*) показує об'єкти, що лише ростуть. Фільтр `Detached` знаходить відірвані DOM-вузли.
- **Allocation instrumentation on timeline** — сині стовпчики, що лишаються після GC, = пережиті алокації.
- **Performance monitor** — графік JS heap і кількості DOM-вузлів: «пилка» нормальна, ріст «сходинками» без повернення — витік.

У Node: `node --inspect` + ті самі DevTools, `process.memoryUsage()`, `--heapsnapshot-signal=SIGUSR2`, `v8.writeHeapSnapshot()`.

> [!figure] devtools-memory
> scenario: detached-dom
>
> Техніка знімків у дії: фільтр «Detached» знаходить модалку, яку прибрали зі сторінки, а дерево Retainers показує, що її тримає замикання забутого слухача на `window`.

> [!quiz] Перевір себе: retained size
> level: senior · id: jsd-13-quiz-08
>
> Що означає **retained size** об'єкта в heap snapshot?
>
> - [ ] Розмір самого об'єкта без вкладених
> - [x] Скільки пам'яті звільниться, якщо цей об'єкт стане недосяжним (разом з усім, що тримається лише через нього)
> - [ ] Сумарний розмір усіх об'єктів, на які він посилається
> - [ ] Пам'ять, яку об'єкт займав у момент створення
>
> **Пояснення:** retained size рахує домінатор-дерево: лише об'єкти, до яких **немає** іншого шляху від коренів. Об'єкт, на який посилаються ще звідкись, у retained size не входить.

## ⚠️ Пастки

> [!pitfall] Замикання ділять один контекст
> V8 створює **один** Context на область видимості, і всі замикання, створені в ній, посилаються на нього. Якщо хоча б одна функція використовує `bigData`, вона опиниться в контексті — і її триматиме **будь-яка** функція з цієї області, навіть та, що `bigData` не згадує (деталь реалізації V8).
>
> ```js
> function setup() {
>   const bigData = new Array(1e6).fill('*');
>   const unused = () => bigData.length;     // захоплює bigData у спільний контекст
>   return () => 'I only say hi';            // але тримає той самий контекст!
> }
> const hi = setup(); // bigData живе, доки живе hi
> ```

> [!pitfall] Кеш без межі — це витік з гарною назвою
> `Map` тримає ключі й значення сильно. Кеш за ідентифікатором запиту, що лише росте, — повільний витік, який проявиться через години роботи вкладки чи сервера.
>
> ```js
> const cache = new Map();
> function getReport(id) {
>   if (!cache.has(id)) cache.set(id, buildReport(id)); // ❌ ніколи не чиститься
>   return cache.get(id);
> }
> ```
>
> Рішення: LRU з лімітом, TTL або `WeakMap`, якщо ключ — об'єкт із власним життєвим циклом.

> [!pitfall] Detached DOM через «збережене» посилання
> Видалений вузол живе, доки на нього посилається JS — і з ним усе піддерево та listener-и.
>
> ```js
> const rows = [];
> function addRow() {
>   const tr = document.createElement('tr');
>   table.append(tr);
>   rows.push(tr);              // ❌ масив пережив очищення таблиці
> }
> table.replaceChildren();      // вузли detached, але rows їх тримає
> ```

> [!pitfall] `console.log` об'єкта тримає його в пам'яті
> Поки DevTools відкриті, залоговані об'єкти досяжні з консолі — це заважає профілюванню й «створює» витоки, яких у продакшні немає. Перед heap snapshot очисти консоль.

## 🎤 На співбесіді

> [!interview] Як працює збирач сміття в JavaScript?
> level: middle · frequency: дуже часто · id: jsd-13-int-01
>
> ---
>
> Автоматичний трасувальний GC за принципом досяжності: від коренів (глобальні об'єкти, стек, посилання хоста — таймери, listener-и, DOM) рушій позначає все досяжне (mark), решту звільняє (sweep) і за потреби ущільнює (compact). Цикли не проблема. У V8 GC поколіннєвий: молоде покоління чистить Scavenger копіюванням (часто й дешево), старе — Mark-Compact. Проєкт Orinoco зробив його паралельним, інкрементальним і конкурентним, тому паузи короткі. Явно звільнити пам'ять не можна — лише зробити об'єкт недосяжним.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Mark-and-sweep (і compact)|Розділ: mark-and-sweep]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [javascript.info: Garbage collection](https://javascript.info/garbage-collection)

> [!interview] Як знайти й виправити витік пам'яті у фронтенді?
> level: senior · frequency: часто · id: jsd-13-int-02
>
> ---
>
> Підтвердити: Performance monitor — heap і DOM-вузли ростуть сходинками й не падають після GC. Локалізувати: три heap snapshot-и навколо повторюваної дії, Comparison і фільтр `Detached`, далі Retainers — ланцюжок від кореня до об'єкта. Типові причини: не зняті listener-и на `window`/`document`, таймери, підписки (WebSocket, store), detached DOM у масивах, кеші без межі, замикання, що тримають великі дані. Фікс — cleanup у `useEffect`/`onDestroy`, `AbortController` для listener-ів, `WeakMap` для метаданих, LRU для кешів.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Профілювання: як знайти витік|Розділ: профілювання пам'яті]] · [Chrome DevTools: Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems) · [Chrome DevTools: Heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

> [!interview] Чим `WeakMap` відрізняється від `Map`?
> level: middle · frequency: часто · id: jsd-13-int-03
>
> ---
>
> `WeakMap` тримає ключі слабко: якщо на об'єкт-ключ немає інших посилань, GC збере і його, і запис. Ключі — лише об'єкти або нереєстровані символи. Немає `size`, ітерації й `clear` — вміст залежить від недетермінованого GC. Застосування: метадані до чужих об'єктів (DOM-вузлів), приватні дані екземплярів, мемоізація за об'єктом-аргументом. `Map` — звичайна колекція з сильними посиланнями, ітерацією та порядком вставки.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#WeakMap, WeakSet, WeakRef, FinalizationRegistry|Розділ: слабкі посилання]] · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [javascript.info: WeakMap and WeakSet](https://javascript.info/weakmap-weakset)

## 🔗 Зв'язки

- [[JavaScript - 03. Значення та посилання]] — копіювання посилань — це саме те, що робить об'єкти досяжними з кількох місць.
- [[JavaScript - 05. Замикання]] — замикання живуть у heap-контекстах і найчастіше «непомітно» тримають пам'ять.
- [[JavaScript - 08. Event Loop]] — активні таймери й listener-и — корені GC з боку хоста.
- [[JavaScript - 14. Debounce, throttle та async-патерни]] — `AbortController` і cleanup таймерів — головні ліки від витоків в async-коді.

## ⚡ Фішки

> [!reel] 🔁 Цикл посилань — не витік
> Два об'єкти, що посилаються один на одного, зберуть, якщо до них немає шляху від коренів. Трасувальний GC шукає досяжних, а не рахує посилання.

> [!reel] 👶 Більшість об'єктів помирають молодими
> На цьому тримається поколіннєвий GC V8: Scavenger копіює лише вцілілих, тож тимчасові об'єкти з `map`/`filter` майже нічого не коштують для збирання.

> [!reel] 🙈 WeakMap не має size — і це не баг
> Вміст `WeakMap` змінюється, коли GC забажає. Якби був `size` чи ітерація, програма могла б «підглянути» за GC, і код поводився б по-різному в різних рушіях.

> [!reel] 🪝 Одне замикання тримає дані за всіх
> У V8 замикання з однієї області ділять один контекст. Якщо одна функція згадує `bigData`, його триматиме навіть сусідня функція, яка про нього не знає.

> [!reel] 🧪 Три знімки — і витік спійманий
> Heap snapshot → дія → snapshot → та сама дія → snapshot. Об'єкти, що з'явились між 1 і 2 і досі живі в 3, — твої підозрювані. Фільтр `Detached` знайде відірвані DOM-вузли.

## 🧠 Закріплення

### 🟢 Junior

> [!question]- Коли об'єкт стає сміттям?
> *дуже часто · теорія* · `jsd-13-001`
>
> Коли до нього немає шляху посилань від жодного кореня (глобальні об'єкти, поточний стек, посилання хоста). Присвоєння `null` змінній прибирає лише одне посилання.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Досяжність: хто вирішує, що живе|Розділ: досяжність]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [javascript.info: Garbage collection](https://javascript.info/garbage-collection)

> [!question]- Чи можна вручну звільнити пам'ять об'єкта в JS?
> *часто · теорія* · `jsd-13-002`
>
> Ні. Можна лише зробити об'єкт недосяжним (обнулити посилання, видалити з колекцій, зняти listener-и). Коли саме GC його збере — вирішує рушій. `delete` видаляє властивість, а не звільняє пам'ять негайно.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Досяжність: хто вирішує, що живе|Розділ: досяжність]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [V8: Trash talk — the Orinoco garbage collector](https://v8.dev/blog/trash-talk)

> [!question]- Чи заважають цикли посилань збиранню сміття?
> *часто · теорія* · `jsd-13-003`
>
> Ні. Mark-and-sweep обходить граф від коренів; недосяжний цикл просто не буде позначений і звільниться. Проблема циклів властива reference counting.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Mark-and-sweep (і compact)|Розділ: mark-and-sweep]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [javascript.info: Garbage collection](https://javascript.info/garbage-collection)

### 🟡 Middle

> [!question]- Назви типові причини витоків пам'яті у фронтенді.
> *дуже часто · практика* · `jsd-13-004`
>
> Випадкові глобальні змінні; `setInterval`/`setTimeout` без очищення; listener-и на `window`/`document`/шині подій без зняття; detached DOM, на який посилається JS; кеші без межі; замикання, що тримають великі дані; незакриті підписки (WebSocket, store).
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Типові витоки пам'яті|Розділ: витоки пам'яті]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [Chrome DevTools: Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems)

> [!question]- Чим «примітиви на стеку, об'єкти в heap» неточне?
> *іноді · теорія* · `jsd-13-005`
>
> Рядки й HeapNumber — heap-об'єкти; змінні, захоплені замиканнями, живуть у heap-контексті, а не на стеку. На стеку — кадри поточних викликів зі слотами, де лежать або малі цілі (Smi), або вказівники. Для семантики важливо лише: присвоєння копіює вміст слота.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Стек і heap — спрощено, але чесно|Розділ: стек і heap]] · [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [V8: Trash talk — the Orinoco garbage collector](https://v8.dev/blog/trash-talk)

> [!question]- Коли використати `WeakMap` замість `Map`?
> *часто · порівняння* · `jsd-13-006`
>
> Коли ключ — об'єкт із власним життєвим циклом (DOM-вузол, екземпляр), а дані — лише «прив'язка» до нього: метадані, кеш обчислень, приватні поля. Запис зникне разом з ключем. Якщо потрібні ітерація, `size` або примітивні ключі — `Map` (з явним очищенням).
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#WeakMap, WeakSet, WeakRef, FinalizationRegistry|Розділ: WeakMap]] · [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [MDN: Keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections)

> [!question]- Чим shallow size відрізняється від retained size?
> *іноді · теорія* · `jsd-13-007`
>
> Shallow — пам'ять самого об'єкта. Retained — скільки звільниться, якщо об'єкт стане недосяжним: він плюс усе, до чого немає інших шляхів від коренів. Шукаючи витік, сортуй за retained.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Профілювання: як знайти витік|Розділ: профілювання пам'яті]] · [Chrome DevTools: Memory terminology](https://developer.chrome.com/docs/devtools/memory-problems/get-started) · [Chrome DevTools: Heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

### 🔴 Senior

> [!question]- Як влаштований поколіннєвий GC у V8?
> *часто · теорія* · `jsd-13-008`
>
> Heap ділиться на young і old. Young чистить Scavenger: копіює живих між напівпросторами, вартість ∝ кількості живих. Об'єкти, що пережили два scavenge-и, просуваються в old, який збирає Mark-Compact. Посилання old → young відстежують write barriers і remembered set. Orinoco робить маркування конкурентним і інкрементальним, а фази — паралельними.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#Поколіннєвий GC у V8 (спрощено)|Розділ: поколіннєвий GC]] · [V8: Trash talk — the Orinoco garbage collector](https://v8.dev/blog/trash-talk) · [V8: Concurrent marking](https://v8.dev/blog/concurrent-marking)

> [!question]- Чому `FinalizationRegistry` не можна використовувати для звільнення критичних ресурсів?
> *рідко · теорія* · `jsd-13-009`
>
> Специфікація не гарантує, коли викличеться callback і чи викличеться взагалі (наприклад, при закритті сторінки чи завершенні процесу). Файли, з'єднання, локи треба закривати детерміновано: `try/finally`, `using` (Explicit Resource Management), явний `close()`.
>
> 📚 [[JavaScript - 13. Пам'ять і збирач сміття#WeakMap, WeakSet, WeakRef, FinalizationRegistry|Розділ: FinalizationRegistry]] · [MDN: FinalizationRegistry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry) · [V8: Weak references and finalizers](https://v8.dev/features/weak-references)

## 🛠️ Практика

> [!task] Поясни своїми словами: досяжність
> level: junior · difficulty: easy · id: jsd-13-task-01 · tags: feynman, gc
>
> Поясни, чому в JS немає `free()`, і чому після `node.remove()` DOM-вузол може не звільнитися. Згадай корені, досяжність і хоча б одну аналогію. До 5 речень.
>
> > [!hint]- Підказка 1
> > Що GC перевіряє, вирішуючи, чи звільняти об'єкт? Що для цього змінює `remove()`?
>
> > [!hint]- Підказка 2
> > Хто ще, окрім документа, може тримати посилання на вузол?
>
> > [!solution]- Еталонне пояснення
> > GC звільняє не те, що ти «видалив», а те, до чого більше не можна дістатися: він стартує з коренів — глобальних об'єктів, стека, таймерів і listener-ів — і йде по посиланнях, як прибиральник по ниточках кульок. Тому `free()` не потрібен і навіть небезпечний: ти міг би звільнити об'єкт, на який ще хтось посилається. `node.remove()` лише перерізає ниточку від документа. Якщо вузол досі лежить у масиві, у змінній замикання чи в кеші — до нього є інший шлях, і він залишиться в пам'яті разом з усім піддеревом як detached DOM.

> [!task] Знайди й виправ витоки
> level: middle · difficulty: medium · id: jsd-13-task-02 · tags: memory, leaks
>
> Компонент живого пошуку створюється й знищується при кожному відкритті модалки. Знайди всі витоки (їх чотири) і перепиши з функцією `destroy()`.
>
> ```js
> const cache = new Map();
> function createSearch(root) {
>   const input = root.querySelector('input');
>   const results = [];
>   input.addEventListener('input', onInput);
>   window.addEventListener('keydown', onKey);
>   setInterval(refresh, 5000);
>   function onInput(e) { cache.set(e.target.value, results.slice()); }
>   function onKey(e) { if (e.key === 'Escape') root.remove(); }
>   function refresh() { results.push(...fetchLatest()); }
> }
> ```
>
> Щоб рішення можна було перевірити тестами без браузера, залежності передаються явно: `input` і `win` — будь-які `EventTarget`, `fetchLatest()` повертає масив нових результатів, `onClose()` викликається замість `root.remove()`. Поверни `{ destroy, stats }`, де `stats()` → `{ cache, results }` — поточні розміри кешу й списку. Обмеж кеш `maxCache` записами (найстаріший — геть), а `results` — останніми 100.
>
> ```js starter
> const cache = new Map();
> function createSearch({ input, win, fetchLatest, onClose }, { maxCache = 50 } = {}) {
>   const results = [];
>   input.addEventListener('input', onInput);
>   win.addEventListener('keydown', onKey);
>   setInterval(refresh, 5000);
>   function onInput(e) { cache.set(e.target.value, results.slice()); }
>   function onKey(e) { if (e.key === 'Escape') onClose(); }
>   function refresh() { results.push(...fetchLatest()); }
>   // твій код: прибери витоки й поверни { destroy, stats }
> }
> ```
>
> ```js tests
> function setup(options) {
>   const input = new EventTarget()
>   const win = new EventTarget()
>   const deps = { input, win, fetchLatest: vi.fn(() => [1, 2, 3]), onClose: vi.fn() }
>   const type = (value) => { input.value = value; input.dispatchEvent(new Event('input')) }
>   const press = (key) => win.dispatchEvent(Object.assign(new Event('keydown'), { key }))
>   return { deps, type, press, search: createSearch(deps, options) }
> }
>
> test('кеш наповнюється при вводі, але не більше maxCache записів', () => {
>   vi.useFakeTimers()
>   const { search, type } = setup({ maxCache: 3 })
>   type('a'); type('ab'); type('abc'); type('abcd'); type('abcde')
>   expect(search.stats().cache).toBe(3)
> })
>
> test('кожен компонент має власний кеш', () => {
>   vi.useFakeTimers()
>   const first = setup()
>   const second = setup()
>   first.type('a')
>   expect(second.search.stats().cache).toBe(0)
> })
>
> test('results оновлюються таймером і не ростуть понад 100', () => {
>   vi.useFakeTimers()
>   const { search, deps } = setup()
>   vi.advanceTimersByTime(5000)
>   expect(deps.fetchLatest).toHaveBeenCalledTimes(1)
>   expect(search.stats().results).toBe(3)
>   vi.advanceTimersByTime(5000 * 50)
>   expect(search.stats().results).toBe(100)
> })
>
> test('destroy зупиняє таймер і знімає всі listener-и', () => {
>   vi.useFakeTimers()
>   const { search, deps, type, press } = setup()
>   search.destroy()
>   expect(vi.getTimerCount()).toBe(0)
>   vi.advanceTimersByTime(20000)
>   expect(deps.fetchLatest).not.toHaveBeenCalled()
>   type('a')
>   expect(search.stats().cache).toBe(0)
>   press('Escape')
>   expect(deps.onClose).toHaveBeenCalledTimes(1)
> })
>
> test('Escape знищує компонент', () => {
>   vi.useFakeTimers()
>   const { deps, press } = setup()
>   press('Enter')
>   expect(deps.onClose).not.toHaveBeenCalled()
>   press('Escape')
>   expect(deps.onClose).toHaveBeenCalledTimes(1)
>   expect(vi.getTimerCount()).toBe(0)
> })
> ```
>
> > [!hint]- Підказка 1
> > Подивись на все, що реєструється на **довгоживучих** об'єктах: `window`, таймери, модульні змінні.
>
> > [!hint]- Підказка 2
> > `results` росте нескінченно, а `cache` — глобальний і без межі.
>
> > [!solution]- Еталонне рішення
> > Витоки: (1) listener на `window` — тримає `onKey` → `root`; (2) `setInterval` ніколи не очищується — тримає `refresh` → `results`; (3) глобальний `cache` без межі; (4) `results` росте без обмеження. Listener на `input` сам по собі не тече — він помре разом з вузлом.
> >
> > ```js
> > function createSearch({ input, win, fetchLatest, onClose }, { maxCache = 50 } = {}) {
> >   const cache = new Map();             // локальний, помре з компонентом
> >   let results = [];
> >   const controller = new AbortController();
> >   const { signal } = controller;
> >
> >   input.addEventListener('input', (e) => {
> >     cache.set(e.target.value, results.slice(-100));
> >     if (cache.size > maxCache) cache.delete(cache.keys().next().value); // найстаріший
> >   }, { signal });
> >   win.addEventListener('keydown', (e) => {   // у браузері win — це window
> >     if (e.key === 'Escape') destroy();
> >   }, { signal });
> >   const timer = setInterval(() => {
> >     results = [...results, ...fetchLatest()].slice(-100);
> >   }, 5000);
> >
> >   function destroy() {
> >     controller.abort();
> >     clearInterval(timer);
> >     cache.clear();
> >     onClose();                             // у браузері — root.remove()
> >   }
> >   return { destroy, stats: () => ({ cache: cache.size, results: results.length }) };
> > }
> > ```

> [!task] Кеш на `WeakRef` з самоочищенням
> level: senior · difficulty: hard · id: jsd-13-task-03 · tags: weakref, gc, caching
>
> Реалізуй `createWeakCache(compute)`: `get(key)` (ключ — рядок) повертає закешований об'єкт, якщо його ще не зібрав GC, інакше обчислює заново. Значення тримаються **слабко**, а записи `Map` для зібраних значень мають прибиратися автоматично через `FinalizationRegistry`. Додай геттер `size`.
>
> Тести не можуть примусово запустити GC, тож вони перевіряють кешування й API; слабкість посилань перевір сам у Node з `--expose-gc` (див. пояснення в рішенні).
>
> ```js starter
> function createWeakCache(compute) {
>   // твій код
>   return {
>     get(key) {},
>     get size() { return 0 },
>   }
> }
> ```
>
> ```js tests
> test('повертає той самий обʼєкт і не обчислює повторно', () => {
>   const compute = vi.fn((key) => ({ key }))
>   const cache = createWeakCache(compute)
>   const a1 = cache.get('a')
>   const a2 = cache.get('a')
>   expect(a1).toEqual({ key: 'a' })
>   expect(a2).toBe(a1)
>   expect(compute).toHaveBeenCalledTimes(1)
> })
>
> test('різні ключі обчислюються окремо', () => {
>   const compute = vi.fn((key) => ({ key }))
>   const cache = createWeakCache(compute)
>   expect(cache.get('a')).not.toBe(cache.get('b'))
>   expect(compute).toHaveBeenCalledTimes(2)
>   expect(compute).toHaveBeenCalledWith('b')
> })
>
> test('size рахує живі записи', () => {
>   const cache = createWeakCache((key) => ({ key }))
>   expect(cache.size).toBe(0)
>   const keep = [cache.get('x'), cache.get('y'), cache.get('x')]
>   expect(cache.size).toBe(2)
>   expect(keep).toHaveLength(3)
> })
>
> test('кеші незалежні', () => {
>   const one = createWeakCache((key) => ({ key }))
>   const two = createWeakCache((key) => ({ key }))
>   expect(one.get('k')).not.toBe(two.get('k'))
> })
> ```
>
> > [!hint]- Підказка 1
> > У `Map` зберігай не значення, а `new WeakRef(value)`.
>
> > [!hint]- Підказка 2
> > `registry.register(value, key)` — у callback прийде `key`. Але обережно: за цим ключем уже може лежати **новий** `WeakRef`.
>
> > [!hint]- Підказка 3
> > Видаляй запис у callback-у лише якщо `cache.get(key)?.deref() === undefined`.
>
> > [!solution]- Еталонне рішення
> > ```js
> > function createWeakCache(compute) {
> >   const cache = new Map(); // key → WeakRef(value)
> >   const registry = new FinalizationRegistry((key) => {
> >     const ref = cache.get(key);
> >     if (ref && ref.deref() === undefined) cache.delete(key);
> >   });
> >
> >   return {
> >     get(key) {
> >       const cached = cache.get(key)?.deref();
> >       if (cached !== undefined) return cached;
> >       const value = compute(key);   // має бути об'єктом
> >       cache.set(key, new WeakRef(value));
> >       registry.register(value, key);
> >       return value;
> >     },
> >     get size() {
> >       return cache.size;
> >     },
> >   };
> > }
> > ```
> >
> > Перевірка в Node: `node --expose-gc`, тримай одне значення в змінній, інше відпусти, виклич `gc()` і дай циклу кілька обертів — `size` зменшиться, а утримуване значення повернеться без повторного `compute`. Пам'ятай: `deref()` протягом однієї синхронної задачі стабільний, але між задачами значення може зникнути будь-коли — тому `size` лише приблизний.

## 📚 Джерела та що почитати

- 🟢 [javascript.info — Garbage collection](https://javascript.info/garbage-collection) — досяжність і mark-and-sweep на малюнках.
- 🟡 [MDN — Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) — життєвий цикл пам'яті, GC і обмеження підрахунку посилань.
- 🟡 [javascript.info — WeakMap and WeakSet](https://javascript.info/weakmap-weakset) — `WeakMap`/`WeakSet` і типові сценарії.
- 🟡 [V8 — Trash talk — the Orinoco garbage collector](https://v8.dev/blog/trash-talk) — поколіннєвий GC Orinoco: scavenger і major GC.
- 🟡 [Node.js — Understanding and Tuning Memory](https://nodejs.org/learn/diagnostics/memory/understanding-and-tuning-memory) — пам'ять V8 у Node.js і налаштування heap.
- 🔴 [V8 — Concurrent marking](https://v8.dev/blog/concurrent-marking) — як V8 маркує паралельно з виконанням JS.
- 🔴 [V8 — Weak references and finalizers](https://v8.dev/features/weak-references) — `WeakRef` і `FinalizationRegistry` та чому на них не можна покладатися.
- 🛠️ [Chrome DevTools — Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems) — як знайти витоки пам'яті в Chrome DevTools.
- 🛠️ [Chrome DevTools — Heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots) — heap snapshots, retainers і retained size.

> [!important] Підсумок
> - Об'єкт живе, доки досяжний з коренів (глобальні об'єкти, стек, таймери, listener-и, DOM); цикли не заважають.
> - «Примітиви на стеку» — спрощення: рядки, HeapNumber і змінні замикань живуть у heap; присвоєння копіює вміст слота.
> - V8: покоління young (Scavenger, дешево) і old (Mark-Compact); Orinoco робить GC паралельним, інкрементальним і конкурентним.
> - Витоки — це непотрібні, але досяжні об'єкти: listener-и, таймери, detached DOM, кеші без межі, замикання. Лікування — детермінований cleanup і `AbortController`.
> - `WeakMap`/`WeakSet` — для метаданих до чужих об'єктів; `WeakRef`/`FinalizationRegistry` — рідкісні інструменти без гарантій; витоки шукай трьома heap snapshot-ами.

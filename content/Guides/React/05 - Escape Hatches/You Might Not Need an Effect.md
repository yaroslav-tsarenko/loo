# Можливо, вам не потрібен Effect

## Вступ

Effects -- це аварійний вихід з парадигми React, який дозволяє "вийти за межі" React та синхронізувати компоненти із зовнішніми системами, такими як віджети, що не належать React, мережеві запити або DOM браузера. Якщо зовнішньої системи немає, вам не потрібен Effect. Видалення непотрібних Effects робить код зрозумілішим, швидшим та менш схильним до помилок.

## Цілі навчання

- Чому та як видаляти непотрібні Effects з компонентів
- Як кешувати ресурсомісткі обчислення без Effects
- Як скидати та налаштовувати state компонента без Effects
- Як ділитися логікою між обробниками подій
- Яку логіку слід переносити до обробників подій
- Як повідомляти батьківські компоненти про зміни

---

## Як видалити непотрібні Effects

### Два поширені випадки, коли Effects не потрібні

**1. Вам не потрібні Effects для перетворення даних для рендерингу**

Приклад: Фільтрація списку перед відображенням. Хоча може виникнути спокуса написати Effect, що оновлює state при зміні списку, це неефективно:

```js
// Уникайте: зайвий state та непотрібний Effect
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [fullName, setFullName] = useState('');
  
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
}
```

Коли ви оновлюєте state в Effect, React рендерить із застарілим значенням, потім повторно рендерить з оновленим -- створюючи зайві проходи рендерингу.

**Рішення: Обчислюйте на верхньому рівні компонента**

```js
// Добре: обчислено під час рендерингу
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const fullName = firstName + ' ' + lastName;
}
```

Цей код автоматично перевиконується при зміні props або state, без зайвих проходів рендерингу.

**2. Вам не потрібні Effects для обробки подій користувача**

Приклад: Відправка POST-запиту при натисканні кнопки:

```js
// Уникайте: використання Effect для обробки подій користувача
const [jsonToSubmit, setJsonToSubmit] = useState(null);
useEffect(() => {
  if (jsonToSubmit !== null) {
    post('/api/register', jsonToSubmit);
  }
}, [jsonToSubmit]);

function handleSubmit(e) {
  e.preventDefault();
  setJsonToSubmit({ firstName, lastName });
}
```

На момент виконання Effect ви не знаєте, що зробив користувач. Обробляйте події користувача у відповідних обробниках подій:

```js
// Добре: логіка конкретної події в обробнику подій
function handleSubmit(e) {
  e.preventDefault();
  post('/api/register', { firstName, lastName });
}
```

### Коли Effects ПОТРІБНІ

Використовуйте Effects для синхронізації із зовнішніми системами:
- Синхронізація віджетів jQuery зі state React
- Отримання даних та синхронізація результатів пошуку із запитом
- Сучасні фреймворки надають ефективніші вбудовані механізми отримання даних

---

## Оновлення State на основі Props або State

**Проблема:**

```js
// Уникайте: зайвий state та непотрібний Effect
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);
  
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);
}
```

Це непотрібно та неефективно.

**Рішення: Обчислюйте під час рендерингу**

```js
// Добре: це нормально, якщо getFilteredTodos() не повільна
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = getFilteredTodos(todos, filter);
}
```

**Ключовий принцип:** Коли щось можна обчислити з наявних props або state, не поміщайте це в state. Обчислюйте під час рендерингу. Це робить код швидшим (уникаючи каскадних оновлень), простішим та менш схильним до помилок.

---

## Кешування ресурсомістких обчислень

Для ресурсомістких обчислень, які не повинні перераховуватися при кожному рендерингу, використовуйте `useMemo`:

```js
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // Не перезапускається, поки todos або filter не зміняться
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
}
```

Або в один рядок:

```js
const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
```

> **Примітка:** React Compiler може автоматично мемоїзувати ресурсомісткі обчислення у багатьох випадках, усуваючи потребу в ручному `useMemo`.

### Як визначити, чи обчислення ресурсомістке

Використовуйте `console.time()` для вимірювання:

```js
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Якщо записаний час складає 1 мс або більше, мемоїзація може мати сенс.

**Важливо:** `useMemo` не прискорить перший рендеринг -- він лише допомагає пропустити зайву роботу при оновленнях. Тестуйте зі штучним уповільненням (CPU Throttling у Chrome) для точних вимірювань продуктивності в режимі розробки.

---

## Скидання всього State при зміні Prop

**Проблема:**

```js
// Уникайте: скидання state при зміні prop в Effect
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment('');
  }, [userId]);
}
```

Це неефективно та складно -- потрібно робити це в кожному компоненті з вкладеним state.

**Рішення: Використовуйте атрибут key**

Скажіть React, що профіль кожного користувача -- це концептуально інший профіль, передавши `key`:

```js
// Добре: різні профілі не ділять state
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // Цей та весь інший state нижче скидається при зміні key автоматично
  const [comment, setComment] = useState('');
}
```

При зміні key React перестворює DOM та скидає state цього компонента та всіх його дочірніх елементів автоматично.

---

## Налаштування частини State при зміні Prop

**Проблема:**

```js
// Уникайте: налаштування state при зміні prop в Effect
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    setSelection(null);
  }, [items]);
}
```

**Рішення: Налаштуйте state безпосередньо під час рендерингу**

```js
// Краще: налаштуйте state під час рендерингу
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);
  const [prevItems, setPrevItems] = useState(items);
  
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
}
```

Цей патерн ефективніший за Effect, але все ще складний. Розгляньте кращі альтернативи:

**Найкраще рішення: Обчислюйте все під час рендерингу**

```js
// Найкраще: обчислюйте все під час рендерингу
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  // Обчислення selection з selectedId
  const selection = items.find(item => item.id === selectedId) ?? null;
}
```

Це усуває потребу в "налаштуванні" state взагалі. Якщо обраний елемент є у списку, він залишається обраним; якщо ні, обчислений selection буде `null`.

---

## Спільна логіка між обробниками подій

**Проблема:**

```js
// Уникайте: логіка конкретної події всередині Effect
function ProductPage({ product, addToCart }) {
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`${product.name} додано до кошика!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
}
```

Цей Effect спричиняє помилки -- сповіщення з'являється при кожному завантаженні сторінки, якщо товар вже в кошику.

**Ключове питання:** Навіщо цей код повинен виконуватися? Використовуйте Effects лише для коду, який має виконуватися через те, що компонент був відображений. Сповіщення має з'являтися через натискання кнопки, а не через відображення сторінки.

**Рішення: Виділіть спільну логіку у функцію**

```js
// Добре: логіка конкретної події викликається з обробників подій
function ProductPage({ product, addToCart }) {
  function buyProduct() {
    addToCart(product);
    showNotification(`${product.name} додано до кошика!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
}
```

---

## Відправка POST-запиту

**Проблема:**

```js
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Добре: ця логіка повинна виконуватися через відображення компонента
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // Уникайте: логіка конкретної події всередині Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
}
```

**Аналіз:**
- Подія аналітики: Залиште в Effect (виконується через відображення компонента)
- POST реєстрації: Перенесіть до обробника подій (виконується через натискання кнопки)

**Рішення:**

```js
// Добре: правильне розділення відповідальностей
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Добре: ця логіка виконується через відображення компонента
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // Добре: логіка конкретної події в обробнику подій
    post('/api/register', { firstName, lastName });
  }
}
```

---

## Ланцюги обчислень

**Проблема:**

```js
// Уникайте: ланцюги Effects, що коригують state лише для запуску один одного
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Гарна гра!');
  }, [isGameOver]);
}
```

**Проблеми:**
1. Дуже неефективно -- кілька повторних рендерингів між кожним оновленням state
2. Жорстко та крихко -- ламається з новими вимогами, як перегляд історії гри

**Рішення: Обчислюйте під час рендерингу, коригуйте state в обробнику подій**

```js
// Добре: обчислення та коригування в обробнику подій
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // Обчислюйте, що можете, під час рендерингу
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Гра вже завершена.');
    }

    // Обчислюйте весь наступний state в обробнику подій
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount < 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Гарна гра!');
        }
      }
    }
  }
}
```

> **Примітка:** Всередині обробників подій state поводиться як знімок. Якщо потрібне наступне значення для обчислень, визначте його вручну: `const nextRound = round + 1`.

---

## Ініціалізація застосунку

**Проблема:**

```js
// Уникайте: Effects з логікою, що має виконуватися лише раз
function App() {
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
}
```

Це запускається двічі в режимі розробки, що може спричинити проблеми (наприклад, інвалідацію токенів автентифікації).

**Рішення 1: Використовуйте змінну верхнього рівня**

```js
// Виконується лише раз при завантаженні застосунку
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
}
```

**Рішення 2: Виконайте при ініціалізації модуля**

```js
// Виконується лише раз при завантаженні застосунку
if (typeof window !== 'undefined') {
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Тримайте логіку ініціалізації застосунку в модулях кореневого компонента, таких як `App.js`, або точці входу вашого застосунку.

---

## Повідомлення батьківських компонентів про зміни State

**Проблема:**

```js
// Уникайте: обробник onChange виконується занадто пізно
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }
}
```

Toggle оновлюється першим, React оновлює екран, потім Effect запускається -- змушуючи батьківський компонент оновлюватися в окремому проході рендерингу.

**Рішення 1: Оновлюйте обидва компоненти в одному обробнику подій**

```js
// Добре: виконуйте всі оновлення під час події, що їх спричинила
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }
}
```

React об'єднує оновлення з різних компонентів, що призводить лише до одного проходу рендерингу.

**Рішення 2: Повністю контрольований компонент**

```js
// Також добре: компонент повністю контролюється батьком
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }
}
```

---

## Передача даних батьківському компоненту

**Проблема:**

```js
// Уникайте: передача даних батьку в Effect
function Parent() {
  const [data, setData] = useState(null);
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
}
```

Це ускладнює відстеження потоку даних.

**Рішення: Передавайте дані зверху вниз від батька до дитини**

```js
// Добре: передача даних дочірньому компоненту
function Parent() {
  const data = useSomeAPI();
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Це зберігає передбачуваність потоку даних: дані йдуть зверху від батька до дитини.

---

## Підписка на зовнішнє сховище

**Проблема:**

```js
// Не ідеально: ручна підписка на сховище в Effect
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}
```

**Рішення: Використовуйте `useSyncExternalStore`**

```js
// Добре: підписка на зовнішнє сховище через вбудований Hook
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe, // Як підписатися
    () => navigator.onLine, // Як отримати значення на клієнті
    () => true // Як отримати значення на сервері
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
}
```

Це менш схильне до помилок, ніж ручна синхронізація мутабельних даних з Effects.

---

## Отримання даних

Effects підходять для отримання даних:

```js
// Добре: отримання даних в Effect
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);
}
```

Однак **ви повинні обробляти умови гонки**, ігноруючи застарілі відповіді:

```js
// Добре: обробка умов гонки
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);
}
```

Без цього очищення, якщо запити завершаться не в тому порядку, ви відобразите некоректні результати.

### Користувацький Hook для отримання даних

```js
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Це робить отримання даних ергономічнішим та простішим для підтримки. Розгляньте вбудовані механізми отримання даних фреймворків для кращої ефективності.

---

## Підсумок

- Якщо ви можете обчислити щось під час рендерингу, вам не потрібен Effect
- Для кешування ресурсомістких обчислень додайте `useMemo` замість `useEffect`
- Для скидання state всього дерева компонентів передайте інший `key`
- Для скидання конкретного state у відповідь на зміну prop, встановіть його під час рендерингу
- Код, що виконується через відображення компонента, має бути в Effects; решта -- в подіях
- Якщо потрібно оновити state кількох компонентів, краще робити це під час однієї події
- Коли ви намагаєтесь синхронізувати state в різних компонентах, розгляньте підняття state вгору
- Ви можете отримувати дані з Effects, але потрібно реалізувати очищення для уникнення умов гонки

---

## Практичні завдання

### Завдання 1: Перетворення даних без Effects

Спростіть компонент `TodoList`, видаливши зайвий state та Effects. Обчислюйте `activeTodos` та `visibleTodos` під час рендерингу замість зберігання в state.

### Завдання 2: Кешування обчислень без Effects

Використовуйте `useMemo` для кешування ресурсомістких обчислень або виділіть форму в окремий компонент, щоб зміни непов'язаного state не запускали перерахунок.

### Завдання 3: Скидання State без Effects

Використовуйте атрибут `key`, щоб вказати React, що компонент концептуально відрізняється при зміні його ID, автоматично скидаючи весь state.

### Завдання 4: Відправка форми без Effects

Перенесіть логіку відправки форми з Effect до обробника подій `handleSubmit` -- повідомлення має відправлятися через подію відправки форми, а не через зміну state.

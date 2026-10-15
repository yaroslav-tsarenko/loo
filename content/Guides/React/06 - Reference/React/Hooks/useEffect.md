# useEffect

## Огляд

`useEffect` — це React Hook, який дозволяє синхронізувати компонент із зовнішньою системою.

```js
useEffect(setup, dependencies?)
```

---

## Довідка

### `useEffect(setup, dependencies?)`

Викликайте `useEffect` на верхньому рівні компонента для оголошення Effect:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

#### Параметри

* **`setup`**: Функція з логікою вашого Effect. Може також повертати функцію *очищення*. Коли компонент комітиться, React запускає вашу функцію setup. Після кожного коміту зі зміненими залежностями React спочатку запустить функцію очищення (якщо ви її надали) зі старими значеннями, а потім вашу функцію setup з новими значеннями. Після видалення компонента з DOM React запустить функцію очищення.

* **`dependencies`** (необов'язково): Список усіх реактивних значень, на які посилається код `setup`. Реактивні значення включають props, state та всі змінні й функції, оголошені безпосередньо в тілі компонента. Список залежностей повинен мати постійну кількість елементів і бути записаний inline як `[dep1, dep2, dep3]`. React порівнює кожну залежність з попереднім значенням за допомогою [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Якщо пропустити цей аргумент, Effect повторно запускатиметься після кожного коміту компонента.

#### Повертає

`useEffect` повертає `undefined`.

#### Застереження

* `useEffect` — це Hook, тому його можна викликати лише **на верхньому рівні компонента** або власних Hooks.
* Якщо ви **не намагаєтесь синхронізуватися з зовнішньою системою,** [вам, можливо, не потрібен Effect.](/learn/you-might-not-need-an-effect)
* У Strict Mode React **запускає додатковий цикл setup+cleanup у режимі розробки** перед першим реальним setup.
* Якщо деякі залежності — об'єкти або функції, визначені всередині компонента, є ризик, що вони **змусять Effect перезапускатися частіше, ніж потрібно.**
* Якщо Effect не був спричинений взаємодією, React зазвичай дозволить браузеру **спочатку перемалювати екран, а потім запустить Effect.**
* Effects **запускаються лише на клієнті.** Вони не запускаються під час серверного рендерингу.

---

## Використання

### Підключення до зовнішньої системи

Деякі компоненти повинні залишатися підключеними до мережі, API браузера або сторонньої бібліотеки, поки вони відображаються на сторінці. Ці системи не контролюються React, тому називаються *зовнішніми*.

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

Потрібно передати два аргументи:

1. *Функцію setup* з кодом підключення до системи, яка повертає *функцію очищення* з кодом відключення.
2. Список залежностей, що включає кожне значення з компонента, використане всередині цих функцій.

**React викликає ваші функції setup та cleanup коли це необхідно:**

1. Код setup запускається при додаванні компонента на сторінку *(mount)*.
2. Після кожного коміту компонента зі зміненими залежностями:
   - Спочатку код cleanup запускається зі старими props та state.
   - Потім код setup запускається з новими props та state.
3. Код cleanup запускається востаннє після видалення компонента зі сторінки *(unmount)*.

> **Примітка**: Effect дозволяє тримати компонент синхронізованим із зовнішньою системою. *Зовнішня система* — це будь-який код, який не контролюється React: таймер з `setInterval()`/`clearInterval()`, підписка на події через `window.addEventListener()`/`window.removeEventListener()`, стороння бібліотека анімацій тощо. **Якщо ви не підключаєтесь до зовнішньої системи, вам, ймовірно, не потрібен Effect.**

#### Приклади підключення до зовнішніх систем

##### Підключення до чат-сервера

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
  // ...
}
```

##### Слухання глобальної події браузера

```js
export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);
  // ...
}
```

##### Запуск анімації

```js
function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);
  // ...
}
```

---

### Обгортання Effects у власні Hooks

Effects — це "аварійний вихід": ви використовуєте їх, коли потрібно "вийти за межі React". Якщо ви часто пишете Effects вручну, це зазвичай ознака того, що потрібно виділити власні Hooks:

```js
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

---

### Отримання даних за допомогою Effects

Ви можете використовувати Effect для отримання даних. Зверніть увагу на змінну `ignore` для запобігання "гонкам станів":

```js
useEffect(() => {
  let ignore = false;
  setBio(null);
  fetchBio(person).then(result => {
    if (!ignore) {
      setBio(result);
    }
  });
  return () => {
    ignore = true;
  };
}, [person]);
```

> **Що краще, ніж отримання даних в Effects?** Написання `fetch` безпосередньо в Effects має значні недоліки: Effects не запускаються на сервері, легко створити "мережеві водоспади", немає попереднього завантаження чи кешування. Рекомендується використовувати вбудований механізм отримання даних фреймворку або клієнтський кеш (TanStack Query, useSWR тощо).

---

### Вказання реактивних залежностей

**Ви не можете "обрати" залежності Effect.** Кожне реактивне значення, використане кодом Effect, має бути оголошене як залежність:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Всі залежності оголошені
  // ...
}
```

**Щоб видалити залежність, потрібно "довести" лінтеру, що вона *не потребує* бути залежністю.** Наприклад, перемістивши `serverUrl` за межі компонента.

> **Пастка:** Уникайте придушення лінтера: `// eslint-ignore-next-line react-hooks/exhaustive-deps`. Коли залежності не відповідають коду, є високий ризик появи помилок.

---

### Оновлення state на основі попереднього state з Effect

Замість використання `count` як залежності, передайте функцію-оновлювач:

```js
useEffect(() => {
  const intervalId = setInterval(() => {
    setCount(c => c + 1); // ✅ Передайте функцію-оновлювач
  }, 1000);
  return () => clearInterval(intervalId);
}, []); // ✅ Тепер count не є залежністю
```

---

### Видалення непотрібних залежностей від об'єктів

Створюйте об'єкт всередині Effect замість зовні:

```js
useEffect(() => {
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]); // ✅ Залежить тільки від рядка roomId
```

---

### Видалення непотрібних залежностей від функцій

Оголошуйте функцію всередині Effect:

```js
useEffect(() => {
  function createOptions() {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }
  const options = createOptions();
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

---

## Вирішення проблем

### Effect запускається двічі при монтуванні компонента

У Strict Mode React запускає setup та cleanup додатковий раз у режимі розробки. Це стрес-тест, що перевіряє правильність логіки очищення.

### Effect повторно запускається після кожного рендеру

Перевірте, що ви не забули вказати масив залежностей:

```js
useEffect(() => {
  // ...
}); // 🚩 Без масиву залежностей: перезапускається після кожного коміту!
```

### Effect працює в нескінченному циклі

Якщо Effect оновлює state, а цей state змінює залежності Effect — це створює цикл. Подумайте, чи потрібен Effect взагалі, чи можна прибрати його.

### Логіка очищення запускається, хоча компонент не було розмонтовано

Функція очищення запускається не лише при розмонтуванні, але й перед кожним повторним рендером зі зміненими залежностями. Ваша логіка очищення має бути "симетричною" до логіки setup.

### Effect робить щось візуальне, і я бачу мерехтіння перед його запуском

Якщо Effect має блокувати браузер від перемальовування екрана, замініть `useEffect` на `useLayoutEffect`.

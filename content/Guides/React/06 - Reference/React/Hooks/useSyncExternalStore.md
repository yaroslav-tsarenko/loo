# useSyncExternalStore

## Огляд

`useSyncExternalStore` — це React Hook, який дозволяє підписатися на зовнішнє сховище.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

---

## Довідка

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`

Викликайте `useSyncExternalStore` на верхньому рівні компонента для читання значення із зовнішнього сховища даних.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Повертає знімок даних у сховищі. Потрібно передати дві функції:

1. Функція `subscribe` — підписується на сховище та повертає функцію відписки.
2. Функція `getSnapshot` — читає знімок даних зі сховища.

#### Параметри

* **`subscribe`**: Функція, що приймає один аргумент `callback` і підписує його на сховище. Коли сховище змінюється, має викликати `callback`, що змусить React повторно викликати `getSnapshot` і (при потребі) повторно відрендерити компонент. Має повертати функцію очищення підписки.

* **`getSnapshot`**: Функція, що повертає знімок даних зі сховища. Поки сховище не змінилося, повторні виклики мають повертати те саме значення. Якщо повернене значення інше (`Object.is`), React повторно рендерить компонент.

* **`getServerSnapshot`** (необов'язково): Функція, що повертає початковий знімок даних. Використовується лише під час серверного рендерингу та гідратації. Має бути однаковою між клієнтом і сервером.

#### Повертає

Поточний знімок сховища для використання в логіці рендерингу.

#### Застереження

* Знімок, повернений `getSnapshot`, має бути незмінним (immutable).
* Якщо передати іншу функцію `subscribe` під час повторного рендеру, React підпишеться знову. Запобігайте цьому, оголошуючи `subscribe` за межами компонента.

---

## Використання

### Підписка на зовнішнє сховище

Більшість компонентів читають дані лише з props, state та context. Але іноді компонент має читати дані зі сховища поза React:

* Сторонні бібліотеки керування state.
* API браузера з мутабельними значеннями та подіями.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Додати завдання</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

> **Примітка**: Коли можливо, рекомендуємо використовувати вбудований state React з `useState` та `useReducer`. API `useSyncExternalStore` найбільш корисний для інтеграції з існуючим кодом, що не належить до React.

---

### Підписка на API браузера

Наприклад, якщо потрібно відображати, чи активне мережеве з'єднання:

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Онлайн' : '❌ Відключено'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

---

### Виділення логіки у власний Hook

Зазвичай `useSyncExternalStore` не пишуть безпосередньо в компонентах. Замість цього його викликають з власного Hook:

```js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Тепер різні компоненти можуть викликати `useOnlineStatus` без дублювання реалізації.

---

### Додавання підтримки серверного рендерингу

Передайте функцію `getServerSnapshot` як третій аргумент:

```js
export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getServerSnapshot() {
  return true; // Завжди показувати "Онлайн" для серверного HTML
}
```

`getServerSnapshot` запускається на сервері при генерації HTML та на клієнті під час гідратації.

> **Примітка**: Переконайтеся, що `getServerSnapshot` повертає ті самі дані на клієнті при початковому рендері, що й на сервері.

---

## Вирішення проблем

### Помилка: "The result of `getSnapshot` should be cached"

`getSnapshot` повертає новий об'єкт кожного разу:

```js
// 🔴 Не повертайте завжди різні об'єкти
function getSnapshot() {
  return { todos: myStore.todos };
}

// ✅ Повертайте незмінні дані напряму
function getSnapshot() {
  return myStore.todos;
}
```

### Функція `subscribe` викликається після кожного повторного рендеру

Перемістіть `subscribe` за межі компонента:

```js
// ✅ Завжди та сама функція
function subscribe() {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Або обгорніть у `useCallback`, якщо залежить від аргументів.

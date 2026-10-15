# useDebugValue

## Огляд

`useDebugValue` — це React Hook, який дозволяє додати мітку до власного Hook у React DevTools.

```js
useDebugValue(value, format?)
```

---

## Довідка

### `useDebugValue(value, format?)`

Викликайте `useDebugValue` на верхньому рівні вашого власного Hook для відображення читабельного значення для налагодження:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Онлайн' : 'Офлайн');
  // ...
}
```

#### Параметри

* `value`: Значення, яке ви хочете відобразити в React DevTools. Може мати будь-який тип.
* **необов'язково** `format`: Функція форматування. Коли компонент інспектується, React DevTools викличе функцію форматування з `value` як аргументом, а потім відобразить повернене відформатоване значення. Якщо ви не вказуєте функцію форматування, буде відображено оригінальне `value`.

#### Повертає

`useDebugValue` нічого не повертає.

---

## Використання

### Додавання мітки до власного Hook

Викликайте `useDebugValue` на верхньому рівні вашого власного Hook для відображення читабельного значення для React DevTools.

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Онлайн' : 'Офлайн');
  // ...
}
```

Це надає компонентам, що викликають `useOnlineStatus`, мітку на кшталт `OnlineStatus: "Онлайн"`, коли ви їх інспектуєте в React DevTools.

#### Приклад реалізації

```js
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Онлайн' : 'Офлайн');
  return isOnline;
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

#### Важлива примітка

Не додавайте значення для налагодження до кожного власного Hook. Це найбільш корисно для власних Hooks, які є частиною спільних бібліотек і мають складну внутрішню структуру даних, яку важко інспектувати.

### Відкладене форматування значення для налагодження

Ви також можете передати функцію форматування як другий аргумент:

```js
useDebugValue(date, date => date.toDateString());
```

Ваша функція форматування отримає значення для налагодження як параметр і повинна повернути відформатоване значення для відображення. Коли компонент інспектується, React DevTools викличе цю функцію та відобразить результат.

Це дозволяє уникнути виконання потенційно дорогої логіки форматування, якщо компонент фактично не інспектується.

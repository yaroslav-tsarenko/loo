# isValidElement

`isValidElement` перевіряє, чи є значення React-елементом.

```js
const isElement = isValidElement(value)
```

---

## Довідка

### `isValidElement(value)`

Викликайте `isValidElement(value)`, щоб перевірити, чи є `value` React-елементом.

```js
import { isValidElement, createElement } from 'react';

// ✅ React-елементи
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Не React-елементи
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

#### Параметри

* `value`: Значення, яке ви хочете перевірити. Може бути значенням будь-якого типу.

#### Повертає

`isValidElement` повертає `true`, якщо `value` є React-елементом. В іншому випадку повертає `false`.

#### Застереження

* **Лише JSX-теги та об'єкти, повернуті `createElement`, вважаються React-елементами.** Наприклад, навіть якщо число `42` є допустимим React-*вузлом* (і може бути повернуто з компонента), воно не є допустимим React-елементом. Масиви та портали, створені за допомогою `createPortal`, також *не* вважаються React-елементами.

---

## Використання

### Перевірка, чи щось є React-елементом

Викликайте `isValidElement`, щоб перевірити, чи є якесь значення *React-елементом*.

React-елементи — це:
- Значення, створені написанням JSX-тегу
- Значення, створені викликом `createElement`

Для React-елементів `isValidElement` повертає `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX-теги є React-елементами
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Значення, повернуті createElement, є React-елементами
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Будь-які інші значення, такі як рядки, числа або довільні об'єкти та масиви, не є React-елементами.

Для них `isValidElement` повертає `false`:

```js
// ❌ Це *не* React-елементи
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

Потреба в `isValidElement` виникає дуже рідко. Це найбільш корисно, якщо ви викликаєте інший API, який приймає *тільки* елементи (як це робить `cloneElement`) і ви хочете уникнути помилки, коли ваш аргумент не є React-елементом.

Якщо у вас немає дуже конкретної причини додавати перевірку `isValidElement`, вона вам, ймовірно, не потрібна.

### React-елементи проти React-вузлів

Коли ви пишете компонент, ви можете повернути будь-який *React-вузол* з нього:

```js
function MyComponent() {
  // ... ви можете повернути будь-який React-вузол ...
}
```

React-вузол може бути:
- React-елементом, створеним як `<div />` або `createElement('div')`
- Порталом, створеним за допомогою `createPortal`
- Рядком
- Числом
- `true`, `false`, `null` або `undefined` (які не відображаються)
- Масивом інших React-вузлів

**Зверніть увагу: `isValidElement` перевіряє, чи є аргумент *React-елементом*, а не чи є він React-вузлом.** Наприклад, `42` не є допустимим React-елементом. Однак це цілком допустимий React-вузол:

```js
function MyComponent() {
  return 42; // Допустимо повертати число з компонента
}
```

Тому не слід використовувати `isValidElement` як спосіб перевірити, чи може щось бути відрендерено.

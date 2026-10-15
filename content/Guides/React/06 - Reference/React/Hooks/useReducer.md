# useReducer

## Вступ

`useReducer` — це React Hook, який дозволяє додати [reducer](/learn/extracting-state-logic-into-a-reducer) до компонента.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

---

## Довідка

### `useReducer(reducer, initialArg, init?)`

Викликайте `useReducer` на верхньому рівні компонента для керування state за допомогою reducer:

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
}
```

#### Параметри

- **`reducer`**: Функція reducer, яка визначає, як state оновлюється. Має бути чистою, приймати state та action як аргументи і повертати наступний state.
- **`initialArg`**: Значення, з якого обчислюється початковий state.
- **`init`** (необов'язково): Функція-ініціалізатор. Якщо не вказана, початковий state встановлюється на `initialArg`. Інакше — на результат виклику `init(initialArg)`.

#### Повертає

Масив з двома значеннями:

1. Поточний state.
2. Функція `dispatch`, яка дозволяє оновити state та запустити повторний рендер.

#### Застереження

- `useReducer` — це Hook, його можна викликати лише на верхньому рівні компонента.
- Функція `dispatch` має стабільну ідентичність.
- У Strict Mode React **викличе reducer та ініціалізатор двічі** для пошуку нечистот.

---

### Функція `dispatch`

Функція `dispatch` дозволяє оновити state:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

#### Застереження

- `dispatch` **оновлює state лише для *наступного* рендеру.** Якщо прочитати state після виклику, отримаєте старе значення.
- Якщо нове значення ідентичне поточному (`Object.is`), React **пропустить повторний рендер.**
- React **групує оновлення state** та оновлює екран після завершення всіх обробників подій.

---

## Використання

### Додавання reducer до компонента

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Невідома дія.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Збільшити вік
      </button>
      <p>Привіт! Вам {state.age}.</p>
    </>
  );
}
```

`useReducer` дуже схожий на `useState`, але дозволяє перемістити логіку оновлення state з обробників подій в одну функцію.

---

### Написання функції reducer

```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Невідома дія: ' + action.type);
}
```

> **Пастка:** State є read-only. Не мутуйте об'єкти або масиви в state:

```js
// 🚩 Неправильно: мутація існуючого об'єкта
state.age = state.age + 1;
return state;

// ✅ Правильно: повернення нового об'єкта
return {
  ...state,
  age: state.age + 1
};
```

---

### Уникнення повторного створення початкового state

Замість передачі результату виклику функції, передайте саму функцію:

```js
// ✅ Функція createInitialState запускається лише під час ініціалізації
function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
}
```

Зверніть увагу: передається `createInitialState` (сама функція), а не `createInitialState()` (результат виклику).

---

## Вирішення проблем

### Я відправив дію, але логування показує старе значення state

Виклик `dispatch` **не змінює state у виконуваному коді:**

```js
function handleClick() {
  console.log(state.age);  // 42
  dispatch({ type: 'incremented_age' }); // Запит повторного рендеру з 43
  console.log(state.age);  // Все ще 42!
}
```

Для отримання наступного state обчисліть його вручну:

```js
const action = { type: 'incremented_age' };
dispatch(action);
const nextState = reducer(state, action);
console.log(nextState); // { age: 43 }
```

### Я відправив дію, але екран не оновлюється

React ігнорує оновлення, якщо наступний state дорівнює попередньому (`Object.is`). Це трапляється при мутації state:

```js
// 🚩 Неправильно: мутація
state.age++;
return state;

// ✅ Правильно: новий об'єкт
return { ...state, age: state.age + 1 };
```

### Частина state стає undefined після dispatch

Переконайтеся, що кожна гілка `case` **копіює всі існуючі поля:**

```js
case 'incremented_age': {
  return {
    ...state, // Не забудьте!
    age: state.age + 1
  };
}
```

### Помилка "Too many re-renders"

Ви безумовно відправляєте дію під час рендеру:

```js
// 🚩 Неправильно: викликає обробник під час рендеру
return <button onClick={handleClick()}>Натисни</button>

// ✅ Правильно: передає обробник
return <button onClick={handleClick}>Натисни</button>
```

### Reducer або ініціалізатор запускається двічі

У Strict Mode React викликає їх двічі для пошуку нечистот. Це поведінка лише режиму розробки. Якщо функції чисті, це не вплине на логіку.

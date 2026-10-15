# useOptimistic

## Огляд

`useOptimistic` — це React Hook, який дозволяє оптимістично оновлювати UI під час виконання асинхронної дії.

```js
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

---

## Довідка

### `useOptimistic(value, reducer?)`

Викликайте `useOptimistic` на верхньому рівні компонента для оголошення оптимістичного state.

```js
import { useOptimistic } from 'react';

function MyComponent({name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(28);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
  // ...
}
```

#### Параметри

* **`value`**: Значення, що повертається, коли немає очікуваних Actions.
* **`reducer(currentState, action)`** (необов'язково): Чиста функція reducer, яка визначає, як оптимістичний state оновлюється.

#### Повертає

Масив з двома значеннями:

1. **`optimisticState`**: Поточний оптимістичний state. Дорівнює `value`, якщо Action не виконується; інакше — значенню, поверненому `reducer`.
2. **Функція `set`**: Дозволяє оновити оптимістичний state під час Action.

#### Застереження функції set

* **Має викликатися всередині Action**: Функція set має викликатися всередині `startTransition` або Action prop. Виклик поза ними призведе до попередження.

---

## Як працює оптимістичний state

`useOptimistic` показує тимчасове значення під час виконання Action:

```js
const [value, setValue] = useState('a');
const [optimistic, setOptimistic] = useOptimistic(value);

startTransition(async () => {
  setOptimistic('b');
  const newValue = await saveChanges('b');
  setValue(newValue);
});
```

### Потік оновлення

1. **Негайне оновлення**: Коли викликається `setOptimistic('b')`, React одразу рендерить з `'b'`.
2. **Очікування**: Якщо є `await`, React продовжує показувати `'b'`.
3. **Фінальний коміт**: `setValue(newValue)` — обидва `value` та `optimistic` отримують фінальне значення в одному рендері.

> **Примітка**: Немає додаткового рендеру для "очищення" оптимістичного state. Оптимістичний та реальний state зливаються в одному рендері при завершенні Transition.

### Коли Action зазнає невдачі

Якщо Action викидає помилку, Transition завершується і React рендерить з поточним `value`. Оскільки батько зазвичай оновлює `value` лише при успіху, невдача означає повернення до стану до оптимістичного оновлення.

---

## Використання

### Оптимістичне оновлення props або state

```js
import { useState, useOptimistic, startTransition } from 'react';
import { toggleLike } from './actions.js';

export default function App() {
  const [isLiked, setIsLiked] = useState(false);
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      const newValue = !optimisticIsLiked;
      setOptimisticIsLiked(newValue);
      const updatedValue = await toggleLike(newValue);
      startTransition(() => {
        setIsLiked(updatedValue);
      });
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticIsLiked ? '❤️ Прибрати лайк' : '🤍 Лайк'}
    </button>
  );
}
```

---

### Оновлення кількох значень разом з reducer

Коли оптимістичне оновлення впливає на кілька пов'язаних значень:

```js
const [optimisticState, updateOptimistic] = useOptimistic(
  { isFollowing: user.isFollowing, followerCount: user.followerCount },
  (current, isFollowing) => ({
    isFollowing,
    followerCount: current.followerCount + (isFollowing ? 1 : -1)
  })
);
```

---

### Оптимістичне додавання до списку з reducer

```js
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (currentTodos, newTodo) => [
    ...currentTodos,
    { id: newTodo.id, text: newTodo.text, pending: true }
  ]
);
```

Reducer отримує поточний список та новий елемент. Якщо `todos` змінюється під час очікування (наприклад, інший користувач додав todo), React оновить оптимістичний state, перезапустивши reducer з новим списком.

---

### Вибір між оновлювачами та reducers

**Функції-оновлювачі** працюють як оновлювачі `useState`:

```js
const [optimistic, setOptimistic] = useOptimistic(value);
setOptimistic(current => !current);
```

**Reducers** відокремлюють логіку оновлення від виклику:

```js
const [optimistic, dispatch] = useOptimistic(value, (current, action) => {
  // Обчислення наступного state на основі current та action
});
dispatch(action);
```

**Використовуйте reducers**, коли базовий state може змінитися під час очікування Transition або коли потрібно обробляти кілька типів оновлень.

---

## Вирішення проблем

### Помилка: "An optimistic state update occurred outside a Transition or Action"

Функція set має викликатися всередині `startTransition`:

```js
// ✅ Правильно: всередині Transition
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}
```

### Як дізнатися, чи оптимістичне оновлення очікує

1. Перевірити `optimisticValue === value`
2. Додати `useTransition` та використати його `isPending`
3. Додати прапорець `pending` у reducer

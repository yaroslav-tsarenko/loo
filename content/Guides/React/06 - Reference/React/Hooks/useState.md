# useState

## Вступ

`useState` — це React Hook, який дозволяє додати змінну state до компонента.

```js
const [state, setState] = useState(initialState)
```

---

## Довідка

### `useState(initialState)`

Викликайте `useState` на верхньому рівні компонента для оголошення змінної state.

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
}
```

За домовленістю, змінні state називають `[something, setSomething]` з використанням деструктуризації масиву.

#### Параметри

* **`initialState`**: Значення, яким ви хочете ініціалізувати state. Може бути будь-якого типу. Якщо передати функцію, вона буде трактуватися як *функція-ініціалізатор* — React викличе її при ініціалізації та збереже повернене значення. Цей аргумент ігнорується після початкового рендеру.

#### Повертає

Масив з двома значеннями:

1. Поточний state.
2. Функція `set`, яка дозволяє оновити state та запустити повторний рендер.

#### Застереження

* `useState` — це Hook, його можна викликати лише на верхньому рівні компонента.
* У Strict Mode React **викличе ініціалізатор двічі** для пошуку нечистот.

---

### Функції `set`, як `setSomething(nextState)`

Функція `set` дозволяє оновити state:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
}
```

#### Застереження

* Функція `set` **оновлює state лише для *наступного* рендеру.**
* Якщо нове значення ідентичне поточному (`Object.is`), React **пропустить повторний рендер.**
* React **групує оновлення state** та оновлює екран після завершення обробників подій.
* Функція `set` має стабільну ідентичність.

---

## Використання

### Додавання state до компонента

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
}
```

> **Пастка:** Виклик `set` **не** змінює поточний state у вже виконуваному коді:

```js
function handleClick() {
  setName('Robin');
  console.log(name); // Все ще "Taylor"!
}
```

---

### Оновлення state на основі попереднього state

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
// Після кліку age буде 43, а не 45!
```

Для вирішення передайте **функцію-оновлювач:**

```js
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

React ставить функції-оновлювачі в чергу і викликає їх по порядку під час наступного рендеру.

---

### Оновлення об'єктів та масивів у state

State вважається read-only — **замінюйте**, а не мутуйте:

```js
// 🚩 Не мутуйте об'єкт у state:
form.firstName = 'Taylor';

// ✅ Замініть state новим об'єктом:
setForm({
  ...form,
  firstName: 'Taylor'
});
```

---

### Уникнення повторного створення початкового state

Передавайте функцію, а не результат її виклику:

```js
// ✅ Функція createInitialTodos запускається лише при ініціалізації
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
}
```

---

### Скидання state за допомогою key

Передайте інший `key` компоненту для скидання state:

```js
export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Скинути</button>
      <Form key={version} />
    </>
  );
}
```

---

## Вирішення проблем

### Оновив state, але логування показує старе значення

```js
function handleClick() {
  console.log(count);  // 0
  setCount(count + 1); // Запит повторного рендеру з 1
  console.log(count);  // Все ще 0!
}
```

Збережіть наступний state у змінній:

```js
const nextCount = count + 1;
setCount(nextCount);
console.log(nextCount); // 1
```

### Оновив state, але екран не оновлюється

React ігнорує оновлення, якщо state не змінився (`Object.is`):

```js
obj.x = 10;  // 🚩 Мутація
setObj(obj); // Нічого не відбувається

// ✅ Створення нового об'єкта
setObj({ ...obj, x: 10 });
```

### Помилка "Too many re-renders"

Зазвичай означає безумовне встановлення state під час рендеру:

```js
// 🚩 Неправильно: викликає обробник під час рендеру
return <button onClick={handleClick()}>Натисни</button>

// ✅ Правильно: передає обробник
return <button onClick={handleClick}>Натисни</button>

// ✅ Правильно: передає inline функцію
return <button onClick={(e) => handleClick(e)}>Натисни</button>
```

### Намагаюся встановити state у функцію, але вона викликається

Не можна зберегти функцію в state напряму — React трактує її як ініціалізатор/оновлювач:

```js
// 🚩 React спробує викликати функцію
const [fn, setFn] = useState(someFunction);

// ✅ Обгорніть у стрілочну функцію
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```

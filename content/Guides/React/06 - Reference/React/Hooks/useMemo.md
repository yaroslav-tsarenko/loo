# useMemo

## Вступ

`useMemo` — це React Hook, який дозволяє кешувати результат обчислення між повторними рендерами.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

> **Примітка:** React Compiler автоматично мемоїзує значення та функції, зменшуючи потребу в ручних викликах `useMemo`.

---

## Довідка

### `useMemo(calculateValue, dependencies)`

Викликайте `useMemo` на верхньому рівні компонента для кешування обчислення:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

#### Параметри

* **`calculateValue`**: Функція обчислення значення для кешування. Має бути чистою, без аргументів, повертати значення будь-якого типу. React викличе функцію під час початкового рендеру. При наступних рендерах React поверне те саме значення, якщо `dependencies` не змінилися. Інакше викличе `calculateValue` знову.

* **`dependencies`**: Список реактивних значень, на які посилається код `calculateValue`. React порівнює кожну залежність за допомогою `Object.is`.

#### Повертає

При початковому рендері `useMemo` повертає результат виклику `calculateValue`.

При наступних рендерах або повертає збережене значення (якщо залежності не змінилися), або викликає `calculateValue` знову.

#### Застереження

* `useMemo` — це Hook, тому його можна викликати лише на верхньому рівні компонента.
* У Strict Mode React **викличе функцію обчислення двічі** для пошуку випадкових нечистот.
* React **не відкидатиме кешоване значення без конкретної причини.** Але може відкинути при призупиненні під час монтування або у майбутніх оптимізаціях.

---

## Використання

### Пропуск дорогих обчислень

```js
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo` кешує результат обчислення між повторними рендерами, поки залежності не зміняться.

#### Коли це корисно

За замовчуванням React повторно запускає все тіло компонента при кожному повторному рендері. Зазвичай це не проблема, оскільки більшість обчислень дуже швидкі. Але якщо ви фільтруєте великий масив або виконуєте дороге обчислення, можна пропустити повторне обчислення.

#### Як визначити, чи обчислення дороге

```js
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Якщо загальний час перевищує `1ms`, може мати сенс мемоїзувати обчислення.

#### Чи потрібно додавати useMemo скрізь?

Оптимізація з `useMemo` корисна лише в кількох випадках:

- Обчислення помітно повільне, а залежності рідко змінюються.
- Ви передаєте значення як prop компоненту, обгорнутому в `memo`.
- Значення використовується як залежність іншого Hook.

---

### Пропуск повторного рендерингу компонентів

Коли ви передаєте результат обчислення як prop дочірньому компоненту, обгорнутому в `memo`, `useMemo` гарантує стабільність посилання:

```js
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

Без `useMemo` функція `filterTodos` завжди створює *інший* масив, тому `memo` для `List` не працюватиме.

---

### Запобігання занадто частому спрацюванню Effect

Замість використання об'єкта як залежності Effect, створіть об'єкт всередині Effect:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ Не потрібен useMemo або залежність від об'єкта!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Змінюється лише при зміні roomId
  // ...
}
```

---

### Мемоїзація функції

Щоб мемоїзувати функцію, використовуйте `useCallback` — він спеціально для цього:

```js
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

---

## Вирішення проблем

### Обчислення запускається двічі при кожному рендері

У Strict Mode React викликає деякі функції двічі — це очікувана поведінка для пошуку нечистот.

### `useMemo` має повертати об'єкт, але повертає undefined

```js
// 🔴 Не працює — `() => {` починає тіло стрілочної функції
const searchOptions = useMemo(() => {
  matchMode: 'whole-word',
  text: text
}, [text]);

// ✅ Працює — явний return
const searchOptions = useMemo(() => {
  return {
    matchMode: 'whole-word',
    text: text
  };
}, [text]);
```

### Потрібно викликати useMemo для кожного елемента списку

Виділіть компонент для кожного елемента:

```js
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Виклик useMemo на верхньому рівні:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

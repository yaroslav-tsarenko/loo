# useCallback

## Огляд

`useCallback` — це React Hook, який дозволяє кешувати визначення функції між повторними рендерами.

```js
const cachedFn = useCallback(fn, dependencies)
```

> **Примітка щодо React Compiler:** [React Compiler](/learn/react-compiler) автоматично мемоїзує значення та функції, зменшуючи потребу в ручних викликах `useCallback`.

---

## Довідка

### `useCallback(fn, dependencies)`

Викликайте `useCallback` на верхньому рівні вашого компонента для кешування визначення функції між повторними рендерами:

```js
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

#### Параметри

* **`fn`**: Значення функції, яке ви хочете кешувати. Може приймати будь-які аргументи та повертати будь-які значення. React поверне (не викличе!) вашу функцію під час початкового рендеру. При наступних рендерах React поверне ту саму функцію, якщо `dependencies` не змінилися з останнього рендеру. В іншому випадку він поверне функцію, передану під час поточного рендеру, та збереже її для можливого повторного використання.

* **`dependencies`**: Список усіх реактивних значень, на які посилається код `fn`. Реактивні значення включають props, state та всі змінні й функції, оголошені безпосередньо в тілі компонента. Лінтер перевірить, що кожне реактивне значення правильно вказане як залежність. Список залежностей повинен мати постійну кількість елементів і бути записаний inline як `[dep1, dep2, dep3]`. React порівнює кожну залежність з попереднім значенням за допомогою алгоритму [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Повертає

При початковому рендері `useCallback` повертає передану функцію `fn`.

При наступних рендерах він або поверне вже збережену функцію `fn` з останнього рендеру (якщо залежності не змінилися), або поверне функцію `fn`, передану під час поточного рендеру.

#### Застереження

* `useCallback` — це Hook, тому ви можете викликати його тільки **на верхньому рівні компонента** або власних Hooks. Не можна викликати всередині циклів або умов.
* React **не відкидатиме кешовану функцію без конкретної причини.** Наприклад, у режимі розробки React відкидає кеш при редагуванні файлу компонента. І в розробці, і в продакшені React відкидає кеш, якщо компонент призупиняється під час початкового монтування.

---

## Використання

### Пропуск повторного рендерингу компонентів

Коли ви оптимізуєте продуктивність рендерингу, іноді потрібно кешувати функції, які передаються дочірнім компонентам.

```js
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Вам потрібно передати дві речі до `useCallback`:

1. Визначення функції, яке ви хочете кешувати між повторними рендерами.
2. Список залежностей, що включає кожне значення в компоненті, яке використовується всередині функції.

**За замовчуванням, коли компонент повторно рендериться, React повторно рендерить усіх його нащадків рекурсивно.** Тому, коли `ProductPage` рендериться з іншою `theme`, компонент `ShippingForm` *також* повторно рендериться. Якщо ви підтвердили, що повторний рендеринг повільний, можна вказати `ShippingForm` пропустити повторний рендеринг, обгорнувши його в [`memo`](/reference/react/memo):

```js
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**В JavaScript `function () {}` або `() => {}` завжди створює _іншу_ функцію,** подібно до того, як літерал об'єкта `{}` завжди створює новий об'єкт. Це означає, що props `ShippingForm` ніколи не будуть однаковими, і оптимізація через `memo` не працюватиме. Тут `useCallback` стає корисним:

```js
function ProductPage({ productId, referrer, theme }) {
  // Вказуємо React кешувати функцію між повторними рендерами...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...поки ці залежності не зміняться...

  return (
    <div className={theme}>
      {/* ...ShippingForm отримає ті самі props і зможе пропустити повторний рендеринг */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

> **Примітка**: Покладайтеся на `useCallback` лише як на оптимізацію продуктивності. Якщо ваш код не працює без нього, знайдіть основну проблему та виправте її спочатку.

---

### Як useCallback пов'язаний з useMemo?

[`useMemo`](/reference/react/useMemo) та `useCallback` обидва дозволяють мемоїзувати (кешувати) щось, що ви передаєте далі:

```js
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Викликає функцію та кешує результат
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Кешує саму функцію
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

Різниця в тому, *що* вони дозволяють кешувати:

* **`useMemo` кешує *результат* виклику функції.**
* **`useCallback` кешує *саму функцію*.**

Спрощена реалізація:

```js
// Спрощена реалізація (всередині React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

---

### Чи потрібно додавати useCallback скрізь?

Кешування функції з `useCallback` корисне лише в кількох випадках:

- Ви передаєте її як prop компоненту, обгорнутому в [`memo`](/reference/react/memo).
- Функція використовується пізніше як залежність іншого Hook.

На практиці ви можете зробити багато мемоїзації непотрібною, дотримуючись кількох принципів:

1. Дозвольте компоненту приймати JSX як children.
2. Надавайте перевагу локальному state і не піднімайте state вище, ніж потрібно.
3. Тримайте логіку рендерингу чистою.
4. Уникайте непотрібних Effects, що оновлюють state.
5. Намагайтеся прибрати непотрібні залежності з ваших Effects.

---

### Оновлення state з мемоїзованого callback

Іноді потрібно оновити state на основі попереднього state з мемоїзованого callback. Замість додавання залежності, передайте функцію-оновлювач:

```js
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ Не потрібна залежність від todos
  // ...
}
```

---

### Запобігання занадто частому спрацюванню Effect

Іноді потрібно викликати функцію з Effect. Замість додавання функції як залежності, перемістіть її всередину Effect:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ Не потрібен useCallback або залежність від функції!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Змінюється лише при зміні roomId
  // ...
}
```

---

### Оптимізація власного Hook

Якщо ви пишете власний Hook, рекомендується обгортати будь-які функції, які він повертає, у `useCallback`:

```js
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

---

## Вирішення проблем

### При кожному рендері компонента useCallback повертає іншу функцію

Переконайтеся, що ви вказали масив залежностей як другий аргумент:

```js
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Повертає нову функцію кожного разу: немає масиву залежностей
  // ...
```

Виправлена версія:

```js
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Не повертає нову функцію без потреби
  // ...
```

### Мені потрібно викликати useCallback для кожного елемента списку в циклі

Не можна викликати `useCallback` у циклі. Замість цього виділіть компонент для кожного елемента:

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
  // ✅ Викликайте useCallback на верхньому рівні:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

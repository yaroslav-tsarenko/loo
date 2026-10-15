# `act`

## Огляд

`act` — це тестовий помічник, який застосовує очікувані оновлення React перед виконанням перевірок. Він забезпечує виконання тестів ближче до того, як React працює в браузері.

```js
await act(async actFn)
```

## Ключова концепція

Обгортайте код, що рендерить компоненти та виконує оновлення, у виклик `await act()` для підготовки компонентів до перевірок. Це відповідає шаблону [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert).

---

## Довідка

### `await act(async actFn)`

При написанні тестів UI такі задачі, як рендеринг, користувацькі події або отримання даних, є "одиницями" взаємодії з інтерфейсом користувача. `act()` забезпечує, що всі оновлення, пов'язані з цими одиницями, були оброблені та застосовані до DOM перед виконанням перевірок.

**Базовий приклад:**
```js
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

> **Важливо**: Завжди використовуйте `act` з `await` та `async` функцією. Синхронна версія не працює у всіх випадках і буде застарілою/видаленою в майбутньому.

### Параметри

- **`async actFn`**: Асинхронна функція, що обгортає рендери або взаємодії для компонентів, що тестуються. Оновлення, запущені всередині `actFn`, ставляться в чергу, об'єднуються та застосовуються до DOM. Оскільки функція асинхронна, React виконує код через асинхронні межі та скидає заплановані оновлення.

### Повертає

`act` не повертає нічого.

---

## Використання

### Рендеринг компонентів у тестах

Обгортайте рендеринг компонентів всередині `act()`:

```js
import { act } from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);

  // Рендеримо компонент всередині act().
  await act(async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

Це забезпечує, що компонент відрендерений і його ефекти застосовані перед виконанням перевірок.

### Відправка подій у тестах

Обгортайте відправку подій всередині `act()`:

```js
import { act } from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  await act(async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  // Відправляємо подію всередині act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

> **Увага**: Відправка DOM-подій працює лише коли DOM-контейнер додано до document. Розгляньте використання [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) для зменшення шаблонного коду.

### Приклад компонента

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

---

## Усунення проблем

### Помилка: "The current testing environment is not configured to support act(...)"

Використання `act` вимагає встановлення `global.IS_REACT_ACT_ENVIRONMENT=true` у вашому тестовому середовищі.

**Повідомлення про помилку:**
```
Warning: The current testing environment is not configured to support act(...)
```

**Рішення**: Додайте до глобального файлу налаштування для тестів React:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

> **Примітка**: Тестові фреймворки, такі як [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), автоматично встановлюють `IS_REACT_ACT_ENVIRONMENT`.

---

## Додаткові зауваження

- **Багатослівна альтернатива**: Якщо використання `act()` напряму здається надто багатослівним, розгляньте [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), чиї допоміжні функції обгорнуті в `act()`.
- **Асинхронна межа**: `act` виконує код через асинхронні межі та скидає всі заплановані оновлення.

# useEffectEvent

## Вступ

`useEffectEvent` — це React Hook, який дозволяє відокремити події від Effects.

```js
const onEvent = useEffectEvent(callback)
```

---

## Довідка

### `useEffectEvent(callback)`

Викликайте `useEffectEvent` на верхньому рівні компонента для створення Effect Event.

```js
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Підключено!', theme);
  });
}
```

Effect Events є частиною логіки вашого Effect, але поводяться більше як обробник подій. Вони завжди "бачать" останні значення з рендеру (props та state) без повторної синхронізації Effect, тому вони виключаються із залежностей Effect.

#### Параметри

* `callback`: Функція з логікою вашого Effect Event. Може приймати будь-яку кількість аргументів і повертати будь-яке значення. При виклику поверненої функції Effect Event, `callback` завжди має доступ до останніх закомічених значень з рендеру.

#### Повертає

`useEffectEvent` повертає функцію Effect Event з тією ж сигнатурою типу, що й ваш `callback`.

#### Застереження

* `useEffectEvent` — це Hook, тому його можна викликати лише **на верхньому рівні компонента** або власних Hooks.
* Effect Events можна викликати лише зсередини Effects або інших Effect Events. Не викликайте їх під час рендерингу та не передавайте іншим компонентам або Hooks.
* Функції Effect Event не мають стабільної ідентичності — вона навмисно змінюється при кожному рендері.

---

## Використання

### Використання події в Effect

Викликайте `useEffectEvent` на верхньому рівні компонента для створення *Effect Event*:

```js
const onConnected = useEffectEvent(() => {
  if (!muted) {
    showNotification('Підключено!');
  }
});
```

Потім викликайте його з Effect:

```js
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', onConnected);
  connection.connect();
  return () => {
    connection.disconnect();
  }
}, [roomId]);
```

Оскільки `onConnected` є Effect Event, `muted` не потрібно включати в залежності Effect.

> **Пастка:** Не використовуйте Effect Events для приховування залежностей. Якщо значення має спричиняти повторний запуск Effect, залиште його як залежність. Використовуйте Effect Events лише для логіки, яка дійсно не повинна перезапускати Effect.

---

### Використання таймера з останніми значеннями

Коли ви використовуєте `setInterval` або `setTimeout` в Effect, часто потрібно читати останні значення з рендеру без перезапуску таймера:

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(count + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Лічильник: {count}
        <button onClick={() => setCount(0)}>Скинути</button>
      </h1>
      <hr />
      <p>
        Щосекунди збільшувати на:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>-</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

Спробуйте змінити значення приросту, поки таймер працює. Лічильник одразу використовує нове значення, але таймер продовжує працювати плавно без перезапуску.

---

### Використання слухача подій з останніми значеннями

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox" checked={canMove}
          onChange={e => setCanMove(e.target.checked)} />
        Точці дозволено рухатися
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20, top: -20, width: 40, height: 40,
      }} />
    </>
  );
}
```

---

### Уникнення перепідключення до зовнішніх систем

Типовий випадок використання `useEffectEvent` — коли потрібно щось зробити у відповідь на Effect, але це "щось" залежить від значення, на яке ви не хочете реагувати:

```js
function ChatRoom({ roomId, muted }) {
  const onConnected = useEffectEvent((roomId) => {
    if (!muted) {
      showNotification('Підключено до ' + roomId);
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('connected', () => {
      onConnected(roomId);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Ласкаво просимо до кімнати {roomId}!</h1>;
}
```

---

### Використання Effect Events у власних Hooks

```js
function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

---

## Вирішення проблем

### Помилка: "A function wrapped in useEffectEvent can't be called during rendering"

Ви викликаєте функцію Effect Event під час фази рендерингу. Effect Events можна викликати лише зсередини Effects або інших Effect Events.

### Помилка лінтера: "Functions returned from useEffectEvent must not be included in the dependency array"

Видаліть Effect Event із залежностей:

```js
// ✅ Правильно: без Effect Event у залежностях
useEffect(() => {
  onSomething();
}, []);
```

### Помилка лінтера: "... can only be called from Effects"

Ви викликаєте функцію Effect Event не з Effect. Для обробників подій або передачі дочірнім компонентам використовуйте звичайну функцію або `useCallback`.

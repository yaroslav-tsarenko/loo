# Escape Hatches (Аварійні виходи)

## Вступ

Деякі компоненти потребують контролю та синхронізації з системами поза React. Наприклад:
- Фокусування input за допомогою браузерного API
- Відтворення/зупинка відеоплеєра, реалізованого без React
- Підключення та прослуховування повідомлень з віддаленого сервера

Цей розділ охоплює "аварійні виходи" (escape hatches), які дозволяють вийти за межі React та підключитися до зовнішніх систем. Однак більшість логіки застосунку та потоку даних не повинні залежати від цих можливостей.

## Цілі навчання

Ви дізнаєтесь:
- Як "запам'ятовувати" інформацію без повторного рендерингу
- Як отримати доступ до DOM-елементів, керованих React
- Як синхронізувати компоненти із зовнішніми системами
- Як видалити непотрібні Effects з компонентів
- Чим життєвий цикл Effect відрізняється від життєвого циклу компонента
- Як запобігти повторному запуску Effects через зміну значень
- Як зменшити частоту повторного запуску Effects
- Як ділитися логікою між компонентами

---

## Посилання на значення за допомогою Refs

Коли компоненту потрібно "запам'ятати" інформацію без запуску повторного рендерингу, використовуйте **ref**:

```js
const ref = useRef(0);
```

**Ключові відмінності від state:**
- Як і state, refs зберігаються між повторними рендерингами
- Встановлення state запускає повторний рендеринг; зміна ref НЕ запускає
- Доступ до поточного значення через `ref.current`

### Приклад: Лічильник без повторного рендерингу

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Ви натиснули ' + ref.current + ' разів!');
  }

  return (
    <button onClick={handleClick}>
      Натисніть мене!
    </button>
  );
}
```

**Випадки використання refs:**
- Зберігання ідентифікаторів таймерів (timeout ID)
- Зберігання DOM-елементів
- Зберігання інших об'єктів, які не впливають на результат рендерингу

---

## Маніпулювання DOM за допомогою Refs

React автоматично оновлює DOM відповідно до результату рендерингу, але іноді потрібен прямий доступ для:
- Фокусування на вузлі
- Прокручування до нього
- Вимірювання розміру та положення

Вбудованого способу зробити це в React немає, тому використовуйте ref до DOM-вузла.

### Приклад: Фокусування Input

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Сфокусувати input
      </button>
    </>
  );
}
```

---

## Синхронізація з Effects

**Effects** дозволяють виконувати код після рендерингу для синхронізації компонентів із зовнішніми системами. На відміну від обробників подій, які реагують на конкретні взаємодії, Effects запускаються після рендерингу для підтримки синхронізації компонента.

### Приклад: Синхронізація відеоплеєра

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Пауза' : 'Відтворити'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

### Функції очищення

Багато Effects потребують очищення. Поверніть функцію очищення, щоб вказати React, як відключитися:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Ласкаво просимо до чату!</h1>;
}
```

> **Примітка:** У режимі розробки React запускає та очищує ваш Effect один додатковий раз, щоб переконатися, що очищення реалізовано правильно.

---

## Можливо, вам не потрібен Effect

Effects -- це аварійний вихід. Не використовуйте їх для:
1. **Перетворення даних для рендерингу** -- обчислюйте під час рендерингу
2. **Обробки подій користувача** -- використовуйте обробники подій

### Антипатерн: Непотрібний Effect

```js
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // Уникайте: зайвий state та непотрібний Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
}
```

### Кращий підхід: Обчислення під час рендерингу

```js
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // Добре: обчислено під час рендерингу
  const fullName = firstName + ' ' + lastName;
}
```

---

## Життєвий цикл реактивних Effects

Effects мають інший життєвий цикл, ніж компоненти:
- Компоненти: монтування -> оновлення -> демонтування
- Effects: почати синхронізацію -> зупинити синхронізацію (може повторюватися багато разів)

### Повторна синхронізація на основі залежностей

Effects повторно синхронізуються при зміні залежностей. Цей приклад перепідключається, якщо `roomId` змінюється:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Ласкаво просимо до кімнати {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Оберіть кімнату чату:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

Лінтер React автоматично перевіряє, чи правильно вказані залежності.

---

## Відокремлення подій від Effects

**Обробники подій:** повторно запускаються лише при повторенні тієї самої взаємодії
**Effects:** повторно синхронізуються при зміні будь-якого прочитаного реактивного значення

Іноді потрібна змішана поведінка. Використовуйте **Effect Events** для відокремлення нереактивного коду:

### Проблема: Небажана повторна синхронізація

```js
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Підключено!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);  // Перепідключається при зміні theme!

  return <h1>Ласкаво просимо до кімнати {roomId}!</h1>
}
```

### Рішення: Використання `useEffectEvent`

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Підключено!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);  // Залежить лише від roomId

  return <h1>Ласкаво просимо до кімнати {roomId}!</h1>
}
```

Код всередині Effect Events не є реактивним, що запобігає непотрібним перепідключенням.

---

## Видалення залежностей Effect

Лінтер перевіряє, що всі реактивні значення, використані в Effect, включені до списку залежностей. Непотрібні залежності змушують Effects запускатися занадто часто або створювати нескінченні цикли.

### Проблема: Непотрібна залежність

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);  // Перестворюється при кожному натисканні клавіші!

  return (
    <>
      <h1>Ласкаво просимо до кімнати {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}
```

### Рішення: Перенесення коду всередину Effect

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);  // Залежить лише від roomId

  return (
    <>
      <h1>Ласкаво просимо до кімнати {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}
```

**Ключовий принцип:** Не видаляйте залежності довільно. Змініть навколишній код так, щоб залежність стала непотрібною.

---

## Повторне використання логіки за допомогою користувацьких Hooks

React надає вбудовані Hooks (`useState`, `useContext`, `useEffect`). Для специфічних потреб створюйте користувацькі Hooks.

### Приклад: Користувацькі Hooks для відстеження курсора

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

### Реалізація `usePointerPosition`

```js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

### Реалізація `useDelayedValue`

```js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

**Переваги:**
- Повторне використання логіки між компонентами
- Композиція користувацьких Hooks
- Спільне використання логіки через спільноту

---

## Наступні кроки

Почніть з [[Referencing Values with Refs]], щоб читати цей розділ сторінка за сторінкою.

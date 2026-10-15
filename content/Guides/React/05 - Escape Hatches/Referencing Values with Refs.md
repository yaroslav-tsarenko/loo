# Посилання на значення за допомогою Refs

## Вступ

Refs дозволяють компонентам "запам'ятовувати" інформацію без запуску повторного рендерингу. Вони корисні, коли потрібно зберігати значення, що не впливають на результат рендерингу.

## Додавання Ref до компонента

Імпортуйте `useRef` з React:

```js
import { useRef } from 'react';
```

Викличте `useRef` з початковим значенням всередині компонента:

```js
const ref = useRef(0);
```

`useRef` повертає об'єкт із властивістю `current`:

```js
{
  current: 0 // Значення, яке ви передали в useRef
}
```

Доступ до значення та його зміна здійснюються через `ref.current`. Це значення є мутабельним і навмисно не відстежується React, що робить його "аварійним виходом" з одностороннього потоку даних React.

### Приклад: Базовий лічильник з Ref

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

**Ключова відмінність**: Компонент не перерендерюється при зміні ref. Як і state, refs зберігаються між повторними рендерингами, але зміна ref не запускає повторний рендеринг.

## Приклад: Створення секундоміра

### Використання State для даних рендерингу

Для інформації, що використовується при рендерингу, зберігайте її в state:

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

### Використання Refs для даних, не пов'язаних з рендерингом

Для ідентифікаторів інтервалів (потрібних обробникам подій, але не для рендерингу) використовуйте ref:

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Минуло часу: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Старт
      </button>
      <button onClick={handleStop}>
        Стоп
      </button>
    </>
  );
}
```

**Правило**: Зберігайте інформацію, що використовується для рендерингу, в state. Зберігайте інформацію, потрібну лише обробникам подій, в refs.

## Відмінності між Refs та State

| Аспект | Refs | State |
|--------|------|-------|
| Значення, що повертається | `{ current: initialValue }` | Поточне значення та функція-сеттер `[value, setValue]` |
| Запуск повторного рендерингу | Не запускає повторний рендеринг | Запускає повторний рендеринг при зміні |
| Мутабельність | Мутабельний -- змінюйте `current` напряму | "Іммутабельний" -- використовуйте функцію-сеттер |
| Час читання | Не читайте під час рендерингу | Можна читати будь-коли; кожен рендеринг має свій знімок |

### Лічильник зі State (правильно)

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Ви натиснули {count} разів
    </button>
  );
}
```

### Лічильник з Ref (зламаний)

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Це не перерендерює компонент!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      Ви натиснули {countRef.current} разів
    </button>
  );
}
```

Версія з ref ніколи не відображає оновлений лічильник, тому що не відбувається повторний рендеринг.

## Як useRef працює всередині

`useRef` теоретично може бути реалізований як:

```js
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

React зберігає той самий об'єкт між рендерингами, тому `useRef` завжди повертає той самий об'єкт. Сеттер state не використовується, оскільки refs не потребують запуску повторного рендерингу.

## Коли використовувати Refs

Refs призначені для випадків, коли компоненту потрібно "вийти за межі" React та комунікувати із зовнішніми API:

- Зберігання ідентифікаторів таймерів
- Зберігання та маніпулювання DOM-елементами
- Зберігання об'єктів, непотрібних для обчислення JSX

Використовуйте refs, коли потрібно зберігати значення, що не впливає на логіку рендерингу.

## Найкращі практики для Refs

1. **Розглядайте refs як аварійний вихід**: Використовуйте їх помірно. Якщо логіка вашого застосунку сильно залежить від refs, переосмисліть підхід.

2. **Не читайте та не записуйте `ref.current` під час рендерингу**: Це робить поведінку компонента непередбачуваною. Використовуйте state. Виняток: код на кшталт `if (!ref.current) ref.current = new Thing()`, який встановлює ref один раз при першому рендерингу.

3. **Refs -- це звичайні JavaScript-об'єкти**: Вони мутуються миттєво без поведінки знімків state:

```js
ref.current = 5;
console.log(ref.current); // 5 (миттєво)
```

4. **Відсутність проблем з мутацією**: На відміну від state, вам не потрібно уникати мутації refs, якщо об'єкт не використовується для рендерингу.

## Refs та DOM

Найпоширеніший випадок використання refs -- доступ до DOM-елементів. Передайте ref в атрибут `ref`:

```jsx
<div ref={myRef}>
```

React поміщає відповідний DOM-елемент у `myRef.current`. Коли елемент видаляється, React оновлює `myRef.current` до `null`. (Детальніше див. [[Manipulating the DOM with Refs]].)

## Підсумок

- Refs зберігають значення, що не використовуються для рендерингу, без запуску повторного рендерингу
- Ref -- це звичайний JavaScript-об'єкт із властивістю `current`
- Викличте Hook `useRef`, щоб створити ref
- Як і state, refs зберігають інформацію між повторними рендерингами
- На відміну від state, зміна ref не запускає повторний рендеринг
- Не читайте/записуйте `ref.current` під час рендерингу

---

## Завдання та рішення

### Завдання 1: Виправити зламаний чат

**Проблема**: Змінна `timeoutID` не зберігається між повторними рендерингами, оскільки локальні змінні ініціалізуються заново при кожному рендерингу.

**Рішення**: Зберігайте ідентифікатор таймера в ref:

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Відправлено!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button disabled={isSending} onClick={handleSend}>
        {isSending ? 'Відправка...' : 'Відправити'}
      </button>
      {isSending && <button onClick={handleUndo}>Скасувати</button>}
    </>
  );
}
```

### Завдання 2: Виправити компонент, що не перерендерюється

**Проблема**: Використання значення ref у результаті рендерингу (`{isOnRef.current ? 'Увімк' : 'Вимк'}`) означає, що компонент ніколи не перерендерюється.

**Рішення**: Використовуйте state:

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'Увімк' : 'Вимк'}
    </button>
  );
}
```

### Завдання 3: Виправити дебаунсинг

**Проблема**: Спільна змінна `timeoutID` між усіма компонентами кнопок спричиняє конфлікти.

**Рішення**: Використовуйте окремі refs для кожного компонента:

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Космічний корабель запущено!')}
      >
        Запустити космічний корабель
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Суп закипів!')}
      >
        Зварити суп
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Колискова заспівана!')}
      >
        Заспівати колискову
      </DebouncedButton>
    </>
  )
}
```

### Завдання 4: Читання останнього state

**Проблема**: Асинхронні операції захоплюють state як знімок на момент виклику, а не на момент виконання.

**Рішення**: Використовуйте одночасно state (для рендерингу) та ref (для читання останнього значення):

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Відправка: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button onClick={handleSend}>
        Відправити
      </button>
    </>
  );
}
```

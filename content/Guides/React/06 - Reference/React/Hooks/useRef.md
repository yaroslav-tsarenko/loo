# useRef

## Вступ

`useRef` — це React Hook, який дозволяє посилатися на значення, яке не потрібне для рендерингу.

```js
const ref = useRef(initialValue)
```

---

## Довідка

### `useRef(initialValue)`

Викликайте `useRef` на верхньому рівні компонента для оголошення ref.

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
}
```

#### Параметри

* `initialValue`: Значення, яким ви хочете ініціалізувати властивість `current` об'єкта ref. Може бути будь-якого типу. Цей аргумент ігнорується після початкового рендеру.

#### Повертає

`useRef` повертає об'єкт з однією властивістю:

* `current`: Спочатку встановлена на `initialValue`. Пізніше можна змінити. При передачі об'єкта ref як атрибуту `ref` JSX-вузлу, React встановить його `current`.

При наступних рендерах `useRef` поверне той самий об'єкт.

#### Застереження

* Ви можете мутувати `ref.current`. На відміну від state, він є мутабельним.
* Зміна `ref.current` **не викликає повторний рендер.**
* Не записуйте та не читайте `ref.current` під час рендерингу, окрім ініціалізації.

---

## Використання

### Посилання на значення через ref

```js
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
}
```

`useRef` повертає об'єкт ref з однією властивістю `current`. Зміна ref **не викликає повторний рендер**, що робить refs ідеальними для зберігання інформації, яка не впливає на візуальний вивід.

```js
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}

function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Використовуючи ref, ви гарантуєте:

- **Зберігання інформації** між повторними рендерами (на відміну від звичайних змінних).
- Зміна **не викликає повторний рендер** (на відміну від state).
- Інформація **локальна** для кожної копії компонента.

#### Приклад: Секундомір

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
      <h1>Пройшло часу: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>Старт</button>
      <button onClick={handleStop}>Стоп</button>
    </>
  );
}
```

> **Важливо:** Не читайте та не записуйте refs під час рендерингу. React очікує, що тіло компонента поводиться як чиста функція. Читайте/записуйте refs в обробниках подій або Effects.

---

### Маніпулювання DOM через ref

```js
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
  return <input ref={inputRef} />;
}
```

Після створення DOM-вузла React встановить `current` вашого об'єкта ref на цей вузол:

```js
function handleClick() {
  inputRef.current.focus();
}
```

React встановить `current` назад у `null`, коли вузол буде видалено з екрана.

#### Приклад: Фокусування текстового поля

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
        Фокус на поле введення
      </button>
    </>
  );
}
```

#### Відкриття ref для власного компонента

Додайте `ref` до списку props і передайте його дочірньому вбудованому компоненту:

```js
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
}
```

---

### Уникнення повторного створення вмісту ref

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
}
```

Хоча запис `ref.current` під час рендеру зазвичай заборонений, тут це прийнятно, оскільки результат завжди однаковий і умова виконується лише під час ініціалізації.

---

## Вирішення проблем

### Не можу отримати ref до власного компонента

За замовчуванням компоненти не відкривають refs до своїх DOM-вузлів. Додайте `ref` до списку props компонента:

```js
function MyInput({ value, onChange, ref }) {
  return (
    <input value={value} onChange={onChange} ref={ref} />
  );
}
```

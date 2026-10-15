# flushSync

## Огляд

`flushSync` дозволяє примусити React виконати всі оновлення всередині наданого callback синхронно. Це гарантує негайне оновлення DOM.

```js
flushSync(callback)
```

> **Підводний камінь**: Використання `flushSync` є нетиповим і може погіршити продуктивність вашого застосунку.

---

## Довідка

### `flushSync(callback)`

Викличте `flushSync`, щоб примусити React виконати будь-яку очікувану роботу та оновити DOM синхронно.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

У більшості випадків `flushSync` можна уникнути. Використовуйте `flushSync` як крайній засіб.

#### Параметри

- `callback`: Функція. React негайно викличе цей callback та синхронно виконає всі оновлення, що містяться в ньому. Також може виконати будь-які очікувані оновлення, Effects або оновлення всередині Effects. Якщо оновлення призводить до suspend внаслідок цього виклику `flushSync`, fallbacks можуть бути показані повторно.

#### Повертає

`flushSync` повертає `undefined`.

#### Застереження

- `flushSync` може значно погіршити продуктивність. Використовуйте рідко.
- `flushSync` може примусити очікувані Suspense boundaries показати свій `fallback` стан.
- `flushSync` може виконати очікувані Effects та синхронно застосувати оновлення перед поверненням.
- `flushSync` може виконати оновлення поза callback, якщо це необхідно для виконання оновлень всередині callback.

---

## Використання

### Синхронне виконання оновлень для інтеграції з третіми сторонами

При інтеграції з кодом третіх сторін, таким як браузерні API або UI-бібліотеки, може бути необхідно примусити React синхронно виконати оновлення:

```js
flushSync(() => {
  setSomething(123);
});
// На цьому рядку DOM вже оновлений.
```

**Використання `flushSync` є нетиповим, і часте використання може значно погіршити продуктивність вашого застосунку.** Якщо ваш застосунок використовує лише React API та не інтегрується з бібліотеками третіх сторін, `flushSync` не потрібен.

#### Приклад: Браузерний API `onbeforeprint`

Браузерний API `onbeforeprint` дозволяє змінити сторінку безпосередньо перед відкриттям діалогу друку. Це корисно для застосування стилів друку:

```js
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

Без `flushSync` діалог друку відобразить `isPrinting` як "no", тому що React пакетно обробляє оновлення асинхронно, і діалог друку відображається до оновлення стану.

---

## Усунення проблем

### Помилка: "flushSync was called from inside a lifecycle method"

React не може виконати `flushSync` посеред рендерингу. Це стосується виклику `flushSync` всередині:
- Рендерингу компонента
- Hooks `useLayoutEffect` або `useEffect`
- Lifecycle-методів класових компонентів

**Неправильно — виклик `flushSync` в Effect:**
```js
useEffect(() => {
  // Неправильно
  flushSync(() => {
    setSomething(newValue);
  });
}, []);
```

**Правильно — виклик в обробниках подій:**
```js
function handleClick() {
  // Правильно: flushSync в обробниках подій безпечний
  flushSync(() => {
    setSomething(newValue);
  });
}
```

**Альтернатива — відкладення до microtask:**
```js
useEffect(() => {
  // Правильно: відкладення flushSync до microtask
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

> **Підводний камінь**: `flushSync` може значно погіршити продуктивність, і цей конкретний патерн ще гірший для продуктивності. Вичерпайте всі інші варіанти перед використанням `flushSync` в microtask.

# 'use client'

## Огляд

`'use client'` — це директива, що використовується з React Server Components для позначення коду, який виконується на клієнті. Вона дозволяє позначити файл та його транзитивні залежності як клієнтський код.

## Довідка

### Директива `'use client'`

Додайте `'use client'` на початку файлу, щоб позначити модуль та його транзитивні залежності як клієнтський код:

```js
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Коли файл, позначений `'use client'`, імпортується з Server Component, сумісні бандлери розглядають імпорт модуля як межу між серверним та клієнтським кодом. Як залежності `RichTextEditor`, і `formatDate`, і `Button` будуть обчислені на клієнті, незалежно від того, чи містять їхні модулі директиву `'use client'`. Один модуль може бути обчислений на сервері при імпорті з серверного коду та на клієнті при імпорті з клієнтського коду.

#### Застереження

- `'use client'` повинен бути на самому початку файлу, перед будь-якими імпортами або іншим кодом (коментарі допускаються). Повинні використовуватися одинарні або подвійні лапки, не зворотні.
- Коли модуль `'use client'` імпортується з іншого клієнтського модуля, директива не має ефекту.
- Коли модуль компонента містить директиву `'use client'`, будь-яке використання цього компонента гарантовано є Client Component. Однак компонент все ще може бути обчислений на клієнті навіть без директиви.
  - Використання компонента є Client Component, якщо визначене в модулі з `'use client'` або коли воно є транзитивною залежністю такого модуля. Інакше це Server Component.
- Весь код у піддереві Client модуля відправляється та виконується клієнтом, не лише компоненти.
- Коли серверний модуль імпортує значення з модуля `'use client'`, значення повинні бути React компонентами або підтримуваними серіалізованими значеннями props. Будь-яке інше використання викидає виняток.

### Як `'use client'` позначає клієнтський код

У додатках React Server Components компоненти розділені на окремі файли/модулі. Додатки, що використовують React Server Components, рендеряться на сервері за замовчуванням. `'use client'` вводить межу сервер-клієнт у дереві залежностей модулів, створюючи піддерево Client модулів.

**Приклад дерева залежностей модулів:**

```
App.js (Server)
├── Copyright.js (Server)
├── FancyText.js (Server)
└── InspirationGenerator.js (Client - 'use client')
    ├── FancyText.js (Client при використанні тут)
    └── inspirations.js (Client)
```

Фреймворк серверно рендерить кореневий компонент та продовжує через дерево рендерингу, відмовляючись від обчислення будь-якого коду, імпортованого з клієнтського позначеного коду. Серверно відрендерена частина відправляється клієнту, який потім завершує рендеринг з завантаженим клієнтським кодом.

#### Ключові визначення

- **Client Components**: Компоненти в дереві рендерингу, що рендеряться на клієнті.
- **Server Components**: Компоненти в дереві рендерингу, що рендеряться на сервері.

#### Важливо: Як один компонент може бути і Server, і Client Component

Термін "компонент" може означати:
1. **Визначення** компонента (функція)
2. **Використання** компонента (виклик компонента)

Коли ми обговорюємо Server/Client Components, ми маємо на увазі **використання компонентів**:
- Якщо визначений у модулі з `'use client'` або імпортований/викликаний в Client Component → Client Component
- Інакше → Server Component

**Висновок**: Відносини батько-дитина в дереві рендерингу не гарантують одне і те ж середовище рендерингу.

### Коли використовувати `'use client'`

Server Components є типом за замовчуванням. Позначайте код як клієнтський, коли це потрібно.

#### Переваги Server Components

- Зменшують код, відправлений та виконуваний клієнтом — лише Client модулі бандляться та обчислюються.
- Користуються серверними ресурсами: доступ до локальної файлової системи, отримання даних з низькою затримкою та мережеві запити.

#### Обмеження Server Components

- **Не можуть підтримувати інтерактивність**: Event handlers повинні реєструватися/спрацьовувати на клієнті.
  - Наприклад: `onClick` може бути визначений лише в Client Components.
- **Не можуть використовувати більшість хуків**: Server Components не зберігаються в пам'яті після рендерингу і не можуть мати стан.

### Серіалізовані типи для Server-to-Client Props

Значення props, передані з Server Components до Client Components, повинні бути серіалізованими.

#### Підтримувані серіалізовані Props

**Примітиви:**
- `string`, `number`, `bigint`, `boolean`, `undefined`, `null`
- `symbol` (лише глобально зареєстровані через `Symbol.for()`)

**Iterable з серіалізованими значеннями:**
- `String`, `Array`, `Map`, `Set`, `TypedArray`, `ArrayBuffer`

**Об'єкти та функції:**
- `Date`
- Прості об'єкти з серіалізованими властивостями
- Server Functions
- Елементи Client або Server Component (JSX)
- `Promise`

#### НЕ підтримуються

- Звичайні функції (якщо не експортовані з клієнтських модулів або позначені `'use server'`)
- Класи
- Екземпляри класів (крім вбудованих)
- Об'єкти з null prototype
- Не глобально зареєстровані символи (наприклад, `Symbol('my new symbol')`)

## Використання

### Побудова з інтерактивністю та станом

```js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

Компоненти, що потребують хук `useState` та event handlers, повинні бути Client Components з директивою `'use client'`.

**Приклад батьківського компонента (Server Component):**

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

`CounterContainer` не потребує `'use client'`, оскільки він неінтерактивний та не використовує стан. Він повинен бути Server Component для читання з локальної файлової системи.

**Агностичні компоненти:**

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

Компоненти без серверних/клієнтських можливостей не потребують директиви. Їхній вивід (не вихідний код) відправляється браузерам, дозволяючи використовувати їх як Server або Client Components залежно від контексту.

### Використання клієнтських API

Компоненти, що використовують API лише для браузера, повинні бути позначені як Client Components:

```js
'use client';

import {useRef, useLayoutEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Використання сторонніх бібліотек

Сторонні бібліотеки, що використовують наступне, повинні виконуватися на клієнті:
- `createContext`
- Хуки React/React-DOM (крім `use` та `useId`)
- `forwardRef`, `memo`, `startTransition`
- Клієнтські API (маніпуляція DOM, нативні перегляди платформи)

Якщо бібліотеки вже підтримують React Server Components, вони включають маркери `'use client'`. В іншому випадку створіть обгортку Client Component між стороннім Client Component та вашим Server Component.

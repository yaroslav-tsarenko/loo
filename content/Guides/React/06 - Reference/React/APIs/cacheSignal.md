# cacheSignal

`cacheSignal` — це функція React, яка дозволяє дізнатися, коли час життя `cache()` закінчився. Наразі використовується лише з React Server Components.

```js
const signal = cacheSignal();
```

## Довідка

### `cacheSignal`

Викликайте `cacheSignal`, щоб отримати `AbortSignal`.

```js
import {cacheSignal} from 'react';
async function Component() {
  await fetch(url, { signal: cacheSignal() });
}
```

Коли React завершить рендеринг, `AbortSignal` буде скасовано. Це дозволяє скасувати будь-яку роботу в процесі виконання, яка більше не потрібна.

Рендеринг вважається завершеним, коли:
- React успішно завершив рендеринг
- рендеринг було перервано
- рендеринг завершився помилкою

#### Параметри

Ця функція не приймає жодних параметрів.

#### Повертає

`cacheSignal` повертає `AbortSignal`, якщо викликається під час рендерингу. В іншому випадку `cacheSignal()` повертає `null`.

#### Застереження

- `cacheSignal` наразі призначений для використання лише в React Server Components. У Client Components він завжди повертатиме `null`. У майбутньому він також буде використовуватися для Client Component, коли клієнтський cache оновлюється або стає недійсним. Не слід припускати, що на клієнті він завжди буде `null`.
- Якщо викликається поза рендерингом, `cacheSignal` поверне `null`, щоб чітко показати, що поточна область видимості не кешується назавжди.

## Використання

### Скасування запитів у процесі виконання

Викликайте `cacheSignal`, щоб скасувати запити в процесі виконання.

```js
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);
async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

> **Підводний камінь:** Ви не можете використовувати `cacheSignal` для скасування асинхронної роботи, яка була розпочата поза рендерингом:

```js
import {cacheSignal} from 'react';
// 🚩 Підводний камінь: Запит фактично не буде скасовано,
// якщо рендеринг `Component` завершено.
const response = fetch(url, { signal: cacheSignal() });
async function Component() {
  await response;
}
```

### Ігнорування помилок після завершення рендерингу React

Якщо функція кидає виняток, це може бути через скасування (наприклад, з'єднання з базою даних було закрито). Ви можете використовувати властивість `aborted`, щоб перевірити, чи помилка була спричинена скасуванням або є реальною помилкою. Ви можете ігнорувати помилки, спричинені скасуванням.

```js
import {cacheSignal} from "react";
import {queryDatabase, logError} from "./database";

async function getData(id) {
  try {
     return await queryDatabase(id);
  } catch (x) {
     if (!cacheSignal()?.aborted) {
        // логуємо тільки якщо це реальна помилка, а не через скасування
       logError(x);
     }
     return null;
  }
}

async function Component({id}) {
  const data = await getData(id);
  if (data === null) {
    return <div>No data available</div>;
  }
  return <div>{data.name}</div>;
}
```

# captureOwnerStack

`captureOwnerStack` зчитує поточний Owner Stack у режимі розробки та повертає його як рядок, якщо він доступний.

```js
const stack = captureOwnerStack();
```

## Довідка

### `captureOwnerStack()`

Викликайте `captureOwnerStack`, щоб отримати поточний Owner Stack.

```js
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Параметри

`captureOwnerStack` не приймає жодних параметрів.

#### Повертає

`captureOwnerStack` повертає `string | null`.

Owner Stacks доступні в:
- Рендері компонента
- Effects (наприклад, `useEffect`)
- Обробниках подій React (наприклад, `<button onClick={...} />`)
- Обробниках помилок React (параметри React Root: `onCaughtError`, `onRecoverableError` та `onUncaughtError`)

Якщо Owner Stack недоступний, повертається `null`.

#### Застереження

- Owner Stacks доступні лише в режимі розробки. `captureOwnerStack` завжди повертатиме `null` поза режимом розробки.

## Owner Stack проти Component Stack

Owner Stack відрізняється від Component Stack, доступного в обробниках помилок React.

**Приклад:**
```js
function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}
```

Component Stack включатиме всі компоненти в ланцюжку рендерингу, а Owner Stack включатиме лише:
```
at Component
```

Owner Stack включає лише компоненти, які "створили" вузол, що містить `SubComponent`, а не ті, які просто передали його далі. DOM-компоненти та сусідні елементи виключаються.

## Використання

### Покращення користувацького Error Overlay

```js
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    consoleMessage: args[0],
    ownerStack,
  });
};
```

## Вирішення проблем

### Owner Stack повертає `null`

Виклик `captureOwnerStack` відбувся поза контрольованою React функцією (наприклад, у callback `setTimeout`, після виклику `fetch` або в користувацькому обробнику DOM-подій).

**Приклад проблемного використання:**
```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    function handleEvent() {
      // Виклик у користувацькому обробнику DOM-подій — занадто пізно.
      console.log('Owner Stack: ', captureOwnerStack()); // Буде null
    }

    document.addEventListener('click', handleEvent);
    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me</button>;
}
```

Захоплюйте Owner Stack раніше, наприклад, безпосередньо в тілі Effect.

### `captureOwnerStack` недоступний

`captureOwnerStack` експортується лише в збірках для розробки і буде `undefined` у production. Використовуйте namespace import та умовний доступ:

```js
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```

Не використовуйте іменовані імпорти у файлах, які збираються як для розробки, так і для production.

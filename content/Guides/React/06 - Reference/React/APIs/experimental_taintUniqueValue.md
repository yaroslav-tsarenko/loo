# experimental_taintUniqueValue

`taintUniqueValue` — це експериментальний API React, який запобігає передачі унікальних значень (паролів, ключів, токенів) до Client Components. Доступний лише в React Server Components.

**Статус:** Experimental — потребує `react@experimental`, `react-dom@experimental` та `eslint-plugin-react-hooks@experimental`

## Довідка

### Синтаксис

```js
taintUniqueValue(message, lifetime, value)
```

### Параметри

- **`message`** (string): Повідомлення про помилку, яке відображається, якщо заплямоване значення передається до Client Component
- **`lifetime`** (object): Об'єкт, що вказує, як довго значення має залишатися заплямованим. Значення блокується, поки цей об'єкт існує (наприклад, `globalThis`, `process`)
- **`value`** (string | bigint | TypedArray): Унікальна послідовність з високою ентропією, така як криптографічний токен, приватний ключ, хеш або довгий пароль

### Повертає

`undefined`

## Приклади використання

### Базове використання — запобігання витоку токена

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass a user password to the client.',
  globalThis,
  process.env.SECRET_KEY
);
```

### З часом життя об'єкта

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Do not pass a user session token to the client.',
    user,
    user.session.token
  );
  return user;
}
```

### Захищений API-хелпер

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.',
  process,
  process.env.API_PASSWORD
);

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

## Важливі застереження

### Похідні значення не плямуються автоматично

Створення нових значень із заплямованих значень НЕ плямує їх автоматично:

```js
const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Do not pass the password to the client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // НЕ заплямований
const concatenated = password + 'extra' // НЕ заплямований
const base64 = btoa(password) // НЕ заплямований
const substring = password.slice(0, 5) // НЕ заплямований
```

Ви повинні явно викликати `taintUniqueValue` для новостворених похідних значень.

### Значення з низькою ентропією не захищені

НЕ використовуйте `taintUniqueValue` для значень з низькою ентропією (PIN-коди, номери телефонів). Зловмисник може перебрати можливі значення, щоб визначити, яке значення заплямоване.

### Найкращі практики безпеки

- **Tainting — це один рівень захисту**, а не повна безпека
- Використовуйте разом із пакетом `server-only`, щоб запобігти випадковому імпорту серверного коду
- Поєднуйте з правильним дизайном API та патернами ізоляції
- Не покладайтеся виключно на tainting для запобігання витоку всіх секретів

## Чого НЕ робити

```js
// ❌ ПОГАНО — передає секрет до Client Component
export async function Dashboard(props) {
  return <Overview password={process.env.API_PASSWORD} />;
}

// ❌ Client Component отримує секрет
"use client";
export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
}
```

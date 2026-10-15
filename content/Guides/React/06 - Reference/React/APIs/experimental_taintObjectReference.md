# experimental_taintObjectReference

`experimental_taintObjectReference` — це експериментальний API React, який запобігає передачі конкретних екземплярів об'єктів до Client Components. Це функція безпеки, доступна лише в React Server Components.

> **Статус**: Experimental — потребує `react@experimental`, `react-dom@experimental` та `eslint-plugin-react-hooks@experimental`. Недоступний у стабільних версіях React і не повинен використовуватися у production.

## Довідка API

### Синтаксис

```js
experimental_taintObjectReference(message, object);
```

### Параметри

- **`message`** (string): Повідомлення про помилку, яке відображається, якщо заплямований об'єкт передається до Client Component
- **`object`** (object): Об'єкт для "плямування". Може бути функцією, екземпляром класу або Typed Array. Примітка: лише конкретний екземпляр стає "запляомваним"; копії автоматично не плямуються

### Повертає

Повертає `undefined`

## Використання

### Базовий приклад

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

### Реальний сценарій

**Проблема**: Випадкова передача конфіденційних даних користувача до Client Components під час рефакторингу.

**Рішення**: Заплямуйте об'єкт у джерелі даних:

```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

Якщо хтось спробує передати цей об'єкт до Client Component, React кине помилку з вашим користувацьким повідомленням.

## Важливі застереження

### Обмеження безпеки

> **Не покладайтеся виключно на tainting для безпеки.** Tainting захищає лише від прямої передачі об'єктів. Воно НЕ запобігає:

- **Клонуванню/відтворенню**: `{...user}` створює новий незаплямований об'єкт
- **Похідним значенням**: `{secret: taintedObj.secret}` створює незаплямовані дані
- **Реконструйованим об'єктам**: Нові об'єкти, побудовані з заплямованих даних, є незаплямованими

### Найкращі практики

Впроваджуйте кілька рівнів безпеки:
1. Tainting у джерелі даних (цей API)
2. Добре спроектовані API з вибіркою даних
3. Явний вибір властивостей замість розгортання цілих об'єктів
4. Належні патерни ізоляції
5. Контроль доступу на рівні бази даних

## Пов'язаний API

Для запобігання витоку ключів, хешів або токенів використовуйте [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

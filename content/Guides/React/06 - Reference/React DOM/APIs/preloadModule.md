# preloadModule

## Огляд

`preloadModule` дозволяє завчасно завантажити ESM-модуль, який ви плануєте використовувати.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

> **Примітка:** React-based фреймворки часто обробляють завантаження ресурсів автоматично. Зверніться до документації вашого фреймворку.

---

## Довідка

### `preloadModule(href, options)`

Для попереднього завантаження ESM-модуля викличте функцію `preloadModule` з `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}
```

Функція `preloadModule` надає браузеру підказку почати завантаження вказаного модуля.

#### Параметри

- **`href`**: рядок. URL модуля для завантаження.
- **`options`**: об'єкт:
  - **`as`**: обов'язковий рядок. Повинен бути `'script'`.
  - **`crossOrigin`**: рядок. Політика CORS. Значення: `anonymous` та `use-credentials`.
  - **`integrity`**: рядок. Криптографічний хеш модуля для верифікації.
  - **`nonce`**: рядок. Криптографічний nonce для Content Security Policy.

#### Повертає

`preloadModule` не повертає нічого.

#### Застереження

- Кілька викликів `preloadModule` з тим самим `href` мають такий самий ефект, як один виклик.
- У браузері можна викликати `preloadModule` у будь-якій ситуації.
- При серверному рендерингу або Server Components `preloadModule` має ефект лише при виклику під час рендерингу або в async-контексті. Інші виклики ігноруються.

---

## Використання

### Попереднє завантаження при рендерингу

Викликайте `preloadModule` при рендерингу компонента, якщо ви знаєте, що він або його дочірні елементи використовуватимуть конкретний модуль.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Якщо ви хочете, щоб браузер почав виконувати модуль негайно (а не лише завантажив), використовуйте [`preinitModule`](/reference/react-dom/preinitModule). Для не-ESM скриптів використовуйте [`preload`](/reference/react-dom/preload).

### Попереднє завантаження в обробнику подій

Викликайте `preloadModule` в обробнику подій перед переходом на сторінку або стан, де модуль буде потрібен.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```

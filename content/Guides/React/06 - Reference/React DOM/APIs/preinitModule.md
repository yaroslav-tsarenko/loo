# preinitModule

## Огляд

`preinitModule` дозволяє завчасно завантажити та виконати ESM-модуль.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

> **Примітка:** React-based фреймворки часто обробляють завантаження ресурсів автоматично. Зверніться до документації вашого фреймворку.

---

## Довідка

### `preinitModule(href, options)`

Для preinit ESM-модуля викличте функцію `preinitModule` з `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}
```

Функція `preinitModule` надає браузеру підказку почати завантаження та виконання вказаного модуля. Модулі, для яких викликано `preinit`, виконуються після завантаження.

#### Параметри

* **`href`**: рядок. URL модуля для завантаження та виконання.
* **`options`**: об'єкт:
  * **`as`**: обов'язковий рядок. Повинен бути `'script'`.
  * **`crossOrigin`**: рядок. Політика CORS. Значення: `anonymous` та `use-credentials`.
  * **`integrity`**: рядок. Криптографічний хеш модуля для верифікації.
  * **`nonce`**: рядок. Криптографічний nonce для Content Security Policy.

#### Повертає

`preinitModule` не повертає нічого.

#### Застереження

* Кілька викликів `preinitModule` з тим самим `href` мають такий самий ефект, як один виклик.
* У браузері можна викликати `preinitModule` у будь-якій ситуації.
* При серверному рендерингу або Server Components `preinitModule` має ефект лише при виклику під час рендерингу або в async-контексті. Інші виклики ігноруються.

---

## Використання

### Попереднє завантаження при рендерингу

Викликайте `preinitModule` при рендерингу компонента, якщо ви знаєте, що він або його дочірні елементи використовуватимуть конкретний модуль, і ви згодні з його негайним виконанням після завантаження.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Якщо ви хочете, щоб браузер завантажив модуль без негайного виконання, використовуйте [`preloadModule`](/reference/react-dom/preloadModule). Для не-ESM скриптів використовуйте [`preinit`](/reference/react-dom/preinit).

### Попереднє завантаження в обробнику подій

Викликайте `preinitModule` в обробнику подій перед переходом на сторінку або стан, де модуль буде потрібен.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```

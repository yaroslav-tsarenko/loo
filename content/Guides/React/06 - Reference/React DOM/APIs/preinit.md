# preinit

## Огляд

`preinit` дозволяє завчасно завантажити та виконати таблицю стилів або зовнішній скрипт.

```js
preinit("https://example.com/script.js", {as: "script"});
```

> **Примітка:** React-based фреймворки часто обробляють завантаження ресурсів автоматично. Зверніться до документації вашого фреймворку.

---

## Довідка

### `preinit(href, options)`

Для preinit скрипта або таблиці стилів викличте функцію `preinit` з `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}
```

Функція `preinit` надає браузеру підказку почати завантаження та виконання вказаного ресурсу. Скрипти, для яких викликано `preinit`, виконуються після завантаження. Таблиці стилів вставляються в документ і набувають чинності негайно.

#### Параметри

* **`href`**: рядок. URL ресурсу для завантаження та виконання.
* **`options`**: об'єкт:
  * **`as`**: обов'язковий рядок. Тип ресурсу. Значення: `script` або `style`
  * **`precedence`**: рядок. Обов'язковий для таблиць стилів. Контролює порядок вставки.
  * **`crossOrigin`**: рядок. Політика CORS. Значення: `anonymous` або `use-credentials`
  * **`integrity`**: рядок. Криптографічний хеш ресурсу для верифікації.
  * **`nonce`**: рядок. Криптографічний nonce для Content Security Policy.
  * **`fetchPriority`**: рядок. Пріоритет завантаження. Значення: `auto` (за замовчуванням), `high`, `low`

#### Повертає

`preinit` не повертає нічого.

#### Застереження

* Кілька викликів `preinit` з тим самим `href` мають такий самий ефект, як один виклик.
* У браузері можна викликати `preinit` у будь-якій ситуації: під час рендерингу, в Effect, в обробнику подій тощо.
* При серверному рендерингу або Server Components `preinit` має ефект лише при виклику під час рендерингу компонента або в async-контексті. Інші виклики ігноруються.

---

## Використання

### Preinit при рендерингу

Викликайте `preinit` при рендерингу компонента, якщо ви знаєте, що він або його дочірні елементи використовуватимуть конкретний ресурс, і ви згодні з його негайним виконанням після завантаження.

#### Preinit зовнішнього скрипта

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Якщо ви хочете, щоб браузер завантажив скрипт, але не виконував його одразу, використовуйте [`preload`](/reference/react-dom/preload). Для ESM-модулів використовуйте [`preinitModule`](/reference/react-dom/preinitModule).

#### Preinit таблиці стилів

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

Опція `precedence` (обов'язкова для таблиць стилів) дозволяє контролювати порядок таблиць стилів у документі.

Якщо ви хочете завантажити таблицю стилів без негайного вставляння в документ, використовуйте [`preload`](/reference/react-dom/preload).

### Preinit в обробнику подій

Викликайте `preinit` в обробнику подій перед переходом на сторінку або стан, де знадобляться зовнішні ресурси.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```

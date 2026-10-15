# preload

## Огляд

Функція `preload` з `react-dom` дозволяє завчасно завантажити ресурси, такі як таблиці стилів, шрифти або зовнішні скрипти, які ви плануєте використовувати.

> **Примітка:** React-based фреймворки часто обробляють завантаження ресурсів автоматично. Зверніться до документації вашого фреймворку.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}
```

---

## Довідка

### `preload(href, options)`

#### Параметри

- **`href`** (рядок): URL ресурсу для завантаження
- **`options`** (об'єкт):
  - **`as`** (обов'язковий рядок): Тип ресурсу. Можливі значення: `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`
  - **`crossOrigin`** (рядок): Політика CORS — `anonymous` або `use-credentials`. Обов'язковий, коли `as` дорівнює `"fetch"`
  - **`referrerPolicy`** (рядок): Заголовок Referrer. Значення: `no-referrer-when-downgrade` (за замовчуванням), `no-referrer`, `origin`, `origin-when-cross-origin`, `unsafe-url`
  - **`integrity`** (рядок): Криптографічний хеш для верифікації
  - **`type`** (рядок): MIME-тип ресурсу
  - **`nonce`** (рядок): Криптографічний nonce для CSP
  - **`fetchPriority`** (рядок): Пріоритет — `auto` (за замовчуванням), `high` або `low`
  - **`imageSrcSet`** (рядок): Для `as: "image"` — набір джерел для адаптивних зображень
  - **`imageSizes`** (рядок): Для `as: "image"` — розміри для адаптивних зображень

#### Повертає

Не повертає нічого.

#### Застереження

- Кілька еквівалентних викликів `preload` мають такий самий ефект, як один виклик
- Два виклики еквівалентні, якщо мають однаковий `href` (або для зображень: однакові `href`, `imageSrcSet` та `imageSizes`)
- У браузері можна викликати `preload` під час рендерингу, в Effects, обробниках подій тощо
- При серверному рендерингу або Server Components `preload` працює лише під час рендерингу компонента або в async-контексті

---

## Приклади використання

### Попереднє завантаження зовнішнього скрипта

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

> Використовуйте [`preinit`](/reference/react-dom/preinit), якщо хочете негайного виконання. Для ESM-модулів використовуйте [`preloadModule`](/reference/react-dom/preloadModule).

### Попереднє завантаження таблиці стилів

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

### Попереднє завантаження шрифту

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

> Рекомендація: попередньо завантажуйте шрифти, на які посилаються таблиці стилів, щоб браузер завантажив їх до парсингу таблиці стилів.

### Попереднє завантаження адаптивного зображення

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

### Попереднє завантаження в обробниках подій

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```

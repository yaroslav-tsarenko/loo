# hydrateRoot

## Вступ

`hydrateRoot` дозволяє відобразити React-компоненти всередині браузерного DOM-вузла, HTML-вміст якого був попередньо згенерований `react-dom/server`.

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

---

## Довідка

### `hydrateRoot(domNode, reactNode, options?)`

Викличте `hydrateRoot`, щоб "приєднати" React до існуючого HTML, який вже був рендерений React у серверному середовищі.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React приєднається до HTML, що існує всередині `domNode`, та візьме на себе управління DOM. Застосунок, повністю побудований на React, зазвичай має лише один виклик `hydrateRoot`.

#### Параметри

- **`domNode`**: DOM-елемент, що був рендерений як кореневий на сервері.
- **`reactNode`**: React-вузол для рендерингу існуючого HTML. Зазвичай це JSX типу `<App />`.
- **`options`** (необов'язково): Об'єкт з опціями:
  - **`onCaughtError`**: Callback для помилок, перехоплених Error Boundary.
  - **`onUncaughtError`**: Callback для неперехоплених помилок.
  - **`onRecoverableError`**: Callback для автоматичного відновлення React.
  - **`identifierPrefix`**: Префікс для ID з `useId`. Повинен збігатися з серверним.

#### Повертає

`hydrateRoot` повертає об'єкт з двома методами: `render` та `unmount`.

#### Застереження

- `hydrateRoot()` очікує ідентичний вміст із серверним рендерингом. Невідповідності слід розглядати як баги.
- У режимі розробки React попереджає про невідповідності.
- Якщо застосунок клієнтський без попереднього HTML, використовуйте `createRoot()`.

---

### `root.render(reactNode)`

Викличте `root.render` для оновлення React-компонента в гідратованому root.

```js
root.render(<App />);
```

#### Застереження

- Якщо `root.render` викликається до завершення гідратації, React очистить існуючий серверний HTML та переключить root на клієнтський рендеринг.

---

### `root.unmount()`

Викличте `root.unmount` для знищення рендеренного дерева.

```js
root.unmount();
```

---

## Використання

### Гідратація серверно-рендеренного HTML

```js
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Це гідратує серверний HTML, приєднуючи обробники подій та роблячи його інтерактивним.

#### Підводний камінь

React-дерево, передане в `hydrateRoot`, повинно створювати **такий самий вивід**, як на сервері. Це важливо для користувацького досвіду — користувач деякий час бачить серверний HTML до завантаження JavaScript.

Найпоширеніші причини помилок гідратації:
- Зайві пробіли (наприклад, нові рядки) навколо React-HTML всередині кореневого вузла
- Перевірки типу `typeof window !== 'undefined'` в логіці рендерингу
- Використання браузерних API типу `window.matchMedia` в рендерингу
- Рендеринг різних даних на сервері та клієнті

### Гідратація всього документа

Застосунки, повністю побудовані на React, можуть рендерити весь документ як JSX:

```js
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

### Придушення неминучих помилок невідповідності гідратації

Якщо атрибут або текстовий вміст елемента неминуче відрізняється між сервером та клієнтом (наприклад, мітка часу), додайте `suppressHydrationWarning={true}`:

```js
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

Це працює лише на один рівень глибини та є "аварійним виходом". Не зловживайте.

### Обробка різного вмісту на клієнті та сервері

Якщо потрібен різний вміст, використовуйте двопрохідний рендеринг зі змінною стану:

```js
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

> **Підводний камінь:** Цей підхід сповільнює гідратацію, оскільки компоненти рендеряться двічі.

### Оновлення гідратованого кореневого компонента

Після завершення гідратації можна викликати `root.render` для оновлення. Зазвичай це не потрібно — оновлення відбувається через стан компонентів.

### Логування помилок у production

Для реалізації власного звітування використовуйте опції `onUncaughtError`, `onCaughtError` та `onRecoverableError`:

```js
import { hydrateRoot } from "react-dom/client";

const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    reportCaughtError({ error, componentStack: errorInfo.componentStack });
  },
});
```

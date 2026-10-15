# createRoot

## Огляд

`createRoot` дозволяє створити root для відображення React-компонентів всередині браузерного DOM-вузла.

```js
const root = createRoot(domNode, options?)
```

## Довідка

### `createRoot(domNode, options?)`

Викличте `createRoot`, щоб створити React root для відображення вмісту всередині браузерного DOM-елемента.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React створить root для `domNode` та візьме на себе управління DOM всередині нього. Після створення root ви повинні викликати `root.render` для відображення React-компонента:

```js
root.render(<App />);
```

Застосунок, повністю побудований на React, зазвичай має лише один виклик `createRoot` для кореневого компонента. Сторінка, що використовує React для окремих частин, може мати стільки окремих roots, скільки потрібно.

#### Параметри

* **`domNode`**: DOM-елемент. React створить root для цього елемента.
* **`options`** (необов'язково): Об'єкт з опціями:
  * **`onCaughtError`**: Callback, що викликається, коли React перехоплює помилку в Error Boundary.
  * **`onUncaughtError`**: Callback, що викликається, коли помилка не перехоплена Error Boundary.
  * **`onRecoverableError`**: Callback, що викликається, коли React автоматично відновлюється після помилок.
  * **`identifierPrefix`**: Рядковий префікс для ID, згенерованих [`useId`](/reference/react/useId). Корисний для уникнення конфліктів при кількох roots на одній сторінці.

#### Повертає

`createRoot` повертає об'єкт з двома методами: `render` та `unmount`.

#### Застереження

* Якщо ваш застосунок серверно-рендерений, використання `createRoot()` не підтримується. Використовуйте [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* Для рендерингу JSX в іншій частині DOM-дерева використовуйте [`createPortal`](/reference/react-dom/createPortal) замість `createRoot`.

---

### `root.render(reactNode)`

Викличте `root.render` для відображення JSX у DOM-вузлі React root.

```js
root.render(<App />);
```

#### Застереження

* При першому виклику `root.render` React очистить весь існуючий HTML-вміст всередині React root перед рендерингом.
* Якщо DOM-вузол root містить HTML, згенерований React на сервері, використовуйте [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* При повторному виклику `render` на тому ж root React оновить DOM за необхідності, зберігаючи стан.
* Хоча рендеринг синхронний після початку, `root.render(...)` не є синхронним. Код після `root.render()` може виконатися до спрацювання effects.

---

### `root.unmount()`

Викличте `root.unmount` для знищення рендеренного дерева всередині React root.

```js
root.unmount();
```

Застосунок, повністю побудований на React, зазвичай не має викликів `root.unmount`. Це корисно, якщо DOM-вузол вашого React root може бути видалений з DOM іншим кодом.

#### Застереження

* Виклик `root.unmount` розмонтує всі компоненти та "від'єднає" React від DOM-вузла root.
* Після `root.unmount` не можна викликати `root.render` на тому ж root.

---

## Використання

### Рендеринг застосунку, повністю побудованого на React

```js
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Зазвичай потрібно виконати цей код лише один раз при запуску.

> **Примітка:** Коли HTML порожній, користувач бачить порожню сторінку до завантаження JavaScript. Для вирішення цього генеруйте початковий HTML на сервері або під час збірки. Рекомендується використовувати фреймворк з підтримкою SSR або SSG.

> **Підводний камінь:** Застосунки з серверним рендерингом повинні використовувати [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) замість `createRoot`.

### Рендеринг сторінки, частково побудованої на React

Ви можете викликати `createRoot` кілька разів для створення root для кожної частини UI, керованої React.

```js
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

### Оновлення кореневого компонента

Ви можете викликати `render` кілька разів на тому ж root. React оновить DOM за необхідності, зберігаючи стан. Зазвичай ваші компоненти оновлюють стан замість повторного виклику `render`.

### Логування помилок у production

За замовчуванням React логує всі помилки в консоль. Для реалізації власного звітування про помилки можна надати необов'язкові опції `onUncaughtError`, `onCaughtError` та `onRecoverableError`:

```js
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

---

## Усунення проблем

### Створено root, але нічого не відображається

Переконайтеся, що ви не забули викликати `root.render`:

```js
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### Помилка: "Target container is not a DOM element"

Те, що ви передаєте в `createRoot`, не є DOM-вузлом. Перевірте, що `document.getElementById` повертає валідний елемент.

### Помилка: "Functions are not valid as a React child"

Переконайтеся, що передаєте `<App />` (компонент), а не `App` (функцію):

```js
// Неправильно
root.render(App);

// Правильно
root.render(<App />);
```

### Серверно-рендерений HTML перестворюється з нуля

Серверно-рендерені застосунки повинні використовувати `hydrateRoot` замість `createRoot`:

```js
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

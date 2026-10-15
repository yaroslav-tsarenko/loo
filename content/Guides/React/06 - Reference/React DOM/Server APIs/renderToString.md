# renderToString

## Огляд

`renderToString` рендерить React-дерево в HTML-рядок на сервері.

```js
const html = renderToString(reactNode, options?)
```

### Підводний камінь
`renderToString` не підтримує потокову передачу та очікування даних. Дивіться альтернативи нижче.

---

## Довідка

### `renderToString(reactNode, options?)`

На сервері викличте `renderToString` для рендерингу застосунку в HTML:

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

На клієнті викличте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) для інтерактивності серверного HTML.

#### Параметри

- **`reactNode`**: React-вузол для рендерингу (наприклад, `<App />`).
- **`options`** (необов'язково):
  - **`identifierPrefix`**: Префікс для ID з `useId`. Повинен збігатися з переданим у `hydrateRoot`.

#### Повертає

HTML-рядок.

#### Застереження

- `renderToString` має обмежену підтримку Suspense. При suspend негайно відправляє fallback.
- `renderToString` працює в браузері, але використовувати в клієнтському коді не рекомендується.

---

## Використання

### Рендеринг React-дерева як HTML-рядка

```js
import { renderToString } from 'react-dom/server';

app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

На клієнті викличте `hydrateRoot` для гідратації серверного HTML.

---

## Альтернативи

### Міграція на потоковий рендеринг

`renderToString` повертає рядок негайно та не підтримує потокову передачу.

**Рекомендовані альтернативи:**

- **Node.js**: [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- **Deno або сучасні edge runtimes**: [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)

### Міграція на статичний prerender

`renderToString` не підтримує очікування завантаження даних для статичної генерації HTML.

**Рекомендовані альтернативи:**

- **Node.js**: [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)
- **Deno або сучасні edge runtimes**: [`prerender`](/reference/react-dom/static/prerender)

### Видалення `renderToString` з клієнтського коду

Якщо `renderToString` використовується на клієнті для конвертації компонента в HTML:

```js
// Не рекомендується
import { renderToString } from 'react-dom/server';
const html = renderToString(<MyIcon />);
```

Імпорт `react-dom/server` на клієнті збільшує розмір бандлу. Замість цього:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML);
```

Виклик `flushSync` необхідний для оновлення DOM перед читанням `innerHTML`.

---

## Усунення проблем

### Компонент завжди відображає fallback при suspend

`renderToString` не повністю підтримує Suspense. При suspend компонента негайно відправляється fallback.

**Рішення:** Використовуйте потокові API, які можуть:
- **Потоковий рендеринг:** Передавати вміст порціями в міру resolve на сервері
- **Статична генерація:** Очікувати resolve всього вмісту перед генерацією HTML

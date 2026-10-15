# renderToStaticMarkup

## Огляд

`renderToStaticMarkup` рендерить неінтерактивне React-дерево в HTML-рядок.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

---

## Довідка

### `renderToStaticMarkup(reactNode, options?)`

На сервері викличте `renderToStaticMarkup` для рендерингу вашого застосунку в HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

Він створить неінтерактивний HTML-вивід ваших React-компонентів.

#### Параметри

* **`reactNode`**: React-вузол для рендерингу. Наприклад, JSX-вузол типу `<Page />`.
* **`options`** (необов'язково): Об'єкт для серверного рендерингу.
  * **`identifierPrefix`**: Префікс для ID з `useId`.

#### Повертає

HTML-рядок.

#### Застереження

* Вивід `renderToStaticMarkup` не може бути гідратований.
* `renderToStaticMarkup` має обмежену підтримку Suspense. Якщо компонент suspend, `renderToStaticMarkup` негайно відправляє fallback як HTML.
* `renderToStaticMarkup` працює в браузері, але використовувати його в клієнтському коді не рекомендується.

---

## Використання

### Рендеринг неінтерактивного React-дерева як HTML

Викличте `renderToStaticMarkup` для рендерингу застосунку в HTML-рядок для серверної відповіді:

```js
import { renderToStaticMarkup } from 'react-dom/server';

app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Це створить початковий неінтерактивний HTML-вивід ваших React-компонентів.

#### Підводний камінь

Цей метод рендерить **неінтерактивний HTML, який не може бути гідратований.** Це корисно, якщо ви хочете використовувати React як простий генератор статичних сторінок, або для рендерингу повністю статичного вмісту, наприклад електронних листів.

Інтерактивні застосунки повинні використовувати [`renderToString`](/reference/react-dom/server/renderToString) на сервері та [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) на клієнті.

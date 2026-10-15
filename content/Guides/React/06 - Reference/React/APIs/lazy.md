# `lazy`

## Вступ

`lazy` дозволяє відкласти завантаження коду компонента до його першого рендерингу.

```js
const SomeComponent = lazy(load)
```

---

## Довідка

### `lazy(load)`

Викликайте `lazy` поза вашими компонентами, щоб оголосити компонент з лінивим завантаженням:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

#### Параметри

- `load`: Функція, що повертає [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) або інший *thenable* (об'єкт, подібний до Promise, з методом `then`). React не викликатиме `load`, доки ви вперше не спробуєте відрендерити повернутий компонент. Після першого виклику `load` React очікуватиме його вирішення, а потім відрендерить `.default` вирішеного значення як компонент React. Повернутий Promise та вирішене значення Promise кешуються, тому React не викликатиме `load` більше одного разу. Якщо Promise відхиляється, React `throw` причину відхилення для обробки найближчою межею помилок (Error Boundary).

#### Повертає

`lazy` повертає компонент React, який можна рендерити у вашому дереві. Поки код лінивого компонента ще завантажується, спроба його рендерингу *призупинить* компонент. Використовуйте [`<Suspense>`](/reference/react/Suspense) для відображення індикатора завантаження під час завантаження.

---

### Функція `load`

#### Параметри

`load` не отримує параметрів.

#### Повертає

Потрібно повернути [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) або інший *thenable* (об'єкт, подібний до Promise, з методом `then`). Він повинен зрештою вирішитися в об'єкт, чия властивість `.default` є допустимим типом компонента React, таким як функція, [`memo`](/reference/react/memo) або компонент [`forwardRef`](/reference/react/forwardRef).

---

## Використання

### Ліниве завантаження компонентів з Suspense

Зазвичай ви імпортуєте компоненти за допомогою статичного оголошення [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import):

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Щоб відкласти завантаження коду цього компонента до першого рендерингу, замініть цей імпорт на:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Цей код покладається на [динамічний `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import), який може потребувати підтримки від вашого бандлера або фреймворку. Використання цього шаблону вимагає, щоб лінивий компонент, який ви імпортуєте, був експортований як `default` export.

Тепер, коли код вашого компонента завантажується на вимогу, вам також потрібно вказати, що відображати під час завантаження. Ви можете зробити це, обгорнувши лінивий компонент або будь-якого з його батьків у межу [`<Suspense>`](/reference/react/Suspense):

```js
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

У цьому прикладі код для `MarkdownPreview` не завантажуватиметься, доки ви не спробуєте його відрендерити. Якщо `MarkdownPreview` ще не завантажився, замість нього буде показано `Loading`.

#### Приклад коду:

**src/App.js**
```js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Додаємо фіксовану затримку для демонстрації стану завантаження
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

**src/Loading.js**
```js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

**src/MarkdownPreview.js**
```js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

Ця демонстрація завантажується зі штучною затримкою. Наступного разу, коли ви знімите та знову поставите прапорець, `Preview` буде кешований, тому стану завантаження не буде. Щоб знову побачити стан завантаження, натисніть "Reset" у пісочниці.

[Дізнайтеся більше про управління станами завантаження з Suspense.](/reference/react/Suspense)

---

## Усунення проблем

### Стан мого `lazy` компонента неочікувано скидається

Не оголошуйте `lazy` компоненти *всередині* інших компонентів:

```js
import { lazy } from 'react';

function Editor() {
  // Погано: Це призведе до скидання всього стану при перерендерах
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Натомість завжди оголошуйте їх на верхньому рівні вашого модуля:

```js
import { lazy } from 'react';

// Добре: Оголошуйте lazy компоненти поза вашими компонентами
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```

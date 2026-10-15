# Серверні React DOM APIs

## Вступ

API `react-dom/server` дозволяють серверний рендеринг React-компонентів у HTML. Ці API використовуються на сервері на верхньому рівні застосунку для генерації початкового HTML. Фреймворк може викликати їх автоматично, тому більшість компонентів не потребують їх прямого імпорту.

---

## Серверні API для Web Streams

Ці методи доступні в середовищах з підтримкою [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), включаючи браузери, Deno та сучасні edge runtimes:

* **[`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)** — рендерить React-дерево в [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* **[`resume`](/reference/react-dom/server/renderToPipeableStream)** — відновлює [`prerender`](/reference/react-dom/static/prerender) в [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

> **Примітка:** Node.js включає ці методи для сумісності, але вони не рекомендовані через гіршу продуктивність. Використовуйте спеціалізовані Node.js API замість них.

---

## Серверні API для Node.js Streams

Ці методи доступні в середовищах з підтримкою [Node.js Streams](https://nodejs.org/api/stream.html):

* **[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)** — рендерить React-дерево в pipeable [Node.js Stream](https://nodejs.org/api/stream.html)
* **[`resumeToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)** — відновлює [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) в pipeable [Node.js Stream](https://nodejs.org/api/stream.html)

---

## Застарілі серверні API для середовищ без потоків

Ці методи працюють у середовищах без підтримки потоків:

* **[`renderToString`](/reference/react-dom/server/renderToString)** — рендерить React-дерево в рядок
* **[`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup)** — рендерить неінтерактивне React-дерево в рядок

Ці застарілі API мають обмежену функціональність порівняно з потоковими API.

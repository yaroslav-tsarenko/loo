# Статичні React DOM APIs

## Огляд

API `react-dom/static` дозволяють генерувати статичний HTML для React-компонентів. Ці API мають обмежену функціональність порівняно з потоковими API. Фреймворки можуть викликати їх автоматично, і більшість компонентів не потребують їх прямого імпорту.

---

## Статичні API для Web Streams

Доступні в середовищах з підтримкою [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), включаючи браузери, Deno та сучасні edge runtimes:

- **[`prerender`](/reference/react-dom/static/prerender)** — рендерить React-дерево в статичний HTML з [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

- **[`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender)** (експериментальний) — продовжує попередньо рендерене React-дерево в статичний HTML

> **Примітка:** Node.js включає ці методи для сумісності, але вони не рекомендовані через гіршу продуктивність. Використовуйте спеціалізовані Node.js API.

---

## Статичні API для Node.js Streams

Доступні в середовищах з підтримкою [Node.js Streams](https://nodejs.org/api/stream.html):

- **[`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)** — рендерить React-дерево в статичний HTML з [Node.js Stream](https://nodejs.org/api/stream.html)

- **[`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)** (експериментальний) — продовжує попередньо рендерене React-дерево в статичний HTML

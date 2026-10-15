# Server Components

## Вступ

Server Components — це новий тип компонентів, які рендеряться заздалегідь, перед бандлінгом, у середовищі, окремому від вашого клієнтського додатку або SSR сервера.

Це окреме середовище і є "сервером" у React Server Components. Server Components можуть виконуватися один раз під час збірки на вашому CI сервері, або вони можуть виконуватися для кожного запиту за допомогою веб-сервера.

## Важливе зауваження: Підтримка побудови Server Components

Хоча React Server Components у React 19 є стабільними та не будуть ламатися між мінорними версіями, базові API, що використовуються для реалізації бандлера або фреймворку React Server Components, не дотримуються semver та можуть ламатися між мінорними версіями React 19.x.

Для підтримки React Server Components як бандлер або фреймворк, рекомендується прив'язуватися до конкретної версії React або використовувати Canary реліз. Ми продовжуватимемо працювати з бандлерами та фреймворками для стабілізації API, що використовуються для реалізації React Server Components у майбутньому.

---

## Server Components без сервера

Server Components можуть виконуватися під час збірки для читання з файлової системи або отримання статичного контенту, тому веб-сервер не потрібен. Наприклад, ви можете захотіти читати статичні дані з системи управління контентом.

### Без Server Components

Типово отримувати статичні дані на клієнті за допомогою Effect:

**bundle.js**
```js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // ПРИМІТКА: завантажується *після* першого рендеру сторінки.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

**api.js**
```js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

**Проблема:** Користувачі повинні завантажити та розібрати додаткові 75K (gzipped) бібліотек, і чекати другого запиту для отримання даних після завантаження сторінки, лише щоб відрендерити статичний контент, який не змінюватиметься протягом усього часу існування сторінки.

### З Server Components

Ви можете рендерити ці компоненти один раз під час збірки:

```js
import marked from 'marked'; // Не включається до бандлу
import sanitizeHtml from 'sanitize-html'; // Не включається до бандлу

async function Page({page}) {
  // ПРИМІТКА: завантажується *під час* рендеру, коли додаток збирається.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Відрендерений вивід потім може бути server-side rendered (SSR) в HTML та завантажений на CDN. Коли додаток завантажується, клієнт не бачить оригінальний компонент `Page` або дорогі бібліотеки для рендерингу markdown. Клієнт бачить лише відрендерований вивід:

```js
<div><!-- html для markdown --></div>
```

**Переваги:**
- Контент видимий під час першого завантаження сторінки
- Бандл не включає дорогі бібліотеки, потрібні для рендерингу статичного контенту

### Примітка про async компоненти

Ви могли помітити, що Server Component вище є async функцією:

```js
async function Page({page}) {
  //...
}
```

Async Components — це нова можливість Server Components, яка дозволяє використовувати `await` під час render.

---

## Server Components з сервером

Server Components також можуть виконуватися на веб-сервері під час запиту сторінки, дозволяючи вам отримувати доступ до шару даних без необхідності створювати API. Вони рендеряться перед бандлінгом вашого додатку і можуть передавати дані та JSX як props до Client Components.

### Без Server Components

Типово отримувати динамічні дані на клієнті в Effect:

**bundle.js**
```js
function Note({id}) {
  const [note, setNote] = useState('');
  // ПРИМІТКА: завантажується *після* першого рендеру.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // ПРИМІТКА: завантажується *після* рендеру Note.
  // Спричиняє дорогий клієнт-серверний водоспад.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```

**Проблема:** Клієнт-серверний водоспад — дані Author отримуються лише після рендеру Note, що спричиняє затримки.

### З Server Components

Ви можете читати дані та рендерити їх у компоненті:

```js
import db from './database';

async function Note({id}) {
  // ПРИМІТКА: завантажується *під час* рендеру.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // ПРИМІТКА: завантажується *після* Note,
  // але швидко, якщо дані знаходяться поруч.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

Бандлер потім поєднує дані, відрендерені Server Components та динамічні Client Components у бандл. За бажанням, цей бандл потім може бути server-side rendered (SSR) для створення початкового HTML сторінки.

**Переваги:** Server Components можна зробити динамічними, повторно отримуючи їх із сервера, де вони можуть отримати доступ до даних та відрендеритися знову. Ця нова архітектура додатків поєднує просту ментальну модель "запит/відповідь" серверо-центричних Multi-Page Apps із безшовною інтерактивністю клієнто-центричних Single-Page Apps.

---

## Додавання інтерактивності до Server Components

Server Components не відправляються до браузера, тому вони не можуть використовувати інтерактивні API, як-от `useState`. Для додавання інтерактивності до Server Components ви можете компонувати їх з Client Component за допомогою директиви `"use client"`.

### Важливо: Для Server Components немає директиви

Поширене непорозуміння полягає в тому, що Server Components позначаються `"use server"`, але директиви для Server Components не існує. Директива `"use server"` використовується для Server Functions.

### Приклад: Компонування Server та Client Components

У наступному прикладі Server Component `Notes` імпортує Client Component `Expandable`, який використовує state для перемикання свого стану `expanded`:

**Server Component**
```js
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```

**Client Component**
```js
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

Це працює шляхом спочатку рендерингу `Notes` як Server Component, а потім вказівки бандлеру створити бандл для Client Component `Expandable`. У браузері Client Components побачать вивід Server Components, переданий як props.

---

## Async Components з Server Components

Server Components представляють новий спосіб написання компонентів з використанням async/await. Коли ви використовуєте `await` в async компоненті, React призупиняється та чекає на вирішення promise перед відновленням рендерингу. Це працює через межі сервер/клієнт з підтримкою streaming для Suspense.

Ви навіть можете створити promise на сервері та await його на клієнті:

**Server Component**
```js
import db from './database';

async function Page({id}) {
  // Призупинить Server Component.
  const note = await db.notes.get(id);

  // ПРИМІТКА: не await, розпочнеться тут і await на клієнті.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

**Client Component**
```js
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // ПРИМІТКА: це відновить promise з сервера.
  // Воно призупиниться до доступності даних.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

**Стратегія оптимізації:** Контент `note` є важливими даними для рендерингу сторінки, тому ми await його на сервері. Коментарі знаходяться нижче сгину та мають нижчий пріоритет, тому ми розпочинаємо promise на сервері та чекаємо його на клієнті за допомогою API `use`. Це призупинить клієнт, не блокуючи рендеринг контенту `note`.

Оскільки async компоненти не підтримуються на клієнті, ми await promise за допомогою `use`.

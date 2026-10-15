# `<Suspense>`

## Огляд

`<Suspense>` дозволяє відображати запасний варіант (fallback), поки дочірні компоненти не завершать завантаження.

```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

---

## Довідка

### `<Suspense>`

#### Пропси

- **`children`**: Фактичний UI, який ви маєте намір відрендерити. Якщо `children` призупиняється під час рендерингу, межа Suspense переключиться на рендеринг `fallback`.
- **`fallback`**: Альтернативний UI для відображення замість фактичного UI, якщо він ще не завершив завантаження. Приймається будь-який допустимий React-вузол, хоча на практиці fallback — це легковісний заповнювач, такий як спінер завантаження або скелетон. Suspense автоматично переключається на `fallback`, коли `children` призупиняється, і назад на `children`, коли дані готові. Якщо `fallback` призупиняється під час рендерингу, він активує найближчу батьківську межу Suspense.

#### Застереження

- React не зберігає жодного стану для рендерів, які були призупинені до першого монтування. Коли компонент завантажиться, React повторить спробу рендерингу призупиненого дерева з нуля.
- Якщо Suspense відображав контент для дерева, але потім знову призупинився, `fallback` буде показано знову, якщо тільки оновлення, що спричинило це, не було викликано [`startTransition`](/reference/react/startTransition) або [`useDeferredValue`](/reference/react/useDeferredValue).
- Якщо React потрібно приховати вже видимий контент через повторне призупинення, він очистить [layout Effects](/reference/react/useLayoutEffect) у дереві контенту. Коли контент буде готовий до повторного показу, React знову запустить layout Effects. Це гарантує, що Effects, які вимірюють розмітку DOM, не намагатимуться це зробити, поки контент прихований.
- React включає оптимізації "під капотом", такі як *Streaming Server Rendering* та *Selective Hydration*, інтегровані з Suspense.

---

## Використання

### Відображення fallback під час завантаження контенту

Ви можете обгорнути будь-яку частину вашого застосунку межею Suspense:

```js
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React відображатиме ваш fallback завантаження, доки весь код та дані, необхідні для дочірніх компонентів, не будуть завантажені.

У прикладі нижче компонент `Albums` *призупиняється* під час отримання списку альбомів. Поки він не готовий до рендерингу, React переключає найближчу межу Suspense вище для показу fallback — вашого компонента `Loading`. Потім, коли дані завантажуються, React приховує fallback `Loading` і рендерить компонент `Albums` з даними.

```js
// src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js
// src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

> **Примітка**: Лише джерела даних з підтримкою Suspense активують компонент Suspense. Вони включають:
> - Отримання даних з фреймворками з підтримкою Suspense, такими як [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) та [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
> - Ліниве завантаження коду компонентів за допомогою [`lazy`](/reference/react/lazy)
> - Читання значення кешованого Promise за допомогою [`use`](/reference/react/use)
>
> Suspense **не** виявляє отримання даних всередині Effect або обробника подій.

---

### Одночасне відображення контенту

За замовчуванням все дерево всередині Suspense розглядається як єдиний блок. Наприклад, навіть якщо *лише один* з цих компонентів призупиняється в очікуванні даних, *усі* вони разом будуть замінені індикатором завантаження:

```js
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Потім, після того як усі готові до відображення, вони з'являться разом одночасно.

```js
// src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

---

### Поступове відображення вкладеного контенту

Коли компонент призупиняється, найближчий батьківський компонент Suspense показує fallback. Це дозволяє вкладати кілька компонентів Suspense для створення послідовності завантаження. Fallback кожної межі Suspense буде заповнений, коли наступний рівень контенту стане доступним.

```js
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

З цією зміною відображення `Biography` не потрібно "чекати" завантаження `Albums`.

Послідовність буде такою:

1. Якщо `Biography` ще не завантажився, `BigSpinner` показується замість всієї області контенту.
2. Коли `Biography` завершує завантаження, `BigSpinner` замінюється контентом.
3. Якщо `Albums` ще не завантажився, `AlbumsGlimmer` показується замість `Albums` та його батьківського `Panel`.
4. Нарешті, коли `Albums` завершує завантаження, він замінює `AlbumsGlimmer`.

```js
// src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

Межі Suspense дозволяють координувати, які частини вашого UI завжди повинні "з'являтися" разом одночасно, а які повинні поступово відкривати більше контенту в послідовності станів завантаження. Ви можете додавати, переміщувати або видаляти межі Suspense в будь-якому місці дерева, не впливаючи на поведінку решти вашого застосунку.

> **Примітка**: Не ставте межу Suspense навколо кожного компонента. Межі Suspense не повинні бути більш деталізованими, ніж послідовність завантаження, яку ви хочете, щоб користувач відчував.

---

### Показ застарілого контенту під час завантаження нового

Поширений альтернативний шаблон UI — *відкласти* оновлення списку та продовжувати показувати попередні результати, поки нові результати не будуть готові. Хук [`useDeferredValue`](/reference/react/useDeferredValue) дозволяє передати відкладену версію запиту:

```js
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` оновиться негайно, тому поле введення відобразить нове значення. Однак `deferredQuery` збереже попереднє значення, доки дані не завантажаться, тому `SearchResults` деякий час показуватиме застарілі результати.

Щоб зробити це більш очевидним для користувача, можна додати візуальну індикацію при відображенні застарілого списку результатів:

```js
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1
}}>
  <SearchResults query={deferredQuery} />
</div>
```

> **Примітка**: Як відкладені значення, так і Transitions дозволяють уникнути показу fallback Suspense на користь вбудованих індикаторів. Transitions позначають все оновлення як неургентне, тому їх зазвичай використовують фреймворки та бібліотеки маршрутизації для навігації. Відкладені значення, з іншого боку, найбільш корисні в коді застосунку, де ви хочете позначити частину UI як неургентну та дозволити їй "відставати" від решти UI.

---

### Запобігання приховуванню вже відображеного контенту

Коли компонент призупиняється, найближча батьківська межа Suspense переключається на показ fallback. Це може призвести до різкого користувацького досвіду, якщо вона вже відображала контент.

Щоб запобігти цьому, ви можете позначити оновлення стану навігації як *Transition* за допомогою [`startTransition`](/reference/react/startTransition):

```js
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
}
```

Це повідомляє React, що перехід стану не є терміновим, і краще продовжувати показувати попередню сторінку замість приховування вже відображеного контенту.

Transition не чекає завантаження *всього* контенту. Він чекає лише достатньо довго, щоб уникнути приховування вже відображеного контенту. Наприклад, `Layout` веб-сайту вже був відображений, тому було б погано приховати його за спінером завантаження. Однак вкладена межа `Suspense` навколо `Albums` є новою, тому Transition не чекає її.

> **Примітка**: Маршрутизатори з підтримкою Suspense за замовчуванням повинні обгортати оновлення навігації у Transitions.

---

### Індикація виконання Transition

Щоб додати індикатор, ви можете замінити [`startTransition`](/reference/react/startTransition) на [`useTransition`](/reference/react/useTransition), який надає булеве значення `isPending`:

```js
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  // ...
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}
```

```js
// src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

---

### Скидання меж Suspense при навігації

Під час Transition React уникатиме приховування вже відображеного контенту. Однак, якщо ви переходите на маршрут з іншими параметрами, ви можете хотіти повідомити React, що це *інший* контент. Ви можете виразити це за допомогою `key`:

```js
<ProfilePage key={queryParams.id} />
```

Уявіть, що ви переходите всередині сторінки профілю користувача, і щось призупиняється. Якщо це оновлення обгорнуто у Transition, воно не запустить fallback для вже видимого контенту. Це очікувана поведінка.

Однак тепер уявіть, що ви переходите між двома різними профілями користувачів. У цьому випадку має сенс показати fallback. Наприклад, стрічка одного користувача — це *інший контент* від стрічки іншого користувача. Вказавши `key`, ви гарантуєте, що React розглядає профілі різних користувачів як різні компоненти та скидає межі Suspense під час навігації. Маршрутизатори, інтегровані з Suspense, повинні робити це автоматично.

---

### Надання fallback для серверних помилок та контенту лише для клієнта

Якщо ви використовуєте один з [API серверного рендерингу з потоковою передачею](/reference/react-dom/server) (або фреймворк, що на них покладається), React також використовуватиме ваші межі `<Suspense>` для обробки помилок на сервері. Якщо компонент кидає помилку на сервері, React не перерве серверний рендеринг. Замість цього він знайде найближчий компонент `<Suspense>` над ним та включить його fallback (наприклад, спінер) у згенерований серверний HTML.

На клієнті React спробує відрендерити той самий компонент знову. Якщо він також видає помилку на клієнті, React кине помилку та відобразить найближчу межу помилок (Error Boundary). Однак якщо на клієнті помилки немає, React не покаже помилку користувачу, оскільки контент зрештою був успішно відображений.

Ви можете використати це, щоб виключити деякі компоненти з серверного рендерингу:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

Серверний HTML міститиме індикатор завантаження. Він буде замінений компонентом `Chat` на клієнті.

---

## Усунення проблем

### Як запобігти заміні UI на fallback під час оновлення?

Заміна видимого UI на fallback створює різкий користувацький досвід. Це може статися, коли оновлення спричиняє призупинення компонента, а найближча межа Suspense вже показує контент користувачу.

Щоб запобігти цьому, позначте оновлення як неургентне за допомогою `startTransition`:

```js
function handleNextPageClick() {
  // Якщо це оновлення призупиниться, не приховуйте вже відображений контент
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Це уникне приховування існуючого контенту. Однак будь-які новорендерені межі `Suspense` все ще негайно відобразять fallback, щоб не блокувати UI та дозволити користувачу бачити контент, коли він стає доступним.

**React запобігатиме небажаним fallback лише під час неургентних оновлень.** Він не затримуватиме рендеринг, якщо це результат термінового оновлення. Ви повинні явно обрати це за допомогою API типу [`startTransition`](/reference/react/startTransition) або [`useDeferredValue`](/reference/react/useDeferredValue).

Якщо ваш маршрутизатор інтегрований з Suspense, він повинен автоматично обгортати свої оновлення у [`startTransition`](/reference/react/startTransition).

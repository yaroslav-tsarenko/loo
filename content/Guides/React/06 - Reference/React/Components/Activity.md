# `<Activity>`

## Огляд

Компонент `<Activity>` дозволяє приховувати та відновлювати UI та внутрішній стан дочірніх компонентів.

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

## Довідка

### `<Activity>`

Ви можете використовувати Activity, щоб приховати частину вашого застосунку:

```js
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Коли межа Activity **прихована**, React візуально приховає дочірні компоненти за допомогою CSS-властивості `display: "none"`. Він також знищить їхні Effects, очистивши всі активні підписки.

Поки приховані, дочірні компоненти все ще перерендерюються у відповідь на нові пропси, хоча з нижчим пріоритетом, ніж решта контенту.

Коли межа знову стає **видимою**, React відновлює дочірні компоненти з їхнім попереднім станом та повторно створює їхні Effects.

Таким чином, Activity можна розглядати як механізм для рендерингу "фонової активності". Замість повного знищення контенту, який, ймовірно, знову стане видимим, ви можете використовувати Activity для підтримки та відновлення UI та внутрішнього стану цього контенту, забезпечуючи відсутність небажаних побічних ефектів від прихованого контенту.

#### Пропси

- `children`: UI, який ви маєте намір показувати та приховувати.
- `mode`: Рядкове значення `'visible'` або `'hidden'`. Якщо не вказано, за замовчуванням `'visible'`.

#### Застереження

- Якщо Activity рендериться всередині ViewTransition і стає видимим внаслідок оновлення, викликаного startTransition, він активує анімацію `enter` ViewTransition. Якщо стає прихованим, він активує анімацію `exit`.
- *Прихований* Activity, який просто рендерить текст, не рендеритиме нічого замість прихованого тексту, оскільки немає відповідного DOM-елемента для застосування змін видимості. Наприклад, `<Activity mode="hidden"><ComponentThatJustReturnsText /></Activity>` не створить жодного виводу в DOM для `const ComponentThatJustReturnsText = () => "Hello, World!"`.

## Використання

### Відновлення стану прихованих компонентів

У React, коли ви хочете умовно показати або приховати компонент, ви зазвичай монтуєте або демонтуєте його на основі умови:

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

Але демонтування компонента знищує його внутрішній стан, що не завжди є бажаним.

Коли ви приховуєте компонент за допомогою межі Activity, React "зберігає" його стан на потім:

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Це дозволяє приховувати, а потім відновлювати компоненти в тому стані, в якому вони були раніше.

**Приклад: Бічна панель з розділом, що розгортається**

```js
// src/App.js
import { Activity, useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js
// src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

Внутрішній стан бічної панелі тепер відновлюється без жодних змін у її реалізації.

### Відновлення DOM прихованих компонентів

Оскільки межі Activity приховують дочірні компоненти за допомогою `display: none`, DOM дочірніх компонентів також зберігається при приховуванні. Це робить їх чудовими для підтримки ефемерного стану в частинах UI, з якими користувач, ймовірно, взаємодіятиме знову.

**Приклад: Перемикання вкладок зі збереженням контенту textarea**

```js
// src/App.js
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js
// src/Contact.js
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

Межа Activity дозволяє зберегти внутрішній стан вкладки Contact без зміни її реалізації.

### Попередній рендеринг контенту, який, ймовірно, стане видимим

Межі Activity також можна використовувати для *підготовки* контенту, який користувач ще не бачив:

```jsx
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

Коли межа Activity прихована під час початкового рендерингу, дочірні компоненти не будуть видимі на сторінці — але вони все одно будуть *відрендерені*, хоча з нижчим пріоритетом, ніж видимий контент, і без монтування їхніх Effects.

Цей *попередній рендеринг* дозволяє дочірнім компонентам завантажити необхідний код або дані заздалегідь, щоб пізніше, коли межа Activity стане видимою, дочірні компоненти могли з'явитися швидше зі зменшеним часом завантаження.

**Приклад: Попередній рендеринг вкладки Posts**

```js
// src/App.js
import { Activity, useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js
// src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

> **Примітка**: Лише джерела даних з підтримкою Suspense будуть отримані під час попереднього рендерингу. Вони включають:
> - Отримання даних з фреймворками з підтримкою Suspense, такими як Relay та Next.js
> - Ліниве завантаження коду компонентів за допомогою `lazy`
> - Читання значення кешованого Promise за допомогою `use`
>
> Activity **не** виявляє дані, що отримуються всередині Effect.

### Прискорення взаємодій під час завантаження сторінки

React включає оптимізацію продуктивності "під капотом" під назвою Selective Hydration. Вона працює шляхом гідратації початкового HTML вашого застосунку *частинами*, дозволяючи деяким компонентам стати інтерактивними, навіть якщо інші компоненти на сторінці ще не завантажили свій код або дані.

Межі Suspense беруть участь у Selective Hydration, оскільки вони природно поділяють ваше дерево компонентів на незалежні блоки.

Межі Activity також беруть участь у Selective Hydration:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

Тепер початковий серверний HTML виглядає так само, як у оригінальній версії, але завдяки Activity React може спочатку гідратувати кнопки вкладок, перш ніж монтувати `Home` або `Video`.

Ви також можете додати завжди видимі межі Activity для покращення продуктивності гідратації:

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
}
```

## Усунення проблем

### Мої приховані компоненти мають небажані побічні ефекти

Межа Activity приховує свій контент, встановлюючи `display: none` для дочірніх компонентів та очищуючи будь-які їхні Effects. Тому більшість правильно написаних компонентів React, які належним чином очищують свої побічні ефекти, вже будуть стійкими до приховування за допомогою Activity.

Але є деякі ситуації, коли прихований компонент поводиться інакше, ніж демонтований. Зокрема, оскільки DOM прихованого компонента не знищується, будь-які побічні ефекти від цього DOM збережуться, навіть після приховування компонента.

**Приклад: Відео продовжує відтворюватися при приховуванні**

При використанні меж Activity з DOM-елементами, що мають внутрішню поведінку (наприклад, `<video>`), вам може знадобитися додати функції очищення до Effects:

```jsx
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />
  );
}
```

Використовуйте `useLayoutEffect` замість `useEffect`, оскільки концептуально код очищення пов'язаний з візуальним приховуванням UI компонента. Якщо ви використаєте звичайний ефект, код може бути затриманий, наприклад, через повторне призупинення межі Suspense або View Transition.

Найпоширеніші випадки, коли потрібне очищення:
- `<video>`
- `<audio>`
- `<iframe>`

Зазвичай більшість ваших компонентів React вже повинні бути стійкими до приховування за допомогою межі Activity. Концептуально слід розглядати "приховані" Activities як демонтовані.

Для раннього виявлення Effects без належного очищення рекомендуємо використовувати `<StrictMode>`.

### Мої приховані компоненти мають Effects, які не запускаються

Коли `<Activity>` "прихований", усі Effects дочірніх компонентів очищуються. Концептуально, дочірні компоненти демонтовані, але React зберігає їхній стан на потім. Це функціональність Activity, оскільки підписки не будуть активними для прихованих частин UI, зменшуючи обсяг роботи для прихованого контенту.

Якщо ви покладаєтесь на монтування Effect для очищення побічних ефектів компонента, перенесіть роботу у повернену функцію очищення Effect.

Для раннього виявлення проблемних Effects рекомендуємо додати `<StrictMode>`, який завчасно виконає демонтування та монтування Activity для виявлення неочікуваних побічних ефектів.

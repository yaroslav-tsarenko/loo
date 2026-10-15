# Глибока передача даних через Context

## Вступ

Context — це функція React, яка дозволяє батьківським компонентам робити інформацію доступною для будь-якого component у дереві нижче — незалежно від глибини — без явної передачі через props.

### Що ви дізнаєтесь
- Що таке "prop drilling"
- Як замінити повторювану передачу props на context
- Поширені випадки використання context
- Поширені альтернативи context

---

## Проблема з передачею Props

**Передача props** — це стандартний спосіб передачі даних через дерево UI, але він стає багатослівним та незручним, коли:
- Потрібно передати prop глибоко через багато рівнів
- Багато компонентів у застосунку потребують того самого prop
- Найближчий спільний предок далекий від компонентів, яким потрібні дані

Ця ситуація називається **"prop drilling"** (свердління через props).

React context вирішує це, дозволяючи "телепортувати" дані до компонентів, яким вони потрібні, без передачі props через проміжні компоненти.

---

## Context: Альтернатива передачі Props

Context дозволяє батьківському component надавати дані всьому дереву нижче нього. Ось практичний приклад з рівнями заголовків у вкладених секціях.

### Крок 1: Створіть Context

Створіть файл context та експортуйте його, щоб компоненти могли його використовувати:

```js
// LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

Аргумент `createContext()` — це **значення за замовчуванням** (тут `1` для найбільшого рівня заголовка). Це значення використовується, якщо вище component не знайдено жодного провайдера.

### Крок 2: Використовуйте Context

Імпортуйте hook `useContext` та ваш context, потім читайте з нього:

```jsx
// Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

> **Важливо**: `useContext` — це Hook, і його можна викликати лише безпосередньо всередині React-component (не в циклах чи умовах).

### Крок 3: Надайте Context

Обгорніть дочірні елементи провайдером context для постачання значення context:

```jsx
// Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

Це каже React: "якщо будь-який component всередині цього `<Section>` запитує `LevelContext`, надай йому це значення `level`."

### Повний приклад

```jsx
// App.js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
        </Section>
      </Section>
    </Section>
  );
}
```

---

## Використання та надання Context з того самого Component

Component може одночасно **використовувати** та **надавати** context. Кожен `Section` може читати рівень від батьківського `Section` і передавати `level + 1` своїм дочірнім елементам автоматично:

```jsx
// Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

Тепер вам не потрібно передавати prop `level` взагалі:

```jsx
export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
        </Section>
      </Section>
    </Section>
  );
}
```

---

## Context проходить через проміжні компоненти

Ви можете вставити будь-яку кількість компонентів між провайдером context та споживачем. І вбудовані HTML-елементи, і користувацькі компоненти можуть бути посередині без необхідності знати про context.

Приклад: Component `Post`, відрендерений на різних рівнях вкладеності, автоматично отримає правильний рівень заголовка від найближчого `<Section>` вище нього.

```jsx
function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post title="Hello traveller!" body="Read about my adventures." />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post title="Flavors of Lisbon" body="...those pasteis de nata!" />
      <Post title="Buenos Aires in the rhythm of tango" body="I loved it!" />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>{title}</Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

**Ключовий висновок**: Context працює подібно до успадкування CSS-властивостей — він тече вниз по дереву і може бути перевизначений на будь-якому рівні вкладеним провайдером з іншим значенням.

---

## Перед тим як використовувати Context

Context спокусливо використовувати, але його легко перевикористати. Спочатку розгляньте ці альтернативи:

### 1. Передавайте Props безпосередньо
Якщо ваші компоненти не тривіальні, передача props через десяток компонентів може здаватися нудною, але це робить потік даних явним і допомагає тим, хто підтримує код, розуміти його. Це часто найкращий підхід.

### 2. Виділіть компоненти та передайте JSX як children
Якщо ви передаєте дані через проміжні компоненти, які їх не використовують, можливо, ви пропустили можливість виділити component. Наприклад:

Замість:
```jsx
<Layout posts={posts} />
```

Зробіть:
```jsx
<Layout>
  <Posts posts={posts} />
</Layout>
```

Це зменшує кількість шарів між джерелом даних та component, якому вони потрібні.

Використовуйте context лише якщо жоден з цих підходів не працює добре для вашої ситуації.

---

## Випадки використання Context

### Теми оформлення
Дозволяє користувачам змінювати зовнішній вигляд застосунку (наприклад, темний режим). Зберігайте тему в context на верхньому рівні та використовуйте її в компонентах, які потребують налаштування візуального вигляду.

### Поточний обліковий запис
Багато компонентів повинні знати поточного авторизованого користувача. Context робить це зручним для читання будь-де. Сценарії з кількома обліковими записами можуть обгортати різні секції UI різними значеннями context.

### Маршрутизація
Більшість рішень маршрутизації використовують context внутрішньо для зберігання поточного маршруту. Саме так посилання знають, чи вони активні.

### Управління State
У міру зростання застосунків state часто акумулюється на верхньому рівні. Багато віддалених компонентів можуть потребувати його зміни. Context добре працює з reducer для управління складним state.

> **Важливо**: Context не обмежений статичними значеннями. Якщо ви передаєте інше значення при наступному рендері, React оновить усі компоненти, які його читають. Context часто використовується зі state саме з цієї причини.

---

## Підсумок

- **Context дозволяє component надавати інформацію всьому дереву нижче нього**
- **Три кроки використання context:**
  1. Створіть та експортуйте: `export const MyContext = createContext(defaultValue)`
  2. Читайте в дочірніх компонентах: `const value = useContext(MyContext)`
  3. Надайте з батька: `<MyContext value={...}>{children}</MyContext>`
- Context проходить через будь-які проміжні компоненти
- Компоненти можуть "адаптуватися до свого оточення" на основі context
- Завжди спробуйте передачу props або JSX children перед тим як використовувати context

---

## Приклад виклику: Замініть Prop Drilling на Context

**Проблема:** Component `App` перемикає `imageSize` і передає його через `List` → `Place` → `PlaceImage`.

**Рішення:** Створіть `ImageSizeContext` і надайте його на верхньому рівні:

```js
// Context.js
import { createContext } from 'react';
export const ImageSizeContext = createContext(500);
```

```jsx
// App.js
import { useState } from 'react';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  
  return (
    <ImageSizeContext value={imageSize}>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => setIsLarge(e.target.checked)}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  );
}
```

```jsx
// PlaceImage.js
import { useContext } from 'react';
import { ImageSizeContext } from './Context.js';

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

Тепер `List` та `Place` не потрібно передавати prop `imageSize` — він тече безпосередньо через context.

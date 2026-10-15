# Вибір структури State

## Вступ

Ефективне структурування state є критично важливим для створення React-компонентів, які легко модифікувати та дебажити. Погана структура state може бути постійним джерелом багів.

**Ви дізнаєтесь:**
- Коли використовувати одну чи кілька змінних state
- Чого уникати при організації state
- Як виправити поширені проблеми структури state

---

## Принципи структурування State

Коли ви пишете компоненти зі state, ви повинні вирішити, скільки змінних state використовувати і якою має бути форма їх даних. Дотримуйтесь цих п'яти ключових принципів:

### 1. Групуйте пов'язаний State

Якщо ви завжди оновлюєте дві чи більше змінних state одночасно, об'єднайте їх в одну змінну state.

**Порівняння прикладів:**

Кілька змінних:
```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Одна згрупована змінна:
```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

**Приклад: Рухома точка**
```jsx
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

> **Важливо:** Коли state є об'єктом, ви не можете оновити лише одне поле без копіювання інших. Використовуйте оператор spread: `setPosition({ ...position, x: 100 })` замість `setPosition({ x: 100 })`.

### 2. Уникайте суперечностей у State

Структуруйте state так, щоб запобігти "неможливим" станам, де кілька частин state суперечать одна одній.

**Приклад: Форма зворотного зв'язку готелю (проблемний варіант)**
```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button disabled={isSending} type="submit">
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

**Проблема:** І `isSending`, і `isSent` можуть випадково стати `true` одночасно.

**Рішення: Використовуйте state статусу з трьома допустимими станами** (`'typing'`, `'sending'`, `'sent'`)
```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button disabled={isSending} type="submit">
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

Константи `isSending` та `isSent` є похідними значеннями, а не змінними state, тому вони автоматично залишаються синхронізованими.

### 3. Уникайте надлишкового State

Не зберігайте інформацію в state, якщо ви можете обчислити її з props або існуючих змінних state під час рендерингу.

**Приклад: Форма з надлишковим `fullName` (неправильно)**
```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let's check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

**Рішення: Обчислюйте `fullName` під час рендерингу (правильно)**
```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let's check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

#### Не дзеркальте Props у State

Поширена помилка:
```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

**Проблема:** Якщо батьківський component оновить `messageColor`, state `color` не оновиться, оскільки state ініціалізується лише під час першого рендерингу.

**Рішення:** Використовуйте prop безпосередньо або через const-обгортку:
```js
function Message({ messageColor }) {
  const color = messageColor;
}
```

Якщо ви хочете ігнорувати оновлення prop, використовуйте угоди про іменування:
```js
function Message({ initialColor }) {
  const [color, setColor] = useState(initialColor);
}
```

### 4. Уникайте дублювання в State

Коли ті самі дані дублюються між кількома змінними state або всередині вкладених об'єктів, їх стає важко тримати в синхронізації.

**Приклад: Меню з дубльованим вибором (неправильно)**
```jsx
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

**Проблема:** Об'єкт вибраного елемента існує у двох місцях. Коли ви редагуєте його в списку, окремий `selectedItem` не оновлюється.

**Рішення: Зберігайте ID замість об'єкта і шукайте його (правильно)**
```jsx
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

Тепер `selectedItem` обчислюється під час рендерингу з поточних даних.

### 5. Уникайте глибоко вкладеного State

Глибоко ієрархічний state незручно оновлювати. Віддавайте перевагу плоским структурам.

**Приклад: Вкладений план подорожі (неправильно)**
```js
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      },
      // ... багато більше рівнів вкладеності
    }]
  }]
};
```

Оновлення глибоко вкладеного елемента вимагає копіювання всього ланцюжка.

**Рішення: Зробіть плоску нормалізовану структуру (правильно)**
```js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6, 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  // ... і т.д.
};
```

**Використання плоского state:**
```jsx
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Complete
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    setPlan({
      ...plan,
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}
```

**Перевага:** Оновлення тепер вимагає зміни лише двох рівнів state замість всього батьківського ланцюжка.

---

## Підсумок

**Ключові принципи для хорошої структури state:**
- Групуйте пов'язаний state разом
- Уникайте суперечливих станів
- Видаляйте надлишкові/обчислювані значення
- Усувайте дублювання, зберігаючи ID замість об'єктів
- Робіть плоскими глибоко вкладені структури
- **Мета:** Зробити state якомога простішим — але не простішим за потрібне

---

## Виклики та Рішення

### Виклик 1: Виправити Component, який не оновлюється

**Проблема:** Component Clock не оновлюється при зміні prop color, тому що він дзеркалить prop у state.

```jsx
// Неправильно
export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return <h1 style={{ color: color }}>{props.time}</h1>;
}
```

**Рішення:** Використовуйте prop безпосередньо замість дзеркалювання.

```jsx
// Правильно
export default function Clock({ color, time }) {
  return <h1 style={{ color: color }}>{time}</h1>;
}
```

### Виклик 2: Виправити зламаний список пакування

**Проблема:** Лічильник стає некоректним при позначенні елементів як упакованих або видаленні, тому що `total` та `packed` зберігаються як окремі змінні state і можуть розсинхронізуватися.

**Рішення:** Обчислюйте ці значення з масиву `items`.

```js
const total = items.length;
const packed = items.filter(item => item.packed).length;
```

### Виклик 3: Виправити зникаючий вибір

**Проблема:** Підсвічування зникає після редагування елемента, тому що підсвічений елемент зберігається як об'єкт, який стає застарілим.

**Рішення:** Зберігайте підсвічений ID замість об'єкта.

```js
const [highlightedId, setHighlightedId] = useState(null);
const isHighlighted = letter.id === highlightedId; // Перевірка за ID
```

### Виклик 4: Реалізувати множинний вибір

**Проблема:** Одночасно можна вибрати лише один лист.

**Рішення:** Використовуйте масив (або Set) вибраних ID:

```js
const [selectedIds, setSelectedIds] = useState([]);

function handleToggle(toggledId) {
  if (selectedIds.includes(toggledId)) {
    setSelectedIds(selectedIds.filter(id => id !== toggledId));
  } else {
    setSelectedIds([...selectedIds, toggledId]);
  }
}
```

Або з Set для кращої продуктивності:
```js
const [selectedIds, setSelectedIds] = useState(new Set());

function handleToggle(toggledId) {
  const nextIds = new Set(selectedIds);
  if (nextIds.has(toggledId)) {
    nextIds.delete(toggledId);
  } else {
    nextIds.add(toggledId);
  }
  setSelectedIds(nextIds);
}
```

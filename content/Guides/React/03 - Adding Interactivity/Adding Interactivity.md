# Додавання інтерактивності

## Вступ

Компоненти React повинні реагувати на взаємодію користувача та керувати даними, що змінюються з часом. Це забезпечується через **state** — дані, що змінюються у відповідь на введення користувача. Цей розділ охоплює написання інтерактивних компонентів, які обробляють події, керують state та відображають різний вивід з часом.

### Цілі навчання
- Обробка подій, ініційованих користувачем
- Надання компонентам можливості "запам'ятовувати" інформацію за допомогою state
- Розуміння того, як React оновлює UI у два етапи
- Чому state не оновлюється одразу після його зміни
- Постановка в чергу кількох оновлень state
- Правильне оновлення об'єктів та масивів у state

---

## Реагування на події

React дозволяє додавати **обробники подій** до JSX — функції, що спрацьовують при взаємодії користувача, наприклад, при натисканні, наведенні або фокусуванні на полях форми.

Вбудовані компоненти, такі як `<button>`, підтримують браузерні події, наприклад `onClick`. Користувацькі компоненти можуть приймати props обробників подій з будь-якими іменами, специфічними для додатку.

### Приклад: Користувацькі обробники подій

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

---

## State: Пам'ять компонента

Компоненти повинні "запам'ятовувати" речі — поточні значення введення, вибрані зображення, вміст кошика покупок. У React ця специфічна для компонента пам'ять називається **state**.

### Використання Hook useState

Hook `useState` дозволяє оголосити змінну state. Він приймає початкове значення та повертає:
- Поточне значення state
- Функцію-сетер для його оновлення

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

### Приклад: Галерея зображень зі state

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

---

## Render та Commit

Перш ніж компоненти відобразяться на екрані, React повинен їх відрендерити. Розуміння цього процесу допомагає зрозуміти, як виконується ваш код та як він поводиться.

### Три кроки

1. **Тригер** render (доставка замовлення на кухню)
2. **Render** компонента (підготовка замовлення на кухні)
3. **Commit** у DOM (розміщення замовлення на столі)

---

## State як знімок

State у React поводиться як знімок, а не як звичайна змінна. Встановлення state не змінює існуючу змінну, а запускає повторний render.

```js
console.log(count);  // 0
setCount(count + 1); // Запит на повторний render з 1
console.log(count);  // Все ще 0!
```

### Приклад: Форма чату

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

Значення state залишаються фіксованими всередині обробників подій, навіть якщо вони змінені після відправки.

---

## Постановка в чергу серії оновлень state

Кілька викликів `setState` в одній функції збільшують значення лише один раз, оскільки state — це знімок. Рішення полягає у використанні **функції-оновлювача**.

### Приклад проблеми

```js
function increment() {
  setScore(score + 1);
}

// При виклику тричі:
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1)
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1)
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1)
```

### Рішення: Функції-оновлювачі

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

Замініть `setScore(score + 1)` на `setScore(s => s + 1)` для правильної черги кількох оновлень.

---

## Оновлення об'єктів у state

Об'єкти та масиви слід розглядати як незмінні (immutable). При оновленні створюйте нову копію замість модифікації оригіналу.

Використовуйте синтаксис spread (`...`) для копіювання об'єктів та масивів:

### Приклад: Оновлення вкладених об'єктів

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

### Використання Immer для чистіших оновлень

Для складних вкладених об'єктів використовуйте [Immer](https://github.com/immerjs/use-immer):

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

---

## Оновлення масивів у state

Масиви — це мутабельні об'єкти, які слід розглядати як доступні лише для читання у state. Створюйте новий масив замість модифікації існуючого.

### Приклад: Масив об'єктів

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(initialList);

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

### Використання Immer для масивів

```js
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

---

## Наступні кроки

Почніть з [Responding to Events](Responding%20to%20Events.md), щоб читати цей розділ сторінка за сторінкою, або перейдіть до Managing State, якщо вже знайомі з цими темами.

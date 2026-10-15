# State: Пам'ять компонента

## Вступ

Компоненти повинні "запам'ятовувати" інформацію між взаємодіями — значення полів форми, поточне зображення в каруселі або вміст кошика покупок. У React ця специфічна для компонента пам'ять називається **state**.

### Ви дізнаєтесь
- Як додати змінну state за допомогою Hook `useState`
- Яку пару значень повертає Hook `useState`
- Як додати більше однієї змінної state
- Чому state називається локальним

---

## Коли звичайної змінної недостатньо

Звичайні змінні не працюють для інтерактивних компонентів, тому що:

1. **Локальні змінні не зберігаються між render'ами** — React рендерить компоненти з нуля кожен раз, не враховуючи зміни локальних змінних
2. **Зміни локальних змінних не запускають render** — React не знає, що йому потрібно зробити повторний render з новими даними

### Приклад проблеми
```js
export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;  // Не працює!
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>Next</button>
      <h2><i>{sculpture.name}</i> by {sculpture.artist}</h2>
      <h3>({index + 1} of {sculptureList.length})</h3>
      <img src={sculpture.url} alt={sculpture.alt} />
      <p>{sculpture.description}</p>
    </>
  );
}
```

Це не працює, тому що оновлення `index` не запускає повторний render.

### Рішення
Hook `useState` надає:
1. **Змінну state** для збереження даних між render'ами
2. **Функцію-сетер state** для оновлення змінної та запуску повторного render

---

## Додавання змінної state

### Імпортуйте useState
```js
import { useState } from 'react';
```

### Замініть звичайну змінну на state
```js
// До
let index = 0;

// Після
const [index, setIndex] = useState(0);
```

Синтаксис `[` та `]` — це **деструктуризація масиву**, яка дозволяє зчитувати значення з масиву. `useState` завжди повертає рівно два елементи.

### Оновіть обробник
```js
function handleClick() {
  setIndex(index + 1);
}
```

### Повний робочий приклад
```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>Next</button>
      <h2><i>{sculpture.name}</i> by {sculpture.artist}</h2>
      <h3>({index + 1} of {sculptureList.length})</h3>
      <img src={sculpture.url} alt={sculpture.alt} />
      <p>{sculpture.description}</p>
    </>
  );
}
```

---

## Знайомство з вашим першим Hook

**Hooks** — це спеціальні функції, що починаються з "use" і доступні лише під час render React. Вони дозволяють "підключитися" до різних можливостей React. `useState` — лише один Hook серед багатьох.

### Важливе правило: Розміщення Hooks

> **Hooks — функції, що починаються з `use` — можна викликати лише на верхньому рівні ваших компонентів або ваших власних Hooks.**

Ви не можете викликати Hooks всередині:
- Умов
- Циклів
- Вкладених функцій

Думайте про Hooks як про імпорти на початку файлу — вони є безумовними оголошеннями потреб вашого компонента.

---

## Анатомія useState

Коли ви викликаєте `useState`, ви кажете React, що цей компонент повинен щось запам'ятати:

```js
const [index, setIndex] = useState(0);
```

### Конвенція іменування
Називайте пару як `const [something, setSomething]`. Хоча ви можете назвати їх як завгодно, ця конвенція робить код легшим для розуміння в усіх проєктах.

### Як це працює
Єдиний аргумент `useState` — це **початкове значення** змінної state. У `useState(0)` початкове значення — `0`.

Кожен раз, коли ваш компонент рендериться, `useState` повертає масив з двома значеннями:
1. **Змінна state** зі збереженим значенням
2. **Функція-сетер state** для оновлення змінної та запуску повторного render

### Покроковий потік
1. **Перший render**: З `useState(0)` React повертає `[0, setIndex]` і запам'ятовує `0`
2. **Взаємодія користувача**: `setIndex(1)` каже React запам'ятати, що `index` тепер `1`, і запускає новий render
3. **Другий render**: React все ще бачить `useState(0)`, але повертає `[1, setIndex]`, тому що пам'ятає нове значення
4. **Продовження**: Патерн повторюється з кожним оновленням state

---

## Кілька змінних state

Ви можете мати скільки завгодно змінних state будь-якого типу в одному компоненті:

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>Next</button>
      <h2><i>{sculpture.name}</i> by {sculpture.artist}</h2>
      <h3>({index + 1} of {sculptureList.length})</h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img src={sculpture.url} alt={sculpture.alt} />
    </>
  );
}
```

### Коли об'єднувати state
Якщо ви часто змінюєте дві змінні state разом, розгляньте можливість їх об'єднання в один об'єкт. Для форм з багатьма полями один об'єкт state часто зручніший за кілька окремих змінних state. Дивіться "Вибір структури State" для додаткових порад.

---

## Поглиблено: Як React знає, який state повертати

React не отримує жодного ідентифікатора, що вказує на конкретну змінну state. Натомість Hooks **покладаються на стабільний порядок виклику при кожному render одного й того ж компонента.**

Дотримання правил (виклик Hooks лише на верхньому рівні) гарантує, що Hooks завжди викликаються в одному порядку.

### Внутрішній механізм
Внутрішньо React:
1. Зберігає масив пар state для кожного компонента
2. Підтримує індекс поточної пари (починається з 0)
3. Повертає наступну пару state щоразу, коли ви викликаєте `useState`
4. Збільшує індекс для наступного виклику Hook

### Спрощений приклад (не реальний React)
```js
let componentHooks = [];
let currentHookIndex = 0;

function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // Пара state вже існує, повертаємо її
    currentHookIndex++;
    return pair;
  }

  // Перший render: створюємо пару state
  pair = [initialState, setState];

  function setState(nextState) {
    pair[0] = nextState;
    updateDOM();
  }

  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function updateDOM() {
  currentHookIndex = 0;  // Скидаємо перед render
  let output = Gallery();
  // Оновлюємо DOM відповідно до output
}
```

**Ключовий момент**: Стабільний порядок виклику — причина, чому не можна викликати Hooks умовно. Це зламає порядок, і React не буде знати, який state повертати.

---

## State ізольований та приватний

State є **локальним для екземпляра компонента** на екрані:
- Якщо ви рендерите один і той самий компонент двічі, кожна копія має **повністю ізольований state**
- Зміна одного не впливає на інший
- **Батьківські компоненти не можуть отримати доступ до state дочірніх**
- **State повністю приватний** для компонента, що його оголошує

### Приклад: Дві незалежні галереї
```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}
```

Кожен `<Gallery />` має власний `index` та `showMore` state. Натискання кнопок в одній галереї не впливає на іншу.

### Спільний state між компонентами
Щоб синхронізувати state між компонентами, **видаліть state з дочірніх компонентів та додайте його до їх найближчого спільного батьківського компонента**. Це буде розглянуто в "Спільний state між компонентами".

---

## Підсумок

- Використовуйте змінну state, коли компоненту потрібно "запам'ятати" інформацію між render'ами
- Змінні state оголошуються викликом Hook `useState`
- Hooks — це спеціальні функції, що починаються з "use", які дозволяють "підключитися" до можливостей React
- Hooks повинні викликатися безумовно на верхньому рівні компонента або іншого Hook
- `useState` повертає пару: поточний state та функцію для його оновлення
- Ви можете мати кілька змінних state; React зіставляє їх за порядком виклику
- State приватний для компонента; кожен екземпляр має власний ізольований state

---

## Завдання та рішення

### Завдання 1: Завершіть галерею

**Проблема**: Натискання "Next" на останній скульптурі призводить до помилки. Потрібно додати кнопку "Previous" та запобігти помилкам.

**Рішення:**
```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handlePrevClick} disabled={!hasPrev}>
        Previous
      </button>
      <button onClick={handleNextClick} disabled={!hasNext}>
        Next
      </button>
      <h2><i>{sculpture.name}</i> by {sculpture.artist}</h2>
      <h3>({index + 1} of {sculptureList.length})</h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img src={sculpture.url} alt={sculpture.alt} />
    </>
  );
}
```

### Завдання 2: Виправте застряглі поля вводу

**Проблема**: Поля вводу не оновлюються, тому що використовують звичайні змінні замість state.

**Рішення:**
```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```

### Завдання 3: Виправте помилку

**Проблема**: Компонент падає з помилкою "Rendered fewer hooks than expected", тому що `useState` викликається всередині умови.

**Неправильно:**
```js
const [isSent, setIsSent] = useState(false);
if (isSent) {
  return <h1>Thank you!</h1>;
} else {
  const [message, setMessage] = useState(''); // Всередині умови!
  // ...
}
```

**Правильно:**
```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState(''); // На верхньому рівні

  if (isSent) {
    return <h1>Thank you!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`Sending: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
```

**Ключ**: Всі виклики Hook повинні відбуватися безумовно та в одному порядку перед будь-якими return.

### Завдання 4: Видаліть непотрібний state

**Проблема**: Використання state, коли звичайна змінна працювала б краще, спричиняє затримку відображення alert.

**Неправильно:**
```js
const [name, setName] = useState('');

function handleClick() {
  setName(prompt('What is your name?'));
  alert(`Hello, ${name}!`); // Показує старе значення!
}
```

**Правильно:**
```js
export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('What is your name?');
    alert(`Hello, ${name}!`);
  }

  return <button onClick={handleClick}>Greet</button>;
}
```

**Урок**: State потрібен для збереження інформації між render'ами. Для одиничних обробників подій достатньо звичайних змінних.

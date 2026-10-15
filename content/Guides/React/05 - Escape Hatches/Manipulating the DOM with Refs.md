# Маніпулювання DOM за допомогою Refs

## Огляд

React автоматично оновлює DOM відповідно до результату рендерингу, тому компонентам рідко потрібна пряма маніпуляція DOM. Однак іноді вам потрібен доступ до DOM-елементів для таких дій, як фокусування, прокручування або вимірювання розміру/положення. Ці випадки потребують **refs**.

## Що ви дізнаєтесь

- Як отримати доступ до DOM-вузлів, керованих React, за допомогою атрибута `ref`
- Зв'язок між JSX-атрибутом `ref` та Hook `useRef`
- Як отримати доступ до DOM-вузла іншого компонента
- Коли безпечно змінювати DOM, керований React

---

## Отримання Ref до вузла

### Базове налаштування

Імпортуйте `useRef`:
```js
import { useRef } from 'react';
```

Оголосіть ref всередині компонента:
```js
const myRef = useRef(null);
```

Передайте ref до JSX-елемента:
```js
<div ref={myRef}>
```

Hook `useRef` повертає об'єкт із властивістю `current`. Спочатку `myRef.current` дорівнює `null`. Коли React створює DOM-вузол, він заповнює `myRef.current` посиланням на цей вузол. Потім ви можете отримати до нього доступ через браузерні API:

```js
myRef.current.scrollIntoView();
```

### Приклад: Фокусування текстового поля

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Сфокусувати input
      </button>
    </>
  );
}
```

**Кроки реалізації:**
1. Оголосіть `inputRef` за допомогою Hook `useRef`
2. Передайте його як `<input ref={inputRef}>`, щоб помістити DOM-вузол input в `inputRef.current`
3. В обробнику викличте `inputRef.current.focus()`
4. Передайте обробник до `onClick` кнопки

**Ключовий момент:** Refs можуть зберігати інші значення, крім DOM-вузлів (наприклад, ідентифікатори таймерів). Вони зберігаються між рендерингами без запуску повторного рендерингу. Детальніше див. [[Referencing Values with Refs]].

### Приклад: Прокручування до елемента

Ви можете використовувати кілька refs в одному компоненті. Цей приклад використовує `scrollIntoView()` для центрування зображень:

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>Neo</button>
        <button onClick={handleScrollToSecondCat}>Millie</button>
        <button onClick={handleScrollToThirdCat}>Bella</button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

---

## Керування списками Refs за допомогою Ref Callbacks

### Проблема

Ви **не можете** викликати `useRef` в циклах, умовах або всередині `map()`:

```js
// Не працює!
<ul>
  {items.map((item) => {
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Hooks повинні викликатися лише на верхньому рівні компонента.

### Рішення: Ref Callbacks

Передайте функцію в атрибут `ref`. React викликає цей callback з DOM-вузлом при встановленні ref та з `null` при очищенні. Ви можете підтримувати власний Map або масив:

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Ініціалізація Map при першому використанні.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[8])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat.imageUrl} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catCount = 10;
  const catList = new Array(catCount)
  for (let i = 0; i < catCount; i++) {
    let imageUrl = '';
    if (i < 5) {
      imageUrl = "https://placecats.com/neo/320/240";
    } else if (i < 8) {
      imageUrl = "https://placecats.com/millie/320/240";
    } else {
      imageUrl = "https://placecats.com/bella/320/240";
    }
    catList[i] = {
      id: i,
      imageUrl,
    };
  }
  return catList;
}
```

**Як це працює:**
- `itemsRef` зберігає Map від ідентифікатора елемента до DOM-вузла
- Ref callback оновлює Map при монтуванні та видаляє елементи при демонтуванні
- Пізніше ви можете зчитувати окремі DOM-вузли з Map

> **Примітка:** У Strict Mode (розробка) ref callbacks викликаються двічі для допомоги у пошуку помилок.

---

## Доступ до DOM-вузлів іншого компонента

### Передача Refs між компонентами

Ви можете передавати refs від батьківського до дочірнього компонента, як будь-який prop:

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

Оскільки `<input>` є вбудованим компонентом, React встановлює `ref.current` на фактичний DOM-елемент `<input>`. Тепер батьківський компонент може викликати методи на ньому.

### Повний приклад

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Сфокусувати input
      </button>
    </>
  );
}
```

### Застереження

> Refs -- це аварійний вихід. Ручне маніпулювання DOM-вузлами *іншого* компонента може зробити ваш код крихким.

---

## Надання обмеженого API за допомогою useImperativeHandle

За замовчуванням передача ref до користувацького компонента надає доступ до всього DOM-елемента. Іноді ви хочете обмежити функціональність:

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Надати лише focus і нічого більше
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
}

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Сфокусувати input</button>
    </>
  );
}
```

Тут `inputRef.current` має лише метод `focus` -- а не повний API DOM-елемента.

---

## Коли React прикріплює Refs

React розділяє оновлення на дві фази:

1. **Рендеринг:** React викликає компоненти, щоб визначити, що повинно бути на екрані
2. **Фіксація (commit):** React застосовує зміни до DOM

React встановлює `ref.current`:
- **Перед оновленням DOM:** Встановлює уражені refs в `null`
- **Після оновлення DOM:** Негайно встановлює їх на відповідні DOM-вузли

**Зазвичай отримуйте доступ до refs з обробників подій.** Якщо потрібно щось зробити без конкретної події, використовуйте Effect (обговорюється на наступних сторінках).

---

## Синхронне застосування оновлень state за допомогою flushSync

### Проблема

Коли ви оновлюєте state та негайно отримуєте доступ до ref, DOM ще не оновлений:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView(); // Прокручує до попереднього елемента
```

Оновлення state ставляться в чергу, тому зміна DOM відбувається асинхронно.

### Рішення

Імпортуйте `flushSync` з `react-dom` та оберніть оновлення state:

```js
import { flushSync } from 'react-dom';

function handleAdd() {
  const newTodo = { id: nextId++, text: text };
  flushSync(() => {
    setText('');
    setTodos([ ...todos, newTodo]);
  });
  listRef.current.lastChild.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}
```

Це змушує React оновити DOM синхронно перед виконанням наступного рядка.

### Повний приклад

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(initialTodos);

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Додати
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Завдання #' + (i + 1)
  });
}
```

---

## Найкращі практики маніпулювання DOM за допомогою Refs

Refs -- це **аварійний вихід**. Використовуйте їх лише тоді, коли потрібно "вийти за межі React".

### Безпечні випадки використання
- Керування фокусом
- Прокручування
- Виклик браузерних API, які React не надає

### Небезпечно: Зміна DOM, керованого React

Ручне змінення елементів може конфліктувати зі змінами React:

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button onClick={() => setShow(!show)}>
        Перемкнути через setState
      </button>
      <button onClick={() => {
        ref.current.remove(); // Ручне видалення
      }}>
        Видалити з DOM
      </button>
      {show && <p ref={ref}>Привіт, світе</p>}
    </div>
  );
}
```

Якщо ви вручну видалите елемент, а потім натиснете "Перемкнути через setState", застосунок аварійно завершиться, оскільки React не знає, що елемент зник.

### Безпечно: Зміна некерованих частин

Ви можете безпечно змінювати частини DOM, якими React не керує. Наприклад, якщо `<div>` завжди порожній у JSX, React не торкатиметься його дочірніх елементів, тому безпечно вручну додавати/видаляти елементи там.

---

## Підсумок

- Refs -- це загальна концепція, найчастіше використовується для зберігання DOM-елементів
- Вкажіть React помістити DOM-вузол у `myRef.current`, передавши `<div ref={myRef}>`
- Зазвичай використовуйте refs для неруйнівних дій (фокусування, прокручування, вимірювання)
- Компоненти за замовчуванням не надають свої DOM-вузли; підключіться через prop `ref`
- **Уникайте зміни DOM-вузлів, керованих React**
- Якщо потрібно змінити DOM, керований React, змінюйте лише ті частини, які React не має причин оновлювати

---

## Завдання та рішення

### Завдання 1: Відтворення та пауза відео

Додайте ref до елемента `<video>` та викличте `play()` або `pause()` залежно від state. Для бонусу синхронізуйте кнопку з браузерними елементами керування, використовуючи події `onPlay` та `onPause`.

**Рішення:**
```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Пауза' : 'Відтворити'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

### Завдання 2: Фокусування поля пошуку

Зробіть так, щоб натискання кнопки "Пошук" фокусувало поле вводу.

**Рішення:**
```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Пошук
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Шукаєте щось?"
      />
    </>
  );
}
```

### Завдання 3: Прокручування каруселі зображень

Реалізуйте прокручування до активного зображення при натисканні "Далі". Використовуйте `flushSync`, щоб забезпечити оновлення DOM перед прокручуванням.

**Рішення:**
```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Далі
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ? selectedRef : null}
            >
              <img
                className={index === i ? 'active' : ''}
                src={cat.imageUrl}
                alt={'Кіт #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

### Завдання 4: Фокусування поля пошуку з окремими компонентами

З'єднайте компоненти `SearchButton` та `SearchInput` в окремих файлах за допомогою передачі ref.

**Рішення:**

**src/App.js:**
```js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

**src/SearchButton.js:**
```js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Пошук
    </button>
  );
}
```

**src/SearchInput.js:**
```js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Шукаєте щось?"
    />
  );
}
```

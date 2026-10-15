# useImperativeHandle

## Огляд

`useImperativeHandle` — це React Hook, який дозволяє налаштувати handle, що відкривається як [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

---

## Довідка

### `useImperativeHandle(ref, createHandle, dependencies?)`

Викликайте `useImperativeHandle` на верхньому рівні компонента для налаштування ref handle, який він відкриває:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... ваші методи ...
    };
  }, []);
  // ...
}
```

#### Параметри

* **`ref`**: `ref`, який ви отримали як prop компонента `MyInput`.
* **`createHandle`**: Функція без аргументів, яка повертає ref handle, який ви хочете відкрити. Зазвичай повертає об'єкт з методами.
* **`dependencies`** (необов'язково): Список усіх реактивних значень, на які посилається код `createHandle`. React порівнює кожну залежність з попереднім значенням за допомогою `Object.is`. Якщо залежність змінилася, `createHandle` буде виконана повторно і новий handle буде призначений ref.

> **Примітка**: Починаючи з React 19, [`ref` доступний як prop.`](/blog/2024/12/05/react-19#ref-as-a-prop) У React 18 та раніше потрібно було отримувати `ref` з [`forwardRef`.](/reference/react/forwardRef)

#### Повертає

`useImperativeHandle` повертає `undefined`.

---

## Використання

### Відкриття власного ref handle батьківському компоненту

За замовчуванням компоненти не відкривають свої DOM-вузли батьківським компонентам. Щоб відкрити конкретні методи замість всього DOM-вузла, використовуйте `useImperativeHandle`:

```js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
}
```

Тепер, якщо батьківський компонент отримає ref до `MyInput`, він зможе викликати методи `focus` та `scrollIntoView`. Проте він не матиме повного доступу до DOM-вузла `<input>`.

#### Приклад: Форма з кнопкою редагування

```js
// Form.js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput placeholder="Введіть ваше ім'я" ref={ref} />
      <button type="button" onClick={handleClick}>
        Редагувати
      </button>
    </form>
  );
}
```

---

### Відкриття власних імперативних методів

Методи, які ви відкриваєте через imperativehandle, не обов'язково повинні відповідати методам DOM:

```js
function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Ласкаво просимо до мого блогу!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
}
```

---

## Пастка

> **Не зловживайте refs.** Використовуйте refs лише для *імперативної* поведінки, яку неможливо виразити як props: прокрутка до вузла, фокусування, запуск анімації, виділення тексту тощо.

**Якщо щось можна виразити як prop, не використовуйте ref.** Наприклад, замість відкриття імперативного handle `{ open, close }` з компонента `Modal`, краще приймати `isOpen` як prop: `<Modal isOpen={isOpen} />`.

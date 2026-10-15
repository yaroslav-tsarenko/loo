# createRef

`createRef` створює об'єкт ref, який може містити довільне значення. Він переважно використовується для класових компонентів, тоді як функціональні компоненти повинні використовувати `useRef` замість нього.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

## Довідка

### `createRef()`

Викликайте `createRef`, щоб оголосити ref всередині класового компонента.

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
}
```

#### Параметри

`createRef` не приймає параметрів.

#### Повертає

`createRef` повертає об'єкт з однією властивістю:

* `current`: Початково встановлений у `null`. Пізніше ви можете встановити інше значення. Якщо ви передаєте об'єкт ref до React як атрибут `ref` JSX-вузла, React встановить його властивість `current`.

#### Застереження

* `createRef` завжди повертає *інший* об'єкт. Це еквівалентно написанню `{ current: null }` самостійно.
* У функціональному компоненті вам, ймовірно, потрібен `useRef`, який завжди повертає той самий об'єкт.
* `const ref = useRef()` еквівалентний `const [ref, _] = useState(() => createRef(null))`.

## Використання

### Оголошення ref у класовому компоненті

Щоб оголосити ref всередині класового компонента, викликайте `createRef` та призначте його результат полю класу:

```js
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();
  // ...
}
```

Передайте `ref={this.inputRef}` до JSX-елемента, і React заповнить `this.inputRef.current` DOM-вузлом. Приклад:

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

## Альтернативи

### Міграція з класу з `createRef` до функції з `useRef`

При конвертації класових компонентів у функціональні компоненти замініть `createRef` на `useRef`:

**Класовий компонент (оригінал):**
```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

**Функціональний компонент (конвертований):**
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
        Focus the input
      </button>
    </>
  );
}
```

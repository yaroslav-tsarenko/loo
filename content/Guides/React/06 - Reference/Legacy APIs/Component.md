# Component

## Вступ

`Component` — це базовий клас для React компонентів, визначених як JavaScript класи. Хоча class компоненти все ще підтримуються React, **функціональні компоненти рекомендуються для нового коду**.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

---

## Основні концепції

### Визначення Class Component

Розширте вбудований клас `Component` та визначте метод `render`:

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### Props

Props доступні через `this.props`:

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

### State

State оголошується як поле класу та оновлюється через `this.setState()`:

```js
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

### Context

Для читання context вкажіть `static contextType`:

```js
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

---

## Методи життєвого циклу

### `constructor(props)`

Виконується перед монтуванням компонента. Використовується для ініціалізації стану та прив'язки методів:

```js
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
}
```

**Сучасна альтернатива з синтаксисом публічних полів класу:**

```js
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
}
```

**Застереження:**
- Повинен викликати `super(props)` перед будь-яким іншим оператором
- Не запускайте побічні ефекти в конструкторі
- Не можна викликати `setState` в конструкторі
- Не присвоюйте `this.state` напряму за межами конструктора

### `componentDidMount()`

Викликається, коли компонент додано на екран. Типово для отримання даних, підписок або маніпуляції DOM:

```js
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    // ... логіка налаштування
  }

  destroyConnection() {
    // ... логіка очищення
  }

  render() {
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

### `componentDidUpdate(prevProps, prevState, snapshot?)`

Викликається після повторного рендерингу компонента з оновленими props або state. Використовується для маніпуляції DOM та мережевих запитів:

```js
componentDidUpdate(prevProps, prevState) {
  if (this.props.roomId !== prevProps.roomId) {
    // Обробити зміну prop
  }
}
```

**Застереження:**
- Не викликається для початкового рендеру
- Не буде викликано, якщо `shouldComponentUpdate` повертає `false`
- Уникайте нескінченних циклів, порівнюючи props/state

### `componentWillUnmount()`

Викликається перед видаленням компонента з екрану. Використовується для очищення:

```js
componentWillUnmount() {
  this.destroyConnection();
}
```

Логіка повинна "дзеркалити" те, що робить `componentDidMount`.

---

## Додаткові методи

### `render()`

Єдиний обов'язковий метод. Повертає JSX, що описує, що відображати:

```js
render() {
  return <h1>Hello, {this.props.name}!</h1>;
}
```

**Вимоги:**
- Повинен бути чистою функцією
- Без побічних ефектів
- Може читати `this.props`, `this.state` та `this.context`

**Типи повернення:** React елементи, рядки, числа, portals, `null`, `undefined`, `true`, `false` або масиви

### `setState(nextState, callback?)`

Оновлює стан компонента та запускає повторний рендер:

```js
this.setState({
  name: 'Robin'
});

// Або з функцією (для оновлень на основі попереднього стану):
this.setState(prevState => ({
  age: prevState.age + 1
}));
```

**Важливо:** `setState` є асинхронним; читання `this.state` одразу після виклику не відобразить зміну.

### `forceUpdate(callback?)`

Примусово запускає повторний рендер без виклику `shouldComponentUpdate`:

```js
this.forceUpdate(() => {
  // Цей callback виконується після оновлення
});
```

Уникайте використання; натомість читайте з `this.props` та `this.state` у `render`.

### `shouldComponentUpdate(nextProps, nextState, nextContext)`

Оптимізація продуктивності для пропуску повторного рендерингу:

```js
shouldComponentUpdate(nextProps, nextState) {
  if (
    nextProps.position.x === this.props.position.x &&
    nextProps.position.y === this.props.position.y &&
    nextState.isHovered === this.state.isHovered
  ) {
    return false; // Пропустити повторний рендер
  }
  return true;
}
```

**Альтернативи:** Використовуйте `PureComponent` для поверхневого порівняння або `memo` у функціональних компонентах.

### `getSnapshotBeforeUpdate(prevProps, prevState)`

Викликається безпосередньо перед оновленням DOM. Корисний для захоплення інформації (наприклад, позиції прокрутки):

```js
getSnapshotBeforeUpdate(prevProps, prevState) {
  if (prevProps.list.length < this.props.list.length) {
    const list = this.listRef.current;
    return list.scrollHeight - list.scrollTop;
  }
  return null;
}

componentDidUpdate(prevProps, prevState, snapshot) {
  if (snapshot !== null) {
    const list = this.listRef.current;
    list.scrollTop = list.scrollHeight - snapshot;
  }
}
```

---

## Обробка помилок

### `static getDerivedStateFromError(error)`

Викликається, коли дочірній компонент викидає помилку. Повертає стан для оновлення:

```js
static getDerivedStateFromError(error) {
  return { hasError: true };
}
```

### `componentDidCatch(error, info)`

Викликається, коли дочірній компонент викидає помилку. Використовується для логування помилок:

```js
componentDidCatch(error, info) {
  logErrorToService(error, info.componentStack);
}
```

**Приклад Error Boundary:**

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}
```

---

## Статичні методи

### `static contextType`

Вказує, який context читає компонент:

```js
class Button extends Component {
  static contextType = ThemeContext;
  
  render() {
    const theme = this.context;
    // ...
  }
}
```

### `static defaultProps`

Встановлює значення props за замовчуванням:

```js
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };
}
```

### `static getDerivedStateFromProps(props, state)`

Оновлює стан у відповідь на зміни props (рідкісний випадок):

```js
static getDerivedStateFromProps(props, state) {
  if (props.userID !== state.prevUserID) {
    return {
      prevUserID: props.userID,
      email: props.defaultEmail
    };
  }
  return null;
}
```

---

## Застарілі методи життєвого циклу

Наступні були замінені версіями з префіксом `UNSAFE_`:
- `componentWillMount` -> `UNSAFE_componentWillMount`
- `componentWillReceiveProps` -> `UNSAFE_componentWillReceiveProps`
- `componentWillUpdate` -> `UNSAFE_componentWillUpdate`

---

## Міграція до функціональних компонентів

### Простий компонент

**До (Клас):**
```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

**Після (Функція):**
```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### Компонент зі станом

**До (Клас):**
```js
class Counter extends Component {
  state = { name: 'Taylor', age: 42 };

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

**Після (Функція):**
```js
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  return (
    <>
      <input value={name} onChange={handleNameChange} />
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

### Компонент з методами життєвого циклу

**До (Клас):**
```js
class ChatRoom extends Component {
  state = { serverUrl: 'https://localhost:1234' };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.roomId !== prevProps.roomId) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

**Після (Функція з useEffect):**
```js
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

### Компонент з Context

**До (Клас):**
```js
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    return <button className={'button-' + theme}>{this.props.children}</button>;
  }
}
```

**Після (Функція з useContext):**
```js
import { useContext } from 'react';

function Button({ children }) {
  const theme = useContext(ThemeContext);
  return <button className={'button-' + theme}>{children}</button>;
}
```

---

## Підсумок

Class компоненти залишаються підтримуваними, але не рекомендуються для нового коду. Функціональні компоненти з хуками надають:
- Простіший, більш читабельний синтаксис
- Легше управління станом з `useState`
- Чіткішу логіку ефектів з `useEffect`
- Кращу організацію коду та повторне використання

Для існуючих class компонентів рекомендується поступова міграція до функціональних компонентів.

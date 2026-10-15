# PureComponent

`PureComponent` — це класовий компонент React, який автоматично пропускає повторний рендеринг, коли props та state не змінилися. Однак **React рекомендує використовувати функціональні компоненти замість класових компонентів у новому коді**.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

## Довідка

### `PureComponent`

Щоб пропустити повторний рендеринг класового компонента для тих самих props і state, розширюйте `PureComponent` замість `Component`:

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` є підкласом `Component` і підтримує всі API `Component`. Розширення `PureComponent` еквівалентне визначенню користувацького методу `shouldComponentUpdate()`, який поверхнево порівнює props і state.

## Використання

### Пропуск непотрібних повторних рендерингів для класових компонентів

React зазвичай повторно рендерить компонент щоразу, коли його батьківський компонент рендериться. `PureComponent` оптимізує це, запобігаючи повторним рендерингам, коли props і state не змінилися.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

**Ключові поведінки:**
- Компонент повторно рендериться, коли його props або state змінюються
- Компонент пропускає повторний рендеринг, коли props і state залишаються незмінними
- Компонент все одно повторно відрендериться, якщо зміниться context, який він використовує

### Приклад

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

У цьому прикладі `Greeting` повторно рендериться, коли `name` змінюється, але НЕ коли змінюється `address` (оскільки `address` не передається як prop).

## Альтернативи: Міграція до функціональних компонентів

Рекомендований підхід — використовувати функціональні компоненти з `memo()` замість класового `PureComponent`.

### Оригінальний класовий компонент
```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

### Конвертований у функціональний компонент з `memo()`
```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

**Примітка:** На відміну від `PureComponent`, `memo()` не порівнює новий і старий state. У функціональних компонентах виклик функції `set` з тим самим state вже запобігає повторним рендерингам за замовчуванням, навіть без `memo()`.

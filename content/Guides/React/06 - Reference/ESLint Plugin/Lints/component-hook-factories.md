# component-hook-factories

## Огляд

Це правило перевіряє використання функцій вищого порядку, що визначають вкладені компоненти або hooks. **Компоненти та hooks повинні бути визначені на рівні модуля.**

## Деталі правила

Визначення компонентів або hooks всередині інших функцій створює нові екземпляри при кожному виклику. React розглядає кожен з них як абсолютно інший компонент, знищуючи та перестворюючи все дерево компонентів, втрачаючи весь стан та спричиняючи проблеми з продуктивністю.

## Невалідні приклади

Приклади неправильного коду для цього правила:

```js
// ❌ Фабрична функція, що створює компоненти
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ Компонент, визначений всередині компонента
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Фабрична функція для hook
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

## Валідні приклади

Приклади правильного коду для цього правила:

```js
// ✅ Компонент визначений на рівні модуля
function Component({ defaultValue }) {
  // ...
}

// ✅ Користувацький hook на рівні модуля
function useData(endpoint) {
  // ...
}
```

## Усунення проблем

### Мені потрібна динамічна поведінка компонента

Ви можете подумати, що вам потрібна фабрика для створення налаштованих компонентів:

```js
// ❌ Неправильно: Фабричний патерн
function makeButton(color) {
  return function Button({children}) {
    return (
      <button style={{backgroundColor: color}}>
        {children}
      </button>
    );
  };
}

const RedButton = makeButton('red');
const BlueButton = makeButton('blue');
```

**Рішення:** Замість цього передайте JSX як children:

```js
// ✅ Краще: Передайте JSX як children
function Button({color, children}) {
  return (
    <button style={{backgroundColor: color}}>
      {children}
    </button>
  );
}

function App() {
  return (
    <>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
    </>
  );
}
```

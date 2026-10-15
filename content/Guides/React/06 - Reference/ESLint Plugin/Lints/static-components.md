# static-components

## Огляд

Перевіряє, що компоненти є статичними, а не перестворюються при кожному рендері. Компоненти, які перестворюються динамічно, можуть скидати state та спричиняти надмірний повторний рендеринг.

## Деталі правила

Компоненти, визначені всередині інших компонентів, перестворюються при кожному рендері. React бачить кожен з них як абсолютно новий тип компонента, розмонтовуючи старий та монтуючи новий, знищуючи весь state та DOM-вузли в процесі.

### Невалідні приклади

Приклади неправильного коду для цього правила:

```js
// ❌ Компонент, визначений всередині компонента
function Parent() {
  const ChildComponent = () => { // Новий компонент при кожному рендері!
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };

  return <ChildComponent />; // State скидається при кожному рендері
}

// ❌ Динамічне створення компонента
function Parent({type}) {
  const Component = type === 'button'
    ? () => <button>Click</button>
    : () => <div>Text</div>;

  return <Component />;
}
```

### Валідні приклади

Приклади правильного коду для цього правила:

```js
// ✅ Компоненти на рівні модуля
const ButtonComponent = () => <button>Click</button>;
const TextComponent = () => <div>Text</div>;

function Parent({type}) {
  const Component = type === 'button'
    ? ButtonComponent  // Посилання на існуючий компонент
    : TextComponent;

  return <Component />;
}
```

## Усунення проблем

### Рендеринг різних компонентів умовно

**Проблема:** Ви можете визначати компоненти всередині для доступу до локального state:

```js
// ��� Неправильно: Внутрішній компонент для доступу до state батьківського компонента
function Parent() {
  const [theme, setTheme] = useState('light');

  function ThemedButton() { // Перестворюється при кожному рендері!
    return (
      <button className={theme}>
        Click me
      </button>
    );
  }

  return <ThemedButton />;
}
```

**Рішення:** Передавайте дані як props замість цього:

```js
// ✅ Краще: Передайте props статичному компоненту
function ThemedButton({theme}) {
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

function Parent() {
  const [theme, setTheme] = useState('light');
  return <ThemedButton theme={theme} />;
}
```

> **Примітка:** Якщо ви виявляєте, що хочете визначити компоненти всередині інших компонентів для доступу до локальних змінних, це ознака того, що вам слід передавати props замість цього. Це робить компоненти більш перевикористовуваними та тестованими.

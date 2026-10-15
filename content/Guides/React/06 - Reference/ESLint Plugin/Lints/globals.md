# globals

## Огляд

Правило `globals` перевіряє присвоєння/мутацію глобальних змінних під час рендерингу, як частину забезпечення того, що побічні ефекти повинні виконуватися поза рендерингом.

## Деталі правила

Глобальні змінні існують поза контролем React. Коли ви модифікуєте їх під час рендерингу, ви порушуєте припущення React про те, що рендеринг є чистим. Це може призвести до того, що компоненти поводитимуться по-різному в розробці та продакшені, зламати Fast Refresh та зробити вашу програму неможливою для оптимізації такими функціями, як React Compiler.

## Невалідні приклади

Приклади неправильного коду для цього правила:

```js
// ❌ Глобальний лічильник
let renderCount = 0;
function Component() {
  renderCount++; // Мутація глобальної змінної
  return <div>Count: {renderCount}</div>;
}

// ❌ Модифікація властивостей window
function Component({userId}) {
  window.currentUser = userId; // Глобальна мутація
  return <div>User: {userId}</div>;
}

// ❌ Push у глобальний масив
const events = [];
function Component({event}) {
  events.push(event); // Мутація глобального масиву
  return <div>Events: {events.length}</div>;
}

// ❌ Маніпуляція кешем
const cache = {};
function Component({id}) {
  if (!cache[id]) {
    cache[id] = fetchData(id); // Модифікація кешу під час рендерингу
  }
  return <div>{cache[id]}</div>;
}
```

## Валідні приклади

Приклади правильного коду для цього правила:

```js
// ✅ Використовуйте state для лічильників
function Component() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked: {clickCount} times
    </button>
  );
}

// ✅ Використовуйте context для глобальних значень
function Component() {
  const user = useContext(UserContext);
  return <div>User: {user.id}</div>;
}

// ✅ Синхронізуйте зовнішній стан з React
function Component({title}) {
  useEffect(() => {
    document.title = title; // OK в ефекті
  }, [title]);

  return <div>Page: {title}</div>;
}
```

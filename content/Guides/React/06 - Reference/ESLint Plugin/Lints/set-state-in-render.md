# set-state-in-render

## Огляд

Перевіряє безумовне встановлення state під час рендерингу, що може спричинити додаткові рендери та потенційні нескінченні цикли рендерингу.

## Деталі правила

Виклик `setState` під час рендерингу безумовно запускає ще один рендер до завершення поточного. Це створює нескінченний цикл, який зламає вашу програму.

## Поширені порушення

### Невалідні приклади

```js
// ❌ Безумовний setState безпосередньо під час рендерингу
function Component({value}) {
  const [count, setCount] = useState(0);
  setCount(value); // Нескінченний цикл!
  return <div>{count}</div>;
}
```

### Валідні приклади

```js
// ✅ Виводьте під час рендерингу
function Component({items}) {
  const sorted = [...items].sort(); // Просто обчисліть це під час рендерингу
  return <ul>{sorted.map(/*...*/)}</ul>;
}

// ✅ Встановлюйте state в обробнику подій
function Component() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Виводьте з props замість встановлення state
function Component({user}) {
  const name = user?.name || '';
  const email = user?.email || '';
  return <div>{name}</div>;
}

// ✅ Умовне виведення state з props та state попередніх рендерів
function Component({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) { // Ця умова робить це валідним
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

## Усунення проблем

### Синхронізація state з prop

Поширена проблема — спроба "виправити" state після рендерингу. Наприклад, запобігання перевищенню лічильником значення prop `max`:

**Неправильний підхід:**

```js
// ❌ Неправильно: обмежує під час рендерингу
function Counter({max}) {
  const [count, setCount] = useState(0);

  if (count > max) {
    setCount(max);
  }

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

Як тільки `count` перевищує `max`, запускається нескінченний цикл.

**Правильний підхід:**

Перемістіть логіку в обробник подій, де state вперше встановлюється:

```js
// ✅ Обмежуйте при оновленні
function Counter({max}) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(current => Math.min(current + 1, max));
  };

  return <button onClick={increment}>{count}</button>;
}
```

Тепер setter виконується лише у відповідь на клік, React нормально завершує рендер, і `count` ніколи не перетинає `max`.

**Для рідкісних випадків:** Якщо вам потрібно налаштувати state на основі інформації з попередніх рендерів, використовуйте умовне встановлення state відповідно до патерну зберігання інформації з попередніх рендерів.

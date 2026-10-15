# refs

## Огляд

Це правило перевіряє коректне використання refs у React, гарантуючи, що вони не читаються та не записуються під час рендерингу. Воно забезпечує очікування React щодо того, що refs повинні бути доступні лише в ефектах або обробниках подій.

## Деталі правила

Refs зберігають значення, які не використовуються для рендерингу. На відміну від state, зміна ref не запускає повторний рендеринг. Читання або запис `ref.current` під час рендерингу порушує очікування React, тому що:

- Refs можуть бути не ініціалізовані, коли ви намагаєтесь їх прочитати
- Їхні значення можуть бути застарілими або неконсистентними

## Як виявляються refs

Лінт застосовує правила до значень, ідентифікованих як refs через ці патерни:

1. **Повернуті з `useRef()` або `React.createRef()`**
   ```js
   const scrollRef = useRef(null);
   ```

2. **Ідентифікатори з назвою `ref` або які закінчуються на `Ref`, що звертаються до `.current`**
   ```js
   buttonRef.current = node;
   ```

3. **Передані через JSX prop `ref`**
   ```jsx
   <input ref={inputRef} />
   ```

Після позначення як ref, висновок слідує через присвоєння, деструктуризацію та допоміжні виклики, виявляючи порушення навіть коли `ref.current` доступний всередині іншої функції.

## Поширені порушення

### Невалідні приклади

**Читання ref під час рендерингу:**
```js
function Component() {
  const ref = useRef(0);
  const value = ref.current; // Не читайте під час рендерингу
  return <div>{value}</div>;
}
```

**Модифікація ref під час рендерингу:**
```js
function Component({value}) {
  const ref = useRef(null);
  ref.current = value; // Не модифікуйте під час рендерингу
  return <div />;
}
```

### Валідні приклади

**Читання ref в ефектах/обробниках:**
```js
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.offsetWidth); // OK в ефекті
    }
  });

  return <div ref={ref} />;
}
```

**Використовуйте state для значень UI:**
```js
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

**Лінива ініціалізація значення ref:**
```js
function Component() {
  const ref = useRef(null);

  // Ініціалізація лише один раз при першому використанні
  if (ref.current === null) {
    ref.current = expensiveComputation(); // OK - лінива ініціалізація
  }

  const handleClick = () => {
    console.log(ref.current); // Використання ініціалізованого значення
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## Усунення проблем

### Звичайний об'єкт з `.current` позначений лінтером

Якщо лінт позначає звичайний об'єкт з `.current`, перейменуйте його, щоб уникнути евристики (наприклад, використовуйте `box` замість `ref`). Це запобігає тому, щоб компілятор виводив його як ref. Альтернативно, перемістіть мутабельне значення у state.

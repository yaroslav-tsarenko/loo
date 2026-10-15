# purity

## Огляд

Правило `purity` перевіряє, що компоненти та hooks React є чистими, перевіряючи, що вони не викликають відомі нечисті функції.

## Деталі правила

Компоненти React повинні бути чистими функціями — при тих самих props вони завжди повинні повертати той самий JSX. Коли компоненти використовують функції на кшталт `Math.random()` або `Date.now()` під час рендерингу, вони видають різний результат кожного разу, порушуючи припущення React та спричиняючи помилки, такі як:
- Неспівпадіння при гідратації
- Некоректна мемоізація
- Непередбачувана поведінка

## Поширені порушення

Будь-яке API, яке повертає різне значення для тих самих вхідних даних, порушує це правило. Типові приклади включають:

- `Math.random()`
- `Date.now()` / `new Date()`
- `crypto.randomUUID()`
- `performance.now()`

### Невалідні приклади

```js
// ❌ Math.random() під час рендерингу
function Component() {
  const id = Math.random(); // Різне при кожному рендері
  return <div key={id}>Content</div>;
}

// ❌ Date.now() для значень
function Component() {
  const timestamp = Date.now(); // Змінюється при кожному рендері
  return <div>Created at: {timestamp}</div>;
}
```

### Валідні приклади

```js
// ✅ Стабільні ID з початкового стану
function Component() {
  const [id] = useState(() => crypto.randomUUID());
  return <div key={id}>Content</div>;
}
```

## Усунення проблем

### Відображення поточного часу

**Проблема:** Виклик `Date.now()` під час рендерингу робить ваш компонент нечистим:

```js
// ❌ Неправильно: Час змінюється при кожному рендері
function Clock() {
  return <div>Current time: {Date.now()}</div>;
}
```

**Рішення:** Перемістіть нечисту функцію за межі рендерингу, використовуючи `useState` та `useEffect`:

```js
function Clock() {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Current time: {time}</div>;
}
```

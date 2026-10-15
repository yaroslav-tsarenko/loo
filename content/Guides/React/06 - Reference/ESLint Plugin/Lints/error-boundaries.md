# error-boundaries

## Огляд

Це правило перевіряє використання Error Boundaries замість try/catch для помилок у дочірніх компонентах.

## Деталі правила

Блоки try/catch не можуть перехоплювати помилки, які виникають під час процесу рендерингу React. Помилки, кинуті в методах рендерингу або hooks, піднімаються вгору по дереву компонентів. Лише Error Boundaries можуть перехоплювати ці помилки.

## Невалідні приклади

Try/catch не перехопить помилки рендерингу:

```js
// ❌ Try/catch не перехопить помилки рендерингу
function Parent() {
  try {
    return <ChildComponent />; // Якщо це кине помилку, catch не допоможе
  } catch (error) {
    return <div>Error occurred</div>;
  }
}
```

## Валідні приклади

Використання error boundary:

```js
// ✅ Використання error boundary
function Parent() {
  return (
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );
}
```

## Усунення проблем

### Чому лінтер каже мені не обгортати `use` в `try`/`catch`?

Hook `use` не кидає помилки у традиційному сенсі — він призупиняє виконання компонента. Коли `use` зустрічає незавершений promise, він призупиняє компонент і дозволяє React показати fallback. Лише Suspense та Error Boundaries можуть обробляти ці випадки. Лінтер попереджає проти `try`/`catch` навколо `use`, щоб запобігти плутанині, оскільки блок `catch` ніколи не виконається.

```js
// ❌ Try/catch навколо hook `use`
function Component({promise}) {
  try {
    const data = use(promise); // Не перехопить - `use` призупиняє, а не кидає
    return <div>{data}</div>;
  } catch (error) {
    return <div>Failed to load</div>; // Недосяжний код
  }
}

// ✅ Error boundary перехоплює помилки `use`
function App() {
  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent promise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

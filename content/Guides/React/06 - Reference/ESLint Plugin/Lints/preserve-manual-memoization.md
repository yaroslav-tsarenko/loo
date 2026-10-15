# preserve-manual-memoization

## Огляд

Правило `preserve-manual-memoization` перевіряє, що існуюча ручна мемоізація зберігається React Compiler. Компілятор компілює компоненти та hooks лише якщо його висновки відповідають або перевищують існуючу ручну мемоізацію.

## Деталі правила

React Compiler зберігає ваші існуючі виклики `useMemo`, `useCallback` та `React.memo`. Якщо ви вручну мемоізували щось, компілятор припускає, що у вас була вагома причина, і не видалить це. Однак **неповні залежності заважають компілятору розуміти потік даних вашого коду** та застосовувати подальші оптимізації.

### Невалідні приклади

**Відсутні залежності в useMemo:**
```js
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data] // Відсутня залежність 'filter'
  );

  return <List items={filtered} />;
}
```

**Відсутні залежності в useCallback:**
```js
function Component({ onUpdate, value }) {
  const handleClick = useCallback(() => {
    onUpdate(value);
  }, [onUpdate]); // Відсутній 'value'

  return <button onClick={handleClick}>Update</button>;
}
```

### Валідні приклади

**Повні залежності:**
```js
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data, filter] // Всі залежності включені
  );

  return <List items={filtered} />;
}
```

**Або дозвольте компілятору обробити це:**
```js
function Component({ data, filter }) {
  // Ручна мемоізація не потрібна
  const filtered = data.filter(filter);
  return <List items={filtered} />;
}
```

## Усунення проблем

### Чи варто видаляти ручну мемоізацію?

Ви можете задатися питанням, чи робить React Compiler ручну мемоізацію непотрібною. Ви можете безпечно видалити її, якщо використовуєте React Compiler:

**До:**
```js
function Component({items, sortBy}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }, [items, sortBy]);

  return <List items={sorted} />;
}
```

**Після (краще — дозвольте компілятору оптимізувати):**
```js
function Component({items, sortBy}) {
  const sorted = [...items].sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  return <List items={sorted} />;
}
```

# use-memo

## Огляд

Перевіряє, що hook `useMemo` використовується зі значенням, що повертається. Дивіться документацію `useMemo` для додаткової інформації.

## Деталі правила

`useMemo` призначений для обчислення та кешування дорогих значень, а не для побічних ефектів. Без значення, що повертається, `useMemo` повертає `undefined`, що зводить нанівець його призначення та, ймовірно, вказує на використання неправильного hook.

### Невалідні приклади

Приклади неправильного коду для цього правила:

```js
// ❌ Немає значення, що повертається
function Component({ data }) {
  const processed = useMemo(() => {
    data.forEach(item => console.log(item));
    // Відсутній return!
  }, [data]);

  return <div>{processed}</div>; // Завжди undefined
}
```

### Валідні приклади

Приклади правильного коду для цього правила:

```js
// ✅ Повертає обчислене значення
function Component({ data }) {
  const processed = useMemo(() => {
    return data.map(item => item * 2);
  }, [data]);

  return <div>{processed}</div>;
}
```

## Усунення проблем

### Мені потрібно виконати побічні ефекти при зміні залежностей

Ви можете спробувати використати `useMemo` для побічних ефектів:

```js
// ❌ Неправильно: Побічні ефекти в useMemo
function Component({user}) {
  // Немає значення, що повертається, лише побічний ефект
  useMemo(() => {
    analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);

  // Не присвоєно змінній
  useMemo(() => {
    return analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);
}
```

Якщо побічний ефект має відбуватися у відповідь на взаємодію користувача, розмістіть побічний ефект разом з подією:

```js
// ✅ Добре: Побічні ефекти в обробниках подій
function Component({user}) {
  const handleClick = () => {
    analytics.track('ButtonClicked', {userId: user.id});
    // Інша логіка кліку...
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

Якщо побічний ефект синхронізує стан React з деяким зовнішнім станом (або навпаки), використовуйте `useEffect`:

```js
// ✅ Добре: Синхронізація в useEffect
function Component({theme}) {
  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    document.body.className = theme;
  }, [theme]);

  return <div>Current theme: {theme}</div>;
}
```

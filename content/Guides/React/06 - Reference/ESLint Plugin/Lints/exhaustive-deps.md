# exhaustive-deps

## Вступ

Валідує, що масиви залежностей для React хуків містять усі необхідні залежності.

## Деталі правила

React хуки, як-от `useEffect`, `useMemo` та `useCallback`, приймають масиви залежностей. Коли значення, на яке посилаються всередині цих хуків, не включено в масив залежностей, React не перезапустить effect або не перерахує значення, коли ця залежність зміниться. Це спричиняє застарілі замикання, де хук використовує застарілі значення.

## Типові порушення

Ця помилка часто трапляється, коли ви намагаєтеся "обдурити" React щодо залежностей для контролю часу запуску effect. Effects повинні синхронізувати ваш компонент із зовнішніми системами. Масив залежностей повідомляє React, які значення використовує effect, щоб React знав, коли потрібна повторна синхронізація.

Якщо ви відчуваєте, що боретеся з лінтером, вам ймовірно потрібно переструктурувати свій код. Дивіться "Removing Effect Dependencies" для навчання.

### Невалідні приклади

```js
// ❌ Відсутня залежність
useEffect(() => {
  console.log(count);
}, []); // Відсутній 'count'

// ❌ Відсутній prop
useEffect(() => {
  fetchUser(userId);
}, []); // Відсутній 'userId'

// ❌ Неповні залежності
useMemo(() => {
  return items.sort(sortOrder);
}, [items]); // Відсутній 'sortOrder'
```

### Валідні приклади

```js
// ✅ Усі залежності включені
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ Усі залежності включені
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

## Усунення проблем

### Додавання функціональної залежності спричиняє нескінченні цикли

**Проблема:** У вас є effect, але ви створюєте нову функцію при кожному render:

```js
// ❌ Спричиняє нескінченний цикл
const logItems = () => {
  console.log(items);
};

useEffect(() => {
  logItems();
}, [logItems]); // Нескінченний цикл!
```

**Рішення:**

1. Викликайте функцію там, де відбувається дія:

```js
// ✅ Викличте з event handler
const logItems = () => {
  console.log(items);
};

return <button onClick={logItems}>Log</button>;

// ✅ Або виведіть під час render, якщо немає побічного ефекту
items.forEach(item => {
  console.log(item);
});
```

2. Якщо вам дійсно потрібен effect (наприклад, для підписки на щось зовнішнє), зробіть залежність стабільною:

```js
// ✅ useCallback зберігає посилання на функцію стабільним
const logItems = useCallback(() => {
  console.log(items);
}, [items]);

useEffect(() => {
  logItems();
}, [logItems]);

// ✅ Або перемістіть логіку безпосередньо в effect
useEffect(() => {
  console.log(items);
}, [items]);
```

### Запуск Effect лише один раз

**Проблема:** Ви хочете запустити effect один раз при монтуванні, але лінтер скаржиться на відсутні залежності:

```js
// ❌ Відсутня залежність
useEffect(() => {
  sendAnalytics(userId);
}, []); // Відсутній 'userId'
```

**Рішення:**

```js
// ✅ Включіть залежність (рекомендовано)
useEffect(() => {
  sendAnalytics(userId);
}, [userId]);

// ✅ Або використайте ref guard всередині effect
const sent = useRef(false);

useEffect(() => {
  if (sent.current) {
    return;
  }

  sent.current = true;
  sendAnalytics(userId);
}, [userId]);
```

## Параметри конфігурації

Ви можете налаштувати користувацькі effect хуки за допомогою спільних налаштувань ESLint (доступно в `eslint-plugin-react-hooks` 6.1.1 та пізніше):

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- **`additionalEffectHooks`**: Regex патерн, що відповідає користувацьким хукам, які повинні перевірятися на вичерпність залежностей. Ця конфігурація є спільною для всіх правил `react-hooks`.

Для зворотної сумісності це правило також приймає опцію на рівні правила:

```js
{
  "rules": {
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useAnotherHook)"
    }]
  }
}
```

- **`additionalHooks`**: Regex для хуків, які повинні перевірятися на вичерпність залежностей. **Примітка:** Якщо вказано цю опцію на рівні правила, вона має пріоритет над спільною конфігурацією `settings`.

# useContext

## Огляд

`useContext` — це React Hook, який дозволяє читати та підписуватися на [context](/learn/passing-data-deeply-with-context) з вашого компонента.

```js
const value = useContext(SomeContext)
```

---

## Довідка

### `useContext(SomeContext)`

Викликайте `useContext` на верхньому рівні компонента для читання та підписки на context.

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
}
```

#### Параметри

- `SomeContext`: Context, який ви раніше створили за допомогою [`createContext`](/reference/react/createContext). Сам context не містить інформацію — він лише представляє тип інформації, яку ви можете надавати або читати з компонентів.

#### Повертає

`useContext` повертає значення context для викликаючого компонента. Воно визначається як `value`, передане найближчому `SomeContext` вище по дереву від викликаючого компонента. Якщо такого провайдера немає, повернене значення буде `defaultValue`, яке ви передали до [`createContext`](/reference/react/createContext). Повернене значення завжди актуальне. React автоматично повторно рендерить компоненти, які читають context, якщо він змінюється.

#### Застереження

- Виклик `useContext()` у компоненті не залежить від провайдерів, що повертаються з *того самого* компонента. Відповідний `<Context>` **має бути *вище*** компонента, що викликає `useContext()`.
- React **автоматично повторно рендерить** усіх нащадків, які використовують певний context, починаючи з провайдера, що отримав інше `value`. Попереднє та наступне значення порівнюються за допомогою [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Пропуск повторних рендерів через [`memo`](/reference/react/memo) не запобігає отриманню нащадками свіжих значень context.

---

## Використання

### Передача даних глибоко в дерево

```js
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

`useContext` повертає значення context для переданого context. Для визначення значення context React шукає в дереві компонентів **найближчий провайдер context вище** для цього конкретного context.

Щоб передати context до `Button`, обгорніть його або один з батьківських компонентів у відповідний провайдер context:

```js
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}
```

Не має значення, скільки шарів компонентів між провайдером та `Button`. Коли `Button` *будь-де* всередині `Form` викликає `useContext(ThemeContext)`, він отримає `"dark"` як значення.

> **Пастка:** `useContext()` завжди шукає найближчий провайдер *вище* компонента, який його викликає. Він шукає вгору і **не** враховує провайдери в компоненті, з якого ви викликаєте `useContext()`.

---

### Оновлення даних, переданих через context

Часто потрібно, щоб context змінювався з часом. Щоб оновити context, поєднайте його зі [state](/reference/react/useState). Оголосіть змінну state у батьківському компоненті та передайте поточний state як значення context провайдеру:

```js
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Переключити на світлу тему
      </Button>
    </ThemeContext>
  );
}
```

Тепер будь-який `Button` всередині провайдера отримає поточне значення `theme`. Якщо ви викличете `setTheme` для оновлення значення `theme`, яке передаєте провайдеру, всі компоненти `Button` повторно відрендеряться з новим значенням `'light'`.

---

### Масштабування за допомогою context та reducer

```js
// TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Невідома дія: ' + action.type);
    }
  }
}
```

---

### Вказання значення за замовчуванням

Якщо React не знайде жодного провайдера цього context у батьківському дереві, значення context, повернене `useContext()`, буде дорівнювати значенню за замовчуванням, яке ви вказали при [створенні context](/reference/react/createContext):

```js
const ThemeContext = createContext('light');
```

Значення за замовчуванням **ніколи не змінюється**. Якщо хочете оновлювати context, використовуйте його з state.

---

### Перевизначення context для частини дерева

Ви можете перевизначити context для частини дерева, обгорнувши цю частину в провайдер з іншим значенням.

```js
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

Можна вкладати та перевизначати провайдери скільки завгодно разів.

---

### Оптимізація повторних рендерів при передачі об'єктів та функцій

Якщо значення context — об'єкт з функцією, при кожному повторному рендері `MyApp` це буде *інший* об'єкт, що вказує на *іншу* функцію, і React також повторно відрендерить усі компоненти. Для оптимізації обгорніть функцію в `useCallback`, а створення об'єкта — в `useMemo`:

```js
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

---

## Вирішення проблем

### Мій компонент не бачить значення від провайдера

1. Ви рендерите `<SomeContext>` у тому ж компоненті (або нижче), де викликаєте `useContext()`. Перемістіть `<SomeContext>` *вище та за межі* компонента.
2. Ви могли забути обгорнути компонент у `<SomeContext>`.
3. Проблема збірки — `SomeContext` у провайдері та в читаючому компоненті є двома різними об'єктами.

### Я завжди отримую `undefined` від context

Ви могли мати провайдер без `value` в дереві:

```js
// 🚩 Не працює: немає prop value
<ThemeContext>
   <Button />
</ThemeContext>
```

Або випадково використали інше ім'я prop:

```js
// 🚩 Не працює: prop має називатися "value"
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

Правильно:

```js
// ✅ Передача prop value
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

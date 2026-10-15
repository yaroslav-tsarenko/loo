# Використання TypeScript з React

## Вступ

TypeScript — це популярний спосіб додавання визначень типів до кодових баз JavaScript. З коробки TypeScript підтримує JSX, і ви можете отримати повну підтримку React Web, додавши [`@types/react`](https://www.npmjs.com/package/@types/react) та [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) до вашого проєкту.

### Ви дізнаєтесь

* TypeScript з компонентами React
* Приклади типізації з Hooks
* Поширені типи з `@types/react`
* Ресурси для подальшого навчання

---

## Встановлення

Усі продакшен-фреймворки React підтримують використання TypeScript. Дотримуйтесь специфічного гайду фреймворку для встановлення:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Додавання TypeScript до існуючого проєкту React

Для встановлення останньої версії визначень типів React:

```bash
npm install --save-dev @types/react @types/react-dom
```

Наступні опції компілятора повинні бути встановлені у вашому `tsconfig.json`:

1. `dom` повинен бути включений у [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Примітка: Якщо опція `lib` не вказана, `dom` включається за замовчуванням).
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) повинен бути встановлений на один з допустимих варіантів. `preserve` підійде для більшості застосунків. Якщо ви публікуєте бібліотеку, зверніться до [документації `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) для вибору значення.

---

## TypeScript з компонентами React

> **Примітка:** Кожен файл, що містить JSX, повинен використовувати розширення `.tsx`. Це специфічне для TypeScript розширення, яке повідомляє TypeScript, що файл містить JSX.

Написання TypeScript з React дуже схоже на написання JavaScript з React. Ключова відмінність при роботі з компонентом полягає в тому, що ви можете надавати типи для props вашого компонента. Ці типи можуть використовуватися для перевірки коректності та надання вбудованої документації в редакторах.

### Базовий компонент з вбудованим типом Props

Беручи компонент `MyButton` з гайду Швидкий старт, ми можемо додати тип, що описує `title` для кнопки:

```tsx
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Ласкаво просимо до мого застосунку</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

> **Примітка:** Ці пісочниці можуть обробляти код TypeScript, але не виконують перевірку типів. Це означає, що ви можете змінювати пісочниці TypeScript для навчання, але не отримаєте помилок або попереджень типів. Для перевірки типів ви можете використовувати [TypeScript Playground](https://www.typescriptlang.org/play) або більш повноцінну онлайн-пісочницю.

### Використання Interface для Props

Цей вбудований синтаксис — найпростіший спосіб надати типи для компонента, але коли полів стає більше, він може стати незручним. Замість цього ви можете використовувати `interface` або `type` для опису props компонента:

```tsx
interface MyButtonProps {
  /** Текст для відображення всередині кнопки */
  title: string;
  /** Чи можна взаємодіяти з кнопкою */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Ласкаво просимо до мого застосунку</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

Тип, що описує props вашого компонента, може бути настільки простим або складним, наскільки вам потрібно, але він повинен бути об'єктним типом, описаним за допомогою `type` або `interface`. Ви можете дізнатися, як TypeScript описує об'єкти, в [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html), а також можете зацікавитися використанням [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) для опису prop, який може бути одним з кількох різних типів, та гайдом [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) для більш складних випадків.

---

## Приклади Hooks

Визначення типів з `@types/react` включають типи для вбудованих Hooks, тому ви можете використовувати їх у своїх компонентах без додаткового налаштування. Вони побудовані з урахуванням коду, який ви пишете у компоненті, тому ви часто отримуватимете [виведені типи](https://www.typescriptlang.org/docs/handbook/type-inference.html) і в ідеалі не потребуватимете обробки деталей надання типів.

### `useState`

Hook [`useState`](/reference/react/useState) повторно використовує значення, передане як початковий state, для визначення типу значення. Наприклад:

```ts
// Тип виводиться як "boolean"
const [enabled, setEnabled] = useState(false);
```

Це призначить тип `boolean` для `enabled`, а `setEnabled` буде функцією, що приймає аргумент `boolean` або функцію, яка повертає `boolean`. Якщо ви хочете явно вказати тип для state, ви можете зробити це, надавши аргумент типу виклику `useState`:

```ts
// Явне встановлення типу як "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

Це не дуже корисно у цьому випадку, але поширений випадок, коли ви можете захотіти вказати тип — коли у вас є тип-об'єднання. Наприклад, `status` тут може бути одним з кількох рядків:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Або, як рекомендується в [Принципах структурування state](/learn/choosing-the-state-structure#principles-for-structuring-state), ви можете групувати пов'язаний state як об'єкт та описати різні можливості через об'єктні типи:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer`

Hook [`useReducer`](/reference/react/useReducer) — більш складний Hook, що приймає функцію-редюсер та початковий state. Типи для функції-редюсера виводяться з початкового state. Ви можете необов'язково надати аргумент типу виклику `useReducer` для вказання типу state, але зазвичай краще встановити тип на початковому state:

```tsx
import {useReducer} from 'react';

interface State {
   count: number
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Ласкаво просимо до мого лічильника</h1>

      <p>Рахунок: {state.count}</p>
      <button onClick={addFive}>Додати 5</button>
      <button onClick={reset}>Скинути</button>
    </div>
  );
}
```

Ми використовуємо TypeScript у кількох ключових місцях:

- `interface State` описує форму state редюсера.
- `type CounterAction` описує різні дії, які можуть бути відправлені до редюсера.
- `const initialState: State` надає тип для початкового state, а також тип, який використовується `useReducer` за замовчуванням.
- `stateReducer(state: State, action: CounterAction): State` встановлює типи для аргументів та значення, що повертається, функції-редюсера.

Більш явна альтернатива встановленню типу на `initialState` — надати аргумент типу для `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext`

Hook [`useContext`](/reference/react/useContext) — це техніка передачі даних вниз по дереву компонентів без необхідності передавати props через компоненти. Він використовується шляхом створення компонента-провайдера та часто шляхом створення Hook для споживання значення в дочірньому компоненті.

Тип значення, наданого контекстом, виводиться зі значення, переданого у виклик `createContext`:

```tsx
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext value={theme}>
      <MyComponent />
    </ThemeContext>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Поточна тема: {theme}</p>
    </div>
  )
}
```

Ця техніка працює, коли у вас є значення за замовчуванням, яке має сенс, але іноді бувають випадки, коли його немає, і `null` може здаватися розумним значенням за замовчуванням. Однак, щоб система типів розуміла ваш код, вам потрібно явно встановити `ContextShape | null` у `createContext`.

Це створює проблему — вам потрібно виключити `| null` у типі для споживачів контексту. Наша рекомендація — мати Hook, який виконує перевірку існування під час виконання та кидає помилку, коли значення відсутнє:

```ts
import { createContext, useContext, useState, useMemo } from 'react';

// Це спрощений приклад, але ви можете уявити більш складний об'єкт тут
type ComplexObject = {
  kind: string
};

// Контекст створюється з `| null` у типі для точного відображення значення за замовчуванням.
const Context = createContext<ComplexObject | null>(null);

// `| null` буде видалено через перевірку в Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context value={object}>
      <MyComponent />
    </Context>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Поточний об'єкт: {object.kind}</p>
    </div>
  )
}
```

### `useMemo`

> **Примітка:** [React Compiler](/learn/react-compiler) автоматично мемоїзує значення та функції, зменшуючи потребу в ручних викликах `useMemo`. Ви можете використовувати компілятор для автоматичної обробки мемоїзації.

Hooks [`useMemo`](/reference/react/useMemo) створює/повторно отримує мемоїзоване значення з виклику функції, перезапускаючи функцію лише коли залежності, передані як 2-й параметр, змінюються. Результат виклику Hook виводиться зі значення, що повертається функцією у першому параметрі. Ви можете бути більш явними, надавши аргумент типу для Hook.

```ts
// Тип visibleTodos виводиться зі значення, що повертається filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### `useCallback`

> **Примітка:** [React Compiler](/learn/react-compiler) автоматично мемоїзує значення та функції, зменшуючи потребу в ручних викликах `useCallback`. Ви можете використовувати компілятор для автоматичної обробки мемоїзації.

Hook [`useCallback`](/reference/react/useCallback) надає стабільне посилання на функцію, поки залежності, передані у другому параметрі, залишаються тими самими. Як і `useMemo`, тип функції виводиться зі значення, що повертається функцією у першому параметрі, і ви можете бути більш явними, надавши аргумент типу для Hook.

```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

При роботі в строгому режимі TypeScript `useCallback` вимагає додавання типів для параметрів у вашому зворотному виклику. Це тому, що тип зворотного виклику виводиться зі значення, що повертається функцією, і без параметрів тип не може бути повністю зрозумілий.

Залежно від ваших уподобань стилю коду, ви можете використовувати функції `*EventHandler` з типів React для надання типу обробника подій одночасно з визначенням зворотного виклику:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Значення: {value}</p>
    </>
  );
}
```

---

## Корисні типи

Існує досить широкий набір типів з пакету `@types/react`, який варто прочитати, коли ви відчуєте себе комфортно з взаємодією React та TypeScript. Ви можете знайти їх [у теці React в DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Тут ми розглянемо кілька найпоширеніших типів.

### Події DOM

При роботі з подіями DOM в React тип події часто може бути виведений з обробника подій. Однак коли ви хочете витягти функцію для передачі обробнику подій, вам потрібно буде явно встановити тип події.

```tsx
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Значення: {value}</p>
    </>
  );
}
```

У типах React надається багато типів подій — повний список можна знайти [тут](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373), який базується на [найпопулярніших подіях DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

При визначенні потрібного типу ви можете спочатку переглянути інформацію при наведенні для обробника подій, який ви використовуєте, що покаже тип події.

Якщо вам потрібно використати подію, яка не включена в цей список, ви можете використовувати тип `React.SyntheticEvent`, який є базовим типом для всіх подій.

### Children

Існує два поширені шляхи для опису дочірніх елементів компонента. Перший — використання типу `React.ReactNode`, який є об'єднанням усіх можливих типів, що можуть бути передані як дочірні елементи в JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Це дуже широке визначення дочірніх елементів. Другий — використання типу `React.ReactElement`, який включає лише JSX-елементи, а не JavaScript-примітиви, такі як рядки або числа:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Зверніть увагу, що ви не можете використовувати TypeScript для опису того, що дочірні елементи є певним типом JSX-елементів, тому ви не можете використовувати систему типів для опису компонента, який приймає лише дочірні `<li>`.

Ви можете побачити приклад обох `React.ReactNode` та `React.ReactElement` з перевіркою типів у [цьому TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Props для стилів

При використанні вбудованих стилів в React ви можете використовувати `React.CSSProperties` для опису об'єкта, переданого в prop `style`. Цей тип є об'єднанням усіх можливих CSS-властивостей і є хорошим способом переконатися, що ви передаєте валідні CSS-властивості в prop `style`, та отримати автодоповнення в редакторі.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

---

## Подальше навчання

Цей гайд охопив основи використання TypeScript з React, але є ще багато чого для вивчення. Окремі сторінки API в документації можуть містити більш детальну документацію щодо їх використання з TypeScript.

Ми рекомендуємо наступні ресурси:

- [Посібник TypeScript](https://www.typescriptlang.org/docs/handbook/) — офіційна документація TypeScript, яка охоплює більшість ключових можливостей мови.

- [Примітки до випусків TypeScript](https://devblogs.microsoft.com/typescript/) охоплюють нові функції детально.

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) — шпаргалка, підтримувана спільнотою, для використання TypeScript з React, що охоплює багато корисних крайніх випадків та забезпечує більшу ширину, ніж цей документ.

- [TypeScript Community Discord](https://discord.com/invite/typescript) — чудове місце для запитань та отримання допомоги з проблемами TypeScript та React.

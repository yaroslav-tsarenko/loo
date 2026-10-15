# compilationMode

## Огляд

Параметр `compilationMode` контролює, як React Compiler обирає, які функції компілювати.

```js
{
  compilationMode: 'infer' // або 'annotation', 'syntax', 'all'
}
```

---

## Довідка

### `compilationMode`

Контролює стратегію визначення, які функції React Compiler буде оптимізувати.

#### Тип

```
'infer' | 'syntax' | 'annotation' | 'all'
```

#### Значення за замовчуванням

`'infer'`

#### Варіанти

- **`'infer'`** (за замовчуванням): Компілятор використовує інтелектуальну евристику для ідентифікації React компонентів та хуків:
  - Функції, явно анотовані директивою `"use memo"`
  - Функції, названі як компоненти (PascalCase) або хуки (префікс `use`), ЯКІ створюють JSX та/або викликають інші хуки

- **`'annotation'`**: Компілювати лише функції, явно позначені директивою `"use memo"`. Ідеально для поступового впровадження.

- **`'syntax'`**: Компілювати лише компоненти та хуки, що використовують синтаксис Flow [component](https://flow.org/en/docs/react/component-syntax/) та [hook](https://flow.org/en/docs/react/hook-syntax/).

- **`'all'`**: Компілювати всі функції верхнього рівня. Не рекомендується, оскільки може компілювати функції, що не є React.

#### Застереження

- Режим `'infer'` потребує, щоб функції дотримувалися конвенцій іменування React для їх виявлення
- Використання режиму `'all'` може негативно вплинути на продуктивність, компілюючи утилітні функції
- Режим `'syntax'` потребує Flow і не працює з TypeScript
- Незалежно від режиму, функції з директивою `"use no memo"` завжди пропускаються

---

## Використання

### Режим виведення за замовчуванням

Режим `'infer'` за замовчуванням добре працює для більшості кодових баз, що дотримуються конвенцій React:

```js
{
  compilationMode: 'infer'
}
```

У цьому режимі такі функції будуть скомпільовані:

```js
// ✅ Компілюється: названо як компонент + повертає JSX
function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ Компілюється: названо як хук + викликає хуки
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

// ✅ Компілюється: явна директива
function expensiveCalculation(data) {
  "use memo";
  return data.reduce(/* ... */);
}

// ❌ Не компілюється: не відповідає патерну компонента/хука
function calculateTotal(items) {
  return items.reduce((a, b) => a + b, 0);
}
```

### Поступове впровадження з режимом Annotation

Для поступової міграції використовуйте режим `'annotation'`, щоб компілювати лише позначені функції:

```js
{
  compilationMode: 'annotation'
}
```

Потім явно позначте функції для компіляції:

```js
// Лише ця функція буде скомпільована
function ExpensiveList(props) {
  "use memo";
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Ця функція не буде скомпільована без директиви
function NormalComponent(props) {
  return <div>{props.content}</div>;
}
```

### Використання режиму Flow Syntax

Якщо ваша кодова база використовує Flow замість TypeScript:

```js
{
  compilationMode: 'syntax'
}
```

Потім використовуйте синтаксис компонентів Flow:

```js
// Компілюється: синтаксис компонента Flow
component Button(label: string) {
  return <button>{label}</button>;
}

// Компілюється: синтаксис хука Flow
hook useCounter(initial: number) {
  const [count, setCount] = useState(initial);
  return [count, setCount];
}

// Не компілюється: звичайний синтаксис функції
function helper(data) {
  return process(data);
}
```

### Відключення для конкретних функцій

Незалежно від режиму компіляції, використовуйте `"use no memo"` для пропуску компіляції:

```js
function ComponentWithSideEffects() {
  "use no memo"; // Запобігти компіляції

  // Цей компонент має побічні ефекти, які не повинні бути мемоїзовані
  logToAnalytics('component_rendered');

  return <div>Content</div>;
}
```

---

## Усунення проблем

### Компонент не компілюється в режимі Infer

У режимі `'infer'` переконайтеся, що ваш компонент дотримується конвенцій React:

```js
// ❌ Не буде скомпільований: назва з малої літери
function button(props) {
  return <button>{props.label}</button>;
}

// ✅ Буде скомпільований: назва у PascalCase
function Button(props) {
  return <button>{props.label}</button>;
}

// ❌ Не буде скомпільований: не створює JSX і не викликає хуки
function useData() {
  return window.localStorage.getItem('data');
}

// ✅ Буде скомпільований: викликає хук
function useData() {
  const [data] = useState(() => window.localStorage.getItem('data'));
  return data;
}
```

# Children

## Огляд

API `Children` дозволяє маніпулювати та перетворювати JSX, отриманий як prop `children`. Однак **використання `Children` є нетиповим і може призвести до крихкого коду** — зазвичай переважають альтернативи.

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);
```

---

## Довідка

### `Children.count(children)`

Підраховує кількість дочірніх елементів у структурі даних `children`.

**Параметри:**
- `children`: Значення prop `children`, отриманого вашим компонентом

**Повертає:** Кількість вузлів у цих `children`

**Приклад:**
```js
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

**Застереження:**
- Порожні вузли (`null`, `undefined`, Booleans), рядки, числа та React елементи вважаються окремими вузлами
- Масиви не вважаються окремими вузлами, але їхні дочірні елементи так
- Обхід не заглиблюється далі React елементів; Fragments не обходяться

---

### `Children.forEach(children, fn, thisArg?)`

Виконує код для кожного дочірнього елемента в структурі даних `children` (аналогічно `forEach` масиву).

**Параметри:**
- `children`: Значення prop `children`
- `fn`: Функція для виконання для кожного дочірнього елемента, викликається з `(child, index)`. Індекс починається з `0`
- `thisArg` (необов'язково): Значення `this` для функції

**Повертає:** `undefined`

**Приклад:**
```js
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
}
```

**Застереження:** Ті ж, що й для `Children.count()`

---

### `Children.map(children, fn, thisArg?)`

Перетворює кожний дочірній елемент у структурі даних `children`.

**Параметри:**
- `children`: Значення prop `children`
- `fn`: Функція перетворення, викликається з `(child, index)`. Повинна повертати React вузол
- `thisArg` (необов'язково): Значення `this` для функції

**Повертає:**
- Якщо `children` є `null` або `undefined`, повертає те саме значення
- Інакше повертає плоский масив вузлів (виключаючи `null` та `undefined`)

**Приклад:**
```js
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

**Застереження:**
- Та ж поведінка підрахунку, що й `Children.count()`
- Автоматично комбінує ключі з повернутих елементів з ключами оригінальних дочірніх елементів
- При поверненні кількох елементів з `fn`, їхні ключі повинні бути унікальними лише локально

---

### `Children.only(children)`

Перевіряє, що `children` представляє один React елемент.

**Параметри:**
- `children`: Значення prop `children`

**Повертає:** Елемент, якщо він валідний

**Викидає:** Помилку, якщо умови не виконані

**Приклад:**
```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
}
```

**Застереження:**
- **Завжди викидає помилку, якщо передати масив** (наприклад, повернуте значення `Children.map`)
- Перевіряє, що `children` є одним елементом, а не масивом з одним елементом

---

### `Children.toArray(children)`

Створює масив зі структури даних `children`.

**Параметри:**
- `children`: Значення prop `children`

**Повертає:** Плоский масив елементів у `children`

**Приклад:**
```js
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
}
```

**Застереження:**
- Порожні вузли (`null`, `undefined`, Booleans) пропускаються у поверненому масиві
- Ключі повернутих елементів обчислюються з оригінальних ключів та рівня вкладеності
- Розплющування не вносить змін у поведінку

---

## Приклади використання

### Перетворення Children

```js
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

**Використання:**
```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

#### Чому children не завжди є масивом?

Prop `children` є *непрозорою* структурою даних. React може представляти його як масив або як один елемент внутрішньо. Коли є лише один дочірній елемент, React не створює додатковий масив для ефективності пам'яті. Завжди використовуйте методи `Children` замість прямої інтроспекції `children`.

> **Підводний камінь:** Структура даних `children` **не включає відрендерений вивід** компонентів, які ви передаєте. Якщо ви передаєте `<MoreRows />`, він з'являється як один елемент, а не елементи, які він рендерить. Неможливо отримати відрендерений вивід внутрішніх компонентів при маніпуляції `children`.

---

### Виконання коду для кожного дочірнього елемента

```js
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Видалити останній роздільник
  return result;
}
```

---

### Підрахунок дочірніх елементів

```js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

---

### Перетворення Children у масив

```js
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

---

## Альтернативи API Children

### 1. Надання кількох компонентів

Замість маніпуляції дочірніми елементами, експортуйте окремі компоненти та дозвольте батьківському компоненту вручну їх компонувати:

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

**Перевага:** Працює навіть при виділенні додаткових компонентів (наприклад, `<MoreRows />`), на відміну від `Children.map`.

---

### 2. Прийняття масиву об'єктів як prop

Передавайте дані як структурований масив замість JSX дочірніх елементів:

```js
import { RowList } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

**Перевага:** Дозволяє асоціювати додаткові дані з кожним елементом та використовувати стандартні методи масиву.

---

### 3. Render Props

Передавайте функцію, що повертає JSX, яка викликається за потреби:

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => tabId[0].toUpperCase() + tabId.slice(1)}
      renderContent={tabId => <p>This is the {tabId} item.</p>}
    />
  );
}
```

```js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button key={tabId} onClick={() => setSelectedId(tabId)}>
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

---

## Підсумок

- ✅ Використовуйте методи `Children` помірно; вони часто призводять до крихкого коду
- ✅ Надавайте перевагу експорту компонентів, передачі масивів або використанню render props
- ❌ Не очікуйте, що методи `Children` покажуть відрендерений вивід з дочірніх компонентів
- ✅ Завжди використовуйте методи `Children` замість прямої маніпуляції prop `children`

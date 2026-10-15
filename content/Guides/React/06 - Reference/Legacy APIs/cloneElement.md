# cloneElement

## Огляд

`cloneElement` дозволяє створити новий React елемент, використовуючи інший елемент як відправну точку.

```js
const clonedElement = cloneElement(element, props, ...children)
```

> **Підводний камінь**: Використання `cloneElement` є нетиповим і може призвести до крихкого коду. Дивіться альтернативи.

---

## Довідка

### `cloneElement(element, props, ...children)`

Викликайте `cloneElement` для створення React елемента на основі `element`, але з іншими `props` та `children`:

```js
import { cloneElement } from 'react';

const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

#### Параметри

* **`element`**: Аргумент element повинен бути валідним React елементом. Наприклад, це може бути JSX вузол, як `<Something />`, результат виклику `createElement` або результат іншого виклику `cloneElement`.

* **`props`**: Аргумент props повинен бути об'єктом або `null`. Якщо передати `null`, клонований елемент збереже всі оригінальні `element.props`. Інакше, для кожного prop в об'єкті `props`, повернутий елемент "надаватиме перевагу" значенню з `props` над значенням з `element.props`. Решта props буде заповнена з оригінального `element.props`. Якщо передати `props.key` або `props.ref`, вони замінять оригінальні.

* **`...children`** (необов'язково): Нуль або більше дочірніх вузлів. Вони можуть бути будь-якими React вузлами, включаючи React елементи, рядки, числа, portals, порожні вузли (`null`, `undefined`, `true` та `false`) та масиви React вузлів. Якщо ви не передасте жодних аргументів `...children`, оригінальні `element.props.children` будуть збережені.

#### Повертає

`cloneElement` повертає об'єкт React елемента з:

* `type`: Те ж, що й `element.type`.
* `props`: Результат поверхневого злиття `element.props` з переданими `props`.
* `ref`: Оригінальний `element.ref`, якщо не перевизначено `props.ref`.
* `key`: Оригінальний `element.key`, якщо не перевизначено `props.key`.

#### Застереження

* Клонування елемента **не модифікує оригінальний елемент.**
* Ви повинні **передавати children як множинні аргументи лише якщо вони всі статично відомі**, як `cloneElement(element, null, child1, child2, child3)`. Якщо children динамічні, передайте весь масив як третій аргумент: `cloneElement(element, null, listItems)`. Це забезпечить, що React попередить вас про відсутні `key` для динамічних списків.
* `cloneElement` ускладнює відстеження потоку даних, тому **спробуйте альтернативи.**

---

## Використання

### Перевизначення Props елемента

Щоб перевизначити props React елемента, передайте його в `cloneElement` з props, які хочете перевизначити:

```js
import { cloneElement } from 'react';

const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Результуючий клонований елемент буде `<Row title="Cabbage" isHighlighted={true} />`.

#### Приклад: Список з можливістю вибору

Уявіть компонент `List`, який рендерить своїх `children` як список рядків з можливістю вибору та кнопкою "Next", що змінює обраний рядок. Компонент `List` повинен рендерити обраний `Row` по-іншому, тому він клонує кожний дочірній `<Row>`, що отримав, і додає додатковий prop `isHighlighted: true` або `isHighlighted: false`:

```js
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex
        })
      )}
```

> **Підводний камінь**: Клонування children ускладнює розуміння потоку даних у вашому додатку. Спробуйте одну з альтернатив.

---

## Альтернативи

### 1. Передача даних через Render Prop

Замість використання `cloneElement`, розгляньте прийняття *render prop*, як `renderItem`. Тут `List` отримує `renderItem` як prop. `List` викликає `renderItem` для кожного елемента та передає `isHighlighted` як аргумент:

```js
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

Ви можете передати реалізацію `renderItem`, що рендерить `<Row>` з переданим значенням `isHighlighted`:

```js
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

Кінцевий результат той самий, але ви можете чітко відстежити, звідки приходить значення `isHighlighted`. Цей патерн переважає над `cloneElement`, оскільки він більш явний.

### 2. Передача даних через Context

Інша альтернатива `cloneElement` — передача даних через context.

Наприклад, ви можете викликати `createContext` для визначення `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

Ваш компонент `List` може обгорнути кожен елемент, який він рендерить, у провайдер `HighlightContext`:

```js
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext>
        );
      })}
```

При цьому підході `Row` не потребує отримання prop `isHighlighted`. Натомість він читає context:

```js
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

### 3. Виділення логіки у користувацький хук

Інший підхід — виділити "невізуальну" логіку у власний хук та використовувати інформацію, повернуту хуком, для визначення того, що рендерити:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Потім використовуйте його так:

```js
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

Потік даних є явним, а стан знаходиться всередині користувацького хука `useList`, який можна використовувати з будь-якого компонента. Цей підхід особливо корисний, якщо ви хочете повторно використовувати цю логіку між різними компонентами.

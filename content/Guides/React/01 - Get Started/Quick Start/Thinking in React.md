# Мислення в React

## Вступ

React змінює ваше уявлення про проєктування та створення застосунків. Підхід React включає три ключові кроки:

1. Розбити інтерфейс на частини, які називаються **компонентами**
2. Описати різні візуальні стани для кожного компонента
3. З'єднати компоненти так, щоб дані протікали через них

Цей підручник проведе вас через створення таблиці продуктів з пошуком за допомогою React.

---

## Крок 1: Розбийте UI на ієрархію компонентів

Почніть з малювання рамок навколо кожного компонента в макеті та давайте їм назви. Розглядайте розбиття компонентів з різних підходів:

- **Програмування**: Використовуйте розділення відповідальностей — кожен компонент повинен відповідати за одну річ
- **CSS**: Подумайте, для чого б ви створили CSS-селектори класів
- **Дизайн**: Подумайте, як би ви організували шари дизайну

**Ключовий принцип**: Якщо ваш JSON добре структурований, він природно відповідає структурі компонентів, оскільки UI та моделі даних мають однакову інформаційну архітектуру.

### Приклад розбиття компонентів

Таблиця продуктів має п'ять компонентів:

1. **FilterableProductTable** (сірий) — містить весь застосунок
2. **SearchBar** (синій) — отримує введення користувача
3. **ProductTable** (лавандовий) — відображає та фільтрує список
4. **ProductCategoryRow** (зелений) — відображає заголовок для кожної категорії
5. **ProductRow** (жовтий) — відображає рядок для кожного продукту

### Ієрархія компонентів

```
FilterableProductTable
  ├── SearchBar
  └── ProductTable
      ├── ProductCategoryRow
      └── ProductRow
```

---

## Крок 2: Побудуйте статичну версію в React

Спочатку побудуйте версію, яка рендерить UI з моделі даних без інтерактивності. Цей підхід:
- Вимагає багато набору тексту і мало роздумів
- Полегшує додавання інтерактивності пізніше

Використовуйте props для передачі даних від батьківського до дочірнього компонента. **Ще не використовуйте state** — state призначений лише для інтерактивності.

Можна будувати "зверху вниз" (починаючи з `FilterableProductTable`) або "знизу вверх" (починаючи з `ProductRow`). Зверху вниз зазвичай простіше для простих прикладів.

### Код статичної версії

```jsx
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Назва</th>
          <th>Ціна</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Пошук..." />
      <label>
        <input type="checkbox" />
        {' '}
        Показувати лише товари в наявності
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

Це створює **односторонній потік даних** — дані протікають вниз від компонента верхнього рівня до нижнього.

> **Важливо**: На цьому етапі не використовуйте жодних значень state. Це для наступного кроку!

---

## Крок 3: Знайдіть мінімальне представлення UI State

Зробіть UI інтерактивним за допомогою **state** — мінімального набору змінних даних, які ваш застосунок повинен запам'ятовувати.

**Ключовий принцип**: Тримайте state [DRY (Не повторюйся)](https://uk.wikipedia.org/wiki/Don%27t_repeat_yourself). Зберігайте тільки абсолютно мінімальне представлення та обчислюйте все інше за потребою.

### Визначення State

Задайте ці питання для кожного фрагмента даних:

1. Чи **залишається він незмінним** з часом? — Не state
2. Чи **передається він від батька** через props? — Не state
3. **Чи можна його обчислити** на основі існуючого state або props? — Точно не state

### Аналіз прикладу

Для таблиці продуктів проаналізуйте ці фрагменти даних:

1. **Оригінальний список продуктів** — Передається як props — Не state
2. **Текст пошуку, введений користувачем** — Змінюється з часом, не можна обчислити — **Це state**
3. **Значення чекбоксу** — Змінюється з часом, не можна обчислити — **Це state**
4. **Відфільтрований список продуктів** — Можна обчислити з продуктів, тексту пошуку та чекбоксу — Не state

**Результат**: Тільки текст пошуку та значення чекбоксу є state!

### Props проти State

| Props | State |
|-------|-------|
| Як аргументи функції | Як пам'ять компонента |
| Передають дані від батька до дитини | Відстежують інформацію |
| Дозволяють батьку налаштувати вигляд | Змінюються у відповідь на взаємодію |

Приклад: `Form` передає prop `color` до `Button`; `Button` відстежує state `isHovered`.

---

## Крок 4: Визначте, де повинен жити State

State повинен належати компоненту, який може передати його всім компонентам, що потребують його. Дотримуйтесь цих кроків:

1. Визначте **кожен** компонент, який рендериться на основі цього state
2. Знайдіть їхній **найближчий спільний батьківський** компонент
3. Вирішіть, де розмістити state:
   - Безпосередньо в спільному батьку
   - У компоненті вище спільного батька
   - Створіть новий компонент виключно для зберігання state

### Приклад: Розміщення State таблиці продуктів

**Компоненти, що використовують state:**
- `ProductTable` потрібно фільтрувати на основі тексту пошуку та чекбоксу
- `SearchBar` потрібно відображати текст пошуку та чекбокс

**Спільний батько**: `FilterableProductTable`

**Рішення**: Зберігати state у `FilterableProductTable`

### Додавання State за допомогою hook useState

```js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}
```

> **Примітка:** На цьому етапі поля форми ще не реагують на введення користувача. Консоль показує: "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field."

---

## Крок 5: Додайте зворотний потік даних

Наразі дані протікають вниз по ієрархії. Щоб увімкнути оновлення state з введення користувача, потрібно, щоб дані протікали назад вгору за допомогою **зворотного потоку даних**.

Компоненти глибоко в ієрархії не можуть напряму викликати `setFilterText` або `setInStockOnly` (які належать `FilterableProductTable`). Замість цього передайте ці функції вниз як props.

### Передача функцій-сетерів як Props

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}
```

### Додавання обробників подій у SearchBar

```js
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Пошук..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />
        {' '}
        Показувати лише товари в наявності
      </label>
    </form>
  );
}
```

### Повний робочий застосунок

```jsx
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Назва</th>
          <th>Ціна</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Пошук..."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Показувати лише товари в наявності
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

Тепер застосунок повністю працює! Дізнайтеся більше про [обробку подій та оновлення state](/learn/adding-interactivity).

---

## Куди далі

Цей вступ охоплює мислення про побудову компонентів та застосунків з React. Ви можете:
- [Розпочати проєкт React](/learn/installation)
- [Глибше вивчити весь синтаксис](/learn/describing-the-ui), використаний у цьому підручнику

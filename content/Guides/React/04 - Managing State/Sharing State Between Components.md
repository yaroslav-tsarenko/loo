# Спільне використання State між компонентами

## Вступ

Іноді потрібно, щоб state двох компонентів завжди змінювався разом. Рішення полягає в тому, щоб видалити state з обох компонентів, перемістити його до їх найближчого спільного батька і передати вниз через props. Це називається **"підняття state вгору" (lifting state up)** і є одним з найпоширеніших патернів у розробці на React.

### Цілі навчання
- Як спільно використовувати state між компонентами шляхом підняття його вгору
- Розуміння контрольованих та неконтрольованих компонентів

---

## Підняття State вгору на прикладі

### Початкова проблема: Незалежні панелі

Розглянемо батьківський component `Accordion`, який рендерить два компоненти `Panel`:

> [!diagram] Дві панелі — два незалежні state
> ```yaml
> layout: tree
> nodes:
>   - { id: acc, text: Accordion, tone: gray, icon: "si:SiReact" }
>   - { id: p1, label: "Panel «About»", text: "isActive: false", parent: acc, tone: blue }
>   - { id: p2, label: "Panel «Etymology»", text: "isActive: false", parent: acc, tone: blue }
> steps:
>   - { show: acc, note: "Батьківський компонент Accordion рендерить дві панелі." }
>   - { show: [p1, p2], note: "Кожна Panel має власний state isActive, спершу false — обидві згорнуті." }
>   - { set: { p1: "isActive: true" }, note: "Клік Show у першій панелі — змінюється лише її власний state." }
>   - { set: { p2: "isActive: true" }, note: "Клік у другій — і відкриті обидві: панелі нічого не знають одна про одну. Щоб відкритою була лише одна, state треба підняти в Accordion." }
> ```

Кожен `Panel` має власний булевий state `isActive`:

```jsx
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from алма, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild Malus sieversii is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

**Проблема:** Натискання кнопки однієї панелі не впливає на іншу — вони незалежні. Мета — зробити так, щоб тільки одна панель була розгорнута одночасно.

---

## Три кроки для підняття State вгору

### Крок 1: Видаліть State з дочірніх компонентів

Видаліть виклик `useState` з `Panel`:

```js
// Видаліть це:
const [isActive, setIsActive] = useState(false);

// Оновіть сигнатуру функції, щоб приймати isActive як prop:
function Panel({ title, children, isActive }) {
```

Тепер батьківський component контролює `isActive`, передаючи його як prop. Дочірній component не має контролю над цим значенням.

### Крок 2: Передайте жорстко закодовані дані з спільного батька

Найближчий спільний батько — це component `Accordion`. Він стає "джерелом істини" для того, яка панель є активною. Передайте жорстко закодовані значення `isActive`:

```jsx
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from алма, the Kazakh word for "apple".
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

### Крок 3: Додайте State до спільного батька

Підняття state вгору змінює те, що ви зберігаєте. Замість двох булевих прапорців використовуйте число для відстеження активної панелі:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Передайте цей state разом з обробниками подій:

```jsx
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from алма, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild Malus sieversii is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

---

## Контрольовані та неконтрольовані компоненти

**Неконтрольовані компоненти:** Компоненти з власним локальним state, на який батько не може вплинути. Оригінальний `Panel` з власним state `isActive` є неконтрольованим.

**Контрольовані компоненти:** Компоненти, керовані через props, а не через локальний state. Фінальний `Panel`, контрольований `Accordion`, є контрольованим component.

**Компроміси:**
- Неконтрольовані компоненти простіші у використанні всередині батьків, але менш гнучкі для координації
- Контрольовані компоненти максимально гнучкі, але вимагають від батьків повної конфігурації через props

На практиці більшість компонентів мають поєднання локального state і props. Ви завжди можете рефакторити та змінити свій підхід у міру розвитку застосунку.

---

## Єдине джерело істини для кожного State

У React-застосунках state може жити на різних рівнях:
- Деякий state живе близько до листових компонентів (наприклад, поля введення форми)
- Інший state живе ближче до верхнього рівня застосунку (наприклад, маршрутизація)

**Ключовий принцип:** Для кожної унікальної частини state оберіть, який component нею "володіє". Це називається "єдине джерело істини" (single source of truth).

Замість дублювання спільного state, **піднімайте його вгору** до спільного батька і **передавайте вниз** дочірнім елементам, яким він потрібен.

Переміщення state є звичайною практикою під час розробки. Це частина нормального процесу створення React-застосунків.

---

## Підсумок

- Коли потрібно координувати два компоненти, перемістіть їх state до спільного батька
- Передавайте інформацію вниз через props від спільного батька
- Передавайте обробники подій вниз, щоб дочірні компоненти могли змінювати state батька
- Розглядайте компоненти як "контрольовані" (керовані через props) або "неконтрольовані" (керовані через state)

---

## Практичні завдання

### Завдання 1: Синхронізовані поля введення

Зробіть два незалежні поля введення синхронізованими, піднявши їх state до батька.

**Рішення:** Перемістіть state `text` та обробник `handleChange` у батьківський component, потім передайте їх як props:

```jsx
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

### Завдання 2: Фільтрація списку

Перемістіть state пошукового запиту з `SearchBar` у `FilterableList` для фільтрації списку на основі пошукового введення.

**Рішення:**

```jsx
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

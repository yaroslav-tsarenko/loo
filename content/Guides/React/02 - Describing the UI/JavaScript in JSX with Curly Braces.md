# JavaScript у JSX з фігурними дужками

## Вступ

JSX дозволяє писати HTML-подібну розмітку всередині файлів JavaScript, зберігаючи логіку рендерингу та контент в одному місці. Фігурні дужки `{}` дозволяють додавати логіку JavaScript або посилатися на динамічні властивості всередині JSX-розмітки.

## Цілі навчання

- Передача рядків за допомогою лапок
- Посилання на змінні JavaScript всередині JSX за допомогою фігурних дужок
- Виклик функцій JavaScript всередині JSX за допомогою фігурних дужок
- Використання JavaScript-об'єктів всередині JSX за допомогою фігурних дужок

---

## Передача рядків за допомогою лапок

Рядкові атрибути в JSX використовують одинарні або подвійні лапки:

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

Щоб динамічно задати атрибути, замініть лапки на фігурні дужки:

```js
export default function Avatar() {
  const avatar = 'https://react.dev/images/docs/scientists/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

**Ключова різниця:** `className="avatar"` передає рядковий літерал, тоді як `src={avatar}` читає JavaScript-змінну.

---

## Використання фігурних дужок: вікно в JavaScript

Фігурні дужки дозволяють використовувати JavaScript безпосередньо в JSX-розмітці:

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

Між фігурними дужками працює будь-який JavaScript-вираз, включаючи виклики функцій:

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

### Де використовувати фігурні дужки

Фігурні дужки можна використовувати в JSX двома способами:

1. **Як текст безпосередньо всередині JSX-тегу:** `<h1>{name}'s To Do List</h1>` — працює
   - `<{tag}>text</{tag}>` — не працює

2. **Як атрибути безпосередньо після `=`:** `src={avatar}` — працює
   - `src="{avatar}"` — не працює (передає рядок `"{avatar}"` замість значення)

---

## Використання подвійних фігурних дужок: CSS та об'єкти в JSX

Об'єкти позначаються фігурними дужками. Щоб передати JavaScript-об'єкт у JSX, оберніть його ще однією парою фігурних дужок:

```js
person={{ name: "Hedy Lamarr", inventions: 5 }}
```

### Вбудовані CSS-стилі

React не вимагає вбудованих стилів, але коли вони потрібні, передайте об'єкт в атрибут `style`:

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

Відформатований з переносами рядків, стає зрозуміло, що це JavaScript-об'єкт всередині JSX-дужок:

```js
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

> **Увага:** Вбудовані властивості `style` використовують camelCase, а не kebab-case:
> - HTML: `style="background-color: black"`
> - JSX: `style={{ backgroundColor: 'black' }}`

---

## Більше можливостей з JavaScript-об'єктами та фігурними дужками

Перемістіть кілька виразів в один об'єкт і посилайтеся на них у JSX:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

JSX є мінімалістичною мовою шаблонів, оскільки дозволяє організовувати дані та логіку за допомогою JavaScript.

---

## Підсумок

- Атрибути JSX у лапках передаються як рядки
- Фігурні дужки привносять логіку та змінні JavaScript у розмітку
- Вони працюють всередині вмісту JSX-тегу або безпосередньо після `=` в атрибутах
- `{{ }}` — це не спеціальний синтаксис, а JavaScript-об'єкт всередині фігурних дужок JSX

---

## Практичні завдання та рішення

### Завдання 1: Виправте помилку

**Проблема:** `<h1>{person}'s Todos</h1>` видає помилку "Objects are not valid as a React child".

**Рішення:** Використовуйте `{person.name}` замість цього:

```js
<h1>{person.name}'s Todos</h1>
```

React не може рендерити сирі об'єкти як текстовий вміст. Витягніть конкретну властивість, яка вам потрібна.

### Завдання 2: Витягніть інформацію в об'єкт

**Рішення:** Додайте властивість `imageUrl` до об'єкта `person`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://react.dev/images/docs/scientists/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      {/* ... */}
    </div>
  );
}
```

### Завдання 3: Напишіть вираз всередині фігурних дужок JSX

**Проблема:** `src="{baseUrl}{person.imageId}{person.imageSize}.jpg"` не працює (лапки трактують це як рядковий літерал).

**Рішення:** Використовуйте фігурні дужки з конкатенацією:

```js
const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      {/* ... */}
    </div>
  );
}
```

**Альтернатива:** Витягніть у допоміжну функцію:

```js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

Потім використовуйте: `src={getImageUrl(person)}`

Функції та змінні зберігають розмітку простою та зручною для підтримки.

# Опис UI

## Вступ

React — це бібліотека JavaScript для рендерингу інтерфейсів користувача (UI). UI будується з невеликих одиниць, таких як кнопки, текст та зображення. React дозволяє об'єднувати їх у багаторазово використовувані, вкладені **компоненти**. Від вебсайтів до мобільних додатків — все на екрані можна розбити на компоненти. У цьому розділі ви навчитесь створювати, налаштовувати та умовно відображати компоненти React.

### Ви дізнаєтесь

- Як написати свій перший компонент React
- Коли і як створювати файли з кількома компонентами
- Як додавати розмітку до JavaScript за допомогою JSX
- Як використовувати фігурні дужки з JSX для доступу до функціональності JavaScript з ваших компонентів
- Як налаштовувати компоненти за допомогою props
- Як умовно рендерити компоненти
- Як рендерити кілька компонентів одночасно
- Як уникати заплутаних помилок, зберігаючи компоненти чистими
- Чому розуміння вашого UI як дерев є корисним

---

## Ваш перший компонент

Додатки React будуються з ізольованих частин UI, які називаються **компонентами**. Компонент React — це функція JavaScript, яку ви можете наповнити розміткою. Компоненти можуть бути маленькими як кнопка або великими як ціла сторінка. Ось компонент `Gallery`, який рендерить три компоненти `Profile`:

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

---

## Імпорт та експорт компонентів

Ви можете оголосити багато компонентів в одному файлі, але великі файли можуть бути складними для навігації. Щоб вирішити це, ви можете **експортувати** компонент у власний файл, а потім **імпортувати** цей компонент з іншого файлу:

**App.js:**
```js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

**Gallery.js:**
```js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

**Profile.js:**
```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

---

## Написання розмітки за допомогою JSX

Кожен компонент React — це функція JavaScript, яка може містити деяку розмітку, яку React рендерить у браузер. Компоненти React використовують розширення синтаксису під назвою **JSX** для представлення цієї розмітки. JSX виглядає дуже схоже на HTML, але є трохи суворішим і може відображати динамічну інформацію.

### Неправильний HTML в JSX

Якщо ми вставимо існуючу HTML-розмітку в компонент React, вона не завжди працюватиме:

```js
export default function TodoList() {
  return (
    // Це не зовсім працює!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

### Виправлений JSX

Якщо у вас є існуючий HTML, ви можете виправити його за допомогою конвертера:

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

---

## JavaScript в JSX з фігурними дужками

JSX дозволяє писати HTML-подібну розмітку всередині файлу JavaScript, зберігаючи логіку рендерингу та контент в одному місці. Іноді вам потрібно додати трохи логіки JavaScript або посилання на динамічну властивість всередині цієї розмітки. У цій ситуації ви можете використовувати фігурні дужки у вашому JSX, щоб "відкрити вікно" до JavaScript:

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

---

## Передача props компоненту

Компоненти React використовують **props** для спілкування один з одним. Кожен батьківський компонент може передавати інформацію своїм дочірнім компонентам, надаючи їм props. Props можуть нагадувати вам HTML-атрибути, але через них можна передавати будь-яке значення JavaScript, включаючи об'єкти, масиви, функції і навіть JSX!

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}
```

---

## Умовний рендеринг

Ваші компоненти часто потребують відображення різних речей залежно від різних умов. У React ви можете умовно рендерити JSX, використовуючи синтаксис JavaScript, такий як оператори `if`, `&&` та `? :`.

У цьому прикладі оператор JavaScript `&&` використовується для умовного рендерингу галочки:

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

---

## Рендеринг списків

Часто вам потрібно відображати кілька подібних компонентів з колекції даних. Ви можете використовувати JavaScript-методи `filter()` та `map()` з React для фільтрації та перетворення вашого масиву даних у масив компонентів.

Для кожного елемента масиву вам потрібно вказати `key`. Зазвичай ви захочете використовувати ID з бази даних як `key`. Ключі дозволяють React відстежувати місце кожного елемента в списку, навіть якщо список змінюється.

**App.js:**
```js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

**data.js:**
```js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

---

## Збереження чистоти компонентів

Деякі функції JavaScript є **чистими**. Чиста функція:

- **Займається своєю справою.** Вона не змінює жодних об'єктів чи змінних, які існували до її виклику.
- **Однакові входи, однаковий вихід.** За однакових вхідних даних чиста функція завжди повинна повертати однаковий результат.

Суворо записуючи компоненти як чисті функції, ви можете уникнути цілого класу заплутаних помилок та непередбачуваної поведінки в міру зростання вашої кодової бази.

### Приклад нечистого компонента

```js
let guest = 0;

function Cup() {
  // Погано: зміна попередньо існуючої змінної!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

### Приклад чистого компонента

Ви можете зробити цей компонент чистим, передавши prop замість зміни попередньо існуючої змінної:

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

---

## Ваш UI як дерево

React використовує дерева для моделювання відносин між компонентами та модулями.

**Дерево рендерингу React** — це представлення відносин батьків і дітей між компонентами.

### Приклад дерева рендерингу

Приклад дерева рендерингу React показує кореневий компонент зверху, який рендерить Компонент A та Компонент C. Компонент A рендерить Компонент B, а Компонент C рендерить Компонент D. Компоненти біля вершини дерева, поблизу кореневого компонента, вважаються компонентами верхнього рівня. Компоненти без дочірніх компонентів є листовими компонентами. Ця категоризація компонентів корисна для розуміння потоку даних та продуктивності рендерингу.

### Дерево залежностей модулів

Моделювання відносин між модулями JavaScript — ще один корисний спосіб зрозуміти ваш додаток. Ми називаємо його **деревом залежностей модулів**.

Дерево залежностей часто використовується інструментами збірки для пакування всього відповідного JavaScript-коду для завантаження та рендерингу клієнтом. Великий розмір пакета погіршує користувацький досвід для додатків React. Розуміння дерева залежностей модулів допомагає налагоджувати такі проблеми.

---

## Що далі?

Перейдіть до [[Your First Component|Ваш перший компонент]], щоб почати читати цей розділ сторінка за сторінкою!

Або, якщо ви вже знайомі з цими темами, чому б не прочитати про Додавання інтерактивності?

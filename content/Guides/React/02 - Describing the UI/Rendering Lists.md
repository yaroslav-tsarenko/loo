# Рендеринг списків

## Огляд

Ця сторінка документації навчає, як відображати кілька подібних компонентів з колекції даних, використовуючи методи JavaScript-масивів, зокрема `filter()` та `map()`, в React.

## Ключові цілі навчання

- Як рендерити компоненти з масиву, використовуючи JavaScript `map()`
- Як рендерити лише конкретні компоненти, використовуючи JavaScript `filter()`
- Коли і чому використовувати React keys

## Рендеринг даних з масивів

### Базовий приклад

Починаючи зі статичних елементів списку, ви можете перетворити їх на динамічний рендеринг:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

**Процес:**
1. Перемістіть дані в масив
2. Відобразіть елементи масиву в JSX-вузли за допомогою map
3. Поверніть вузли, обгорнуті в контейнер

## Фільтрація масивів елементів

Структуровані дані дозволяють більш складну фільтрацію:

```js
const people = [{
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
}];

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li key={person.id}>
      <img src={getImageUrl(person)} alt={person.name} />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

## Стрілочні функції в map() — важливий паттерн

**Неявне повернення (без фігурних дужок):**
```js
const listItems = chemists.map(person =>
  <li>...</li> // Неявне повернення!
);
```

**Явне повернення (з фігурними дужками):**
```js
const listItems = chemists.map(person => { // Фігурна дужка
  return <li>...</li>;
});
```

> **Увага:** При використанні синтаксису `=> {` ви повинні явно написати `return`. Інакше нічого не буде повернено.

## Збереження порядку елементів списку за допомогою `key`

### Чому keys важливі

Кожен елемент масиву потребує унікального prop `key`:

```js
<li key={person.id}>...</li>
```

> **Важливо:** JSX-елементи безпосередньо всередині виклику `map()` завжди потребують keys.

### Як працюють keys

Keys повідомляють React, якому елементу масиву відповідає кожен компонент. Це критично важливо, коли елементи можуть:
- Переміщуватися (через сортування)
- Вставлятися
- Видалятися

Добре обраний key допомагає React зрозуміти, що змінилось, та зробити правильні оновлення DOM.

### Джерела keys

- **Дані з бази даних:** Використовуйте ID з бази даних (унікальні за своєю природою)
- **Локально згенеровані дані:** Використовуйте лічильники з автоінкрементом, `crypto.randomUUID()` або пакети на кшталт `uuid`

### Правила keys

- Keys повинні бути **унікальними серед сусідніх елементів** (можна перевикористовувати в різних масивах)
- Keys **не повинні змінюватися** між рендерами
- Не генеруйте keys на льоту (наприклад, `key={Math.random()}`)
- Включайте keys у ваші дані, а не генеруйте їх під час рендерингу

> **Увага:**
> - Використання індексу масиву як key часто призводить до тонких помилок, особливо з переупорядкованими, вставленими або видаленими елементами
> - Keys НЕ передаються компонентам як props — використовуються лише внутрішньо React
> - Якщо компоненту потрібен ID, передайте його як окремий prop: `<Profile key={id} userId={id} />`

## Відображення кількох DOM-вузлів на елемент списку

Використовуйте `<Fragment>` з key, коли кожному елементу потрібні кілька DOM-вузлів:

```js
import { Fragment } from 'react';

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragments зникають з DOM, створюючи плоский список без елементів-обгорток.

## Повний приклад з усіма можливостями

```js
export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );

  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
    </article>
  );
}
```

## Підсумок

- Переміщуйте дані з компонентів у масиви/об'єкти
- Використовуйте `map()` для генерації наборів подібних компонентів
- Використовуйте `filter()` для створення масивів відфільтрованих елементів
- Завжди використовуйте `key` на елементах списку — React використовує його для відстеження компонентів через зміни

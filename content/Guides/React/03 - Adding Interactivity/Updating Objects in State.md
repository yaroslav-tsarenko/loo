# Оновлення об'єктів у state

## Вступ

State може містити будь-яке значення JavaScript, включаючи об'єкти. Проте ви не повинні змінювати об'єкти у state React безпосередньо. Натомість, коли ви хочете оновити об'єкт, створіть новий (або скопіюйте існуючий) і встановіть state для використання цієї копії.

### Цілі навчання
- Як правильно оновлювати об'єкт у state React
- Як оновити вкладений об'єкт без мутації
- Розуміння незмінності (immutability) та як її не порушити
- Використання Immer для зменшення повторюваного коду копіювання

---

## Що таке мутація?

### Примітивні значення (незмінні)

Ви можете зберігати будь-яке значення JavaScript у state:

```js
const [x, setX] = useState(0);
```

Числа, рядки та булеві значення є "незмінними" (immutable) — лише для читання. Ви запускаєте повторний render, замінюючи значення:

```js
setX(5);
```

Число `0` саме по собі не змінюється — ви замінюєте його на `5`. Вбудовані примітивні значення не можна безпосередньо модифікувати в JavaScript.

### Об'єкти (технічно мутабельні, але поводьтеся з ними як з незмінними)

Розглянемо об'єкт у state:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Об'єкти технічно мутабельні, що дозволяє змінювати вміст:

```js
position.x = 5;  // Це мутація
```

**Проте в React ви повинні поводитися з об'єктами state як з незмінними** — як з числами та рядками. Замість мутації завжди замінюйте їх.

---

## Поводьтеся зі state як з доступним лише для читання

Ви повинні **поводитися з будь-яким об'єктом JavaScript у state як з доступним лише для читання**.

### Приклад проблеми: Пряма мутація

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;  // Мутація — не запускає повторний render
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

Червона крапка залишається на початковій позиції, тому що мутація об'єкта не інформує React про зміни. React не виконає повторний render без виклику функції-сетера state.

### Рішення: Створіть новий об'єкт

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Викликаючи `setPosition` з новим об'єктом, ви кажете React:
- Замінити `position` цим новим об'єктом
- Відрендерити компонент знову

Тепер червона крапка слідує за вашим вказівником.

### Поглиблено: Локальна мутація — це нормально

Мутація є проблемою лише коли ви змінюєте **існуючі** об'єкти, які вже є у state. Мутація щойно створеного об'єкта — це нормально:

```js
// Нормально — мутація щойно створеного об'єкта
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Це еквівалентно:

```js
// Теж нормально
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Оскільки жоден інший код не посилається на щойно створений об'єкт, його зміна не вплине ні на що інше. Це називається "локальна мутація" і є цілком прийнятним.

---

## Копіювання об'єктів за допомогою синтаксису spread

Часто ви хочете оновити одне поле, зберігаючи попередні значення інших полів. Наприклад, оновлення лише одного поля форми.

### Проблема: Мутація state форми

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;  // Мутація
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;  // Мутація
  }

  function handleEmailChange(e) {
    person.email = e.target.value;  // Мутація
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  );
}
```

Поля вводу не працюють, тому що ці обробники мутують state без виклику `setState`.

### Рішення: Використовуйте синтаксис spread для об'єктів

Створіть новий об'єкт з оновленим полем(ями):

```js
setPerson({
  firstName: e.target.value,  // Нове ім'я
  lastName: person.lastName,   // Старі значення
  email: person.email
});
```

Або використовуйте оператор spread (`...`) для копіювання існуючих даних:

```js
setPerson({
  ...person,           // Копіюємо всі старі поля
  firstName: e.target.value  // Перевизначаємо це одне
});
```

### Повний робочий приклад

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  );
}
```

Для великих форм зберігання всіх даних згрупованими в об'єкті зручно — за умови правильного оновлення.

### Поглиблено: Використання одного обробника подій

Використовуйте дужкову нотацію для динамічних імен властивостей:

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value  // Динамічне ім'я властивості
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  );
}
```

Тут `e.target.name` посилається на властивість `name` DOM-елемента `<input>`.

---

## Оновлення вкладеного об'єкта

### Приклад структури

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  }
});
```

Щоб оновити вкладену властивість, наприклад `person.artwork.city`, потрібно створити копії на всьому шляху вгору:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Або як один виклик функції:

```js
setPerson({
  ...person,              // Копіюємо інші поля
  artwork: {              // Але замінюємо artwork
    ...person.artwork,    // Тим самим
    city: 'New Delhi'     // Але в Нью-Делі!
  }
});
```

### Повний робочий приклад

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

**Примітка:** Синтаксис spread є "поверхневим" — він копіює лише на один рівень глибини. Для оновлення вкладених властивостей потрібно використовувати spread кілька разів.

### Поглиблено: Об'єкти насправді не вкладені

Об'єкти, що здаються "вкладеними" в коді, насправді є окремими об'єктами, які "вказують" один на одного:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1  // Вказує на obj1
};
```

Об'єкт `obj1` не знаходиться "всередині" `obj2`. Кілька об'єктів можуть вказувати на один і той самий об'єкт:

```js
let obj3 = {
  name: 'Copycat',
  artwork: obj1  // Теж вказує на obj1
};
```

Якщо ви мутуєте `obj3.artwork.city`, це вплине на `obj2.artwork.city` та `obj1.city`, тому що всі вони посилаються на один об'єкт.

---

## Написання лаконічної логіки оновлення з Immer

Для глибоко вкладеного state розгляньте використання [Immer](https://github.com/immerjs/use-immer) — бібліотеки, яка дозволяє писати код зі зручним мутуючим синтаксисом, поки Immer створює копії:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Це виглядає так, ніби ви порушуєте правила незмінності, але насправді не перезаписує попередній state.

### Як працює Immer

`draft`, наданий Immer, — це спеціальний [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), який записує ваші зміни. Під капотом Immer визначає, які частини змінилися, та створює абсолютно новий об'єкт з вашими правками.

### Налаштування

1. Виконайте `npm install use-immer`, щоб додати Immer як залежність
2. Замініть `import { useState } from 'react'` на `import { useImmer } from 'use-immer'`

### Приклад з Immer

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

Обробники подій стають набагато лаконічнішими. Ви можете змішувати `useState` та `useImmer` в одному компоненті за потреби.

### Чому незмінність важлива

1. **Налагодження:** `console.log` не буде перезаписаний змінами state. Ви можете чітко бачити, як state еволюціонував між render'ами.

2. **Оптимізації:** Стратегії оптимізації React, такі як [`memo`](/reference/react/memo), пропускають роботу, якщо попередні props або state збігаються з наступними. Незмінність робить виявлення змін швидким — якщо `prevObj === obj`, нічого не змінилося всередині.

3. **Нові можливості:** Нові можливості React покладаються на state, який поводиться як знімок. Мутації можуть завадити використанню нових можливостей.

4. **Зміни вимог:** Функції, такі як Undo/Redo, показ історії змін або скидання форм, легші, коли нічого не мутується. Ви можете зберігати копії попереднього state в пам'яті та повторно використовувати їх.

5. **Простіша реалізація:** React не потребує перехоплення властивостей, обгортання об'єктів у Proxy або спеціальної ініціалізації. Це дозволяє поміщати будь-який об'єкт у state без проблем з продуктивністю або коректністю.

На практиці ви можете "зійти з рук" з мутацією state в React, але настійно рекомендується цього не робити, щоб мати змогу використовувати нові можливості React, розроблені з урахуванням незмінності.

---

## Підсумок

- Поводьтеся з усім state в React як з незмінним
- Мутація об'єктів не запускає render'и та змінює "знімки" попередніх render'ів
- Створюйте нову версію об'єкта та встановлюйте state для запуску повторного render
- Використовуйте синтаксис spread `{...obj, something: 'newValue'}` для копіювання об'єктів
- Синтаксис spread поверхневий — копіює лише на один рівень глибини
- Для вкладених об'єктів створюйте копії на всьому шляху вгору від точки оновлення
- Використовуйте Immer для зменшення повторюваного коду копіювання

---

## Практичні завдання

Документація включає три інтерактивних завдання:

1. **Виправте неправильні оновлення state** — Знайдіть та виправте помилки в компоненті табло
2. **Знайдіть та виправте мутацію** — Відлагодьте перетягуваний блок зі зміною кольору
3. **Оновіть об'єкт за допомогою Immer** — Перетворіть помилковий приклад на використання Immer

Кожне завдання включає підказки та детальні рішення з поясненнями.

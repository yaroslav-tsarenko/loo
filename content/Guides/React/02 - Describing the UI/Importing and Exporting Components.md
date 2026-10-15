# Імпорт та експорт компонентів

## Вступ

Магія компонентів полягає в їхній багаторазовості: ви можете створювати компоненти, які складаються з інших компонентів. Але коли ви вкладаєте все більше компонентів, часто має сенс почати розділяти їх на різні файли. Це дозволяє тримати файли зручними для перегляду та повторно використовувати компоненти у більшій кількості місць.

## Ви дізнаєтесь

* Що таке файл кореневого компонента
* Як імпортувати та експортувати компонент
* Коли використовувати default та іменований імпорт і експорт
* Як імпортувати та експортувати кілька компонентів з одного файлу
* Як розділити компоненти на кілька файлів

## Файл кореневого компонента

У розділі [[Your First Component|Ваш перший компонент]] ви створили компонент `Profile` та компонент `Gallery`, який його рендерить:

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

Наразі вони знаходяться у **файлі кореневого компонента**, який у цьому прикладі називається `App.js`. Залежно від вашого налаштування, кореневий компонент може бути в іншому файлі. Якщо ви використовуєте фреймворк з маршрутизацією на основі файлів, такий як Next.js, ваш кореневий компонент буде різним для кожної сторінки.

## Експорт та імпорт компонента

Що робити, якщо ви хочете змінити стартовий екран у майбутньому та поставити там список наукових книг? Або розмістити всі профілі десь в іншому місці? Має сенс перемістити `Gallery` та `Profile` з файлу кореневого компонента. Це зробить їх більш модульними та придатними для повторного використання в інших файлах. Ви можете перемістити компонент у три кроки:

1. **Створіть** новий JS-файл для розміщення компонентів.
2. **Експортуйте** ваш функціональний компонент з цього файлу (використовуючи або [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export), або [іменований](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) експорт).
3. **Імпортуйте** його у файл, де ви будете використовувати компонент (використовуючи відповідну техніку для імпорту [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) або [іменованих](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) експортів).

Тут і `Profile`, і `Gallery` були переміщені з `App.js` у новий файл під назвою `Gallery.js`. Тепер ви можете змінити `App.js`, щоб імпортувати `Gallery` з `Gallery.js`:

**src/App.js:**
```js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

**src/Gallery.js:**
```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
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

Зверніть увагу, як цей приклад тепер розбито на два файли компонентів:

1. **Gallery.js:**
   - Визначає компонент `Profile`, який використовується лише в тому самому файлі та не експортується.
   - Експортує компонент `Gallery` як **default експорт.**

2. **App.js:**
   - Імпортує `Gallery` як **default імпорт** з `Gallery.js`.
   - Експортує кореневий компонент `App` як **default експорт.**

> **Примітка:** Ви можете зустріти файли, які опускають розширення `.js`, ось так:
>
> ```js
> import Gallery from './Gallery';
> ```
>
> Обидва варіанти `'./Gallery.js'` або `'./Gallery'` працюють з React, хоча перший ближче до того, як працюють [нативні ES-модулі](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).

## Default проти іменованих експортів

Існує два основних способи експорту значень у JavaScript: default експорт та іменований експорт. До цього часу наші приклади використовували лише default експорти. Але ви можете використовувати один або обидва з них в одному файлі. **Файл може мати не більше одного _default_ експорту, але може мати скільки завгодно _іменованих_ експортів.**

Те, як ви експортуєте компонент, визначає, як ви повинні його імпортувати. Ви отримаєте помилку, якщо спробуєте імпортувати default експорт так само, як іменований! Ця таблиця допоможе вам відстежувати:

| Синтаксис | Оператор експорту | Оператор імпорту |
| --------- | ----------------- | ---------------- |
| Default   | `export default function Button() {}` | `import Button from './Button.js';` |
| Іменований | `export function Button() {}` | `import { Button } from './Button.js';` |

Коли ви пишете _default_ імпорт, ви можете поставити будь-яке ім'я після `import`. Наприклад, ви можете написати `import Banana from './Button.js'`, і це все одно надасть вам той самий default експорт. Навпаки, з іменованими імпортами ім'я повинно збігатися з обох сторін. Ось чому вони називаються _іменованими_ імпортами!

**Люди часто використовують default експорт, якщо файл експортує лише один компонент, і використовують іменований експорт, якщо він експортує кілька компонентів та значень.** Незалежно від стилю кодування, який ви віддаєте перевагу, завжди давайте значущі імена вашим функціям компонентів і файлам, що їх містять. Компоненти без імен, як-от `export default () => {}`, не рекомендуються, оскільки ускладнюють налагодження.

## Експорт та імпорт кількох компонентів з одного файлу

Що робити, якщо ви хочете показати лише один `Profile` замість галереї? Ви можете також експортувати компонент `Profile`. Але `Gallery.js` вже має *default* експорт, і ви не можете мати _два_ default експорти. Ви можете створити новий файл з default експортом або додати *іменований* експорт для `Profile`. **Файл може мати лише один default експорт, але може мати численні іменовані експорти!**

> **Примітка:** Щоб зменшити потенційну плутанину між default та іменованими експортами, деякі команди вирішують дотримуватися лише одного стилю (default або іменований) або уникати їх змішування в одному файлі. Робіть те, що працює найкраще для вас!

Спочатку **експортуйте** `Profile` з `Gallery.js`, використовуючи іменований експорт (без ключового слова `default`):

```js
export function Profile() {
  // ...
}
```

Потім **імпортуйте** `Profile` з `Gallery.js` в `App.js`, використовуючи іменований імпорт (з фігурними дужками):

```js
import { Profile } from './Gallery.js';
```

Нарешті, **відрендеріть** `<Profile />` з компонента `App`:

```js
export default function App() {
  return <Profile />;
}
```

Тепер `Gallery.js` містить два експорти: default експорт `Gallery` та іменований експорт `Profile`. `App.js` імпортує обидва:

**src/App.js:**
```js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

**src/Gallery.js:**
```js
export function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
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

Тепер ви використовуєте суміш default та іменованих експортів:

* **Gallery.js:**
  - Експортує компонент `Profile` як **іменований експорт під назвою `Profile`.**
  - Експортує компонент `Gallery` як **default експорт.**

* **App.js:**
  - Імпортує `Profile` як **іменований імпорт під назвою `Profile`** з `Gallery.js`.
  - Імпортує `Gallery` як **default імпорт** з `Gallery.js`.
  - Експортує кореневий компонент `App` як **default експорт.**

## Підсумок

На цій сторінці ви дізнались:

* Що таке файл кореневого компонента
* Як імпортувати та експортувати компонент
* Коли і як використовувати default та іменований імпорт і експорт
* Як експортувати кілька компонентів з одного файлу

## Завдання: Розділіть компоненти далі

Наразі `Gallery.js` експортує і `Profile`, і `Gallery`, що трохи заплутано.

Перемістіть компонент `Profile` у власний файл `Profile.js`, а потім змініть компонент `App`, щоб рендерити і `<Profile />`, і `<Gallery />` один за одним.

Ви можете використовувати або default, або іменований експорт для `Profile`, але переконайтеся, що використовуєте відповідний синтаксис імпорту і в `App.js`, і в `Gallery.js`! Ви можете звернутися до таблиці:

| Синтаксис | Оператор експорту | Оператор імпорту |
| --------- | ----------------- | ---------------- |
| Default   | `export default function Button() {}` | `import Button from './Button.js';` |
| Іменований | `export function Button() {}` | `import { Button } from './Button.js';` |

### Підказка

Не забудьте імпортувати ваші компоненти там, де вони викликаються. Хіба `Gallery` теж не використовує `Profile`?

### Рішення з іменованими експортами

**src/App.js:**
```js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

**src/Gallery.js:**
```js
import { Profile } from './Profile.js';

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

**src/Profile.js:**
```js
export function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

### Рішення з default експортами

**src/App.js:**
```js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

**src/Gallery.js:**
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

**src/Profile.js:**
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

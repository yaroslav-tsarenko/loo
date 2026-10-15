# Передача props компоненту

## Вступ

Компоненти React використовують **props** для спілкування один з одним. Кожен батьківський компонент може передавати інформацію своїм дочірнім компонентам, надаючи їм props. Props працюють як HTML-атрибути, але можуть передавати будь-яке значення JavaScript, включаючи об'єкти, масиви та функції.

## Ключові моменти навчання

- Як передавати props компоненту
- Як читати props з компонента
- Як задавати значення за замовчуванням для props
- Як передавати JSX компоненту
- Як props змінюються з часом

## Знайомі props

Props — це інформація, яка передається JSX-тегу. Наприклад, `className`, `src`, `alt`, `width` та `height` — це props, які ви можете передати тегу `<img>`:

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://react.dev/images/docs/scientists/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

Props для вбудованих HTML-тегів, таких як `<img>`, є визначеними наперед (відповідно до стандарту HTML). Однак ви можете передавати будь-які props вашим власним компонентам для їхнього налаштування.

## Передача props компоненту

### Крок 1: Передайте props дочірньому компоненту

Передавайте props компоненту так, як ви б задавали HTML-атрибути:

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

> **Примітка:** Подвійні фігурні дужки (наприклад, `person={{...}}`) — це просто об'єкт всередині JSX-дужок.

### Крок 2: Читайте props всередині дочірнього компонента

Читайте props, перераховуючи їхні імена в синтаксисі деструктуризації після імені функції:

```js
function Avatar({ person, size }) {
  // person та size доступні тут
}
```

Повний приклад:

```js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma',
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

Props дозволяють думати про батьківські та дочірні компоненти незалежно. Ви можете змінювати props у батьківському компоненті, не думаючи про те, як дочірній їх використовує, і навпаки.

Функції компонентів React приймають один аргумент — об'єкт `props`. Зазвичай ви його деструктуризуєте:

```js
// З деструктуризацією (переважний спосіб)
function Avatar({ person, size }) {
  // ...
}

// Без деструктуризації
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

> **Важливо:** Не пропустіть пару `{` та `}` фігурних дужок всередині дужок при оголошенні props. Цей синтаксис називається "деструктуризація" і є еквівалентом читання властивостей з параметра функції.

## Задання значення за замовчуванням для prop

Використовуйте синтаксис деструктуризації з `=` для надання значень за замовчуванням:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Тепер, якщо `<Avatar person={...} />` рендериться без prop `size`, `size` буде встановлено на `100`.

> **Примітка:** Значення за замовчуванням використовуються лише якщо prop відсутній або `undefined`. Якщо ви передасте `size={null}` або `size={0}`, значення за замовчуванням НЕ буде використано.

## Пересилання props за допомогою spread-синтаксису JSX

Коли компонент пересилає всі свої props дочірньому без безпосереднього використання, можна використати spread-синтаксис:

```js
// Багатослівний підхід
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}

// Лаконічний підхід зі spread-синтаксисом
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

**Використовуйте spread-синтаксис з обережністю.** Якщо ви використовуєте його в кожному компоненті, щось може бути не так. Часто це вказує на те, що вам слід розділити компоненти та передавати children як JSX.

## Передача JSX як children

Ви можете вкладати власні компоненти так само, як вбудовані HTML-теги:

```js
<Card>
  <Avatar />
</Card>
```

Коли ви вкладаєте контент всередину JSX-тегу, батьківський компонент отримує цей контент у prop під назвою `children`:

```js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

Компонент `Card` не потребує "знання" про те, що рендериться всередині нього. Цей гнучкий паттерн часто використовується для візуальних обгорток, таких як панелі та сітки. Ви можете думати про компонент з prop `children` як про такий, що має "отвір", який може бути "заповнений" його батьком довільним JSX.

## Як props змінюються з часом

Props не є статичними — вони можуть змінюватися з часом, коли компонент отримує різні значення:

```js
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

У цьому прикладі prop `time` змінюється кожну секунду, а prop `color` змінюється, коли користувач вибирає інший колір.

**Props є незмінними (immutable)** — ви не можете змінювати їх безпосередньо. Коли компонент потребує зміни своїх props (у відповідь на дію користувача або нові дані), він повинен попросити батьківський компонент передати інші props. Старі props потім відкидаються та збираються збирачем сміття.

**Не намагайтеся "змінювати props".** Коли вам потрібно реагувати на введення користувача, вам потрібно використовувати "state" (стан).

## Підсумок

- Щоб передати props, додайте їх до JSX як HTML-атрибути
- Щоб прочитати props, використовуйте синтаксис деструктуризації: `function Avatar({ person, size })`
- Задавайте значення за замовчуванням: `size = 100`
- Пересилайте всі props за допомогою spread-синтаксису: `<Avatar {...props} />`
- Вкладений JSX, як `<Card><Avatar /></Card>`, з'являється як prop `children` компонента `Card`
- Props є знімками лише для читання у часі — кожен рендер отримує нову версію
- Ви не можете змінювати props; використовуйте state для інтерактивності

## Завдання та рішення

### Завдання 1: Витягніть компонент

Витягніть багаторазово використовуваний компонент `Profile` для зменшення дублювання:

```js
function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}
```

### Завдання 2: Налаштуйте розмір зображення на основі prop

Визначте розмір мініатюри зображення на основі prop `size`:

```js
function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

### Завдання 3: Передайте JSX у prop children

Витягніть компонент `Card` для обгортання різного контенту:

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://react.dev/images/docs/scientists/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist...</p>
      </Card>
    </div>
  );
}
```

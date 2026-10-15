# `cache`

## Огляд

`cache` — це функція React, яка кешує результат отримання даних або обчислення. Вона **призначена лише для використання з React Server Components**.

```js
const cachedFn = cache(fn);
```

---

## Довідка

### `cache(fn)`

Викликайте `cache` поза будь-якими компонентами, щоб створити кешовану версію функції.

```js
import { cache } from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Коли `getMetrics` вперше викликається з `data`, він викликає `calculateMetrics(data)` та зберігає результат. Подальші виклики з тими самими `data` повертають кешований результат замість повторного виконання функції.

#### Параметри
- `fn`: Функція, для якої кешуються результати. Може приймати будь-які аргументи та повертати будь-яке значення.

#### Повертає
Кешовану версію `fn` з тією самою сигнатурою типу. Функція не викликається під час самого виклику `cache()` — лише при виклику повернутої кешованої функції.

При виклику `cachedFn`:
1. Перевіряє, чи існує кешований результат для аргументів
2. Якщо так, повертає кешований результат
3. Якщо ні, викликає `fn` з аргументами, зберігає результат та повертає його

> **Примітка**: Ця оптимізація називається [_мемоїзація_](https://en.wikipedia.org/wiki/Memoization).

#### Застереження

- React інвалідує кеш для всіх мемоїзованих функцій при кожному серверному запиті
- Кожен виклик `cache()` створює нову функцію з власним окремим кешем
- `cachedFn` також кешує помилки — якщо `fn` кидає помилку для певних аргументів, ця помилка кешується та повторно кидається при наступних викликах з тими самими аргументами
- `cache` призначений **лише для Server Components**

---

## Використання

### Кешування ресурсомісткого обчислення

Пропускайте дублювання роботи, кешуючи ресурсомісткі обчислення:

```js
import { cache } from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

Якщо той самий об'єкт `user` рендериться у `Profile` та `TeamReport`, вони розділяють роботу і `calculateUserMetrics` викликається лише один раз на користувача.

**Процес:**
1. `Profile` рендериться першим, викликає `getUserMetrics(user)` — промах кешу — викликає `calculateUserMetrics(user)` — зберігає результат
2. `TeamReport` рендериться, викликає `getUserMetrics(user)` — влучення в кеш — повертає кешований результат

#### Увага: Різні мемоїзовані функції використовують різні кеші

Компоненти повинні викликати **ту саму мемоїзовану функцію** для доступу до одного кешу.

**Неправильно:**
```js
// Temperature.js
import { cache } from 'react';
import { calculateWeekReport } from './report';

export function Temperature({cityData}) {
  // Створює новий кеш при кожному рендері
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

**Правильно:**
```js
// getWeekReport.js
import { cache } from 'react';
import { calculateWeekReport } from './report';

export default cache(calculateWeekReport);
```

```js
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

```js
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

Обидва компоненти тепер викликають ту саму мемоїзовану функцію та розділяють один кеш.

---

### Розділення знімка даних

Кешуйте функції отримання даних для розділення знімків даних між компонентами:

```js
import { cache } from 'react';
import { fetchTemperature } from './api.js';

const getTemperature = cache(async (city) => {
  return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}

async function MinimalWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```

Якщо обидва компоненти рендеряться для одного `city`, вони отримують той самий знімок даних з мемоїзованої функції. `city` діє як ключ кешу — різні міста призводять до окремих викликів `fetchTemperature`.

> **Примітка**: Асинхронний рендеринг підтримується лише для Server Components. Для Client Components дивіться документацію [`use()`](/reference/react/use).

---

### Попереднє завантаження даних

Запускайте асинхронну роботу до рендерингу компонента:

```jsx
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // Починаємо отримання даних користувача
  getUser(id);
  // ... деяка обчислювальна робота
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

`Page` викликає `getUser(id)` без очікування, запускаючи запит до бази даних під час виконання іншої роботи. Коли `Profile` пізніше викликає `getUser(id)` та очікує результат, дані вже кешовані, що усуває затримку отримання.

#### Кешування асинхронної роботи (поглиблено)

Асинхронні функції повертають Promise, що представляє стан роботи (очікування, виконано, невдача):

```js
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... обчислювальна робота
  await getData();
  // ...
}
```

- Перший виклик `getData()`: повертає Promise, ініціює `fetch`, кешує Promise
- Другий `await getData()`: повертає той самий кешований Promise
  - Якщо все ще очікує, `await` призупиняє до вирішення
  - Якщо вже вирішено, `await` повертає результат негайно

Це зменшує час очікування, дозволяючи React виконувати обчислювальну роботу, поки Promise очікує.

#### Увага: Виклик мемоїзованих функцій поза компонентами

```jsx
import { cache } from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// Неправильно: Кеш не використовується поза компонентами
getUser('demo-id');

async function DemoProfile() {
  // Правильно: Кеш використовується тут
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

Доступ до кешу надається через контекст, який доступний лише з компонентів. Виклик мемоїзованих функцій поза компонентами виконує функцію, але не використовує кеш.

---

## `cache` vs `memo` vs `useMemo` (поглиблено)

### `useMemo`
- **Використовується для:** Кешування ресурсомістких обчислень у Client Components між повторними рендерами
- **Область кешу:** Локальна для екземпляра компонента
- **Інвалідація:** При зміні залежностей

```jsx
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), [record]);
  // ...
}
```

### `cache`
- **Використовується для:** Мемоїзації роботи, розділеної між Server Components, особливо отримання даних
- **Область кешу:** Розділяється між усіма компонентами в рендері
- **Інвалідація:** Між серверними запитами

```js
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}
```

### `memo`
- **Використовується для:** Запобігання повторному рендерингу компонента, коли пропси не змінилися
- **Мемоїзує:** Рендеринг компонента на основі пропсів
- **Інвалідація:** При зміні пропсів

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);
```

---

## Усунення проблем

### Мемоїзована функція все ще виконується з тими самими аргументами

**Поширені причини:**

1. **Різні мемоїзовані функції** (див. вище)
2. **Виклик поза компонентом** (див. вище)
3. **Непримітивні аргументи** не використовують одне посилання

React використовує поверхневу рівність (`Object.is`) для перевірки збігу аргументів. Непримітивні аргументи (об'єкти, масиви, функції) повинні бути **тим самим посиланням**.

**Проблема:**
```js
import { cache } from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // props змінюється кожен рендер
  const length = calculateNorm(props);
  // ...
}
```

**Рішення 1: Передайте примітиви**
```js
function MapMarker(props) {
  // Примітиви порівнюються за значенням
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}
```

**Рішення 2: Передайте те саме посилання на об'єкт**
```js
function MapMarker(props) {
  // Те саме посилання на об'єкт vector
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```

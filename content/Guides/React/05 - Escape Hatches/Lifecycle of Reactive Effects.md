# Життєвий цикл реактивних Effects

## Вступ

Effects мають інший життєвий цикл, ніж компоненти. Компоненти можуть монтуватися, оновлюватися або демонтуватися. Effect може робити лише дві речі: почати синхронізацію чогось і пізніше зупинити синхронізацію. React надає правило лінтера для перевірки правильності вказання залежностей Effect.

## Цілі навчання

- Чим життєвий цикл Effect відрізняється від життєвого циклу компонента
- Як думати про кожен окремий Effect ізольовано
- Коли Effect потребує повторної синхронізації і чому
- Як визначаються залежності Effect
- Що означає реактивність значення
- Що означає порожній масив залежностей
- Як React перевіряє залежності за допомогою лінтера
- Що робити, коли ви не згодні з лінтером

## Життєвий цикл Effect

Кожен компонент React має свій життєвий цикл: монтування, оновлення та демонтування. **Однак про Effects не варто думати таким чином.** Натомість думайте про кожен Effect незалежно від життєвого циклу компонента.

Effect описує, як синхронізувати зовнішню систему з поточними props та state. По мірі зміни коду синхронізація потребуватиме частішого або рідшого виконання.

### Приклад: Підключення до чат-кімнати

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

**Початок синхронізації** (тіло Effect):
```js
const connection = createConnection(serverUrl, roomId);
connection.connect();
```

**Зупинка синхронізації** (функція очищення):
```js
return () => {
  connection.disconnect();
};
```

> **Примітка:** Деякі Effects не повертають функцію очищення. Частіше за все ви захочете її повернути, але якщо ні, React поводитиметься так, ніби ви повернули порожню функцію очищення.

## Чому синхронізація може відбуватися кілька разів

Уявіть, що компонент `ChatRoom` отримує prop `roomId`, який користувач обирає у випадаючому списку. Спочатку користувач обирає кімнату `"general"`:

```js
function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Ласкаво просимо до кімнати {roomId}!</h1>;
}
```

React запускає Effect для початку синхронізації. Він підключається до кімнати `"general"`.

Пізніше користувач обирає іншу кімнату (наприклад, `"travel"`). React оновлює UI, але Effect все ще підключений до `"general"`. **Prop `roomId` змінився, тому те, що ваш Effect зробив, більше не відповідає UI.**

У цей момент ви хочете, щоб React:
1. Зупинив синхронізацію зі старим `roomId` (відключився від `"general"`)
2. Почав синхронізацію з новим `roomId` (підключився до `"travel"`)

## Як React повторно синхронізує ваш Effect

Коли `roomId` змінюється з `"general"` на `"travel"`:

1. **React зупиняє синхронізацію**, викликаючи функцію очищення, повернуту після підключення до `"general"`:
```js
return () => {
  connection.disconnect(); // Відключається від кімнати "general"
};
```

2. **React знову починає синхронізацію**, запускаючи тіло Effect з новим `roomId`:
```js
const connection = createConnection(serverUrl, roomId); // Підключається до кімнати "travel"
connection.connect();
```

Цей цикл може повторюватися багато разів при зміні props та state.

## Погляд з перспективи Effect

З перспективи компонента:
1. `ChatRoom` змонтовано з `roomId` встановленим на `"general"`
2. `ChatRoom` оновлено з `roomId` встановленим на `"travel"`
3. `ChatRoom` оновлено з `roomId` встановленим на `"music"`
4. `ChatRoom` демонтовано

З перспективи Effect:
1. Ваш Effect підключився до кімнати `"general"` (поки не відключився)
2. Ваш Effect підключився до кімнати `"travel"` (поки не відключився)
3. Ваш Effect підключився до кімнати `"music"` (поки не відключився)

**Зосередьтеся на одному циклі старт/стоп за раз.** Не має значення, чи компонент монтується, оновлюється чи демонтується. Опишіть, як почати синхронізацію та як її зупинити. Якщо ви зробите це правильно, ваш Effect буде стійким до запуску та зупинки стільки разів, скільки потрібно.

## Як React перевіряє повторну синхронізацію Effect

React перевіряє, що ваш Effect може повторно синхронізуватися, примушуючи його зробити це негайно в режимі розробки. **У режимі розробки React завжди перемонтовує кожен компонент один раз**, викликаючи функцію очищення і потім знову запускаючи Effect. Це перевіряє правильність реалізації очищення.

### Інтерактивний приклад

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Ласкаво просимо до кімнати {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Оберіть кімнату чату:{' '}
        <select value={roomId} onChange={e => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Закрити чат' : 'Відкрити чат'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

При монтуванні компонента ви побачите три логи в режимі розробки (лише один у продакшені). Це React перевіряє правильність роботи очищення.

## Як React знає, коли повторно синхронізувати

Ви повідомляєте React, що ваш Effect залежить від значення, включивши його в масив залежностей:

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Повідомляємо React, що цей Effect "залежить від" roomId
  // ...
}
```

**Як це працює:**
1. Ви знали, що `roomId` є prop, який може змінюватися з часом
2. Ви знали, що ваш Effect читає `roomId` (його логіка залежить від цього значення)
3. Ви вказали його як залежність Effect

Кожного разу після повторного рендерингу компонента React порівнює масив залежностей. Якщо будь-яке значення відрізняється (за допомогою `Object.is`), React повторно синхронізує Effect.

## Кожен Effect представляє окремий процес синхронізації

Не додавайте непов'язану логіку до Effect лише тому, що вона має виконуватися одночасно з іншим Effect. Наприклад:

**Не робіть так:**
```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

**Робіть так:**
```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Кожен Effect у вашому коді повинен представляти окремий та незалежний процес синхронізації.** Якщо ви можете видалити один Effect без порушення логіки іншого, вони синхронізують різні речі і мають бути розділені.

## Effects "реагують" на реактивні значення

Розглянемо цей код:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Чому `serverUrl` не потрібно бути залежністю? **Тому що `serverUrl` ніколи не змінюється.** Він завжди однаковий, скільки б разів компонент не перерендерювався. Оскільки він ніколи не змінюється, немає сенсу вказувати його як залежність.

З іншого боку, `roomId` може відрізнятися при повторному рендерингу. **Props, state та значення, обчислені з них, є _реактивними_**, оскільки вони обчислюються під час рендерингу та беруть участь у потоці даних React.

### Приклад: Реактивний serverUrl

Якщо `serverUrl` був змінною state, він був би реактивним:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Обидва тепер є залежностями
  // ...
}
```

### Інтерактивний приклад з реактивними значеннями

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        URL сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Ласкаво просимо до кімнати {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Оберіть кімнату чату:{' '}
        <select value={roomId} onChange={e => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

При зміні реактивного значення, як-от `roomId` або `serverUrl`, Effect повторно підключається до сервера чату.

### Всі змінні, оголошені в тілі компонента, є реактивними

Props та state -- не єдині реактивні значення. Значення, обчислені з них, також реактивні. Якщо props або state змінюються, компонент перерендерюється, і обчислені значення також змінюються:

```js
function ChatRoom({ roomId, selectedServerUrl }) {
  const settings = useContext(SettingsContext); // реактивне
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // реактивне
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Обидва мають бути залежностями
  // ...
}
```

**Усі значення всередині компонента (включаючи props, state та змінні в тілі компонента) є реактивними.**

### Поглиблене вивчення: Чи можуть глобальні або мутабельні значення бути залежностями?

**Мутабельні значення, як-от `location.pathname`, не можуть бути залежністю.** Вони мутабельні та можуть змінюватися в будь-який момент повністю поза потоком даних рендерингу React. Їх зміна не запустить повторний рендеринг. Навіть якщо ви вкажете їх у залежностях, React не знатиме, що треба повторно синхронізуватися при їх зміні. Це також порушує правила React, оскільки читання мутабельних даних під час рендерингу порушує чистоту.

Натомість використовуйте `useSyncExternalStore` для читання та підписки на зовнішнє мутабельне значення.

**Мутабельне значення, як-от `ref.current`, також не може бути залежністю.** Сам об'єкт ref може бути залежністю, але його властивість `current` навмисно мутабельна. Вона дозволяє відстежувати щось без запуску повторного рендерингу. Оскільки її зміна не запускає повторний рендеринг, вона не є реактивним значенням.

## React перевіряє кожне реактивне значення як залежність

Якщо ваш лінтер налаштований для React, він перевірить, що кожне реактивне значення, використане кодом Effect, оголошено як залежність. Ось приклад помилки:

```js
function ChatRoom({ roomId }) { // реактивне
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // реактивне

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ПОМИЛКА: Відсутні залежності!
  // ...
}
```

Обидва `roomId` та `serverUrl` реактивні, але відсутні в залежностях. Виправте це:

```js
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [serverUrl, roomId]); // Всі залежності оголошені
```

> **Примітка:** У деяких випадках React *знає*, що значення ніколи не зміниться, навіть якщо воно оголошене всередині компонента. Функція `set` з `useState` та об'єкт ref з `useRef` є *стабільними* -- гарантовано не змінюються при повторному рендерингу. Стабільні значення не є реактивними, тому ви можете їх пропустити зі списку. Включення їх дозволено: вони не зміняться, тому це не має значення.

## Що робити, коли не хочете повторної синхронізації

**Доведіть лінтеру, що ці значення не є реактивними**, перенісши їх за межі компонента або всередину Effect:

**Варіант 1: Перенесіть за межі компонента**
```js
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // Всі залежності оголошені
  // ...
}
```

**Варіант 2: Перенесіть всередину Effect**
```js
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234';
    const roomId = 'general';
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // Всі залежності оголошені
  // ...
}
```

### Вирішення проблем із залежностями

Якщо лінтер пропонує залежність, але її додавання спричиняє цикл:

1. **Перевірте, чи ваш Effect представляє незалежний процес синхронізації.** Якщо він нічого не синхронізує, він може бути непотрібним. Якщо він синхронізує кілька незалежних речей, розділіть його.

2. **Читайте останнє значення props або state без "реагування"** на них, розділивши Effect на реактивну частину (залишити в Effect) та нереактивну (виділити в _Effect Event_). Читайте про відокремлення подій від Effects.

3. **Уникайте залежності від об'єктів та функцій.** Якщо ви створюєте їх під час рендерингу і читаєте з Effect, вони будуть різними при кожному рендерингу, спричиняючи повторну синхронізацію щоразу. Видаліть непотрібні залежності.

> **Застереження:** Лінтер -- ваш друг, але придушуйте його лише як крайній засіб. Ніколи не робіть:
> ```js
> // Уникайте придушення лінтера:
> // eslint-disable-next-line react-hooks/exhaustive-deps
> ```
> Завжди є спосіб виправити код без порушення правил.

## Підсумок

- Компоненти можуть монтуватися, оновлюватися та демонтуватися
- Кожен Effect має окремий життєвий цикл від навколишнього компонента
- Кожен Effect описує окремий процес синхронізації, який може *починатися* та *зупинятися*
- Думайте з перспективи кожного Effect (як почати та зупинити), а не компонента (як він монтується, оновлюється, демонтується)
- Значення, оголошені всередині тіла компонента, є "реактивними"
- Реактивні значення повинні повторно синхронізувати Effect, оскільки вони можуть змінюватися з часом
- Лінтер перевіряє, що всі реактивні значення, використані в Effect, вказані як залежності
- Усі помилки, виявлені лінтером, є легітимними -- завжди є спосіб виправити код

## Завдання та рішення

### Завдання 1: Виправити перепідключення при кожному натисканні клавіші

**Проблема:** Компонент `ChatRoom` перепідключується при кожному введенні тексту в поле повідомлення.

**Рішення:** Додайте масив залежностей, вказавши лише `roomId`:

```js
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]); // Лише roomId запускає повторну синхронізацію
```

### Завдання 2: Перемикання синхронізації увімк/вимк

**Проблема:** Прапорець `canMove` не контролює, чи точка слідує за рухом курсора.

**Рішення 1:** Перевірте умову всередині обробника подій:
```js
function handleMove(e) {
  if (canMove) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
}
useEffect(() => {
  window.addEventListener('pointermove', handleMove);
  return () => window.removeEventListener('pointermove', handleMove);
}, [canMove]); // Включіть canMove як залежність
```

**Рішення 2:** Перевірте умову при підписці:
```js
useEffect(() => {
  function handleMove(e) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
  if (canMove) {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }
}, [canMove]);
```

### Завдання 3: Дослідження помилки зі застарілим значенням

**Проблема:** Змінна state `canMove` всередині `handleMove` виглядає застарілою (завжди `true`) навіть після зняття прапорця.

**Причина:** Придушене правило лінтера, що приховує відсутню залежність.

**Рішення:** Видаліть придушення та додайте `canMove` до залежностей:

```js
useEffect(() => {
  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }
  window.addEventListener('pointermove', handleMove);
  return () => window.removeEventListener('pointermove', handleMove);
}, [canMove]); // Додайте canMove як залежність
```

### Завдання 4: Виправлення перемикача з'єднання

**Проблема:** Перемикання шифрування не спричиняє перепідключення чату; лише зміна кімнати.

**Рішення:** Включіть `createConnection` як залежність або рефакторіть для передачі `isEncrypted`:

```js
// Варіант 1: Включіть createConnection
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId, createConnection]);

// Варіант 2: Передайте isEncrypted замість цього
useEffect(() => {
  const createConnection = isEncrypted ?
    createEncryptedConnection :
    createUnencryptedConnection;
  const connection = createConnection(roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId, isEncrypted]);
```

### Завдання 5: Заповнення ланцюга випадаючих списків

**Проблема:** Вибір планети не заповнює випадаючий список місць.

**Рішення:** Створіть окремий Effect для отримання місць на основі `planetId`:

```js
useEffect(() => {
  let ignore = false;
  fetchData('/planets').then(result => {
    if (!ignore) {
      setPlanetList(result);
      setPlanetId(result[0].id);
    }
  });
  return () => { ignore = true; }
}, []);

useEffect(() => {
  if (planetId === '') return;
  
  let ignore = false;
  fetchData('/planets/' + planetId + '/places').then(result => {
    if (!ignore) {
      setPlaceList(result);
      setPlaceId(result[0].id);
    }
  });
  return () => { ignore = true; }
}, [planetId]); // Повторне отримання при зміні planetId
```

Цей підхід тримає два незалежні процеси синхронізації окремо, що є правильним способом обробки каскадних випадаючих списків.

# Відокремлення подій від Effects

## Вступ

Ця документація навчає розрізняти обробники подій та Effects, а також обробляти випадки, коли потрібна змішана поведінка -- код, що реагує на деякі значення, але не на інші.

**Ключові цілі навчання:**
- Як обирати між обробниками подій та Effects
- Чому Effects є реактивними, а обробники подій -- ні
- Як зробити частини Effect нереактивними
- Що таке Effect Events та як їх використовувати
- Як читати останні props та state з Effects за допомогою Effect Events

---

## Вибір між обробниками подій та Effects

### Відмінність

**Обробники подій** запускаються у відповідь на конкретні дії користувача. **Effects** запускаються кожного разу, коли потрібна синхронізація.

#### Приклад: Компонент чат-кімнати

Розглянемо чат-кімнату з двома вимогами:
1. Компонент повинен автоматично підключатися до обраної кімнати
2. Натискання "Відправити" повинно відправляти повідомлення

### Обробники подій запускаються у відповідь на конкретні взаємодії

Відправка повідомлення має відбуватися *через те*, що користувач натиснув кнопку Відправити -- не з будь-якої іншої причини.

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Відправити</button>
    </>
  );
}
```

З обробником подій `sendMessage(message)` виконується *лише* коли користувач натискає кнопку.

### Effects запускаються щоразу, коли потрібна синхронізація

Підключення до чат-кімнати повинно відбуватися незалежно від дій користувача -- компонент повинен залишатися синхронізованим з обраною кімнатою.

```js
function ChatRoom({ roomId }) {
  // ...
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

Effect забезпечує активне з'єднання з поточно обраною кімнатою, перепідключаючись за потреби.

---

## Реактивні значення та реактивна логіка

### Розуміння реактивності

**Реактивні значення** -- це props, state та змінні, оголошені в тілі компонента. У цьому прикладі:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
}
```

- `serverUrl` НЕ є реактивним (константа)
- `roomId` та `message` Є реактивними (беруть участь у потоці даних рендерингу)

### Ключові відмінності в реактивності

**Обробники подій** (НЕ реактивні):
- Логіка всередині не запускатиметься повторно, якщо та сама взаємодія не відбудеться знову
- Можуть читати реактивні значення без "реагування" на їх зміни
- Приклад: `sendMessage(message)` не повинен перезапускатися при зміні `message`

**Effects** (реактивні):
- Повинні вказувати реактивні значення як залежності
- Перезапускаються при зміні значень залежностей
- Приклад: Підключення до кімнати повинно перезапускатися при зміні `roomId`

---

## Виділення нереактивної логіки з Effects

### Проблема

Іноді потрібно змішувати реактивну та нереактивну логіку:

```js
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Підключено!', theme);
    });
    connection.connect();
    // ...
```

`theme` є реактивним, але ви не обов'язково хочете, щоб весь Effect перезапускався при його зміні.

### Рішення: useEffectEvent

Використовуйте `useEffectEvent` для виділення нереактивної логіки:

```js
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Підключено!', theme);
  });
  // ...
```

Тепер використовуйте Effect Event у вашому Effect:

```js
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Підключено!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // theme видалено -- більше не потрібен
  // ...
}
```

**Ключові моменти:**
- Effect Events є нереактивними
- Завжди "бачать" останні значення props та state
- Повинні бути виключені з масивів залежностей

---

## Читання останніх Props та State за допомогою Effect Events

### Випадок використання: Логування відвідувань сторінки

Початковий код має проблему з лінтером:

```js
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // React Hook useEffect має відсутню залежність: 'url'
  // ...
}
```

**Рішення:** Додайте `url` як залежність:

```js
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // Всі залежності оголошені
  // ...
}
```

### Змішування реактивних і нереактивних значень

Що якщо ви хочете логувати відвідування сторінки (реактивно на `url`), але також включати кількість товарів у кошику (нереактивно)?

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // React Hook useEffect має відсутню залежність: 'numberOfItems'
  // ...
}
```

**Рішення з Effect Events:**

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // Всі залежності оголошені
  // ...
}
```

**Чому передавати `url` як аргумент?**

Явна передача `url` робить зрозумілим, що відвідування різних URL є окремими "подіями". Це запобігає випадковому видаленню `url` з залежностей та допомагає виявляти помилки:

```js
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Затримка логування відвідувань
  }, [url]);
```

Тепер `visitedUrl` -- це URL, який *початково* спричинив цей Effect, навіть якщо `url` вже змінився.

---

## Чому б просто не придушити лінтер?

### Проблеми з придушенням лінтера залежностей

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // Уникайте придушення лінтера так:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

**Наслідки:**
- React не попередить вас про відсутні реактивні залежності
- Може призвести до помилок із застарілими значеннями
- Складно підтримувати та налагоджувати

### Приклад помилки, спричиненої придушенням

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ...
}
```

Функція `handleMove` завжди бачить `canMove` як `true`, оскільки вона була захоплена під час початкового рендерингу, коли лінтер був придушений.

**Рішення з useEffectEvent:**

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  // ...
}
```

---

## Обмеження Effect Events

Effect Events можуть використовуватися лише конкретними способами:

1. **Викликайте їх лише зсередини Effects**
2. **Ніколи не передавайте їх іншим компонентам або Hooks**

### Неправильно: Передача Effect Events іншим компонентам

```js
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // Уникайте: передача Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Потрібно вказати "callback" в залежностях
}
```

### Правильно: Оголошуйте Effect Events поруч з їхніми Effects

```js
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // Добре: викликається лише локально всередині Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Не потрібно вказувати "onTick" як залежність
}
```

---

## Підсумок

| Аспект | Обробники подій | Effects |
|--------|----------------|---------|
| **Коли запускаються** | У відповідь на конкретні взаємодії | Щоразу, коли потрібна синхронізація |
| **Реактивність** | НЕ реактивні | Реактивні |
| **Залежності** | Немає масиву залежностей | Повинні оголошувати всі реактивні значення |
| **Використовуйте для** | Конкретних дій користувача | Підтримки синхронізації компонента |

**Effect Events** забезпечують спосіб:
- Виділити нереактивну логіку з реактивних Effects
- Завжди мати доступ до останніх props та state
- Виправляти проблеми з залежностями лінтера без придушення
- Повинні використовуватися лише всередині Effects

---

## Інтерактивні завдання

Документація включає чотири практичні завдання:

1. **Виправити змінну, що не оновлюється** -- Розуміння масивів залежностей
2. **Виправити замерзаючий лічильник** -- Використання Effect Events для запобігання непотрібним повторним рендерингам
3. **Виправити незмінювану затримку** -- Розрізнення, коли код має бути реактивним
4. **Виправити затримане сповіщення** -- Передача параметрів до Effect Events для захоплення правильних значень

Кожне завдання демонструє реальні патерни та найкращі практики для керування реактивною та нереактивною логікою в React.

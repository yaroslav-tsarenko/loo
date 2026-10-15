# Видалення залежностей Effect

## Огляд

Цей посібник пояснює, як правильно керувати залежностями в React Effects, зосереджуючись на видаленні непотрібних залежностей при збереженні правильної поведінки компонента.

## Ключові принципи

### Залежності повинні відповідати коду

Effects автоматично перезапускаються при зміні їхніх залежностей. Список залежностей повинен включати кожне реактивне значення (props, state, змінні, оголошені в тілі компонента), яке Effect читає.

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // Всі залежності оголошені
}
```

Оскільки `roomId` є реактивним значенням, яке може змінюватися між рендерингами, воно повинно бути включене в масив залежностей.

### Щоб видалити залежність, доведіть, що вона непотрібна

Ви не можете довільно видаляти залежності. Натомість доведіть, що значення не потребує бути реактивним, перенісши його за межі компонента:

```js
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Більше не реактивне

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // Залежності не потрібні
}
```

### Патерн: Змініть код, потім залежності

Правильний робочий процес:
1. Змініть код Effect або спосіб оголошення реактивних значень
2. Слідуйте лінтеру та коригуйте залежності відповідно до коду
3. Якщо не задоволені залежностями, поверніться до кроку 1

Список залежностей описує ваш код -- ви не обираєте його, ви пишете код, що йому відповідає.

## Застереження: Придушення лінтера

**Ніколи не придушуйте лінтер залежностей.** Це призводить до помилок, коли Effects використовують застарілі значення:

```js
useEffect(() => {
  // Уникайте -- НЕ РОБІТЬ ТАК
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

Приклад помилки: Effect збільшення лічильника з придушеними залежностями завжди використовує початкові значення `count` та `increment`, змушуючи завжди збільшувати на 1 замість поточного значення збільшення.

**Завжди використовуйте наведені нижче техніки замість придушення лінтера.**

## Поширені рішення

### 1. Чи має цей код бути в обробнику подій?

Перенесіть логіку, специфічну для подій, з Effects до обробників подій:

```js
// Неправильно: логіка подій всередині Effect
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      post('/api/register');
      showNotification('Успішно зареєстровано!', theme);
    }
  }, [submitted, theme]);
}

// Правильно: логіка в обробнику подій
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    post('/api/register');
    showNotification('Успішно зареєстровано!', theme);
  }
}
```

### 2. Розділіть непов'язані Effects

Кожен Effect повинен представляти один процес синхронізації:

```js
// Неправильно: дві непов'язані речі в одному Effect
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    fetch(`/api/cities?country=${country}`).then(json => setCities(json));
    
    if (city) {
      fetch(`/api/areas?city=${city}`).then(json => setAreas(json));
    }
  }, [country, city]); // Проблема: занадто багато залежностей
}

// Правильно: розділіть на окремі Effects
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    fetch(`/api/cities?country=${country}`).then(json => setCities(json));
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      fetch(`/api/areas?city=${city}`).then(json => setAreas(json));
    }
  }, [city]);
}
```

### 3. Читання State для обчислення наступного State

Використовуйте функції-оновлювачі, щоб уникнути додавання state як залежності:

```js
// Неправильно: читання messages в Effect
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]); // Залежить від messages
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // messages спричиняє перепідключення при кожному повідомленні
}

// Правильно: використовуйте функцію-оновлювач
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]); // Залежність не потрібна
    });
    return () => connection.disconnect();
  }, [roomId]);
}
```

### 4. Читання значень без "реагування" на них

Використовуйте **Effect Events** (`useEffectEvent`) для читання останніх значень без спричинення повторного рендерингу:

```js
// Неправильно: зміна isMuted спричиняє перепідключення
function ChatRoom({ roomId }) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (receivedMessage) => {
      if (!isMuted) playSound();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isMuted]); // Перепідключується при зміні isMuted
}

// Правильно: використовуйте Effect Event для нереактивної логіки
function ChatRoom({ roomId }) {
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    if (!isMuted) playSound(); // Читає поточне isMuted без реагування
  });

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', onMessage);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

**Приклад з props:**

```js
// Обгортайте обробники подій з props у Effect Events
function ChatRoom({ roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', onMessage);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // onReceiveMessage не потрібен як залежність
}
```

### 5. Ненавмисні зміни об'єктів/функцій

Об'єкти та функції порівнюються за ідентичністю, а не за вмістом. Створення нових при кожному рендерингу = постійні перезапуски:

```js
// Неправильно: об'єкт options створюється при кожному рендерингу
function ChatRoom({ roomId }) {
  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // Перепідключується при кожному рендерингу через новий об'єкт
}
```

#### Рішення A: Перенесіть статичні об'єкти назовні

```js
// Правильно: статичний об'єкт винесено за межі
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // Немає залежності від options
}
```

#### Рішення B: Перенесіть динамічні об'єкти всередину Effect

```js
// Правильно: створюйте об'єкт всередині Effect
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // Лише примітивний roomId як залежність
}
```

#### Рішення C: Виділіть примітивні значення з Props

```js
// Правильно: деструктуризація та використання примітивів
function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // Примітивні залежності
}
```

## Підсумок

| Проблема | Рішення |
|----------|---------|
| Логіка подій в Effects | Перенесіть до обробників подій |
| Кілька непов'язаних синхронізацій | Розділіть на окремі Effects |
| Читання state для його оновлення | Використовуйте функції-оновлювачі `setState(prev => ...)` |
| Потрібно читати значення без реагування | Використовуйте `useEffectEvent` |
| Залежності від об'єктів/функцій змінюються занадто часто | Перенесіть за межі компонента, всередину Effect або виділіть примітиви |
| Лінтер залежностей "помиляється" | Він не помиляється -- змініть код |

## Практичні вправи

Документація включає інтерактивні завдання, що охоплюють:
- Виправлення скидання інтервалів за допомогою функцій-оновлювачів
- Запобігання повторним запускам анімацій за допомогою Effect Events
- Уникнення перепідключень через залежності від об'єктів
- Складні сценарії з кількома частинами state

# Повторне використання логіки за допомогою користувацьких Hooks

## Огляд

React надає вбудовані Hooks, як-от `useState`, `useContext` та `useEffect`. Користувацькі Hooks дозволяють створювати власну повторно використовувану логіку для конкретних задач, таких як отримання даних, відстеження онлайн-статусу або керування полями форм.

## Ключові цілі навчання

- Що таке користувацькі Hooks та як їх писати
- Як повторно використовувати логіку між компонентами
- Як називати та структурувати користувацькі Hooks
- Коли та навіщо виділяти користувацькі Hooks

## Користувацькі Hooks: Спільна логіка між компонентами

### Приклад проблеми: Відстеження онлайн-статусу

При створенні мережезалежних застосунків потрібно:
1. Відстежувати стан мережевого з'єднання
2. Підписуватися на браузерні події `online`/`offline`
3. Відповідно оновлювати state

Початкова реалізація в компоненті `StatusBar`:

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
}
```

### Виділення користувацького Hook

Замість дублювання цієї логіки в компонентах, створіть користувацький Hook `useOnlineStatus`:

```js
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Тепер кілька компонентів можуть використовувати цей Hook:

```js
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('Прогрес збережено');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Зберегти прогрес' : 'Перепідключення...'}
    </button>
  );
}
```

## Конвенції іменування Hooks

**Критичні правила:**

1. **Назви компонентів React** повинні починатися з великої літери (наприклад, `StatusBar`, `SaveButton`)
2. **Назви Hooks** повинні починатися з `use`, за яким йде велика літера (наприклад, `useState`, `useOnlineStatus`)

Ці конвенції допомагають визначити, де використовуються state, Effects та інші можливості React. Лінтер, налаштований для React, примусово застосовує ці правила.

### Коли НЕ використовувати префікс `use`

Не використовуйте префікс `use` для функцій, які не викликають Hooks:

```js
// Уникайте: Hook, що не використовує Hooks
function useSorted(items) {
  return items.slice().sort();
}

// Добре: звичайна функція без Hook
function getSorted(items) {
  return items.slice().sort();
}
```

Звичайні функції можна викликати умовно, тоді як Hooks -- ні.

## Користувацькі Hooks діляться логікою, а не State

**Важливе розмежування:** Користувацькі Hooks дозволяють ділитися *логікою зі state*, а не самим *state*.

Коли кілька компонентів викликають той самий користувацький Hook, кожен отримує повністю незалежний state:

```js
function StatusBar() {
  const isOnline = useOnlineStatus(); // Незалежний екземпляр
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus(); // Незалежний екземпляр
  // ...
}
```

Це еквівалентно тому, що кожен компонент має власні виклики `useState` та `useEffect`.

### Приклад з полем форми

Замість дублювання state та обробників:

```js
// До: повторюваний код
function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        Ім'я:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Прізвище:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
    </>
  );
}
```

Створіть Hook `useFormInput`:

```js
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  return {
    value: value,
    onChange: handleChange
  };
}
```

Потім спростіть компоненти:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        Ім'я:
        <input {...firstNameProps} />
      </label>
      <label>
        Прізвище:
        <input {...lastNameProps} />
      </label>
      <p><b>Доброго ранку, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

## Передача реактивних значень між Hooks

Користувацькі Hooks перезапускаються при кожному повторному рендерингу компонента, тому вони завжди отримують останні props та state.

### Приклад чат-кімнати

```js
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Нове повідомлення: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Використання в компоненті:

```js
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL сервера:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Ласкаво просимо до кімнати {roomId}!</h1>
    </>
  );
}
```

При зміні `roomId` або `serverUrl` Effect автоматично повторно синхронізується.

## Передача обробників подій до користувацьких Hooks

Щоб дозволити компонентам кастомізувати поведінку Hook, передайте обробники подій:

```js
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Нове повідомлення: ' + msg);
    }
  });
}
```

Оновіть Hook для прийняття обробника:

```js
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]);
}
```

### Оптимізація з useEffectEvent

Для запобігання непотрібним перепідключенням оберніть обробник подій у `useEffectEvent`:

```js
import { useEffect, useEffectEvent } from 'react';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // onMessage видалено із залежностей
}
```

Це запобігає перепідключенню чату при кожному повторному рендерингу.

## Коли використовувати користувацькі Hooks

Не кожне дублювання коду потребує користувацького Hook. Однак кожного разу, коли ви пишете Effect, розгляньте обгортання його в користувацький Hook, оскільки:

1. Effects не повинні бути дуже поширеними
2. Обгортання чітко передає ваш намір
3. Це показує, як дані протікають через систему

### Приклад отримання даних

Замість дублювання логіки fetch:

```js
// Повторювані Effects
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);
}
```

Створіть Hook `useData`:

```js
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Спростіть компонент:

```js
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
}
```

### Рекомендації з проєктування Hooks

**Тримайте користувацькі Hooks сфокусованими на конкретних, високорівневих випадках використання:**

Добрі назви: `useData(url)`, `useImpressionLog(eventName, extraData)`, `useChatRoom(options)`

Уникайте загальних "життєвих циклів" Hooks: `useMount(fn)`, `useEffectOnce(fn)`, `useUpdateEffect(fn)`

Ці абстрактні Hooks не вписуються в парадигму React та можуть приховувати помилки від лінтерів.

## Користувацькі Hooks допомагають міграції до кращих патернів

Effects -- це аварійні виходи. По мірі розвитку React, користувацькі Hooks полегшують міграцію до кращих рішень.

### Приклад: Використання useSyncExternalStore

Замість ручного керування підписками:

```js
// Старий підхід з ручною підпискою
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Використовуйте спеціалізований API `useSyncExternalStore`:

```js
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,           // Значення на клієнті
    () => true                         // Значення на сервері
  );
}
```

**Перевага:** Компоненти, що використовують `useOnlineStatus()`, не потребують жодних змін! Інкапсуляція через користувацькі Hooks забезпечує безболісну міграцію.

## Кілька підходів до реалізації

Часто існує більше одного способу вирішення проблеми. Наприклад, анімація плавного з'явлення може бути:

1. Реалізована з `requestAnimationFrame` в Effect
2. Виділена в повторно використовуваний Hook `useFadeIn`
3. Далі декомпозована в `useAnimationLoop`
4. Керована JavaScript-класом
5. Реалізована CSS-анімаціями (найпростіше рішення)

Обирайте підхід, що найкраще балансує зрозумілість, продуктивність та підтримуваність.

## Підсумок

- Користувацькі Hooks діляться *логікою зі state*, а не самим state
- Кожен виклик Hook повністю незалежний
- Назви Hooks повинні починатися з `use`
- Викликайте Hooks лише з компонентів React або інших Hooks
- Виділяйте користувацькі Hooks для уточнення наміру та повторного використання коду
- Використовуйте користувацькі Hooks для полегшення міграції до кращих патернів
- Тримайте Hooks сфокусованими на конкретних високорівневих випадках використання
- Уникайте загальних обгорток "життєвих циклів" Hooks

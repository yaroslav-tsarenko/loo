# rules-of-hooks

## Огляд

Це правило валідує, що компоненти та хуки дотримуються Rules of Hooks.

## Деталі правила

React покладається на порядок виклику хуків для коректного збереження стану між рендерами. Кожного разу, коли ваш компонент рендериться, React очікує, що ті самі хуки будуть викликані в тому самому порядку. Коли хуки викликаються умовно або в циклах, React втрачає відстеження, який стан відповідає якому виклику хука, що призводить до багів, як-от невідповідність стану та помилки "Rendered fewer/more hooks than expected".

## Типові порушення

Ці патерни порушують Rules of Hooks:

- **Хуки в умовах** (`if`/`else`, тернарний оператор, `&&`/`||`)
- **Хуки в циклах** (`for`, `while`, `do-while`)
- **Хуки після раннього return**
- **Хуки в callbacks/event handlers**
- **Хуки в async функціях**
- **Хуки в методах класу**
- **Хуки на рівні модуля**

### Виняток для хука `use`

Хук `use` відрізняється від інших React хуків. Ви можете викликати його умовно та в циклах:

```js
// ✅ `use` може бути умовним
if (shouldFetch) {
  const data = use(fetchPromise);
}

// ✅ `use` може бути в циклах
for (const promise of promises) {
  results.push(use(promise));
}
```

Проте `use` все ще має обмеження:
- Не можна обгортати в try/catch
- Повинен викликатися всередині компонента або хука

## Невалідні приклади

```js
// ❌ Хук в умові
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ❌ Хук після раннього return
if (!data) return <Loading />;
const [processed, setProcessed] = useState(data);

// ❌ Хук в callback
<button onClick={() => {
  const [clicked, setClicked] = useState(false);
}}/>

// ❌ `use` в try/catch
try {
  const data = use(promise);
} catch (e) {
  // обробка помилки
}

// ❌ Хук на рівні модуля
const globalState = useState(0); // За межами компонента
```

## Валідні приклади

```js
function Component({ isSpecial, shouldFetch, fetchPromise }) {
  // ✅ Хуки на верхньому рівні
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  if (!isSpecial) {
    return null;
  }

  if (shouldFetch) {
    // ✅ `use` може бути умовним
    const data = use(fetchPromise);
    return <div>{data}</div>;
  }

  return <div>{name}: {count}</div>;
}
```

## Усунення проблем

### Умовне отримання даних

**Проблема:** Спроба умовно викликати useEffect:

```js
// ❌ Умовний хук
if (isLoggedIn) {
  useEffect(() => {
    fetchUserData();
  }, []);
}
```

**Рішення:** Викликайте хук безумовно, перевіряйте умову всередині:

```js
// ✅ Умова всередині хука
useEffect(() => {
  if (isLoggedIn) {
    fetchUserData();
  }
}, [isLoggedIn]);
```

> **Примітка:** Розгляньте використання TanStack Query, useSWR або React Router 6.4+ для отримання даних. Ці рішення обробляють дедуплікацію запитів, кешування відповідей та уникнення мережевих водоспадів.

### Умовна ініціалізація стану

**Проблема:** Спроба умовно ініціалізувати стан:

```js
// ❌ Умовний стан
if (userType === 'admin') {
  const [permissions, setPermissions] = useState(adminPerms);
} else {
  const [permissions, setPermissions] = useState(userPerms);
}
```

**Рішення:** Завжди викликайте useState, умовно встановлюйте початкове значення:

```js
// ✅ Умовне початкове значення
const [permissions, setPermissions] = useState(
  userType === 'admin' ? adminPerms : userPerms
);
```

## Параметри конфігурації

Ви можете налаштувати користувацькі effect хуки за допомогою спільних налаштувань ESLint (доступно в `eslint-plugin-react-hooks` 6.1.1 та пізніше):

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

**`additionalEffectHooks`:** Regex патерн, що відповідає користувацьким хукам, які повинні розглядатися як effects. Це дозволяє `useEffectEvent` та подібним event функціям викликатися з ваших користувацьких effect хуків.

Ця спільна конфігурація використовується як правилом `rules-of-hooks`, так і `exhaustive-deps`, забезпечуючи послідовну поведінку для всього лінтінгу, пов'язаного з хуками.

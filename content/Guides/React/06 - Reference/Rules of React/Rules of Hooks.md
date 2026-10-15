# Rules of Hooks

## Вступ

Хуки визначаються за допомогою JavaScript функцій, але вони представляють особливий тип повторно використовуваної UI логіки з обмеженнями щодо того, де їх можна викликати.

---

## Викликайте хуки лише на верхньому рівні

Функції, чиї імена починаються з `use`, називаються *хуками* в React.

**Не викликайте хуки всередині циклів, умов, вкладених функцій або блоків `try`/`catch`/`finally`.** Натомість завжди використовуйте хуки на верхньому рівні вашої React функції, перед будь-якими ранніми поверненнями. Ви можете викликати хуки лише під час рендерингу React функціонального компонента:

* ✅ Викликайте їх на верхньому рівні в тілі функціонального компонента.
* ✅ Викликайте їх на верхньому рівні в тілі користувацького хука.

### Правильні приклади

```js
function Counter() {
  // ✅ Добре: верхній рівень у функціональному компоненті
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Добре: верхній рівень у користувацькому хуку
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

### Непідтримувані випадки

**Не підтримується** виклик хуків в інших випадках:

* 🔴 Не викликайте хуки всередині умов або циклів.
* 🔴 Не викликайте хуки після умовного оператора `return`.
* 🔴 Не викликайте хуки в event handlers.
* 🔴 Не викликайте хуки в class компонентах.
* 🔴 Не викликайте хуки всередині функцій, переданих у `useMemo`, `useReducer` або `useEffect`.
* 🔴 Не викликайте хуки всередині блоків `try`/`catch`/`finally`.

### Неправильні приклади

```js
function Bad({ cond }) {
  if (cond) {
    // 🔴 Погано: всередині умови (щоб виправити, перемістіть назовні!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Погано: всередині циклу (щоб виправити, перемістіть назовні!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Погано: після умовного return (щоб виправити, перемістіть перед return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Погано: всередині event handler (щоб виправити, перемістіть назовні!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Погано: всередині useMemo (щоб виправити, перемістіть назовні!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Погано: всередині class компонента (щоб виправити, напишіть функціональний компонент!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Погано: всередині блоку try/catch/finally (щоб виправити, перемістіть назовні!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

Ви можете використовувати [плагін `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) для виявлення цих помилок.

**Примітка:** Користувацькі хуки *можуть* викликати інші хуки (це їхнє призначення). Це працює, тому що користувацькі хуки також повинні викликатися лише під час рендерингу функціонального компонента.

---

## Викликайте хуки лише з React функцій

Не викликайте хуки зі звичайних JavaScript функцій. Натомість ви можете:

* ✅ Викликати хуки з React функціональних компонентів.
* ✅ Викликати хуки з користувацьких хуків.

Дотримуючись цього правила, ви забезпечуєте, що вся логіка стану в компоненті чітко видима з його вихідного коду.

### Приклад

```js
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Не компонент і не користувацький хук!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```

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

---

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

# Реагування на події

## Вступ

React дозволяє додавати **обробники подій** до вашого JSX. Обробники подій — це ваші власні функції, які будуть викликані у відповідь на взаємодію, таку як натискання, наведення, фокусування на полях вводу тощо.

### Що ви дізнаєтесь
- Різні способи написання обробника подій
- Як передати логіку обробки подій з батьківського компонента
- Як події поширюються та як їх зупинити

---

## Додавання обробників подій

Щоб додати обробник подій, визначте функцію та передайте її як prop до відповідного JSX-тегу.

### Базовий приклад: Кнопка без обробника

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

### Створення інтерактивної кнопки

Виконайте три кроки:

1. Оголосіть функцію `handleClick` *всередині* вашого компонента
2. Реалізуйте логіку всередині цієї функції
3. Додайте `onClick={handleClick}` до JSX-тегу

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

### Конвенції обробників подій

Функції обробників подій:
- Зазвичай визначаються *всередині* ваших компонентів
- Мають імена, що починаються з `handle`, за яким слідує назва події
- Поширені приклади: `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`

### Альтернативні інлайн-стилі

**Як інлайн-функція:**
```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

**Використовуючи стрілкову функцію (компактно):**
```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Всі три стилі еквівалентні. Інлайн-обробники подій зручні для коротких функцій.

### Критична помилка: Передача vs Виклик функцій

**Функції потрібно ПЕРЕДАВАТИ, а не ВИКЛИКАТИ:**

| Правильно (Передача) | Неправильно (Виклик) |
|---|---|
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

**Чому це важливо:**
- **Передача:** `onClick={handleClick}` каже React запам'ятати функцію та викликати її, коли користувач натисне
- **Виклик:** `onClick={handleClick()}` викликає функцію *одразу під час render*, без будь-яких натискань, тому що JavaScript всередині `{` та `}` виконується негайно

**Для інлайн-обробників:**

| Правильно | Неправильно |
|---|---|
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

Інлайн-код без обгортки спрацьовує при кожному render, а не при натисканні.

---

## Читання props в обробниках подій

Обробники подій, оголошені всередині компонента, мають доступ до props компонента.

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

---

## Передача обробників подій як props

Часто батьківським компонентам потрібно визначити обробники подій дочірніх елементів. Передайте prop з батьківського компонента як обробник подій:

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

**Як це працює:**
- `PlayButton` передає `handlePlayClick` як prop `onClick` компоненту `Button`
- `UploadButton` передає інлайн стрілкову функцію як prop `onClick`
- `Button` передає цей prop безпосередньо вбудованому `<button>` як `onClick={onClick}`

Цей патерн поширений у дизайн-системах, де компоненти містять стилізацію, але не поведінку.

---

## Іменування props обробників подій

Вбудовані компоненти підтримують лише імена браузерних подій, такі як `onClick`. Для користувацьких компонентів ви можете називати props обробників подій як завгодно.

**Конвенція:** Props обробників подій повинні починатися з `on`, за яким слідує велика літера.

### Приклад: Користувацьке ім'я

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

### Імена подій, специфічні для додатку

Для кількох взаємодій називайте props за концепціями додатку:

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

Такий підхід до іменування забезпечує гнучкість — ви можете змінити деталі реалізації пізніше, не впливаючи на батьківський компонент.

### Примітка щодо доступності

Використовуйте відповідні HTML-теги для обробників подій. Для кліків використовуйте `<button onClick={handleClick}>` замість `<div onClick={handleClick}>`. Це забезпечує:
- Вбудовану поведінку браузера, таку як навігація клавіатурою
- Правильний семантичний HTML
- Кращу доступність

Ви можете стилізувати кнопки за допомогою CSS, щоб вони виглядали як посилання або інші елементи.

---

## Поширення подій (Event Propagation)

Обробники подій перехоплюють події від дочірніх компонентів. Події "спливають" або "поширюються" вгору по дереву: починаючи з місця, де подія сталася, і рухаючись вгору.

### Приклад: Кілька обробників

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

**Поведінка:**
- Натискання на кнопку спочатку викликає `onClick` кнопки, потім `onClick` батьківського `<div>` (два сповіщення)
- Натискання на саму панель інструментів викликає лише `onClick` `<div>` (одне сповіщення)

> **Виняток:** Всі події поширюються в React, окрім `onScroll`, яка працює лише на тегу, до якого прикріплена.

---

## Зупинка поширення

Обробники подій отримують **об'єкт події** як єдиний аргумент (зазвичай називається `e`). Використовуйте `e.stopPropagation()`, щоб запобігти спрацюванню батьківських обробників:

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

**Результат:** Натискання кнопок тепер показує лише одне сповіщення, а не два, тому що поширення зупиняється перед досягненням батьківського `<div>`.

### Поглиблено: Події фази захоплення (Capture Phase)

У рідкісних випадках, щоб перехопити всі події на дочірніх елементах, *навіть якщо вони зупинили поширення*, додайте `Capture` до назви події:

```js
<div onClickCapture={() => { /* це спрацює першим */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

**Фази поширення подій:**
1. Події рухаються вниз, викликаючи всі обробники `onClickCapture`
2. Виконується обробник `onClick` натиснутого елемента
3. Події рухаються вгору, викликаючи всі обробники `onClick`

Події захоплення корисні для маршрутизаторів та аналітики, але рідко використовуються в коді додатку.

---

## Передача обробників як альтернатива поширенню

Замість того, щоб покладатися на автоматичне поширення, явно викликайте обробник батьківського компонента:

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

**Переваги цього патерну:**
- Чіткий ланцюг виконання коду
- Легше відстежити, які обробники запускаються і чому
- Краще, ніж покладатися на неявне поширення

Ви можете додати додатковий код до або після виклику обробника подій `onClick` батьківського компонента.

---

## Запобігання поведінці за замовчуванням

Деякі браузерні події мають поведінку за замовчуванням. Наприклад, подія submit форми `<form>` за замовчуванням перезавантажує сторінку.

### Приклад поведінки за замовчуванням

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

**Проблема:** Сторінка все одно перезавантажується, незважаючи на сповіщення.

### Запобігання поведінці за замовчуванням

Викличте `e.preventDefault()` на об'єкті події:

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

### Різниця між `stopPropagation()` та `preventDefault()`

- **`e.stopPropagation()`**: Зупиняє виконання обробників подій, прикріплених до батьківських тегів
- **`e.preventDefault()`**: Запобігає поведінці браузера за замовчуванням для подій, які її мають (не пов'язано з поширенням)

---

## Чи можуть обробники подій мати побічні ефекти?

**Так, безумовно!** Обробники подій — найкраще місце для побічних ефектів.

На відміну від функцій render, обробники подій не повинні бути чистими (pure). Це чудове місце для:
- Зміни значення вводу у відповідь на набір тексту
- Зміни списку у відповідь на натискання кнопки
- Модифікації інших даних

**Важливо:** Щоб змінити інформацію, вам потрібен state — пам'ять компонента.

---

## Підсумок

- Обробляйте події, передаючи функцію як prop елементу, наприклад `<button>`
- Обробники подій повинні бути **передані, а не викликані**: `onClick={handleClick}`, а не `onClick={handleClick()}`
- Визначайте функції обробників подій окремо або інлайн
- Обробники подій визначаються всередині компонентів, тому вони мають доступ до props
- Оголошуйте обробники подій у батьківських компонентах та передавайте їх як props дочірнім
- Визначайте власні props обробників подій з іменами, специфічними для додатку
- Події поширюються вгору — викликайте `e.stopPropagation()`, щоб запобігти цьому
- Події можуть мати поведінку браузера за замовчуванням — викликайте `e.preventDefault()`, щоб запобігти цьому
- Явний виклик prop обробника подій з дочірнього компонента — хороша альтернатива поширенню

---

## Завдання

### Завдання 1: Виправте обробник подій

**Проблема:** Натискання кнопки повинно перемикати колір фону, але нічого не відбувається.

**Зламаний код:**
```js
<button onClick={handleClick()}>
  Toggle the lights
</button>
```

**Рішення:** Видаліть `()`, щоб передати функцію замість її виклику:
```js
<button onClick={handleClick}>
  Toggle the lights
</button>
```

Або обгорніть у стрілкову функцію:
```js
<button onClick={() => handleClick()}>
  Toggle the lights
</button>
```

### Завдання 2: Підключіть події

**Завдання:**
1. Підключіть кнопку компонента `ColorSwitch` до prop обробника `onChangeColor`
2. Запобігти збільшенню лічильника кліків при зміні кольору

**Рішення:**
```js
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

`e.stopPropagation()` запобігає спливанню кліку до `onClick={handleClickOutside}` батьківського компонента, який збільшує лічильник.

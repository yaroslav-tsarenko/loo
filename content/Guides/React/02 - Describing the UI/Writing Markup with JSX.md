# Написання розмітки за допомогою JSX

## Вступ

*JSX* — це розширення синтаксису для JavaScript, яке дозволяє писати HTML-подібну розмітку всередині файлу JavaScript. Хоча існують інші способи написання компонентів, більшість розробників React віддають перевагу лаконічності JSX, і більшість кодових баз його використовують.

### Ви дізнаєтесь

- Чому React поєднує розмітку з логікою рендерингу
- Чим JSX відрізняється від HTML
- Як відображати інформацію за допомогою JSX

---

## JSX: Розмітка всередині JavaScript

Веб був побудований на HTML, CSS та JavaScript. Протягом багатьох років веб-розробники зберігали контент у HTML, дизайн у CSS, а логіку в JavaScript — часто в окремих файлах! Контент розмічався всередині HTML, тоді як логіка сторінки жила окремо в JavaScript.

Але зі збільшенням інтерактивності вебу логіка все більше визначала контент. JavaScript відповідав за HTML! Ось чому **в React логіка рендерингу та розмітка живуть разом в одному місці — компонентах.**

Тримання логіки рендерингу кнопки та її розмітки разом забезпечує їхню синхронізацію при кожному редагуванні. І навпаки, деталі, які не пов'язані між собою, такі як розмітка кнопки та розмітка бічної панелі, ізольовані одна від одної, що робить безпечнішою зміну будь-якої з них окремо.

Кожен компонент React — це функція JavaScript, яка може містити деяку розмітку, яку React рендерить у браузер. Компоненти React використовують розширення синтаксису під назвою JSX для представлення цієї розмітки. JSX виглядає дуже схоже на HTML, але є трохи суворішим і може відображати динамічну інформацію. Найкращий спосіб зрозуміти це — перетворити деяку HTML-розмітку на JSX-розмітку.

> **Примітка:** JSX та React — це дві окремі речі. Вони часто використовуються разом, але ви *можете* використовувати їх незалежно одне від одного. JSX — це розширення синтаксису, тоді як React — це бібліотека JavaScript.

---

## Перетворення HTML на JSX

Припустімо, що у вас є деякий (цілком допустимий) HTML:

```html
<h1>Hedy Lamarr's Todos</h1>
<img
  src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

І ви хочете помістити його у свій компонент:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Якщо ви скопіюєте та вставите його як є, він не працюватиме:

```js
export default function TodoList() {
  return (
    // Це не зовсім працює!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

Це тому, що JSX є суворішим і має кілька більше правил, ніж HTML! Якщо ви прочитаєте повідомлення про помилки, вони підкажуть, як виправити розмітку, або ви можете слідувати інструкціям нижче.

> **Примітка:** Здебільшого повідомлення про помилки React на екрані допоможуть вам знайти, де проблема. Прочитайте їх, якщо застрягнете!

---

## Правила JSX

### 1. Повертайте один кореневий елемент

Щоб повернути кілька елементів з компонента, **оберніть їх одним батьківським тегом.**

Наприклад, ви можете використовувати `<div>`:

```js
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

Якщо ви не хочете додавати зайвий `<div>` у свою розмітку, ви можете написати `<>` та `</>` замість нього:

```js
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Цей порожній тег називається *Fragment*. Fragments дозволяють групувати речі, не залишаючи жодного сліду в HTML-дереві браузера.

#### Чому кілька JSX-тегів потрібно обгортати?

JSX виглядає як HTML, але під капотом він перетворюється на звичайні JavaScript-об'єкти. Ви не можете повернути два об'єкти з функції, не обгорнувши їх у масив. Це пояснює, чому ви також не можете повернути два JSX-теги, не обгорнувши їх в інший тег або Fragment.

### 2. Закривайте всі теги

JSX вимагає, щоб теги були явно закриті: самозакриваючі теги, як `<img>`, повинні стати `<img />`, а обгортаючі теги, як `<li>oranges`, повинні бути записані як `<li>oranges</li>`.

Ось як зображення Hedy Lamarr та елементи списку виглядають закритими:

```js
<>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. camelCase для (майже) всього!

JSX перетворюється на JavaScript, і атрибути, написані в JSX, стають ключами JavaScript-об'єктів. У ваших власних компонентах ви часто захочете зчитувати ці атрибути у змінні. Але JavaScript має обмеження на імена змінних. Наприклад, їхні імена не можуть містити тире або бути зарезервованими словами, як `class`.

Ось чому в React багато HTML та SVG атрибутів написані у camelCase. Наприклад, замість `stroke-width` ви використовуєте `strokeWidth`. Оскільки `class` — це зарезервоване слово, в React ви пишете `className`, назване за відповідною [властивістю DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js
<img
  src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

Ви можете знайти всі ці атрибути у списку props DOM-компонентів. Якщо помилитесь — не хвилюйтеся — React виведе повідомлення з можливим виправленням у консоль браузера.

> **Увага:** З історичних причин атрибути [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) та [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) пишуться як в HTML, з тире.

### Порада: Використовуйте конвертер JSX

Конвертація всіх цих атрибутів в існуючій розмітці може бути нудною! Ми рекомендуємо використовувати [конвертер](https://transform.tools/html-to-jsx) для перекладу існуючого HTML та SVG у JSX. Конвертери дуже корисні на практиці, але все ж варто розуміти, що відбувається, щоб ви могли комфортно писати JSX самостійно.

---

## Кінцевий результат

Ось виправлений код:

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

---

## Підсумок

Тепер ви знаєте, чому JSX існує і як використовувати його в компонентах:

* Компоненти React групують логіку рендерингу разом з розміткою, тому що вони пов'язані.
* JSX подібний до HTML, з кількома відмінностями. Ви можете використовувати [конвертер](https://transform.tools/html-to-jsx), якщо потрібно.
* Повідомлення про помилки часто вказують правильний напрямок для виправлення вашої розмітки.

---

## Завдання: Перетворіть деякий HTML на JSX

Цей HTML було вставлено в компонент, але це не валідний JSX. Виправте його:

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

### Рішення

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

# `<select>`

## Вступ

Вбудований браузерний компонент `<select>` дозволяє рендерити поле вибору з варіантами.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

---

## Довідка

### Компонент `<select>`

Щоб відобразити поле вибору, рендеріть вбудований браузерний компонент `<select>`.

#### Props

`<select>` підтримує всі загальні props елементів.

**Props для керування/некерування:**

- `value`: Рядок (або масив рядків для `multiple={true}`). Контролює, який варіант вибрано. При передачі необхідно також передати обробник `onChange`.
- `defaultValue`: Рядок (або масив рядків для `multiple={true}`). Визначає початково вибраний варіант.

**Інші props:**

- `autoComplete`: Рядок. Визначає поведінку автозаповнення.
- `autoFocus`: Булеве значення. Якщо `true`, React фокусує елемент при монтуванні.
- `children`: Приймає компоненти `<option>`, `<optgroup>` та `<datalist>`. Кожен `<option>` повинен мати `value`.
- `disabled`: Булеве значення. Якщо `true`, поле вибору неінтерактивне та виглядає затемненим.
- `form`: Рядок. Визначає `id` `<form>`, до якої належить поле вибору.
- `multiple`: Булеве значення. Якщо `true`, дозволяє множинний вибір.
- `name`: Рядок. Визначає ім'я для відправки форми.
- `onChange`: Функція-обробник подій. Обов'язкова для керованих полів вибору. Спрацьовує негайно, коли користувач обирає інший варіант.
- `onInput`: Функція-обробник подій. Спрацьовує при зміні значення користувачем.
- `onInvalid`: Функція-обробник подій. Спрацьовує при невдалій валідації при відправці форми.
- `required`: Булеве значення. Якщо `true`, значення обов'язкове для відправки форми.
- `size`: Число. Для полів `multiple={true}` визначає бажану кількість початково видимих елементів.

#### Застереження

- Атрибут `selected` на `<option>` не підтримується. Замість нього використовуйте `defaultValue` або `value`.
- Якщо поле вибору отримує prop `value`, воно буде керованим.
- Поле вибору не може бути одночасно керованим і некерованим.
- Поле вибору не може перемикатися між керованим та некерованим протягом свого життя.
- Кожне кероване поле вибору потребує обробник `onChange`, який синхронно оновлює його значення.

---

## Використання

### Відображення поля вибору з варіантами

Рендеріть `<select>` зі списком компонентів `<option>` всередині:

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

### Надання мітки для поля вибору

Розміщуйте кожен `<select>` всередині тегу `<label>`. Це повідомляє браузеру, що мітка пов'язана з полем вибору. Коли користувач натискає мітку, браузер автоматично фокусує поле вибору. Це важливо для доступності.

Якщо вкладення `<select>` в `<label>` неможливе, зв'яжіть їх, передавши однаковий ID в `<select id>` та `<label htmlFor>`. Використовуйте [`useId`](/reference/react/useId) для генерації ID та уникнення конфліктів:

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

### Надання початково вибраного варіанту

За замовчуванням браузер вибирає перший `<option>` у списку. Щоб вибрати інший варіант за замовчуванням, передайте `value` цього `<option>` як `defaultValue` елементу `<select>`:

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

**Підводний камінь:** На відміну від HTML, передача атрибуту `selected` окремому `<option>` не підтримується.

### Увімкнення множинного вибору

Передайте `multiple={true}` для `<select>`, щоб дозволити вибір кількох варіантів. При визначенні `defaultValue` для множинного вибору це повинен бути масив:

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

### Читання значення поля вибору при відправці форми

Додайте `<form>` навколо поля вибору з `<button type="submit">` всередині. Це викличе обробник `<form onSubmit>`. Викличте `e.preventDefault()` для перевизначення стандартної поведінки браузера. Прочитайте дані форми за допомогою `new FormData(e.target)`:

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Запобігаємо перезавантаженню сторінки
    e.preventDefault();
    // Читаємо дані форми
    const form = e.target;
    const formData = new FormData(form);
    // Ви можете передати formData як тіло fetch безпосередньо:
    fetch('/some-api', { method: form.method, body: formData });
    // Або працювати як з простим об'єктом
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Це не включає множинні значення select
    // Або отримати масив пар ім'я-значення
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Примітка:** Надайте `name` вашому `<select>`, наприклад `<select name="selectedFruit" />`. Вказане `name` буде використовуватися як ключ у даних форми, наприклад `{ selectedFruit: "orange" }`.

Якщо ви використовуєте `<select multiple={true}>`, `FormData`, що ви прочитаєте з форми, включатиме кожне вибране значення як окрему пару ім'я-значення.

**Підводний камінь:** За замовчуванням *будь-яка* `<button>` всередині `<form>` відправляє її. Використовуйте `<button type="button">` для кнопок, що не відправляють, та `<button type="submit">` для кнопок відправки.

### Керування полем вибору через змінну стану

Поле вибору `<select />` є *некерованим*. Щоб рендерити *кероване* поле вибору, передайте prop `value`. React примусово встановить для поля вибору значення, яке ви передали. Зазвичай ви керуєте полем вибору, оголосивши змінну стану:

```js
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  return (
    <select
      value={selectedFruit}
      onChange={e => setSelectedFruit(e.target.value)}
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

Це корисно, якщо ви хочете перерендерити частину UI у відповідь на кожний вибір.

**Підводний камінь:** Якщо ви передаєте `value` без `onChange`, вибір варіанту буде неможливим. Коли ви керуєте полем вибору, передаючи `value`, ви *примушуєте* його завжди мати передане значення. Тому, якщо ви передаєте змінну стану як `value`, але забуваєте синхронно оновити цю змінну стану під час обробника `onChange`, React поверне поле вибору до вказаного `value` після кожного натискання клавіші.

На відміну від HTML, передача атрибуту `selected` окремому `<option>` не підтримується.

# `<textarea>`

## Огляд

Вбудований браузерний компонент `<textarea>` дозволяє рендерити багаторядкове поле введення тексту.

```js
<textarea />
```

---

## Довідка

### `<textarea>`

Рендеріть вбудований браузерний компонент `<textarea>` для відображення текстової області.

```js
<textarea name="postContent" />
```

#### Props

`<textarea>` підтримує всі загальні props елементів.

**Керований/некерований:**
- `value`: Рядок. Контролює текст всередині текстової області. При передачі необхідно також надати обробник `onChange`.
- `defaultValue`: Рядок. Визначає початкове значення для некерованої текстової області.

**Специфічні props textarea:**
- `autoComplete`: `'on'` або `'off'`. Визначає поведінку автозаповнення.
- `autoFocus`: Булеве значення. Якщо `true`, React фокусує елемент при монтуванні.
- `children`: Не приймається. Використовуйте `defaultValue` для початкового вмісту.
- `cols`: Число. Визначає ширину за замовчуванням у середніх ширинах символів. За замовчуванням `20`.
- `disabled`: Булеве значення. Якщо `true`, поле виглядає затемненим і неінтерактивне.
- `form`: Рядок. Визначає `id` `<form>`, до якої належить поле.
- `maxLength`: Число. Визначає максимальну довжину тексту.
- `minLength`: Число. Визначає мінімальну довжину тексту.
- `name`: Рядок. Визначає ім'я, що відправляється з формою.
- `onChange`: Функція-обробник подій. Обов'язкова для керованих текстових областей. Спрацьовує негайно при зміні значення.
- `onInput`: Функція-обробник подій. Спрацьовує негайно при зміні значення.
- `onInvalid`: Функція-обробник подій. Спрацьовує при невдалій валідації при відправці форми.
- `onSelect`: Функція-обробник подій. Спрацьовує після зміни виділення всередині `<textarea>`.
- `placeholder`: Рядок. Відображається затемненим кольором, коли поле порожнє.
- `readOnly`: Булеве значення. Якщо `true`, не редагується користувачем.
- `required`: Булеве значення. Якщо `true`, значення обов'язкове для відправки форми.
- `rows`: Число. Визначає висоту за замовчуванням у середніх висотах символів. За замовчуванням `2`.
- `wrap`: `'hard'`, `'soft'` або `'off'`. Визначає перенос тексту при відправці форми.

#### Застереження

- Дочірні елементи, такі як `<textarea>something</textarea>`, не дозволяються. Використовуйте `defaultValue` для початкового вмісту.
- Рядковий prop `value` робить textarea керованою.
- Textarea не може бути одночасно керованою та некерованою.
- Textarea не може перемикатися між керованою/некерованою протягом свого життя.
- Кожна керована textarea потребує обробник `onChange`, який синхронно оновлює її значення.

---

## Використання

### Відображення текстової області

Рендеріть `<textarea>` для відображення текстової області. Визначте розмір за замовчуванням атрибутами `rows` та `cols`. Користувач може змінювати розмір за замовчуванням; вимкніть це за допомогою CSS `resize: none`.

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

### Надання мітки для текстової області

Розміщуйте кожен `<textarea>` всередині тегу `<label>`. Це повідомляє браузеру, що мітка пов'язана з textarea. Коли користувач натискає мітку, браузер фокусує textarea. Це важливо для доступності — screen readers оголошують підпис мітки, коли textarea отримує фокус.

Якщо вкладення `<textarea>` в `<label>` неможливе, зв'яжіть їх, передавши однаковий ID в `<textarea id>` та `<label htmlFor>`. Генеруйте ID за допомогою `useId` для уникнення конфліктів.

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

### Надання початкового значення для текстової області

Необов'язково вкажіть початкове значення за допомогою рядкового prop `defaultValue`.

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

> **Підводний камінь:** На відміну від HTML, передача початкового тексту як `<textarea>Some content</textarea>` не підтримується.

### Читання значення textarea при відправці форми

Додайте `<form>` навколо textarea з `<button type="submit">` всередині. Це викличе обробник `<form onSubmit>`. За замовчуванням браузер відправляє дані форми на поточний URL та оновлює сторінку. Перевизначте це, викликавши `e.preventDefault()`. Прочитайте дані форми за допомогою `new FormData(e.target)`.

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Запобігаємо перезавантаженню сторінки
    e.preventDefault();

    // Читаємо дані форми
    const form = e.target;
    const formData = new FormData(form);

    // Передаємо formData як тіло fetch безпосередньо:
    fetch('/some-api', { method: form.method, body: formData });

    // Або працюємо як з простим об'єктом:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

> **Примітка:** Надайте `name` вашому `<textarea>`, наприклад `<textarea name="postContent" />`. Вказане ім'я буде використовуватися як ключ у даних форми, наприклад `{ postContent: "Your post" }`.

> **Підводний камінь:** За замовчуванням *будь-яка* `<button>` всередині `<form>` відправляє її. Використовуйте `<button type="button">` для кнопок, що не відправляють.

### Керування textarea через змінну стану

Некерований `<textarea />` компонент керує своїм власним станом. Щоб рендерити *керовану* textarea, передайте prop `value`. React примусово встановить для textarea значення, яке ви передали. Зазвичай ви керуєте textarea, оголосивши змінну стану:

```js
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Оголошуємо змінну стану...
  // ...
  return (
    <textarea
      value={postContent} // ...примусово встановлюємо значення з state...
      onChange={e => setPostContent(e.target.value)} // ...та оновлюємо state при редагуванні!
    />
  );
}
```

Це корисно, якщо ви хочете перерендерити частину UI у відповідь на кожне натискання клавіші.

> **Підводний камінь:** Якщо ви передаєте `value` без `onChange`, введення в textarea буде неможливим. Коли ви керуєте textarea, передаючи `value`, ви *примушуєте* її завжди мати передане значення. Тому, якщо ви передаєте змінну стану як `value`, але забуваєте синхронно оновити цю змінну під час обробника `onChange`, React поверне textarea до вказаного `value` після кожного натискання клавіші.

---

## Усунення проблем

### Textarea не оновлюється при введенні

Якщо ви рендерите textarea з `value`, але без `onChange`, ви побачите помилку в консолі:

```
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field.
```

**Рішення — для початкового значення використовуйте `defaultValue`:**
```js
<textarea defaultValue={something} />
```

**Для керування через state додайте `onChange`:**
```js
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

**Для навмисно read-only поля додайте `readOnly`:**
```js
<textarea value={something} readOnly={true} />
```

### Курсор стрибає на початок при кожному натисканні клавіші

Якщо ви керуєте textarea, ви повинні оновлювати її змінну стану до значення textarea з DOM під час `onChange`.

Не можна оновлювати чимось іншим, ніж `e.target.value`:

```js
function handleChange(e) {
  // Баг: оновлення значенням, відмінним від e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Також не можна оновлювати асинхронно:

```js
function handleChange(e) {
  // Баг: асинхронне оновлення
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Рішення — оновлюйте синхронно до `e.target.value`:

```js
function handleChange(e) {
  // Правильно: синхронне оновлення до e.target.value
  setFirstName(e.target.value);
}
```

### Помилка: "A component is changing an uncontrolled input to be controlled"

Якщо ви надаєте `value` компоненту, він повинен залишатися рядком протягом усього його життя.

Не можна спочатку передати `value={undefined}`, а потім `value="some string"`, тому що React не зможе визначити, чи хочете ви мати некерований або керований компонент. Керований компонент завжди повинен отримувати рядкове `value`, а не `null` або `undefined`.

Якщо ваше `value` приходить з API або змінної стану, воно може бути ініціалізоване як `null` або `undefined`. У такому випадку або встановіть початкове значення порожнім рядком (`''`), або передайте `value={someValue ?? ''}`, щоб гарантувати, що `value` є рядком.

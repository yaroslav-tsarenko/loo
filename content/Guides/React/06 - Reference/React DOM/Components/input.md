# `<input>`

## Огляд

Вбудований браузерний компонент `<input>` дозволяє рендерити різні типи полів введення форми в React.

```js
<input />
```

---

## Довідка

### `<input>`

Рендерить вбудований браузерний компонент `<input>`.

```js
<input name="myInput" />
```

#### Props

`<input>` підтримує всі загальні props елементів.

**Props, пов'язані з формою:**
- `formAction`: Рядок або функція. Перевизначає батьківський `<form action>` для `type="submit"` та `type="image"`.

**Props для керованого введення:**
- `checked`: Булеве значення. Контролює, чи вибраний checkbox або radio button.
- `value`: Рядок. Контролює значення текстового введення (або вказує дані форми для radio buttons).

При передачі `checked` або `value` ви також повинні передати обробник `onChange`.

**Props для некерованого введення:**
- `defaultChecked`: Булеве значення. Початкове значення для checkboxes/radio buttons.
- `defaultValue`: Рядок. Початкове значення для текстових полів.

**Загальні props введення:**
- `accept`: Допустимі типи файлів для `type="file"`
- `alt`: Альтернативний текст для `type="image"`
- `autoComplete`: Поведінка автозаповнення
- `autoFocus`: Якщо `true`, фокусує при монтуванні
- `disabled`: Якщо `true`, поле неінтерактивне
- `form`: `id` батьківської форми
- `formEnctype`, `formMethod`, `formNoValidate`, `formTarget`: Перевизначення властивостей форми
- `height`, `width`: Для `type="image"`
- `list`: `id` `<datalist>` для автозаповнення
- `max`, `min`: Мін/макс значення для числових полів
- `maxLength`, `minLength`: Мін/макс довжина для тексту
- `multiple`: Множинні значення для `type="file"` та `type="email"`
- `name`: Ім'я, що відправляється з формою
- `onChange`: Обов'язковий для керованих полів; спрацьовує при зміні значення
- `onInput`: Спрацьовує при зміні значення (використовуйте `onChange` в React)
- `onInvalid`: Спрацьовує при невдалій валідації
- `onSelect`: Спрацьовує при зміні виділення
- `pattern`: Regex-шаблон для валідації
- `placeholder`: Відображається, коли поле порожнє
- `readOnly`: Якщо `true`, не редагується
- `required`: Якщо `true`, значення обов'язкове
- `size`: Контролює ширину
- `src`: Джерело зображення для `type="image"`
- `step`: Крок між допустимими значеннями
- `type`: Тип введення (text, checkbox, radio, email, number тощо)

#### Застереження

- Checkboxes потребують `checked` (або `defaultChecked`), а не `value`
- Рядковий prop `value` робить текстове поле керованим
- Булевий prop `checked` робить checkbox/radio керованим
- Поле не може бути одночасно керованим і некерованим
- Поле не може перемикатися між керованим/некерованим протягом свого життя
- Кожне кероване поле потребує обробник `onChange`, який синхронно оновлює його значення

---

## Використання

### Відображення полів різних типів

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

### Надання мітки для поля введення

Обгортайте поля в теги `<label>` для доступності. Якщо вкладення неможливе, використовуйте відповідні `id` та `htmlFor`:

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

### Надання початкового значення для поля

Використовуйте `defaultValue` для текстових полів та `defaultChecked` для checkboxes/radio buttons:

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

### Читання значень поля при відправці форми

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Запобігаємо перезавантаженню сторінки
    e.preventDefault();

    // Читаємо дані форми
    const form = e.target;
    const formData = new FormData(form);

    // Використовуємо як тіло fetch:
    fetch('/some-api', { method: form.method, body: formData });

    // Або конвертуємо в об'єкт:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}
```

**Примітка:** Надайте `name` кожному `<input>`. Ім'я стає ключем у даних форми: `{ firstName: "Taylor" }`.

**Підводний камінь:** За замовчуванням будь-яка `<button>` всередині `<form>` відправляє її. Використовуйте `<button type="button">` для кнопок, що не відправляють, та `<button type="submit">` для кнопок відправки.

### Керування полем через змінну стану

Некеровані поля не контролюють своє значення. Щоб створити *кероване* поле, передайте prop `value` (або `checked` для checkboxes):

```js
function Form() {
  const [firstName, setFirstName] = useState(''); // Оголошуємо стан
  return (
    <input
      value={firstName} // Примусово встановлюємо значення з state
      onChange={e => setFirstName(e.target.value)} // Оновлюємо state при змінах
    />
  );
}
```

**Використовуйте керовані поля, коли:**
- Вам потрібен стан з інших причин (повторний рендер при кожному редагуванні)
- Ви хочете мати кілька способів змінити стан поля

```js
function Form() {
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
    </>
  );
}
```

**Важливо:** Для порожніх початкових значень використовуйте порожній рядок `''`, а не `undefined` або `null`.

**Підводний камінь:** Передача `value` без `onChange` робить поле доступним лише для читання. React поверне значення поля до переданого значення при кожному натисканні клавіші.

### Оптимізація повторного рендерингу при кожному натисканні клавіші

При використанні керованих полів компонент перерендерюється при кожному натисканні клавіші. Перемістіть стан поля в окремий компонент:

```js
// Повільно: весь App перерендерюється при кожному натисканні
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}

// Швидко: лише SignupForm перерендерюється
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Використовуйте [`useDeferredValue`](/reference/react/useDeferredValue), якщо не можете уникнути повторного рендерингу великого дерева.

---

## Усунення проблем

### Моє текстове поле не оновлюється при введенні

**Помилка:** Передача `value` без `onChange`:

```js
// Баг
<input value={something} />
```

**Рішення — для початкових значень використовуйте `defaultValue`:**
```js
<input defaultValue={something} />
```

**Для керованих полів додайте `onChange`:**
```js
<input value={something} onChange={e => setSomething(e.target.value)} />
```

**Для навмисно read-only полів додайте `readOnly`:**
```js
<input value={something} readOnly={true} />
```

### Мій checkbox не оновлюється при кліку

**Помилка:** Передача `checked` без `onChange`:

```js
// Баг
<input type="checkbox" checked={something} />
```

**Рішення — для початкових значень використовуйте `defaultChecked`:**
```js
<input type="checkbox" defaultChecked={something} />
```

**Для керованих полів додайте `onChange`:**
```js
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

**Підводний камінь:** Для checkboxes читайте `e.target.checked` (не `e.target.value`).

### Курсор стрибає на початок при кожному натисканні клавіші

**Причина:** Оновлення стану керованого поля чимось іншим, ніж `e.target.value`, або асинхронне оновлення.

```js
// Баг: трансформація значення
function handleChange(e) {
  setFirstName(e.target.value.toUpperCase());
}

// Баг: асинхронне оновлення
function handleChange(e) {
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

**Рішення:** Оновлюйте синхронно до `e.target.value`:

```js
function handleChange(e) {
  setFirstName(e.target.value);
}
```

### Помилка: "A component is changing an uncontrolled input to be controlled"

**Причина:** Prop `value` змінюється з `undefined`/`null` на рядок або навпаки.

**Рішення:** Переконайтеся, що `value` завжди є рядком:

```js
// Ініціалізуйте порожнім рядком
const [value, setValue] = useState('');

// Або використовуйте nullish coalescing
<input value={someValue ?? ''} onChange={...} />
```

Для checkboxes переконайтеся, що `checked` завжди є булевим значенням.

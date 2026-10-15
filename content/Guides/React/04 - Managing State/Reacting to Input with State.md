# Реагування на введення за допомогою State

## Огляд

React надає декларативний спосіб маніпулювання UI. Замість безпосереднього керування окремими частинами UI, ви описуєте різні стани, в яких може перебувати ваш component, і перемикаєтесь між ними у відповідь на введення користувача. Такий підхід схожий на те, як дизайнери думають про UI.

## Цілі навчання

- Чим декларативне програмування UI відрізняється від імперативного
- Як перелічити різні візуальні стани вашого component
- Як запустити зміни між різними візуальними станами з коду

## Декларативний vs Імперативний UI

### Різниця

**Імперативне програмування**: Ви пишете точні інструкції для маніпуляції UI на основі того, що щойно сталося. Це як давати покрокові вказівки водію, який не знає пункту призначення.

**Декларативне програмування**: Ви описуєте, що хочете показати, і React визначає, як оновити UI. Це як сказати таксисту, куди ви хочете їхати, і дозволити йому обрати маршрут.

### Імперативний приклад (без React)

```js
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}
```

### Чому декларативний підхід кращий

Імперативний підхід стає експоненціально складнішим для управління у складних системах. Коли ви додаєте більше форм та взаємодій, ви повинні ретельно перевіряти весь існуючий код, щоб уникнути багів, таких як забування показати або сховати елементи.

## Декларативне мислення про UI

Є 5 ключових кроків для конвертації UI у декларативний підхід React:

### Крок 1: Визначте візуальні стани вашого Component

Уявіть усі різні "стани", які UI може відображати користувачам. Для прикладу з формою:

- **Порожній (Empty)**: Форма має вимкнену кнопку "Submit"
- **Введення (Typing)**: Форма має увімкнену кнопку "Submit"
- **Відправка (Submitting)**: Форма повністю вимкнена; показується спінер
- **Успіх (Success)**: Повідомлення "Дякуємо" показується замість форми
- **Помилка (Error)**: Те саме, що стан Typing, але з додатковим повідомленням про помилку

#### Створіть макети для кожного стану

```jsx
export default function Form({
  // Спробуйте 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
    </>
  );
}
```

> **Порада**: Ви можете відображати всі візуальні стани на одній сторінці (так званий "living styleguide" або "storybook") для зручнішого прототипування:

```jsx
let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

### Крок 2: Визначте, що запускає зміни State

Оновлення state відбуваються у відповідь на два типи введення:

- **Людське введення**: Натискання кнопок, введення тексту, навігація за посиланнями
- **Комп'ютерне введення**: Мережеві відповіді, завершення таймаутів, завантаження зображень

Для прикладу з формою:
- **Зміна текстового поля** (людське) → перемикання з Empty на Typing
- **Натискання Submit** (людське) → перемикання на Submitting
- **Успішна мережева відповідь** (комп'ютерне) → перемикання на Success
- **Невдала мережева відповідь** (комп'ютерне) → перемикання на Error

> **Примітка**: Людське введення часто потребує обробників подій!

#### Візуалізація потоку State

Ви можете накреслити переходи state як діаграму:
- Empty → (починаємо друкувати) → Typing
- Typing → (натискаємо submit) → Submitting
- Submitting → (успіх мережі) → Success
- Submitting → (помилка мережі) → Error

### Крок 3: Представте State в пам'яті за допомогою `useState`

Почніть зі змінних state, які *повинні* існувати:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Потім додайте змінні для візуальних станів:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Не хвилюйтеся, якщо ваш перший підхід не ідеальний — рефакторинг state є частиною процесу!

### Крок 4: Видаліть несуттєві змінні State

Зменшіть дублювання та запобігайте неможливим станам UI. Запитайте себе:

**Чи створює цей state парадокс?**
- Приклад: `isTyping` та `isSubmitting` не можуть обидва бути `true`. Об'єднайте в одну змінну `status`: `'typing'`, `'submitting'` або `'success'`.

**Чи доступна ця інформація з інших джерел?**
- Приклад: `isEmpty` є надлишковим, якщо можна перевірити `answer.length === 0`.

**Чи можна отримати це з інверсії іншої змінної?**
- Приклад: Перевіряйте `error !== null` замість використання окремої змінної `isError`.

Після очищення залишаються 3 суттєві змінні state:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting' або 'success'
```

#### Просунутий підхід: Використання Reducer для складного State

Для складнішої логіки state ви можете використовувати `useReducer` для консолідації кількох змінних state та запобігання неможливим станам.

### Крок 5: Підключіть обробники подій для встановлення State

Підключіть обробники подій для оновлення змінних state:

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

Цей код довший за імперативну версію, але набагато менш крихкий. Ви можете додавати нові візуальні стани без порушення існуючих, і змінювати те, що відображається в кожному стані, без модифікації логіки взаємодії.

## Підсумок

- **Декларативне програмування** описує UI для кожного візуального стану, а не мікрокерує окремими змінами
- **Процес із 5 кроків**:
  1. Визначте всі візуальні стани
  2. Визначте людські та комп'ютерні тригери для змін state
  3. Змоделюйте state за допомогою `useState`
  4. Видаліть несуттєвий state для уникнення багів та парадоксів
  5. Підключіть обробники подій для встановлення state

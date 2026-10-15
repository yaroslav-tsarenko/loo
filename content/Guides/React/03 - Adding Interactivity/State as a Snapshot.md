# State як знімок

## Вступ

Змінні state можуть виглядати як звичайні змінні JavaScript, які можна читати та записувати. Проте state поводиться більше як знімок. Встановлення state не змінює змінну state, яку ви вже маєте, а натомість запускає повторний render.

## Цілі навчання

- Як встановлення state запускає повторні render'и
- Коли і як state оновлюється
- Чому state не оновлюється негайно після його встановлення
- Як обробники подій отримують доступ до "знімка" state

---

## Встановлення state запускає render

Ви можете думати, що ваш інтерфейс змінюється безпосередньо у відповідь на подію користувача, наприклад клік. У React це працює трохи інакше від цієї ментальної моделі. На попередній сторінці ви бачили, що встановлення state запитує повторний render у React. Це означає, що для реакції інтерфейсу на подію потрібно *оновити state*.

У цьому прикладі, коли ви натискаєте "send", `setIsSent(true)` каже React повторно відрендерити UI:

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

Ось що відбувається при натисканні кнопки:

1. Виконується обробник події `onSubmit`.
2. `setIsSent(true)` встановлює `isSent` у `true` і ставить новий render у чергу.
3. React повторно рендерить компонент відповідно до нового значення `isSent`.

Давайте детальніше розглянемо зв'язок між state та render.

---

## Render робить знімок у часі

"Render" означає, що React викликає ваш компонент, який є функцією. JSX, який ви повертаєте з цієї функції, — це як знімок UI у часі. Його props, обробники подій та локальні змінні були обчислені **використовуючи state на момент цього render.**

На відміну від фотографії чи кадру фільму, "знімок" UI, який ви повертаєте, є інтерактивним. Він включає логіку, наприклад обробники подій, які визначають, що відбувається у відповідь на введення. React оновлює екран відповідно до цього знімка та підключає обробники подій. В результаті натискання кнопки запустить обробник кліку з вашого JSX.

Коли React повторно рендерить компонент:

1. React знову викликає вашу функцію.
2. Ваша функція повертає новий знімок JSX.
3. React оновлює екран відповідно до знімка, повернутого вашою функцією.

Як пам'ять компонента, state — це не як звичайна змінна, яка зникає після повернення функції. State насправді "живе" в самому React — ніби на полиці! — за межами вашої функції. Коли React викликає ваш компонент, він надає вам знімок state для цього конкретного render. Ваш компонент повертає знімок UI зі свіжим набором props та обробників подій у своєму JSX, всі обчислені **використовуючи значення state з цього render!**

Ось невеликий експеримент, що показує, як це працює. У цьому прикладі ви можете очікувати, що натискання кнопки "+3" збільшить лічильник тричі, тому що вона викликає `setNumber(number + 1)` тричі.

Подивіться, що відбувається при натисканні кнопки "+3":

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

Зверніть увагу, що `number` збільшується лише один раз за клік!

**Встановлення state змінює його лише для *наступного* render.** Під час першого render `number` був `0`. Тому в обробнику `onClick` *цього render* значення `number` все ще `0`, навіть після виклику `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Ось що обробник кліку цієї кнопки каже React зробити:

1. `setNumber(number + 1)`: `number` — це `0`, тому `setNumber(0 + 1)`.
    - React готується змінити `number` на `1` при наступному render.
2. `setNumber(number + 1)`: `number` — це `0`, тому `setNumber(0 + 1)`.
    - React готується змінити `number` на `1` при наступному render.
3. `setNumber(number + 1)`: `number` — це `0`, тому `setNumber(0 + 1)`.
    - React готується змінити `number` на `1` при наступному render.

Навіть якщо ви викликали `setNumber(number + 1)` тричі, в обробнику подій *цього render* `number` завжди `0`, тому ви встановлюєте state в `1` тричі. Тому після завершення обробника подій React повторно рендерить компонент з `number` рівним `1`, а не `3`.

Ви також можете візуалізувати це, подумки підставляючи значення змінних state у вашому коді. Оскільки змінна state `number` дорівнює `0` для *цього render*, його обробник подій виглядає так:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Для наступного render `number` дорівнює `1`, тому обробник кліку *того render* виглядає так:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Тому натискання кнопки знову встановить лічильник на `2`, потім на `3` при наступному натисканні, і так далі.

---

## State з часом

Що ж, це було цікаво. Спробуйте вгадати, що покаже alert при натисканні цієї кнопки:

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

Якщо ви використовуєте метод підстановки з попереднього прикладу, можете вгадати, що alert покаже "0":

```js
setNumber(0 + 5);
alert(0);
```

Але що, якщо поставити таймер на alert, щоб він спрацював лише _після_ повторного render компонента? Він покаже "0" чи "5"? Спробуйте вгадати!

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

Здивовані? Якщо ви використовуєте метод підстановки, ви побачите "знімок" state, переданий alert.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

State, збережений у React, може змінитися до моменту запуску alert, але він був запланований використовуючи знімок state на момент взаємодії користувача!

**Значення змінної state ніколи не змінюється всередині render,** навіть якщо код обробника подій є асинхронним. Всередині `onClick` *цього render* значення `number` продовжує бути `0`, навіть після виклику `setNumber(number + 5)`. Його значення було "зафіксовано", коли React "зробив знімок" UI, викликавши ваш компонент.

Ось приклад того, як це робить ваші обробники подій менш схильними до помилок з часом. Нижче — форма, що надсилає повідомлення з п'ятисекундною затримкою. Уявіть цей сценарій:

1. Ви натискаєте кнопку "Send", надсилаючи "Hello" Алісі.
2. Перед завершенням п'ятисекундної затримки ви змінюєте значення поля "To" на "Bob".

Що, на вашу думку, покаже `alert`? Він відобразить "You said Hello to Alice"? Чи "You said Hello to Bob"? Зробіть припущення, а потім спробуйте:

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

**React зберігає значення state "зафіксованими" всередині обробників подій одного render.** Вам не потрібно турбуватися про те, чи змінився state під час виконання коду.

Але що, якщо ви хочете прочитати останній state перед повторним render? Вам знадобиться [функція-оновлювач state](Queueing%20a%20Series%20of%20State%20Updates.md), розглянута на наступній сторінці!

---

## Підсумок

- Встановлення state запитує новий render.
- React зберігає state за межами вашого компонента, ніби на полиці.
- Коли ви викликаєте `useState`, React надає вам знімок state *для цього render*.
- Змінні та обробники подій не "переживають" повторні render'и. Кожен render має свої обробники подій.
- Кожен render (і функції всередині нього) завжди "бачить" знімок state, який React надав *цьому* render.
- Ви можете подумки підставляти state в обробниках подій, подібно до того, як ви думаєте про відрендерений JSX.
- Обробники подій, створені в минулому, мають значення state з render, в якому вони були створені.

---

## Завдання

### Реалізуйте світлофор

Ось компонент пішохідного світлофора, який перемикається при натисканні кнопки:

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

**Завдання:** Додайте `alert` до обробника кліку. Коли світло зелене і показує "Walk", натискання кнопки повинно показати "Stop is next". Коли світло червоне і показує "Stop", натискання кнопки повинно показати "Walk is next".

Чи має значення, ставите ви `alert` до або після виклику `setWalk`?

#### Рішення

Ваш `alert` повинен виглядати так:

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

Чи ставите ви його до або після виклику `setWalk` — не має значення. Значення `walk` цього render є фіксованим. Виклик `setWalk` змінить його лише для *наступного* render, але не вплине на обробник подій з попереднього render.

Цей рядок може здатися на перший погляд контрінтуїтивним:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

Але він має сенс, якщо прочитати його як: "Якщо світлофор показує 'Walk now', повідомлення повинно казати 'Stop is next.'" Змінна `walk` всередині вашого обробника подій відповідає значенню `walk` цього render і не змінюється.

Ви можете перевірити правильність, застосувавши метод підстановки. Коли `walk` дорівнює `true`, ви отримуєте:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

Тому натискання "Change to Stop" ставить у чергу render з `walk` встановленим у `false` та показує alert "Stop is next".

# forwardRef

## Повідомлення про застарілість

> **У React 19 `forwardRef` більше не потрібен.** Передавайте `ref` як prop натомість.
>
> `forwardRef` буде визнано застарілим у майбутньому релізі.

## Вступ

`forwardRef` дозволяє вашому компоненту відкрити DOM вузол батьківському компоненту за допомогою ref.

```js
const SomeComponent = forwardRef(render)
```

---

## Довідка

### `forwardRef(render)`

Викликайте `forwardRef()`, щоб дозволити вашому компоненту отримати ref та перенаправити його до дочірнього компонента:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

#### Параметри

* `render`: Функція рендерингу для вашого компонента. React викликає цю функцію з props та `ref`, які ваш компонент отримав від батька. JSX, який ви повертаєте, буде виводом вашого компонента.

#### Повертає

`forwardRef` повертає React компонент, який ви можете рендерити в JSX. На відміну від React компонентів, визначених як звичайні функції, компонент, повернутий `forwardRef`, також може отримувати prop `ref`.

#### Застереження

* У Strict Mode React **викличе вашу функцію рендерингу двічі** для допомоги у виявленні випадкових нечистот. Це поведінка лише для розробки та не впливає на production. Якщо ваша функція рендерингу чиста (як і повинна бути), це не повинно впливати на логіку вашого компонента. Результат одного з викликів буде проігноровано.

### Функція `render`

`forwardRef` приймає функцію рендерингу як аргумент. React викликає цю функцію з `props` та `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Параметри

* `props`: Props, передані батьківським компонентом.
* `ref`: Атрибут `ref`, переданий батьківським компонентом. `ref` може бути об'єктом або функцією. Якщо батьківський компонент не передав ref, він буде `null`. Ви повинні або передати отриманий `ref` іншому компоненту, або передати його в `useImperativeHandle`.

---

## Використання

### Відкриття DOM вузла батьківському компоненту

За замовчуванням DOM вузли кожного компонента є приватними. Однак іноді корисно відкрити DOM вузол батьківському компоненту — наприклад, щоб дозволити фокусування на ньому. Для цього обгорніть визначення вашого компонента в `forwardRef()`:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Це дозволяє батьківському компоненту `Form` отримати доступ до DOM вузла `<input>`, відкритого `MyInput`:

```js
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

**Важливо:** Відкриття ref до DOM вузла всередині вашого компонента ускладнює зміну внутрішньої структури компонента пізніше. Зазвичай ви відкриваєте DOM вузли з повторно використовуваних низькорівневих компонентів, як кнопки або текстові поля, але не робите цього для компонентів рівня додатку, як аватар або коментар.

#### Приклад 1: Фокусування текстового поля

Натискання кнопки сфокусує поле введення. Компонент `Form` визначає ref та передає його компоненту `MyInput`. Компонент `MyInput` перенаправляє цей ref до елемента `<input>` браузера.

**Form.js:**
```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

**MyInput.js:**
```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

#### Приклад 2: Відтворення та пауза відео

Натискання кнопки викличе `play()` та `pause()` на DOM вузлі `<video>`.

**App.js:**
```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

**MyVideoPlayer.js:**
```js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

---

### Перенаправлення Ref через кілька компонентів

Замість перенаправлення `ref` до DOM вузла ви можете перенаправити його до власного компонента, як `MyInput`:

```js
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Якщо компонент `MyInput` перенаправляє ref до свого `<input>`, ref до `FormField` дасть вам цей `<input>`.

---

### Відкриття імперативного handle замість DOM вузла

Замість відкриття всього DOM вузла ви можете відкрити користувацький об'єкт, який називається *імперативним handle*, з більш обмеженим набором методів. Для цього визначте окремий ref для утримання DOM вузла:

```js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Якщо якийсь компонент отримає ref до `MyInput`, він отримає лише ваш об'єкт `{ focus, scrollIntoView }` замість DOM вузла. Це дозволяє обмежити інформацію, яку ви відкриваєте про ваш DOM вузол, до мінімуму.

> **Підводний камінь:** **Не зловживайте ref.** Ви повинні використовувати ref лише для *імперативних* поведінок, які не можете виразити як props: наприклад, прокрутка до вузла, фокусування, запуск анімації, виділення тексту тощо.
>
> **Якщо ви можете виразити щось як prop, не використовуйте ref.** Наприклад, замість відкриття імперативного handle на кшталт `{ open, close }` з компонента `Modal`, краще прийняти `isOpen` як prop, як `<Modal isOpen={isOpen} />`. Effects можуть допомогти вам відкрити імперативні поведінки через props.

---

## Усунення проблем

### Мій компонент обгорнутий у `forwardRef`, але ref до нього завжди `null`

Це зазвичай означає, що ви забули фактично використати `ref`, який отримали.

Наприклад, цей компонент нічого не робить зі своїм `ref`:

```js
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

**Щоб виправити,** передайте `ref` вниз до DOM вузла або іншого компонента, що може прийняти ref:

```js
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`ref` до `MyInput` також може бути `null`, якщо деяка логіка є умовною:

```js
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Якщо `showInput` є `false`, ref не буде перенаправлено до жодного вузла, і ref до `MyInput` залишиться порожнім.

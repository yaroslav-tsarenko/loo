# Fragment (`<>...</>`)

## Огляд

`<Fragment>`, який часто використовується через синтаксис `<>...</>`, дозволяє групувати елементи без обгортки-вузла. Фрагменти також можуть приймати ref (у canary-версіях), що дозволяє взаємодіяти з DOM без елементів-обгорток.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

---

## Довідка

### `<Fragment>`

Обгорніть елементи у `<Fragment>`, щоб згрупувати їх у ситуаціях, де потрібен один елемент. Групування елементів у Fragment не впливає на результуючий DOM — це те саме, що якби елементи не були згруповані. Порожній JSX-тег `<></>` є скороченням для `<Fragment></Fragment>` у більшості випадків.

#### Пропси

- **необов'язковий** `key`: Фрагменти, оголошені з явним синтаксисом `<Fragment>`, можуть мати ключі (для рендерингу списків)
- **необов'язковий** `ref` (Canary): Об'єкт ref або функція зворотного виклику. React надає `FragmentInstance` для взаємодії з DOM

#### Застереження

- Щоб передати `key` у Fragment, використовуйте явний синтаксис: `<Fragment key={yourKey}>...</Fragment>` (не `<>...</>`)
- React не скидає стан при перемиканні між `<><Child /></>` і `[<Child />]` або `<Child />` (працює лише на одному рівні вкладеності)
- Щоб передати `ref`, використовуйте явний синтаксис: `<Fragment ref={yourRef}>...</Fragment>` (не `<>...</>`)

---

## Методи FragmentInstance (Canary)

Коли ви передаєте ref фрагменту, React надає об'єкт `FragmentInstance` з такими методами:

### Обробка подій
- `addEventListener(type, listener, options?)`: Додає слухача до всіх DOM-нащадків першого рівня
- `removeEventListener(type, listener, options?)`: Видаляє слухача з DOM-нащадків першого рівня
- `dispatchEvent(event)`: Відправляє подію до віртуального нащадка Fragment

### Методи розмітки
- `compareDocumentPosition(otherNode)`: Порівнює позицію в документі з іншим вузлом
- `getClientRects()`: Повертає плоский масив об'єктів `DOMRect` для всіх обмежувальних прямокутників нащадків
- `getRootNode()`: Повертає кореневий вузол, що містить батьківський DOM-вузол Fragment

### Управління фокусом
- `focus(options?)`: Фокусує перший фокусований DOM-вузол (пошук у глибину)
- `focusLast(options?)`: Фокусує останній фокусований DOM-вузол (пошук у глибину)
- `blur()`: Знімає фокус, якщо `document.activeElement` знаходиться всередині Fragment

### Методи спостерігачів
- `observeUsing(observer)`: Починає спостереження за допомогою IntersectionObserver або ResizeObserver
- `unobserveUsing(observer)`: Припиняє спостереження за вказаним спостерігачем

---

## Приклади використання

### Повернення кількох елементів

```js
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Фрагменти корисні, оскільки вони не впливають на розмітку або стилі, на відміну від обгортання в DOM-елемент. При інспекції DOM всі вузли відображаються як сусідні без обгорток.

### Без спеціального синтаксису

```js
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

### Присвоєння змінним

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

### Групування елементів з текстом

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

### Рендеринг списку фрагментів

При рендерингу кількох елементів у циклі з ключами використовуйте явний синтаксис `Fragment`:

```js
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

---

## Ref фрагментів (Canary)

### Використання ref фрагментів для взаємодії з DOM

Ref фрагментів дозволяють взаємодіяти з DOM-вузлами без додавання елементів-обгорток:

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```

### Відстеження видимості за допомогою ref фрагментів

```js
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );

    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

Це альтернатива логуванню видимості на основі Effect, яке не гарантує, що компонент спостерігається користувачем.

### Управління фокусом за допомогою ref фрагментів

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

Метод `focus()` фокусує перший фокусований елемент; `focusLast()` фокусує останній фокусований елемент.

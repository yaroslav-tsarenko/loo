# `<ViewTransition>`

## Огляд

Компонент `<ViewTransition>` дозволяє анімувати дерево компонентів за допомогою Transitions та Suspense. Наразі доступний лише у Canary та Experimental каналах React.

```js
import { ViewTransition } from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

## Як працює ViewTransition

"Під капотом" React:
1. Застосовує `view-transition-name` до inline-стилів найближчого DOM-вузла, вкладеного у компонент
2. Автоматично викликає `startViewTransition` (ви ніколи не повинні робити це самостійно)
3. Якщо інші ViewTransitions виконуються, чекає їх завершення перед початком наступного
4. Об'єднує кілька оновлень, що відбуваються під час анімації, в одне

Послідовність:
- `getSnapshotBeforeUpdate` викликається перед `startViewTransition`
- Застосовуються мутації до DOM та викликається `useInsertionEffect`
- Очікування завантаження шрифтів
- Виклик `componentDidMount`, `componentDidUpdate`, `useLayoutEffect` та refs
- Очікування завершення Navigation
- Вимірювання змін розмітки для визначення, які межі потребують анімації
- Після вирішення Promise `ready` — повернення `view-transition-name`
- Виклик колбеків `onEnter`, `onExit`, `onUpdate`, `onShare`
- Після вирішення Promise `finished` — виклик `useEffect`

## Пропси

### Основні пропси
- **необов'язковий** `name`: Рядок або об'єкт. Ім'я View Transition, що використовується для анімацій спільних елементів. Якщо не вказано, React використовує унікальне ім'я для запобігання неочікуваним анімаціям.
- Пропси класів View Transition
- Пропси подій View Transition

## Пропси класів View Transition

Налаштування анімацій для різних тригерів:

```js
<ViewTransition
  default="none"
  enter="slide-up"
  exit="slide-down"
/>
```

### Пропси класів
- **необов'язковий** `enter`: `"auto"`, `"none"`, рядок або об'єкт
- **необов'язковий** `exit`: `"auto"`, `"none"`, рядок або об'єкт
- **необов'язковий** `update`: `"auto"`, `"none"`, рядок або об'єкт
- **необов'язковий** `share`: `"auto"`, `"none"`, рядок або об'єкт
- **необов'язковий** `default`: `"auto"`, `"none"`, рядок або об'єкт

### Значення класів
- `auto`: Використовує анімацію за замовчуванням браузера
- `none`: Вимикає анімації для цього типу
- `<classname>`: Користувацьке ім'я CSS-класу для View Transitions

### Значення об'єктів

```js
<ViewTransition
  default="none"
  enter={{
    "forward": 'slide-in',
    "default": 'auto'
  }}
  exit="auto"
  update="cross-fade"
>
```

## Події View Transition

Контроль анімацій за допомогою JavaScript з використанням Web Animations API:

```js
<ViewTransition
  onEnter={instance => {/* ... */}}
  onExit={instance => {/* ... */}}
  onUpdate={instance => {/* ... */}}
  onShare={instance => {/* ... */}}
/>
```

### Пропси подій
- **необов'язковий** `onEnter`: Викликається, коли спрацьовує анімація "enter"
- **необов'язковий** `onExit`: Викликається, коли спрацьовує анімація "exit"
- **необов'язковий** `onShare`: Викликається, коли спрацьовує анімація "share"
- **необов'язковий** `onUpdate`: Викликається, коли спрацьовує анімація "update"

### Аргументи подій
Кожна подія отримує два аргументи:

1. **instance**: Екземпляр View Transition з:
   - `old`: Псевдоелемент `::view-transition-old`
   - `new`: Псевдоелемент `::view-transition-new`
   - `name`: Рядок `view-transition-name`
   - `group`: Псевдоелемент `::view-transition-group`
   - `imagePair`: Псевдоелемент `::view-transition-image-pair`

2. **types**: `Array<string>` типів Transition, включених в анімацію

### Застереження подій
- Лише одна подія спрацьовує на `<ViewTransition>` за Transition
- `onShare` має пріоритет над `onEnter` та `onExit`
- Кожна подія повинна повертати функцію очищення

```js
<ViewTransition
  onEnter={(instance, types) => {
    const anim = instance.new.animate([{opacity: 0}, {opacity: 1}], {
      duration: 500,
    });
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

## Тригери анімацій

React автоматично визначає тип анімації:

- **`enter`**: ViewTransition — перший компонент, вставлений у Transition
- **`exit`**: ViewTransition — перший компонент, видалений у Transition
- **`update`**: ViewTransition має мутації DOM або межа змінює розмір/позицію
- **`share`**: Іменований ViewTransition у видаленому піддереві збігається з таким у вставленому піддереві

## Стилізація View Transitions

Надайте ім'я класу для налаштування анімацій:

```js
<ViewTransition enter="slide-in">
```

Використовуйте псевдоселектори view transition:

```css
::view-transition-group(.slide-in) {
}
::view-transition-old(.slide-in) {
}
::view-transition-new(.slide-in) {
}
```

## Застереження

- Використовуйте `name` лише для анімацій спільних елементів
- За замовчуванням `setState` не активує `<ViewTransition>`, лише оновлення, обгорнуті в Transition, `<Suspense>` або `useDeferredValue`
- `<ViewTransition>` створює зображення, яке можна переміщувати, масштабувати та плавно змінювати (не анімації окремих елементів)
- Наразі працює лише в DOM, не в React Native
- Завжди перевіряйте `prefers-reduced-motion` для поваги до налаштувань користувача
- `<ViewTransition>` активує enter/exit лише якщо розміщений перед будь-якими DOM-вузлами
- Якщо `default` встановлено у `"none"`, всі інші тригери вимкнені, якщо явно не вказані

## Приклади використання

### Анімація елемента при enter/exit

```js
function Child() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <div>Hi</div>
    </ViewTransition>
  );
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

### Анімація з Activity

```js
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="auto" exit="auto">
    <Counter />
  </ViewTransition>
</Activity>
```

Зберігає стан компонента під час анімації появи та зникнення.

### Анімація спільного елемента

```js
const THUMBNAIL_NAME = 'video-thumbnail';

export function Thumbnail({video}) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div className={`thumbnail ${video.image}`} />
    </ViewTransition>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div className={`thumbnail ${video.image} fullscreen`} />
        <button className="close-button" onClick={onExit}>
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```

**Важливо**: Лише один `<ViewTransition>` з однаковим іменем повинен бути змонтований одночасно. Використовуйте унікальні простори імен:

```js
export const MY_NAME = "my-globally-unique-name";
```

### Анімація перестановки елементів списку

```js
function Component() {
  return (
    <ViewTransition>
      <div>...</div>
    </ViewTransition>
  );
}

// У списку:
items.map((item) => <Component key={item.id} item={item} />);
```

### Відмова від анімації

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">{children}</ViewTransition>
  </div>
</ViewTransition>
```

### Налаштування анімацій

**За допомогою CSS:**

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

**З користувацькими класами:**

```js
<ViewTransition enter="slide-in" exit="slide-out">
```

```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}
```

### Налаштування з типами Transition

```js
<ViewTransition
  default={{
    'navigation-back': 'slide-right',
    'navigation-forward': 'slide-left',
  }}>
  <div>...</div>
</ViewTransition>

// У маршрутизаторі:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

### Анімація за допомогою JavaScript

```js
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      [
        {transform: 'scale(0.8)'},
        {transform: 'scale(1)'},
      ],
      {duration: 300, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

**Комбінування CSS та JavaScript:**

```js
<ViewTransition
  default="none"
  enter="auto"
  exit="auto"
  onEnter={(instance) => {
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: 500, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
  onExit={(instance) => {
    const anim = instance.old.animate(
      SLIDE_OUT,
      {duration: 300, easing: 'ease-in'}
    );
    return () => anim.cancel();
  }}>
  <Video video={videos[0]} />
</ViewTransition>
```

### Анімація на основі типів Transition

```js
<ViewTransition
  onEnter={(instance, types) => {
    const duration = types.includes('fast') ? 150 : 2000;
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: duration, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}>
```

## Анімація з контентом Suspense

### Шаблон оновлення

```js
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```

Контент переходить від fallback (A) до фактичного контенту (B) як "update".

### Шаблон enter/exit

```js
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

Fallback (A) виходить, фактичний контент (B) входить як окремі анімації.

## Побудова маршрутизаторів з підтримкою View Transition

- React чекає завершення Navigation, що очікується, під час анімацій
- Якщо Navigation блокується React, розблокуйте в `useLayoutEffect` (не в `useEffect`)
- Анімації пропускаються для подій popstate (кнопка "назад") — оновіть до Navigation API для виправлення
- Відновлення прокрутки відбувається в межах анімації

## Усунення проблем

### ViewTransition не активується

**Проблема**: ViewTransition має бути розміщений перед будь-якими DOM-вузлами:

```js
// Неправильно
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}

// Правильно
function Component() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}
```

### Помилка дублювання імені

**Проблема**: Два `<ViewTransition>` з однаковим іменем змонтовані одночасно:

```js
// Неправильно
function Item() {
  return <ViewTransition name="item">...</ViewTransition>;
}

// Правильно
function Item({id}) {
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}
```

## Важливі зауваження

- **Завжди очищуйте події View Transition** — повертайте функцію очищення з обробників подій, щоб браузер міг скасувати анімації при перериванні.
- **Поважайте `prefers-reduced-motion`** — React не вимикає анімації автоматично; використовуйте `@media (prefers-reduced-motion)` для поваги до налаштувань користувача.
- **Унікальні імена для спільних елементів** — Використовуйте глобально унікальні простори імен для іменованих ViewTransitions, щоб уникнути конфліктів у вашому застосунку.
- **Перестановка списку** — Використовуйте правильні ключі для збереження ідентичності при перестановці; не покладайтесь на анімації спільних елементів для перестановки, оскільки вони не анімують елементи поза видимою областю.

# Довідка по загальних компонентах React

Цей вичерпний посібник охоплює всі вбудовані HTML-елементи в React та їхні підтримувані props та події.

## Основні props для всіх вбудованих компонентів

### Спеціальні React props

- **`children`**: React-вузол (елемент, рядок, число, portal, null, undefined, boolean або масив), який визначає вміст компонента
- **`dangerouslySetInnerHTML`**: Об'єкт у форматі `{ __html: '<p>html</p>' }` для встановлення сирого HTML. Використовуйте з обережністю через вразливості XSS
- **`ref`**: Приймає ref-об'єкт з `useRef`/`createRef`, callback-функцію або застарілі рядкові refs для доступу до DOM-елементів
- **`suppressContentEditableWarning`**: Булеве значення для придушення попереджень React, коли елемент має одночасно `children` та `contentEditable={true}`
- **`suppressHydrationWarning`**: Булеве значення для придушення попереджень про невідповідності гідратації в серверних застосунках
- **`style`**: CSS-об'єкт з camelCase-властивостями, наприклад `{ fontWeight: 'bold', margin: 20 }`. Числа автоматично отримують суфікс `px`, якщо це не безрозмірні значення

### Стандартні DOM-атрибути

Загальні атрибути включають:
- `className`, `id`, `title`, `dir`, `lang`
- `hidden`, `tabIndex`, `contentEditable`, `draggable`
- атрибути `data-*`, атрибути доступності `aria-*`
- `role`, `slot`, `spellCheck`, `translate`
- `accessKey`, `autoCapitalize`, `enterKeyHint`, `htmlFor`, `inputMode`, `itemProp`, `is`

## Обробники подій

React надає синтетичні об'єкти подій, які нормалізують відмінності між браузерами. Усі події слідують шаблону `onEventName` і мають відповідні версії фази захоплення (`onEventNameCapture`).

### Події миші та вказівника
- `onClick`, `onDoubleClick`, `onMouseDown`, `onMouseUp`, `onMouseEnter`, `onMouseLeave`, `onMouseMove`, `onMouseOver`, `onMouseOut`, `onAuxClick`
- `onPointerDown`, `onPointerUp`, `onPointerEnter`, `onPointerLeave`, `onPointerMove`, `onPointerOver`, `onPointerOut`, `onPointerCancel`, `onGotPointerCapture`, `onLostPointerCapture`

### Події клавіатури
- `onKeyDown`, `onKeyUp`, `onKeyPress` (застаріло)
- `onBeforeInput` (спрацьовує перед зміною значення)

### Події фокусу
- `onFocus`, `onBlur` (спливають у React на відміну від нативних подій)

### Події дотику
- `onTouchStart`, `onTouchMove`, `onTouchEnd`, `onTouchCancel`

### Події буфера обміну
- `onCopy`, `onCut`, `onPaste`

### Події форми
- `onSubmit`, `onReset` (лише для елементів форми)
- `onChange` (стандартні елементи введення форми)

### UI-події
- `onScroll`, `onSelect`, `onWheel`

### Події анімації та переходів
- `onAnimationStart`, `onAnimationEnd`, `onAnimationIteration`
- `onTransitionEnd`

### Медіа-події (audio/video)
- Відтворення: `onPlay`, `onPlaying`, `onPause`, `onEnded`
- Завантаження: `onLoadStart`, `onProgress`, `onAbort`, `onError`, `onLoadedMetadata`, `onLoadedData`
- Статус: `onCanPlay`, `onCanPlayThrough`, `onDurationChange`, `onTimeUpdate`, `onRateChange`, `onVolumeChange`
- Пошук: `onSeeking`, `onSeeked`
- Інші: `onStalled`, `onSuspend`, `onWaiting`, `onEncrypted`

### Події перетягування
- `onDragStart`, `onDrag`, `onDragEnd`, `onDragEnter`, `onDragLeave`, `onDragOver`, `onDrop`

### Спеціальні події елементів
- **Dialog**: `onCancel`, `onClose` (спливають у React)
- **Details**: `onToggle` (спливає у React)
- **Ресурси** (img, iframe, object, embed, link, SVG image): `onLoad`, `onError`

## Об'єкт подій React

React нормалізує браузерні події за допомогою синтетичного об'єкта події, що надає:

**Властивості**: `bubbles`, `cancelable`, `currentTarget`, `defaultPrevented`, `eventPhase`, `isTrusted`, `target`, `timeStamp`, `nativeEvent`

**Методи**:
- `preventDefault()` — запобігає стандартній дії браузера
- `stopPropagation()` — зупиняє поширення по дереву React
- `isDefaultPrevented()`, `isPropagationStopped()` — методи запиту
- `persist()` — лише для React Native
- `isPersistent()` — лише для React Native

**Примітка**: `currentTarget` відображає точку прикріплення обробника React, а не обов'язково DOM-елемент

## Ref callback-функції

Замість ref-об'єктів можна передати callback-функцію, яка отримує DOM-вузол:

```js
<div ref={(node) => {
  console.log('Attached', node);
  return () => console.log('Cleanup', node);
}} />
```

Callback отримує DOM-вузол при прикріпленні та може повертати необов'язкову функцію очищення. React 19+ підтримує функції очищення для належного управління ресурсами. У Strict Mode React запускає цикли setup+cleanup для верифікації.

## Практичні приклади

### Застосування CSS-стилів

Використовуйте `className` для статичних стилів та prop `style` для динамічних значень:

```js
<img 
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```

CSS-властивості використовують camelCase: `fontWeight`, `backgroundColor` тощо.

Для умовних класів використовуйте шаблонні рядки або бібліотеки типу `classnames`:
```js
className={cn('row', { selected: isSelected, large: size === 'large' })}
```

### Маніпуляції з DOM через refs

Доступ до DOM-вузлів для виклику методів, таких як `focus()`:

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  
  function handleClick() {
    inputRef.current.focus();
  }
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Focus</button>
    </>
  );
}
```

### Обробка небезпечного HTML

Використовуйте `dangerouslySetInnerHTML` лише з повністю довіреним вмістом (наприклад, від довірених бібліотек Markdown):

```js
const markup = { __html: '<p>trusted html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

Ненадійне введення користувача створює ризики XSS.

## Важливі застереження

- Не можна одночасно використовувати `children` та `dangerouslySetInnerHTML`
- Деякі події (`onAbort`, `onLoad`) не спливають нативно, але спливають у React
- Користувацькі атрибути повинні бути в нижньому регістрі і не починатися з `on`; значення конвертуються в рядки
- Передача `null` або `undefined` видаляє користувацькі атрибути

# createPortal

## Огляд

`createPortal` дозволяє рендерити дочірні елементи в іншій частині DOM.

```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

---

## Довідка

### `createPortal(children, domNode, key?)`

Для створення порталу викличте `createPortal`, передавши JSX та DOM-вузол, де він повинен бути рендерений:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

Портал змінює лише фізичне розміщення DOM-вузла. В усіх інших аспектах JSX, який ви рендерите в портал, діє як дочірній вузол React-компонента, що його рендерить. Наприклад, дочірній елемент може отримувати доступ до контексту батьківського дерева, а події спливають від дочірніх до батьківських елементів згідно з деревом React.

#### Параметри

* **`children`**: Все, що може бути рендерено React — JSX, Fragment, рядок, число або масив.

* **`domNode`**: DOM-вузол, наприклад повернутий `document.getElementById()`. Вузол повинен вже існувати. Передача іншого DOM-вузла під час оновлення призведе до перестворення вмісту порталу.

* **`key`** (необов'язковий): Унікальний рядок або число для використання як ключ порталу.

#### Повертає

`createPortal` повертає React-вузол, який може бути включений у JSX або повернутий з React-компонента.

#### Застереження

* Події з порталів поширюються згідно з деревом React, а не деревом DOM. Наприклад, якщо ви клікаєте всередині порталу, і портал обгорнутий у `<div onClick>`, цей обробник `onClick` спрацює. Якщо це спричиняє проблеми, або зупиніть поширення події зсередини порталу, або перемістіть сам портал вище в дереві React.

---

## Використання

### Рендеринг в іншу частину DOM

Портали дозволяють компонентам рендерити деякі дочірні елементи в іншому місці DOM. Це дозволяє частині компонента "вийти" з будь-яких контейнерів, в яких він знаходиться. Наприклад, компонент може відобразити модальне вікно або tooltip, що з'являється над рештою сторінки.

```js
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

Портал змінює лише фізичне розміщення DOM-вузла. В усіх інших аспектах JSX, рендерений у портал, діє як дочірній вузол React-компонента. Дочірній елемент може отримувати доступ до контексту батьківського дерева, і події спливають від дочірніх до батьківських згідно з деревом React.

### Рендеринг модального вікна з порталом

Ви можете використовувати портал для створення модального вікна, що плаває над рештою сторінки, навіть якщо компонент, що його викликає, знаходиться в контейнері з `overflow: hidden` або іншими стилями, що заважають діалогу.

```js
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

#### Підводний камінь

Важливо забезпечити доступність застосунку при використанні порталів. Наприклад, вам може знадобитися керувати фокусом клавіатури, щоб користувач міг природно переміщувати фокус у портал та з нього.

Дотримуйтесь [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) при створенні модальних вікон.

### Рендеринг React-компонентів у не-React розмітку сервера

Портали можуть бути корисні, якщо ваш React root є лише частиною статичної або серверно-рендеренної сторінки. Наприклад, якщо сторінка побудована за допомогою серверного фреймворку, ви можете створити зони інтерактивності всередині статичних областей.

```js
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}
```

### Рендеринг React-компонентів у не-React DOM-вузли

Ви також можете використовувати портал для керування вмістом DOM-вузла, що управляється поза React. Наприклад, при інтеграції з віджетом карти третьої сторони:

```js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

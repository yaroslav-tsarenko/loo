# addTransitionType

`addTransitionType` дозволяє вказати причину transition. Наразі доступний лише в каналах Canary та Experimental React.

```js
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

## Довідка

### `addTransitionType`

#### Параметри
- `type`: Тип transition, який потрібно додати. Може бути будь-яким рядком.

#### Повертає
`addTransitionType` нічого не повертає.

#### Застереження
- Якщо кілька transition об'єднуються, всі Transition Types збираються разом. Ви також можете додати більше одного типу до Transition.
- Transition Types скидаються після кожного commit. Це означає, що `<Suspense>` fallback буде асоціювати типи після `startTransition`, але розкриття контенту — ні.

## Використання

### Додавання причини transition

Викликайте `addTransitionType` всередині `startTransition`, щоб вказати причину transition:

```js
import { startTransition, addTransitionType } from 'react';

function Submit({action}) {
  function handleClick() {
    startTransition(() => {
      addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

Коли ви викликаєте `addTransitionType` в межах `startTransition`, React асоціює вказаний тип як одну з причин для Transition.

Transition Types можуть використовуватися для налаштування різних анімацій залежно від того, що спричинило Transition. Є три різних способи їх використання:

1. Налаштування анімацій за допомогою browser view transition types
2. Налаштування анімацій за допомогою View Transition Class
3. Налаштування анімацій за допомогою подій ViewTransition

### Налаштування анімацій за допомогою browser view transition types

Коли `ViewTransition` активується через transition, React додає всі Transition Types як browser view transition types до елемента.

```js
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

### Налаштування анімацій за допомогою View Transition Class

Ви можете налаштувати анімації для активованого `ViewTransition` на основі типу, передавши об'єкт до View Transition Class:

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

Якщо кілька типів збігаються, вони об'єднуються разом. Якщо жоден тип не збігається, використовується спеціальний запис "default". Якщо будь-який тип має значення "none", він перемагає і ViewTransition вимикається.

У поєднанні з props enter/exit/update/layout/share:

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

### Налаштування анімацій за допомогою подій ViewTransition

Ви можете імперативно налаштувати анімації для активованого `ViewTransition` на основі типу, використовуючи події View Transition:

```js
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

Це дозволяє вибирати різні імперативні анімації залежно від причини.

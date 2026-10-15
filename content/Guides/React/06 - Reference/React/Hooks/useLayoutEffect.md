# useLayoutEffect

## Огляд

`useLayoutEffect` — це версія `useEffect`, яка спрацьовує до того, як браузер перемалює екран.

```js
useLayoutEffect(setup, dependencies?)
```

> **Пастка:** `useLayoutEffect` може погіршити продуктивність. Надавайте перевагу `useEffect`, коли це можливо.

---

## Довідка

### `useLayoutEffect(setup, dependencies?)`

Викликайте `useLayoutEffect` для виконання вимірювань макету перед перемальовуванням екрана:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
}
```

#### Параметри

- **`setup`**: Функція з логікою Effect. Може повертати функцію очищення. Перед комітом компонента React запустить setup. Після кожного коміту зі зміненими залежностями React спочатку запустить cleanup зі старими значеннями, потім setup з новими.

- **`dependencies`** (необов'язково): Список реактивних значень. React порівнює кожну залежність з попереднім значенням за допомогою `Object.is`.

#### Повертає

`useLayoutEffect` повертає `undefined`.

#### Застереження

- Код всередині `useLayoutEffect` та всі оновлення state **блокують браузер від перемальовування.** При надмірному використанні це робить додаток повільним. Коли можливо, надавайте перевагу `useEffect`.
- Effects запускаються лише на клієнті.

---

## Використання

### Вимірювання макету перед перемальовуванням

Іноді потрібна інформація про макет для правильного рендерингу. Наприклад, tooltip потрібно розташувати вище або нижче елемента залежно від доступного простору.

Це вимагає рендерингу у два проходи:

1. Відрендерити tooltip будь-де (навіть з неправильною позицією)
2. Виміряти його висоту та вирішити, де його розмістити
3. Відрендерити tooltip знову в правильному місці

**Все це має відбутися до перемальовування екрана браузером.**

```js
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Повторний рендер з реальною висотою
  }, []);

  // ...використовуйте tooltipHeight в логіці рендерингу...
}
```

**Як це працює крок за кроком:**

1. `Tooltip` рендериться з початковим `tooltipHeight = 0`
2. React розміщує його в DOM та запускає код в `useLayoutEffect`
3. `useLayoutEffect` вимірює висоту та запускає негайний повторний рендер
4. `Tooltip` рендериться знову з реальною `tooltipHeight`
5. React оновлює DOM, і браузер нарешті відображає tooltip

---

### `useLayoutEffect` проти `useEffect`

**`useLayoutEffect` блокує перемальовування браузером:** React гарантує, що код всередині `useLayoutEffect` та будь-які оновлення state буде оброблено **до перемальовування екрана.**

**`useEffect` не блокує браузер:** З `useEffect` браузер перемальовує до запуску Effect. Це може спричинити візуальне мерехтіння.

> **Примітка:** Рендеринг у два проходи та блокування браузера шкодить продуктивності. Намагайтеся уникати цього.

---

## Вирішення проблем

### Помилка: "`useLayoutEffect` does nothing on the server"

`useLayoutEffect` призначений для використання інформації про макет для рендерингу. На сервері немає інформації про макет.

**Рішення:**

1. Замініть `useLayoutEffect` на `useEffect`.
2. Позначте компонент як клієнтський.
3. Рендеріть лише після гідратації:

```js
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  return <FallbackContent />;
}

return <RealContent />;
```

4. Використовуйте `useSyncExternalStore`, якщо синхронізуєтесь із зовнішнім сховищем даних.

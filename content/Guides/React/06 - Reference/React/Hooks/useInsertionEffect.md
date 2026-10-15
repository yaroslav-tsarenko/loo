# useInsertionEffect

## Огляд

`useInsertionEffect` дозволяє вставляти елементи в DOM перед спрацюванням будь-яких layout Effects.

```js
useInsertionEffect(setup, dependencies?)
```

> **Пастка:** `useInsertionEffect` призначений для авторів CSS-in-JS бібліотек. Якщо ви не працюєте над CSS-in-JS бібліотекою і не потребуєте місця для вставки стилів, вам, ймовірно, краще підійде [`useEffect`](/reference/react/useEffect) або [`useLayoutEffect`](/reference/react/useLayoutEffect).

---

## Довідка

### `useInsertionEffect(setup, dependencies?)`

Викликайте `useInsertionEffect` для вставки стилів перед спрацюванням будь-яких Effects, що можуть потребувати читання макету:

```js
import { useInsertionEffect } from 'react';

// Всередині вашої CSS-in-JS бібліотеки
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... вставте теги <style> тут ...
  });
  return rule;
}
```

#### Параметри

* **`setup`**: Функція з логікою Effect. Може повертати функцію *очищення*. Коли компонент додається до DOM, але до спрацювання layout Effects, React запустить setup. Після кожного повторного рендеру зі зміненими залежностями React спочатку запустить cleanup зі старими значеннями, потім setup з новими.

* **`dependencies`** (необов'язково): Список реактивних значень, на які посилається код `setup`. React порівнює кожну залежність з попереднім значенням за допомогою `Object.is`.

#### Повертає

`useInsertionEffect` повертає `undefined`.

#### Застереження

* Effects запускаються лише на клієнті. Не запускаються під час серверного рендерингу.
* Не можна оновлювати state зсередини `useInsertionEffect`.
* На момент запуску `useInsertionEffect` refs ще не прикріплені.
* `useInsertionEffect` може спрацювати до або після оновлення DOM. Не покладайтеся на конкретний момент оновлення DOM.
* На відміну від інших типів Effects, `useInsertionEffect` виконує cleanup та setup по одному компоненту за раз ("чергування").

---

## Використання

### Вставка динамічних стилів з CSS-in-JS бібліотек

Існує три поширених підходи до CSS-in-JS:

1. **Статичне витягування в CSS файли** за допомогою компілятора
2. **Inline стилі**, наприклад `<div style={{ opacity: 1 }}>`
3. **Вставка тегів `<style>` під час виконання**

Ми рекомендуємо комбінацію перших двох підходів. **Не рекомендуємо вставку `<style>` під час виконання** з двох причин:

1. Змушує браузер перераховувати стилі набагато частіше.
2. Може бути дуже повільною, якщо відбувається в неправильний момент.

`useInsertionEffect` вирішує другу проблему:

```js
// Всередині CSS-in-JS бібліотеки
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

### Чому це краще?

Якщо вставляти стилі під час рендерингу, коли React обробляє неблокуюче оновлення, браузер перераховуватиме стилі кожен кадр, що може бути **надзвичайно повільним.**

`useInsertionEffect` краще, ніж вставка під час `useLayoutEffect` або `useEffect`, оскільки гарантує, що на момент запуску інших Effects теги `<style>` вже вставлені. Інакше обчислення макету у звичайних Effects будуть неправильними через застарілі стилі.

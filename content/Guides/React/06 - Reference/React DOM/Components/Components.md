# Компоненти React DOM

## Вступ

React підтримує всі вбудовані браузерні компоненти [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) та [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element).

---

## Загальні компоненти

Усі вбудовані браузерні компоненти підтримують деякі props та події.

* [Загальні компоненти (наприклад, `<div>`)](/reference/react-dom/components/common)

Це включає специфічні для React props, такі як `ref` та `dangerouslySetInnerHTML`.

---

## Компоненти форм

Ці вбудовані браузерні компоненти приймають введення користувача:

* [`<input>`](/reference/react-dom/components/input)
* [`<select>`](/reference/react-dom/components/select)
* [`<textarea>`](/reference/react-dom/components/textarea)

Вони є особливими в React, тому що передача prop `value` робить їх *[керованими.](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)*

---

## Компоненти ресурсів та метаданих

Ці вбудовані браузерні компоненти дозволяють завантажувати зовнішні ресурси або анотувати документ метаданими:

* [`<link>`](/reference/react-dom/components/link)
* [`<meta>`](/reference/react-dom/components/meta)
* [`<script>`](/reference/react-dom/components/script)
* [`<style>`](/reference/react-dom/components/style)
* [`<title>`](/reference/react-dom/components/title)

Вони є особливими в React, тому що React може рендерити їх у `<head>` документа, призупиняти виконання під час завантаження ресурсів та виконувати інші дії, описані на сторінці довідки для кожного конкретного компонента.

---

## Усі HTML-компоненти

React підтримує всі вбудовані браузерні HTML-компоненти. Це включає:

`<aside>`, `<audio>`, `<b>`, `<base>`, `<bdi>`, `<bdo>`, `<blockquote>`, `<body>`, `<br>`, `<button>`, `<canvas>`, `<caption>`, `<cite>`, `<code>`, `<col>`, `<colgroup>`, `<data>`, `<datalist>`, `<dd>`, `<del>`, `<details>`, `<dfn>`, `<dialog>`, `<div>`, `<dl>`, `<dt>`, `<em>`, `<embed>`, `<fieldset>`, `<figcaption>`, `<figure>`, `<footer>`, `<form>`, `<h1>`, `<head>`, `<header>`, `<hgroup>`, `<hr>`, `<html>`, `<i>`, `<iframe>`, `<img>`, `<input>`, `<ins>`, `<kbd>`, `<label>`, `<legend>`, `<li>`, `<link>`, `<main>`, `<map>`, `<mark>`, `<menu>`, `<meta>`, `<meter>`, `<nav>`, `<noscript>`, `<object>`, `<ol>`, `<optgroup>`, `<option>`, `<output>`, `<p>`, `<picture>`, `<pre>`, `<progress>`, `<q>`, `<rp>`, `<rt>`, `<ruby>`, `<s>`, `<samp>`, `<script>`, `<section>`, `<select>`, `<slot>`, `<small>`, `<source>`, `<span>`, `<strong>`, `<style>`, `<sub>`, `<summary>`, `<sup>`, `<table>`, `<tbody>`, `<td>`, `<template>`, `<textarea>`, `<tfoot>`, `<th>`, `<thead>`, `<time>`, `<title>`, `<tr>`, `<track>`, `<u>`, `<ul>`, `<var>`, `<video>`, `<wbr>`

### Конвенція іменування

> Подібно до [стандарту DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model), React використовує конвенцію `camelCase` для назв props. Наприклад, ви будете писати `tabIndex` замість `tabindex`. Ви можете конвертувати існуючий HTML у JSX за допомогою [онлайн-конвертера.](https://transform.tools/html-to-jsx)

### Користувацькі HTML-елементи

Якщо ви рендерите тег з дефісом, наприклад `<my-element>`, React припустить, що ви хочете рендерити [користувацький HTML-елемент.](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)

Якщо ви рендерите вбудований браузерний HTML-елемент з атрибутом [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is), він також буде оброблений як користувацький елемент.

#### Встановлення значень для користувацьких елементів

Користувацькі елементи мають два способи передачі даних:

1) **Атрибути:** Відображаються в розмітці і можуть мати лише рядкові значення
2) **Властивості:** Не відображаються в розмітці і можуть мати довільні JavaScript-значення

За замовчуванням React передає значення, прив'язані в JSX, як атрибути:

```jsx
<my-element value="Hello, world!"></my-element>
```

Нерядкові JavaScript-значення, передані користувацьким елементам, за замовчуванням серіалізуються:

```jsx
// Буде передано як "1,2,3" — результат [1,2,3].toString()
<my-element value={[1,2,3]}></my-element>
```

Однак React розпізнає властивість користувацького елемента як таку, якій можна передавати довільні значення, якщо ця властивість з'являється в класі під час конструювання:

**MyElement.js:**
```js
export class MyElement extends HTMLElement {
  constructor() {
    super();
    // Це значення буде перезаписано React
    // при ініціалізації як елемент
    this.value = undefined;
  }

  connectedCallback() {
    this.innerHTML = this.value.join(", ");
  }
}
```

**App.js:**
```js
export function App() {
  return <my-element value={[1,2,3]}></my-element>
}
```

#### Прослуховування подій користувацьких елементів

Поширений патерн при використанні користувацьких елементів — вони можуть відправляти [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) замість прийняття функції для виклику при виникненні події. Ви можете слухати ці події, використовуючи префікс `on` при прив'язці до події через JSX.

**MyElement.js:**
```javascript
export class MyElement extends HTMLElement {
  constructor() {
    super();
    this.test = undefined;
    this.emitEvent = this._emitEvent.bind(this);
  }

  _emitEvent() {
    const event = new CustomEvent('speak', {
      detail: {
        message: 'Hello, world!',
      },
    });
    this.dispatchEvent(event);
  }

  connectedCallback() {
    this.el = document.createElement('button');
    this.el.innerText = 'Say hi';
    this.el.addEventListener('click', this.emitEvent);
    this.appendChild(this.el);
  }

  disconnectedCallback() {
    this.el.removeEventListener('click', this.emitEvent);
  }
}
```

**App.js:**
```jsx
export function App() {
  return (
    <my-element
      onspeak={e => console.log(e.detail.message)}
    ></my-element>
  )
}
```

> **Примітка:** Events чутливі до регістру та підтримують дефіси (`-`). Зберігайте регістр події та включайте всі дефіси при прослуховуванні подій користувацьких елементів:
>
> ```jsx
> // Слухає події `say-hi`
> <my-element onsay-hi={console.log}></my-element>
> // Слухає події `sayHi`
> <my-element onsayHi={console.log}></my-element>
> ```

---

## Усі SVG-компоненти

React підтримує всі вбудовані браузерні SVG-компоненти. Це включає:

`<a>`, `<animate>`, `<animateMotion>`, `<animateTransform>`, `<circle>`, `<clipPath>`, `<defs>`, `<desc>`, `<discard>`, `<ellipse>`, `<feBlend>`, `<feColorMatrix>`, `<feComponentTransfer>`, `<feComposite>`, `<feConvolveMatrix>`, `<feDiffuseLighting>`, `<feDisplacementMap>`, `<feDistantLight>`, `<feDropShadow>`, `<feFlood>`, `<feFuncA>`, `<feFuncB>`, `<feFuncG>`, `<feFuncR>`, `<feGaussianBlur>`, `<feImage>`, `<feMerge>`, `<feMergeNode>`, `<feMorphology>`, `<feOffset>`, `<fePointLight>`, `<feSpecularLighting>`, `<feSpotLight>`, `<feTile>`, `<feTurbulence>`, `<filter>`, `<foreignObject>`, `<g>`, `<hatch>`, `<hatchpath>`, `<image>`, `<line>`, `<linearGradient>`, `<marker>`, `<mask>`, `<metadata>`, `<mpath>`, `<path>`, `<pattern>`, `<polygon>`, `<polyline>`, `<radialGradient>`, `<rect>`, `<script>`, `<set>`, `<stop>`, `<style>`, `<svg>`, `<switch>`, `<symbol>`, `<text>`, `<textPath>`, `<title>`, `<tspan>`, `<use>`, `<view>`

### Конвенція іменування SVG

> Подібно до [стандарту DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model), React використовує конвенцію `camelCase` для назв props. Наприклад, ви будете писати `tabIndex` замість `tabindex`. Ви можете конвертувати існуючий SVG у JSX за допомогою [онлайн-конвертера.](https://transform.tools/)
>
> Атрибути з простором імен також повинні бути написані без двокрапки:
>
> * `xlink:actuate` стає `xlinkActuate`.
> * `xlink:arcrole` стає `xlinkArcrole`.
> * `xlink:href` стає `xlinkHref`.
> * `xlink:role` стає `xlinkRole`.
> * `xlink:show` стає `xlinkShow`.
> * `xlink:title` стає `xlinkTitle`.
> * `xlink:type` стає `xlinkType`.
> * `xml:base` стає `xmlBase`.
> * `xml:lang` стає `xmlLang`.
> * `xml:space` стає `xmlSpace`.
> * `xmlns:xlink` стає `xmlnsXlink`.

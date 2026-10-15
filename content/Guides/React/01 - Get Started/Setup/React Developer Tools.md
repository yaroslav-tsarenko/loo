# React Developer Tools

## Вступ

Використовуйте React Developer Tools для інспектування [компонентів](/learn/your-first-component) React, редагування [props](/learn/passing-props-to-a-component) та [state](/learn/state-a-components-memory), а також ідентифікації проблем продуктивності.

### Ви дізнаєтесь

* Як встановити React Developer Tools

---

## Розширення браузера

Найпростіший спосіб налагодження вебсайтів, побудованих з React — встановити розширення браузера React Developer Tools. Воно доступне для кількох популярних браузерів:

* [Встановити для **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Встановити для **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Встановити для **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Тепер, якщо ви відвідаєте вебсайт, **побудований з React**, ви побачите панелі _Components_ та _Profiler_.

### Safari та інші браузери

Для інших браузерів (наприклад, Safari) встановіть npm-пакет [`react-devtools`](https://www.npmjs.com/package/react-devtools):

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Далі відкрийте інструменти розробника з терміналу:

```bash
react-devtools
```

Потім підключіть ваш вебсайт, додавши наступний тег `<script>` на початок `<head>` вашого вебсайту:

```html
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Перезавантажте ваш вебсайт у браузері, щоб переглянути його в інструментах розробника.

---

## Мобільні пристрої (React Native)

Для інспектування застосунків, побудованих з [React Native](https://reactnative.dev/), ви можете використовувати [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) — вбудований дебагер, який глибоко інтегрує React Developer Tools. Усі функції працюють ідентично розширенню браузера, включаючи підсвічування та вибір нативних елементів.

[Дізнайтеся більше про налагодження в React Native.](https://reactnative.dev/docs/debugging)

> **Примітка:** Для версій React Native раніше 0.76 використовуйте автономну збірку React DevTools, дотримуючись гайду [Safari та інші браузери](#safari-та-інші-браузери) вище.

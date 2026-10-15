# Додавання React до існуючого проєкту

## Вступ

Якщо ви хочете додати інтерактивність до вашого існуючого проєкту, вам не потрібно переписувати його на React. Додайте React до існуючого стеку та рендеріть інтерактивні компоненти React де завгодно.

> **Примітка:** Вам потрібно встановити [Node.js](https://nodejs.org/en/) для локальної розробки. Хоча ви можете спробувати React онлайн або з простою HTML-сторінкою, реалістично більшість JavaScript-інструментів, які ви захочете використовувати для розробки, вимагають Node.js.

---

## Використання React для цілого підмаршруту вашого існуючого вебсайту

Припустимо, у вас є існуючий веб-застосунок на `example.com`, побудований з іншою серверною технологією (наприклад, Rails), і ви хочете реалізувати всі маршрути, починаючи з `example.com/some-app/`, повністю на React.

Ось як ми рекомендуємо це налаштувати:

1. **Побудуйте React-частину вашого застосунку** за допомогою одного з [фреймворків на базі React](/learn/creating-a-react-app).
2. **Вкажіть `/some-app` як *базовий шлях*** у конфігурації вашого фреймворку (ось як: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Налаштуйте ваш сервер або проксі** так, щоб усі запити під `/some-app/` оброблялися вашим React-застосунком.

Це забезпечує, що React-частина вашого застосунку може [отримати переваги від найкращих практик](/learn/build-a-react-app-from-scratch#consider-using-a-framework), закладених у ці фреймворки.

Багато фреймворків на базі React є повноцінними та дозволяють вашому React-застосунку використовувати переваги сервера. Однак ви можете використовувати той самий підхід, навіть якщо не можете або не хочете запускати JavaScript на сервері. У такому випадку обслуговуйте HTML/CSS/JS експорт ([вивід `next export`](https://nextjs.org/docs/advanced-features/static-html-export) для Next.js, за замовчуванням для Gatsby) за адресою `/some-app/`.

---

## Використання React для частини існуючої сторінки

Припустимо, у вас є існуюча сторінка, побудована з іншою технологією (серверною, як Rails, або клієнтською, як Backbone), і ви хочете рендерити інтерактивні компоненти React десь на цій сторінці. Це поширений спосіб інтеграції React — фактично саме так використовувався React у Meta протягом багатьох років!

Ви можете зробити це у два кроки:

1. **Налаштуйте JavaScript-середовище**, яке дозволяє використовувати [синтаксис JSX](/learn/writing-markup-with-jsx), розділяти код на модулі за допомогою синтаксису [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) та використовувати пакети (наприклад, React) з реєстру [npm](https://www.npmjs.com/).
2. **Рендеріть ваші компоненти React** там, де ви хочете бачити їх на сторінці.

Точний підхід залежить від налаштувань вашої існуючої сторінки, тому розглянемо деталі.

### Крок 1: Налаштуйте модульне JavaScript-середовище

Модульне JavaScript-середовище дозволяє писати компоненти React в окремих файлах, на відміну від написання всього коду в одному файлі. Воно також дозволяє використовувати всі чудові пакети, опубліковані іншими розробниками в реєстрі [npm](https://www.npmjs.com/) — включаючи сам React! Як це зробити, залежить від вашого існуючого налаштування:

* **Якщо ваш застосунок вже розділений на файли, що використовують оператори `import`,** спробуйте використати наявне налаштування. Перевірте, чи написання `<div />` у вашому JS-коді викликає синтаксичну помилку. Якщо так, можливо, вам потрібно [трансформувати JavaScript-код за допомогою Babel](https://babeljs.io/setup) та увімкнути [пресет Babel React](https://babeljs.io/docs/babel-preset-react) для використання JSX.

* **Якщо у вашого застосунку немає існуючого налаштування для компіляції JavaScript-модулів,** налаштуйте його за допомогою [Vite](https://vite.dev/). Спільнота Vite підтримує [багато інтеграцій з бекенд-фреймворками](https://github.com/vitejs/awesome-vite#integrations-with-backends), включаючи Rails, Django та Laravel. Якщо ваш бекенд-фреймворк не в списку, [дотримуйтесь цього гайду](https://vite.dev/guide/backend-integration.html) для ручної інтеграції збірок Vite з вашим бекендом.

Щоб перевірити, чи працює ваше налаштування, виконайте цю команду у теці вашого проєкту:

```bash
npm install react react-dom
```

Потім додайте ці рядки коду на початку вашого головного JavaScript-файлу (він може називатися `index.js` або `main.js`):

**index.html:**
```html
<!DOCTYPE html>
<html>
  <head><title>Мій застосунок</title></head>
  <body>
    <!-- Ваш існуючий контент сторінки (у цьому прикладі він буде замінений) -->
    <div id="root"></div>
  </body>
</html>
```

**src/index.js:**
```javascript
import { createRoot } from 'react-dom/client';

// Очистити існуючий HTML-контент
document.body.innerHTML = '<div id="app"></div>';

// Відрендерити ваш компонент React замість нього
const root = createRoot(document.getElementById('app'));
root.render(<h1>Привіт, світе</h1>);
```

Якщо весь контент вашої сторінки був замінений на "Привіт, світе!", все працює! Продовжуйте читати.

> **Примітка:** Інтеграція модульного JavaScript-середовища в існуючий проєкт вперше може здатися страшною, але це того варте! Якщо ви застрягли, спробуйте наші [ресурси спільноти](/community) або [Vite Chat](https://chat.vite.dev/).

### Крок 2: Рендеріть компоненти React де завгодно на сторінці

У попередньому кроці ви помістили цей код на початку головного файлу:

```javascript
import { createRoot } from 'react-dom/client';

// Очистити існуючий HTML-контент
document.body.innerHTML = '<div id="app"></div>';

// Відрендерити ваш компонент React замість нього
const root = createRoot(document.getElementById('app'));
root.render(<h1>Привіт, світе</h1>);
```

Звичайно, ви не хочете насправді очищати існуючий HTML-контент!

Видаліть цей код.

Натомість ви, ймовірно, хочете рендерити компоненти React у конкретних місцях вашого HTML. Відкрийте HTML-сторінку (або серверні шаблони, які її генерують) та додайте унікальний атрибут [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) до будь-якого тегу, наприклад:

```html
<!-- ... десь у вашому html ... -->
<nav id="navigation"></nav>
<!-- ... більше html ... -->
```

Це дозволяє знайти цей HTML-елемент за допомогою [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) та передати його у [`createRoot`](/reference/react-dom/client/createRoot), щоб відрендерити ваш власний компонент React всередині:

**public/index.html:**
```html
<!DOCTYPE html>
<html>
  <head><title>Мій застосунок</title></head>
  <body>
    <p>Цей параграф є частиною HTML.</p>
    <nav id="navigation"></nav>
    <p>Цей параграф також є частиною HTML.</p>
  </body>
</html>
```

**src/index.js:**
```javascript
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Реалізувати навігаційну панель
  return <h1>Привіт від React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

Зверніть увагу, як оригінальний HTML-контент з `index.html` зберігається, але ваш власний компонент `NavigationBar` React тепер з'являється всередині `<nav id="navigation">` з вашого HTML. Прочитайте [документацію з використання `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react), щоб дізнатися більше про рендеринг компонентів React всередині існуючої HTML-сторінки.

Коли ви впроваджуєте React в існуючий проєкт, поширена практика — починати з малих інтерактивних компонентів (наприклад, кнопок), а потім поступово "рухатися вгору", поки врешті-решт вся ваша сторінка не буде побудована з React. Якщо ви коли-небудь досягнете цієї точки, ми рекомендуємо мігрувати на [фреймворк React](/learn/creating-a-react-app) відразу після цього, щоб отримати максимум від React.

---

## Використання React Native в існуючому нативному мобільному застосунку

[React Native](https://reactnative.dev/) також можна інтегрувати в існуючі нативні застосунки поступово. Якщо у вас є існуючий нативний застосунок для Android (Java або Kotlin) або iOS (Objective-C або Swift), [дотримуйтесь цього гайду](https://reactnative.dev/docs/integration-with-existing-apps), щоб додати екран React Native до нього.

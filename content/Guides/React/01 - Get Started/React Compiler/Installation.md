# React Compiler — Встановлення

## Огляд

Цей комплексний гайд охоплює встановлення та налаштування React Compiler у застосунках React, з підтримкою React 17, 18 та найкращою продуктивністю з React 19.

## Передумови

- React 19 (рекомендовано) або React 17/18
- Дивіться [сумісність версій React](/reference/react-compiler/target) для деталей

---

## Встановлення

### npm
```bash
npm install -D babel-plugin-react-compiler@latest
```

### Yarn
```bash
yarn add -D babel-plugin-react-compiler@latest
```

### pnpm
```bash
pnpm install -D babel-plugin-react-compiler@latest
```

---

## Конфігурація за інструментом збірки

### Babel

Створіть або оновіть `babel.config.js`:

```js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // повинен запускатися першим!
    // ... інші плагіни
  ],
  // ... інша конфігурація
};
```

**Важливо:** React Compiler повинен запускатися **першим** у конвеєрі плагінів Babel, щоб мати доступ до оригінальної інформації вихідного коду.

### Vite (6.0.0+)

Використання `reactCompilerPreset`:

```bash
npm install -D @rolldown/plugin-babel
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
  ],
});
```

**Для старіших версій @vitejs/plugin-react:**

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

**Альтернатива з @rolldown/plugin-babel:**

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: ['babel-plugin-react-compiler'],
    }),
  ],
});
```

### Next.js

Зверніться до [документації Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler)

### React Router

```bash
npm install vite-plugin-babel
```

```js
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // якщо використовуєте TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack

Завантажувач від спільноти доступний за адресою [react-compiler-webpack](https://github.com/SukkaW/react-compiler-webpack)

### Expo

Дивіться [документацію Expo](https://docs.expo.dev/guides/react-compiler/)

### Metro (React Native)

React Native використовує Babel через Metro — дивіться [розділ Babel](#babel)

### Rspack

Дивіться [документацію Rspack](https://rspack.dev/guide/tech/react#react-compiler)

### Rsbuild

Дивіться [документацію Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler)

---

## Інтеграція з ESLint

Встановіть плагін ESLint:

```bash
npm install -D eslint-plugin-react-hooks@latest
```

Дотримуйтесь [інструкцій встановлення eslint-plugin-react-hooks](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation), якщо ще не налаштовано.

Плагін ESLint надає:
- Ідентифікацію порушень [Правил React](/reference/rules)
- Виявлення компонентів, які не можуть бути оптимізовані
- Корисні повідомлення про помилки для виправлень

---

## Перевірка

### Перевірка через React DevTools

1. Встановіть розширення браузера [React Developer Tools](/learn/react-developer-tools)
2. Відкрийте застосунок у режимі розробки
3. Відкрийте React DevTools
4. Шукайте позначку "Memo ✨" біля імен компонентів

**Що вказує на працюючий компілятор:**
- Компоненти показують позначку "Memo ✨"
- Дорогі обчислення автоматично мемоїзуються
- Ручний `useMemo` не потрібен

### Перевірка вихідного коду збірки

Шукайте автоматичну логіку мемоїзації в скомпільованому коді:

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
```

---

## Усунення неполадок

### Виключення окремих компонентів

Використовуйте директиву `"use no memo"` для пропуску оптимізації:

```js
function ProblematicComponent() {
  "use no memo";
  // Код компонента тут
}
```

Для додаткової допомоги дивіться [гайд з налагодження](/learn/react-compiler/debugging)

---

## Наступні кроки

- [Сумісність версій React](/reference/react-compiler/target)
- [Опції конфігурації](/reference/react-compiler/configuration)
- [Стратегії поступового впровадження](/learn/react-compiler/incremental-adoption)
- [Техніки налагодження](/learn/react-compiler/debugging)
- [Гайд з компіляції бібліотек](/reference/react-compiler/compiling-libraries)

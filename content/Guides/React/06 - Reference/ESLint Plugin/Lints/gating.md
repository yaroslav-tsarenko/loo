# gating

## Огляд

Це правило перевіряє конфігурацію режиму gating у React Compiler.

**Призначення:** Режим gating дозволяє поступово впроваджувати React Compiler, позначаючи конкретні компоненти для оптимізації. Це правило гарантує, що ваша конфігурація gating є валідною, щоб компілятор знав, які компоненти обробляти.

---

## Деталі правила

### Невалідні приклади

**Відсутні обов'язкові поля:**
```js
// ❌ Відсутні обов'язкові поля
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // Відсутнє поле 'source'
      }
    }]
  ]
};
```

**Невалідний тип gating:**
```js
// ❌ Невалідний тип gating
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // Має бути об'єктом
    }]
  ]
};
```

### Валідні приклади

**Повна конфігурація gating:**
```js
// ✅ Повна конфігурація gating
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // назва експортованої функції
        source: 'featureFlags' // назва модуля
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}
```

**Без gating (компілювати все):**
```js
// ✅ Без gating (компілювати все)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Немає поля gating - компілює всі компоненти
    }]
  ]
};
```

---

## Ключові поля конфігурації

- **`importSpecifierName`** (обов'язкове, коли gating увімкнено): Назва експортованої функції з вашого модуля gating
- **`source`** (обов'язкове, коли gating увімкнено): Назва модуля, який експортує вашу функцію gating

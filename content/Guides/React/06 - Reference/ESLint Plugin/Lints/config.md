# config

## Огляд

Ця сторінка документує правило `config` для React Compiler, яке перевіряє параметри конфігурації компілятора для запобігання тихих помилок через друкарські помилки або неправильні налаштування.

## Деталі правила

React Compiler приймає різні параметри конфігурації для керування його поведінкою. Правило `config` гарантує, що:
- Конфігурація використовує правильні назви параметрів
- Значення параметрів мають правильні типи
- Друкарські помилки та неправильні налаштування виявляються до того, як вони спричинять тихі збої

## Невалідні приклади

### Невідома назва параметра (друкарська помилка)
```js
// ❌ Невідома назва параметра
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // Друкарська помилка: має бути compilationMode
    }]
  ]
};
```

### Невалідне значення параметра
```js
// ❌ Невалідне значення параметра
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // Невалідне: використовуйте 'all' або 'infer'
    }]
  ]
};
```

## Валідні приклади

### Правильна конфігурація
```js
// ✅ Валідна конфігурація компілятора
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## Усунення проблем

### Поширені помилки конфігурації, яких слід уникати

```js
// ❌ Неправильно: Поширені помилки конфігурації
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Друкарська помилка в назві параметра
      compilationMod: 'all',
      // Неправильний тип значення
      panicThreshold: true,
      // Невідомий параметр
      optimizationLevel: 'max'
    }]
  ]
};
```

### Правильний підхід

```js
// ✅ Краще: Валідна конфігурація
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // або 'infer'
      panicThreshold: 'none', // або 'critical_errors', 'all_errors'
      // Використовуйте лише задокументовані параметри
    }]
  ]
};
```

**Основні валідні параметри:**
- `compilationMode`: приймає `'all'` або `'infer'`
- `panicThreshold`: приймає `'none'`, `'critical_errors'` або `'all_errors'`

Для повного списку валідних параметрів конфігурації зверніться до документації з конфігурації.

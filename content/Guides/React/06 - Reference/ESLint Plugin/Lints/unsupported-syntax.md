# unsupported-syntax

## Огляд

Перевіряє синтаксис, який React Compiler не підтримує. За потреби ви все ще можете використовувати цей синтаксис поза React, наприклад у автономній утілітній функції.

## Деталі правила

React Compiler повинен статично аналізувати ваш код для застосування оптимізацій. Такі функції, як `eval` та `with`, роблять неможливим статичне розуміння того, що код робить під час компіляції, тому компілятор не може оптимізувати компоненти, які їх використовують.

### Невалідні приклади

Приклади неправильного коду для цього правила:

```js
// ❌ Використання eval у компоненті
function Component({ code }) {
  const result = eval(code); // Не може бути проаналізовано
  return <div>{result}</div>;
}

// ❌ Використання оператора with
function Component() {
  with (Math) { // Динамічно змінює scope
    return <div>{sin(PI / 2)}</div>;
  }
}

// ❌ Динамічний доступ до властивостей через eval
function Component({propName}) {
  const value = eval(`props.${propName}`);
  return <div>{value}</div>;
}
```

### Валідні приклади

Приклади правильного коду для цього правила:

```js
// ✅ Використовуйте звичайний доступ до властивостей
function Component({propName, props}) {
  const value = props[propName]; // Може бути проаналізовано
  return <div>{value}</div>;
}

// ✅ Використовуйте стандартні методи Math
function Component() {
  return <div>{Math.sin(Math.PI / 2)}</div>;
}
```

## Усунення проблем

### Мені потрібно виконати динамічний код

Вам може знадобитися виконати код, наданий користувачем:

```js
// ❌ Неправильно: eval у компоненті
function Calculator({expression}) {
  const result = eval(expression); // Небезпечно та не оптимізується
  return <div>Result: {result}</div>;
}
```

Використовуйте безпечний парсер виразів замість ц��ого:

```js
// ✅ Краще: Використовуйте безпечний парсер
import {evaluate} from 'mathjs'; // або подібна бібліотека

function Calculator({expression}) {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      // Безпечне обчислення математичних виразів
      setResult(evaluate(expression));
    } catch (error) {
      setResult('Invalid expression');
    }
  };

  return (
    <div>
      <button onClick={calculate}>Calculate</button>
      {result && <div>Result: {result}</div>}
    </div>
  );
}
```

### Примітка щодо безпеки

Ніколи не використовуйте `eval` з введенням користувача — це ризик безпеки. Використовуйте спеціалізовані бібліотеки для парсингу для конкретних випадків використання, таких як математичні вирази, парсинг JSON або обчислення шаблонів.

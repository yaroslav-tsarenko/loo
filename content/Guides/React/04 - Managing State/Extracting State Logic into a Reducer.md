# Виділення логіки State в Reducer

## Огляд

Ця документація навчає, як консолідувати складну логіку оновлення state за межами React-компонентів за допомогою reducer. Це особливо корисно для компонентів з багатьма оновленнями state, розподіленими між кількома обробниками подій.

## Що ви дізнаєтесь

- Що таке функція reducer
- Як рефакторити `useState` на `useReducer`
- Коли використовувати reducer
- Як писати його правильно

## Консолідація логіки State за допомогою Reducer

У міру зростання складності компонентів управління кількома оновленнями state через різні обробники подій стає складним. Рішення — перемістити логіку оновлення state в одну функцію, яка називається "reducer".

### Процес міграції з трьох кроків

#### Крок 1: Перейдіть від встановлення State до відправки дій (dispatch actions)

Замість прямого виклику `setTasks` в обробниках подій, ви відправляєте "дії" (actions), що описують, що зробив користувач:

**До:**
```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}
```

**Після:**
```js
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}
```

**Ключова концепція:** Об'єкти дій містять мінімальну інформацію про те, що сталося, зазвичай із:
- Рядком `type`, що описує, що сталося
- Додатковими полями з необхідними даними

#### Крок 2: Напишіть функцію Reducer

Функція reducer приймає два аргументи (поточний state та дію) і повертає наступний state:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

**Найкращі практики:**
- Використовуйте оператори switch (хоча if/else теж прийнятний)
- Огортайте кожен блок case фігурними дужками `{}` для запобігання конфліктів змінних
- Завжди повертайте значення з case для уникнення помилок fall-through

#### Крок 3: Використовуйте Reducer у вашому Component

Замініть `useState` на `useReducer`:

```js
import { useReducer } from 'react';

// Замість:
// const [tasks, setTasks] = useState(initialTasks);

// Використовуйте:
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

Hook `useReducer` приймає:
1. Функцію reducer
2. Початковий state

І повертає:
1. Значення state
2. Функцію dispatch

## Чому Reducer так називається?

Reducer названий за операцією `Array.reduce()`. Так само як `reduce()` акумулює одне значення з масиву, React-reducer акумулює state з серії дій:

```js
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

## Порівняння `useState` та `useReducer`

| Аспект | useState | useReducer |
|--------|----------|-----------|
| **Розмір коду** | Менше початкового коду | Більше коду спочатку, але може зменшити код, якщо багато обробників модифікують state подібним чином |
| **Читабельність** | Легко для простих оновлень; складно для складної логіки | Чітко розділяє "як" (reducer) від "що сталося" (обробники) |
| **Дебагінг** | Може бути складно знайти, де state було встановлено неправильно | Логування в reducer показує кожне оновлення і чому |
| **Тестування** | Тестувати компоненти в реалістичних умовах | Reducer — це чиста функція, легко тестується ізольовано |
| **Особисті переваги** | Справа смаку; обидва еквівалентні і можуть використовуватися разом |

**Рекомендація:** Використовуйте reducer, коли ви стикаєтесь з багами через некоректні оновлення state або хочете більше структури в коді component.

## Написання хороших Reducer

### Два ключові поради

1. **Reducer повинні бути чистими**
   - Однакові входи завжди дають однаковий результат
   - Ніяких побічних ефектів (запити, таймаути, зовнішні операції)
   - Не мутуйте об'єкти чи масиви безпосередньо
   - Подібно до функцій оновлення state в `useState`

2. **Кожна дія описує одну взаємодію користувача**
   - Навіть якщо вона призводить до кількох змін даних
   - Приклад: відправте одну дію `reset_form` замість п'яти окремих дій `set_field`
   - Полегшує дебагінг — логи дій чітко показують історію взаємодій

## Написання лаконічних Reducer з Immer

Бібліотека `useImmerReducer` від Immer дозволяє стиль оновлення з мутаціями всередині reducer:

```js
import { useImmerReducer } from 'use-immer';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);
```

Immer створює копію state із застосованими мутаціями, зберігаючи іммутабельність під капотом.

## Підсумок

**Кроки міграції:**
1. Відправляйте дії з обробників подій, описуючи що сталося
2. Напишіть функцію reducer, яка повертає наступний state
3. Замініть `useState` на `useReducer`

**Ключові принципи:**
- Reducer допомагають з організацією коду, дебагінгом та тестуванням
- Reducer повинні бути чистими функціями
- Кожна дія представляє одну взаємодію користувача
- Використовуйте Immer для більш лаконічного синтаксису reducer зі стилем мутацій

# `startTransition`

## Огляд

`startTransition` дозволяє рендерити частину UI у фоновому режимі.

```js
startTransition(action)
```

---

## Довідка

### `startTransition(action)`

Функція `startTransition` дозволяє позначити оновлення стану як Transition.

```js
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### Параметри

- `action`: Функція, що оновлює стан шляхом виклику однієї або кількох [функцій `set`](/reference/react/useState#setstate). React викликає `action` негайно без параметрів та позначає всі оновлення стану, заплановані синхронно під час виклику функції `action`, як Transitions. Будь-які асинхронні виклики, що очікуються в `action`, будуть включені в transition, але наразі вимагають обгортання будь-яких функцій `set` після `await` у додатковий `startTransition`. Оновлення стану, позначені як Transitions, будуть [неблокуючими](#позначення-оновлення-стану-як-неблокуючого-transition) та [не відображатимуть небажані індикатори завантаження](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Повертає

`startTransition` не повертає нічого.

#### Застереження

- `startTransition` не надає способу відстежити, чи Transition виконується. Щоб показати індикатор очікування під час виконання Transition, вам потрібен [`useTransition`](/reference/react/useTransition).

- Ви можете обгорнути оновлення в Transition лише якщо маєте доступ до функції `set` цього стану. Якщо ви хочете запустити Transition у відповідь на якийсь проп або значення повернуте користувацьким хуком, спробуйте [`useDeferredValue`](/reference/react/useDeferredValue).

- Функція, яку ви передаєте в `startTransition`, викликається негайно, позначаючи всі оновлення стану під час її виконання як Transitions. Якщо ви спробуєте виконати оновлення стану в `setTimeout`, наприклад, вони не будуть позначені як Transitions.

- Ви повинні обгорнути будь-які оновлення стану після асинхронних запитів у інший `startTransition`, щоб позначити їх як Transitions. Це відоме обмеження, яке буде виправлено в майбутньому.

- Оновлення стану, позначене як Transition, буде перерване іншими оновленнями стану. Наприклад, якщо ви оновлюєте компонент діаграми всередині Transition, але потім починаєте вводити текст у поле введення, поки діаграма перерендерюється, React перезапустить роботу рендерингу діаграми після обробки оновлення стану поля введення.

- Оновлення Transition не можуть використовуватися для контролю текстових полів введення.

- Якщо є кілька одночасних Transitions, React наразі об'єднує їх разом. Це обмеження, яке може бути знято в майбутньому релізі.

---

## Використання

### Позначення оновлення стану як неблокуючого Transition

Ви можете позначити оновлення стану як *Transition*, обгорнувши його у виклик `startTransition`:

```js
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transitions дозволяють зберігати оновлення інтерфейсу користувача чуйними навіть на повільних пристроях.

З Transition ваш UI залишається чуйним посеред перерендерингу. Наприклад, якщо користувач натискає на вкладку, але потім змінює думку та натискає на іншу вкладку, він може це зробити без очікування завершення першого перерендерингу.

> **Примітка**: `startTransition` дуже подібний до [`useTransition`](/reference/react/useTransition), за винятком того, що він не надає прапорець `isPending` для відстеження виконання Transition. Ви можете викликати `startTransition`, коли `useTransition` недоступний. Наприклад, `startTransition` працює поза компонентами, наприклад, з бібліотеки даних.
>
> [Дізнайтеся про Transitions та подивіться приклади на сторінці `useTransition`.](/reference/react/useTransition)

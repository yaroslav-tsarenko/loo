# Збереження та скидання State

## Огляд

React відстежує, який state належить якому component, на основі їхньої позиції в дереві UI. State ізольований між компонентами, і ви можете контролювати, коли зберігати або скидати state між повторними рендерингами.

## Ключові концепції

### State прив'язаний до позиції в дереві рендерингу

React асоціює кожну частину state з правильним component за тим, де цей component знаходиться в дереві рендерингу — **а не** за тим, де він з'являється у вашому JSX-коді.

**Важливо:** React бачить компоненти за їхньою позицією в дереві, а не за їхнім порядком у коді. Два екземпляри одного component у різних позиціях дерева мають повністю ізольований state.

Приклад:
```jsx
export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  // Кожна позиція отримує свій власний незалежний state
}
```

Це два окремі лічильники, тому що кожен рендериться у своїй позиції в дереві, навіть якщо вони посилаються на один і той самий JSX-тег.

### Той самий Component у тій самій позиції зберігає State

Коли ви рендерите той самий component у тій самій позиції дерева з різними props, state зберігається:

```jsx
export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} />
      ) : (
        <Counter isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => setIsFancy(e.target.checked)}
        />
        Use fancy styling
      </label>
    </div>
  );
}
```

State лічильника зберігається при перемиканні `isFancy`, тому що обидві гілки рендерять `<Counter />` як першу дитину div.

### Пастка: Важлива позиція, а не структура JSX

React дбає про **позицію в дереві UI**, а не про структуру JSX. Два теги `<Counter />` у різних операторах `return`, але в тій самій позиції дерева, розглядаються як один і той самий component:

```jsx
export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />  {/* Перша дитина */}
        {/* ... */}
      </div>
    );
  }
  
  return (
    <div>
      <Counter isFancy={false} />  {/* Все ще перша дитина */}
      {/* ... */}
    </div>
  );
}
```

Обидва рендерять `Counter` як першу дитину, тому state зберігається. Умовна логіка не має значення для зіставлення дерева React.

### Різні компоненти в тій самій позиції скидають State

Коли ви рендерите різні типи компонентів у тій самій позиції, state знищується:

```jsx
export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p>
      ) : (
        <Counter />
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => setIsPaused(e.target.checked)}
        />
        Take a break
      </label>
    </div>
  );
}
```

Перемикання між `<p>` та `<Counter />` знищує state лічильника, тому що різні типи компонентів рендеряться в тій самій позиції.

### Пастка: Вкладене визначення компонентів

Ніколи не визначайте функції компонентів всередині інших компонентів:

```jsx
// Неправильно — MyTextField перестворюється при кожному рендері
export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');
    return <input value={text} onChange={e => setText(e.target.value)} />;
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => setCounter(counter + 1)}>
        Clicked {counter} times
      </button>
    </>
  );
}
```

Кожен рендер створює *іншу* функцію `MyTextField`, тому React бачить її як інший component і скидає її state.

**Рішення:** Визначайте компоненти на верхньому рівні:

```jsx
// Правильно
function MyTextField() {
  const [text, setText] = useState('');
  return <input value={text} onChange={e => setText(e.target.value)} />;
}

export default function MyComponent() {
  const [counter, setCounter] = useState(0);
  return (
    <>
      <MyTextField />
      <button onClick={() => setCounter(counter + 1)}>
        Clicked {counter} times
      </button>
    </>
  );
}
```

## Скидання State в тій самій позиції

Є два способи примусити React скинути state component:

### Варіант 1: Рендерити компоненти в різних позиціях

Фізично розмістіть компоненти в різних позиціях дерева:

```jsx
export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA && <Counter person="Taylor" />}
      {!isPlayerA && <Counter person="Sarah" />}
      <button onClick={() => setIsPlayerA(!isPlayerA)}>
        Next player!
      </button>
    </div>
  );
}
```

Лічильник кожного гравця з'являється в різній позиції, тому їхні стани є незалежними і скидаються при перемиканні.

### Варіант 2: Використання prop `key`

Використовуйте prop `key` для надання кожному component явної ідентичності:

```jsx
export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => setIsPlayerA(!isPlayerA)}>
        Next player!
      </button>
    </div>
  );
}
```

`key` вказує React використовувати сам ключ як частину позиції, а не лише порядок component. Різні ключі означають різні компоненти, тому state скидається при зміні ключів.

> **Примітка:** Ключі **не є глобально унікальними** — вони лише визначають позицію в межах батька.

### Скидання форм за допомогою ключів

Це особливо корисно для форм. При перемиканні між контактами в чат-застосунку ви хочете, щоб поле введення очищалося:

```jsx
// App.js
export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  );
}

// Chat.js
export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section>
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

Додавши `key={to.id}`, component `Chat` перестворюється (і його поле введення очищається) щоразу, коли контакт змінюється.

## Збереження State для видалених компонентів

Якщо ви хочете зберегти state введення, коли component приховується/видаляється, є кілька варіантів:

1. **Рендерити всі компоненти з приховуванням через CSS** — Тримайте всі чати в DOM, але приховані. Працює для простих UI, але може бути повільним.
2. **Підняти state вгору** — Перемістіть state до батьківського component. Це найпоширеніше рішення.
3. **Використовувати localStorage** — Зберігайте чернетки у сховищі браузера, щоб вони пережили навігацію.

## Підсумок

- React зберігає state component, поки він рендериться в тій самій позиції в дереві UI
- Якщо component видаляється або інший component рендериться в тій самій позиції, його state знищується
- Використовуйте `key` для надання компонентам явної ідентичності, незалежної від порядку в дереві
- Не вкладайте визначення компонентів — визначайте компоненти на верхньому рівні
- Структура дерева повинна збігатися між рендерами для збереження state
- Використовуйте різні значення `key` для примусового скидання state component

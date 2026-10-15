# Управління State

## Вступ

У міру зростання застосунків стає критично важливою навмисна організація state та потоку даних між компонентами. Цей розділ охоплює:

- Осмислення змін UI як змін state
- Ефективне структурування state для запобігання багам
- Спільне використання state між компонентами
- Контроль збереження та скидання state
- Консолідація складної логіки state
- Передача інформації без "prop drilling"
- Масштабування управління state

---

## 1. Реагування на введення за допомогою State

У React ви описуєте різні візуальні стани вашого component замість безпосередньої маніпуляції UI. Замість імперативних команд ("вимкнути кнопку", "показати повідомлення"), ви описуєте UI для кожного state і запускаєте зміни у відповідь на введення користувача.

### Приклад: Форма вікторини

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Імітуємо мережевий запит
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

Змінна state `status` визначає, чи кнопка відправки увімкнена, і чи потрібно показувати повідомлення про успіх.

---

## 2. Вибір структури State

Добре структурований state запобігає багам і робить компоненти підтримуваними. **Ключовий принцип: State не повинен містити надлишкову або дубльовану інформацію.**

### Проблема: Надлишковий State

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let's check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

State `fullName` є надлишковим — його можна обчислити з `firstName` та `lastName`.

### Рішення: Обчислення під час рендерингу

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let's check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

Обчислюючи `fullName` під час рендерингу, ви усуваєте проблему синхронізації та зменшуєте кількість багів.

---

## 3. Спільне використання State між компонентами

Для синхронізації state між компонентами перемістіть state до їх найближчого спільного батьківського component і передайте його вниз через props. Це називається **"підняття state вгору" (lifting state up)**.

### Приклад: Component Accordion

```jsx
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from алма, the Kazakh word for "apple".
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive, onShow }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

Батьківський component `Accordion` зберігає state `activeIndex` і контролює, яка панель відображається на основі активного індексу.

---

## 4. Збереження та скидання State

За замовчуванням React зберігає state component при повторному рендерингу. Однак ви можете примусово скинути state, призначивши інший prop `key`.

### Проблема: State не скидається при навігації

```jsx
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

Введення в textarea зберігається при перемиканні контактів — потенційно це може призвести до відправки повідомлення не тій людині.

### Рішення: Використання Key для скидання State

```jsx
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

Використовуючи `key={to.email}`, перемикання одержувачів змушує React перестворити component `Chat`, скидаючи textarea.

---

## 5. Виділення логіки State в Reducer

Для компонентів з багатьма оновленнями state через різні обробники подій використовуйте **reducer** для консолідації логіки оновлення state в одну функцію.

### Приклад: Застосунок завдань з useReducer

```jsx
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

Обробники подій стають лаконічними, вказуючи лише тип дії, тоді як функція reducer обробляє всю логіку оновлення state.

---

## 6. Глибока передача даних через Context

**Context** дозволяє батьківським компонентам робити інформацію доступною для будь-якого дочірнього component без явної передачі props через кожен рівень.

### Приклад: Рівень заголовків з Context

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
        </Section>
      </Section>
    </Section>
  );
}
```

```jsx
// Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```jsx
// LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

Кожен `Section` надає рівень заголовка компонентам нижче через context, уникаючи "prop drilling".

---

## 7. Масштабування за допомогою Reducer та Context

Поєднуйте **reducer** та **context** для складного управління state у великих застосунках.

### Приклад: Застосунок завдань з Context та Reducer

```jsx
// TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: "Philosopher's Path", done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```jsx
// App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

Цей патерн розділяє управління state від логіки component, роблячи код більш підтримуваним та масштабованим.

---

## Підсумок

Розділ "Управління State" надає фундаментальні патерни для React-застосунків:

1. **Думайте в термінах змін state**, а не імперативних маніпуляцій з UI
2. **Уникайте надлишкового state** для запобігання багам синхронізації
3. **Піднімайте state вгору** для спільного використання між компонентами
4. **Використовуйте prop `key`** для контролю збереження та скидання state
5. **Використовуйте reducer** для управління складною логікою state
6. **Використовуйте context** для уникнення "prop drilling"
7. **Поєднуйте reducer та context** для масштабованого управління state

Ці практики забезпечують підтримуваність ваших React-застосунків у міру зростання їх складності.

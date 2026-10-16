# Масштабування за допомогою Reducer та Context

## Огляд

Ця документація навчає, як поєднувати reducer та context у React для управління складним state застосунку без "prop drilling". Як приклад демонструється практичний застосунок управління завданнями.

## Ключові концепції

**Основні цілі навчання:**
- Поєднання reducer з context
- Уникнення передачі state та dispatch через props
- Зберігання context та логіки state в окремому файлі

## Проблема: Prop Drilling

При використанні `useReducer` state та функція dispatch доступні лише на верхньому рівні. Щоб поділитися ними з вкладеними компонентами, потрібно передавати їх як props через кожен проміжний component — патерн, відомий як "prop drilling".

Приклад проблеми prop drilling:

> [!diagram] Prop drilling: дані йдуть через кожен рівень
> ```yaml
> layout: flow
> nodes:
>   - { id: app, label: TaskApp, code: "const [tasks, dispatch] = useReducer(…)", tone: violet, icon: "si:SiReact" }
>   - { id: list, label: TaskList, text: "лише передає далі", tone: gray }
>   - { id: task, label: Task, text: "використовує dispatch", tone: green }
> steps:
>   - { focus: app, line: "app:1", note: "TaskApp викликає useReducer: tasks і dispatch доступні лише тут, нагорі." }
>   - { move: { from: app, to: list, value: "tasks, dispatch" }, note: "TaskList мусить прийняти їх як props — хоча сам dispatch йому не потрібен." }
>   - { move: { from: list, to: task, value: "task, dispatch" }, note: "Лише Task справді викликає dispatch. Проміжний рівень працює «транзитом» — це і є prop drilling." }
>   - { focus: [app, list, task], note: "Що глибше дерево, то більше таких транзитних props. Context дає змогу Task узяти дані напряму — про це далі." }
> ```

## Рішення: Поєднання Reducer з Context

### Крок 1: Створіть Context

Створіть два окремі context — один для state і один для функції dispatch:

```js
// TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

Розділення їх дозволяє компонентам підписуватися лише на те, що їм потрібно.

### Крок 2: Надайте значення Context

Обгорніть дерево компонентів обома провайдерами context:

```jsx
import { useReducer } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

### Крок 3: Використовуйте Context у компонентах

Компоненти тепер можуть отримувати доступ до state та dispatch без prop drilling:

**Читання завдань:**
```jsx
import { useContext } from 'react';
import { TasksContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  // Використовуємо tasks безпосередньо
}
```

**Відправка дій (dispatch):**
```jsx
import { useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const dispatch = useContext(TasksDispatchContext);
  
  return (
    <button onClick={() => {
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>Add</button>
  );
}
```

## Найкраща практика: Консолідація всього в одному файлі

Створіть component-провайдер та користувацькі hooks в одному файлі:

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
    case 'added':
      return [...tasks, { id: action.id, text: action.text, done: false }];
    case 'changed':
      return tasks.map(t => t.id === action.task.id ? action.task : t);
    case 'deleted':
      return tasks.filter(t => t.id !== action.id);
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

const initialTasks = [
  { id: 0, text: "Philosopher's Path", done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

**Спрощений component App:**
```jsx
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

**Використання користувацьких hooks у компонентах:**
```jsx
import { useTasks, useTasksDispatch } from './TasksContext.js';

function Task({ task }) {
  const dispatch = useTasksDispatch();
  // Відправляємо дії безпосередньо
}

function TaskList() {
  const tasks = useTasks();
  // Отримуємо доступ до tasks безпосередньо
}
```

## Повний приклад: Component AddTask

```jsx
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

## Повний приклад: Component TaskList

```jsx
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}
```

## Переваги

- **Без prop drilling**: Дані течуть безпосередньо через context
- **Чисті компоненти**: Компоненти фокусуються на логіці відображення, а не на джерелі даних
- **Масштабованість**: Легко додавати нові пари context-reducer у міру зростання застосунку
- **Підтримуваність**: Вся логіка state ізольована в одному файлі

## Підсумок

Цей патерн поєднання `useReducer` з context ефективно управляє складним state у React-застосунках. Користувацькі hooks (`useTasks`, `useTasksDispatch`) надають чистий API для споживання context у всьому дереві компонентів.

**Ключові висновки:**
- Створюйте окремі context для state та dispatch
- Обгортайте дерево компонентів провайдерами
- Використовуйте користувацькі hooks для читання context
- Зберігайте reducer та context в одному файлі для кращої організації
- Компоненти стають простішими та зосередженими на своїй відповідальності

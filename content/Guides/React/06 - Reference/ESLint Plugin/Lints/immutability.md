# immutability

## Огляд

Це правило перевіряє мутацію props, state та інших значень, які є іммутабельними. Props та state компонента є іммутабельними знімками і ніколи не повинні мутуватися напряму. Замість цього передавайте нові props та використовуйте функцію setter з `useState`.

## Деталі правила

Props та state у React є іммутабельними знімками. Прямих мутацій слід уникати. Замість цього:
- Передавайте нові props дочірнім компонентам
- Використовуйте функцію setter з `useState` для оновлення state новими значеннями

## Поширені порушення

### Невалідні приклади

**Мутація через push масиву:**
```js
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // Мутація!
    setItems(items); // Та сама посилання, без повторного рендерингу
  };
}
```

**Присвоєння властивості об'єкта:**
```js
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    user.name = 'Bob'; // Мутація!
    setUser(user); // Та сама посилання
  };
}
```

**Sort без spread:**
```js
function Component() {
  const [items, setItems] = useState([3, 1, 2]);

  const sortItems = () => {
    setItems(items.sort()); // sort мутує!
  };
}
```

### Валідні приклади

**Створення нового масиву:**
```js
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // Новий масив
  };
}
```

**Створення нового об'єкта:**
```js
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    setUser({...user, name: 'Bob'}); // Новий об'єкт
  };
}
```

## Усунення проблем

### Додавання елементів до масиву

**Неправильний підхід — мутація масиву:**
```js
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    todos.push({id, text});
    setTodos(todos); // Та сама посилання на масив!
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

**Правильний підхід — створення нового масиву:**
```js
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    setTodos([...todos, {id, text}]);
    // Або: setTodos(todos => [...todos, {id: Date.now(), text}])
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

### Оновлення вкладених об'єктів

**Неправильний підхід — мутація вкладеного об'єкта:**
```js
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    user.settings.theme = 'dark'; // Мутація!
    setUser(user); // Та сама посилання на об'єкт
  };
}
```

**Правильний підхід — створення нових об'єктів на кожному рівні:**
```js
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        theme: 'dark'
      }
    });
  };
}
```

# Оновлення масивів у state

## Вступ

Масиви є мутабельними в JavaScript, але повинні розглядатися як незмінні при зберіганні у state React. Як і об'єкти, оновлення масиву у state вимагає створення нового масиву (або копіювання існуючого), а не прямої модифікації.

### Цілі навчання
- Як додавати, видаляти або змінювати елементи масиву у state React
- Як оновити об'єкт всередині масиву
- Як зробити копіювання масиву менш повторюваним за допомогою Immer

---

## Оновлення масивів без мутації

У state React **масиви повинні розглядатися як доступні лише для читання**. Це означає:
- Не перепризначайте елементи: `arr[0] = 'bird'`
- Не використовуйте мутуючі методи, такі як `push()` та `pop()`

Натомість створюйте новий масив, використовуючи немутуючі методи, а потім встановлюйте state з новим масивом.

### Довідник поширених операцій з масивами

| Операція | Уникайте (Мутує) | Використовуйте (Повертає новий масив) |
|----------|-------------------|---------------------------------------|
| Додавання | `push`, `unshift` | `concat`, `[...arr]` синтаксис spread |
| Видалення | `pop`, `shift`, `splice` | `filter`, `slice` |
| Заміна | `splice`, `arr[i] = ...` | `map` |
| Сортування | `reverse`, `sort` | Спочатку скопіюйте масив |

Альтернативно, використовуйте **Immer**, щоб використовувати методи з обох стовпців.

### Важливо: `slice` vs `splice`

> **Застереження**: Ці методи мають схожі назви, але дуже відрізняються:
> - **`slice`** (без 'p') — копіює масив або його частину (не мутує)
> - **`splice`** — мутує масив для вставки або видалення елементів
>
> У React використовуйте `slice` набагато частіше.

---

## Додавання до масиву

### Не використовуйте `push()`

```js
button onClick={() => {
  artists.push({
    id: nextId++,
    name: name,
  });
}}>Add</button>
```

Це мутує оригінальний масив і не запустить повторний render.

### Використовуйте синтаксис spread

```js
setArtists([
  ...artists,
  { id: nextId++, name: name }
]);
```

### Додавання на початок

Використовуйте синтаксис spread на початку, щоб додати елементи на початок:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists
]);
```

### Приклад: Повне додавання до масиву

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

---

## Видалення з масиву

Використовуйте метод `filter()` для створення нового масиву без елемента, який потрібно видалити:

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

### Повний приклад

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(initialArtists);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

---

## Трансформація масиву

Використовуйте `map()` для створення нового масиву з трансформованими елементами:

```js
const nextShapes = shapes.map(shape => {
  if (shape.type === 'square') {
    return shape; // Без змін
  } else {
    return {
      ...shape,
      y: shape.y + 50, // Переміщуємо кола вниз
    };
  }
});
setShapes(nextShapes);
```

### Повний приклад: Переміщення фігур

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(initialShapes);

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        return shape;
      } else {
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
            background: 'purple',
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            borderRadius: shape.type === 'circle' ? '50%' : '',
            width: 20,
            height: 20,
          }}
        />
      ))}
    </>
  );
}
```

---

## Заміна елементів у масиві

Використовуйте `map()` для заміни конкретних елементів. Другий аргумент надає індекс:

```js
const nextCounters = counters.map((c, i) => {
  if (i === index) {
    return c + 1; // Замінюємо цей елемент
  } else {
    return c; // Залишаємо без змін
  }
});
setCounters(nextCounters);
```

### Повний приклад: Список лічильників

```js
import { useState } from 'react';

let initialCounters = [0, 0, 0];

export default function CounterList() {
  const [counters, setCounters] = useState(initialCounters);

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        return c + 1;
      } else {
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Вставка в масив

Використовуйте синтаксис spread з `slice()` для вставки в конкретну позицію:

```js
const insertAt = 1;
const nextArtists = [
  ...artists.slice(0, insertAt),      // Елементи до
  { id: nextId++, name: name },       // Новий елемент
  ...artists.slice(insertAt)          // Елементи після
];
setArtists(nextArtists);
```

### Повний приклад

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(initialArtists);

  function handleClick() {
    const insertAt = 1;
    const nextArtists = [
      ...artists.slice(0, insertAt),
      { id: nextId++, name: name },
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

---

## Інші зміни масиву

Для операцій, таких як `reverse()` та `sort()`, які мутують масив, **спочатку скопіюйте масив**:

```js
const nextList = [...list];
nextList.reverse();
setList(nextList);
```

### Повний приклад: Розвернути масив

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

### Важливо: Обмеження поверхневого копіювання

Копіювання масиву є **поверхневим** — новий масив містить посилання на ті самі об'єкти:

```js
const nextList = [...list];
nextList[0].seen = true; // Проблема: мутує list[0]
```

Навіть якщо `nextList` та `list` — це різні масиви, `nextList[0]` та `list[0]` вказують на **один і той самий об'єкт**. Це мутує state!

---

## Оновлення об'єктів всередині масивів

Об'єкти в масивах не знаходяться буквально "всередині" — масив містить посилання на об'єкти. При оновленні вкладених властивостей **створюйте нові об'єкти від точки зміни до верхнього рівня**.

### Проблема: Випадковий спільний state

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Проблема: мутує оригінальний об'єкт
setMyList(myNextList);
```

### Рішення: Використовуйте `map()` для створення нових об'єктів

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    return { ...artwork, seen: nextSeen }; // Новий об'єкт
  } else {
    return artwork;
  }
}));
```

### Повний приклад: Список мистецтва (виправлений)

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(initialList);

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList}
      />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList}
      />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(artwork.id, e.target.checked);
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

---

## Написання лаконічної логіки оновлення з Immer

Для складних вкладених оновлень використовуйте [Immer](https://github.com/immerjs/use-immer) з hook `useImmer`. Immer дозволяє писати код зі зручним мутуючим синтаксисом, поки сам створює копії:

### Базове використання Immer

```js
const [myList, updateMyList] = useImmer(initialList);

function handleToggleMyList(id, nextSeen) {
  updateMyList(draft => {
    const artwork = draft.find(a => a.id === id);
    artwork.seen = nextSeen; // Виглядає як мутація, але безпечно!
  });
}
```

### Повний приклад: Список мистецтва з Immer

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(initialList);
  const [yourList, updateYourList] = useImmer(initialList);

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a => a.id === id);
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a => a.id === artworkId);
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList}
      />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList}
      />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(artwork.id, e.target.checked);
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

### Переваги Immer

- Ви можете застосовувати мутуючі методи, такі як `push()` та `pop()`, до `draft`
- Синтаксис мутації, такий як `artwork.seen = nextSeen`, тепер безпечний
- Під капотом Immer створює наступний state з нуля відповідно до ваших змін
- Зберігає обробники подій дуже лаконічними

---

## Підсумок

Ключові моменти:
- Поводьтеся з масивами у state React як з незмінними
- Використовуйте синтаксис spread `[...arr]` для додавання та додавання на початок
- Використовуйте `filter()` для видалення елементів
- Використовуйте `map()` для заміни або трансформації елементів
- Використовуйте `slice()` зі spread для вставки в конкретні позиції
- Копіюйте масиви перед використанням мутуючих методів, таких як `reverse()` або `sort()`
- При оновленні об'єктів всередині масивів створюйте нові об'єкти за допомогою `map()` та синтаксису spread
- Використовуйте Immer для чистішої, лаконічнішої логіки оновлення

---

## Завдання та рішення

### Завдання 1: Оновити елемент кошика покупок

Заповніть `handleIncreaseClick` для збільшення кількості товару:

```js
function handleIncreaseClick(productId) {
  setProducts(products.map(product => {
    if (product.id === productId) {
      return {
        ...product,
        count: product.count + 1
      };
    } else {
      return product;
    }
  }))
}
```

### Завдання 2: Видалити елемент кошика покупок

Реалізуйте кнопку зменшення, яка видаляє елементи при досягненні нуля:

```js
function handleDecreaseClick(productId) {
  let nextProducts = products.map(product => {
    if (product.id === productId) {
      return {
        ...product,
        count: product.count - 1
      };
    } else {
      return product;
    }
  });
  nextProducts = nextProducts.filter(p => p.count > 0);
  setProducts(nextProducts);
}
```

### Завдання 3: Виправити мутації (немутуючі методи)

Перепишіть обробники, щоб уникнути мутації:

```js
function handleAddTodo(title) {
  setTodos([
    ...todos,
    {
      id: nextId++,
      title: title,
      done: false
    }
  ]);
}

function handleChangeTodo(nextTodo) {
  setTodos(todos.map(t => {
    if (t.id === nextTodo.id) {
      return nextTodo;
    } else {
      return t;
    }
  }));
}

function handleDeleteTodo(todoId) {
  setTodos(todos.filter(t => t.id !== todoId));
}
```

### Завдання 4: Виправити мутації з Immer

Використовуйте `useImmer` для чистішого синтаксису:

```js
const [todos, updateTodos] = useImmer(initialTodos);

function handleAddTodo(title) {
  updateTodos(draft => {
    draft.push({
      id: nextId++,
      title: title,
      done: false
    });
  });
}

function handleChangeTodo(nextTodo) {
  updateTodos(draft => {
    const todo = draft.find(t => t.id === nextTodo.id);
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  });
}

function handleDeleteTodo(todoId) {
  updateTodos(draft => {
    const index = draft.findIndex(t => t.id === todoId);
    draft.splice(index, 1);
  });
}
```

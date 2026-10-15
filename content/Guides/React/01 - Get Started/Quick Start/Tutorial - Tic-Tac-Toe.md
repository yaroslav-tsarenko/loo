# Підручник: Хрестики-Нулики

## Огляд

Це комплексний підручник React для створення інтерактивної гри в хрестики-нулики. Він розрахований на людей, які навчаються на практиці та хочуть швидко створити щось реальне. Підручник охоплює фундаментальні концепції React, включаючи компоненти, props, state та подорож у часі (time-travel debugging).

## Структура підручника

Підручник поділений на чотири основні розділи:

1. **Налаштування для підручника** — Отримання початкової точки
2. **Огляд** — Вивчення основ React (компоненти, props, state)
3. **Завершення гри** — Поширені техніки розробки React
4. **Додавання подорожі у часі** — Дослідження унікальних сильних сторін React

---

## Створення дошки

Почніть з простого компонента `Square`, який повертає кнопку:

```js
export default function Square() {
  return <button className="square">X</button>;
}
```

Для створення кількох елементів використовуйте JSX-фрагменти (`<>...</>`):

```js
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Організуйте квадрати в сітку за допомогою елементів `div` з класом `board-row`:

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      {/* Додаткові рядки... */}
    </>
  );
}
```

---

## Передача даних через Props

Замість жорсткого кодування значень використовуйте props для передачі даних від батьківського до дочірнього компонента:

```js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      {/* Більше квадратів... */}
    </>
  );
}
```

**Ключова концепція:** Фігурні дужки `{}` дозволяють вбудовувати JavaScript-вирази в JSX.

---

## Створення інтерактивних компонентів

Використовуйте hook `useState` для керування state компонента:

```js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button className="square" onClick={handleClick}>
      {value}
    </button>
  );
}
```

---

## Підняття State вгору

Замість того, щоб кожен `Square` керував своїм state, підніміть state до батьківського компонента `Board`:

```js
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      {/* Більше квадратів... */}
    </>
  );
}
```

**Чому підняття state важливе:** Воно дозволяє батьківським компонентам керувати спільними даними та координувати дочірні компоненти.

---

## Чому іммутабельність важлива

Завжди створюйте нову копію даних замість прямої мутації:

```js
// ❌ Погано — пряма мутація
squares[0] = 'X';

// ✅ Добре — створення нової копії
const nextSquares = squares.slice();
nextSquares[0] = 'X';
```

**Переваги іммутабельності:**
- Легше реалізувати складні функції, як скасування/повтор
- Покращує продуктивність, роблячи виявлення змін дешевшим
- Запобігає помилкам від неочікуваних мутацій

---

## Чергування ходів

Відстежуйте, чий хід, та запобігайте перезапису заповнених клітин:

```js
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return; // Клітина вже заповнена
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // ... решта компонента
}
```

---

## Визначення переможця

Створіть допоміжну функцію для перевірки виграшних комбінацій:

```js
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

Використовуйте її для відображення статусу гри та запобігання ходам після перемоги:

```js
function handleClick(i) {
  if (calculateWinner(squares) || squares[i]) {
    return;
  }
  // ... решта handleClick
}

const winner = calculateWinner(squares);
let status;
if (winner) {
  status = 'Переможець: ' + winner;
} else {
  status = 'Наступний гравець: ' + (xIsNext ? 'X' : 'O');
}
```

---

## Додавання подорожі у часі

### Зберігання історії ходів

Створіть компонент `Game`, який зберігає всю історію гри:

```js
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Рендеринг дошки та списку ходів
}
```

### Відображення історії ходів

Використовуйте функцію `map()` для створення списку кнопок для кожного ходу:

```js
const moves = history.map((squares, move) => {
  let description;
  if (move > 0) {
    description = 'Перейти до ходу #' + move;
  } else {
    description = 'Перейти до початку гри';
  }
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});

return (
  <div className="game">
    <div className="game-board">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
    </div>
    <div className="game-info">
      <ol>{moves}</ol>
    </div>
  </div>
);
```

### Використання ключів у списках

Завжди надавайте унікальний prop `key` при рендерингу списків:

```js
<li key={move}>
  <button onClick={() => jumpTo(move)}>{description}</button>
</li>
```

**Чому ключі важливі:**
- Допомагають React ідентифікувати, які елементи змінилися
- Дозволяють React зберігати state компонента між повторними рендерами
- Забезпечують правильну анімацію та переходи

---

## Повний фінальний код

```js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Переможець: ' + winner;
  } else {
    status = 'Наступний гравець: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Перейти до ходу #' + move;
    } else {
      description = 'Перейти до початку гри';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

## CSS-стилі

```css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

---

## Пропоновані покращення

1. Показувати "Ви на ході #..." для поточного ходу замість кнопки
2. Переписати `Board` з використанням циклів замість жорсткого кодування квадратів
3. Додати перемикач для сортування ходів у зростаючому або спадному порядку
4. Підсвічувати три виграшні клітини, коли хтось виграє
5. Відображати координати ходів як (рядок, стовпець) в історії ходів

---

## Ключові висновки

- **Компоненти** — це багаторазові частини інтерфейсу
- **Props** дозволяють передавати дані від батьківського до дочірнього компонента
- **State** керує даними, які змінюються з часом
- **Підняття state вгору** дозволяє батьківським компонентам координувати дочірні
- **Іммутабельність** запобігає помилкам та покращує продуктивність
- **Ключі** допомагають React ідентифікувати елементи в списках
- React автоматично перерендерює компоненти при зміні state

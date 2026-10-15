# Legacy React APIs

## Огляд

Ці API експортуються з пакету `react`, але вони не рекомендуються для використання в новому коді. Дивіться окремі сторінки API для запропонованих альтернатив.

---

## Застарілі API

* **`Children`** — Дозволяє маніпулювати та перетворювати JSX, отриманий як prop `children`. Дивіться альтернативи.

* **`cloneElement`** — Дозволяє створити React елемент, використовуючи інший елемент як відправну точку. Дивіться альтернативи.

* **`Component`** — Дозволяє визначити React компонент як JavaScript клас. Дивіться альтернативи.

* **`createElement`** — Дозволяє створити React елемент. Зазвичай замість нього використовується JSX.

* **`createRef`** — Створює об'єкт ref, який може містити довільне значення. Дивіться альтернативи.

* **`forwardRef`** — Дозволяє вашому компоненту відкрити DOM вузол батьківському компоненту за допомогою ref.

* **`isValidElement`** — Перевіряє, чи є значення React елементом. Зазвичай використовується з `cloneElement`.

* **`PureComponent`** — Подібний до `Component`, але пропускає повторний рендер при однакових props. Дивіться альтернативи.

---

## Видалені API

Ці API були видалені в React 19:

* **`createFactory`** — Використовуйте JSX замість нього.

* **Class Components: `static contextTypes`** — Використовуйте `static contextType` замість нього.

* **Class Components: `static childContextTypes`** — Використовуйте `static contextType` замість нього.

* **Class Components: `static getChildContext`** — Використовуйте `Context` замість нього.

* **Class Components: `static propTypes`** — Використовуйте систему типів на кшталт TypeScript замість нього.

* **Class Components: `this.refs`** — Використовуйте `createRef` замість нього.

# `<option>`

## Вступ

Вбудований браузерний компонент `<option>` дозволяє рендерити варіант всередині поля вибору [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

---

## Довідка

### `<option>`

Вбудований браузерний компонент `<option>` дозволяє рендерити варіант всередині поля вибору [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

#### Props

`<option>` підтримує всі [загальні props елементів](/reference/react-dom/components/common#common-props).

Додатково `<option>` підтримує такі props:

- **`disabled`**: Булеве значення. Якщо `true`, варіант не можна вибрати, і він виглядає затемненим.
- **`label`**: Рядок. Визначає значення варіанту. Якщо не вказано, використовується текст всередині елемента option.
- **`value`**: Значення, яке буде використано [при відправці батьківського `<select>` у формі](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form), якщо цей варіант вибрано.

#### Застереження

- React не підтримує атрибут `selected` на `<option>`. Замість цього передайте `value` цього варіанту в батьківський [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) для некерованого поля вибору або [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) для керованого.

---

## Використання

### Відображення поля вибору з варіантами

Рендеріть `<select>` зі списком компонентів `<option>` всередині для відображення поля вибору. Надайте кожному `<option>` `value`, що представляє дані для відправки з формою.

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

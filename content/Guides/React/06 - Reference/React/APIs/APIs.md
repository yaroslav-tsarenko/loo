# Вбудовані API React

## Вступ

На додаток до [хуків](/reference/react/hooks) та [компонентів](/reference/react/components), пакет `react` експортує кілька інших API, корисних для визначення компонентів. Ця сторінка перелічує всі залишені сучасні API React.

## Основні API

- **[`createContext`](/reference/react/createContext)** — Дозволяє визначити та надати контекст дочірнім компонентам. Використовується з [`useContext`](/reference/react/useContext).

- **[`lazy`](/reference/react/lazy)** — Дозволяє відкласти завантаження коду компонента до його першого рендерингу.

- **[`memo`](/reference/react/memo)** — Дозволяє компоненту пропускати повторний рендеринг з тими самими пропсами. Використовується з [`useMemo`](/reference/react/useMemo) та [`useCallback`](/reference/react/useCallback).

- **[`startTransition`](/reference/react/startTransition)** — Дозволяє позначити оновлення стану як неургентне. Подібний до [`useTransition`](/reference/react/useTransition).

- **[`act`](/reference/react/act)** — Дозволяє обгортати рендери та взаємодії в тестах для забезпечення обробки оновлень перед перевірками.

## API ресурсів

*Ресурси* можуть бути доступні компоненту без їх наявності як частини стану. Наприклад, компонент може прочитати повідомлення з Promise або інформацію про стилі з контексту.

### Читання ресурсів

- **[`use`](/reference/react/use)** — Дозволяє прочитати значення ресурсу, такого як [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) або [контекст](/learn/passing-data-deeply-with-context).

#### Приклад використання

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

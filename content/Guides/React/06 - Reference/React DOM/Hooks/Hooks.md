# Вбудовані React DOM Hooks

## Огляд

Пакет `react-dom` містить Hooks, які підтримуються лише для веб-застосунків (які працюють у середовищі браузерного DOM). Ці Hooks не підтримуються в небраузерних середовищах, таких як iOS, Android або Windows-застосунки.

Якщо ви шукаєте Hooks, які підтримуються як у веб-браузерах, *так і в інших середовищах*, дивіться [сторінку React Hooks](/reference/react/hooks).

Ця сторінка перелічує всі Hooks у пакеті `react-dom`.

---

## Hooks для форм

*Форми* дозволяють створювати інтерактивні елементи керування для відправки інформації. Для управління формами у ваших компонентах використовуйте один із цих Hooks:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) — дозволяє оновлювати UI на основі статусу форми.

### Приклад використання

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```

Цей приклад демонструє, як:
- Використовувати `useActionState` для управління станом форми
- Використовувати `useFormStatus` для доступу до статусу `pending`
- Вимикати кнопку відправки під час відправки форми

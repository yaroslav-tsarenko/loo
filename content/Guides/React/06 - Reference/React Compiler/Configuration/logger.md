# logger

## Огляд

Параметр `logger` забезпечує користувацьке логування подій React Compiler під час компіляції.

## Базовий приклад

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[Compiler] ${event.kind}: ${filename}`);
    }
  }
}
```

## Довідка

### `logger`

Налаштовує користувацьке логування для відстеження поведінки компілятора та налагодження проблем.

#### Тип

```
{
  logEvent: (filename: string | null, event: LoggerEvent) => void;
} | null
```

#### Значення за замовчуванням

`null`

#### Методи

- **`logEvent`**: Викликається для кожної події компілятора з ім'ям файлу та деталями події

#### Типи подій

- **`CompileSuccess`**: Функцію успішно скомпільовано
- **`CompileError`**: Функцію пропущено через помилки
- **`CompileDiagnostic`**: Нефатальна діагностична інформація
- **`CompileSkip`**: Функцію пропущено з інших причин
- **`PipelineError`**: Несподівана помилка компіляції
- **`Timing`**: Інформація про час виконання

#### Застереження

- Структура подій може змінюватися між версіями
- Великі кодові бази генерують багато записів у лозі

## Приклади використання

### Базове логування

Відстеження успіхів та невдач компіляції:

```js
{
  logger: {
    logEvent(filename, event) {
      switch (event.kind) {
        case 'CompileSuccess': {
          console.log(`✅ Compiled: ${filename}`);
          break;
        }
        case 'CompileError': {
          console.log(`❌ Skipped: ${filename}`);
          break;
        }
        default: {}
      }
    }
  }
}
```

### Детальне логування помилок

Отримання конкретної інформації про невдачі компіляції:

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileError') {
        console.error(`\nCompilation failed: ${filename}`);
        console.error(`Reason: ${event.detail.reason}`);

        if (event.detail.description) {
          console.error(`Details: ${event.detail.description}`);
        }

        if (event.detail.loc) {
          const { line, column } = event.detail.loc.start;
          console.error(`Location: Line ${line}, Column ${column}`);
        }

        if (event.detail.suggestions) {
          console.error('Suggestions:', event.detail.suggestions);
        }
      }
    }
  }
}
```

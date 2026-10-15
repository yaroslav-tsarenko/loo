# Roadmap практики і проєкти

## Ціль уроку

Закріпити курс через проєкти, які поступово включають синтаксис, ООП, collections, coroutines, tests, Android/backend/KMP.

## Проєкт 1: Kotlin CLI калькулятор бюджету

Рівень: після модуля 2.

Функції:

- додати транзакцію;
- список транзакцій;
- сума доходів;
- сума витрат;
- balance;
- фільтр за category.

Що тренує:

- variables;
- functions;
- `when`;
- loops;
- collections;
- string templates.

## Проєкт 2: Task manager domain

Рівень: після модуля 3.

Функції:

- `Task`;
- `Project`;
- `TaskStatus`;
- `TaskPriority`;
- `TaskRepository`;
- `TaskService`;
- validation;
- sealed result для operations.

Що тренує:

- classes;
- data classes;
- enum;
- sealed interfaces;
- visibility;
- composition.

## Проєкт 3: Collection analytics

Рівень: після модуля 5.

Дані:

```kotlin
data class Order(
    val id: String,
    val customerId: String,
    val amount: Double,
    val status: OrderStatus
)
```

Задачі:

- total revenue;
- group by status;
- top customers;
- failed orders;
- average amount;
- sequence pipeline для великого списку.

## Проєкт 4: Async dashboard

Рівень: після модуля 6.

Функції:

- паралельно завантажити users/orders/payments;
- timeout;
- retry для однієї операції;
- `Flow` для live updates;
- cancellation.

Що тренує:

- `suspend`;
- `coroutineScope`;
- `async`;
- `withContext`;
- `Flow`;
- error handling.

## Проєкт 5: Ktor REST API

Рівень: після модуля 8.

Endpoints:

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/{id}`
- `PATCH /tasks/{id}`
- `DELETE /tasks/{id}`

Вимоги:

- DTO;
- service layer;
- repository interface;
- validation;
- status codes;
- route tests.

## Проєкт 6: Android Compose task app

Рівень: після Android уроку.

Screens:

- task list;
- task editor;
- filters;
- task details.

Вимоги:

- ViewModel;
- `StateFlow`;
- immutable UI state;
- Compose state hoisting;
- fake repository;
- unit tests для ViewModel.

## Проєкт 7: KMP shared module

Рівень: після KMP уроку.

Shared:

- domain models;
- validation;
- use cases;
- repository interface;
- common tests.

Platform-specific:

- storage;
- current time;
- UI.

## Фінальна перевірка

Ти добре засвоїв Kotlin, якщо можеш:

- пояснити nullable vs non-null типи;
- написати sealed result без `else` у `when`;
- працювати з collections без mutable state там, де він не потрібен;
- написати suspend API, яке main-safe;
- протестувати coroutine-код;
- налаштувати простий Gradle Kotlin/JVM проєкт;
- пояснити, що має йти в KMP common code.

## Далі

Переходь до [[Guides/Kotlin/09 - Practice Projects/02 - Джерела і подальше навчання|джерел і подальшого навчання]].


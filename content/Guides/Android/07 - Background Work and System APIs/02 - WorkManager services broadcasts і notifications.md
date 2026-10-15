# WorkManager services broadcasts і notifications

## Ціль уроку

Зрозуміти background work в Android: коли використовувати WorkManager, services, broadcasts і notifications.

## Background limits

Android обмежує background work для battery і performance. Не можна просто тримати нескінченний background thread.

## WorkManager

WorkManager підходить для deferrable, guaranteed background work:

- sync;
- upload logs;
- periodic refresh;
- retryable work;
- constraints: network, charging, idle.

```kotlin
class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        return try {
            syncRepository.sync()
            Result.success()
        } catch (e: IOException) {
            Result.retry()
        }
    }
}
```

## Services

Service потрібен для work, яка має виконуватись навіть без visible UI. Для user-visible long-running tasks часто потрібен foreground service з notification.

Не використовуй service там, де WorkManager краще відповідає задачі.

## BroadcastReceiver

BroadcastReceiver реагує на system/app broadcasts. У сучасному Android багато implicit broadcasts обмежені.

## Notifications

Notifications мають бути:

- relevant;
- user-controllable;
- через notification channels;
- permission-aware на сучасних Android versions.

## Вправа

1. Створи `SyncWorker`.
2. Додай network constraint.
3. Заплануй one-time work.
4. Для long-running sync спроєктуй notification UX.
5. Поясни, чому це не ViewModel coroutine.

## Типові помилки

- Запускати background sync у ViewModel і чекати, що він переживе app close.
- Використовувати foreground service без user-visible потреби.
- Не враховувати constraints.
- Не тестувати retry behavior.

## Джерела

- [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)
- [Services overview](https://developer.android.com/guide/components/services)
- [Broadcasts overview](https://developer.android.com/guide/components/broadcasts)
- [Notifications](https://developer.android.com/develop/ui/views/notifications)

## Далі

Переходь до [[Guides/Android/07 - Background Work and System APIs/03 - Permissions privacy location camera і media|permissions, privacy, location, camera і media]].


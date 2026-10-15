# Permissions privacy location camera і media

## Ціль уроку

Навчитися просити permissions правильно: мінімально, прозоро, в момент потреби й з graceful fallback.

## Permission принципи

Android permissions захищають:

- restricted data;
- restricted actions;
- privacy-sensitive APIs.

Best practices:

- проси мінімум permissions;
- проси runtime permission тільки коли user запускає feature;
- пояснюй, навіщо permission;
- обробляй deny і revoke;
- перевіряй dependencies, які можуть додавати permissions;
- не проси permission, якщо є privacy-friendly alternative.

## Runtime permissions

Install-time permissions granted at install. Runtime permissions треба просити під час виконання.

Приклад use case:

- user натиснув "Record audio";
- app пояснює потребу;
- app просить `RECORD_AUDIO`;
- якщо denied, feature показує fallback.

## Sensitive permissions

Особливо обережно:

- location;
- camera;
- microphone;
- contacts;
- calendar;
- SMS/call log;
- nearby devices;
- notifications;
- media.

На Android 12+ system показує privacy indicators для camera/microphone.

## Location

Проси location тільки в контексті user action. Якщо вистачає coarse location, не проси fine. Background location проси окремо й тільки за реальної потреби.

## Camera і media

Часто можна використати system picker або camera intent без широких storage permissions.

## Manifest exported

Для components з intent filters на Android 12+ явно вказуй `android:exported`.

## Вправа

Спроєктуй permission flow для camera feature:

1. Button "Take photo".
2. Rationale.
3. Permission request.
4. Granted path.
5. Denied path.
6. Permanently denied/settings path.

## Типові помилки

- Просити permissions на app startup.
- Просити fine location, коли досить coarse.
- Не обробляти denied/revoked state.
- Не пояснювати sensitive access.
- Додавати dependency і не перевіряти manifest permissions.

## Джерела

- [Permissions on Android](https://developer.android.com/training/permissions)
- [Request runtime permissions](https://developer.android.com/training/permissions/requesting)
- [App permissions best practices](https://developer.android.com/training/permissions/usage-notes)
- [Explain access to sensitive information](https://developer.android.com/training/permissions/explaining-access)

## Далі

Переходь до [[Guides/Android/08 - Testing Debugging and Performance/01 - Unit UI instrumentation і Compose tests|unit, UI, instrumentation і Compose tests]].


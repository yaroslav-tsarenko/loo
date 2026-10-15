# Security privacy і hardening checklist

## Ціль уроку

Навчитися базово захищати Android app: permissions, storage, network, exported components, secrets, logging і user data.

## Security principles

- Мінімізуй permissions.
- Не зберігай secrets у app binary.
- Не логуй personal/sensitive data.
- Використовуй HTTPS.
- Обмежуй exported components.
- Валідуй external input.
- Шифруй sensitive local data, якщо потрібно.
- Дотримуйся Google Play user data policies.

## Network security

Перевір:

- HTTPS для API;
- network security config, якщо потрібна custom policy;
- certificate pinning тільки якщо команда розуміє operational risks;
- no debug endpoints у release.

## Storage security

Sensitive data:

- не в plain text SharedPreferences;
- не в logs;
- не в screenshots, якщо це критично;
- подумай про encrypted storage;
- видаляй дані при logout, якщо use case цього вимагає.

## Exported components

У Manifest:

```xml
<activity
    android:name=".InternalActivity"
    android:exported="false" />
```

External entry points мають validation і least exposure.

## Secrets

API keys у mobile app не є справжніми secrets, бо app можна decompile. Для privileged operations потрібен backend.

## Вправа

Зроби security review task app:

1. Перевір Manifest на exported components.
2. Перевір permissions.
3. Перевір logs.
4. Перевір network URLs.
5. Перевір local storage.
6. Склади список ризиків.

## Типові помилки

- Вважати mobile API key секретом.
- Логувати tokens/user data.
- Робити Activity exported без потреби.
- Просити broad storage/location permissions.
- Ігнорувати release build security.

## Джерела

- [Security checklist](https://developer.android.com/guide/topics/security/security)
- [Improve your app's security](https://developer.android.com/privacy-and-security/security-best-practices)
- [Privacy best practices](https://developer.android.com/privacy-and-security/about)
- [Permissions best practices](https://developer.android.com/training/permissions/usage-notes)

## Далі

Переходь до [[Guides/Android/09 - Security Release and Practice/02 - Build variants signing Play release і CI|build variants, signing, Play release і CI]].


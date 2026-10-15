# Build variants signing Play release і CI

## Ціль уроку

Зрозуміти, як Android app готується до release: build variants, signing, minify, Play Console, versioning і CI.

## Build types

Типово:

- `debug`;
- `release`.

```kotlin
android {
    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
        }

        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

## Product flavors

Flavors корисні для environments або editions:

- dev;
- staging;
- prod;
- free/paid.

Не додавай flavors без потреби: variants швидко множаться.

## Versioning

- `versionCode` - integer для Play updates.
- `versionName` - user-facing string.

## Signing

Release app має бути підписана. Keystore - критичний секрет. Не commit-ь keystore і passwords у repo.

## Minify і R8

Release часто використовує:

- code shrinking;
- obfuscation;
- resource shrinking.

Тестуй release build, бо minification може зламати reflection/serialization, якщо rules неправильні.

## Play release

Перед release:

- privacy policy, якщо app збирає personal/sensitive data;
- Data safety form;
- target SDK compliance;
- permission declarations;
- app content rating;
- closed/internal testing;
- crash monitoring.

## CI

Мінімальний CI:

1. Gradle build.
2. Unit tests.
3. Lint.
4. Debug APK build.
5. Optional instrumentation tests.
6. Release bundle build для protected branch.

## Вправа

1. Додай debug applicationId suffix.
2. Увімкни minify для release.
3. Збери debug.
4. Збери release locally.
5. Напиши checklist перед Play upload.

## Типові помилки

- Не тестувати release build.
- Commit keystore/passwords.
- Забути versionCode bump.
- Вмикати flavors без реальної потреби.
- Ігнорувати Play policy/privacy requirements.

## Джерела

- [Configure build variants](https://developer.android.com/build/build-variants)
- [Sign your app](https://developer.android.com/studio/publish/app-signing)
- [Shrink, obfuscate, and optimize](https://developer.android.com/build/shrink-code)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

## Далі

Переходь до [[Guides/Android/09 - Security Release and Practice/03 - Roadmap практики проєкти і джерела|roadmap практики, проєктів і джерел]].


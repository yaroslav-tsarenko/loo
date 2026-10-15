# Що таке Android розробка

## Ціль уроку

Зрозуміти Android як платформу: з чого складається app, чому lifecycle важливий і який сучасний стек варто вчити.

## Android як платформа

Android - операційна система й екосистема для phones, tablets, foldables, ChromeOS, cars, watches, TV, XR та embedded devices. Android-app не живе як звичайна desktop-програма: систему цікавить battery, memory, privacy, background limits і lifecycle.

Типова Android-app складається з:

- Kotlin-коду;
- Android framework APIs;
- Jetpack libraries;
- UI на Jetpack Compose або Views;
- resources;
- manifest;
- Gradle build configuration;
- data layer: network, database, files;
- tests;
- signing/release setup.

## Сучасний Android стек

Для нового навчального проєкту обирай:

- Kotlin;
- Jetpack Compose;
- Material 3;
- single-activity architecture;
- ViewModel;
- StateFlow/Flow;
- Coroutines;
- Navigation Compose;
- Room;
- DataStore;
- WorkManager;
- Hilt або manual DI;
- JUnit + Compose UI tests;
- Gradle Kotlin DSL.

## Чому Android складний

Android складний не через синтаксис Kotlin, а через середовище:

- Activity може бути recreated після rotation.
- Process може бути killed у background.
- Permission може бути denied або revoked.
- Network може зникати.
- App має працювати на різних екранах.
- Background work має системні обмеження.
- Release build відрізняється від debug.

## Compose-first vs XML-first

Jetpack Compose - сучасний toolkit для побудови UI декларативним Kotlin API. Для нового курсу варто йти Compose-first. XML/View system усе ще існує у legacy-проєктах, тому після базового курсу корисно вивчити interoperability, але стартувати краще з Compose.

## Що треба знати до Android

Мінімум:

- Kotlin syntax;
- functions;
- classes/data classes;
- null-safety;
- collections;
- lambdas;
- coroutines basics.

Якщо Kotlin ще слабкий, пройди [[Guides/Kotlin/Зміст|Kotlin курс]] паралельно.

## Перевір себе

- Чому Android-app не має зберігати важливий state тільки в Activity?
- Навіщо потрібен Manifest?
- Чому permissions треба просити тільки в момент потреби?
- Чим Compose відрізняється від imperative UI?

## Джерела

- [Android Developers](https://developer.android.com/)
- [Kotlin and Android](https://developer.android.com/kotlin/)
- [Guide to app architecture](https://developer.android.com/jetpack/arch)
- [Get started with Jetpack Compose](https://developer.android.com/develop/ui/compose/documentation)

## Далі

Переходь до [[Guides/Android/01 - Start/02 - Android Studio SDK Gradle і перший проєкт|Android Studio, SDK, Gradle і першого проєкту]].


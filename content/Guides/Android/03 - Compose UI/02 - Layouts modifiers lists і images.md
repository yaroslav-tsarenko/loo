# Layouts modifiers lists і images

## Ціль уроку

Навчитися будувати Compose layout: `Column`, `Row`, `Box`, `Modifier`, lazy lists, images і responsive constraints.

## Основні layout composables

```kotlin
Column {
    Text("Title")
    Text("Subtitle")
}

Row {
    Icon(Icons.Default.Search, contentDescription = null)
    Text("Search")
}

Box {
    Text("Centered", modifier = Modifier.align(Alignment.Center))
}
```

## Modifier

`Modifier` описує layout, size, padding, click behavior, semantics, background тощо.

```kotlin
Text(
    text = "Android",
    modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
)
```

Порядок modifiers має значення.

```kotlin
Modifier
    .background(Color.Red)
    .padding(16.dp)
```

не те саме, що:

```kotlin
Modifier
    .padding(16.dp)
    .background(Color.Red)
```

## Lazy lists

```kotlin
LazyColumn {
    items(tasks, key = { it.id }) { task ->
        Text(task.title)
    }
}
```

Використовуй stable keys для списків, де items можуть змінювати порядок.

## Images

Resource image:

```kotlin
Image(
    painter = painterResource(R.drawable.logo),
    contentDescription = stringResource(R.string.app_logo)
)
```

Decorative image:

```kotlin
Image(
    painter = painterResource(R.drawable.divider),
    contentDescription = null
)
```

`contentDescription = null` означає, що screen reader має ігнорувати decorative image.

## Responsive basics

Не hardcode-ь layout під один phone. Використовуй:

- `fillMaxWidth`;
- `weight`;
- `BoxWithConstraints`;
- window size classes;
- adaptive layouts для tablets/foldables.

## Вправа

Зроби task list:

1. `LazyColumn`.
2. `TaskRow`.
3. Checkbox або icon для done.
4. Stable key по `id`.
5. Empty state.

## Типові помилки

- Використовувати звичайний `Column` для великого списку.
- Не ставити keys у dynamic lazy list.
- Забувати `contentDescription`.
- Робити fixed width/height там, де UI має адаптуватися.

## Джерела

- [Compose layouts](https://developer.android.com/develop/ui/compose/layouts)
- [Modifiers](https://developer.android.com/develop/ui/compose/modifiers)
- [Lists and grids](https://developer.android.com/develop/ui/compose/lists)
- [Images in Compose](https://developer.android.com/develop/ui/compose/graphics/images)
- [Build adaptive apps](https://developer.android.com/develop/ui/compose/layouts/adaptive)

## Далі

Переходь до [[Guides/Android/03 - Compose UI/03 - Material 3 theming forms і accessibility|Material 3, theming, forms і accessibility]].


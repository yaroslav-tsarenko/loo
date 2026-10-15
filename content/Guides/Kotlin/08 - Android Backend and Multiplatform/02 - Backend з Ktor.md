# Backend з Ktor

## Ціль уроку

Зрозуміти, як Kotlin використовується для backend API через Ktor: routing, serialization, status codes, testing.

## Що таке Ktor

Ktor - Kotlin framework для asynchronous server-side і client-side applications. Він добре підходить, коли хочеш Kotlin-native backend без важкої framework-магії.

## Мінімальний server

```kotlin
fun Application.module() {
    routing {
        get("/") {
            call.respondText("Hello, Ktor")
        }
    }
}
```

## Routing

```kotlin
routing {
    route("/users") {
        get {
            call.respond(users)
        }

        get("/{id}") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            call.respond(findUser(id))
        }
    }
}
```

## JSON serialization

```kotlin
fun Application.module() {
    install(ContentNegotiation) {
        json()
    }

    routing {
        post("/users") {
            val request = call.receive<CreateUserRequest>()
            val user = createUser(request)
            call.respond(HttpStatusCode.Created, user)
        }
    }
}
```

## Domain-first структура

```text
src/main/kotlin/
  Application.kt
  users/
    User.kt
    UserRepository.kt
    UserService.kt
    UserRoutes.kt
```

Routes мають бути тонкими:

- parse input;
- call service;
- return response.

Business logic краще тримати в services/domain layer.

## Error handling

```kotlin
install(StatusPages) {
    exception<IllegalArgumentException> { call, cause ->
        call.respond(HttpStatusCode.BadRequest, mapOf("error" to cause.message))
    }
}
```

## Testing

Ktor має test utilities для application tests.

```kotlin
@Test
fun `GET root returns hello`() = testApplication {
    application {
        module()
    }

    val response = client.get("/")
    assertEquals(HttpStatusCode.OK, response.status)
}
```

## Вправа

Створи API `tasks`:

1. `GET /tasks`
2. `POST /tasks`
3. `GET /tasks/{id}`
4. `TaskService`
5. Basic validation
6. Один test на route

## Типові помилки

- Писати всю логіку прямо в route handler.
- Не відокремлювати DTO від domain model у складних проєктах.
- Не ставити status codes явно.
- Ігнорувати tests для routing.

## Джерела

- [Ktor documentation](https://ktor.io/docs/welcome.html)
- [Ktor routing](https://ktor.io/docs/routing.html)
- [Ktor serialization](https://ktor.io/docs/server-serialization.html)
- [Ktor testing](https://ktor.io/docs/server-testing.html)

## Далі

Переходь до [[Guides/Kotlin/08 - Android Backend and Multiplatform/03 - Kotlin Multiplatform KMP|Kotlin Multiplatform]].


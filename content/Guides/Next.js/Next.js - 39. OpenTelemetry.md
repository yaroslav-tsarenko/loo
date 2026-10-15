# OpenTelemetry в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 36. Аналітика]], [[Next.js - 17. Деплоймент]]

OpenTelemetry — платформо-незалежний спосіб інструментації застосунків для моніторингу, логування та трейсингу.

## Швидкий старт з @vercel/otel

```bash
pnpm add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

```ts
// instrumentation.ts (корінь проєкту)
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

> Файл `instrumentation.ts` розміщується в корені проєкту (не в `app/` чи `pages/`).

## Ручна конфігурація

```bash
pnpm add @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

```ts
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node.ts')
  }
}
```

```ts
// instrumentation.node.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
})
sdk.start()
```

## Кастомні Spans

```ts
import { trace } from '@opentelemetry/api'

export async function fetchGithubStars() {
  return await trace
    .getTracer('nextjs-example')
    .startActiveSpan('fetchGithubStars', async (span) => {
      try {
        return await getValue()
      } finally {
        span.end()
      }
    })
}
```

## Вбудовані Spans

Next.js автоматично інструментує:

| Span | Тип | Опис |
|------|-----|------|
| `[method] [route]` | `BaseServer.handleRequest` | Кореневий span для кожного запиту |
| `render route (app)` | `AppRender.getBodyResult` | Рендеринг маршруту App Router |
| `fetch [method] [url]` | `AppRender.fetch` | Fetch-запити у коді |
| `executing api route` | `AppRouteRouteHandlers.runHandler` | Виконання Route Handler |
| `generateMetadata` | `ResolveMetadata.generateMetadata` | Генерація метаданих |
| `resolve page components` | `NextNodeServer.findPageComponents` | Резолв компонентів сторінки |

Атрибути під `next` namespace: `next.span_name`, `next.span_type`, `next.route`, `next.rsc`, `next.page`.

Для детальніших spans: `NEXT_OTEL_VERBOSE=1`.

Вимкнення fetch spans: `NEXT_OTEL_FETCH_DISABLED=1`.

## Деплоймент

### Vercel

OpenTelemetry працює з коробки. Підключіть провайдера через [Vercel Observability](https://vercel.com/docs/concepts/observability/otel-overview/quickstart).

### Self-hosting

Розгорніть власний OpenTelemetry Collector для прийому та обробки телеметрії.

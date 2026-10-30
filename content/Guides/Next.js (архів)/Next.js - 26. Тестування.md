# Тестування в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 17. Деплоймент]], [[Next.js - 05. Серверні та клієнтські компоненти]]

## Типи тестів

- **Unit Testing** — тестування окремих функцій, хуків або компонентів ізольовано
- **Component Testing** — тестування рендерингу компонентів, взаємодії з пропсами та поведінки при подіях
- **Integration Testing** — тестування взаємодії кількох модулів разом
- **End-to-End (E2E)** — тестування користувацьких потоків у середовищі, що імітує реальний браузер
- **Snapshot Testing** — порівняння рендерингу компонента зі збереженим знімком

## Async Server Components

Оскільки `async` Server Components — нова концепція, деякі інструменти ще не підтримують їх повністю. Рекомендується використовувати **E2E-тестування** замість **unit-тестування** для `async` компонентів.

## Інструменти

### Vitest (Unit Testing)

Швидкий тест-раннер, сумісний з Vite. Рекомендований для unit-тестів.

Встановлення:

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

Конфігурація `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
  },
})
```

Приклад тесту:

```tsx
// __tests__/page.test.tsx
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('рендерить заголовок', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
})
```

### Jest (Unit + Snapshot Testing)

Популярний фреймворк для unit та snapshot тестів.

Встановлення:

```bash
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-jest
```

Конфігурація `jest.config.ts`:

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

### Playwright (E2E Testing)

Тестування в реальних браузерах (Chromium, Firefox, WebKit).

Встановлення:

```bash
pnpm add -D @playwright/test
npx playwright install
```

Конфігурація `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
})
```

Приклад E2E тесту:

```ts
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('домашня сторінка має заголовок', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})

test('навігація на сторінку "Про нас"', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Про нас')
  await expect(page).toHaveURL('/about')
})
```

### Cypress (E2E + Component Testing)

Візуальний тест-раннер з підтримкою E2E та компонентного тестування.

Встановлення:

```bash
pnpm add -D cypress
```

Конфігурація `cypress.config.ts`:

```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {},
  },
})
```

## Рекомендації

| Потреба | Інструмент |
|---------|-----------|
| Unit-тести компонентів | Vitest або Jest |
| Snapshot-тести | Jest |
| E2E-тести | Playwright або Cypress |
| Компонентні тести | Cypress |
| Async Server Components | Playwright (E2E) |

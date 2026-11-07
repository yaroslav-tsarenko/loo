import { readFileSync } from 'node:fs'
import { test as base, expect, type Page } from '@playwright/test'

// Signed-in pages: the session cookie the lab signed for its learner (playwright.config.ts → tmp/e2e/cookie.txt).
// `cspErrors` collects Content-Security-Policy violations — a page that loads but whose scripts are blocked would
// look fine in a screenshot and still be dead.

function labCookie(): { name: string; value: string } {
  const raw = readFileSync('tmp/e2e/cookie.txt', 'utf8').trim()
  const i = raw.indexOf('=')
  return { name: raw.slice(0, i), value: raw.slice(i + 1) }
}

export const test = base.extend<{ signedIn: Page; cspErrors: string[] }>({
  cspErrors: async ({ page }, provide) => {
    const errors: string[] = []
    page.on('console', (m) => {
      if (/Content Security Policy|Refused to (execute|load)/i.test(m.text())) errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    await provide(errors)
  },
  signedIn: async ({ page, context, baseURL }, provide) => {
    await context.addCookies([{ ...labCookie(), url: baseURL! }])
    await provide(page)
  },
})

export { expect }

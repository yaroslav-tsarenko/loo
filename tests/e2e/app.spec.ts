import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

// The current step of the course path (/path): its node opens a card with the action («Читати», «Почати»).
async function openCurrentStep(page: Page, action: RegExp) {
  await page.goto('/path')
  await page.getByRole('button', { name: /наступний крок/ }).click()
  await page.getByRole('link', { name: action }).first().click()
}

// One fresh learner for the whole file (the lab signs one session), so the tests run in order: onboarding first.

test('signed out: the landing and the blog are static pages that hydrate under their CSP', async ({ page, cspErrors }) => {
  const landing = await page.goto('/')
  expect(landing?.headers()['cache-control']).toContain('s-maxage')
  await expect(page.getByRole('link', { name: /Почати безкоштовно/ }).first()).toBeVisible()
  // hydrated: the theme switch works
  const theme = await page.evaluate(() => document.documentElement.dataset.theme)
  await page.getByRole('button', { name: /тема/i }).first().click()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).not.toBe(theme)

  await page.goto('/blog')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.locator('a[href^="/blog/"]').filter({ has: page.locator('img') }).first().click()
  await expect(page.locator('h1').first()).toBeVisible()

  // app pages need a session
  await page.goto('/path')
  await expect(page).toHaveURL(/\/login/)
  expect(cspErrors).toEqual([])
})

test('onboarding: a new learner picks a course and starts from scratch', async ({ signedIn: page, cspErrors }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/onboarding/)
  const next = () => page.getByRole('button', { name: /^Далі/ }).click()
  await page.getByText('Програмування', { exact: true }).click()
  await next()
  await page.getByText(/JavaScript Zero/).first().click()
  await next()
  await page.getByText('Для себе', { exact: true }).click()
  await next()
  await page.getByText('Інше', { exact: true }).click()
  await next()
  await next() // minutes: the preselected default
  await page.getByText('Почати з нуля', { exact: true }).click()
  await next()
  await page.getByRole('button', { name: /Почати/ }).click()
  await expect(page).not.toHaveURL(/onboarding/, { timeout: 20_000 })
  await page.goto('/')
  await expect(page.getByText(/урок 1 з/)).toBeVisible()
  expect(cspErrors).toEqual([])
})

test('reader: an article quiz is graded by the server, without an answer key in the page', async ({ signedIn: page, cspErrors }) => {
  await openCurrentStep(page, /Читати/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // nothing in the page says which option is right
  const html = await page.content()
  expect(html).not.toMatch(/\\"correct\\":true|answerKey/)
  // the first single-choice quiz and its own «Відповісти»
  const quiz = page.locator('xpath=//*[@role="radiogroup"]/ancestor::*[.//button[normalize-space()="Відповісти"]][1]').first()
  await quiz.scrollIntoViewIfNeeded()
  await quiz.getByRole('radio').first().click()
  await quiz.getByRole('button', { name: 'Відповісти' }).click()
  await expect(page.getByText(/Правильно|Неправильно|Майже/).first()).toBeVisible()
  expect(cspErrors).toEqual([])
})

test('lesson: study a chapter, play the next lesson to the end', async ({ signedIn: page, cspErrors }) => {
  await openCurrentStep(page, /Читати/)
  await page.getByRole('button', { name: /Позначити як вивчене/ }).click()
  await expect(page.getByRole('button', { name: /Вивчено/ })).toBeVisible()

  await openCurrentStep(page, /Почати/)
  await expect(page).toHaveURL(/\/learn\//)

  // Whatever the exercises are: read facts, give some answer (right or wrong), continue — until the summary.
  const done = page.getByText(/урок!|Урок пройдено|Наступний урок/).first()
  // isVisible() doesn't wait: between steps there is an animation, so look again on the next round.
  const visible = async (l: ReturnType<Page['locator']>) => (await l.count()) > 0 && (await l.first().isVisible())
  for (let step = 0; step < 60 && !(await visible(done)); step++) {
    const proceed = page.getByRole('button', { name: /^Продовжити/ })
    const gotIt = page.getByRole('button', { name: 'Зрозуміло' })
    const check = page.getByRole('button', { name: /^(Далі|Перевірити|Відповісти)$/ })
    const input = page.locator('main').getByRole('textbox')
    const option = page.locator('main').getByRole('radio').or(page.locator('main').getByRole('checkbox'))
    if (await visible(proceed)) await proceed.first().click()
    else if (await visible(gotIt)) await gotIt.first().click()
    else if (await visible(input)) {
      await input.first().fill('x')
      if (await visible(check)) await check.first().click()
    } else if (await visible(option)) {
      await option.first().click()
      if (await visible(check)) await check.first().click()
    }
    await page.waitForTimeout(400)
  }
  await expect(done).toBeVisible()
  expect(cspErrors).toEqual([])
})

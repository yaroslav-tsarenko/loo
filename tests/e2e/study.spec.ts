import { expect, test } from '@playwright/test'

test('reader: open a guide, follow a wiki-link, mark a chapter as studied', async ({ page }) => {
  await page.goto('/')
  await page.locator('#main').getByRole('link', { name: 'Flat', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Flat' })).toBeVisible()
  await page.locator('.contents').getByRole('link', { name: 'Перший' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Перший' })).toBeVisible()
  await expect(page.locator('pre code').first()).toContainText('[[not a link]]')
  await page.locator('.prose-read').getByRole('link', { name: 'посиланням' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Другий розділ' })).toBeVisible()
  await page.getByRole('button', { name: /Позначити як вивчене/ }).click()
  await expect(page.getByRole('button', { name: /Вивчено/ })).toBeVisible()
  await expect(page.locator('.backlinks')).toContainText('Перший')
})

test('flashcards: pass five cards with keyboard ratings', async ({ page }) => {
  await page.goto('/g/bank')
  await page.getByRole('link', { name: 'Картки посібника' }).click()
  await page.waitForURL(/\/review\?guide=bank/)
  await page.locator('.queue').getByRole('link', { name: /Почати/ }).click()
  await expect(page.locator('.session-bar')).toContainText('1 / 6')
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Space')
    await expect(page.getByRole('group', { name: /Наскільки добре/ })).toBeVisible()
    await page.keyboard.press(i === 0 ? '1' : '3')
    await expect(page.locator('.session-bar')).toContainText(`${i + 2} / 6`)
  }
  await page.getByRole('button', { name: 'Завершити' }).click()
  await expect(page.getByText('Сесію завершено')).toBeVisible()
  await expect(page.locator('.summary-title')).toContainText('4 з 5')
})

test('quiz: a wrong answer lands in «Мої помилки»', async ({ page }) => {
  await page.goto('/quiz?guide=bank&type=single&size=5&start=1')
  await expect(page.locator('.quiz-prompt')).toContainText('typeof null')
  await page.locator('.quiz-option').first().click()
  await expect(page.locator('.quiz-verdict-line')).toContainText('Неправильно')
  await expect(page.locator('.quiz-explain')).toContainText('історичний баг')
  await page.keyboard.press('Enter')
  await expect(page.getByText('Розбір')).toBeVisible()
  await page.goto('/mistakes')
  await expect(page.locator('.mistake-list')).toContainText('Що поверне typeof null?')
  await expect(page.locator('.mistake-topics')).toContainText('Основи')
})

test('search: Ctrl+K finds a chapter and a question', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Control+k')
  const input = page.getByRole('combobox')
  await input.fill('Розділ А')
  await expect(page.getByRole('option').first()).toContainText('Другий розділ')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1, name: 'Другий розділ' })).toBeVisible()
  await page.keyboard.press('Control+k')
  await input.fill('typeof null')
  await expect(page.getByRole('option').filter({ hasText: 'Тест' }).first()).toBeVisible()
})

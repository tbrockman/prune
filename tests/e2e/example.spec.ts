import { test, expect } from './fixtures';

test('popup page renders', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('.app')).toBeVisible();
});

test('closes new tab when navigating to existing tab', async ({ context, page, extensionId }) => {
  await page.goto('https://google.com')
  const secondPage = await context.newPage()
  try {
    await secondPage.goto('https://google.com')
    // This tab being closed by prune should result in an error, which we catch
  } catch (error) {
  }
  expect(context.pages().length).toBe(1)
})

// TODO: make this pass
test('focuses original tab, and reverts navigation if tab opened from existing tab', async ({ context, page, extensionId }) => {
  await page.goto('https://google.com')
  const secondPage = await context.newPage()
  try {
    await secondPage.goto('https://news.ycombinator.com')
    await secondPage.goto('https://google.com')
  } catch (error) {
  }
  expect(context.pages().length).toBe(2)
  expect(page.url).toBe('https://google.com/')
  expect(secondPage.url).toBe('https://news.ycombinator.com/')
})

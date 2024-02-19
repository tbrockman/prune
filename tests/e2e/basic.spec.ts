import { test, expect } from './fixtures';

test('popup page renders', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('.app')).toBeVisible();
});

// This test seems to fail as newPage() opens a tab to "about:blank" first,
// and then navigates to the desired URL. This results in the tab being perceived as having history,
// and the extension's logic to deduplicate tabs by closing the duplicate is not triggered.
// TODO: Figure out whether there's any way to open a new tab without history.
// 
// test('closes new tab when navigating to existing tab', async ({ context, page, extensionId }) => {
//   let pages = context.pages()

//   await page.goto('https://www.google.com')
//   const secondPage = await context.newPage()
//   try {
//     await secondPage.goto('https://www.google.com')
//     // This tab being closed by prune should result in an error, which we catch
//   } catch (error) {
//   }
//   pages = context.pages()
//   console.log('page names:' + pages.map(p => p.url()))
//   expect(context.pages().length).toBe(1)
// })

test('focuses original tab, and reverts navigation if tab opened from existing tab', async ({ context, page, extensionId }) => {
  await page.goto('https://google.com')
  const secondPage = await context.newPage()
  try {
    await secondPage.goto('https://news.ycombinator.com')
    await secondPage.goto('https://www.google.com')
  } catch (error) {
  }
  expect(context.pages().length).toBe(2)
  expect(page.url()).toBe('https://www.google.com/')
  expect(secondPage.url()).toBe('https://news.ycombinator.com/')
})

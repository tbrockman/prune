import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { existsSync } from 'fs';

export const test = base.extend<{
    context: BrowserContext;
    extensionId: string;
}>({
    context: async ({ }, use) => {
        const pathToExtension = path.join(__dirname, '../../build/chrome-mv3-prod');

        if (!existsSync(pathToExtension)) {
            throw new Error(`no extension found at "${pathToExtension}", run "pnpm build:chrome"`);
        }

        // TODO: Firefox: https://stackoverflow.com/questions/41867515/open-firefox-with-a-temporary-add-on-on-startup

        const context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        });

        // Hack to handle Chromium starting with an initial open tab
        const pages = await context.pages()

        if (pages.length > 0) {
            await Promise.all(pages.map(page => page.close()))
        }

        await use(context);
        await context.close();
    },
    extensionId: async ({ context }, use) => {
        // for manifest v3:
        let [background] = context.serviceWorkers();
        if (!background)
            background = await context.waitForEvent('serviceworker');

        const extensionId = background.url().split('/')[2];
        await use(extensionId);
    },
});
export const expect = test.expect;
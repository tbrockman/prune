import { assert } from "chai";
import { createTab } from "~util/tabs";
import { getSuggestedUrls } from "~util/url";

describe.only('url utils', () => {
    describe('getSuggestedUrls', () => {
        it('should return suggested urls', () => {
            const tabs: chrome.tabs.Tab[] = [
                { url: 'https://docs.google.com/' },
                { url: 'https://docs.plasmo.com/' },
                { url: 'https://docs.plasmo.com/more-specific?test=abc' },
                { url: 'https://google.com' },
            ].map(createTab);
            const result = getSuggestedUrls(tabs);
            assert.deepEqual(result, ['google', 'docs.google.com', 'docs.plasmo.com', 'docs.plasmo.com/more-specific?test=abc']);
        });
    });
});
import TabBookmarker from '../../../src/tab/tab-bookmarker';
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-bookmarker', () => {
	let tabBookmarker;

	beforeEach(() => {
		global.chrome = chrome;
		tabBookmarker = new TabBookmarker('test');
	});

	afterEach(() => {
		global.chrome.flush();
	});

	it('should add bookmark to existing folder if it exists', async () => {
		chrome.bookmarks.search.resolves([{ id: 1 }]);
		await tabBookmarker.bookmarkTabs([
			{ id: 1, title: 'test', url: 'https://test.com' },
		]);
		assert(chrome.bookmarks.create.calledOnce);
	});

	it("should add bookmark to new folder if folder doesn't exist", async () => {
		chrome.bookmarks.search.resolves([]);
		chrome.bookmarks.create.resolves({ id: 1 });
		await tabBookmarker.bookmarkTabs([
			{ id: 1, title: 'test', url: 'https://test.com' },
		]);
		assert(chrome.bookmarks.create.calledTwice);
	});

	it('should not do anything if disabled', async () => {
		tabBookmarker.enabled = false;
		await tabBookmarker.bookmarkTabs([
			{ id: 1, title: 'test', url: 'https://test.com' },
		]);
		assert(chrome.bookmarks.search);
		assert(chrome.bookmarks.create.notCalled);
	});
});

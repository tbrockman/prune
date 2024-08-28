import TabBookmarker from '../../../src/tab/bookmarker';
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('TabBookmarker', () => {
	let tabBookmarker;

	beforeEach(() => {
		global.chrome = chrome;
		tabBookmarker = new TabBookmarker('test');
	});

	afterEach(() => {
		global.chrome.flush();
	});

	it('should add bookmark to existing folder if it exists', async () => {
		chrome.bookmarks.search.onCall(0).resolves([])
		chrome.bookmarks.search.onCall(1).resolves([{ id: 1 }]);
		await tabBookmarker.bookmarkTabs([
			{ id: 1, title: 'test', url: 'https://test.com' },
		]);
		assert(chrome.bookmarks.search.calledTwice);
		assert(chrome.bookmarks.create.calledOnce);
	});

	it("should add bookmark to new folder if folder doesn't exist", async () => {
		chrome.bookmarks.search.onCall(0).resolves([])
		chrome.bookmarks.search.onCall(1).resolves([]);
		chrome.bookmarks.create.resolves({ id: 1 });
		await tabBookmarker.bookmarkTabs([
			{ id: 1, title: 'test', url: 'https://test.com' },
		]);
		assert(chrome.bookmarks.search.calledTwice);
		assert(chrome.bookmarks.create.calledTwice);
	});

	it('should not do anything if disabled', async () => {
		tabBookmarker.enabled = false;
		await tabBookmarker.bookmarkTabs([
			{ id: 1, title: 'test', url: 'https://test.com' },
		]);
		assert(chrome.bookmarks.search.notCalled);
		assert(chrome.bookmarks.create.notCalled);
	});

	it('should not attempt to create bookmarks for already bookmarked tabs', async () => {
		chrome.bookmarks.search.resolves([{ id: 1 }]);
		chrome.bookmarks.search.resolves([{ id: 1 }]);
		await tabBookmarker.bookmarkTabs([
			{ id: 1, title: 'test', url: 'https://test.com' },
		]);
		assert(chrome.bookmarks.search.calledOnce);
		assert(chrome.bookmarks.create.notCalled);
	})
});

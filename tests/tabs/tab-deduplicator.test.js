import { TabDeduplicator } from '../../src/tabs/tab-deduplicator';
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-deduplicator', () => {
	let tabDeduplicator;
	let tabLock;

	beforeEach(() => {
		global.chrome = chrome;
		tabLock = new Set();
		tabDeduplicator = new TabDeduplicator(tabLock);
	});

	afterEach(() => {
		global.chrome.flush();
	});

	it('shouldnt do anything if lock cannot be acquired', async () => {
		tabLock.add(1);
		await tabDeduplicator.deduplicateTab({ id: 1 }, []);
		assert(chrome.tabs.remove.notCalled);
	});

	it('shouldnt do anything if opening blank new tab', async () => {
		await tabDeduplicator.deduplicateTab(
			{ id: 1, url: 'chrome://newtab/' },
			[],
		);
		assert(chrome.tabs.remove.notCalled);
	});

	it('shouldnt do anything if not opening new tab', async () => {
		await tabDeduplicator.deduplicateTab({ id: 1, url: 'theo.lol' }, []);
		assert(chrome.tabs.remove.notCalled);
	});

	it('should deduplicate tab', async () => {
		await tabDeduplicator.deduplicateTab(
			{ id: 1, url: 'theo.lol', status: 'loading', active: true },
			[{ id: 2, url: 'theo.lol' }],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.calledOnce);
	});

	it('shouldnt focus tab if not active', async () => {
		await tabDeduplicator.deduplicateTab(
			{ id: 1, url: 'theo.lol', status: 'loading', active: false },
			[{ id: 2, url: 'theo.lol' }],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.calledOnce);
	});
});

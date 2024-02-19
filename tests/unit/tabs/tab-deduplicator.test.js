import TabDeduplicator from '../../../src/tab/tab-deduplicator';
import { assert } from 'chai';
import sinon from 'sinon/pkg/sinon-esm';

// TODO: investigate https://github.com/acvetkov/sinon-chrome/pull/94 and fork to mock missing APIs
const chrome = require('sinon-chrome/extensions');


describe('tab-deduplicator', () => {
	let tabDeduplicator;
	let tabLock;

	beforeEach(() => {
		global.chrome = chrome;
		chrome.tabs.goBack = sinon.stub();
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

	it('should remove tab if tab has openerTabId', async () => {
		await tabDeduplicator.deduplicateTab(
			{ id: 1, url: 'theo.lol', status: 'loading', active: true, openerTabId: 2 },
			[{ id: 2, url: 'theo.lol' }],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.calledOnce);
		assert(chrome.tabs.goBack.notCalled);
	});

	it('should call goBack on tab if tab doesnt have openerTabId', async () => {
		await tabDeduplicator.deduplicateTab(
			{ id: 1, url: 'theo.lol', status: 'loading', active: true },
			[{ id: 2, url: 'theo.lol' }],
		);
		assert(chrome.tabs.goBack.calledOnce);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.notCalled);
	});

	it('shouldnt focus tab if not active', async () => {
		await tabDeduplicator.deduplicateTab(
			{ id: 1, url: 'theo.lol', status: 'loading', active: false, openerTabId: 2 },
			[{ id: 2, url: 'theo.lol' }],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.calledOnce);
		assert(chrome.tabs.goBack.notCalled);
	});
});

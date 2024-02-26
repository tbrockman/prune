import TabDeduplicator from '../../../src/tab/tab-deduplicator';

import { createTab } from 'tests/testutils';
import { Features } from '~config';

import { assert } from 'chai';
import sinon from 'sinon/pkg/sinon-esm';

// TODO: investigate https://github.com/acvetkov/sinon-chrome/pull/94 and fork to mock missing APIs
const chrome = require('sinon-chrome/extensions');

declare var global: any;

describe('tab-deduplicator', () => {
	let tabDeduplicator: TabDeduplicator;
	let tabLock;
	let unsupportedFeatures: Set<Features> = new Set<Features>();

	beforeEach(() => {
		global.chrome = chrome;
		chrome.tabs.goBack = sinon.stub();
		chrome.tabs.goBack.resolves();
		tabLock = new Set();
		tabDeduplicator = new TabDeduplicator(tabLock, unsupportedFeatures);
	});

	afterEach(() => {
		global.chrome.flush();
	});

	it('shouldnt do anything if lock cannot be acquired', async () => {
		tabLock.add(1);
		const result = await tabDeduplicator.deduplicateTab(createTab({ id: 1 }), []);
		assert(result === false);
		assert(chrome.tabs.remove.notCalled);
	});

	it('should remove relinquish tab lock even if an error occurs', async () => {
		chrome.tabs.goBack.throws(() => {
			assert(tabLock.size === 1);
			return new Error('test');
		});
		const result = await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'theo.lol', status: 'loading', active: true }),
			[createTab({ id: 2, url: 'theo.lol' })],
		);
		assert(result === false);
		assert(tabLock.size === 0);
	});

	it('shouldnt do anything if opening blank new tab', async () => {
		const result = await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'chrome://newtab/' }),
			[],
		);
		assert(result === false);
		assert(chrome.tabs.remove.notCalled);
	});

	it('shouldnt do anything if not opening new tab', async () => {
		const result = await tabDeduplicator.deduplicateTab(createTab({ id: 1, url: 'theo.lol' }), []);
		assert(result === false);
		assert(chrome.tabs.remove.notCalled);
	});

	it('shouldnt do anything if existing tab isnt loaded', async () => {
		chrome.tabs.get.resolves({ url: 'example.com', status: 'complete' });

		const result = await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'theo.lol', status: 'loading', active: true }),
			[createTab({ id: 2, url: 'theo.lol', status: 'loading' })],
		);
		assert(result === false);
		assert(chrome.tabs.highlight.notCalled);
		assert(chrome.windows.update.notCalled);
		assert(chrome.tabs.remove.notCalled);
		assert(chrome.tabs.goBack.notCalled);
	});

	// @tbrockman: Leaving here for a bit in case this seems desirable again.
	// 
	// it('shouldnt focus tab if not active', async () => {
	// 	chrome.tabs.get.resolves({ url: 'example.com', status: 'complete' });

	// 	await tabDeduplicator.deduplicateTab(
	// 		{ id: 1, url: 'theo.lol', status: 'loading', active: false },
	// 		[{ id: 2, url: 'theo.lol', status: 'complete' }],
	// 	);
	// 	assert(chrome.tabs.highlight.notCalled);
	// 	assert(chrome.windows.update.notCalled);
	// 	assert(chrome.tabs.remove.notCalled);
	// 	assert(chrome.tabs.goBack.calledOnce);
	// });

	it('should remove tab if tab goBack url is chrome://newtab/', async () => {
		chrome.tabs.get.resolves({ url: 'chrome://newtab/', status: 'complete' });

		await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'theo.lol', status: 'loading', active: true }),
			[createTab({ id: 2, url: 'theo.lol', status: 'complete' })],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.calledOnce);
		assert(chrome.tabs.goBack.calledOnce);
	});

	it('should remove tab if tab goBack url is about:newtab', async () => {
		chrome.tabs.get.resolves({ url: 'about:newtab', status: 'complete' });

		await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'theo.lol', status: 'loading', active: true }),
			[createTab({ id: 2, url: 'theo.lol', status: 'complete' })],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.calledOnce);
		assert(chrome.tabs.goBack.calledOnce);
	});

	it('should remove tab if tab goBack url is about:blank', async () => {
		chrome.tabs.get.resolves({ url: 'about:blank', status: 'complete' });

		await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'theo.lol', status: 'loading', active: true }),
			[createTab({ id: 2, url: 'theo.lol', status: 'complete' })],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.calledOnce);
		assert(chrome.tabs.goBack.calledOnce);
	});

	// @tbrockman: Leaving here for a bit in case this seems desirable again.
	// 
	// it('should remove tab if tab goBack url is the same as before', async () => {
	// 	chrome.tabs.get.resolves({ url: 'theo.lol', status: 'complete' });

	// 	await tabDeduplicator.deduplicateTab(
	// 		{ id: 1, url: 'theo.lol', status: 'loading', active: true },
	// 		[{ id: 2, url: 'theo.lol', status: 'complete' }],
	// 	);
	// 	assert(chrome.tabs.highlight.calledOnce);
	// 	assert(chrome.windows.update.calledOnce);
	// 	assert(chrome.tabs.remove.calledOnce);
	// 	assert(chrome.tabs.goBack.calledOnce);
	// });

	it('should remove tab if tab goBack url throws navigation error', async () => {
		chrome.tabs.goBack.throws(new Error("Cannot find a next page in history."));

		await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'theo.lol', status: 'loading', active: true }),
			[createTab({ id: 2, url: 'theo.lol', status: 'complete' })],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.calledOnce);
		assert(chrome.tabs.goBack.calledOnce);
	});

	it('shouldnt remove tab if tab goBack url is different than before', async () => {
		chrome.tabs.get.resolves({ url: 'example.com', status: 'complete' });

		await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'theo.lol', status: 'loading', active: true }),
			[createTab({ id: 2, url: 'theo.lol', status: 'complete' })],
		);
		assert(chrome.tabs.highlight.calledOnce);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.notCalled);
		assert(chrome.tabs.goBack.calledOnce);
	});

	it('shouldnt call highlight if feature not supported', async () => {
		unsupportedFeatures.add(Features.TabHighlighting);
		chrome.tabs.get.resolves({ url: 'example.com', status: 'complete' });

		await tabDeduplicator.deduplicateTab(
			createTab({ id: 1, url: 'theo.lol', status: 'loading', active: true }),
			[createTab({ id: 2, url: 'theo.lol', status: 'complete' })],
		);
		assert(chrome.tabs.highlight.notCalled);
		assert(chrome.windows.update.calledOnce);
		assert(chrome.tabs.remove.notCalled);
		assert(chrome.tabs.goBack.calledOnce);
	})
});

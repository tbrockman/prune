import TabTracker from '../../src/tab/tab-tracker';
import { assert } from 'chai';

import chrome from 'sinon-chrome/extensions';
declare var global: any;

describe('tab-tracker', () => {
	let tabTracker;

	before(() => {
		global.chrome = chrome;
		global.chrome.flush();
	});

	beforeEach(() => {
		tabTracker = new TabTracker();
	});

	afterEach(() => {
		global.chrome.flush();
	});

	it('should initialize empty tab state', async () => {
		chrome.storage.local.get.resolves({ tabs: '[]' });
		await tabTracker.init([]);
		assert.equal(0, Object.keys(tabTracker.tabs).length);
	});

	it('should initialize populated tab state with no stored information', async () => {
		const tabs = [{ url: 'a' }, { url: 'b' }, { url: 'c' }];
		chrome.storage.local.get.resolves({ tabs: '[]' });
		chrome.storage.local.set.resolves({});
		await tabTracker.init(tabs);
		assert.equal(tabTracker.tabs.size, 3);
	});

	it('should replace loaded local storage tab state', async () => {
		const tabs = [
			['a', new Date().getTime()],
			['b', new Date().getTime()],
			['c', new Date().getTime()],
		];
		chrome.storage.local.get.resolves({ tabs: JSON.stringify(tabs) });
		chrome.storage.local.set.resolves({});
		await tabTracker.init([]);
		assert.equal(0, tabTracker.tabs.size);
	});

	it('should consolidate existing tab state with open tabs', async () => {
		const openTabs = [{ url: 'a' }];
		const storedTabs = [
			['a', new Date().getTime()],
			['b', new Date().getTime()],
			['c', new Date().getTime()],
		];
		chrome.storage.local.get.resolves({
			tabs: JSON.stringify(storedTabs),
		});
		chrome.storage.local.set.resolves({});
		await tabTracker.init(openTabs);
		assert.equal(1, tabTracker.tabs.size);
		assert(tabTracker.tabs.has('a'));
		assert(chrome.storage.local.set.called);
	});

	it('should retain existing tab state with tabs still open', async () => {
		const openTabs = [{ url: 'a' }, { url: 'b' }, { url: 'c' }];
		const storedTabs = [
			['a', new Date().getTime()],
			['b', new Date().getTime()],
			['c', new Date().getTime()],
		];
		chrome.storage.local.get.resolves({
			tabs: JSON.stringify(storedTabs),
		});
		chrome.storage.local.set.resolves({});
		await tabTracker.init(openTabs);
		assert.equal(3, tabTracker.tabs.size);
		assert(tabTracker.tabs.has('a'));
		assert(tabTracker.tabs.has('b'));
		assert(tabTracker.tabs.has('c'));
		assert(chrome.storage.local.set.called);
	});

	it('should indicate tabs whose last viewed exceeds threshold', async () => {
		const openTabs = [{ url: 'a' }, { url: 'b' }, { url: 'c' }];
		const today = new Date();
		const storedTabs = [
			['a', today.getTime()],
			['b', today.setDate(today.getDate() - 1)],
			['c', today.setDate(today.getDate() - 7)],
		];
		chrome.storage.local.get.resolves({
			tabs: JSON.stringify(storedTabs),
		});
		chrome.storage.local.set.resolves({});
		await tabTracker.init(openTabs);
		const [exceeds, remaining] = tabTracker.findTabsExceedingThreshold(
			openTabs,
			42 * 60 * 60 * 1000,
		);
		assert.equal(exceeds.length, 1);
		assert.equal(exceeds[0].url, 'c');
		assert.equal(remaining.length, 2);
	});

	it('should reorder internal map on tab track', async () => {
		chrome.storage.local.get.resolves({ tabs: '[]' });
		chrome.storage.local.set.resolves({});
		await tabTracker.init([]);
		await tabTracker.track({ url: 'a' });
		await tabTracker.track({ url: 'b' });
		let trackedTabs = Array.from(tabTracker.tabs.entries());
		assert.equal('a', trackedTabs[0][0]);
		assert.equal('b', trackedTabs[1][0]);
		await tabTracker.track({ url: 'a' });
		trackedTabs = Array.from(tabTracker.tabs.entries());
		assert.equal('b', trackedTabs[0][0]);
		assert.equal('a', trackedTabs[1][0]);
	});

	// TODO
	it('should be able to track state across sessions', async () => {
		const openTabs = [
			{ id: 1, url: 'a' },
			{ id: 2, url: 'b' },
			{ id: 3, url: 'c' },
		];

		const stored = {
			a: [4],
			b: [5],
			c: [6],
		};
	});

	it('should retain tracked tab times from storage parsed as string if tabs still open', async () => {
		const openTabs = [
			{ url: '47' },
			{ url: '48' },
			{ url: '51' },
			{ url: '54' },
			{ url: '58' },
			{ url: '60' },
			{ url: '61' },
		];
		const string =
			'[["47",1631084725274],["48",1631084725274],["51",1631084725274],["54",1631084725274],["58",1631084725274],["60",1631084725274],["61",1631084725274]]';
		const expected = new Map(JSON.parse(string));
		chrome.storage.local.get.resolves({ tabs: string });
		chrome.storage.local.set.resolves({});
		await tabTracker.init(openTabs);
		assert.equal(openTabs.length, tabTracker.tabs.size);

		expected.forEach((val, key) => {
			assert.equal(val, tabTracker.tabs.get(key));
		});
	});

	it('should return a list of tabs to show and tabs to hide given a visible limit', async () => {
		const openTabs = [
			{ id: 1, url: 'a' },
			{ id: 2, url: 'b' },
			{ id: 3, url: 'c' },
		];
		const today = new Date();
		const storedTabs = [
			['a', today.setDate(today.getDate() - 7)],
			['b', today.setDate(today.getDate() - 1)],
			['c', today.getTime()],
		];
		chrome.storage.local.get.resolves({
			tabs: JSON.stringify(storedTabs),
		});
		chrome.storage.local.set.resolves({});
		await tabTracker.init(openTabs);
		const limitTabs = [{ id: 1 }, { id: 2 }];
		const [visible, hidden] = tabTracker.limitNumberOfVisibleTabs(limitTabs, 1);
		assert.equal(1, visible.length);
		assert.equal(1, hidden.length);
		assert.equal(1, visible[0].id);
		assert.equal(2, hidden[0].id);
	});

	it('should return a list of tabs to show and tabs to hide given a visible limit (without stored state)', async () => {
		const openTabs = [];
		chrome.storage.local.get.resolves({ tabs: '[]' });
		chrome.storage.local.set.resolves({});
		await tabTracker.init(openTabs);
		await tabTracker.track({ id: 2, url: 'a' });
		await tabTracker.track({ id: 1, url: 'b' });
		await tabTracker.track({ id: 3, url: 'c' });
		await tabTracker.track({ id: 4, url: 'd' });

		const limitTabs = [
			{ id: 2, url: 'a' },
			{ id: 1, url: 'b' },
			{ id: 3, url: 'c' },
			{ id: 4, url: 'd' },
		];
		const [visible, hidden] = tabTracker.limitNumberOfVisibleTabs(limitTabs, 2);
		assert.equal(2, visible.length);
		assert.equal(2, hidden.length);
		assert.equal(4, visible[0].id);
		assert.equal(3, visible[1].id);
		assert.equal(1, hidden[0].id);
		assert.equal(2, hidden[1].id);
	});
});

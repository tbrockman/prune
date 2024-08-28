import TabBookmarker from '../../../src/tab/bookmarker';
import TabPruner from '../../../src/tab/pruner';
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('TabPruner', () => {
	let tabPruner;
	let tabBookmarker;

	before(() => {
		global.chrome = chrome;
		global.chrome.flush();
	});

	beforeEach(() => {
		tabBookmarker = new TabBookmarker('test', false);
		tabPruner = new TabPruner(tabBookmarker);
	});

	afterEach(() => {
		global.chrome.flush();
	});

	it('should prune tabs', async () => {
		const tabs = [
			{
				id: 1,
			},
			{
				id: 2,
			},
			{
				id: 3,
			},
		];
		chrome.tabs.remove.resolves();
		await tabPruner.pruneTabs(tabs);
		assert.equal(chrome.tabs.remove.callCount, 1);
	});

	it('should catch errors', async () => {
		const tabs = [
			{
				id: 1,
			},
			{
				id: 2,
			},
			{
				id: 3,
			},
		];
		chrome.tabs.remove.rejects();
		await tabPruner.pruneTabs(tabs);
		assert.equal(chrome.tabs.remove.callCount, 1);
	});
});

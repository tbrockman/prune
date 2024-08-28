import TabGrouper from '../../../src/tab/grouper';
import sinon from '../../../node_modules/sinon/pkg/sinon-esm.js';
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('TabGrouper', () => {
	let tabGrouper;

	before(() => {
		global.chrome = chrome;
		global.chrome.flush();
	});

	beforeEach(() => {
		chrome.tabs.group = sinon.stub();
		chrome.tabGroups = {
			query: sinon.stub(),
			update: sinon.stub(),
			move: sinon.stub(),
		};
		tabGrouper = new TabGrouper();
	});

	afterEach(() => {
		global.chrome.flush();
	});

	it('should return immediately if all tabs already have group', async () => {
		const tabs = [
			{
				id: 1,
				groupId: 1,
			},
		];
		await tabGrouper.groupTabs(tabs, { title: 'test' });
		assert(chrome.tabGroups.query.notCalled);
	});

	it('should group one tab under existing group', async () => {
		const tabs = [
			{
				id: 1,
				groupId: -1,
			},
			{
				id: 2,
				groupId: 1,
			},
		];
		const group = {
			title: 'old tabs',
		};
		const groups = [
			group,
			{
				id: 2,
				title: 'not old tabs',
			},
			{
				id: 3,
				title: 'mold tabs',
			},
		];
		chrome.tabGroups.query.resolves(groups);
		chrome.tabs.group.resolves();
		await tabGrouper.groupTabs(tabs, group);
		assert(chrome.tabs.group.calledOnce);
		const call = chrome.tabs.group.getCall(0);
		const groupArgs = call.args[0];
		assert.equal(groupArgs.tabIds.length, 1);
		assert.equal(groupArgs.tabIds[0], 1);
		assert.equal(groupArgs.groupId, group.id);
		assert(chrome.tabGroups.update.notCalled);
	});

	it('should group tabs under a new group', async () => {
		const tabs = [
			{
				id: 1,
				groupId: -1,
			},
			{
				id: 2,
				groupId: -1,
			},
			{
				id: 3,
				groupId: -1,
			},
		];
		const group = {
			title: 'old tabs',
		};
		const groups = [
			{
				id: 2,
				title: 'not old tabs',
			},
			{
				id: 3,
				title: 'mold tabs',
			},
		];
		chrome.tabGroups.query.resolves(groups);
		chrome.tabs.group.resolves(1);
		await tabGrouper.groupTabs(tabs, group);
		const call = chrome.tabs.group.getCall(0);
		const groupArgs = call.args[0];
		assert.equal(Object.keys(groupArgs).length, 1);
		assert.equal(groupArgs.tabIds.length, 3);
		assert(chrome.tabGroups.update.calledOnce);
		assert(chrome.tabGroups.move.calledOnce);
	});

	it('should not call any tabGrouping functions if not enabled', async () => {
		await tabGrouper.groupTabs([], {});
		assert(chrome.tabGroups.update.notCalled);
		assert(chrome.tabGroups.move.notCalled);
	});
});

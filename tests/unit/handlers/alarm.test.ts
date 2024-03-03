// TODO

import { Features } from '~config';
import AlarmHandler from '~handlers/alarm';
import TabGrouper from '~tab/tab-grouper';
import TabPruner from '~tab/tab-pruner';
import TabTracker from '~tab/tab-tracker';
import { StorageKeys } from '~enums';

import { createTab } from 'tests/testutils';

import sinon from 'sinon/pkg/sinon-esm';
import type { SinonStubbedInstance } from 'sinon';
import type { Options } from '~util';

const chrome = require('sinon-chrome/extensions');

declare var global: any;

describe('alarm-handler', () => {
	let handler: AlarmHandler;
	let tracker: SinonStubbedInstance<TabTracker>;
	let grouper: SinonStubbedInstance<TabGrouper>;
	let pruner: SinonStubbedInstance<TabPruner>;
	let unsupportedFeatures: Set<Features> = new Set<Features>();

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
	})

	const createOptions = (overrides: Partial<Options>): Options => {
		const defaults = {
			[StorageKeys.AUTO_DEDUPLICATE]: true,
			[StorageKeys.AUTO_DEDUPLICATE_CLOSE]: true,
			[StorageKeys.AUTO_PRUNE]: true,
			[StorageKeys.PRUNE_THRESHOLD]: 7,
			[StorageKeys.AUTO_GROUP]: true,
			[StorageKeys.AUTO_GROUP_THRESHOLD]: 3,
			[StorageKeys.AUTO_GROUP_NAME]: '🕒 old tabs',
			[StorageKeys.AUTO_PRUNE_BOOKMARK]: false,
			[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME]: '🌱 pruned',
			[StorageKeys.TAB_LRU_ENABLED]: false,
			[StorageKeys.TAB_LRU_SIZE]: 30,
			[StorageKeys.TAB_LRU_DESTINATION]: 'group',
			[StorageKeys.SHOW_HINTS]: true,
			[StorageKeys.PRODUCTIVITY_MODE_ENABLED]: true,
			[StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS]: [],
			[StorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS]: {},
		} as Options;
		return { ...defaults, ...overrides };
	};

	const createAlarmHandler = (options) => {
		tracker = sinon.createStubInstance(TabTracker);
		grouper = sinon.createStubInstance(TabGrouper);
		pruner = sinon.createStubInstance(TabPruner);
		return new AlarmHandler({ tracker, grouper, pruner, options, unsupportedFeatures });
	};

	afterEach(() => {
		unsupportedFeatures.clear();
		global.chrome.flush();
	});

	it('shouldnt remove or group any tabs', async () => {
		const options = createOptions({});
		handler = createAlarmHandler(options);
		const tabs: chrome.tabs.Tab[] = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: 1 }),
			createTab({ id: 3, groupId: 2 }),
		];
		const groups = [{ id: 1 }];
		tracker.findTabsExceedingThreshold.returns([[], tabs]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await handler.execute();
		sinon.assert.calledWith(pruner.pruneTabs, []);
	});

	it('should remove but not group tabs', async () => {
		const options = createOptions({});
		handler = createAlarmHandler(options);
		const tabs: chrome.tabs.Tab[] = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: -1 }),
			createTab({ id: 3, groupId: -1 }),
		];
		const groups = [{ id: 1 }];
		tracker.findTabsExceedingThreshold
			.onCall(0)
			.returns([tabs.slice(0, 1), [tabs[2]]]);
		tracker.findTabsExceedingThreshold.onCall(1).returns([[], [tabs[2]]]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await handler.execute();
		sinon.assert.calledWith(pruner.pruneTabs, tabs.slice(0, 1));
		sinon.assert.calledWith(grouper.groupTabs, []);
	});

	it('should group but not remove tabs', async () => {
		const options = createOptions({});
		handler = createAlarmHandler(options);
		const tabs: chrome.tabs.Tab[] = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: -1 }),
			createTab({ id: 3, groupId: -1 }),
		];
		const groups = [{ id: 1 }];
		tracker.findTabsExceedingThreshold.onCall(0).returns([[], tabs]);
		tracker.findTabsExceedingThreshold.onCall(1).returns([tabs, []]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await handler.execute();
		sinon.assert.calledWith(pruner.pruneTabs, []);
		sinon.assert.calledWith(grouper.groupTabs, tabs);
	});

	it('shouldnt call tabgrouper if tab grouping not supported', async () => {
		const options = createOptions({ 'auto-prune': false });
		handler = createAlarmHandler(options);
		handler.unsupportedFeatures.add(Features.TabGroups);
		console.log('am I logging here??', handler.unsupportedFeatures)
		const tabs = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: -1 }),
			createTab({ id: 3, groupId: -1 }),
		];
		tracker.findTabsExceedingThreshold.returns([tabs, []]);
		await handler.execute()
		sinon.assert.notCalled(pruner.pruneTabs);
		sinon.assert.notCalled(grouper.groupTabs);
		sinon.assert.notCalled(chrome.tabGroups.query);
	})

	it('should not remove any user grouped tabs', async () => {
		const options = createOptions({});
		handler = createAlarmHandler(options);
		const tabs = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: 1 }),
			createTab({ id: 3, groupId: 2 }),
		];
		const groups = [{ id: 1 }];
		tracker.findTabsExceedingThreshold.returns([tabs, []]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await handler.execute();
		sinon.assert.calledWith(pruner.pruneTabs, [
			tabs[0],
			tabs[1],
		]);
	});

	it('should not remove any user grouped tabs (no existing tab group)', async () => {
		const options = createOptions({});
		handler = createAlarmHandler(options);
		const tabs = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: 1 }),
			createTab({ id: 3, groupId: 2 }),
		];
		const groups = [];
		tracker.findTabsExceedingThreshold.returns([tabs, []]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await handler.execute();
		sinon.assert.calledWith(pruner.pruneTabs, [tabs[0]]);
	});
});

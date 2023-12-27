// TODO

import AlarmHandler from '../../src/handlers/alarm';
import TabGrouper from '../../src/tab/tab-grouper';
import TabPruner from '../../src/tab/tab-pruner';
import TabTracker from '../../src/tab/tab-tracker';
import sinon from 'sinon/pkg/sinon-esm';
const chrome = require('sinon-chrome/extensions');

declare var global: any;

describe('alarm-handler', () => {
	let handler;
	let tracker;
	let grouper;
	let pruner;

	before(() => {
		chrome.tabs.group = sinon.stub();
		chrome.tabGroups = {
			query: sinon.stub(),
			update: sinon.stub(),
			move: sinon.stub(),
		};
		global.chrome = chrome;
		global.chrome.flush();
	});

	const createOptions = (overrides) => {
		const options = {
			'auto-deduplicate': true,
			'auto-prune': true,
			'prune-threshold': 7,
			'auto-group': true,
			'auto-group-threshold': 3,
			'auto-group-name': '🕒 old tabs',
			'auto-prune-bookmark': false,
			'auto-prune-bookmark-name': '🌱 pruned',
			'tab-lru-enabled': false,
			'tab-lru-size': 30,
			'tab-lru-destination': 'group',
			'show-hints': true,
			'productivity-mode-enabled': true,
			'productivity-suspend-domains': [],
			'productivity-suspend-exemptions': {},
		};
		return { ...options, ...overrides };
	};

	const createAlarmHandler = (options) => {
		tracker = sinon.createStubInstance(TabTracker);
		grouper = sinon.createStubInstance(TabGrouper);
		pruner = sinon.createStubInstance(TabPruner);
		return new AlarmHandler({ tracker, grouper, pruner, options });
	};

	afterEach(() => {
		global.chrome.flush();
	});

	it('shouldnt remove or group any tabs', async () => {
		const options = createOptions({});
		handler = createAlarmHandler(options);
		const tabs = [
			{ id: 1, groupId: -1 },
			{ id: 2, groupId: 1 },
			{ id: 3, groupId: 2 },
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
		const tabs = [
			{ id: 1, groupId: -1 },
			{ id: 2, groupId: -1 },
			{ id: 3, groupId: -1 },
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
		const tabs = [
			{ id: 1, groupId: -1 },
			{ id: 2, groupId: -1 },
			{ id: 3, groupId: -1 },
		];
		const groups = [{ id: 1 }];
		tracker.findTabsExceedingThreshold.onCall(0).returns([[], tabs]);
		tracker.findTabsExceedingThreshold.onCall(1).returns([tabs]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await handler.execute();
		sinon.assert.calledWith(pruner.pruneTabs, []);
		sinon.assert.calledWith(grouper.groupTabs, tabs);
	});

	it('should not remove any user grouped tabs', async () => {
		const options = createOptions({});
		handler = createAlarmHandler(options);
		const tabs = [
			{ id: 1, groupId: -1 },
			{ id: 2, groupId: 1 },
			{ id: 3, groupId: 2 },
		];
		const groups = [{ id: 1 }];
		tracker.findTabsExceedingThreshold.returns([tabs, []]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await handler.execute();
		sinon.assert.calledWith(pruner.pruneTabs, [
			{ id: 1, groupId: -1 },
			{ id: 2, groupId: 1 },
		]);
	});

	it('should not remove any user grouped tabs (no existing tab group)', async () => {
		const options = createOptions({});
		handler = createAlarmHandler(options);
		const tabs = [
			{ id: 1, groupId: -1 },
			{ id: 2, groupId: 1 },
			{ id: 3, groupId: 2 },
		];
		const groups = [];
		tracker.findTabsExceedingThreshold.returns([tabs, []]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await handler.execute();
		sinon.assert.calledWith(pruner.pruneTabs, [{ id: 1, groupId: -1 }]);
	});
});

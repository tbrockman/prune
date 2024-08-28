// TODO

import { Features, type PruneConfig } from '~util/config';
import { TabAgeAlarmListener } from '~listeners/tab-age-alarm';
import TabGrouper from '~tab/grouper';
import TabPruner from '~tab/pruner';
import TabTracker from '~tab/tracker';

import { createTab } from '~util/tabs';

import sinon from 'sinon/pkg/sinon-esm';
import type { SinonStubbedInstance } from 'sinon';
import { SyncKeyValues as Options } from '~util/storage';

const chrome = require('sinon-chrome/extensions');

declare var global: any;

describe('alarm handler', () => {
	let alarmListener: TabAgeAlarmListener;
	let tracker: SinonStubbedInstance<TabTracker>;
	let grouper: SinonStubbedInstance<TabGrouper>;
	let pruner: SinonStubbedInstance<TabPruner>;
	let config: PruneConfig = {
		featureSupported() { return true },
	}

	before(() => {
		global.chrome = chrome;
		global.chrome.flush();
	});

	beforeEach(() => {
		chrome.tabs.group = sinon.stub();
		chrome.tabs.query = sinon.stub();
		chrome.tabGroups = {
			query: sinon.stub(),
			update: sinon.stub(),
			move: sinon.stub(),
		};
		chrome.tabs.query.resolves([]);
	})

	const createAlarmListener = (options) => {
		tracker = sinon.createStubInstance(TabTracker);
		grouper = sinon.createStubInstance(TabGrouper);
		pruner = sinon.createStubInstance(TabPruner);
		return new TabAgeAlarmListener({ tracker, grouper, pruner, options, config });
	};

	afterEach(() => {
		config.featureSupported = () => true;
		global.chrome.flush();
	});

	it('shouldnt remove or group any tabs', async () => {
		const options = new Options();
		alarmListener = createAlarmListener(options);
		const tabs: chrome.tabs.Tab[] = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: 1 }),
			createTab({ id: 3, groupId: 2 }),
		];
		const groups = [{ id: 1 }];
		tracker.findTabsExceedingThreshold.returns([[], tabs]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await alarmListener.execute();
		sinon.assert.calledWith(pruner.pruneTabs, []);
	});

	it('should remove but not group tabs', async () => {
		const options = new Options();
		alarmListener = createAlarmListener(options);
		const tabs: chrome.tabs.Tab[] = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: -1 }),
			createTab({ id: 3, groupId: -1 }),
		];
		const groups = [{ id: 1 }];
		tracker.getClosedTabs.withArgs(tabs).resolves([]);
		tracker.findTabsExceedingThreshold.withArgs([], sinon.match.any).returns([[], []]);
		tracker.findTabsExceedingThreshold.withArgs(tabs, alarmListener.pruneThreshold).returns([tabs.slice(0, 1), [tabs[2]]]);
		tracker.findTabsExceedingThreshold.withArgs([tabs[2]], alarmListener.autoGroupThreshold).returns([[], [tabs[2]]]);
		tracker.removeTabs.withArgs([]).resolves();
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await alarmListener.execute();
		sinon.assert.calledWith(pruner.pruneTabs, tabs.slice(0, 1));
		sinon.assert.calledWith(grouper.groupTabs, []);
	});

	it('should group but not remove tabs', async () => {
		const options = new Options();
		alarmListener = createAlarmListener(options);
		const tabs: chrome.tabs.Tab[] = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: -1 }),
			createTab({ id: 3, groupId: -1 }),
		];
		const groups = [{ id: 1 }];

		tracker.getClosedTabs.withArgs(tabs).resolves([]);
		tracker.findTabsExceedingThreshold.withArgs([], sinon.match.any).returns([[], []]);
		tracker.findTabsExceedingThreshold.withArgs(tabs, alarmListener.pruneThreshold).returns([[], tabs]);
		tracker.findTabsExceedingThreshold.withArgs(tabs, alarmListener.autoGroupThreshold).returns([tabs, []]);
		tracker.removeTabs.withArgs([]).resolves();

		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await alarmListener.execute();
		sinon.assert.calledWith(pruner.pruneTabs, []);
		sinon.assert.calledWith(grouper.groupTabs, tabs);
	});

	it('shouldnt call tabgrouper if tab grouping not supported', async () => {
		const options = new Options();
		options['auto-prune'] = false;
		alarmListener = createAlarmListener(options);
		alarmListener.config.featureSupported = (feature) => feature !== Features.TabGroups;
		const tabs = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: -1 }),
			createTab({ id: 3, groupId: -1 }),
		];
		tracker.findTabsExceedingThreshold.returns([tabs, []]);
		await alarmListener.execute()
		sinon.assert.notCalled(pruner.pruneTabs);
		sinon.assert.notCalled(grouper.groupTabs);
		sinon.assert.notCalled(chrome.tabGroups.query);
	})

	it('should not remove any user grouped tabs', async () => {
		const options = new Options();
		alarmListener = createAlarmListener(options);
		const tabs = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: 1 }),
			createTab({ id: 3, groupId: 2 }),
		];
		const groups = [{ id: 1 }];
		tracker.findTabsExceedingThreshold.returns([tabs, []]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await alarmListener.execute();
		sinon.assert.calledWith(pruner.pruneTabs, [
			tabs[0],
			tabs[1],
		]);
	});

	it('should not remove any user grouped tabs (no existing tab group)', async () => {
		const options = new Options();
		alarmListener = createAlarmListener(options);
		const tabs = [
			createTab({ id: 1, groupId: -1 }),
			createTab({ id: 2, groupId: 1 }),
			createTab({ id: 3, groupId: 2 }),
		];
		const groups = [];
		tracker.findTabsExceedingThreshold.returns([tabs, []]);
		chrome.tabs.query.resolves(tabs);
		chrome.tabGroups.query.resolves(groups);
		await alarmListener.execute();
		sinon.assert.calledWith(pruner.pruneTabs, [tabs[0]]);
	});
});

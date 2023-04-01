import { TabGrouper, TabPruner, TabSuspender, TabTracker } from '../tabs';
import { Tab } from '../types';

type TabFocusedHandlerArgs = {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	suspender: TabSuspender;
	options: any;
};

class TabFocusedHandler {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	suspender: TabSuspender;
	options: any;

	constructor({
		tracker,
		grouper,
		pruner,
		suspender,
		options,
	}: TabFocusedHandlerArgs) {
		this.tracker = tracker;
		this.grouper = grouper;
		this.pruner = pruner;
		this.suspender = suspender;
		this.options = options;
	}

	async execute(activeInfo: chrome.tabs.TabActiveInfo) {
		const openTabs = await chrome.tabs.query({});
		console.debug('tab focused open tabs: ', openTabs);
		const tab = await chrome.tabs.get(activeInfo.tabId);
		// TODO: Refactor this, we don't really need the handler to be aware of the suspender specifically
		// Should just use listener pattern
		this.suspender.onTabFocus(tab);

		await this.tracker.init(openTabs);
		await this.tracker.track(tab);
	}
}

export default TabFocusedHandler;

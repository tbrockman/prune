import TabTracker from '~tab/tracker';

type TabFocusedHandlerArgs = {
	tracker: TabTracker;
	options: any;
};

class TabFocusedHandler {
	tracker: TabTracker;
	options: any;

	constructor({
		tracker,
		options,
	}: TabFocusedHandlerArgs) {
		this.tracker = tracker;
		this.options = options;
	}

	async execute(activeInfo: chrome.tabs.TabActiveInfo) {
		const openTabs = await chrome.tabs.query({});
		console.debug('tab focused open tabs: ', openTabs);

		try {
			const tab = await chrome.tabs.get(activeInfo.tabId);
			await this.tracker.init(openTabs);
			await this.tracker.track(tab);
		} catch (e) {
			console.error('error tracking tab', e);
		}
	}
}

export default TabFocusedHandler;

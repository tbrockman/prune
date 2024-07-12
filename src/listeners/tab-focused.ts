import { SyncStorageKeys } from '~enums';
import TabTracker from '~tab/tracker';
import { getSuspendPageRedirectUrl, tabExemptionsApply } from '~tab/util';
import { getSyncStorage, localStorage, syncStorage } from '~util/storage';

type TabFocusedListenerArgs = {
	tracker: TabTracker;
	options: any;
};

export const createListener = () => {
	return async (activeInfo) => {
		console.debug('tab activated listener', activeInfo);
		const tab = await chrome.tabs.get(activeInfo.tabId);

		const options = await getSyncStorage();

		if (tabExemptionsApply(options, tab)) {
			console.debug('exempt page', tab.url);
			return;
		}

		if (options[SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED] && tab.url) {
			const url = getSuspendPageRedirectUrl(tab,
				options[SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS],
				options[SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS])

			if (url) {
				chrome.tabs.update(tab.id, { url })
				return;
			}
		}

		const tracker = new TabTracker({ storage: options[SyncStorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
		const handler = new TabFocusedListener({
			tracker,
			options,
		});
		await handler.execute(tab);
	}
}

export class TabFocusedListener {
	tracker: TabTracker;
	options: any;

	constructor({
		tracker,
		options,
	}: TabFocusedListenerArgs) {
		this.tracker = tracker;
		this.options = options;
	}

	async execute(tab: chrome.tabs.Tab) {
		const openTabs = await chrome.tabs.query({});
		console.debug('tab focused open tabs: ', openTabs);

		try {
			await this.tracker.init(openTabs);
			await this.tracker.track(tab);
		} catch (e) {
			console.error('error tracking tab', e);
		}
	}
}

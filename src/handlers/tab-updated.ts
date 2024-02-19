import { StorageKeys } from '~enums';
import TabDeduplicator from '~tab/tab-deduplicator';
import TabGrouper from '~tab/tab-grouper';
import TabPruner from '~tab/tab-pruner';
import TabTracker from '~tab/tab-tracker';
import type { Options } from '~util';

type TabUpdatedHandlerArgs = {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	deduplicator: TabDeduplicator;
	options: any;
};

class TabUpdatedHandler {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	deduplicator: TabDeduplicator;
	options: Options;

	constructor({
		tracker,
		grouper,
		pruner,
		deduplicator,
		options,
	}: TabUpdatedHandlerArgs) {
		this.tracker = tracker;
		this.grouper = grouper;
		this.pruner = pruner;
		this.deduplicator = deduplicator;
		this.options = options;
	}

	async execute(tab: any) {
		let openTabs = await chrome.tabs.query({});
		let deduplicated = false;

		if (this.options[StorageKeys.AUTO_DEDUPLICATE]) {
			deduplicated = await this.deduplicator.deduplicateTab(
				tab,
				openTabs,
			);
			openTabs = deduplicated
				? openTabs.filter((t) => t.id != tab.id)
				: openTabs;
		}

		await this.tracker.init(openTabs);

		if (deduplicated) return;

		await this.tracker.track(tab);

		if (this.options[StorageKeys.TAB_LRU_ENABLED]) {
			// TODO: this is incorrect if tab deduplicated
			const group = {
				title: this.options[StorageKeys.AUTO_GROUP_NAME],
				color: 'yellow',
				collapsed: true,
			};
			console.debug('open tabs to filter: ', openTabs);
			openTabs = openTabs.filter((tab) => tab.groupId === -1);
			console.debug('open tabs post-filter:', openTabs);
			const size = this.options[StorageKeys.TAB_LRU_SIZE];
			const [open, hidden] = this.tracker.limitNumberOfVisibleTabs(
				openTabs,
				size,
			);

			if (
				this.options[StorageKeys.TAB_LRU_DESTINATION] === 'remove' ||
				process.env.PLASMO_BROWSER == 'firefox' // TODO: kinda hacky
			) {
				await this.pruner.pruneTabs(hidden);
			} else if (
				this.options[StorageKeys.TAB_LRU_DESTINATION] === 'group'
			) {
				await this.grouper.groupTabs(hidden, group);
			}
		}
	}
}

export default TabUpdatedHandler;

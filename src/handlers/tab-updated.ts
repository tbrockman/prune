import { Features, type PruneConfig } from '~config';
import { SyncStorageKeys } from '~enums';
import TabDeduplicator from '~tab/deduplicator';
import TabGrouper from '~tab/grouper';
import TabPruner from '~tab/pruner';
import TabTracker from '~tab/tracker';
import type { Options } from '~util';

type TabUpdatedHandlerArgs = {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	deduplicator: TabDeduplicator;
	options: Options;
	config: PruneConfig;
};

class TabUpdatedHandler {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	deduplicator: TabDeduplicator;
	options: Options;
	config: PruneConfig;

	constructor({
		tracker,
		grouper,
		pruner,
		deduplicator,
		options,
		config
	}: TabUpdatedHandlerArgs) {
		this.tracker = tracker;
		this.grouper = grouper;
		this.pruner = pruner;
		this.deduplicator = deduplicator;
		this.options = options;
		this.config = config;
	}

	async execute(tab: chrome.tabs.Tab) {
		let openTabs = await chrome.tabs.query({});
		let deduplicated = false;

		if (this.options[SyncStorageKeys.AUTO_DEDUPLICATE]) {
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

		// only track active tabs on update (i.e, if we change pages, not just if we reload a session) 
		if (tab.active) {
			await this.tracker.track(tab);
		}

		if (this.options[SyncStorageKeys.TAB_LRU_ENABLED]) {
			const group = {
				title: this.options[SyncStorageKeys.AUTO_GROUP_NAME],
				color: 'yellow',
				collapsed: true,
			};
			console.debug('open tabs to filter: ', openTabs);
			openTabs = openTabs.filter((tab) => tab.groupId === -1);
			console.debug('open tabs post-filter:', openTabs);
			const size = this.options[SyncStorageKeys.TAB_LRU_SIZE];
			const [open, hidden] = this.tracker.limitNumberOfVisibleTabs(
				openTabs,
				size,
			);

			if (
				this.options[SyncStorageKeys.TAB_LRU_DESTINATION] === 'close' ||
				!this.config.featureSupported(Features.TabGroups)
			) {
				await this.pruner.pruneTabs(hidden);
			} else if (
				this.options[SyncStorageKeys.TAB_LRU_DESTINATION] === 'group'
			) {
				await this.grouper.groupTabs(hidden, group);
			}
		}
	}
}

export default TabUpdatedHandler;

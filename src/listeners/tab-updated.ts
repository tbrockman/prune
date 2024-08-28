import { config, Features, type PruneConfig } from '~util/config';
import { SyncStorageKeys } from '~enums';
import TabBookmarker from '~tab/bookmarker';
import TabDeduplicator from '~tab/deduplicator';
import TabGrouper from '~tab/grouper';
import TabPruner from '~tab/pruner';
import TabTracker from '~tab/tracker';
import { getSuspendPageRedirectUrl, tabExemptionsApply } from '~tab/util';
import { getSyncStorage, localStorage, syncStorage, type SyncKeyValues } from '~util/storage';

type TabUpdatedHandlerArgs = {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	deduplicator: TabDeduplicator;
	options: SyncKeyValues;
	config: PruneConfig;
};

export const createListener = (tabLock: Set<number>) => {
	return async (_: number, updatedInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
		console.debug('tab updated', updatedInfo, tab);
		const options = await getSyncStorage();

		// TODO: this method should probably just be initialization, handler should contain any logic
		// TODO: handle when updatedInfo is tab being ungrouped
		if (updatedInfo.status == 'complete' || (updatedInfo.status && updatedInfo.url)) {

			if (tabExemptionsApply(options, tab)) {
				console.debug('exempt page', tab.url);
				return;
			}

			if (options[SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED]) {
				const url = getSuspendPageRedirectUrl(tab,
					options[SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS],
					options[SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS])

				if (url) {
					chrome.tabs.update(tab.id, { url })
					return;
				}
			}

			// TODO: dependency injection?
			const tracker = new TabTracker({ storage: options[SyncStorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
			const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
			const bookmarker = new TabBookmarker(
				options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
				options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
			);
			const pruner = new TabPruner(bookmarker);
			const deduplicator = new TabDeduplicator(
				tabLock,
				config.featureSupported(Features.TabHighlighting),
				options[SyncStorageKeys.AUTO_DEDUPLICATE_CLOSE],
				options[SyncStorageKeys.DEDUPLICATE_ACROSS_CONTAINERS],
			);
			const handler = new TabUpdatedHandler({
				tracker,
				grouper,
				pruner,
				deduplicator,
				options,
				config
			});
			await handler.execute(tab);
		}
	}
}

export class TabUpdatedHandler {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	deduplicator: TabDeduplicator;
	options: SyncKeyValues;
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

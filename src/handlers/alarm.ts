import TabGrouper from '~tab/grouper';
import TabPruner from '~tab/pruner';
import TabTracker from '~tab/tracker';
import { type Tab } from '../types';
import { Features, type PruneConfig } from '~config';
import { StorageKeys } from '~enums';
import type { Options } from '~util';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

type AlarmHandlerArgs = {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	options: Options;
	config: PruneConfig;
};

class AlarmHandler {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	config: PruneConfig;
	autoPrune: boolean;
	pruneThreshold: number;
	autoGroup: boolean;
	autoGroupThreshold: number;
	autoGroupName: string;
	autoBookmark: boolean;

	constructor({
		tracker,
		grouper,
		pruner,
		options,
		config,
	}: AlarmHandlerArgs) {
		this.tracker = tracker;
		this.grouper = grouper;
		this.pruner = pruner;
		this.autoPrune = options[StorageKeys.AUTO_PRUNE];
		this.pruneThreshold = options[StorageKeys.AUTO_PRUNE_THRESHOLD] * ONE_DAY_IN_MS;
		this.autoGroup = options[StorageKeys.AUTO_GROUP];
		this.autoGroupThreshold =
			options[StorageKeys.AUTO_GROUP_THRESHOLD] * ONE_DAY_IN_MS;
		this.autoGroupName = options[StorageKeys.AUTO_GROUP_NAME];
		this.autoBookmark = options[StorageKeys.AUTO_PRUNE_BOOKMARK];
		this.config = config;
	}

	async execute() {
		console.debug('alarm handler executing', this);
		let openTabs = await chrome.tabs.query({});
		let candidates: Tab[] = [];
		await this.tracker.init(openTabs);
		console.debug('open tabs', openTabs);
		const group = {
			title: this.autoGroupName,
			color: 'yellow',
			collapsed: true,
		};

		if (this.autoPrune) {
			console.debug('finding tabs exceeding threshold');
			let result = this.tracker.findTabsExceedingThreshold(
				openTabs,
				this.pruneThreshold,
			);
			candidates = result[0];
			openTabs = result[1];
			const filter = [-1];

			console.debug(
				'before filtering any grouped tabs',
				candidates,
				'unsupported features',
				this.config.unsupportedFeatures,
			);

			if (this.autoGroup && this.config.featureSupported(Features.TabGroups)) {
				const groups = await chrome.tabGroups.query({
					title: group['title'],
				});

				if (groups.length > 0) {
					filter.push(groups[0].id);
				}
			}
			// leave any tabs which have a groupId
			// that isn't our autoGroup alone
			candidates = candidates.filter((tab) =>
				filter.includes(tab.groupId ? tab.groupId : -1),
			);
			console.debug('should be pruning', candidates);
			await this.pruner.pruneTabs(candidates);
		}
		console.debug('remaining tabs', openTabs);

		if (this.autoGroup && this.config.featureSupported(Features.TabGroups)) {
			const [toGroup] = this.tracker.findTabsExceedingThreshold(
				openTabs,
				this.autoGroupThreshold,
			);
			console.debug('should be grouping', toGroup);
			await this.grouper.groupTabs(toGroup, group);
		}
	}
}

export default AlarmHandler;

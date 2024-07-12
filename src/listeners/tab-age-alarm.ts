import TabGrouper from '~tab/grouper';
import TabPruner from '~tab/pruner';
import TabTracker from '~tab/tracker';
import { config, Features, type PruneConfig } from '~config';
import { SyncStorageKeys } from '~enums';
import { tabExemptionsApply } from '~tab/util';
import { getSyncStorage, localStorage, syncStorage, type SyncKeyValues, type SyncStorage } from '~util/storage';
import { TAB_AGE_ALARM_NAME } from '~constants';
import TabBookmarker from '~tab/bookmarker';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

type TabAgeAlarmListenerArgs = {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	options: SyncKeyValues;
	config: PruneConfig;
};

export const createListener = () => {
	return async (alarm: chrome.alarms.Alarm) => {
		console.debug('alarm listener triggered');

		// TODO: clean this up
		if (alarm.name !== TAB_AGE_ALARM_NAME) {
			return;
		}
		const options = await getSyncStorage() as SyncStorage;
		const tracker = new TabTracker({ storage: options[SyncStorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
		const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
		const bookmarker = new TabBookmarker(
			options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
			options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
		);
		const pruner = new TabPruner(bookmarker);
		const handler = new TabAgeAlarmListener({
			tracker,
			grouper,
			pruner,
			options,
			config
		});
		await handler.execute(alarm);
	}
}

export class TabAgeAlarmListener {
	tracker: TabTracker;
	grouper: TabGrouper;
	pruner: TabPruner;
	config: PruneConfig;
	options: SyncKeyValues;
	pruneThreshold: number;
	autoGroupThreshold: number;
	autoGroupName: string;

	constructor({
		tracker,
		grouper,
		pruner,
		options,
		config,
	}: TabAgeAlarmListenerArgs) {
		this.tracker = tracker;
		this.grouper = grouper;
		this.pruner = pruner;
		this.pruneThreshold = options[SyncStorageKeys.AUTO_PRUNE_THRESHOLD] * ONE_DAY_IN_MS;
		this.autoGroupThreshold =
			options[SyncStorageKeys.AUTO_GROUP_THRESHOLD] * ONE_DAY_IN_MS;
		this.autoGroupName = options[SyncStorageKeys.AUTO_GROUP_NAME];
		this.config = config;
		this.options = options;
	}

	async execute(alarm?: chrome.alarms.Alarm) {
		console.debug('alarm handler executing', this, alarm);
		let openTabs = await chrome.tabs.query({});
		console.debug({ openTabs });

		await this.tracker.init(openTabs);

		// remove closed tabs (with some tolerance to allow reusing sessions) from the tracker
		const closed = await this.tracker.getClosedTabs(openTabs);
		console.debug({ closed })
		const threshold = Math.min(this.pruneThreshold, this.autoGroupThreshold, ONE_DAY_IN_MS)
		console.debug({ threshold })
		const [exceeding,] = this.tracker.findTabsExceedingThreshold(
			closed,
			threshold,
		);
		console.debug({ exceeding })
		await this.tracker.removeTabs(exceeding)

		// remove any tabs which are exempt from pruning
		openTabs = openTabs.filter((tab) => !tabExemptionsApply(this.options, tab));

		const group = {
			title: this.autoGroupName,
			color: 'yellow',
			collapsed: true,
		};

		if (this.options[SyncStorageKeys.AUTO_PRUNE]) {
			console.debug('finding tabs exceeding threshold to group', { openTabs, threshold: this.pruneThreshold });
			let result = this.tracker.findTabsExceedingThreshold(
				openTabs,
				this.pruneThreshold,
			);
			console.debug('received result', { result })
			let candidates = result[0];
			openTabs = result[1];
			const filter = [-1];

			console.debug(
				'candidates and features before filtering any grouped tabs',
				{
					candidates,
					unsupportedFeatures: this.config.unsupportedFeatures
				},
			);

			if (this.options['auto-group'] && this.config.featureSupported(Features.TabGroups)) {
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
			console.debug('should be pruning', { candidates });
			await this.pruner.pruneTabs(candidates);
		}
		console.debug('open tabs not being pruned', { openTabs });

		if (this.options['auto-group'] && this.config.featureSupported(Features.TabGroups)) {
			const [toGroup] = this.tracker.findTabsExceedingThreshold(
				openTabs,
				this.autoGroupThreshold,
			);
			console.debug('should be grouping', toGroup);
			await this.grouper.groupTabs(toGroup, group);
		}
	}
}

